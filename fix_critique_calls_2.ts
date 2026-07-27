import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  /referencePhysicalMetrics\n\s*\);/g,
  `referencePhysicalMetrics,
          undefined,
          dawType,
          lunaSumming
        );`
);
fs.writeFileSync('src/App.tsx', content, 'utf-8');
