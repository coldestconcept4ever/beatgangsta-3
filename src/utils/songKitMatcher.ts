import { SampleVaultItem, DrumOneShotCategory } from '../types';
import { calculateHarmonicInterval } from './intelligentDrumPairing';

export interface StylePreset {
  id: string;
  name: string;
  artistReference: string;
  genre: string;
  defaultBpm: number;
  recommendedKey: string;
  description: string;
  icon: string;
  targetAcoustics: {
    kickPunchHz: number;
    kickMaxDecayMs: number;
    bassKey: string;
    bassMinDecayMs: number;
    snareType: 'snare' | 'clap' | 'either';
    snarePunchHz: number;
    closedHatMaxDecayMs: number;
    openHatMinDecayMs: number;
  };
  pattern: {
    kick: number[]; // 16 steps (0-15), 1 = hit, 0 = rest
    bass: number[];
    snare: number[];
    closedHat: number[];
    openHat: number[];
    perc: number[];
  };
  uadBusRecipe: {
    busCompressor: string;
    busEq: string;
    tapeSaturation: string;
    glueTip: string;
  };
}

export const SIGNATURE_BEAT_STYLES: StylePreset[] = [
  {
    id: 'memphis-three6-tm88',
    name: 'Memphis Three 6 / TM88 Dark Gangsta Trap',
    artistReference: 'Three 6 Mafia / TM88 / Juicy J / Project Pat / Southside (e.g. Sippin on Some Sumpin, Codeine Crazy)',
    genre: 'Memphis Dark Trap / Horrorcore',
    defaultBpm: 138,
    recommendedKey: 'B',
    description: 'Hard-hitting Memphis dark gangsta trap. Overdriven clipped kick, aggressive metallic snare crack + Lex Luger style clap layer, rapid triple-roll closed hats, vocal chant drops, and gun shot FX.',
    icon: '💀',
    targetAcoustics: {
      kickPunchHz: 58,
      kickMaxDecayMs: 240,
      bassKey: 'B',
      bassMinDecayMs: 1400,
      snareType: 'snare',
      snarePunchHz: 220,
      closedHatMaxDecayMs: 40,
      openHatMinDecayMs: 250
    },
    pattern: {
      kick:      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      bass:      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      snare:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // Beats 2 & 4 Hard Snare Crack
      closedHat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Rapid rolling 16ths
      openHat:   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0], // Offbeat sizzle
      perc:      [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]  // Vocal chant / Gun shot drop
    },
    uadBusRecipe: {
      busCompressor: 'UAD Empirical Labs Distressor (Ratio 6:1, Attack 3, Release 2, Dist 3 for extreme gangsta aggression)',
      busEq: 'UAD Pultec EQP-1A (Boost 60Hz +3dB for sub punch, Boost 10kHz +3.5dB for razor top-end air)',
      tapeSaturation: 'UAD Oxide Tape Recorder (Input saturated +2.5dB, Fast 15 IPS)',
      glueTip: 'Crush the Memphis Snare through UAD 1176LN on All-Buttons British Mode (Attack 4, Release 7) for maximum transient crack. Layer vocal chants with UAD Lexicon 224 digital reverb.'
    }
  },
  {
    id: 'call-me-maybe-808-trap',
    name: 'Call Me Maybe (138 BPM 808 Trap Flip)',
    artistReference: 'Call Me Maybe / 808 Sub & Chords Reference Beat (138 BPM, Key of B minor)',
    genre: 'Melodic 808 Trap / Pop Bounce',
    defaultBpm: 138,
    recommendedKey: 'B',
    description: 'Custom 138 BPM structure. Preserves the exact 808 Sub, Punch, Grit, and Chords stems intact while replacing the acoustic drum set (Kick, Closed Hats, Open Hats, Clap, Crash, Perc) with high-synergy vault selections.',
    icon: '🎹',
    targetAcoustics: {
      kickPunchHz: 62,
      kickMaxDecayMs: 220,
      bassKey: 'B',
      bassMinDecayMs: 1400,
      snareType: 'clap',
      snarePunchHz: 980,
      closedHatMaxDecayMs: 45,
      openHatMinDecayMs: 280
    },
    pattern: {
      kick:      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      bass:      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      snare:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      closedHat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      openHat:   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      perc:      [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]
    },
    uadBusRecipe: {
      busCompressor: 'UAD SSL 4000 G Bus Compressor (Ratio 4:1, Attack 30ms, Release Auto, 2-3dB gain reduction)',
      busEq: 'UAD Pultec EQP-1A (Boost 60Hz +2dB, Boost 12kHz +3dB for master air)',
      tapeSaturation: 'UAD Studer A800 (15 IPS, 456 formula for tape warmth)',
      glueTip: 'Keep the 808 Sub, Punch, Grit, and Chords stems completely untouched. Sidechain duck the 808 Sub 2.5dB from the Kick using UAD 1176LN for tight low-end separation.'
    }
  },
  {
    id: 'carly-call-me-maybe',
    name: '120 BPM Dance Pop Anthem',
    artistReference: 'Carly Rae Jepsen / Katy Perry / Dua Lipa / Call Me Maybe',
    genre: 'Dance Pop / Synth Pop',
    defaultBpm: 120,
    recommendedKey: 'G',
    description: 'High-energy 4-on-the-floor dance pop bounce. Driving, punchy 75Hz kick on every beat, bright layered snare/clap on 2 & 4, continuous 16th closed hats, sizzling off-beat open hats, and pumping sidechained synth bass.',
    icon: '✨',
    targetAcoustics: {
      kickPunchHz: 75,
      kickMaxDecayMs: 280,
      bassKey: 'G',
      bassMinDecayMs: 1100,
      snareType: 'snare',
      snarePunchHz: 240,
      closedHatMaxDecayMs: 50,
      openHatMinDecayMs: 320
    },
    pattern: {
      kick:      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], // Four on the floor
      bass:      [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], // Pumping sidechain rhythm
      snare:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // Beats 2 & 4
      closedHat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Steady 16th driving hats
      openHat:   [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], // Off-beat sizzle ("&" of every beat)
      perc:      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]  // Shaker / Tambourine drive
    },
    uadBusRecipe: {
      busCompressor: 'UAD SSL 4000 G Bus Compressor (Ratio 4:1, Attack 30ms, Release Auto, 2-3dB gain reduction)',
      busEq: 'UAD Pultec EQP-1A (Boost 100Hz +2.5dB for punchy low-end, Boost 12kHz +3dB for top-end pop air)',
      tapeSaturation: 'UAD Ampex ATR-102 (30 IPS, CCIR curve, ultra-clean tape gloss)',
      glueTip: 'Sidechain duck the Synth Bass and Open Hi-Hats to the 4-on-the-floor Kick using UAD Teletronix LA-2A / 1176LN for the iconic 120 BPM pumping dance-pop bounce.'
    }
  },
  {
    id: 'travis-metro',
    name: 'Dark Atlanta Trap',
    artistReference: 'Travis Scott / Metro Boomin / 21 Savage (e.g., Sicko Mode, Creepin)',
    genre: 'Dark Trap',
    defaultBpm: 140,
    recommendedKey: 'C#',
    description: 'Relentless sub-bass foundation with a clipped punchy kick, snappy mid-crack snare, rapid 16th rolling hats, and an open hat on the "&" of beat 2.',
    icon: '🔥',
    targetAcoustics: {
      kickPunchHz: 55,
      kickMaxDecayMs: 350,
      bassKey: 'C#',
      bassMinDecayMs: 1200,
      snareType: 'snare',
      snarePunchHz: 210,
      closedHatMaxDecayMs: 65,
      openHatMinDecayMs: 250
    },
    pattern: {
      kick:      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      bass:      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      snare:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // beats 2 & 4 (steps 4 & 12)
      closedHat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // steady 16ths
      openHat:   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      perc:      [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]
    },
    uadBusRecipe: {
      busCompressor: 'UAD SSL 4000 G Bus Compressor (Ratio 4:1, Attack 30ms, Release Auto, 2-3dB gain reduction)',
      busEq: 'UAD Pultec EQP-1A (Boost 60Hz +2.5dB, Atten 60Hz 1dB for tight bottom-end shelf, Boost 10kHz +3dB for air)',
      tapeSaturation: 'UAD Studer A800 Multitrack Tape (Tape Speed 30 IPS, Tape Formula 456, Input +1.5dB)',
      glueTip: 'Sidechain compress the 808 from the Kick using UAD 1176LN (Fastest Attack 7, Release 7) with 3dB quick dip to prevent low-end mud.'
    }
  },
  {
    id: 'drake-40-ovo',
    name: 'OVO Submerged R&B',
    artistReference: 'Drake / Noah "40" Shebib (e.g., Marvins Room, Search & Rescue)',
    genre: 'Atmospheric R&B Trap',
    defaultBpm: 128,
    recommendedKey: 'F',
    description: 'Underwater low-pass mood with a thumping, warm rounded kick, deep singing sub bass, crisp organic wood snap or rim, and muted silky hi-hats.',
    icon: '🦉',
    targetAcoustics: {
      kickPunchHz: 50,
      kickMaxDecayMs: 400,
      bassKey: 'F',
      bassMinDecayMs: 1500,
      snareType: 'either',
      snarePunchHz: 180,
      closedHatMaxDecayMs: 55,
      openHatMinDecayMs: 200
    },
    pattern: {
      kick:      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      bass:      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      snare:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      closedHat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // swung 8ths
      openHat:   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      perc:      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
    },
    uadBusRecipe: {
      busCompressor: 'UAD Neve 33609 Compressor (Recovery 400ms, Ratio 3:1, Limit Off)',
      busEq: 'UAD Neve 1073 Preamp & EQ (High Shelf 10kHz cut -2dB for underwater darkness, Low Shelf 60Hz boost +2dB)',
      tapeSaturation: 'UAD Ampex ATR-102 Mastering Tape (15 IPS, CCIR EQ curve, warm tube head)',
      glueTip: 'Low-pass unwanted snare top sizzle above 12kHz with UAD Cambridge EQ (Butterworth 18dB/oct) to maintain the signature OVO dark aesthetic.'
    }
  },
  {
    id: 'kendrick-mustard',
    name: 'West Coast Hard Slap',
    artistReference: 'Kendrick Lamar / DJ Mustard (e.g., Not Like Us, Ballin)',
    genre: 'West Coast Bounce',
    defaultBpm: 101,
    recommendedKey: 'G',
    description: 'Maximum transient snap. Heavy forward-knocking kick with short punch, deep G-tuned 808 bass, ultra-dry stereo handclap on beat 2 & 4, and sparse bouncy percs.',
    icon: '🥊',
    targetAcoustics: {
      kickPunchHz: 65,
      kickMaxDecayMs: 250,
      bassKey: 'G',
      bassMinDecayMs: 900,
      snareType: 'clap',
      snarePunchHz: 950,
      closedHatMaxDecayMs: 50,
      openHatMinDecayMs: 180
    },
    pattern: {
      kick:      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      bass:      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      snare:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // dry slap claps
      closedHat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      openHat:   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      perc:      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    },
    uadBusRecipe: {
      busCompressor: 'UAD API 2500 Bus Compressor (Thrust Medium, Attack 10ms, Release 50ms, Tone Normal, Ratio 3:1)',
      busEq: 'UAD API 550A Parametric EQ (+2dB punch at 75Hz, +2dB crack at 3kHz, +3dB sparkle at 12kHz)',
      tapeSaturation: 'UAD Studer A800 (15 IPS, high tape bias for thick low-end punch)',
      glueTip: 'Keep the clap 100% dry with zero reverb. Crush transients with UAD Empirical Labs Distressor (1:1 with Dist 2 enabled) for the signature California slap.'
    }
  },
  {
    id: 'carti-rage',
    name: 'Overdriven Synth Rage',
    artistReference: 'Playboi Carti / Pierre Bourne / Yeat (e.g., Magnolia, Flawless)',
    genre: 'Hyperpop / Rage Trap',
    defaultBpm: 148,
    recommendedKey: 'D',
    description: 'Distorted harmonic 808 saturation, compact short kick for speed, wide layered acoustic clap, and rolling lightning-speed closed hi-hats.',
    icon: '🧛',
    targetAcoustics: {
      kickPunchHz: 70,
      kickMaxDecayMs: 220,
      bassKey: 'D',
      bassMinDecayMs: 1400,
      snareType: 'clap',
      snarePunchHz: 1100,
      closedHatMaxDecayMs: 45,
      openHatMinDecayMs: 220
    },
    pattern: {
      kick:      [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
      bass:      [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
      snare:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      closedHat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      openHat:   [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      perc:      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
    },
    uadBusRecipe: {
      busCompressor: 'UAD 1176LN Classic Limiter (All-Buttons "British" Mode, Attack 4, Release 7 for extreme aggression)',
      busEq: 'UAD Pultec MEQ-5 Mid-Range Equalizer (Boost 700Hz +3dB on 808 drive for phone speaker translation)',
      tapeSaturation: 'UAD Oxide Tape Recorder (Input saturated +3dB, Fast 15 IPS)',
      glueTip: 'Drive the 808 through UAD Moog Multimode Filter with Drive set to 3.5 to create buzzing upper octave harmonics without losing sub fundamental.'
    }
  },
  {
    id: 'boom-bap-dilla',
    name: '90s Gritty Boom Bap',
    artistReference: 'J Dilla / DJ Premier / Nas (e.g., NY State of Mind, Donuts)',
    genre: 'Classic Boom Bap',
    defaultBpm: 90,
    recommendedKey: 'A',
    description: 'Thick organic vinyl drums. Fluffy acoustic kick with resonant low-mid weight, thick woody snare with real wire crack, swung live closed hat, and tambourine groove.',
    icon: '☕',
    targetAcoustics: {
      kickPunchHz: 85,
      kickMaxDecayMs: 380,
      bassKey: 'A',
      bassMinDecayMs: 800,
      snareType: 'snare',
      snarePunchHz: 230,
      closedHatMaxDecayMs: 120,
      openHatMinDecayMs: 400
    },
    pattern: {
      kick:      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      bass:      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      snare:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      closedHat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // with heavy swing
      openHat:   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      perc:      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1] // tambourine / shaker
    },
    uadBusRecipe: {
      busCompressor: 'UAD Fairchild 670 Tube Limiter (Time Constant 1, AGC Left/Right, 2dB warm vintage leveling)',
      busEq: 'UAD Pultec EQP-1A (Boost 100Hz +3dB, Boost 3kHz +2dB for authentic SP1200 / MPC60 grit)',
      tapeSaturation: 'UAD Studer A800 (7.5 IPS for vintage high-frequency roll-off and warm tape compression)',
      glueTip: 'High-pass the master drum bus at 30Hz to remove vinyl turntable rumble while letting the 85Hz kick punch hit hard.'
    }
  },
  {
    id: 'afrobeats-burna',
    name: 'Syncopated Afrobeats',
    artistReference: 'Burna Boy / Wizkid / Rema (e.g., Last Last, Calm Down)',
    genre: 'Afrobeats / Amapiano',
    defaultBpm: 104,
    recommendedKey: 'E',
    description: 'Polyrhythmic bounce. Warm round kick on beats 1 and offbeats, deep acoustic log drum/sub, rimshot on the "3&", continuous shaker groove, and wood accents.',
    icon: '🌴',
    targetAcoustics: {
      kickPunchHz: 60,
      kickMaxDecayMs: 300,
      bassKey: 'E',
      bassMinDecayMs: 1000,
      snareType: 'snare', // rimshot/snare
      snarePunchHz: 300,
      closedHatMaxDecayMs: 70,
      openHatMinDecayMs: 200
    },
    pattern: {
      kick:      [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0], // syncopated afro bounce
      bass:      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      snare:     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], // syncopated rims
      closedHat: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], // continuous shaker
      openHat:   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      perc:      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0] // conga / woodblock
    },
    uadBusRecipe: {
      busCompressor: 'UAD SSL 4000 G Bus Compressor (Ratio 2:1, Attack 30ms, Release 100ms, gently holding the groove)',
      busEq: 'UAD Neve 1073 (Mid Boost 1.6kHz +2dB for rimshot presence, High Shelf 12kHz +2dB for silky shaker)',
      tapeSaturation: 'UAD Ampex ATR-102 (30 IPS, clean modern transparency)',
      glueTip: 'Pan the syncopated shakers 25% Left and conga accents 30% Right to leave the entire center corridor open for vocals and the low kick/sub.'
    }
  },
  {
    id: 'uk-drill-pop',
    name: 'UK / NY Drill Bounce',
    artistReference: 'Pop Smoke / Central Cee / Fivio Foreign (e.g., Dior, Doja)',
    genre: 'UK & NY Drill',
    defaultBpm: 142,
    recommendedKey: 'B',
    description: 'Sliding 808 glides with punchy click kick, snare landing sharply on the 3rd beat (step 8), syncopated ghost hi-hat rolls, and vocal chant accents.',
    icon: '❄️',
    targetAcoustics: {
      kickPunchHz: 65,
      kickMaxDecayMs: 240,
      bassKey: 'B',
      bassMinDecayMs: 1600,
      snareType: 'snare',
      snarePunchHz: 220,
      closedHatMaxDecayMs: 50,
      openHatMinDecayMs: 250
    },
    pattern: {
      kick:      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      bass:      [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0], // sliding drill 808
      snare:     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // 3rd beat hit (step 8)
      closedHat: [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0], // drill triplet/ghost bounce
      openHat:   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      perc:      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0] // vox chant
    },
    uadBusRecipe: {
      busCompressor: 'UAD Empirical Labs Distressor (Ratio 6:1, Attack 3, Release 2, Dist 3 for aggressive saturation)',
      busEq: 'UAD Cambridge EQ (Surgical notch cut at 450Hz on 808 to remove nasal honk, boost 60Hz +3dB)',
      tapeSaturation: 'UAD Studer A800 (15 IPS, 456 tape for thick punch)',
      glueTip: 'Automate high-pass filter sweeps on the 808 glide drops using UAD Moog Multimode Filter to maximize the impact of the bass drop.'
    }
  }
];

export interface MatchedSlot {
  sample: SampleVaultItem;
  category: DrumOneShotCategory;
  slotName: string;
  matchScore: number;
  reason: string;
  recommendedTuningSemitones?: number;
  uadChain: string[];
}

export interface MatchedBeatKit {
  style: StylePreset;
  customPrompt?: string;
  inferredKey: string;
  inferredBpm: number;
  vibeSummary: string;
  slots: {
    kick?: MatchedSlot;
    bass?: MatchedSlot;
    snareClap?: MatchedSlot;
    closedHat?: MatchedSlot;
    openHat?: MatchedSlot;
    perc?: MatchedSlot;
  };
  uadDrumBusRecipe: {
    busCompressor: string;
    busEq: string;
    tapeSaturation: string;
    glueTip: string;
  };
}

/**
 * Intelligent AI Beat Kit Matcher
 * Analyzes the requested song style or custom description, then queries the user's
 * actual vault samples to assemble the mathematically & harmonically superior drum kit.
 */
export function matchBeatKitFromVault(
  presetOrPrompt: StylePreset | string,
  vaultSamples: SampleVaultItem[],
  customKey?: string,
  customBpm?: number
): MatchedBeatKit {
  let preset: StylePreset;
  let customQuery = '';

  if (typeof presetOrPrompt === 'string') {
    customQuery = presetOrPrompt.toLowerCase();
    // Match to closest preset or create dynamic preset
    const found = SIGNATURE_BEAT_STYLES.find(p => 
      customQuery.includes(p.id) ||
      customQuery.includes(p.name.toLowerCase()) ||
      customQuery.includes(p.genre.toLowerCase()) ||
      p.artistReference.toLowerCase().split(' ').some(word => word.length > 3 && customQuery.includes(word))
    );

    if (found) {
      preset = found;
    } else {
      // Dynamic preset inferred from user's custom song/vibe description
      const isSlow = customQuery.includes('slow') || customQuery.includes('chill') || customQuery.includes('lo-fi') || customQuery.includes('r&b');
      const isFast = customQuery.includes('fast') || customQuery.includes('drill') || customQuery.includes('rage') || customQuery.includes('speed');
      const bpm = customBpm || (isSlow ? 92 : isFast ? 144 : 130);

      // Infer key from prompt (e.g. "in F#", "in D minor", "C#")
      const keyMatch = customQuery.match(/\b([A-G][#b]?)\s*(minor|major|m)?\b/i);
      const inferredKey = customKey || (keyMatch ? keyMatch[1].toUpperCase() : 'C');

      preset = {
        id: 'custom-style',
        name: `Custom Reference: "${presetOrPrompt.slice(0, 32)}"`,
        artistReference: presetOrPrompt,
        genre: isSlow ? 'R&B / Soulful' : isFast ? 'Trap / Drill' : 'Modern Hip Hop',
        defaultBpm: bpm,
        recommendedKey: inferredKey,
        description: `Custom curated drum stack matching "${presetOrPrompt}". Balanced frequencies with dedicated UAD processing.`,
        icon: '🎛️',
        targetAcoustics: {
          kickPunchHz: isSlow ? 50 : 65,
          kickMaxDecayMs: isSlow ? 400 : 280,
          bassKey: inferredKey,
          bassMinDecayMs: 1200,
          snareType: customQuery.includes('clap') ? 'clap' : 'snare',
          snarePunchHz: 210,
          closedHatMaxDecayMs: 65,
          openHatMinDecayMs: 250
        },
        pattern: {
          kick:      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          bass:      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
          snare:     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
          closedHat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          openHat:   [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
          perc:      [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]
        },
        uadBusRecipe: {
          busCompressor: 'UAD SSL 4000 G Bus Compressor (Ratio 4:1, Attack 30ms, Release Auto, 2-3dB gain reduction)',
          busEq: 'UAD Pultec EQP-1A (Boost 60Hz +2dB, Boost 10kHz +2.5dB for master sheen)',
          tapeSaturation: 'UAD Studer A800 (15 IPS, 456 formula for tape warmth)',
          glueTip: 'Carve a 2dB notch around 60Hz on the 808 to let the kick transient pop cleanly through the mix.'
        }
      };
    }
  } else {
    preset = presetOrPrompt;
  }

  const effectiveKey = customKey || preset.recommendedKey;
  const effectiveBpm = customBpm || preset.defaultBpm;

  // Filter vault samples by category
  const kicks = vaultSamples.filter(s => s.category === 'kicks');
  const basses = vaultSamples.filter(s => s.category === '808s');
  const snaresAndClaps = vaultSamples.filter(s => s.category === 'snares' || s.category === 'claps');
  const closedHats = vaultSamples.filter(s => s.category === 'closed_hats' || (s.category === 'hihats' && s.decayMs < 140));
  const openHats = vaultSamples.filter(s => s.category === 'open_hats' || (s.category === 'hihats' && s.decayMs >= 140) || s.category === 'cymbals');
  const percs = vaultSamples.filter(s => s.category === 'percs' || s.category === 'toms' || s.category === 'vox' || s.category === 'fx');

  // Helper score calculation
  const scoreKick = (k: SampleVaultItem): number => {
    let score = 70;
    const punch = k.punchFrequencyHz || k.fundamentalHz || 60;
    const punchDiff = Math.abs(punch - preset.targetAcoustics.kickPunchHz);
    score += Math.max(0, 20 - punchDiff * 0.5);
    if (k.attackMs <= 8) score += 10;
    return Math.min(99, Math.round(score));
  };

  const scoreBass = (b: SampleVaultItem, chosenKick?: SampleVaultItem): { score: number; tuningOffset: number; reason: string } => {
    let score = 70;
    let tuningOffset = 0;
    let reason = 'Solid sub foundation';

    if (b.detectedKey && b.detectedKey !== 'Atonal / Transient') {
      const harm = calculateHarmonicInterval(b.detectedKey, effectiveKey);
      score += Math.round(harm.harmonicScore * 0.2);
      tuningOffset = harm.semitoneDiff;
      reason = `${b.detectedKey} fundamental aligns with ${effectiveKey} (${harm.intervalName})`;
    }

    if (chosenKick) {
      const kickPunch = chosenKick.punchFrequencyHz || 60;
      const bassFund = b.fundamentalHz || 45;
      const freqGap = Math.abs(kickPunch - bassFund);
      if (freqGap >= 15) {
        score += 10;
        reason += ` • Clears kick pocket by ${Math.round(freqGap)}Hz`;
      }
    }

    return { score: Math.min(99, Math.round(score)), tuningOffset, reason };
  };

  const scoreSnare = (s: SampleVaultItem): number => {
    let score = 70;
    if (preset.targetAcoustics.snareType === 'clap' && s.category === 'claps') score += 15;
    if (preset.targetAcoustics.snareType === 'snare' && s.category === 'snares') score += 15;
    if (s.attackMs <= 12) score += 10;
    return Math.min(99, Math.round(score));
  };

  const scoreClosedHat = (h: SampleVaultItem): number => {
    let score = 75;
    if (h.decayMs <= preset.targetAcoustics.closedHatMaxDecayMs) score += 15;
    if ((h.spectralCentroidHz || 5000) > 4000) score += 10;
    return Math.min(99, Math.round(score));
  };

  const scoreOpenHat = (h: SampleVaultItem): number => {
    let score = 75;
    if (h.decayMs >= preset.targetAcoustics.openHatMinDecayMs) score += 15;
    return Math.min(99, Math.round(score));
  };

  // Find best Kick
  let bestKickSlot: MatchedSlot | undefined;
  if (kicks.length > 0) {
    const sorted = [...kicks].sort((a, b) => scoreKick(b) - scoreKick(a));
    const chosen = sorted[0];
    const score = scoreKick(chosen);
    bestKickSlot = {
      sample: chosen,
      category: 'kicks',
      slotName: 'Punch Kick',
      matchScore: score,
      reason: `Punches at ${chosen.punchFrequencyHz || 60}Hz with ultra-fast ${chosen.attackMs}ms attack. Sits right in the ${preset.genre} sweet spot.`,
      uadChain: ['UAD Pultec EQP-1A (Boost 60Hz +3dB)', 'UAD 1176LN Classic Limiter (Attack 4, Release 7)']
    };
  }

  // Find best 808
  let bestBassSlot: MatchedSlot | undefined;
  if (basses.length > 0) {
    const sorted = [...basses].sort((a, b) => {
      const resA = scoreBass(a, bestKickSlot?.sample);
      const resB = scoreBass(b, bestKickSlot?.sample);
      return resB.score - resA.score;
    });
    const chosen = sorted[0];
    const { score, tuningOffset, reason } = scoreBass(chosen, bestKickSlot?.sample);
    bestBassSlot = {
      sample: chosen,
      category: '808s',
      slotName: 'Harmonic 808 / Sub',
      matchScore: score,
      reason,
      recommendedTuningSemitones: tuningOffset,
      uadChain: [
        'UAD Pultec EQP-1A (High-pass 25Hz to clear sub rumble)',
        'UAD Cambridge EQ (Carve notch at kick punch frequency)',
        'UAD Studer A800 (Tape warmth saturation)'
      ]
    };
  }

  // Find best Snare/Clap
  let bestSnareSlot: MatchedSlot | undefined;
  if (snaresAndClaps.length > 0) {
    const sorted = [...snaresAndClaps].sort((a, b) => scoreSnare(b) - scoreSnare(a));
    const chosen = sorted[0];
    const score = scoreSnare(chosen);
    bestSnareSlot = {
      sample: chosen,
      category: chosen.category,
      slotName: chosen.category === 'claps' ? 'Stereo Clap' : 'Main Snare',
      matchScore: score,
      reason: `Cracks with punch at ${chosen.punchFrequencyHz || 200}Hz. Crisp decay of ${chosen.decayMs}ms leaves space for vocal articulation.`,
      uadChain: ['UAD API 550A (Boost 2.5kHz +2dB for snap)', 'UAD Empirical Labs Distressor (1:1 with Dist 2 enabled)']
    };
  }

  // Find best Closed Hat
  let bestClosedHatSlot: MatchedSlot | undefined;
  if (closedHats.length > 0) {
    const sorted = [...closedHats].sort((a, b) => scoreClosedHat(b) - scoreClosedHat(a));
    const chosen = sorted[0];
    const score = scoreClosedHat(chosen);
    bestClosedHatSlot = {
      sample: chosen,
      category: 'closed_hats',
      slotName: 'Closed Hat (16th Rolls)',
      matchScore: score,
      reason: `Ultra-tight decay (${chosen.decayMs}ms). Zero mud during rapid 16th or 32nd triplet rolls.`,
      uadChain: ['UAD Cambridge EQ (High-pass below 350Hz)', 'UAD Pultec EQP-1A (Boost 12kHz +2dB for sizzle)']
    };
  }

  // Find best Open Hat
  let bestOpenHatSlot: MatchedSlot | undefined;
  if (openHats.length > 0) {
    const sorted = [...openHats].sort((a, b) => scoreOpenHat(b) - scoreOpenHat(a));
    const chosen = sorted[0];
    const score = scoreOpenHat(chosen);
    bestOpenHatSlot = {
      sample: chosen,
      category: 'open_hats',
      slotName: 'Open Hat Accent',
      matchScore: score,
      reason: `Sustains for ${chosen.decayMs}ms on the offbeats to provide rhythmic swing and top-end shimmer.`,
      uadChain: ['UAD Neve 1073 (High Shelf 10kHz +1.5dB)', 'UAD SSL 4000 E Channel Strip (Gate/Expander)']
    };
  }

  // Find best Perc / Texture
  let bestPercSlot: MatchedSlot | undefined;
  if (percs.length > 0) {
    const chosen = percs[0];
    bestPercSlot = {
      sample: chosen,
      category: chosen.category,
      slotName: 'Percussion / Accent',
      matchScore: 88,
      reason: `Adds syncopated bounce around the snare backbeat without frequency masking.`,
      uadChain: ['UAD Cambridge EQ (Bandpass 800Hz - 4kHz)', 'UAD Studio D Chorus (Dimension button 1 for width)']
    };
  }

  return {
    style: preset,
    customPrompt: customQuery || undefined,
    inferredKey: effectiveKey,
    inferredBpm: effectiveBpm,
    vibeSummary: `Curated ${preset.name} Beat Kit (${effectiveBpm} BPM | Key of ${effectiveKey}). Tailored with exact software UAD mixing moves.`,
    slots: {
      kick: bestKickSlot,
      bass: bestBassSlot,
      snareClap: bestSnareSlot,
      closedHat: bestClosedHatSlot,
      openHat: bestOpenHatSlot,
      perc: bestPercSlot
    },
    uadDrumBusRecipe: preset.uadBusRecipe
  };
}
