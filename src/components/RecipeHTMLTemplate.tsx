import React from 'react';
import { BeatRecipe, Hardware } from '../types';
import { isChannelStrip } from '../lib/pluginUtils';
import i18n from '../i18n';

export const RecipeHTMLTemplate: React.FC<{ recipe: BeatRecipe, drumKits?: any[], analogHardware?: Hardware[] }> = ({ recipe, drumKits = [], analogHardware = [] }) => {
  const t = i18n.t.bind(i18n);

  const renderDrumGrid = (steps: (number | { step: number, velocity: number })[] = [], isDoubleTime?: boolean) => {
    const safeSteps = Array.isArray(steps) ? steps : [];
    const totalSteps = isDoubleTime ? 32 : 16;
    const hasSecondHalf = safeSteps.some(s => typeof s === 'number' ? s > 16 : s.step > 16);
    const effectiveSteps = isDoubleTime && !hasSecondHalf && safeSteps.length > 0
      ? [...safeSteps, ...safeSteps.map(s => typeof s === 'number' ? s + 16 : { ...s, step: s.step + 16 })]
      : safeSteps;

    return (
      <div className="flex gap-1 mt-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isActive = effectiveSteps.some(s => typeof s === 'number' ? s === stepNum : s.step === stepNum);
          return (
            <div
              key={i}
              className={`flex-1 h-6 md:h-8 rounded-sm ${isActive ? 'bg-sky-500 print:bg-sky-500' : 'bg-slate-800 print:bg-slate-200'}`}
            />
          );
        })}
      </div>
    );
  };

  const renderDeepDive = (pluginName: string, deepDive: any[]) => {
    if (!deepDive || deepDive.length === 0) return null;
    
    const isStrip = isChannelStrip(pluginName);
    const limit = isStrip ? 30 : 10;
    const items = deepDive.slice(0, limit);
    
    return (
      <div className="space-y-1">
        {Array.isArray(items) && items.map((d, dIdx) => (
          <div key={dIdx} className="flex justify-between text-xs">
            <span className="text-slate-500 font-bold">{d.parameter}</span>
            <span className="text-slate-300 font-mono print:text-slate-700">{d.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 md:p-16 space-y-16 bg-[#0c4a6e] min-h-screen">
      {/* Header */}
      <header className="text-center space-y-6 border-b border-[#0369a1] pb-16 print:border-slate-300">
        <div className="w-24 h-24 mx-auto bg-[#38bdf8] rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-[#38bdf8]/20 mb-8">
          {recipe.title.charAt(0)}
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white print:text-black">{recipe.title}</h1>
        <div className="flex items-center justify-center gap-4 text-lg md:text-xl font-bold uppercase tracking-widest text-[#38bdf8]">
          <span>{recipe.style}</span>
          <span>•</span>
          <span>{recipe.bpm} BPM</span>
        </div>
        <p className="text-xl italic opacity-80 max-w-3xl mx-auto text-slate-300 print:text-slate-700">"{recipe.description}"</p>
      </header>

      {/* Layering & Master Path */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recipe.layeringStrategy && (
          <div className="p-8 webos-card border-[#0369a1] print:bg-slate-50 print:border-slate-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#38bdf8] mb-4">{t('layering_strategy')}</h3>
            <p className="text-lg font-bold leading-relaxed text-slate-200 print:text-slate-800">{recipe.layeringStrategy}</p>
          </div>
        )}
        {recipe.masterPlugins && recipe.masterPlugins.length > 0 && (
          <div className="p-8 webos-card border-[#0369a1] print:bg-slate-50 print:border-slate-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#38bdf8] mb-4">{t('mastering_path')}</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(recipe.masterPlugins) && recipe.masterPlugins.map((m, i) => (
                <span key={i} className="px-4 py-2 bg-[#0c4a6e] rounded-full text-xs font-bold uppercase tracking-widest text-slate-300 border border-[#0369a1] print:bg-white print:text-slate-800 print:border-slate-300">
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Instruments */}
      {recipe.instruments && recipe.instruments.length > 0 && (
        <section className="space-y-8 print-break">
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#38bdf8] border-b border-[#0369a1] pb-4 print:border-slate-300">{t('signal_flow_matrix')}</h2>
          <div className="grid grid-cols-1 gap-8">
            {Array.isArray(recipe.instruments) && recipe.instruments.map((inst, idx) => (
              <div key={idx} className="p-8 webos-card border-[#0369a1] print:bg-white print:border-slate-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-4 h-4 rounded-full bg-[#38bdf8]" />
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white print:text-black">{inst.name}</h3>
                    {inst.plugin && (
                      <span className="text-sm font-bold text-[#38bdf8] print:text-sky-600">{inst.plugin}</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t('source_goal')}</h4>
                    <p className="text-lg font-bold italic text-slate-300 print:text-slate-700">"{inst.sourceSoundGoal}"</p>
                  </div>
                  {inst.loopGuide && (
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#38bdf8] mb-2">{t('loop_guide')}</h4>
                      <p className="text-lg font-bold text-slate-200 print:text-slate-800">{inst.loopGuide}</p>
                    </div>
                  )}
                </div>

                {inst.midiNotes && (
                  <div className="mb-8 p-4 bg-[#0c4a6e] rounded-2xl border border-[#0369a1] print:bg-slate-50 print:border-slate-200">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t('midi_sequence')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(inst.midiNotes) ? (
                        inst.midiNotes.map((note: any, idx: number) => (
                          <span key={idx} className="font-mono text-xs px-2 py-1 bg-[#0369a1]/30 text-[#38bdf8] rounded border border-[#0369a1]/50 print:bg-sky-50 print:text-sky-700 print:border-sky-200">
                            {Array.isArray(note.pitch) ? note.pitch.join('+') : note.pitch} ({note.duration})
                          </span>
                        ))
                      ) : (
                        typeof inst.midiNotes === 'object' && !Array.isArray(inst.midiNotes) && Object.entries(inst.midiNotes).map(([section, notes]) => (
                          notes && notes.length > 0 && (
                            <div key={section} className="w-full mb-2">
                              <span className="text-[8px] font-black uppercase tracking-widest text-[#38bdf8] block mb-1">{section}</span>
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(notes) && notes.map((note: any, idx: number) => (
                                  <span key={idx} className="font-mono text-[9px] px-1.5 py-0.5 bg-[#0369a1]/30 text-[#38bdf8] rounded border border-[#0369a1]/50 print:bg-sky-50 print:text-sky-700 print:border-sky-200">
                                    {Array.isArray(note.pitch) ? note.pitch.join('+') : note.pitch} ({note.duration})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        ))
                      )}
                    </div>
                  </div>
                )}

                {inst.deepDive && inst.deepDive.length > 0 && (
                  <div className="mb-8 p-4 bg-[#0c4a6e]/30 rounded-2xl border border-[#0369a1] print:bg-slate-50 print:border-slate-200">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">{t('source_settings')}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array.isArray(inst.deepDive) && inst.deepDive.map((d, dIdx) => (
                        <div key={dIdx} className="flex justify-between text-sm">
                          <span className="text-slate-500 font-bold">{d.parameter}</span>
                          <span className="text-slate-300 font-mono print:text-slate-700">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {inst.fxPlugins && inst.fxPlugins.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#38bdf8] mb-4">{t('fx_chain')}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.isArray(inst.fxPlugins) && inst.fxPlugins.map((fx, fxIdx) => (
                        <div key={fxIdx} className="p-4 bg-[#0c4a6e]/50 rounded-2xl border border-[#0369a1] print:bg-slate-50 print:border-slate-200">
                          <h5 className="font-black text-white print:text-black mb-1">{fx.name}</h5>
                          <p className="text-xs font-bold uppercase tracking-widest text-[#38bdf8] mb-3">{fx.purpose}</p>
                          {renderDeepDive(fx.name, fx.deepDive)}
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

      {/* Drum Patterns */}
      {recipe.drumPatterns && Object.keys(recipe.drumPatterns).length > 0 && !recipe.isGangstaVox && (
        <section className="space-y-8 print-break">
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#38bdf8] border-b border-[#0369a1] pb-4 print:border-slate-300">{t('drum_guide_protocols')}</h2>
          <div className="grid grid-cols-1 gap-8">
            {typeof recipe.drumPatterns === 'object' && !Array.isArray(recipe.drumPatterns) && Object.entries(recipe.drumPatterns).map(([section, pattern]: [string, any]) => (
              <div key={section} className="p-8 webos-card border-[#0369a1] print:bg-white print:border-slate-300">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white print:text-black">{section}</h3>
                  <span className="text-xs font-black uppercase tracking-widest text-[#38bdf8] px-3 py-1 bg-[#38bdf8]/10 rounded-full">
                    {pattern.hiHat.isDoubleTime || pattern.snare.isDoubleTime || pattern.kick.isDoubleTime ? `32 ${t('steps')} (${t('double_time')})` : `16 ${t('steps')}`}
                  </span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('hi_hats')} {pattern.hiHat.isDoubleTime && `(${t('double_time')})`}</h4>
                    {renderDrumGrid(pattern.hiHat.steps, pattern.hiHat.isDoubleTime)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{pattern.snare.isClap ? t('clap') : t('snare')} {pattern.snare.isDoubleTime && `(${t('double_time')})`}</h4>
                    {renderDrumGrid(pattern.snare.steps, pattern.snare.isDoubleTime)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('kick')} {pattern.kick.isDoubleTime && `(${t('double_time')})`}</h4>
                    {renderDrumGrid(pattern.kick.steps, pattern.kick.isDoubleTime)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Music Theory */}
      {recipe.chordProgression && (
        <section className="space-y-8 print-break">
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#38bdf8] border-b border-[#0369a1] pb-4 print:border-slate-300">{t('music_theory_matrix')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 webos-card border-[#0369a1] print:bg-sky-50 print:border-sky-200">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#38bdf8] mb-4">{t('recommended_scale')}</h3>
              <p className="text-4xl font-black text-white print:text-black">{recipe.recommendedScale}</p>
            </div>
            <div className="p-8 webos-card border-[#0369a1] print:bg-white print:border-slate-300">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#38bdf8] mb-4">{t('main_progression')}</h3>
              <p className="text-2xl font-black text-white print:text-black">{recipe.chordProgression}</p>
            </div>
          </div>
        </section>
      )}

      {/* Busses */}
      {recipe.busses && recipe.busses.length > 0 && (
        <section className="space-y-8 print-break">
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#38bdf8] border-b border-[#0369a1] pb-4 print:border-slate-300">{t('bus_processing_matrix')}</h2>
          <div className="grid grid-cols-1 gap-8">
            {Array.isArray(recipe.busses) && recipe.busses.map((bus, idx) => (
              <div key={idx} className="p-8 webos-card border-l-4 border-l-[#38bdf8] print:bg-white print:border-slate-300 print:border-l-sky-500">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white print:text-black mb-6">{bus.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(bus.fxPlugins) && bus.fxPlugins.map((fx, fxIdx) => (
                    <div key={fxIdx} className="p-4 bg-[#0c4a6e]/50 rounded-2xl border border-[#0369a1] print:bg-slate-50 print:border-slate-200">
                      <h5 className="font-black text-white print:text-black mb-1">{fx.name}</h5>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#38bdf8] mb-3">{fx.purpose}</p>
                      {renderDeepDive(fx.name, fx.deepDive)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Vocal Elements */}
      {recipe.vocalElements && (
        <section className="space-y-8 print-break">
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#38bdf8] border-b border-[#0369a1] pb-4 print:border-slate-300">{t('vocal_elements_brief')}</h2>
          
          <div className="p-8 webos-card border-[#0369a1] print:bg-white print:border-slate-300 mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#38bdf8] mb-4">{t('vocal_layering_strategy')}</h3>
            <p className="text-xl font-bold italic text-slate-200 print:text-slate-800">"{recipe.vocalElements.layeringStrategy}"</p>
          </div>

          {recipe.vocalElements.trackingChain && analogHardware.some(h => h.name.toLowerCase().includes('apollo')) && (
            <div className="p-8 bg-[#0c4a6e] rounded-3xl border border-[#0369a1] print:bg-slate-50 print:border-slate-200 mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#38bdf8] mb-2">{t('apollo_tracking_chain')}</h3>
              <p className="text-xs font-bold text-slate-500 mb-6">{recipe.vocalElements.trackingChain.dspUsageNote}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipe.vocalElements.trackingChain.unisonPlugin && (
                  <div className="p-4 bg-[#38bdf8]/10 rounded-2xl border border-[#38bdf8]/20 print:bg-sky-50 print:border-sky-200">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#38bdf8] mb-1">{t('unison_preamp')}</h4>
                    <h5 className="font-black text-white print:text-black mb-3">{recipe.vocalElements.trackingChain.unisonPlugin.name}</h5>
                    {renderDeepDive(recipe.vocalElements.trackingChain.unisonPlugin.name, recipe.vocalElements.trackingChain.unisonPlugin.deepDive)}
                  </div>
                )}
                {Array.isArray(recipe.vocalElements.trackingChain.inserts) && recipe.vocalElements.trackingChain.inserts.map((fx, fxIdx) => (
                  <div key={fxIdx} className="p-4 bg-[#0c4a6e]/50 rounded-2xl border border-[#0369a1] print:bg-white print:border-slate-300">
                    <h5 className="font-black text-white print:text-black mb-1">{fx.name}</h5>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{fx.purpose}</p>
                    {renderDeepDive(fx.name, fx.deepDive)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {recipe.vocalElements.vocalTracks && recipe.vocalElements.vocalTracks.length > 0 && (
            <div className="grid grid-cols-1 gap-8">
              {Array.isArray(recipe.vocalElements.vocalTracks) && recipe.vocalElements.vocalTracks.map((track, idx) => (
                <div key={idx} className="p-8 webos-card border-[#0369a1] print:bg-white print:border-slate-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-4 h-4 rounded-full bg-[#38bdf8]" />
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white print:text-black">{track.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t('source_goal')}</h4>
                      <p className="text-lg font-bold italic text-slate-300 print:text-slate-700">"{track.sourceSoundGoal}"</p>
                    </div>
                    {track.loopGuide && (
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#38bdf8] mb-2">{t('arrangement_guide')}</h4>
                        <p className="text-lg font-bold text-slate-200 print:text-slate-800">{track.loopGuide}</p>
                      </div>
                    )}
                  </div>

                  {track.fxPlugins && track.fxPlugins.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#38bdf8] mb-4">{t('processing_chain')}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.isArray(track.fxPlugins) && track.fxPlugins.map((fx, fxIdx) => (
                          <div key={fxIdx} className="p-4 bg-[#0c4a6e]/50 rounded-2xl border border-[#0369a1] print:bg-slate-50 print:border-slate-200">
                            <h5 className="font-black text-white print:text-black mb-1">{fx.name}</h5>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#38bdf8] mb-3">{fx.purpose}</p>
                            {renderDeepDive(fx.name, fx.deepDive)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Mastering Chain */}
      {recipe.masterPlugins && recipe.masterPlugins.length > 0 && (
        <section className="space-y-8 print-break">
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#38bdf8] border-b border-[#0369a1] pb-4 print:border-slate-300">{t('mastering_chain_protocols')}</h2>
          <div className="grid grid-cols-1 gap-8">
            {Array.isArray(recipe.masterPlugins) && recipe.masterPlugins.map((plugin, idx) => (
              <div key={idx} className="p-8 webos-card border-[#0369a1] print:bg-white print:border-slate-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white print:text-black">{plugin.name}</h3>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 px-3 py-1 bg-[#0c4a6e] rounded-full print:bg-slate-100">
                    {t('master')} {idx + 1}
                  </span>
                </div>
                {renderDeepDive(plugin.name, plugin.deepDive)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Drum Kit Advice */}
      {recipe.drumKitAdvice && drumKits.length > 0 && !recipe.isGangstaVox && (
        <section className="space-y-8 print-break">
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#38bdf8] border-b border-[#0369a1] pb-4 print:border-slate-300">{t('drum_kit_tuning_setup')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 webos-card border-[#0369a1] print:bg-white print:border-slate-300">
              <h3 className="text-xl font-black uppercase tracking-tight text-white print:text-black mb-4">{t('kick')}</h3>
              <p className="text-slate-300 font-bold leading-relaxed print:text-slate-700">{recipe.drumKitAdvice.kick}</p>
            </div>
            <div className="p-8 webos-card border-[#0369a1] print:bg-white print:border-slate-300">
              <h3 className="text-xl font-black uppercase tracking-tight text-white print:text-black mb-4">{t('snare')}</h3>
              <p className="text-slate-300 font-bold leading-relaxed print:text-slate-700">{recipe.drumKitAdvice.snare}</p>
            </div>
            <div className="p-8 webos-card border-[#0369a1] print:bg-white print:border-slate-300">
              <h3 className="text-xl font-black uppercase tracking-tight text-white print:text-black mb-4">{t('toms')}</h3>
              <p className="text-slate-300 font-bold leading-relaxed print:text-slate-700">{recipe.drumKitAdvice.toms}</p>
            </div>
          </div>
        </section>
      )}

      {/* Verdict */}
      {recipe.mixingAdvice && (
        <section className="text-center space-y-8 py-16 border-t border-[#0369a1] print-break print:border-slate-300">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#38bdf8]">{t('engineering_verdict')}</h2>
          <p className="text-3xl md:text-4xl font-black leading-tight max-w-4xl mx-auto text-white print:text-black tracking-tight">
            {recipe.mixingAdvice}
          </p>
          <div className="pt-16">
            <div className="w-16 h-1 mx-auto rounded-full bg-[#38bdf8] mb-8" />
            <p className="text-xs font-black uppercase tracking-widest opacity-40 text-slate-500">{t('end_of_manual')}</p>
          </div>
        </section>
      )}
    </div>
  );
};
