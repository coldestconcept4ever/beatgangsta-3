import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /        combinedPhysicalMetrics, \/\/ physicalMetrics representing the cumulative mix sum!\n        referencePhysicalMetrics,\n        stemsPhysicalMetrics\n      \);/,
  "        combinedPhysicalMetrics, // physicalMetrics representing the cumulative mix sum!\n        referencePhysicalMetrics,\n        stemsPhysicalMetrics,\n        dawType,\n        lunaSumming,\n        lunaTape\n      );"
);

content = content.replace(
  /        physicalMetrics,\n        referencePhysicalMetrics,\n        undefined\n      \);/,
  "        physicalMetrics,\n        referencePhysicalMetrics,\n        undefined,\n        dawType,\n        lunaSumming,\n        lunaTape\n      );"
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
