import React, { useState, useEffect } from 'react';
import ShippingService from '../../services/ShippingService';
import './ShippingDashboard.css';

const ShippingDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fallbackMsg, setFallbackMsg] = useState(null);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setFallbackMsg(null);
      const data = await ShippingService.getShipments();
      
      // Si el BFF devuelve la respuesta de Fallback (Circuit Breaker)
      if (data && data.status === 'FALLBACK') {
        setFallbackMsg(data.message);
        setShipments([]);
      } else {
        // En caso de que haya una lista real
        setShipments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      // Los errores ERR_NETWORK los ataja NetworkBoundary
      console.error('Error en fetchShipments', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Consultando estado de los envíos...</p>
      </div>
    );
  }

  return (
    <div className="shipping-dashboard glass-panel">
      <div className="dashboard-header">
        <h2>Panel de Logística y Envíos</h2>
        <button className="btn-secondary" onClick={fetchShipments}>
          ↻ Actualizar
        </button>
      </div>

      {fallbackMsg && (
        <div className="fallback-alert">
          <div className="fallback-icon">🌩️</div>
          <div className="fallback-content">
            <h4>Servicio Degradado (Circuit Breaker Activo)</h4>
            <p>{fallbackMsg}</p>
          </div>
        </div>
      )}

      {!fallbackMsg && shipments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚚</div>
          <h3>Sin envíos en curso</h3>
          <p>No se registran despachos actualmente.</p>
        </div>
      ) : (
        <div className="shipping-list">
          {shipments.map((shipment) => (
             <div key={shipment.id} className="shipment-row">
               <span>Envío #{shipment.id}</span>
               <span>{shipment.status}</span>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShippingDashboard;
