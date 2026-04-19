import React from 'react';
import { authService } from '../services/authService';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ 
  children, 
  onAuthenticationRequired 
}) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login or call callback
    if (onAuthenticationRequired) {
      onAuthenticationRequired();
    }
    return null; // Prevent rendering protected content
  }

  return children;
};

/**
 * useAuth Hook
 * Provides access to authentication status and methods
 * Can be used in any component
 */
export const useAuth = () => {
  return {
    isAuthenticated: authService.isAuthenticated(),
    getToken: authService.getToken,
    getAdminInfo: authService.getAdminInfo,
    logout: authService.clearToken
  };
};
