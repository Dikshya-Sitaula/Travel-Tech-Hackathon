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
        localStorage.setItem('yatrax_sos_status', JSON.stringify(status));
        resolve(status);
      }, 1500);
    });
  },
  
  getSOSStatus: () => {
    const data = localStorage.getItem('yatrax_sos_status');
    return data ? JSON.parse(data) : null;
  }
};

