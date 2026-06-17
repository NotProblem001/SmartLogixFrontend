import { describe, it, expect, vi } from 'vitest';
import api from './api';
import InventoryService from './InventoryService';

// Mockeamos la instancia de axios/api
vi.mock('./api');

describe('InventoryService', () => {
  it('debería obtener el stock sincronizado correctamente', async () => {
    // Datos falsos (mock) que simulan la respuesta del BFF
    const mockData = { data: [{ id: 1, productSku: 'RTX-4090', availableQuantity: 50 }] };
    api.get.mockResolvedValue(mockData);

    const result = await InventoryService.getSyncedStock();
    
    // Validaciones
    expect(api.get).toHaveBeenCalledWith('/inventory/synced-stock');
    expect(result[0].availableQuantity).toBe(50);
    expect(result[0].productSku).toBe('RTX-4090');
  });

  it('debería manejar errores al obtener el stock sincronizado', async () => {
    const error = new Error('Network error');
    api.get.mockRejectedValue(error);

    await expect(InventoryService.getSyncedStock()).rejects.toThrow('Network error');
  });

  it('debería crear un nuevo registro de stock', async () => {
    const newStock = { productSku: 'TEST-1', availableQuantity: 10 };
    const mockResponse = { data: { id: 2, ...newStock } };
    api.post.mockResolvedValue(mockResponse);

    const result = await InventoryService.createStock(newStock);

    expect(api.post).toHaveBeenCalledWith('/inventory/create', newStock);
    expect(result.id).toBe(2);
    expect(result.productSku).toBe('TEST-1');
  });

  it('debería obtener el stock multibodega', async () => {
    const mockData = { data: { total: 100 } };
    api.get.mockResolvedValue(mockData);

    const result = await InventoryService.getMultiWarehouseStock(1);
    
    expect(api.get).toHaveBeenCalledWith('/inventory/multi-warehouse/1');
    expect(result.total).toBe(100);
  });

  it('debería actualizar un registro de stock', async () => {
    const updateData = { availableQuantity: 20 };
    const mockResponse = { data: { id: 1, ...updateData } };
    api.put.mockResolvedValue(mockResponse);

    const result = await InventoryService.updateStock(1, updateData);

    expect(api.put).toHaveBeenCalledWith('/inventory/1', updateData);
    expect(result.availableQuantity).toBe(20);
  });

  it('debería eliminar un registro de stock', async () => {
    const mockResponse = { data: { success: true } };
    api.delete.mockResolvedValue(mockResponse);

    const result = await InventoryService.deleteStock(1);

    expect(api.delete).toHaveBeenCalledWith('/inventory/1');
    expect(result.success).toBe(true);
  });
});
