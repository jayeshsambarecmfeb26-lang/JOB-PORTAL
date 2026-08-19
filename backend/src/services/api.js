import axios from 'axios';

// Base axios instance pointing to Spring Boot backend
const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
