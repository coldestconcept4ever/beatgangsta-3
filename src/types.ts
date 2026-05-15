
export interface ReceiptItem {
  id: string;
  date: string;
  action: string;
  cost: number;
}

export interface ArrangementBlueprint {
  sections: {
    name: string; // "Intro", "Verse 1", "Hook", etc.
    durationBars: number;
    activeTracks: {
      instrumentName: string;
      isMuted: boolean;
      automationNotes?: string; // e.g., "filter sweep up"
    }[];
  }[];
}

export interface StructuralBlueprint {
  songMap: {
    intro: { energy: number; durationBars: number };
    verse1: { energy: number; durationBars: number };
    hook: { energy: number; durationBars: number };
    verse2: { energy: number; durationBars: number };
    hook2: { energy: number; durationBars: number };
    bridge?: { energy: number; durationBars: number };
    outro: { energy: number; durationBars: number };
  };
  arrangement: ArrangementBlueprint;
  densityMapping: {
    section: string;
    noteDensity: number; // 0.0 to 1.0
  }[];
  rhythmicLocking: {
    kickPattern: string; // e.g., "1, 4, 11"
    bassPattern: string; // e.g., "1, 4, 11"
  };
  melodicHierarchy: {
    primaryMelody: string;
    secondaryMelody: string;
    counterMelody: string;
  };
  transitionTriggers: {
    section: string;
    trigger: string; // e.g., "1-bar break", "octave jump"
  }[];
  microTiming: {
    swingAmount: number; // 0.0 to 1.0
    quantizationGrid: string; // e.g., "1/16", "1/8T"
  };
  velocityDynamics: {
    accentPattern: string; // e.g., "strong-weak-medium-weak"
    dynamicRange: number; // 0.0 to 1.0
  };
  chordVoicing: {
    inversionType: string; // e.g., "root", "first", "second"
    voicingStyle: string; // e.g., "closed", "open"
  };
  repetitionStrategy: {
    loopLengthBars: number;
    variationFrequency: number; // 0.0 to 1.0
  };
}

export interface VSTPlugin {
  vendor: string;
  name: string;
  type: string;
  version: string;
  lastModified: string;
  description?: string;
  features?: string[];
  parameters?: string[];
  tier?: string;
}

export interface FullSaveFile {
  version: string;
  timestamp: number;
  userProfile: {
    name: string;
    photo: string;
  };
  gear: {
    plugins: VSTPlugin[];
    analogInstruments: Hardware[];
    analogHardware: Hardware[];
    drumKits?: Hardware[];
    starredPlugins: string[];
    starredHardware: string[];
    deletedPlugins: VSTPlugin[];
    deletedInstruments: Hardware[];
    deletedHardware: Hardware[];
  };
  vault: {
    recipes: SavedRecipe[];
    critiques?: SavedCritique[];
    folders: Folder[];
  };
  receipts?: ReceiptItem[];
  ui: {
    theme: AppTheme;
    grillStyle: GrillStyle;
    knifeStyle: KnifeStyle;
    duragStyle: DuragStyle;
    pendantStyle: PendantStyle;
    chainStyle: ChainStyle;
    saberColor: string;
    mascotColor: string;
    showChain: boolean;
    highEyes: boolean;
    isCigarEquipped: boolean;
    isTossingCigar: boolean;
    showSparkles: boolean;
    stemTypesPreset?: string[];
    stemCustomTypesPreset?: string[];
  };
}

export interface Hardware {
  vendor: string;
  name: string;
  type: 'instrument' | 'hardware' | 'drumkit';
  description?: string;
  drumKitData?: DrumKit;
  connectedPedals?: Hardware[];
  connectedAmps?: Hardware[];
}

export interface DrumPart {
  brand: string;
  model: string;
  size?: string;
  tuning?: string;
  muffling?: string;
  notes?: string;
  label?: string;
}

export interface DrumKit {
  kick: DrumPart;
  snare: DrumPart;
  toms: DrumPart;
  hiHats: DrumPart;
  cymbals: DrumPart;
  additionalParts?: DrumPart[];
}

export interface SignalChainStep {
  pluginName: string;
  purpose: string;
}

export interface ParameterSetting {
  parameter: string;
  value: string;
  explanation?: string;
}

export interface DeepDivePlugin {
  name: string;
  purpose: string;
  deepDive: ParameterSetting[];
  band?: string;
  routing?: string;
}

export interface MidiNote {
  pitch: string;
  duration: string;
  wait: string;
  velocity: number;
}

export interface InstrumentTrack {
  name: string;
  plugin?: string;
  type: 'vst' | 'analog' | 'other';
  sourceSoundGoal: string;
  deepDive: ParameterSetting[];
  fxPlugins: DeepDivePlugin[];
  busSend?: string;
  loopGuide?: string;
  multiBandDetails?: {
    isEnabled: boolean;
    bandCount: number;
    splitFrequencies?: string[];
    reasoning?: string;
  };
  midiNotes?: {
    intro?: MidiNote[];
    verse?: MidiNote[];
    hook?: MidiNote[];
    bridge?: MidiNote[];
    outro?: MidiNote[];
  };
}

export interface BusTrack {
  name: string;
  tracksUsingBus: string[];
  fxPlugins: DeepDivePlugin[];
  multiBandDetails?: {
    isEnabled: boolean;
    bandCount: number;
    splitFrequencies?: string[];
    reasoning?: string;
  };
}

export interface GangstaVoxRecipe {
  trackingChain?: {
    unisonPlugin?: DeepDivePlugin;
    inserts: DeepDivePlugin[];
    aux1?: DeepDivePlugin[];
    aux2?: DeepDivePlugin[];
    dawRoutingInstructions?: string;
    dspUsageNote?: string;
  };
  vocalTracks: InstrumentTrack[];
  layeringStrategy: string;
  // Optional fields for MIDI export when used as vocalElements or gangstaVox
  midiNotes?: {
    intro?: MidiNote[];
    verse?: MidiNote[];
    hook?: MidiNote[];
    bridge?: MidiNote[];
    outro?: MidiNote[];
  };
  plugin?: string;
  deepDive?: ParameterSetting[];
  fxPlugins?: DeepDivePlugin[];
}

export type TensionLevel = 1 | 2 | 3 | 4 | 5;

export interface GenreProfile {
  name: string;
  densityMap: Record<TensionLevel, number>; // 0.0 to 1.0
  swingAmount: number; // 0.0 to 1.0
  probabilityMap: Record<string, number>; // e.g., 'kick': 0.8
  phrasingStyle: 'linear' | 'call-and-response' | 'evolving';
}

export interface DrumStep {
  step: number;
  velocity: number;
}

export interface DrumPattern {
  kick: {
    isDoubleTime?: boolean;
    steps: (number | DrumStep)[];
  };
  snare: {
    isClap: boolean;
    isDoubleTime?: boolean;
    steps: (number | DrumStep)[];
  };
  hiHat: {
    isDoubleTime: boolean;
    steps: (number | DrumStep)[];
  };
  velocityHumanized: boolean;
  swing: {
    kick: number;
    snare: number;
    hiHat: number;
  };
}

export interface BeatRecipe {
  title: string;
  style: string;
  bpm: number;
  description: string;
  artistTypes: string[];
  
  instruments: InstrumentTrack[];
  busses: BusTrack[];
  
  drumPatterns: {
    intro: DrumPattern;
    verse: DrumPattern;
    hook: DrumPattern;
    bridge: DrumPattern;
    outro: DrumPattern;
  };
  
  arrangement: Record<string, string>;
  
  masterPlugins: DeepDivePlugin[];
  layeringStrategy?: string;
  
  isGangstaVox?: boolean;
  gangstaVox?: GangstaVoxRecipe;
  
  recommendedScale?: string;
  chordProgression?: string;
  mixingAdvice?: string;
  vocalElements?: GangstaVoxRecipe;
  drumKitAdvice?: {
    kick: string;
    snare: string;
    toms: string;
  };
  audioBase64?: string;
  geminiFileUri?: string;
  mimeType?: string;
  specificHelp?: {
    query?: string;
    advice?: string;
    recommendedChain?: DeepDivePlugin[];
    role?: 'user' | 'model';
    content?: string;
  }[];
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
}

export interface SharedSession {
  recipe: SavedRecipe; // Primary recipe
  recipes?: SavedRecipe[]; // All recipes in vault
  critiques?: SavedCritique[]; // All critiques in vault
  senderPlugins: VSTPlugin[];
  senderAnalogInstruments?: Hardware[];
  senderAnalogHardware?: Hardware[];
  senderDrumKits?: Hardware[];
  senderName: string;
}

export interface SavedRecipe extends BeatRecipe {
  id: string;
  savedAt: string;
  bubbleColor: string;
  folderId?: string;
  linkedPresetId?: string;
}

export interface HistoryItem extends BeatRecipe {
  generatedAt: string;
}

export interface TutorialProgress {
  completedPhases: string[];
  currentPhase: string;
  currentStep: number;
  lastUpdated: string;
  isFullyCompleted: boolean;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  photo: string;
  termsAccepted?: boolean;
  termsAcceptedAt?: string;
  firebaseToken?: string;
  credits?: number;
  role?: string;
  purchasedStemSlots?: number;
}

export interface MixCritique {
  id: string;
  title: string;
  overallFeedback: string;
  strengths: string[];
  weaknesses: string[];
  estimatedBPM?: number;
  actionPlan: {
    targetStem?: string;
    issue: string;
    solution: string;
    recommendedChain: DeepDivePlugin[];
    multiBandDetails?: {
      isEnabled: boolean;
      bandCount: number;
      splitFrequencies: string[];
      reasoning: string;
    };
  }[];
  specificHelp?: {
    query?: string;
    advice?: string;
    recommendedChain?: DeepDivePlugin[];
    multiBandDetails?: {
      isEnabled: boolean;
      bandCount: number;
      splitFrequencies: string[];
      reasoning: string;
    };
    role?: 'user' | 'model';
    content?: string;
  }[];
  deviationMetrics?: {
    metric: string;
    deviation: string;
    description: string;
  }[];
  isGangstaVox?: boolean;
  audioBase64?: string;
  audioUrl?: string;
  geminiFileUri?: string;
  mimeType?: string;
  previousCritiqueId?: string;
  reCritiqueContext?: string;
}

export interface RecommendationResponse {
  recipes: BeatRecipe[];
}

export type AppTheme = 'coldest' | 'crazy-bird' | 'hustle-time' | 'chef-mode';

export type GrillStyle = 'diamond' | 'aquabberry-diamond' | 'gold' | 'opal' | 'rose-gold' | 'blue-diamond';

export type KnifeStyle = 'standard' | 'gold' | 'bloody' | 'adamant' | 'mythril' | 'samuels-saber' | 'dark-saber' | 'steak-knife';

export type PendantStyle = 'silver' | 'gold' | 'rose-gold' | 'diamond' | 'blue-diamond' | 'none';

export type ChainStyle = 'silver' | 'gold' | 'rose-gold' | 'diamond' | 'blue-diamond' | 'none';

export type DuragStyle = 'standard' | 'royal-green' | 'dragonball-purple' | 'chef-hat' | 'sound-ninja' | 'rasta';

export interface SavedCritique extends MixCritique {
  savedAt: string;
  folderId?: string;
}
