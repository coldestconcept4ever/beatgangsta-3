import React, { useState, useMemo } from 'react';
import { ArrowLeft, Database, Search } from 'lucide-react';
import { XPAND_CATEGORIES, DEFAULT_OWNED_XPAND_PRESETS, XpandPreset } from '../data/xpandPresets';

export const XpandDatabaseViewer = ({ onBack, theme }: { onBack: () => void, theme: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPresets = useMemo(() => {
    return DEFAULT_OWNED_XPAND_PRESETS.filter(preset => {
      const matchesSearch = preset.preset_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            preset.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className={`min-h-screen w-full p-4 md:p-8 ${theme === 'coldest' ? 'bg-slate-50 text-slate-900' : theme === 'chef-mode' ? 'bg-[#1a1a1a] text-[#e0e0e0]' : 'bg-black text-white'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6 h-[calc(100vh-4rem)]">
        
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
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
                Xpand!2 Database
              </h1>
              <p className="text-sm opacity-60">Complete reference of Xpand!2 presets</p>
            </div>
          </div>
        </div>

        {/* Filters and List */}
        <div className="flex flex-col gap-6 flex-1 min-h-0">
          
          <div className={`p-4 rounded-2xl flex flex-col md:flex-row gap-4 shrink-0 ${theme === 'coldest' ? 'bg-white border border-slate-200' : 'bg-zinc-900 border border-white/10'}`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search presets..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-colors ${
                  theme === 'coldest' 
                    ? 'bg-slate-100 focus:bg-slate-200' 
                    : 'bg-black/50 focus:bg-black'
                }`}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 md:w-48">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg text-sm outline-none appearance-none cursor-pointer ${
                    theme === 'coldest' 
                      ? 'bg-slate-100 focus:bg-slate-200' 
                      : 'bg-black/50 focus:bg-black'
                  }`}
                >
                  <option value="all">All Categories</option>
                  {XPAND_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto min-h-[400px] border rounded-xl overflow-hidden ${theme === 'coldest' ? 'border-slate-200 bg-white' : 'border-white/10 bg-zinc-900'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredPresets.map(preset => (
                <div
                  key={`${preset.category}-${preset.preset_name}`}
                  className={`p-4 border rounded-xl flex flex-col gap-2 ${
                    theme === 'coldest' ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-bold text-sm truncate">{preset.preset_name}</div>
                  </div>
                  <div className="flex justify-between items-center text-xs opacity-60">
                    <span className="truncate">{preset.category}</span>
                  </div>
                </div>
              ))}
              {filteredPresets.length === 0 && (
                <div className="col-span-full p-8 text-center opacity-50 text-sm">No presets found matching that query.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
