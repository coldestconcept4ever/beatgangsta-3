import fs from 'fs';
let content = fs.readFileSync('src/services/geminiService.ts', 'utf-8');

const replacement = `  const hardwareListStr = [...analogInstruments, ...analogHardware].map(h => {
    const pedalsStr = h.connectedPedals && h.connectedPedals.length > 0 
      ? \` (Connected Pedals: \${h.connectedPedals.map(p => \`\${p.vendor} \${p.name}\`).join(', ')})\` 
      : '';
    const ampsStr = h.connectedAmps && h.connectedAmps.length > 0
      ? \` (Connected Amps: \${h.connectedAmps.map(a => \`\${a.vendor} \${a.name}\`).join(', ')})\`
      : '';
    return \`\${h.vendor} - \${h.name}\${pedalsStr}\${ampsStr}\`;
  }).join('\\n');

  let lunaIntegrationStr = "";
  if (dawType && dawType.toUpperCase() === 'LUNA') {
    lunaIntegrationStr += \`\\n\\n==================================================\\n🚨🚨 CRITICAL LUNA ARCHITECTURE DIRECTIVE 🚨🚨\\nThe user is mixing in Universal Audio LUNA. \`;
    if (lunaSumming && lunaSumming !== 'off') {
       lunaIntegrationStr += \`LUNA has built-in analog summing (\${lunaSumming.toUpperCase()}) natively integrated into its busses and master channel. You MUST suggest "Headroom" (HR) and "Trim" values for the \${lunaSumming.toUpperCase()} summing on any bus or master channels in your steps. \`;
    }
    if (lunaTape && lunaTape !== 'off') {
       lunaIntegrationStr += \`LUNA has a dedicated Tape Extension slot (\${lunaTape.toUpperCase()}) natively integrated into EVERY audio track and bus. This is NOT a standard insert plugin. When 'lunaTape' is toggled ON to \${lunaTape.toUpperCase()}, EVERY SINGLE track or stem you critique MUST explicitly include the \${lunaTape.toUpperCase()} Tape Extension settings (specifically the "Saturation" parameter, often in dB or o'clock values) as the VERY FIRST item in the 'recommendedChain'. Do not ignore this tape machine setting. Name it "\${lunaTape.toUpperCase()} Tape Extension" and provide its specific Saturation parameter. \`;
    }
    lunaIntegrationStr += \`\\n==================================================\\n\`;
  }
`;

content = content.replace(
  /  const hardwareListStr = \[\.\.\.analogInstruments, \.\.\.analogHardware\]\.map\(h => \{\n    const pedalsStr = h\.connectedPedals && h\.connectedPedals\.length > 0 \n      \? ` \(Connected Pedals: \$\{h\.connectedPedals\.map\(p => `\$\{p\.vendor\} \$\{p\.name\}`\)\.join\(\', \'\)\}\)` \n      : \'\';\n    const ampsStr = h\.connectedAmps && h\.connectedAmps\.length > 0\n      \? ` \(Connected Amps: \$\{h\.connectedAmps\.map\(a => `\$\{a\.vendor\} \$\{a\.name\}`\)\.join\(\', \'\)\}\)`\n      : \'\';\n    return `\$\{h\.vendor\} - \$\{h\.name\}\$\{pedalsStr\}\$\{ampsStr\}`;\n  \}\)\.join\(\'\\n\'\);/g,
  replacement
);

const promptReplace = `    \${hasApollo ? \`
    CRITICAL: The user has an \${apolloInst} interface. When suggesting plugins for the action plan, you MUST ALWAYS prioritize UAD (Universal Audio) plugins from their library if they are suitable.
    \` : ''}
    \${lunaIntegrationStr}`;

content = content.replace(
  /    \$\{hasApollo \? `\n    CRITICAL: The user has an \$\{apolloInst\} interface\. When suggesting plugins for the action plan, you MUST ALWAYS prioritize UAD \(Universal Audio\) plugins from their library if they are suitable\.\n    ` : \'\'\}/g,
  promptReplace
);

fs.writeFileSync('src/services/geminiService.ts', content, 'utf-8');
console.log("Patched geminiService.ts");
