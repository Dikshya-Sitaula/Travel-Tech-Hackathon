import { mockItinerary } from '../data/mockData';

// Mock service for AI Trip Planner
export const itineraryService = {
  generateItinerary: async (preferences) => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        resolve(mockItinerary);
      }, 4000); 
    });
  },

  getAlternativeActivity: async (activityId, preference) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `alt_${Date.now()}`,
          time: '11:00',
          name: 'Alternative Nature Walk',
          description: 'A quieter path discovered by AI.',
          cost: 'Free',
          travelTime: '1 hour',
          type: 'Nature',
          crowd: 'Very Low',
          difficulty: 'Easy',
          tags: ['Nature', 'Less crowded']
        });
      }, 1500);
    });
  }
};
