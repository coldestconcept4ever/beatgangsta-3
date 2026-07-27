import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  /stemsPhysicalMetrics\n\s*\);/g,
  `stemsPhysicalMetrics,
        dawType,
        lunaSumming
      );`
);
fs.writeFileSync('src/App.tsx', content, 'utf-8');
