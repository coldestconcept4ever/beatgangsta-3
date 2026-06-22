const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Amplitude Modulator',
    matchName: 'Amplitude Modulator [LOSER]',
    category: 'Modulation',
    desc: 'Amplitude Modulator',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Frequency', min: 80, max: 1000, defaultVal: 440, unit: 'Hz' }
    ]
  },
  {
    targetName: 'JS: Apple 2-Pole Lowpass Filter',
    matchName: 'Apple 2-Pole Lowpass Filter [Liteon]',
    category: 'EQ & Filtering',
    desc: 'Apple 2-Pole Lowpass Filter, port from Apple.com AU tutorial',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Cutoff (Scale)', min: 0, max: 100, defaultVal: 100 },
      { index: 2, name: 'Resonance', min: -25, max: 25, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Output', min: -25, max: 25, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Apple 12-Pole Filter',
    matchName: 'Apple 12-Pole Filter [Liteon]',
    category: 'EQ & Filtering',
    desc: 'Apple 12-Pole Filter - Butterworth filter implementation',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'HP Slope', min: 0, max: 6, defaultVal: 0 },
      { index: 2, name: 'HP Cutoff (Scale)', min: 0, max: 100, defaultVal: 0 },
      { index: 3, name: 'HP Resonance', min: -16, max: 16, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'LP Slope', min: 0, max: 6, defaultVal: 0 },
      { index: 5, name: 'LP Cutoff (Scale)', min: 0, max: 100, defaultVal: 100 },
      { index: 6, name: 'LP Resonance', min: -16, max: 16, defaultVal: 0, unit: 'dB' },
      { index: 7, name: 'Output', min: -24, max: 24, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Audio Statistics',
    matchName: 'Audio Statistics [Schwa]',
    category: 'Analysis & Utility',
    desc: 'Audio Statistics analyzer/meter',
    author: 'Schwa',
    sliders: [
      { index: 0, name: 'RMS Window (user input)', min: 50, max: 1000, defaultVal: 300, unit: 'ms' },
      { index: 1, name: 'RMS Meter Min (user input)', min: -44, max: -3, defaultVal: -30, unit: 'dB' },
      { index: 2, name: 'RMS Window Current L', min: -44, max: 3, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'RMS Window Min L', min: -44, max: 3, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'RMS Window Max L', min: -44, max: 3, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'RMS Dynamic Range L', min: 0, max: 18, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'RMS Window Current R', min: -44, max: 3, defaultVal: 0, unit: 'dB' },
      { index: 7, name: 'RMS Window Min R', min: -44, max: 3, defaultVal: 0, unit: 'dB' },
      { index: 8, name: 'RMS Window Max R', min: -44, max: 3, defaultVal: 0, unit: 'dB' },
      { index: 9, name: 'RMS Dynamic Range R', min: 0, max: 18, defaultVal: 0, unit: 'dB' },
      { index: 10, name: 'Peak L', min: -44, max: 3, defaultVal: 0, unit: 'dB' },
      { index: 11, name: 'Peak R', min: -44, max: 3, defaultVal: 0, unit: 'dB' },
      { index: 12, name: 'RMS Total Loudness L', min: -44, max: 3, defaultVal: 0, unit: 'dB' },
      { index: 13, name: 'RMS Total Loudness R', min: -44, max: 3, defaultVal: 0, unit: 'dB' },
      { index: 14, name: 'DC Offset L', min: -1, max: 1, defaultVal: 0 },
      { index: 15, name: 'DC Offset R', min: -1, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Auto Expander',
    matchName: 'Auto Expander [Stillwell]',
    category: 'Dynamics',
    desc: 'Auto Expander',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Threshold', min: -120, max: 0, defaultVal: -120, unit: 'dB' },
      { index: 1, name: 'Ratio', min: 1, max: 20, defaultVal: 1 },
      { index: 2, name: 'Gain', min: -20, max: 20, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Knee', min: 0, max: 3, defaultVal: 2 },
      { index: 4, name: 'Detector Input', min: 0, max: 1, defaultVal: 0 },
      { index: 6, name: 'Detection', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Auto Looper',
    matchName: 'Auto Looper [Cockos]',
    category: 'Sampler',
    desc: 'Auto Looper',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Wet', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Dry', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Threshold', min: -100, max: 60, defaultVal: -30, unit: 'dB' },
      { index: 3, name: 'Threshold Length', min: 1, max: 1000, defaultVal: 100, unit: 'ms' },
      { index: 4, name: 'Edge Overlap', min: 0, max: 400, defaultVal: 60, unit: 'ms' },
      { index: 5, name: 'Minimum Length', min: 0, max: 4000, defaultVal: 100, unit: 'ms' },
      { index: 6, name: 'Decay', min: -100, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 7, name: 'Record', min: 0, max: 1, defaultVal: 1 },
      { index: 8, name: 'Flush Loop On Playback Start', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: FFT Peak-Following Filter',
    matchName: 'FFT Peak-Following Filter [Cockos]',
    category: 'EQ & Filtering',
    desc: 'FFT Peak-Following Filter',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'FFT Size', min: 0, max: 6, defaultVal: 5 },
      { index: 1, name: 'Minimum Center Freq', min: 0, max: 24000, defaultVal: 60, unit: 'Hz' },
      { index: 2, name: 'Maximum Center Freq', min: 0, max: 24000, defaultVal: 8000, unit: 'Hz' },
      { index: 3, name: 'Filter Width', min: 0, max: 8, defaultVal: 2, unit: 'oct' },
      { index: 4, name: 'Peak Gain', min: -120, max: 24, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Non-Peak Gain', min: -120, max: 24, defaultVal: -120, unit: 'dB' },
      { index: 6, name: 'Filter Position Attack Time', min: 0, max: 1000, defaultVal: 120, unit: 'ms' },
      { index: 7, name: 'High End Slope', min: 0.5, max: 1.5, defaultVal: 1.29 }
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
