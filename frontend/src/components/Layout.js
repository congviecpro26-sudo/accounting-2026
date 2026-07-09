import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

const Layout = ({ children }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white shadow-lg">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">Accounting 2026</h1>
          <p className="text-sm text-blue-100">Modern Accounting System</p>
        </div>

        <nav className="mt-6">
          <Link
            to="/"
            className="block px-6 py-3 hover:bg-blue-700 transition-colors"
          >
            📊 {t('dashboard.title')}
          </Link>
          <Link
            to="/invoices"
            className="block px-6 py-3 hover:bg-blue-700 transition-colors"
          >
            📄 {t('invoice.title')}
          </Link>
          <Link
            to="/expenses"
            className="block px-6 py-3 hover:bg-blue-700 transition-colors"
          >
            💰 {t('expense.title')}
          </Link>
          <Link
            to="/reports"
            className="block px-6 py-3 hover:bg-blue-700 transition-colors"
          >
            📈 {t('reports.title')}
          </Link>
          <Link
            to="/settings"
            className="block px-6 py-3 hover:bg-blue-700 transition-colors"
          >
            ⚙️ Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-gray-800 font-semibold">Welcome, {user?.fullName}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleLanguageChange('vi')}
                  className={`px-3 py-1 rounded ${
                    i18n.language === 'vi'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1 rounded ${
                    i18n.language === 'en'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-gray-700">{user?.fullName}</span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
                    <button
                      onClick={() => navigate('/settings')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      ⚙️ Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 border-t"
                    >
                      🚪 {t('auth.logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
