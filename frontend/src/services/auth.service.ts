import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<string> => {
    const response = await api.post<string>('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    // Clear cookies, local storage, etc.
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('user');
  },

  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    const user = authService.getCurrentUser();
    return !!user;
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user ? user.admin : false;
  }
};
