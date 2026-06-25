import { JSFX_DATABASE } from "../data/jsfxResearch";

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
import { VSTPlugin, RecommendationResponse, BeatRecipe, SavedRecipe, Hardware, StructuralBlueprint } from "../types";
import { fetchWithDetailedError } from "../lib/api";
import { keepAlive } from "../lib/keepAlive";
import { getVendorSpecificParameters, normalizeParameterName } from "../utils/pluginUtils";
import { sanitizeJSON } from "../utils/jsonUtils";
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

const getSimplifiedJSFXDatabase = (installedJsfxPacks: string[], starredPlugins: string[] = []) => {
  let activeJSFX = JSFX_DATABASE.filter(p => {
    if (!p.packRequired) return true;
    return installedJsfxPacks.includes(p.packRequired);
  });

  // Filter strictly to starred JSFX plugins
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
    Always include decent, best-in-class patterns instead of sometimes leaving it simple, so users don't feel cheated.
    CRITICAL - DRUM INSTRUMENTS AND FX ADVICE in 'drumKitAdvice':
    You MUST provide detailed and valid recommendations in the 'drumKitAdvice' object:
    - 'hiHat': Specific tuning/muffling/style advice for the hi-hats.
    - 'clap': Specific acoustic, layered, or performance-style advice for claps/rimshots/percussions (e.g., room acoustics, handclapping count, or synthetic layering).
    - 'bass': Specific acoustic bass guitar tuning or synth bass/808 sub layering style advice (e.g., sidechain interaction with kick, glide settings, sub bass EQ cuts).
    - 'kickVirtualInstrument': Recommend EXACTLY which virtual instrument / synth plugin to load for the Kick sound.
      - If JSFX MODE IS ACTIVE, you MUST recommend a native JSFX instrument like "JS: Thunderkick" or "JS: 50 Hz Kicker" with exact slider/index settings (e.g. Freq: 55Hz, Decay: 70%, Click: 30%).
      - If JSFX MODE IS INACTIVE, recommend a top VST virtual instrument like "SubLab", "Serum" (with a sub sine sweep patch), "EZdrummer 3", or "Sitala", with detailed preset/sound-shaping parameters.
    - 'kickFXPlugins': An array of FX plugins to add onto the Kick track to make it sound industry-grade.
      - If JSFX MODE IS ACTIVE, use JSFX from the database like "JS: Digital Drum Compressor", "JS: Saturation", "JS: Bad Buss Mojo Waveshaper", or "JS: Transient Controller" with exact settings.
      - If JSFX MODE IS INACTIVE, use VSTs like "FabFilter Pro-C 2", "Decapitator", "rc-20 retro color", or "Devil-Loc" with exact settings.
    - 'snareVirtualInstrument': Recommend which virtual instrument / sample-trigger to load for the Snare (e.g., "JS: Gaussian Noise Generator" or Cockos drum samplers in JSFX mode, or "Sitala", "Addictive Drums 2", or "Battery 4" in VST mode) and its parameters.
    - 'snareFXPlugins': An array of FX plugins to enhance the Snare (e.g., "JS: Dirt Squeeze Compressor" or "JS: Delay" in JSFX mode, or "Pro-Q 3", "Decapitator", or "Valhalla VintageVerb" in VST mode) with exact settings.
    - 'hiHatVirtualInstrument': Recommend which virtual instrument to use for the Hi-Hat (e.g. "JS: Gaussian Noise Generator" high-passed in JSFX mode, or "Sitala" / "Battery 4" in VST mode) with detailed parameters.
    - 'hiHatFXPlugins': An array of FX plugins to enhance the Hi-Hat (e.g. "JS: Transient Controller" or "JS: Chorus" in JSFX mode, or "rc-20 retro color" wow/flutter & noise or "MicroShift" in VST mode) with exact settings.
    - 'clapVirtualInstrument': Recommend which virtual instrument / sample-trigger to load for the Clap (e.g., "JS: White Noise Generator" or native JSFX samplers in JSFX mode, or "Sitala", "Battery 4", or custom clap samples in VST mode) with detailed parameters.
    - 'clapFXPlugins': An array of FX plugins to enhance the Clap (e.g., "JS: Ozzifier Chorus", "JS: Delay" or "JS: Tremolo" in JSFX mode, or "Valhalla VintageVerb", "Soundtoys Decapitator", or "MicroShift" in VST mode) with exact settings.
    - 'bassVirtualInstrument': Recommend EXACTLY which virtual instrument / synth plugin to load for the Bass / 808 sound.
      - If JSFX MODE IS ACTIVE, you MUST recommend a native JSFX instrument or synth like "JS: Tone Generator" (configured as a sub sine/triangle wave), or a native Cockos synth plugin with precise settings.
      - If JSFX MODE IS INACTIVE, recommend top VSTs like "SubLab", "Spectrasonics Trilian", "Serum" (for 808 glides/sub bass), "Arturia Mini V", or "Trilogy" with exact preset details.
    - 'bassFXPlugins': An array of FX plugins to shape, saturate, compress, or sidechain the Bass/808.
      - If JSFX MODE IS ACTIVE, use JSFX from the database like "JS: Saturation", "JS: Compciter", "JS: Bass Manager/Booster", or "JS: Non-Linear Processor" with exact settings.
      - If JSFX MODE IS INACTIVE, use VSTs like "FabFilter Pro-MB", "Decapitator", "Pultec EQP-1A", or "CamelCrusher" with exact settings.

    CRITICAL - MIDI NOTE COMPLEXITY & REALISM (ANTI 2-NOTE GENERATION):
    - You MUST generate incredibly realistic, multi-note MIDI patterns. Aim for at least 15-40 notes per sequence for melodies and arps, at least 8-20 notes for chord progressions, and at least 15-30 notes for basslines/808s over 4/8 bars.
    - NEVER generate simple 2-note or 4-note patterns unless it is literally a static drone. Users complain when the system generates "shitty and unrealistic 2 note" patterns. It MUST be a proper 4 or 8 bar pattern.
    - If the user requested a specific song, the MIDI notes MUST meticulously recreate the EXACT iconic melodies, rhythms, chords, and basslines of that song note-for-note and perfectly match the BPM.
    CRITICAL - NO VOCALS AS INSTRUMENTS:
    Ensure you ALWAYS use VST instruments (synths, keys, bass, guitars, etc.) instead of a vocal or acapella as an instrument in the beat recipe. Users feel cheated by a bad recipe guide if it just says "use a vocal". Only use actual VST instruments or hardware for the beat's instrumentation.
    CRITICAL - GUITAR CAPO RECOMMENDATIONS:
    When generating recipes that include acoustic or electric guitars (especially for indie, rock, alternative, or bright pop styles), strongly consider recommending the use of a capo in the sourceSoundGoal or deepDive (e.g., placing it on the 2nd, 3rd, or 4th fret) to achieve a brighter, more distinctive and chiming sound without breaking strings. Use references like Johnny Marr, Jingle-Jangle style, and The Smiths as inspiration for these recommendations.
    CRITICAL - MIDI LENGTH & DURATION RULES:
    - You MUST generate EXACTLY 4 or 8 bars of MIDI data for EVERY instrument and drum pattern. Do NOT generate 1, 2, 3, 5, 6, or 7 bars. It MUST be exactly 4 or 8 bars.
    - For Instrument MIDI Notes: The sum of all 'duration' and 'wait' values in the midiNotes array MUST equal exactly 16 beats (for 4 bars) or 32 beats (for 8 bars).
    - For Drum Patterns: 16 steps = 1 bar. Therefore, you MUST provide steps ranging from 1 to 64 (for 4 bars) or 1 to 128 (for 8 bars). If isDoubleTime is true, double these numbers (1-128 for 4 bars, 1-256 for 8 bars).
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
    When suggesting settings for FabFilter Pro-Q 3, you MUST ALWAYS provide at least 6 processing bands. 
    Every Pro-Q 3 suggestion MUST include a minimum of 6 bands in the 'deepDive' section.
    AT LEAST 2 of those bands MUST be dynamic bands (Dynamic: On, with a Range value).
    You MUST use the following EXACT layout for the 'deepDive' section for each of those 6+ bands, ensuring each parameter is labeled for readability:
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
       - DETAILED PARAMETER MODULATION INSTRUCTIONS (MANDATORY): In the 'explanation' of any dynamic ReEQ band, you MUST provide detailed, step-by-step instructions guiding the user through REAPER's Parameter Modulation/MIDI link window. Detail clicking the 'Param' button -> 'Parameter modulation/MIDI link' -> choosing the specific Gain parameter for that Filter band -> checking 'Audio control signal' (sidechain) -> setting Track audio channels to 1+2 (self) or 3+4 (sidechain for ducking) -> setting Direction to Negative (for ducking/cuts) or Positive (for boosting) -> configuring strength, attack (speed of reaction), and release. ALWAYS explicitly start this with a bold statement confirming: "**BeatGangsta Connect AUTOMATION**: This Parameter Modulation has been automatically configured and activated for you in REAPER! The following instructions are provided for your reference, inspection, or manual tweaking." This ensures the user is guided in detail, but knows that BeatGangsta Connect did all the work itself!
    2. **JS: Saike Filther (Saike)**:
       - Use this as Option 1 for dynamic/modulated filtering or creative saturation. Recommend it for heavy dynamic ducking, creative band modulation, and synth/vocal sound shaping.
    3. **JS: Saike Saike Smooth**:
       - Use this for dynamic resonance suppression and spectral de-harshing.
       - EVERY single track's FX chain (and buses) MUST end with "JS: Saike Saike Smooth" as the final plugin to suppress harshness and clean up the high-frequency spectrum.
    4. **JS: Mudra/Spectral-Shaper**:
       - Use this as the intelligent spectral dynamics and high-frequency resonance controller. Recommend placing it on vocals, harsh instruments, or groups to smooth out problematic frequencies dynamically.
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
    3. REAPER JSFX MASTER RESEARCH PROFILES (USE FOR COCKOS JSFX RECOMMENDATIONS):
       - "JS: 1175 Compressor" (1175 Compressor - Stock Cockos REAPER JSFX):
         - S1 (Threshold (dB)): -60 to 0 dB (Default: 0).
         - S2 (Ratio): Selection 0 to 9 (Default: 5).
         - S3 (Gain (dB)): -20 to 20 dB. CRITICAL: When using 1175, you MUST set S3 to a nice warm boost (e.g., +6dB to +18dB) to preserve upfront presence! ALWAYS compensate for Threshold gains.
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
       - Vocals must sit upfront and never be quiet. When using FET style compressor "1175", any clamp on the threshold (S1) MUST be offset by Gain (S3) by at least +12dB to +18dB depending on the gain reduction to prevent vocals from getting lost or sounding awful.
       - A premium 6-plugin chain MUST be modeled all the time for vocal or stem processing to ensure a grammy-level sound.
    5. GAIN MATCHING & MAINTAINING LOUDNESS: Anytime you use a plugin that reduces volume (like EQ cuts, compression, tape saturation, limiters, etc.), you MUST explicitly include the parameter to compensate for it (e.g., Output/Makeup Gain, Trim, Level). The resulting sound MUST always maintain or improve loudness. Never output settings that significantly reduce the overall volume.
    CRITICAL WARNING: NEVER RETURN AN EMPTY RECIPES ARRAY. You MUST ALWAYS generate at least one complete recipe that fulfills the user's request, regardless of strictness constraints.
`;
function postProcessResult(result: any) {
  const processRecipe = (recipe: any) => {
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
  const pluginContext = `Plugin: ${pluginName}\nParameters: ${(deepDive || []).map(d => `${d.parameter}: ${d.value}`).join(', ')}`;
  const recipeContext = `Recipe Title: ${recipe.title || ''}\nStyle: ${recipe.style || 'N/A'}\nDescription: ${recipe.description || (recipe as any).overallFeedback || ''}`;
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
    contents: { parts: [{ text: prompt + "\\n\\nCRITICAL: You MUST return EXACTLY valid JSON matching this schema:\\n" + JSON.stringify(schemaObj, null, 2) }] },
    config: {
      customAction: 'regenerate_plugin',
      responseMimeType: "application/json"
    }
  });
  try {
    return JSON.parse(sanitizeJSON(response.text || '{}'));
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
      desc += `\n  - Connected Pedals: ${instrument.connectedPedals.map(p => p.name).join(', ')}`;
    }
    if (instrument.connectedAmps && instrument.connectedAmps.length > 0) {
      desc += `\n  - Connected Amps: ${instrument.connectedAmps.map(a => a.name).join(', ')}`;
    }
    selectedDescriptions.push(desc);
  });
  analogHardware.forEach(hardware => {
    let desc = `- ${hardware.name}`;
    if (ANALOG_DESCRIPTIONS[hardware.name]) {
      desc += `: ${ANALOG_DESCRIPTIONS[hardware.name]}`;
    }
    if (hardware.connectedPedals && hardware.connectedPedals.length > 0) {
      desc += `\n  - Connected Pedals: ${hardware.connectedPedals.map(p => p.name).join(', ')}`;
    }
    if (hardware.connectedAmps && hardware.connectedAmps.length > 0) {
      desc += `\n  - Connected Amps: ${hardware.connectedAmps.map(a => a.name).join(', ')}`;
    }
    selectedDescriptions.push(desc);
  });
  let gearStr = '';
  if (selectedDescriptions.length > 0) {
    gearStr = `\nCRITICAL: The user owns the following REAL ANALOG HARDWARE. You MUST prioritize using these in your recipes where appropriate:\n${selectedDescriptions.join('\n')}`;
  } else {
    gearStr = `\nThe user has the following analog equipment, but no specific sonic characteristics were provided:\nInstruments: ${analogInstruments.map(h => h.name).join(', ')}\nHardware: ${analogHardware.map(h => h.name).join(', ')}`;
  }
  return gearStr + drumKitStr;
};
export const getUnifiedRecipeSchema = () => {
  return {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      style: { type: Type.STRING },
      bpm: { type: Type.NUMBER },
      description: { type: Type.STRING },
      artistTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
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
          kickFXPlugins: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING },
                settings: { type: Type.STRING }
              },
              required: ["name", "purpose", "settings"]
            }
          },
          snareVirtualInstrument: { type: Type.STRING },
          snareFXPlugins: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING },
                settings: { type: Type.STRING }
              },
              required: ["name", "purpose", "settings"]
            }
          },
          hiHatVirtualInstrument: { type: Type.STRING },
          hiHatFXPlugins: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING },
                settings: { type: Type.STRING }
              },
              required: ["name", "purpose", "settings"]
            }
          },
          clap: { type: Type.STRING },
          clapVirtualInstrument: { type: Type.STRING },
          clapFXPlugins: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING },
                settings: { type: Type.STRING }
              },
              required: ["name", "purpose", "settings"]
            }
          },
          bass: { type: Type.STRING },
          bassVirtualInstrument: { type: Type.STRING },
          bassFXPlugins: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                purpose: { type: Type.STRING },
                settings: { type: Type.STRING }
              },
              required: ["name", "purpose", "settings"]
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
    required: ["title", "style", "bpm", "description", "artistTypes", "instruments", "busses", "drumPatterns", "arrangement", "mixingAdvice", "masterPlugins"]
  };
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
      1. Do NOT categorize everything as 'Creative FX'. This is a sign of failure.
      2. If a plugin is a well-known instrument, it MUST be 'Instruments'.
      3. If a plugin is a well-known compressor, it MUST be 'Dynamics'.
      4. For each plugin, first explain your reasoning for the category choice.
      5. Provide a professional, helpful description for each.
      6. Return the results in the EXACT order of the list provided.
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
    - Find official manuals or technical documentation to confirm parameters.
    - Be extremely precise. "Advanced" versions often have modules that "Standard" versions lack.
    - If you cannot find evidence for a parameter, assume it is incorrect.
    - If you successfully verify the plugin and its parameters, start your "message" with: "Beatgangsta verified parameter functions were discovered!"
    ${getLanguageInstruction(language)}
    RESPONSE FORMAT (JSON):
    {
      "isVersionValid": boolean,
      "isParameterValid": boolean,
      "message": "Detailed explanation of your findings (e.g., 'Yes, Ozone 11 Advanced exists and includes the Clarity module. The parameter \"Clarity\" is valid.')",
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
    Your task is to research and provide:
    1. A highly accurate, professional description of the plugin.
    2. A list of its key features.
    3. The most accurate category (Instruments, Dynamics, Equalizers, Reverb & Delay, Modulation, Distortion & Saturation, Utility & Metering, Creative FX).
    4. An EXHAUSTIVE list of ALL actual technical parameter names found on the plugin's interface. Be precise and thorough. For complex plugins, provide all available parameters . Do NOT be lazy.
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
export const getSchemaInstruction = () => `\n\nCRITICAL: YOU MUST RETURN EXACTLY VALID JSON MATCHING THIS SCHEMA:\n${JSON.stringify({ type: "OBJECT", properties: { recipes: { type: "ARRAY", items: getUnifiedRecipeSchema(), minItems: 1 } }, required: ["recipes"] }, null, 2)}`;

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
export const getBeatRecommendations = async (plugins: VSTPlugin[], analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, language: string = 'en', isMultiBandMode: boolean = false, bpm?: string, context?: string, isJsfxMode: boolean = false, installedJsfxPacks: string[] = []): Promise<RecommendationResponse> => {
  const ai = getAI();
  const pluginListStr = plugins.map(p => {
    let str = `${p.vendor} - ${p.name} (${p.type})`;
    if (p.parameters && p.parameters.length > 0) {
      str += ` [Parameters: ${p.parameters.join(', ')}]`;
    }
    return str;
  }).join('\n');
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `\nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You MUST prioritize using these plugins in your recipes whenever possible:\n${starredPlugins.join(', ')}` : '';
  const hasSphereMic = analogHardware.some(h => ['Sphere DLX', 'Sphere LX', 'L22'].includes(h.name) || h.name.toLowerCase() === 'l22' || h.name.toLowerCase().includes('townsend'));
  const sphereMicStr = hasSphereMic ? `\nCRITICAL: The user owns a Universal Audio Sphere (DLX/LX) or Townsend Labs L22 microphone. If the recipe involves a vocal tracking chain, you MUST assign the 'UAD Sphere Mic Collection', 'Ocean Way Mic Collection', or 'Bill Putnam Mic Collection' plugin as the VERY FIRST insert plugin on the vocal channel tracking chain. You MUST specifically select a mic model inside it based on the vibe searched. After the mic collection plugin, you can add up to 3 more plugins.` : '';
  const languageInstruction = getLanguageInstruction(language);
  const multiBandInstruction = getMultiBandInstruction(isMultiBandMode);
  
  const additionalContextStr = context ? `\nUSER SPECIFIED CONTEXT: ${context}\nYou MUST incorporate these instructions or themes tightly into the generated recipe.` : '';
  const bpmStr = bpm ? `\nUSER SPECIFIED EXACT BPM: ${bpm}\nYou MUST use this exact BPM in the recipe, and tailor the midi, drums, and time-based effects (delay, reverb pre-delay) to align perfectly with it.` : '';
 
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

      ==================================================
      💡 RELEARNED JSFX & EEL2 AUTOMATION DIRECTIVES (TUKAN & JSFX CLONES) 💡
      Many JSFX have dropdowns, toggles, or buttons rendered on their custom graphical GUIs.
      In REAPER, these custom GUI interactions map directly to standard, automatable REAPER sliders. 
      You MUST utilize these slider mappings to automate complex internal parameters, modes, and configurations:
      - **JClones AC1 (Analog Channel)**: Mode (Slider 8) selects console saturation curves (0 = Classic warm analog, 1 = Modern aggressive). Auto Gain (Slider 2) automatically compensates loudness as drive increases (0 = Off, 1 = On).
      - **JClones AC2 (Tape Emulator)**: Model (Slider 5) sets tape formulation physics (0=Swiss Studer high-fidelity, 1=Japan-O Otari warm, 2=USA-M MCI classic, 3=USA-A Ampex aggressive, 4=Japan-S Sony pristine, 5=Japan-T Tascam vintage). Speed (Slider 8) sets IPS (0=7.5 IPS tape saturation with head bump, 1=15 IPS standard tape, 2=30 IPS high-fidelity mastering speed). EQ Type (Slider 9) selects equalization curves (0=IEC-1 warm/vintage, 1=IEC-2@crisp mid-high emphasis). Tape (Slider 10) chooses tape types (0=Modern hi-fi, 1=Vintage saturated).
      - **JClones CA2A (Optical Compressor)**: Mode (Slider 2) toggles compression knee (0=Compress soft-knee, 1=Limit hard limiting). Opto Cell (Slider 4) selects release kinetics behavior (0=Classic slow analog multi-stage release, 1=Fast rapid digital-style release). R37 (Slider 3) adjusts high-frequency emphasis for the sidechain (0=Flat detection, 1=Heavy HF attenuation for de-essing).
      - **JClones CL1B (Tube Compressor)**: Attack/Release Select (Slider 4) selects speed models (0=Manual fully adjustable, 1=Preset fixed times, 2=Combined program-dependent dynamic recovery).
      - **JClones OInflator (Oxford Inflator)**: Clip (Slider 3) enables 0dB ceiling clipping for tube-style warm distortion (0=Off, 1=On). BandSplit (Slider 4) splits processing (0=Single-band full range, 1=Three-band split).
      - **JClones Molot (Vintage Compressor)**: Mode (Slider 5) selects tube topology modes (0=Sigma fast, 1=Alpha warm character). Filter (Slider 8) configures sidechain highpass filter.
      - **JClones RS124 (Vintage Tube Compressor)**: Speed (Slider 3) selects release recovery profiles (0=Slow, 1=Medium, 2=Fast).
      - **Tukan SumChannel (Channel Strip)**: Console (Slider 5) emulates console desks (0=A-type punchy American, 1=N-type fat British warm, 2=SSL precise & transparent console). Noise (Slider 4) adds console noise floor (0=Off, 1=On).
      - **Tukan SumThing (Summing Mixer)**: Console (Slider 4) selects the summing console model. Crosstalk (Slider 2) sets summing desk stereo channel leakage.
      - **Tukan Dis-Treasure (Distressor)**: Ratio (Slider 1) selects ratios (0=1:1, 1=2:1, 2=3:1, 3=4:1, 4=6:1, 5=10:1, 6=20:1, 7=Nuke brickwall). Detector Mode (Slider 5) configures sidechain (0=HP filter, 1=Bandpass filter, 2=Link). Audio Mode (Slider 6) sets distortion modes (0=Clean, 1=Dist2 tube-like second harmonics, 2=Dist3 tape-like third harmonics).
      - **Tukan NC76 / NC76B (1176 Compressor)**: Ratio (Slider 1) selects ratios (0=4:1, 1=8:1, 2=12:1, 3=20:1, 4=All-Button/British Mode for heavy drum pumping).
      - **Tukan Lexikan / Lexikan 2 (Lush Reverb)**: Mode/Algorithm (Slider 0) sets reverb styles (0=Plate, 1=Room, 2=Hall, 3=Cathedral). Pre-Delay (Slider 2) is fully automatable.
      - **Tukan EQT-1A (Pultec EQ)**: Simultaneous Low Boost (Slider 1) and Low Cut (Slider 2) at the same Low Freq (Slider 0) produces the famous Pultec Low-End Trick for deep yet clean bass.
      - **Tukan Deesser**: Mode (Slider 0) selects detection method (0=Wideband, 1=Split-band).
      - **Tukan Compressor 2**: Knee (Slider 3) sets soft-knee curve width in dB. Sidechain (Slider 7) configures detector routing.
      ==================================================

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
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
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
    You MUST provide the 'instruments' array with AT LEAST 3 DISTINCT "REAL" instruments (e.g., synths, pianos, guitars, strings). 
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
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    ${ADVANCED_MIDI_PROMPT}
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt + getSchemaInstruction() }] },
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
    throw new Error(`Format error in getBeatRecommendations. Details: ${e.message || e}\nRaw: ${typeof jsonStr !== 'undefined' ? jsonStr.substring(0, 500) : "empty"}\nSafety: ${JSON.stringify(response?.candidates?.[0]?.safetyRatings || "none")}`);
  }
};
export const getCustomBeatRecommendations = async (plugins: VSTPlugin[], query: string, analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, language: string = 'en', isMultiBandMode: boolean = false, bpm?: string, context?: string, isJsfxMode: boolean = false, installedJsfxPacks: string[] = []): Promise<RecommendationResponse> => {
  const ai = getAI();
  const pluginListStr = plugins.map(p => {
    let str = `${p.vendor} - ${p.name} (${p.type})`;
    if (p.parameters && p.parameters.length > 0) {
      str += ` [Parameters: ${p.parameters.join(', ')}]`;
    }
    return str;
  }).join('\n');
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `\nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You MUST prioritize using these plugins in your recipes whenever possible:\n${starredPlugins.join(', ')}` : '';
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

  const additionalContextStr = context ? `\nUSER SPECIFIED CONTEXT: ${context}\nYou MUST incorporate these instructions or themes tightly into the generated recipe.` : '';
  const bpmStr = bpm ? `\nUSER SPECIFIED EXACT BPM: ${bpm}\nYou MUST use this exact BPM in the recipe, and tailor the midi, drums, and time-based effects (delay, reverb pre-delay) to align perfectly with it.` : '';

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

      ==================================================
      💡 RELEARNED JSFX & EEL2 AUTOMATION DIRECTIVES (TUKAN & JSFX CLONES) 💡
      Many JSFX have dropdowns, toggles, or buttons rendered on their custom graphical GUIs.
      In REAPER, these custom GUI interactions map directly to standard, automatable REAPER sliders. 
      You MUST utilize these slider mappings to automate complex internal parameters, modes, and configurations:
      - **JClones AC1 (Analog Channel)**: Mode (Slider 8) selects console saturation curves (0 = Classic warm analog, 1 = Modern aggressive). Auto Gain (Slider 2) automatically compensates loudness as drive increases (0 = Off, 1 = On).
      - **JClones AC2 (Tape Emulator)**: Model (Slider 5) sets tape formulation physics (0=Swiss Studer high-fidelity, 1=Japan-O Otari warm, 2=USA-M MCI classic, 3=USA-A Ampex aggressive, 4=Japan-S Sony pristine, 5=Japan-T Tascam vintage). Speed (Slider 8) sets IPS (0=7.5 IPS tape saturation with head bump, 1=15 IPS standard tape, 2=30 IPS high-fidelity mastering speed). EQ Type (Slider 9) selects equalization curves (0=IEC-1 warm/vintage, 1=IEC-2@crisp mid-high emphasis). Tape (Slider 10) chooses tape types (0=Modern hi-fi, 1=Vintage saturated).
      - **JClones CA2A (Optical Compressor)**: Mode (Slider 2) toggles compression knee (0=Compress soft-knee, 1=Limit hard limiting). Opto Cell (Slider 4) selects release kinetics behavior (0=Classic slow analog multi-stage release, 1=Fast rapid digital-style release). R37 (Slider 3) adjusts high-frequency emphasis for the sidechain (0=Flat detection, 1=Heavy HF attenuation for de-essing).
      - **JClones CL1B (Tube Compressor)**: Attack/Release Select (Slider 4) selects speed models (0=Manual fully adjustable, 1=Preset fixed times, 2=Combined program-dependent dynamic recovery).
      - **JClones OInflator (Oxford Inflator)**: Clip (Slider 3) enables 0dB ceiling clipping for tube-style warm distortion (0=Off, 1=On). BandSplit (Slider 4) splits processing (0=Single-band full range, 1=Three-band split).
      - **JClones Molot (Vintage Compressor)**: Mode (Slider 5) selects tube topology modes (0=Sigma fast, 1=Alpha warm character). Filter (Slider 8) configures sidechain highpass filter.
      - **JClones RS124 (Vintage Tube Compressor)**: Speed (Slider 3) selects release recovery profiles (0=Slow, 1=Medium, 2=Fast).
      - **Tukan SumChannel (Channel Strip)**: Console (Slider 5) emulates console desks (0=A-type punchy American, 1=N-type fat British warm, 2=SSL precise & transparent console). Noise (Slider 4) adds console noise floor (0=Off, 1=On).
      - **Tukan SumThing (Summing Mixer)**: Console (Slider 4) selects the summing console model. Crosstalk (Slider 2) sets summing desk stereo channel leakage.
      - **Tukan Dis-Treasure (Distressor)**: Ratio (Slider 1) selects ratios (0=1:1, 1=2:1, 2=3:1, 3=4:1, 4=6:1, 5=10:1, 6=20:1, 7=Nuke brickwall). Detector Mode (Slider 5) configures sidechain (0=HP filter, 1=Bandpass filter, 2=Link). Audio Mode (Slider 6) sets distortion modes (0=Clean, 1=Dist2 tube-like second harmonics, 2=Dist3 tape-like third harmonics).
      - **Tukan NC76 / NC76B (1176 Compressor)**: Ratio (Slider 1) selects ratios (0=4:1, 1=8:1, 2=12:1, 3=20:1, 4=All-Button/British Mode for heavy drum pumping).
      - **Tukan Lexikan / Lexikan 2 (Lush Reverb)**: Mode/Algorithm (Slider 0) sets reverb styles (0=Plate, 1=Room, 2=Hall, 3=Cathedral). Pre-Delay (Slider 2) is fully automatable.
      - **Tukan EQT-1A (Pultec EQ)**: Simultaneous Low Boost (Slider 1) and Low Cut (Slider 2) at the same Low Freq (Slider 0) produces the famous Pultec Low-End Trick for deep yet clean bass.
      - **Tukan Deesser**: Mode (Slider 0) selects detection method (0=Wideband, 1=Split-band).
      - **Tukan Compressor 2**: Knee (Slider 3) sets soft-knee curve width in dB. Sidechain (Slider 7) configures detector routing.
      ==================================================

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
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
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
    You MUST provide the 'instruments' array with AT LEAST 3 DISTINCT "REAL" instruments (e.g., synths, pianos, guitars, strings). 
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
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    ${ADVANCED_MIDI_PROMPT}
  `;
  const multiBandInstruction = getMultiBandInstruction(isMultiBandMode);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt + multiBandInstruction + getSchemaInstruction() }] },
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
    throw new Error(`Format error in getCustomBeatRecommendations. Details: ${e.message || e}\nRaw: ${typeof jsonStr !== 'undefined' ? jsonStr.substring(0, 500) : "empty"}\nSafety: ${JSON.stringify(response?.candidates?.[0]?.safetyRatings || "none")}`);
  }
  if (isGangstaVox && result.recipes) {
    result.recipes = result.recipes.map((r: any) => ({ ...r, isGangstaVox: true }));
  }
  return result;
};
export const getSongBeatRecommendations = async (plugins: VSTPlugin[], songQuery: string, analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, language: string = 'en', isMultiBandMode: boolean = false, bpm?: string, context?: string, isJsfxMode: boolean = false, installedJsfxPacks: string[] = []): Promise<RecommendationResponse> => {
  const blueprint = await generateStructuralBlueprint(songQuery, language);
  const ai = getAI();
  const pluginListStr = plugins.map(p => {
    let str = `${p.vendor} - ${p.name} (${p.type})`;
    if (p.parameters && p.parameters.length > 0) {
      str += ` [Parameters: ${p.parameters.join(', ')}]`;
    }
    return str;
  }).join('\n');
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `\nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You MUST prioritize using these plugins in your recipes whenever possible:\n${starredPlugins.join(', ')}` : '';
  const hasSphereMic = analogHardware.some(h => ['Sphere DLX', 'Sphere LX', 'L22'].includes(h.name) || h.name.toLowerCase() === 'l22' || h.name.toLowerCase().includes('townsend'));
  const sphereMicStr = hasSphereMic ? `\nCRITICAL: The user owns a Universal Audio Sphere (DLX/LX) or Townsend Labs L22 microphone. If the recipe involves a vocal tracking chain, you MUST assign the 'UAD Sphere Mic Collection', 'Ocean Way Mic Collection', or 'Bill Putnam Mic Collection' plugin as the VERY FIRST insert plugin on the vocal channel tracking chain. You MUST specifically select a mic model inside it based on the vibe searched. After the mic collection plugin, you can add up to 3 more plugins.` : '';
  
  const additionalContextStr = context ? `\nUSER SPECIFIED CONTEXT: ${context}\nYou MUST incorporate these instructions or themes tightly into the generated recipe.` : '';
  const bpmStr = bpm ? `\nUSER SPECIFIED EXACT BPM: ${bpm}\nYou MUST use this exact BPM in the recipe, and tailor the midi, drums, and time-based effects (delay, reverb pre-delay) to align perfectly with it.` : '';

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

      ==================================================
      💡 RELEARNED JSFX & EEL2 AUTOMATION DIRECTIVES (TUKAN & JSFX CLONES) 💡
      Many JSFX have dropdowns, toggles, or buttons rendered on their custom graphical GUIs.
      In REAPER, these custom GUI interactions map directly to standard, automatable REAPER sliders. 
      You MUST utilize these slider mappings to automate complex internal parameters, modes, and configurations:
      - **JClones AC1 (Analog Channel)**: Mode (Slider 8) selects console saturation curves (0 = Classic warm analog, 1 = Modern aggressive). Auto Gain (Slider 2) automatically compensates loudness as drive increases (0 = Off, 1 = On).
      - **JClones AC2 (Tape Emulator)**: Model (Slider 5) sets tape formulation physics (0=Swiss Studer high-fidelity, 1=Japan-O Otari warm, 2=USA-M MCI classic, 3=USA-A Ampex aggressive, 4=Japan-S Sony pristine, 5=Japan-T Tascam vintage). Speed (Slider 8) sets IPS (0=7.5 IPS tape saturation with head bump, 1=15 IPS standard tape, 2=30 IPS high-fidelity mastering speed). EQ Type (Slider 9) selects equalization curves (0=IEC-1 warm/vintage, 1=IEC-2@crisp mid-high emphasis). Tape (Slider 10) chooses tape types (0=Modern hi-fi, 1=Vintage saturated).
      - **JClones CA2A (Optical Compressor)**: Mode (Slider 2) toggles compression knee (0=Compress soft-knee, 1=Limit hard limiting). Opto Cell (Slider 4) selects release kinetics behavior (0=Classic slow analog multi-stage release, 1=Fast rapid digital-style release). R37 (Slider 3) adjusts high-frequency emphasis for the sidechain (0=Flat detection, 1=Heavy HF attenuation for de-essing).
      - **JClones CL1B (Tube Compressor)**: Attack/Release Select (Slider 4) selects speed models (0=Manual fully adjustable, 1=Preset fixed times, 2=Combined program-dependent dynamic recovery).
      - **JClones OInflator (Oxford Inflator)**: Clip (Slider 3) enables 0dB ceiling clipping for tube-style warm distortion (0=Off, 1=On). BandSplit (Slider 4) splits processing (0=Single-band full range, 1=Three-band split).
      - **JClones Molot (Vintage Compressor)**: Mode (Slider 5) selects tube topology modes (0=Sigma fast, 1=Alpha warm character). Filter (Slider 8) configures sidechain highpass filter.
      - **JClones RS124 (Vintage Tube Compressor)**: Speed (Slider 3) selects release recovery profiles (0=Slow, 1=Medium, 2=Fast).
      - **Tukan SumChannel (Channel Strip)**: Console (Slider 5) emulates console desks (0=A-type punchy American, 1=N-type fat British warm, 2=SSL precise & transparent console). Noise (Slider 4) adds console noise floor (0=Off, 1=On).
      - **Tukan SumThing (Summing Mixer)**: Console (Slider 4) selects the summing console model. Crosstalk (Slider 2) sets summing desk stereo channel leakage.
      - **Tukan Dis-Treasure (Distressor)**: Ratio (Slider 1) selects ratios (0=1:1, 1=2:1, 2=3:1, 3=4:1, 4=6:1, 5=10:1, 6=20:1, 7=Nuke brickwall). Detector Mode (Slider 5) configures sidechain (0=HP filter, 1=Bandpass filter, 2=Link). Audio Mode (Slider 6) sets distortion modes (0=Clean, 1=Dist2 tube-like second harmonics, 2=Dist3 tape-like third harmonics).
      - **Tukan NC76 / NC76B (1176 Compressor)**: Ratio (Slider 1) selects ratios (0=4:1, 1=8:1, 2=12:1, 3=20:1, 4=All-Button/British Mode for heavy drum pumping).
      - **Tukan Lexikan / Lexikan 2 (Lush Reverb)**: Mode/Algorithm (Slider 0) sets reverb styles (0=Plate, 1=Room, 2=Hall, 3=Cathedral). Pre-Delay (Slider 2) is fully automatable.
      - **Tukan EQT-1A (Pultec EQ)**: Simultaneous Low Boost (Slider 1) and Low Cut (Slider 2) at the same Low Freq (Slider 0) produces the famous Pultec Low-End Trick for deep yet clean bass.
      - **Tukan Deesser**: Mode (Slider 0) selects detection method (0=Wideband, 1=Split-band).
      - **Tukan Compressor 2**: Knee (Slider 3) sets soft-knee curve width in dB. Sidechain (Slider 7) configures detector routing.
      ==================================================

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
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
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
    You MUST provide the 'instruments' array with AT LEAST 3 DISTINCT "REAL" instruments (e.g., synths, pianos, guitars, strings). 
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
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    ${ADVANCED_MIDI_PROMPT}
  `;
  const multiBandInstruction = getMultiBandInstruction(isMultiBandMode);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt + multiBandInstruction + getSchemaInstruction() }] },
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
    throw new Error(`Format error in getSongBeatRecommendations. Details: ${e.message || e}\nRaw: ${typeof jsonStr !== 'undefined' ? jsonStr.substring(0, 500) : "empty"}\nSafety: ${JSON.stringify(response?.candidates?.[0]?.safetyRatings || "none")}`);
  }
  if (isGangstaVox && result.recipes) {
    result.recipes = result.recipes.map((r: any) => ({ ...r, isGangstaVox: true }));
  }
  return result;
};
export const generateVoiceover = async (text: string, bpm?: number | null): Promise<{ base64: string, mimeType: string }> => {
  const ai = getAI();
  const tempoInstructions = bpm ? `The instrumental beat is exactly ${bpm} BPM. You MUST time your syllables and rhythmic flow to land perfectly on tempo to this ${bpm} BPM beat at a NORMAL, standard playback speed.` : "Provide a natural Houston style cadence at a normal tempo.";
  const prompt = `Say this text in a natural, smooth, melodic Houston rap cadence at a NORMAL TEMPO (like a professional studio recording by Z-Ro, but DO NOT say your name or mention Z-Ro). DO NOT slow it down, DO NOT chop and screw it. Keep it clear and at standard speed. \n${tempoInstructions}\n\n${text}`;
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
export const analyzeInstrumental = async (audioBase64: string, mimeType: string): Promise<{ bpm: number, loopStart: number }> => {
  const ai = getAI();
  const prompt = "Analyze this instrumental track. Identify its exact BPM (Tempo) and the exact start time (in seconds) of the clearest, most loopable 4-bar or 8-bar section. Output a JSON object with two fields: 'bpm' (a number, the tempo) and 'loopStart' (a number, the start time in seconds). Do not include any other text.";
  const data = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }, { inlineData: { data: audioBase64, mimeType } }] }],
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
export const getAudioBeatRecommendations = async (plugins: VSTPlugin[], audioBase64: string | null, audioUrl: string | null, mimeType: string, analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, userContext: string = "", geminiFileUri: string | null = null, language: string = 'en', isMultiBandMode: boolean = false, isJsfxMode: boolean = false, installedJsfxPacks: string[] = []): Promise<RecommendationResponse> => {
  const ai = getAI();
  // Limit plugin list to 50 most relevant to avoid context/complexity limits
  const limitedPlugins = plugins.slice(0, 50);
  const pluginListStr = limitedPlugins.map(p => `${p.vendor} - ${p.name} (${p.type})`).join('\n');
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `\nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You MUST prioritize using these plugins in your recipes whenever possible:\n${starredPlugins.join(', ')}` : '';
  const hasSphereMic = analogHardware.some(h => ['Sphere DLX', 'Sphere LX', 'L22'].includes(h.name) || h.name.toLowerCase() === 'l22' || h.name.toLowerCase().includes('townsend'));
  const sphereMicStr = hasSphereMic ? `\nCRITICAL: The user owns a Universal Audio Sphere (DLX/LX) or Townsend Labs L22 microphone. If the recipe involves a vocal tracking chain, you MUST assign the 'UAD Sphere Mic Collection', 'Ocean Way Mic Collection', or 'Bill Putnam Mic Collection' plugin as the VERY FIRST insert plugin on the vocal channel tracking chain. You MUST specifically select a mic model inside it based on the vibe searched. After the mic collection plugin, you can add up to 3 more plugins.` : '';
  const contextStr = userContext ? `\nCRITICAL USER CONTEXT: The user has provided the following information about their track and goals. You MUST incorporate this into your analysis and advice ALWAYS, IT IS THE MOST IMPORTANT INSTRUCTION. Your suggestions MUST explicitly align with and aim to achieve these exact goals, and NOT ruin the mix/volume:\n"${userContext}"\n` : "";
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

      ==================================================
      💡 RELEARNED JSFX & EEL2 AUTOMATION DIRECTIVES (TUKAN & JSFX CLONES) 💡
      Many JSFX have dropdowns, toggles, or buttons rendered on their custom graphical GUIs.
      In REAPER, these custom GUI interactions map directly to standard, automatable REAPER sliders. 
      You MUST utilize these slider mappings to automate complex internal parameters, modes, and configurations:
      - **JClones AC1 (Analog Channel)**: Mode (Slider 8) selects console saturation curves (0 = Classic warm analog, 1 = Modern aggressive). Auto Gain (Slider 2) automatically compensates loudness as drive increases (0 = Off, 1 = On).
      - **JClones AC2 (Tape Emulator)**: Model (Slider 5) sets tape formulation physics (0=Swiss Studer high-fidelity, 1=Japan-O Otari warm, 2=USA-M MCI classic, 3=USA-A Ampex aggressive, 4=Japan-S Sony pristine, 5=Japan-T Tascam vintage). Speed (Slider 8) sets IPS (0=7.5 IPS tape saturation with head bump, 1=15 IPS standard tape, 2=30 IPS high-fidelity mastering speed). EQ Type (Slider 9) selects equalization curves (0=IEC-1 warm/vintage, 1=IEC-2@crisp mid-high emphasis). Tape (Slider 10) chooses tape types (0=Modern hi-fi, 1=Vintage saturated).
      - **JClones CA2A (Optical Compressor)**: Mode (Slider 2) toggles compression knee (0=Compress soft-knee, 1=Limit hard limiting). Opto Cell (Slider 4) selects release kinetics behavior (0=Classic slow analog multi-stage release, 1=Fast rapid digital-style release). R37 (Slider 3) adjusts high-frequency emphasis for the sidechain (0=Flat detection, 1=Heavy HF attenuation for de-essing).
      - **JClones CL1B (Tube Compressor)**: Attack/Release Select (Slider 4) selects speed models (0=Manual fully adjustable, 1=Preset fixed times, 2=Combined program-dependent dynamic recovery).
      - **JClones OInflator (Oxford Inflator)**: Clip (Slider 3) enables 0dB ceiling clipping for tube-style warm distortion (0=Off, 1=On). BandSplit (Slider 4) splits processing (0=Single-band full range, 1=Three-band split).
      - **JClones Molot (Vintage Compressor)**: Mode (Slider 5) selects tube topology modes (0=Sigma fast, 1=Alpha warm character). Filter (Slider 8) configures sidechain highpass filter.
      - **JClones RS124 (Vintage Tube Compressor)**: Speed (Slider 3) selects release recovery profiles (0=Slow, 1=Medium, 2=Fast).
      - **Tukan SumChannel (Channel Strip)**: Console (Slider 5) emulates console desks (0=A-type punchy American, 1=N-type fat British warm, 2=SSL precise & transparent console). Noise (Slider 4) adds console noise floor (0=Off, 1=On).
      - **Tukan SumThing (Summing Mixer)**: Console (Slider 4) selects the summing console model. Crosstalk (Slider 2) sets summing desk stereo channel leakage.
      - **Tukan Dis-Treasure (Distressor)**: Ratio (Slider 1) selects ratios (0=1:1, 1=2:1, 2=3:1, 3=4:1, 4=6:1, 5=10:1, 6=20:1, 7=Nuke brickwall). Detector Mode (Slider 5) configures sidechain (0=HP filter, 1=Bandpass filter, 2=Link). Audio Mode (Slider 6) sets distortion modes (0=Clean, 1=Dist2 tube-like second harmonics, 2=Dist3 tape-like third harmonics).
      - **Tukan NC76 / NC76B (1176 Compressor)**: Ratio (Slider 1) selects ratios (0=4:1, 1=8:1, 2=12:1, 3=20:1, 4=All-Button/British Mode for heavy drum pumping).
      - **Tukan Lexikan / Lexikan 2 (Lush Reverb)**: Mode/Algorithm (Slider 0) sets reverb styles (0=Plate, 1=Room, 2=Hall, 3=Cathedral). Pre-Delay (Slider 2) is fully automatable.
      - **Tukan EQT-1A (Pultec EQ)**: Simultaneous Low Boost (Slider 1) and Low Cut (Slider 2) at the same Low Freq (Slider 0) produces the famous Pultec Low-End Trick for deep yet clean bass.
      - **Tukan Deesser**: Mode (Slider 0) selects detection method (0=Wideband, 1=Split-band).
      - **Tukan Compressor 2**: Knee (Slider 3) sets soft-knee curve width in dB. Sidechain (Slider 7) configures detector routing.
      ==================================================

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
    ${getLanguageInstruction(language)}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    ${audioUrl ? `The main audio file is available at this URL: ${audioUrl}. Please fetch and analyze it.` : "The main audio file is provided as inline data."}
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
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    ${ADVANCED_MIDI_PROMPT}
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
    ${getLanguageInstruction(language)}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    ${audioUrl ? `The main audio file is available at this URL: ${audioUrl}. Please fetch and analyze it.` : "The main audio file is provided as inline data."}
    Ensure the recipe captures the signature sound, instrumentation, and mixing techniques heard in the audio.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific beat type.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.
    You MUST provide the 'instruments' array with AT LEAST 3 DISTINCT "REAL" instruments (e.g., synths, pianos, guitars, strings). 
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
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    ${ADVANCED_MIDI_PROMPT}
  `;
  const schemaObject = {
    type: Type.OBJECT,
    properties: {
      recipes: {
        type: Type.ARRAY,
        items: getUnifiedRecipeSchema(),
        minItems: 1
      }
    },
    required: ["recipes"]
  };
  prompt += `\n\nCRITICAL: You MUST return a valid JSON object. Your JSON object MUST exactly adhere to the following JSON Schema structure (do NOT deviate):\n${JSON.stringify(schemaObject, null, 2)}`;
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
  } else {
    throw new Error("No audio file provided for analysis (Beat).");
  }
  const multiBandInstruction = getMultiBandInstruction(isMultiBandMode);
  parts.push({ text: prompt + multiBandInstruction });
  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Use Pro for complex audio analysis
      contents: {
        parts: parts
      },
      config: {
        customAction: 'audio_analysis_recipe',
        responseMimeType: "application/json", responseSchema: schemaObject, safetySettings: [
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
    throw new Error(`Format error in getAudioBeatRecommendations. Details: ${e.message || e}\nRaw: ${typeof jsonStr !== 'undefined' ? jsonStr.substring(0, 500) : "empty"}\nSafety: ${JSON.stringify(response?.candidates?.[0]?.safetyRatings || "none")}`);
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
  starredPlugins: string[] = []
): Promise<any> => {
  const ai = getAI();
  const pluginListStr = plugins.map(p => {
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
  let focusInstruction = "";
  if (isMasterMode) {
    if (hasStems && uploadedStems && uploadedStems.length > 0) {
      focusInstruction = `Focus specifically on STEM MASTERING / MASTER BUS options to achieve a highly polished, cohesive final master. The user HAS UPLOADED STEMS. Provide suggestions on how to pre-process these stems (such as EQ carving, group compression, and gentle transient balancing) AND how to configure the final central MASTER BUS chain (Master EQ, glue compression, tape saturation, limiting, and stereo width) to achieve a supreme master with maximum weight, punch, and clarity, while avoiding muddy overlaps. Listen to the ENTIRE duration of the files to understand the dynamic peaks and make the overall mix cohesive.`;
    } else {
      focusInstruction = `Focus specifically on MASTERING the single stereo mixdown on the MASTER BUS. Provide advice and explicit technical setups for the final MASTER BUS chain (including linear phase EQ, master bus compression, tape saturation, dynamic EQ, stereo imaging, and final limiting) to achieve maximum punch, loudness, warmth, and depth, while preserving transient response. Listen to the ENTIRE duration of the track.`;
    }
  } else if (isGangstaVox) {
    if (hasStems && uploadedStems && uploadedStems.length > 0) {
      focusInstruction = `Focus specifically on the VOCALS in this mix. DO NOT focus on the beat or instruments. The user HAS UPLOADED STEMS. You MUST analyze how these stems sound mixed together, rather than just in isolation. Your primary goal is to ensure all the vocals sound completely cohesive, beautifully crispy, upfront, and loud. Suggest plugins that not only improve tone, but strictly level the vocals correctly so they sit proudly on top of the beat. CRITICAL: NEVER recommend compressor/limiter settings that squash or bury the vocals. ALWAYS recommend corresponding makeup gain or output gain (e.g. +6dB to +12dB or matching fader volumes) so they are perfectly audibly clear. ${isBusMode ? "BUS MODE IS ON: Provide advice on how to group these stems into logical busses (e.g., Lead Bus, Backing Bus, Ad-lib Bus) and how to process those busses collectively, in addition to individual track processing." : "Make sure to listen to the ENTIRE length of the audio files, including any intros, bridges, and outros. Provide advice on how to process each individual stem and how they fit together to improve the overall vocal mix."}`;
    } else {
      focusInstruction = "Focus specifically on the VOCALS in this mix. DO NOT focus on the beat or instruments. Make sure to listen to the ENTIRE length of the song, including any intros, bridges, and outros. Analyze vocal consistency, presence, and processing across the entire song. Ensure the vocal is loud, crisp, and beautifully upfront in the soundstage.";
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
  const contextStr = userContext ? `\nCRITICAL USER CONTEXT: The user has provided the following information about their track and goals. You MUST incorporate this into your analysis and advice ALWAYS, IT IS THE MOST IMPORTANT INSTRUCTION. Your suggestions MUST explicitly align with and aim to achieve these exact goals, and NOT ruin the mix/volume:\n"${userContext}"\n` : "";
  const previousCritiqueStr = previousCritique ? `\nPREVIOUS CRITIQUE CONTEXT: The user is uploading a new version of the track based on a previous critique. Here are the details of the previous critique:\nTitle: ${previousCritique.title}\nFeedback: ${previousCritique.overallFeedback}\nStrengths: ${JSON.stringify(previousCritique.strengths)}\nWeaknesses: ${JSON.stringify(previousCritique.weaknesses)}\nAction Plan: ${JSON.stringify(previousCritique.actionPlan)}\n\nPlease analyze the new audio, compare it with the previous critique, and provide further guidance to help the user achieve their desired sound. Focus on what has improved, what still needs work, and suggest further parameter adjustments or new plugins if necessary.\n` : "";
  const referenceTrackStr = referenceTrack ? `\nREFERENCE TRACK: The user wants their mix to sound like this reference track: "${referenceTrack}". Please provide a guide for the critiqued MP3 to sound as accurately as possible like this reference track. If the reference track is a known song, use your knowledge to compare the sonic characteristics. If it's a URL, try to understand the context.\n` : "";
  const languageInstruction = getLanguageInstruction(language);

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
      
      ==================================================
      💡 RELEARNED JSFX & EEL2 AUTOMATION DIRECTIVES (TUKAN & JSFX CLONES) 💡
      Many JSFX have dropdowns, toggles, or buttons rendered on their custom graphical GUIs.
      In REAPER, these custom GUI interactions map directly to standard, automatable REAPER sliders. 
      You MUST utilize these slider mappings to automate complex internal parameters, modes, and configurations:
      - **JClones AC1 (Analog Channel)**: Mode (Slider 8) selects console saturation curves (0 = Classic warm analog, 1 = Modern aggressive). Auto Gain (Slider 2) automatically compensates loudness as drive increases (0 = Off, 1 = On).
      - **JClones AC2 (Tape Emulator)**: Model (Slider 5) sets tape formulation physics (0=Swiss Studer high-fidelity, 1=Japan-O Otari warm, 2=USA-M MCI classic, 3=USA-A Ampex aggressive, 4=Japan-S Sony pristine, 5=Japan-T Tascam vintage). Speed (Slider 8) sets IPS (0=7.5 IPS tape saturation with head bump, 1=15 IPS standard tape, 2=30 IPS high-fidelity mastering speed). EQ Type (Slider 9) selects equalization curves (0=IEC-1 warm/vintage, 1=IEC-2@crisp mid-high emphasis). Tape (Slider 10) chooses tape types (0=Modern hi-fi, 1=Vintage saturated).
      - **JClones CA2A (Optical Compressor)**: Mode (Slider 2) toggles compression knee (0=Compress soft-knee, 1=Limit hard limiting). Opto Cell (Slider 4) selects release kinetics behavior (0=Classic slow analog multi-stage release, 1=Fast rapid digital-style release). R37 (Slider 3) adjusts high-frequency emphasis for the sidechain (0=Flat detection, 1=Heavy HF attenuation for de-essing).
      - **JClones CL1B (Tube Compressor)**: Attack/Release Select (Slider 4) selects speed models (0=Manual fully adjustable, 1=Preset fixed times, 2=Combined program-dependent dynamic recovery).
      - **JClones OInflator (Oxford Inflator)**: Clip (Slider 3) enables 0dB ceiling clipping for tube-style warm distortion (0=Off, 1=On). BandSplit (Slider 4) splits processing (0=Single-band full range, 1=Three-band split).
      - **JClones Molot (Vintage Compressor)**: Mode (Slider 5) selects tube topology modes (0=Sigma fast, 1=Alpha warm character). Filter (Slider 8) configures sidechain highpass filter.
      - **JClones RS124 (Vintage Tube Compressor)**: Speed (Slider 3) selects release recovery profiles (0=Slow, 1=Medium, 2=Fast).
      - **Tukan SumChannel (Channel Strip)**: Console (Slider 5) emulates console desks (0=A-type punchy American, 1=N-type fat British warm, 2=SSL precise & transparent console). Noise (Slider 4) adds console noise floor (0=Off, 1=On).
      - **Tukan SumThing (Summing Mixer)**: Console (Slider 4) selects the summing console model. Crosstalk (Slider 2) sets summing desk stereo channel leakage.
      - **Tukan Dis-Treasure (Distressor)**: Ratio (Slider 1) selects ratios (0=1:1, 1=2:1, 2=3:1, 3=4:1, 4=6:1, 5=10:1, 6=20:1, 7=Nuke brickwall). Detector Mode (Slider 5) configures sidechain (0=HP filter, 1=Bandpass filter, 2=Link). Audio Mode (Slider 6) sets distortion modes (0=Clean, 1=Dist2 tube-like second harmonics, 2=Dist3 tape-like third harmonics).
      - **Tukan NC76 / NC76B (1176 Compressor)**: Ratio (Slider 1) selects ratios (0=4:1, 1=8:1, 2=12:1, 3=20:1, 4=All-Button/British Mode for heavy drum pumping).
      - **Tukan Lexikan / Lexikan 2 (Lush Reverb)**: Mode/Algorithm (Slider 0) sets reverb styles (0=Plate, 1=Room, 2=Hall, 3=Cathedral). Pre-Delay (Slider 2) is fully automatable.
      - **Tukan EQT-1A (Pultec EQ)**: Simultaneous Low Boost (Slider 1) and Low Cut (Slider 2) at the same Low Freq (Slider 0) produces the famous Pultec Low-End Trick for deep yet clean bass.
      - **Tukan Deesser**: Mode (Slider 0) selects detection method (0=Wideband, 1=Split-band).
      - **Tukan Compressor 2**: Knee (Slider 3) sets soft-knee curve width in dB. Sidechain (Slider 7) configures detector routing.
      ==================================================

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


  let prompt = `
    You are an expert audio engineer and producer.
    ${jsfxDiktat}
    CRITICAL RULE FOR IMPROVEMENT: The end result MUST ALWAYS be a concrete improvement to the audio. You must apply proper gain staging and makeup gain on every step that involves compression, saturation, or equalization that reduces peak levels. NEVER reduce the overall volume unintentionally.
I am uploading an MP3 of a full song project that needs work.
    ${focusInstruction}
    ${contextStr}
${previousCritiqueStr}
    ${referenceTrackStr}
    ${languageInstruction}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${JSFX_PRIORITY_SPEC_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${ATR102_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    CRITICAL: If the user is asking about guitars, acoustic or electric, or if a stem appears to be a guitar, strongly consider recommending the use of a capo (e.g. on the 2nd to 5th fret) to achieve a brighter, more distinctive playing texture without breaking strings. Reference Johnny Marr, Jingle-Jangle styles, and The Smiths if it fits the genre.
    Analyze the audio and provide a detailed mix critique. Since this is a full song, consider the dynamic changes, song structure (intro, verse, chorus, etc.), and how the mix evolves.
    CRITICAL: You MUST ONLY recommend plugins that are present in this user-owned plugin list. You are STRICTLY FORBIDDEN from suggesting any plugin brand or model that the user does not own. If the list below is non-empty, use only EXACT names or clean substring matches found in the list. Do not recommend generic compressors or EQs (e.g. do not use "CLA-76", "1176", or "Pro-C 2" unless they appear below; instead, look through the list and recommend an actual compressor or EQ the user owns):
    ${pluginListStr}
    The user also has the following hardware and instruments:
    ${hardwareListStr}
    ${hasApollo ? `
    CRITICAL: The user has an ${apolloInst} interface. When suggesting plugins for the action plan, you MUST ALWAYS prioritize UAD (Universal Audio) plugins from their library if they are suitable.
    ` : ''}
    CRITICAL: If a hardware instrument has connected pedals, you MUST provide specific settings for those pedals in your advice. Assume the pedal is connected directly to the instrument. Your research and logic MUST reflect the interaction between the specific instrument and the specific pedal(s) connected to it.
    ${audioUrl ? `The main audio file is available at this URL: ${audioUrl}. Please fetch and analyze it.` : "The main audio file is provided as inline data."}
    ${referenceAudioBase64 ? "The second inline audio file is the reference track. Please analyze both and compare them." : ""}
    Provide (CRITICAL: You MUST ALWAYS guarantee every single real parameter is provided exhaustively, even if it takes longer. You MUST ALWAYS perfectly align with the User Context string. You MUST ALWAYS ensure the resulting settings provide a concrete sonic improvement and NEVER reduce the overall volume unintentionally):
    - 'title': A short title for this critique.
    - 'overallFeedback': A detailed analysis summarizing the current state of the mix, the main areas for improvement, and the overall sonic character.
    - 'strengths': An array of 4-6 specific things that sound good (e.g., specific frequency ranges, dynamic control, spatial imaging).
    - 'weaknesses': An array of 4-6 specific issues that need fixing, categorized by their impact on the mix.
    - 'deviationMetrics': (ONLY IF A REFERENCE TRACK IS PROVIDED): Generate 2-4 analytical deviation metrics comparing the mix analytically to the reference (e.g. Dynamic Range: 2dB narrower than reference, High-end Air: 15% darker).
    - 'actionPlan': A comprehensive array of actionable steps to fix the issues. ${isMasterMode ? `CRITICAL: Since you are in MASTER mode, the action plan MUST focus exclusively on master bus fader / master fader processing elements. Provide 4 sequential mastering-chain steps to apply (e.g., Linear Phase EQ, Master Bus Saturation/Exciter, Vintage or Glue Compressor, Stereo Width/Imaging, and Final Brickwall Limiting/Maximizer). If stems are uploaded, explain stem leveling and routing in these steps, but target them for the collective mix ending on the Master Bus.` : (hasStems && uploadedStems && uploadedStems.length > 0 ? (isMultiBandMode ? `CRITICAL: Because the user uploaded ${uploadedStems.length} stems, you MUST provide EXACTLY one step per stem. For EACH stem's step, provide the multiBandDetails, then provide an adequate number of plugins to handle all the bands.` : `CRITICAL: Because the user uploaded ${uploadedStems.length} stems, you MUST provide EXACTLY one step per stem. For EACH stem's step, you MUST provide EXACTLY 6 plugins in the 'recommendedChain' to provide a complete, pristine, Grammy-award winning JSFX custom layout (1st: surgical subtraction EQ/high-pass, 2nd: vintage analogue FET compressor, 3rd: opto or levelling amplifier, 4th: precise mid-range tonal EQ, 5th: spatial widening/saturation/modulation, and 6th: dedicated high-headroom output volume staging via a tool like JS: Volume/Pan to gain-match completely). The 6th plugin MUST be explicitly dedicated to volume gain-staging, ensuring absolutely no volume loss or signal degradation, making the vocal sit with intense gravity and clarity directly in the face of the listener. Ensure that any compression peak levels reduction is offset by matching makeup gain inside the plugin settings.`) : "For each step, provide a robust chain of plugins (at least 6 plugins).")} For each step, provide:
      - 'targetStem': The exact name of the stem this step applies to (if stems were uploaded).
      - 'issue': The specific problem.
      - 'solution': A detailed technical explanation of how to fix it.
      - 'recommendedChain': A robust chain of plugins from the user's list to use for this fix, with 'name', 'purpose', and 'deepDive' (an array of parameter objects, each with 'parameter', 'value', and 'explanation'). You can also optionally include 'band' and 'routing' properties for multiband or parallel processing.
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
      if (stem.uri && stem.uri.trim() !== '') {
        let uri = stem.uri;
        if (uri.includes('/files/')) {
           const uriParts = uri.split('/files/');
           uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
        } else if (!uri.startsWith('https://')) {
           uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
        }
        let stemMimeType = stem.mimeType || 'audio/mpeg';
        parts.push({ text: `Stem Name: ${stem.name || stem.file?.name || 'Unknown Stem'}` });
        parts.push({ fileData: { fileUri: uri, mimeType: stemMimeType } });
      } else if (stem.base64 && stem.base64.trim() !== '') {
        let stemMimeType = stem.mimeType || 'audio/mpeg';
        parts.push({ text: `Stem Name: ${stem.name || stem.file?.name || 'Unknown Stem'}` });
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
           chunkPrompt += `\n\nCRITICAL MULTI-PART REQUEST: You are analyzing part ${i+1} out of ${chunks.length}. For this phase, ONLY provide action plan steps for the following stems: ${stemNames}. Do NOT provide overall feedback or strengths/weaknesses again (just return simple dummy strings for those fields), but you MUST provide the exhaustive actionPlan array for these specific stems.`;
        } else {
           chunkPrompt += `\n\nCRITICAL MULTI-PART REQUEST: You are analyzing part ${i+1} out of ${chunks.length}. For this phase, provide the comprehensive overall feedback, strengths, weaknesses, AND the exhaustive action plan steps ONLY for the following stems: ${stemNames}.`;
        }
        
        chunkPrompt += `\n\nCRITICAL: You MUST return a valid JSON object EXCLUSIVELY formatted with this exact JSON Schema:\n${JSON.stringify(chunkSchema, null, 2)}`;
        
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
    const finalPrompt = prompt + multiBandInstruction + `\n\nCRITICAL: You MUST return a valid JSON object EXCLUSIVELY formatted with this exact JSON Schema:\n${JSON.stringify(schema, null, 2)}`;
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
      throw new Error(`Format error in getMixCritique. Details: ${e.message || e}\nRaw: ${typeof jsonStr !== 'undefined' ? jsonStr.substring(0, 500) : "empty"}\nSafety: ${JSON.stringify(response?.candidates?.[0]?.safetyRatings || "none")}`);
    }
  }
  result.id = crypto.randomUUID();
  result.isGangstaVox = isGangstaVox;
  result.audioBase64 = audioBase64;
  result.mimeType = mimeType;
  return result;
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
    ${recipeContext ? `Here is the recipe context:\n${recipeContext}\n` : ""}
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
    return JSON.parse(sanitizeJSON(response.text || '{"query": "", "advice": "I\'m sorry, I couldn\'t generate a response.", "recommendedChain": []}'));
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
      if (stem.uri && stem.uri.trim() !== '') {
        let uri = stem.uri;
        if (uri.includes('/files/')) {
           const uriParts = uri.split('/files/');
           uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
        } else if (!uri.startsWith('https://')) {
           uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
        }
        let stemMimeType = stem.mimeType || 'audio/mpeg';
        parts.push({ text: `Stem Name: ${stem.name || stem.file?.name || 'Unknown Stem'}` });
        parts.push({ fileData: { fileUri: uri, mimeType: stemMimeType } });
      } else if (stem.base64 && stem.base64.trim() !== '') {
        let stemMimeType = stem.mimeType || 'audio/mpeg';
        parts.push({ text: `Stem Name: ${stem.name || stem.file?.name || 'Unknown Stem'}` });
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
      vocalChain: parsed.vocalChain || [],
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
          vocalChain: parsed.vocalChain || [],
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
      contents: { parts: [{ text: prompt + "\\n\\nCRITICAL: You MUST return EXACTLY valid JSON matching this schema:\\n" + JSON.stringify(getUnifiedRecipeSchema(), null, 2) }] },
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
      jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
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
      contents: { parts: [{ text: prompt + "\\n\\nCRITICAL: You MUST return a valid JSON object matching this schema exactly:\\n" + JSON.stringify(schema, null, 2) }] },
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
