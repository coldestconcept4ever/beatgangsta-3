# BeatGangsta UAD Database Developer Guidelines

This document outlines strict project-specific rules, constraints, and instructions that all AI agents editing or working on this repository must adhere to at all times.

## 🛑 THE GOLDEN RULE: ABSOLUTELY NO HARDWARE-ONLY CONTROLS

The core purpose of this database (`src/data/uadDatabase.ts` and related presets in `src/data/uadPresets.ts`) is to catalog **Universal Audio (UAD) digital software plugins**, NOT physical analog hardware gear. 

Therefore, you must enforce a **strict guard** against including any parameters, knobs, switches, or ranges that exist only on the physical hardware chassis but are omitted, simplified, or altered in the software plugin version:

1. **Software-Only Controls**: Only catalog parameters that are directly adjustable, visible, and automatable inside the digital software plugin GUI.
2. **Exclude Physical-Only Calibrations**: Do not include physical tube biasing adjustments, internal chassis pots, or hardware rewiring options unless they are actual exposed parameters on the plugin GUI.
3. **No Coarse/Fine Stepped Gain Splits (If Simplified)**: If the physical hardware has split "Coarse Gain" and "Fine Gain" selectors but the software plugin simplifies this into a unified "Gain" control (or vice versa), you **must** model the software GUI control precisely.
4. **Exact GUI Naming**: Match the exact text labels used on the software plugin GUI (e.g. "Low Cut" instead of "High Pass Filter" if that's what the software panel says; "Phase" instead of "Phase Polarity"; "Output" instead of "Output Trim").
5. **Preset Consistency**: Any edits to a plugin's parameter names in `src/data/uadDatabase.ts` **MUST** be immediately and recursively updated across all corresponding presets inside `src/data/uadPresets.ts` to prevent runtime mismatches and application crashes.

## 📋 Research and Verification Safeguards

When researching new plugins or verifying/auditing existing ones:
- **Always Consult Software Manuals**: Prioritize the official Universal Audio Software Manual over generic analog hardware articles.
- **Strictly Reject Hardware Details**: If an AI research pass returns physical-only parameters or chassis settings, they must be discarded immediately.
