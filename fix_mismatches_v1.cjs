const fs = require('fs');

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');

function updatePlugin(targetName, sliders) {
  const n1 = 'name: "' + targetName + '"';
  const n2 = "name: '" + targetName + "'";
  const n3 = '"name": "' + targetName + '"';
  
  let p = srcCode.indexOf(n1);
  if (p === -1) p = srcCode.indexOf(n2);
  if (p === -1) p = srcCode.indexOf(n3);
  
  if (p === -1) {
    console.log("Could not find:", targetName);
    return;
  }
  
  const s1 = srcCode.indexOf('sliders: [', p);
  const s2 = srcCode.indexOf('"sliders": [', p);
  
  let sIndex = -1;
  if (s1 !== -1 && s2 !== -1) {
    sIndex = Math.min(s1, s2);
  } else if (s1 !== -1) {
    sIndex = s1;
  } else if (s2 !== -1) {
    sIndex = s2;
  }
  
  if (sIndex === -1) {
    console.log("Could not find sliders array for:", targetName);
    return;
  }
  
  const endBlock = srcCode.indexOf(']', sIndex);
  
  let replacement = 'sliders: [\n';
  if (sliders.length > 0) {
    replacement += sliders.map(s => '      ' + JSON.stringify(s)).join(',\n') + '\n    ';
  }
  
  srcCode = srcCode.slice(0, sIndex) + replacement + srcCode.slice(endBlock);
  console.log("Updated", targetName);
}

// 1. Fix Dirt Squeeze Compressor
updatePlugin('JS: Dirt Squeeze Compressor', [
  { index: 0, name: 'Threshold', min: -60, max: 0, defaultVal: 0, unit: 'dB' },
  { index: 1, name: 'Ratio', min: 1, max: 20, defaultVal: 1 },
  { index: 2, name: 'Automatic Make-Up', min: 0, max: 1, defaultVal: 0 },
  { index: 3, name: 'Manual Gain', min: -20, max: 20, defaultVal: 0 }
]);

// 2. Fix Huge Booty Bass Enhancer
updatePlugin('JS: Huge Booty Bass Enhancer', [
  { index: 0, name: 'Mix', min: 0, max: 100, defaultVal: 0, unit: '%' },
  { index: 1, name: 'Drive', min: 0, max: 100, defaultVal: 0, unit: '%' },
  { index: 2, name: 'Frequency', min: 20, max: 200, defaultVal: 100, unit: 'Hz' }
]);

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Fixed mismatches');
