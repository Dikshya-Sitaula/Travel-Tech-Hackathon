const LAST_LOCATION_KEY = 'yatrax_last_known_location';

const readLastKnown = () => {
  try { return JSON.parse(localStorage.getItem(LAST_LOCATION_KEY) || 'null'); } catch { return null; }
};

export const gpsService = {
  getLastKnownLocation: readLastKnown,
  getCurrentLocation: ({ timeout = 8000 } = {}) => new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(safetyTimer);
      callback(value);
    };
    const useFallback = (message) => {
      const lastKnown = readLastKnown();
      if (lastKnown) return finish(resolve, { ...lastKnown, locationSource: 'LAST_KNOWN', gpsError: message });
      return finish(reject, new Error(message));
    };
    // Some Android WebViews never invoke the Geolocation timeout callback.
    // Keep SOS moving safely, with the location source shown honestly in the UI.
    const safetyTimer = setTimeout(() => useFallback('GPS timed out and no live location is available.'), timeout + 1000);
    if (!navigator.geolocation) {
      return useFallback('GPS is not supported on this device.');
    }
    navigator.geolocation.getCurrentPosition(({ coords, timestamp }) => {
      const location = { latitude: coords.latitude, longitude: coords.longitude, accuracy: Math.round(coords.accuracy), timestamp: new Date(timestamp || Date.now()).toISOString(), locationSource: 'LIVE_GPS' };
      localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(location));
      finish(resolve, location);
    }, (error) => {
      const lastKnown = readLastKnown();
      if (lastKnown) return finish(resolve, { ...lastKnown, locationSource: 'LAST_KNOWN', gpsError: error.message });
      finish(reject, new Error(error.code === 1 ? 'GPS permission denied and no last known location is available.' : 'GPS unavailable and no last known location is available.'));
    }, { enableHighAccuracy: true, timeout, maximumAge: 30000 });
  }),
};
