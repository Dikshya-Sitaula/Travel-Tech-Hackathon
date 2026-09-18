import { mockItinerary } from '../data/mockData';
import { landmarkService } from './landmarkService';
import { offlineTripService } from './offlineTripService';
import { sosService } from './sosService';

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

export const generateItinerary = async (preferences) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const destination = preferences.destination || 'Pokhara';
      const daysCount = parseInt(preferences.duration || '5') || 5;
      
      const customItinerary = {
        ...mockItinerary,
        destination,
        duration: `${daysCount} Days`,
        budget: preferences.budget || 'Mid-range',
        style: Array.isArray(preferences.style) && preferences.style.length > 0 
          ? preferences.style.join(' + ') 
          : (preferences.style || 'Adventure + Nature'),
        discovery: Array.isArray(preferences.discoveryPreferences) && preferences.discoveryPreferences.length > 0 
          ? preferences.discoveryPreferences.join(', ') 
          : (preferences.discovery || 'Less-crowded'),
        pace: preferences.travelPace || 'Balanced',
        social: preferences.socialPreference || 'Just Me',
        insights: {
          reasoning: `Selected based on your preferences for ${destination}, ${preferences.travelPace || 'Balanced'} pace, and ${preferences.budget || 'Mid-range'} budget.`,
          estimatedCost: preferences.budget === 'Budget' ? 'NPR 15,000 - 25,000' : 'NPR 35,000 - 50,000',
          distance: destination === 'Kathmandu' ? '80 km' : '210 km',
          activityCount: daysCount * 3
        }
      };

      localStorage.setItem('yatrax_trip', JSON.stringify(customItinerary));
      resolve(customItinerary);
    }, 2500);
  });
};

export const sendAssistantMessage = async (query, tripContext) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let text = "I am your YatraX AI Assistant. How can I help you explore Nepal safely?";
      const q = query.toLowerCase();

      if (q.includes('pack')) {
        text = "For Nepal, pack layered clothing (moisture-wicking base layers, fleece, down jacket), sturdy broken-in trekking boots, sunscreen (SPF 50+), UV sunglasses, reusable water bottle with purification tablets, universal adapter, and personal medical supplies.";
      } else if (q.includes('pokhara')) {
        text = "In Pokhara, enjoy sunrise at Sarangkot, boat across Phewa Lake to Tal Barahi Temple, visit the World Peace Pagoda, explore Gupteshwor Cave and Davis Falls, or go paragliding over the Annapurna range!";
      } else if (q.includes('mustang')) {
        text = "The best time to visit Mustang is from September to November (crisp skies) and March to May (spring blossoms). Lower Mustang is accessible by road; Upper Mustang requires a restricted area permit ($500 for 10 days).";
      } else if (q.includes('food')) {
        text = "Must-try Nepalese dishes include: Dal Bhat (lentil soup, rice, & seasonal curry), Momos (steam/fried dumplings with chuttney), Sel Roti (sweet rice dough ring), Samay Baji (Newari feast plate), and Yak Cheese in Himalayan tea houses!";
      } else if (q.includes('trekking') || q.includes('know before')) {
        text = "Before trekking: 1) Always register with TIMS & obtain park permits. 2) Acclimatize carefully above 3,000m to avoid altitude sickness. 3) Stay hydrated with purified water. 4) Pack cash (NPR) as ATMs are unavailable on trails. 5) Keep Emergency SOS accessible in YatraX!";
      } else if (q.includes('hello') || q.includes('hi')) {
        text = "Namaste! 🙏 I'm your YatraX AI travel companion. Ask me anything about itineraries, safety, destinations, or local customs in Nepal.";
      }

      resolve({
        text,
        timestamp: new Date().toISOString(),
        isUser: false
      });
    }, 1000);
  });
};

export const analyzeLandmark = async (imageFile) => {
  return landmarkService.identifyLandmark(imageFile);
};

export const activateSOS = async (location) => {
  return sosService.activateSOS(location);
};
