import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { expenseAPI, categoryAPI } from '../services/api';
import { toast } from 'react-toastify';

const ExpenseListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll({ type: 'expense' });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getAll(filters);
      setExpenses(response.data);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await expenseAPI.delete(id);
        setExpenses(expenses.filter(exp => exp._id !== id));
        toast.success('Expense deleted');
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await expenseAPI.approve(id);
      fetchExpenses();
      toast.success('Expense approved');
    } catch (error) {
      toast.error('Failed to approve expense');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('expense.title')}</h1>
        <button
          onClick={() => navigate('/expenses/new')}
          className="btn-primary"
        >
          + {t('expense.createNew')}
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="input-field"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading-spinner"></div>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('common.noData')}
          </div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th>{t('expense.expenseNumber')}</th>
                <th>{t('expense.category')}</th>
                <th>{t('expense.amount')}</th>
                <th>{t('expense.date')}</th>
                <th>{t('expense.status')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td className="font-semibold">{expense.expenseNumber}</td>
                  <td>{expense.category?.name || 'N/A'}</td>
                  <td className="font-bold">₫{expense.amount.toLocaleString()}</td>
                  <td>{new Date(expense.date).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`badge ${
                      expense.status === 'approved' ? 'badge-success' :
                      expense.status === 'pending' ? 'badge-warning' :
                      expense.status === 'paid' ? 'badge-success' :
                      'badge-info'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/expenses/${expense._id}`)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    {expense.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(expense._id)}
                        className="text-green-600 hover:underline mr-3"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpenseListPage;