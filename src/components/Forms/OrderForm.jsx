import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import OrderService from '../../services/OrderService';
import InventoryService from '../../services/InventoryService';

const OrderForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    sku: '',
    warehouseId: '',
    quantity: 1
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Inventario state
  const [inventory, setInventory] = useState([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchInventory();
      // Reset form
      setFormData({ customerId: '', sku: '', warehouseId: '', quantity: 1 });
      setError(null);
    }
  }, [isOpen]);

  const fetchInventory = async () => {
    try {
      setIsLoadingInventory(true);
      const data = await InventoryService.getSyncedStock();
      setInventory(data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('No se pudo cargar el catálogo de productos. Verifique la conexión.');
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia el SKU, auto-completar el WarehouseId asociado
    if (name === 'sku') {
      const selectedProduct = inventory.find(item => (item.productSku || item.sku) === value);
      if (selectedProduct) {
        // En base a los datos, si warehouseId no está explícito pero está en warehouse.id o id, extraemos:
        const whId = selectedProduct.warehouseId || selectedProduct.warehouse?.id || selectedProduct.id;
        
        setFormData(prev => ({ 
          ...prev, 
          sku: value, 
          warehouseId: whId ? String(whId) : '1',
          quantity: 1 // reseteamos la cantidad al cambiar de producto
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        customerId: String(formData.customerId),
        sku: formData.sku,
        warehouseId: parseInt(formData.warehouseId, 10),
        quantity: parseInt(formData.quantity, 10)
      };

      await OrderService.createOrder(payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el pedido o stock insuficiente en la bodega.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular max disponible del SKU seleccionado
  const selectedProduct = inventory.find(item => (item.productSku || item.sku) === formData.sku);
  const maxStock = selectedProduct ? (selectedProduct.availableQuantity !== undefined ? selectedProduct.availableQuantity : selectedProduct.stock) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Pedido">
      <form onSubmit={handleSubmit}>
        
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(225, 29, 72, 0.1)', color: 'var(--accent-danger)', borderRadius: '6px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="customerId">Cliente Solicitante (ID)</label>
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
          <label htmlFor="sku">Producto (Catálogo en Bodega)</label>
          {isLoadingInventory ? (
            <div style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Cargando catálogo...</div>
          ) : (
            <select
              id="sku"
              name="sku"
              className="form-control"
              value={formData.sku}
              onChange={handleChange}
              required
              disabled={isSubmitting || inventory.length === 0}
            >
              <option value="" disabled>Seleccione un producto del catálogo...</option>
              {inventory.map((item, index) => {
                const itemSku = item.productSku || item.sku || 'N/A';
                const stockQty = item.availableQuantity !== undefined ? item.availableQuantity : item.stock;
                const whName = item.warehouse?.name || item.warehouse || `Bodega ${item.warehouseId || item.id}`;
                const isDisabled = stockQty <= 0;
                
                return (
                  <option key={`${itemSku}-${index}`} value={itemSku} disabled={isDisabled}>
                    {itemSku} — {whName} (Stock: {stockQty}) {isDisabled ? ' - AGOTADO' : ''}
                  </option>
                );
              })}
            </select>
          )}
          {inventory.length === 0 && !isLoadingInventory && !error && (
            <small style={{ color: 'var(--accent-warning)', display: 'block', marginTop: '0.25rem' }}>
              No hay productos registrados en el inventario.
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="warehouseId">Bodega de Origen (Auto-asignada)</label>
          <input
            type="text"
            id="warehouseId"
            name="warehouseId"
            className="form-control"
            value={formData.warehouseId}
            readOnly
            disabled
            placeholder="Se auto-completará..."
          />
          <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>El pedido se ruteará a la bodega de origen del producto seleccionado.</small>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Cantidad a Solicitar</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            className="form-control"
            min="1"
            max={maxStock || 1}
            value={formData.quantity}
            onChange={handleChange}
            required
            disabled={isSubmitting || !formData.sku || maxStock <= 0}
          />
          {formData.sku && (
             <small style={{ color: formData.quantity > maxStock ? 'var(--accent-danger)' : 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>
              Disponible: {maxStock} unidades.
            </small>
          )}
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
            disabled={isSubmitting || !formData.sku || maxStock <= 0}
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
