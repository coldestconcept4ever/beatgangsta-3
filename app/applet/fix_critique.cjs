const fs = require('fs');

let code = fs.readFileSync('src/components/CritiqueCard.tsx', 'utf8');

const regex = /<div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Lyric Tool Expandable Section \*\/\}/m;

const replacement = `<div className="flex flex-col items-center gap-6 mb-12 text-center w-full">
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
          <h3 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-4 text-sky-600 dark:text-sky-400 max-w-4xl">
            {critique.title}
          </h3>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className={\`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest \${theme === 'coldest' ? 'bg-sky-100 text-sky-800' : 'bg-sky-500/20 text-sky-300'}\`}>
              {critique.isGangstaVox ? t('vocal_critique') : t('beat_critique')}
            </span>
            <span className={\`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest \${critique.isMasterMode ? (theme === 'coldest' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300') : (theme === 'coldest' ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-500/20 text-indigo-300')}\`}>
              {critique.isMasterMode ? 'Master Mode' : 'Mix Mode'}
            </span>
          </div>
          <p className="text-lg md:text-xl font-bold opacity-90 max-w-4xl leading-relaxed text-center mb-4">
            {critique.overallFeedback}
          </p>
        </div>
        
        <div className="flex justify-center flex-wrap gap-2 items-center w-full relative max-w-4xl">
          {isExporting && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-64 h-1 bg-black/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: \`\${exportProgress}%\` }}
                className="h-full bg-sky-500"
              />
            </div>
          )}

          {onMinimize && (
            <button
              onClick={onMinimize}
              className={\`shrink-0 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 \${theme === 'coldest' ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-white/10 text-white hover:bg-white/20'}\`}
            >
              {t('minimize')}
            </button>
          )}
          <button 
            onClick={handleExportHTML}
            disabled={isExporting}
            className={\`shrink-0 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 \${theme === 'coldest' ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}\`}
          >
            {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            {isExporting ? t('exporting', { progress: exportProgress }) : t('download_html')}
          </button>
          
          {(dawType === 'Bitwig' || dawType === 'Bitwig Studio' || dawType === 'Studio One') && (
            <button 
              onClick={handleExportDawProject}
              disabled={isExportingDawProject}
              className={\`shrink-0 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 \${theme === 'coldest' ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30'}\`}
            >
              {isExportingDawProject ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
              {isExportingDawProject ? t('exporting', { progress: 100 }) : 'DAWProject'}
            </button>
          )}
          
          <button 
            onClick={handleExportReaperMarkers}
            className={\`shrink-0 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 \${theme === 'coldest' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'}\`}
          >
            <Download className="w-3 h-3" />
            REAPER Markers (.csv)
          </button>

          <div className="flex flex-col gap-2 relative">
            <button 
              onClick={handlePushReaperSync}
              disabled={isPushingSync}
              className={\`shrink-0 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 \${theme === 'coldest' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'} \${syncPin ? 'border-2 border-emerald-400' : ''}\`}
            >
              {isPushingSync ? <Loader2 className="w-3 h-3 animate-spin" /> : (syncPin ? <Check className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />)}
              {syncPin ? 'Sync Pushed' : 'Push REAPER Sync'}
            </button>
            <AnimatePresence>
              {showEmailInput && !syncPin && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-10 left-1/2 -translate-x-1/2 w-64 z-[100] flex flex-col gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-md"
                >
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white">Enter Email to Sync:</label>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      value={syncEmail}
                      onChange={(e) => setSyncEmail(e.target.value)}
                      placeholder="mixer@gmail.com"
                      className={\`flex-1 px-3 py-2 rounded-lg text-xs bg-black/20 border border-white/10 text-white focus:outline-none focus:border-blue-500\`}
                    />
                    <button 
                      onClick={handlePushReaperSync}
                      className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg"
                    >
                      OK
                    </button>
                  </div>
                </motion.div>
              )}
              
              {syncPin && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className={\`absolute top-10 left-1/2 -translate-x-1/2 w-64 z-[100] p-4 rounded-xl border-2 border-emerald-400/50 bg-emerald-400/90 backdrop-blur-md flex flex-col items-center text-center\`}
                >
                  <div className="flex items-center gap-2 mb-2 text-white">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Cloud Sync Active</span>
                  </div>
                  <div className="text-[10px] text-white opacity-80 uppercase mb-1">Enter in BeatGangsta Connect:</div>
                  <div className="flex gap-4 w-full justify-center">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-white opacity-80 uppercase leading-none">Email</span>
                      <span className="text-xs font-bold text-white shadow-sm px-1 overflow-hidden overflow-ellipsis max-w-[80px]">{syncEmail}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-white opacity-80 uppercase leading-none">PIN</span>
                      <span className="text-xl font-black text-white tracking-[0.2em]">{syncPin}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSyncPin(null); setShowEmailInput(true); }}
                    className="mt-3 text-[10px] text-white opacity-70 hover:opacity-100 underline"
                  >
                    Resync / Change Email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsLyricToolExpanded(prev => !prev)}
            className={\`shrink-0 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2 \${isLyricToolExpanded ? 'bg-sky-950 text-sky-400 border border-sky-400/50' : theme === 'coldest' ? 'bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-200' : 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30'}\`}
          >
            <Mic className="w-3 h-3" />
            {t('lyric_tool', 'Lyric Tool')}
          </button>

          <button 
            onClick={() => onSave(critique)}
            disabled={isSaved}
            className={\`shrink-0 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 \${isSaved ? 'bg-black/10 text-current opacity-50 shadow-none' : theme === 'coldest' ? 'bg-gradient-to-b from-sky-400 to-sky-500 text-white shadow-[0_4px_15px_rgba(2,132,199,0.4)] border border-sky-400' : 'bg-white text-black'}\`}
          >
            {isSaved ? t('save_to_vault') : t('save_critique')}
          </button>
        </div>
      </div>

      {/* Lyric Tool Expandable Section */}`;

if (!regex.test(code)) {
    console.error("Regex not found!");
    process.exit(1);
}

const newCode = code.replace(regex, replacement);

fs.writeFileSync('src/components/CritiqueCard.tsx', newCode, 'utf8');
console.log('Fixed CritiqueCard.tsx successfully.');
