import fs from 'fs';
let content = fs.readFileSync('src/components/CritiqueCard.tsx', 'utf-8');

// add lunaSumming to props
content = content.replace(
  /dawType\?: string \| null;/g,
  `dawType?: string | null;\n  lunaSumming?: 'api' | 'off' | 'neve';`
);

// add lunaSumming to function signature
content = content.replace(
  /dawType = null, reaperSyncPin, reaperSyncEmail, isJsfxMode = false \} = props;/g,
  `dawType = null, lunaSumming = 'off', reaperSyncPin, reaperSyncEmail, isJsfxMode = false } = props;`
);
content = content.replace(
  /dawType = null, reaperSyncPin, reaperSyncEmail, isJsfxMode = false \}\) => \{/g,
  `dawType = null, lunaSumming = 'off', reaperSyncPin, reaperSyncEmail, isJsfxMode = false }) => {`
);

// add to getMixCritique call
content = content.replace(
  /physicalMetrics \/\/ 23 \(physicalMetrics\)\n\s*\);/g,
  `physicalMetrics, // 23 (physicalMetrics)
        undefined, // 24 (referencePhysicalMetrics)
        undefined, // 25 (stemsPhysicalMetrics)
        dawType, // 26 (dawType)
        lunaSumming // 27 (lunaSumming)
      );`
);

fs.writeFileSync('src/components/CritiqueCard.tsx', content, 'utf-8');
