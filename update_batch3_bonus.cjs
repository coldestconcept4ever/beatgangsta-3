const fs = require('fs');

const updates = [
  {
    targetName: 'JS: De-esser',
    matchName: 'De-esser [Liteon]',
    category: 'Dynamics',
    desc: 'De-esser',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 1 },
      { index: 1, name: 'Target Type', min: 0, max: 1, defaultVal: 1 },
      { index: 2, name: 'Monitor', min: 0, max: 1, defaultVal: 0 },
      { index: 3, name: 'Frequency', min: 1500, max: 12000, defaultVal: 4000, unit: 'Hz' },
      { index: 4, name: 'Bandwidth', min: 0.1, max: 3.1, defaultVal: 1.5, unit: 'Oct' },
      { index: 5, name: 'Threshold', min: -80, max: 0, defaultVal: -25, unit: 'dB' },
      { index: 6, name: 'Ratio', min: 1, max: 20, defaultVal: 4 },
      { index: 7, name: 'Time Constants', min: 0, max: 1, defaultVal: 0 },
      { index: 8, name: 'Gain', min: -24, max: 24, defaultVal: 0, unit: 'dB' }
    ]
  }
];

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');
let count = 0;

for (const update of updates) {
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
  }
}

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Successfully processed ' + count + ' JSFX updates.');
