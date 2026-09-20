import { getGroqKeys, requestGroqChat } from './groqClient.js';

const respond = (response, status, body) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.end(JSON.stringify(body));
};

const readJsonBody = (request) => new Promise((resolve, reject) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
    if (body.length > 100_000) reject(new Error('Request is too large.'));
  });
  request.on('end', () => {
    try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON request.')); }
  });
  request.on('error', reject);
});

const extractJson = (text) => {
  const cleaned = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('Groq returned no JSON itinerary.');
  return JSON.parse(cleaned.slice(start, end + 1));
};

const validateItinerary = (itinerary, days) => {
  if (!itinerary?.overview || !Array.isArray(itinerary.days) || itinerary.days.length !== days) {
    throw new Error(`The AI returned an incomplete itinerary instead of ${days} complete days.`);
  }
  for (const [index, day] of itinerary.days.entries()) {
    if (!day?.title || !day?.theme || !Array.isArray(day.activities) || day.activities.length === 0) {
      throw new Error(`The AI returned incomplete information for day ${index + 1}.`);
    }
    for (const activity of day.activities) {
      for (const field of ['name', 'description', 'time', 'travelTime', 'location', 'accommodation', 'meals', 'maxAltitude']) {
        if (!activity?.[field]) throw new Error(`The AI omitted ${field} for day ${index + 1}.`);
      }
    }
  }
};

export const handleGeminiItinerary = async (request, response) => {
  if (request.method === 'OPTIONS') return respond(response, 204, {});
  if (request.method !== 'POST') return respond(response, 405, { error: 'Method not allowed.' });
  const keys = getGroqKeys();
  if (!keys.length) return respond(response, 503, { error: 'Groq itinerary AI is not configured on the YatraX server.' });

  try {
    const { preferences, totalDays } = await readJsonBody(request);
    const safeDays = Math.min(Math.max(Number(totalDays) || 1, 1), 30);
    const destination = String(preferences?.destination || '').trim().slice(0, 100);
    if (!destination) return respond(response, 400, { error: 'A destination is required.' });

    const tripRequest = {
      destination,
      startDate: preferences?.startDate,
      endDate: preferences?.endDate,
      days: safeDays,
      budget: preferences?.budget || 'Mid-range',
      pace: preferences?.travelPace || 'Balanced',
      activities: preferences?.selectedActivities || preferences?.style || ['local highlights'],
      interests: preferences?.interests || [],
      notes: String(preferences?.userNotes || '').slice(0, 500),
    };
    const model = process.env.GROQ_ITINERARY_MODEL || 'openai/gpt-oss-20b';
    const system = `You are a Nepal itinerary specialist. Generate original itinerary content entirely from the traveler request; never use canned or fallback itinerary data.

Return JSON only—no markdown, explanation, or code fence. It must exactly follow this shape:
{"overview":"string","days":[{"day":1,"title":"meaningful route or experience title, never a date or generic Day label","theme":"string","activities":[{"name":"string","description":"string","time":"string","travelTime":"string","location":"string","accommodation":"string","meals":"string","maxAltitude":"string"}]}]}

Produce exactly ${safeDays} geographically sequential days. Give every day at least one activity and every listed field a non-empty string. Respect realistic travel times, acclimatisation and safe altitude gains. Do not invent exact permit prices, guaranteed weather, availability, or emergency assurances.`;
    const user = `Create this itinerary:\n${JSON.stringify(tripRequest)}`;
    // GPT-OSS currently rejects some JSON-mode generations server-side with
    // `failed_generation`. The prompt itself constrains the response to JSON;
    // we then parse and validate it before returning it to the client.
    const completion = await requestGroqChat({ keys, model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.2, maxCompletionTokens: 8192 });
    const itinerary = extractJson(completion.content);
    validateItinerary(itinerary, safeDays);
    return respond(response, 200, { ...itinerary, model: completion.model, provider: 'groq', keySlot: completion.keySlot, providerAttempts: completion.attempts });
  } catch (error) {
    return respond(response, 502, { error: error?.message || 'Unable to generate the Groq itinerary.' });
  }
};
