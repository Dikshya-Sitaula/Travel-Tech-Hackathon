import React, { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
    const savedTrip = localStorage.getItem('treksafe_trip');
    if (savedTrip) {
      setCurrentTrip(JSON.parse(savedTrip));
    }
    const offlineStatus = localStorage.getItem('treksafe_offline_ready');
    if (offlineStatus === 'true') {
      setIsOfflineReady(true);
    }
  }, []);

  const saveTrip = (tripData) => {
    setCurrentTrip(tripData);
    localStorage.setItem('treksafe_trip', JSON.stringify(tripData));
  };

  const clearTrip = () => {
    setCurrentTrip(null);
    localStorage.removeItem('treksafe_trip');
    localStorage.removeItem('treksafe_offline_ready');
    setIsOfflineReady(false);
  };

  const markOfflineReady = () => {
    setIsOfflineReady(true);
    localStorage.setItem('treksafe_offline_ready', 'true');
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
