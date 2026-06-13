import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import InventoryService from '../../services/InventoryService';

const InventoryForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    productSku: '',
    availableQuantity: '',
    reservedQuantity: 0,
    warehouseId: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const available = parseInt(formData.availableQuantity, 10);
    const reserved = parseInt(formData.reservedQuantity, 10);

    if (reserved > available) {
      setError('La Cantidad Reservada no puede ser mayor a la Cantidad Disponible.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        productSku: formData.productSku,
        availableQuantity: available,
        reservedQuantity: reserved,
        warehouseId: parseInt(formData.warehouseId, 10)
      };

      await InventoryService.createStock(payload);
      
      setFormData({ productSku: '', availableQuantity: '', reservedQuantity: 0, warehouseId: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el producto en el inventario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajuste de Inventario">
      <form onSubmit={handleSubmit}>
        
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--accent-danger)', borderRadius: '6px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="productSku">Código del Producto (SKU)</label>
          <input
            type="text"
            id="productSku"
            name="productSku"
            className="form-control"
            placeholder="Ej. RTX-4090"
            value={formData.productSku}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="warehouseId">Asignar a Bodega</label>
          <select
            id="warehouseId"
            name="warehouseId"
            className="form-control"
            value={formData.warehouseId}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>Seleccione una bodega...</option>
            <option value="1">Bodega Central Metropolitana (ID: 1)</option>
            <option value="2">Bodega Sur (ID: 2)</option>
          </select>
        </div>

        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="availableQuantity">Stock Disponible</label>
            <input
              type="number"
              id="availableQuantity"
              name="availableQuantity"
              className="form-control"
              min="0"
              placeholder="0"
              value={formData.availableQuantity}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="reservedQuantity">Stock Reservado</label>
            <input
              type="number"
              id="reservedQuantity"
              name="reservedQuantity"
              className="form-control"
              min="0"
              placeholder="0"
              value={formData.reservedQuantity}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><span className="btn-spinner"></span> Guardando...</>
            ) : (
              'Guardar Ajuste'
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default InventoryForm;
