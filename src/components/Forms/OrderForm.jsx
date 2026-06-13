import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import OrderService from '../../services/OrderService';

const OrderForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    sku: '',
    warehouseId: '',
    quantity: 1
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
    setIsSubmitting(true);

    try {
      // JSON Payload exacto requerido por la especificación
      const payload = {
        customerId: String(formData.customerId),
        sku: formData.sku,
        warehouseId: parseInt(formData.warehouseId, 10),
        quantity: parseInt(formData.quantity, 10)
      };

      await OrderService.createOrder(payload);
      
      // Reseteo y cierre al éxito
      setFormData({ customerId: '', sku: '', warehouseId: '', quantity: 1 });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el pedido o stock insuficiente en la bodega.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Pedido">
      <form onSubmit={handleSubmit}>
        
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--accent-danger)', borderRadius: '6px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="customerId">Cliente Solicitante</label>
          <input
            type="text"
            id="customerId"
            name="customerId"
            className="form-control"
            placeholder="Ej. 105"
            value={formData.customerId}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="sku">Producto (SKU)</label>
          <input
            type="text"
            id="sku"
            name="sku"
            className="form-control"
            placeholder="Ej. RTX-4090"
            value={formData.sku}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="warehouseId">Bodega de Origen</label>
          <select
            id="warehouseId"
            name="warehouseId"
            className="form-control"
            value={formData.warehouseId}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>Seleccione la bodega de despacho...</option>
            {/* Opciones Hardcodeadas por ahora, idealmente vendrían del BFF */}
            <option value="1">Bodega Central Metropolitana (ID: 1)</option>
            <option value="2">Bodega Sur (ID: 2)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Cantidad a Solicitar</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            className="form-control"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
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
              <><span className="btn-spinner"></span> Procesando...</>
            ) : (
              'Crear Pedido'
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default OrderForm;
