import React, { createContext, useContext, useState, useEffect } from 'react';
import './NetworkBoundary.css';

// Contexto para manejar el estado global de red
const NetworkContext = createContext();

export const useNetwork = () => useContext(NetworkContext);

export const NetworkBoundary = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);

  // Exponer método para forzar estado offline desde el interceptor de Axios
  const handleNetworkError = () => {
    setIsOffline(true);
  };

  const handleRetry = () => {
    setIsOffline(false);
    window.location.reload();
  };

  useEffect(() => {
    // Interceptar eventos personalizados disparados por api.js
    const handleCustomError = () => handleNetworkError();
    window.addEventListener('backend_offline', handleCustomError);
    
    return () => {
      window.removeEventListener('backend_offline', handleCustomError);
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isOffline, handleNetworkError }}>
      {isOffline ? (
        <div className="offline-overlay">
          <div className="offline-glass-panel">
            <div className="pulse-ring"></div>
            <div className="offline-icon">⚠️</div>
            <h2>Sistema Desconectado</h2>
            <p>No se pudo establecer comunicación con el servidor central.</p>
            <p className="offline-subtext">Asegúrate de que el backend (Spring Cloud Gateway) esté encendido y funcionando.</p>
            <button className="retry-btn" onClick={handleRetry}>
              Reintentar Conexión
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </NetworkContext.Provider>
  );
};
