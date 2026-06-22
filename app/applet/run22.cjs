const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Soft Clipper/Limiter',
    matchName: 'Soft Clipper/Limiter',
    category: 'Dynamics',
    desc: 'Soft Clipper/Limiter',
    author: 'Schwa',
    sliders: [
      { index: 0, name: 'Boost', min: 0, max: 9, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Output Brickwall', min: -3, max: 1, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Simple Peak-1 Limiter',
    matchName: 'Simple Peak-1 Limiter [LOSER]',
    category: 'Dynamics',
    desc: 'Simple Peak-1 Limiter',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Threshold', min: -20, max: 0, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Spectral Hold',
    matchName: 'Spectral Hold (Cockos)',
    category: 'Processing',
    desc: 'Spectral Hold',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'FFT Size', min: 0, max: 6, defaultVal: 6 },
      { index: 1, name: 'analysis overlap', min: 0.01, max: 0.99, defaultVal: 0.5 },
      { index: 2, name: 'output overlap', min: 0.1, max: 0.9, defaultVal: 0.75 },
      { index: 3, name: 'hold volume', min: -150, max: 32, defaultVal: 0, unit: 'dB' },
      { index: 4, name: 'dry mix during hold', min: -150, max: 32, defaultVal: -150, unit: 'dB' },
      { index: 5, name: 'dry mix when not holding', min: -150, max: 32, defaultVal: 0, unit: 'dB' },
      { index: 6, name: 'phase increase', min: 0, max: 12, defaultVal: 0 },
      { index: 7, name: 'hold', min: 0, max: 2, defaultVal: 0 },
      { index: 8, name: 'update state', min: 0, max: 1, defaultVal: 1 },
      { index: 9, name: 'transport start behavior', min: 0, max: 1, defaultVal: 0 },
      { index: 10, name: 'mix-in on update', min: 0, max: 1, defaultVal: 1 },
      { index: 11, name: 'auto-update every', min: 0, max: 30, defaultVal: 0, unit: 's' }
    ]
  },
  {
    targetName: 'JS: Spectropaint Filter',
    matchName: 'Spectropaint Filter',
    category: 'Processing',
    desc: 'Spectropaint Filter',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Period', min: 1, max: 100, defaultVal: 20, unit: 'sec' },
      { index: 1, name: 'Background Gain', min: -144, max: 0, defaultVal: -144, unit: 'dB' },
      { index: 2, name: 'Foreground Gain', min: -144, max: 64, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'FFT Size', min: 0, max: 11, defaultVal: 4 },
      { index: 4, name: 'Project Sync Offset (-1 to disable)', min: -1, max: 100, defaultVal: 0 },
      { index: 5, name: 'Mode', min: 0, max: 1, defaultVal: 1 }
    ]
  },
  {
    targetName: 'JS: Spectropaint Synthesis',
    matchName: 'Spectropaint Synthesis',
    category: 'Synthesis',
    desc: 'Spectropaint Synthesis',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'period', min: 1, max: 100, defaultVal: 20, unit: 'sec' },
      { index: 1, name: 'amplitude', min: -144, max: 0, defaultVal: -40, unit: 'dB' },
      { index: 2, name: 'FFT size', min: 0, max: 11, defaultVal: 4 },
      { index: 3, name: 'project sync offset (-1 to disable)', min: -1, max: 100, defaultVal: 0 },
      { index: 4, name: 'mode', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: State Variable Morphing Filter',
    matchName: 'State Variable Morphing Filter',
    category: 'Filter',
    desc: 'State Variable Morphing Filter',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'X (Morph)', min: 0, max: 1, defaultVal: 0.5 },
      { index: 2, name: 'Y (Morph)', min: 0, max: 1, defaultVal: 0.5 },
      { index: 3, name: 'Frequency (Scale)', min: 0, max: 100, defaultVal: 50 },
      { index: 4, name: 'Resonance', min: 0, max: 24, defaultVal: 6, unit: 'dB' },
      { index: 5, name: 'Filter Amount (%)', min: 0, max: 100, defaultVal: 100 },
      { index: 6, name: 'Output (-inf/+26dB)', min: -26, max: 26, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Stereo Upmix',
    matchName: 'Stereo Upmix (Left->Stereo)',
    category: 'Stereo & Spatial',
    desc: 'Stereo Upmix',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Delay', min: 0, max: 250, defaultVal: 125, unit: 'ms' }
    ]
  },
  {
    targetName: 'JS: Stereo Enhancer',
    matchName: 'Stereo Enhancer',
    category: 'Stereo & Spatial',
    desc: 'Stereo Enhancer',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Width Low (%)', min: 0, max: 200, defaultVal: 100 },
      { index: 1, name: 'Crossover (Hz)', min: 0, max: 20000, defaultVal: 500 },
      { index: 2, name: 'Width High (%)', min: 0, max: 200, defaultVal: 100 }
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
