import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { sendSOSAlert } from './sosSmsNotifier.js';

const LOG_FILE = resolve(process.cwd(), 'data', 'sos-signals.jsonl');
const respond = (response, status, body) => { response.statusCode = status; response.setHeader('Content-Type', 'application/json'); response.setHeader('Access-Control-Allow-Origin', '*'); response.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-YatraX-Gateway-Token'); response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS'); response.end(status === 204 ? '' : JSON.stringify(body)); };
const readJsonBody = (request) => new Promise((resolveBody, reject) => { let body = ''; request.on('data', (chunk) => { body += chunk; if (body.length > 100000) reject(new Error('Request is too large.')); }); request.on('end', () => { try { resolveBody(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON request.')); } }); request.on('error', reject); });
const readInboundMessage = (request) => new Promise((resolveBody, reject) => { let body = ''; request.on('data', (chunk) => { body += chunk; if (body.length > 100000) reject(new Error('Request is too large.')); }); request.on('end', () => { const fields = new URLSearchParams(body); resolveBody({ message: fields.get('Body') || '', from: fields.get('From') || '' }); }); request.on('error', reject); });
const appendRecord = async (record) => { await mkdir(resolve(process.cwd(), 'data'), { recursive: true }); await appendFile(LOG_FILE, `${JSON.stringify(record)}\n`, 'utf8'); };
const readRecords = async () => { const contents = await readFile(LOG_FILE, 'utf8').catch((error) => error.code === 'ENOENT' ? '' : Promise.reject(error)); return contents.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line)); };
const normalizeStatus = (status) => String(status || 'GATEWAY_RECEIVED').toUpperCase();

const listEvents = async () => {
  const eventMap = new Map();
  for (const record of await readRecords()) {
    const id = record.eventId || record.dispatchId;
    if (!id) continue;
    if (record.eventType === 'status-update') {
      const event = eventMap.get(id);
      if (event) { event.status = normalizeStatus(record.status); event.assignedTo = record.assignedTo; event.statusNote = record.note; event.statusUpdatedAt = record.timestamp; event.timeline.push(record); }
    } else {
      eventMap.set(id, { ...record, eventId: id, dispatchId: id, status: normalizeStatus(record.status || 'GATEWAY_RECEIVED'), timeline: Array.isArray(record.auditTrail) ? record.auditTrail : [] });
    }
  }
  return [...eventMap.values()].reverse();
};

const validateEvent = (payload) => {
  if (!payload.eventId && !payload.dispatchId) return 'An event ID is required.';
  if (!payload.emergencyType && !payload.incidentType) return 'An emergency type is required.';
  if (!payload.severity) return 'Severity is required.';
  return null;
};

const createEvent = async (payload, overrides = {}) => {
  const error = validateEvent(payload);
  if (error) return { error };
  const eventId = String(payload.eventId || payload.dispatchId || `SOS-${randomUUID().slice(0, 8).toUpperCase()}`).slice(0, 100);
  const existing = (await listEvents()).find((event) => event.eventId === eventId);
  if (existing) return { event: existing, duplicate: true };
  const receivedAt = new Date().toISOString();
  const latitude = Number(payload.latitude ?? payload.coordinates?.latitude);
  const longitude = Number(payload.longitude ?? payload.coordinates?.longitude);
  const record = {
    eventId, dispatchId: eventId, deviceId: String(payload.deviceId || 'unknown-device').slice(0, 100),
    emergencyType: String(payload.emergencyType || payload.incidentType).toUpperCase(), incidentType: String(payload.emergencyType || payload.incidentType).replaceAll('_', ' '),
    severity: String(payload.severity).toUpperCase(), details: String(payload.details || payload.notes || '').slice(0, 2000), notes: String(payload.details || payload.notes || '').slice(0, 2000),
    latitude: Number.isFinite(latitude) ? latitude : null, longitude: Number.isFinite(longitude) ? longitude : null, accuracy: Number(payload.accuracy ?? payload.coordinates?.accuracy) || null,
    coordinates: Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude, accuracy: Number(payload.accuracy ?? payload.coordinates?.accuracy) || null } : null,
    location: Number.isFinite(latitude) && Number.isFinite(longitude) ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` : String(payload.location || 'Location unavailable'),
    locationSource: String(payload.locationSource || 'UNKNOWN'), battery: Number.isFinite(Number(payload.battery)) ? Number(payload.battery) : null,
    timestamp: String(payload.timestamp || receivedAt), createdAt: String(payload.timestamp || receivedAt), receivedAt,
    lastItineraryStop: String(payload.lastItineraryStop || 'Unknown').slice(0, 250), communicationChannel: String(payload.communicationChannel || 'INTERNET').toUpperCase(),
    transport: String(payload.communicationChannel || '').toUpperCase() === 'LORA' ? 'lora-mesh' : 'internet', gatewayId: payload.gatewayId ? String(payload.gatewayId).slice(0, 100) : null,
    status: normalizeStatus(payload.status || 'GATEWAY_RECEIVED'), simulated: Boolean(payload.simulated), messageId: payload.messageId || null, signalStrength: payload.signalStrength ?? null,
    auditTrail: Array.isArray(payload.auditTrail) ? payload.auditTrail.slice(0, 30) : [], ...overrides,
  };
  record.notification = await sendSOSAlert(record);
  await appendRecord(record);
  return { event: record, duplicate: false };
};

const resolveFromDoneReply = async ({ message, from }) => {
  const match = String(message || '').trim().match(/^DONE(?:\s+(SOS-[A-Z0-9-]+))?\s*$/i);
  if (!match) return { error: 'Reply must be DONE followed by the SOS event ID.' };
  const events = await listEvents();
  const eventId = match[1] || events.find((event) => event.status !== 'RESOLVED')?.eventId;
  if (!eventId) return { error: 'No pending SOS event was found.' };
  const event = events.find((item) => item.eventId === eventId);
  if (!event) return { error: 'SOS event not found.' };
  if (event.status === 'RESOLVED') return { event, duplicate: true };
  const update = { eventType: 'status-update', eventId, dispatchId: eventId, status: 'RESOLVED', assignedTo: 'SMS DONE confirmation', note: `DONE reply received from ${String(from || 'configured responder').slice(0, 40)}`, timestamp: new Date().toISOString() };
  await appendRecord(update);
  return { event: { ...event, ...update }, duplicate: false };
};

export const handleSOSLog = async (request, response) => {
  try {
    const path = new URL(request.url, 'http://localhost').pathname.replace(/\/+$/, '') || '/';
    if (request.method === 'OPTIONS') return respond(response, 204, {});
    if (request.method === 'GET' && path === '/health') return respond(response, 200, { ok: true, service: 'yatrax-emergency', timestamp: new Date().toISOString() });
    if (request.method === 'GET') {
      const events = await listEvents();
      const match = path.match(/^\/([^/]+)$/);
      if (match && match[1] !== 'active') {
        const event = events.find(({ eventId }) => eventId === decodeURIComponent(match[1]));
        return event ? respond(response, 200, event) : respond(response, 404, { error: 'SOS event not found.' });
      }
      const signals = path === '/active' ? events.filter(({ status }) => !['RESOLVED'].includes(status)) : events.slice(0, 100);
      const critical = signals.filter(({ severity, status }) => severity === 'CRITICAL' && status !== 'RESOLVED').length;
      return respond(response, 200, { signals, total: signals.length, critical, lastReceivedAt: signals[0]?.receivedAt || null });
    }
    if (request.method === 'POST' && path === '/batch') {
      const payload = await readJsonBody(request);
      if (!Array.isArray(payload.events) || payload.events.length > 50) return respond(response, 400, { error: 'events must be an array of at most 50 SOS events.' });
      const acceptedEventIds = [];
      const errors = [];
      for (const event of payload.events) {
        const result = await createEvent(event);
        if (result.error) errors.push({ eventId: event?.eventId || null, error: result.error });
        else acceptedEventIds.push(result.event.eventId);
      }
      return respond(response, errors.length ? 207 : 200, { accepted: acceptedEventIds.length, acceptedEventIds, errors });
    }
    if (request.method === 'POST' && path === '/sms') return respond(response, 501, { success: false, error: 'REAL_SMS_PROVIDER_NOT_CONFIGURED', mockedInDevelopment: true });
    if (request.method === 'POST' && path === '/lora') return respond(response, 503, { success: false, error: 'COMPANION_RADIO_NOT_CONNECTED', hardwareReady: true });
    if (request.method === 'POST' && path === '/sms/inbound') {
      const result = await resolveFromDoneReply(await readInboundMessage(request));
      if (result.error) return respond(response, 400, result);
      return respond(response, 200, { accepted: true, duplicate: result.duplicate, eventId: result.event.eventId, status: 'RESOLVED' });
    }
    if (request.method === 'POST') {
      const result = await createEvent(await readJsonBody(request));
      if (result.error) return respond(response, 400, result);
      return respond(response, result.duplicate ? 200 : 201, { logged: true, duplicate: result.duplicate, eventId: result.event.eventId, dispatchId: result.event.eventId, receivedAt: result.event.receivedAt, status: result.event.status });
    }
    if (request.method === 'PATCH') {
      const payload = await readJsonBody(request);
      const pathMatch = path.match(/^\/([^/]+)\/(acknowledge|resolve)$/);
      const eventId = decodeURIComponent(pathMatch?.[1] || payload.eventId || payload.dispatchId || '');
      const status = pathMatch?.[2] === 'acknowledge' ? 'ACKNOWLEDGED' : pathMatch?.[2] === 'resolve' ? 'RESOLVED' : normalizeStatus(payload.status);
      if (!eventId || !['ACKNOWLEDGED', 'RESPONDING', 'RESOLVED', 'NEW'].includes(status)) return respond(response, 400, { error: 'A valid event ID and status are required.' });
      if (!(await listEvents()).some((event) => event.eventId === eventId)) return respond(response, 404, { error: 'SOS event not found.' });
      const update = { eventType: 'status-update', eventId, dispatchId: eventId, status, assignedTo: String(payload.assignedTo || 'YatraX Operations').slice(0, 100), note: String(payload.note || '').slice(0, 500), timestamp: new Date().toISOString() };
      await appendRecord(update);
      return respond(response, 200, update);
    }
    return respond(response, 405, { error: 'Method not allowed.' });
  } catch (error) { return respond(response, 500, { error: error?.message || 'Unable to process SOS event.' }); }
};

export const handleSOSGateway = async (request, response) => {
  if (request.method !== 'POST') return respond(response, 405, { error: 'Method not allowed.' });
  try {
    if (process.env.LORA_GATEWAY_TOKEN && request.headers['x-yatrax-gateway-token'] !== process.env.LORA_GATEWAY_TOKEN) return respond(response, 401, { error: 'Invalid LoRa gateway token.' });
    const payload = await readJsonBody(request);
    if (!payload.gatewayId || !payload.eventId || payload.type !== 'SOS') return respond(response, 400, { error: 'gatewayId, eventId and SOS packet type are required.' });
    const result = await createEvent({ ...payload, latitude: payload.latitude ?? payload.lat, longitude: payload.longitude ?? payload.lon, emergencyType: payload.emergencyType || 'OTHER_EMERGENCY', details: payload.details || 'Compact LoRa SOS packet received.', communicationChannel: 'LORA', status: 'GATEWAY_RECEIVED', locationSource: payload.locationSource || 'RADIO_PACKET' }, { gatewayId: String(payload.gatewayId).slice(0, 100), communicationChannel: 'LORA', transport: 'lora-mesh', status: 'GATEWAY_RECEIVED' });
    if (result.error) return respond(response, 400, result);
    return respond(response, result.duplicate ? 200 : 201, { accepted: true, duplicate: result.duplicate, eventId: result.event.eventId, status: result.event.status, receivedAt: result.event.receivedAt });
  } catch (error) { return respond(response, 500, { error: error?.message || 'Unable to ingest gateway packet.' }); }
};
