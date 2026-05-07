import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { GlassPanel } from '../components/GlassPanel/GlassPanel';
import { useApi } from '../hooks/useApi';
import { apiGateway } from '../services/apiGateway';

export const OrdersPage = () => {
  const { data, loading, error, retry } = useApi(() => apiGateway.call('/orders/lifecycle'), []);

  return (
    <DashboardLayout title="Pedidos">
      <GlassPanel className="section-panel">
        <div className="section-header">
          <div>
            <h2>Gestión del ciclo de vida</h2>
            <p>Controla validación, aprobación y trazabilidad de órdenes.</p>
          </div>
          <span className="status-pill positive">Flujo operacional</span>
        </div>

        {loading && <div className="status-message">Cargando pedidos...</div>}
        {error && (
          <div className="status-message error">
            <p>{error}</p>
            <button className="secondary-button" onClick={retry}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Cliente</th>
                  <th>Etapa</th>
                  <th>ETA</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.stage}</td>
                    <td>{order.eta}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </DashboardLayout>
  );
};
