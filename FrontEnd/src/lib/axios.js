import axios from 'axios';

// ------------------- FIXED CODE -------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
// --------------------------------------------------

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
