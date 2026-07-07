import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Layers, Sliders, Info, Zap, Filter } from 'lucide-react';
import { JSFX_DATABASE, JSFXProfile } from '../data/jsfxResearch';

const getUiType = (plugin: JSFXProfile): 'gui' | 'slider' => {
  const guiPacks = [
    'Tukan Studios', 
    'Geraint Luff', 
    'Saike Tools (Joep Vanlier)', 
    'Sonic Anomaly', 
    'Suzuki (RCGN) JSFX',
    'Suzuki-Scripts (lewloiwc / Suzuki)',
    'ReJJ',
    'Souk21 ReaPack',
    'Erriez'
  ];
  if (plugin.packRequired && guiPacks.includes(plugin.packRequired)) return 'gui';
  
  const nameL = plugin.name.toLowerCase();
  const shortL = plugin.shortName.toLowerCase();
  const packL = (plugin.packRequired || '').toLowerCase();

  // Known GUI packs or visual-oriented creators
  if (
    nameL.includes('tukan') || 
    nameL.includes('saike') || 
    nameL.includes('geraint') || 
    nameL.includes('sonic anomaly') || 
    nameL.includes('reeq') ||
    nameL.includes('respectrum') ||
    packL.includes('tukan') ||
    packL.includes('saike') ||
    packL.includes('geraint') ||
    packL.includes('sonic anomaly') ||
    packL.includes('rejj')
  ) {
    return 'gui';
  }

  // Stock / third-party plugins known to have @gfx visual/interactive interfaces
  const guiKeywords = [
    'loudness meter',
    'oscilloscope',
    'goniometer',
    'spectrograph',
    'spectrogram',
    'spectrum analyzer',
    'general dynamics',
    'gain reduction scope',
    'graphical dynamic waveshaper',
    'graphical waveshaper',
    'super8',
    'sequencer baby',
    'sequencer megababy',
    'midi logger',
    'mtc logger',
    'midi map to key v2',
    'audio statistics',
    'bit meter',
    'channel mapper-downmixer',
    'non-linear processor',
    'np1136',
    'ring modulator',
    'saturation',
    'simple 1-pole',
    'apple 2-pole',
    'apple 12-pole',
    'butterworth 4-pole',
    'chebyshev',
    'mga js limiter',
    'versatile compressor',
    'dynamic range meter',
    'lorenz attractor',
    'smpte ltc',
    'vu meter',
    'waveshaping distortion',
    'wigware',
    'zoom analyzer',
    'de-esser',
    'moog 4-pole',
    'stereo image filter',
    'spectropaint',
    'gonionmeter'
  ];

  if (guiKeywords.some(keyword => nameL.includes(keyword) || shortL.includes(keyword))) {
    return 'gui';
  }

  return 'slider';
};

export const JSFXDatabaseViewer = ({ onBack, theme }: { onBack: () => void, theme: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlugin, setSelectedPlugin] = useState<JSFXProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUiType, setSelectedUiType] = useState<'all' | 'gui' | 'slider'>('all');

  const categories = useMemo(() => {
    const cats = new Set(JSFX_DATABASE.map(p => p.category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  const filteredPlugins = useMemo(() => {
    return JSFX_DATABASE.filter(plugin => {
      const matchesSearch = 
        plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || plugin.category === selectedCategory;
      const pluginUiType = getUiType(plugin);
      const matchesUiType = selectedUiType === 'all' || pluginUiType === selectedUiType;

      return matchesSearch && matchesCategory && matchesUiType;
    });
  }, [searchQuery, selectedCategory, selectedUiType]);

  return (
    <div className={`min-h-[100dvh] w-full flex flex-col ${theme === 'coldest' ? 'bg-slate-50 text-slate-900' : 'bg-zinc-950 text-white'}`}>
      <div className={`sticky top-0 z-50 flex items-center gap-4 px-6 py-4 border-b backdrop-blur-md ${theme === 'coldest' ? 'bg-white/80 border-slate-200' : 'bg-black/40 border-white/10'}`}>
        <button
          onClick={onBack}
          className={`p-2 rounded-xl transition-colors ${theme === 'coldest' ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
            <Layers size={18} className="opacity-50" />
            JSFX Database <span className="opacity-50 font-medium">({filteredPlugins.length} / {JSFX_DATABASE.length})</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex-1 p-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar / List */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'coldest' ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-opacity-20 ${
                  theme === 'coldest' 
                    ? 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500' 
                    : 'bg-zinc-900 border-white/10 focus:border-blue-400 focus:ring-blue-400'
                }`}
              />
            </div>
            
            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <Filter size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'coldest' ? 'text-slate-400' : 'text-slate-500'}`} />
                <select 
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className={`w-full pl-8 pr-8 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider appearance-none outline-none ${
                    theme === 'coldest'
                      ? 'bg-white border-slate-200 focus:border-blue-500'
                      : 'bg-zinc-900 border-white/10 focus:border-blue-400'
                  }`}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex bg-transparent rounded-lg border overflow-hidden" style={{ borderColor: theme === 'coldest' ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
                <button 
                  onClick={() => setSelectedUiType('all')}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider ${selectedUiType === 'all' ? (theme === 'coldest' ? 'bg-slate-200' : 'bg-white/20') : (theme === 'coldest' ? 'bg-white' : 'bg-zinc-900')}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setSelectedUiType('gui')}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider border-l ${selectedUiType === 'gui' ? (theme === 'coldest' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/40 text-blue-400') : (theme === 'coldest' ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/10')}`}
                >
                  GUI
                </button>
                <button 
                  onClick={() => setSelectedUiType('slider')}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider border-l ${selectedUiType === 'slider' ? (theme === 'coldest' ? 'bg-slate-200' : 'bg-white/20') : (theme === 'coldest' ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/10')}`}
                >
                  Slider
                </button>
              </div>
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto min-h-[400px] border rounded-xl rounded-b-xl overflow-hidden ${theme === 'coldest' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900'}`}>
            {filteredPlugins.map(plugin => (
              <button
                key={plugin.name}
                onClick={() => setSelectedPlugin(plugin)}
                className={`w-full text-left px-4 py-3 border-b last:border-b-0 transition-colors flex flex-col gap-1 ${
                  theme === 'coldest' ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'
                } ${selectedPlugin?.name === plugin.name ? (theme === 'coldest' ? '!bg-blue-50 !border-blue-100' : '!bg-blue-900/20 !border-blue-900/30') : ''}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="font-bold text-sm truncate">{plugin.shortName}</div>
                  <div className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest ${getUiType(plugin) === 'gui' ? (theme === 'coldest' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/40 text-blue-400') : (theme === 'coldest' ? 'bg-slate-200 text-slate-500' : 'bg-white/10 text-white/40')}`}>
                    {getUiType(plugin)}
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs opacity-60">
                  <span className="truncate">{plugin.category}</span>
                  <span>{plugin.sliders.length} sliders</span>
                </div>
              </button>
            ))}
            {filteredPlugins.length === 0 && (
              <div className="p-8 text-center opacity-50 text-sm">No plugins found logging that query.</div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-2/3">
          {selectedPlugin ? (
            <div className={`h-full flex flex-col gap-6 rounded-2xl border p-6 ${theme === 'coldest' ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/10'}`}>
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className={`inline-block px-2.5 py-1 mb-3 rounded-full text-xs font-bold uppercase tracking-wider ${theme === 'coldest' ? 'bg-blue-100 text-blue-700' : 'bg-blue-950 text-blue-400'}`}>{selectedPlugin.category}</div>
                  <h2 className="text-2xl font-black">{selectedPlugin.name}</h2>
                  <p className="text-sm opacity-60 mt-1">{selectedPlugin.shortName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className={`p-4 rounded-xl flex flex-col gap-2 ${theme === 'coldest' ? 'bg-slate-50' : 'bg-black/20'}`}>
                    <div className="text-xs font-bold uppercase opacity-50 flex items-center gap-1.5"><Info size={14}/> Description</div>
                    <div className="text-sm leading-relaxed">{selectedPlugin.description}</div>
                 </div>
                 <div className={`p-4 rounded-xl flex flex-col gap-2 ${theme === 'coldest' ? 'bg-slate-50' : 'bg-black/20'}`}>
                    <div className="text-xs font-bold uppercase opacity-50 flex items-center gap-1.5"><Zap size={14}/> Pro Tips</div>
                    <div className="text-sm leading-relaxed">{selectedPlugin.proTips || 'None available.'}</div>
                 </div>
              </div>

              {selectedPlugin.volumeStagingWarning && (
                <div className={`p-4 rounded-xl flex flex-col gap-2 ${theme === 'coldest' ? 'bg-red-50 border border-red-200 text-slate-800' : 'bg-red-950/20 border border-red-900/30 text-red-200'}`}>
                  <div className="text-xs font-bold uppercase flex items-center gap-1.5 text-red-500">⚠ Gain Staging</div>
                  <div className="text-sm leading-relaxed font-semibold">{selectedPlugin.volumeStagingWarning}</div>
                </div>
              )}

              <div className="flex flex-col gap-4 mt-2">
                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 border-b pb-2">
                  <Sliders size={16} className="opacity-50" />
                  Sliders Configuration
                </h3>
                
                {selectedPlugin.sliders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className={`border-b ${theme === 'coldest' ? 'border-slate-200' : 'border-white/10'}`}>
                          <th className="pb-2 font-bold opacity-50">Idx</th>
                          <th className="pb-2 font-bold opacity-50">Name</th>
                          <th className="pb-2 font-bold opacity-50">Min</th>
                          <th className="pb-2 font-bold opacity-50">Max</th>
                          <th className="pb-2 font-bold opacity-50">Default</th>
                          <th className="pb-2 font-bold opacity-50">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPlugin.sliders.map(s => (
                          <tr key={s.index} className={`border-b last:border-0 ${theme === 'coldest' ? 'border-slate-100' : 'border-white/5'}`}>
                            <td className="py-2.5 font-mono text-xs opacity-50">{s.index}</td>
                            <td className="py-2.5 font-medium">{s.name}</td>
                            <td className="py-2.5">{s.min}</td>
                            <td className="py-2.5">{s.max}</td>
                            <td className="py-2.5">{s.defaultVal}</td>
                            <td className="py-2.5 opacity-50">{s.unit || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm opacity-50 italic">No sliders documented for this plugin.</div>
                )}
              </div>

            </div>
          ) : (
            <div className={`h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-dashed ${theme === 'coldest' ? 'border-slate-300' : 'border-white/20'}`}>
               <Layers size={48} className="opacity-10 mb-4" />
               <p className="opacity-50 text-sm font-medium">Select a plugin from the list to view its configuration.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
