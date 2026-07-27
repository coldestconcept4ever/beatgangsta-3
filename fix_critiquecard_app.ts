import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  /dawType=\{dawType\}\n\s*reaperSyncPin=\{reaperSyncPin\}\n\s*reaperSyncEmail=\{reaperSyncEmail\}\n\s*isJsfxMode=\{isJsfxMode\}/g,
  `dawType={dawType}\n                              lunaSumming={lunaSumming}\n                              reaperSyncPin={reaperSyncPin}\n                              reaperSyncEmail={reaperSyncEmail}\n                              isJsfxMode={isJsfxMode}`
);
fs.writeFileSync('src/App.tsx', content, 'utf-8');
