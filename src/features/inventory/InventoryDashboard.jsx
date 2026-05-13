import React, { useState, useEffect } from 'react';
import InventoryService from '../../services/InventoryService';
import './InventoryDashboard.css';

const InventoryDashboard = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const data = await InventoryService.getSyncedStock();
      setStock(data);
    } catch (err) {
      // Los errores de red se manejan globalmente por NetworkBoundary.
      // Aquí podemos manejar errores específicos del componente.
      console.error('Error al cargar inventario', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInsertDemo = async () => {
    try {
      setLoading(true);
      const demoProduct = {
        productId: Math.floor(Math.random() * 1000),
        productSku: 'DEMO-' + Math.floor(Math.random() * 1000),
        warehouseId: 1,
        availableQuantity: 50
      };
      await InventoryService.createStock(demoProduct);
      await fetchStock();
    } catch (err) {
      console.error('Error insertando demo', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Sincronizando inventario...</p>
      </div>
    );
  }

  return (
    <div className="inventory-dashboard glass-panel">
      <div className="dashboard-header">
        <h2>Inventario Global</h2>
        <button className="btn-secondary" onClick={fetchStock}>
          ↻ Sincronizar
        </button>
      </div>

      {stock.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No hay productos en inventario</h3>
          <p>Actualmente no se registran productos o el stock es cero.</p>
          <button className="btn-primary" onClick={handleInsertDemo} style={{ marginTop: '1.5rem' }}>
            + Insertar Producto Demo
          </button>
        </div>
      ) : (
        <div className="inventory-grid">
          {stock.map((item) => (
            <div key={item.id} className="inventory-card">
              <div className="card-header">
                <h3>{item.name || `Producto #${item.productId}`}</h3>
                <span className="sku-badge">{item.sku || 'N/A'}</span>
              </div>
              <div className="card-body">
                <div className="stock-info">
                  <span className="stock-label">Stock Total</span>
                  <span className={`stock-value ${item.quantity > 10 ? 'healthy' : 'low'}`}>
                    {item.quantity}
                  </span>
                </div>
                <div className="warehouse-info">
                  <span>Bodega: {item.warehouseId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;
