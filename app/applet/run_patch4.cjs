const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const target = `<span className="truncate">ID: {selectedUser.uid}</span>`;
const replacement = `<span className="truncate">ID: {selectedUser.uid}</span>
                      <button
                        onClick={handleDeleteUser}
                        className="ml-2 text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest px-2 py-0.5 bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
                        title="Delete User Permanently"
                      >
                        Delete User
                      </button>`;
if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/AdminDashboard.tsx', code, 'utf8');
    console.log("Patched AdminDashboard specifically at UID");
} else {
    console.log("Could not find the UID span");
}
