const OLLAMA_BASE_URL = (import.meta.env.VITE_OLLAMA_URL || '/ollama').replace(/\/$/, '');
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'gemma-offline';

const SAFETY_SYSTEM_PROMPT = `You are Wayfinder Nepal, an offline emergency and travel-safety informant.
Answer only questions about Nepal safety, emergencies, treks, tours, permits, packing, local customs, and the traveler's saved itinerary.
Be calm, direct, practical, and concise. For urgent danger, put the immediate action first.
For altitude symptoms: stop ascending, stay with a companion, and descend with assistance if symptoms are severe or do not improve. Confusion, inability to walk, breathlessness at rest, blue lips, or unconsciousness require immediate descent and rescue/medical help.
When passing yaks, dzos, or mules, stand on the mountain side, never the valley side.
Never claim to contact emergency services. Nepal Tourist Police: 1144. Police: 100. Ambulance: 102. Give only information you know and say when current local confirmation is needed.`;

const NEPAL_TRAVEL_TERMS = /nepal|trek|tour|trail|mountain|altitude|ams|headache|vomit|dizzy|breath|everest|annapurna|langtang|mustang|pokhara|kathmandu|chitwan|lumbini|permit|tims|acap|sagarmatha|pack|gear|weather|season|food|hotel|teahouse|transport|flight|lukla|safety|emergency|rescue|lost|police|ambulance|yak|mule|dzo|culture|temple|stupa|itinerary|route|guide|porter|insurance|helicopter|visa|hello|hi|namaste|help/i;
const SEVERE_ALTITUDE_TERMS = /confus|cannot walk|can't walk|unable to walk|walk straight|loss of coordination|breathless(?:ness)? at rest|blue lips|unconscious|passed out|faint(?:ed|ing)?|severe.*(?:headache|vomit)|vomit.*severe/i;
const ALTITUDE_CONTEXT = /altitude|ams|mountain|trek|meters|metres|\bm\b|elevation|high camp/i;
const TRAIL_ANIMAL_TERMS = /yak|mule|dzo/i;

const enforceSafetyProtocol = (query, tripContext) => {
  if (TRAIL_ANIMAL_TERMS.test(query)) {
    return 'Move to the mountain or upper cliff side of the trail and stop. Never wait on the valley side. Give the yak, dzo, or mule train plenty of space, stay quiet, and follow the handler’s directions.';
  }
  if (ALTITUDE_CONTEXT.test(query) && SEVERE_ALTITUDE_TERMS.test(query)) {
    return 'This is an altitude emergency. Stop ascending and descend immediately with assistance. Do not walk alone. Keep the person warm, alert rescue or medical help, and use supplemental oxygen only if available and you know how to use it. Confusion, loss of coordination, inability to walk, breathlessness at rest, blue lips, or unconsciousness can be life-threatening. Rest and hydration do not replace descent or medical care.';
  }
  if (/permit|tims|acap|sagarmatha|restricted area/i.test(query)) {
    const destination = String(tripContext?.destination || '').toLowerCase();
    if (/everest|khumbu|lukla/.test(`${destination} ${query}`)) {
      return 'For the Everest region, plan for the Sagarmatha National Park entry permit and the Khumbu Pasang Lhamu Rural Municipality entry permit. Requirements involving guides or TIMS can change, so confirm the current rule with the Nepal Tourism Board, the permit office, or a registered trekking agency before departure. Carry your passport details and keep paper or offline copies of every permit.';
    }
    if (/annapurna|poon hill|ghorepani|abc/.test(`${destination} ${query}`)) {
      return 'For the Annapurna region, plan for the Annapurna Conservation Area Permit (ACAP) and confirm the current TIMS or guide requirements before departure. Obtain permits only through official offices or a registered trekking agency, and keep paper or offline copies with your passport details.';
    }
    if (/upper mustang/.test(`${destination} ${query}`)) {
      return 'Upper Mustang is a restricted area and requires a restricted-area permit arranged through a registered trekking agency, along with applicable conservation-area documentation. Rules, minimum group arrangements, and fees can change, so confirm them with the Department of Immigration or a registered operator before booking.';
    }
    return 'Permit requirements depend on the exact route. Confirm the current conservation-area, national-park, restricted-area, TIMS, and guide rules with the Nepal Tourism Board, the relevant permit office, or a registered trekking agency. Carry passport details and keep offline copies of issued permits.';
  }
  return null;
};

const isTravelConversation = (query, conversation) => {
  if (NEPAL_TRAVEL_TERMS.test(query)) return true;
  return conversation
    .filter((message) => message.isUser)
    .slice(-2)
    .some((message) => NEPAL_TRAVEL_TERMS.test(message.text || ''));
};

const cleanModelText = (text) => text
  .replace(/```[a-z]*\n?/gi, '')
  .replace(/```/g, '')
  .replace(/^#{1,6}\s+/gm, '')
  .replace(/\*\*/g, '')
  .replace(/^\s*[-*]\s+/gm, '')
  .trim();

const fallbackReply = (query, tripContext) => {
  const text = query.toLowerCase();
  if (/altitude|ams|headache|dizzy|vomit|breath/.test(text)) {
    return 'Stop ascending now and stay with a companion. Rest and monitor symptoms. If symptoms are severe, worsening, or include confusion, loss of coordination, inability to walk, breathlessness at rest, blue lips, or unconsciousness, descend immediately with assistance and seek rescue or medical help. Hydration does not replace descent.';
  }
  if (/lost|missing|emergency|help|rescue/.test(text)) {
    return 'Move away from immediate hazards, stay with your group, conserve battery, and share your precise location with a trusted contact or guide. Nepal Tourist Police: 1144, Police: 100, Ambulance: 102. If you have no signal, remain visible and sheltered unless staying creates greater danger.';
  }
  if (/yak|mule|dzo|animal/.test(text)) {
    return 'When a yak, dzo, or mule train approaches, step to the mountain or upper cliff side of the trail and wait. Never stand on the valley side. Keep quiet, give the animals space, and follow the handler’s directions.';
  }
  if (/pack|gear|equipment/.test(text)) {
    return 'Carry warm layers, waterproof outerwear, broken-in boots, sun protection, a headlamp, water purification, a power bank, cash, personal medicines, permits, and insurance details. For high-altitude treks, add gloves, a warm hat, and an emergency layer.';
  }
  if (/permit|tims|acap|sagarmatha/.test(text)) {
    return 'Permit requirements depend on the route. Annapurna commonly requires ACAP and applicable TIMS arrangements; Everest routes require Sagarmatha National Park and local municipality permits. Confirm current rules with the official permit office or a registered guide before departure.';
  }
  if (tripContext?.destination) {
    return `Your saved journey is for ${tripContext.destination}. I can help with route safety, packing, altitude, permits, emergencies, and the day-by-day plan. The local model is currently unavailable, so this response uses the built-in offline safety guide.`;
  }
  return 'I can help with Nepal trek and tour safety, altitude, packing, permits, route preparation, and emergency steps. The local model is currently unavailable, so this response uses the built-in offline safety guide.';
};

const buildContext = (tripContext) => {
  if (!tripContext) return 'No saved itinerary is available.';
  const days = Array.isArray(tripContext.days)
    ? tripContext.days.slice(0, 14).map((day) => `Day ${day.day}: ${day.title}`).join('; ')
    : '';
  return `Saved trip: ${tripContext.destination || 'Nepal'}; ${tripContext.duration || ''}; budget ${tripContext.budget || 'not set'}. ${days}`;
};

export const offlineModelService = {
  modelName: OLLAMA_MODEL,

  async healthCheck() {
    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: AbortSignal.timeout(2500) });
      if (!response.ok) return false;
      const data = await response.json();
      return Array.isArray(data.models) && data.models.some(({ name }) => name === OLLAMA_MODEL || name.startsWith(`${OLLAMA_MODEL}:`));
    } catch {
      return false;
    }
  },

  async ask(query, tripContext, conversation = []) {
    const safetyProtocol = enforceSafetyProtocol(query, tripContext);
    if (safetyProtocol) {
      return { text: safetyProtocol, source: 'verified-safety-protocol' };
    }

    if (!isTravelConversation(query, conversation)) {
      return {
        text: 'I can only help with Nepal travel, trekking, tours, and emergency safety while offline. Ask me about routes, altitude, permits, packing, local customs, or your saved itinerary.',
        source: 'scope-guard',
      };
    }

    const recentMessages = conversation.slice(-6).map((message) => ({
      role: message.isUser ? 'user' : 'assistant',
      content: message.text,
    }));

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          stream: false,
          messages: [
            { role: 'system', content: `${SAFETY_SYSTEM_PROMPT}\n\n${buildContext(tripContext)}` },
            ...recentMessages,
            { role: 'user', content: query },
          ],
          options: { temperature: 0.2, num_ctx: 2048 },
        }),
        signal: AbortSignal.timeout(45000),
      });

      if (!response.ok) throw new Error(`Local model returned ${response.status}`);
      const data = await response.json();
      const answer = cleanModelText(data?.message?.content || '');
      if (!answer) throw new Error('Local model returned an empty response');
      return { text: answer, source: 'local-model', model: OLLAMA_MODEL };
    } catch (error) {
      return { text: fallbackReply(query, tripContext), source: 'safety-fallback', error: error.message };
    }
  },
};
