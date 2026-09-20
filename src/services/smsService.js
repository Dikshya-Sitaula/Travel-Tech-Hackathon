export const mockSMSService = {
  async sendSOS(_event, scenario) {
    if (scenario !== 'sms-success') return { success: false, error: scenario === 'sms-failure' ? 'SIMULATED_SMS_FAILURE' : 'CELLULAR_UNAVAILABLE', simulated: true };
    return { success: true, messageId: `SMS-${Date.now().toString(36).toUpperCase()}`, channel: 'SMS', receivedAt: new Date().toISOString(), simulated: true };
  },
};

export const backendSMSService = {
  async sendSOS(event) {
    const response = await fetch('/api/sos/sms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) });
    const payload = await response.json().catch(() => ({}));
    return response.ok ? payload : { success: false, error: payload.error || 'SMS_SERVICE_UNAVAILABLE' };
  },
};
