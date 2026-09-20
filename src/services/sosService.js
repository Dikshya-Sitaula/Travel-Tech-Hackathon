import { gpsService } from './gpsService';
import { mockSMSService } from './smsService';
import { hardwareLoRaService, mockLoRaService } from './loraService';
import { meshRadioService } from './meshRadioService';
import { emergencyApi } from './emergencyApi';

export const SOS_STATES = Object.freeze({ IDLE: 'IDLE', GPS_LOCATING: 'GPS_LOCATING', GPS_READY: 'GPS_READY', SENDING_SERVER: 'SENDING_SERVER', SENDING_SMS: 'SENDING_SMS', SMS_SENT: 'SMS_SENT', SMS_FAILED: 'SMS_FAILED', SENDING_LORA: 'SENDING_LORA', LORA_SENT: 'LORA_SENT', LORA_FAILED: 'LORA_FAILED', QUEUED_OFFLINE: 'QUEUED_OFFLINE', GATEWAY_RECEIVED: 'GATEWAY_RECEIVED', ACKNOWLEDGED: 'ACKNOWLEDGED', RESOLVED: 'RESOLVED', ERROR: 'ERROR' });
const QUEUE_KEY = 'yatrax_sos_queue_v2';
const STATUS_KEY = 'yatrax_sos_status';
const DEVICE_KEY = 'yatrax_device_id';
const DEMO_KEY = 'yatrax_sos_demo_scenario';
const demoModeEnabled = import.meta.env.VITE_SOS_DEMO_MODE !== 'false';
const readJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || '') || fallback; } catch { return fallback; } };
const setStatus = (event) => { localStorage.setItem(STATUS_KEY, JSON.stringify(event)); return event; };
const readStatus = () => {
  const status = readJson(STATUS_KEY, null);
  if (!status) return null;
  if (status.eventId && status.status) return status;
  if (status.dispatchId) return { ...status, eventId: status.dispatchId, status: status.queued ? 'QUEUED_OFFLINE' : 'GATEWAY_RECEIVED', communicationChannel: status.transport === 'lora-mesh' ? 'LORA' : status.queued ? 'DEVICE_QUEUE' : 'INTERNET', locationSource: status.coordinates ? 'LEGACY_GPS' : 'UNAVAILABLE' };
  return null;
};
const getDeviceId = () => { let id = localStorage.getItem(DEVICE_KEY); if (!id) { id = `YX-${Math.floor(1000 + Math.random() * 9000)}`; localStorage.setItem(DEVICE_KEY, id); } return id; };
const makeRandomSuffix = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID().slice(0, 4).toUpperCase();
  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint16Array(2);
    globalThis.crypto.getRandomValues(values);
    return [...values].map((value) => value.toString(16).padStart(4, '0')).join('').slice(0, 4).toUpperCase();
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`.slice(-4).toUpperCase();
};
const makeEventId = () => `SOS-${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}-${makeRandomSuffix()}`;
const batteryLevel = async () => { try { return Math.round((await navigator.getBattery()).level * 100); } catch { return null; } };
const storeQueued = (event) => { const queue = readJson(QUEUE_KEY, []); if (!queue.some(({ eventId }) => eventId === event.eventId)) queue.push(event); localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); return setStatus(event); };
const persistPending = (event) => { const queue = readJson(QUEUE_KEY, []); const index = queue.findIndex(({ eventId }) => eventId === event.eventId); if (index >= 0) queue[index] = event; else queue.push(event); localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); };
const removeQueued = (eventId) => {
  const remaining = readJson(QUEUE_KEY, []).filter((event) => event.eventId !== eventId);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
};

const postEvent = (event) => emergencyApi.create(event);
const sendThroughLoRa = async (event, scenario) => {
  if (meshRadioService.getState().status === 'CONNECTED') return hardwareLoRaService.sendSOS(event);
  return demoModeEnabled
    ? mockLoRaService.sendSOS(event, scenario)
    : hardwareLoRaService.sendSOS(event);
};

export const sosService = {
  getSOSStatus: readStatus,
  getQueue: () => readJson(QUEUE_KEY, []),
  getDemoScenario: () => localStorage.getItem(DEMO_KEY) || 'mesh-proxy',
  setDemoScenario: (scenario) => localStorage.setItem(DEMO_KEY, scenario),
  getServerUrl: () => emergencyApi.getServerUrl(),
  setServerUrl: (url) => emergencyApi.setServerUrl(url),
  checkServer: () => emergencyApi.health(),
  clearStatus: () => localStorage.removeItem(STATUS_KEY),
  getConnectivity() {
    const scenario = sosService.getDemoScenario();
    const radio = meshRadioService.getState();
    return { internet: navigator.onLine, cellular: ['sms-success', 'sms-failure'].includes(scenario) ? 'SIMULATED' : 'UNKNOWN', lora: radio.status === 'CONNECTED' ? 'BLE_RADIO_CONNECTED' : ['lora-success', 'gateway-received'].includes(scenario) ? 'SIMULATED_READY' : 'NOT_CONNECTED', radio };
  },
  async triggerSOS(input, onState = () => {}) {
    if (!input.emergencyType || !input.severity) throw new Error('Emergency type and severity are required.');
    onState(SOS_STATES.GPS_LOCATING);
    let location;
    try { location = await gpsService.getCurrentLocation(); } catch (error) { location = { latitude: null, longitude: null, accuracy: null, timestamp: new Date().toISOString(), locationSource: 'UNAVAILABLE', gpsError: error.message }; }
    onState(SOS_STATES.GPS_READY);
    const event = { eventId: makeEventId(), deviceId: getDeviceId(), emergencyType: input.emergencyType.toUpperCase().replace(/\s+/g, '_'), severity: input.severity.toUpperCase(), details: String(input.details || '').slice(0, 2000), latitude: location.latitude, longitude: location.longitude, accuracy: location.accuracy, locationSource: location.locationSource, battery: await batteryLevel(), timestamp: new Date().toISOString(), lastItineraryStop: input.lastItineraryStop || 'Unknown', communicationChannel: 'NONE', status: SOS_STATES.GPS_READY, gatewayId: null, simulated: import.meta.env.DEV, auditTrail: [{ state: SOS_STATES.GPS_LOCATING, timestamp: new Date().toISOString() }, { state: SOS_STATES.GPS_READY, timestamp: new Date().toISOString() }] };
    const transition = (state, extra = {}) => { Object.assign(event, extra, { status: state }); event.auditTrail.push({ state, timestamp: new Date().toISOString() }); onState(state); setStatus(event); };
    // SafeTrails-inspired offline-first rule: persist before attempting any transport.
    persistPending(event);
    const scenario = demoModeEnabled ? sosService.getDemoScenario() : 'production';
    const forceDemoTransport = demoModeEnabled && ['sms-success', 'sms-failure', 'lora-success', 'lora-failure', 'no-connectivity', 'gateway-received', 'mesh-proxy'].includes(scenario);
    if (navigator.onLine && !forceDemoTransport) {
      try {
        transition(SOS_STATES.SENDING_SERVER, { communicationChannel: 'INTERNET', simulated: false });
        const receivedAt = new Date().toISOString();
        const serverEvent = { ...event, status: SOS_STATES.GATEWAY_RECEIVED, receivedAt, auditTrail: [...event.auditTrail, { state: SOS_STATES.GATEWAY_RECEIVED, timestamp: receivedAt }] };
        const saved = await postEvent(serverEvent);
        onState(SOS_STATES.GATEWAY_RECEIVED);
        removeQueued(event.eventId);
        return setStatus(saved);
      } catch (error) {
        event.serverError = error.message;
      }
    }
    transition(SOS_STATES.SENDING_SMS);
    const sms = demoModeEnabled ? await mockSMSService.sendSOS(event, scenario) : { success: false, error: 'NATIVE_SMS_INTEGRATION_REQUIRED' };
    if (sms.success) {
      transition(SOS_STATES.SMS_SENT, { communicationChannel: 'SMS', messageId: sms.messageId, simulated: sms.simulated });
      try { const saved = await postEvent(event); removeQueued(event.eventId); return setStatus(saved); } catch { /* preserve event and try LoRa */ }
    } else transition(SOS_STATES.SMS_FAILED, { smsError: sms.error });
    transition(SOS_STATES.SENDING_LORA);
    const lora = await sendThroughLoRa(event, scenario);
    if (lora.success) {
      transition(SOS_STATES.LORA_SENT, { communicationChannel: lora.proxy ? 'MESH_PROXY_DEMO' : 'LORA_MESH', gatewayId: lora.gatewayId, signalStrength: lora.signalStrength, loraPacket: lora.packet, meshStatus: lora.meshStatus, simulated: lora.simulated, proxy: Boolean(lora.proxy) });
      transition(SOS_STATES.GATEWAY_RECEIVED, { receivedAt: lora.receivedAt });
      try { const saved = await postEvent(event); removeQueued(event.eventId); return setStatus(saved); } catch { /* queue below */ }
    } else transition(SOS_STATES.LORA_FAILED, { loraError: lora.error });
    transition(SOS_STATES.QUEUED_OFFLINE, { communicationChannel: 'DEVICE_QUEUE', queued: true });
    return storeQueued(event);
  },
  async retryQueue() {
    if (!navigator.onLine) return sosService.getQueue();
    const queued = sosService.getQueue();
    if (!queued.length) return [];
    const result = await emergencyApi.createBatch(queued.map((event) => ({ ...event, communicationChannel: 'INTERNET_RETRY', status: SOS_STATES.GATEWAY_RECEIVED, queued: false })));
    const accepted = new Set(result.acceptedEventIds || []);
    const remaining = queued.filter(({ eventId }) => !accepted.has(eventId));
    if (accepted.size) setStatus({ ...queued.find(({ eventId }) => accepted.has(eventId)), status: SOS_STATES.GATEWAY_RECEIVED, communicationChannel: 'INTERNET_RETRY', queued: false, logged: true });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    return remaining;
  },
  async retryLatest(onState = () => {}) {
    const event = readStatus();
    if (!event?.eventId || event.status !== SOS_STATES.QUEUED_OFFLINE) throw new Error('No queued SOS event is available to retry.');
    const transition = (state, extra = {}) => {
      Object.assign(event, extra, { status: state });
      event.auditTrail = Array.isArray(event.auditTrail) ? event.auditTrail : [];
      event.auditTrail.push({ state, timestamp: new Date().toISOString() });
      onState(state);
      setStatus(event);
    };
    const scenario = demoModeEnabled ? sosService.getDemoScenario() : 'production';
    transition(SOS_STATES.SENDING_SMS, { queued: false });
    const sms = demoModeEnabled ? await mockSMSService.sendSOS(event, scenario) : { success: false, error: 'NATIVE_SMS_INTEGRATION_REQUIRED' };
    if (sms.success) {
      transition(SOS_STATES.SMS_SENT, { communicationChannel: 'SMS', messageId: sms.messageId, simulated: sms.simulated });
      const saved = await postEvent(event);
      removeQueued(event.eventId);
      return setStatus(saved);
    }
    transition(SOS_STATES.SMS_FAILED, { smsError: sms.error });
    transition(SOS_STATES.SENDING_LORA);
    const lora = await sendThroughLoRa(event, scenario);
    if (lora.success) {
      transition(SOS_STATES.LORA_SENT, { communicationChannel: lora.proxy ? 'MESH_PROXY_DEMO' : 'LORA_MESH', gatewayId: lora.gatewayId, signalStrength: lora.signalStrength, loraPacket: lora.packet, meshStatus: lora.meshStatus, simulated: lora.simulated, proxy: Boolean(lora.proxy) });
      transition(SOS_STATES.GATEWAY_RECEIVED, { receivedAt: lora.receivedAt });
      const saved = await postEvent(event);
      removeQueued(event.eventId);
      return setStatus(saved);
    }
    transition(SOS_STATES.LORA_FAILED, { loraError: lora.error });
    transition(SOS_STATES.QUEUED_OFFLINE, { communicationChannel: 'DEVICE_QUEUE', queued: true });
    return storeQueued(event);
  },
};
