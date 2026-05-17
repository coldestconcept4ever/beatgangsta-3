import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { AppTheme } from '../types';

interface DAWGuideProps {
  theme: AppTheme;
  onClose: () => void;
}

const OS_DAWS: Record<'windows' | 'mac' | 'linux', string[]> = {
  windows: ['ableton', 'fl-studio', 'reaper', 'studio-one', 'pro-tools', 'cubase', 'bitwig', 'mixcraft'],
  mac: ['ableton', 'logic', 'fl-studio', 'reaper', 'studio-one', 'pro-tools', 'cubase', 'bitwig', 'garage-band'],
  linux: ['reaper', 'studio-one', 'bitwig']
};

const DAWS = [
  { id: 'ableton', name: 'Ableton' },
  { id: 'logic', name: 'Logic' },
  { id: 'fl-studio', name: 'FL Studio' },
  { id: 'reaper', name: 'REAPER' },
  { id: 'studio-one', name: 'Studio One' },
  { id: 'pro-tools', name: 'Pro Tools' },
  { id: 'cubase', name: 'Cubase' },
  { id: 'bitwig', name: 'Bitwig' },
  { id: 'mixcraft', name: 'Mixcraft' },
  { id: 'garage-band', name: 'Garage Band' }
] as const;

type DawId = typeof DAWS[number]['id'];

export const DAWGuide: React.FC<DAWGuideProps> = ({ theme, onClose }) => {
  const { t } = useTranslation();
  const [selectedOS, setSelectedOS] = useState<'windows' | 'mac' | 'linux' | null>(null);
  const [activeTab, setActiveTab] = useState<DawId>('ableton');

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

  useEffect(() => {
    if (selectedOS) {
      if (!OS_DAWS[selectedOS].includes(activeTab)) {
        setActiveTab(OS_DAWS[selectedOS][0] as DawId);
      }
    }
  }, [selectedOS, activeTab]);

  const availableDaws = selectedOS ? DAWS.filter(d => OS_DAWS[selectedOS].includes(d.id)) : DAWS;

  const renderPathHint = (daw: DawId) => {
    if (!selectedOS) return null;
    let path = "";
    
    if (daw === 'ableton') {
      path = selectedOS === 'mac' ? '/Library/Audio/Plug-Ins/ or Users/[username]/Music/Ableton/User Library' : 'C:\\ProgramData\\Ableton or C:\\Program Files\\VstPlugins';
    } else if (daw === 'pro-tools') {
      path = selectedOS === 'mac' ? '/Library/Application Support/Avid/Audio/Plug-Ins/' : 'C:\\Program Files\\Common Files\\Avid\\Audio\\Plug-Ins\\';
    } else if (daw === 'fl-studio') {
      path = selectedOS === 'mac' ? 'Documents/Image-Line/FL Studio/Presets/Plugin database' : 'Documents\\Image-Line\\FL Studio\\Presets\\Plugin database';
    } else if (daw === 'reaper') {
      path = selectedOS === 'linux' ? '~/.config/REAPER/reaper-vstplugins64.ini' : selectedOS === 'mac' ? '~/Library/Application Support/REAPER/reaper-vstplugins64.ini' : '%AppData%\\REAPER\\reaper-vstplugins64.ini';
    } else if (daw === 'mixcraft' && selectedOS === 'windows') {
      path = '%AppData%\\Acoustica\\Mixcraft\\';
    } else if (daw === 'garage-band' && selectedOS === 'mac') {
      path = '/Library/Audio/Plug-Ins/Components';
    }

    if (!path) return null;
    return (
      <div className="mt-2 text-xs font-mono bg-black/10 p-2 rounded break-all">
        <strong className="text-current opacity-80">OS Path Hint:</strong> <br />
        <span className="font-bold">{path}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-2xl rounded-[3rem] border p-8 shadow-2xl overflow-hidden relative ${containerClasses} max-h-[90vh] overflow-y-auto flex flex-col`}>
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-black tracking-tighter mb-2">{t('locate_plugin_list_title')}</h2>
        <p className="text-sm opacity-70 mb-6 font-medium">{t('import_plugin_library_desc')}</p>

        {/* OS Toggle Zone */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-8">
          {['windows', 'mac', 'linux'].map(os => (
            <button
              key={os}
              onClick={() => setSelectedOS(os as any)}
              className={`px-4 sm:px-6 py-3 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest transition-all ${
                selectedOS === os 
                  ? theme === 'coldest' ? 'bg-sky-500 text-white shadow-lg' : theme === 'hustle-time' ? 'bg-yellow-500 text-emerald-950 shadow-lg shadow-yellow-900/40' : 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'bg-black/10 hover:bg-black/20 text-current opacity-70 hover:opacity-100'
              }`}
            >
              {os === 'windows' ? 'Windows' : os === 'mac' ? 'Mac' : 'Linux'}
            </button>
          ))}
        </div>

        <div className={`transition-all duration-500 flex-1 flex flex-col ${!selectedOS ? 'opacity-30 blur-md pointer-events-none' : 'opacity-100'}`}>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8 p-1 bg-black/5 rounded-2xl">
            {availableDaws.map(daw => (
              <button 
                key={daw.id}
                onClick={() => setActiveTab(daw.id as DawId)}
                className={`py-3 px-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabClasses(daw.id)}`}
              >
                {daw.name}
              </button>
            ))}
          </div>

          <div className="space-y-6 flex-1 min-h-[300px]">
            {activeTab === 'ableton' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-sky-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>1</div>
                  <div className="text-sm leading-relaxed">
                    <Trans i18nKey="daw_ableton_step1">In Ableton, go to your <strong className="font-black">User Library</strong> or <strong className="font-black">Plug-ins</strong> folder.</Trans>
                    {renderPathHint('ableton')}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-sky-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>2</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_ableton_step2">Select your favorite plugins, right-click and <strong className="font-black">Rename</strong>, then copy the text.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-sky-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>3</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_ableton_step3">Alternatively, use the <strong className="font-black">Paste List</strong> button here and paste your plugin names.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-sky-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>4</div>
                  <p className="text-sm leading-relaxed">{t('daw_ableton_step4')}</p>
                </div>
              </div>
            )}
            {activeTab === 'logic' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-indigo-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>1</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_logic_step1">Go to <strong className="font-black">Logic Pro</strong> {'>'} <strong className="font-black">Settings</strong> {'>'} <strong className="font-black">Plug-in Manager</strong>.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-indigo-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>2</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_logic_step2">Select the plugins you want to export and <strong className="font-black">Command+C</strong> to copy.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-indigo-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>3</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_logic_step3">Click <strong className="font-black">Paste List</strong> here and paste the names.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-indigo-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>4</div>
                  <p className="text-sm leading-relaxed">{t('daw_logic_step4')}</p>
                </div>
              </div>
            )}
            {activeTab === 'bitwig' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>1</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_bitwig_step1">In Bitwig, go to <strong className="font-black">Settings</strong> {'>'} <strong className="font-black">Plug-ins</strong>.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>2</div>
                  <p className="text-sm leading-relaxed">{t('daw_bitwig_step2')}</p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>3</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_bitwig_step3">Copy the names of your go-to plugins and use the <strong className="font-black">Paste List</strong> feature.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>4</div>
                  <p className="text-sm leading-relaxed">{t('daw_bitwig_step4')}</p>
                </div>
              </div>
            )}
            {activeTab === 'reaper' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-sky-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>1</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_reaper_step1">Go to <strong className="font-black">Options</strong> {'>'} <strong className="font-black">Show resource path...</strong> in REAPER.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-sky-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>2</div>
                  <div className="text-sm leading-relaxed">
                    <Trans i18nKey="daw_reaper_step2">Find <code className="bg-black/5 px-2 py-1 rounded font-mono font-bold">reaper-vstplugins64.ini</code>.</Trans>
                    {renderPathHint('reaper')}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-sky-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>3</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_reaper_step3">Either <strong className="font-black">copy/paste</strong> the text or <strong className="font-black">upload</strong> the file directly.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-sky-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>4</div>
                  <p className="text-sm leading-relaxed">{t('daw_reaper_step4')}</p>
                </div>
              </div>
            )}
            {activeTab === 'studio-one' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-red-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>1</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_studio_one_step1">Open Studio One and select <strong className="font-black">Help</strong> from the top menu.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-red-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>2</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_studio_one_step2">Click <strong className="font-black">Create Diagnostic Report</strong>.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-red-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>3</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_studio_one_step3">Locate <strong className="font-black">PluginManagement.csv</strong> inside the generated ZIP file.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-red-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>4</div>
                  <p className="text-sm leading-relaxed">{t('daw_studio_one_step4')}</p>
                </div>
              </div>
            )}
            {activeTab === 'fl-studio' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-green-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>1</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_fl_studio_step1">In FL Studio, open the <strong className="font-black">Plugin Manager</strong> (Options {'>'} Manage plugins).</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-green-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>2</div>
                  <div className="text-sm leading-relaxed">
                    <Trans i18nKey="daw_fl_studio_step2">Run a scan if needed, then look for the <strong className="font-black">Plugin list</strong> in your FL Studio data folder.</Trans>
                    {renderPathHint('fl-studio')}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-green-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>3</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_fl_studio_step3">Alternatively, use the <strong className="font-black">Paste List</strong> button here and paste the names of your favorite plugins.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-green-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>4</div>
                  <p className="text-sm leading-relaxed">{t('daw_fl_studio_step4')}</p>
                </div>
              </div>
            )}
            {activeTab === 'pro-tools' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-blue-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>1</div>
                  <div className="text-sm leading-relaxed">
                    {t('daw_pro_tools_step1')}
                    {renderPathHint('pro-tools')}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-blue-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>2</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_pro_tools_step2">Select all files in the folder and <strong className="font-black">Copy as Path</strong> or list them.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-blue-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>3</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_pro_tools_step3">Click the <strong className="font-black">Paste List</strong> button and paste your list there.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-blue-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>4</div>
                  <p className="text-sm leading-relaxed">{t('daw_pro_tools_step4')}</p>
                </div>
              </div>
            )}
            {activeTab === 'cubase' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>1</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_cubase_step1">In Cubase, go to <strong className="font-black">Studio</strong> {'>'} <strong className="font-black">Plug-in Manager</strong>.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>2</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_cubase_step2">Click the <strong className="font-black">Export</strong> icon (top right) to save a list.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>3</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_cubase_step3">Click the <strong className="font-black">Paste List</strong> button and paste the content there.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>4</div>
                  <p className="text-sm leading-relaxed">{t('daw_cubase_step4')}</p>
                </div>
              </div>
            )}
            {activeTab === 'mixcraft' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-blue-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>1</div>
                  <div className="text-sm leading-relaxed">
                    <Trans i18nKey="daw_mixcraft_step1">Press <strong className="font-black">Win + R</strong>, type <code className="bg-black/5 px-2 py-1 rounded font-mono font-bold">%AppData%\Acoustica\Mixcraft\</code> and hit Enter.</Trans>
                    {renderPathHint('mixcraft')}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-blue-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>2</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_mixcraft_step2">Locate the <strong className="font-black">vst-inventory.xml</strong> file and upload it directly to BeatGangsta using the upload button.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-blue-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>3</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_mixcraft_step3">BeatGangsta will automatically process your XML inventory to build your Gear Rack.</Trans></p>
                </div>
              </div>
            )}
            {activeTab === 'garage-band' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>1</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_garage_band_step1">Open <strong className="font-black">Finder</strong> and press <strong className="font-black">Command + Shift + G</strong>.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>2</div>
                  <div className="text-sm leading-relaxed">
                    <Trans i18nKey="daw_garage_band_step2">Type <code className="bg-black/5 px-2 py-1 rounded font-mono font-bold">/Library/Audio/Plug-Ins/Components</code> and hit Enter.</Trans>
                    {renderPathHint('garage-band')}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>3</div>
                  <p className="text-sm leading-relaxed"><Trans i18nKey="daw_garage_band_step3">Select the <strong className="font-black">.component</strong> files for your plugins and copy their names.</Trans></p>
                </div>
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full ${theme==='coldest'?'bg-orange-500/20':'bg-red-500/20'} flex items-center justify-center font-black flex-shrink-0`}>4</div>
                  <p className="text-sm leading-relaxed">{t('daw_garage_band_step4')}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-white/10">
            <button 
              onClick={onClose}
              className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all ${theme === 'coldest' ? 'bg-sky-500 text-white hover:bg-sky-600' : theme === 'hustle-time' ? 'bg-yellow-500 text-emerald-950 hover:bg-yellow-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              {t('i_am_ready')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
