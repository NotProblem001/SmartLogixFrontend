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
  }
};

export default ShippingService;
