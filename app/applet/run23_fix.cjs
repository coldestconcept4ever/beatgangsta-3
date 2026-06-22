const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Stereo Field Manipulator',
    matchName: 'Stereo Field Manipulator [LOSER]',
    category: 'Stereo & Spatial',
    desc: 'Stereo Field Manipulator',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Rotate', min: -90, max: 90, defaultVal: 0, unit: 'deg' },
      { index: 1, name: 'Width (%)', min: 0, max: 200, defaultVal: 100 },
      { index: 2, name: 'Center (%)', min: -100, max: 100, defaultVal: 0 },
      { index: 3, name: 'Left/Right (%)', min: -100, max: 100, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Channel Polarity Control',
    matchName: 'Channel Polarity Control [IXix]',
    category: 'Analysis & Utility',
    desc: 'Channel Polarity Control',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Polarity Mode', min: 0, max: 3, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Stereo Width',
    matchName: 'Stereo Width [Stillwell]',
    category: 'Stereo & Spatial',
    desc: 'Stereo Width',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Width Boost', min: -20, max: 20, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Center Boost', min: -20, max: 20, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Gain', min: -20, max: 20, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Width Balance (%)', min: -100, max: 100, defaultVal: 0 },
      { index: 4, name: 'Width Rotation', min: -90, max: 90, defaultVal: 0, unit: 'deg' }
    ]
  },
  {
    targetName: 'JS: Super8 MIDI-controlled synchronized looper',
    matchName: 'Super8 MIDI-controlled synchronized looper (Cockos)',
    category: 'MIDI',
    desc: 'Super8 MIDI-controlled synchronized looper',
    author: 'Cockos',
    sliders: [
      { index: 0, name: '-Sync', min: 0, max: 2, defaultVal: 0 },
      { index: 3, name: '-Click count/length', min: 0, max: 64, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Pitch Shifter 2',
    matchName: 'Pitch Shifter 2',
    category: 'Pitch',
    desc: 'Pitch Shifter 2',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Pitch Adjust (cents)', min: -100, max: 100, defaultVal: 0 },
      { index: 1, name: 'Pitch Adjust (st)', min: -12, max: 12, defaultVal: 0 },
      { index: 2, name: 'Pitch Adjust (oct)', min: -12, max: 12, defaultVal: 0 },
      { index: 3, name: 'Window Size', min: 0, max: 200, defaultVal: 50, unit: 'ms' },
      { index: 4, name: 'Overlap Size', min: 0.05, max: 50, defaultVal: 20, unit: 'ms' },
      { index: 5, name: 'Wet Mix', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'Dry Mix', min: -120, max: 6, defaultVal: -120, unit: 'dB' },
      { index: 7, name: 'Filter', min: 0, max: 1, defaultVal: 1 }
    ]
  },
  {
    targetName: 'JS: Sweeping Resonant Lowpass Filter',
    matchName: 'Sweeping Resonant Lowpass Filter',
    category: 'Filter',
    desc: 'Sweeping Resonant Lowpass Filter',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Frequency 1', min: 20, max: 20000, defaultVal: 1000, unit: 'Hz' },
      { index: 1, name: 'Frequency 2', min: 20, max: 20000, defaultVal: 2000, unit: 'Hz' },
      { index: 2, name: 'Sweep Time', min: 0.1, max: 30, defaultVal: 2, unit: 'sec' },
      { index: 3, name: 'Resonance', min: 0, max: 1, defaultVal: 0.8 }
    ]
  },
  {
    targetName: 'JS: 8-Channel Input Switcher',
    matchName: '8-Channel Input Switcher [IXix]',
    category: 'Routing',
    desc: '8-Channel Input Switcher',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Output Source', min: 0, max: 3, defaultVal: 0 },
      { index: 1, name: 'Level 1+2', min: -60, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Level 3+4', min: -60, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Level 5+6', min: -60, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'Level 7+8', min: -60, max: 30, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: SwixMitch (4x Stereo In, 2 Bus X-Fader)',
    matchName: 'SwixMitch 4x Stereo Input 2 Bus X-Fader [IXix]',
    category: 'Mixer',
    desc: 'SwixMitch (4x Stereo In, 2 Bus X-Fader)',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Destination 1+2', min: 0, max: 3, defaultVal: 3 },
      { index: 1, name: 'Destination 3+4', min: 0, max: 3, defaultVal: 0 },
      { index: 2, name: 'Destination 5+6', min: 0, max: 3, defaultVal: 0 },
      { index: 3, name: 'Destination 7+8', min: 0, max: 3, defaultVal: 0 },
      { index: 4, name: 'Mix A<>B', min: 0, max: 1, defaultVal: 0.5 }
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
