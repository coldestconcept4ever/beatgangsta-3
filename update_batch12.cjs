const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Master Tom Compressor',
    matchName: 'Master Tom Compressor [Stillwell]',
    category: 'Dynamics',
    desc: 'Master Tom Compressor',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Threshold', min: -60, max: 0, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Ratio', min: 1, max: 20, defaultVal: 1 },
      { index: 2, name: 'Gain', min: -20, max: 20, defaultVal: 0 },
      { index: 3, name: 'Knee', min: 0, max: 3, defaultVal: 2 },
      { index: 4, name: 'Detector Input', min: 0, max: 1, defaultVal: 0 },
      { index: 5, name: 'Automatic Make-Up', min: 0, max: 1, defaultVal: 0 },
      { index: 6, name: 'Detection', min: 0, max: 1, defaultVal: 0 },
      { index: 7, name: 'Detection Source', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MDCT Filter',
    matchName: 'MDCT Filter',
    category: 'Filter',
    desc: 'MDCT Filter',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Bands', min: 32, max: 512, defaultVal: 128 },
      { index: 1, name: 'Start Band', min: 0, max: 512, defaultVal: 4 },
      { index: 2, name: 'End Band', min: 0, max: 512, defaultVal: 8 },
      { index: 3, name: 'Adjust', min: -120, max: 120, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: MDCT Shifter',
    matchName: 'MDCT Shifter',
    category: 'Pitch',
    desc: 'MDCT Shifter',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Bands', min: 32, max: 512, defaultVal: 128 },
      { index: 1, name: 'Band Shift (neg=down, pos=up)', min: -512, max: 512, defaultVal: 4 }
    ]
  },
  {
    targetName: 'JS: MDCT Sweeping Filter',
    matchName: 'MDCT Sweeping Filter',
    category: 'Filter',
    desc: 'MDCT Sweeping Filter',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Min Frequency (0..1)', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Max Frequency (0..1)', min: 0, max: 1, defaultVal: 0.05 },
      { index: 2, name: 'Sweep Interval', min: 10, max: 30000, defaultVal: 1000, unit: 'ms' },
      { index: 3, name: 'Low Gain', min: -120, max: 120, defaultVal: -6, unit: 'dB' },
      { index: 4, name: 'High Gain', min: -120, max: 120, defaultVal: 12, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: MGA JS Limiter',
    matchName: 'MGA JS Limiter',
    category: 'Dynamics',
    desc: 'MGA JS Limiter',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Threshold', min: -30, max: 0, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Release', min: 0, max: 500, defaultVal: 200, unit: 'ms' },
      { index: 2, name: 'Ceiling', min: -6, max: 0, defaultVal: -0.1 }
    ]
  },
  {
    targetName: 'JS: MGA JS Limiter (Unlinked Stereo)',
    matchName: 'MGA JS Limiter (Unlinked Stereo)',
    category: 'Dynamics',
    desc: 'MGA JS Limiter (Unlinked Stereo)',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Threshold', min: -30, max: 0, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Release', min: 0, max: 500, defaultVal: 200, unit: 'ms' },
      { index: 2, name: 'Link Stereo', min: 0, max: 100, defaultVal: 75, unit: '%' },
      { index: 3, name: 'Ceiling', min: -6, max: 0, defaultVal: -0.1 }
    ]
  },
  {
    targetName: 'JS: MIDI Arpeggiator',
    matchName: 'MIDI Arpeggiator',
    category: 'MIDI',
    desc: 'MIDI Arpeggiator',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Rate (x BPM)', min: 0, max: 16, defaultVal: 1 },
      { index: 1, name: 'Note Length', min: 0.01, max: 1, defaultVal: 1 },
      { index: 2, name: 'Mode', min: 0, max: 3, defaultVal: 0 },
      { index: 3, name: 'Number Of Variants', min: 0, max: 3, defaultVal: 0 },
      { index: 4, name: 'Variant 1', min: -64, max: 64, defaultVal: 0 },
      { index: 5, name: 'Variant 2', min: -64, max: 64, defaultVal: 0 },
      { index: 6, name: 'Variant 3', min: -64, max: 64, defaultVal: 0 },
      { index: 7, name: 'Velocity (0=use played velocity)', min: 0, max: 127, defaultVal: 127 }
    ]
  },
  {
    targetName: 'JS: MIDI CC Mapper',
    matchName: 'MIDI CC Mapper',
    category: 'MIDI',
    desc: 'MIDI CC Mapper',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Controller Source', min: 0, max: 127, defaultVal: 1 },
      { index: 1, name: 'Controller Target', min: 0, max: 127, defaultVal: 1 },
      { index: 2, name: 'Clamp Low Value', min: 0, max: 127, defaultVal: 0 },
      { index: 3, name: 'Clamp High Value', min: 0, max: 127, defaultVal: 127 },
      { index: 4, name: 'Pass Through CC Source', min: 0, max: 1, defaultVal: 0 }
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
