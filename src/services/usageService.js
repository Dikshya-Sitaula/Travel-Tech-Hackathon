const requestJson = async (url, options) => {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || 'Unable to update plan usage.');
    error.code = payload.code;
    error.usage = payload;
    throw error;
  }
  return payload;
};

export const usageService = {
  getUsage: (userId) => requestJson(serverApiUrl(`/api/usage?userId=${encodeURIComponent(userId)}`)),
  consume: (userId, feature) => requestJson(serverApiUrl('/api/usage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, feature }),
  }),
  getRevenue: () => requestJson(serverApiUrl('/api/revenue')),
};
import { serverApiUrl } from './serverUrl';
