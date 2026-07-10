export interface XpandFX {
  name: string;
  category: 'Reverbs' | 'Delays' | 'Modulation' | 'Other';
  description: string;
  parameters: {
    name: string;
    description: string;
    typicalRange: string;
    recommendedValue: string;
  }[];
  proTips?: string;
}

export const XPAND_FX_DATABASE: XpandFX[] = [
  // --- REVERBS: HALLS ---
  {
    name: "hall",
    category: "Reverbs",
    description: "Standard concert hall reverb simulation offering high density and rich, lush tails.",
    parameters: [
      { name: "decay", description: "Controls the length of the reverberation tail (measured in seconds).", typicalRange: "0.4 sec to 30.0 sec", recommendedValue: "2.0 sec to 4.0 sec" },
      { name: "bright", description: "Dampens or opens up high frequencies for space brightness (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 60%" }
    ],
    proTips: "Great for lead vocals, lush pads, and atmospheric synth keys to build a sense of immense depth."
  },
  {
    name: "soft hall",
    category: "Reverbs",
    description: "A mellowed version of the hall reverb with softened early reflections and a gentle tail.",
    parameters: [
      { name: "decay", description: "Mellowed reverb tail decay length (measured in seconds).", typicalRange: "0.4 sec to 30.0 sec", recommendedValue: "2.5 sec to 4.5 sec" },
      { name: "bright", description: "Dampens highs heavily to sit warm in the background (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "25% to 40%" }
    ],
    proTips: "Perfect for delicate background vocals and acoustic guitars where you want space without harshness."
  },
  {
    name: "bright hall",
    category: "Reverbs",
    description: "An airy hall reverb with emphasized high-frequency reflections that add a sparkling sheen.",
    parameters: [
      { name: "decay", description: "Sparkling reverb tail decay length (measured in seconds).", typicalRange: "0.4 sec to 30.0 sec", recommendedValue: "1.8 sec to 3.5 sec" },
      { name: "bright", description: "Very little high-frequency cut for maximum top-end sheen (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "75% to 95%" }
    ],
    proTips: "Excellent for adding a luxurious top-end sheen to R&B vocals or clean pop synths."
  },
  {
    name: "predelay hall",
    category: "Reverbs",
    description: "A hall reverb designed specifically with a built-in pre-delay window to preserve transient clarity.",
    parameters: [
      { name: "size", description: "Reverb tail size / decay length (measured in seconds).", typicalRange: "0.4 sec to 30.0 sec", recommendedValue: "2.0 sec to 4.5 sec" },
      { name: "pre del", description: "Pre-delay time separating dry transient and reverb onset (measured in milliseconds).", typicalRange: "0 ms to 250 ms", recommendedValue: "20 ms to 60 ms" }
    ],
    proTips: "Use on heavy rap vocals or snare drums to keep the impact clean before the reverb tail blooms."
  },
  {
    name: "dense hall",
    category: "Reverbs",
    description: "A highly clustered, thick hall reverb with instant build-up of reflections, producing a solid wall of sound.",
    parameters: [
      { name: "decay", description: "Highly concentrated reverb tail decay (measured in seconds).", typicalRange: "0.4 sec to 30.0 sec", recommendedValue: "2.2 sec to 5.0 sec" },
      { name: "bright", description: "Combines high cut with density damping (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "35% to 55%" }
    ],
    proTips: "Use for synth brasses or cinematic pad sounds to glue them together into a unified orchestral wall."
  },

  // --- REVERBS: ROOMS ---
  {
    name: "room",
    category: "Reverbs",
    description: "Simulates a standard-sized acoustic room. Delivers highly realistic, short, structured reflections.",
    parameters: [
      { name: "decay", description: "Short room decay length (measured in seconds).", typicalRange: "0.1 sec to 5.0 sec", recommendedValue: "0.6 sec to 1.5 sec" },
      { name: "bright", description: "Dampens room wall reflections to simulate absorptive materials (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "45% to 65%" }
    ],
    proTips: "Ideal for percussion, acoustic guitars, and vocals that need to sound intimate but present."
  },
  {
    name: "soft room",
    category: "Reverbs",
    description: "A room algorithm designed with highly absorptive wall treatments, creating a damp, soft spatial envelope.",
    parameters: [
      { name: "decay", description: "Damped room decay length (measured in seconds).", typicalRange: "0.1 sec to 5.0 sec", recommendedValue: "0.5 sec to 1.2 sec" },
      { name: "bright", description: "Heavy high roll-off damping for intimate, dry acoustic tracking (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "20% to 35%" }
    ],
    proTips: "Perfect for taking the sterile edge off direct-input instruments without washing them in obvious reverb."
  },
  {
    name: "bright room",
    category: "Reverbs",
    description: "A room with highly reflective hardwood or tiled surfaces, creating sharp, crisp early reflections.",
    parameters: [
      { name: "decay", description: "Reflective live room decay length (measured in seconds).", typicalRange: "0.1 sec to 5.0 sec", recommendedValue: "0.8 sec to 1.8 sec" },
      { name: "bright", description: "Very light damping to emulate highly reflective surfaces like tiles (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "70% to 90%" }
    ],
    proTips: "Gives acoustic drums and guitars an active, 'live' studio feel."
  },
  {
    name: "predelay room",
    category: "Reverbs",
    description: "A room reverb with a defined pre-delay gap to separate dry transients from the room response.",
    parameters: [
      { name: "size", description: "Reverb tail size / decay length (measured in seconds).", typicalRange: "0.1 sec to 5.0 sec", recommendedValue: "0.6 sec to 1.5 sec" },
      { name: "pre del", description: "Pre-delay time to separate transient hits from the room response (measured in milliseconds).", typicalRange: "0 ms to 250 ms", recommendedValue: "10 ms to 35 ms" }
    ],
    proTips: "Excellent on claps and rimshots to keep the initial snap entirely dry before the room sound enters."
  },
  {
    name: "dense room",
    category: "Reverbs",
    description: "A highly concentrated, tight room algorithm that clusters early reflections rapidly to add immediate thickness.",
    parameters: [
      { name: "decay", description: "Highly concentrated room reflections decay (measured in seconds).", typicalRange: "0.1 sec to 5.0 sec", recommendedValue: "0.5 sec to 1.3 sec" },
      { name: "bright", description: "Dampens high-frequency build-up in small packed spaces (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 60%" }
    ],
    proTips: "Works wonderfully to add body and stereo width to thin vocal tracks."
  },

  // --- REVERBS: PLATES ---
  {
    name: "plate",
    category: "Reverbs",
    description: "Simulates vintage physical sheet-metal plate reverbs. Highly dense, bright, and metallic.",
    parameters: [
      { name: "decay", description: "Dense metal sheet plate decay length (measured in seconds).", typicalRange: "0.4 sec to 10.0 sec", recommendedValue: "1.5 sec to 3.0 sec" },
      { name: "bright", description: "Accentuates the characteristic metallic resonance and sheen (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "50% to 70%" }
    ],
    proTips: "The gold standard for snare drums and lead vocals in pop and rock genres."
  },
  {
    name: "soft plate",
    category: "Reverbs",
    description: "A plate reverb with rounded metallic resonances, delivering a smooth, high-density tail without harsh sibilance.",
    parameters: [
      { name: "decay", description: "Smooth metallic plate decay length (measured in seconds).", typicalRange: "0.4 sec to 10.0 sec", recommendedValue: "1.8 sec to 3.2 sec" },
      { name: "bright", description: "Subdues sibilant high frequencies to keep plate tail smooth (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "35% to 50%" }
    ],
    proTips: "Perfect for tracking vocals directly when you want the density of a plate but need to keep 'S' sounds smooth."
  },
  {
    name: "bright plate",
    category: "Reverbs",
    description: "An ultra-reflective, sparkling plate reverb that accentuates top-end air and metallic high frequencies.",
    parameters: [
      { name: "decay", description: "Vibrant plate tail decay length (measured in seconds).", typicalRange: "0.4 sec to 10.0 sec", recommendedValue: "1.2 sec to 2.5 sec" },
      { name: "bright", description: "Preserves maximum top-end metallic sparkle (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "80% to 100%" }
    ],
    proTips: "Makes modern rap ad-libs and hi-hats sound expensive and airy."
  },
  {
    name: "predelay plate",
    category: "Reverbs",
    description: "A plate algorithm featuring a large pre-delay gap to maintain ultimate dry punch before the dense plate tail hits.",
    parameters: [
      { name: "size", description: "Reverb tail size / decay length (measured in seconds).", typicalRange: "0.4 sec to 10.0 sec", recommendedValue: "1.4 sec to 2.8 sec" },
      { name: "pre del", description: "Pre-delay time to let lead vocals/snare transients cut through (measured in milliseconds).", typicalRange: "0 ms to 250 ms", recommendedValue: "15 ms to 50 ms" }
    ],
    proTips: "Ideal for keeping lead vocal transients clear in dense electronic and trap mixes."
  },
  {
    name: "dense plate",
    category: "Reverbs",
    description: "An incredibly fast-building plate simulation that provides instant stereo diffusion and thick spatial support.",
    parameters: [
      { name: "decay", description: "Instant high-diffusion plate decay (measured in seconds).", typicalRange: "0.4 sec to 10.0 sec", recommendedValue: "1.5 sec to 3.5 sec" },
      { name: "bright", description: "Dampens metallic clutter while maintaining rapid stereo width (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "45% to 60%" }
    ],
    proTips: "Excellent on synthetic percussion and sound effects to create instantaneous atmosphere."
  },

  // --- REVERBS: COMBOS & OTHER ---
  {
    name: "cho+rev",
    category: "Reverbs",
    description: "A combination effect running a swirling chorus into a lush hall reverb, creating a wide, celestial space.",
    parameters: [
      { name: "decay", description: "Hall reverb decay length (measured in seconds).", typicalRange: "0.4 sec to 30.0 sec", recommendedValue: "2.5 sec to 5.0 sec" },
      { name: "bright", description: "Modulation rate/intensity and high-frequency open-ness (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "45% to 65%" }
    ],
    proTips: "A go-to for lush ambient pads, retro 80s synths, and background vocal stacks."
  },
  {
    name: "cho+rev soft",
    category: "Reverbs",
    description: "A gentler version of the Chorus-Reverb combo with subdued modulation and a warm, rolled-off high end.",
    parameters: [
      { name: "decay", description: "Soft hall reverb decay length (measured in seconds).", typicalRange: "0.4 sec to 30.0 sec", recommendedValue: "2.0 sec to 4.5 sec" },
      { name: "bright", description: "Subdued chorus modulation rate and heavily filtered high frequencies (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "30% to 45%" }
    ],
    proTips: "Adds beautiful movement to modern electric pianos (EPs) and warm synthesizer keys."
  },
  {
    name: "cho+rev bright",
    category: "Reverbs",
    description: "A vibrant Chorus-Reverb combination designed to sparkle, with fast modulation and maximum high-end clarity.",
    parameters: [
      { name: "decay", description: "Sparkling hall reverb decay length (measured in seconds).", typicalRange: "0.4 sec to 30.0 sec", recommendedValue: "2.2 sec to 4.0 sec" },
      { name: "bright", description: "Fast chorus modulation sweep and wide-open high-frequency spectrum (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "70% to 90%" }
    ],
    proTips: "Gives a gorgeous, expensive shimmer to lead pop synths and bright acoustic guitar groups."
  },
  {
    name: "non-linear",
    category: "Reverbs",
    description: "A gated/non-linear reverb effect that cuts off abruptly, perfect for vintage 80s drum sounds.",
    parameters: [
      { name: "time", description: "Cutoff point duration / gated time window (measured in milliseconds).", typicalRange: "10 ms to 500 ms", recommendedValue: "120 ms to 280 ms" },
      { name: "bright", description: "Dampens high end and adjusts gate envelope density (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "50%" }
    ],
    proTips: "The classic Phil Collins 80s snare trick. Apply heavily on snare tracks and adjust decay to fit the tempo."
  },
  {
    name: "reverse reverb",
    category: "Reverbs",
    description: "A specialized reverb that swells backwards, building in volume before terminating.",
    parameters: [
      { name: "time", description: "Length of the backwards swell curve (measured in seconds).", typicalRange: "0.1 sec to 5.0 sec", recommendedValue: "1.0 sec to 2.5 sec" },
      { name: "bright", description: "High-frequency damping of the reversed tail (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "50% to 70%" }
    ],
    proTips: "Excellent for vocal transitions or lead synth intros. Put it on a separate track and print the swell."
  },
  {
    name: "early reflections",
    category: "Reverbs",
    description: "Focuses exclusively on the immediate first reflections of an acoustic space, creating thickness without long tails.",
    parameters: [
      { name: "time", description: "Duration of the primary reflection envelope (measured in seconds).", typicalRange: "0.05 sec to 2.0 sec", recommendedValue: "0.1 sec to 0.5 sec" },
      { name: "bright", description: "Filters top end of immediate reflection clusters (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "50% to 65%" }
    ],
    proTips: "Use to push any instrument slightly back in the mix or widen mono sounds cleanly."
  },
  {
    name: "drum room",
    category: "Reverbs",
    description: "An acoustic space tailor-made for percussion, capturing short, explosive early reflections.",
    parameters: [
      { name: "decay", description: "Short explosive drum room decay (measured in seconds).", typicalRange: "0.1 sec to 5.0 sec", recommendedValue: "0.4 sec to 1.2 sec" },
      { name: "bright", description: "Dampens harsh high sibilance from cymbals in room (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 55%" }
    ],
    proTips: "Breathe life into static electronic drum kits by routing them to this space."
  },
  {
    name: "club",
    category: "Reverbs",
    description: "Simulates a small-to-mid sized venue or club, with highly complex reflection patterns.",
    parameters: [
      { name: "decay", description: "Intimate small club venue decay (measured in seconds).", typicalRange: "0.1 sec to 5.0 sec", recommendedValue: "0.8 sec to 1.8 sec" },
      { name: "bright", description: "High roll-off simulating carpeted and crowd-filled club acoustics (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "45% to 60%" }
    ],
    proTips: "Fantastic for direct-recorded electric bass and electric guitars to place them 'in a physical room'."
  },
  {
    name: "overheads",
    category: "Reverbs",
    description: "A room shape optimized to replicate the cohesive, airy space captured by drum overhead microphones.",
    parameters: [
      { name: "decay", description: "Cohesive overhead space decay length (measured in seconds).", typicalRange: "0.1 sec to 5.0 sec", recommendedValue: "0.6 sec to 1.4 sec" },
      { name: "bright", description: "Maintains clean high-frequency transient detail for cymbals (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "65% to 80%" }
    ],
    proTips: "Apply on drum bus tracks to give a unified, organic acoustic bond to separate electronic elements."
  },
  {
    name: "stadium",
    category: "Reverbs",
    description: "A gigantic, cavernous reverb that simulates an open-air sports stadium with deep, delayed echo clusters.",
    parameters: [
      { name: "decay", description: "Huge open-air arena decay length (measured in seconds).", typicalRange: "0.4 sec to 30.0 sec", recommendedValue: "5.0 sec to 12.0 sec" },
      { name: "bright", description: "Heavy high cut representing air absorption over distance (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "30% to 45%" }
    ],
    proTips: "Great for big rock drum fills, transitions, or massive cinematic sound design."
  },
  {
    name: "flapper",
    category: "Reverbs",
    description: "A creative, fluttering reverb with a quick series of discrete early reflections that mimic a slap echo.",
    parameters: [
      { name: "decay", description: "Fluttering decay length (measured in seconds).", typicalRange: "0.1 sec to 5.0 sec", recommendedValue: "0.5 sec to 1.5 sec" },
      { name: "bright", description: "Adjusts the brightness and texture of the flutter reflections (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "50% to 70%" }
    ],
    proTips: "Excellent for adding a quirky, vintage vibe to vocals or synth leads."
  },
  {
    name: "close",
    category: "Reverbs",
    description: "An ultra-short, highly damp room simulation designed to place an instrument in a small booth or close space.",
    parameters: [
      { name: "decay", description: "Ultra-short vocal booth decay length (measured in seconds).", typicalRange: "0.1 sec to 5.0 sec", recommendedValue: "0.1 sec to 0.4 sec" },
      { name: "bright", description: "Heavy roll-off damping to keep sounds intimate (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 55%" }
    ],
    proTips: "Perfect for bringing dry synth lines to life while maintaining an extremely close soundstage."
  },
  {
    name: "resonators",
    category: "Reverbs",
    description: "Combines short comb-filter delays with a tight reverb to produce a distinctive metallic, tuned resonance.",
    parameters: [
      { name: "decay", description: "Ringing feedback decay length (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 65%" },
      { name: "bright", description: "Frequency damping of the comb-filter feedback nodes (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "45% to 60%" }
    ],
    proTips: "An incredible tool for sound design. Turn up resonance to make drums ring like a robotic tuned synth."
  },

  // --- DELAYS ---
  {
    name: "delay",
    category: "Delays",
    description: "A clean, high-fidelity mono digital delay that syncs perfectly to your DAW project tempo.",
    parameters: [
      { name: "delay", description: "Tempo-synced delay division selection (synchronized to notes, e.g. 1/4, 1/8).", typicalRange: "1/64 to 1/1", recommendedValue: "1/4 or 1/8" },
      { name: "fbk", description: "Adjusts feedback level to control repeat count (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "30% to 50%" }
    ],
    proTips: "The perfect workhorse delay. Lower feedback levels help repeats sit naturally behind dry vocals."
  },
  {
    name: "lofi delay",
    category: "Delays",
    description: "A gritty, vintage-style delay that heavily degrades and saturates repeats over time.",
    parameters: [
      { name: "delay", description: "Tempo-synced delay division selection (synchronized to notes, e.g. 1/4, 1/8).", typicalRange: "1/64 to 1/1", recommendedValue: "1/8" },
      { name: "fbk", description: "Controls saturated, degraded repeat feedback (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 55%" }
    ],
    proTips: "Excellent for lo-fi hip-hop vocals, dusty guitar lines, and sound design elements."
  },
  {
    name: "stereo delay",
    category: "Delays",
    description: "A dual-channel delay offering independent delay settings for the left and right audio channels.",
    parameters: [
      { name: "delay", description: "Stereo delay offset division selection (synchronized to notes, e.g. 1/4, 1/8).", typicalRange: "1/64 to 1/1", recommendedValue: "1/8 (Left) & 1/4 (Right)" },
      { name: "fbk", description: "Adjusts cross-feedback repeat intensity (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "35% to 50%" }
    ],
    proTips: "Offset the left and right delay times (e.g. 1/8 and 1/4) to create amazing stereo rhythmic patterns."
  },
  {
    name: "lofi stereo delay",
    category: "Delays",
    description: "A dual-channel delay with bitcrushing and frequency band-pass filtering applied to repeats.",
    parameters: [
      { name: "delay", description: "Tempo-synced stereo delay division (synchronized to notes, e.g. 1/4, 1/8).", typicalRange: "1/64 to 1/1", recommendedValue: "1/8 (Left) & 1/8D (Right)" },
      { name: "fbk", description: "Bit-crushed and band-pass filtered feedback multiplier (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "35% to 45%" }
    ],
    proTips: "Adds beautiful lo-fi stereo movement to direct-input synths or ambient guitar loops."
  },
  {
    name: "pingpong",
    category: "Delays",
    description: "A classic ping-pong delay that bounces repeats back and forth across the stereo field.",
    parameters: [
      { name: "delay", description: "Tempo-synced panning bounce delay division (synchronized to notes, e.g. 1/4, 1/8).", typicalRange: "1/64 to 1/1", recommendedValue: "1/8 or 1/4" },
      { name: "fbk", description: "Bouncing repeat feedback decay level (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 50%" }
    ],
    proTips: "Perfect on vocal ad-libs, sound effect sweeps, and plucky synth lines."
  },
  {
    name: "lofi pingpong",
    category: "Delays",
    description: "A wide, ping-pong delay that introduces tape warmth and low-fi crunch to each panning bounce.",
    parameters: [
      { name: "delay", description: "Tempo-synced panning bounce delay division (synchronized to notes, e.g. 1/4, 1/8).", typicalRange: "1/64 to 1/1", recommendedValue: "1/8" },
      { name: "fbk", description: "Saturated bouncing repeat feedback with tape crunch (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "35% to 45%" }
    ],
    proTips: "Incredible on synthetic plucks to keep them moving dynamically across the stereo field."
  },
  {
    name: "gallop echo",
    category: "Delays",
    description: "A multi-tap delay designed to create energetic 'galloping' triplet repeat structures.",
    parameters: [
      { name: "delay", description: "Base galloping delay sync division (synchronized to notes, e.g. 1/4, 1/8).", typicalRange: "1/64 to 1/1", recommendedValue: "1/8" },
      { name: "fbk", description: "Gallop pattern multi-tap feedback level (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 55%" }
    ],
    proTips: "Excellent for adding a driving, energetic rhythmic groove to lead acoustic guitars."
  },
  {
    name: "tape echo",
    category: "Delays",
    description: "Emulates vintage analog magnetic tape delay units. Includes subtle pitch modulation (wow & flutter).",
    parameters: [
      { name: "delay", description: "Tape speed note division selection (wow & flutter enabled, synchronized to notes, e.g. 1/4, 1/8).", typicalRange: "1/64 to 1/1", recommendedValue: "1/4 or 1/8" },
      { name: "fbk", description: "Warm, saturated feedback repeat level (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 55%" }
    ],
    proTips: "Adds vintage soul and analog warmth to modern digital vocal or key performances."
  },
  {
    name: "ducking delay",
    category: "Delays",
    description: "A smart delay that compresses its own repeats when dry audio plays, keeping dry transients fully clear.",
    parameters: [
      { name: "delay", description: "Tempo-synced delay division selection (synchronized to notes, e.g. 1/4, 1/8).", typicalRange: "1/64 to 1/1", recommendedValue: "1/4" },
      { name: "fbk", description: "Feedback repeat level that attenuates when dry signal is present (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "45% to 60%" }
    ],
    proTips: "A modern pop vocal classic. Repeats only bloom when the singer pauses, keeping the main delivery perfectly clean."
  },
  {
    name: "cloud delay",
    category: "Delays",
    description: "A highly diffused delay algorithm that blends multi-tap reflections into a soft, cloud-like ambient pad.",
    parameters: [
      { name: "delay", description: "Tempo-synced delay division selection (synchronized to notes, e.g. 1/4, 1/8).", typicalRange: "1/64 to 1/1", recommendedValue: "1/2" },
      { name: "fbk", description: "Feedback diffusion rate creating smooth atmospheric clouds (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "65% to 80%" }
    ],
    proTips: "Perfect for creating celestial soundscapes from simple, short guitar or synth notes."
  },
  {
    name: "chaos delay",
    category: "Delays",
    description: "A delay that introduces random pitch fluctuations and unstable feedback loops for wild, unpredictable tails.",
    parameters: [
      { name: "delay", description: "Tempo-synced delay division selection (synchronized to notes, e.g. 1/4, 1/8).", typicalRange: "1/64 to 1/1", recommendedValue: "1/8" },
      { name: "fbk", description: "Feedback level for unstable, pitch-modulated repeat loops (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "35% to 45%" }
    ],
    proTips: "Perfect for adding chaotic texture, transitions, or psychedelic depth to modern electronic music."
  },

  // --- MODULATION ---
  {
    name: "chorus",
    category: "Modulation",
    description: "A classic chorus processor that detunes and modulates signals to add immense width, lushness, and movement.",
    parameters: [
      { name: "rate", description: "Speed of pitch modulation (measured in Hertz).", typicalRange: "0.10 Hz to 10.00 Hz", recommendedValue: "1.50 Hz to 3.20 Hz" },
      { name: "depth", description: "Intensity of the chorus detuning effect (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 60%" }
    ],
    proTips: "Great for converting direct mono synths, bass guitar, and backing vocal groups into wide stereo assets."
  },
  {
    name: "rich chorus",
    category: "Modulation",
    description: "A multi-voice chorus with varied delay offsets, delivering an ultra-smooth, creamy stereo spread.",
    parameters: [
      { name: "rate", description: "Modulation speed of multi-voice chorus (measured in Hertz).", typicalRange: "0.10 Hz to 10.00 Hz", recommendedValue: "1.20 Hz to 2.80 Hz" },
      { name: "depth", description: "Detune spread intensity of multi-voice chorus (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "55% to 75%" }
    ],
    proTips: "Makes digital synthesizers sound thick, organic, and expensive."
  },
  {
    name: "ensemble",
    category: "Modulation",
    description: "Replicates classic vintage string ensemble modulation. Imparts a thick, swirling, organic quality.",
    parameters: [
      { name: "rate", description: "Swirling LFO speed of string ensemble (measured in Hertz).", typicalRange: "0.10 Hz to 10.00 Hz", recommendedValue: "2.00 Hz to 4.50 Hz" },
      { name: "depth", description: "Stereo expansion and depth of ensemble (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "60% to 80%" }
    ],
    proTips: "A must-use on dry synth string patches to instantly achieve lush 70s analog character."
  },
  {
    name: "space chorus",
    category: "Modulation",
    description: "Replicates legendary Roland Dimension-style choruses. Offers extremely subtle detuning with wide stereo spacing.",
    parameters: [
      { name: "rate", description: "Slow space-chorus modulation speed (measured in Hertz).", typicalRange: "0.10 Hz to 10.00 Hz", recommendedValue: "0.40 Hz to 1.20 Hz" },
      { name: "depth", description: "Subtle detuning width and spaciousness (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 55%" }
    ],
    proTips: "Incredible on modern lead vocals to widen them without sounding obviously chorused or hollow."
  },
  {
    name: "quad chorus",
    category: "Modulation",
    description: "A powerful four-tap chorus offering complex, overlapping modulation loops.",
    parameters: [
      { name: "rate", description: "Modulation speed of the four-tap sweep (measured in Hertz).", typicalRange: "0.10 Hz to 10.00 Hz", recommendedValue: "1.00 Hz to 2.50 Hz" },
      { name: "depth", description: "Modulation depth of the four-tap sweep (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "45% to 65%" }
    ],
    proTips: "Ideal for heavy sound-design projects to completely transform simple waves into massive textures."
  },
  {
    name: "voice mod",
    category: "Modulation",
    description: "A specialized chorus/delay designed specifically to add thick vocal doubling and light unison texture.",
    parameters: [
      { name: "rate", description: "Vocal doubler modulation speed (measured in Hertz).", typicalRange: "0.10 Hz to 10.00 Hz", recommendedValue: "0.50 Hz to 1.80 Hz" },
      { name: "depth", description: "Vocal doubler delay offset depth (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "40% to 60%" }
    ],
    proTips: "Use on background backing vocal stems to create a huge, expansive wall of vocal layers."
  },
  {
    name: "phase",
    category: "Modulation",
    description: "A classic 4-stage phaser that sweeping-filters the signal, creating a nostalgic vintage swirl.",
    parameters: [
      { name: "rate", description: "Speed of the 4-stage phaser LFO sweep (measured in Hertz).", typicalRange: "0.10 Hz to 10.00 Hz", recommendedValue: "0.80 Hz to 2.40 Hz" },
      { name: "depth", description: "Phaser filter notch sweep depth (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "50% to 70%" }
    ],
    proTips: "The classic choice for Rhodes EPs and psychedelic guitar solos."
  },
  {
    name: "bi-phase",
    category: "Modulation",
    description: "A dual-channel, 12-stage phaser with sweeping notch filters, producing deep, complex liquid movement.",
    parameters: [
      { name: "rate", description: "Speed of the dual 12-stage phaser sweep (measured in Hertz).", typicalRange: "0.10 Hz to 10.00 Hz", recommendedValue: "0.50 Hz to 1.80 Hz" },
      { name: "depth", description: "Phaser sweep width and depth (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "60% to 80%" }
    ],
    proTips: "Excellent for creating dramatic, slow-moving filter sweeps on synth keys and pads."
  },
  {
    name: "deep phaser",
    category: "Modulation",
    description: "An intense, high-stage phaser that delivers maximum phase notch depth for aggressive, heavy sweeping.",
    parameters: [
      { name: "rate", description: "Aggressive high-stage phaser LFO speed (measured in Hertz).", typicalRange: "0.10 Hz to 10.00 Hz", recommendedValue: "1.20 Hz to 3.00 Hz" },
      { name: "depth", description: "Phase notch depth and feedback (measured in percentage).", typicalRange: "0% to 100%", recommendedValue: "70% to 90%" }
    ],
    proTips: "Adds a powerful, space-age dynamic sweep to heavy electric guitars and electronic sound FX."
  },
  {
    name: "flanger",
    category: "Modulation",
    description: "A jet-plane sweeping flanger using short modulated delays and heavy resonant feedback loops.",
    parameters: [
      { name: "rate", description: "Modulated comb-filter sweep speed (measured in Hertz).", typicalRange: "0.10 Hz to 10.00 Hz", recommendedValue: "0.40 Hz to 1.80 Hz" },
      { name: "fbk", description: "Resonant flanger feedback level (measured in percentage).", typicalRange: "-100% to 100%", recommendedValue: "50% to 75%" }
    ],
    proTips: "Apply on drum stems or synth leads during a build-up, automating the mix to peak just before the drop."
  },

  // --- OTHER ---
  {
    name: "detune",
    category: "Other",
    description: "Slightly pitch-shifts and offsets the left and right signals to create wide vocal and instrument sounds.",
    parameters: [
      { name: "detune", description: "Micro-pitch detuning amount (measured in cents).", typicalRange: "-50 cents to +50 cents", recommendedValue: "-15 cents to +15 cents" },
      { name: "delay", description: "Stereo delay separation offset (measured in milliseconds).", typicalRange: "0.1 ms to 100.0 ms", recommendedValue: "10.0 ms to 35.0 ms" }
    ],
    proTips: "A modern pop producer secret. Use on dry lead vocals to create a wide, solid wall of sound without using obvious chorus."
  },
  {
    name: "pitch shift",
    category: "Other",
    description: "A high-fidelity pitch shifter to dynamically pitch-shift input signals up or down by semitones.",
    parameters: [
      { name: "pitch", description: "Coarse pitch-shifting offset (measured in semitones).", typicalRange: "-12 semi to +12 semi", recommendedValue: "-12 semi or +12 semi" },
      { name: "fine", description: "Fine-tuning pitch offset (measured in cents).", typicalRange: "-50 cents to +50 cents", recommendedValue: "-10 cents to +10 cents" }
    ],
    proTips: "Great for creating octave harmonies on ad-libs, or tuning drum hits to match the song key."
  }
];
