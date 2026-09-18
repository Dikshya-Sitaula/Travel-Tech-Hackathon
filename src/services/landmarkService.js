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

