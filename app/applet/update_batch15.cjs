const fs = require('fs');

const updates = [
  {
    targetName: 'JS: MIDI Note Hold',
    matchName: 'MIDI Note Hold',
    category: 'MIDI',
    desc: 'MIDI Note Hold',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'Channel (0=omni)', min: 0, max: 16, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Note Repeater',
    matchName: 'MIDI Note Repeater',
    category: 'MIDI',
    desc: 'MIDI Note Repeater',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'Size', min: 0.1, max: 4, defaultVal: 1, unit: 'beats' }
    ]
  },
  {
    targetName: 'JS: MIDI note sanitizer',
    matchName: 'MIDI note sanitizer',
    category: 'MIDI',
    desc: 'MIDI note sanitizer',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'retrigger threshold (1/32nds, 0=no retrigger)', min: 0, max: 128, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Route Note To Channel',
    matchName: 'MIDI Route Note To Channel',
    category: 'MIDI',
    desc: 'MIDI Route Note To Channel',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'Note', min: 0, max: 127, defaultVal: 60 },
      { index: 1, name: 'Channel', min: 0, max: 15, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Router/Transpose',
    matchName: 'MIDI Router/Transpose [IXix]',
    category: 'MIDI',
    desc: 'MIDI Router/Transpose',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Input Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 1, name: 'Output Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 2, name: 'Mode', min: 0, max: 3, defaultVal: 3 },
      { index: 3, name: 'Note Min', min: 0, max: 127, defaultVal: 0 },
      { index: 4, name: 'Note Max', min: 0, max: 127, defaultVal: 127 },
      { index: 5, name: 'Transpose', min: -60, max: 60, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Tool v2',
    matchName: 'MIDI Tool v2 [IXix]',
    category: 'MIDI',
    desc: 'MIDI Tool v2',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Input Channel', min: 0, max: 16, defaultVal: 0 },
      { index: 1, name: 'Note Min', min: 0, max: 127, defaultVal: 0 },
      { index: 2, name: 'Note Max', min: 0, max: 127, defaultVal: 127 },
      { index: 3, name: 'Input Velocity Min', min: 0, max: 127, defaultVal: 0 },
      { index: 4, name: 'Input Velocity Max', min: 0, max: 127, defaultVal: 127 },
      { index: 5, name: 'Input Velocity Mode', min: 0, max: 1, defaultVal: 0 },
      { index: 6, name: 'Velocity Scaling(%)', min: 0, max: 1000, defaultVal: 100 },
      { index: 7, name: 'Random Velocity (%)', min: 0, max: 100, defaultVal: 0 },
      { index: 8, name: 'Output Velocity Min', min: 0, max: 127, defaultVal: 0 },
      { index: 9, name: 'Output Velocity Max', min: 0, max: 127, defaultVal: 127 },
      { index: 10, name: 'Transpose (semitones)', min: -60, max: 60, defaultVal: 0 },
      { index: 11, name: 'Random Pitch (%)', min: 0, max: 100, defaultVal: 0 },
      { index: 12, name: 'Pitch Reset', min: 0, max: 1, defaultVal: 1 },
      { index: 13, name: 'Output Channel', min: 0, max: 16, defaultVal: 0 },
      { index: 14, name: 'Controller Routing', min: 0, max: 2, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Tool',
    matchName: 'MIDI Tool [IXix]',
    category: 'MIDI',
    desc: 'MIDI Tool',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Input Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 1, name: 'Note Min', min: 0, max: 127, defaultVal: 0 },
      { index: 2, name: 'Note Max', min: 0, max: 127, defaultVal: 127 },
      { index: 3, name: 'Input Velocity Min', min: 0, max: 127, defaultVal: 0 },
      { index: 4, name: 'Input Velocity Max', min: 0, max: 127, defaultVal: 127 },
      { index: 5, name: 'Random Velocity (%)', min: 0, max: 100, defaultVal: 0 },
      { index: 6, name: 'Output Velocity Min', min: 0, max: 127, defaultVal: 0 },
      { index: 7, name: 'Output Velocity Max', min: 0, max: 127, defaultVal: 127 },
      { index: 8, name: 'Transpose (st)', min: -60, max: 60, defaultVal: 0 },
      { index: 9, name: 'Random Pitch (%)', min: 0, max: 100, defaultVal: 0 },
      { index: 10, name: 'Output Channel', min: 0, max: 16, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Transpose Notes',
    matchName: 'MIDI Transpose Notes',
    category: 'MIDI',
    desc: 'MIDI Transpose Notes',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'Transpose Semitones', min: -64, max: 64, defaultVal: 0 },
      { index: 1, name: 'Premultiply', min: -16, max: 16, defaultVal: 1 },
      { index: 2, name: 'Lowest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 0 },
      { index: 3, name: 'Highest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 127 }
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
