import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Layers, Sliders, Info, Zap, Filter, Copy, Check, Music, User, HelpCircle, Activity } from 'lucide-react';
import { JSFX_AUTOMATION_CHAINS, AutomationChain } from '../data/jsfxAutomationChains';

export const JSFXAutomationChains = ({ onBack, theme }: { onBack: () => void; theme: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState<AutomationChain | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { value: 'All', label: 'All Categories' },
    { value: 'beats', label: 'Beats & Instrumentals' },
    { value: 'lead_vocal', label: 'Main / Lead Vocals' },
    { value: 'backing_vocal', label: 'Backing Vocals & Harmonies' },
    { value: 'ad_lib', label: 'Ad-Libs & SFX' }
  ];

  const filteredChains = useMemo(() => {
    return JSFX_AUTOMATION_CHAINS.filter(chain => {
      const matchesSearch = 
        chain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chain.producer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chain.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chain.plugins.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || chain.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (chain: AutomationChain) => {
    const textToCopy = `[JSFX Automation Chain] ${chain.name}\nProducer Style: ${chain.producer}\nRequired Plugins: ${chain.plugins.join(', ')}\n\nDescription & Routing:\n${chain.description}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(chain.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beats': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'lead_vocal': return 'bg-sky-500/10 text-sky-500 border border-sky-500/20';
      case 'backing_vocal': return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      case 'ad_lib': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'beats': return 'Beats & Instrumental';
      case 'lead_vocal': return 'Main / Lead Vocal';
      case 'backing_vocal': return 'Backing Vocal';
      case 'ad_lib': return 'Ad-Lib / Hype';
      default: return category;
    }
  };

  return (
    <div className={`min-h-[100dvh] w-full flex flex-col ${theme === 'coldest' ? 'bg-slate-50 text-slate-900' : 'bg-zinc-950 text-white'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 flex items-center gap-4 px-6 py-4 border-b backdrop-blur-md ${theme === 'coldest' ? 'bg-white/80 border-slate-200' : 'bg-black/40 border-white/10'}`}>
        <button
          onClick={onBack}
          className={`p-2 rounded-xl transition-colors ${theme === 'coldest' ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
            <Zap size={18} className="text-fuchsia-400" />
            JSFX Automation Chains <span className="opacity-50 font-medium">({filteredChains.length} / {JSFX_AUTOMATION_CHAINS.length})</span>
          </h1>
          <p className="text-[10px] opacity-60">Admin Only Portal • Curated Legendary DAWS and Automation Moves</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex-1 p-6 flex flex-col md:flex-row gap-6">
        {/* Left Side: Filter and List */}
        <div className="w-full md:w-5/12 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme === 'coldest' ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search chains, producers, plugins..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-opacity-20 ${
                  theme === 'coldest' 
                    ? 'bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500' 
                    : 'bg-zinc-900 border-white/10 focus:border-blue-400 focus:ring-blue-400'
                }`}
              />
            </div>

            {/* Category selection chips */}
            <div className="flex flex-wrap gap-1.5 py-1">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-fuchsia-500 text-white shadow-md'
                      : theme === 'coldest'
                      ? 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                      : 'bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Chains */}
          <div className={`flex-1 overflow-y-auto max-h-[60vh] md:max-h-[70vh] rounded-2xl border ${
            theme === 'coldest' ? 'bg-white border-slate-200' : 'bg-zinc-900/40 border-white/5'
          }`}>
            {filteredChains.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                <Music size={32} className="mb-2" />
                <p className="text-sm">No automation chains found.</p>
              </div>
            ) : (
              <div className="divide-y divide-solid divide-white/5">
                {filteredChains.map(chain => (
                  <button
                    key={chain.id}
                    onClick={() => setSelectedChain(chain)}
                    className={`w-full text-left p-4 transition-colors flex flex-col gap-2 ${
                      selectedChain?.id === chain.id
                        ? theme === 'coldest'
                          ? 'bg-blue-50'
                          : 'bg-fuchsia-500/10 border-l-4 border-fuchsia-500'
                        : theme === 'coldest'
                        ? 'hover:bg-slate-50'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm tracking-wide">{chain.name}</h3>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 ${getCategoryColor(chain.category)}`}>
                        {getCategoryLabel(chain.category)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs opacity-60">
                      <User size={12} />
                      <span>{chain.producer}</span>
                    </div>
                    <p className="text-xs opacity-85 line-clamp-2 mt-1">{chain.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {chain.plugins.map((plugin, i) => (
                        <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          theme === 'coldest' ? 'bg-slate-100 text-slate-700' : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {plugin}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chain Details / Readme */}
        <div className="flex-1 w-full md:w-7/12">
          {selectedChain ? (
            <div className={`p-6 rounded-3xl border flex flex-col gap-6 h-full ${
              theme === 'coldest' ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-900/20 border-white/5'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wider inline-block mb-2 ${getCategoryColor(selectedChain.category)}`}>
                    {getCategoryLabel(selectedChain.category)}
                  </span>
                  <h2 className="text-xl font-black uppercase tracking-wider">{selectedChain.name}</h2>
                  <div className="flex items-center gap-1.5 text-sm opacity-60 mt-1">
                    <User size={14} className="text-fuchsia-400" />
                    <span className="font-medium">Producer Style: <strong className="opacity-100">{selectedChain.producer}</strong></span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(selectedChain)}
                    className={`p-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold ${
                      copiedId === selectedChain.id
                        ? 'bg-emerald-500 text-white'
                        : theme === 'coldest'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  >
                    {copiedId === selectedChain.id ? <Check size={14} /> : <Copy size={14} />}
                    {copiedId === selectedChain.id ? 'Copied!' : 'Copy Chain Info'}
                  </button>
                </div>
              </div>

              <div className={`h-px w-full ${theme === 'coldest' ? 'bg-slate-100' : 'bg-white/5'}`} />

              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-fuchsia-400 mb-2 flex items-center gap-1.5">
                    <Info size={14} />
                    Processing & Routing Mechanics
                  </h4>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                    theme === 'coldest' ? 'bg-slate-50 border-slate-100' : 'bg-zinc-950/40 border-white/5'
                  }`}>
                    {selectedChain.description}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-fuchsia-400 mb-2 flex items-center gap-1.5">
                    <Sliders size={14} />
                    Target JSFX Plug-ins Required
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChain.plugins.map((plugin, i) => (
                      <div key={i} className={`px-3 py-2 rounded-xl text-xs font-mono border flex items-center gap-1.5 ${
                        theme === 'coldest'
                          ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
                          : 'bg-zinc-900 border-white/10 text-white'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                        {plugin}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl text-xs border border-dashed leading-normal flex gap-3 ${
                  theme === 'coldest' ? 'bg-blue-50/50 border-blue-200 text-blue-800' : 'bg-fuchsia-500/5 border-fuchsia-500/20 text-fuchsia-200/80'
                }`}>
                  <Activity size={16} className="shrink-0 mt-0.5 text-fuchsia-400" />
                  <div>
                    <strong className="block uppercase tracking-wide mb-0.5">Daw Automation Instructions</strong>
                    Instantiate the required plugins sequentially on your track or group bus. When creating your dynamic transition throws or special sections, draw an envelope on the specified wet mix, bypassed state, threshold, or pitch parameters. Trigger changes exactly on the syllables, measures, or section boundaries mentioned.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`h-full flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-dashed border-white/10 opacity-65 min-h-[400px]`}>
              <Sliders size={48} className="mb-4 text-fuchsia-400/40 animate-pulse" />
              <h3 className="text-base font-black uppercase tracking-widest mb-1">Select an Automation Chain</h3>
              <p className="text-xs max-w-sm">Choose any legendary producer moves from the explorer list on the left to view deep routing, settings, and automation parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
