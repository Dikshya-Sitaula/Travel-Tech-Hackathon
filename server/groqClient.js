const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';
const ROTATABLE_STATUSES = new Set([401, 403, 429, 498, 500, 502, 503, 504]);

export const getGroqKeys = () => String(process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '')
  .split(/[\s,;]+/)
  .map((key) => key.trim())
  .filter(Boolean);

export const requestGroqChat = async ({ keys, model, messages, temperature = 0.3, maxCompletionTokens = 1200, responseFormat }) => {
  const attempts = [];
  for (const [index, key] of keys.entries()) {
    let apiResponse;
    try {
      apiResponse = await fetch(GROQ_CHAT_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, temperature, max_completion_tokens: maxCompletionTokens, ...(responseFormat ? { response_format: responseFormat } : {}) }),
      });
    } catch (error) {
      attempts.push({ slot: index + 1, status: 'NETWORK_ERROR' });
      if (index < keys.length - 1) continue;
      throw new Error(`Groq could not be reached after ${attempts.length} provider attempt(s): ${error.message}`);
    }

    const payload = await apiResponse.json().catch(() => ({}));
    if (apiResponse.ok) {
      const content = payload?.choices?.[0]?.message?.content;
      if (!content) throw new Error('Groq returned an empty response.');
      return { content, model: payload.model || model, keySlot: index + 1, attempts: attempts.length + 1 };
    }

    attempts.push({ slot: index + 1, status: apiResponse.status });
    if (ROTATABLE_STATUSES.has(apiResponse.status) && index < keys.length - 1) continue;
    const message = payload?.error?.message || `Groq request failed with HTTP ${apiResponse.status}.`;
    throw new Error(`${message} (${attempts.length} provider attempt${attempts.length === 1 ? '' : 's'}.)`);
  }
  throw new Error('No Groq API key could complete the request.');
};
