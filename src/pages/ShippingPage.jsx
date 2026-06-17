import React, { useState } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { GlassPanel } from '../components/GlassPanel/GlassPanel';
import { useApi } from '../hooks/useApi';
import ShippingService from '../services/ShippingService';
import { TrackingPanel } from '../components/TrackingPanel/TrackingPanel';
import { OfflineDeliveryPanel } from '../components/OfflineDeliveryPanel/OfflineDeliveryPanel';
import ShipmentForm from '../components/Forms/ShipmentForm';
import Skeleton from '../components/Skeleton/Skeleton';

export const ShippingPage = () => {
  const { data, loading, error, retry } = useApi(() => ShippingService.getShipments(), []);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <DashboardLayout title="Envíos">
      <GlassPanel className="section-panel">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Seguimiento de transportistas</h2>
            <p>Panel consolidado con estados de envíos y actualizaciones.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className="status-pill warning">Monitoreo en tiempo real</span>
            <button className="btn-primary" onClick={() => setIsFormOpen(true)}>
              + Nuevo Despacho
            </button>
          </div>
        </div>

        {loading && (
          <div className="status-message" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton type="title" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              <Skeleton type="card" count={3} />
            </div>
          </div>
        )}
        
        {error && (
          <div className="status-message error" style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⚠️</span>
            <h3>Servicio Temporalmente Inactivo</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              El microservicio de envíos no está respondiendo en este momento. El Circuit Breaker ha interceptado la conexión para proteger la plataforma.
            </p>
            <button className="secondary-button" onClick={retry} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>↻</span> Reintentar Conexión
            </button>
          </div>
        )}

        {!loading && !error && <TrackingPanel shipments={data} />}
      </GlassPanel>

      <OfflineDeliveryPanel />

      <ShipmentForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={retry} 
      />
    </DashboardLayout>
  );
};

