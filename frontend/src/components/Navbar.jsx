import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  QrCode,
  Scan,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  FileText,
  History,
  Activity,
  ChevronRight,
  Settings,
  BarChart3,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to={isAdmin ? '/admin/dashboard' : '/'} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medical-700 to-medical-500 flex items-center justify-center text-white shadow-md shadow-medical-500/20 group-hover:scale-105 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-medical-800 to-medical-600 bg-clip-text text-transparent">
                MedSecure<span className="text-red-600">QR</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-1">
                Emergency Information System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/scan"
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1.5 transition-colors ${
                isActive('/scan')
                  ? 'bg-red-50 text-red-600'
                  : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>Scan QR</span>
            </Link>

            {!isAuthenticated && (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/') ? 'text-medical-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/privacy"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Privacy Policy
                </Link>
              </>
            )}

            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'bg-medical-50 text-medical-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/medical-profile"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/medical-profile') ? 'bg-medical-50 text-medical-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Medical Profile
                </Link>
                <Link
                  to="/my-qr"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/my-qr') ? 'bg-medical-50 text-medical-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My QR Code
                </Link>
                <Link
                  to="/access-history"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/access-history') ? 'bg-medical-50 text-medical-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Scan Logs
                </Link>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/dashboard') ? 'bg-slate-900 text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Admin Overview
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/analytics') ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Data Analytics
                </Link>
                <Link
                  to="/admin/users"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/users') ? 'bg-slate-900 text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Manage Users
                </Link>
                <Link
                  to="/admin/access-logs"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/access-logs') ? 'bg-slate-900 text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Global Logs
                </Link>
              </>
            )}
          </nav>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    isAdmin ? 'bg-slate-900 text-amber-400' : 'bg-medical-100 text-medical-700'
                  }`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-xs font-bold text-slate-800 line-clamp-1">{user?.name}</span>
                    <span className="block text-[10px] text-slate-500 font-medium capitalize">
                      {isAdmin ? '🛡️ System Admin' : 'Patient Account'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out of account"
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-medical-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Patient Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-medical-600 hover:bg-medical-700 rounded-lg shadow-sm shadow-medical-500/30 transition-all hover:scale-[1.02]"
                >
                  Register Free
                </Link>
                <Link
                  to="/admin/login"
                  title="Administrator Login"
                  className="p-2 text-slate-400 hover:text-slate-800 transition-colors ml-1"
                >
                  <Shield className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              to="/scan"
              className="p-2 rounded-lg bg-red-50 text-red-600 font-medium text-xs flex items-center space-x-1"
            >
              <Scan className="w-4 h-4" />
              <span>Scan</span>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slideout Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          {isAuthenticated ? (
            <div className="p-3 bg-slate-50 rounded-xl mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-medical-600 text-white font-bold flex items-center justify-center text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-medical-100 text-medical-800'}`}>
                {isAdmin ? 'ADMIN' : 'PATIENT'}
              </span>
            </div>
          ) : null}

          <div className="space-y-1">
            <Link
              to="/scan"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-red-50 text-red-700 font-semibold"
            >
              <span className="flex items-center space-x-2">
                <Scan className="w-5 h-5 text-red-600" />
                <span>Emergency QR Scanner</span>
              </span>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-medical-600" />
                    <span>User Dashboard</span>
                  </span>
                </Link>
                <Link
                  to="/medical-profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-medical-600" />
                    <span>Medical Profile</span>
                  </span>
                </Link>
                <Link
                  to="/my-qr"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5 text-medical-600" />
                    <span>My QR Code</span>
                  </span>
                </Link>
                <Link
                  to="/access-history"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <History className="w-5 h-5 text-medical-600" />
                    <span>Scan History</span>
                  </span>
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-slate-500" />
                    <span>Account Settings</span>
                  </span>
                </Link>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-lg bg-slate-900 text-white font-medium"
                >
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span>Admin Dashboard</span>
                </Link>
                <Link
                  to="/admin/analytics"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                >
                  <BarChart3 className="w-5 h-5 text-amber-500" />
                  <span>Data Analytics</span>
                </Link>
                <Link
                  to="/admin/users"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                >
                  <User className="w-5 h-5 text-slate-600" />
                  <span>Manage Users</span>
                </Link>
                <Link
                  to="/admin/access-logs"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
                >
                  <History className="w-5 h-5 text-slate-600" />
                  <span>System Audit Logs</span>
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-2.5 px-4 font-semibold text-slate-800 bg-slate-100 rounded-xl"
                >
                  Patient Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-2.5 px-4 font-semibold text-white bg-medical-600 rounded-xl shadow-md shadow-medical-500/20"
                >
                  Register Free
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-2 text-xs font-semibold text-slate-500"
                >
                  Admin Portal Access
                </Link>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="w-full mt-4 py-2.5 px-4 flex items-center justify-center space-x-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
