import React, { useState, useEffect } from 'react';
import OrderService from '../../services/OrderService';
import '../../components/InventoryTable/InventoryTable.css';
import './OrderDashboard.css';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OrderService.getAllOrders();
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
      // Simular un pedido que descuenta un producto (ej. SKU DEMO-XXX)
      const sku = window.prompt("Introduce el SKU del producto a pedir:", "DEMO-123");
      if (!sku) {
        setLoading(false);
        return;
      }
      
      const newOrder = {
        customerId: Math.floor(Math.random() * 100),
        sku: sku,
        warehouseId: 1,
        quantity: 1
      };
      await OrderService.createOrder(newOrder);
      await fetchOrders();
    } catch (err) {
      setError('Error al crear el pedido o stock insuficiente.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Eliminar pedido #${id}?`)) return;
    try {
      await OrderService.deleteOrder(id);
      await fetchOrders();
    } catch (err) {
      setError('Error al eliminar el pedido.');
    }
  };

  const handleEdit = async (id, currentStatus) => {
    const newStatus = window.prompt('Nuevo estado del pedido:', currentStatus);
    if (newStatus) {
      try {
        await OrderService.updateOrder(id, { status: newStatus });
        await fetchOrders();
      } catch (err) {
        setError('Error al actualizar el estado.');
      }
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

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchTerm) || 
    (order.status && order.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.sku && order.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="order-dashboard-container glass-panel">
      <header className="order-header">
        <h2>Panel de Pedidos</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Buscar por ID, SKU o Estado..." 
            className="filter-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-primary" onClick={handleCreateOrder} disabled={loading}>
            {loading ? 'Procesando...' : '+ Crear Pedido Manual'}
          </button>
        </div>
      </header>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px' }}>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      <div className="order-list">
        {filteredOrders.length === 0 && !loading ? (
          <p className="empty-state">No hay pedidos que coincidan con la búsqueda.</p>
        ) : (
          <div className="inventory-table-container">
            <table className="inventory-table" role="grid">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente ID</th>
                  <th>SKU Solicitado</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusColors = {
                    'PENDING': 'badge-warning',
                    'COMPLETED': 'badge-success',
                    'CANCELLED': 'text-danger' // Just red text or another badge
                  };
                  const badgeClass = statusColors[order.status?.toUpperCase()] || 'badge-warning';

                  return (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customerId}</td>
                      <td className="font-mono">{order.sku || 'N/A'}</td>
                      <td className="font-bold">{order.quantity || 0}</td>
                      <td>
                        <span className={`status-badge ${badgeClass}`}>
                          {order.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="btn-icon" 
                          onClick={() => handleEdit(order.id, order.status)} 
                          title="Editar Estado"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon text-danger" 
                          onClick={() => handleDelete(order.id)} 
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDashboard;
