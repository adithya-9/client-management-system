/**
 * Auth Service - Handles JWT token storage and retrieval
 * Stores token in localStorage for persistence across browser sessions
 */

const TOKEN_KEY = 'jwt_token';
const ADMIN_INFO_KEY = 'admin_info';

export const authService = {
  /**
   * Store JWT token and admin info in localStorage
   * @param {string} token - JWT token from login response
   * @param {object} adminInfo - Admin information (email, name, role, etc.)
   */
  setToken: (token, adminInfo) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (adminInfo) {
      localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(adminInfo));
    }
  },

  /**
   * Get stored JWT token from localStorage
   * @returns {string|null} JWT token or null if not found
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored admin info from localStorage
   * @returns {object|null} Admin info object or null if not found
   */
  getAdminInfo: () => {
    const adminInfo = localStorage.getItem(ADMIN_INFO_KEY);
    return adminInfo ? JSON.parse(adminInfo) : null;
  },

  /**
   * Check if token exists
   * @returns {boolean} True if token exists in localStorage
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Clear token and admin info from localStorage (logout)
   */
  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_INFO_KEY);
  },

  /**
   * Get Authorization header value for API requests
   * @returns {object} Authorization header object for axios
   */
  getAuthHeader: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        Authorization: `Bearer ${token}`
      };
    }
    return {};
  }
};
