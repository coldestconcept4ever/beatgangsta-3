const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const replacement = `
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (!window.confirm(\`WARNING: Are you absolutely sure you want to permanently delete user \${selectedUser.email}? This will erase all their plugins, recipes, receipts, and cannot be undone.\`)) return;
    
    setLoading(true);
    try {
      const masterKey = localStorage.getItem('_master_key_temp') || '';
      const res = await fetch(\`/api/admin/users/\${selectedUser.uid}?key=\${masterKey}\`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete user');
      
      setUsers(prev => prev.filter(u => u.uid !== selectedUser.uid));
      setSelectedUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [viewMode`;

code = code.replace("  const [viewMode", replacement);

const buttonReplacement = `
                        <button 
                          onClick={() => {
                            setEditCreditsValue(selectedUser.credits);
                            setIsEditingCredits(true);
                          }}
                          className={\`w-10 h-10 rounded-xl flex items-center justify-center hover:bg-current/10 active:scale-95 transition-all \${theme === 'coldest' ? 'bg-slate-100' : 'bg-white/10'}\`}
                        >
                          <Edit3 size={18} />
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

code = code.replace(/<button[^>]*>\s*<Edit3 size=\{18\} \/>\s*<\/button>\s*<\/>\s*\)\}\s*<\/div>/g, buttonReplacement);

fs.writeFileSync('src/components/AdminDashboard.tsx', code, 'utf8');
console.log("Patched AdminDashboard");
