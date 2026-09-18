import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock check for existing session
    const storedUser = localStorage.getItem('treksafe_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { id: 1, name: 'Dikshya', email, role: 'Traveler' };
        setUser(mockUser);
        localStorage.setItem('treksafe_user', JSON.stringify(mockUser));
        resolve(mockUser);
      }, 800);
    });
  };

  const signup = async (name, email, password) => {
    // Mock signup API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { id: 2, name, email, role: 'Traveler' };
        setUser(mockUser);
        localStorage.setItem('treksafe_user', JSON.stringify(mockUser));
        resolve(mockUser);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('treksafe_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
