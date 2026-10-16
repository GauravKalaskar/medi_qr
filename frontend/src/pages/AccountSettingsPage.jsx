import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Lock, UserX, Shield, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

const AccountSettingsPage = () => {
  const { user, logout } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    setLoading(true);

    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        setToast({ type: 'success', message: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!window.confirm('Are you sure you want to deactivate your MedSecure profile? Your QR code will stop functioning for emergency scanning.')) {
      return;
    }

    try {
      const res = await api.delete('/users/me');
      if (res.data.success) {
        alert('Account deactivated successfully.');
        logout();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to deactivate account.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-medical-600 bg-medical-50 px-3 py-1 rounded-full">
            Security & Controls
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            Account Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your password, account state, and emergency privacy consents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Change Password Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Lock className="w-4 h-4 text-medical-600" />
              <span>Change Security Password</span>
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars + Upper/Num"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Account Deactivation & Consents */}
          <div className="space-y-6">
            
            {/* Account Deactivation Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-red-600 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <UserX className="w-4 h-4" />
                <span>Deactivate Profile</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Deactivating your account will immediately turn off your QR code. Paramedics scanning your badge will see a deactivated notice.
              </p>
              <button
                onClick={handleDeactivateAccount}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition-colors"
              >
                Deactivate My MedSecure Profile
              </button>
            </div>

            {/* Active Consents Summary */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Emergency Data Consents</span>
              </h3>
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>EMERGENCY_QR_SHARING Accepted</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Allows authorized viewers scanning your QR token to read your emergency medical summary.
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Footer />
    </div>
  );
};

export default AccountSettingsPage;
