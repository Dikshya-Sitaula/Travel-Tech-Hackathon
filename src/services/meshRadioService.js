import { Capacitor } from '@capacitor/core';
import { BleClient } from '@capacitor-community/bluetooth-le';

export const YATRAX_MESH_UUIDS = Object.freeze({
  service: '7a545258-0001-4d45-5348-000000000001',
  outbound: '7a545258-0002-4d45-5348-000000000002',
  acknowledgement: '7a545258-0003-4d45-5348-000000000003',
});

const DEVICE_KEY = 'yatrax_mesh_device';
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const listeners = new Set();
let initialized = false;
let connectedDevice = null;
let lastAcknowledgement = null;
let autoConnecting = false;
let reconnectTimer = null;

const emit = (state) => listeners.forEach((listener) => listener(state));
const snapshot = (overrides = {}) => ({
  supported: Capacitor.isNativePlatform() || Boolean(navigator.bluetooth),
  transport: Capacitor.isNativePlatform() ? 'NATIVE_BLE' : 'WEB_BLUETOOTH',
  status: connectedDevice ? 'CONNECTED' : 'NOT_CONNECTED',
  device: connectedDevice,
  lastAcknowledgement,
  ...overrides,
});

const toDataView = (bytes) => new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
const scheduleNearestReconnect = () => {
  clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => meshRadioService.autoConnectNearest().catch(() => {}), 1200);
};
const decodeAcknowledgement = (value) => {
  const acknowledgement = JSON.parse(textDecoder.decode(new Uint8Array(value.buffer, value.byteOffset, value.byteLength)));
  lastAcknowledgement = acknowledgement;
  emit(snapshot({ status: acknowledgement.status || 'ACKNOWLEDGED' }));
};
const attachRadio = async (device) => {
  await BleClient.connect(device.deviceId, () => {
    connectedDevice = null;
    emit(snapshot({ status: 'DISCONNECTED' }));
    scheduleNearestReconnect();
  });
  connectedDevice = { deviceId: device.deviceId, name: device.name || 'YatraX Mesh Radio' };
  localStorage.setItem(DEVICE_KEY, JSON.stringify(connectedDevice));
  await BleClient.startNotifications(device.deviceId, YATRAX_MESH_UUIDS.service, YATRAX_MESH_UUIDS.acknowledgement, (value) => {
    try { decodeAcknowledgement(value); } catch { emit(snapshot({ status: 'INVALID_RADIO_RESPONSE' })); }
  });
  emit(snapshot());
  return snapshot();
};
const compactPacket = (event) => ({
  v: 1,
  t: 'SOS',
  id: event.eventId,
  d: event.deviceId,
  e: event.emergencyType,
  s: event.severity,
  a: event.latitude,
  o: event.longitude,
  b: event.battery,
  ts: event.timestamp,
});

const waitForAcknowledgement = (eventId, timeout = 15000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    listeners.delete(onState);
    reject(new Error('RADIO_ACK_TIMEOUT'));
  }, timeout);
  const onState = (state) => {
    if (state.lastAcknowledgement?.eventId !== eventId) return;
    clearTimeout(timer);
    listeners.delete(onState);
    resolve(state.lastAcknowledgement);
  };
  listeners.add(onState);
});

export const meshRadioService = {
  getState: () => snapshot(),
  subscribe(listener) {
    listeners.add(listener);
    listener(snapshot());
    return () => listeners.delete(listener);
  },
  async initialize() {
    if (initialized) return snapshot();
    await BleClient.initialize({ androidNeverForLocation: true });
    initialized = true;
    return snapshot();
  },
  async pair() {
    await meshRadioService.initialize();
    if (!(await BleClient.isEnabled())) await BleClient.requestEnable();
    emit(snapshot({ status: 'SCANNING' }));
    const device = await BleClient.requestDevice({ services: [YATRAX_MESH_UUIDS.service], optionalServices: [YATRAX_MESH_UUIDS.service] });
    return attachRadio(device);
  },
  async reconnect() {
    if (connectedDevice) return snapshot();
    let saved;
    try { saved = JSON.parse(localStorage.getItem(DEVICE_KEY) || 'null'); } catch { saved = null; }
    if (!saved?.deviceId) return snapshot();
    await meshRadioService.initialize();
    try {
      await attachRadio(saved);
    } catch {
      connectedDevice = null;
      emit(snapshot({ status: 'RECONNECT_FAILED' }));
    }
    return snapshot();
  },
  async autoConnectNearest({ scanDuration = 6500 } = {}) {
    if (connectedDevice || autoConnecting) return snapshot();
    autoConnecting = true;
    try {
      await meshRadioService.initialize();
      if (!(await BleClient.isEnabled())) return snapshot({ status: 'BLUETOOTH_DISABLED' });
      const candidates = new Map();
      emit(snapshot({ status: 'SCANNING_NEAREST' }));
      await BleClient.requestLEScan({ services: [YATRAX_MESH_UUIDS.service], allowDuplicates: true, allowExtendedAdvertising: true }, (result) => {
        const rssi = Number.isFinite(result.rssi) ? result.rssi : -999;
        const previous = candidates.get(result.device.deviceId);
        if (!previous || rssi > previous.rssi) candidates.set(result.device.deviceId, { ...result.device, rssi });
      });
      await new Promise((resolve) => setTimeout(resolve, scanDuration));
      await BleClient.stopLEScan().catch(() => {});
      const nearest = [...candidates.values()].reduce((best, candidate) => !best || candidate.rssi > best.rssi ? candidate : best, null);
      if (!nearest) return snapshot({ status: 'NO_COMPANION_RADIO_FOUND' });
      const result = await attachRadio(nearest);
      return { ...result, nearestRssi: nearest.rssi };
    } catch (error) {
      await BleClient.stopLEScan().catch(() => {});
      return snapshot({ status: 'AUTO_CONNECT_FAILED', error: error?.message || 'Unable to scan for a companion radio.' });
    } finally {
      autoConnecting = false;
    }
  },
  async disconnect() {
    clearTimeout(reconnectTimer);
    if (connectedDevice?.deviceId) await BleClient.disconnect(connectedDevice.deviceId).catch(() => {});
    connectedDevice = null;
    localStorage.removeItem(DEVICE_KEY);
    emit(snapshot());
    return snapshot();
  },
  async sendSOS(event) {
    if (!connectedDevice?.deviceId) return { success: false, error: 'COMPANION_RADIO_NOT_CONNECTED', simulated: false };
    const bytes = textEncoder.encode(JSON.stringify(compactPacket(event)));
    const mtu = await BleClient.getMtu(connectedDevice.deviceId).catch(() => 185);
    const chunkSize = Math.max(20, Math.min(mtu - 7, 180));
    const total = Math.ceil(bytes.length / chunkSize);
    emit(snapshot({ status: 'TRANSMITTING' }));
    const acknowledgementPromise = waitForAcknowledgement(event.eventId);
    try {
      for (let index = 0; index < total; index += 1) {
        const payload = bytes.slice(index * chunkSize, (index + 1) * chunkSize);
        const frame = new Uint8Array(payload.length + 4);
        frame[0] = 0x59; frame[1] = 0x58; frame[2] = index; frame[3] = total; frame.set(payload, 4);
        await BleClient.write(connectedDevice.deviceId, YATRAX_MESH_UUIDS.service, YATRAX_MESH_UUIDS.outbound, toDataView(frame));
      }
      const acknowledgement = await acknowledgementPromise;
      const success = ['MESH_RELAYED', 'GATEWAY_RECEIVED', 'SERVER_RECEIVED', 'ACKNOWLEDGED'].includes(acknowledgement.status);
      return {
        success,
        error: success ? undefined : acknowledgement.error || 'MESH_DELIVERY_NOT_CONFIRMED',
        gatewayId: acknowledgement.gatewayId || null,
        receivedAt: acknowledgement.receivedAt || new Date().toISOString(),
        signalStrength: acknowledgement.rssi ?? null,
        meshStatus: acknowledgement.status,
        channel: 'LORA_MESH',
        simulated: false,
        packet: compactPacket(event),
      };
    } catch (error) {
      emit(snapshot({ status: 'ERROR', error: error.message }));
      return { success: false, error: error.message || 'BLE_MESH_SEND_FAILED', simulated: false };
    }
  },
};
