import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { GlassPanel } from '../components/GlassPanel/GlassPanel';
import { useApi } from '../hooks/useApi';
import OrderService from '../services/OrderService';

export const OrdersPage = () => {
  const { data, loading, error, retry } = useApi(() => OrderService.getAllOrders(), []);

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
                  <th>Etapa / Producto</th>
                  <th>ETA</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((order) => {
                  const orderId = order.id;
                  const client = order.customerId || order.customer || 'N/A';
                  const stageOrSku = order.sku ? `${order.sku} (Cant: ${order.quantity})` : (order.stage || 'N/A');
                  const eta = order.eta || 'Automático';
                  const status = order.status || 'N/A';
                  return (
                    <tr key={orderId}>
                      <td>{orderId}</td>
                      <td>{client}</td>
                      <td>{stageOrSku}</td>
                      <td>{eta}</td>
                      <td>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </DashboardLayout>
  );
};
