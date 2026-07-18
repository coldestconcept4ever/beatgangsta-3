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
  ]
};
