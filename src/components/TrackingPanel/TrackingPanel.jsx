import React from 'react';
import { GlassPanel } from '../GlassPanel/GlassPanel';

export const TrackingPanel = ({ shipments }) => {
  return (
    <div className="tracking-grid">
      {shipments?.map((shipment) => {
        const id = shipment.id || shipment.trackingId;
        const carrier = shipment.carrier || 'Desconocido';
        const status = shipment.status || 'Desconocido';
        const webhookInfo = shipment.webhook || (shipment.orderId ? `Envío asociado a la Orden #${shipment.orderId}` : 'Webhook activo');
        const lastUpdate = shipment.lastUpdate || 'Justo ahora';
        const eta = shipment.eta || 'Por confirmar';
        const key = id || `${carrier}-${status}`;

        return (
          <GlassPanel key={key} className="tracking-card">
            <div className="tracking-top">
              <div>
                <h3>{id ? `TRK-${id}` : 'N/A'}</h3>
                <span className="small-text">{carrier}</span>
              </div>
              <span className={`status-pill ${status === 'En tránsito' || status === 'DESPACHADO' ? 'positive' : status === 'Retenido' || status === 'ERROR' ? 'warning' : 'neutral'}`}>
                {status}
              </span>
            </div>
            <div className="tracking-details">
              <p>{webhookInfo}</p>
              <div className="tracking-meta">
                <span>Última actualización: {lastUpdate}</span>
                <span>ETA: {eta}</span>
              </div>
            </div>
          </GlassPanel>
        );
      })}
    </div>
  );
};
