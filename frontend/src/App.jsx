import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminLoginPage from './pages/AdminLoginPage';
import QRScanPage from './pages/QRScanPage';
import PublicMedicalProfilePage from './pages/PublicMedicalProfilePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Patient Protected Pages
import UserDashboard from './pages/UserDashboard';
import MedicalProfilePage from './pages/MedicalProfilePage';
import MyQRPage from './pages/MyQRPage';
import AccessHistoryPage from './pages/AccessHistoryPage';
import AccountSettingsPage from './pages/AccountSettingsPage';

// Admin Protected Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminMedicalProfilesPage from './pages/AdminMedicalProfilesPage';
import AdminAccessLogsPage from './pages/AdminAccessLogsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/scan" element={<QRScanPage />} />
          <Route path="/medical/:token" element={<PublicMedicalProfilePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Patient Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-profile"
            element={
              <ProtectedRoute>
                <MedicalProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-qr"
            element={
              <ProtectedRoute>
                <MyQRPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/access-history"
            element={
              <ProtectedRoute>
                <AccessHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/medical-profiles"
            element={
              <AdminRoute>
                <AdminMedicalProfilesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/access-logs"
            element={
              <AdminRoute>
                <AdminAccessLogsPage />
              </AdminRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
