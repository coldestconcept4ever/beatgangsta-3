import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Database, Sliders, Info, Cpu, CheckCircle, HelpCircle, Flame, Sparkles, RotateCcw, Copy, Check, Volume2 } from 'lucide-react';
import { UAD_DATABASE, UADPluginProfile, UADParameter } from '../data/uadDatabase';
import { UAD_PRESETS, UADPreset } from '../data/uadPresets';

const PRESET_MAPPING: Record<string, string> = {
  "uad marshall plexi classic amplifier": "uad marshall plexi classic",
  "uad empirical labs el8 distressor compressor": "uad empirical labs distressor",
  "uad ts overdrive": "uad ts808 tube screamer",
  "uad studio d chorus": "uad roland dimension d",
  "uad brigade chorus": "uad roland ce-1",
  "uad ams rmx16 expanded digital reverb": "uad ams rmx16 digital reverb",
  "uad ua 610-b tube preamp and eq": "uad ua 610 tube preamp and eq collection",
  "uad fairchild tube limiter collection": "uad fairchild 670",
  "uad pultec passive eq collection": "uad pultec eqp-1a",
  "uad ocean way studios room modeler": "uad ocean way studios legacy",
  "uad ua 1176 limiter collection": "uad 1176ln rev e",
  "uad mxr flanger-doubler": "uad mxr flanger doubler",
  "uad bx_digital v2 eq": "uad brainworx bx_digital v2",
  "uad moog multimode legacy filter": "uad moog multimode filter",
  "uad ua 1176ln legacy limiter": "uad 1176ln rev e",
  "uad ua 1176se legacy limiter": "uad 1176se rev g",
  "uad pultec-pro legacy eq": "uad pultec eqp-1a",
  "uad realverb-pro room modeler": "uad realverb pro"
};

const cleanPresetName = (s: string) => s.toLowerCase()
  .replace(/^(uad|ux|bx_)\s*/ig, "")
  .replace(/\s*(collection|compressor|limiter|equalizer|eq|amplifier|preamp|reverb|delay|tape|recorder|channel\s*strip|ds|v2|v3|effects)\s*$/ig, "")
  .trim();

export const getPluginPresets = (pluginName: string): UADPreset[] | undefined => {
  const lowerName = pluginName.toLowerCase().trim();
  
  if (PRESET_MAPPING[lowerName]) {
    return UAD_PRESETS[PRESET_MAPPING[lowerName]];
  }
  
  if (UAD_PRESETS[lowerName]) {
    return UAD_PRESETS[lowerName];
  }
  
  const dbClean = cleanPresetName(lowerName);
  const matchKey = Object.keys(UAD_PRESETS).find(k => {
    const pClean = cleanPresetName(k);
    return pClean === dbClean || dbClean.includes(pClean) || pClean.includes(dbClean);
  });
  
  if (matchKey) {
    return UAD_PRESETS[matchKey];
  }
  
  return undefined;
};

export const UadDatabaseViewer = ({ onBack, theme }: { onBack: () => void; theme: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlugin, setSelectedPlugin] = useState<UADPluginProfile | null>(UAD_DATABASE[0] || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [paramValues, setParamValues] = useState<Record<string, number>>({});
  const [copiedParam, setCopiedParam] = useState<string | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [showOClockMode, setShowOClockMode] = useState(true);

  // Helper to map default parameter string value to a 0-127 MIDI value
  const getInitialMidiValue = (param: UADParameter): number => {
    if (param.options && param.options.length > 0) {
      const idx = param.options.indexOf(param.defaultVal);
      if (idx !== -1) {
        const N = param.options.length;
        if (N === 1) return 127;
        return Math.round((idx / (N - 1)) * 127);
      }
    }
    
    // Try parsing number from defaultVal
    const numMatch = param.defaultVal.match(/[-+]?[0-9]*\.?[0-9]+/);
    if (numMatch) {
      const val = parseFloat(numMatch[0]);
      const rangeNums = param.range.match(/[-+]?[0-9]*\.?[0-9]+/g);
      if (rangeNums && rangeNums.length >= 2) {
        const min = parseFloat(rangeNums[0]);
        const max = parseFloat(rangeNums[rangeNums.length - 1]);
        if (max > min) {
          const clamped = Math.max(min, Math.min(max, val));
          const fraction = (clamped - min) / (max - min);
          return Math.round(fraction * 127);
        }
      }
    }
    return 64; // Default center
  };

  // Helper to turn MIDI number into elegant o'clock representation
  const getOClockPosition = (midiVal: number): string => {
    const totalHours = (midiVal / 127) * 10;
    const rawHour = 7 + totalHours;
    
    let hours = Math.floor(rawHour);
    let minutes = Math.round((rawHour - hours) * 60);
    
    // Round minutes to nearest 5 for natural hardware click feel
    minutes = Math.round(minutes / 5) * 5;
    if (minutes === 60) {
      minutes = 0;
      hours += 1;
    }
    
    let displayHour = hours;
    if (displayHour > 12) {
      displayHour -= 12;
    }
    if (displayHour === 0) {
      displayHour = 12;
    }
    
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${displayHour}:${formattedMinutes} o'clock`;
  };

  // Helper to translate MIDI 0-127 to approximate hardware display value
  const getPhysicalValue = (param: UADParameter, midiVal: number): string => {
    if (param.options && param.options.length > 0) {
      const N = param.options.length;
      const idx = Math.min(N - 1, Math.floor((midiVal / 127) * N));
      return param.options[idx];
    }
    
    const rangeNums = param.range.match(/[-+]?[0-9]*\.?[0-9]+/g);
    if (rangeNums && rangeNums.length >= 2) {
      const min = parseFloat(rangeNums[0]);
      const max = parseFloat(rangeNums[rangeNums.length - 1]);
      const fraction = midiVal / 127;
      const rawVal = min + fraction * (max - min);
      
      const hasDecimals = param.range.includes('.') || Math.abs(max - min) < 20;
      const valFormatted = hasDecimals ? rawVal.toFixed(1) : Math.round(rawVal).toString();
      
      const suffixMatch = param.range.match(/[a-zA-Z%-]+/);
      const unit = suffixMatch ? ` ${suffixMatch[0]}` : '';
      
      return `${valFormatted}${unit}`;
    }
    
    return `${Math.round((midiVal / 127) * 100)}%`;
  };

  // Populate dynamic parameter values whenever selected plugin changes
  useEffect(() => {
    if (selectedPlugin) {
      const initial: Record<string, number> = {};
      selectedPlugin.parameters.forEach(param => {
        initial[param.name] = getInitialMidiValue(param);
      });
      setParamValues(initial);
    }
  }, [selectedPlugin]);

  const categories = useMemo(() => {
    const cats = new Set(UAD_DATABASE.map(p => p.category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  const filteredPlugins = useMemo(() => {
    return UAD_DATABASE.filter(plugin => {
      const matchesSearch = 
        plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.hardwareModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || plugin.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const presets = useMemo(() => {
    if (!selectedPlugin) return undefined;
    return getPluginPresets(selectedPlugin.name);
  }, [selectedPlugin]);

  // Keep selected plugin valid if query filters it out
  React.useEffect(() => {
    if (selectedPlugin && !filteredPlugins.includes(selectedPlugin)) {
      setSelectedPlugin(filteredPlugins[0] || null);
    } else if (!selectedPlugin && filteredPlugins.length > 0) {
      setSelectedPlugin(filteredPlugins[0]);
    }
  }, [filteredPlugins, selectedPlugin]);

  const isColdest = theme === 'coldest';

  return (
    <div className={`min-h-[100dvh] w-full flex flex-col ${isColdest ? 'bg-slate-50 text-slate-900' : 'bg-zinc-950 text-white'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 flex items-center gap-4 px-6 py-4 border-b backdrop-blur-md ${isColdest ? 'bg-white/80 border-slate-200' : 'bg-black/40 border-white/10'}`}>
        <button
          onClick={onBack}
          className={`p-2 rounded-xl transition-colors ${isColdest ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-zinc-400'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-sm sm:text-lg font-black uppercase tracking-widest flex items-center gap-2">
            <Database size={18} className="text-amber-500 animate-pulse" />
            UAD Precision Hardware DB 
            <span className="text-xs font-normal opacity-50 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {filteredPlugins.length} Certified
            </span>
          </h1>
          <p className="text-[10px] sm:text-xs opacity-50 mt-0.5 font-medium">Ground-Truth UAD/UADx Technical Manual & AI Training Corpus</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex-1 p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Sidebar with lists & search */}
        <div className="w-full lg:w-5/12 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isColdest ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search UAD hardware or controls..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-opacity-20 ${
                  isColdest 
                    ? 'bg-white border-slate-200 focus:border-amber-500 focus:ring-amber-500' 
                    : 'bg-zinc-900 border-white/10 focus:border-amber-500 focus:ring-amber-500'
                }`}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-1.5 py-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
                    selectedCategory === cat
                      ? 'bg-amber-500 border-amber-500 text-black'
                      : isColdest
                        ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                        : 'bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Plugin list cards */}
          <div className={`flex-1 overflow-y-auto max-h-[500px] lg:max-h-[calc(100vh-280px)] rounded-2xl border flex flex-col divide-y ${
            isColdest ? 'bg-white border-slate-200 divide-slate-100' : 'bg-zinc-900/50 border-white/10 divide-white/5'
          }`}>
            {filteredPlugins.length === 0 ? (
              <div className="p-8 text-center opacity-50 flex flex-col items-center justify-center gap-2">
                <HelpCircle size={32} />
                <span className="text-sm font-semibold">No UAD models match your filters</span>
              </div>
            ) : (
              filteredPlugins.map(plugin => {
                const isSelected = selectedPlugin?.name === plugin.name;
                return (
                  <button
                    key={plugin.name}
                    onClick={() => setSelectedPlugin(plugin)}
                    className={`w-full p-4 text-left transition-all flex flex-col gap-1.5 group relative ${
                      isSelected 
                        ? isColdest 
                          ? 'bg-amber-500/5 text-slate-900 border-l-4 border-amber-500' 
                          : 'bg-amber-500/5 text-white border-l-4 border-amber-500'
                        : isColdest
                          ? 'hover:bg-slate-50 text-slate-700'
                          : 'hover:bg-white/5 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold tracking-widest uppercase opacity-40">{plugin.category}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isColdest ? 'bg-slate-100 text-slate-600' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {plugin.parameters.length} controls
                        </span>
                        {plugin.authorizationStatus && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                            plugin.authorizationStatus === "Authorized for all devices"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : plugin.authorizationStatus === "Demo expired"
                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              plugin.authorizationStatus === "Authorized for all devices"
                                ? "bg-emerald-500"
                                : plugin.authorizationStatus === "Demo expired"
                                  ? "bg-rose-500"
                                  : "bg-amber-500"
                            }`} />
                            {plugin.authorizationStatus === "Authorized for all devices"
                              ? "Authorized"
                              : plugin.authorizationStatus === "Demo expired"
                                ? "Expired"
                                : "Demo"}
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-black text-sm uppercase tracking-wide group-hover:text-amber-500 transition-colors">
                      {plugin.displayName}
                    </h3>
                    <p className="text-xs opacity-60 line-clamp-1 italic">{plugin.hardwareModel}</p>
                    <p className="text-xs opacity-75 line-clamp-2 mt-1">{plugin.description}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ground-truth parameters & pro-tips details */}
        <div className="flex-1 flex flex-col gap-6">
          {selectedPlugin ? (
            <div className={`p-6 rounded-3xl border flex flex-col gap-6 flex-1 h-full overflow-y-auto ${
              isColdest ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/10'
            }`}>
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b pb-5 border-dashed border-current/10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-amber-500 text-black">
                      {selectedPlugin.category}
                    </span>
                    <span className="text-xs font-mono opacity-50 flex items-center gap-1">
                      <Cpu size={12} /> {selectedPlugin.hardwareModel}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">{selectedPlugin.displayName}</h2>
                    {selectedPlugin.authorizationStatus && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                        selectedPlugin.authorizationStatus === "Authorized for all devices"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25"
                          : selectedPlugin.authorizationStatus === "Demo expired"
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/25"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/25"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          selectedPlugin.authorizationStatus === "Authorized for all devices"
                            ? "bg-emerald-500 animate-pulse"
                            : selectedPlugin.authorizationStatus === "Demo expired"
                              ? "bg-rose-500"
                              : "bg-amber-500"
                        }`} />
                        {selectedPlugin.authorizationStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-sm opacity-80 mt-1.5 max-w-2xl leading-relaxed">{selectedPlugin.description}</p>
                </div>
                
                {/* Certification stamp */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 self-start">
                  <CheckCircle size={16} />
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-wider">AI Guardrails Active</div>
                    <div className="text-[9px] opacity-75 leading-none">100% Parameter Bound Certified</div>
                  </div>
                </div>
              </div>

              {/* Pro Tips Section */}
              <div className={`p-4 rounded-2xl border ${
                isColdest ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-500/5 border-amber-500/10'
              }`}>
                <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-1.5 mb-2.5">
                  <Flame size={14} /> Professional Application Rules & Guides
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {selectedPlugin.proTips.map((tip, idx) => (
                    <li key={idx} className="text-xs opacity-90 pl-3 border-l-2 border-amber-500/50 leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preset Quick-Selector Panel */}
              {presets && (
                <div className={`p-4 rounded-2xl border ${
                  isColdest ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950/40 border-white/5'
                }`}>
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-1.5 mb-3">
                    <Sparkles size={14} className="animate-spin-slow" /> Iconic Hardware Preset Selector
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {presets.map((preset, idx) => {
                      // Check if current settings match the preset roughly
                      const isMatching = Object.entries(preset.settings).every(
                        ([name, val]) => Math.abs((paramValues[name] ?? -999) - val) < 5
                      );

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setParamValues(prev => ({
                              ...prev,
                              ...preset.settings
                            }));
                          }}
                          className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                            isMatching
                              ? 'border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20'
                              : isColdest
                                ? 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                                : 'bg-zinc-900 border-white/5 hover:border-white/15 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-black uppercase tracking-wide truncate pr-4">{preset.name}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isMatching ? 'bg-amber-500/20 text-amber-500' : 'opacity-40 bg-current/10 text-current'
                            }`}>
                              {isMatching ? 'ACTIVE' : 'PRESET'}
                            </span>
                          </div>
                          <p className="text-[11px] opacity-70 line-clamp-2 leading-relaxed">{preset.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Exact Parameters Bound List */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed border-current/10 pb-3">
                  <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 opacity-70">
                    <Sliders size={14} /> Interactive MIDI & O'clock Controller Mapping ({selectedPlugin.parameters.length})
                  </h4>
                  
                  <div className="flex items-center gap-2">
                    {/* Copy Full Config */}
                    <button
                      onClick={() => {
                        const configStr = JSON.stringify(
                          {
                            plugin: selectedPlugin.displayName,
                            hardwareModel: selectedPlugin.hardwareModel,
                            parameters: Object.entries(paramValues).map(([name, midiVal]) => {
                              const p = selectedPlugin.parameters.find(x => x.name === name);
                              return {
                                name,
                                midiValue: midiVal,
                                oClock: getOClockPosition(midiVal),
                                physicalValue: p ? getPhysicalValue(p, midiVal) : 'N/A'
                              };
                            })
                          },
                          null,
                          2
                        );
                        navigator.clipboard.writeText(configStr);
                        setCopiedConfig(true);
                        setTimeout(() => setCopiedConfig(false), 2000);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                        copiedConfig
                          ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-500'
                          : isColdest
                            ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            : 'bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {copiedConfig ? (
                        <>
                          <Check size={12} /> Config Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy MIDI Config JSON
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {selectedPlugin.parameters.map((param, idx) => {
                    const midiVal = paramValues[param.name] ?? getInitialMidiValue(param);
                    const oClock = getOClockPosition(midiVal);
                    const physicalVal = getPhysicalValue(param, midiVal);
                    const angle = -135 + (midiVal / 127) * 270;

                    return (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-4 items-center sm:items-start group transition-all duration-300 relative ${
                          isColdest 
                            ? 'bg-slate-50 border-slate-200/80 hover:border-amber-500/30 hover:shadow-sm' 
                            : 'bg-zinc-950 border-white/5 hover:border-amber-500/30 hover:bg-zinc-950/80'
                        }`}
                      >
                        {/* Rotary Dial Left side column */}
                        <div className="flex flex-col items-center justify-center gap-2 shrink-0 pt-1">
                          <div className="relative group/knob select-none">
                            {/* Knob Outer Bezel / Backplate */}
                            <div 
                              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center relative shadow-lg cursor-ns-resize transition-all duration-150 ${
                                isColdest 
                                  ? 'bg-slate-100 border-slate-300 hover:border-amber-500 hover:bg-slate-50' 
                                  : 'bg-zinc-900 border-white/10 hover:border-amber-500 hover:bg-zinc-800'
                              }`}
                              style={{ transform: `rotate(${angle}deg)` }}
                              onWheel={(e) => {
                                e.preventDefault();
                                const delta = e.deltaY < 0 ? 4 : -4;
                                const newVal = Math.max(0, Math.min(127, midiVal + delta));
                                setParamValues(prev => ({ ...prev, [param.name]: newVal }));
                              }}
                            >
                              {/* Classic Pointer Line */}
                              <div className="w-1.5 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full absolute top-1 shadow-sm" />
                              {/* Metal Center Cap */}
                              <div className={`w-7 h-7 rounded-full border shadow-inner flex items-center justify-center ${
                                isColdest ? 'bg-white border-slate-200' : 'bg-black border-white/10'
                              }`}>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                              </div>
                            </div>
                            
                            {/* Subtle scroll wheel indicator tooltip on hover */}
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] font-mono font-bold uppercase py-0.5 px-1.5 rounded opacity-0 group-hover/knob:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                              Scroll to Turn
                            </div>
                          </div>

                          {/* O'Clock position readout */}
                          <span className="text-[11px] font-mono font-bold text-amber-500 text-center tracking-tight bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                            {oClock}
                          </span>
                        </div>

                        {/* Interactive sliders & value info (Right side column) */}
                        <div className="flex-1 flex flex-col gap-2 w-full">
                          <div className="flex items-start justify-between gap-2 border-b border-current/5 pb-1.5">
                            <div className="text-left">
                              <span className="text-xs font-black uppercase tracking-wide group-hover:text-amber-500 transition-colors block">
                                {param.name}
                              </span>
                              <span className="text-[10px] opacity-50 block leading-none mt-0.5">
                                {param.description}
                              </span>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              {/* Reset */}
                              <button
                                onClick={() => {
                                  const defVal = getInitialMidiValue(param);
                                  setParamValues(prev => ({ ...prev, [param.name]: defVal }));
                                }}
                                title="Reset to default"
                                className={`p-1 rounded-md transition-colors ${
                                  isColdest ? 'hover:bg-slate-200 text-slate-400 hover:text-slate-600' : 'hover:bg-white/10 text-zinc-500 hover:text-white'
                                }`}
                              >
                                <RotateCcw size={11} />
                              </button>
                              
                              {/* Copy Individual Parameter Info */}
                              <button
                                onClick={() => {
                                  const text = `${param.name}: ${physicalVal} (${oClock}, MIDI: ${midiVal})`;
                                  navigator.clipboard.writeText(text);
                                  setCopiedParam(param.name);
                                  setTimeout(() => setCopiedParam(null), 1500);
                                }}
                                title="Copy dial value"
                                className={`p-1 rounded-md transition-colors ${
                                  isColdest ? 'hover:bg-slate-200 text-slate-400 hover:text-slate-600' : 'hover:bg-white/10 text-zinc-500 hover:text-white'
                                }`}
                              >
                                {copiedParam === param.name ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                              </button>
                            </div>
                          </div>

                          {/* Dynamic slider or discrete buttons selector */}
                          <div className="flex flex-col gap-2 mt-1">
                            {param.options && param.options.length > 0 ? (
                              /* Discrete Step Selector Group */
                              <div className="flex flex-wrap gap-1">
                                {param.options.map((opt, oIdx) => {
                                  const N = param.options!.length;
                                  const targetMidi = N === 1 ? 127 : Math.round((oIdx / (N - 1)) * 127);
                                  const isActive = Math.abs(midiVal - targetMidi) < Math.ceil(127 / N);
                                  
                                  return (
                                    <button
                                      key={oIdx}
                                      onClick={() => {
                                        setParamValues(prev => ({ ...prev, [param.name]: targetMidi }));
                                      }}
                                      className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all border ${
                                        isActive
                                          ? 'bg-amber-500 border-amber-500 text-black shadow-sm font-black'
                                          : isColdest
                                            ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                                            : 'bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              /* Continuous Range Slider */
                              <div className="flex items-center gap-3">
                                <input
                                  type="range"
                                  min="0"
                                  max="127"
                                  value={midiVal}
                                  onChange={(e) => {
                                    setParamValues(prev => ({ ...prev, [param.name]: parseInt(e.target.value) }));
                                  }}
                                  className="flex-1 h-1.5 rounded-full bg-current/10 accent-amber-500 cursor-pointer outline-none focus:outline-none"
                                />
                              </div>
                            )}

                            {/* Info Readouts (Physical and MIDI value) */}
                            <div className="flex justify-between items-center text-[10px] font-mono opacity-60 mt-1">
                              <div>
                                Hardware Value: <span className="font-bold text-amber-500">{physicalVal}</span>
                                <span className="opacity-50 ml-1">({param.range})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>MIDI: <span className="font-bold">{midiVal}</span></span>
                                <span>•</span>
                                <span>Default: <span className="opacity-75">{param.defaultVal}</span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center opacity-50 flex flex-col items-center justify-center gap-3 flex-1">
              <Info size={40} className="text-amber-500" />
              <span className="text-base font-semibold">Select a UAD model from the sidebar to view certified details</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
