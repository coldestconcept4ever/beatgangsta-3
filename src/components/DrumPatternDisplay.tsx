import React, { useState, useEffect, useMemo } from 'react';
import { DrumPattern, AppTheme, SampleVaultItem } from '../types';
import { motion } from 'motion/react';
import { Download, Music, Play, Square, Sparkles, Volume2, CheckCircle2, Sliders, FolderDown } from 'lucide-react';
import { generateAudioLoop, generateDrumMidiBaseData } from '../utils/midiGenerator';
import { playMidiPreview, stopMidiPreview, initAudio } from '../utils/midiPlayer';
import { useTranslation } from 'react-i18next';
import { DEFAULT_COSMOS_FACTORY_SAMPLES } from './SampleVaultModal';
import { matchBeatKitFromVault, MatchedBeatKit } from '../utils/songKitMatcher';
import { playVaultOneShot, stopAllVaultAudio } from '../utils/oneShotAudioPlayer';

// Dynamic imports for heavy libraries
const getJSZip = () => import('jszip').then(m => m.default);
const getSaveAs = () => import('file-saver').then(m => m.saveAs);

interface DrumPatternDisplayProps {
  patterns: {
    intro: DrumPattern;
    verse: DrumPattern;
    hook: DrumPattern;
    bridge: DrumPattern;
    outro: DrumPattern;
  };
  theme?: AppTheme;
  dawType?: string | null;
  recipeTitle?: string;
  bpm?: number;
  detectedSectionLengths?: {
    intro?: number;
    verse?: number;
    hook?: number;
    bridge?: number;
    outro?: number;
  };
}

const StepGrid = ({ steps = [], totalSteps, label, color, textColor, showVelocity, swing = 0, showSwingView }: { steps?: (number | { step: number, velocity: number })[], totalSteps: number, label: string, color: string, textColor: string, showVelocity?: boolean, swing?: number, showSwingView?: boolean }) => {
  // Fallback: If 32 steps are expected but only 16 or fewer are provided (or the second half is empty),
  // we can intelligently handle it. However, the user specifically wants to see ticks for all 32 bars.
  // If the AI provided steps only up to 16, we'll repeat them for 17-32 if 17-32 is empty.
  const safeSteps = Array.isArray(steps) ? steps : [];
  let effectiveSteps = [...safeSteps];
  if (totalSteps === 32) {
    const hasSecondHalf = safeSteps.some(s => typeof s === 'number' ? s > 16 : s.step > 16);
    if (!hasSecondHalf && safeSteps.length > 0) {
      const secondHalf = safeSteps.map(s => typeof s === 'number' ? s + 16 : { ...s, step: s.step + 16 });
      effectiveSteps = [...safeSteps, ...secondHalf];
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{label}</span>
      </div>
      
      <div className="overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 custom-scrollbar overflow-y-hidden">
        <div className={`flex gap-1 sm:gap-1.5 ${totalSteps === 32 ? 'min-w-[700px] sm:min-w-[850px]' : 'min-w-[380px] sm:min-w-[450px]'} sm:min-w-full py-2 pr-4 sm:pr-10`}>
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepNum = i + 1;
            const stepData = effectiveSteps.find(s => typeof s === 'number' ? s === stepNum : s.step === stepNum);
            const isActive = !!stepData;
            const isBeat = stepNum % 4 === 1;
            
            // Use provided velocity if available, otherwise fallback to humanized math or 0
            const velocity = isActive 
              ? (typeof stepData === 'object' && stepData.velocity !== undefined 
                  ? stepData.velocity 
                  : Math.floor(60 + (Math.sin(stepNum * 12.5) * 20 + 20))) 
              : 0;
            
            // Calculate swing offset for even steps
            const isEven = stepNum % 2 === 0;
            const swingOffset = showSwingView && isEven ? (swing / 100) * 40 : 0;
            
            return (
              <div 
                key={i} 
                className="flex flex-col flex-1 gap-1 group transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${swingOffset}%)` }}
              >
                {/* Velocity Bar */}
                <div className={`flex flex-col justify-end items-center transition-all duration-500 ${showVelocity ? 'h-12 sm:h-16 opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
                  {isActive && (
                    <>
                      <span className={`text-[8px] sm:text-[9px] font-mono font-bold transition-opacity mb-1 ${textColor}`}>
                        {velocity}%
                      </span>
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-500 ${color} opacity-50 group-hover:opacity-80`}
                        style={{ height: `${velocity}%` }}
                      />
                    </>
                  )}
                </div>

                {/* Step Box */}
                <div 
                  className={`
                    relative h-8 sm:h-10 rounded-md transition-all duration-300 flex items-center justify-center
                    ${isActive ? color : 'bg-black/5 dark:bg-white/5'}
                    ${isBeat && !isActive ? 'border-l-2 border-black/10 dark:border-white/10' : ''}
                    ${isActive ? 'shadow-sm scale-[1.02]' : ''}
                  `}
                >
                  <span className={`text-[9px] sm:text-[10px] font-mono font-bold transition-opacity ${isActive ? 'text-white opacity-90' : 'text-black/30 dark:text-white/30 opacity-0 group-hover:opacity-100'}`}>
                    {stepNum}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SwingMeter = ({ label, percentage, colorClass }: { label: string, percentage: number, colorClass: string }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((percentage || 0) / 100) * circumference;
  return (
    <div className="text-center flex flex-col items-center gap-2">
      <div className={`relative inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24`}>
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-black/10 dark:text-white/10"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-xl sm:text-2xl font-black font-mono ${colorClass}`}>{percentage || 0}</span>
          <span className="text-[8px] font-bold opacity-70">%</span>
        </div>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{label}</div>
    </div>
  );
};

export const DrumPatternDisplay: React.FC<DrumPatternDisplayProps> = ({ patterns, theme, dawType, recipeTitle = 'Beat', bpm = 120, detectedSectionLengths }) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<keyof typeof patterns>('hook');
  const [localToggles, setLocalToggles] = useState<Record<string, { velocity: boolean, swingView: boolean }>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingOneShotId, setPlayingOneShotId] = useState<string | null>(null);

  // Load user's Sample Vault items (with fallback to Cosmos factory samples)
  const vaultSamples: SampleVaultItem[] = useMemo(() => {
    try {
      const saved = localStorage.getItem('bg_sample_vault_items');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed && parsed.length > 0 ? parsed : DEFAULT_COSMOS_FACTORY_SAMPLES;
    } catch {
      return DEFAULT_COSMOS_FACTORY_SAMPLES;
    }
  }, []);

  // Compute matched beat kit from user's vault
  const matchedKit: MatchedBeatKit = useMemo(() => {
    return matchBeatKitFromVault(recipeTitle, vaultSamples, undefined, bpm);
  }, [recipeTitle, bpm, vaultSamples]);

  useEffect(() => {
    // Stop playback when switching sections
    if (isPlaying) {
      stopMidiPreview();
      setIsPlaying(false);
    }
  }, [activeSection]);

  useEffect(() => {
    return () => {
      stopAllVaultAudio();
    };
  }, []);

  const handlePlayOneShot = (sample: SampleVaultItem) => {
    if (playingOneShotId === sample.id) {
      stopAllVaultAudio();
      setPlayingOneShotId(null);
      return;
    }
    setPlayingOneShotId(sample.id);
    playVaultOneShot(sample, 0.9, () => {
      setPlayingOneShotId(prev => (prev === sample.id ? null : prev));
    });
  };

  if (!patterns) return null;

  const sections: (keyof typeof patterns)[] = ['intro', 'verse', 'hook', 'bridge', 'outro'];
  const currentPattern = patterns[activeSection];

  const activeColor = theme === 'chef-mode' ? 'bg-orange-500' : 
                      theme === 'hustle-time' ? 'bg-yellow-500' : 
                      theme === 'crazy-bird' ? 'bg-red-500' : 'bg-sky-500';
  
  const activeText = theme === 'chef-mode' ? 'text-orange-500' : 
                     theme === 'hustle-time' ? 'text-yellow-500' : 
                     theme === 'crazy-bird' ? 'text-red-500' : 'text-sky-500';

  const currentToggles = localToggles[activeSection] || {
    velocity: currentPattern?.velocityHumanized || false,
    swingView: false
  };

  const getStepsPerBar = (isDoubleTime?: boolean) => isDoubleTime ? 32 : 16;
  let finalBars = 1;
  const checkMaxBars = (part: any) => {
    if (!part || !Array.isArray(part.steps)) return;
    const stepsPerBar = getStepsPerBar(part.isDoubleTime);
    part.steps.forEach((s: any) => {
      const stepNum = typeof s === 'number' ? s : s.step;
      const b = Math.ceil(stepNum / stepsPerBar);
      if (b > finalBars) finalBars = b;
    });
  };
  checkMaxBars(currentPattern?.kick);
  checkMaxBars(currentPattern?.snare);
  checkMaxBars(currentPattern?.hiHat);
  checkMaxBars(currentPattern?.openHat);
  checkMaxBars(currentPattern?.perc);
  checkMaxBars(currentPattern?.cymbal);

  const handleToggleVelocity = () => {
    setLocalToggles(prev => ({
      ...prev,
      [activeSection]: { ...currentToggles, velocity: !currentToggles.velocity }
    }));
  };

  const handleToggleSwingView = () => {
    setLocalToggles(prev => ({
      ...prev,
      [activeSection]: { ...currentToggles, swingView: !currentToggles.swingView }
    }));
  };

  const activeSectionBars = detectedSectionLengths?.[activeSection] !== undefined
    ? detectedSectionLengths[activeSection]!
    : finalBars;

  const getDrumMidiBaseData = () => {
    return generateDrumMidiBaseData(currentPattern, recipeTitle, activeSection, bpm, currentToggles.velocity, activeSectionBars as any);
  };

  const handlePlay = () => {
    initAudio();
    if (isPlaying) {
      stopMidiPreview();
      setIsPlaying(false);
      return;
    }

    const midiBytes = getDrumMidiBaseData();
    setIsPlaying(true);
    playMidiPreview(midiBytes, 'Drums', () => {
      setIsPlaying(false);
    });
  };

  const handleDownloadAllDrumPatterns = async () => {
    const JSZip = await getJSZip();
    const saveAs = await getSaveAs();
    const zip = new JSZip();
    const isStudioOne = dawType === 'Studio One';
    const extension = 'mid';

    // 1. Generate section MIDI files
    for (const section of sections) {
      const pattern = patterns[section];
      if (!pattern) continue;

      let sBars = 4;
      const sCheckMaxBars = (part: any) => {
        if (!part || !Array.isArray(part.steps)) return;
        const stepsPerBar = getStepsPerBar(part.isDoubleTime);
        part.steps.forEach((s: any) => {
          const stepNum = typeof s === 'number' ? s : s.step;
          const b = Math.ceil(stepNum / stepsPerBar);
          if (b > sBars) sBars = b;
        });
      };
      sCheckMaxBars(pattern.kick);
      sCheckMaxBars(pattern.snare);
      sCheckMaxBars(pattern.hiHat);
      sCheckMaxBars(pattern.openHat);
      sCheckMaxBars(pattern.perc);
      sCheckMaxBars(pattern.cymbal);

      const sectionBars = detectedSectionLengths?.[section] !== undefined
        ? detectedSectionLengths[section]!
        : sBars;

      const midiBytes = generateDrumMidiBaseData(pattern, recipeTitle, section as string, bpm, pattern.velocityHumanized || false, sectionBars as any);
      const fileName = `${recipeTitle.replace(/\s+/g, '_')}_${String(section)}_Drums_${sectionBars}Bar_${bpm}BPM.${extension}`;
      
      zip.file(fileName, midiBytes);
    }

    // 2. Generate VAULT_ONE_SHOT_MAPPINGS.txt for sampler assignment
    const padSlots = [
      { pad: 'Pad 1 (C1 / Note 36)', role: 'Kick Drum', data: matchedKit.slots.kick },
      { pad: 'Pad 2 (D1 / Note 38)', role: 'Snare / Main Clap', data: matchedKit.slots.snareClap },
      { pad: 'Pad 3 (F#1 / Note 42)', role: 'Closed Hi-Hat', data: matchedKit.slots.closedHat },
      { pad: 'Pad 4 (A#1 / Note 46)', role: 'Open Hi-Hat / Cymbal', data: matchedKit.slots.openHat },
      { pad: 'Pad 5 (C#1 / Note 37)', role: 'Sub Bass / 808', data: matchedKit.slots.bass },
      { pad: 'Pad 6 (G#1 / Note 44)', role: 'Percussion / Shaker', data: matchedKit.slots.perc },
    ];

    let mappingDoc = `========================================================================\n`;
    mappingDoc += ` BEATGANGSTA STUDIO - VAULT ONE-SHOT KIT MAPPINGS & SOUND DESIGN\n`;
    mappingDoc += `========================================================================\n\n`;
    mappingDoc += `Groove Recipe: ${recipeTitle}\n`;
    mappingDoc += `Style Reference: ${matchedKit.style.name} (${matchedKit.style.genre})\n`;
    mappingDoc += `Tempo: ${bpm} BPM | Key Center: ${matchedKit.inferredKey}\n`;
    mappingDoc += `Acoustic Summary: ${matchedKit.vibeSummary}\n\n`;

    mappingDoc += `------------------------------------------------------------------------\n`;
    mappingDoc += `SAMPLER PAD LAYOUT (MPC / Maschine / Ableton Drum Rack / FL Studio FPC)\n`;
    mappingDoc += `------------------------------------------------------------------------\n`;

    padSlots.forEach(({ pad, role, data }) => {
      mappingDoc += `\n[${pad}] -> ${role.toUpperCase()}\n`;
      if (data?.sample) {
        const s = data.sample;
        mappingDoc += `  Sample Name: ${s.name}\n`;
        mappingDoc += `  Category: ${s.category.toUpperCase()} (${s.exactType || 'One-Shot'})\n`;
        mappingDoc += `  Punch / Fundamental: ${s.punchFrequencyHz || s.fundamentalHz || 'N/A'} Hz (Detected Key: ${s.detectedKey || 'N/A'})\n`;
        mappingDoc += `  Decay Envelope: ${s.decayMs || 'N/A'} ms\n`;
        mappingDoc += `  Match Synergy: ${data.matchScore}% Match\n`;
        if (data.recommendedTuningSemitones !== undefined && data.recommendedTuningSemitones !== 0) {
          mappingDoc += `  Sampler Pitch Offset: ${data.recommendedTuningSemitones > 0 ? '+' : ''}${data.recommendedTuningSemitones} semitones (tune to lock with song key ${matchedKit.inferredKey})\n`;
        }
        mappingDoc += `  Pairing Synergy: ${data.reason}\n`;
        if (data.uadChain && data.uadChain.length > 0) {
          mappingDoc += `  UAD Digital Channel Strip Settings:\n`;
          data.uadChain.forEach(tip => {
            mappingDoc += `    * ${tip}\n`;
          });
        }
      } else {
        mappingDoc += `  No specific sample assigned in this slot.\n`;
      }
    });

    mappingDoc += `\n========================================================================\n`;
    mappingDoc += ` MASTER DRUM BUS GLUE & MIXING RECIPE (UAD DIGITAL GUI CONTROLS)\n`;
    mappingDoc += `========================================================================\n`;
    mappingDoc += `Bus Compressor: ${matchedKit.uadDrumBusRecipe.busCompressor}\n`;
    mappingDoc += `Bus Equalizer: ${matchedKit.uadDrumBusRecipe.busEq}\n`;
    mappingDoc += `Tape Saturation: ${matchedKit.uadDrumBusRecipe.tapeSaturation}\n`;
    mappingDoc += `Glue Tip: ${matchedKit.uadDrumBusRecipe.glueTip}\n\n`;
    mappingDoc += `RULE VERIFICATION: All listed parameters correspond strictly to official\n`;
    mappingDoc += `digital software plugin GUI knobs and switches (no analog-only chassis wiring).\n`;

    zip.file('VAULT_ONE_SHOT_MAPPINGS.txt', mappingDoc);

    // 3. Collect and embed any available one-shot audio files into One-Shots/
    const oneShotsFolder = zip.folder('One-Shots');
    if (oneShotsFolder) {
      oneShotsFolder.file(
        'README_ONE_SHOTS.txt',
        `Drag these one-shots directly into your DAW sampler or drum rack pads (Pad 1 = Kick, Pad 2 = Snare/Clap, Pad 3 = Closed Hat, Pad 4 = Open Hat, Pad 5 = 808, Pad 6 = Perc).\nRefer to VAULT_ONE_SHOT_MAPPINGS.txt in the root directory for exact tuning and UAD channel strip recipes!`
      );

      for (let i = 0; i < padSlots.length; i++) {
        const slot = padSlots[i];
        const sample = slot.data?.sample;
        if (!sample || !sample.fileUrl) continue;

        const safeSampleName = sample.name.replace(/[^a-z0-9_-]/gi, '_');
        const fileName = `Pad${i + 1}_${slot.role.replace(/[^a-z0-9]/gi, '_')}_${safeSampleName}.wav`;

        try {
          if (sample.fileUrl.startsWith('data:audio')) {
            const base64Data = sample.fileUrl.split(',')[1];
            if (base64Data) {
              oneShotsFolder.file(fileName, base64Data, { base64: true });
            }
          } else if (sample.fileUrl.startsWith('blob:') || sample.fileUrl.startsWith('http')) {
            const res = await fetch(sample.fileUrl);
            if (res.ok) {
              const blobData = await res.blob();
              oneShotsFolder.file(fileName, blobData);
            }
          }
        } catch {
          // If network fetch fails, continue without blocking zip generation
        }
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${recipeTitle.replace(/\s+/g, '_')}_All_Drum_Patterns.zip`);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${activeColor} animate-pulse`} />
          <div className="flex flex-col">
            <h4 className="text-xs font-black uppercase tracking-widest opacity-70">{t('drum_protocols')}</h4>
          </div>
          <button
            onClick={handleDownloadAllDrumPatterns}
            className={`ml-2 flex items-center gap-1.5 px-2 py-1 rounded-md transition-all hover:scale-105 text-[10px] font-bold uppercase tracking-widest ${
              theme === 'coldest' ? 'bg-sky-100 text-sky-700 hover:bg-sky-200 border border-sky-200' : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10'
            }`}
            title={t('download_all_drum_patterns') || "Download all drum patterns"}
          >
            <Download className="w-3 h-3" />
            <span>{t('download_all')}</span>
          </button>
        </div>
        
        <div className="flex overflow-x-auto w-full sm:w-auto no-scrollbar justify-start sm:justify-center gap-1 bg-black/5 dark:bg-white/5 p-1.5 rounded-xl">
          {sections.map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`
                px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap
                ${activeSection === section 
                  ? `${activeColor} text-white shadow-md scale-105` 
                  : 'opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'}
              `}
            >
              {t(section)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={handlePlay}
          className={`
            flex items-center gap-3 px-8 py-4 text-sm font-black uppercase tracking-widest rounded-2xl transition-all
            ${isPlaying 
              ? 'bg-red-500 text-white shadow-lg scale-105' 
              : `${activeColor} text-white shadow-lg hover:scale-105 hover:shadow-xl active:scale-95`}
          `}
        >
          {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? t('stop_pattern') : t('play_pattern')}</span>
        </button>
      </div>

      {!currentPattern ? (
        <div className="p-12 text-center text-xs opacity-50 font-bold uppercase tracking-widest border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl">
          {t('drum_pattern_not_available', { section: activeSection })}
        </div>
      ) : (
        <>
          <div className="flex flex-col xl:flex-row gap-4 xl:gap-12">
            <div className="flex flex-col gap-4 p-3 sm:p-4 rounded-2xl bg-black/5 dark:bg-white/5 w-full xl:w-64">
              <div className="flex flex-row xl:flex-col gap-2 sm:gap-4 items-center justify-between xl:justify-center overflow-x-auto no-scrollbar pb-2 xl:pb-0">
                <SwingMeter label={t('hi_hats')} percentage={currentPattern.swing?.hiHat || 0} colorClass={activeText} />
                <SwingMeter label={currentPattern.snare?.isClap ? t('clap') : t('snare')} percentage={currentPattern.swing?.snare || 0} colorClass={activeText} />
                <SwingMeter label={t('kick')} percentage={currentPattern.swing?.kick || 0} colorClass={activeText} />
              </div>
              
              <div className="pt-2 sm:pt-4 border-t border-black/5 dark:border-white/5 w-full flex flex-col items-center gap-2">
                <button 
                  onClick={handleToggleSwingView}
                  className={`flex flex-row xl:flex-col items-center justify-center gap-3 xl:gap-1.5 p-2 rounded-xl transition-all w-full ${currentToggles.swingView ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{t('swing_view')}</span>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${currentToggles.swingView ? activeColor : 'bg-black/20 dark:bg-white/20'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${currentToggles.swingView ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-10 overflow-hidden">
              <StepGrid 
                steps={currentPattern.hiHat?.steps || []} 
                totalSteps={getStepsPerBar(currentPattern.hiHat?.isDoubleTime) * finalBars} 
                label={t('hi_hats')}
                color={activeColor}
                textColor={activeText}
                showVelocity={currentToggles.velocity}
                swing={currentPattern.swing?.hiHat || 0}
                showSwingView={currentToggles.swingView}
              />
              
              <StepGrid 
                steps={currentPattern.snare?.steps || []} 
                totalSteps={getStepsPerBar(currentPattern.snare?.isDoubleTime) * finalBars} 
                label={currentPattern.snare?.isClap ? t('clap') : t('snare')}
                color={activeColor}
                textColor={activeText}
                showVelocity={currentToggles.velocity}
                swing={currentPattern.swing?.snare || 0}
                showSwingView={currentToggles.swingView}
              />
 
              <StepGrid 
                steps={currentPattern.kick?.steps || []} 
                totalSteps={getStepsPerBar(currentPattern.kick?.isDoubleTime) * finalBars} 
                label={t('kick')}
                color={activeColor}
                textColor={activeText}
                showVelocity={currentToggles.velocity}
                swing={currentPattern.swing?.kick || 0}
                showSwingView={currentToggles.swingView}
              />
            </div>
          </div>
          
          <div className="mt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-t border-black/5 dark:border-white/5 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto cursor-pointer group p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors" onClick={handleToggleVelocity}>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t('velocity_humanize')}</span>
                <div className={`w-10 h-5 rounded-full p-1 transition-colors ${currentToggles.velocity ? activeColor : 'bg-black/20 dark:bg-white/20'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${currentToggles.velocity ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end text-[10px] opacity-50 font-mono w-full lg:w-auto bg-black/5 dark:bg-white/5 p-3 rounded-xl">
              <span>{t('one_bar_loop')}</span>
              <span>{currentPattern.hiHat?.isDoubleTime ? t('double_time_steps') : t('normal_steps')}</span>
            </div>
          </div>

          {/* VAULT ONE-SHOT ASSIGNMENTS FOR THIS GROOVE */}
          <div className="mt-8 pt-8 border-t border-black/10 dark:border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-transparent p-4 rounded-2xl border border-purple-500/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">
                    🎯 Vault One-Shot Assignments for this Groove
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
                    {matchedKit.style.name}
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/70">
                  Auto-curated from your Sample Vault using transient punch analysis and harmonic tuning for "{recipeTitle}" ({bpm} BPM, Key {matchedKit.inferredKey}).
                </p>
              </div>
              <button
                onClick={handleDownloadAllDrumPatterns}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 whitespace-nowrap self-start sm:self-auto"
                title="Download full package with MIDI files, VAULT_ONE_SHOT_MAPPINGS.txt, and one-shot audio files"
              >
                <FolderDown className="w-4 h-4" />
                <span>Download Kit & MIDI (.zip)</span>
              </button>
            </div>

            {/* Pad Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { padNum: '1', role: 'Kick Drum', midiNote: 'C1 (36)', data: matchedKit.slots.kick, accent: 'text-sky-400', border: 'border-sky-500/30 bg-sky-950/20 hover:border-sky-400' },
                { padNum: '2', role: matchedKit.slots.snareClap?.category === 'claps' ? 'Hand Clap' : 'Snare Drum', midiNote: 'D1 (38)', data: matchedKit.slots.snareClap, accent: 'text-pink-400', border: 'border-pink-500/30 bg-pink-950/20 hover:border-pink-400' },
                { padNum: '3', role: 'Closed Hi-Hat', midiNote: 'F#1 (42)', data: matchedKit.slots.closedHat, accent: 'text-amber-400', border: 'border-amber-500/30 bg-amber-950/20 hover:border-amber-400' },
                { padNum: '4', role: 'Open Hi-Hat', midiNote: 'A#1 (46)', data: matchedKit.slots.openHat, accent: 'text-emerald-400', border: 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400' },
                { padNum: '5', role: 'Sub Bass / 808', midiNote: 'C#1 (37)', data: matchedKit.slots.bass, accent: 'text-violet-400', border: 'border-violet-500/30 bg-violet-950/20 hover:border-violet-400' },
                { padNum: '6', role: 'Percussion / Foley', midiNote: 'G#1 (44)', data: matchedKit.slots.perc, accent: 'text-cyan-400', border: 'border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-400' },
              ].map(({ padNum, role, midiNote, data, accent, border }) => {
                const sample = data?.sample;
                const isThisPlaying = sample && playingOneShotId === sample.id;

                return (
                  <div
                    key={padNum}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${border} ${
                      isThisPlaying ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/20' : ''
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-black/40 border border-white/10 text-white/90">
                            PAD {padNum}
                          </span>
                          <span className="text-[9px] font-mono text-white/50">{midiNote}</span>
                        </div>
                        {data?.matchScore !== undefined && (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{data.matchScore}% Match</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <div className={`text-[11px] font-black uppercase tracking-wider ${accent}`}>{role}</div>
                        <div className="text-xs font-bold text-white truncate" title={sample?.name}>
                          {sample?.name || 'Standard Vault One-Shot'}
                        </div>
                      </div>

                      {/* Acoustic Badges */}
                      {sample && (
                        <div className="flex flex-wrap gap-1 text-[9px] font-mono">
                          {sample.punchFrequencyHz && (
                            <span className="px-1.5 py-0.5 rounded bg-black/30 border border-white/5 text-sky-300">
                              Punch: {sample.punchFrequencyHz}Hz
                            </span>
                          )}
                          {sample.detectedKey && (
                            <span className="px-1.5 py-0.5 rounded bg-black/30 border border-white/5 text-purple-300">
                              Key: {sample.detectedKey}
                            </span>
                          )}
                          {sample.decayMs && (
                            <span className="px-1.5 py-0.5 rounded bg-black/30 border border-white/5 text-emerald-300">
                              Decay: {sample.decayMs}ms
                            </span>
                          )}
                          {data?.recommendedTuningSemitones !== undefined && data.recommendedTuningSemitones !== 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-bold">
                              Tune: {data.recommendedTuningSemitones > 0 ? '+' : ''}{data.recommendedTuningSemitones} st
                            </span>
                          )}
                        </div>
                      )}

                      {/* UAD Mixing Tip */}
                      {data?.uadChain && data.uadChain.length > 0 && (
                        <div className="text-[10px] text-white/70 line-clamp-2 italic bg-black/30 p-1.5 rounded border border-white/5">
                          🎛️ {data.uadChain[0]}
                        </div>
                      )}
                    </div>

                    {/* Audition Button */}
                    {sample && (
                      <button
                        onClick={() => handlePlayOneShot(sample)}
                        className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                          isThisPlaying
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 active:scale-95'
                        }`}
                      >
                        {isThisPlaying ? (
                          <>
                            <Square className="w-3 h-3 fill-white" />
                            <span>Stop Audition</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Audition Pad {padNum}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drum Bus Glue Recipe Banner */}
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] space-y-1.5 text-white/90">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>UAD Master Drum Bus Glue: {matchedKit.uadDrumBusRecipe.busCompressor}</span>
              </div>
              <div className="text-[10px] opacity-80 leading-relaxed">
                <strong>EQ & Tape Saturation:</strong> {matchedKit.uadDrumBusRecipe.busEq} • {matchedKit.uadDrumBusRecipe.tapeSaturation}
              </div>
              <div className="text-purple-200/90 text-[10px] italic">
                💡 {matchedKit.uadDrumBusRecipe.glueTip}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
