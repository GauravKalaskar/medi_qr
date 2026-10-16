import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  User,
  Heart,
  Activity,
  PhoneCall,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
  Building2,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

const MedicalProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    // Personal Info
    address: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactRelationship: '',

    // Blood Info
    bloodGroup: 'O+',
    rhFactor: 'Positive',

    // Medical Info
    allergies: '',
    medicalConditions: '',
    chronicDiseases: '',
    previousSurgeries: '',
    currentMedications: '',
    previousMedications: '',
    disabilityInfo: '',

    // Emergency Info
    preferredHospital: '',
    primaryDoctor: '',
    doctorContact: '',

    // Additional Info
    height: '',
    weight: '',
    smokingStatus: 'Non-Smoker',
    alcoholStatus: 'No',
    organDonorStatus: 'Yes',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    additionalNotes: '',

    // Consent
    consentAccepted: true,
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/medical-profile');
        if (res.data.success && res.data.profile) {
          const p = res.data.profile;
          setFormData((prev) => ({
            ...prev,
            bloodGroup: p.bloodGroup || 'O+',
            rhFactor: p.rhFactor || 'Positive',
            address: p.address || '',
            allergies: p.allergies || '',
            medicalConditions: p.medicalConditions || '',
            chronicDiseases: p.chronicDiseases || '',
            previousSurgeries: p.previousSurgeries || '',
            currentMedications: p.currentMedications || '',
            previousMedications: p.previousMedications || '',
            disabilityInfo: p.disabilityInfo || '',
            emergencyContactName: p.emergencyContactName || '',
            emergencyContactNumber: p.emergencyContactNumber || '',
            emergencyContactRelationship: p.emergencyContactRelationship || '',
            preferredHospital: p.preferredHospital || '',
            primaryDoctor: p.primaryDoctor || '',
            doctorContact: p.doctorContact || '',
            height: p.height || '',
            weight: p.weight || '',
            smokingStatus: p.smokingStatus || 'Non-Smoker',
            alcoholStatus: p.alcoholStatus || 'No',
            organDonorStatus: p.organDonorStatus || 'Yes',
            insuranceProvider: p.insuranceProvider || '',
            insurancePolicyNumber: p.insurancePolicyNumber || '',
            additionalNotes: p.additionalNotes || '',
            consentAccepted: res.data.consentAccepted ?? true,
          }));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emergencyContactName.trim() || !formData.emergencyContactNumber.trim()) {
      setToast({ type: 'error', message: 'Please specify Emergency Contact Name and Phone Number.' });
      setActiveTab('personal');
      return;
    }

    if (!formData.consentAccepted) {
      setToast({ type: 'error', message: 'You must acknowledge emergency data consent to activate your QR code.' });
      return;
    }

    setSaving(true);

    try {
      const res = await api.post('/medical-profile', formData);
      if (res.data.success) {
        setToast({ type: 'success', message: 'Medical Profile saved successfully! QR Code Updated.' });
        setTimeout(() => {
          if (location.state?.isNewRegister) {
            navigate('/my-qr');
          }
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save medical profile.';
      setToast({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'personal', name: '1. Personal & ICE', icon: User },
    { id: 'blood', name: '2. Blood Info', icon: Heart },
    { id: 'medical', name: '3. Medical History', icon: Activity },
    { id: 'emergency', name: '4. Hospital & Doctor', icon: Building2 },
    { id: 'additional', name: '5. Physical & Insurance', icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-medical-600 bg-medical-50 px-3 py-1 rounded-full">
              Patient Medical Records
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              Edit Emergency Medical Profile
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep your critical medical information updated so first responders can treat you safely.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-medical-600/30 transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-60"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Medical Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-medical-600 text-white shadow-md shadow-medical-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-8">
          
          {/* TAB 1: PERSONAL & EMERGENCY CONTACT */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <User className="w-5 h-5 text-medical-600" />
                  <span>Personal Address & Emergency Contact (In Case of Emergency)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Who should emergency services notify if you are unconscious or unable to speak?
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Home Residential Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. 742 Evergreen Terrace, Springfield, OR 97477"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500"
                />
              </div>

              <div className="p-4 bg-red-50 border border-red-200/80 rounded-2xl space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-red-700 block">
                  Primary Emergency Contact Person *
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      required
                      placeholder="e.g. Sarah Doe"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Emergency Phone *
                    </label>
                    <input
                      type="tel"
                      name="emergencyContactNumber"
                      required
                      placeholder="e.g. +1-555-987-6544"
                      value={formData.emergencyContactNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Relationship *
                    </label>
                    <input
                      type="text"
                      name="emergencyContactRelationship"
                      required
                      placeholder="e.g. Spouse / Parent / Sibling"
                      value={formData.emergencyContactRelationship}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BLOOD INFORMATION */}
          {activeTab === 'blood' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span>Blood Group & Transfusion Information</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Critical for immediate matching during trauma transfusions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500 font-extrabold text-red-600 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Rh Factor Status
                  </label>
                  <select
                    name="rhFactor"
                    value={formData.rhFactor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500 bg-white"
                  >
                    <option value="Positive">Positive (+)</option>
                    <option value="Negative">Negative (-)</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDICAL HISTORY & ALLERGIES */}
          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-medical-600" />
                  <span>Allergies, Medical Conditions & Medications</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Warn paramedics about life-threatening drug reactions or active prescriptions.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200/80 rounded-2xl">
                  <label className="block text-xs font-extrabold text-red-700 uppercase tracking-wider mb-1">
                    Lethal & Severe Allergies (Drug / Food / Latex)
                  </label>
                  <textarea
                    rows={2}
                    name="allergies"
                    placeholder="e.g. Severe Penicillin anaphylaxis, Peanut allergy, Latex"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500 text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Existing Medical Conditions
                  </label>
                  <textarea
                    rows={2}
                    name="medicalConditions"
                    placeholder="e.g. Type 1 Diabetes Mellitus, Epilepsy, Pacemaker Implanted"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Current Active Medications
                  </label>
                  <textarea
                    rows={2}
                    name="currentMedications"
                    placeholder="e.g. Insulin Glargine 20u SC daily, Albuterol Inhaler PRN"
                    value={formData.currentMedications}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-medical-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Previous Surgeries & Dates
                    </label>
                    <input
                      type="text"
                      name="previousSurgeries"
                      placeholder="e.g. Appendectomy (2018), Knee Arthroscopy (2021)"
                      value={formData.previousSurgeries}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Disability Information
                    </label>
                    <input
                      type="text"
                      name="disabilityInfo"
                      placeholder="e.g. Hearing impaired in left ear, Wheelchair"
                      value={formData.disabilityInfo}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HOSPITAL & DOCTOR */}
          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Hospital className="w-5 h-5 text-medical-600" />
                  <span>Preferred Hospital & Primary Physician</span>
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Preferred Hospital Facility
                  </label>
                  <input
                    type="text"
                    name="preferredHospital"
                    placeholder="e.g. Springfield Memorial Hospital (Level 1 Trauma)"
                    value={formData.preferredHospital}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Primary Attending Doctor Name
                    </label>
                    <input
                      type="text"
                      name="primaryDoctor"
                      placeholder="e.g. Dr. Robert Marcus, MD"
                      value={formData.primaryDoctor}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Doctor Office Phone Number
                    </label>
                    <input
                      type="tel"
                      name="doctorContact"
                      placeholder="e.g. +1-555-321-7890"
                      value={formData.doctorContact}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PHYSICAL STATS & INSURANCE */}
          {activeTab === 'additional' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Info className="w-5 h-5 text-medical-600" />
                  <span>Physical Statistics, Habits & Insurance Details</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    name="height"
                    placeholder="e.g. 180 cm or 5ft 11in"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Weight
                  </label>
                  <input
                    type="text"
                    name="weight"
                    placeholder="e.g. 78 kg or 172 lbs"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Organ Donor Status
                  </label>
                  <select
                    name="organDonorStatus"
                    value={formData.organDonorStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Yes">Yes (Registered Organ Donor)</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Insurance Provider Company
                  </label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    placeholder="e.g. BlueCross BlueShield"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Insurance Policy Number
                  </label>
                  <input
                    type="text"
                    name="insurancePolicyNumber"
                    placeholder="e.g. BCBS-982173491-01"
                    value={formData.insurancePolicyNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Additional Emergency Notes for First Responders
                </label>
                <textarea
                  rows={2}
                  name="additionalNotes"
                  placeholder="e.g. Patient carries emergency glucagon pen in backpack."
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300"
                />
              </div>
            </div>
          )}

          {/* Privacy Consent Agreement Notice */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="consentAccepted"
                name="consentAccepted"
                checked={formData.consentAccepted}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 rounded text-medical-600 focus:ring-medical-500"
              />
              <label htmlFor="consentAccepted" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                <strong className="text-slate-900 font-bold">Privacy Notice & Consent Acknowledgement:</strong> I understand that the medical information saved above will be accessible via my generated MedSecure QR code token to authorized paramedics, doctors, or anyone scanning my emergency badge. I retain full rights to deactivate or regenerate my QR code at any time.
              </label>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Tokenized 256-bit encryption</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {activeTab !== 'additional' ? (
                <button
                  type="button"
                  onClick={() => {
                    const idx = tabs.findIndex((t) => t.id === activeTab);
                    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-medical-600/30 transition-all flex items-center space-x-2 disabled:opacity-60"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Generate QR</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </main>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <Footer />
    </div>
  );
};

export default MedicalProfilePage;
