import React, { useState, useEffect } from 'react';
import { clientAPI } from '../services/clientAPI';

const ClientsList = ({ onClientSelect, refreshTrigger }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientAPI.getAllClients();
      setClients(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch clients');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Clients</h2>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No clients found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div
              key={client.clientId}
              onClick={() => onClientSelect(client.clientId)}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-500 cursor-pointer transition duration-200 bg-gray-50 hover:bg-blue-50"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                {client.clientName}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="truncate">
                  <span className="font-semibold">📧 Email:</span> {client.email}
                </p>
                {client.companyName && (
                  <p className="truncate">
                    <span className="font-semibold">🏢 Company:</span> {client.companyName}
                  </p>
                )}
                {client.phone && (
                  <p className="truncate">
                    <span className="font-semibold">📱 Phone:</span> {client.phone}
                  </p>
                )}
                <p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    client.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status || 'ACTIVE'}
                  </span>
                </p>
              </div>
              <div className="mt-4 text-blue-600 text-sm font-semibold hover:text-blue-800">
                View Details →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsList;
