import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/eswaradithya/admins';

export const adminAPI = {
  /**
   * Sign in admin - Returns LoginResponseDTO with JWT token
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise} Response with token and admin info
   */
  signIn: (email, password) => {
    return axios.post(`${API_BASE_URL}/sign-in`, {
      email,
      password
    });
  },

  /**
   * Create admin account (sign up)
   * @param {object} adminData - Admin registration data
   * @returns {Promise} Response with created admin info
   */
  createAdmin: (adminData) => {
    return axios.post(`${API_BASE_URL}/save`, adminData);
  }
};

