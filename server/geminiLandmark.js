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
    if (body.length > 12_000_000) reject(new Error('Image is too large. Use an image under 8 MB.'));
  });
  request.on('end', () => {
    try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON request.')); }
  });
  request.on('error', reject);
});

const landmarkSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' }, confidence: { type: 'integer' }, location: { type: 'string' },
    description: { type: 'string' }, history: { type: 'string' }, bestTime: { type: 'string' },
    entryFee: { type: 'string' }, nearby: { type: 'array', items: { type: 'string' } },
  },
  required: ['name', 'confidence', 'location', 'description', 'history', 'bestTime', 'entryFee', 'nearby'],
};

export const handleGeminiLandmark = async (request, response) => {
  if (request.method === 'OPTIONS') return respond(response, 204, {});
  if (request.method !== 'POST') return respond(response, 405, { error: 'Method not allowed.' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return respond(response, 503, { error: 'Online AI is not configured on the YatraX laptop server. Add a valid GEMINI_API_KEY to the laptop .env.local file, then restart the demo server.' });
  try {
    const { imageData, mimeType } = await readJsonBody(request);
    if (!String(mimeType || '').startsWith('image/') || !imageData) return respond(response, 400, { error: 'A valid image is required.' });
    const model = resolveGeminiModel(process.env.GEMINI_VISION_MODEL);
    const apiResponse = await fetch(GEMINI_INTERACTIONS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        model,
        store: false,
        input: [
          { type: 'image', mime_type: mimeType, data: imageData },
          { type: 'text', text: 'Identify the landmark in this image. Focus on Nepal, but do not force a Nepalese match. If uncertain, say Unknown landmark and lower confidence. Give concise, cautious visitor information. Entry fees change frequently, so state that the current fee should be verified rather than inventing one.' },
        ],
        generation_config: { temperature: 0.2, max_output_tokens: 1200 },
        response_format: { type: 'text', mime_type: 'application/json', schema: landmarkSchema },
      }),
    });
    const payload = await apiResponse.json();
    if (!apiResponse.ok) return respond(response, apiResponse.status, { error: payload?.error?.message || 'Gemini landmark request failed.' });
    const output = extractInteractionText(payload);
    const landmark = JSON.parse(output || '{}');
    if (!landmark.name || !landmark.description) throw new Error('Gemini could not identify this landmark. Try a clearer photo.');
    return respond(response, 200, { ...landmark, confidence: Math.min(Math.max(Number(landmark.confidence) || 0, 0), 100), model });
  } catch (error) {
    return respond(response, 500, { error: error?.message || 'Unable to analyze the landmark with Gemini.' });
  }
};
import { extractInteractionText, GEMINI_INTERACTIONS_URL, resolveGeminiModel } from './geminiInteractions.js';
