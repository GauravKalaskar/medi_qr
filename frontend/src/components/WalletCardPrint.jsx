import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Phone, AlertCircle } from 'lucide-react';

const WalletCardPrint = ({ patientName, bloodGroup, qrUrl, emergencyContact, emergencyPhone, allergies }) => {
  return (
    <div id="printable-wallet-card" className="w-[340px] bg-white border-2 border-medical-600 rounded-2xl p-4 shadow-xl text-slate-900 mx-auto relative overflow-hidden">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <div className="flex items-center space-x-1.5">
          <div className="w-6 h-6 rounded-md bg-red-600 text-white flex items-center justify-center font-bold text-xs">
            +
          </div>
          <span className="font-extrabold text-sm text-medical-900 tracking-tight">MedSecure<span className="text-red-600">QR</span></span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
          Emergency ID Card
        </span>
      </div>

      {/* Card Content Grid */}
      <div className="grid grid-cols-3 gap-2 items-center">
        {/* Left Data */}
        <div className="col-span-2 space-y-1.5">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">Patient Name</span>
            <p className="text-sm font-extrabold text-slate-900 leading-tight truncate">{patientName || 'Patient Name'}</p>
          </div>

          <div className="flex space-x-3">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">Blood Type</span>
              <span className="inline-block bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded shadow-sm">
                {bloodGroup || 'O+'}
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">Allergies</span>
              <span className="text-[11px] font-bold text-red-600 truncate block max-w-[110px]">
                {allergies || 'None Listed'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block leading-tight">In Emergency Call</span>
            <p className="text-[11px] font-bold text-slate-900 flex items-center space-x-1">
              <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{emergencyPhone || 'N/A'} ({emergencyContact || 'ICE'})</span>
            </p>
          </div>
        </div>

        {/* Right QR SVG Code */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-sm">
            <QRCodeSVG value={qrUrl || 'https://medsecureqr.org'} size={72} level="H" />
          </div>
          <span className="text-[8px] font-semibold text-slate-400 mt-1 uppercase tracking-tighter">Scan for Full Data</span>
        </div>
      </div>

      {/* Bottom Footer Notice */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400">
        <span>Tokenized Medical Privacy</span>
        <span>Keep in Wallet / Lanyard</span>
      </div>
    </div>
  );
};

export default WalletCardPrint;
