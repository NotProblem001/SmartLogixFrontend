import api from './api';

const InventoryService = {
  /**
   * RF-I01: Lista el stock sincronizado de productos.
   * @returns {Promise<Array>} Lista de productos con su stock.
   */
  getSyncedStock: async () => {
    try {
      const response = await api.get('/inventory/synced-stock');
      return response.data;
    } catch (error) {
      console.error('Error al obtener el stock sincronizado', error);
      throw error;
    }
  },

  /**
   * RF-I02: Consulta el stock detallado por bodegas para un producto específico.
   * @param {string|number} productId - ID del producto a consultar.
   * @returns {Promise<Object>} Detalle de stock en diferentes bodegas.
   */
  getMultiWarehouseStock: async (productId) => {
    try {
      const response = await api.get(`/inventory/multi-warehouse/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener stock multibodega para producto ${productId}`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo registro de stock (Demo).
   * @param {Object} stockData - Datos del producto y cantidad.
   * @returns {Promise<Object>} Producto creado.
   */
  createStock: async (stockData) => {
    try {
      const response = await api.post('/inventory/create', stockData);
      return response.data;
    } catch (error) {
      console.error('Error al crear stock', error);
      throw error;
    }
  },

  updateStock: async (id, stockData) => {
    const response = await api.put(`/inventory/${id}`, stockData);
    return response.data;
  },

  deleteStock: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  }
};

export default InventoryService;
