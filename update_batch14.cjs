const fs = require('fs');

const updates = [
  {
    targetName: 'JS: MIDI Examiner',
    matchName: 'MIDI Examiner [Schwa]',
    category: 'Analysis & Utility',
    desc: 'MIDI Examiner',
    author: 'Schwa',
    sliders: [
      { index: 0, name: 'Sample Offset Within @block', min: 0, max: 255, defaultVal: 0 },
      { index: 1, name: 'Status Byte', min: 0, max: 255, defaultVal: 0 },
      { index: 2, name: 'Data Byte 1', min: 0, max: 127, defaultVal: 0 },
      { index: 3, name: 'Data Byte 2', min: 0, max: 127, defaultVal: 0 },
      { index: 4, name: 'Status High Bits', min: 0, max: 16, defaultVal: 0 },
      { index: 5, name: 'Status Low Bits', min: 0, max: 16, defaultVal: 0 },
      { index: 6, name: 'Status High Bits Interpretation', min: 0, max: 8, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Velocity and Timing Humanizer',
    matchName: 'MIDI Velocity and Timing Humanizer [Schwa]',
    category: 'MIDI',
    desc: 'MIDI Velocity and Timing Humanizer',
    author: 'Schwa',
    sliders: [
      { index: 0, name: 'Baseline Velocity (0=use original)', min: 0, max: 127, defaultVal: 0 },
      { index: 1, name: 'Add 1 Beat Delay', min: 0, max: 1, defaultVal: 0 },
      { index: 2, name: 'Bias Timing Humanization', min: -10, max: 10, defaultVal: 0, unit: 'ms' },
      { index: 3, name: 'Timing Humanization Level', min: 0, max: 10, defaultVal: 0 },
      { index: 4, name: 'Velocity Humanization Level', min: 0, max: 10, defaultVal: 0 },
      { index: 5, name: 'MIDI Channel (0=omni)', min: 0, max: 16, defaultVal: 0 },
      { index: 6, name: 'Output Timing Humanization', min: -30, max: 30, defaultVal: 0, unit: 'ms' },
      { index: 7, name: 'Output Velocity Humanization', min: -64, max: 64, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Snap To Key',
    matchName: 'MIDI Snap To Key [IXix]',
    category: 'MIDI',
    desc: 'MIDI Snap To Key',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Input Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 1, name: 'Note Min', min: 0, max: 127, defaultVal: 0 },
      { index: 2, name: 'Note Max', min: 0, max: 127, defaultVal: 127 },
      { index: 3, name: 'Root Note', min: 0, max: 11, defaultVal: 0 },
      { index: 4, name: 'Scale File', min: 0, max: 0, defaultVal: 0 },
      { index: 5, name: 'Mode', min: 0, max: 1, defaultVal: 1 },
      { index: 6, name: 'On/Off', min: 0, max: 1, defaultVal: 1 }
    ]
  },
  {
    targetName: 'JS: MIDI Map To Key v2',
    matchName: 'MIDI Map To Key v2 [IXix]',
    category: 'MIDI',
    desc: 'MIDI Map To Key v2',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Input Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 1, name: 'Mapping File', min: 0, max: 0, defaultVal: 0 },
      { index: 2, name: 'Note In', min: 0, max: 127, defaultVal: 0 },
      { index: 3, name: 'Note Out', min: 0, max: 127, defaultVal: 0 },
      { index: 4, name: 'Reload Mapping', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Map To Key',
    matchName: 'MIDI Map To Key',
    category: 'MIDI',
    desc: 'MIDI Map To Key',
    author: 'Justin Frankel',
    sliders: [
      { index: 0, name: 'Key', min: 0, max: 11, defaultVal: 0 },
      { index: 2, name: 'Lowest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 0 },
      { index: 3, name: 'Highest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 127 }
    ]
  },
  {
    targetName: 'JS: MIDI Modal Randomness',
    matchName: 'MIDI Modal Randomness [Schwa]',
    category: 'MIDI',
    desc: 'MIDI Modal Randomness',
    author: 'Schwa',
    sliders: [
      { index: 0, name: 'Interval A', min: 0, max: 11, defaultVal: 0 },
      { index: 1, name: 'Probability A', min: 0, max: 100, defaultVal: 50 },
      { index: 2, name: 'Interval B', min: 0, max: 11, defaultVal: 4 },
      { index: 3, name: 'Probability B', min: 0, max: 100, defaultVal: 30 },
      { index: 4, name: 'Interval C', min: 0, max: 11, defaultVal: 7 },
      { index: 5, name: 'Probability C', min: 0, max: 100, defaultVal: 40 },
      { index: 6, name: 'Interval D', min: 0, max: 11, defaultVal: 9 },
      { index: 7, name: 'Probability D', min: 0, max: 100, defaultVal: 20 },
      { index: 8, name: 'Speed', min: 0, max: 100, defaultVal: 50 },
      { index: 9, name: 'Octave Randomness', min: 0, max: 100, defaultVal: 50 },
      { index: 10, name: 'Timing Randomness', min: 0, max: 100, defaultVal: 50 },
      { index: 11, name: 'Velocity Randomness', min: 0, max: 100, defaultVal: 50 },
      { index: 12, name: 'Decay Time', min: 0, max: 600, defaultVal: 10, unit: 'sec' },
      { index: 13, name: 'Number Of Simultaneous Notes', min: 0, max: 8, defaultVal: 4 },
      { index: 14, name: 'Quantize Targets Per Beat', min: 1, max: 8, defaultVal: 4 },
      { index: 15, name: 'Quantize Strength', min: 0, max: 100, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Note Filter',
    matchName: 'MIDI Note Filter',
    category: 'MIDI',
    desc: 'MIDI Note Filter',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'Lowest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 21 },
      { index: 1, name: 'Highest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 108 },
      { index: 2, name: 'Other events (CC, etc) pass through', min: 0, max: 1, defaultVal: 0 }
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
