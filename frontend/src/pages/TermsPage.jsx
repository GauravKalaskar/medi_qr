import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-slate-700 text-xs leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
            <p className="text-slate-500">Effective Date: September 2026</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Medical Information Accuracy</h3>
            <p>
              Users are responsible for ensuring that all medical details entered (blood type, drug allergies, emergency contact phone numbers) are accurate and kept up to date.
            </p>

            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Emergency Responder Disclaimer</h3>
            <p>
              MedSecure QR provides informational emergency data assistance. In life-threatening emergencies, call 911 or your local emergency response service immediately.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
