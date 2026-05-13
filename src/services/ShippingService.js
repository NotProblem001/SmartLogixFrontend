import api from './api';

const ShippingService = {
  /**
   * Obtiene la lista de envíos. (Incluye fallback resilience4j)
   */
  getShipments: async () => {
    try {
      const response = await api.get('/shipping');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los envíos', error);
      throw error;
    }
  },

  createShipment: async (shipmentData) => {
    const response = await api.post('/shipping/create', shipmentData);
    return response.data;
  },

  updateShipment: async (id, shipmentData) => {
    const response = await api.put(`/shipping/${id}`, shipmentData);
    return response.data;
  },

  deleteShipment: async (id) => {
    const response = await api.delete(`/shipping/${id}`);
    return response.data;
  }
};

export default ShippingService;
