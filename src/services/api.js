import axios from 'axios';

const getBaseUrl = () => {
  // 1. Intentar usar la variable de entorno si existe en Vercel
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl}/api/v1`;
  }

  // 2. Si no hay variable, usamos lógica dinámica
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8085/api/v1';
  }
  
  // 3. Producción por defecto (URL actualizada)
  return 'https://bff-gateway-fr0l.onrender.com/api/v1';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones para adjuntar el JWT Token automáticamente
api.interceptors.request.use(
  (config) => {
    // Obtener el token de LocalStorage de forma directa o desde el estado de Zustand si existiera
    let token = localStorage.getItem('jwt_token');

    if (!token) {
      try {
        // Fallback: intentar extraer el token de un store persistido de Zustand (ej. auth-storage)
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          if (parsed?.state?.token) {
            token = parsed.state.token;
          }
        }
      } catch (e) {
        console.error('Error al intentar deserializar el almacenamiento de Zustand:', e);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para manejo de errores globales (Opcional pero recomendado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('El backend está desconectado. Disparando evento offline...');
      window.dispatchEvent(new Event('backend_offline'));
    }

    // Si el error es 401 (No autorizado), podríamos redirigir al login
    if (error.response && error.response.status === 401) {
      console.warn('Token expirado o inválido. Redirigiendo a login...');
      // Lógica de redirección a login o limpieza de sesión
    }
    return Promise.reject(error);
  }
);

export default api;
