import { SampleVaultItem, DrumOneShotCategory } from '../types';

export interface PairingSynergy {
  sampleA: SampleVaultItem;
  sampleB: SampleVaultItem;
  overallScore: number; // 0 to 100
  harmonicScore: number; // 0 to 100
  frequencyScore: number; // 0 to 100
  envelopeScore: number; // 0 to 100
  harmonicRelationship: string;
  frequencyPocketAnalysis: string;
  envelopeAnalysis: string;
  tuningOffsetSemitones: number;
  tuningOffsetCents: number;
  suggestedOffsetMs: number; // Suggested micro-nudge timing
  uadSoftwareProcessing: {
    recommendedPlugins: string[];
    eqPocketStrategy: string;
    dynamicsTip: string;
  };
  whyItHits: string;
}

const NOTE_TO_SEMITONE: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5,
  'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11
};

export function parseNoteString(noteStr: string): { pitchClass: string; octave: number } | null {
  if (!noteStr || noteStr.includes('Atonal')) return null;
  const match = noteStr.trim().match(/^([A-G][#b]?)(-?\d+)?$/i);
  if (!match) return null;
  const pitchClass = match[1].toUpperCase();
  const octave = match[2] !== undefined ? parseInt(match[2], 10) : 1;
  return { pitchClass, octave };
}

export function calculateHarmonicInterval(
  noteAStr: string,
  noteBStr: string
): { intervalName: string; semitoneDiff: number; harmonicScore: number; advice: string } {
  const parsedA = parseNoteString(noteAStr);
  const parsedB = parseNoteString(noteBStr);

  if (!parsedA || !parsedB) {
    return {
      intervalName: 'Atonal / Transient',
      semitoneDiff: 0,
      harmonicScore: 82,
      advice: 'One or both samples are atonal/percussive; pitch clashing is minimal.'
    };
  }

  const semiA = (NOTE_TO_SEMITONE[parsedA.pitchClass] ?? 0) + parsedA.octave * 12;
  const semiB = (NOTE_TO_SEMITONE[parsedB.pitchClass] ?? 0) + parsedB.octave * 12;
  const diff = Math.abs(semiA - semiB);
  const mod12 = diff % 12;

  switch (mod12) {
    case 0:
      return {
        intervalName: diff === 0 ? 'Unison (Same Note)' : 'Octave Lock',
        semitoneDiff: 0,
        harmonicScore: 100,
        advice: 'Flawless harmonic alignment. The fundamental waves reinforce each other with maximum low-end power.'
      };
    case 7:
      return {
        intervalName: 'Perfect 5th',
        semitoneDiff: 5,
        harmonicScore: 94,
        advice: 'Extremely strong harmonic anchor. Creates the classic 808/Kick musical stack used in modern trap & hip hop.'
      };
    case 5:
      return {
        intervalName: 'Perfect 4th',
        semitoneDiff: 7,
        harmonicScore: 88,
        advice: 'Strong consonant interval. Sits stably without harmonic dissonance.'
      };
    case 3:
    case 4:
      return {
        intervalName: mod12 === 3 ? 'Minor 3rd' : 'Major 3rd',
        semitoneDiff: mod12,
        harmonicScore: 80,
        advice: 'Musical chordal relationship. Works well if your track is in this key scale.'
      };
    case 1:
    case 11:
      return {
        intervalName: 'Minor 2nd (Dissonant Clash)',
        semitoneDiff: 1,
        harmonicScore: 35,
        advice: 'Severe semitone beating and mud! Transpose one sample by ±1 semitone to lock into harmony.'
      };
    case 6:
      return {
        intervalName: 'Tritone (Diminished 5th)',
        semitoneDiff: 6,
        harmonicScore: 40,
        advice: 'Heavy tension / dissonant rumble. Transpose by +1 semitone up to a 5th.'
      };
    default:
      return {
        intervalName: `${mod12} Semitone Interval`,
        semitoneDiff: mod12,
        harmonicScore: 68,
        advice: 'Moderately neutral. Consider fine-tuning cents for tighter sub punch.'
      };
  }
}

/**
 * Intelligent Drum Pairing Algorithm:
 * Evaluates spectral frequency separation, harmonic key lock, and transient envelope compliment.
 */
export function evaluateSamplePairing(
  sampleA: SampleVaultItem,
  sampleB: SampleVaultItem
): PairingSynergy {
  const isKickAnd808 =
    (sampleA.category === 'kicks' && sampleB.category === '808s') ||
    (sampleA.category === '808s' && sampleB.category === 'kicks');

  const isSnareAndClap =
    (sampleA.category === 'snares' && sampleB.category === 'claps') ||
    (sampleA.category === 'claps' && sampleB.category === 'snares');

  const isHatAndPerc =
    (sampleA.category === 'hihats' && sampleB.category === 'percs') ||
    (sampleA.category === 'percs' && sampleB.category === 'hihats');

  // 1. Harmonic score
  const harmonic = calculateHarmonicInterval(sampleA.detectedKey, sampleB.detectedKey);
  let harmonicScore = harmonic.harmonicScore;

  // 2. Frequency Pocket Score
  let frequencyScore = 75;
  let frequencyPocketAnalysis = '';
  let envelopeScore = 80;
  let envelopeAnalysis = '';
  let suggestedOffsetMs = 0;
  let recommendedPlugins: string[] = [];
  let eqPocketStrategy = '';
  let dynamicsTip = '';
  let whyItHits = '';

  const kick = sampleA.category === 'kicks' ? sampleA : sampleB.category === 'kicks' ? sampleB : null;
  const sub808 = sampleA.category === '808s' ? sampleA : sampleB.category === '808s' ? sampleB : null;

  if (isKickAnd808 && kick && sub808) {
    const kickPunch = kick.punchFrequencyHz || 75;
    const subFund = sub808.fundamentalHz || 40;
    const freqDelta = Math.abs(kickPunch - subFund);

    if (freqDelta >= 32) {
      frequencyScore = 98;
      frequencyPocketAnalysis = `Flawless Low-End Pocket! Kick attack punch hits at ${kickPunch} Hz while 808 fundamental hums at ${subFund} Hz (${freqDelta} Hz separation). Zero sub-masking.`;
      whyItHits = `The kick provides clean chest punch while the 808 carries the pure sub bass without eating headroom.`;
    } else if (freqDelta >= 18) {
      frequencyScore = 82;
      frequencyPocketAnalysis = `Moderate overlap: Kick punch (${kickPunch} Hz) is ${freqDelta} Hz from 808 (${subFund} Hz). A narrow carve will create total clarity.`;
      whyItHits = `Tight, aggressive low end once carved. Perfect for heavy drill or modern trap.`;
    } else {
      frequencyScore = 48;
      frequencyPocketAnalysis = `Frequency Collision Alert! Kick punch (${kickPunch} Hz) and 808 fundamental (${subFund} Hz) are fighting for the exact same low-end pocket (${freqDelta} Hz gap).`;
      whyItHits = `High risk of phase cancellation and sub mud unless notched or sidechained.`;
    }

    envelopeScore = kick.attackMs < 12 && sub808.decayMs > 400 ? 96 : 85;
    envelopeAnalysis = `Fast kick transient (${kick.attackMs}ms) cuts cleanly through the front, letting the 808 tail (${sub808.decayMs}ms) bloom in the background.`;
    suggestedOffsetMs = 0; // Kicks and 808s should lock on downbeats (or sidechained)

    recommendedPlugins = [
      'UAD Pultec EQP-1A',
      'UAD API 2500 Bus Compressor',
      'UAD Cambridge EQ',
      'UAD Teletronix LA-2A Silver'
    ];
    eqPocketStrategy = `On UAD Pultec EQP-1A, boost 808 at 30Hz (+3) and attenuate at 60Hz. On Kick, boost 100Hz on API 550A for click and high-pass at 35Hz.`;
    dynamicsTip = `Sidechain the 808 to the Kick using UAD API 2500 or 1176LN (fast attack 3, fastest release 7) pulling down only 2-3 dB on each kick strike.`;
  } else if (isSnareAndClap) {
    const snare = sampleA.category === 'snares' ? sampleA : sampleB;
    const clap = sampleA.category === 'claps' ? sampleA : sampleB;

    frequencyScore = 90;
    frequencyPocketAnalysis = `Snare crack (${snare.punchFrequencyHz || 200} Hz body) pairs with Clap diffuse stereo spread (${clap.punchFrequencyHz || 1200} Hz mid-presence).`;

    envelopeScore = snare.decayMs < 250 ? 95 : 85;
    envelopeAnalysis = `The crisp short snare transient (${snare.decayMs}ms) gives instantaneous center punch, while the clap tail (${clap.decayMs}ms) adds wide stereo ambiance.`;
    suggestedOffsetMs = 14; // Pre-shift clap 14ms earlier for stereo slapback width

    recommendedPlugins = [
      'UAD Neve 1073',
      'UAD Studio D Chorus',
      'UAD 1176LN Classic Limiter',
      'UAD Lexicon 224 Digital Reverb'
    ];
    eqPocketStrategy = `High-pass the clap at 350 Hz to keep the snare fundamental (180-220 Hz) pristine in the center. Boost 12 kHz shelf on clap with Neve 1073 for modern sizzle.`;
    dynamicsTip = `Nudge the clap 10-18ms before or after the snare hit. This prevents phase-canceling transient spikes and doubles perceived punch.`;
    whyItHits = `Gives you the punchy center crack of a snare with the wide, rolling impact of a boutique clap.`;
  } else if (isHatAndPerc) {
    frequencyScore = 92;
    frequencyPocketAnalysis = `Top-end separation: Hi-Hat dominates 8 kHz – 16 kHz sizzle, while Percussion provides 500 Hz – 3 kHz syncopated knock.`;
    envelopeScore = 90;
    envelopeAnalysis = `Short rhythmic hi-hat transient integrates seamlessly with acoustic/wood perc character.`;
    suggestedOffsetMs = 0;
    recommendedPlugins = ['UAD Studer A800 Tape', 'UAD SSL 4000 E Channel Strip', 'UAD Precision De-Esser'];
    eqPocketStrategy = `Dip 4 kHz on the hi-hat by 1.5 dB to leave room for the perc attack knock. High-pass perc at 250 Hz.`;
    dynamicsTip = `Use UAD Studer A800 tape saturation (15 IPS, +6 dB) on the drum bus to gently glue hats and percs without harshness.`;
    whyItHits = `Creates rolling bounce and syncopated rhythmic groove without cluttering the vocal pocket.`;
  } else {
    // General pair
    frequencyScore = 84;
    frequencyPocketAnalysis = `Balanced acoustic distribution across frequency spectrum.`;
    envelopeScore = 82;
    envelopeAnalysis = `Complementary transient lengths (${sampleA.decayMs}ms and ${sampleB.decayMs}ms).`;
    recommendedPlugins = ['UAD Cambridge EQ', 'UAD Fairchild 670', 'UAD Precision Limiter'];
    eqPocketStrategy = `Ensure neither sample masks the 1 kHz - 4 kHz vocal frequency pocket.`;
    dynamicsTip = `Group to drum bus and use 1-2 dB of gentle glue compression with UAD Fairchild 670.`;
    whyItHits = `Solid dynamic contrast and harmonic cohesion.`;
  }

  // Weight overall score: 40% Harmonic, 40% Frequency Pocket, 20% Envelope
  const overallScore = Math.min(
    100,
    Math.max(10, Math.round(harmonicScore * 0.4 + frequencyScore * 0.4 + envelopeScore * 0.2))
  );

  return {
    sampleA,
    sampleB,
    overallScore,
    harmonicScore,
    frequencyScore,
    envelopeScore,
    harmonicRelationship: harmonic.intervalName,
    frequencyPocketAnalysis,
    envelopeAnalysis,
    tuningOffsetSemitones: harmonic.semitoneDiff,
    tuningOffsetCents: (sampleB.centsDetune || 0) - (sampleA.centsDetune || 0),
    suggestedOffsetMs,
    uadSoftwareProcessing: {
      recommendedPlugins,
      eqPocketStrategy,
      dynamicsTip
    },
    whyItHits
  };
}

/**
 * Find Top Complementary Matches for any drum sample
 */
export function findTopComplementaryMatches(
  targetSample: SampleVaultItem,
  vault: SampleVaultItem[],
  limit: number = 6
): PairingSynergy[] {
  const eligibleMatches = vault.filter(s => s.id !== targetSample.id);

  // Group prioritizing complementary categories
  const targetCategory = targetSample.category;
  let preferredComplementCategory: DrumOneShotCategory | null = null;
  if (targetCategory === 'kicks') preferredComplementCategory = '808s';
  else if (targetCategory === '808s') preferredComplementCategory = 'kicks';
  else if (targetCategory === 'snares') preferredComplementCategory = 'claps';
  else if (targetCategory === 'claps') preferredComplementCategory = 'snares';
  else if (targetCategory === 'hihats') preferredComplementCategory = 'percs';
  else if (targetCategory === 'percs') preferredComplementCategory = 'hihats';

  const scoredPairs: PairingSynergy[] = eligibleMatches.map(other =>
    evaluateSamplePairing(targetSample, other)
  );

  // Sort by overallScore descending, giving bonus to preferred complement categories
  scoredPairs.sort((a, b) => {
    let scoreA = a.overallScore;
    let scoreB = b.overallScore;
    if (preferredComplementCategory && a.sampleB.category === preferredComplementCategory) {
      scoreA += 15;
    }
    if (preferredComplementCategory && b.sampleB.category === preferredComplementCategory) {
      scoreB += 15;
    }
    return scoreB - scoreA;
  });

  return scoredPairs.slice(0, limit);
}
