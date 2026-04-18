import React, { useState, useEffect } from 'react';

const SERVICE_TYPES = [
  'WEB_HOSTING',
  'DOMAIN',
  'SSL_CERTIFICATE',
  'EMAIL_HOSTING',
  'SEO_SERVICE',
  'MAINTENANCE_SUPPORT',
  'CLOUD_STORAGE',
  'SECURITY_SERVICE',
  'BACKUP_SERVICE',
  'MONITORING_SERVICE',
  'CDN_SERVICE',
  'DATABASE_SERVICE',
  'API_SERVICE',
  'CUSTOM_DEVELOPMENT',
  'CONSULTATION',
  'MOBILE_APP',
  'WEB_DEVELOPMENT',
  'WORDPRESS_MAINTENANCE',
  'ANALYTICS_TRACKING',
  'PERFORMANCE_OPTIMIZATION'
];

const SERVICE_STATUS = [
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'EXPIRED',
  'RENEWAL_PENDING',
  'SUSPENDED',
  'CANCELLED',
  'TRIAL'
];

const BILLING_CYCLES = ['Monthly', 'Quarterly', 'Yearly', 'One-time'];

const AddServiceForm = ({ clientId, service, onClose, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    serviceType: service?.serviceType || 'WEB_HOSTING',
    serviceName: service?.serviceName || '',
    provider: service?.provider || '',
    purchaseDate: service?.purchaseDate || '',
    expiryDate: service?.expiryDate || '',
    price: service?.price || '',
    billingCycle: service?.billingCycle || 'Yearly',
    status: service?.status || 'ACTIVE'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service name is required';
    }
    if (!formData.serviceType) {
      newErrors.serviceType = 'Service type is required';
    }
    if (formData.price && isNaN(formData.price)) {
      newErrors.price = 'Price must be a valid number';
    }
    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    if (formData.purchaseDate && formData.expiryDate) {
      if (new Date(formData.expiryDate) < new Date(formData.purchaseDate)) {
        newErrors.expiryDate = 'Expiry date cannot be before purchase date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await onSubmit(formData);
      setMessage({
        type: 'success',
        text: isEditing ? '✅ Service updated successfully!' : '✅ Service added successfully!'
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save service. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? '✏️ Edit Service' : '➕ Add New Service'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="e.g., WordPress Hosting"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.serviceName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.serviceName && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceName}</p>
            )}
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.serviceType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Service Type</option>
              {SERVICE_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {errors.serviceType && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>
            )}
          </div>

          {/* Provider */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Provider
            </label>
            <input
              type="text"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              placeholder="e.g., Bluehost, GoDaddy"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Purchase Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purchase Date
              </label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            {/* Billing Cycle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Billing Cycle
              </label>
              <select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {BILLING_CYCLES.map(cycle => (
                  <option key={cycle} value={cycle}>
                    {cycle}
                  </option>
                ))}
              </select>
            </div>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {SERVICE_STATUS.map(status => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 font-semibold"
            >
              {loading ? (
                <>🔄 Saving...</>
              ) : (
                <>{isEditing ? '✏️ Update Service' : '➕ Add Service'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceForm;
