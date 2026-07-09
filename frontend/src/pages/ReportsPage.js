import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reportAPI } from '../services/api';
import { toast } from 'react-toastify';

const ReportsPage = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState({
    income: [],
    expense: [],
    expenseByCategory: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const [income, expense, expenseByCategory] = await Promise.all([
        reportAPI.getIncomeReport(params),
        reportAPI.getExpenseReport(params),
        reportAPI.getExpenseByCategory(params),
      ]);

      setReports({
        income: income.data,
        expense: expense.data,
        expenseByCategory: expenseByCategory.data,
      });
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('reports.title')}</h1>

      {/* Date Range Filter */}
      <div className="card mb-6">
        <div className="grid grid-cols-4 gap-4 items-end">
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="input-field"
            />
          </div>
          <button onClick={fetchReports} className="btn-primary">
            Filter
          </button>
          <button
            onClick={() => {
              setDateRange({ startDate: '', endDate: '' });
              fetchReports();
            }}
            className="btn-secondary"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Income Report */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('reports.income')}</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Month/Year</th>
                <th>Total Revenue</th>
                <th>Number of Invoices</th>
              </tr>
            </thead>
            <tbody>
              {reports.income.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No data
                  </td>
                </tr>
              ) : (
                reports.income.map((item, index) => (
                  <tr key={index}>
                    <td>{`${item._id.month}/${item._id.year}`}</td>
                    <td className="font-bold text-green-600">₫{item.total.toLocaleString()}</td>
                    <td>{item.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Report */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('reports.expense')}</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Month/Year</th>
                <th>Total Expense</th>
                <th>Number of Expenses</th>
              </tr>
            </thead>
            <tbody>
              {reports.expense.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No data
                  </td>
                </tr>
              ) : (
                reports.expense.map((item, index) => (
                  <tr key={index}>
                    <td>{`${item._id.month}/${item._id.year}`}</td>
                    <td className="font-bold text-red-600">₫{item.total.toLocaleString()}</td>
                    <td>{item.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense by Category */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Expense by Category</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Amount</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {reports.expenseByCategory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No data
                  </td>
                </tr>
              ) : (
                (() => {
                  const totalAmount = reports.expenseByCategory.reduce((sum, item) => sum + item.total, 0);
                  return reports.expenseByCategory.map((item, index) => (
                    <tr key={index}>
                      <td className="font-semibold">{item.categoryDetails?.[0]?.name || 'N/A'}</td>
                      <td className="font-bold">₫{item.total.toLocaleString()}</td>
                      <td>{item.count}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(item.total / totalAmount) * 100}%` }}
                            ></div>
                          </div>
                          <span>{((item.total / totalAmount) * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ));
                })()
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;