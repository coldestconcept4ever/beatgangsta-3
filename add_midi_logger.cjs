const fs = require('fs');

const update = {
  targetName: 'JS: MIDI Logger',
  matchName: 'MIDI Logger',
  category: 'MIDI',
  desc: 'MIDI Logger',
  author: 'Unknown',
  sliders: [
    { index: 0, name: 'note-on/off analysis mode', min: 0, max: 2, defaultVal: 0 }
  ]
};

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

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
  fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
  console.log('Added JS: MIDI Logger');
} else {
  console.log('Failed to add');
}
