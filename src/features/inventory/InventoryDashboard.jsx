import React, { useState, useEffect } from 'react';
import InventoryService from '../../services/InventoryService';
import InventoryTable from '../../components/InventoryTable/InventoryTable';
import FloatingActionBar from '../../components/FloatingActionBar/FloatingActionBar';
import './InventoryDashboard.css';

const InventoryDashboard = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

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
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      await fetchStock();
    } catch (err) {
      console.error('Error al eliminar', err);
    }
  };

  const handleDeleteMultiple = async () => {
    if (!window.confirm(`¿Eliminar ${selectedIds.length} productos seleccionados?`)) return;
    try {
      setLoading(true);
      // Batch delete
      for (const id of selectedIds) {
        await InventoryService.deleteStock(id);
      }
      setSelectedIds([]);
      await fetchStock();
    } catch (err) {
      console.error('Error al eliminar múltiple', err);
      setLoading(false);
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

      {loading && stock.length === 0 ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Sincronizando inventario...</p>
        </div>
      ) : filteredStock.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No se encontraron productos</h3>
          <p>La búsqueda no coincide con ningún registro o el inventario está vacío.</p>
        </div>
      ) : (
        <>
          <InventoryTable 
            stock={filteredStock} 
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          <FloatingActionBar 
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            actions={[
              {
                label: 'Sincronizar Stock',
                icon: '↻',
                onClick: fetchStock
              },
              {
                label: 'Eliminar Seleccionados',
                icon: '🗑️',
                className: 'danger',
                onClick: handleDeleteMultiple
              }
            ]}
          />
        </>
      )}
    </div>
  );
};

export default InventoryDashboard;
