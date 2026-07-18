export interface UADPreset {
  name: string;
  description: string;
  settings: Record<string, number>; // Parameter Name -> MIDI value (0 - 127)
}

export const UAD_PRESETS: Record<string, UADPreset[]> = {
  "precision channel strip": [
    {
      name: "Transparent Vocal Prep",
      description: "Low-cut active at 80Hz, gentle low shelf boost, subtle high shelf brightness, and light 2:1 compression for a transparent vocal staging.",
      settings: {
        "Low Cut Filter State": 127, // On
        "Low Cut Frequency": 37, // ~80 Hz
        "Low Cut Slope": 127, // 18 dB/oct
        "Low EQ Type": 127, // Shelf
        "Low EQ Frequency": 45, // ~100 Hz
        "Low EQ Gain": 72, // +2 dB
        "Compressor Threshold": 85, // -15 dB
        "Compressor Ratio": 15, // ~2.0:1
        "Compressor Attack": 38, // 10 ms
        "Compressor Release": 30, // 200 ms
        "Compressor Makeup Gain": 20 // +3 dB
      }
    },
    {
      name: "Surgical Bass Cleanup",
      description: "Steep 18dB/oct low-cut to clear sub-rumble, dynamic parametric mid cuts to clean up boxiness, followed by 4:1 compression.",
      settings: {
        "Low Cut Filter State": 127, // On
        "Low Cut Frequency": 20, // ~45 Hz
        "Low Cut Slope": 127, // 18 dB/oct
        "Low Mid EQ Frequency": 30, // ~250 Hz
        "Low Mid EQ Gain": 40, // -3.5 dB
        "Mid EQ Frequency": 20, // ~500 Hz
        "Mid EQ Gain": 45, // -2.0 dB
        "Compressor Threshold": 70, // -25 dB
        "Compressor Ratio": 38, // ~4.0:1
        "Compressor Attack": 45, // 15 ms
        "Compressor Release": 40, // 350 ms
        "Compressor Makeup Gain": 35 // +5 dB
      }
    }
  ],
  "uadx la-2a silver": [
    {
      name: "Gold-Standard Vocal Leveler",
      description: "The classic smooth LA-2A vocal tracking. Sets 2-4dB of warm opto leveling with rapid recovery on transients.",
      settings: {
        "Peak Reduction": 42, // ~3-4 dB Gain Reduction
        "Gain": 45, // Output makeup balance
        "Limit/Compress Switch": 0, // Compress (~3:1 opto knee)
        "Meter Select": 127 // GR (Gain Reduction)
      }
    },
    {
      name: "Warm Acoustic Guitar Glue",
      description: "Gentle leveling to smooth out fingerpicking transients while enriching the signal with classic tube-amp harmonics.",
      settings: {
        "Peak Reduction": 28, // Subtle peak leveling
        "Gain": 38, // Output makeup balance
        "Limit/Compress Switch": 0, // Compress
        "Meter Select": 127 // GR
      }
    },
    {
      name: "In-Your-Face Aggressive Bass",
      description: "Set switch to Limit mode. Fast opto recovery clamp down on low-end performance and saturates beautifully.",
      settings: {
        "Peak Reduction": 68, // Heavy compression
        "Gain": 52, // Extra makeup drive
        "Limit/Compress Switch": 127, // Limit (~10:1 ratio)
        "Meter Select": 127 // GR
      }
    }
  ],
  "uad 1176ln rev e": [
    {
      name: "British All-Button / Dr. Pepper Drums",
      description: "Engages the famous 'All-Button / British' mode. Extreme compression curve, fast attack, and fastest release for explosive room mic energy.",
      settings: {
        "Input": 75, // Driven hard
        "Output": 35, // Compensating level
        "Attack": 54, // Position 3 (Moderately fast)
        "Release": 127, // Position 7 (Fastest: 50ms)
        "Ratio": 127 // ALL (All buttons in)
      }
    },
    {
      name: "In-Your-Face Lead Vocal (4:1)",
      description: "Surgical vocal clamping. Uses a gentle 4:1 ratio, medium attack to let vocal consonants breathe, and fast release to ride tail levels.",
      settings: {
        "Input": 45, // Balanced compression threshold
        "Output": 55, // Clean makeup
        "Attack": 36, // Position 2-3 (Let transients pass)
        "Release": 105, // Position 6 (Fast release: 80ms)
        "Ratio": 0 // 4:1
      }
    },
    {
      name: "Solid Solid-State Bass Lock",
      description: "Locks down dynamic sub-bass. Uses 8:1 ratio, fast attack to prevent any visual clipping, and medium release for steady sustain.",
      settings: {
        "Input": 60, // Strong compression
        "Output": 48, // Level match
        "Attack": 127, // Position 7 (Fastest: 20µs)
        "Release": 64, // Position 4 (Medium: 400ms)
        "Ratio": 31 // 8:1
      }
    }
  ],
  "uad pultec eqp-1a": [
    {
      name: "Legendary Pultec Low End Trick",
      description: "Boosts and cuts simultaneously at 60Hz. Tightens the kick drum/sub-bass by boosting the bass while carving a sub-bass resonant dip right above it.",
      settings: {
        "Low Frequency Select": 64, // 60 Hz
        "Low Boost": 58, // Boost 4.5
        "Low Atten": 48, // Attenuate 3.8
        "High Frequency Select": 96, // 12 kHz
        "High Boost": 24, // Subtle sparkle boost 2.0
        "High Bandwidth (Q)": 64, // Medium-broad width 5.0
        "High Atten Frequency": 64, // 10 kHz
        "High Atten": 0 // Off
      }
    },
    {
      name: "Airy Vocal Shine & Presence",
      description: "Broad, silky high frequency peak boost at 12kHz to add expensive 'expensive air' and breathiness without any harshness.",
      settings: {
        "Low Frequency Select": 32, // 30 Hz
        "Low Boost": 12, // Very subtle low warmth
        "Low Atten": 0,
        "High Frequency Select": 96, // 12 kHz
        "High Boost": 64, // High boost 5.0
        "High Bandwidth (Q)": 90, // Broad Q 7.0 for musicality
        "High Atten Frequency": 127, // 20 kHz
        "High Atten": 25 // Clean up digital glare 2.0
      }
    }
  ],
  "uad neve 1073": [
    {
      name: "Warm Saturation & High Silk",
      description: "Red mic preamp input driven hard to saturate the analog transformers, balanced by output trim. High shelf boosted for high end sparkle.",
      settings: {
        "Input Gain": 85, // Highly saturated Mic Gain (~60dB)
        "Output Level": 35, // Trimmed down to match digital headroom
        "High Shelf EQ Gain": 75, // +3 dB musical air
        "Mid Band Frequency": 64, // 3.2 kHz
        "Mid Band Gain": 12, // Bypassed/zero
        "Low Band Frequency": 64, // 110 Hz
        "Low Band Gain": 64, // Zero
        "High Pass Filter Freq": 31, // 50 Hz HPF to clear sub rumble
        "Phase Invert": 0, // Normal
        "EQ In/Out": 127 // EQ On
      }
    },
    {
      name: "In-Your-Face Acoustic Guitar",
      description: "Brings acoustic strings to the front of the mix. Slight high boost, precise low-mid cut to clear out soundhole boxiness.",
      settings: {
        "Input Gain": 30, // Standard line drive
        "Output Level": 64, // 0 dB
        "High Shelf EQ Gain": 88, // Gorgeous +4.5dB shelf presence
        "Mid Band Frequency": 0, // 360 Hz
        "Mid Band Gain": 45, // -2.5dB cut of muddy low-mids
        "Low Band Frequency": 64, // 110 Hz
        "Low Band Gain": 60, // Light -0.8dB cut
        "High Pass Filter Freq": 64, // 80 Hz HPF
        "Phase Invert": 0,
        "EQ In/Out": 127
      }
    }
  ],
  "uad api vision channel strip": [
    {
      name: "Punchy Acoustic Drum Snare",
      description: "API preamp driven for transient bite, fast old-school feedback compressor, and aggressive Proportional Q boosts in mid-range punch.",
      settings: {
        "212L Preamp Gain": 45, // Driven for signature API mid-range bite
        "225L Compressor Threshold": 45, // -5 dB
        "225L Compressor Ratio": 64, // 4.0:1
        "225L Compressor Attack": 0, // Fast (2ms)
        "225L Compressor Release": 35, // 180 ms
        "225L Compressor Type": 0, // Old feedback (musical)
        "550L EQ High Band Freq": 75, // 12.5 kHz
        "550L EQ High Band Gain": 85, // +4 dB crisp snap
        "550L EQ High-Mid Freq": 40, // 3 kHz punch
        "550L EQ High-Mid Gain": 85, // +4 dB attack bite
        "550L EQ Low-Mid Freq": 30, // 240 Hz boxiness
        "550L EQ Low-Mid Gain": 40, // -3 dB cut
        "550L EQ Low Band Freq": 45, // 100 Hz body
        "550L EQ Low Band Gain": 75 // +2 dB weight
      }
    }
  ],
  "uad ssl 4000 e": [
    {
      name: "Slammed Snare with Gate/Expander",
      description: "Aggressive SSL VCA compression followed by expansion to gate snare bleed, using steep Black EQ filters for tight snap.",
      settings: {
        "Input Trim": 64, // 0 dB
        "Compressor Threshold": 40, // Strong compression threshold
        "Compressor Ratio": 64, // 4:1 Ratio
        "Compressor Attack": 127, // Fast (1ms) for instant transient lock
        "Compressor Release": 35, // 0.3s snappy release
        "Gate/Expander Threshold": 68, // Clean gating of snare room bleed
        "Gate Range": 127, // Deep attenuation (40dB)
        "Gate Release": 30, // Snappy gate closure
        "EQ Black/Brown Switch": 0, // Black EQ (Steeper and cleaner)
        "High EQ Freq": 85, // 10 kHz shelf
        "High EQ Gain": 85, // +4.5dB high click
        "H-Mid EQ Freq": 70, // 4 kHz snap
        "H-Mid EQ Gain": 80, // +3dB aggressive snare crack
        "H-Mid EQ Q-Factor": 85, // Tight bandwidth
        "L-Mid EQ Freq": 30, // 300 Hz boxy range
        "L-Mid EQ Gain": 40, // -3.5dB carve out ring mud
        "Low EQ Freq": 64, // 100 Hz body
        "Low EQ Gain": 72 // +2dB punch
      }
    }
  ],
  "uad fairchild 670": [
    {
      name: "Stereo Master Bus Silk & Glue",
      description: "Iconic master bus setup. Slow-acting Time Constant 4 provides gentle, program-dependent leveling with lush stereo image glue.",
      settings: {
        "Input Gain": 64, // Standard 0 dB input drive
        "Threshold": 35, // Subtle gain reduction (1-1.5dB maximum)
        "Time Constant": 64, // Time Constant 4 (Slow: 0.8s attack / 5s release)
        "AGC Mode": 64, // Stereo Linked
        "Sidechain Filter": 45, // Cut 90 Hz from sidechain to prevent bass pumping
        "Output Level": 64 // 0 dB makeup
      }
    },
    {
      name: "Pumping Drum Bus Crush",
      description: "Extreme parallel drum bus smashing. Fast Time Constant 1 (0.2ms attack) pulls up low level room details and room tail sustain.",
      settings: {
        "Input Gain": 88, // Driven hot into tube stages
        "Threshold": 75, // Severe gain reduction (5-8dB)
        "Time Constant": 0, // Time Constant 1 (Fast: 0.2ms attack / 0.3s release)
        "AGC Mode": 64, // Stereo Linked
        "Sidechain Filter": 0, // Off (bass triggers full compression pump)
        "Output Level": 52 // Trim level
      }
    }
  ],
  "uad studer a800": [
    {
      name: "Thick 15 IPS Kick & Bass Bump",
      description: "Emulates 15 IPS physical tape speed to introduce the organic 'bass bump' resonance, combined with 456 tape driven hot for analog saturation.",
      settings: {
        "Input": 85, // Driven hot (+3dB) for saturation
        "Output": 42, // Trimmed to keep unity gain
        "Tape Speed": 64, // 15 IPS (rolls off highs, boosts sub body)
        "Tape Formula": 32, // 456 (classic high-headroom tape)
        "Cal Level": 64, // +6 dB reference
        "Bias": 64, // Normal
        "Sync/Repro path": 127 // Repro (full tape monitoring path)
      }
    },
    {
      name: "Ultra-Fi 30 IPS Vocal Glue",
      description: "Set at high-fidelity 30 IPS physical transport speed for completely flat response with smooth tape high-frequency compression.",
      settings: {
        "Input": 48, // Gentle input drive
        "Output": 64, // Unity gain
        "Tape Speed": 127, // 30 IPS (high-fidelity, zero bass bump)
        "Tape Formula": 96, // GP9 (modern, absolute clean)
        "Cal Level": 127, // +9 dB reference
        "Bias": 64,
        "Sync/Repro path": 127 // Repro
      }
    }
  ],
  "uad ampex atr-102": [
    {
      name: "Classic 1/2 Inch Stereo Master Finish",
      description: "The gold standard master bus gluing setup. GP9 tape width, 1/2 inch head size, and 15 IPS speed for final gloss, punch and tape width.",
      settings: {
        "Record Level": 45, // Clean, subtle input drive
        "Repro Level": 64, // Unity gain output
        "Tape Speed": 64, // 15 IPS for warm classic glue
        "Tape Formula": 127, // GP9 (modern tape formula)
        "Tape Width": 64, // 1/2 inch tape width (standard master choice)
        "Bias Mode": 64, // Normal
        "Tape Hiss Switch": 0, // Off
        "Hum Switch": 0 // Off
      }
    }
  ],
  "uad empirical labs distressor": [
    {
      name: "Warm Dist-2 Vocal Distress",
      description: "Ratio 6:1 (Opto mode style), medium slow attack to preserve consonants, and Dist 2 engaged to inject warm tube 2nd-order harmonics.",
      settings: {
        "Input": 52, // Moderate threshold drive
        "Output": 48, // Clean makeup
        "Attack": 64, // Position 5 (Medium-slow)
        "Release": 52, // Position 4 (Medium)
        "Ratio": 70, // 6:1 ratio
        "Detector Mode": 0, // Normal
        "Audio Mode": 64, // Dist 2 (Warm tube-amp harmonics)
        "Dry/Wet Mix": 127 // 100% Wet
      }
    },
    {
      name: "Slammed Parallel Nuke Drums",
      description: "Ratio set to NUKE limiting curves. Rapid attack clamps transients, and Dist 3 injects tape-style 3rd-order odd harmonics.",
      settings: {
        "Input": 85, // Driven extremely hard
        "Output": 40, // Trimmed down
        "Attack": 25, // Snappy attack position 2
        "Release": 96, // Rapid release position 7.5 for pump
        "Ratio": 127, // NUKE
        "Detector Mode": 42, // HP Filter (prevent sub-bass trigger pumping)
        "Audio Mode": 127, // Dist 3 (Tape tape odd harmonics saturation)
        "Dry/Wet Mix": 64 // 50% Dry/Wet Parallel blend for punch
      }
    }
  ],
  "uad capitol chambers": [
    {
      name: "Lush Chamber 4 Golden Vocal Echo",
      description: "Capitol's legendary custom reflective Chamber 4 with KM54 pickup tube microphone positioned far for stunning depth and density.",
      settings: {
        "Chamber Select": 0, // Chamber 4
        "Pre-delay": 40, // 45 ms pre-delay
        "Decay": 68, // 4.5 seconds lush decay
        "Speaker Select": 0, // Altec 604
        "Microphone Select": 127, // Neumann KM54 (Tube sparkle)
        "Microphone Position": 88, // Position 0.75 (Far, highly diffuse)
        "Mix": 45, // 35% Wet mix for serial insert
        "High Pass Filter Freq": 50 // 120 Hz HPF to keep low clean
      }
    }
  ],
  "uad avalon vt-737sp": [
    {
      name: "Glossy Lead Vocal Strip",
      description: "Generous preamplifier gain, smooth high-pass filter, 4:1 opto compression, and a subtle +2dB boost at 15kHz for the signature Avalon 'air' gloss.",
      settings: {
        "Preamplifier Gain": 45, // ~35dB
        "Preamp Mode": 64, // Mic
        "High Pass Filter Freq": 40, // ~80 Hz
        "Compressor Threshold": 55, // Light gain reduction
        "Compressor Ratio": 72, // 4:1
        "Compressor Attack": 64, // Medium
        "Compressor Release": 0, // Fast
        "EQ Bass Frequency": 60, // 60 Hz
        "EQ Bass Gain": 64, // 0 dB
        "EQ Low Mid Frequency": 50, // 200 Hz
        "EQ Low Mid Gain": 64, // 0 dB
        "EQ High Mid Frequency": 45, // 1.0 kHz
        "EQ High Mid Gain": 64, // 0 dB
        "EQ Treble Frequency": 40, // 15 kHz
        "EQ Treble Gain": 72, // +2.0 dB
        "Output Level": 64 // 0 dB
      }
    },
    {
      name: "Crisp Acoustic Guitar",
      description: "Clean tube preamp routing, high-pass at 100Hz to remove boominess, fast opto-compression, and a crisp high-shelf EQ sheen.",
      settings: {
        "Preamplifier Gain": 35, // ~28dB
        "Preamp Mode": 64, // Mic
        "High Pass Filter Freq": 60, // ~100 Hz
        "Compressor Threshold": 45, // Gentle control
        "Compressor Ratio": 36, // 2:1
        "Compressor Attack": 0, // Fast
        "Compressor Release": 0, // Fast
        "EQ Bass Frequency": 60, // 60 Hz
        "EQ Bass Gain": 50, // -3 dB
        "EQ Low Mid Frequency": 40, // 150 Hz
        "EQ Low Mid Gain": 64, // 0 dB
        "EQ High Mid Frequency": 68, // 1.5 kHz
        "EQ High Mid Gain": 70, // +1.5 dB
        "EQ Treble Frequency": 60, // 20 kHz
        "EQ Treble Gain": 74, // +2.5 dB
        "Output Level": 64
      }
    }
  ],
  "uad tube-tech cl 1b mk ii": [
    {
      name: "Buttery Vocal Staging (Fix-Man)",
      description: "Industry-standard vocal leveling settings using the Fix-Man timing select for automatically adapting attack/release curves.",
      settings: {
        "Gain": 55, // ~12 dB makeup
        "Threshold": 65, // ~4-6 dB compression
        "Ratio": 30, // ~3.5:1 ratio
        "Attack": 64, // Manual attack (ignored in Fix-Man but mapped)
        "Release": 64, // Manual release (ignored in Fix-Man but mapped)
        "Attack/Release Select": 127, // Fix-Man
        "Sidechain High Pass": 127 // SC HPF On (150 Hz)
      }
    },
    {
      name: "R&B Pinned Bass Hook",
      description: "Locks the low-end performance firmly in place with a steady 4:1 ratio and manual timing envelope riding.",
      settings: {
        "Gain": 60, // ~15 dB makeup
        "Threshold": 75, // Deep compression
        "Ratio": 50, // ~5:1 ratio
        "Attack": 35, // ~15 ms attack
        "Release": 55, // ~0.8 s release
        "Attack/Release Select": 0, // Manual
        "Sidechain High Pass": 64 // SC HPF On (80 Hz)
      }
    }
  ],
  "uad lexicon 480l": [
    {
      name: "Vintage Concert Hall Space",
      description: "Deep, three-dimensional, highly diffuse 1980s Lexicon vocal hall. Features 2.5s decay and a clean pre-delay gap.",
      settings: {
        "Program Select": 0, // Large Hall
        "Reverb Time": 40, // 2.5 seconds
        "Size": 50, // 36 meters
        "Pre-delay": 24, // 24 ms
        "Diffusion": 64, // High diffusion
        "Bass Time": 38, // 1.2x bass multiplier
        "Crossover Frequency": 64, // 500 Hz
        "Wet/Dry Mix": 127 // 100% Wet
      }
    },
    {
      name: "Snare Drum Rich Plate",
      description: "A highly dense, metallic, rich plate algorithm that gives drums stunning tail sizzle and punch.",
      settings: {
        "Program Select": 127, // Rich Plate
        "Reverb Time": 24, // 1.5 seconds
        "Size": 30, // 20 meters
        "Pre-delay": 10, // 10 ms
        "Diffusion": 85, // Extremely high diffusion
        "Bass Time": 25, // 0.8x bass multiplier
        "Crossover Frequency": 64, // 500 Hz
        "Wet/Dry Mix": 100 // 80% Mix
      }
    }
  ],
  "uad api 2500": [
    {
      name: "Patented Master Bus Glue",
      description: "Clean master bus compressor mapping. Leverages the Loud 'Thrust' sidechain circuit, Old feedback detection, and a slow attack.",
      settings: {
        "Threshold": 80, // +2 dBu
        "Ratio": 15, // 2:1
        "Attack": 127, // 30 ms
        "Release": 50, // 0.5 s
        "Knee Mode": 0, // Soft
        "Thrust Filter": 127, // Loud Thrust
        "Type Mode": 0, // Old Feedback
        "Makeup Gain": 20 // +2 dB
      }
    }
  ],
  "uad thermionic culture vulture": [
    {
      name: "Warm triode Master Glue",
      description: "Subtle 2nd-order tube harmonic saturation designed to add tape-like analog depth and warmth to a full stereo mix.",
      settings: {
        "Drive": 15, // Low drive (subtle harmonics)
        "Function Select": 0, // Triode
        "Bias": 64, // Standard 50%
        "Low Pass Filter": 0, // Off
        "Output Level": 115, // Volume compensated
        "Mix": 35 // 30% Parallel mix
      }
    },
    {
      name: "Pentode Vocal Edge Selector",
      description: "Injects aggressive odd-order pentode distortion to give thin vocal tracks gritty edge, punch, and mid-range saturation.",
      settings: {
        "Drive": 48, // Moderate drive
        "Function Select": 64, // Pentode
        "Bias": 50, // Squeezed bias
        "Low Pass Filter": 64, // 9 kHz cut (smooth edge)
        "Output Level": 90, // Volume compensated
        "Mix": 50 // 50% Parallel blend
      }
    }
  ],
  "uad la-6176": [
    {
      name: "Classic Tube Vocal Track",
      description: "The timeless chain: 610 tube warmth driving an 1176 FET compressor section in 4:1 ratio mode with medium recovery.",
      settings: {
        "610 Tube Preamp Gain": 64, // 0 dB step
        "610 Input Level": 55, // Driven slightly
        "610 High EQ Freq": 127, // 10 kHz
        "610 High EQ Gain": 72, // +1.5 dB
        "610 Low EQ Freq": 64, // 100 Hz
        "610 Low EQ Gain": 64, // 0 dB
        "1176 Compressor Threshold": 40, // Triggering 2-4dB reduction
        "1176 Makeup Gain": 50, // Standard output
        "1176 Attack": 35, // Position 3 (Moderately slow)
        "1176 Release": 90, // Position 5.5 (Fast recovery)
        "1176 Ratio Mode": 0 // 4:1
      }
    }
  ],
  "uad manley voxbox": [
    {
      name: "Pristine All-Tube Vocal Strip",
      description: "Class A preamplifier with 45dB tube drive, low cut at 80Hz, gentle optical leveling BEFORE the tube gain, and smooth 1kHz mid-presence.",
      settings: {
        "Preamp Input Gain": 32, // 45 dB
        "Preamp Low Cut Filter": 64, // 80 Hz
        "Compressor Threshold": 35, // Light leveling
        "Compressor Attack": 64, // Medium
        "Compressor Release": 64, // Medium
        "EQ Mid Frequency": 55, // 1.0 kHz
        "EQ Mid Gain": 72, // +2.0 dB
        "De-esser Threshold": 40, // Dynamic sibilant control
        "De-esser Frequency": 64 // 6 kHz
      }
    }
  ],
  "uad ssl 4000 g bus compressor": [
    {
      name: "Classic Console Stereo Glue",
      description: "The legendary Solid State Logic stereo master glue setup. Ratio 4:1, Attack 30ms, Auto release, and 1-3dB reduction.",
      settings: {
        "Threshold": 85, // Light compression trigger
        "Ratio": 64, // 4:1
        "Attack": 127, // 30 ms (preserve transients)
        "Release": 127, // Auto (program-dependent)
        "Makeup Gain": 25, // +2.5 dB
        "Sidechain High Pass": 50, // ~80 Hz
        "Mix / Blend": 127 // 100% Wet
      }
    }
  ],
  "uad ua 175b and 176": [
    {
      name: "Smooth Vocal Control",
      description: "Uses the 176 algorithm with a gentle 2:1 ratio, medium-slow attack, and moderately fast release for warm, seamless vocal leveling.",
      settings: {
        "Model Select": 127, // UA 176
        "Input Gain": 40, // Balanced compression trigger
        "Output Level": 55, // Clean makeup
        "Attack": 64, // ~4 (Medium)
        "Release": 35, // ~2.5 (Fast-medium)
        "Ratio (176)": 0, // 2:1
        "Sidechain Filter": 0 // Off
      }
    },
    {
      name: "Vintage Snare Bite",
      description: "Classic 175B limiting with faster attack and recovery to bring out the natural wood snap and ring of the drum head.",
      settings: {
        "Model Select": 0, // UA 175B (Fixed 12:1)
        "Input Gain": 55, // Driven hard
        "Output Level": 45, // Compensated level
        "Attack": 30, // ~2.0 (Fast-medium)
        "Release": 50, // ~3.5 (Medium)
        "Ratio (176)": 127, // 12:1 (ignored on 175B, but set)
        "Sidechain Filter": 127 // 100 Hz
      }
    }
  ],
  "uad manley variable mu limiter": [
    {
      name: "Silk Mastering Glue",
      description: "Gentle Variable Mu mastering setup. Compress mode, medium-slow attack, and medium recovery to gently weld stereo layers together.",
      settings: {
        "Input Gain": 45, // Moderate tube drive
        "Threshold": 75, // Light compression onset
        "Attack": 70, // Medium-slow
        "Recovery / Release": 32, // Med
        "Output Gain": 50, // Unity gain
        "HP Sidechain": 127, // On (100 Hz)
        "Mode Select": 0 // Compress (1.5:1)
      }
    },
    {
      name: "Thick Parallel Drum Bus",
      description: "Limit mode, fast attack and fast recovery. Drive input hard to generate aggressive, fat analog saturation on drums.",
      settings: {
        "Input Gain": 75, // Heavy tube drive
        "Threshold": 45, // Deep gain reduction
        "Attack": 15, // Fast
        "Recovery / Release": 0, // Fast
        "Output Gain": 40, // Compensated output
        "HP Sidechain": 127, // On (100 Hz)
        "Mode Select": 127 // Limit
      }
    }
  ],
  "uad dbx 160 compressor": [
    {
      name: "Slammin Snare Punch",
      description: "The definitive VCA snare setting. Pinpoint attack, 3:1 ratio, with fast hard-knee recovery to add punch and weight.",
      settings: {
        "Threshold": 64, // Riding the peaks
        "Compression Ratio": 30, // ~3:1
        "Output Gain": 64 // +3 dB makeup
      }
    },
    {
      name: "Heavy Bass Anchor",
      description: "Locks the low-end performance firmly in place with a moderate ratio and steady gain reduction.",
      settings: {
        "Threshold": 50, // Deeper gain reduction
        "Compression Ratio": 45, // ~4.5:1
        "Output Gain": 70 // +5 dB makeup
      }
    }
  ],
  "uad lexicon 224 digital reverb": [
    {
      name: "Lush Concert Vocal Hall",
      description: "Sprawling, highly modulated classic hall with long, warm decay times and balanced bass crossover parameters.",
      settings: {
        "Program Select": 0, // Concert Hall
        "Reverb Time": 40, // 3.2 s
        "Bass Decay": 64, // 1.0x
        "Crossover Frequency": 35, // 500 Hz
        "Treble Decay": 45, // 2.0 kHz
        "Pre-delay": 35, // 35 ms
        "Depth": 64, // 50%
        "Wet/Dry Mix": 127, // 100% Wet
        "System Noise": 0 // Off
      }
    },
    {
      name: "Grit Retro Plate",
      description: "80s percussion plate with system noise active, replicating the gritty converters and brilliant sparkle of the vintage hardware.",
      settings: {
        "Program Select": 64, // Percussion Plate
        "Reverb Time": 20, // 1.8 s
        "Bass Decay": 32, // 0.6x
        "Crossover Frequency": 50, // 800 Hz
        "Treble Decay": 90, // 4.5 kHz
        "Pre-delay": 15, // 15 ms
        "Depth": 50, // 40%
        "Wet/Dry Mix": 127, // 100%
        "System Noise": 127 // On (vintage grit)
      }
    }
  ],
  "uad helios type 69 preamp and eq collection": [
    {
      name: "Thick Classic Rock Bass",
      description: "Deep low boost at 60 Hz paired with aggressive preamplifier saturation to create the signature fuzzy, solid retro low end.",
      settings: {
        "Preamplifier Gain": 45, // Driven preamp
        "High EQ Shelf Gain": 64, // 0 dB
        "Mid EQ Frequency": 32, // 1.4 kHz (unused but set)
        "Mid EQ Gain": 0, // 0 dB mid
        "Low EQ Frequency / Mode": 42, // 60 Hz
        "Low EQ Gain": 60, // Peak boost active
        "High Pass Filter": 0 // Off
      }
    },
    {
      name: "Presence Vocal Bite",
      description: "Aggressive mid-frequency boost at 2.8 kHz combined with subtle high shelf brilliance to cut through dense guitar arrangements.",
      settings: {
        "Preamplifier Gain": 25, // Clean pre
        "High EQ Shelf Gain": 75, // +1.5 dB
        "Mid EQ Frequency": 64, // 2.8 kHz
        "Mid EQ Gain": 45, // Musical mid-range boost
        "Low EQ Frequency / Mode": 64, // 120 Hz (unused but set)
        "Low EQ Gain": 0, // 0 dB
        "High Pass Filter": 64 // 40 Hz filter on
      }
    }
  ],
  "uad century tube channel strip": [
    {
      name: "Warm Vocal Tracking",
      description: "Harmonic tube saturation in the preamplifier, silky air high EQ, and automatic optical leveling for pristine tracking.",
      settings: {
        "Preamp Gain": 50, // Warm zone
        "Low EQ Shelf": 64, // Flat
        "Mid EQ Sweep": 64, // Flat
        "High EQ Shelf": 72, // +2 dB air
        "Compressor Threshold": 35, // Soft, transparent leveling
        "Master Level": 64 // Unity
      }
    },
    {
      name: "Punchy DI Bass",
      description: "Thick low EQ shelf boost combined with medium opto leveling to glue direct-input electric bass tracks.",
      settings: {
        "Preamp Gain": 40, // Standard pre
        "Low EQ Shelf": 76, // +3 dB fatness
        "Mid EQ Sweep": 55, // -1.5 dB boxiness cut
        "High EQ Shelf": 64, // Flat
        "Compressor Threshold": 55, // Controlled peaks
        "Master Level": 64 // Unity
      }
    }
  ],
  "uad galaxy tape echo": [
    {
      name: "Dub Space Reverb",
      description: "Combines staggered playback heads with the mechanical spring reverb for legendary multi-dimensional echo loops.",
      settings: {
        "Mode Selector": 51, // Mode 5 (Delay + Reverb)
        "Repeat Rate": 45, // Classic dub tempo
        "Intensity": 70, // High repetition/feedback
        "Echo Volume": 55, // Rich delay level
        "Reverb Volume": 40, // Gritty spring wash
        "Tape Age": 64, // Used
        "Bass EQ": 64, // Flat
        "Treble EQ": 50 // Gentle dampening
      }
    },
    {
      name: "Organic Slapback Echo",
      description: "Fast single tape playback with Used tape age for warm, nostalgic rockabilly slapback textures.",
      settings: {
        "Mode Selector": 0, // Mode 1 (Head 1 only)
        "Repeat Rate": 15, // Short delay time
        "Intensity": 15, // Single slap back
        "Echo Volume": 64, // Strong slap level
        "Reverb Volume": 0, // Dry
        "Tape Age": 127, // Old (warm high-cut)
        "Bass EQ": 50, // Subtle low cut
        "Treble EQ": 64 // Flat
      }
    }
  ],
  "uad oxide tape recorder": [
    {
      name: "15 IPS Warm Drum Head",
      description: "Rich low-end 'head bump' at 15 IPS with GP9 formula, driven hard to naturally compress and glue high-transient drums.",
      settings: {
        "Input Gain": 72, // Driven hard (+3 dB)
        "Output Level": 52, // Compensated gain
        "Tape Speed": 0, // 15 IPS
        "Tape Formula": 0, // GP9
        "EQ Curve": 0 // NAB
      }
    },
    {
      name: "30 IPS Vocal Silk",
      description: "Ultra-flat, high-fidelity response at 30 IPS with vintage 456 tape formulation for organic high-end smoothing.",
      settings: {
        "Input Gain": 50, // Moderate input drive
        "Output Level": 50, // Unity level
        "Tape Speed": 127, // 30 IPS
        "Tape Formula": 127, // 456
        "EQ Curve": 127 // CCIR
      }
    }
  ],
  "uad pure plate reverb": [
    {
      name: "Vocal Plate Brilliance",
      description: "Rich, shimmering plate decay with 25ms pre-delay and boosted high end to deliver gorgeous vocal depth and air.",
      settings: {
        "Reverb Time": 45, // 2.2 s
        "Pre-delay": 32, // 25 ms
        "Bass EQ": 50, // -2 dB mud cut
        "Treble EQ": 78, // +3 dB high end sheen
        "Wet/Dry Mix": 127 // 100% Wet
      }
    },
    {
      name: "Short Acoustic Space",
      description: "Very tight decay and short pre-delay to add subtle ambient depth to guitars or auxiliary percussion tracks.",
      settings: {
        "Reverb Time": 15, // 1.0 s
        "Pre-delay": 10, // 5 ms
        "Bass EQ": 64, // Flat
        "Treble EQ": 55, // Warm tone
        "Wet/Dry Mix": 45 // 35% Mix
      }
    }
  ],
  "uad teletronix la-3a audio leveler": [
    {
      name: "Solid Guitars Pin",
      description: "Fast electro-optical leveling. Locks aggressive strums in place while adding incredible mid-range harmonic weight.",
      settings: {
        "Peak Reduction": 55, // Solid leveling (3-5dB GR)
        "Gain Level": 45, // Balanced makeup output
        "Compress/Limit": 0, // Compress mode
        "Sidechain Mod (HF)": 50 // 12 o'clock Flat
      }
    },
    {
      name: "Smooth Acoustic Rider",
      description: "Light, transparent dynamic control that gently rides fingerstyle guitar performances.",
      settings: {
        "Peak Reduction": 25, // Subtle opto reduction
        "Gain Level": 35, // Soft makeup output
        "Compress/Limit": 0, // Compress mode
        "Sidechain Mod (HF)": 127 // High HF sensitivity (ignore bass thuds)
      }
    }
  ],
  "uad hitsville reverb chambers": [
    {
      name: "Chamber 2 Vocal Gold",
      description: "Sprawling, beautiful attic reverb designed for lead vocals using vintage Altec playback speakers and Neumann KM86 capture mics.",
      settings: {
        "Chamber Select": 127, // Chamber 2
        "Decay": 60, // Elegant long tail
        "Pre-delay": 25, // 25 ms pre-delay
        "Speaker Select": 0, // Original
        "Microphone": 0, // KM86
        "Mic Position": 64, // Mid distance
        "Wet/Dry Mix": 127 // 100% Wet
      }
    },
    {
      name: "Chamber 1 Band Glue",
      description: "Authentic instrument chamber configuration using Chamber 1 with Neumann U67s at a far distance to glue backing horns, guitars, or keys.",
      settings: {
        "Chamber Select": 0, // Chamber 1
        "Decay": 45, // Medium decay
        "Pre-delay": 10, // Short separation
        "Speaker Select": 127, // Modern
        "Microphone": 64, // U67
        "Mic Position": 127, // Far distance
        "Wet/Dry Mix": 127 // 100% Wet
      }
    }
  ],
  "uad hitsville eq collection": [
    {
      name: "AM Radio Vocal Cut",
      description: "Pushes critical mid frequencies at 800 Hz and 2 kHz while rolling off muddy 320 Hz to make lead vocals cut through any mix.",
      settings: {
        "EQ Model": 0, // Graphic
        "50 Hz Gain": 64, // Flat (0 dB)
        "130 Hz Gain": 64, // Flat
        "320 Hz Gain": 48, // -2 dB cut
        "800 Hz Gain": 104, // +5 dB boost
        "2 kHz Gain": 112, // +6 dB boost
        "5 kHz Gain": 80, // +2 dB boost
        "12.5 kHz Gain": 72, // +1 dB boost
        "Output Gain": 72 // +1 dB makeup
      }
    },
    {
      name: "Motown Bass FAT",
      description: "Creates the massive legendary Motown bass weight by boosting 50 Hz and 130 Hz with broad, interactive passive induction.",
      settings: {
        "EQ Model": 0, // Graphic
        "50 Hz Gain": 112, // +6 dB boost
        "130 Hz Gain": 104, // +5 dB boost
        "320 Hz Gain": 80, // +2 dB boost
        "800 Hz Gain": 56, // -1 dB cut
        "2 kHz Gain": 64, // Flat
        "5 kHz Gain": 64, // Flat
        "12.5 kHz Gain": 64, // Flat
        "Output Gain": 56 // -1 dB attenuation
      }
    }
  ],
  "uad neve 1084": [
    {
      name: "Vocal Preamp Warmth",
      description: "Generates rich, vintage analog warmth by driving the preamp section, paired with high-pass filtering and subtle mid presence.",
      settings: {
        "Input Gain": 55, // Driven warm
        "High Pass Filter": 64, // 70 Hz
        "Low EQ Frequency": 32, // 60 Hz
        "Low EQ Gain": 64, // Flat
        "Mid EQ Frequency": 32, // 1.6 kHz
        "Mid EQ Gain": 80, // +2 dB mid presence
        "Mid Q Factor": 0, // Normal Q
        "High EQ Frequency": 64, // 12 kHz
        "High EQ Gain": 76, // +1.5 dB air
        "Output Fader": 64 // Unity
      }
    },
    {
      name: "Surgical Snare Crack",
      description: "Adds explosive punch and definition to snare drums using the narrow High-Q filter mode at 3.2 kHz to catch critical wood crack.",
      settings: {
        "Input Gain": 35, // Clean preamp
        "High Pass Filter": 32, // 45 Hz
        "Low EQ Frequency": 64, // 110 Hz
        "Low EQ Gain": 72, // +1 dB low body
        "Mid EQ Frequency": 48, // 3.2 kHz
        "Mid EQ Gain": 96, // +4 dB boost
        "Mid Q Factor": 127, // High Q active
        "High EQ Frequency": 0, // 10 kHz
        "High EQ Gain": 80, // +2 dB crisp air
        "Output Fader": 48 // -2 dB output attenuation
      }
    }
  ],
  "uad oxford inflator": [
    {
      name: "Stereo Bus Tube Maximizer",
      description: "Enriches the master bus stereo image by expanding dynamic peaks and applying a warm, tube-style harmonic curve without digital clipping.",
      settings: {
        "Input": 64, // +1.5 dB drive
        "Effect": 108, // 85% blend
        "Curve": 85, // +3.5 curve
        "Output": 120, // -0.2 dB ceiling
        "Clip 0dB": 127, // On
        "Band Split": 127 // On (triple-band clean processing)
      }
    },
    {
      name: "Slammed Drum Parallel",
      description: "Drives the saturation curve to the absolute limit for parallel drum buses to inject extreme weight, punch, and analog vibe.",
      settings: {
        "Input": 110, // +5.0 dB drive
        "Effect": 127, // 100% full effect
        "Curve": 105, // +4.8 harmonic curve
        "Output": 100, // -1.0 dB safety ceiling
        "Clip 0dB": 127, // On
        "Band Split": 0 // Off (full band intermodulation distortion)
      }
    }
  ],
  "uad emt 140": [
    {
      name: "Plate B Lush Vocal",
      description: "Generates a deep, warm, and highly-regarded vocal plate wash using the historic Plate B unit with 180Hz low filtering.",
      settings: {
        "Plate Select": 64, // Plate B
        "Reverb Time": 71, // 2.8 s
        "Pre-delay": 45, // 35 ms pre-delay
        "Bass Cut Filter": 50, // 180 Hz cut
        "Input Filter": 0, // Off
        "Wet/Dry Mix": 127 // 100% Wet
      }
    },
    {
      name: "Plate A Snare Decay",
      description: "Bright, exciting retro plate decay tailored for percussion, rolling off muddy low end at 270Hz to preserve snappy transients.",
      settings: {
        "Plate Select": 0, // Plate A
        "Reverb Time": 40, // 1.6 s
        "Pre-delay": 20, // 15 ms
        "Bass Cut Filter": 75, // 270 Hz cut
        "Input Filter": 0, // Off
        "Wet/Dry Mix": 101 // ~80% Mix
      }
    }
  ],
  "uad emt 250": [
    {
      name: "Modulated Choir Hall",
      description: "The classic, ultra-spacious EMT 250 reverberation setup featuring rich pitch modulation and custom high-frequency dampening.",
      settings: {
        "Mode Selector": 0, // Reverb
        "Decay (Lever 1)": 85, // 3.2 s
        "Low Decay (Lever 2)": 80, // +1.5 dB multiplier
        "High Decay (Lever 3)": 40, // -1.0 dB dampening
        "Pre-delay (Lever 4)": 70, // 45 ms pre-delay
        "Output Mix": 127 // 100% Wet
      }
    },
    {
      name: "Slap Vocal Space",
      description: "Tight, retro 1.2s reverb decay with boosted high frequencies and low pre-delay to sit closely behind speech or vocals.",
      settings: {
        "Mode Selector": 0, // Reverb
        "Decay (Lever 1)": 35, // 1.2 s
        "Low Decay (Lever 2)": 40, // -1.0 dB cut
        "High Decay (Lever 3)": 75, // +1.0 dB boost
        "Pre-delay (Lever 4)": 25, // 15 ms
        "Output Mix": 45 // 35% Wet mix
      }
    }
  ],
  "uad korg sdd-3000": [
    {
      name: "The Edge Dotted Eighths",
      description: "The definitive rhythmic digital delay configuration with moderate triangle modulation, high feedback, and low-end filtering.",
      settings: {
        "Input Level": 64, // -10 dB
        "Input Attenuator": 65, // Active preamp drive
        "Delay Time": 75, // 380 ms
        "Feedback": 45, // Substantial repeats
        "Filter High Cut": 50, // 4 kHz cut
        "Filter Low Cut": 25, // 125 Hz cut
        "Mod Waveform": 32, // Triangle
        "Mod Frequency": 12, // 1.5 Hz speed
        "Mod Intensity": 25 // 25% modulation depth
      }
    },
    {
      name: "Retro Slapback Drive",
      description: "Short slapback delay with the input level pushed hard to saturate the preamplifier, adding grit and thickness to guitar lines.",
      settings: {
        "Input Level": 0, // -20 dB (highest sensitivity)
        "Input Attenuator": 80, // Heavily driven preamp
        "Delay Time": 24, // 120 ms
        "Feedback": 15, // Single repeat
        "Filter High Cut": 0, // Off
        "Filter Low Cut": 0, // Off
        "Mod Waveform": 0, // Sine
        "Mod Frequency": 4, // 0.5 Hz
        "Mod Intensity": 10 // Soft pitch movement
      }
    }
  ],
  "uad neve 33609": [
    {
      name: "Smooth Master Glue",
      description: "The gold standard master bus configuration using a gentle 1.5:1 ratio and automatic recovery for cohesive, transparent leveling.",
      settings: {
        "Compressor Threshold": 64, // ~0 dBu
        "Compressor Ratio": 0, // 1.5:1
        "Compressor Recovery": 80, // Auto 1
        "Compressor Gain": 25, // +2 dB make up
        "Limiter Threshold": 100, // +10 dBu (inactive)
        "Limiter Attack": 127, // Slow
        "Limiter Recovery": 80 // Auto 1
      }
    },
    {
      name: "Thick Parallel Drum Smasher",
      description: "Aggressive diode-bridge squash using a heavy 4:1 ratio and quick 400ms recovery to pump room mics and fatten overheads.",
      settings: {
        "Compressor Threshold": 30, // Deep threshold
        "Compressor Ratio": 64, // 4:1 ratio
        "Compressor Recovery": 25, // 400 ms recovery
        "Compressor Gain": 75, // +6 dB makeup
        "Limiter Threshold": 50, // +6 dBu limiter ceiling
        "Limiter Attack": 0, // Fast
        "Limiter Recovery": 25 // 100 ms recovery
      }
    }
  ],
  "uad empirical labs el7 fatso": [
    {
      name: "Warm Tape Saturator",
      description: "Authentic dynamic analog tape emulation. Warmth level 3 rounds high-mid sibilance while the Tranny adds low iron harmonics.",
      settings: {
        "Input Level": 65, // Saturates input tape head
        "Output Level": 45, // Compensated level
        "Warmth": 50, // Warmth 3 active
        "Tranny": 127, // Transformer active
        "Compressor Mode": 0 // Off
      }
    },
    {
      name: "Spank Drum Bus Glue",
      description: "Uses the legendary fast, explosive 'Spank' compressor curve combined with tape saturation to slam and pump parallel drums.",
      settings: {
        "Input Level": 75, // Deep saturation drive
        "Output Level": 38, // Makeup compensation
        "Warmth": 64, // Warmth 4 active
        "Tranny": 127, // Transformer active
        "Compressor Mode": 32 // Spank curve
      }
    }
  ],
  "uad moog multimode filter": [
    {
      name: "Lush Sweeping Resonator",
      description: "Warm transistor ladder sweeping Low Pass filter driven to +8dB with substantial envelope modulation reacting to audio dynamics.",
      settings: {
        "Filter Cutoff": 50, // ~1.5 kHz
        "Resonance": 65, // Juicy, ringing resonance
        "Drive": 40, // +8 dB warmth saturation
        "Filter Mode": 0, // Low Pass
        "Envelope Amount": 85, // Strong dynamic sweeps
        "LFO Rate": 30, // 1.2 Hz
        "LFO Amount": 35 // Moderate movement
      }
    },
    {
      name: "Gritty Sub Drive Filter",
      description: "Aggressive low end warmth filter designed for synth or bass guitars, utilizing a heavy +15dB input overdrive.",
      settings: {
        "Filter Cutoff": 20, // ~400 Hz
        "Resonance": 35, // Balanced low bump
        "Drive": 75, // +15 dB overdrive saturation
        "Filter Mode": 0, // Low Pass
        "Envelope Amount": 0, // Fixed cutoff
        "LFO Rate": 0, // Off
        "LFO Amount": 0 // Off
      }
    }
  ]
};
