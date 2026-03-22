import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Map legacy frontend paths to the exact backend routes
    if (config.url === '/init_public_conversation' && config.data?.slug) {
      config.url = `/conversation/init/${config.data.slug}`;
    } else if (config.url === '/ai_message') {
      config.url = '/conversation/ai_message';
    } else if (config.url === '/get_leads') {
      config.url = '/analytics/leads';
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      // Intentionally pass the token directly if present
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
