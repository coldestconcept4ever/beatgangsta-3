const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Saturation',
    matchName: 'Saturation [LOSER]',
    category: 'Distortion',
    desc: 'Saturation',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Amount (%)', min: 0, max: 100, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: MIDI Sequencer Baby v2',
    matchName: 'MIDI Sequencer Baby v2',
    category: 'MIDI',
    desc: 'MIDI Sequencer Baby v2',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'Pattern', min: 0, max: 15, defaultVal: 0 },
      { index: 1, name: 'Note Start', min: 0, max: 127, defaultVal: 60 },
      { index: 2, name: 'Sequence Length', min: 4, max: 128, defaultVal: 16 },
      { index: 3, name: 'Number Of Notes', min: 1, max: 32, defaultVal: 16 },
      { index: 4, name: 'Rate', min: 0.125, max: 4.0, defaultVal: 1 }
    ]
  },
  {
    targetName: 'JS: MIDI Sequencer Baby',
    matchName: 'MIDI Sequencer Baby',
    category: 'MIDI',
    desc: 'MIDI Sequencer Baby',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'Pattern', min: 0, max: 15, defaultVal: 0 },
      { index: 1, name: 'Note Start', min: 0, max: 127, defaultVal: 60 }
    ]
  },
  {
    targetName: 'JS: MIDI Sequencer Megababy',
    matchName: 'MIDI Sequencer Megababy [jnif]',
    category: 'MIDI',
    desc: 'MIDI Sequencer Megababy',
    author: 'jnif',
    sliders: [
      { index: 0, name: 'Pattern', min: 0, max: 15, defaultVal: 0 },
      { index: 1, name: '--Note Start', min: 0, max: 127, defaultVal: 36 },
      { index: 2, name: 'Sequence Length', min: 4, max: 128, defaultVal: 16 },
      { index: 3, name: '--Number Of Notes', min: 1, max: 32, defaultVal: 16 },
      { index: 4, name: 'Rate', min: 0.125, max: 4.0, defaultVal: 1 },
      { index: 5, name: '--Note Length', min: 1, max: 100, defaultVal: 100 },
      { index: 6, name: '--Mode', min: 0, max: 1, defaultVal: 1 },
      { index: 7, name: '--Swing', min: 0, max: 100, defaultVal: 0 },
      { index: 8, name: 'Steps Per Beat', min: 1, max: 16, defaultVal: 4 },
      { index: 9, name: 'MIDI Trigger', min: 0, max: 8, defaultVal: 0 },
      { index: 10, name: '--Trigger Note Start', min: 0, max: 127, defaultVal: 72 },
      { index: 11, name: '--Chain', min: 0, max: 15, defaultVal: 0 },
      { index: 12, name: '--Lane Height Percent', min: 0.0, max: 1.0, defaultVal: 0.2 },
      { index: 13, name: '--CC To Adjust (Active For Editing)', min: 0, max: 3, defaultVal: 0 },
      { index: 14, name: 'Drum Map Note Names', min: 0, max: 0, defaultVal: 0 },
      { index: 19, name: '--Controller 1 Type', min: 0, max: 127, defaultVal: 1 },
      { index: 20, name: '--Controller 2 Type', min: 0, max: 127, defaultVal: 7 },
      { index: 21, name: '--Controller 3 Type', min: 0, max: 127, defaultVal: 10 },
      { index: 22, name: '--Controller 4 Type', min: 0, max: 127, defaultVal: 11 },
      { index: 29, name: '--Controller 1 Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 30, name: '--Controller 2 Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 31, name: '--Controller 3 Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 32, name: '--Controller 4 Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 39, name: '--Start Beat Position', min: -99, max: 9999, defaultVal: 0 },
      { index: 40, name: '--Play Before Start', min: 0, max: 1, defaultVal: 1 },
      { index: 41, name: '--End Beat Position', min: -99, max: 9999, defaultVal: -99 }
    ]
  },
  {
    targetName: 'JS: Shelving Filter',
    matchName: 'Shelving Filter',
    category: 'EQ & Filtering',
    desc: 'Shelving Filter',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Low Shelf (Scale)', min: 0, max: 100, defaultVal: 50 },
      { index: 2, name: 'Gain', min: -24, max: 24, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'High Shelf (Scale)', min: 0, max: 100, defaultVal: 50 },
      { index: 4, name: 'Gain', min: -24, max: 24, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Output', min: -24, max: 24, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Simple 1-Pole Filter',
    matchName: 'Simple 1-Pole Filter',
    category: 'Filter',
    desc: 'Simple 1-Pole Filter',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Filter Type', min: 0, max: 1, defaultVal: 0 },
      { index: 2, name: 'Cutoff (Scale)', min: 0, max: 100, defaultVal: 100 },
      { index: 3, name: 'Output', min: -25, max: 25, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Sine Sweep Generator',
    matchName: 'Sine Sweep Generator',
    category: 'Synthesis',
    desc: 'Sine Sweep Generator',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Approx Sweep Length', min: 1, max: 100, defaultVal: 8, unit: 'sec' }
    ]
  },
  {
    targetName: 'JS: SMPTE LTC Reader/Meter',
    matchName: 'SMPTE LTC Reader/Meter',
    category: 'Analysis & Utility',
    desc: 'SMPTE LTC Reader/Meter',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'Frame Rate', min: 0, max: 3, defaultVal: 0 }
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
