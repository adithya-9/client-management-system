import React, { useState, useEffect, useCallback } from 'react';
import { clientAPI } from '../services/clientAPI';
import ServicesList from './ServicesList';

const ClientDetails = ({ clientId, onBack, onClientDeleted }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const fetchClientDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientAPI.getClientById(clientId);
      setClient(response.data.data);
    } catch (err) {
      setError('Failed to fetch client details');
      console.error('Error fetching client:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClientDetails();
  }, [fetchClientDetails]);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteMessage(null);
    try {
      await clientAPI.deleteClient(clientId);
      setDeleteMessage('✅ Client deleted successfully!');
      setTimeout(() => {
        if (onClientDeleted) onClientDeleted();
        onBack();
      }, 1500);
    } catch (err) {
      setDeleteMessage('❌ Error deleting client. Please try again.');
      console.error('Error deleting client:', err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <button
          onClick={onBack}
          className="mb-4 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to Clients
        </button>
        <div className="p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
          ❌ {error}
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <button
          onClick={onBack}
          className="mb-4 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to Clients
        </button>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Client not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <button
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center"
        >
          ← Back to Clients
        </button>

        {deleteMessage && (
          <div className={`mb-6 p-4 rounded-lg ${deleteMessage.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {deleteMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{client.clientName}</h2>
          <p className="text-gray-600 mb-6">Client ID: {client.clientId}</p>

          <div className="space-y-6">
            {/* Email */}
            <div className="border-l-4 border-blue-500 pl-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                📧 Email
              </label>
              <p className="text-lg text-gray-900">{client.email}</p>
            </div>

            {/* Company */}
            {client.companyName && (
              <div className="border-l-4 border-purple-500 pl-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  🏢 Company Name
                </label>
                <p className="text-lg text-gray-900">{client.companyName}</p>
              </div>
            )}

            {/* Phone */}
            {client.phone && (
              <div className="border-l-4 border-green-500 pl-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  📱 Phone
                </label>
                <p className="text-lg text-gray-900">{client.phone}</p>
              </div>
            )}

            {/* Website */}
            {client.websiteUrl && (
              <div className="border-l-4 border-orange-500 pl-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  🌐 Website
                </label>
                <a 
                  href={client.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg text-blue-600 hover:underline"
                >
                  {client.websiteUrl}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Status & Notes */}
        <div>
          {/* Status */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Status
            </label>
            <div>
              <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                client.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {client.status || 'ACTIVE'}
              </span>
            </div>
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                📝 Notes
              </label>
              <p className="text-gray-700">{client.notes}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-xs text-gray-500 space-y-1">
            {client.createdAt && (
              <p>Created: {new Date(client.createdAt).toLocaleString()}</p>
            )}
            {client.updatedAt && (
              <p>Updated: {new Date(client.updatedAt).toLocaleString()}</p>
            )}
          </div>

          {/* Delete Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                🗑️ Delete Client
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-red-600 font-semibold text-center">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 rounded-lg transition"
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Services Section */}
      <div>
        <ServicesList clientId={clientId} onServiceDeleted={onClientDeleted} />
      </div>
    </div>
  );
};

export default ClientDetails;
