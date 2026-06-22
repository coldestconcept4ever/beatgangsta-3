const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Delay',
    matchName: 'Delay [Cockos]',
    category: 'Delay',
    desc: 'Delay',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Delay', min: 0, max: 4000, defaultVal: 300, unit: 'ms' },
      { index: 1, name: 'Feedback', min: -120, max: 6, defaultVal: -5, unit: 'dB' },
      { index: 2, name: 'Mix In', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Output Wet', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 4, name: 'Output Dry', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Resample On Length Change', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Delay w/Stereo Bounce',
    matchName: 'Delay w/Stereo Bounce [Cockos]',
    category: 'Delay',
    desc: 'Delay w/Stereo Bounce',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Delay', min: 0, max: 4000, defaultVal: 300, unit: 'ms' },
      { index: 1, name: 'Update Wet', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 2, name: 'Update Dry', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 3, name: 'Out Wet', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 4, name: 'Out Dry', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 5, name: 'Resample On Length Change', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Delay w/Chorus',
    matchName: 'Delay w/Chorus [Cockos]',
    category: 'Delay',
    desc: 'Delay w/Chorus',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Delay', min: 0, max: 4000, defaultVal: 300, unit: 'ms' },
      { index: 1, name: 'Feedback', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 2, name: 'Output Wet (Chorus)', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 3, name: 'Output Wet (Clean)', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 4, name: 'Output Dry', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Chorus Period', min: 1, max: 1000, defaultVal: 500, unit: 'ms' },
      { index: 6, name: 'Chorus Length', min: 0, max: 100, defaultVal: 2, unit: 'ms' }
    ]
  },
  {
    targetName: 'JS: Delay (Lo-Fi)',
    matchName: 'Delay (Lo-Fi) [Cockos]',
    category: 'Delay',
    desc: 'Delay (Lo-Fi)',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Delay', min: 0, max: 4000, defaultVal: 300, unit: 'ms' },
      { index: 1, name: 'Update Wet', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 2, name: 'Update Dry', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 3, name: 'Out Wet', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 4, name: 'Out Dry', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 5, name: 'Resolution', min: 1, max: 24, defaultVal: 8, unit: 'bits' },
      { index: 6, name: 'Resample On Length Change', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Delay w/Tempo Ping-Pong',
    matchName: 'Delay with Tempo Ping-Pong [Stillwell]',
    category: 'Delay',
    desc: 'Delay with Tempo Ping-Pong',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Delay (0=tempo sync)', min: 0, max: 13000, defaultVal: 0, unit: 'ms' },
      { index: 1, name: 'Feedback', min: -120, max: 6, defaultVal: -5, unit: 'dB' },
      { index: 2, name: 'Mix In', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Output Wet', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 4, name: 'Output Dry', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Ping-Pong Width', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 6, name: 'Tempo Sync', min: 0.0625, max: 4, defaultVal: 0.25 }
    ]
  },
  {
    targetName: 'JS: Delay w/Sustain',
    matchName: 'Delay w/Sustain [Cockos]',
    category: 'Delay',
    desc: 'Delay w/Sustain',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Length', min: 0, max: 4000, defaultVal: 120, unit: 'ms' },
      { index: 1, name: 'Threshold', min: -120, max: 6, defaultVal: -44, unit: 'dB' },
      { index: 2, name: 'Attack', min: 0, max: 1000, defaultVal: 10, unit: 'ms' },
      { index: 3, name: 'Release', min: 0, max: 1000, defaultVal: 10, unit: 'ms' },
      { index: 4, name: 'Maximum Mixing', min: -120, max: 0, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Output Wet', min: -120, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'Output Dry', min: -120, max: 6, defaultVal: 0, unit: 'dB' }
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
    
    // Find the end of the array brackets by looking for the next array or matching bracket
    // A simple hack when formatting is predictable:
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
