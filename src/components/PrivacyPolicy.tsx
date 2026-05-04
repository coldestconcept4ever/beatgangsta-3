import React from 'react';
import { useTranslation } from 'react-i18next';

export const PrivacyPolicy: React.FC = () => {
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

      <h1 className="text-4xl font-black mb-2 uppercase tracking-widest text-white">{t('privacy_policy_title')}</h1>
      
      <p className="text-sm opacity-70 mb-8">
        <strong>Last Updated:</strong> May 4, 2026
      </p>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">{t('privacy_section_1_title')}</h2>
        <p>{t('privacy_section_1_desc')}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">{t('privacy_section_2_title')}</h2>
        <p>{t('privacy_section_2_desc')}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-orange-400">Google API Services & User Data</h2>
        <p className="font-semibold text-white">
          BeatGangsta uses Google Sign-In to authenticate users and manage accounts. To comply with the Google API Services User Data Policy and Google APIs Terms of Service, we thoroughly disclose how our application accesses, uses, stores, and shares Google user data:
        </p>
        <div className="bg-black/30 p-6 rounded-xl border border-orange-500/20 flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2 text-white border-b border-orange-500/20 pb-2">Data Accessed</h3>
            <p className="mb-2">
              The specific types of Google user data our application accesses, collects, and interacts with include:
            </p>
            <ul className="list-disc ml-6 mt-2 flex flex-col gap-2">
              <li><strong>Email Address:</strong> We access the primary email address associated with your Google account (via the <code>email</code> scope).</li>
              <li><strong>Profile Information:</strong> We access your basic public profile information, specifically your Name and Profile Picture (via the <code>profile</code> scope).</li>
              <li><strong>Authentication Data:</strong> We access OpenID connect data (via the <code>openid</code> scope) to securely verify your identity.</li>
            </ul>
            <p className="mt-4 text-sm opacity-80 italic">We do not request, access, or collect any sensitive or restricted scopes from your Google account. We only access the minimum necessary data to create and manage your account.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-white border-b border-orange-500/20 pb-2">Data Usage</h3>
            <p className="mb-2">
              How our application uses, processes, and handles the Google user data it accesses, and the purpose for this use:
            </p>
            <ul className="list-disc ml-6 mt-2 flex flex-col gap-2">
              <li><strong>Authentication & Security:</strong> We use your OpenID data and email to securely sign you into our application and verify your identity, eliminating the need for a separate password.</li>
              <li><strong>Account Identification:</strong> We process your email address to serve as your unique, primary account identifier within our system. The purpose of this is to securely link and retrieve your personal studio data (such as your VST plugin library, saved recipes, and DAW settings) across different devices and sessions.</li>
              <li><strong>User Experience Personalization:</strong> We handle your Name and Profile Picture strictly to personalize the user interface within the application (e.g., displaying your name on your dashboard or your avatar in your profile settings).</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-white border-b border-orange-500/20 pb-2">Data Storage & Sharing</h3>
            <p className="mb-2">
              Your Google user data (Email, Name, Profile Picture) is securely stored encrypted at rest within our Firebase Authentication and isolated Turso cloud databases. 
            </p>
            <p className="mb-2">
              <strong>We strictly do not share, sell, or transfer your Google user data to any third parties or brokers whatsoever.</strong> The only exception is the minimal data sharing strictly necessary to provide the service infrastructure itself (i.e., data stored on our secure Firebase and Turso servers).
            </p>
            <p>
              <strong>No data retrieved from Google is used for model training, AI/ML training, or secondary advertising/marketing purposes.</strong>
            </p>
          </div>

          <div className="bg-orange-950/30 p-4 rounded-lg border border-orange-500/30 mt-2">
            <h3 className="font-bold text-md mb-2 text-orange-300">Limited Use Disclosure</h3>
            <p className="text-sm font-medium text-white/90">
              BeatGangsta's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">{t('privacy_section_3_title')}</h2>
        <p>{t('privacy_section_3_desc')}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">{t('privacy_section_4_title')}</h2>
        <p>{t('privacy_section_4_desc')}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">{t('privacy_section_5_title')}</h2>
        <p>{t('privacy_section_5_desc')}</p>
      </section>
    </div>
  );
};
