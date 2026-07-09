import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { expenseAPI, categoryAPI } from '../services/api';
import { toast } from 'react-toastify';

const ExpenseFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    expenseNumber: '',
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    vendor: { name: '', email: '', phone: '' },
    paymentMethod: 'bank_transfer',
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchExpense();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll({ type: 'expense' });
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const fetchExpense = async () => {
    try {
      const response = await expenseAPI.getById(id);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to load expense');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    const vendorField = name.split('.')[1];
    setFormData((prev) => ({
      ...prev,
      vendor: {
        ...prev.vendor,
        [vendorField]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await expenseAPI.update(id, formData);
        toast.success('Expense updated successfully');
      } else {
        await expenseAPI.create(formData);
        toast.success('Expense created successfully');
      }
      navigate('/expenses');
    } catch (error) {
      toast.error(error.message || 'Failed to save expense');
    }
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {id ? 'Edit Expense' : 'Create New Expense'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card grid grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">{t('expense.expenseNumber')}</label>
            <input
              type="text"
              name="expenseNumber"
              value={formData.expenseNumber}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('expense.date')}</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('expense.category')}</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t('expense.amount')}</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input-field"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="card">
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="input-field"
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="check">Check</option>
              <option value="credit_card">Credit Card</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Vendor Info */}
        <div className="card grid grid-cols-3 gap-6">
          <div className="form-group">
            <label className="form-label">Vendor Name</label>
            <input
              type="text"
              name="vendor.name"
              value={formData.vendor.name}
              onChange={handleVendorChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Vendor Email</label>
            <input
              type="email"
              name="vendor.email"
              value={formData.vendor.email}
              onChange={handleVendorChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Vendor Phone</label>
            <input
              type="tel"
              name="vendor.phone"
              value={formData.vendor.phone}
              onChange={handleVendorChange}
              className="input-field"
            />
          </div>
        </div>

        {/* Description */}
        <div className="card">
          <div className="form-group">
            <label className="form-label">{t('expense.description')}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-field"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button type="submit" className="btn-primary">
            {id ? 'Update' : 'Create'} Expense
          </button>
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseFormPage;