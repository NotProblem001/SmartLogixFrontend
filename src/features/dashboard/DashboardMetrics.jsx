import React from 'react';
import { MetricCard } from '../../components/MetricCard/MetricCard';
import { GlassPanel } from '../../components/GlassPanel/GlassPanel';

export const DashboardMetrics = () => {
  return (
    <>
      <div className="metrics-grid">
        <MetricCard
          title="Pedidos Pendientes"
          value="124"
          trend="↑ 18% en 24h"
          trendType="up"
        />
        <MetricCard
          title="Stock Crítico"
          value="38"
          trend="Revisión prioritaria"
          trendType="down"
          valueStyle={{ background: 'linear-gradient(to right, #ef4444, #f87171)', WebkitBackgroundClip: 'text' }}
        />
        <MetricCard
          title="Tiempo de Entrega"
          value="1.8d"
          trend="Estable"
          trendType="up"
        />
      </div>

      <GlassPanel
        style={{
          height: '320px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1rem',
          color: 'var(--text-muted)',
        }}
      >
        <div>
          <h3>Operación Logística</h3>
          <p>
            Sonic Gateway listo para enrutar llamadas API centralizadas desde el front-end.
          </p>
        </div>
        <div className="dashboard-summary">
          <span className="status-pill positive">API Gateway: Activo</span>
          <span className="status-pill neutral">Circuit Breaker: Listo</span>
          <span className="status-pill warning">Fallas de transportista: 2 incidentes</span>
        </div>
      </GlassPanel>
    </>
  );
};
