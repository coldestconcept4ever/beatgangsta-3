import { GenreProfile, TensionLevel } from '../types';

export const GENRE_PROFILES: Record<string, GenreProfile> = {
  'rage': {
    name: 'Rage',
    densityMap: { 1: 0.3, 2: 0.5, 3: 0.7, 4: 0.9, 5: 1.0 },
    swingAmount: 0.1,
    probabilityMap: { 'kick': 0.9, 'snare': 0.8, 'hiHat': 0.95 },
    phrasingStyle: 'call-and-response'
  },
  'lo-fi': {
    name: 'Lo-Fi',
    densityMap: { 1: 0.2, 2: 0.3, 3: 0.4, 4: 0.5, 5: 0.6 },
    swingAmount: 0.4,
    probabilityMap: { 'kick': 0.6, 'snare': 0.7, 'hiHat': 0.5 },
    phrasingStyle: 'linear'
  }
};

export const getProbability = (genre: string, instrument: string, tension: TensionLevel): number => {
  const profile = GENRE_PROFILES[genre.toLowerCase()] || GENRE_PROFILES['rage'];
  const baseProb = profile.probabilityMap[instrument] || 0.5;
  const density = profile.densityMap[tension];
  return baseProb * density;
};

export const applyPhrasing = (notes: any[], style: 'linear' | 'call-and-response' | 'evolving'): any[] => {
  if (style === 'call-and-response') {
    const mid = Math.floor(notes.length / 2);
    const firstHalf = notes.slice(0, mid);
    const secondHalf = firstHalf.map(n => ({ ...n, pitch: transposePitch(n.pitch, 2) }));
    return [...firstHalf, ...secondHalf];
  }
  return notes;
};

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const transposePitch = (pitch: string, semitones: number): string => {
  const match = pitch.match(/^([A-G]#?)(\d)$/);
  if (!match) return pitch;
  
  const note = match[1];
  const octave = parseInt(match[2]);
  const noteIndex = NOTES.indexOf(note);
  
  let newIndex = noteIndex + semitones;
  let newOctave = octave + Math.floor(newIndex / 12);
  newIndex = ((newIndex % 12) + 12) % 12;
  
  return `${NOTES[newIndex]}${newOctave}`;
};

export interface GrooveTemplate {
  name: string;
  offsets: number[]; // Micro-timing offsets in ticks
}

export const GROOVE_TEMPLATES: Record<string, GrooveTemplate> = {
  'swing': { name: 'Swing', offsets: [0, 10, 0, 10] }, // Delay off-beats
  'laid-back': { name: 'Laid Back', offsets: [0, 5, 2, 8] } // Slightly behind the beat
};

export const applyGroove = (events: any[], templateName: string): any[] => {
  const template = GROOVE_TEMPLATES[templateName];
  if (!template) return events;
  
  return events.map((event, index) => {
    const offset = template.offsets[index % template.offsets.length];
    return { ...event, wait: `T${parseInt(event.wait.substring(1)) + offset}` };
  });
};

export const applyDynamics = (events: any[], sectionType: 'intro' | 'verse' | 'hook' | 'bridge' | 'outro'): any[] => {
  // Apply crescendo/decrescendo curves
  return events.map((event, index) => {
    let velocityMod = 0;
    if (sectionType === 'intro') velocityMod = -10; // Start quiet
    else if (sectionType === 'hook') velocityMod = 10; // Peak energy
    
    return { ...event, velocity: Math.min(127, Math.max(1, (Number(event.velocity) || 100) + velocityMod)) };
  });
};

export const getBlendedProfile = (genre1: string, genre2: string, weight: number): GenreProfile => {
  const p1 = GENRE_PROFILES[genre1.toLowerCase()] || GENRE_PROFILES['rage'];
  const p2 = GENRE_PROFILES[genre2.toLowerCase()] || GENRE_PROFILES['rage'];
  
  return {
    name: `${p1.name}-${p2.name}-Blend`,
    densityMap: Object.fromEntries(
      Object.entries(p1.densityMap).map(([k, v]) => [k, v * (1 - weight) + (p2.densityMap[k as unknown as TensionLevel] || 0) * weight])
    ) as Record<TensionLevel, number>,
    swingAmount: p1.swingAmount * (1 - weight) + p2.swingAmount * weight,
    probabilityMap: Object.fromEntries(
      Object.keys(p1.probabilityMap).map(k => [k, p1.probabilityMap[k] * (1 - weight) + (p2.probabilityMap[k] || 0) * weight])
    ),
    phrasingStyle: Math.random() > 0.5 ? p1.phrasingStyle : p2.phrasingStyle
  };
};

export const applyDensityManagement = (events: any[], drumActivity: number): any[] => {
  // Reduce melody density if drum activity is high
  if (drumActivity > 0.7) {
    return events.filter(() => Math.random() > 0.3);
  }
  return events;
};

export const constrainToChords = (events: any[], chordProgression: string): any[] => {
  // Simple constraint: only allow notes that are in the chord (e.g., C, E, G for C Major)
  // This is a placeholder for actual harmonic analysis
  return events.map(event => ({ ...event, pitch: event.pitch })); 
};

export const applySlides = (events: any[]): any[] => {
  // Detect pitch changes and insert pitch-bend events
  const newEvents: any[] = [];
  for (let i = 0; i < events.length; i++) {
    newEvents.push(events[i]);
    if (i < events.length - 1 && events[i].pitch !== events[i+1].pitch) {
      // Insert pitch-bend event here
      newEvents.push({ type: 'pitch-bend', value: 8192 }); // Placeholder
    }
  }
  return newEvents;
};
