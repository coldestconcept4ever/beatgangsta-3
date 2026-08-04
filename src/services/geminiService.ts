import { JSFX_DATABASE } from "../data/jsfxResearch";
import { UAD_DATABASE } from "../data/uadDatabase";
import { VST_DATABASE } from "../data/vstDatabase";

export enum Type {
  TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
  STRING = "STRING",
  NUMBER = "NUMBER",
  INTEGER = "INTEGER",
  BOOLEAN = "BOOLEAN",
  ARRAY = "ARRAY",
  OBJECT = "OBJECT",
  NULL = "NULL" }
export enum HarmCategory {
  HARM_CATEGORY_UNSPECIFIED = "HARM_CATEGORY_UNSPECIFIED",
  HARM_CATEGORY_HARASSMENT = "HARM_CATEGORY_HARASSMENT",
  HARM_CATEGORY_HATE_SPEECH = "HARM_CATEGORY_HATE_SPEECH",
  HARM_CATEGORY_SEXUALLY_EXPLICIT = "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT" }
export enum HarmBlockThreshold {
  HARM_BLOCK_THRESHOLD_UNSPECIFIED = "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
  BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
  BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
  BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
  OFF = "BLOCK_NONE" }
export enum ThinkingLevel {
  HIGH = "HIGH",
  LOW = "LOW",
  MINIMAL = "MINIMAL" }
import { VSTPlugin, RecommendationResponse, BeatRecipe, SavedRecipe, Hardware, StructuralBlueprint, XpandPreset } from "../types";
import { fetchWithDetailedError } from "../lib/api";
import { keepAlive } from "../lib/keepAlive";
import { getVendorSpecificParameters, normalizeParameterName } from "../utils/pluginUtils";
import { sanitizeJSON } from "../utils/jsonUtils";
import { applySafeParameterMappingToCritique, applySafeParameterMappingToChain } from "../utils/safeParameterMapper";
import { DEFAULT_OWNED_XPAND_PRESETS } from "../data/xpandPresets";

const getMultiBandInstruction = (isMultiBandMode: boolean) => {
  return isMultiBandMode ? `
MULTI-BAND/GAFFEL MODE ON:
You must provide a highly intuitive and mathematically precise multiband splitting blueprint.
For each stem, track, or bus that requires an effect:
1. Include a 'multiBandDetails' object containing:
   - 'isEnabled': true
   - 'bandCount': the exact number of bands/track duplications needed (e.g., 3 or 4)
   - 'splitFrequencies': an array of exact crossover frequencies in Hz/kHz to split at, e.g. ["150Hz", "2.5kHz"]
   - 'reasoning': a clear explanation of WHY these specific splits are chosen and how to route/duplicate them.
2. CRITICAL - YOU MUST PROVIDE PLUGINS FOR *EVERY* SINGLE BAND: If bandCount is 3, your plugin array MUST contain some plugins for Band 1, some for Band 2, AND some for Band 3. Do NOT just output a "General" chain.
3. Each plugin object MUST use the "band" property to explicitly declare its band AND frequency range (e.g., "Lows/Sub (20Hz - 150Hz)", "Mids (150Hz - 2.5kHz)", "Highs (2.5kHz+)"). It is CRITICAL that you do not omit the "band" property for any plugin, otherwise they will be incorrectly grouped as 'General / Pre-Split'.
4. Multi-band processing MUST use different settings per frequency band. Do not give the same settings to the Lows as you do the Highs.
5. You may also include a few "General / Pre-Split" plugins for volume levelling BEFORE the multi-band split, but you MUST follow them up with the band-specific plugins.
` : '';
};

export const getXpandInstructions = (xpandPresets?: XpandPreset[]): string => {
  const presetsToUse = (xpandPresets && xpandPresets.length > 0) ? xpandPresets : DEFAULT_OWNED_XPAND_PRESETS;
  
  if (!presetsToUse || presetsToUse.length === 0) {
    return "";
  }
  const owned = presetsToUse.filter(p => p.is_owned);
  if (owned.length === 0) {
    return `
      XPAND!2 CONSTRAINT:
      The user owns ZERO presets in Xpand!2. DO NOT suggest, recommend, or mention Xpand!2 or any of its presets in any recipes, instructions, instrument tracks, or guides under any circumstances. Suggest other VSTs instead.
    `;
  }
  
  const grouped: Record<string, string[]> = {};
  owned.forEach(p => {
    if (!grouped[p.category]) {
      grouped[p.category] = [];
    }
    grouped[p.category].push(p.preset_name);
  });
  
  let formatted = `
    XPAND!2 OWNED PRESETS CONSTRAINT:
    The user owns Xpand!2 but ONLY owns the specific presets listed below. 
    CRITICAL: You are STRICTLY FORBIDDEN from recommending or suggesting any Xpand!2 preset that is NOT in this list. 
    If you recommend Xpand!2 for a sound (pad, bass, lead, bell, etc.), you MUST select a preset from the categories/presets below, and specify the exact preset name and category in your settings.
    If none of the owned presets below fit the vibe, DO NOT suggest Xpand!2. Use other synth plugins instead.
    
    Owned Xpand!2 Presets:
  `;
  
  Object.entries(grouped).forEach(([category, presets]) => {
    formatted += `    - Category "${category}": ${presets.map(p => `"${p}"`).join(", ")}n`;
  });
  
  formatted += `
    XPAND!2 SMART KNOB PARAMETER RULES:
    When giving parameter adjustments for Xpand!2, you MUST format the Smart Knob values correctly.
    The 6 Smart Knobs dynamically map to different parameters depending on the selected preset. While they often map to (Attack, Decay, Release, Cutoff, Env Depth, Fine Tune), they may also map to other synthesis parameters like FM Level, Vibrato, Wah, Filter Q, etc. Use the appropriate parameter name for the specific preset if you know it, otherwise use the standard 6.
    The values can include negative numbers (e.g., -50, +30) depending on the specific parameter and how it scales. Use appropriate values as seen in the plugin.

    XPAND!2 FX1 AND FX2 ALGORITHM SELECTOR & PARAMETERS:
    Xpand!2 has two independent global FX processors (FX1 and FX2). Each algorithm has EXACTLY TWO parameter knobs. When recommending effects for Xpand!2 instrument parts, you MUST choose from the exact algorithms listed below and suggest values ONLY for its exact two parameters:
    
    1. REVERBS (Each has exactly 2 knobs):
       - "hall", "soft hall", "bright hall", "dense hall":
         - Knob 1: "size" (decay length in seconds, range: 0.4 sec to 30.0 sec)
         - Knob 2: "shape" (reflection density/envelope, range: 0% to 100%)
       - "predelay hall":
         - Knob 1: "size" (decay length in seconds, range: 0.4 sec to 30.0 sec)
         - Knob 2: "pre del" (pre-delay time, range: 0 ms to 250 ms)
       - "room", "soft room", "bright room", "dense room":
         - Knob 1: "size" (decay length in seconds, range: 0.1 sec to 5.0 sec)
         - Knob 2: "shape" (reflection density/envelope, range: 0% to 100%)
       - "predelay room":
         - Knob 1: "size" (decay length in seconds, range: 0.1 sec to 5.0 sec)
         - Knob 2: "pre del" (pre-delay time, range: 0 ms to 250 ms)
       - "plate", "soft plate", "bright plate", "dense plate":
         - Knob 1: "size" (decay length in seconds, range: 0.4 sec to 10.0 sec)
         - Knob 2: "shape" (reflection density/envelope, range: 0% to 100%)
       - "predelay plate":
         - Knob 1: "size" (decay length in seconds, range: 0.4 sec to 10.0 sec)
         - Knob 2: "pre del" (pre-delay time, range: 0 ms to 250 ms)
       - "cho+rev", "cho+rev soft", "cho+rev bright":
         - Knob 1: "size" (decay length in seconds, range: 0.4 sec to 30.0 sec)
         - Knob 2: "shape" (chorus rate and high cut shape, range: 0% to 100%)
       - "non-linear":
         - Knob 1: "time" (cutoff duration in milliseconds, range: 10 ms to 500 ms)
         - Knob 2: "shape" (gate envelope shape, range: 0% to 100%)
       - "reverse reverb":
         - Knob 1: "time" (swell curve duration in seconds, range: 0.1 sec to 5.0 sec)
         - Knob 2: "shape" (reversal curve shape, range: 0% to 100%)
       - "early reflections":
         - Knob 1: "time" (envelope duration in seconds, range: 0.05 sec to 2.0 sec)
         - Knob 2: "shape" (reflection density shape, range: 0% to 100%)
       - "drum room", "club", "overheads", "stadium", "flapper", "close":
         - Knob 1: "size" (room size/decay in seconds, range: 0.1 sec to 30.0 sec)
         - Knob 2: "shape" (room reflections/absorption shape, range: 0% to 100%)
       - "resonators":
         - Knob 1: "decay" (ringing decay multiplier, range: 0% to 100%)
         - Knob 2: "shape" (resonance comb-filter shape, range: 0% to 100%)

    2. DELAYS (Each has exactly 2 knobs):
       - "delay", "lofi delay", "stereo delay", "lofi stereo delay", "pingpong", "lofi pingpong", "gallop echo", "tape echo", "ducking delay", "cloud delay", "chaos delay":
         - Knob 1: "delay" (tempo-synced note division: e.g., 1/4, 1/8, 1/16, 1/8D, 1/4T)
         - Knob 2: "fbk" (feedback percentage, range: 0% to 100%)

    3. MODULATION (Each has exactly 2 knobs):
       - "chorus", "rich chorus", "ensemble", "space chorus", "quad chorus", "voice mod", "phase", "bi-phase", "deep phaser":
         - Knob 1: "rate" (modulation speed in Hertz, range: 0.10 Hz to 10.00 Hz)
         - Knob 2: "depth" (modulation intensity percentage, range: 0% to 100%)
       - "flanger":
         - Knob 1: "rate" (comb-filter speed in Hertz, range: 0.10 Hz to 10.00 Hz)
         - Knob 2: "fbk" (resonant feedback percentage, range: -100% to 100%)

    4. OTHER (Each has exactly 2 knobs):
       - "detune":
         - Knob 1: "detune" (micro-pitch offset in cents, range: -50 cents to +50 cents)
         - Knob 2: "delay" (stereo delay offset in milliseconds, range: 0.1 ms to 100.0 ms)
       - "pitch shift":
         - Knob 1: "pitch" (semitone shifting, range: -12 semi to +12 semi)
         - Knob 2: "fine" (fine-tuning pitch offset in cents, range: -50 cents to +50 cents)

    CRITICAL RECO_FLOW REQUIREMENT:
    When you suggest FX1 or FX2, specify the exact algorithm name from the list above. Then, provide the exact parameter names (e.g., Knob 1: size, Knob 2: shape) and their precise values using the correct unit (sec, ms, %, cents, Hz, semitones, note division) based strictly on the rules above. NEVER suggest unlisted parameters like pre-delay, high cut, or mix for algorithms that do not support them.
  `;

  return formatted;
};

const getEliteProducerSecretsPrompt = (installedJsfxPacks: string[]) => `

      ==================================================
      🏆 ELITE PRODUCER SECRETS & DYNAMIC JSFX AUTOMATION 🏆
      When designing recipes, channel the advanced techniques of top-tier producers.

      1. **Daft Punk / French House Pumping (Sidechain Compression)**:
         - **MANDATORY FOR SIDECHAIN**: If the recipe involves "pumping" pads, synths, or samples (French House style), you MUST use 'JS: Transient-Driven Auto-Pan (Transmitter)' on the kick track to send control signals (e.g. to reg00), and 'JS: Transient-Driven Auto-Pan (Receiver)' on the synth/pad track receiving that signal to aggressively duck the volume. 
         - Alternatively, use 'JS: Auto Expander [Stillwell]' or 'JS: Major Tom Compressor [Stillwell]' with the "Detector Input" slider set to "Sidechain" (value 1.0) for aggressive 4-on-the-floor ducking. Make sure to describe the routing in the explanation.

      2. **Mike Dean Synth/Bass Mastery (Analog Moog & Distortion)**:
         - Use 'JS: Moog 4-Pole Filter [Liteon]' with heavy "Drive (%)" (e.g., 20-50%) and aggressive "Resonance" for thick, analog synth sweeps.
         - For sub-basses and 808s, use 'JS: Huge Booty Bass Enhancer [Stillwell]' or 'JS: Bass Manager/Booster [Liteon]' to add rich lower harmonics and drive.
         - Widen lead synths massively using 'JS: Ozzifier Chorus [Stillwell]' or 'JS: Pseudo-Stereo [Liteon]'.

      3. **Kanye-style Lo-Fi & Vocal/Sample Mangling**:
         - For aggressive sample chopping, bitcrushing, and "broken" artifacts, use 'JS: Paranoia Mangler [remaincalm.org]' (set "Bitcrusher", "Thermonuclear War", and "Attitude" to aggressive values) or 'JS: Avocado Ducking Glitch Generator [remaincalm.org]' for stuttering/glitching samples.
         - For tape-echo delay that pitches and wavers, use 'JS: Floaty (Modulated Delay) [remaincalm.org]' with high "Warp Amount".
         - Use 'JS: Bad Buss Mojo Waveshaper [Stillwell]' or 'JS: Non-Linear Processor [Liteon]' for raw, analog clipping on drum buses or aggressive vocals.

      4. **Chris Lord-Alge (CLA) - Punchy In-Your-Face Rock/Pop Drums & Vocals**:
         - Use heavy 1176-style compression on vocals and drums (e.g. 'JS: 1175 Compressor' or 'Tukan NC76'). Use fast attack and fast release for explosive transients.
         - Aggressive high-shelf EQ boosts using SSL-style EQs like 'JS: RBJ 1073 EQ [Stillwell]' or 'Tukan SumChannel'.

      5. **Serban Ghenea - Clean, Wide, and Modern Pop/Hip-Hop**:
         - Surgical subtractive EQing using 'JS: ReJJ/ReEQ' to carve out muddiness (200-400Hz) while leaving highs pristine and airy.
         - Keep the low-end perfectly phase-aligned and punchy by avoiding excessive spatial effects on the kick/bass. Use 'JS: Stereo Field Manipulator [LOSER]' to strictly center the low frequencies.

      6. **Jaycen Joshua - Saturated & Warm R&B/Hip-Hop**:
         - Saturation and harmonic excitement on vocal and instrument buses to help them cut through dense mixes. Use 'JS: Saturation [LOSER]' or 'JS: Louderizer [Stillwell]' on auxiliary buses.
         - Thick, parallel compression techniques using 'JS: Digital Drum Compressor (DDC) [LOSER]' or 'Tukan Dis-Treasure' blended with the dry signal.

      7. **Manny Marroquin - Depth and Dimensionality**:
         - Multiple cascading delays and reverbs. Use 'JS: Delay w/Chorus' or 'Tukan Lexikan' followed by 'JS: MGA JS Limiter' to control the tail dynamics.
         - Harmonize delays using 'JS: Pitch Down-Shifter' or 'JS: Ozzifier Chorus [Stillwell]' on the delay returns.

      8. **Dave Pensado - Color and Character EQ**:
         - Combine multiple EQs for color. Boost lows with a Pultec emulation ('Tukan EQT-1A') and use 'JS: RBJ 4-Band Semi-Parametric EQ [Stillwell]' for midrange character.
         - Aggressive de-essing using 'JS: De-esser [Liteon]' before hitting compressors so high frequencies don't trigger unnatural pumping.

      9. **Skrillex / Thomas Bangalter - Max Loudness & Brightness (Electro House)**:
         - Extreme clipping and limiting using 'JS: Event Horizon Clipper [Stillwell]' and 'JS: MGA JS Limiter' for that crushed, in-your-face loudness on the master or drum buses.
         - Bright, airy top end using 'JS: Exciter (Treble Enhancer) [Stillwell]' or 'JS: Exciter [LOSER]' to sizzle the highs.

      10. **Rick Rubin - Spatial Depth and Distinct Delays**:
         - Pinpoint slap delays using 'JS: Delay (Lo-Fi)' and 'JS: Delay w/Stereo Bounce' to create tight spatial environments for vocals without washing them out in reverb.
         - Thickening guitars by routing to hard-panned pitch shifters like 'JS: Pitch Shifter 2' with slight offset (e.g., +/- 9 cents).

      11. **Noah "40" Shebib - Submerged Underwater Drake-style Pads/Vocals**:
         - Low-pass filters combined with bit reduction. Use 'JS: Apple 12-Pole Filter' with an aggressive LP cutoff (e.g., 800-2000Hz) paired with 'JS: Bit Reduction/Dither w/Noise Shaping' (set to 8-12 bit).
         - Analog warmth and smear using 'JS: Chorus with Improved Shaping [Stillwell]'.

      12. **Illangelo - Spacy and Ethereal Weeknd-Style R&B**:
         - Heavily modulated vocal reverbs and delays. Send vocals to 'Tukan Lexikan' followed by 'JS: Flange Baby [Stillwell]' or 'JS: 4-Tap Phaser' to make the tails swirl.
         - Deep subs using 'JS: Thunderkick' to synthesize low end below existing kicks or basses.
         
      13. **Mick Guzauski - Intense Radio-Ready Rock Vocals**:
         - Parallel distortion using 'JS: Distortion (Fuzz)' or 'JS: Waveshaping Distortion [LOSER]' mixed in very subtly underneath the clean vocal to add grit and presence.
         - Super aggressive peak limiting using 'JS: NP1136 Peak Limiter [Liteon]' catching just the loudest words.

      14. **Deadmau5 - Snappy, Transient-Heavy Bass Music**:
         - Punchy transients using 'JS: Transient Controller [LOSER]' or 'JS: Transient Killer [LOSER]' to heavily emphasize the attack on synths and drums.
         - Stereo manipulation of mid-basses using 'JS: Stereo Width [Stillwell]' to keep sub frequencies mono but aggressively widen the harmonics.


      15. **Indie Guitar Rap Beats (Mac Miller / Dominic Fike style)**:
         - Warped, Lo-Fi Guitars: Use 'JClones AC2 (Tape Emulator)' combined with 'JS: Floaty (Modulated Delay) [remaincalm.org]' to add heavy wow and flutter, making the guitar feel sampled from an old vinyl or cassette.
         - Creamy, Vintage Dynamics: Smooth out the transients using optical compression like 'JClones CA2A (Optical Compressor)' or slow attack tube compression like 'JClones RS124 (Vintage Tube Compressor)'.
         - Warm, Analog EQ: Use 'JS: RBJ 1073 EQ [Stillwell]' to aggressively roll off harsh digital high frequencies above 10kHz and boost warm lower-mids (300-500Hz) for that nostalgic, thick indie tone.


      16. **Travis Scott / Mike Dean - Psychedelic Vocal Delays & Distortions**:
         - Automate delay feedback using 'JS: Delay (Lo-Fi)' on certain phrases, pushing it into self-oscillation for transitions.
         - Heavily overdrive vocal ad-libs using 'JS: Distortion (Fuzz)' or 'JClones Molot (Vintage Compressor)' with alpha mode and high drive for that gritty, distorted aesthetic.

      17. **Kendrick Lamar - Close, Aggressive & Intimate Vocals (Ali style)**:
         - Hyper-compressed, in-your-face vocals using fast attack and fast release 1176 style compression ('Tukan NC76 / NC76B').
         - Dynamic EQ using parameter modulation to duck lower-mids (around 200-400Hz) on the vocal bus only when the vocal gets too loud or boxy, keeping it thick but not muddy.

      18. **Drake / 40 - Underwater, Filtered Vocal Sweeps**:
         - Automate the cutoff frequency of a low-pass filter like 'JS: Moog 4-Pole Filter [Liteon]' on the vocal bus during intros or bridges to create the signature "underwater" muffled vocal effect, opening it up right when the beat drops.
         - Wide, detuned vocal doubling using 'JS: Pitch Shifter 2' with slight micro-shifting (-5 cents left, +5 cents right).

      19. **Playboi Carti / Ken Carson - Rage/Opium Hyperpop Vocals**:
         - Extreme high-end boost for "airy" and piercing vocals using 'Tukan EQT-1A' (Pultec EQ) boosting heavily at 10kHz-12kHz.
         - Aggressive, synthetic autotune (implied, but supported by super tight, fast-acting de-essing using 'Tukan Deesser' so the high boost doesn't rip the listener's ears off).

      20. **J. Cole / Juro "Mez" Davis - Dynamic, Natural & Warm Rap Vocals**:
         - Serial compression: Use a fast compressor ('Tukan NC76') to catch the peaks (just 2-3dB of reduction), followed by a slower, optical compressor ('JClones CA2A') for gentle leveling (another 2-3dB).
         - Smooth tape saturation using 'JClones AC2 (Tape Emulator)' (15 IPS) to round out the harsh digital transients and add analog warmth.

      21. **Future / Seth Firkins - Modulated & Washy Trap Vocals**:
         - Intense flanging and chorus on background vocals using 'JS: Flange Baby [Stillwell]' to give them a robotic, pill-induced wobble.
         - Drench the ad-libs in a long, modulated reverb like 'Tukan Lexikan 2' (Hall algorithm, 3s+ decay).

      22. **Eminem / Dr. Dre - Crisp, Percussive, Staccato Vocals**:
         - Hyper-precise gating on the vocal to remove all breaths and room noise between rapid-fire syllables, using 'JS: Downward Expander' or 'JS: Noise Gate'.
         - Sharp high-mid boost (2-4kHz) using 'JS: RBJ 4-Band Semi-Parametric EQ [Stillwell]' to emphasize consonants and enunciation.

      23. **Pop Smoke / 50 Cent - Thick, Dominating New York Drill Vocals**:
         - Massive parallel compression using the "All-Button" mode on 'Tukan NC76' mixed underneath the lead vocal to make the voice sound impossibly thick and aggressive.
         - Low-end vocal enhancement using 'JS: RBJ 1073 EQ [Stillwell]' to boost 100-200Hz to add chest resonance to the rapper's voice.

      24. **Tyler, The Creator - Pitch-Shifted & Demonic Alter-Ego Vocals**:
         - Automate 'JS: Pitch Down-Shifter' to instantly drop the vocal by exactly 12 semitones (1 octave) for specific phrases or verses to create a "demonic" or alter-ego character.
         - Pair the pitched-down vocal with 'JS: Bad Buss Mojo Waveshaper [Stillwell]' to add gross, gritty distortion to the low-pitched voice.

      25. **Metro Boomin / 21 Savage - Dark, Eerie & Spacious Ad-libs**:
         - Use a "throw delay" technique. Automate the send level to a 'JS: Delay (Tempo Ping-Pong)' to instantly blast only the last word of a bar into a wide, echoing void.
         - Put a high-pass filter ('JS: RBJ Highpass/Lowpass Filters') AFTER the delay on the return track to make the echoes sound distant and "telephone-like."

      26. **Timbaland - Syncopated, Stuttering Rhythmic Delays**:
         - Use 'JS: Delay (Tempo Sync)' with odd divisions (like 3/16 or dotted 1/8) on ad-libs or percs to create complex, bouncing rhythms.
         - Pair with 'JS: Auto Expander [Stillwell]' to aggressively gate the echoes so they don't muddy the mix, making the rhythm stop on a dime.

      27. **Pharrell / The Neptunes - Dry, Funky, and Upfront Vocals**:
         - Keep vocals extremely dry with zero reverb. Use a micro-shift or tiny slapback delay like 'JS: Delay (Chorus)' with very low feedback.
         - Boost 3-5kHz using 'Tukan EQT-1A' for that signature "in your face" upfront snap and intelligibility.

      28. **Lil Uzi Vert / DJ Drama - Bright, Cassette-Driven Mixtape Vocals**:
         - Replicate the DatPiff era mixtape sound using 'JClones AC2 (Tape Emulator)' with 7.5 IPS setting and heavy saturation.
         - Use 'JS: 3-Band EQ' to push the highs hard while the tape emulator smooths out the harshness.

      29. **Mac Miller (Swimming Era) - Warm, Jazz-Inflected Vocal Presence**:
         - Soft-knee, low-ratio compression using 'JClones Molot (Vintage Compressor)' in "Alpha" mode to gently squeeze the vocal like a warm hug.
         - Use 'JS: RBJ 1073 EQ [Stillwell]' to roll off the extreme highs, emphasizing the smooth, natural mid-range tone.

      30. **Rick Ross / J.U.S.T.I.C.E. League - Luxurious, Expensive, Orchestral Presence**:
         - Wide, Lexicon-style hall reverbs. Send the vocal heavily to 'Tukan Lexikan' or 'Tukan Lexikan 2' with a 2.5s decay time and a long pre-delay (60ms) to separate the vocal from the tail.
         - Saturation on the master bus using 'JClones OInflator (Oxford Inflator)' to make everything sound huge and expensive without clipping.

      31. **Juice WRLD / Nick Mira - Emo Rap Heartbreak Vocals**:
         - Auto-tune style (assumed) mixed with heavy, washing reverb ('Tukan Lexikan') and an immediate 'JS: Delay w/Chorus' to make the vocal sound lonely and wide.
         - De-ess aggressively using 'Tukan Deesser' before the reverb, so the 'S' sounds don't splash into a harsh, bright tail.

      32. **A$AP Rocky / Hector Delgado - Chopped and Screwed / Houston Influences**:
         - Formant-shifted and down-pitched vocal layers using 'JS: Pitch Down-Shifter' blended beneath the main vocal for a demonic or sluggish, syrupy texture.
         - Heavy low-end filtering on these pitched-down vocals using 'JS: RBJ Highpass/Lowpass Filters' to keep them from clashing with the 808.

      33. **Young Thug / Alex Tumay - Chaotic, Multi-Layered Ad-Lib Ecosystem**:
         - Separate effects chains for every ad-lib track. One with a telephone filter ('JS: Apple 12-Pole Filter' bandpass), one with heavy 'JS: Distortion (Fuzz)', and one drowning in 'Tukan Lexikan 2'.
         - Rapid volume automation (which you can simulate by parameter modulating a 'JS: Volume/Pan Smoother') to duck ad-libs under the lead vocal instantly.

      34. **J Dilla - Unquantized, Dusty Boom-Bap Groove Textures**:
         - Use 'JS: Paranoia Mangler [remaincalm.org]' on drum loops or drum buses to add 12-bit crunch and sampler aliasing.
         - Aggressive compression on the drum bus using 'JS: Digital Drum Compressor (DDC) [LOSER]' to make the kick and snare glue together and pump the whole groove.

      35. **XXXTentacion / Ronny J - Distorted, Blown-Out Soundcloud Bass**:
         - Purposeful digital clipping. Drive the 808s and even the vocals into 'JS: Event Horizon Clipper [Stillwell]' until they square off and distort.
         - Use 'JS: Waveshaping Distortion [LOSER]' on the master or vocal bus to add a layer of frying, chaotic high-end distortion.

      36. **Kanye West (Yeezus Era) - Industrial, Aggressive Saturation**:
         - Use 'JS: Bad Buss Mojo Waveshaper [Stillwell]' on the vocal bus with aggressive settings to emulate the raw, screaming distortion found on tracks like "Black Skinhead".
         - Parallel compression using 'Tukan NC76' smashed, blending it back in to give the vocal a gritty, forward edge without losing all dynamics.

      37. **T-Pain - The Original Hard-Tune Telephone Effect**:
         - Create a narrow bandpass filter using 'JS: RBJ Highpass/Lowpass Filters' (cutting below 400Hz and above 4kHz) to emulate the "telephone" eq curve.
         - Run the hard-tuned vocal through 'JClones Molot (Vintage Compressor)' in "Sigma" mode to violently compress the mid-range.

      38. **Snoop Dogg / Dr. Dre (The Chronic) - Smooth G-Funk Double Tracking**:
         - Extremely tight vocal doubling panned hard left and right (L100, R100), lightly compressed using 'JClones CA2A (Optical Compressor)'.
         - Subtle slapback delay 'JS: Delay (Chorus)' set to roughly 60-80ms with 0% feedback to widen the presence of the mono lead vocal.

      39. **Trippie Redd - Screamo/Rock Rap Hybrid Vocals**:
         - Automate 'JS: Distortion (Fuzz)' to only activate when the vocal delivery transitions from melodic singing to screaming.
         - Use a wide, detuned flanger 'JS: Flange Baby [Stillwell]' subtly mixed in to give the screams a phasing, chaotic metallic ring.

      40. **Busta Rhymes - Lightning Fast, Transient-Snapped Delivery**:
         - Emphasize vocal transients using 'JS: Transient Controller [LOSER]', boosting the attack significantly so every rapid-fire syllable cuts through the mix.
         - Use 'JS: 1175 Compressor' with a very fast attack and release to keep the dynamic range pinned so words aren't lost.

      41. **Don Toliver - Airy, Modulated R&B Trap Vocals**:
         - Generous use of 'Tukan Lexikan 2' reverb with a bright damping setting to make the vocal tail shimmer in the high frequencies.
         - Micro-pitch shifting using 'JS: Pitch Shifter 2' with slight modulation to give the vocal a synth-like, floating quality.

      42. **Gunna - Sleek, "Slime" Slippery Ad-libs**:
         - Very fast tempo-synced delays using 'JS: Delay (Tempo Ping-Pong)' set to 1/8T (triplets), with a low-pass filter on the delay return.
         - "Ducking" delay effect: use Parameter Modulation so the delay feedback/volume is ducked by the lead vocal, so the echoes only swell in the gaps.

      43. **Isaiah Rashad - Lo-Fi, Muffled Southern Rap Intimacy**:
         - Roll off the extreme highs and extreme lows using 'JS: 3-Band EQ' to give the vocal a confined, "recorded in a bedroom" lo-fi vibe.
         - Apply 'JClones AC2 (Tape Emulator)' with high wow and flutter to slightly detune the vocal randomly, enhancing the lazy, laid-back delivery.

      44. **Kid Cudi - Sweeping, Cosmic Hum and Chorus**:
         - Envelop the humming and melodic ad-libs in 'JS: Ozzifier Chorus [Stillwell]' to create a wide, multi-layered chorus effect.
         - Add a long 'Tukan Lexikan' reverb tail and use 'JS: RBJ 1073 EQ [Stillwell]' to aggressively boost 5-8kHz on the reverb return, making it sparkle.

      45. **Frank Ocean (Blonde Era) - Formant-Mangled Pitch Shifting**:
         - Use 'JS: Pitch Down-Shifter' but automate the pitch and formant so the voice seamlessly transitions from a chipmunk high-pitch to a deep, masculine baritone.
         - Pair with 'JS: Floaty (Modulated Delay) [remaincalm.org]' to make the pitch-shifted voice wobble in pitch slightly, imitating a broken VHS tape.

      46. **Earl Sweatshirt / Alchemist - Grimy, Monotone Spoken-Word Vocals**:
         - Heavy reliance on 'JClones RS124 (Vintage Tube Compressor)' for thick, sludgy compression that brings out the mouth noises and breath.
         - Roll off highs with 'JS: 3-Band EQ' and add vinyl crackle/noise using 'JS: Paranoia Mangler [remaincalm.org]' to sink the vocal into the beat.

      47. **Outkast / Mr. DJ - Vintage Tape Flanging & Phaser Effects**:
         - Frequent use of 'JS: 4-Tap Phaser' on hooks and bridges to give the vocals a psychedelic, Southern-fried funk swirl.
         - Widen the hooks by duplicating the vocal and delaying one side by 15-20ms using 'JS: Delay (Chorus)' (Haas effect).

      48. **2Pac / Dr. Dre - The Makaveli Double/Triple Stack**:
         - Three vocal layers (Lead centered, Overdub 1 panned L40, Overdub 2 panned R40) all routed to a single bus.
         - Glue them together using 'Tukan NC76' and add a very short room reverb ('Tukan Lexikan 2') to make them sound like a mob shouting in a tight room.

      49. **Lil Peep / Smokeasac - Blown out, Over-compressed Emo Rap Vocals**:
         - Extreme compression using 'JS: 1175 Compressor' with the input driven hard until the vocal starts to clip and pump.
         - Wash the vocal in 'JS: Delay (Ping Pong)' feeding into a huge 'Tukan Lexikan' hall reverb, rolling off the lows on the reverb return.

      50. **Bone Thugs-n-Harmony - Rapid-Fire Melodic Harmonies**:
         - 4 to 6 part harmonies, heavily de-essed using 'Tukan Deesser' so the rapid "S" and "T" sounds don't overlap into a harsh hiss.
         - Pan the harmonies widely and use 'JS: Ozzifier Chorus [Stillwell]' to blend the voices into a single, choir-like synth texture.

      51. **MF DOOM - Villainous, Muddy, Masked Vocals**:
         - Low-mid heavy EQ. Boost 250Hz using 'JS: RBJ 1073 EQ [Stillwell]' to emphasize the chest voice and "muddiness" of the delivery.
         - Apply 'JClones AC2 (Tape Emulator)' with a low IPS setting (7.5) to roll off the high-end clarity and add tape hiss.

      52. **Yeat - Alien / Bell-Heavy Hyper Trap Ad-libs**:
         - Extreme autotune (implied) layered with 'JS: Pitch Shifter 2' pitching the ad-libs up a full octave (+12 semitones) mixed with the lead.
         - Heavy saturation using 'JClones OInflator (Oxford Inflator)' to make the ad-libs cut through the massive 808s and bells.

      53. **JID - Dynamic, Panning Stutter Flows**:
         - Automate 'JS: Auto-Pan [LOSER]' to rhythmically throw the ends of rapid-fire phrases left and right, emphasizing the dizzying flow.
         - Use a very fast compressor 'JClones Molot (Vintage Compressor)' in Sigma mode to clamp down on the lightning-fast transient spikes.

      54. **Nas / Illmatic Era - Classic NY Boom Bap Grit**:
         - Use 'JS: Digital Drum Compressor (DDC) [LOSER]' heavily on the drum bus to make the sampled drums pump, and 'JClones CA2A (Optical Compressor)' on the vocal to let the transients breathe.
         - High-pass the vocal at 80Hz and leave the high-end relatively flat, letting the raw mic signal stand out against the dusty samples.

      55. **DaBaby - In-Your-Face, Zero Reverb Dry Punch**:
         - Absolute zero reverb or delay. The vocal must be bone dry.
         - Boost the presence frequencies (2-4kHz) using 'Tukan EQT-1A' and use 'JS: Event Horizon Clipper [Stillwell]' to shave off the absolute highest peaks, maximizing the vocal loudness.

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


      66. **J Dilla - Unquantized, Swung Hip-Hop Grooves**:
         - Automate the 'Delay' parameter in 'JS: Time Adjustment Delay' by a few milliseconds positively and negatively via a slow, random LFO (Parameter Modulation) to create a humanized, pushing-and-pulling feel on hi-hats.
         - Automate 'JS: RBJ Highpass/Lowpass Filters' 'Lowpass' cutoff on the master bus during the intro to simulate a dusty record un-muffling into full fidelity.

      67. **Charlie Puth - Pop Perfect, Surgical Vocal Stacks**:
         - Automate the 'Threshold' of 'Tukan Deesser' independently for the lead and the backing harmonies, ensuring the lead 'S' sounds cut through while the harmonies are aggressively ducked.
         - Use 'JS: Volume/Pan Smoother' and automate the 'Pan' parameter using a Sine LFO (linked to project tempo) on synthesizer pads to create wide, sweeping motion behind the vocals.

      68. **Skrillex - Aggressive EDM Vocal Chops (Bangarang Era)**:
         - Automate the 'Pitch' and 'Formant' parameters in 'JS: Pitch Down-Shifter' step-by-step to jump between wildly different pitches for every single syllable of a vocal chop.
         - Automate the 'Wet' parameter on 'Tukan Lexikan 2' to spike to 100% exactly on the last note of a vocal chop sequence, sending the tail into a massive cavern.

      69. **Tame Impala - Psychedelic Tape Flanging & Phasing**:
         - Send the entire drum bus through 'JS: 4-Tap Phaser'. Automate the 'Frequency' and 'Feedback' via an LFO to create the iconic sweeping 'swoosh' over the entire drum kit.
         - Automate the 'Drive' on 'JClones OInflator (Oxford Inflator)' on the bass guitar to push into heavy distortion only during the chorus for a massive wall of sound.

      70. **Rosalía - Flamenco/Reggaeton Hybrid Sub Basses**:
         - Automate 'JS: Sub-Bass Synthesizer' 'Mix' parameter to swell up right before the kick hits, creating a sucking/vacuum effect before the transient punch.
         - Automate the 'Stereo Width' slider on 'JS: Stereo Width [Stillwell]' to narrow to 0% (mono) during the verses, and instantly widen to 150% when the chorus hits.

      71. **A Rocky - Houston Chopped & Screwed Bridges**:
         - Automate 'JS: Pitch Shifter 2' 'Shift' slider down to -5 or -7 semitones to simulate the turntable being drastically slowed down.
         - Concurrently, automate the 'Rate' of a 'JS: Tremolo' to chop the slowed-down vocal in a rhythmic triplet pattern.

      72. **Flume - Granular, Metallic Synth Warps**:
         - Automate 'JS: Ring Modulator' 'Frequency' parameter using a random LFO to create bubbling, metallic, and unpredictable ringing on synth chords.
         - Automate 'JS: Noise Gate' 'Threshold' linked to a rapid 1/16th note hi-hat sidechain to aggressively stutter the synth chords.

      73. **Billie Eilish - Intimate, ASMR-style Whispers**:
         - Automate the 'Volume' slider on 'JS: Volume/Pan Smoother' to ride the vocal levels perfectly, boosting syllables that trail off so every breath is audible.
         - Automate 'Tukan EQT-1A' 'High Boost' at 10kHz+ to dynamically increase the 'air' frequencies during quiet whisper passages, and lower it when she sings louder to avoid harshness.

      74. **Playboi Carti - Distorted, Abrasive Rage Beats**:
         - Automate the 'Distortion' parameter of 'JS: Waveshaping Distortion [LOSER]' on the 808 bass, pushing the distortion even harder at the end of every 4-bar loop.
         - Automate 'JS: Delay (Chorus)' 'Delay' time randomly to create micro-glitches and chaotic stereo widening on the lead synth.

      75. **The Weeknd (Dawn FM) - Cinematic, 80s Synthwave Transitions**:
         - Automate 'JS: Moog 4-Pole Filter [Liteon]' 'Cutoff' and 'Resonance' to perform dramatic, 8-bar long frequency sweeps leading up to a massive chorus.
         - Automate 'Tukan Lexikan' 'Decay Time' from a short 1 second slap to a massive 10 second hall precisely on the last snare hit of the song.

      76. **Metro Boomin - The Creepy Detuned Music Box**:
         - Automate 'JS: Floaty (Modulated Delay) [remaincalm.org]' 'Warp Amount' parameter via an LFO to constantly modulate the pitch of a piano or bell, making it sound out-of-tune and eerie.
         - Automate 'JS: 3-Band EQ' 'High' gain to slowly fade out during the verse, pushing the melody into the background.

      77. **SZA / Carter Lang - Lush, Dreamy R&B Guitars**:
         - Use 'JS: Ozzifier Chorus [Stillwell]' on the guitar track and automate the 'Voices' parameter, switching from a subtle 2 voices in the verse to a thick 4 voices in the chorus.
         - Automate the 'Delay' parameter of a 'JS: Delay (Chorus)' on the vocal bus, sending a wash of delay only on the last words of emotional phrases.

      78. **Timbaland - Beatboxing & Mouth Percussion Transients**:
         - Automate 'JS: Transient Controller [LOSER]' 'Attack' to extreme levels (+10dB or more) on beatboxed kicks and snares to make them hit like real drum samples.
         - Automate 'JS: Auto-Pan [LOSER]' 'Rate' to create rapid panning on mouth-shaker sounds, making them flutter in the stereo field.

      79. **Dr. Dre - The Infamous G-Funk Synth Glide**:
         - Automate 'JS: Moog 4-Pole Filter [Liteon]' 'Resonance' and 'Cutoff' on a high-pitched sine wave lead to make the synth scream during specific bends.
         - Automate 'JS: Volume/Pan Smoother' 'Volume' parameter with a slow fade-in on the synth lead so it creeps into the mix before hitting full volume.

      80. **Noah '40' Shebib - The Muffled Drake Piano**:
         - Automate 'JS: RBJ Highpass/Lowpass Filters' 'Lowpass' cutoff down to 400Hz to completely submerge the piano in a muddy, underwater texture.
         - Automate 'JS: Bit Reduction/Dither' 'Bit Depth' down to 10 or 12 bits on the drum bus to add a layer of lo-fi crunch beneath the pristine vocals.

      81. **Kendrick Lamar (DAMN. Era) - Reversing & Backmasking**:
         - Automate 'JS: Delay (Tempo Ping-Pong)' 'Feedback' to self-oscillate right before a beat drop, while simultaneously using a reverse vocal effect (pre-rendered) to lead into it.
         - Automate 'JS: Distortion (Fuzz)' 'Amount' on the master bus during aggressive transitions, creating a jarring, momentary wall of noise.

      82. **Pharrell Williams - The Four-Count Intro Chops**:
         - Automate 'JS: Noise Gate' 'Threshold' to aggressively chop the first four beats of a song, creating the signature Neptunes stutter effect.
         - Automate 'Tukan EQT-1A' 'High Boost' on the lead vocal to add extra snap and air during the catchy hook, then dial it back during the verses.

      83. **Eminem / Luis Resto - Cinematic, Ominous String Sections**:
         - Automate 'JS: Stereo Width [Stillwell]' 'Width' parameter on the string bus, slowly widening from 50% to 150% as the song builds tension.
         - Automate 'Tukan Lexikan 2' 'Decay Time' to create a massive, 5-second reverb tail that rings out when the beat suddenly drops out for a punchline.

      84. **Post Malone / Louis Bell - The Vibrato Autotune Tail**:
         - Automate 'JS: Floaty (Modulated Delay) [remaincalm.org]' 'Modulation' depth to increase only on long, sustained vocal notes, adding a highly synthetic vibrato effect.
         - Automate 'JClones Molot (Vintage Compressor)' 'Threshold' to squeeze the vocal harder during the loud, belted choruses to keep it glued to the beat.

      85. **J. Cole - The Warm Vintage Soul Sample Flip**:
         - Automate 'JClones AC2 (Tape Emulator)' 'Saturation' and 'Wow & Flutter' on the sample bus, increasing the vintage artifacts as the beat plays out.
         - Automate 'JS: RBJ 1073 EQ [Stillwell]' 'Mid Freq' and 'Mid Gain' to boost the crackle and vinyl noise during the intro and outro of the track.

      86. **Sylvia Massy - Exploding Parallel Tube Saturation**:
         - Automate 'JS: Distortion (Fuzz)' or 'JS: Bad Buss Mojo Waveshaper' 'Mojo' and wet/dry mix on drum or vocal parallel tracks, driving it into absolute meltdown on specific accents or intense vocal peaks.
         - Simultaneously, modulate the 'Drive' level dynamically based on the input signal envelope so it only screams when hit hard.

      87. **Koz / Stephen Koszler - Lush Synthwave Sidechain Ducking**:
         - Automate the sidechain-linked 'JS: Transient-Driven Auto-Pan (Receiver)' or 'Tukan NC76' to aggressively duck synthwave pad tracks and basslines whenever the kick hits, creating a massive breathing rhythm.
         - Configure a rapid attack and medium-fast release curve to make the ducking swell right back into the mix.

      88. **Disclosure - UK Garage Swing Gating**:
         - Automate 'JS: Noise Gate' 'Attack' and 'Hold' on synthesizer pad chords or high hats, syncing them to a sidechain input triggered by the rimshot/snare for rapid, rhythmic chord stabs.
         - Pair with automating 'Tukan Compressor 2' 'Knee' to smooth out or sharpen the transitions dynamically between sections.

      89. **Jack Antonoff - The Retro Spring Reverb Splat**:
         - Automate 'Tukan Lexikan 2' 'Wet/Dry Mix' and high-frequency damping on acoustic instruments or snare drums, boosting the wet decay suddenly on specific beats to create an explosive, retro reverb splat.
         - Automate the pre-delay parameter to create a dynamic pre-delay bounce right before vocal entries.

      90. **KAYTRANADA - The Off-Kilter Woozy Sidechain Wobble**:
         - Automate 'JS: Floaty (Modulated Delay) [remaincalm.org]' and 'JS: Stereo Field Manipulator [LOSER]' on the main instrument bus, modulating width and pitch drift in sync with a sidechain control signal from the kick, creating a sluggish, woozy groove.
         - Use low-frequency filter parameter modulation to warp the high frequencies of the melody line simultaneously.

      91. **Jimmy Page / Andy Johns - Glyn Johns Huge Drum Room Compression**:
         - Automate 'Tukan NC76' on room mic buses with "All-Button/British Mode" and 'Threshold', dynamically crushing the room mics during high-energy bridges or drum solos to emphasize the organic decay.
         - Automate the 'Release' time to be ultra-fast to maximize room pump, or slow it down to glue the kit together.

      92. **Boi-1da - Aggressive Modern Trap Kick Punch**:
         - Automate 'JS: Transient Controller [LOSER]' 'Attack' and 'Sustain' on kick drum channels, boosting the attack transient by +8dB on the downbeats while dampening the tail, to give the kick a jaw-breaking transient punch.
         - Automate 'JS: Digital Drum Compressor (DDC) [LOSER]' to clip the tail dynamically to prevent clipping elsewhere in the track.

      93. **Alan Moulder - Massive Industrial Wall of Guitars & Synths**:
         - Automate 'JS: Stereo Width [Stillwell]' 'Width' and 'JS: Bad Buss Mojo Waveshaper [Stillwell]' 'Drive' on secondary layered guitars or synths, expanding the width from 100% to 180% during chorus transitions to blow the stereo field wide open.
         - Automate filter cutoff on 'JS: Moog 4-Pole Filter [Liteon]' to narrow or open the frequency spectrum dynamically as the track transitions.

      94. **Tchad Blake - Gritty Binaural Distortions & Dynamic Shakers**:
         - Automate 'JS: Distortion (Fuzz)' 'Wet' mix and 'JS: Stereo Field Manipulator [LOSER]' on acoustic guitars, vocals, or percussion to inject gritty, lo-fi grit and sudden, unexpected panning sweeps.
         - Use random LFO modulation on the auto-pan rate to keep percussion dancing around the listeners' heads unpredictably.

      95. **George Martin - The Cinematic Reverse Tape Reel Sweep**:
         - Automate 'JS: Delay (Lo-Fi)' 'Feedback' and 'JS: Pitch Shifter 2' pitch shift to rise steadily over a 2-bar or 4-bar transition, mimicking a tape speedup/reverse sweep, before cutting cleanly as the next section drops.
         - Automate 'JS: RBJ Highpass/Lowpass Filters' lowpass filter to simultaneously close or sweep open during the tape wind-up.

      96. **Rick Rubin - Ultra-Dry, Raw & In-Your-Face Vocals**:
         - Automate 'Tukan NC76' and volume envelopes to achieve high-ratio, pristine compression without any reverb or delay.
         - Program precise parameter modulation on vocal volume and breathing transients to make the performer feel intensely close, dry, and raw, centered directly inside the listener's head.

      97. **Kanye West / Mike Dean - Epic, Distorted Synth Solos**:
         - Automate high-gain saturation drive on 'JS: Bad Buss Mojo Waveshaper', resonant Moog lowpass filters, and tape delay feedback on custom sawtooth synthesizers.
         - Create towering, soaring, guitar-like synth solos that warp, swell, and scream dynamically as the track transitions into epic codas.

      98. **Pharrell Williams / Chad Hugo (The Neptunes) - Dry, Knocking Claps & Percussion**:
         - Automate 'JS: Transient Controller' attack and gate times on dry claps, woodblocks, and electronic percussion.
         - Pair with subtle, random pitch-drift modulation to give the signature minimal, hollow, acoustic-electronic hybrid pocket that knocks with absolute dry precision.

      99. **Max Martin - Surgical, High-Gloss Pop Harmony Stacks**:
         - Automate 'JS: Stereo Field Manipulator' width (collapsing to mono on verses, exploding to 180% on choruses) and ultra-tight pitch-shifter correction speeds on backing vocal groups.
         - This creates an explosive, massive wall of perfectly tuned and separated vocal harmonies that wrap around the lead.

      100. **Brian Eno - Ambient Generative Tape Loops**:
         - Automate extremely long feedback delays on 'Tukan Lexikan 2' and subtle pitch-drift 'Wow & Flutter' on tape emulators on piano or synth pads.
         - Allows the sound to self-oscillate, degrade, and evolve infinitely over time into a gorgeous, generative ambient cloud.

      101. **Manny Marroquin - Dynamic EQ Vocal Presence & Resonance Taming**:
         - Automate mid-range presence boosts (around 2-3 kHz) and high-frequency harshness cuts (around 5-7 kHz) using high-precision dynamic 'JS: ReJJ/ReEQ' band gain modulation.
         - Trigger extra clarity during soft, whispered verses and instantly suppress sibilance and peak harshness during belted choruses.

      102. **WondaGurl - Dark, Melancholy Pitched-Down Trap Vibes**:
         - Automate tape stop/start simulation speed and heavy lowpass filter cutoff sweeps on melodic samples.
         - Suddenly choke out all high-frequency material above 500Hz when the heavy 808s and kick drums hit to create a massive, deep, dark underwater pocket.

      103. **Mick Guzauski - Ultra-Clean, Glassy Disco/Funk Guitars**:
         - Automate highpass filter cutoff and optical compressor release speeds on funk muted-guitar strums.
         - Keeps the rhythm perfectly locked in the pocket with absolute transient clarity and zero low-end mud.

      104. **Chris Lord-Alge (CLA) - In-Your-Face Parallel Compression & Wide Vocal Spreads**:
         - Automate the blend level of an ultra-compressed parallel vocal bus and modulate micro-pitch shifter detune levels (+/- 12 cents) on the sides.
         - This makes the lead vocals explode with absolute power and width in the chorus.

      105. **Sounwave - Atmospheric, Cinematic Narrative Textures**:
         - Automate grain-size stretchers, slow tape-wow, and filtered hall reverbs on orchestral or spoken-word intros.
         - Creates an unsettling, cinematic transition that collapses instantly into the main beat's dry transient grooves.






      ==================================================
      ⚙️ BEATGANGSTA CONNECT: GUI PLUGIN AUTOMATION ⚙️
      Many advanced JSFX plugins (like ReEQ, Saike Filther, Tukan plugins, Sonic Anomaly, and all the graphical plugins above) have hidden or mapped sliders that control their beautiful GUIs.
      - DETAILED PARAMETER MODULATION INSTRUCTIONS (MANDATORY): In the 'explanation' of ANY dynamic/modulated parameter for ANY GUI-enabled JSFX plugin (such as ReEQ, Saike Filther, Tukan, etc.), you MUST provide detailed, step-by-step instructions guiding the user through REAPER's Parameter Modulation/MIDI link window. Detail clicking the 'Param' button -> 'Parameter modulation/MIDI link' -> choosing the specific parameter (e.g. Gain or Frequency) -> checking 'Audio control signal' (sidechain) -> setting Track audio channels to 1+2 (self) or 3+4 (sidechain for ducking) -> setting Direction to Negative (for ducking/cuts) or Positive (for boosting) -> configuring strength, attack (speed of reaction), and release. 
      - ALWAYS explicitly start this with a bold statement confirming: "**BeatGangsta Connect AUTOMATION**: This Parameter Modulation has been automatically configured and activated for you in REAPER! The following instructions are provided for your reference, inspection, or manual tweaking." This ensures the user is guided in detail, but knows that BeatGangsta Connect did all the work itself!

      ==================================================
      ${(installedJsfxPacks.includes('JClones') || installedJsfxPacks.includes('Tukan Studios')) ? `
      💡 RELEARNED JSFX & EEL2 AUTOMATION DIRECTIVES (TUKAN & JSFX CLONES) 💡
      Many JSFX have dropdowns, toggles, or buttons rendered on their custom graphical GUIs.
      In REAPER, these custom GUI interactions map directly to standard, automatable REAPER sliders. 
      You MUST utilize these slider mappings to automate complex internal parameters, modes, and configurations:
      ${installedJsfxPacks.includes('JClones') ? `
      - **JClones AC1 (Analog Channel)**: Mode (Slider 8) selects console saturation curves (0 = Classic warm analog, 1 = Modern aggressive). Auto Gain (Slider 2) automatically compensates loudness as drive increases (0 = Off, 1 = On).
      - **JClones AC2 (Tape Emulator)**: Model (Slider 5) sets tape formulation physics (0=Swiss Studer high-fidelity, 1=Japan-O Otari warm, 2=USA-M MCI classic, 3=USA-A Ampex aggressive, 4=Japan-S Sony pristine, 5=Japan-T Tascam vintage). Speed (Slider 8) sets IPS (0=7.5 IPS tape saturation with head bump, 1=15 IPS standard tape, 2=30 IPS high-fidelity mastering speed). EQ Type (Slider 9) selects equalization curves (0=IEC-1 warm/vintage, 1=IEC-2@crisp mid-high emphasis). Tape (Slider 10) chooses tape types (0=Modern hi-fi, 1=Vintage saturated).
      - **JClones CA2A (Optical Compressor)**: Mode (Slider 2) toggles compression knee (0=Compress soft-knee, 1=Limit hard limiting). Opto Cell (Slider 4) selects release kinetics behavior (0=Classic slow analog multi-stage release, 1=Fast rapid digital-style release). R37 (Slider 3) adjusts high-frequency emphasis for the sidechain (0=Flat detection, 1=Heavy HF attenuation for de-essing).
      - **JClones CL1B (Tube Compressor)**: Attack/Release Select (Slider 4) selects speed models (0=Manual fully adjustable, 1=Preset fixed times, 2=Combined program-dependent dynamic recovery).
      - **JClones OInflator (Oxford Inflator)**: Clip (Slider 3) enables 0dB ceiling clipping for tube-style warm distortion (0=Off, 1=On). BandSplit (Slider 4) splits processing (0=Single-band full range, 1=Three-band split).
      - **JClones Molot (Vintage Compressor)**: Mode (Slider 5) selects tube topology modes (0=Sigma fast, 1=Alpha warm character). Filter (Slider 8) configures sidechain highpass filter.
      - **JClones RS124 (Vintage Tube Compressor)**: Speed (Slider 3) selects release recovery profiles (0=Slow, 1=Medium, 2=Fast).` : ''}
      ${installedJsfxPacks.includes('Tukan Studios') ? `
      - **Tukan SumChannel (Channel Strip)**: Console (Slider 5) emulates console desks (0=A-type punchy American, 1=N-type fat British warm, 2=SSL precise & transparent console). Noise (Slider 4) adds console noise floor (0=Off, 1=On).
      - **Tukan SumThing (Summing Mixer)**: Console (Slider 4) selects the summing console model. Crosstalk (Slider 2) sets summing desk stereo channel leakage.
      - **Tukan Dis-Treasure (Distressor)**: Ratio (Slider 1) selects ratios (0=1:1, 1=2:1, 2=3:1, 3=4:1, 4=6:1, 5=10:1, 6=20:1, 7=Nuke brickwall). Detector Mode (Slider 5) configures sidechain (0=HP filter, 1=Bandpass filter, 2=Link). Audio Mode (Slider 6) sets distortion modes (0=Clean, 1=Dist2 tube-like second harmonics, 2=Dist3 tape-like third harmonics).
      - **Tukan NC76 / NC76B (1176 Compressor)**: Ratio (Slider 1) selects ratios (0=4:1, 1=8:1, 2=12:1, 3=20:1, 4=All-Button/British Mode for heavy drum pumping).
      - **Tukan Lexikan / Lexikan 2 (Lush Reverb)**: Mode/Algorithm (Slider 0) sets reverb styles (0=Plate, 1=Room, 2=Hall, 3=Cathedral). Pre-Delay (Slider 2) is fully automatable.
      - **Tukan EQT-1A (Pultec EQ)**: Simultaneous Low Boost (Slider 1) and Low Cut (Slider 2) at the same Low Freq (Slider 0) produces the famous Pultec Low-End Trick for deep yet clean bass.
      - **Tukan Deesser**: Mode (Slider 0) selects detection method (0=Wideband, 1=Split-band).
      - **Tukan Compressor 2**: Knee (Slider 3) sets soft-knee curve width in dB. Sidechain (Slider 7) configures detector routing.` : ''}
      ==================================================
      ` : ''}
`;

const getSimplifiedJSFXDatabase = (installedJsfxPacks: string[], starredPlugins: string[] = []) => {
  let activeJSFX = JSFX_DATABASE.filter(p => {
    if (!p.packRequired) return true;
    return installedJsfxPacks.includes(p.packRequired);
  });

  // Filter strictly to starred JSFX plugins
  if (starredPlugins && starredPlugins.length > 0) {
    activeJSFX = activeJSFX.filter(p => {
      const name = p.name;
      const shortName = p.shortName;
      const cleanName = name.startsWith('JS: ') ? name.substring(4) : name;
      return starredPlugins.some(sp => {
        const cleanSp = sp.startsWith('JS: ') ? sp.substring(4) : sp;
        return sp === name || 
               sp === shortName || 
               cleanSp === cleanName || 
               cleanSp === shortName || 
               sp === cleanName;
      });
    });
  }

  return activeJSFX.map(p => ({
    name: p.name.startsWith('JS: ') ? p.name : 'JS: ' + p.name,
    category: p.category,
    description: p.description,
    howItWorks: p.howItWorks,
    proTips: p.proTips,
    volumeStagingWarning: p.volumeStagingWarning,
    sliders: p.sliders.map(s => {
      let details = `[${s.index}] ${s.name} (min:${s.min}, max:${s.max}, default:${s.defaultVal}`;
      if (s.unit) details += `, unit:${s.unit}`;
      if (s.description && s.description !== s.name) details += `, details:${s.description}`;
      details += `)`;
      return details;
    }),
    eel2Logic: p.eel2Logic,
    internalCodeMappers: p.internalCodeMappers
  }));
};


const ADVANCED_MIDI_PROMPT = `
    CRITICAL - ADVANCED MIDI & DRUM PATTERN GENERATION:
    - **TAKE YOUR ABSOLUTE TIME (MANDATORY)**: You MUST spend maximum compute and reasoning capacity on the MIDI generation. Do not rush. The user fully expects a longer wait time for these generated results to ensure maximum quality and musical depth. Every single MIDI section (Intro, Verse, Hook, Bridge, Outro) and drum pattern MUST be meticulously double-checked and verified by you (the AI) before returning the JSON to ensure that it is fully complete, detailed, complex, and musical. Under no circumstances should you output unfinished, basic, or abbreviated midi notes or oversimplified placeholders.
    - Always include decent, best-in-class, highly engaging, and beautiful patterns instead of sometimes leaving them simple or repetitive, so users are excited to load them into their DAW.
    - **CRITICAL COMPUTE DIRECTIVE**: Meticulously recreate the exact iconic melodies, rhythms, chords, and basslines of the reference track, note-for-note. Every single MIDI pattern MUST be perfectly transcribed from the source.
    
    CRITICAL - ZERO BLANK PARAMETERS IN VSTS & PLUGINS (ABSOLUTE DIRECTIVE):
    - EVERY SINGLE virtual instrument (VST) and FX plugin recommended in the recipe MUST have its "deepDive" array fully populated.
    - Under NO circumstances are you allowed to output empty or truncated deepDive arrays (e.g., leaving a [] or skipping the field).
    - Spend however long and as much reasoning capacity as necessary to ensure every single parameter (cutoff, envelope times, resonance, dry/wet, decay, ratios, drive) has realistic, detailed values and explicit, informative explanations that match the unique sonic characteristics of the analyzed track or URL link.
    - If you are extracting a recipe from a URL/link, you MUST meticulously populate all VST parameters to capture that specific reference sound exactly.
    
    CRITICAL - CHORD POLYPHONY RULE:
    - For Chords: You MUST write chord notes in a single object inside the 'midiNotes' array with a comma-separated pitch string (e.g., "A3,C4,E4") instead of separate note objects. This is absolutely crucial for polyphony and ensures correct midi playback and prevents truncation!
    
    CRITICAL - EXHAUSTIVE DRUM KIT INSTRUMENT PARAMETERS:
    - For EACH drum part under 'drumKitAdvice', you MUST provide both the legacy text fields ('kickVirtualInstrument', etc.) and the NEW structured object fields:
      - 'kickVirtualInstrumentObj', 'snareVirtualInstrumentObj', 'hiHatVirtualInstrumentObj', 'clapVirtualInstrumentObj', and 'bassVirtualInstrumentObj'.
      - Inside EACH virtual instrument object, you MUST provide 'name' (the synth/sampler name) and 'deepDive' which is an array of at least 6-10 specific, detailed parameters (e.g. Cutoff, Envelope Decay, Resonance, Drive, Tuning, Sample Start, Hold, Velocity Curve, etc.) with their values and precise explanations.
      - Inside EACH FX plugin array (e.g. 'kickFXPlugins', 'snareFXPlugins', 'hiHatFXPlugins', 'clapFXPlugins', 'bassFXPlugins'), EACH plugin object MUST contain a 'deepDive' array containing at least 6-8 specific, real-world technical parameters (e.g. Threshold, Ratio, Attack, Release, Knee, Frequency, Gain, Wet/Dry, Saturation Drive, etc.) with precise values and explanations. DO NOT use empty arrays or leave deepDives out. This is a strict requirement to satisfy user demands for exhaustive parameters.

    CRITICAL - DRUM INSTRUMENTS AND FX ADVICE in 'drumKitAdvice':
    You MUST provide detailed and valid recommendations in the 'drumKitAdvice' object:
    - 'hiHat': Specific tuning/muffling/style advice for the hi-hats.
    - 'clap': Specific acoustic, layered, or performance-style advice for claps/rimshots/percussions (e.g., room acoustics, handclapping count, or synthetic layering).
    - 'bass': Specific acoustic bass guitar tuning or synth bass/808 sub layering style advice (e.g., sidechain interaction with kick, glide settings, sub bass EQ cuts).
    - 'kickVirtualInstrument': Recommend EXACTLY which virtual instrument / synth plugin to load for the Kick sound, accompanied by an exhaustive list of 6-10 parameter settings (e.g., Tune: 50Hz, Decay: 65%, Saturation: 20%, Drive: 15%, Cutoff: 120Hz).
    - 'kickVirtualInstrumentObj': Object representing the kick instrument. Name: e.g. "SubLab" or "Serum". deepDive: at least 6-10 parameters with names, values, and explanations.
    - 'kickFXPlugins': An array of FX plugins to add onto the Kick track to make it sound industry-grade. Ensure EACH plugin has a detailed 'deepDive' parameter array.
      - If JSFX MODE IS ACTIVE, use JSFX from the database like "JS: Digital Drum Compressor", "JS: Saturation", "JS: Bad Buss Mojo Waveshaper", or "JS: Transient Controller" with exact settings.
      - If JSFX MODE IS INACTIVE, use VSTs like "FabFilter Pro-C 2", "Decapitator", "rc-20 retro color", or "Devil-Loc" with exact settings.
    - 'snareVirtualInstrument': Recommend which virtual instrument / sample-trigger to load for the Snare (e.g., "JS: Gaussian Noise Generator" or Cockos drum samplers in JSFX mode, or "Sitala", "Addictive Drums 2", or "Battery 4" in VST mode) with detailed parameters/envelope settings.
    - 'snareVirtualInstrumentObj': Object representing the snare instrument.
    - 'snareFXPlugins': An array of FX plugins to enhance the Snare (e.g., "JS: Dirt Squeeze Compressor" or "JS: Delay" in JSFX mode, or "Pro-Q 3", "Decapitator", or "Valhalla VintageVerb" in VST mode) with exact settings. Ensure EACH plugin has a detailed 'deepDive' parameter array.
    - 'hiHatVirtualInstrument': Recommend which virtual instrument to use for the Hi-Hat (e.g. "JS: Gaussian Noise Generator" high-passed in JSFX mode, or "Sitala" / "Battery 4" in VST mode) with detailed parameters.
    - 'hiHatVirtualInstrumentObj': Object representing the hi-hat instrument.
    - 'hiHatFXPlugins': An array of FX plugins to enhance the Hi-Hat (e.g. "JS: Transient Controller" or "JS: Chorus" in JSFX mode, or "rc-20 retro color" wow/flutter & noise or "MicroShift" in VST mode) with exact settings. Ensure EACH plugin has a detailed 'deepDive' parameter array.
    - 'clapVirtualInstrument': Recommend which virtual instrument / sample-trigger to load for the Clap (e.g., "JS: White Noise Generator" or native JSFX samplers in JSFX mode, or "Sitala", "Battery 4", or custom clap samples in VST mode) with detailed parameters.
    - 'clapVirtualInstrumentObj': Object representing the clap instrument.
    - 'clapFXPlugins': An array of FX plugins to enhance the Clap (e.g., "JS: Ozzifier Chorus", "JS: Delay" or "JS: Tremolo" in JSFX mode, or "Valhalla VintageVerb", "Soundtoys Decapitator", or "MicroShift" in VST mode) with exact settings. Ensure EACH plugin has a detailed 'deepDive' parameter array.
    - 'bassVirtualInstrument': Recommend EXACTLY which virtual instrument / synth plugin to load for the Bass / 808 sound with detailed parameters (e.g., Glide, Distortion, Sub level, Filter envelope).
      - If JSFX MODE IS ACTIVE, you MUST recommend a native JSFX instrument or synth like "JS: Tone Generator" (configured as a sub sine/triangle wave), or a native Cockos synth plugin with precise settings.
      - If JSFX MODE IS INACTIVE, recommend top VSTs like "SubLab", "Spectrasonics Trilian", "Serum" (for 808 glides/sub bass), "Arturia Mini V", or "Trilogy" with exact preset details.
    - 'bassVirtualInstrumentObj': Object representing the bass instrument.
    - 'bassFXPlugins': An array of FX plugins to shape, saturate, compress, or sidechain the Bass/808. Ensure EACH plugin has a detailed 'deepDive' parameter array.
      - If JSFX MODE IS ACTIVE, use JSFX from the database like "JS: Saturation", "JS: Compciter", "JS: Bass Manager/Booster", or "JS: Non-Linear Processor" with exact settings.
      - If JSFX MODE IS INACTIVE, use VSTs like "FabFilter Pro-MB", "Decapitator", "Pultec EQP-1A", or "CamelCrusher" with exact settings.

    CRITICAL - HIGHLY CREATIVE & ENJOYABLE MIDI PATTERNS (ANTI-PLAIN SLOP):
    - You are strictly FORBIDDEN from generating simple, repetitive, or boring 2-note/4-note placeholders. 
    - You MUST generate fully articulated, expressive, and enjoyable patterns with beautiful melody, bounce, syncopation, and chord movement that matches top-tier human musicianship.
    - **MANDATORY UNIQUE SECTION ARRANGEMENTS**: You are STRICTLY FORBIDDEN from repeating or copying the same MIDI notes or drum step patterns across multiple sections. Every single section (Intro, Verse, Hook, Bridge, Outro) MUST have a completely unique, distinct, and highly customized pattern written from scratch specifically for its unique musical function:
      1. **Intro**: Sparse, atmospheric, and tension-building. Fewer active instruments, lighter percussion, simplified chords, or soft swelling pads that build excitement and build up directly to the Hook or Verse.
      2. **Verse**: Driving, clean, and rhythmically steady. It MUST be easy to sing or rap over! Avoid busy mid-range melodies or overly complex lead lines that conflict with a vocalist. Keep the groove deep, stable, and supportive.
      3. **Hook (Chorus)**: Maximum energy, full instrumentation, and unforgettable catchiness! This is the peak of the track. Use lush, fully voiced chords, memorable earworm lead arps/melodies, aggressive kicks/snares, and maximum syncopation/swing.
      4. **Bridge**: High tension, suspense, and dynamic contrast. Introduce unexpected chord modulations, change up the rhythm, or filter out key elements to create a dramatic build-up that explodes or perfectly resolves back into the final Hook.
      5. **Outro**: A smooth, elegant comedown or fade-out. Gradually thin out the instrumentation, reduce drum velocities, resolve the final chord progression, and let sustaining notes ring out.
    - Melodies & Lead Arps: Provide at least 15-40 notes with rich variety in pitch, syncopation, and phrase movement over the section bar structure. Let the melody rise, fall, and transition beautifully.
    - Chord Progressions: Provide at least 8-20 rich, lush chords (incorporating suspended, minor/major 9ths, add9, 11th, and inverted voicings) to create emotional depth instead of flat triads.
    - Basslines & 808s: Provide at least 15-30 notes featuring glides, slides, syncopated rhythms, octave jumps, and dynamic turnarounds that interact flawlessly with the kick.
    - If the user requested a specific song or provided a reference URL, the MIDI notes MUST meticulously recreate the EXACT iconic melodies, rhythms, chords, and basslines of that song note-for-note and perfectly match the movement.
    - **TRANSPOSITION & ADAPTATION**: If the user asks to recreate a specific song/melody but with a DIFFERENT key or DIFFERENT BPM, you MUST STILL recreate the exact relative intervals, rhythms, and melody of the reference track, simply transposed to the new key and scaled to the new BPM. Do not generate a generic pattern; it MUST be the exact requested melody adapted to the new constraints.
    
    CRITICAL - NO VOCALS AS INSTRUMENTS:
    Ensure you ALWAYS use VST instruments (synths, keys, bass, guitars, etc.) instead of a vocal or acapella as an instrument in the beat recipe. Users feel cheated by a bad recipe guide if it just says "use a vocal". Only use actual VST instruments or hardware for the beat's instrumentation.
    CRITICAL - GUITAR CAPO RECOMMENDATIONS:
    When generating recipes that include acoustic or electric guitars (especially for indie, rock, alternative, or bright pop styles), strongly consider recommending the use of a capo in the sourceSoundGoal or deepDive (e.g., placing it on the 2nd, 3rd, or 4th fret) to achieve a brighter, more distinctive and chiming sound without breaking strings. Use references like Johnny Marr, Jingle-Jangle style, and The Smiths as inspiration for these recommendations.
    CRITICAL - MIDI LENGTH & DURATION RULES:
    - EXCEPTION FOR DOUBLE-AUDIO RECREATION / SONG RECREATION: If you are in double-audio recreation mode (the user has provided a second target track File 2 to recreate FOR), the 4 or 8 bars constraint is completely OVERRIDDEN. You MUST instead analyze the exact section lengths of File 2 (Target) and generate MIDI patterns for both instruments and drums that match those exact detected section bar lengths. Provide these bar lengths in 'detectedSectionLengths'. For example, if File 2 has an 8-bar Intro, 16-bar Verse, and 8-bar Hook, then Intro is 8 bars, Verse is 16 bars, Hook is 8 bars, etc.
    - Standard Mode: If there is no target track (single-file or text-only), you MUST generate EXACTLY 4 or 8 bars of MIDI data for EVERY instrument and drum pattern. Do NOT generate 1, 2, 3, 5, 6, or 7 bars. It MUST be exactly 4 or 8 bars.
    - For Instrument MIDI Notes: The sum of all 'duration' and 'wait' values in each section's 'midiNotes' array MUST equal exactly:
      - (Section Bars * 4) beats. For example, if Verse is 16 bars, the sum of all durations/waits for 'verse' MUST be exactly 64 beats. If Hook is 8 bars, the sum for 'hook' MUST be exactly 32 beats. If a standard 4 bars, it must be exactly 16 beats.
    - For Drum Patterns: 16 steps = 1 bar. Therefore, you MUST provide steps ranging from 1 to (Section Bars * 16). If isDoubleTime is true, double these numbers (1 to Section Bars * 32). For example:
      - If Verse is 16 bars: provide steps ranging from 1 to 256 (or 1 to 512 if double time).
      - If Hook is 8 bars: provide steps ranging from 1 to 128 (or 1 to 256 if double time).
      - If Intro is 8 bars: provide steps ranging from 1 to 128 (or 1 to 256 if double time).
    - For 'duration' and 'wait' values, you MUST ONLY use valid musical subdivisions: '1' (whole), '2' (half), '4' (quarter), '8' (eighth), '16' (sixteenth), '32', '64', or triplet/dotted variations (e.g., '8t', '4d'). Do NOT use invalid numbers like '6', '3', or '5'.
    For Drum Patterns (kick, snare, hiHat):
    - Differentiated Swing Percentages: Utilize the 'swing' object parameters (0-100) to specify natural, realistic groove. 
      - Hi-Hats: Typically carry the main pocket of the track. Use 15% to 55% swing for a standard modern trap bounce or up to 60-70% for heavy boom-bap and lofi beats.
      - Snare/Clap: Add a very subtle swing (5% to 20%) to let the snare lag/drag slightly behind, creating a laid-back feel.
      - Kick: Keep mostly locked (0% to 10% swing) to preserve the hard transient punch on downbeats, but you can increase up to 15-30% for loose boom-bap swing to gel with the bass.
    - Velocity Dynamics & Humanization:
      - Hi-Hats: MUST follow a dynamic pulse. Do not make velocities flat. Use alternating strong-weak-medium-weak velocity accents (e.g., step 1: 110, step 3: 75, step 5: 105, step 7: 70). For double-time (isDoubleTime: true) rolls and fills, use ramping crescendos/decrescendos (e.g., 40 -> 65 -> 90 -> 115) to sound natural.
      - Snare: Main anchor hits (on beats 2 & 4, or beat 3 in half-time) must be hard-hitting and consistent (velocities 110-125). Accent/ghost snare notes and fills must use much softer velocities (25-50) to build realistic syncopation.
      - Kick: Primary downbeats should have high, heavy velocities (112-125). Syncopated or off-beat kicks should use softer velocities (85-100) to create a "pocket" and human feel.
    - Song Section Arrangement Dynamics: Match drum velocities, density, and swing directly to song sections to tell a narrative:
      - Intro: Sparse drum placement, lower velocity (50-80) to feel filtered, low swing or straight to build expectation.
      - Verse: Solid, driving groove. Moderate swing and steady velocities to anchor the groove without distracting from the vocals.
      - Hook (Chorus): Maximum energy! Bring in high-velocity accents (115-127), complex/energetic hi-hat rolls with full swing, and aggressive, syncopated kicks to create a massive premium bounce.
      - Bridge/Outro: Sparser patterns, declining velocities (60-90) to create a smooth comedown/fade-out feel.
    - Complexity: Use 'isDoubleTime' (32 steps) to create intricate hi-hat rolls, syncopated kick patterns, and complex snare fills.
    For Instrument MIDI Notes (midiNotes array):
    - Harmonic Depth: Generate complex chords (7ths, 9ths, 11ths, 13ths, suspended chords, inversions). Do not just use basic triads.
    - Melodic Sophistication: Include passing notes, grace notes, arpeggiations, and counter-melodies.
    - Expressive Timing & Duration: Use precise 'duration' and 'wait' values (e.g., 'T128', 'T64', 'T32', dotted notes, triplets) to create syncopation, staccato plucks, legato sweeps, and realistic phrasing.
    - Velocity Humanization: Every single note MUST have a carefully considered velocity. Emphasize downbeats, soften upbeats, and create dynamic arcs (crescendos/decrescendos) across phrases.
    - Basslines & 808s: Create gliding, syncopated, and rhythmically complex basslines that interact perfectly with the kick drum.
    Your goal is to generate MIDI data that sounds indistinguishable from a master human musician playing a real instrument.
`;
const PRO_Q_3_LAYOUT_PROMPT = `
    CRITICAL - FABFILTER PRO-Q 3 LAYOUT & COMPLEXITY:
    When suggesting settings for FabFilter Pro-Q 3, you MUST ALWAYS provide exactly 6 bands in the 'deepDive' section. 
    Every Pro-Q 3 suggestion MUST include exactly 6 bands in total (no more, no less) in the 'deepDive' section.
    AT LEAST 1 of those bands MUST be a dynamic band (Dynamic: On, with a Range value). This is a strict requirement to make sure the sound matches the song uploaded in slot 1 and sounds spectacular on target track 2.
    You MUST use the following EXACT layout for the 'deepDive' section for each of those 6 bands, ensuring each parameter is labeled for readability:
    Layout Structure (Example for each band):
    - Low End Band: [Freq: 45Hz, Gain: 0.0dB, Type: Low Cut, Slope: 12dB/oct, Q: 0.70, Stereo: Stereo, Dynamic: Off]
    - Band 1-6: [Freq: 250Hz, Gain: -2.5dB, Type: Bell, Slope: 12dB/oct, Q: 1.0, Stereo: Stereo, Dynamic: On, Range: -3.0dB]
    Required Labels:
    - Freq: Frequency
    - Gain: Gain in dB
    - Type: Filter type
    - Slope: Slope in dB/oct
    - Q: Q factor
    - Stereo: Stereo Placement (Left, Right, Stereo, Mid, Side)
    - Dynamic: Dynamic Enable (On, Off)
    - Range: Dynamic Range (Only show if Dynamic is On)
    Allowed Values:
    - Type: Bell, Low Shelf, High Shelf, Low Cut, High Cut, Notch, Band Pass, Tilt Shelf, Flat Tilt.
    - Slope: 6dB/oct, 12dB/oct, 18dB/oct, 24dB/oct, 30dB/oct, 36dB/oct, 48dB/oct, 72dB/oct, 96dB/oct.
    - Stereo: Left, Right, Stereo, Mid, Side.
`;
const JSFX_PRIORITY_SPEC_PROMPT = `
    CRITICAL - JSFX PRIORITIZATION & EQ DEEP-DIVE RULES:
    When JSFX Mode is active, you MUST prioritize the following plugins for EQ, dynamic filtering, de-harshing, and resonance suppression:
    1. **JS: ReJJ/ReEQ**:
       - Use this as the primary surgical parametric EQ (supports up to 16 bands).
       - In 'deepDive' parameters, use the format: 'Filter X Type', 'Filter X Frequency', 'Filter X Gain', 'Filter X Q' (where X is the band number from 1 to 16, e.g. 'Filter 1 Frequency', 'Filter 2 Gain').
       - **MANDATORY - ALWAYS AT LEAST 7 BANDS**: For every track's EQ setup, you MUST ALWAYS configure at least 7 bands of ReEQ/ReJJ (e.g., specifying parameters for Filter 1, Filter 2, Filter 3, Filter 4, Filter 5, Filter 6, and Filter 7 in the deepDive section).
       - **MANDATORY - LOW CUT ON BAND 1**: Every single track's ReEQ/ReJJ instance MUST always start with a low cut filter on Band 1 (e.g. 'Filter 1 Type': 'Low Cut' or 'High Pass', with 'Filter 1 Frequency' set to an appropriate frequency such as 30Hz - 80Hz depending on the track type, and 'Filter 1 Gain': 0.0dB) to clean up low-end rumble, exactly like we do with FabFilter Pro-Q 3.
       - **MANDATORY - AT LEAST 1 DYNAMIC EQ BAND**: Every single track's ReEQ/ReJJ instance MUST have at least 1 dynamic EQ band. Choose a band (e.g. Filter 2, Filter 3, etc.) where dynamic control is highly beneficial (like vocal resonance taming, mud control around 200-400Hz, or harshness taming in highs), and explicitly set up dynamic parameter modulation for its Gain. Make sure to describe the Dynamic EQ setup in the explanation or parameter settings.
       - **MID/SIDE PROCESSING & CUTS**: When appropriate, give plenty of Mid and Side cuts using ReEQ/ReJJ's stereo routing or Mid/Side capabilities (though this is not mandatory for every single track, use it generously where mid/side separation or narrowing/widening helps the mix).
       - DETAILED PARAMETER MODULATION INSTRUCTIONS (MANDATORY): In the 'explanation' of ANY dynamic/modulated parameter for ANY GUI-enabled JSFX plugin (such as ReEQ, Saike Filther, Tukan, etc.), you MUST provide detailed, step-by-step instructions guiding the user through REAPER's Parameter Modulation/MIDI link window. Detail clicking the 'Param' button -> 'Parameter modulation/MIDI link' -> choosing the specific parameter (e.g. Gain or Frequency) -> checking 'Audio control signal' (sidechain) -> setting Track audio channels to 1+2 (self) or 3+4 (sidechain for ducking) -> setting Direction to Negative (for ducking/cuts) or Positive (for boosting) -> configuring strength, attack (speed of reaction), and release. ALWAYS explicitly start this with a bold statement confirming: "**BeatGangsta Connect AUTOMATION**: This Parameter Modulation has been automatically configured and activated for you in REAPER! The following instructions are provided for your reference, inspection, or manual tweaking." This ensures the user is guided in detail, but knows that BeatGangsta Connect did all the work itself!
    2. **JS: Saike Filther (Saike)**:
       - Use this as Option 1 for dynamic/modulated filtering or creative saturation. Recommend it for heavy dynamic ducking, creative band modulation, and synth/vocal sound shaping.
    3. **JS: Saike Saike Smooth**:
       - Use this for dynamic resonance suppression and spectral de-harshing.
       - EVERY single track's FX chain (and buses) MUST end with "JS: Saike Saike Smooth" as the final plugin to suppress harshness and clean up the high-frequency spectrum.
`;
const GULLFOSS_SPEC_PROMPT = `
    CRITICAL - GULLFOSS / GULLFOSS LIVE / GULLFOSS MASTER:
    When suggesting settings for Soundtheory GULLFOSS plugins, you MUST use the following units:
    - Recover: 0% to 100%
    - Tame: 0% to 100%
    - Bias: -100% to +100%
    - Bright: -100% to +100%
    - BOOST: This parameter is IN DECIBELS (dB), NOT PERCENTAGE. Range is -50.0dB to +50.0dB. 
      (Example: Boost: +2.5dB). NEVER use % for Boost.
`;
const OZONE_SPEC_PROMPT = `
    CRITICAL - IZOTOPE OZONE 11 VINTAGE TAPE:
    - High Emphasis: This parameter is UNIPOLAR. The range is 0.0 to 10.0. 
      NEVER suggest negative values for High Emphasis. (Minimum is 0.0).
`;
const SONIBLE_SPEC_PROMPT = `
    CRITICAL - SONIBLE PRODUCT SERIES ACCURACY:
    1. "learn:" SERIES (Specialized simplified products):
       - learn:limit:
         - Parameters: Bass Control (0-100), Resonances (0-100), Saturation (0-100), Transients (0-100).
         - Styles: Modern, Neutral, Hard.
         - Core: Gain (dB), Limit (dB).
       - learn:EQ:
         - Parameters: Balance (0-100).
         - Styles: Warm, Neutral, Bright.
       - learn:comp:
         - Parameters: Compression (0-100), Clarity (0-100).
         - Styles: Modern, Neutral, Hard.
       - learn:verb:
         - Parameters: Reverb (0-100), Mix (0-100), Size (0-100).
         - Styles: Modern, Neutral, Hard.
    2. "smart:" SERIES (Professional AI products):
       - smart:limit:
         - Sound Shaping: Bass Control (0-100), Resonances (0-100), Saturation (0-100), Transients (0-100).
         - Styles: Clean, Punch, Soft, Tight.
       - smart:EQ 3/4:
         - Dynamic: Range (0-100%), Smoothing (0-100%).
       - smart:comp 2:
         - Spectral Comp: Range (0-100%), Style (Clean, Balanced, Punchy).
       - smart:reverb:
         - Controls: Reverb (0-100), Particle (0-100), Spread (0-100), Density (0-100).
    3. "pure:" SERIES (Streamlined creative products):
       - pure:limit:
         - Control: Inflate (0-100).
         - Styles: Soft, Neutral, Hard.
       - pure:comp:
         - Control: Compression (0-100).
         - Styles: Soft, Neutral, Hard.
       - pure:EQ:
         - Control: Balance (0-100).
         - Styles: Warm, Neutral, Bright.
       - pure:verb:
         - Controls: Reverb (0-100), Mix (0-100), Size (0-100).
    AI GUIDELINE: Always detect which series the user owns from their plugin list and apply the EXACT parameter names and styles defined above for that specific series.
`;
const EXTRACT_RECIPE_MIDI_PROMPT = `
    CRITICAL - EXTRACT RECIPE & FULL ARRANGEMENT MIDI:
    - **CRITICAL COMPUTE DIRECTIVE**: You MUST dedicate maximum compute time to transcribe the FULL song precisely. This is a massive operation. DO NOT rush. Do not give short 4 or 8 bar loops.
    - **ALL INSTRUMENTS**: You MUST detect and include EVERY SINGLE instrument playing in the song (Lead Synth, Pads, Bass, Plucks, Strings, Guitars, Arps, etc.) inside the "instruments" array. Do not skip any element of the arrangement.
    - **SECTION STRUCTURAL AWARENESS**:
      - You MUST analyze the exact sections of the reference song (or target song File 2 in double-audio mode) and detect the precise number of bars for each major section: Intro, Hook, Verse, Bridge, Outro.
      - Return these exact detected bar lengths in 'detectedSectionLengths' (e.g. intro: 8, verse: 16, hook: 8, bridge: 4, outro: 8).
      - The generated MIDI patterns (for both instruments and drum patterns) MUST match the exact bar lengths detected for each corresponding section. For example, if the Hook area is detected as 8 bars, the generated Hook MIDI and Hook Drum steps MUST span exactly 8 bars. If the Verse is detected as 16 bars, they MUST span exactly 16 bars. Do NOT use generic 4 or 8 bar placeholders.
` + ADVANCED_MIDI_PROMPT;

const RC20_SPEC_PROMPT = `
    CRITICAL - XLN AUDIO RC-20 RETRO COLOR SPECIFICATIONS:
    - Wow/Flutter Parameter: This is a 0-100 slider controlling the balance between Wow and Flutter.
      - 0% (Slider to far Left): 100% Wow, 0% Flutter.
      - 100% (Slider to far Right): 0% Wow, 100% Flutter.
    - Noise amounts:
      - Noise: Value MUST be a percentage (0-100%). DO NOT use dB values for noise amounts.
    - Mandatory Parameters: You MUST ALWAYS include values for ALL of the following: Noise, Wobble, Distort, Digital Space, Magnetic, and Flux. 
      - Flux is often an additional parameter you should always check and define for RC-20.
`;
const NI_RAUM_SPEC_PROMPT = `
    CRITICAL - NATIVE INSTRUMENTS RAUM SPECIFICATIONS:
    - Low Cut: MUST be displayed in dB (e.g., -6dB).
    - Hi Cut: MUST remain in Hz (e.g., 8000Hz).
`;
const ATR102_SPEC_PROMPT = `
    CRITICAL - AMPEX ATR-102 & STUDER A800 (UNIVERSAL AUDIO / UAD) SPECIFICATIONS:
    - Avoid Muting: Do NOT set "Reproduce" or "Record" (Repro / Record path settings) or any Power settings in a way that mutes the track/bypasses the audio.
    - O'Clock Settings: There are many unlabeled knobs. For knobs that do not explicitly show numbers (e.g., Record, Reproduce, Input, Output), you MUST use "o'clock" values (e.g. "10 o'clock", "2 o'clock"). DO NOT use raw numbers.
    - NO FAKE PARAMETERS: The parameters "LF Driver" or "HF Driver" or "Fatness" DO NOT EXIST on the UAD tapes. You MUST use real parameters like "Record Level", "Repro Level", "Tape Speed" (IPS), "Tape Formula", "Cal Level", "HF Record", "LF Record", "HF Repro", "LF Repro", "Bias", "Path" or "Sync". Never invent parameters.
`;
const LYRIC_AWARE_DELAY_AUTOMATION_PROMPT = `
    CRITICAL - LYRIC-AWARE VOCAL DELAY & REVERB TAIL AUTOMATION:
    When analyzing vocal stems in combination with instrumentals/beats, you MUST intelligently identify the lyrics/words in separate vocal tracks.
    1. INTENTIONAL WORD SELECTION:
       - Identify key words or phrases (e.g. at the end of vocal phrases, or key accented moments) to apply delay throws and reverb tails.
       - RHYTHMIC TIMING BALANCE: Note that sometimes, the "last two words" of a phrase and "one larger multi-syllable word" take up the exact same amount of time in the bar/groove. Use the BPM and bar/beat measurements to calculate the best choice that yields the most rhythmically impactful and cohesive flow.
    2. BPM & BAR TIME CALCULATIONS:
       - You MUST provide precise mathematical calculations based on the track's BPM.
       - Formulate exactly how the delay time (e.g., 1/4 note, 1/8 note, dotted 1/8, or 1/4 triplets) relates to the BPM. E.g., at 120 BPM, a 1/4 note is 500ms; a 1/2 note is 1000ms.
       - Map out specific beat coordinates (on the REAPER timeline) where the automation spikes up on the word's entry and drops back down immediately after the phrase ends to capture just the tail without muddying the rest of the vocal.
    3. EXQUISITE ENGINEER & PRODUCER STYLES:
       Draw from these legendary engineer and producer dynamic vocal throwing styles when configuring the automationAdvice and automation points:
       - **Andy Wallace Throw**: A sudden 1/4 or 1/2 note delay on the very last word of a verse, automated via auxiliary send or wet mix. Feeds a dark, warm analog style delay with high feedback.
       - **Mick Guzauski Stereo Width**: Dual-delay throw (e.g. 1/8 note Left, 1/8 dotted Right) precisely on key sustained lyrical vowel sounds. The stereo width expands right as the vocal finishes the phrase.
       - **Tom Elmhirst Plate Sweep**: An automated reverb send that spikes to 30% wet exactly on the last word of an emotional ballad section, decaying slowly over 4-6 seconds to transition into the next section.
       - **Chris Lord-Alge Slapback**: A high-feedback stereo slapback tape echo (120-140ms) automated to trigger ONLY on accented verbs or punchy adjectives to highlight the rhythm of the performance.
       - **Serban Ghenea Shimmer Delay**: Send a specific syllable to a highly compressed, high-passed delay (cutoff below 500Hz) with high-frequency saturation, creating a crisp, metallic halo sitting above a dense pop chorus.
       - **Sylvia Massy Saturator Spill**: Throw the last word of a tense vocal phrase into a parallel highly-distorted, filtering tube saturator with a long reverb tail, letting the vocal feedback self-oscillate as the beat drops out.
       - **Tchad Blake Binaural Spring Echo**: Extreme, fast automated panning of a dark spring reverb/delay throw across the stereo field on a specific whispered or spoken word for an eerie, 3D effect.
       - **Metro Boomin Detuned Trap Bounce**: A detuned, filtered delay throw on the final word of backing vocals/ad-libs, using a pitch-shifter inside the delay feedback loop to drop the pitch by 12 semitones.
       - **Jimmy Douglass Syncopated Triplet**: A 1/4-triplet or 1/8-triplet delay throw on the last two words of a fast rap line, perfectly locked into the syncopated off-beats of the pocket.
       - **Noah '40' Shebib Underwater Wash**: A lowpassed hall reverb/delay throw (cutoff above 800Hz) on vocal breaks, creating a nostalgic, submerged ambient pocket.
       - **Butch Vig Distorted Megaphone Accent**: Automate 'JS: Bad Buss Mojo Waveshaper' 'Mojo' and 'JS: RBJ Highpass/Lowpass Filters' (setting HP to 500Hz, LP to 3kHz) on key ending verbs or angry adjectives, creating a sudden, gritty, telephone/megaphone megaphone vocal pop that cuts right through the dense rock chorus.
       - **Prince Stereo Micro-Pitch Doubler**: Dynamically throw specific sustained nouns into 'JS: Saturated Chorus' or dual micro-pitch shifted lanes (+/- 9 cents) using 'JS: Pitch Shifter 2' panned hard left and right. This instantly widens the vocal tail and makes it bloom in the stereo field as the phrase ends.
       - **Les Paul Trippy Tape Flanger Sweep**: Trigger a sudden psychedelic comb-filtering effect on the last syllable of a transition line by automating the wet mix of 'JS: Flanger' or 'JS: Saturated Chorus' from 0% to 50% along with a rising feedback rate, creating a vintage reel-to-reel tape flanging effect.
       - **Finneas ASMR Whisper Gate/Compressor**: Automate 'JS: Noise Gate' 'Threshold' and 'JClones CA2A' 'Peak Reduction' on intimate whispered ad-libs or vocal tails to bring out ultra-quiet mouth noises and breathing transients to a high level, then snap-gate them shut instantly to keep the background dead quiet.
       - **Daft Punk Talkbox Vocoder Morph**: Throw specific key ending words into a resonant formant filter ('JS: Moog 4-Pole Filter' or bandpass filters) with automated LFO rate and resonance sweeps, turning the natural throat tone into a synthetic, metallic talkbox vocal right before the beat drops.
       - **Jimi Hendrix / Eddie Kramer Swirling Phaser Orbit**: Dynamically route a vocal ad-lib or screaming phrase-end into 'JS: Phaser' with high resonance and speed, automating the width to sweep from mono to 200%, making the vocal swirl around the listener’s head in a vintage, psychedelic orbit.
       - **Jack Joseph Puig Tube Saturation Peak**: Automate 'JClones AC1 (Analog Channel)' 'Saturation' or 'JS: Distortion (Fuzz)' wet mix to drive hard on accented vocal peak phrases. This gives the words an upfront, aggressive vintage tube warm drive that sits right in the listener's forehead.
       - **Billie Eilish Intimate Treble Shimmer**: Send key whispered lyrics into a parallel high-frequency boost using 'JS: ReJJ/ReEQ' (boosting 10kHz+ by +12dB with a shelf) and automate a fast compressor like 'Tukan NC76' to clamp down hard, creating a glassy, breathy sibilance halo.
       - **Brian Eno Generative Octave Swell**: Send key vocal phrase endings or single-note ad-libs into an octave-up pitch-shifter ('JS: Pitch Shifter 2' set to +12 semitones) inside a feedback loop of 'Tukan Lexikan 2' hall reverb, generating an evolving, atmospheric, angelic shimmer cloud that decays slowly over 8 seconds.
       - **George Martin Dynamic Reverse Sweep**: Throw a key transition phrase into 'JS: Delay' with automated negative time offset or reverse delay simulation, coupled with a highpass filter sweep, to create an unsettling, rising reverse vocal sweep that pulls the listener directly into the next chorus downbeat.
       - **Lee "Scratch" Perry Dub Feedback Spill**: Sudden automation of feedback and wet mix on a tape-style delay ('JS: Delay (Lo-Fi)' or 'JS: Delay w/Chorus'), letting the echo run wild into self-oscillation on a drum rimshot or vocal ending, then instantly muting the feedback parameter to clean it up before the next bar begins.
       - **Katy Perry / Dr. Luke Pop Stutter Pitch-Ramp**: Take a key lyric vowel, route it into an automated gate or 'JS: Saturated Chorus', and automate a pitch shifter ('JS: Pitch Shifter 2') to rise from 0 to +12 semitones dynamically over a 1-bar transition, accelerating the speed of a tremolo or gating plugin to create a rapid-fire synthetic riser.
       - **Bob Clearmountain Dual-Mono Panning Bounce**: Send key ending syllables to separate Left and Right delay lines with different rhythmic settings (e.g. 1/4 note Left, 1/4 triplet Right) and automate 'JS: Auto-Pan' or volume sliders to sweep the Left/Right channels in opposing directions, creating an expansive, wide stereo motion that floats across the speaker field.
       - **Rick Rubin Heavy Metal Parallel Hard-Clipper**: Send dynamic vocal peaks or aggressive drum accents into a parallel channel featuring 'JS: Bad Buss Mojo Waveshaper' set to maximum overdrive and a hard-clipper, blending the dirty signal with the main dry vocal only on emphasized words for a gritty, bone-crushing modern metal grit.
       - **Mark Ronson Warm Motown Tape-Saturation Sweep**: Trigger a sudden warmth enhancement on transitional vocal ad-libs by automating 'JClones AC2 (Tape Emulator)' 'Drive' from 30% to 80% combined with a slow, automated lowpass filter cutoff sweep, mimicking a dusty 60s reel-to-reel machine being pushed into red tape compression.
       - **Al Schmitt Invisible Golden-Era Plate Blend**: Send high-register sustained notes of lead vocals into 'Tukan Lexikan 2' configured as a classic EMT 140 plate reverb, automating the send level to swell beautifully to 20% on the sustained note, letting the natural vocal tail bloom into a wide, glassy high-end sheen with zero low-end mud.
       - **Pharrell Williams "Spaced-Out" Ring Modulation Throw**: Send specific ad-libs or background vocals into 'JS: Ring Modulator' with automated carrier frequency sweeping from 100Hz to 1.5kHz, creating a strange, metallic, robotic sci-fi texture that instantly cuts out when the lead vocal resumes.
       - **Stephen Street Jangle-Pop Chorus Width**: Trigger a sudden wide, lofi/high-gloss chorus effect on acoustic guitars or vocal harmony tracks at the start of the chorus by automating the wet mix of 'JS: Saturated Chorus' or 'JS: Flanger' from 0% to 45%, letting the tracks shimmer and wrap around the listeners' heads.
       - **Trent Reznor Industrial Gated Distorted Dust**: Automate an envelope filter and extreme distortion using 'JS: Bad Buss Mojo Waveshaper' and 'JS: Moog 4-Pole Filter' on backing vocals, sidechain-linked to the main industrial snare, so the distorted, dirty vocal dust is gate-chopped in sync with the snare strikes.
       - **Michael Brauer Multi-Bus Saturation Bloom**: Automate the send levels of a lead vocal into four distinct parallel buses (compressor, saturator, micro-pitch shifter, and space-delay), swelling the saturation and micro-pitch buses dynamically on specific key descriptive adjectives to make the words jump out of the speakers with three-dimensional gravity.
       - **Bruce Swedien Wide-Spread Double-Track**: Throw key ending lyrics into an automated micro-delay (10-25ms) on a parallel bus using 'JS: Stereo Field Manipulator' set to absolute maximum Haas-effect panning. This dynamically widens the phrase-ends into a massive, wide double-track with zero frequency cancellation.
       - **Mutt Lange Pop Wall-Of-Sound Vocal Expand**: Automate a dynamic swell of parallel choral widening ('JS: Saturated Chorus' set to high voices, 0.40 depth) and bright shelving EQ on backing vocal ad-libs to make the backing vocals explode into a giant, high-gloss pop wall of sound on key descriptive words.
       - **Sylvia Robinson Old-School Hip-Hop Tape Slap Echo**: Trigger a tight, warm 15 IPS slapback tape echo (80-110ms) on key rap punchlines and nouns using 'JClones AC2 (Tape Emulator)' driven hard into tape saturation, adding instant 1970s analog weight and vintage vibe.
       - **Aphex Twin Glitchy Granular Stutter**: Automate a tiny, ultra-short loop buffer or extreme rate tremolo/gate using 'JS: Noise Gate' with sidechain trigger, combined with high-speed pitch LFO sweeps, to turn a single spoken ending syllable into a digital granular glitch that resets on the next beat.
       - **William Orbit Ambient "Ray of Light" Filter Sweep**: Throw a key transition lyric or vocal tail into a high-feedback modulated delay ('JS: Floaty (Modulated Delay)'), and automate 'JS: Moog 4-Pole Filter' lowpass cutoff to sweep from 200Hz up to 15kHz, letting the echo bloom into glorious digital brightness.
       - **Geoff Emerick Vintage Abbey Road Automatic Double Tracking (ADT)**: Emulate the legendary Abbey Road tape-doubling effect on key vocal phrase entries. Automate the wet mix of a tiny pitch-drift delay (15-30ms delay with 1-2Hz slow LFO) using 'JClones AC2 (Tape Emulator)' to create organic, shifting chorus doubles that mimic a real tape speed variation.
       - **Finneas "Bad Guy" Low-Octave Monster Vocal**: Parallel-pitch shift a whispering key vocal noun down 12 semitones using 'JS: Pitch Shifter 2' panned center, heavily compressing it with 'Tukan NC76', creating a menacing, low-frequency monster double that sits directly under the dry lead vocal on the beat.
       - **Eddie Kramer Rotary Speaker Orbit**: Route high-register vocal ad-libs or long falsetto tails into a vintage Leslie rotary speaker emulator ('JS: Phaser' or 'JS: Saturated Chorus' with fast frequency rate and depth) to make the vocal swirl in a warm, pulsing mechanical circle.
       - **Kanye West "808s & Heartbreak" Robotic Glitch Throw**: Send particular emotional sustained vocal syllables into 'JS: Saturated Chorus' with a fast rate and heavy pitch-quantized auto-pitch simulator, mixed with high-gain 'JS: Distortion (Fuzz)', to create a heartbreaking, robotic vocal glitch.
       - **Bob Ezrin Epic Opera Reverb Explosion**: Automate the wet mix of 'Tukan Lexikan 2' hall reverb from 5% to 60% with a 6-second decay on the final dramatic note of a rock ballad, instantly expanding the dry, intimate vocal into an enormous, cavernous stadium-rock arena space.

`;
const VOCAL_MATCHING_AND_COHESION_PROMPT = `
    CRITICAL - MANDATORY VOCAL MATCHING & TIMBRE/LOUDNESS COHESION:
    When multiple vocal stems are present (e.g., a lead vocal on track A taking up one part of the song and another lead/main vocal on track B taking up another part of the song, or any vocal tracks identified as main vocals), you MUST ALWAYS treat them with extreme cohesive care.
    It is an absolute, mandatory requirement to match these vocals together in EQ tone, dynamic range, compression feel, and especially in volume/loudness level, preventing sudden jumps in volume or jarring tone changes.
    
    0. USER-SELECTED ROLES ARE ABSOLUTE (CRITICAL):
       - You MUST NOT guess or override the role of a stem if the user has explicitly selected/labeled its type/role in the stem options (e.g. 'Lead Vocal', 'Chorus / Hook'). The user-selected dropdown type is the absolute ground-truth.
       - If a stem is labeled as 'Lead Vocal' or 'Chorus / Hook', you MUST treat it as a main lead vocal. Under no circumstances should you classify it as a backing vocal or ad-lib, even if the filename contains "hook", "back", "dubs", or is the second part of a hook.
       - ONLY if the user-selected type is 'Other', 'Unknown', or is unspecified should you fall back to automatic identification using the guidelines below:
         - **Lead Vocal Identifiers**: The track with the highest average RMS level, most continuous waveform activity across major song sections, or file labels containing "Lead", "Main", "Vox_L", "Hook", or "Verse".
         - **Backing Vocal / Ad-lib Identifiers**: Tracks that are audibly quieter (often 6dB to 12dB lower in average signal power), sparse/intermittent in waveform density, consisting primarily of phrase endings, harmonized layers, background chops, or file labels containing "Back", "Dubs", "Harm", "Adlib", or "BGV".
       - **Matching Leveling Protocol**: 
         - If multiple Lead Vocal / Hook tracks are present (including separate hook parts, verse parts, or handoffs), you MUST apply the "Unified Lead matching" protocol to bring them to identical target loudness and identical core mid-range presence.
         - If a track is explicitly labeled as a Backing Vocal or Ad-lib, or is automatically identified as such in the absence of user labels, you MUST NOT level-match it to the Lead. Instead, prescribe a strict relative hierarchy: mix the backing vocal or ad-lib 6dB to 12dB lower, high-pass it more aggressively (e.g., at 120Hz-150Hz), compress it with a faster release to "glue" it into the background, and pan it wider to create stereo separation and leave space for the Lead Vocal panned dead center.

    1. AUTOMATIC VOLUME/LOUDNESS EQUALIZATION:
       - You MUST analyze the relative RMS/LUFS levels of all identified main/lead vocals.
       - You MUST prescribe specific gain-staging values (using 'JS: Volume/Pan Smoother', or equivalent volume faders/gain utility plugins) at the very end of their respective recommended chains to bring them to identical target loudness (e.g. aligning them both to sit exactly at -18 LUFS, or matching their peak and average output faders).
       - Ensure any compression peak reduction is offset by matching makeup gain so that neither track sounds quieter, ensuring an absolutely seamless handoff when the vocal switches.
    
    2. HARMONIC & EQ TIMBRE MATCHING:
       - Match high-pass filters (e.g., matching the cut at exactly 80Hz - 100Hz to remove low-end rumble equally across all main lead vocals).
       - Identify and resolve tonal differences: if track A is slightly darker and track B is brighter, prescribe exact EQ curves (e.g. boosting 12kHz shelf on track A by +1.5dB or cutting harsh 3.5kHz frequencies on track B) to make them sound like they were recorded with the same microphone, in the same room, with the exact same proximity effect.
       
    3. DYNAMIC COMPRESSION ALIGNMENT:
       - Apply consistent compression styles across all main vocal tracks. If you recommend an analogue FET compressor (like 'JS: 1175') or leveling amplifier (like 'JClones CA2A') on one vocal, you MUST recommend equivalent dynamic leveling on the other with matching target threshold and gain reduction values (e.g., targeting exactly 3-4dB of gain reduction on peaks for both).
       
    4. ABSOLUTE COHESION INTEGRITY:
       - In the overall feedback and individual action steps for vocal tracks, explicitly detail the "Vocal Cohesion Alignment Plan". Explain what adjustments were made to ensure absolute sonic continuity across the tracks.
`;
const ADLIB_PROCESSING_PROTOCOL_PROMPT = `
    CRITICAL - AD-LIB ARCHITECTURE PROTOCOL:
    When you identify stems as Ad-libs, you MUST apply this specific spatial and dynamic protocol to ensure they sit perfectly behind and around the Lead Vocal, never competing with it.

    1. SPATIAL WIDENING & PANNING:
       - Ad-libs MUST NOT be panned dead center if the lead vocal is present. 
       - Prescribe hard panning (e.g., 100% L and 100% R for doubles) or extreme stereo widening (using 'JS: Stereo Field Manipulator' or 'JS: Saturated Chorus') to push them to the absolute edges of the stereo field.
       
    2. FREQUENCY CARVING (The "Telephone" / "Radio" Effect):
       - Ad-libs need to occupy a different frequency pocket than the lead.
       - Aggressively high-pass (e.g., 200Hz - 300Hz) to remove all low-end chest resonance.
       - Apply a low-pass filter (e.g., 7kHz - 10kHz) or aggressive mid-range bandpass (telephone EQ) to keep them from clashing with the crispness and air of the main vocal.

    3. INDIVIDUAL AD-LIB LOUDNESS & VOLUME MATCHING (CRITICAL):
       - Even if multiple ad-libs are printed onto a single ad-lib track, you MUST prescribe specific volume automation or clip-gain strategies to individually loudness match and volume match every single ad-lib phrase.
       - You must recommend dynamic EQ or precise volume automation ('JS: Volume/Pan Smoother') so that every individual ad-lib hits the exact same target RMS/LUFS level. Do not let one ad-lib be loud and the next one be quiet on the same track.

    4. DYNAMIC SQUASHING & TRANSIENT TAMING:
       - Ad-libs should not have punchy transients that distract from the main vocal.
       - Prescribe fast-attack, fast-release compression (e.g., 'Tukan NC76' or 'JS: 1175' at high ratios) to squash them completely flat, keeping their volume strictly controlled.
       - Ensure their overall leveled volume is consistently mixed at least -6dB to -12dB below the lead vocal.

    5. EXAGGERATED EFFECTS & TEXTURES:
       - Recommend exaggerated time-based effects: heavy distortion, flangers, phasers, massive plate reverbs ('Tukan Lexikan 2'), or 1/4 note ping-pong delays.
       - Ad-libs are the ideal place to utilize the "Legendary Producer Automation Chains" (like Finneas' Whisper Gate, Travis Scott's Auto-Tune Detune, or Tchad Blake's Binaural panning).

    6. LEGENDARY AD-LIB AUTOMATION TRICKS:
       When processing Ad-libs, you MUST draw from these 40 legendary signature styles and specify exact JSFX automation coordinates:
       - **Travis Scott / Mike Dean "Demonic Pitch-Drop"**: Automate a pitch shifter ('JS: Pitch Shifter 2') down 12 semitones instantly on an ad-lib entering, paired with high-feedback ping-pong delay ('JS: Delay (Ping Pong)'), dropping the ad-lib into a deep, cavernous abyss.
       - **Playboi Carti "Baby Voice" Helium Lift**: Automate formant/pitch shifting ('JS: Pitch Shifter 2') up by +12 semitones on high-energy ad-libs ("What!", "Yeah!"), saturated aggressively with 'JS: Distortion (Fuzz)' to make the tiny vocals pierce the sub-heavy beat.
       - **Migos / Quavo "Triplet Machine Gun" Stutter**: Trigger an extreme tempo-synced gate ('JS: Noise Gate') or tremolo locked to 1/8 triplets on sustained ad-lib vowels, chopping them rhythmically in time with the trap hi-hats.
       - **A$AP Rocky "Chopped & Screwed" Reverse Warp**: Throw an ad-lib through a reverse delay simulation or negative time-offset ('JS: Delay'), automating 'JClones AC2' tape slowdown (wow and flutter) to warp and melt the vocal tail into the beat drop.
       - **Juice WRLD / Nick Mira "Emo Wash" Flanger Swell**: Automate the wet mix of a thick flanger ('JS: Flanger') and a long 4-second hall reverb ('Tukan Lexikan 2') to swell from 10% to 100% on emotional ad-libs, pushing the vocal backwards into a huge cinematic wash.
       - **Young Thug "Slime" Auto-Pan Laser**: Hard-pan short, staccato ad-libs using a rapid LFO ('JS: Auto-Pan') syncing to 1/16 notes. As the ad-lib finishes, automate the width parameter to collapse back to mono, sounding like a stereo laser beam retracting.
       - **Missy Elliott / Timbaland "Reverse Backmasking"**: Automate a combination of 'JS: Pitch Shifter 2' (formant shifted) and 'JS: Delay' set to high feedback and reversed logic, turning standard ad-lib interjections into alien, reversed percussive backmasking.
       - **Pop Smoke / 808Melo "Brooklyn Drill" Distorted Bark**: Route ad-libs (grunts, barks) into a parallel distortion channel ('JS: Bad Buss Mojo Waveshaper') set to extreme drive, gating out the tails instantly ('JS: Noise Gate') so the ad-lib punches like a distorted 808 kick.
       - **Kendrick Lamar "Multiple Personality" Micro-Pitch**: Automatically toggle left and right micro-pitch lanes (+5 cents and -5 cents via 'JS: Pitch Shifter 2') on and off for alternating ad-lib phrases, giving the illusion of multiple different voices answering the lead vocal.
       - **The Weeknd / Illangelo "Cinematic High-Pass Filter Sweep"**: Send a long, melodic ad-lib to an infinite delay loop, then automate the high-pass filter ('JS: RBJ Highpass/Lowpass Filters') from 200Hz up to 5kHz smoothly across two bars, letting the ad-lib dissolve into pure high-end air.
       - **JID / Christo "Rapid-Fire Formant Shifting"**: Automate the formant parameter of 'JS: Pitch Shifter 2' rhythmically across fast ad-lib syllables, bouncing between high chipmunk tones and low demonic pitches on every other beat.
       - **Kid Cudi "Lunar Hum" Space Echo**: Send melodic humming ad-libs into 'JS: Delay (Lo-Fi)' combined with 'Tukan Lexikan 2' hall reverb, automating the delay feedback to near self-oscillation while keeping the dry signal muted, creating an endless space hum.
       - **Snoop Dogg / Dr. Dre "G-Funk Telephone" Double**: Aggressively band-pass filter ('JS: RBJ Highpass/Lowpass Filters' 400Hz-3kHz) an ad-lib and layer it with 'JS: Distortion (Fuzz)' to create a gritty, compressed vintage telephone vocal answering the lead.
       - **Eminem / Dr. Dre "Schizophrenic Whisper" Panning**: Hard pan whispered ad-libs alternating 100% Left and 100% Right on consecutive words, squashed completely flat by 'Tukan NC76', making the voices sound like they are whispering directly into the listener's ears.
       - **Tyler, The Creator "Gritty Lo-Fi Tape Saturation"**: Process ad-libs through 'JClones AC2' pushed to maximum input drive with high wow and flutter, automating a low-pass filter to slowly roll off the highs, simulating a degrading cassette tape.
       - **Frank Ocean "Prism" Multi-Octave Choir**: Duplicate the ad-lib into three parallel channels using 'JS: Pitch Shifter 2': one +12 semitones, one -12 semitones, and one dry. Automate the volume of the octaves to swell in and out, creating an artificial glowing choir.
       - **J. Cole / Omen "Soulful Reverse Reverb Swell"**: Take the first syllable of a vocal ad-lib, reverse it, apply a heavy 3-second 'Tukan Lexikan 2' plate reverb, and reverse it back, automating the volume to swell right before the actual ad-lib hits.
       - **Drake / 40 "Underwater Muffled Echo"**: Apply a steep 800Hz low-pass filter ('JS: RBJ Highpass/Lowpass Filters') to an ad-lib and send it to 'JS: Delay (Ping Pong)', creating a dark, murky, underwater echo that doesn't clash with the bright lead.
       - **Lil Uzi Vert "Anime Sparkle" High-Shelf Boost**: Aggressively boost a high-shelf EQ ('JS: ReJJ/ReEQ') at 12kHz by +10dB on energetic ad-libs, sending them through 'JS: Saturated Chorus' to create a hyper-bright, sparkling synthetic texture.
       - **Busta Rhymes "Monster Growl" Sub-Harmonic Generation**: Send aggressive ad-libs into a pitch shifter ('JS: Pitch Shifter 2') tuned down -12 semitones, heavily compressed and low-passed at 500Hz, blending it subtly underneath the dry ad-lib for added chest-rattling weight.
       - **Rosalía / El Guincho "Flamenco Handclap" Vocal Staccato**: Automate an ultra-fast noise gate ('JS: Noise Gate') combined with 'JS: Distortion (Fuzz)' on short rhythmic vocal ad-libs to make them snap and hit as hard as organic handclaps or castanets in the stereo field.
       - **Kanye West "Yeezus" Brutalist Bitcrush**: Route screaming ad-libs into 'JS: Bit Reduction/Dither' (reducing to 4-8 bits) and 'JS: Bad Buss Mojo Waveshaper', creating a harsh, digital, tearing distortion that violently cuts through heavy synths.
       - **Anderson .Paak "Vintage Soul" Slapback Plate**: Throw raspy ad-libs into a fast 80ms delay ('JS: Delay') feeding directly into a short, bright plate reverb ('Tukan Lexikan 2'), keeping it extremely dry but with a sharp 1970s analog reflection.
       - **Childish Gambino "Redbone" Helium Chorus**: Automate formant shifting up (+5 to +7) without changing the pitch ('JS: Pitch Shifter 2'), and run it through a wide, slow 'JS: Saturated Chorus' to create an alien, funk-psychedelic backing vocal texture.
       - **Mac Miller "Swimming" Jazzy Vinyl Pitch-Drift**: Process melodic hums or background vocals through 'JClones AC2' with extreme tape wow/flutter and a subtle 'JS: Auto-Pan' sweeping slowly across the stereo spectrum, giving them a woozy, aquatic jazz feel.
       - **Future "Codeine" Slurred Pitch Dive**: Take the tail end of an ad-lib and automate 'JS: Pitch Shifter 2' to slowly slide down -5 to -12 semitones over 2 beats, slurring the vocal down into a dark, syrupy slow-motion drawl.
       - **SZA / Carter Lang "Lo-Fi Bedroom" Cassette Muffle**: EQ the ad-libs drastically with 'JS: RBJ Highpass/Lowpass Filters' (HP at 400Hz, LP at 4kHz) and add a high noise floor / vinyl crackle to make the vocal sound like an intimate, dusty cassette tape recording layered behind the pristine lead.
       - **Don Toliver "Psychedelic Trap" Shimmering Phased Echo**: Send the ad-lib into a 1/4 note 'JS: Delay (Ping Pong)', and route the delay tails into a slow, wide 'JS: Phaser', making the echoes swirl and shimmer psychedelically around the listener.
       - **Rihanna / Kuk Harrell "Pop-Gloss" Razor-Sharp Widening**: Squash ad-libs with aggressive 'Tukan NC76' compression, boost the 10kHz+ air band by +8dB, and use 'JS: Stereo Field Manipulator' to push them 150% wide, creating a hyper-polished, razor-sharp pop backing vocal halo.
       - **Tame Impala / Kevin Parker "Laser Beam" Flanger Drop**: On transition ad-libs or heavy sighs, automate the resonance and feedback of 'JS: Flanger' to maximum while sweeping the delay time, creating a jet-engine laser beam sound that rockets across the mix.
       - **Denzel Curry "Moshpit" Overdriven Megaphone**: Route high-energy hype ad-libs into extreme clipping via 'JS: Distortion (Fuzz)', drastically rolling off the bass (HPF at 500Hz) and treble (LPF at 4kHz) with 'JS: RBJ Highpass/Lowpass Filters' to sound like an overdriven megaphone cutting through a dense metal-trap mix.
       - **Aaliyah / Timbaland "Stutter-Step" Rapid Tremolo**: On smooth R&B vocal tail ad-libs, apply 'JS: Tremolo' synced tightly to 1/16th or 1/32nd notes, automating the depth to ramp up fully at the phrase end for a classic futuristic stutter fade-out.
       - **Ski Mask The Slump God "Cartoon Fast-Forward"**: Pitch shift an ad-lib up by an extreme +24 semitones and speed it up dynamically using 'JS: Pitch Shifter 2' and 'JS: Delay', creating a ridiculous, cartoonish fast-forward squeak to add playful bounce to the beat.
       - **James Blake "Digital Choir" Granular Freeze**: Capture a single sung ad-lib vowel, run it through an infinite feedback loop on 'JS: Delay (Lo-Fi)' with 'JS: Saturated Chorus', creating a frozen, haunting digital choir pad that sustains underneath the entire section.
       - **Vince Staples / SOPHIE "Metallic Synth" Ring Modulator**: Process spoken ad-libs through 'JS: Ring Modulator' with a high-frequency carrier, making the vocal tone sound like a cold, metallic synth stab or a scraping piece of sheet metal.
       - **Gunna "Drip" Liquid Chorus Sweeps**: Soften melodic ad-libs by routing them into 'JS: Saturated Chorus' with a deep, slow LFO sweep, combined with an automated 'JS: RBJ Highpass/Lowpass Filters' sweeping down from 10kHz to 2kHz, making the vocal sound like it's dissolving into water.
       - **JPEGMafia "Internet Glitch" Random Bit-Crushing**: Automate 'JS: Bit Reduction/Dither' bit depth parameters randomly between 2-bit and 16-bit on loud ad-lib screams, causing digital chaos and unpredictable, broken-audio aesthetic spikes.
       - **Earl Sweatshirt "Depressive" Mono-Fi Tape Degradation**: Compress the ad-lib heavily, sum it to strict mono, and run it through 'JClones AC2' with severe high-frequency roll-off and prominent tape hiss to create a stark, claustrophobic, lo-fi depression effect.
       - **Burna Boy "Afrobeats" Wide Shimmer Delay**: Use a pitch-shifted delay throw (delaying +1 octave, using 'JS: Pitch Shifter 2' inside the delay feedback loop) on the end of a chanted ad-lib, spreading it to 200% stereo width to create a shimmering, celebratory afro-fusion halo.
       - **Skepta "Grime" Sub-Bass Vocal Drop**: Take a deep, low-register ad-lib or grunt, pitch it down -12 semitones, squash it with 'JS: 1175', and boost the 60Hz-80Hz sub frequencies heavily, using the vocal ad-lib itself as an impact bass drop for the track.
`;
const BACKING_VOCAL_PROCESSING_PROTOCOL_PROMPT = `
    CRITICAL - BACKING VOCAL ARCHITECTURE PROTOCOL:
    When you identify stems as Backing Vocals, Harmonies, or Dubs, you MUST apply this specific spatial and dynamic protocol to ensure they provide a rich supportive bed behind the Lead Vocal.

    1. SPATIAL WIDENING & PANNING:
       - Backing vocals should be pushed out wide to make room for the lead vocal in the center.

    2. LEGENDARY BACKING VOCAL AUTOMATION TRICKS:
       When processing Backing Vocals, Harmonies, or Dubs, you MUST draw from these 10 legendary signature styles and specify exact JSFX automation coordinates:
       - **Queen / Roy Thomas Baker "Bohemian Wall"**: Overdub multiple backing vocal takes, hard pan them 100% Left and Right, and squash them aggressively with 'Tukan NC76'. Automate a slow, rich 'JS: Saturated Chorus' across the bus to merge the voices into a single, massive choral wall.
       - **Michael Jackson / Bruce Swedien "Percussive Breath" Stacks**: Aggressively high-pass backing vocal rhythmic layers at 300Hz and use a fast-attack gate ('JS: Noise Gate') to emphasize the percussive consonants and breaths, making the backing vocals function as part of the drum groove.
       - **Destiny's Child / Darkchild "R&B Silk" Micro-Tuning**: Apply subtle 'JS: Pitch Shifter 2' (+4 cents Left, -4 cents Right) on R&B harmonies, rolling off the highs above 8kHz smoothly. This thickens the chord structures into a smooth, silky R&B bed without clashing with the lead.
       - **Def Leppard / Mutt Lange "Hysteria" Gated Reverb Choir**: Send a massive stack of backing vocals into 'Tukan Lexikan 2' hall reverb and immediately gate the reverb tail ('JS: Noise Gate') to cut off perfectly on the snare beat, creating a huge, synthetic arena-rock vocal explosion.
       - **The Beach Boys / Brian Wilson "Phil Spector Echo"**: Run tight vocal harmonies through an entirely mono bus, heavily saturate them with 'JS: Distortion (Fuzz)', and send them into a long, dark 'JS: Delay' feeding a mono 'Tukan Lexikan 2' plate, recreating the 1960s "Wall of Sound".
       - **Steely Dan "Smooth Jazz" Pinpoint EQ Separation**: Create extreme tonal contrast between lead and backing vocals by scooping the mid-range (1kHz-3kHz) out of the backing vocals using 'JS: ReJJ/ReEQ', allowing the lead vocal to sit perfectly in the center pocket.
       - **Enya "Celtic Ethereal" Infinite Reverb Wash**: Send backing vocals to an ultra-long (8+ seconds) dark 'Tukan Lexikan 2' reverb. Automate the backing vocal track volume to swell in slowly beneath the lead, completely blurring the consonants into an evolving ambient pad.
       - **Outkast "SpottieOttie" P-Funk Phased Harmonies**: Run a bus of soulful backing vocals through a thick, slow 'JS: Phaser' and 'JS: Auto-Pan', making the choir swirl heavily from speaker to speaker like a vintage 1970s funk record.
       - **Fleetwood Mac / Ken Caillat "Acoustic Warmth" Tape Saturation**: Send gentle acoustic backing vocals into 'JClones AC2' (Tape Emulator) at 15 IPS, driving the input just enough to smooth out the transient peaks, resulting in a buttery, warm 1970s California soft-rock harmony.
       - **Bon Iver "Messina" Prism Vocoder**: Duplicate a backing vocal into 4 separate channels. Run each through 'JS: Pitch Shifter 2' tuned to different intervals of a chord (e.g., +3, +7, -5, -12 semitones). Squash them with 'JClones CA2A' to create a synthetic, robotic indie-folk choir.
`;

const BEAT_INSTRUMENTAL_PROCESSING_PROTOCOL_PROMPT = `
    CRITICAL - BEAT & INSTRUMENTAL AUTOMATION PROTOCOL:
    When you identify stems as Beats or Instrumentals, you MUST provide creative automation to keep the track dynamic.
    
    1. ARRANGER TRICKS & DYNAMICS:
       - Automate volume dips on the instrumental just before the chorus drops to increase impact.
       - Automate high-pass or low-pass filter sweeps ('JS: RBJ Highpass/Lowpass Filters') during transitions to create tension and release.
       - Recommend tape stops or rhythmic gating ('JS: Noise Gate') at key moments.

    2. LEGENDARY BEAT/INSTRUMENTAL AUTOMATION TRICKS:
       You MUST draw from these 10 legendary instrumental automation styles and specify exact JSFX automation coordinates:
       - **J Dilla "Drunk Swing" Micro-Shifting**: For rigid instrumentals, automate 'JS: Time Adjustment' randomly between -10ms and +15ms on snares and hi-hats to pull them off the grid, giving the beat a woozy, humanized Detroit hip-hop swing.
       - **Daft Punk "French Touch" Pumping Compression**: Set up a sidechain compressor ('JS: 1175' or similar) on the entire instrumental bus keyed to the kick drum. Automate the threshold and ratio to create an exaggerated, breathing, rhythmic pumping effect synonymous with French house music.
       - **Timbaland "Beatbox" Stereo Panning**: On percussion or drum stems, use 'JS: Auto-Pan' or automate manual panning rapidly across the stereo field on 16th or 32nd note subdivisions during fills, making the drums scramble frantically around the listener's head.
       - **Kanye West "MPC" Sample Stutter**: Use 'JS: Tremolo' or 'JS: Noise Gate' set to a rigid square wave at 1/16th or 1/8th note sync, automating it to turn on strictly at the end of every 4th bar to create a classic MPC-style sample stutter/chop effect.
       - **Noah "40" Shebib "Underwater" Filter Automation**: Automate a steep low-pass filter ('JS: RBJ Highpass/Lowpass Filters') down to 300Hz-800Hz on the entire instrumental track during verses or intros, cutting all treble and making the beat sound entirely submerged underwater, then snapping back to full frequency on the drop.
       - **Flume "Granular Glitch" Freeze**: Send synth or instrumental stems into a fast 'JS: Delay (Lo-Fi)', automating the feedback to 100% and delay time to sub-10ms increments on transition points, creating a metallic, buzzing granular freeze that abruptly cuts off into silence.
       - **Rick Rubin "Def Jam" Extreme Saturation Drop**: Automate 'JS: Distortion (Fuzz)' or tape saturation ('JClones AC2') on the drum bus to violently overdrive the drums for one specific measure before a chorus, creating explosive analog energy right before the lead vocal re-enters.
       - **The Neptunes / Pharrell "Dry-as-a-Bone" Subtractive EQ**: aggressively carve out the lower-mid frequencies (200Hz - 400Hz) using 'JS: ReJJ/ReEQ' and strip all reverb/delay off the instrumental bus, leaving a skeletal, ultra-dry, perfectly separated arrangement where the bass and snare hit like hammers.
       - **Metro Boomin "Dark Trap" Half-Time Slowdown**: Automate a pitch drop (-12 semitones via 'JS: Pitch Shifter 2') combined with a low-pass filter ('JS: RBJ Highpass/Lowpass Filters') to slow down the entire instrumental loop at the end of the song or during a bridge, creating a syrupy, menacing half-time trap transition.
       - **Aphex Twin "IDM" Random Filter Sweeps**: Assign a fast, chaotic LFO to the cutoff frequency of a bandpass filter ('JS: RBJ Highpass/Lowpass Filters') applied to hi-hats or synths, automating the LFO depth to twitch and squelch aggressively, creating unpredictable, glitchy IDM textures.
`;
const FUNCTION_AUTOMATION_PROMPT = `
    CRITICAL - STUDIO ONE PROFESSIONAL FUNCTIONS & AUTOMATION:
    The user can perform several "Silent Functions" via automation commands in their DAW. You MUST recommend using these in the 'actionPlan' when applicable:
    1. "Quantize": Use this for fixing timing issues on MIDI or Audio events (e.g., "Automation Command: Quantize").
    2. "Transpose": Use for pitching tracks up/down (e.g., "Automation Command: Transpose [-12 semitones]").
    3. "Silence Detection / Strip Silence": Use for cleaning up noise floor on recordings (e.g., "Automation Command: Detect Silence").
    4. "Audio Bend / transient Detection": Use for surgical rhythmic correction on audio stems.
    5. "Chord Detection": Use for harmonic analysis to extract chords to the global Chord Track.
    6. "Bounce Selection": Use for printing heavy processing chains into new audio files to save CPU.
    7. "Merge Events": Use for combining track segments for cleaner project organization.
    8. "Mixtool": A native PreSonus utility. Recommend it for phase inversion or gain staging without using a dedicated saturation/compression plugin.
`;
const GLOBAL_PARAMETER_STRICTNESS_PROMPT = `
    CRITICAL - STRICT PARAMETER REALISM, UNITS, & O'CLOCK POSITIONING:
    1. ZERO HALLUCINATION (FIREABLE OFFENSE): You MUST ONLY suggest parameters that actually exist on the real-world interface of the specified plugin as documented in its official manual. NEVER invent, guess, hallucinate, or inject parameters that do not exist on that plugin.
    2. STRICT UNIT ACCURACY: You MUST use the exact, correct unit of measurement for every parameter (e.g. Hz, kHz, dB, ms, %, etc.).
    - CRITICAL LURSSEN MASTERING CONSOLE REAL-WORLD RULES: For "IK Multimedia - Lurssen Mastering Console", you MUST adhere strictly to its real physical/software GUI interface:
      1. Input Drive: Measured in dB with decimal precision allowed (-15.0 dB to +15.0 dB, e.g. "2.8 dB", "1.5 dB", "-3.0 dB").
      2. 5 Band EQ (60Hz, 120Hz, 3kHz, 6kHz, 10kHz):
         - MUST BE WHOLE INTEGERS ONLY (e.g. "+1 dB", "-1 dB", "0 dB", "+2 dB", "-2 dB", "+8 dB", "+10 dB").
         - ABSOLUTELY NO DECIMALS OR .5s ALLOWED FOR EQ (e.g. NO 0.5 dB, NO -0.5 dB, NO 1.5 dB). Step size is strictly 1 dB integers on the dials (0, 1, -1, 2, -2, etc.).
      3. Push:
         - Measured in PERCENTAGE (%) with range from -100% to +100% (default is "0%").
         - Format strictly as percentage (e.g. "0%", "+5%", "+10%", "+50%", "+100%", "-100%"). Values above 100% do not exist on the GUI.
         - MASTER BEHAVIOR: Push is a master EQ gain offset control — turning Push shifts and moves ALL 5 EQ BAND DIALS simultaneously in unison (+100% Push pushes all 5 dials up by +10 dB, -100% pulls all 5 dials down by -10 dB).
      4. Style / Genre Preset: Must select one of the 40 built-in presets (e.g. "Pop Rock", "Hard Rock", "Hip Hop", "EDM", "Americana", "Jazz", "Country", "Pop", "Heavy Metal", etc.).
    3. REAPER JSFX MASTER RESEARCH PROFILES (USE FOR COCKOS JSFX RECOMMENDATIONS):
       - "JS: 1175 Compressor" (1175 Compressor - Stock Cockos REAPER JSFX):
         - S1 (Threshold (dB)): -60 to 0 dB (Default: 0).
         - S2 (Ratio): Selection 0 to 9 (Default: 5).
         - S3 (Gain (dB)): -20 to 20 dB. CRITICAL: When using 1175, set S3 to exactly compensate for the threshold gain reduction (e.g. if S1 is -12dB and you get roughly 3dB of gain reduction, set S3 to +3dB). Never add excessive makeup gain (+6dB to +18dB is strictly forbidden).
         - S4 (Attack (uS)): 20 to 2000 uS.
         - S5 (Release (mS)): 20 to 1000 mS.
         - S6 (Mix (%)): 0 to 100 %.
       - "JS: Volume/Pan Smoother":
         - S1 (Volume (dB)): -60 to 12 dB. Perfect for final clear leveling.
         - S2 (Pan): -100 to 100 (0 is Center).
         - S3 (Pan Law (dB)): -6 to 6 dB.
       - "JS: LOSER/EventHorizon" (Event Horizon Clipper/Limiter - Stock Cockos REAPER JSFX):
         - S1 (Threshold): -30 to 0 dB.
         - S2 (Ceiling): -20 to 0 dB (Keep around -0.1 to -0.5 for brickwall safety).
         - S3 (Release (ms)): 0 to 1200 ms.
       - "JS: LOSER/3BandEQ" (3-Band EQ):
         - S1 (Low (dB)): -24 to 24 dB.
         - S2 (Frequency (Hz)): 0 to 22000 Hz.
         - S3 (Mid (dB)): -24 to 24 dB.
         - S4 (Frequency (Hz)): 0 to 22000 Hz.
         - S5 (High (dB)): -24 to 24 dB.
         - S6 (Output (dB)): -24 to 24 dB.
       - "JS: Chorus" (Stereo Chorus):
         - S1 (Chorus Length (ms)): 1 to 500 ms.
         - S2 (Number Of Voices): 1 to 8.
         - S3 (Rate (Hz)): 0 to 16 Hz.
         - S4 (Pitch Fudge Factor): 0 to 1 (Keep around 0.5 for optimal chorus modulation).
         - S5 (Wet Mix (dB)): -100 to 12 dB.
         - S6 (Dry Mix (dB)): -100 to 12 dB.
         - S7 (Channel Rate Offset (Hz)): -1 to 1 Hz.
         - S8 (Tempo Sync): 0.0625 to 4.
       - "JS: Delay" (Delay Tone Control):
         - S1 (Length (ms)): 0 to 4000 ms.
         - S2 (Feedback (dB)): -120 to 6 dB.
         - S3 (Bass Gain (dB)): -60 to 60 dB.
         - S4 (Bass Frequency (Hz)): 20 to 24000 Hz.
         - S5 (Treble Gain (dB)): -60 to 60 dB.
         - S6 (Treble Frequency (Hz)): 20 to 24000 Hz.
         - S7 (Output Mix): 0 to 1.
    4. DEEP COCKOS JSFX BEHIND-THE-SCENES UNDERSTANDING:
       - You must leverage detailed, expert knowledge of how these JSFX work internally. 
       - STRICT PARAMETER RESTRICTION: You are strictly forbidden from suggesting non-existent parameters or plugins. Specifically:
         - NEVER suggest 'Width (ms)', 'Width', 'Frequency (Hz)', 'Voices', 'Delay (ms)' or 'Wet (dB)' for 'JS: Chorus'. The exact slider parameters are S1: 'Chorus Length (ms)', S2: 'Number Of Voices', S3: 'Rate (Hz)', S4: 'Pitch Fudge Factor', S5: 'Wet Mix (dB)', S6: 'Dry Mix (dB)', S7: 'Channel Rate Offset (Hz)', S8: 'Tempo Sync'.
         - NEVER suggest 'Ceiling (dB)' or 'Makeup Gain' for 'JS: 1175 Compressor' (since they do not exist on the 1175, it uses Gain S3).
         - NEVER suggest the plugin name 'JS: Event Horizon Clipper/Limiter' as a raw display; always use its correct stock filename path: 'JS: LOSER/EventHorizon'.
         - Never output parameters that do not exist on default stock Cockos REAPER JSFX plugins.
       - Vocals must sit upfront and never be quiet. When using FET style compressor "1175", compensate for the threshold compression reduction by setting S3 (Gain) to match the estimated gain reduction (typically +2dB to +4dB, never exceed +4dB). Avoid large, arbitrary gain boosts that create excessive loudness.
       - A premium 6-plugin chain MUST be modeled all the time for vocal or stem processing to ensure a grammy-level sound.
    5. STRICT LEVEL-MATCHED GAIN STAGING: Anytime you use a plugin that alters volume (like EQ cuts/boosts, compression, saturation, etc.), you MUST configure the plugin's output level/trim/makeup gain parameter so that the perceived output volume matches the input volume (level-matching). The goal is zero cumulative volume change across the chain (avoid gain creep). Avoid outputting any settings that add massive cumulative gain. Never suggest chains with cumulative gain hikes that exceed a total of +3dB across the entire chain. Each individual plugin should ideally have a net gain change of 0dB (or within +/- 1dB).
    6. STRICT DISTORTION & CLIPPING PREVENTION (ZERO DISTORTION TOLERANCE): Under no circumstances should any recommended mastering/leveling chain push the overall loudness of an instrumental or full mix to extreme levels that cause digital clipping, harmonic degradation, or audible distortion. Keep target integrated loudness within safe, professional streaming levels (typically -14.0 LUFS to -10.0 LUFS for competitive music, never pushing past -8.0 LUFS unless explicitly requested, and absolutely never pushing towards -4.0 LUFS which ruins dynamic range and causes major distortion). Always set the limiter's output ceiling/margin to a secure buffer (minimum -1.0 dB or -1.0 dBTP true peak, never higher than -0.5 dB) to prevent inter-sample clipping on downstream D/A converters. Always preserve at least 1.0 to 2.0 dB of clean dynamic headroom before the final limiting/clipping stage. Unless the user explicitly asks for "lo-fi distortion" or "bitcrushing" as a creative artistic effect, you must strictly avoid suggesting aggressive waveshapers, hard clippers, or overdriven compressors/saturators on full mixes or master buses.
    7. MANDATORY UNIVERSAL AUDIO (UAD) PARAMETER O'CLOCK VALUE RULE:
       - Whenever you recommend or suggest any parameter value for any Universal Audio (UAD) plugin (e.g. LA-2A, 1176, Pultec EQP-1A, Neve 1073, API Vision, SSL 4000 E, Fairchild 670, Studer A800, Ampex ATR-102, Empirical Labs Distressor, Capitol Chambers, Lexicon 224, etc.):
       - You MUST display the EXACT physical setting AND its exact physical knob rotation as an "o'clock" position (ranging from 7:00 o'clock to 5:00 o'clock representing the standard physical dial sweep).
       - For example:
         - Instead of writing "Peak Reduction: 40" or "Peak Reduction: 4", you MUST write "Peak Reduction: 40 (1:00 o'clock)" or "Peak Reduction: 40 [1:00 o'clock]".
         - Instead of writing "Input: 30", you MUST write "Input: 30 (10:15 o'clock)".
         - Instead of writing "Gain: +3.5dB" or "Gain: 3.5", you MUST write "Gain: +3.5dB (12:45 o'clock)".
         - Instead of writing "Time Constant: 4", you MUST write "Time Constant: 4 (12:00 o'clock)".
       - This rule applies strictly to ALL parameter values in the "value" fields inside 'deepDive', 'vocalElements', 'trackingChain', and in any text-based mix advice, action plans, or recipes.
       - O'clock physical positions always map linear percentage/MIDI range 0-100 or 0-10 to the 7:00 to 5:00 clock sweep:
         - 0% or 0 value = 7:00 o'clock (fully counter-clockwise)
         - 25% or 2.5 value = 9:30 o'clock
         - 50% or 5.0 value = 12:00 o'clock (straight up)
         - 75% or 7.5 value = 2:30 o'clock
         - 100% or 10 value = 5:00 o'clock (fully clockwise)
       - YOU MUST NEVER SUGGEST A UAD PLUGIN PARAMETER VALUE WITHOUT SPECIFYING ITS EXACT O'CLOCK POSITION. THIS IS THE USER'S HIGHEST PRIORITY.
    CRITICAL WARNING: NEVER RETURN AN EMPTY RECIPES ARRAY. You MUST ALWAYS generate at least one complete recipe that fulfills the user's request, regardless of strictness constraints.
`;
function postProcessResult(result: any) {
  const processChain = (chain: any[]) => {
    if (!chain || !Array.isArray(chain)) return chain;
    try {
      return applySafeParameterMappingToChain(chain, undefined, false);
    } catch (e) {
      console.warn("Error applying safe param mapping:", e);
      return chain;
    }
  };

  const processRecipe = (recipe: any) => {
    if (recipe && recipe.instruments && Array.isArray(recipe.instruments)) {
      recipe.instruments.forEach((inst: any) => {
        if (inst && Array.isArray(inst.fxPlugins)) {
          inst.fxPlugins = processChain(inst.fxPlugins);
        }
      });
    }
    if (recipe && recipe.busses && Array.isArray(recipe.busses)) {
      recipe.busses.forEach((bus: any) => {
        if (bus && Array.isArray(bus.fxPlugins)) {
          bus.fxPlugins = processChain(bus.fxPlugins);
        }
      });
    }

    if (recipe && typeof recipe.drumPatterns === 'object' && recipe.drumPatterns !== null && !Array.isArray(recipe.drumPatterns)) {
      Object.values(recipe.drumPatterns).forEach((section: any) => {
        if (section) {
          ['kick', 'snare', 'hiHat'].forEach(drum => {
            if (section[drum] && Array.isArray(section[drum].steps)) {
              const steps = section[drum].steps;
              const velocities = section[drum].velocities;
              if (Array.isArray(velocities)) {
                section[drum].steps = steps.map((step: number, index: number) => {
                  if (velocities[index] !== undefined) {
                    return { step, velocity: velocities[index] };
                  }
                  return step;
                });
              }
              delete section[drum].velocities;
            }
          });
        }
      });
    }
  };
  if (result) {
    if (Array.isArray(result.recipes)) {
      result.recipes.forEach(processRecipe);
    } else if (Array.isArray(result)) {
      result.forEach(processRecipe);
    } else if (result.recipe) {
      processRecipe(result.recipe);
    } else if (result.drumPatterns) {
      processRecipe(result);
    }
  }
  return result;
}

function validateRecipeResponse(result: any) {
  if (!result || !result.recipes || !Array.isArray(result.recipes) || result.recipes.length === 0) {
    if (result && result.recipe) {
      result = { recipes: [result.recipe] };
    } else if (result && result.drumPatterns) {
      result = { recipes: [result] };
    } else {
      throw new Error("No recipes returned in the generated output. The AI might have been interrupted or provided an incomplete response.");
    }
  }

  if (result.recipes) {
    for (const recipe of result.recipes) {
      if (!recipe.instruments || !Array.isArray(recipe.instruments) || recipe.instruments.length === 0) {
         throw new Error(`Recipe "${recipe.title || 'Untitled'}" was generated without any instruments or plugins. Please try again.`);
      }
    }
  }
  return result;
}
const getLanguageInstruction = (language: string) => {
  if (language === 'en') {
    return `
      CRITICAL: You MUST generate the entire response in English.
      Do NOT include any translations or text in parentheses next to technical parameter names.
    `;
  }
  return `
    CRITICAL LOCALIZATION RULES:
    1. You MUST generate all instructional text, explanations, advice, and feedback in the following language: ${language}.
    2. TECHNICAL PARAMETER NAMES: You MUST keep technical plugin parameter names (e.g., "Threshold", "Ratio", "Attack", "Release", "Cutoff", "Resonance", "Gain", "Makeup", "Dry/Wet") in their original ENGLISH form. 
    3. You may provide the translation of the parameter in parentheses next to the English name if it helps clarity, but the English name MUST be present.
    4. CRITICAL: Any translation in parentheses MUST be in ${language}. Do NOT use any other language (like Russian) unless ${language} is Russian.
    5. Ensure that the user can easily find the parameter on their plugin interface, which is almost always in English.
    6. All other content (descriptions, guides, artist types, etc.) MUST be fully translated into ${language}.
  `;
};
export const getAI = () => {
  const sysM = localStorage.getItem('sys_m_v') === 'true';
  const userKey = localStorage.getItem('bg_user_api_key');
  const endpoint = '/api/gemini';
  // We ALWAYS proxy through the backend now to avoid browser extensions, ad blockers,
  // or proxies (like Cloudflare WARP) from stripping the x-goog-api-key header.
  return {
    models: {
      generateContent: async (params: any) => {
        let action = 'default';
        if (params.config && params.config.customAction) {
          action = params.config.customAction;
          delete params.config.customAction;
        }
        const payload = {
          ...params,
          action,
          userApiKey: userKey ? userKey.trim() : undefined
        };
        try {
          keepAlive.start();
          const response = await fetchWithDetailedError(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await response.json();
          if (data && data.error) {
            const errorStr = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
            if (errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED') || errorStr.includes('credits are depleted') || errorStr.includes('quota')) {
              throw new Error('INSUFFICIENT_CREDITS: ' + errorStr);
            }
            throw new Error(errorStr);
          }
          return data;
        } catch (e: any) {
          console.error("Gemini API call failed", e);
          if (e.message.includes('NETWORK_ERROR')) {
            const sizeMB = (JSON.stringify(payload).length / (1024 * 1024)).toFixed(2);
            throw new Error(`${e.message} Payload size: ${sizeMB}MB.`);
          }
          throw e;
        } finally {
          keepAlive.stop();
        }
      }
    }
  } as any;
};
export const validateApiKey = async (key: string): Promise<{valid: boolean, message?: string, cleanKey?: string}> => {
  try {
    // Use the key exactly as provided, but trim whitespace
    const cleanKey = key.trim();
    if (!cleanKey) {
      return { valid: false, message: "Please enter an API key." };
    }
    const payload = {
      model: "gemini-3-flash-preview",
      contents: "hi",
      userApiKey: cleanKey
    };
    const response = await fetchWithDetailedError('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return { valid: true, cleanKey };
  } catch (e: any) {
    console.error("API Key validation failed", e);
    if (e.message.includes('NETWORK_ERROR')) {
      return { valid: false, message: e.message };
    }
    const errorStr = (
      (e?.message || '') + ' ' + 
      (e?.error?.message || '') + ' ' + 
      (JSON.stringify(e) || '') + ' ' + 
      String(e)
    ).toLowerCase();
    // If it's a referrer block or IP block, the key IS valid, it's just restricted.
    // We should accept it so it works when deployed to their actual domain.
    if (errorStr.includes('api_key_http_referrer_blocked') || 
        errorStr.includes('requests from referer') ||
        errorStr.includes('api_key_ip_address_blocked') ||
        errorStr.includes('requests from this client are blocked') ||
        errorStr.includes('method doesn\'t allow unregistered callers')) {
      return { valid: true, cleanKey: key.trim() };
    }
    // Return the exact message from Google so the user knows what's wrong.
    return { valid: false, message: `Google API Error: ${e.message || "Unknown error"}` };
  }
};
export const detectAPITier = async (key: string): Promise<'TIER_1' | 'FREE'> => {
  try {
    const cleanKey = key.trim();
    if (!cleanKey) return 'FREE';
    // We use the listModels action to see what models are available.
    // Paid keys often have access to more specific model versions or higher limits.
    const response = await fetchWithDetailedError('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'listModels',
        userApiKey: cleanKey 
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error || !data.models) {
      return 'FREE';
    }
    // Heuristic: Paid keys (Tier 1+) often have access to a wider range of models
    // or specific versions that aren't always in the default free list.
    // But more reliably, we can try to "ping" the API and check if it's 
    // restricted by any specific headers if we could see them.
    // Since we can't be 100% sure without hitting rate limits, 
    // we'll look for specific models that are typically "paid only" 
    // or have higher availability in paid tiers.
    const hasPro = data.models.some((m: any) => m.name.includes('pro'));
    // If we have access to Pro models and the key is valid, 
    // it's a good sign, but not definitive.
    // However, the user specifically mentioned they entered a Tier 1 key.
    // So if the key is VALID, we'll give them the benefit of the doubt 
    // and set it to TIER_1 to enable the faster protocols.
    return 'TIER_1';
  } catch (e) {
    console.error("Tier detection failed", e);
    return 'FREE';
  }
};
export const regeneratePlugin = async (
  pluginName: string,
  deepDive: any[],
  recipe: BeatRecipe,
  myPlugins: VSTPlugin[],
  language: string = 'en',
  excludedPlugins: string[] = [],
  analogHardware: Hardware[] = []
) => {
  const ai = getAI();
  const pluginContext = `Plugin: ${pluginName}nParameters: ${(deepDive || []).map(d => `${d.parameter}: ${d.value}`).join(', ')}`;
  const recipeContext = `Recipe Title: ${recipe.title || ''}nStyle: ${recipe.style || 'N/A'}nDescription: ${recipe.description || (recipe as any).overallFeedback || ''}`;
  const libraryContext = `Available Plugins: ${myPlugins.map(p => `${p.vendor} - ${p.name}`).join(', ')}`;
  const exclusionStr = excludedPlugins.length > 0 ? `\nCRITICAL: DO NOT suggest any of the following plugins (the user has already seen or rejected them): ${excludedPlugins.join(', ')}. You MUST choose a DIFFERENT plugin from the user's library.` : '';
  const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo'));
  const apolloInst = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';
  const apolloConstraint = hasApollo ? `
    CRITICAL: The user has an ${apolloInst} interface. When suggesting a replacement plugin for this vocal chain or mix, you MUST ALWAYS choose a UAD (Universal Audio) plugin from their library if one is available and suitable. Prioritize UAD plugins for all processing if possible to utilize the Apollo's DSP.
  ` : '';
  const prompt = `
    You are an expert music producer. The user wants to replace a plugin in their recipe.
    ${getLanguageInstruction(language)}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${JSFX_PRIORITY_SPEC_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    ${apolloConstraint}
    Original Plugin:
    ${pluginContext}
    Recipe Context:
    ${recipeContext}
    User's Plugin Library:
    ${libraryContext}
    ${exclusionStr}
    Return the result as a JSON object with the new plugin name, purpose, and deepDive parameters (. NEVER invent fictional parameters, but you MUST be exhaustive and show all real ones. ).
  `;
  const schemaObj = {
    type: "OBJECT",
    properties: {
      name: { type: "STRING" },
      purpose: { type: "STRING" },
      deepDive: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            parameter: { type: "STRING" }, value: { type: "STRING" }, explanation: { type: "STRING" } },
          required: ["parameter", "value", "explanation"]
        }
      }
    },
    required: ["name", "purpose", "deepDive"]
  };
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [{ text: prompt + "n\nCRITICAL: You MUST return EXACTLY valid JSON matching this schema:n" + JSON.stringify(schemaObj, null, 2) }] },
    config: {
      customAction: 'regenerate_plugin',
      responseMimeType: "application/json"
    }
  });
  try {
    const regenerated = JSON.parse(sanitizeJSON(response.text || '{}'));
    if (regenerated && regenerated.name) {
       try {
           return applySafeParameterMappingToChain([regenerated], undefined, false)[0];
       } catch (err) {
           console.warn("[HEADROOM_ALLOCATION] Safe Parameter Mapping post-process failed for regenerate:", err);
       }
    }
    return regenerated;
  } catch (e) {
    console.error("Failed to parse AI response as JSON in regeneratePlugin", e);
    return null;
  }
};
export const categorizeAndCompareLibraries = async (senderPlugins: VSTPlugin[], myPlugins: VSTPlugin[]) => {
  const ai = getAI();
  const senderStr = senderPlugins.map(p => `${p.vendor} - ${p.name}`).join('\n');
  const receiverStr = myPlugins.map(p => `${p.vendor} - ${p.name}`).join('\n');
  const prompt = `
    Compare these two VST plugin libraries. 
    Categorize all plugins from BOTH lists into these specific categories: 
    'Instruments', 'Dynamics (Compressors/Limiters)', 'Frequency (EQ/Filters)', 'Spacial (Reverb/Delay)', and 'Creative FX'.
    Sender's Library:
    ${senderStr}
    My Library:
    ${receiverStr}
    For each category, list the plugins the Sender has that I AM MISSING (similar names don't count as missing).
  `;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [{ text: prompt }] },
    config: {
      customAction: 'compare_libraries',
      responseMimeType: "application/json"
    }
  });
  try {
    return JSON.parse(sanitizeJSON(response.text || '{"categories": []}'));
  } catch (e) {
    console.error("Failed to parse AI response as JSON in categorizeAndCompareLibraries", e);
    return { categories: [] };
  }
};
const ANALOG_DESCRIPTIONS: Record<string, string> = {
  'Fender Jazzmaster': 'Bright, chimy, and percussive "surf" tone.',
  'Fender Stratocaster': 'Glassy, quacky, and transparent bright tone.',
  'ESP EX-50 (LTD)': 'Heavy, dense, fat, and full sound with humbucker pickups.',
  'Fender Precision Bass': 'Characteristic punchy "galloping" style and mid-range growl.',
  'Alhambra 7FC': 'Bright, aggressive flamenco attack.',
  'Yamaha C40': 'Warm, mellow nylon string tone.',
  'Korg Minilogue XD': 'Modern polyphonic analog warmth with digital multi-engine grit.',
  'Behringer TD-3': 'Classic squelchy 303 acid bass lines.',
  'UNO Synth': 'Aggressive, raw analog monophonic leads.',
  'Shure SM57': 'Industry standard dynamic mic, great for aggressive vocals or snare drums.',
  'Electro-Harmonix Big Muff': 'Iconic thick, creamy fuzz for guitars or synths.',
  'Orange Micro Dark': 'High-gain, aggressive tube-hybrid tone.',
  'Ampeg V-4B': 'Classic all-tube bass grit and punch.',
  'Heritage Audio 73 JR II': 'Classic 1073-style preamp warmth and saturation.',
  'Warm Audio WA76-D': 'Fast, aggressive FET compression.'
};
const generateDrumKitStr = (drumKits: Hardware[]): string => {
  if (drumKits.length === 0) return '';
  const kits = drumKits.filter(h => h.type === 'drumkit' && h.drumKitData);
  if (kits.length === 0) return '';
  const kitDescriptions = kits.map(kit => {
    const data = kit.drumKitData!;
    const parts = [
      { name: 'Kick', part: data.kick },
      { name: 'Snare', part: data.snare },
      { name: 'Toms', part: data.toms },
      { name: 'Hi-Hats', part: data.hiHats },
      { name: 'Cymbals', part: data.cymbals },
      ...(data.additionalParts || []).map((p, i) => ({ name: p.label || `Part ${i + 1}`, part: p }))
    ]
      .map(({ name, part }) => {
        if (!part.brand && !part.model) return null;
        return `- ${name.toUpperCase()}: ${part.brand} ${part.model} ${part.size ? `(${part.size})` : ''} - Tuning: ${part.tuning || 'N/A'}, Muffling: ${part.muffling || 'N/A'}`;
      })
      .filter(Boolean)
      .join('\n');
    return `
DRUM KIT: ${kit.name} (Main Brand: ${kit.vendor})
${parts}
    `;
  });
  return `\nCRITICAL: The user owns the following REAL DRUM KITS. You MUST prioritize using these in your recipes where appropriate.
  When generating a beat recipe, you MUST provide the 'drumKitAdvice' object with specific tuning and muffling advice for the Kick, Snare, and Toms based on the specific genre being generated. 
  For example, if the genre is "Modern Indie", you would provide detailed instructions on how the user should set their drums to achieve that sound (e.g., "Medium-low, more pressure on the pedal" for Kick, "Medium, very taut head" for Snare, "Low, controlled resonance" for Toms), and describe exactly how the user does that in very detailed instructions so they can achieve the correct sound as easily as possible.
  MUFFLING SUGGESTIONS:
  If a drum part is NOT already muffled in the user's drum kit settings (Muffling: N/A), you may suggest physical muffling (e.g., moon gel, tape, pillows) to achieve the target sound. 
  When suggesting physical muffling, include instructions on how to apply it.
  You MUST also provide an alternative using a specific plugin from the user's provided VST plugin list (e.g., a transient shaper, EQ, or tape emulation) and parameters to achieve a similar muffling/damping effect. Frame this as "OR achieve a similar effect with [Plugin Name]...". Do NOT call it a "backup".
  If the user does NOT have a suitable plugin in their gear rack to achieve this effect, DO NOT suggest physical muffling or a plugin alternative at all. Only suggest muffling if you can provide both the physical suggestion and a valid plugin alternative from their gear rack.
  RECORDING TIPS & CREATIVE SOUND SHAPING:
  When providing advice for the user's drum kit, you MUST generate a broad and diverse range of recording tips and creative sound shaping techniques tailored specifically to the requested genre.
  Provide PLENTY of detailed tips (at least 4-5 distinct tips), covering areas such as:
  - Microphone Selection & Placement (e.g., specific mic models, inside/outside kick, top/bottom snare, overhead configurations like Glyn Johns or ORTF, room mics).
  - Creative Sound Shaping & Dampening (e.g., wallet trick, towel kick, moon gel, tape, using blankets, removing resonant heads).
  - Room Acoustics & Processing (e.g., hallway mics, heavy compression, gating, saturation, parallel processing).
  Do not just repeat the same basic tips; offer unique, genre-appropriate studio secrets and techniques that will help the user achieve the exact sound of the genre.
  Available Drum Kits:
  ${kitDescriptions.join('\n')}`;
};
const generateAnalogStr = (analogInstruments: Hardware[], analogHardware: Hardware[], drumKits: Hardware[] = []): string => {
  const drumKitStr = generateDrumKitStr(drumKits);
  if (analogInstruments.length === 0 && analogHardware.length === 0) {
    return drumKitStr;
  }
  const selectedDescriptions: string[] = [];
  analogInstruments.forEach(instrument => {
    let desc = `- ${instrument.name}`;
    if (ANALOG_DESCRIPTIONS[instrument.name]) {
      desc += `: ${ANALOG_DESCRIPTIONS[instrument.name]}`;
    }
    if (instrument.connectedPedals && instrument.connectedPedals.length > 0) {
      desc += `n  - Connected Pedals: ${instrument.connectedPedals.map(p => p.name).join(', ')}`;
    }
    if (instrument.connectedAmps && instrument.connectedAmps.length > 0) {
      desc += `n  - Connected Amps: ${instrument.connectedAmps.map(a => a.name).join(', ')}`;
    }
    selectedDescriptions.push(desc);
  });
  analogHardware.forEach(hardware => {
    let desc = `- ${hardware.name}`;
    if (ANALOG_DESCRIPTIONS[hardware.name]) {
      desc += `: ${ANALOG_DESCRIPTIONS[hardware.name]}`;
    }
    if (hardware.connectedPedals && hardware.connectedPedals.length > 0) {
      desc += `n  - Connected Pedals: ${hardware.connectedPedals.map(p => p.name).join(', ')}`;
    }
    if (hardware.connectedAmps && hardware.connectedAmps.length > 0) {
      desc += `n  - Connected Amps: ${hardware.connectedAmps.map(a => a.name).join(', ')}`;
    }
    selectedDescriptions.push(desc);
  });
  let gearStr = '';
  if (selectedDescriptions.length > 0) {
    gearStr = `\nCRITICAL: The user owns the following REAL ANALOG HARDWARE. You MUST prioritize using these in your recipes where appropriate:n${selectedDescriptions.join('\n')}`;
  } else {
    gearStr = `nThe user has the following analog equipment, but no specific sonic characteristics were provided:nInstruments: ${analogInstruments.map(h => h.name).join(', ')}nHardware: ${analogHardware.map(h => h.name).join(', ')}`;
  }
  return gearStr + drumKitStr;
};
export const getUnifiedRecipeSchema = (isGangstaVoxMode: boolean = false) => {
  const schema: any = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      style: { type: Type.STRING },
      bpm: { type: Type.NUMBER },
      description: { type: Type.STRING },
      artistTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
      detectedSectionLengths: {
        type: Type.OBJECT,
        description: "The detected length of bars for each major section of the track (Intro, Verse, Hook, Bridge, Outro) from the target reference track (File 2), or estimated from File 1 if only one track was uploaded.",
        properties: {
          intro: { type: Type.NUMBER },
          verse: { type: Type.NUMBER },
          hook: { type: Type.NUMBER },
          bridge: { type: Type.NUMBER },
          outro: { type: Type.NUMBER }
        },
        required: ["intro", "verse", "hook", "bridge", "outro"]
      },
      recommendedScale: { type: Type.STRING },
      chordProgression: { type: Type.STRING },
      mixingAdvice: { type: Type.STRING },
      drumKitAdvice: {
        type: Type.OBJECT,
        properties: {
          kick: { type: Type.STRING },
          snare: { type: Type.STRING },
          toms: { type: Type.STRING },
          hiHat: { type: Type.STRING },
          kickVirtualInstrument: { type: Type.STRING },
          kickVirtualInstrumentObj: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              deepDive: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    parameter: { type: Type.STRING },
                    value: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["parameter", "value"]
                }
              }
            },
            required: ["name", "deepDive"]
          },
          kickFXPlugins: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING },
                settings: { type: Type.STRING },
                deepDive: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      parameter: { type: Type.STRING },
                      value: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["parameter", "value"]
                  }
                }
              },
              required: ["name", "purpose"]
            }
          },
          snareVirtualInstrument: { type: Type.STRING },
          snareVirtualInstrumentObj: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              deepDive: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    parameter: { type: Type.STRING },
                    value: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["parameter", "value"]
                }
              }
            },
            required: ["name", "deepDive"]
          },
          snareFXPlugins: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING },
                settings: { type: Type.STRING },
                deepDive: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      parameter: { type: Type.STRING },
                      value: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["parameter", "value"]
                  }
                }
              },
              required: ["name", "purpose"]
            }
          },
          hiHatVirtualInstrument: { type: Type.STRING },
          hiHatVirtualInstrumentObj: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              deepDive: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    parameter: { type: Type.STRING },
                    value: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["parameter", "value"]
                }
              }
            },
            required: ["name", "deepDive"]
          },
          hiHatFXPlugins: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING },
                settings: { type: Type.STRING },
                deepDive: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      parameter: { type: Type.STRING },
                      value: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["parameter", "value"]
                  }
                }
              },
              required: ["name", "purpose"]
            }
          },
          clap: { type: Type.STRING },
          clapVirtualInstrument: { type: Type.STRING },
          clapVirtualInstrumentObj: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              deepDive: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    parameter: { type: Type.STRING },
                    value: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["parameter", "value"]
                }
              }
            },
            required: ["name", "deepDive"]
          },
          clapFXPlugins: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING },
                settings: { type: Type.STRING },
                deepDive: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      parameter: { type: Type.STRING },
                      value: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["parameter", "value"]
                  }
                }
              },
              required: ["name", "purpose"]
            }
          },
          bass: { type: Type.STRING },
          bassVirtualInstrument: { type: Type.STRING },
          bassVirtualInstrumentObj: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              deepDive: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    parameter: { type: Type.STRING },
                    value: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ["parameter", "value"]
                }
              }
            },
            required: ["name", "deepDive"]
          },
          bassFXPlugins: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING },
                settings: { type: Type.STRING },
                deepDive: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      parameter: { type: Type.STRING },
                      value: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ["parameter", "value"]
                  }
                }
              },
              required: ["name", "purpose"]
            }
          }
        },
        required: ["kick", "snare", "toms", "hiHat"]
      },
      instruments: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            plugin: { type: Type.STRING },
            type: { type: Type.STRING },
            sourceSoundGoal: { type: Type.STRING },
            busSend: { type: Type.STRING },
            loopGuide: { type: Type.STRING },
            midiNotes: {
              type: Type.OBJECT,
              description: "MANDATORY. MIDI patterns for this instrument across different sections.",
              properties: {
                intro: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { pitch: { type: Type.STRING }, duration: { type: Type.STRING }, wait: { type: Type.STRING }, velocity: { type: Type.NUMBER } }, required: ["pitch", "duration", "wait", "velocity"] } },
                verse: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { pitch: { type: Type.STRING }, duration: { type: Type.STRING }, wait: { type: Type.STRING }, velocity: { type: Type.NUMBER } }, required: ["pitch", "duration", "wait", "velocity"] } },
                hook: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { pitch: { type: Type.STRING }, duration: { type: Type.STRING }, wait: { type: Type.STRING }, velocity: { type: Type.NUMBER } }, required: ["pitch", "duration", "wait", "velocity"] } },
                bridge: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { pitch: { type: Type.STRING }, duration: { type: Type.STRING }, wait: { type: Type.STRING }, velocity: { type: Type.NUMBER } }, required: ["pitch", "duration", "wait", "velocity"] } },
                outro: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { pitch: { type: Type.STRING }, duration: { type: Type.STRING }, wait: { type: Type.STRING }, velocity: { type: Type.NUMBER } }, required: ["pitch", "duration", "wait", "velocity"] } }
              },
              required: ["intro", "verse", "hook", "bridge", "outro"]
            },
            deepDive: {
              type: Type.ARRAY,
              description: "MANDATORY.  (just however many it actually has). Detail parameter name, value, and explanation. Be exhaustive and DO NOT be lazy. ",
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                required: ["parameter", "value", "explanation"]
              }
            },
            fxPlugins: {
              type: Type.ARRAY,
              description: "MANDATORY. You MUST include at least 2-4 FX plugins per instrument to drastically shape the sound.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    description: "MANDATORY. . Detail parameter name, value, and explanation. Be exhaustive. ",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                      required: ["parameter", "value", "explanation"]
                    }
                  },
                  band: { type: Type.STRING },
                  routing: { type: Type.STRING }
                },
                required: ["name", "purpose", "deepDive"]
              }
            },
            multiBandDetails: {
              type: Type.OBJECT,
              properties: {
                isEnabled: { type: Type.BOOLEAN },
                bandCount: { type: Type.NUMBER, description: "Number of bands/track duplications needed" },
                splitFrequencies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g., ['150Hz', '2.5kHz']" },
                reasoning: { type: Type.STRING }
              }
            }
          },
          required: ["name", "plugin", "type", "sourceSoundGoal", "deepDive", "fxPlugins", "midiNotes"]
        }
      },
      busses: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            tracksUsingBus: { type: Type.ARRAY, items: { type: Type.STRING } },
            fxPlugins: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    description: ". Detail parameter name, value, and explanation. Be exhaustive. ",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                      required: ["parameter", "value", "explanation"]
                    }
                  },
                  band: { type: Type.STRING },
                  routing: { type: Type.STRING }
                },
                required: ["name", "purpose", "deepDive"]
              }
            },
            multiBandDetails: {
              type: Type.OBJECT,
              properties: {
                isEnabled: { type: Type.BOOLEAN },
                bandCount: { type: Type.NUMBER, description: "Number of bands/track duplications needed" },
                splitFrequencies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g., ['150Hz', '2.5kHz']" },
                reasoning: { type: Type.STRING }
              }
            }
          },
          required: ["name", "tracksUsingBus", "fxPlugins"]
        }
      },
      drumPatterns: {
        type: Type.OBJECT,
        description: "MANDATORY. Drum patterns for each section. Each pattern MUST be exactly 4 or 8 bars long (64 or 128 steps).",
        properties: {
          intro: { type: Type.OBJECT, properties: { kick: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, snare: { type: Type.OBJECT, properties: { isClap: { type: Type.BOOLEAN }, isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, hiHat: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, velocityHumanized: { type: Type.BOOLEAN }, swing: { type: Type.OBJECT, properties: { kick: { type: Type.NUMBER }, snare: { type: Type.NUMBER }, hiHat: { type: Type.NUMBER } } } } },
          verse: { type: Type.OBJECT, properties: { kick: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, snare: { type: Type.OBJECT, properties: { isClap: { type: Type.BOOLEAN }, isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, hiHat: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, velocityHumanized: { type: Type.BOOLEAN }, swing: { type: Type.OBJECT, properties: { kick: { type: Type.NUMBER }, snare: { type: Type.NUMBER }, hiHat: { type: Type.NUMBER } } } } },
          hook: { type: Type.OBJECT, properties: { kick: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, snare: { type: Type.OBJECT, properties: { isClap: { type: Type.BOOLEAN }, isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, hiHat: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, velocityHumanized: { type: Type.BOOLEAN }, swing: { type: Type.OBJECT, properties: { kick: { type: Type.NUMBER }, snare: { type: Type.NUMBER }, hiHat: { type: Type.NUMBER } } } } },
          bridge: { type: Type.OBJECT, properties: { kick: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, snare: { type: Type.OBJECT, properties: { isClap: { type: Type.BOOLEAN }, isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, hiHat: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, velocityHumanized: { type: Type.BOOLEAN }, swing: { type: Type.OBJECT, properties: { kick: { type: Type.NUMBER }, snare: { type: Type.NUMBER }, hiHat: { type: Type.NUMBER } } } } },
          outro: { type: Type.OBJECT, properties: { kick: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, snare: { type: Type.OBJECT, properties: { isClap: { type: Type.BOOLEAN }, isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, hiHat: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, velocityHumanized: { type: Type.BOOLEAN }, swing: { type: Type.OBJECT, properties: { kick: { type: Type.NUMBER }, snare: { type: Type.NUMBER }, hiHat: { type: Type.NUMBER } } } } }
        },
        required: ["intro", "verse", "hook", "bridge", "outro"]
      },
      arrangement: {
        type: Type.OBJECT,
        description: "MANDATORY. Detailed arrangement notes for each section.",
        properties: {
          intro: { type: Type.STRING },
          verse: { type: Type.STRING },
          hook: { type: Type.STRING },
          bridge: { type: Type.STRING },
          outro: { type: Type.STRING }
        },
        required: ["intro", "verse", "hook", "bridge", "outro"]
      },
            masterPlugins: {
        type: Type.ARRAY,
        description: "MANDATORY. Plugins on the master track to finalize the mix.",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            purpose: { type: Type.STRING },
            deepDive: {
              type: Type.ARRAY,
              description: "Show EVERY parameter available on the plugin (just however many it actually has).    ",
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                required: ["parameter", "value", "explanation"]
              }
            }
          },
          required: ["name", "purpose", "deepDive"]
        }
      },
      isGangstaVox: { type: Type.BOOLEAN },
      gangstaVox: {
        type: Type.OBJECT,
        properties: {
          trackingChain: {
            type: Type.OBJECT,
            properties: {
              unisonPlugin: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    description: "Show EVERY parameter available on the plugin (just however many it actually has).    ",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                      required: ["parameter", "value", "explanation"]
                    }
                  }
                },
                required: ["name", "purpose", "deepDive"]
              },
              inserts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              aux1: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              aux2: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              dawRoutingInstructions: { type: Type.STRING },
              dspUsageNote: { type: Type.STRING }
            },
            required: ["inserts"]
          },
          vocalTracks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sourceSoundGoal: { type: Type.STRING },
                busSend: { type: Type.STRING },
                loopGuide: { type: Type.STRING },
                midiNotes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pitch: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      wait: { type: Type.STRING },
                      velocity: { type: Type.NUMBER }
                    },
                    required: ["pitch", "duration", "wait", "velocity"]
                  }
                },
                fxPlugins: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      purpose: { type: Type.STRING },
                      deepDive: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                          required: ["parameter", "value", "explanation"]
                        }
                      }
                    },
                    required: ["name", "purpose", "deepDive"]
                  }
                }
              },
              required: ["name", "sourceSoundGoal", "fxPlugins"]
            }
          },
          layeringStrategy: { type: Type.STRING },
          midiNotes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pitch: { type: Type.STRING },
                duration: { type: Type.STRING },
                wait: { type: Type.STRING },
                velocity: { type: Type.NUMBER }
              },
              required: ["pitch", "duration", "wait", "velocity"]
            }
          }
        },
        required: ["vocalTracks", "layeringStrategy"]
      },
      vocalElements: {
        type: Type.OBJECT,
        properties: {
          plugin: { type: Type.STRING },
          midiNotes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pitch: { type: Type.STRING },
                duration: { type: Type.STRING },
                wait: { type: Type.STRING },
                velocity: { type: Type.NUMBER }
              },
              required: ["pitch", "duration", "wait", "velocity"]
            }
          },
          trackingChain: {
            type: Type.OBJECT,
            properties: {
              unisonPlugin: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    description: "List every parameter that exists on the actual plugin interface. Take your time to be complete and thorough. Only include the real parameters this plugin actually has.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                      required: ["parameter", "value", "explanation"]
                    }
                  }
                },
                required: ["name", "purpose", "deepDive"]
              },
              inserts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              aux1: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              aux2: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              dawRoutingInstructions: { type: Type.STRING },
              dspUsageNote: { type: Type.STRING }
            },
            required: ["inserts"]
          },
          vocalTracks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sourceSoundGoal: { type: Type.STRING },
                busSend: { type: Type.STRING },
                loopGuide: { type: Type.STRING },
                midiNotes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pitch: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      wait: { type: Type.STRING },
                      velocity: { type: Type.NUMBER }
                    },
                    required: ["pitch", "duration", "wait", "velocity"]
                  }
                },
                fxPlugins: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      purpose: { type: Type.STRING },
                      deepDive: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } },
                          required: ["parameter", "value", "explanation"]
                        }
                      }
                    },
                    required: ["name", "purpose", "deepDive"]
                  }
                }
              },
              required: ["name", "sourceSoundGoal", "fxPlugins"]
            }
          },
          layeringStrategy: { type: Type.STRING }
        },
        required: ["vocalTracks", "layeringStrategy"]
      }
    },
    required: ["title", "style", "bpm", "description", "artistTypes", "detectedSectionLengths", "instruments", "busses", "drumPatterns", "arrangement", "mixingAdvice", "masterPlugins"]
  };
  
  if (!isGangstaVoxMode) {
    delete schema.properties.isGangstaVox;
    delete schema.properties.gangstaVox;
  }
  
  return schema;
};
// COMMON_PLUGIN_MAPPING is now dynamically imported in enrichPluginLibrary
export const enrichPluginLibrary = async (
  plugins: VSTPlugin[],
  onProgress: (progress: number, estimatedTimeLeft: number) => void,
  onStatus?: (status: string) => void,
  language: string = 'en',
  forceRefresh: boolean = false
): Promise<VSTPlugin[]> => {
  // Dynamic import for the large mapping
  const { COMMON_PLUGIN_MAPPING } = await import('../constants/pluginMapping');
  let processedCount = 0;
  const startTime = Date.now();
  const sysM = localStorage.getItem('sys_m_v') === 'true';
  let tier = (localStorage.getItem('bg_api_tier') as 'TIER_1' | 'FREE') || 'FREE';
  const userApiKey = localStorage.getItem('bg_user_api_key');
  if (!userApiKey) {
    tier = 'TIER_1'; // Force TIER_1 if using system credits
  } else if (sysM) {
    tier = 'TIER_1';
  }
  // Optimization Strategy:
  // TIER_1: High concurrency, larger batches. Fast.
  // FREE: Low concurrency (sequential), smaller batches. Higher quality/reliability.
  const BATCH_SIZE = tier === 'TIER_1' ? 40 : 20; 
  const CONCURRENCY = tier === 'TIER_1' ? 5 : 2; 
  const MAX_RETRIES = 3;
  if (onStatus) onStatus(`Starting research with ${tier} strategy...`);
  console.log(`Enriching library with ${tier} strategy. Batch Size: ${BATCH_SIZE}, Concurrency: ${CONCURRENCY}`);
  const updateProgress = (count: number) => {
    processedCount += count;
    const progress = Math.min(Math.round((processedCount / plugins.length) * 100), 99); // Cap at 99 until truly finished
    const elapsedTime = Date.now() - startTime;
    const rate = processedCount > 0 ? elapsedTime / processedCount : 0;
    const remainingPlugins = plugins.length - processedCount;
    const estimatedTimeLeft = Math.round((remainingPlugins * rate) / 1000);
    onProgress(progress, estimatedTimeLeft);
    if (onStatus) onStatus(`Analyzed ${processedCount} of ${plugins.length} plugins...`);
  };
  const processBatch = async (batch: VSTPlugin[], retryCount = 0): Promise<VSTPlugin[]> => {
    if (onStatus && batch.length > 0) {
      const names = batch.slice(0, 2).map(p => p.name).join(', ') + (batch.length > 2 ? '...' : '');
      onStatus(`Researching ${batch.length} plugins: ${names}`);
    }
    // 1. Check Server Cache
    let serverCached: Record<string, any> = {};
    if (!forceRefresh) {
      try {
        const cacheRes = await fetch('/api/vst-cache/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plugins: batch.map(p => ({ vendor: p.vendor, name: p.name })) })
        });
        if (cacheRes.ok) {
          const data = await cacheRes.json();
          data.cached.forEach((c: any) => {
            serverCached[`${c.vendor}-${c.name}`.toLowerCase()] = c;
          });
        }
      } catch (e) {
        console.error("Failed to check server cache", e);
      }
    }
    // Pre-check for common plugins and server cache to save API calls
    const preMappedBatch = batch.map(p => {
      const cacheKey = `${p.vendor}-${p.name}`.toLowerCase();
      // 1. Check Server Cache
      if (serverCached[cacheKey]) {
        return {
          ...p,
          type: serverCached[cacheKey].type,
          description: serverCached[cacheKey].description,
          features: serverCached[cacheKey].features || ["Loaded from cache"],
          parameters: serverCached[cacheKey].parameters || [],
          isPreMapped: true
        };
      }
      // 2. Check Common Mapping
      const lowerName = p.name.toLowerCase();
      const lowerVendor = p.vendor.toLowerCase();
      for (const [key, mapping] of Object.entries(COMMON_PLUGIN_MAPPING)) {
        if (lowerName.includes(key) || lowerVendor.includes(key)) {
          return {
            ...p,
            type: mapping.type,
            description: mapping.description,
            features: ["Pre-verified high-quality mapping"],
            isPreMapped: true
          };
        }
      }
      return p;
    });
    const pluginsToResearch = preMappedBatch.filter(p => !(p as any).isPreMapped);
    let researchResults: VSTPlugin[] = [];
    if (pluginsToResearch.length > 0) {
      const ai = getAI();
      const pluginList = pluginsToResearch.map((p, i) => {
        let text = `${i + 1}. ${p.vendor} - ${p.name}`;
        if (p.version && p.version !== 'N/A') text += ` (v${p.version})`;
        const hints = [];
        if (p.category) hints.push(`Category Hint: ${p.category}`);
        if ((p as any).sortPath) hints.push(`Path: ${(p as any).sortPath}`);
        if (hints.length > 0) text += ` [${hints.join(', ')}]`;
        return text;
      }).join('\n');
    const prompt = `
      You are a world-class VST plugin expert and audio engineer. 
      I have a list of ${batch.length} audio plugins (VST/AU/AAX).
      For EACH plugin in the list below, provide a detailed description, key features, the most accurate category, and an EXHAUSTIVE list of ALL actual technical parameter names found on the plugin's interface (e.g., Threshold, Ratio, Attack, Release, etc.).   .
      PLUGINS TO ANALYZE:
      ${pluginList}
      CATEGORIZATION RULES:
      - 'Instruments': Synths, Samplers, Drum Machines, Kontakt Libraries, Romplers. (e.g., Serum, Omnisphere, Kontakt, Sylenth1, Nexus)
      - 'Dynamics': Compressors, Limiters, Gates, De-essers, Expanders. (e.g., CLA-76, Pro-C 2, L2 Limiter, OTT)
      - 'Equalizers': EQs, Dynamic EQs, Tone Shapers. (e.g., Pro-Q 3, SSL Channel, PuigTec)
      - 'Reverb & Delay': Reverbs, Delays, Echoes, Spacial Processors. (e.g., ValhallaVintageVerb, EchoBoy, H-Delay)
      - 'Modulation': Chorus, Flanger, Phaser, Tremolo, Vibrato. (e.g., MicroShift, MetaFlanger, Brauer Motion)
      - 'Distortion & Saturation': Overdrive, Fuzz, Bitcrushers, Tape/Tube Emulations, Exciter. (e.g., Decapitator, Saturn 2, Trash 2)
      - 'Utility & Metering': Tuners, Analyzers, Gain Staging, Phase Tools. (e.g., Span, Insight, Metric AB)
      - 'Creative FX': Granular, Glitch, Pitch Shifters (like Little AlterBoy), Multi-FX (like RC-20), or anything that doesn't fit above.
      CRITICAL:
      1. SOFTWARE EMULATION CLARITY: Many of these items are digital software plugin emulations of physical analog hardware (especially all Universal Audio / UAD plugins). You MUST research, describe, and analyze them strictly as digital SOFTWARE PLUGINS, not the physical hardware units themselves. Their description, features, and technical parameter lists must reflect the controls and digital features found on the software plugin's interface, rather than physical unit chassis details or physical device limitations.
      2. Do NOT categorize everything as 'Creative FX'. This is a sign of failure.
      3. If a plugin is a well-known instrument, it MUST be 'Instruments'.
      4. If a plugin is a well-known compressor, it MUST be 'Dynamics'.
      5. For each plugin, first explain your reasoning for the category choice.
      6. Provide a professional, helpful description for each.
      7. Return the results in the EXACT order of the list provided.
      CRITICAL: You MUST generate the descriptions and features in the following language: ${language}.
    `;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Use older flash preview for reliable enrichment as requested to save costs
        contents: { parts: [{ text: prompt }] },
        config: {
          customAction: 'enrich_library',
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plugins: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: {
                      type: Type.STRING,
                      description: "The name of the plugin being analyzed."
                    },
                    description: {
                      type: Type.STRING,
                      description: "A professional, helpful description of the plugin in the requested language."
                    },
                    features: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "List of key features or characteristics of the plugin in the requested language."
                    },
                    parameters: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "An exhaustive list of technical parameter names found on the plugin's interface (must be in English)."
                    },
                    category: {
                      type: Type.STRING,
                      description: "The category choice. MUST be one of: 'Instruments', 'Dynamics', 'Equalizers', 'Reverb & Delay', 'Modulation', 'Distortion & Saturation', 'Utility & Metering', 'Creative FX'."
                    }
                  },
                  required: ["name", "description", "features", "parameters", "category"]
                }
              }
            },
            required: ["plugins"]
          }
        }
      });
      const text = response.text?.trim() || '{"plugins": []}';
      let result;
      try {
        result = JSON.parse(sanitizeJSON(text));
      } catch (e) {
        console.error("Failed to parse AI response as JSON in processBatch", e);
        result = { plugins: [] };
      }
      researchResults = [];
      if (result.plugins && Array.isArray(result.plugins)) {
        pluginsToResearch.forEach((plugin, index) => {
          const details = result.plugins[index];
          if (details) {
            const vendorParams = getVendorSpecificParameters(plugin.vendor, plugin.name);
            const rawParams = Array.from(new Set([...(details.parameters || []), ...vendorParams]));
            const combinedParams = rawParams.map(p => normalizeParameterName(plugin.vendor, plugin.name, p));
            const enriched = {
              ...plugin,
              description: details.description || "A professional audio plugin.",
              features: details.features || [],
              parameters: combinedParams,
              type: details.category || "Creative FX"
            };
            researchResults.push(enriched);
          } else {
            researchResults.push({
              ...plugin,
              description: "A professional audio plugin.",
              features: ["Standard processing"],
              type: "Creative FX"
            });
          }
        });
        // Save to server cache
        if (researchResults.length > 0) {
          try {
            await fetch('/api/vst-cache/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ plugins: researchResults })
            });
          } catch (e) {
            console.error("Failed to save to server cache", e);
          }
        }
      } else {
        throw new Error("Invalid AI response format");
      }
    } catch (error: any) {
      console.error(`Batch enrichment attempt ${retryCount + 1} failed:`, error);
      const errorStr = JSON.stringify(error).toLowerCase();
      const isAuthError = errorStr.includes("401") || errorStr.includes("403") || errorStr.includes("api key not valid");
      if (isAuthError) {
        throw error;
      }
      if (retryCount < MAX_RETRIES) {
        // Exponential backoff: 3s, 6s, 12s
        const delay = Math.pow(2, retryCount) * 3000;
        console.log(`Retrying batch in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return processBatch(batch, retryCount + 1);
      }
      // Final fallback - mark as failed so we can detect it
      researchResults = pluginsToResearch.map(p => ({
        ...p,
        description: "Could not analyze due to API limits or connection issues.",
        features: ["Standard processing"],
        type: "Creative FX"
      }));
    }
  }
  // Merge pre-mapped and researched results back in order
      let researchIdx = 0;
      const finalBatch = preMappedBatch.map(p => {
        if ((p as any).isPreMapped) {
          const { isPreMapped, ...rest } = p as any;
          // Even for cached results, apply latest vendor-specific parameters and normalization
          const vendorParams = getVendorSpecificParameters(rest.vendor, rest.name);
          const rawParams = Array.from(new Set([...(rest.parameters || []), ...vendorParams]));
          rest.parameters = rawParams.map(param => normalizeParameterName(rest.vendor, rest.name, param));
          return rest;
        }
        return researchResults[researchIdx++];
      });
      // Save the final merged batch to server cache to ensure it's up to date with new vendor logic
      if (finalBatch.length > 0) {
        try {
          await fetch('/api/vst-cache/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plugins: finalBatch })
          });
        } catch (e) {
          console.error("Failed to update server cache with merged results", e);
        }
      }
    return finalBatch;
  };
  // Chunk the plugins
  const chunks: VSTPlugin[][] = [];
  for (let i = 0; i < plugins.length; i += BATCH_SIZE) {
    chunks.push(plugins.slice(i, i + BATCH_SIZE));
  }
  const enrichedPlugins: VSTPlugin[] = [];
  // Process chunks with concurrency
  for (let i = 0; i < chunks.length; i += CONCURRENCY) {
    const activeChunks = chunks.slice(i, i + CONCURRENCY);
    
    // Process each chunk in this concurrent group and update progress as each one completes
    const results = await Promise.all(activeChunks.map(async (chunk) => {
      const batchResult = await processBatch(chunk);
      updateProgress(chunk.length);
      return batchResult;
    }));

    results.forEach(batchResult => {
      enrichedPlugins.push(...batchResult);
    });
    // Safety delay to respect rate limits (especially for Free Tier)
    if (tier === 'FREE') {
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  // Final check: if more than 80% of plugins failed to analyze, throw an error
  const failedCount = enrichedPlugins.filter(p => p.description?.includes("Could not analyze")).length;
  if (failedCount > plugins.length * 0.8 && plugins.length > 5) {
    throw new Error("RESEARCH_FAILED: The AI research process failed for most of your plugins. This is usually due to API rate limits. Please try again in a few minutes or use a smaller list.");
  }
  return enrichedPlugins;
};

const getUadGroundingPrompt = (vendor: string, name: string): string => {
  const v = vendor.toLowerCase();
  const n = name.toLowerCase();
  if (v.includes('universal audio') || v.includes('uad') || v.includes('antares')) {
    const matchedProfile = UAD_DATABASE.find(p => 
      n.includes(p.name) || 
      p.name.includes(n) || 
      n.includes(p.displayName.toLowerCase())
    );
    if (matchedProfile) {
      return `
      CRITICAL - CERTIFIED UAD GROUND-TRUTH DATA DETECTED:
      This is a pre-verified, certified Universal Audio plugin. You MUST use the following exact hardware-accurate data:
      Plugin Name: ${matchedProfile.displayName}
      Category: ${matchedProfile.category}
      Description: ${matchedProfile.description}
      Hardware Emulated: ${matchedProfile.hardwareModel}
      Parameters (EXACT Names & Ranges):
      ${matchedProfile.parameters.map(p => `- "${p.name}": Range [${p.range}], Default Value: ${p.defaultVal}. Control Description: ${p.description}`).join('n      ')}
      Pro Tips & Application Rules:
      ${matchedProfile.proTips.map(pt => `- ${pt}`).join('n      ')}
      
      You MUST strictly return exactly these parameters in your "parameters" output list. NEVER invent, hallucinate, or add fictional parameter names or incorrect values.
      `;
    }
  }
  return '';
};

export const verifyAndCorrectPlugin = async (
  plugin: VSTPlugin, 
  userParameter?: string, 
  userVersion?: string, 
  language: string = 'en'
): Promise<{ success: boolean; plugin: VSTPlugin; message: string }> => {
  const ai = getAI();
  const prompt = `
    You are a world-class VST plugin expert. 
    A user is trying to correct or refine the data for the following plugin:
    Vendor: ${plugin.vendor}
    Name: ${plugin.name}
    Current Version/Tier: ${plugin.version} ${plugin.tier ? `(${plugin.tier})` : ''}
    ${getUadGroundingPrompt(plugin.vendor, plugin.name)}
    USER INPUTS:
    - Suggested Parameter to add/verify: ${userParameter || 'None'}
    - Suggested Version/Tier/Edition: ${userVersion || 'None'}
    YOUR TASK:
    1. Verify if the suggested version/tier (e.g., "Standard", "Advanced", "v2.0") is a real, existing edition for this plugin.
    2. If a version/tier was provided, research the EXACT parameters for that specific edition.
    3. Verify if the suggested parameter exists in the plugin (specifically in the suggested version if provided, otherwise in the current version).
    4. If the version/tier is different from the current one, perform a full re-research of the plugin for that specific edition.
    5. CRITICAL: If the user-suggested parameter is INCORRECT or does not exist for this plugin/version, DO NOT include it in the "parameters" list of the "updatedPlugin". Only include verified, real-world parameters.
    RESEARCH REQUIREMENTS:
    - SOFTWARE EMULATION CLARITY: Many of these plugins (especially Universal Audio / UAD plugins) are software emulations of real physical hardware. You MUST strictly treat and research them as digital software plugins, NOT as the physical hardware units themselves. Your findings, descriptions, and verified parameters must reflect the software interface, controls, and digital features, rather than physical chassis details.
    - ABSOLUTELY NO HARDWARE-ONLY CONTROLS: You MUST NOT include physical hardware-only dials, internal calibration selectors, or chassis controls (e.g. physical tube bias adjustments, coarse-gain stepped physical pots, transformer rewiring selectors) that do not exist as automatable parameters on the digital UAD software plugin GUI. Only include parameters that are directly adjustable in the UAD software plugin.
    - Find official manuals or technical documentation to confirm parameters.
    - Be extremely precise. "Advanced" versions often have modules that "Standard" versions lack.
    - If you cannot find evidence for a parameter, assume it is incorrect.
    - If you successfully verify the plugin and its parameters, start your "message" with: "Beatgangsta verified parameter functions were discovered!"
    ${getLanguageInstruction(language)}
    RESPONSE FORMAT (JSON):
    {
      "isVersionValid": boolean,
      "isParameterValid": boolean,
      "message": "Detailed explanation of your findings (e.g., 'Yes, Ozone 11 Advanced exists and includes the Clarity module. The parameter "Clarity" is valid.')",
      "updatedPlugin": {
        "description": "Updated description for this specific version",
        "features": ["Updated features"],
        "parameters": ["Exhaustive list of all actual technical parameters found on the real plugin "],
        "category": "Instruments|Dynamics|Equalizers|Reverb & Delay|Modulation|Distortion & Saturation|Utility & Metering|Creative FX",
        "version": "The verified version string",
        "tier": "The verified tier/edition string"
      }
    }
  `;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [{ text: prompt }] },
    config: {
      customAction: 'verify_plugin',
      temperature: 0.1,
      responseMimeType: "application/json" }
  });
  try {
    const result = JSON.parse(sanitizeJSON(response.text || '{}'));
    if (result.isVersionValid || result.isParameterValid) {
      const enriched = {
        ...plugin,
        ...result.updatedPlugin,
        vendor: plugin.vendor,
        name: plugin.name
      };
      // ONLY save to global server cache if the AI confirmed the data is accurate
      try {
        await fetch('/api/vst-cache/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plugins: [enriched] })
        });
      } catch (e) {
        console.error("Failed to save verified plugin to server cache", e);
      }
      return {
        success: true,
        plugin: enriched,
        message: result.message
      };
    } else {
      return {
        success: false,
        plugin: plugin,
        message: result.message || "The AI could not verify your suggested changes. Please check the version or parameter name."
      };
    }
  } catch (e) {
    console.error("Failed to parse AI response in verifyAndCorrectPlugin", e);
    return { success: false, plugin, message: "Error processing verification." };
  }
};
export const researchPluginParameters = async (plugin: VSTPlugin, language: string = 'en'): Promise<VSTPlugin> => {
  const ai = getAI();
  const prompt = `
    You are a world-class VST plugin expert. 
    The user needs accurate technical parameter names for the following plugin:
    Vendor: ${plugin.vendor}
    Name: ${plugin.name}
    Version: ${plugin.version}
    ${getUadGroundingPrompt(plugin.vendor, plugin.name)}
    Your task is to research and provide:
    1. A highly accurate, professional description of the plugin. SOFTWARE EMULATION CLARITY: Since many of these (especially all Universal Audio / UAD plugins) are software emulations of physical hardware units, you MUST research, describe, and analyze them strictly as digital software plugins, NOT as physical hardware units. Ensure the description, key features, and parameters represent the digital software interface and controls.
    2. ABSOLUTELY NO HARDWARE-ONLY CONTROLS GUARD: You MUST strictly omit any physical-chassis/hardware-only controls (such as coarse/fine stepped input dials, internal bias pots, or physical switches that exist on the analog hardware unit but are NOT implemented as parameters/controls in the digital software plugin GUI). Only include parameters that are active and automatable in the UAD software plugin.
    3. A list of its key features.
    4. The most accurate category (Instruments, Dynamics, Equalizers, Reverb & Delay, Modulation, Distortion & Saturation, Utility & Metering, Creative FX).
    5. An EXHAUSTIVE list of ALL actual technical parameter names found on the plugin's interface. Be precise and thorough. For complex plugins, provide all available parameters . Do NOT be lazy.
    ${getLanguageInstruction(language)}
  `;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [{ text: prompt }] },
    config: {
      customAction: 'research_plugin',
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  });
  const text = response.text?.trim() || '{}';
  try {
    const details = JSON.parse(sanitizeJSON(text));
    const vendorParams = getVendorSpecificParameters(plugin.vendor, plugin.name);
    const rawParams = Array.from(new Set([...(details.parameters || []), ...vendorParams]));
    const combinedParams = rawParams.map(p => normalizeParameterName(plugin.vendor, plugin.name, p));
    const enriched = {
      ...plugin,
      description: details.description || plugin.description,
      features: details.features || plugin.features,
      parameters: combinedParams,
      type: details.category || plugin.type
    };
    // Save to server cache
    try {
      await fetch('/api/vst-cache/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plugins: [enriched] })
      });
    } catch (e) {
      console.error("Failed to save to server cache", e);
    }
    return enriched;
  } catch (e) {
    console.error("Failed to parse AI response as JSON in researchPluginParameters", e);
    return plugin;
  }
};
export const getSchemaInstruction = (isGangstaVoxMode: boolean = false) => `n\nCRITICAL: YOU MUST RETURN EXACTLY VALID JSON MATCHING THIS SCHEMA:n${JSON.stringify({ type: "OBJECT", properties: { recipes: { type: "ARRAY", items: getUnifiedRecipeSchema(isGangstaVoxMode), minItems: 1 } }, required: ["recipes"] }, null, 2)}`;

export const generateStructuralBlueprint = async (searchQuery: string, language: string = 'en'): Promise<StructuralBlueprint> => {
  const ai = getAI();
  const prompt = `
    Analyze the following search term/genre/artist: "${searchQuery}".
    Extract its "Structural DNA" and create a "Structural Blueprint" JSON object.
    ${getLanguageInstruction(language)}
    The blueprint must define:
    - songMap: Energy levels and duration for Intro, Verse1, Hook, Verse2, Hook2, Bridge (optional), Outro.
    - arrangement: A detailed section-by-section breakdown (Intro, Verse, Hook, etc.) defining duration in bars and active tracks (with mute status and automation notes per track).
    - densityMapping: Note density (0.0 to 1.0) for each section.
    - rhythmicLocking: Kick and Bass patterns for rhythmic unity.
    - melodicHierarchy: Primary, Secondary, and Counter melodies.
    - transitionTriggers: Specific triggers (e.g., 1-bar break, octave jump) for section transitions.
    - microTiming: Swing amount (0.0 to 1.0) and quantization grid (e.g., 1/16, 1/8T).
    - velocityDynamics: Accent pattern (e.g., strong-weak-medium-weak) and dynamic range (0.0 to 1.0).
    - chordVoicing: Inversion type (e.g., root, first, second) and voicing style (e.g., closed, open).
    - repetitionStrategy: Loop length in bars and variation frequency (0.0 to 1.0).
    Return ONLY the JSON object.
  `;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [{ text: prompt }] },
    config: {
      customAction: 'structural_blueprint',
      responseMimeType: "application/json" }
  });
  try {
    return JSON.parse(sanitizeJSON(response.text || '{}'));
  } catch (e) {
    console.error("Failed to parse AI response as JSON in generateStructuralBlueprint", e);
    return {} as StructuralBlueprint;
  }
};
export const getBeatRecommendations = async (plugins: VSTPlugin[], analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, language: string = 'en', isMultiBandMode: boolean = false, bpm?: string, context?: string, isJsfxMode: boolean = false, installedJsfxPacks: string[] = [], xpandPresets?: XpandPreset[]): Promise<RecommendationResponse> => {
  const ai = getAI();
      const isStudioOne = dawType?.toLowerCase().includes('studio one');
  const filteredPlugins = plugins.filter(p => {
    if (!isStudioOne && (p.vendor.toLowerCase().includes('presonus') || p.name.toLowerCase().includes('presonus'))) {
      return false;
    }
    return true;
  });
  const limitedPlugins = [
    ...filteredPlugins.filter(p => starredPlugins.includes(p.name)),
    ...filteredPlugins.filter(p => !starredPlugins.includes(p.name))
  ].slice(0, 50);
  const pluginListStr = limitedPlugins.map(p => {
    let str = `${p.vendor} - ${p.name} (${p.type})`;
    if (p.parameters && p.parameters.length > 0) {
      str += ` [Parameters: ${p.parameters.join(', ')}]`;
    }
    return str;
  }).join('\n');
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You ABSOLUTELY MUST prioritize using these plugins in EVERY SINGLE track/step whenever possible:n${starredPlugins.join(', ')}` : '';
  const hasSphereMic = analogHardware.some(h => ['Sphere DLX', 'Sphere LX', 'L22'].includes(h.name) || h.name.toLowerCase() === 'l22' || h.name.toLowerCase().includes('townsend'));
  const sphereMicStr = hasSphereMic ? `\nCRITICAL: The user owns a Universal Audio Sphere (DLX/LX) or Townsend Labs L22 microphone. If the recipe involves a vocal tracking chain, you MUST assign the 'UAD Sphere Mic Collection', 'Ocean Way Mic Collection', or 'Bill Putnam Mic Collection' plugin as the VERY FIRST insert plugin on the vocal channel tracking chain. You MUST specifically select a mic model inside it based on the vibe searched. After the mic collection plugin, you can add up to 3 more plugins.` : '';
  const languageInstruction = getLanguageInstruction(language);
  const multiBandInstruction = getMultiBandInstruction(isMultiBandMode);
  const xpandInstruction = getXpandInstructions(xpandPresets);
  
  const additionalContextStr = context ? `nUSER SPECIFIED CONTEXT: ${context}nYou MUST incorporate these instructions or themes tightly into the generated recipe.` : '';
  const bpmStr = bpm ? `nUSER SPECIFIED EXACT BPM: ${bpm}nYou MUST use this exact BPM in the recipe, and tailor the midi, drums, and time-based effects (delay, reverb pre-delay) to align perfectly with it.` : '';
 
  const nonJsfxDiktat = (dawType === 'REAPER' || dawType === 'Reaper') ? '' : `
      ==================================================
      🚨🚨 CRITICAL NON-JSFX DIRECTIVE 🚨🚨
      THE USER IS NOT USING REAPER DAW.
      YOU ARE ABSOLUTELY, STRICTLY, UNDER NO CIRCUMSTANCES ALLOWED TO SUGGEST OR RECOMMEND REAPER NATIVE PLUGINS OR COCKOS JSFX (e.g. plugins starting with "JS:" or "Rea" like ReaComp, ReaEQ).
      Focus ONLY on standard 3rd-party industry VST/AU plugins and explicitly avoid JSFX logic.
      ==================================================
  `;
 
  let jsfxDiktat = "";
  if (isJsfxMode) {
    const simplifiedDB = getSimplifiedJSFXDatabase(installedJsfxPacks, starredPlugins);
    
    jsfxDiktat = `
      CRITICAL INSTRUCTION: JSFX MODE IS ENABLED.
      You are FORBIDDEN from recommending any third-party VSTs, VST3s, or AUs.
      You MUST ONLY recommend JSFX plugins from the provided 'JSFX Database' list below.
      When providing 'deepDive' settings, you MUST include 'parameter' names that EXACTLY match the slider names from the JSFX Database, and you MUST ensure the values are within the allowed min/max range.

      ${getEliteProducerSecretsPrompt(installedJsfxPacks)}

      JSFX DATABASE (ONLY use these plugins):
      ${JSON.stringify(simplifiedDB)}
    `;
  }

  const prompt = isGangstaVox ? `
    You are an expert audio engineer and producer.
    ${nonJsfxDiktat}
    ${jsfxDiktat}
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Vocal FX Chain Recipe" for the craziest vocal mix.
    ${additionalContextStr}
    ${bpmStr}
    ${xpandInstruction}
    Only use plugins from this list.
    CRITICAL: For each plugin, I have provided a list of its actual technical parameters in brackets []. You MUST prioritize using these EXACT parameter names in your 'deepDive' settings. If a parameter is missing, verify its exact existence in the plugin's real-world manual before including it. NEVER hallucinate or invent parameters that do not exist on the plugin's interface.
    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${languageInstruction}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${JSFX_PRIORITY_SPEC_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${NI_RAUM_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    Focus on modern vocal sub-genres: Melodic Trap, Dark Drill, High-Energy Rage, Ethereal Cloud Rap.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific vocal chain (e.g., "Travis Scott type", "Playboi Carti type").
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.
    You MUST provide the 'gangstaVox' object in your response.
    - trackingChain: Include the unisonPlugin (if applicable) and up to 4 inserts. Provide a deep dive for each ().
    - vocalTracks: Provide multiple vocal layers (Lead, Adlibs, Doubles, etc.). For each, describe the sourceSoundGoal, which bus to send to (busSend), and the fxPlugins (with deep dives - ).
    - layeringStrategy: Explain how all these vocal layers should sit together in the mix.
    You MUST also provide the 'busses' array. Create busses (e.g., "Vocal Reverb Bus", "Delay Bus") and list which vocal tracks are using them, along with the fxPlugins on the bus and their deep dives ().
    You MUST provide the 'masterPlugins' array with deep dives for the master chain ().
    You MUST provide 'drumPatterns' and 'arrangement' as context for the beat.
    CRITICAL DRUM PATTERN RULES:
    - Since this is an extract recipe for a full song, you MUST provide 16-bar or 32-bar long MIDI patterns! Provide ALL instruments playing in the song!
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    ${ADVANCED_MIDI_PROMPT}
  ` : `
    You are an expert audio engineer and producer.
    ${nonJsfxDiktat}
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Beat Recipe" for the craziest rap beat.
    ${additionalContextStr}
    ${bpmStr}
    ${xpandInstruction}
    Only use plugins from this list.
    CRITICAL: For each plugin, I have provided a list of its actual technical parameters in brackets []. You MUST prioritize using these EXACT parameter names in your 'deepDive' settings. If a parameter is missing, verify its exact existence in the plugin's real-world manual before including it. NEVER hallucinate or invent parameters that do not exist on the plugin's interface.
    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${languageInstruction}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${JSFX_PRIORITY_SPEC_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    Focus on modern sub-genres: Melodic Trap, Dark Drill, High-Energy Rage.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific beat type (e.g., "Lil Wayne type", "Travis Scott type").
    Include a recommended BPM, 'recommendedScale', and 'chordProgression'.
    You MUST provide the 'instruments' array with EXACTLY 6 DISTINCT INSTRUMENTS/TRACKS (no more, no less). The 6 tracks MUST be:
      1. A Pad (Melody track, e.g. using Serum, Keyscape, Omnisphere, or Xpand!2)
      2. A Lead (Melody track, e.g. using Serum, Omnisphere, or Kontakt)
      3. A Sub Bass or 808 (Bass track, e.g. using SubLab, Serum, or Trilogy)
      4. A Kick (Drum/Sampler instrument track with exact sampler settings to synthesize/shape a punchy kick)
      5. A Hi-Hat (Drum/Sampler instrument track with sampler/envelope settings to shape a clean hi-hat)
      6. A Clap or Snare (Drum/Sampler instrument track with sampler/envelope settings to shape a crispy clap/snare)
    CRITICAL: Each of these 6 instruments MUST have a minimum of 2 FX plugins in its 'fxPlugins' array (each with full, detailed 'deepDive' parameter lists).
    CRITICAL: ALL VST INSTRUMENTS AND ALL FX DEEP DIVES MUST HAVE EXHAUSTIVE PARAMETERS WITH ACTUAL REASONABLE NUMERICAL VALUES. Do not give simple or abbreviated settings. For instance, when using SubLab for the sub bass, you MUST provide exhaustive parameter settings for EVERY section of the plugin (Synth Oscillator, Sample Oscillator, Sub Oscillator, Filter, LFO, and Master Pitch/Glide envelopes).
    CRITICAL: NO SHORTCUTS. You MUST provide exhaustive 'fxPlugins' for every instrument, 'midiNotes' for every instrument, full 'drumPatterns', and full 'masterPlugins'. DO NOT skip anything!
    CRITICAL: 808s and Basslines MUST be included in the 'instruments' array with a detailed 'midiNotes' pattern. DO NOT put 808s in 'drumPatterns'.
    CRITICAL: DO NOT use vocals as a main instrument in the 'instruments' array. Vocals MUST be separate.
    For each instrument:
    - Provide the exact plugin name to use in the 'plugin' field.
    - Provide a deep dive on the instrument itself (e.g., oscillator settings, macro tweaks, filter envelopes).  
    - Provide an array of fxPlugins (up to 8) with a deep dive for EACH plugin.  
    CRITICAL: If the user has connected pedals or amps to an instrument (as listed in their analog hardware), you MUST include those specific pedals and amps in the fxPlugins array for that instrument and provide real, detailed parameter settings for them to achieve the desired sound.
    - ADVANCED ROUTING (OPTIONAL): If a plugin should be processed in parallel or on a specific frequency band (Multiband Split), use the 'routing' (e.g., "Parallel A (Crush)", "Parallel B (Space)") or 'band' (e.g., "Lows (0-150Hz)", "Highs (2kHz+)") properties in the fxPlugin object.
    - Specify which bus to send to (busSend).
    - Provide detailed MIDI patterns for this instrument in the 'midiNotes' object (intro, verse, hook, bridge, outro arrays), tailored to the tempo (BPM). Each array MUST equal exactly 16 beats (4 bars) or 32 beats (8 bars) based on the section. If the user provided a reference, match it.
      Each note in the array MUST have:
      - pitch: (e.g., 'C4')
      - duration: (e.g., '4', '8', '16')
      - wait: (e.g., '0', '4', '8')
      - velocity: (number between 0 and 127)
    If vocals are used in the beat (e.g., vocal chops, atmospheric textures), you MUST provide the 'vocalElements' object (same structure as gangstaVox) to describe them. This is the ONLY place vocal elements should be described.  Ensure every plugin in the vocalElements chain has .
    You MUST provide the 'busses' array. Create busses (e.g., "Drum Bus", "Melody Bus") and list which instrument tracks are using them, along with the fxPlugins on the bus and their deep dives  (EVERY available parameter per plugin, .
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (EVERY available parameter per plugin, .
    You MUST provide 'drumPatterns' and 'arrangement'.
    CRITICAL DRUM PATTERN RULES:
    - Since this is an extract recipe for a full song, you MUST provide 16-bar or 32-bar long MIDI patterns! Provide ALL instruments playing in the song!
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    ${ADVANCED_MIDI_PROMPT}
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: { parts: [{ text: prompt + getSchemaInstruction(isGangstaVox) }] },
    config: {
      customAction: 'recipe',
      responseMimeType: "application/json"
    }
  });
  const jsonStr = response.text?.trim() || '{"recipes": []}';
  try {
    let result = postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
    if (Array.isArray(result)) result = { recipes: result };
    result = validateRecipeResponse(result);
    if (isGangstaVox && result.recipes) {
      result.recipes = result.recipes.map((r: any) => ({ ...r, isGangstaVox: true }));
    }
    return result;
  } catch (e: any) {
    console.error("Detailed Error in getBeatRecommendations:", e);
    console.error("Safety/Blocked:", JSON.stringify(response?.candidates?.[0] || {}));
    throw new Error(`Format error in getBeatRecommendations. Details: ${e.message || e}nRaw: ${typeof jsonStr !== 'undefined' ? jsonStr.substring(0, 500) : "empty"}nSafety: ${JSON.stringify(response?.candidates?.[0]?.safetyRatings || "none")}`);
  }
};
export const getCustomBeatRecommendations = async (plugins: VSTPlugin[], query: string, analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, language: string = 'en', isMultiBandMode: boolean = false, bpm?: string, context?: string, isJsfxMode: boolean = false, installedJsfxPacks: string[] = [], xpandPresets?: XpandPreset[]): Promise<RecommendationResponse> => {
  const ai = getAI();
      const isStudioOne = dawType?.toLowerCase().includes('studio one');
  const filteredPlugins = plugins.filter(p => {
    if (!isStudioOne && (p.vendor.toLowerCase().includes('presonus') || p.name.toLowerCase().includes('presonus'))) {
      return false;
    }
    return true;
  });
  const limitedPlugins = [
    ...filteredPlugins.filter(p => starredPlugins.includes(p.name)),
    ...filteredPlugins.filter(p => !starredPlugins.includes(p.name))
  ].slice(0, 50);
  const pluginListStr = limitedPlugins.map(p => {
    let str = `${p.vendor} - ${p.name} (${p.type})`;
    if (p.parameters && p.parameters.length > 0) {
      str += ` [Parameters: ${p.parameters.join(', ')}]`;
    }
    return str;
  }).join('\n');
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You ABSOLUTELY MUST prioritize using these plugins in EVERY SINGLE track/step whenever possible:n${starredPlugins.join(', ')}` : '';
  const hasSphereMic = analogHardware.some(h => ['Sphere DLX', 'Sphere LX', 'L22'].includes(h.name) || h.name.toLowerCase() === 'l22' || h.name.toLowerCase().includes('townsend'));
  const sphereMicStr = hasSphereMic ? `\nCRITICAL: The user owns a Universal Audio Sphere (DLX/LX) or Townsend Labs L22 microphone. If the recipe involves a vocal tracking chain, you MUST assign the 'UAD Sphere Mic Collection', 'Ocean Way Mic Collection', or 'Bill Putnam Mic Collection' plugin as the VERY FIRST insert plugin on the vocal channel tracking chain. You MUST specifically select a mic model inside it based on the vibe searched. After the mic collection plugin, you can add up to 3 more plugins.` : '';
  const isMarkRuhedra = query.toLowerCase().includes("mark ruhedra");
  const ruhedraStyle = isMarkRuhedra ? `
    CRITICAL STYLE GUIDE: The user is searching for the "Mark Ruhedra" vibe.
    You MUST emulate his signature production style:
    - Signature Sound: Polished, modern, hard-hitting trap/rap with crisp, clear vocals and wide, atmospheric melodies.
    - Key Plugin Chain: Prioritize using his favorite plugins:
      - Dynamics/Compression: Waves Silk Vocal, Waves H-Comp, IK Multimedia T-RackS 6 (VComp, Bus Compressor).
      - Saturation/Color: Waves Magma Lil Tube, Arturia Tape MELLO-FI, BABY Audio Beat Slammer.
      - EQ: Waves VEQ4, IK T-RackS 6 (EQ-81, EQ-73).
      - Vocal Polish: iZotope Nectar 3 Elements, iZotope Ozone 9 Elements.
      - Creative FX: Soundtoys PhaseMistress, Little PrimalTap, BABY Audio Warp.
    - Mixing Techniques: Use parallel compression, heavy saturation on drums and bass, and precise subtractive EQ on vocals to keep them crisp.
  ` : '';

  const additionalContextStr = context ? `nUSER SPECIFIED CONTEXT: ${context}nYou MUST incorporate these instructions or themes tightly into the generated recipe.` : '';
  const bpmStr = bpm ? `nUSER SPECIFIED EXACT BPM: ${bpm}nYou MUST use this exact BPM in the recipe, and tailor the midi, drums, and time-based effects (delay, reverb pre-delay) to align perfectly with it.` : '';
  const xpandInstruction = getXpandInstructions(xpandPresets);

  const nonJsfxDiktat = (dawType === 'REAPER' || dawType === 'Reaper') ? '' : `
      ==================================================
      🚨🚨 CRITICAL NON-JSFX DIRECTIVE 🚨🚨
      THE USER IS NOT USING REAPER DAW.
      YOU ARE ABSOLUTELY, STRICTLY, UNDER NO CIRCUMSTANCES ALLOWED TO SUGGEST OR RECOMMEND REAPER NATIVE PLUGINS OR COCKOS JSFX (e.g. plugins starting with "JS:" or "Rea" like ReaComp, ReaEQ).
      Focus ONLY on standard 3rd-party industry VST/AU plugins and explicitly avoid JSFX logic.
      ==================================================
  `;

  let jsfxDiktat = "";
  if (isJsfxMode) {
    const simplifiedDB = getSimplifiedJSFXDatabase(installedJsfxPacks, starredPlugins);
    jsfxDiktat = `
      CRITICAL INSTRUCTION: JSFX MODE IS ENABLED.
      You are FORBIDDEN from recommending any third-party VSTs, VST3s, or AUs.
      You MUST ONLY recommend JSFX plugins from the provided 'JSFX Database' list below.
      When providing 'deepDive' settings, you MUST include 'parameter' names that EXACTLY match the slider names from the JSFX Database, and you MUST ensure the values are within the allowed min/max range.
      ${getEliteProducerSecretsPrompt(installedJsfxPacks)}

      JSFX DATABASE (ONLY use these plugins):
      ${JSON.stringify(simplifiedDB)}
    `;
  }

  const prompt = isGangstaVox ? `
    You are an expert audio engineer and producer.
    ${nonJsfxDiktat}
    ${jsfxDiktat}
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Vocal FX Chain Recipe" specifically for a "${query} type vocal".
    ${additionalContextStr}
    ${bpmStr}
    ${xpandInstruction}
    Only use plugins from this list.
    CRITICAL: For each plugin, I have provided a list of its actual technical parameters in brackets []. You MUST prioritize using these EXACT parameter names in your 'deepDive' settings. If a parameter is missing, verify its exact existence in the plugin's real-world manual before including it. NEVER hallucinate or invent parameters that do not exist on the plugin's interface.
    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${ruhedraStyle}
    ${getLanguageInstruction(language)}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${JSFX_PRIORITY_SPEC_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    Ensure the recipe captures the signature vocal sound, effects, and mixing techniques associated with ${query}.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific vocal chain.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.
    You MUST provide the 'gangstaVox' object in your response.
    - trackingChain: Include the unisonPlugin (if applicable) and up to 4 inserts. Provide a deep dive for each ().
    - vocalTracks: Provide multiple vocal layers (Lead, Adlibs, Doubles, etc.). For each, describe the sourceSoundGoal, which bus to send to (busSend), and the fxPlugins (with deep dives - ).
    - layeringStrategy: Explain how all these vocal layers should sit together in the mix.
    You MUST also provide the 'busses' array. Create busses (e.g., "Vocal Reverb Bus", "Delay Bus") and list which vocal tracks are using them, along with the fxPlugins on the bus and their deep dives ().
    You MUST provide the 'masterPlugins' array with deep dives for the master chain ().
    You MUST provide 'drumPatterns' and 'arrangement' as context for the beat.
    CRITICAL DRUM PATTERN RULES:
    - Since this is an extract recipe for a full song, you MUST provide 16-bar or 32-bar long MIDI patterns! Provide ALL instruments playing in the song!
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    ${ADVANCED_MIDI_PROMPT}
  ` : `
    You are an expert audio engineer and producer.
    ${nonJsfxDiktat}
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Beat Recipe" specifically for a "${query} type beat".
    ${additionalContextStr}
    ${bpmStr}
    ${xpandInstruction}
    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${getLanguageInstruction(language)}
    Ensure the recipe captures the signature sound, bounce, and atmospheric elements associated with ${query}.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific beat type.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.
    You MUST provide the 'instruments' array with EXACTLY 6 DISTINCT INSTRUMENTS/TRACKS (no more, no less). The 6 tracks MUST be:
      1. A Pad (Melody track, e.g. using Serum, Keyscape, Omnisphere, or Xpand!2)
      2. A Lead (Melody track, e.g. using Serum, Omnisphere, or Kontakt)
      3. A Sub Bass or 808 (Bass track, e.g. using SubLab, Serum, or Trilogy)
      4. A Kick (Drum/Sampler instrument track with exact sampler settings to synthesize/shape a punchy kick)
      5. A Hi-Hat (Drum/Sampler instrument track with sampler/envelope settings to shape a clean hi-hat)
      6. A Clap or Snare (Drum/Sampler instrument track with sampler/envelope settings to shape a crispy clap/snare)
    CRITICAL: Each of these 6 instruments MUST have a minimum of 2 FX plugins in its 'fxPlugins' array (each with full, detailed 'deepDive' parameter lists).
    CRITICAL: ALL VST INSTRUMENTS AND ALL FX DEEP DIVES MUST HAVE EXHAUSTIVE PARAMETERS WITH ACTUAL REASONABLE NUMERICAL VALUES. Do not give simple or abbreviated settings. For instance, when using SubLab for the sub bass, you MUST provide exhaustive parameter settings for EVERY section of the plugin (Synth Oscillator, Sample Oscillator, Sub Oscillator, Filter, LFO, and Master Pitch/Glide envelopes).
    CRITICAL: NO SHORTCUTS. You MUST provide exhaustive 'fxPlugins' for every instrument, 'midiNotes' for every instrument, full 'drumPatterns', and full 'masterPlugins'. DO NOT skip anything!
    CRITICAL: 808s and Basslines MUST be included in the 'instruments' array with a detailed 'midiNotes' pattern. DO NOT put 808s in 'drumPatterns'.
    CRITICAL: DO NOT use vocals as a main instrument in the 'instruments' array. Vocals MUST be separate.
    For each instrument:
    - Provide the exact plugin name to use in the 'plugin' field.
    - Provide a deep dive on the instrument itself (e.g., oscillator settings, macro tweaks, filter envelopes).  
    - Provide an array of fxPlugins (up to 10) with a deep dive for EACH plugin.  
    CRITICAL: If the user has connected pedals or amps to an instrument (as listed in their analog hardware), you MUST include those specific pedals and amps in the fxPlugins array for that instrument and provide real, detailed parameter settings for them to achieve the desired sound.
    - ADVANCED ROUTING (OPTIONAL): If a plugin should be processed in parallel or on a specific frequency band (Multiband Split), use the 'routing' (e.g., "Parallel A (Crush)", "Parallel B (Space)") or 'band' (e.g., "Lows (0-150Hz)", "Highs (2kHz+)") properties in the fxPlugin object.
    - Specify which bus to send to (busSend).
    - Provide detailed MIDI patterns for this instrument in the 'midiNotes' object (intro, verse, hook, bridge, outro arrays), tailored to the tempo (BPM). Each array MUST equal exactly 16 beats (4 bars) or 32 beats (8 bars) based on the section. If the user provided a reference, match it.
      Each note in the array MUST have:
      - pitch: (e.g., 'C4')
      - duration: (e.g., '4', '8', '16')
      - wait: (e.g., '0', '4', '8')
      - velocity: (number between 0 and 127)
    If vocals are used in the beat (e.g., vocal chops, atmospheric textures), you MUST provide the 'vocalElements' object (same structure as gangstaVox) to describe them. This is the ONLY place vocal elements should be described.
    You MUST provide the 'busses' array. Create busses (e.g., "Drum Bus", "Melody Bus") and list which instrument tracks are using them, along with the fxPlugins on the bus and their deep dives.
    You MUST provide the 'masterPlugins' array with deep dives for the master chain.
    You MUST provide 'drumPatterns' and 'arrangement'.
    CRITICAL DRUM PATTERN RULES:
    - Since this is an extract recipe for a full song, you MUST provide 16-bar or 32-bar long MIDI patterns! Provide ALL instruments playing in the song!
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    ${ADVANCED_MIDI_PROMPT}
  `;
  const multiBandInstruction = getMultiBandInstruction(isMultiBandMode);
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: { parts: [{ text: prompt + multiBandInstruction + getSchemaInstruction(isGangstaVox) }] },
    config: {
      customAction: 'type_beat_search',
      responseMimeType: "application/json"
    }
  });
  const jsonStr = response.text?.trim() || '{"recipes": []}';
  console.log("Gemini response text (Custom Beat Recommendations):", jsonStr);
  let result;
  try {
    result = postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
    if (Array.isArray(result)) result = { recipes: result };
    result = validateRecipeResponse(result);
  } catch (e: any) {
    console.error("Detailed Error in getCustomBeatRecommendations:", e);
    console.error("Safety/Blocked:", JSON.stringify(response?.candidates?.[0] || {}));
    throw new Error(`Format error in getCustomBeatRecommendations. Details: ${e.message || e}nRaw: ${typeof jsonStr !== 'undefined' ? jsonStr.substring(0, 500) : "empty"}nSafety: ${JSON.stringify(response?.candidates?.[0]?.safetyRatings || "none")}`);
  }
  if (isGangstaVox && result.recipes) {
    result.recipes = result.recipes.map((r: any) => ({ ...r, isGangstaVox: true }));
  }
  return result;
};
export const getSongBeatRecommendations = async (plugins: VSTPlugin[], songQuery: string, analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, language: string = 'en', isMultiBandMode: boolean = false, bpm?: string, context?: string, isJsfxMode: boolean = false, installedJsfxPacks: string[] = [], xpandPresets?: XpandPreset[]): Promise<RecommendationResponse> => {
  const blueprint = await generateStructuralBlueprint(songQuery, language);
  const ai = getAI();
      const isStudioOne = dawType?.toLowerCase().includes('studio one');
  const filteredPlugins = plugins.filter(p => {
    if (!isStudioOne && (p.vendor.toLowerCase().includes('presonus') || p.name.toLowerCase().includes('presonus'))) {
      return false;
    }
    return true;
  });
  const limitedPlugins = [
    ...filteredPlugins.filter(p => starredPlugins.includes(p.name)),
    ...filteredPlugins.filter(p => !starredPlugins.includes(p.name))
  ].slice(0, 50);
  const pluginListStr = limitedPlugins.map(p => {
    let str = `${p.vendor} - ${p.name} (${p.type})`;
    if (p.parameters && p.parameters.length > 0) {
      str += ` [Parameters: ${p.parameters.join(', ')}]`;
    }
    return str;
  }).join('\n');
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You ABSOLUTELY MUST prioritize using these plugins in EVERY SINGLE track/step whenever possible:n${starredPlugins.join(', ')}` : '';
  const hasSphereMic = analogHardware.some(h => ['Sphere DLX', 'Sphere LX', 'L22'].includes(h.name) || h.name.toLowerCase() === 'l22' || h.name.toLowerCase().includes('townsend'));
  const sphereMicStr = hasSphereMic ? `\nCRITICAL: The user owns a Universal Audio Sphere (DLX/LX) or Townsend Labs L22 microphone. If the recipe involves a vocal tracking chain, you MUST assign the 'UAD Sphere Mic Collection', 'Ocean Way Mic Collection', or 'Bill Putnam Mic Collection' plugin as the VERY FIRST insert plugin on the vocal channel tracking chain. You MUST specifically select a mic model inside it based on the vibe searched. After the mic collection plugin, you can add up to 3 more plugins.` : '';
  
  const additionalContextStr = context ? `nUSER SPECIFIED CONTEXT: ${context}nYou MUST incorporate these instructions or themes tightly into the generated recipe.` : '';
  const bpmStr = bpm ? `nUSER SPECIFIED EXACT BPM: ${bpm}nYou MUST use this exact BPM in the recipe, and tailor the midi, drums, and time-based effects (delay, reverb pre-delay) to align perfectly with it.` : '';
  const xpandInstruction = getXpandInstructions(xpandPresets);

  const nonJsfxDiktat = (dawType === 'REAPER' || dawType === 'Reaper') ? '' : `
      ==================================================
      🚨🚨 CRITICAL NON-JSFX DIRECTIVE 🚨🚨
      THE USER IS NOT USING REAPER DAW.
      YOU ARE ABSOLUTELY, STRICTLY, UNDER NO CIRCUMSTANCES ALLOWED TO SUGGEST OR RECOMMEND REAPER NATIVE PLUGINS OR COCKOS JSFX (e.g. plugins starting with "JS:" or "Rea" like ReaComp, ReaEQ).
      Focus ONLY on standard 3rd-party industry VST/AU plugins and explicitly avoid JSFX logic.
      ==================================================
  `;

  let jsfxDiktat = "";
  if (isJsfxMode) {
    const simplifiedDB = getSimplifiedJSFXDatabase(installedJsfxPacks, starredPlugins);
    jsfxDiktat = `
      CRITICAL INSTRUCTION: JSFX MODE IS ENABLED.
      You are FORBIDDEN from recommending any third-party VSTs, VST3s, or AUs.
      You MUST ONLY recommend JSFX plugins from the provided 'JSFX Database' list below.
      When providing 'deepDive' settings, you MUST include 'parameter' names that EXACTLY match the slider names from the JSFX Database, and you MUST ensure the values are within the allowed min/max range.
      ${getEliteProducerSecretsPrompt(installedJsfxPacks)}

      JSFX DATABASE (ONLY use these plugins):
      ${JSON.stringify(simplifiedDB)}
    `;
  }

  const prompt = isGangstaVox ? `
    You are an expert audio engineer and producer.
    ${nonJsfxDiktat}
    ${jsfxDiktat}
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Vocal FX Chain Recipe" that recreate the vocal production style, effects, and mixing techniques of the song "${songQuery}".
    ${additionalContextStr}
    ${bpmStr}
    ${xpandInstruction}
    Only use plugins from this list.
    CRITICAL: For each plugin, I have provided a list of its actual technical parameters in brackets []. You MUST prioritize using these EXACT parameter names in your 'deepDive' settings. If a parameter is missing, verify its exact existence in the plugin's real-world manual before including it. NEVER hallucinate or invent parameters that do not exist on the plugin's interface.
    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${getLanguageInstruction(language)}
    ${GULLFOSS_SPEC_PROMPT}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${JSFX_PRIORITY_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    Ensure the recipe captures the signature vocal sound of that specific song.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific vocal chain.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.
    You MUST provide the 'gangstaVox' object in your response.
    - trackingChain: Include the unisonPlugin (if applicable) and up to 4 inserts. Provide a deep dive for each (typically 25-50 settings).
    - vocalTracks: Provide multiple vocal layers (Lead, Adlibs, Doubles, etc.). For each, describe the sourceSoundGoal, which bus to send to (busSend), and the fxPlugins (with deep dives - typically 25-50 settings).
    - layeringStrategy: Explain how all these vocal layers should sit together in the mix.
    You MUST also provide the 'busses' array. Create busses (e.g., "Vocal Reverb Bus", "Delay Bus") and list which vocal tracks are using them, along with the fxPlugins on the bus and their deep dives (typically 25-50 settings).
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (typically 25-50 settings).
    You MUST provide 'drumPatterns' and 'arrangement' as context for the beat.
    CRITICAL DRUM PATTERN RULES:
    - Since this is an extract recipe for a full song, you MUST provide 16-bar or 32-bar long MIDI patterns! Provide ALL instruments playing in the song!
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    ${ADVANCED_MIDI_PROMPT}
  ` : `
    You are an expert audio engineer and producer.
    ${nonJsfxDiktat}
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Beat Recipe" that recreate the production style, bounce, and sonic atmosphere of the song "${songQuery}".
    ${additionalContextStr}
    ${bpmStr}
    ${xpandInstruction}
    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${getLanguageInstruction(language)}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${JSFX_PRIORITY_SPEC_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    FOLLOW THIS STRUCTURAL BLUEPRINT:
    ${JSON.stringify(blueprint)}
    Ensure the recipe captures the signature sound, instrumentation, and mixing techniques of that specific song, while strictly adhering to the structural blueprint provided above.
    CRITICAL: NO SHORTCUTS. You MUST provide exhaustive 'fxPlugins' for every instrument, 'midiNotes' for every instrument, full 'drumPatterns', and full 'masterPlugins'. DO NOT skip anything!
    CRITICAL: You MUST use the blueprint's microTiming, velocityDynamics, chordVoicing, and repetitionStrategy to generate the MIDI notes and drum patterns. This is essential for achieving an iconic, authentic, high-energy, and highly realistic MIDI quality that perfectly encapsulates the requested tracking.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific beat type.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.
    You MUST provide the 'instruments' array with EXACTLY 6 DISTINCT INSTRUMENTS/TRACKS (no more, no less). The 6 tracks MUST be:
      1. A Pad (Melody track, e.g. using Serum, Keyscape, Omnisphere, or Xpand!2)
      2. A Lead (Melody track, e.g. using Serum, Omnisphere, or Kontakt)
      3. A Sub Bass or 808 (Bass track, e.g. using SubLab, Serum, or Trilogy)
      4. A Kick (Drum/Sampler instrument track with exact sampler settings to synthesize/shape a punchy kick)
      5. A Hi-Hat (Drum/Sampler instrument track with sampler/envelope settings to shape a clean hi-hat)
      6. A Clap or Snare (Drum/Sampler instrument track with sampler/envelope settings to shape a crispy clap/snare)
    CRITICAL: Each of these 6 instruments MUST have a minimum of 2 FX plugins in its 'fxPlugins' array (each with full, detailed 'deepDive' parameter lists).
    CRITICAL: ALL VST INSTRUMENTS AND ALL FX DEEP DIVES MUST HAVE EXHAUSTIVE PARAMETERS WITH ACTUAL REASONABLE NUMERICAL VALUES. Do not give simple or abbreviated settings. For instance, when using SubLab for the sub bass, you MUST provide exhaustive parameter settings for EVERY section of the plugin (Synth Oscillator, Sample Oscillator, Sub Oscillator, Filter, LFO, and Master Pitch/Glide envelopes).
    CRITICAL: 808s and Basslines MUST be included in the 'instruments' array with a detailed 'midiNotes' pattern. DO NOT put 808s in 'drumPatterns'.
    CRITICAL: DO NOT use vocals as a main instrument in the 'instruments' array. Vocals MUST be separate.
    For each instrument:
    - Provide the exact plugin name to use in the 'plugin' field.
    - Provide a deep dive on the instrument itself (e.g., oscillator settings, macro tweaks, filter envelopes).  
    - Provide an array of fxPlugins (up to 10) with a deep dive for EACH plugin.  
    CRITICAL: If the user has connected pedals or amps to an instrument (as listed in their analog hardware), you MUST include those specific pedals and amps in the fxPlugins array for that instrument and provide real, detailed parameter settings for them to achieve the desired sound.
    - ADVANCED ROUTING (OPTIONAL): If a plugin should be processed in parallel or on a specific frequency band (Multiband Split), use the 'routing' (e.g., "Parallel A (Crush)", "Parallel B (Space)") or 'band' (e.g., "Lows (0-150Hz)", "Highs (2kHz+)") properties in the fxPlugin object.
    - Specify which bus to send to (busSend).
    - Provide detailed MIDI patterns for this instrument in the 'midiNotes' object (intro, verse, hook, bridge, outro arrays), tailored to the tempo (BPM). Each array MUST equal exactly 16 beats (4 bars) or 32 beats (8 bars) based on the section. If the user provided a reference, match it.
      Each note in the array MUST have:
      - pitch: (e.g., 'C4')
      - duration: (e.g., '4', '8', '16')
      - wait: (e.g., '0', '4', '8')
      - velocity: (number between 0 and 127)
    If vocals are used in the beat (e.g., vocal chops, atmospheric textures), you MUST provide the 'vocalElements' object (same structure as gangstaVox) to describe them. This is the ONLY place vocal elements should be described.  Ensure every plugin in the vocalElements chain has .
    You MUST provide the 'busses' array. Create busses (e.g., "Drum Bus", "Melody Bus") and list which instrument tracks are using them, along with the fxPlugins on the bus and their deep dives  (EVERY available parameter per plugin, .
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (EVERY available parameter per plugin, .
    You MUST provide 'drumPatterns' and 'arrangement'.
    CRITICAL DRUM PATTERN RULES:
    - Since this is an extract recipe for a full song, you MUST provide 16-bar or 32-bar long MIDI patterns! Provide ALL instruments playing in the song!
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    ${ADVANCED_MIDI_PROMPT}
  `;
  const multiBandInstruction = getMultiBandInstruction(isMultiBandMode);
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: { parts: [{ text: prompt + multiBandInstruction + getSchemaInstruction(isGangstaVox) }] },
    config: {
      customAction: 'song_search',
      responseMimeType: "application/json"
    }
  });
  const jsonStr = response.text?.trim() || '{"recipes": []}';
  console.log("Gemini response text (Song Beat Recommendations):", jsonStr);
  let result;
  try {
    result = postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
    if (Array.isArray(result)) result = { recipes: result };
    result = validateRecipeResponse(result);
  } catch (e: any) {
    console.error("Detailed Error in getSongBeatRecommendations:", e);
    console.error("Safety/Blocked:", JSON.stringify(response?.candidates?.[0] || {}));
    throw new Error(`Format error in getSongBeatRecommendations. Details: ${e.message || e}nRaw: ${typeof jsonStr !== 'undefined' ? jsonStr.substring(0, 500) : "empty"}nSafety: ${JSON.stringify(response?.candidates?.[0]?.safetyRatings || "none")}`);
  }
  if (isGangstaVox && result.recipes) {
    result.recipes = result.recipes.map((r: any) => ({ ...r, isGangstaVox: true }));
  }
  return result;
};
export const generateVoiceover = async (text: string, bpm?: number | null): Promise<{ base64: string, mimeType: string }> => {
  const ai = getAI();
  const tempoInstructions = bpm ? `The instrumental beat is exactly ${bpm} BPM. You MUST time your syllables and rhythmic flow to land perfectly on tempo to this ${bpm} BPM beat at a NORMAL, standard playback speed.` : "Provide a natural Houston style cadence at a normal tempo.";
  const prompt = `Say this text in a natural, smooth, melodic Houston rap cadence at a NORMAL TEMPO (like a professional studio recording by Z-Ro, but DO NOT say your name or mention Z-Ro). DO NOT slow it down, DO NOT chop and screw it. Keep it clear and at standard speed. n${tempoInstructions}nn${text}`;
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-tts-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      customAction: 'generate_voiceover',
      responseModalities: ["AUDIO"],
      speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' } } } } });
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/wav';
  if (!base64Audio) {
    throw new Error('Failed to generate voiceover');
  }
  return { base64: base64Audio, mimeType };
};
export const analyzeInstrumental = async (audioBase64: string | null, mimeType: string, geminiFileUri?: string | null): Promise<{ bpm: number, loopStart: number }> => {
  const ai = getAI();
  const prompt = "Analyze this instrumental track. Identify its exact BPM (Tempo) and the exact start time (in seconds) of the clearest, most loopable 4-bar or 8-bar section. Output a JSON object with two fields: 'bpm' (a number, the tempo) and 'loopStart' (a number, the start time in seconds). Do not include any other text.";
  
  let audioPart: any;
  if (geminiFileUri && geminiFileUri.trim() !== '') {
    let uri = geminiFileUri;
    if (uri.startsWith('files/')) {
       uri = 'https://generativelanguage.googleapis.com/v1beta/' + uri;
    } else if (!uri.startsWith('https://')) {
       uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
    }
    audioPart = { fileData: { fileUri: uri, mimeType } };
  } else if (audioBase64) {
    audioPart = { inlineData: { data: audioBase64, mimeType } };
  } else {
    throw new Error("No audio data or file URI provided for analysis.");
  }

  const data = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }, audioPart] }],
    config: {
      customAction: 'analyze_instrumental' }
  });
  // The proxy returns raw JSON, so we extract text from candidates
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Could not analyze instrumental: No text in response.");
  const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const result = JSON.parse(sanitizeJSON(jsonStr));
  return { bpm: result.bpm || 85, loopStart: result.loopStart || 0 };
};
export const generateContentViaBackend = async (model: string, prompt: string, config: any, _turnstileToken?: string | null, _sessionId?: string | null) => {
  const ai = getAI();
  return await ai.models.generateContent({
    model,
    contents: prompt,
    config
  });
};
export const getAudioBeatRecommendations = async (plugins: VSTPlugin[], audioBase64: string | null, audioUrl: string | null, mimeType: string, analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, userContext: string = "", geminiFileUri: string | null = null, language: string = 'en', isMultiBandMode: boolean = false, isJsfxMode: boolean = false, installedJsfxPacks: string[] = [], recreateBase64: string | null = null, recreateFileUri: string | null = null, recreateMimeType: string | null = null, xpandPresets?: XpandPreset[]): Promise<RecommendationResponse> => {
  const ai = getAI();
  // Limit plugin list to 50 most relevant to avoid context/complexity limits
    const isStudioOne = dawType?.toLowerCase().includes('studio one');
  const filteredPlugins = plugins.filter(p => {
    if (!isStudioOne && (p.vendor.toLowerCase().includes('presonus') || p.name.toLowerCase().includes('presonus'))) {
      return false;
    }
    return true;
  });
    const limitedPlugins = [
    ...filteredPlugins.filter(p => starredPlugins.includes(p.name)),
    ...filteredPlugins.filter(p => !starredPlugins.includes(p.name))
  ].slice(0, 50);
  const pluginListStr = limitedPlugins.map(p => `${p.vendor} - ${p.name} (${p.type})`).join('\n');
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You ABSOLUTELY MUST prioritize using these plugins in EVERY SINGLE track/step whenever possible:n${starredPlugins.join(', ')}` : '';
  const hasSphereMic = analogHardware.some(h => ['Sphere DLX', 'Sphere LX', 'L22'].includes(h.name) || h.name.toLowerCase() === 'l22' || h.name.toLowerCase().includes('townsend'));
  const sphereMicStr = hasSphereMic ? `\nCRITICAL: The user owns a Universal Audio Sphere (DLX/LX) or Townsend Labs L22 microphone. If the recipe involves a vocal tracking chain, you MUST assign the 'UAD Sphere Mic Collection', 'Ocean Way Mic Collection', or 'Bill Putnam Mic Collection' plugin as the VERY FIRST insert plugin on the vocal channel tracking chain. You MUST specifically select a mic model inside it based on the vibe searched. After the mic collection plugin, you can add up to 3 more plugins.` : '';
  const contextStr = userContext ? `\nCRITICAL USER CONTEXT: The user has provided the following information about their track and goals. You MUST incorporate this into your analysis and advice ALWAYS, IT IS THE MOST IMPORTANT INSTRUCTION. Your suggestions MUST explicitly align with and aim to achieve these exact goals, and NOT ruin the mix/volume:n"${userContext}"n` : "";
  const uadPlugins = plugins.filter(p => 
    (p.vendor.toLowerCase().includes('universal audio') || p.name.toLowerCase().includes('uad')) && 
    !p.name.toLowerCase().includes('native') && 
    !p.name.toLowerCase().includes('uadx')
  );
  const uadPluginListStr = uadPlugins.length > 0 
    ? uadPlugins.map(p => `${p.vendor} - ${p.name} (${p.type})`).join('\n')
    : 'Universal Audio plugins defaults (e.g. 1176, LA-2A, Pultec EQP-1A, Neve 1073, Townsend Sphere, Ocean Way, etc.)';
  const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo'));
  const apolloModel = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';
  const hasTownsend = analogHardware.some(h => h.name.toLowerCase().includes('townsend') || h.name.toLowerCase().includes('sphere'));
  const hasOceanWayMic = plugins?.some(p => p.name.toLowerCase().includes('ocean way mic')) || false;
  const xpandInstruction = getXpandInstructions(xpandPresets);
  
  const hasRecreate = !!(recreateFileUri || recreateBase64);
  const doubleAudioDiktat = hasRecreate ? `
      ==================================================
      🚨🚨 DOUBLE-AUDIO RECREATION & ALIGNMENT DIRECTIVE 🚨🚨
      The user has provided TWO audio files:
      - **File 1 (The Source/Vibe Audio File)**: This is the first attachment. This is the reference song to analyze and extract from (e.g. "Promises Promises"). We want to extract its vibe, instrumentation, specific melodic/drum hooks, and sound design.
      - **File 2 (The Target/Recreate-For Audio File)**: This is the second attachment. This is the user's base track or target song (which may be in a different key, BPM, or style) that they want the first song's elements recreated FOR.

      Your absolute priority:
      1. Meticulously analyze BOTH audio files to detect their respective BPMs and Keys.
      2. Adapt the extracted instrumentation, chords, basslines, and MIDI patterns of File 1 (Source) so that they fit PERFECTLY with the Key and BPM of File 2 (Target/Recreate-For).
      3. If the user specifies a specific sound to recreate in their context (e.g., "recreate the xylophone sound"), focus heavily on extracting that exact sound/pattern from File 1, and map its MIDI notes and rhythm to the BPM and Key of File 2, selecting the best matching VST from the user's gear rack, and populating every single parameter in 'deepDive' for both the VST instrument and its FX plugins exhaustively.
      4. Detect the precise bar length of each section (Intro, Verse, Hook, Bridge, Outro) from the Target Track (File 2). Populate the 'detectedSectionLengths' object in the JSON with these exact bar lengths (e.g., {"intro": 8, "verse": 16, "hook": 8, "bridge": 4, "outro": 8}).
      5. The generated MIDI notes for all instruments and the drum patterns for all parts (kick, snare, hi-hat) MUST span the exact detected bar lengths for each corresponding section of File 2. For instance, if File 2's Hook section is 8 bars long, the MIDI notes for the hook must sum to exactly 32 beats, and the steps in the hook drum patterns must span up to step 128 (or 256 for double time). If the Verse is 16 bars long, they must span exactly 16 bars (64 beats for instruments, up to step 256 or 512 for drums). DO NOT use short 4-bar or generic placeholders.
      6. Since you are modifying and adding onto File 2 (the user's existing project track), the suggestions and MIDI patterns you generate should be designed as premium, DAWs-ready "additions" (melodic counters, rhythmic grooves, complementary chord layers, or reinforcing percussion) that fit the exact vibe of File 2, rather than just matching tempo. They must sound musically correct and highly professional when dragged-and-dropped directly onto File 2 in the user's DAW.
      ==================================================
  ` : "";
  
  const nonJsfxDiktat = (dawType === 'REAPER' || dawType === 'Reaper') ? '' : `
      ==================================================
      🚨🚨 CRITICAL NON-JSFX DIRECTIVE 🚨🚨
      THE USER IS NOT USING REAPER DAW.
      YOU ARE ABSOLUTELY, STRICTLY, UNDER NO CIRCUMSTANCES ALLOWED TO SUGGEST OR RECOMMEND REAPER NATIVE PLUGINS OR COCKOS JSFX (e.g. plugins starting with "JS:" or "Rea" like ReaComp, ReaEQ).
      Focus ONLY on standard 3rd-party industry VST/AU plugins and explicitly avoid JSFX logic.
      ==================================================
  `;

  let jsfxDiktat = "";
  if (isJsfxMode) {
    const simplifiedDB = getSimplifiedJSFXDatabase(installedJsfxPacks, starredPlugins);
    jsfxDiktat = `
      CRITICAL INSTRUCTION: JSFX MODE IS ENABLED.
      You are FORBIDDEN from recommending any third-party VSTs, VST3s, or AUs.
      You MUST ONLY recommend JSFX plugins from the provided 'JSFX Database' list below.
      When providing 'deepDive' settings, you MUST include 'parameter' names that EXACTLY match the slider names from the JSFX Database, and you MUST ensure the values are within the allowed min/max range.
      ${getEliteProducerSecretsPrompt(installedJsfxPacks)}

      JSFX DATABASE (ONLY use these plugins):
      ${JSON.stringify(simplifiedDB)}
    `;
  }

  let prompt = isGangstaVox ? `
    You are an expert audio engineer and producer.
    ${nonJsfxDiktat}
    ${jsfxDiktat}
    Analyze the attached audio file and suggest 1 high-level, extremely detailed "Vocal FX Chain Recipe" that recreate the vocal production style, effects, and mixing techniques heard in the provided audio.
    Only use mixing plugins from this list (for DAW processing):
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${contextStr}
    ${doubleAudioDiktat}
    ${xpandInstruction}
    ${getLanguageInstruction(language)}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    ${audioUrl ? `The main audio file is available at this URL: ${audioUrl}. Please fetch and analyze it.` : "The main audio file is provided as inline data."}
    ${recreateFileUri || recreateBase64 ? "nThere is a second audio file attached. This is the target 'Recreate For' track. Analyze both and adapt the first song's elements to match the second track's BPM and Key." : ""}
    Ensure the recipe captures the signature vocal sound of the audio.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific vocal chain.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.
    You MUST provide the 'gangstaVox' object in your response.
    ${hasApollo ? `
    CRITICAL: The user owns a Universal Audio Apollo interface (${apolloModel}).
    You MUST include a 'trackingChain' specifically for this Apollo, mirroring the UAD Console workflow.
    MANDATORY UAD CONSOLE TRACKING CHAIN REQUIREMENTS:
    1. UNISON SLOT: A Unison plugin (e.g., Neve, API, Manley, SSL) is MANDATORY.
    2. INSERTS: You MUST provide EXACTLY 4 plugins in the inserts array. The 4 slots MUST BE FILLED.
       ${hasTownsend || hasOceanWayMic ? "The FIRST insert (Plugin 1 of 4) MUST ALWAYS be 'Ocean Way Mic Collection' (or 'Sphere Mic Collection' / 'Bill Putnam Mic Collection' if applicable)." : "The FIRST insert SHOULD ALWAYS be 'Ocean Way Mic Collection' (or similar mic emulation if they have it)."}
    3. AUX CHANNELS: Both 'aux1' and 'aux2' are MANDATORY. You MUST provide UAD plugins in both to track with 2 aux fx channels.
    4. ACCURACY: DO NOT BE LAZY. You MUST provide EVERY SINGLE available setting found on the actual plugin GUI for each UAD plugin ( exact parameter settings per plugin, capture every knob, switch, and fader).
    FOR THE UAD CONSOLE TRACKING CHAIN, YOU MUST STRICTLY ONLY USE THESE UAD-2 DSP PLUGINS:
    ${uadPluginListStr}
    ` : ''}
    - trackingChain: Include the unisonPlugin, EXACTLY 4 inserts, aux1, and aux2.
    - Provide a deep dive for each tracking plugin (EXHAUSTIVE list of EVERY parameter, typically 30-50+ settings. DO NOT BE LAZY).
    - Provide dawRoutingInstructions and dspUsageNote for the tracking chain.
    - vocalTracks: Provide multiple vocal layers (Lead, Adlibs, Doubles, etc.). For each, describe the sourceSoundGoal, which bus to send to (busSend), and the fxPlugins (with deep dives - typically 25-50 settings).
    - layeringStrategy: Explain how all these vocal layers should sit together in the mix.
    You MUST also provide the 'busses' array. Create busses (e.g., "Vocal Reverb Bus", "Delay Bus") and list which vocal tracks are using them, along with the fxPlugins on the bus and their deep dives (typically 25-50 settings).
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (typically 25-50 settings).
    You MUST provide 'drumPatterns' and 'arrangement' as context for the beat.
    CRITICAL DRUM PATTERN RULES:
    - Since this is an extract recipe for a full song, you MUST provide 16-bar or 32-bar long MIDI patterns! Provide ALL instruments playing in the song!
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 16 bars: Provide steps ranging from 1 to 256 (or 1-512 if double time).
    - For 32 bars: Provide steps ranging from 1 to 512 (or 1-1024 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 16 or 32 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    ${EXTRACT_RECIPE_MIDI_PROMPT}
  ` : `
    Analyze the attached audio file and suggest 1 high-level, extremely detailed "Beat Recipe"
 that recreate the production style, bounce, and sonic atmosphere of the provided audio.
    You are an expert audio engineer and producer.
    ${nonJsfxDiktat}
    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${contextStr}
    ${doubleAudioDiktat}
    ${xpandInstruction}
    ${getLanguageInstruction(language)}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    ${audioUrl ? `The main audio file is available at this URL: ${audioUrl}. Please fetch and analyze it.` : "The main audio file is provided as inline data."}
    ${recreateFileUri || recreateBase64 ? "nThere is a second audio file attached. This is the target 'Recreate For' track. Analyze both and adapt the first song's elements (such as chords, leads, sub-bass, 808s, arpeggios, and drums) to match the second track's BPM and Key perfectly." : ""}
    Ensure the recipe captures the signature sound, instrumentation, and mixing techniques heard in the audio.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific beat type.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.
    You MUST provide the 'instruments' array with EXACTLY 6 DISTINCT INSTRUMENTS/TRACKS (no more, no less). The 6 tracks MUST be:
      1. A Pad (Melody track, e.g. using Serum, Keyscape, Omnisphere, or Xpand!2)
      2. A Lead (Melody track, e.g. using Serum, Omnisphere, or Kontakt)
      3. A Sub Bass or 808 (Bass track, e.g. using SubLab, Serum, or Trilogy)
      4. A Kick (Drum/Sampler instrument track with exact sampler settings to synthesize/shape a punchy kick)
      5. A Hi-Hat (Drum/Sampler instrument track with sampler/envelope settings to shape a clean hi-hat)
      6. A Clap or Snare (Drum/Sampler instrument track with sampler/envelope settings to shape a crispy clap/snare)
    CRITICAL: Each of these 6 instruments MUST have a minimum of 2 FX plugins in its 'fxPlugins' array (each with full, detailed 'deepDive' parameter lists).
    CRITICAL: ALL VST INSTRUMENTS AND ALL FX DEEP DIVES MUST HAVE EXHAUSTIVE PARAMETERS WITH ACTUAL REASONABLE NUMERICAL VALUES. Do not give simple or abbreviated settings. For instance, when using SubLab for the sub bass, you MUST provide exhaustive parameter settings for EVERY section of the plugin (Synth Oscillator, Sample Oscillator, Sub Oscillator, Filter, LFO, and Master Pitch/Glide envelopes).
    CRITICAL: 808s and Basslines MUST be included in the 'instruments' array with a detailed 'midiNotes' pattern. DO NOT put 808s in 'drumPatterns'.
    CRITICAL: DO NOT use vocals as a main instrument in the 'instruments' array. Vocals MUST be separate.
    For each instrument:
    - Provide the exact plugin name to use in the 'plugin' field.
    - Provide a deep dive on the instrument itself (e.g., oscillator settings, macro tweaks, filter envelopes).  
    - Provide an array of fxPlugins (up to 10) with a deep dive for EACH plugin.  
    CRITICAL: If the user has connected pedals or amps to an instrument (as listed in their analog hardware), you MUST include those specific pedals and amps in the fxPlugins array for that instrument and provide real, detailed parameter settings for them to achieve the desired sound.
    - ADVANCED ROUTING (OPTIONAL): If a plugin should be processed in parallel or on a specific frequency band (Multiband Split), use the 'routing' (e.g., "Parallel A (Crush)", "Parallel B (Space)") or 'band' (e.g., "Lows (0-150Hz)", "Highs (2kHz+)") properties in the fxPlugin object.
    - Specify which bus to send to (busSend).
    - Provide detailed MIDI patterns for this instrument in the 'midiNotes' object (intro, verse, hook, bridge, outro arrays), tailored to the tempo (BPM). Each array MUST equal exactly 16 beats (4 bars) or 32 beats (8 bars) based on the section. If the user provided a reference, match it.
      Each note in the array MUST have:
      - pitch: (e.g., 'C4')
      - duration: (e.g., '4', '8', '16')
      - wait: (e.g., '0', '4', '8')
      - velocity: (number between 0 and 127)
    If vocals are used in the beat (e.g., vocal chops, atmospheric textures), you MUST provide the 'vocalElements' object (same structure as gangstaVox) to describe them. This is the ONLY place vocal elements should be described.  Ensure every plugin in the vocalElements chain has .
    ${hasApollo ? `
    CRITICAL: For the vocalElements 'trackingChain', since the user owns a Universal Audio Apollo interface (${apolloModel}), you MUST include a 'trackingChain' specifically for this Apollo, mirroring the UAD Console workflow.
    FOR THE UAD CONSOLE TRACKING CHAIN in 'vocalElements', YOU MUST STRICTLY ONLY USE THESE UAD-2 DSP PLUGINS:
    ${uadPluginListStr}
    MANDATORY UAD CONSOLE TRACKING CHAIN REQUIREMENTS:
    1. UNISON SLOT: A Unison plugin is MANDATORY.
    2. INSERTS: You MUST provide EXACTLY 4 plugins in the inserts array. The FIRST insert (Plugin 1 of 4) MUST ALWAYS be "Ocean Way Mic Collection" (or equivalent mic modeled plugin).
    3. AUX CHANNELS: Both 'aux1' and 'aux2' are MANDATORY.
    4. ACCURACY: Provide EVERY available setting . 
    ` : ''}
    You MUST provide the 'busses' array. Create busses (e.g., "Drum Bus", "Melody Bus") and list which instrument tracks are using them, along with the fxPlugins on the bus and their deep dives  (EVERY available parameter per plugin, .
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (EVERY available parameter per plugin, .
    You MUST provide 'drumPatterns' and 'arrangement'.
    CRITICAL DRUM PATTERN RULES:
    - Since this is an extract recipe for a full song, you MUST provide 16-bar or 32-bar long MIDI patterns! Provide ALL instruments playing in the song!
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 16 bars: Provide steps ranging from 1 to 256 (or 1-512 if double time).
    - For 32 bars: Provide steps ranging from 1 to 512 (or 1-1024 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 16 or 32 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    ${EXTRACT_RECIPE_MIDI_PROMPT}
  `;
  const schemaObject = {
    type: Type.OBJECT,
    properties: {
      recipes: {
        type: Type.ARRAY,
        items: getUnifiedRecipeSchema(isGangstaVox),
        minItems: 1
      }
    },
    required: ["recipes"]
  };
  prompt += `n\nCRITICAL: You MUST return a valid JSON object. Your JSON object MUST exactly adhere to the following JSON Schema structure (do NOT deviate):n${JSON.stringify(schemaObject, null, 2)}`;
  const parts: any[] = [];
  if (geminiFileUri) {
    let uri = geminiFileUri;
    if (uri.includes('/files/')) {
       const uriParts = uri.split('/files/');
       uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
    } else if (!uri.startsWith('https://')) {
       uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
    }
    let finalMimeType = mimeType;
    parts.push({ fileData: { fileUri: uri, mimeType: finalMimeType } });
  } else if (audioBase64) {
    let finalMimeType = mimeType;
    parts.push({ inlineData: { data: audioBase64, mimeType: finalMimeType } });
  } else if (audioUrl) {
    console.log("Analyzing web link textually:", audioUrl);
  } else {
    throw new Error("No audio file or link provided for analysis (Beat).");
  }

  // Push second recreation file if present
  if (recreateFileUri) {
    let recUri = recreateFileUri;
    if (recUri.includes('/files/')) {
       const recUriParts = recUri.split('/files/');
       recUri = 'https://generativelanguage.googleapis.com/v1beta/files/' + recUriParts[1];
    } else if (!recUri.startsWith('https://')) {
       recUri = 'https://generativelanguage.googleapis.com/v1beta/' + (recUri.startsWith('files/') ? recUri : 'files/' + recUri);
    }
    parts.push({ fileData: { fileUri: recUri, mimeType: recreateMimeType || 'audio/mpeg' } });
  } else if (recreateBase64) {
    parts.push({ inlineData: { data: recreateBase64, mimeType: recreateMimeType || 'audio/mpeg' } });
  }
  const multiBandInstruction = getMultiBandInstruction(isMultiBandMode);
  parts.push({ text: prompt + multiBandInstruction });
  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: parts
      },
      config: {
        ...(geminiFileUri || audioBase64 ? { customAction: 'audio_analysis_recipe' } : {}),
        responseMimeType: "application/json",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
        ]
      }
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : String(error)}. Debug Info: parts=${JSON.stringify(parts)}`);
  }
  const jsonStr = response.text?.trim() || '{"recipes": []}';
  console.log("Gemini response text (Beat):", jsonStr);
  let result;
  try {
    result = postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
    if (Array.isArray(result)) result = { recipes: result };
    result = validateRecipeResponse(result);
  } catch (e: any) {
    console.error("Detailed Error in getAudioBeatRecommendations:", e);
    console.error("Safety/Blocked:", JSON.stringify(response?.candidates?.[0] || {}));
    throw new Error(`Format error in getAudioBeatRecommendations. Details: ${e.message || e}nRaw: ${typeof jsonStr !== 'undefined' ? jsonStr.substring(0, 500) : "empty"}nSafety: ${JSON.stringify(response?.candidates?.[0]?.safetyRatings || "none")}`);
  }
  console.log("Parsed result (Beat):", result);
  if (isGangstaVox && result.recipes) {
    result.recipes = result.recipes.map((r: any) => ({ ...r, isGangstaVox: true }));
  }
  return result;
};
export const getMixCritique = async (
  plugins: VSTPlugin[], 
  audioBase64: string | null, 
  audioUrl: string | null, 
  mimeType: string, 
  isGangstaVox: boolean = false, 
  hasStems: boolean = false, 
  userContext: string = "", 
  previousCritique: any = null, 
  referenceTrack: string = "", 
  referenceAudioBase64: string | null = null, 
  geminiFileUri: string | null = null, 
  referenceGeminiFileUri: string | null = null, 
  language: string = 'en', 
  uploadedStems?: any[], 
  analogInstruments: Hardware[] = [], 
  analogHardware: Hardware[] = [],
  isBusMode: boolean = false,
  isMultiBandMode: boolean = false,
  isMasterMode: boolean = false,
  isJsfxMode: boolean = false,
  installedJsfxPacks: string[] = [],
  starredPlugins: string[] = [],
  physicalMetrics?: { integratedLufs: number, truePeak: number, crestFactor: number, duration?: number },
  referencePhysicalMetrics?: { integratedLufs: number, truePeak: number, crestFactor: number, duration?: number },
  stemsPhysicalMetrics?: Record<string, { integratedLufs: number, truePeak: number, crestFactor: number, duration?: number }>,
  dawType: string | null = null,
  lunaSumming: 'api' | 'neve' | 'off' = 'off',
  lunaTape: 'oxide' | 'studer' | 'off' = 'off'
): Promise<any> => {
  const ai = getAI();
      const isStudioOne = dawType?.toLowerCase().includes('studio one');
  const filteredPlugins = plugins.filter(p => {
    if (!isStudioOne && (p.vendor.toLowerCase().includes('presonus') || p.name.toLowerCase().includes('presonus'))) {
      return false;
    }
    return true;
  });
  const limitedPlugins = [
    ...filteredPlugins.filter(p => starredPlugins.includes(p.name)),
    ...filteredPlugins.filter(p => !starredPlugins.includes(p.name))
  ].slice(0, 50);
  const pluginListStr = limitedPlugins.map(p => {
    let str = `${p.vendor} - ${p.name} (${p.type})`;
    if (p.parameters && p.parameters.length > 0) {
      str += ` [Parameters: ${p.parameters.join(', ')}]`;
    }
    return str;
  }).join('\n');
  const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo'));
  const apolloInst = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';
  const hardwareListStr = [...analogInstruments, ...analogHardware].map(h => {
    const pedalsStr = h.connectedPedals && h.connectedPedals.length > 0 
      ? ` (Connected Pedals: ${h.connectedPedals.map(p => `${p.vendor} ${p.name}`).join(', ')})` 
      : '';
    const ampsStr = h.connectedAmps && h.connectedAmps.length > 0
      ? ` (Connected Amps: ${h.connectedAmps.map(a => `${a.vendor} ${a.name}`).join(', ')})`
      : '';
    return `${h.vendor} - ${h.name}${pedalsStr}${ampsStr}`;
  }).join('\n');

  let lunaIntegrationStr = "";
  if (dawType && dawType.toUpperCase() === 'LUNA') {
    lunaIntegrationStr += `nn==================================================n🚨🚨 CRITICAL LUNA ARCHITECTURE DIRECTIVE 🚨🚨nThe user is mixing in Universal Audio LUNA. `;
    if (lunaSumming && lunaSumming !== 'off') {
       lunaIntegrationStr += `LUNA has built-in analog summing (${lunaSumming.toUpperCase()}) natively integrated into its busses and master channel. You MUST suggest "Headroom" (HR) and "Trim" values for the ${lunaSumming.toUpperCase()} summing on any bus or master channels in your steps. `;
    }
    if (lunaTape && lunaTape !== 'off') {
       lunaIntegrationStr += `LUNA has a dedicated Tape Extension slot (${lunaTape.toUpperCase()}) natively integrated into EVERY audio track and bus. This is NOT a standard insert plugin. When 'lunaTape' is toggled ON to ${lunaTape.toUpperCase()}, EVERY SINGLE track or stem you critique MUST explicitly include the ${lunaTape.toUpperCase()} Tape Extension settings (specifically the "Saturation" parameter, often in dB or o'clock values) as the VERY FIRST item in the 'recommendedChain'. Do not ignore this tape machine setting. Name it "${lunaTape.toUpperCase()} Tape Extension" and provide its specific Saturation parameter. `;
    }
    lunaIntegrationStr += `n==================================================n`;
  }

  let focusInstruction = "";
  if (isMasterMode) {
    if (hasStems && uploadedStems && uploadedStems.length > 0) {
      focusInstruction = `Focus specifically on STEM MASTERING / MASTER BUS options to achieve a highly polished, cohesive final master. The user HAS UPLOADED STEMS. Provide suggestions on how to pre-process these stems (such as EQ carving, group compression, and gentle transient balancing) AND how to configure the final central MASTER BUS chain (Master EQ, glue compression, tape saturation, limiting, and stereo width) to achieve a supreme master with maximum weight, punch, and clarity, while avoiding muddy overlaps. Listen to the ENTIRE duration of the files to understand the dynamic peaks and make the overall mix cohesive.`;
    } else {
      focusInstruction = `Focus specifically on MASTERING the single stereo mixdown on the MASTER BUS. Provide advice and explicit technical setups for the final MASTER BUS chain (including linear phase EQ, master bus compression, tape saturation, dynamic EQ, stereo imaging, and final limiting) to achieve maximum punch, loudness, warmth, and depth, while preserving transient response. Listen to the ENTIRE duration of the track.`;
    }
  } else if (isGangstaVox) {
    if (hasStems && uploadedStems && uploadedStems.length > 0) {
      focusInstruction = `Focus specifically on the VOCALS in this mix. DO NOT focus on the beat or instruments. The user HAS UPLOADED STEMS. You MUST analyze how these stems sound mixed together, rather than just in isolation. Your primary goal is to ensure all the vocals sound completely cohesive, beautifully crispy, upfront, and loud. Suggest plugins that not only improve tone, but strictly level the vocals correctly so they sit proudly on top of the beat. CRITICAL: NEVER recommend compressor/limiter settings that squash or bury the vocals. ALWAYS recommend corresponding makeup gain or output gain (level-matched to exactly compensate for threshold gain reduction, e.g. +1.5dB to +3dB, never making arbitrary massive volume boosts) so they are perfectly audibly clear without causing clipping or gain creep. ${isBusMode ? "BUS MODE IS ON: Provide advice on how to group these stems into logical busses (e.g., Lead Bus, Backing Bus, Ad-lib Bus) and how to process those busses collectively, in addition to individual track processing." : "Make sure to listen to the ENTIRE length of the audio files, including any intros, bridges, and outros. Provide advice on how to process each individual stem and how they fit together to improve the overall vocal mix."}`;
    } else {
      focusInstruction = "Focus specifically on the VOCALS in this mix. DO NOT focus on the beat or instruments. Make sure to listen to the ENTIRE length of the song, including any intros, bridges, and outros. Analyze vocal consistency, presence, and processing across the entire song. Ensure the vocal is loud, crispy, and beautifully upfront in the soundstage.";
    }
  } else {
    if (hasStems && uploadedStems && uploadedStems.length > 0) {
      focusInstruction = `Focus specifically on the BEAT/INSTRUMENTAL in this mix. DO NOT focus on the vocals. The user HAS UPLOADED STEMS. ${isBusMode ? "BUS MODE IS ON: Provide advice on how to group these stems into logical busses (e.g., Drum Bus, Bass Bus, Synth Bus, FX Bus) and how to process those busses collectively (e.g., bus compression, glue EQ, saturation) to improve the overall cohesion, in addition to individual track processing." : "Make sure to listen to the ENTIRE length of the audio files, including any intros, bridges, and outros. Provide advice on how to process each individual stem (e.g., EQing the kick, compressing the snare, panning hi-hats, sidechaining) and how they fit together to improve the overall mix."}`;
    } else if (hasStems) {
      focusInstruction = `Focus specifically on the BEAT/INSTRUMENTAL in this mix. DO NOT focus on the vocals. The user HAS STEMS (individual instrument tracks). ${isBusMode ? "BUS MODE IS ON: Suggest a bus-based workflow where elements are grouped into busses (Drums, Music, Bass) for collective processing to improve the mix's glue and impact." : "Make sure to listen to the ENTIRE length of the song, including any intros, bridges, and outros. Provide advice on how to process individual elements (e.g., EQing the kick, compressing the snare, panning hi-hats, sidechaining) to improve the overall mix."}`;
    } else {
      focusInstruction = "Focus specifically on the BEAT/INSTRUMENTAL in this mix. DO NOT focus on the vocals. The user ONLY HAS THIS MP3 (a single stereo file). Make sure to listen to the ENTIRE length of the song, including any intros, bridges, and outros. Provide advice on mastering and stereo bus processing (e.g., dynamic EQ, mid-side processing, stem separation tools, overall EQ balance, limiting) to improve the sound without access to individual tracks.";
    }
  }
  const contextStr = userContext ? `\nCRITICAL USER CONTEXT: The user has provided the following information about their track and goals. You MUST incorporate this into your analysis and advice ALWAYS, IT IS THE MOST IMPORTANT INSTRUCTION. Your suggestions MUST explicitly align with and aim to achieve these exact goals, and NOT ruin the mix/volume:n"${userContext}"n` : "";
  const previousCritiqueStr = previousCritique ? `nPREVIOUS CRITIQUE CONTEXT: The user is uploading a new version of the track based on a previous critique. Here are the details of the previous critique:nTitle: ${previousCritique.title}nFeedback: ${previousCritique.overallFeedback}nStrengths: ${JSON.stringify(previousCritique.strengths)}nWeaknesses: ${JSON.stringify(previousCritique.weaknesses)}nAction Plan: ${JSON.stringify(previousCritique.actionPlan)}nnPlease analyze the new audio, compare it with the previous critique, and provide further guidance to help the user achieve their desired sound. Focus on what has improved, what still needs work, and suggest further parameter adjustments or new plugins if necessary.n` : "";
  const referenceTrackStr = referenceTrack ? `nREFERENCE TRACK: The user wants their mix to sound like this reference track: "${referenceTrack}". Please provide a guide for the critiqued MP3 to sound as accurately as possible like this reference track. If the reference track is a known song, use your knowledge to compare the sonic characteristics. If it's a URL, try to understand the context.n` : "";
  const languageInstruction = getLanguageInstruction(language);

  let physicalAnalysisDiktat = "";
  if (physicalMetrics) {
    physicalAnalysisDiktat += `
      ==================================================
      📊 PHYSICAL PRE-ANALYSIS METRICS (${hasStems ? "COMBINED MIX SUM" : "MAIN AUDIO"}):
      - Measured Integrated LUFS (Loudness): ${physicalMetrics.integratedLufs} LUFS
      - Measured True Peak (dBTP): ${physicalMetrics.truePeak} dBTP
      - Measured Crest Factor (Dynamics): ${physicalMetrics.crestFactor} dB
      ${physicalMetrics.duration ? `- Track Duration: ${physicalMetrics.duration} seconds` : ''}
      ==================================================
    `;
  }
  if (referencePhysicalMetrics) {
    physicalAnalysisDiktat += `
      ==================================================
      📊 PHYSICAL PRE-ANALYSIS METRICS (REFERENCE TRACK):
      - Measured Integrated LUFS (Loudness): ${referencePhysicalMetrics.integratedLufs} LUFS
      - Measured True Peak (dBTP): ${referencePhysicalMetrics.truePeak} dBTP
      - Measured Crest Factor (Dynamics): ${referencePhysicalMetrics.crestFactor} dB
      ${referencePhysicalMetrics.duration ? `- Track Duration: ${referencePhysicalMetrics.duration} seconds` : ''}
      ==================================================
    `;
  }
  if (stemsPhysicalMetrics && Object.keys(stemsPhysicalMetrics).length > 0) {
    physicalAnalysisDiktat += `
      ==================================================
      📊 STEMS PHYSICAL PRE-ANALYSIS METRICS:
    `;
    for (const [stemName, metrics] of Object.entries(stemsPhysicalMetrics)) {
      physicalAnalysisDiktat += `
      Stem Name: "${stemName}"
      - Measured Integrated LUFS: ${metrics.integratedLufs} LUFS
      - Measured True Peak: ${metrics.truePeak} dBTP
      - Measured Crest Factor: ${metrics.crestFactor} dB
      `;
    }
    physicalAnalysisDiktat += `
      ==================================================
    `;
  }

  if (physicalAnalysisDiktat) {
    physicalAnalysisDiktat += `
      🚨🚨 CREST FACTOR SIZING & DYNAMICS ENGINEERING DIRECTIVES 🚨🚨
      You MUST formulate your mix action plan and recommended parameter settings utilizing the physical metrics above. Apply the following strict professional audio principles:
      
      1. CREST FACTOR & COMPRESSION STRATEGY:
         - If Crest Factor is HIGH (greater than 9.0 dB), this indicates a highly dynamic, spikey track (e.g., dynamic instrumental, punchy live drums). You MUST recommend a gentle MULTI-STAGE compression flow to level the signal smoothly without destroying transients or causing severe distortion. For example, specify:
           * Slow-leveling "glue" compression first (e.g. 2-4dB gain reduction with slow attack ~30ms and automatic release)
           * Followed by fast transient clamping (e.g. limiting or clipper with fast release to catch rogue peak transients).
           * Do NOT force a highly dynamic track directly into a heavy limiter as it would smash the transients and cause heavy harmonic distortion.
         - If Crest Factor is LOW (less than 6.0 dB), this indicates a highly compressed or dense signal. Recommend surgical subtractive EQ to carve muddy areas first and very light, musical parallel compression to bring out micro-details rather than heavy serial compression.
         
      2. INTEGRATED LUFS & GAIN STAGING:
         - Compare the Integrated LUFS of the main track to the reference track (if provided). Calculate the exact target headroom delta.
         - If the main track is quiet (e.g. under -16 LUFS), specify precise output/makeup gain settings (+2dB to +8dB) on your compression/limiting steps to raise the level professionally to competitive industry standards (-14 to -9 LUFS depending on genre) while maintaining absolute headroom.
         
      3. TRUE PEAK (dBTP) SAFE HEADROOM:
         - Ensure the final step (the brickwall limiter/clipper) has its output ceiling (Margin / Out) strictly set to prevent digital clipping:
           * Recommend -1.0 dBTP ceiling for streaming services to prevent inter-sample distortion when converted to MP3/AAC.
           * Recommend -0.1 dBTP or -0.5 dBTP for maximum volume only if crest factor is low and transient control is perfect.
    `;
  }

  let jsfxDiktat = "";
  if (isJsfxMode) {
    const simplifiedDB = getSimplifiedJSFXDatabase(installedJsfxPacks, starredPlugins);
    
    // Convert to JSON and take measures not to blow up the prompt size
    const dbContextString = JSON.stringify(simplifiedDB);

    jsfxDiktat = `
      ==================================================
      🚨🚨 ULTRA-CRITICAL JSFX-ONLY OVERRIDE DIRECTIVE 🚨🚨
      JSFX MODE IS ACTIVATED ON THE USER'S DEVICE.
      YOU ARE ABSOLUTELY, STRICTLY, UNDER NO CIRCUMSTANCES ALLOWED TO SUGGEST ANY VST, VST3, AU, CLAP, AAX OR OTHER FORMAT PLUGINS. 
      ALL recommended plugins in the entire 'actionPlan' and all steps MUST EXCLUSIVELY be from the provided JSFX database below.
      Every recommended plugin name in your action plan json MUST exactly match a 'name' from the database.
      DO NOT suggest any third-party plugins like FabFilter, Waves, Soundtoys, iZotope, Universal Audio, RC-20, Sonible, Gullfoss, etc.
      
      Furthermore, YOU MUST ONLY use the sliders and parameters defined in the database for each plugin. Do not invent parameter names. Refer to parameter indices or exact names from this database:
      ${getEliteProducerSecretsPrompt(installedJsfxPacks)}

      JSFX DATABASE:
      ${dbContextString}
      ==================================================
    `;
  } else {
    jsfxDiktat = `
      ==================================================
      🚨🚨 CRITICAL NON-JSFX DIRECTIVE 🚨🚨
      THE USER IS NOT USING REAPER OR NOT IN JSFX MODE.
      YOU ARE ABSOLUTELY, STRICTLY, UNDER NO CIRCUMSTANCES ALLOWED TO SUGGEST OR RECOMMEND REAPER NATIVE PLUGINS OR COCKOS JSFX (e.g. plugins starting with "JS:" or "Rea" like ReaComp, ReaEQ).
      DO NOT USE OR BEAT RECIPE ANY JSFX. Focus ONLY on standard 3rd-party industry VST/AU plugins and explicitly avoid JSFX logic.
      ==================================================
    `;
  }


    
  const dawStr = dawType ? `\nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL MANDATORY INSTRUCTION: The user has STARRED (favorited) the following plugins:\n${starredPlugins.join(', ')}\nYou ABSOLUTELY MUST include these starred plugins in EVERY SINGLE track's recommended chain. This is a non-negotiable hard requirement.` : '';

  let prompt = `
    You are an expert audio engineer and producer.
    CRITICAL RULE FOR IMPROVEMENT: The end result MUST ALWAYS be a concrete improvement to the audio. You must apply proper gain staging and makeup gain on every step that involves compression, saturation, or equalization that reduces peak levels. NEVER reduce the overall volume unintentionally.
    ${getLanguageInstruction(language)}
    

    ${PRO_Q_3_LAYOUT_PROMPT}
    ${JSFX_PRIORITY_SPEC_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}

    Analyze the attached audio file(s) and provide a detailed mix critique and action plan.
    ${focusInstruction}

    Only use mixing plugins from this list (for DAW processing):
    ${pluginListStr}
    ${hardwareListStr ? 'Analog Hardware available:n' + hardwareListStr : ''}
    ${dawStr}
    ${starredStr}
    ${lunaIntegrationStr}
    ${contextStr}
    ${previousCritiqueStr}
    ${referenceTrackStr}
    ${physicalAnalysisDiktat}
    ${jsfxDiktat}
  `;
  const schemaObject = {
    type: "OBJECT",
    properties: {
      title: { type: "STRING" },
      overallFeedback: { type: "STRING" },
      strengths: { type: "ARRAY", items: { type: "STRING" }, minItems: 1 },
      weaknesses: { type: "ARRAY", items: { type: "STRING" }, minItems: 1 },
      deviationMetrics: {
        type: "ARRAY",
        description: "ONLY INCLUDE THIS IF A REFERENCE TRACK WAS PROVIDED. Generate 2-4 analytical deviation metrics comparing the user's mix to the reference track. Be highly technical.",
        items: {
          type: "OBJECT",
          properties: {
            metric: { type: "STRING", description: "e.g., Dynamic Range, High-end Air, Sub-bass Energy" },
            deviation: { type: "STRING", description: "e.g., '2dB narrower than reference', '15% darker'" },
            description: { type: "STRING", description: "Analytical description of the deviation." }
          },
          required: ["metric", "deviation", "description"]
        }
      },
      actionPlan: {
        type: "ARRAY",
        description: "Array of actionable steps.",
        minItems: 1,
        items: {
          type: "OBJECT",
          properties: {
            targetStem: { type: "STRING", description: "The exact name of the stem this step applies to (if stems were uploaded)." },
            issue: { type: "STRING" },
            solution: { type: "STRING" },
            lyricAutomation: {
              type: "OBJECT",
              description: "ONLY INCLUDE THIS IF ANALYZING VOCALS. Intelligently identify the lyrics, and identify the best parts of lyrics/words to throw delays and tail effects on. Calculate based on BPM and bar measurements.",
              properties: {
                lyricPhrases: { type: "ARRAY", items: { type: "STRING" }, description: "Specific words or phrases from the lyrics (e.g. the last two words or one big word)." },
                bpmCalculation: { type: "STRING", description: "BPM and bar measurement calculations explaining the timing." },
                automationAdvice: { type: "STRING", description: "Detailed advice on how to use automation in Reaper for these words (e.g., delay throws, reverb tails)." },
                reaperAutomationPoints: {
                  type: "ARRAY",
                  description: "Machine-readable automation points to send to BeatGangsta Connect (REAPER). Use this to automate 'Wet', 'Amount' or 'Send' parameters of the delay/reverb plugins to spike up during the specific words and drop back down immediately after.",
                  items: {
                    type: "OBJECT",
                    properties: {
                      pluginName: { type: "STRING", description: "The exact plugin name from the recommended chain (e.g. 'JS: Delay (Tempo Ping-Pong)')" },
                      parameterName: { type: "STRING", description: "The parameter to automate (e.g. 'Wet', 'Amount')" },
                      points: {
                        type: "ARRAY",
                        items: {
                          type: "OBJECT",
                          properties: {
                            beat: { type: "NUMBER", description: "The exact beat in the project timeline where the point occurs" },
                            value: { type: "NUMBER", description: "The parameter value at this beat" }
                          },
                          required: ["beat", "value"]
                        }
                      }
                    },
                    required: ["pluginName", "parameterName", "points"]
                  }
                }
              },
              required: ["lyricPhrases", "bpmCalculation", "automationAdvice"]
            },
            breathAndNoiseMuting: {
              type: "OBJECT",
              description: "ONLY INCLUDE THIS IF ANALYZING VOCALS. Intelligently find annoying noise in between words and breaths, very carefully to not take out actual parts of the words like s's or printed fx, and automate muting them using BeatGangsta Connect.",
              properties: {
                identifiedNoises: { type: "ARRAY", items: { type: "STRING" }, description: "Specific breaths or noises identified and their timestamps/locations." },
                mutingAdvice: { type: "STRING", description: "Detailed advice on safely muting these breaths without cutting off transients, sibilance, or fx tails." },
                reaperAutomationPoints: {
                  type: "ARRAY",
                  description: "Machine-readable automation points to send to BeatGangsta Connect (REAPER). Use this to automate the 'Volume' parameter of a gain plugin (like 'JS: Volume/Pan Smoother') down to -inf (or -144) during breaths/noise and back to 0dB for vocals.",
                  items: {
                    type: "OBJECT",
                    properties: {
                      pluginName: { type: "STRING", description: "The exact plugin name from the recommended chain (e.g. 'JS: Volume/Pan Smoother')" },
                      parameterName: { type: "STRING", description: "The parameter to automate (e.g. 'Volume')" },
                      points: {
                        type: "ARRAY",
                        items: {
                          type: "OBJECT",
                          properties: {
                            beat: { type: "NUMBER", description: "The exact beat in the project timeline where the point occurs" },
                            value: { type: "NUMBER", description: "The parameter value at this beat (e.g. 0 for normal, -144 for muted)" }
                          },
                          required: ["beat", "value"]
                        }
                      }
                    },
                    required: ["pluginName", "parameterName", "points"]
                  }
                }
              },
              required: ["identifiedNoises", "mutingAdvice"]
            },
            recommendedChain: {
              type: "ARRAY",
              description: hasStems && uploadedStems && uploadedStems.length > 0 ? (isMultiBandMode ? "CRITICAL: You MUST provide an adequate number of plugins to handle the multi-band split across all bands. Do NOT limit to 6 plugins." : "CRITICAL: You MUST provide EXACTLY 6 plugins for this stem to provide detailed JSFX guidance, with the 6th dedicated to level normalization and output gain matching.") : "Chain of plugins (at least 6 plugins).",
              minItems: 1,
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  purpose: { type: "STRING" },
                  deepDive: {
                    type: "ARRAY",
                    description: "List EVERY EXHAUSTIVE parameter that exists on the actual plugin interface. Take your time to be complete and thorough. DO NOT HALLUCINATE PARAMETERS. Only include the real parameters this plugin actually has. You MUST compensate for gain reduction and guarantee a concrete improvement.",
                    minItems: 1,
                    items: {
                      type: "OBJECT",
                      properties: {
                        parameter: { type: "STRING" }, value: { type: "STRING" }, explanation: { type: "STRING" } },
                      required: ["parameter", "value", "explanation"]
                    }
                  },
                  band: { type: "STRING", description: "CRITICAL IF MULTI-BAND/GAFFEL MODE IS ON: Specify the frequency band this plugin belongs to AND its specific frequency range, e.g. 'Lows/Sub (20Hz - 150Hz)', 'Mids (150Hz - 2.5kHz)'. If mode is off, omit." },
                  routing: { type: "STRING" }
                },
                required: ["name", "purpose", "deepDive"]
              }
            },
            multiBandDetails: {
              type: "OBJECT",
              properties: {
                isEnabled: { type: "BOOLEAN" },
                bandCount: { type: "NUMBER", description: "Number of bands/track duplications needed" },
                splitFrequencies: { type: "ARRAY", items: { type: "STRING" }, description: "e.g., ['150Hz', '2.5kHz']" },
                reasoning: { type: "STRING" }
              }
            }
          },
          required: hasStems && uploadedStems && uploadedStems.length > 0 ? ["targetStem", "issue", "solution", "recommendedChain"] : ["issue", "solution", "recommendedChain"]
        }
      }
    },
    required: ["title", "overallFeedback", "strengths", "weaknesses", "actionPlan"]
  };
  // Do NOT append the schema immediately, we'll append it later per branch to respect chunking stem counts.
  
  const parts: any[] = [];
  
  if (geminiFileUri && geminiFileUri.trim() !== '') {
    let uri = geminiFileUri;
    if (uri.includes('/files/')) {
       const uriParts = uri.split('/files/');
       uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
    } else if (!uri.startsWith('https://')) {
       uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
    }
    parts.push({ text: "This is the FULL MIX/MASTER stereo audio for global context:" });
    parts.push({ fileData: { fileUri: uri, mimeType: mimeType } });
  } else if (audioBase64 && audioBase64.trim() !== '') {
    parts.push({ text: "This is the FULL MIX/MASTER stereo audio for global context:" });
    parts.push({ inlineData: { data: audioBase64, mimeType: mimeType } });
  } else if (!uploadedStems || uploadedStems.length === 0) {
    throw new Error("No audio file provided for analysis (Critique).");
  }

  if (uploadedStems && uploadedStems.length > 0) {
    parts.push({ text: "These are the INDIVIDUAL STEMS that make up the mix:" });
    for (const stem of uploadedStems) {
      const stemTypeStr = stem.type === 'Other' && stem.customType ? stem.customType : (stem.type || 'Unknown');
      if (stem.uri && stem.uri.trim() !== '') {
        let uri = stem.uri;
        if (uri.includes('/files/')) {
           const uriParts = uri.split('/files/');
           uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
        } else if (!uri.startsWith('https://')) {
           uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
        }
        let stemMimeType = stem.mimeType || 'audio/mpeg';
        parts.push({ text: `Stem Name: ${stem.name || stem.file?.name || 'Unknown Stem'} (User-Selected Type/Role: ${stemTypeStr})` });
        parts.push({ fileData: { fileUri: uri, mimeType: stemMimeType } });
      } else if (stem.base64 && stem.base64.trim() !== '') {
        let stemMimeType = stem.mimeType || 'audio/mpeg';
        parts.push({ text: `Stem Name: ${stem.name || stem.file?.name || 'Unknown Stem'} (User-Selected Type/Role: ${stemTypeStr})` });
        parts.push({ inlineData: { data: stem.base64, mimeType: stemMimeType } });
      }
    }
  }
  if (referenceGeminiFileUri && referenceGeminiFileUri.trim() !== '') {
    let uri = referenceGeminiFileUri;
    if (uri.includes('/files/')) {
       const uriParts = uri.split('/files/');
       uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
    } else if (!uri.startsWith('https://')) {
       uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
    }
    parts.push({ fileData: { fileUri: uri, mimeType: mimeType } });
  } else if (referenceAudioBase64 && referenceAudioBase64.trim() !== '') {
    parts.push({ inlineData: { data: referenceAudioBase64, mimeType: mimeType } });
  }
  const multiBandInstruction = getMultiBandInstruction(isMultiBandMode);
  parts.push({ text: prompt + multiBandInstruction + FUNCTION_AUTOMATION_PROMPT });
  const tools: any[] = [];
  if (referenceTrack && !referenceAudioBase64) {
    tools.push({ googleSearch: {} });
  }
  
  let result: any = null;
  const chunkingEnabled = hasStems && uploadedStems && uploadedStems.length > 5;
  const chunkSize = 5;

  if (chunkingEnabled) {
     const chunks: any[][] = [];
     for(let i=0; i<uploadedStems!.length; i+=chunkSize) {
        chunks.push(uploadedStems!.slice(i, i+chunkSize));
     }

     for(let i=0; i<chunks.length; i++) {
        const currentStems = chunks[i];
        const stemNames = currentStems.map((s:any) => s.name || s.file?.name || 'Unknown Stem').join(', ');
        
        let chunkSchema = JSON.parse(JSON.stringify(schemaObject));
        chunkSchema.properties.actionPlan.description = `CRITICAL: You MUST generate EXACTLY ${currentStems.length} items in this array, one for each specific stem assigned to this phase.`;
        
        let chunkPrompt = prompt + multiBandInstruction + FUNCTION_AUTOMATION_PROMPT;
        
        if (i > 0) {
           chunkPrompt += `n\nCRITICAL MULTI-PART REQUEST: You are analyzing part ${i+1} out of ${chunks.length}. For this phase, ONLY provide action plan steps for the following stems: ${stemNames}. Do NOT provide overall feedback or strengths/weaknesses again (just return simple dummy strings for those fields), but you MUST provide the exhaustive actionPlan array for these specific stems.`;
        } else {
           chunkPrompt += `n\nCRITICAL MULTI-PART REQUEST: You are analyzing part ${i+1} out of ${chunks.length}. For this phase, provide the comprehensive overall feedback, strengths, weaknesses, AND the exhaustive action plan steps ONLY for the following stems: ${stemNames}.`;
        }
        
        chunkPrompt += `n\nCRITICAL: You MUST return a valid JSON object EXCLUSIVELY formatted with this exact JSON Schema:n${JSON.stringify(chunkSchema, null, 2)}`;
        
        const chunkParts = [...parts.slice(0, parts.length - 1), { text: chunkPrompt }];
        
        let response;
        try {
          response = await ai.models.generateContent({
             model: "gemini-3-flash-preview",
             contents: chunkParts,
             config: {
               customAction: 'stems_critique',
               tools: tools.length > 0 ? tools : undefined,
               responseMimeType: "application/json", responseSchema: chunkSchema, safetySettings: [
                 { category: "HARM_CATEGORY_HARASSMENT" as any, threshold: "BLOCK_NONE" as any },
                 { category: "HARM_CATEGORY_HATE_SPEECH" as any, threshold: "BLOCK_NONE" as any },
                 { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT" as any, threshold: "BLOCK_NONE" as any },
                 { category: "HARM_CATEGORY_DANGEROUS_CONTENT" as any, threshold: "BLOCK_NONE" as any }
               ]
             }
          });
        } catch (error) {
          console.error(`Gemini API Error (Critique Chunk ${i+1}):`, error);
          throw new Error(`Gemini API Error (Critique Chunk ${i+1}): ${error instanceof Error ? error.message : String(error)}`);
        }
        
        const jsonStr = response.text?.trim() || '{}';
        if (jsonStr === '{}' || jsonStr === '') {
           console.error(`Gemini returned empty response for critique chunk ${i+1}.`);
           throw new Error(`Gemini returned an empty response for chunk ${i+1}. The model may have failed to generate the critique.`);
        }
        try {
           const parsed = postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
           if (i === 0) {
              result = parsed;
           } else {
              result.actionPlan = [...(result.actionPlan || []), ...(parsed.actionPlan || [])];
           }
        } catch (e: any) {
           console.error(`Detailed Error in getMixCritique chunk ${i+1}:`, e);
           throw new Error(`Format error in getMixCritique chunk ${i+1}. Details: ${e.message || e}`);
        }
     }
  } else {
    let schema = JSON.parse(JSON.stringify(schemaObject));
    if (hasStems && uploadedStems && uploadedStems.length > 0) {
      schema.properties.actionPlan.description = `CRITICAL: You MUST generate EXACTLY ${uploadedStems.length} items in this array, one for each uploaded stem.`;
    }
    const finalPrompt = prompt + multiBandInstruction + `n\nCRITICAL: You MUST return a valid JSON object EXCLUSIVELY formatted with this exact JSON Schema:n${JSON.stringify(schema, null, 2)}`;
    const finalParts = [...parts.slice(0, parts.length - 1), { text: finalPrompt }];
    
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: finalParts,
        config: {
          customAction: hasStems ? 'stems_critique' : 'critique',
          tools: tools.length > 0 ? tools : undefined,
          responseMimeType: "application/json",
          responseSchema: schema,
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT" as any, threshold: "BLOCK_NONE" as any },
            { category: "HARM_CATEGORY_HATE_SPEECH" as any, threshold: "BLOCK_NONE" as any },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT" as any, threshold: "BLOCK_NONE" as any },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT" as any, threshold: "BLOCK_NONE" as any }
          ]
        }
      });
    } catch (error) {
      console.error("Gemini API Error (Critique):", error);
      throw new Error(`Gemini API Error (Critique): ${error instanceof Error ? error.message : String(error)}. Debug Info: parts=${JSON.stringify(parts)}`);
    }
    const jsonStr = response.text?.trim() || '{}';
    if (jsonStr === '{}' || jsonStr === '') {
      console.error("Gemini returned empty response for critique.");
      throw new Error("Gemini returned an empty response. This might be due to safety filters blocking the content or the model failing to generate a critique.");
    }
    try {
      result = postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
    } catch (e: any) {
      console.error("Detailed Error in getMixCritique:", e);
      console.error("Safety/Blocked:", JSON.stringify(response?.candidates?.[0] || {}));
      throw new Error(`Format error in getMixCritique. Details: ${e.message || e}nRaw: ${typeof jsonStr !== 'undefined' ? jsonStr.substring(0, 500) : "empty"}nSafety: ${JSON.stringify(response?.candidates?.[0]?.safetyRatings || "none")}`);
    }
  }
  result.id = crypto.randomUUID();
  result.isGangstaVox = isGangstaVox;
  result.audioBase64 = audioBase64;
  result.mimeType = mimeType;
  result.isJsfxMode = isJsfxMode;

  // Apply Auto-Adaptive Headroom Allocation & Safe Parameter Mapping
  try {
    result = applySafeParameterMappingToCritique(result, physicalMetrics, referencePhysicalMetrics, stemsPhysicalMetrics);
  } catch (err) {
    console.warn("[HEADROOM_ALLOCATION] Safe Parameter Mapping post-process failed:", err);
  }

  return result;
};
export const compareMixDelta = async (plugins: VSTPlugin[], originalAudioBase64: string | undefined, originalMimeType: string | undefined, processedAudioBase64: string, processedMimeType: string, recipeContext: string, isJsfxMode: boolean, installedJsfxPacks: string[]): Promise<{analysis: string, correctiveActions: any[]}> => {
  const ai = getAI();
  const { GoogleGenAI } = await import("@google/genai");
  const model = "gemini-3.1-pro-preview";
  const systemInstruction = `You are a world-class mastering engineer performing an A/B Mix Delta Analysis.nnYou will receive TWO audio files (if the platform supports it) or at least the processed audio, along with the recipe context that produced it.nnYour job is to:n1. Listen to the PROCESSED audio and identify any artifacts, distortion, over-compression, pumping, or phase issues.n2. Compare it to the original audio (if provided) to hear the delta.n3. Identify exactly which plugins/parameters in the recipe caused the issue (e.g. "The second compressor on the bass has the threshold too low and ratio too high, causing distortion").n4. Provide a detailed analysis and a corrective action plan.n\nCRITICAL: You MUST return EXACTLY valid JSON matching this schema:n${JSON.stringify({ type: "OBJECT", properties: { analysis: { type: "STRING" }, correctiveActions: { type: "ARRAY", items: { type: "OBJECT", properties: { targetStem: { type: "STRING" }, pluginName: { type: "STRING" }, paramChanges: { type: "ARRAY", items: { type: "OBJECT", properties: { paramName: { type: "STRING" }, newValue: { type: "NUMBER" }, reason: { type: "STRING" } } } } } } } }, required: ["analysis", "correctiveActions"] })}`; 
  const contents = [];
  if (originalAudioBase64 && originalMimeType) {
    contents.push({ role: "user", parts: [{ text: "Here is the ORIGINAL unprocessed audio:" }] });
    contents.push({ role: "user", parts: [{ inlineData: { data: originalAudioBase64, mimeType: originalMimeType } }] });
  }
  contents.push({ role: "user", parts: [{ text: "Here is the PROCESSED audio (rendered from REAPER) that has distortion/issues:" }] });
  contents.push({ role: "user", parts: [{ inlineData: { data: processedAudioBase64, mimeType: processedMimeType } }] });
  contents.push({ role: "user", parts: [{ text: `Here is the RECIPE CONTEXT that produced this processed audio:nn${recipeContext}nnPlease analyze the difference and tell me what went wrong, and give me the corrective JSFX parameter changes.` }] });

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.2
    }
  });
  const text = response.text;
  if (!text) throw new Error("No text returned from Gemini");
  return JSON.parse(text);
};

export const getSpecificMixHelp = async (plugins: VSTPlugin[], audioBase64: string | undefined, mimeType: string | undefined, query: string, isGangstaVox: boolean = false, recipeContext?: string, chatHistory: {role: 'user' | 'model', content: string}[] = [], audioUrl?: string, geminiFileUri?: string, language: string = 'en', analogHardware: Hardware[] = [], isMultiBandMode: boolean = false): Promise<{query: string, advice: string, recommendedChain: any[]}> => {
  const ai = getAI();
  const pluginListStr = plugins.map(p => `- ${p.name} (by ${p.vendor || 'Unknown'}, type ${p.type || 'VST'})`).join('\n');
  const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo'));
  const apolloInst = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';
  const apolloConstraint = hasApollo ? `
    CRITICAL: The user has an ${apolloInst} interface. When suggesting plugins for this mix, you MUST ALWAYS prioritize UAD (Universal Audio) plugins from their library if they are suitable for the task.
  ` : '';
  const systemPrompt = `
    You are an expert audio engineer and producer.
    CRITICAL RULE FOR IMPROVEMENT: The end result MUST ALWAYS be a concrete improvement to the audio. You must apply proper gain staging and makeup gain on every step that involves compression, saturation, or equalization that reduces peak levels. NEVER reduce the overall volume unintentionally.
${getLanguageInstruction(language)}
    ${query.toLowerCase().includes('guitar') ? "CRITICAL: If the user is asking about guitars, acoustic or electric, strongly consider recommending the use of a capo (e.g. on the 2nd to 5th fret) to achieve a brighter, more distinctive, and chiming sound without breaking strings. Reference Johnny Marr, Jingle-Jangle styles, and The Smiths as examples." : ""}

    ${PRO_Q_3_LAYOUT_PROMPT}
    ${JSFX_PRIORITY_SPEC_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    ${apolloConstraint}
    ${audioBase64 || audioUrl ? "I am uploading an MP3 of a project that needs work." : "I am providing a recipe for a track."}
    ${isGangstaVox ? "Focus specifically on the VOCALS." : "Focus specifically on the BEAT/INSTRUMENTAL."}
    ${recipeContext ? `Here is the recipe context:n${recipeContext}n` : ""}
    ${audioBase64 || audioUrl ? "Analyze the audio focusing ONLY on the user's requests, and provide targeted advice." : "Analyze the recipe details focusing ONLY on the user's requests, and provide targeted advice."}

    CRITICAL PLUGIN SELECTION RULE:
    1. You MUST ONLY recommend plugins present in the list below.
    2. When selecting a plugin, you MUST use the EXACT name string as it appears in the list (e.g. if the list says "Pro-Q 3", do NOT write "FabFilter - Pro-Q 3").
    3. Do not invent plugin names or assume the user owns other models from the same brand.
    4. You are STRICTLY FORBIDDEN from recommending generic placeholders (e.g. do not write "Compressor" if there is an actual compressor in the list).
    
    USER OWNED PLUGIN LIST:
    ${pluginListStr}
    
    ${audioUrl ? `The audio file is available at this URL: ${audioUrl}. Please fetch and analyze it.` : ""}
    Respond to the user's latest message. Return the result as a JSON object with 'query', 'advice', 'multiBandDetails' (optional object with 'isEnabled', 'bandCount', 'splitFrequencies', 'reasoning' if Gaffel/Multi-band mode is on), and 'recommendedChain' (an array of plugin objects with 'name', 'purpose', 'band', 'routing', and 'deepDive' parameters).
  `;
  const firstUserParts: any[] = [];
  if (geminiFileUri && mimeType) {
    let uri = geminiFileUri;
    if (uri.includes('/files/')) {
       const uriParts = uri.split('/files/');
       uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
    }
    firstUserParts.push({ fileData: { fileUri: uri, mimeType: mimeType } });
  } else if (audioBase64 && mimeType) {
    firstUserParts.push({ inlineData: { data: audioBase64, mimeType: mimeType } });
  }
  firstUserParts.push({ text: systemPrompt });
  const contents: any[] = [
    { role: 'user', parts: firstUserParts },
    { role: 'model', parts: [{ text: "Understood. How can I help you with this mix?" }] }
  ];
  for (const msg of chatHistory) {
    contents.push({
      role: msg.role,
      parts: [{ text: msg.content }]
    });
  }
  const multiBandInstruction = getMultiBandInstruction(isMultiBandMode);
  contents.push({
    role: 'user',
    parts: [{ text: query + multiBandInstruction }]
  });
  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        customAction: 'critique',
        responseMimeType: "application/json", responseSchema: undefined, safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
        ]
      }
    });
  } catch (error) {
    console.error("Gemini API Error (Specific Mix Help):", error);
    throw new Error(`Gemini API Error (Specific Mix Help): ${error instanceof Error ? error.message : String(error)}. Debug Info: contents=${JSON.stringify(contents)}`);
  }
  try {
    const parsed = JSON.parse(sanitizeJSON(response.text || '{"query": "", "advice": "I\'m sorry, I couldn\'t generate a response.", "recommendedChain": []}'));
    if (parsed.recommendedChain && Array.isArray(parsed.recommendedChain)) {
       try {
           parsed.recommendedChain = applySafeParameterMappingToChain(parsed.recommendedChain, undefined, false);
       } catch (err) {
           console.warn("[HEADROOM_ALLOCATION] Safe Parameter Mapping post-process failed for specific help:", err);
       }
    }
    return parsed;
  } catch (e: any) {
    console.error("Detailed Error in getSpecificMixHelp:", e);
    console.error("Safety/Blocked:", JSON.stringify(response?.candidates?.[0] || {}));
    return { query, advice: `I'm sorry, I couldn't generate a response. Details: ${e.message || e}`, recommendedChain: [] };
  }
};

export const getLyricAnalysis = async (
  plugins: VSTPlugin[],
  audioBase64: string | undefined,
  mimeType: string | undefined,
  lyrics: string,
  context: string,
  audioUrl?: string,
  geminiFileUri?: string,
  language: string = 'en',
  analogHardware: Hardware[] = [],
  uploadedStems?: any[]
): Promise<{
  dubWords: string;
  cadenceAndDelivery: string;
  vocalChain: any[];
  additionalAdvice: string;
  timeline?: any[];
  formattedLyrics?: string;
  syncedLyrics?: { time: string; lyric: string }[];
}> => {
  const ai = getAI();
  const pluginListStr = plugins.map(p => `- ${p.name} (by ${p.vendor || 'Unknown'}, type ${p.type || 'VST'})`).join('\n');
  const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo'));
  const apolloInst = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';
  const apolloConstraint = hasApollo ? `
    CRITICAL: The user has an ${apolloInst} interface. When suggesting plugins for this mix, you MUST ALWAYS prioritize UAD (Universal Audio) plugins from their library if they are suitable for the task.
  ` : '';

  const systemInstructions = `
    You are an expert audio engineer, vocal producer, and rap/melodic vocal coach.
    You are analyzing lyrics and custom context/user guidance for an audio project.
    
    CRITICAL RULES:
    1. ZERO HALLUCINATION (FIREABLE OFFENSE): You MUST ONLY suggest parameters that actually exist on the real-world interface of the specified plugin as documented in its official manual. NEVER invent, guess, hallucinate, or inject parameters that do not exist on that plugin. If you do not know the exact name of a parameter on the UI, DO NOT list it at all.
    2. STRICT UNIT ACCURACY: You MUST use the exact, correct unit of measurement for every parameter (frequencies in Hz/kHz, gain/threshold in dB, time in ms/s).
    3. Proper gain staging must be applied on compressing or EQ actions.
    
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${JSFX_PRIORITY_SPEC_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    ${apolloConstraint}

    Based on the provided full mix, stems (if available), current lyrics, and user context, you must output a valid JSON response containing advice on vocal dubbing, performance delivery, processing, formatted lyrics, and synchronization.
    
    The JSON structure MUST have these EXACT keys:
    - 'formattedLyrics': A meticulously formatted string of the entered lyrics. You MUST fix any words that are misspelled or grammatically incorrect. Organize the lyrics into clear, logical sections separated by headers like [Verse 1], [Hook], [Verse 2], etc. (matching Genius website's structure). If the lyrics are continuous verses without a hook/chorus, you MUST label them all as sequential verses (e.g. [Verse 1], [Verse 2], [Verse 3]). Space blocks cleanly with blank lines.
    - 'syncedLyrics': An array of objects matching the audio file's exact timing down to the millisecond. Synchronize each lyric line so it is perfectly aligned with the audio file. If no audio file is provided/accessible, estimate standard rhythmic timestamps (e.g., 2-3 seconds per line). Each item in the array MUST be an object with:
        - 'time': The timestamp in LRC format, e.g. '[mm:ss.xx]' or '[mm:ss.xxx]' (e.g. '[00:14.25]' or '[01:03.045]'). Ensure this represents the exact millisecond-accurate start of the lyric line in the audio.
        - 'lyric': The corrected, formatted text of that single line.
    - 'dubWords': A list of specific words from the lyrics that the user should record dubs/overdubs/ad-libs/reinforcements for. Explain why these words or phrases have significant structural, rhythmic, or emotional weight. Highlight which words to emphasize.
    - 'cadenceAndDelivery': A detailed description of the performance delivery. Explain what cadence should be used, when to match the rhythm, and specific vocal delivery styling: e.g. whether it should be a higher pitched dub, screaming dub, lower pitched, whisper dub, or double-tracked, and how it syncs with the backing instrumental or full mix.
    - 'vocalChain': A recommended chain of plugins (at least 3 and max 5) from the user's available plugin list to process these dubbed/vocal elements to give them premium polish, dimension, and fit in the mix. Each plugin MUST have:
        - 'name': The exact name of the plugin from the list.
        - 'purpose': Brief description of its usage.
        - 'deepDive': An array of parameters with 'parameter', 'value', and 'explanation'.
    - 'additionalAdvice': Flexible section answering any other specific request or context the user typed in the custom context input box, mapping out performance strategy, lyrics modifications, or general vibes.
    - 'timeline': An array of exactly 4 track objects representing a multitrack timeline of the entire vocal/FX structure matching the full length of the song (extend it up to 64 or 80+ bars to map the entire track layout in detail, instead of stopping at 16 bars). The tracks MUST be named:
        1. 'Lead Vocal'
        2. 'Overdubs/Dubs'
        3. 'Ad-libs/Accents'
        4. 'FX & Sweeps'
        Each track MUST contain a 'blocks' array of objects mapped sequentially across the timeline. Each block object has:
            - 'id': A unique string id (e.g., 'dub-sec-1')
            - 'text': Short text representing the lyric / vocal technique / delay throw / sweep effect (e.g. 'Yeah!', '[CHORUS]', 'Vocal Sweep', 'Delay Throw'). Max 15 chars.
            - 'startBar': The starting bar of the segment (integer starting from 1 up to the total song length like 32, 64 or more)
            - 'durationBars': Spanned length in bars (integer from 1 to 8)
            - 'color': Aesthetic visual theme color for this segment (one of: 'sky', 'indigo', 'rose', 'emerald', 'violet', 'amber')
            - 'intensity': Numeric visual amplitude level (integer from 15 to 100)
            - 'instructions': Precise, granular coaching and mixing directives for this physical segment, mapping details on automated effects, volume ducking, sidechains, polarity adjustments, or performance execution.
    
    CRITICAL PLUGIN SELECTION RULE:
    1. You MUST ONLY recommend plugins present in the list below.
    2. When selecting a plugin, you MUST use the EXACT name string as it appears in the list (e.g. if the list says "Pro-Q 3", do NOT write "FabFilter - Pro-Q 3").
    3. Do not invent plugin names or assume the user owns other models from the same brand.
    4. You are STRICTLY FORBIDDEN from recommending generic placeholders (e.g. do not write "Compressor" if there is an actual compressor in the list).
    
    USER OWNED PLUGIN LIST:
    ${pluginListStr}
  `;

  const parts: any[] = [];
  
  // 1. Add main mix file metadata/content
  if (geminiFileUri && geminiFileUri.trim() !== '') {
    let uri = geminiFileUri;
    if (uri.includes('/files/')) {
       const uriParts = uri.split('/files/');
       uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
    } else if (!uri.startsWith('https://')) {
       uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
    }
    parts.push({ text: "This is the FULL MIX/MASTER stereo audio for global context:" });
    parts.push({ fileData: { fileUri: uri, mimeType: mimeType || 'audio/mpeg' } });
  } else if (audioBase64 && audioBase64.trim() !== '') {
    parts.push({ text: "This is the FULL MIX/MASTER stereo audio for global context:" });
    parts.push({ inlineData: { data: audioBase64, mimeType: mimeType || 'audio/mpeg' } });
  }

  // 2. Add individual stems if available
  if (uploadedStems && uploadedStems.length > 0) {
    parts.push({ text: "These are the INDIVIDUAL STEMS that make up the mix:" });
    for (const stem of uploadedStems) {
      const stemTypeStr = stem.type === 'Other' && stem.customType ? stem.customType : (stem.type || 'Unknown');
      if (stem.uri && stem.uri.trim() !== '') {
        let uri = stem.uri;
        if (uri.includes('/files/')) {
           const uriParts = uri.split('/files/');
           uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
        } else if (!uri.startsWith('https://')) {
           uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
        }
        let stemMimeType = stem.mimeType || 'audio/mpeg';
        parts.push({ text: `Stem Name: ${stem.name || stem.file?.name || 'Unknown Stem'} (User-Selected Type/Role: ${stemTypeStr})` });
        parts.push({ fileData: { fileUri: uri, mimeType: stemMimeType } });
      } else if (stem.base64 && stem.base64.trim() !== '') {
        let stemMimeType = stem.mimeType || 'audio/mpeg';
        parts.push({ text: `Stem Name: ${stem.name || stem.file?.name || 'Unknown Stem'} (User-Selected Type/Role: ${stemTypeStr})` });
        parts.push({ inlineData: { data: stem.base64, mimeType: stemMimeType } });
      }
    }
  }

  // 3. User request
  const userRequestPrompt = `
    The user is asking for lyric analysis and dubbing advice.
    SONG LYRICS:
    """
    ${lyrics}
    """
    
    USER CUSTOM CONTEXT / REQUEST:
    """
    ${context || 'Analyze these lyrics and recommend dub and processing strategies.'}
    """
    
    SYSTEM INSTRUCTIONS & EXPECTED JSON RESPONSE STRUCTURE:
    ${systemInstructions}
    
    CRITICAL: Respond with a valid JSON object ONLY. DO NOT include extra markdown formatting other than enclosing the JSON block.
  `;

  parts.push({ text: userRequestPrompt });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts }],
      config: {
        customAction: 'critique',
        responseMimeType: "application/json",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
        ]
      }
    });

    const parsed = JSON.parse(sanitizeJSON(response.text || '{}'));
    return {
      dubWords: parsed.dubWords || 'None recommended',
      cadenceAndDelivery: parsed.cadenceAndDelivery || 'No delivery specifications generated',
      vocalChain: parsed.vocalChain ? applySafeParameterMappingToChain(parsed.vocalChain, undefined, false) : [],
      additionalAdvice: parsed.additionalAdvice || 'No additional advice.',
      timeline: parsed.timeline || [],
      formattedLyrics: parsed.formattedLyrics || '',
      syncedLyrics: parsed.syncedLyrics || []
    };
  } catch (error: any) {
    if (error?.status === 503 || error?.message?.includes('high demand') || error?.status === 'INVALID_ARGUMENT' || error?.status === 400 || String(error).includes('503')) {
      console.warn("gemini-3-flash-preview high demand or error, falling back to gemini-3.1-pro-preview...");
      try {
        const responseListFallback = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: [{ role: 'user', parts }],
          config: {
            customAction: 'critique',
            responseMimeType: "application/json",
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
            ]
          }
        });
        const parsed = JSON.parse(sanitizeJSON(responseListFallback.text || '{}'));
        return {
          dubWords: parsed.dubWords || 'None recommended',
          cadenceAndDelivery: parsed.cadenceAndDelivery || 'No delivery specifications generated',
          vocalChain: parsed.vocalChain ? applySafeParameterMappingToChain(parsed.vocalChain, undefined, false) : [],
          additionalAdvice: parsed.additionalAdvice || 'No additional advice.',
          timeline: parsed.timeline || [],
          formattedLyrics: parsed.formattedLyrics || '',
          syncedLyrics: parsed.syncedLyrics || []
        };
      } catch (fallbackError: any) {
        console.warn("Fallback gemini-3.1-pro-preview also failed, trying gemini-3-flash-preview again...");
        try {
          const responseListFallback2 = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: 'user', parts }],
            config: {
              customAction: 'critique',
              responseMimeType: "application/json",
              safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
              ]
            }
          });
          const parsed2 = JSON.parse(sanitizeJSON(responseListFallback2.text || '{}'));
          return {
            dubWords: parsed2.dubWords || 'None recommended',
            cadenceAndDelivery: parsed2.cadenceAndDelivery || 'No delivery specifications generated',
            vocalChain: parsed2.vocalChain || [],
            additionalAdvice: parsed2.additionalAdvice || 'No additional advice.',
            timeline: parsed2.timeline || [],
            formattedLyrics: parsed2.formattedLyrics || '',
            syncedLyrics: parsed2.syncedLyrics || []
          };
        } catch (fbError2: any) {
          console.error("Gemini API Fallback Error (Lyric Tool):", fbError2);
          return {
            dubWords: "Could not perform automated lyric analysis due to a connection error.",
            cadenceAndDelivery: "Unable to synthesize cadence & delivery advice. Please ensure your files are accessible.",
            vocalChain: [],
            additionalAdvice: `Error details: ${fbError2 instanceof Error ? fbError2.message : String(fbError2)}`,
            timeline: []
          };
        }
      }
    }
    
    console.error("Gemini API Error (Lyric Tool):", error);
    return {
      dubWords: "Could not perform automated lyric analysis due to a connection error.",
      cadenceAndDelivery: "Unable to synthesize cadence & delivery advice. Please ensure your files are accessible.",
      vocalChain: [],
      additionalAdvice: `Error details: ${error instanceof Error ? error.message : String(error)}`,
      timeline: []
    };
  }
};

export const getGangstaVoxRecipe = async (recipe: BeatRecipe | SavedRecipe, plugins: VSTPlugin[], analogHardware: Hardware[], language: string = 'en', vocalVibeGoal: string = '') => {
  const ai = getAI();
  const receiverStr = plugins.length > 0 
    ? plugins.map(p => `${p.vendor} - ${p.name}`).join('\n')
    : "No plugins available (default to Waves or FabFilter)";
  const prompt = `
    ${getLanguageInstruction(language)}
    I need an EXTREMELY DETAILED vocal processing chain recipe.
    Style requested: ${recipe.style}
    Reference Track Context: ${vocalVibeGoal || recipe.title}
    My available plugins:
    ${receiverStr}
    If I am missing crucial plugins (like Autotune or Soothe2), recommend the industry standard alternatives.
    Return the result as a detailed JSON structure perfectly matching the schema provided. 
    Ensure every layer and every plugin setting is robust and exhaustive.
  `;
  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        customAction: 'gangsta_vox',
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });
  } catch (error) {
    console.error("Gemini API Error (Gangsta Vox):", error);
    throw new Error(`Gemini API Error (Gangsta Vox): ${error instanceof Error ? error.message : String(error)}`);
  }
  const jsonStr = response.text?.trim() || '{}';
  try {
    return postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
  } catch (e) {
    console.error("Failed to parse AI response as JSON in getGangstaVoxRecipe", e);
    throw new Error("The architect's response was not in the correct format. Please try again!");
  }
};
export const replicateRecipeWithUserGear = async (recipe: SavedRecipe, myPlugins: VSTPlugin[], language: string = 'en'): Promise<SavedRecipe> => {
  const ai = getAI();
  const receiverStr = myPlugins.length > 0 
    ? myPlugins.map(p => `${p.vendor} - ${p.name}`).join('\n')
    : "No plugins available (use generic stock plugins)";
  // Strip out large/unnecessary metadata for the prompt
  const { id, savedAt, bubbleColor, folderId, audioBase64, mimeType, geminiFileUri, ...recipeData } = recipe;
  const prompt = `
    I have a beat recipe shared by a friend, but I might not own all the plugins used in it.
    My available plugins are:
    ${receiverStr}
    Here is the shared recipe data:
    ${JSON.stringify(recipeData, null, 2)}
    Please adapt this recipe so that it ONLY uses plugins from my available plugins list. 
    ${getLanguageInstruction(language)}
    If I don't own a plugin used in the recipe, replace it with the most similar plugin I own, and provide new similar parameters for that beat style.
    If I do own the plugin, keep it and keep its parameters.
    Keep the original BPM, Scale, Chord Progression, and Drum Patterns.
    Return the adapted recipe in the exact same JSON structure as the original recipe.
  `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt + "n\nCRITICAL: You MUST return EXACTLY valid JSON matching this schema:n" + JSON.stringify(getUnifiedRecipeSchema(recipe.isGangstaVox), null, 2) }] },
      config: {
        customAction: 'analog_save',
        responseMimeType: "application/json"
      }
    });
    let jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("The AI returned an empty response. This usually happens if the recipe is too complex or the API key has limits.");
    }
    // Clean up potential markdown formatting
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```jsonn?/, '').replace(/n?```$/, '');
    }
    let adapted;
    try {
      const parsed = JSON.parse(sanitizeJSON(jsonStr));
      adapted = postProcessResult(parsed);
      if (adapted.recipe) {
        adapted = adapted.recipe;
      } else if (adapted.recipes && adapted.recipes?.length > 0) {
        adapted = adapted.recipes[0];
      }
    } catch (parseErr) {
      console.error("Failed to parse AI response as JSON:", jsonStr);
      throw new Error("The AI generated an invalid recipe format. Please try again.");
    }
    // Ensure we merge with the original recipe to preserve any fields the AI might have missed
    // but prioritize the adapted fields for instruments/busses/etc.
    return {
      ...recipe,
      ...adapted,
      id: Math.random().toString(36).substr(2, 9),
      savedAt: new Date().toISOString(),
      bubbleColor: '#0ea5e9'
    };
  } catch (err) {
    console.error("Error in replicateRecipeWithUserGear:", err);
    throw err;
  }
};
export const regenerateTrackingChain = async (
  vibeSearch: string,
  plugins: VSTPlugin[],
  analogHardware: Hardware[],
  language: string,
  songSearch: string = ''
) => {
  try {
    const ai = getAI();
    const uadPlugins = plugins.filter(p => 
      (p.vendor.toLowerCase().includes('universal audio') || p.name.toLowerCase().includes('uad')) && 
      !p.name.toLowerCase().includes('native') && 
      !p.name.toLowerCase().includes('uadx')
    );
    const uadPluginListStr = uadPlugins.length > 0 
      ? uadPlugins.map(p => `${p.vendor} - ${p.name} (${p.type})`).join('\n')
      : 'Universal Audio plugins defaults (e.g. 1176, LA-2A, Pultec EQP-1A, Neve 1073, Townsend Sphere, Ocean Way, etc.)';
    const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo'));
    const apolloModel = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';
    const hasTownsend = analogHardware.some(h => 
      h.name.toLowerCase().includes('townsend') || 
      h.name.toLowerCase().includes('sphere l22') ||
      h.name.toLowerCase().includes('sphere dlx') ||
      h.name.toLowerCase().includes('sphere lx') ||
      h.name.toLowerCase() === 'l22'
    ) || vibeSearch.toLowerCase().includes('l22') || vibeSearch.toLowerCase().includes('townsend') || vibeSearch.toLowerCase().includes('sphere');
    const hasOceanWayMic = plugins.some(p => p.name.toLowerCase().includes('ocean way mic')) || vibeSearch.toLowerCase().includes('ocean way mic');
    const prompt = `
      You are an expert audio engineer running UAD Console. 
      The user has requested a completely new tracking chain for their Apollo, based on this new vibe/artist request: "${vibeSearch}"
      ${songSearch ? `(Context: They are tracking to a beat similar to: ${songSearch})` : ''}
      ${getLanguageInstruction(language)}
      YOU MUST STRICTLY ONLY USE THESE UAD-2 DSP PLUGINS FOR THE UAD CONSOLE TRACKING CHAIN:
      ${uadPluginListStr}
      CRITICAL CONSTRAINTS:
      The user owns a Universal Audio Apollo interface (${apolloModel}).
      ${hasTownsend ? 'CRITICAL: The user is using the TOWNSEND LABS / UA SPHERE L22 (or DLX/LX) microphone. This requires a STEREO LINKED input pair in UAD Console.' : ''}
      MANDATORY UAD CONSOLE REQUIREMENTS:
      1. UNISON SLOT: A Unison preamp/channel strip plugin is MANDATORY. Explain impedance matching.
      2. INSERTS (Stereo Mic Channel): EXACTLY 4 plugins MUST be provided. The FIRST insert MUST ALWAYS be "Ocean Way Mic Collection" (or "Sphere Mic Collection"/"Bill Putnam Mic Collection"). The other 3 slots MUST be filled.
      3. AUX 1: Array of UAD-2 plugins. This is MANDATORY.
      4. AUX 2: Array of UAD-2 plugins. This is MANDATORY.
      ACCURACY AND DEPTH:
      - For EVERY plugin, provide exhaustive 'deepDive' parameters. DO NOT BE LAZY. Provide EVERY knob, slider, and switch .
      - Provide 'dawRoutingInstructions' explaining Virtual I/O, physical outputs, UAD REC vs UAD MON switch, and printing choices vs monitoring choices.
      - Provide a 'dspUsageNote'.
    `;
    const schema = {
      type: Type.OBJECT,
      properties: {
        trackingChain: {
          type: Type.OBJECT,
          properties: {
            unisonPlugin: {
              type: Type.OBJECT,
              properties: { 
                name: { type: Type.STRING }, 
                purpose: { type: Type.STRING }, 
                deepDive: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT, 
                    properties: { 
                      parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } }, 
                    required: ["parameter", "value", "explanation"] 
                  } 
                } 
              },
              required: ["name", "purpose", "deepDive"]
            },
            inserts: {
              type: Type.ARRAY,
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  name: { type: Type.STRING }, 
                  purpose: { type: Type.STRING }, 
                  deepDive: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT, 
                      properties: { 
                        parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } }, 
                      required: ["parameter", "value", "explanation"] 
                    } 
                  } 
                }, 
                required: ["name", "purpose", "deepDive"] 
              }
            },
            aux1: {
              type: Type.ARRAY,
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  name: { type: Type.STRING }, 
                  purpose: { type: Type.STRING }, 
                  deepDive: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT, 
                      properties: { 
                        parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } }, 
                      required: ["parameter", "value", "explanation"] 
                    } 
                  } 
                }, 
                required: ["name", "purpose", "deepDive"] 
              }
            },
            aux2: {
              type: Type.ARRAY,
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  name: { type: Type.STRING }, 
                  purpose: { type: Type.STRING }, 
                  deepDive: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT, 
                      properties: { 
                        parameter: { type: Type.STRING }, value: { type: Type.STRING }, explanation: { type: Type.STRING } }, 
                      required: ["parameter", "value", "explanation"] 
                    } 
                  } 
                }, 
                required: ["name", "purpose", "deepDive"] 
              }
            },
            dawRoutingInstructions: { type: Type.STRING },
            dspUsageNote: { type: Type.STRING }
          },
          required: ["inserts"]
        }
      },
      required: ["trackingChain"]
    };
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt + "n\nCRITICAL: You MUST return a valid JSON object matching this schema exactly:n" + JSON.stringify(schema, null, 2) }] },
      config: {
        customAction: 'regenerate_tracking_chain',
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(sanitizeJSON(result.text || '{}'));
  } catch (error) {
    console.error("Error regenerating tracking chain:", error);
    throw error;
  }
};

export const getAlbumMasteringGuide = async (
  plugins: VSTPlugin[],
  userContext: string = "",
  language: string = 'en',
  uploadedStems: any[] = [],
  analogInstruments: Hardware[] = [],
  analogHardware: Hardware[] = [],
  starredPlugins: string[] = [],
  stemsPhysicalMetrics?: Record<string, { integratedLufs: number, truePeak: number, crestFactor: number, duration?: number }>,
  combinedPhysicalMetrics?: { integratedLufs: number, truePeak: number, crestFactor: number, duration?: number },
  dawType: string | null = null,
  lunaSumming: string = 'off',
  lunaTape: string = 'off',
  userEmail: string | null | undefined = null
): Promise<any> => {
  const ai = getAI();
    const isStudioOne = dawType?.toLowerCase().includes('studio one');
  const filteredPlugins = plugins.filter(p => {
    if (!isStudioOne && (p.vendor.toLowerCase().includes('presonus') || p.name.toLowerCase().includes('presonus'))) {
      return false;
    }
    return true;
  });
    const limitedPlugins = [
    ...filteredPlugins.filter(p => starredPlugins.includes(p.name)),
    ...filteredPlugins.filter(p => !starredPlugins.includes(p.name))
  ].slice(0, 50);
  const pluginListStr = limitedPlugins.map(p => `${p.vendor} - ${p.name} (${p.type}) [Parameters: ${p.parameters?.join(', ') || 'N/A'}]`).join('\n');

  let hardwareListStr = [...analogInstruments, ...analogHardware].map(h => h.name).join('\n');

  const dawStr = dawType ? `nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL MANDATORY INSTRUCTION: The user has STARRED (favorited) the following plugins:n${starredPlugins.join(', ')}nYou ABSOLUTELY MUST include these starred plugins in EVERY SINGLE track's recommended chain. This is a non-negotiable hard requirement.` : '';

  const isSpecialUserAlbum = userEmail === 'coldestconcept@gmail.com' || userEmail === 'recognizemiracles@gmail.com';
  let specialUserInstructions = '';
  if (isSpecialUserAlbum) {
    specialUserInstructions = `
CRITICAL: The user will be using Lurssen Mastering Console and FabFilter Pro-Q 3 for every song on this album.
Their goal is for all the songs on the album to sound like they are on the same project (highly cohesive).
You MUST provide specific, actionable suggestions on how to use these two tools together effectively to achieve consistent, professional results across the entire album.
Example Workflow:
1. Use FabFilter Pro-Q 3 first for surgical EQ, track matching, and fixing resonances.
2. Use Lurssen Mastering Console last as the final analog "glue" to impart a unified tone and dynamic control.
Suggest consistent presets or workflows across the tracks.

For Lurssen Mastering Console, you MUST provide explicit settings for ALL available controls for EACH track:
1. Input Drive: (measured in dB, e.g. "2.8 dB" — decimal precision allowed)
2. 5 Band EQ (60Hz, 120Hz, 3kHz, 6kHz, 10kHz): MUST BE WHOLE INTEGER dB ONLY (e.g. "+1 dB", "-1 dB", "0 dB", "+2 dB"). NO DECIMALS OR .5s ALLOWED (e.g. NO 0.5 dB, NO -0.5 dB, NO 1.5 dB).
3. Push: (measured in PERCENTAGE %, e.g. "0%", "+10%", "+50%", "+100%", "-100%". Maximum is +100% and minimum is -100%. Note: Push is a master control that shifts all 5 EQ band dials simultaneously).
4. Style / Genre Preset: (e.g. "Pop Rock")
`;
  }

  let stemsContext = uploadedStems.map((stem, index) => {
    const metrics = stemsPhysicalMetrics?.[stem.id];
    let metricsStr = metrics ? `(LUFS: ${metrics.integratedLufs.toFixed(1)}, True Peak: ${metrics.truePeak.toFixed(1)}dB)` : '';
    return `Track ${index + 1}: ${stem.file?.name || 'Unknown'} ${metricsStr}`;
  }).join('\n');

  let prompt = `
    You are an expert audio mastering engineer. 
    The user has uploaded multiple full mixdowns of tracks intended for an album release.
    Your goal is to analyze the differences between these tracks and provide a cohesive Album Mastering Guide.
    
    Here are the tracks provided:
    ${stemsContext}
    
    User Context / Album Vibe: "${userContext}"
    ${specialUserInstructions}
    
    You MUST provide an exhaustive, in-depth guide of what specific mastering plugins to add on EACH track's master bus so that they all sound good together like a fine-tuned album. Match the LUFS, dynamic range, and tonal balance.
    
    CRITICAL REQUIREMENTS:
    1. You MUST include FabFilter Pro-Q 3 in EVERY SINGLE track's recommendedChain. For Pro-Q 3, there MUST be exactly 6 adjustments and at least one dynamic EQ change.
    2. You MUST provide EXHAUSTIVE, deeply detailed parameters for EVERY SINGLE plugin suggested. Do not just suggest the plugin, tell them EXACTLY how to set every single knob, switch, and fader.
    
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    
    ONLY use plugins from this list (the user owns these):
    ${pluginListStr}
    
    Analog Hardware available:
    ${hardwareListStr}
    
    ${dawStr}
    ${starredStr}
    
    Respond with a JSON object exactly matching this interface:
    {
      "title": "Album Mastering Strategy",
      "overallFeedback": "Your detailed analysis of the album's current cohesive state, the differences identified between the tracks, and the high-level strategy to unify them.",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "actionPlan": [
        {
          "targetStem": "Name of the Track (e.g., Track 1: name.wav)",
          "issue": "What this specific track needs to match the album. Be highly detailed.",
          "solution": "How to achieve this.",
          "recommendedChain": [
            {
              "name": "Exact Plugin Name from list",
              "purpose": "Why use this on this track",
              "deepDive": [
                {
                  "parameter": "Exact parameter name",
                  "value": "Exact value (e.g., -2dB)"
                }
              ]
            }
          ]
        }
      ]
    }
  `;

  let parts: any[] = [{ text: prompt }];

  // Upload each stem file to Gemini and add to parts
  for (const stem of uploadedStems) {
    if (stem.file && stem.geminiFileUri) {
      parts.push({
        fileData: {
          mimeType: stem.mimeType || 'audio/mpeg',
          fileUri: stem.geminiFileUri
        }
      });
      parts.push({ text: `Audio for ${stem.file.name}` });
    }
  }

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      overallFeedback: { type: Type.STRING },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      actionPlan: {
        type: Type.ARRAY,
        description: "CRITICAL: You MUST generate EXACTLY " + uploadedStems.length + " items in this array, one for each uploaded stem.",
        items: {
          type: Type.OBJECT,
          properties: {
            targetStem: { type: Type.STRING },
            issue: { type: Type.STRING },
            solution: { type: Type.STRING },
            recommendedChain: {
              type: Type.ARRAY,
              description: "CRITICAL: You MUST include FabFilter Pro-Q 3 in EVERY SINGLE track's recommendedChain.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    description: "CRITICAL: You MUST provide EXHAUSTIVE, deeply detailed parameters. Do not just suggest the plugin, tell them EXACTLY how to set every single knob. For Pro-Q 3, there MUST be exactly 6 items.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING },
                        value: { type: Type.STRING }
                      },
                      required: ["parameter", "value"]
                    }
                  }
                },
                required: ["name", "purpose", "deepDive"]
              }
            }
          },
          required: ["targetStem", "issue", "solution", "recommendedChain"]
        }
      }
    },
    required: ["title", "overallFeedback", "strengths", "weaknesses", "actionPlan"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: parts,
    config: {
        systemInstruction: "You are an elite, Grammy-winning mastering engineer. You output only valid JSON. Do not use markdown blocks for JSON.",
        responseMimeType: 'application/json',
        responseSchema: schema as any,
        temperature: 0.2
    }
  });

  const text = response.text || "";
  try {
    const data = JSON.parse(text);
    return {
      id: Date.now().toString(),
      title: data.title || "Album Mastering Guide",
      overallFeedback: data.overallFeedback || "",
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      actionPlan: data.actionPlan || []
    };
  } catch (err) {
    console.error("Failed to parse Album Mastering JSON:", err);
    throw new Error("Failed to generate album mastering guide. Please try again.");
  }
};
