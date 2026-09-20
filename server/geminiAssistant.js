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

export const handleGeminiAssistant = async (request, response) => {
  if (request.method === 'OPTIONS') return respond(response, 204, {});
  if (request.method !== 'POST') return respond(response, 405, { error: 'Method not allowed.' });
  const keys = getGroqKeys();
  if (!keys.length) return respond(response, 503, { error: 'Online Groq AI is not configured on the YatraX server.' });

  try {
    const { query, tripContext, conversation } = await readJsonBody(request);
    const cleanQuery = String(query || '').trim().slice(0, 2_000);
    if (!cleanQuery) return respond(response, 400, { error: 'A question is required.' });
    const recentConversation = Array.isArray(conversation)
      ? conversation.slice(-10).filter((message) => message?.text).map(({ text, isUser }) => ({ role: isUser ? 'user' : 'assistant', content: String(text).slice(0, 1_200) }))
      : [];
    const model = process.env.GROQ_ASSISTANT_MODEL || 'openai/gpt-oss-20b';
    const messages = [
      { role: 'system', content: 'You are YatraX, a concise Nepal travel and trek-safety assistant. Use the supplied saved itinerary and recent conversation as context, acknowledging relevant destination, dates, activities, pace, or earlier concerns. Never invent missing context. Give practical, cautious guidance. For medical or life-threatening situations, tell the traveler to contact local emergency services and use SOS. Never claim emergency services were contacted. Clearly distinguish general guidance from professional advice.' },
      { role: 'system', content: `Saved traveler itinerary/context:\n${tripContext ? JSON.stringify(tripContext).slice(0, 12_000) : 'No saved itinerary is available.'}` },
      ...recentConversation,
      { role: 'user', content: cleanQuery },
    ];
    const completion = await requestGroqChat({ keys, model, messages, temperature: 0.25, maxCompletionTokens: 1200 });
    return respond(response, 200, { text: completion.content, source: 'groq-model', provider: 'groq', model: completion.model, keySlot: completion.keySlot, providerAttempts: completion.attempts, context: { tripIncluded: Boolean(tripContext), conversationMessages: recentConversation.length } });
  } catch (error) {
    return respond(response, 502, { error: error?.message || 'Online Groq AI is unavailable.' });
  }
};
import { getGroqKeys, requestGroqChat } from './groqClient.js';
