import fs from 'fs';
let content = fs.readFileSync('src/components/CritiqueCard.tsx', 'utf-8');

content = content.replace(
  /dawType\?: string \| null;\n  lunaSumming\?: 'api' \| 'neve' \| 'off';/,
  "dawType?: string | null;\n  lunaSumming?: 'api' | 'neve' | 'off';\n  lunaTape?: 'oxide' | 'studer' | 'off';"
);

content = content.replace(
  /lunaSumming = 'off', reaperSyncPin/,
  "lunaSumming = 'off', lunaTape = 'off', reaperSyncPin"
);

content = content.replace(
  /        dawType, \/\/ 26 \(dawType\)\n        lunaSumming \/\/ 27 \(lunaSumming\)/,
  "        dawType, // 26 (dawType)\n        lunaSumming, // 27 (lunaSumming)\n        lunaTape // 28 (lunaTape)"
);

fs.writeFileSync('src/components/CritiqueCard.tsx', content, 'utf-8');
