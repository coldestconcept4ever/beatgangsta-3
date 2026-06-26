const fs = require('fs');
let text = fs.readFileSync('src/services/geminiService.ts', 'utf-8');
const lines = text.split('\n');

const newTricks = `
      56. **Kendrick Lamar (To Pimp a Butterfly) - Jazz-Inflected Vocal Filtering**:
         - Automate the 'Cutoff' parameter of 'JS: Moog 4-Pole Filter [Liteon]' (using an LFO via Parameter Modulation) to create a subtle, evolving wah-wah effect on backing vocals.
         - Automate 'Gain' in 'JS: 3-Band EQ' to sweep the mid-range during beat switches, giving a radio-dial changing effect.

      57. **JPEGMAFIA - Glitched and Gated Rhythmic Drops**:
         - Automate the 'Threshold' on 'JS: Noise Gate' to aggressively choke the vocal tail perfectly in time with sudden beat stops.
         - Use Parameter Modulation (Audio Control Signal) from the kick drum to violently duck the 'Volume' slider on a 'JS: Distortion (Fuzz)' plugin applied to the vocal, creating distorted pumping.

      58. **Tyler, The Creator (IGOR Era) - Sweeping Chorus and Pitch Wobble**:
         - Automate the 'Depth' and 'Rate' of 'JS: Ozzifier Chorus [Stillwell]' via a slow LFO to make the vocal pitch waver like a melted VHS tape during the chorus.
         - Automate 'JS: Pitch Down-Shifter' 'Shift' parameter to slide down exactly -12 semitones at the end of specific phrases.

      59. **Brockhampton - Group Swarm Vocal Widening**:
         - Use 'JS: Stereo Width [Stillwell]' and automate the 'Width' parameter, starting at 100% during the verse and slamming to 200% when the entire group yells the chorus.
         - Automate the 'Pan' slider on 'JS: Volume/Pan Smoother' using a random LFO so ad-libs rapidly bounce around the stereo field unpredictably.

      60. **Death Grips - Ear-Bleeding Industrial Vocal Chaos**:
         - Use 'JS: Waveshaping Distortion [LOSER]' and automate the 'Distortion' parameter linked to the vocal track's own volume (Audio Control Signal), so the louder the scream, the more exponentially distorted it becomes.
         - Automate the 'Feedback' on 'JS: Delay (Lo-Fi)' to 100% just before a beat drop to create a feedback loop of screeching noise, then automate it back to 0.

      61. **Mac Demarco / Indie Rap crossovers - Seasick Vibrato Guitars/Vocals**:
         - Automate the 'Modulation' depth on 'JS: Floaty (Modulated Delay) [remaincalm.org]' via an LFO to create a constant, nauseating (but musical) pitch vibrato.
         - Use 'JS: Auto-Pan [LOSER]' and automate the 'Rate' parameter to ramp up in speed as a verse builds tension.

      62. **Vince Staples / SOPHIE - Metallic, Synthesized Vocal Plucks**:
         - Send the vocal to a 'JS: 4-Tap Phaser' and automate the 'Feedback' and 'Frequency' parameters using a fast square-wave LFO to create a robotic, ringing metallic resonance.
         - Automate 'JS: Transient Controller [LOSER]' 'Attack' parameter, boosting it only on hard consonant sounds to make the vocal click like percussion.

      63. **Lil Yachty / Michigan Boat Boy Era - Warbling, Saturated Sub-Bass Vocals**:
         - Automate the 'Drive' parameter on 'JS: Bad Buss Mojo Waveshaper [Stillwell]' to increase saturation as the vocal gets quieter, bringing up the noise floor aggressively.
         - Link the 'Wet' parameter of 'Tukan Lexikan 2' to a sidechain signal from the lead vocal, so the reverb is completely ducked when rapping, and swells up massively when he stops (reverb pumping).

      64. **Slowthai / UK Grime - Hyper-Compressed, Breathy Whispers**:
         - Automate the 'Release' parameter on 'JClones Molot (Vintage Compressor)' via an LFO to create an unnatural breathing/pumping effect on the vocal bus.
         - Automate a 'JS: RBJ Highpass/Lowpass Filters' 'Lowpass' frequency to sharply sweep down and muffle the vocal at the end of 8-bar phrases.

      65. **Rico Nasty - "Sugar Trap" Distorted Screams**:
         - Chain two 'JS: Distortion (Fuzz)' plugins. Automate the 'Bypass' parameter of the second one to snap ON only during aggressive scream punch-ins.
         - Automate the 'Time' parameter on a 'JS: Delay (Tempo Ping-Pong)' to change divisions (from 1/4 to 1/16) mid-phrase, causing the delay pitches to glitch and warp rhythmically.
`;

let targetLine = -1;
for(let i = 0; i < lines.length; i++) {
  if (lines[i].includes('55. **DaBaby - In-Your-Face, Zero Reverb Dry Punch**:')) {
     targetLine = i + 3; 
     break;
  }
}

if (targetLine !== -1) {
  lines.splice(targetLine, 0, newTricks);
  fs.writeFileSync('src/services/geminiService.ts', lines.join('\n'));
  console.log('Successfully injected tricks 56 to 65.');
} else {
  console.log('Could not find item 55.');
}
