import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { invoiceAPI } from '../services/api';
import { toast } from 'react-toastify';

const InvoiceFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ description: '', quantity: 1, unitPrice: 0, taxRate: 10 }],
    notes: '',
  });

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await invoiceAPI.getById(id);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'description' ? value : parseFloat(value) || 0;
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
    }
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: '', quantity: 1, unitPrice: 0, taxRate: 10, amount: 0 },
      ],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await invoiceAPI.update(id, formData);
        toast.success('Invoice updated successfully');
      } else {
        await invoiceAPI.create(formData);
        toast.success('Invoice created successfully');
      }
      navigate('/invoices');
    } catch (error) {
      toast.error(error.message || 'Failed to save invoice');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = formData.items.reduce((sum, item) => sum + ((item.amount || 0) * (item.taxRate || 0) / 100), 0);
  const total = subtotal + taxAmount;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {id ? 'Edit Invoice' : 'Create New Invoice'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Header */}
        <div className="card grid grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">{t('invoice.invoiceNumber')}</label>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('invoice.issueDate')}</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('invoice.customer')}</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('invoice.dueDate')}</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Customer Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Customer Phone</label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        {/* Items */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{t('invoice.items')}</h2>
            <button
              type="button"
              onClick={addItem}
              className="btn-primary"
            >
              + Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>{t('invoice.description')}</th>
                  <th>{t('invoice.quantity')}</th>
                  <th>{t('invoice.unitPrice')}</th>
                  <th>{t('invoice.taxRate')} (%)</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="input-field"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="input-field"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        className="input-field"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.taxRate}
                        onChange={(e) => handleItemChange(index, 'taxRate', e.target.value)}
                        className="input-field"
                      />
                    </td>
                    <td className="font-bold">₫{(item.amount || 0).toLocaleString()}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="card">
          <div className="space-y-2 text-right">
            <div className="flex justify-end gap-4">
              <span className="text-gray-600">{t('invoice.subtotal')}:</span>
              <span className="font-bold w-32">₫{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-600">{t('invoice.tax')}:</span>
              <span className="font-bold w-32">₫{taxAmount.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-end gap-4">
              <span className="text-lg font-bold text-gray-800">{t('invoice.total')}:</span>
              <span className="text-lg font-bold w-32 text-blue-600">₫{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="input-field"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button type="submit" className="btn-primary">
            {id ? 'Update' : 'Create'} Invoice
          </button>
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceFormPage;