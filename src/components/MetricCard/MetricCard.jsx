import React from 'react';
import { GlassPanel } from '../GlassPanel/GlassPanel';

/**
 * Componente de Presentación (Molécula).
 * Recibe datos puros (props) y las pinta, sin saber de dónde vienen.
 */
export const MetricCard = ({ title, value, trend, trendType, valueStyle = {} }) => {
  const trendClass = trendType === 'up' ? 'trend-up' : 'trend-down';
  
  return (
    <GlassPanel className="metric-card">
      <span className="metric-title">{title}</span>
      <span className="metric-value" style={valueStyle}>{value}</span>
      <span className={`metric-trend ${trendClass}`}>{trend}</span>
    </GlassPanel>
  );
};
