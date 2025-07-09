import api from './api';
import { User } from '../types';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  toggleUserActive: async (id: number, active: boolean): Promise<string> => {
    const endpoint = active ? `/users/${id}/activate` : `/users/${id}/deactivate`;
    const response = await api.patch<string>(endpoint);
    return response.data;
  },

  deleteUser: async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/users/${id}`);
    return response.data;
  }
};
