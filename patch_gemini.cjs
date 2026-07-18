const fs = require('fs');
let code = fs.readFileSync('src/services/geminiService.ts', 'utf8');

const target = `      2. INTEGRATED LUFS & GAIN STAGING:
         - Compare the Integrated LUFS of the main track to the reference track (if provided). Calculate the exact target headroom delta.
         - If the main track is quiet (e.g. under -16 LUFS), specify precise output/makeup gain settings (+2dB to +8dB) on your compression/limiting steps to raise the level professionally to competitive industry standards (-14 to -9 LUFS depending on genre) while maintaining absolute headroom.`;

const replacement = `      2. INTEGRATED LUFS & GAIN STAGING:
         - Compare the Integrated LUFS of the main track to the reference track (if provided). Calculate the exact target headroom delta.
\${hasStems ? \`         - CRITICAL: Because the user uploaded STEMS, you MUST NOT try to raise individual stems to master loudness targets like -14 LUFS. Stems are intentionally quiet because their energy sums together on the master bus. Your gain staging for stems MUST perfectly preserve their original volume levels. If you apply compression or EQ cuts/boosts, strictly apply exact make-up gain to perfectly match the input volume. DO NOT boost stem volumes!\` : \`         - If the main track is quiet (e.g. under -16 LUFS), specify precise output/makeup gain settings (+2dB to +8dB) on your compression/limiting steps to raise the level professionally to competitive industry standards (-14 to -9 LUFS depending on genre) while maintaining absolute headroom.\`}`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/services/geminiService.ts', code);
    console.log("Patched successfully");
} else {
    console.log("Target string not found!");
}
