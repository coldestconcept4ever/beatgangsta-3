import React, { useState, useEffect } from 'react';
import { RefreshCw, Loader2, ShieldCheck, Zap, Mail, X } from 'lucide-react';
import { VSTPlugin } from '../types';
import { EQVisualizer } from './EQVisualizer';

export interface PluginBubbleProps {
  name: string;
  purpose: string;
  deepDive: any[];
  band?: string;
  routing?: string;
  isRegenerating: boolean;
  onRegenerate: () => void;
  onCorrect?: (pluginName: string, corrections: { parameter: string, value: string }[], version: string) => Promise<{ success: boolean, message: string, plugin?: VSTPlugin }>;
  onContactSupport?: (pluginInfo: any) => void;
  theme: string;
  className?: string;
}

export const PluginBubble: React.FC<PluginBubbleProps> = ({ name, purpose, deepDive, band, routing, isRegenerating, onRegenerate, onCorrect, onContactSupport, theme, className = '' }) => {
  const [isCorrectionMode, setIsCorrectionMode] = useState(false);
  const [corrections, setCorrections] = useState<{ parameter: string, value: string }[]>(() => {
    return (deepDive || []).map(d => ({ parameter: d.parameter, value: d.value }));
  });

  useEffect(() => {
    setCorrections((deepDive || []).map(d => ({ parameter: d.parameter, value: d.value })));
  }, [deepDive]);
  const [userVersion, setUserVersion] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean, message: string } | null>(null);

  const handleCorrect = async () => {
    if (!onCorrect) return;
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const result = await onCorrect(name, corrections, userVersion);
      setVerificationResult(result);
      if (result.success) {
        setTimeout(() => setIsCorrectionMode(false), 3000);
      }
    } catch (error) {
      setVerificationResult({ success: false, message: "An error occurred during verification." });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={`relative p-4 rounded-2xl border ${className} ${isRegenerating ? 'opacity-50 blur-sm' : ''}`}>
      {isRegenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-2xl z-10">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {band && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              band.toLowerCase().includes('low') ? 'bg-indigo-100 text-indigo-700' :
              band.toLowerCase().includes('mid') ? 'bg-amber-100 text-amber-700' :
              band.toLowerCase().includes('high') ? 'bg-rose-100 text-rose-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {band}
            </span>
          )}
          <h6 className="font-black text-xs">{name}</h6>
          <div className="flex items-center gap-1">
            <button 
              onClick={onRegenerate} 
              disabled={isRegenerating}
              className="p-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 transition-all shadow-sm"
              title="Regenerate Settings"
            >
              <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
            </button>
            {onCorrect && (
              <button 
                onClick={() => setIsCorrectionMode(!isCorrectionMode)}
                className={`p-1.5 rounded-full transition-all shadow-sm ${isCorrectionMode ? 'bg-red-500 text-white' : 'bg-sky-100 hover:bg-sky-200 text-sky-700'}`}
                title="Correction Mode"
              >
                <ShieldCheck className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <span className="text-[8px] font-black uppercase tracking-widest opacity-70">{purpose}</span>
      </div>

      {isCorrectionMode ? (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 gap-3">
            {corrections.map((c, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-black/5 border border-black/5">
                <div className="flex-1 w-full sm:w-auto">
                  <label className="text-[8px] font-black uppercase opacity-50 block mb-1">Current Value</label>
                  <input 
                    type="text"
                    value={c.value}
                    onChange={(e) => {
                      const newCorrections = [...corrections];
                      newCorrections[idx].value = e.target.value;
                      setCorrections(newCorrections);
                    }}
                    className="w-full p-2 rounded-lg bg-white/50 border border-black/10 text-[10px] font-bold focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                    placeholder="Value..."
                  />
                </div>
                <div className="flex-[2] w-full sm:w-auto">
                  <label className="text-[8px] font-black uppercase opacity-50 block mb-1">Parameter Name in Plugin</label>
                  <div className="flex gap-1">
                    <input 
                      type="text"
                      value={c.parameter}
                      onChange={(e) => {
                        const newCorrections = [...corrections];
                        newCorrections[idx].parameter = e.target.value;
                        setCorrections(newCorrections);
                      }}
                      className="flex-1 p-2 rounded-lg bg-white border border-black/10 text-[10px] font-bold focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                      placeholder="e.g. Threshold, Ratio..."
                    />
                    <button 
                      onClick={() => {
                        setCorrections(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setCorrections(prev => [...prev, { parameter: '', value: '?' }])}
            className="w-full py-1.5 border border-dashed border-sky-500/30 rounded-xl text-[8px] font-black uppercase tracking-widest text-sky-600 hover:bg-sky-500/5 transition-all"
          >
            + Add Parameter to Research
          </button>
          
          <div className="flex flex-col gap-1 pt-2 border-t border-black/5">
            <label className="text-[8px] font-black uppercase opacity-50">Version / Edition (Standard, Advanced...)</label>
            <input 
              type="text"
              value={userVersion}
              onChange={(e) => setUserVersion(e.target.value)}
              className="w-full p-2 rounded-xl bg-black/5 border border-black/10 text-[10px] font-bold"
              placeholder="e.g. Advanced, Standard, v2.0"
            />
          </div>

          <button
            onClick={handleCorrect}
            disabled={isVerifying}
            className="w-full py-2 rounded-xl bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
          >
            {isVerifying ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
            {isVerifying ? 'Verifying...' : 'Research & Verify'}
          </button>

          {verificationResult && (
            <div className={`p-3 rounded-xl text-[10px] font-bold ${verificationResult.success ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
              <p>{verificationResult.message}</p>
              {!verificationResult.success && onContactSupport && (
                <button
                  onClick={() => {
                    const correctionObj: { [key: string]: string } = {};
                    corrections.forEach(c => {
                      correctionObj[c.parameter] = c.value;
                    });
                    onContactSupport({ name, corrections: correctionObj, userVersion });
                  }}
                  className="mt-2 w-full py-2 rounded-lg bg-red-500 text-white flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
                >
                  <Mail className="w-3 h-3" />
                  Request Developer Investigation
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 mb-3">
          {(band || routing) && (
            <div className="flex flex-wrap gap-2 mb-2">
              {band && <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${theme === 'coldest' ? 'bg-sky-500/20 text-sky-300' : 'bg-black/10'}`}>{band}</span>}
              {routing && <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${theme === 'coldest' ? 'bg-purple-500/20 text-purple-300' : 'bg-black/10'}`}>{routing}</span>}
            </div>
          )}
          
          {((name || '').toLowerCase().includes('eq') || (name || '').toLowerCase().includes('equalizer') || (purpose || '').toLowerCase().includes('eq') || (purpose || '').toLowerCase().includes('equaliz')) && Array.isArray(deepDive) && deepDive.length > 0 && (
            <EQVisualizer parameters={deepDive} theme={theme} />
          )}

          {Array.isArray(deepDive) && deepDive.map((s, sIdx) => (
            <div key={sIdx} className="text-xs font-bold opacity-90">
              <span className={`${theme === 'coldest' ? 'text-sky-300' : 'text-current'}`}>{s.parameter}:</span> {s.value} {s.explanation && <span className="opacity-70">- {s.explanation}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
