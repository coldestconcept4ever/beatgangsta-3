const fs = require('fs');

const updates = [
  {
    targetName: 'JS: MIDI CC LFO Generator',
    matchName: 'MIDI CC LFO Generator [IXix]',
    category: 'MIDI',
    desc: 'MIDI CC LFO Generator',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'MIDI Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 1, name: 'Controller', min: 0, max: 127, defaultVal: 1 },
      { index: 2, name: 'Center', min: 0, max: 127, defaultVal: 0 },
      { index: 3, name: 'Range (+/-)', min: 0, max: 127, defaultVal: 0 },
      { index: 4, name: 'Off Value', min: 0, max: 127, defaultVal: 0 },
      { index: 5, name: 'LFO Shape', min: 0, max: 0, defaultVal: 0 },
      { index: 6, name: 'LFO Frequency', min: 0, max: 32, defaultVal: 1 },
      { index: 7, name: 'LFO Units', min: 0, max: 1, defaultVal: 0 },
      { index: 8, name: 'Updates Per Beat', min: 0, max: 9, defaultVal: 6 },
      { index: 9, name: 'On/Off', min: 0, max: 1, defaultVal: 1 }
    ]
  },
  {
    targetName: 'JS: MIDI Choke Group',
    matchName: 'MIDI Choke Group',
    category: 'MIDI',
    desc: 'MIDI Choke Group',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'MIDI Channel', min: 1, max: 16, defaultVal: 1 },
      { index: 1, name: 'Choke Note Range Start', min: 0, max: 127, defaultVal: 60 },
      { index: 2, name: 'Number Of Choke Notes', min: 1, max: 128, defaultVal: 8 }
    ]
  },
  {
    targetName: 'JS: MIDI Chorderizer',
    matchName: 'MIDI Chorderizer',
    category: 'MIDI',
    desc: 'MIDI Chorderizer',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Voice 1 Offset (st)', min: 1, max: 24, defaultVal: 5, unit: 'st' },
      { index: 1, name: 'Voice 2 Offset (st)', min: 1, max: 24, defaultVal: 0, unit: 'st' },
      { index: 2, name: 'Voice 3 Offset (st)', min: 1, max: 24, defaultVal: 0, unit: 'st' },
      { index: 3, name: 'Voice 4 Offset (st)', min: 1, max: 24, defaultVal: 0, unit: 'st' },
      { index: 4, name: 'Velocity Scale @ 1', min: 0, max: 1, defaultVal: 1 },
      { index: 5, name: 'Velocity Scale @ 4', min: 0, max: 1, defaultVal: 1 },
      { index: 6, name: 'Lowest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 0 },
      { index: 7, name: 'Highest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 127 }
    ]
  },
  {
    targetName: 'JS: MIDI Chord In Key',
    matchName: 'MIDI Chord In Key',
    category: 'MIDI',
    desc: 'MIDI Chord In Key',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Notes In Key Advance For Note 1', min: -24, max: 24, defaultVal: 2 },
      { index: 1, name: 'Notes In Key Advance For Note 2', min: -24, max: 24, defaultVal: 4 },
      { index: 2, name: 'Key', min: 0, max: 11, defaultVal: 0 },
      { index: 3, name: 'Velocity Scale For Additional Notes', min: 0, max: 1, defaultVal: 1 },
      { index: 4, name: 'Lowest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 0 },
      { index: 5, name: 'Highest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 127 }
    ]
  },
  {
    targetName: 'JS: MIDI Choke',
    matchName: 'MIDI Choke',
    category: 'MIDI',
    desc: 'MIDI Choke',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'MIDI Channel', min: 1, max: 16, defaultVal: 1 },
      { index: 1, name: 'Choke Note Range Start', min: 0, max: 127, defaultVal: 42 },
      { index: 2, name: 'Number Of Choke Notes', min: 1, max: 16, defaultVal: 1 },
      { index: 3, name: 'Affected Note Range Start', min: 0, max: 127, defaultVal: 46 },
      { index: 4, name: 'Number Of Affected Notes', min: 1, max: 16, defaultVal: 1 },
      { index: 5, name: 'Action During Choke', min: 0, max: 1, defaultVal: 0 },
      { index: 6, name: 'Additional Choke Note', min: -1, max: 127, defaultVal: -1 },
      { index: 7, name: 'Additional Choke Note', min: -1, max: 127, defaultVal: -1 },
      { index: 8, name: 'Additional Choke Note', min: -1, max: 127, defaultVal: -1 },
      { index: 9, name: 'Additional Choke Note', min: -1, max: 127, defaultVal: -1 }
    ]
  },
  {
    targetName: 'JS: MIDI Delay',
    matchName: 'MIDI Delay',
    category: 'MIDI',
    desc: 'MIDI Delay',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Delay', min: 0, max: 1000, defaultVal: 0, unit: 'ms' },
      { index: 1, name: 'Delay (QN)', min: 0, max: 16, defaultVal: 0 },
      { index: 2, name: 'Delay (samples)', min: 0, max: 10000, defaultVal: 0 },
      { index: 3, name: 'Channel (0=omni)', min: 0, max: 16, defaultVal: 0 },
      { index: 4, name: 'Bus (0=all buses)', min: 0, max: 16, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Duplicate Note Filter',
    matchName: 'MIDI Duplicate Note Filter [IXix]',
    category: 'MIDI',
    desc: 'MIDI Duplicate Note Filter',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Input Channel', min: 0, max: 15, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI EQ Ducker',
    matchName: 'MIDI EQ Ducker [LOSER]',
    category: 'EQ & Filtering',
    desc: 'MIDI EQ Ducker',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'MIDI Note #', min: 0, max: 129, defaultVal: 0 },
      { index: 1, name: 'Attack', min: 0, max: 75, defaultVal: 10, unit: 'ms' },
      { index: 2, name: 'Attack Shape', min: 0, max: 4, defaultVal: 1 },
      { index: 3, name: 'Release', min: 0, max: 500, defaultVal: 100, unit: 'ms' },
      { index: 4, name: 'Release Shape', min: 0, max: 4, defaultVal: 1 },
      { index: 5, name: 'Frequency Coarse', min: 0, max: 15000, defaultVal: 0, unit: 'Hz' },
      { index: 6, name: 'Frequency Fine', min: 0, max: 100, defaultVal: 60, unit: 'Hz' },
      { index: 7, name: 'Width', min: 0, max: 2, defaultVal: 1, unit: 'Oct' },
      { index: 8, name: 'Volume', min: -32, max: 32, defaultVal: 0, unit: 'dB' },
      { index: 9, name: 'Mode', min: 0, max: 4, defaultVal: 0 },
      { index: 10, name: 'Gate/Pump React To MIDI Velocity', min: 0, max: 1, defaultVal: 0 }
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
