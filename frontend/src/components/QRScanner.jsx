import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Search, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

const QRScanner = ({ onScanSuccess }) => {
  const [manualToken, setManualToken] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup camera scanner on unmount
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current
          .stop()
          .catch((err) => console.error('Error stopping QR scanner:', err));
      }
    };
  }, []);

  const startCamera = async () => {
    setErrorMsg(null);
    setCameraActive(true);

    setTimeout(async () => {
      try {
        if (!scannerRef.current) return;
        const html5QrCode = new Html5Qrcode(scannerRef.current.id);
        html5QrCodeRef.current = html5QrCode;

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            // Extracted QR code string
            extractTokenAndSubmit(decodedText);
            html5QrCode.stop();
            setCameraActive(false);
          },
          (errorMessage) => {
            // Ignore frame scan failures
          }
        );
      } catch (err) {
        console.error('Camera access error:', err);
        setErrorMsg('Camera access failed or permission was denied. Please use the manual token/URL lookup below.');
        setCameraActive(false);
      }
    }, 100);
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      await html5QrCodeRef.current.stop();
    }
    setCameraActive(false);
  };

  const extractTokenAndSubmit = (rawInput) => {
    let token = rawInput.trim();
    // If full URL was scanned, extract token from path
    if (token.includes('/medical/')) {
      const parts = token.split('/medical/');
      token = parts[parts.length - 1].split('?')[0].split('#')[0];
    }
    if (onScanSuccess) {
      onScanSuccess(token);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    extractTokenAndSubmit(manualToken);
  };

  return (
    <div className="space-y-6">
      {/* Live Camera Scanner Container */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white text-center shadow-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-red-500 font-bold text-sm uppercase tracking-wider">
            <Camera className="w-5 h-5 animate-pulse" />
            <span>Emergency QR Camera Scanner</span>
          </div>
          {cameraActive && (
            <button
              onClick={stopCamera}
              className="text-xs bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700"
            >
              Stop Camera
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div
          id="qr-reader-container"
          ref={scannerRef}
          className={`w-full max-w-sm mx-auto overflow-hidden rounded-2xl border-2 ${
            cameraActive ? 'border-red-500 min-h-[280px]' : 'border-slate-800 hidden'
          }`}
        ></div>

        {!cameraActive && (
          <div className="py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 text-red-400 flex items-center justify-center mx-auto border border-slate-700">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Scan Patient QR Code</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Point your mobile or tablet camera at the patient's MedSecure QR code badge or document.
              </p>
            </div>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-105 inline-flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Enable Camera & Scan</span>
            </button>
          </div>
        )}
      </div>

      {/* Fallback Manual Token or URL Input */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center space-x-2">
          <Search className="w-4 h-4 text-medical-600" />
          <span>Manual QR Code / Profile Token Fallback</span>
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Cannot access camera? Enter the secure profile token or paste the medical URL directly.
        </p>

        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. med_qr_18be51ba1467b32311... or URL"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shrink-0 flex items-center space-x-1"
          >
            <span>View Profile</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default QRScanner;
