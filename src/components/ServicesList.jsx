import React, { useState, useEffect, useCallback } from 'react';
import { servicesAPI } from '../services/servicesAPI';
import AddServiceForm from './AddServiceForm';

const ServicesList = ({ clientId, onServiceDeleted }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const fetchServices = useCallback(async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await servicesAPI.getServicesByClient(clientId, page, pageSize);
      const pageData = response.data.data;
      setServices(pageData.content || []);
      setTotalPages(pageData.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddService = async (serviceData) => {
    try {
      await servicesAPI.createService(clientId, serviceData);
      setShowAddForm(false);
      fetchServices(currentPage);
    } catch (err) {
      console.error('Error creating service:', err);
      throw err;
    }
  };

  const handleUpdateService = async (serviceData) => {
    try {
      await servicesAPI.updateService(editingService.serviceId, serviceData);
      setEditingService(null);
      fetchServices(currentPage);
    } catch (err) {
      console.error('Error updating service:', err);
      throw err;
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await servicesAPI.deleteService(deleteConfirm.serviceId);
      setDeleteConfirm(null);
      fetchServices(currentPage);
      if (onServiceDeleted) onServiceDeleted();
    } catch (err) {
      console.error('Error deleting service:', err);
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  };

  const getExpiryColor = (expiryStatus, expiryDate) => {
    if (!expiryDate) return 'text-gray-600';
    if (expiryStatus === 'EXPIRED') return 'text-red-600 font-semibold';
    if (expiryStatus === 'EXPIRING_SOON') return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  const getExpiryBgColor = (expiryStatus) => {
    if (expiryStatus === 'EXPIRED') return 'bg-red-50 border-l-4 border-red-500';
    if (expiryStatus === 'EXPIRING_SOON') return 'bg-yellow-50 border-l-4 border-yellow-500';
    return 'bg-green-50 border-l-4 border-green-500';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'RENEWAL_PENDING':
        return 'bg-orange-100 text-orange-800';
      case 'SUSPENDED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-gray-200 text-gray-900';
      case 'TRIAL':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading && services.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error && services.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          📋 Services ({services.length})
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
        >
          ➕ Add Service
        </button>
      </div>

      {/* Services Table */}
      {services.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Service Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Provider</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr
                  key={service.serviceId}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${getExpiryBgColor(
                    service.expiryStatus
                  )} ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {service.serviceName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                      {service.serviceType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {service.provider || '—'}
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium ${getExpiryColor(
                    service.expiryStatus,
                    service.expiryDate
                  )}`}>
                    {formatDate(service.expiryDate)}
                    {service.expiryStatus === 'EXPIRED' && (
                      <span className="ml-2 text-red-600 font-bold">⚠️ EXPIRED</span>
                    )}
                    {service.expiryStatus === 'EXPIRING_SOON' && (
                      <span className="ml-2 text-yellow-600 font-bold">⏰ SOON</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatCurrency(service.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                        service.status
                      )}`}
                    >
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditingService(service)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                        title="Edit service"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(service)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete service"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 px-6">
          <p className="text-gray-500 text-lg mb-4">📭 No services added yet</p>
          <p className="text-gray-400 text-sm mb-6">Start managing client services by adding one</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            ➕ Add First Service
          </button>
        </div>
      )}

      {/* Pagination */}
      {services.length > 0 && totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <button
            onClick={() => fetchServices(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-600 font-semibold">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => fetchServices(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddForm && (
        <AddServiceForm
          clientId={clientId}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddService}
        />
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <AddServiceForm
          clientId={clientId}
          service={editingService}
          onClose={() => setEditingService(null)}
          onSubmit={handleUpdateService}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🗑️ Delete Service?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.serviceName}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-semibold"
              >
                {deleting ? '🔄 Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
