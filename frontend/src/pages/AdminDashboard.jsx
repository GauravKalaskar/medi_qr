import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Users,
  UserCheck,
  UserX,
  QrCode,
  Activity,
  Shield,
  History,
  Search,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentUsers(res.data.recentUsers || []);
          setRecentLogs(res.data.recentLogs || []);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold border border-amber-400/20 mb-2">
              <Shield className="w-4 h-4" />
              <span>System Administrator Control Center</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Admin Dashboard & Metrics</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live overview of registered patients, active QR tokens, and system audit logs.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/users"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              Manage Users Table
            </Link>
            <Link
              to="/admin/access-logs"
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-all"
            >
              System Audit Logs
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          <div className="p-5 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Total Users</span>
              <Users className="w-4 h-4 text-medical-400" />
            </div>
            <span className="text-3xl font-black text-white">{stats?.totalUsers || 0}</span>
            <span className="text-[10px] text-slate-400 block">Registered Patient Accounts</span>
          </div>

          <div className="p-5 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Active Patients</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-emerald-400">{stats?.activeUsers || 0}</span>
            <span className="text-[10px] text-slate-400 block">Active Status</span>
          </div>

          <div className="p-5 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Inactive</span>
              <UserX className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-3xl font-black text-red-400">{stats?.inactiveUsers || 0}</span>
            <span className="text-[10px] text-slate-400 block">Deactivated Profiles</span>
          </div>

          <div className="p-5 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">QR Profiles</span>
              <QrCode className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-3xl font-black text-amber-400">{stats?.totalQRProfiles || 0}</span>
            <span className="text-[10px] text-slate-400 block">Active Tokens</span>
          </div>

          <div className="p-5 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-2 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Total Scans</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-3xl font-black text-purple-400">{stats?.totalScans || 0}</span>
            <span className="text-[10px] text-slate-400 block">Scan Audit Events</span>
          </div>

        </div>

        {/* Recent Registrations & Logs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recent Registrations Table */}
          <div className="bg-slate-800/90 p-6 rounded-3xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Recent Patient Registrations</span>
              </h3>
              <Link to="/admin/users" className="text-xs text-amber-400 hover:underline font-bold">
                View All Users →
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {recentUsers.map((u) => (
                <div key={u.id} className="p-3 bg-slate-900 rounded-2xl border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-100 block">{u.name}</span>
                    <span className="text-[11px] text-slate-400">{u.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded">
                      {u.medicalProfile?.bloodGroup || 'O+'}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent System Access Logs */}
          <div className="bg-slate-800/90 p-6 rounded-3xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <History className="w-4 h-4 text-purple-400" />
                <span>Recent Emergency QR Scan Events</span>
              </h3>
              <Link to="/admin/access-logs" className="text-xs text-purple-400 hover:underline font-bold">
                Full Audit Log →
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-900 rounded-2xl border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-100 block">
                      {log.qrProfile?.user?.name || 'Patient'}
                    </span>
                    <span className="text-[11px] text-slate-400">{log.accessType}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.accessedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
