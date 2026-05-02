import React from 'react';
import { useTranslation } from 'react-i18next';
import { MixCritique, AppTheme } from '../types';

interface CritiqueHTMLTemplateProps {
  critique: MixCritique;
  theme?: AppTheme;
}

export const CritiqueHTMLTemplate: React.FC<CritiqueHTMLTemplateProps> = ({ critique, theme = 'coldest' }) => {
  const { t } = useTranslation();
  const colors = {
    primary: '#0ea5e9', // sky-500
    primaryText: '#0ea5e9',
    primaryBorder: '#0ea5e9',
    lightBg: '#f0f9ff', // sky-50
    lightBorder: '#bae6fd', // sky-200
    darkBg: '#0f172a', // slate-900
    darkText: '#ffffff',
  };

  return (
    <div className="p-8 md:p-16 space-y-16 bg-[#0c4a6e] min-h-screen text-white font-sans">
      {/* Header */}
      <header className="text-center space-y-6 border-b border-[#0369a1] pb-16 print:border-slate-300">
        <div className="w-24 h-24 mx-auto bg-[#38bdf8] rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-[#38bdf8]/20 mb-8">
          🎧
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">{critique.title}</h1>
        <div className="flex items-center justify-center gap-4 text-lg md:text-xl font-bold uppercase tracking-widest text-[#38bdf8]">
          <span>{critique.isGangstaVox ? t('vocal_critique') : t('beat_critique')}</span>
          <span>•</span>
          <span>{t('engineering_report')}</span>
        </div>
      </header>

      {/* Executive Summary */}
      <section className="space-y-8">
        <h2 className="text-2xl font-black uppercase tracking-widest text-[#38bdf8] border-b border-[#0369a1] pb-4 print:border-slate-300">{t('executive_summary')}</h2>
        {critique.reCritiqueContext && (
          <div className="p-8 webos-card border-[#0369a1] mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#38bdf8] mb-4">{t('re_critique_context')}</h3>
            <p className="text-lg font-bold leading-relaxed text-slate-200">{critique.reCritiqueContext}</p>
          </div>
        )}
        <div className="p-8 webos-card border-[#0369a1]">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#38bdf8] mb-4">{t('overall_feedback')}</h3>
          <p className="text-2xl font-black leading-relaxed text-white">{critique.overallFeedback}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 webos-card border-[#0369a1]">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#38bdf8] mb-4">{t('strengths')}</h3>
            <ul className="space-y-3">
              {Array.isArray(critique.strengths) && critique.strengths.map((s, i) => (
                <li key={i} className="text-lg font-bold text-slate-200 flex items-start gap-3">
                  <span className="text-[#38bdf8] mt-1">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 webos-card border-[#0369a1]">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#38bdf8] mb-4">{t('areas_for_improvement')}</h3>
            <ul className="space-y-3">
              {Array.isArray(critique.weaknesses) && critique.weaknesses.map((w, i) => (
                <li key={i} className="text-lg font-bold text-slate-200 flex items-start gap-3">
                  <span className="text-[#38bdf8] mt-1">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Action Plan */}
      <section className="space-y-8 print-break">
        <h2 className="text-2xl font-black uppercase tracking-widest text-[#38bdf8] border-b border-[#0369a1] pb-4 print:border-slate-300">{t('action_plan_protocols')}</h2>
        <div className="space-y-8">
          {Array.isArray(critique.actionPlan) && critique.actionPlan.map((action, idx) => (
            <div key={idx} className="p-8 webos-card border-[#0369a1]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-[#38bdf8] text-white rounded-full flex items-center justify-center font-black text-lg">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">{action.issue}</h3>
              </div>
              <p className="text-lg font-bold text-slate-300 mb-8 pl-14">{action.solution}</p>
              
              <div className="pl-14 space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#38bdf8]">{t('recommended_chain')}</h4>
                <div className="grid grid-cols-1 gap-4">
                  {Array.isArray(action.recommendedChain) && action.recommendedChain.map((plugin, pIdx) => (
                    <div key={pIdx} className="p-6 bg-[#0c4a6e]/50 border border-[#0369a1] rounded-2xl flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <h5 className="text-lg font-black text-white">{plugin.name}</h5>
                        <p className="text-xs font-bold text-[#38bdf8] uppercase tracking-widest">{plugin.purpose}</p>
                      </div>
                      <div className="md:text-right">
                        {(Array.isArray(plugin.deepDive) ? plugin.deepDive : []).map((param, dIdx) => (
                          <p key={dIdx} className="font-mono text-xs font-black text-[#38bdf8] bg-[#0369a1]/30 px-2 py-0.5 rounded-lg inline-block mr-1">
                            {param.parameter}: {param.value}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specific Help */}
      {critique.specificHelp && critique.specificHelp.length > 0 && (
        <section className="space-y-8 print-break">
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#38bdf8] border-b border-[#0369a1] pb-4 print:border-slate-300">{t('specific_engineering_queries')}</h2>
          <div className="space-y-8">
            {Array.isArray(critique.specificHelp) && critique.specificHelp.map((help, idx) => (
              <div key={idx} className="p-8 webos-card border-[#0369a1]">
                <div className="mb-6">
                  <span className="text-xs font-black uppercase tracking-widest text-[#38bdf8] block mb-2">{t('query')}</span>
                  <h3 className="text-xl font-black text-white italic">"{help.query}"</h3>
                </div>
                <div className="mb-8">
                  <span className="text-xs font-black uppercase tracking-widest text-[#38bdf8] block mb-2">{t('advice')}</span>
                  <p className="text-lg font-bold text-slate-200 leading-relaxed">{help.advice}</p>
                </div>
                
                {help.recommendedChain && help.recommendedChain.length > 0 && (
                  <div className="space-y-4">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">{t('recommended_plugins')}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array.isArray(help.recommendedChain) && help.recommendedChain.map((plugin, pIdx) => (
                        <div key={pIdx} className="p-5 bg-[#0c4a6e]/50 border border-[#0369a1] rounded-2xl">
                          <h4 className="font-black text-white">{plugin.name}</h4>
                          <p className="text-xs font-bold text-[#38bdf8] mb-3">{plugin.purpose}</p>
                          {(plugin.band || plugin.routing) && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {plugin.band && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-[#0ea5e9]/20 text-[#38bdf8]">{plugin.band}</span>}
                              {plugin.routing && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-[#a855f7]/20 text-[#c084fc]">{plugin.routing}</span>}
                            </div>
                          )}
                          <div className="space-y-1">
                            {Array.isArray(plugin.deepDive) && plugin.deepDive.map((param: any, dIdx: number) => (
                              <div key={dIdx} className="text-[10px] font-bold opacity-70">
                                <span className="text-[#38bdf8]">{param.parameter}:</span> {param.value} - <span className="opacity-60">{param.explanation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Verdict */}
      <section className="text-center space-y-8 py-16 border-t border-[#0369a1] print-break print:border-slate-300">
        <h2 className="text-sm font-black uppercase tracking-widest text-[#38bdf8]">{t('engineering_verdict')}</h2>
        <p className="text-3xl md:text-4xl font-black leading-tight max-w-4xl mx-auto text-white tracking-tight italic">
          {t('verdict_text')}
        </p>
        <div className="pt-16">
          <div className="w-16 h-1 mx-auto rounded-full bg-[#38bdf8] mb-8" />
          <p className="text-xs font-black uppercase tracking-widest opacity-40 text-slate-500">{t('end_of_report')}</p>
        </div>
      </section>
    </div>
  );
};
