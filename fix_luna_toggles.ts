import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const lunaRandomSearchBlock = `
                {dawType === 'LUNA' && (
                  <div className="flex justify-center mt-6 gap-3 flex-wrap">
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

                    <div className={\`inline-flex items-center gap-3 rounded-full px-4 py-2 \${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}\`}>
                      <span className={\`text-[10px] font-black uppercase tracking-widest transition-colors \${lunaTape === 'oxide' ? (theme === 'coldest' ? 'text-orange-600' : 'text-orange-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}\`}>OXIDE TAPE</span>
                      
                      <div className={\`relative w-16 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors \${theme === 'coldest' ? 'bg-slate-300' : 'bg-slate-800'}\`} onClick={() => setLunaTape(lunaTape === 'oxide' ? 'off' : (lunaTape === 'off' ? 'studer' : 'oxide'))}>
                         <div className={\`absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-300 \${lunaTape === 'oxide' ? 'left-1 bg-orange-500' : lunaTape === 'studer' ? 'left-[44px] bg-emerald-500' : 'left-6 bg-slate-400'}\`} />
                      </div>
                      
                      <span className={\`text-[10px] font-black uppercase tracking-widest transition-colors \${lunaTape === 'studer' ? (theme === 'coldest' ? 'text-emerald-600' : 'text-emerald-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}\`}>STUDER A800</span>
                      
                      <span className={\`ml-2 text-[10px] font-black uppercase tracking-widest transition-colors \${lunaTape === 'off' ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}\`}>
                        {lunaTape === 'off' ? 'OFF' : ''}
                      </span>
                    </div>
                  </div>
                )}
`;

const lunaCritiqueToggles = `
                      {dawType === 'LUNA' && (
                        <>
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

                          <div className={\`inline-flex items-center gap-3 rounded-full px-4 py-2 \${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}\`}>
                            <span className={\`text-[10px] font-black uppercase tracking-widest transition-colors \${lunaTape === 'oxide' ? (theme === 'coldest' ? 'text-orange-600' : 'text-orange-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}\`}>OXIDE TAPE</span>
                            
                            <div className={\`relative w-16 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors \${theme === 'coldest' ? 'bg-slate-300' : 'bg-slate-800'}\`} onClick={() => setLunaTape(lunaTape === 'oxide' ? 'off' : (lunaTape === 'off' ? 'studer' : 'oxide'))}>
                               <div className={\`absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-300 \${lunaTape === 'oxide' ? 'left-1 bg-orange-500' : lunaTape === 'studer' ? 'left-[44px] bg-emerald-500' : 'left-6 bg-slate-400'}\`} />
                            </div>
                            
                            <span className={\`text-[10px] font-black uppercase tracking-widest transition-colors \${lunaTape === 'studer' ? (theme === 'coldest' ? 'text-emerald-600' : 'text-emerald-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}\`}>STUDER A800</span>
                            
                            <span className={\`ml-2 text-[10px] font-black uppercase tracking-widest transition-colors \${lunaTape === 'off' ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}\`}>
                              {lunaTape === 'off' ? 'OFF' : ''}
                            </span>
                          </div>
                        </>
                      )}
`;

// Replace the existing LUNA block in random/search
content = content.replace(
  /\{dawType === 'LUNA' && \([\s\S]*?\}\s*<\/div>\s*\}\)\s*<\/div>\s*\)\}/,
  lunaRandomSearchBlock + '\n              </div>\n              )}'
);

// Add to the critique toggles just before the `}` closing `flex flex-wrap justify-center gap-4`
content = content.replace(
  /<\/div>\s*\{\(dawType === 'REAPER' \|\| dawType === 'Reaper'\) && \(/,
  lunaCritiqueToggles + '\n                    </div>\n                    {(dawType === \'REAPER\' || dawType === \'Reaper\') && ('
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
