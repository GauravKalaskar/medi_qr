import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
let baseURL = '/api';

if (rawApiUrl && rawApiUrl.trim() !== '') {
  const cleanUrl = rawApiUrl.trim().replace(/\/+$/, '');
  baseURL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach Bearer Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medsecure_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for global 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
      if (!isAuthRoute && localStorage.getItem('medsecure_token')) {
        localStorage.removeItem('medsecure_token');
        localStorage.removeItem('medsecure_user');
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
