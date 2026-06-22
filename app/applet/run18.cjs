const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Phase Rotator',
    matchName: 'Phase Rotator',
    category: 'Processing',
    desc: 'Phase Rotator',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'Phase Adjustment', min: -180, max: 180, defaultVal: 0 },
      { index: 1, name: 'FFT Size', min: 0, max: 4, defaultVal: 2 }
    ]
  },
  {
    targetName: 'JS: Channel Router w/Polarity',
    matchName: 'Channel Router w/Polarity [IXix]',
    category: 'Routing',
    desc: 'Channel Router w/Polarity',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Input Channels', min: 0, max: 31, defaultVal: 0 },
      { index: 1, name: 'Polarity Mode', min: 0, max: 3, defaultVal: 0 },
      { index: 2, name: 'Output Channels', min: 0, max: 31, defaultVal: 0 },
      { index: 3, name: 'Output Mode', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Channel Phase Meter',
    matchName: 'Channel Phase Meter',
    category: 'Analysis & Utility',
    desc: 'Channel Phase Meter',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Sample Rate', min: 0, max: 192000, defaultVal: 0 },
      { index: 1, name: 'Output', min: 0, max: 1, defaultVal: 0 },
      { index: 2, name: 'Stereo Channels', min: 0, max: 2, defaultVal: 0 },
      { index: 3, name: 'Check Interval', min: 0, max: 1000, defaultVal: 200, unit: 'ms' }
    ]
  },
  {
    targetName: 'JS: 4-Tap Phaser',
    matchName: '4-Tap Phaser',
    category: 'Modulation',
    desc: '4-Tap Phaser',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Rate (Hz)', min: 0, max: 10, defaultVal: 0.5 },
      { index: 1, name: 'Range Min (Hz)', min: 40, max: 20000, defaultVal: 440 },
      { index: 2, name: 'Range Max (Hz)', min: 40, max: 20000, defaultVal: 1600 },
      { index: 3, name: 'Feedback (dB)', min: -120, max: -1, defaultVal: -3 },
      { index: 4, name: 'Wet Mix (dB)', min: -120, max: 12, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Pink Noise Generator',
    matchName: 'Pink Noise Generator',
    category: 'Synthesis',
    desc: 'Pink Noise Generator',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Mode', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Noise', min: -25, max: 25, defaultVal: -6, unit: 'dB' },
      { index: 2, name: 'Dry', min: -25, max: 25, defaultVal: -6, unit: 'dB' },
      { index: 3, name: 'Output', min: -25, max: 25, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Pitch Down-Shifter 2',
    matchName: 'Pitch Down-Shifter 2',
    category: 'Pitch',
    desc: 'Pitch Down-Shifter 2',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Octaves Down', min: 0, max: 6, defaultVal: 1 },
      { index: 1, name: 'Semitones Down', min: 0, max: 11, defaultVal: 0 },
      { index: 2, name: 'Cents Down', min: 0, max: 99, defaultVal: 0 },
      { index: 3, name: 'Chunk Size (ms)', min: 4, max: 500, defaultVal: 250 },
      { index: 4, name: 'Overlap Size', min: 0.001, max: 1, defaultVal: 0.5 },
      { index: 5, name: 'Dry Mix (dB)', min: -120, max: 6, defaultVal: -120 },
      { index: 6, name: 'Subdivide Ratio', min: 0.1, max: 1, defaultVal: 0.9 },
      { index: 7, name: 'Subdivide', min: 1, max: 8, defaultVal: 4 }
    ]
  },
  {
    targetName: 'JS: Pitch Down-Shifter',
    matchName: 'Pitch Down-Shifter',
    category: 'Pitch',
    desc: 'Pitch Down-Shifter',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Octaves Down', min: 0, max: 6, defaultVal: 1 },
      { index: 1, name: 'Semitones Down', min: 0, max: 11, defaultVal: 0 },
      { index: 2, name: 'Cents Down', min: 0, max: 99, defaultVal: 0 },
      { index: 3, name: 'Chunk Size', min: 4, max: 500, defaultVal: 100, unit: 'ms' },
      { index: 4, name: 'Overlap Size', min: 0.001, max: 1, defaultVal: 1 },
      { index: 5, name: 'Wet Mix', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'Dry Mix', min: -120, max: 6, defaultVal: -120, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Ping Pong Pan',
    matchName: 'Ping Pong Pan',
    category: 'Modulation',
    desc: 'Ping Pong Pan',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Frequency (Hz)', min: 0, max: 20, defaultVal: 0.25 },
      { index: 1, name: 'Width (%)', min: 0, max: 100, defaultVal: 75 }
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
