
import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { AppTheme, VSTPlugin } from '../types';
import JSZip from 'jszip';

interface DAWGuideProps {
  theme: AppTheme;
  onClose: () => void;
  userPlugins?: VSTPlugin[];
}

export const DAWGuide: React.FC<DAWGuideProps> = ({ theme, onClose, userPlugins = [] }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'reaper' | 'studio-one' | 'pro-tools' | 'cubase' | 'fl-studio' | 'ableton' | 'logic' | 'bitwig' | 'mixcraft' | 'garage-band' | 'reason'>('ableton');
  const [mode, setMode] = useState<'guides' | 'diagnostics'>('guides');

  // Diagnostics states
  const [isReading, setIsReading] = useState(false);
  const [diagError, setDiagError] = useState<string | null>(null);
  const [parsedTracks, setParsedTracks] = useState<any[]>([]);
  const [copiedDiag, setCopiedDiag] = useState(false);

  const checkPluginMatch = (name: string, vendor: string, deviceID: string) => {
    if (!userPlugins || userPlugins.length === 0) {
      return {
        status: 'no-library',
        message: 'No plugins found in your custom library. Please upload a settings XML/CSV.'
      };
    }
    
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const libMatch = userPlugins.find(p => {
      const cleanLibName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanLibName === cleanName || (cleanLibName.length > 3 && cleanName.includes(cleanLibName));
    });
    
    if (!libMatch) {
      return {
        status: 'not-found',
        message: 'Name not matched in active library. Studio One will default or skip.'
      };
    }
    
    const cleanLibID = (libMatch.id || "").replace(/[{}]/g, '').trim().toLowerCase();
    const cleanProjID = deviceID.replace(/[{}]/g, '').trim().toLowerCase();
    
    if (!cleanProjID) {
      return {
        status: 'no-id',
        message: 'No deviceID found in .dawproject XML.'
      };
    }
    
    if (cleanLibID === cleanProjID) {
      return {
        status: 'matched',
        message: `ID fully matches system library: ${libMatch.id}`
      };
    }
    
    const GENERIC_ID = "565354506c7567696e56616c69644944".toLowerCase();
    if (cleanProjID === GENERIC_ID) {
      return {
        status: 'fallback',
        libraryId: libMatch.id,
        message: `Generic fallback ID active. System expects: "${libMatch.id || 'N/A'}"`
      };
    }
    
    return {
      status: 'mismatch',
      libraryId: libMatch.id,
      message: `ID Mismatch! XML contains: "${deviceID}", Library has: "${libMatch.id}"`
    };
  };

  const handleDawProjectUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsReading(true);
      setDiagError(null);
      
      const zip = await JSZip.loadAsync(file);
      const projectXmlFile = zip.file('project.xml');
      if (!projectXmlFile) {
        throw new Error("Could not find project.xml in the uploaded zip. Is this a valid .dawproject?");
      }

      const xmlString = await projectXmlFile.async('text');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      
      const trackNodes = xmlDoc.getElementsByTagName("Track");
      const tracksList: any[] = [];
      
      for (let i = 0; i < trackNodes.length; i++) {
        const track = trackNodes[i];
        const trackName = track.getAttribute("name") || "Untitled Track";
        const contentType = track.getAttribute("contentType") || "audio";
        
        const channels = track.getElementsByTagName("Channel");
        const pluginsList: any[] = [];
        
        if (channels.length > 0) {
          const channel = channels[0];
          const devicesWrapper = channel.getElementsByTagName("Devices");
          if (devicesWrapper.length > 0) {
            const devices = devicesWrapper[0];
            const deviceChildren = devices.children;
            for (let j = 0; j < deviceChildren.length; j++) {
              const device = deviceChildren[j];
              const tagName = device.tagName;
              const deviceName = device.getAttribute("deviceName") || "Unknown Plugin";
              const deviceVendor = device.getAttribute("deviceVendor") || "Unknown Vendor";
              const deviceID = device.getAttribute("deviceID") || "";
              
              const matchResult = checkPluginMatch(deviceName, deviceVendor, deviceID);
              
              pluginsList.push({
                tagName,
                deviceName,
                deviceVendor,
                deviceID,
                match: matchResult
              });
            }
          }
        }
        
        tracksList.push({
          name: trackName,
          contentType,
          plugins: pluginsList
        });
      }
      
      setParsedTracks(tracksList);
      setIsReading(false);
    } catch (err: any) {
      setDiagError(err.message || "Failed to parse .dawproject archive.");
      setIsReading(false);
    }
  };

  const generateReportText = () => {
    if (!parsedTracks || parsedTracks.length === 0) return "";
    
    let report = `### DAWPROJECT DIAGNOSTIC REPORT\n`;
    report += `Generated at: ${new Date().toISOString()}\n`;
    report += `Total Tracks: ${parsedTracks.length}\n\n`;
    
    parsedTracks.forEach((t: any) => {
      report += `#### Track: ${t.name} (${t.contentType})\n`;
      if (t.plugins.length === 0) {
        report += `- No inserts found.\n`;
      } else {
        t.plugins.forEach((p: any) => {
          const matchSymbol = p.match.status === 'matched' ? '✅' : p.match.status === 'fallback' ? '⚠️' : '❌';
          report += `- [${p.tagName}] **${p.deviceName}** (${p.deviceVendor})\n`;
          report += `  - Embedded ID: \`${p.deviceID}\`\n`;
          report += `  - Diagnosis: ${matchSymbol} ${p.match.message}\n`;
        });
      }
      report += `\n`;
    });
    
    return report;
  };

  const handleCopyReport = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopiedDiag(true);
    setTimeout(() => setCopiedDiag(false), 2000);
  };

  const containerClasses = theme === 'coldest' 
    ? "bg-white/95 border-white text-[#0c4a6e]" 
    : theme === 'hustle-time'
    ? "bg-[#001a14]/95 border-yellow-500/30 text-yellow-50"
    : "bg-black/95 border-red-900/50 text-red-50";

  const tabClasses = (id: string) => {
    const active = activeTab === id;
    if (theme === 'coldest') {
      return active 
        ? "bg-sky-500 text-white shadow-lg" 
        : "bg-white/50 text-sky-900 hover:bg-white/80";
    } else if (theme === 'hustle-time') {
      return active 
        ? "bg-yellow-500 text-emerald-950 shadow-lg shadow-yellow-900/40" 
        : "bg-black/40 text-yellow-400 hover:bg-black/60";
    } else {
      return active 
        ? "bg-red-600 text-white shadow-lg shadow-red-900/40" 
        : "bg-black/40 text-red-400 hover:bg-black/60";
    }
  };

  const modeBtnClasses = (active: boolean) => {
    if (active) {
      if (theme === 'coldest') return "bg-sky-500 text-white shadow-md shadow-sky-500/10 border-sky-500";
      if (theme === 'hustle-time') return "bg-yellow-500 text-[#001a14] font-black shadow-md border-yellow-500";
      return "bg-red-600 text-white shadow-md border-red-600";
    } else {
      if (theme === 'coldest') return "text-sky-900 border-sky-500/20 hover:bg-sky-50 bg-[#0c4a6e]/5";
      if (theme === 'hustle-time') return "text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/5 bg-[#001a14]/60";
      return "text-red-400 border-red-500/20 hover:bg-red-500/5 bg-black/40";
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-2xl rounded-[3rem] border p-8 shadow-2xl overflow-hidden relative ${containerClasses}`}>
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {mode === 'guides' ? (
          <>
            <h2 className="text-3xl font-black tracking-tighter mb-2">{t('locate_plugin_list_title')}</h2>
            <p className="text-sm opacity-70 mb-4 font-medium">{t('import_plugin_library_desc')}</p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-black tracking-tighter mb-2">DAWProject Diagnostics</h2>
            <p className="text-sm opacity-70 mb-4 font-medium">Verify track structures, match ClassIDs, and troubleshoot plugin mapping issues.</p>
          </>
        )}

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setMode('guides')} 
            className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 border ${modeBtnClasses(mode === 'guides')}`}
          >
            📋 Import Library Guides
          </button>
          <button 
            onClick={() => setMode('diagnostics')} 
            className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 border ${modeBtnClasses(mode === 'diagnostics')}`}
          >
            🔍 DAWProject File Inspector
          </button>
        </div>

        {mode === 'guides' ? (
          <>
            <div className="grid grid-cols-4 gap-2 mb-6 p-1 bg-black/5 rounded-2xl">
              <button 
                onClick={() => setActiveTab('ableton')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('ableton')}`}
              >
                Ableton
              </button>
              <button 
                onClick={() => setActiveTab('logic')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('logic')}`}
              >
                Logic
              </button>
              <button 
                onClick={() => setActiveTab('fl-studio')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('fl-studio')}`}
              >
                FL Studio
              </button>
              <button 
                onClick={() => setActiveTab('reaper')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('reaper')}`}
              >
                REAPER
              </button>
              <button 
                onClick={() => setActiveTab('studio-one')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('studio-one')}`}
              >
                Studio One
              </button>
              <button 
                onClick={() => setActiveTab('pro-tools')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('pro-tools')}`}
              >
                Pro Tools
              </button>
              <button 
                onClick={() => setActiveTab('cubase')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('cubase')}`}
              >
                Cubase
              </button>
              <button 
                onClick={() => setActiveTab('bitwig')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('bitwig')}`}
              >
                Bitwig
              </button>
              <button 
                onClick={() => setActiveTab('mixcraft')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('mixcraft')}`}
              >
                Mixcraft
              </button>
              <button 
                onClick={() => setActiveTab('garage-band')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('garage-band')}`}
              >
                Garage Band
              </button>
              <button 
                onClick={() => setActiveTab('reason')}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses('reason')}`}
              >
                Reason
              </button>
            </div>

            <div className="space-y-6 min-h-[300px] max-h-[350px] overflow-y-auto pr-2 animate-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'ableton' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_ableton_step1">In Ableton, go to your <strong className="font-black">User Library</strong> or <strong className="font-black">Plug-ins</strong> folder.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_ableton_step2">Select your favorite plugins, right-click and <strong className="font-black">Rename</strong>, then copy the text.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_ableton_step3">Alternatively, use the <strong className="font-black">Paste List</strong> button here and paste your plugin names.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_ableton_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'logic' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_logic_step1">Go to <strong className="font-black">Logic Pro</strong> {'>'} <strong className="font-black">Settings</strong> {'>'} <strong className="font-black">Plug-in Manager</strong>.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_logic_step2">Select the plugins you want to export and <strong className="font-black">Command+C</strong> to copy.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_logic_step3">Click <strong className="font-black">Paste List</strong> here and paste the names.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_logic_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'bitwig' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_bitwig_step1">In Bitwig, go to <strong className="font-black">Settings</strong> {'>'} <strong className="font-black">Plug-ins</strong>.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed">{t('daw_bitwig_step2')}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_bitwig_step3">Copy the names of your go-to plugins and use the <strong className="font-black">Paste List</strong> feature.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_bitwig_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'reaper' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_reaper_step1">Go to <strong className="font-black">Options</strong> {'>'} <strong className="font-black">Show resource path...</strong> in REAPER.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_reaper_step2">Find <code className="bg-black/5 px-2 py-1 rounded font-mono font-bold">reaper-vstplugins64.ini</code>.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_reaper_step3">Either <strong className="font-black">copy/paste</strong> the text or <strong className="font-black">upload</strong> the file directly.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_reaper_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'studio-one' && (
                <div className="space-y-6">
                  {/* Method A: XML / Settings */}
                  <div className={`p-5 rounded-2xl border ${
                    theme === 'coldest' 
                      ? 'border-sky-500/20 bg-sky-500/5 text-sky-900' 
                      : theme === 'hustle-time' 
                      ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-50' 
                      : 'border-red-500/20 bg-red-500/5 text-red-50'
                  }`}>
                    <h4 className={`text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-1 ${
                      theme === 'coldest' ? 'text-sky-600' : theme === 'hustle-time' ? 'text-yellow-400' : 'text-red-500'
                    }`}>
                      <span>Method A: Upload Plugins Settings (XML)</span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-black ml-auto ${
                        theme === 'coldest' 
                          ? 'bg-sky-500/20 text-sky-700' 
                          : theme === 'hustle-time' 
                          ? 'bg-yellow-500/20 text-yellow-300' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>Fastest</span>
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                          theme === 'coldest' ? 'bg-sky-500/20 text-sky-700' : theme === 'hustle-time' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-400'
                        }`}>1</div>
                        <div className="text-sm leading-relaxed w-full">
                          <p className="font-bold mb-1.5">Locate your settings folder based on your Operating System:</p>
                          
                          <div className={`p-3 rounded-xl text-xs font-mono space-y-2 border ${
                            theme === 'coldest' 
                              ? 'bg-sky-50/50 text-sky-950 border-sky-100' 
                              : 'bg-black/40 text-[#fef08a] border-white/5'
                          }`}>
                            <div>
                              <p className={`font-black uppercase text-[10px] tracking-wider mb-1 ${theme === 'coldest' ? 'text-sky-700' : 'text-red-400'}`}>Windows Path (User-defined / Custom folders):</p>
                              <code className="select-all block p-1.5 rounded bg-black/20 text-white font-bold select-all break-all">%AppData%\PreSonus\Studio One 6\User\</code>
                            </div>
                            <div>
                              <p className={`font-black uppercase text-[10px] tracking-wider mb-1 ${theme === 'coldest' ? 'text-sky-700' : 'text-red-400'}`}>Windows Path (Global x64 Plugin List / Translation):</p>
                              <code className="select-all block p-1.5 rounded bg-black/20 text-white font-bold select-all break-all">%AppData%\PreSonus\Studio One 6\x64\Plugins-en.settings</code>
                            </div>
                            <div>
                              <p className={`font-black uppercase text-[10px] tracking-wider mb-1 ${theme === 'coldest' ? 'text-sky-700' : 'text-red-400'}`}>macOS (Mac) Path:</p>
                              <code className="select-all block p-1.5 rounded bg-black/20 text-white font-bold select-all break-all">~/Library/Application Support/PreSonus/Studio One 6/User/</code>
                            </div>
                          </div>
                          <p className="text-[11px] opacity-75 mt-1.5 italic">Note: Replace "Studio One 6" if you are using Studio One 5 or 4.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                          theme === 'coldest' ? 'bg-sky-500/20 text-sky-700' : theme === 'hustle-time' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-400'
                        }`}>2</div>
                        <p className="text-sm leading-relaxed">
                          Find <strong className="font-extrabold">Plugins-en.settings</strong>, <strong className="font-extrabold">Plugins-en.xml</strong>, <strong className="font-extrabold">PluginComponents.settings</strong>, or <strong className="font-extrabold">PluginPresentation.settings</strong>.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                          theme === 'coldest' ? 'bg-sky-500/20 text-sky-700' : theme === 'hustle-time' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-400'
                        }`}>3</div>
                        <p className="text-sm leading-relaxed">
                          <strong className="font-extrabold">Upload that settings xml/file</strong> directly or <strong className="font-extrabold">copy-paste its text data</strong> inside the input box to configure your plugins.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Method B: Diagnostic Report / CSV */}
                  <div className={`p-5 rounded-2xl border ${
                    theme === 'coldest' 
                      ? 'border-[#0c4a6e]/10 bg-black/5 text-sky-900' 
                      : 'border-white/10 bg-white/5 text-white/90'
                  }`}>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-3 opacity-80">
                      Method B: Create Diagnostic Report (CSV Export)
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-black text-xs flex-shrink-0">1</div>
                        <p className="text-sm leading-relaxed">Open Studio One and select <strong className="font-black">Help</strong> from the top menu.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-black text-xs flex-shrink-0">2</div>
                        <p className="text-sm leading-relaxed">Click <strong className="font-black">Create Diagnostic Report</strong>.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-black text-xs flex-shrink-0">3</div>
                        <p className="text-sm leading-relaxed">Locate <strong className="font-black">PluginManagement.csv</strong> inside the generated ZIP file.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-black text-xs flex-shrink-0">4</div>
                        <p className="text-sm leading-relaxed">Upload that CSV / list file directly details here, or copy and paste the CSV text.</p>
                      </div>
                    </div>
                  </div>

                  {/* Method C: Smart Combined Mode */}
                  <div className={`p-5 rounded-2xl border ${
                    theme === 'coldest' 
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-900' 
                      : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-100'
                  }`}>
                    <h4 className={`text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-1 ${
                      theme === 'coldest' ? 'text-emerald-600' : 'text-emerald-400'
                    }`}>
                      <span>🌟 Method C: Combined Ultimate Accuracy</span>
                      <span className="text-[10px] uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black ml-auto">Recommended</span>
                    </h4>
                    <p className="text-xs leading-relaxed mb-3 opacity-90">
                      Because <strong className="font-bold">PluginPresentation.settings</strong> only contains internal technical IDs (GUIDs) and <strong className="font-bold">PluginManagement.csv</strong> has human-readable names but lacks GUID mapping, you can now upload or drop <strong className="font-black text-emerald-400">BOTH files simultaneously</strong>!
                    </p>
                    <div className="space-y-2 text-xs leading-relaxed opacity-85">
                      <p>1. Simply **drag and drop both files together** into the upload area (or select both using the file chooser).</p>
                      <p>2. Our smart library parser will instantly combine their contents, automatically merging named plugins with their official Studio One ClassIDs for perfect dawproject exporting!</p>
                      <p className="text-[10px] opacity-75 italic">* Note: You can still paste or import them one-by-one if you prefer, as they will merge into your active session library either way!</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'fl-studio' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_fl_studio_step1">In FL Studio, open the <strong className="font-black">Plugin Manager</strong> (Options {'>'} Manage plugins).</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_fl_studio_step2">Run a scan if needed, then look for the <strong className="font-black">Plugin list</strong> in your FL Studio data folder.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_fl_studio_step3">Alternatively, use the <strong className="font-black">Paste List</strong> button here and paste the names of your favorite plugins.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_fl_studio_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'pro-tools' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed">{t('daw_pro_tools_step1')}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_pro_tools_step2">Select all files in the folder and <strong className="font-black">Copy as Path</strong> or list them.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_pro_tools_step3">Click the <strong className="font-black">Paste List</strong> button and paste your list there.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_pro_tools_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'cubase' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_cubase_step1">In Cubase, go to <strong className="font-black">Studio</strong> {'>'} <strong className="font-black">Plug-in Manager</strong>.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_cubase_step2">Click the <strong className="font-black">Export</strong> icon (top right) to save a list.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_cubase_step3">Click the <strong className="font-black">Paste List</strong> button and paste the content there.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_cubase_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'mixcraft' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_mixcraft_step1">Press <strong className="font-black">Win + R</strong>, type <code className="bg-black/5 px-2 py-1 rounded font-mono font-bold">%AppData%\Acoustica\Mixcraft\</code> and hit Enter.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_mixcraft_step2">Locate the <strong className="font-black">vst-inventory.xml</strong> file and upload it directly to BeatGangsta using the upload button.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_mixcraft_step3">BeatGangsta will automatically process your XML inventory to build your Gear Rack.</Trans></p>
                  </div>
                </div>
              )}
              {activeTab === 'garage-band' && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_garage_band_step1">Open <strong className="font-black">Finder</strong> and press <strong className="font-black">Command + Shift + G</strong>.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_garage_band_step2">Type <code className="bg-black/5 px-2 py-1 rounded font-mono font-bold">/Library/Audio/Plug-Ins/Components</code> and hit Enter.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm leading-relaxed"><Trans i18nKey="daw_garage_band_step3">Select the <strong className="font-black">.component</strong> files for your plugins and copy their names.</Trans></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-black flex-shrink-0">4</div>
                    <p className="text-sm leading-relaxed">{t('daw_garage_band_step4')}</p>
                  </div>
                </div>
              )}
              {activeTab === 'reason' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5 text-sm mb-2">
                    <p className="font-black mb-1">Reason Log.txt Support</p>
                    <p className="opacity-80 text-xs">Reason automatically logs all successfully scanned and created custom VST/VST3 and Rack Extension plugins inside its application log on startup. You can drag and drop or select your log file directly!</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0 font-bold">1</div>
                    <p className="text-sm leading-relaxed">
                      Locate your <strong className="font-black">Reason Log.txt</strong> file based on your OS:
                    </p>
                  </div>
                  <div className="pl-12 space-y-2">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-sky-600 mb-1">Windows Path (Paste in File Explorer / Run):</p>
                      <code className="select-all block p-2 rounded bg-black/10 font-mono text-xs font-bold leading-normal break-all">%LocalAppData%\Reason Studios\Reason\Logs\Reason Log.txt</code>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-sky-600 mb-1">macOS (Finder - Cmd+Shift+G):</p>
                      <code className="select-all block p-2 rounded bg-black/10 font-mono text-xs font-bold leading-normal break-all">~/Library/Application Support/Reason Studios/Reason/Logs/Reason Log.txt</code>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0 font-bold">2</div>
                    <p className="text-sm leading-relaxed">
                      <strong className="font-black">Drag & drop</strong> the file or click the upload zone on BeatGangsta to select it.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center font-black flex-shrink-0 font-bold">3</div>
                    <p className="text-sm leading-relaxed">
                      Alternatively, copy and paste its text contents directly, or upload a manual list of your plugins formatted as <code className="bg-black/5 px-1 rounded font-mono">My Plugin</code> or <code className="bg-black/5 px-1 rounded font-mono">Vendor - My Plugin</code> on separate lines.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6 min-h-[300px] max-h-[350px] overflow-y-auto pr-2 animate-in slide-in-from-bottom-4 duration-500 text-left">
            <div className={`p-6 rounded-3xl border ${
              theme === 'coldest' ? 'border-sky-100 bg-sky-500/5 text-sky-950' : theme === 'hustle-time' ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-50' : 'border-red-500/20 bg-red-500/5 text-red-50'
            }`}>
              <p className="text-xs font-black mb-3 uppercase tracking-wider opacity-85">📁 Upload Exported .dawproject File</p>
              <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-current/20 rounded-2xl p-6 hover:border-current/40 transition-all bg-black/10 text-center">
                <input 
                  type="file" 
                  accept=".dawproject" 
                  onChange={handleDawProjectUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                <svg className="w-8 h-8 mb-2 opacity-65" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-xs font-black uppercase tracking-wider">Choose or Drag File Here</p>
                <p className="text-[10px] opacity-70 mt-1">Select any exported `.dawproject` file to inspect inside browser</p>
              </div>
            </div>

            {isReading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center w-full">
                <div className={`w-8 h-8 rounded-full border-4 border-current border-t-transparent animate-spin ${theme === 'coldest' ? 'text-sky-500' : theme === 'hustle-time' ? 'text-yellow-500' : 'text-red-500'}`}></div>
                <p className="text-xs opacity-75 font-mono animate-pulse">Decompressing file and parsing project.xml...</p>
              </div>
            )}

            {diagError && (
              <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs leading-relaxed font-mono">
                🛑 Error parsing project: {diagError}
              </div>
            )}

            {!isReading && !diagError && parsedTracks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-sm font-black uppercase tracking-widest">Parsed Tracks & Inserts</h3>
                  <button 
                    onClick={handleCopyReport}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 ${
                      copiedDiag 
                        ? 'bg-emerald-500 text-white' 
                        : theme === 'coldest' 
                        ? 'bg-sky-500 text-white hover:bg-sky-600' 
                        : theme === 'hustle-time' 
                        ? 'bg-yellow-500 text-emerald-950 hover:bg-yellow-600' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {copiedDiag ? 'Copied!' : '📋 Copy Diagnostic Report'}
                  </button>
                </div>

                <div className="space-y-3">
                  {parsedTracks.map((track, tIdx) => (
                    <div key={tIdx} className="border border-white/5 rounded-2xl bg-black/20 p-4 text-left">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {track.name}
                        </span>
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-white/5 font-mono tracking-wider opacity-60">
                          {track.contentType}
                        </span>
                      </div>

                      {track.plugins.length === 0 ? (
                        <p className="text-[11px] opacity-50 italic pl-3">No inserts mapped or active on this track.</p>
                      ) : (
                        <div className="space-y-2 mt-2">
                          {track.plugins.map((plug: any, pIdx: number) => {
                            const status = plug.match.status;
                            return (
                              <div key={pIdx} className="flex flex-col gap-1 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs text-left">
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold flex items-center gap-1 text-white">
                                    <span className="text-white/40 font-mono text-[9px] uppercase">{plug.tagName === 'vst3Plugin' ? 'VST3' : 'VST2'}</span>
                                    {plug.deviceName}
                                  </span>
                                  <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-black tracking-wider ${
                                    status === 'matched' 
                                      ? 'bg-emerald-500/20 text-emerald-400' 
                                      : status === 'fallback' 
                                      ? 'bg-yellow-500/20 text-yellow-500' 
                                      : 'bg-red-500/20 text-red-400'
                                  }`}>
                                    {status === 'matched' ? 'Matched ID' : status === 'fallback' ? 'Fallback ID' : 'Unmatched'}
                                  </span>
                                </div>
                                <span className="text-[10px] opacity-60 font-medium">Vendor: {plug.deviceVendor}</span>
                                <span className="text-[10px] opacity-60 font-mono select-all">Device ID: {plug.deviceID || 'None'}</span>
                                <p className={`text-[10px] font-bold mt-1.5 pt-1.5 border-t border-white/5 leading-relaxed ${
                                  status === 'matched' ? 'text-emerald-400/80' : status === 'fallback' ? 'text-yellow-500/80' : 'text-red-400/80'
                                }`}>
                                  💡 {plug.match.message}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isReading && !diagError && parsedTracks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
                <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xs font-black uppercase tracking-wider">No Project Loaded</p>
                <p className="text-[10px] mt-1 pr-6 pl-6 max-w-sm">Drop your exported DAWProject zip archive above to run an instant insert plugin compatibility scan.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-10">
          <button 
            onClick={onClose}
            className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all ${theme === 'coldest' ? 'bg-sky-500 text-white hover:bg-sky-600' : theme === 'hustle-time' ? 'bg-yellow-500 text-[#001a14] hover:bg-yellow-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            {t('i_am_ready')}
          </button>
        </div>
      </div>
    </div>
  );
};
