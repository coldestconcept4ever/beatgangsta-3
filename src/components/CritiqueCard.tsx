import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MixCritique, AppTheme, VSTPlugin } from '../types';
import { getSpecificMixHelp, getMixCritique, regeneratePlugin } from '../services/geminiService';
import { uploadFileChunked, deleteFileFromDrive } from '../services/uploadService';
import { motion } from 'motion/react';
import { Loader2, Search, CheckCircle2, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { PluginBubble } from './PluginBubble';
import { CritiqueHTMLTemplate } from './CritiqueHTMLTemplate';

// Dynamically import heavy libraries
const getRenderToStaticMarkup = () => import('react-dom/server').then(m => m.renderToStaticMarkup);

interface CritiqueCardProps {
  critique: MixCritique;
  theme: AppTheme;
  plugins: VSTPlugin[];
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
}

export const CritiqueCard: React.FC<CritiqueCardProps> = ({ critique, theme, plugins, audioBase64, audioUrl, geminiFileUri, mimeType, isSaved, onSave, onUpdateCritique, onReCritique, currentAudioInfo, onLogReceipt, onCorrectPlugin, onContactSupport, onMinimize }) => {
  const { t, i18n } = useTranslation();
  const [specificHelpQuery, setSpecificHelpQuery] = useState('');
  const [isLoadingSpecificHelp, setIsLoadingSpecificHelp] = useState(false);
  const [specificHelpResults, setSpecificHelpResults] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [reCritiqueContext, setReCritiqueContext] = useState("");
  const [isLoadingReCritique, setIsLoadingReCritique] = useState(false);
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [regeneratingPluginId, setRegeneratingPluginId] = useState<string | null>(null);
  const [refreshPools, setRefreshPools] = useState<Record<string, string[]>>({});

  const handleRegenerate = async (plugin: any, actionIdx: number, pluginIdx: number) => {
    const pluginId = `critique-${actionIdx}-${pluginIdx}`;
    setRegeneratingPluginId(pluginId);
    try {
      const currentPool = refreshPools[pluginId] || [plugin.name];
      const newPlugin = await regeneratePlugin(plugin.name, plugin.deepDive, critique as any, plugins, i18n.language, currentPool);
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

  const handleSpecificHelpSearch = async () => {
    if (!specificHelpQuery.trim()) return;
    
    setIsLoadingSpecificHelp(true);
    try {
      // Use fallback if current props are missing
      const finalAudioBase64 = audioBase64 || currentAudioInfo?.audioBase64 || undefined;
      const finalAudioUrl = audioUrl || currentAudioInfo?.audioUrl || undefined;
      const finalGeminiFileUri = geminiFileUri || currentAudioInfo?.geminiFileUri || undefined;
      const finalMimeType = mimeType || currentAudioInfo?.mimeType || undefined;

      const result = await getSpecificMixHelp(plugins, finalAudioBase64, finalMimeType, specificHelpQuery.trim(), critique.isGangstaVox, JSON.stringify(critique), [], finalAudioUrl, finalGeminiFileUri, i18n.language);
      
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
        null,
        i18n.language
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
                  
                  <div className="space-y-3">
                    <h6 className="text-[10px] font-black uppercase tracking-widest opacity-50">{t('recommended_chain')}</h6>
                    {Array.isArray(action.recommendedChain) && action.recommendedChain.map((plugin, pIdx) => (
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
                    ))}
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

            {specificHelpResults.length > 0 && (
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
                    
                    {result.recommendedChain && result.recommendedChain.length > 0 && (
                      <div className="space-y-2">
                        <h6 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">{t('recommended_plugins')}</h6>
                        {Array.isArray(result.recommendedChain) && result.recommendedChain.map((plugin: any, pIdx: number) => (
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
                              {Array.isArray(plugin.deepDive) && plugin.deepDive.map((param: any, dIdx: number) => (
                                <div key={dIdx} className="text-[10px] font-bold opacity-70">
                                  <span className="text-sky-500">{param.parameter}:</span> {param.value} - <span className="opacity-60">{param.explanation}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
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
