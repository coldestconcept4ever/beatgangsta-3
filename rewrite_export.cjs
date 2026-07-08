const fs = require('fs');

let content = fs.readFileSync('src/utils/exportAllMidi.ts', 'utf8');

// Replace instruments length logic
const instrumentsLengthLogic = `
          let sectionMidiNotes: MidiNote[] | undefined;
          if (Array.isArray(ing.midiNotes)) {
            sectionMidiNotes = ing.midiNotes;
          } else if (ing.midiNotes) {
            sectionMidiNotes = ing.midiNotes.hook || ing.midiNotes.verse || [];
          }
          
          let originalTotalBeats = 0;
          if (sectionMidiNotes) {
             for (const note of sectionMidiNotes) {
               originalTotalBeats += getBeats(note.wait) + getBeats(note.duration);
             }
          }
          const naturalBars = Math.max(4, Math.round(originalTotalBeats / 4)) as PatternLength;
          const lengths: PatternLength[] = naturalBars > 8 ? [naturalBars] : [4, 8];
          const variations: PatternVariation[] = ['A', 'B'];

          for (const bars of lengths) {
            for (const variation of variations) {
`;

content = content.replace(/const lengths: PatternLength\[\] = \[4, 8\];\s*const variations: PatternVariation\[\] = \['A', 'B'\];\s*for \(const bars of lengths\) \{\s*for \(const variation of variations\) \{\s*let sectionMidiNotes: MidiNote\[\] \| undefined;\s*if \(Array\.isArray\(ing\.midiNotes\)\) \{\s*sectionMidiNotes = ing\.midiNotes;\s*\} else if \(ing\.midiNotes\) \{\s*sectionMidiNotes = ing\.midiNotes\.hook \|\| ing\.midiNotes\.verse \|\| \[\];\s*\}/g, instrumentsLengthLogic);

// Replace drums length logic
const drumsLengthLogic = `
        let maxStep = 0;
        const getStepsPerBar = (isDT?: boolean) => isDT ? 32 : 16;
        let naturalBars = 4;
        const checkMaxBars = (part: any) => {
          if (!part || !Array.isArray(part.steps)) return;
          const stepsPerBar = getStepsPerBar(part.isDoubleTime);
          part.steps.forEach((s: any) => {
            const stepNum = typeof s === 'number' ? s : s.step;
            const b = Math.ceil(stepNum / stepsPerBar);
            if (b > naturalBars) naturalBars = b;
          });
        };
        checkMaxBars(pattern.kick);
        checkMaxBars(pattern.snare);
        checkMaxBars(pattern.hiHat);
        const lengths: PatternLength[] = naturalBars > 8 ? [naturalBars] : [4, 8];

        for (const humanized of [true, false]) {
          for (const bars of lengths) {
`;

content = content.replace(/for \(const humanized of \[true, false\]\) \{\s*for \(const bars of \[4, 8\] as PatternLength\[\]\) \{/g, drumsLengthLogic);

fs.writeFileSync('src/utils/exportAllMidi.ts', content);
