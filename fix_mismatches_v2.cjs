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

// Fix RBJ Highpass/Lowpass Filters
updatePlugin('JS: RBJ Highpass/Lowpass Filters', [
  { index: 0, name: 'HPF', min: 0, max: 1000, defaultVal: 0, unit: 'Hz' },
  { index: 1, name: 'LPF', min: 1000, max: 22000, defaultVal: 22000, unit: 'Hz' },
  { index: 2, name: 'Gain', min: -20, max: 20, defaultVal: 0, unit: 'dB' },
]);

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Fixed mismatches');
