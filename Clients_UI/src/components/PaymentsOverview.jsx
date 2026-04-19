import React, { useState, useEffect } from 'react';
import { paymentAPI } from '../services/paymentAPI';

const PaymentsOverview = ({ clientId = null }) => {
  const [totalPayment, setTotalPayment] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clientId) {
      loadPaymentStats();
    }
  }, [clientId]);

  const loadPaymentStats = async () => {
    try {
      setLoading(true);
      
      // Get total payment amount
      const totalRes = await paymentAPI.getTotalPaymentByClient(clientId);
      setTotalPayment(totalRes.data?.data || 0);

      // Get payment count (rough estimate - we'll use first page)
      const paymentsRes = await paymentAPI.getPaymentsByClient(clientId, 0, 100);
      const payments = Array.isArray(paymentsRes.data.data) ? paymentsRes.data.data : [];
      setPaymentCount(payments.length);
    } catch (error) {
      console.error('Error loading payment stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Total Payment Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-green-100 text-sm font-semibold">Total Payments Received</p>
            <h3 className="text-3xl font-bold mt-2">
              {loading ? '...' : formatCurrency(totalPayment)}
            </h3>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>

      {/* Payment Count Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm font-semibold">Total Transactions</p>
            <h3 className="text-3xl font-bold mt-2">
              {loading ? '...' : paymentCount}
            </h3>
          </div>
          <div className="text-4xl">📊</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsOverview;
