const fs = require('fs');

const updates = [
  {
    targetName: 'JS: MIDI EQ Ducker [LOSER]',
    matchName: 'MIDI EQ Ducker [LOSER]',
    category: 'Routing & Utility',
    sliders: [
      { index: 0, name: 'MIDI Note #', unit: '', min: 0, max: 127, defaultVal: 60, description: 'MIDI Note' },
      { index: 1, name: 'Attack (ms)', unit: 'ms', min: 0, max: 1000, defaultVal: 10, description: 'Attack (ms)' },
      { index: 2, name: 'Attack Shape', unit: '', min: 0, max: 1, defaultVal: 0, description: 'Attack Shape' },
      { index: 3, name: 'Release (ms)', unit: 'ms', min: 0, max: 5000, defaultVal: 500, description: 'Release (ms)' },
      { index: 4, name: 'Release Shape', unit: '', min: 0, max: 1, defaultVal: 0, description: 'Release Shape' },
      { index: 5, name: 'Frequency Coarse (Hz)', unit: 'Hz', min: 20, max: 20000, defaultVal: 1000, description: 'Frequency Coarse' },
      { index: 6, name: 'Frequency Fine (Hz)', unit: 'Hz', min: -100, max: 100, defaultVal: 0, description: 'Frequency Fine' },
      { index: 7, name: 'Width (Oct)', unit: 'Oct', min: 0, max: 4, defaultVal: 1, description: 'Width' },
      { index: 8, name: 'Volume (dB)', unit: 'dB', min: -60, max: 24, defaultVal: 0, description: 'Volume' },
      { index: 9, name: 'Mode', unit: '', min: 0, max: 4, defaultVal: 0, description: 'Freq Peak / Low Shelf / High Shelf / Gate / Pump' },
      { index: 10, name: 'React To MIDI Velocity', unit: '', min: 0, max: 1, defaultVal: 0, description: 'Gate/Pump React To MIDI Velocity' }
    ]
  },
  {
    targetName: 'JS: MIDI Velocity and Timing Humanizer',
    matchName: 'MIDI Velocity and Timing Humanizer',
    category: 'Routing & Utility',
    sliders: [
      { index: 0, name: 'Baseline Velocity', unit: '', min: 0, max: 127, defaultVal: 0, description: '(0=use original)' },
      { index: 1, name: 'Add 1 Beat Delay', unit: '', min: 0, max: 1, defaultVal: 0, description: 'Add 1 Beat Delay' },
      { index: 2, name: 'Bias Timing Humanization (ms)', unit: 'ms', min: -100, max: 100, defaultVal: 0, description: 'Bias Timing Humanization' },
      { index: 3, name: 'Timing Humanization Level', unit: '', min: 0, max: 100, defaultVal: 0, description: 'Timing Humanization Level' },
      { index: 4, name: 'Velocity Humanization Level', unit: '', min: 0, max: 100, defaultVal: 0, description: 'Velocity Humanization Level' }
    ]
  },
  {
    targetName: 'JS: MIDI Modal Randomness',
    matchName: 'MIDI Modal Randomness',
    category: 'Routing & Utility',
    sliders: [
      { index: 0, name: 'Interval & Prob A', unit: '', min: 0, max: 100, defaultVal: 50, description: 'Interval A' },
      { index: 1, name: 'Interval & Prob B', unit: '', min: 0, max: 100, defaultVal: 50, description: 'Interval B' },
      { index: 2, name: 'Interval & Prob C', unit: '', min: 0, max: 100, defaultVal: 50, description: 'Interval C' },
      { index: 3, name: 'Interval & Prob D', unit: '', min: 0, max: 100, defaultVal: 50, description: 'Interval D' },
      { index: 4, name: 'Speed', unit: '', min: 0, max: 100, defaultVal: 50, description: 'Speed' },
      { index: 5, name: 'Octave Randomness', unit: '', min: 0, max: 100, defaultVal: 50, description: 'Octave' },
      { index: 6, name: 'Timing Randomness', unit: '', min: 0, max: 100, defaultVal: 50, description: 'Timing' },
      { index: 7, name: 'Velocity Randomness', unit: '', min: 0, max: 100, defaultVal: 50, description: 'Velocity' },
      { index: 8, name: 'Decay Time (sec)', unit: 's', min: 0, max: 10, defaultVal: 1, description: 'Decay Time' },
      { index: 9, name: 'Simultaneous Notes', unit: '', min: 1, max: 16, defaultVal: 4, description: 'Number Of Simultaneous Notes' }
    ]
  },
  {
    targetName: 'JS: IX/MIDI_MapToKey',
    matchName: 'MIDI Map To Key v2 [IXix]',
    category: 'Routing & Utility',
    sliders: [
      { index: 0, name: 'Input Channel', unit: '', min: 0, max: 16, defaultVal: 0, description: 'Input Channel' },
      { index: 1, name: 'Mapping File', unit: '', min: 0, max: 100, defaultVal: 0, description: 'Mapping File' },
      { index: 2, name: '-Note In', unit: '', min: 0, max: 127, defaultVal: 0, description: 'Hidden UI' },
      { index: 3, name: '-Note Out', unit: '', min: 0, max: 127, defaultVal: 0, description: 'Hidden UI' },
      { index: 4, name: 'Reload Mapping', unit: '', min: 0, max: 1, defaultVal: 0, description: 'Reload Mapping' }
    ]
  },
  {
    targetName: 'JS: MIDI Pitch Wheel LFO Generator',
    matchName: 'MIDI Pitch Wheel LFO Generator',
    category: 'Routing & Utility',
    sliders: [
      { index: 0, name: 'MIDI Channel', unit: '', min: 1, max: 16, defaultVal: 1, description: 'MIDI Channel' },
      { index: 1, name: 'Max Bend (%)', unit: '%', min: 0, max: 100, defaultVal: 100, description: 'Max Bend' },
      { index: 2, name: 'LFO Frequency', unit: 'Hz', min: 0.1, max: 100, defaultVal: 1, description: 'LFO Frequency' },
      { index: 3, name: 'LFO Units (Hz/Beats)', unit: '', min: 0, max: 1, defaultVal: 0, description: 'LFO Units' },
      { index: 4, name: 'Updates Per Beat', unit: '', min: 1, max: 64, defaultVal: 16, description: 'Updates Per Beat' },
      { index: 5, name: 'On/Off', unit: '', min: 0, max: 1, defaultVal: 1, description: 'On/Off' }
    ]
  },
  {
    targetName: 'JS: Liteon/np1136peaklimiter',
    matchName: 'NP1136 Peak Limiter',
    category: 'Dynamics',
    sliders: [
      { index: 0, name: 'Threshold (dB)', unit: 'dB', min: -60, max: 0, defaultVal: 0, description: 'Threshold' },
      { index: 1, name: 'Ratio', unit: 'ratio', min: 1, max: 20, defaultVal: 10, description: 'Ratio' },
      { index: 2, name: 'Attack (µs)', unit: 'µs', min: 0, max: 1000, defaultVal: 100, description: 'Attack' },
      { index: 3, name: 'Release (ms)', unit: 'ms', min: 0, max: 1000, defaultVal: 100, description: 'Release' },
      { index: 4, name: 'Detector HP (Hz)', unit: 'Hz', min: 20, max: 500, defaultVal: 100, description: 'Detector HP' },
      { index: 5, name: 'GR Limit (dB)', unit: 'dB', min: -30, max: 0, defaultVal: -12, description: 'GR Limit' },
      { index: 6, name: 'Makeup Gain (dB)', unit: 'dB', min: 0, max: 24, defaultVal: 0, description: 'Makeup Gain' },
      { index: 7, name: 'Tilt EQ Center (Hz)', unit: 'Hz', min: 200, max: 2000, defaultVal: 1000, description: 'Tilt EQ Center' },
      { index: 8, name: 'Tilt EQ Low/High (dB)', unit: 'dB', min: -12, max: 12, defaultVal: 0, description: 'Tilt EQ' },
      { index: 9, name: 'Wet Mix (%)', unit: '%', min: 0, max: 100, defaultVal: 100, description: 'Wet Mix' },
      { index: 10, name: 'Processing Mode', unit: '', min: 0, max: 2, defaultVal: 0, description: 'Processing Mode' },
      { index: 11, name: 'Detector Mode', unit: '', min: 0, max: 2, defaultVal: 0, description: 'Detector Mode' },
      { index: 12, name: 'Detector Input', unit: '', min: 0, max: 2, defaultVal: 0, description: 'Detector Input' },
      { index: 13, name: 'Hard Clip', unit: '', min: 0, max: 1, defaultVal: 0, description: 'Hard Clip' }
    ]
  },
  {
    targetName: 'JS: 1175 Compressor',
    matchName: '1175 FAST Attack Compressor [Stillwell]',
    category: 'Dynamics',
    sliders: [
      { index: 0, name: 'Threshold (dB)', unit: 'dB', min: -60, max: 0, defaultVal: -18, description: 'Threshold' },
      { index: 1, name: 'Ratio', unit: 'ratio', min: 4, max: 20, defaultVal: 4, description: 'Ratio' },
      { index: 2, name: 'Gain (dB)', unit: 'dB', min: 0, max: 24, defaultVal: 0, description: 'Gain' },
      { index: 3, name: 'Attack (uS)', unit: 'uS', min: 20, max: 800, defaultVal: 200, description: 'Attack (uS)' },
      { index: 4, name: 'Release (mS)', unit: 'mS', min: 50, max: 1100, defaultVal: 300, description: 'Release (mS)' },
      { index: 5, name: 'Mix (%)', unit: '%', min: 0, max: 100, defaultVal: 100, description: 'Mix (%)' }
    ]
  },
  {
    targetName: 'JS: Dirt Squeeze Compressor',
    matchName: 'Dirt Squeeze Compressor [Stillwell]',
    category: 'Dynamics',
    sliders: [
      { index: 0, name: 'Threshold (dB)', unit: 'dB', min: -60, max: 0, defaultVal: -12, description: 'Threshold' },
      { index: 1, name: 'Ratio', unit: 'ratio', min: 1, max: 20, defaultVal: 4, description: 'Ratio' },
      { index: 2, name: 'Automatic Make-Up', unit: '', min: 0, max: 1, defaultVal: 1, description: 'Yes/No' },
      { index: 3, name: 'Manual Gain', unit: 'dB', min: -24, max: 24, defaultVal: 0, description: 'Manual Gain' }
    ]
  },
  {
    targetName: 'JS: LOSER/EventHorizon',
    matchName: 'Event Horizon Clipper / Limiter',
    category: 'Dynamics',
    sliders: [
      { index: 0, name: 'Threshold (dB)', unit: 'dB', min: -30, max: 0, defaultVal: -0.1, description: 'Threshold' },
      { index: 1, name: 'Ceiling (dB)', unit: 'dB', min: -30, max: 0, defaultVal: -0.1, description: 'Ceiling' },
      { index: 2, name: 'Soft Clip (dB)', unit: 'dB', min: 0, max: 6, defaultVal: 2, description: 'Soft Clip' }
    ]
  },
  {
    targetName: 'JS: Liteon/moog24db',
    matchName: 'Moog 4-Pole Filter (Liteon)',
    category: 'EQ & Filtering',
    sliders: [
      { index: 0, name: 'Processing', unit: '', min: 0, max: 1, defaultVal: 0, description: 'Stereo/Mono' },
      { index: 1, name: 'Filter Type', unit: '', min: 0, max: 2, defaultVal: 0, description: 'LP, HP, BP' },
      { index: 2, name: 'Cutoff (Scale)', unit: '', min: 0, max: 1, defaultVal: 0.5, description: 'Cutoff' },
      { index: 3, name: 'Resonance', unit: '', min: 0, max: 1, defaultVal: 0.5, description: 'Resonance' },
      { index: 4, name: 'Drive (%)', unit: '%', min: 0, max: 100, defaultVal: 10, description: 'Drive' },
      { index: 5, name: 'Output (dB)', unit: 'dB', min: -24, max: 24, defaultVal: 0, description: 'Output' },
      { index: 6, name: 'Limiter', unit: '', min: 0, max: 1, defaultVal: 1, description: 'On/Off' },
      { index: 7, name: 'Oversample', unit: '', min: 0, max: 1, defaultVal: 0, description: 'x2' }
    ]
  },
  {
    targetName: 'JS: Liteon/presenceeq',
    matchName: 'Presence EQ',
    category: 'EQ & Filtering',
    sliders: [
      { index: 0, name: 'Processing', unit: '', min: 0, max: 1, defaultVal: 0, description: 'Processing' },
      { index: 1, name: 'Frequency (Hz)', unit: 'Hz', min: 200, max: 10000, defaultVal: 3000, description: 'Frequency' },
      { index: 2, name: 'Cut/Boost (dB)', unit: 'dB', min: -24, max: 24, defaultVal: 0, description: 'Gain' },
      { index: 3, name: 'Bandwidth', unit: '', min: 0.1, max: 4, defaultVal: 1, description: 'Bandwidth' },
      { index: 4, name: 'Output (dB)', unit: 'dB', min: -24, max: 24, defaultVal: 0, description: 'Output' }
    ]
  },
  {
    targetName: 'JS: Paranoia Mangler',
    matchName: 'Paranoia Mangler [remaincalm.org]',
    category: 'Time & Modulation',
    sliders: [
      { index: 0, name: 'Input Gain (dB)', unit: 'dB', min: -24, max: 24, defaultVal: 0, description: 'Input Gain' },
      { index: 1, name: 'Dry Out', unit: 'dB', min: -120, max: 12, defaultVal: -120, description: 'Dry Out' },
      { index: 2, name: 'Wet Out', unit: 'dB', min: -120, max: 12, defaultVal: 0, description: 'Wet Out' },
      { index: 3, name: 'Bad Resampler (Hz)', unit: 'Hz', min: 100, max: 20000, defaultVal: 4000, description: 'Bad Resampler' },
      { index: 4, name: 'Bitcrusher', unit: 'bits', min: 1, max: 24, defaultVal: 8, description: 'Bitcrusher' },
      { index: 5, name: 'Thermonuclear War', unit: '%', min: 0, max: 100, defaultVal: 50, description: 'Thermonuclear War' },
      { index: 6, name: 'Bitdepth', unit: 'bits', min: 1, max: 24, defaultVal: 16, description: 'Bitdepth' },
      { index: 7, name: 'Gate (%)', unit: '%', min: 0, max: 100, defaultVal: 0, description: 'Gate' },
      { index: 8, name: 'Love (%)', unit: '%', min: 0, max: 100, defaultVal: 50, description: 'Love' },
      { index: 9, name: 'Jive (%)', unit: '%', min: 0, max: 100, defaultVal: 50, description: 'Jive' },
      { index: 10, name: 'Attitude', unit: '', min: 0, max: 3, defaultVal: 0, description: 'No, Murky, Confused, Unpleasant' }
    ]
  },
  {
    targetName: 'JS: Liteon/saturator',
    matchName: 'Non-Linear Processor', // or maybe Liteon/saturator isn't non-linear. The text says "Non-Linear Processor (Liteon)". There is no Non-Linear in App.tsx except Liteon/saturator?
    category: 'EQ & Filtering',
    sliders: [
      { index: 0, name: 'Saturation Amount (%)', unit: '%', min: 0, max: 100, defaultVal: 50, description: 'Saturation Amount' },
      { index: 1, name: 'Fluctuation Amount (%)', unit: '%', min: 0, max: 100, defaultVal: 0, description: 'Fluctuation Amount' },
      { index: 2, name: 'Noise Floor At (Bits)', unit: 'bits', min: 8, max: 24, defaultVal: 24, description: 'Noise Floor' },
      { index: 3, name: 'Output (dB)', unit: 'dB', min: -24, max: 24, defaultVal: 0, description: 'Output' },
      { index: 4, name: 'Output Polarity', unit: '', min: 0, max: 1, defaultVal: 0, description: 'Polarity' }
    ]
  },
  {
    targetName: 'JS: Ozzifier Chorus',
    matchName: 'Ozzifier Chorus [Stillwell]',
    category: 'Time & Modulation',
    sliders: [
      { index: 0, name: 'Number Of Voices', unit: '', min: 1, max: 8, defaultVal: 4, description: 'Number Of Voices' },
      { index: 1, name: 'Time Spread (ms)', unit: 'ms', min: 0, max: 50, defaultVal: 20, description: 'Time Spread' },
      { index: 2, name: 'Pitch Spread (cents)', unit: 'cents', min: 0, max: 50, defaultVal: 15, description: 'Pitch Spread' },
      { index: 3, name: 'Wet Mix', unit: '%', min: 0, max: 100, defaultVal: 50, description: 'Wet Mix' },
      { index: 4, name: 'Dry Mix', unit: '%', min: 0, max: 100, defaultVal: 100, description: 'Dry Mix' },
      { index: 5, name: 'Pan Spread (%)', unit: '%', min: 0, max: 100, defaultVal: 100, description: 'Pan Spread' }
    ]
  },
  {
    targetName: 'JS: Pitch Octave Up',
    matchName: 'Pitch an Octave Up',
    category: 'Time & Modulation',
    sliders: [
      { index: 0, name: 'Chunk (ms)', unit: 'ms', min: 10, max: 200, defaultVal: 50, description: 'Chunk (ms)' },
      { index: 1, name: 'Overlap', unit: '', min: 1, max: 8, defaultVal: 4, description: 'Overlap' },
      { index: 2, name: 'Wet Mix (dB)', unit: 'dB', min: -120, max: 12, defaultVal: 0, description: 'Wet Mix' },
      { index: 3, name: 'Dry Mix (dB)', unit: 'dB', min: -120, max: 12, defaultVal: -120, description: 'Dry Mix' }
    ]
  },
  {
    targetName: 'JS: Pitch Down-Shifter',
    matchName: 'Pitch an Octave Down',
    category: 'Time & Modulation',
    sliders: [
      { index: 0, name: 'Chunk (ms)', unit: 'ms', min: 10, max: 200, defaultVal: 50, description: 'Chunk (ms)' },
      { index: 1, name: 'Overlap', unit: '', min: 1, max: 8, defaultVal: 4, description: 'Overlap' },
      { index: 2, name: 'Wet Mix (dB)', unit: 'dB', min: -120, max: 12, defaultVal: 0, description: 'Wet Mix' },
      { index: 3, name: 'Dry Mix (dB)', unit: 'dB', min: -120, max: 12, defaultVal: -120, description: 'Dry Mix' }
    ]
  },
  {
    targetName: 'JS: 4-Tap Phaser',
    matchName: '4-Tap Phaser',
    category: 'Time & Modulation',
    sliders: [
      { index: 0, name: 'Rate (Hz)', unit: 'Hz', min: 0.1, max: 10, defaultVal: 1, description: 'Rate (Hz)' },
      { index: 1, name: 'Range Min (Hz)', unit: 'Hz', min: 20, max: 5000, defaultVal: 200, description: 'Range Min' },
      { index: 2, name: 'Range Max (Hz)', unit: 'Hz', min: 100, max: 10000, defaultVal: 4000, description: 'Range Max' },
      { index: 3, name: 'Feedback (dB)', unit: 'dB', min: -20, max: 12, defaultVal: 0, description: 'Feedback' },
      { index: 4, name: 'Wet Mix (dB)', unit: 'dB', min: -120, max: 12, defaultVal: 0, description: 'Wet Mix' }
    ]
  },
  {
    targetName: 'JS: Avocado Ducking Glitch Generator',
    matchName: 'Avocado Ducking Glitch Generator',
    category: 'Time & Modulation',
    sliders: [
      { index: 0, name: 'Buffer Length (ms)', unit: 'ms', min: 10, max: 2000, defaultVal: 200, description: 'Buffer Length' },
      { index: 1, name: 'Mix (%)', unit: '%', min: 0, max: 100, defaultVal: 100, description: 'Mix' },
      { index: 2, name: 'Buffers', unit: '', min: 1, max: 16, defaultVal: 4, description: 'Buffers' },
      { index: 3, name: 'Repeat Probability', unit: '%', min: 0, max: 100, defaultVal: 50, description: 'Repeat Probability' },
      { index: 4, name: 'Pitch Modulation Probability', unit: '%', min: 0, max: 100, defaultVal: 20, description: 'Pitch Mod' },
      { index: 5, name: 'Reverse Probability', unit: '%', min: 0, max: 100, defaultVal: 30, description: 'Reverse' },
      { index: 6, name: 'Fadeout Probability', unit: '%', min: 0, max: 100, defaultVal: 40, description: 'Fadeout' },
      { index: 7, name: 'Threshold (dB)', unit: 'dB', min: -60, max: 0, defaultVal: -20, description: 'Threshold' },
      { index: 8, name: 'Glitch Attack', unit: 'ms', min: 0, max: 100, defaultVal: 5, description: 'Glitch Attack' },
      { index: 9, name: 'Arpeggiator Mode', unit: '', min: 0, max: 3, defaultVal: 0, description: 'Arpeggiator Mode' },
      { index: 10, name: 'Tempo Sync', unit: '', min: 0, max: 1, defaultVal: 1, description: 'Tempo Sync' }
    ]
  }
];

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

let count = 0;
for (const update of updates) {
  const tName = update.targetName;
  const nameMatch = `name: "${tName}"`;
  const nameIndex = srcCode.indexOf(nameMatch);
  
  if (nameIndex > -1) {
    const slidersStartStr = 'sliders: [';
    const slidersEndStr = '    ]';
    const slidersIndex = srcCode.indexOf(slidersStartStr, nameIndex);
    const endBlockIndex = srcCode.indexOf(slidersEndStr, slidersIndex);
    
    if (slidersIndex > -1 && endBlockIndex > -1) {
      const replacementStr = 'sliders: [\n' + update.sliders.map(s => '      ' + JSON.stringify(s)).join(',\n');
      srcCode = srcCode.slice(0, slidersIndex) + replacementStr + srcCode.slice(endBlockIndex);
      console.log(`Updated existing: ${tName}`);
      count++;
    }
  } else {
    // try with single quotes?
    const nameMatch2 = `name: '${tName}'`;
    const nameIndex2 = srcCode.indexOf(nameMatch2);
    if (nameIndex2 > -1) {
       const slidersStartStr = 'sliders: [';
       const slidersEndStr = '    ]';
       const slidersIndex = srcCode.indexOf(slidersStartStr, nameIndex2);
       const endBlockIndex = srcCode.indexOf(slidersEndStr, slidersIndex);
       
       if (slidersIndex > -1 && endBlockIndex > -1) {
         const replacementStr = 'sliders: [\n' + update.sliders.map(s => '      ' + JSON.stringify(s)).join(',\n');
         srcCode = srcCode.slice(0, slidersIndex) + replacementStr + srcCode.slice(endBlockIndex);
         console.log(`Updated existing: ${tName}`);
         count++;
       }
    } else {
        console.log(`Adding new plugin: ${update.targetName}`);
        const newProfile = {
          name: update.targetName,
          shortName: update.matchName,
          category: update.category,
          description: `Accurate sliders for ${update.matchName}.`,
          howItWorks: '',
          proTips: '',
          sliders: update.sliders
        };
        
        const insertion = '  ' + JSON.stringify(newProfile, null, 4);
        const anchor = '];';
        const pos = srcCode.lastIndexOf(anchor);
        if (pos > -1) {
          srcCode = srcCode.slice(0, pos) + ',\n' + insertion + '\n' + srcCode.slice(pos);
          count++;
        } else {
          console.log(`Failed to add: ${update.targetName}`);
        }
    }
  }
}

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log(`Successfully processed ${count} accurate slider updates.`);
