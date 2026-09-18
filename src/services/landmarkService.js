export const landmarkService = {
  identifyLandmark: async (imageFile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: 'Swayambhunath Stupa',
          confidence: 94,
          location: 'Kathmandu, Nepal',
          description: 'Also known as the Monkey Temple, this ancient religious architecture sits atop a hill in the Kathmandu Valley.',
          history: 'Founded by the great-grandfather of King Mānadeva (464-505 CE), King Vṛsadeva, about the beginning of the 5th century CE.',
          bestTime: 'Early morning or late afternoon',
          entryFee: 'NPR 200 for SAARC nationals, NPR 500 for others',
          nearby: ['Kathmandu Durbar Square', 'Thamel', 'National Museum'],
          imageUrl: 'mock' // We won't actually upload
        });
      }, 2500);
    });
  }
};

export const sosService = {
  activateSOS: async (location) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isOnline = navigator.onLine;
        const status = {
          activated: true,
          queued: !isOnline,
          timestamp: new Date().toISOString(),
          location
        };
        localStorage.setItem('treksafe_sos_status', JSON.stringify(status));
        resolve(status);
      }, 1500);
    });
  },
  
  getSOSStatus: () => {
    const data = localStorage.getItem('treksafe_sos_status');
    return data ? JSON.parse(data) : null;
  }
};
