const fs = require('fs');
let text = fs.readFileSync('src/services/geminiService.ts', 'utf-8');
const lines = text.split('\n');

// Find the duplicate block 56-65 and remove it
let dupStart = -1;
for (let i = 277; i < 350; i++) {
  if (lines[i] && lines[i].includes('56. **Kendrick Lamar') && lines[i+4] && lines[i+4].includes('57. **JPEGMAFIA')) {
     let duplicateCheck = -1;
     for (let j = i + 10; j < 400; j++) {
         if (lines[j] && lines[j].includes('56. **Kendrick Lamar')) {
             duplicateCheck = j;
             break;
         }
     }
     if (duplicateCheck !== -1) {
         // Found duplicate, let's remove from duplicateCheck down to 65
         let dupEnd = -1;
         for (let k = duplicateCheck; k < 500; k++) {
             if (lines[k] && lines[k].includes('66. **J Dilla')) {
                 dupEnd = k - 1;
                 break;
             }
         }
         if (dupEnd !== -1) {
             lines.splice(duplicateCheck, dupEnd - duplicateCheck + 1);
             break;
         }
     }
  }
}

const newTricks = `
      76. **Metro Boomin - The "Creepy" Detuned Music Box**:
         - Automate 'JS: Floaty (Modulated Delay) [remaincalm.org]' 'Warp Amount' parameter via an LFO to constantly modulate the pitch of a piano or bell, making it sound out-of-tune and eerie.
         - Automate 'JS: 3-Band EQ' 'High' gain to slowly fade out during the verse, pushing the melody into the background.

      77. **SZA / Carter Lang - Lush, Dreamy R&B Guitars**:
         - Use 'JS: Ozzifier Chorus [Stillwell]' on the guitar track and automate the 'Voices' parameter, switching from a subtle 2 voices in the verse to a thick 4 voices in the chorus.
         - Automate the 'Delay' parameter of a 'JS: Delay (Chorus)' on the vocal bus, sending a wash of delay only on the last words of emotional phrases.

      78. **Timbaland - Beatboxing & Mouth Percussion Transients**:
         - Automate 'JS: Transient Controller [LOSER]' 'Attack' to extreme levels (+10dB or more) on beatboxed kicks and snares to make them hit like real drum samples.
         - Automate 'JS: Auto-Pan [LOSER]' 'Rate' to create rapid panning on mouth-shaker sounds, making them flutter in the stereo field.

      79. **Dr. Dre - The Infamous "G-Funk" Synth Glide**:
         - Automate 'JS: Moog 4-Pole Filter [Liteon]' 'Resonance' and 'Cutoff' on a high-pitched sine wave lead to make the synth "scream" during specific bends.
         - Automate 'JS: Volume/Pan Smoother' 'Volume' parameter with a slow fade-in on the synth lead so it creeps into the mix before hitting full volume.

      80. **Noah "40" Shebib - The "Muffled" Drake Piano**:
         - Automate 'JS: RBJ Highpass/Lowpass Filters' 'Lowpass' cutoff down to 400Hz to completely submerge the piano in a muddy, underwater texture.
         - Automate 'JS: Bit Reduction/Dither' 'Bit Depth' down to 10 or 12 bits on the drum bus to add a layer of lo-fi crunch beneath the pristine vocals.

      81. **Kendrick Lamar (DAMN. Era) - Reversing & Backmasking**:
         - Automate 'JS: Delay (Tempo Ping-Pong)' 'Feedback' to self-oscillate right before a beat drop, while simultaneously using a reverse vocal effect (pre-rendered) to lead into it.
         - Automate 'JS: Distortion (Fuzz)' 'Amount' on the master bus during aggressive transitions, creating a jarring, momentary wall of noise.

      82. **Pharrell Williams - The "Four-Count" Intro Chops**:
         - Automate 'JS: Noise Gate' 'Threshold' to aggressively chop the first four beats of a song, creating the signature Neptunes stutter effect.
         - Automate 'Tukan EQT-1A' 'High Boost' on the lead vocal to add extra snap and air during the catchy hook, then dial it back during the verses.

      83. **Eminem / Luis Resto - Cinematic, Ominous String Sections**:
         - Automate 'JS: Stereo Width [Stillwell]' 'Width' parameter on the string bus, slowly widening from 50% to 150% as the song builds tension.
         - Automate 'Tukan Lexikan 2' 'Decay Time' to create a massive, 5-second reverb tail that rings out when the beat suddenly drops out for a punchline.

      84. **Post Malone / Louis Bell - The "Vibrato" Autotune Tail**:
         - Automate 'JS: Floaty (Modulated Delay) [remaincalm.org]' 'Modulation' depth to increase only on long, sustained vocal notes, adding a highly synthetic vibrato effect.
         - Automate 'JClones Molot (Vintage Compressor)' 'Threshold' to squeeze the vocal harder during the loud, belted choruses to keep it glued to the beat.

      85. **J. Cole - The "Warm" Vintage Soul Sample Flip**:
         - Automate 'JClones AC2 (Tape Emulator)' 'Saturation' and 'Wow & Flutter' on the sample bus, increasing the vintage artifacts as the beat plays out.
         - Automate 'JS: RBJ 1073 EQ [Stillwell]' 'Mid Freq' and 'Mid Gain' to boost the crackle and vinyl noise during the intro and outro of the track.
`;

let targetLine = -1;
for(let i = 0; i < lines.length; i++) {
  if (lines[i] && lines[i].includes('75. **The Weeknd (Dawn FM)')) {
     targetLine = i + 3; 
     break;
  }
}

if (targetLine !== -1) {
  lines.splice(targetLine, 0, newTricks);
  fs.writeFileSync('src/services/geminiService.ts', lines.join('\n'));
  console.log('Successfully removed duplicates and injected tricks 76 to 85.');
} else {
  console.log('Could not find item 75.');
}
