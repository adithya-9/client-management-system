import React, { useState, useEffect } from 'react';
import EntryPage from './components/EntryPage';
import LoginForm from './components/LoginForm';
import AdminForm from './components/AdminForm';
import ClientForm from './components/ClientForm';
import ClientsList from './components/ClientsList';
import ClientDetails from './components/ClientDetails';
import { authService } from './services/authService';
import { setupAxiosInterceptors } from './services/axiosInterceptor';
import { adminAPI } from './services/adminAPI';

function App() {
  // Main navigation state
  const [currentView, setCurrentView] = useState('loading'); // 'loading', 'entry', 'login', 'signup', 'dashboard', 'details'
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Save current view and client ID to sessionStorage whenever they change
  useEffect(() => {
    if (currentView !== 'loading') {
      sessionStorage.setItem('lastView', currentView);
      if (selectedClientId) {
        sessionStorage.setItem('lastSelectedClientId', selectedClientId);
      }
    }
  }, [currentView, selectedClientId]);

  // Initialize axios interceptor and check authentication on app load
  useEffect(() => {
    // Setup axios interceptors for JWT
    setupAxiosInterceptors();

    // Check if user has a token in sessionStorage
    const hasToken = !!sessionStorage.getItem('jwt_token');
    console.log('Checking authentication:', { hasToken });

    if (hasToken) {
      // Try to fetch clients list - if it works, token is valid
      fetch('http://localhost:8080/eswaradithya/clients/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('jwt_token')}`
        }
      })
        .then((response) => {
          if (response.ok) {
            // Token is valid - restore previous view
            console.log('Token verified - user authenticated');
            const adminInfo = authService.getAdminInfo();
            if (adminInfo && adminInfo.email) {
              setWelcomeMessage(`Welcome back ${adminInfo.name || adminInfo.email}!`);
              
              // Restore previous view from sessionStorage
              const lastView = sessionStorage.getItem('lastView');
              const lastClientId = sessionStorage.getItem('lastSelectedClientId');
              
              if (lastView === 'details' && lastClientId) {
                setSelectedClientId(parseInt(lastClientId));
                setCurrentView('details');
              } else {
                setCurrentView('dashboard');
              }
            }
            setIsAuthChecking(false);
          } else if (response.status === 401) {
            // Token is invalid/expired
            console.error('Token is invalid or expired');
            authService.clearToken();
            sessionStorage.removeItem('lastView');
            sessionStorage.removeItem('lastSelectedClientId');
            setCurrentView('entry');
            setIsAuthChecking(false);
          } else {
            // Other error
            console.error('Error verifying token:', response.status);
            setCurrentView('entry');
            setIsAuthChecking(false);
          }
        })
        .catch((error) => {
          console.error('Token verification failed:', error.message);
          authService.clearToken();
          sessionStorage.removeItem('lastView');
          sessionStorage.removeItem('lastSelectedClientId');
          setCurrentView('entry');
          setIsAuthChecking(false);
        });
    } else {
      // No token found - show entry page
      console.log('No token found. Showing entry page.');
      sessionStorage.removeItem('lastView');
      sessionStorage.removeItem('lastSelectedClientId');
      setCurrentView('entry');
      setIsAuthChecking(false);
    }
  }, []);

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
    // Clear JWT token and admin info
    authService.clearToken();
    // Clear saved view state
    sessionStorage.removeItem('lastView');
    sessionStorage.removeItem('lastSelectedClientId');
    setWelcomeMessage('');
    setCurrentView('entry');
  };

  // Helper: Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();

  // Helper: Redirect to entry if trying to access protected route without auth
  const handleProtectedView = (view) => {
    if (!isAuthenticated) {
      setCurrentView('entry');
      return;
    }
    setCurrentView(view);
  };

  return (
    <>
      {/* Loading Screen - Show while checking authentication */}
      {isAuthChecking && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-6"></div>
            <p className="text-white text-xl font-semibold">Verifying authentication...</p>
          </div>
        </div>
      )}

      {/* Entry Page */}
      {currentView === 'entry' && !isAuthChecking && (
        <EntryPage 
          onLoginClick={handleLoginClick}
          onSignUpClick={handleSignUpClick}
        />
      )}

      {/* Login Page */}
      {currentView === 'login' && !isAuthChecking && (
        <LoginForm
          onBackClick={handleLoginBack}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Sign-Up Page */}
      {currentView === 'signup' && !isAuthChecking && (
        <AdminForm
          onBackClick={handleSignUpBack}
          onSignUpSuccess={handleSignUpSuccess}
        />
      )}

      {/* Dashboard - Protected with authentication check */}
      {currentView === 'dashboard' && isAuthenticated && !isAuthChecking && (
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

      {/* Client Details Page - Protected with authentication check */}
      {currentView === 'details' && isAuthenticated && !isAuthChecking && (
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
