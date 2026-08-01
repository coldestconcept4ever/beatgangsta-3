import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix the TS error by removing || audioMode === 'album' from that specific span
content = content.replace(
  /\{\(hasStems \|\| audioMode === 'album'\) \? \(theme === 'coldest' \? 'text-slate-900' : 'text-white'\)/g,
  "{hasStems ? (theme === 'coldest' ? 'text-slate-900' : 'text-white')"
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log("Patched TS error");
