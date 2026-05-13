import React, { useState, useEffect } from 'react';
import InventoryService from '../../services/InventoryService';
import InventoryTable from '../../components/InventoryTable/InventoryTable';
import FloatingActionBar from '../../components/FloatingActionBar/FloatingActionBar';
import InventoryForm from '../../components/Forms/InventoryForm';
import './InventoryDashboard.css';

const InventoryDashboard = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
    const newQty = window.prompt('Nueva cantidad disponible:', currentQty);
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
          <button className="btn-primary" onClick={() => setIsFormOpen(true)}>
            + Añadir
          </button>
          <button className="btn-secondary" onClick={fetchStock}>
            ↻ Sincronizar
          </button>
        </div>
      </div>

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

      <InventoryForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={fetchStock} 
      />
    </div>
  );
};

export default InventoryDashboard;
