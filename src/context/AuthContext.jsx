import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const initialUser = JSON.parse(localStorage.getItem('smartlogixUser')) || null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);

  const login = async ({ username, role }) => {
    const nextUser = {
      name: username,
      role,
      token: `mock-token-${role}`,
    };

    localStorage.setItem('smartlogixUser', JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem('smartlogixUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
