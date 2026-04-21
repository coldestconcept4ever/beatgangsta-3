
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { VSTPlugin, BeatRecipe, AppTheme, User, SavedRecipe, HistoryItem, Folder, KnifeStyle, PendantStyle, ChainStyle, SharedSession, DuragStyle, Hardware, FullSaveFile, GrillStyle, MixCritique, SavedCritique, TutorialProgress, ReceiptItem } from './types';
import { VIBE_EXAMPLES, SONG_EXAMPLES, BANDLAB_PLUGINS_LATEST, BANDLAB_FREE_PLUGINS_LATEST } from './constants';
import { ARTIST_EXAMPLES } from './constants/artists';
import { getBeatRecommendations, getCustomBeatRecommendations, getSongBeatRecommendations, getAudioBeatRecommendations, enrichPluginLibrary, validateApiKey, detectAPITier, replicateRecipeWithUserGear, getMixCritique, researchPluginParameters, verifyAndCorrectPlugin, ThinkingLevel } from './services/geminiService';
import { processAudioForAnalysis } from './utils/audioUtils';
import { uploadFileChunked, deleteFileFromDrive } from './services/uploadService';
import { convertWavToMp3 } from './lib/audioConverter';
import { enrichHardware } from './services/enrichmentService';
import { initAudio } from './utils/midiPlayer';
import { fetchWithDetailedError } from './lib/api';

import { AvianField } from './components/RavenField';
const PluginCard = React.lazy(() => import('./components/PluginCard').then(m => ({ default: m.PluginCard })));
const HardwareCard = React.lazy(() => import('./components/HardwareCard').then(m => ({ default: m.HardwareCard })));
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
import { AdminDashboard } from './components/AdminDashboard';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Globe, Languages, Star, X, Cpu, Folder as FolderIcon, ShieldCheck, Check, Zap, Rocket, Eye, EyeOff, AlertTriangle, Lock, Shield, Loader2, Gem, Sword, User as UserIcon, Link, Link2, Palette, Sparkles, Drum, Image as ImageIcon, Crown, CheckCircle2, ExternalLink, Facebook, Instagram, Linkedin, Twitter, Activity, Database, Trash2, Music } from 'lucide-react';
import tinycolor from 'tinycolor2';
import Turnstile from 'react-turnstile';

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
        👨‍🍳
      </div>
    );
  }

  if (style === 'rasta') {
    return (
      <div className="relative flex items-center justify-center text-sm">
        🇯🇲
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

const App: React.FC = () => {
  const [showRigUI, setShowRigUI] = useState(false);
  const [showBrandMenu, setShowBrandMenu] = useState(false);
  const [showFriendsInfo, setShowFriendsInfo] = useState(false);
  const [showModeInfo, setShowModeInfo] = useState(false);
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
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
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
    if (path === '/privacy' || path === '/privacy/') {
      window.location.href = 'https://www.beatgangsta.com/privacy';
    } else if (path === '/terms' || path === '/terms/') {
      window.location.href = 'https://www.beatgangsta.com/terms';
    } else if (path === '/cookies' || path === '/cookies/') {
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

  const [isGangstaVox, setIsGangstaVox] = useState<boolean>(false);
  const [csvInput, setCsvInput] = useState<string>('');
  const [plugins, setPlugins] = useState<VSTPlugin[]>(() => {
    try {
      const saved = localStorage.getItem('bg_library');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [starredPlugins, setStarredPlugins] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bg_starred_plugins');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [sortBy, setSortBy] = useState<'name' | 'vendor' | 'type'>('type');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderToRemove, setFolderToRemove] = useState<string | null>(null);
  const [deletedPlugins, setDeletedPlugins] = useState<VSTPlugin[]>(() => {
    try {
      const saved = localStorage.getItem('bg_deleted_plugins');
      return saved ? JSON.parse(saved) : [];
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
            recommendedChain: updatedActionPlan[actionIdx].recommendedChain.map((p, pIdx) => pIdx === pluginIdx ? newPlugin : p)
          };
        }
        return { ...c, actionPlan: updatedActionPlan };
      }
      return c;
    };

    setCritiques(prev => prev.map(updateCritique));
    setSavedCritiques(prev => prev.map(c => updateCritique(c as any) as SavedCritique));
  };

  const [recipes, setRecipes] = useState<BeatRecipe[]>([]);
  const [critiques, setCritiques] = useState<MixCritique[]>([]);
  const [latestErrorLog, setLatestErrorLog] = useState<string | null>(null);
  const [audioMode, setAudioMode] = useState<'recipe' | 'critique'>('recipe');
  const [critiqueContext, setCritiqueContext] = useState<string>('');
  const [referenceTrack, setReferenceTrack] = useState<string>('');
  const [referenceTrackFile, setReferenceTrackFile] = useState<File | null>(null);
  const referenceTrackInputRef = useRef<HTMLInputElement>(null);
  const [hasStems, setHasStems] = useState<boolean>(false);
  const [isBusMode, setIsBusMode] = useState<boolean>(false);
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

  const [isCloudflareVerified, setIsCloudflareVerified] = useState(false);
  const [cloudflareVerificationCount, setCloudflareVerificationCount] = useState(0);
  const [showCloudflareModal, setShowCloudflareModal] = useState(false);
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

  const isMasterAuthorized = useMemo(() => {
    const isEnglish = i18n.language.startsWith('en');
    return user && authorizedEmails.includes(user.email) && isEnglish;
  }, [user, i18n.language, authorizedEmails]);

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
      loadUserPlugins();
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

  const handleCloudflareVerify = async (token: string) => {
    try {
      const response = await fetchWithDetailedError('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'cf-turnstile-response': token }),
      });
      
      setIsCloudflareVerified(true);
      setCloudflareVerificationCount(prev => prev + 1);
      setTimeout(() => {
        setShowCloudflareModal(false);
        setIsCloudflareVerified(false);
        if (tutorialPhase === 'cloudflare_1') {
          setTutorialPhase('init');
          // If we were on Verification, and it's now gone, index 1 is Sign In.
          setTutorialStep(1); 
          setShowTutorial(true);
        } else if (tutorialPhase === 'cloudflare_2') {
          setTutorialPhase('done');
          localStorage.setItem('bg_tutorial_completed', 'true');
          setShowTutorial(false);
        }
      }, 1500);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Verification error. Please try again.");
    }
  };

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
        targetId: 'tutorial-turnstile-widget',
        title: t('tutorial_security_title'),
        content: t('tutorial_security_content'),
        placement: 'bottom' as const,
        requireAction: !isVerified,
        allowInteraction: true,
        onEnter: () => {
          if (!isVerified) {
            setShowCloudflareModal(true);
          }
        },
        onNext: () => {
          if (isVerified) {
            setShowCloudflareModal(false);
          }
        }
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
            if (!tutorialPlugin && plugins.length > 0) {
              const randomPlugin = plugins[Math.floor(Math.random() * plugins.length)];
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
  }, [tutorialPhase, isVerified, user, showCloudSyncModal, pendingFile, isEnrichingLibrary, plugins.length, recipes.length, sortBy, m_act, showConsentModal, hasAcceptedTerms, tutorialPlugin]);
  
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
      setShowCloudflareModal(true);
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

  const handleResetLibrary = () => {
    setPlugins([]);
    localStorage.removeItem('bg_plugins');
    localStorage.removeItem('bg_deleted_plugins');
    localStorage.removeItem('bg_starred_plugins');
    setStarredPlugins([]);
    setDeletedPlugins([]);
    window.location.reload(); // Reload to clear all states and start fresh
  };

  const [enrichProgress, setEnrichProgress] = useState(0);
  const [enrichEta, setEnrichEta] = useState(0);
  const [enrichStatus, setEnrichStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState<string>('');
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
  const [dawModalSource, setDawModalSource] = useState<'initial' | 'menu'>('initial');
  const [showAnalogModal, setShowAnalogModal] = useState(false);
  const [analogInstruments, setAnalogInstruments] = useState<Hardware[]>([]);
  const [analogHardware, setAnalogHardware] = useState<Hardware[]>([]);
  const [drumKits, setDrumKits] = useState<Hardware[]>([]);
  const [showDrumKitModal, setShowDrumKitModal] = useState(false);
  const [editingDrumKit, setEditingDrumKit] = useState<Hardware | undefined>(undefined);
  const [deletedInstruments, setDeletedInstruments] = useState<Hardware[]>([]);
  const [deletedHardware, setDeletedHardware] = useState<Hardware[]>([]);
  const [starredHardware, setStarredHardware] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bg_starred_hardware');
      return saved ? JSON.parse(saved) : [];
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
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [showBackupRestored, setShowBackupRestored] = useState(false);
  const [hasRestoredBackup, setHasRestoredBackup] = useState(false);

  useEffect(() => {
    if ((!isEnrichingLibrary && plugins.length > 0) || hasRestoredBackup) {
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
          const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAACkH6-i-na5YIlP9';
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

          if (instrumentsToMigrate.length > 0 && typeof instrumentsToMigrate[0] === 'string') {
            const enrichedInstruments = await enrichHardware(instrumentsToMigrate);
            setAnalogInstruments(enrichedInstruments);
            localStorage.removeItem('bg_analog_instruments');
          }

          if (hardwareToMigrate.length > 0 && typeof hardwareToMigrate[0] === 'string') {
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
  const [dawType, setDawType] = useState<string | null>(() => {
    return localStorage.getItem('bg_daw_type') || null;
  });

  useEffect(() => {
    if (dawType) {
      localStorage.setItem('bg_daw_type', dawType);
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
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
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
      if (plugins.some(p => p.name === itemName)) {
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
        if (plugins.length > 0) {
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
        if (plugins.length > 0) {
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
        if (plugins.length > 0) {
          setTutorialPhase('library_populated');
        } else {
          setTutorialPhase('import');
        }
        setTutorialStep(0);
        setShowTutorial(true);
      }
    } else if (tutorialPhase === 'analyzing' && !isEnrichingLibrary && plugins.length > 0) {
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
      console.error("Auth check failed", err);
      setError(`Auth check failed: ${err.message}`);
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
      // Validate origin
      const origin = event.origin;
      console.log("[AUTH DEBUG] Received postMessage from origin:", origin, "data:", event.data?.type);
      
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('beatgangsta.com')) {
        console.warn("[AUTH DEBUG] postMessage origin rejected:", origin);
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        console.log("[AUTH DEBUG] OAUTH_AUTH_SUCCESS received via postMessage");
        if (event.data.syncToken) {
          await syncAuth(event.data.syncToken);
        } else {
          console.log("[AUTH DEBUG] No syncToken in message, calling checkAuth");
          checkAuth();
        }
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
    }, 15000); // Increased interval to be safer

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
      const res = await fetchWithDetailedError('/api/cloud/data', { method: 'DELETE' });
      alert(t('cloud_data_removed'));
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
      const res = await fetchWithDetailedError('/api/auth/account', { method: 'DELETE' });
      localStorage.clear();
      setUser(null);
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
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [receipts, setReceipts] = useState<ReceiptItem[]>(() => {
    try {
      const saved = localStorage.getItem('bg_receipts');
      return saved ? JSON.parse(saved) : [];
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
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    try {
      const saved = localStorage.getItem('bg_folders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('bg_history');
      return saved ? JSON.parse(saved) : [];
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


  const filteredPlugins = useMemo(() => {
    let filtered = plugins.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    
    let filtered = plugins.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groups: Record<string, VSTPlugin[]> = {};
    filtered.forEach(p => {
      const key = sortBy === 'vendor' ? p.vendor : p.type;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });

    // Sort groups by key
    return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)));
  }, [plugins, searchTerm, sortBy]);

  const parsePlugins = async (input: string) => {
    if (!requireAuth()) return;
    if (!input.trim()) return;
    const lines = input.trim().split('\n');
    const isReaperIni = lines.some(l => l.includes('=') && (l.includes('.dll') || l.includes('.vst3')));
    const isMixcraftXml = input.includes('<VSTPlugins>') || input.includes('<Plugin ') || input.includes('<vst-inventory>');
    let parsed: VSTPlugin[] = [];

    if (isReaperIni) {
      parsed = lines.map(line => {
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
        };
      }).filter((p): p is VSTPlugin => p !== null && p.name !== '');
    } else if (isMixcraftXml) {
      // Basic Mixcraft VST inventory XML parsing using regex
      const pluginMatches = input.matchAll(/<Plugin\s+([^>]+)>/gi);
      for (const match of pluginMatches) {
        const attrText = match[1];
        const nameMatch = attrText.match(/name="([^"]+)"/i);
        const vendorMatch = attrText.match(/vendor="([^"]+)"/i);
        const filenameMatch = attrText.match(/filename="([^"]+)"/i);
        
        if (nameMatch) {
          const filename = filenameMatch ? filenameMatch[1] : '';
          parsed.push({
            name: nameMatch[1],
            vendor: vendorMatch ? vendorMatch[1] : 'Unknown',
            type: filename.toLowerCase().includes('vst3') ? 'VST3' : 'VST2',
            version: 'N/A',
            lastModified: 'Found in Mixcraft XML',
          });
        }
      }
    } else {
      const startIndex = lines[0] && lines[0].toLowerCase().includes('vendor') ? 1 : 0;
      parsed = lines.slice(startIndex).map(line => {
        // Try CSV parsing first
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length >= 2) {
          const rawName = parts[1]?.replace(/"/g, '').trim() || 'Unknown';
          const rawVendor = parts[0]?.replace(/"/g, '').trim() || 'Unknown';
          return {
            vendor: rawVendor,
            name: rawName,
            type: parts[2]?.replace(/"/g, '').trim() || 'Unknown',
            version: parts[3]?.replace(/"/g, '').trim() || 'Unknown',
            lastModified: parts[4]?.replace(/"/g, '').trim() || 'Unknown',
          };
        }
        
        // Fallback: treat whole line as plugin name if it's not empty
        const name = line.trim();
        if (!name) return null;
        
        // Try to guess vendor if it's in format "Vendor - Name" or "Vendor: Name"
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

    if (parsed.length > 2000) {
      setError("Please limit your list to 2000 plugins at a time so the AI doesn't get overwhelmed.");
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
      }, i18n.language);
      
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

  const processFile = async (file: File) => {
    if (!requireAuth()) return;
    
    const fileName = file.name.toLowerCase();
    if (fileName.includes('reaper')) {
      setDawType('Reaper');
    } else if (fileName.includes('studio one') || fileName.includes('studioone')) {
      setDawType('Studio One');
    } else if (fileName.includes('fl studio') || fileName.includes('flstudio')) {
      setDawType('FL Studio');
    } else if (fileName.includes('mixcraft') || fileName.includes('vst-inventory')) {
      setDawType('Mixcraft');
    }

    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          if (content) {
            setCsvInput(content);
            await parsePlugins(content);
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => {
        setError("Failed to read the file. Please try again.");
        reject(new Error("Failed to read file"));
      };
      reader.readAsText(file);
    });
  };

  const handleAnalogSave = async (instruments: Hardware[], hardware: Hardware[]): Promise<boolean> => {
    if (!requireAuth()) return false;
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
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file).catch(err => {
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
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file).catch(err => {
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

  const getEstimatedSeconds = (type: 'replicate' | 'generate' | 'type-beat' | 'song-search' | 'audio-search') => {
    switch (type) {
      case 'replicate': return 45;
      case 'generate': return 60;
      case 'type-beat': return 75;
      case 'song-search': return 80;
      case 'audio-search': return 120;
      default: return 90;
    }
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

  const handleGenerate = async () => {
    if (!requireAuth()) return;
    
    if (plugins.length === 0) return;
    if (!isVerified) {
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
      const response = await getBeatRecommendations(plugins, analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n.language);
      clearInterval(progressInterval);
      setGenerationProgress(100);
      clearTimeout(timeoutId);
      setRecipes(response.recipes);
      const newHistory: HistoryItem[] = response.recipes.map(r => ({
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

  const handleTypeBeatSearch = async () => {
    if (!requireAuth()) return;
    
    if (plugins.length === 0 || !typeBeatSearch.trim()) return;
    if (!isVerified) {
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
      const response = await getCustomBeatRecommendations(plugins, typeBeatSearch.trim(), analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n.language);
      clearInterval(progressInterval);
      setGenerationProgress(100);
      clearTimeout(timeoutId);
      setRecipes(response.recipes);
      const newHistory: HistoryItem[] = response.recipes.map(r => ({
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
    
    if (plugins.length === 0 || !songSearch.trim()) return;
    if (!isVerified) {
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
      const response = await getSongBeatRecommendations(plugins, songSearch.trim(), analogInstruments, analogHardware, drumKits, excludeAnalog, dawType, starredPlugins, isGangstaVox, i18n.language);
      clearInterval(progressInterval);
      setGenerationProgress(100);
      clearTimeout(timeoutId);
      setRecipes(response.recipes);
      const newHistory: HistoryItem[] = response.recipes.map(r => ({
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

  const handleStemsSearch = async () => {
    if (!requireAuth()) return;
    if (plugins.length === 0) return;
    if (!isVerified) {
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
      setLoading(false);
      setAudioAnalysisLoading(false);
      setError("Audio analysis is taking longer than expected. The files might be very complex, but we're still trying...");
    }, 900000); 

    const progressInterval = simulateGenerationProgress(getEstimatedSeconds('audio-search') * activeStems.length);
    const filesToDelete: string[] = [];

    try {
      // Upload all stems
      const uploadedStems = [];
      for (let i = 0; i < activeStems.length; i++) {
        const stem = activeStems[i];
        if (!stem.file) continue;
        
        let fileToUpload = stem.file;
        
        // Convert WAV to MP3 if necessary
        if (fileToUpload.type.includes('wav') || fileToUpload.name.toLowerCase().endsWith('.wav')) {
          setStems(prev => prev.map(s => s.id === stem.id ? { ...s, status: 'converting' as any } : s));
          try {
            fileToUpload = await convertWavToMp3(fileToUpload);
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
      
      if (referenceTrackFile) {
        const refUploadData = await uploadFileChunked(referenceTrackFile);
        if (refUploadData) {
          finalReferenceTrack = refUploadData.url;
          if (refUploadData.fileId) filesToDelete.push(refUploadData.fileId);
          referenceGeminiFileUri = refUploadData.geminiFileUri || null;
        }
      }

      // Format stems context for Gemini
      const stemsContext = uploadedStems.map(s => `Stem: ${s.file!.name} (Type: ${s.type === 'Other' && s.customType ? s.customType : s.type}) - URI: ${s.uri}`).join('\n');
      const fullContext = `The user has uploaded ${activeStems.length} stems for analysis.\n\n${stemsContext}\n\nUser Context: ${critiqueContext}`;

      const critique = await getMixCritique(plugins, null, null, 'audio/mpeg', isGangstaVox, true, fullContext, null, finalReferenceTrack, referenceAudioBase64, null, referenceGeminiFileUri, i18n.language, uploadedStems, analogInstruments, analogHardware, isBusMode);
      critique.id = Math.random().toString(36).substr(2, 9);
      critique.audioBase64 = null;
      critique.mimeType = 'audio/mpeg';

      // Charge user for stems (base cost + per file + per MB)
      const totalSizeMB = activeStems.reduce((acc, stem) => acc + (stem.file?.size || 0), 0) / (1024 * 1024);
      const stemCost = 10 + (activeStems.length * 2) + Math.ceil(totalSizeMB * 0.5);
      logReceipt('Stems Mix Critique', stemCost);

      setCritiques([critique]);
      setAudioMode('critique');
      setCritiqueContext('');
      setReferenceTrack('');
      setReferenceTrackFile(null);
      // Reset stems to empty state but keep types
      setStems(prev => prev.map(s => ({ ...s, file: null, status: 'empty' as const, mimeType: '' })));
      
      if (user && autoBackupPrefs.critiques) {
        handleExecuteCloudSync('backup', { gear: false, settings: false, recipes: false, critiques: true }, true);
      }
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

  const handleAudioSearch = async (file: File) => {
    if (!requireAuth()) return;
    
    if (plugins.length === 0) return;
    if (!isVerified) {
      setError("Please complete the security verification first.");
      return;
    }
    if (!file.type.includes('mpeg') && !file.type.includes('mp3') && !file.name.toLowerCase().endsWith('.mp3') && !file.type.includes('wav') && !file.name.toLowerCase().endsWith('.wav')) {
      setError("Only MP3 and WAV files are supported for analysis at this time.");
      return;
    }
    
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Please upload an audio file smaller than 50MB.");
      return;
    }
    setLoading(true);
    setAudioAnalysisLoading(true);
    setError(null);

    // Run even if it takes a long time - increased to 15 mins
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setAudioAnalysisLoading(false);
      setError("Audio analysis is taking longer than expected. The file might be very complex, but we're still trying...");
    }, 900000); 

    const progressInterval = simulateGenerationProgress(getEstimatedSeconds('audio-search'));
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
      let fileToUpload = file;

      if (fileToUpload.type.includes('wav') || fileToUpload.name.toLowerCase().endsWith('.wav')) {
        try {
          fileToUpload = await convertWavToMp3(fileToUpload);
        } catch (e) {
          console.error(`Failed to convert ${fileToUpload.name} to MP3, falling back to original file:`, e);
        }
      }

      const audioUploadData = await uploadFileChunked(fileToUpload);
      let audioUrl: string | null = audioUploadData?.url || null;
      let geminiFileUri: string | null = audioUploadData?.geminiFileUri || null;
      let mimeType = fileToUpload.type || 'audio/mpeg';

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

      if (audioMode === 'critique') {
        if (!requireAuth()) return;
        
        let finalReferenceTrack = referenceTrack;
        let referenceAudioBase64: string | null = null;
        let referenceGeminiFileUri: string | null = null;
        
        if (referenceTrackFile) {
          let refFileToUpload = referenceTrackFile;
          if (refFileToUpload.type.includes('wav') || refFileToUpload.name.toLowerCase().endsWith('.wav')) {
            try {
              refFileToUpload = await convertWavToMp3(refFileToUpload);
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

        const critique = await getMixCritique(plugins, audioBase64, audioUrl, mimeType, isGangstaVox, hasStems, critiqueContext, null, finalReferenceTrack, referenceAudioBase64, geminiFileUri, referenceGeminiFileUri, i18n.language, undefined, analogInstruments, analogHardware, isBusMode);
        critique.id = Math.random().toString(36).substr(2, 9);
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
        logReceipt('Mix Critique', isWav ? 25 : 10);
        
        setCritiques([critique]);
        setRecipes([]);
        setShowFairy(true);
      } else {
        let response;
        try {
          if (!requireAuth()) return;
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
            critiqueContext,
            geminiFileUri,
            i18n.language
          );
        } catch (apiErr: any) {
          console.warn("Initial audio analysis failed, retrying with minimal plugin list...", apiErr);
          // Retry with a very small plugin list (top 30) to reduce context pressure
          try {
            if (!requireAuth()) return;
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
              critiqueContext,
              geminiFileUri,
              i18n.language
            );
          } catch (retryErr: any) {
            console.error("Retry audio analysis failed:", retryErr);
            throw retryErr;
          }
        }

        clearInterval(progressInterval);
        setGenerationProgress(100);
        clearTimeout(timeoutId);
        
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
        logReceipt('Audio Analysis Recipe', isWav ? 25 : 10);
        
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
            setError(data.error || "Failed to initiate stems checkout.");
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
                      setPlugins([]);
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

                    {isMasterAuthorized && (
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
          {showGuide && <DAWGuide theme={theme} onClose={() => setShowGuide(false)} />}
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <React.Suspense fallback={null}>
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
                }}
                onOpenCritique={(c) => {
                  setCritiques([c]);
                  setRecipes([]);
                  setViewingRecipe(null);
                  setAudioMode('critique');
                  setShowVault(false);
                  // Update currentAudioInfo if the opened critique has audio
                  if (c.audioBase64 || c.audioUrl || c.geminiFileUri) {
                    setCurrentAudioInfo({
                      audioBase64: c.audioBase64 || null,
                      audioUrl: c.audioUrl || null,
                      geminiFileUri: c.geminiFileUri || null,
                      mimeType: c.mimeType || null
                    });
                  }
                }}
              />
            </React.Suspense>
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
            <span className="text-sm">🐦</span> {t('enter_bird_code')}
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
              <span className="text-sm">🚫</span> {t('disable_master_mode')}
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
              <div className="text-5xl animate-bounce">🐦</div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">{t('crazy_bird_protocol')}</h2>
              <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">{t('enter_secret_bird')}</p>
            </div>

            <div className="flex justify-center gap-3 relative z-10">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className={`w-12 h-16 rounded-2xl border-4 flex items-center justify-center text-2xl font-black transition-all ${passcode.length > i ? 'border-red-500 bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-red-900/50 text-red-900/30'}`}
                >
                  {passcode.length > i ? '🐦' : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 relative z-10">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map((val) => (
                <button
                  key={val.toString()}
                  onClick={() => {
                    if (val === 'C') setPasscode('');
                    else if (val === '✓') handlePasscodeSubmit();
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
                    🎹 BeatGangsta
                  </h3>
                  <p className={`text-sm font-medium ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-white/70'}`}>
                    {t('beatgangsta_mode_desc')}
                    <br/><br/>
                    <span className="font-bold text-orange-500">{t('pro_tip')}</span> {t('gangstavox_pro_tip')}
                  </p>
                </div>
                <div className={`p-6 rounded-3xl border ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                  <h3 className={`text-lg font-black mb-2 flex items-center gap-2 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                    🎤 GangstaVox
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
          <div className="flex items-center gap-4">
            <Logo size={42} grillStyle={grillStyle} knifeStyle={knifeStyle} duragStyle={duragStyle} pendantStyle={pendantStyle} chainStyle={chainStyle} theme={theme} saberColor={saberColor} mascotColor={mascotColor} showChain={showChain} highEyes={highEyes} isCigarEquipped={isCigarEquipped} isTossingCigar={isTossingCigar} showSparkles={showSparkles} onClick={cycleGrill} />
            <DownloadableLogoText currentAppName={currentAppName} theme={theme} />
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
            <button onClick={cycleGrill} className={mobileToolbarBtnClasses}><span className="text-xl">💎</span><span className="text-[9px] font-black uppercase truncate max-w-[80px]">{grillLabel}</span></button>
            <button onClick={cycleKnife} className={mobileToolbarBtnClasses}><span className="text-xl">🔪</span><span className="text-[9px] font-black uppercase truncate max-w-[80px]">{knifeLabel}</span></button>
            <button onClick={toggleTheme} className={mobileToolbarBtnClasses}><span className="text-xl">{theme === 'coldest' ? '❄️' : theme === 'chef-mode' ? '👨‍🍳' : theme === 'crazy-bird' ? '🐦' : '💰'}</span><span className="text-[9px] font-black uppercase truncate max-w-[80px]">{theme === 'chef-mode' ? t('chef_label') : t('theme_label')}</span></button>
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
            {receipts.length === 0 ? (
              <div className="text-xs opacity-50 italic">No transactions yet.</div>
            ) : (
              receipts.slice(0, 10).map(receipt => (
                <div key={receipt.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="opacity-50 text-[10px]">{new Date(receipt.date).toLocaleTimeString()}</span>
                    <span className="font-bold">{receipt.action}</span>
                  </div>
                  <span className="font-black text-red-500">-{receipt.cost} 🪙</span>
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
              <Logo size={160} grillStyle={grillStyle} knifeStyle={knifeStyle} duragStyle={duragStyle} pendantStyle={pendantStyle} chainStyle={chainStyle} theme={theme} saberColor={saberColor} mascotColor={mascotColor} showChain={showChain} highEyes={highEyes} isCigarEquipped={isCigarEquipped} isTossingCigar={isTossingCigar} showSparkles={showSparkles} onClick={cycleGrill} />
              
              <h2 className={`text-3xl sm:text-4xl font-black tracking-tighter mt-8 mb-4 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>
                Building Your Library...
              </h2>
              
              <p className={`text-sm font-bold mb-8 max-w-md ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-600' : 'text-slate-400'}`}>
                We're researching your unique plugins to find out what makes them special. This is a lot of work, but we'll automatically save your library so you won't have to do this again until you get new plugins!
              </p>

              <div className="w-full max-w-md bg-black/10 rounded-full h-4 mb-4 overflow-hidden relative">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${theme === 'coldest' ? 'bg-sky-500' : theme === 'chef-mode' ? 'bg-orange-500' : 'bg-white'}`}
                  style={{ width: `${enrichProgress}%` }}
                />
              </div>
              
              <div className="flex justify-between w-full max-w-md text-xs font-black uppercase tracking-widest opacity-60">
                <span>{enrichProgress}% Complete</span>
                <span>~{enrichEta}s remaining</span>
              </div>

              {enrichStatus && (
                <div className={`mt-6 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${theme === 'coldest' ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-white/40'}`}>
                  {enrichStatus}
                </div>
              )}
            </div>
          </div>
        ) : plugins.length === 0 && !isEnrichingLibrary && !hasRestoredBackup ? (
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
                <div className="text-4xl mb-4 opacity-50">{theme === 'coldest' ? '❄️' : theme === 'chef-mode' ? '👨‍🍳' : theme === 'crazy-bird' ? '🐦' : '💰'}</div>
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
              </div>
              {!isVerified && (
                <div className="flex justify-center mt-6">
                  <div id="tutorial-turnstile" className="flex items-center justify-center overflow-visible" style={{ width: '260px', height: '52px' }}>
                    <div key={verificationSessionId}>
                      <Turnstile
                        sitekey={typeof import.meta.env.VITE_TURNSTILE_SITE_KEY === 'string' ? import.meta.env.VITE_TURNSTILE_SITE_KEY : '0x4AAAAAACkH6-i-na5YIlP9'}
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
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.txt,.ini,.xml" onChange={(e) => {
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
        ) : (!isEnrichingLibrary && plugins.length > 0) || hasRestoredBackup ? (
          <div className="space-y-12 mt-12 sm:mt-0">
            <section className={`relative flex flex-col gap-8 p-6 sm:p-10 transition-colors ${mainBlurClass} border rounded-[3rem] sm:rounded-[4rem] shadow-xl ${theme === 'coldest' ? 'bg-white/20 border-white/30' : theme === 'chef-mode' ? 'bg-white/40 border-white/30' : 'bg-black/40 border-white/10'}`}>
              <div className="flex flex-col lg:flex-row gap-8 items-center justify-between relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-4 text-center sm:text-left">
                  <div className="relative z-30">
                    <Logo size={240} grillStyle={grillStyle} knifeStyle={knifeStyle} duragStyle={duragStyle} pendantStyle={pendantStyle} chainStyle={chainStyle} theme={theme} saberColor={saberColor} mascotColor={mascotColor} showChain={showChain} highEyes={highEyes} isCigarEquipped={isCigarEquipped} isTossingCigar={isTossingCigar} showSparkles={showSparkles} onClick={cycleGrill} />
                  </div>
                  <div className="flex flex-col justify-center -mt-4 sm:mt-0">
                    <h2 className={`text-4xl sm:text-6xl font-black tracking-tighter select-none ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>{t('studio_info')}</h2>
                    <p className="text-sm sm:text-lg font-bold opacity-70 select-none mt-2">{t('loaded_plugins_count', { count: plugins.length })}</p>
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
                      onClick={() => setIsGangstaVox(false)} 
                      className={`py-3 px-6 rounded-full font-black text-xs select-none transition-all ${
                        !isGangstaVox 
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
                      🎹 BeatGangsta
                    </button>
                    <button 
                      id="btn-mode-gangstavox"
                      onClick={() => setIsGangstaVox(true)} 
                      className={`py-3 px-6 rounded-full font-black text-xs select-none transition-all ${
                        isGangstaVox 
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
                      🎤 GangstaVox
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
                  <button onClick={handleGenerate} disabled={loading} className={`py-4 px-12 rounded-full font-black text-xs select-none shadow-lg hover:scale-105 active:scale-95 transition-all ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-sky-500 text-white' : 'bg-white text-black'}`}>{loading ? t('architecting') : t('get_random_recipes')}</button>
                </div>
              </div>

              <div className="h-[1px] bg-current opacity-10" />

              <div className={`flex flex-col gap-4 ${showChain ? '-mt-12' : ''}`}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 group overflow-hidden rounded-full">
                    <input 
                      id="input-vibe-search"
                      type="text" 
                      value={typeBeatSearch}
                      onChange={(e) => setTypeBeatSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTypeBeatSearch()}
                      className={`w-full py-5 pl-8 pr-32 sm:pr-40 rounded-full text-sm font-black focus:outline-none transition-all border-2 ${theme === 'coldest' ? 'bg-white/40 border-sky-100 focus:border-sky-400 text-slate-900' : theme === 'chef-mode' ? 'bg-white/60 border-orange-100 focus:border-orange-400 text-slate-900' : 'bg-black/60 border-white/10 focus:border-white/30 text-white'}`}
                    />
                    {!typeBeatSearch && (
                      <div className="absolute inset-y-0 left-8 right-32 sm:right-40 flex items-center overflow-hidden pointer-events-none">
                        <div className={`whitespace-nowrap animate-marquee text-sm font-black ${theme === 'coldest' ? 'text-slate-600' : theme === 'chef-mode' ? 'text-slate-600' : 'text-white/50'}`}>
                          {currentVibeExample}...     {currentVibeExample}...
                        </div>
                      </div>
                    )}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                      <span className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-900' : 'text-white'}`}>{t('vibe_search')}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleTypeBeatSearch} 
                    disabled={loading || !typeBeatSearch.trim()} 
                    className={`py-5 px-12 rounded-full font-black text-xs select-none shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-orange-500 text-white' : 'bg-white text-black'}`}
                  >
                    {loading ? t('searching') : t('search_vibe')}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 group overflow-hidden rounded-full">
                    <input 
                      id="input-song-search"
                      type="text" 
                      value={songSearch}
                      onChange={(e) => setSongSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSongSearch()}
                      className={`w-full py-5 pl-8 pr-32 sm:pr-40 rounded-full text-sm font-black focus:outline-none transition-all border-2 ${theme === 'coldest' ? 'bg-white/40 border-sky-100 focus:border-sky-400 text-slate-900' : theme === 'chef-mode' ? 'bg-white/60 border-orange-100 focus:border-orange-400 text-slate-900' : 'bg-black/60 border-white/10 focus:border-white/30 text-white'}`}
                    />
                    {!songSearch && (
                      <div className="absolute inset-y-0 left-8 right-32 sm:right-40 flex items-center overflow-hidden pointer-events-none">
                        <div className={`whitespace-nowrap animate-marquee text-sm font-black ${theme === 'coldest' ? 'text-slate-600' : theme === 'chef-mode' ? 'text-slate-600' : 'text-white/50'}`}>
                          {currentSongExamples[0]}...     {currentSongExamples[1]}...
                        </div>
                      </div>
                    )}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                      <span className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-900' : 'text-white'}`}>{t('song_search_label')}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleSongSearch} 
                    disabled={loading || !songSearch.trim()} 
                    className={`py-5 px-12 rounded-full font-black text-xs select-none shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-sky-600 text-white' : 'bg-white/20 text-white'}`}
                  >
                    {loading ? t('searching') : t('search_song')}
                  </button>
                </div>
              </div>

              {/* Audio Analysis Search - ALWAYS VISIBLE */}
              <div className="flex flex-col gap-4">
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
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${!isBusMode ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>Normal</span>
                        <button 
                          onClick={() => setIsBusMode(!isBusMode)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${isBusMode ? 'bg-sky-500' : 'bg-slate-400/50'}`}
                        >
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isBusMode ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isBusMode ? (theme === 'coldest' ? 'text-slate-900' : 'text-white') : (theme === 'coldest' ? 'text-slate-500' : 'text-white/50')}`}>Bus Mode</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 mb-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${theme === 'coldest' ? 'text-slate-900' : 'text-white'}`}>
                    {audioMode === 'critique' ? t('critique_context') : t('vibe_context')}
                  </label>
                  <textarea
                    value={critiqueContext}
                    onChange={(e) => setCritiqueContext(e.target.value)}
                    placeholder={audioMode === 'critique' 
                      ? t('critique_context_placeholder', { artist: placeholderArtist })
                      : t('vibe_context_placeholder', { artist: placeholderArtist })}
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
                          {referenceTrackFile ? 'File Selected ✓' : 'Upload MP3/WAV'}
                        </button>
                        {referenceTrackFile && (
                          <button
                            onClick={() => setReferenceTrackFile(null)}
                            className="p-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            title="Clear file"
                          >
                            ✕
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
                
                {hasStems ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className={`text-sm font-black uppercase tracking-widest ${theme === 'coldest' ? 'text-slate-900' : 'text-white'}`}>Stems ({stems.filter(s => s.file).length}/{stemsLimit})</h3>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          if (stemsLimit < 30) {
                            setStemSlotSliderValue(1);
                            setShowBuyStemsModal(true);
                          }
                        }}
                        className={`w-full p-4 rounded-xl text-center font-black transition-all border-2 ${
                          stemsLimit < 30
                            ? theme === 'coldest'
                              ? 'bg-purple-100/50 hover:bg-purple-100 border-purple-200 text-purple-700 hover:scale-[1.02]'
                              : 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-300 hover:scale-[1.02]'
                            : theme === 'coldest'
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-default'
                              : 'bg-zinc-800/50 border-zinc-700 text-zinc-500 cursor-default'
                        }`}
                      >
                        {stemsLimit < 30 ? "More than 10 stems?" : "Max Amount of Upload Slots Unlocked"}
                      </button>

                      {stems.map((stem, index) => (
                        <div key={stem.id} className={`flex items-center gap-3 p-3 rounded-xl border ${theme === 'coldest' ? 'bg-white/60 border-purple-100' : 'bg-black/40 border-purple-500/20'}`}>
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
                              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const newStems = [...stems];
                                  newStems[index] = { ...newStems[index], file, mimeType: file.type, status: 'pending' };
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
                        <span className="text-xl">📤</span>
                        {audioAnalysisLoading ? t('analyzing') : 'Analyze Stems'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div 
                      id="dropzone-audio"
                      onClick={() => audioInputRef.current?.click()}
                      onDragOver={handleAudioDragOver}
                      onDragLeave={handleAudioDragLeave}
                      onDrop={handleAudioDrop}
                      className={`relative flex-1 group overflow-hidden rounded-3xl cursor-pointer py-8 px-8 border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${
                        isDraggingAudio
                          ? 'bg-purple-500/20 border-purple-500 scale-[0.98]'
                          : audioMode === 'critique' 
                            ? (theme === 'coldest' ? 'bg-purple-50/80 border-purple-200 hover:border-purple-400 text-purple-900' : 'bg-purple-900/20 border-purple-500/30 hover:border-purple-500/60 text-purple-100')
                            : (theme === 'coldest' ? 'bg-white/40 border-sky-100 hover:border-sky-400 text-slate-900' : theme === 'chef-mode' ? 'bg-white/60 border-orange-100 hover:border-orange-400 text-slate-900' : 'bg-black/60 border-white/10 hover:border-white/30 text-white')
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${audioMode === 'critique' ? 'bg-purple-500/20' : 'bg-sky-500/20'}`}>
                          <span className="text-3xl">{audioMode === 'critique' ? '🎧' : '🎵'}</span>
                        </div>
                        <span className="text-lg font-black tracking-tight">
                          {audioMode === 'critique' ? t('drop_audio_for_critique') : t('drop_audio_to_analyze_vibe')}
                        </span>
                        <span className="text-xs font-medium opacity-60 max-w-[200px]">
                          {audioMode === 'critique' 
                            ? t('deep_mix_analysis_instruction')
                            : t('sonic_signature_instruction')}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 text-[10px] font-black uppercase tracking-widest opacity-60">
                        <span>{audioMode === 'critique' ? t('deep_analysis_mode') : t('vibe_detection')}</span>
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
                        className={`flex-1 py-5 px-6 rounded-3xl font-black text-xs select-none shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex flex-col items-center justify-center gap-2 ${
                          audioMode === 'critique'
                            ? 'bg-purple-600 text-white'
                            : (theme === 'coldest' || theme === 'chef-mode' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white')
                        }`}
                      >
                        <span className="text-xl">📤</span>
                        {audioAnalysisLoading ? t('analyzing') : t('select_file')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!isVerified && (
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
                  {recipes.map((recipe, idx) => (
                    <motion.div 
                      key={`${recipe.title}-${idx}`} 
                      id={`recipe-card-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
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
                      />
                    </motion.div>
                  ))}
                </motion.section>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {critiques.length > 0 && (
                <motion.section 
                  key="critiques-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 gap-6 mt-6"
                >
                  {critiques.map((critique, idx) => (
                    <motion.div 
                      key={critique.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <CritiqueCard 
                        critique={critique} 
                        theme={theme} 
                        plugins={plugins} 
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
                      />
                    </motion.div>
                  ))}
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
                      onChange={(e) => { setSortBy(e.target.value as any); setSelectedFolder(null); }}
                      className={`py-2 px-4 rounded-full text-xs font-bold focus:outline-none transition-all ${theme === 'coldest' ? 'bg-white/40 text-slate-800' : theme === 'chef-mode' ? 'bg-white/60 text-slate-900' : 'bg-black/60 text-white'}`}
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
                            if (plugins.some(p => p.name === name)) {
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
                <div className="flex items-center justify-between mb-6">
                  <h4 className={`text-sm font-black uppercase tracking-widest opacity-70 ${theme === 'coldest' || theme === 'chef-mode' ? 'text-slate-800' : 'text-white'}`}>Plugins</h4>
                </div>
                {groupedPlugins && !selectedFolder ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {(() => {
                      const items: any[] = Object.entries(groupedPlugins).map(([groupName, groupPlugins]) => ({ type: 'folder', name: groupName, plugins: groupPlugins }));
                    const placeholders = pendingPlaceholders.filter(p => p.type === 'folder').sort((a, b) => a.index - b.index);
                    placeholders.forEach(p => {
                      items.splice(p.index, 0, { type: 'folder', name: p.name, plugins: p.plugins, isPlaceholder: true, placeholderId: p.id });
                    });
                    
                    return items.map((item, idx) => {
                      if (item.isPlaceholder) {
                        return (
                          <div key={`placeholder-${item.placeholderId}`} className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border border-dashed transition-all ${theme === 'coldest' ? 'border-sky-300 bg-sky-50' : theme === 'chef-mode' ? 'border-orange-300 bg-orange-50' : 'border-white/20 bg-white/5'} h-full min-h-[12rem]`}>
                            <p className={`text-xs font-bold opacity-50 mb-4 text-center ${theme === 'coldest' ? 'text-sky-800' : theme === 'chef-mode' ? 'text-orange-800' : 'text-white'}`}>Removed {item.name}</p>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUndo(item.placeholderId); }}
                              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all ${theme === 'coldest' ? 'bg-sky-500 text-white' : theme === 'chef-mode' ? 'bg-orange-500 text-white' : 'bg-white text-black'}`}
                            >
                              Undo
                            </button>
                          </div>
                        );
                      }
                      
                      const groupName = item.name;
                      const groupPlugins = item.plugins;
                      return (
                        <div 
                          key={groupName}
                          onClick={() => setSelectedFolder(groupName)}
                          className={`cursor-pointer group relative flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-xl ${theme === 'coldest' ? 'bg-white/60 border-sky-100 hover:bg-white/80' : theme === 'chef-mode' ? 'bg-white/60 border-orange-100 hover:bg-white/80' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                          {/* Top Actions */}
                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setFolderToRemove(groupName); }}
                              className="p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-600 backdrop-blur-md transition-all"
                              title={`Remove ${sortBy === 'vendor' ? 'Brand' : 'Type'}`}
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Confirmation Popup */}
                          {folderToRemove === groupName && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-md rounded-[2rem] p-4 animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                              <div className="text-center">
                                <p className="text-white text-xs font-bold mb-3">Remove all {groupName}?</p>
                                <div className="flex justify-center gap-2">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setFolderToRemove(null); }}
                                    className="px-3 py-1.5 rounded-full bg-white/20 text-white text-[10px] font-bold hover:bg-white/30 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const pluginsInFolder = plugins.filter(p => (sortBy === 'vendor' ? p.vendor : p.type) === groupName);
                                      const folderIndex = Object.keys(groupedPlugins).indexOf(groupName);
                                      
                                      setPlugins(prev => prev.filter(p => (sortBy === 'vendor' ? p.vendor : p.type) !== groupName));
                                      setDeletedPlugins(prev => [...prev, ...pluginsInFolder]);
                                      setStarredPlugins(prev => {
                                        const names = pluginsInFolder.map(p => p.name);
                                        return prev.filter(name => !names.includes(name));
                                      });
                                      
                                      setPendingPlaceholders(prev => [
                                        ...prev, 
                                        { id: Date.now().toString() + Math.random(), type: 'folder', name: groupName, index: folderIndex, plugins: pluginsInFolder }
                                      ]);
                                      resetDeletionTimer();
                                      setFolderToRemove(null);
                                    }}
                                    className="px-3 py-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-colors"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center shadow-inner ${theme === 'coldest' ? 'bg-sky-100 text-sky-600' : theme === 'chef-mode' ? 'bg-orange-100 text-orange-600' : 'bg-black/40 text-white'}`}>
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                          <h4 className="text-sm font-black text-center truncate w-full px-2">{groupName}</h4>
                          <span className="text-[10px] font-bold opacity-50 mt-1 uppercase tracking-widest">{t('items_count', { count: groupPlugins.length })}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(() => {
                    const items: any[] = filteredPlugins.map(p => ({ type: 'plugin', plugin: p }));
                    const placeholders = pendingPlaceholders.filter(p => p.type === 'plugin').sort((a, b) => a.index - b.index);
                    placeholders.forEach(p => {
                      items.splice(p.index, 0, { type: 'plugin', plugin: p.plugins[0], isPlaceholder: true, placeholderId: p.id });
                    });

                    return items.map((item, idx) => {
                      if (item.isPlaceholder) {
                        return (
                          <div key={`placeholder-${item.placeholderId}`} className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border border-dashed transition-all ${theme === 'coldest' ? 'border-sky-300 bg-sky-50' : theme === 'chef-mode' ? 'border-orange-300 bg-orange-50' : 'border-white/20 bg-white/5'} h-full min-h-[12rem]`}>
                            <p className={`text-xs font-bold opacity-50 mb-4 text-center ${theme === 'coldest' ? 'text-sky-800' : theme === 'chef-mode' ? 'text-orange-800' : 'text-white'}`}>Removed {item.plugin.name}</p>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleUndo(item.placeholderId); }}
                              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all ${theme === 'coldest' ? 'bg-sky-500 text-white' : theme === 'chef-mode' ? 'bg-orange-500 text-white' : 'bg-white text-black'}`}
                            >
                              Undo
                            </button>
                          </div>
                        );
                      }

                      const plugin = item.plugin;
                      return (
                        <PluginCard 
                          id={`plugin-card-${plugin.name.replace(/\s+/g, '-').toLowerCase()}`}
                          key={`${plugin.vendor}-${plugin.name}`} 
                          plugin={plugin} 
                          isFavorite={starredPlugins.includes(plugin.name)}
                          onUpdatePlugin={handleUpdatePlugin}
                          onToggleFavorite={(p) => toggleStar(p.name)}
                          onRemove={(p) => {
                            const pluginIndex = filteredPlugins.findIndex(pl => pl.name === p.name && pl.vendor === p.vendor);
                            setPlugins(prev => prev.filter(pl => pl.name !== p.name || pl.vendor !== p.vendor));
                            setDeletedPlugins(prev => [...prev, p]);
                            setStarredPlugins(prev => prev.filter(n => n !== p.name));
                            
                            setPendingPlaceholders(prev => [
                              ...prev, 
                              { id: Date.now().toString() + Math.random(), type: 'plugin', index: pluginIndex, plugins: [p] }
                            ]);
                            resetDeletionTimer();
                          }}
                        />
                      );
                    });
                  })()}
                </div>
              )}
              </div>
            </section>
          </div>
        ) : null}
      </main>
      <footer className="py-16 text-center opacity-40 select-none">
        <p className="text-[10px] font-black uppercase tracking-[0.8em] mb-4">{currentAppName} x ColdestConcept / 2026</p>
        
        <div className="flex justify-center gap-4 mb-6">
          <a href="https://www.tiktok.com/@coldestconcept?_r=1&_t=ZP-94t4yW77agh" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity cursor-pointer" title="TikTok">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1 .05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/coldestconcept" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity cursor-pointer" title="LinkedIn">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="https://www.facebook.com/share/1CUwe4hCKh/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity cursor-pointer" title="Facebook">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="https://www.instagram.com/coldestconcept?igsh=a2xyYmkyazV4NnZp" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity cursor-pointer" title="Instagram">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://x.com/ConceptColdest" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity cursor-pointer" title="X (Twitter)">
            <Twitter className="w-4 h-4" />
          </a>
        </div>

        <div className="flex justify-center gap-6 text-[10px] font-bold tracking-tight">
          <button onClick={() => setShowCookiePolicy(true)} className="hover:opacity-100 transition-opacity cursor-pointer">{t('cookie_policy')}</button>
          <a href="https://www.beatgangsta.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity cursor-pointer">{t('privacy_policy')}</a>
          <a href="https://www.beatgangsta.com/terms" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity cursor-pointer">{t('terms_of_service')}</a>
          <button onClick={() => setShowContactForm(true)} className="hover:opacity-100 transition-opacity cursor-pointer">{t('contact_us')}</button>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 z-[399999] flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-black/90 border border-white/10 backdrop-blur-xl shadow-2xl max-w-5xl mx-auto"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-2xl">
                🍪
              </div>
              <div className="flex flex-col">
                <h4 className="text-white font-black uppercase tracking-tighter">{t('cookie_consent_title')}</h4>
                <p className="text-xs text-white/60 leading-relaxed max-w-md">
                  {t('cookie_consent_desc')} <button onClick={() => setShowCookiePolicy(true)} className="text-orange-500 hover:underline">{t('cookie_policy')}</button>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => {
                  localStorage.setItem('bg_cookie_consent', 'false');
                  setShowCookieConsent(false);
                }}
                className="flex-1 md:flex-none px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
              >
                {t('decline')}
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('bg_cookie_consent', 'true');
                  setShowCookieConsent(false);
                }}
                className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg shadow-orange-500/20"
              >
                {t('accept_all')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md overflow-hidden flex flex-col rounded-[2rem] shadow-2xl ${theme === 'coldest' ? 'bg-white text-slate-900' : 'bg-[#111] border border-white/10 text-white'}`}
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">{t('contact_us')}</h2>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">{t('privacy_support_inquiries')}</p>
                </div>
                <button 
                  onClick={() => setShowContactForm(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(t('inquiry_submitted'));
                  setShowContactForm(false);
                }}
                className="p-6 space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest opacity-50 ml-1">{t('full_name')}</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${theme === 'coldest' ? 'bg-slate-50 border-slate-200 focus:border-sky-500' : 'bg-white/5 border-white/10 focus:border-orange-500'}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest opacity-50 ml-1">{t('email_address')}</label>
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${theme === 'coldest' ? 'bg-slate-50 border-slate-200 focus:border-sky-500' : 'bg-white/5 border-white/10 focus:border-orange-500'}`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest opacity-50 ml-1">{t('subject')}</label>
                  <select 
                    value={contactFormSubject}
                    onChange={(e) => setContactFormSubject(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none appearance-none ${theme === 'coldest' ? 'bg-slate-50 border-slate-200 focus:border-sky-500' : 'bg-white/5 border-white/10 focus:border-orange-500'}`}
                  >
                    <option value="Privacy Request">{t('privacy_request')}</option>
                    <option value="Technical Support">{t('technical_support')}</option>
                    <option value="General Inquiry">{t('general_inquiry')}</option>
                    <option value="Business Opportunity">{t('business_opportunity')}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest opacity-50 ml-1">{t('message')}</label>
                  <textarea 
                    required
                    rows={3}
                    value={contactFormMessage}
                    onChange={(e) => setContactFormMessage(e.target.value)}
                    placeholder={t('how_can_we_help')}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none resize-none ${theme === 'coldest' ? 'bg-slate-50 border-slate-200 focus:border-sky-500' : 'bg-white/5 border-white/10 focus:border-orange-500'}`}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                >
                  {t('send_inquiry')}
                </button>
                
                <p className="text-[8px] text-center opacity-40 uppercase tracking-tighter">
                  {t('email_us_at')} <span className="text-orange-500">coldestconcept@beatgangsta.com</span>
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCookiePolicy && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col rounded-[2.5rem] shadow-2xl ${theme === 'coldest' ? 'bg-white text-slate-900' : 'bg-[#111] border border-white/10 text-white'}`}
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">{t('cookie_policy')}</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Last Updated: March 2026</p>
                </div>
                <button 
                  onClick={() => setShowCookiePolicy(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-3 text-orange-500">{t('cookie_policy_q')}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">
                    {t('cookie_policy_q_desc')}
                  </p>
                </section>

                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-3 text-orange-500">{t('cookie_policy_usage')}</h3>
                  <p className="text-sm opacity-70 leading-relaxed mb-4">
                    {t('cookie_policy_usage_desc')}
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      <div>
                        <strong className="block text-xs uppercase tracking-wider mb-1">{t('essential_cookies')}</strong>
                        <p className="text-xs opacity-60">{t('essential_cookies_desc')}</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      <div>
                        <strong className="block text-xs uppercase tracking-wider mb-1">{t('advertising_cookies')}</strong>
                        <p className="text-xs opacity-60">{t('advertising_cookies_desc')}</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      <div>
                        <strong className="block text-xs uppercase tracking-wider mb-1">{t('preference_cookies')}</strong>
                        <p className="text-xs opacity-60">{t('preference_cookies_desc')}</p>
                      </div>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-3 text-orange-500">{t('managing_cookies')}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">
                    {t('managing_cookies_desc')}
                  </p>
                </section>

                <section className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-3 text-orange-500">{t('third_party_cookies')}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">
                    {t('third_party_cookies_desc')}
                  </p>
                </section>
              </div>

              <div className="p-8 border-t border-white/5">
                <button 
                  onClick={() => setShowCookiePolicy(false)}
                  className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black uppercase tracking-widest text-xs transition-all active:scale-95"
                >
                  {t('got_it')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {showImportDecisionModal && importedSaveFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-6 rounded-3xl shadow-2xl ${theme === 'coldest' ? 'bg-white text-slate-900' : 'bg-[#111] border border-white/10 text-white'}`}>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{t('import_save_file')}</h3>
            <p className="text-sm opacity-70 mb-6">
              {t('file_contains_gear')} <strong>{importedSaveFile.userProfile.name}</strong>.
              {t('what_to_do')}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleRestoreSettings}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('restore_my_settings')}
              </button>
              
              <button
                onClick={handleCompareWithFriend}
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('compare_with_friend')}
              </button>

              <button
                onClick={() => {
                  setImportedSaveFile(null);
                  setShowImportDecisionModal(false);
                }}
                className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider transition-colors ${theme === 'coldest' ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Buy Credits Modal */}
      <AnimatePresence>
        {showBuyCreditsModal && (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm">
            <div className="min-h-[100dvh] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`border rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden transition-colors duration-500 ${
                  theme === 'coldest' 
                    ? "bg-white border-slate-200 text-slate-900" 
                    : "bg-zinc-900 border-zinc-800 text-white"
                }`}
              >
                <button 
                  onClick={() => {
                    setShowBuyCreditsModal(false);
                    setCreditError(null);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full transition-all z-10 opacity-50 hover:opacity-100 hover:bg-black/5"
                >
                  <X size={20} />
                </button>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">{t('out_of_credits')}</h2>
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                    <Zap size={14} className="fill-current" />
                    <span className="text-sm font-black">{user?.credits !== undefined ? user.credits : '...'} {t('credits_remaining')}</span>
                  </div>
                  <p className="text-sm opacity-70">
                    {creditError ? creditError.split(': ')[1] || creditError : t('need_more_credits')}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <button 
                    disabled={loading}
                    onClick={() => handleBuyCredits(40)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-yellow-500 hover:bg-yellow-500/5'} ${theme === 'coldest' ? 'border-slate-200' : 'border-zinc-800'}`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-lg">40 {t('credits')}</div>
                    </div>
                    <div className="font-black text-xl text-yellow-500">$5.00</div>
                  </button>

                  <button 
                    disabled={loading}
                    onClick={() => handleBuyCredits(100)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-yellow-500 hover:bg-yellow-500/5'} ${theme === 'coldest' ? 'border-slate-200' : 'border-zinc-800'}`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-lg">100 {t('credits')}</div>
                      <div className="text-xs text-yellow-500 font-bold uppercase tracking-widest">{t('best_value')}</div>
                    </div>
                    <div className="font-black text-xl text-yellow-500">$10.00</div>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}

      </AnimatePresence>

      {/* Buy Stems Modal */}
      <AnimatePresence>
        {showBuyStemsModal && (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm">
            <div className="min-h-[100dvh] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`border rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden transition-colors duration-500 ${
                  theme === 'coldest' 
                    ? "bg-white border-slate-200 text-slate-900" 
                    : "bg-zinc-900 border-zinc-800 text-white"
                }`}
              >
                <button 
                  onClick={() => setShowBuyStemsModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full transition-all z-10 opacity-50 hover:opacity-100 hover:bg-black/5"
                >
                  <X size={20} />
                </button>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="w-8 h-8 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Need More Upload Slots?</h2>
                  <div className="flex items-center justify-center gap-1 text-purple-500 mb-2">
                    <span className="text-sm font-black">{stemsLimit} / 30 Slots Unlocked</span>
                  </div>
                  <p className="text-sm opacity-70">
                    Upload more stems forever for just $3 per slot
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  {30 - stemsLimit > 0 ? (
                    <>
                      <div className="px-2">
                        <input
                          type="range"
                          min="1"
                          max={30 - stemsLimit}
                          value={stemSlotSliderValue}
                          onChange={(e) => setStemSlotSliderValue(parseInt(e.target.value))}
                          className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-purple-500 ${theme === 'coldest' ? 'bg-purple-100' : 'bg-purple-500/20'}`}
                        />
                        <div className="flex justify-between text-xs font-bold text-slate-500 mt-2 px-1">
                          <span>1</span>
                          <span>{30 - stemsLimit}</span>
                        </div>
                      </div>

                      <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-2xl p-6 text-center">
                        <div className="text-xs font-black text-purple-500 uppercase tracking-widest mb-2">Total Cost</div>
                        <div className="text-5xl font-black text-purple-500">${stemSlotSliderValue * 3}</div>
                        <div className={`text-xs font-bold mt-3 uppercase tracking-widest ${theme === 'coldest' ? 'text-slate-500' : 'text-slate-400'}`}>
                          For {stemSlotSliderValue} permanent upload slot{stemSlotSliderValue > 1 ? 's' : ''}
                        </div>
                      </div>

                      <button 
                        disabled={loading}
                        onClick={() => handleBuyStemSlots(stemSlotSliderValue)}
                        className={`w-full p-4 rounded-xl font-black text-lg uppercase tracking-widest transition-all text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50`}
                      >
                        Buy Now
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-lg font-bold text-emerald-500 p-6 bg-emerald-500/10 rounded-2xl border-2 border-emerald-500/20">
                      You have unlocked the maximum amount of stem slots!
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <React.Suspense fallback={null}>
        <PaymentMethodModal
          isOpen={showPaymentMethodModal}
          onClose={() => setShowPaymentMethodModal(false)}
          theme={theme}
          onSelect={handlePaymentMethodSelect}
          amount={pendingAmount}
          credits={pendingCredits}
        />
      </React.Suspense>



      {/* Backup Restored Confirmation */}
      <AnimatePresence>
        {showBackupRestored && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className={`px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4 border ${
                theme === 'coldest' 
                  ? 'bg-white border-sky-100 text-[#0c4a6e]' 
                  : theme === 'hustle-time'
                  ? 'bg-[#001a14] border-yellow-500/30 text-yellow-50'
                  : theme === 'chef-mode'
                  ? 'bg-orange-50 border-orange-200 text-orange-950'
                  : 'bg-black border-red-900/50 text-red-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                theme === 'coldest' ? 'bg-sky-500/10' : theme === 'hustle-time' ? 'bg-yellow-500/10' : theme === 'chef-mode' ? 'bg-orange-500/10' : 'bg-red-500/10'
              }`}>
                <ShieldCheck className={`w-6 h-6 ${
                  theme === 'coldest' ? 'text-sky-500' : theme === 'hustle-time' ? 'text-yellow-500' : theme === 'chef-mode' ? 'text-orange-500' : 'text-red-600'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">System Restored</h3>
                <p className="text-sm font-medium opacity-50">Welcome back to your studio.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <React.Suspense fallback={null}>
        <InternationalizationModal
          isOpen={showInternationalizationModal}
          onClose={() => setShowInternationalizationModal(false)}
          theme={theme}
          currentCountry={currentCountry}
          onCountryChange={setCurrentCountry}
        />
        <DawSelectionModal
          isOpen={showDawModal}
          onClose={() => {
            setShowDawModal(false);
            if (dawModalSource === 'initial') {
              setShowAnalogModal(true);
            }
          }}
          onSelect={(daw) => {
            setDawType(daw);
            setShowDawModal(false);
            if (dawModalSource === 'initial') {
              setShowAnalogModal(true);
            }
          }}
          initialDaw={dawType}
          theme={theme}
        />
      </React.Suspense>

      <React.Suspense fallback={null}>
        <AnalogEquipmentModal 
          isOpen={showAnalogModal} 
          onClose={() => setShowAnalogModal(false)} 
          theme={theme}
          onSave={handleAnalogSave}
        />
      </React.Suspense>

      <React.Suspense fallback={null}>
        <DrumKitModal
          theme={theme}
          isOpen={showDrumKitModal}
          onClose={() => {
            setShowDrumKitModal(false);
            setEditingDrumKit(undefined);
          }}
          onSave={(kit) => {
            if (editingDrumKit) {
              setDrumKits(prev => prev.map(k => k.name === editingDrumKit.name ? kit : k));
            } else {
              setDrumKits(prev => [...prev, kit]);
            }
            setShowDrumKitModal(false);
            setEditingDrumKit(undefined);
          }}
          initialKit={editingDrumKit}
        />
      </React.Suspense>
      <React.Suspense fallback={null}>
        <TrashModal
          isOpen={showTrashModal}
          onClose={() => setShowTrashModal(false)}
          deletedPlugins={deletedPlugins}
          deletedInstruments={deletedInstruments}
          deletedHardware={deletedHardware}
          onRestorePlugin={(plugin) => {
            setDeletedPlugins(prev => prev.filter(p => p.name !== plugin.name || p.vendor !== plugin.vendor));
            setPlugins(prev => [...prev, plugin]);
          }}
          onRestoreInstrument={(inst) => {
            setDeletedInstruments(prev => prev.filter(i => i !== inst));
            setAnalogInstruments(prev => [...prev, inst]);
          }}
          onRestoreHardware={(hw) => {
            setDeletedHardware(prev => prev.filter(h => h !== hw));
            setAnalogHardware(prev => [...prev, hw]);
          }}
          onEmptyTrash={() => {
            setDeletedPlugins([]);
            setDeletedInstruments([]);
            setDeletedHardware([]);
          }}
          theme={theme}
        />
      </React.Suspense>
      {showRigUI && (
        <React.Suspense fallback={null}>
          <RigManagerModal 
            theme={theme}
            vault={vault}
            plugins={plugins}
            analogInstruments={analogInstruments}
            analogHardware={analogHardware}
            drumKits={drumKits}
            user={user}
            activeSession={activeSession}
            onImportRig={handleImportRig}
            onImportGear={handleImportGear}
            onReplicateRecipe={handleReplicateRecipe}
            onExportFullSave={handleExportFullSave}
            onImportFullSave={handleImportFullSave}
            onCloudBackup={handleCloudBackup}
            onCloudRestore={handleCloudRestore}
            onCompareRigs={handleCompareRigs}
            onResetLibrary={handleResetLibrary}
            onUpdatePlugin={handleUpdatePlugin}
            isCloudSyncing={isCloudSyncing}
            cloudDriveUrl={cloudDriveUrl}
            onClose={() => setShowRigUI(false)}
          />
        </React.Suspense>
      )}

      {/* Cloudflare Verification Modal */}
      <AnimatePresence>
        {showCloudflareModal && (
          <div className={`fixed inset-0 z-[399999] overflow-y-auto ${showTutorial ? 'pointer-events-none' : 'bg-black/95 backdrop-blur-2xl'}`}>
            <div className="min-h-[100dvh] flex items-center justify-center p-4">
              <motion.div 
                id="tutorial-turnstile-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={showTutorial ? "pointer-events-auto" : `w-full max-w-md p-8 rounded-[3rem] border shadow-2xl flex flex-col items-center text-center ${theme === 'coldest' ? 'bg-white border-sky-100 text-slate-900' : 'bg-[#0a0a0a] border-white/10 text-white'}`}
              >
              {!showTutorial && (
                <>
                  <div className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#F48120"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#F48120"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#F48120"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#F48120"/>
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">{t('human_verification')}</h2>
                  <p className="text-sm opacity-60 leading-relaxed mb-8">
                    {t('cloudflare_desc')}
                  </p>
                </>
              )}
              
              <div className={showTutorial ? "flex flex-col items-center justify-center" : "w-full p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-4"}>
                {isCloudflareVerified && !showTutorial ? (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <Check className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-500">{t('verified')}</span>
                  </motion.div>
                ) : null}
                
                {/* Always show Turnstile if not verified, or if verified but in tutorial mode */}
                {(!isCloudflareVerified || showTutorial) && (
                  <div id="tutorial-turnstile-widget" className={`flex flex-col items-center gap-4 ${isCloudflareVerified && !showTutorial ? 'hidden' : ''}`}>
                    <Turnstile
                      sitekey={typeof import.meta.env.VITE_TURNSTILE_SITE_KEY === 'string' ? import.meta.env.VITE_TURNSTILE_SITE_KEY : '0x4AAAAAACkH6-i-na5YIlP9'}
                      onVerify={(token) => handleCloudflareVerify(token)}
                      theme={theme === 'coldest' ? 'light' : 'dark'}
                    />
                    {!showTutorial && <p className="text-[10px] opacity-40 uppercase tracking-widest">{t('verifying_connection')}</p>}
                  </div>
                )}
              </div>
              
              {!showTutorial && (
                <div className="mt-8 flex items-center gap-2 opacity-30">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('protected_by_cloudflare')}</span>
                </div>
              )}
            </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
      </AnimatePresence>

      <React.Suspense fallback={null}>
        <LegalConsentBanner
          show={showConsentModal}
          onAccept={handleAcceptTerms}
          onClose={() => setShowConsentModal(false)}
          isSaving={isSavingConsent}
          error={error}
        />
      </React.Suspense>

      {showTutorial && (
        <React.Suspense fallback={null}>
          <TutorialOverlay
            theme={theme}
            stepIndex={tutorialStep}
            steps={activeTutorialSteps}
            onNext={handleNextTutorialStep}
            onSkip={handleCompleteTutorial}
            isVerified={isVerified}
          />
        </React.Suspense>
      )}
      <React.Suspense fallback={null}>
        <RestoreBackupModal
          show={showRestoreModal}
          backupDate={backupInfo?.backupDate || ''}
          onRestore={() => {
            setShowRestoreModal(false);
            handleExecuteCloudSync('restore', { gear: true, settings: true, recipes: true, critiques: true });
          }}
          onClose={() => {
            setShowRestoreModal(false);
          }}
        />
      </React.Suspense>

      {/* Honey Pot for Bots - Hidden from humans */}
      <a 
        href="/api/trap" 
        style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} 
        aria-hidden="true" 
        tabIndex={-1}
        rel="nofollow"
      >
        Support & Documentation
      </a>
    </div>
  );
};

export default App;
