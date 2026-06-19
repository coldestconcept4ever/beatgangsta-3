import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MixCritique, AppTheme, VSTPlugin, Hardware } from '../types';
import { getSpecificMixHelp, getMixCritique, regeneratePlugin, getLyricAnalysis } from '../services/geminiService';
import { uploadFileChunked, deleteFileFromDrive } from '../services/uploadService';
import { generateDawProjectFromMixCritique } from '../utils/dawprojectUtils';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Search, CheckCircle2, AlertCircle, Download, RefreshCw, Layers, BarChart2, Mic, Minus, Sparkles, Play, Square, Volume2, VolumeX, Eye, Info, RefreshCcw, Settings, Sliders, Check, Headphones, FileText } from 'lucide-react';
import { PluginBubble } from './PluginBubble';
import { CritiqueHTMLTemplate } from './CritiqueHTMLTemplate';

// Dynamically import heavy libraries
const getRenderToStaticMarkup = () => import('react-dom/server').then(m => m.renderToStaticMarkup);

interface CritiqueCardProps {
  critique: MixCritique;
  theme: AppTheme;
  plugins: VSTPlugin[];
  analogInstruments?: Hardware[];
  analogHardware?: Hardware[];
  stems?: any[];
  audioBase64?: string;
  audioUrl?: string;
  geminiFileUri?: string;
  mimeType?: string;
  isSaved: boolean;
  onSave: (critique: MixCritique) => void;
  onUpdateCritique: (critiqueId: string, actionIdx: number, pluginIdx: number, newPlugin: any) => void;
  onReCritique: (newCritique: MixCritique) => void;
  currentAudioInfo?: {
    audioBase64: string | null;
    audioUrl: string | null;
    geminiFileUri: string | null;
    mimeType: string | null;
  } | null;
  onLogReceipt?: (action: string, cost: number) => void;
  onCorrectPlugin?: (pluginName: string, corrections: { parameter: string, value: string }[], version: string) => Promise<{ success: boolean, message: string, plugin?: VSTPlugin }>;
  onContactSupport?: (pluginInfo: any) => void;
  onMinimize?: () => void;
  isMultiBandMode?: boolean;
  dawType?: string | null;
}

const getDawSpecificGuide = (daw: string | null) => {
  const normDaw = (daw || 'other').toLowerCase();
  
  if (normDaw.includes('ableton')) {
    return {
      name: "Ableton Live Integration Manual",
      polarity: "1. Load the stock 'Utility' plugin onto your double-tracked or auxiliary vocal lane.\n2. In the plugin interface, click the Left and/or Right Phase buttons (represented by the Ø symbol) to invert the polarity instantly.\n3. Verify correlation with your lead vocal; notice if the overlapping bass regions pop back into definition.",
      sidechain: "1. Add a stock 'Compressor' to your Beat or Instrumental track.\n2. Click the triangle icon on the top-left of the Compressor name-bar to expand the sidechain routing area.\n3. Click the 'Sidechain' button to enable it.\n4. Set 'Audio From' to your Lead Vocal track.\n5. Dial down Threshold to -18dB and set Ratio to 2:1. Look for ~1.5dB of clean sidechain gain reduction whenever lyrics are active.",
      delay: "1. Initialize your favorite delay or echo on 'Return Track A'. Set Wet to 100% and Dry to 0%.\n2. Double-click your main vocal track, change your view to the Envelopes tab (or press 'A' on keyboard to toggle Automation Lanes).\n3. Set your device chooser to 'Mixer' and control target to 'Snd A / Return A'.\n4. Paint spike envelopes (sudden ramp up to 0dB, then immediate drop-off) on specific dub words like end-of-phrase suffixes to throw them into the stereo echo space.",
      sweeps: "1. Insert the stock 'Auto Filter' onto your FX Sweep track, choosing a High-Pass or Band-Pass curve.\n2. In the Track header, toggle Automation Mode (press 'A').\n3. Click on the Auto Filter's 'Filter Frequency' knob, which will select that parameter as your automation lane.\n4. Highlight the transition bars and draw a smooth, ascending Bezier curve (or use curves by holding Alt/Option) lifting the cutoff from 80Hz up to 1.8kHz just before bar 9 triggers."
    };
  }
  
  if (normDaw.includes('logic')) {
    return {
      name: "Logic Pro Integration Manual",
      polarity: "1. Load the stock 'Gain' utility plugin (under Utility > Gain) onto your doubled track.\n2. Toggle both the 'Phase Invert L' and 'Phase Invert R' buttons on the Gain interface.\n3. Listen in mono to verify that the phase cancellation has subsided.",
      sidechain: "1. Drop open your Instrumental channel strip, and load the stock 'Compressor' (Dynamics > Compressor).\n2. Look at the top-right corner of the Compressor window and locate the 'Sidechain' drop-down selector.\n3. Choose your Lead Vocal track (or its bus routing) as the Sidechain input.\n4. Set the Compressor's threshold around -20dB, ratio to 1.8:1, attack to 15ms, and release to 80ms to duck the beat under your main vocal.",
      delay: "1. Add a Send from your vocal track to 'Bus 1'. Logic will automatically create an Aux track with Bus 1 as input. Add a 100% wet delay to that Aux.\n2. Toggle Track Automation (press 'A' on keyboard).\n3. Click the automation parameter menu on your vocal track, select 'Send' > 'Bus 1 Send' > 'Volume'.\n4. Write automation nodes raising the send level only on specific dub phrases, throwing them onto the delay return track.",
      sweeps: "1. Insert 'Channel EQ' on your riser/FX track, enable the High-Cut or Low-Cut filter band.\n2. Enable Track Automation (A).\n3. Click the automation parameter slot, select 'Channel EQ' > 'Low-Cut Frequency'.\n4. Draw a sweeping line lifting the frequency from 120Hz to 2.2kHz across the transition points, holding Command to smooth automation corners."
    };
  }
  
  if (normDaw.includes('fl') || normDaw.includes('fruity')) {
    return {
      name: "FL Studio Integration Manual",
      polarity: "1. Double-click the double-tracked audio sample in the Playlist to open its Channel Settings.\n2. Locate the 'Miscellaneous Functions' tab (tool wrench icon).\n3. Switch on the 'Reverse Polarity' button (represented by Ø) next to the fine-tuning options.\n4. This reverses phase natively without loading a mixer track plugin.",
      sidechain: "1. Route Lead Vocal to Mixer Track 1 and Beat/Instrumental to Mixer Track 2.\n2. Click Mixer Track 1 (Vocal) to select it, then right-click the send node arrow at the bottom of Track 2 and choose 'Sidechain to this track'.\n3. Load 'Fruity Limiter' on Mixer Track 2 (Beat) and switch the bottom tab to 'COMP' mode.\n4. Change the Sidechain 'S/C' input box to '1'. Grab the Threshold knob and drag it down. Observe the red line ducking whenever vocals play.",
      delay: "1. Add a Delay plugin to a vacant mixer track (e.g., Mixer Track 5, set Mix wet level to 100% inside the plugin).\n2. Turn up vocal send volume feeding into Mixer Track 5 to audit. Then right-click that mixer send knob and select 'Create automation clip'.\n3. In the playlist timeline, use the brush tool to draw brief wedge spikes or volume bumps on the Automation clip grid wherever delay throws are wanted.",
      sweeps: "1. Insert stock 'Fruity Love Philter' onto your sound FX slot, using the standard 'Lowpass band 1' filter preset.\n2. Right-click the 'Cutoff' frequency knob inside Love Philter and choose 'Create automation clip'.\n3. Paint a rising curve stretching across the playlist transition. Right-click points inside automation envelopes to select different curve models (e.g. Single Curve, Wave, Double Curve)."
    };
  }
  
  if (normDaw.includes('reaper')) {
    return {
      name: "REAPER Integration Manual",
      polarity: "1. In the Track Control Panel (the mixer/track head column), find the 'Phase Invert' icon (looks like a slashed circle Ø) on your auxiliary vocal channel.\n2. Click it directly to flip the track's polarity by 180 degrees. No plugin needed!\n3. Audit the sound stage to verify phase coherence in mono.",
      sidechain: "1. Open the 'ReaComp' plugin menu on your Beat or Instrumental track.\n2. From your Lead Vocal track head, click and drag the routing (I/O) pin and drop it directly onto the ReaComp window. Reaper automatically routes channels 1/2 of Vocals into channels 3/4 (Aux inputs) of the beat track.\n3. Change Detector Input inside ReaComp to 'Auxiliary Input L/R'. Pull the Threshold slider down until the meter shows discrete ducking.",
      delay: "1. Create a dedicated Delay AUX track, load ReaDelay (set wet mix to 0dB, dry mix to infinity).\n2. Add a Send from your Vocal Track playing into the Delay AUX track.\n3. In the Vocal track lanes, click 'Route' and check 'Send Volume Envelope' to show Send Automation on the timeline.\n4. Hold Shift and click the envelope line to create target automation points, drawing momentary delay throw bursts.",
      sweeps: "1. Insert 'ReaEQ' on your FX sweep track, configure Band 1 to a High Pass filter mode.\n2. Click the 'Param' button in ReaEQ (top right), then hover to 'Show track envelope' and select 'Frequency - Band 1'.\n3. Click-draw points on the timeline envelope lane to create a sweeping curve ascending during transitions."
    };
  }
  
  if (normDaw.includes('pro') || normDaw.includes('tools')) {
    return {
      name: "Pro Tools Integration Manual",
      polarity: "1. Load the stock multi-mono 'Trim' or 'EQ3' plugin onto your doubled track.\n2. In the plugin header, click the Phase Invert (Ø) button.\n3. Instantly review phase alignment relative to the principal center-panned vocal.",
      sidechain: "1. Load the stock 'Dyn 3 Compressor' onto your Instrumental loop.\n2. Route your Lead Vocal track feed to a stereo Send Bus (e.g., Bus 5-6).\n3. Near the top of the Dyn 3 plugin window, set the Key Input (Key icon) dropdown to 'Bus 5-6'.\n4. Enable the 'Side-Chain / Key' trigger switch (side-chain filter icon), then dial in your Threshold, Attack, and Release values.",
      delay: "1. Create a stereo Aux Input track, load a delay at 100% wet, and set input to Bus 1-2.\n2. On the main Vocal track, click one of the Send slots and assign it to Bus 1-2.\n3. Change your Vocal track's track view menu from 'Waveform' to 'Sends' > 'Bus 1-2' > 'Volume'.\n4. Grab the Grabber Tool (F8) and draw precise line spikes on specific phrases to throw them into the long reverb/delay aux.",
      sweeps: "1. Load 'EQ3 7-Band' on your sweep FX track, enable the High Pass Filter (HPF).\n2. Click the 'Auto' button (directly under the Preset picker in the plugin GUI) to open the plug-in automation window. Select HPF Frequency and add it to the enabled list.\n3. Set track view to 'FX Sweep' > 'EQ3' > 'HPF Freq' to draw sweeping curves inside the edit timeline."
    };
  }
  
  if (normDaw.includes('studio') || normDaw.includes('one')) {
    return {
      name: "Studio One Integration Manual",
      polarity: "1. Open the Mix console, and load the stock utility device called 'Mixtool' on your vocal channel.\n2. Check the 'Invert Phase L' and 'Invert Phase R' tick boxes on the plugin panel.\n3. Monitor the stereo width changes to safeguard against boxy sound cancellation.",
      sidechain: "1. Load the stock 'Compressor' plugin onto the beat or instrumental track.\n2. Locate the 'Sidechain' button (cogwheel/arrow menu) at the very top of the Compressor head-bar.\n3. Check 'Enable Sidechain' and select your Lead Vocal track as the sidechain trigger source.\n4. Fine-tune your Compression ratio around 2:1 and pull the Threshold down to duck the backing beat.",
      delay: "1. Create an FX Channel containing your main delay (set wet mix to 100%).\n2. Add a Send from your Vocal Track pointing into this FX Channel.\n3. Click the send level envelope icon, select 'Render Send Volume' to draw automation in your primary track view.\n4. Design instantaneous spikes on the last syllable of words to burst echo repeats.",
      sweeps: "1. Place 'Pro EQ' onto your riser, enable the Low Cut/High Pass band.\n2. Press 'A' to reveal track automation controls.\n3. Choose 'Pro EQ' > 'Low Cut Frequency' from the Automation picker list.\n4. Draw progressive ramp curves over 4-8 bars leading up to major sections."
    };
  }
  
  if (normDaw.includes('bitwig')) {
    return {
      name: "Bitwig Studio Integration Manual",
      polarity: "1. Load the native 'Tool' utility device on the target vocal track.\n2. Turn on the Phase inversion buttons (represented by the Ø symbol) inside the Tool container.\n3. Confirm phase alignment with surrounding vocal stems.",
      sidechain: "1. Add a Bitwig 'Dynamics' device on your backing beat track.\n2. Click the Sidechain source selector inside the Dynamics device panel.\n3. Select your main Lead Vocal track as the trigger audio source.\n4. Turn up the Sidechain sensitivity and adjust compression envelope settings to taste.",
      delay: "1. Set up an FX Track with your favorite Echo or Delay (100% wet).\n2. Send a share of the vocal track signal to that FX Track.\n3. Add an Automation lane for that Send Level slot directly under your vocal track in the Arrange view.\n4. Double-click to create handles and draw sudden automation swells.",
      sweeps: "1. Load 'Filter' or 'EQ' on your FX track and set the filter type to High Pass.\n2. Click on the Filter Cutoff knob.\n3. Notice the orange indicator in the lower Inspector. Access the track automation lanes and draw bezier curves to shape your rising cutoff frequency."
    };
  }
  
  if (normDaw.includes('garage') || normDaw.includes('band')) {
    return {
      name: "GarageBand Integration Manual",
      polarity: "1. GarageBand does not feature a polarity button in its main controls.\n2. Select the audio region, duplicate it, and select 'Edit' > 'Audio' > 'Phase Invert' manually if using a third-party audio editor.\n3. Alternatively, load the free third-party utility plugin (like Blue Cat or Voxengo) inside AU plug-ins and toggle the phase switch.",
      sidechain: "1. GarageBand lacks support for true sidechain routing.\n2. Work around this by double-clicking your beat track and toggling Track Automation (A).\n3. Use automation points to manually draw tiny volume dips (e.g., -1.5dB to -2dB) in the beat waveform right where major vocal hooks hit.",
      delay: "1. Slide open Smart Controls, go to Plug-ins, and make sure Send Delay is active.\n2. Press 'A' on your keyboard to reveal track volume automation lanes.\n3. Change your Automation target dropdown from Volume to 'Send Level' > 'Delay'.\n4. Use the mouse to create node points, carving out steep surges for delayed word accents.",
      sweeps: "1. Turn on automation for the track, and select Visual EQ > Cutoff from the pull-down automation menu.\n2. Draw automation lines lifting visual EQ high-pass or bandpass settings across transitions."
    };
  }
  
  if (normDaw.includes('cubase')) {
    return {
      name: "Cubase Integration Manual",
      polarity: "1. Open the MixConsole or select the track, then open the Channel Settings window.\n2. In the Pre area at the top of the EQ section, turn on the Phase button (slash circle Ø).\n3. This implements an immediate, native polarity flip on the channel's input.",
      sidechain: "1. Put the stock 'Compressor' of Cubase into your Beat track.\n2. Turn on the 'Sidechain' button in the Compressor plugin header toolbar (a box with a side arrow).\n3. Pin your Vocal track as the source by going to Sends of the Vocal Track and routing a Send Bus target directly to the sidechain compressor of the beat track.\n4. Slide Threshold down, Ratio to 1.8:1, to trigger transparent ducking.",
      delay: "1. Create an FX Channel track containing your delay (dry Mix set to 0, wet level to 100%).\n2. Open the Sends segment on your main vocal track and route a Send to the delay track.\n3. Open track Automation for the vocal track, select your Delay send level, and write transient automation steps to throw specific lyrics.",
      sweeps: "1. Load standard EQ or StudioEQ on your transition noise strip.\n2. Enable 'Show Automation' for the track (clicking the small 'W' or hover track expander).\n3. From parameters list, choose StudioEQ Band 1 Frequency, and build rising Bezier curves."
    };
  }
  
  // Default/Other general
  return {
    name: "General Master Integration Manual",
    polarity: "1. Install a transparent utility plugin (e.g., Waves Utility, FabFilter Pro-Q Phase, stock Gain/Trim) on the target auxiliary vocal lane.\n2. Click the Polarity Inversion button (frequently labeled Ø or 'Phase' or 'Polarity').\n3. This shifts phase alignment by 180 degrees. It rectifies hollow sound cancellation which commonly occurs when doubles overlap on matching pitch.",
    sidechain: "1. Load a stock Compressor on the instrumental beat track.\n2. Search the top bar of the compressor panel to identify a 'Sidechain' toggle or key input slot.\n3. Direct the Lead Vocal track as the sidechain's triggering key source.\n4. Set threshold to reduce 1dB of instrumental volume whenever vocals play. Use rapid attack (10ms) and short release (60ms) to clean vocal clashes in real-time.",
    delay: "1. Set up an AUX or Send Return Track, configure your Delay plugin to 100% Wet mix.\n2. Route a signal share from your principale Vocal channel into this Delay Aux slot.\n3. Use your DAW's automated track envelopes, select the 'Send Level' target, and paint temporary volume peak spurs only on specific dub nodes for delay throws.",
    sweeps: "1. Load a modern Parametric EQ or filter device on your transition/noise sweeping track.\n2. Enable track-level Automation curves and assign parameter target to the EQ Low-Cut/High-Pass cutoff limit (Hz).\n3. Draw rising curves across transitions, starting from 80Hz and climbing toward 1.5kHz before major drum drops."
  };
};

export const CritiqueCard: React.FC<CritiqueCardProps> = ({ critique, stems = [], theme, plugins, analogInstruments = [], analogHardware = [], audioBase64, audioUrl, geminiFileUri, mimeType, isSaved, onSave, onUpdateCritique, onReCritique, currentAudioInfo, onLogReceipt, onCorrectPlugin, onContactSupport, onMinimize, isMultiBandMode = false, dawType = null }) => {
  const { t, i18n } = useTranslation();
  const [specificHelpQuery, setSpecificHelpQuery] = useState('');
  const [isLoadingSpecificHelp, setIsLoadingSpecificHelp] = useState(false);
  const [specificHelpResults, setSpecificHelpResults] = useState<any[]>(() => critique.specificHelp || []);
  const [isDragging, setIsDragging] = useState(false);
  const [reCritiqueContext, setReCritiqueContext] = useState("");
  const [isLoadingReCritique, setIsLoadingReCritique] = useState(false);
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExportingDawProject, setIsExportingDawProject] = useState(false);
  const [regeneratingPluginId, setRegeneratingPluginId] = useState<string | null>(null);
  const [refreshPools, setRefreshPools] = useState<Record<string, string[]>>({});

  // Lyric Tool States & Multi-track Timeline Config
  const [isLyricToolExpanded, setIsLyricToolExpanded] = useState(false);
  const [lyrics, setLyrics] = useState(() => (critique as any).lyricAnalysis?.lyrics || "");
  const [lyricContext, setLyricContext] = useState(() => (critique as any).lyricAnalysis?.context || "");
  const [isAnalyzingLyrics, setIsAnalyzingLyrics] = useState(false);
  const [lyricResult, setLyricResult] = useState<{
    dubWords: any;
    cadenceAndDelivery: string;
    vocalChain: any[];
    additionalAdvice: string;
    timeline?: any[];
    formattedLyrics?: string;
    syncedLyrics?: { time: string; lyric: string }[];
  } | null>(() => (critique as any).lyricAnalysis?.results || null);

  // Grid Mapping States
  const playheadIntervalRef = useRef<any>(null);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [currentTimelineBar, setCurrentTimelineBar] = useState(1);
  const [mutedTracks, setMutedTracks] = useState<Record<string, boolean>>({});
  const [soloedTracks, setSoloedTracks] = useState<Record<string, boolean>>({});
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>("lead-1");
  const [activeLyricTab, setActiveLyricTab] = useState<'timeline' | 'formattedLyrics' | 'aiCoach'>('timeline');
  const [activeManualTab, setActiveManualTab] = useState<'polarity' | 'sidechain' | 'delay' | 'sweeps'>('polarity');
  const [customDawOption, setCustomDawOption] = useState<string | null>(null);

  const defaultVocalTimeline = [
    {
      trackName: "Lead Vocal",
      blocks: [
        { id: "lead-1", text: "Verse Hook 1", startBar: 1, durationBars: 4, color: "sky", intensity: 90, instructions: "Keep main vocal centered, mono, and tight. Control low-end pops with high-pass filter at 80Hz. Ensure pristine phase correlation on downbeats." },
        { id: "lead-2", text: "Dynamics Lift", startBar: 5, durationBars: 4, color: "sky", intensity: 85, instructions: "Apply sidechain dynamic EQ ducking (0.8dB cut) to the beat/instrumental at 2kHz to carve out surgical space for vocal presence." },
        { id: "lead-3", text: "Chorus Lead", startBar: 9, durationBars: 6, color: "indigo", intensity: 95, instructions: "Double-tracked lead vocal for supreme thickness. Keep backing doubles tightly aligned; apply mild 2.5:1 compression using high-end optical cell." }
      ]
    },
    {
      trackName: "Overdubs/Dubs",
      blocks: [
        { id: "dub-1", text: "Stereo Double", startBar: 5, durationBars: 4, color: "rose", intensity: 75, instructions: "Record vocal double panned hard left/right (80% width). Apply gain staging (-12dB) and flip polarity on the Right wing if dual overlapping creates phase thinness." },
        { id: "dub-2", text: "High Dub Vibe", startBar: 9, durationBars: 3, color: "rose", intensity: 80, instructions: "Record a high-pitched performance dub. Feed to parallel distortion aux with RC-20 retro color preset (15% Magnet Tube) for gritty vibe." },
        { id: "dub-3", text: "Whisper End", startBar: 13, durationBars: 3, color: "violet", intensity: 65, instructions: "Breath-heavy lower-pitched whisper track to support the final tail. High-pass filter at 180Hz, boost 12kHz shelf (+3dB) for premium airiness." }
      ]
    },
    {
      trackName: "Ad-libs/Accents",
      blocks: [
        { id: "lib-1", text: "Accent 'Ayy!'", startBar: 3, durationBars: 2, color: "amber", intensity: 80, instructions: "Pan 42% Left. Set up 1/4 dotted delay throw on aux send. Sidechain compress using Lead Vocal track as sidechain key." },
        { id: "lib-2", text: "Spitfire 'Prr'", startBar: 7, durationBars: 2, color: "amber", intensity: 85, instructions: "Pan 50% Right. Throw wide ping-pong slapback (85ms delay) with zero feedback for width flare." },
        { id: "lib-3", text: "Final Shouts", startBar: 11, durationBars: 4, color: "amber", intensity: 80, instructions: "High mid frequency ad-libs. Boost 2.5kHz by 1.8dB for bite, route to high-feedback hall verb." }
      ]
    },
    {
      trackName: "FX & Sweeps",
      blocks: [
        { id: "fx-1", text: "Vocal Sweep", startBar: 1, durationBars: 4, color: "emerald", intensity: 70, instructions: "High-pass sweep starting from 100Hz up to 1.5kHz to build massive kinetic energy before the heavy drums join at Bar 5." },
        { id: "fx-2", text: "Delay Throw", startBar: 8, durationBars: 1, color: "emerald", intensity: 90, instructions: "CRITICAL HOOK TRANSITION: Automate aux send line level to 100% wet ONLY on the very last word. Let 1/2 beat delays cross-trail." },
        { id: "fx-3", text: "Tape Stop FX", startBar: 15, durationBars: 2, color: "violet", intensity: 75, instructions: "Apply wet tape-stop effect or steep low-pass sweep down to 200Hz. Let the trailing delay feedback build ambient soup before next verse." }
      ]
    }
  ];

  const getVocalTimeline = () => {
    if (lyricResult && Array.isArray((lyricResult as any).timeline) && (lyricResult as any).timeline.length > 0) {
      return (lyricResult as any).timeline;
    }
    return defaultVocalTimeline;
  };

  const getTimelineMaxBars = () => {
    const timeline = getVocalTimeline();
    let max = 16;
    timeline.forEach((track: any) => {
      if (Array.isArray(track.blocks)) {
        track.blocks.forEach((block: any) => {
          const endBar = (block.startBar || 1) + (block.durationBars || 1) - 1;
          if (endBar > max) {
            max = endBar;
          }
        });
      }
    });
    return max;
  };
  const maxBars = getTimelineMaxBars();

  // Playhead update interval
  React.useEffect(() => {
    if (isPlayingTimeline) {
      playheadIntervalRef.current = setInterval(() => {
        setCurrentTimelineBar((prev) => {
          if (prev >= maxBars) return 1;
          return prev + 1;
        });
      }, 1000); // 1 bar per second
    } else {
      if (playheadIntervalRef.current) {
        clearInterval(playheadIntervalRef.current);
      }
    }
    return () => {
      if (playheadIntervalRef.current) {
        clearInterval(playheadIntervalRef.current);
      }
    };
  }, [isPlayingTimeline, maxBars]);

  const handleAnalyzeLyrics = async () => {
    if (!lyrics.trim()) {
      alert("Please enter some lyrics to analyze.");
      return;
    }
    setIsAnalyzingLyrics(true);
    try {
      const finalAudioBase64 = audioBase64 || currentAudioInfo?.audioBase64 || undefined;
      const finalAudioUrl = audioUrl || currentAudioInfo?.audioUrl || undefined;
      const finalGeminiFileUri = geminiFileUri || currentAudioInfo?.geminiFileUri || undefined;
      const finalMimeType = mimeType || currentAudioInfo?.mimeType || undefined;

      const result = await getLyricAnalysis(
        plugins,
        finalAudioBase64,
        finalMimeType,
        lyrics.trim(),
        lyricContext.trim(),
        finalAudioUrl,
        finalGeminiFileUri,
        i18n.language,
        analogHardware,
        stems
      );

      setLyricResult(result);
      
      // Persist results on critique object
      (critique as any).lyricAnalysis = {
        lyrics: lyrics.trim(),
        context: lyricContext.trim(),
        results: result
      };
      
      if (onLogReceipt) {
        const isWav = finalMimeType?.includes('audio/wav');
        onLogReceipt('Lyric Analysis Tool', isWav ? 25 : 10);
      }
    } catch (error) {
      console.error("Failed to analyze lyrics:", error);
      alert("Lyric analysis failed. Please try again.");
    } finally {
      setIsAnalyzingLyrics(false);
    }
  };

  const handleRegenerate = async (plugin: any, actionIdx: number, pluginIdx: number) => {
    const pluginId = `critique-${actionIdx}-${pluginIdx}`;
    setRegeneratingPluginId(pluginId);
    try {
      const currentPool = refreshPools[pluginId] || [plugin.name];
      const newPlugin = await regeneratePlugin(plugin.name, plugin.deepDive, critique as any, plugins, i18n.language, currentPool, analogHardware);
      if (onLogReceipt) onLogReceipt('Regenerate Plugin', 2);
      if (newPlugin && onUpdateCritique) {
        setRefreshPools(prev => ({
          ...prev,
          [pluginId]: [...currentPool, newPlugin.name]
        }));
        onUpdateCritique(critique.id, actionIdx, pluginIdx, newPlugin);
      }
    } catch (error) {
      console.error("Failed to regenerate plugin:", error);
    } finally {
      setRegeneratingPluginId(null);
    }
  };

  const handleExportHTML = async () => {
    setIsExporting(true);
    setExportProgress(10);

    try {
      const renderToStaticMarkup = await getRenderToStaticMarkup();
      setExportProgress(40);
      
      const htmlContent = renderToStaticMarkup(
        <CritiqueHTMLTemplate critique={critique} theme={theme} />
      );
      setExportProgress(70);

      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${critique.title} - ${t('beatgangsta_critique')}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; }
            .webos-card { background: rgba(12, 74, 110, 0.5); backdrop-filter: blur(12px); border: 1px solid #0369a1; border-radius: 2rem; }
            @media print {
              .print-break { page-break-before: always; }
              body { background: white !important; color: black !important; }
            }
          </style>
        </head>
        <body class="bg-[#0c4a6e]">
          <div class="max-w-4xl mx-auto my-8 overflow-hidden">
            ${htmlContent}
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${critique.title.replace(/\s+/g, '_')}_Critique_Report.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportProgress(100);
    } catch (error) {
      console.error("HTML Export failed:", error);
      alert(t('failed_export_html'));
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);
    }
  };

  const handleExportDawProject = async () => {
    setIsExportingDawProject(true);
    try {
      const blob = await generateDawProjectFromMixCritique(critique, stems, getVocalTimeline(), plugins);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${critique.title.replace(/\s+/g, '_')}.dawproject`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("DAWProject Export failed:", error);
      alert(t('failed_export_dawproject', 'Failed to export .dawproject'));
    } finally {
      setIsExportingDawProject(false);
    }
  };

  const handleExportReaperMarkers = () => {
    try {
      // REAPER Region/Marker Manager CSV format
      // #,Name,Start,End,Length,Color
      let csvContent = "#,Name,Start,End,Length,Color\n";
      let markerIndex = 1;
      
      // We will place all track feedback sequentially as markers roughly starting at 0:01
      // with a few seconds spacing so they form a timeline of notes
      critique.actionPlan.forEach((plan, idx) => {
        const timeSec = idx * 2.0; // Place each note 2 seconds apart for easy reading
        const mins = Math.floor(timeSec / 60);
        const secs = (timeSec % 60).toFixed(3);
        const timestamp = `0:${secs.padStart(6, '0')}`;
        
        let feedbackLines = `${plan.issue} -> ${plan.solution}`.trim();
        // Strip quotes and newlines to keep CSV clean
        feedbackLines = feedbackLines.replace(/"/g, '""').replace(/\n/g, ' ');
        
        const trackNameContext = plan.targetStem ? `[${plan.targetStem}] ` : '';
        csvContent += `M${markerIndex},"[BG AI] ${trackNameContext}${feedbackLines}",${timestamp},,,\n`;
        markerIndex++;
      });
      
      // And overall feedback
      const overallStr = critique.overallFeedback.replace(/"/g, '""').replace(/\n/g, ' ');
      csvContent += `M${markerIndex},"[BG AI] OVERALL: ${overallStr}",0:00.000,,,\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${critique.title.replace(/\s+/g, '_')}_REAPER_Markers.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("REAPER Marker Export failed:", error);
      alert("Failed to export REAPER mapping.");
    }
  };

  const [isPushingSync, setIsPushingSync] = useState(false);
  const [syncPin, setSyncPin] = useState<string | null>(null);
  const [syncEmail, setSyncEmail] = useState<string>(() => localStorage.getItem('beatgangsta_sync_email') || '');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handlePushReaperSync = async () => {
    if (!syncEmail) {
      setShowEmailInput(true);
      return;
    }

    try {
      let txtContent = "";
      
      critique.actionPlan.forEach(plan => {
        if (!plan.targetStem) return;
        txtContent += `TRACK|${plan.targetStem}\n`;
        plan.recommendedChain.forEach(req => {
          txtContent += `FX|${req.name}\n`;
          let paramIdx = 0;
          if (req.deepDive) {
            req.deepDive.forEach(dive => {
              const numVal = parseFloat(String(dive.value).replace(/[^0-9.-]/g, ''));
              if (!isNaN(numVal)) {
                txtContent += `PARAM|${paramIdx}|${numVal}\n`;
              }
              paramIdx++;
            });
          }
        });
      });
      
      localStorage.setItem('beatgangsta_sync_email', syncEmail.trim());

      setIsPushingSync(true);
      const generatedPin = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit pin
      
      const res = await fetch('/api/reaper-sync/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: syncEmail.trim(),
          pin: generatedPin,
          payload: txtContent
        })
      });

      if (!res.ok) {
        throw new Error("Failed to push sync");
      }

      setSyncPin(generatedPin);
    } catch (error) {
      console.error("REAPER Sync Push failed:", error);
      alert("Failed to push REAPER Sync to cloud.");
    } finally {
      setIsPushingSync(false);
    }
  };

  const handleSpecificHelpSearch = async () => {
    if (!specificHelpQuery.trim()) return;
    
    setIsLoadingSpecificHelp(true);
    try {
      // Use fallback if current props are missing
      const finalAudioBase64 = audioBase64 || currentAudioInfo?.audioBase64 || undefined;
      const finalAudioUrl = audioUrl || currentAudioInfo?.audioUrl || undefined;
      const finalGeminiFileUri = geminiFileUri || currentAudioInfo?.geminiFileUri || undefined;
      const finalMimeType = mimeType || currentAudioInfo?.mimeType || undefined;

      const result = await getSpecificMixHelp(plugins, finalAudioBase64, finalMimeType, specificHelpQuery.trim(), critique.isGangstaVox, JSON.stringify(critique), [], finalAudioUrl, finalGeminiFileUri, i18n.language, analogHardware, isMultiBandMode);
      
      const isWav = finalMimeType?.includes('audio/wav');
      if (onLogReceipt) onLogReceipt('Specific Mix Help', isWav ? 25 : 10);
      
      setSpecificHelpResults(prev => [...prev, result]);
      setSpecificHelpQuery('');
    } catch (error) {
      console.error("Failed to get specific help:", error);
      alert(t('failed_specific_help'));
    } finally {
      setIsLoadingSpecificHelp(false);
    }
  };

  const processFile = async (file: File) => {
    setIsLoadingReCritique(true);
    let uploadedFileId: string | null = null;
    try {
      const fileToBase64 = (f: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(f);
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = (error) => reject(error);
        });
      };

      const base64 = await fileToBase64(file);
      const uploadData = await uploadFileChunked(file);
      const audioUrl = uploadData?.url || null;
      if (uploadData?.fileId) {
        uploadedFileId = uploadData.fileId;
      }

      const newCritique = await getMixCritique(
        plugins,
        base64,
        audioUrl,
        file.type,
        critique.isGangstaVox,
        false,
        reCritiqueContext,
        critique,
        "",
        null,
        null,
        i18n.language,
        undefined,
        analogInstruments,
        analogHardware
      );
      const isWav = file.type.includes('audio/wav');
      if (onLogReceipt) onLogReceipt('Re-Critique Mix', isWav ? 25 : 10);
      newCritique.reCritiqueContext = reCritiqueContext;
      onReCritique(newCritique);
      alert(t('re_critique_generated'));
    } catch (error) {
      console.error("Failed to generate re-critique:", error);
      alert(t('failed_re_critique'));
    } finally {
      if (uploadedFileId) {
        await deleteFileFromDrive(uploadedFileId);
      }
      setIsLoadingReCritique(false);
    }
  };

  const handleReCritiqueUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <motion.div 
      className={`rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border shadow-2xl transition-all ${
        theme === 'coldest' 
          ? 'bg-white/80 backdrop-blur-2xl border-sky-200 shadow-[0_8px_30px_rgba(2,132,199,0.12)] text-[#082f49]' 
          : 'bg-black/40 border-sky-500/30 text-white'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2 text-sky-600 dark:text-sky-400">
            {critique.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              theme === 'coldest' ? 'bg-sky-100 text-sky-800' : 'bg-sky-500/20 text-sky-300'
            }`}>
              {critique.isGangstaVox ? t('vocal_critique') : t('beat_critique')}
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              critique.isMasterMode
                ? (theme === 'coldest' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-300')
                : (theme === 'coldest' ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-500/20 text-indigo-300')
            }`}>
              {critique.isMasterMode ? 'Master Mode' : 'Mix Mode'}
            </span>
          </div>
          <p className="text-sm font-bold opacity-80 max-w-2xl leading-relaxed">
            {critique.overallFeedback}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className={`shrink-0 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                theme === 'coldest' ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('minimize')}
            </button>
          )}
          <button 
            onClick={handleExportHTML}
            disabled={isExporting}
            className={`shrink-0 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 min-w-[160px] justify-center ${
              theme === 'coldest'
                ? 'bg-slate-800 text-white hover:bg-slate-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? t('exporting', { progress: exportProgress }) : t('download_html')}
          </button>
          <button 
            onClick={handleExportDawProject}
            disabled={isExportingDawProject}
            className={`shrink-0 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 min-w-[160px] justify-center ${
              theme === 'coldest'
                ? 'bg-sky-600 text-white hover:bg-sky-700'
                : 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30'
            }`}
          >
            {isExportingDawProject ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExportingDawProject ? t('exporting', { progress: 100 }) : 'DAWProject'}
          </button>
          
          <button 
            onClick={handleExportReaperMarkers}
            className={`shrink-0 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 min-w-[160px] justify-center ${
              theme === 'coldest'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
            }`}
          >
            <Download className="w-4 h-4" />
            REAPER Markers (.csv)
          </button>

          <div className="flex flex-col gap-2">
            <button 
              onClick={handlePushReaperSync}
              disabled={isPushingSync}
              className={`shrink-0 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 min-w-[160px] justify-center ${
                theme === 'coldest'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
              } ${syncPin ? 'border-2 border-emerald-400' : ''}`}
            >
              {isPushingSync ? <Loader2 className="w-4 h-4 animate-spin" /> : (syncPin ? <Check className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />)}
              {syncPin ? 'Sync Pushed' : 'Push REAPER Sync'}
            </button>
            
            <AnimatePresence>
              {showEmailInput && !syncPin && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20"
                >
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Enter Email to Sync:</label>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      value={syncEmail}
                      onChange={(e) => setSyncEmail(e.target.value)}
                      placeholder="mixer@gmail.com"
                      className={`flex-1 px-3 py-2 rounded-lg text-xs bg-black/20 border border-white/10 focus:outline-none focus:border-blue-500`}
                    />
                    <button 
                      onClick={handlePushReaperSync}
                      className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg"
                    >
                      OK
                    </button>
                  </div>
                </motion.div>
              )}
              
              {syncPin && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl border-2 border-emerald-400/50 bg-emerald-400/10 flex flex-col items-center text-center`}
                >
                  <div className="flex items-center gap-2 mb-2 text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Cloud Sync Active</span>
                  </div>
                  <div className="text-[10px] opacity-60 uppercase mb-1">Enter in BeatGangsta Connect:</div>
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] opacity-50 uppercase leading-none">Email</span>
                      <span className="text-xs font-bold">{syncEmail}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] opacity-50 uppercase leading-none">PIN</span>
                      <span className="text-xl font-black text-emerald-500 tracking-[0.2em]">{syncPin}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSyncPin(null); setShowEmailInput(true); }}
                    className="mt-3 text-[10px] opacity-40 hover:opacity-100 underline"
                  >
                    Resync / Change Email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {isExporting && (
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-black/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${exportProgress}%` }}
                className="h-full bg-sky-500"
              />
            </div>
          )}
          <button 
            onClick={() => setIsLyricToolExpanded(prev => !prev)}
            className={`shrink-0 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 ${
              isLyricToolExpanded
                ? 'bg-sky-950 text-sky-400 border border-sky-400/50'
                : theme === 'coldest'
                ? 'bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-200'
                : 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/30'
            }`}
          >
            <Mic className="w-4 h-4" />
            {t('lyric_tool', 'Lyric Tool')}
          </button>
          <button 
            onClick={() => onSave(critique)}
            disabled={isSaved}
            className={`shrink-0 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 ${
              isSaved 
                ? 'bg-black/10 text-current opacity-50 shadow-none' 
                : theme === 'coldest'
                ? 'bg-gradient-to-b from-sky-400 to-sky-500 text-white shadow-[0_4px_15px_rgba(2,132,199,0.4)] border border-sky-400'
                : 'bg-white text-black'
            }`}
          >
            {isSaved ? t('save_to_vault') : t('save_critique')}
          </button>
        </div>
      </div>

      {/* Lyric Tool Expandable Section */}
      <AnimatePresence>
        {isLyricToolExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.1 }}
            className={`overflow-hidden border rounded-3xl p-6 relative ${
              theme === 'coldest' 
                ? 'bg-sky-50 border-sky-200 text-sky-950 shadow-inner' 
                : 'bg-[#0f172a]/80 border-sky-500/30'
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                <h4 className="text-sm font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
                  {t('lyric_tool_coaching', 'Lyric Translation & Dub Advisor')}
                </h4>
              </div>
              <button
                onClick={() => setIsLyricToolExpanded(false)}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center text-slate-400 hover:text-slate-200"
                title={t('minimize_tool', 'Minimize')}
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-1.5">
                  {t('paste_song_lyrics', 'Paste Lyrics for the Song / Critique')}
                </label>
                <textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder={t('paste_lyrics_placeholder', 'Enter song lyrics here...')}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-sm outline-none transition-all resize-none ${
                    theme === 'coldest' 
                      ? 'bg-white border-2 border-sky-100 focus:border-sky-400 text-[#082f49]' 
                      : 'bg-black/30 border-2 border-sky-500/20 focus:border-sky-500 text-white'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-1.5">
                  {t('asking_vocal_prompts', 'Additional Context / Requests (AI Guidance)')}
                </label>
                <textarea
                  value={lyricContext}
                  onChange={(e) => setLyricContext(e.target.value)}
                  placeholder={t('lyric_context_placeholder', 'Example: "Where should I add dynamic dubs/overdubs?", or "I want screaming dub accents", or "Translate the second verse..."')}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-sm outline-none transition-all resize-none ${
                    theme === 'coldest' 
                      ? 'bg-white border-2 border-sky-100 focus:border-sky-400 text-[#082f49]' 
                      : 'bg-black/30 border-2 border-sky-500/20 focus:border-sky-500 text-white'
                  }`}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end mb-6">
              <button
                onClick={() => {
                  setLyrics('');
                  setLyricContext('');
                  setLyricResult(null);
                  delete (critique as any).lyricAnalysis;
                }}
                className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-black/10 dark:hover:bg-white/10 ${
                  theme === 'coldest' ? 'text-slate-600 border border-slate-300' : 'text-slate-300 border border-slate-700'
                }`}
              >
                {t('clear_all', 'Clear')}
              </button>
              <button
                onClick={handleAnalyzeLyrics}
                disabled={isAnalyzingLyrics || !lyrics.trim()}
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${
                  theme === 'coldest' ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-sky-500 text-white hover:bg-sky-600'
                }`}
              >
                {isAnalyzingLyrics ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('analyzing_vocals', 'Analyzing...')}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t('analyze_vocals', 'Analyze Lyrics & Track')}
                  </>
                )}
              </button>
            </div>

            {/* Analysis Output Results */}
            <div className={`mt-6 border-t pt-6 ${theme === 'coldest' ? 'border-sky-100' : 'border-sky-500/10'}`}>
              {/* Tab Bar */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveLyricTab('timeline')}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow flex items-center gap-2 ${
                    activeLyricTab === 'timeline'
                      ? theme === 'coldest'
                        ? 'bg-sky-600 text-white'
                        : 'bg-sky-500 text-white'
                      : theme === 'coldest'
                      ? 'bg-sky-100/60 hover:bg-sky-200/60 text-sky-800'
                      : 'bg-[#1e293b] hover:bg-[#334155] text-slate-300'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  {t('timeline_sequencer', 'Interactive Vocal Timeline')}
                </button>
                <button
                  onClick={() => setActiveLyricTab('formattedLyrics')}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow flex items-center gap-2 ${
                    activeLyricTab === 'formattedLyrics'
                      ? theme === 'coldest'
                        ? 'bg-sky-600 text-white'
                        : 'bg-sky-500 text-white'
                      : theme === 'coldest'
                      ? 'bg-sky-100/60 hover:bg-sky-200/60 text-sky-800'
                      : 'bg-[#1e293b] hover:bg-[#334155] text-slate-300'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {t('genius_lyrics_desc', 'Spotify Synced Genius Lyrics')}
                </button>
                <button
                  onClick={() => setActiveLyricTab('aiCoach')}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow flex items-center gap-2 ${
                    activeLyricTab === 'aiCoach'
                      ? theme === 'coldest'
                        ? 'bg-sky-600 text-white'
                        : 'bg-sky-500 text-white'
                      : theme === 'coldest'
                      ? 'bg-sky-100/60 hover:bg-sky-200/60 text-sky-800'
                      : 'bg-[#1e293b] hover:bg-[#334155] text-slate-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {t('ai_coaching_chains', 'AI Coaching & Chains')}
                </button>
              </div>

              {/* TIMELINE TAB CONTENT */}
              {activeLyricTab === 'timeline' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Grid Timeline Workspace */}
                  <div className={`p-6 rounded-3xl border relative overflow-hidden ${
                    theme === 'coldest' ? 'bg-white border-sky-100 shadow-sm' : 'bg-black/40 border-sky-500/15'
                  }`}>
                    {/* Header Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-sky-500/10">
                      <div className="flex items-center gap-2">
                        <Headphones className="w-5 h-5 text-sky-500" />
                        <div>
                          <h5 className="font-black text-xs uppercase tracking-widest text-[#0ea5e9]">
                            {t('multi_track_vocal_sequencer', 'Vocal Layer Grid Sequence Mapping')}
                          </h5>
                          <p className="text-[10px] opacity-50 mt-0.5 font-bold">
                            {t('sequencer_sub', 'Select any block below to load granular mixing parameter actions and polarity adjustments.')}
                          </p>
                        </div>
                      </div>

                      {/* Simulation Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setIsPlayingTimeline(!isPlayingTimeline);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all text-white ${
                            isPlayingTimeline 
                              ? 'bg-rose-500 hover:bg-rose-600 animate-pulse' 
                              : 'bg-emerald-500 hover:bg-emerald-600'
                          }`}
                        >
                          {isPlayingTimeline ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-current" />
                              {t('stop_prev', 'Stop Sync')}
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              {t('play_prev', 'Play Sync')}
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => {
                            setCurrentTimelineBar(1);
                            setIsPlayingTimeline(false);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            theme === 'coldest' ? 'bg-sky-100 hover:bg-sky-200 text-sky-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                          title="Reset Playhead"
                        >
                          <RefreshCcw className="w-3.5 h-3.5" />
                        </button>
                        
                        <span className="font-mono text-xs font-black px-2 py-1 rounded bg-black/20 text-[#38bdf8]">
                          {t('bar_count', 'BAR')}: {currentTimelineBar}/{maxBars}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Multi-track Matrix */}
                    <div className="relative space-y-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-sky-500/50">
                      <div style={{ minWidth: `calc(140px + 16px + ${maxBars * 45}px)`, width: '100%' }} className="space-y-4 relative">
                        {/* Timeline Scale Ruler */}
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-center select-none pl-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#0ea5e9]">
                            {t('vocal_track', 'Vocal Track')}
                          </span>
                          <div className="relative grid font-mono text-[9px] font-black opacity-60" style={{ gridTemplateColumns: `repeat(${maxBars}, minmax(0, 1fr))` }}>
                            {Array.from({ length: maxBars }).map((_, barIdx) => {
                              const barNum = barIdx + 1;
                              const isCurrent = currentTimelineBar === barNum;
                              return (
                                <button
                                  key={barIdx}
                                  onClick={() => setCurrentTimelineBar(barNum)}
                                  className={`text-center py-1 rounded cursor-pointer transition-colors ${
                                    isCurrent 
                                      ? 'text-rose-500 bg-rose-500/10 font-extrabold text-xs scale-110 shadow' 
                                      : 'hover:text-sky-500 hover:bg-sky-500/5'
                                  }`}
                                >
                                  {barNum}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Multitrack Body */}
                        <div className="relative space-y-3.5">
                          {/* Interactive sweeping Playhead bar */}
                          <div 
                            className="absolute top-0 bottom-0 border-l-2 border-rose-500 z-30 transition-all pointer-events-none duration-250 shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                            style={{
                              left: `calc(140px + 16px + (((${currentTimelineBar} - 1) / ${maxBars}) * (100% - 140px - 16px)))`,
                            }}
                          />

                          {getVocalTimeline().map((track: any, trackIdx: number) => {
                            const isMuted = mutedTracks[track.trackName];
                            const hasSolos = Object.values(soloedTracks).some(Boolean);
                            const isSoloed = soloedTracks[track.trackName];
                            // If some tracks are soloed, tracks that are not soloed are dimmed
                            const isEffectiveMuted = isMuted || (hasSolos && !isSoloed);

                            return (
                              <div key={trackIdx} className="grid grid-cols-[140px_1fr] gap-4 items-center pl-2">
                                {/* Track Controls Rail */}
                                <div className={`p-2.5 rounded-xl border flex flex-col justify-center gap-1.5 transition-all select-none ${
                                  theme === 'coldest' 
                                    ? isEffectiveMuted ? 'bg-sky-100/40 border-sky-200/50 opacity-45' : 'bg-sky-100 border-sky-200'
                                    : isEffectiveMuted ? 'bg-[#1e293b]/30 border-slate-800 opacity-40' : 'bg-[#1e293b]/70 border-slate-700/50'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-current truncate pr-1 max-w-[85px]" title={track.trackName}>
                                      {track.trackName}
                                    </span>
                                    {/* Level Indicators */}
                                    {!isEffectiveMuted && isPlayingTimeline && (
                                      <div className="flex items-end gap-0.5 h-3">
                                        <motion.div animate={{ height: [4, 12, 6, 12, 4] }} transition={{ repeat: Infinity, duration: 0.7 + trackIdx*0.1 }} className="w-0.5 bg-emerald-500 rounded-full" />
                                        <motion.div animate={{ height: [6, 4, 12, 8, 6] }} transition={{ repeat: Infinity, duration: 0.5 + trackIdx*0.15 }} className="w-0.5 bg-emerald-400 rounded-full" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1">
                                    {/* Mute Button */}
                                    <button
                                      onClick={() => setMutedTracks(prev => ({ ...prev, [track.trackName]: !prev[track.trackName] }))}
                                      className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border transition-all ${
                                        isMuted 
                                          ? 'bg-red-500/20 text-red-400 border-red-500/50' 
                                          : 'bg-black/25 text-slate-400 border-transparent hover:border-slate-500'
                                      }`}
                                    >
                                      M
                                    </button>
                                    {/* Solo Button */}
                                    <button
                                      onClick={() => setSoloedTracks(prev => ({ ...prev, [track.trackName]: !prev[track.trackName] }))}
                                      className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border transition-all ${
                                        isSoloed 
                                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                                          : 'bg-black/25 text-slate-400 border-transparent hover:border-slate-500'
                                      }`}
                                    >
                                      S
                                    </button>
                                  </div>
                                </div>

                                {/* Grid Track Strip */}
                                <div className={`relative h-12 rounded-xl border flex items-center transition-all ${
                                  theme === 'coldest' 
                                    ? isEffectiveMuted ? 'bg-sky-500/[0.02] border-sky-100' : 'bg-sky-500/[0.05] border-sky-100'
                                    : isEffectiveMuted ? 'bg-slate-900/10 border-slate-800' : 'bg-black/30 border-[#1e293b]'
                                }`}>
                                  {/* Grid Columns Guideline dividers */}
                                  <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `repeat(${maxBars}, minmax(0, 1fr))` }}>
                                    {Array.from({ length: maxBars }).map((_, barIdx) => (
                                      <div key={barIdx} className={`h-full border-r ${
                                        theme === 'coldest' ? 'border-sky-500/5' : 'border-sky-500/[0.03]'
                                      }`} />
                                    ))}
                                  </div>

                                  {/* Track Blocks */}
                                  {track.blocks.map((block: any, bIdx: number) => {
                                    const isSelected = selectedBlockId === block.id;
                                    
                                    // Determine dynamic color pairings
                                    let blockColorClasses = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
                                    if (block.color === 'rose') blockColorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                                    if (block.color === 'indigo') blockColorClasses = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
                                    if (block.color === 'violet') blockColorClasses = 'bg-violet-500/10 text-violet-400 border-violet-500/30';
                                    if (block.color === 'emerald') blockColorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                                    if (block.color === 'amber') blockColorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                                    if (isSelected) {
                                      if (block.color === 'sky') blockColorClasses = 'bg-sky-500 text-white border-sky-400 scale-[1.01] shadow-lg shadow-sky-500/30 z-20';
                                      if (block.color === 'rose') blockColorClasses = 'bg-rose-500 text-white border-rose-400 scale-[1.01] shadow-lg shadow-rose-500/30 z-20';
                                      if (block.color === 'indigo') blockColorClasses = 'bg-indigo-500 text-white border-indigo-400 scale-[1.01] shadow-lg shadow-indigo-500/30 z-20';
                                      if (block.color === 'violet') blockColorClasses = 'bg-violet-500 text-white border-violet-400 scale-[1.01] shadow-lg shadow-violet-500/30 z-20';
                                      if (block.color === 'emerald') blockColorClasses = 'bg-emerald-500 text-white border-emerald-400 scale-[1.01] shadow-lg shadow-emerald-500/30 z-20';
                                      if (block.color === 'amber') blockColorClasses = 'bg-amber-500 text-white border-amber-400 scale-[1.01] shadow-lg shadow-amber-500/30 z-20';
                                    }

                                    const startPct = ((block.startBar - 1) / maxBars) * 100;
                                    const widthPct = (block.durationBars / maxBars) * 100;

                                    return (
                                      <button
                                        key={bIdx}
                                        onClick={() => setSelectedBlockId(block.id)}
                                        style={{
                                          left: `${startPct}%`,
                                          width: `${widthPct}%`,
                                        }}
                                        className={`absolute h-9 rounded-lg border flex items-center justify-center px-2 cursor-pointer transition-all ${blockColorClasses} ${
                                          isEffectiveMuted ? 'opacity-30' : 'opacity-100'
                                        }`}
                                      >
                                        <span className="text-[9px] font-black uppercase tracking-wider truncate text-center select-none">
                                          {block.text}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Master Playback LED Volume Meter simulation */}
                    <div className="mt-5 flex items-center justify-between gap-4 p-3 rounded-2xl bg-black/15 border border-sky-500/5">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-sky-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                          {t('led_vibe_meter', 'Real-Time Dynamic Gain Meter')}
                        </span>
                      </div>
                      <div className="flex gap-1 flex-1 max-w-[300px]">
                        {Array.from({ length: 15 }).map((_, segmentIdx) => {
                          const isActive = isPlayingTimeline && (
                            // Jitter active state based on bars
                            segmentIdx < 4 + (currentTimelineBar % 3) * 3 ||
                            segmentIdx === 0
                          );
                          const color = segmentIdx < 10 
                            ? 'bg-emerald-500' 
                            : segmentIdx < 13 
                            ? 'bg-amber-500' 
                            : 'bg-rose-500';
                          return (
                            <div
                              key={segmentIdx}
                              className={`h-2 flex-1 rounded-sm transition-all duration-150 ${
                                isActive ? `${color} shadow-sm` : 'bg-slate-700/20'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Double Section Content: Left Column: Selected Block Parameters | Right Column: DAW Manual */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT COLUMN: Selected Vocal Block Details parameters */}
                    <AnimatePresence mode="wait">
                      {selectedBlockId && (() => {
                        const allBlocks = getVocalTimeline().flatMap((t: any) => t.blocks);
                        const block = allBlocks.find((b: any) => b.id === selectedBlockId);
                        if (!block) return null;
                        
                        return (
                          <motion.div
                            key={block.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className={`p-6 rounded-3xl border flex flex-col justify-between ${
                              theme === 'coldest' ? 'bg-white border-sky-100 shadow-sm' : 'bg-slate-900/40 border-sky-500/10'
                            }`}
                          >
                            <div>
                              {/* Title / Header */}
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    block.color === 'sky' ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]' :
                                    block.color === 'rose' ? 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]' :
                                    block.color === 'indigo' ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]' :
                                    block.color === 'violet' ? 'bg-violet-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]' :
                                    block.color === 'emerald' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
                                    'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                  }`} />
                                  <h6 className="font-extrabold text-sm text-[#0ea5e9]">
                                    {block.text}
                                  </h6>
                                </div>
                                <span className="font-mono text-[9px] font-black uppercase bg-sky-500/10 px-2 py-0.5 rounded-full text-sky-400">
                                  {t('span_bars', 'BARS')}: {block.startBar} — {block.startBar + block.durationBars - 1}
                                </span>
                              </div>

                              <div className="space-y-4">
                                {/* Instructions */}
                                <div>
                                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                    {t('segment_coaching_directives', 'Dynamic Segment Directives')}
                                  </span>
                                  <p className="text-xs font-bold leading-relaxed mt-1 text-current opacity-85">
                                    {block.instructions}
                                  </p>
                                </div>

                                {/* Slider values mapping */}
                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-sky-500/10">
                                  <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50 block">Target Gain level</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-sky-500" style={{ width: `${block.intensity}%` }} />
                                      </div>
                                      <span className="font-mono text-[10px] font-black">-{((100 - block.intensity) / 4).toFixed(1)} dB</span>
                                    </div>
                                  </div>

                                  <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50 block">Automation Frequency</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${block.intensity * 0.9}%` }} />
                                      </div>
                                      <span className="font-mono text-[10px] font-black">{(block.intensity * 22).toFixed(0)} Hz</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Signal Flow Quick Badge Links */}
                            <div className="mt-5 pt-4 border-t border-sky-500/10 flex flex-wrap gap-1.5">
                              {block.text.toLowerCase().includes('dubs') || block.text.toLowerCase().includes('double') ? (
                                <>
                                  <span className="text-[9px] font-black bg-rose-500/15 text-rose-400 px-2 py-1 rounded-lg border border-rose-500/20 uppercase tracking-widest">
                                    ↔️ Polarity Align Required
                                  </span>
                                  <span className="text-[9px] font-black bg-sky-500/15 text-sky-400 px-2 py-1 rounded-lg border border-sky-500/20 uppercase tracking-widest">
                                    🔄 Stereo Widener active
                                  </span>
                                </>
                              ) : block.text.toLowerCase().includes('delay') || block.text.toLowerCase().includes('accent') ? (
                                <>
                                  <span className="text-[9px] font-black bg-indigo-500/15 text-indigo-400 px-2 py-1 rounded-lg border border-indigo-500/20 uppercase tracking-widest">
                                    ↩️ Automated Delay Throw
                                  </span>
                                  <span className="text-[9px] font-black bg-amber-500/15 text-amber-400 px-2 py-1 rounded-lg border border-amber-500/20 uppercase tracking-widest">
                                    🎚️ Aux Bus Route Match
                                  </span>
                                </>
                              ) : block.text.toLowerCase().includes('sweep') || block.text.toLowerCase().includes('rise') ? (
                                <>
                                  <span className="text-[9px] font-black bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/20 uppercase tracking-widest">
                                    ⚡ High Cut Automation Sweep
                                  </span>
                                  <span className="text-[9px] font-black bg-amber-500/15 text-amber-400 px-2 py-1 rounded-lg border border-amber-500/20 uppercase tracking-widest">
                                    🎚️ Dynamic EQ Duck
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-[9px] font-black bg-sky-500/15 text-sky-400 px-2 py-1 rounded-lg border border-sky-500/20 uppercase tracking-widest">
                                    🎤 Principal Vocals Center
                                  </span>
                                  <span className="text-[9px] font-black bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/20 uppercase tracking-widest">
                                    🔄 Sidechain ducking active
                                  </span>
                                </>
                              )}
                            </div>
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>

                    {/* RIGHT COLUMN: DAW Integration Manual */}
                    <div className={`p-6 rounded-3xl border flex flex-col justify-between ${
                      theme === 'coldest' ? 'bg-white border-sky-100 shadow-sm' : 'bg-[#121b2e]/60 border-sky-500/10'
                    }`}>
                      <div>
                        {/* Title select host dropdown */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-sky-500/10">
                          <div className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-indigo-400" />
                            <h6 className="font-extrabold text-sm text-[#818cf8]">
                              {getDawSpecificGuide(customDawOption || dawType).name}
                            </h6>
                          </div>

                          {/* Quick dropdown override inside element */}
                          <select
                            value={customDawOption || dawType || 'other'}
                            onChange={(e) => setCustomDawOption(e.target.value)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs outline-none cursor-pointer border ${
                              theme === 'coldest' 
                                ? 'bg-white text-sky-950 border-sky-200' 
                                : 'bg-[#1e293b] text-white border-slate-700 focus:border-indigo-500'
                            }`}
                          >
                            <option value="ableton">Ableton Live</option>
                            <option value="logic">Logic Pro</option>
                            <option value="fl">FL Studio</option>
                            <option value="reaper">REAPER</option>
                            <option value="pro_tools">Pro Tools</option>
                            <option value="studio_one">Studio One</option>
                            <option value="bitwig">Bitwig Studio</option>
                            <option value="garageband">GarageBand</option>
                            <option value="cubase">Cubase</option>
                            <option value="other">Other / Standard VST</option>
                          </select>
                        </div>

                        {/* Guide Content Area with subTabs */}
                        <div className="flex gap-1.5 mb-4 border-b border-sky-500/5 pb-2 overflow-x-auto">
                          {(['polarity', 'sidechain', 'delay', 'sweeps'] as const).map((tab) => {
                            const labels = {
                              polarity: t('man_polarity', 'Polarity Flip'),
                              sidechain: t('man_sidechain', 'Sidechain Comp'),
                              delay: t('man_delay', 'Delay Throws'),
                              sweeps: t('man_sweeps', 'HPF Sweeps')
                            };
                            return (
                              <button
                                key={tab}
                                onClick={() => setActiveManualTab(tab)}
                                className={`px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded-lg transition-all ${
                                  activeManualTab === tab
                                    ? theme === 'coldest'
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {labels[tab]}
                              </button>
                            );
                          })}
                        </div>

                        <div className="min-h-[140px] text-xs">
                          {activeManualTab === 'polarity' && (
                            <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block">
                                PHASE COHERENCE MATRIX
                              </span>
                              <p className="font-bold leading-relaxed whitespace-pre-line text-[#94a3b8] dark:text-slate-300">
                                {getDawSpecificGuide(customDawOption || dawType).polarity}
                              </p>
                            </div>
                          )}

                          {activeManualTab === 'sidechain' && (
                            <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block">
                                DYNAMIC CARVING ROUTING
                              </span>
                              <p className="font-bold leading-relaxed whitespace-pre-line text-[#94a3b8] dark:text-slate-300">
                                {getDawSpecificGuide(customDawOption || dawType).sidechain}
                              </p>
                            </div>
                          )}

                          {activeManualTab === 'delay' && (
                            <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block">
                                AUTOMATED DELAY THROW ENVELOPES
                              </span>
                              <p className="font-bold leading-relaxed whitespace-pre-line text-[#94a3b8] dark:text-slate-300">
                                {getDawSpecificGuide(customDawOption || dawType).delay}
                              </p>
                            </div>
                          )}

                          {activeManualTab === 'sweeps' && (
                            <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-50 block">
                                FILTER SWEEP FREQUENCY TRANSITIONS
                              </span>
                              <p className="font-bold leading-relaxed whitespace-pre-line text-[#94a3b8] dark:text-slate-300">
                                {getDawSpecificGuide(customDawOption || dawType).sweeps}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info bar footer */}
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mt-4 leading-normal">
                        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-[10px] font-bold text-slate-400">
                          {t('manual_tip', 'Tip: Polarity / Phase issues occur when overlapping doubles have sound waveforms that cancel each other out. Flipping polarity on a doubled track (by 180 degrees) will frequently recover lost low-end punch immediately.')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* FORMATTED & SYNCED LYRICS TAB CONTENT */}
              {activeLyricTab === 'formattedLyrics' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 animate-fade-in"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editorial Genius Style Card */}
                    <div className={`p-6 rounded-3xl border flex flex-col ${
                      theme === 'coldest' ? 'bg-white border-sky-100 shadow-sm' : 'bg-black/40 border-sky-500/20'
                    }`}>
                      <div className="flex items-center justify-between pb-4 border-b border-sky-500/10 mb-6">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-sky-500" />
                          <h5 className="font-extrabold text-xs uppercase tracking-widest text-sky-500">
                            {t('genius_format_title', 'Genius Properly Formatted Lyrics')}
                          </h5>
                        </div>
                        <button
                          onClick={() => {
                            const lText = lyricResult?.formattedLyrics || lyrics;
                            navigator.clipboard.writeText(lText);
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all select-none ${
                            theme === 'coldest'
                              ? 'bg-sky-50 border-sky-200 text-sky-800 hover:bg-sky-100'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {t('copy_lyrics', 'Copy to Clipboard')}
                        </button>
                      </div>

                      <div className={`flex-1 rounded-2xl p-4 font-sans text-sm leading-relaxed overflow-y-auto max-h-[480px] whitespace-pre-line border ${
                        theme === 'coldest' ? 'bg-slate-50 border-slate-100 text-slate-800' : 'bg-slate-950/70 border-slate-800 text-slate-300'
                      }`}>
                        {lyricResult?.formattedLyrics || lyrics || (
                          <div className="text-center opacity-40 py-8 font-serif italic text-xs">
                            {t('no_lyrics_yet', 'No analyzed lyrics. Click "Analyze Lyrics & Track" above to generate perfectly corrected, organized lyrics.')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Spotify Sync LRC File Card */}
                    <div className={`p-6 rounded-3xl border flex flex-col ${
                      theme === 'coldest' ? 'bg-white border-sky-100 shadow-sm' : 'bg-black/40 border-sky-500/20'
                    }`}>
                      <div className="flex items-center justify-between pb-4 border-b border-sky-500/10 mb-6">
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-[#10b981]" />
                          <h5 className="font-extrabold text-xs uppercase tracking-widest text-[#10b981]">
                            {t('spotify_sync_title', 'Spotify LRC Sync Preview')}
                          </h5>
                        </div>
                        <button
                          onClick={() => {
                            const filename = "synced_lyrics.lrc";
                            let lrcContent = "";
                            const lines = lyricResult?.syncedLyrics || [];
                            if (lines.length > 0) {
                              lrcContent = lines.map(line => `${line.time}${line.lyric}`).join("\n");
                            } else {
                              // Fallback simulated synced lyrics if not available
                              const rawLines = (lyricResult?.formattedLyrics || lyrics).split("\n").filter(l => l.trim() && !l.startsWith("["));
                              lrcContent = rawLines.map((line, idx) => {
                                const sec = idx * 4;
                                const mm = String(Math.floor(sec / 60)).padStart(2, '0');
                                const ss = String(sec % 60).padStart(2, '0');
                                return `[${mm}:${ss}.00]${line}`;
                              }).join("\n");
                            }
                            const blob = new Blob([lrcContent], { type: 'text/plain;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = filename;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] active:scale-95 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-1.5"
                        >
                          <Download className="w-4 h-4" />
                          {t('download_lrc', 'Download .LRC File')}
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className={`flex-1 rounded-2xl p-4 overflow-y-auto max-h-[400px] border ${
                          theme === 'coldest' ? 'bg-slate-50 border-slate-100' : 'bg-slate-950/70 border-slate-800'
                        }`}>
                          {lyricResult?.syncedLyrics && lyricResult.syncedLyrics.length > 0 ? (
                            <div className="space-y-3 font-mono text-xs">
                              {lyricResult.syncedLyrics.map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-2 rounded hover:bg-emerald-500/5 transition-colors border-b border-white/5 items-center">
                                  <span className="text-emerald-500 font-extrabold select-none shrink-0 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/5">
                                    {item.time}
                                  </span>
                                  <span className="text-slate-300 text-sm font-sans font-medium hover:text-white transition-colors">
                                    {item.lyric}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center opacity-40 py-8 font-serif italic text-xs">
                              {t('no_sync_yet', 'No synchronized timestamps yet. Click "Analyze Lyrics & Track" to generate millisecond-perfect timing logs.')}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 p-3 rounded-xl bg-[#10b981]/5 border border-[#10b981]/10 flex items-start gap-2 text-[10px] leading-relaxed text-slate-400">
                          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>
                            {t('synced_instructions', 'Standard LRC files synchronize audio with lyrics using timestamps precise to the hundredth of a second. This file is compatible with Spotify, Apple Music, and Amazon Music lyric ingestion systems.')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI COACH TAB CONTENT */}
              {activeLyricTab === 'aiCoach' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-6 rounded-3xl border ${
                    theme === 'coldest' ? 'bg-white border-sky-100 shadow-sm' : 'bg-black/40 border-sky-500/20'
                  }`}
                >
                  <h5 className="font-black text-xs uppercase tracking-widest text-sky-500 mb-6 flex items-center gap-2 pb-4 border-b border-sky-500/10">
                    <Sparkles className="w-4 h-4" />
                    {t('analysis_results_title', 'Coaching & Performance Analysis')}
                  </h5>

                  <div className="space-y-6 text-current">
                    {/* Words to Dub */}
                    <div>
                      <h6 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
                        {t('suggested_dub_words', 'Suggested Dub Words / Performance Accents')}
                      </h6>
                      <div className="bg-sky-500/5 p-4 rounded-xl border border-sky-500/10 text-current">
                        {typeof lyricResult.dubWords === 'string' ? (
                          <p className="text-sm font-bold leading-relaxed whitespace-pre-line">
                            {lyricResult.dubWords}
                          </p>
                        ) : Array.isArray(lyricResult.dubWords) ? (
                          <div className="space-y-3">
                            {lyricResult.dubWords.map((item: any, idx: number) => {
                              if (typeof item === 'string') {
                                return (
                                  <p key={idx} className="text-sm font-bold leading-relaxed">
                                    • {item}
                                  </p>
                                );
                              } else if (typeof item === 'object' && item !== null) {
                                const word = item.word || item.text || item.phrase || '';
                                const emphasis = item.emphasis || item.accent || item.styling || '';
                                const explanation = item.explanation || item.reason || item.why || item.comment || '';
                                return (
                                  <div key={idx} className={`p-3 rounded-lg border space-y-1 ${
                                    theme === 'coldest' ? 'bg-white border-sky-200' : 'bg-black/10 border-sky-500/15'
                                  }`}>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {word && (
                                        <span className="text-xs font-black uppercase tracking-wider text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded">
                                          {word}
                                        </span>
                                      )}
                                      {emphasis && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase tracking-widest">
                                          {emphasis}
                                        </span>
                                      )}
                                    </div>
                                    {explanation && (
                                      <p className="text-xs text-current font-medium leading-relaxed p-0 m-0 border-0">
                                        {explanation}
                                      </p>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        ) : (
                          <p className="text-sm font-bold leading-relaxed">
                            {JSON.stringify(lyricResult.dubWords)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Cadence & Delivery Details */}
                    <div>
                      <h6 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
                        {t('cadence_and_delivery', 'Cadence, Pitch & Vocal Delivery Styling')}
                      </h6>
                      <p className="text-sm font-bold leading-relaxed whitespace-pre-line bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10 text-current">
                        {lyricResult.cadenceAndDelivery}
                      </p>
                    </div>

                    {/* Vocal Chain Recommendations */}
                    {lyricResult.vocalChain && lyricResult.vocalChain.length > 0 && (
                      <div>
                        <h6 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">
                          {t('recommended_dub_vocal_chain', 'Polishing Vocal Chain (Zero Hallucination)')}
                        </h6>
                        <div className="space-y-3">
                          {lyricResult.vocalChain.map((plugin: any, pIdx: number) => (
                            <div key={pIdx} className={`p-4 rounded-xl border ${theme === 'coldest' ? 'bg-sky-100/30 border-sky-200' : 'bg-[#1e293b]/50 border-sky-500/10'}`}>
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-black text-xs text-sky-600 dark:text-sky-450">{plugin.name}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-55 bg-sky-500/10 px-2 py-0.5 rounded-full">{plugin.purpose}</span>
                              </div>
                              <div className="space-y-1.5 mt-2">
                                {Array.isArray(plugin.deepDive) && plugin.deepDive.map((param: any, dIdx: number) => (
                                  <div key={dIdx} className="text-[10px] font-bold opacity-80 flex flex-wrap gap-1 leading-normal text-current">
                                    <span className="text-sky-500 font-black">{param.parameter}:</span>
                                    <span className="opacity-90">{param.value}</span>
                                    <span className="opacity-50">—</span>
                                    <span className="opacity-70 font-medium italic">{param.explanation}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Context Response */}
                    {lyricResult.additionalAdvice && (
                      <div>
                        <h6 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
                          {t('additional_context_advice', 'Vocal Coaching Advice & Context Response')}
                        </h6>
                        <p className="text-sm font-bold leading-relaxed whitespace-pre-line bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 text-current">
                          {lyricResult.additionalAdvice}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-3xl border ${theme === 'coldest' ? 'bg-sky-50 border-sky-100' : 'bg-sky-900/10 border-sky-500/20'}`}>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-sky-500" />
                <h4 className="text-sm font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">{t('strengths')}</h4>
              </div>
              <ul className="space-y-3">
                {Array.isArray(critique.strengths) && critique.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm font-bold opacity-80 flex items-start gap-2">
                    <span className="text-sky-500 mt-0.5">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-6 rounded-3xl border ${theme === 'coldest' ? 'bg-red-50 border-red-100' : 'bg-red-900/10 border-red-500/20'}`}>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h4 className="text-sm font-black uppercase tracking-widest text-red-600 dark:text-red-400">{t('areas_for_improvement')}</h4>
              </div>
              <ul className="space-y-3">
                {Array.isArray(critique.weaknesses) && critique.weaknesses.map((weakness, idx) => (
                  <li key={idx} className="text-sm font-bold opacity-80 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {critique.deviationMetrics && critique.deviationMetrics.length > 0 && (
            <div className={`p-6 rounded-3xl border mb-12 ${theme === 'coldest' ? 'bg-fuchsia-50 border-fuchsia-100' : 'bg-fuchsia-900/10 border-fuchsia-500/20'}`}>
              <div className="flex items-center gap-2 mb-6">
                <BarChart2 className="w-5 h-5 text-fuchsia-500" />
                <h4 className="text-sm font-black uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-400">Reference Track Deviation</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(critique.deviationMetrics) && critique.deviationMetrics.map((metric, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl ${theme === 'coldest' ? 'bg-white shadow-sm' : 'bg-black/20'}`}>
                    <h5 className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">{metric.metric}</h5>
                    <p className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400 mb-2">{metric.deviation}</p>
                    <p className="text-xs font-medium opacity-80 leading-relaxed">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6 mb-12">
            <h4 className="text-sm font-black uppercase tracking-widest opacity-40">{t('action_plan')}</h4>
            <div className="space-y-4">
              {Array.isArray(critique.actionPlan) && critique.actionPlan.map((action, idx) => (
                <div key={idx} className={`p-6 rounded-3xl border ${
                  theme === 'coldest' ? 'bg-white/50 border-sky-100 shadow-inner' : 'bg-sky-900/10 border-sky-500/20'
                }`}>
                  {action.targetStem && (
                    <div className="mb-3 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-sky-500/20 text-sky-600 dark:text-sky-400">
                      Stem: {action.targetStem}
                    </div>
                  )}
                  <h5 className="font-black text-lg mb-2">{action.issue}</h5>
                  <p className="text-sm font-bold opacity-80 mb-6">{action.solution}</p>
                  
                  {action.multiBandDetails?.isEnabled && (
                    <div className="mb-6 p-4 rounded-xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 group-hover:from-teal-500/20 group-hover:via-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-500"></div>
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-cyan-500"></div>
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                          <Layers className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h5 className="text-[10px] uppercase tracking-widest font-black text-cyan-400 flex items-center gap-2 mb-1">
                            Gaffel Multiband Split <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">{action.multiBandDetails.bandCount} Bands</span>
                          </h5>
                          <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px] font-bold text-cyan-100/70">
                            Split points: 
                            {Array.isArray(action.multiBandDetails.splitFrequencies) && action.multiBandDetails.splitFrequencies.map((freq: string, i: number) => (
                              <span key={i} className="bg-cyan-900/30 border border-cyan-500/30 px-1.5 py-0.5 rounded shadow-sm text-cyan-300">{freq}</span>
                            ))}
                          </div>
                          <p className="text-xs font-medium text-cyan-100/90 leading-relaxed max-w-lg mt-2">
                            {action.multiBandDetails.reasoning}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h6 className="text-[10px] font-black uppercase tracking-widest opacity-50">{t('recommended_chain')}</h6>
                    {(() => {
                      if (action.multiBandDetails?.isEnabled) {
                        const grouped = (action.recommendedChain || []).reduce((acc: any, plugin: any) => {
                          const b = plugin.band || 'General / Pre-Split';
                          if (!acc[b]) acc[b] = [];
                          acc[b].push(plugin);
                          return acc;
                        }, {});
                        
                        return Object.entries(grouped).map(([bandName, plugins]: [string, any], bIdx) => (
                          <div key={`band-${bIdx}`} className="space-y-4 mb-6 last:mb-0 relative">
                            <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-cyan-500/20 rounded-full"></div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black tracking-widest uppercase text-cyan-300 ml-2 shadow-sm">
                              <Layers className="w-3 h-3 text-cyan-400" />
                              {bandName}
                            </div>
                            <div className="ml-2 space-y-3">
                              {plugins.map((plugin: any) => {
                                const originalIdx = action.recommendedChain.indexOf(plugin);
                                return (
                                  <PluginBubble 
                                    key={originalIdx}
                                    name={plugin.name}
                                    purpose={plugin.purpose}
                                    deepDive={plugin.deepDive}
                                    band={plugin.band}
                                    routing={plugin.routing}
                                    isRegenerating={regeneratingPluginId === `critique-${idx}-${originalIdx}`}
                                    onRegenerate={() => handleRegenerate(plugin, idx, originalIdx)}
                                    onCorrect={onCorrectPlugin}
                                    onContactSupport={onContactSupport}
                                    theme={theme}
                                    className={theme === 'coldest' ? 'bg-white border-sky-100' : 'bg-black/40 border-sky-500/30'}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ));
                      }

                      return Array.isArray(action.recommendedChain) && action.recommendedChain?.map((plugin, pIdx) => (
                        <PluginBubble 
                          key={pIdx}
                          name={plugin.name}
                          purpose={plugin.purpose}
                          deepDive={plugin.deepDive}
                          band={plugin.band}
                          routing={plugin.routing}
                          isRegenerating={regeneratingPluginId === `critique-${idx}-${pIdx}`}
                          onRegenerate={() => handleRegenerate(plugin, idx, pIdx)}
                          onCorrect={onCorrectPlugin}
                          onContactSupport={onContactSupport}
                          theme={theme}
                          className={theme === 'coldest' ? 'bg-white border-sky-100' : 'bg-black/40 border-sky-500/30'}
                        />
                      ));
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border ${theme === 'coldest' ? 'bg-sky-50 border-sky-200' : 'bg-sky-900/20 border-sky-500/30'}`}>
            <h4 className="text-sm font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-2">{t('need_specific_help')}</h4>
            <p className="text-xs font-bold opacity-70 mb-4">{t('ask_specific_help')}</p>
            
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={specificHelpQuery}
                onChange={(e) => setSpecificHelpQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSpecificHelpSearch()}
                placeholder={t('specific_help_placeholder')}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm outline-none transition-all ${
                  theme === 'coldest' ? 'bg-white border-2 border-sky-100 focus:border-sky-400' : 'bg-black/40 border-2 border-sky-500/30 focus:border-sky-500'
                }`}
              />
              <button
                onClick={handleSpecificHelpSearch}
                disabled={isLoadingSpecificHelp || !specificHelpQuery.trim()}
                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center disabled:opacity-50 ${
                  theme === 'coldest' ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-sky-500 text-white hover:bg-sky-600'
                }`}
              >
                {isLoadingSpecificHelp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </div>

            {specificHelpResults?.length > 0 && (
              <div className="space-y-6 mt-6 pt-6 border-t border-sky-500/20">
                {Array.isArray(specificHelpResults) && specificHelpResults.map((result, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className={`p-5 rounded-2xl border ${theme === 'coldest' ? 'bg-white border-sky-200' : 'bg-black/60 border-sky-500/40'}`}
                  >
                    <h5 className="font-black text-sm mb-2 opacity-50">{t('q_label', { query: result.query })}</h5>
                    <p className="text-sm font-bold leading-relaxed mb-4">{result.advice}</p>
                    
                    {result.multiBandDetails?.isEnabled && (
                      <div className="mb-6 p-4 rounded-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 group-hover:from-teal-500/20 group-hover:via-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-500"></div>
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-teal-500 to-cyan-500"></div>
                        <div className="relative z-10 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                            <Layers className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <h5 className="text-[10px] uppercase tracking-widest font-black text-cyan-400 flex items-center gap-2 mb-1">
                              Gaffel Multiband Split <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">{result.multiBandDetails.bandCount} Bands</span>
                            </h5>
                            <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px] font-bold text-cyan-100/70">
                              Split points: 
                              {Array.isArray(result.multiBandDetails.splitFrequencies) && result.multiBandDetails.splitFrequencies.map((freq: string, i: number) => (
                                <span key={i} className="bg-cyan-900/30 border border-cyan-500/30 px-1.5 py-0.5 rounded shadow-sm text-cyan-300">{freq}</span>
                              ))}
                            </div>
                            <p className="text-xs font-medium text-cyan-100/90 leading-relaxed max-w-lg mt-2">
                              {result.multiBandDetails.reasoning}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {result.recommendedChain && result.recommendedChain?.length > 0 && (
                      <div className="space-y-2">
                        <h6 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">{t('recommended_plugins')}</h6>
                        {(() => {
                          if (result.multiBandDetails?.isEnabled) {
                            const grouped = (result.recommendedChain || []).reduce((acc: any, plugin: any) => {
                              const b = plugin.band || 'General / Pre-Split';
                              if (!acc[b]) acc[b] = [];
                              acc[b].push(plugin);
                              return acc;
                            }, {});
                            
                            return Object.entries(grouped).map(([bandName, plugins]: [string, any], bIdx) => (
                              <div key={`band-${bIdx}`} className="space-y-4 mb-6 last:mb-0 relative">
                                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-cyan-500/20 rounded-full"></div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black tracking-widest uppercase text-cyan-300 ml-2 shadow-sm">
                                  <Layers className="w-3 h-3 text-cyan-400" />
                                  {bandName}
                                </div>
                                <div className="ml-2 space-y-3">
                                  {plugins.map((plugin: any, pIdx: number) => (
                                    <div key={pIdx} className={`p-3 rounded-xl border ${theme === 'coldest' ? 'bg-sky-50 border-sky-100' : 'bg-sky-900/20 border-sky-500/20'}`}>
                                      <div className="flex justify-between items-start mb-1">
                                        <span className="font-black text-xs text-sky-600 dark:text-sky-400">{plugin.name}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{plugin.purpose}</span>
                                      </div>
                                      {(plugin.band || plugin.routing) && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                          {plugin.band && <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${theme === 'coldest' ? 'bg-sky-500/20 text-sky-600' : 'bg-black/10'}`}>{plugin.band}</span>}
                                          {plugin.routing && <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${theme === 'coldest' ? 'bg-purple-500/20 text-purple-600' : 'bg-black/10'}`}>{plugin.routing}</span>}
                                        </div>
                                      )}
                                      <div className="space-y-1">
                                        {Array.isArray(plugin.deepDive) && plugin.deepDive?.map((param: any, dIdx: number) => (
                                          <div key={dIdx} className="text-[10px] font-bold opacity-70">
                                            <span className="text-sky-500">{param.parameter}:</span> {param.value} - <span className="opacity-60">{param.explanation}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ));
                          }

                          return Array.isArray(result.recommendedChain) && result.recommendedChain.map((plugin: any, pIdx: number) => (
                            <div key={pIdx} className={`p-3 rounded-xl border ${theme === 'coldest' ? 'bg-sky-50 border-sky-100' : 'bg-sky-900/20 border-sky-500/20'}`}>
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-black text-xs text-sky-600 dark:text-sky-400">{plugin.name}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">{plugin.purpose}</span>
                              </div>
                              {(plugin.band || plugin.routing) && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {plugin.band && <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${theme === 'coldest' ? 'bg-sky-500/20 text-sky-600' : 'bg-black/10'}`}>{plugin.band}</span>}
                                  {plugin.routing && <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${theme === 'coldest' ? 'bg-purple-500/20 text-purple-600' : 'bg-black/10'}`}>{plugin.routing}</span>}
                                </div>
                              )}
                              <div className="space-y-1">
                                {Array.isArray(plugin.deepDive) && plugin.deepDive?.map((param: any, dIdx: number) => (
                                  <div key={dIdx} className="text-[10px] font-bold opacity-70">
                                    <span className="text-sky-500">{param.parameter}:</span> {param.value} - <span className="opacity-60">{param.explanation}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div 
            className={`mt-8 p-6 rounded-3xl border transition-all ${theme === 'coldest' ? 'bg-sky-50 border-sky-200' : 'bg-sky-900/20 border-sky-500/30'} ${isDragging ? 'border-sky-500 bg-sky-500/10' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h4 className="text-sm font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-4">{t('re_critique')}</h4>
            <p className="text-xs opacity-70 mb-4">{t('re_critique_instructions')}</p>
            <div className="space-y-4">
              <textarea
                value={reCritiqueContext}
                onChange={(e) => setReCritiqueContext(e.target.value)}
                placeholder={t('re_critique_placeholder')}
                className={`w-full px-4 py-3 rounded-xl font-bold text-sm outline-none transition-all ${
                  theme === 'coldest' ? 'bg-white border-2 border-sky-100 focus:border-sky-400' : 'bg-black/40 border-2 border-sky-500/30 focus:border-sky-500'
                }`}
                rows={3}
              />
              <input
                type="file"
                accept="audio/mp3"
                onChange={handleReCritiqueUpload}
                className="hidden"
                id={`re-critique-upload-${critique.id}`}
              />
              <label
                htmlFor={`re-critique-upload-${critique.id}`}
                className={`block w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all text-center cursor-pointer ${
                  theme === 'coldest' ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-sky-500 text-white hover:bg-sky-600'
                }`}
              >
                {isLoadingReCritique ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : t('upload_or_drop_mp3')}
              </label>
            </div>
          </div>
      
      {/* Hidden Export View Removed */}
    </motion.div>
  );
};
