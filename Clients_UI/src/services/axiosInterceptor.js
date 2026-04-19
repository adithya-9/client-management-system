/**
 * Axios Interceptor for JWT Authentication
 * Automatically adds JWT token to all outgoing API requests
 * Handles token refresh on 401 responses
 */

import axios from 'axios';
import { authService } from './authService';

/**
 * Setup axios interceptors for JWT authentication
 * This function should be called once during app initialization
 */
export const setupAxiosInterceptors = () => {
  // Request interceptor - Add Authorization header with JWT token
  axios.interceptors.request.use(
    (config) => {
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle 401 Unauthorized responses
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token is invalid or expired
        console.error('Token expired or invalid. Clearing auth data.');
        authService.clearToken();
        
        // Redirect to login page (optional)
        // window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};
