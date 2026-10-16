import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FileText, Shield, Heart, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminMedicalProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get('/admin/medical-profiles');
        if (res.data.success) {
          setProfiles(res.data.profiles || []);
        }
      } catch (err) {
        console.error('Failed to load medical profiles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            Medical Records Overview
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-2">
            Patient Medical Profiles Review
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Overview of blood types, allergies, emergency contacts, and active prescriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center">
              <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : profiles.map((p) => (
            <div key={p.id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">{p.user?.name}</h3>
                  <p className="text-[11px] text-slate-400">{p.user?.email}</p>
                </div>
                <span className="px-2.5 py-0.5 bg-red-600 text-white font-extrabold text-xs rounded-full">
                  {p.bloodGroup} {p.rhFactor || ''}
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-300">
                <p><strong>Allergies:</strong> {p.allergies || 'None'}</p>
                <p><strong>Conditions:</strong> {p.medicalConditions || 'None'}</p>
                <p><strong>Emergency Contact:</strong> {p.emergencyContactName} ({p.emergencyContactNumber})</p>
                <p><strong>Hospital:</strong> {p.preferredHospital || 'Trauma Center'}</p>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default AdminMedicalProfilesPage;
