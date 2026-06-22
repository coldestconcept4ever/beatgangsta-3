const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Loudness Meter Peak/RMS/LUFS',
    matchName: 'Loudness Meter Peak/RMS/LUFS (Cockos)',
    category: 'Analysis & Utility',
    desc: 'Loudness Meter Peak/RMS/LUFS',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Peak', min: 0, max: 4, defaultVal: 4 },
      { index: 1, name: 'RMS momentary', min: 0, max: 1, defaultVal: 0 },
      { index: 2, name: 'RMS integrated', min: 0, max: 1, defaultVal: 0 },
      { index: 3, name: 'LUFS momentary', min: 0, max: 2, defaultVal: 2 },
      { index: 4, name: 'LUFS short-term', min: 0, max: 1, defaultVal: 1 },
      { index: 5, name: 'LRA loudness range', min: 0, max: 1, defaultVal: 1 },
      { index: 6, name: 'LUFS integrated', min: 0, max: 1, defaultVal: 1 },
      { index: 7, name: 'LUFS alerts', min: 0, max: 3, defaultVal: 0 },
      { index: 8, name: 'Yellow alert level', min: -60, max: 0, defaultVal: -12 },
      { index: 9, name: 'Red alert level', min: -60, max: 0, defaultVal: -6 },
      { index: 10, name: 'Reset on playback start', min: 0, max: 1, defaultVal: 1 },
      { index: 11, name: 'Force mono analysis', min: 0, max: 1, defaultVal: 0 },
      { index: 12, name: 'Text size', min: -2, max: 8, defaultVal: 0 },
      { index: 13, name: 'Y axis scaling', min: 0.5, max: 4, defaultVal: 1.8 },
      { index: 14, name: 'Output loudness values as automation', min: 0, max: 16, defaultVal: 0 },
      { index: 29, name: 'Peak/True peak dB (output)', min: -150, max: 20, defaultVal: -150 },
      { index: 30, name: 'RMS-M (output)', min: -100, max: 0, defaultVal: -100 },
      { index: 31, name: 'RMS-I (output)', min: -100, max: 0, defaultVal: -100 },
      { index: 32, name: 'LUFS-M (output)', min: -100, max: 0, defaultVal: -100 },
      { index: 33, name: 'LUFS-S (output)', min: -100, max: 0, defaultVal: -100 },
      { index: 34, name: 'LUFS-I (output)', min: -100, max: 0, defaultVal: -100 },
      { index: 35, name: 'LRA (output)', min: 0, max: 100, defaultVal: 0 }
    ]
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
    targetName: 'JS: Louderizer LP',
    matchName: 'Louderizer LP [Stillwell]',
    category: 'Saturation',
    desc: 'Louderizer LP',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Mix', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 1, name: 'Drive', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 2, name: 'LP Frequency', min: 1, max: 22000, defaultVal: 22000, unit: 'Hz' },
      { index: 3, name: 'LP Size (1/Q)', min: 0, max: 1, defaultVal: 0.2 },
      { index: 4, name: 'Drive Circuit', min: 0, max: 1, defaultVal: 1 }
    ]
  },
  {
    targetName: 'JS: Louderizer',
    matchName: 'Louderizer [stillwell]',
    category: 'Saturation',
    desc: 'Louderizer',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Mix', min: 0, max: 100, defaultVal: 0, unit: '%' },
      { index: 1, name: 'Drive', min: 0, max: 100, defaultVal: 0, unit: '%' }
    ]
  },
  {
    targetName: 'JS: Major Tom Compressor',
    matchName: 'Major Tom Compressor [Stillwell]',
    category: 'Dynamics',
    desc: 'Major Tom Compressor',
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
    targetName: 'JS: Master Limiter',
    matchName: 'Master Limiter [LOSER]',
    category: 'Dynamics',
    desc: 'Master Limiter',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Threshold', min: -20, max: -0.1, defaultVal: -3, unit: 'dB' },
      { index: 1, name: 'Look Ahead', min: 0, max: 1000, defaultVal: 200, unit: 'us' },
      { index: 2, name: 'Attack', min: 0, max: 1000, defaultVal: 100, unit: 'us' },
      { index: 3, name: 'Hold', min: 0, max: 10, defaultVal: 0, unit: 'ms' },
      { index: 4, name: 'Release', min: 0, max: 1000, defaultVal: 250, unit: 'ms' },
      { index: 5, name: 'Limit', min: -6, max: 0, defaultVal: -0.1, unit: 'dB' },
      { index: 6, name: 'Reduction', min: -20, max: 0, defaultVal: 0 }
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
