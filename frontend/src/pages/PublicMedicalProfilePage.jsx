import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Heart,
  PhoneCall,
  AlertTriangle,
  Activity,
  Building2,
  ShieldCheck,
  User,
  Info,
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicMedicalProfilePage = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [deactivated, setDeactivated] = useState(false);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await api.get(`/public/medical/${token}`);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setErrorMsg(res.data.message || 'Medical profile not found.');
        }
      } catch (err) {
        if (err.response?.status === 403) {
          setDeactivated(true);
          setErrorMsg('This emergency QR profile is currently deactivated by the patient.');
        } else {
          setErrorMsg(err.response?.data?.message || 'Invalid or expired medical QR token.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold animate-pulse">Loading Emergency Medical Data...</p>
        </div>
      </div>
    );
  }

  if (errorMsg || deactivated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {deactivated ? 'QR Profile Deactivated' : 'Invalid QR Code'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">{errorMsg}</p>
            <div className="pt-4">
              <Link
                to="/scan"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md inline-block"
              >
                Scan Another QR Code
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { patient, emergencySummary, medicalDetails, lastUpdated } = data;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      
      {/* Top Urgent Emergency Alert Banner */}
      <div className="bg-red-600 text-white px-4 py-2.5 shadow-lg flex items-center justify-between text-xs font-bold uppercase tracking-wider">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
          <span>EMERGENCY FIRST-RESPONDER MEDICAL SUMMARY</span>
        </div>
        <span className="text-[10px] bg-red-800 px-2 py-0.5 rounded">Verified Patient Record</span>
      </div>

      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        
        {/* PROMINENT RED EMERGENCY HIGHLIGHT HERO SECTION */}
        <div className="bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 border-2 border-red-600 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full filter blur-3xl -z-10"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-red-900/60 pb-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 block mb-1">
                PATIENT IDENTIFICATION
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {patient.name}
              </h1>
              <div className="flex items-center space-x-4 text-xs text-slate-300 mt-1">
                {patient.dateOfBirth && <span>DOB: {patient.dateOfBirth}</span>}
                {patient.gender && <span>Gender: {patient.gender}</span>}
              </div>
            </div>

            {/* Giant Blood Group Badge */}
            <div className="flex flex-col items-center bg-red-600 text-white p-4 rounded-2xl shadow-xl border border-red-400 shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider">BLOOD TYPE</span>
              <span className="text-4xl font-black tracking-tight">{emergencySummary.bloodGroup}</span>
              <span className="text-[10px] font-semibold">{emergencySummary.rhFactor || 'Positive'}</span>
            </div>
          </div>

          {/* Critical Emergency Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Lethal Allergies Warning */}
            <div className="p-4 bg-red-900/60 border border-red-600 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-extrabold text-red-300 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>SEVERE ALLERGIES & DRUG REACTIONS</span>
              </span>
              <p className="text-sm font-black text-white leading-tight">
                {emergencySummary.allergies || 'NO REPORTED ALLERGIES'}
              </p>
            </div>

            {/* Critical Conditions */}
            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-extrabold text-amber-400 flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5" />
                <span>CRITICAL MEDICAL CONDITIONS</span>
              </span>
              <p className="text-sm font-bold text-white leading-tight">
                {emergencySummary.criticalConditions || 'None Reported'}
              </p>
            </div>

          </div>

          {/* Emergency Contact Quick Call Box */}
          <div className="p-5 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-100 block">
                IN CASE OF EMERGENCY (ICE) CONTACT
              </span>
              <h3 className="text-lg font-bold">
                {emergencySummary.emergencyContactName} ({emergencySummary.emergencyContactRelationship})
              </h3>
              <p className="text-xs text-red-100">{emergencySummary.emergencyContactNumber}</p>
            </div>

            <a
              href={`tel:${emergencySummary.emergencyContactNumber}`}
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-red-700 font-extrabold text-sm rounded-xl hover:bg-slate-100 shadow-lg flex items-center justify-center space-x-2 transition-transform hover:scale-105"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>CALL EMERGENCY CONTACT</span>
            </a>
          </div>

        </div>

        {/* DETAILED MEDICAL SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Medications & History */}
          <div className="bg-slate-800/90 p-6 rounded-3xl border border-slate-700 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-700 pb-3">
              <Activity className="w-4 h-4 text-medical-400" />
              <span>Current Medications & Surgeries</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">Active Prescriptions:</span>
                <p className="text-slate-100 font-medium bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                  {emergencySummary.currentMedications || 'None Listed'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">Chronic Diseases:</span>
                <p className="text-slate-200">
                  {medicalDetails.chronicDiseases || 'None Reported'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">Previous Surgeries:</span>
                <p className="text-slate-200">
                  {medicalDetails.previousSurgeries || 'None Reported'}
                </p>
              </div>
            </div>
          </div>

          {/* Hospital & Attending Physician */}
          <div className="bg-slate-800/90 p-6 rounded-3xl border border-slate-700 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-700 pb-3">
              <Building2 className="w-4 h-4 text-medical-400" />
              <span>Preferred Care & Doctor</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">Preferred Hospital Facility:</span>
                <p className="text-slate-100 font-bold bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                  {medicalDetails.preferredHospital || 'Nearest Trauma Center'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">Primary Physician:</span>
                <p className="text-slate-200 font-semibold">{medicalDetails.primaryDoctor || 'Not Specified'}</p>
                {medicalDetails.doctorContact && (
                  <p className="text-medical-400 font-bold mt-0.5">{medicalDetails.doctorContact}</p>
                )}
              </div>
            </div>
          </div>

          {/* Physical Stats & Insurance */}
          <div className="bg-slate-800/90 p-6 rounded-3xl border border-slate-700 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-700 pb-3">
              <Info className="w-4 h-4 text-medical-400" />
              <span>Physical Stats & Organ Donor</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block uppercase">Height</span>
                <span className="font-bold text-slate-100">{medicalDetails.height || 'N/A'}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block uppercase">Weight</span>
                <span className="font-bold text-slate-100">{medicalDetails.weight || 'N/A'}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block uppercase">Donor</span>
                <span className="font-bold text-emerald-400">{medicalDetails.organDonorStatus || 'Yes'}</span>
              </div>
            </div>
          </div>

          {/* Insurance Details */}
          <div className="bg-slate-800/90 p-6 rounded-3xl border border-slate-700 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-700 pb-3">
              <ShieldCheck className="w-4 h-4 text-medical-400" />
              <span>Health Insurance Details</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Provider:</span>
                <span className="font-bold text-slate-100">{medicalDetails.insuranceProvider || 'Unspecified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Policy Number:</span>
                <span className="font-mono font-bold text-slate-100">{medicalDetails.insurancePolicyNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Additional Emergency Notes Callout */}
        {medicalDetails.additionalNotes && (
          <div className="p-4 bg-amber-950/60 border border-amber-800 rounded-2xl text-xs text-amber-200">
            <strong className="text-amber-400 font-bold block mb-1">Additional First-Responder Notes:</strong>
            <p>{medicalDetails.additionalNotes}</p>
          </div>
        )}

        {/* System Access Timestamp Notice */}
        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>QR Token Verified & Scan Event Logged</span>
          </span>
          <span>Updated: {new Date(lastUpdated).toLocaleDateString()}</span>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PublicMedicalProfilePage;
