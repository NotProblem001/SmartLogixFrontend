import React, { useState, useEffect } from 'react';
import ShippingService from '../../services/ShippingService';
import './ShippingDashboard.css';

const ShippingDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fallbackMsg, setFallbackMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setFallbackMsg(null);
      const data = await ShippingService.getShipments();
      
      if (data && data.status === 'FALLBACK') {
        setFallbackMsg(data.message);
        setShipments([]);
      } else {
        setShipments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error en fetchShipments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const orderId = window.prompt("ID del pedido a enviar:", "101");
      if (!orderId) return;
      
      const newShipment = {
        orderId: parseInt(orderId),
        carrier: "FedEx",
        status: "DISPATCHED"
      };
      await ShippingService.createShipment(newShipment);
      await fetchShipments();
    } catch (err) {
      console.error("Error creando envío", err);
    }
  };

  const handleEdit = async (id, currentStatus) => {
    const newStatus = window.prompt("Actualizar estado del envío:", currentStatus);
    if (newStatus) {
      try {
        await ShippingService.updateShipment(id, { status: newStatus });
        await fetchShipments();
      } catch (err) {
        console.error("Error actualizando envío", err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Cancelar envío #${id}?`)) return;
    try {
      await ShippingService.deleteShipment(id);
      await fetchShipments();
    } catch (err) {
      console.error("Error eliminando envío", err);
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

  const filteredShipments = shipments.filter(s => 
    s.id.toString().includes(searchTerm) || 
    (s.carrier && s.carrier.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.status && s.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="shipping-dashboard glass-panel">
      <div className="dashboard-header">
        <h2>Panel de Logística y Envíos</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Buscar envío..." 
            className="filter-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-primary" onClick={handleCreate}>
            + Nuevo Envío
          </button>
          <button className="btn-secondary" onClick={fetchShipments}>
            ↻ Actualizar
          </button>
        </div>
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

      {!fallbackMsg && filteredShipments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🚚</div>
          <h3>Sin resultados</h3>
          <p>No se encontraron envíos con esos criterios.</p>
        </div>
      ) : (
        <div className="shipping-list">
          {filteredShipments.map((shipment) => (
             <div key={shipment.id} className="shipment-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Envío #{shipment.id} (Pedido #{shipment.orderId})</strong>
                 <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Carrier: {shipment.carrier}</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <span className={`status-badge status-${shipment.status.toLowerCase()}`}>{shipment.status}</span>
                 <button className="btn-action edit" onClick={() => handleEdit(shipment.id, shipment.status)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✏️</button>
                 <button className="btn-action delete" onClick={() => handleDelete(shipment.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShippingDashboard;
