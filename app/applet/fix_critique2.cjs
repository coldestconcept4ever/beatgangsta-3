// fix_critique2.cjs
const fs = require('fs');

let code = fs.readFileSync('src/components/CritiqueCard.tsx', 'utf8');

const targetStr = `      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2 text-sky-600 dark:text-sky-400">
            {critique.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={\`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest \${
              theme === 'coldest' ? 'bg-sky-100 text-sky-800' : 'bg-sky-500/20 text-sky-300'
            }\`}>
              {critique.isGangstaVox ? t('vocal_critique') : t('beat_critique')}
            </span>
            <span className={\`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest \${
              critique.isMasterMode
                ? (theme === 'coldest' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300')
                : (theme === 'coldest' ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-500/20 text-indigo-300')
            }\`}>
              {critique.isMasterMode ? 'Master Mode' : 'Mix Mode'}
            </span>
          </div>
          <p className="text-sm font-bold opacity-80 max-w-2xl leading-relaxed">
            {critique.overallFeedback}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">`;

const newStartStr = `      <div className="flex flex-col items-center gap-6 mb-12 text-center w-full">
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
        
        <div className="flex justify-center flex-wrap gap-2 items-center w-full relative max-w-4xl">`;

code = code.replace(targetStr, newStartStr);

const regexButtons = /<button\b[\s\S]*?<\/button>/gm;
const regexSyncDiv = /<div className="flex flex-col gap-2">[\s\S]*?<\/AnimatePresence>\s*<\/div>/m;

// Update buttons globally in this file?
// No, I'll just replace the original button declarations and use standard text replacement.

code = code.replace(/(<button\s+onClick={onMinimize}[\s\S]*?className={`shrink-0\s+)px-4\s+py-2(\s+rounded-full\s+font-black\s+text-)xs( \S+ tracking-widest transition-all[\s\S]*?`}\s*>[\s\S]*?<\/button>)/, "$1px-3 py-1.5$2[10px]$3");

code = code.replace(/(<button\s+onClick={handleExportHTML}[\s\S]*?className={`shrink-0\s+)px-8\s+py-4(\s+rounded-full\s+font-black\s+text-)xs(\s+uppercase tracking-widest transition-all shadow-xl[\s\S]*?min-w-\[160px\]\s+justify-center[\s\S]*?`}\s*>[\s\S]*?<\/button>)/, "$1px-3 py-1.5$2[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5 ${theme === 'coldest' ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}> {isExporting ? <Loader2 className=\"w-3 h-3 animate-spin\" /> : <Download className=\"w-3 h-3\" />} {isExporting ? t('exporting', { progress: exportProgress }) : t('download_html')} </button>");

code = code.replace(/<button \s*onClick={handleExportDawProject}[\s\S]*?<\/button>/m, `{(dawType === 'Bitwig' || dawType === 'Bitwig Studio' || dawType === 'Studio One') && (
            <button 
              onClick={handleExportDawProject}
              disabled={isExportingDawProject}
              className={\`shrink-0 px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5 \${theme === 'coldest' ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30'}\`}
            >
              {isExportingDawProject ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
              {isExportingDawProject ? t('exporting', { progress: 100 }) : 'DAWProject'}
            </button>
          )}`);

code = code.replace(/<button \s*onClick={handleExportReaperMarkers}[\s\S]*?<\/button>/m, `<button 
            onClick={handleExportReaperMarkers}
            className={\`shrink-0 px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5 \${theme === 'coldest' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'}\`}
          >
            <Download className="w-3 h-3" />
            REAPER Markers (.csv)
          </button>`);

// Now push reaper sync button and its components
// It's wrapped in `          <div className="flex flex-col gap-2">` which we want to change to relative wrapper or leave as is.
code = code.replace(/<div className="flex flex-col gap-2">/, `<div className="flex flex-col gap-2 relative z-50">`);

code = code.replace(/(<button \s*onClick={handlePushReaperSync}[\s\S]*?className={`shrink-0\s+)px-8\s+py-4(\s+rounded-full\s+font-black\s+text-)xs(\s+uppercase tracking-widest transition-all shadow-xl[\s\S]*?`}\s*>[\s\S]*?<\/button>)/, "$1px-3 py-1.5$2[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5 ${theme === 'coldest' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'} ${syncPin ? 'border-2 border-emerald-400' : ''}`}> {isPushingSync ? <Loader2 className=\"w-3 h-3 animate-spin\" /> : (syncPin ? <Check className=\"w-3 h-3\" /> : <RefreshCw className=\"w-3 h-3\" />)} {syncPin ? 'Sync Pushed' : 'Push REAPER Sync'} </button>");

// Change AnimatePresence overlays for Sync email and PIN to be absolute
code = code.replace(/className="flex flex-col gap-2 p-3 rounded-xl bg-blue-500\/10 border border-blue-500\/20"/, `className="absolute top-10 left-1/2 -translate-x-1/2 w-64 z-[100] flex flex-col gap-2 p-3 rounded-xl bg-blue-900 border border-blue-500/50 shadow-2xl"`);
code = code.replace(/<label className="text-\[10px\] font-black uppercase tracking-widest opacity-60">Enter Email to Sync:<\/label>/, `<label className="text-[10px] font-black uppercase tracking-widest opacity-90 text-white">Enter Email to Sync:</label>`);

code = code.replace(/className={`p-4 rounded-xl border-2 border-emerald-400\/50 bg-emerald-400\/10 flex flex-col items-center text-center`}/, `className={\`absolute top-10 left-1/2 -translate-x-1/2 w-72 z-[100] p-4 rounded-xl border border-emerald-400/50 bg-emerald-950/90 backdrop-blur-md shadow-2xl flex flex-col items-center text-center\`}`);

// lyric tool
code = code.replace(/(<button \s*onClick=\{\(\) => setIsLyricToolExpanded[\s\S]*?className={`shrink-0\s+)px-8\s+py-4(\s+rounded-full\s+font-black\s+text-)xs(\s+uppercase tracking-widest transition-all shadow-xl[\s\S]*?`}\s*>[\s\S]*?<\/button>)/, "$1px-3 py-1.5$2[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5 ${isLyricToolExpanded ? 'bg-sky-950 text-sky-400 border border-sky-400/50' : theme === 'coldest' ? 'bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-200' : 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30'}`}> <Mic className=\"w-3 h-3\" /> {t('lyric_tool', 'Lyric Tool')} </button>");

// save critique
code = code.replace(/(<button \s*onClick=\{\(\) => onSave\(critique\)\}[\s\S]*?className={`shrink-0\s+)px-8\s+py-4(\s+rounded-full\s+font-black\s+text-)xs(\s+uppercase tracking-widest transition-all shadow-xl[\s\S]*?`}\s*>[\s\S]*?<\/button>)/, "$1px-3 py-1.5$2[10px] uppercase tracking-widest transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5 ${isSaved ? 'bg-black/10 text-current opacity-50 shadow-none' : theme === 'coldest' ? 'bg-gradient-to-b from-sky-400 to-sky-500 text-white shadow-[0_4px_15px_rgba(2,132,199,0.4)] border border-sky-400' : 'bg-white text-black'}`}> {isSaved ? t('save_to_vault') : t('save_critique')} </button>");

fs.writeFileSync('src/components/CritiqueCard.tsx', code, 'utf8');
console.log('Fixed CritiqueCard.tsx successfully.');
