import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import ShippingService from './ShippingService';

// Mock the api module
vi.mock('./api', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe('ShippingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getShipments should fetch shipments and return data', async () => {
    const mockData = [{ id: 1, orderId: 1024, carrier: 'DHL', status: 'DESPACHADO' }];
    api.get.mockResolvedValue({ data: mockData });

    const result = await ShippingService.getShipments();

    expect(api.get).toHaveBeenCalledWith('/shipping');
    expect(result).toEqual(mockData);
  });

  it('createShipment should post shipment and return response data', async () => {
    const payload = { orderId: 1024, carrier: 'DHL', status: 'DESPACHADO' };
    const mockResponse = { id: 1, ...payload };
    api.post.mockResolvedValue({ data: mockResponse });

    const result = await ShippingService.createShipment(payload);

    expect(api.post).toHaveBeenCalledWith('/shipping/create', payload);
    expect(result).toEqual(mockResponse);
  });

  it('updateShipment should put shipment updates and return response data', async () => {
    const payload = { carrier: 'FedEx' };
    const mockResponse = { id: 1, orderId: 1024, carrier: 'FedEx', status: 'DESPACHADO' };
    api.put.mockResolvedValue({ data: mockResponse });

    const result = await ShippingService.updateShipment(1, payload);

    expect(api.put).toHaveBeenCalledWith('/shipping/1', payload);
    expect(result).toEqual(mockResponse);
  });

  it('deleteShipment should delete shipment and return status', async () => {
    const mockResponse = { success: true };
    api.delete.mockResolvedValue({ data: mockResponse });

    const result = await ShippingService.deleteShipment(1);

    expect(api.delete).toHaveBeenCalledWith('/shipping/1');
    expect(result).toEqual(mockResponse);
  });
});
