import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/eswaradithya/services';

export const servicesAPI = {
  // Create a new service for a client
  createService: (clientId, serviceData) => {
    return axios.post(`${API_BASE_URL}/${clientId}`, serviceData);
  },

  // Get all services for a client with pagination
  getServicesByClient: (clientId, page = 0, size = 10, sortBy = 'serviceId', sortDirection = 'DESC') => {
    return axios.get(`${API_BASE_URL}/client/${clientId}`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection
      }
    });
  },

  // Get a specific service by ID
  getServiceById: (serviceId) => {
    return axios.get(`${API_BASE_URL}/${serviceId}`);
  },

  // Update a service
  updateService: (serviceId, serviceData) => {
    return axios.put(`${API_BASE_URL}/${serviceId}`, serviceData);
  },

  // Delete a service
  deleteService: (serviceId) => {
    return axios.delete(`${API_BASE_URL}/${serviceId}`);
  }
};
