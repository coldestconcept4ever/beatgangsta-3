import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement = `                {(dawType === 'REAPER' || dawType === 'Reaper') && (
                  <div className="flex justify-center mt-6 gap-3">
                    <div className={\`inline-flex items-center gap-3 rounded-full px-4 py-2 \${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}\`}>
                      <span className={\`text-[10px] font-black uppercase tracking-widest transition-colors \${!isJsfxMode ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}\`}>REAPER JSFX ONLY</span>
                      <button 
                        onClick={() => setIsJsfxMode(!isJsfxMode)}
                        className={\`relative w-10 h-5 rounded-full transition-colors \${isJsfxMode ? 'bg-[#10b981]' : 'bg-slate-400/50'}\`}
                      >
                        <div className={\`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform \${isJsfxMode ? 'translate-x-5' : 'translate-x-0'}\`} />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowReapackReposModal(true)}
                      className={\`inline-flex items-center gap-2 rounded-full px-4 py-2 \${theme === 'coldest' ? 'bg-white/40 hover:bg-white/60' : 'bg-black/40 hover:bg-black/60'} transition-colors\`}
                    >
                      <Database className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className={\`text-[10px] font-black uppercase tracking-widest \${theme === 'coldest' ? 'text-slate-900' : 'text-white'}\`}>
                        ReaPack JSFX Repositories
                      </span>
                    </button>
                  </div>
                )}
                {dawType === 'LUNA' && (
                  <div className="flex justify-center mt-6 gap-3">
                    <div className={\`inline-flex items-center gap-3 rounded-full px-4 py-2 \${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}\`}>
                      <span className={\`text-[10px] font-black uppercase tracking-widest transition-colors \${lunaSumming === 'api' ? (theme === 'coldest' ? 'text-sky-600' : 'text-sky-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}\`}>API SUMMING</span>
                      
                      <div className={\`relative w-16 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors \${theme === 'coldest' ? 'bg-slate-300' : 'bg-slate-800'}\`} onClick={() => setLunaSumming(lunaSumming === 'api' ? 'off' : (lunaSumming === 'off' ? 'neve' : 'api'))}>
                         <div className={\`absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-300 \${lunaSumming === 'api' ? 'left-1 bg-sky-500' : lunaSumming === 'neve' ? 'left-[44px] bg-red-500' : 'left-6 bg-slate-400'}\`} />
                      </div>
                      
                      <span className={\`text-[10px] font-black uppercase tracking-widest transition-colors \${lunaSumming === 'neve' ? (theme === 'coldest' ? 'text-red-600' : 'text-red-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}\`}>NEVE SUMMING</span>
                      
                      <span className={\`ml-2 text-[10px] font-black uppercase tracking-widest transition-colors \${lunaSumming === 'off' ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}\`}>
                        {lunaSumming === 'off' ? 'OFF' : ''}
                      </span>
                    </div>
                  </div>
                )}`;

content = content.replace(
  /\{\(dawType === 'REAPER' \|\| dawType === 'Reaper'\) && \([\s\S]*?ReaPack JSFX Repositories\n                      <\/span>\n                    <\/button>\n                  <\/div>\n                \)}/g,
  replacement
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
