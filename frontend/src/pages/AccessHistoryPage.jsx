import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { History, Eye, ShieldCheck, Clock, Monitor, Smartphone, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AccessHistoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [totalScans, setTotalScans] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/access-logs');
        if (res.data.success) {
          setLogs(res.data.logs || []);
          setTotalScans(res.data.totalScans || 0);
        }
      } catch (err) {
        console.error('Error loading scan history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-medical-600 bg-medical-50 px-3 py-1 rounded-full">
              Patient Audit Trail
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              QR Code Access Log History
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review every time someone scanned your QR code or accessed your emergency medical profile.
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-extrabold text-medical-600 block">{totalScans}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Scans Recorded</span>
          </div>
        </div>

        {/* Logs Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-medical-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Scan Logs Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your QR code has not been scanned yet. When paramedics or emergency viewers scan your code, access metadata will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase font-extrabold text-[10px] text-slate-400">
                  <tr>
                    <th className="py-3.5 px-6">Timestamp</th>
                    <th className="py-3.5 px-6">Access Type</th>
                    <th className="py-3.5 px-6">User Agent / Device</th>
                    <th className="py-3.5 px-6">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-medical-600" />
                          <span>{new Date(log.accessedAt).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-medical-100 text-medical-800">
                          {log.accessType || 'QR_SCAN'}
                        </span>
                      </td>
                      <td className="py-4 px-6 max-w-xs truncate" title={log.userAgent}>
                        {log.userAgent || 'Mobile Safari / Chrome Browser'}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-500">
                        {log.ipAddress || '192.168.1.1'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AccessHistoryPage;
