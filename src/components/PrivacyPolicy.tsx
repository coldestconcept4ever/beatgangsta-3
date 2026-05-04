import React from 'react';
import { useTranslation } from 'react-i18next';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-8 relative z-10 flex flex-col gap-8 text-white/80">
      <div className="mb-8">
        <button 
          onClick={() => window.location.pathname = '/'}
          className="text-orange-400 hover:text-orange-300 transition-colors font-bold uppercase tracking-widest text-sm"
        >
          &larr; Back to Home
        </button>
      </div>

      <h1 className="text-4xl font-black mb-8 uppercase tracking-widest text-white">Privacy Policy</h1>
      
      <p className="text-sm opacity-70 mb-8">
        <strong>Last Updated:</strong> May 4th, 2026
      </p>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">1. Introduction</h2>
        <p>
          Welcome to BeatGangsta. We respect your privacy and are committed to protecting it through this Privacy Policy.
          This policy describes the types of information we may collect from you or that you may provide when you visit the website
          and use our services.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-orange-400">2. Google API Services & Google User Data</h2>
        <p className="font-semibold text-white">
          BeatGangsta uses Google Sign-In to authenticate users and manage accounts. To comply with the Google API Services User Data Policy, we disclose the following:
        </p>
        <div className="bg-black/30 p-6 rounded-xl border border-orange-500/20 flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2 text-white">Data Accessed</h3>
            <p>
              When you choose to sign in using Google, our application requests access to the following 
              Google user data through standard non-sensitive scopes:
            </p>
            <ul className="list-disc ml-6 mt-2 flex flex-col gap-2">
              <li><strong>Email Address</strong> (<code>email</code> scope)</li>
              <li><strong>Profile Information</strong> (<code>profile</code> scope), which includes your Name and Profile Picture.</li>
              <li><strong>OpenID</strong> (<code>openid</code> scope) to securely authenticate your session.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-white">Data Usage</h3>
            <p>
              We process and handle this Google user data solely for the following purposes:
            </p>
            <ul className="list-disc ml-6 mt-2 flex flex-col gap-2">
              <li><strong>Authentication:</strong> We use your Google account to securely sign you into our application without requiring you to create and manage a separate password.</li>
              <li><strong>Account Creation & Identification:</strong> Your email address serves as your unique identifier within our application, allowing us to store and retrieve your personal plugin library, generated recipes, and saved studio settings across devices.</li>
              <li><strong>User Experience:</strong> We optionally use your Name and Profile Picture to personalize the application interface and provide a welcoming, customized experience.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2 text-white">Data Storage & Sharing</h3>
            <p>
              Your Google user data is securely stored within our Firebase Authentication and isolated, secure Turso cloud databases. 
              <strong>We do not share, sell, or transfer your Google user data to any third parties whatsoever, except where strictly necessary to provide the service (i.e., Firebase and Turso infrastructure) or as required by law.</strong> No data retrieved from Google is used for model training or secondary marketing purposes.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">3. Information We Collect</h2>
        <p>In addition to Google user data for authentication, we may collect:</p>
        <ul className="list-disc ml-6">
          <li><strong>Studio Data:</strong> Information about your VST plugin library, DAW, hardware, and generated recipes when you save them to your vault.</li>
          <li><strong>Usage Information:</strong> Details of your visits to our application, including interactions, recipe generation metrics, and preferences.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">4. Your Rights & Deletion</h2>
        <p>
          You have the right to request access to or deletion of your personal data at any time. 
          To request complete deletion of your account and all associated data (including Google authentication records and saved studio data), please contact us or use the account deletion options provided in the application settings.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">5. Contact Information</h2>
        <p>
          If you have any questions, comments, or concerns about this privacy policy, please contact us at: 
          <a href="mailto:coldestconcept@gmail.com" className="text-orange-400 hover:text-orange-300 ml-2">coldestconcept@gmail.com</a>
        </p>
      </section>
    </div>
  );
};
