/**
 * onlineLlmService.js
 * -----------------------------------------------------------------------
 * Talks to a CLOUD large language model (e.g. GPT-4o, Gemini 1.5 Pro) for
 * rich itinerary generation, and a vision endpoint for landmark recognition.
 *
 * For hackathon convenience, this ships with a DEMO MODE that fabricates
 * realistic, well-structured responses client-side with zero backend and
 * zero API key required. Flip USE_DEMO_MODE to false and point
 * CLOUD_API_ENDPOINT at your own backend/proxy to go fully live.
 *
 * IMPORTANT: Never put a raw OpenAI/Gemini API key in frontend code.
 * Route real requests through a small server-side proxy that holds the key.
 * -----------------------------------------------------------------------
 */

const USE_DEMO_MODE = true;

// Point this at your own backend proxy, e.g. "https://your-api.example.com"
const CLOUD_API_ENDPOINT = "https://your-backend-proxy.example.com";

/**
 * Generates a detailed multi-day travel itinerary using a cloud LLM.
 *
 * @param {string} destination - e.g. "Kyoto, Japan"
 * @param {number|string} days - trip length in days
 * @param {string} budget - e.g. "budget", "mid-range", "luxury", or a dollar figure
 * @param {string[]|string} preferences - interests, e.g. ["food", "history"] or "food, history"
 * @returns {Promise<{ destination: string, days: number, budget: string, preferences: string[], itinerary: Array<{day:number, title:string, activities:string[], estimatedCost:string}>, tips: string[] }>}
 */
export async function generateComplexItinerary(destination, days, budget, preferences) {
  if (!destination || !destination.trim()) {
    throw new Error("Destination is required.");
  }

  const normalizedPrefs = Array.isArray(preferences)
    ? preferences
    : String(preferences || "")
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

  const numDays = Math.max(1, parseInt(days, 10) || 1);

  if (USE_DEMO_MODE) {
    return simulateItinerary(destination, numDays, budget, normalizedPrefs);
  }

  const systemPrompt = `You are an expert travel planner. Respond ONLY with valid JSON matching this schema:
{
  "destination": string,
  "days": number,
  "budget": string,
  "preferences": string[],
  "itinerary": [ { "day": number, "title": string, "activities": string[], "estimatedCost": string } ],
  "tips": string[]
}
No prose outside the JSON.`;

  const userPrompt = `Plan a ${numDays}-day trip to ${destination}.
Budget level: ${budget || "mid-range"}.
Traveler interests: ${normalizedPrefs.join(", ") || "general sightseeing"}.
Include realistic activities, pacing, and rough per-day cost estimates.`;

  const response = await fetch(`${CLOUD_API_ENDPOINT}/api/itinerary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o", // or "gemini-1.5-pro", swap on your backend as needed
      system: systemPrompt,
      prompt: userPrompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cloud itinerary request failed (${response.status})`);
  }

  const data = await response.json();

  // Expecting your backend to return { text: "<json string>" } or already-parsed JSON
  const raw = typeof data === "string" ? data : data.text ?? data;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

/**
 * Sends a landmark photo to a cloud vision model for recognition.
 *
 * @param {File|Blob} imageFile - the photo to analyze
 * @returns {Promise<{ landmarkName: string, confidence: number, location: string, funFact: string, relatedItineraryIdea: string }>}
 */
export async function recognizeLandmark(imageFile) {
  if (!imageFile) {
    throw new Error("An image file is required.");
  }

  if (USE_DEMO_MODE) {
    return simulateLandmarkRecognition(imageFile);
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${CLOUD_API_ENDPOINT}/api/landmark`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Landmark recognition failed (${response.status})`);
  }

  return response.json();
}

// ---------------------------------------------------------------------
// Demo-mode simulators (no network / no API key needed)
// ---------------------------------------------------------------------

function simulateItinerary(destination, numDays, budget, preferences) {
  const themes =
    preferences.length > 0
      ? preferences
      : ["local culture", "food", "landmarks", "relaxation"];

  const itinerary = Array.from({ length: numDays }, (_, i) => {
    const theme = themes[i % themes.length];
    return {
      day: i + 1,
      title: `Day ${i + 1}: ${capitalize(theme)} focus in ${destination}`,
      activities: [
        `Morning: Explore a top ${theme}-related spot in ${destination}`,
        `Afternoon: Guided walk through a historic district, with time for photos`,
        `Evening: Dinner at a highly-rated local spot themed around ${theme}`,
      ],
      estimatedCost: estimateCostForBudget(budget),
    };
  });

  return delay({
    destination,
    days: numDays,
    budget: budget || "mid-range",
    preferences: themes,
    itinerary,
    tips: [
      `Book major ${destination} attractions a few days ahead to skip lines.`,
      "Keep a downloaded offline map in case of spotty signal.",
      "Carry a mix of cash and card — smaller vendors may be cash-only.",
    ],
  });
}

function simulateLandmarkRecognition(imageFile) {
  const sampleLandmarks = [
    {
      landmarkName: "Boudhanath Stupa",
      location: "Kathmandu, Nepal",
      funFact: "One of the largest spherical stupas in the world, a UNESCO World Heritage Site.",
      relatedItineraryIdea: "Pair with a visit to nearby Pashupatinath Temple.",
    },
    {
      landmarkName: "Eiffel Tower",
      location: "Paris, France",
      funFact: "Completed in 1889, it was the tallest man-made structure for 41 years.",
      relatedItineraryIdea: "Combine with a Seine river cruise at sunset.",
    },
    {
      landmarkName: "Kinkaku-ji (Golden Pavilion)",
      location: "Kyoto, Japan",
      funFact: "Its top two floors are covered in real gold leaf.",
      relatedItineraryIdea: "Visit early morning to avoid crowds, then explore Arashiyama Bamboo Grove.",
    },
  ];

  const pick = sampleLandmarks[Math.floor(Math.random() * sampleLandmarks.length)];

  return delay({
    ...pick,
    confidence: Math.round((0.85 + Math.random() * 0.14) * 100) / 100,
    sourceFileName: imageFile.name || "captured-photo.jpg",
  });
}

function estimateCostForBudget(budget) {
  const b = (budget || "").toLowerCase();
  if (b.includes("lux")) return "$300 - $600";
  if (b.includes("budget") || b.includes("low")) return "$30 - $70";
  if (/^\$?\d+/.test(b)) return `~$${parseInt(b.replace(/\D/g, ""), 10) || 100}`;
  return "$100 - $200";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function delay(value, ms = 900) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
