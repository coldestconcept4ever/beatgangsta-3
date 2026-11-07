import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Play, Square, Download, Activity, Music, Check, Copy, Sliders, ExternalLink } from 'lucide-react';
import { BeatRecipe, AppTheme, MidiNote } from '../types';
import { getBeats, generateMidiTrack, generateFullSongMidiTrack, generateFullSongDrumPartMidi, getFullSongArrangement } from '../utils/midiGenerator';
import { playMidiPreview, stopMidiPreview, initAudio, resumeAudio } from '../utils/midiPlayer';

interface MidiInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: BeatRecipe;
  theme: AppTheme;
}

interface ParsedNoteEvent {
  index: number;
  section: string;
  bar: number;
  beatInBar: number;
  totalBeat: number;
  pitch: string;
  durationStr: string;
  beats: number;
  waitStr: string;
  waitBeats: number;
  velocity: number;
}

interface TrackInfo {
  id: string;
  name: string;
  type: 'synth' | 'bass' | 'chords' | 'drums' | 'lead';
  loopGuide?: string;
  rawNotes?: any;
  events: ParsedNoteEvent[];
  totalBeats: number;
  totalBars: number;
  drumPart?: 'kick' | 'snare' | 'hiHat' | 'openHat' | 'perc' | 'clap';
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const pitchToMidiNum = (pitch: string): number => {
  const match = pitch.trim().match(/^([A-G][b#]?)(-1|\d)$/);
  if (!match) return 60;
  let note = match[1];
  const octave = parseInt(match[2], 10);
  const flatMap: Record<string, string> = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
  if (flatMap[note]) note = flatMap[note];
  const idx = NOTE_NAMES.indexOf(note);
  if (idx === -1) return 60;
  return (octave + 1) * 12 + idx;
};

export const MidiInspectorModal: React.FC<MidiInspectorModalProps> = ({
  isOpen,
  onClose,
  recipe,
  theme
}) => {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadBeat, setPlayheadBeat] = useState(0);
  const [syncedToApi, setSyncedToApi] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const playStartTimeRef = useRef<number | null>(null);

  // Parse all tracks from the recipe
  const tracks: TrackInfo[] = useMemo(() => {
    if (!recipe) return [];
    const list: TrackInfo[] = [];

    const instruments = recipe.instruments || [];
    instruments.forEach((inst, idx) => {
      const text = `${inst.name} ${inst.loopGuide || ''}`.toLowerCase();
      let type: TrackInfo['type'] = 'lead';
      if (text.includes('808') || text.includes('bass') || text.includes('sub')) type = 'bass';
      else if (text.includes('chord') || text.includes('pad') || text.includes('keys')) type = 'chords';
      else if (text.includes('drum') || text.includes('kick') || text.includes('snare') || text.includes('hat') || text.includes('clap')) type = 'drums';

      const events: ParsedNoteEvent[] = [];
      let totalBeat = 0;

      // Extract notes (either flat array or section object)
      const rawNotes = inst.midiNotes;
      const noteGroups: { section: string; notes: MidiNote[] }[] = [];

      if (Array.isArray(rawNotes)) {
        noteGroups.push({ section: 'main', notes: rawNotes });
      } else if (rawNotes && typeof rawNotes === 'object') {
        ['intro', 'verse', 'hook', 'bridge', 'outro'].forEach((sec) => {
          if ((rawNotes as any)[sec] && Array.isArray((rawNotes as any)[sec])) {
            noteGroups.push({ section: sec, notes: (rawNotes as any)[sec] });
          }
        });
      }

      // If no explicit notes, synthesize standard 4-bar procedural pattern to inspect
      if (noteGroups.length === 0) {
        const dummyTrack = generateMidiTrack(inst.name, inst.loopGuide || '', recipe.bpm, 4, 'A', recipe.title);
        const subEvents = (dummyTrack.events || []).filter((e: any) => e.pitch);
        const syntheticNotes: MidiNote[] = subEvents.map((e: any) => ({
          pitch: Array.isArray(e.pitch) ? e.pitch.join(', ') : String(e.pitch),
          duration: String(e.duration),
          wait: Array.isArray(e.wait) ? String(e.wait[0]) : String(e.wait || '0'),
          velocity: e.velocity || 100
        }));
        noteGroups.push({ section: 'procedural', notes: syntheticNotes });
      }

      let noteIdx = 1;
      noteGroups.forEach((group) => {
        group.notes.forEach((n) => {
          const waitBeats = getBeats(n.wait);
          const durBeats = getBeats(n.duration) || 0.25;
          totalBeat += waitBeats;

          const bar = Math.floor(totalBeat / 4) + 1;
          const beatInBar = (totalBeat % 4) + 1;

          const pitches = Array.isArray(n.pitch) ? n.pitch : String(n.pitch).split(',').map(p => p.trim());
          pitches.forEach(p => {
            events.push({
              index: noteIdx++,
              section: group.section,
              bar,
              beatInBar: Math.round(beatInBar * 100) / 100,
              totalBeat: Math.round(totalBeat * 100) / 100,
              pitch: p,
              durationStr: String(n.duration),
              beats: Math.round(durBeats * 100) / 100,
              waitStr: String(n.wait || '0'),
              waitBeats: Math.round(waitBeats * 100) / 100,
              velocity: n.velocity || 100
            });
          });

          totalBeat += durBeats;
        });
      });

      const totalBars = Math.max(4, Math.ceil(totalBeat / 4));

      list.push({
        id: `inst-${idx}`,
        name: inst.name,
        type,
        loopGuide: inst.loopGuide,
        rawNotes: inst.midiNotes,
        events,
        totalBeats: Math.round(totalBeat * 100) / 100,
        totalBars
      });
    });

    // Add drum parts from drumPatterns if available
    if (recipe.drumPatterns) {
      const parts: { key: 'kick' | 'snare' | 'hiHat' | 'openHat' | 'clap'; label: string; pitch: string }[] = [
        { key: 'kick', label: 'Kick Drum (Pattern)', pitch: 'C1' },
        { key: 'snare', label: 'Snare / Clap (Pattern)', pitch: 'D1' },
        { key: 'hiHat', label: 'Hi-Hats (Pattern)', pitch: 'F#1' },
        { key: 'openHat', label: 'Open Hat (Pattern)', pitch: 'A#1' }
      ];

      parts.forEach((p, pIdx) => {
        const events: ParsedNoteEvent[] = [];
        let noteIdx = 1;
        const hookPattern = recipe.drumPatterns?.hook || recipe.drumPatterns?.verse || recipe.drumPatterns?.intro;
        const partObj = hookPattern ? (hookPattern as any)[p.key] : null;

        if (partObj && Array.isArray(partObj.steps)) {
          const isDT = !!partObj.isDoubleTime;
          const beatsPerStep = isDT ? 0.125 : 0.25;

          partObj.steps.forEach((s: any) => {
            const stepNum = typeof s === 'number' ? s : s.step;
            const velocity = typeof s === 'object' && s.velocity !== undefined ? s.velocity : 100;
            const beat = (stepNum - 1) * beatsPerStep;
            const bar = Math.floor(beat / 4) + 1;
            const beatInBar = (beat % 4) + 1;

            events.push({
              index: noteIdx++,
              section: 'hook',
              bar,
              beatInBar: Math.round(beatInBar * 100) / 100,
              totalBeat: Math.round(beat * 100) / 100,
              pitch: p.pitch,
              durationStr: isDT ? '32' : '16',
              beats: beatsPerStep,
              waitStr: '0',
              waitBeats: 0,
              velocity
            });
          });
        }

        if (events.length > 0) {
          list.push({
            id: `drum-${pIdx}`,
            name: p.label,
            type: 'drums',
            loopGuide: `Dedicated drum sequence for ${p.label}`,
            events,
            totalBeats: 16,
            totalBars: 4,
            drumPart: p.key
          });
        }
      });
    }

    return list;
  }, [recipe]);

  const activeTrack = tracks[selectedTrackIndex] || tracks[0];

  // Automatically sync to /api/debug-midi on mount/change so server diagnostic log is up-to-date
  useEffect(() => {
    if (!recipe || tracks.length === 0) return;
    const payload = {
      title: recipe.title,
      bpm: recipe.bpm,
      key: recipe.recommendedScale || (recipe as any).scale || 'Unknown',
      detectedSectionLengths: recipe.detectedSectionLengths || {},
      tracks: tracks.map(t => ({
        name: t.name,
        type: t.type,
        notesCount: t.events.length,
        totalBars: t.totalBars,
        totalBeats: t.totalBeats,
        events: t.events.slice(0, 64)
      }))
    };

    fetch('/api/debug-midi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(() => setSyncedToApi(true))
      .catch(err => console.warn('Could not post to /api/debug-midi:', err));
  }, [recipe, tracks]);

  // Audio Playback
  const handlePlayToggle = async () => {
    if (isPlaying) {
      stopMidiPreview();
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setPlayheadBeat(0);
      return;
    }

    if (!activeTrack) return;
    await resumeAudio();

    let midiBytes: Uint8Array;
    if (activeTrack.drumPart && recipe.drumPatterns) {
      midiBytes = generateFullSongDrumPartMidi(
        recipe.drumPatterns,
        activeTrack.drumPart,
        recipe.title,
        recipe.bpm,
        recipe.detectedSectionLengths,
        activeTrack.totalBars
      );
    } else {
      const generatedTrack = generateMidiTrack(
        activeTrack.name,
        activeTrack.loopGuide || '',
        recipe.bpm,
        (Math.min(8, Math.max(4, activeTrack.totalBars)) as any),
        'A',
        recipe.title,
        activeTrack.events.map(e => ({
          pitch: e.pitch,
          duration: e.durationStr,
          wait: e.waitStr,
          velocity: e.velocity
        }))
      );
      const write = new (window as any).MidiWriter.Writer([generatedTrack]);
      midiBytes = write.buildFile();
    }

    setIsPlaying(true);
    playStartTimeRef.current = performance.now();

    const bpm = recipe.bpm || 120;
    const msPerBeat = (60 / bpm) * 1000;
    const totalBeats = activeTrack.totalBeats || 16;

    const animatePlayhead = () => {
      if (!playStartTimeRef.current) return;
      const elapsed = performance.now() - playStartTimeRef.current;
      const curBeat = (elapsed / msPerBeat) % totalBeats;
      setPlayheadBeat(curBeat);
      animationFrameRef.current = requestAnimationFrame(animatePlayhead);
    };
    animationFrameRef.current = requestAnimationFrame(animatePlayhead);

    playMidiPreview(midiBytes, activeTrack.name, () => {
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setPlayheadBeat(0);
    });
  };

  const handleDownloadTrackMidi = () => {
    if (!activeTrack) return;
    let midiBytes: Uint8Array;
    if (activeTrack.drumPart && recipe.drumPatterns) {
      midiBytes = generateFullSongDrumPartMidi(
        recipe.drumPatterns,
        activeTrack.drumPart,
        recipe.title,
        recipe.bpm,
        recipe.detectedSectionLengths,
        activeTrack.totalBars
      );
    } else {
      const generatedTrack = generateFullSongMidiTrack(
        activeTrack.name,
        recipe.bpm,
        recipe.title,
        activeTrack.rawNotes,
        recipe.detectedSectionLengths,
        activeTrack.loopGuide,
        activeTrack.totalBars
      );
      const write = new (window as any).MidiWriter.Writer([generatedTrack]);
      midiBytes = write.buildFile();
    }

    const blob = new Blob([midiBytes], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/\s+/g, '_')}_${activeTrack.name.replace(/\s+/g, '_')}_Audited.mid`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    if (!activeTrack) return;
    navigator.clipboard.writeText(JSON.stringify(activeTrack.events, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  if (!isOpen) return null;

  // Calculate piano roll pitch boundaries
  const pitchesInTrack = activeTrack?.events.map(e => pitchToMidiNum(e.pitch)) || [60];
  const minMidi = Math.max(12, Math.min(...pitchesInTrack) - 2);
  const maxMidi = Math.min(108, Math.max(...pitchesInTrack) + 2);
  const totalMidiRows = Math.max(1, maxMidi - minMidi + 1);

  // Maximum beats displayed in the piano roll view
  const pianoRollBeats = Math.max(16, Math.min(32, activeTrack?.totalBeats || 16));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-950 border border-sky-500/30 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 font-black">
              🎹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">MIDI Inspector & Stem Visualizer</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Exact Note Audit
                </span>
                {syncedToApi && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    <Check className="w-2.5 h-2.5" /> API Synced
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Song: <span className="font-bold text-slate-200">{recipe.title}</span> • {recipe.bpm} BPM • Key: <span className="font-bold text-sky-300">{recipe.recommendedScale || (recipe as any).scale || 'N/A'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/last-midi?format=html"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
              title="Open full-page raw diagnostic HTML audit report"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Open Full HTML Audit</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Track Selector Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 bg-slate-900/40 overflow-x-auto scrollbar-thin">
          {tracks.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => {
                if (isPlaying) stopMidiPreview();
                setIsPlaying(false);
                setPlayheadBeat(0);
                setSelectedTrackIndex(idx);
              }}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                selectedTrackIndex === idx
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 border border-sky-400'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current opacity-80" />
              <span>{track.name}</span>
              <span className="text-[10px] opacity-75">({track.events.length})</span>
            </button>
          ))}
        </div>

        {/* Main Content Area: Piano Roll + Note Inspector */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTrack ? (
            <>
              {/* Playback Controls & Track Summary */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayToggle}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
                      isPlaying
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                    }`}
                  >
                    {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Stop Playback' : 'Audition Stem Synth'}</span>
                  </button>

                  <div className="text-xs font-mono text-slate-300 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                    Position: <span className="font-bold text-sky-400">Bar {Math.floor(playheadBeat / 4) + 1}.{Math.floor(playheadBeat % 4) + 1}</span> ({playheadBeat.toFixed(2)} beats)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownloadTrackMidi}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Stem .MID</span>
                  </button>
                </div>
              </div>

              {/* Piano Roll Grid */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 overflow-x-auto">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-300">
                    <Activity className="w-4 h-4 text-sky-400" />
                    <span>Piano Roll Timeline (Visual Rhythm & Pitches)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Range: {minMidi} - {maxMidi} ({activeTrack.events.length} note events)
                  </span>
                </div>

                <div className="relative min-w-[720px] h-64 bg-slate-950/80 rounded-xl border border-white/5 overflow-hidden">
                  {/* Vertical bar grid lines */}
                  {Array.from({ length: Math.ceil(pianoRollBeats / 4) + 1 }).map((_, barIdx) => (
                    <div
                      key={`bar-${barIdx}`}
                      className="absolute top-0 bottom-0 border-l border-white/15"
                      style={{ left: `${(barIdx * 4 / pianoRollBeats) * 100}%` }}
                    >
                      <span className="absolute top-1 left-1.5 text-[9px] font-mono font-bold text-slate-400">
                        Bar {barIdx + 1}
                      </span>
                    </div>
                  ))}

                  {/* Vertical beat grid lines */}
                  {Array.from({ length: pianoRollBeats }).map((_, beatIdx) => (
                    <div
                      key={`beat-${beatIdx}`}
                      className="absolute top-0 bottom-0 border-l border-white/5"
                      style={{ left: `${(beatIdx / pianoRollBeats) * 100}%` }}
                    />
                  ))}

                  {/* Horizontal pitch lanes */}
                  {Array.from({ length: totalMidiRows }).map((_, rowIdx) => {
                    const midiNum = maxMidi - rowIdx;
                    const noteName = `${NOTE_NAMES[midiNum % 12]}${Math.floor(midiNum / 12) - 1}`;
                    const isSharp = noteName.includes('#');
                    return (
                      <div
                        key={`pitch-${midiNum}`}
                        className={`absolute left-0 right-0 border-b border-white/5 flex items-center pl-1 ${
                          isSharp ? 'bg-white/[0.02]' : 'bg-transparent'
                        }`}
                        style={{
                          top: `${(rowIdx / totalMidiRows) * 100}%`,
                          height: `${(1 / totalMidiRows) * 100}%`
                        }}
                      >
                        <span className="text-[8px] font-mono text-slate-500 select-none">
                          {noteName}
                        </span>
                      </div>
                    );
                  })}

                  {/* Note Blocks */}
                  {activeTrack.events.map((ev, evIdx) => {
                    const midiNum = pitchToMidiNum(ev.pitch);
                    const rowTopPercent = ((maxMidi - midiNum) / totalMidiRows) * 100;
                    const rowHeightPercent = (1 / totalMidiRows) * 100;
                    const leftPercent = (ev.totalBeat / pianoRollBeats) * 100;
                    const widthPercent = Math.max(1, (ev.beats / pianoRollBeats) * 100);

                    return (
                      <div
                        key={evIdx}
                        className="absolute rounded-sm bg-gradient-to-r from-sky-400 to-indigo-400 border border-sky-300 shadow-sm shadow-sky-500/40 hover:brightness-125 transition-all cursor-pointer group z-10"
                        style={{
                          top: `${rowTopPercent}%`,
                          height: `${Math.max(6, rowHeightPercent)}%`,
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                          opacity: 0.95
                        }}
                        title={`#${ev.index}: ${ev.pitch} • Start: Bar ${ev.bar}.${ev.beatInBar} (${ev.totalBeat} beats) • Dur: ${ev.durationStr} (${ev.beats} beats) • Vel: ${ev.velocity}`}
                      >
                        <span className="hidden group-hover:block absolute bottom-full mb-1 left-0 bg-black/90 text-white text-[9px] font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap z-30">
                          {ev.pitch} ({ev.durationStr}, Bar {ev.bar}.{ev.beatInBar})
                        </span>
                      </div>
                    );
                  })}

                  {/* Animated Playhead */}
                  {isPlaying && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-400 shadow-[0_0_8px_#f43f5e] z-20 pointer-events-none transition-transform"
                      style={{
                        left: `${(playheadBeat / pianoRollBeats) * 100}%`
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Note Events Table */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
                <div className="px-5 py-3.5 bg-slate-900 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-sky-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Transcribed Note Events Table
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400">
                    Showing {activeTrack.events.length} notes
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-900/95 border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-4">#</th>
                        <th className="py-2.5 px-4">Section</th>
                        <th className="py-2.5 px-4">Bar.Beat</th>
                        <th className="py-2.5 px-4">Pitch</th>
                        <th className="py-2.5 px-4">Duration</th>
                        <th className="py-2.5 px-4">Beats</th>
                        <th className="py-2.5 px-4">Wait</th>
                        <th className="py-2.5 px-4">Velocity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {activeTrack.events.map((ev) => (
                        <tr key={ev.index} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-2 px-4 text-slate-500">{ev.index}</td>
                          <td className="py-2 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 text-slate-300">
                              {ev.section}
                            </span>
                          </td>
                          <td className="py-2 px-4 font-bold text-sky-400">
                            Bar {ev.bar}.{ev.beatInBar}
                          </td>
                          <td className="py-2 px-4 font-black text-emerald-400 text-sm">
                            {ev.pitch}
                          </td>
                          <td className="py-2 px-4 text-amber-300 font-bold">
                            {ev.durationStr}
                          </td>
                          <td className="py-2 px-4 text-slate-300">
                            {ev.beats}
                          </td>
                          <td className="py-2 px-4 text-slate-400">
                            {ev.waitStr}
                          </td>
                          <td className="py-2 px-4 text-slate-300">
                            {ev.velocity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400">No tracks found.</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Exact Remake Transcriber Active</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
            >
              Close Inspector
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
