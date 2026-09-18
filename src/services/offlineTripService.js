export const offlineTripService = {
  saveOffline: async (itinerary) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Save to localStorage for demo purposes
        localStorage.setItem('yatrax_offline_itinerary', JSON.stringify(itinerary));
        localStorage.setItem('yatrax_offline_ready', 'true');
        resolve(true);
      }, 3000);
    });
  },

  getOfflineItinerary: () => {
    const data = localStorage.getItem('yatrax_offline_itinerary');
    return data ? JSON.parse(data) : null;
  },

  queryAssistant: async (query, tripContext) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = "I don't have information about that offline.";
        const q = query.toLowerCase();
        
        if (q.includes('next')) {
          response = "According to your saved itinerary, your next stop is Sarangkot Sunrise at 05:00 AM.";
        } else if (q.includes('thank you') || q.includes('nepali')) {
          response = "धन्यवाद (Dhanyabad) is how you say thank you in Nepali.";
        } else if (q.includes('lost') || q.includes('emergency')) {
          response = "If you are lost, please activate the SOS feature. Your offline data shows the nearest Tourist Police is available at 1144.";
        } else if (q.includes('itinerary')) {
          response = `You have a ${tripContext?.duration || 'trip'} planned. Day 1 starts with ${tripContext?.days?.[0]?.activities?.[0]?.name || 'your first activity'}.`;
        }

        resolve({
          text: response,
          timestamp: new Date().toISOString(),
          isUser: false
        });
      }, 1000);
    });
  }
};

