import { VSTPlugin } from '../types';

/**
 * User Gear Rack Seed
 * Sourced directly from the user's Studio One / DAW pluginmanagement.txt CSV export.
 * Used to immediately populate the active gear rack and provide a full manifest
 * when copying the Studio & Sample Vault Driver link.
 */
export const USER_GEAR_PRESET_PLUGINS: VSTPlugin[] = [
  // Acqua
  { vendor: 'Acqua', name: 'GREY', type: 'VST3', version: '3.0.0', lastModified: '2 years ago' },
  { vendor: 'Acqua', name: 'GREYULTRA', type: 'VST3', version: '3.0.0', lastModified: '2 years ago' },
  { vendor: 'Acqua', name: 'GREYULTRAZL', type: 'VST3', version: '3.0.0', lastModified: '2 years ago' },
  { vendor: 'Acqua', name: 'GREYZL', type: 'VST3', version: '3.0.0', lastModified: '2 years ago' },
  { vendor: 'Acqua', name: 'PUMPKIN', type: 'VST3', version: '3.0.0', lastModified: '2 years ago' },
  { vendor: 'Acqua', name: 'PUMPKINZL', type: 'VST3', version: '3.0.0', lastModified: '2 years ago' },

  // AIR Music Technology
  { vendor: 'AIR Music Technology', name: 'Xpand!2', type: 'VST3', version: '2.3.1.471de85', lastModified: 'Last year' },

  // Ample Sound
  { vendor: 'Ample Sound', name: 'APC', type: 'VST2', version: '1.0.1.0', lastModified: '8 years ago' },

  // Antares
  { vendor: 'Antares', name: 'Auto-Key 2', type: 'VST3', version: '2.0.0', lastModified: '2 years ago' },
  { vendor: 'Antares', name: 'AVOX CHOIR', type: 'VST3', version: '4.3.0', lastModified: '3 years ago' },

  // Audio Damage
  { vendor: 'Audio Damage. Inc.', name: 'Basic x64', type: 'VST2', version: '1.0.0.0', lastModified: 'Last year' },

  // Celemony
  { vendor: 'Celemony', name: 'Melodyne', type: 'VST3', version: '5.3.1', lastModified: '3 years ago' },

  // Cherry Audio
  { vendor: 'Cherry Audio', name: 'Surrealistic MG-1 Plus', type: 'VST3', version: '1.4.0', lastModified: '3 years ago' },
  { vendor: 'Cherry Audio', name: 'Synthesizer Expander Module', type: 'VST3', version: '1.0.2', lastModified: '2 years ago' },
  { vendor: 'Cherry Audio', name: 'Voltage Modular', type: 'VST3', version: '2.7.0', lastModified: '3 years ago' },
  { vendor: 'Cherry Audio', name: 'Voltage Modular FX', type: 'VST3', version: '2.7.0', lastModified: '3 years ago' },

  // Eventide
  { vendor: 'Eventide', name: 'Temperance Lite', type: 'VST3', version: '1.0.1', lastModified: '5 months ago' },

  // FabFilter
  { vendor: 'FabFilter', name: 'Pro-Q 3', type: 'VST3', version: '3.2.3.0', lastModified: '2 years ago' },

  // Focusrite
  { vendor: 'Focusrite', name: 'fast-balancer', type: 'VST2', version: '1.0.0.0', lastModified: '3 years ago' },

  // FutureAudioWorkshop
  { vendor: 'FutureAudioWorkshop', name: 'SubLab', type: 'VST3', version: '1.0.0', lastModified: '3 years ago' },

  // iZotope
  { vendor: 'iZotope', name: 'Ozone 11', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Dynamic EQ', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Dynamics', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Equalizer', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Exciter', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Imager', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Impact', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Low End Focus', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Maximizer', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Spectral Shaper', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Stabilizer', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Vintage Compressor', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Vintage EQ', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Vintage Limiter', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Ozone 11 Vintage Tape', type: 'VST3', version: '11.0.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Neutron 4', type: 'VST3', version: '4.5.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Neutron 4 Compressor', type: 'VST3', version: '4.5.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Neutron 4 Equalizer', type: 'VST3', version: '4.5.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Neutron 4 Exciter', type: 'VST3', version: '4.5.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Neutron 4 Sculptor', type: 'VST3', version: '4.5.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Neutron 4 Transient Shaper', type: 'VST3', version: '4.5.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Neutron 4 Unmask', type: 'VST3', version: '4.5.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Nectar 4', type: 'VST3', version: '4.0.1', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Nectar 4 Compressor', type: 'VST3', version: '4.0.1', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Nectar 4 DeEsser', type: 'VST3', version: '4.0.1', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Nectar 4 Equalizer', type: 'VST3', version: '4.0.1', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Nectar 4 Pitch', type: 'VST3', version: '4.0.1', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Relay', type: 'VST3', version: '1.4.0', lastModified: '2 years ago' },
  { vendor: 'iZotope', name: 'Tonal Balance Control 2', type: 'VST3', version: '2.7.0', lastModified: '2 years ago' },
  { vendor: 'iZotope. Inc.', name: 'Stutter Edit 2', type: 'VST3', version: '2.1.0', lastModified: '3 years ago' },

  // Native Instruments
  { vendor: 'Native Instruments', name: 'Kontakt 7', type: 'VST3', version: '7.6.1', lastModified: '2 years ago' },
  { vendor: 'Native Instruments', name: 'Raum', type: 'VST3', version: '1.3.1', lastModified: '3 years ago' },
  { vendor: 'Native Instruments', name: 'Replika', type: 'VST3', version: '1.6.1', lastModified: '3 years ago' },

  // PreSonus Studio One Native
  { vendor: 'PreSonus', name: 'Analog Delay', type: '(Native)', version: '6.6.4', lastModified: 'Last year' },
  { vendor: 'PreSonus', name: 'Autofilter', type: '(Native)', version: '6.6.4', lastModified: 'Last year' },
  { vendor: 'PreSonus', name: 'Channel Strip', type: '(Native)', version: '6.6.4', lastModified: 'Last year' },
  { vendor: 'PreSonus', name: 'Chorus', type: '(Native)', version: '6.6.4', lastModified: 'Last year' },
  { vendor: 'PreSonus', name: 'Compressor', type: '(Native)', version: '6.6.4', lastModified: 'Last year' },
  { vendor: 'PreSonus', name: 'Fat Channel', type: '(Native)', version: '6.6.4', lastModified: 'Last year' },
  { vendor: 'PreSonus', name: 'Pro EQ', type: '(Native)', version: '6.6.4', lastModified: 'Last year' },
  { vendor: 'PreSonus', name: 'Room Reverb', type: '(Native)', version: '6.6.4', lastModified: 'Last year' },
  { vendor: 'PreSonus', name: 'Tricomp', type: '(Native)', version: '6.6.4', lastModified: 'Last year' },

  // Pulsar
  { vendor: 'Pulsar', name: 'Pulsar W495', type: 'VST3', version: '1.0.6', lastModified: '2 years ago' },

  // Softube
  { vendor: 'Softube', name: 'Drawmer S73', type: 'VST3', version: '2.5.62', lastModified: '2 years ago' },
  { vendor: 'Softube', name: 'Saturation Knob', type: 'VST3', version: '2.5.62', lastModified: '2 years ago' },
  { vendor: 'Softube', name: 'TSAR-1R Reverb', type: 'VST3', version: '2.5.62', lastModified: '2 years ago' },
  { vendor: 'Softube', name: 'Tube Delay', type: 'VST3', version: '2.5.62', lastModified: '2 years ago' },

  // Sonarworks
  { vendor: 'Sonarworks', name: 'SoundID Reference Plugin', type: 'VST3', version: '5.12.3', lastModified: '5 months ago' },

  // sonible
  { vendor: 'sonible', name: 'learnComp', type: 'VST3', version: '2.0.0', lastModified: '7 months ago' },
  { vendor: 'sonible', name: 'learnEQ', type: 'VST3', version: '2.0.0', lastModified: '7 months ago' },
  { vendor: 'sonible', name: 'learnLimit', type: 'VST3', version: '2.0.1', lastModified: '7 months ago' },
  { vendor: 'sonible', name: 'learnReverb', type: 'VST3', version: '2.0.0', lastModified: '7 months ago' },
  { vendor: 'sonible', name: 'learnUnmask', type: 'VST3', version: '2.0.0', lastModified: '7 months ago' },

  // Soundtheory
  { vendor: 'Soundtheory', name: 'Gullfoss', type: 'VST3', version: '1.11.5', lastModified: '2 years ago' },
  { vendor: 'Soundtheory', name: 'Gullfoss Live', type: 'VST3', version: '1.11.5', lastModified: '2 years ago' },
  { vendor: 'Soundtheory', name: 'Gullfoss Master', type: 'VST3', version: '1.11.5', lastModified: '2 years ago' },

  // Synchro Arts
  { vendor: 'Synchro Arts', name: 'VocAlign 6 Standard VST', type: 'VST3', version: '1.3.51.1', lastModified: '11 months ago' },

  // Tokyo Dawn Labs
  { vendor: 'Tokyo Dawn Labs', name: 'TDR Nova', type: 'VST2', version: '2.1.6.0', lastModified: '2 years ago' },

  // Universal Audio (DSP & Native UADx)
  { vendor: 'Universal Audio', name: 'UAD Empirical Labs Distressor', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Neve 1073', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Neve 33609 C', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Neve 88RS', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Pultec EQP-1A', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Pultec MEQ-5', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Teletronix LA-2A Silver', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Teletronix LA-2A Gray', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Teletronix LA-3A', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD UA 1176 Rev A', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD UA 1176LN Rev E', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD UA 610-A', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD UA 610-B', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Studer A800', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD SSL E Channel Strip', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD SSL G Bus Compressor', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD API 2500', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Avalon VT-737sp', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Manley Massive Passive', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Manley Variable Mu', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Manley VOXBOX', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Lexicon 224', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Lexicon 480L', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD EMT 140', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Galaxy Tape Echo', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Pure Plate', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio', name: 'UAD Oxford Inflator', type: 'VST3', version: '11.8.0', lastModified: '7 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx 1176LN Rev E Compressor', type: 'VST3', version: '1.3.16', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx API 2500 Bus Compressor', type: 'VST3', version: '1.5.11', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Empirical Labs Distressor', type: 'VST3', version: '1.0.9', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Fairchild 670 Compressor', type: 'VST3', version: '1.0.16', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Galaxy Tape Echo', type: 'VST3', version: '1.3.16', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Hitsville EQ', type: 'VST3', version: '1.3.14', lastModified: '10 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Hitsville Reverb Chambers', type: 'VST3', version: '1.0.16', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx LA-2A Silver Compressor', type: 'VST3', version: '1.3.16', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Lexicon 224 Digital Reverb', type: 'VST3', version: '1.4.16', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Manley Massive Passive EQ', type: 'VST3', version: '1.0.5', lastModified: '10 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Manley Variable Mu Compressor', type: 'VST3', version: '1.0.6', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Moog Minimoog Synth', type: 'VST3', version: '1.4.16', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Neve 1073 Preamp and EQ', type: 'VST3', version: '1.3.16', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Pultec EQP-1A EQ', type: 'VST3', version: '1.2.14', lastModified: '10 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Pure Plate Reverb', type: 'VST3', version: '1.4.16', lastModified: '5 months ago' },
  { vendor: 'Universal Audio (UADx)', name: 'UADx Studer A800 Tape Recorder', type: 'VST3', version: '1.5.17', lastModified: '5 months ago' },

  // Vital Audio
  { vendor: 'Vital Audio', name: 'Vital', type: 'VST3', version: '1.5.5', lastModified: '3 years ago' },

  // Waves
  { vendor: 'Waves', name: 'Brauer Motion Stereo', type: 'VST3', version: '14.12.90.381', lastModified: '2 years ago' },
  { vendor: 'Waves', name: 'CLA Nx Stereo', type: 'VST3', version: '14.12.90.381', lastModified: '2 years ago' },
  { vendor: 'Waves', name: 'Clarity Vx Mono', type: 'VST3', version: '14.12.90.381', lastModified: '2 years ago' },
  { vendor: 'Waves', name: 'Silk Vocal Mono', type: 'VST3', version: '14.25.70.631', lastModified: '2 years ago' },
  { vendor: 'Waves', name: 'Vitamin Stereo', type: 'VST3', version: '14.12.90.381', lastModified: '2 years ago' },
  { vendor: 'Waves', name: 'Vocal Bender Mono', type: 'VST3', version: '14.25.70.631', lastModified: '2 years ago' },

  // XLN Audio
  { vendor: 'XLN Audio', name: 'Addictive Keys', type: 'VST3', version: 'Latest', lastModified: 'Last year' },
  { vendor: 'XLN Audio', name: 'RC-20 Retro Color', type: 'VST3', version: 'Latest', lastModified: '2 years ago' },

  // Youlean
  { vendor: 'Youlean', name: 'Youlean Loudness Meter 2', type: 'VST3', version: '2.4.3', lastModified: '5 years ago' }
];
