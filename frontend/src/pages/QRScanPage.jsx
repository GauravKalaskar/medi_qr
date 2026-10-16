import React from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import { Scan, ShieldAlert, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const QRScanPage = () => {
  const navigate = useNavigate();

  const handleScanSuccess = (token) => {
    if (token) {
      navigate(`/medical/${token}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-8">
        
        {/* Header Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
            <Scan className="w-4 h-4 text-red-600 animate-pulse" />
            <span>First Responder Emergency QR Scanner</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Scan Patient MedSecure QR Code
          </h1>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Point your smartphone or tablet camera at the patient's QR badge to immediately retrieve vital blood type, drug allergies, and emergency contact numbers.
          </p>
        </div>

        {/* Camera Scanner Component */}
        <QRScanner onScanSuccess={handleScanSuccess} />

        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-1">
          <p className="font-bold text-slate-800">💡 Scanning Guidance:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Hold device 6 to 12 inches away from the QR code.</li>
            <li>Ensure adequate lighting on the patient wallet card or lockscreen.</li>
            <li>If camera permission is denied, use the manual lookup input above.</li>
          </ul>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default QRScanPage;
