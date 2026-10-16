import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  QrCode,
  UserCheck,
  FileText,
  Scan,
  History,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Download,
  Eye,
  Activity,
  Heart,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { QRCodeSVG } from 'qrcode.react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, qrRes] = await Promise.all([
          api.get('/medical-profile'),
          api.get('/qr'),
        ]);

        if (profRes.data.success) {
          setProfileData(profRes.data.profile);
        }
        if (qrRes.data.success && qrRes.data.hasQR) {
          setQrData(qrRes.data.qrProfile);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    if (!profileData) return 15; // Basic user account registered
    let fields = [
      profileData.bloodGroup,
      profileData.emergencyContactName,
      profileData.emergencyContactNumber,
      profileData.allergies,
      profileData.medicalConditions,
      profileData.currentMedications,
      profileData.preferredHospital,
      profileData.primaryDoctor,
      profileData.insuranceProvider,
    ];
    let filled = fields.filter((f) => f && f.trim() !== '').length;
    return Math.min(100, Math.round(20 + (filled / fields.length) * 80));
  };

  const completionPct = calculateCompletion();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Welcome Header Banner */}
        <div className="bg-gradient-to-r from-medical-800 via-medical-700 to-medical-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full filter blur-2xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>MedSecure Protected Patient</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Patient'}
              </h1>
              <p className="text-xs sm:text-sm text-medical-100 max-w-xl">
                Your emergency digital medical profile is active. First responders can view your vital data instantly by scanning your unique QR code.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/my-qr"
                className="px-5 py-3 bg-white text-medical-900 font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-100 shadow-md transition-all flex items-center space-x-2"
              >
                <QrCode className="w-4 h-4 text-medical-600" />
                <span>View My QR Code</span>
              </Link>
              <Link
                to="/scan"
                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <Scan className="w-4 h-4" />
                <span>Emergency Scan</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Completion & Warning Callouts */}
        {completionPct < 100 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Profile Completion: {completionPct}%
                </h4>
                <p className="text-xs text-slate-600">
                  Add emergency contact, hospital preference, and allergies to ensure full medical coverage.
                </p>
              </div>
            </div>
            <Link
              to="/medical-profile"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shrink-0"
            >
              Complete Medical Profile
            </Link>
          </div>
        )}

        {/* Quick Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Blood Group & Key Emergency Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                Emergency Blood Info
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current" />
              </div>
            </div>

            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-extrabold text-red-600">
                {profileData?.bloodGroup || 'Not Set'}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                Rh Factor: {profileData?.rhFactor || 'Unspecified'}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-bold text-slate-900">
                  {profileData?.emergencyContactName || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Emergency Phone:</span>
                <span className="font-bold text-emerald-600">
                  {profileData?.emergencyContactNumber || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Allergies:</span>
                <span className="font-bold text-red-600 truncate max-w-[150px]">
                  {profileData?.allergies || 'None Reported'}
                </span>
              </div>
            </div>

            <Link
              to="/medical-profile"
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Edit Medical Details</span>
            </Link>
          </div>

          {/* QR Code Status & Preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                QR Token Profile
              </span>
              <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                qrData?.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {qrData?.isActive !== false ? 'ACTIVE' : 'DEACTIVATED'}
              </span>
            </div>

            <div className="py-2 flex justify-center">
              {qrData?.publicUrl ? (
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
                  <QRCodeSVG value={qrData.publicUrl} size={100} level="M" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <QrCode className="w-12 h-12" />
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500">
              {qrData ? 'Scan code to view emergency public profile.' : 'Complete profile to generate active QR code.'}
            </p>

            <Link
              to="/my-qr"
              className="w-full py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 shadow-sm transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Manage QR & Print Card</span>
            </Link>
          </div>

          {/* Quick Actions List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider block">
              Quick Patient Actions
            </span>

            <div className="space-y-2">
              <Link
                to="/scan"
                className="p-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200/80 flex items-center justify-between text-xs font-bold text-red-700 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Scan className="w-4 h-4 text-red-600" />
                  <span>Scan Medical QR Code</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/medical-profile"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4 text-medical-600" />
                  <span>Update Medical History</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/access-history"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <History className="w-4 h-4 text-medical-600" />
                  <span>View QR Scan Audit History</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center space-x-1 justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tokenized security algorithm active</span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
