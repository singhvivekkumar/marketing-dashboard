// src/api/axios.config.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Attach JWT token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('mp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally → redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mp_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
