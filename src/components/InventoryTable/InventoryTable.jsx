import React from 'react';
import './InventoryTable.css';

const InventoryTable = ({ stock, selectedIds, onSelectionChange, onEdit, onDelete }) => {
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(stock.map(item => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleKeyDown = (e, action, ...args) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action(...args);
    }
  };

  return (
    <div className="inventory-table-container">
      <table className="inventory-table" role="grid">
        <thead>
          <tr>
            <th className="checkbox-cell">
              <input 
                type="checkbox" 
                aria-label="Seleccionar todos los productos"
                checked={stock.length > 0 && selectedIds.length === stock.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>ID Producto</th>
            <th>SKU</th>
            <th>Stock Disponible</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isLowStock = item.availableQuantity <= 10;
            return (
              <tr key={item.id} className={isSelected ? 'selected-row' : ''}>
                <td className="checkbox-cell">
                  <input 
                    type="checkbox" 
                    aria-label={`Seleccionar producto ${item.productSku}`}
                    checked={isSelected}
                    onChange={(e) => handleSelectOne(e, item.id)}
                  />
                </td>
                <td>#{item.id}</td>
                <td className="font-mono">{item.productSku || 'N/A'}</td>
                <td className={`font-bold ${isLowStock ? 'text-warning' : ''}`}>
                  {item.availableQuantity}
                </td>
                <td>
                  <span className={`status-badge ${isLowStock ? 'badge-warning' : 'badge-success'}`}>
                    {isLowStock ? 'Stock Bajo' : 'Óptimo'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button 
                    className="btn-icon" 
                    onClick={() => onEdit(item.id, item.availableQuantity)}
                    onKeyDown={(e) => handleKeyDown(e, onEdit, item.id, item.availableQuantity)}
                    aria-label={`Editar cantidad de ${item.productSku}`}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-icon text-danger" 
                    onClick={() => onDelete(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, onDelete, item.id)}
                    aria-label={`Eliminar producto ${item.productSku}`}
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
  );
};

export default InventoryTable;
