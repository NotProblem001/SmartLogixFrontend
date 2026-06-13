const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const simulatedInventory = [
  { warehouse: 'Central', sku: 'SKU-2248', stock: 120, status: 'Normal' },
  { warehouse: 'Norte', sku: 'SKU-9912', stock: 18, status: 'Crítico' },
  { warehouse: 'Tienda A', sku: 'SKU-6501', stock: 42, status: 'Ajustar' },
];

const simulatedOrders = [
  { id: 'ORD-1024', customer: 'Arias Logistics', stage: 'Validación', eta: 'Hoy', status: 'Pendiente' },
  { id: 'ORD-1078', customer: 'Tienda Nova', stage: 'Aprobación', eta: '48h', status: 'En revisión' },
  { id: 'ORD-1130', customer: 'Retail Hub', stage: 'Trazabilidad', eta: '72h', status: 'Confirmado' },
];

const simulatedShipments = [
  { trackingId: 'DHL-5501', carrier: 'DHL', status: 'En tránsito', lastUpdate: 'Hace 12 min', eta: '1 día', webhook: 'Última entrega registrada' },
  { trackingId: 'DHL-5516', carrier: 'DHL', status: 'Retenido', lastUpdate: 'Hace 34 min', eta: '2 días', webhook: 'Incidencia en aduana' },
  { trackingId: 'NEX-3390', carrier: 'Estafeta', status: 'Listo para entrega', lastUpdate: 'Hace 8 min', eta: 'Hoy', webhook: 'Actualización automática recibida' },
];

export const apiGateway = {
  call: async (endpoint) => {
    await delay(800);

    if (endpoint === '/shipping/tracking' && Math.random() < 0.08) {
      throw new Error('El servicio de envíos no responde. Circuit breaker activado.');
    }

    switch (endpoint) {
      case '/dashboard':
        return {
          ordersPending: 124,
          criticalStock: 38,
          averageDelivery: '1.8d',
          gateway: 'ok',
          breaker: 'ready',
        };
      case '/inventory/sync':
        return simulatedInventory;
      case '/orders/lifecycle':
        return simulatedOrders;
      case '/shipping/tracking':
        return simulatedShipments;
      default:
        throw new Error(`Recurso ${endpoint} no encontrado en el API Gateway.`);
    }
  },
};
