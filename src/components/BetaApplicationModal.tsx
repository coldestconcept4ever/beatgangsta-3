import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Instagram, MessageSquare, Mail, Smartphone, Check } from 'lucide-react';

interface BetaApplicationModalProps {
  onClose: () => void;
  theme: string;
}

export const BetaApplicationModal: React.FC<BetaApplicationModalProps> = ({ onClose, theme }) => {
  const [daw, setDaw] = useState('');
  const [experience, setExperience] = useState('');
  const [contactMethod, setContactMethod] = useState('Instagram');
  const [contactInfo, setContactInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isCrazyBird = theme === 'crazy-bird';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!daw || !experience || !contactInfo) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/beta/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ daw, experience, contactMethod, contactInfo })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border ${isCrazyBird ? 'bg-zinc-900 border-red-900/40' : 'bg-zinc-900 border-white/10'}`}
      >
        <div className={`flex justify-between items-center p-4 border-b ${isCrazyBird ? 'border-red-900/40 bg-zinc-950' : 'border-white/10 bg-zinc-950/50'}`}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Beta Tester Application
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto">
                <Check size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Application Received!</h3>
              <p className="text-zinc-400">
                Thank you for applying to be a beta tester. The developer will respond within 24-48 hours.
              </p>
              <button 
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded bg-red-500/20 text-red-300 text-sm border border-red-500/30">
                  {error}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-300">What DAW do you use?</label>
                <input 
                  type="text" 
                  value={daw}
                  onChange={e => setDaw(e.target.value)}
                  placeholder="e.g. FL Studio, Ableton, Logic Pro"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-300">Years of experience making music</label>
                <input 
                  type="text" 
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  placeholder="e.g. 5 years, just started, etc."
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-300">Preferred contact method</label>
                <div className="relative">
                  <select 
                    value={contactMethod}
                    onChange={e => setContactMethod(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white appearance-none focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Text Message">Text Message</option>
                    <option value="Email">Email</option>
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    {contactMethod === 'Instagram' && <Instagram size={16} />}
                    {contactMethod === 'TikTok' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>}
                    {contactMethod === 'Text Message' && <Smartphone size={16} />}
                    {contactMethod === 'Email' && <Mail size={16} />}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-300">
                  {contactMethod === 'Instagram' ? 'Instagram Username' : 
                   contactMethod === 'TikTok' ? 'TikTok Username' : 
                   contactMethod === 'Text Message' ? 'Phone Number' : 'Email Address'}
                </label>
                <input 
                  type={contactMethod === 'Email' ? 'email' : contactMethod === 'Text Message' ? 'tel' : 'text'}
                  value={contactInfo}
                  onChange={e => setContactInfo(e.target.value)}
                  placeholder={contactMethod === 'Instagram' ? '@username' : 
                               contactMethod === 'TikTok' ? '@username' : 
                               contactMethod === 'Text Message' ? '(555) 123-4567' : 'your@email.com'}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
