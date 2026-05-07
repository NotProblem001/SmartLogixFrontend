import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { GlassPanel } from '../components/GlassPanel/GlassPanel';
import { useApi } from '../hooks/useApi';
import { apiGateway } from '../services/apiGateway';
import { TrackingPanel } from '../components/TrackingPanel/TrackingPanel';

export const ShippingPage = () => {
  const { data, loading, error, retry } = useApi(() => apiGateway.call('/shipping/tracking'), []);

  return (
    <DashboardLayout title="Envíos">
      <GlassPanel className="section-panel">
        <div className="section-header">
          <div>
            <h2>Seguimiento de transportistas</h2>
            <p>Panel consolidado con estados de DHL y actualizaciones por webhook.</p>
          </div>
          <span className="status-pill warning">Monitoreo en tiempo real</span>
        </div>

        {loading && <div className="status-message">Cargando estados de envío...</div>}
        {error && (
          <div className="status-message error">
            <p>{error}</p>
            <button className="secondary-button" onClick={retry}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && <TrackingPanel shipments={data} />}
      </GlassPanel>
    </DashboardLayout>
  );
};
