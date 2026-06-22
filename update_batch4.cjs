const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Bad Buss Mojo Waveshaper w/AA',
    matchName: 'Bad Buss Mojo Waveshaper w/AA [Stillwell]',
    category: 'Distortion',
    desc: 'Bad Buss Mojo Waveshaper w/AA',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Pos Threshold', min: -60, max: 0, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Neg Threshold', min: -60, max: 0, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Pos Nonlinearity', min: 1, max: 2, defaultVal: 1 },
      { index: 3, name: 'Neg Nonlinearity', min: 1, max: 2, defaultVal: 1 },
      { index: 4, name: 'Pos Knee', min: 0, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Neg Knee', min: 0, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'Mod A', min: 0, max: 100, defaultVal: 0 },
      { index: 7, name: 'Mod B', min: 0, max: 100, defaultVal: 0 },
      { index: 8, name: 'Oversampling (times)', min: 1, max: 32, defaultVal: 2 },
      { index: 9, name: 'Limit to 0 dBFS', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Bad Buss Mojo Waveshaper',
    matchName: 'Bad Buss Mojo Waveshaper [Stillwell]',
    category: 'Distortion',
    desc: 'Bad Buss Mojo Waveshaper',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Pos Threshold', min: -60, max: 0, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Neg Threshold', min: -60, max: 0, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Pos Nonlinearity', min: 1, max: 2, defaultVal: 1 },
      { index: 3, name: 'Neg Nonlinearity', min: 1, max: 2, defaultVal: 1 },
      { index: 4, name: 'Pos Knee', min: 0, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Neg Knee', min: 0, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'Mod A', min: 0, max: 100, defaultVal: 0 },
      { index: 7, name: 'Mod B', min: 0, max: 100, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Bass Manager/Booster',
    matchName: 'BassManager (plugin for boosting bass) [Liteon]',
    category: 'EQ & Filtering',
    desc: 'BassManager for boosting bass',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Spread', min: 0, max: 1, defaultVal: 0 },
      { index: 2, name: 'Frequency', min: 30, max: 250, defaultVal: 90, unit: 'Hz' },
      { index: 3, name: 'Boost', min: 0, max: 24, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'Drive', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 5, name: 'Muffle', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 6, name: 'Output', min: -24, max: 24, defaultVal: 0, unit: 'dB' },
      { index: 7, name: 'Highpass', min: 0, max: 4, defaultVal: 0, unit: 'Hz' },
      { index: 8, name: 'Limiter', min: 0, max: 1, defaultVal: 0 },
      { index: 9, name: 'Oversample (x2)', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Avocado Ducking Glitch Generator',
    matchName: 'Avocado Ducking Glitch Generator [remaincalm.org]',
    category: 'Modulation & Pitch',
    desc: 'Avocado Ducking Glitch Generator',
    author: 'remaincalm.org',
    sliders: [
      { index: 0, name: 'Buffer Length', min: 0, max: 4000, defaultVal: 50, unit: 'ms' },
      { index: 1, name: 'Mix', min: 0, max: 100, defaultVal: 90, unit: '%' },
      { index: 2, name: 'Buffers', min: 1, max: 16, defaultVal: 8 },
      { index: 3, name: 'Repeat Probability', min: 0, max: 99, defaultVal: 70, unit: '%' },
      { index: 4, name: 'Pitch Modulation Probability', min: 0, max: 100, defaultVal: 5, unit: '%' },
      { index: 5, name: 'Reverse Probability', min: 0, max: 99, defaultVal: 10, unit: '%' },
      { index: 6, name: 'Fadeout Probability', min: 0, max: 99, defaultVal: 18, unit: '%' },
      { index: 7, name: 'Threshold', min: 0, max: 99, defaultVal: 8, unit: '%' },
      { index: 8, name: 'Glitch Attack', min: 0, max: 99, defaultVal: 15, unit: '%' },
      { index: 9, name: 'Arpeggiator Mode', min: 0, max: 4, defaultVal: 0 },
      { index: 10, name: 'Tempo Sync', min: 0, max: 64, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Bit Meter',
    matchName: 'Bit Meter (Cockos)',
    category: 'Analysis & Utility',
    desc: 'Bit Meter',
    author: 'Cockos',
    sliders: []
  },
  {
    targetName: 'JS: Butterworth 4-Pole Filter',
    matchName: 'Butterworth 4-Pole Filter',
    category: 'EQ & Filtering',
    desc: 'Butterworth 4-Pole Filter',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Filter Type', min: 0, max: 1, defaultVal: 0 },
      { index: 2, name: 'Cutoff (Scale)', min: 0, max: 100, defaultVal: 100 },
      { index: 3, name: 'Resonance', min: 0, max: 0.9, defaultVal: 0 },
      { index: 4, name: 'Output', min: -25, max: 25, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Limiter', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Center Canceler',
    matchName: 'Center Canceler [LOSER]',
    category: 'Analysis & Utility',
    desc: 'Center Canceler',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Amount', min: 0, max: 100, defaultVal: 0, unit: '%' }
    ]
  },
  {
    targetName: 'JS: Stereo Channel Volume/Pan/Polarity Control',
    matchName: 'Stereo Channel Volume/Pan/Polarity Control',
    category: 'Analysis & Utility',
    desc: 'Stereo Channel Volume/Pan/Polarity Control',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Left Volume', min: -120, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Left Pan', min: -1, max: 1, defaultVal: -1 },
      { index: 2, name: 'Left Phase', min: 0, max: 1, defaultVal: 0 },
      { index: 3, name: 'Right Volume', min: -120, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'Right Pan', min: -1, max: 1, defaultVal: 1 },
      { index: 5, name: 'Right Phase', min: 0, max: 1, defaultVal: 0 }
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
