import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
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
  Smartphone,
  Laptop,
  ExternalLink,
  Globe,
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
  const [generating, setGenerating] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [toast, setToast] = useState(null);
  const [urlMode, setUrlMode] = useState(() => {
    return localStorage.getItem('medsecure_url_mode') || (window.location.origin.includes('localhost') ? 'network' : 'current');
  });
  const [customDomain, setCustomDomain] = useState(() => {
    return localStorage.getItem('medsecure_public_url') || '';
  });

  const handleCustomDomainChange = (val) => {
    setCustomDomain(val);
    localStorage.setItem('medsecure_public_url', val);
  };

  const handleUrlModeChange = (mode) => {
    setUrlMode(mode);
    localStorage.setItem('medsecure_url_mode', mode);
  };

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

  const handleCreateQR = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/qr/generate');
      if (res.data.success) {
        setToast({ type: 'success', message: 'Emergency QR code created successfully!' });
        fetchQRAndProfile();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to generate QR code.' });
    } finally {
      setGenerating(false);
    }
  };

  // Determine active QR URL to encode
  const token = qrData?.qrProfile?.secureToken || '';
  const networkUrl = qrData?.networkUrl || (qrData?.localIp ? `http://${qrData.localIp}:5173/medical/${token}` : '');
  const currentOriginUrl = token ? `${window.location.origin}/medical/${token}` : '';
  const customUrl = (customDomain && token) ? `${customDomain.replace(/\/+$/, '')}/medical/${token}` : '';
  
  // Active QR URL based on toggle
  let activeQRUrl = currentOriginUrl;
  if (urlMode === 'custom' && customUrl) {
    activeQRUrl = customUrl;
  } else if (urlMode === 'network' && networkUrl) {
    activeQRUrl = networkUrl;
  } else if (urlMode === 'current') {
    activeQRUrl = currentOriginUrl;
  }

  const handleCopyLink = () => {
    if (activeQRUrl) {
      navigator.clipboard.writeText(activeQRUrl);
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
    const canvas = document.getElementById('high-res-qr-canvas');
    if (!canvas) return;

    try {
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `MedSecure_QR_${user?.name?.replace(/\s+/g, '_') || 'Patient'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      setToast({ type: 'success', message: 'High-resolution QR code downloaded!' });
    } catch (err) {
      console.error('Download error:', err);
      setToast({ type: 'error', message: 'Could not export PNG image.' });
    }
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

  const isActive = qrData?.qrProfile?.isActive !== false;
  const hasQR = qrData?.hasQR && qrData?.qrProfile;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hidden high-res Canvas used exclusively for clean PNG exports */}
      {activeQRUrl && (
        <div className="hidden">
          <QRCodeCanvas
            id="high-res-qr-canvas"
            value={activeQRUrl}
            size={512}
            level="M"
            includeMargin={true}
          />
        </div>
      )}

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

          {hasQR && (
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
          )}
        </div>

        {/* QR Scanner Mode Advice Banner */}
        {hasQR && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                {urlMode === 'custom' ? (
                  <Globe className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : urlMode === 'network' ? (
                  <Smartphone className="w-5 h-5 text-blue-600 shrink-0" />
                ) : (
                  <Laptop className="w-5 h-5 text-slate-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-900">
                    {urlMode === 'custom'
                      ? '🌐 Public URL Mode — Scannable from ANY Network (4G / 5G / Anywhere)'
                      : urlMode === 'network'
                      ? '📱 Local Wi-Fi Mode — Scannable from Phones on the Same Wi-Fi'
                      : '💻 Localhost Mode — Internal PC Browser Testing'}
                  </span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    {urlMode === 'custom'
                      ? 'Use your public tunnel or deployed domain so anyone in the world can scan this emergency QR.'
                      : urlMode === 'network'
                      ? 'Encodes your local Wi-Fi IP address (10.18.173.176) so phones on your home/office Wi-Fi can open it.'
                      : 'Encodes http://localhost:5173 for testing in your computer browser.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-white p-1 rounded-xl border border-blue-200 shadow-sm shrink-0 flex-wrap gap-1">
                <button
                  onClick={() => handleUrlModeChange('custom')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center space-x-1 transition-all ${
                    urlMode === 'custom'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Public URL (Any 4G/5G)</span>
                </button>
                <button
                  onClick={() => handleUrlModeChange('network')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center space-x-1 transition-all ${
                    urlMode === 'network'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Local Wi-Fi</span>
                </button>
                <button
                  onClick={() => handleUrlModeChange('current')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center space-x-1 transition-all ${
                    urlMode === 'current'
                      ? 'bg-slate-800 text-white shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Localhost</span>
                </button>
              </div>
            </div>

            {/* Custom Public URL input box when custom mode is chosen */}
            {urlMode === 'custom' && (
              <div className="pt-2 border-t border-blue-200/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <label className="text-slate-700 font-bold shrink-0">
                  Public HTTPS Domain:
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://xxxx.loca.lt or https://xxxx.ngrok-free.app or https://my-app.vercel.app"
                  value={customDomain}
                  onChange={(e) => handleCustomDomainChange(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500 shrink-0">
                  Tip: Run <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">npx localtunnel --port 5173</code> for an instant free public URL!
                </span>
              </div>
            )}
          </div>
        )}

        {/* Main QR Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: QR Code Container */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
            <div className={`p-4 bg-white rounded-3xl border-2 shadow-inner transition-all ${
              isActive ? 'border-medical-500 shadow-medical-500/10' : 'border-slate-300 opacity-40'
            }`}>
              {hasQR && activeQRUrl ? (
                <QRCodeSVG
                  id="my-qr-svg"
                  value={activeQRUrl}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              ) : (
                <div className="w-48 h-48 flex flex-col items-center justify-center bg-slate-100 rounded-2xl text-slate-400 p-4 space-y-2">
                  <QrCode className="w-12 h-12" />
                  <span className="text-[11px] font-semibold text-slate-500">No Active QR Generated</span>
                  <button
                    onClick={handleCreateQR}
                    disabled={generating}
                    className="px-3 py-1.5 bg-medical-600 text-white text-xs font-bold rounded-lg shadow"
                  >
                    {generating ? 'Generating...' : 'Generate QR Now'}
                  </button>
                </div>
              )}
            </div>

            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-800 block">{qrData?.patientName || user?.name}</span>
              <span className="inline-block bg-red-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
                Blood Group: {qrData?.bloodGroup || profileData?.bloodGroup || 'Not Specified'}
              </span>
            </div>
          </div>

          {/* Right Column: Metadata & Action Buttons */}
          <div className="md:col-span-7 space-y-6">
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Encoded Target URL:</span>
                <span className="font-mono font-bold text-medical-700 truncate max-w-[220px]" title={activeQRUrl}>
                  {activeQRUrl || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">QR Secure Token:</span>
                <span className="font-mono font-bold text-slate-800 truncate max-w-[200px]">
                  {qrData?.qrProfile?.secureToken || 'N/A'}
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
                disabled={!hasQR}
                className="p-3 bg-medical-600 hover:bg-medical-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handlePrintCard}
                disabled={!hasQR}
                className="p-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Wallet Card</span>
              </button>

              <button
                onClick={handleCopyLink}
                disabled={!hasQR}
                className="p-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy QR Link'}</span>
              </button>

              <a
                href={token ? `/medical/${token}` : '#'}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs rounded-xl border border-indigo-200 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4 text-indigo-700" />
                <span>Test View Profile</span>
              </a>

              <button
                onClick={handleRegenerateToken}
                disabled={regenerating || !hasQR}
                className="p-3 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition-colors flex items-center justify-center space-x-2 col-span-2"
              >
                <RefreshCw className={`w-4 h-4 text-amber-700 ${regenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate QR Token (Revoke Old)</span>
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
            qrUrl={activeQRUrl}
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
