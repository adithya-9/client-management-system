import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/eswaradithya/clients';

export const clientAPI = {
  // Create a new client
  createClient: (clientData) => {
    return axios.post(`${API_BASE_URL}/save`, clientData);
  },

  // Get all clients
  getAllClients: () => {
    return axios.get(`${API_BASE_URL}/all`);
  },

  // Get client by ID
  getClientById: (clientId) => {
    return axios.get(`${API_BASE_URL}/${clientId}`);
  },

  // Delete client by ID
  deleteClient: (clientId) => {
    return axios.delete(`${API_BASE_URL}/${clientId}`);
  }
};
