const fs = require('fs');
let text = fs.readFileSync('src/services/geminiService.ts', 'utf-8');
const lines = text.split('\n');

const newTricks = `
      36. **Kanye West (Yeezus Era) - Industrial, Aggressive Saturation**:
         - Use \`JS: Bad Buss Mojo Waveshaper [Stillwell]\` on the vocal bus with aggressive settings to emulate the raw, screaming distortion found on tracks like "Black Skinhead".
         - Parallel compression using \`Tukan NC76\` smashed, blending it back in to give the vocal a gritty, forward edge without losing all dynamics.

      37. **T-Pain - The Original Hard-Tune Telephone Effect**:
         - Create a narrow bandpass filter using \`JS: RBJ Highpass/Lowpass Filters\` (cutting below 400Hz and above 4kHz) to emulate the "telephone" eq curve.
         - Run the hard-tuned vocal through \`JClones Molot (Vintage Compressor)\` in "Sigma" mode to violently compress the mid-range.

      38. **Snoop Dogg / Dr. Dre (The Chronic) - Smooth G-Funk Double Tracking**:
         - Extremely tight vocal doubling panned hard left and right (L100, R100), lightly compressed using \`JClones CA2A (Optical Compressor)\`.
         - Subtle slapback delay \`JS: Delay (Chorus)\` set to roughly 60-80ms with 0% feedback to widen the presence of the mono lead vocal.

      39. **Trippie Redd - Screamo/Rock Rap Hybrid Vocals**:
         - Automate \`JS: Distortion (Fuzz)\` to only activate when the vocal delivery transitions from melodic singing to screaming.
         - Use a wide, detuned flanger \`JS: Flange Baby [Stillwell]\` subtly mixed in to give the screams a phasing, chaotic metallic ring.

      40. **Busta Rhymes - Lightning Fast, Transient-Snapped Delivery**:
         - Emphasize vocal transients using \`JS: Transient Controller [LOSER]\`, boosting the attack significantly so every rapid-fire syllable cuts through the mix.
         - Use \`JS: 1175 Compressor\` with a very fast attack and release to keep the dynamic range pinned so words aren't lost.

      41. **Don Toliver - Airy, Modulated R&B Trap Vocals**:
         - Generous use of \`Tukan Lexikan 2\` reverb with a bright damping setting to make the vocal tail shimmer in the high frequencies.
         - Micro-pitch shifting using \`JS: Pitch Shifter 2\` with slight modulation to give the vocal a synth-like, floating quality.

      42. **Gunna - Sleek, "Slime" Slippery Ad-libs**:
         - Very fast tempo-synced delays using \`JS: Delay (Tempo Ping-Pong)\` set to 1/8T (triplets), with a low-pass filter on the delay return.
         - "Ducking" delay effect: use Parameter Modulation so the delay feedback/volume is ducked by the lead vocal, so the echoes only swell in the gaps.

      43. **Isaiah Rashad - Lo-Fi, Muffled Southern Rap Intimacy**:
         - Roll off the extreme highs and extreme lows using \`JS: 3-Band EQ\` to give the vocal a confined, "recorded in a bedroom" lo-fi vibe.
         - Apply \`JClones AC2 (Tape Emulator)\` with high wow and flutter to slightly detune the vocal randomly, enhancing the lazy, laid-back delivery.

      44. **Kid Cudi - Sweeping, Cosmic Hum and Chorus**:
         - Envelop the humming and melodic ad-libs in \`JS: Ozzifier Chorus [Stillwell]\` to create a wide, multi-layered chorus effect.
         - Add a long \`Tukan Lexikan\` reverb tail and use \`JS: RBJ 1073 EQ [Stillwell]\` to aggressively boost 5-8kHz on the reverb return, making it sparkle.

      45. **Frank Ocean (Blonde Era) - Formant-Mangled Pitch Shifting**:
         - Use \`JS: Pitch Down-Shifter\` but automate the pitch and formant so the voice seamlessly transitions from a chipmunk high-pitch to a deep, masculine baritone.
         - Pair with \`JS: Floaty (Modulated Delay) [remaincalm.org]\` to make the pitch-shifted voice wobble in pitch slightly, imitating a broken VHS tape.
`;

let targetLine = -1;
for(let i = 0; i < lines.length; i++) {
  if (lines[i].includes('35. **XXXTentacion')) {
     targetLine = i + 3; 
     break;
  }
}

if (targetLine !== -1) {
  lines.splice(targetLine, 0, newTricks);
  fs.writeFileSync('src/services/geminiService.ts', lines.join('\n'));
  console.log('Successfully injected tricks 36 to 45.');
} else {
  console.log('Could not find item 35.');
}
