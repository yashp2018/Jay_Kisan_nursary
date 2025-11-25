import axios from 'axios';

// ------------------- NEW CODE START -------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://72.61.227.66:5000/api';

const instance = axios.create({
  // Use the environment variable, which will be set to '/api' in production
  // This allows relative paths on Vercel to correctly route to your backend function.
  baseURL: API_BASE_URL, 
// ------------------- NEW CODE END -------------------

  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach token from localStorage to all requests
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
