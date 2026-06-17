import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';

describe('Configuracion del Servicio API Axios', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe tener baseURL configurado', () => {
    expect(api.defaults.baseURL).toBeDefined();
  });

  it('debe añadir el token si existe en localStorage', async () => {
    localStorage.setItem('jwt_token', 'test-token');
    
    // Simulate interceptor logic (trigger request interceptor)
    const interceptor = api.interceptors.request.handlers[0];
    const config = { headers: {} };
    
    const result = await interceptor.fulfilled(config);
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('debe despachar evento si hay error de red', async () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');
    const interceptor = api.interceptors.response.handlers[0];
    
    const error = { code: 'ERR_NETWORK' };
    
    try {
      await interceptor.rejected(error);
    } catch (e) {
      expect(e).toBe(error);
    }
    
    expect(dispatchEventSpy).toHaveBeenCalled();
  });
});

