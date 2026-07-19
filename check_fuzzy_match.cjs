const fs = require('fs');
const path = require('path');

// Import the database
// Since it's typescript, we can execute with tsx
const script = `
import { UAD_DATABASE } from './src/data/uadDatabase';

const userPlugins = [
  "UAD elysia karacter Stereo Saturator",
  "UAD Black Box Analog Design HG-2",
  "UAD elysia alpha compressor V2",
  "UAD SPL Vitalizer MK3-T",
  "UAD Shadow Hills Mastering Compressor Class A",
  "UAD Maag Audio EQ4 MS",
  "UAD A-Type Multiband Enhancer",
  "UAD LA-6176 Signature Channel Strip",
  "UAD Antares Auto-Tune Realtime X",
  "UAD Hemisphere Mic Collection",
  "UAD C-Suite C-Max Limiter",
  "UAD Hitsville Reverb Chambers",
  "UAD C-Suite C-Axe Guitar Noise Suppressor",
  "UAD Hitsville EQ Collection",
  "UAD AMS DMX 15-80 S Digital Delay and Pitch Shifter",
  "UAD Manley Reference Microphone Preamplifier",
  "UAD API Vision Channel Strip Collection",
  "UAD API Preamp",
  "UAD C-Suite C-Vox Noise and Ambience Reduction",
  "UAD Neve Dynamics Collection",
  "UAD Neve 1084 Preamp and EQ",
  "UAD Avalon VT-737sp Channel Strip",
  "UAD Oxford SuprEsser DS",
  "UAD Diezel VH4 Amplifier",
  "UAD Auto-Tune Realtime Access",
  "UAD UA 175B and 176 Tube Compressor Collection",
  "UAD Capitol Chambers",
  "UAD Tube-Tech CL 1B mk II",
  "UAD V76 Preamp",
  "UAD Auto-Tune Realtime Advanced",
  "UAD Diezel Herbert Amplifier",
  "UAD Lexicon 480L Digital Reverb and Effects",
  "UAD Softube Vocoder",
  "UAD AMS Neve DFC Channel Strip",
  "UAD Suhr SE100 Amplifier",
  "UAD bx_masterdesk Classic",
  "UAD Century Tube Channel Strip",
  "UAD bx_masterdesk",
  "UAD Suhr PT100 Amplifier",
  "UAD Putnam Microphone Collection",
  "UAD Ampeg SVT-VR Classic Bass Amplifier",
  "UAD Neve Preamp",
  "UAD ADA Flanger",
  "UAD Friedman Buxom Betty Amplifier",
  "UAD Helios Type 69 Preamp and EQ Collection",
  "UAD Empirical Labs EL8 Distressor Compressor",
  "UAD Dytronics Tri-Stereo Chorus",
  "UAD Gallien-Krueger 800RB Bass Amplifier",
  "UAD Marshall Plexi Classic Amplifier",
  "UAD Ocean Way Microphone Collection",
  "UAD TS Overdrive",
  "UAD Korg SDD-3000 Digital Delay",
  "UAD Oxford Dynamic EQ",
  "UAD Dytronics Cyclosonic Panner",
  "UAD ENGL Savage 120 Guitar Amplifier",
  "UAD AMS RMX16 Expanded Digital Reverb",
  "UAD Pure Plate Reverb",
  "UAD SSL 4000 G Bus Compressor Collection",
  "UAD Antares Auto-Tune Realtime",
  "UAD Eden WT800 Bass Amplifier",
  "UAD Fuchs Train II Guitar Amplifier",
  "UAD Moog Multimode Filter Collection",
  "UAD SSL 4000 E Channel Strip Collection",
  "UAD OTO Biscuit 8-bit Filter Effects",
  "UAD Fuchs Overdrive Supreme 50 Amplifier",
  "UAD bx_subsynth Subharmonic Synth",
  "UAD API 2500 Bus Compressor",
  "UAD Sphere Mic Collection",
  "UAD Chandler Limited Zener Limiter",
  "UAD ADA STD-1 Stereo Tapped Delay",
  "UAD Manley VOXBOX Channel Strip",
  "UAD Ampeg B15N Bass Amplifier",
  "UAD Galaxy Tape Echo",
  "UAD Studio D Chorus",
  "UAD Brigade Chorus",
  "UAD Fender 55 Tweed Deluxe Amplifier",
  "UAD Chandler Limited Curve Bender EQ",
  "UAD Oxford Limiter V2",
  "UAD Oxford Envolution Envelope Shaper",
  "UAD bx_digital V3 EQ Collection",
  "UAD Marshall JMP 2203 Amplifier",
  "UAD Oxide Tape Recorder",
  "UAD Eventide H910 Harmonizer",
  "UAD Marshall Bluesbreaker 1962 Amplifier",
  "UAD Marshall Silver Jubilee 2555 Amplifier",
  "UAD AKG BX 20 Spring Reverb",
  "UAD Tube-Tech EQ Collection",
  "UAD Ampeg SVT-VR Bass Amplifier",
  "UAD Ampeg SVT-3 Pro Bass Amplifier",
  "UAD Neve 88RS Channel Strip Collection",
  "UAD Marshall Plexi Super Lead 1959 Amplifier",
  "UAD Tube-Tech CL 1B Compressor",
  "UAD Ibanez Tube Screamer TS808 Overdrive",
  "UAD Raw Distortion",
  "UAD Bermuda Triangle Distortion",
  "UAD Friedman Amplifiers Collection",
  "UAD Sound Machine Wood Works",
  "UAD Manley Variable Mu Limiter",
  "UAD Vertigo VSC-2 Compressor",
  "UAD Vertigo VSM-3 Saturator",
  "UAD Massenburg DesignWorks MDWEQ5 EQ",
  "UAD AMS RMX16 Digital Reverb",
  "UAD Summit Audio TLA-100A Compressor",
  "UAD elysia alpha compressor",
  "UAD elysia mpressor",
  "UAD Thermionic Culture Vulture Distortion",
  "UAD Tonelux Tilt EQ",
  "UAD Valley People Dyna-mite Dynamics",
  "UAD Neve 1073 Preamp and EQ Collection",
  "UAD Chandler GAV19T Guitar Amplifier",
  "UAD bx_refinement",
  "UAD bx_saturator V2",
  "UAD UA 610-A Tube Preamp and EQ",
  "UAD UA 610-B Tube Preamp and EQ",
  "UAD Dangerous BAX EQ Collection",
  "UAD Fairchild Tube Limiter Collection",
  "UAD Maag EQ4 EQ",
  "UAD API Vision Channel Strip Legacy",
  "UAD ENGL 646 VS Guitar Amplifier",
  "UAD ENGL 765 RT Guitar Amplifier",
  "UAD bx_tuner",
  "UAD Pultec Passive EQ Collection",
  "UAD Millennia NSEQ-2 EQ",
  "UAD Ocean Way Studios Room Modeler",
  "UAD Oxford Inflator",
  "UAD SPL TwinTube Saturation",
  "UAD Teletronix LA-2A Leveler Collection",
  "UAD API 500 EQ Collection",
  "UAD Softube Vintage Amp Room",
  "UAD Softube Metal Amp Room",
  "UAD Softube Bass Amp Room",
  "UAD Precision K-Stereo Ambience Recovery",
  "UAD Shadow Hills Mastering Compressor",
  "UAD Oxford EQ",
  "UAD UA 1176 Limiter Collection",
  "UAD MXR Flanger-Doubler",
  "UAD Little Labs VOG Bass Enhancer",
  "UAD Ampex ATR-102 Tape Recorder",
  "UAD bx_digital V2 EQ",
  "UAD SPL Vitalizer MK2-T",
  "UAD Lexicon 224 Digital Reverb",
  "UAD SSL 4000 E Legacy Channel Strip",
  "UAD SSL 4000 G Legacy Bus Compressor",
  "UAD Studer A800 Tape Recorder",
  "UAD EP-34 Tape Echo",
  "UAD Precision Enhancer Hz",
  "UAD Manley Massive Passive EQ Collection",
  "UAD Trident A-Range EQ",
  "UAD Empirical Labs EL7 FATSO Compressor",
  "UAD EMT 250 Digital Reverb",
  "UAD Neve 31102 EQ",
  "UAD 4K Buss Compressor",
  "UAD 4K Channel Strip",
  "UAD Cooper Time Cube Delay",
  "UAD Harrison 32C EQ",
  "UAD Little Labs IBP Phase Alignment",
  "UAD Moog Multimode Legacy Filter",
  "UAD Precision Enhancer kHz",
  "UAD dbx 160 Compressor",
  "UAD SPL Transient Designer",
  "UAD Precision Buss Compressor",
  "UAD Precision De-Esser",
  "UAD Precision Maximizer",
  "UAD Teletronix LA-3A Audio Leveler",
  "UAD Neve 88RS Legacy Channel Strip",
  "UAD Helios Type 69 Legacy EQ",
  "UAD Neve 1081 EQ",
  "UAD Neve 33609 Stereo Limiter Compressor",
  "UAD Neve 1073 Legacy EQ",
  "UAD Precision Multiband Compressor",
  "UAD Precision Equalizer",
  "UAD EMT 140 Plate Reverb",
  "UAD Precision Limiter",
  "UAD Softube Amp Room Half-Stack",
  "UAD Softube Bass Amp Room 8x10",
  "UAD Teletronix LA-2A Legacy Leveler",
  "UAD UA 1176LN Legacy Limiter",
  "UAD UA 1176SE Legacy Limiter",
  "UAD Pultec-Pro Legacy EQ",
  "UAD Fairchild 670 Legacy Limiter",
  "UAD DreamVerb Room Modeler",
  "UAD Cambridge EQ",
  "UAD RealVerb-Pro Room Modeler",
  "UAD Pultec EQP-1A Legacy EQ",
  "UAD Precision Mix Rack Collection",
  "UAD Roland RE-201 Tape Delay",
  "UAD Roland Dimension D Chorus",
  "UAD Roland CE-1 Chorus"
];

const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const dbPlugins = UAD_DATABASE;
console.log('Database total length:', dbPlugins.length);

const matchedIdxs = new Set<number>();
const results = userPlugins.map(upName => {
  const upClean = clean(upName);
  let bestMatchIdx = -1;
  let bestMatchScore = 0; // exact clean match is 1, fuzzy could be lower

  // First try clean exact match
  for (let i = 0; i < dbPlugins.length; i++) {
    const dbClean = clean(dbPlugins[i].displayName);
    if (dbClean === upClean) {
      bestMatchIdx = i;
      bestMatchScore = 1;
      break;
    }
  }

  // If no clean exact match, try substring match (user name inside db name or vice versa)
  if (bestMatchIdx === -1) {
    for (let i = 0; i < dbPlugins.length; i++) {
      const dbClean = clean(dbPlugins[i].displayName);
      if (dbClean.includes(upClean) || upClean.includes(dbClean)) {
        bestMatchIdx = i;
        bestMatchScore = 0.8;
        break;
      }
    }
  }

  if (bestMatchIdx !== -1) {
    matchedIdxs.add(bestMatchIdx);
    return {
      user: upName,
      db: dbPlugins[bestMatchIdx].displayName,
      score: bestMatchScore
    };
  } else {
    return {
      user: upName,
      db: null,
      score: 0
    };
  }
});

const matched = results.filter(r => r.score > 0);
const unmatched = results.filter(r => r.score === 0);

console.log('Fuzzy matched count:', matched.length);
console.log('Unmatched count:', unmatched.length);
if (unmatched.length > 0) {
  console.log('First 20 unmatched user plugins:');
  unmatched.slice(0, 20).forEach(u => console.log(' - ' + u.user));
}

// Check which DB plugins were not matched at all
const unmatchedDb = dbPlugins.filter((_, idx) => !matchedIdxs.has(idx));
console.log('DB plugins not matched by any user plugin:', unmatchedDb.length);
if (unmatchedDb.length > 0) {
  console.log('First 20 unmatched DB plugins:');
  unmatchedDb.slice(0, 20).forEach(u => console.log(' - ' + u.displayName));
}
`;

fs.writeFileSync('temp_fuzzy.ts', script);
