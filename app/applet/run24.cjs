const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Thunderkick',
    matchName: 'Thunderkick (MDCT subsynthesis filter) [Stillwell]',
    category: 'Synthesis',
    desc: 'Thunderkick',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Effect', min: -40, max: 40, defaultVal: -6, unit: 'dB' },
      { index: 1, name: 'Cutoff', min: 1, max: 30, defaultVal: 4 },
      { index: 2, name: 'Gain', min: -40, max: 40, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Shift', min: 0, max: 10, defaultVal: 1 }
    ]
  },
  {
    targetName: 'JS: Tilt Equalizer',
    matchName: 'Tilt Equalizer',
    category: 'EQ & Filtering',
    desc: 'Tilt Equalizer',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Center Frequency (Scale)', min: 0, max: 100, defaultVal: 50 },
      { index: 2, name: 'Tilt (Low/High)', min: -6, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 3, name: 'Output Gain', min: -25, max: 25, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Time Adjustment Delay',
    matchName: 'Time Adjustment Delay or Negative Delay',
    category: 'Delay',
    desc: 'Time Adjustment Delay',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Delay Amount', min: -1000, max: 1000, defaultVal: 0, unit: 'ms' },
      { index: 1, name: 'Wet Mix', min: -120, max: 12, defaultVal: 0, unit: 'dB' },
      { index: 2, name: 'Dry Mix', min: -120, max: 12, defaultVal: -120, unit: 'dB' },
      { index: 3, name: 'Additional Delay Amount', min: -40000, max: 40000, defaultVal: 0, unit: 'spls' }
    ]
  },
  {
    targetName: 'JS: Channel Time Delayer',
    matchName: 'Channel Time Delayer [LOSER]',
    category: 'Delay',
    desc: 'Channel Time Delayer',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Delay L', min: -100, max: 100, defaultVal: 0, unit: 'ms' },
      { index: 1, name: 'Delay R', min: -100, max: 100, defaultVal: 0, unit: 'ms' }
    ]
  },
  {
    targetName: 'JS: Tone Gate',
    matchName: 'Tone Gate [remaincalm.org]',
    category: 'Dynamics',
    desc: 'Tone Gate',
    author: 'remaincalm.org',
    sliders: [
      { index: 0, name: 'Wet Mix', min: -120, max: 6, defaultVal: -15, unit: 'dB' },
      { index: 1, name: 'Dry Mix', min: -120, max: 6, defaultVal: -3, unit: 'dB' },
      { index: 2, name: 'Frequency', min: 20, max: 400, defaultVal: 80, unit: 'Hz' },
      { index: 3, name: 'Waveform', min: 0, max: 2, defaultVal: 0 },
      { index: 4, name: 'Lowpass', min: 50, max: 10000, defaultVal: 1000, unit: 'Hz' },
      { index: 5, name: 'Threshold', min: -120, max: 6, defaultVal: -20, unit: 'dB' },
      { index: 6, name: 'Silence Length For Fadeout', min: 1, max: 4000, defaultVal: 50, unit: 'ms' },
      { index: 7, name: 'Fade In Response', min: 1, max: 100, defaultVal: 10, unit: 'ms' },
      { index: 8, name: 'Fade Out Response', min: 1, max: 1000, defaultVal: 100, unit: 'ms' },
      { index: 9, name: 'Dynamic Pitch', min: 0, max: 4, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Tone Generator',
    matchName: 'Tone Generator',
    category: 'Synthesis',
    desc: 'Tone Generator',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Wet Mix', min: -120, max: 6, defaultVal: -12, unit: 'dB' },
      { index: 1, name: 'Dry Mix', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 2, name: 'Base Frequency', min: 20, max: 24000, defaultVal: 440, unit: 'Hz' },
      { index: 3, name: 'Note', min: 0, max: 11, defaultVal: 0 },
      { index: 4, name: 'Octave', min: -4, max: 4, defaultVal: 0 },
      { index: 5, name: 'Fine Tune', min: -100, max: 100, defaultVal: 0, unit: 'cents' },
      { index: 6, name: 'Shape', min: 0, max: 2, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Tonifier',
    matchName: 'Tonifier',
    category: 'Synthesis',
    desc: 'Tonifier',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Wet Mix', min: -100, max: 6, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Dry Mix', min: -100, max: 6, defaultVal: -100, unit: 'dB' },
      { index: 2, name: 'Block Size', min: 1, max: 1000, defaultVal: 10, unit: 'ms' },
      { index: 3, name: 'Frequency Shift', min: -48, max: 48, defaultVal: 0, unit: 'st' },
      { index: 4, name: 'max auto shift', min: 0, max: 6, defaultVal: 0, unit: 'octaves' },
      { index: 5, name: 'auto shift min frequency', min: 0, max: 20000, defaultVal: 100, unit: 'Hz' },
      { index: 6, name: 'auto shift max frequency', min: 0, max: 20000, defaultVal: 1000, unit: 'Hz' },
      { index: 7, name: 'Output frequency', min: 0, max: 0, defaultVal: 0, unit: 'Hz' }
    ]
  },
  {
    targetName: 'JS: Time Difference Pan',
    matchName: 'Time Difference Pan',
    category: 'Stereo & Spatial',
    desc: 'Time Difference Pan',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Pan (%)', min: -100, max: 100, defaultVal: 0 }
    ]
  }
];

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');
let count = 0;

for (const update of updates) {
  const tName = update.targetName;
  const match1 = `name: "${tName}"`;
  const match2 = `name: '${tName}'`;
  let nameIndex = srcCode.indexOf(match1);
  if (nameIndex === -1) nameIndex = srcCode.indexOf(match2);
  
  if (nameIndex > -1) {
    let slidersIndex = srcCode.indexOf('sliders: [', nameIndex);
    if (slidersIndex === -1) slidersIndex = srcCode.indexOf('"sliders": [', nameIndex);
    if (slidersIndex > -1) {
        const endOfArray = srcCode.indexOf(']', slidersIndex);
        if (endOfArray > -1) {
            let replacementStr = 'sliders: [\n';
            if (update.sliders.length > 0) {
                replacementStr += update.sliders.map(s => '      ' + JSON.stringify(s)).join(',\n') + '\n    ';
            }
            replacementStr += ']';
            srcCode = srcCode.slice(0, slidersIndex) + replacementStr + srcCode.slice(endOfArray + 1);
            console.log('Updated existing: ' + tName);
            count++;
        }
    }
  } else {
    console.log('Adding new plugin: ' + tName);
    const newProfile = {
      name: tName,
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
      count++;
    } else {
      console.log('Failed to add: ' + tName);
    }
  }
}

fs.writeFileSync('src/data/jsfxResearch.ts', srcCode, 'utf8');
console.log('Successfully processed ' + count + ' JSFX updates.');
