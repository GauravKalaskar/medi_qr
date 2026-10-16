import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ type = 'success', message, onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 max-w-md p-4 rounded-xl shadow-xl border flex items-center justify-between space-x-3 transition-all animate-bounce-short ${
        isSuccess
          ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
          : 'bg-red-900/90 text-red-100 border-red-700'
      }`}
    >
      <div className="flex items-center space-x-2.5 text-xs font-semibold">
        {isSuccess ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-slate-300 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
