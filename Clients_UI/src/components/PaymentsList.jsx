import React, { useState, useEffect } from 'react';
import { paymentAPI } from '../services/paymentAPI';
import AddPaymentForm from './AddPaymentForm';

const PaymentsList = ({ serviceId = null, clientId = null }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load payments on mount or filter change
  useEffect(() => {
    loadPayments();
  }, [currentPage, pageSize, serviceId, clientId]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setMessage(null);

      let response;
      if (serviceId) {
        response = await paymentAPI.getPaymentsByService(serviceId, currentPage, pageSize);
      } else if (clientId) {
        response = await paymentAPI.getPaymentsByClient(clientId, currentPage, pageSize);
      } else {
        // For now, show empty if no context
        setPayments([]);
        return;
      }

      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
      setMessageType('error');
      setMessage('Failed to load payments');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      setLoading(true);
      await paymentAPI.deletePayment(paymentId);
      
      setMessageType('success');
      setMessage('✅ Payment deleted successfully!');
      setDeleteConfirm(null);
      
      // Reload payments
      setTimeout(() => loadPayments(), 1000);
    } catch (error) {
      setMessageType('error');
      setMessage(`❌ ${error.response?.data?.message || 'Failed to delete payment'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAdded = (newPayment) => {
    setPayments([newPayment, ...payments]);
    setMessageType('success');
    setMessage('✅ Payment added successfully!');
    setTimeout(() => setMessage(null), 2000);
  };

  // Filter payments based on search term and status
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.transactionReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">💳 Payments</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          + Add Payment
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by transaction reference or method..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(0);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">All Statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        {/* Page Size */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(parseInt(e.target.value));
            setCurrentPage(0);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin text-blue-600">⌛</div>
          <p className="text-gray-600 mt-2">Loading payments...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPayments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>💬 No payments found. Start adding payments to track your revenue!</p>
        </div>
      )}

      {/* Payments Table */}
      {!loading && filteredPayments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Method</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Transaction Ref</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.paymentId} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">#{payment.paymentId}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.paymentMethod}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(payment.paymentDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.transactionReference || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm space-x-2">
                    <button
                      onClick={() => {
                        // View details or edit
                        alert(`Payment ID: ${payment.paymentId}\nAmount: ${formatCurrency(payment.amount)}`);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(payment.paymentId)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredPayments.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Page {currentPage + 1} of {Math.ceil((filteredPayments.length / pageSize) || 1)}
          </p>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-semibold rounded-lg transition"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={filteredPayments.length < pageSize}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-semibold rounded-lg transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this payment?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePayment(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Form Modal */}
      <AddPaymentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onPaymentAdded={handlePaymentAdded}
        serviceId={serviceId}
        clientId={clientId}
      />
    </div>
  );
};

export default PaymentsList;
