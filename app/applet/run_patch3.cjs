const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const buttonReplacement = `
                        <button 
                          onClick={() => {
                            setEditCreditsValue(selectedUser.credits);
                            setIsEditingCredits(true);
                          }}
                          className={\`w-10 h-10 rounded-xl flex items-center justify-center hover:bg-current/10 active:scale-95 transition-all \${theme === 'coldest' ? 'bg-slate-100' : 'bg-white/10'}\`}
                        >
                          <Pencil size={18} />
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleDeleteUser}
                    className="mt-2 text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest px-2 py-1 bg-red-500/10 rounded-lg transition-colors"
                  >
                    Delete User
                  </button>
`;

code = code.replace(/<button[^>]*>\s*<Pencil size=\{18\} \/>\s*<\/button>\s*<\/>\s*\)\}\s*<\/div>/g, buttonReplacement);

fs.writeFileSync('src/components/AdminDashboard.tsx', code, 'utf8');
console.log("Patched AdminDashboard a second time");
