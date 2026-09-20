import { landmarkService } from './landmarkService';
import { offlineTripService } from './offlineTripService';
import { sosService } from './sosService';
import { offlineModelService } from './offlineModelService';

const calculateTotalDays = (startDate, endDate) => {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  const days = Math.floor((end - start) / 86400000) + 1;
  if (!Number.isFinite(days) || days < 1 || days > 30) {
    throw new Error('Choose a valid trip length between 1 and 30 days.');
  }
  return days;
};

/**
 * YatraX Frontend API Service Abstraction Layer
 * All UI components interact through these functions to allow simple future backend integration.
 */

export const registerUser = async (name, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!name || !email || !password) {
        return reject(new Error('Missing required user information.'));
      }
      const existing = JSON.parse(localStorage.getItem('yatrax_registered_users') || '[]');
      const userExists = existing.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return reject(new Error('An account with this email already exists.'));
      }
      
      const newUser = { id: `usr_${Date.now()}`, name, email: email.toLowerCase(), role: 'Traveler' };
      existing.push({ ...newUser, password });
      localStorage.setItem('yatrax_registered_users', JSON.stringify(existing));
      resolve(newUser);
    }, 600);
  });
};

export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        return reject(new Error('Please provide email and password.'));
      }
      const existing = JSON.parse(localStorage.getItem('yatrax_registered_users') || '[]');
      const found = existing.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // Default demo account allowance
      if (!found && email.toLowerCase() === 'dikshya@yatrax.com' && password === 'password123') {
        const demoUser = { id: 'usr_demo', name: 'Dikshya', email: 'dikshya@yatrax.com', role: 'Traveler' };
        localStorage.setItem('yatrax_user', JSON.stringify(demoUser));
        return resolve(demoUser);
      }

      if (!found || found.password !== password) {
        return reject(new Error('Invalid email or password credentials.'));
      }

      const authenticatedUser = { id: found.id, name: found.name, email: found.email, role: found.role || 'Traveler' };
      localStorage.setItem('yatrax_user', JSON.stringify(authenticatedUser));
      resolve(authenticatedUser);
    }, 600);
  });
};

export const generateItinerary = async (preferences = {}) => {
  try {
        const destination = String(preferences.destination || '').trim();
        const startDate = preferences.startDate;
        const endDate = preferences.endDate;
        if (!destination || !startDate || !endDate) throw new Error('Destination and travel dates are required.');
        const totalDays = calculateTotalDays(startDate, endDate);
        const configuredServer = String(localStorage.getItem('yatrax_emergency_server_url') || import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
        const itineraryUrl = `${configuredServer || ''}/api/itinerary`;
        const response = await fetch(itineraryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences: { ...preferences, destination, startDate, endDate }, totalDays }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || 'The AI itinerary service is unavailable. Please try again.');
        if (!Array.isArray(payload.days) || payload.days.length !== totalDays) throw new Error('The AI returned an incomplete itinerary. Please generate it again.');

        const aiDays = payload.days.map((day, dayIndex) => ({
          ...day,
          day: dayIndex + 1,
          activities: day.activities.map((activity, activityIndex) => ({
            ...activity,
            id: `ai-day-${dayIndex + 1}-activity-${activityIndex + 1}`,
          })),
        }));
        const selectedActivities = preferences.selectedActivities || [];

        const tripSummary = {
          destination,
          startDate,
          endDate,
          totalDays,
          totalNights: Math.max(totalDays - 1, 0),
          days: aiDays,
          overview: payload.overview,
          generationSource: payload.provider || 'groq',
          generationModel: payload.model,
          operator: { name: 'Eternal Himalaya', url: 'https://eternalhimalaya.com/' },
          duration: `${totalDays} Days`,
          selectedActivities,
          style: selectedActivities.length > 0
            ? selectedActivities.map((item) => typeof item === 'string' ? item : (item.name || 'Activity')).join(' + ')
            : (preferences.tripStyle || 'AI-planned journey'),
          discovery: Array.isArray(preferences.discoveryPreferences) && preferences.discoveryPreferences.length > 0
            ? preferences.discoveryPreferences.join(', ')
            : 'Balanced discovery',
          pace: preferences.travelPace || 'Balanced',
          social: preferences.socialPreference || 'Just Me',
          insights: {
            reasoning: `AI-generated for ${destination} across ${totalDays} days from the selected dates and journey style.`,
            activityCount: aiDays.reduce((sum, day) => sum + day.activities.length, 0)
          }
        };

        localStorage.setItem('yatrax_trip', JSON.stringify(tripSummary));
        return tripSummary;
  } catch (error) {
    throw new Error(error?.message || 'Itinerary generation failed.');
  }
};

export const sendAssistantMessage = async (query, tripContext, conversation = [], mode = 'offline') => {
  let result;
  if (mode === 'online' || mode === 'groq' || mode === 'gemini') {
    if (!navigator.onLine) throw new Error('You are offline. Switch to the offline model to continue.');
    const configuredServer = String(localStorage.getItem('yatrax_emergency_server_url') || import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
    const response = await fetch(`${configuredServer || ''}/api/gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, tripContext, conversation }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'The online model is unavailable.');
    result = payload;
  } else {
    result = await offlineModelService.ask(query, tripContext, conversation);
  }
  return {
    ...result,
    timestamp: new Date().toISOString(),
    isUser: false,
  };
};

export const checkOfflineModel = () => offlineModelService.healthCheck();

export const analyzeLandmark = async (imageFile) => {
  return landmarkService.identifyLandmark(imageFile);
};

export const activateSOS = async (location) => {
  return sosService.triggerSOS(location);
};
