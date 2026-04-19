/**
 * Auth Service - Handles JWT token storage and retrieval
 * Uses sessionStorage which automatically clears when browser is closed
 */

const TOKEN_KEY = 'jwt_token';
const ADMIN_INFO_KEY = 'admin_info';

/**
 * Decode JWT token to extract payload
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true; // Invalid token is considered expired
  }
  
  // Convert token expiration time (in seconds) to milliseconds
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  
  // Add 60 second buffer to avoid edge cases
  return currentTime >= expirationTime - 60000;
};

export const authService = {
  /**
   * Store JWT token and admin info in sessionStorage
   * @param {string} token - JWT token from login response
   * @param {object} adminInfo - Admin information (email, name, role, etc.)
   */
  setToken: (token, adminInfo) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    if (adminInfo) {
      sessionStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(adminInfo));
    }
  },

  /**
   * Get stored JWT token from sessionStorage
   * @returns {string|null} JWT token or null if not found
   */
  getToken: () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    // Validate token before returning
    if (token && !isTokenExpired(token)) {
      return token;
    }
    // Clear expired token
    if (token) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(ADMIN_INFO_KEY);
    }
    return null;
  },

  /**
   * Get stored admin info from sessionStorage
   * @returns {object|null} Admin info object or null if not found
   */
  getAdminInfo: () => {
    const adminInfo = sessionStorage.getItem(ADMIN_INFO_KEY);
    return adminInfo ? JSON.parse(adminInfo) : null;
  },

  /**
   * Check if user is authenticated with valid token
   * @returns {boolean} True if valid, non-expired token exists in sessionStorage
   */
  isAuthenticated: () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Clear expired token
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(ADMIN_INFO_KEY);
      return false;
    }
    
    return true;
  },

  /**
   * Clear token and admin info from sessionStorage (logout)
   */
  clearToken: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_INFO_KEY);
  },

  /**
   * Get Authorization header value for API requests
   * @returns {object} Authorization header object for axios
   */
  getAuthHeader: () => {
    const token = authService.getToken();
    if (token) {
      return {
        Authorization: `Bearer ${token}`
      };
    }
    return {};
  }
};
