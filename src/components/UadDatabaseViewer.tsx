import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Database, Sliders, Info, Cpu, CheckCircle, HelpCircle, Flame, Sparkles } from 'lucide-react';
import { UAD_DATABASE, UADPluginProfile, UADParameter } from '../data/uadDatabase';

export const UadDatabaseViewer = ({ onBack, theme }: { onBack: () => void; theme: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlugin, setSelectedPlugin] = useState<UADPluginProfile | null>(UAD_DATABASE[0] || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isColdest ? 'bg-slate-100 text-slate-600' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {plugin.parameters.length} controls
                      </span>
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
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">{selectedPlugin.displayName}</h2>
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

              {/* Exact Parameters Bound List */}
              <div className="flex-1 flex flex-col gap-3">
                <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                  <Sliders size={14} /> Exact Parameters & Ranges ({selectedPlugin.parameters.length})
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPlugin.parameters.map((param, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-xl border flex flex-col gap-1.5 group transition-colors ${
                        isColdest 
                          ? 'bg-slate-50 border-slate-200 hover:border-amber-500/30' 
                          : 'bg-zinc-950 border-white/5 hover:border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-black uppercase tracking-wide group-hover:text-amber-500 transition-colors">
                          {param.name}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          param.type === 'knob' ? 'bg-blue-500/10 text-blue-500' :
                          param.type === 'switch' ? 'bg-indigo-500/10 text-indigo-500' :
                          param.type === 'select' ? 'bg-purple-500/10 text-purple-500' : 'bg-zinc-500/10 text-zinc-500'
                        }`}>
                          {param.type || 'knob'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 my-1">
                        <div className="flex-1 h-1.5 rounded-full bg-current/10 relative overflow-hidden">
                          <div className="absolute top-0 bottom-0 left-0 w-3/5 bg-amber-500 rounded-full" />
                        </div>
                        <span className="text-xs font-mono font-bold opacity-80 whitespace-nowrap">
                          {param.range}
                        </span>
                      </div>

                      <div className="text-[11px] opacity-70 leading-relaxed mt-1">
                        {param.description}
                      </div>

                      <div className="text-[10px] font-mono opacity-50 mt-1">
                        Default: <span className="font-bold text-amber-500">{param.defaultVal}</span>
                      </div>
                    </div>
                  ))}
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
