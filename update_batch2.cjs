const fs = require('fs');

const updates = [
  {
    targetName: 'JS: 4x4 EQ',
    matchName: '4x4 EQ [Stillwell]',
    category: 'EQ & Filtering',
    desc: '4x4 EQ',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Low Drive', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 1, name: 'Low Gain', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Mid Drive', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 3, name: 'Mid Gain', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'High Drive', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 5, name: 'High Gain', min: -12, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'Low-Mid Crossover', min: 60, max: 500, defaultVal: 240, unit: 'Hz' },
      { index: 7, name: 'Mid-High Crossover', min: 510, max: 10000, defaultVal: 2400, unit: 'Hz' }
    ]
  },
  {
    targetName: 'JS: 5-Band Joiner',
    matchName: '5-Band Joiner (Combines Signal From 5-Band Splitter) [LOSER]',
    category: 'Routing & Utility',
    desc: 'Combines Signal From 5-Band Splitter',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Low', min: -24, max: 24, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Mid', min: -24, max: 24, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'High', min: -24, max: 24, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'UberHigh', min: -24, max: 24, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'SomeMore', min: -24, max: 24, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: 50 Hz Kicker',
    matchName: '50 Hz Kicker (Kick Drum Enhancer) [LOSER]',
    category: 'EQ & Filtering',
    desc: 'Kick Drum Enhancer',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Frequency', min: 10, max: 200, defaultVal: 50, unit: 'Hz' },
      { index: 1, name: 'Wet', min: -120, max: 12, defaultVal: -12, unit: 'dB' },
      { index: 2, name: 'Dry', min: -120, max: 12, defaultVal: -3, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: 5-Band Splitter',
    matchName: '5-Band Splitter (Splits In Low:1+2,Mid:3+4,High:5+6,UberHigh:7+8,SomeMore:9+10) [LOSER]',
    category: 'Routing & Utility',
    desc: 'Splits In Low:1+2,Mid:3+4,High:5+6,UberHigh:7+8,SomeMore:9+10',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Crossover 1', min: 0, max: 22000, defaultVal: 200, unit: 'Hz' },
      { index: 1, name: 'Crossover 2', min: 0, max: 22000, defaultVal: 2000, unit: 'Hz' },
      { index: 2, name: 'Crossover 3', min: 0, max: 22000, defaultVal: 5000, unit: 'Hz' },
      { index: 3, name: 'Crossover 4', min: 0, max: 22000, defaultVal: 8000, unit: 'Hz' }
    ]
  },
  {
    targetName: 'JS: ADPCM Simulator',
    matchName: 'ADPCM Simulator',
    category: 'Analysis & Utility',
    desc: 'ADPCM Simulator',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Bits', min: 1, max: 4, defaultVal: 4 },
      { index: 1, name: 'Block Size', min: 2, max: 65538, defaultVal: 4096 },
      { index: 2, name: 'Bit Bias', min: 0, max: 7, defaultVal: 0 },
      { index: 3, name: 'Gain', min: -60, max: 60, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Convolution Dual Amp Modeler',
    matchName: 'Convolution Dual Amp Modeler (mono->stereo)',
    category: 'Guitar Amp/Cabinet',
    desc: 'Convolution Dual Amp Modeler (mono->stereo)',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Model (Left)', min: 0, max: 0, defaultVal: 0 },
      { index: 1, name: 'Model (Right)', min: 0, max: 0, defaultVal: 0 },
      { index: 2, name: 'Preamp', min: -120, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Upsample Impulse If Required', min: 0, max: 2, defaultVal: 2 },
      { index: 4, name: 'Filter Size', min: 0, max: 0, defaultVal: 0 },
      { index: 5, name: 'FFT Size', min: 0, max: 0, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Convolution Amp/Cab Modeler',
    matchName: 'Convolution Amp/Cab Modeler',
    category: 'Guitar Amp/Cabinet',
    desc: 'Convolution Amp/Cab Modeler',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Model', min: 0, max: 0, defaultVal: 0 },
      { index: 1, name: 'Preamp', min: -120, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Upsample Impulse If Required', min: 0, max: 2, defaultVal: 2 },
      { index: 3, name: 'Channel Mode', min: 0, max: 1, defaultVal: 0 },
      { index: 4, name: 'Filter Size', min: 0, max: 0, defaultVal: 0 },
      { index: 5, name: 'FFT Size', min: 0, max: 0, defaultVal: 0 }
    ]
  }
];

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');
let count = 0;

for (const update of updates) {
  const tName = update.targetName;
  const nameMatch1 = 'name: "' + tName + '"';
  const nameMatch2 = "name: '" + tName + "'";
  let nameIndex = srcCode.indexOf(nameMatch1);
  if (nameIndex === -1) nameIndex = srcCode.indexOf(nameMatch2);
  
  if (nameIndex > -1) {
    const slidersStartStr = 'sliders: [';
    const slidersEndStr = '    ]';
    const slidersIndex = srcCode.indexOf(slidersStartStr, nameIndex);
    const endBlockIndex = srcCode.indexOf(slidersEndStr, slidersIndex);
    
    if (slidersIndex > -1 && endBlockIndex > -1) {
      const replacementStr = 'sliders: [\n' + update.sliders.map(function(s) { return '      ' + JSON.stringify(s) }).join(',\n');
      srcCode = srcCode.slice(0, slidersIndex) + replacementStr + srcCode.slice(endBlockIndex);
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
