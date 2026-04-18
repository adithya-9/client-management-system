import React from 'react';

const EntryPage = ({ onLoginClick, onSignUpClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-300 text-lg">Client Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Manage your clients efficiently</p>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            {/* Login Button */}
            <button
              onClick={onLoginClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105"
            >
              🔐 Login
            </button>

            {/* Sign Up Button */}
            <button
              onClick={onSignUpClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105"
            >
              ✍️ Sign Up
            </button>
          </div>

          {/* Info Section */}
          <div className="pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Demo Account:</strong> You can sign up with any credentials to get started!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">© 2026 Admin Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
