import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardMetrics } from '../features/dashboard/DashboardMetrics';
import { GlassPanel } from '../components/GlassPanel/GlassPanel';

export const DashboardPage = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="dashboard-grid">
        <DashboardMetrics />

        <GlassPanel className="section-panel">
          <div className="section-header">
            <div>
              <h2>Resumen operativo</h2>
              <p>Monitorea el estado de sincronización con el Gateway y visualiza alertas críticas.</p>
            </div>
            <span className="status-pill positive">API Gateway activo</span>
          </div>

          <div className="summary-list">
            <div className="summary-item">
              <strong>Canal centralizado</strong>
              <span>Las peticiones se enrutan por /api/v1</span>
            </div>
            <div className="summary-item">
              <strong>Circuit Breaker</strong>
              <span>Protege la UI ante fallos de Envíos o Inventario</span>
            </div>
            <div className="summary-item">
              <strong>Roles mínimos</strong>
              <span>Acceso diferenciado para inventario, pedidos y envíos</span>
            </div>
          </div>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
};
