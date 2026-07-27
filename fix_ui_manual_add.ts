import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const ui = `                  </div>
                  
                  {/* Add Manual Plugin */}
                  <div className="flex flex-col items-center mt-6 w-full max-w-2xl">
                     <h4 className={\`text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-3 \${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}\`}>
                       Add New Plugins Manually
                     </h4>
                     <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
                       <input 
                         type="text" 
                         placeholder="Plugin Name" 
                         value={manualPluginName} 
                         onChange={(e) => setManualPluginName(e.target.value)} 
                         className={\`py-3 px-6 text-sm font-bold focus:outline-none transition-all w-full sm:w-64 rounded-full \${theme === 'coldest' ? 'bg-white/40 border-white text-slate-800' : theme === 'chef-mode' ? 'bg-white/60 border-white text-slate-900' : 'bg-black/60 border-white/10 text-white'}\`} 
                       />
                       <input 
                         type="text" 
                         placeholder="Brand / Vendor Name" 
                         value={manualPluginBrand} 
                         onChange={(e) => setManualPluginBrand(e.target.value)} 
                         className={\`py-3 px-6 text-sm font-bold focus:outline-none transition-all w-full sm:w-64 rounded-full \${theme === 'coldest' ? 'bg-white/40 border-white text-slate-800' : theme === 'chef-mode' ? 'bg-white/60 border-white text-slate-900' : 'bg-black/60 border-white/10 text-white'}\`} 
                       />
                       <button
                         onClick={handleManualResearchAndAdd}
                         disabled={isResearching || !manualPluginName.trim() || !manualPluginBrand.trim()}
                         className={\`py-3 px-6 rounded-full font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 \${theme === 'coldest' || theme === 'chef-mode' ? 'bg-sky-500 text-white' : 'bg-white/20 text-white'}\`}
                       >
                         {isResearching ? (
                           <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Researching...</span>
                         ) : (
                           "Research & Add"
                         )}
                       </button>
                     </div>
                  </div>
                </div>`;

content = content.replace(
  /className=\{`py-4 px-8 text-sm font-bold focus:outline-none transition-all w-64 sm:w-96 rounded-full \$\{theme === 'coldest' \? 'bg-white\/40 border-white text-slate-800' : theme === 'chef-mode' \? 'bg-white\/60 border-white text-slate-900' : 'bg-black\/60 border-white\/10 text-white'\}`\} \n                    \/>\n                  <\/div>\n                <\/div>/,
  `className={\`py-4 px-8 text-sm font-bold focus:outline-none transition-all w-64 sm:w-96 rounded-full \${theme === 'coldest' ? 'bg-white/40 border-white text-slate-800' : theme === 'chef-mode' ? 'bg-white/60 border-white text-slate-900' : 'bg-black/60 border-white/10 text-white'}\`} 
                    />\n${ui}`
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
