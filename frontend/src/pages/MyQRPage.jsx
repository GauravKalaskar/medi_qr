import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Download,
  Printer,
  RefreshCw,
  Copy,
  Check,
  Power,
  ShieldCheck,
  Calendar,
  Heart,
  AlertCircle,
  Share2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WalletCardPrint from '../components/WalletCardPrint';
import Toast from '../components/Toast';

const MyQRPage = () => {
  const { user } = useAuth();
  const [qrData, setQrData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [toast, setToast] = useState(null);
  const [showWalletPreview, setShowWalletPreview] = useState(false);

  const fetchQRAndProfile = async () => {
    try {
      const [qrRes, profRes] = await Promise.all([
        api.get('/qr'),
        api.get('/medical-profile'),
      ]);

      if (qrRes.data.success) {
        setQrData(qrRes.data);
      }
      if (profRes.data.success) {
        setProfileData(profRes.data.profile);
      }
    } catch (err) {
      console.error('Failed to load QR data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRAndProfile();
  }, []);

  const handleCopyLink = () => {
    if (qrData?.qrProfile?.publicUrl) {
      navigator.clipboard.writeText(qrData.qrProfile.publicUrl);
      setCopied(true);
      setToast({ type: 'success', message: 'Medical Profile QR Link copied to clipboard!' });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleRegenerateToken = async () => {
    if (!window.confirm('Warning: Regenerating your QR token will invalidate all previously printed or saved QR codes. Proceed?')) {
      return;
    }
    setRegenerating(true);
    try {
      const res = await api.post('/qr/regenerate');
      if (res.data.success) {
        setToast({ type: 'success', message: 'QR Code regenerated successfully! Previous links revoked.' });
        fetchQRAndProfile();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to regenerate QR token.' });
    } finally {
      setRegenerating(false);
    }
  };

  const handleToggleStatus = async () => {
    setToggling(true);
    try {
      const res = await api.patch('/qr/toggle');
      if (res.data.success) {
        setToast({ type: 'success', message: res.data.message });
        fetchQRAndProfile();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update QR status.' });
    } finally {
      setToggling(false);
    }
  };

  const handleDownloadPNG = () => {
    const svgElement = document.getElementById('my-qr-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `MedSecure_QR_${user?.name || 'Patient'}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrintCard = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-medical-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const publicUrl = qrData?.qrProfile?.publicUrl || '';
  const isActive = qrData?.qrProfile?.isActive !== false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header Title */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-medical-600 bg-medical-50 px-3 py-1 rounded-full">
              Patient QR Credentials
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              My Emergency QR Code
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep this QR code on your smartphone lock screen, wallet badge, or medical alert pendant.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleStatus}
              disabled={toggling}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                isActive
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isActive ? 'Status: ACTIVE' : 'Status: DEACTIVATED'}</span>
            </button>
          </div>
        </div>

        {/* Main QR Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: QR Code Container */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
            <div className={`p-4 bg-white rounded-3xl border-2 shadow-inner transition-all ${
              isActive ? 'border-medical-500 shadow-medical-500/10' : 'border-slate-300 opacity-40'
            }`}>
              {publicUrl ? (
                <QRCodeSVG id="my-qr-svg" value={publicUrl} size={200} level="H" includeMargin={true} />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded-2xl text-slate-400">
                  <QrCode className="w-16 h-16" />
                </div>
              )}
            </div>

            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-800 block">{qrData?.patientName}</span>
              <span className="inline-block bg-red-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
                Blood Group: {qrData?.bloodGroup || 'O+'}
              </span>
            </div>
          </div>

          {/* Right Column: Metadata & Action Buttons */}
          <div className="md:col-span-7 space-y-6">
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">QR Secure Token:</span>
                <span className="font-mono font-bold text-slate-800 truncate max-w-[200px]">
                  {qrData?.qrProfile?.secureToken || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">QR Created Date:</span>
                <span className="font-bold text-slate-800">
                  {qrData?.qrProfile?.createdAt ? new Date(qrData.qrProfile.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Profile Update:</span>
                <span className="font-bold text-slate-800">
                  {qrData?.lastProfileUpdate ? new Date(qrData.lastProfileUpdate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-3">
              
              <button
                onClick={handleDownloadPNG}
                className="p-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handlePrintCard}
                className="p-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Wallet Card</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy QR Link'}</span>
              </button>

              <button
                onClick={handleRegenerateToken}
                disabled={regenerating}
                className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 text-amber-700 ${regenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate Token</span>
              </button>

            </div>

            <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-start space-x-2 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>
                <strong>Security Architecture:</strong> Scanning this QR code opens your emergency profile page using a cryptographically random token. It does not expose your login credentials or password.
              </p>
            </div>

          </div>
        </div>

        {/* Printable Wallet ID Card Component */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Emergency Wallet ID Badge Preview</h3>
            <button
              onClick={handlePrintCard}
              className="text-xs text-medical-600 font-bold hover:underline"
            >
              Print Card Only
            </button>
          </div>
          
          <WalletCardPrint
            patientName={user?.name}
            bloodGroup={profileData?.bloodGroup}
            qrUrl={publicUrl}
            emergencyContact={profileData?.emergencyContactName}
            emergencyPhone={profileData?.emergencyContactNumber}
            allergies={profileData?.allergies}
          />
        </div>

      </main>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Footer />
    </div>
  );
};

export default MyQRPage;
