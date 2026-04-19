import React, { useState } from 'react';
import { adminAPI } from '../services/adminAPI';
import { authService } from '../services/authService';

const LoginForm = ({ onBackClick, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    if (message) setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validation
    if (!formData.email || !formData.password) {
      setMessageType('error');
      setMessage('Email and password are required');
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
      const response = await adminAPI.signIn(formData.email, formData.password);
      const loginResponse = response.data.data; // Contains token and admin info
      
      // Store JWT token and admin info
      authService.setToken(loginResponse.token, {
        adminId: loginResponse.adminId,
        email: loginResponse.email,
        name: loginResponse.name,
        role: loginResponse.role
      });
      
      setMessageType('success');
      setMessage('✅ Welcome back Admin!');
      
      // Reset form
      setFormData({
        email: '',
        password: ''
      });

      // Notify parent to navigate to dashboard
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(loginResponse);
        }
      }, 1000);

    } catch (error) {
      setMessageType('error');
      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else if (error.response?.status === 401) {
        setMessage('❌ Invalid credentials');
      } else {
        setMessage('❌ Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBackClick}
          className="mb-6 text-gray-300 hover:text-white font-semibold flex items-center transition"
        >
          ← Back
        </button>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200 mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onBackClick}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Go back and Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
