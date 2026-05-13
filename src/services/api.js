import axios from 'axios';

// Instancia de Axios apuntando al BFF (Spring Cloud Gateway)
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones para adjuntar el JWT Token automáticamente
api.interceptors.request.use(
  (config) => {
    // Obtener el token del almacenamiento local (o estado global)
    const token = localStorage.getItem('jwt_token');
    
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
