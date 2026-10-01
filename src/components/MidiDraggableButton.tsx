import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Music, Play, Square, Sparkles } from 'lucide-react';
import MidiWriter from 'midi-writer-js';
import { generateMidiTrack, generateFullSongMidiTrack, generateFullSongDrumPartMidi, PatternLength, PatternVariation, generateAudioLoop } from '../utils/midiGenerator';
import { AppTheme, MidiNote, DrumPattern } from '../types';
import { playMidiPreview, stopMidiPreview, initAudio, resumeAudio } from '../utils/midiPlayer';
import { ErrorModal } from './ErrorModal';

interface MidiDraggableButtonProps {
  instrument: string;
  loopGuide?: string;
  bpm: number;
  bars?: PatternLength;
  variation?: PatternVariation;
  recipeTitle: string;
  theme: AppTheme;
  dawType?: string | null;
  activeSection?: string;
  isFullSong?: boolean;
  drumPart?: 'kick' | 'snare' | 'hiHat' | 'openHat' | 'perc' | 'clap' | 'cymbal';
  drumPatterns?: {
    intro?: DrumPattern;
    verse?: DrumPattern;
    hook?: DrumPattern;
    bridge?: DrumPattern;
    outro?: DrumPattern;
  };
  detectedSectionLengths?: Record<string, number>;
  midiNotes?: {
    intro?: MidiNote[];
    verse?: MidiNote[];
    hook?: MidiNote[];
    bridge?: MidiNote[];
    outro?: MidiNote[];
  } | MidiNote[];
}

export const MidiDraggableButton: React.FC<MidiDraggableButtonProps> = ({
  instrument,
  loopGuide = '',
  bpm,
  bars = 4,
  variation = 'A',
  recipeTitle,
  theme,
  dawType,
  activeSection = 'hook',
  isFullSong = false,
  drumPart,
  drumPatterns,
  detectedSectionLengths,
  midiNotes
}) => {
  const { t } = useTranslation();
  const [preparedData, setPreparedData] = React.useState<{ url: string, fileName: string, mimeType: string, midiBytes: Uint8Array } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; title: string; message: string; stack?: string }>({
    isOpen: false,
    title: '',
    message: '',
    stack: ''
  });

  const totalBars = detectedSectionLengths 
    ? Object.values(detectedSectionLengths).reduce((acc, b) => acc + (b || 0), 0) 
    : 48;

  const prepareMidiData = async () => {
    try {
      if (drumPart && drumPatterns) {
        const midiBytes = generateFullSongDrumPartMidi(drumPatterns, drumPart, recipeTitle, bpm, detectedSectionLengths);
        const fileName = `${recipeTitle.replace(/\s+/g, '_')}_${drumPart.toUpperCase()}_FullSong_${bpm}BPM.mid`;
        const blob = new Blob([midiBytes], { type: 'audio/midi' });
        const downloadUrl = URL.createObjectURL(blob);
        const mimeType = 'audio/midi';
        const newData = { url: downloadUrl, fileName, mimeType, midiBytes };
        setPreparedData(newData);
        return newData;
      }

      let track: MidiWriter.Track;
      let fileName: string;

      if (isFullSong) {
        track = generateFullSongMidiTrack(instrument, bpm, recipeTitle, midiNotes, detectedSectionLengths, loopGuide);
        fileName = `${recipeTitle.replace(/\s+/g, '_')}_${instrument.replace(/\s+/g, '_')}_FullSong_${bpm}BPM.mid`;
      } else {
        let sectionMidiNotes: MidiNote[] | undefined = undefined;
        if (Array.isArray(midiNotes)) {
          sectionMidiNotes = midiNotes;
        } else if (midiNotes) {
          sectionMidiNotes = (midiNotes as any)[activeSection] || midiNotes.hook || midiNotes.verse || [];
        }

        track = generateMidiTrack(instrument, loopGuide, bpm, bars, variation, recipeTitle, sectionMidiNotes);
        const sectionSuffix = activeSection ? `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}_` : '';
        fileName = `${recipeTitle.replace(/\s+/g, '_')}_${instrument.replace(/\s+/g, '_')}_${sectionSuffix}${bars}Bar_${variation}_${bpm}BPM.mid`;
      }

      const write = new MidiWriter.Writer([track]);
      const midiBytes = write.buildFile();
      
      const blob = new Blob([midiBytes], { type: 'audio/midi' });
      const downloadUrl = URL.createObjectURL(blob);
      const mimeType = 'audio/midi';

      const newData = { url: downloadUrl, fileName, mimeType, midiBytes };
      setPreparedData(newData);
      return newData;
    } catch (error) {
      const detailedError = new Error(
        `Failed to prepare MIDI data for instrument '${instrument}'.\n` +
        `Bars: ${bars}, Variation: ${variation}, BPM: ${bpm}\n` +
        `Original error: ${error instanceof Error ? error.message : String(error)}\n` +
        `Stack: ${error instanceof Error ? error.stack : 'N/A'}`
      );
      console.error("Detailed MIDI Preparation Error:", detailedError);
      return null;
    }
  };

  // Clean up URL on unmount
  React.useEffect(() => {
    return () => {
      if (preparedData) {
        URL.revokeObjectURL(preparedData.url);
      }
    };
  }, [preparedData]);

  const handleDownload = async () => {
    let data = preparedData;
    if (!data) {
      data = await prepareMidiData() || undefined;
    }
    
    if (!data) return;

    const link = document.createElement('a');
    link.href = data.url;
    link.download = data.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (preparedData) {
      // Fix: Don't prepend window.location.origin to blob URLs
      e.dataTransfer.setData('DownloadURL', `${preparedData.mimeType}:${preparedData.fileName}:${preparedData.url}`);
      // Some DAWs also like the file name in plain text
      e.dataTransfer.setData('text/plain', preparedData.fileName);
    }
  };

  const handlePlay = async () => {
    // Synchronously initialize audio context on user gesture
    initAudio();
    await resumeAudio();

    if (isPlaying) {
      stopMidiPreview();
      setIsPlaying(false);
      return;
    }

    let data = preparedData;
    if (!data) {
      data = await prepareMidiData() || undefined;
    }

    if (!data) return;

    console.log(`Playing MIDI preview for ${instrument}. Bytes length: ${data.midiBytes.length}`);
    setIsPlaying(true);
    try {
      await playMidiPreview(data.midiBytes, instrument, () => {
        setIsPlaying(false);
      });
    } catch (error) {
      console.error("Failed to play MIDI preview:", error);
      setIsPlaying(false);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const stackTrace = error instanceof Error ? error.stack : '';
      setErrorModal({
        isOpen: true,
        title: t('playback_error'),
        message: errorMessage,
        stack: stackTrace
      });
    }
  };

  return (
    <>
      <div className={`flex items-center rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg border ${
        isFullSong
          ? (theme === 'coldest' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 border-sky-300 text-white ring-2 ring-sky-400/40' : 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-300 text-white ring-2 ring-amber-400/40')
          : (theme === 'coldest' ? 'bg-sky-500 border-sky-400 text-white' : 
             theme === 'crazy-bird' ? 'bg-red-600 border-red-500 text-white' :
             theme === 'hustle-time' ? 'bg-emerald-600 border-emerald-500 text-white' :
             'bg-orange-500 border-orange-400 text-white')
      }`}>
      <button
        onClick={handlePlay}
        onMouseEnter={prepareMidiData}
        className="flex items-center justify-center p-3 sm:p-2 hover:bg-black/10 transition-colors"
        title={isPlaying ? t('stop_preview') : t('play_preview')}
      >
        {isPlaying ? <Square className="w-4 h-4 sm:w-3 sm:h-3 fill-current" /> : <Play className="w-4 h-4 sm:w-3 sm:h-3 fill-current" />}
      </button>
      <button
        onClick={handleDownload}
        onMouseEnter={prepareMidiData}
        draggable={!!preparedData}
        onDragStart={handleDragStart}
        className={`flex items-center gap-1.5 px-4 sm:px-3 py-2 sm:py-1 hover:bg-black/10 transition-colors cursor-grab active:cursor-grabbing text-[10px] font-black uppercase tracking-widest ${isFullSong ? 'py-2.5 px-5 text-xs' : ''}`}
        title={isFullSong ? `Drag or Download Full Song MIDI for ${instrument} (${totalBars} Bars)` : t('download_midi_title', { bars, variation, instrument })}
      >
        {isFullSong ? <Sparkles className="w-3.5 h-3.5 animate-pulse" /> : <Music className="w-3 h-3" />}
        <span>{isFullSong ? (drumPart ? `⚡ FULL SONG ${drumPart.toUpperCase()} MIDI` : `⚡ FULL SONG MIDI (${totalBars} BARS)`) : (activeSection ? `${activeSection.toUpperCase()} (${bars}B)` : `${bars} ${t('bar_label')} ${variation}`)}</span>
      </button>
    </div>
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
        title={errorModal.title}
        errorMessage={errorModal.message}
        stackTrace={errorModal.stack}
        theme={theme}
      />
    </>
  );
};
