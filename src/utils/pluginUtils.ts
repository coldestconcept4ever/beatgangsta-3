import { VSTPlugin } from '../types';
import { UAD_DATABASE } from '../data/uadDatabase';

/**
 * Maps vendor-specific parameter names to standardized ones or vice versa
 * to help the AI understand specific plugin interfaces better.
 */
export const normalizeParameterName = (vendor: string, name: string, parameter: string): string => {
  const v = vendor.toLowerCase();
  const n = name.toLowerCase();
  const p = parameter.toLowerCase();

  // iZotope Specific Logic
  if (v.includes('izotope')) {
    if (p.includes('amount') && p.includes('mix')) return 'Dry/Wet Mix';
    if (p.includes('makeup')) return 'Makeup Gain';
  }

  // Waves Specific Logic
  if (v.includes('waves')) {
    if (p === 'thresh') return 'Threshold';
    if (p === 'attk') return 'Attack';
    if (p === 'rel') return 'Release';
  }

  // FabFilter Specific Logic
  if (v.includes('fabfilter')) {
    if (p.includes('knee')) return 'Knee (Soft/Hard)';
  }

  // UAD / Antares Specific Logic
  if (v.includes('universal audio') || v.includes('uad') || v.includes('antares')) {
    if (n.includes('auto-tune')) {
      // UAD Auto-Tune Realtime Advanced specifically does NOT have throat modeling
      if (p.includes('throat')) return 'N/A (Not available on UAD Realtime Advanced)';
    }
  }

  return parameter;
};

/**
 * Enriches a plugin's parameters with vendor-specific knowledge
 * if the AI research missed some obvious ones.
 */
export const getVendorSpecificParameters = (vendor: string, name: string): string[] => {
  const v = vendor.toLowerCase();
  const n = name.toLowerCase();

  // Ground truth lookup from the certified UAD Database
  if (v.includes('universal audio') || v.includes('uad') || v.includes('antares')) {
    const matchedProfile = UAD_DATABASE.find(p => 
      n.includes(p.name) || 
      p.name.includes(n) || 
      n.includes(p.displayName.toLowerCase())
    );
    if (matchedProfile) {
      return matchedProfile.parameters.map(param => {
        if (param.options && param.options.length > 0) {
          return `${param.name} (${param.options.join(', ')})`;
        }
        return `${param.name} (${param.range})`;
      });
    }
  }

  if (v.includes('izotope')) {
    if (n.includes('ozone')) {
      return ['Threshold', 'Margin', 'Character', 'Stereo Width', 'Crossover', 'Makeup Gain', 'Ceiling', 'True Peak'];
    }
    if (n.includes('neutron')) {
      return ['Threshold', 'Ratio', 'Attack', 'Release', 'Mix', 'Makeup', 'Knee', 'Sidechain'];
    }
    if (n.includes('nectar')) {
      return ['Pitch', 'Strength', 'Speed', 'De-esser', 'Compressor', 'EQ', 'Saturation', 'Limiter'];
    }
    if (n.includes('tonal balance')) {
      return ['Target Curve', 'Crest Factor', 'Low End Focus', 'Spectrum'];
    }
    if (n.includes('stutter edit')) {
      return ['Stutter Rate', 'Quantize', 'Buffer', 'Filter', 'Lo-Fi', 'Delay', 'Reverb', 'Output'];
    }
    if (n.includes('relay')) {
      return ['Gain', 'Pan', 'Width', 'Phase', 'High Pass Filter'];
    }
  }

  if (v.includes('antares')) {
    if (n.includes('auto-key')) {
      return ['Key', 'Scale', 'Reference Detune', 'Send to Auto-Tune'];
    }
    if (n.includes('choir')) {
      return ['Choir Size', 'Vibrato Variation', 'Pitch Variation', 'Timing Variation', 'Stereo Spread'];
    }
  }

  if (v.includes('fabfilter')) {
    if (n.includes('pro-q')) {
      // Pro-Q 3 specific band-based parameters for the AI to fill
      return [
        'Low End Band (Freq: 45Hz, Gain: 0.0dB, Type: Low Shelf, Slope: 12dB/oct, Q: 0.70, Stereo: Stereo, Dynamic: Off)',
        'Band 1 (Freq, Gain, Type, Slope, Q, Stereo, Dynamic, Range)',
        'Band 2 (Freq, Gain, Type, Slope, Q, Stereo, Dynamic, Range)',
        'Band 3 (Freq, Gain, Type, Slope, Q, Stereo, Dynamic, Range)',
        'Band 4 (Freq, Gain, Type, Slope, Q, Stereo, Dynamic, Range)',
        'Band 5 (Freq, Gain, Type, Slope, Q, Stereo, Dynamic, Range)',
        'Band 6 (Freq, Gain, Type, Slope, Q, Stereo, Dynamic, Range)',
        'Output Gain', 'Phase Mode (Zero Latency/Natural/Linear)', 'Display Range'
      ];
    }
    if (n.includes('pro-c')) {
      return ['Threshold', 'Ratio', 'Attack', 'Release', 'Knee', 'Range', 'Hold', 'Lookahead', 'Mix'];
    }
    if (n.includes('pro-l')) {
      return ['Gain', 'True Peak', 'Lookahead', 'Attack', 'Release', 'Channel Linking', 'Oversampling'];
    }
  }

  if (v.includes('universal audio') || v.includes('uad') || v.includes('antares')) {
    if (n.includes('auto-tune')) {
      // Correct UAD Antares parameters
      return ['Retune Speed', 'Humanize', 'Flex-Tune', 'Natural Vibrato', 'Target Notes', 'Key', 'Scale', 'Correction Mode'];
    }
    if (n.includes('1176')) {
      return ['Input', 'Output', 'Attack', 'Release', 'Ratio (4, 8, 12, 20, ALL)'];
    }
    if (n.includes('la-2a')) {
      return ['Peak Reduction', 'Gain', 'Limit/Compress Switch'];
    }
    if (n.includes('pultec')) {
      return ['Boost', 'Attenuation', 'Frequency', 'Bandwidth'];
    }
    if (n.includes('neve 1073')) {
      return ['Input Gain', 'Output Level', 'High Shelf (12k)', 'Mid Band (Freq/Gain)', 'Low Shelf (Freq/Gain)', 'High Pass Filter', 'Phase', 'EQ In/Out'];
    }
    if (n.includes('api vision') || n.includes('api 212l')) {
      return ['Preamp Gain', 'Threshold', 'Ratio', 'Attack', 'Release', 'EQ High (Freq/Gain)', 'EQ Mid (Freq/Gain)', 'EQ Low (Freq/Gain)', 'Filter', 'Output'];
    }
    if (n.includes('ssl 4000') || n.includes('ssl e channel')) {
      return ['Threshold', 'Ratio', 'Attack', 'Release', 'Expander/Gate', 'High EQ', 'H-Mid EQ', 'L-Mid EQ', 'Low EQ', 'Filters', 'VCA Gain'];
    }
    if (n.includes('fairchild')) {
      return ['Threshold', 'Time Constant', 'Input Gain', 'Output Level', 'Sidechain Filter', 'Balance', 'Bias'];
    }
    if (n.includes('lexicon 224')) {
      return ['Bass', 'Mid', 'Crossover', 'Treble Decay', 'Depth', 'Diffusion', 'Pre-delay', 'Mode Select', 'Mix'];
    }
    if (n.includes('capitol chambers')) {
      return ['Chamber Select', 'Pre-delay', 'Decay', 'Filter', 'Mix', 'Microphone Placement', 'Speaker Select'];
    }
    if (n.includes('studer a800')) {
      return ['Input', 'Output', 'Tape Speed', 'Tape Formula', 'Bias', 'HF Driver', 'LF Driver', 'Hiss', 'Hum'];
    }
    if (n.includes('ampex atr-102')) {
      return ['Record Level', 'Repro Level', 'Tape Speed', 'Tape Formula', 'Head Width', 'Bias', 'Crosstalk', 'Noise'];
    }
    if (n.includes('massive passive')) {
      return ['Gain', 'Band 1 (Freq/Gain)', 'Band 2 (Freq/Gain)', 'Band 3 (Freq/Gain)', 'Band 4 (Freq/Gain)', 'Filter', 'Master Gain'];
    }
    if (n.includes('voxbox')) {
      return ['Preamp Gain', 'Compressor Threshold', 'De-esser Threshold', 'EQ Low', 'EQ Mid', 'EQ High', 'Output'];
    }
    if (n.includes('fender 55') || n.includes('tweed deluxe')) {
      return ['Volume (Inst/Mic)', 'Tone', 'Instrument Input (1/2)', 'Mic Input (1/2)', 'Speaker Select', 'Mic Placement'];
    }
    if (n.includes('marshall plexi')) {
      return ['Volume I', 'Volume II', 'High', 'Middle', 'Low', 'Presence', 'Patch Input', 'Master Volume'];
    }
    if (n.includes('ampeg svt')) {
      return ['Gain', 'Bass', 'Midrange', 'Treble', 'Ultra Hi/Lo', 'Master', 'Graphic EQ', 'Limit'];
    }
    if (n.includes('re-201') || n.includes('space echo')) {
      return ['Mode Selector', 'Repeat Rate', 'Intensity', 'Echo Volume', 'Pan', 'Reverb Volume', 'Treble', 'Bass', 'Tape Age'];
    }
    if (n.includes('studio d chorus')) {
      return ['Dimension Mode (1, 2, 3, 4)', 'All Buttons Mode', 'Mix'];
    }
    if (n.includes('brigade chorus')) {
      return ['Rate', 'Depth', 'Bucket Brigade Mode', 'Mix', 'Vibrato/Chorus Switch'];
    }
    if (n.includes('helios type 69')) {
      return ['Preamp Gain', 'High EQ', 'Mid Freq', 'Mid Gain', 'Low EQ', 'Phase', 'EQ Cut'];
    }
    if (n.includes('v76')) {
      return ['Gain', 'Low Cut', 'Phase', 'Output'];
    }
    if (n.includes('century tube')) {
      return ['Preamp Gain', 'Input Select', 'Low EQ Shelf', 'Mid EQ Gain', 'Mid EQ Freq', 'High EQ Shelf', 'Compressor Threshold', 'Master Level'];
    }
    if (n.includes('ua 610-b')) {
      return ['Level', 'High Shelf', 'Low Shelf', 'Gain', 'Output'];
    }
    if (n.includes('precision limiter')) {
      return ['Ceiling', 'Threshold', 'Release', 'Attack', 'Knee', 'Mode'];
    }
    if (n.includes('precision maximizer')) {
      return ['Shape', 'Mix', 'Limit', 'Output'];
    }
    if (n.includes('precision multiband')) {
      return ['Threshold (5 Bands)', 'Ratio (5 Bands)', 'Attack (5 Bands)', 'Release (5 Bands)', 'Gain (5 Bands)', 'Crossover Freq'];
    }
    if (n.includes('oxide tape')) {
      return ['Input', 'Output', 'Tape Speed (7.5/15)', 'EQ (NAB/CCIR)'];
    }
    if (n.includes('pure plate')) {
      return ['Reverb Time', 'Pre-delay', 'Bass', 'Treble', 'Mix', 'Balance'];
    }
    if (n.includes('distressor')) {
      return ['Ratio (1, 2, 3, 4, 6, 10, 20, Nuke)', 'Input', 'Output', 'Attack', 'Release', 'Detector Mode', 'Audio Mode', 'Dry/Wet Mix'];
    }
    if (n.includes('ssl g-bus') || n.includes('ssl g bus')) {
      return ['Threshold', 'Ratio', 'Attack', 'Release', 'Make-up', 'Auto Fade', 'Mix', 'Sidechain Filter'];
    }
    if (n.includes('neve 1081')) {
      return ['Input Gain', 'High Shelf', 'High Mid', 'Low Mid', 'Low Shelf', 'High Pass', 'Low Pass', 'EQ In/Out'];
    }
    if (n.includes('neve 33609')) {
      return ['Threshold', 'Recovery (Release)', 'Ratio', 'Gain', 'Compressor In/Out', 'Limiter Threshold', 'Limiter Recovery'];
    }
    if (n.includes('shadow hills')) {
      return ['Optical Threshold', 'Discrete Threshold', 'Ratio', 'Attack', 'Recover', 'Transformer Select (Nickel, Iron, Steel)', 'Gain'];
    }
    if (n.includes('api 2500')) {
      return ['Threshold', 'Ratio', 'Attack', 'Release', 'Variable Release', 'Knee', 'Thrust', 'Type (Old/New)', 'Mix'];
    }
    if (n.includes('api 550a')) {
      return ['High Freq/Gain', 'Mid Freq/Gain', 'Low Freq/Gain', 'Filter', 'EQ In/Out'];
    }
    if (n.includes('api 560')) {
      return ['31Hz', '63Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'];
    }
    if (n.includes('variable mu')) {
      return ['Dual Threshold', 'Attack', 'Recovery', 'Output', 'Sidechain Filter', 'Mix', 'Link'];
    }
    if (n.includes('cl 1b')) {
      return ['Gain', 'Ratio', 'Threshold', 'Attack', 'Release', 'Attack/Release Select (Fixed/Manual/Combined)'];
    }
    if (n.includes('tla-100a')) {
      return ['Gain', 'Reduction', 'Attack', 'Release', 'Sidechain Filter', 'Saturation'];
    }
    if (n.includes('k-stereo')) {
      return ['Ambience Level', 'Ambience Recovery', 'Deepness', 'Wide', 'Filter', 'Gain'];
    }
    if (n.includes('vog') || n.includes('voice of god')) {
      return ['Frequency', 'Amplitude', 'Center', 'Flat'];
    }
    if (n.includes('moog multimode')) {
      return ['Cutoff', 'Resonance', 'Drive', 'Envelope Amount', 'LFO Rate', 'LFO Amount', 'Filter Type (LP/HP/BP)'];
    }
    if (n.includes('vt-737sp') || n.includes('avalon')) {
      return ['Preamp Gain', 'Compressor Threshold', 'Ratio', 'Attack', 'Release', 'EQ High', 'EQ High-Mid', 'EQ Low-Mid', 'EQ Low', 'Output'];
    }
    if (n.includes('ocean way')) {
      return ['Studio Select (A/B)', 'Mic Distance', 'Mic Select', 'Master EQ', 'Master Gain', 'Mix'];
    }
    if (n.includes('sound city')) {
      return ['Room Mode', 'Mic Placement', 'EQ Section', 'Dynamics Section', 'Master Mix'];
    }
    if (n.includes('hitsville eq')) {
      return ['50Hz', '130Hz', '320Hz', '800Hz', '2kHz', '5kHz', '12.5kHz', 'Gain'];
    }
    if (n.includes('la-3a')) {
      return ['Peak Reduction', 'Gain', 'Limit/Compress Switch'];
    }
    if (n.includes('175b') || n.includes('176')) {
      return ['Input', 'Output', 'Attack', 'Release', 'Ratio', 'Sidechain Filter'];
    }
    if (n.includes('dbx 160')) {
      return ['Threshold', 'Compression (Ratio)', 'Output Gain'];
    }
    if (n.includes('fatso')) {
      return ['Input', 'Output', 'Warmth', 'Tranny', 'Compressor Mode (Buss/Spank/Logic/General)'];
    }
    if (n.includes('culture vulture')) {
      return ['Drive', 'Overdrive', 'Function (Triode/Pentode)', 'Bias', 'Filter', 'Output'];
    }
    if (n.includes('vsc-2')) {
      return ['Threshold', 'Ratio', 'Attack', 'Release', 'Make-up', 'Soft/Hard Knee'];
    }
    if (n.includes('vsm-3')) {
      return ['Saturator Level', 'Saturator Drive', 'Crusher Level', 'Crusher Drive', 'THD Mix', 'M/S Mode'];
    }
    if (n.includes('bax eq')) {
      return ['Low Freq', 'Low Cut', 'High Freq', 'High Cut', 'Gain'];
    }
    if (n.includes('curve bender')) {
      return ['Gain', 'Frequency (4 Bands)', 'Q (4 Bands)', 'Filter', 'Output'];
    }
    if (n.includes('zener limiter')) {
      return ['Input', 'Output', 'Comp/Limit Mode', 'Attack', 'Release', 'Sidechain Filter'];
    }
    if (n.includes('bx_digital')) {
      return ['Gain', 'Freq', 'Q', 'Stereo Width', 'Mono Maker', 'Bass Shift', 'Presence Shift'];
    }
    if (n.includes('bx_masterdesk')) {
      return ['Volume', 'Foundation', 'De-Esser', 'Bass', 'Mids', 'Presence', 'Treble', 'Compressor Mix', 'Mono Maker', 'Stereo Width', 'THD', 'Output Trim'];
    }
    if (n.includes('eq4')) {
      return ['Sub', '40Hz', '160Hz', '650Hz', '2.5kHz', 'Air Gain', 'Air Band Freq'];
    }
    if (n.includes('transient designer')) {
      return ['Attack', 'Sustain', 'Gain'];
    }
    if (n.includes('h910') || n.includes('h949')) {
      return ['Pitch Ratio', 'Delay Time', 'Feedback', 'Mix', 'Anti-Feedback'];
    }
    if (n.includes('480l')) {
      return ['Bank Select', 'Program Select', 'Size', 'Reverb Time', 'Diffusion', 'Pre-delay', 'Bass Decay', 'Treble Decay', 'Mix'];
    }
    if (n.includes('rmx16')) {
      return ['Program', 'Decay Time', 'Pre-delay', 'Filter', 'Mix'];
    }
    if (n.includes('emt 140')) {
      return ['Plate Select (A/B/C)', 'Reverb Time', 'Pre-delay', 'EQ Low', 'EQ High', 'Mix'];
    }
    if (n.includes('emt 250')) {
      return ['Reverb Time', 'Delay', 'Bass', 'Treble', 'Mix'];
    }
    if (n.includes('polymax')) {
      return ['Oscillator 1/2', 'Filter Cutoff', 'Resonance', 'Envelope Amount', 'LFO Rate', 'LFO Amount', 'Effects (Chorus/Flanger/Phaser)', 'Delay', 'Reverb'];
    }
    if (n.includes('opal')) {
      return ['Wavetable Select', 'Filter Cutoff', 'Resonance', 'Modulation Matrix', 'Envelope 1/2/3', 'LFO 1/2/3', 'Effects', 'Arpeggiator'];
    }
    if (n.includes('ravel')) {
      return ['Microphone Mix', 'Tone', 'Dynamics', 'Reverse', 'Reverb', 'Sustain Pedal'];
    }
    if (n.includes('waterfall b3')) {
      return ['Drawbars', 'Leslie Speed (Fast/Slow/Stop)', 'Percussion', 'Vibrato/Chorus', 'Drive', 'Reverb'];
    }
    if (n.includes('waterfall rotary')) {
      return ['Speed', 'Drive', 'Distance', 'Balance', 'Mic Placement'];
    }
    if (n.includes('minimoog')) {
      return ['Oscillator 1/2/3', 'Filter Cutoff', 'Resonance', 'Envelope Amount', 'Attack', 'Decay', 'Sustain', 'Glide'];
    }
    if (n.includes('akg bx 20')) {
      return ['Decay', 'Volume', 'Pan', 'Low Cut', 'High Cut', 'Mix'];
    }
    if (n.includes('dfc channel strip')) {
      return ['Input Gain', 'Gate Threshold', 'Compressor Threshold', 'Ratio', 'Attack', 'Release', 'EQ High', 'EQ Mid', 'EQ Low', 'Output'];
    }
    if (n.includes('bermuda triangle')) {
      return ['Fuzz', 'Tone', 'Volume'];
    }
    if (n.includes('cambridge')) {
      return ['Low Cut', 'High Cut', 'EQ Band 1-5 (Freq/Gain/Q)', 'Type (A/B/C)'];
    }
    if (n.includes('cooper time cube')) {
      return ['Delay A', 'Delay B', 'Decay A', 'Decay B', 'Mix', 'Treble', 'Bass'];
    }
    if (n.includes('cs-1')) {
      return ['EQ Freq/Gain', 'Compression Threshold', 'Delay Time', 'Chorus Rate', 'Output'];
    }
    if (n.includes('c-vox')) {
      return ['Noise Reduction', 'Ambience', 'Resonance', 'Output'];
    }
    if (n.includes('dreamverb')) {
      return ['Room Shape', 'Material', 'Reflections', 'Reverb Time', 'Diffusion', 'EQ', 'Mix'];
    }
    if (n.includes('ep-34') || n.includes('echoplex')) {
      return ['Echo Rate', 'Echo Volume', 'Echo Repeats', 'Treble', 'Bass'];
    }
    if (n.includes('galaxy tape echo')) {
      return ['Mode Selector', 'Echo Rate', 'Echo Intensity', 'Echo Volume', 'Reverb Volume', 'Treble', 'Bass'];
    }
    if (n.includes('harrison 32c')) {
      return ['High Shelf', 'High Mid', 'Low Mid', 'Low Shelf', 'High Pass', 'Low Pass', 'EQ In/Out'];
    }
    if (n.includes('korg sdd-3000')) {
      return ['Delay Time', 'Regeneration', 'Modulation Waveform', 'Modulation Intensity', 'Input Level', 'Output Level', 'Filter'];
    }
    if (n.includes('mdweq5')) {
      return ['Band 1-5 (Freq/Gain/Q)', 'Filter Type', 'Output Gain'];
    }
    if (n.includes('mxr flanger-doubler')) {
      return ['Manual', 'Width', 'Speed', 'Regeneration', 'Mix', 'Mode (Flange/Double)'];
    }
    if (n.includes('neve 1084')) {
      return ['Input Gain', 'High Shelf', 'Mid Band', 'Low Shelf', 'High Pass', 'Low Pass', 'Phase', 'EQ In/Out'];
    }
    if (n.includes('neve 2254')) {
      return ['Threshold', 'Ratio', 'Attack', 'Recovery', 'Gain', 'Limit Threshold', 'Limit Recovery'];
    }
    if (n.includes('neve 31102')) {
      return ['Input Gain', 'High Shelf', 'Mid Band', 'Low Shelf', 'High Pass', 'EQ In/Out'];
    }
    if (n.includes('neve 88rs')) {
      return ['Preamp Gain', 'Gate/Expander', 'Compressor/Limiter', 'High EQ', 'High-Mid EQ', 'Low-Mid EQ', 'Low EQ', 'Filters', 'Output'];
    }
    if (n.includes('inflator')) {
      return ['Effect', 'Curve', 'Input', 'Output', 'Clip 0dB'];
    }
    if (n.includes('supresser')) {
      return ['Threshold', 'Frequency', 'Width', 'Range', 'Attack', 'Release'];
    }
    if (n.includes('raw')) {
      return ['Distortion', 'Filter', 'Volume'];
    }
    if (n.includes('realverb-pro')) {
      return ['Shape', 'Material', 'Size', 'Resonance', 'Reverb Time', 'Mix'];
    }
    if (n.includes('softube vocoder')) {
      return ['Carrier Select', 'Analysis Bands', 'Freeze', 'Attack', 'Release', 'Output Gain'];
    }
    if (n.includes('sphere mic')) {
      return ['Mic Model', 'Pattern', 'Filter', 'Proximity', 'Axis', 'Output'];
    }
    if (n.includes('trident a-range')) {
      return ['High EQ', 'Mid 1 EQ', 'Mid 2 EQ', 'Low EQ', 'Filters', 'Gain'];
    }
    if (n.includes('ts overdrive')) {
      return ['Overdrive', 'Tone', 'Level'];
    }
  }

  if (v.includes('waves')) {
    if (n.includes('cla-76')) {
      return ['Input', 'Output', 'Attack', 'Release', 'Ratio', 'Comp Off'];
    }
    if (n.includes('ssl channel')) {
      return ['Threshold', 'Ratio', 'Attack', 'Release', 'Gain', 'Frequency', 'Q', 'Filter'];
    }
    if (n.includes('silk vocal')) {
      return ['Compression', 'De-esser', 'Gate', 'High Pass', 'Output'];
    }
    if (n.includes('clarity vx')) {
      return ['Clarity (Noise Reduction)', 'Analysis Mode', 'Output'];
    }
    if (n.includes('vocal bender')) {
      return ['Pitch', 'Formant', 'Mix', 'Smoothing', 'Flatten'];
    }
    if (n.includes('vitamin')) {
      return ['Direct Gain', 'Low Gain', 'L-Mid Gain', 'Mid Gain', 'H-Mid Gain', 'High Gain', 'Punch', 'Width'];
    }
    if (n.includes('brauer motion')) {
      // Panner plugin
      return ['Path', 'Speed', 'Width', 'Dynamics', 'Trigger', 'Mix'];
    }
    if (n.includes('nx')) {
      return ['Headphone Select', 'Room Ambience', 'Head Tracking', 'Output'];
    }
    if (n.includes('debreath')) {
      return ['Threshold', 'Reduction', 'Breath Gain', 'Output'];
    }
  }

  if (v.includes('native instruments')) {
    if (n.includes('kontakt')) {
      return ['Master Volume', 'Master Tune', 'Output Routing', 'Library Select'];
    }
    if (n.includes('raum')) {
      return ['Decay', 'Pre-delay', 'Size', 'Diffusion', 'Damping', 'Modulation', 'Mix'];
    }
    if (n.includes('replika')) {
      return ['Delay Time', 'Feedback', 'Mix', 'Mode (Modern/Vintage/Diffusion)', 'Filter', 'Modulation'];
    }
  }

  if (v.includes('softube')) {
    if (n.includes('drawmer s73')) {
      return ['Style Selector', 'Amount', 'Air', 'Mix', 'Gain'];
    }
    if (n.includes('saturation knob')) {
      return ['Saturation Amount', 'Saturation Type (Keep High/Neutral/Keep Low)'];
    }
    if (n.includes('tsar-1r')) {
      return ['Time', 'Color', 'Mix', 'Output'];
    }
    if (n.includes('tube delay')) {
      return ['Delay Time', 'Feedback', 'Drive', 'Treble', 'Bass', 'Mix'];
    }
  }

  if (v.includes('presonus')) {
    if (n.includes('fat channel')) {
      return ['Gate Threshold', 'Compressor Threshold', 'Ratio', 'Attack', 'Release', 'EQ High', 'EQ Mid', 'EQ Low', 'Output'];
    }
    if (n.includes('ampire')) {
      return ['Amp Select', 'Cabinet Select', 'Gain', 'Bass', 'Middle', 'Treble', 'Presence', 'Volume'];
    }
    if (n.includes('pro eq')) {
      return ['Band 1-5 (Freq/Gain/Q)', 'Low Cut', 'High Cut', 'Output Gain'];
    }
    if (n.includes('channel strip')) {
      return ['Compressor Threshold', 'Ratio', 'EQ High', 'EQ Low', 'Output'];
    }
  }

  if (v.includes('acqua')) {
    if (n.includes('grey')) {
      return ['Threshold', 'Ratio', 'Attack', 'Release', 'Make-up', 'Preamp In/Out'];
    }
    if (n.includes('pumpkin')) {
      return ['Saturator Level', 'Saturator Drive', 'Filter Cutoff', 'Resonance', 'Output'];
    }
  }

  if (v.includes('cherry audio')) {
    if (n.includes('mg-1')) {
      return ['Oscillator 1/2', 'Filter Cutoff', 'Resonance', 'Envelope Amount', 'LFO Rate'];
    }
    if (n.includes('sem')) {
      return ['Oscillator 1/2', 'Filter Cutoff', 'Resonance', 'Envelope Amount', 'Output'];
    }
  }

  if (v.includes('sonible')) {
    if (n.includes('learn')) {
      return ['Threshold', 'Ratio', 'Attack', 'Release', 'Gain', 'Spectral Balance'];
    }
  }

  if (v.includes('soundtheory')) {
    if (n.includes('gullfoss')) {
      return ['Recover', 'Tame', 'Bias', 'Brighten', 'Boost', 'Output'];
    }
  }

  if (v.includes('ujam')) {
    if (n.includes('fin-micro')) {
      return ['Amount', 'Mode Select'];
    }
    if (n.includes('virtual pianist')) {
      return ['Dynamics', 'Character', 'Reverb', 'Ambience', 'Player Mode'];
    }
  }

  if (v.includes('xln audio')) {
    if (n.includes('rc-20')) {
      return ['Noise', 'Wobble', 'Distort', 'Digital', 'Space', 'Magnetic', 'Magnitude', 'Output'];
    }
    if (n.includes('addictive keys')) {
      return ['Microphone Mix', 'Tone', 'Dynamics', 'Reverb', 'Delay', 'Chorus'];
    }
  }

  if (v.includes('pulsar')) {
    if (n.includes('w495')) {
      return ['Low Band (Freq/Gain)', 'Mid Band (Freq/Gain)', 'High Band (Freq/Gain)', 'Output Gain'];
    }
  }

  if (v.includes('tokyo dawn')) {
    if (n.includes('nova')) {
      return ['Band 1-4 (Freq/Gain/Q)', 'Threshold', 'Ratio', 'Attack', 'Release', 'High Pass', 'Low Pass'];
    }
  }

  if (v.includes('synchro arts')) {
    if (n.includes('vocalign')) {
      return ['Alignment Strength', 'Tightness', 'Match Timing', 'Match Pitch', 'Match Formant'];
    }
  }

  if (v.includes('vital')) {
    return ['Oscillator 1/2/3', 'Filter Cutoff', 'Resonance', 'LFO Rate', 'Envelope Amount', 'Effects'];
  }

  if (v.includes('novation')) {
    if (n.includes('bass station')) {
      return [
        'Osc 1 Range (16\', 8\', 4\', 2\' | CC 16)',
        'Osc 1 Coarse Pitch (-12 to +12 semitones | CC 17, center 64)',
        'Osc 1 Fine Pitch (-50 to +50 cents | CC 18, center 64)',
        'Osc 1 Waveform (Sine, Triangle, Saw, Pulse | CC 19)',
        'Osc 1 Pulse Width (0 to 127 | CC 20)',
        'Osc 2 Range (16\', 8\', 4\', 2\' | CC 24)',
        'Osc 2 Coarse Pitch (-12 to +12 semitones | CC 25, center 64)',
        'Osc 2 Fine Pitch (-50 to +50 cents | CC 26, center 64)',
        'Osc 2 Waveform (Sine, Triangle, Saw, Pulse | CC 27)',
        'Osc 2 Pulse Width (0 to 127 | CC 28)',
        'Osc 1 to 2 Sync (Off/On | CC 112)',
        'Sub Osc Range (-1 / -2 Octaves | CC 29)',
        'Sub Osc Waveform (Sine, Narrow Pulse, Square | CC 30)',
        'Mixer Osc 1 Level (0 to 127 | CC 33)',
        'Mixer Osc 2 Level (0 to 127 | CC 34)',
        'Mixer Sub Osc Level (0 to 127 | CC 35)',
        'Mixer Noise Level (0 to 127 | CC 36)',
        'Mixer Ring Mod Level (0 to 127 | CC 37)',
        'Mixer Ext/Feedback Level (0 to 127 | CC 38)',
        'Filter Cutoff (0 to 127 | CC 16, 14-bit CC 16/48)',
        'Filter Resonance (0 to 127 | CC 82, 14-bit CC 82/114)',
        'Filter Slope (12dB / 24dB per octave | CC 83)',
        'Filter Shape (Low Pass, Band Pass, High Pass | CC 84)',
        'Filter Class (Classic, Acid | CC 85)',
        'Filter Overdrive (Pre-Filter Drive: 0 to 127 | CC 86)',
        'Filter Mod Env Depth (Bi-polar -64 to +63 | CC 87, center 64)',
        'Filter LFO 1 Depth (Bi-polar -64 to +63 | CC 88, center 64)',
        'Amp Env Attack (0 to 127 | CC 90)',
        'Amp Env Decay (0 to 127 | CC 91)',
        'Amp Env Sustain (0 to 127 | CC 92)',
        'Amp Env Release (0 to 127 | CC 93)',
        'Mod Env Attack (0 to 127 | CC 102)',
        'Mod Env Decay (0 to 127 | CC 103)',
        'Mod Env Sustain (0 to 127 | CC 104)',
        'Mod Env Release (0 to 127 | CC 105)',
        'Amp Env Trigger Mode (Single, Multi, Autoglide | CC 95)',
        'Mod Env Trigger Mode (Single, Multi, Autoglide | CC 107)',
        'LFO 1 Rate (0 to 127 | CC 75)',
        'LFO 1 Waveform (Triangle, Saw, Square, S&H | CC 76)',
        'LFO 1 Delay (0 to 127 | CC 77)',
        'LFO 1 Slew (0 to 127 | CC 78)',
        'LFO 2 Rate (0 to 127 | CC 79)',
        'LFO 2 Waveform (Triangle, Saw, Square, S&H | CC 80)',
        'LFO 2 Delay (0 to 127 | CC 81)',
        'LFO 2 Slew (0 to 127 | CC 111)',
        'Effects Analog Distortion (0 to 127 | CC 89)',
        'Effects Osc Filter Mod (FM modulation: 0 to 127 | CC 115)'
      ];
    }
  }

  return [];
};
