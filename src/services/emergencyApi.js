const SERVER_KEY = 'yatrax_emergency_server_url';

const normalizeServerUrl = (value) => String(value || '').trim().replace(/\/+$/, '');

const getConfiguredServer = () => {
  const runtime = normalizeServerUrl(localStorage.getItem(SERVER_KEY));
  return runtime || normalizeServerUrl(import.meta.env.VITE_EMERGENCY_SERVER_URL);
};

const apiUrl = (path = '') => {
  const server = getConfiguredServer();
  const apiRoot = server
    ? `${server}${server.endsWith('/api/sos') ? '' : '/api/sos'}`
    : '/api/sos';
  return `${apiRoot}${path}`;
};

const readPayload = async (response) => response.json().catch(() => ({}));

export const emergencyApi = {
  getServerUrl: getConfiguredServer,
  setServerUrl(value) {
    const normalized = normalizeServerUrl(value);
    if (normalized) localStorage.setItem(SERVER_KEY, normalized);
    else localStorage.removeItem(SERVER_KEY);
    return normalized;
  },
  async health() {
    const response = await fetch(apiUrl('/health'), { signal: AbortSignal.timeout(5000) });
    const payload = await readPayload(response);
    if (!response.ok) throw new Error(payload.error || 'Emergency server is unreachable.');
    return payload;
  },
  async create(event) {
    const response = await fetch(apiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    const payload = await readPayload(response);
    if (!response.ok) throw new Error(payload.error || 'Emergency server did not accept the event.');
    return { ...event, ...payload, logged: true };
  },
  async createBatch(events) {
    const response = await fetch(apiUrl('/batch'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    });
    const payload = await readPayload(response);
    if (!response.ok) throw new Error(payload.error || 'Emergency server did not accept the queued events.');
    return payload;
  },
  async listActive() {
    const response = await fetch(apiUrl('/active'));
    const payload = await readPayload(response);
    if (!response.ok) throw new Error(payload.error || 'Unable to load active emergencies.');
    return payload;
  },
  async updateStatus(eventId, action, assignedTo = 'YatraX Emergency Center') {
    const response = await fetch(apiUrl(`/${encodeURIComponent(eventId)}/${action}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedTo }),
    });
    const payload = await readPayload(response);
    if (!response.ok) throw new Error(payload.error || 'Unable to update the emergency.');
    return payload;
  },
  async recordDemoDone(eventId) {
    const response = await fetch(apiUrl('/sms/inbound'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ Body: `DONE ${eventId}`, From: 'YATRAX-DEMO-OPERATOR' }),
    });
    const payload = await readPayload(response);
    if (!response.ok) throw new Error(payload.error || 'Unable to record the DONE reply.');
    return payload;
  },
};
