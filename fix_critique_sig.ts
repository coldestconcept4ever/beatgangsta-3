import fs from 'fs';
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');
content = content.replace(
  /stemsPhysicalMetrics\?: Record<string, \{ integratedLufs: number, truePeak: number, crestFactor: number, duration\?: number \}>\): Promise<any> => \{/,
  `stemsPhysicalMetrics?: Record<string, { integratedLufs: number, truePeak: number, crestFactor: number, duration?: number }>,
  dawType: string | null = null,
  lunaSumming: 'api' | 'off' | 'neve' = 'off'
): Promise<any> => {`
);
fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
