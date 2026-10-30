import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  BarChart3,
  TrendingUp,
  Activity,
  ShieldAlert,
  Heart,
  Droplet,
  Users,
  Clock,
  Smartphone,
  Download,
  Printer,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  PieChart,
  UserCheck,
  Stethoscope,
  Info,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clinical'); // 'clinical' | 'blood' | 'demographics' | 'scans' | 'insights'
  const [selectedBlood, setSelectedBlood] = useState('O-');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const res = await api.get('/admin/analytics');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Blood compatibility dictionary
  const bloodCompatibility = {
    'O-': {
      gives: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+ (Universal Red Cell Donor)'],
      receives: ['O- only'],
      rarity: 'Rare (approx 7% of population) — Universal Donor',
      tag: 'Critical Emergency Reserve',
    },
    'O+': {
      gives: ['O+', 'A+', 'B+', 'AB+'],
      receives: ['O+', 'O-'],
      rarity: 'Most Common (approx 38% of population)',
      tag: 'High Demand Blood Type',
    },
    'A-': {
      gives: ['A-', 'A+', 'AB-', 'AB+'],
      receives: ['A-', 'O-'],
      rarity: 'Uncommon (approx 6%)',
      tag: 'Universal Platelet Donor',
    },
    'A+': {
      gives: ['A+', 'AB+'],
      receives: ['A+', 'A-', 'O+', 'O-'],
      rarity: 'Common (approx 34%)',
      tag: 'Key Trauma Blood Type',
    },
    'B-': {
      gives: ['B-', 'B+', 'AB-', 'AB+'],
      receives: ['B-', 'O-'],
      rarity: 'Very Rare (approx 1.5%)',
      tag: 'Specialized Reserve',
    },
    'B+': {
      gives: ['B+', 'AB+'],
      receives: ['B+', 'B-', 'O+', 'O-'],
      rarity: 'Moderate (approx 9%)',
      tag: 'Regional Need',
    },
    'AB-': {
      gives: ['AB-', 'AB+'],
      receives: ['AB-', 'A-', 'B-', 'O-'],
      rarity: 'Rarest (approx 0.6%)',
      tag: 'Universal Plasma Donor',
    },
    'AB+': {
      gives: ['AB+ only'],
      receives: ['All Blood Types (Universal Red Cell Recipient)'],
      rarity: 'Rare (approx 3%)',
      tag: 'Universal Recipient',
    },
  };

  const handleExportJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medsecure-analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-400 animate-pulse">
            Synthesizing clinical & emergency data analytics...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const { summary, bloodGroups, demographics, clinical, scans, insights } = data || {};

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 print:bg-white print:text-black">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-900 p-6 rounded-3xl border border-slate-700/80 shadow-xl">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold border border-amber-400/20 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>Healthcare Intelligence & Surveillance Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Clinical & Emergency Data Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Real-time statistical breakdown of patient blood registries, chronic morbidities, anaphylaxis alerts, and emergency QR scan traffic patterns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              onClick={fetchAnalytics}
              disabled={refreshing}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-medical-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF Report</span>
            </button>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Patients</span>
              <Users className="w-4 h-4 text-medical-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{summary?.totalUsers || 0}</div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
              <UserCheck className="w-3 h-3" />
              <span>{summary?.activeUsers || 0} Verified Active</span>
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Profile Readiness</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {summary?.profileCompletionRate || 0}%
            </div>
            <div className="text-[11px] text-slate-400">
              {summary?.totalMedicalProfiles || 0} Complete Records
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Emergency Scans</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400">
              {summary?.totalScans || 0}
            </div>
            <div className="text-[11px] text-slate-400">
              Live Scanner Logs
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Universal Donors</span>
              <Droplet className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-red-400">
              {bloodGroups?.universalDonorsCount || 0}
            </div>
            <div className="text-[11px] text-red-400/90 font-medium">
              O- Negative (Life-Saving)
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Organ Donor Rate</span>
              <Heart className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-pink-400">
              {summary?.donorRate || 0}%
            </div>
            <div className="text-[11px] text-slate-400">
              Pledged Organ Donors
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Avg Patient Age</span>
              <Stethoscope className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {summary?.averageAge ? `${summary.averageAge} yrs` : 'N/A'}
            </div>
            <div className="text-[11px] text-slate-400">
              Insured: {summary?.insuredRate || 0}%
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-2 border-b border-slate-800 pb-2 print:hidden">
          {[
            { id: 'clinical', label: 'Clinical & Disease Matrix', icon: Stethoscope },
            { id: 'blood', label: 'Blood Group Intelligence', icon: Droplet },
            { id: 'demographics', label: 'Demographics & Cohorts', icon: Users },
            { id: 'scans', label: 'Emergency Scan Traffic', icon: Activity },
            { id: 'insights', label: 'Automated Clinical Insights', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: CLINICAL & MORBIDITY MATRIX */}
        {(activeTab === 'clinical' || window.matchMedia?.('print')?.matches) && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chronic Disease Prevalence */}
              <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span>Chronic Morbidity Prevalence</span>
                    </h3>
                    <p className="text-xs text-slate-400">Prevalent conditions recorded in emergency medical profiles</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    Morbidity Index
                  </span>
                </div>

                <div className="space-y-3.5 pt-2">
                  {clinical?.conditions?.length > 0 ? (
                    clinical.conditions.map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-200">{item.name}</span>
                          <span className="text-slate-400">
                            {item.count} patient(s) <span className="text-medical-400 font-bold ml-1">({item.percentage}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-medical-500 to-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(item.percentage, item.count > 0 ? 5 : 0)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 text-center py-6">No conditions registered yet.</div>
                  )}
                </div>
              </div>

              {/* Critical Drug & Food Allergies */}
              <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center space-x-2">
                      <ShieldAlert className="w-5 h-5 text-amber-400" />
                      <span>Critical Allergies & Anaphylaxis Alerts</span>
                    </h3>
                    <p className="text-xs text-slate-400">High-risk allergens requiring EMS emergency intervention</p>
                  </div>
                  <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20">
                    High Caution
                  </span>
                </div>

                <div className="space-y-3.5 pt-2">
                  {clinical?.allergies?.length > 0 ? (
                    clinical.allergies.map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-200">{item.name}</span>
                          <span className="text-slate-400">
                            {item.count} flagged <span className="text-red-400 font-bold ml-1">({item.percentage}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(item.percentage, item.count > 0 ? 5 : 0)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 text-center py-6">No allergies recorded yet.</div>
                  )}
                </div>
              </div>

            </div>

            {/* Insurance & Lifestyle Health Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-4">
                <h4 className="text-sm font-extrabold text-white flex items-center space-x-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Insurance Market Share</span>
                </h4>
                <div className="space-y-2.5">
                  {clinical?.topInsurers?.length > 0 ? (
                    clinical.topInsurers.map((ins, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-700/60 last:border-0">
                        <span className="font-medium text-slate-300">{ins.name}</span>
                        <span className="font-bold text-emerald-400">{ins.count} policyholders</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 py-4 text-center">No insurance data logged.</div>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-4">
                <h4 className="text-sm font-extrabold text-white flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Lifestyle Risk Index</span>
                </h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-300">Tobacco / Nicotine Use</span>
                      <span className="text-amber-400">{summary?.smokersRate || 0}% active smokers</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${summary?.smokersRate || 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-300">Organ Donation Pledge</span>
                      <span className="text-pink-400">{summary?.donorRate || 0}% pledged</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500" style={{ width: `${summary?.donorRate || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-4">
                <h4 className="text-sm font-extrabold text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-medical-400" />
                  <span>Clinical Readiness Score</span>
                </h4>
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-700"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-medical-400"
                        strokeDasharray={`${summary?.profileCompletionRate || 0}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-base font-black text-white">
                      {summary?.profileCompletionRate || 0}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="font-bold text-slate-200">Patient Emergency Completeness</p>
                    <p>Percentage of registered accounts with active medical profiles & emergency contacts.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: BLOOD GROUP INTELLIGENCE */}
        {(activeTab === 'blood' || window.matchMedia?.('print')?.matches) && (
          <div className="space-y-6">
            
            {/* Blood Type Grid Matrix */}
            <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                    <Droplet className="w-5 h-5 text-red-500" />
                    <span>Blood Group Registry & Frequency Distribution</span>
                  </h3>
                  <p className="text-xs text-slate-400">Click any blood group below to inspect transfusion compatibility.</p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {summary?.totalMedicalProfiles || 0} Total Typed Patients
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
                {bloodGroups?.distribution?.map((item) => {
                  const isSelected = selectedBlood === item.type;
                  return (
                    <button
                      key={item.type}
                      onClick={() => setSelectedBlood(item.type)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-red-500/20 border-red-500 ring-2 ring-red-500/50 scale-105'
                          : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-2xl font-black text-white">{item.type}</div>
                      <div className="text-sm font-bold text-red-400 mt-1">{item.count}</div>
                      <div className="text-[10px] text-slate-400">{item.percentage}%</div>
                      {item.isUniversalDonor && (
                        <span className="block mt-2 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          Univ. Donor
                        </span>
                      )}
                      {item.isUniversalRecipient && (
                        <span className="block mt-2 text-[9px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                          Univ. Recipient
                        </span>
                      )}
                      {item.isRare && !item.isUniversalDonor && (
                        <span className="block mt-2 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                          Rare
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Compatibility Inspector */}
            {selectedBlood && bloodCompatibility[selectedBlood] && (
              <div className="bg-gradient-to-r from-red-950/40 via-slate-800 to-slate-800/90 rounded-3xl p-6 border border-red-500/30 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                      {selectedBlood}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white">
                        Blood Compatibility Profile: <span className="text-red-400">{selectedBlood}</span>
                      </h4>
                      <p className="text-xs text-slate-400">{bloodCompatibility[selectedBlood].rarity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    {bloodCompatibility[selectedBlood].tag}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/80 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      Can Donate Red Blood Cells To:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {bloodCompatibility[selectedBlood].gives.map((b, i) => (
                        <span key={i} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 font-bold text-xs rounded-lg border border-emerald-500/20">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/80 space-y-2">
                    <span className="text-xs font-bold text-medical-400 uppercase tracking-wider block">
                      Can Receive Red Blood Cells From:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {bloodCompatibility[selectedBlood].receives.map((b, i) => (
                        <span key={i} className="px-2.5 py-1 bg-medical-500/10 text-medical-300 font-bold text-xs rounded-lg border border-medical-500/20">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: DEMOGRAPHICS & POPULATION HEALTH */}
        {(activeTab === 'demographics' || window.matchMedia?.('print')?.matches) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Age Cohorts Distribution */}
            <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <span>Age Pyramid & Cohort Analysis</span>
                  </h3>
                  <p className="text-xs text-slate-400">Patient population distributed across chronological stages</p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  Avg: {summary?.averageAge || 'N/A'} yrs
                </span>
              </div>

              <div className="space-y-3.5 pt-2">
                {demographics?.ageGroups &&
                  Object.entries(demographics.ageGroups).map(([group, count], idx) => {
                    const total = summary?.totalUsers || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">{group}</span>
                          <span className="text-slate-400">
                            {count} patients <span className="text-amber-400 font-bold ml-1">({pct}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                            style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Gender Demographics */}
            <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-medical-400" />
                    <span>Gender Identity Distribution</span>
                  </h3>
                  <p className="text-xs text-slate-400">Demographic composition of registered patient cohort</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4">
                {[
                  { label: 'Male', count: demographics?.gender?.Male || 0, color: 'text-medical-400', bg: 'bg-medical-500/10', border: 'border-medical-500/30' },
                  { label: 'Female', count: demographics?.gender?.Female || 0, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
                  { label: 'Other', count: demographics?.gender?.Other || 0, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
                ].map((g, i) => {
                  const total = summary?.totalUsers || 1;
                  const pct = Math.round((g.count / total) * 100);
                  return (
                    <div key={i} className={`p-4 rounded-2xl border ${g.border} ${g.bg} text-center space-y-1`}>
                      <span className="text-xs font-bold text-slate-300 block">{g.label}</span>
                      <span className={`text-3xl font-black ${g.color} block`}>{g.count}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{pct}% of cohort</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/60 text-xs text-slate-400 space-y-1">
                <p className="font-bold text-slate-300 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-medical-400" />
                  <span>Demographic Completeness Note:</span>
                </p>
                <p>Gender and date of birth are optional for basic registration, but strongly advised for emergency pediatric or geriatric dosing calibration.</p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: EMERGENCY SCAN TRAFFIC INTELLIGENCE */}
        {(activeTab === 'scans' || window.matchMedia?.('print')?.matches) && (
          <div className="space-y-6">
            
            {/* 14-Day Scan Timeline Chart */}
            <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <span>Emergency QR Scan Velocity (Last 14 Days)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Daily volume of emergency barcode decodes and patient profile lookups</p>
                </div>
                <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  Total: {summary?.totalScans || 0} scans logged
                </span>
              </div>

              {/* Responsive SVG Bar Graph */}
              <div className="h-44 flex items-end justify-between gap-1 sm:gap-2 pt-6 px-2">
                {scans?.timeline?.map((day, idx) => {
                  const maxCount = Math.max(...(scans.timeline.map((d) => d.count) || [1]), 5);
                  const barHeight = Math.max((day.count / maxCount) * 100, 6);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition">
                        {day.count}
                      </span>
                      <div className="w-full bg-slate-900 rounded-t-lg h-28 flex items-end overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-purple-600 to-indigo-400 rounded-t-lg group-hover:from-purple-500 group-hover:to-amber-400 transition-all duration-300"
                          style={{ height: `${barHeight}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-slate-500 truncate w-full text-center">
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Devices & Top Patients */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Scanner Device Intelligence */}
              <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-4">
                <h4 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-medical-400" />
                  <span>Scanner Hardware & Platform Breakdown</span>
                </h4>
                <p className="text-xs text-slate-400">Operating systems used by paramedics and emergency responders</p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { label: 'Mobile Smartphones', count: scans?.devices?.Mobile || 0, desc: 'iOS & Android First Responders' },
                    { label: 'Desktop / Workstation', count: scans?.devices?.Desktop || 0, desc: 'Hospital Triage Terminals' },
                    { label: 'Tablets / EMS iPads', count: scans?.devices?.Tablet || 0, desc: 'Ambulance Field Tablets' },
                    { label: 'Automated / Unknown', count: scans?.devices?.Unknown || 0, desc: 'Optical Hardware Scanners' },
                  ].map((dev, i) => (
                    <div key={i} className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/80 space-y-1">
                      <span className="text-xs font-bold text-slate-200 block">{dev.label}</span>
                      <span className="text-2xl font-black text-purple-400 block">{dev.count}</span>
                      <span className="text-[10px] text-slate-500 block leading-tight">{dev.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Accessed Emergency Profiles */}
              <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 shadow-md space-y-4">
                <h4 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Top Scanned Emergency Patients</span>
                </h4>
                <p className="text-xs text-slate-400">Profiles most frequently accessed in clinical care or drills</p>

                <div className="space-y-2 pt-2">
                  {scans?.topScannedPatients?.length > 0 ? (
                    scans.topScannedPatients.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-white block">{p.name}</span>
                            <span className="text-[10px] text-slate-400">
                              Last Scan: {new Date(p.lastScan).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                          {p.scans} scan(s)
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 text-center py-6">No emergency scans logged yet.</div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: AUTOMATED CLINICAL INSIGHTS */}
        {(activeTab === 'insights' || window.matchMedia?.('print')?.matches) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-800/80 p-5 rounded-3xl border border-slate-700">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Automated Clinical Decision Support & Alerts</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Algorithmic risk surveillance generated from registered blood types, drug interactions, and emergency completeness.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                {insights?.length || 0} Flags Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights?.map((ins, idx) => {
                const isCritical = ins.type === 'critical';
                const isWarning = ins.type === 'warning';
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-3xl border shadow-md space-y-2 transition-all ${
                      isCritical
                        ? 'bg-red-950/20 border-red-500/40 text-red-200'
                        : isWarning
                        ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isCritical
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-medical-500/20 text-medical-400 border border-medical-500/30'
                      }`}>
                        {ins.category}
                      </span>
                      <span className="text-[10px] text-slate-500">Live Metric Rule</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-white">{ins.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{ins.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default AdminAnalyticsPage;
