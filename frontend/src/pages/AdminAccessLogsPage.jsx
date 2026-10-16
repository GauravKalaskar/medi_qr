import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { History, Shield, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminAccessLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/access-logs', { params: { page, limit: 15 } });
        if (res.data.success) {
          setLogs(res.data.logs || []);
          setPagination(res.data.pagination || { totalPages: 1, total: 0 });
        }
      } catch (err) {
        console.error('Error fetching global access logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              System Audit Trail
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-2">
              Global System QR Access Logs
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive security audit logging for all patient QR code scans across the platform.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-400">Total Scans Logged: {pagination.total}</span>
        </div>

        {/* Audit Log Table Card */}
        <div className="bg-slate-800/90 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No access log events recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-700 uppercase font-extrabold text-[10px] text-slate-400">
                  <tr>
                    <th className="py-3.5 px-6">Timestamp</th>
                    <th className="py-3.5 px-6">Patient Profile</th>
                    <th className="py-3.5 px-6">Access Type</th>
                    <th className="py-3.5 px-6">User Agent</th>
                    <th className="py-3.5 px-6">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-300 whitespace-nowrap">
                        {new Date(log.accessedAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 font-bold text-white whitespace-nowrap">
                        {log.qrProfile?.user?.name || 'Patient'} ({log.qrProfile?.user?.email})
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                          {log.accessType}
                        </span>
                      </td>
                      <td className="py-4 px-6 max-w-xs truncate" title={log.userAgent}>
                        {log.userAgent || 'Safari / Chrome'}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-400">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="p-4 bg-slate-900 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <span>Page {page} of {pagination.totalPages}</span>
              <div className="flex space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AdminAccessLogsPage;
