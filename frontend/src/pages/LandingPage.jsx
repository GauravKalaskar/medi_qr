import React from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  ShieldCheck,
  Activity,
  PhoneCall,
  Lock,
  Zap,
  CheckCircle,
  ArrowRight,
  Scan,
  UserPlus,
  FileCheck,
  Eye,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-medical-200/40 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-200/30 rounded-full filter blur-3xl -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Hero Left Content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-medical-100 text-medical-800 text-xs font-bold border border-medical-200 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-medical-600" />
                  <span>Next-Gen Healthcare Safety Tokenization</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Your Medical Information.{' '}
                  <span className="bg-gradient-to-r from-medical-600 via-medical-500 to-red-600 bg-clip-text text-transparent">
                    One Secure QR Code.
                  </span>
                </h1>

                <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Create and manage your digital medical profile and access important information quickly when it matters most. Instant first-responder emergency data access with total patient privacy control.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-medical-600 to-medical-700 hover:from-medical-700 hover:to-medical-800 text-white font-bold text-base rounded-2xl shadow-xl shadow-medical-600/30 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
                  >
                    <span>Create Free Medical Profile</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/scan"
                    className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-red-50 text-red-600 font-bold text-base rounded-2xl border-2 border-red-200 hover:border-red-300 shadow-sm transition-all flex items-center justify-center space-x-2"
                  >
                    <Scan className="w-5 h-5" />
                    <span>Scan QR Now</span>
                  </Link>
                </div>

                {/* Key Highlights */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-slate-600 text-xs font-semibold">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>100% Free Patient Access</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Cryptographic Tokens</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Printable Wallet Card</span>
                  </div>
                </div>
              </div>

              {/* Hero Right Visual Demonstration Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 hover:shadow-medical-500/10 transition-shadow">
                  
                  {/* Card Header Emergency Red Tag */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-600 animate-ping"></div>
                      <span className="text-xs font-extrabold text-red-600 tracking-wider uppercase">
                        Emergency Medical Pass
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">ID #MD-99812</span>
                  </div>

                  {/* Profile Sample Box */}
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-medical-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                      O+
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Johnathan E. Doe</h3>
                      <p className="text-xs text-slate-500">DOB: Aug 15, 1990 (Age 36)</p>
                      <p className="text-xs font-semibold text-red-600 flex items-center space-x-1 mt-0.5">
                        <span>Allergies: Severe Penicillin</span>
                      </p>
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
                    <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-medical-800" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-2">
                      Scan with any smartphone camera for instant life-saving information.
                    </p>
                  </div>

                  {/* Quick Emergency Phone Action */}
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-red-600 block">Emergency Contact</span>
                      <span className="text-xs font-bold text-slate-900">Sarah Doe (Spouse)</span>
                    </div>
                    <div className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>+1-555-987-6544</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-medical-600 bg-medical-50 px-3 py-1 rounded-full">
                Simple 4-Step Process
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">How MedSecure QR Protects You</h2>
              <p className="text-slate-600 text-sm mt-2">
                Designed for speed and reliability when every second counts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-medical-300 transition-all text-center group">
                <div className="w-12 h-12 rounded-xl bg-medical-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Create Your Profile</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter blood type, critical allergies, chronic conditions, medications, and emergency contacts.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-medical-300 transition-all text-center group">
                <div className="w-12 h-12 rounded-xl bg-medical-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Generate QR Code</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The system creates a unique, cryptographically tokenized QR code linked to your emergency summary.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-medical-300 transition-all text-center group">
                <div className="w-12 h-12 rounded-xl bg-medical-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Keep QR With You</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Print a compact wallet ID card, keep it on your phone lock screen, or stick it on medical gear.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-medical-300 transition-all text-center group">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                  4
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Scan in Emergency</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Paramedics and doctors scan the code to immediately view vital data and reach emergency contacts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900">Comprehensive Medical Security Features</h2>
              <p className="text-slate-600 text-sm mt-2">
                Built to medical privacy standards with robust patient controls.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-medical-100 text-medical-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Tokenized QR Privacy</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  QR codes contain only random cryptographically generated tokens—never database IDs, passwords, or login secrets.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Red Highlight Emergency Summary</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Critical medical data like blood group, lethal drug allergies, and emergency phone numbers are styled prominently for fast action.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Patient Audit Scan Logs</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track every timestamp, device type, and location metadata whenever your QR code is scanned in real-time.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Instant Deactivation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deactivate or regenerate your QR code at any time with one click from your dashboard to revoke old links.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Printable Wallet ID Cards</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatically format and print credit-card sized emergency wallet badges suitable for lanyards or driver licenses.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Admin Control Panel</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Full administrator access management, user activation/deactivation, system scan statistics, and safety compliance tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-16 bg-gradient-to-r from-medical-900 via-medical-800 to-slate-900 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Protect Yourself & Your Loved Ones?</h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto">
              Setting up your MedSecure QR emergency profile takes under 3 minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white text-medical-900 font-extrabold text-sm rounded-xl hover:bg-slate-100 shadow-lg transition-all"
              >
                Register Free Patient Account
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 bg-medical-700 hover:bg-medical-600 text-white font-bold text-sm rounded-xl border border-medical-500 transition-all"
              >
                Sign In to Profile
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
