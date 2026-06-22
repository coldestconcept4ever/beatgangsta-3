import fs from 'fs';

const updates = [
  {
    targetName: 'JS: MTC Logger',
    matchName: 'MTC Logger',
    category: 'Analysis & Utility',
    desc: 'MTC Logger',
    author: 'Unknown',
    sliders: []
  },
  {
    targetName: 'JS: Non-Linear Processor',
    matchName: 'Non-Linear Processor',
    category: 'Distortion',
    desc: 'Non-Linear Processor',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Saturation Amount (%)', min: 0, max: 100, defaultVal: 30 },
      { index: 1, name: 'Fluctuation Amount (%)', min: 0, max: 100, defaultVal: 50 },
      { index: 2, name: 'Noise Floor At', min: 0, max: 32, defaultVal: 16, unit: 'Bits' },
      { index: 3, name: 'Output', min: -24, max: 24, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'Output Polarity', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: NP1136 Peak Limiter',
    matchName: 'NP1136 Peak Limiter',
    category: 'Dynamics',
    desc: 'NP1136 Peak Limiter',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Threshold', min: -40, max: 0, defaultVal: -12, unit: 'dB' },
      { index: 1, name: 'Ratio (20:1 - PD Mode)', min: 1, max: 20, defaultVal: 4 },
      { index: 2, name: 'Attack', min: 0, max: 100, defaultVal: 30, unit: 'us' },
      { index: 3, name: 'Release', min: 0, max: 100, defaultVal: 45, unit: 'ms' },
      { index: 4, name: 'Detector HP', min: 0, max: 100, defaultVal: 0, unit: 'Hz' },
      { index: 5, name: 'GR Limit', min: -40, max: 0, defaultVal: -18, unit: 'dB' },
      { index: 6, name: 'Makeup Gain', min: 0, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 7, name: 'Tilt EQ Center', min: 0, max: 100, defaultVal: 50, unit: 'Hz' },
      { index: 8, name: 'Tilt EQ Low/High', min: -6, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 9, name: 'Wet Mix (%)', min: 0, max: 100, defaultVal: 100 },
      { index: 10, name: 'Processing Mode', min: 0, max: 1, defaultVal: 0 },
      { index: 11, name: 'Detector Mode', min: 0, max: 1, defaultVal: 1 },
      { index: 12, name: 'Detector Input', min: 0, max: 1, defaultVal: 0 },
      { index: 13, name: 'Hard Clip', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Pitch an Octave Down',
    matchName: 'Pitch an Octave Down',
    category: 'Pitch',
    desc: 'Pitch an Octave Down',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Chunk', min: 4, max: 500, defaultVal: 150, unit: 'ms' },
      { index: 1, name: 'Overlap', min: 0, max: 1, defaultVal: 0.5 },
      { index: 2, name: 'Wet Mix', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Dry Mix', min: -120, max: 6, defaultVal: -120, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Pitch an Octave Up',
    matchName: 'Pitch an Octave Up',
    category: 'Pitch',
    desc: 'Pitch an Octave Up',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Chunk', min: 4, max: 500, defaultVal: 120, unit: 'ms' },
      { index: 1, name: 'Overlap', min: 0, max: 1, defaultVal: 0.4 },
      { index: 2, name: 'Wet Mix', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Dry Mix', min: -120, max: 6, defaultVal: -120, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Ozzifier Chorus',
    matchName: 'Ozzifier Chorus [Stillwell]',
    category: 'Modulation',
    desc: 'Ozzifier Chorus',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Number Of Voices', min: 0, max: 6, defaultVal: 2 },
      { index: 1, name: 'Time Spread', min: 0, max: 120, defaultVal: 10, unit: 'ms' },
      { index: 2, name: 'Pitch Spread', min: 0, max: 120, defaultVal: 20, unit: 'cents' },
      { index: 3, name: 'Wet Mix', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 4, name: 'Dry Mix', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 5, name: 'Pan Spread (%)', min: 0, max: 100, defaultVal: 100 }
    ]
  },
  {
    targetName: 'JS: Paranoia Mangler',
    matchName: 'paranoia mangler [remaincalm.org]',
    category: 'Distortion',
    desc: 'Paranoia Mangler',
    author: 'remaincalm.org',
    sliders: [
      { index: 0, name: 'Input Gain', min: -24, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Dry Out', min: -96, max: 12, defaultVal: -3, unit: 'dB' },
      { index: 2, name: 'Wet Out', min: -96, max: 12, defaultVal: -3, unit: 'dB' },
      { index: 3, name: 'Bad Resampler', min: 125, max: 33150, defaultVal: 12000, unit: 'Hz' },
      { index: 4, name: 'Bitcrusher', min: 0, max: 2, defaultVal: 1 },
      { index: 5, name: 'Thermonuclear War', min: 0, max: 16, defaultVal: 0 },
      { index: 6, name: 'Bitdepth', min: 3, max: 10, defaultVal: 8 },
      { index: 7, name: 'Gate (%)', min: 0, max: 100, defaultVal: 0 },
      { index: 12, name: 'Love (%)', min: 0, max: 100, defaultVal: 75 },
      { index: 13, name: 'Jive (%)', min: 0, max: 150, defaultVal: 15 },
      { index: 14, name: 'Attitude', min: 0, max: 3, defaultVal: 1 }
    ]
  }
];

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');
let count = 0;

for (const update of updates) {
  const tName = update.targetName;
  const nameMatch1 = `name: "${tName}"`;
  const nameMatch2 = `name: '${tName}'`;
  const nameMatch3 = `"name": "${tName}"`;
  let nameIndex = srcCode.indexOf(nameMatch1);
  if (nameIndex === -1) nameIndex = srcCode.indexOf(nameMatch2);
  if (nameIndex === -1) nameIndex = srcCode.indexOf(nameMatch3);
  
  if (nameIndex > -1) {
    const slidersStartStr = 'sliders: [';
    const slidersStartStr2 = '"sliders": [';
    let slidersIndex = srcCode.indexOf(slidersStartStr, nameIndex);
    if (slidersIndex === -1) slidersIndex = srcCode.indexOf(slidersStartStr2, nameIndex);
    
    if (slidersIndex > -1) {
        const endOfArray = srcCode.indexOf(']', slidersIndex);
        if (endOfArray > -1) {
            let replacementStr = 'sliders: [\n';
            if (update.sliders.length > 0) {
                replacementStr += update.sliders.map(function(s) { return '      ' + JSON.stringify(s) }).join(',\n') + '\n    ';
            }
            replacementStr += ']';
            
            srcCode = srcCode.slice(0, slidersIndex) + replacementStr + srcCode.slice(endOfArray + 1);
            console.log('Updated existing: ' + tName);
            count++;
        }
    }
  } else {
    console.log('Adding new plugin: ' + update.targetName);
    const newProfile = {
      name: update.targetName,
      shortName: update.matchName,
      category: update.category,
      description: update.desc,
      howItWorks: '',
      proTips: '',
      sliders: update.sliders
    };
    
    const insertion = '  ' + JSON.stringify(newProfile, null, 4).replace(/\n/g, '\n  ');
    const anchor = '\n];';
    const anchor2 = '];';
    let pos = srcCode.lastIndexOf(anchor);
    if (pos === -1) pos = srcCode.lastIndexOf(anchor2);
    
    if (pos > -1) {
      srcCode = srcCode.slice(0, pos) + ',\n' + insertion + srcCode.slice(pos);
      count++;
    } else {
      console.log('Failed to add: ' + update.targetName);
    }
  }
}

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Successfully processed ' + count + ' JSFX updates.');
