import React, { useState } from 'react';
import { JSFXProfile } from '../data/jsfxResearch';
import { Star, Info, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface JSFXCardProps {
  id?: string;
  jsfx: JSFXProfile;
  isFavorite: boolean;
  onToggleFavorite: (jsfx: JSFXProfile) => void;
  theme?: string;
}

export const JSFXCard: React.FC<JSFXCardProps> = ({ id, jsfx, isFavorite, onToggleFavorite, theme = 'coldest' }) => {
  const { t } = useTranslation();
  const [showSliders, setShowSliders] = useState(false);

  const vendorName = jsfx.packRequired || "Cockos (Built-in)";

  return (
    <div 
      id={id} 
      className="relative backdrop-blur-3xl border rounded-[28px] p-5 pt-12 shadow-2xl hover:scale-[1.02] transition-all group flex flex-col h-full bg-white/10 border-white/20 text-current hover:bg-white/20"
    >
      {/* Star button */}
      <div className="absolute top-3 left-3 z-10">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(jsfx); }}
          className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-all ${isFavorite ? 'bg-yellow-400 text-yellow-950' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
          title={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
        >
          <motion.div
            initial={false}
            animate={{ scale: isFavorite ? [1, 1.5, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Star size={14} className={isFavorite ? "fill-current" : ""} />
          </motion.div>
        </motion.button>
      </div>

      {/* Package Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`text-[8px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${
          !jsfx.packRequired 
            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
        }`}>
          {!jsfx.packRequired ? 'BUILT-IN' : 'PACK'}
        </span>
      </div>

      {/* Category and Vendor */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 truncate max-w-[60%]" title={vendorName}>
          {vendorName}
        </span>
        <span className="text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {jsfx.category}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-black tracking-tight leading-tight mb-2 font-outfit text-current">
        {jsfx.shortName || jsfx.name.replace(/^JS:\s*/i, '')}
      </h3>

      {/* Description */}
      <p className="text-[11px] font-medium opacity-70 leading-relaxed mb-4 flex-grow">
        {jsfx.description}
      </p>

      {/* Accordions or detailed lists */}
      <div className="space-y-3 mb-4">
        {jsfx.howItWorks && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <h5 className="text-[9px] font-black uppercase tracking-wider mb-1 text-sky-400 flex items-center gap-1">
              <HelpCircle size={10} /> How It Works
            </h5>
            <p className="text-[10px] opacity-60 leading-relaxed font-medium">
              {jsfx.howItWorks}
            </p>
          </div>
        )}

        {jsfx.proTips && (
          <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <h5 className="text-[9px] font-black uppercase tracking-wider mb-1 text-emerald-400 flex items-center gap-1">
              <Zap size={10} /> Pro Tip
            </h5>
            <p className="text-[10px] opacity-70 leading-relaxed font-medium text-emerald-100/90">
              {jsfx.proTips}
            </p>
          </div>
        )}

        {jsfx.volumeStagingWarning && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
            <h5 className="text-[9px] font-black uppercase tracking-wider mb-1 text-red-400 flex items-center gap-1">
              ⚠ Gain Staging
            </h5>
            <p className="text-[10px] opacity-80 leading-relaxed font-semibold text-red-200">
              {jsfx.volumeStagingWarning}
            </p>
          </div>
        )}
      </div>

      {/* Sliders toggle */}
      {jsfx.sliders && jsfx.sliders.length > 0 && (
        <div className="mb-4">
          <button 
            onClick={() => setShowSliders(!showSliders)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest transition-all"
          >
            <span>Sliders / Parameters ({jsfx.sliders.length})</span>
            <span>{showSliders ? 'Hide' : 'Show'}</span>
          </button>
          {showSliders && (
            <div className="mt-2 p-3 rounded-2xl bg-black/40 border border-white/5 max-h-40 overflow-y-auto space-y-1.5 scrollbar-hide">
              {jsfx.sliders.map((slider) => (
                <div key={slider.index} className="flex justify-between items-start text-[9px] font-mono opacity-60 border-b border-white/5 pb-1">
                  <div className="max-w-[70%]">
                    <span className="text-sky-400 mr-1">S{slider.index}:</span>
                    <span className="font-bold">{slider.name}</span>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span>{slider.min} to {slider.max}</span>
                    {slider.unit && <span className="text-emerald-400 ml-0.5">{slider.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] opacity-40">
        <span>JSFX</span>
        <span>{jsfx.filename ? jsfx.filename : 'Default'}</span>
      </div>
    </div>
  );
};
