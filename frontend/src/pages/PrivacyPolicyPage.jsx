import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, Lock, Eye } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-slate-700 text-xs leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase text-medical-600">Privacy & Security Standard</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">MedSecure QR Privacy Policy</h1>
            <p className="text-slate-500">Effective Date: September 2026</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Tokenized Emergency Data Architecture</h3>
            <p>
              MedSecure QR uses cryptographically secure, random tokens to index public medical profile pages. Under no circumstances are database credentials, account passwords, JWT session keys, or payment details embedded directly into the QR code image.
            </p>

            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Patient Consent & Profile Sharing</h3>
            <p>
              By creating a medical profile and checking the Emergency Consent box, you grant authorization for first responders, paramedics, and medical personnel scanning your QR badge to view your submitted blood group, allergies, chronic conditions, and emergency contact details.
            </p>

            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. Access Logging & Audit Trails</h3>
            <p>
              Whenever your QR code is scanned, MedSecure QR logs access metadata including the timestamp, browser user-agent, and IP address. You can review your complete scan history at any time from your personal dashboard.
            </p>

            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">4. Patient Deactivation & Token Revocation</h3>
            <p>
              You maintain total control. If you deactivate your QR code or click "Regenerate Token," all existing physical prints or saved images containing the previous QR token immediately cease to function.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
