import Cookies from 'js-cookie';
import { AuthResponse } from '../types';

export const setAuthData = (authData: AuthResponse) => {
  // Set JWT token in HTTP-only cookie (for security)
  Cookies.set('token', authData.accessToken, { expires: 7, secure: process.env.NODE_ENV === 'production' });

  // Store user data in local storage
  localStorage.setItem('user', JSON.stringify(authData));
};

export const clearAuthData = () => {
  Cookies.remove('token');
  localStorage.removeItem('user');
};

// Redirect to login if not authenticated
export const requireAuth = (router: any) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    
    if (!user) {
      router.push('/auth/login');
      return false;
    }
    
    return true;
  }
  
  return false;
};

// Redirect to dashboard if already authenticated
export const requireNoAuth = (router: any) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    
    if (user) {
      router.push('/dashboard');
      return false;
    }
    
    return true;
  }
  
  return false;
};

export const isAdmin = (): boolean => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.admin === true;
      } catch (e) {
        return false;
      }
    }
  }
  return false;
};
