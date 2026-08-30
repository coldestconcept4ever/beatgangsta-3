
import React, { useState, useMemo, useEffect, useRef, useCallback, useTransition } from 'react';
import JSZip from 'jszip';
import { VSTPlugin, BeatRecipe, AppTheme, User, SavedRecipe, HistoryItem, Folder, KnifeStyle, PendantStyle, ChainStyle, SharedSession, DuragStyle, Hardware, FullSaveFile, GrillStyle, MixCritique, SavedCritique, TutorialProgress, ReceiptItem } from './types';
import { VIBE_EXAMPLES, SONG_EXAMPLES, BANDLAB_PLUGINS_LATEST, BANDLAB_FREE_PLUGINS_LATEST } from './constants';
import { ARTIST_EXAMPLES } from './constants/artists';
import { getBeatRecommendations, getCustomBeatRecommendations, getSongBeatRecommendations, getAudioBeatRecommendations, enrichPluginLibrary, validateApiKey, detectAPITier, replicateRecipeWithUserGear, getMixCritique, researchPluginParameters, verifyAndCorrectPlugin, ThinkingLevel, getAlbumMasteringGuide } from './services/geminiService';
import { processAudioForAnalysis } from './utils/audioUtils';
import { uploadFileChunked, deleteFileFromDrive } from './services/uploadService';
import { convertWavToMp3 } from './lib/audioConverter';
import { analyzePhysicalCharacteristics, analyzeCombinedStems } from './utils/audioAnalyzer';
import { enrichHardware } from './services/enrichmentService';
import { initAudio } from './utils/midiPlayer';
import { fetchWithDetailedError } from './lib/api';
import { parseRpp } from './utils/reaperUtils';
import { getReaperLua } from './lib/reaperLua';
import { JSFX_DATABASE } from './data/jsfxResearch';
import { DEFAULT_OWNED_XPAND_PRESETS, XPAND_CATEGORIES, XpandPreset } from './data/xpandPresets';

import { AvianField } from './components/RavenField';
import { PluginCard } from './components/PluginCard';
import { JSFXCard } from './components/JSFXCard';
import { HardwareCard } from './components/HardwareCard';
import { ErrorBoundary } from './components/ErrorBoundary';
const RecipeCard = React.lazy(() => import('./components/RecipeCard').then(m => ({ default: m.RecipeCard })));
const CritiqueCard = React.lazy(() => import('./components/CritiqueCard').then(m => ({ default: m.CritiqueCard })));
const Mascot = React.lazy(() => import('./components/Mascot').then(m => ({ default: m.Mascot })));
const PaymentMethodModal = React.lazy(() => import('./components/PaymentMethodModal').then(m => ({ default: m.PaymentMethodModal })));

const DAWGuide = React.lazy(() => import('./components/DAWGuide').then(m => ({ default: m.DAWGuide })));
const Vault = React.lazy(() => import('./components/Vault').then(m => ({ default: m.Vault })));
const LeprechaunField = React.lazy(() => import('./components/LeprechaunField').then(m => ({ default: m.LeprechaunField })));
const FoodField = React.lazy(() => import('./components/FoodField').then(m => ({ default: m.FoodField })));

import type { TutorialStep } from './components/TutorialOverlay';
import { TUTORIAL_STEPS } from './components/TutorialOverlay';

const InternationalizationModal = React.lazy(() => import('./components/InternationalizationModal').then(m => ({ default: m.InternationalizationModal })));
const CollaborationModal = React.lazy(() => import('./components/CollaborationModal').then(m => ({ default: m.CollaborationModal })));
const FriendsInfoModal = React.lazy(() => import('./components/FriendsInfoModal').then(m => ({ default: m.FriendsInfoModal })));
const AnalogEquipmentModal = React.lazy(() => import('./components/AnalogEquipmentModal').then(m => ({ default: m.AnalogEquipmentModal })));
const DawSelectionModal = React.lazy(() => import('./components/DawSelectionModal').then(m => ({ default: m.DawSelectionModal })));
const TrashModal = React.lazy(() => import('./components/TrashModal').then(m => ({ default: m.TrashModal })));
const RigManagerModal = React.lazy(() => import('./components/RigManagerModal').then(m => ({ default: m.RigManagerModal })));
const DrumKitModal = React.lazy(() => import('./components/DrumKitModal').then(m => ({ default: m.DrumKitModal })));
const CloudSyncModal = React.lazy(() => import('./components/CloudSyncModal').then(m => ({ default: m.CloudSyncModal })));
const RestoreBackupModal = React.lazy(() => import('./components/RestoreBackupModal').then(m => ({ default: m.RestoreBackupModal })));
const LegalConsentBanner = React.lazy(() => import('./components/LegalConsentBanner').then(m => ({ default: m.LegalConsentBanner })));
const RecipeViewerModal = React.lazy(() => import('./components/RecipeViewerModal').then(m => ({ default: m.RecipeViewerModal })));
import { TutorialOverlay } from './components/TutorialOverlay';
import { StatusPage } from './components/StatusPage';
import { JSFXDatabaseViewer } from './components/JSFXDatabaseViewer';
import { UadDatabaseViewer } from './components/UadDatabaseViewer';
import { JSFXAutomationChains } from './components/JSFXAutomationChains';
import { XpandDatabaseViewer } from './components/XpandDatabaseViewer';
import { AdminDashboard } from './components/AdminDashboard';
import { BetaApplicationModal } from './components/BetaApplicationModal';
import { PdfSplitter } from './components/PdfSplitter';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Download, Globe, Languages, Star, X, Upload, Cpu, Folder as FolderIcon, ShieldCheck, Check, Zap, Rocket, Eye, EyeOff, AlertTriangle, Lock, Shield, Loader2, Gem, Sword, User as UserIcon, Link, Layers, Link2, Palette, Sparkles, Drum, Image as ImageIcon, Crown, CheckCircle2, ExternalLink, Facebook, Instagram, Linkedin, Twitter, Activity, Database, Trash2, Music, Video, Cloud, Settings2, HelpCircle, Copy, Scissors } from 'lucide-react';
import { saveAs } from 'file-saver';
import tinycolor from 'tinycolor2';
import Turnstile from 'react-turnstile';
import { useScreenRecorder } from './hooks/useScreenRecorder';

const CustomColorWheel = ({ color, onChange, size = 240 }: { color: string, onChange: (hex: string) => void, size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;

    ctx.clearRect(0, 0, size, size);

    // Draw the hue wheel with saturation gradient
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 0.5) * Math.PI / 180;
      const endAngle = (angle + 1.5) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [size]);

  const handleInteraction = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = size / 2;
    const centerY = size / 2;
    
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate angle
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const hue = (angle + 360) % 360;
    
    // Clamp saturation to 100% (edge of circle)
    const saturation = Math.min(1, distance / (size / 2)) * 100;
    
    onChange(tinycolor({ h: hue, s: saturation, v: 100 }).toHexString());
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        handleInteraction(e.clientX, e.clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current) {
        e.preventDefault();
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [size]);

  return (
    <div className="relative select-none" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-crosshair rounded-full touch-none"
        onMouseDown={(e) => {
          isDragging.current = true;
          handleInteraction(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          isDragging.current = true;
          handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
        }}
      />
    </div>
  );
};

// Moved outside to prevent remounting flashes
const DownloadableLogoText = ({ currentAppName, theme }: { currentAppName: string, theme: string }) => {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLogoDataURL = async (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const scale = 4;
      canvas.width = 300 * scale;
      canvas.height = 80 * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      ctx.scale(scale, scale);
      
      let color1 = '#ffffff';
      let color2 = '#ef4444';
      
      if (theme === 'coldest') {
        color1 = '#0c4a6e';
        color2 = '#0369a1';
      } else if (theme === 'chef-mode') {
        color1 = '#431407';
        color2 = '#ea580c';
      } else if (theme === 'hustle-time') {
        color1 = '#ffffff';
        color2 = '#eab308';
      }

      ctx.textBaseline = 'top';
      
      // Line 1
      ctx.font = '900 20px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = color1;
      (ctx as any).letterSpacing = '-1px';
      ctx.fillText(currentAppName, 10, 10);
      
      // Line 2
      ctx.font = '900 9px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = color2;
      (ctx as any).letterSpacing = '2.7px';
      ctx.fillText('COLDESTCONCEPT', 10, 30);
      
      // Crop canvas to fit text
      const metrics1 = ctx.measureText(currentAppName);
      const metrics2 = ctx.measureText('COLDESTCONCEPT');
      const textWidth = Math.max(metrics1.width, metrics2.width);
      
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = (textWidth + 20) * scale;
      finalCanvas.height = 50 * scale;
      const fctx = finalCanvas.getContext('2d');
      if (!fctx) return resolve(canvas.toDataURL('image/png'));
      
      fctx.scale(scale, scale);
      fctx.textBaseline = 'top';
      
      fctx.font = '900 20px system-ui, -apple-system, sans-serif';
      fctx.fillStyle = color1;
      (fctx as any).letterSpacing = '-1px';
      fctx.fillText(currentAppName, 10, 10);
      
      fctx.font = '900 9px system-ui, -apple-system, sans-serif';
      fctx.fillStyle = color2;
      (fctx as any).letterSpacing = '2.7px';
      fctx.fillText('COLDESTCONCEPT', 10, 30);
      
      resolve(finalCanvas.toDataURL('image/png'));
    });
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      await document.fonts.ready;
      const url = await generateLogoDataURL();
      if (isMounted) setImgSrc(url);
    };
    init();
    return () => { isMounted = false; };
  }, [currentAppName, theme]);

  const handleDownload = async () => {
    if (isGenerating) return;
    try {
      setIsGenerating(true);
      let finalImgSrc = imgSrc;
      if (!finalImgSrc) {
        finalImgSrc = await generateLogoDataURL();
        setImgSrc(finalImgSrc);
      }
      if (finalImgSrc) {
        const link = document.createElement('a');
        link.download = `${currentAppName}-Logo.png`;
        link.href = finalImgSrc;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      console.error("Failed to generate logo PNG", err);
      alert(t('failed_generate_logo', { error: err.message || t('unknown_error') }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className={`relative flex flex-col cursor-pointer transition-transform ${isGenerating ? 'opacity-50' : 'active:scale-95'}`} 
      title={t('save_logo_png')} 
      onClick={handleDownload}
    >
      <div className="flex flex-col p-2 -m-2">
        <h1 className={`text-xl font-black tracking-tighter leading-none select-none ${theme === 'coldest' ? 'text-[#0c4a6e]' : theme === 'chef-mode' ? 'text-[#431407]' : 'text-white'}`}>{currentAppName}</h1>
        <span className={`text-[9px] font-black uppercase tracking-[0.3em] select-none ${theme === 'coldest' ? 'text-[#0369a1]' : theme === 'hustle-time' ? 'text-[#eab308]' : theme === 'chef-mode' ? 'text-[#ea580c]' : 'text-[#ef4444]'}`}>
          ColdestConcept
        </span>
      </div>
      {imgSrc && (
        <img 
          src={imgSrc} 
          alt={t('app_logo_alt')} 
          className="absolute inset-0 w-full h-full object-cover z-10 opacity-0" 
          style={{ pointerEvents: 'auto' }}
          onContextMenu={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
};

export interface LogoProps {
  size?: number;
  grillStyle: GrillStyle;
  knifeStyle: KnifeStyle;
  duragStyle: DuragStyle;
  pendantStyle: PendantStyle;
  chainStyle: ChainStyle;
  theme: AppTheme;
  saberColor?: string;
  mascotColor?: string;
  showChain?: boolean;
  highEyes?: boolean;
  isCigarEquipped?: boolean;
  isTossingCigar?: boolean;
  showSparkles?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = React.memo(({ size = 48, grillStyle, knifeStyle, duragStyle, pendantStyle, chainStyle, theme, saberColor, mascotColor, showChain, highEyes, isCigarEquipped, isTossingCigar, showSparkles, onClick }) => (
  <div 
    className="group relative flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer select-none" 
    onClick={onClick}
    onContextMenu={(e) => e.preventDefault()}
    draggable="false"
  >
    {showSparkles && (
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
        <div className="absolute bottom-1/4 right-0 w-3 h-3 bg-white rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-0 w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-yellow-200 rounded-full animate-pulse opacity-50" />
      </div>
    )}
    <Mascot 
      size={size} 
      grillStyle={grillStyle} 
      knifeStyle={knifeStyle} 
      duragStyle={duragStyle}
      pendantStyle={pendantStyle}
      chainStyle={chainStyle}
      saberColor={saberColor}
      mascotColor={mascotColor}
      showChain={showChain}
      highEyes={highEyes}
      isCigarEquipped={isCigarEquipped}
      isTossingCigar={isTossingCigar}
      glowColor={theme === 'hustle-time' ? '#facc15' : theme === 'chef-mode' ? '#ffffff' : '#0ea5e9'} 
      className="relative z-10" 
    />
  </div>
));

const RagIcon = ({ style, isActive }: { style: DuragStyle, isActive: boolean }) => {
  let mainColor = "black";
  if (style === 'royal-green') mainColor = isActive ? '#065f46' : 'black';
  if (style === 'dragonball-purple') mainColor = isActive ? '#4c1d95' : 'black';
  if (style === 'sound-ninja') mainColor = isActive ? '#1e3a8a' : 'black';

  if (style === 'chef-hat') {
    return (
      <div className="relative flex items-center justify-center text-sm">
        üë®‚Äçüç≥
      </div>
    );
  }

  if (style === 'rasta') {
    return (
      <div className="relative flex items-center justify-center text-sm">
        üáØüá≤
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4C4 4 6 12 12 12C18 12 20 4 20 4V20C20 20 18 16 12 16C6 16 4 20 4 20V4Z" fill={mainColor} />
        <path d="M12 12L12 16" stroke="white" strokeWidth="0.5" opacity="0.3" />
      </svg>
      {style === 'dragonball-purple' && isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-orange-400 rounded-full border-[0.5px] border-orange-600 scale-75" />
        </div>
      )}
      {style === 'sound-ninja' && isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-1 bg-slate-300 rounded-[1px] border-[0.5px] border-slate-500" />
        </div>
      )}
    </div>
  );
};

const CigarIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="10" width="16" height="5" rx="1" fill="#4B2C20" stroke="#271103" strokeWidth="0.5" />
    <rect x="18" y="10" width="4" height="5" rx="1" fill="#FF4500" />
    <path d="M6 10V15" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
    <path d="M10 10V15" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
    <path d="M14 10V15" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
  </svg>
);

import { SnowFlurry } from './components/SnowFlurry';

import { SystemStatus } from './components/SystemStatus';
import { ShowcaseEditorModal } from './components/ShowcaseEditorModal';

const App: React.FC = () => {
  const [showcaseVideoBlob, setShowcaseVideoBlob] = useState<Blob | null>(null);
  const { isRecording, startRecording, stopRecording } = useScreenRecorder((blob) => {
    setShowcaseVideoBlob(blob);
  });
  const [showRigUI, setShowRigUI] = useState(false);
  const [showBrandMenu, setShowBrandMenu] = useState(false);
  const [showFriendsInfo, setShowFriendsInfo] = useState(false);
  const [showModeInfo, setShowModeInfo] = useState(false);
  const [showInputModeInfo, setShowInputModeInfo] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(() => {
    // Check for Global Privacy Control (GPC) signal
    // @ts-ignore - navigator.globalPrivacyControl is a non-standard but widely used property
    if (typeof navigator !== 'undefined' && (navigator.globalPrivacyControl === '1' || navigator.globalPrivacyControl === true)) {
      return false; // Hide banner if GPC is active
    }
    return localStorage.getItem('bg_cookie_consent') !== 'true' && localStorage.getItem('bg_cookie_consent') !== 'false';
  });
  const [backupInfo, setBackupInfo] = useState<{ hasBackup: boolean; backupDate?: string } | null>(null);
  const [showCookiePolicy, setShowCookiePolicy] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormMessage, setContactFormMessage] = useState('');
  const [contactFormSubject, setContactFormSubject] = useState('General Inquiry');
  const [showStatusPage, setShowStatusPage] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hostname.startsWith('status.');
    }
    return false;
  });
  const [showJsfxDatabase, setShowJsfxDatabase] = useState(false);
  const [showUadDatabase, setShowUadDatabase] = useState(false);
  const [showXpandDatabase, setShowXpandDatabase] = useState(false);
  const [showPdfSplitter, setShowPdfSplitter] = useState(false);
  const [showJsfxAutomationChains, setShowJsfxAutomationChains] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showBetaApplyModal, setShowBetaApplyModal] = useState(false);
  const [showInternationalizationModal, setShowInternationalizationModal] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(() => localStorage.getItem('bg_country') || 'US');
  const [systemStatus, setSystemStatus] = useState<'operational' | 'degraded' | 'outage' | 'loading'>('loading');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const json = await res.json();
          setSystemStatus(json.current.overall);
        } else {
          setSystemStatus('operational');
        }
      } catch (e) {
        setSystemStatus('operational');
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('bg_country', currentCountry);
  }, [currentCountry]);

  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      // Remove listeners after first interaction to save resources
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/cookies' || path === '/cookies/') {
      setShowCookiePolicy(true);
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const [activeUI] = useState(() => {
    try {
      const saved = localStorage.getItem('bg_active_ui');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse active UI settings", e);
      return null;
    }
  });

  const [tutorialProgress, setTutorialProgress] = useState<TutorialProgress | null>(() => {
    try {
      const saved = localStorage.getItem('bg_tutorial_progress');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [showWelcomeSplash, setShowWelcomeSplash] = useState<'back' | 'new' | null>(null);
  const [isBandLabPremium, setIsBandLabPremium] = useState(false);

  useEffect(() => {
    if (showWelcomeSplash) {
      const timer = setTimeout(() => {
        setShowWelcomeSplash(null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeSplash]);

  const saveTutorialProgress = async (progress: TutorialProgress) => {
    setTutorialProgress(progress);
    localStorage.setItem('bg_tutorial_progress', JSON.stringify(progress));
    
    if (user) {
      try {
        await fetchWithDetailedError('/api/cloud/tutorial-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress })
        });
      } catch (err) {
        console.error("Failed to sync tutorial progress to cloud", err);
      }
    }
  };

  const loadTutorialProgressFromCloud = useCallback(async (showSplash = false) => {
    if (!userRef.current) return;
    
    try {
      const res = await fetchWithDetailedError('/api/cloud/tutorial-progress');
      const { data } = await res.json();
      if (data) {
          setTutorialProgress(data);
          localStorage.setItem('bg_tutorial_progress', JSON.stringify(data));
          
          // Determine if we should show splash and where to start
          if (data.isFullyCompleted) {
            if (showSplash) setShowWelcomeSplash('back');
            setTutorialPhase('done');
            localStorage.setItem('bg_tutorial_completed', 'true');
          } else {
            if (showSplash) setShowWelcomeSplash('back');
            setTutorialPhase(data.currentPhase);
            setTutorialStep(data.currentStep);
            setShowTutorial(true);
          }
        } else {
          if (showSplash) setShowWelcomeSplash('new');
        }
      } catch (err) {
        console.error("Failed to load tutorial progress from cloud", err);
      }
  }, []);

  const [currentAudioInfo, setCurrentAudioInfo] = useState<{
    audioBase64: string | null;
    audioUrl: string | null;
    geminiFileUri: string | null;
    mimeType: string | null;
  } | null>(null);

  const [mainTab, setMainTab] = useState<'beat' | 'vox' | null>(null);
  const [inputMode, setInputMode] = useState<'random' | 'search' | 'upload'>('upload');
  const [generationBPM, setGenerationBPM] = useState<string>('');
  const [generationContext, setGenerationContext] = useState<string>('');
  const [isGangstaVox, setIsGangstaVox] = useState<boolean>(false);
  const [csvInput, setCsvInput] = useState<string>('');
  const [plugins, setPlugins] = useState<VSTPlugin[]>(() => {
    try {
      const saved = localStorage.getItem('bg_library');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch (e) {
      return [];
    }
  });
  const [starredPlugins, setStarredPlugins] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bg_starred_plugins');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch (e) {
      return [];
    }
  });
  const [sortBy, setSortBy] = useState<'name' | 'vendor' | 'type'>('type');
  const [gearRackTab, setGearRackTab] = useState<'vst' | 'jsfx'>('vst');
  const [xpandPresets, setXpandPresets] = useState<XpandPreset[]>(() => {
    try {
      const saved = localStorage.getItem('bg_xpand_presets');
      return saved ? JSON.parse(saved) : DEFAULT_OWNED_XPAND_PRESETS;
    } catch (e) {
      return DEFAULT_OWNED_XPAND_PRESETS;
    }
  });
  const [xpandSearch, setXpandSearch] = useState<string>('');
  const [xpandCategoryFilter, setXpandCategoryFilter] = useState<string>('All');
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [newPresetCategory, setNewPresetCategory] = useState<string>('000 Soft Pads');
  const [bulkInputText, setBulkInputText] = useState<string>('');
  const [showBulkImport, setShowBulkImport] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderToRemove, setFolderToRemove] = useState<string | null>(null);
  const [deletedPlugins, setDeletedPlugins] = useState<VSTPlugin[]>(() => {
    try {
      const saved = localStorage.getItem('bg_deleted_plugins');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch (e) {
      return [];
    }
  });
  const [pendingPlaceholders, setPendingPlaceholders] = useState<any[]>([]);
  const deletionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showTrashModal, setShowTrashModal] = useState(false);
  
  // Handle Global Privacy Control (GPC)
  useEffect(() => {
    // @ts-ignore
    if (typeof navigator !== 'undefined' && (navigator.globalPrivacyControl === '1' || navigator.globalPrivacyControl === true)) {
      if (localStorage.getItem('bg_cookie_consent') !== 'false') {
        localStorage.setItem('bg_cookie_consent', 'false');
        console.log('GPC Signal detected: Automatically opted out of non-essential tracking.');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bg_library', JSON.stringify(plugins));
  }, [plugins]);

  useEffect(() => {
    localStorage.setItem('bg_deleted_plugins', JSON.stringify(deletedPlugins));
  }, [deletedPlugins]);

  const resetDeletionTimer = () => {
    if (deletionTimerRef.current) clearTimeout(deletionTimerRef.current);
    deletionTimerRef.current = setTimeout(() => {
      setPendingPlaceholders([]);
    }, 12000);
  };

  const handleUndo = (placeholderId: string) => {
    const placeholder = pendingPlaceholders.find(p => p.id === placeholderId);
    if (!placeholder) return;

    // Remove from deletedPlugins
    setDeletedPlugins(prev => prev.filter(dp => !placeholder.plugins.some((p: any) => p.name === dp.name && p.vendor === dp.vendor)));
    
    // Add back to plugins
    setPlugins(prev => [...prev, ...placeholder.plugins]);
    
    // Remove placeholder
    setPendingPlaceholders(prev => prev.filter(p => p.id !== placeholderId));
  };
  const handleUpdateCritique = (critiqueId: string, actionIdx: number, pluginIdx: number, newPlugin: any) => {
    const updateCritique = (c: MixCritique): MixCritique => {
      if (c.id === critiqueId) {
        const updatedActionPlan = [...(c.actionPlan || [])];
        if (updatedActionPlan[actionIdx]) {
          updatedActionPlan[actionIdx] = {
            ...updatedActionPlan[actionIdx],
            recommendedChain: (updatedActionPlan[actionIdx].recommendedChain || []).map((p, pIdx) => pIdx === pluginIdx ? newPlugin : p)
          };
        }
        return { ...c, actionPlan: updatedActionPlan };
      }
      return c;
    };

    setCritiques(prev => prev.map(updateCritique));
    setSavedCritiques(prev => prev.map(c => updateCritique(c as any) as SavedCritique));
  };

  const [minimizedItems, setMinimizedItems] = useState<{type: 'recipe' | 'critique', id: string, title: string}[]>([]);

  const handleMinimizeRecipe = (recipe: BeatRecipe) => {
    setMinimizedItems(prev => [...prev, { type: 'recipe', id: recipe.title, title: recipe.title }]);
  };

  const handleMinimizeCritique = (critique: MixCritique, index: number) => {
    const id = critique.id || String(index);
    const title = critique.overallFeedback ? (critique.overallFeedback.substring(0, 25) + '...') : 'Critique';
    setMinimizedItems(prev => [...prev, { type: 'critique', id, title }]);
  };

  const restoreMinimized = (id: string, type: string) => {
    setMinimizedItems(prev => prev.filter(i => !(i.type === type && i.id === id)));
  };

  const [recipes, setRecipes] = useState<BeatRecipe[]>([]);
  const [critiques, setCritiques] = useState<MixCritique[]>([]);
  const [latestErrorLog, setLatestErrorLog] = useState<string | null>(null);
  const [audioMode, setAudioMode] = useState<'recipe' | 'critique' | 'album'>('critique');
  const [critiqueContext, setCritiqueContext] = useState<string>('');
  const [referenceTrack, setReferenceTrack] = useState<string>('');
  const [referenceTrackFile, setReferenceTrackFile] = useState<File | null>(null);
  const [vibeFile, setVibeFile] = useState<File | null>(null);
  const [recreateForFile, setRecreateForFile] = useState<File | null>(null);
  const vibeFileInputRef = useRef<HTMLInputElement>(null);
  const recreateFileInputRef = useRef<HTMLInputElement>(null);
  const referenceTrackInputRef = useRef<HTMLInputElement>(null);
  const [hasStems, setHasStems] = useState<boolean>(false);
  const [isBusMode, setIsBusMode] = useState<boolean>(false);
  const [isJsfxMode, setIsJsfxMode] = useState<boolean>(false);
  const [isMultiBandMode, setIsMultiBandMode] = useState<boolean>(false);
  const [isMasterMode, setIsMasterMode] = useState<boolean>(false);
  const [forceResearch, setForceResearch] = useState<boolean>(false);
  const [stems, setStems] = useState<{ id: string; file: File | null; type: string; customType?: string; base64?: string; url?: string; mimeType: string; fileId?: string; uri?: string; status: 'empty' | 'pending' | 'uploading' | 'ready' | 'error' }[]>(() => {
    const preset = activeUI?.stemTypesPreset || Array(10).fill('Other');
    const customPreset = activeUI?.stemCustomTypesPreset || Array(10).fill('');
    return Array(10).fill(null).map((_, i) => ({ id: `stem-${i}`, file: null, type: preset[i] || 'Other', customType: customPreset[i] || '', mimeType: '', status: 'empty' }));
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [tutorialPhase, setTutorialPhase] = useState<string>(() => {
    const completed = localStorage.getItem('bg_tutorial_completed');
    if (completed) return 'done';
    return 'init';
  });
  const tutorialPhaseRef = useRef(tutorialPhase);
  useEffect(() => { tutorialPhaseRef.current = tutorialPhase; }, [tutorialPhase]);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const showTutorialRef = useRef(showTutorial);
  useEffect(() => { showTutorialRef.current = showTutorial; }, [showTutorial]);

  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    if (showTutorial && tutorialPhase !== 'done') {
      saveTutorialProgress({
        completedPhases: [],
        currentPhase: tutorialPhase,
        currentStep: tutorialStep,
        lastUpdated: new Date().toISOString(),
        isFullyCompleted: false
      });
    } else if (tutorialPhase === 'done') {
      saveTutorialProgress({
        completedPhases: [],
        currentPhase: 'done',
        currentStep: 0,
        lastUpdated: new Date().toISOString(),
        isFullyCompleted: true
      });
    }
  }, [tutorialPhase, tutorialStep, showTutorial]);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSessionId, setVerificationSessionId] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const getTurnstileSiteKey = () => {
    const isDevOrPreview = 
      window.location.hostname === 'localhost' || 
      window.location.hostname.endsWith('.run.app') || 
      window.location.hostname.includes('webcontainer') ||
      window.location.hostname.includes('127.0.0.1');
    
    if (isDevOrPreview) {
      // Use Cloudflare Turnstile Always Pass testing site key for development/preview
      return '0x4AAAAAACkH6-i-na5YIlP9';
    }
    return typeof import.meta.env.VITE_TURNSTILE_SITE_KEY === 'string' 
      ? import.meta.env.VITE_TURNSTILE_SITE_KEY 
      : '0x4AAAAAACkH6-i-na5YIlP9';
  };

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isCheckingTerms, setIsCheckingTerms] = useState(false);
  const [isSavingConsent, setIsSavingConsent] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(() => {
    if (localStorage.getItem('bg_terms_accepted') === 'true') return true;
    try {
      const savedUser = localStorage.getItem('bg_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.termsAccepted) return true;
      }
    } catch (e) {}
    return localStorage.getItem('bg_pending_consent') === 'true';
  });

  const handleAcceptTerms = async () => {
    if (user) {
      // User is already signed in, update consent in Turso
      try {
        setIsSavingConsent(true);
        const res = await fetchWithDetailedError('/api/auth/accept-terms', { method: 'POST' });
        const updatedUser = { ...user, termsAccepted: true };
        setUser(updatedUser);
        localStorage.setItem('bg_user', JSON.stringify(updatedUser));
        localStorage.setItem('bg_terms_accepted', 'true');
        setShowConsentModal(false);
        setHasAcceptedTerms(true);
      } catch (err: any) {
        console.error("Failed to save consent:", err);
        setError(`Failed to save consent: ${err.message}`);
      } finally {
        setIsSavingConsent(false);
      }
    } else {
      // User is not signed in yet, store consent in localStorage
      console.log("User consented before sign-in, storing in localStorage");
      localStorage.setItem('bg_pending_consent', 'true');
      setHasAcceptedTerms(true);
      setShowConsentModal(false);
    }
  };

  const startGoogleSignIn = async () => {
    try {
      const response = await fetchWithDetailedError('/api/auth/google/url');
      const { url } = await response.json();
      console.log("[AUTH DEBUG] Received Auth URL from backend:", url.replace(/client_id=[^&]+/, "client_id=MASKED"));
      
      if (!url.includes('state=')) {
        console.error("[AUTH ERROR] State parameter MISSING from URL received from backend!");
      }
      
      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );
      
      if (!authWindow) {
        alert(t('allow_popups'));
      }
    } catch (err: any) {
      setError(err.message || "Failed to start Google Sign In.");
    }
  };

  const requireAuth = () => {
    if (!user) {
      setError("Please sign in with Google to use AI features.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    if (!hasAcceptedTerms) {
      setShowConsentModal(true);
      return false;
    }
    return true;
  };

  const handleGoogleSignIn = async () => {
    await startGoogleSignIn();
  };

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('bg_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isInitialUser] = useState(!!localStorage.getItem('bg_user'));
  const [justSignedIn, setJustSignedIn] = useState(false);
  const userRef = useRef<User | null>(user);
  const justSignedInRef = useRef(justSignedIn);
  const syncingRef = useRef(false);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    justSignedInRef.current = justSignedIn;
  }, [justSignedIn]);

  const authorizedEmails = useMemo(() => [
    'coldestconcept@gmail.com',
    'recognizemiracles@gmail.com',
    'ruhedramarkprod@gmail.com'
  ], []);

  const stemsLimit = useMemo(() => {
    if (!user) return 10;
    if (authorizedEmails.includes(user.email)) return 30;
    return Math.min(30, 10 + (user.purchasedStemSlots || 0));
  }, [user, authorizedEmails]);

  useEffect(() => {
    setStems(prev => {
      if (prev.length === stemsLimit) return prev;
      if (prev.length > stemsLimit) {
        // Keep files if they exist, but don't strictly truncate if user has already uploaded them.
        // Actually, let's truncate empty slots if we exceed the limit.
        const nonEmpties = prev.filter(s => s.status !== 'empty' && s.file);
        if (nonEmpties.length > stemsLimit) {
          // If they somehow have more real files, we keep them to prevent data loss?
          return nonEmpties.slice(0, stemsLimit);
        }
        
        // Otherwise, trim from the end
        return prev.slice(0, stemsLimit);
      }
      
      // Need to add more
      const toAdd = stemsLimit - prev.length;
      const preset = activeUI?.stemTypesPreset || Array(30).fill('Other');
      const customPreset = activeUI?.stemCustomTypesPreset || Array(30).fill('');
      
      const newItems = Array(toAdd).fill(null).map((_, i) => ({
        id: `stem-${prev.length + i}`, 
        file: null, 
        type: preset[prev.length + i] || 'Other', 
        customType: customPreset[prev.length + i] || '', 
        mimeType: '', 
        status: 'empty' as const
      }));
      return [...prev, ...newItems];
    });
  }, [stemsLimit, activeUI]);

  const [isUpdatingSort, startSortTransition] = useTransition();

  const isAdminDashboardAuthorized = useMemo(() => {
    return user && ['coldestconcept@gmail.com', 'recognizemiracles@gmail.com'].includes(user.email);
  }, [user]);

  const isMasterAuthorized = useMemo(() => {
    const isEnglish = i18n.language.startsWith('en');
    return user && authorizedEmails.includes(user.email) && isEnglish;
  }, [user, i18n.language, authorizedEmails]);

  const handleDawProjectImport = async (file: File) => {
    if (!file) return;
    setIsDawProjectPulling(true);
    setDawProjectPullError(null);
    setDawProjectPullSuccess(null);
    setDawProjectParsedInfo(null);

    try {
      const zip = await JSZip.loadAsync(file);
      
      // 1. Try to read project.xml to list tracks/devices
      const projectXmlFile = zip.file('project.xml');
      let title = file.name.replace(/\.dawproject$/i, '');
      const parsedTracks: { name: string; type: string; plugins: string[] }[] = [];
      
      if (projectXmlFile) {
        try {
          const xmlString = await projectXmlFile.async('text');
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlString, "text/xml");
          
          // Try to read metadata/title from project or metadata.xml
          const metadataXmlFile = zip.file('metadata.xml');
          if (metadataXmlFile) {
            const metaStr = await metadataXmlFile.async('text');
            const metaDoc = parser.parseFromString(metaStr, "text/xml");
            const titleNode = metaDoc.getElementsByTagName("Title")[0] || metaDoc.getElementsByTagName("title")[0];
            if (titleNode && titleNode.textContent) {
              title = titleNode.textContent.trim();
            }
          }
          
          const trackNodes = xmlDoc.getElementsByTagName("Track");
          for (let i = 0; i < trackNodes.length; i++) {
            const track = trackNodes[i];
            const trackName = track.getAttribute("name") || `Track ${i + 1}`;
            const contentType = track.getAttribute("contentType") || "audio";
            
            const pluginsList: string[] = [];
            const deviceNodes = track.getElementsByTagName("Plugin");
            for (let j = 0; j < deviceNodes.length; j++) {
              const devName = deviceNodes[j].getAttribute("deviceName") || deviceNodes[j].getAttribute("name");
              if (devName) pluginsList.push(devName);
            }
            
            parsedTracks.push({
              name: trackName,
              type: contentType,
              plugins: pluginsList
            });
          }
        } catch (e: any) {
          console.warn("[DAWProject Import] XML parse warning:", e.message);
        }
      }

      // 2. Discover and extract all audio files inside the Zip container
      const audioFiles: { path: string; entry: JSZip.JSZipObject }[] = [];
      zip.forEach((relativePath, entry) => {
        if (!entry.dir && /\.(wav|mp3|m4a|ogg|flac|aif|aiff)$/i.test(relativePath)) {
          audioFiles.push({ path: relativePath, entry });
        }
      });

      if (audioFiles.length === 0) {
        throw new Error("No audio stem files found inside the uploaded .dawproject ZIP file. Make sure the project has embedded audio files (usually in the media/ or audio/ folder).");
      }

      const importedStemsCount = audioFiles.length;
      const finalStems: any[] = [];

      for (let i = 0; i < audioFiles.length; i++) {
        const item = audioFiles[i];
        const rawBlob = await item.entry.async('blob');
        const originalFileName = item.path.split('/').pop() || `stem_${i+1}.wav`;
        const stemName = originalFileName.replace(/\.(wav|mp3|m4a|ogg|flac|aif|aiff)$/i, '').trim();
        
        let mime = 'audio/wav';
        if (originalFileName.toLowerCase().endsWith('.mp3')) mime = 'audio/mp3';
        else if (originalFileName.toLowerCase().endsWith('.m4a')) mime = 'audio/m4a';
        else if (originalFileName.toLowerCase().endsWith('.ogg')) mime = 'audio/ogg';
        else if (originalFileName.toLowerCase().endsWith('.flac')) mime = 'audio/flac';

        const stemFile = new File([rawBlob], originalFileName, { type: mime });
        
        let stemType = 'Other';
        let customType = stemName;
        const lowerName = stemName.toLowerCase();
        
        if (lowerName.includes('drum') || lowerName.includes('kick') || lowerName.includes('percs') || lowerName.includes('beat') || lowerName.includes('loop') || lowerName.includes('snare') || lowerName.includes('clap') || lowerName.includes('hat')) {
          stemType = 'Beats';
        } else if (lowerName.includes('vocal') || lowerName.includes('vox') || lowerName.includes('lead') || lowerName.includes('back') || lowerName.includes('harmony') || lowerName.includes('sing') || lowerName.includes('rap') || lowerName.includes('dub')) {
          stemType = 'Vocals';
        } else if (lowerName.includes('synth') || lowerName.includes('melody') || lowerName.includes('keys') || lowerName.includes('guitar') || lowerName.includes('piano') || lowerName.includes('organ') || lowerName.includes('brass') || lowerName.includes('string')) {
          stemType = 'Instrumental';
        } else if (lowerName.includes('bass') || lowerName.includes('808') || lowerName.includes('sub')) {
          stemType = 'Bass';
        }

        finalStems.push({
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
          file: stemFile,
          type: stemType,
          customType: stemType === 'Other' ? customType : '',
          mimeType: mime,
          status: 'ready' as const
        });
      }

      setStems(finalStems);
      setHasStems(true);
      setDawProjectPullSuccess(`Successfully loaded DAWProject "${title}"! Found and imported ${importedStemsCount} track stem(s) directly into your workspace.`);
      setDawProjectParsedInfo({
        title,
        tracksCount: parsedTracks.length,
        stemsCount: importedStemsCount,
        tracks: parsedTracks
      });
    } catch (err: any) {
      console.error(err);
      setDawProjectPullError(err.message || "Failed to process .dawproject file. Ensure it is a valid, uncorrupted zip package.");
    } finally {
      setIsDawProjectPulling(false);
    }
  };

  const handleReaperDirectoryImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsReaperPulling(true);
    setReaperPullError(null);
    setReaperPullSuccess(null);
    setReaperParsedInfo(null);

    try {
      const filesArray = Array.from(files);
      
      // Filter out files that are within any folder named "backup" or "backups" or have a ".rpp-bak" extension
      const validFilesArray = filesArray.filter(f => {
        const path = (f.webkitRelativePath || f.name).toLowerCase();
        return !path.includes('/backup/') && !path.includes('/backups/') && !path.endsWith('.rpp-bak') && !path.endsWith('.rpp-bak-undo');
      });
      
      // 1. Locate REAPER Project File (.rpp)
      const rppFile = validFilesArray.find(f => f.name.toLowerCase().endsWith('.rpp'));
      if (!rppFile) {
        throw new Error("No REAPER project (.RPP) file found in the selected folder. Please make sure to import a folder containing your active .rpp file!");
      }

      // Read .rpp content
      const rppContent = await rppFile.text();
      const parsedTracks = parseRpp(rppContent);
      const title = rppFile.name.replace(/\.rpp$/i, '');

      // 2. Locate all audio files in the folder structure
      const audioFiles = validFilesArray.filter(f => 
        /\.(wav|mp3|m4a|ogg|flac|aif|aiff)$/i.test(f.name)
      );

      if (audioFiles.length === 0) {
        throw new Error("No audio files (wav, mp3, m4a, etc.) found in the selected folder. Please make sure your project stems or media are in this folder so we can load them!");
      }

      // 3. Match physical media files to parsed tracks
      const finalStems: any[] = [];
      const matchedFilesSet = new Set<string>();

      for (const track of parsedTracks) {
        let matchedFile: File | undefined = undefined;

        // Try direct referenced files inside the RPP structure
        for (const refName of track.referencedFiles) {
          matchedFile = audioFiles.find(af => af.name.toLowerCase() === refName.toLowerCase());
          if (matchedFile) break;
        }

        // Match by similar track and file names as fallback
        if (!matchedFile) {
          const trackLower = track.name.toLowerCase().trim();
          matchedFile = audioFiles.find(af => {
            const fileLower = af.name.toLowerCase();
            const cleanFile = fileLower.replace(/\.(wav|mp3|m4a|ogg|flac|aif|aiff)$/i, '').trim();
            return trackLower && cleanFile && (trackLower.includes(cleanFile) || cleanFile.includes(trackLower));
          });
        }

        if (matchedFile) {
          matchedFilesSet.add(matchedFile.name);
          const originalFileName = matchedFile.name;
          const stemName = track.name || originalFileName.replace(/\.(wav|mp3|m4a|ogg|flac|aif|aiff)$/i, '').trim();
          
          let mime = 'audio/wav';
          if (originalFileName.toLowerCase().endsWith('.mp3')) mime = 'audio/mp3';
          else if (originalFileName.toLowerCase().endsWith('.m4a')) mime = 'audio/m4a';
          else if (originalFileName.toLowerCase().endsWith('.ogg')) mime = 'audio/ogg';
          else if (originalFileName.toLowerCase().endsWith('.flac')) mime = 'audio/flac';

          let stemType = 'Other';
          let customType = stemName;
          const lowerName = stemName.toLowerCase();
          
          if (lowerName.includes('drum') || lowerName.includes('kick') || lowerName.includes('percs') || lowerName.includes('beat') || lowerName.includes('loop') || lowerName.includes('snare') || lowerName.includes('clap') || lowerName.includes('hat')) {
            stemType = 'Beats';
          } else if (lowerName.includes('vocal') || lowerName.includes('vox') || lowerName.includes('lead') || lowerName.includes('back') || lowerName.includes('harmony') || lowerName.includes('sing') || lowerName.includes('rap') || lowerName.includes('dub')) {
            stemType = 'Vocals';
          } else if (lowerName.includes('synth') || lowerName.includes('melody') || lowerName.includes('keys') || lowerName.includes('guitar') || lowerName.includes('piano') || lowerName.includes('organ') || lowerName.includes('brass') || lowerName.includes('string')) {
            stemType = 'Instrumental';
          } else if (lowerName.includes('bass') || lowerName.includes('808') || lowerName.includes('sub')) {
            stemType = 'Bass';
          }

          finalStems.push({
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
            file: matchedFile,
            type: stemType,
            customType: stemType === 'Other' ? customType : '',
            mimeType: mime,
            status: 'ready' as const
          });
        }
      }

      // Capture unmatched audio stems
      for (const af of audioFiles) {
        if (!matchedFilesSet.has(af.name) && finalStems.length < stemsLimit) {
          const originalFileName = af.name;
          const stemName = originalFileName.replace(/\.(wav|mp3|m4a|ogg|flac|aif|aiff)$/i, '').trim();
          
          let mime = 'audio/wav';
          if (originalFileName.toLowerCase().endsWith('.mp3')) mime = 'audio/mp3';
          else if (originalFileName.toLowerCase().endsWith('.m4a')) mime = 'audio/m4a';
          else if (originalFileName.toLowerCase().endsWith('.ogg')) mime = 'audio/ogg';
          else if (originalFileName.toLowerCase().endsWith('.flac')) mime = 'audio/flac';

          let stemType = 'Other';
          let customType = stemName;
          const lowerName = stemName.toLowerCase();
          
          if (lowerName.includes('drum') || lowerName.includes('kick') || lowerName.includes('percs') || lowerName.includes('beat') || lowerName.includes('loop') || lowerName.includes('snare') || lowerName.includes('clap') || lowerName.includes('hat')) {
            stemType = 'Beats';
          } else if (lowerName.includes('vocal') || lowerName.includes('vox') || lowerName.includes('lead') || lowerName.includes('back') || lowerName.includes('harmony') || lowerName.includes('sing') || lowerName.includes('rap') || lowerName.includes('dub')) {
            stemType = 'Vocals';
          } else if (lowerName.includes('synth') || lowerName.includes('melody') || lowerName.includes('keys') || lowerName.includes('guitar') || lowerName.includes('piano') || lowerName.includes('organ') || lowerName.includes('brass') || lowerName.includes('string')) {
            stemType = 'Instrumental';
          } else if (lowerName.includes('bass') || lowerName.includes('808') || lowerName.includes('sub')) {
            stemType = 'Bass';
          }

          finalStems.push({
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
            file: af,
            type: stemType,
            customType: stemType === 'Other' ? customType : '',
            mimeType: mime,
            status: 'ready' as const
          });
        }
      }

      if (finalStems.length === 0) {
        throw new Error("Could not map any audio files automatically. Please ensure audio filenames or folder structures align with track names!");
      }

      setStems(finalStems.slice(0, stemsLimit));
      setHasStems(true);
      setReaperPullSuccess(`Successfully parsed REAPER Project File "${title}.RPP"! Extracted all track layout metadata and matched ${finalStems.length} audio file stem(s) automatically with zero file size overhead.`);
      setReaperParsedInfo({
        title,
        tracksCount: parsedTracks.length,
        stemsCount: finalStems.length,
        tracks: parsedTracks.map(t => ({
          name: t.name,
          type: t.type,
          plugins: t.plugins,
          isMuted: t.isMuted,
          isSoloed: t.isSoloed,
          volume: t.volume
        })),
        rawRpp: rppContent
      });
    } catch (err: any) {
      console.error(err);
      setReaperPullError(err.message || "Failed to parse REAPER project directory.");
    } finally {
      setIsReaperPulling(false);
    }
  };

  const handleContactSupport = useCallback((pluginInfo: any) => {
    const message = `Developer Investigation Request:
Plugin: ${pluginInfo.name}
Suggested Version: ${pluginInfo.userVersion || 'N/A'}
Suggested Corrections:
${Object.entries(pluginInfo.corrections).map(([p, v]) => `- ${p}: ${v}`).join('\n')}

The AI was unable to verify these parameters. Please investigate.`;
    setContactFormMessage(message);
    setContactFormSubject('Technical Support');
    setShowContactForm(true);
  }, []);

  const handleSaveUserPlugins = useCallback(async (pluginsToSave: VSTPlugin[]) => {
    if (!userRef.current) return;
    try {
      await fetchWithDetailedError('/api/user-plugins/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: userRef.current.uid, plugins: pluginsToSave })
      });
    } catch (e) {
      console.error("Failed to save user plugins to Turso", e);
    }
  }, []);

  const handleSaveXpandPresets = useCallback(async (presetsToSave: XpandPreset[]) => {
    if (!userRef.current) return;
    try {
      await fetchWithDetailedError('/api/xpand-presets/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: userRef.current.uid, presets: presetsToSave })
      });
    } catch (e) {
      console.error("Failed to save Xpand presets to Turso", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bg_xpand_presets', JSON.stringify(xpandPresets));
    if (user) {
      handleSaveXpandPresets(xpandPresets);
    }
  }, [xpandPresets, user, handleSaveXpandPresets]);

  useEffect(() => {
    if (user) {
      const loadUserPlugins = async () => {
        try {
          const res = await fetchWithDetailedError(`/api/user-plugins/load?uid=${user.uid}`);
          const data = await res.json();
          if (data.plugins && data.plugins.length > 0) {
            setPlugins(prev => {
              const existingMap = new Map(prev.map(p => [`${p.vendor}-${p.name}`, p]));
              data.plugins.forEach((p: VSTPlugin) => {
                existingMap.set(`${p.vendor}-${p.name}`, p);
              });
              return Array.from(existingMap.values());
            });
          }
        } catch (e) {
          console.error("Failed to load user plugins from Turso", e);
        }
      };
      
      const loadXpandPresets = async () => {
        try {
          const res = await fetchWithDetailedError(`/api/xpand-presets/load?uid=${user.uid}`);
          const data = await res.json();
          if (data.presets && data.presets.length > 0) {
            setXpandPresets(data.presets);
          }
        } catch (e) {
          console.error("Failed to load Xpand presets from Turso", e);
        }
      };

      loadUserPlugins();
      loadXpandPresets();
    }
  }, [user]);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [cloudDriveUrl, setCloudDriveUrl] = useState<string | null>(() => {
    return localStorage.getItem('bg_cloud_drive_url');
  });
  const [cloudDriveError, setCloudDriveError] = useState<boolean>(false);
  const [showCloudSyncModal, setShowCloudSyncModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [cloudSyncMode, setCloudSyncMode] = useState<'setup' | 'backup' | 'restore'>('setup');
  const [wasCloudSyncModalShown, setWasCloudSyncModalShown] = useState(false);
  const [isEnrichingLibrary, setIsEnrichingLibrary] = useState(false);
  const [hasRestoredBackup, setHasRestoredBackup] = useState(false);
  const [showBackupRestored, setShowBackupRestored] = useState(false);
  const [tutorialPlugin, setTutorialPlugin] = useState<VSTPlugin | null>(null);
  const [tutorialFolder, setTutorialFolder] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const _d = (s: string) => atob(s);
  const [m_act, setM_act] = useState(() => localStorage.getItem('_mv') === 'true');

  useEffect(() => {
    if (m_act && !isMasterAuthorized) {
      setM_act(false);
      localStorage.removeItem('_mv');
    }
  }, [m_act, isMasterAuthorized]);

  const [e_act, setE_act] = useState(() => localStorage.getItem('_ev') === 'true');
  const [showFairy, setShowFairy] = useState(false);
  const [currentVibeExample, setCurrentVibeExample] = useState(VIBE_EXAMPLES[0]);
  const [currentSongExamples, setCurrentSongExamples] = useState([SONG_EXAMPLES[0], SONG_EXAMPLES[1]]);
  const [placeholderArtist, setPlaceholderArtist] = useState(ARTIST_EXAMPLES[0]);

  useEffect(() => {
    if (showTutorial) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTutorial]);

  useEffect(() => {
    if (showTutorial) {
      // No-op
    }
  }, [showTutorial]);

  const activeTutorialSteps = useMemo(() => {
    const addTurnstileStep = (steps: TutorialStep[]) => {
      if (isVerified) return;
      steps.push({
        targetId: ((plugins.length === 0 && !isJsfxMode) && !isEnrichingLibrary && !hasRestoredBackup) ? 'tutorial-turnstile' : 'tutorial-turnstile-studio',
        title: t('tutorial_security_title'),
        content: t('tutorial_security_content'),
        placement: 'bottom' as const,
        requireAction: !isVerified,
        allowInteraction: true
      });
    };

    if (tutorialPhase === 'init') {
      const steps: TutorialStep[] = [];

      steps.push({
        targetId: 'tutorial-welcome',
        title: t('tutorial_welcome_title_v2'),
        content: t('tutorial_welcome_content_v2'),
        placement: 'center' as const
      });

      addTurnstileStep(steps);

      if (!hasAcceptedTerms) {
        steps.push({
          targetId: 'legal-consent-banner',
          title: t('tutorial_terms_title_v2'),
          content: t('tutorial_terms_content_v2'),
          placement: 'top' as const,
          requireAction: true,
          allowInteraction: true,
          isHighlighted: true,
          onEnter: () => {
            setShowConsentModal(true);
          }
        });
      }

      if (!user && localStorage.getItem('bg_skip_auth') !== 'true') {
        steps.push({
          targetId: 'btn-google-signin',
          title: t('tutorial_signin_title_v2'),
          content: t('tutorial_signin_content_v2'),
          placement: 'bottom' as const,
          requireAction: true,
          allowInteraction: true
        });
      }

      return steps;
    }
    if (tutorialPhase === 'cloud_sync') {
      const steps: TutorialStep[] = [];
      
      if (backupInfo?.hasBackup) {
        steps.push({
          targetId: 'modal-cloud-sync',
          title: t('tutorial_restore_title'),
          content: t('tutorial_restore_content', { date: new Date(backupInfo.backupDate!).toLocaleDateString() }),
          placement: 'top' as const,
          requireAction: true,
          allowInteraction: true,
          onEnter: () => setShowRestoreModal(true)
        });
      } else {
        steps.push({
          targetId: 'modal-cloud-sync',
          title: t('tutorial_cloud_sync_title'),
          content: t('tutorial_cloud_sync_content'),
          placement: 'top' as const,
          requireAction: true,
          allowInteraction: true,
          onEnter: () => {
            setCloudSyncMode('setup');
            setShowCloudSyncModal(true);
          }
        });
      }
      
      return steps;
    }
    if (tutorialPhase === 'import') {
      const steps: TutorialStep[] = [];
      steps.push(
        {
          targetId: 'dropzone-plugin-import',
          title: t('tutorial_import_plugins_title'),
          content: t('tutorial_import_plugins_content'),
          placement: 'bottom' as const,
          allowInteraction: true
        },
        {
          targetId: 'btn-help',
          title: t('tutorial_need_help_title'),
          content: t('tutorial_need_help_content'),
          placement: 'bottom' as const,
          allowInteraction: true
        }
      );
      return steps;
    }
    if (tutorialPhase === 'library_populated') {
      const steps: TutorialStep[] = [];
      addTurnstileStep(steps);
      steps.push(
        {
          targetId: 'section-gear-rack',
          title: t('tutorial_gear_rack_title_v2'),
          content: t('tutorial_gear_rack_content_v2'),
          placement: 'bottom' as const,
          onEnter: () => {
            if (!tutorialPlugin && (plugins.length > 0 || isJsfxMode)) {
              const targetPlugins: VSTPlugin[] = plugins.length > 0 ? plugins : [{ vendor: 'Cockos', name: 'JSFX Plugin', type: 'JSFX', version: '1.0', lastModified: new Date().toISOString() }];
              const randomPlugin = targetPlugins[Math.floor(Math.random() * targetPlugins.length)];
              setTutorialPlugin(randomPlugin);
              const folder = sortBy === 'vendor' ? randomPlugin.vendor : randomPlugin.type;
              setTutorialFolder(folder);
              setSelectedFolder(folder);
            }
          }
        },
        {
          targetId: tutorialPlugin ? `plugin-card-${tutorialPlugin.name.replace(/\s+/g, '-').toLowerCase()}` : 'plugin-card-serum',
          title: t('tutorial_starred_plugins_title'),
          content: t('tutorial_starred_plugins_content'),
          placement: 'bottom' as const,
          isHighlighted: true,
          onEnter: () => {
            if (tutorialPlugin && !starredPlugins.includes(tutorialPlugin.name)) {
              setStarredPlugins(prev => [...prev, tutorialPlugin.name]);
            }
          }
        },
        {
          targetId: 'priority-bar',
          title: t('tutorial_priority_bar_title'),
          content: t('tutorial_priority_bar_content'),
          placement: 'bottom' as const,
          onNext: () => {
            if (tutorialPlugin) {
              setStarredPlugins(prev => prev.filter(name => name !== tutorialPlugin.name));
            }
          }
        },
        {
          targetId: 'btn-rig',
          title: t('tutorial_rig_manager_title'),
          content: t('tutorial_rig_manager_content'),
          placement: 'bottom' as const
        },
        {
          targetId: 'btn-menu',
          title: t('tutorial_dropdown_menu_title'),
          content: t('tutorial_dropdown_menu_content'),
          placement: 'bottom' as const,
          allowInteraction: false,
          onEnter: () => setShowBrandMenu(true),
          onNext: () => setShowBrandMenu(false)
        },
        {
          targetId: 'btn-mode-beatgangsta',
          title: t('tutorial_beatgangsta_mode_title'),
          content: t('tutorial_beatgangsta_mode_content'),
          placement: 'bottom' as const
        },
        {
          targetId: 'btn-mode-gangstavox',
          title: t('tutorial_gangstavox_mode_title'),
          content: t('tutorial_gangstavox_mode_content'),
          placement: 'bottom' as const
        },
        {
          targetId: 'input-vibe-search',
          title: t('tutorial_vibe_search_title_v2'),
          content: t('tutorial_vibe_search_content_v2'),
          placement: 'top' as const
        },
        {
          targetId: 'input-song-search',
          title: t('tutorial_song_search_title_v2'),
          content: t('tutorial_song_search_content_v2'),
          placement: 'top' as const
        }
      );

      steps.push({
        targetId: 'btn-audio-recipe',
        title: t('tutorial_extract_recipe_title'),
        content: t('tutorial_extract_recipe_content'),
        placement: 'top' as const
      });
      steps.push({
        targetId: 'btn-audio-critique',
        title: t('tutorial_mix_critique_title'),
        content: t('tutorial_mix_critique_content'),
        placement: 'top' as const
      });

      return steps;
    }
    if (tutorialPhase === 'first_recipe') {
      const steps: TutorialStep[] = [
        {
          targetId: 'recipe-card-0',
          title: t('tutorial_first_recipe_title'),
          content: t('tutorial_first_recipe_content'),
          placement: 'bottom' as const
        },
        {
          targetId: 'btn-export-pdf',
          title: t('tutorial_save_pdf_title'),
          content: t('tutorial_save_pdf_content'),
          placement: 'bottom' as const
        },
        {
          targetId: 'btn-save-recipe',
          title: t('tutorial_add_to_vault_title'),
          content: t('tutorial_add_to_vault_content'),
          placement: 'bottom' as const
        },
        {
          targetId: 'btn-vault',
          title: t('tutorial_vault_title_v3'),
          content: t('tutorial_vault_content_v3'),
          placement: 'bottom' as const,
          requireAction: true,
          allowInteraction: true
        },
        {
          targetId: 'btn-close-vault',
          title: t('tutorial_close_vault_title'),
          content: t('tutorial_close_vault_content'),
          placement: 'bottom' as const,
          requireAction: true,
          allowInteraction: true
        }
      ];

      addTurnstileStep(steps);

      steps.push({
        targetId: 'btn-audio-recipe',
        title: t('tutorial_extract_recipe_title'),
        content: t('tutorial_extract_recipe_content'),
        placement: 'top' as const
      });
      steps.push({
        targetId: 'btn-audio-critique',
        title: t('tutorial_mix_critique_title'),
        content: t('tutorial_mix_critique_content'),
        placement: 'top' as const
      });

      steps.push({
        targetId: 'tutorial-welcome',
        title: t('tutorial_ready_title_v2'),
        content: t('tutorial_ready_content_v2'),
        placement: 'center' as const
      });

      return steps;
    }
    return [];
  }, [tutorialPhase, isVerified, user, showCloudSyncModal, pendingFile, isEnrichingLibrary, plugins?.length || 0, recipes?.length || 0, sortBy, m_act, showConsentModal, hasAcceptedTerms, tutorialPlugin]);
  
  useEffect(() => {
    if (showTutorial && activeTutorialSteps.length > 0 && tutorialStep >= activeTutorialSteps.length) {
      setTutorialStep(activeTutorialSteps.length - 1);
    }
    // Removed the aggressive exit logic
  }, [activeTutorialSteps.length, tutorialStep, showTutorial]);

  const handleNextTutorialStep = () => {
    if (tutorialPhase === 'library_populated' && tutorialStep === activeTutorialSteps.length - 1) {
      if (isVerified) {
        setTutorialPhase('done');
        localStorage.setItem('bg_tutorial_completed', 'true');
        setShowTutorial(false);
        return;
      }
      setTutorialPhase('cloudflare_2');
      setShowTutorial(false);
      return;
    }

    if (tutorialStep < activeTutorialSteps.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
      if (tutorialPhase === 'first_recipe') {
        setTutorialPhase('done');
        localStorage.setItem('bg_tutorial_completed', 'true');
      }
    }
  };

  const handleCompleteTutorial = () => {
    setShowTutorial(false);
    setTutorialPhase('done');
    localStorage.setItem('bg_tutorial_completed', 'true');
  };

  const handleResetLibrary = async () => {
    if (user) {
      try {
        await fetchWithDetailedError('/api/user-plugins/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid })
        });
      } catch (err) {
        console.error("Failed to reset library on server", err);
      }

      // Admin direct database purge of analyzed plug-in results
      const authorizedEmails = ['coldestconcept@gmail.com', 'recogniizemiracles@gmail.com', 'recognizemiracles@gmail.com', 'ruhedramarkprod@gmail.com'];
      if (user.email && authorizedEmails.includes(user.email.toLowerCase().trim())) {
        try {
          await fetchWithDetailedError('/api/vst-cache/clear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
          });
          console.log("Admin triggered direct database purge of VST cache successfully.");
        } catch (err) {
          console.error("Failed to purge VST cache on server", err);
        }
      }
    }
    setPlugins([]);
    localStorage.removeItem('bg_library'); // Use correct key for plugins
    localStorage.removeItem('bg_plugins');
    localStorage.removeItem('bg_deleted_plugins');
    localStorage.removeItem('bg_starred_plugins');
    localStorage.removeItem('bg_analog_instruments_v2');
    localStorage.removeItem('bg_analog_hardware_v2');
    localStorage.removeItem('bg_drum_kits');
    localStorage.removeItem('bg_deleted_instruments');
    localStorage.removeItem('bg_deleted_hardware');
    localStorage.removeItem('bg_starred_hardware');
    setStarredPlugins([]);
    setDeletedPlugins([]);
    setAnalogInstruments([]);
    setAnalogHardware([]);
    setDrumKits([]);
    setDeletedInstruments([]);
    setDeletedHardware([]);
    setStarredHardware([]);
    window.location.reload(); // Reload to clear all states and start fresh
  };

  const [enrichProgress, setEnrichProgress] = useState(0);
  const [enrichEta, setEnrichEta] = useState(0);
  const [enrichStatus, setEnrichStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [manualPluginName, setManualPluginName] = useState<string>('');
  const [manualPluginBrand, setManualPluginBrand] = useState<string>('');
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [typeBeatSearch, setTypeBeatSearch] = useState<string>('');
  const [songSearch, setSongSearch] = useState<string>('');
  const [audioAnalysisLoading, setAudioAnalysisLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationEta, setGenerationEta] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [creditError, setCreditError] = useState<string | null>(null);
  const [grillStyle, setGrillStyle] = useState<GrillStyle>(activeUI?.grillStyle || 'diamond');
  const [knifeStyle, setKnifeStyle] = useState<KnifeStyle>(activeUI?.knifeStyle || 'standard');
  const [duragStyle, setDuragStyle] = useState<DuragStyle>(activeUI?.duragStyle || 'standard');
  const [pendantStyle, setPendantStyle] = useState<PendantStyle>(activeUI?.pendantStyle || 'silver');
  const [chainStyle, setChainStyle] = useState<ChainStyle>(activeUI?.chainStyle || 'silver');
  const [theme, setTheme] = useState<AppTheme>(activeUI?.theme || 'coldest');
  const [saberColor, setSaberColor] = useState<string>(activeUI?.saberColor || '#a855f7'); 
  const [mascotColor, setMascotColor] = useState<string>(activeUI?.mascotColor || '#3b82f6');
  const [showSaberPicker, setShowSaberPicker] = useState(false);
  const [showMascotColorPicker, setShowMascotColorPicker] = useState(false);
  const [showChain, setShowChain] = useState(activeUI?.showChain ?? false);
  const [highEyes, setHighEyes] = useState(activeUI?.highEyes ?? false);
  const [isCigarEquipped, setIsCigarEquipped] = useState(activeUI?.isCigarEquipped ?? false);
  const [isTossingCigar, setIsTossingCigar] = useState(activeUI?.isTossingCigar ?? false);
  const [showSparkles, setShowSparkles] = useState(activeUI?.showSparkles ?? false);
  const [stemTypesPreset, setStemTypesPreset] = useState<string[]>(activeUI?.stemTypesPreset ?? Array(10).fill('Other'));
  const [stemCustomTypesPreset, setStemCustomTypesPreset] = useState<string[]>(activeUI?.stemCustomTypesPreset ?? Array(10).fill(''));
  const [c_act, setC_act] = useState(() => localStorage.getItem('_cv') === 'true');
  const [hasUnlockedBluntToggle, setHasUnlockedBluntToggle] = useState(false);
  const [showDawModal, setShowDawModal] = useState(false);
  const [isDawProjectPulling, setIsDawProjectPulling] = useState(false);
  const [dawProjectPullError, setDawProjectPullError] = useState<string | null>(null);
  const [dawProjectPullSuccess, setDawProjectPullSuccess] = useState<string | null>(null);
  const [dawProjectParsedInfo, setDawProjectParsedInfo] = useState<{
    title: string;
    tracksCount: number;
    stemsCount: number;
    tracks: { name: string; type: string; plugins: string[] }[];
  } | null>(null);
  const [isReaperPulling, setIsReaperPulling] = useState(false);
  const [reaperPullError, setReaperPullError] = useState<string | null>(null);
  const [reaperPullSuccess, setReaperPullSuccess] = useState<string | null>(null);
  const [reaperParsedInfo, setReaperParsedInfo] = useState<{
    title: string;
    tracksCount: number;
    stemsCount: number;
    tracks: { name: string; type: string; plugins: { name: string; readableParams?: string }[]; isMuted?: boolean; isSoloed?: boolean; volume?: string }[];
    rawRpp?: string;
  } | null>(null);
  const [reaperSelectedPluginParams, setReaperSelectedPluginParams] = useState<{name: string, params: string} | null>(null);
  const [dawModalSource, setDawModalSource] = useState<'initial' | 'menu'>('initial');
  const [showAnalogModal, setShowAnalogModal] = useState(false);
  const [analogInstruments, setAnalogInstruments] = useState<Hardware[]>(() => {
    try {
      const saved = localStorage.getItem('bg_analog_instruments_v2');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch { return []; }
  });
  const [analogHardware, setAnalogHardware] = useState<Hardware[]>(() => {
    try {
      const saved = localStorage.getItem('bg_analog_hardware_v2');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch { return []; }
  });
  const [drumKits, setDrumKits] = useState<Hardware[]>(() => {
    try {
      const saved = localStorage.getItem('bg_drum_kits');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch { return []; }
  });
  const [showDrumKitModal, setShowDrumKitModal] = useState(false);
  const [editingDrumKit, setEditingDrumKit] = useState<Hardware | undefined>(undefined);
  const [deletedInstruments, setDeletedInstruments] = useState<Hardware[]>(() => {
    try {
      const saved = localStorage.getItem('bg_deleted_instruments');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch { return []; }
  });
  const [deletedHardware, setDeletedHardware] = useState<Hardware[]>(() => {
    try {
      const saved = localStorage.getItem('bg_deleted_hardware');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('bg_analog_instruments_v2', JSON.stringify(analogInstruments));
  }, [analogInstruments]);

  useEffect(() => {
    localStorage.setItem('bg_analog_hardware_v2', JSON.stringify(analogHardware));
  }, [analogHardware]);

  useEffect(() => {
    localStorage.setItem('bg_drum_kits', JSON.stringify(drumKits));
  }, [drumKits]);

  useEffect(() => {
    localStorage.setItem('bg_deleted_instruments', JSON.stringify(deletedInstruments));
  }, [deletedInstruments]);

  useEffect(() => {
    localStorage.setItem('bg_deleted_hardware', JSON.stringify(deletedHardware));
  }, [deletedHardware]);
  const [starredHardware, setStarredHardware] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bg_starred_hardware');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch (e) {
      return [];
    }
  });
  const [importedSaveFile, setImportedSaveFile] = useState<FullSaveFile | null>(null);
  const [showImportDecisionModal, setShowImportDecisionModal] = useState(false);
  const [friendMode, setFriendMode] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);
  const [isDraggingVibe, setIsDraggingVibe] = useState(false);
  const [isDraggingRecreate, setIsDraggingRecreate] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if ((!isEnrichingLibrary && (plugins.length > 0 || isJsfxMode)) || hasRestoredBackup) {
      const vibeExamples = t('vibe_examples', { returnObjects: true }) as string[];
      const songExamples = t('song_examples', { returnObjects: true }) as string[];
      const artistExamples = t('artist_examples', { returnObjects: true }) as string[];
      
      const vibeArray = Array.isArray(vibeExamples) ? vibeExamples : VIBE_EXAMPLES;
      const songArray = Array.isArray(songExamples) ? songExamples : SONG_EXAMPLES;
      const artistArray = Array.isArray(artistExamples) ? artistExamples : ARTIST_EXAMPLES;

      setCurrentVibeExample(vibeArray[Math.floor(Math.random() * vibeArray.length)]);
      const shuffled = [...songArray].sort(() => 0.5 - Math.random());
      setCurrentSongExamples(shuffled.slice(0, 2));
      setPlaceholderArtist(artistArray[Math.floor(Math.random() * artistArray.length)]);
    }
  }, [isEnrichingLibrary, plugins.length, hasRestoredBackup, i18n.language, t]);

  useEffect(() => {
    const renderTurnstile = () => {
      if ((window as any).turnstile) {
        const elements = document.querySelectorAll('.cf-turnstile:not([data-rendered])');
        elements.forEach((el: any) => {
          const sitekey = getTurnstileSiteKey();
          (window as any).turnstile.render(el, {
            sitekey: sitekey,
            callback: (token: string) => {
              if ((window as any).onUploadSuccess) {
                (window as any).onUploadSuccess(token);
              }
            },
            'expired-callback': () => {
              setIsVerified(false);
              setTurnstileToken(null);
            },
            'error-callback': () => {
              setIsVerified(false);
              setTurnstileToken(null);
            },
            theme: theme === 'coldest' || theme === 'chef-mode' ? 'light' : 'dark',
            size: 'normal',
          });
          el.setAttribute('data-rendered', 'true');
        });
      }
    };

    // Initial render
    renderTurnstile();

    // Re-render when theme changes or plugins list changes (which might mount/unmount widgets)
    const interval = setInterval(renderTurnstile, 1000);
    return () => clearInterval(interval);
  }, [theme, plugins.length]);

  useEffect(() => {
    (window as any).onUploadSuccess = async (token: string) => {
      setTurnstileToken(token);
      try {
        const response = await fetchWithDetailedError('/api/verify-turnstile', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ 'cf-turnstile-response': token }),
        });
        
        setIsVerified(true);
        setError(null); // Clear any previous errors
          
        // Advance tutorial if on verification step
        if (tutorialPhase === 'init' && tutorialStep === 1) {
          // The list will shrink by 1 when isVerified becomes true,
          // so index 1 will now point to the next step (Sign In).
          setTutorialStep(1);
        } else if (tutorialPhase === 'cloudflare_1') {
          setTutorialPhase('init');
          setTutorialStep(1); 
          setShowTutorial(true);
        } else if (tutorialPhase === 'cloudflare_2') {
          setTutorialPhase('done');
          localStorage.setItem('bg_tutorial_completed', 'true');
          setShowTutorial(false);
        }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Verification error. Please try again.");
    }
    };
  }, [tutorialPhase, tutorialStep]);

  useEffect(() => {
    if (hasRestoredBackup) {
      const timer = setTimeout(() => {
        searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchInputRef.current?.focus();
        // Reset horizontal scroll to prevent "shifting to the side"
        window.scrollTo({ left: 0 });
        setHasRestoredBackup(false);
      }, 800); // Increased timeout to wait for theme transitions
      return () => clearTimeout(timer);
    }
  }, [hasRestoredBackup]);

  useEffect(() => {
    localStorage.setItem('bg_starred_hardware', JSON.stringify(starredHardware));
  }, [starredHardware]);

  useEffect(() => {
    const migrateAndEnrichHardware = async () => {
      if (!user || !hasAcceptedTerms) return;
      try {
        const oldInstruments = localStorage.getItem('bg_analog_instruments');
        const oldHardware = localStorage.getItem('bg_analog_hardware');

        if (oldInstruments || oldHardware) {
          const instrumentsToMigrate = oldInstruments ? JSON.parse(oldInstruments) : [];
          const hardwareToMigrate = oldHardware ? JSON.parse(oldHardware) : [];

          if (instrumentsToMigrate?.length > 0 && typeof instrumentsToMigrate[0] === 'string') {
            const enrichedInstruments = await enrichHardware(instrumentsToMigrate);
            setAnalogInstruments(enrichedInstruments);
            localStorage.removeItem('bg_analog_instruments');
          }

          if (hardwareToMigrate?.length > 0 && typeof hardwareToMigrate[0] === 'string') {
            const enrichedHardware = await enrichHardware(hardwareToMigrate);
            setAnalogHardware(enrichedHardware);
            localStorage.removeItem('bg_analog_hardware');
          }
        }
      } catch (err: any) {
        console.error("Hardware migration failed:", err);
        // Silently fail or handle if needed, since this is a background migration
      }
    };

    migrateAndEnrichHardware();
  }, [user, hasAcceptedTerms]);
  useEffect(() => {
    const checkTier = async () => {
      const key = localStorage.getItem('bg_user_api_key');
      const tier = localStorage.getItem('bg_api_tier');
      if (key && !tier) {
        const detected = await detectAPITier(key);
        localStorage.setItem('bg_api_tier', detected);
      }
    };
    checkTier();
  }, []);

  const [excludeAnalog, setExcludeAnalog] = useState(false);
  const [lunaSumming, setLunaSumming] = useState<'api' | 'neve' | 'off'>('off');
  const [lunaTape, setLunaTape] = useState<'oxide' | 'studer' | 'off'>('off');
  const [dawType, setDawType] = useState<string | null>(() => {
    return localStorage.getItem('bg_daw_type') || null;
  });

  useEffect(() => {
    if (dawType) {
      localStorage.setItem('bg_daw_type', dawType);
      if (dawType !== 'REAPER' && dawType !== 'Reaper') {
        setIsJsfxMode(false);
      }
    } else {
      localStorage.removeItem('bg_daw_type');
    }
  }, [dawType]);

  const [showGuide, setShowGuide] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [viewingRecipe, setViewingRecipe] = useState<SavedRecipe | null>(null);
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    if (window.location.hash === '#cookies') {
      setShowCookiePolicy(true);
    }
    
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      if (window.location.hash === '#cookies') {
        setShowCookiePolicy(true);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [activeSession, setActiveSession] = useState<SharedSession | null>(null);
  const saveFileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverStemId, setDragOverStemId] = useState<string | null>(null);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [showJsfxHelpModal, setShowJsfxHelpModal] = useState(false);
  const [showReapackReposModal, setShowReapackReposModal] = useState(false);
    const [copiedPackReapack, setCopiedPackReapack] = useState<string | null>(null);
    const [copiedAllPacks, setCopiedAllPacks] = useState<boolean>(false);

  const COMMUNITY_JSFX_PACKS = [
    {
        "name": "Tukan Studios",
        "desc": "29 effects",
        "source": "https://github.com/TukanStudios/TUKAN_STUDIOS_PLUGINS",
        "reapack": "https://github.com/TukanStudios/TUKAN_STUDIOS_PLUGINS/raw/main/index2.xml"
    },
    {
        "name": "Geraint Luff",
        "desc": "Outstanding creative DSP effects including Humulator, spectral compressors, delays, and echo thieves.",
        "source": "https://geraintluff.github.io/jsfx/",
        "reapack": "https://geraintluff.github.io/jsfx/index.xml"
    },
    {
        "name": "Saike JSFX",
        "desc": "47 effects, 1 script",
        "source": "https://github.com/JoepVanlier/JSFX/",
        "reapack": "https://github.com/JoepVanlier/JSFX/raw/master/index.xml"
    },
    {
        "name": "Suzuki (RCGN) JSFX",
        "desc": "42 scripts, 2 effects",
        "source": "https://github.com/Suzuki-Re/Suzuki-Scripts",
        "reapack": "https://github.com/Suzuki-Re/Suzuki-Scripts/raw/master/index.xml"
    },
    {
        "name": "Sonic Anomaly",
        "desc": "15 effects",
        "source": "http://sonic.supermaailma.net/plugins",
        "reapack": "https://github.com/Sonic-Anomaly/Sonic-Anomaly-JSFX/raw/master/index.xml"
    },
    {
        "name": "ReaTeam JSFX",
        "desc": "143 effects",
        "source": "https://github.com/ReaTeam/JSFX",
        "reapack": "https://github.com/ReaTeam/JSFX/raw/master/index.xml"
    },
    {
        "name": "Saike Tools (Joep Vanlier)",
        "desc": "Saike JSFX Plugins",
        "source": "https://github.com/JoepVanlier/JSFX",
        "reapack": "https://raw.githubusercontent.com/JoepVanlier/JSFX/master/index.xml"
    },
    {
        "name": "JSFX Clones",
        "desc": "JSFX Clones",
        "source": "https://github.com/JClones/JSFXClones",
        "reapack": "https://raw.githubusercontent.com/JClones/JSFXClones/master/index.xml"
    },
    {
        "name": "Chokehold JSFX",
        "desc": "39 effects",
        "source": "https://github.com/chkhld/jsfx/",
        "reapack": "https://github.com/chkhld/jsfx/raw/main/index.xml"
    },
    {
        "name": "MPL Scripts",
        "desc": "406 scripts, 2 effects",
        "source": "https://github.com/MichaelPilyavskiy/ReaScripts",
        "reapack": "https://github.com/MichaelPilyavskiy/ReaScripts/raw/master/index.xml"
    },
    {
        "name": "X-Raym Scripts",
        "desc": "624 scripts, 20 effects, 3 misc packages, 2 web interfaces",
        "source": "https://github.com/X-Raym/REAPER-ReaScripts",
        "reapack": "https://github.com/X-Raym/REAPER-ReaScripts/raw/master/index.xml"
    },
    {
        "name": "ACendan Scripts",
        "desc": "136 scripts, 7 effects, 1 web interface",
        "source": "https://github.com/acendan/reascripts",
        "reapack": "https://acendan.github.io/reascripts/index.xml"
    },
    {
        "name": "Beaunus Scripts",
        "desc": "4 effects, 1 script",
        "source": "https://github.com/beaunus/REAPER-ReaScripts/",
        "reapack": "https://github.com/beaunus/REAPER-ReaScripts/raw/master/index.xml"
    },
    {
        "name": "BinbinHfr Scripts",
        "desc": "13 scripts, 8 effects",
        "source": "https://github.com/DaveInDev/Binbinhfr-Scripts/",
        "reapack": "https://github.com/DaveInDev/Binbinhfr-Scripts/raw/master/index.xml"
    },
    {
        "name": "chmaha airwindows JSFX Ports",
        "desc": "114 effects",
        "source": "https://github.com/chmaha/airwindows-JSFX-ports",
        "reapack": "https://github.com/chmaha/airwindows-JSFX-ports/raw/main/index.xml"
    },
    {
        "name": "Claudiohbsantos Scripts",
        "desc": "65 scripts, 6 effects",
        "source": "https://github.com/Claudiohbsantos/Claudiohbsantos-Scripts",
        "reapack": "https://github.com/Claudiohbsantos/Claudiohbsantos-Scripts/raw/master/index.xml"
    },
    {
        "name": "Erriez",
        "desc": "2 effects",
        "source": "https://github.com/Erriez/erriez-reaper-jsfx/",
        "reapack": "https://github.com/Erriez/erriez-reaper-jsfx/raw/master/index.xml"
    },
    {
        "name": "kawa Scripts",
        "desc": "420 scripts, 7 effects",
        "source": "http://kawa.works/reascripts",
        "reapack": "https://bitbucket.org/kawaCat/reascript-m2bpack/raw/master/index.xml"
    },
    {
        "name": "mrlimbic scripts",
        "desc": "8 effects, 8 scripts",
        "source": "https://github.com/mrlimbic/reascripts",
        "reapack": "https://github.com/mrlimbic/reascripts/raw/master/index.xml"
    },
    {
        "name": "ply Scripts",
        "desc": "13 scripts, 3 effects",
        "source": "https://ply.github.io/ReaScripts/",
        "reapack": "https://ply.github.io/ReaScripts/index.xml"
    },
    {
        "name": "chmaha Scripts",
        "desc": "2 effects, 2 scripts",
        "source": "https://github.com/chmaha/ReaClassical",
        "reapack": "https://github.com/chmaha/ReaClassical/raw/main/index.xml"
    },
    {
        "name": "RCJacH Scripts",
        "desc": "16 effects, 13 scripts",
        "source": "https://github.com/RCJacH/ReaScripts/",
        "reapack": "https://github.com/RCJacH/ReaScripts/raw/master/index.xml"
    },
    {
        "name": "ReJJ",
        "desc": "2 effects",
        "source": "https://github.com/Justin-Johnson/ReJJ/",
        "reapack": "https://github.com/Justin-Johnson/ReJJ/raw/master/index.xml"
    },
    {
        "name": "Souk21 ReaPack",
        "desc": "4 scripts, 2 effects",
        "source": "https://github.com/Souk21/REAPER-scripts-and-effects",
        "reapack": "https://github.com/Souk21/REAPER-scripts-and-effects/raw/master/index.xml"
    },
    {
        "name": "Tormy Van Cool ReaPack Scripts",
        "desc": "14 scripts, 5 effects",
        "source": "https://github.com/tormyvancool/TormyVanCool_ReaPack_Scripts",
        "reapack": "https://github.com/tormyvancool/TormyVanCool_ReaPack_Scripts/raw/master/index.xml"
    },
    {
        "name": "X-Raym MIDI Makey Makey",
        "desc": "4 effects",
        "source": "https://github.com/X-Raym/MIDI-Makey-Makey",
        "reapack": "https://github.com/X-Raym/MIDI-Makey-Makey/raw/master/index.xml"
    },
    {
        "name": "zaibuyidao Scripts",
        "desc": "398 scripts, 8 effects, 2 language packs",
        "source": "https://github.com/zaibuyidao/ReaScripts",
        "reapack": "https://github.com/zaibuyidao/ReaScripts/raw/master/index.xml"
    },
    {
        "name": "Juan_R's Reaperism",
        "desc": "7 effects, 4 scripts",
        "source": "https://github.com/juanriccio/Reaperism",
        "reapack": "https://raw.githubusercontent.com/juanriccio/Reaperism/master/index.xml"
    }
];

  const [installedJsfxPacks, setInstalledJsfxPacks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('beatgangsta_installed_jsfx_packs');
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  });
  const [newJsfxNotification, setNewJsfxNotification] = useState<string | null>(null);
  const [reaperOnline, setReaperOnline] = useState(false);
  const [reaperSyncPin, setReaperSyncPin] = useState<string | null>(() => localStorage.getItem('beatgangsta_reaper_sync_pin'));
  const [isPushingReaperSync, setIsPushingReaperSync] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  const handleToggleJsfxMode = (active: boolean) => {
    setIsJsfxMode(active);
    if (active) {
      setDawType('Reaper');
      setAudioMode('critique');
      setHasStems(true);
      setInputMode('upload');
      setMainTab('beat');
      
      // Ensure we have a PIN
      let currentPin = reaperSyncPin || localStorage.getItem('beatgangsta_reaper_sync_pin');
      if (!currentPin) {
        currentPin = Math.floor(1000 + Math.random() * 9000).toString();
        setReaperSyncPin(currentPin);
        localStorage.setItem('beatgangsta_reaper_sync_pin', currentPin);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('beatgangsta_installed_jsfx_packs', JSON.stringify(installedJsfxPacks));
  }, [installedJsfxPacks]);

  useEffect(() => {
    const isReaperSyncActive = isJsfxMode || dawType === 'REAPER' || dawType === 'Reaper';
    if (!isReaperSyncActive || !reaperSyncPin) {
      setReaperOnline(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const email = user?.email || localStorage.getItem('beatgangsta_sync_email') || '';
        if (!email) return;

        const res = await fetch(`/api/reaper-sync/status?email=${encodeURIComponent(email)}&pin=${encodeURIComponent(reaperSyncPin)}`);
        if (res.ok) {
          const data = await res.json();
          setReaperOnline(data.online || false);
          
          if (Array.isArray(data.detectedPacks)) {
            const detected = data.detectedPacks;
            
            // Check if there are any packs in 'detected' that are NOT in 'installedJsfxPacks'
            const newPacks = detected.filter((p: string) => !installedJsfxPacks.includes(p));
            if (newPacks.length > 0) {
              // Add new packs to installedJsfxPacks
              const updated = Array.from(new Set([...installedJsfxPacks, ...detected]));
              setInstalledJsfxPacks(updated);
              
              // Show notification popup!
              setNewJsfxNotification(`New JSFX detected! BeatGangsta Connect found ${newPacks.join(', ')} in your REAPER setup. Your gear rack has been updated!`);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch REAPER sync status:", err);
      }
    };

    // Poll every 5 seconds
    checkStatus();
    const timer = setInterval(checkStatus, 5000);
    return () => clearInterval(timer);
  }, [isJsfxMode, dawType, reaperSyncPin, installedJsfxPacks, user?.email]);

  useEffect(() => {
    if (user && user.justReceivedPromo) {
      setShowPromoPopup(true);
      // Remove it from the local state so it doesn't pop up again if something triggers a re-render
      setUser(prev => prev ? { ...prev, justReceivedPromo: false } : prev);
      
      const storedUser = localStorage.getItem('bg_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          parsedUser.justReceivedPromo = false;
          localStorage.setItem('bg_user', JSON.stringify(parsedUser));
        } catch(e) {}
      }
    }
  }, [user?.justReceivedPromo]);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [purchaseType, setPurchaseType] = useState<'credits' | 'stem_slots'>('credits');
  const [pendingAmount, setPendingAmount] = useState<number>(0);
  const [pendingCredits, setPendingCredits] = useState<number>(0);
  const [pendingStemSlots, setPendingStemSlots] = useState<number>(0);
  const [showBuyStemsModal, setShowBuyStemsModal] = useState(false);
  const [stemSlotSliderValue, setStemSlotSliderValue] = useState<number>(1);

  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [userApiKey, setUserApiKey] = useState(localStorage.getItem('bg_user_api_key') || '');
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [apiTier, setApiTier] = useState<'TIER_1' | 'FREE'>(() => (localStorage.getItem('bg_api_tier') as 'TIER_1' | 'FREE') || 'FREE');
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [showMasterModeModal, setShowMasterModeModal] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const touchStartPos = useRef<{ x: number, y: number } | null>(null);

  const handlePasscodeSubmit = async () => {
    if (!isMasterAuthorized) {
      setError("Master Mode is only available for authorized users in English.");
      return;
    }
    try {
      const response = await fetchWithDetailedError('/api/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('_mv', 'true');
        localStorage.setItem('_master_key_temp', passcode); // Store key for admin dashboard
        setM_act(true);
        setTheme('coldest');
        setDuragStyle('dragonball-purple');
        setShowPasscodeModal(false);
        setPasscode('');
        setShowSparkles(true);
        setShowMasterModeModal(true);
        setTimeout(() => setShowSparkles(false), 3000);
      } else {
        setPasscode('');
      }
    } catch (error: any) {
      console.error("Verification failed", error);
      setError(error.message || "Verification failed. Please try again.");
      setPasscode('');
    }
  };

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (h_act && highEyes && isMasterAuthorized) {
      let x = 0;
      let y = 0;
      if ('clientX' in e) {
        x = e.clientX;
        y = e.clientY;
      } else if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
      }
      setContextMenu({ x, y });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (h_act && highEyes && isMasterAuthorized) {
      isLongPress.current = false;
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      touchStartPos.current = { x, y };
      
      longPressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        setContextMenu({ x, y });
        if ('vibrate' in navigator) navigator.vibrate(50);
      }, 700); // 700ms for long press
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current || !longPressTimer.current) return;
    
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPos.current.x);
    const dy = Math.abs(touch.clientY - touchStartPos.current.y);
    
    // If moved more than 10px, cancel the long press
    if (dx > 10 || dy > 10) {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    touchStartPos.current = null;
    if (isLongPress.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (duragStyle === 'sound-ninja' && !m_act) {
      setDuragStyle('standard');
    }
  }, [m_act, duragStyle]);

  const toggleStar = (itemName: string) => {
    if (starredPlugins.includes(itemName)) {
      setStarredPlugins(starredPlugins.filter(p => p !== itemName));
    } else if (starredHardware.includes(itemName)) {
      setStarredHardware(starredHardware.filter(h => h !== itemName));
    } else {
      const isJsfx = JSFX_DATABASE.some(j => j.name === itemName || j.shortName === itemName);
      if (plugins.some(p => p.name === itemName) || isJsfx) {
        if (starredPlugins.length < 10) {
          setStarredPlugins([...starredPlugins, itemName]);
        } else {
          setError("You can only star up to 10 plugins.");
          setTimeout(() => setError(null), 3000);
        }
      } else {
        if (starredHardware.length < 10) {
          setStarredHardware([...starredHardware, itemName]);
        } else {
          setError("You can only star up to 10 hardware items.");
          setTimeout(() => setError(null), 3000);
        }
      }
    }
  };




  const currentAppName = highEyes ? "BeatRetard" : "BeatGangsta";
  const [h_act, setH_act] = useState(() => localStorage.getItem('_hv') === 'true');
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  
  const [autoBackupPrefs, setAutoBackupPrefs] = useState<{ gear: boolean; settings: boolean; recipes: boolean; critiques: boolean }>(() => {
    try {
      const saved = localStorage.getItem('bg_auto_backup_prefs');
      return saved ? JSON.parse(saved) : { gear: true, settings: true, recipes: true, critiques: true };
    } catch (e) {
      return { gear: true, settings: true, recipes: true, critiques: true };
    }
  });

  useEffect(() => {
    if (user && tutorialPhase === 'cloud_sync' && backupInfo && !backupInfo.hasBackup) {
      setWasCloudSyncModalShown(true);
    }
  }, [user, tutorialPhase, backupInfo]);

  useEffect(() => {
    if (showCloudSyncModal) setWasCloudSyncModalShown(true);
  }, [showCloudSyncModal]);

  useEffect(() => {
    if (tutorialPhase === 'done') return;
    if (showCookieConsent) return; // Wait for cookie consent

    if (!m_act) {
      if (showTutorial) setShowTutorial(false);
      return;
    }

    // If tutorial hasn't started yet and cookie consent is done
    if (!showTutorial && tutorialPhase === 'init' && !localStorage.getItem('bg_tutorial_completed')) {
      setShowTutorial(true);
    }

    if (tutorialPhase === 'init' && user && isVerified) {
      // If user is already logged in, decide whether to show cloud_sync or skip it
      if (isInitialUser) {
        // Returning user, skip cloud_sync
        if (plugins.length > 0 || isJsfxMode) {
          setTutorialPhase('library_populated');
        } else {
          setTutorialPhase('import');
        }
      } else if (justSignedIn) {
        // Just signed in, show cloud_sync
        setTutorialPhase('cloud_sync');
      } else {
        // Logged in but not initial and not just signed in? 
        // This could happen on refresh if they haven't finished tutorial.
        // Default to skipping cloud_sync if they already have plugins.
        if (plugins.length > 0 || isJsfxMode) {
          setTutorialPhase('library_populated');
        } else {
          setTutorialPhase('import');
        }
      }
      setTutorialStep(0);
      setShowTutorial(true);
    } else if (tutorialPhase === 'cloud_sync') {
      const hasPrefs = !!localStorage.getItem('bg_auto_backup_prefs');
      if (!showCloudSyncModal && !showRestoreModal && (hasPrefs || wasCloudSyncModalShown)) {
        if (plugins.length > 0 || isJsfxMode) {
          setTutorialPhase('library_populated');
        } else {
          setTutorialPhase('import');
        }
        setTutorialStep(0);
        setShowTutorial(true);
      }
    } else if (tutorialPhase === 'analyzing' && !isEnrichingLibrary && (plugins.length > 0 || isJsfxMode)) {
      setTutorialPhase('library_populated');
      setTutorialStep(0);
      setShowTutorial(true);
    } else if (tutorialPhase === 'library_populated' && !showTutorial && recipes.length > 0) {
      setTutorialPhase('first_recipe');
      setTutorialStep(0);
      setShowTutorial(true);
    }
  }, [user, showCloudSyncModal, pendingFile, isEnrichingLibrary, plugins.length, recipes.length, tutorialPhase, showTutorial, wasCloudSyncModalShown, showConsentModal, tutorialStep, m_act]);

  // Auto-advance tutorial steps when actions are completed
  useEffect(() => {
    if (tutorialPhase === 'library_populated' && tutorialStep === 2 && showVault) {
      setTutorialStep(3);
    } else if (tutorialPhase === 'library_populated' && tutorialStep === 3 && !showVault) {
      // Wait for them to close the vault before moving to Rig Manager
      setTutorialStep(4);
    }
  }, [tutorialPhase, tutorialStep, showVault]);

  useEffect(() => {
    if (user && !cloudDriveUrl && !cloudDriveError) {
      const fetchCloudUrl = async () => {
        try {
          const res = await fetchWithDetailedError('/api/cloud/url');
          const data = await res.json();
          if (data.url) {
            setCloudDriveUrl(data.url);
            localStorage.setItem('bg_cloud_drive_url', data.url);
            setCloudDriveError(false);
          }
        } catch (e: any) {
          console.error("Failed to fetch cloud drive URL", e);
          setCloudDriveError(true);
        }
      };
      fetchCloudUrl();
    }
  }, [user, cloudDriveUrl, cloudDriveError]);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetchWithDetailedError('/api/auth/status');
      
      // If the response is HTML (which happens when the platform intercepts the request and asks for a cookie check/auth gate),
      // we should handle it gracefully by setting user to null instead of throwing a JSON parsing error.
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.warn("[AUTH] /api/auth/status returned HTML instead of JSON. The request might be blocked/redirected by the platform security cookie gate. Treating as unauthenticated.");
        setUser(null);
        localStorage.removeItem('bg_user');
        return;
      }

      const data = await res.json();
      
      if (data.authenticated) {
        setUser(data.user);
        if (data.user.termsAccepted) {
          setHasAcceptedTerms(true);
          localStorage.setItem('bg_terms_accepted', 'true');
        }
        setError(null);
        try {
          localStorage.setItem('bg_user', JSON.stringify(data.user));
        } catch (e) {
          console.error("Failed to stringify user data", data.user, e);
        }

        // Check for pending consent
        const pendingConsent = localStorage.getItem('bg_pending_consent');
        if (pendingConsent === 'true' && !data.user.termsAccepted) {
          fetchWithDetailedError('/api/auth/accept-terms', { method: 'POST' })
            .then(res => {
              localStorage.removeItem('bg_pending_consent');
              const updatedUser = { ...data.user, termsAccepted: true };
              setUser(updatedUser);
              localStorage.setItem('bg_user', JSON.stringify(updatedUser));
              localStorage.setItem('bg_terms_accepted', 'true');
              setHasAcceptedTerms(true);
            })
            .catch(err => console.error("Failed to save pending consent", err));
        }

        if (!data.user.termsAccepted && tutorialPhaseRef.current === 'done') {
          setShowConsentModal(true);
        }

        // Load tutorial progress from cloud
        await loadTutorialProgressFromCloud();

        try {
          const urlRes = await fetchWithDetailedError('/api/cloud/url');
          const urlData = await urlRes.json();
          if (urlData.url) {
            setCloudDriveUrl(urlData.url);
            localStorage.setItem('bg_cloud_drive_url', urlData.url);
          }
        } catch (e) {
          console.error("Failed to fetch cloud drive URL", e);
        }
        
        try {
          const receiptsRes = await fetchWithDetailedError('/api/receipts');
          const receiptsData = await receiptsRes.json();
          if (receiptsData.receipts) {
            setReceipts(receiptsData.receipts);
          }
        } catch (e) {
          console.error("Failed to fetch receipts", e);
        }
        
        if (!localStorage.getItem('bg_auto_backup_prefs') && tutorialPhaseRef.current === 'done' && justSignedInRef.current) {
          setCloudSyncMode('setup');
          setShowCloudSyncModal(true);
        }
        setJustSignedIn(false);
      } else {
        // If the server says we're not authenticated, we should clear the local user
        setUser(null);
        localStorage.removeItem('bg_user');
      }
    } catch (err: any) {
      console.warn("Auth status check failed (background polling/startup):", err.message || err);
      // Quietly fall back to unauthenticated state rather than blocking the user with a fatal error banner.
      setUser(null);
    }
  }, [loadTutorialProgressFromCloud]); // Stable

  const syncAuth = useCallback(async (syncToken: string) => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    console.log("[AUTH DEBUG] Starting syncAuth with token:", syncToken);
    setJustSignedIn(true);
    try {
      const res = await fetchWithDetailedError('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syncToken })
      });
      const data = await res.json();
      
      console.log("[AUTH DEBUG] syncAuth successful, user:", data.user?.name);
      if (data.user) {
          setUser(data.user);
          localStorage.setItem('bg_user', JSON.stringify(data.user));
        }
        
        if (localStorage.getItem('bg_pending_consent') === 'true') {
          fetchWithDetailedError('/api/auth/accept-terms', { method: 'POST' })
            .then(() => {
              localStorage.removeItem('bg_pending_consent');
              localStorage.setItem('bg_terms_accepted', 'true');
              setUser(prev => {
                if (prev) {
                  const updated = { ...prev, termsAccepted: true };
                  localStorage.setItem('bg_user', JSON.stringify(updated));
                  return updated;
                }
                return null;
              });
              setHasAcceptedTerms(true);
            })
            .catch(console.error);
        }
        // Fetch backup info
        fetchWithDetailedError('/api/auth/check-backup')
          .then(res => res.json())
          .then(data => {
            setBackupInfo(data);
            if (data.hasBackup && tutorialPhaseRef.current === 'done' && justSignedInRef.current) {
              setShowRestoreModal(true);
            }
          })
          .catch(console.error);

        // Load tutorial progress from cloud
        await loadTutorialProgressFromCloud(true);
    } catch (err: any) {
      console.error("[AUTH ERROR] syncAuth failed:", err);
      setError(`Auth sync failed: ${err.message}`);
      checkAuth();
    } finally {
      syncingRef.current = false;
    }
  }, [checkAuth, loadTutorialProgressFromCloud]); // Stable

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Validate data is an object and is our own authentication message
      if (!event.data || typeof event.data !== 'object' || event.data.type !== 'OAUTH_AUTH_SUCCESS') {
        return;
      }

      // Validate origin
      const origin = event.origin;
      console.log("[AUTH DEBUG] Received postMessage from origin:", origin, "data:", event.data?.type);
      
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('beatgangsta.com')) {
        console.warn("[AUTH DEBUG] postMessage origin rejected:", origin);
        return;
      }

      console.log("[AUTH DEBUG] OAUTH_AUTH_SUCCESS received via postMessage");
      if (event.data.syncToken) {
        await syncAuth(event.data.syncToken);
      } else {
        console.log("[AUTH DEBUG] No syncToken in message, calling checkAuth");
        checkAuth();
      }
    };

    // 1. postMessage listener
    window.addEventListener('message', handleMessage);

    // 2. BroadcastChannel listener (Fallback)
    const bc = new BroadcastChannel('bg_auth_sync');
    bc.onmessage = (event) => {
      console.log("[AUTH DEBUG] Received BroadcastChannel message:", event.data);
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data.syncToken) {
        syncAuth(event.data.syncToken);
      }
    };

    // 3. localStorage listener (Fallback)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'bg_auth_sync_data' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          console.log("[AUTH DEBUG] Received localStorage sync data:", data);
          if (data.type === 'OAUTH_AUTH_SUCCESS' && data.syncToken) {
            syncAuth(data.syncToken);
            // Clean up
            localStorage.removeItem('bg_auth_sync_data');
          }
        } catch (e) {
          console.error("[AUTH ERROR] Failed to parse storage sync data", e);
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    // 4. Polling fallback (Last resort if all communication fails)
    const authInterval = setInterval(() => {
      if (!userRef.current && !justSignedInRef.current) {
        console.log("[AUTH DEBUG] Polling checkAuth...");
        checkAuth();
      }
    }, 4000); // Poll every 4 seconds for responsive sign-in sync

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
      bc.close();
      clearInterval(authInterval);
    };
  }, [checkAuth, syncAuth]);

  const handleSignOut = async () => {
    try {
      await fetchWithDetailedError('/api/auth/logout', { method: 'POST' });
      setUser(null);
      localStorage.removeItem('bg_user');
      setIsUserMenuOpen(false);
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const handleDeleteCloudData = async () => {
    try {
      setIsDeletingAccount(true);
      await fetchWithDetailedError('/api/cloud/data', { method: 'DELETE' });
      
      // Clear local states if user successfully cleared cloud data
      setPlugins([]);
      setAnalogInstruments([]);
      setAnalogHardware([]);
      setStarredPlugins([]);
      
      localStorage.removeItem('bg_library');
      localStorage.removeItem('bg_plugins');
      localStorage.removeItem('bg_analog_instruments_v2');
      localStorage.removeItem('bg_analog_hardware_v2');

      alert(t('cloud_data_removed'));
      window.location.reload(); // Force full reload to be sure
    } catch (err: any) {
      console.error("Failed to delete cloud data", err);
      alert(t('cloud_data_delete_error', { error: err.message }));
    } finally {
      setIsDeletingAccount(false);
      setIsUserMenuOpen(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true);
      await fetchWithDetailedError('/api/auth/account', { method: 'DELETE' });
      
      // Comprehensive state wipe
      setPlugins([]);
      setAnalogInstruments([]);
      setAnalogHardware([]);
      setVault([]);
      setSavedCritiques([]);
      setFolders([]);
      
      localStorage.clear();
      setShowDeleteConfirm(false);
      alert(t('account_deleted'));
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to delete account", err);
      alert(t('account_delete_error', { error: err.message }));
    } finally {
      setIsDeletingAccount(false);
      setIsUserMenuOpen(false);
    }
  };

  const handleSaveCloudPrefs = (prefs: { gear: boolean; settings: boolean; recipes: boolean; critiques: boolean }) => {
    setAutoBackupPrefs(prefs);
    localStorage.setItem('bg_auto_backup_prefs', JSON.stringify(prefs));
    setShowCloudSyncModal(false);
    
    // Trigger initial backup based on preferences
    handleExecuteCloudSync('backup', { ...prefs, critiques: false }, true);
  };

  const handleExecuteCloudSync = async (action: 'backup' | 'restore', prefs: { gear: boolean; settings: boolean; recipes: boolean; critiques: boolean }, silent = false) => {
    if (!requireAuth()) return;
    if (!silent) setIsCloudSyncing(true);
    try {
      if (action === 'backup') {
        const saveFile: FullSaveFile = {
          version: "1.0",
          timestamp: Date.now(),
          userProfile: {
            name: user.name,
            photo: user.photo
          },
          gear: {
            plugins,
            analogInstruments,
            analogHardware,
            starredPlugins,
            starredHardware,
            deletedPlugins,
            deletedInstruments,
            deletedHardware
          },
          vault: {
            recipes: vault,
            critiques: savedCritiques,
            folders
          },
          receipts,
          ui: {
            theme,
            grillStyle,
            knifeStyle,
            duragStyle,
            pendantStyle,
            chainStyle,
            saberColor,
            mascotColor,
            showChain,
            highEyes,
            isCigarEquipped,
            isTossingCigar,
            showSparkles,
            stemTypesPreset,
            stemCustomTypesPreset
          }
        };

        const res = await fetchWithDetailedError('/api/cloud/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: saveFile, preferences: prefs })
        });

        const result = await res.json();
        if (result.folderUrl) {
          setCloudDriveUrl(result.folderUrl);
          localStorage.setItem('bg_cloud_drive_url', result.folderUrl);
        }
        if (!silent) alert(t('backup_successful'));
      } else {
        const res = await fetchWithDetailedError('/api/cloud/restore');
        const { data } = await res.json();
        if (data) {
          if (prefs.gear && data.gear) {
            setPlugins(data.gear.plugins || (data.gear as any).library || []);
            setAnalogInstruments(data.gear.analogInstruments || []);
            setAnalogHardware(data.gear.analogHardware || []);
            setDrumKits(data.gear.drumKits || []);
            setStarredPlugins(data.gear.starredPlugins || []);
            setStarredHardware(data.gear.starredHardware || []);
            setDeletedPlugins(data.gear.deletedPlugins || []);
            setDeletedInstruments(data.gear.deletedInstruments || []);
            setDeletedHardware(data.gear.deletedHardware || []);
            setInputMode('search');
            setHasRestoredBackup(true);
            setShowRigUI(true);
          }
          if (prefs.recipes && data.vault) {
            setVault(data.vault.recipes || data.vault || []);
            setSavedCritiques(data.vault.critiques || []);
            setFolders(data.vault.folders || []);
            if (data.receipts) setReceipts(data.receipts);
          }
          if (prefs.settings && data.uiSettings) {
            setTheme(data.uiSettings.theme || 'coldest');
            setGrillStyle(data.uiSettings.grillStyle || 'diamond');
            setKnifeStyle(data.uiSettings.knifeStyle || 'standard');
            setDuragStyle(data.uiSettings.duragStyle || 'standard');
            setPendantStyle(data.uiSettings.pendantStyle || 'silver');
            setChainStyle(data.uiSettings.chainStyle || 'silver');
            setSaberColor(data.uiSettings.saberColor || '#a855f7');
            setMascotColor(data.uiSettings.mascotColor || '#3b82f6');
            setShowChain(data.uiSettings.showChain || false);
            setHighEyes(data.uiSettings.highEyes || false);
            setIsCigarEquipped(data.uiSettings.isCigarEquipped || false);
            setIsTossingCigar(data.uiSettings.isTossingCigar || false);
            setShowSparkles(data.uiSettings.showSparkles || false);
            if (data.uiSettings.stemTypesPreset) {
              setStemTypesPreset(data.uiSettings.stemTypesPreset);
              setStems(prev => prev.map((s, i) => ({ ...s, type: data.uiSettings.stemTypesPreset[i] || 'Other' })));
            }
            if (data.uiSettings.stemCustomTypesPreset) {
              setStemCustomTypesPreset(data.uiSettings.stemCustomTypesPreset);
              setStems(prev => prev.map((s, i) => ({ ...s, customType: data.uiSettings.stemCustomTypesPreset[i] || '' })));
            }
          }
          if (!silent) alert(t('restore_successful'));
        }
      }
    } catch (err: any) {
      if (!silent) setError(`Cloud ${action} failed: ${err.message || "Please try again."}`);
    } finally {
      setIsCloudSyncing(false);
      setShowCloudSyncModal(false);
    }
  };

  const handleCloudBackupRecipe = async (recipe: BeatRecipe) => {
    if (!user) return;
    try {
      const { generateIndividualMidiFiles } = await import('./utils/exportAllMidi');
      const files = await generateIndividualMidiFiles(recipe);
      const midiFiles = files.filter(f => f.type === 'midi');
      const loopFiles = files.filter(f => f.type === 'loop');

      const res = await fetchWithDetailedError('/api/cloud/backup/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe, midiFiles, loopFiles })
      });

      alert(t('recipe_backed_up', { title: recipe.title }));
    } catch (err: any) {
      console.error("Recipe backup error:", err);
      alert(t('failed_recipe_backup', { error: err.message }));
    }
  };

  const handleCloudBackup = async () => {
    setShowRigUI(false);
    setCloudSyncMode('backup');
    setShowCloudSyncModal(true);
  };

  const handleCloudRestore = async () => {
    setShowRigUI(false);
    setCloudSyncMode('restore');
    setShowCloudSyncModal(true);
  };

  const handleCompareRigs = (link: string) => {
    console.log('Comparing rig:', link);
    // TODO: Implement rig comparison logic
  };

  // Auto-backup UI settings when they change (debounced)
  useEffect(() => {
    if (!user || !autoBackupPrefs.settings) return;

    const timer = setTimeout(() => {
      handleExecuteCloudSync('backup', { gear: false, settings: true, recipes: false, critiques: false }, true);
    }, 10000); // 10 second debounce to avoid excessive API calls

    return () => clearTimeout(timer);
  }, [theme, grillStyle, knifeStyle, duragStyle, pendantStyle, chainStyle, saberColor, mascotColor, showChain, highEyes, isCigarEquipped, isTossingCigar, showSparkles, user, autoBackupPrefs.settings]);

  useEffect(() => {
    const uiSettings = {
      theme,
      grillStyle,
      knifeStyle,
      duragStyle,
      pendantStyle,
      chainStyle,
      saberColor,
      mascotColor,
      showChain,
      highEyes,
      isCigarEquipped,
      isTossingCigar,
      showSparkles,
      stemTypesPreset,
      stemCustomTypesPreset
    };
    localStorage.setItem('bg_active_ui', JSON.stringify(uiSettings));
  }, [theme, grillStyle, knifeStyle, duragStyle, pendantStyle, chainStyle, saberColor, mascotColor, showChain, highEyes, isCigarEquipped, isTossingCigar, showSparkles, stemTypesPreset, stemCustomTypesPreset]);

  const [vault, setVault] = useState<SavedRecipe[]>(() => {
    try {
      const saved = localStorage.getItem('bg_vault');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch (e) {
      return [];
    }
  });

  const [receipts, setReceipts] = useState<ReceiptItem[]>(() => {
    try {
      const saved = localStorage.getItem('bg_receipts');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch (e) {
      return [];
    }
  });

  const prevReceiptsLengthRef = useRef(receipts.length);
  useEffect(() => {
    localStorage.setItem('bg_receipts', JSON.stringify(receipts));
    
    // Only auto-backup if a NEW receipt was added (length increased)
    if (user && receipts.length > prevReceiptsLengthRef.current && (autoBackupPrefs.gear || autoBackupPrefs.settings || autoBackupPrefs.recipes || autoBackupPrefs.critiques)) {
      const timeoutId = setTimeout(() => {
        handleExecuteCloudSync('backup', { gear: false, settings: false, recipes: false, critiques: false }, true);
      }, 2000);
      prevReceiptsLengthRef.current = receipts.length;
      return () => clearTimeout(timeoutId);
    }
    prevReceiptsLengthRef.current = receipts.length;
  }, [receipts, user, autoBackupPrefs]);

  const logReceipt = (action: string, cost: number) => {
    const newReceipt: ReceiptItem = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      action,
      cost
    };
    setReceipts(prev => [newReceipt, ...prev]);
    
    // Refresh user credits from server
    checkAuth();
    
    // Play cash register / coin sound
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1); // E6
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const [savedCritiques, setSavedCritiques] = useState<SavedCritique[]>(() => {
    try {
      const saved = localStorage.getItem('bg_saved_critiques');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch (e) {
      return [];
    }
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    try {
      const saved = localStorage.getItem('bg_folders');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch (e) {
      return [];
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('bg_history');
      return saved ? (JSON.parse(saved) || []) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const checkUnlocks = async () => {
      if (h_act) return;
      
      try {
        const response = await fetchWithDetailedError('/api/check-unlocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grillStyle, knifeStyle })
        });
        const data = await response.json();
        
        if (data.hustleUnlocked) {
          localStorage.setItem('_hv', 'true');
          localStorage.setItem('_cv', 'true');
          setH_act(true);
          setC_act(true);
          setTheme('hustle-time');
          setShowSparkles(true);
          setTimeout(() => setShowSparkles(false), 4000);
        }
      } catch (error: any) {
        console.error("Verification failed", error);
      }
    };
    
    checkUnlocks();
  }, [grillStyle, knifeStyle, h_act]);

  const canSeeChefHatToggle = false; 

  useEffect(() => {
    document.title = currentAppName;
  }, [currentAppName]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('bg_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bg_user');
    }
    localStorage.setItem('bg_vault', JSON.stringify(vault));
    localStorage.setItem('bg_saved_critiques', JSON.stringify(savedCritiques));
    localStorage.setItem('bg_folders', JSON.stringify(folders));
    localStorage.setItem('bg_history', JSON.stringify(history));
  }, [user, vault, savedCritiques, folders, history]);

  const handleSignUpClick = () => {
    if (user) return;
    setShowSignUpModal(true);
  };

  const handleSignIn = () => {
    if (!tempUsername.trim()) return;
    const newUser = {
      name: tempUsername.trim(),
      email: `${tempUsername.toLowerCase()}@coldestconcept.com`,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tempUsername}`,
      uid: `temp_${Math.random().toString(36).substr(2, 9)}`
    };
    setUser(newUser);
    setShowSignUpModal(false);
  };


  const saveToVault = async (recipe: BeatRecipe) => {
    if (vault.some(r => r.title === recipe.title)) return;

    const newId = Math.random().toString(36).substr(2, 9);
    const newSaved: SavedRecipe = {
      ...recipe,
      id: newId,
      savedAt: new Date().toISOString(),
      bubbleColor: '#0ea5e9',
    };
    
    setVault(prev => [...prev, newSaved]);
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 2000);

    // Auto-backup if enabled
    if (user && autoBackupPrefs.recipes) {
      handleCloudBackupRecipe(newSaved);
    }
  };

  const handleCloudBackupCritique = async (critique: SavedCritique) => {
    if (!user) return;
    try {
      const res = await fetchWithDetailedError('/api/cloud/backup/critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ critique })
      });

      alert(t('critique_backed_up', { title: critique.title }));
    } catch (err: any) {
      console.error("Critique backup error:", err);
      alert(t('failed_critique_backup', { error: err.message }));
    }
  };

  const handleReCritique = (newCritique: MixCritique) => {
    setCritiques(prev => [newCritique, ...prev]);
  };

  const saveCritiqueToVault = async (critique: MixCritique) => {
    if (savedCritiques.some(c => c.id === critique.id)) return;

    const newSaved: SavedCritique = {
      ...critique,
      savedAt: new Date().toISOString(),
    };
    
    setSavedCritiques(prev => [...prev, newSaved]);
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 2000);

    // Auto-backup if enabled
    if (user && autoBackupPrefs.critiques) {
      handleCloudBackupCritique(newSaved);
    }
  };

  const handleDeleteAllData = () => {
    const confirmed = window.confirm("CRITICAL: This will permanently delete your profile, your entire vault, and all unlocked secret themes. You will start back at zero. Proceed?");
    
    if (confirmed) {
      // Clear all state to prevent any last-second syncs to localStorage
      setUser(null);
      setVault([]);
      setFolders([]);
      setHistory([]);
      setH_act(false);
      setC_act(false);
      setM_act(false);
      setE_act(false);
      
      // Clear storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Force a hard reload to the root origin
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  const handleShareSession = (session: SharedSession) => {
    const encoded = btoa(JSON.stringify(session));
    navigator.clipboard.writeText(encoded);
    alert(t('sync_code_copied'));
  };

  const handleExportRigFile = (targetRecipe?: SavedRecipe) => {
    const recipeToExport = targetRecipe || vault[0];
    if (!recipeToExport) {
        alert(t('need_saved_recipe_export'));
        return;
    }

    const session: SharedSession = {
      recipe: recipeToExport,
      recipes: vault,
      critiques: savedCritiques,
      senderPlugins: plugins,
      senderAnalogInstruments: analogInstruments,
      senderAnalogHardware: analogHardware,
      senderDrumKits: drumKits,
      senderName: user?.name || "BeatGangsta Producer"
    };

    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user?.name || 'Producer'}_BeatGangsta_Rig_${recipeToExport.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportRig = (session: SharedSession) => {
    setActiveSession(session);
    setShowVault(false);
  };

  const handleImportGear = (gear: { analogInstruments: Hardware[]; analogHardware: Hardware[]; drumKits: Hardware[] }) => {
    // Merge analog instruments
    setAnalogInstruments(prev => {
      const existingNames = new Set(prev.map(h => h.name));
      const newInstruments = (gear.analogInstruments || []).filter(h => !existingNames.has(h.name));
      return [...prev, ...newInstruments];
    });

    // Merge analog hardware
    setAnalogHardware(prev => {
      const existingNames = new Set(prev.map(h => h.name));
      const newHardware = (gear.analogHardware || []).filter(h => !existingNames.has(h.name));
      return [...prev, ...newHardware];
    });

    setDrumKits(prev => {
      const existingNames = new Set(prev.map(h => h.name));
      const newKits = (gear.drumKits || []).filter(h => !existingNames.has(h.name));
      return [...prev, ...newKits];
    });

    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 2000);
  };

  const handleExportFullSave = () => {
    const saveFile: FullSaveFile = {
      version: "1.0",
      timestamp: Date.now(),
      userProfile: {
        name: user?.name || "BeatGangsta Producer",
        photo: user?.photo || ""
      },
      gear: {
        plugins,
        analogInstruments,
        analogHardware,
        drumKits,
        starredPlugins,
        starredHardware,
        deletedPlugins,
        deletedInstruments,
        deletedHardware
      },
      vault: {
        recipes: vault,
        folders
      },
      receipts,
      ui: {
        theme,
        grillStyle,
        knifeStyle,
        duragStyle,
        pendantStyle,
        chainStyle,
        saberColor,
        mascotColor,
        showChain,
        highEyes,
        isCigarEquipped,
        isTossingCigar,
        showSparkles,
        stemTypesPreset,
        stemCustomTypesPreset
      }
    };

    const blob = new Blob([JSON.stringify(saveFile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beatgangsta_save_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFullSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        
        // Simple validation
        if (parsed.version && parsed.gear && parsed.vault && parsed.ui) {
          setImportedSaveFile(parsed as FullSaveFile);
          setShowImportDecisionModal(true);
          setShowRigUI(false);
        } else {
          setError("Invalid save file format.");
        }
      } catch (err) {
        setError("Could not read save file.");
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleRestoreSettings = () => {
    if (!importedSaveFile) return;

    // Restore Gear
    setPlugins(importedSaveFile.gear.plugins || (importedSaveFile.gear as any).library || []);
    setSearchTerm('');
    setSelectedFolder(null);
    setIsEnrichingLibrary(false);
    setAnalogInstruments(importedSaveFile.gear.analogInstruments || []);
    setAnalogHardware(importedSaveFile.gear.analogHardware || []);
    setDrumKits(importedSaveFile.gear.drumKits || []);
    setStarredPlugins(importedSaveFile.gear.starredPlugins || []);
    setStarredHardware(importedSaveFile.gear.starredHardware || []);
    setDeletedPlugins(importedSaveFile.gear.deletedPlugins || []);
    setDeletedInstruments(importedSaveFile.gear.deletedInstruments || []);
    setDeletedHardware(importedSaveFile.gear.deletedHardware || []);

    // Restore Vault
    setVault(importedSaveFile.vault.recipes || []);
    setSavedCritiques(importedSaveFile.vault.critiques || []);
    setFolders(importedSaveFile.vault.folders || []);
    setReceipts(importedSaveFile.receipts || []);

    // Restore UI
    setTheme(importedSaveFile.ui.theme);
    setGrillStyle(importedSaveFile.ui.grillStyle);
    setKnifeStyle(importedSaveFile.ui.knifeStyle);
    setDuragStyle(importedSaveFile.ui.duragStyle);
    setPendantStyle(importedSaveFile.ui.pendantStyle);
    setChainStyle(importedSaveFile.ui.chainStyle);
    setSaberColor(importedSaveFile.ui.saberColor);
    setMascotColor(importedSaveFile.ui.mascotColor || '#3b82f6');
    setShowChain(importedSaveFile.ui.showChain);
    setHighEyes(importedSaveFile.ui.highEyes);
    setIsCigarEquipped(importedSaveFile.ui.isCigarEquipped);
    setIsTossingCigar(importedSaveFile.ui.isTossingCigar);
    setShowSparkles(importedSaveFile.ui.showSparkles);
    if (importedSaveFile.ui.stemTypesPreset) {
      setStemTypesPreset(importedSaveFile.ui.stemTypesPreset);
      setStems(prev => prev.map((s, i) => ({ ...s, type: importedSaveFile.ui.stemTypesPreset[i] || 'Other' })));
    }
    if (importedSaveFile.ui.stemCustomTypesPreset) {
      setStemCustomTypesPreset(importedSaveFile.ui.stemCustomTypesPreset);
      setStems(prev => prev.map((s, i) => ({ ...s, customType: importedSaveFile.ui.stemCustomTypesPreset[i] || '' })));
    }

    // Close modal and clear imported file
    setImportedSaveFile(null);
    setShowImportDecisionModal(false);
    setShowBrandMenu(false);
    setShowRigUI(false);
    
    // Show confirmation and focus search
    setShowBackupRestored(true);
    setHasRestoredBackup(true);

    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowBackupRestored(false);
    }, 3000);
  };

  const handleCompareWithFriend = () => {
    setFriendMode(true);
    setShowImportDecisionModal(false);
    setShowVault(true); // Open vault to show friend's data
  };

  const handleReplicateRecipe = async (recipe: SavedRecipe) => {
    if (!requireAuth()) return;
    setLoading(true);
    const progressInterval = simulateGenerationProgress(getEstimatedSeconds('replicate'));
    try {
      const replicated = await replicateRecipeWithUserGear(recipe, plugins, i18n.language);
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      logReceipt('Reimagine Recipe', 2);
      
      setVault(prev => [replicated, ...prev]);
      setLoading(false);
      // Maybe show a success message or open the new recipe
      setViewingRecipe(replicated);
      setShowFairy(true);
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error("Replication failed", err);
      const msg = err.message || 'Unknown error';
      setError(`Reimagine Error: ${msg}`);
      setLoading(false);
    }
  };

  const removeFromVault = (id: string) => {
    setVault(vault.filter(r => r.id !== id));
  };

  const removeFromSavedCritique = (id: string) => {
    setSavedCritiques(savedCritiques.filter(c => c.id !== id));
  };

  const updateVaultColor = (id: string, color: string) => {
    setVault(vault.map(r => r.id === id ? { ...r, bubbleColor: color } : r));
  };

  const updateVaultFolder = (id: string, folderId: string) => {
    setVault(vault.map(r => r.id === id ? { ...r, folderId: folderId || undefined } : r));
  };

  const addFolder = (name: string) => {
    const newFolder: Folder = { 
      id: Math.random().toString(36).substr(2, 9), 
      name,
      color: '#0ea5e9'
    };
    setFolders([...folders, newFolder]);
  };

  const removeFolder = (id: string) => {
    setFolders(folders.filter(f => f.id !== id));
    setVault(vault.map(r => r.folderId === id ? { ...r, folderId: undefined } : r));
  };

  const updateFolderColor = (id: string, color: string) => {
    setFolders(folders.map(f => f.id === id ? { ...f, color } : f));
  };

  const cycleGrill = () => {
    const styles: GrillStyle[] = ['diamond', 'aquabberry-diamond', 'gold', 'opal', 'rose-gold', 'blue-diamond'];
    const currentIdx = styles.indexOf(grillStyle);
    const nextIdx = (currentIdx + 1) % styles.length;
    const nextGrill = styles[nextIdx];
    setGrillStyle(nextGrill);
    
    // Reset special rags when switching grills
    if (nextGrill !== 'aquabberry-diamond' && duragStyle === 'royal-green') {
      setDuragStyle('standard');
    }
    if (!m_act && nextGrill !== 'opal' && duragStyle.startsWith('dragonball-')) {
      setDuragStyle('standard');
    }
  };

  const cycleKnife = () => {
    const styles: KnifeStyle[] = ['standard', 'gold', 'bloody', 'adamant', 'mythril'];
    if (h_act) {
      styles.push('samuels-saber', 'steak-knife');
    }
    if (m_act) {
      styles.push('dark-saber');
    }
    const currentIdx = styles.indexOf(knifeStyle);
    const nextIdx = (currentIdx + 1) % styles.length;
    setKnifeStyle(styles[nextIdx]);
  };

  const cycleDurag = () => {
    const styles: DuragStyle[] = ['standard', 'royal-green'];
    if (h_act) {
      // Hustle mode styles
    }
    if (m_act) {
      styles.push('sound-ninja', 'dragonball-purple');
    }
    if (c_act) {
      styles.push('chef-hat');
    }
    if (highEyes) {
      styles.push('rasta');
    }
    const currentIdx = styles.indexOf(duragStyle);
    const nextIdx = (currentIdx + 1) % styles.length;
    setDuragStyle(styles[nextIdx]);
  };


  const allActivePlugins = useMemo(() => {
    return plugins.filter(p => p.type !== 'Studio One Function');
  }, [plugins]);

  const filteredXpandPresets = useMemo(() => {
    let filtered = xpandPresets;

    if (xpandSearch) {
      const searchLower = xpandSearch.toLowerCase();
      filtered = filtered.filter(p => p.preset_name.toLowerCase().includes(searchLower) || p.category.toLowerCase().includes(searchLower));
    }

    if (xpandCategoryFilter !== 'All') {
      if (xpandCategoryFilter === 'Owned') {
        filtered = filtered.filter(p => p.is_owned);
      } else if (xpandCategoryFilter === 'Unowned') {
        filtered = filtered.filter(p => !p.is_owned);
      } else {
        filtered = filtered.filter(p => p.category === xpandCategoryFilter);
      }
    }

    return filtered;
  }, [xpandPresets, xpandSearch, xpandCategoryFilter]);

  const filteredPlugins = useMemo(() => {
    let filtered = allActivePlugins;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFolder) {
      filtered = filtered.filter(p => 
        sortBy === 'vendor' ? p.vendor === selectedFolder : p.type === selectedFolder
      );
    }

    filtered.sort((a, b) => {
      const aFav = starredPlugins.includes(a.name);
      const bFav = starredPlugins.includes(b.name);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      if (sortBy === 'vendor') {
        return a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name);
      } else if (sortBy === 'type') {
        return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [plugins, searchTerm, sortBy, starredPlugins, selectedFolder]);

  const groupedPlugins = useMemo(() => {
    if (sortBy === 'name') return null;
    
    let filtered = allActivePlugins;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const groups: Record<string, VSTPlugin[]> = {};
    filtered.forEach(p => {
      const key = sortBy === 'vendor' ? p.vendor : p.type;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });

    // Sort groups by key
    return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)));
  }, [plugins, searchTerm, sortBy]);

  const userOwnedJsfx = useMemo(() => {
    return JSFX_DATABASE.filter(p => {
      if (!p.packRequired) return true;
      return installedJsfxPacks.includes(p.packRequired);
    });
  }, [installedJsfxPacks]);

  const filteredJsfx = useMemo(() => {
    let filtered = userOwnedJsfx;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.packRequired || "Cockos (Built-in)").toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFolder) {
      filtered = filtered.filter(p => 
        sortBy === 'vendor' 
          ? (p.packRequired || "Cockos (Built-in)") === selectedFolder 
          : p.category === selectedFolder
      );
    }

    // Sort by: Favorite first, then alphabetical
    filtered = [...filtered].sort((a, b) => {
      const aFav = starredPlugins.includes(a.name);
      const bFav = starredPlugins.includes(b.name);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [userOwnedJsfx, searchTerm, sortBy, starredPlugins, selectedFolder]);

  const groupedJsfx = useMemo(() => {
    if (sortBy === 'name') return null;

    let filtered = userOwnedJsfx;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.packRequired || "Cockos (Built-in)").toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const groups: Record<string, typeof JSFX_DATABASE> = {};
    filtered.forEach(p => {
      const key = sortBy === 'vendor' ? (p.packRequired || "Cockos (Built-in)") : p.category;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });

    return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)));
  }, [userOwnedJsfx, searchTerm, sortBy]);

  const parsePlugins = async (input: string) => {
    if (!requireAuth()) return;
    if (!input.trim()) return;
    const lines = input.trim().split(/\r?\n|\r/);
    const isReaperIni = lines.some(l => !l.trim().startsWith('<') && /^[^=]+\.(dll|vst3)=/i.test(l.trim()));
    const isMixcraftXml = input.includes('<VSTPlugins>') || input.includes('<Plugin ') || input.includes('<vst-inventory>') || input.includes('<PreSonus>') || input.includes('<Components>') || input.includes('<Component ') || input.includes('<?xml') || input.includes('<Settings>') || input.includes('<ClassDescription') || input.includes('<Attributes');
    const isReasonLog = input.includes('Reason Log') || lines.some(l => l.includes('Discovering VST') || l.includes('Created VST3 plugin') || l.includes('Loading VST3 plugin') || l.includes('Created VST plugin'));
    let parsed: VSTPlugin[] = [];

    const isJunkName = (n: string | undefined | null, cleanID?: string): boolean => {
      if (!n) return true;
      const trimmed = n.trim();
      const lower = trimmed.toLowerCase();
      if (trimmed.startsWith('{') || trimmed.endsWith('}')) return true;
      if (trimmed.startsWith('$')) return true;
      // GUID / Unique ID hex strings checks
      if (/^[a-fA-F0-9-]{12,}$/.test(trimmed)) return true;
      if (/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/i.test(trimmed)) return true;
      if (/^[0-9]+[A-Za-z]+ /i.test(trimmed)) return true; // e.g. "355sine play"
      if (/^[0-9]{1,3}AU/i.test(trimmed)) return true; // e.g. "2AU..."
      if (lower.includes('metaclass')) return true;
      if (lower.includes('classdescription')) return true;
      if (lower.includes('component')) return true;
      if (lower.includes('template')) return true;
      if (lower.includes('handler')) return true;
      if (lower.includes('importer')) return true;
      if (lower.includes('service')) return true;
      if (lower.includes('statics')) return true;
      if (lower === 'vst' || lower === 'vst3' || lower === 'au' || lower === 'vst' || lower === 'vst2' || lower === 'vst2.4') return true;
      if (cleanID && trimmed.toLowerCase() === cleanID.toLowerCase().replace(/[{}-]/g, '').trim()) return true;
      return false;
    };

    const isJunkCategory = (c: string | undefined | null): boolean => {
      if (!c) return false;
      const cl = c.toLowerCase().trim();
      // Only truly useless or internal engine noise that shouldn't even be automation targets
      return cl === 'metaclass' || 
             cl === 'gadget' || 
             cl === 'documentfilter' || 
             cl === 'scriptengine' || 
             cl === 'deviceenumerator' || 
             cl === 'browserextension' || 
             cl === 'databaseengine' || 
             cl === 'coderesourceloader' || 
             cl === 'useroption' || 
             cl === 'helptutorialhandler' || 
             cl === 'documenteventhandler' || 
             cl === 'application' ||
             cl.includes('importer') || 
             cl.includes('enumerator');
    };

    const isStudioOneFunction = (c: string | undefined | null): boolean => {
      if (!c) return false;
      const cl = c.toLowerCase().trim();
      return cl === 'edittask' || 
             cl === 'trackedit' || 
             cl === 'audioedit' || 
             cl === 'musicedit' || 
             cl === 'eventedit' || 
             cl === 'projectedit' || 
             cl === 'showedit' || 
             cl === 'musicpartedit' || 
             cl === 'toolset' || 
             cl === 'audiostretch' || 
             cl === 'audioresampler' || 
             cl === 'audiorateconverter' || 
             cl === 'audiopanner' || 
             cl === 'audiocodec' || 
             cl === 'audioretune' || 
             cl === 'programservice' || 
             cl === 'frameworkservice' || 
             cl === 'userservice' || 
             cl === 'editaddin' || 
             cl === 'extensionhandler' ||
             cl === 'statics' ||
             cl === 'enumerator' ||
             cl === 'provider' ||
             cl === 'model' ||
             cl === 'template' ||
             cl === 'worker' ||
             cl === 'bridge' ||
             cl === 'helper' ||
             cl === 'executor' ||
             cl === 'manager' ||
             cl.includes('analysis process') || 
             cl.includes('handler') || 
             cl.includes('service') || 
             cl.includes('component') ||
             cl.includes('converter') || 
             cl.includes('utility') ||
             cl.includes('statics') ||
             cl.includes('factory');
    };

    const getPluginType = (category: string | undefined | null, sortPath: string | undefined | null, isVst3: boolean = false): string => {
      if (isStudioOneFunction(category)) return 'Studio One Function';
      
      const isMidi = category?.toLowerCase().includes('midi') || sortPath?.toLowerCase().includes('midi');
      const isInstrument = category?.toLowerCase() === 'audiosynth' || sortPath?.toLowerCase().includes('synth') || sortPath?.toLowerCase().includes('instrument') || category?.toLowerCase().includes('synth');
      const isEffect = category?.toLowerCase().includes('effect') || sortPath?.toLowerCase().includes('effect');
      
      let baseType = 'AudioEffect';
      if (isInstrument) baseType = 'Instruments';
      else if (isMidi) baseType = 'MIDI';
      
      const format = isVst3 ? ' (VST3)' : 
                     (category?.toLowerCase().includes('vst2') || sortPath?.toLowerCase().includes('vst2')) ? ' (VST2)' : '';
      
      return baseType + format;
    };

    // Helper functions for matching
    const cleanStringForMatching = (s: string): string => {
      // Remove trailing (n) suffix often added by hosts for duplicates or VST3 vs VST2
      const stripped = s.replace(/\s\(\d+\)$/, '').trim();
      return stripped.toLowerCase().replace(/[^a-z0-9]/g, '');
    };

    const KNOWN_VST3_IDS: Record<string, string> = {
      // FabFilter
      "pro-q 3": "72C4DB71-7A4D-459A-B97E-51745D84B39D",
      "pro-q3": "72C4DB71-7A4D-459A-B97E-51745D84B39D",
      "pro q 3": "72C4DB71-7A4D-459A-B97E-51745D84B39D",
      "pro-c 2": "72C4DB71-7A4D-459A-B97E-51744D666332",
      "pro-c2": "72C4DB71-7A4D-459A-B97E-51744D666332",
      "pro c 2": "72C4DB71-7A4D-459A-B97E-51744D666332",
      "pro-ds": "72C4DB71-7A4D-459A-B97E-51744D666473",
      "pro ds": "72C4DB71-7A4D-459A-B97E-51744D666473",
      "pro-l 2": "72C4DB71-7A4D-459A-B97E-51744D666c32",
      "pro-l2": "72C4DB71-7A4D-459A-B97E-51744D666c32",
      "pro l 2": "72C4DB71-7A4D-459A-B97E-51744D666c32",
      "pro-r 2": "72C4DB71-7A4D-459A-B97E-51744D667232",
      "pro-r2": "72C4DB71-7A4D-459A-B97E-51744D667232",
      "pro r 2": "72C4DB71-7A4D-459A-B97E-51744D667232",
      "saturn 2": "72C4DB71-7A4D-459A-B97E-51744D736132",
      "saturn2": "72C4DB71-7A4D-459A-B97E-51744D736132",
      
      // Soundtoys
      "decapitator": "F2AEE70D-00DE-4F4E-536E-645447446370",
      "microshift": "F2AEE70D-00DE-4F4E-536E-6454474d6373",
      
      // oeksound
      "soothe2": "F2AEE70D-00DE-4F4E-536E-645447537468",
      "soothe 2": "F2AEE70D-00DE-4F4E-536E-645447537468",
      
      // Soundtheory
      "gullfoss": "F2AEE70D-00DE-4F4E-536E-6454474C4653",
      "gullfoss live": "F2AEE70D-00DE-4F4E-536E-6454474C466D",
      "gullfoss master": "F2AEE70D-00DE-4F4E-536E-6454474C466C",

      // Valhalla
      "valhallavintageverb": "56535456-5652-4276-616c-68616c6c6176",
      "vintageverb": "56535456-5652-4276-616c-68616c6c6176",
      "vintage verb": "56535456-5652-4276-616c-68616c6c6176",
      "valhalladelay": "56535456-444c-5976-616c-68616c6c6164",
      "valhalla delay": "56535456-444c-5976-616c-68616c6c6164",

      // Waves
      "cla-76": "56535443-3736-5377-6176-65737368656c",
      "cla76": "56535443-3736-5377-6176-65737368656c",
      "cla-2a": "56535443-3241-5377-6176-65737368656c",
      "cla2a": "56535443-3241-5377-6176-65737368656c",

      // PreSonus Native
      "ampire": "B6407C28-0F92-4538-9E7F-9B867B3FEA74",
      "fat channel": "5E91DC8A-E560-4115-98FA-59FB3F215BA1",
      "pedalboard": "BC9129B4-EC67-41B8-96DE-EC128D5FE54D",
      "tuner": "4F748A80-0D49-4E8A-A558-B120D824512B",
      "pro eq": "073C4094-E062-4FB5-8328-74608DD1A3A4",
      "compressor": "54F19B72-352C-4AA5-A2AF-67F86F30D6BE",
      "limiter": "61B18D53-26FA-4220-8614-89944A1990EC",

      // Universal Audio (UADx / Spark VST3s)
      "uaudio_manley_massive_passive": "ABCDEF01-9182-FAEB-5541-447855333931",
      "uaudio_teletronix_la-2": "5541444C-4132-4153-0000-000000000000",
      "uaudio_ua_1176ln_rev_e": "56535458-3941-5575-6164-207561203131",
      "ua 1176ln rev e": "56535458-3941-5575-6164-207561203131",
      "uad ua 1176ln rev e": "56535458-3941-5575-6164-207561203131",
      "1176ln rev e": "56535458-3941-5575-6164-207561203131",
      "uad 1176ln rev e": "56535458-3941-5575-6164-207561203131",
      "teletronix la-2a silver": "ABCDEF01-9182-FAEB-5541-447855334139",
      "teletronix la-2a gray": "5541444C-4132-4147-0000-000000000000",
      "1176se rev e": "5541444C-3131-3753-0000-000000000000",
      "uaudio_manley_voxbox": "ABCDEF01-9182-FAEB-5541-447855334250",
      "uaudio_api_2500": "ABCDEF01-9182-FAEB-5541-447855334255",
      "uaudio_neve_1073": "ABCDEF01-9182-FAEB-5541-44785533415A",
      "uaudio_pultec_eqp-1a": "ABCDEF01-9182-FAEB-5541-44785533414E",
      "uaudio_hitsville_eq": "ABCDEF01-9182-FAEB-5541-447855334241",
      "uaudio_capitol_chambers": "ABCDEF01-9182-FAEB-5541-447855334137",
      "uaudio_pure_plate": "ABCDEF01-9182-FAEB-5541-447855334131",
      "uaudio_studer_a800": "ABCDEF01-9182-FAEB-5541-447855334136",
      "la-2a": "ABCDEF01-9182-FAEB-5541-447855334135",
      "1176ln": "ABCDEF01-9182-FAEB-5541-447855333958",
      "pultec eqp-1a": "ABCDEF01-9182-FAEB-5541-44785533414E",
      "massive passive": "ABCDEF01-9182-FAEB-5541-447855333931",
      "la-2": "ABCDEF01-9182-FAEB-5541-447855334135",
      "teletronix la-2": "ABCDEF01-9182-FAEB-5541-447855334135",
      "teletronix la-2a": "ABCDEF01-9182-FAEB-5541-447855334135",
      "uad teletronix la-2a": "ABCDEF01-9182-FAEB-5541-447855334135",
      "uadx la-2 compressor": "ABCDEF01-9182-FAEB-5541-447855334135",
      "uadx la-2a silver compressor": "ABCDEF01-9182-FAEB-5541-447855334139",
      "uadx fairchild 670 compressor": "ABCDEF01-9182-FAEB-5541-447855333939",
      "fairchild 670": "ABCDEF01-9182-FAEB-5541-447855333939",
      "quad fairchild 670": "ABCDEF01-9182-FAEB-5541-447855333939",

      // iZotope
      "ozone 10": "F2AEE70D-00DE-4F4E-5360-64544D6F6F7A",
      "ozone 11": "F2AEE70D-00DE-4F4E-5360-64544D6F6F7B",
      "neutron 4": "F2AEE70D-00DE-4F4E-5360-64544D6E6575",
      "neutron 4 unmask": "5653545A-4E55-5A4E-6575-74726F6E2050",
      "izotope neutron 4 unmask": "5653545A-4E55-5A4E-6575-74726F6E2050",
      "nectar 3": "F2AEE70D-00DE-4F4E-5360-64544D6E6563",
      "nectar 4": "F2AEE70D-00DE-4F4E-5360-64544D6E6564",
      "nectar 4 auto-level": "F2AEE70D-00DE-4F4E-5360-64544D6E6564",
      "vocal-synth 2": "F2AEE70D-00DE-4F4E-5360-64544D767332",
      "relay": "5653545A-524C-3152-656C-617900000000",
      "izotope relay": "5653545A-524C-3152-656C-617900000000",

      // XLN Audio
      "rc-20 retro color": "ABCDEF01-9182-FAEB-786C-6E4178615243",
      "rc-20": "ABCDEF01-9182-FAEB-786C-6E4178615243",
      "rc20": "ABCDEF01-9182-FAEB-786C-6E4178615243",
      "retro color": "ABCDEF01-9182-FAEB-786C-6E4178615243",
      "xln audio rc-20 retro color": "ABCDEF01-9182-FAEB-786C-6E4178615243",
      
      // Instruments
      "serum": "56535458-6d4e-7973-6572-756d78363400",
      "nexus": "5653544e-5853-336e-6578-757373706163",
      "omnisphere": "5653544f-5048-526f-6d65-6e6973706865",
      "kontakt": "5653544e-694f-386b-6f6e-74616b743800",
      "kontakt 7": "5653544E-694B-376B-6F6E-74616B742037",
      "kontakt 8": "5653544e-694f-386b-6f6e-74616b743800",
      "sublab": "56535453-4c41-4273-7562-6c6162767374",
      "keyszone classic": "5653544b-5a43-4c6b-6579-737a6f6e6563"
    };

    interface XMLPluginInfo {
      classID: string;
      cleanID: string;
      sortPath?: string;
      name?: string;
      vendor?: string;
      category?: string;
      decodedName: string | null;
      _matched?: boolean;
    }

    if (isReasonLog) {
      const detected: VSTPlugin[] = [];
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        let name: string | null = null;
        let isVst3 = false;
        
        const createdMatch = trimmed.match(/(?:Created VST3 plugin|Created VST plugin|Discovering VST|Discovering VST3|Loading VST3 plugin):\s*([^\r\n]+)/i);
        if (createdMatch) {
          const matchedText = createdMatch[1].trim();
          isVst3 = trimmed.toLowerCase().includes('vst3');
          
          if (matchedText.includes('\\') || matchedText.includes('/')) {
            const parts = matchedText.split(/[\\/]/);
            const filename = parts[parts.length - 1];
            name = filename.replace(/\.(dll|vst3|component)$/i, '').trim();
          } else {
            name = matchedText;
          }
        } else if (trimmed.includes('Loading plugin')) {
          const match = trimmed.match(/Loading plugin\s+([^\r\n]+)/i);
          if (match) {
            name = match[1].trim();
          }
        }
        
        if (name && !isJunkName(name)) {
          name = name.replace(/\(vst3\)$/i, '').replace(/\(vst2\)$/i, '').trim();
          detected.push({
            vendor: 'Unknown',
            name: name,
            type: isVst3 ? 'VST3' : 'VST',
            version: 'N/A',
            lastModified: 'Reason Log',
          });
        }
      }
      
      const seen = new Set<string>();
      parsed = detected.filter(p => {
        const key = p.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } else if (isReaperIni) {
      parsed = lines.map((line): VSTPlugin | null => {
        if (!line.includes('=')) return null;
        const [filename, rest] = line.split('=');
        if (!rest) return null;
        const parts = rest.split(',');
        const displayName = parts[2] || filename;
        const vendorMatch = displayName.match(/\(([^)]+)\)/);
        const vendor = vendorMatch ? vendorMatch[1] : 'Unknown';
        const name = displayName.split('(')[0].trim();
        return {
          vendor,
          name,
          type: filename.toLowerCase().includes('vst3') ? 'VST3' : 'VST2',
          version: 'N/A',
          lastModified: 'Found in INI',
          id: parts[0]?.trim(),
        };
      }).filter((p): p is VSTPlugin => p !== null && p.name !== '');
    } else if (isMixcraftXml) {
      // General XML / Studio One settings parsing
      const xmlPluginInfos: {
        classID: string;
        cleanID: string;
        sortPath?: string;
        name?: string;
        vendor?: string;
        category?: string;
        subCategory?: string;
        decodedName?: string | null;
        _matched?: boolean;
      }[] = [];
      // Use a more robust regex for tags that might span multiple lines
      const tagMatches = input.matchAll(/<([a-zA-Z0-9_-]+)\s+([^>]+)>/gi);
      let currentVendor: string | undefined;
      
      for (const match of tagMatches) {
        const tagName = match[1].toLowerCase();
        const attrText = match[2];
        const classIDMatch = attrText.match(/(?:classID|classId|cid|uid|id|uuid|uniqueID)="([^"]+)"/i);
        const nameMatch = attrText.match(/\s+name="([^"]+)"/i);
        const vendorMatch = attrText.match(/(?:vendor|manufacturer|developer|publisher)="([^"]+)"/i);
        const categoryMatch = attrText.match(/(?:category|type|subCategory|categoryName)="([^"]+)"/i);
        const subCategoryMatch = attrText.match(/subCategory="([^"]+)"/i);
        const sortPathMatch = attrText.match(/sortPath="([^"]+)"/i);
        const pluginNameMatch = attrText.match(/pluginName="([^"]+)"/i);
        const publicNameMatch = attrText.match(/publicName="([^"]+)"/i);
        const hostNameMatch = attrText.match(/hostName="([^"]+)"/i);

        if (vendorMatch) {
          currentVendor = vendorMatch[1];
        } else if (sortPathMatch && sortPathMatch[1].includes('/')) {
          currentVendor = sortPathMatch[1].split('/')[0];
        }
        
        if (classIDMatch) {
          const classID = classIDMatch[1];
          const cleanID = classID.replace(/[{}]/g, '').trim();
          let decodedName: string | null = null;
          const cleanHex = cleanID.replace(/-/g, '').toLowerCase();
          
          if (cleanHex.startsWith('565354')) {
            let decoded = '';
            // Skip "VST" prefix (6 hex chars) and VST2 Unique ID (8 hex chars), starting name decode at index 14
            for (let i = 14; i < cleanHex.length; i += 2) {
              const byteStr = cleanHex.substring(i, i + 2);
              const code = parseInt(byteStr, 16);
              if (code === 0) continue;
              if (code >= 32 && code <= 126) {
                decoded += String.fromCharCode(code);
              }
            }
            decoded = decoded.trim();
            if (decoded) {
              decodedName = decoded;
            }
          }
          
          xmlPluginInfos.push({
            classID,
            cleanID,
            sortPath: sortPathMatch ? sortPathMatch[1] : undefined,
            name: nameMatch ? nameMatch[1] : (publicNameMatch ? publicNameMatch[1] : (hostNameMatch ? hostNameMatch[1] : (pluginNameMatch ? pluginNameMatch[1] : undefined))),
            vendor: currentVendor,
            category: categoryMatch ? categoryMatch[1] : undefined,
            subCategory: subCategoryMatch ? subCategoryMatch[1] : undefined,
            decodedName,
          });
        }
      }

      // Separate lines that look like CSV entries
      const csvLines = lines.filter(line => {
        const trimmed = line.trim().replace(/^\uFEFF/, ''); // Remove BOM if present
        if (!trimmed) return false;
        // Skip obvious XML structure rows - be very strict here
        if (trimmed.startsWith('<') || trimmed.startsWith('?') || trimmed.startsWith('/') || trimmed.startsWith(']') || trimmed.startsWith('!') || trimmed.startsWith('<?')) {
          return false;
        }
        // Must have at least a few commas to be a valid CSV line, and not be XML attributes
        const parts = trimmed.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        // Be more lenient for CSV entries that might have been detected as XML if they contain commas
        // but ensure we don't pick up single XML tags that aren't plugin entries.
        return parts.length >= 2 && !trimmed.toLowerCase().includes('xmlns=') && (trimmed.includes(',') || trimmed.includes('\t')) && !trimmed.includes('<?xml');
      });

      const csvParsed: VSTPlugin[] = [];
      
      csvLines.forEach(line => {
        const trimmedLine = line.trim().replace(/^\uFEFF/, '');
        // Skip header lines that might appear multiple times if files were concatenated
        const lower = trimmedLine.toLowerCase();
        if (lower.startsWith('vendor,name') || lower.startsWith('"vendor","name"')) {
          return;
        }

        const parts = trimmedLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length >= 2) {
          csvParsed.push({
            vendor: parts[0]?.replace(/"/g, '').trim() || 'Unknown',
            name: parts[1]?.replace(/"/g, '').trim() || 'Unknown',
            type: parts[2]?.replace(/"/g, '').trim() || 'Unknown',
            version: parts[3]?.replace(/"/g, '').trim() || 'Unknown',
            lastModified: parts[4]?.replace(/"/g, '').trim() || 'Unknown',
          });
        }
      });

      // Try matching the parsed CSV lines with the XML classIDs
      if (xmlPluginInfos.length > 0) {
        if (csvParsed.length > 0) {
          csvParsed.forEach(plugin => {
            const cleanCsvName = cleanStringForMatching(plugin.name);
            
            // Heuristic 1: Priority matching of human-readable name or sortPath before fallback decoded hex value
            let matchedXml = xmlPluginInfos.find(info => {
              let infoName = "";
              if (info.name && !isJunkName(info.name, info.cleanID)) {
                infoName = info.name;
              } else if (info.sortPath && info.sortPath.includes('/')) {
                const lastPart = info.sortPath.split('/').pop() || "";
                if (!isJunkName(lastPart, info.cleanID)) {
                  infoName = lastPart;
                }
              }
              if (!infoName && info.decodedName && !isJunkName(info.decodedName, info.cleanID)) {
                infoName = info.decodedName;
              }

              if (!infoName) return false;
              const cleanInfoName = cleanStringForMatching(infoName);
              return cleanCsvName === cleanInfoName || 
                     (cleanInfoName.length >= 4 && cleanCsvName.includes(cleanInfoName)) ||
                     (cleanCsvName.length >= 4 && cleanInfoName.includes(cleanCsvName));
            });

            // Heuristic 1.5: Match via sortPath (highly accurate for VST3 plug-ins!)
            if (!matchedXml && xmlPluginInfos.length > 0) {
              matchedXml = xmlPluginInfos.find(info => {
                if (!info.sortPath) return false;
                const pathParts = info.sortPath.split('/');
                const lastPart = pathParts[pathParts.length - 1]; // e.g. "Pro-Q 3" from "FabFilter/Pro-Q 3"
                const cleanSortName = cleanStringForMatching(lastPart);
                return cleanCsvName === cleanSortName || 
                       (cleanSortName.length >= 4 && cleanCsvName.includes(cleanSortName)) ||
                       (cleanCsvName.length >= 4 && cleanSortName.includes(cleanCsvName));
              });
            }

            if (matchedXml) {
              plugin.id = matchedXml.cleanID;
              if (matchedXml.category) plugin.category = matchedXml.category;
              if (matchedXml.sortPath) (plugin as any).sortPath = matchedXml.sortPath;
              matchedXml._matched = true;
            } else {
              // Heuristic 2: Known heavy VST3 IDs dictionary
              const knownId = KNOWN_VST3_IDS[plugin.name.toLowerCase()];
              if (knownId) {
                const xmlWithId = xmlPluginInfos.find(info => info.cleanID.toLowerCase() === knownId.toLowerCase().replace(/[{}]/g, ''));
                if (xmlWithId) {
                  plugin.id = xmlWithId.cleanID;
                  xmlWithId._matched = true;
                }
              }
            }
          });

          // Any unassigned XML items that look like products can be added as standalone
          const unassignedXmlProducts: VSTPlugin[] = [];
          const seenCleanIDs = new Set<string>();
          csvParsed.forEach(p => {
            if (p.id) {
              seenCleanIDs.add(p.id.toLowerCase().replace(/[{}-]/g, '').trim());
            }
          });

          xmlPluginInfos.forEach(info => {
            if (info.category && isJunkCategory(info.category)) return;

            const normID = info.cleanID.toLowerCase().replace(/[{}-]/g, '').trim();
            if (seenCleanIDs.has(normID)) {
              return; // Already matched, skip duplicate!
            }

            let displayName = "";
            if (info.name && !isJunkName(info.name, info.cleanID)) {
              displayName = info.name;
            } else if (info.sortPath && info.sortPath.includes('/')) {
              const lastPart = info.sortPath.split('/').pop() || "";
              if (!isJunkName(lastPart, info.cleanID)) {
                displayName = lastPart;
              }
            }
            if (!displayName && info.decodedName && !isJunkName(info.decodedName, info.cleanID)) {
              displayName = info.decodedName;
            }

            if (!info._matched && displayName && !isJunkName(displayName, info.cleanID) && displayName.length >= 3 && !displayName.includes('.') && info.cleanID.length > 10) {
              const infoCategory = info.category || info.subCategory;
              if (isStudioOneFunction(infoCategory)) return;

              seenCleanIDs.add(normID);
              const isVst3Val = info.subCategory?.toUpperCase().includes('VST3') || info.sortPath?.toLowerCase().includes('.vst3') || false;
              const newPlugin: VSTPlugin = {
                vendor: info.vendor || info.sortPath?.split('/')[0] || 'Unknown',
                name: displayName,
                type: getPluginType(infoCategory, info.sortPath, isVst3Val),
                version: 'N/A',
                lastModified: 'Found in settings XML',
                id: info.cleanID,
                category: infoCategory
              };
              if (info.sortPath) (newPlugin as any).sortPath = info.sortPath;
              unassignedXmlProducts.push(newPlugin);
            }
          });

          parsed = [...csvParsed, ...unassignedXmlProducts];
        } else {
          // No CSV lines found, only parsed XML. Let's try merging into existing library plugins first!
          if (plugins.length > 0) {
            let mergedCount = 0;
            const updatedPlugins = plugins.map(p => {
              if (p.id) return p;
              const cleanName = cleanStringForMatching(p.name);
              
              const matchedXml = xmlPluginInfos.find(info => {
                if (info.name && !isJunkName(info.name, info.cleanID)) {
                  const cleanInfoName = cleanStringForMatching(info.name);
                  if (cleanName === cleanInfoName || 
                         (cleanInfoName.length >= 4 && cleanName.includes(cleanInfoName)) ||
                         (cleanName.length >= 4 && cleanInfoName.includes(cleanName))) {
                    return true;
                  }
                }
                if (info.sortPath) {
                  const parts = info.sortPath.split('/');
                  const lastPart = parts[parts.length - 1]; // e.g. "Pro-Q 3" from "FabFilter/Pro-Q 3"
                  const cleanSortName = cleanStringForMatching(lastPart);
                  if (cleanName === cleanSortName || 
                         (cleanSortName.length >= 4 && cleanName.includes(cleanSortName)) ||
                         (cleanName.length >= 4 && cleanSortName.includes(cleanName))) {
                    return true;
                  }
                }
                if (info.decodedName) {
                  const cleanDecoded = cleanStringForMatching(info.decodedName);
                  if (cleanName === cleanDecoded || 
                         (cleanDecoded.length >= 4 && cleanName.includes(cleanDecoded)) ||
                         (cleanName.length >= 4 && cleanDecoded.includes(cleanName))) {
                    return true;
                  }
                }
                return false;
              });

              if (matchedXml) {
                mergedCount++;
                return { ...p, id: matchedXml.cleanID };
              } else {
                const knownId = KNOWN_VST3_IDS[p.name.toLowerCase()];
                if (knownId) {
                  const xmlWithId = xmlPluginInfos.find(info => info.cleanID.toLowerCase() === knownId.toLowerCase().replace(/[{}]/g, ''));
                  if (xmlWithId) {
                    mergedCount++;
                    return { ...p, id: xmlWithId.cleanID };
                  }
                }
              }
              return p;
            });

            if (mergedCount > 0) {
              setPlugins(updatedPlugins);
              setError(null);
            }
          }

          // Directly list decoded XML plug-ins or those with a structural sortPath (supports VST3!)
          const seenCleanIDsOnly = new Set<string>();
          const currentPluginsPool = (plugins.length > 0) ? plugins : [];
          currentPluginsPool.forEach(p => {
            if (p.id) {
              seenCleanIDsOnly.add(p.id.toLowerCase().replace(/[{}-]/g, '').trim());
            }
          });
          
          parsed = xmlPluginInfos.reduce((acc, info) => {
            const infoCategory = info.category || info.subCategory;
            if (isJunkCategory(infoCategory) || isStudioOneFunction(infoCategory)) {
              return acc;
            }

            const normID = info.cleanID.toLowerCase().replace(/[{}-]/g, '').trim();
            if (seenCleanIDsOnly.has(normID)) {
              return acc;
            }

            let name = "";
            if (info.name && !isJunkName(info.name, info.cleanID)) {
              name = info.name;
            } else if (info.sortPath && info.sortPath.includes('/')) {
              const lastPart = info.sortPath.split('/').pop() || "";
              if (!isJunkName(lastPart, info.cleanID)) {
                name = lastPart;
              }
            }
            if (!name && info.decodedName && !isJunkName(info.decodedName, info.cleanID)) {
              name = info.decodedName;
            }
            if (!name || isJunkName(name, info.cleanID)) {
              return acc;
            }

            seenCleanIDsOnly.add(normID);

            let vendor = info.vendor || 'Unknown';
            if (info.sortPath) {
              const parts = info.sortPath.split('/');
              if (parts.length > 1 && vendor === 'Unknown') {
                vendor = parts.slice(0, -1).join('/') || vendor;
              }
            }
            const isVst3Val = info.subCategory?.toUpperCase().includes('VST3') || info.sortPath?.toLowerCase().includes('.vst3') || false;
            const newObj: VSTPlugin = {
              vendor,
              name,
              type: getPluginType(infoCategory, info.sortPath, isVst3Val),
              version: 'N/A',
              lastModified: 'Settings XML',
              id: info.cleanID,
              category: infoCategory
            };
            if (info.sortPath) (newObj as any).sortPath = info.sortPath;
            acc.push(newObj);
            return acc;
          }, [] as VSTPlugin[]);
        }
      } else {
        // Fallback XML attribute parser
        const pluginMatches = input.matchAll(/<([a-zA-Z0-9_-]+)\s+([^>]+)>/gi);
        for (const match of pluginMatches) {
          const attrText = match[2];
          const nameMatch = attrText.match(/name="([^"]+)"/i);
          const vendorMatch = attrText.match(/(?:vendor|manufacturer|developer|publisher)="([^"]+)"/i);
          const idMatch = attrText.match(/(?:classID|classId|id|uniqueID|uniqueId|uid|uuid)="([^"]+)"/i);
          const typeMatch = attrText.match(/(?:type|category|pluginType)="([^"]+)"/i);
          const filenameMatch = attrText.match(/filename="([^"]+)"/i);
          
          if (typeMatch && isJunkCategory(typeMatch[1])) {
            continue;
          }

          if (nameMatch && !isJunkName(nameMatch[1])) {
            const filename = filenameMatch ? filenameMatch[1] : '';
            const rawType = typeMatch ? typeMatch[1] : '';
            const isVst3 = filename.toLowerCase().includes('vst3') || rawType.toLowerCase().includes('vst3') || attrText.toLowerCase().includes('vst3');
            parsed.push({
              name: nameMatch[1],
              vendor: vendorMatch ? vendorMatch[1] : 'Unknown',
              type: getPluginType(typeMatch ? typeMatch[1] : undefined, undefined, isVst3),
              version: 'N/A',
              lastModified: 'Found in XML',
              id: idMatch ? idMatch[1].replace(/[{}]/g, '').trim() : undefined,
              category: typeMatch ? typeMatch[1] : undefined
            });
          }
        }
      }
    } else {
      const startIndex = lines[0] && lines[0].toLowerCase().includes('vendor') ? 1 : 0;
      parsed = lines.slice(startIndex).map((line): VSTPlugin | null => {
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length >= 2) {
          const rawName = parts[1]?.replace(/"/g, '').trim() || 'Unknown';
          const rawVendor = parts[0]?.replace(/"/g, '').trim() || 'Unknown';
          const rawType = parts[2]?.replace(/"/g, '').trim() || 'Unknown';
          const rawVersion = parts[3]?.replace(/"/g, '').trim() || 'Unknown';
          const rawLastMod = parts[4]?.replace(/"/g, '').trim() || 'Unknown';
          
          let parsedId: string | undefined = undefined;
          for (const part of parts) {
            const cleanPart = part.replace(/[{}"]/g, '').trim();
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanPart) || /^[0-9a-f]{32}$/i.test(cleanPart) || /^[0-9a-f]{16}$/i.test(cleanPart)) {
              parsedId = cleanPart;
              break;
            }
          }

          return {
            vendor: rawVendor,
            name: rawName,
            type: rawType,
            version: rawVersion,
            lastModified: rawLastMod,
            id: parsedId
          };
        }
        
        const name = line.trim();
        if (!name) return null;
        
        let vendor = 'Unknown';
        let cleanName = name;
        if (name.includes(' - ')) {
          [vendor, cleanName] = name.split(' - ').map(s => s.trim());
        } else if (name.includes(': ')) {
          [vendor, cleanName] = name.split(': ').map(s => s.trim());
        }

        return {
          vendor,
          name: cleanName,
          type: 'Unknown',
          version: 'N/A',
          lastModified: 'Manual List',
        };
      }).filter((p): p is VSTPlugin => p !== null && p.name !== 'Unknown');
    }

    // Robust deduplication that prioritizes VST3 over VST2, and removes trailing "(m)" or "(Native)" duplicates
    const normalizeVendor = (v: string): string => {
      return (v || '').toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace('inc', '')
        .replace('limited', '')
        .replace('ltd', '')
        .replace('software', '')
        .trim();
    };

    const normalizeName = (n: string): string => {
      return (n || '').toLowerCase()
        .replace(/\(m\)$/i, '')
        .replace(/\(vst3\)$/i, '')
        .replace(/\(vst2\)$/i, '')
        .replace(/\(mono\)$/i, '')
        .replace(/\(stereo\)$/i, '')
        .replace(/\(native\)$/i, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
    };

    const getFormatScore = (p: VSTPlugin): number => {
      const t = (p.type || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      if (t.includes('vst3')) return 4;
      if (n.includes('vst3')) return 4;
      if (t.includes('au') || t.includes('audiounit')) return 3;
      if (t.includes('vst2') || t.includes('vst')) return 2;
      if (t.includes('native')) return 1.5;
      return 1;
    };

    const grouped = new Map<string, VSTPlugin[]>();
    parsed.forEach(p => {
      const vNormalized = normalizeVendor(p.vendor);
      const nNormalized = normalizeName(p.name);
      const key = `${vNormalized}|${nNormalized}`;
      const list = grouped.get(key) || [];
      list.push(p);
      grouped.set(key, list);
    });

    parsed = Array.from(grouped.values()).map(group => {
      // Sort group descending by score
      group.sort((a, b) => {
        const scoreA = getFormatScore(a) + (a.id ? 0.1 : 0);
        const scoreB = getFormatScore(b) + (b.id ? 0.1 : 0);
        return scoreB - scoreA;
      });
      return group[0];
    });

    if (parsed.length > 5000) {
      setError(`Your list has ${parsed.length} items. Please limit it to 5000 plugins at a time so the AI doesn't get overwhelmed.`);
      return;
    }

    if (parsed.length === 0) {
      setError("I couldn't find any plugins. Make sure you copied the list or uploaded the right file!");
      return;
    }

    setError(null);
    setIsEnrichingLibrary(true);
    setEnrichProgress(0);
    setEnrichEta(0);
    setEnrichStatus('Initializing Research...');

    try {
      const enriched = await enrichPluginLibrary(parsed, (progress, eta) => {
        setEnrichProgress(progress);
        setEnrichEta(eta);
      }, (status) => {
        setEnrichStatus(status);
      }, i18n.language, forceResearch);
      
      logReceipt('Enrich Plugin Library', 5); // Base cost
      
      setPlugins(enriched);
      handleSaveUserPlugins(enriched);
      setDawModalSource('initial');
      setShowDawModal(true); // Show DAW selection before analog equipment
      
      // Auto-backup gear if enabled
      if (user && autoBackupPrefs.gear) {
        handleExecuteCloudSync('backup', { gear: true, settings: false, recipes: false, critiques: false }, true);
      }
    } catch (err: any) {
      console.error("Failed to enrich library:", err);
      
      if (err?.message?.includes("INSUFFICIENT_CREDITS") || err?.message?.includes("402")) {
        setCreditError(err.message);
        setShowBuyCreditsModal(true);
        setIsEnrichingLibrary(false);
        return;
      }
      
      if (err?.message?.includes("API_KEY_MISSING") || err?.message?.includes("401") || err?.message?.includes("403")) {
        setError(`Access error: ${err.message}. Please contact support or try again later.`);
        setIsEnrichingLibrary(false);
        return;
      }

      let detailedError = "Plugin Research Failed: ";
      const errorMsg = err.message || "";
      
      if (errorMsg.includes("QUOTA_EXCEEDED")) {
        detailedError = "AI Research Quota Exceeded. " + errorMsg.split(': ')[1] + " The AI is currently at its limit. Please try again in 15-30 minutes or upload a smaller list.";
      } else if (errorMsg.includes("RESEARCH_INCOMPLETE")) {
        detailedError = "Strict Research Mode: " + errorMsg.split(': ')[1];
      } else if (errorMsg.includes("RESEARCH_FAILED")) {
        detailedError = "Network/AI Error: " + errorMsg.split(': ')[1];
      } else {
        detailedError += errorMsg || "An unexpected error occurred during the research process.";
      }
      
      setError(detailedError);
      setPlugins([]); // Ensure we don't proceed with incomplete data
    } finally {
      setIsEnrichingLibrary(false);
    }
  };

  const processFiles = async (files: File[]) => {
    if (!requireAuth()) return;
    if (files.length === 0) return;
    
    // Check files to determine DAW type
    for (const file of files) {
      const fileName = file.name.toLowerCase();
      if (fileName.includes('reaper')) {
        setDawType('Reaper');
      } else if (fileName.includes('studio one') || fileName.includes('studioone') || fileName.includes('pluginmanagement') || fileName.includes('pluginpresentation')) {
        setDawType('Studio One');
      } else if (fileName.includes('fl studio') || fileName.includes('flstudio')) {
        setDawType('FL Studio');
      } else if (fileName.includes('mixcraft') || fileName.includes('vst-inventory')) {
        setDawType('Mixcraft');
      }
    }

    const readPromises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve((event.target?.result as string) || '');
        };
        reader.onerror = () => {
          reject(new Error(`Failed to read file ${file.name}`));
        };

        // Read the first 4 bytes to check for encoding BOM or null distribution (UTF-16 vs UTF-8)
        const headerReader = new FileReader();
        headerReader.onload = () => {
          const arr = new Uint8Array(headerReader.result as ArrayBuffer);
          let encoding = 'utf-8';
          if (arr.length >= 2) {
            if (arr[0] === 0xFF && arr[1] === 0xFE) {
              encoding = 'utf-16le';
            } else if (arr[0] === 0xFE && arr[1] === 0xFF) {
              encoding = 'utf-16be';
            } else if (arr[0] === 0x00 && arr[1] !== 0x00) {
              // No BOM but looks like UTF-16BE (even bytes are 0)
              encoding = 'utf-16be';
            } else if (arr[0] !== 0x00 && arr[1] === 0x00) {
              // No BOM but looks like UTF-16LE (odd bytes are 0)
              encoding = 'utf-16le';
            }
          }
          reader.readAsText(file, encoding);
        };
        headerReader.onerror = () => {
          reader.readAsText(file, 'utf-8');
        };
        headerReader.readAsArrayBuffer(file.slice(0, 4));
      });
    });

    try {
      const fileContents = await Promise.all(readPromises);
      // Join contents of files. This allows drop zone to accept multiple files simultaneously
      // (like both PluginManagement.csv and PluginPresentation.settings files)
      const combinedContent = fileContents.join('\n\n');
      if (combinedContent) {
        setCsvInput(combinedContent);
        await parsePlugins(combinedContent);
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while reading your files.");
      throw err;
    }
  };

  const handleAnalogSave = async (instruments: Hardware[], hardware: Hardware[]): Promise<boolean> => {
    try {
      // Enrich only if needed, but we already have the basic info from the modal.
      // To keep it simple and preserve connectedPedals, we'll use the objects directly.
      const newInstruments = instruments;
      const newHardware = hardware;

      const removedInstruments = analogInstruments.filter(i => !newInstruments.some(ni => ni.name === i.name));
      const removedHardware = analogHardware.filter(h => !newHardware.some(nh => nh.name === h.name));

      setDeletedInstruments(prev => [...prev, ...removedInstruments]);
      setDeletedHardware(prev => [...prev, ...removedHardware]);

      setAnalogInstruments(newInstruments);
      setAnalogHardware(newHardware);
      return true;
    } catch (err: any) {
      if (err?.message?.includes("INSUFFICIENT_CREDITS") || err?.message?.includes("402")) {
        setCreditError(err.message);
        setShowBuyCreditsModal(true);
      } else if (err?.message?.includes("API_KEY_MISSING") || err?.message?.includes("401") || err?.message?.includes("403")) {
        setError("Access error. Please contact support or try again later.");
      } else {
        setError("Failed to save equipment. Please try again.");
      }
      return false;
    }
  };

  const handleUseBandLab = async () => {
    if (!requireAuth()) return;
    setDawType('BandLab');
    const pluginsToUse = isBandLabPremium ? BANDLAB_PLUGINS_LATEST : BANDLAB_FREE_PLUGINS_LATEST;
    
    // Direct mapping to VSTPlugin format to bypass AI enrichment for known internal plugins
    const enrichedBandLab: VSTPlugin[] = pluginsToUse.map(p => ({
      vendor: p.vendor,
      name: p.name,
      type: p.type as any,
      version: 'Latest',
      lastModified: 'Internal Preset',
      description: `Official BandLab ${p.type} plugin. High-quality processing for your mobile or web projects.`,
      features: ["Low latency", "Mobile optimized", "Free for BandLab users"]
    }));

    setPlugins(enrichedBandLab);
    setDawModalSource('initial');
    setShowDawModal(true);

    // Auto-backup gear if enabled
    if (user && autoBackupPrefs.gear) {
      handleExecuteCloudSync('backup', { gear: true, settings: false, recipes: false, critiques: false }, true);
    }
  };

  const handleCorrectPlugin = useCallback(async (pluginName: string, corrections: { parameter: string, value: string }[], version: string) => {
    try {
      const existingPlugin = plugins.find(p => p.name === pluginName);
      if (!existingPlugin) {
        return { success: false, message: "Plugin not found in your rig." };
      }

      const userParam = corrections.map(c => `${c.parameter}: ${c.value}`).join(', ');
      const result = await verifyAndCorrectPlugin(existingPlugin, userParam, version, i18n.language);
      
      if (result.success && result.plugin) {
        setPlugins(prev => {
          const next = prev.map(p => (p.name === existingPlugin.name && p.vendor === existingPlugin.vendor) ? result.plugin! : p);
          handleSaveUserPlugins([result.plugin!]);
          return next;
        });
        
        // Update any active recipes that use this plugin
        setRecipes(prev => prev.map(recipe => {
          const updatedRecipe = JSON.parse(JSON.stringify(recipe));
          
          // Helper to update plugins in an array
          const updatePluginArray = (pluginsArray: any[]) => {
            if (!pluginsArray) return;
            pluginsArray.forEach((p, idx) => {
              if (p.name === existingPlugin.name) {
                const newDeepDive = (result.plugin!.parameters || []).map(paramName => {
                  const existing = (p.deepDive || []).find((d: any) => d.parameter === paramName);
                  return existing || { parameter: paramName, value: '?', explanation: 'Updated from research' };
                });
                pluginsArray[idx] = {
                  ...p,
                  deepDive: newDeepDive
                };
              }
            });
          };

          if (updatedRecipe.instruments) {
            updatedRecipe.instruments.forEach((inst: any) => {
              if (inst.plugin === existingPlugin.name) {
                const newDeepDive = (result.plugin!.parameters || []).map(paramName => {
                  const existing = (inst.deepDive || []).find((d: any) => d.parameter === paramName);
                  return existing || { parameter: paramName, value: '?', explanation: 'Updated from research' };
                });
                inst.deepDive = newDeepDive;
              }
              updatePluginArray(inst.fxPlugins);
            });
          }
          
          if (updatedRecipe.busses) {
            updatedRecipe.busses.forEach((bus: any) => updatePluginArray(bus.fxPlugins));
          }
          
          if (updatedRecipe.vocalElements?.vocalTracks) {
            updatedRecipe.vocalElements.vocalTracks.forEach((track: any) => {
              if (track.plugin === existingPlugin.name) {
                const newDeepDive = (result.plugin!.parameters || []).map(paramName => {
                  const existing = (track.deepDive || []).find((d: any) => d.parameter === paramName);
                  return existing || { parameter: paramName, value: '?', explanation: 'Updated from research' };
                });
                track.deepDive = newDeepDive;
              }
              updatePluginArray(track.fxPlugins);
            });
          }
          
          if (updatedRecipe.gangstaVox?.vocalTracks) {
            updatedRecipe.gangstaVox.vocalTracks.forEach((track: any) => {
              if (track.plugin === existingPlugin.name) {
                const newDeepDive = (result.plugin!.parameters || []).map(paramName => {
                  const existing = (track.deepDive || []).find((d: any) => d.parameter === paramName);
                  return existing || { parameter: paramName, value: '?', explanation: 'Updated from research' };
                });
                track.deepDive = newDeepDive;
              }
              updatePluginArray(track.fxPlugins);
            });
          }
          
          updatePluginArray(updatedRecipe.masterPlugins);
          
          return updatedRecipe;
        }));

        return { success: true, message: result.message, plugin: result.plugin };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Correction failed:", error);
      return { success: false, message: "Failed to verify plugin." };
    }
  }, [plugins, handleSaveUserPlugins, i18n.language]);

  const handleUpdatePlugin = async (plugin: VSTPlugin, userParameter?: string, userVersion?: string) => {
    try {
      let updated: VSTPlugin;
      if (userParameter || userVersion) {
        const result = await verifyAndCorrectPlugin(plugin, userParameter, userVersion, i18n.language);
        if (!result.success) {
          setError(result.message);
          return;
        }
        updated = result.plugin;
      } else {
        updated = await researchPluginParameters(plugin, i18n.language);
      }
      
      setPlugins(prev => {
        const next = prev.map(p => (p.name === plugin.name && p.vendor === plugin.vendor) ? updated : p);
        handleSaveUserPlugins([updated]);
        return next;
      });
      
      // Auto-backup if enabled
      if (user && autoBackupPrefs.gear) {
        handleExecuteCloudSync('backup', { gear: true, settings: false, recipes: false, critiques: false }, true);
      }
    } catch (error) {
      console.error("Failed to update plugin parameters:", error);
      setError("Failed to research plugin parameters. Please try again later.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    processFiles(files).catch(err => {
      console.error("Error processing file:", err);
      if (err?.message?.includes("INSUFFICIENT_CREDITS") || err?.message?.includes("402")) {
        setCreditError(err.message);
        setShowBuyCreditsModal(true);
      } else if (err?.message?.includes("API_KEY_MISSING") || err?.message?.includes("401") || err?.message?.includes("403") || err?.message?.includes("API key not valid")) {
        setError(`Access error: ${err.message}. Please contact support or try again later.`);
      } else {
        setError("An error occurred while processing the file.");
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    setIsDragging(false);
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length === 0) return;
    processFiles(files).catch(err => {
      console.error("Error processing file in drop:", err);
      if (err?.message?.includes("INSUFFICIENT_CREDITS") || err?.message?.includes("402")) {
        setCreditError(err.message);
        setShowBuyCreditsModal(true);
      } else if (err?.message?.includes("API_KEY_MISSING") || err?.message?.includes("401") || err?.message?.includes("403") || err?.message?.includes("API key not valid")) {
        setError(`Access error: ${err.message}. Please contact support or try again later.`);
      } else {
        setError("An error occurred while processing the dropped file.");
      }
    });
  };

  const simulateGenerationProgress = (estimatedSeconds: number) => {
    setGenerationProgress(0);
    setGenerationEta(estimatedSeconds);
    
    const startTime = Date.now();
    const totalMs = estimatedSeconds * 1000;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const elapsedSeconds = elapsed / 1000;
      
      // Slow down as we get closer to 95%
      let progress;
      if (elapsedSeconds < estimatedSeconds) {
        // Linear progress up to 85%
        progress = (elapsedSeconds / estimatedSeconds) * 85;
      } else {
        // After ETA, crawl slowly towards 98% using an asymptotic curve
        const extraTime = elapsedSeconds - estimatedSeconds;
        progress = 85 + (13 * (1 - Math.exp(-extraTime / 30)));
      }
      
      setGenerationProgress(Math.min(98.5, progress));
      setGenerationEta(Math.max(1, Math.round(estimatedSeconds - elapsedSeconds)));
    }, 200);
    
    return interval;
  };

  const getEstimatedSeconds = (type: 'replicate' | 'generate' | 'type-beat' | 'song-search' | 'audio-search', files?: File[]) => {
    let baseTime = 90;
    switch (type) {
      case 'replicate': baseTime = 45; break;
      case 'generate': baseTime = 60; break;
      case 'type-beat': baseTime = 75; break;
      case 'song-search': baseTime = 80; break;
      case 'audio-search': baseTime = 180; break;
    }

    if (files && files.length > 0) {
      // Add extra time based on file size and count
      const totalSizeMB = files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024);
      // Rough estimate: add 5 seconds per MB, plus 25 seconds per extra stem file
      baseTime += Math.round(totalSizeMB * 5) + (files.length * 25);
    }
    return baseTime;
  };

  const handleApiKeySave = async (key: string) => {
    if (!key.trim()) {
      localStorage.removeItem('bg_user_api_key');
      setUserApiKey('');
      return;
    }

    setIsValidatingKey(true);
    setApiKeyError(null);
    try {
      const result = await validateApiKey(key);
      if (result.valid) {
        localStorage.setItem('bg_user_api_key', result.cleanKey || key.trim());
        setUserApiKey(result.cleanKey || key.trim());
        setShowApiKeyInput(false);
      } else {
        setApiKeyError(result.message || "Invalid API key.");
      }
    } catch (err: any) {
      setApiKeyError(err.message || "Failed to validate API key.");
    } finally {
      setIsValidatingKey(false);
    }
  };

  const handlePushReaperSync = async (payload: any) => {
    if (!user?.email) {
      setError("[ERR_REAPER_SYNC_AUTH] Please sign in to use REAPER Cloud Sync.");
      return;
    }
    
    setIsPushingReaperSync(true);
    setError(null);
    
    const pin = reaperSyncPin || Math.floor(1000 + Math.random() * 9000).toString();
    
    const getParamSyncValue = (pluginName: string, paramName: string, rawValue: any): number | null => {
      const valStr = String(rawValue).trim();
      const lowerPlugin = pluginName.toLowerCase();
      
      if (lowerPlugin.includes('reeq') || lowerPlugin.includes('rejj')) {
        const lowerParam = paramName.toLowerCase();
        if (lowerParam.includes('type')) {
          const valLower = valStr.toLowerCase();
          if (valLower.includes('bell') || valLower.includes('peak') || valLower.includes('parametric')) return 0;
          if (valLower.includes('low shelf') || valLower.includes('lowshelf')) return 1;
          if (valLower.includes('high shelf') || valLower.includes('highshelf')) return 2;
          if (valLower.includes('low pass') || valLower.includes('lowpass') || valLower.includes('high cut') || valLower.includes('highcut')) return 3;
          if (valLower.includes('high pass') || valLower.includes('highpass') || valLower.includes('low cut') || valLower.includes('lowcut')) return 4;
          if (valLower.includes('notch')) return 6;
        }
      }
      
      const numVal = parseFloat(valStr.replace(/[^0-9.-]/g, ''));
      return isNaN(numVal) ? null : numVal;
    };

    const getParamModulationLine = (fxName: string, dive: { parameter: string; value: string; explanation?: string }): string => {
      const paramLower = (dive.parameter || '').toLowerCase();
      const expLower = (dive.explanation || '').toLowerCase();
      const valLower = (dive.value || '').toLowerCase();

      // Check if the parameter has automation keywords
      if (
        (expLower.includes('dynamic') || expLower.includes('modulat') || expLower.includes('duck') || expLower.includes('sidechain') || expLower.includes('compress') || expLower.includes('expansion') ||
         valLower.includes('dynamic') || valLower.includes('modulat') || valLower.includes('duck'))
      ) {
        let dir = 1; // Negative / ducking
        if (expLower.includes('boost') || expLower.includes('expand') || expLower.includes('positive') || valLower.includes('boost')) {
          dir = 0; // Positive / boost
        }

        let chan = 0; // 1+2 self
        if (expLower.includes('sidechain') || expLower.includes('aux') || valLower.includes('sidechain')) {
          chan = 3; // 3+4 sidechain
        }

        return `PARAM_MOD|${dive.parameter}|active=1;chan=${chan};dir=${dir};strength=0.5;attack=10;release=100\n`;
      }
      return '';
    };
    
    try {
      let txtContent = "";
      if (payload && payload.actionPlan) {
        payload.actionPlan.forEach((plan: any) => {
          if (!plan.targetStem) return;
          txtContent += `TRACK|${plan.targetStem}\n`;
          plan.recommendedChain.forEach((req: any) => {
            txtContent += `FX|${req.name}\n`;
            if (req.deepDive) {
              req.deepDive.forEach((dive: any) => {
                const numVal = getParamSyncValue(req.name, dive.parameter, dive.value);
                if (numVal !== null && dive.parameter) {
                  txtContent += `PARAM|${dive.parameter}|${numVal}\n`;
                  txtContent += getParamModulationLine(req.name, dive);
                }
              });
            }

            const isFuzzyPluginMatch = (p1: string, p2: string) => {
              const n1 = p1.toLowerCase().replace(/^(js:|vst:|au:|vst3:)\s*/i, '').trim();
              const n2 = p2.toLowerCase().replace(/^(js:|vst:|au:|vst3:)\s*/i, '').trim();
              return n1 === n2 || n1.includes(n2) || n2.includes(n1);
            };

            if (plan.lyricAutomation?.reaperAutomationPoints) {
              plan.lyricAutomation.reaperAutomationPoints.forEach((ptGroup: any) => {
                if (isFuzzyPluginMatch(ptGroup.pluginName, req.name)) {
                  const pointsStr = ptGroup.points.map((pt: any) => `${pt.beat},${pt.value}`).join(';');
                  txtContent += `AUTO|${ptGroup.parameterName}|${pointsStr}\n`;
                }
              });
            }

            if (plan.breathAndNoiseMuting?.reaperAutomationPoints) {
              plan.breathAndNoiseMuting.reaperAutomationPoints.forEach((ptGroup: any) => {
                if (isFuzzyPluginMatch(ptGroup.pluginName, req.name)) {
                  const pointsStr = ptGroup.points.map((pt: any) => `${pt.beat},${pt.value}`).join(';');
                  txtContent += `AUTO|${ptGroup.parameterName}|${pointsStr}\n`;
                }
              });
            }
          });
          // Saike Smooth as last plugin on every track
          const hasSmoothApp = plan.recommendedChain ? plan.recommendedChain.some((p: any) => p.name.toLowerCase().includes('smooth')) : false;
          if (!hasSmoothApp) {
            txtContent += `FX|JS: Saike Saike Smooth\n`;
          }
        });
      } else if (typeof payload === 'string') {
        txtContent = payload;
      } else {
        txtContent = String(payload || "");
      }

      console.log(`[BG-CONNECT-PUSH] Pushing payload to server: ${txtContent.length} chars, PIN: ${pin}`);

      const response = await fetchWithDetailedError('/api/reaper-sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          pin: pin,
          payload: txtContent
        })
      });
      
      if (response) {
        setReaperSyncPin(pin);
        setShowSyncSuccess(true);
        setTimeout(() => setShowSyncSuccess(false), 5000);
      }
    } catch (err: any) {
      console.error("[BG-CONNECT-ERROR] [PUSH_REAPER_SYNC] Failed:", err);
      const errTrace = err.stack || err.message || String(err);
      setLatestErrorLog(`[ERR_REAPER_SYNC_PUSH] REAPER Push Sync failed.\nPIN: ${pin}\nUser: ${user.email}\nDetails:\n${errTrace}`);
      setError(`[ERR_REAPER_SYNC_PUSH] Failed to push REAPER sync: ${err.message || "Unknown Error"}`);
    } finally {
      setIsPushingReaperSync(false);
    }
  };

  const handlePushExhaustiveJSFXSync = async () => {
    if (!user?.email) {
      setError("[ERR_REAPER_SYNC_AUTH] Please sign in to use REAPER Cloud Sync.");
      return;
    }
    
    setIsPushingReaperSync(true);
    setError(null);
    
    const pin = reaperSyncPin || Math.floor(1000 + Math.random() * 9000).toString();
    
    try {
      let txtContent = "";
      
      // 1. Process all rich JSFX from JSFX_DATABASE
      JSFX_DATABASE.forEach((profile) => {
        const trackName = `${profile.shortName} (Ref Test)`;
        txtContent += `TRACK|${trackName}\n`;
        txtContent += `FX|${profile.name}\n`;
        
        // Push every single parameter
        profile.sliders.forEach((slider_param) => {
          // Push name-based
          txtContent += `PARAM|${slider_param.name}|${slider_param.defaultVal}\n`;
          // Push S-prefixed
          const sPrefix = `S${slider_param.index + 1}`;
          txtContent += `PARAM|S${slider_param.index + 1}|${slider_param.defaultVal}\n`;
        });
      });
      
      // 2. Process extra JSFX to test load/existence in REAPER
      const EXTRA_JSFX_NAMES = [
        // Compressors/Dynamics/Limiters
        "JS: 1175 Compressor", "JS: Auto Expander", "JS: LOSER/EventHorizon",
        "JS: Fairly Childish Compressor/Limiter", "JS: General Dynamics", "JS: LOSER/1175",
        "JS: LOSER/MGA_JSLimiter", "JS: LOSER/MasterLimiter", "JS: LOSER/MasterTom",
        "JS: LOSER/compciter", "JS: LOSER/gate", "JS: LOSER/DDC", "JS: Liteon/np1136peaklimiter",
        "JS: Multi-Band Compressor", "JS: 5-Band Compressor", "JS: 3-Band Compressor", "JS: Expander / Gate",
 
        // EQ/Enhancers/Filters
        "JS: 3-Band EQ", "JS: 4-Band EQ", "JS: 5-Band Stereo EQ", "JS: Auto-peaker",
        "JS: Bandpass Filter", "JS: DC Filter", "JS: Exciter", "JS: Huge Booty Bass Enhancer",
        "JS: LOSER/3BandEQ", "JS: LOSER/4BandEQ", "JS: LOSER/5BandEQ", "JS: LOSER/BasiQ",
        "JS: LOSER/Filter", "JS: LOSER/Filter_RC", "JS: LOSER/MIDI_EQ", "JS: LOSER/VCF",
        "JS: LOSER/saturation", "JS: LOSER/stereo_enhancer", "JS: Liteon/3bandpeakfilter",
        "JS: Liteon/applefilter12db", "JS: Liteon/applefilter24db", "JS: Liteon/butterworth24db",
        "JS: Liteon/cheb24db", "JS: Liteon/moog24db", "JS: Liteon/presenceeq", "JS: Liteon/rbj1073",
        "JS: Liteon/rbjeq", "JS: Liteon/saturator", "JS: Liteon/shelveq", "JS: Liteon/statevariable",
        "JS: Liteon/statevariable2", "JS: RBJ 1073 EQ", "JS: RBJ 4-Band Semi-Parametric EQ",
        "JS: RBJ 7-Band Graphic EQ", "JS: RBJ Highpass/Lowpass Filters",
        "JS: Saturation/Soft Clipper", "JS: Teej/rbj12eq-teej", "JS: 12-Band EQ", "JS: Graphic EQ",
 
        // Modulation/Time
        "JS: Chorus", "JS: Chorus (Stereo)", "JS: Delay", "JS: Delay w/ Chorus",
        "JS: Delay w/ Tempo Ping-Pong", "JS: Flanger", "JS: Flanger (Stereo)", "JS: LOSER/FBDelay",
        "JS: LOSER/FBFlanger", "JS: LOSER/Flanger", "JS: LOSER/Phaser", "JS: LOSER/Tremolo",
        "JS: Phaser", "JS: Reverb", "JS: Tremolo", "JS: Delay (L/R)",
 
        // Guitar/Amp/Distortion
        "JS: Distortion", "JS: Tube Harmonics",
        "JS: Wah-Wah", "JS: Wig-Wah",
 
        // Utility/Routing/Imaging/Pitch
        "JS: 8-Channel Mixer", "JS: Audio To MIDI Drum Trigger", "JS: Band Splitter", "JS: Band Joiner",
        "JS: Dual Pan", "JS: FFT Splitter", "JS: FFT Splitter (3-band)", "JS: LOSER/CenterCanceler",
        "JS: LOSER/Dither", "JS: LOSER/Downjumper", "JS: LOSER/TransientController", "JS: LOSER/Upjumper",
        "JS: LOSER/WaveShaper", "JS: LOSER/WhiteNoise", "JS: LOSER/goniometer", "JS: LOSER/phase_rotator",
        "JS: LOSER/pitch_shifter_2", "JS: LOSER/stereofield", "JS: Liteon/deesser", "JS: Liteon/pinknoisegen",
        "JS: Liteon/pseudostereo", "JS: Multichannel Routing/Channel Mapper", "JS: Phase Rotator",
        "JS: Pitch Down-Shifter", "JS: Pitch Octave Up", "JS: Pitch Shifter", "JS: Pitch/Detune",
        "JS: SMPTE LTC Generator", "JS: SMPTE LTC Reader/Meter", "JS: Stereo Field", "JS: Time Adjustment",
        "JS: Volume/Pan Smoother v5", "JS: 3-Band Splitter", "JS: 4-Band Splitter", "JS: 5-Band Splitter",
        "JS: 8x8 Matrix Mixer", "JS: 8-Way Panner", "JS: Channel Mixer", "JS: Super Pitch",
        "JS: Transient Enhancer", "JS: Tonifier", "JS: Vocoder", "JS: MS Decoder", "JS: MS Encoder",
        "JS: Stereo Upmix", "JS: IX/Mixer_8xM-1xS", "JS: IX/StereoPhaseInverter", "JS: IX/PhaseAdjust",
        "JS: IX/SwixMitz"
      ];
      
      EXTRA_JSFX_NAMES.forEach((name) => {
        const cleanNamePart = name.replace("JS: ", "").replace(/\//g, " ");
        txtContent += `TRACK|JSFX ${cleanNamePart}\n`;
        txtContent += `FX|${name}\n`;
        // Send index-based parameters 1 through 5 to test standard slider binding
        for (let i = 1; i <= 5; i++) {
          txtContent += `PARAM|S${i}|0.5\n`;
        }
      });

      console.log(`[BG-CONNECT-PUSH-EXHAUSTIVE] Pushing exhaustive test: ${txtContent.length} chars, PIN: ${pin}`);
      
      const response = await fetchWithDetailedError('/api/reaper-sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          pin: pin,
          payload: txtContent
        })
      });
      
      if (response) {
        setReaperSyncPin(pin);
        setShowSyncSuccess(true);
        setTimeout(() => setShowSyncSuccess(false), 5000);
      }
    } catch (err: any) {
      console.error("[BG-CONNECT-ERROR] [PUSH_REAPER_SYNC_EXHAUSTIVE] Failed:", err);
      const errTrace = err.stack || err.message || String(err);
      setLatestErrorLog(`[ERR_REAPER_SYNC_PUSH_EXHAUSTIVE] Exhaustive Sync Push failed.\nPIN: ${pin}\nUser: ${user.email}\nDetails:\n${errTrace}`);
      setError(`[ERR_REAPER_SYNC_PUSH_EXHAUSTIVE] Failed to push exhaustive REAPER sync test: ${err.message || "Unknown Error"}`);
    } finally {
      setIsPushingReaperSync(false);
    }
  };

  const handleGenerate = async () => {
    if (!requireAuth()) return;
    
    if (plugins.length === 0 && !isJsfxMode) return;
    if (!isVerified) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setError("Please complete the security verification first.");
      return;
    }
    setLoading(true);
    setError(null);
    
    // Safety timeout to prevent getting stuck - increased to 5 mins
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("The architect is taking too long. Please try again!");
    }, 300000);

    const progressInterval = simulateGenerationProgress(getEstimatedSeconds('generate'));

    try {
      if (!requireAuth()) return;

    let finalGenerationContext = generationContext;
    if (dawType === 'LUNA') {
      if (lunaSumming !== 'off') {
        finalGenerationContext = finalGenerationContext + (finalGenerationContext ? "\n\n" : "") + `CRITICAL LUNA DIRECTIVE: The user has enabled ${lunaSumming.toUpperCase()} SUMMING. You MUST include specific settings for the ${lunaSumming === 'api' ? 'API Vision Console' : 'Neve Summing'} extension on the busses and master fader. Do not ignore this.`;
      }
      if (lunaTape !== 'off') {
        finalGenerationContext = finalGenerationContext + (finalGenerationContext ? "\n\n" : "") + `CRITICAL LUNA DIRECTIVE: The user has enabled ${lunaTape.toUpperCase()} TAPE. You MUST include specific settings for the ${lunaTape === 'oxide' ? 'Oxide Tape' : 'Studer A800'} extension on the tracks and busses. Do not ignore this.`;
      }
    }
      const response = await getBeatRecommendations(plugins, analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n.language, isMultiBandMode, generationBPM, finalGenerationContext, isJsfxMode, installedJsfxPacks, xpandPresets);
      clearInterval(progressInterval);
      setGenerationProgress(100);
      clearTimeout(timeoutId);
      setRecipes(response.recipes || []);
      const newHistory: HistoryItem[] = (response.recipes || []).map(r => ({
        ...r,
        generatedAt: new Date().toISOString()
      }));
      setHistory(prev => [...newHistory, ...prev].slice(0, 50));
      logReceipt('Generate Beat Recipe', 10);
      setShowFairy(true);
    } catch (err: any) {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      if (err?.message?.includes("INSUFFICIENT_CREDITS") || err?.message?.includes("402")) {
        setCreditError(err.message);
        setShowBuyCreditsModal(true);
      } else if (err?.message?.includes("API_KEY_MISSING") || err?.message?.includes("401") || err?.message?.includes("403")) {
        setError("Access error. Please contact support or try again later.");
      } else {
        const errorMessage = err?.message || "Couldn't think of any beats right now. Try again in a second!";
        setError(errorMessage);
        console.error("Generation error:", err);
      }
    } finally {
      setLoading(false);
    }
  };


  const handleManualResearchAndAdd = async () => {
    if (!manualPluginName.trim() || !manualPluginBrand.trim()) return;
    setIsResearching(true);
    try {
      const pluginToResearch: VSTPlugin = {
        name: manualPluginName.trim(),
        vendor: manualPluginBrand.trim(),
        type: 'vst',
        version: '',
        lastModified: ''
      };
      // Use the geminiService function to get category & parameters
      const researchedPlugin = await researchPluginParameters(pluginToResearch, i18n.language);
      
      setPlugins(prev => {
        // Prevent duplicates
        if (prev.some(p => p.name === researchedPlugin.name && p.vendor === researchedPlugin.vendor)) {
          return prev;
        }
        return [...prev, researchedPlugin];
      });
      
      setManualPluginName('');
      setManualPluginBrand('');
    } catch (err) {
      console.error('Failed to research plugin:', err);
      // Fallback: add it without parameters
      setPlugins(prev => {
        if (prev.some(p => p.name === manualPluginName.trim() && p.vendor === manualPluginBrand.trim())) {
          return prev;
        }
        return [...prev, { name: manualPluginName.trim(), vendor: manualPluginBrand.trim(), type: 'vst', version: '', lastModified: '' }];
      });
      setManualPluginName('');
      setManualPluginBrand('');
    } finally {
      setIsResearching(false);
    }
  };

  const handleTypeBeatSearch = async () => {
    if (!requireAuth()) return;
    
    if ((plugins.length === 0 && !isJsfxMode) || !typeBeatSearch.trim()) return;
    if (!isVerified) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setError("Please complete the security verification first.");
      return;
    }
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("Search timed out. Try a different vibe!");
    }, 300000);

    const progressInterval = simulateGenerationProgress(getEstimatedSeconds('type-beat'));

    try {
      if (!requireAuth()) return;

    let finalGenerationContext = generationContext;
    if (dawType === 'LUNA') {
      if (lunaSumming !== 'off') {
        finalGenerationContext = finalGenerationContext + (finalGenerationContext ? "\n\n" : "") + `CRITICAL LUNA DIRECTIVE: The user has enabled ${lunaSumming.toUpperCase()} SUMMING. You MUST include specific settings for the ${lunaSumming === 'api' ? 'API Vision Console' : 'Neve Summing'} extension on the busses and master fader. Do not ignore this.`;
      }
      if (lunaTape !== 'off') {
        finalGenerationContext = finalGenerationContext + (finalGenerationContext ? "\n\n" : "") + `CRITICAL LUNA DIRECTIVE: The user has enabled ${lunaTape.toUpperCase()} TAPE. You MUST include specific settings for the ${lunaTape === 'oxide' ? 'Oxide Tape' : 'Studer A800'} extension on the tracks and busses. Do not ignore this.`;
      }
    }
      const response = await getCustomBeatRecommendations(plugins, typeBeatSearch.trim(), analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n.language, isMultiBandMode, generationBPM, finalGenerationContext, isJsfxMode, installedJsfxPacks, xpandPresets);
      clearInterval(progressInterval);
      setGenerationProgress(100);
      clearTimeout(timeoutId);
      setRecipes(response.recipes || []);
      const newHistory: HistoryItem[] = (response.recipes || []).map(r => ({
        ...r,
        generatedAt: new Date().toISOString()
      }));
      setHistory(prev => [...newHistory, ...prev].slice(0, 50));
      logReceipt('Type Beat Search', 10);
      setTypeBeatSearch('');
      setShowFairy(true);
    } catch (err: any) {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      if (err?.message?.includes("INSUFFICIENT_CREDITS") || err?.message?.includes("402")) {
        setCreditError(err.message);
        setShowBuyCreditsModal(true);
      } else if (err?.message?.includes("API_KEY_MISSING") || err?.message?.includes("401") || err?.message?.includes("403")) {
        setError("Access error. Please contact support or try again later.");
      } else {
        const errorMessage = err?.message || "Couldn't find any recipes for that vibe. Try a different search!";
        setError(errorMessage);
        console.error("Type beat search error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSongSearch = async () => {
    if (!requireAuth()) return;
    
    if ((plugins.length === 0 && !isJsfxMode) || !songSearch.trim()) return;
    if (!isVerified) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setError("Please complete the security verification first.");
      return;
    }
    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("Song search timed out. Try a different track!");
    }, 300000);

    const progressInterval = simulateGenerationProgress(getEstimatedSeconds('song-search'));

    try {
      if (!requireAuth()) return;

    let finalGenerationContext = generationContext;
    if (dawType === 'LUNA') {
      if (lunaSumming !== 'off') {
        finalGenerationContext = finalGenerationContext + (finalGenerationContext ? "\n\n" : "") + `CRITICAL LUNA DIRECTIVE: The user has enabled ${lunaSumming.toUpperCase()} SUMMING. You MUST include specific settings for the ${lunaSumming === 'api' ? 'API Vision Console' : 'Neve Summing'} extension on the busses and master fader. Do not ignore this.`;
      }
      if (lunaTape !== 'off') {
        finalGenerationContext = finalGenerationContext + (finalGenerationContext ? "\n\n" : "") + `CRITICAL LUNA DIRECTIVE: The user has enabled ${lunaTape.toUpperCase()} TAPE. You MUST include specific settings for the ${lunaTape === 'oxide' ? 'Oxide Tape' : 'Studer A800'} extension on the tracks and busses. Do not ignore this.`;
      }
    }
      const response = await getSongBeatRecommendations(plugins, songSearch.trim(), analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n.language, isMultiBandMode, generationBPM, finalGenerationContext, isJsfxMode, installedJsfxPacks, xpandPresets);
      clearInterval(progressInterval);
      setGenerationProgress(100);
      clearTimeout(timeoutId);
      setRecipes(response.recipes || []);
      const newHistory: HistoryItem[] = (response.recipes || []).map(r => ({
        ...r,
        generatedAt: new Date().toISOString()
      }));
      setHistory(prev => [...newHistory, ...prev].slice(0, 50));
      logReceipt('Song Search', 10);
      setSongSearch('');
      setShowFairy(true);
    } catch (err: any) {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      if (err?.message?.includes("INSUFFICIENT_CREDITS") || err?.message?.includes("402")) {
        setCreditError(err.message);
        setShowBuyCreditsModal(true);
      } else if (err?.message?.includes("API_KEY_MISSING") || err?.message?.includes("401") || err?.message?.includes("403")) {
        setError("Access error. Please contact support or try again later.");
      } else {
        const errorMessage = err?.message || "Couldn't find any recipes for that song. Try a different track!";
        setError(errorMessage);
        console.error("Song search error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const [recipeLinkUrl, setRecipeLinkUrl] = useState('');

  const handleAudioDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingAudio(true);
  };

  const handleAudioDragLeave = () => {
    setIsDraggingAudio(false);
  };

  const handleAudioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingAudio(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'audio/mpeg' || file.type === 'audio/mp3' || file.name.toLowerCase().endsWith('.mp3') || file.type.includes('wav') || file.name.toLowerCase().endsWith('.wav'))) {
      handleAudioSearch(file);
    } else {
      setError("Please drop a valid MP3 or WAV file.");
    }
  };

  const handleVibeDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVibe(true);
  };

  const handleVibeDragLeave = () => {
    setIsDraggingVibe(false);
  };

  const handleVibeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVibe(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type.includes('mpeg') || file.type.includes('mp3') || file.name.toLowerCase().endsWith('.mp3') || file.type.includes('wav') || file.name.toLowerCase().endsWith('.wav')) {
        setVibeFile(file);
      } else {
        setError("Only MP3 and WAV files are supported.");
      }
    }
  };

  const handleRecreateDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRecreate(true);
  };

  const handleRecreateDragLeave = () => {
    setIsDraggingRecreate(false);
  };

  const handleRecreateDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRecreate(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type.includes('mpeg') || file.type.includes('mp3') || file.name.toLowerCase().endsWith('.mp3') || file.type.includes('wav') || file.name.toLowerCase().endsWith('.wav')) {
        setRecreateForFile(file);
      } else {
        setError("Only MP3 and WAV files are supported.");
      }
    }
  };

  const handleStemsSearch = async () => {
    if (!requireAuth()) return;
    if (plugins.length === 0 && !isJsfxMode) return;
    if (!isVerified) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setError("Please complete the security verification first.");
      return;
    }
    const activeStems = stems.filter(s => s.file !== null);
    if (activeStems.length === 0) {
      setError("Please add at least one stem.");
      return;
    }

    setLoading(true);
    setAudioAnalysisLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      // Don't kill loading, just notify user it's taking a while.
      setError("Audio analysis is taking longer than expected. The files are quite large, but we're still processing...");
    }, 900000); 

    const validFiles = activeStems.map(s => s.file).filter((f): f is File => f !== null);
    const progressInterval = simulateGenerationProgress(getEstimatedSeconds('audio-search', validFiles));
    const filesToDelete: string[] = [];

    try {
      // Upload all stems
      const uploadedStems = [];
      for (let i = 0; i < activeStems.length; i++) {
        const stem = activeStems[i];
        if (!stem.file) continue;
        
        if (stem.uri && stem.status === 'ready') {
          // Skip re-uploading if already uploaded successfully in a previous failed attempt
          uploadedStems.push(stem);
          continue;
        }

        let fileToUpload = stem.file;
        
        // Convert WAV to MP3 if necessary
        if (fileToUpload.type.includes('wav') || fileToUpload.name.toLowerCase().endsWith('.wav')) {
          setStems(prev => prev.map(s => s.id === stem.id ? { ...s, status: 'converting' as any } : s));
          try {
            fileToUpload = await convertWavToMp3(fileToUpload);
            // Assign back to the activeStems list so that browser-side pre-analysis analyzes the lightweight MP3
            stem.file = fileToUpload;
            setStems(prev => prev.map(s => s.id === stem.id ? { ...s, file: fileToUpload } : s));
          } catch (e) {
            console.error(`Failed to convert ${fileToUpload.name} to MP3, falling back to original file:`, e);
          }
        }

        setStems(prev => prev.map(s => s.id === stem.id ? { ...s, status: 'uploading' } : s));
        const uploadData = await uploadFileChunked(fileToUpload);
        if (uploadData) {
          if (uploadData.fileId) filesToDelete.push(uploadData.fileId);
          uploadedStems.push({
            ...stem,
            url: uploadData.url,
            uri: uploadData.geminiFileUri,
            mimeType: fileToUpload.type === 'audio/mp3' ? 'audio/mpeg' : (fileToUpload.type || 'audio/mpeg'),
            status: 'ready' as const
          });
          setStems(prev => prev.map(s => s.id === stem.id ? { ...s, url: uploadData.url, uri: uploadData.geminiFileUri, status: 'ready' } : s));
        } else {
          throw new Error(`Failed to upload stem: ${stem.file.name}`);
        }
      }

      let finalReferenceTrack = referenceTrack;
      let referenceAudioBase64: string | null = null;
      let referenceGeminiFileUri: string | null = null;
      let activeReferenceFile: File | null = referenceTrackFile;
      
      if (activeReferenceFile) {
        let refFileToUpload = activeReferenceFile;
        // Convert WAV reference track to MP3 if necessary
        if (refFileToUpload.type.includes('wav') || refFileToUpload.name.toLowerCase().endsWith('.wav')) {
          try {
            refFileToUpload = await convertWavToMp3(refFileToUpload);
            activeReferenceFile = refFileToUpload; // Update local variable for downstream analysis
          } catch (e) {
            console.error(`Failed to convert reference track ${refFileToUpload.name} to MP3:`, e);
          }
        }
        const refUploadData = await uploadFileChunked(refFileToUpload);
        if (refUploadData) {
          finalReferenceTrack = refUploadData.url;
          if (refUploadData.fileId) filesToDelete.push(refUploadData.fileId);
          referenceGeminiFileUri = refUploadData.geminiFileUri || null;
        }
      }

      // Format stems context for Gemini
      const stemsContext = uploadedStems.map(s => `Stem: ${s.file!.name} (Type: ${s.type === 'Other' && s.customType ? s.customType : s.type}) - URI: ${s.uri}`).join('\n');
      let fullContext = `The user has uploaded ${activeStems.length} stems for analysis.\n\n${stemsContext}\n\nUser Context: ${critiqueContext}`;

      if (dawType === 'LUNA') {
        if (lunaSumming !== 'off') {
          fullContext += `\n\nCRITICAL LUNA DIRECTIVE: The user has enabled ${lunaSumming.toUpperCase()} SUMMING. You MUST include specific settings for the ${lunaSumming === 'api' ? 'API Vision Console' : 'Neve Summing'} extension on the busses and master fader. Do not ignore this.`;
        }
        if (lunaTape !== 'off') {
          fullContext += `\n\nCRITICAL LUNA DIRECTIVE: The user has enabled ${lunaTape.toUpperCase()} TAPE. You MUST include specific settings for the ${lunaTape === 'oxide' ? 'Oxide Tape' : 'Studer A800'} extension on the tracks and busses. Do not ignore this.`;
        }
      }
      if (isJsfxMode) {
        fullContext += `\n\nCRITICAL DIRECTIVE: YOU MUST ONLY RECOMMEND JSFX PLUGINS FOR THIS MIX CRITIQUE. DO NOT RECOMMEND ANY VST/AU PLUGINS. 
Only use valid, default REAPER JSFX (JS:). Here is a comprehensive list of actual standard JSFX categories and plugins to use as a reference:
- Compressors/Dynamics/Limiters: JS: 1175 Compressor, JS: Auto Expander, JS: LOSER/EventHorizon, JS: Fairly Childish Compressor/Limiter, JS: General Dynamics, JS: LOSER/1175, JS: LOSER/MGA_JSLimiter, JS: LOSER/MasterLimiter, JS: LOSER/MasterTom, JS: LOSER/compciter, JS: LOSER/gate, JS: LOSER/DDC, JS: Liteon/np1136peaklimiter, JS: Multi-Band Compressor, JS: 5-Band Compressor, JS: 3-Band Compressor, JS: Expander / Gate.
- EQ/Enhancers/Filters: JS: 3-Band EQ, JS: 4-Band EQ, JS: 5-Band Stereo EQ, JS: Auto-peaker, JS: Bandpass Filter, JS: DC Filter, JS: Exciter, JS: Huge Booty Bass Enhancer, JS: LOSER/3BandEQ, JS: LOSER/4BandEQ, JS: LOSER/5BandEQ, JS: LOSER/BasiQ, JS: LOSER/Filter, JS: LOSER/Filter_RC, JS: LOSER/MIDI_EQ, JS: LOSER/VCF, JS: LOSER/saturation, JS: LOSER/stereo_enhancer, JS: Liteon/3bandpeakfilter, JS: Liteon/applefilter12db, JS: Liteon/applefilter24db, JS: Liteon/butterworth24db, JS: Liteon/cheb24db, JS: Liteon/moog24db, JS: Liteon/presenceeq, JS: Liteon/rbj1073, JS: Liteon/rbjeq, JS: Liteon/saturator, JS: Liteon/shelveq, JS: Liteon/statevariable, JS: Liteon/statevariable2, JS: RBJ 1073 EQ, JS: RBJ 4-Band Semi-Parametric EQ, JS: RBJ 7-Band Graphic EQ, JS: RBJ Highpass/Lowpass Filters, JS: Saturation/Soft Clipper, JS: Teej/rbj12eq-teej, JS: 12-Band EQ, JS: Graphic EQ.
- Modulation/Time: JS: Chorus, JS: Chorus (Stereo), JS: Delay, JS: Delay w/ Chorus, JS: Delay w/ Tempo Ping-Pong, JS: Flanger, JS: Flanger (Stereo), JS: LOSER/FBDelay, JS: LOSER/FBFlanger, JS: LOSER/Flanger, JS: LOSER/Phaser, JS: LOSER/Tremolo, JS: Phaser, JS: Reverb, JS: Tremolo, JS: Delay (L/R).
- Guitar/Amp/Distortion: JS: Distortion, JS: Tube Harmonics, JS: Wah-Wah, JS: Wig-Wah.
- Utility/Routing/Imaging/Pitch: JS: 8-Channel Mixer, JS: Audio To MIDI Drum Trigger, JS: Band Splitter, JS: Band Joiner, JS: Dual Pan, JS: FFT Splitter, JS: FFT Splitter (3-band), JS: LOSER/CenterCanceler, JS: LOSER/Dither, JS: LOSER/Downjumper, JS: LOSER/TransientController, JS: LOSER/Upjumper, JS: LOSER/WaveShaper, JS: LOSER/WhiteNoise, JS: LOSER/goniometer, JS: LOSER/phase_rotator, JS: LOSER/pitch_shifter_2, JS: LOSER/stereofield, JS: Liteon/deesser, JS: Liteon/pinknoisegen, JS: Liteon/pseudostereo, JS: Multichannel Routing/Channel Mapper, JS: Phase Rotator, JS: Pitch Down-Shifter, JS: Pitch Octave Up, JS: Pitch Shifter, JS: Pitch/Detune, JS: SMPTE LTC Generator, JS: SMPTE LTC Reader/Meter, JS: Stereo Field, JS: Time Adjustment, JS: Volume/Pan Smoother v5, JS: 3-Band Splitter, JS: 4-Band Splitter, JS: 5-Band Splitter, JS: 8x8 Matrix Mixer, JS: 8-Way Panner, JS: Channel Mixer, JS: Super Pitch, JS: Transient Enhancer, JS: Tonifier, JS: Vocoder, JS: MS Decoder, JS: MS Encoder, JS: Stereo Upmix, JS: IX/Mixer_8xM-1xS, JS: IX/StereoPhaseInverter, JS: IX/PhaseAdjust, JS: IX/SwixMitz.
(Note: You may also recommend other standard Cockos JSFX modules such as those under the LOSER, Liteon, IX, and Utility directories).
Provide the exact JSFX plugin name and required sliders/parameters.`;
      }
      
      const activePlugins = plugins.filter(p => p.type !== 'Studio One Function');

      // Perform physical pre-analysis on each stem and reference track in the browser
      const stemsPhysicalMetrics: Record<string, any> = {};
      await Promise.all(
        activeStems.map(async (stem) => {
          if (stem.file) {
            try {
              const metrics = await analyzePhysicalCharacteristics(stem.file);
              stemsPhysicalMetrics[stem.file.name] = metrics;
            } catch (err) {
              console.warn(`Failed to pre-analyze stem: ${stem.file.name}`, err);
            }
          }
        })
      );

      let referencePhysicalMetrics: any = undefined;
      if (activeReferenceFile) {
        try {
          referencePhysicalMetrics = await analyzePhysicalCharacteristics(activeReferenceFile);
        } catch (err) {
          console.warn("Failed to pre-analyze reference track file:", err);
        }
      }

      // Perform a combined physical audio analysis of multiple stems playing concurrently
      // to build a 100% accurate virtual composite master bus and understand their joint behavior.
      const stemsFiles = activeStems.map(s => s.file).filter((f): f is File => f !== null);
      let combinedPhysicalMetrics: any = undefined;
      try {
        combinedPhysicalMetrics = await analyzeCombinedStems(stemsFiles, stemsPhysicalMetrics);
      } catch (err) {
        console.warn("Failed to compute combined stems physical metrics:", err);
      }

            let critique;
      if (audioMode === 'album') {
        critique = await getAlbumMasteringGuide(
          activePlugins,
          fullContext,
          i18n.language,
          uploadedStems,
          analogInstruments,
          analogHardware,
          starredPlugins,
          stemsPhysicalMetrics as any,
          combinedPhysicalMetrics as any,
          dawType,
          lunaSumming,
          lunaTape,
          user?.email
        );
      } else {
        critique = await getMixCritique(
          activePlugins, 
          null, 
          null, 
          'audio/mpeg', 
          isGangstaVox, 
          true, 
          fullContext, 
          null, 
          finalReferenceTrack, 
          referenceAudioBase64, 
          null, 
          referenceGeminiFileUri, 
          i18n.language, 
          uploadedStems, 
          analogInstruments, 
          analogHardware, 
          isBusMode, 
          isMultiBandMode, 
          isMasterMode, 
          isJsfxMode, 
          installedJsfxPacks, 
          starredPlugins,
          undefined,
          undefined,
          stemsPhysicalMetrics as any,
          dawType,
          lunaSumming,
          lunaTape,
          user?.email
        );
      }
      critique.id = Math.random().toString(36).substr(2, 9);
      critique.isMasterMode = isMasterMode;
      critique.isJsfxMode = isJsfxMode;
      critique.audioBase64 = null;
      critique.mimeType = 'audio/mpeg';

      // Charge user for stems (base cost + per file + per MB)
      const totalSizeMB = activeStems.reduce((acc, stem) => acc + (stem.file?.size || 0), 0) / (1024 * 1024);
      const stemCost = 10 + (activeStems.length * 2) + Math.ceil(totalSizeMB * 0.5);
      logReceipt(audioMode === 'album' ? 'Album Mastering Analysis' : 'Stems Mix Critique', stemCost);

      setCritiques([critique]);
      setAudioMode('critique');
      setCritiqueContext('');
      setReferenceTrack('');
      setReferenceTrackFile(null);
      // Wait to clear stems so that DAWProject export can retain the locally uploaded files.
      // setStems(prev => prev.map(s => ({ ...s, file: null, status: 'empty' as const, mimeType: '' })));
      
      // Do not auto-backup critiques when freshly analyzed, only when saved to vault
      /*
      if (user && autoBackupPrefs.critiques) {
        handleExecuteCloudSync('backup', { gear: false, settings: false, recipes: false, critiques: true }, true);
      }
      */
    } catch (err: any) {
      console.error("Failed to analyze stems:", err);
      if (err?.message?.includes("INSUFFICIENT_CREDITS") || err?.message?.includes("402")) {
        setCreditError(err.message);
        setShowBuyCreditsModal(true);
      } else {
        setError("Failed to analyze stems. Please try again.");
      }
    } finally {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      setLoading(false);
      setAudioAnalysisLoading(false);
      setGenerationProgress(0);
      setGenerationEta(0);
      
      if (filesToDelete.length > 0) {
        for (const fileId of filesToDelete) {
          deleteFileFromDrive(fileId).catch(e => console.error("Failed to cleanup file:", e));
        }
      }
    }
  };

  const updateStemType = (index: number, type: string, customType?: string) => {
    const newStems = [...stems];
    if (type !== undefined) newStems[index].type = type;
    if (customType !== undefined) newStems[index].customType = customType;
    setStems(newStems);
    
    if (type !== undefined) {
      const newPreset = newStems.map(s => s.type);
      setStemTypesPreset(newPreset);
    }
    if (customType !== undefined) {
      const newCustomPreset = newStems.map(s => s.customType || '');
      setStemCustomTypesPreset(newCustomPreset);
    }
    
    // Save to cloud if auto-backup is enabled
    if (user && autoBackupPrefs.settings) {
      handleExecuteCloudSync('backup', { gear: false, settings: true, recipes: false, critiques: false }, true);
    }
  };

  const handleAudioSearch = async (file: File | null, linkUrl?: string) => {
    if (!requireAuth()) return;
    
    if (plugins.length === 0 && !isJsfxMode) return;
    if (!isVerified) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setError("Please complete the security verification first.");
      return;
    }

    let processFile: File | null = null;
    let processRecreateFile: File | null = null;

    if (audioMode === 'recipe') {
      processFile = vibeFile;
      processRecreateFile = recreateForFile;
      if (!processFile) {
        setError("Please upload at least the Vibe Audio file to analyze.");
        return;
      }
    } else {
      processFile = file;
    }

    if (processFile) {
      if (!processFile.type.includes('mpeg') && !processFile.type.includes('mp3') && !processFile.name.toLowerCase().endsWith('.mp3') && !processFile.type.includes('wav') && !processFile.name.toLowerCase().endsWith('.wav')) {
        setError("Only MP3 and WAV files are supported for analysis at this time.");
        return;
      }
      
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      if (processFile.size > MAX_FILE_SIZE) {
        setError("Vibe audio file is too large. Please upload an audio file smaller than 50MB.");
        return;
      }
    }

    if (processRecreateFile) {
      if (!processRecreateFile.type.includes('mpeg') && !processRecreateFile.type.includes('mp3') && !processRecreateFile.name.toLowerCase().endsWith('.mp3') && !processRecreateFile.type.includes('wav') && !processRecreateFile.name.toLowerCase().endsWith('.wav')) {
        setError("Only MP3 and WAV files are supported for target recreation.");
        return;
      }
      
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
      if (processRecreateFile.size > MAX_FILE_SIZE) {
        setError("Recreate target audio file is too large. Please upload an audio file smaller than 50MB.");
        return;
      }
    }

    if (!processFile && !linkUrl && audioMode !== 'recipe') {
      setError("Please provide an audio file or a link.");
      return;
    }
    
    setLoading(true);
    setAudioAnalysisLoading(true);
    setError(null);

    // Warn user but do not stop loading if it crosses 15 minutes.
    const timeoutId = setTimeout(() => {
      setError("Audio analysis is taking longer than expected. The files might be very complex, but we're still trying...");
    }, 900000); 

    const activeFilesForETA = [processFile, processRecreateFile].filter((f): f is File => f !== null);
    const progressInterval = simulateGenerationProgress(getEstimatedSeconds('audio-search', activeFilesForETA.length > 0 ? activeFilesForETA : undefined));
    const filesToDelete: string[] = [];

    try {
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const result = reader.result as string;
            // Remove the data:audio/mpeg;base64, prefix
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = (error) => reject(error);
        });
      };

      let audioBase64: string | null = null;
      let audioUrl: string | null = linkUrl || null;
      let geminiFileUri: string | null = null;
      let mimeType = 'audio/mpeg';
      
      // Use outer processFile which correctly points to vibeFile when audioMode === 'recipe'

      if (!processFile && linkUrl) {
        const urlLower = linkUrl.toLowerCase();
        const isWebLink = 
          urlLower.includes('youtube.com') || 
          urlLower.includes('youtu.be') || 
          urlLower.includes('spotify.com') || 
          urlLower.includes('soundcloud.com') ||
          urlLower.includes('apple.com') ||
          urlLower.includes('instagram.com') ||
          urlLower.includes('tiktok.com') ||
          (!urlLower.endsWith('.mp3') && !urlLower.endsWith('.wav') && !urlLower.endsWith('.m4a') && !urlLower.endsWith('.ogg') && !urlLower.endsWith('.flac') && !urlLower.endsWith('.aif') && !urlLower.endsWith('.aiff') && !urlLower.endsWith('.mp4'));

        if (isWebLink) {
          console.log("Web streaming link detected. Bypassing audio download, analyzing textually directly via Gemini.");
          const proceed = window.confirm("WARNING: YouTube/Spotify links are currently analyzed TEXTUALLY by AI (it guesses the beat based on the title, it cannot actually listen to the URL).\n\nTo get an EXACT replica where the AI actually listens to the sound, please click Cancel, download the MP3/WAV yourself, and upload the file directly.\n\nDo you still want to proceed with textual guessing (uses credits)?");
          if (!proceed) {
            setLoading(false);
            setAudioAnalysisLoading(false);
            clearInterval(progressInterval);
            clearTimeout(timeoutId);
            setGenerationProgress(0);
            return;
          }
        } else {
          let res: Response | null = null;
          try {
            res = await fetch(linkUrl);
            if (!res.ok && res.status !== 404 && res.status !== 403) {
              res = null; // Force proxy fallback if it's not a hard failure
            }
          } catch (directErr) {
            console.warn("Direct fetch failed (likely CORS), falling back to proxy...", directErr);
          }
          
          if (!res || !res.ok) {
             res = await fetch('/api/proxy-audio', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ url: linkUrl })
             });
          }
          
          if (!res.ok) {
             let errMsg = 'Failed to fetch audio from link.';
             try {
                const errData = await res.json();
                errMsg = errData.error || errMsg;
             } catch(e) { }
             throw new Error(errMsg);
          }
          
          try {
            const blob = await res.blob();
            let extension = 'mp3';
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('wav')) extension = 'wav';
            else if (contentType.includes('flac')) extension = 'flac';
            processFile = new File([blob], `downloaded_link.${extension}`, { type: contentType || 'audio/mpeg' });
          } catch (e: any) {
            throw new Error(`Could not process audio data: ${e.message}`);
          }
        }
      }

      if (processFile) {
        let fileToUpload = processFile;

        if (fileToUpload.type.includes('wav') || fileToUpload.name.toLowerCase().endsWith('.wav')) {
          try {
            fileToUpload = await convertWavToMp3(fileToUpload);
            processFile = fileToUpload; // Use the lightweight MP3 version for browser-side pre-analysis
          } catch (e) {
            console.error(`Failed to convert ${fileToUpload.name} to MP3, falling back to original file:`, e);
          }
        }

        const audioUploadData = await uploadFileChunked(fileToUpload);
        audioUrl = audioUploadData?.url || null;
        geminiFileUri = audioUploadData?.geminiFileUri || null;
        mimeType = (fileToUpload.type === 'audio/mp3' || !fileToUpload.type) ? 'audio/mpeg' : fileToUpload.type;

        if (!geminiFileUri) {
          console.warn(`Gemini File API upload failed. Debug Info:`, audioUploadData);
          if (fileToUpload.size > 3 * 1024 * 1024) {
            throw new Error(`File is too large (${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB) for inline analysis on Vercel (limit 4.5MB) and Gemini File Upload failed: ${audioUploadData?.geminiError || 'Unknown error'}`);
          }
          console.warn(`Falling back to inline base64 for small file (${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB).`);
          audioBase64 = await fileToBase64(fileToUpload);
        }

        if (audioUploadData?.fileId) {
          filesToDelete.push(audioUploadData.fileId);
        }
      }

      let recreateBase64: string | null = null;
      let recreateFileUri: string | null = null;
      let recreateMimeType: string | null = null;

      if (processRecreateFile) {
        let recFileToUpload = processRecreateFile;

        if (recFileToUpload.type.includes('wav') || recFileToUpload.name.toLowerCase().endsWith('.wav')) {
          try {
            recFileToUpload = await convertWavToMp3(recFileToUpload);
            processRecreateFile = recFileToUpload;
          } catch (e) {
            console.error(`Failed to convert recreate file ${recFileToUpload.name} to MP3, falling back to original file:`, e);
          }
        }

        const recUploadData = await uploadFileChunked(recFileToUpload);
        recreateFileUri = recUploadData?.geminiFileUri || null;
        recreateMimeType = (recFileToUpload.type === 'audio/mp3' || !recFileToUpload.type) ? 'audio/mpeg' : recFileToUpload.type;

        if (!recreateFileUri) {
          console.warn(`Gemini File API upload failed for recreate file. Debug Info:`, recUploadData);
          if (recFileToUpload.size > 3 * 1024 * 1024) {
            throw new Error(`Recreate target file is too large (${(recFileToUpload.size / 1024 / 1024).toFixed(2)}MB) for inline analysis and Gemini File Upload failed: ${recUploadData?.geminiError || 'Unknown error'}`);
          }
          console.warn(`Falling back to inline base64 for small recreate file.`);
          recreateBase64 = await fileToBase64(recFileToUpload);
        }

        if (recUploadData?.fileId) {
          filesToDelete.push(recUploadData.fileId);
        }
      }

      if (audioMode === 'critique') {
        if (!requireAuth()) return;
        
        let finalReferenceTrack = referenceTrack;
        let referenceAudioBase64: string | null = null;
        let referenceGeminiFileUri: string | null = null;
        
        let processRefFile = referenceTrackFile;
        if (!processRefFile && referenceTrack) {
          let res: Response | null = null;
          try {
            res = await fetch(referenceTrack);
            if (!res.ok && res.status !== 404 && res.status !== 403) {
              res = null; // force proxy
            }
          } catch(e) {
            console.warn("Direct fetch for ref track failed:", e);
          }
          
          if (!res || !res.ok) {
            try {
              res = await fetch('/api/proxy-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: referenceTrack })
              });
            } catch(e) { }
          }
          
          if (res && res.ok) {
            try {
              const blob = await res.blob();
              let extension = 'mp3';
              const contentType = res.headers.get('content-type') || '';
              if (contentType.includes('wav')) extension = 'wav';
              else if (contentType.includes('flac')) extension = 'flac';
              processRefFile = new File([blob], `ref_downloaded_link.${extension}`, { type: contentType || 'audio/mpeg' });
            } catch (e: any) {
              console.warn("Could not process reference track url:", e);
            }
          } else if (res && !res.ok) {
              let errMsg = 'Failed to fetch reference audio.';
              try {
                  const errData = await res.json();
                  errMsg = errData.error || errMsg;
              } catch(e) {}
              throw new Error(errMsg);
          }
        }

        if (processRefFile) {
          let refFileToUpload = processRefFile;
          if (refFileToUpload.type.includes('wav') || refFileToUpload.name.toLowerCase().endsWith('.wav')) {
            try {
              refFileToUpload = await convertWavToMp3(refFileToUpload);
              processRefFile = refFileToUpload; // Use the lightweight MP3 version for browser-side pre-analysis
            } catch (e) {
              console.error(`Failed to convert ${refFileToUpload.name} to MP3, falling back to original file:`, e);
            }
          }

          const refUploadData = await uploadFileChunked(refFileToUpload);
          if (refUploadData) {
            finalReferenceTrack = refUploadData.url;
            referenceGeminiFileUri = refUploadData.geminiFileUri || null;
            if (refUploadData.fileId) {
              filesToDelete.push(refUploadData.fileId);
            }
          }
          if (!referenceGeminiFileUri) {
            console.warn(`Gemini File API upload failed for reference track.`);
            if (refFileToUpload.size > 3 * 1024 * 1024) {
              throw new Error(`Reference track file is too large (${(refFileToUpload.size / 1024 / 1024).toFixed(2)}MB) for inline analysis on Vercel (limit 4.5MB) and Gemini File Upload failed: ${refUploadData?.geminiError || 'Unknown error'}`);
            }
            referenceAudioBase64 = await fileToBase64(refFileToUpload);
          }
        }
        
        // Perform browser-side physical pre-analysis for multi-pass evaluation
        let physicalMetrics: any = undefined;
        if (processFile) {
          try {
            physicalMetrics = await analyzePhysicalCharacteristics(processFile);
          } catch (err) {
            console.warn("Failed to pre-analyze uploaded audio track:", err);
          }
        }

        let referencePhysicalMetrics: any = undefined;
        if (processRefFile) {
          try {
            referencePhysicalMetrics = await analyzePhysicalCharacteristics(processRefFile);
          } catch (err) {
            console.warn("Failed to pre-analyze reference track file:", err);
          }
        }

        const activePlugins = plugins.filter(p => p.type !== 'Studio One Function');

        let fullContext = critiqueContext;
        if (isJsfxMode) {
          fullContext += `\n\nCRITICAL DIRECTIVE: YOU MUST ONLY RECOMMEND JSFX PLUGINS FOR THIS MIX CRITIQUE. DO NOT RECOMMEND ANY VST/AU PLUGINS. 
Only use valid, default REAPER JSFX (JS:). Here is a comprehensive list of actual standard JSFX categories and plugins to use as a reference:
- Compressors/Dynamics/Limiters: JS: 1175 Compressor, JS: Auto Expander, JS: LOSER/EventHorizon, JS: Fairly Childish Compressor/Limiter, JS: General Dynamics, JS: LOSER/1175, JS: LOSER/MGA_JSLimiter, JS: LOSER/MasterLimiter, JS: LOSER/MasterTom, JS: LOSER/compciter, JS: LOSER/gate, JS: LOSER/DDC, JS: Liteon/np1136peaklimiter, JS: Multi-Band Compressor, JS: 5-Band Compressor, JS: 3-Band Compressor, JS: Expander / Gate.
- EQ/Enhancers/Filters: JS: 3-Band EQ, JS: 4-Band EQ, JS: 5-Band Stereo EQ, JS: Auto-peaker, JS: Bandpass Filter, JS: DC Filter, JS: Exciter, JS: Huge Booty Bass Enhancer, JS: LOSER/3BandEQ, JS: LOSER/4BandEQ, JS: LOSER/5BandEQ, JS: LOSER/BasiQ, JS: LOSER/Filter, JS: LOSER/Filter_RC, JS: LOSER/MIDI_EQ, JS: LOSER/VCF, JS: LOSER/saturation, JS: LOSER/stereo_enhancer, JS: Liteon/3bandpeakfilter, JS: Liteon/applefilter12db, JS: Liteon/applefilter24db, JS: Liteon/butterworth24db, JS: Liteon/cheb24db, JS: Liteon/moog24db, JS: Liteon/presenceeq, JS: Liteon/rbj1073, JS: Liteon/rbjeq, JS: Liteon/saturator, JS: Liteon/shelveq, JS: Liteon/statevariable, JS: Liteon/statevariable2, JS: RBJ 1073 EQ, JS: RBJ 4-Band Semi-Parametric EQ, JS: RBJ 7-Band Graphic EQ, JS: RBJ Highpass/Lowpass Filters, JS: Saturation/Soft Clipper, JS: Teej/rbj12eq-teej, JS: 12-Band EQ, JS: Graphic EQ.
- Modulation/Time: JS: Chorus, JS: Chorus (Stereo), JS: Delay, JS: Delay w/ Chorus, JS: Delay w/ Tempo Ping-Pong, JS: Flanger, JS: Flanger (Stereo), JS: LOSER/FBDelay, JS: LOSER/FBFlanger, JS: LOSER/Flanger, JS: LOSER/Phaser, JS: LOSER/Tremolo, JS: Phaser, JS: Reverb, JS: Tremolo, JS: Delay (L/R).
- Guitar/Amp/Distortion: JS: Distortion, JS: Tube Harmonics, JS: Wah-Wah, JS: Wig-Wah.
- Utility/Routing/Imaging/Pitch: JS: 8-Channel Mixer, JS: Audio To MIDI Drum Trigger, JS: Band Splitter, JS: Band Joiner, JS: Dual Pan, JS: FFT Splitter, JS: FFT Splitter (3-band), JS: LOSER/CenterCanceler, JS: LOSER/Dither, JS: LOSER/Downjumper, JS: LOSER/TransientController, JS: LOSER/Upjumper, JS: LOSER/WaveShaper, JS: LOSER/WhiteNoise, JS: LOSER/goniometer, JS: LOSER/phase_rotator, JS: LOSER/pitch_shifter_2, JS: LOSER/stereofield, JS: Liteon/deesser, JS: Liteon/pinknoisegen, JS: Liteon/pseudostereo, JS: Multichannel Routing/Channel Mapper, JS: Phase Rotator, JS: Pitch Down-Shifter, JS: Pitch Octave Up, JS: Pitch Shifter, JS: Pitch/Detune, SMPTE LTC Generator, JS: SMPTE LTC Reader/Meter, JS: Stereo Field, JS: Time Adjustment, JS: Volume/Pan Smoother v5, JS: 3-Band Splitter, JS: 4-Band Splitter, JS: 5-Band Splitter, JS: 8x8 Matrix Mixer, JS: 8-Way Panner, JS: Channel Mixer, JS: Super Pitch, JS: Transient Enhancer, JS: Tonifier, JS: Vocoder, JS: MS Decoder, JS: MS Encoder, JS: Stereo Upmix, JS: IX/Mixer_8xM-1xS, JS: IX/StereoPhaseInverter, JS: IX/PhaseAdjust, JS: IX/SwixMitz.
(Note: You may also recommend other standard Cockos JSFX modules such as those under the LOSER, Liteon, IX, and Utility directories).
Provide the exact JSFX plugin name and required sliders/parameters.`;
        }

        const critique = await getMixCritique(
          activePlugins, 
          audioBase64, 
          audioUrl, 
          mimeType, 
          isGangstaVox, 
          hasStems, 
          fullContext, 
          null, 
          finalReferenceTrack, 
          referenceAudioBase64, 
          geminiFileUri, 
          referenceGeminiFileUri, 
          i18n.language, 
          undefined, 
          analogInstruments, 
          analogHardware, 
          isBusMode, 
          isMultiBandMode, 
          isMasterMode, 
          isJsfxMode, 
          installedJsfxPacks, 
          starredPlugins,
          physicalMetrics,
          referencePhysicalMetrics,
          undefined,
          dawType,
          lunaSumming,
          lunaTape,
          user?.email
        );
        critique.id = Math.random().toString(36).substr(2, 9);
        critique.isMasterMode = isMasterMode;
        critique.isJsfxMode = isJsfxMode;
        critique.audioBase64 = audioBase64;
        critique.geminiFileUri = geminiFileUri;
        critique.mimeType = mimeType;

        // Retain the original audio file until a new one is uploaded
        setCurrentAudioInfo({
          audioBase64,
          audioUrl,
          geminiFileUri,
          mimeType
        });

        clearInterval(progressInterval);
        setGenerationProgress(100);
        clearTimeout(timeoutId);
        
        const isWav = mimeType.includes('audio/wav');
        logReceipt(isWav ? 'Mix Critique (WAV)' : 'Mix Critique', isWav ? 25 : 10);
        
        setCritiques([critique]);
        setRecipes([]);
        setShowFairy(true);
      } else {
        let response;
        try {
          if (!requireAuth()) return;

          let finalContext = critiqueContext;
          if (audioUrl || audioBase64 || geminiFileUri) {
            finalContext = finalContext + (finalContext ? "\n\n" : "") + "CRITICAL SYSTEM INSTRUCTION: The user wants an EXACT REPLICA of this beat. Provide a precise, step-by-step recipe to completely recreate this specific song's beat exactly how it sounds in the provided link/audio. It MUST be an exact replica, do not just make something 'in the style of', make it an EXACT reproduction of the instruments, chords, drum patterns, and sound design of the source audio. YOU MUST NOT LEAVE ANY BLANK OR EMPTY PARAMETERS ON ANY VST OR FX PLUGIN. EVERY SINGLE DEEPDIVE PARAMETER ARRAY MUST BE EXHAUSTIVELY POPULATED TO ACHIEVE THIS LEVEL OF REALISM. IN ADDITION, ALL MIDI PATTERNS MUST BE HIGLY CREATIVE, SYNCATED, DYNAMIC, ENJOYABLE, AND EXACTLY MATCH THE MOVEMENT OF THE SOURCE AUDIO - STRICTLY FORBIDDEN FROM GENERATING PLAIN REPETITIVE NOTE SLOP.";
          }


          if (dawType === 'LUNA') {
            if (lunaSumming !== 'off') {
              finalContext = finalContext + (finalContext ? "\n\n" : "") + `CRITICAL LUNA DIRECTIVE: The user has enabled ${lunaSumming.toUpperCase()} SUMMING. You MUST include specific settings for the ${lunaSumming === 'api' ? 'API Vision Console' : 'Neve Summing'} extension on the busses and master fader. Do not ignore this.`;
            }
            if (lunaTape !== 'off') {
              finalContext = finalContext + (finalContext ? "\n\n" : "") + `CRITICAL LUNA DIRECTIVE: The user has enabled ${lunaTape.toUpperCase()} TAPE. You MUST include specific settings for the ${lunaTape === 'oxide' ? 'Oxide Tape' : 'Studer A800'} extension on the tracks and busses. Do not ignore this.`;
            }
          }

          response = await getAudioBeatRecommendations(
            plugins,
            audioBase64,
            audioUrl,
            mimeType,
            analogInstruments,
            analogHardware,
            drumKits,
            excludeAnalog,
            dawType,
            starredPlugins,
            isGangstaVox,
            finalContext,
            geminiFileUri,
            i18n.language,
            isMultiBandMode,
            isJsfxMode,
            installedJsfxPacks,
            recreateBase64,
            recreateFileUri,
            recreateMimeType,
            xpandPresets
          );
        } catch (apiErr: any) {
          console.warn("Initial audio analysis failed, retrying with minimal plugin list...", apiErr);
          // Retry with a very small plugin list (top 30) to reduce context pressure
          try {
            if (!requireAuth()) return;
            
            let finalContext = critiqueContext;
            if (audioUrl || audioBase64 || geminiFileUri) {
              finalContext = finalContext + (finalContext ? "\n\n" : "") + "CRITICAL SYSTEM INSTRUCTION: The user wants an EXACT REPLICA of this beat. Provide a precise, step-by-step recipe to completely recreate this specific song's beat exactly how it sounds in the provided link/audio. It MUST be an exact replica, do not just make something 'in the style of', make it an EXACT reproduction of the instruments, chords, drum patterns, and sound design of the source audio. YOU MUST NOT LEAVE ANY BLANK OR EMPTY PARAMETERS ON ANY VST OR FX PLUGIN. EVERY SINGLE DEEPDIVE PARAMETER ARRAY MUST BE EXHAUSTIVELY POPULATED TO ACHIEVE THIS LEVEL OF REALISM. IN ADDITION, ALL MIDI PATTERNS MUST BE HIGLY CREATIVE, SYNCATED, DYNAMIC, ENJOYABLE, AND EXACTLY MATCH THE MOVEMENT OF THE SOURCE AUDIO - STRICTLY FORBIDDEN FROM GENERATING PLAIN REPETITIVE NOTE SLOP.";
            }


            if (dawType === 'LUNA') {
              if (lunaSumming !== 'off') {
                finalContext = finalContext + (finalContext ? "\n\n" : "") + `CRITICAL LUNA DIRECTIVE: The user has enabled ${lunaSumming.toUpperCase()} SUMMING. You MUST include specific settings for the ${lunaSumming === 'api' ? 'API Vision Console' : 'Neve Summing'} extension on the busses and master fader. Do not ignore this.`;
              }
              if (lunaTape !== 'off') {
                finalContext = finalContext + (finalContext ? "\n\n" : "") + `CRITICAL LUNA DIRECTIVE: The user has enabled ${lunaTape.toUpperCase()} TAPE. You MUST include specific settings for the ${lunaTape === 'oxide' ? 'Oxide Tape' : 'Studer A800'} extension on the tracks and busses. Do not ignore this.`;
              }
            }

            response = await getAudioBeatRecommendations(
              plugins.slice(0, 30),
              audioBase64,
              audioUrl,
              mimeType,
              analogInstruments,
              analogHardware,
              drumKits,
              excludeAnalog,
              dawType,
              starredPlugins,
              isGangstaVox,
              finalContext,
              geminiFileUri,
              i18n.language,
              false,
              isJsfxMode,
              installedJsfxPacks,
              recreateBase64,
              recreateFileUri,
              recreateMimeType,
              xpandPresets
            );
          } catch (retryErr: any) {
            console.error("Retry audio analysis failed:", retryErr);
            throw retryErr;
          }
        }

        clearInterval(progressInterval);
        setGenerationProgress(100);
        clearTimeout(timeoutId);
        
        if (response.recipes) {
          response.recipes = response.recipes.map(r => ({ ...r, isJsfxMode }));
        }

        const recipesWithAudio = response.recipes.map(r => ({
          ...r,
          audioBase64,
          geminiFileUri,
          mimeType
        }));
        
        setRecipes(recipesWithAudio);
        setCritiques([]);
        const newHistory: HistoryItem[] = recipesWithAudio.map(r => ({
          ...r,
          generatedAt: new Date().toISOString()
        }));
        setHistory(prev => [...newHistory, ...prev].slice(0, 50));
        
        const isWav = mimeType.includes('audio/wav');
        logReceipt(isWav ? 'Audio Analysis Recipe (WAV)' : 'Audio Analysis Recipe', isWav ? 25 : 10);
        
        setShowFairy(true);
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      console.error("Audio analysis error:", err);
      setLatestErrorLog(err?.stack || err?.message || String(err));
      
      if (err?.message?.includes("INSUFFICIENT_CREDITS") || err?.message?.includes("402")) {
        setCreditError(err.message);
        setShowBuyCreditsModal(true);
      } else if (err?.message?.includes("API_KEY_MISSING") || err?.message?.includes("401") || err?.message?.includes("403")) {
        setError(`Access error: ${err.message}. Please contact support or try again later.`);
      } else if (err?.message?.includes("decode")) {
        setError("Could not read this audio file. Try a standard MP3 or WAV under 50MB.");
      } else {
        const errorMsg = err?.message || err?.toString() || "Unknown error";
        setError(`Failed to analyze audio: ${errorMsg}. The file might be too complex or the AI is at its limit. Try a shorter clip!`);
      }
    } finally {
      // Delete the uploaded files from Drive after generation or error
      for (const fileId of filesToDelete) {
        try {
          await fetch('/api/delete-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId })
          });
        } catch (err) {
          console.error("Failed to delete file from Drive:", err);
        }
      }
      setLoading(false);
      setAudioAnalysisLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'coldest') return 'crazy-bird';
      if (prev === 'crazy-bird') {
        if (h_act) return 'hustle-time';
        if (c_act) return 'chef-mode';
        return 'coldest';
      }
      if (prev === 'hustle-time') {
        if (c_act) return 'chef-mode';
        return 'coldest';
      }
      if (prev === 'chef-mode') {
        return 'coldest';
      }
      return 'coldest';
    });
  };


  const toggleHighEyes = () => {
    const nextHigh = !highEyes;
    setHighEyes(nextHigh);
    if (nextHigh) {
      setIsCigarEquipped(true);
      setIsTossingCigar(false);
      setHasUnlockedBluntToggle(true);
      setDuragStyle('rasta');
    } else {
      if (duragStyle === 'rasta') {
        setDuragStyle('standard');
      }
    }
  };

  const handleBuyCredits = (credits: number) => {
    if (!requireAuth()) return;
    const amount = credits === 40 ? 5 : 10;
    setPurchaseType('credits');
    setPendingAmount(amount);
    setPendingCredits(credits);
    setShowBuyCreditsModal(false);
    setShowPaymentMethodModal(true);
  };

  const handleBuyStemSlots = (slotsToBuy: number) => {
    if (!requireAuth()) return;
    setPurchaseType('stem_slots');
    setPendingStemSlots(slotsToBuy);
    setPendingAmount(slotsToBuy * 3);
    setShowBuyStemsModal(false);
    setShowPaymentMethodModal(true);
  };

  const handlePaymentMethodSelect = async (method: 'card' | 'crypto') => {
    if (!user) return;
    setLoading(true);
    setShowPaymentMethodModal(false);

    try {
      if (purchaseType === 'stem_slots') {
        if (method === 'card') {
          const response = await fetch('/api/checkout-stems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slots: pendingStemSlots })
          });
          
          const data = await response.json();
          if (data.success) {
            if (data.checkoutUrl) window.location.href = data.checkoutUrl;
            else if (data.simulated) setUser(data.user);
          } else {
            setError(data.message || data.error || "Failed to initiate stems checkout.");
          }
        } else {
          // Crypto stems
          const response = await fetch('/api/payments/nowpayments/create-stems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slots: pendingStemSlots, userId: user.uid })
          });
          const data = await response.json();
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            setError(data.error || "Failed to create crypto invoice for stems. Please try again.");
          }
        }
      } else {
        // Credits purchase logic
        if (method === 'card') {
          const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: pendingCredits })
          });
          
          const data = await response.json();
          if (data.success) {
            if (data.checkoutUrl) {
              window.location.href = data.checkoutUrl;
            } else if (data.simulated) {
              setUser(data.user);
            }
          } else {
            setError(data.error || "Failed to initiate checkout.");
          }
        } else {
          // NowPayments Crypto
          const response = await fetch('/api/payments/nowpayments/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              amount: pendingAmount, 
              credits: pendingCredits,
              userId: user.uid
            })
          });

          const data = await response.json();
          if (data.invoice_url) {
            window.location.href = data.invoice_url;
          } else {
            setError(data.error || "Failed to create crypto invoice. Please try again.");
          }
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCigarToggle = () => {
    if (isCigarEquipped) {
      setIsTossingCigar(true);
      setTimeout(() => {
        setIsCigarEquipped(false);
        setIsTossingCigar(false);
      }, 1000);
    } else {
      setIsCigarEquipped(true);
      setIsTossingCigar(false);
    }
  };

  const cyclePendant = () => {
    const materials: PendantStyle[] = ['silver', 'gold', 'rose-gold', 'diamond', 'blue-diamond'];
    const currentIdx = materials.indexOf(pendantStyle);
    const nextIdx = (currentIdx + 1) % materials.length;
    setPendantStyle(materials[nextIdx]);
  };

  const cycleChain = () => {
    const materials: ChainStyle[] = ['silver', 'gold', 'rose-gold', 'diamond', 'blue-diamond'];
    const currentIdx = materials.indexOf(chainStyle);
    const nextIdx = (currentIdx + 1) % materials.length;
    setChainStyle(materials[nextIdx]);
  };

  const grillLabel = grillStyle === 'diamond' ? t('diamond_grill') : grillStyle === 'aquabberry-diamond' ? t('aquaberry_grill') : grillStyle === 'gold' ? t('gold_grill') : grillStyle === 'rose-gold' ? t('rose_gold_grill') : grillStyle === 'blue-diamond' ? t('blue_diamond_grill') : t('opal_grill');
  const knifeLabel = { 
    standard: t('standard_knife'), gold: t('gold_knife'), bloody: t('bloody_knife'), adamant: t('adamant_knife'), mythril: t('mythril_knife'), 'samuels-saber': t('saber_knife'), 'dark-saber': t('dark_saber_knife'), 'steak-knife': t('steak_knife_knife')
  }[knifeStyle];

  const duragLabel = {
    standard: t('durag_label'),
    'royal-green': t('royal_durag'),
    'dragonball-purple': t('purple_silk'),
    'sound-ninja': t('sound_ninja_durag'),
    rasta: t('rasta_hat_label'),
    'chef-hat': t('chef_hat')
  }[duragStyle];

  const themeClasses = theme === 'coldest' 
    ? "bg-sky-400 text-sky-900"
    : theme === 'crazy-bird'
    ? "bg-red-500 text-red-50"
    : theme === 'chef-mode'
    ? "bg-yellow-400 text-orange-900"
    : theme === 'hustle-time'
    ? "bg-emerald-900 text-yellow-400"
    : "bg-emerald-500 text-emerald-50";

  const mainBlurClass = 'backdrop-blur-2xl';
  const themedBtnClasses = theme === 'coldest' 
    ? 'bg-white/40 border-sky-100 text-sky-800' 
    : theme === 'chef-mode' 
    ? 'bg-white/60 border-orange-100 text-orange-950 shadow-orange-900/10' 
    : theme === 'hustle-time' 
    ? 'bg-black/40 border-white/10 text-white' 
    : 'bg-black/40 border-white/10 text-white';

  const getThemeActiveClasses = (theme: AppTheme) => {
    switch (theme) {
      case 'coldest': return 'bg-sky-500 text-white border-sky-400';
      case 'chef-mode': return 'bg-orange-500 text-white border-orange-400';
      case 'crazy-bird': return 'bg-[#600a0a] text-white border-[#4a0808]';
      case 'hustle-time': return 'bg-yellow-600 text-black border-yellow-500';
      default: return 'bg-white text-black border-white';
    }
  };

  const getDropdownTheme = (theme: AppTheme) => {
    switch (theme) {
      case 'coldest':
        return {
          container: 'bg-[#38bdf8] border-sky-600 text-sky-950 shadow-sky-900/40',
          text: 'text-sky-950',
          itemHover: 'hover:bg-sky-500/20 text-sky-950',
          iconBg: 'bg-sky-600/20 group-hover:bg-sky-600/30',
          divider: 'bg-sky-600/20'
        };
      case 'chef-mode':
        return {
          container: 'bg-orange-600 border-orange-800 text-white shadow-orange-900/40',
          text: 'text-white',
          itemHover: 'hover:bg-orange-500/40 text-white',
          iconBg: 'bg-orange-400/30 group-hover:bg-orange-400/50',
          divider: 'bg-orange-400/20'
        };
      case 'crazy-bird':
        return {
          container: 'bg-[#600a0a] border-[#4a0808] text-white shadow-red-950/40',
          text: 'text-white',
          itemHover: 'hover:bg-[#7a0d0d]/60 text-white',
          iconBg: 'bg-[#8a0f0f]/30 group-hover:bg-[#8a0f0f]/50',
          divider: 'bg-[#8a0f0f]/20'
        };
      case 'hustle-time':
        return {
          container: 'bg-yellow-500 border-yellow-700 text-black shadow-yellow-900/20',
          text: 'text-black',
          itemHover: 'hover:bg-yellow-400/40 text-black',
          iconBg: 'bg-yellow-600/20 group-hover:bg-yellow-600/40',
          divider: 'bg-yellow-700/20'
        };
      default:
        return {
          container: 'bg-[#111] border-white/10 text-white shadow-black/60',
          text: 'text-white',
          itemHover: 'hover:bg-white/10 text-slate-300',
          iconBg: 'bg-white/10 group-hover:bg-white/20',
          divider: 'bg-white/10'
        };
    }
  };

  const actionBtnClasses = `pointer-events-auto relative flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border shadow-xl transition-all hover:scale-105 active:scale-95 group ${mainBlurClass} text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap min-w-[120px] sm:min-w-[140px]`;
  const mobileToolbarBtnClasses = `flex flex-col items-center justify-center gap-1 p-2 flex-1 transition-all active:scale-90`;
  const mobileTrayBtnClasses = `pointer-events-auto relative flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border shadow-xl transition-all hover:scale-105 active:scale-95 group ${mainBlurClass} text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap min-w-[120px] sm:min-w-[140px]`;

  if (showStatusPage) {
    return (
      <StatusPage onBack={() => {
        if (window.location.hostname.startsWith('status.')) {
          window.location.href = 'https://beatgangsta.com';
        } else {
          setShowStatusPage(false);
        }
      }} />
    );
  }

  if (showJsfxDatabase) {
    return <JSFXDatabaseViewer onBack={() => setShowJsfxDatabase(false)} theme={theme} />;
  }

  if (showUadDatabase) {
    return <UadDatabaseViewer onBack={() => setShowUadDatabase(false)} theme={theme} />;
  }

  if (showXpandDatabase) {
    return (
      <XpandDatabaseViewer 
        onBack={() => setShowXpandDatabase(false)} 
        theme={theme} 
        xpandPresets={xpandPresets}
        setXpandPresets={setXpandPresets}
      />
    );
  }

  if (showJsfxAutomationChains) {
    return <JSFXAutomationChains onBack={() => setShowJsfxAutomationChains(false)} theme={theme} />;
  }

  if (showAdminDashboard) {
    return <AdminDashboard onBack={() => setShowAdminDashboard(false)} theme={theme} />;
  }

  return (
    <div className={`min-h-[100dvh] w-full overflow-x-hidden transition-colors duration-700 flex flex-col ${themeClasses} font-sans selection:bg-sky-200 pb-20 sm:pb-0`}>
      <AnimatePresence>
        {showWelcomeSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000000] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="text-center p-8 rounded-3xl bg-white/10 border border-white/20 shadow-2xl"
            >
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-sky-500/20 text-sky-400">
                  {showWelcomeSplash === 'back' ? <Rocket className="w-12 h-12" /> : <Sparkles className="w-12 h-12" />}
                </div>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-2">
                {showWelcomeSplash === 'back' ? t('welcome_back') : t('welcome_to_beatgangsta')}
              </h2>
              <p className="text-sky-200/70 font-medium">
                {showWelcomeSplash === 'back' 
                  ? t('resuming_session') 
                  : t('setting_up_assistant')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {theme === 'coldest' && (
          <motion.div
            key="snow-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <SnowFlurry />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`h-8 flex items-center justify-between px-3 text-[11px] font-bold select-none backdrop-blur-md border-b transition-all duration-500 z-[100] ${theme === 'coldest' ? 'bg-white/30 text-[#0c4a6e] border-white/20' : 'bg-black/40 text-red-100 border-red-900/30'}`}>
        <div className="flex items-center gap-2 relative">
          <button 
            id="btn-menu"
            onClick={() => setShowBrandMenu(!showBrandMenu)}
            className="flex items-center gap-2 hover:opacity-70 transition-all group"
          >
            <span className="tracking-wide uppercase whitespace-nowrap">{t('menu')}</span>
            <svg className={`w-2.5 h-2.5 transition-transform duration-300 ${showBrandMenu ? 'rotate-180' : ''} opacity-30 group-hover:opacity-100`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showTutorial && (
            <button
              onClick={handleCompleteTutorial}
              className="sm:hidden ml-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/10 text-white backdrop-blur-sm border border-white/20"
            >
              {t('exit_tutorial')}
            </button>
          )}

          {showBrandMenu && (
            <>
              <div className={`fixed inset-0 z-40`} onClick={() => setShowBrandMenu(false)} />
              <div className={`absolute top-full left-0 mt-1 w-64 p-2 rounded-2xl border shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200 ${getDropdownTheme(theme).container}`}>
                <button 
                  disabled={showTutorial}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTrashModal(true);
                    setShowBrandMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover} ${showTutorial ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${getDropdownTheme(theme).iconBg}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">{t('show_deleted_items')}</div>
                    <div className="text-[9px] opacity-50 mt-0.5">{t('restore_plugins_and_hardware')}</div>
                  </div>
                </button>
                <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />
                {m_act && isMasterAuthorized && (
                  <>
                    <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />
                  </>
                )}
                <button 
                  disabled={showTutorial}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlugins([]);
                    setCsvInput('');
                    setError(null);
                    setShowBrandMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover} ${showTutorial ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${getDropdownTheme(theme).iconBg}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">{t('update_plugin_list')}</div>
                    <div className="text-[9px] opacity-50 mt-0.5">{t('upload_new_plugin_file')}</div>
                  </div>
                </button>
                <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />
                <button 
                  disabled={showTutorial}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPasteModal(true);
                    setShowBrandMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover} ${showTutorial ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${getDropdownTheme(theme).iconBg}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">{t('paste_plugin_list')}</div>
                    <div className="text-[9px] opacity-50 mt-0.5">{t('manually_enter_plugins')}</div>
                  </div>
                </button>
                <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />
                <button 
                  disabled={showTutorial}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Are you sure you want to clear your entire gear rack? This cannot be undone.")) {
                      handleResetLibrary();
                      setAnalogInstruments([]);
                      setAnalogHardware([]);
                      setCsvInput('');
                      setError(null);
                      setShowBrandMenu(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group hover:bg-red-500/10 ${showTutorial ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors bg-red-500/20 text-red-500 group-hover:bg-red-500 group-hover:text-white`}>
                    <Trash2 size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-red-500">Clear All Gear</div>
                    <div className="text-[9px] opacity-50 mt-0.5">Reset your plugin & hardware rack</div>
                  </div>
                </button>
                <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />
                <button 
                  disabled={showTutorial}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDawModalSource('menu');
                    setShowDawModal(true);
                    setShowBrandMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover} ${showTutorial ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${getDropdownTheme(theme).iconBg}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">{t('change_daw')}</div>
                    <div className="text-[9px] opacity-50 mt-0.5">{t('switch_daw_features')}</div>
                  </div>
                </button>
                <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />

                <button 
                  disabled={showTutorial}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAllData();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover} ${showTutorial ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${theme === 'coldest' ? 'bg-[#f38020] text-white' : 'bg-white text-black'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">{t('delete_browser_data')}</span>
                    <span className="text-[8px] font-bold opacity-50">{t('removes_plugins_desc')}</span>
                  </div>
                </button>

                <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />

                {m_act && (
                  <>
                    <button 
                      disabled={showTutorial}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (showRigUI) {
                          localStorage.setItem('bg_skip_auth', 'true');
                          setHasAcceptedTerms(true);
                        } else {
                          localStorage.removeItem('bg_skip_auth');
                          setHasAcceptedTerms(false);
                        }
                        localStorage.removeItem('bg_tutorial_completed');
                        setVerificationSessionId(prev => prev + 1);
                        setTutorialPhase('init');
                        setTutorialStep(0);
                        setShowTutorial(true);
                        setShowBrandMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover} ${showTutorial ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${getDropdownTheme(theme).iconBg}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-wider">{t('restart_tutorial')}</span>
                        <span className="text-[8px] font-bold opacity-50">{t('show_welcome_guide_again')}</span>
                      </div>
                    </button>
                    
                    <div className={`h-[1px] ${getDropdownTheme(theme).divider} my-1`} />
                  </>
                )}
                
                <button 
                  disabled={showTutorial}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFriendsInfo(true);
                    setShowBrandMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left group ${getDropdownTheme(theme).itemHover} ${showTutorial ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${getDropdownTheme(theme).iconBg}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">{t('coldestconcept_x_friends')}</span>
                    <span className="text-[8px] font-bold opacity-50">{t('collective_and_credits')}</span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowStatusPage(true)}
            className={`group flex items-center justify-center gap-2 px-3 py-1.5 rounded-full shadow-lg transition-all active:scale-95 border ${mainBlurClass} ${themedBtnClasses}`}
            title="System Status"
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              systemStatus === 'operational' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
              systemStatus === 'degraded' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 
              systemStatus === 'outage' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-400'
            }`} />
            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">
              {systemStatus === 'operational' ? 'Live' : systemStatus === 'loading' ? '...' : 'Status'}
            </span>
          </button>

          <button
            onClick={() => setShowInternationalizationModal(true)}
            className={`group flex items-center justify-center gap-2 px-3 py-1.5 rounded-full shadow-lg transition-all active:scale-95 border ${mainBlurClass} ${themedBtnClasses}`}
            title={t('select_language')}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">
              {i18n.language.toUpperCase()} | {currentCountry}
            </span>
          </button>

          {!user ? (
            <div className="flex items-center">
              <button 
                id="btn-google-signin"
                onClick={handleGoogleSignIn} 
                className={`group flex items-center justify-center gap-2 px-4 py-1.5 rounded-full shadow-lg transition-all active:scale-95 border ${mainBlurClass} ${themedBtnClasses}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                </svg>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">{t('sign_in')}</span>
              </button>
            </div>
          ) : (
            <div className="relative flex items-center gap-2">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full border shadow-md transition-all hover:scale-105 active:scale-95 ${mainBlurClass} ${themedBtnClasses}`}
              >
                <div className="relative w-5 h-5 group">
                  <img src={user.photo} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  {isRecording && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-sm" />
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider truncate max-w-[70px] sm:max-w-[120px]">{user.name}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              
              <AnimatePresence>
              </AnimatePresence>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className={`absolute top-full right-0 mt-1 w-64 p-2 rounded-2xl border shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200 ${getDropdownTheme(theme).container}`}>
                    <div className="p-3 border-b border-current/10 mb-1 flex items-center justify-between">
                      <div className="overflow-hidden">
                        <p className="text-xs font-black uppercase tracking-wider truncate">{user.name}</p>
                        <p className="text-[9px] font-bold opacity-50 truncate">{user.email}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Zap size={12} className="fill-current" />
                          <span className="text-xs font-black">{user.credits !== undefined ? user.credits : '...'}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setCreditError(null);
                            setShowBuyCreditsModal(true);
                          }}
                          className="text-[8px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity underline underline-offset-2 mt-0.5"
                        >
                          Buy More
                        </button>
                      </div>
                    </div>

                    <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />

                    <button 
                      onClick={() => {
                        if (isRecording) {
                          stopRecording();
                        } else {
                          setIsUserMenuOpen(false);
                          startRecording();
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : getDropdownTheme(theme).iconBg}`}>
                        <Video size={14} />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">{isRecording ? 'Stop Recording' : 'Record Showcase'}</div>
                        <div className="text-[9px] opacity-50 mt-0.5">{isRecording ? 'Click to save video' : 'Capture your app workflow'}</div>
                      </div>
                    </button>

                    {(user?.email === 'recognizemiracles@gmail.com' || user?.email === 'coldestconcept@gmail.com') && (
                      <>
                        <button 
                          onClick={() => {
                            setShowPdfSplitter(true);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover}`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${theme === 'coldest' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            <Scissors size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-extrabold flex items-center gap-1">
                              AI PDF Splitter
                              <span className="text-[7px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded border border-emerald-500/30">NEW</span>
                            </div>
                            <div className="text-[9px] opacity-50 mt-0.5">Split documents intelligently with AI</div>
                          </div>
                        </button>
                        <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />
                      </>
                    )}

                    {isAdminDashboardAuthorized && (
                      <>
                        <button 
                          onClick={() => {
                            setShowAdminDashboard(true);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover}`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${theme === 'coldest' ? 'bg-indigo-500 text-white' : 'bg-indigo-500/20 text-indigo-400'}`}>
                            <Database size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider">Admin Dashboard</div>
                            <div className="text-[9px] opacity-50 mt-0.5">Manage users & plugin data</div>
                          </div>
                        </button>
                        <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />
                      </>
                    )}

                    {(user?.email === 'recognizemiracles@gmail.com' || user?.email === 'coldestconcept@gmail.com') && (
                      <button 
                        onClick={() => {
                          setShowXpandDatabase(true);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${theme === 'coldest' ? 'bg-indigo-500 text-white' : 'bg-indigo-500/20 text-indigo-400'}`}>
                          <Database size={14} />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider">Xpand!2 DB</div>
                          <div className="text-[9px] opacity-50 mt-0.5">View Xpand preset reference</div>
                        </div>
                      </button>
                    )}

                    {(user?.email === 'recognizemiracles@gmail.com' || user?.email === 'coldestconcept@gmail.com' || user?.email === 'ruhedramarkprod@gmail.com') && (
                      <button 
                        onClick={() => {
                          setShowJsfxDatabase(true);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${theme === 'coldest' ? 'bg-fuchsia-500 text-white' : 'bg-fuchsia-500/20 text-fuchsia-400'}`}>
                          <Layers size={14} />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider">JSFX DB</div>
                          <div className="text-[9px] opacity-50 mt-0.5">View full plugin reference</div>
                        </div>
                      </button>
                    )}

                    {(user?.email === 'recognizemiracles@gmail.com' || user?.email === 'coldestconcept@gmail.com' || user?.email === 'ruhedramarkprod@gmail.com') && (
                      <button 
                        onClick={() => {
                          setShowUadDatabase(true);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${theme === 'coldest' ? 'bg-amber-500 text-white' : 'bg-amber-500/20 text-amber-500'}`}>
                          <Database size={14} />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-amber-500">UAD Hardware DB</div>
                          <div className="text-[9px] opacity-50 mt-0.5">UAD Precision Hardware Guide</div>
                        </div>
                      </button>
                    )}

                    {(user?.email === 'recognizemiracles@gmail.com' || user?.email === 'coldestconcept@gmail.com' || user?.email === 'ruhedramarkprod@gmail.com') && (
                      <button 
                        onClick={() => {
                          setShowJsfxAutomationChains(true);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${theme === 'coldest' ? 'bg-fuchsia-500 text-white' : 'bg-fuchsia-500/20 text-fuchsia-400'}`}>
                          <Zap size={14} />
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider">JSFX Automation Chains</div>
                          <div className="text-[9px] opacity-50 mt-0.5">Explore producer automation tricks</div>
                        </div>
                      </button>
                    )}

                    <button 
                      onClick={() => {
                        setCloudSyncMode('setup');
                        setShowCloudSyncModal(true);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${getDropdownTheme(theme).iconBg}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">{t('cloud_sync_settings')}</div>
                        <div className="text-[9px] opacity-50 mt-0.5">{t('manage_auto_backups')}</div>
                      </div>
                    </button>

                    {user && (
                      <a 
                        href={cloudDriveUrl || '#'}
                        target={cloudDriveUrl ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        onClick={(e) => { if (!cloudDriveUrl) e.preventDefault(); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${!cloudDriveUrl ? 'opacity-50 cursor-not-allowed' : ''} ${getDropdownTheme(theme).itemHover}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${getDropdownTheme(theme).iconBg}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider">
                            {cloudDriveUrl ? t('manage_cloud_backup') : (cloudDriveError ? t('drive_link_error') : t('connecting_to_drive'))}
                          </div>
                          <div className="text-[9px] opacity-50 mt-0.5">
                            {cloudDriveUrl ? t('open_google_drive') : (cloudDriveError ? t('try_backing_up_first') : t('please_wait'))}
                          </div>
                        </div>
                      </a>
                    )}

                    <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />

                    <button 
                      onClick={handleSignOut}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${getDropdownTheme(theme).iconBg}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">{t('sign_out')}</div>
                        <div className="text-[9px] opacity-50 mt-0.5">{t('logout_account')}</div>
                      </div>
                    </button>

                    <div className={`h-px w-full my-1 ${getDropdownTheme(theme).divider}`} />

                    <button 
                      onClick={handleDeleteCloudData}
                      disabled={isDeletingAccount}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover} disabled:opacity-50`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${getDropdownTheme(theme).iconBg}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">{isDeletingAccount ? t('processing') : t('clear_cloud_storage')}</div>
                        <div className="text-[9px] opacity-50 mt-0.5">{t('delete_drive_backup')}</div>
                      </div>
                    </button>

                    <button 
                      onClick={() => { setIsUserMenuOpen(false); setShowDeleteConfirm(true); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors group ${getDropdownTheme(theme).itemHover}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${theme === 'coldest' ? 'bg-red-500 text-white' : 'bg-red-500/10 group-hover:bg-red-500/20'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">{t('delete_account_data')}</div>
                        <div className="text-[9px] opacity-50 mt-0.5">{t('permanent_wipe')}</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Top Promotional Banner */}
      <div 
        className={`w-full h-8 flex items-center justify-center bg-black/10 backdrop-blur-md border-b border-white/5 z-[60] text-current text-[10px] font-black uppercase tracking-[0.4em] select-none overflow-hidden relative group`}
      >
        <div className="relative z-10 flex items-center gap-1">
          <span className="opacity-70">{t('best_producer_prefix')}</span>
          <a 
            href="https://www.youtube.com/channel/UC8gMzSxHRWzMzfIjdcqKvQw" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-red-500 transition-colors underline decoration-red-500/30 underline-offset-4"
          >
            {t('beats_link')}
          </a>
          <span className="opacity-70">{t('best_producer_suffix')}</span>
        </div>
        
        <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>

      <div className={theme === 'crazy-bird' ? 'contents' : 'hidden'}>
        <AvianField />
      </div>

      <AnimatePresence mode="wait">
        <React.Suspense fallback={null}>
          {theme === 'hustle-time' && (
            <motion.div
              key="hustle-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="fixed inset-0 z-0"
            >
              <LeprechaunField />
            </motion.div>
          )}
          {theme === 'chef-mode' && (
            <motion.div
              key="chef-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="fixed inset-0 z-0"
            >
              <FoodField />
            </motion.div>
          )}
          {showGuide && <DAWGuide theme={theme} onClose={() => setShowGuide(false)} userPlugins={plugins} />}
        </React.Suspense>
      </AnimatePresence>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${theme === 'coldest' ? 'bg-white border-black/10 text-black' : 'bg-zinc-900 border-white/10 text-white'}`}>
            <div className="p-6 border-b border-current/10">
              <h2 className="text-xl font-black uppercase tracking-wider text-red-500 mb-2">Delete Account & Data</h2>
              <p className="text-sm opacity-80 leading-relaxed">
                You are about to permanently delete your Beatgangsta account. This action is irreversible and will perform the following:
              </p>
              <ul className="mt-4 space-y-2 text-xs opacity-90 list-disc list-inside">
                <li>Remove all saved beats, plugins, and gear from Google Drive.</li>
                <li>Wipe all local browser data and settings.</li>
                <li>Revoke Beatgangsta's access to your Google account.</li>
                <li>Sign you out completely.</li>
              </ul>
            </div>
            <div className="p-4 flex gap-3 justify-end bg-black/5">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeletingAccount}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-current/20 hover:bg-current/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeletingAccount ? "Deleting..." : "Yes, Delete Everything"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCloudSyncModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <React.Suspense fallback={null}>
              <CloudSyncModal
                theme={theme}
                mode={cloudSyncMode}
                user={user}
                onGoogleSignIn={handleGoogleSignIn}
                initialPreferences={autoBackupPrefs}
                onSavePreferences={handleSaveCloudPrefs}
                onManualAction={handleExecuteCloudSync}
                onClose={() => setShowCloudSyncModal(false)}
                isProcessing={isCloudSyncing}
              />
            </React.Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVault && (
          <motion.div
            key="vault-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <Vault 
                theme={theme === 'chef-mode' ? 'coldest' : theme} 
                recipes={vault} 
                critiques={savedCritiques}
                folders={folders}
                onClose={() => {
                  setShowVault(false);
                  setFriendMode(false);
                  setImportedSaveFile(null);
                }} 
                onRemove={removeFromVault} 
                onRemoveCritique={removeFromSavedCritique}
                onUpdateColor={updateVaultColor}
                onUpdateFolder={updateVaultFolder}
                onAddFolder={addFolder}
                onRemoveFolder={removeFolder}
                onUpdateFolderColor={updateFolderColor}
                onShare={handleShareSession}
                onExportRig={handleExportRigFile}
                onImportRig={handleImportRig}
                onImportGear={handleImportGear}
                allPlugins={plugins}
                userName={user?.name || "BeatGangsta Producer"}
                friendMode={friendMode}
                importedSaveFile={importedSaveFile}
                onReplicateRecipe={handleReplicateRecipe}
                isReplicating={loading}
                onOpen={(r) => {
                  setViewingRecipe(r);
                  setShowVault(false);
                }}
                onOpenCritique={(c) => {
                  console.log("Vault onOpenCritique called with:", c);
                  setShowVault(false);
                  setTimeout(() => {
                  try {
                    setError(null); // Clear any previous errors
                    if (!c) {
                      throw new Error("Unable to open critique: the critique record is null or undefined.");
                    }
                    if (!c.id) {
                      throw new Error("Unable to open critique: the critique is missing its unique identifier (ID). The record might be corrupted.");
                    }
                    console.log("Critique valid. Setting critiques...");
                    
                    setCritiques([c]);
                    setRecipes([]);
                    setViewingRecipe(null);
                    setAudioMode('critique');
                    setInputMode('upload');
                    setMainTab(c.isGangstaVox ? 'vox' : 'beat');
                    setIsGangstaVox(!!c.isGangstaVox);
                    setFriendMode(false);
                    setImportedSaveFile(null);
                    
                    console.log("Critique state updated.");
                    // Update currentAudioInfo if the opened critique has audio
                    if (c.audioBase64 || c.audioUrl || c.geminiFileUri) {
                      setCurrentAudioInfo({
                        audioBase64: c.audioBase64 || null,
                        audioUrl: c.audioUrl || null,
                        geminiFileUri: c.geminiFileUri || null,
                        mimeType: c.mimeType || null
                      });
                    }
                    // Smoothly scroll down so the opened critique details are visible
                    setTimeout(() => {
                      const el = document.getElementById('critiques-section');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                      }
                    }, 300);
                  } catch (err: any) {
                    console.error("Failed to open critique:", err);
                    setError(err.message || "An unexpected error occurred while loading this critique.");
                  }
                  }, 50);
                }}
              />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingRecipe && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <React.Suspense fallback={null}>
              <RecipeViewerModal 
                recipe={vault.find(r => r.id === viewingRecipe.id) || viewingRecipe} 
                theme={theme}
                onClose={() => setViewingRecipe(null)}
                plugins={plugins}
                analogHardware={analogHardware}
                drumKits={drumKits}
                dawType={dawType}
                onCloudBackupRecipe={handleCloudBackupRecipe}
                onCorrectPlugin={handleCorrectPlugin}
                onContactSupport={handleContactSupport}
              />
            </React.Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeSession && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <React.Suspense fallback={null}>
              <CollaborationModal 
                session={activeSession} 
                myPlugins={plugins} 
                onClose={() => setActiveSession(null)} 
              />
            </React.Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[1000] bg-red-950 border border-red-500/50 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.3)] py-2 min-w-[180px] animate-in fade-in zoom-in duration-200 backdrop-blur-md"
          style={{ 
            top: contextMenu.y > window.innerHeight - 100 ? contextMenu.y - 60 : contextMenu.y, 
            left: contextMenu.x > window.innerWidth - 170 ? contextMenu.x - 160 : contextMenu.x 
          }}
        >
          <button 
            onClick={() => {
              setShowPasscodeModal(true);
              setContextMenu(null);
            }}
            className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-600 transition-all flex items-center gap-3"
          >
            <span className="text-sm">üê¶</span> {t('enter_bird_code')}
          </button>
          {m_act && (
            <button 
              onClick={() => {
                localStorage.removeItem('_mv');
                setM_act(false);
                setContextMenu(null);
              }}
              className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center gap-3 border-t border-red-500/20"
            >
              <span className="text-sm">üö´</span> {t('disable_master_mode')}
            </button>
          )}
        </div>
      )}

      {showPasteModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className={`w-full max-w-2xl p-8 sm:p-10 rounded-[3rem] border shadow-2xl relative ${theme === 'coldest' ? 'bg-white border-sky-100' : theme === 'chef-mode' ? 'bg-white border-orange-100' : 'bg-[#111] text-white border-white/10'}`}>
            <button 
              onClick={() => setShowPasteModal(false)}
              className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${theme === 'coldest' || theme === 'chef-mode' ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
            >
              <X className="w-5 h-5 opacity-50 hover:opacity-100" />
            </button>
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-black tracking-tighter ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>{t('paste_plugin_list')}</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{t('one_plugin_per_line')}</p>
            </div>
            <textarea 
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder={"Waves - CLA-76\nFabFilter - Pro-Q 3\nSoundtoys - Decapitator"}
              className={`w-full h-64 p-6 rounded-3xl text-sm font-medium focus:outline-none transition-all border-2 mb-6 ${theme === 'coldest' ? 'bg-slate-50 border-slate-100 focus:border-sky-400 text-slate-900' : theme === 'chef-mode' ? 'bg-orange-50/50 border-orange-100 focus:border-orange-400 text-slate-900' : 'bg-black/40 border-white/10 focus:border-white/30 text-white'}`}
            />
            <button 
              onClick={async () => {
                if (csvInput.trim()) {
                  setShowPasteModal(false);
                  await parsePlugins(csvInput);
                }
              }}
              disabled={!csvInput.trim() || !isVerified}
              className={`w-full py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all disabled:opacity-50 ${theme === 'coldest' ? 'bg-sky-500 text-white hover:bg-sky-600' : theme === 'chef-mode' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white text-black hover:bg-gray-100'}`}
            >
              {isVerified ? t('analyze_list') : t('verify_below_first')}
            </button>
          </div>
        </div>
      )}

      {/* Passcode Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-red-950 border-4 border-red-600 rounded-[3rem] p-10 shadow-[0_0_80px_rgba(239,68,68,0.4)] space-y-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl" />
            
            <div className="text-center space-y-3 relative z-10">
              <div className="text-5xl animate-bounce">üê¶</div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{t('crazy_bird_protocol')}</h2>
              <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">{t('enter_secret_bird')}</p>
            </div>

            <div className="flex justify-center gap-3 relative z-10">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className={`w-12 h-16 rounded-2xl border-4 flex items-center justify-center text-2xl font-black transition-all ${passcode.length > i ? 'border-red-500 bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-red-900/50 text-red-900/30'}`}
                >
                  {passcode.length > i ? 'üê¶' : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 relative z-10">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '‚úì'].map((val) => (
                <button
                  key={val.toString()}
                  onClick={() => {
                    if (val === 'C') setPasscode('');
                    else if (val === '‚úì') handlePasscodeSubmit();
                    else if (passcode.length < 6) setPasscode(prev => prev + val);
                  }}
                  className={`h-16 rounded-3xl font-black text-2xl transition-all active:scale-95 flex items-center justify-center ${
                    typeof val === 'number' 
                      ? 'bg-red-900/20 text-white border-2 border-red-800/50 hover:bg-red-600 hover:border-red-400' 
                      : val === 'C' 
                        ? 'bg-black text-red-500 border-2 border-red-900 hover:bg-red-950' 
                        : 'bg-white text-red-600 border-2 border-white hover:bg-red-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowPasscodeModal(false)}
              className="w-full py-4 text-[11px] font-black uppercase tracking-[0.4em] text-red-500/50 hover:text-white transition-all relative z-10"
            >
              Abort Flight
            </button>
          </div>
        </div>
      )}

      {m_act && (
        <div className="fixed bottom-4 left-4 z-[100] px-4 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse">
          {_d('TWFzdGVyIE1vZGUgQWN0aXZl')}
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-[100]">
        <SystemStatus onClick={() => window.location.href = 'https://status.beatgangsta.com'} />
      </div>

      <AnimatePresence>
        {showMasterModeModal && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
             <div className="text-center p-8 sm:p-10 bg-[#001a14] rounded-[3rem] border-4 border-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.4)] max-w-lg w-full">
                <div className="mb-6 flex justify-center">
                  <Logo size={80} grillStyle={'diamond'} knifeStyle={'standard'} duragStyle={'dragonball-purple'} theme={'coldest'} showSparkles={true} pendantStyle={'none'} chainStyle={'none'} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tighter mb-3 uppercase italic">Master Mode Unlocked!</h2>
                <p className="text-base sm:text-lg font-bold text-emerald-100 mb-4 tracking-tight">You've unlocked the Purple Silk Durag and Sound Ninja Style!</p>
                <p className="text-xs font-medium text-emerald-300/70 mb-8 leading-relaxed">
                  Cycle through your <span className="font-black text-emerald-300">Durags</span> to find the Purple Silk or Sound Ninja.
                </p>
                <button 
                  onClick={() => setShowMasterModeModal(false)}
                  className="bg-emerald-500 text-black font-black px-10 py-4 rounded-full shadow-lg uppercase tracking-[0.2em] text-[10px] sm:text-xs hover:scale-105 transition-all active:scale-95"
                >
                  {t('enter_master_mode')}
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModeInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-md p-10 rounded-[3rem] border shadow-2xl relative ${theme === 'coldest' ? 'bg-white border-sky-100' : theme === 'chef-mode' ? 'bg-white border-orange-100' : 'bg-[#111] text-white border-white/10'}`}
            >
              <button 
                onClick={() => setShowModeInfo(false)}
                className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${theme === 'coldest' || theme === 'chef-mode' ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
              >
                <X className="w-5 h-5 opacity-50 hover:opacity-100" />
              </button>
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-black tracking-tighter ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>{t('mode_select')}</h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{t('choose_your_workflow')}</p>
              </div>
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <h3 className={`text-lg font-black mb-2 flex items-center gap-2 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                    üéπ BeatGangsta
                  </h3>
                  <p className={`text-sm font-medium ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-white/70'}`}>
                    {t('beatgangsta_mode_desc')}
                    <br/><br/>
                    <span className="font-bold text-orange-500">{t('pro_tip')}</span> {t('gangstavox_pro_tip')}
                  </p>
                </div>
                <div className={`p-6 rounded-3xl border ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <h3 className={`text-lg font-black mb-2 flex items-center gap-2 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                    üé§ GangstaVox
                  </h3>
                  <p className={`text-sm font-medium ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-white/70'}`}>
                    {t('gangstavox_mode_desc')}
                  </p>
                </div>
                <button 
                  onClick={() => setShowModeInfo(false)}
                  className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
                >
                  {t('got_it')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInputModeInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-md p-10 rounded-[3rem] border shadow-2xl relative ${theme === 'coldest' ? 'bg-white border-sky-100' : theme === 'chef-mode' ? 'bg-white border-orange-100' : 'bg-[#111] text-white border-white/10'}`}
            >
              <button 
                onClick={() => setShowInputModeInfo(false)}
                className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${theme === 'coldest' || theme === 'chef-mode' ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
              >
                <X className="w-5 h-5 opacity-50 hover:opacity-100" />
              </button>
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-black tracking-tighter ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>Input Mode</h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Choose how to generate recipes</p>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pb-6 px-1">
                <div className={`p-6 rounded-3xl border ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <h3 className={`text-lg font-black mb-2 flex items-center gap-2 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                    üé≤ Random Recipes
                  </h3>
                  <p className={`text-sm font-medium ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-white/70'}`}>
                    Generate a recipe completely at random based on your currently selected mode (BeatGangsta or GangstaVox). Great for when you need quick, unexpected inspiration.
                  </p>
                </div>
                <div className={`p-6 rounded-3xl border ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <h3 className={`text-lg font-black mb-2 flex items-center gap-2 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                    üîç Search Options
                  </h3>
                  <p className={`text-sm font-medium ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-white/70'}`}>
                    Type in specific keywords, artist names, or song titles. We'll analyze your search and generate a recipe tailored to that exact vibe or style.
                  </p>
                </div>
                <div className={`p-6 rounded-3xl border ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <h3 className={`text-lg font-black mb-2 flex items-center gap-2 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                    üìé Upload Files
                  </h3>
                  <p className={`text-sm font-medium ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-white/70'}`}>
                    Upload audio files or stems. We'll analyze the sonic characteristics of your audio and generate a recipe or provide a mix critique based on what we hear.
                  </p>
                </div>
                <button 
                  onClick={() => setShowInputModeInfo(false)}
                  className={`w-full mt-4 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-slate-800 text-white' : 'bg-white text-black'}`}
                >
                  {t('got_it')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFriendsInfo && (
          <React.Suspense fallback={null}>
            <FriendsInfoModal 
              theme={theme} 
              onClose={() => setShowFriendsInfo(false)} 
            />
          </React.Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSaberPicker && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
             <div className="bg-[#111] border-2 border-yellow-500/30 p-10 rounded-[4rem] text-center shadow-[0_0_50px_rgba(234,179,8,0.2)] flex flex-col md:flex-row items-center gap-12 max-w-4xl w-full">
                <div className="flex flex-col items-center gap-6 flex-1">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Forge Your Blade</h2>
                  <div className="custom-color-picker flex justify-center">
                    <CustomColorWheel 
                      color={saberColor} 
                      onChange={setSaberColor}
                      size={240}
                    />
                  </div>
                  <button 
                    onClick={() => setShowSaberPicker(false)}
                    className="bg-yellow-500 text-black font-black px-8 py-3 rounded-full uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all w-full"
                  >
                    Ignite Blade
                  </button>
                </div>
                <div className="bg-black/40 p-8 rounded-[3rem] border border-white/5 flex-1 flex items-center justify-center min-h-[300px]">
                  <Logo size={240} grillStyle={grillStyle} knifeStyle={knifeStyle} duragStyle={duragStyle} pendantStyle={pendantStyle} chainStyle={chainStyle} theme={theme} saberColor={saberColor} mascotColor={mascotColor} showChain={showChain} highEyes={highEyes} isCigarEquipped={isCigarEquipped} isTossingCigar={isTossingCigar} showSparkles={showSparkles} />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMascotColorPicker && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
             <div className="bg-[#111] border-2 border-sky-500/30 p-10 rounded-[4rem] text-center shadow-[0_0_50px_rgba(14,165,233,0.2)] flex flex-col md:flex-row items-center gap-12 max-w-4xl w-full relative">
                <button 
                  onClick={() => setShowMascotColorPicker(false)}
                  className="absolute top-8 right-8 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  title={t('close_mascot_hue')}
                >
                  <X size={24} />
                </button>
                <div className="flex flex-col items-center gap-6 flex-1">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{t('mascot_hue')}</h2>
                  <div className="custom-color-picker flex justify-center">
                    <CustomColorWheel 
                      color={mascotColor} 
                      onChange={setMascotColor}
                      size={240}
                    />
                  </div>
                  <button 
                    onClick={() => setShowMascotColorPicker(false)}
                    className="bg-sky-500 text-white font-black px-8 py-3 rounded-full uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all w-full"
                  >
                    {t('apply_hue')}
                  </button>
                  <button 
                    onClick={() => setMascotColor('#3b82f6')}
                    className="bg-white/10 text-white font-black px-8 py-3 rounded-full uppercase text-xs tracking-widest hover:bg-white/20 hover:scale-105 active:scale-95 transition-all w-full"
                  >
                    {t('default_hue')}
                  </button>
                </div>
                <div className="bg-black/40 p-8 rounded-[3rem] border border-white/5 flex-1 flex items-center justify-center min-h-[300px]">
                  <Logo size={240} grillStyle={grillStyle} knifeStyle={knifeStyle} duragStyle={duragStyle} pendantStyle={pendantStyle} chainStyle={chainStyle} theme={theme} saberColor={saberColor} mascotColor={mascotColor} showChain={showChain} highEyes={highEyes} isCigarEquipped={isCigarEquipped} isTossingCigar={isTossingCigar} showSparkles={showSparkles} />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSignUpModal && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <div className={`w-full max-w-md p-10 rounded-[3rem] border shadow-2xl relative ${theme === 'coldest' ? 'bg-white' : 'bg-[#111] text-white border-red-900/40'}`}>
               <button 
                 onClick={() => setShowSignUpModal(false)}
                 className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors"
               >
                 <X className="w-5 h-5 opacity-50 hover:opacity-100" />
               </button>
               <div className="text-center mb-8">
                  <Logo size={80} grillStyle={grillStyle} knifeStyle={knifeStyle} duragStyle={duragStyle} pendantStyle={pendantStyle} chainStyle={chainStyle} theme={theme} saberColor={saberColor} mascotColor={mascotColor} showChain={showChain} highEyes={highEyes} isCigarEquipped={isCigarEquipped} isTossingCigar={isTossingCigar} onClick={cycleGrill} />
                  <h2 className="text-3xl font-black tracking-tighter mt-4">{t('join_the_club')}</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{t('make_profile_desc')}</p>
               </div>
               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2 block">{t('choose_a_name')}</label>
                    <input 
                      type="text" 
                      value={tempUsername} 
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="w-full bg-black/5 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 outline-none transition-all"
                      placeholder={t('producer_name')}
                    />
                  </div>
                  <button 
                    onClick={handleSignIn}
                    className="w-full bg-orange-500 text-white font-black py-4 rounded-full shadow-lg shadow-orange-900/20 active:scale-95 transition-all uppercase text-xs tracking-widest"
                  >
                    {t('join_now')}
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={`sticky top-16 z-50 px-6 py-4 border-b transition-all duration-500 ${mainBlurClass} shadow-lg ${theme === 'coldest' ? 'bg-white/20 border-white/30' : theme === 'crazy-bird' ? 'bg-black/30 border-red-900/40' : theme === 'chef-mode' ? 'bg-white/40 border-white/30' : 'bg-black/30 border-yellow-900/40'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Logo size={42} grillStyle={grillStyle} knifeStyle={knifeStyle} duragStyle={duragStyle} pendantStyle={pendantStyle} chainStyle={chainStyle} theme={theme} saberColor={saberColor} mascotColor={mascotColor} showChain={showChain} highEyes={highEyes} isCigarEquipped={isCigarEquipped} isTossingCigar={isTossingCigar} showSparkles={showSparkles} onClick={cycleGrill} />
            <DownloadableLogoText currentAppName={currentAppName} theme={theme} />
            {user && (
              <button onClick={() => setShowBetaApplyModal(true)} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded text-sm font-medium hover:from-blue-500 hover:to-indigo-500 transition-all shadow border border-blue-400/20">Beta Tester</button>
            )}
          </div>
          
          <div className="hidden sm:flex flex-wrap items-center justify-end gap-2">
            <button onClick={cycleGrill} className={`${actionBtnClasses} ${themedBtnClasses}`}>
              <Gem size={16} /> {grillLabel}
            </button>
            
            <button onClick={cycleKnife} className={`${actionBtnClasses} ${themedBtnClasses}`}>
              <Sword size={16} /> {knifeLabel}
            </button>

            {h_act && (
              <>
                <button onClick={cycleDurag} className={`${actionBtnClasses} ${themedBtnClasses}`}>
                  <UserIcon size={16} /> {duragLabel}
                </button>

                <button onClick={() => setShowChain(!showChain)} className={`${actionBtnClasses} ${showChain ? getThemeActiveClasses(theme) : themedBtnClasses}`}>
                  <Link size={16} /> {showChain ? t('chain_on') : t('chain_off')}
                </button>

                {showChain && (
                  <>
                    <button onClick={cycleChain} className={`${actionBtnClasses} ${themedBtnClasses}`}>
                      <Link2 size={16} /> {chainStyle === 'silver' ? t('silver_chain') : chainStyle === 'gold' ? t('gold_chain') : chainStyle === 'rose-gold' ? t('rose_gold_chain') : chainStyle === 'diamond' ? t('diamond_chain') : t('blue_diamond_chain')}
                    </button>
                    <button onClick={cyclePendant} className={`${actionBtnClasses} ${themedBtnClasses}`}>
                      <Sparkles size={16} /> {pendantStyle === 'silver' ? t('silver_pendant') : pendantStyle === 'gold' ? t('gold_pendant') : pendantStyle === 'rose-gold' ? t('rose_gold_pendant') : pendantStyle === 'diamond' ? t('diamond_pendant') : t('blue_diamond_pendant')}
                    </button>
                  </>
                )}

                <button 
                  onClick={toggleHighEyes} 
                  onContextMenu={handleContextMenu}
                  className={`${actionBtnClasses} ${highEyes ? getThemeActiveClasses(theme) : themedBtnClasses}`}
                >
                  <Eye size={16} /> {highEyes ? t('sober_up') : t('get_high')}
                </button>

                <button onClick={handleCigarToggle} className={`${actionBtnClasses} ${isCigarEquipped ? getThemeActiveClasses(theme) : themedBtnClasses}`}>
                  <CigarIcon size={16} className={isCigarEquipped ? "animate-pulse" : ""} /> {isCigarEquipped ? t('toss_blunt') : t('got_blunt')}
                </button>

                <button onClick={() => setShowMascotColorPicker(true)} className={`${actionBtnClasses} ${themedBtnClasses}`}>
                  <Palette size={16} /> {t('mascot_hue')}
                </button>

                {knifeStyle === 'samuels-saber' && (
                  <button onClick={() => setShowSaberPicker(true)} className={`${actionBtnClasses} ${getThemeActiveClasses(theme)}`}>
                    <Sword size={16} /> {t('forge_blade')}
                  </button>
                )}
              </>
            )}

            <button onClick={toggleTheme} className={`${actionBtnClasses} ${theme === 'coldest' ? 'bg-white/60 border-sky-200 text-[#0c4a6e]' : theme === 'chef-mode' ? 'bg-white/10 text-orange-950 border-orange-500 shadow-none' : theme === 'crazy-bird' ? 'bg-red-600 border-red-500 text-white hover:bg-red-500' : 'bg-yellow-600 border-yellow-500 text-white'}`}>
              {theme === 'coldest' ? t('coldest_theme') : theme === 'chef-mode' ? t('chef_mode_theme') : theme === 'crazy-bird' ? t('crazy_bird_theme') : t('hustle_mode_theme')}
            </button>
          </div>
        </div>
      </header>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[100] flex flex-col">
        {h_act && (
          <div className={`px-4 py-3 flex gap-4 overflow-x-auto no-scrollbar items-center border-t ${mainBlurClass} animate-in slide-in-from-bottom-full duration-500 ${theme === 'coldest' ? 'bg-white/60 border-slate-200' : theme === 'chef-mode' ? 'bg-white/40 border-orange-200' : 'bg-black/80 border-red-900/30'}`}>
            <button 
              onClick={cycleDurag} 
              className={`${mobileTrayBtnClasses} ${duragStyle !== 'standard' ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg' : themedBtnClasses}`}
            >
              <UserIcon size={16} /> {duragLabel}
            </button>

            <button 
              onClick={() => setShowChain(!showChain)} 
              className={`${mobileTrayBtnClasses} ${showChain ? getThemeActiveClasses(theme) : themedBtnClasses}`}
            >
              <Link size={16} /> {showChain ? t('chain_on') : t('chain_off')}
            </button>

            {showChain && (
              <>
                <button 
                  onClick={cycleChain} 
                  className={`${mobileTrayBtnClasses} ${themedBtnClasses}`}
                >
                  <Link2 size={16} /> {chainStyle === 'silver' ? t('silver_chain') : chainStyle === 'gold' ? t('gold_chain') : chainStyle === 'rose-gold' ? t('rose_gold_chain') : chainStyle === 'diamond' ? t('diamond_chain') : t('blue_diamond_chain')}
                </button>
                <button 
                  onClick={cyclePendant} 
                  className={`${mobileTrayBtnClasses} ${themedBtnClasses}`}
                >
                  <Sparkles size={16} /> {pendantStyle === 'silver' ? t('silver_pendant') : pendantStyle === 'gold' ? t('gold_pendant') : pendantStyle === 'rose-gold' ? t('rose_gold_pendant') : pendantStyle === 'diamond' ? t('diamond_pendant') : t('blue_diamond_pendant')}
                </button>
              </>
            )}

            {knifeStyle === 'samuels-saber' && (
              <button onClick={() => setShowSaberPicker(true)} className={`${mobileTrayBtnClasses} ${getThemeActiveClasses(theme)}`}><Sword size={16} /> {t('forge_blade')}</button>
            )}
            
            <button 
              onClick={toggleHighEyes} 
              onContextMenu={handleContextMenu}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              className={`${mobileTrayBtnClasses} select-none ${highEyes ? getThemeActiveClasses(theme) : themedBtnClasses}`}
            >
              <Eye size={16} /> {highEyes ? t('sober_up') : t('get_high')}
            </button>
            <button onClick={handleCigarToggle} className={`${mobileTrayBtnClasses} select-none ${isCigarEquipped ? getThemeActiveClasses(theme) : themedBtnClasses}`}>
              <CigarIcon size={16} /> {isCigarEquipped ? t('toss_blunt') : t('got_blunt')}
            </button>
            <button onClick={() => setShowMascotColorPicker(true)} className={`${mobileTrayBtnClasses} ${themedBtnClasses}`}>
              <Palette size={16} /> {t('mascot_hue')}
            </button>
          </div>
        )}
        <div className={`border-t transition-all duration-500 ${mainBlurClass} shadow-2xl ${theme === 'coldest' ? 'bg-white/80 border-slate-200 text-slate-800' : theme === 'chef-mode' ? 'bg-white/60 border-orange-100 text-orange-950' : 'bg-black/90 border-red-900/50 text-red-50'}`}>
          <div className="flex items-stretch justify-around h-20 px-4">
            <button onClick={cycleGrill} className={mobileToolbarBtnClasses}><span className="text-xl">üíé</span><span className="text-[9px] font-black uppercase truncate max-w-[80px]">{grillLabel}</span></button>
            <button onClick={cycleKnife} className={mobileToolbarBtnClasses}><span className="text-xl">üî™</span><span className="text-[9px] font-black uppercase truncate max-w-[80px]">{knifeLabel}</span></button>
            <button onClick={toggleTheme} className={mobileToolbarBtnClasses}><span className="text-xl">{theme === 'coldest' ? '‚ùÑÔ∏è' : theme === 'chef-mode' ? 'üë®‚Äçüç≥' : theme === 'crazy-bird' ? 'üê¶' : 'üí∞'}</span><span className="text-[9px] font-black uppercase truncate max-w-[80px]">{theme === 'chef-mode' ? t('chef_label') : t('theme_label')}</span></button>
          </div>
        </div>
      </div>

      {/* Receipt Log */}
      <div className="max-w-7xl mx-auto px-6 mt-4 relative z-40">
        <div className={`w-full max-w-md p-4 rounded-2xl border ${mainBlurClass} shadow-xl ${theme === 'coldest' ? 'bg-white/60 border-sky-100 text-sky-900' : theme === 'chef-mode' ? 'bg-white/80 border-orange-100 text-orange-950' : 'bg-black/60 border-white/10 text-white'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-70">Receipt Log</h3>
            <span className="text-[10px] font-bold opacity-50">{receipts.length} items</span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
            {(!receipts || receipts.length === 0) ? (
              <div className="text-xs opacity-50 italic">No transactions yet.</div>
            ) : (
              (receipts || []).slice(0, 10).map(receipt => (
                <div key={receipt.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="opacity-50 text-[10px]">{new Date(receipt.date).toLocaleTimeString()}</span>
                    <span className="font-bold">{receipt.action}</span>
                  </div>
                  <span className="font-black text-red-500">-{receipt.cost} ü™ô</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-4 sm:py-12 relative z-10">
        <div className="absolute top-4 left-6 sm:top-6 sm:left-6 z-40 pointer-events-none w-full flex items-center gap-2">
            <button 
              id="btn-vault"
              onClick={() => setShowVault(true)}
              className={`pointer-events-auto relative flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border shadow-xl transition-all hover:scale-105 active:scale-95 group ${mainBlurClass} ${theme === 'coldest' ? 'bg-white/40 border-sky-100 text-sky-800' : theme === 'chef-mode' ? 'bg-white/60 border-orange-100 text-orange-950 shadow-orange-900/10' : 'bg-black/40 border-white/10 text-white'}`}
            >
               <FolderIcon size={16} />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('vault')}</span>
               {vault.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-white rounded-full flex items-center justify-center text-[8px] font-black shadow-lg border-2 border-white">{vault.length}</span>}
            </button>

            <button 
              id="btn-rig"
              onClick={() => setShowRigUI(true)}
              className={`pointer-events-auto flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border shadow-xl transition-all hover:scale-105 active:scale-95 group ${mainBlurClass} ${theme === 'coldest' ? 'bg-white/40 border-sky-100 text-sky-800' : theme === 'chef-mode' ? 'bg-white/60 border-orange-100 text-orange-950 shadow-orange-900/10' : 'bg-black/40 border-white/10 text-white'}`}
            >
               <Cpu size={16} />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('gear_rack')}</span>
            </button>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-900/20 border border-red-500/50 rounded-[2rem] text-red-400 text-sm font-bold relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-left">
                <p className="whitespace-pre-wrap leading-relaxed">{error}</p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(error);
                    // Optional: Add a temporary "Copied!" state
                  }}
                  className="mt-4 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-full text-[10px] uppercase tracking-widest transition-all active:scale-95"
                >
                  Copy Error Details
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isEnrichingLibrary ? (
          <div className="max-w-3xl mx-auto mt-16 sm:mt-12 animate-in fade-in zoom-in duration-1000">
            <div className={`p-8 sm:p-16 transition-all ${mainBlurClass} border rounded-[3rem] sm:rounded-[4rem] shadow-2xl flex flex-col items-center text-center ${theme === 'coldest' ? 'bg-white/30 border-white/40' : theme === 'chef-mode' ? 'bg-white/40 border-white/40' : 'bg-black/40 border-white/10'}`}>
              <div className="relative">
                <Logo size={160} grillStyle={grillStyle} knifeStyle={knifeStyle} duragStyle={duragStyle} pendantStyle={pendantStyle} chainStyle={chainStyle} theme={theme} saberColor={saberColor} mascotColor={mascotColor} showChain={showChain} highEyes={highEyes} isCigarEquipped={isCigarEquipped} isTossingCigar={isTossingCigar} showSparkles={showSparkles} onClick={cycleGrill} />
                <div className="absolute -bottom-2 -right-2 bg-sky-500 text-white text-[10px] font-black px-2 py-1 rounded-full animate-pulse uppercase tracking-widest">
                  Researching
                </div>
              </div>
              
              <h2 className={`text-3xl sm:text-4xl font-black tracking-tighter mt-8 mb-4 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                {enrichProgress < 10 ? "Scanning Your Gear..." : enrichProgress < 90 ? "AI Deep Research..." : "Finalizing Profile..."}
              </h2>
              
              <p className={`text-sm font-bold mb-8 max-w-md ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-slate-400'}`}>
                {enrichProgress < 30 
                  ? "We're identifying your plugins and checking our secure global cache to speed things up." 
                  : "The AI is currently researching technical parameters and sonic characteristics for your unique gear."}
              </p>

              <div className="w-full max-w-md bg-black/10 rounded-full h-4 mb-4 overflow-hidden relative group">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out relative ${theme === 'coldest' ? 'bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.5)]' : theme === 'chef-mode' ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]'}`}
                  style={{ width: `${enrichProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
              
              <div className="flex justify-between w-full max-w-md text-xs font-black uppercase tracking-widest opacity-60">
                <span>{enrichProgress}% Complete</span>
                <span>
                  {enrichEta > 0 ? (
                    enrichEta > 60 
                      ? `~${Math.floor(enrichEta / 60)}m ${enrichEta % 60}s remaining` 
                      : `~${enrichEta}s remaining`
                  ) : "Calculating..."}
                </span>
              </div>

              {enrichStatus && (
                <div className={`mt-8 w-full max-w-md`}>
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-left opacity-40 px-2`}>Current Activity</div>
                  <div className={`text-[11px] font-bold text-left px-4 py-3 rounded-2xl border flex items-center gap-3 ${theme === 'coldest' ? 'bg-slate-100/50 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/70'}`}>
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                    <span className="truncate">{enrichStatus}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : ((plugins.length === 0 && !isJsfxMode) && !isEnrichingLibrary && !hasRestoredBackup) ? (
          <div className="max-w-3xl mx-auto mt-16 sm:mt-12 animate-in fade-in zoom-in duration-1000">
            <div className={`relative p-6 sm:p-12 transition-all ${mainBlurClass} border rounded-[3rem] sm:rounded-[4rem] shadow-2xl ${theme === 'coldest' ? 'bg-white/30 border-white/40' : theme === 'chef-mode' ? 'bg-white/40 border-white/40' : 'bg-black/40 border-white/10'}`}>
              <div className="flex flex-col items-center mb-10 text-center relative z-10">
                <div className="relative z-30">
                  <Logo size={240} grillStyle={grillStyle} knifeStyle={knifeStyle} duragStyle={duragStyle} pendantStyle={pendantStyle} chainStyle={chainStyle} theme={theme} saberColor={saberColor} mascotColor={mascotColor} showChain={showChain} highEyes={highEyes} isCigarEquipped={isCigarEquipped} isTossingCigar={isTossingCigar} showSparkles={showSparkles} onClick={cycleGrill} />
                </div>
                <h2 className={`text-3xl sm:text-5xl font-black tracking-tighter select-none ${theme === 'chef-mode' ? 'mt-4 sm:mt-8' : 'mt-8'} ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                  {theme === 'chef-mode' ? t('cook_up_fire') : highEyes ? t('lets_get_high') : theme === 'hustle-time' ? t('secure_the_bag') : theme === 'crazy-bird' ? t('lesgo_2_da_top') : theme === 'coldest' ? (
                    <>{t('produce_coldest_beats_p1')} <span className="coldest-text-glow">{t('produce_coldest_beats_p2')}</span> {t('produce_coldest_beats_p3')}</>
                  ) : t('lets_go_to_the_top')}
                </h2>
                {theme === 'coldest' && !highEyes && (
                  <p className="text-sm sm:text-lg font-bold opacity-40 mt-1 text-slate-600 tracking-tight">
                    {t('only_with_beatgangsta')}
                  </p>
                )}
              </div>
              <div 
                id="dropzone-plugin-import"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                onDragOver={(e) => {
                  if (window.innerWidth >= 640) handleDragOver(e);
                }}
                onDragLeave={(e) => {
                  if (window.innerWidth >= 640) handleDragLeave(e);
                }}
                onDrop={(e) => {
                  if (window.innerWidth >= 640) handleDrop(e);
                }}
                className={`w-full h-80 p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all duration-500 outline-none ${mainBlurClass} border shadow-inner rounded-[2rem] sm:rounded-[3rem] cursor-pointer ${isDragging ? 'scale-[1.02] border-sky-500 bg-sky-500/10' : ''} ${theme === 'coldest' ? 'bg-white/40 border-white text-slate-800 hover:bg-white/60' : theme === 'chef-mode' ? 'bg-white/60 border-white text-slate-900 hover:bg-white/80' : 'bg-black/60 border-white/10 text-white hover:bg-black/80'}`}
              >
                <div className="text-4xl mb-4 opacity-50">{theme === 'coldest' ? '‚ùÑÔ∏è' : theme === 'chef-mode' ? 'üë®‚Äçüç≥' : theme === 'crazy-bird' ? 'üê¶' : 'üí∞'}</div>
                <p className="hidden sm:block text-lg font-black tracking-tight mb-2">
                  {isVerified ? t('drag_drop_plugin') : t('verify_to_upload')}
                </p>
                <p className="hidden sm:block text-sm font-bold opacity-60 mb-6">
                  {isVerified ? t('or_click_to_browse') : t('security_check_required')}
                </p>
                <p className="sm:hidden text-lg font-black tracking-tight mb-6">
                  {isVerified ? t('tap_to_upload_plugin') : t('verify_to_upload')}
                </p>
                <p className="text-xs font-bold opacity-40 uppercase tracking-widest">{t('click_help_to_find_file')}</p>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
                <button 
                  id="btn-help"
                  onClick={() => setShowGuide(true)}
                  className={`font-black py-3 px-6 rounded-lg border text-[10px] uppercase tracking-widest transition-all select-none flex items-center justify-center ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}
                  style={{ height: '52px' }}
                >
                  {t('help')}?
                </button>
                <button 
                  onClick={() => setShowPasteModal(true)}
                  className={`font-black py-3 px-6 rounded-lg border text-[10px] uppercase tracking-widest transition-all select-none flex items-center justify-center ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}
                  style={{ height: '52px' }}
                >
                  {t('paste_list')}
                </button>
                <button 
                  onClick={handleUseBandLab}
                  className={`font-black py-3 px-6 rounded-lg border text-[10px] uppercase tracking-widest transition-all select-none flex items-center justify-center ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}
                  style={{ height: '52px' }}
                >
                  Use BandLab
                </button>
                <div className="flex items-center gap-2 ml-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isBandLabPremium}
                      onChange={(e) => setIsBandLabPremium(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    <span className={`ml-3 text-[10px] font-bold uppercase tracking-widest ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-white/70'}`}>
                      BandLab Premium
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-2 ml-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isJsfxMode}
                      onChange={(e) => handleToggleJsfxMode(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
                    <span className={`ml-3 text-[10px] font-bold uppercase tracking-widest leading-tight ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-white/70'}`}>
                      REAPER JSFX<br/>ONLY
                    </span>
                  </label>
                </div>
              </div>
              {!isVerified && (
                <div className="flex justify-center mt-6">
                  <div id="tutorial-turnstile" className="flex items-center justify-center overflow-visible" style={{ width: '260px', height: '52px' }}>
                    <div key={verificationSessionId}>
                      <Turnstile
                        sitekey={getTurnstileSiteKey()}
                        onVerify={(token) => {
                          if ((window as any).onUploadSuccess) {
                            (window as any).onUploadSuccess(token);
                          }
                        }}
                        theme={theme === 'coldest' || theme === 'chef-mode' ? 'light' : 'dark'}
                      />
                    </div>
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.txt,.ini,.xml" multiple onChange={(e) => {
                handleFileUpload(e);
              }} />
            </div>

            {/* How it works section */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <div className="space-y-4 group">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${theme === 'coldest' ? 'bg-sky-500/10 text-sky-500' : theme === 'chef-mode' ? 'bg-orange-500/10 text-orange-500' : theme === 'hustle-time' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/80'}`}>
                  <Cpu size={32} strokeWidth={1.5} />
                </div>
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : theme === 'hustle-time' ? 'text-yellow-400' : 'text-white'}`}>{t('add_your_gear')}</h3>
                <p className={`text-xs font-medium leading-relaxed ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600 opacity-60' : theme === 'hustle-time' ? 'text-yellow-50 opacity-90' : 'text-slate-300 opacity-60'}`}>
                  {t('add_your_gear_desc')}
                </p>
              </div>
              <div className="space-y-4 group">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 ${theme === 'coldest' ? 'bg-sky-500/10 text-sky-500' : theme === 'chef-mode' ? 'bg-orange-500/10 text-orange-500' : theme === 'hustle-time' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/80'}`}>
                  <Sparkles size={32} strokeWidth={1.5} />
                </div>
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : theme === 'hustle-time' ? 'text-yellow-400' : 'text-white'}`}>{t('ai_architect')}</h3>
                <p className={`text-xs font-medium leading-relaxed ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600 opacity-60' : theme === 'hustle-time' ? 'text-yellow-50 opacity-90' : 'text-slate-300 opacity-60'}`}>
                  {t('ai_architect_desc')}
                </p>
              </div>
              <div className="space-y-4 group">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${theme === 'coldest' ? 'bg-sky-500/10 text-sky-500' : theme === 'chef-mode' ? 'bg-orange-500/10 text-orange-500' : theme === 'hustle-time' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/80'}`}>
                  <Rocket size={32} strokeWidth={1.5} />
                </div>
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : theme === 'hustle-time' ? 'text-yellow-400' : 'text-white'}`}>{t('drop_the_fire')}</h3>
                <p className={`text-xs font-medium leading-relaxed ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600 opacity-60' : theme === 'hustle-time' ? 'text-yellow-50 opacity-90' : 'text-slate-300 opacity-60'}`}>
                  {t('drop_the_fire_desc')}
                </p>
              </div>
            </div>

            <div className="mt-32 text-center max-w-2xl mx-auto px-6 animate-in fade-in duration-1000 delay-700">
              <div className={`inline-block px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.4em] mb-6 ${theme === 'coldest' ? 'bg-sky-500/10 text-sky-600' : theme === 'hustle-time' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/40'}`}>
                {t('the_mission')}
              </div>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tighter mb-6 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : theme === 'hustle-time' ? 'text-yellow-400' : 'text-white'}`}>
                {t('the_mission_title')}
              </h2>
              <p className={`text-sm font-medium leading-relaxed ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600 opacity-60' : theme === 'hustle-time' ? 'text-yellow-50 opacity-90' : 'text-slate-300 opacity-60'}`}>
                {t('the_mission_desc')}
              </p>
            </div>
          </div>
        ) : (!isEnrichingLibrary && (plugins.length > 0 || isJsfxMode)) || hasRestoredBackup ? (
          <div className="space-y-12 mt-12 sm:mt-0">
            {!isVerified && (
              <div className="flex justify-center mt-6">
                <div id="tutorial-turnstile-studio" className="flex items-center justify-center overflow-visible" style={{ width: '260px', height: '52px' }}>
                  <div key={verificationSessionId}>
                    <Turnstile
                      sitekey={getTurnstileSiteKey()}
                      onVerify={(token) => {
                        if ((window as any).onUploadSuccess) {
                          (window as any).onUploadSuccess(token);
                        }
                      }}
                      theme={theme === 'coldest' || theme === 'chef-mode' ? 'light' : 'dark'}
                    />
                  </div>
                </div>
              </div>
            )}
            <section className={`relative flex flex-col gap-8 p-6 sm:p-10 transition-colors ${mainBlurClass} border rounded-[3rem] sm:rounded-[4rem] shadow-xl ${theme === 'coldest' ? 'bg-white/20 border-white/30' : theme === 'chef-mode' ? 'bg-white/40 border-white/30' : 'bg-black/40 border-white/10'}`}>
              <div className="flex flex-col lg:flex-row gap-8 items-center justify-between relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-4 text-center sm:text-left">
                  <div className="relative z-30">
                    <Logo size={240} grillStyle={grillStyle} knifeStyle={knifeStyle} duragStyle={duragStyle} pendantStyle={pendantStyle} chainStyle={chainStyle} theme={theme} saberColor={saberColor} mascotColor={mascotColor} showChain={showChain} highEyes={highEyes} isCigarEquipped={isCigarEquipped} isTossingCigar={isTossingCigar} showSparkles={showSparkles} onClick={cycleGrill} />
                  </div>
                  <div className="flex flex-col justify-center -mt-4 sm:mt-0">
                    <h2 className={`text-4xl sm:text-6xl font-black tracking-tighter select-none ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>{t('studio_info')}</h2>
                    <p className="text-sm sm:text-lg font-bold opacity-70 select-none mt-2">{t('loaded_plugins_count', { count: allActivePlugins.length })}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-30">
                  <div className={`flex items-center p-1 rounded-full backdrop-blur-md border ${
                    theme === 'coldest' ? 'bg-sky-500/10 border-sky-500/20' : 
                    theme === 'crazy-bird' ? 'bg-red-500/20 border-red-500/30' : 
                    theme === 'hustle-time' ? 'bg-emerald-500/20 border-yellow-500/30' : 
                    theme === 'chef-mode' ? 'bg-orange-500/10 border-orange-500/20' : 
                    'bg-white/10 border-white/20'
                  }`}>
                    <button 
                      id="btn-mode-beatgangsta"
                      onClick={() => {
                        setIsGangstaVox(false);
                        setMainTab('beat');
                      }} 
                      className={`py-3 px-6 rounded-full font-black text-xs select-none transition-all ${
                        mainTab === 'beat' 
                          ? (theme === 'coldest' ? 'bg-sky-500 text-white shadow-sm' : 
                             theme === 'crazy-bird' ? 'bg-red-600 text-white shadow-sm' : 
                             theme === 'hustle-time' ? 'bg-yellow-500 text-emerald-950 shadow-sm' : 
                             theme === 'chef-mode' ? 'bg-orange-500 text-white shadow-sm' : 
                             'bg-white/20 text-white shadow-sm') 
                          : (theme === 'coldest' ? 'text-sky-900/60 hover:text-sky-900' : 
                             theme === 'crazy-bird' ? 'text-red-100/60 hover:text-white' : 
                             theme === 'hustle-time' ? 'text-yellow-100/60 hover:text-yellow-400' : 
                             theme === 'chef-mode' ? 'text-orange-900/60 hover:text-orange-900' : 
                             'text-white/50 hover:text-white')
                      }`}
                    >
                      üéπ BeatGangsta
                    </button>
                    <button 
                      id="btn-mode-gangstavox"
                      onClick={() => {
                        setIsGangstaVox(true);
                        setMainTab('vox');
                      }} 
                      className={`py-3 px-6 rounded-full font-black text-xs select-none transition-all ${
                        mainTab === 'vox' 
                          ? (theme === 'coldest' ? 'bg-sky-500 text-white shadow-sm' : 
                             theme === 'crazy-bird' ? 'bg-red-600 text-white shadow-sm' : 
                             theme === 'hustle-time' ? 'bg-yellow-500 text-emerald-950 shadow-sm' : 
                             theme === 'chef-mode' ? 'bg-orange-500 text-white shadow-sm' : 
                             'bg-white/20 text-white shadow-sm') 
                          : (theme === 'coldest' ? 'text-sky-900/60 hover:text-sky-900' : 
                             theme === 'crazy-bird' ? 'text-red-100/60 hover:text-white' : 
                             theme === 'hustle-time' ? 'text-yellow-100/60 hover:text-yellow-400' : 
                             theme === 'chef-mode' ? 'text-orange-900/60 hover:text-orange-900' : 
                             'text-white/50 hover:text-white')
                      }`}
                    >
                      üé§ GangstaVox
                    </button>
                    <button 
                      onClick={() => setShowModeInfo(true)}
                      className={`w-8 h-8 mr-1 flex items-center justify-center rounded-full transition-all font-bold text-sm ${
                        theme === 'coldest' ? 'text-sky-900/60 hover:bg-sky-500/20 hover:text-sky-900' : 
                        theme === 'crazy-bird' ? 'text-red-100/60 hover:bg-red-500/20 hover:text-white' : 
                        theme === 'hustle-time' ? 'text-yellow-100/60 hover:bg-yellow-500/20 hover:text-yellow-400' : 
                        theme === 'chef-mode' ? 'text-orange-900/60 hover:bg-orange-500/20 hover:text-orange-900' : 
                        'text-white/50 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      ?
                    </button>
                  </div>
                </div>
              </div>

              <div className={`transition-all duration-700 flex justify-center mt-6 mb-8 ${mainTab === null ? 'blur-[8px] pointer-events-none opacity-40' : ''}`}>
                <div className={`flex flex-wrap sm:flex-nowrap justify-center items-center p-1 sm:rounded-full rounded-3xl backdrop-blur-md border ${
                  theme === 'coldest' ? 'bg-sky-500/10 border-sky-500/20' : 
                  theme === 'crazy-bird' ? 'bg-red-500/20 border-red-500/30' : 
                  theme === 'hustle-time' ? 'bg-emerald-500/20 border-yellow-500/30' : 
                  theme === 'chef-mode' ? 'bg-orange-500/10 border-orange-500/20' : 
                  'bg-white/10 border-white/20'
                }`}>
                  <button onClick={() => setInputMode('random')} className={`px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center ${inputMode === 'random' ? (theme === 'coldest' ? 'bg-sky-500 text-white shadow-sm' : theme === 'crazy-bird' ? 'bg-red-600 text-white shadow-sm' : theme === 'hustle-time' ? 'bg-yellow-500 text-emerald-950 shadow-sm' : theme === 'chef-mode' ? 'bg-orange-500 text-white shadow-sm' : 'bg-white/20 text-white shadow-sm') : (theme === 'coldest' ? 'text-sky-900/60 hover:text-sky-900' : theme === 'crazy-bird' ? 'text-red-100/60 hover:text-white' : theme === 'hustle-time' ? 'text-yellow-100/60 hover:text-yellow-400' : theme === 'chef-mode' ? 'text-orange-900/60 hover:text-orange-900' : 'text-white/50 hover:text-white')}`}>
                    <span className="text-lg">üé≤</span> Random Recipes
                  </button>
                  <button onClick={() => setInputMode('search')} className={`px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center ${inputMode === 'search' ? (theme === 'coldest' ? 'bg-sky-500 text-white shadow-sm' : theme === 'crazy-bird' ? 'bg-red-600 text-white shadow-sm' : theme === 'hustle-time' ? 'bg-yellow-500 text-emerald-950 shadow-sm' : theme === 'chef-mode' ? 'bg-orange-500 text-white shadow-sm' : 'bg-white/20 text-white shadow-sm') : (theme === 'coldest' ? 'text-sky-900/60 hover:text-sky-900' : theme === 'crazy-bird' ? 'text-red-100/60 hover:text-white' : theme === 'hustle-time' ? 'text-yellow-100/60 hover:text-yellow-400' : theme === 'chef-mode' ? 'text-orange-900/60 hover:text-orange-900' : 'text-white/50 hover:text-white')}`}>
                    <span className="text-lg">üîç</span> Search Options
                  </button>
                  <button onClick={() => setInputMode('upload')} className={`px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center ${inputMode === 'upload' ? (theme === 'coldest' ? 'bg-sky-500 text-white shadow-sm' : theme === 'crazy-bird' ? 'bg-red-600 text-white shadow-sm' : theme === 'hustle-time' ? 'bg-yellow-500 text-emerald-950 shadow-sm' : theme === 'chef-mode' ? 'bg-orange-500 text-white shadow-sm' : 'bg-white/20 text-white shadow-sm') : (theme === 'coldest' ? 'text-sky-900/60 hover:text-sky-900' : theme === 'crazy-bird' ? 'text-red-100/60 hover:text-white' : theme === 'hustle-time' ? 'text-yellow-100/60 hover:text-yellow-400' : theme === 'chef-mode' ? 'text-orange-900/60 hover:text-orange-900' : 'text-white/50 hover:text-white')}`}>
                    <span className="text-lg">üìé</span> Upload Files
                  </button>
                  <button 
                    onClick={() => setShowInputModeInfo(true)}
                    className={`w-8 h-8 ml-1 mr-1 flex items-center justify-center rounded-full transition-all font-bold text-sm ${
                      theme === 'coldest' ? 'text-sky-900/60 hover:bg-sky-500/20 hover:text-sky-900' : 
                      theme === 'crazy-bird' ? 'text-red-100/60 hover:bg-red-500/20 hover:text-white' : 
                      theme === 'hustle-time' ? 'text-yellow-100/60 hover:bg-yellow-500/20 hover:text-yellow-400' : 
                      theme === 'chef-mode' ? 'text-orange-900/60 hover:bg-orange-500/20 hover:text-orange-900' : 
                      'text-white/50 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    ?
                  </button>
                </div>
              </div>

              {(inputMode === 'random' || inputMode === 'search') && (
                <div className={`transition-all duration-700 flex flex-col items-center gap-1.5 max-w-[110px] mx-auto mt-3 mb-5 ${mainTab === null ? 'blur-[8px] pointer-events-none opacity-40' : 'animate-in fade-in slide-in-from-bottom-4 duration-300'}`}>
                  <div className="flex flex-col gap-1 w-full text-center">
                    <label className={`text-[9px] font-black uppercase tracking-widest opacity-50 ${theme === 'coldest' ? 'text-slate-900' : 'text-white'}`}>
                      BPM (Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 140"
                      value={generationBPM}
                      onChange={(e) => setGenerationBPM(e.target.value)}
                      className={`text-center w-full py-1.5 px-3 rounded-full text-[11px] font-medium transition-all outline-none border-2 ${
                        theme === 'coldest' 
                          ? 'bg-white/60 border-sky-100 focus:border-sky-400 text-slate-900 placeholder:text-slate-400' 
                          : theme === 'crazy-bird'
                          ? 'bg-red-950/40 border-red-900/50 focus:border-red-500 text-white placeholder:text-red-300/50'
                          : theme === 'chef-mode'
                          ? 'bg-orange-100/50 border-orange-200 focus:border-orange-400 text-slate-900 placeholder:text-orange-900/50'
                          : 'bg-black/60 border-white/10 focus:border-white/30 text-white placeholder:text-gray-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              {inputMode === 'random' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col items-center mt-4 mb-4">
                  <button onClick={handleGenerate} disabled={loading || mainTab === null} className={`py-4 px-12 rounded-full font-black text-xs select-none shadow-lg hover:scale-105 active:scale-95 transition-all disabled:scale-100 ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-sky-500 text-white' : 'bg-white text-black'} ${mainTab === null ? 'blur-[8px] opacity-40' : ''}`}>{loading ? t('architecting') : t('get_random_recipes')}</button>
                  
                                  {(dawType === 'REAPER' || dawType === 'Reaper') && (
                  <div className="flex justify-center mt-6 gap-3">
                    <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${!isJsfxMode ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>REAPER JSFX ONLY</span>
                      <button 
                        onClick={() => setIsJsfxMode(!isJsfxMode)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${isJsfxMode ? 'bg-[#10b981]' : 'bg-slate-400/50'}`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isJsfxMode ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowReapackReposModal(true)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${theme === 'coldest' ? 'bg-white/40 hover:bg-white/60' : 'bg-black/40 hover:bg-black/60'} transition-colors`}
                    >
                      <Database className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-slate-900' : 'text-white'}`}>
                        ReaPack JSFX Repositories
                      </span>
                    </button>
                  </div>
                )}
                {dawType === 'LUNA' && (
                  <div className="flex justify-center mt-6 gap-3">
                    <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${lunaSumming === 'api' ? (theme === 'coldest' ? 'text-sky-600' : 'text-sky-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>API SUMMING</span>
                      
                      <div className={`relative w-16 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${theme === 'coldest' ? 'bg-slate-300' : 'bg-slate-800'}`} onClick={() => setLunaSumming(lunaSumming === 'api' ? 'off' : (lunaSumming === 'off' ? 'neve' : 'api'))}>
                         <div className={`absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${lunaSumming === 'api' ? 'left-1 bg-sky-500' : lunaSumming === 'neve' ? 'left-[44px] bg-red-500' : 'left-6 bg-slate-400'}`} />
                      </div>
                      
                      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${lunaSumming === 'neve' ? (theme === 'coldest' ? 'text-red-600' : 'text-red-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>NEVE SUMMING</span>
                      
                      <span className={`ml-2 text-[10px] font-black uppercase tracking-widest transition-colors ${lunaSumming === 'off' ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>
                        {lunaSumming === 'off' ? 'OFF' : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              )}

              {inputMode === 'upload' && (
              <div className={`transition-all duration-700 ${mainTab === null ? 'blur-[8px] pointer-events-none opacity-40' : 'animate-in fade-in slide-in-from-bottom-4 duration-300'}`}>
                <div className={`flex flex-col gap-4 mt-2`}>
                  <div className="text-center mt-2 mb-4">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-lg ${theme === 'coldest' ? 'bg-sky-500/10 text-sky-500 shadow-sky-500/20' : 'bg-purple-500/20 text-purple-400 shadow-purple-500/20'}`}>
                     <span className="text-4xl text-glow-pulse">üìé</span>
                  </div>
                  <h3 className={`text-[12px] font-black uppercase tracking-[0.2em] opacity-80 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                    {audioMode === 'recipe' ? 'Generate recipe by uploading music files' : audioMode === 'album' ? 'Upload album tracks for cohesive mastering' : 'Upload music files for suggested improvements'}
                  </h3>
                </div>

                <div className="flex justify-center mb-2">
                  <div className={`inline-flex rounded-full p-1 ${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}`}>
                                        <button
                      id="btn-audio-recipe"
                      onClick={() => setAudioMode('recipe')}
                      className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                        audioMode === 'recipe' 
                          ? (theme === 'coldest' ? 'bg-sky-500 text-white shadow-md' : 'bg-white text-black shadow-md')
                          : (theme === 'coldest' ? 'text-slate-600 hover:text-slate-900' : 'text-white/60 hover:text-white')
                      }`}
                    >
                      {t('extract_recipe')}
                    </button>
                    <button
                      id="btn-audio-critique"
                      onClick={() => setAudioMode('critique')}
                      className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        audioMode === 'critique' 
                          ? (theme === 'coldest' ? 'bg-purple-500 text-white shadow-md' : 'bg-purple-500 text-white shadow-md')
                          : (theme === 'coldest' ? 'text-slate-600 hover:text-slate-900' : 'text-white/60 hover:text-white')
                      }`}
                    >
                      <span>{t('mix_critique')}</span>
                    </button>
                    <button
                      id="btn-album-mastering"
                      onClick={() => { setAudioMode('album'); setHasStems(true); }}
                      className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        audioMode === 'album' 
                          ? (theme === 'coldest' ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-500 text-white shadow-md')
                          : (theme === 'coldest' ? 'text-slate-600 hover:text-slate-900' : 'text-white/60 hover:text-white')
                      }`}
                    >
                      <span>Album Mastering</span>
                    </button>
                  </div>
                </div>

                {audioMode === 'critique' && (
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <div className="flex flex-wrap justify-center gap-4">
                      <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}`}>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${!hasStems ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>{t('audio_file')}</span>
                        
                        <button 
                          onClick={() => setHasStems(!hasStems)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${hasStems ? 'bg-purple-500' : 'bg-slate-400/50'}`}
                        >
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${hasStems ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${hasStems ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>{t('i_have_stems')}</span>
                      </div>

                      <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}`}>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${!isMasterMode ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>Mix Mode</span>
                        <button 
                          onClick={() => setIsMasterMode(!isMasterMode)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${isMasterMode ? 'bg-[#10b981]' : 'bg-slate-400/50'}`}
                        >
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isMasterMode ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isMasterMode ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>Master Mode</span>
                      </div>

                      <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}`}>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${!isBusMode ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>Normal</span>
                        <button 
                          onClick={() => setIsBusMode(!isBusMode)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${isBusMode ? 'bg-sky-500' : 'bg-slate-400/50'}`}
                        >
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isBusMode ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isBusMode ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>Bus Mode</span>
                      </div>
                      <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}`}>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isMultiBandMode ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>Multiband (Gaffel)</span>
                        <button 
                          onClick={() => setIsMultiBandMode(!isMultiBandMode)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${isMultiBandMode ? 'bg-purple-500' : 'bg-slate-400/50'}`}
                        >
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isMultiBandMode ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      
                      {dawType === 'LUNA' && (
                        <>
                          <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}`}>
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${lunaSumming === 'api' ? (theme === 'coldest' ? 'text-sky-600' : 'text-sky-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>API SUMMING</span>
                            
                            <div className={`relative w-16 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${theme === 'coldest' ? 'bg-slate-300' : 'bg-slate-800'}`} onClick={() => setLunaSumming(lunaSumming === 'api' ? 'off' : (lunaSumming === 'off' ? 'neve' : 'api'))}>
                               <div className={`absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${lunaSumming === 'api' ? 'left-1 bg-sky-500' : lunaSumming === 'neve' ? 'left-[44px] bg-red-500' : 'left-6 bg-slate-400'}`} />
                            </div>
                            
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${lunaSumming === 'neve' ? (theme === 'coldest' ? 'text-red-600' : 'text-red-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>NEVE SUMMING</span>
                            
                            <span className={`ml-2 text-[10px] font-black uppercase tracking-widest transition-colors ${lunaSumming === 'off' ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>
                              {lunaSumming === 'off' ? 'OFF' : ''}
                            </span>
                          </div>

                          <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}`}>
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${lunaTape === 'oxide' ? (theme === 'coldest' ? 'text-orange-600' : 'text-orange-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>OXIDE TAPE</span>
                            
                            <div className={`relative w-16 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${theme === 'coldest' ? 'bg-slate-300' : 'bg-slate-800'}`} onClick={() => setLunaTape(lunaTape === 'oxide' ? 'off' : (lunaTape === 'off' ? 'studer' : 'oxide'))}>
                               <div className={`absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${lunaTape === 'oxide' ? 'left-1 bg-orange-500' : lunaTape === 'studer' ? 'left-[44px] bg-emerald-500' : 'left-6 bg-slate-400'}`} />
                            </div>
                            
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${lunaTape === 'studer' ? (theme === 'coldest' ? 'text-emerald-600' : 'text-emerald-400') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>STUDER A800</span>
                            
                            <span className={`ml-2 text-[10px] font-black uppercase tracking-widest transition-colors ${lunaTape === 'off' ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>
                              {lunaTape === 'off' ? 'OFF' : ''}
                            </span>
                          </div>
                        </>
                      )}

                    </div>
                    {(dawType === 'REAPER' || dawType === 'Reaper') && (
                        <div className="flex flex-col gap-3">
                          {critiques.length > 0 && (
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => handlePushReaperSync(critiques[0])}
                                disabled={isPushingReaperSync}
                                className={`flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-black text-[10px] uppercase tracking-widest transition-all ${
                                  theme === 'coldest'
                                    ? isPushingReaperSync ? 'bg-slate-200 text-slate-400' : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/20 active:scale-95'
                                    : isPushingReaperSync ? 'bg-zinc-800 text-zinc-500' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/40 active:scale-95'
                                }`}
                              >
                                {isPushingReaperSync ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                {showSyncSuccess ? "SYNCCED TO CLOUD!" : "Push REAPER Sync"}
                              </button>
                            </div>
                          )}

                          {critiques.length > 0 && (user?.email === 'recognizemiracles@gmail.com' || user?.email === 'coldestconcept@gmail.com' || user?.email === 'ruhedramarkprod@gmail.com') && (
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={handlePushExhaustiveJSFXSync}
                                disabled={isPushingReaperSync}
                                className={`flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-black text-[10px] uppercase tracking-widest transition-all ${
                                  theme === 'coldest'
                                    ? isPushingReaperSync ? 'bg-slate-200 text-slate-400' : 'bg-red-500 text-white hover:bg-red-650 shadow-md active:scale-95'
                                    : isPushingReaperSync ? 'bg-zinc-800 text-zinc-500' : 'bg-red-600 text-white hover:bg-red-550 shadow-md active:scale-95'
                                }`}
                              >
                                {isPushingReaperSync ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-yellow-300" />}
                                {showSyncSuccess ? "SYNCCED EXHAUSTIVE TEST!" : "Push EXHAUSTIVE JSFX SYNC TEST"}
                              </button>
                            </div>
                          )}

                          {reaperSyncPin && (
                            <div className={`flex items-center justify-center gap-3 px-4 py-2 rounded-2xl border-2 border-dashed animate-in fade-in slide-in-from-top-2 duration-300 ${
                              theme === 'coldest' ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                            }`}>
                              <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Connect PIN</span>
                                <span className="text-lg font-black tracking-[0.3em] leading-none">{reaperSyncPin}</span>
                              </div>
                              <div className={`h-8 w-[2px] ${theme === 'coldest' ? 'bg-purple-200' : 'bg-purple-500/30'}`} />
                              <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Status</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Link</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-[#10b981] rounded-full text-white">
                            <button
                              onClick={async () => {
                                try {
                                  const zip = new JSZip();
                                  let logoBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
                                  const svgEl = document.getElementById("mascot-svg") as any;
                                  
                                  if (svgEl) {
                                    try {
                                      const serializedSvg = new XMLSerializer().serializeToString(svgEl);
                                      const blob = new Blob([serializedSvg], { type: "image/svg+xml;charset=utf-8" });
                                      const url = URL.createObjectURL(blob);
                                      
                                      const img = new Image();
                                      const loadedPromise = new Promise<string>((resolveImg, rejectImg) => {
                                        img.onload = () => {
                                          const canvas = document.createElement("canvas");
                                          canvas.width = 400;
                                          canvas.height = 400;
                                          const ctx = canvas.getContext("2d");
                                          if (ctx) {
                                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                            resolveImg(canvas.toDataURL("image/png").split(",")[1]);
                                          } else {
                                            rejectImg(new Error("No canvas context"));
                                          }
                                        };
                                        img.onerror = () => rejectImg(new Error("Image load failed"));
                                      });
                                      img.src = url;
                                      logoBase64 = await loadedPromise;
                                      URL.revokeObjectURL(url);
                                    } catch (err) {
                                      console.error("Failed to dynamically convert Mascot SVG to PNG", err);
                                      
                                      // Fallback offscreen drawing from DAWGuide
                                      try {
                                        const canvas = document.createElement('canvas');
                                        canvas.width = 400;
                                        canvas.height = 400;
                                        const ctx = canvas.getContext('2d');
                                        if (ctx) {
                                          const cx = 200, cy = 200, r = 150;
                                          ctx.fillStyle = '#0f172a';
                                          ctx.beginPath(); ctx.arc(cx, cy, r + 10, 0, Math.PI * 2); ctx.fill();
                                          ctx.fillStyle = '#3b82f6'; // User's mascot color
                                          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
                                          
                                          // Durag cap
                                          ctx.fillStyle = '#000000';
                                          ctx.beginPath(); ctx.arc(cx, cy - 30, r + 3, Math.PI, 0); ctx.fill();
                                          ctx.fillRect(cx - r - 5, cy - 45, r * 2 + 10, 45);
                                          
                                          // Knot
                                          ctx.beginPath(); ctx.moveTo(cx + r, cy - 15); ctx.lineTo(cx + r + 80, cy + 50); ctx.lineTo(cx + r + 25, cy + 80); ctx.fill();
                                          ctx.beginPath(); ctx.moveTo(cx + r, cy - 15); ctx.lineTo(cx + r + 50, cy + 90); ctx.lineTo(cx - 15 + r, cy + 115); ctx.fill();
                                          
                                          // Eyes
                                          ctx.fillStyle = '#000000';
                                          const lx = cx - 60, rx = cx + 60, ey = cy + 15;
                                          ctx.beginPath(); ctx.arc(lx, ey, 32, 0, Math.PI*2); ctx.fill();
                                          ctx.beginPath(); ctx.arc(rx, ey, 32, 0, Math.PI*2); ctx.fill();
                                          
                                          // Pupils
                                          ctx.fillStyle = '#ffffff';
                                          ctx.beginPath(); ctx.arc(lx + 10, ey + 6, 12, 0, Math.PI*2); ctx.fill();
                                          ctx.beginPath(); ctx.arc(rx - 6, ey + 6, 12, 0, Math.PI*2); ctx.fill();
                                          
                                          // Grill
                                          const gx = cx - 65, gy = cy + 70;
                                          ctx.fillStyle = '#000000';
                                          ctx.fillRect(gx - 10, gy - 10, 150, 50);
                                          for (let i = 0; i < 6; i++) {
                                            ctx.fillStyle = '#ffffff';
                                            ctx.fillRect(gx + i * 22, gy, 18, 28);
                                          }
                                          
                                          // Sword/Dagger
                                          ctx.lineWidth = 12;
                                          ctx.strokeStyle = '#94a3b8';
                                          ctx.beginPath(); ctx.moveTo(cx - 130, cy + 130); ctx.lineTo(cx - 210, cy + 210); ctx.stroke();
                                          ctx.strokeStyle = '#1e293b';
                                          ctx.beginPath(); ctx.moveTo(cx - 210, cy + 210); ctx.lineTo(cx - 240, cy + 240); ctx.stroke();
                                          
                                          logoBase64 = canvas.toDataURL('image/png').split(',')[1];
                                        }
                                      } catch (fallbackErr) {
                                        console.error("Canvas draw fallback failed", fallbackErr);
                                      }
                                    }
                                  } else {
                                    // Direct Canvas drawing as accurate fallback if SVG element not found in DOM
                                    try {
                                      const canvas = document.createElement('canvas');
                                      canvas.width = 400;
                                      canvas.height = 400;
                                      const ctx = canvas.getContext('2d');
                                      if (ctx) {
                                        const cx = 200, cy = 200, r = 150;
                                        ctx.fillStyle = '#0f172a';
                                        ctx.beginPath(); ctx.arc(cx, cy, r + 10, 0, Math.PI * 2); ctx.fill();
                                        ctx.fillStyle = '#3b82f6';
                                        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
                                        
                                        // Durag cap
                                        ctx.fillStyle = '#000000';
                                        ctx.beginPath(); ctx.arc(cx, cy - 30, r + 3, Math.PI, 0); ctx.fill();
                                        ctx.fillRect(cx - r - 5, cy - 45, r * 2 + 10, 45);
                                        
                                        // Knot
                                        ctx.beginPath(); ctx.moveTo(cx + r, cy - 15); ctx.lineTo(cx + r + 80, cy + 50); ctx.lineTo(cx + r + 25, cy + 80); ctx.fill();
                                        ctx.beginPath(); ctx.moveTo(cx + r, cy - 15); ctx.lineTo(cx + r + 50, cy + 90); ctx.lineTo(cx - 15 + r, cy + 115); ctx.fill();
                                        
                                        // Eyes
                                        ctx.fillStyle = '#000000';
                                        const lx = cx - 60, rx = cx + 60, ey = cy + 15;
                                        ctx.beginPath(); ctx.arc(lx, ey, 32, 0, Math.PI*2); ctx.fill();
                                        ctx.beginPath(); ctx.arc(rx, ey, 32, 0, Math.PI*2); ctx.fill();
                                        
                                        // Pupils
                                        ctx.fillStyle = '#ffffff';
                                        ctx.beginPath(); ctx.arc(lx + 10, ey + 6, 12, 0, Math.PI*2); ctx.fill();
                                        ctx.beginPath(); ctx.arc(rx - 6, ey + 6, 12, 0, Math.PI*2); ctx.fill();
                                        
                                        // Grill
                                        const gx = cx - 65, gy = cy + 70;
                                        ctx.fillStyle = '#000000';
                                        ctx.fillRect(gx - 10, gy - 10, 150, 50);
                                        for (let i = 0; i < 6; i++) {
                                          ctx.fillStyle = '#ffffff';
                                          ctx.fillRect(gx + i * 22, gy, 18, 28);
                                        }
                                        
                                        // Sword/Dagger
                                        ctx.lineWidth = 12;
                                        ctx.strokeStyle = '#94a3b8';
                                        ctx.beginPath(); ctx.moveTo(cx - 130, cy + 130); ctx.lineTo(cx - 210, cy + 210); ctx.stroke();
                                        ctx.strokeStyle = '#1e293b';
                                        ctx.beginPath(); ctx.moveTo(cx - 210, cy + 210); ctx.lineTo(cx - 240, cy + 240); ctx.stroke();
                                        
                                        logoBase64 = canvas.toDataURL('image/png').split(',')[1];
                                      }
                                    } catch (fallbackErr) {
                                      console.error("Direct canvas draw failed", fallbackErr);
                                    }
                                  }

                                  const finalLua = getReaperLua(window.location.origin);
                                  zip.file("BeatGangsta_Connect.lua", finalLua);
                                  
                                  // Convert base64 to binary for the PNG file
                                  const byteCharacters = atob(logoBase64);
                                  const byteNumbers = new Array(byteCharacters.length);
                                  for (let i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                  }
                                  const byteArray = new Uint8Array(byteNumbers);
                                  zip.file("beatgangsta_logo.png", byteArray);
                                  
                                  const content = await zip.generateAsync({ type: "blob" });
                                  saveAs(content, "BeatGangsta_ReaperLink.zip");
                                } catch (err: any) {
                                  console.error("[BG-CONNECT-ERROR] [ZIP_GEN] Failed to generate BeatGangsta Connect ZIP:", err);
                                  const errTrace = err.stack || err.message || String(err);
                                  setLatestErrorLog(`[ERR_BG_ZIP_GEN] ZIP Generation failed.\nDetails:\n${errTrace}`);
                                  setError(`[ERR_BG_ZIP_GEN] Failed to build BeatGangsta Connect package: ${err.message || "Unknown Error"}`);
                                }
                              }}
                              className={`inline-flex items-center gap-2 rounded-l-full px-4 py-2 font-black text-[10px] uppercase tracking-widest transition-colors bg-[#10b981] text-white hover:bg-[#059669]`}
                            >
                              <Download className="w-3 h-3" />
                              BeatGangsta Connect (.zip)
                            </button>
                            <button 
                              onClick={() => setShowJsfxHelpModal(true)}
                              className={`rounded-r-full pr-3 pl-1 py-2 transition-colors flex items-center justify-center bg-[#10b981] text-white hover:bg-[#059669] border-l border-[#059669]/30`}
                              title="How to use BeatGangsta Connect"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${theme === 'coldest' ? 'bg-white/40' : 'bg-black/40'}`}>
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${!isJsfxMode ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>REAPER JSFX ONLY</span>
                            <button 
                              onClick={() => setIsJsfxMode(!isJsfxMode)}
                              className={`relative w-10 h-5 rounded-full transition-colors ${isJsfxMode ? 'bg-[#10b981]' : 'bg-slate-400/50'}`}
                            >
                              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isJsfxMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                          <button
                            onClick={() => setShowReapackReposModal(true)}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${theme === 'coldest' ? 'bg-white/40 hover:bg-white/60' : 'bg-black/40 hover:bg-black/60'} transition-colors`}
                          >
                            <Database className="w-3.5 h-3.5 text-[#10b981]" />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-slate-900' : 'text-white'}`}>
                              ReaPack JSFX Repositories
                            </span>
                          </button>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 mb-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${theme === 'coldest' ? 'text-slate-900' : 'text-white'}`}>
                    {audioMode === 'album' ? 'Album Theme / Context' : (audioMode === 'critique' ? t('critique_context') : t('vibe_context'))}
                  </label>
                  <textarea
                    value={critiqueContext}
                    onChange={(e) => setCritiqueContext(e.target.value)}
                    placeholder={audioMode === 'album' ? 'Describe the general vibe of the album...' : (audioMode === 'critique' ? t('critique_context_placeholder', { artist: placeholderArtist }) : t('vibe_context_placeholder', { artist: placeholderArtist }))}
                    className={`w-full p-4 rounded-2xl text-xs font-medium transition-all outline-none border-2 ${
                      theme === 'coldest' 
                        ? 'bg-white/60 border-purple-100 focus:border-purple-400 text-slate-900 placeholder:text-slate-400' 
                        : 'bg-black/40 border-purple-500/20 focus:border-purple-500/60 text-white placeholder:text-white/20'
                    }`}
                    rows={2}
                  />
                </div>

                {audioMode === 'critique' && (
                  <div className="flex flex-col gap-2 mb-4">
                    <label className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${theme === 'coldest' ? 'text-slate-900' : 'text-white'}`}>
                      Reference Track (Optional)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={referenceTrack}
                        onChange={(e) => setReferenceTrack(e.target.value)}
                        placeholder="e.g., URL or name of a song you want your mix to sound like"
                        className={`flex-1 p-4 rounded-2xl text-xs font-medium transition-all outline-none border-2 ${
                          theme === 'coldest' 
                            ? 'bg-white/60 border-purple-100 focus:border-purple-400 text-slate-900 placeholder:text-slate-400' 
                            : 'bg-black/40 border-purple-500/20 focus:border-purple-500/60 text-white placeholder:text-white/20'
                        }`}
                        disabled={!!referenceTrackFile}
                      />
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${theme === 'coldest' ? 'text-slate-500' : 'text-white/50'}`}>{t('or_label')}</span>
                        <button
                          onClick={() => referenceTrackInputRef.current?.click()}
                          className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                            referenceTrackFile
                              ? 'bg-emerald-500 text-white'
                              : theme === 'coldest'
                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/40'
                          }`}
                        >
                          {referenceTrackFile ? 'File Selected ‚úì' : 'Upload MP3/WAV'}
                        </button>
                        {referenceTrackFile && (
                          <button
                            onClick={() => setReferenceTrackFile(null)}
                            className="p-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            title="Clear file"
                          >
                            ‚úï
                          </button>
                        )}
                        <input
                          type="file"
                          ref={referenceTrackInputRef}
                          className="hidden"
                          accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setReferenceTrackFile(file);
                              setReferenceTrack(''); // Clear text input if file is selected
                            }
                            if (referenceTrackInputRef.current) referenceTrackInputRef.current.value = '';
                          }}
                        />
                      </div>
                    </div>
                    {referenceTrackFile && (
                      <span className={`text-[10px] font-medium ${theme === 'coldest' ? 'text-slate-500' : 'text-white/50'}`}>
                        Selected: {referenceTrackFile.name}
                      </span>
                    )}
                  </div>
                )}
                
                {(hasStems || audioMode === 'album') ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className={`text-sm font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-slate-900' : 'text-white'}`}>{audioMode === 'album' ? 'Album Tracks' : 'Stems'} ({stems.filter(s => s.file).length}/{stemsLimit})</h3>
                    </div>

                    {((dawType === 'REAPER' || dawType === 'Reaper')) ? (
                        <div className={`p-5 rounded-2xl border transition-all ${
                          theme === 'coldest' 
                            ? 'bg-purple-100/30 border-purple-200 text-slate-850' 
                            : 'bg-purple-950/10 border-purple-500/20 text-white'
                        }`}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-1 rounded bg-purple-500 text-white">
                              <Cloud className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-purple-500">
                              REAPER Project Folder Importer
                            </h4>
                          </div>
                          <p className="text-xs opacity-75 mb-4 leading-relaxed">
                            Upload your active <span className="font-bold">REAPER Project Folder</span>. We'll instantly parse the <span className="font-bold">.RPP</span> file, extract all tracks, active VST/AU inserts, mute/solo flags, volume levels, and map your audio files directly to stems slots!
                          </p>
                          
                          <div className="flex flex-col gap-3">
                            <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                              theme === 'coldest'
                                ? 'border-purple-200 hover:border-purple-400 bg-white/50 hover:bg-white'
                                : 'border-purple-500/20 hover:border-purple-500 bg-black/20 hover:bg-black/40'
                            }`}>
                              <div className="flex flex-col items-center justify-center text-center">
                                {isReaperPulling ? (
                                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
                                ) : (
                                  <FolderIcon className="w-8 h-8 text-purple-500 mb-2" />
                                )}
                                <p className="text-xs font-bold leading-normal">
                                  {isReaperPulling ? 'Parsing RPP S-expressions & matching audio wavs...' : 'Click to select your REAPER Project Directory'}
                                </p>
                                <p className="text-[10px] opacity-60 mt-1">Select the directory containing your project .rpp and exported stems</p>
                              </div>
                              <input 
                                type="file" 
                                {...({
                                  webkitdirectory: "",
                                  directory: "",
                                  multiple: true
                                } as any)}
                                onChange={handleReaperDirectoryImport}
                                disabled={isReaperPulling}
                                className="hidden"
                              />
                            </label>
                          </div>
                          
                          {reaperPullError && (
                            <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-bold">
                              ‚ö†Ô∏è {reaperPullError}
                            </div>
                          )}
                          
                          {reaperPullSuccess && (
                            <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-500 font-bold">
                              ‚úÖ {reaperPullSuccess}
                            </div>
                          )}

                          {reaperParsedInfo && (
                            <div className={`mt-3 p-4 rounded-xl text-xs space-y-2 border ${
                              theme === 'coldest' ? 'bg-white/80 border-slate-200' : 'bg-black/40 border-zinc-800'
                            }`}>
                              <p className="font-bold text-xs uppercase tracking-wider text-purple-500">üìä Parsed REAPER Session details:</p>
                              <div className="divide-y divide-zinc-700/20">
                                <div className="py-1 flex justify-between text-[11px]">
                                  <span className="opacity-70">Project Name:</span>
                                  <span className="font-semibold">{reaperParsedInfo.title}</span>
                                </div>
                                <div className="py-1 flex justify-between text-[11px]">
                                  <span className="opacity-70">Tracks Discovered:</span>
                                  <span className="font-semibold">{reaperParsedInfo.tracksCount}</span>
                                </div>
                                <div className="py-1 flex justify-between text-[11px]">
                                  <span className="opacity-70">Matched Audio Stems:</span>
                                  <span className="font-semibold text-purple-400">{reaperParsedInfo.stemsCount}</span>
                                </div>
                              </div>
                              
                              {reaperParsedInfo.tracks.length > 0 && (
                                <div className="pt-2">
                                  <p className="font-bold text-[10px] uppercase opacity-75 mb-1 text-zinc-400">Track List & Loaded Effects:</p>
                                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1 custom-scrollbar text-[11px]">
                                    {reaperParsedInfo.tracks.map((t, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-[10px] py-1 border-b border-zinc-500/10 last:border-0 opacity-90">
                                        <div className="flex flex-col">
                                          <span className="truncate max-w-[150px] font-bold">
                                            ‚Ü≥ {t.name}
                                          </span>
                                          <div className="flex gap-2 text-[8px] opacity-65">
                                            <span>Volume: {t.volume || '0dB'}</span>
                                            {t.isMuted && <span className="text-red-500">Muted</span>}
                                            {t.isSoloed && <span className="text-yellow-500">Soloed</span>}
                                          </div>
                                        </div>
                                        <div className="text-[10px] opacity-75 text-purple-400 truncate max-w-[200px] text-right flex gap-1 justify-end flex-wrap">
                                          {t.plugins.length > 0 ? t.plugins.map((p, pIdx) => (
                                            <span key={pIdx}>
                                              {p.readableParams ? (
                                                <button 
                                                  onClick={() => setReaperSelectedPluginParams({ name: p.name, params: p.readableParams! })}
                                                  className="hover:text-purple-300 hover:underline transition-colors"
                                                >
                                                  {p.name}
                                                </button>
                                              ) : (
                                                <span className="opacity-80">{p.name}</span>
                                              )}
                                              {pIdx < t.plugins.length - 1 && <span className="opacity-50 ml-1">‚ûî</span>}
                                            </span>
                                          )) : 'dry'}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (dawType === 'Studio One' || dawType === 'Bitwig') ? (
                        <div className={`p-5 rounded-2xl border transition-all ${
                          theme === 'coldest' 
                            ? 'bg-purple-100/30 border-purple-200 text-slate-850' 
                            : 'bg-purple-950/10 border-purple-500/20 text-white'
                        }`}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-1 rounded bg-purple-500 text-white">
                              <Cloud className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-purple-500">
                              DAWProject Direct Stem Importer (Admin Active)
                            </h4>
                          </div>
                          <p className="text-xs opacity-75 mb-4 leading-relaxed">
                            Upload any <span className="font-bold">.dawproject</span> file exported from Studio One or Bitwig. We'll automatically unpack all active track stems, map them to your slots, and read the plugin channel inserts to craft perfect mix critique guides!
                          </p>
                          
                          <div className="flex flex-col gap-3">
                            <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                              theme === 'coldest'
                                ? 'border-purple-200 hover:border-purple-400 bg-white/50 hover:bg-white'
                                : 'border-purple-500/20 hover:border-purple-500 bg-black/20 hover:bg-black/40'
                            }`}>
                              <div className="flex flex-col items-center justify-center text-center">
                                {isDawProjectPulling ? (
                                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
                                ) : (
                                  <Upload className="w-8 h-8 text-purple-500 mb-2" />
                                )}
                                <p className="text-xs font-bold leading-normal">
                                  {isDawProjectPulling ? 'Reading archives & matching waveforms...' : 'Click to upload or drag .dawproject package'}
                                </p>
                                <p className="text-[10px] opacity-60 mt-1">Bitwig / Studio One .dawproject format including embedded tracks</p>
                              </div>
                              <input 
                                type="file" 
                                accept=".dawproject"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleDawProjectImport(file);
                                }}
                                disabled={isDawProjectPulling}
                                className="hidden"
                              />
                            </label>
                          </div>
                          
                          {dawProjectPullError && (
                            <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-bold">
                              ‚ö†Ô∏è {dawProjectPullError}
                            </div>
                          )}
                          
                          {dawProjectPullSuccess && (
                            <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-500 font-bold">
                              ‚úÖ {dawProjectPullSuccess}
                            </div>
                          )}

                          {dawProjectParsedInfo && (
                            <div className={`mt-3 p-4 rounded-xl text-xs space-y-2 border ${
                              theme === 'coldest' ? 'bg-white/80 border-slate-200' : 'bg-black/40 border-zinc-800'
                            }`}>
                              <p className="font-bold text-xs uppercase tracking-wider text-purple-500">‚ÑπÔ∏è Extracted Session Layout:</p>
                              <div className="divide-y divide-zinc-700/20">
                                <div className="py-1 flex justify-between text-[11px]">
                                  <span className="opacity-70">Project Name:</span>
                                  <span className="font-semibold">{dawProjectParsedInfo.title}</span>
                                </div>
                                <div className="py-1 flex justify-between text-[11px]">
                                  <span className="opacity-70">Tracks Count:</span>
                                  <span className="font-semibold">{dawProjectParsedInfo.tracksCount}</span>
                                </div>
                                <div className="py-1 flex justify-between text-[11px]">
                                  <span className="opacity-70">Extracted Audio Stems:</span>
                                  <span className="font-semibold text-purple-400">{dawProjectParsedInfo.stemsCount}</span>
                                </div>
                              </div>
                              
                              {dawProjectParsedInfo.tracks.length > 0 && (
                                <div className="pt-2">
                                  <p className="font-bold text-[10px] uppercase opacity-75 mb-1 text-zinc-400">Discovered Channels & Inserts:</p>
                                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1 custom-scrollbar text-[11px]">
                                    {dawProjectParsedInfo.tracks.map((t, idx) => (
                                      <div key={idx} className="flex justify-between items-center text-[10px] py-1 border-b border-zinc-500/10 last:border-0 opacity-90">
                                        <span className="truncate max-w-[150px] font-medium">‚Ü≥ {t.name}</span>
                                        <span className="text-[10px] opacity-75 text-purple-400 truncate max-w-[180px]">
                                          {t.plugins.length > 0 ? t.plugins.join(' ‚ûî ') : 'dry'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : null
                    }

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between gap-2">
                        <button
                          onClick={() => {
                            if (stemsLimit < 30) {
                              setStemSlotSliderValue(1);
                              setShowBuyStemsModal(true);
                            }
                          }}
                          className={`flex-1 p-4 rounded-xl text-center font-black transition-all border-2 ${
                            stemsLimit < 30
                              ? theme === 'coldest'
                                ? 'bg-purple-100/50 hover:bg-purple-100 border-purple-200 text-purple-700 hover:scale-[1.02]'
                                : 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-300 hover:scale-[1.02]'
                              : theme === 'coldest'
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-default'
                                : 'bg-zinc-800/50 border-zinc-700 text-zinc-500 cursor-default'
                          }`}
                        >
                          {stemsLimit < 30 ? "Maximize Your Mixing Power: Add Additional Upload Slots ‚ö°" : "Max Amount of Upload Slots Unlocked"}
                        </button>
                        
                        {stems.some(s => s.file) && (
                          <button
                            onClick={() => {
                              setStems(prev => prev.map(s => ({ ...s, file: null, status: 'empty' as const, mimeType: '' })));
                              setHasStems(false);
                            }}
                            className={`p-4 rounded-xl text-center font-black transition-all border-2 ${
                              theme === 'coldest' 
                                ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600' 
                                : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400'
                            }`}
                            title="Clear All Stems"
                          >
                           <X className="w-5 h-5 mx-auto" />
                           <span className="text-[10px] uppercase">Clear Stems</span>
                           </button>
                        )}
                      </div>

                      {/* Premium Drag & Drop Area for Multiple Stems */}
                      <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverStemId('multi'); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverStemId(null); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDragOverStemId(null);
                          const files = Array.from(e.dataTransfer.files || []);
                          if (files.length > 0) {
                            const newStems = [...stems];
                            let startIdx = 0;
                            const firstEmpty = newStems.findIndex(s => !s.file);
                            if (firstEmpty !== -1) {
                              startIdx = firstEmpty;
                            }
                            let fileIdx = 0;
                            for (let i = startIdx; i < newStems.length && fileIdx < files.length; i++) {
                              newStems[i] = { ...newStems[i], file: files[fileIdx], mimeType: files[fileIdx].type, status: 'pending' };
                              fileIdx++;
                            }
                            setStems(newStems);
                          }
                        }}
                        onClick={() => document.getElementById('multi-stem-upload-input')?.click()}
                        className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] group ${
                          dragOverStemId === 'multi'
                            ? 'border-sky-500 bg-sky-500/15 scale-[1.02]'
                            : theme === 'coldest'
                              ? 'border-purple-200 bg-purple-100/20 hover:bg-purple-100/40 hover:border-purple-400'
                              : 'border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="p-3 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                          <Upload className="w-6 h-6 text-purple-500 animate-pulse" />
                        </div>
                        <div className={`text-xs font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-slate-800' : 'text-white'}`}>
                          {audioMode === 'album' ? 'Drag & Drop All Your Album Tracks Here' : 'Drag & Drop All Your Stems Here'}
                        </div>
                        <div className={`text-[10px] font-bold opacity-60 max-w-sm ${theme === 'coldest' ? 'text-slate-500' : 'text-white/70'}`}>
                          Drop multiple files to populate slots at once, or <span className="text-purple-500 underline">click to browse</span>. Max {stemsLimit} slots.
                        </div>
                        <input
                          id="multi-stem-upload-input"
                          type="file"
                          multiple
                          accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              const newStems = [...stems];
                              let startIdx = 0;
                              const firstEmpty = newStems.findIndex(s => !s.file);
                              if (firstEmpty !== -1) {
                                startIdx = firstEmpty;
                              }
                              let fileIdx = 0;
                              for (let i = startIdx; i < newStems.length && fileIdx < files.length; i++) {
                                newStems[i] = { ...newStems[i], file: files[fileIdx], mimeType: files[fileIdx].type, status: 'pending' };
                                fileIdx++;
                              }
                              setStems(newStems);
                            }
                            if (e.target) e.target.value = '';
                          }}
                        />
                      </div>

                      {stems.map((stem, index) => (
                        <div 
                          key={stem.id} 
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverStemId(stem.id); }}
                          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverStemId(null); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOverStemId(null);
                            const files = Array.from(e.dataTransfer.files || []);
                            if (files.length > 0) {
                              const newStems = [...stems];
                              let fileIdx = 0;
                              for (let i = index; i < newStems.length && fileIdx < files.length; i++) {
                                newStems[i] = { ...newStems[i], file: files[fileIdx], mimeType: files[fileIdx].type, status: 'pending' };
                                fileIdx++;
                              }
                              setStems(newStems);
                            }
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${dragOverStemId === stem.id ? 'scale-[1.02] border-sky-500 bg-sky-500/10' : theme === 'coldest' ? 'bg-white/60 border-purple-100' : 'bg-black/40 border-purple-500/20'}`}
                        >
                          <div className="flex-1 flex items-center gap-2">
                            <span className={`text-xs font-bold opacity-50 w-4 ${theme === 'coldest' ? 'text-slate-500' : 'text-white'}`}>{index + 1}.</span>
                            {stem.file ? (
                              <div className={`truncate text-xs font-medium ${theme === 'coldest' ? 'text-slate-700' : 'text-white/80'}`}>{stem.file.name}</div>
                            ) : (
                              <button 
                                onClick={() => document.getElementById(`stem-upload-${index}`)?.click()}
                                className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${theme === 'coldest' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/40'}`}
                              >
                                + Upload File
                              </button>
                            )}
                            <input 
                              id={`stem-upload-${index}`}
                              type="file" 
                              multiple
                              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav"
                              className="hidden"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length > 0) {
                                  const newStems = [...stems];
                                  let fileIdx = 0;
                                  for (let i = index; i < newStems.length && fileIdx < files.length; i++) {
                                    newStems[i] = { ...newStems[i], file: files[fileIdx], mimeType: files[fileIdx].type, status: 'pending' };
                                    fileIdx++;
                                  }
                                  setStems(newStems);
                                }
                                if (e.target) e.target.value = '';
                              }}
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <select
                              value={stem.type}
                              onChange={(e) => updateStemType(index, e.target.value)}
                              className={`text-xs p-2 rounded-lg border outline-none min-w-[140px] ${theme === 'coldest' ? 'bg-white border-purple-200 text-slate-900' : 'bg-black border-purple-500/30 text-white'}`}
                            >
                              {['Instrumental Mixdown', 'Lead Vocal', 'Backing Vocal', 'Ad Libs', 'Chorus / Hook', 'Spoken Word', 'Kick', 'Snare', 'Hi-Hat', 'Toms', 'Overheads / Cymbals', 'Drum Room / Bus', 'Bass', 'Guitar (Acoustic)', 'Guitar (Electric)', 'Synth / Keys', 'Strings', 'Brass / Woodwinds', 'Percussion', 'FX / Foley', 'Other'].map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                            
                            {stem.type === 'Other' && (
                              <input
                                type="text"
                                value={stem.customType || ''}
                                onChange={(e) => updateStemType(index, stem.type, e.target.value)}
                                placeholder="Specify type..."
                                className={`text-xs p-2 rounded-lg border outline-none w-32 ${theme === 'coldest' ? 'bg-white border-purple-200 text-slate-900 placeholder:text-slate-400' : 'bg-black border-purple-500/30 text-white placeholder:text-white/40'}`}
                              />
                            )}
                          </div>
                          
                          {stem.file && (
                            <button onClick={() => {
                              const newStems = [...stems];
                              newStems[index] = { ...newStems[index], file: null, status: 'empty', mimeType: '' };
                              setStems(newStems);
                            }} className="text-red-400 hover:text-red-300 p-1">
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {stems.filter(s => s.file).length > 0 && (
                      <button 
                        onClick={() => handleStemsSearch()}
                        disabled={loading} 
                        className="w-full py-5 px-6 rounded-3xl font-black text-xs select-none shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex flex-col items-center justify-center gap-2 bg-purple-600 text-white mt-2"
                      >
                        <span className="text-xl">üì§</span>
                        {audioAnalysisLoading ? t('analyzing') : 'Analyze Stems'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col w-full gap-4">
                    {audioMode === 'recipe' ? (
                      <div className="flex flex-col w-full gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Slot 1: Vibe File */}
                          <div 
                            id="dropzone-vibe"
                            onClick={() => vibeFileInputRef.current?.click()}
                            onDragOver={handleVibeDragOver}
                            onDragLeave={handleVibeDragLeave}
                            onDrop={handleVibeDrop}
                            className={`relative group overflow-hidden rounded-3xl cursor-pointer py-8 px-6 border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${
                              isDraggingVibe
                                ? 'bg-sky-500/20 border-sky-500 scale-[0.98]'
                                : theme === 'coldest' 
                                  ? 'bg-white/40 border-sky-100 hover:border-sky-400 text-slate-900' 
                                  : theme === 'chef-mode' 
                                    ? 'bg-white/60 border-orange-100 hover:border-orange-400 text-slate-900' 
                                    : 'bg-black/60 border-white/10 hover:border-white/30 text-white'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2 text-center">
                              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 bg-sky-500/20">
                                <span className="text-2xl">üéµ</span>
                              </div>
                              <span className="text-base font-black tracking-tight">
                                {vibeFile ? 'Vibe File Selected ‚úì' : 'Drop Audio to Analyze Vibe'}
                              </span>
                              {vibeFile ? (
                                <span className="text-xs font-bold text-emerald-400 break-all px-4 max-w-full bg-emerald-500/10 py-1.5 rounded-full">
                                  {vibeFile.name} ({(vibeFile.size / 1024 / 1024).toFixed(1)}MB)
                                </span>
                              ) : (
                                <span className="text-xs font-medium opacity-60 max-w-[240px]">
                                  Analyze your beat's sonic signature to find the perfect plugins. MP3 or WAV (Max 50MB)
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {vibeFile && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVibeFile(null);
                                  }}
                                  className="text-[10px] font-black uppercase tracking-widest bg-red-500/15 text-red-400 hover:bg-red-500/25 px-3 py-1.5 rounded-full transition-all"
                                >
                                  Remove File
                                </button>
                              )}
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-60 px-3 py-1.5 rounded-full bg-black/10">
                                Vibe Analysis
                              </span>
                            </div>

                            <input 
                              type="file" 
                              ref={vibeFileInputRef} 
                              className="hidden" 
                              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 50 * 1024 * 1024) {
                                    setError("Vibe audio file is too large. Max 50MB.");
                                    return;
                                  }
                                  setVibeFile(file);
                                }
                                if (vibeFileInputRef.current) vibeFileInputRef.current.value = '';
                              }} 
                            />
                          </div>

                          {/* Slot 2: Recreate For File */}
                          <div 
                            id="dropzone-recreate"
                            onClick={() => recreateFileInputRef.current?.click()}
                            onDragOver={handleRecreateDragOver}
                            onDragLeave={handleRecreateDragLeave}
                            onDrop={handleRecreateDrop}
                            className={`relative group overflow-hidden rounded-3xl cursor-pointer py-8 px-6 border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${
                              isDraggingRecreate
                                ? 'bg-purple-500/20 border-purple-500 scale-[0.98]'
                                : theme === 'coldest' 
                                  ? 'bg-white/40 border-purple-100 hover:border-purple-400 text-slate-900' 
                                  : theme === 'chef-mode' 
                                    ? 'bg-white/60 border-orange-100 hover:border-orange-400 text-slate-900' 
                                    : 'bg-black/60 border-white/10 hover:border-white/30 text-white'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2 text-center">
                              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 bg-purple-500/20">
                                <span className="text-2xl">‚ö°</span>
                              </div>
                              <span className="text-base font-black tracking-tight">
                                {recreateForFile ? 'Recreate For Track Selected ‚úì' : 'Recreate for'}
                              </span>
                              {recreateForFile ? (
                                <span className="text-xs font-bold text-emerald-400 break-all px-4 max-w-full bg-emerald-500/10 py-1.5 rounded-full">
                                  {recreateForFile.name} ({(recreateForFile.size / 1024 / 1024).toFixed(1)}MB)
                                </span>
                              ) : (
                                <span className="text-xs font-medium opacity-60 max-w-[240px]">
                                  Drop your own track here to recreate the first song's vibe matching your target key & BPM
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {recreateForFile && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRecreateForFile(null);
                                  }}
                                  className="text-[10px] font-black uppercase tracking-widest bg-red-500/15 text-red-400 hover:bg-red-500/25 px-3 py-1.5 rounded-full transition-all"
                                >
                                  Remove File
                                </button>
                              )}
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-60 px-3 py-1.5 rounded-full bg-black/10">
                                Target / Recreate-For
                              </span>
                            </div>

                            <input 
                              type="file" 
                              ref={recreateFileInputRef} 
                              className="hidden" 
                              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 50 * 1024 * 1024) {
                                    setError("Recreate audio file is too large. Max 50MB.");
                                    return;
                                  }
                                  setRecreateForFile(file);
                                }
                                if (recreateFileInputRef.current) recreateFileInputRef.current.value = '';
                              }} 
                            />
                          </div>
                        </div>

                        {/* Analysis Trigger Button */}
                        <div className="flex justify-center mt-2 w-full">
                          <button
                            onClick={() => handleAudioSearch(null)}
                            disabled={loading || !vibeFile}
                            className={`w-full max-w-md py-5 px-6 rounded-3xl font-black text-xs select-none shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex flex-col items-center justify-center gap-2 ${
                              theme === 'coldest' || theme === 'chef-mode' ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-purple-600 text-white hover:bg-purple-500'
                            }`}
                          >
                            <span className="text-xl">üéõÔ∏è</span>
                            {audioAnalysisLoading ? t('analyzing') : 'Extract & Recreate Recipe'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col w-full gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                          <div 
                            id="dropzone-audio"
                            onClick={() => audioInputRef.current?.click()}
                            onDragOver={handleAudioDragOver}
                            onDragLeave={handleAudioDragLeave}
                            onDrop={handleAudioDrop}
                            className={`relative flex-1 group overflow-hidden rounded-3xl cursor-pointer py-8 px-8 border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${
                              isDraggingAudio
                                ? 'bg-purple-500/20 border-purple-500 scale-[0.98]'
                                : theme === 'coldest' 
                                  ? 'bg-purple-50/80 border-purple-200 hover:border-purple-400 text-purple-900' 
                                  : 'bg-purple-900/20 border-purple-500/30 hover:border-purple-500/60 text-purple-100'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2 text-center">
                              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-purple-500/20">
                                <span className="text-3xl">üéß</span>
                              </div>
                              <span className="text-lg font-black tracking-tight">
                                {t('drop_audio_for_critique')}
                              </span>
                              <span className="text-xs font-medium opacity-60 max-w-[200px]">
                                {t('deep_mix_analysis_instruction')}
                              </span>
                            </div>
                            
                            <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 text-[10px] font-black uppercase tracking-widest opacity-60">
                              <span>{t('deep_analysis_mode')}</span>
                            </div>

                            <input 
                              type="file" 
                              ref={audioInputRef} 
                              className="hidden" 
                              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleAudioSearch(file);
                                if (audioInputRef.current) audioInputRef.current.value = '';
                              }} 
                            />
                          </div>
                          
                          <div className="flex flex-col gap-3 sm:w-48">
                            <button 
                              onClick={() => audioInputRef.current?.click()}
                              disabled={loading} 
                              className="flex-1 py-5 px-6 rounded-3xl font-black text-xs select-none shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex flex-col items-center justify-center gap-2 bg-purple-600 text-white"
                            >
                              <span className="text-xl">üì§</span>
                              {audioAnalysisLoading ? t('analyzing') : t('select_file')}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                )}
              </div>
              </div>
              )}

              {!isVerified && (hasStems || audioMode === 'album') && (
                <div className="flex justify-center mt-4">
                  <div className="flex items-center justify-center overflow-visible" style={{ width: '260px', height: '52px' }}>
                    <div className="cf-turnstile origin-center scale-[0.8]"></div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-white/60'}`}>
                      {audioAnalysisLoading ? t('analyzing_audio_vibe') : t('architecting_beat_recipes')}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-white/60'}`}>
                      {generationEta > 0 ? `~${generationEta}s remaining` : "Almost ready..."}
                    </span>
                  </div>
                  <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ease-linear ${theme === 'coldest' ? 'bg-sky-500' : theme === 'chef-mode' ? 'bg-orange-500' : theme === 'crazy-bird' ? 'bg-red-500' : 'bg-white'}`}
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 sm:mt-2">
                {(analogInstruments.length > 0 || analogHardware.length > 0 || drumKits.length > 0) && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={excludeAnalog} 
                      onChange={(e) => setExcludeAnalog(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                    />
                    <span className={`text-sm font-bold ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-700' : 'text-slate-300'}`}>
                      Exclude my real instruments & hardware from recipes
                    </span>
                  </label>
                )}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingDrumKit(undefined);
                      setShowDrumKitModal(true);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${
                      theme === 'coldest' || theme === 'chef-mode'
                        ? 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 border-slate-500/20' 
                        : 'bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 border-slate-500/30'
                    }`}
                  >
                    <Drum className="w-4 h-4" />
                    {t('add_drum_kit')}
                  </button>
                  <button 
                    onClick={() => setShowAnalogModal(true)}
                    className={`text-xs font-bold underline opacity-70 hover:opacity-100 transition-opacity ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-700' : 'text-slate-300'}`}
                  >
                    ({t('edit_equipment')})
                  </button>
                </div>
              </div>
            </section>

            <AnimatePresence mode="popLayout">
              {recipes.length > 0 && (
                <motion.section 
                  key="recipes-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 gap-6"
                >
                  {recipes.map((recipe, idx) => {
                    if (minimizedItems.some(i => i.type === 'recipe' && i.id === recipe.title)) return null;
                    return (
                    <motion.div 
                      key={`${recipe.title}-${idx}`} 
                      id={`recipe-card-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <ErrorBoundary fallback={<div className="p-8 text-center text-red-500 font-bold border rounded-3xl bg-black/40 border-red-500/20 shadow-2xl">Could not render this recipe. The saved data might be corrupted.</div>}>
                        <RecipeCard 
                          recipe={recipe} 
                          isSaved={vault.some(r => r.title === recipe.title)} 
                          onSave={saveToVault} 
                          theme={theme} 
                          dawType={dawType} 
                          plugins={plugins} 
                          analogHardware={analogHardware} 
                          drumKits={drumKits} 
                          onCloudBackupRecipe={handleCloudBackupRecipe} 
                          onLogReceipt={logReceipt}
                          onCorrectPlugin={handleCorrectPlugin}
                          onContactSupport={handleContactSupport}
                          onMinimize={() => handleMinimizeRecipe(recipe)}
                          isMultiBandMode={isMultiBandMode}
                          reaperSyncPin={reaperSyncPin}
                          reaperSyncEmail={user?.email || localStorage.getItem('beatgangsta_sync_email')}
                          isJsfxMode={isJsfxMode}
                        />
                      </ErrorBoundary>
                    </motion.div>
                  )})}
                </motion.section>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {critiques.length > 0 && (
                <motion.section 
                  key="critiques-section"
                  id="critiques-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 gap-6 mt-6"
                >
                  {critiques.map((critique, idx) => {
                    const cid = critique.id || String(idx);
                    if (minimizedItems.some(i => i.type === 'critique' && i.id === cid)) return null;
                    return (
                    <motion.div 
                      key={cid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <ErrorBoundary fallback={<div className="p-8 text-center text-red-500 font-bold border rounded-3xl bg-black/40 border-red-500/20 shadow-2xl">Could not render this critique. The saved data might be corrupted or in an older format.</div>}>
                        <CritiqueCard 
                          critique={critique} 
                          theme={theme} 
                          plugins={plugins} 
                          analogInstruments={analogInstruments}
                          analogHardware={analogHardware}
                          stems={stems}
                          audioBase64={critique.audioBase64} 
                          audioUrl={critique.audioUrl}
                          mimeType={critique.mimeType} 
                          isSaved={savedCritiques.some(c => c.id === critique.id)}
                          onSave={saveCritiqueToVault}
                          onUpdateCritique={handleUpdateCritique}
                          onReCritique={handleReCritique}
                          currentAudioInfo={currentAudioInfo}
                          onLogReceipt={logReceipt}
                          onCorrectPlugin={handleCorrectPlugin}
                          onContactSupport={handleContactSupport}
                          onMinimize={() => handleMinimizeCritique(critique, idx)}
                          isMultiBandMode={isMultiBandMode}
                          dawType={dawType}
                          reaperSyncPin={reaperSyncPin}
                          reaperSyncEmail={user?.email || localStorage.getItem('beatgangsta_sync_email')}
                          isJsfxMode={isJsfxMode}
                          lunaSumming={lunaSumming}
                          lunaTape={lunaTape}
                          userEmail={user?.email}
                        />
                      </ErrorBoundary>
                    </motion.div>
                  )})}
                </motion.section>
              )}
            </AnimatePresence>

            {latestErrorLog && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 mb-2 font-bold">{latestErrorLog.split('\n')[0]}</p>
                <p className="text-red-300 text-xs mb-4 font-mono break-all">{latestErrorLog}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(latestErrorLog);
                    alert(t('error_log_copied'));
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Copy Detailed Error Log
                </button>
              </div>
            )}

            <section id="section-gear-rack" className={`p-6 sm:p-10 transition-colors ${mainBlurClass} border rounded-[3rem] sm:rounded-[4rem] shadow-xl mb-16 ${theme === 'coldest' ? 'bg-white/20 border-white/30' : theme === 'chef-mode' ? 'bg-white/40 border-white/30' : 'bg-black/40 border-white/10'}`}>
              <div className="flex flex-col gap-4 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedFolder && (
                      <button 
                        onClick={() => setSelectedFolder(null)}
                        className={`p-2 rounded-full transition-all hover:scale-105 active:scale-95 ${theme === 'coldest' ? 'bg-sky-100 text-sky-800 hover:bg-sky-200' : theme === 'chef-mode' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    <h3 className={`text-2xl font-black select-none ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                      {selectedFolder ? selectedFolder : t('gear_rack')}
                    </h3>
                  </div>
                  <div className="flex gap-4 items-center">
                    <select 
                      id="gear-rack-sort"
                      value={sortBy} 
                      onChange={(e) => { 
                        const newVal = e.target.value as any;
                        startSortTransition(() => {
                          setSortBy(newVal); 
                          setSelectedFolder(null); 
                        });
                      }}
                      className={`py-2 px-4 rounded-full text-xs font-bold focus:outline-none transition-all ${isUpdatingSort ? 'opacity-50 grayscale' : ''} ${theme === 'coldest' ? 'bg-white/40 text-slate-800' : theme === 'chef-mode' ? 'bg-white/60 text-slate-900' : 'bg-black/60 text-white'}`}
                    >
                      <option value="type">{t('group_by_type')}</option>
                      <option value="vendor">{t('group_by_brand')}</option>
                      <option value="name">{t('display_all')}</option>
                    </select>
                    <input 
                      id="gear-rack-search"
                      ref={searchInputRef}
                      type="text" 
                      placeholder={t('search_the_rack')} 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className={`py-4 px-8 text-sm font-bold focus:outline-none transition-all w-64 sm:w-96 rounded-full ${theme === 'coldest' ? 'bg-white/40 border-white text-slate-800' : theme === 'chef-mode' ? 'bg-white/60 border-white text-slate-900' : 'bg-black/60 border-white/10 text-white'}`} 
                    />
                  </div>
                  
                  {/* Add Manual Plugin */}
                  <div className="flex flex-col items-center mt-6 w-full max-w-2xl">
                     <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-3 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                       Add New Plugins Manually
                     </h4>
                     <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
                       <input 
                         type="text" 
                         placeholder="Plugin Name" 
                         value={manualPluginName} 
                         onChange={(e) => setManualPluginName(e.target.value)} 
                         className={`py-3 px-6 text-sm font-bold focus:outline-none transition-all w-full sm:w-64 rounded-full ${theme === 'coldest' ? 'bg-white/40 border-white text-slate-800' : theme === 'chef-mode' ? 'bg-white/60 border-white text-slate-900' : 'bg-black/60 border-white/10 text-white'}`} 
                       />
                       <input 
                         type="text" 
                         placeholder="Brand / Vendor Name" 
                         value={manualPluginBrand} 
                         onChange={(e) => setManualPluginBrand(e.target.value)} 
                         className={`py-3 px-6 text-sm font-bold focus:outline-none transition-all w-full sm:w-64 rounded-full ${theme === 'coldest' ? 'bg-white/40 border-white text-slate-800' : theme === 'chef-mode' ? 'bg-white/60 border-white text-slate-900' : 'bg-black/60 border-white/10 text-white'}`} 
                       />
                       <button
                         onClick={handleManualResearchAndAdd}
                         disabled={isResearching || !manualPluginName.trim() || !manualPluginBrand.trim()}
                         className={`py-3 px-6 rounded-full font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-sky-500 text-white' : 'bg-white/20 text-white'}`}
                       >
                         {isResearching ? (
                           <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Researching...</span>
                         ) : (
                           "Research & Add"
                         )}
                       </button>
                     </div>
                  </div>
                </div>
                

                {/* Starred Items Bar */}
                {true && (
                  <div id="priority-bar" className="flex items-center gap-3 overflow-x-auto pt-4 pb-2 scrollbar-hide -mt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50 shrink-0">{t('starred_count', { count: starredPlugins.length + starredHardware.length })}</span>
                    {[...starredPlugins, ...starredHardware].map((name, index) => {
                      const themeStyles = {
                        coldest: {
                          border: 'border-sky-400/50',
                          shades: [
                            'bg-sky-100/50 text-sky-700', 'bg-sky-200/50 text-sky-800',
                            'bg-sky-300/50 text-sky-900', 'bg-sky-400/50 text-sky-950',
                            'bg-sky-500/50 text-sky-950'
                          ]
                        },
                        'chef-mode': {
                          border: 'border-orange-400/50',
                          shades: [
                            'bg-orange-100/50 text-orange-700', 'bg-orange-200/50 text-orange-800',
                            'bg-orange-300/50 text-orange-900', 'bg-orange-400/50 text-orange-950',
                            'bg-orange-500/50 text-orange-950'
                          ]
                        },
                        'crazy-bird': {
                          border: 'border-red-500/50',
                          shades: [
                            'bg-red-200/20 text-red-100', 'bg-red-300/20 text-red-100',
                            'bg-red-400/20 text-red-50', 'bg-red-500/20 text-red-50',
                            'bg-red-600/20 text-red-50'
                          ]
                        },
                        'hustle-time': {
                          border: 'border-emerald-500/50',
                          shades: [
                            'bg-emerald-200/20 text-emerald-100', 'bg-emerald-300/20 text-emerald-100',
                            'bg-emerald-400/20 text-emerald-50', 'bg-emerald-500/20 text-emerald-50',
                            'bg-emerald-600/20 text-emerald-50'
                          ]
                        }
                      };
                      const styles = (themeStyles[theme as keyof typeof themeStyles] || themeStyles['hustle-time']);
                      const colorClass = styles.shades[index % styles.shades.length];
                      const borderClass = styles.border;

                      return (
                        <div key={name} className="relative group shrink-0">
                          <button
                            onClick={() => {
                              setSearchTerm(name);
                              setTimeout(() => setSearchTerm(''), 3000);
                            }}
                            className={`flex items-center gap-1.5 text-sm font-bold px-5 py-1.5 rounded-full whitespace-nowrap transition-all hover:scale-105 active:scale-95 border ${borderClass} ${colorClass}`}>
                            <Star size={12} className="fill-current" />
                            {name}
                          </button>
                          <button
                            onClick={() => {
                            const isJsfx = JSFX_DATABASE.some(j => j.name === name || j.shortName === name);
                            if (plugins.some(p => p.name === name) || isJsfx) {
                              toggleStar(name);
                            } else {
                              setStarredHardware(prev => prev.filter(n => n !== name));
                            }
                          }}
                            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-lg border-2 border-white/50"
                            title={`Remove ${name}`}>
                            <X size={10} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Drum Kits Section */}
              {drumKits.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/40 px-2">
                    <Drum className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">{t('drum_kits')}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {drumKits.map((kit) => (
                      <HardwareCard 
                        key={kit.name} 
                        item={kit} 
                        theme={theme}
                        isStarred={starredHardware.includes(kit.name)}
                        onToggleStar={() => {
                          setStarredHardware(prev => 
                            prev.includes(kit.name) ? prev.filter(n => n !== kit.name) : [...prev, kit.name]
                          );
                        }}
                        onRemove={() => setDrumKits(prev => prev.filter(k => k.name !== kit.name))}
                        onEdit={(item) => {
                          setEditingDrumKit(item);
                          setShowDrumKitModal(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Analog Equipment Section */}
              {!selectedFolder && !searchTerm && (analogInstruments.length > 0 || analogHardware.length > 0) && (
                <div className="mb-12">
                  <h4 className={`text-sm font-black uppercase tracking-widest mb-6 opacity-70 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>Real Instruments & Hardware</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[...analogInstruments, ...analogHardware].map((item, idx) => (
                      <HardwareCard 
                        key={`hw-${idx}`}
                        item={item}
                        theme={theme}
                        isStarred={starredHardware.includes(item.name)}
                        onToggleStar={(itemName) => toggleStar(itemName)}
                        onRemove={(itemToRemove) => {
                          if (itemToRemove.type === 'instrument') {
                            setAnalogInstruments(prev => prev.filter(i => i.name !== itemToRemove.name));
                            setDeletedInstruments(prev => [...prev, itemToRemove]);
                          } else {
                            setAnalogHardware(prev => prev.filter(h => h.name !== itemToRemove.name));
                            setDeletedHardware(prev => [...prev, itemToRemove]);
                          }
                          setStarredHardware(prev => prev.filter(n => n !== itemToRemove.name));
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-12">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
                  <div className="flex gap-6">
                    <button
                      onClick={() => {
                        setGearRackTab('vst');
                        setSelectedFolder(null);
                      }}
                      className={`text-sm font-black uppercase tracking-widest pb-3 border-b-2 transition-all ${
                        gearRackTab === 'vst' 
                          ? (theme === 'coldest' || theme === 'chef-mode' ? 'border-slate-800 text-slate-800 font-black' : 'border-white text-white font-black')
                          : 'border-transparent text-current opacity-40 hover:opacity-75 font-bold'
                      }`}
                    >
                      Uploaded VSTs
                    </button>
                    <button
                      onClick={() => {
                        setGearRackTab('jsfx');
                        setSelectedFolder(null);
                      }}
                      className={`text-sm font-black uppercase tracking-widest pb-3 border-b-2 transition-all ${
                        gearRackTab === 'jsfx' 
                          ? (theme === 'coldest' || theme === 'chef-mode' ? 'border-slate-800 text-slate-800 font-black' : 'border-white text-white font-black')
                          : 'border-transparent text-current opacity-40 hover:opacity-75 font-bold'
                      }`}
                    >
                      JSFX Gear Rack
                    </button>
                  </div>
                </div>

                {gearRackTab === 'jsfx' ? (
                  <>
                    {groupedJsfx && !selectedFolder ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {Object.entries(groupedJsfx).map(([groupName, groupPlugins]) => (
                          <div 
                            key={groupName}
                            onClick={() => setSelectedFolder(groupName)}
                            className={`cursor-pointer group relative flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-xl ${theme === 'coldest' ? 'bg-white/60 border-sky-100 hover:bg-white/80' : theme === 'chef-mode' ? 'bg-white/60 border-orange-100 hover:bg-white/80' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                            <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center shadow-inner ${theme === 'coldest' ? 'bg-sky-100 text-sky-600' : theme === 'chef-mode' ? 'bg-orange-100 text-orange-600' : 'bg-black/40 text-white'}`}>
                              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                            </div>
                            <h4 className="text-sm font-black text-center truncate w-full px-2">{groupName}</h4>
                            <span className="text-[10px] font-bold opacity-50 mt-1 uppercase tracking-widest">{t('items_count', { count: groupPlugins.length })}</span>
                          </div>
                        ))}
                        {Object.keys(groupedJsfx).length === 0 && (
                          <div className="col-span-full text-center py-12 opacity-50 text-sm font-bold">
                            No JSFX found in your library. Add packages via the REAPER synchronization tool!
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {selectedFolder && (
                          <button 
                            onClick={() => setSelectedFolder(null)}
                            className={`mb-4 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all ${theme === 'coldest' ? 'bg-sky-500 text-white' : theme === 'chef-mode' ? 'bg-orange-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                          >
                            ‚Üê Back to Folders
                          </button>
                        )}
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filteredJsfx.map((jsfx, idx) => (
                            <JSFXCard 
                              key={`${jsfx.name}-${idx}`}
                              id={`jsfx-card-${jsfx.name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase()}`}
                              jsfx={jsfx}
                              isFavorite={starredPlugins.includes(jsfx.name)}
                              onToggleFavorite={(j) => toggleStar(j.name)}
                              theme={theme}
                            />
                          ))}
                          {filteredJsfx.length === 0 && (
                            <div className="col-span-full text-center py-12 opacity-50 text-sm font-bold">
                              No JSFX found matching your filters.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : false ? (
                  <>
                    <div className="space-y-8">
                      {/* Header and Controls */}
                      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-[2rem] border ${theme === 'coldest' ? 'bg-sky-500/5 border-sky-100' : theme === 'chef-mode' ? 'bg-orange-500/5 border-orange-100' : 'bg-white/5 border-white/10'}`}>
                        <div>
                          <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                            <Database className={`w-5 h-5 ${theme === 'coldest' ? 'text-sky-500' : theme === 'chef-mode' ? 'text-orange-500' : 'text-purple-400'}`} /> Xpand!2 Preset Inventory
                          </h3>
                          <p className="text-xs opacity-60 mt-1 max-w-2xl leading-relaxed">
                            Your active inventory of Xpand!2 presets. When recommending sounds using Xpand!2, BeatGangsta will ONLY select from presets marked as **owned** (Green).
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              const filteredIds = filteredXpandPresets.map(p => `${p.category}-${p.preset_name}`);
                              const anyUnowned = filteredXpandPresets.some(p => !p.is_owned);
                              setXpandPresets(prev => prev.map(p => {
                                if (filteredIds.includes(`${p.category}-${p.preset_name}`)) {
                                  return { ...p, is_owned: anyUnowned };
                                }
                                return p;
                              }));
                            }}
                            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all hover:scale-105 active:scale-95 ${theme === 'coldest' ? 'bg-sky-50 border-sky-200 text-sky-800' : theme === 'chef-mode' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                          >
                            Toggle Page All
                          </button>
                          <button
                            onClick={() => setShowBulkImport(!showBulkImport)}
                            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${theme === 'coldest' ? 'bg-sky-500 text-white' : theme === 'chef-mode' ? 'bg-orange-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                          >
                            <Upload size={14} /> Bulk Add / Paste
                          </button>
                        </div>
                      </div>

                      {/* Bulk Import section */}
                      {showBulkImport && (
                        <div className={`p-6 rounded-[2rem] border ${theme === 'coldest' ? 'bg-sky-500/5 border-sky-100' : theme === 'chef-mode' ? 'bg-orange-500/5 border-orange-100' : 'bg-white/5 border-white/10'} space-y-4`}>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                              <Upload className={`w-4 h-4 ${theme === 'coldest' ? 'text-sky-500' : theme === 'chef-mode' ? 'text-orange-500' : 'text-purple-400'}`} /> Bulk Add Presets
                            </h4>
                            <button onClick={() => setShowBulkImport(false)} className="opacity-50 hover:opacity-100">
                              <X size={18} />
                            </button>
                          </div>
                          <p className="text-xs opacity-60 leading-relaxed">
                            Paste a list of preset names (one per line). They will be added to the selected category and marked as **owned**.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-70">Category</label>
                              <select
                                value={newPresetCategory}
                                onChange={(e) => setNewPresetCategory(e.target.value)}
                                className={`w-full px-4 py-2 rounded-xl text-xs font-bold outline-none bg-black/40 border border-white/10 focus:border-purple-500 text-white h-10`}
                              >
                                {XPAND_CATEGORIES.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-70">Preset Names (one per line)</label>
                              <textarea
                                value={bulkInputText}
                                onChange={(e) => setBulkInputText(e.target.value)}
                                placeholder="e.g.&#10;My Sweet Lead&#10;Dynamic Pad 4&#10;Heavy 808 Synth"
                                rows={5}
                                className="w-full p-4 rounded-xl text-xs font-mono bg-black/40 border border-white/10 focus:border-purple-500 text-white focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => {
                                if (!bulkInputText.trim()) return;
                                const lines = bulkInputText.split('\n').map(l => l.trim()).filter(Boolean);
                                const newItems = lines.map(name => ({
                                  category: newPresetCategory,
                                  preset_name: name,
                                  is_owned: true
                                }));
                                setXpandPresets(prev => {
                                  const map = new Map(prev.map(p => [`${p.category}-${p.preset_name}`, p]));
                                  newItems.forEach(item => {
                                    map.set(`${item.category}-${item.preset_name}`, item);
                                  });
                                  return Array.from(map.values());
                                });
                                setBulkInputText('');
                                setShowBulkImport(false);
                              }}
                              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest ${theme === 'coldest' ? 'bg-sky-500 text-white' : theme === 'chef-mode' ? 'bg-orange-500 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'} transition-all hover:scale-105 active:scale-95`}
                            >
                              Add {bulkInputText.split('\n').map(l => l.trim()).filter(Boolean).length} Presets
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Quick Add Form */}
                      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-[2rem] border ${theme === 'coldest' ? 'bg-sky-500/5 border-sky-100' : theme === 'chef-mode' ? 'bg-orange-500/5 border-orange-100' : 'bg-white/5 border-white/10'} items-end`}>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-70">Category</label>
                          <select
                            value={newPresetCategory}
                            onChange={(e) => setNewPresetCategory(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold outline-none bg-black/40 border border-white/10 text-white h-11`}
                          >
                            {XPAND_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5 opacity-70">New Preset Name</label>
                          <input
                            type="text"
                            value={newPresetName}
                            onChange={(e) => setNewPresetName(e.target.value)}
                            placeholder="Preset name..."
                            className="w-full px-4 py-2.5 rounded-xl text-xs font-bold bg-black/40 border border-white/10 text-white focus:border-purple-500 focus:outline-none h-11"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (!newPresetName.trim()) return;
                            setXpandPresets(prev => {
                              const exists = prev.some(p => p.category === newPresetCategory && p.preset_name.toLowerCase() === newPresetName.trim().toLowerCase());
                              if (exists) return prev;
                              return [...prev, { category: newPresetCategory, preset_name: newPresetName.trim(), is_owned: true }];
                            });
                            setNewPresetName('');
                          }}
                          className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest ${theme === 'coldest' ? 'bg-sky-500 text-white' : theme === 'chef-mode' ? 'bg-orange-500 text-white' : 'bg-white text-black hover:bg-opacity-95'} transition-all hover:scale-105 active:scale-95 h-11`}
                        >
                          + Add Preset
                        </button>
                      </div>

                      {/* Filter and Search Bar */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={xpandSearch}
                            onChange={(e) => setXpandSearch(e.target.value)}
                            placeholder="Search presets..."
                            className="w-full pl-10 pr-4 py-3 rounded-full text-xs font-bold bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                          />
                          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          {xpandSearch && (
                            <button onClick={() => setXpandSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        <div className="w-full md:w-64">
                          <select
                            value={xpandCategoryFilter}
                            onChange={(e) => setXpandCategoryFilter(e.target.value)}
                            className="w-full px-4 py-3 rounded-full text-xs font-bold bg-black/40 border border-white/10 text-white focus:outline-none"
                          >
                            <option value="All">All Categories</option>
                            <option value="Owned">Show Owned Only</option>
                            <option value="Unowned">Show Unowned Only</option>
                            {XPAND_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Presets Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredXpandPresets.map((preset, idx) => (
                          <div
                            key={`${preset.category}-${preset.preset_name}-${idx}`}
                            onClick={() => {
                              setXpandPresets(prev => prev.map(p => {
                                if (p.category === preset.category && p.preset_name === preset.preset_name) {
                                  return { ...p, is_owned: !p.is_owned };
                                }
                                return p;
                              }));
                            }}
                            className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] ${
                              preset.is_owned 
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                : 'bg-white/5 border-white/10 opacity-60 text-white/80'
                            }`}
                          >
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-wider block opacity-50 truncate mb-1">
                                {preset.category}
                              </span>
                              <h4 className="text-xs font-black leading-tight break-words">{preset.preset_name}</h4>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${preset.is_owned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'}`}>
                                {preset.is_owned ? 'Owned' : 'No'}
                              </span>
                              <div className={`w-3 h-3 rounded-full ${preset.is_owned ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-white/20'}`} />
                            </div>
                          </div>
                        ))}
                        {filteredXpandPresets.length === 0 && (
                          <div className="col-span-full text-center py-12 opacity-50 text-sm font-bold">
                            No presets found matching search or category filters.
                          </div>
                        )}
                      </div>
                    </div>
             xúÏ}Àr‹8∂‡æøV◊-•∫ïT>eI%…mÀvïªÀ.Ö•™~®4**âÃdãI≤I¶Vkñ≥õàâYŒÊ∆lg5ﬂtø‡~¬úÄ$@|»íÀ„áúI‚çÉÛ>Ñ¿gwcˇ7§Y#;§Sz
eÀEÒs;ãÇeHùCo9s˝ò|˝5ySèNÍº<áF‰ô∂=÷¶„^íâg«Ò;{A˜VfëÎ¸”ù^‹êx±ìˇíÖ#˝o&˝ìôv7WÙ√dCÌt÷»ﬁ>π5ñ d¯qB‹Ñ.‚b˚7'ßdè¸p˛wòèE˝$ri‹Qgºf-Ï∞”9aOqÎÑ}ØOYóù[í‹Ñtá¨NŸö¨ÆäÓ©V»+Ï(’…›⁄⁄7∆ÒÚ—Üû=°s÷n£©Ô∏˛ÏPzjM]/°Q'ƒ±ÑÖÏÌÌe£Y≥‚ J:{ùú≥Ò⁄ñÎ;Ùöt…9ˇV1àPÈ(à^Ÿì9Ô©j°Ÿ[qËπ⁄	y'Î§∑NL+Zæ∫L°%æÆ7ñfªCíh…
fèﬁ8X`ÎÆbUÔå/"ö,#_ÃÜ~Ö9◊µ∞ÊN	+m)√_´¨ìıh:RÈá≠z≥w˚ã¥›ØnYè ⁄‹˝r'¬€_¶Ï<˛¡É≈ß÷ù √Q˛˚2N‹ÈM˙Œ`ÖΩs∫'Éà.N…y·ôÁˇu;ûS6ƒˆc7qøk{˘Í6ô”Ö ¡	é"NVM¨äZÒ≈MwÿÎëÛ˚:Ó≠Ní´ÃÈ¥ª*W
†èMÎâ_ºjZ‰jìŸ∞¸˚xıéÃª”%j·˙›y˜§œ¶ÒÀùçd+*´ñ–Î§{ìi‡'›sò	B{‚&8~≤8t≈Jàï3.+Ñ≥ﬁÍUOõ”e˘36≥Uÿ‘˝˜t\¬ÚÛ=«„s∑ª6òŸ˘2Iﬂı˘'‡_Ï›v(áwB≠8	¬√f?≥qÀ;kﬂêπÌ;˝—wÇN˛‡˝›]Éæ‰’ØaA√ )¸±MT7:π À0§—ƒé)B·‰0c˜ ≈Â&sXúh'ûÿÌˆ{cbO˜íä€„ÊPõÇièHP	≤Ä+≠¶¿…ü≥I‡n÷.P˝æÇ;Pø˝|ˇÎ‹› S]®•¬≠xWK¢3¬	/Ô™ﬁ§j)m5©™‹È2î[≥f#gcØ€‘¸t±√”‰Ha≠:YKkuM…ág≤åÄﬁw√¿e∏à5SÙlÑÚËøptÍNZ<∑ù‡™/“í¸˜uı°„(|≥G$≤—áÛƒ€»
l’êèrC‚l€ ÎåâBZ˙•
˝^ÌŸ≠;f∑ø#«AHûOp=cÚªç∫Ω.≤’ˆyxKƒ(A\t‰ŒÊ	¸œ6ôÊAF™z∫|ÈS\iG≈cÚ^T∞€Ÿhúö¿9‡p'ùÉ÷¥d%Ïˆ≠±JF`˚"¯»v\¬œ˘Ó‚ÎMd5 ;;0:¿”À®ª(≤:+Üí∏âáßíO yÒ7V/Åô"®/†eáÅﬂ10»FvˇBb˜†?∫#y∞Tæuh ‹Å?u£€^rÑÄåÍa¸v™@ [≠ú&ÄZ« W 4Å≥°º";%UX†Åiï8–c\ãÌª0W⁄u}2µˆˇá X‡ˇŒ2b´ ˝ˆVJßAs∞©ÂyJ|hÉ„ÀZKı%EazÅ”ÆŒì Óó®›≥F‹ßn»l
ÎŒ0W√	¥¬B¸so\‰iäÜ¯GFF◊ÄòÅØ’°§L|)n¿Iø^üJõP BC}¢∏	f¬O”ı%‰¿ˆ'‘k∫±HV˛£∑ØqM¢›Ë’S≠„*ﬂ¯B∂ó>Qî1=≤-˛ùÏuÕöä‡Ó1é/ﬂ0µN¶“v¥¨œb∫ò¶ù˚ı÷¢(ú—i'åË%SN¡ˇ˜\†' µ3‰%0÷I∂ŸxN,À¬ÔÎø®[z⁄∂è£ƒé¢rm@3›Mîv‚¶“!1î–Ú˘mw.s‰MôàµOû∞6&ﬁòpˆº›"WÈ◊ üñ`T÷yÊ[ÿj	≤˝nUÎñ∏Œy	d›ÚÉ´ŒöïGI#¡Ì˜‰≠ùÃ-‰ﬁÇEgmΩ^Ã‡é|beµgØ4'3Ñ¥Éÿà¶ÁP‡±ª hhÒZ“ÿ∏âá'°Ç´oAASFˇPæHèB@®jZlTlÌÆé˚/∞y∑ø\u˚õdéò∆4›æ¡µWœá•ÅÎ˚U˙U°¨Îß@Ä?6kT≠π∫.´&~ãö´ô0R‘ywçÙ»ÒÂLÜﬂ´Ó,¡÷
ÏÌ≠¯ÅOW»•KØ^◊{+=“#É¸[!qPa≤™‚'ñç¯·›í®˛ΩÎ”âÓ≠∞µ^ëû˛=p˝¬„?ªN2ﬂª‹goÂÌê<ΩÏ˜Ï¿òz=¯ﬁÂ?ªÉü∂≥_]¯9Ônz¯ˇwcÈ1|Xi&v¬2=ÄF
ÕG%i&^»*cYQüDKxù\q$ÿÑI®Ÿ›òèjªåC€/uZB:≤¡ ÈˆÕ™k@“Yeá·lî¨¢›å}SÕáñG˝Ïı›åQ=“⁄ıªó˘Ïn≠cPO˚3°Àí!LjBª7Üﬂ€Ç9∫R7–@Œ®U 2*WE∫då«‹ˇ÷‘çÍi©P[©œ™…ˇ¯oˇÉº`ß6 |bÛÓ÷M„Æ’:*(ÆCrÌ)é
èÊô¿ôÙL§»Ÿˇ‹·ÄÛã´)	dµO¡xà.? ´‡æ~M< Kíäv'Ω”Ú&‡±ﬁ§t/œÅ˚˙4ˆ¯‚?¯˛ˇz¸ê¥p$h©∑˚îŒ_‹	j?ÕDÀF.m‰’f≤eµ°FÚî5¥™@u≥àuüàjˇ¸'y"àµµ"˜W› É∏wqä`GN˝ŸrÜ≈±Bw5 ãK#∑" NPg„‰ø¸|ıs‹=›ò≠ìU ﬂŸãü„ﬂ≥g›U‘l}\—Ë é ∞ı âë¨KÆ∑ΩS«Ä?Å!%©mèW€’Tp„◊ˆe¡.Ô›∆ä
6Wg ;Y?•¿ˇ1t@(<CIz÷§ç„`6Ûh>∂N»∞^¬£Æ∏6«‘Y#Mt Ú)HÌEÜr
Ï{+ƒÿ<œ‚a¿B|t(O¡S°éÁœ˘èFöæ:Ä“ÎìºW8~yØO‰^õv[´Òõ©KÕä}Eèé|iÕ∆Ÿp?Z˝›NÌ}uw∆tÌ∂wív˚$<m§—n∂5˜”`◊Ú5Í™Z©¿¸Œ§(©§äf-Jπ±≤«©ê¶π›çò2Ô#˘q°™lêˆ•ÕÌn,l7´∞;‰Ze=˝Íyeñ6ewG=¬u6]¶¸Ã˚–¯!(J4áv“≥∂P∏@&zeˇV(Lüá\ÉGÆ…ÁøB√ÑlêAo∞©∞∏˘∫&å∞7UËﬂµ…<¢”ΩïyíÑÒŒ∆∆’’ïï∏IpaMÇ≈∆8·√xvÌıø>Kˆ˛vÿ›%£õ??}jœÊ+∞Õå&{+g0aˇb]˜POÄåù˚ÙAaÜ—ä<ŒF.]™g‡äMZ9v/éÉãÇÉÈ≠uziÆ∑V¥“™~{2”®§·ZiT,˜∑≠Ò6Ÿ¥6∑Ìëµ5$Ïv–Ô≠ßOª#k0˛i0á£Òehm>µ÷÷6axπ±5 }ÎÈà^¿◊aÿƒ7€C˛áø±∂∂¨˛ßmkdoZ[#¬˛‡´^^ˆ∆œ7≠·ê∞?Ï)îX}(<ƒ¬CQòÙÿ6°ã—≤˚‘Ü67	˚√ﬂé`0≤Ò‡áèÛˆáèªoıF]´ˇae£tUı˜ÓÜ]ZûÎ_P ∏\CØ_éægz„!È{1Pò®ÿ∂…¥ß@œq¶‚π—ç˛¡èWt4?¯”|„Wòˆk1†‚¥”Á3m†üâ=ãÏõwï∏≥xægÆo˛∫∏∏±?¸4zÁˇ-¸ñ‚M:»‚Zd/>~1ÆŸ\.0˚Ø0’øêŒÒïõ¿£µ‚d≈ÛñS-zT6•DõwFtV)ïP€hlÛ‡Í `÷•áº∫È†ztÌÓcç¥&¨›≥ê5ºä&´≤Œ €Ìç0r/Ì…ÕGÔÎZ4&˜≠≤®≤à¶S÷‘Y0=ãitÈN®¶€ö}{íº¢≈√nkˆlk˜@·˚v78cóÅ%wË≈}Døﬁ†êº∞ôI>˜È›}Œ]`ë?áSö∑}g‡ï÷.òÎvN¿*≈Z∏>ÃÃˆˆno…Õ·ﬁz OÓ e-Ù¬WñãˆãEÈµõ4kT>äÓ5u»y +∑ÄÛÁ—iÇ™nÊxøI>tOÜ€¯9-[,úˆ=
ÆÙzÛsö\QÍãc-´œá◊^Óâº›+Ë—3úÍ†uÑ◊zX,ÏÎÓUwåﬂÆªˆ2	dó”°eƒå.ÛxÖzW›˛ ˝=ä´á¢œ‹h‚ÉÕT’ÿÿ˛Ûﬂˇ˚ˇ©ópSJwF”ÆŒçÄ+Z´eÜlo¬a˝åQvËt>ÈÁ:ñ‘Ω¡‚Q5]åÊA‰{∫p¥∆GÕÄVN` G d√¬8¢¡˝çÄ%•5»ﬁ“≠%[ÉVH-?j¶√‘∑éﬂ¸Rw&3Fa}tj7/òÿﬁQÎ1£,‡Ëø≥z>;Só~uù¨Nm/Ü˝◊iîï∏±√ käk4ÖU ë&E6(c£¬&@F≈Éò∆9ï‚öHcàˆô	)ÿB
¶í¢k]vÄ:AhZ’(0Ù¶ÜO¥âx~≠=‹“ÓaÈ(ÊœFΩ«‹»î∫x≥ÙõÇ◊õÌ≥=A>˛öo∫’%L∞ªësí∆*WUïÖõaÏA6ãº€k√ dZâë)‚&∆2‰°G'É~Ô¥ûÚ°¢I°˚≈$M∏Qf4Ï¯åÏï¬`±˝»⁄Æ‚á6KTÈW±Z9≥’¥’wî#qAÒB˙‘òõªé<ì j‹$6®6‰T8éz∏™€πË…o˚˝~—ÅAÉ-K÷◊:NŸ<—‹π⁄Ó∏>´®„\Í‚›˘†Ã`xÌÿErò¥›hî∏€çt∏‹©\I¨Jn1‘	¢‰Ãıˇ±t1OÇ∆I¡†.ØT®óæ8◊ÈÓÀéΩ™ãAì¬
\ÔïÆ›Çø‘´“≈2–R›"ÀLÌi®Ì—Ú|ÅÁº"4ã2s¨¿K:µó^¢∑€ íàí∫¬≤MG ¿ñÍ¨ÍÕk∆≠kKÒL¶Æß£z:fÚZÌ[c-gæÎŸÁ‘ª◊9DZvÚ∫}~V‚Œ–¯»ŒÎC€ªÎáÀDo
å(Æ4u¥/—‘«á∫¢Ø-πÍÏ≠¸1ò˚‰e@ıë‘ûzÈ≥#Ñ¸ç»8 ‹∏I∞LêI‰R•ÀCÁ„<ô ˚= ˆhLñÒé‰Z6Ó’fPÍ‰<è¡ÒF{ÓÙ—”ü	 —ÖÌzg∂„ €?*0±ûö@”ﬂö˛@ØÌEËQT Å™9®ÏçQ©5ƒM√zà∏¥Ω%lÌ$«ÔGºMΩY˚W1#E@Ju;‘‚∆ã5o0—?dŸ∞|vÑa’ü7§‹Çêet‡{≤r»˘4ÚŒ|¬í2o»vûWk‘Ê1ùÃ}drƒπøTØ.ßLa€vøEõ¥˙Ü≥º’(Ãõ∂mæX∆∞±qL~`CZÇ4%>oŒÇ¸MMÎËêÅß‡_Óà/`ûˆ¨éˇ¿ÆÏà⁄˜†QpÔ›ıg¥åﬁÚÒ‹=à∫Õ–ÉL´p!Ä=õÿ˛Ÿ=õS/,´6¯Á∞
êl˜√géQ⁄–.≥‹∆9.ËÿE‚k+kœ˛µîgz4Ã»*ı	k5ñÒ4ﬁá:Ÿ}ãMEÔ∆U•00åñ≥ñÀ¯ÃNò!B:ôØƒ æÍÈásj'3x'6≤Å¶∞G≠M÷¢*Qß9,;øU®≈ã&6OnQ˘¢)¸îö¬‘Ú9HÓ]ŒOÎ≠ÒøÄÊpÎW”⁄™ãÊ¿Ê⁄√Ü.†%ı·˜6 dÓµÔÏê∑v4ôó?≥éLm(ŸNÍ1Ø ˛˘¸4á–tw¸öCg«ÚÜôh	∞Ë\O¢¿ÛŒÌ(S«mÈ W„øúΩõkÚò©9f;#%äTÇÁ≥pà6ÑhË>Ö”ß%õæ!éX”ijÕ◊
ZœñÈ≥[¡e&6<Ã*
_ÜK…zoªúxÈÈd.Søªû[ÚV`
∆–qç?çÖGRó˚Fbd1ªÑÖf‰˙›^E∆o1-àØd/9˜Ç4É∆ul⁄˜W?U%∆hvAò“π:ë7\—≥÷&›ÓÕû°Ìt+¢W+-<˜ÀŒe;g;Äí7Üwè∞wö÷øÏ^˙ˆv/dœ(ä<¬ÊïúΩ€›Xj4Hü[ÿæ=+ûëGgäΩ>/P4àö}8«·Fze»!˝8{ëÃ›»9Ì(π˘¥€°È¯#v§¯Bß´êìÇ,®cò?ÖXSVπ=¢√∫ ∂Ú:4+‘fArÊ&mTiZw’“,âˇòÈÕ-/ÈËf‡sgµØø&.{Lù#˚íævΩB~Ï:˝“∏Å∂¢\*%¬ÜSS•\îKö¥Ä™kW—Ò˝Î`
©¡TMuà™"õ€£≥∂ËlÍzzYß#ïbNSò≈&œò·6ˆlFÌàkW9πø-BàµåitX-M¯" ˝≥±ı´πùú%¡ôOE	ï©oV©2Á%RÈƒeÿàÁ`x€DÙà&	,s\È√c÷˘ªæ„Œñ˜3√?‚ŸXá0ö »r∞NÌQ‚yÕ◊©4äi#Ö.Ê¡“F>Pö»]éÁ÷xk∞Ëè≠·xìûoYΩ^üøòrÑØ…ˆæ∑ΩË˜IøŸœª∏èm,:$¸/¸ÓwYSOª¢Õßd]ﬂ§á“&éD®ç8∞ú-nŒb0ÕΩ…Ôü¡ò X°d˛:r©Ô‹B≈E∂Á® ö>¸£ma¥ ‘õè/ª{HÜ<5)ÉUê◊∂∆O˘˚Ôû.ÄÙ†–§◊µ6·•’`â¡÷∞+feR[˝q·mﬁDﬁB^Ñ¸ÿ¬å™¸/6±e∂HÔmLûäv˚˝.Fïßù¿˜ãM2…U·-F§ãL´}¯˛˙ŒÚµj^∑=>ÀgW ÃgSÕU«ßÌÅ1c`¸EÅ^ôSK˛T√›œı3∑√LÌéW∫70¿+∑Â6xâãŸ,[ﬂ—:º¸Hkv7Ï1ª‘·#/î OLù≈Y Û
Ï∆"‡˜ø¥‚OO`=NKˆÅ kYö≥*K⁄ Ï47?Æ+fIx2®ä@ÕÕúÎíÒSg∆Lçû≠zíAW∞∑2ÔÃ<ô;!⁄ó8ÉÌÕ“Ä8âØŒÆ+öGÀ0ùÒı R†H˚%0|FV2ﬁ]Ú9…¸ÿ˜4>¢ÜîyÜN~;√aÎùî€®øËÙ	eaqá5¬~— ÊéókÛÏÛjUı éì^◊‡˘È1àﬂ¶¡F".yD¬b˛√çìî]oÊÿ—EkbâôOÔúÙJwN0KÉ\ZŸG£©Êãz⁄Yd;@√íntœ#2ÖıÏﬁPAù)Y-—4}Óº#öŒ;:^IÁË¬böˇÛﬂˇÁˇ’˚±4É5òÁ·ÿ≥ÔCU\e©F´Ïı/ì˜tB!8O ¶zçòzéM•¬™§2ÎVèwΩ†éª\‘j‘éÅçæ 7¡j!=ΩÅ¬‰µìosóüu|ø
®ÍúÖ √}ù∆<üÒ >nÈéßõƒôúã	•¶>ö3W\´∞Ã°JËt⁄úΩ„ﬂ0™≈ÚÜ€BUQ3S¥rÍ∑#óq)WK°É4ÛmØÁ†ˇLk⁄ ⁄4{›ü∆‚Á^t?˜¢µ¯i@o3E÷√—Ÿm≈O#˙äç’±ö€=ù≈'\ÇÖ“FÿÔ-E-SŒ&ºhs}¥>Û• íÖ£cî D^ˆUëY¿–¶º±-»‡xª¶ÏC]NÁR†ŒÿU¥óΩ7	lÂÉ/ÛvZ‚´´î`πB[∫7â$%Uéª≥CµoÅ…û˜m∞√Ìë‹›PØk§°\·,Ã˝#»NïÀ[mçv¶_ú§P5õ◊)øT!û◊Z£πZœ∫(÷:ò2jîüYb∫,*Óˆ‘ıÅ:=#¯6{	¬¨eY´w\Âœ"ÙˆaW´.31oZçÍ‹dºõ‰8 Ü)˝bW¿¯`∞k'˝SÃH+ó·£≥ÍSÍú-P«òoss{_ªHé!Ó∞Œ˘≠{‚∏±}ÓQgÔ÷ÛeÜê—,WgÊ¯¥3Íµa(Ë39±‘˚§ñì®ã1£ DBñ"≠ï$X,∏¢¸‚\Å1yw“—»0©Ñè0µÌE)çîo	Hi^ª`)j≈¥Qç]P§ºnú≈^Ÿı‰ƒéM˚$≤¶ûÚõíÆΩB›ˇ
5óÊ≥h¶1üXÅ|~Å÷œZë•iÆÜ1§˘∞§’™UÀ¶±àÁÌåÖp}⁄ì“Ô5;*ç∆aÚ*®◊ÕÊ‚iu:\èËÔ!∂≤z_Ñ÷/BÎ°U´√UéH3/™/“•Y∫óQË—«ì.ﬂ.cwbî/Ûﬁ?Ω|˘‰¿œ%?Ü»sê#/H‚gè!aÊ”¨î0âà1v˘Ωªp 2ÏÒaì}tn¶Œßì˙ƒ™°‰Fÿ†P›L·@0µ3.˘jHB‘Û√K¢€4Kt∑∞8]íØŸÇÃtgfSä_nj(LD*„Î4‡öYI™ÆG^†7Fø≤Ñ}ΩWúb’≠"∞#»yhnˇ	V’“≈˜ïõËÑv”7~)H„K>≈úKHŸõï“{®πò	Ê=ÙïÛUÂ, äıs_ ˚U^˘UqüI•›-sJ◊I‘Wƒ=0oAøÚzbÜ#ˆ˚ı’ÚÇ%¯®´X-NŒ¶~‘ÂÌ˜r°P|ëﬁ{ä{sñèù£“™„fêpäRÖ!ï>Òp¥èÉxÔÉ NjnY”ˆ=ViPë Ì•;Ä‰wdX-…i~À 4¨ò^Õmà)$Êw*Æ0U¿ˆæ± ˙_ÿ>Ê(_rrÅ¥@ª˚§ècâY˜´ÊÉ¯1Zw—bCÕ	~L⁄ì7∆Õ$+êaΩN•UÄ+‹˘UVVÚtÃè•‚)êtvrﬁ◊àÕPÅ2ª‡ ∏QUWño`¬OÛØïÀ…≈ZØÏ íá*Æ°}!Qó\TÎ©¿?ñ  Û-w∆Ï‰@∏›≈rAÏ^FNÇ)C–ÏdƒO⁄©S¥·≠ÚHüõ4í‚„èGØˇBæ£^ÿVÒÒ«xzçıÓ©¯Q|<à‚£[Ø˘»3Ç4•Í@“ ™∆zÉ⁄b’®∂–◊‡¸WSåKjärùF∫â&åáº33©¡®NëcUoúDø ¯©'ı€ÂÎåµmU–~…©SÄ˚t¢ó|L25—^Ô¬'WP∑óﬂk˛'øÌ˜Œ∑∑˙ß˘¸ÛGm◊‡•a™≈˜ØûæzOº`Èº´À∞˙F—ºäc—Î«LZ°+\Ó\°À‹∞€-u¡!ªﬂ+9XKúYA£»~çMáΩï¶q6ñÜÑ:q˚KÆóh¬n?ïœ õÛ–Ãm#Åˆ2F9ß´ïÉ—ZÂÓë–Níò9Iï1¨Òà4Ω`§B3¶”a¢
≥Ï†öù„Ü˜·î"dÖTµÇ2vï†°4fieˇepÂ3IYΩøΩ9$ÁKLÒ”’∂2≠f.Ù∫€íoË >C¨øF&ÎÉÆ≠ÅKÄ5r‰1¢&e∆b¨9ûª1I#!Y)Åﬂæ_⁄¿3Dnò ‚di&	∞$3J`®4â≠j,WŸÉ/ê˝¯ê=∏'d≥Îa0Æ/†·~0]‘ß"4◊e˝©SR≥SÑ7T'AƒH2{C]ÙM∞åH|ÉR÷:<Öˇa˘ÓÚÍ:‚k÷˘≥ÎØ(¸Ô^ÜﬂoÌ	ÈíÉÖÛ˚£π;M~ˇÌ⁄:yºBúuÉaøÏlDtß"cG√m7Gı÷◊1Âß≠XªF˘‡x@ñú∑	pGLai+Ê¨ÏÌ/˙”1PÃpÕé≤A.PŒÒ@=«OÎïX0‰I‡– •Z>ñµ/xŒX…Aü]6¥≤ˇoœ√•ùÿˇ∆è»√ïÒÓ6]”{ùväπÚ ﬂætgvD÷ƒs√Û¿éÎ*Ç<ÜŸuV≤ˇÃG¸≥ÚJÌ-‡µwÄ´[Œ˚„ÕJ∂”6Å>RÂ´4˘¯©ﬁ	ÿÜLroœö€Ã´µYiôjın•ÊÚs8˚{Ú√—óìo<˘ˇu„{˜<≤£õ8QpD9G%íÆo√µÒ˘„É6”¯Ç#~Q˘“ÙvYŒSØOƒs„§Î∏Ò3—è2é¨ πÎπ˚ØÆe$ô¥£∞HÏXÌK2…ôêI,oiã3¿jÇRZÍ3/òVËœ“Rú€b<[Ç¬…î•â7Á´K«˜&eV1ı1⁄aqX"zÌ9KìÔ]¥ı•!mù£9@˙dô ƒ<[]c„õ0	+≠˜é^±ƒHÅoYV^ÒÎYÚMVÊ{ØﬁSõüπ\˝òè¯ÌçV÷√v‰g·ct˘»P
3˜£œ	'ÅëÒEïÙ6¸"Ω=æÙ6ºßÙñjúèn¸…˝Ñ7=)h$⁄„Ñ˙˜KıtjT˘Y:@ÊPüûeèùÂ
»Gú≈÷ôU{ÖôÙŸö`◊#Ùé“·õwÑ_eíPá\Õo`8≠äóÒ<UãMÁÚâ\—sÙ_©Õ1”πr—Ï†˙ÂX¶K∆±°=kÑx¨«æS∂&ÀÇ∞,·ç‡Bo9CΩ&a%ËµÕ‰·v¶R+Ã:@ΩMä4Óıìä‰üta ˜˝…MêàÇ Ÿ‚IyO√†µ„5T Ω`u√π©πVºQ¬8ñv¢hTjvØÄﬁŒ76öÔiX¨6+éÕv≈úô√Í©”3÷Æ
“»¡åÙ˙Üá¯rZ}kA~={¡8ô^a∫ÿ…ûŸ9µá†Cí”∂∫gÉt”ÚÀË˘•€ÏRçÅ§ôΩSê8vI≥V´<ƒxƒ%2}≠QDµJ≠dv—å`•Kç¥Ω7°ë14O„´∑Æ÷{ˆJQC*Üˆ÷—á≤çYã1lÃpäÚñKc-mpâ√√YF+Á.]STo5Œ˛ ®ª†ãœWB?ÒGºA¢ÑœE
 g:ºß¥Œ
 Û¿ HøèzPÉAT
ø»“‰∞#Ω}T'ÿ‚ úÎ£ﬂSëH≈˝ÏEöfqÉö=˘zgßÏ‘Öõ‰óYúÓ é∂∆˙ó]v0NqŸb6?1ïù/Á¨¨8’Â4Èö¥;*]§[u‚(ÅËm"ôj¨qYÀn;+^ÌP´ec†ö¢Ç˘˛iΩ‰Ö4HÖU≥(¶‚:Üƒb∫pπW+Üq‘®y.n≤oäw_⁄Î¸ØˇMûs&:eíÖñ-@x¬ﬂ®’îqYbLn~x˚ˆ«woéˇzÜÕù>?¯”ëÂQñÃÔ@.° 9ò“õvíı9…0#g—	‚®ÿ“´¯–ypb˚ä±øÌ/ôDÑÂ/ß¸9ùNa\ÙÔ.];S-íÙs†éPH–JÜáØªd7˝ƒkÜ1CTn·9ıôÛ∫ú£®âZNCdqØéLtÄ≥ÇølÅP†bR
ŸiºN&s -ﬁrNw‡jx4—9$Òy9 ˜p-’[ã®Ìó∞†Oj„e>‚Ï©gÿˆ=Ç· |</iF’ Ü•
l‚™¬ˆJ,‡SF=´C–π?¿0±AÀ®∞îÂ#"æQÃªvF9ÜëNs…1®x≤MÇuÊÜ—ÿ˘ßï’:U˙’0£2Fì9Äê+√˙sÄR;} Öæv#‘âÃGçlÎy`AëdH
û˚˘6’F§#v„‹≥„9ûCMà+Ê∆±√DÂ46U<p†s –;´ŒnÂ∆éQÑ˛&Eñ?bFoÆ=…&W5„@®èéÒ¨›Wiª1∫,&¸ŒA @T™`Õpß+!ÛàN˜VÊI∆;Áq1ù€Ü!xÿRåµ∑r–Á_ã¡cÆav%ID#S‹ô‚ÈñûÛ4÷y„‡d˜˚¢J„?}VÿjK§Ê~¡èõ¨ãF≈·”¸#c]9—,«S≤¬V»ÿß(¥zï=0ù*<U˚P”ÔÀ∏›–Å…–e:áﬂ!MO‚.¬y∫¥™∏t»nÛÅø¯‘nØ5l∆!ß`E˝ä[ LÈìÒ”–l:Å,Ñ«Êì=¢e˚vÿ	±ô–árÕ¬|⁄ù’ü˝U£ç¥⁄õˆi¨Œ.Z]Í<˜<&cwíhiJ‘∆ä√,ìN'ø®Y©œE‰u‹Dœ–é¡û´0C‚ÓÂÅdÀMìz®ëyç¬óÓ{ ' ‹ågÔÈ‘1ZÕOxvMÜ∞ıT’ÀJaÕ5„¯vÍ∆◊/¢$%ÈÔSe¿.ô˚±~0≠|Æôi\¡#¿##¶∏Uwß«aì¿#ÊN?aÛ`„≥Lµ∆ﬂj?⁄ùªÊ6BΩà»†É8`ù†+·u~·ÿ≈ç«”›K9Í†#?[6∆[¬æ≥VŸM#Ü”—d˘Ü 91;#§]–õΩ€¨á;s¡&ZábRß
⁄'Oø“É¢‚®Êí–à+…Ú√ÅÑQ Â$GÓçz≈∞øìû’úVG¸TI˘JúÇ™Ø§‘eòRt}√‚Q›‚≥1èŒÏ““2z]ñOπº˛‚„Í&k‚⁄—jÉ(_oês Ã ˛¬ö∆â»ÀPÁLï¶g`˙ÖÛ‡⁄»/ÁUdV¨ˇyÿhôû&QyB≤±µc[ÛèŒyÆH)x∞…2ﬁâêg∂ÄFTh3˙"π@‰›h”)öU”É`‚kÛOù+~ÿñbh∑ÑoÍkï“_4Ÿ'é÷}z%„ı,/ÜH”ù;±,´L÷IÜ©OÓêÜ∞L]ÄO∞Æ,›hÖQ?x…H©’é<ÒFÕx¡ƒˆéÄ)ﬂ¬6·ÃcÆπ‹,˚Ÿﬂ°õ3&ËØÆ√;ƒt ¿Mj«zÆuN¨qÈ´äÎTJiµARbø{˙5"¡`ÿØÀÈÑ^ŒéQ_W47Ô’:»äâî‘ø˘UÒd¡])eQ[’Ω:®[∆Bëﬂì˛ùUüÙ$˝HlL˝ÊT(∆§R÷ÿ∆¶Õ}4ärL πƒ'œ¶ÅW`V]	õO§w7ë},Tc∞ã&¬>∆±lÎ¢+ô·∂SSSı)FÕV4©UmÚ≠∆ÆÚÄÔÛl+˚G¡2öPÃã≤\êÚ≠õTjRPè¯Ÿs}äs}îìö@˚ÆÕUÇPb÷È]IÂW‘ÌÛÂ€ç¬0ªÂ#Z˙t>„ﬁ6'É1[§x±√∞+ÀÍ†U≤Q¶òÌ¨¶™M¿Ì´´k˘ÛôõÃóÁL”…_UükÉ‚)]sRöCü)∏ Y’q6n(¯ˇÙs«◊˜itw◊l⁄Páj¬¬hj/BvI6€E°Û∫˚|£‰a6`2’ÿ!Û!a’Ó—ÜAﬂ&7 nL®‘∏ÂüV±ôv>ºF`º)ÜV¥çjë@PqæÓÂÖl@Ã[jË™¥p5Ç=ˇ|6∑¸Û±°*∑ıë´‹$E[j@íUëí?ü(ºE˜J„à95Rù÷œ®’jÎ3£± 7≈◊™»PNí◊\Ìæ≤ˇ]pÖ&K~i1Û…¨´iHÃéâ˜›¥n˛©6tPˆıßwa{»Ωçe^¬îÈTÃQ˝Í%À*ã®IáÕ~+*Å•…}*õ≈÷`óá,Ùõáà3Âr⁄¥á,Y9ŒÁá?5l¯†˘0R`≈‹‹πD^ı:≠Ã›G2w]Ûw77oø◊øÜ/ﬂ"%[ïØ—∆ˆ¿éô◊Ë°≠‹ÚÀ›Q_n \PKs¥ÃÔ∂Ô˜∆≈ÀÓ[xzêñ—äT≤!óÆ¬ìÃJÜ∆•€Ly”|TZc»ó’‘EÙ€ !o 9ùZ¯Éö¬>⁄ƒx¸FÑwpó-n˙AoæÓKÊ’ÖŒÔ†ìi¨˙¬FVπYáOY∆$•~1Ù#üÅ25C®¸+!Ø5U"'˙MÆ5eqU=ï‚UŒÿ∂j®YÙÕÏfX.π¡—‰ûî(†a∞hhù· m—V˙£ ≈ü@*Ê¡lå•§çE1Y3b±ÚXÃO,›®n∏U≤]ÍÄ]k¯¿\Œ∞∏ö~À±˘ç‰QiöYxã’Éâ¿K#}YÙ◊È≥@ ”í≤FJ∑Z‚P&Ô Ìs…®‚~VLÆÆ7ﬂ∑™z#Àöç |(ùñÒ/M€:©GÖ¢€v˜MÎhá¿XP”√»§Ω[\$â‹=¥o‘Oﬁ“d8åºJ˝ªÒPèﬂ#]*(/5ÓP”‚Ìπ•:⁄Õà„gî’&yTÛﬁ-Oï´4∆_…≈yn‘Ω[0¬‚sˆS. n¿…Jà[ãÚ"ŸÜÏn®À∑/]©çwµ¿B.C /q¬""· M›h¡)AÛã[X+Y#mÉn(Ü]z	œbùÆÌcÇ?ml†94∞¿˘m!„∑©$=%RÏƒÊD§©≥i?∑hˆ&#{ìûjk+7kœa'Å©D˛≈Ìı˙vî›Æ-]^5ÏÆE“6ªÃ;Ì0ª¨πpùw¶–HØ˜6uó©"´ØÛ˛»X√˚˚¢7‹{ÖO« KÛÊâ≤“ŒîäÁ_\Ê¥0>‰+£Á‘™vèÊ.ıú¯†Û9h|Oê&⁄ØbÆ*–UOU%éÁ∫i»¬[6≤Í≈WΩœ®öÓ@Õı]∫≤ƒ¬eà_ü°ûeíÕ>¶ﬁ$Äµ9gäZ'K«tII\oö2ú~—ƒ∆|?7˙‡˜Ùµ`Œx!=ó†∂îr*_ Ôπƒ=pŒƒô·•°x|ã√êﬂxîºD´Æwﬂ¯Ã:ó∞h-˜C>Me,_œG´∂`ßƒu≥»E7{∑ÍÔ¬¯√‘ëÌÜ““⁄Ïæ¥Ø8[V≥PÆnﬁ*f´ê÷”ﬁ/ÌNI«Ñ-ï·¡¿¨Æï,B¢’Á∞§¡å7¨qáñyßgO±_˝®aƒ«7!eæ˘¸ß$ÜAÌ›:|ËıêU≈5ãçÖ>WˇX∫!cı“0@ë4I≈ÛTÇ‰%IOy3ƒæ§©¬¡'öUC?¢hâ√√f%•Gö
ﬂŸëseG4-ù˛n≥¥∑hã°áDÍ@§CÃ⁄´®∞Nû˜ö	yfµÚ	ôˆ√ıaèˆv1·†À\bÿ≤€Ö>âÎóÄ4x¯‚•àn¶√^f÷ÂxÂ-ç+cµeF6 GLî+Úh(J~GmG—;'ÇJEîÓ9©»¶abe«áÍ”$j|TºRÊBµ…•5ö‚7J$i8_ö$–R<h¢xa{a>G¬∑˝0KÖTb… \†—e°¨»zoÏXØœ™ ÿ&˝D≥¸Ö;?Õ'jRL4∫;£ëöÃdJ–p∆•”ˆ"pnÍŒ⁄Jz)Îº{≤…íÙ≥ML‡Ãã<iCµí6éE#+¿30pìˆk…9(ÀK'R*RLØn;,‚4N–ﬂJJ‡≈üâ‡’üéé…dæÙ/vJk´QG¥<·RHÀó-ï∏Ê≥ù0ù&Ï+¯´™—ãz‹§zGË5W∫hó≤
Ñú∞˛Ûüdı] Øm∫ÍV…Â4¢5êZx†¸îÓènÃEΩû„OnRd¡M<é¬öKU[≥ÁR]-?Â^9."fQ¥ÉÄ3u˝Ç”wëÕfXÁ¬M4}#èLïFµ\±xw`7.ôÔ:¸œ‚Æ.˜¸eP©6∆ü?#–9Ä€E—E¸éPòf£—)øØc[ß˘#Øß`>ˇÑZVuÆç¯NÒº1,Gv<ØÛıbp^V#˜:pb≥,∏˙[SRaÿÀœ45réΩ@∫–Òûa
<sãABTF©Çßk¡!ë\∞≤¸7†¢–∫§æDÚ;˛§≠–]±ü*yÕ”™É(ÊïØÃ›M*g&≠®vv.>pŸ‡Y[Â1?/ Rö—c’&cœw∞37…ÏÍ÷j=g8≤AC3¶!óö»«;ø™Ì´Eò‹0h7b‹‡úQä~*äe£=©Zk Œf∫≥ﬂ§“¶xã∫≥∑,´GTRòiﬁaºÙ PŸÍõ0≈aE†˘™ u5B}Z£^™«è#»`ÒM}øåi¥wã}0£#û#
∫ê™%ü;æ¡≤•ÍãÏÅæ‰∑‘é‘¢¯§Xˆ=Â:]˙ûeVJ+kΩ∫∆ˆ^√¶ ˙ı©~T≈:Í”bvô∑¨¶§G⁄“3(≈≈≥R˘`ÅY·`„¨x˛®ºRp∏DŒ∞|ôÚg≈Ú?≤DZ)’‡ÂÂgjy7f#Eœ ·£(ˇ.:ı¿õóÄ èë∑w´¸‘¨IâÓ≤ì´!π≤Ú◊pÚ%˛’`'ÜÔÈÃˆ(‰'‹ïK%‚Œkàn„˘dB√Ã”Äˇ:¶—"ÆgJ‰F5k‰∆ ßbá¯7QA.D£(Ä≥«˛k•˛c‘ΩZã&ò6®5m·ﬂ<˚¶!fçæ¡X;x+¿úÓÂBqä®é•b•„Ú$∏t˚±±M	.‹P>ÅH¿“Ú≈cÚç‹©À√x”ÔÌÅ∏Â¢Ó
¬ÒNëˇÕ!R+A‰9´˜í˘OÔo¸iÃ ü3)tUœïUHirèZ©"EÕt≤LhÜS:´Ø∏∫Nn…√Fu—ulóÈ⁄“ﬂ"„^˙sÅåÒèe˙Ä‹UÒ=ıBfÕÔZüT=˛‰:4x·Á˜?BG¢)»Ç®∏·¿Ü§]Ïï{Ωkx‡Ù¯Gi™¨3lÖ£QIˆ$ƒÖ˚Å:É™crlü«ÕºöiMVQd∂$˚§W·´≤qU˛±-|bz¬ñ€4{øzt*ú_7Sø+%u†u≥í/Ë˛k≈2¿∏Ï∂9◊·˘_ä)Y“E3xœ≥\,ø|uãçXòí‚Æ+~∏éŒw|∞,˚iv‡⁄x—≥aÆÔs£ÙñÆFAe.–P•1«uíÕºNgÆnœ ,2PM÷¶T£X »ﬂ&Ã∆¯YUPB‡>+ ê$ÀZc„ü∆…@rõ:fm+J#…UKÒ NãèM@öªöÂcHΩ…îaHŒQ⁄ëHïÃ)Ód√Vﬁ¥‰§•mZº75›ƒÃëüPæú^¢\óÑIh6êùòÎìæ¢è|k8ÃÁ“\EW¡™¨Øoó±;isC≤÷k£&x¬ÆÔ∏≥@ôëx$M;∑fÖÚG”∆Îb.1qËGœ\fXô“õúÙÃ‰íÜ–˜ó>â°>1¡6÷ŒØÁÀúˆÖs€˚WG«?º%¡Á]E¶„RiÑ⁄¡voe_4Â&ûπ≠Íõ_tñæ5eÔÌ"œÃÔ@§o»aê∞t÷/Ç$&]ÚG°Ã^6_. ı ÏèîiïÁV›∞Cw0t(e~äìèëDs»Æ(Y6*Ä•q7<Èn√'ºÜIJøÅ
ÊMŸ ”¨ŒVôJ›$ˆπ¿∫˝|MDÚÜiÄg9eAÚ•˜ÚëØ…À`¬ÙXÃA#[/ë!€‡ØÔæ˘Õo(”’áNQìFûá·7ø˘   ˇˇ aFZo