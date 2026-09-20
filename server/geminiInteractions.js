export const GEMINI_INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';

export const resolveGeminiModel = (configuredModel) => {
  const model = String(configuredModel || '').replace(/^models\//, '').trim();
  return !model || model === 'gemini-2.5-flash' ? 'gemini-3.6-flash' : model;
};

export const extractInteractionText = (payload) => {
  if (typeof payload?.output_text === 'string') return payload.output_text.trim();
  return (payload?.steps || [])
    .filter((step) => step.type === 'model_output')
    .flatMap((step) => Array.isArray(step.content) ? step.content : [step.content])
    .filter((content) => content?.type === 'text' && content.text)
    .map((content) => content.text)
    .join('')
    .trim();
};
