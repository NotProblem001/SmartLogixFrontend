import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import ShippingService from '../../services/ShippingService';

const ShipmentForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    orderId: '',
    carrier: ''
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
      const payload = {
        orderId: parseInt(formData.orderId, 10),
        carrier: formData.carrier
      };

      await ShippingService.createShipment(payload);
      
      setFormData({ orderId: '', carrier: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error de comunicación con el servicio de envíos (Circuit Breaker activo).');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generar Despacho">
      <form onSubmit={handleSubmit}>
        
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--accent-danger)', borderRadius: '6px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="orderId">ID del Pedido a Enviar</label>
          <input
            type="number"
            id="orderId"
            name="orderId"
            className="form-control"
            placeholder="Ej. 1042"
            value={formData.orderId}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="carrier">Transportista Asignado</label>
          <select
            id="carrier"
            name="carrier"
            className="form-control"
            value={formData.carrier}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>Seleccione un transportista...</option>
            <option value="DHL">DHL Express</option>
            <option value="FEDEX">FedEx Ground</option>
            <option value="LOCAL">Correo Local (Estandar)</option>
          </select>
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
              'Despachar Pedido'
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default ShipmentForm;
