import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/eswaradithya/admins';

export const adminAPI = {
  // Sign in admin
  signIn: (email, password) => {
    return axios.post(`${API_BASE_URL}/sign-in`, {
      email,
      password
    });
  },

  // Create admin account (sign up)
  createAdmin: (adminData) => {
    return axios.post(`${API_BASE_URL}/save`, adminData);
  }
};
