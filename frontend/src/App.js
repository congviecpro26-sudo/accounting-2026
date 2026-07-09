import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';
import './i18n/config';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InvoiceListPage from './pages/InvoiceListPage';
import InvoiceFormPage from './pages/InvoiceFormPage';
import ExpenseListPage from './pages/ExpenseListPage';
import ExpenseFormPage from './pages/ExpenseFormPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Store
import { useAuthStore } from './store/authStore';

function App() {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Set saved language preference
    const savedLanguage = localStorage.getItem('language') || 'vi';
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            isAuthenticated() ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/invoices" element={<InvoiceListPage />} />
                  <Route path="/invoices/new" element={<InvoiceFormPage />} />
                  <Route path="/invoices/:id" element={<InvoiceFormPage />} />
                  <Route path="/expenses" element={<ExpenseListPage />} />
                  <Route path="/expenses/new" element={<ExpenseFormPage />} />
                  <Route path="/expenses/:id" element={<ExpenseFormPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
