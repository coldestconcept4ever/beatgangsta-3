import React, { useState, useRef, useEffect } from 'react';
import { BeatRecipe, AppTheme, VSTPlugin, Hardware } from '../types';
import { DrumPatternDisplay } from './DrumPatternDisplay';
import Markdown from 'react-markdown';
import { regeneratePlugin, regenerateTrackingChain } from '../services/geminiService';

// Dynamic import for react-dom/server
const getRenderToStaticMarkup = () => import('react-dom/server').then(m => m.renderToStaticMarkup);
import { RecipeHTMLTemplate } from './RecipeHTMLTemplate';
import { motion } from 'motion/react';
import { Loader2, Download, Music, Save, Cloud, Search, FileCode, RefreshCw } from 'lucide-react';
import { getSpecificMixHelp, getGangstaVoxRecipe } from '../services/geminiService';
import { MidiDraggableButton } from './MidiDraggableButton';
import { isMidiCapable } from '../utils/midiGenerator';
import { generateAllMidiZip } from '../utils/exportAllMidi';
import { stopMidiPreview } from '../utils/midiPlayer';
import { Play, Square } from 'lucide-react';
import { ErrorModal } from './ErrorModal';
import { useTranslation } from 'react-i18next';

interface RecipeCardProps {
  recipe: BeatRecipe;
  isSaved: boolean;
  onSave: (recipe: BeatRecipe) => void;
  theme?: AppTheme;
  dawType?: string | null;
  plugins?: VSTPlugin[];
  analogHardware?: Hardware[];
  drumKits?: Hardware[];
  onCloudBackupRecipe?: (recipe: BeatRecipe) => Promise<void>;
  geminiFileUri?: string;
  onLogReceipt?: (action: string, cost: number) => void;
  onCorrectPlugin?: (pluginName: string, corrections: { parameter: string, value: string }[], version: string) => Promise<{ success: boolean, message: string, plugin?: VSTPlugin }>;
  onContactSupport?: (pluginInfo: any) => void;
  onMinimize?: () => void;
}

import { PluginBubble } from './PluginBubble';
// ...
export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe: initialRecipe, isSaved, onSave, theme = 'coldest', dawType, plugins = [], analogHardware = [], drumKits = [], onCloudBackupRecipe, geminiFileUri, onLogReceipt, onCorrectPlugin, onContactSupport, onMinimize }) => {
  const { t, i18n } = useTranslation();
  const [recipe, setRecipe] = useState(initialRecipe);
  const [regeneratingPluginId, setRegeneratingPluginId] = useState<string | null>(null);
  const [refreshPools, setRefreshPools] = useState<Record<string, string[]>>({});
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecipe(initialRecipe);
  }, [initialRecipe]);

  const handleRegenerate = async (plugin: any, trackIdx: number, pluginIdx: number, type: 'track' | 'bus' | 'layer' | 'master' | 'instrument' | 'instrument-params' | 'vocal-track' | 'vocal-track-params' | 'vocal-track-fx' | 'tracking-unison' | 'tracking-insert') => {
    const pluginId = `${type}-${trackIdx}-${pluginIdx}`;
    setRegeneratingPluginId(pluginId);
    try {
      const pluginName = (type === 'instrument' || type === 'instrument-params' || type === 'vocal-track' || type === 'vocal-track-params') 
        ? (plugin.plugin || plugin.name) 
        : plugin.name;
        
      const currentPool = refreshPools[pluginId] || [pluginName];
      const newPlugin = await regeneratePlugin(pluginName, plugin.deepDive || [], recipe, plugins || [], i18n.language, currentPool, analogHardware);
      if (onLogReceipt) onLogReceipt('Regenerate Plugin', 2);
      
      if (newPlugin) {
        setRefreshPools(prev => ({
          ...prev,
          [pluginId]: [...currentPool, newPlugin.name]
        }));
        const updatedRecipe = { ...recipe };
        if (type === 'track') {
          updatedRecipe.instruments[trackIdx].fxPlugins[pluginIdx] = newPlugin;
        } else if (type === 'bus') {
          updatedRecipe.busses[trackIdx].fxPlugins[pluginIdx] = newPlugin;
        } else if (type === 'layer') {
          if (updatedRecipe.vocalElements) {
             updatedRecipe.vocalElements.vocalTracks[trackIdx].fxPlugins[pluginIdx] = newPlugin;
          }
        } else if (type === 'master') {
          updatedRecipe.masterPlugins[pluginIdx] = newPlugin;
        } else if (type === 'instrument') {
          updatedRecipe.instruments[trackIdx].plugin = newPlugin.name;
          updatedRecipe.instruments[trackIdx].deepDive = newPlugin.deepDive;
        } else if (type === 'instrument-params') {
          updatedRecipe.instruments[trackIdx].deepDive = newPlugin.deepDive;
        } else if (type === 'vocal-track') {
          if (updatedRecipe.gangstaVox) {
            (updatedRecipe.gangstaVox.vocalTracks[trackIdx] as any).plugin = newPlugin.name;
            updatedRecipe.gangstaVox.vocalTracks[trackIdx].deepDive = newPlugin.deepDive;
          } else if (updatedRecipe.vocalElements) {
            (updatedRecipe.vocalElements.vocalTracks[trackIdx] as any).plugin = newPlugin.name;
            updatedRecipe.vocalElements.vocalTracks[trackIdx].deepDive = newPlugin.deepDive;
          }
        } else if (type === 'vocal-track-params') {
          if (updatedRecipe.gangstaVox) {
            updatedRecipe.gangstaVox.vocalTracks[trackIdx].deepDive = newPlugin.deepDive;
          } else if (updatedRecipe.vocalElements) {
            updatedRecipe.vocalElements.vocalTracks[trackIdx].deepDive = newPlugin.deepDive;
          }
        } else if (type === 'vocal-track-fx') {
          if (updatedRecipe.gangstaVox) {
            updatedRecipe.gangstaVox.vocalTracks[trackIdx].fxPlugins[pluginIdx] = newPlugin;
          } else if (updatedRecipe.vocalElements) {
            updatedRecipe.vocalElements.vocalTracks[trackIdx].fxPlugins[pluginIdx] = newPlugin;
          }
        } else if (type === 'tracking-unison') {
          if (updatedRecipe.gangstaVox?.trackingChain) {
            updatedRecipe.gangstaVox.trackingChain.unisonPlugin = newPlugin;
          }
        } else if (type === 'tracking-insert') {
          if (updatedRecipe.gangstaVox?.trackingChain) {
            updatedRecipe.gangstaVox.trackingChain.inserts[pluginIdx] = newPlugin;
          }
        }
        setRecipe(updatedRecipe);
      }
    } catch (e) {
      console.error(e);
      alert(t('failed_to_regenerate'));
    } finally {
      setRegeneratingPluginId(null);
    }
  }
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showGangstaVox, setShowGangstaVox] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; title: string; message: string; stack?: string }>({
    isOpen: false,
    title: '',
    message: '',
    stack: ''
  });

  useEffect(() => {
    if (recipe.isGangstaVox && recipe.gangstaVox) {
      setShowGangstaVox(true);
    }
  }, [recipe.isGangstaVox, recipe.gangstaVox]);

  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const [vocalVibeGoal, setVocalVibeGoal] = useState('');
  const [isGeneratingGangstaVox, setIsGeneratingGangstaVox] = useState(false);

  const toggleGangstaVox = async () => {
    if (!showGangstaVox && !recipe.gangstaVox) {
      setIsGeneratingGangstaVox(true);
      try {
        const gangstaVoxData = await getGangstaVoxRecipe(recipe, plugins, analogHardware, i18n.language, vocalVibeGoal);
        if (onLogReceipt) onLogReceipt('GangstaVox Guide', 2);
        const updatedRecipe = { ...recipe, gangstaVox: gangstaVoxData, isGangstaVox: true };
        setRecipe(updatedRecipe);
        setShowGangstaVox(true);
      } catch (err) {
        console.error("Failed to generate GangstaVox guide:", err);
        alert(t('error_generic') || 'Failed to generate GangstaVox guide.');
      } finally {
        setIsGeneratingGangstaVox(false);
      }
    } else {
      setShowGangstaVox(!showGangstaVox);
    }
  };

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [specificHelpQuery, setSpecificHelpQuery] = useState('');
  const [isLoadingSpecificHelp, setIsLoadingSpecificHelp] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', content: string}[]>(() => {
    const history: {role: 'user' | 'model', content: string}[] = [];
    const oldResults = recipe.specificHelp || [];
    oldResults.forEach((res: any) => {
      if (res.role) {
        history.push(res);
      } else if (res.query) {
        history.push({ role: 'user', content: res.query });
        let content = res.advice;
        if (res.recommendedChain && res.recommendedChain?.length > 0) {
          content += `\n\n**${t('recommended_fix_chain')}**\n` + res.recommendedChain.map((p: any) => `- **${p.name}** (${p.purpose}): \`${p.deepDive?.map((d: any) => `${d.parameter}: ${d.value}`).join(', ')}\``).join('\n');
        }
        history.push({ role: 'model', content });
      }
    });
    return history;
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSpecificHelpSearch = async () => {
    if (!specificHelpQuery.trim()) return;
    setIsLoadingSpecificHelp(true);
    const userQuery = specificHelpQuery.trim();
    setSpecificHelpQuery('');
    
    // Optimistically add user message
    setChatHistory(prev => [...prev, { role: 'user', content: userQuery }]);

    try {
      // Create a context string from the recipe
      const context = `
        Title: ${recipe.title}
        Style: ${recipe.style}
        BPM: ${recipe.bpm}
        Description: ${recipe.description}
        Instruments: ${Array.isArray(recipe.instruments) ? recipe.instruments.map(i => i.name).join(', ') : ''}
      `;

      const result = await getSpecificMixHelp(
        plugins, 
        recipe.audioBase64, 
        recipe.mimeType, 
        userQuery, 
        recipe.isGangstaVox,
        context,
        chatHistory,
        undefined,
        geminiFileUri || recipe.geminiFileUri,
        i18n.language,
        analogHardware
      );
      
      const isWav = recipe.mimeType?.includes('audio/wav');
      if (onLogReceipt) onLogReceipt('Specific Mix Help', isWav ? 25 : 10);
      
      const content = `${result.advice}\n\n${t('recommended_plugins_label')}\n${result.recommendedChain.map(p => p.name).join(', ')}`;
      setChatHistory(prev => [...prev, { role: 'model', content: content }]);
    } catch (err) {
      console.error("Specific help search failed:", err);
      setChatHistory(prev => [...prev, { role: 'model', content: t('error_try_again') }]);
    } finally {
      setIsLoadingSpecificHelp(false);
    }
  };

  const handleExportHTML = async () => {
    try {
      console.log("Starting HTML Export...");
      const renderToStaticMarkup = await getRenderToStaticMarkup();
      const htmlContent = renderToStaticMarkup(<RecipeHTMLTemplate recipe={recipe} drumKits={drumKits} analogHardware={analogHardware} />);
      
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${recipe.title} - Production Manual</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; }
    @media print {
      body { background-color: white !important; color: black !important; }
      .print-break { page-break-before: always; }
      .no-print { display: none !important; }
      * { border-color: #e2e8f0 !important; }
    }
  </style>
</head>
<body class="antialiased min-h-screen p-4 md:p-8 lg:p-12">
  <div class="max-w-5xl mx-auto bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
    ${htmlContent}
  </div>
</body>
</html>`;

      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${recipe.title.replace(/\s+/g, '_')}_Manual.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log(`HTML Export complete`);
    } catch (error) {
      console.error("HTML Export failed:", error);
      alert(t('failed_to_export_html'));
    }
  };

  const handleSave = async () => {
    const updatedRecipe = { ...recipe, specificHelp: chatHistory };
    onSave(updatedRecipe);
    if (onCloudBackupRecipe) {
      setIsCloudSyncing(true);
      try {
        await onCloudBackupRecipe(updatedRecipe);
      } finally {
        setIsCloudSyncing(false);
      }
    }
  };

  const handleDownloadAllMidi = async () => {
    const zipName = 'MIDI';

    try {
      setIsDownloadingAll(true);
      const zipBlob = await generateAllMidiZip(recipe, dawType);
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${recipe.title.replace(/\s+/g, '_')}_All_${zipName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
    } catch (error) {
      console.error("Failed to generate MIDI ZIP:", error);
      alert(t('failed_to_generate_zip'));
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const [trackingVibeSearch, setTrackingVibeSearch] = useState('');
  const [isRegeneratingTrackingChain, setIsRegeneratingTrackingChain] = useState(false);

  const handleRegenerateTrackingChainSubmit = async () => {
    if (!trackingVibeSearch.trim()) return;
    setIsRegeneratingTrackingChain(true);
    try {
      const result = await regenerateTrackingChain(
        trackingVibeSearch,
        plugins,
        analogHardware,
        i18n.language,
        recipe.title
      );
      
      const updatedRecipe = {
        ...recipe,
        gangstaVox: {
          ...recipe.gangstaVox,
          trackingChain: result.trackingChain
        }
      };
      setRecipe(updatedRecipe);
      setTrackingVibeSearch('');
    } catch (err) {
      console.error(err);
      alert(t('error_regenerating_tracking_chain') || 'Failed to regenerate tracking chain. Please try again.');
    } finally {
      setIsRegeneratingTrackingChain(false);
    }
  };

  return (
    <motion.div 
      ref={topRef}
      className={`rounded-[32px] sm:rounded-[48px] p-6 sm:p-12 border shadow-2xl transition-all ${
        theme === 'coldest' 
          ? 'bg-[#020617]/95 backdrop-blur-3xl border-sky-500/30 text-white' 
          : theme === 'chef-mode'
          ? 'bg-white/95 border-orange-200/60 text-orange-950 shadow-orange-900/5'
          : theme === 'crazy-bird' ? 'bg-red-950/90 border-red-800/60 text-red-50' : 'bg-black/80 border-white/20 text-white'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h3 className={`text-3xl sm:text-4xl font-black tracking-tighter mb-2 font-outfit ${theme === 'coldest' ? 'text-white' : 'text-current'}`}>{recipe.title}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              theme === 'coldest' ? 'bg-sky-500 text-white' : 'bg-white/10'
            }`}>{recipe.style}</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              theme === 'coldest' ? 'bg-sky-500 text-white' : 'bg-white/10'
            }`}>{recipe.bpm} BPM</span>
            {recipe.artistTypes && recipe.artistTypes?.length > 0 && (
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                theme === 'coldest' ? 'bg-indigo-500 text-white' : 'bg-indigo-500/20 text-indigo-400'
              }`}>Vibe: {recipe.artistTypes.join(', ')}</span>
            )}
            {recipe.recommendedScale && (
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                theme === 'coldest' ? 'bg-orange-500 text-white' : 'bg-orange-500/20 text-orange-400'
              }`}>{t('scale')}: {recipe.recommendedScale}</span>
            )}
            {recipe.chordProgression && (
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                theme === 'coldest' ? 'bg-sky-600 text-white' : 'bg-sky-500/20 text-sky-400'
              }`}>{t('chords')}: {recipe.chordProgression}</span>
            )}
          </div>
          <p className="text-sm font-bold opacity-90 max-w-2xl leading-relaxed">{recipe.description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className={`shrink-0 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                theme === 'coldest' || theme === 'chef-mode' ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('minimize')}
            </button>
          )}
          <div className="relative">
              <button 
              id="btn-export-html"
              onClick={handleExportHTML}
              className={`w-full sm:w-auto px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 justify-center ${
                theme === 'coldest' || theme === 'chef-mode'
                  ? 'bg-slate-800 text-white hover:bg-slate-900'
                  : theme === 'crazy-bird' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FileCode className="w-4 h-4" />
              {t('save_html')}
            </button>
          </div>
          <button 
            onClick={handleDownloadAllMidi}
            disabled={isDownloadingAll || isLoading}
            className={`w-full sm:w-auto px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 justify-center ${
              theme === 'coldest' || theme === 'chef-mode'
                ? 'bg-sky-600 text-white hover:bg-sky-700'
                : 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30'
            }`}
          >
            {isDownloadingAll || isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
            {isDownloadingAll || isLoading ? t('preparing') : t('download_midi')}
          </button>
          <button 
            id="btn-save-recipe"
            onClick={handleSave}
            disabled={isSaved || isLoading || isCloudSyncing}
            className={`w-full sm:w-auto px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 justify-center ${
              isSaved 
                ? 'bg-black/10 text-current opacity-50 shadow-none' 
                : theme === 'coldest' || theme === 'chef-mode'
                ? 'bg-gradient-to-b from-sky-400 to-sky-500 text-white shadow-[0_4px_15px_rgba(14,165,233,0.4)] border border-sky-400'
                : 'bg-white text-black'
            }`}
          >
            {isLoading || isCloudSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : isSaved ? <Cloud className="w-4 h-4" /> : null}
            {isLoading || isCloudSyncing ? t('saving') : isSaved ? t('saved_to_vault') : t('save_to_vault')}
          </button>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-sky-400 opacity-100' : 'opacity-60'}`}>
          {recipe.isGangstaVox ? t('vocal_tracks') : t('instruments')}
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(Array.isArray(recipe.isGangstaVox ? recipe.gangstaVox?.vocalTracks : recipe.instruments) ? (recipe.isGangstaVox ? recipe.gangstaVox?.vocalTracks : recipe.instruments) : [])?.map((track, idx) => (
            <div key={idx} className={`p-6 rounded-[28px] border ${
              theme === 'coldest' ? 'bg-sky-900/40 border-sky-500/40 shadow-xl' : theme === 'crazy-bird' ? 'bg-red-950/70 border-red-800/60' : 'bg-black/40 border-white/20'
            }`}>
              <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl tracking-tight">{track.name}</span>
                    {(track as any).plugin && (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-sky-400' : 'text-sky-400'}`}>{(track as any).plugin}</span>
                        <button 
                          onClick={() => handleRegenerate(track, idx, 0, recipe.isGangstaVox ? 'vocal-track' : 'instrument')}
                          disabled={regeneratingPluginId === `${recipe.isGangstaVox ? 'vocal-track' : 'instrument'}-${idx}-0`}
                          className="p-1 rounded-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-all"
                          title={t('regenerate_plugin') || 'Regenerate Plugin'}
                        >
                          <RefreshCw className={`w-3 h-3 ${regeneratingPluginId === `${recipe.isGangstaVox ? 'vocal-track' : 'instrument'}-${idx}-0` ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    )}
                  </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${theme === 'coldest' ? 'bg-sky-500/20 border-sky-400/30 text-sky-200' : 'opacity-60 bg-white/10 border-white/20'}`}>{track.sourceSoundGoal}</span>
              </div>
              {track.loopGuide && <p className="text-sm font-medium opacity-90 mb-5 leading-relaxed">{track.loopGuide}</p>}
              
              {(track as any).midiNotes && (
                <div className={`mb-5 p-4 rounded-[20px] border ${theme === 'coldest' ? 'bg-black/40 border-sky-500/20' : 'bg-white/10 border-white/20'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Music className={`w-4 h-4 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-60'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${theme === 'coldest' ? 'text-sky-400' : 'opacity-60'}`}>{t('analyzed_midi')}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray((track as any).midiNotes) && (track as any).midiNotes.map((note: any, nIdx: number) => (
                      <span key={nIdx} className={`${theme === 'coldest' ? 'bg-sky-500/30 text-sky-100' : 'bg-white/20'} px-2 py-0.5 rounded-lg text-[10px] font-bold`}>
                        {Array.isArray(note.pitch) ? note.pitch.join('+') : note.pitch}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {isMidiCapable(track.name, track.loopGuide) && (
                <div className="mb-4">
                  <h5 className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-2">{t('drag_midi')}</h5>
                  <div className="flex flex-wrap gap-2">
                    <MidiDraggableButton instrument={track.name} loopGuide={track.loopGuide || ''} bpm={recipe.bpm} bars={4} variation="A" recipeTitle={recipe.title} theme={theme} dawType={dawType} midiNotes={track.midiNotes} />
                    <MidiDraggableButton instrument={track.name} loopGuide={track.loopGuide || ''} bpm={recipe.bpm} bars={4} variation="B" recipeTitle={recipe.title} theme={theme} dawType={dawType} midiNotes={track.midiNotes} />
                    <MidiDraggableButton instrument={track.name} loopGuide={track.loopGuide || ''} bpm={recipe.bpm} bars={8} variation="A" recipeTitle={recipe.title} theme={theme} dawType={dawType} midiNotes={track.midiNotes} />
                    <MidiDraggableButton instrument={track.name} loopGuide={track.loopGuide || ''} bpm={recipe.bpm} bars={8} variation="B" recipeTitle={recipe.title} theme={theme} dawType={dawType} midiNotes={track.midiNotes} />
                  </div>
                </div>
              )}

              {track.deepDive && track.deepDive?.length > 0 && (
                <div className={`mt-4 p-4 rounded-2xl border ${
                  theme === 'coldest' ? 'bg-black/40 border-sky-500/20' : 'bg-white/10 border-white/20'
                } ${regeneratingPluginId === `${recipe.isGangstaVox ? 'vocal-track' : 'instrument'}-${idx}-0` ? 'opacity-50 blur-sm' : ''} relative`}>
                  {regeneratingPluginId === `${recipe.isGangstaVox ? 'vocal-track' : 'instrument'}-${idx}-0` && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <h5 className={`text-[8px] font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-sky-400' : 'opacity-60'}`}>{t('source_settings')}</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.isArray(track.deepDive) && track.deepDive?.map((s, sIdx) => (
                      <div key={sIdx} className="flex justify-between text-[9px] font-bold">
                        <span className={`${theme === 'coldest' ? 'text-sky-300/70' : 'opacity-60'}`}>{s.parameter}</span>
                        <span className="text-current">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {track.busSend && (
                <div className="mt-3">
                  <span className={`text-[10px] font-bold ${theme === 'coldest' ? 'text-sky-300' : 'opacity-60'}`}>{t('sends_to')} </span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                    theme === 'coldest' ? 'bg-orange-500 text-white border border-orange-400' : 'bg-orange-500/30 text-orange-300 border border-orange-500/40'
                  }`}>{track.busSend}</span>
                </div>
              )}

              {Array.isArray(track.fxPlugins) && track.fxPlugins?.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h5 className={`text-[8px] font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-sky-400' : 'opacity-60'}`}>{t('fx_deep_dive')}</h5>
                  {Array.isArray(track.fxPlugins) && track.fxPlugins.map((dive, dIdx) => (
                    <PluginBubble 
                      key={dIdx}
                      name={dive.name}
                      purpose={dive.purpose}
                      deepDive={dive.deepDive}
                      band={dive.band}
                      routing={dive.routing}
                      isRegenerating={regeneratingPluginId === `track-${idx}-${dIdx}`}
                      onRegenerate={() => handleRegenerate(dive, idx, dIdx, 'track')}
                      onCorrect={onCorrectPlugin}
                      onContactSupport={onContactSupport}
                      theme={theme}
                      className={theme === 'coldest' ? 'bg-purple-900/40 border-purple-500/40 shadow-md' : 'bg-purple-900/20 border-purple-500/30'}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {recipe.vocalElements && (
        <div className="space-y-6 mb-8">
          <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-sky-400 opacity-100' : 'opacity-60'}`}>{t('vocal_elements')}</h4>
          <div className="space-y-6">
            {Array.isArray(recipe.vocalElements.vocalTracks) && recipe.vocalElements.vocalTracks.map((layer, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border ${
                theme === 'coldest' ? 'bg-purple-900/40 border-purple-500/40 shadow-md' : 'bg-purple-900/20 border-purple-500/30'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <h5 className={`font-black text-lg ${theme === 'coldest' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-400'}`}>{layer.name}</h5>
                    {(layer as any).plugin && (
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-purple-400' : 'text-purple-400'}`}>{(layer as any).plugin}</span>
                        <button 
                          onClick={() => handleRegenerate(layer, idx, 0, 'vocal-track')}
                          disabled={regeneratingPluginId === `vocal-track-${idx}-0`}
                          className="p-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-all"
                          title={t('regenerate_plugin') || 'Regenerate Plugin'}
                        >
                          <RefreshCw className={`w-3 h-3 ${regeneratingPluginId === `vocal-track-${idx}-0` ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${theme === 'coldest' ? 'bg-black/40 border-purple-500/30 text-purple-200' : 'opacity-60 bg-black/5 border-black/10'}`}>{layer.sourceSoundGoal}</span>
                </div>

                {layer.deepDive && layer.deepDive?.length > 0 && (
                  <div className={`mb-4 p-4 rounded-2xl border ${
                    theme === 'coldest' ? 'bg-black/40 border-sky-500/20' : 'bg-white/5 border-white/10'
                  } ${regeneratingPluginId === `vocal-track-${idx}-0` ? 'opacity-50 blur-sm' : ''} relative`}>
                    {regeneratingPluginId === `vocal-track-${idx}-0` && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <h5 className={`text-[8px] font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-purple-400' : 'opacity-60'}`}>{t('source_settings')}</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.isArray(layer.deepDive) && layer.deepDive?.map((s, sIdx) => (
                        <div key={sIdx} className="flex justify-between text-[9px] font-bold">
                          <span className={`${theme === 'coldest' ? 'text-sky-300/70' : 'opacity-60'}`}>{s.parameter}</span>
                          <span className="text-current">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {layer.loopGuide && <p className="text-xs font-bold opacity-90 mb-4">{layer.loopGuide}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.isArray(layer.fxPlugins) && layer.fxPlugins.map((dive, dIdx) => (
                    <PluginBubble 
                      key={dIdx}
                      name={dive.name}
                      purpose={dive.purpose}
                      deepDive={dive.deepDive}
                      band={dive.band}
                      routing={dive.routing}
                      isRegenerating={regeneratingPluginId === `layer-${idx}-${dIdx}`}
                      onRegenerate={() => handleRegenerate(dive, idx, dIdx, 'layer')}
                      onCorrect={onCorrectPlugin}
                      onContactSupport={onContactSupport}
                      theme={theme}
                    />
                  ))}
                </div>
                {layer.busSend && (
                  <div className="mt-4">
                    <span className={`text-[10px] font-bold ${theme === 'coldest' ? 'text-sky-300' : 'opacity-60'}`}>{t('sends_to')} </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      theme === 'coldest' ? 'bg-orange-500 text-white border border-orange-400' : 'bg-orange-500/30 text-orange-300 border border-orange-500/40'
                    }`}>{layer.busSend}</span>
                  </div>
                )}
              </div>
            ))}
            {recipe.vocalElements.layeringStrategy && (
              <div className={`p-6 rounded-3xl border ${
                theme === 'coldest' ? 'bg-purple-950/60 border-purple-500/40' : 'bg-purple-900/10 border-purple-500/20'
              }`}>
                <h5 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'coldest' ? 'text-purple-400' : 'opacity-50'}`}>{t('layering_strategy')}</h5>
                <p className="text-sm font-bold opacity-100">{recipe.vocalElements.layeringStrategy}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {Array.isArray(recipe.busses) && recipe.busses?.length > 0 && (
        <div className="space-y-6 mb-8">
          <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-sky-400 opacity-100' : 'opacity-60'}`}>{t('busses')}</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.isArray(recipe.busses) && recipe.busses.map((bus, idx) => (
              <div key={idx} className={`p-5 rounded-3xl border ${
                theme === 'coldest' ? 'bg-orange-950/60 border-orange-500/40 shadow-md' : 'bg-orange-900/20 border-orange-500/30'
              }`}>
                <h5 className={`font-black text-lg mb-2 ${theme === 'coldest' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-400'}`}>{bus.name}</h5>
                <div className="mb-4">
                  <span className={`text-[10px] font-bold ${theme === 'coldest' ? 'text-sky-300' : 'opacity-60'}`}>{t('receives_from')} </span>
                  <span className="text-[10px] font-bold">{Array.isArray(bus.tracksUsingBus) ? bus.tracksUsingBus.join(', ') : bus.tracksUsingBus}</span>
                </div>
                
                <div className="space-y-4">
                  {Array.isArray(bus.fxPlugins) && bus.fxPlugins.map((dive, dIdx) => (
                    <PluginBubble 
                      key={dIdx}
                      name={dive.name}
                      purpose={dive.purpose}
                      deepDive={dive.deepDive}
                      band={dive.band}
                      routing={dive.routing}
                      isRegenerating={regeneratingPluginId === `bus-${idx}-${dIdx}`}
                      onRegenerate={() => handleRegenerate(dive, idx, dIdx, 'bus')}
                      onCorrect={onCorrectPlugin}
                      onContactSupport={onContactSupport}
                      theme={theme}
                      className={theme === 'coldest' ? 'bg-black/40 border-orange-500/20' : 'bg-black/30 border-white/10'}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(recipe.masterPlugins) && recipe.masterPlugins?.length > 0 && (
        <div className="space-y-6 mb-8">
          <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-emerald-400 opacity-100' : 'opacity-40'}`}>{t('master_chain')}</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.isArray(recipe.masterPlugins) && recipe.masterPlugins.map((dive, idx) => (
              <PluginBubble 
                key={idx}
                name={dive.name}
                purpose={dive.purpose}
                deepDive={dive.deepDive}
                band={dive.band}
                routing={dive.routing}
                isRegenerating={regeneratingPluginId === `master-0-${idx}`}
                onRegenerate={() => handleRegenerate(dive, 0, idx, 'master')}
                onCorrect={onCorrectPlugin}
                onContactSupport={onContactSupport}
                theme={theme}
                className={theme === 'coldest' ? 'bg-emerald-950/60 border-emerald-500/40 shadow-md' : 'bg-emerald-900/10 border-emerald-500/20'}
              />
            ))}
          </div>
        </div>
      )}

      {!recipe.isGangstaVox && (
        <div className="space-y-6 mb-8">
          <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-sky-400' : 'opacity-40'}`}>{t('drum_patterns')}</h4>
          <div className={`p-2 sm:p-6 rounded-[2.5rem] border ${
            theme === 'coldest' ? 'bg-black/40 border-sky-500/20 shadow-inner' : 'bg-black/20 border-white/5'
          }`}>
            <DrumPatternDisplay patterns={recipe.drumPatterns} theme={theme} dawType={dawType} recipeTitle={recipe.title} bpm={recipe.bpm} />
          </div>
        </div>
      )}

      {recipe.drumKitAdvice && drumKits.length > 0 && !recipe.isGangstaVox && (
        <div className="space-y-6 mb-8">
          <h4 className={`text-sm font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-sky-400' : 'opacity-40'}`}>{t('drum_kit_advice')}</h4>
          <div className={`p-6 rounded-[2.5rem] border grid grid-cols-1 md:grid-cols-3 gap-6 ${
            theme === 'coldest' ? 'bg-orange-950/60 border-orange-500/40 shadow-md' : 'bg-orange-900/10 border-orange-500/20'
          }`}>
            <div>
              <h5 className={`font-black text-lg mb-2 ${theme === 'coldest' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-400'}`}>{t('kick')}</h5>
              <p className="text-xs font-bold opacity-90 leading-relaxed">{recipe.drumKitAdvice.kick}</p>
            </div>
            <div>
              <h5 className={`font-black text-lg mb-2 ${theme === 'coldest' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-400'}`}>{t('snare')}</h5>
              <p className="text-xs font-bold opacity-90 leading-relaxed">{recipe.drumKitAdvice.snare}</p>
            </div>
            <div>
              <h5 className={`font-black text-lg mb-2 ${theme === 'coldest' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-400'}`}>{t('toms')}</h5>
              <p className="text-xs font-bold opacity-90 leading-relaxed">{recipe.drumKitAdvice.toms}</p>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={toggleExpanded}
        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
          theme === 'coldest' ? 'bg-white/40 hover:bg-white/60 border border-white/50' : 'bg-white/5 hover:bg-white/10'
        }`}
      >
        {expanded ? t('hide_arrangement_advice') : t('show_arrangement_advice')}
      </button>

      {!recipe.gangstaVox && (
        <div className="mt-8 pt-4 border-t border-purple-500/20">
          <label className="block text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Vocal Vibe / Goal (Optional)</label>
          <input 
            type="text" 
            value={vocalVibeGoal}
            onChange={(e) => setVocalVibeGoal(e.target.value)}
            placeholder="e.g. Modern rap with aggressive autotune, warm vintage soul, airy pop..."
            className={`w-full p-4 rounded-2xl text-xs font-bold outline-none border transition-all ${
              theme === 'coldest' ? 'bg-black/60 border-purple-500/30 text-white focus:border-purple-500' : 'bg-white border-purple-200 text-purple-950 focus:border-purple-500'
            }`}
          />
        </div>
      )}

      <button 
        onClick={toggleGangstaVox}
        disabled={isGeneratingGangstaVox}
        className={`w-full mt-4 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
          theme === 'coldest' ? 'bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-900 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 text-purple-100'
        } ${isGeneratingGangstaVox ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isGeneratingGangstaVox ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> {t('generating') || 'Generating...'}</>
        ) : (
          showGangstaVox ? t('hide_gangstavox_guide') : '🎤 ' + t('show_gangstavox_guide')
        )}
      </button>

      {expanded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-8 pt-8 border-t border-current/10 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest opacity-40 mb-6">{t('arrangement')}</h4>
            <div className="space-y-4">
              {typeof recipe.arrangement === 'object' && !Array.isArray(recipe.arrangement) && Object.entries(recipe.arrangement || {}).map(([section, guide]) => (
                <div key={section} className={`p-4 rounded-2xl border ${
                  theme === 'coldest' ? 'bg-black/40 border-sky-500/20' : 'bg-black/20 border-white/5'
                }`}>
                  <h5 className={`font-black capitalize mb-1 ${theme === 'coldest' ? 'text-sky-300' : ''}`}>{section}</h5>
                  <p className="text-xs font-bold opacity-90">{guide as string}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-40'}`}>{t('mixing_advice')}</h4>
            <div className={`p-6 rounded-3xl border mb-6 ${
              theme === 'coldest' ? 'bg-sky-900/40 border-sky-500/40 text-white' : 'bg-sky-900/20 border-sky-500/30 text-sky-100'
            }`}>
              <p className="text-sm font-bold leading-relaxed">{recipe.mixingAdvice}</p>
            </div>
          </div>
        </motion.div>
      )}

      {showGangstaVox && recipe.gangstaVox && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-8 pt-8 border-t border-purple-500/30"
        >
          <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-purple-500">{t('gangstavox_guide')}</h3>
          
          {recipe.gangstaVox.trackingChain && (
            <div className="mb-8">
              <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-40'}`}>{t('apollo_tracking_chain')}</h4>
              <div className={`p-6 rounded-3xl border ${theme === 'coldest' ? 'bg-black/40 border-sky-500/20' : 'bg-black/20 border-white/5'}`}>
                {recipe.gangstaVox.trackingChain.dspUsageNote && (
                  <p className="text-xs font-bold opacity-100 mb-4 text-orange-500 whitespace-pre-wrap">{recipe.gangstaVox.trackingChain.dspUsageNote}</p>
                )}
                {recipe.gangstaVox.trackingChain.unisonPlugin && (
                  <div className="mb-6">
                    <h5 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-30'}`}>{t('unison_slot')}</h5>
                    <PluginBubble 
                      name={recipe.gangstaVox.trackingChain.unisonPlugin.name}
                      purpose={recipe.gangstaVox.trackingChain.unisonPlugin.purpose}
                      deepDive={recipe.gangstaVox.trackingChain.unisonPlugin.deepDive}
                      isRegenerating={regeneratingPluginId === 'tracking-unison-0-0'}
                      onRegenerate={() => handleRegenerate(recipe.gangstaVox!.trackingChain!.unisonPlugin, 0, 0, 'tracking-unison')}
                      onCorrect={onCorrectPlugin}
                      onContactSupport={onContactSupport}
                      theme={theme}
                      className={theme === 'coldest' ? 'bg-sky-900/40 border-sky-500/40 shadow-md' : 'bg-white/5 border-white/10'}
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <h5 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-30'}`}>{t('tracking_inserts')}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(recipe.gangstaVox.trackingChain.inserts) && recipe.gangstaVox.trackingChain.inserts?.map((dive, dIdx) => (
                      <PluginBubble 
                        key={dIdx}
                        name={dive.name}
                        purpose={dive.purpose}
                        deepDive={dive.deepDive}
                        isRegenerating={regeneratingPluginId === `tracking-insert-0-${dIdx}`}
                        onRegenerate={() => handleRegenerate(dive, 0, dIdx, 'tracking-insert')}
                        onCorrect={onCorrectPlugin}
                        onContactSupport={onContactSupport}
                        theme={theme}
                        className={theme === 'coldest' ? 'bg-sky-900/40 border-sky-500/40 shadow-md' : 'bg-white/5 border-white/10'}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-sky-500/20">
                  {recipe.gangstaVox.trackingChain.aux1 && recipe.gangstaVox.trackingChain.aux1?.length > 0 && (
                    <div>
                      <h5 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-30'}`}>AUX 1 (Reverb/Comfort/Parallel)</h5>
                      <div className="flex flex-col gap-3">
                        {recipe.gangstaVox.trackingChain.aux1?.map((dive, dIdx) => (
                          <PluginBubble 
                            key={dIdx}
                            name={dive.name}
                            purpose={dive.purpose}
                            deepDive={dive.deepDive}
                            isRegenerating={regeneratingPluginId === `tracking-aux1-0-${dIdx}`}
                            onRegenerate={() => handleRegenerate(dive, 0, dIdx, 'vocal-track-fx')} 
                            onCorrect={onCorrectPlugin}
                            onContactSupport={onContactSupport}
                            theme={theme}
                            className={theme === 'coldest' ? 'bg-sky-900/40 border-sky-500/40 shadow-md' : 'bg-white/5 border-white/10'}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {recipe.gangstaVox.trackingChain.aux2 && recipe.gangstaVox.trackingChain.aux2?.length > 0 && (
                    <div>
                      <h5 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-30'}`}>AUX 2 (Delay/FX)</h5>
                      <div className="flex flex-col gap-3">
                        {recipe.gangstaVox.trackingChain.aux2?.map((dive, dIdx) => (
                          <PluginBubble 
                            key={dIdx}
                            name={dive.name}
                            purpose={dive.purpose}
                            deepDive={dive.deepDive}
                            isRegenerating={regeneratingPluginId === `tracking-aux2-0-${dIdx}`}
                            onRegenerate={() => handleRegenerate(dive, 0, dIdx, 'vocal-track-fx')}
                            onCorrect={onCorrectPlugin}
                            onContactSupport={onContactSupport}
                            theme={theme}
                            className={theme === 'coldest' ? 'bg-sky-900/40 border-sky-500/40 shadow-md' : 'bg-white/5 border-white/10'}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {recipe.gangstaVox.trackingChain.dawRoutingInstructions && (
                  <div className="mt-8 pt-6 border-t border-sky-500/20">
                    <h5 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-30'}`}>DAW I/O Routing Guide</h5>
                    <div className={`p-4 rounded-2xl text-xs font-bold whitespace-pre-wrap ${theme === 'coldest' ? 'bg-black/40 text-sky-200' : 'bg-white/5 text-white/70'}`}>
                      {recipe.gangstaVox.trackingChain.dawRoutingInstructions}
                    </div>
                  </div>
                )}

                {recipe.gangstaVox.trackingChain.dspUsageNote && (
                  <div className="mt-4 pt-4 border-t border-sky-500/10">
                    <h5 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${theme === 'coldest' ? 'text-sky-500/60' : 'opacity-30'}`}>DSP Usage Note</h5>
                    <div className={`p-3 rounded-xl text-[10px] font-medium leading-relaxed ${theme === 'coldest' ? 'bg-sky-950/30 text-sky-300' : 'bg-black/20 text-white/50'}`}>
                      {recipe.gangstaVox.trackingChain.dspUsageNote}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-sky-500/20">
                  <h5 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-30'}`}>
                    Redefine Apollo Tracking Vibe
                  </h5>
                  <div className="relative">
                    <div className="flex gap-2">
                       <div className="relative flex-1">
                        <input
                          type="text"
                          value={trackingVibeSearch}
                          onChange={(e) => setTrackingVibeSearch(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRegenerateTrackingChainSubmit()}
                          placeholder="e.g. Z-Ro vocals this time..."
                          className={`w-full px-4 py-3 rounded-xl font-bold text-xs outline-none transition-all ${
                            theme === 'coldest' ? 'bg-black/60 border border-sky-500/30 focus:border-sky-500 text-white' : 'bg-black/20 border border-white/10 text-white'
                          }`}
                        />
                        <Search className="absolute right-3 top-3 w-4 h-4 opacity-30" />
                      </div>
                      <button
                        onClick={handleRegenerateTrackingChainSubmit}
                        disabled={isRegeneratingTrackingChain || !trackingVibeSearch.trim()}
                        className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap min-w-[120px] flex items-center justify-center ${
                          theme === 'coldest' 
                            ? 'bg-sky-500 text-white hover:bg-sky-400 disabled:opacity-50' 
                            : 'bg-white/10 text-white hover:bg-white/20 disabled:opacity-50'
                        }`}
                      >
                        {isRegeneratingTrackingChain ? (
                           <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Regenerate Chain'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {Array.isArray(recipe.gangstaVox?.vocalTracks) && recipe.gangstaVox.vocalTracks.map((layer, idx) => (
              <div key={idx}>
                <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-40'}`}>{layer.name}</h4>
                <div className={`p-6 rounded-3xl border ${theme === 'coldest' ? 'bg-sky-900/40 border-sky-500/40 shadow-xl' : 'bg-black/20 border-white/5'}`}>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className={`text-[10px] font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-sky-400' : 'opacity-30'}`}>{t('source_sound_goal')}</h5>
                      {(layer as any).plugin && (
                         <button 
                            onClick={() => handleRegenerate(layer, idx, 0, 'vocal-track')}
                            disabled={regeneratingPluginId === `vocal-track-${idx}-0`}
                            className="p-1 rounded-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-all"
                            title={t('regenerate_plugin') || 'Regenerate Plugin'}
                          >
                            <RefreshCw className={`w-3 h-3 ${regeneratingPluginId === `vocal-track-${idx}-0` ? 'animate-spin' : ''}`} />
                          </button>
                      )}
                    </div>
                    <p className="text-sm font-bold opacity-100">{layer.sourceSoundGoal}</p>
                    {(layer as any).plugin && (
                      <span className={`text-[10px] font-black uppercase tracking-widest mt-1 block ${theme === 'coldest' ? 'text-sky-400' : 'text-sky-400'}`}>{(layer as any).plugin}</span>
                    )}
                  </div>

                  {layer.deepDive && layer.deepDive?.length > 0 && (
                    <div className={`mb-6 p-4 rounded-2xl border ${
                      theme === 'coldest' ? 'bg-black/40 border-sky-500/20' : 'bg-white/5 border-white/10'
                    } ${regeneratingPluginId === `vocal-track-${idx}-0` ? 'opacity-50 blur-sm' : ''} relative`}>
                      {regeneratingPluginId === `vocal-track-${idx}-0` && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-2">
                        <h5 className={`text-[8px] font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-sky-400' : 'opacity-60'}`}>{t('source_settings')}</h5>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {Array.isArray(layer.deepDive) && layer.deepDive?.map((s, sIdx) => (
                          <div key={sIdx} className="flex justify-between text-[9px] font-bold">
                            <span className={`${theme === 'coldest' ? 'text-sky-300/70' : 'opacity-60'}`}>{s.parameter}</span>
                            <span className="text-current">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {layer.loopGuide && (
                    <div className="mb-6">
                      <h5 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-30'}`}>{t('recording_arrangement_guide')}</h5>
                      <p className="text-sm font-bold opacity-100">{layer.loopGuide}</p>
                    </div>
                  )}
                  
                  {layer.fxPlugins && layer.fxPlugins?.length > 0 && (
                    <div className="mb-6">
                      <h5 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-30'}`}>{t('processing_chain')}</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.isArray(layer.fxPlugins) && layer.fxPlugins.map((dive, dIdx) => (
                        <PluginBubble 
                          key={dIdx}
                          name={dive.name}
                          purpose={dive.purpose}
                          deepDive={dive.deepDive}
                          isRegenerating={regeneratingPluginId === `vocal-track-fx-${idx}-${dIdx}`}
                          onRegenerate={() => handleRegenerate(dive, idx, dIdx, 'vocal-track-fx')}
                          onCorrect={onCorrectPlugin}
                          onContactSupport={onContactSupport}
                          theme={theme}
                          className={theme === 'coldest' ? 'bg-purple-900/40 border-purple-500/40 shadow-md' : 'bg-white/5 border-white/10'}
                        />
                        ))}
                      </div>
                    </div>
                  )}

                  {layer.busSend && (
                    <div className="mt-4">
                      <h5 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'coldest' ? 'text-sky-400' : 'opacity-30'}`}>{t('bus_routing')}</h5>
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border ${
                        theme === 'coldest' ? 'bg-orange-500 text-white border-orange-400' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      }`}>{t('sends_to')} {layer.busSend}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-black uppercase tracking-widest opacity-40 mb-4">{t('layering_strategy')}</h4>
            <div className={`p-6 rounded-3xl border ${theme === 'coldest' ? 'bg-white/50 border-white/40' : 'bg-black/20 border-white/5'}`}>
              <p className="text-sm font-bold opacity-90">{recipe.gangstaVox.layeringStrategy}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className={`mt-8 p-6 rounded-3xl border ${theme === 'coldest' ? 'bg-[#020617]/80 border-sky-500/30' : 'bg-sky-900/20 border-sky-500/30'}`}>
        <h4 className={`text-sm font-black uppercase tracking-widest mb-2 ${theme === 'coldest' ? 'text-sky-400' : 'text-sky-600 dark:text-sky-400'}`}>{t('need_specific_help')}</h4>
        <p className="text-xs font-bold opacity-90 mb-4">{t('specific_help_desc')}</p>
        
        <div className="flex gap-2 mb-6">
          <input
            id="specific-help-query"
            type="text"
            value={specificHelpQuery}
            onChange={(e) => setSpecificHelpQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSpecificHelpSearch()}
            placeholder={t('specific_help_placeholder')}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm outline-none transition-all ${
              theme === 'coldest' ? 'bg-black/60 border-2 border-sky-500/30 focus:border-sky-500 text-white' : 'bg-black/40 border-2 border-sky-500/30 focus:border-sky-500'
            }`}
          />
          <button
            onClick={handleSpecificHelpSearch}
            disabled={isLoadingSpecificHelp || !specificHelpQuery.trim()}
            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center disabled:opacity-50 ${
              theme === 'coldest' ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg shadow-sky-900/20' : 'bg-sky-500 text-white hover:bg-sky-600'
            }`}
          >
            {isLoadingSpecificHelp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>

        {chatHistory.length > 0 && (
          <div className="space-y-4 mt-6 pt-6 border-t border-sky-500/20 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {chatHistory.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl border ${
                  msg.role === 'user' 
                    ? (theme === 'coldest' ? 'bg-sky-600 text-white border-sky-700 rounded-tr-sm' : 'bg-sky-500 text-white border-sky-600 rounded-tr-sm')
                    : (theme === 'coldest' ? 'bg-white border-sky-100 rounded-tl-sm' : 'bg-black/40 border-sky-500/20 rounded-tl-sm')
                }`}>
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-[8px] font-black text-white">{t('ai')}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-sky-500">{t('architect')}</span>
                    </div>
                  )}
                  <div className="text-sm font-bold opacity-90 leading-relaxed whitespace-pre-wrap markdown-body">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>


      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal(prev => ({ ...prev, isOpen: false }))}
        title={errorModal.title}
        errorMessage={errorModal.message}
        stackTrace={errorModal.stack}
        theme={theme}
      />
    </motion.div>
  );
};
