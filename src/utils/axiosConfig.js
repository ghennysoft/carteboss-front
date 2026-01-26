import axios from "axios";
import { BASE_API_URL } from "./constante";

const api = axios.create({
  baseURL: BASE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour rafraîchir automatiquement le token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh');
        const response = await axios.post(`${BASE_API_URL}/api/auth/refresh`, { refreshToken });
        
        if(response.data.token) {
          const newToken = response.data.token;
          localStorage.setItem('token', newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          // Synchroniser le nouveau token avec les autres services
          window.postMessage({
            type: 'TOKEN_UPDATE',
            token: newToken,
            refreshToken: refreshToken,
          }, '*');
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('user');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;