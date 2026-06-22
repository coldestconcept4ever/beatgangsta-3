import fs from 'fs';

const updates = [
  {
    targetName: 'JS: MIDI Pattern/Scale Variation Generator',
    matchName: 'MIDI Pattern/Scale Variation Generator [IXix]',
    category: 'MIDI',
    desc: 'MIDI Pattern/Scale Variation Generator',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Input Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 1, name: 'Note Min', min: 0, max: 127, defaultVal: 0 },
      { index: 2, name: 'Note Max', min: 0, max: 127, defaultVal: 127 },
      { index: 3, name: 'Root Note', min: 0, max: 11, defaultVal: 0 },
      { index: 4, name: 'Scale File', min: 0, max: 0, defaultVal: 0 },
      { index: 5, name: 'Low Octave', min: 0, max: 10, defaultVal: 5 },
      { index: 6, name: 'High Octave', min: 0, max: 10, defaultVal: 5 },
      { index: 7, name: 'Sequence File', min: 0, max: 0, defaultVal: 0 },
      { index: 8, name: 'On/Off', min: 0, max: 1, defaultVal: 1 }
    ]
  },
  {
    targetName: 'JS: MIDI Velocity Variation Generator',
    matchName: 'MIDI Velocity Variation Generator [IXix]',
    category: 'MIDI',
    desc: 'MIDI Velocity Variation Generator',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Input Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 1, name: 'Note Min', min: 0, max: 127, defaultVal: 0 },
      { index: 2, name: 'Note Max', min: 0, max: 127, defaultVal: 127 },
      { index: 3, name: 'Base Velocity', min: 0, max: 127, defaultVal: 64 },
      { index: 4, name: 'Variation (%)', min: 0, max: 100, defaultVal: 0 },
      { index: 5, name: 'Sequence File', min: 0, max: 0, defaultVal: 0 },
      { index: 6, name: 'On/Off', min: 0, max: 1, defaultVal: 1 }
    ]
  },
  {
    targetName: 'JS: MIDI Velocity Control',
    matchName: 'MIDI Velocity Control',
    category: 'MIDI',
    desc: 'MIDI Velocity Control',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'Velocity Multiply', min: -16, max: 16, defaultVal: 1 },
      { index: 1, name: 'Velocity Add', min: -128, max: 128, defaultVal: 0 },
      { index: 2, name: 'Min Velocity', min: 0, max: 127, defaultVal: 0 },
      { index: 3, name: 'Max Velocity', min: 0, max: 127, defaultVal: 127 },
      { index: 4, name: 'Lowest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 0 },
      { index: 5, name: 'Highest Key (MIDI Note #)', min: 0, max: 127, defaultVal: 127 }
    ]
  },
  {
    targetName: 'JS: MIDI Pitch Wheel LFO',
    matchName: 'MIDI Pitch Wheel LFO Generator [IXix]',
    category: 'MIDI',
    desc: 'MIDI Pitch Wheel LFO',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'MIDI Channel', min: 0, max: 15, defaultVal: 0 },
      { index: 1, name: 'Max Bend (%)', min: 0, max: 100, defaultVal: 0 },
      { index: 2, name: 'LFO Frequency', min: 0, max: 24, defaultVal: 1 },
      { index: 3, name: 'LFO Units', min: 0, max: 1, defaultVal: 0 },
      { index: 4, name: 'Updates Per Beat', min: 0, max: 9, defaultVal: 6 },
      { index: 5, name: 'On/Off', min: 0, max: 1, defaultVal: 1 }
    ]
  },
  {
    targetName: 'JS: MIDI Note-On Delay',
    matchName: 'MIDI Note-On Delay',
    category: 'MIDI',
    desc: 'MIDI Note-On Delay',
    author: 'Unknown',
    sliders: [
      { index: 0, name: 'Max Delay Samples', min: 0, max: 4096, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: 8x Stereo to 1x Stereo Mixer',
    matchName: '8x Stereo to 1x Stereo Mixer [IXix]',
    category: 'Mixer',
    desc: '8x Stereo to 1x Stereo Mixer',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Level 1+2', min: -60, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Level 3+4', min: -60, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Level 5+6', min: -60, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Level 7+8', min: -60, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'Level 9+10', min: -60, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Level 11+12', min: -60, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'Level 13+14', min: -60, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 7, name: 'Level 15+16', min: -60, max: 30, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Moog 4-Pole Filter',
    matchName: 'Moog 4-Pole Filter',
    category: 'Filter',
    desc: 'Moog 4-Pole Filter',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Filter Type', min: 0, max: 2, defaultVal: 0 },
      { index: 2, name: 'Cutoff (Scale)', min: 0, max: 100, defaultVal: 100 },
      { index: 3, name: 'Resonance', min: 0, max: 0.85, defaultVal: 0 },
      { index: 4, name: 'Drive (%)', min: 0, max: 100, defaultVal: 0 },
      { index: 5, name: 'Output', min: -25, max: 25, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'Limiter', min: 0, max: 1, defaultVal: 0 },
      { index: 7, name: 'Oversample (x2)', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: 8x Mono to 1x Stereo Mixer',
    matchName: '8x Mono to 1x Stereo Mixer [IXix]',
    category: 'Mixer',
    desc: '8x Mono to 1x Stereo Mixer',
    author: 'IXix',
    sliders: [
      { index: 0, name: 'Level 1', min: -120, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Level 2', min: -120, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Level 3', min: -120, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Level 4', min: -120, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'Level 5', min: -120, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Level 6', min: -120, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'Level 7', min: -120, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 7, name: 'Level 8', min: -120, max: 30, defaultVal: 0, unit: 'dB' },
      { index: 8, name: 'Pan 1 L<>R', min: 0, max: 1, defaultVal: 0 },
      { index: 9, name: 'Pan 2 L<>R', min: 0, max: 1, defaultVal: 1 },
      { index: 10, name: 'Pan 3 L<>R', min: 0, max: 1, defaultVal: 0 },
      { index: 11, name: 'Pan 4 L<>R', min: 0, max: 1, defaultVal: 1 },
      { index: 12, name: 'Pan 5 L<>R', min: 0, max: 1, defaultVal: 0 },
      { index: 13, name: 'Pan 6 L<>R', min: 0, max: 1, defaultVal: 1 },
      { index: 14, name: 'Pan 7 L<>R', min: 0, max: 1, defaultVal: 0 },
      { index: 15, name: 'Pan 8 L<>R', min: 0, max: 1, defaultVal: 1 }
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
