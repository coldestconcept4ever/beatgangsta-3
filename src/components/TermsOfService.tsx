import React from 'react';
import { useTranslation } from 'react-i18next';

export const TermsOfService: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-8 relative z-10 flex flex-col gap-8 text-white/80">
      <div className="mb-8">
        <button 
          onClick={() => { window.history.pushState({}, '', '/'); window.location.pathname = '/'; }}
          className="text-orange-400 hover:text-orange-300 transition-colors font-bold uppercase tracking-widest text-sm"
        >
          &larr; Back to Home
        </button>
      </div>
      <h1 className="text-4xl font-black mb-2 uppercase tracking-widest text-white">Terms of Service</h1>
      
      <p className="text-sm opacity-70 mb-8">
        <strong>Last Updated:</strong> May 4, 2026
      </p>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">1. Introduction</h2>
        <p>Welcome to BeatGangsta. By using our service, you agree to these terms.</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">2. User Accounts</h2>
        <p>You must be 13 years or older to use this service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">3. Content</h2>
        <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the Service, including its legality, reliability, and appropriateness.</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">4. Google API Services & User Data</h2>
        <p className="font-semibold text-white">
          BeatGangsta utilizes Google Sign-In to securely authenticate users. By using our service, you agree to our processing of your Google user data in compliance with the Google API Services User Data Policy.
        </p>
        <div className="bg-black/30 p-6 rounded-xl border border-orange-500/20 flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2 text-white border-b border-orange-500/20 pb-2">Data Accessed</h3>
            <p className="mb-2">We request access to your primary Google email address and public profile information (Name and Profile Picture) through standard, non-sensitive scopes during authentication.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-white border-b border-orange-500/20 pb-2">Data Usage</h3>
            <p className="mb-2">This data is strictly utilized for the singular purpose of authorizing your account, maintaining a secure session, and allowing you to save your personal studio data across our application.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-white border-b border-orange-500/20 pb-2">Data Storage & Sharing</h3>
            <p className="mb-2">Your Google authentication data is strictly safeguarded within our Firebase Authentication and Turso databases. We do not sell, rent, or trade your Google data to any third party for any reason. Our use of information received from Google APIs will strictly adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google API Services User Data Policy</a>, including all Limited Use requirements.</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">5. Modifications</h2>
        <p>We reserve the right to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">6. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at coldestconcept@gmail.com.</p>
      </section>
    </div>
  );
};
