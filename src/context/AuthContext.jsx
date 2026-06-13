import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const initialUser = JSON.parse(localStorage.getItem('smartlogixUser')) || null;

// Helper to base64url encode an object
function base64url(source) {
  const stringified = JSON.stringify(source);
  const bytes = new TextEncoder().encode(stringified);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const encoded = btoa(binary);
  return encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// Helper to generate a valid HS256 JWT signed with the default secret using Web Crypto API
async function generateJWT(username, role) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: username,
    name: username,
    role: role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
  };

  const headerEncoded = base64url(header);
  const payloadEncoded = base64url(payload);
  const data = `${headerEncoded}.${payloadEncoded}`;

  const secret = 'defaultsecretkeyplaceholderformicros32chars';
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataData = encoder.encode(data);

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    dataData
  );

  const signatureArray = new Uint8Array(signature);
  let binary = '';
  for (let i = 0; i < signatureArray.byteLength; i++) {
    binary += String.fromCharCode(signatureArray[i]);
  }
  const signatureEncoded = btoa(binary)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signatureEncoded}`;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);

  const login = async ({ username, role }) => {
    let token;
    try {
      token = await generateJWT(username, role);
    } catch (e) {
      console.error('Error al generar JWT firmado, usando fallback plano:', e);
      token = `mock-token-${role}`;
    }

    const nextUser = {
      name: username,
      role,
      token,
    };

    localStorage.setItem('smartlogixUser', JSON.stringify(nextUser));
    localStorage.setItem('jwt_token', token);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem('smartlogixUser');
    localStorage.removeItem('jwt_token');
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
