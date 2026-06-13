import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import api from './api';

// Mockear axios
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        },
        defaults: {}
      }))
    }
  };
});

describe('Configuracion del Servicio API Axios', () => {
  it('debe inicializar axios.create', () => {
    expect(axios.create).toHaveBeenCalled();
  });
});
