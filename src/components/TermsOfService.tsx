import React from 'react';

export const TermsOfService: React.FC = () => {
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
      <h1 className="text-4xl font-black mb-8 uppercase tracking-widest text-white">Terms of Service</h1>
      <p>Welcome to BeatGangsta. By using our service, you agree to these terms.</p>
    </div>
  );
};
