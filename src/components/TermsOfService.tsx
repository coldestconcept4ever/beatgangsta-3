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
      <h1 className="text-4xl font-black mb-2 uppercase tracking-widest text-white">{t('terms_of_service_title')}</h1>
      
      <p className="text-sm opacity-70 mb-8">
        <strong>Last Updated:</strong> May 4, 2026
      </p>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">{t('terms_section_1_title')}</h2>
        <p>{t('terms_section_1_desc')}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">{t('terms_section_2_title')}</h2>
        <p>{t('terms_section_2_desc')}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">{t('terms_section_3_title')}</h2>
        <p>{t('terms_section_3_desc')}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">{t('terms_section_4_title')}</h2>
        <p>{t('terms_section_4_desc')}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">{t('terms_section_5_title')}</h2>
        <p>{t('terms_section_5_desc')}</p>
      </section>
    </div>
  );
};
