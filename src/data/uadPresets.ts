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
  ],
  "uad ua 610 tube preamp and eq collection": [
    {
      name: "610-A Vocal Warmth",
      description: "A rich, classic tube vocal preamp preset using the 610-A model. Adds immediate tube harmonic depth, gentle low-end bloom, and open high shelf presence.",
      settings: {
        "Model": 0, // 610-A
        "Input Level": 65, // Moderate vintage drive
        "Gain Step": 64, // 0 dB
        "Impedance": 127, // 2.0k ohms for high-end opening
        "High Shelf Freq": 127, // 10 kHz
        "High Shelf Gain": 80, // +2 dB smooth sheen
        "Low Shelf Freq": 0, // 50 Hz
        "Low Shelf Gain": 72, // +1 dB low end warm body
        "Master Level": 75 // Safe output level
      }
    },
    {
      name: "610-B Driven Bass Tube",
      description: "Pushes the modern 610-B preamp stage hard to saturate the virtual vacuum tubes, combined with a 70Hz low shelf boost to beef up electric bass guitars.",
      settings: {
        "Model": 127, // 610-B
        "Input Level": 85, // Driven tube warmth
        "Gain Step": 32, // -5 dB attenuation to prevent clipping
        "Impedance": 0, // 500 ohms to darken and round transient attack
        "High Shelf Freq": 0, // 4.5 kHz
        "High Shelf Gain": 64, // Flat (0 dB)
        "Low Shelf Freq": 0, // 70 Hz
        "Low Shelf Gain": 96, // +4 dB rich low boost
        "Master Level": 60 // Clean output control
      }
    }
  ],
  "uad tube-tech eq collection": [
    {
      name: "PE 1C Kick Drum Low Trick",
      description: "The classic Pultec simultaneous low boost and cut at 30Hz to sculpt a tight, massive, boxiness-free sub-bass punch on kick drums.",
      settings: {
        "Active Unit": 0, // PE 1C
        "Low Freq (PE 1C)": 32, // 30 Hz
        "Low Boost (PE 1C)": 85, // Heavy low end weight boost
        "Low Atten (PE 1C)": 70, // Tighten up sub and clean mud
        "High Boost Freq (PE 1C)": 64, // 10 kHz
        "High Boost Q (PE 1C)": 50, // Moderate bandwidth
        "High Boost Gain (PE 1C)": 30, // Subtle high-end definition
        "High Atten Freq (PE 1C)": 127, // 20 kHz
        "High Atten Gain (PE 1C)": 0, // No high roll-off
        "Mid Boost Freq (ME 1B)": 64, // Unused
        "Mid Boost Gain (ME 1B)": 0 // Unused
      }
    },
    {
      name: "ME 1B Vocals Mid Carve",
      description: "Clears boxy and nasal mid frequencies at 1kHz on the ME 1B unit while boosting sweet high-mids at 5kHz to add clarity and bite.",
      settings: {
        "Active Unit": 127, // ME 1B
        "Low Freq (PE 1C)": 32, // Unused
        "Low Boost (PE 1C)": 0, // Unused
        "Low Atten (PE 1C)": 0, // Unused
        "High Boost Freq (PE 1C)": 64, // Unused
        "High Boost Q (PE 1C)": 50, // Unused
        "High Boost Gain (PE 1C)": 0, // Unused
        "High Atten Freq (PE 1C)": 127, // Unused
        "High Atten Gain (PE 1C)": 0, // Unused
        "Mid Boost Freq (ME 1B)": 96, // 5 kHz boost / 1 kHz cut
        "Mid Boost Gain (ME 1B)": 65 // Dynamic presence shaping
      }
    }
  ],
  "uad ampeg svt-vr classic bass amplifier": [
    {
      name: "800Hz Rock Growl",
      description: "Classic rock bass stack tone. Shifts the midrange EQ center frequency to 800 Hz and boosts to add heavy pick attack and tube grit.",
      settings: {
        "Input Volume": 60, // Saturated preamp tube warmth
        "Bass EQ": 72, // +1 dB low body
        "Midrange EQ": 85, // +3 dB bite
        "Midrange Frequency": 64, // 800 Hz
        "Treble EQ": 64, // Flat
        "Ultra Hi": 0, // Off
        "Ultra Lo": 0 // Off
      }
    },
    {
      name: "Sub-Heavy SVT Cushion",
      description: "Engages 'Ultra Lo' coupled with a subtle high shelf roll-off to lay down a huge, thick, pillow-like low-frequency bass foundation.",
      settings: {
        "Input Volume": 40, // Clean tube setting
        "Bass EQ": 80, // +2 dB low-end boost
        "Midrange EQ": 48, // -2 dB cut to clear room
        "Midrange Frequency": 0, // 220 Hz
        "Treble EQ": 48, // -2 dB high shelf damping
        "Ultra Hi": 0, // Off
        "Ultra Lo": 127 // Ultra Lo active!
      }
    }
  ],
  "uad bx_digital v3 eq collection": [
    {
      name: "M/S Stereo Mastering Width",
      description: "Mastering configuration designed to focus the low-end sub bass in mono while spreading high presence in the stereo side panorama.",
      settings: {
        "Stereo Width": 115, // 115% wide soundstage
        "Mono Maker": 45, // Sum everything below 90 Hz to pure mono
        "Mid Channel Gain": 64, // Flat
        "Side Channel Gain": 68, // +0.5 dB side boost
        "Bass Shift": 64, // Flat
        "Presence Shift": 72 // +1.5 dB sweet air presence
      }
    },
    {
      name: "Surgical Acoustic Focus",
      description: "Cleans up muddy frequencies on acoustic guitar or keys, focusing the direct center image while giving an airy expansion to side panning.",
      settings: {
        "Stereo Width": 125, // Wide stereo image
        "Mono Maker": 30, // Mono below 50 Hz
        "Mid Channel Gain": 60, // Subtle mid containment
        "Side Channel Gain": 70, // Spread the side image
        "Bass Shift": 48, // Subtle bass roll-off
        "Presence Shift": 80 // Clear sparkle presence
      }
    }
  ],
  "uad akg bx 20 spring reverb": [
    {
      name: "Lush Stereo Ambient Spring",
      description: "Sprawling, long physical spring decay configured in true stereo. Excellent for creating dense, dreamy acoustic chambers on synths and guitars.",
      settings: {
        "Decay Time": 110, // ~4.0 s long tail
        "Pre-delay": 40, // 30 ms pre-delay
        "Bass EQ": 48, // -2 dB low-end cut to clear rumble
        "Treble EQ": 75, // +1.5 dB bright sparkle decay
        "Stereo Width": 64, // True Stereo mode
        "Wet/Dry Mix": 127 // 100% Wet
      }
    },
    {
      name: "Tight Slapback Spring Mono",
      description: "Authentic retro spring setup with minimum decay time and zero pre-delay, acting as a tight, classic physical slapback chamber.",
      settings: {
        "Decay Time": 15, // 1.5 s minimum decay
        "Pre-delay": 0, // Instant excitation
        "Bass EQ": 64, // Flat
        "Treble EQ": 56, // -1 dB high dampening
        "Stereo Width": 0, // Mono mode
        "Wet/Dry Mix": 45 // 35% Wet mix
      }
    }
  ],
  "uad manley massive passive": [
    {
      name: "Vocal Silk Shelf",
      description: "Gentle, ultra-sweet high-frequency shelf lift at 16 kHz to add pristine air and breath to lead vocals without sibilant grain.",
      settings: {
        "Low Shelf Freq": 64, // 100 Hz
        "Low Gain": 64, // 0 dB
        "Low Bandwidth": 50,
        "Low Mid Freq": 32, // 180 Hz
        "Low Mid Gain": 64, // 0 dB
        "High Mid Freq": 96, // 6.8 kHz
        "High Mid Gain": 64, // 0 dB
        "High Freq": 110, // 16 kHz
        "High Gain": 82, // +2.5 dB air lift
        "High Bandwidth": 25, // Broad Q
        "High Pass Filter": 0 // Off
      }
    },
    {
      name: "Low End Passive Weight",
      description: "Sub-bass authority boost at 47 Hz using a broad Q to beef up synth basses or subby kick drums cleanly.",
      settings: {
        "Low Shelf Freq": 25, // 47 Hz
        "Low Gain": 92, // +3.5 dB boost
        "Low Bandwidth": 20, // Broad mastering slope
        "Low Mid Freq": 64,
        "Low Mid Gain": 64,
        "High Mid Freq": 64,
        "High Mid Gain": 64,
        "High Freq": 64,
        "High Gain": 64,
        "High Bandwidth": 64,
        "High Pass Filter": 32 // 39 Hz filter active to manage ultra low mud
      }
    }
  ],
  "uad shadow hills mastering compressor": [
    {
      name: "Nickel Master Bus Glue",
      description: "Pristine master bus compression setup using the Nickel transformer for high-frequency sheen, optical leveling for gentle macro containment, and VCA compressor to glue transient peaks.",
      settings: {
        "Transformer Select": 0, // Nickel
        "Optical Threshold": 25, // Macro leveling active
        "Optical Gain": 52, // Matching makeup gain
        "VCA Threshold": 68, // Soft threshold
        "VCA Ratio": 0, // 1.2:1 ratio
        "VCA Attack": 100, // 10 ms slow attack
        "VCA Recover": 127, // Auto release
        "VCA Gain": 12, // +1.5 dB makeup fader
        "Sidechain Filter": 45 // 90 Hz cutoff active
      }
    },
    {
      name: "Iron Drum Bus Punch",
      description: "Aggressive drum bus leveling utilizing the Iron transformer for mid-range punch, bypassing the optical section to let VCA compression slam and pump room mics.",
      settings: {
        "Transformer Select": 64, // Iron
        "Optical Threshold": 0, // Optical disabled
        "Optical Gain": 50, // Unity
        "VCA Threshold": 42, // Deep threshold
        "VCA Ratio": 64, // 4:1 heavy ratio
        "VCA Attack": 30, // 1 ms fast response
        "VCA Recover": 25, // 0.1 s fast release for pump
        "VCA Gain": 45, // +5.5 dB heavy makeup
        "Sidechain Filter": 0 // Full band triggers
      }
    }
  ],
  "uad chandler curve bender": [
    {
      name: "EMI High Air Sheen",
      description: "Classic Abbey Road high shelf boost at 16 kHz using the gentle x1 mastering multiplier to open up vocals or the master bus stereo panorama.",
      settings: {
        "Gain Multiplier": 0, // x1
        "Low Frequency": 64,
        "Low Gain": 64, // 0 dB
        "Mid 1 Frequency": 64,
        "Mid 1 Gain": 64,
        "Mid 2 Frequency": 64,
        "Mid 2 Gain": 64,
        "High Frequency": 96, // 16 kHz shelf
        "High Gain": 85, // +2.5 dB air
        "High Pass Filter": 0 // Out
      }
    },
    {
      name: "Abbey Road TG Presence",
      description: "Pushes upper mid-range presence at 3.3 kHz using the active x1.5 multiplier to make electric guitars or synths cut straight through dense mixes.",
      settings: {
        "Gain Multiplier": 127, // x1.5 multiplier active
        "Low Frequency": 32, // 50 Hz
        "Low Gain": 48, // -1.5 dB shelving cut
        "Mid 1 Frequency": 64,
        "Mid 1 Gain": 64,
        "Mid 2 Frequency": 48, // 3.3 kHz
        "Mid 2 Gain": 96, // +4.5 dB presence bite
        "High Frequency": 64,
        "High Gain": 72, // +1 dB smooth gloss
        "High Pass Filter": 45 // 36 Hz filter active
      }
    }
  ],
  "uad neve 88rs": [
    {
      name: "88RS Vocal Polish Channel",
      description: "A highly cohesive lead vocal channel strip. Preamp saturation is managing levels, into gentle VCA compression and smooth high shelf sweetening.",
      settings: {
        "Input Gain": 45, // Subtle Neve saturation
        "High Cut Filter": 0, // Out
        "Low Cut Filter": 40, // 70 Hz low cut active
        "Gate Threshold": 0, // Off
        "Gate Release": 32,
        "Compressor Threshold": 52, // Subtle compression
        "Compressor Ratio": 45, // 2:1 gentle ratio
        "Compressor Release": 127, // Auto release
        "High EQ Gain": 82, // +3 dB high air shelf
        "Low EQ Gain": 56 // -1.5 dB proximity low shelf cut
      }
    },
    {
      name: "88RS Punchy Drum Gate",
      description: "Fast gate and aggressive VCA compression designed to isolate snare drum leakage and add heavy, snappy transient weight.",
      settings: {
        "Input Gain": 64, // +2 dB driven console gain
        "High Cut Filter": 0, // Out
        "Low Cut Filter": 25, // 45 Hz low cut
        "Gate Threshold": 65, // Active gate to mute bleed
        "Gate Release": 18, // Quick decay tail
        "Compressor Threshold": 32, // Heavy compression
        "Compressor Ratio": 85, // 4:1 punchy slope
        "Compressor Release": 35, // 0.1 s snappy response
        "High EQ Gain": 72, // +1.5 dB bright crack
        "Low EQ Gain": 78 // +2 dB low snare body
      }
    }
  ],
  "uad maag eq4": [
    {
      name: "World-Famous 40kHz Air",
      description: "The legendary vocal secret weapon. Adds pristine, breathable high-frequency gloss by boosting the Air Band at 40 kHz while tightening sub-mids at 160 Hz.",
      settings: {
        "Air Band Frequency": 127, // 40 kHz
        "Air Band Gain": 85, // +4 dB air lift
        "Sub Gain (10 Hz)": 64, // Flat
        "40 Hz Gain": 64, // Flat
        "160 Hz Gain": 52, // -1 dB cut to clear mud
        "650 Hz Gain": 64, // Flat
        "2.5 kHz Gain": 72, // +1 dB clarity boost
        "Output Gain": 56 // -1 dB makeup balance
      }
    },
    {
      name: "Sub-Heavy 808 Tightener",
      description: "Focuses extreme low sub frequencies at 10 Hz and 40 Hz, while rolling off mud at 650 Hz to keep sub-basses massive yet transparent.",
      settings: {
        "Air Band Frequency": 0, // Unused
        "Air Band Gain": 0, // Off
        "Sub Gain (10 Hz)": 96, // +4 dB sub pressure
        "40 Hz Gain": 85, // +2.5 dB punch
        "160 Hz Gain": 64, // Flat
        "650 Hz Gain": 45, // -2 dB mid range cut
        "2.5 kHz Gain": 64, // Flat
        "Output Gain": 60 // -0.5 dB attenuation
      }
    }
  ],
  "uad spl transient designer plus": [
    {
      name: "Explosive Snare Snapper",
      description: "Forces snare drums to slam through a dense mix by heavily boosting initial Attack while drawing down trailing ring Sustain.",
      settings: {
        "Attack": 96, // +5.5 dB snappy transient
        "Sustain": 42, // -2 dB shortened ring
        "Output Gain": 50, // -3 dB level matching fader
        "Limiter": 127, // Limiter ON to protect output bus
        "Sidechain Filter": 64 // Mid-range transient detection focus
      }
    },
    {
      name: "Extreme Room Reverb Expander",
      description: "Subtly softens harsh drum stick hits by cutting Attack, while heavily boosting Sustain to draw out organic room microphones and trailing decay.",
      settings: {
        "Attack": 35, // -3 dB transient softening
        "Sustain": 110, // +7 dB lush decay lift
        "Output Gain": 75, // +2 dB makeup gain
        "Limiter": 0, // Off
        "Sidechain Filter": 0 // Full band trigger
      }
    }
  ],
  "uad elysia karacter": [
    {
      "name": "Warm Master Tube Glaze",
      "description": "Generates subtle second-order harmonics to glue and thicken a full stereo master bus.",
      "settings": {
        "Drive": 18,
        "Color": 64,
        "Gain": 52,
        "Mix": 25,
        "Mode": 0
      }
    },
    {
      "name": "FET Shred Drum Crusher",
      "description": "Engages FET Shred mode to completely mangle and square-off acoustic drum room microphones.",
      "settings": {
        "Drive": 75,
        "Color": 85,
        "Gain": 38,
        "Mix": 100,
        "Mode": 127
      }
    }
  ],
  "uad black box hg-2": [
    {
      "name": "Master Bus Soft Valve Polish",
      "description": "A gentle tube drive optimized for a full mix, adding weight, glue, and a touch of air.",
      "settings": {
        "Pentode Gain": 25,
        "Triode Gain": 15,
        "Saturation Drive": 12,
        "Saturation Freq": 0,
        "Air Gain": 20,
        "Output Trim": 55
      }
    },
    {
      "name": "Warm Vocal Presence Shimmer",
      "description": "Drives vocal tracks with rich triode harmonics while focusing saturation only on sibilance.",
      "settings": {
        "Pentode Gain": 15,
        "Triode Gain": 45,
        "Saturation Drive": 30,
        "Saturation Freq": 127,
        "Air Gain": 35,
        "Output Trim": 48
      }
    }
  ],
  "uad elysia alpha compressor": [
    {
      "name": "Transparent Mastering Glue",
      "description": "Light 1.5:1 mastering compression utilizing a high-pass sidechain filter for invisible volume leveling.",
      "settings": {
        "Threshold": 35,
        "Ratio": 20,
        "Attack": 65,
        "Release": 50,
        "Mix": 100,
        "Warmth": 0
      }
    },
    {
      "name": "Warm Transformer Drum Squeeze",
      "description": "Applies heavy discrete bus compression and active transformer warm coloration to bring out decay.",
      "settings": {
        "Threshold": 65,
        "Ratio": 50,
        "Attack": 25,
        "Release": 35,
        "Mix": 70,
        "Warmth": 127
      }
    }
  ],
  "uad spl vitalizer mk3-t": [
    {
      "name": "Full Mix Psychoacoustic Polish",
      "description": "Polishes standard mixes by defining the low end, sweeping out mid mud, and widening the stereo soundstage.",
      "settings": {
        "Drive": 50,
        "Bass Type": 0,
        "Bass Gain": 64,
        "Mid-High Tune": 40,
        "Process": 25,
        "Stereo Expander": 30
      }
    },
    {
      "name": "Tight Punch Drum Exciter",
      "description": "Configured for tight low-end kick definition and bright high-hat crispness on acoustic drum loops.",
      "settings": {
        "Drive": 60,
        "Bass Type": 127,
        "Bass Gain": 85,
        "Mid-High Tune": 65,
        "Process": 45,
        "Stereo Expander": 0
      }
    }
  ],
  "uad maag eq4 ms": [
    {
      "name": "Silky 40kHz Master Air Lift",
      "description": "Applies a gorgeous, non-harsh high-end shelf at 40 kHz to give stereo overheads and vocals infinite depth.",
      "settings": {
        "Sub Gain (10 Hz)": 64,
        "40 Hz Gain": 64,
        "160 Hz Gain": 64,
        "650 Hz Gain": 64,
        "2.5 kHz Gain": 68,
        "Air Band Freq": 127,
        "Air Band Gain": 85
      }
    },
    {
      "name": "Acoustic Guitar Sparkle Track",
      "description": "Clears boxiness at 650Hz while introducing upper-mid transient bite at 2.5kHz and legendary 10kHz Air.",
      "settings": {
        "Sub Gain (10 Hz)": 64,
        "40 Hz Gain": 64,
        "160 Hz Gain": 60,
        "650 Hz Gain": 50,
        "2.5 kHz Gain": 74,
        "Air Band Freq": 75,
        "Air Band Gain": 78
      }
    }
  ],
  "uad a-type multiband enhancer": [
    {
      "name": "Lush Dynamic Acoustic Shine",
      "description": "Restores dynamics and breathes air into steel-string acoustic guitars by dynamic mid and high band expansion.",
      "settings": {
        "Input Drive": 64,
        "Band 1 Boost (Low)": 0,
        "Band 2 Boost (Mid-Low)": 15,
        "Band 3 Boost (Mid-High)": 45,
        "Band 4 Boost (High)": 55,
        "Output Level": 64
      }
    },
    {
      "name": "Whisper Sibilant Background Vocals",
      "description": "Adds gorgeous dynamic breathiness to backing vocal tracks to make them float around the lead.",
      "settings": {
        "Input Drive": 70,
        "Band 1 Boost (Low)": 0,
        "Band 2 Boost (Mid-Low)": 0,
        "Band 3 Boost (Mid-High)": 30,
        "Band 4 Boost (High)": 80,
        "Output Level": 60
      }
    }
  ],
  "uad antares auto-tune realtime x": [
    {
      "name": "Trap Vocals Hard Auto Pitch",
      "description": "Fastest possible retune speed with zero humanization for the definitive modern trap/hip-hop voice.",
      "settings": {
        "Retune Speed": 0,
        "Flex-Tune": 0,
        "Humanize": 0,
        "Throat Length": 64,
        "Natural Vibrato": 64
      }
    },
    {
      "name": "Transparent Gentle Pitch Correction",
      "description": "A slow, highly organic corrective speed that cleans up vocal intonation without sounding processed.",
      "settings": {
        "Retune Speed": 40,
        "Flex-Tune": 64,
        "Humanize": 75,
        "Throat Length": 64,
        "Natural Vibrato": 64
      }
    }
  ],
  "uad hemisphere mic collection": [
    {
      "name": "Lush Large Diaphragm Condenser",
      "description": "Models a vintage LD-87 condenser with a slight proximity lift for high-fidelity lead vocals.",
      "settings": {
        "Mic Model": 35,
        "Proximity": 110,
        "Low Cut Filter": 0,
        "Output Gain": 64,
        "Phase Polarity": 0
      }
    },
    {
      "name": "Warm SM7B Broadcast Profile",
      "description": "Emulates the iconic DN-7 broadcast dynamic mic. Smooth, mid-forward, and highly resistant to boominess.",
      "settings": {
        "Mic Model": 127,
        "Proximity": 85,
        "Low Cut Filter": 40,
        "Output Gain": 75,
        "Phase Polarity": 0
      }
    }
  ],
  "uad c-suite c-max": [
    {
      "name": "Ultra Transparent Mastering Ceiling",
      "description": "Limits loud peaks with absolute clinical purity. Best used to squeeze 2-3 dB of extra volume out of dynamic acoustic recordings.",
      "settings": {
        "Threshold": 25,
        "Ceiling": 110,
        "Release Time": 50,
        "Character": 15
      }
    },
    {
      "name": "Slammed Electronic Loudness",
      "description": "Pushes electronic and heavy material hard, leveraging slight digital clipping characteristics for maximum perceived volume.",
      "settings": {
        "Threshold": 65,
        "Ceiling": 120,
        "Release Time": 30,
        "Character": 110
      }
    }
  ],
  "uad c-suite c-axe": [
    {
      "name": "High Gain Noise Suppression",
      "description": "Instantly mutes background electronic hum and high-gain amp buzz during quiet segments and palm-mutes.",
      "settings": {
        "Threshold": 45,
        "Attenuation": 110,
        "Recovery Speed": 35,
        "Suppression Mode": 127
      }
    },
    {
      "name": "Organic Acoustic Suppressor",
      "description": "Gentle expander settings that sweep out acoustic finger squeal and background air conditioner room noise.",
      "settings": {
        "Threshold": 25,
        "Attenuation": 64,
        "Recovery Speed": 75,
        "Suppression Mode": 40
      }
    }
  ],
  "uad ams dmx 15-80 s": [
    {
      "name": "Vintage Micro Pitch Widening",
      "description": "Classic 80s widening effect using slight dual-pitch detuning and offset delay times.",
      "settings": {
        "Delay Time L": 20,
        "Delay Time R": 35,
        "Feedback L": 0,
        "Feedback R": 0,
        "Pitch Shift L": 66,
        "Pitch Shift R": 62
      }
    },
    {
      "name": "Evolving Dub Delay Spirals",
      "description": "Generates long pitch-shifting delay repeats that slowly ascend or descend.",
      "settings": {
        "Delay Time L": 380,
        "Delay Time R": 520,
        "Feedback L": 75,
        "Feedback R": 75,
        "Pitch Shift L": 70,
        "Pitch Shift R": 58
      }
    }
  ],
  "uad manley reference mic preamp": [
    {
      "name": "Lush Tube Vocal Staging",
      "description": "Adds gorgeous second-order harmonic richness to dry vocal lines, complete with a clean low cut.",
      "settings": {
        "Input Gain": 45,
        "Low Cut Filter": 127,
        "Pad": 0,
        "Polarity": 0
      }
    },
    {
      "name": "Driven Acoustic Guitar Body",
      "description": "Drives guitar track input slightly harder to warm up piezo pickups and thin wood bodies.",
      "settings": {
        "Input Gain": 52,
        "Low Cut Filter": 0,
        "Pad": 0,
        "Polarity": 0
      }
    }
  ],
  "uad api preamp": [
    {
      "name": "Punchy Rock Snare Drive",
      "description": "Applies heavy API 2520 transient saturation to round off harsh stick-hits and glue drum kits.",
      "settings": {
        "Input Gain": 50,
        "Pad Switch": 0,
        "High Pass Filter": 0,
        "Phase": 0
      }
    },
    {
      "name": "Sparkling Acoustic Preamp Prep",
      "description": "Utilizes the high-pass filter and moderate solid-state staging to make acoustic guitar strings ring.",
      "settings": {
        "Input Gain": 28,
        "Pad Switch": 0,
        "High Pass Filter": 127,
        "Phase": 0
      }
    }
  ],
  "uad c-suite c-vox": [
    {
      "name": "Home Studio Room Silencer",
      "description": "Mutes computer fan noise and gentle home room reflections while keeping vocals organic.",
      "settings": {
        "Reduction": 45,
        "Processing Mode": 0,
        "Low Cut Filter": 40,
        "High Cut Filter": 0
      }
    },
    {
      "name": "Broadcaster Speech Cleanup",
      "description": "Algorithmic noise reduction optimized for podcasts and spoken word recordings.",
      "settings": {
        "Reduction": 35,
        "Processing Mode": 127,
        "Low Cut Filter": 0,
        "High Cut Filter": 0
      }
    }
  ],
  "uad neve dynamics collection": [
    {
      "name": "Abbey Road Creamy Compressor",
      "description": "Applies creamy 3:1 compression and smooth makeup gain to bind dynamic vocal tracks.",
      "settings": {
        "Compressor Threshold": 35,
        "Compressor Ratio": 50,
        "Compressor Recovery": 30,
        "Limiter Threshold": 127,
        "Makeup Gain": 35
      }
    },
    {
      "name": "Stereo Bus Glue & Density",
      "description": "Classic diode-bridge group cohesive leveling. Brings punch and low-end density to drum groups.",
      "settings": {
        "Compressor Threshold": 20,
        "Compressor Ratio": 25,
        "Compressor Recovery": 127,
        "Limiter Threshold": 90,
        "Makeup Gain": 15
      }
    }
  ],
  "uad oxford supresser ds": [
    {
      "name": "Surgical Vocal De-Esser",
      "description": "Accurately targets sibilance between 5kHz and 8kHz, pulling down sharp spikes seamlessly.",
      "settings": {
        "Threshold": 35,
        "Center Frequency": 45,
        "Bandwidth": 30,
        "Reduction Amount": 85,
        "Auto Threshold": 0
      }
    },
    {
      "name": "Acoustic String Whistle Notch",
      "description": "Damped dynamic notch targeting sharp physical finger-slide squeals on acoustic strings.",
      "settings": {
        "Threshold": 45,
        "Center Frequency": 20,
        "Bandwidth": 10,
        "Reduction Amount": 110,
        "Auto Threshold": 127
      }
    }
  ],
  "uad diezel vh4": [
    {
      "name": "German High-Gain Mega Rhythm",
      "description": "The definitive modern metal rhythm tone. Saturated midrange, heavy deep resonance, and tight crunch.",
      "settings": {
        "Channel Select": 64,
        "Gain": 75,
        "Bass": 45,
        "Middle": 55,
        "Treble": 60,
        "Deep": 65,
        "Presence": 70
      }
    },
    {
      "name": "Liquid Lead Vocal Solo",
      "description": "High-gain Channel 4 setup with vocal mids boosted and presence softened to let lead solos float.",
      "settings": {
        "Channel Select": 127,
        "Gain": 80,
        "Bass": 50,
        "Middle": 80,
        "Treble": 50,
        "Deep": 40,
        "Presence": 45
      }
    }
  ],
  "uad v76 preamp": [
    {
      "name": "Lush Tube Bass Saturation",
      "description": "Drives the V76 pentode stage to add organic growl, round harmonics, and thick low-end body to bass lines.",
      "settings": {
        "Input Gain": 85,
        "High Pass Filter": 40,
        "Phase Polarity": 0,
        "Output Trim": 30
      }
    },
    {
      "name": "Silky 3D Tube Vocal",
      "description": "Stages clean, warm vocal tracks with legendary Telefunken vintage presence.",
      "settings": {
        "Input Gain": 34,
        "High Pass Filter": 0,
        "Phase Polarity": 0,
        "Output Trim": 64
      }
    }
  ],
  "uad softube vocoder": [
    {
      "name": "Vintage 16-Band Robot Voice",
      "description": "The classic 70s robotic sound using full carrier sawtooth synthesis and 16 spectral bands.",
      "settings": {
        "Vocoding Bands": 64,
        "Carrier Waveform": 0,
        "High Pass Filter": 127,
        "Consonants Level": 45,
        "Mix Ratio": 127
      }
    },
    {
      "name": "Modern Intellivocal Synth",
      "description": "Clear, intelligible vocoding leveraging 24 bands and dynamic high-frequency consonant injection.",
      "settings": {
        "Vocoding Bands": 127,
        "Carrier Waveform": 40,
        "High Pass Filter": 127,
        "Consonants Level": 85,
        "Mix Ratio": 100
      }
    }
  ],
  "uad ams neve dfc": [
    {
      "name": "Clinical Dialogue Leveler",
      "description": "Utilizes the DFC console gate and clean digital compressor to make erratic dialogue vocal tracks perfectly consistent.",
      "settings": {
        "Gate Threshold": 35,
        "Compressor Threshold": 40,
        "EQ High Gain": 64,
        "EQ Mid Gain": 64,
        "EQ Low Gain": 64,
        "Output Level": 64
      }
    },
    {
      "name": "Surgical Mid EQ Notch",
      "description": "Attenuates console midrange resonance while leaving low-end body and high-end air pristine.",
      "settings": {
        "Gate Threshold": 0,
        "Compressor Threshold": 0,
        "EQ High Gain": 64,
        "EQ Mid Gain": 45,
        "EQ Low Gain": 64,
        "Output Level": 64
      }
    }
  ],
  "uad diezel herbert": [
    {
      "name": "Modern Progressive Metal Rhythm",
      "description": "Massive high-gain scoop. Scoops mud at 400Hz while adding tight, crushing low cabinet thump.",
      "settings": {
        "Gain": 55,
        "Bass": 45,
        "Middle": 50,
        "Treble": 60,
        "Midcut Intensity": 75,
        "Midcut Level": 45,
        "Deep": 60
      }
    },
    {
      "name": "Liquid KT77 Lead Solo",
      "description": "Creamy, sustaining lead solo setup with midcut off and power-amp presence boosted.",
      "settings": {
        "Gain": 70,
        "Bass": 50,
        "Middle": 75,
        "Treble": 50,
        "Midcut Intensity": 0,
        "Midcut Level": 50,
        "Deep": 35
      }
    }
  ],
  "uad bx_masterdesk": [
    {
      "name": "Complete Master Bus Polish",
      "description": "Applies gentle tilt EQ balance, moderate parallel compression, and clean analog tape THD warmth.",
      "settings": {
        "Volume": 64,
        "Foundation": 68,
        "Bass": 64,
        "Middle": 64,
        "Compressor Mix": 30,
        "THD Saturation": 25
      }
    },
    {
      "name": "Warm Low-End Master Weight",
      "description": "Carves out harsh treble while introducing warm, rich low-end foundation weight for electronic tracks.",
      "settings": {
        "Volume": 64,
        "Foundation": 55,
        "Bass": 74,
        "Middle": 64,
        "Compressor Mix": 45,
        "THD Saturation": 50
      }
    }
  ],
  "uad suhr se100": [
    {
      "name": "Boutique British Plexi Crunch",
      "description": "Authentic retro British classic rock crunch with tight power amp feedback response.",
      "settings": {
        "Preamp Gain": 45,
        "Bass": 45,
        "Middle": 60,
        "Treble": 55,
        "Presence": 60,
        "Power Feedback": 65
      }
    },
    {
      "name": "Screaming Fluid Lead Solo",
      "description": "High-gain boutique lead with rich midrange and singing harmonic feedback sustain.",
      "settings": {
        "Preamp Gain": 75,
        "Bass": 50,
        "Middle": 70,
        "Treble": 50,
        "Presence": 50,
        "Power Feedback": 40
      }
    }
  ],
  "uad suhr pt100": [
    {
      "name": "Pete Signature Crunch Drive",
      "description": "Classic PT100 Pete Thorn Channel 2 crunch setting with high midrange punch and bite.",
      "settings": {
        "Channel": 40,
        "Input Gain": 50,
        "Bass": 45,
        "Middle": 65,
        "Treble": 55,
        "Boost": 0
      }
    },
    {
      "name": "Screaming Boosted Lead Solo",
      "description": "Channel 3 high-gain lead mode with active preamp boost circuit engaged for endless sustain.",
      "settings": {
        "Channel": 127,
        "Input Gain": 70,
        "Bass": 50,
        "Middle": 60,
        "Treble": 50,
        "Boost": 127
      }
    }
  ],
  "uad putnam microphone collection": [
    {
      "name": "Pristine Vintage 251 Condenser",
      "description": "Emulates Putnam's prized LD-251 condenser microphone. Open, silky, and highly premium top end.",
      "settings": {
        "Mic Model": 42,
        "Proximity": 100,
        "Low Cut Filter": 0,
        "Output Level": 64
      }
    },
    {
      "name": "Warm Putnam RCA Ribbon",
      "description": "Models a vintage RB-77DX ribbon microphone. Creamy, warm midrange with smooth high-end roll-off.",
      "settings": {
        "Mic Model": 85,
        "Proximity": 85,
        "Low Cut Filter": 127,
        "Output Level": 75
      }
    }
  ],
  "uad neve preamp": [
    {
      "name": "Warm Class-A Vocal Prep",
      "description": "Smooth Neve preamp saturation to thicken lead vocals, with low rumble filtered at 80 Hz.",
      "settings": {
        "Input Gain": 35,
        "Pad": 0,
        "Low Cut Filter": 127,
        "Output Trim": 64
      }
    },
    {
      "name": "Driven Snare Transformer Sat",
      "description": "Drives input transformer hard to saturate snare hits, adding classic British weight.",
      "settings": {
        "Input Gain": 55,
        "Pad": 127,
        "Low Cut Filter": 0,
        "Output Trim": 50
      }
    }
  ],
  "uad ada flanger": [
    {
      "name": "Classic Jet Engine Sweep",
      "description": "The classic heavy jet-flanger sweep with deep even-harmonic regeneration and slow sweep speed.",
      "settings": {
        "Range": 85,
        "Speed": 20,
        "Threshold": 0,
        "Harmonic Mode": 0,
        "Blend Ratio": 64
      }
    },
    {
      "name": "Leslie Rotary Chorus Ensemble",
      "description": "Lush, rapid rotary speaker simulation using fast speed and low blend settings.",
      "settings": {
        "Range": 45,
        "Speed": 80,
        "Threshold": 0,
        "Harmonic Mode": 0,
        "Blend Ratio": 38
      }
    }
  ],
  "uad roland re-201": [
    {
      "name": "Lush Spring Dub Echoes",
      "description": "Dreamy Roland RE-201 Mode 5 combining delay Playheads 1 & 2 with warm spring reverb.",
      "settings": {
        "Mode Selector": 40,
        "Repeat Rate": 50,
        "Intensity": 45,
        "Echo Volume": 55,
        "Reverb Volume": 35,
        "Wow & Flutter": 30
      }
    },
    {
      "name": "Infinite Tape Self-Oscillation",
      "description": "Pushes RE-201 feedback into heavy analog loop self-oscillation for sci-fi pitch-bends.",
      "settings": {
        "Mode Selector": 10,
        "Repeat Rate": 35,
        "Intensity": 85,
        "Echo Volume": 75,
        "Reverb Volume": 0,
        "Wow & Flutter": 45
      }
    }
  ],
  "uad roland dimension d": [
    {
      "name": "Studio Standard Button 4 Width",
      "description": "The legendary Roland SDD-320 Button 4 chorus. Silky, premium, invisible stereo vocal expander.",
      "settings": {
        "Dimension Mode": 96,
        "Input Level": 64,
        "Spatial Width": 127
      }
    },
    {
      "name": "Extreme Dimension All Active",
      "description": "All four buttons active simultaneously for maximum BBD chorus width and depth.",
      "settings": {
        "Dimension Mode": 127,
        "Input Level": 64,
        "Spatial Width": 127
      }
    }
  ],
  "uad roland ce-1": [
    {
      "name": "Lush Liquid Analog Chorus",
      "description": "Thick, glassy 1976 bucket-brigade chorus sweep that retro guitars and keys require.",
      "settings": {
        "Mode Select": 0,
        "Chorus Intensity": 45,
        "Vibrato Depth": 0,
        "Vibrato Rate": 40,
        "Input Level": 64
      }
    },
    {
      "name": "Vintage Leslie Pitch Wobble",
      "description": "CE-1 pitch vibrato mode simulating warm acoustic Leslie speaker rotations.",
      "settings": {
        "Mode Select": 127,
        "Chorus Intensity": 0,
        "Vibrato Depth": 35,
        "Vibrato Rate": 65,
        "Input Level": 75
      }
    }
  ],
  "uad shadow hills class a": [
    {
      "name": "Smooth Mastering Class-A Glue",
      "description": "Gentle dual-stage optical leveling and low-ratio VCA compression with Steel transformer weight.",
      "settings": {
        "Optical Threshold": 20,
        "Optical Gain": 25,
        "VCA Threshold": 15,
        "VCA Ratio": 0,
        "Output Transformer": 127
      }
    },
    {
      "name": "Punchy Iron Vocal Leveler",
      "description": "Drives mid-range vocal lines with Iron transformer grit and active optical level tracking.",
      "settings": {
        "Optical Threshold": 45,
        "Optical Gain": 40,
        "VCA Threshold": 0,
        "VCA Ratio": 0,
        "Output Transformer": 64
      }
    }
  ],
  "uad auto-tune realtime access": [
    {
      "name": "Fast Correct Scale Snap",
      "description": "Rapid pitch correction snapping to the musical scale with zero humanization.",
      "settings": {
        "Retune Speed": 0,
        "Humanize": 0,
        "Scale Key": 0
      }
    },
    {
      "name": "Natural Slow Performance Correct",
      "description": "Soft correction speed with active humanization to protect singer vibrato.",
      "settings": {
        "Retune Speed": 127,
        "Humanize": 127,
        "Scale Key": 0
      }
    }
  ],
  "uad auto-tune realtime advanced": [
    {
      "name": "Lush Pop Hard Auto Pitch",
      "description": "Fast pop retune speed with subtle Flex-Tune to allow slight expressive slide-overs.",
      "settings": {
        "Retune Speed": 8,
        "Flex-Tune": 25,
        "Humanize": 0,
        "Tracking Sensitivity": 50
      }
    },
    {
      "name": "Invisible Organic Tuning Guard",
      "description": "Slow corrective tuning targeting bad notes while leaving natural singer slide performance perfectly intact.",
      "settings": {
        "Retune Speed": 45,
        "Flex-Tune": 65,
        "Humanize": 75,
        "Tracking Sensitivity": 60
      }
    }
  ],
  "uad bx_masterdesk classic": [
    {
      "name": "Instant Master Bus Punch",
      "description": "Squeezes master volume into limiting sweet-spot with neutral spectral tilt EQ balance.",
      "settings": {
        "Volume": 64,
        "Foundation": 64,
        "Output Trim": 110
      }
    },
    {
      "name": "Bright Master Air Polish",
      "description": "Balances dark mixes by shifting energy into clear high-end air using classic tilt EQ.",
      "settings": {
        "Volume": 64,
        "Foundation": 75,
        "Output Trim": 110
      }
    }
  ],
  "uad chandler gav19t": [
    {
      "name": "Slick British Blues Crunch",
      "description": "Smooth, touch-sensitive Selmer/British style crunch using Slick power tube bias.",
      "settings": {
        "Drive Gain": 45,
        "Bias Mode": 64,
        "Tone voicing": 0,
        "Bass EQ": 50,
        "Treble EQ": 55
      }
    },
    {
      "name": "Raw Intense Rhythm Saturated",
      "description": "Starved-tube Raw bias mode with Intense EQ voicing for thick fuzzy hard rock riffs.",
      "settings": {
        "Drive Gain": 75,
        "Bias Mode": 127,
        "Tone voicing": 127,
        "Bass EQ": 45,
        "Treble EQ": 65
      }
    }
  ],
  "uad fuchs overdrive supreme": [
    {
      "name": "Boutique Liquid Fusion Overdrive",
      "description": "Legendary D-style vocal midrange sustain and compression for singing guitar solos.",
      "settings": {
        "Clean Gain": 35,
        "Overdrive Gain": 75,
        "Overdrive Level": 50,
        "Bright Switch": 0,
        "Deep Switch": 127,
        "Spring Reverb": 25
      }
    },
    {
      "name": "Glassy Funk Clean Shimmer",
      "description": "Glassy, sparkling clean rhythm tone with bright high-end shelf and warm spring reverb.",
      "settings": {
        "Clean Gain": 45,
        "Overdrive Gain": 0,
        "Overdrive Level": 0,
        "Bright Switch": 127,
        "Deep Switch": 0,
        "Spring Reverb": 35
      }
    }
  ],
  "uad marshall plexi classic": [
    {
      "name": "Classic High Treble Rock Crunch",
      "description": "The historic 1959 Plexi sound. Biting, saturated mid frequencies with heavy speaker cabinet punch.",
      "settings": {
        "Volume I (High Treble)": 75,
        "Volume II (Normal)": 35,
        "Bass": 45,
        "Middle": 65,
        "Treble": 55,
        "Presence": 65
      }
    },
    {
      "name": "Woody EL34 Power Tube Drive",
      "description": "Warm, soft woody compression from saturating EL34 power-amp valves with lower preamp input.",
      "settings": {
        "Volume I (High Treble)": 45,
        "Volume II (Normal)": 45,
        "Bass": 55,
        "Middle": 50,
        "Treble": 45,
        "Presence": 40
      }
    }
  ],
  "uad ampeg svt-3 pro": [
    {
      "name": "Abbey Road Vintage Ampeg Growl",
      "description": "Drives pre-amp tube stage with lower voltage to introduce signature Ampeg bass growl and compression.",
      "settings": {
        "Input Gain": 55,
        "Bass EQ": 64,
        "Mid EQ Gain": 70,
        "Treble EQ": 60,
        "Tube Voltage": 30,
        "Ultra Lo": 0
      }
    },
    {
      "name": "Ultra Low Sub Bass weight",
      "description": "Engages active Ampeg Ultra Lo boost to create deep, heavy sub-bass foundation.",
      "settings": {
        "Input Gain": 40,
        "Bass EQ": 75,
        "Mid EQ Gain": 50,
        "Treble EQ": 55,
        "Tube Voltage": 100,
        "Ultra Lo": 127
      }
    }
  ],
  "uad gallien-krueger 800rb": [
    {
      "name": "G-K Punk Bass Growl",
      "description": "Cranked solid-state boost circuit for biting, punchy growl that cuts through busy drums.",
      "settings": {
        "Input Volume": 50,
        "Low EQ": 64,
        "Mid-Low EQ": 70,
        "Mid-High EQ": 75,
        "High EQ": 60,
        "GK Boost": 85
      }
    },
    {
      "name": "Slap Active Snap Contour",
      "description": "Heavy low active boosting and high string-snap detail for active slap bass tracking.",
      "settings": {
        "Input Volume": 40,
        "Low EQ": 80,
        "Mid-Low EQ": 50,
        "Mid-High EQ": 55,
        "High EQ": 85,
        "GK Boost": 25
      }
    }
  ],
  "uad eden wt800": [
    {
      "name": "Studio Standard Slap Bass",
      "description": "Eden's signature automatic Enhance frequency scoop for perfect active slap bass sparkle.",
      "settings": {
        "Input Gain": 40,
        "Enhance Filter": 65,
        "Bass EQ": 70,
        "Treble EQ": 75,
        "Compressor Threshold": 35
      }
    },
    {
      "name": "Warm Fingerstyle Mid Weight",
      "description": "Disables Enhance scoop and boosts low-mid punch for warm, woody jazz fingerstyle playing.",
      "settings": {
        "Input Gain": 50,
        "Enhance Filter": 0,
        "Bass EQ": 64,
        "Treble EQ": 55,
        "Compressor Threshold": 45
      }
    }
  ],
  "uad api 550a": [
    {
      "name": "Vocal Presence and Air",
      "description": "Applies a musical +4 dB boost at 10 kHz (shelf) for airy sheen and +2 dB at 1.5 kHz for vocal focus, while filtering out sub-bass rumble.",
      "settings": {
        "Bandpass Filter": 127,
        "HF Frequency": 2,
        "HF Gain": 7,
        "HF Mode": 127,
        "MF Frequency": 4,
        "MF Gain": 6,
        "LF Frequency": 1,
        "LF Gain": 5,
        "LF Mode": 0
      }
    },
    {
      "name": "Snare Drum Crack (Peak)",
      "description": "Brings out snare body with +4 dB at 200 Hz and adds crisp attack with +6 dB at 5 kHz in peak mode.",
      "settings": {
        "Bandpass Filter": 0,
        "HF Frequency": 0,
        "HF Gain": 8,
        "HF Mode": 0,
        "MF Frequency": 5,
        "MF Gain": 5,
        "LF Frequency": 2,
        "LF Gain": 7,
        "LF Mode": 0
      }
    }
  ],
  "uad api 560": [
    {
      "name": "Pumping Kick Drum Carver",
      "description": "Boosts low sub weight at 31 Hz and 63 Hz by 3 dB, and cuts muddy 250 Hz boxiness by 4 dB.",
      "settings": {
        "31 Hz": 80,
        "63 Hz": 80,
        "125 Hz": 64,
        "250 Hz": 42,
        "500 Hz": 64,
        "1 kHz": 64,
        "2 kHz": 64,
        "4 kHz": 64,
        "8 kHz": 64,
        "16 kHz": 64
      }
    },
    {
      "name": "Electric Guitar Crunch Push",
      "description": "Brings guitars forward by boosting the biting 1 kHz and 2 kHz midrange, while scooping muddy low mids.",
      "settings": {
        "31 Hz": 64,
        "63 Hz": 64,
        "125 Hz": 50,
        "250 Hz": 64,
        "500 Hz": 45,
        "1 kHz": 80,
        "2 kHz": 85,
        "4 kHz": 70,
        "8 kHz": 64,
        "16 kHz": 64
      }
    }
  ],
  "uad sonnox oxford limiter": [
    {
      "name": "Modern Loudness Master Bus",
      "description": "Applies a gentle look-ahead limit of -0.1 dB with the signature Enhance fader set to 45% for huge perceived volume.",
      "settings": {
        "Input Gain": 25,
        "Pre-Process Attack": 32,
        "Pre-Process Release": 64,
        "Enhance Amount": 57,
        "Ceiling": 120,
        "Auto Gain": 0
      }
    },
    {
      "name": "Slammed Drum Parallel",
      "description": "Crushes drum transients using extreme input drive and fast attack/release, combined with 80% Enhance excitation.",
      "settings": {
        "Input Gain": 85,
        "Pre-Process Attack": 5,
        "Pre-Process Release": 20,
        "Enhance Amount": 102,
        "Ceiling": 110,
        "Auto Gain": 0
      }
    }
  ],
  "uad sonnox oxford dynamic eq": [
    {
      "name": "Vocal De-Esser Clean",
      "description": "Targets vocal sibilance around 5.5 kHz, dynamically cutting up to 6 dB only when harshness spikes.",
      "settings": {
        "Dynamic Band 1 Freq": 25,
        "Dynamic Band 1 Threshold": 127,
        "Dynamic Band 1 Gain": 64,
        "Dynamic Band 3 Freq": 85,
        "Dynamic Band 3 Threshold": 50,
        "Dynamic Band 3 Gain": 38,
        "EQ Phase Mode": 0
      }
    },
    {
      "name": "Master Bus Low-End Control",
      "description": "Controls muddy sub-bass blooms dynamically around 80 Hz in transparent linear phase mode.",
      "settings": {
        "Dynamic Band 1 Freq": 15,
        "Dynamic Band 1 Threshold": 75,
        "Dynamic Band 1 Gain": 50,
        "Dynamic Band 3 Freq": 64,
        "Dynamic Band 3 Threshold": 127,
        "Dynamic Band 3 Gain": 64,
        "EQ Phase Mode": 127
      }
    }
  ],
  "uad chandler limited zener limiter": [
    {
      "name": "EMI Abbey Road Master Glue",
      "description": "Classic Abbey Road compression mode with 150 Hz sidechain filter active, slow attack and moderate release for warm output gluing.",
      "settings": {
        "Operation Mode": 0,
        "Input Gain": 42,
        "Sidechain Filter": 3,
        "Attack Time": 2,
        "Release Time": 5,
        "Output Control": 64
      }
    },
    {
      "name": "Explosive Germanium Drums",
      "description": "Switches to Limit mode with fast attack, pinning room mic transients and introducing rich germanium harmonic grit.",
      "settings": {
        "Operation Mode": 1,
        "Input Gain": 85,
        "Sidechain Filter": 0,
        "Attack Time": 0,
        "Release Time": 0,
        "Output Control": 42
      }
    }
  ],
  "uad fender 55 tweed deluxe": [
    {
      "name": "Tweed Glassy Clean",
      "description": "Sets volume low for maximum clean headroom, with high-end shimmer on the Jensen speaker.",
      "settings": {
        "Instrument Volume": 32,
        "Mic Volume": 10,
        "Tone Control": 85,
        "Speaker Selection": 0,
        "Mic Placement": 0
      }
    },
    {
      "name": "Cranked Vintage Blues Breakup",
      "description": "Drives Instrument Volume to 9 with matching interactive loading and speaker bite for liquid tube sustain.",
      "settings": {
        "Instrument Volume": 95,
        "Mic Volume": 64,
        "Tone Control": 64,
        "Speaker Selection": 1,
        "Mic Placement": 127
      }
    }
  ],
  "uad sound machine wood works": [
    {
      "name": "Rich Studio Dreadnought",
      "description": "Molds bright dreadnought guitars into rich, air-filled studio recordings by dialing in 80% studio room microphone simulation.",
      "settings": {
        "Guitar Type": 1,
        "Source/Direct Mix": 25,
        "Studio/Mic Resonance": 102,
        "Treble Shaper": 64,
        "Low Cut Filter": 0
      }
    },
    {
      "name": "Bright Studio Fingerstyle",
      "description": "Optimized for fingerstyle acoustic play, adding sparkle and tightening low-end sub rumble.",
      "settings": {
        "Guitar Type": 0,
        "Source/Direct Mix": 38,
        "Studio/Mic Resonance": 89,
        "Treble Shaper": 85,
        "Low Cut Filter": 127
      }
    }
  ],
  "uad ep-34 tape echo": [
    {
      "name": "Nostalgic Vintage Slapback",
      "description": "Quick slapback echo around 140ms with prominent tape wow and flutter for signature nostalgic vintage wobble.",
      "settings": {
        "Delay Time": 25,
        "Echo Repeats": 15,
        "Record Volume": 64,
        "Echo Mix": 50,
        "Wow & Flutter": 75
      }
    },
    {
      "name": "Self-Oscillating Space Echo",
      "description": "Longer delay with high repeats pushing the tape loop into deep, infinite self-oscillating echoes.",
      "settings": {
        "Delay Time": 85,
        "Echo Repeats": 102,
        "Record Volume": 45,
        "Echo Mix": 64,
        "Wow & Flutter": 35
      }
    }
  ],
  "uad harrison 32c channel eq": [
    {
      "name": "Musical Vocal Sheen",
      "description": "Applies sweet silk at 12 kHz, cuts low-mid vocal boxiness at 300 Hz, and cleans up sub-bass floor at 80 Hz.",
      "settings": {
        "High Pass Filter": 32,
        "Low Pass Filter": 0,
        "HF Frequency": 102,
        "HF Gain": 80,
        "HMF Frequency": 64,
        "HMF Gain": 64,
        "LMF Frequency": 15,
        "LMF Gain": 45,
        "LF Frequency": 64,
        "LF Gain": 64
      }
    },
    {
      "name": "Punchy Kick & Snare Frame",
      "description": "Uses HPF at 40 Hz and LPF at 15 kHz to focus drum weight, with low-end shelf boosting punch at 80 Hz.",
      "settings": {
        "High Pass Filter": 10,
        "Low Pass Filter": 110,
        "HF Frequency": 64,
        "HF Gain": 64,
        "HMF Frequency": 85,
        "HMF Gain": 75,
        "LMF Frequency": 64,
        "LMF Gain": 64,
        "LF Frequency": 25,
        "LF Gain": 80
      }
    }
  ],
  "uad trident a-range eq": [
    {
      "name": "Glow Snare High Shimmer",
      "description": "Boosts high shelf at 12 kHz for the legendary British high-frequency Trident glow and +3 dB punch at 1 kHz.",
      "settings": {
        "HF Gain": 85,
        "HF Frequency": 2,
        "HMF Gain": 64,
        "HMF Frequency": 1,
        "LMF Gain": 76,
        "LMF Frequency": 2,
        "LF Gain": 64,
        "LF Frequency": 2,
        "Input Saturation": 42
      }
    },
    {
      "name": "Electric Guitar Wall Grittier",
      "description": "Boosts +3 dB at 5 kHz and sweeps low shelf at 80 Hz, driving input stage saturation for a huge wall of rock guitars.",
      "settings": {
        "HF Gain": 64,
        "HF Frequency": 2,
        "HMF Gain": 80,
        "HMF Frequency": 1,
        "LMF Gain": 64,
        "LMF Frequency": 2,
        "LF Gain": 75,
        "LF Frequency": 1,
        "Input Saturation": 85
      }
    }
  ],
  "uad ams rmx16 digital reverb": [
    {
      "name": "Phil Collins 80s Gated Snare",
      "description": "Generates the legendary, explosive gated snare sound using the dense 'Non-Lin 2' algorithm with tight decay timing.",
      "settings": {
        "Reverb Program": 4,
        "Decay Time": 40,
        "Pre-Delay": 15,
        "High Frequency Decay Filter": 64,
        "Low Frequency Decay Filter": 40,
        "Mix": 127
      }
    },
    {
      "name": "3D Lush Vocal Plate",
      "description": "Provides beautiful digital plate warmth with subtle HF excitation and LF cleanup for transparent vocal depth.",
      "settings": {
        "Reverb Program": 3,
        "Decay Time": 70,
        "Pre-Delay": 32,
        "High Frequency Decay Filter": 85,
        "Low Frequency Decay Filter": 45,
        "Mix": 45
      }
    }
  ],
  "uad cooper time cube mkii delay": [
    {
      "name": "Haas Stereo Widener",
      "description": "Uses the legendary Haas effect to expand a mono track into massive 3D stereo width by setting A to 14ms and B to 28ms.",
      "settings": {
        "Coarse Delay A": 0,
        "Fine Delay A": 0,
        "Decay A (Feedback)": 10,
        "Coarse Delay B": 4,
        "Fine Delay B": 30,
        "Decay B (Feedback)": 12,
        "Channel Mode": 1
      }
    },
    {
      "name": "Resonant Mechanical Double",
      "description": "Engages moderate decay on 32ms coarse settings to emulate the unique metallic tube acoustic reflections.",
      "settings": {
        "Coarse Delay A": 5,
        "Fine Delay A": 64,
        "Decay A (Feedback)": 45,
        "Coarse Delay B": 5,
        "Fine Delay B": 80,
        "Decay B (Feedback)": 50,
        "Channel Mode": 0
      }
    }
  ],
  "uad mxr flanger doubler": [
    {
      "name": "Vintage Jet-Engine Sweep",
      "description": "Pushes regeneration high and speed extremely slow for that classic 70s sweeping jet-plane flanging on drums or guitars.",
      "settings": {
        "Operation Mode": 0,
        "Manual": 32,
        "Width": 102,
        "Speed": 15,
        "Regeneration (Feedback)": 114,
        "Mix": 64
      }
    },
    {
      "name": "Lush BBD Vocal Doubling",
      "description": "Switches to Doubler mode with mild speed modulation for a thick, warm bucket-brigade double-tracked vocal finish.",
      "settings": {
        "Operation Mode": 1,
        "Manual": 85,
        "Width": 45,
        "Speed": 25,
        "Regeneration (Feedback)": 64,
        "Mix": 90
      }
    }
  ],
  "uad little labs ibp phase alignment tool": [
    {
      "name": "DI Bass Phase Lock",
      "description": "Slightly shifts DI bass track phase around 60 degrees to lock low-end punch when combined with a mic'd cabinet.",
      "settings": {
        "Phase Adjust": 42,
        "Phase Switch": 0,
        "Delay Adjust": 0,
        "Delay State": 0,
        "Phase Center": 0
      }
    },
    {
      "name": "Snare Dual-Mic Alignment",
      "description": "Inverts polarity and sweeps continuous phase with 0.8ms micro-delay to align top/bottom snare mics perfectly.",
      "settings": {
        "Phase Adjust": 76,
        "Phase Switch": 127,
        "Delay Adjust": 25,
        "Delay State": 127,
        "Phase Center": 127
      }
    }
  ],
  "uad dangerous bax eq": [
    {
      "name": "Master Bus Polish and Sweep",
      "description": "Cuts sub-audible low rumble at 12 Hz, boosts low-end body at 84 Hz, and sweetens mix air with +1.5 dB shelf at 18 kHz.",
      "settings": {
        "Low Cut Filter": 1,
        "Low EQ Frequency": 1,
        "Low EQ Boost/Cut": 70,
        "High EQ Frequency": 6,
        "High EQ Boost/Cut": 76,
        "High Cut Filter": 7
      }
    },
    {
      "name": "Silky Acoustic Guitar Finish",
      "description": "Tightens lows at 30 Hz, scoops low-mids at 98 Hz, and boosts glassy clarity with +2.0 dB at 7.1 kHz.",
      "settings": {
        "Low Cut Filter": 4,
        "Low EQ Frequency": 2,
        "Low EQ Boost/Cut": 54,
        "High EQ Frequency": 5,
        "High EQ Boost/Cut": 82,
        "High Cut Filter": 5
      }
    }
  ],
  "uad summit audio tla-100a compressor": [
    {
      "name": "Smooth Optical Vocal Leveler",
      "description": "Applies transparent 3-5 dB leveling with medium attack/release curves, locking vocal transients smoothly.",
      "settings": {
        "Gain": 64,
        "Gain Reduction": 55,
        "Attack": 1,
        "Release": 1,
        "Sidechain Filter": 0,
        "Meter Mode": 127
      }
    },
    {
      "name": "Locked Bass Tube Leveling",
      "description": "Sets slow attack to let pick attack pass, using the sidechain high-pass filter to ignore sub pumping.",
      "settings": {
        "Gain": 70,
        "Gain Reduction": 76,
        "Attack": 2,
        "Release": 0,
        "Sidechain Filter": 2,
        "Meter Mode": 127
      }
    }
  ],
  "uad sonnox oxford envolution": [
    {
      "name": "Dull Snare Crack Maximizer",
      "description": "Surgically target 4 kHz transients, boosting attack transients by +4.5 dB for exceptional snare cracking speed.",
      "settings": {
        "Transient Gain": 85,
        "Transient Attack": 20,
        "Transient Frequency": 80,
        "Sustain Gain": 64,
        "Sustain Release": 30,
        "Sustain Frequency": 64,
        "Mix": 127
      }
    },
    {
      "name": "Drum Room Acoustic Sustain",
      "description": "Saves low-mid sustain while boosting sustain gain to expand room size and draw out realistic acoustic ring.",
      "settings": {
        "Transient Gain": 64,
        "Transient Attack": 30,
        "Transient Frequency": 64,
        "Sustain Gain": 95,
        "Sustain Release": 85,
        "Sustain Frequency": 32,
        "Mix": 102
      }
    }
  ],
  "uad eventide h910 harmonizer": [
    {
      "name": "Pitch-Modulated Stereo Widener",
      "description": "Classic micro-pitch setup boosting pitch slightly sharp with active Anti-Feedback for organic chorusing width.",
      "settings": {
        "Pitch Ratio": 85,
        "Delay Time": 2,
        "Feedback": 15,
        "Anti-Feedback": 127,
        "Input Level": 64,
        "Mix": 64
      }
    },
    {
      "name": "Gritty Cascading Pitch Echoes",
      "description": "Flat-shifted digital delay with high feedback to create beautiful, descending vintage digital echoes.",
      "settings": {
        "Pitch Ratio": 32,
        "Delay Time": 4,
        "Feedback": 76,
        "Anti-Feedback": 0,
        "Input Level": 80,
        "Mix": 50
      }
    }
  ],
  "uad drawmer 1973 multi-band compressor": [
    {
      "name": "Master Bus Air and Big Glue",
      "description": "Engages 'Big' low sidechain and 'Air' treble excitation to dynamically compress mid bands while sweetening master extremes.",
      "settings": {
        "Low/Mid Crossover": 25,
        "Mid/High Crossover": 85,
        "Low Threshold": 45,
        "Mid Threshold": 50,
        "High Threshold": 48,
        "Low Band Style": 127,
        "High Band Style": 127,
        "Mix": 50
      }
    },
    {
      "name": "Acoustic Guitar Dynamic Shine",
      "description": "Locks mid-frequency strum dynamic swings tightly, allowing high air shelf expansion to sweeten decay.",
      "settings": {
        "Low/Mid Crossover": 35,
        "Mid/High Crossover": 90,
        "Low Threshold": 64,
        "Mid Threshold": 38,
        "High Threshold": 50,
        "Low Band Style": 0,
        "High Band Style": 127,
        "Mix": 127
      }
    }
  ],
  "uad waterfall rotary speaker": [
    {
      "name": "Lush Slow Chorale Rotor",
      "description": "Slow rotating speakers with clean tube preamp drive and wide microphone spacing for dimensional depth.",
      "settings": {
        "Speed": 0,
        "Drive": 42,
        "Horn Speed": 64,
        "Drum Speed": 64,
        "Mic Distance": 80,
        "Mic Angle": 45,
        "Mix": 127
      }
    },
    {
      "name": "Growling Heavy Fast Tremolo",
      "description": "Speeds up speakers to Tremolo, pushing Drive to hot tube distortion for aggressive growling organ cabinets.",
      "settings": {
        "Speed": 2,
        "Drive": 95,
        "Horn Speed": 75,
        "Drum Speed": 50,
        "Mic Distance": 25,
        "Mic Angle": 0,
        "Mix": 90
      }
    }
  ],
  "uad ua 610-a": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Input Gain": 64,
        "Level": 64,
        "High EQ Frequency": 0,
        "Low EQ Frequency": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Input Gain": 95,
        "Level": 95,
        "High EQ Frequency": 127,
        "Low EQ Frequency": 127
      }
    }
  ],
  "uad brent averill 1073": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Mic Gain": 64,
        "High Shelf": 64,
        "Mid Band Gain": 64,
        "Low Cut": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Mic Gain": 95,
        "High Shelf": 95,
        "Mid Band Gain": 95,
        "Low Cut": 127
      }
    }
  ],
  "uad custom shop 1073": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Preamp Drive": 64,
        "Low Band EQ": 64,
        "Phase Invert": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Preamp Drive": 95,
        "Low Band EQ": 95,
        "Phase Invert": 127
      }
    }
  ],
  "uad helios type 69 legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Bass Cut": 64,
        "Mid Freq": 64,
        "Mid Gain": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Bass Cut": 95,
        "Mid Freq": 95,
        "Mid Gain": 95
      }
    }
  ],
  "uad ssl e-series preamp": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Line Gain": 64,
        "Pad": 0,
        "High-Pass Filter": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Line Gain": 95,
        "Pad": 127,
        "High-Pass Filter": 95
      }
    }
  ],
  "uad telefunken v76 legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Gain Step": 64,
        "Low Cut Filter": 0,
        "Output Fader": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Gain Step": 95,
        "Low Cut Filter": 127,
        "Output Fader": 95
      }
    }
  ],
  "uad teletronix la-2a gray": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Peak Reduction": 64,
        "Gain": 64,
        "Mode": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Peak Reduction": 95,
        "Gain": 95,
        "Mode": 127
      }
    }
  ],
  "uad teletronix la-2": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Peak Reduction": 64,
        "Gain": 64,
        "Compress / Limit": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Peak Reduction": 95,
        "Gain": 95,
        "Compress / Limit": 127
      }
    }
  ],
  "uad 1176se rev g": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Input": 64,
        "Output": 64,
        "Attack": 64,
        "Release": 64,
        "Ratio": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Input": 95,
        "Output": 95,
        "Attack": 95,
        "Release": 95,
        "Ratio": 127
      }
    }
  ],
  "uad 1176 rev a": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Input Drive": 64,
        "Output level": 64,
        "Attack Rate": 64,
        "Release Rate": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Input Drive": 95,
        "Output level": 95,
        "Attack Rate": 95,
        "Release Rate": 95
      }
    }
  ],
  "uad 1176ae 40th anniversary": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Input Threshold": 64,
        "Output Gain": 64,
        "Ratio Switch": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Input Threshold": 95,
        "Output Gain": 95,
        "Ratio Switch": 127
      }
    }
  ],
  "uad fairchild 660": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Threshold": 64,
        "Time Constant": 64,
        "Input Gain": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Threshold": 95,
        "Time Constant": 95,
        "Input Gain": 95
      }
    }
  ],
  "uad neve 2254": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Comp Ratio": 0,
        "Comp Threshold": 64,
        "Limiter Threshold": 64,
        "Comp Recovery": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Comp Ratio": 127,
        "Comp Threshold": 95,
        "Limiter Threshold": 95,
        "Comp Recovery": 95
      }
    }
  ],
  "uad precision buss compressor": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Threshold": 64,
        "Ratio": 0,
        "Sidechain Filter": 0,
        "Release": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Threshold": 95,
        "Ratio": 127,
        "Sidechain Filter": 127,
        "Release": 95
      }
    }
  ],
  "uad precision limiter": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Ceiling": 64,
        "Gain Boost": 64,
        "Release Time": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Ceiling": 95,
        "Gain Boost": 95,
        "Release Time": 95
      }
    }
  ],
  "uad precision maximizer": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Limit Drive": 64,
        "Shape Control": 64,
        "Mix": 64,
        "Bands Mode": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Limit Drive": 95,
        "Shape Control": 95,
        "Mix": 95,
        "Bands Mode": 127
      }
    }
  ],
  "uad precision de-esser": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Threshold": 64,
        "Frequency": 64,
        "Bandwidth": 0,
        "Mode": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Threshold": 95,
        "Frequency": 95,
        "Bandwidth": 127,
        "Mode": 127
      }
    }
  ],
  "uad vertigo vsc-2 compressor": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Threshold": 64,
        "Ratio": 0,
        "Attack": 64,
        "Release": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Threshold": 95,
        "Ratio": 127,
        "Attack": 95,
        "Release": 95
      }
    }
  ],
  "uad valley people dyna-mite": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Threshold": 64,
        "Release": 64,
        "Mode": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Threshold": 95,
        "Release": 95,
        "Mode": 127
      }
    }
  ],
  "uad bx_optical compressor": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Gain Reduction": 64,
        "Makeup": 64,
        "Sidechain": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Gain Reduction": 95,
        "Makeup": 95,
        "Sidechain": 127
      }
    }
  ],
  "uad api 527 compressor": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Threshold": 64,
        "Ratio": 64,
        "Thrust Filter": 0,
        "Type": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Threshold": 95,
        "Ratio": 95,
        "Thrust Filter": 127,
        "Type": 127
      }
    }
  ],
  "uad pultec meq-5 mid-range eq": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Low Mid Peak Freq": 64,
        "Low Mid Boost": 64,
        "Mid Dip Freq": 64,
        "Mid Dip Gain": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Low Mid Peak Freq": 95,
        "Low Mid Boost": 95,
        "Mid Dip Freq": 95,
        "Mid Dip Gain": 95
      }
    }
  ],
  "uad pultec hlf-3c filter": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "High Pass": 0,
        "Low Pass": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "High Pass": 127,
        "Low Pass": 127
      }
    }
  ],
  "uad neve 31102": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "High Shelf Boost": 64,
        "Mid Band Freq": 64,
        "Mid Band Gain": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "High Shelf Boost": 95,
        "Mid Band Freq": 95,
        "Mid Band Gain": 95
      }
    }
  ],
  "uad api 550b": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "High Band": 64,
        "High Gain": 64,
        "Mid High Band": 64,
        "Mid High Gain": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "High Band": 95,
        "High Gain": 95,
        "Mid High Band": 95,
        "Mid High Gain": 95
      }
    }
  ],
  "uad millennia nseq-2 parametric eq": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Twin Topology": 0,
        "High Shelf Freq": 64,
        "High Shelf Gain": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Twin Topology": 127,
        "High Shelf Freq": 95,
        "High Shelf Gain": 95
      }
    }
  ],
  "uad sonnox oxford eq": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "EQ Curve Type": 0,
        "Band 3 Gain": 64,
        "Band 3 Q": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "EQ Curve Type": 127,
        "Band 3 Gain": 95,
        "Band 3 Q": 95
      }
    }
  ],
  "uad cambridge eq": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Low Cut Filter Slope": 64,
        "High Cut Filter Slope": 64,
        "Band 2 Q-Factor": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Low Cut Filter Slope": 95,
        "High Cut Filter Slope": 95,
        "Band 2 Q-Factor": 95
      }
    }
  ],
  "uad tonelux tilt active eq": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Tilt Control": 64,
        "Low-Pass Filter": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Tilt Control": 95,
        "Low-Pass Filter": 95
      }
    }
  ],
  "uad tube-tech pe 1c program equalizer": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Low Boost Freq": 0,
        "Low Boost Amount": 64,
        "Low Atten Amount": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Low Boost Freq": 127,
        "Low Boost Amount": 95,
        "Low Atten Amount": 95
      }
    }
  ],
  "uad tube-tech me 1b mid-range equalizer": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Mid Boost Freq": 64,
        "Mid Boost Gain": 64,
        "Mid Dip Freq": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Mid Boost Freq": 95,
        "Mid Boost Gain": 95,
        "Mid Dip Freq": 95
      }
    }
  ],
  "uad brainworx bx_digital v2": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Mono-maker": 64,
        "Mid High Shelf": 64,
        "Side High Shelf": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Mono-maker": 95,
        "Mid High Shelf": 95,
        "Side High Shelf": 95
      }
    }
  ],
  "uad precision equalizer": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Low Cut Filter": 0,
        "Band 1 Gain": 64,
        "Band 4 Gain": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Low Cut Filter": 127,
        "Band 1 Gain": 95,
        "Band 4 Gain": 95
      }
    }
  ],
  "uad harrison 32c se eq": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Low EQ Frequency": 64,
        "High Pass Filter": 64,
        "Low Gain": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Low EQ Frequency": 95,
        "High Pass Filter": 95,
        "Low Gain": 95
      }
    }
  ],
  "uad ssl 4000 g channel strip": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "EQ Type": 0,
        "Dyn Threshold": 64,
        "Exp Threshold": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "EQ Type": 127,
        "Dyn Threshold": 95,
        "Exp Threshold": 95
      }
    }
  ],
  "uad ssl 9000 k channel strip": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Gain": 64,
        "Gate Threshold": 64,
        "Comp Attack": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Gain": 95,
        "Gate Threshold": 95,
        "Comp Attack": 95
      }
    }
  ],
  "uad api vision channel strip legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Preamp Gain": 64,
        "Comp Threshold": 64,
        "Low Cut Filter": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Preamp Gain": 95,
        "Comp Threshold": 95,
        "Low Cut Filter": 127
      }
    }
  ],
  "uad brainworx bx_console ssc": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "TMT Channel": 0,
        "Input Gain": 64,
        "EQ Low Boost": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "TMT Channel": 127,
        "Input Gain": 95,
        "EQ Low Boost": 95
      }
    }
  ],
  "uad brainworx bx_console n": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "TMT Active": 0,
        "VCA Compressor Threshold": 64,
        "Gate Threshold": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "TMT Active": 127,
        "VCA Compressor Threshold": 95,
        "Gate Threshold": 95
      }
    }
  ],
  "uad brainworx bx_console focusrite sc": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Preamp Drive": 64,
        "ISA 110 Low EQ": 64,
        "ISA 130 Compressor": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Preamp Drive": 95,
        "ISA 110 Low EQ": 95,
        "ISA 130 Compressor": 95
      }
    }
  ],
  "uad neve 88rs legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Preamp Level": 64,
        "Comp Limit": 64,
        "Gate Range": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Preamp Level": 95,
        "Comp Limit": 95,
        "Gate Range": 95
      }
    }
  ],
  "uad ams neve dfc legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Gate Threshold": 64,
        "Parametric Low Gain": 64,
        "Output Limit": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Gate Threshold": 95,
        "Parametric Low Gain": 95,
        "Output Limit": 95
      }
    }
  ],
  "uad oxide tape recorder legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Tape Speed": 0,
        "Input Drive": 64,
        "EQ Curve": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Tape Speed": 127,
        "Input Drive": 95,
        "EQ Curve": 127
      }
    }
  ],
  "uad ampex master tape legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Tape Speed Select": 0,
        "Tape Formula": 0,
        "Bias Control": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Tape Speed Select": 127,
        "Tape Formula": 127,
        "Bias Control": 127
      }
    }
  ],
  "uad studer multi tape legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Speed Select": 0,
        "Tape Cal": 0,
        "Input Stage": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Speed Select": 127,
        "Tape Cal": 127,
        "Input Stage": 95
      }
    }
  ],
  "uad vertigo vsm-3 satellite": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "2nd Harmonic Drive": 64,
        "3rd Harmonic Drive": 64,
        "Mode Select": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "2nd Harmonic Drive": 95,
        "3rd Harmonic Drive": 95,
        "Mode Select": 127
      }
    }
  ],
  "uad brainworx bx_saturator v2": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Low Mid Saturation": 64,
        "High Mid Saturation": 64,
        "Crossover Frequency": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Low Mid Saturation": 95,
        "High Mid Saturation": 95,
        "Crossover Frequency": 95
      }
    }
  ],
  "uad oto biscuit 8-bit effects processor": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Bit Crush Depth": 64,
        "Sample Rate Clock": 64,
        "Filter Cutoff": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Bit Crush Depth": 95,
        "Sample Rate Clock": 95,
        "Filter Cutoff": 95
      }
    }
  ],
  "uad raw distortion pedal": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Distortion Amount": 64,
        "Filter EQ": 64,
        "Output Volume": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Distortion Amount": 95,
        "Filter EQ": 95,
        "Output Volume": 95
      }
    }
  ],
  "uad ts808 tube screamer": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Overdrive Gain": 64,
        "Tone Center": 64,
        "Level Output": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Overdrive Gain": 95,
        "Tone Center": 95,
        "Level Output": 95
      }
    }
  ],
  "uad proco rat distortion": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Drive Level": 64,
        "Filter Cut": 64,
        "Master Vol": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Drive Level": 95,
        "Filter Cut": 95,
        "Master Vol": 95
      }
    }
  ],
  "uad realverb pro": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Room Material": 0,
        "Decay Time": 64,
        "Mix": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Room Material": 127,
        "Decay Time": 95,
        "Mix": 95
      }
    }
  ],
  "uad dreamverb room modeler": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Space Size": 64,
        "Reflections Level": 64,
        "Early Materials": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Space Size": 95,
        "Reflections Level": 95,
        "Early Materials": 127
      }
    }
  ],
  "uad ocean way studios legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Room Select": 0,
        "Mic Distance": 0,
        "Pre Delay": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Room Select": 127,
        "Mic Distance": 127,
        "Pre Delay": 95
      }
    }
  ],
  "uad brainworx bx_roomms": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Mono-maker": 64,
        "Decay": 64,
        "Side Width": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Mono-maker": 95,
        "Decay": 95,
        "Side Width": 95
      }
    }
  ],
  "uad ep-34 tape echo legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Delay Time Select": 64,
        "Echo Feedback": 64,
        "Tape Age": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Delay Time Select": 95,
        "Echo Feedback": 95,
        "Tape Age": 127
      }
    }
  ],
  "uad korg sdd-3000 legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Delay Step": 64,
        "Filter Cut": 0,
        "Modulation Depth": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Delay Step": 95,
        "Filter Cut": 127,
        "Modulation Depth": 95
      }
    }
  ],
  "uad cooper time cube mkii legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Coarse Delay A": 64,
        "Coarse Delay B": 64,
        "Mix A/B": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Coarse Delay A": 95,
        "Coarse Delay B": 95,
        "Mix A/B": 95
      }
    }
  ],
  "uad ams rmx16 legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Program Select": 0,
        "Decay Time": 64,
        "Pre-Delay": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Program Select": 127,
        "Decay Time": 95,
        "Pre-Delay": 95
      }
    }
  ],
  "uad lexicon 224 legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Program Code": 64,
        "Bass Decay": 64,
        "Mid Decay": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Program Code": 95,
        "Bass Decay": 95,
        "Mid Decay": 95
      }
    }
  ],
  "uad emt 140 legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Plate Select": 0,
        "Reverb Time": 64,
        "Input Filter HP": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Plate Select": 127,
        "Reverb Time": 95,
        "Input Filter HP": 127
      }
    }
  ],
  "uad dytronics tri-stereo chorus": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "LFO Waveform": 0,
        "Left Mod Depth": 64,
        "Center Mod Depth": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "LFO Waveform": 127,
        "Left Mod Depth": 95,
        "Center Mod Depth": 95
      }
    }
  ],
  "uad benson chimera amplifier": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Volume": 64,
        "Bass": 64,
        "Treble": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Volume": 95,
        "Bass": 95,
        "Treble": 95
      }
    }
  ],
  "uad marshall silver jubilee 2555": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Lead Master": 64,
        "Input Gain": 64,
        "Presence": 64,
        "Bass": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Lead Master": 95,
        "Input Gain": 95,
        "Presence": 95,
        "Bass": 95
      }
    }
  ],
  "uad marshall bluesbreaker 1962": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Volume I": 64,
        "Volume II": 64,
        "Speed": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Volume I": 95,
        "Volume II": 95,
        "Speed": 95
      }
    }
  ],
  "uad marshall jmp 2203": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Master Volume": 64,
        "Preamp Volume": 64,
        "Middle": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Master Volume": 95,
        "Preamp Volume": 95,
        "Middle": 95
      }
    }
  ],
  "uad ampeg b-15n bass amplifier": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Bias Year": 0,
        "Bass EQ": 64,
        "Volume Control": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Bias Year": 127,
        "Bass EQ": 95,
        "Volume Control": 95
      }
    }
  ],
  "uad ampeg svt-810 bass amplifier": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Mic Select": 0,
        "Position": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Mic Select": 127,
        "Position": 127
      }
    }
  ],
  "uad fender bassman": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Bright Volume": 64,
        "Normal Volume": 64,
        "Presence Tone": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Bright Volume": 95,
        "Normal Volume": 95,
        "Presence Tone": 95
      }
    }
  ],
  "uad supro 1965 dual-tone": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Volume Channel 1": 64,
        "Tone Sweep": 64,
        "Tremolo Intensity": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Volume Channel 1": 95,
        "Tone Sweep": 95,
        "Tremolo Intensity": 95
      }
    }
  ],
  "uad friedman be-100": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Gain Control": 64,
        "Presence": 64,
        "C45 voicing": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Gain Control": 95,
        "Presence": 95,
        "C45 voicing": 127
      }
    }
  ],
  "uad friedman ds-40": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Gain Structure": 0,
        "Treble": 64,
        "Bass EQ": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Gain Structure": 127,
        "Treble": 95,
        "Bass EQ": 95
      }
    }
  ],
  "uad engl savage 120": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Gain Channel 4": 64,
        "Lead Boost": 0,
        "Contour EQ": 0
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Gain Channel 4": 95,
        "Lead Boost": 127,
        "Contour EQ": 127
      }
    }
  ],
  "uad engl retro tube 100": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Gain Level": 64,
        "Bright Voicing": 0,
        "Output Master": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Gain Level": 95,
        "Bright Voicing": 127,
        "Output Master": 95
      }
    }
  ],
  "uad fuchs train ii": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Preamp Gain": 64,
        "Treble EQ": 64,
        "Bass EQ": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Preamp Gain": 95,
        "Treble EQ": 95,
        "Bass EQ": 95
      }
    }
  ],
  "uad suhr badger 30": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Power Scale": 64,
        "Drive Input": 64,
        "Presence": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Power Scale": 95,
        "Drive Input": 95,
        "Presence": 95
      }
    }
  ],
  "uad gallien krueger 800rb legacy": [
    {
      "name": "Certified Studio Default",
      "description": "Optimized basic configuration to get a balanced start on vocals or instruments.",
      "settings": {
        "Preamp Boost": 64,
        "Low Cut Voice": 0,
        "Treble EQ": 64
      }
    },
    {
      "name": "Aggressive Drive & Focus",
      "description": "Pushes internal preamps or thresholds hard for dynamic presence and character.",
      "settings": {
        "Preamp Boost": 95,
        "Low Cut Voice": 127,
        "Treble EQ": 95
      }
    }
  ],
};
