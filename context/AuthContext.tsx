
import React, { createContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string) => void;
  logout: () => void;
  signup: (email: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => {},
  logout: () => {},
  signup: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  
  // For this simulation, login/signup are the same
  const login = (email: string) => {
    const user: User = { id: new Date().toISOString(), email };
    setCurrentUser(user);
  };
  
  const signup = (email: string) => {
    const user: User = { id: new Date().toISOString(), email };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};