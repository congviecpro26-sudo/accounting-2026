import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    preferences: user?.preferences || { language: 'vi', currency: 'VND', timezone: 'Asia/Ho_Chi_Minh' },
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        phone: user.phone,
        preferences: user.preferences || { language: 'vi', currency: 'VND', timezone: 'Asia/Ho_Chi_Minh' },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await userAPI.update(user._id, formData);
      if (formData.preferences.language !== i18n.language) {
        i18n.changeLanguage(formData.preferences.language);
        localStorage.setItem('language', formData.preferences.language);
      }
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await userAPI.changePassword(user._id, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Settings</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="input-field bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('auth.fullName')}</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('auth.phone')}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? t('common.loading') : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Preferences */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Preferences</h2>
          <form className="space-y-4">
            <div className="form-group">
              <label className="form-label">Language</label>
              <select
                name="preferences.language"
                value={formData.preferences.language}
                onChange={handleChange}
                className="input-field"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                name="preferences.currency"
                value={formData.preferences.currency}
                onChange={handleChange}
                className="input-field"
              >
                <option value="VND">VND (₫)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Timezone</label>
              <select
                name="preferences.timezone"
                value={formData.preferences.timezone}
                onChange={handleChange}
                className="input-field"
              >
                <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh</option>
                <option value="Asia/Bangkok">Asia/Bangkok</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <button onClick={handleUpdateProfile} disabled={loading} className="btn-primary w-full">
              {loading ? t('common.loading') : 'Save Preferences'}
            </button>
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div className="card mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
        <form onSubmit={handleChangePassword} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="form-group">
            <label className="form-label">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="input-field"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary col-span-3">
            {loading ? t('common.loading') : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;