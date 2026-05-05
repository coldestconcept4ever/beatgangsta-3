import React from 'react';
import { PluginBubble } from './PluginBubble';
import { DeepDivePlugin } from '../types';
import { Scissors } from 'lucide-react';

interface PluginChainRendererProps {
  plugins: DeepDivePlugin[];
  type: string;
  trackIdx: number;
  theme: string;
  regeneratingPluginId?: string | null;
  handleRegenerate: (dive: any, trackIdx: number, pluginIdx: number, type: any) => void;
  onCorrectPlugin?: (pluginName: string, corrections: { parameter: string, value: string }[], version: string) => Promise<{ success: boolean, message: string, plugin?: import('../types').VSTPlugin }>;
  onContactSupport?: (pluginInfo: any) => void;
}

export const PluginChainRenderer: React.FC<PluginChainRendererProps> = ({
  plugins,
  type,
  trackIdx,
  theme,
  regeneratingPluginId,
  handleRegenerate,
  onCorrectPlugin,
  onContactSupport
}) => {
  const getClassName = (isBand = false) => {
    if (type === 'master') {
      return theme === 'coldest' ? 'bg-emerald-950/60 border-emerald-500/40 shadow-md' : 'bg-emerald-900/10 border-emerald-500/20';
    } else if (type === 'bus') {
      return theme === 'coldest' ? 'bg-black/40 border-orange-500/20' : 'bg-black/30 border-white/10';
    } else if (type.includes('tracking')) {
      return theme === 'coldest' ? 'bg-sky-900/40 border-sky-500/40 shadow-md' : 'bg-white/5 border-white/10';
    } else if (type === 'vocal-track-fx') {
      return theme === 'coldest' ? 'bg-purple-900/40 border-purple-500/40 shadow-md' : 'bg-purple-900/20 border-purple-400/30';
    }
    // track, layer etc.
    if (isBand) {
      return theme === 'coldest' ? 'bg-purple-900/60 border-purple-400/50 shadow-md' : 'bg-purple-900/30 border-purple-500/40';
    }
    return theme === 'coldest' ? 'bg-purple-900/40 border-purple-500/40 shadow-md' : 'bg-purple-900/20 border-purple-500/30';
  };

  if (!Array.isArray(plugins) || plugins.length === 0) return null;

  // Check if there are bands (Klevgrand mode)
  const hasBands = plugins.some(p => p.band);

  if (!hasBands) {
    return (
      <>
        {plugins.map((dive, dIdx) => (
          <PluginBubble 
            key={dIdx}
            name={dive.name}
            purpose={dive.purpose}
            deepDive={dive.deepDive}
            band={dive.band}
            routing={dive.routing}
            isRegenerating={regeneratingPluginId === `${type}-${trackIdx}-${dIdx}`}
            onRegenerate={() => handleRegenerate(dive, trackIdx, dIdx, type as any)}
            onCorrect={onCorrectPlugin}
            onContactSupport={onContactSupport}
            theme={theme}
            className={getClassName(false)}
          />
        ))}
      </>
    );
  }

  // Group by band
  const unbanded: DeepDivePlugin[] = [];
  const bands: Record<string, DeepDivePlugin[]> = {};

  plugins.forEach(p => {
    if (p.band) {
      if (!bands[p.band]) bands[p.band] = [];
      bands[p.band].push(p);
    } else {
      unbanded.push(p);
    }
  });

  return (
    <div className="space-y-4">
      {/* Unbanded first (usually Gaffel itself) */}
      {unbanded.map((dive, unIdx) => {
        const actualIdx = plugins.findIndex(p => p === dive);
        return (
          <PluginBubble 
            key={`unbanded-${unIdx}`}
            name={dive.name}
            purpose={dive.purpose}
            deepDive={dive.deepDive}
            band={dive.band}
            routing={dive.routing}
            isRegenerating={regeneratingPluginId === `${type}-${trackIdx}-${actualIdx}`}
            onRegenerate={() => handleRegenerate(dive, trackIdx, actualIdx, type as any)}
            onCorrect={onCorrectPlugin}
            onContactSupport={onContactSupport}
            theme={theme}
            className={getClassName(false)}
          />
        );
      })}

      {/* Band specific columns */}
      {Object.keys(bands).length > 0 && (
        <div className={`mt-6 rounded-3xl p-6 border ${theme === 'coldest' ? 'bg-purple-950/40 border-purple-500/60' : 'bg-purple-950/20 border-purple-500/20'}`}>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#fuchsia-400] mb-6 flex items-center gap-2">
            <Scissors className="text-fuchsia-400" size={14} /> <span className="text-fuchsia-400">MULTIBAND PARALLEL PROCESSING</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(bands).map(([bandName, bandPlugins], bIdx) => (
              <div key={bIdx} className="space-y-4 border-l-2 border-fuchsia-500/30 pl-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    bandName.toLowerCase().includes('low') ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                    bandName.toLowerCase().includes('mid') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    bandName.toLowerCase().includes('high') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {bandName} Band
                  </span>
                </div>
                {bandPlugins.map((dive, dSubIdx) => {
                  const actualIdx = plugins.findIndex(p => p === dive);
                  return (
                    <PluginBubble 
                      key={`band-${bIdx}-${dSubIdx}`}
                      name={dive.name}
                      purpose={dive.purpose}
                      deepDive={dive.deepDive}
                      band={dive.band}
                      routing={dive.routing}
                      isRegenerating={regeneratingPluginId === `${type}-${trackIdx}-${actualIdx}`}
                      onRegenerate={() => handleRegenerate(dive, trackIdx, actualIdx, type as any)}
                      onCorrect={onCorrectPlugin}
                      onContactSupport={onContactSupport}
                      theme={theme}
                      className={getClassName(true)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
