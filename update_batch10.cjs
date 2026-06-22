const fs = require('fs');

const updates = [
  {
    targetName: 'JS: RBJ Highpass/Lowpass Filters',
    matchName: 'RBJ Highpass/Lowpass Filters [Stillwell]',
    category: 'Filter',
    desc: 'RBJ Highpass/Lowpass Filters',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'HPF', min: 0, max: 1000, defaultVal: 0, unit: 'Hz' },
      { index: 1, name: 'LPF', min: 1000, max: 22000, defaultVal: 22000, unit: 'Hz' },
      { index: 2, name: 'Gain', min: -20, max: 20, defaultVal: 0, unit: 'dB' },
    ]
  },
  {
    targetName: 'JS: Huge Booty Bass Enhancer',
    matchName: 'Huge Booty Bass Enhancer [Stillwell]',
    category: 'Saturation',
    desc: 'Huge Booty Bass Enhancer',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Mix', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 1, name: 'Drive', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 2, name: 'Frequency', min: 20, max: 200, defaultVal: 100, unit: 'Hz' }
    ]
  },
  {
    targetName: 'JS: Mid/Side Decoder',
    matchName: 'Mid/Side Decoder',
    category: 'Analysis & Utility',
    desc: 'Mid/Side Decoder',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Center Level', min: -120, max: 24, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Output Swap', min: 0, max: 1, defaultVal: 0 },
      { index: 2, name: 'Center Position', min: -1, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Mid/Side Encoder',
    matchName: 'Mid/Side Encoder',
    category: 'Analysis & Utility',
    desc: 'Mid/Side Encoder',
    author: 'Cockos',
    sliders: []
  },
  {
    targetName: 'JS: Loop Sampler w/MIDI Triggers',
    matchName: 'Loop Sampler w/MIDI Triggers',
    category: 'Sampler',
    desc: 'Loop Sampler w/MIDI Triggers',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Loop Volume', min: -120, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Play Speed (neg=reverse)', min: -8, max: 8, defaultVal: 1 },
      { index: 2, name: 'Play Start Position', min: 0, max: 30000, defaultVal: 0, unit: 'ms' },
      { index: 3, name: 'Play End Position', min: 0, max: 30000, defaultVal: 0, unit: 'ms' },
      { index: 4, name: 'MIDI Note For First Trigger', min: 0, max: 120, defaultVal: 50 },
      { index: 5, name: 'Edge Overlap', min: 0, max: 1000, defaultVal: 10, unit: 'ms' },
      { index: 6, name: 'Silence Removal Threshold', min: -120, max: 0, defaultVal: -120, unit: 'dB' },
      { index: 7, name: 'State', min: 0, max: 6, defaultVal: 0 },
      { index: 8, name: 'MIDI Channel (0=omni)', min: 0, max: 16, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Loop Sampler',
    matchName: 'Loop Sampler',
    category: 'Sampler',
    desc: 'Loop Sampler',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Loop Volume', min: -120, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Play Speed (neg=reverse)', min: -8, max: 8, defaultVal: 1 },
      { index: 2, name: 'Play Start Position', min: 0, max: 30000, defaultVal: 0, unit: 'ms' },
      { index: 3, name: 'Play End Position', min: 0, max: 30000, defaultVal: 0, unit: 'ms' },
      { index: 4, name: 'Trigger Base', min: 0, max: 10, defaultVal: 1 },
      { index: 5, name: 'Edge Overlap', min: 0, max: 1000, defaultVal: 10, unit: 'ms' },
      { index: 6, name: 'Silence Removal Threshold', min: -120, max: 0, defaultVal: -120, unit: 'dB' },
      { index: 7, name: 'State', min: 0, max: 6, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Lorenz Attractor',
    matchName: 'Lorenz Attractor [Liteon]',
    category: 'Analysis & Utility',
    desc: 'Lorenz Attractor',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Rate (Fast/Slow)', min: 1, max: 10000, defaultVal: 3000 },
      { index: 1, name: 'Plot (OSC 1+2/1)', min: 0, max: 1, defaultVal: 0 },
      { index: 2, name: 'Prandtl Number', min: 10, max: 28, defaultVal: 14 },
      { index: 3, name: 'Rayleigh Number', min: 14, max: 46, defaultVal: 28 },
      { index: 4, name: 'Color (Mod Min/Max)', min: 0, max: 1, defaultVal: 0.5 },
      { index: 5, name: 'Tune', min: -4, max: 4, defaultVal: 0 },
      { index: 6, name: 'Gain', min: -25, max: 25, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Granular Loop Sampler',
    matchName: 'Granular Loop Sampler',
    category: 'Sampler',
    desc: 'Granular Loop Sampler',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Loop Volume', min: -120, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Play Speed (neg=reverse)', min: -8, max: 8, defaultVal: 1 },
      { index: 2, name: 'Trigger Base', min: 0, max: 10, defaultVal: 1 },
      { index: 3, name: 'Length', min: 0, max: 30000, defaultVal: 0, unit: 'ms' },
      { index: 4, name: 'Loop Granularity', min: 0, max: 30000, defaultVal: 1000, unit: 'ms' },
      { index: 5, name: 'Maximum Length', min: 0, max: 30000, defaultVal: 16000, unit: 'ms' },
      { index: 6, name: 'Silence Removal Threshold', min: -120, max: 0, defaultVal: -120, unit: 'dB' },
      { index: 7, name: 'State', min: 0, max: 6, defaultVal: 0 }
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
    
    const endBlockIndex = srcCode.indexOf(']', slidersIndex);
    
    if (slidersIndex > -1 && endBlockIndex > -1) {
        // Need to skip to the end of the array to replace correctly, and ensure syntax
        const endOfArray = srcCode.indexOf(']', slidersIndex);
        
        let replacementStr = 'sliders: [\n';
        if (update.sliders.length > 0) {
            replacementStr += update.sliders.map(function(s) { return '      ' + JSON.stringify(s) }).join(',\n') + '\n    ';
        }
        
        srcCode = srcCode.slice(0, slidersIndex) + replacementStr + srcCode.slice(endOfArray + 1); // Note removed the trailing space
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
