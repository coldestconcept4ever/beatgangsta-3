const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Presence EQ',
    matchName: 'Presence EQ (Moorer)',
    category: 'EQ & Filtering',
    desc: 'Presence EQ',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Frequency', min: 3100, max: 18500, defaultVal: 7700, unit: 'Hz' },
      { index: 2, name: 'Cut/Boost', min: -15, max: 15, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Bandwidth', min: 0.07, max: 0.40, defaultVal: 0.20 },
      { index: 4, name: 'Output', min: -25, max: 25, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: MIDI Program/Bank Switch on Load',
    matchName: 'MIDI Program/Bank Switch on Load',
    category: 'MIDI',
    desc: 'MIDI Program/Bank Switch on Load',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'MIDI Channel', min: 1, max: 16, defaultVal: 1 },
      { index: 1, name: 'MSB', min: 0, max: 127, defaultVal: 0 },
      { index: 2, name: 'LSB', min: 0, max: 127, defaultVal: 0 },
      { index: 3, name: 'Program', min: 0, max: 127, defaultVal: 0 },
      { index: 4, name: 'Has Sent', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MDA Pseudo-Stereo',
    matchName: 'MDA Pseudo-Stereo',
    category: 'Stereo & Spatial',
    desc: 'Pseudo-Stereo',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Amount/Type (%) (neg=Haas,pos=Comb)', min: -100, max: 100, defaultVal: 0 },
      { index: 1, name: 'Delay', min: 1, max: 50, defaultVal: 20, unit: 'ms' },
      { index: 2, name: 'Balance (L/R)', min: -100, max: 100, defaultVal: 0 },
      { index: 3, name: 'Output', min: -20, max: 20, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: MIDI Note Randomize',
    matchName: 'MIDI Note Randomize [Stillwell]',
    category: 'MIDI',
    desc: 'MIDI Note Randomize',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Input MIDI Note #', min: 0, max: 127, defaultVal: 60 },
      { index: 1, name: 'Input Channel (0=omni)', min: 0, max: 16, defaultVal: 0 },
      { index: 2, name: 'Lowest Output Note', min: 0, max: 127, defaultVal: 48 },
      { index: 3, name: 'Highest Output Note', min: 0, max: 127, defaultVal: 72 },
      { index: 4, name: 'Mix (%)', min: 0, max: 100, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: RBJ 1073 EQ',
    matchName: 'RBJ 1073 EQ [Stillwell]',
    category: 'EQ & Filtering',
    desc: 'RBJ 1073 EQ',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'HPF', min: 0, max: 4, defaultVal: 0 },
      { index: 1, name: 'Low Shelf (Hz)', min: 0, max: 4, defaultVal: 0 },
      { index: 2, name: 'Low Boost/Cut', min: -20, max: 20, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Mid Freq (Hz)', min: 0, max: 5, defaultVal: 0 },
      { index: 4, name: 'Mid Boost/Cut', min: -20, max: 20, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'High Shelf (12k) Boost/Cut', min: -20, max: 20, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'Gain', min: -20, max: 10, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: RBJ 12-Band EQ w/HPF',
    matchName: 'RBJ 12-Band EQ w/HPF',
    category: 'EQ & Filtering',
    desc: 'RBJ 12-Band EQ w/HPF',
    author: 'teej',
    sliders: [
      { index: 0, name: 'HPF', min: 0, max: 400, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Low Shelf', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 2, name: '80 Hz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 3, name: '150 Hz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 4, name: '250 Hz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 5, name: '400 Hz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 6, name: '630 Hz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 7, name: '800 Hz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 8, name: '1.6 kHz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 9, name: '3 kHz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 10, name: '5 kHz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 11, name: '7 kHz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 12, name: '10 kHz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 13, name: '12 kHz', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 14, name: 'LPF', min: 400, max: 22000, defaultVal: 22000, unit: 'dB' },
      { index: 15, name: 'Output Gain', min: -12, max: 12, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: RBJ 4-Band Semi-Parametric EQ v2',
    matchName: 'RBJ 4-Band Semi-Parametric EQ v2 [teej]',
    category: 'EQ & Filtering',
    desc: 'RBJ 4-Band Semi-Parametric EQ v2',
    author: 'teej',
    sliders: [
      { index: 0, name: 'HPF', min: 0, max: 400, defaultVal: 0, unit: 'Hz' },
      { index: 1, name: 'Freq 1', min: 0, max: 10000, defaultVal: 0, unit: 'Hz' },
      { index: 2, name: 'Q 1', min: 0.5, max: 10, defaultVal: 1 },
      { index: 3, name: 'Gain 1', min: -12, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'Freq 2', min: 0, max: 10000, defaultVal: 0, unit: 'Hz' },
      { index: 5, name: 'Q 2', min: 0.5, max: 10, defaultVal: 1 },
      { index: 6, name: 'Gain 2', min: -12, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 7, name: 'Freq 3', min: 0, max: 10000, defaultVal: 0, unit: 'Hz' },
      { index: 8, name: 'Q 3', min: 0.5, max: 10, defaultVal: 1 },
      { index: 9, name: 'Gain 3', min: -12, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 10, name: 'Freq 4', min: 0, max: 10000, defaultVal: 0, unit: 'Hz' },
      { index: 11, name: 'Q 4', min: 0.5, max: 10, defaultVal: 1 },
      { index: 12, name: 'Gain 4', min: -12, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 13, name: 'LPF', min: 400, max: 22000, defaultVal: 22000, unit: 'Hz' },
      { index: 14, name: 'Output Gain', min: -12, max: 12, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: RBJ 4-Band Semi-Parametric EQ',
    matchName: 'RBJ 4-Band Semi-Parametric EQ [Stillwell]',
    category: 'EQ & Filtering',
    desc: 'RBJ 4-Band Semi-Parametric EQ',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Frequency 1', min: 1, max: 5, defaultVal: 3, unit: 'Hz' },
      { index: 1, name: 'Boost/Cut 1', min: -15, max: 15, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Frequency 2', min: 1, max: 5, defaultVal: 3, unit: 'Hz' },
      { index: 3, name: 'Boost/Cut 2', min: -15, max: 15, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'Frequency 3', min: 1, max: 5, defaultVal: 3, unit: 'Hz' },
      { index: 5, name: 'Boost/Cut 3', min: -15, max: 15, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'Frequency 4', min: 1, max: 5, defaultVal: 3, unit: 'Hz' },
      { index: 7, name: 'Boost/Cut 4', min: -15, max: 15, defaultVal: 0, unit: 'dB' }
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
