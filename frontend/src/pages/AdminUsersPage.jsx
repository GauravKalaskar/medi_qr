import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', {
        params: { search, status: statusFilter, page, limit: 10 },
      });
      if (res.data.success) {
        setUsers(res.data.users || []);
        setPagination(res.data.pagination || { totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, statusFilter, page]);

  const handleToggleStatus = async (user) => {
    const newStatus = !user.isActive;
    try {
      const res = await api.patch(`/admin/users/${user.id}/status`, { isActive: newStatus });
      if (res.data.success) {
        setToast({ type: 'success', message: res.data.message });
        fetchUsers();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update user status.' });
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Permanently delete patient account for ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/users/${user.id}`);
      if (res.data.success) {
        setToast({ type: 'success', message: res.data.message });
        fetchUsers();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete user account.' });
    }
  };

  const handleViewUser = async (id) => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      if (res.data.success) {
        setSelectedUser(res.data.user);
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load user details.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Admin Directory Management
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-2">
              Registered Patient Users Directory
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Search, filter, inspect medical profiles, activate/deactivate, or delete patient accounts.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">Total: {pagination.total} Users</span>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 text-xs rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 text-xs rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Account Statuses</option>
              <option value="active">Active Accounts Only</option>
              <option value="inactive">Deactivated Accounts Only</option>
            </select>
          </div>
        </div>

        {/* Users Directory Table Card */}
        <div className="bg-slate-800/90 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-white">No Patient Records Found</p>
              <p className="text-xs text-slate-400">Try adjusting your search terms or status filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 border-b border-slate-700 uppercase font-extrabold text-[10px] text-slate-400">
                  <tr>
                    <th className="py-3.5 px-6">Patient Name</th>
                    <th className="py-3.5 px-6">Email / Mobile</th>
                    <th className="py-3.5 px-6">Blood Type</th>
                    <th className="py-3.5 px-6">Registration Date</th>
                    <th className="py-3.5 px-6">QR Status</th>
                    <th className="py-3.5 px-6">Account Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-white whitespace-nowrap">
                        {u.name}
                      </td>
                      <td className="py-4 px-6">
                        <span className="block font-medium">{u.email}</span>
                        <span className="text-[11px] text-slate-400">{u.mobile}</span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded font-black text-xs bg-red-600 text-white">
                          {u.medicalProfile?.bloodGroup || 'O+'}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          u.qrProfile?.isActive !== false ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-700 text-slate-400'
                        }`}>
                          {u.qrProfile?.isActive !== false ? 'Active QR' : 'Deactivated QR'}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          u.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleViewUser(u.id)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          title={u.isActive ? 'Deactivate User' : 'Activate User'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.isActive ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          }`}
                        >
                          {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          title="Delete User"
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
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

        {/* Modal: View Full User Detail */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-white">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="text-base font-bold flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span>Patient Medical Master Detail</span>
                </h3>
                <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Full Name:</span>
                    <p className="font-bold text-white text-sm">{selectedUser.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <p className="font-bold text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Mobile:</span>
                    <p className="font-bold text-white">{selectedUser.mobile}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Role:</span>
                    <p className="font-bold text-amber-400">{selectedUser.role}</p>
                  </div>
                </div>

                {selectedUser.medicalProfile && (
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 space-y-2">
                    <span className="font-bold text-amber-400 uppercase tracking-wider block">Medical Details</span>
                    <p><strong>Blood Group:</strong> {selectedUser.medicalProfile.bloodGroup}</p>
                    <p><strong>Allergies:</strong> {selectedUser.medicalProfile.allergies || 'None'}</p>
                    <p><strong>Conditions:</strong> {selectedUser.medicalProfile.medicalConditions || 'None'}</p>
                    <p><strong>Emergency Contact:</strong> {selectedUser.medicalProfile.emergencyContactName} ({selectedUser.medicalProfile.emergencyContactNumber})</p>
                  </div>
                )}

                {selectedUser.qrProfile && (
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-700 space-y-2">
                    <span className="font-bold text-amber-400 uppercase tracking-wider block">QR Profile Data</span>
                    <p><strong>Token:</strong> {selectedUser.qrProfile.secureToken}</p>
                    <p><strong>Total Scan Logs:</strong> {selectedUser.qrProfile.accessLogs?.length || 0}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs"
                >
                  Close Modal
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Footer />
    </div>
  );
};

export default AdminUsersPage;
