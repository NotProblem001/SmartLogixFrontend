import React, { useState, useEffect } from 'react';
import InventoryService from '../../services/InventoryService';
import './InventoryDashboard.css';

const InventoryDashboard = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const data = await InventoryService.getSyncedStock();
      setStock(data);
    } catch (err) {
      console.error('Error al cargar inventario', err);
    } finally {
      setLoading(false);
    }
  };

  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ sku: '', quantity: '' });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.sku || !newProduct.quantity) return;
    
    try {
      setLoading(true);
      const payload = {
        productSku: newProduct.sku,
        availableQuantity: parseInt(newProduct.quantity)
      };
      await InventoryService.createStock(payload);
      setNewProduct({ sku: '', quantity: '' });
      setIsAdding(false);
      await fetchStock();
    } catch (err) {
      console.error('Error insertando producto', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    try {
      await InventoryService.deleteStock(id);
      await fetchStock();
    } catch (err) {
      console.error('Error al eliminar', err);
    }
  };

  const handleEdit = async (id, currentQty) => {
    const newQty = window.prompt('Nueva cantidad:', currentQty);
    if (newQty && !isNaN(newQty)) {
      try {
        await InventoryService.updateStock(id, { availableQuantity: parseInt(newQty) });
        await fetchStock();
      } catch (err) {
        console.error('Error al actualizar', err);
      }
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

  const filteredStock = stock.filter(item => 
    (item.productSku && item.productSku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="inventory-dashboard glass-panel">
      <div className="dashboard-header">
        <h2>Inventario Global</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Buscar por SKU..." 
            className="filter-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-primary" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? 'Cancelar' : '+ Añadir'}
          </button>
          <button className="btn-secondary" onClick={fetchStock}>
            ↻ Sincronizar
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleCreateSubmit} className="add-product-form" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="SKU del Producto" 
            required
            className="filter-input"
            value={newProduct.sku}
            onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
          />
          <input 
            type="number" 
            placeholder="Cantidad Inicial" 
            required
            min="1"
            className="filter-input"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
          />
          <button type="submit" className="btn-primary">Guardar</button>
        </form>
      )}

      {filteredStock.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No se encontraron productos</h3>
          <p>La búsqueda no coincide con ningún registro o el inventario está vacío.</p>
        </div>
      ) : (
        <div className="inventory-grid">
          {filteredStock.map((item) => (
            <div key={item.id} className="inventory-card">
              <div className="card-header">
                <h3>{`Producto #${item.id}`}</h3>
                <span className="sku-badge">{item.productSku || 'N/A'}</span>
              </div>
              <div className="card-body">
                <div className="stock-info">
                  <span className="stock-label">Stock Total</span>
                  <span className={`stock-value ${item.availableQuantity > 10 ? 'healthy' : 'low'}`}>
                    {item.availableQuantity}
                  </span>
                </div>
                <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className="btn-action edit" onClick={() => handleEdit(item.id, item.availableQuantity)}>✏️</button>
                  <button className="btn-action delete" onClick={() => handleDelete(item.id)}>🗑️</button>
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
