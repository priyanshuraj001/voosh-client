import axios from 'axios';

const api = axios.create({
  baseURL: 'https://voosh-server-1.onrender.com/api', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  const customError = error.response?.data?.message || 'An error occurred. Please try again.';
  return Promise.reject(new Error(customError));
});

export default api;
