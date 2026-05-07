import React from 'react';
import { GlassPanel } from '../GlassPanel/GlassPanel';

export const TrackingPanel = ({ shipments }) => {
  return (
    <div className="tracking-grid">
      {shipments.map((shipment) => (
        <GlassPanel key={shipment.trackingId} className="tracking-card">
          <div className="tracking-top">
            <div>
              <h3>{shipment.trackingId}</h3>
              <span className="small-text">{shipment.carrier}</span>
            </div>
            <span className={`status-pill ${shipment.status === 'En tránsito' ? 'positive' : shipment.status === 'Retenido' ? 'warning' : 'neutral'}`}>
              {shipment.status}
            </span>
          </div>
          <div className="tracking-details">
            <p>{shipment.webhook}</p>
            <div className="tracking-meta">
              <span>Última actualización: {shipment.lastUpdate}</span>
              <span>ETA: {shipment.eta}</span>
            </div>
          </div>
        </GlassPanel>
      ))}
    </div>
  );
};
