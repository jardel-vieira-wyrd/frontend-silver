import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';
import { User } from '../stores/authStore';  // Import the User interface
import { useTaskStore } from '../stores/taskStore';


const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in the header
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers || {};
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
  getProjects: async () => {
    try {
      const response = await api.get('/tasks/projects');
      return response.data; 
    } catch (error) {
      handleApiError(error);
    }
  },
  updatePermission: async (taskId: number, userId: number, role: string) => {
    try {
      console.log('Updating permission for task:', taskId, 'user:', userId, 'role:', role);
      const response = await api.post(`/tasks/permissions`, { taskId, userId, role });
      
      // Fetch updated projects after successful permission update
      const fetchProjects = useTaskStore.getState().fetchProjects;
      await fetchProjects();

      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// Health check endpoint
export const health = {
  check: () => api.get('/health'),
};

// Add task endpoint
export const createTask = async (taskData: {
  title: string;
  project: string;
  description?: string;
  status?: 'TO_DO' | 'DOING' | 'DONE' | 'CANCELED';
  priority?: number;
  deadline?: string;
  list?: string;
}) => {
  try {
    const { token } = useAuthStore.getState();
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Users endpoint
export const users = {
  getAll: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/users');
      return response.data;
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },
};

function handleApiError(error: unknown) {
  throw new Error('API Error: ' + error);
}

export default api;

