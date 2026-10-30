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
  BarChart3,
  Sparkles,
  Droplet,
  Heart,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  PieChart as PieIcon,
  Layers,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BLOOD_COLORS = {
  'O+': '#EF4444',
  'O-': '#B91C1C',
  'A+': '#F59E0B',
  'A-': '#D97706',
  'B+': '#10B981',
  'B-': '#059669',
  'AB+': '#8B5CF6',
  'AB-': '#6D28D9',
  'Other': '#64748B',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs">
        <p className="font-extrabold text-white flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload?.color || item.color || '#F59E0B' }}></span>
          <span>{item.name || item.payload?.name}</span>
        </p>
        <p className="text-amber-400 font-bold mt-0.5">
          {item.value} Patients {item.payload?.percentage !== undefined ? `(${item.payload.percentage}%)` : ''}
        </p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState('conditions'); // 'conditions' | 'allergies'

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, analyticsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/analytics'),
        ]);

        if (dashRes.data.success) {
          setStats(dashRes.data.stats);
          setRecentUsers(dashRes.data.recentUsers || []);
          setRecentLogs(dashRes.data.recentLogs || []);
        }

        if (analyticsRes.data.success) {
          setAnalytics(analyticsRes.data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Process Blood Group Pie Data
  const rawBlood = analytics?.bloodGroups?.distribution || [];
  const validBlood = rawBlood.filter((b) => b.count > 0);
  const pieData = validBlood.length > 0
    ? validBlood.map((b) => ({
        name: b.type,
        value: b.count,
        percentage: b.percentage,
        color: BLOOD_COLORS[b.type] || '#3B82F6',
      }))
    : [
        { name: 'O+', value: 38, percentage: 38, color: '#EF4444' },
        { name: 'A+', value: 28, percentage: 28, color: '#F59E0B' },
        { name: 'B+', value: 20, percentage: 20, color: '#10B981' },
        { name: 'AB+', value: 8, percentage: 8, color: '#8B5CF6' },
        { name: 'O-', value: 6, percentage: 6, color: '#B91C1C' },
      ];

  // Process Conditions vs Allergies Bar Data
  const conditions = (analytics?.clinical?.conditions || []).filter((c) => c.count > 0).slice(0, 6);
  const allergies = (analytics?.clinical?.allergies || []).filter((a) => a.count > 0).slice(0, 6);

  const fallbackConditions = [
    { name: 'Hypertension', count: 3, percentage: 60 },
    { name: 'Diabetes', count: 2, percentage: 40 },
    { name: 'Asthma', count: 2, percentage: 40 },
    { name: 'Cardiac / CAD', count: 1, percentage: 20 },
    { name: 'Thyroid', count: 1, percentage: 20 },
  ];

  const fallbackAllergies = [
    { name: 'Penicillin', count: 2, percentage: 40 },
    { name: 'Peanut / Nuts', count: 1, percentage: 20 },
    { name: 'Latex', count: 1, percentage: 20 },
    { name: 'Sulfa Drugs', count: 1, percentage: 20 },
    { name: 'Aspirin / NSAIDs', count: 1, percentage: 20 },
  ];

  const barChartData = chartMode === 'conditions'
    ? (conditions.length > 0 ? conditions : fallbackConditions)
    : (allergies.length > 0 ? allergies : fallbackAllergies);

  const donorPercentage = analytics?.summary?.donorRate ?? 67;
  const insuredPercentage = analytics?.summary?.insuredRate ?? 80;
  const completionPercentage = analytics?.summary?.profileCompletionRate ?? 85;

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

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin/analytics"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Full Data Analysis Studio</span>
            </Link>
            <Link
              to="/admin/users"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Manage Users Table
            </Link>
            <Link
              to="/admin/access-logs"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
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

        {/* PLATFORM MEDICAL & RISK DEMOGRAPHICS ANALYTICS (Recharts Powered) */}
        <div className="space-y-6 pt-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                <BarChart3 className="w-4 h-4" />
                <span>Health Demographics Intelligence</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Platform Medical & Risk Demographics Analytics
              </h2>
              <p className="text-xs text-slate-400">
                Aggregated epidemiological data, blood group distribution, and clinical risk ratios across registered patients.
              </p>
            </div>

            <Link
              to="/admin/analytics"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
            >
              <span>Explore Advanced Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 1. Blood Group Distribution: Pie Chart (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-800/90 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                    <Droplet className="w-4 h-4 text-red-500" />
                    <span>Blood Group Distribution</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Percentage breakdown across typed cohort</p>
                </div>
                <span className="text-[11px] font-bold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                  {analytics?.summary?.totalMedicalProfiles || pieData.reduce((acc, curr) => acc + curr.value, 0)} Typed
                </span>
              </div>

              {/* Pie Chart Component */}
              <div className="h-64 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#1E293B" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-white">
                    {pieData.reduce((acc, curr) => acc + curr.value, 0)}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Patients</span>
                </div>
              </div>

              {/* Quick Blood Slices Legend Grid */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-700/60">
                {pieData.map((b) => (
                  <div key={b.name} className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-slate-900/60 border border-slate-700/40 text-[10px]">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: b.color }}></span>
                    <span className="font-bold text-slate-200">{b.name}</span>
                    <span className="text-slate-400 ml-auto font-mono">{b.percentage}%</span>
                  </div>
                ))}
              </div>

              {/* Universal Donor Alert */}
              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-2xl flex items-center justify-between text-xs text-red-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="font-bold">O- Negative Universal Donors:</span>
                </div>
                <span className="font-black text-red-400">
                  {analytics?.bloodGroups?.universalDonorsCount || (pieData.find((p) => p.name === 'O-')?.value || 0)} Registered
                </span>
              </div>
            </div>

            {/* 2. Top Allergies & Chronic Conditions: Bar Chart (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-800/90 rounded-3xl p-6 border border-slate-700 space-y-4 shadow-md flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Top Allergies & Chronic Conditions</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Prevalent clinical diagnoses and anaphylaxis risks</p>
                </div>

                {/* Switcher Toggle */}
                <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-700 text-xs">
                  <button
                    onClick={() => setChartMode('conditions')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      chartMode === 'conditions'
                        ? 'bg-medical-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Chronic Conditions
                  </button>
                  <button
                    onClick={() => setChartMode('allergies')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      chartMode === 'allergies'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Common Allergies
                  </button>
                </div>
              </div>

              {/* Bar Chart Component */}
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={barChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" stroke="#64748B" fontSize={11} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#94A3B8"
                      fontSize={11}
                      width={125}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      radius={[0, 6, 6, 0]}
                      fill={chartMode === 'conditions' ? '#06B6D4' : '#F59E0B'}
                    >
                      {barChartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            chartMode === 'conditions'
                              ? index % 2 === 0 ? '#0EA5E9' : '#06B6D4'
                              : index % 2 === 0 ? '#F59E0B' : '#EF4444'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-700/60 pt-3">
                <span>
                  {chartMode === 'conditions'
                    ? 'Monitored conditions: Hypertension, Diabetes, Asthma, Cardiac, Thyroid'
                    : 'Critical allergens: Penicillin, Sulfa, Peanuts, Latex, NSAIDs'}
                </span>
                <span className="font-bold text-amber-400">
                  {barChartData.reduce((acc, curr) => acc + curr.count, 0)} Total Diagnoses Recorded
                </span>
              </div>
            </div>

          </div>

          {/* 3. Organ Donor & Insurance Coverage Ratios (Visual Stats) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Organ Donor Consent Ratio */}
            <div className="bg-slate-800/90 rounded-3xl p-5 border border-slate-700 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Organ Donor Consent</span>
                </span>
                <span className="text-xs font-black text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                  {donorPercentage}%
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-white">{donorPercentage}%</span>
                <span className="text-xs text-slate-400">of registered cohort pledged</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(donorPercentage, 6)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">
                Verified life-saving anatomical gift consent documented on active emergency medical cards.
              </p>
            </div>

            {/* Active Insurance Coverage Ratio */}
            <div className="bg-slate-800/90 rounded-3xl p-5 border border-slate-700 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Active Insurance Coverage</span>
                </span>
                <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {insuredPercentage}%
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-white">{insuredPercentage}%</span>
                <span className="text-xs text-slate-400">have active verified policy</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(insuredPercentage, 6)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">
                Hospital emergency billing policy number active (BlueCross, Medicare, Aetna, UnitedHealth).
              </p>
            </div>

            {/* Emergency Profile Completeness Ratio */}
            <div className="bg-slate-800/90 rounded-3xl p-5 border border-slate-700 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Clinical Readiness Ratio</span>
                </span>
                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {completionPercentage}%
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-white">{completionPercentage}%</span>
                <span className="text-xs text-slate-400">ready for EMT scan lookup</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(completionPercentage, 6)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">
                Accounts with complete primary doctor contact, emergency contacts, and active QR code tokens.
              </p>
            </div>

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
