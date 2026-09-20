const normalizePhone = (value) => String(value || '').replace(/\s+/g, '');

export const sendSOSAlert = async (event) => {
  const to = normalizePhone(process.env.SOS_ALERT_PHONE);
  const accountSid = String(process.env.TWILIO_ACCOUNT_SID || '').trim();
  const authToken = String(process.env.TWILIO_AUTH_TOKEN || '').trim();
  const from = normalizePhone(process.env.TWILIO_FROM_NUMBER);

  if (!to || !accountSid || !authToken || !from) {
    return { status: 'NOT_CONFIGURED', delivered: false, destinationConfigured: Boolean(to) };
  }

  const location = Number.isFinite(event.latitude) && Number.isFinite(event.longitude)
    ? `https://www.openstreetmap.org/?mlat=${event.latitude}&mlon=${event.longitude}#map=16/${event.latitude}/${event.longitude}`
    : 'Location unavailable';
  const body = `[YatraX SOS] ${event.severity} ${event.emergencyType}\nEvent: ${event.eventId}\n${event.details || 'No details supplied.'}\nLocation: ${location}\nReply: DONE ${event.eventId} when resolved.`;
  const form = new URLSearchParams({ To: to, From: from, Body: body });

  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`, {
      method: 'POST',
      headers: { Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return { status: 'FAILED', delivered: false, error: payload.message || `SMS provider returned ${response.status}` };
    return { status: 'SENT', delivered: true, provider: 'twilio', messageId: payload.sid || null, sentAt: new Date().toISOString() };
  } catch (error) {
    return { status: 'FAILED', delivered: false, error: error?.message || 'SMS provider could not be reached.' };
  }
};
