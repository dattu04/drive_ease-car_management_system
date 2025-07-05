// src/services/auth.service.js
import api from './api';

const AuthService = {
  // Login function matching your backend's expectations
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        const userData = {
          token: response.data.token,
          ...parseJwt(response.data.token),
        };
        localStorage.setItem('user', JSON.stringify(userData));
        // Dispatch a custom event to notify that localStorage has changed
        window.dispatchEvent(new Event('storage'));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Register function with all required fields from your backend
  register: async (name, email, password, phone, role) => {
    try {
      return await api.post('/auth/register', { 
        name, 
        email, 
        password, 
        phone, 
        role 
      });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    try {
      // Call the logout endpoint if available
      api.post('/auth/logout').catch(() => {
        // Silently catch error if logout endpoint fails
        console.log('Logout endpoint error - proceeding with local logout');
      });
    } finally {
      // Always remove user from local storage
      localStorage.removeItem('user');
      // Notify the app that the user has changed
      window.dispatchEvent(new Event('storage'));
    }
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user'); // Clear invalid data
    }
    return null;
  },

  // Add token to API requests
  setupInterceptors: () => {
    api.interceptors.request.use(
      (config) => {
        const user = AuthService.getCurrentUser();
        if (user && user.token) {
          // Format matches your authMiddleware.js expectations
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle 401 errors (unauthorized)
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Automatically logout on 401 response
          AuthService.logout();
          window.location.href = '/#/login';
        }
        return Promise.reject(error);
      }
    );
  }
};

// Helper function to decode JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
};

export default AuthService;