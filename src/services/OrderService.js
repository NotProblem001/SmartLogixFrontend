import api from './api';

const OrderService = {
  /**
   * RF-P01: Crea un nuevo pedido y lo envía al BFF.
   * @param {Object} orderData - Datos del pedido (cliente, items, etc.)
   * @returns {Promise<Object>} Respuesta del servidor con el pedido creado.
   */
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el pedido', error);
      throw error;
    }
  },

  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  updateOrder: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

};

export default OrderService;
