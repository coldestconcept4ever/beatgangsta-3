/**
 * Utility for Auto-Adaptive Headroom Allocation & Safe Parameter Mapping.
 * Intercepts AI-generated plugin parameters and maps them to mathematically safe,
 * musically curated envelopes based on physical audio analysis (LUFS, True Peak, Crest Factor).
 */

import { MixCritique, DeepDivePlugin, ParameterSetting } from '../types';

interface PhysicalMetrics {
  integratedLufs: number;
  truePeak: number;
  crestFactor: number;
  duration?: number;
}

/**
 * Applies a smooth sigmoid/hyperbolic tangent scaling to limit EQ boosts to musically safe ranges.
 * G_safe = MaxBoost * tanh(G / MaxBoost)
 */
export const scaleEqGain = (rawGainDb: number, isMasterBus: boolean = false): number => {
  const maxBoost = isMasterBus ? 3.0 : 6.0; // 3dB max for master, 6dB max for individual tracks/stems
  if (rawGainDb <= 0) return rawGainDb; // Subtractive EQ cuts are safe and don't need capping
  
  // Apply hyperbolic tangent to smoothly cap the boost
  const scaled = maxBoost * Math.tanh(rawGainDb / maxBoost);
  return parseFloat(scaled.toFixed(1));
};

/**
 * Calibrates compressor thresholds relative to the actual measured average RMS/LUFS of the stem.
 * Prevents quiet stems from bypassing compression entirely or loud stems from being crushed.
 */
export const calibrateCompressorThreshold = (
  rawThresholdDb: number,
  measuredLufs: number,
  isMasterBus: boolean = false
): number => {
  // Industry default reference that LLMs usually assume for threshold values
  const standardReferenceLufs = isMasterBus ? -14.0 : -18.0;
  
  // Calculate how far below the assumed reference the raw threshold was
  const deltaFromReference = rawThresholdDb - standardReferenceLufs;
  
  // Calibrate threshold relative to the actual measured LUFS
  let calibratedThreshold = measuredLufs + deltaFromReference;
  
  // Safe boundaries
  const minThreshold = isMasterBus ? -24.0 : -35.0;
  const maxThreshold = -1.0;
  
  calibratedThreshold = Math.max(minThreshold, Math.min(maxThreshold, calibratedThreshold));
  return parseFloat(calibratedThreshold.toFixed(1));
};

/**
 * Restricts compressor ratios to safe, non-squashing, musical limits.
 */
export const scaleCompressorRatio = (rawRatioStr: string, isMasterBus: boolean = false): string => {
  const numericRatio = parseFloat(rawRatioStr.replace(/[^0-9.]/g, ''));
  if (isNaN(numericRatio)) return rawRatioStr;

  const maxRatio = isMasterBus ? 4.0 : 8.0; // Max 4:1 on Mix Bus, 8:1 on individual stems
  if (numericRatio > maxRatio) {
    return `${maxRatio}:1`;
  }
  return rawRatioStr;
};

/**
 * Parses a parameter string to extract its numeric value.
 */
const parseNumericValue = (valStr: string): { value: number; suffix: string } | null => {
  const match = valStr.match(/^([+-]?[0-9.]+)\s*(dB|db|Hz|hz|kHz|khz|%|s|ms|:1)?$/);
  if (!match) return null;
  return {
    value: parseFloat(match[1]),
    suffix: match[2] || ''
  };
};

/**
 * Transforms a single plugin's parameter settings based on target physical metrics.
 */
export const mapPluginParametersSafely = (
  plugin: DeepDivePlugin,
  metrics?: PhysicalMetrics,
  isMasterBus: boolean = false
): DeepDivePlugin => {
  if (!plugin.deepDive || plugin.deepDive.length === 0) return plugin;

  const pluginNameLower = plugin.name.toLowerCase();
  const isEq = pluginNameLower.includes('eq') || pluginNameLower.includes('equalizer') || pluginNameLower.includes('reeq') || pluginNameLower.includes('q3');
  const isLimiter = pluginNameLower.includes('limiter') || pluginNameLower.includes('limit');
  const isCompressor = (pluginNameLower.includes('comp') || pluginNameLower.includes('compressor') || pluginNameLower.includes('dynamics') || pluginNameLower.includes('limiting')) && !isLimiter;
  const isSaturatorOrExciter = pluginNameLower.includes('saturat') || 
                               pluginNameLower.includes('exciter') || 
                               pluginNameLower.includes('distortion') || 
                               pluginNameLower.includes('tape') || 
                               pluginNameLower.includes('tube') || 
                               pluginNameLower.includes('decapitator') || 
                               pluginNameLower.includes('saturn') || 
                               pluginNameLower.includes('clipper') ||
                               pluginNameLower.includes('overdrive') ||
                               pluginNameLower.includes('preamp') ||
                               pluginNameLower.includes('drive');
  const isMultiband = pluginNameLower.includes('multiband') || 
                      pluginNameLower.includes('mb') || 
                      pluginNameLower.includes('crossover') || 
                      pluginNameLower.includes('splitter') || 
                      pluginNameLower.includes('gaffel') ||
                      pluginNameLower.includes('multipressor') ||
                      pluginNameLower.includes('reaxcomp') ||
                      pluginNameLower.includes('drawmer');

  const isFetOrVca = isCompressor && (
    pluginNameLower.includes('1176') || 
    pluginNameLower.includes('1175') || 
    pluginNameLower.includes('fet') || 
    pluginNameLower.includes('vca') || 
    pluginNameLower.includes('distressor') || 
    pluginNameLower.includes('ssl') || 
    pluginNameLower.includes('dbx') || 
    pluginNameLower.includes('api') ||
    pluginNameLower.includes('mjuc') ||
    pluginNameLower.includes('presswerk')
  );

  const isOptoOrTube = isCompressor && (
    pluginNameLower.includes('la2a') || 
    pluginNameLower.includes('la-2a') || 
    pluginNameLower.includes('opto') || 
    pluginNameLower.includes('tube') || 
    pluginNameLower.includes('vari') || 
    pluginNameLower.includes('fairchild') || 
    pluginNameLower.includes('cl1b') || 
    pluginNameLower.includes('teletronix') ||
    pluginNameLower.includes('mu') ||
    pluginNameLower.includes('la3a') ||
    pluginNameLower.includes('la-3a')
  );

  let totalEqBoost = 0;
  let totalCompMakeup = 0;
  let hasTrimParameter = false;
  let hasTruePeakParam = false;
  let hasOversamplingParam = false;
  let hasSaturatorMixParam = false;
  let hasSaturatorHpfParam = false;
  let hasLinearPhaseParam = false;

  const mappedSettings = plugin.deepDive.map((setting: ParameterSetting) => {
    const paramLower = setting.parameter.toLowerCase();

    // Strict real-world mapping for IK Multimedia - Lurssen Mastering Console
    if (pluginNameLower.includes('lurssen') || pluginNameLower.includes('mastering console')) {
      if (paramLower.includes('push')) {
        let valStr = setting.value;
        const numVal = parseFloat(valStr.replace(/[^0-9.-]/g, ''));
        if (!isNaN(numVal)) {
          // Clamp value between -100% and +100%
          const clamped = Math.max(-100, Math.min(100, Math.round(numVal)));
          valStr = `${clamped >= 0 ? '+' : ''}${clamped}%`;
        } else if (!valStr.includes('%')) {
          valStr = `${valStr}%`;
        }
        setting.value = valStr;
        if (!setting.explanation || !setting.explanation.includes('simultaneously')) {
          setting.explanation = `${setting.explanation || ''} (Push master control shifts all 5 EQ band dials simultaneously from -100% to +100%)`.trim();
        }
      } else if (paramLower.includes('input drive') || (paramLower.includes('drive') && !paramLower.includes('style'))) {
        const rawDrive = parseFloat(setting.value.replace(/[^0-9.-]/g, ''));
        if (!isNaN(rawDrive)) {
          setting.value = `${rawDrive >= 0 ? '+' : ''}${rawDrive.toFixed(1)} dB`;
        } else if (!setting.value.toLowerCase().includes('db')) {
          setting.value = `${setting.value} dB`;
        }
      } else if (!paramLower.includes('style') && !paramLower.includes('preset') && !paramLower.includes('genre')) {
        const rawNum = parseFloat(setting.value.replace(/[^0-9.-]/g, ''));
        if (!isNaN(rawNum)) {
          const roundedInteger = Math.round(rawNum);
          setting.value = `${roundedInteger >= 0 ? '+' : ''}${roundedInteger} dB`;
        }
        if (!setting.explanation || !setting.explanation.includes('1 dB integer step')) {
          setting.explanation = `${setting.explanation || ''} (Stepped in 1 dB integer values on Lurssen EQ dials)`.trim();
        }
      }
    }


    // Track and enforce Linear Phase crossover mode for Multiband routing
    if (isMultiband) {
      const isPhaseModeParam = paramLower.includes('phase') || 
                               paramLower.includes('crossover mode') || 
                               paramLower.includes('filter mode') || 
                               paramLower.includes('filter type') ||
                               paramLower.includes('crossover type');
      if (isPhaseModeParam) {
        hasLinearPhaseParam = true;
        return {
          ...setting,
          value: "Linear Phase",
          explanation: "Linear Phase crossover mode auto-enforced to prevent phase shifting and comb filtering at crossover boundaries, preserving original transient punch."
        };
      }
    }

    // Track and enforce True Peak and Oversampling configuration for limiters prior to numeric evaluation
    if (isLimiter) {
      const isTruePeakParam = paramLower.includes('true peak') || paramLower.includes('tp') || paramLower === 'isp' || paramLower.includes('inter-sample');
      const isOversamplingParam = paramLower.includes('oversampling') || paramLower.includes('oversample') || paramLower === 'os' || paramLower.includes('hq mode');

      if (isTruePeakParam) {
        hasTruePeakParam = true;
        return {
          ...setting,
          value: "Enabled",
          explanation: "True Peak Limiting enabled to prevent inter-sample clipping on reconstructive analog playback systems."
        };
      }

      if (isOversamplingParam) {
        hasOversamplingParam = true;
        return {
          ...setting,
          value: "4x",
          explanation: "4x Oversampling enabled to ensure pristine, distortion-free transient reproduction."
        };
      }
    }

    const parsed = parseNumericValue(setting.value);

    if (!parsed) return setting;

    // Track existing output/trim parameters
    const isDbGain = paramLower.includes('gain') && parsed.suffix.toLowerCase() === 'db';
    if (paramLower.includes('output') || paramLower.includes('trim') || paramLower.includes('make-up') || paramLower.includes('makeup') || isDbGain) {
      hasTrimParameter = true;
    }

    // 1. EQ Gain Scaling (Sigmoid Capping)
    if (isEq && (paramLower.includes('gain') || paramLower.includes('boost') || paramLower.includes('db') || paramLower.includes('level'))) {
      if (parsed.value > 0) {
        const safeGain = scaleEqGain(parsed.value, isMasterBus);
        totalEqBoost += safeGain;
        return {
          ...setting,
          value: `${safeGain > 0 ? '+' : ''}${safeGain}${parsed.suffix ? ' ' + parsed.suffix : ' dB'}`,
          explanation: setting.explanation ? `${setting.explanation} (Auto-scaled for safe headroom)` : 'Auto-scaled for safe headroom'
        };
      }
    }

    // 2. Compressor Threshold Calibration (LUFS Aligning & Dual-Stage Calibration)
    if (isCompressor && (paramLower.includes('threshold') || paramLower.includes('thresh') || paramLower.includes('threshold (db)'))) {
      if (metrics) {
        let calibratedThresh = calibrateCompressorThreshold(parsed.value, metrics.integratedLufs, isMasterBus);
        if (isFetOrVca) {
          // Peak catcher: set threshold higher to only clip loud peak transients (leaving body alone)
          calibratedThresh = Math.min(-1.0, parseFloat((calibratedThresh + 4.0).toFixed(1)));
          return {
            ...setting,
            value: `${calibratedThresh}${parsed.suffix ? ' ' + parsed.suffix : ' dB'}`,
            explanation: `Peak-catching threshold: set to ${calibratedThresh} dB (calibrated higher relative to input of ${metrics.integratedLufs} LUFS to catch only fast transient spikes).`
          };
        } else if (isOptoOrTube) {
          // RMS leveling: set threshold deeper to gently ride the body of the track
          calibratedThresh = Math.max(isMasterBus ? -24.0 : -35.0, parseFloat((calibratedThresh - 2.0).toFixed(1)));
          return {
            ...setting,
            value: `${calibratedThresh}${parsed.suffix ? ' ' + parsed.suffix : ' dB'}`,
            explanation: `RMS Leveling threshold: set to ${calibratedThresh} dB (calibrated deeper relative to input of ${metrics.integratedLufs} LUFS to smoothly ride average volume levels).`
          };
        }
        return {
          ...setting,
          value: `${calibratedThresh}${parsed.suffix ? ' ' + parsed.suffix : ' dB'}`,
          explanation: setting.explanation ? `${setting.explanation} (Auto-calibrated to physical input of ${metrics.integratedLufs} LUFS)` : `Auto-calibrated to physical input of ${metrics.integratedLufs} LUFS`
        };
      }
    }

    // 3. Compressor Ratio Scaling (Sigmoid Capping & Type Constraints)
    if (isCompressor && paramLower.includes('ratio')) {
      if (isOptoOrTube) {
        // RMS levelers should use gentle ratios (2:1 or 3:1)
        const numericRatio = parseFloat(setting.value.replace(/[^0-9.]/g, ''));
        if (!isNaN(numericRatio) && numericRatio > 3.0) {
          return {
            ...setting,
            value: "2:1",
            explanation: "RMS Opto/Tube leveling ratio scaled to a gentle, musical 2:1 to avoid over-compressing or squashing the dynamic range."
          };
        }
      } else {
        const safeRatio = scaleCompressorRatio(setting.value, isMasterBus);
        if (safeRatio !== setting.value) {
          return {
            ...setting,
            value: safeRatio,
            explanation: setting.explanation ? `${setting.explanation} (Clamped to safe master bus range)` : 'Clamped to safe master bus range'
          };
        }
      }
    }

    // Compressor Attack Mapping (Dual-Stage Alignment)
    if (isCompressor && (paramLower === 'attack' || paramLower.includes('attack time') || paramLower === 'att' || paramLower === 'att (ms)')) {
      const currentMs = parsed.suffix.toLowerCase() === 's' ? parsed.value * 1000 : parsed.value;
      if (isFetOrVca) {
        if (currentMs > 2) {
          return {
            ...setting,
            value: `1 ms`,
            explanation: "Fast FET/VCA attack (1 ms) auto-enforced to instantly clamp wild peak transients and prevent digital clipping."
          };
        }
      } else if (isOptoOrTube) {
        if (currentMs < 10) {
          return {
            ...setting,
            value: `20 ms`,
            explanation: "Slower Opto/Tube attack (20 ms) auto-enforced to allow transient punch to pass through cleanly before leveling starts."
          };
        }
      }
    }

    // Compressor Release Mapping (Dual-Stage Alignment)
    if (isCompressor && (paramLower === 'release' || paramLower.includes('release time') || paramLower === 'rel' || paramLower === 'rel (ms)')) {
      const currentMs = parsed.suffix.toLowerCase() === 's' ? parsed.value * 1000 : parsed.value;
      if (isFetOrVca) {
        if (currentMs > 150) {
          return {
            ...setting,
            value: `80 ms`,
            explanation: "Fast FET/VCA release (80 ms) auto-enforced to quickly recover from transient reduction, preventing audible pumping."
          };
        }
      } else if (isOptoOrTube) {
        if (currentMs < 200) {
          return {
            ...setting,
            value: `400 ms`,
            explanation: "Slower Opto/Tube release (400 ms) auto-enforced for ultra-transparent, musical leveling without pump or flutter."
          };
        }
      }
    }
    
    // Track compressor makeup gain (only if explicitly in dB or has a dB suffix)
    if (isCompressor && (paramLower.includes('makeup') || paramLower.includes('make-up') || paramLower.includes('gain'))) {
        const isDbValue = parsed.suffix.toLowerCase() === 'db';
        if (parsed.value > 0 && isDbValue) {
            totalCompMakeup += parsed.value;
        }
    }

    // 4. Limiter Threshold & Ceiling Safety (Oversampling Protection & Strict Loudness Normalization)
    if (isLimiter) {
      if (paramLower.includes('ceiling') || paramLower.includes('out') || paramLower.includes('margin')) {
        // Auto-adaptive Ceiling based on physical audio analysis
        // Hot tracks (LUFS >= -10.0) or low dynamic range (Crest Factor < 6.0) require -1.0 dBFS ceiling
        // More dynamic tracks can use -0.8 dBFS or -0.5 dBFS
        let targetCeiling = -0.8;
        if (metrics) {
          if (metrics.integratedLufs >= -10.0 || metrics.crestFactor < 6.0) {
            targetCeiling = -1.0;
          }
        }
        const safeCeiling = Math.min(targetCeiling, parsed.value);
        const lufsContext = metrics ? ` (based on physical loudness of ${metrics.integratedLufs} LUFS)` : "";
        return {
          ...setting,
          value: `${safeCeiling}${parsed.suffix ? ' ' + parsed.suffix : ' dB'}`,
          explanation: `Ceiling enforced at ${safeCeiling} dBTP${lufsContext} to prevent reconstructive analog clipping.`
        };
      }

      if (paramLower.includes('threshold') || paramLower.includes('thresh') || paramLower.includes('gain') || paramLower.includes('boost') || paramLower.includes('input')) {
        if (metrics && isMasterBus) {
          const currentLufs = metrics.integratedLufs;
          // Target a balanced, dynamic, and streaming-compliant master loudness (e.g., -10.0 LUFS)
          // Spotify / Apple Music normalizes to -14 LUFS; mastering too hot is counterproductive.
          const targetLufs = -10.0;
          const requiredGainDb = targetLufs - currentLufs; // e.g., -10.0 - (-16.0) = 6.0 dB boost

          if (paramLower.includes('threshold') || paramLower.includes('thresh')) {
            // Lowering threshold on a limiter increases gain. Map threshold to target LUFS, capping boost to 8dB.
            const targetThreshold = -Math.min(8.0, Math.max(0.0, requiredGainDb));
            const safeThreshold = parseFloat(targetThreshold.toFixed(1));
            return {
              ...setting,
              value: `${safeThreshold}${parsed.suffix ? ' ' + parsed.suffix : ' dB'}`,
              explanation: `Limiter threshold calibrated to ${safeThreshold} dB to hit a dynamic, streaming-friendly -10.0 LUFS target, retaining transient impact without triggering streaming normalizer attenuation.`
            };
          }

          if (paramLower.includes('gain') || paramLower.includes('boost') || paramLower.includes('input')) {
            // Input gain boost should be capped to hit the target LUFS
            const safeGain = parseFloat(Math.min(8.0, Math.max(0.0, requiredGainDb)).toFixed(1));
            return {
              ...setting,
              value: `${safeGain > 0 ? '+' : ''}${safeGain}${parsed.suffix ? ' ' + parsed.suffix : ' dB'}`,
              explanation: `Input boost calibrated to +${safeGain} dB to hit an optimal -10.0 LUFS target master loudness, preserving dynamic punch and avoiding streaming platform volume penalties.`
            };
          }
        } else if (isMasterBus) {
          // Master bus with no metrics
          if (paramLower.includes('threshold') || paramLower.includes('thresh')) {
            const safeThreshold = Math.max(-4.0, parsed.value);
            return {
              ...setting,
              value: `${safeThreshold}${parsed.suffix ? ' ' + parsed.suffix : ' dB'}`,
              explanation: `Limiter threshold restricted to a safe ${safeThreshold} dB to prevent dynamic flatlining and preserve transient integrity.`
            };
          }
          if (paramLower.includes('gain') || paramLower.includes('boost') || paramLower.includes('input')) {
            const safeGain = Math.min(4.0, parsed.value);
            return {
              ...setting,
              value: `${safeGain > 0 ? '+' : ''}${safeGain}${parsed.suffix ? ' ' + parsed.suffix : ' dB'}`,
              explanation: `Limiter input boost capped to +${safeGain} dB to maintain transient punch and respect standard streaming headroom.`
            };
          }
        }
      }
    }

    // 5. Parallel Saturation & Excitation Topologies
    if (isSaturatorOrExciter) {
      const isMixParam = paramLower.includes('mix') || paramLower.includes('wet') || paramLower.includes('blend') || paramLower.includes('dry/wet');
      const isHpfParam = paramLower.includes('highpass') || paramLower.includes('hpf') || paramLower.includes('crossover') || paramLower.includes('low cut') || paramLower.includes('frequency (hz)') || paramLower.includes('cut-off') || paramLower.includes('cutoff') || paramLower === 'fc' || paramLower.includes('sidechain hpf');
      const isDriveParam = paramLower.includes('drive') || paramLower.includes('saturation') || paramLower.includes('input gain') || paramLower.includes('harmonics') || paramLower.includes('gain');

      if (isMixParam) {
        hasSaturatorMixParam = true;
        // Cap parallel saturation blend between 5% and 15%
        if (parsed.value > 15) {
          return {
            ...setting,
            value: "10%",
            explanation: "Parallel mix capped at 10% to add subtle analog shimmer without crushing dynamic range or muddying low-end frequencies."
          };
        }
      }

      if (isHpfParam) {
        hasSaturatorHpfParam = true;
        // Ensure cutoff is high enough (>= 5000 Hz or 5.0 kHz)
        if (parsed.suffix.toLowerCase().includes('khz') || (parsed.value < 100 && parsed.value > 0)) {
          if (parsed.value < 5.0) {
            return {
              ...setting,
              value: "5.0 kHz",
              explanation: "Crossover frequency raised to 5.0 kHz to isolate saturation purely to high-frequency transients."
            };
          }
        } else {
          if (parsed.value < 5000) {
            return {
              ...setting,
              value: "5000 Hz",
              explanation: "High-pass cutoff frequency adjusted to 5000 Hz to prevent low-frequency content from driving the saturator and causing mud."
            };
          }
        }
      }

      if (isDriveParam && parsed.value > 6 && parsed.suffix.toLowerCase().includes('db')) {
        return {
          ...setting,
          value: "3.0 dB",
          explanation: "Drive capped to a safe +3.0 dB to introduce warm harmonic excitation without hard clipping distortion."
        };
      }
    }

    return setting;
  });

  // Filter out any hallucinated DAW-wrapper parameters (e.g. Dry/Wet Mix, Highpass Sidechain / Crossover) 
  // on simple plugins like Saturation Knob or analog gear that do not have these internal controls
  const filteredSettings = mappedSettings.filter((setting: ParameterSetting) => {
    const pLower = setting.parameter.toLowerCase();
    if (pluginNameLower.includes('saturation knob')) {
      if (pLower.includes('dry/wet') || pLower.includes('mix') || pLower.includes('crossover') || pLower.includes('highpass') || pLower.includes('sidechain') || pLower.includes('hpf')) {
        return false;
      }
    }
    // Also filter out any auto-configured fake wrappers if they were somehow present
    if (pLower === 'highpass sidechain / crossover' || pLower === 'crossover phase mode') {
      if (!pluginNameLower.includes('multiband') && !pluginNameLower.includes('pro-mb') && !pluginNameLower.includes('crossover')) {
        return false;
      }
    }
    return true;
  });

  // Stage-by-Stage Gain Matching (Gain Staging)
  // If the plugin has boosted EQ significantly, we should auto-trim the output.
  let autoTrimValue = 0;
  if (isEq && totalEqBoost > 0) {
    // For every dB of EQ boost, the perceived volume might increase. We roughly trim by half the total boost.
    autoTrimValue = -parseFloat((totalEqBoost * 0.45).toFixed(1));
  } else if (isCompressor && totalCompMakeup > 6) {
    // If a compressor is adding more than 6dB of makeup, cap it/trim it to avoid gain creep
    autoTrimValue = -parseFloat(((totalCompMakeup - 6) * 0.5).toFixed(1));
  }

  if (autoTrimValue < -0.5 && hasTrimParameter) {
      // Find and adjust the existing trim/output
      for (let i = 0; i < filteredSettings.length; i++) {
          const pLower = filteredSettings[i].parameter.toLowerCase();
          const isEqGainOut = isEq && pLower.includes('gain') && pLower.includes('out');
          const isCompressorGainOut = isCompressor && (pLower.includes('gain') || pLower.includes('output') || pLower.includes('makeup')) && parseNumericValue(filteredSettings[i].value)?.suffix.toLowerCase() === 'db';
          
          if (pLower.includes('output') || pLower.includes('trim') || isEqGainOut || isCompressorGainOut) {
              const parsedTrim = parseNumericValue(filteredSettings[i].value);
              if (parsedTrim) {
                  const newTrim = parseFloat((parsedTrim.value + autoTrimValue).toFixed(1));
                  filteredSettings[i].value = `${newTrim} dB`;
                  filteredSettings[i].explanation = filteredSettings[i].explanation 
                    ? `${filteredSettings[i].explanation} (Gain matched: added ${autoTrimValue}dB)`
                    : `Auto-Gain Matching: Adjusted to prevent gain creep.`;
                  break;
              }
          }
      }
  }

  return {
    ...plugin,
    deepDive: filteredSettings
  };
};

export const applySafeParameterMappingToChain = (
  chain: DeepDivePlugin[],
  physicalMetrics?: PhysicalMetrics,
  isMasterBus: boolean = false,
  isJsfxMode: boolean = true
): DeepDivePlugin[] => {
  const mapped = chain.map((plugin) => mapPluginParametersSafely(plugin, physicalMetrics, isMasterBus));
  return processVocalChainDeesser(mapped, undefined, physicalMetrics, isJsfxMode);
};

const isVocalStem = (stemName?: string): boolean => {
  if (!stemName) return false;
  const nameLower = stemName.toLowerCase();
  return nameLower.includes('vocal') || 
         nameLower.includes('vox') || 
         nameLower.includes('lead') || 
         nameLower.includes('harmony') || 
         nameLower.includes('backing') || 
         nameLower.includes('sing') || 
         nameLower.includes('verse') || 
         nameLower.includes('hook') || 
         nameLower.includes('rap') || 
         nameLower.includes('acapella');
};

const isDeesserPlugin = (plugin: DeepDivePlugin): boolean => {
  const nameLower = plugin.name.toLowerCase();
  const purposeLower = (plugin.purpose || '').toLowerCase();
  return nameLower.includes('deesser') || 
         nameLower.includes('de-esser') || 
         nameLower.includes('pro-ds') || 
         nameLower.includes('pro ds') || 
         nameLower.includes('sybil') || 
         nameLower.includes('ds-1') ||
         purposeLower.includes('deesser') ||
         purposeLower.includes('de-esser') ||
         purposeLower.includes('sibilance');
};

const isCompressorPlugin = (plugin: DeepDivePlugin): boolean => {
  const nameLower = plugin.name.toLowerCase();
  const purposeLower = (plugin.purpose || '').toLowerCase();
  return (
    nameLower.includes('comp') || 
    nameLower.includes('compressor') || 
    nameLower.includes('dynamics') || 
    nameLower.includes('limiting') || 
    nameLower.includes('limiter') ||
    purposeLower.includes('compress') ||
    purposeLower.includes('dynamics') ||
    purposeLower.includes('limiting') ||
    purposeLower.includes('limiter')
  ) && !isDeesserPlugin(plugin);
};

export const processVocalChainDeesser = (
  chain: DeepDivePlugin[],
  targetStem?: string,
  metrics?: PhysicalMetrics,
  isJsfxMode: boolean = true
): DeepDivePlugin[] => {
  if (chain.length === 0) return chain;

  const hasDeesser = chain.some(isDeesserPlugin);
  const hasCompressor = chain.some(isCompressorPlugin);
  const isVocal = isVocalStem(targetStem);

  if (hasCompressor && (hasDeesser || isVocal)) {
    // 1. If it has de-essers, ensure they are placed before the first compressor
    if (hasDeesser) {
      const deessers = chain.filter(isDeesserPlugin);
      const nonDeessers = chain.filter(p => !isDeesserPlugin(p));
      const firstCompIndex = nonDeessers.findIndex(isCompressorPlugin);
      
      // Inject de-essers immediately before the first compressor
      return [
        ...nonDeessers.slice(0, firstCompIndex),
        ...deessers,
        ...nonDeessers.slice(firstCompIndex)
      ];
    } 
    // 2. If it is a vocal track but has NO de-esser, automatically inject a high-speed de-esser before the first compressor
    else if (isVocal) {
      const firstCompIndex = chain.findIndex(isCompressorPlugin);
      
      const defaultDeesser: DeepDivePlugin = {
        name: isJsfxMode ? "Tukan Deesser" : "De-Esser",
        purpose: "High-Frequency Sibilance Control (De-essing)",
        deepDive: [
          {
            parameter: "Frequency",
            value: "6000 Hz",
            explanation: "Center frequency targeted at 6 kHz where harsh sibilant 'S' and 'T' energy resides."
          },
          {
            parameter: "Threshold",
            value: "-22.0 dB",
            explanation: "Calibrated to attenuate harsh sibilant peaks without affecting the tonal brightness."
          },
          {
            parameter: "Reduction Range",
            value: "4.0 dB",
            explanation: "Maximum reduction capped at 4.0 dB to preserve a natural vocal performance."
          },
          {
            parameter: "Mode",
            value: "Split-Band",
            explanation: "Split-band processing ensures only high sibilant frequencies are gain-reduced, leaving lower vocal warmth untouched."
          }
        ]
      };

      if (metrics) {
        const calibratedThresh = Math.max(-30.0, Math.min(-6.0, parseFloat((metrics.integratedLufs - 8.0).toFixed(1))));
        const threshParam = defaultDeesser.deepDive.find(p => p.parameter.toLowerCase() === 'threshold');
        if (threshParam) {
          threshParam.value = `${calibratedThresh} dB`;
          threshParam.explanation = `Auto-calibrated to ${calibratedThresh} dB (8 dB above physical input of ${metrics.integratedLufs} LUFS) to precisely target sibilant peaks.`;
        }
      }

      return [
        ...chain.slice(0, firstCompIndex),
        defaultDeesser,
        ...chain.slice(firstCompIndex)
      ];
    }
  }

  return chain;
};

/**
 * Post-processes a full MixCritique's action plans to guarantee that every recommended
 * plugin chain is fully auto-adapted to the physical metrics of the uploaded track or stems.
 */
export const applySafeParameterMappingToCritique = (
  critique: MixCritique,
  physicalMetrics?: PhysicalMetrics,
  referencePhysicalMetrics?: PhysicalMetrics,
  stemsPhysicalMetrics?: Record<string, PhysicalMetrics>,
  userEmail?: string | null
): MixCritique => {
  if (!critique.actionPlan || critique.actionPlan.length === 0) return critique;

  console.log('[HEADROOM_ALLOCATION] Starting Safe Parameter Mapping post-process for critique...');

  const isJsfxMode = critique.isJsfxMode !== false;
  const isSpecialUser = Boolean(
    (userEmail && (userEmail.toLowerCase().includes('coldestconcept@gmail.com') || userEmail.toLowerCase().includes('recognizemiracles@gmail.com'))) ||
    (typeof window !== 'undefined' && (
      localStorage.getItem('beatgangsta_sync_email')?.toLowerCase().includes('coldestconcept@gmail.com') ||
      localStorage.getItem('beatgangsta_sync_email')?.toLowerCase().includes('recognizemiracles@gmail.com') ||
      localStorage.getItem('userEmail')?.toLowerCase().includes('coldestconcept@gmail.com') ||
      localStorage.getItem('userEmail')?.toLowerCase().includes('recognizemiracles@gmail.com')
    ))
  );

  const mappedActionPlan = critique.actionPlan.map((plan) => {
    if (!plan.recommendedChain || plan.recommendedChain.length === 0) return plan;

    // Filter out redundant PreSonus Mixtool spam if there are other plugins
    let cleanChain = plan.recommendedChain.filter((p: any) => {
      const pNameLower = (p.name || '').toLowerCase();
      if (pNameLower.includes('mixtool') && plan.recommendedChain.length > 2) {
        return false;
      }
      return true;
    });

    // For special VIP users, guarantee both Pro-Q 3 and Gullfoss are in the chain
    if (isSpecialUser) {
      const hasProQ3 = cleanChain.some((p: any) => {
        const nameLower = (p.name || '').toLowerCase();
        return nameLower.includes('pro-q 3') || nameLower.includes('pro-q3') || nameLower === 'pro-q 3' || nameLower === 'pro q 3';
      });
      const hasGullfoss = cleanChain.some((p: any) => (p.name || '').toLowerCase().includes('gullfoss'));

      const stemName = (plan.targetStem || plan.issue || '').toLowerCase();
      const isBassOrKick = stemName.includes('kick') || stemName.includes('808') || stemName.includes('sub') || stemName.includes('bass') || stemName.includes('low');
      const isVocal = stemName.includes('vox') || stemName.includes('vocal') || stemName.includes('lead') || stemName.includes('hook') || stemName.includes('adlib');
      const isDrum = stemName.includes('snare') || stemName.includes('clap') || stemName.includes('hat') || stemName.includes('cymbal') || stemName.includes('drum') || stemName.includes('perc');

      if (!hasProQ3) {
        const proQ3Plugin: DeepDivePlugin = {
          name: "FabFilter - Pro-Q 3",
          purpose: "Surgical resonance control, low-cut cleanup, and dynamic acoustic balancing",
          deepDive: [
            { parameter: "Low End Band", value: isBassOrKick ? "30Hz Low Cut (24dB/oct)" : isVocal ? "85Hz Low Cut (18dB/oct)" : isDrum ? "50Hz Low Cut (18dB/oct)" : "45Hz Low Cut (18dB/oct)", explanation: "High-pass filtering inaudible low-frequency rumble." },
            { parameter: "Band 1", value: isBassOrKick ? "55Hz Bell (+2.5dB, Dynamic On)" : isVocal ? "220Hz Bell (-2.5dB, Dynamic On)" : isDrum ? "450Hz Bell (-3.0dB, Dynamic On)" : "300Hz Bell (-2.0dB, Dynamic On)", explanation: "Taming problematic boxy resonance dynamically." },
            { parameter: "Band 2", value: isBassOrKick ? "350Hz Bell (-4.0dB)" : isVocal ? "3.2kHz Bell (-1.5dB, Dynamic On)" : isDrum ? "2.5kHz Bell (+2.0dB)" : "1.8kHz Bell (-1.5dB)", explanation: "Carving clean spectral separation." },
            { parameter: "Band 3", value: isVocal ? "10kHz High Shelf (+3.0dB, Dynamic On)" : isDrum ? "8kHz High Shelf (+2.0dB)" : "12kHz High Shelf (+1.5dB)", explanation: "Adding open high-end clarity and sheen." },
            { parameter: "Band 4", value: isBassOrKick ? "1.2kHz Bell (+1.5dB, Q: 1.4)" : "6.5kHz Bell (-1.0dB, Dynamic On)", explanation: "Enhancing transient bite." },
            { parameter: "Band 5", value: "Output Gain: 0.0 dB", explanation: "Balanced output stage." }
          ]
        };
        cleanChain.unshift(proQ3Plugin);
      }

      if (!hasGullfoss) {
        const gullfossPlugin: DeepDivePlugin = {
          name: "Soundtheory - Gullfoss",
          purpose: "Real-time intelligent spectral demasking and acoustic clarity",
          deepDive: [
            { parameter: "Recover", value: isVocal ? "24%" : isBassOrKick ? "14%" : isDrum ? "18%" : "20%", explanation: "Unmasking buried micro-details and harmonics." },
            { parameter: "Tame", value: isVocal ? "16%" : isBassOrKick ? "10%" : isDrum ? "12%" : "14%", explanation: "Suppressing competing resonance buildups dynamically." },
            { parameter: "Bias", value: isVocal ? "+4%" : "0%", explanation: "Bias offset for optimal presence balance." },
            { parameter: "Brightness", value: isVocal ? "+0.5 dB" : "0 dB", explanation: "Preserving natural high-frequency sheen." },
            { parameter: "Boost", value: isBassOrKick ? "+0.5 dB" : "0 dB", explanation: "Enhancing body and transient weight." }
          ]
        };
        if (cleanChain.length > 1) {
          cleanChain.splice(1, 0, gullfossPlugin);
        } else {
          cleanChain.push(gullfossPlugin);
        }
      }
    }

    // Determine which physical metrics apply to this specific plan/stem
    let targetMetrics = physicalMetrics;
    if (plan.targetStem && stemsPhysicalMetrics && stemsPhysicalMetrics[plan.targetStem]) {
      targetMetrics = stemsPhysicalMetrics[plan.targetStem];
      console.log(`[HEADROOM_ALLOCATION] Found specific physical metrics for stem "${plan.targetStem}":`, targetMetrics);
    } else {
      // Look for a close match if the stem name differs slightly
      const foundStemName = Object.keys(stemsPhysicalMetrics || {}).find(
        (name) => plan.targetStem && (name.toLowerCase().includes(plan.targetStem.toLowerCase()) || plan.targetStem.toLowerCase().includes(name.toLowerCase()))
      );
      if (foundStemName && stemsPhysicalMetrics) {
        targetMetrics = stemsPhysicalMetrics[foundStemName];
        console.log(`[HEADROOM_ALLOCATION] Matched stem "${plan.targetStem}" to metrics of "${foundStemName}":`, targetMetrics);
      }
    }

    const isMasterMode = critique.isMasterMode || false;

    const mappedChain = cleanChain.map((plugin) => {
      return mapPluginParametersSafely(plugin, targetMetrics, isMasterMode);
    });

    const finalChain = processVocalChainDeesser(mappedChain, plan.targetStem, targetMetrics, isJsfxMode);

    return {
      ...plan,
      recommendedChain: finalChain
    };
  });

  return {
    ...critique,
    actionPlan: mappedActionPlan
  };
};
