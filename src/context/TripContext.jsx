import React, { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
    const savedTrip = localStorage.getItem('yatrax_trip');
    if (savedTrip) {
      try {
        setCurrentTrip(JSON.parse(savedTrip));
      } catch (e) {
        localStorage.removeItem('yatrax_trip');
      }
    }
    const offlineStatus = localStorage.getItem('yatrax_offline_ready');
    if (offlineStatus === 'true') {
      setIsOfflineReady(true);
    }
  }, []);

  const saveTrip = (tripData) => {
    setCurrentTrip(tripData);
    localStorage.setItem('yatrax_trip', JSON.stringify(tripData));
  };

  const clearTrip = () => {
    setCurrentTrip(null);
    localStorage.removeItem('yatrax_trip');
    localStorage.removeItem('yatrax_offline_ready');
    setIsOfflineReady(false);
  };

  const markOfflineReady = () => {
    setIsOfflineReady(true);
    localStorage.setItem('yatrax_offline_ready', 'true');
  };

  return (
    <TripContext.Provider value={{ 
      currentTrip, 
      saveTrip, 
      clearTrip, 
      preferences, 
      setPreferences,
      isOfflineReady,
      markOfflineReady
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
