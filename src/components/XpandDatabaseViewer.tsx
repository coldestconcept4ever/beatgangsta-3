import React, { useState, useMemo } from 'react';
import { ArrowLeft, Database, Search, Info, Zap, Sliders, Layers, Upload, X, Check, Plus } from 'lucide-react';
import { XPAND_CATEGORIES, DEFAULT_OWNED_XPAND_PRESETS, XpandPreset } from '../data/xpandPresets';
import { XPAND_FX_DATABASE, XpandFX } from '../data/xpandFX';

export const XpandDatabaseViewer = ({ 
  onBack, 
  theme,
  xpandPresets = DEFAULT_OWNED_XPAND_PRESETS,
  setXpandPresets
}: { 
  onBack: () => void; 
  theme: string;
  xpandPresets?: XpandPreset[];
  setXpandPresets?: React.Dispatch<React.SetStateAction<XpandPreset[]>>;
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'fx'>('presets');
  
  // Presets State
  const [presetSearch, setPresetSearch] = useState('');
  const [selectedPresetCategory, setSelectedPresetCategory] = useState<string>('all');

  // Add Preset / Bulk Import States
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetCategory, setNewPresetCategory] = useState('000 Soft Pads');

  // FX State
  const [fxSearch, setFxSearch] = useState('');
  const [selectedFxCategory, setSelectedFxCategory] = useState<string>('all');
  const [selectedFx, setSelectedFx] = useState<XpandFX | null>(XPAND_FX_DATABASE[0] || null);

  // Filter Presets
  const filteredPresets = useMemo(() => {
    return xpandPresets.filter(preset => {
      const matchesSearch = preset.preset_name.toLowerCase().includes(presetSearch.toLowerCase()) || 
                            preset.category.toLowerCase().includes(presetSearch.toLowerCase());
      
      let matchesCategory = true;
      if (selectedPresetCategory === 'owned') {
        matchesCategory = !!preset.is_owned;
      } else if (selectedPresetCategory === 'unowned') {
        matchesCategory = !preset.is_owned;
      } else if (selectedPresetCategory !== 'all') {
        matchesCategory = preset.category === selectedPresetCategory;
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [xpandPresets, presetSearch, selectedPresetCategory]);

  // Filter FX
  const filteredFx = useMemo(() => {
    return XPAND_FX_DATABASE.filter(fx => {
      const matchesSearch = fx.name.toLowerCase().includes(fxSearch.toLowerCase()) || 
                            fx.description.toLowerCase().includes(fxSearch.toLowerCase());
      const matchesCategory = selectedFxCategory === 'all' || fx.category === selectedFxCategory;
      return matchesSearch && matchesCategory;
    });
  }, [fxSearch, selectedFxCategory]);

  return (
    <div className={`min-h-screen w-full p-4 md:p-8 ${theme === 'coldest' ? 'bg-slate-50 text-slate-900' : theme === 'chef-mode' ? 'bg-[#1a1a1a] text-[#e0e0e0]' : 'bg-black text-white'}`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-6 min-h-screen">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 border-b pb-4" style={{ borderColor: theme === 'coldest' ? '#e2e8f0' : 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className={`p-2 rounded-full transition-colors ${theme === 'coldest' ? 'hover:bg-slate-200' : 'hover:bg-white/10'}`}
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Database className={theme === 'coldest' ? 'text-blue-500' : 'text-blue-400'} size={24} />
                Xpand!2 Master Reference
              </h1>
              <p className="text-sm opacity-60">Complete inventory of presets and FX parameters</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl p-1 max-w-sm self-start md:self-auto" style={{ backgroundColor: theme === 'coldest' ? '#e2e8f0' : 'rgba(255,255,255,0.05)' }}>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'presets'
                  ? (theme === 'coldest' ? 'bg-white shadow text-slate-900' : 'bg-white/10 text-white')
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              Preset Inventory
            </button>
            <button
              onClick={() => setActiveTab('fx')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'fx'
                  ? (theme === 'coldest' ? 'bg-white shadow text-slate-900' : 'bg-white/10 text-white')
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              FX Database
            </button>
          </div>
        </div>

        {/* TAB 1: PRESETS INVENTORY */}
        {activeTab === 'presets' && (
          <div className="flex flex-col gap-6 flex-1">
            
            {/* Header and Controls */}
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${theme === 'coldest' ? 'bg-sky-500/5 border-sky-100' : 'bg-white/5 border-white/10'}`}>
              <div>
                <h3 className="text-md font-black uppercase tracking-widest flex items-center gap-2">
                  <Database className={`w-5 h-5 ${theme === 'coldest' ? 'text-sky-500' : 'text-blue-400'}`} /> Database Operations
                </h3>
                <p className="text-xs opacity-60 mt-1 max-w-2xl leading-relaxed">
                  Manage your active inventory of Xpand!2 presets. When recommending sounds using Xpand!2, BeatGangsta will ONLY select from presets marked as **owned** (Emerald/Green). Click any preset below to toggle ownership!
                </p>
              </div>
              {setXpandPresets && (
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => {
                      const filteredIds = filteredPresets.map(p => `${p.category}-${p.preset_name}`);
                      const anyUnowned = filteredPresets.some(p => !p.is_owned);
                      setXpandPresets(prev => prev.map(p => {
                        if (filteredIds.includes(`${p.category}-${p.preset_name}`)) {
                          return { ...p, is_owned: anyUnowned };
                        }
                        return p;
                      }));
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all hover:scale-105 active:scale-95 ${theme === 'coldest' ? 'bg-sky-50 border-sky-200 text-sky-800' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                  >
                    Toggle Page All
                  </button>
                  <button
                    onClick={() => setShowBulkImport(!showBulkImport)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${theme === 'coldest' ? 'bg-sky-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    <Upload size={14} /> Bulk Add / Paste
                  </button>
                </div>
              )}
            </div>

            {/* Bulk Import section */}
            {showBulkImport && setXpandPresets && (
              <div className={`p-6 rounded-2xl border ${theme === 'coldest' ? 'bg-sky-500/5 border-sky-100' : 'bg-white/5 border-white/10'} space-y-4`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Upload className={`w-4 h-4 ${theme === 'coldest' ? 'text-sky-500' : 'text-blue-400'}`} /> Bulk Add Presets
                  </h4>
                  <button onClick={() => setShowBulkImport(false)} className="opacity-50 hover:opacity-100">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-xs opacity-60 leading-relaxed">
                  Paste a list of preset names (one per line). They will be added to the selected category and marked as **owned**.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-70">Category</label>
                    <select
                      value={newPresetCategory}
                      onChange={(e) => setNewPresetCategory(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold outline-none border h-10 ${theme === 'coldest' ? 'bg-white border-slate-200 text-slate-800' : 'bg-zinc-850 border-white/10 text-white focus:border-blue-500'}`}
                    >
                      {XPAND_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-70">Preset Names (one per line)</label>
                    <textarea
                      value={bulkInputText}
                      onChange={(e) => setBulkInputText(e.target.value)}
                      placeholder="e.g.&#10;My Sweet Lead&#10;Dynamic Pad 4&#10;Heavy 808 Synth"
                      rows={5}
                      className={`w-full p-4 rounded-xl text-xs font-mono border focus:outline-none ${theme === 'coldest' ? 'bg-slate-50 border-slate-200 focus:border-sky-500 text-slate-850' : 'bg-black/40 border-white/10 focus:border-blue-500 text-white'}`}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      if (!bulkInputText.trim()) return;
                      const lines = bulkInputText.split('\n').map(l => l.trim()).filter(Boolean);
                      const newItems = lines.map(name => ({
                        category: newPresetCategory,
                        preset_name: name,
                        is_owned: true
                      }));
                      setXpandPresets(prev => {
                        const map = new Map(prev.map(p => [`${p.category}-${p.preset_name}`, p]));
                        newItems.forEach(item => {
                          map.set(`${item.category}-${item.preset_name}`, item);
                        });
                        return Array.from(map.values());
                      });
                      setBulkInputText('');
                      setShowBulkImport(false);
                    }}
                    className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest ${theme === 'coldest' ? 'bg-sky-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} transition-all hover:scale-105 active:scale-95`}
                  >
                    Add {bulkInputText.split('\n').map(l => l.trim()).filter(Boolean).length} Presets
                  </button>
                </div>
              </div>
            )}

            {/* Quick Add Form */}
            {setXpandPresets && (
              <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl border items-end ${theme === 'coldest' ? 'bg-sky-500/5 border-sky-100' : 'bg-white/5 border-white/10'}`}>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-70">Category</label>
                  <select
                    value={newPresetCategory}
                    onChange={(e) => setNewPresetCategory(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold outline-none border h-11 ${theme === 'coldest' ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/40 border-white/10 text-white'}`}
                  >
                    {XPAND_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-70">New Preset Name</label>
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="Preset name..."
                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold border focus:outline-none h-11 ${theme === 'coldest' ? 'bg-white border-slate-200 text-slate-800 focus:border-sky-500' : 'bg-black/40 border-white/10 text-white focus:border-blue-500'}`}
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newPresetName.trim()) return;
                    setXpandPresets(prev => {
                      const exists = prev.some(p => p.category === newPresetCategory && p.preset_name.toLowerCase() === newPresetName.trim().toLowerCase());
                      if (exists) return prev;
                      return [...prev, { category: newPresetCategory, preset_name: newPresetName.trim(), is_owned: true }];
                    });
                    setNewPresetName('');
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest ${theme === 'coldest' ? 'bg-sky-500 text-white' : 'bg-white text-black hover:bg-opacity-95'} transition-all hover:scale-105 active:scale-95 h-11`}
                >
                  + Add Preset
                </button>
              </div>
            )}

            {/* Filter and Search controls */}
            <div className={`p-4 rounded-2xl flex flex-col md:flex-row gap-4 shrink-0 ${theme === 'coldest' ? 'bg-white border border-slate-200' : 'bg-zinc-900 border border-white/10'}`}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} />
                <input 
                  type="text"
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  placeholder="Search presets..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-colors ${
                    theme === 'coldest' 
                      ? 'bg-slate-100 focus:bg-slate-200' 
                      : 'bg-black/50 focus:bg-black'
                  }`}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 md:w-64">
                  <select 
                    value={selectedPresetCategory}
                    onChange={(e) => setSelectedPresetCategory(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer ${
                      theme === 'coldest' 
                        ? 'bg-slate-100 focus:bg-slate-200 border border-slate-200' 
                        : 'bg-black/50 focus:bg-black border border-white/5'
                    }`}
                  >
                    <option value="all">All Categories</option>
                    <option value="owned">Show Owned Only</option>
                    <option value="unowned">Show Unowned Only</option>
                    {XPAND_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div className={`flex-1 overflow-y-auto border rounded-xl overflow-hidden ${theme === 'coldest' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredPresets.map(preset => {
                  const isOwned = preset.is_owned;
                  return (
                    <div
                      key={`${preset.category}-${preset.preset_name}`}
                      onClick={() => {
                        if (setXpandPresets) {
                          setXpandPresets(prev => prev.map(p => {
                            if (p.category === preset.category && p.preset_name === preset.preset_name) {
                              return { ...p, is_owned: !p.is_owned };
                            }
                            return p;
                          }));
                        }
                      }}
                      className={`p-4 border rounded-xl flex flex-col gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] ${
                        setXpandPresets ? 'cursor-pointer' : ''
                      } ${
                        isOwned 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                          : theme === 'coldest' ? 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-500' : 'border-white/5 bg-white/2 hover:bg-white/5 text-slate-400'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-bold text-sm truncate">{preset.preset_name}</div>
                        <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isOwned 
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-white/10 text-slate-400'
                        }`}>
                          {isOwned ? 'Owned' : 'Unowned'}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs opacity-60">
                        <span className="truncate">{preset.category}</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${isOwned ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'}`} />
                      </div>
                    </div>
                  );
                })}
                {filteredPresets.length === 0 && (
                  <div className="col-span-full p-8 text-center opacity-50 text-sm">No presets found matching that query.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FX DATABASE (BENTO LIST VIEW) */}
        {activeTab === 'fx' && (
          <div className="flex flex-col md:flex-row gap-6 items-stretch flex-1 min-h-0">
            {/* Sidebar with list */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <div className={`p-4 rounded-xl flex flex-col gap-3 border ${theme === 'coldest' ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/10'}`}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={14} />
                  <input 
                    type="text"
                    value={fxSearch}
                    onChange={(e) => setFxSearch(e.target.value)}
                    placeholder="Search FX units..."
                    className={`w-full pl-9 pr-4 py-2 rounded-lg text-xs outline-none transition-colors ${
                      theme === 'coldest' ? 'bg-slate-100 focus:bg-slate-200' : 'bg-black/50 focus:bg-black'
                    }`}
                  />
                </div>
                
                <div>
                  <select 
                    value={selectedFxCategory}
                    onChange={(e) => setSelectedFxCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs outline-none cursor-pointer ${
                      theme === 'coldest' ? 'bg-slate-100 border border-slate-200' : 'bg-black/50 border border-white/5'
                    }`}
                  >
                    <option value="all">All FX Categories</option>
                    <option value="Reverbs">Reverbs</option>
                    <option value="Delays">Delays</option>
                    <option value="Modulation">Modulation</option>
                    <option value="Other">Other (Detune / Pitch)</option>
                  </select>
                </div>
              </div>

              {/* FX Processor List */}
              <div className={`flex-1 overflow-y-auto max-h-[500px] md:max-h-[600px] border rounded-xl overflow-hidden ${theme === 'coldest' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900'}`}>
                {filteredFx.map(fx => (
                  <button
                    key={fx.name}
                    onClick={() => setSelectedFx(fx)}
                    className={`w-full text-left px-4 py-3 border-b last:border-b-0 transition-colors flex flex-col gap-1 ${
                      theme === 'coldest' ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'
                    } ${selectedFx?.name === fx.name ? (theme === 'coldest' ? '!bg-blue-50 !border-blue-100' : '!bg-blue-900/20 !border-blue-950') : ''}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-bold text-sm truncate capitalize">{fx.name}</div>
                      <div className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest ${
                        fx.category === 'Reverbs' ? 'bg-indigo-500/10 text-indigo-400' :
                        fx.category === 'Delays' ? 'bg-sky-500/10 text-sky-400' :
                        'bg-fuchsia-500/10 text-fuchsia-400'
                      }`}>
                        {fx.category}
                      </div>
                    </div>
                    <div className="text-xs opacity-60 truncate">
                      {fx.description}
                    </div>
                  </button>
                ))}
                {filteredFx.length === 0 && (
                  <div className="p-8 text-center opacity-50 text-sm">No FX processors found.</div>
                )}
              </div>
            </div>

            {/* Main Content Detail Area */}
            <div className="w-full md:w-2/3">
              {selectedFx ? (
                <div className={`h-full flex flex-col gap-6 rounded-2xl border p-6 ${theme === 'coldest' ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/10'}`}>
                  
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className={`inline-block px-2.5 py-1 mb-3 rounded-full text-xs font-bold uppercase tracking-wider ${
                        selectedFx.category === 'Reverbs' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400' :
                        selectedFx.category === 'Delays' ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400' :
                        'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-400'
                      }`}>
                        {selectedFx.category}
                      </div>
                      <h2 className="text-2xl font-black capitalize">{selectedFx.name}</h2>
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className={`p-4 rounded-xl flex flex-col gap-2 ${theme === 'coldest' ? 'bg-slate-50' : 'bg-black/20'}`}>
                        <div className="text-xs font-bold uppercase opacity-50 flex items-center gap-1.5">
                          <Info size={14}/> Algorithm Description
                        </div>
                        <div className="text-sm leading-relaxed">{selectedFx.description}</div>
                     </div>
                     {selectedFx.proTips && (
                       <div className={`p-4 rounded-xl flex flex-col gap-2 ${theme === 'coldest' ? 'bg-slate-50' : 'bg-black/20'}`}>
                          <div className="text-xs font-bold uppercase opacity-50 flex items-center gap-1.5">
                            <Zap size={14}/> Pro Mixing Advice
                          </div>
                          <div className="text-sm leading-relaxed">{selectedFx.proTips}</div>
                       </div>
                     )}
                  </div>

                  {/* Parameter Controls Table */}
                  <div className="flex flex-col gap-4 mt-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 border-b pb-2">
                      <Sliders size={16} className="opacity-50" />
                      Dynamic Parameter Configurations
                    </h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className={`border-b ${theme === 'coldest' ? 'border-slate-200' : 'border-white/10'}`}>
                            <th className="pb-2 font-bold opacity-50">Parameter / Knob</th>
                            <th className="pb-2 font-bold opacity-50">Control Description</th>
                            <th className="pb-2 font-bold opacity-50">Typical Range</th>
                            <th className="pb-2 font-bold opacity-50">Recommended Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedFx.parameters.map((p, idx) => (
                            <tr key={idx} className={`border-b last:border-0 ${theme === 'coldest' ? 'border-slate-100' : 'border-white/5'}`}>
                              <td className="py-3 font-semibold text-xs md:text-sm">{p.name}</td>
                              <td className="py-3 text-xs opacity-80 leading-relaxed max-w-xs">{p.description}</td>
                              <td className="py-3 font-mono text-xs opacity-70">{p.typicalRange}</td>
                              <td className="py-3 text-xs font-bold text-sky-500 dark:text-sky-400">{p.recommendedValue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              ) : (
                <div className={`h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-dashed ${theme === 'coldest' ? 'border-slate-300' : 'border-white/20'}`}>
                   <Layers size={48} className="opacity-10 mb-4" />
                   <p className="opacity-50 text-sm font-medium">Select an FX unit from the list to view its configuration.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
