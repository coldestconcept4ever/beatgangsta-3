const fs = require('fs');

const updates = [
  {
    targetName: 'JS: Channel Mapper-Downmixer',
    matchName: 'Channel Mapper-Downmixer (Cockos)',
    category: 'Routing & Utility',
    desc: 'Channel Mapper-Downmixer',
    author: 'Cockos',
    sliders: []
  },
  {
    targetName: 'JS: Channel Mixer',
    matchName: 'Channel Mixer [Cockos]',
    category: 'Routing & Utility',
    desc: 'Channel Mixer',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'L->L Mix', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 1, name: 'R->R Mix', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 2, name: 'L->R Mix', min: -120, max: 6, defaultVal: -6, unit: 'dB' },
      { index: 3, name: 'R->L Mix', min: -120, max: 6, defaultVal: -6, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Chebyshev 4-Pole Filter',
    matchName: 'Chebyshev 4-Pole Filter [Liteon]',
    category: 'EQ & Filtering',
    desc: 'Chebyshev 4-Pole Filter',
    author: 'Liteon',
    sliders: [
      { index: 0, name: 'Processing', min: 0, max: 1, defaultVal: 0 },
      { index: 1, name: 'Filter Type', min: 0, max: 2, defaultVal: 0 },
      { index: 2, name: 'Cutoff (Scale)', min: 0, max: 100, defaultVal: 100 },
      { index: 3, name: 'Passband Ripple (Less/More)', min: 0, max: 0.9, defaultVal: 0.3 },
      { index: 4, name: 'Output', min: -25, max: 25, defaultVal: 0, unit: 'dB' },
      { index: 5, name: 'Limiter', min: 0, max: 1, defaultVal: 0 }
    ]
  },
  {
    targetName: 'JS: Chorus (Improved Shaping)',
    matchName: 'Chorus with Improved Shaping [Stillwell]',
    category: 'Modulation',
    desc: 'Chorus with Improved Shaping',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Chorus Length', min: 1, max: 250, defaultVal: 15, unit: 'ms' },
      { index: 1, name: 'Number Of Voices', min: 1, max: 8, defaultVal: 1 },
      { index: 2, name: 'Rate', min: 0.1, max: 16, defaultVal: 0.5, unit: 'Hz' },
      { index: 3, name: 'Pitch Fudge Factor', min: 0, max: 1, defaultVal: 0.7 },
      { index: 4, name: 'Wet Mix', min: -100, max: 12, defaultVal: -6, unit: 'dB' },
      { index: 5, name: 'Dry Mix', min: -100, max: 12, defaultVal: -6, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Chorus (Stereo)',
    matchName: 'Chorus Stereo [Stillwell]',
    category: 'Modulation',
    desc: 'Chorus Stereo',
    author: 'Stillwell',
    sliders: [
      { index: 0, name: 'Chorus Length', min: 1, max: 500, defaultVal: 15, unit: 'ms' },
      { index: 1, name: 'Number Of Voices', min: 1, max: 8, defaultVal: 1 },
      { index: 2, name: 'Rate (0=tempo sync)', min: 0, max: 16, defaultVal: 0.5, unit: 'Hz' },
      { index: 3, name: 'Pitch Fudge Factor', min: 0, max: 1, defaultVal: 0.7 },
      { index: 4, name: 'Wet Mix', min: -100, max: 12, defaultVal: -6, unit: 'dB' },
      { index: 5, name: 'Dry Mix', min: -100, max: 12, defaultVal: -6, unit: 'dB' },
      { index: 6, name: 'Channel Rate Offset', min: -1, max: 1, defaultVal: 0.0, unit: 'Hz' },
      { index: 7, name: 'Tempo Sync', min: 0.0625, max: 4, defaultVal: 0.25 }
    ]
  },
  {
    targetName: 'JS: Chorus',
    matchName: 'Chorus [Cockos]',
    category: 'Modulation',
    desc: 'Chorus',
    author: 'Cockos',
    sliders: [
      { index: 0, name: 'Chorus Length', min: 1, max: 250, defaultVal: 15, unit: 'ms' },
      { index: 1, name: 'Number Of Voices', min: 1, max: 8, defaultVal: 1 },
      { index: 2, name: 'Rate', min: 0.1, max: 16, defaultVal: 0.5, unit: 'Hz' },
      { index: 3, name: 'Pitch Fudge Factor', min: 0, max: 1, defaultVal: 0.7 },
      { index: 4, name: 'Wet Mix', min: -100, max: 12, defaultVal: -6, unit: 'dB' },
      { index: 5, name: 'Dry Mix', min: -100, max: 12, defaultVal: -6, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: Compciter',
    matchName: 'Compciter [LOSER]',
    category: 'Distortion',
    desc: 'Compciter',
    author: 'LOSER',
    sliders: [
      { index: 0, name: 'Drive', min: 0, max: 60, defaultVal: 0, unit: 'dB' },
      { index: 1, name: 'Distortion', min: 0, max: 100, defaultVal: 25, unit: '%' },
      { index: 2, name: 'Highpass', min: 800, max: 12000, defaultVal: 5000, unit: 'Hz' },
      { index: 3, name: 'Wet', min: -60, max: 24, defaultVal: -6, unit: 'dB' },
      { index: 4, name: 'Dry', min: -120, max: 0, defaultVal: 0, unit: 'dB' }
    ]
  },
  {
    targetName: 'JS: DC Filter',
    matchName: 'DC Filter [Cockos]',
    category: 'EQ & Filtering',
    desc: 'DC Filter',
    author: 'Cockos',
    sliders: []
  }
];

let srcCode = fs.readFileSync('src/data/jsfxResearch.ts', 'utf8');
let count = 0;

for (const update of updates) {
  const tName = update.targetName;
  const nameMatch1 = 'name: "' + tName + '"';
  const nameMatch2 = "name: '" + tName + "'";
  let nameIndex = srcCode.indexOf(nameMatch1);
  if (nameIndex === -1) nameIndex = srcCode.indexOf(nameMatch2);
  
  if (nameIndex > -1) {
    const slidersStartStr = 'sliders: [';
    const slidersEndStr = '    ]';
    const slidersIndex = srcCode.indexOf(slidersStartStr, nameIndex);
    const endBlockIndex = srcCode.indexOf(slidersEndStr, slidersIndex);
    
    if (slidersIndex > -1 && endBlockIndex > -1) {
      const replacementStr = 'sliders: [\n' + update.sliders.map(function(s) { return '      ' + JSON.stringify(s) }).join(',\n');
      srcCode = srcCode.slice(0, slidersIndex) + replacementStr + srcCode.slice(endBlockIndex);
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
