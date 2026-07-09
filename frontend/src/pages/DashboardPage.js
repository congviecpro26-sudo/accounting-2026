import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reportAPI } from '../services/api';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await reportAPI.getDashboard();
        setDashboard(response.data);
      } catch (error) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('dashboard.title')}</h1>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboard?.invoices?.total || 0}
              </p>
            </div>
            <span className="text-4xl">📄</span>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800">
                ₫{(dashboard?.invoices?.revenue || 0).toLocaleString()}
              </p>
            </div>
            <span className="text-4xl">💹</span>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-800">
                {dashboard?.expenses?.total || 0}
              </p>
            </div>
            <span className="text-4xl">💰</span>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Expense Amount</p>
              <p className="text-3xl font-bold text-gray-800">
                ₫{(dashboard?.expenses?.totalAmount || 0).toLocaleString()}
              </p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Invoices</h2>
          <div className="space-y-3">
            {dashboard?.invoices?.recent?.map((invoice) => (
              <div key={invoice._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold text-gray-800">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-500">{invoice.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    ₫{invoice.totalAmount.toLocaleString()}
                  </p>
                  <span className={`badge ${invoice.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Expenses</h2>
          <div className="space-y-3">
            {dashboard?.expenses?.recent?.map((expense) => (
              <div key={expense._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold text-gray-800">{expense.expenseNumber}</p>
                  <p className="text-sm text-gray-500">{expense.category?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    ₫{expense.amount.toLocaleString()}
                  </p>
                  <span className={`badge ${expense.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                    {expense.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
