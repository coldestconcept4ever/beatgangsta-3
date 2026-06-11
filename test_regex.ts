import * as fs from 'fs';
const text = `Audio Damage. Inc.,Basic x64,VST2,1.0.0.0,Last year
<Section path="021A09FB/FIN-MICRO.dll">
`;
const lines = text.trim().split('\n');
const isReaperIni = lines.some(l => !l.trim().startsWith('<') && /^[^=]+\.(dll|vst3)=/i.test(l.trim()));
console.log("isReaperIni:", isReaperIni);
