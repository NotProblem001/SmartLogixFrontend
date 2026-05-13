import React, { useState, useEffect } from 'react';
import OrderService from '../../services/OrderService';
import './OrderDashboard.css';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OrderService.getOrders();
      setOrders(data);
    } catch (err) {
      setError('No se pudieron cargar los pedidos. Verifique la conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const newOrder = {
        customerId: 1,
        items: [{ productId: 101, quantity: 2 }]
      };
      await OrderService.createOrder(newOrder);
      // Recargar la lista después de crear
      await fetchOrders();
    } catch (err) {
      setError('Error al crear el pedido.');
      setLoading(false);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="order-dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando información de pedidos...</p>
      </div>
    );
  }

  return (
    <div className="order-dashboard-container glass-panel">
      <header className="order-header">
        <h2>Panel de Pedidos</h2>
        <button className="btn-primary" onClick={handleCreateOrder} disabled={loading}>
          {loading ? 'Procesando...' : 'Crear Pedido de Prueba'}
        </button>
      </header>

      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="order-list">
        {orders.length === 0 && !loading && !error ? (
          <p className="empty-state">No hay pedidos registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Cliente ID</th>
                <th>Estado</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customerId}</td>
                  <td>
                    <span className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                      {order.status || 'PENDING'}
                    </span>
                  </td>
                  <td>${order.total || '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderDashboard;
