import React, { useState, useEffect } from 'react';
import { paymentAPI } from '../services/paymentAPI';
import { clientAPI } from '../services/clientAPI';
import { servicesAPI } from '../services/servicesAPI';

const AddPaymentForm = ({ isOpen, onClose, onPaymentAdded, serviceId = null, clientId = null }) => {
  const [formData, setFormData] = useState({
    serviceId: serviceId || '',
    clientId: clientId || '',
    amount: '',
    paymentMethod: 'Credit Card',
    paymentDate: new Date().toISOString().split('T')[0],
    transactionReference: '',
    status: 'SUCCESS'
  });

  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  // Load services and clients on mount
  useEffect(() => {
    if (isOpen) {
      loadServicesAndClients();
    }
  }, [isOpen]);

  const loadServicesAndClients = async () => {
    try {
      setLoading(true);
      const [servicesRes, clientsRes] = await Promise.all([
        servicesAPI.getAllServices(),
        clientAPI.getAllClients()
      ]);
      
      setServices(servicesRes.data?.data || []);
      setClients(clientsRes.data?.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessageType('error');
      setMessage('Failed to load services and clients');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message) setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validation
    if (!formData.serviceId) {
      setMessageType('error');
      setMessage('Please select a service');
      setLoading(false);
      return;
    }

    if (!formData.clientId) {
      setMessageType('error');
      setMessage('Please select a client');
      setLoading(false);
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setMessageType('error');
      setMessage('Please enter a valid amount');
      setLoading(false);
      return;
    }

    try {
      const paymentData = {
        serviceId: parseInt(formData.serviceId),
        clientId: parseInt(formData.clientId),
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        paymentDate: formData.paymentDate,
        transactionReference: formData.transactionReference,
        status: formData.status
      };

      const response = await paymentAPI.createPayment(paymentData);
      
      setMessageType('success');
      setMessage('✅ Payment added successfully!');

      // Reset form
      setFormData({
        serviceId: serviceId || '',
        clientId: clientId || '',
        amount: '',
        paymentMethod: 'Credit Card',
        paymentDate: new Date().toISOString().split('T')[0],
        transactionReference: '',
        status: 'SUCCESS'
      });

      // Notify parent component
      setTimeout(() => {
        if (onPaymentAdded) {
          onPaymentAdded(response.data.data);
        }
        onClose();
      }, 1500);
    } catch (error) {
      setMessageType('error');
      setMessage(`❌ ${error.response?.data?.message || 'Failed to add payment'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add Payment</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Message Alert */}
          {message && (
            <div className={`p-4 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service <span className="text-red-500">*</span>
            </label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service.serviceId} value={service.serviceId}>
                  {service.serviceName} - ₹{service.price}
                </option>
              ))}
            </select>
          </div>

          {/* Client Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.clientId} value={client.clientId}>
                  {client.clientName} ({client.email})
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              step="0.01"
              min="0"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Date
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Transaction Reference */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transaction Reference
            </label>
            <input
              type="text"
              name="transactionReference"
              value={formData.transactionReference}
              onChange={handleChange}
              placeholder="e.g., INV-2024-001"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
            >
              {loading ? 'Adding...' : 'Add Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentForm;
