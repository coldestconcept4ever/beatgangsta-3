const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Digital Versatile Compressor v2',
    matchName: 'Digital Versatile Compressor v2 [LOSER]',
    category: 'Dynamics',
    desc: 'Digital Versatile Compressor v2',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Threshold', min: -30, max: -0.1, defaultVal: -0.1, unit: 'dB' },
      { index: 1, name: 'Ratio', min: 1, max: 20, defaultVal: 1, unit: ' ' },
      { index: 2, name: 'Attack', min: 0, max: 500, defaultVal: 20, unit: 'ms' },
      { index: 3, name: 'Release', min: 0, max: 1000, defaultVal: 200, unit: 'ms' },
      { index: 4, name: 'RMS Size', min: 0, max: 100, defaultVal: 0, unit: 'ms' },
      { index: 5, name: 'Auto Make-Up', min: 0, max: 1, defaultVal: 1 },
      { index: 6, name: 'Output', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 7, name: 'Character', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Digital Versatile Compressor',
    matchName: 'Digital Versatile Compressor (DVC) [LOSER]',
    category: 'Dynamics',
    desc: 'Digital Versatile Compressor',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Threshold', min: -30, max: -0.1, defaultVal: -0.1, unit: 'dB' },
      { index: 1, name: 'Ratio', min: 1, max: 20, defaultVal: 1 },
      { index: 2, name: 'Attack', min: 0, max: 500, defaultVal: 20, unit: 'ms' },
      { index: 3, name: 'Release', min: 0, max: 1000, defaultVal: 200, unit: 'ms' },
      { index: 4, name: 'Auto Make-Up', min: 0, max: 1, defaultVal: 1 },
      { index: 5, name: 'Output', min: -12, max: 12, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Event Horizon Clipper',
    matchName: 'Event Horizon Clipper [Stillwell]',
    category: 'Dynamics',
    desc: 'Event Horizon Clipper',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Threshold', min: -30, max: 0, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Ceiling', min: -20, max: 0, defaultVal: -0.1, unit: 'dB' },
      { index: 2, name: 'Soft Clip', min: 0, max: 6, defaultVal: 2, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Event Horizon Limiter/Clipper',
    matchName: 'Event Horizon Limiter/Clipper [Stillwell]',
    category: 'Dynamics',
    desc: 'Event Horizon Limiter/Clipper',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Threshold', min: -30, max: 0, defaultVal: 0 },
      { index: 1, name: 'Ceiling', min: -20, max: 0, defaultVal: -0.1 },
      { index: 2, name: 'Release', min: 0, max: 1200, defaultVal: 30, unit: 'ms' }
    ]
  },
  {
    targetName: 'JS: Exciter (Treble Enhancer)',
    matchName: 'Exciter (Treble Enhancer) [Stillwell]',
    category: 'Exciter',
    desc: 'Exciter (Treble Enhancer)',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Mix', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 1, name: 'Drive', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 2, name: 'Frequency', min: 2000, max: 10000, defaultVal: 5000, unit: 'Hz' }
    ]
  },
  {
    targetName: 'JS: Exciter',
    matchName: 'Exciter [LOSER]',
    category: 'Exciter',
    desc: 'Exciter (Treble Enhancer)',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Frequency', min: 100, max: 18000, defaultVal: 2000, unit: 'Hz' },
      { index: 1, name: 'Clip Boost', min: 0, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Harmonics', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 3, name: 'Mix Back', min: -120, max: 0, defaultVal: -6, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Downward Expander',
    matchName: 'Downward Expander [Stillwell]',
    category: 'Dynamics',
    desc: 'Downward Expander',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Threshold', min: -120, max: 0, defaultVal: -120, unit: 'dB' },
      { index: 1, name: 'Ratio', min: 1, max: 20, defaultVal: 1 },
      { index: 2, name: 'Gain', min: -20, max: 20, defaultVal: 0 },
      { index: 3, name: 'Detector Input', min: 0, max: 1, defaultVal: 0 },
      { index: 4, name: 'Detection', min: 0, max: 3, defaultVal: 2 },
      { index: 5, name: 'Attack', min: 0, max: 200, defaultVal: 30, unit: 'ms' },
      { index: 6, name: 'Release', min: 0, max: 100, defaultVal: 2, unit: 'ms' }
    ]
  },
  {
    targetName: 'JS: FFT Splitter',
    matchName: 'FFT Splitter',
    category: 'Routing & Utility',
    desc: 'FFT Splitter',
    author: 'Schwa',
    sliders: [
      { index: 0, name: 'FFT Size', min: 0, max: 4, defaultVal: 2 },
      { index: 1, name: 'Split Frequency', min: 0, max: 20000, defaultVal: 5000, unit: 'Hz' },
      { index: 2, name: 'Low Band Destination', min: 0, max: 4, defaultVal: 0 },
      { index: 3, name: 'High Band Destination', min: 0, max: 4, defaultVal: 1 }
    ]
  }
];

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');
let count = 0;

for (const update of updates) {
  const tName = update.targetName;
  const nameMatch1 = 'name: "' + tName + '"';
  const nameMatch2 = "name: '" + tName + "'";
  const nameMatch3 = '"name": "' + tName + '"';
  let nameIndex = srcCode.indexOf(nameMatch1);
  if (nameIndex === -1) nameIndex = srcCode.indexOf(nameMatch2);
  if (nameIndex === -1) nameIndex = srcCode.indexOf(nameMatch3);
  
  if (nameIndex > -1) {
    const slidersIndex = srcCode.indexOf('sliders: [', nameIndex);
    const endBlockIndex = srcCode.indexOf(']', slidersIndex);
    
    if (slidersIndex > -1 && endBlockIndex > -1) {
        const replacementStr = 'sliders: [\n' + update.sliders.map(function(s) { return '      ' + JSON.stringify(s) }).join(',\n') + '\n    ';
        srcCode = srcCode.slice(0, slidersIndex) + replacementStr + srcCode.slice(endBlockIndex + 1);
        console.log('Updated existing: ' + tName);
        count++;
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
    
    const insertion = '  ' + JSON.stringify(newProfile, null, 4);
    const anchor = '];';
    const pos = srcCode.lastIndexOf(anchor);
    if (pos > -1) {
      srcCode = srcCode.slice(0, pos) + ',\n' + insertion + '\n' + srcCode.slice(pos);
      count++;
    } else {
      console.log('Failed to add: ' + update.targetName);
    }
  }
}

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Successfully processed ' + count + ' JSFX updates.');
