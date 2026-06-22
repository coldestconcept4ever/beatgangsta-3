const fs = require('fs');

const updates = [
  {
    targetName: 'JS: RBJ Stereo Image Filter',
    matchName: 'RBJ Stereo Image Filter',
    category: 'Filter',
    desc: 'RBJ Stereo Image Filter',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'S - Filter Amount (%)', min: 0, max: 100, defaultVal: 100 },
      { index: 1, name: 'S - HP (Scale)', min: 0, max: 100, defaultVal: 0 },
      { index: 2, name: 'S - LP (Scale)', min: 0, max: 100, defaultVal: 100 },
      { index: 3, name: 'S - Drive (%)', min: 0, max: 100, defaultVal: 0 },
      { index: 4, name: 'Side (%)', min: 0, max: 200, defaultVal: 100 },
      { index: 5, name: 'Mid (%)', min: 0, max: 200, defaultVal: 100 },
      { index: 6, name: 'Output M+S (dB)', min: -25, max: 25, defaultVal: 0 },
      { index: 7, name: 'Oversample (x2)', min: 0, max: 1, defaultVal: 0 }
    ]
  }
];

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

for (const update of updates) {
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
  let pos = srcCode.lastIndexOf(anchor);
  if (pos === -1) pos = srcCode.lastIndexOf('];');
  
  if (pos > -1) {
    srcCode = srcCode.slice(0, pos) + ',\n' + insertion + srcCode.slice(pos);
    console.log('Added ' + update.targetName);
  }
}

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
