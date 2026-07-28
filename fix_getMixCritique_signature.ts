import fs from 'fs';
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const oldSignature = `  stemsPhysicalMetrics?: Record<string, { integratedLufs: number, truePeak: number, crestFactor: number, duration?: number }>
): Promise<any> => {`;

const newSignature = `  stemsPhysicalMetrics?: Record<string, { integratedLufs: number, truePeak: number, crestFactor: number, duration?: number }>,
  dawType: string | null = null,
  lunaSumming: 'api' | 'neve' | 'off' = 'off',
  lunaTape: 'oxide' | 'studer' | 'off' = 'off'
): Promise<any> => {`;

content = content.replace(oldSignature, newSignature);
fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
