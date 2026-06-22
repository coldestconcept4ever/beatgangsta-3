const fs = require('fs');

const updates = [
  {
    targetName: 'JS: RBJ 4-Band Notch Filter',
    matchName: 'RBJ 4-Band Notch Filter',
    category: 'EQ & Filtering',
    desc: 'RBJ 4-Band Notch Filter',
    author: 'teej',
    sliders: [
      { index: 0, name: 'HPF', min: 0, max: 400, defaultVal: 0 },
      { index: 1, name: 'Sweep', min: 0, max: 10000, defaultVal: 0 },
      { index: 2, name: 'Notch 1', min: 0, max: 10000, defaultVal: 0 },
      { index: 3, name: 'Notch 2', min: 0, max: 10000, defaultVal: 0 },
      { index: 4, name: 'Notch 3', min: 0, max: 10000, defaultVal: 0 },
      { index: 5, name: 'Notch 4', min: 0, max: 10000, defaultVal: 0 },
      { index: 6, name: 'LPF', min: 400, max: 22000, defaultVal: 22000 },
      { index: 7, name: 'Output Gain', min: -12, max: 12, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: RBJ 7-Band Graphic EQ',
    matchName: 'RBJ 7-Band Graphic EQ [Stillwell]',
    category: 'EQ & Filtering',
    desc: 'RBJ 7-Band Graphic EQ',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'HPF Freq', min: 10, max: 120, defaultVal: 10 },
      { index: 1, name: '100 Hz', min: -15, max: 15, defaultVal: 0 },
      { index: 2, name: '200 Hz', min: -15, max: 15, defaultVal: 0 },
      { index: 3, name: '400 Hz', min: -15, max: 15, defaultVal: 0 },
      { index: 4, name: '800 Hz', min: -15, max: 15, defaultVal: 0 },
      { index: 5, name: '2.5 kHz', min: -15, max: 15, defaultVal: 0 },
      { index: 6, name: '6 kHz', min: -15, max: 15, defaultVal: 0 },
      { index: 7, name: '12 kHz', min: -15, max: 15, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: ReaLoud LP',
    matchName: 'ReaLoud LP [stillwell]',
    category: 'Dynamics',
    desc: 'ReaLoud LP',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Mix (%)', min: 0, max: 100, defaultVal: 0 },
      { index: 2, name: 'LP Frequency (Hz)', min: 1, max: 22000, defaultVal: 22000 },
      { index: 3, name: 'LP Size (1/Q) (0=resonant, 1=dull)', min: 0, max: 1, defaultVal: 0.2 },
      { index: 4, name: 'Drive Circuit', min: 0, max: 1, defaultVal: 1 }
    ]
  },
  {
    targetName: 'JS: ReaLoud',
    matchName: 'ReaLoud [Stillwell]',
    category: 'Dynamics',
    desc: 'ReaLoud',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Mix (%)', min: 0, max: 100, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Resonant Lowpass Filter',
    matchName: 'Resonant Lowpass Filter',
    category: 'Filter',
    desc: 'Resonant Lowpass Filter',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Frequency (Hz)', min: 20, max: 20000, defaultVal: 1000 },
      { index: 1, name: 'Resonance', min: 0, max: 1, defaultVal: 0.8 }
    ]
  },
  {
    targetName: 'JS: Delay w/Reverseness',
    matchName: 'Delay w/Reverseness',
    category: 'Delay',
    desc: 'Delay w/Reverseness',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Length (ms)', min: 0, max: 4000, defaultVal: 500 },
      { index: 1, name: 'Wet Mix (dB)', min: -120, max: 6, defaultVal: -6 },
      { index: 2, name: 'Dry Mix (dB)', min: -120, max: 6, defaultVal: -6 },
      { index: 3, name: 'Edge Overlap', min: 0, max: 1, defaultVal: 0.1 },
      { index: 4, name: 'Old Compatible And Clicky Mode', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Ring Modulator',
    matchName: 'Ring Modulator',
    category: 'Modulation',
    desc: 'Ring Modulator',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Mod Input Diode (Waveshaper)', min: 0, max: 1, defaultVal: 0 },
      { index: 2, name: 'Mod Frequency (Scale)', min: 0, max: 100, defaultVal: 40 },
      { index: 3, name: 'Feedback (%)', min: 0, max: 100, defaultVal: 0 },
      { index: 4, name: 'Non-Linearities (%)', min: 0, max: 100, defaultVal: 10 },
      { index: 5, name: 'Mix (%)', min: 0, max: 100, defaultVal: 100 },
      { index: 6, name: 'Output (-inf/+40dB)', min: -40, max: 40, defaultVal: 0 },
      { index: 7, name: 'Oversample (x2)', min: 0, max: 1, defaultVal: 0 }
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
