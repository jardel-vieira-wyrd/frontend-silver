import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in the header
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const auth = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; // Assuming the server returns { user, token }
  },
  logout: () => api.post('/auth/logout'),
};

// Tasks endpoints
export const tasks = {
  getAll: () => api.get('/tasks'),
  create: (taskData: { title: string; description: string }) =>
    api.post('/tasks', taskData),
  update: (id: number, taskData: { title?: string; description?: string; completed?: boolean }) =>
    api.put(`/tasks/${id}`, taskData),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};

// Health check endpoint
export const health = {
  check: () => api.get('/health'),
};

// Add more endpoint groups as needed

export default api;
