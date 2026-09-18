import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('yatrax_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('yatrax_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const authenticatedUser = await apiLoginUser(email, password);
    setUser(authenticatedUser);
    localStorage.setItem('yatrax_user', JSON.stringify(authenticatedUser));
    return authenticatedUser;
  };

  const signup = async (name, email, password) => {
    const newUser = await apiRegisterUser(name, email, password);
    // Do not auto log in on signup if redirecting to login, but we can set session or prepare login
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yatrax_user');
    localStorage.removeItem('yatrax_auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
