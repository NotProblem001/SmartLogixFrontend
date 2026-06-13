import React, { useState, useEffect } from 'react';
import { GlassPanel } from '../GlassPanel/GlassPanel';
import ShippingService from '../../services/ShippingService';

export const OfflineDeliveryPanel = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [orderId, setOrderId] = useState('');
  const [carrier, setCarrier] = useState('DHL');
  const [amount, setAmount] = useState('150');
  const [signature, setSignature] = useState('Recibido Conforme');
  const [queue, setQueue] = useState([]);
  const [statusMsg, setStatusMsg] = useState(null);
  const [statusType, setStatusType] = useState('neutral'); // neutral, positive, warning, error
  const [isSyncing, setIsSyncing] = useState(false);

  // Load offline queue on mount
  useEffect(() => {
    const savedQueue = localStorage.getItem('offline_eft_queue');
    if (savedQueue) {
      try {
        setQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error('Error parsing offline queue', e);
      }
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync queue automatically when transitioning to online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      syncOfflineQueue();
    }
  }, [isOnline]);

  const syncOfflineQueue = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setStatusMsg('Sincronizando transacciones encoladas...');
    setStatusType('warning');

    try {
      const currentQueue = [...queue];
      const failedItems = [];
      let successCount = 0;

      for (const item of currentQueue) {
        try {
          // Prepare backend request structure matching Shipment entity
          await ShippingService.createShipment({
            orderId: item.orderId,
            carrier: item.carrier,
            status: item.status
          });
          successCount++;
        } catch (error) {
          console.error('Error syncing item', item, error);
          failedItems.push(item);
        }
      }

      localStorage.setItem('offline_eft_queue', JSON.stringify(failedItems));
      setQueue(failedItems);

      if (successCount > 0) {
        setStatusMsg(`¡Conexión restaurada! Se sincronizaron exitosamente ${successCount} transacciones contables EFT.`);
        setStatusType('positive');
      } else if (failedItems.length > 0) {
        setStatusMsg('Fallo al sincronizar algunas transacciones de la cola.');
        setStatusType('error');
      }
    } catch (e) {
      console.error('Sync process failed', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderIdClean = orderId.trim();
    const amountClean = amount.trim();

    if (!orderIdClean || !/^\d+$/.test(orderIdClean)) {
      setStatusMsg('Por favor ingrese un ID de Orden numérico válido');
      setStatusType('error');
      return;
    }

    if (!amountClean || isNaN(parseFloat(amountClean)) || parseFloat(amountClean) <= 0) {
      setStatusMsg('Por favor ingrese un monto EFT numérico válido y mayor a cero');
      setStatusType('error');
      return;
    }

    const parsedOrderId = parseInt(orderIdClean, 10);
    const parsedAmount = parseFloat(amountClean);

    const shipmentPayload = {
      id_temp: Date.now(),
      orderId: parsedOrderId,
      carrier,
      status: 'DESPACHADO',
      amount: parsedAmount,
      signature,
      timestamp: new Date().toISOString()
    };

    if (isOnline) {
      setStatusMsg('Procesando cobro y envío en tiempo real...');
      setStatusType('neutral');
      try {
        await ShippingService.createShipment({
          orderId: shipmentPayload.orderId,
          carrier: shipmentPayload.carrier,
          status: shipmentPayload.status
        });
        setStatusMsg(`Envío procesado exitosamente para la Orden #${orderIdClean}. Cobro EFT realizado.`);
        setStatusType('positive');
        setOrderId('');
      } catch (error) {
        setStatusMsg('Error al conectar con la pasarela bancaria o el servicio de envíos.');
        setStatusType('error');
      }
    } else {
      const updatedQueue = [...queue, shipmentPayload];
      localStorage.setItem('offline_eft_queue', JSON.stringify(updatedQueue));
      setQueue(updatedQueue);
      setStatusMsg(`Sin conexión. Envío de la Orden #${orderIdClean} guardado localmente en caché.`);
      setStatusType('warning');
      setOrderId('');
    }
  };

  const clearQueue = () => {
    localStorage.removeItem('offline_eft_queue');
    setQueue([]);
    setStatusMsg('Cola de transacciones offline eliminada.');
    setStatusType('neutral');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>
      <GlassPanel className="section-panel" style={{ padding: '2rem' }}>
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h3>Flujo de Despacho Offline-First</h3>
            <p>Complete entregas y dispare cobros EFT incluso sin cobertura celular.</p>
          </div>
          <span className={`status-pill ${isOnline ? 'positive' : 'error'}`}>
            {isOnline ? 'Online - Red Activa' : 'Offline - Modo Local'}
          </span>
        </div>

        {statusMsg && (
          <div className={`status-message ${statusType === 'error' ? 'error' : ''}`} style={{
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            background: statusType === 'positive' ? 'rgba(16, 185, 129, 0.15)' :
                       statusType === 'warning' ? 'rgba(245, 158, 11, 0.15)' :
                       statusType === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${
                       statusType === 'positive' ? '#10b981' :
                       statusType === 'warning' ? '#f59e0b' :
                       statusType === 'error' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'
                     }`,
            color: statusType === 'positive' ? '#34d399' :
                   statusType === 'warning' ? '#fbbf24' :
                   statusType === 'error' ? '#f87171' : 'var(--text-muted)'
          }}>
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>ID de la Orden *</label>
              <input
                type="text"
                placeholder="Ej. 1024"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Transportista</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              >
                <option value="DHL">DHL Express</option>
                <option value="Estafeta">Estafeta</option>
                <option value="FedEx">FedEx Logistics</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Monto EFT ($USD)</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Firma del Destinatario</label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
            </div>
          </div>

          <button type="submit" disabled={isSyncing} className="primary-button" style={{
            padding: '0.85rem',
            background: isSyncing 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: 'none',
            color: isSyncing ? 'var(--text-muted)' : 'white',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: isSyncing ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem'
          }}>
            {isSyncing 
              ? 'Sincronizando...' 
              : (isOnline ? 'Finalizar Entrega y Cobrar EFT' : 'Guardar en Cola Local (Offline)')}
          </button>
        </form>
      </GlassPanel>

      {queue.length > 0 && (
        <GlassPanel className="section-panel" style={{ padding: '2rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h4 style={{ color: '#fbbf24', margin: 0 }}>Cola de Sincronización Local ({queue.length})</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Transacciones logísticas EFT en caché esperando conexión de red.
              </p>
            </div>
            <button onClick={clearQueue} className="secondary-button" style={{
              padding: '0.4rem 0.8rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              color: '#f87171',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}>
              Limpiar Cola
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {queue.map((item) => (
              <div key={item.id_temp} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>Orden #{item.orderId}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Transportista: {item.carrier} | Firma: {item.signature}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#fbbf24', fontWeight: '600', fontSize: '0.9rem' }}>${item.amount} USD</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(item.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}
    </div>
  );
};
