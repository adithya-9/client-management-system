import React, { useState } from 'react';
import EntryPage from './components/EntryPage';
import LoginForm from './components/LoginForm';
import AdminForm from './components/AdminForm';
import ClientForm from './components/ClientForm';
import ClientsList from './components/ClientsList';
import ClientDetails from './components/ClientDetails';

function App() {
  // Main navigation state
  const [currentView, setCurrentView] = useState('entry'); // 'entry', 'login', 'signup', 'dashboard', 'details'
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  // Entry Page: Navigate to Login
  const handleLoginClick = () => {
    setCurrentView('login');
  };

  // Entry Page: Navigate to Sign-Up
  const handleSignUpClick = () => {
    setCurrentView('signup');
  };

  // Login Form: Back button
  const handleLoginBack = () => {
    setCurrentView('entry');
  };

  // Login Form: Successful login
  const handleLoginSuccess = (admin) => {
    setWelcomeMessage(`Welcome back ${admin.name || admin.email}!`);
    setCurrentView('dashboard');
  };

  // Sign-Up Form: Back button
  const handleSignUpBack = () => {
    setCurrentView('entry');
  };

  // Sign-Up Form: Successful sign-up
  const handleSignUpSuccess = (admin) => {
    setWelcomeMessage(`Welcome ${admin.name || admin.email}! Account created successfully.`);
    setCurrentView('dashboard');
  };

  // Dashboard: Client created
  const handleClientCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Dashboard: Client selected
  const handleClientSelect = (clientId) => {
    setSelectedClientId(clientId);
    setCurrentView('details');
  };

  // Details Page: Back to dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setRefreshTrigger(prev => prev + 1);
  };

  // Dashboard: Logout
  const handleLogout = () => {
    setWelcomeMessage('');
    setCurrentView('entry');
  };

  return (
    <>
      {/* Entry Page */}
      {currentView === 'entry' && (
        <EntryPage 
          onLoginClick={handleLoginClick}
          onSignUpClick={handleSignUpClick}
        />
      )}

      {/* Login Page */}
      {currentView === 'login' && (
        <LoginForm
          onBackClick={handleLoginBack}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Sign-Up Page */}
      {currentView === 'signup' && (
        <AdminForm
          onBackClick={handleSignUpBack}
          onSignUpSuccess={handleSignUpSuccess}
        />
      )}

      {/* Dashboard */}
      {currentView === 'dashboard' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Client Management Dashboard</h1>
                {welcomeMessage && (
                  <p className="text-green-400 font-semibold text-lg">{welcomeMessage}</p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                🚪 Logout
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div>
                <ClientForm onClientCreated={handleClientCreated} />
              </div>

              {/* List Section */}
              <div className="lg:col-span-2">
                <ClientsList 
                  onClientSelect={handleClientSelect} 
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client Details Page */}
      {currentView === 'details' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="text-4xl font-bold text-white">Client Details</h1>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                🚪 Logout
              </button>
            </div>
            <ClientDetails 
              clientId={selectedClientId}
              onBack={handleBackToDashboard}
              onClientDeleted={handleBackToDashboard}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
