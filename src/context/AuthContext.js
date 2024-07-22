import React, { createContext, useState, useEffect } from 'react';
import axios from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };
    checkUser();
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
