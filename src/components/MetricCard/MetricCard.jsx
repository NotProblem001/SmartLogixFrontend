import React from 'react';
import { GlassPanel } from '../GlassPanel/GlassPanel';

/**
 * Componente de Presentación (Molécula).
 * Recibe datos puros (props) y las pinta, sin saber de dónde vienen.
 */
export const MetricCard = ({ title, value, trend, trendType, valueStyle = {} }) => {
  const trendClass = trendType === 'up' ? 'trend-up' : trendType === 'down' ? 'trend-down' : 'trend-neutral';
  
  // Generar un sparkline aleatorio simple basado en el título para que parezca dinámico
  const seed = title.length;
  const points = Array.from({ length: 6 }, (_, i) => `${i * 20},${30 - (Math.sin(seed + i) * 15 + 15)}`).join(' ');
  
  const strokeColor = trendType === 'up' ? 'var(--accent-green)' : trendType === 'down' ? 'var(--accent-danger)' : 'var(--text-muted)';

  return (
    <GlassPanel className="metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span className="metric-title">{title}</span>
        <span className="metric-value" style={valueStyle}>{value}</span>
        {trend && (
          <span className={`metric-trend ${trendClass}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {trendType === 'up' && '↑'}
            {trendType === 'down' && '↓'}
            {trend}
          </span>
        )}
      </div>
      
      {/* Decorative Sparkline Background */}
      <svg 
        viewBox="0 0 100 40" 
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          opacity: 0.2,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        <polyline 
          points={points} 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <polygon 
          points={`0,40 ${points} 100,40`} 
          fill={strokeColor} 
          opacity="0.1"
        />
      </svg>
    </GlassPanel>
  );
};
