/**
 * Payment API Service
 * Handles all payment-related API calls
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/eswaradithya/payments';

export const paymentAPI = {
  /**
   * Create a new payment
   * @param {object} paymentData - Payment information
   * @returns {Promise} Response with created payment
   */
  createPayment: (paymentData) => {
    return axios.post(`${API_BASE_URL}/save`, paymentData);
  },

  /**
   * Get payment by ID
   * @param {number} paymentId - Payment ID
   * @returns {Promise} Payment details
   */
  getPaymentById: (paymentId) => {
    return axios.get(`${API_BASE_URL}/${paymentId}`);
  },

  /**
   * Get all payments for a service (paginated)
   * @param {number} serviceId - Service ID
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Items per page
   * @returns {Promise} Paginated payments
   */
  getPaymentsByService: (serviceId, page = 0, size = 10) => {
    return axios.get(`${API_BASE_URL}/service/${serviceId}?page=${page}&size=${size}`);
  },

  /**
   * Get all payments by a client (paginated)
   * @param {number} clientId - Client ID
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Items per page
   * @returns {Promise} Paginated payments
   */
  getPaymentsByClient: (clientId, page = 0, size = 10) => {
    return axios.get(`${API_BASE_URL}/client/${clientId}?page=${page}&size=${size}`);
  },

  /**
   * Update an existing payment
   * @param {number} paymentId - Payment ID
   * @param {object} paymentData - Updated payment data
   * @returns {Promise} Updated payment
   */
  updatePayment: (paymentId, paymentData) => {
    return axios.put(`${API_BASE_URL}/${paymentId}`, paymentData);
  },

  /**
   * Delete a payment
   * @param {number} paymentId - Payment ID
   * @returns {Promise} Success response
   */
  deletePayment: (paymentId) => {
    return axios.delete(`${API_BASE_URL}/${paymentId}`);
  },

  /**
   * Get total payment amount for a service
   * @param {number} serviceId - Service ID
   * @returns {Promise} Total amount
   */
  getTotalPaymentForService: (serviceId) => {
    return axios.get(`${API_BASE_URL}/total/service/${serviceId}`);
  },

  /**
   * Get total payment amount by a client
   * @param {number} clientId - Client ID
   * @returns {Promise} Total amount
   */
  getTotalPaymentByClient: (clientId) => {
    return axios.get(`${API_BASE_URL}/total/client/${clientId}`);
  }
};
