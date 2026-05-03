import React from 'react';
import { MetricCard } from '../../components/MetricCard/MetricCard';
import { GlassPanel } from '../../components/GlassPanel/GlassPanel';

/**
 * Módulo de la Vista de Dashboard.
 * Utiliza los componentes base para ensamblar la interfaz de usuario específica.
 */
export const DashboardMetrics = () => {
  return (
    <>
      {/* Utilización limpia de los componentes aislados */}
      <div className="metrics-grid">
        <MetricCard 
          title="Pedidos Activos" 
          value="1,284" 
          trend="↑ 12% vs ayer" 
          trendType="up" 
        />
        <MetricCard 
          title="Envíos en Ruta" 
          value="842" 
          trend="↑ 5% vs ayer" 
          trendType="up" 
        />
        <MetricCard 
          title="Alertas de Stock" 
          value="24" 
          trend="Revisión requerida (Bodega Central)" 
          trendType="down" 
          valueStyle={{ background: 'linear-gradient(to right, #ef4444, #f87171)', WebkitBackgroundClip: 'text' }}
        />
      </div>

      <GlassPanel 
        style={{ height: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}
      >
        <h3>Gráfico Interactivo de Operaciones</h3>
        <p>La integración con <code>/api/v1/inventory</code> y <code>/api/v1/orders</code> vía el BFF Gateway está en desarrollo.</p>
      </GlassPanel>
    </>
  );
};
