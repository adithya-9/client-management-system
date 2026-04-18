import React, { useState } from 'react';
import { adminAPI } from '../services/adminAPI';

const AdminForm = ({ onBackClick, onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    passwordHash: '',
    name: '',
    role: 'admin'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message on input change
    if (message) setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validation
    if (!formData.email || !formData.passwordHash || !formData.name || !formData.role) {
      setMessageType('error');
      setMessage('All fields are required');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setMessageType('error');
      setMessage('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await adminAPI.createAdmin({
        email: formData.email,
        passwordHash: formData.passwordHash,
        name: formData.name,
        role: formData.role
      });

      setMessageType('success');
      setMessage(`✅ Account created successfully!`);
      
      // Reset form
      setFormData({
        email: '',
        passwordHash: '',
        name: '',
        role: 'admin'
      });

      // Navigate to dashboard after delay
      setTimeout(() => {
        if (onSignUpSuccess) {
          onSignUpSuccess(response.data.data);
        }
      }, 1000);

    } catch (error) {
      setMessageType('error');
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else if (error.response?.status === 400) {
        setMessage('❌ Bad request. Please check your input.');
      } else if (error.response?.status === 409) {
        setMessage('❌ Email already exists. Please use a different email.');
      } else {
        setMessage('❌ Error creating account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="mb-6 text-gray-300 hover:text-white font-semibold flex items-center transition"
          >
            ← Back
          </button>
        )}

        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="passwordHash"
                name="passwordHash"
                value={formData.passwordHash}
                onChange={handleChange}
                placeholder="Enter a secure password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Password will be securely hashed</p>
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                disabled={loading}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Message Alert */}
            {message && (
              <div className={`p-4 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition mt-6 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Creating Account...
                </span>
              ) : (
                'Sign Up & Continue'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              All information is transmitted securely
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;
