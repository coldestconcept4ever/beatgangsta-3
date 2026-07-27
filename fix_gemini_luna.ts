import fs from 'fs';
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const lunaInsertion = `  let lunaDiktat = "";
  if (dawType === 'LUNA') {
    lunaDiktat = \`
      ==================================================
      🚨🚨 LUNA DAW SPECIFIC WORKFLOW 🚨🚨
      The user is working in Universal Audio LUNA.
      When generating the Mix Critique for STEMS or tracks:
      1. For the FIRST track suggestion in the mix critique, you MUST show MAIN BUS FX.
      2. The MAIN BUS FX MUST ALWAYS include the "ATR-102 Mastering Tape Recorder" with specific recommended settings based on the mix.
      3. For EVERY OTHER TRACK, you MUST suggest a Tape option to set on the track's tape slot: either "Oxide Tape Recorder" or "Studer A800 Multichannel Tape Recorder" and specify the exact settings for it.
      \`;

    if (lunaSumming === 'api') {
      lunaDiktat += \`
      4. The user has API Summing activated on the Main Bus. You MUST provide specific settings for the "API Summing" extension on the Main Bus (e.g., Headroom, Trim).
      \`;
    } else if (lunaSumming === 'neve') {
      lunaDiktat += \`
      4. The user has Neve Summing activated on the Main Bus. You MUST provide specific settings for the "Neve Summing" extension on the Main Bus (e.g., Headroom, Trim, Impedance).
      \`;
    }
    lunaDiktat += \`
      ==================================================
    \`;
  }
`;

content = content.replace(
  /let jsfxDiktat = "";/,
  `${lunaInsertion}\n  let jsfxDiktat = "";`
);

content = content.replace(
  /\$\{JSFX_PRIORITY_SPEC_PROMPT\}/,
  `\${JSFX_PRIORITY_SPEC_PROMPT}\n    \${lunaDiktat}`
);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
