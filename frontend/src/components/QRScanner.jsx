import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Search, AlertCircle, RefreshCw, Upload, Image as ImageIcon, SwitchCamera } from 'lucide-react';

const QRScanner = ({ onScanSuccess }) => {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'file'
  const [manualToken, setManualToken] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [fileScanning, setFileScanning] = useState(false);

  const scannerContainerId = 'qr-reader-container';
  const html5QrCodeRef = useRef(null);
  const isStoppingRef = useRef(false);
  const isProcessingRef = useRef(false);
  const fileInputRef = useRef(null);

  // Initialize camera list on mount
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back camera if available, else first camera
          const backCam = devices.find((d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        }
      })
      .catch((err) => {
        console.warn('Could not enumerate cameras:', err);
      });

    return () => {
      cleanupScanner();
    };
  }, []);

  const cleanupScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error during scanner cleanup:', err);
      } finally {
        html5QrCodeRef.current = null;
      }
    }
  };

  const extractTokenAndSubmit = (rawInput) => {
    let token = String(rawInput || '').trim();
    if (!token) return;

    // Clean up surrounding quotes
    token = token.replace(/^["']|["']$/g, '');

    // Handle full URL: http://.../medical/:token or localhost/medical/:token
    if (token.includes('/medical/')) {
      const parts = token.split('/medical/');
      token = parts[parts.length - 1].split('?')[0].split('#')[0].replace(/\/+$/, '');
    } else if (token.includes('token=')) {
      const match = token.match(/token=([a-zA-Z0-9_-]+)/);
      if (match) token = match[1];
    } else if (token.includes('/')) {
      const segments = token.split('/').filter(Boolean);
      token = segments[segments.length - 1].split('?')[0].split('#')[0];
    }

    if (onScanSuccess) {
      onScanSuccess(token);
    }
  };

  const startCameraWithConfig = async (cameraConfig) => {
    await cleanupScanner();

    const html5QrCode = new Html5Qrcode(scannerContainerId);
    html5QrCodeRef.current = html5QrCode;

    const qrConfig = {
      fps: 15,
      qrbox: { width: 260, height: 260 },
      aspectRatio: 1.0,
    };

    await html5QrCode.start(
      cameraConfig,
      qrConfig,
      async (decodedText) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
          await stopCamera();
        } catch (_) {}

        extractTokenAndSubmit(decodedText);
      },
      (error) => {
        // Ignored scan frame failures
      }
    );
  };

  const startCamera = async () => {
    setErrorMsg(null);
    setStartingCamera(true);
    setCameraActive(true);
    isProcessingRef.current = false;

    // Short delay to ensure container element is visible in the DOM
    setTimeout(async () => {
      try {
        if (selectedCameraId) {
          // Use specific selected camera ID
          await startCameraWithConfig(selectedCameraId);
        } else {
          // Try environment camera first
          try {
            await startCameraWithConfig({ facingMode: 'environment' });
          } catch (envErr) {
            console.warn('Environment camera failed, falling back to front/default camera:', envErr);
            // Fallback to front camera or default
            await startCameraWithConfig({ facingMode: 'user' });
          }
        }
      } catch (err) {
        console.error('All camera attempts failed:', err);
        setErrorMsg('Camera access failed or permission was denied. Try choosing a different camera or upload a QR image below.');
        setCameraActive(false);
      } finally {
        setStartingCamera(false);
      }
    }, 150);
  };

  const stopCamera = async () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;
    try {
      await cleanupScanner();
    } catch (err) {
      console.warn('Failed stopping camera:', err);
    } finally {
      setCameraActive(false);
      isStoppingRef.current = false;
    }
  };

  const handleCameraChange = async (e) => {
    const newCamId = e.target.value;
    setSelectedCameraId(newCamId);
    if (cameraActive) {
      await stopCamera();
      setTimeout(() => {
        startCamera();
      }, 200);
    }
  };

  const handleFileScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setFileScanning(true);
    isProcessingRef.current = false;

    try {
      const html5QrCode = new Html5Qrcode('qr-file-helper-container');
      const decodedText = await html5QrCode.scanFile(file, false);
      try {
        html5QrCode.clear();
      } catch (_) {}
      extractTokenAndSubmit(decodedText);
    } catch (err) {
      console.error('File scan error:', err);
      setErrorMsg('Could not detect a valid QR code in the uploaded image. Please ensure the QR code is clearly visible and well-lit.');
    } finally {
      setFileScanning(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    extractTokenAndSubmit(manualToken);
  };

  return (
    <div className="space-y-6">
      {/* Hidden container for file scanning */}
      <div id="qr-file-helper-container" className="hidden"></div>

      {/* Main Scanner Card */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white text-center shadow-xl border border-slate-800">
        
        {/* Navigation Tabs (Live Camera vs Upload Image) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (cameraActive) stopCamera();
                setActiveTab('camera');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'camera'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Camera</span>
            </button>
            <button
              onClick={() => {
                if (cameraActive) stopCamera();
                setActiveTab('file');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'file'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload QR Image</span>
            </button>
          </div>

          {/* Camera Selection dropdown if multiple cameras found */}
          {activeTab === 'camera' && cameras.length > 1 && (
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <SwitchCamera className="w-3.5 h-3.5" />
              <select
                value={selectedCameraId}
                onChange={handleCameraChange}
                className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500 max-w-[140px] truncate"
              >
                {cameras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label || `Camera ${c.id.substring(0, 5)}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeTab === 'camera' && cameraActive && (
            <button
              onClick={stopCamera}
              className="text-xs bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700"
            >
              Stop Camera
            </button>
          )}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 flex items-center space-x-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: LIVE CAMERA */}
        {activeTab === 'camera' && (
          <div>
            <div
              id={scannerContainerId}
              className={`w-full max-w-sm mx-auto overflow-hidden rounded-2xl border-2 transition-all ${
                cameraActive ? 'border-red-500 min-h-[300px]' : 'hidden'
              }`}
            ></div>

            {!cameraActive && (
              <div className="py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 text-red-400 flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Scan Patient QR Code</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Point your device camera at the patient's MedSecure QR code badge or wallet card.
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  disabled={startingCamera}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-105 inline-flex items-center space-x-2"
                >
                  {startingCamera ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Starting Camera...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>Enable Camera & Scan</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UPLOAD QR IMAGE / SCREENSHOT */}
        {activeTab === 'file' && (
          <div className="py-6 space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-red-500/80 bg-slate-800/40 hover:bg-slate-800/70 rounded-2xl p-8 cursor-pointer transition-all max-w-md mx-auto flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-slate-800 text-red-400 flex items-center justify-center border border-slate-700">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Upload QR Code Image or Screenshot</p>
                <p className="text-xs text-slate-400">
                  Select a PNG, JPG, or WEBP image of the MedSecure QR badge
                </p>
              </div>
              <span className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-600 inline-block">
                {fileScanning ? 'Scanning Image...' : 'Browse Image File'}
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileScan}
              className="hidden"
            />
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
