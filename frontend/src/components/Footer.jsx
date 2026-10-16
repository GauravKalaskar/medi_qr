import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Shield, Heart, Lock, AlertTriangle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Disclaimer Banner */}
        <div className="mb-10 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start space-x-3 text-xs text-slate-300">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-white font-semibold">Important Medical Notice:</strong> MedSecure QR stores patient-controlled medical details for emergency first-responder assistance. Never store master online banking passwords or full credit card credentials in your medical notes. In a life-threatening emergency, call 911 or your local emergency dispatch immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-medical-500 flex items-center justify-center text-white">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">MedSecure<span className="text-red-500">QR</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              One QR. Critical Medical Information When It Matters Most. Fast, secure, tokenized emergency medical access.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>256-bit Tokenized Privacy Standard</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-4">Patient Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/scan" className="hover:text-white transition-colors">Emergency QR Scanner</Link>
              </li>
              <li>
                <Link to="/medical-profile" className="hover:text-white transition-colors">Create Medical Profile</Link>
              </li>
              <li>
                <Link to="/my-qr" className="hover:text-white transition-colors">Generate Wallet QR Card</Link>
              </li>
              <li>
                <Link to="/access-history" className="hover:text-white transition-colors">View Scan Audit Trail</Link>
              </li>
            </ul>
          </div>

          {/* Security & Legal */}
          <div>
            <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-4">Privacy & System</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber-400 transition-colors flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-amber-400" />
                  <span>Admin Portal Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Emergency Support */}
          <div>
            <h4 className="text-xs uppercase font-bold text-white tracking-wider mb-4">Contact & Support</h4>
            <p className="text-xs text-slate-400 mb-2">MedSecure Systems Inc.</p>
            <p className="text-xs text-slate-400">Emergency Support Line: 1-800-555-MED-QR</p>
            <p className="text-xs text-slate-400">Email: support@medsecureqr.org</p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MedSecure QR. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built with care for emergency response healthcare</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current ml-1" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
