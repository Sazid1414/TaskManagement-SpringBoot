import api from './api';
import { Task } from '../types';

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  getTaskById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (task: Partial<Task>): Promise<Task> => {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  },

  updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  deleteTask: async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/tasks/${id}`);
    return response.data;
  },

  // Admin only
  getAllTasksAdmin: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks/all');
    return response.data;
  },
  
  getTasksByUser: async (userId: number): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/users/${userId}/tasks`);
    return response.data;
  }
};
