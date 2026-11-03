import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  Disc, 
  Play, 
  Square, 
  UploadCloud, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Copy, 
  Lock,
  ChevronDown,
  ChevronUp,
  X,
  Zap,
  FolderInput,
  Layers,
  Sliders
} from 'lucide-react';
import { AppTheme, SampleVaultItem, DrumOneShotCategory } from '../types';
import { 
  isAuthorizedForVault, 
  googleSignIn, 
  getAccessToken 
} from '../lib/firebaseAuth';
import { 
  analyzeOneShotAudio, 
  getAiOneShotGuidance, 
  uploadSampleToDrive, 
  syncVaultIndexToDrive, 
  fetchVaultIndexFromDrive, 
  deleteSampleFromDrive,
  extractDriveFolderId,
  listFilesInDriveFolder,
  moveDriveFile,
  downloadDriveFileAsBlob,
  getOrCreateDriveFolder,
  DriveAudioFileMeta
} from '../services/sampleVaultService';
import {
  findTopComplementaryMatches,
  PairingSynergy
} from '../utils/intelligentDrumPairing';

interface SampleVaultModalProps {
  theme: AppTheme;
  user: any;
  onClose: () => void;
  onUpdateUser?: (updated: any) => void;
}

// Comprehensive theme definitions matching BeatGangsta themes
const vaultThemeStyles: Record<string, {
  container: string;
  headerBg: string;
  discBg: string;
  titleGradient: string;
  vipBadge: string;
  subtitle: string;
  exportBtn: string;
  closeBtn: string;
  navBg: string;
  tabVaultActive: string;
  tabVaultInactive: string;
  tabPairingActive: string;
  tabPairingInactive: string;
  tabDriveActive: string;
  tabDriveInactive: string;
  accentText: string;
  uploadBg: string;
  uploadDashed: string;
  uploadIcon: string;
  uploadHighlight: string;
  catActive: string;
  catInactive: string;
  catCountActive: string;
  catCountInactive: string;
  card: string;
  cardPlayActive: string;
  cardPlayInactive: string;
  badgeType: string;
  badgeKey: string;
  badgePunch: string;
  pairBtn: string;
  guidanceBtn: string;
  tag: string;
  guidanceDrawer: string;
  guidanceCard: string;
  pairingSideBg: string;
  pairingAnchorCard: string;
  pairingChosenCard: string;
  pairingUnchosenCard: string;
  auditionPlayer: string;
  auditionBtnPlay: string;
  soloBox: string;
  soloActiveBoth: string;
  soloActiveA: string;
  soloActiveB: string;
  soloInactive: string;
  sliderAccent: string;
  boxCard: string;
  uadBox: string;
  uadCarve: string;
  driveContainer: string;
  driveInput: string;
  driveBtn: string;
  driveBtnMove: string;
  progressBar: string;
}> = {
  'coldest': {
    container: 'bg-[#030d1c]/95 border-sky-400/40 text-sky-100 shadow-[0_0_60px_rgba(56,189,248,0.22)]',
    headerBg: 'border-b border-sky-500/30 bg-gradient-to-r from-sky-950/70 via-[#04162e] to-slate-950/80',
    discBg: 'bg-sky-500/15 border-sky-400/40 text-sky-300',
    titleGradient: 'bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent',
    vipBadge: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    subtitle: 'text-sky-300/70 font-mono',
    exportBtn: 'bg-sky-500/20 hover:bg-sky-500/30 border-sky-400/40 text-sky-200',
    closeBtn: 'hover:bg-sky-900/40 text-sky-400',
    navBg: 'bg-sky-950/40 border-b border-sky-900/40',
    tabVaultActive: 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 font-bold',
    tabVaultInactive: 'bg-sky-950/50 hover:bg-sky-900/50 text-sky-300 border-sky-800/40',
    tabPairingActive: 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-500/30 font-black',
    tabPairingInactive: 'bg-sky-950/40 hover:bg-sky-900/40 text-sky-300 border-sky-800/40',
    tabDriveActive: 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-bold',
    tabDriveInactive: 'bg-blue-950/40 hover:bg-blue-900/40 text-blue-300 border-blue-800/40',
    accentText: 'text-sky-400',
    uploadBg: 'bg-gradient-to-b from-sky-950/20 to-transparent border-b border-sky-900/40',
    uploadDashed: 'border-sky-500/40 hover:border-sky-400 bg-sky-950/20 hover:bg-sky-950/35',
    uploadIcon: 'bg-sky-500/15 group-hover:bg-sky-500/25 text-sky-300',
    uploadHighlight: 'text-sky-300',
    catActive: 'bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105',
    catInactive: 'bg-sky-950/40 hover:bg-sky-900/50 text-sky-300/80 border-sky-800/40',
    catCountActive: 'bg-black/25 text-white',
    catCountInactive: 'bg-sky-900/60 text-sky-300',
    card: 'bg-sky-950/25 hover:bg-sky-950/40 border-sky-900/50 hover:border-sky-500/40',
    cardPlayActive: 'bg-sky-400 text-black border-sky-300 shadow-md scale-105',
    cardPlayInactive: 'bg-sky-950/70 text-sky-300 border-sky-800/50 hover:bg-sky-900',
    badgeType: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    badgeKey: 'bg-sky-900/40 border-sky-500/30 text-sky-200',
    badgePunch: 'bg-blue-900/40 border-blue-500/30 text-blue-200',
    pairBtn: 'bg-sky-500/20 hover:bg-sky-500/30 border-sky-400/40 text-sky-200',
    guidanceBtn: 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border-sky-500/30',
    tag: 'bg-sky-950/60 text-sky-300/80 border-sky-800/40',
    guidanceDrawer: 'border-t border-sky-900/50 bg-black/50',
    guidanceCard: 'bg-sky-950/40 border-sky-900/60',
    pairingSideBg: 'border-r border-sky-900/40 bg-sky-950/15',
    pairingAnchorCard: 'bg-sky-950/50 border-sky-500/40',
    pairingChosenCard: 'bg-sky-950/60 border-sky-400 shadow-md shadow-sky-500/15',
    pairingUnchosenCard: 'bg-sky-950/25 border-sky-900/40 hover:bg-sky-950/45 hover:border-sky-700/60',
    auditionPlayer: 'bg-gradient-to-r from-sky-950/60 via-black to-blue-950/50 border-sky-500/40',
    auditionBtnPlay: 'bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold',
    soloBox: 'bg-sky-950/60 border-sky-800/40',
    soloActiveBoth: 'bg-sky-400 text-black font-bold',
    soloActiveA: 'bg-sky-500 text-white font-bold',
    soloActiveB: 'bg-blue-500 text-white font-bold',
    soloInactive: 'text-sky-300 hover:text-white',
    sliderAccent: 'accent-sky-400',
    boxCard: 'bg-sky-950/30 border-sky-900/50',
    uadBox: 'bg-sky-950/40 border-sky-500/40',
    uadCarve: 'bg-black/40 border-sky-900/50 text-sky-200/90',
    driveContainer: 'bg-sky-950/25 border-sky-500/30',
    driveInput: 'bg-black/60 border-sky-500/40 text-white placeholder:text-sky-700 focus:border-sky-300',
    driveBtn: 'bg-sky-500 hover:bg-sky-400 text-black font-bold',
    driveBtnMove: 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-blue-500/30 font-black',
    progressBar: 'bg-gradient-to-r from-sky-400 to-blue-500',
  },
  'crazy-bird': {
    container: 'bg-[#0c0000]/95 border-red-900/60 text-red-50 shadow-[0_0_60px_rgba(220,38,38,0.25)]',
    headerBg: 'border-b border-red-900/40 bg-gradient-to-r from-red-950/70 via-black to-zinc-950/80',
    discBg: 'bg-red-500/15 border-red-500/40 text-red-400',
    titleGradient: 'bg-gradient-to-r from-red-300 via-rose-300 to-red-500 bg-clip-text text-transparent',
    vipBadge: 'bg-red-500/20 text-red-300 border-red-500/40',
    subtitle: 'text-red-300/70 font-mono',
    exportBtn: 'bg-red-500/20 hover:bg-red-500/30 border-red-400/40 text-red-200',
    closeBtn: 'hover:bg-red-900/40 text-red-400',
    navBg: 'bg-red-950/40 border-b border-red-900/40',
    tabVaultActive: 'bg-red-600 text-white shadow-lg shadow-red-600/30 font-bold',
    tabVaultInactive: 'bg-red-950/50 hover:bg-red-900/50 text-red-300 border-red-900/40',
    tabPairingActive: 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-600/30 font-black',
    tabPairingInactive: 'bg-red-950/40 hover:bg-red-900/40 text-red-300 border-red-900/40',
    tabDriveActive: 'bg-rose-700 text-white shadow-lg shadow-rose-700/30 font-bold',
    tabDriveInactive: 'bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border-rose-900/40',
    accentText: 'text-red-400',
    uploadBg: 'bg-gradient-to-b from-red-950/20 to-transparent border-b border-red-900/40',
    uploadDashed: 'border-red-500/40 hover:border-red-400 bg-red-950/20 hover:bg-red-950/35',
    uploadIcon: 'bg-red-500/15 group-hover:bg-red-500/25 text-red-400',
    uploadHighlight: 'text-red-300',
    catActive: 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-105',
    catInactive: 'bg-red-950/40 hover:bg-red-900/50 text-red-300/80 border-red-900/40',
    catCountActive: 'bg-black/30 text-white',
    catCountInactive: 'bg-red-900/60 text-red-300',
    card: 'bg-red-950/25 hover:bg-red-950/40 border-red-900/50 hover:border-red-500/40',
    cardPlayActive: 'bg-red-500 text-white border-red-400 shadow-md scale-105',
    cardPlayInactive: 'bg-red-950/70 text-red-300 border-red-900/50 hover:bg-red-900',
    badgeType: 'bg-red-500/15 text-red-300 border-red-500/30',
    badgeKey: 'bg-red-900/40 border-red-500/30 text-red-200',
    badgePunch: 'bg-amber-900/40 border-amber-500/30 text-amber-200',
    pairBtn: 'bg-red-500/20 hover:bg-red-500/30 border-red-400/40 text-red-200',
    guidanceBtn: 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border-red-500/30',
    tag: 'bg-red-950/60 text-red-300/80 border-red-900/40',
    guidanceDrawer: 'border-t border-red-900/50 bg-black/50',
    guidanceCard: 'bg-red-950/40 border-red-900/60',
    pairingSideBg: 'border-r border-red-900/40 bg-red-950/15',
    pairingAnchorCard: 'bg-red-950/50 border-red-500/40',
    pairingChosenCard: 'bg-red-950/60 border-red-400 shadow-md shadow-red-500/15',
    pairingUnchosenCard: 'bg-red-950/25 border-red-900/40 hover:bg-red-950/45 hover:border-red-700/60',
    auditionPlayer: 'bg-gradient-to-r from-red-950/60 via-black to-zinc-950 border-red-500/40',
    auditionBtnPlay: 'bg-gradient-to-r from-red-500 to-amber-600 text-white font-bold',
    soloBox: 'bg-red-950/60 border-red-800/40',
    soloActiveBoth: 'bg-red-500 text-white font-bold',
    soloActiveA: 'bg-red-600 text-white font-bold',
    soloActiveB: 'bg-amber-600 text-white font-bold',
    soloInactive: 'text-red-300 hover:text-white',
    sliderAccent: 'accent-red-500',
    boxCard: 'bg-red-950/30 border-red-900/50',
    uadBox: 'bg-red-950/40 border-red-500/40',
    uadCarve: 'bg-black/40 border-red-900/50 text-red-200/90',
    driveContainer: 'bg-red-950/25 border-red-500/30',
    driveInput: 'bg-black/60 border-red-500/40 text-white placeholder:text-red-700 focus:border-red-400',
    driveBtn: 'bg-red-600 hover:bg-red-500 text-white font-bold',
    driveBtnMove: 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-red-600/30 font-black',
    progressBar: 'bg-gradient-to-r from-red-500 to-amber-500',
  },
  'chef-mode': {
    container: 'bg-[#18110b]/95 border-orange-500/40 text-orange-50 shadow-[0_0_60px_rgba(249,115,22,0.2)]',
    headerBg: 'border-b border-orange-900/40 bg-gradient-to-r from-orange-950/70 via-stone-950 to-amber-950/70',
    discBg: 'bg-orange-500/15 border-orange-400/40 text-orange-400',
    titleGradient: 'bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent',
    vipBadge: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
    subtitle: 'text-orange-300/70 font-mono',
    exportBtn: 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-400/40 text-orange-200',
    closeBtn: 'hover:bg-orange-900/40 text-orange-400',
    navBg: 'bg-orange-950/40 border-b border-orange-900/40',
    tabVaultActive: 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/30',
    tabVaultInactive: 'bg-orange-950/50 hover:bg-orange-900/50 text-orange-300 border-orange-800/40',
    tabPairingActive: 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-500/30 font-black',
    tabPairingInactive: 'bg-orange-950/40 hover:bg-orange-900/40 text-orange-300 border-orange-800/40',
    tabDriveActive: 'bg-amber-600 text-black font-black shadow-lg shadow-amber-500/30',
    tabDriveInactive: 'bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border-amber-800/40',
    accentText: 'text-orange-400',
    uploadBg: 'bg-gradient-to-b from-orange-950/20 to-transparent border-b border-orange-900/40',
    uploadDashed: 'border-orange-500/40 hover:border-orange-400 bg-orange-950/20 hover:bg-orange-950/35',
    uploadIcon: 'bg-orange-500/15 group-hover:bg-orange-500/25 text-orange-400',
    uploadHighlight: 'text-orange-300',
    catActive: 'bg-orange-500 text-black font-black shadow-md shadow-orange-500/30 scale-105',
    catInactive: 'bg-orange-950/40 hover:bg-orange-900/50 text-orange-300/80 border-orange-800/40',
    catCountActive: 'bg-black/25 text-black',
    catCountInactive: 'bg-orange-900/60 text-orange-300',
    card: 'bg-orange-950/25 hover:bg-orange-950/40 border-orange-900/50 hover:border-orange-500/40',
    cardPlayActive: 'bg-orange-400 text-black border-orange-300 shadow-md scale-105',
    cardPlayInactive: 'bg-orange-950/70 text-orange-300 border-orange-800/50 hover:bg-orange-900',
    badgeType: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    badgeKey: 'bg-orange-900/40 border-orange-500/30 text-orange-200',
    badgePunch: 'bg-amber-900/40 border-amber-500/30 text-amber-200',
    pairBtn: 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-400/40 text-orange-200',
    guidanceBtn: 'bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border-orange-500/30',
    tag: 'bg-orange-950/60 text-orange-300/80 border-orange-800/40',
    guidanceDrawer: 'border-t border-orange-900/50 bg-black/50',
    guidanceCard: 'bg-orange-950/40 border-orange-900/60',
    pairingSideBg: 'border-r border-orange-900/40 bg-orange-950/15',
    pairingAnchorCard: 'bg-orange-950/50 border-orange-500/40',
    pairingChosenCard: 'bg-orange-950/60 border-orange-400 shadow-md shadow-orange-500/15',
    pairingUnchosenCard: 'bg-orange-950/25 border-orange-900/40 hover:bg-orange-950/45 hover:border-orange-700/60',
    auditionPlayer: 'bg-gradient-to-r from-orange-950/60 via-black to-stone-950 border-orange-500/40',
    auditionBtnPlay: 'bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black',
    soloBox: 'bg-orange-950/60 border-orange-800/40',
    soloActiveBoth: 'bg-orange-500 text-black font-black',
    soloActiveA: 'bg-orange-400 text-black font-bold',
    soloActiveB: 'bg-amber-500 text-black font-bold',
    soloInactive: 'text-orange-300 hover:text-white',
    sliderAccent: 'accent-orange-400',
    boxCard: 'bg-orange-950/30 border-orange-900/50',
    uadBox: 'bg-orange-950/40 border-orange-500/40',
    uadCarve: 'bg-black/40 border-orange-900/50 text-orange-200/90',
    driveContainer: 'bg-orange-950/25 border-orange-500/30',
    driveInput: 'bg-black/60 border-orange-500/40 text-white placeholder:text-orange-700 focus:border-orange-400',
    driveBtn: 'bg-orange-500 hover:bg-orange-400 text-black font-black',
    driveBtnMove: 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black shadow-orange-500/30',
    progressBar: 'bg-gradient-to-r from-amber-400 to-orange-500',
  },
  'hustle-time': {
    container: 'bg-[#09090b]/95 border-amber-500/40 text-amber-50 shadow-[0_0_60px_rgba(245,158,11,0.2)]',
    headerBg: 'border-b border-amber-900/40 bg-gradient-to-r from-amber-950/70 via-zinc-950 to-yellow-950/70',
    discBg: 'bg-amber-500/15 border-amber-400/40 text-amber-400',
    titleGradient: 'bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent',
    vipBadge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    subtitle: 'text-amber-300/70 font-mono',
    exportBtn: 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/40 text-amber-200',
    closeBtn: 'hover:bg-amber-900/40 text-amber-400',
    navBg: 'bg-amber-950/40 border-b border-amber-900/40',
    tabVaultActive: 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/30',
    tabVaultInactive: 'bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 border-amber-800/40',
    tabPairingActive: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/30 font-black',
    tabPairingInactive: 'bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border-amber-800/40',
    tabDriveActive: 'bg-yellow-500 text-black font-black shadow-lg shadow-yellow-500/30',
    tabDriveInactive: 'bg-yellow-950/40 hover:bg-yellow-900/40 text-yellow-300 border-yellow-800/40',
    accentText: 'text-amber-400',
    uploadBg: 'bg-gradient-to-b from-amber-950/20 to-transparent border-b border-amber-900/40',
    uploadDashed: 'border-amber-500/40 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-950/35',
    uploadIcon: 'bg-amber-500/15 group-hover:bg-amber-500/25 text-amber-400',
    uploadHighlight: 'text-amber-300',
    catActive: 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/30 scale-105',
    catInactive: 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-300/80 border-amber-800/40',
    catCountActive: 'bg-black/25 text-black',
    catCountInactive: 'bg-amber-900/60 text-amber-300',
    card: 'bg-amber-950/25 hover:bg-amber-950/40 border-amber-900/50 hover:border-amber-500/40',
    cardPlayActive: 'bg-amber-400 text-black border-amber-300 shadow-md scale-105',
    cardPlayInactive: 'bg-amber-950/70 text-amber-300 border-amber-800/50 hover:bg-amber-900',
    badgeType: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    badgeKey: 'bg-amber-900/40 border-amber-500/30 text-amber-200',
    badgePunch: 'bg-yellow-900/40 border-yellow-500/30 text-yellow-200',
    pairBtn: 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/40 text-amber-200',
    guidanceBtn: 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30',
    tag: 'bg-amber-950/60 text-amber-300/80 border-amber-800/40',
    guidanceDrawer: 'border-t border-amber-900/50 bg-black/50',
    guidanceCard: 'bg-amber-950/40 border-amber-900/60',
    pairingSideBg: 'border-r border-amber-900/40 bg-amber-950/15',
    pairingAnchorCard: 'bg-amber-950/50 border-amber-500/40',
    pairingChosenCard: 'bg-amber-950/60 border-amber-400 shadow-md shadow-amber-500/15',
    pairingUnchosenCard: 'bg-amber-950/25 border-amber-900/40 hover:bg-amber-950/45 hover:border-amber-700/60',
    auditionPlayer: 'bg-gradient-to-r from-amber-950/60 via-black to-zinc-950 border-amber-500/40',
    auditionBtnPlay: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black',
    soloBox: 'bg-amber-950/60 border-amber-800/40',
    soloActiveBoth: 'bg-amber-500 text-black font-black',
    soloActiveA: 'bg-amber-400 text-black font-bold',
    soloActiveB: 'bg-yellow-500 text-black font-bold',
    soloInactive: 'text-amber-300 hover:text-white',
    sliderAccent: 'accent-amber-400',
    boxCard: 'bg-amber-950/30 border-amber-900/50',
    uadBox: 'bg-amber-950/40 border-amber-500/40',
    uadCarve: 'bg-black/40 border-amber-900/50 text-amber-200/90',
    driveContainer: 'bg-amber-950/25 border-amber-500/30',
    driveInput: 'bg-black/60 border-amber-500/40 text-white placeholder:text-amber-700 focus:border-amber-400',
    driveBtn: 'bg-amber-500 hover:bg-amber-400 text-black font-black',
    driveBtnMove: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-amber-500/30',
    progressBar: 'bg-gradient-to-r from-amber-400 to-yellow-400',
  }
};

export const SampleVaultModal: React.FC<SampleVaultModalProps> = ({
  theme,
  user,
  onClose,
  onUpdateUser
}) => {
  const currentTheme = vaultThemeStyles[theme] || vaultThemeStyles['hustle-time'];
  const [currentUser, setCurrentUser] = useState<any>(user);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'vault' | 'pairing' | 'drive-import'>('vault');
  const [activeCategory, setActiveCategory] = useState<DrumOneShotCategory | 'all'>('all');
  const [samples, setSamples] = useState<SampleVaultItem[]>(() => {
    try {
      const saved = localStorage.getItem('bg_sample_vault_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStatus, setAnalyzeStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [expandedSampleId, setExpandedSampleId] = useState<string | null>(null);

  // Audio Playback
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // File input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetCategory] = useState<DrumOneShotCategory>('kicks');

  // Google Drive Folder Import State
  const [driveFolderInput, setDriveFolderInput] = useState<string>('');
  const [isScanningFolder, setIsScanningFolder] = useState<boolean>(false);
  const [scannedFiles, setScannedFiles] = useState<DriveAudioFileMeta[]>([]);
  const [detectedFolderId, setDetectedFolderId] = useState<string | null>(null);
  const [isMigratingDriveFolder, setIsMigratingDriveFolder] = useState<boolean>(false);
  const [migrationProgress, setMigrationProgress] = useState<{ current: number; total: number; fileName: string }>({
    current: 0,
    total: 0,
    fileName: ''
  });
  const [migrationRejections, setMigrationRejections] = useState<Array<{ name: string; reason: string }>>([]);

  // Intelligent Pairing Matrix State
  const [pairingFocusSample, setPairingFocusSample] = useState<SampleVaultItem | null>(null);
  const [topMatches, setTopMatches] = useState<PairingSynergy[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<PairingSynergy | null>(null);
  const [microOffsetMs, setMicroOffsetMs] = useState<number>(0);
  const [isDualPlaying, setIsDualPlaying] = useState<boolean>(false);
  const [dualSoloMode, setDualSoloMode] = useState<'both' | 'sampleA' | 'sampleB'>('both');
  const webAudioCtxRef = useRef<AudioContext | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Auto-recalculate top matches when pairing focus sample changes or samples change
  useEffect(() => {
    if (pairingFocusSample && samples.length > 1) {
      const matches = findTopComplementaryMatches(pairingFocusSample, samples, 10);
      setTopMatches(matches);
      if (matches.length > 0) {
        setSelectedMatch(matches[0]);
        setMicroOffsetMs(matches[0].suggestedOffsetMs || 0);
      } else {
        setSelectedMatch(null);
      }
    } else {
      setTopMatches([]);
      setSelectedMatch(null);
    }
  }, [pairingFocusSample, samples]);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bg_sample_vault_items', JSON.stringify(samples));
    } catch (e) {
      console.warn('Could not cache vault items locally:', e);
    }
  }, [samples]);

  // Check auth and tokens on mount
  useEffect(() => {
    getAccessToken().then(token => {
      if (token) setAccessToken(token);
    });
  }, []);

  const isAuthorized = isAuthorizedForVault(currentUser?.email);

  const handleGoogleAuth = async (): Promise<string | null> => {
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (!res) throw new Error('Sign in was cancelled or failed.');
      const authedUser = res.user;
      setCurrentUser(authedUser);
      if (onUpdateUser) {
        onUpdateUser(authedUser);
      }
      const token = res.accessToken;
      if (token) {
        setAccessToken(token);
        setSuccessNotice('Google Drive successfully authorized and connected!');
        await loadFromDrive(token);
        return token;
      }
      return null;
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication with Google failed.');
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const loadFromDrive = async (token: string) => {
    setIsSyncingDrive(true);
    setErrorMessage(null);
    try {
      const remoteItems = await fetchVaultIndexFromDrive(token);
      if (remoteItems && remoteItems.length > 0) {
        setSamples(remoteItems);
        setSuccessNotice(`Synced ${remoteItems.length} samples from Google Drive.`);
      }
    } catch (err: any) {
      console.warn('Could not sync from drive index:', err);
    } finally {
      setIsSyncingDrive(false);
    }
  };

  // Upload and analyze individual local files
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    const fileList = Array.from(files);
    let addedCount = 0;
    const currentSamples = [...samples];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setAnalyzeStatus(`[${i + 1}/${fileList.length}] Analyzing "${file.name}"...`);

      try {
        // Step 1: Acoustic DSP Analysis & Guardrail Check (ONE-SHOTS ONLY)
        const { acoustic } = await analyzeOneShotAudio(file);

        // Step 2: Categorization & AI Harmonic Reasoning
        const localBlobUrl = URL.createObjectURL(file);
        const category = targetCategory || 'kicks';

        setAnalyzeStatus(`[${i + 1}/${fileList.length}] Generating AI key & pocket guidance for "${file.name}"...`);
        const aiAnalysis = await getAiOneShotGuidance({
          fileName: file.name,
          category,
          acoustic
        });

        // Step 3: Build Vault Record
        const newItem: SampleVaultItem = {
          id: `sample_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          category,
          exactType: aiAnalysis.exactType,
          detectedKey: acoustic.detectedKey,
          fundamentalHz: acoustic.fundamentalHz,
          centsDetune: acoustic.centsDetune,
          durationSeconds: acoustic.durationSeconds,
          punchFrequencyHz: acoustic.punchFrequencyHz,
          attackMs: acoustic.attackMs,
          decayMs: acoustic.decayMs,
          peakDb: acoustic.peakDb,
          tags: aiAnalysis.tags,
          guidance: aiAnalysis.guidance,
          fileUrl: localBlobUrl,
          uploadedAt: new Date().toISOString(),
          userEmail: currentUser?.email || 'coldestconcept@gmail.com'
        };

        // Step 4: Sync to Google Drive if connected
        if (accessToken) {
          setAnalyzeStatus(`[${i + 1}/${fileList.length}] Uploading to Google Drive (${category})...`);
          try {
            const driveUpload = await uploadSampleToDrive(file, category, newItem, accessToken);
            newItem.driveFileId = driveUpload.fileId;
            newItem.driveFolderId = driveUpload.folderId;
          } catch (driveErr) {
            console.warn('Drive upload error:', driveErr);
          }
        }

        currentSamples.unshift(newItem);
        addedCount++;
      } catch (fileErr: any) {
        setErrorMessage(fileErr.message || `Error processing ${file.name}`);
      }
    }

    setSamples(currentSamples);
    setIsAnalyzing(false);
    setAnalyzeStatus('');

    if (addedCount > 0) {
      setSuccessNotice(`Successfully analyzed and added ${addedCount} one-shot(s) to your Vault.`);
      if (accessToken) {
        syncVaultIndexToDrive(currentSamples, accessToken).catch(e => console.warn('Sync index failed:', e));
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Google Drive Folder Scanner: Step 1 Scan
  const handleScanDriveFolder = async () => {
    if (!driveFolderInput.trim()) {
      setErrorMessage('Please enter a Google Drive folder link or folder ID.');
      return;
    }

    let token = accessToken;
    if (!token) {
      token = await getAccessToken();
    }

    // Auto-prompt to authorize Drive if token is missing
    if (!token) {
      token = await handleGoogleAuth();
    }

    if (!token) {
      setErrorMessage('Google Drive access token missing. Please click "Authorize Google Drive" to grant access.');
      return;
    }

    const folderId = extractDriveFolderId(driveFolderInput);
    if (!folderId) {
      setErrorMessage('Could not extract a valid Google Drive folder ID.');
      return;
    }

    setIsScanningFolder(true);
    setErrorMessage(null);
    setSuccessNotice(null);
    setScannedFiles([]);
    setDetectedFolderId(folderId);

    try {
      const files = await listFilesInDriveFolder(folderId, token);
      setScannedFiles(files);
      if (files.length === 0) {
        setErrorMessage(`No audio files (.wav, .mp3, .aif, .flac) found in that Google Drive folder or its subfolders.`);
      } else {
        setSuccessNotice(`Discovered ${files.length} audio file(s) ready for one-shot analysis and zero-duplication move!`);
      }
    } catch (err: any) {
      setErrorMessage(`Folder scan failed: ${err.message || 'Make sure folder is shared or accessible'}`);
    } finally {
      setIsScanningFolder(false);
    }
  };

  // Google Drive Folder Migration: Step 2 Native Move & AI Analysis
  const handleMigrateAndMoveDriveFolder = async () => {
    let token = accessToken;
    if (!token) {
      token = await getAccessToken();
    }
    if (!token) {
      token = await handleGoogleAuth();
    }
    if (!detectedFolderId || scannedFiles.length === 0 || !token) {
      if (!token) setErrorMessage('Google Drive access token missing. Please authorize Google Drive first.');
      return;
    }

    setIsMigratingDriveFolder(true);
    setErrorMessage(null);
    setSuccessNotice(null);
    setMigrationRejections([]);

    const rootFolderId = await getOrCreateDriveFolder('Beatgangsta Sample Vault', undefined, token);
    const categoryFolderMap: Record<DrumOneShotCategory, string> = {
      kicks: await getOrCreateDriveFolder('01_Kicks', rootFolderId, token),
      '808s': await getOrCreateDriveFolder('02_808s', rootFolderId, token),
      claps: await getOrCreateDriveFolder('03_Claps', rootFolderId, token),
      snares: await getOrCreateDriveFolder('04_Snares', rootFolderId, token),
      hihats: await getOrCreateDriveFolder('05_HiHats', rootFolderId, token),
      percs: await getOrCreateDriveFolder('06_Percs', rootFolderId, token)
    };

    const newSamples = [...samples];
    const rejections: Array<{ name: string; reason: string }> = [];
    let movedCount = 0;

    for (let i = 0; i < scannedFiles.length; i++) {
      const fileMeta = scannedFiles[i];
      setMigrationProgress({
        current: i + 1,
        total: scannedFiles.length,
        fileName: fileMeta.name
      });

      try {
        // Download blob into memory for acoustic analysis
        const blob = await downloadDriveFileAsBlob(fileMeta.id, token);
        const audioFile = new File([blob], fileMeta.name, { type: fileMeta.mimeType });

        // DSP analysis
        const { acoustic } = await analyzeOneShotAudio(audioFile);

        // Infer category from name or pitch
        const lowerName = fileMeta.name.toLowerCase();
        let targetCat: DrumOneShotCategory = 'kicks';
        if (lowerName.includes('808') || lowerName.includes('sub')) {
          targetCat = '808s';
        } else if (lowerName.includes('clap')) {
          targetCat = 'claps';
        } else if (lowerName.includes('snare') || lowerName.includes('rim')) {
          targetCat = 'snares';
        } else if (lowerName.includes('hat') || lowerName.includes('hh')) {
          targetCat = 'hihats';
        } else if (lowerName.includes('perc') || lowerName.includes('shaker') || lowerName.includes('tamb') || lowerName.includes('conga')) {
          targetCat = 'percs';
        }

        const destinationFolderId = categoryFolderMap[targetCat];

        // Native Move via Google Drive API: add destination folder, remove original source folder
        await moveDriveFile(fileMeta.id, fileMeta.originalParentId || detectedFolderId, destinationFolderId, token);

        // AI Harmonic Guidance
        const aiAnalysis = await getAiOneShotGuidance({
          fileName: fileMeta.name,
          category: targetCat,
          acoustic
        });

        const localBlobUrl = URL.createObjectURL(blob);

        const newVaultItem: SampleVaultItem = {
          id: `sample_drive_${fileMeta.id}`,
          name: fileMeta.name.replace(/\.[^/.]+$/, ''),
          category: targetCat,
          exactType: aiAnalysis.exactType,
          detectedKey: acoustic.detectedKey,
          fundamentalHz: acoustic.fundamentalHz,
          centsDetune: acoustic.centsDetune,
          durationSeconds: acoustic.durationSeconds,
          punchFrequencyHz: acoustic.punchFrequencyHz,
          attackMs: acoustic.attackMs,
          decayMs: acoustic.decayMs,
          peakDb: acoustic.peakDb,
          tags: aiAnalysis.tags,
          guidance: aiAnalysis.guidance,
          fileUrl: localBlobUrl,
          driveFileId: fileMeta.id,
          driveFolderId: destinationFolderId,
          uploadedAt: new Date().toISOString(),
          userEmail: currentUser?.email || 'coldestconcept@gmail.com'
        };

        newSamples.unshift(newVaultItem);
        movedCount++;
      } catch (itemErr: any) {
        console.error(`Error migrating ${fileMeta.name}:`, itemErr);
        rejections.push({
          name: fileMeta.name,
          reason: itemErr.message || 'Migration error'
        });
      }
    }

    setSamples(newSamples);
    setMigrationRejections(rejections);
    setIsMigratingDriveFolder(false);

    // Sync updated vault inventory back to Drive
    if (movedCount > 0) {
      await syncVaultIndexToDrive(newSamples, accessToken);
      setSuccessNotice(`Successfully moved and cataloged ${movedCount} one-shot(s) into your Drum Vault without taking extra space!`);
      // Clear scanned list
      setScannedFiles([]);
      setActiveTab('vault');
    }
  };

  const handleDeleteSample = async (sample: SampleVaultItem) => {
    if (!window.confirm(`Delete "${sample.name}" from your vault?`)) return;

    try {
      if (accessToken && sample.driveFileId) {
        await deleteSampleFromDrive(sample.driveFileId, accessToken);
      }
      const updated = samples.filter(s => s.id !== sample.id);
      setSamples(updated);
      if (accessToken) {
        await syncVaultIndexToDrive(updated, accessToken);
      }
      setSuccessNotice(`Deleted "${sample.name}".`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete sample.');
    }
  };

  const handlePlaySample = (sample: SampleVaultItem) => {
    if (playingSampleId === sample.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingSampleId(null);
      return;
    }

    if (sample.fileUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(sample.fileUrl);
      audioRef.current = audio;
      setPlayingSampleId(sample.id);
      audio.play().catch(e => console.warn('Playback failed:', e));
      audio.onended = () => setPlayingSampleId(null);
    }
  };

  // Simultaneous Dual Audition Player (Web Audio Engine)
  const handleDualAuditionPlay = async (pair: PairingSynergy) => {
    if (isDualPlaying) {
      activeSourcesRef.current.forEach(src => {
        try { src.stop(); } catch {}
      });
      activeSourcesRef.current = [];
      setIsDualPlaying(false);
      return;
    }

    try {
      if (!webAudioCtxRef.current || webAudioCtxRef.current.state === 'closed') {
        webAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = webAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const decodeUrlToBuffer = async (url?: string): Promise<AudioBuffer | null> => {
        if (!url) return null;
        const res = await fetch(url);
        const arrayBuf = await res.arrayBuffer();
        return await ctx.decodeAudioData(arrayBuf);
      };

      const [bufA, bufB] = await Promise.all([
        decodeUrlToBuffer(pair.sampleA.fileUrl),
        decodeUrlToBuffer(pair.sampleB.fileUrl)
      ]);

      if (!bufA || !bufB) {
        setErrorMessage('Could not load both audio buffers for dual audition.');
        return;
      }

      const now = ctx.currentTime + 0.05;
      const offsetSeconds = microOffsetMs / 1000;

      const sources: AudioBufferSourceNode[] = [];

      if (dualSoloMode === 'both' || dualSoloMode === 'sampleA') {
        const srcA = ctx.createBufferSource();
        srcA.buffer = bufA;
        const startTimeA = now + Math.max(0, -offsetSeconds);
        srcA.connect(ctx.destination);
        srcA.start(startTimeA);
        sources.push(srcA);
      }

      if (dualSoloMode === 'both' || dualSoloMode === 'sampleB') {
        const srcB = ctx.createBufferSource();
        srcB.buffer = bufB;
        const startTimeB = now + Math.max(0, offsetSeconds);
        srcB.connect(ctx.destination);
        srcB.start(startTimeB);
        sources.push(srcB);
      }

      activeSourcesRef.current = sources;
      setIsDualPlaying(true);

      const longestDuration = Math.max(bufA.duration, bufB.duration) + Math.abs(offsetSeconds);
      setTimeout(() => {
        setIsDualPlaying(false);
      }, longestDuration * 1000 + 100);
    } catch (err: any) {
      console.error('Dual audition failed:', err);
      setErrorMessage(`Audition playback failed: ${err.message || 'Web Audio error'}`);
      setIsDualPlaying(false);
    }
  };

  const handleCopyPairingRecipe = (pair: PairingSynergy) => {
    const text = `=== BEATGANGSTA INTELLIGENT DRUM PAIRING RECIPE ===
Element A (${pair.sampleA.category.toUpperCase()}): "${pair.sampleA.name}" [Key: ${pair.sampleA.detectedKey} (${pair.sampleA.fundamentalHz}Hz) | Punch: ${pair.sampleA.punchFrequencyHz}Hz]
Element B (${pair.sampleB.category.toUpperCase()}): "${pair.sampleB.name}" [Key: ${pair.sampleB.detectedKey} (${pair.sampleB.fundamentalHz}Hz) | Punch: ${pair.sampleB.punchFrequencyHz}Hz]

Synergy Score: ${pair.overallScore}% (${pair.overallScore >= 90 ? 'ELITE STACK' : 'SOLID MATCH'})
Harmonic Interval: ${pair.harmonicRelationship} (Tuning Offset: ${pair.tuningOffsetSemitones} semitones)
Frequency Pocket: ${pair.frequencyPocketAnalysis}
Envelope Dynamics: ${pair.envelopeAnalysis}
Recommended Micro-Nudge: ${pair.suggestedOffsetMs}ms

UAD SOFTWARE MIXING CHAIN:
Recommended Plugins: ${pair.uadSoftwareProcessing.recommendedPlugins.join(', ')}
EQ Pocketing Strategy: ${pair.uadSoftwareProcessing.eqPocketStrategy}
Dynamics / Sidechain: ${pair.uadSoftwareProcessing.dynamicsTip}
Why It Hits: ${pair.whyItHits}`;

    navigator.clipboard.writeText(text);
    setSuccessNotice(`Copied intelligent pairing recipe for "${pair.sampleA.name}" + "${pair.sampleB.name}" to clipboard!`);
  };

  const handleCopySampleProfile = (sample: SampleVaultItem) => {
    const text = `[VAULT SAMPLE: ${sample.name}]
Category: ${sample.category.toUpperCase()} | Exact Type: ${sample.exactType}
Key/Pitch: ${sample.detectedKey} (${sample.fundamentalHz} Hz, ${sample.centsDetune ? (sample.centsDetune > 0 ? '+' : '') + sample.centsDetune + '¢' : '0¢'})
Punch Frequency: ${sample.punchFrequencyHz} Hz | Duration: ${sample.durationSeconds}s | Decay: ${sample.decayMs}ms
Tags: ${sample.tags.join(', ')}
Mixing Advice: ${sample.guidance.mixingAdvice}
EQ Strategy: ${sample.guidance.eqNotes}
Recommended Plugins: ${sample.guidance.recommendedPlugins.join(', ')}
Pairing Tips: ${sample.guidance.pairingTips}`;

    navigator.clipboard.writeText(text);
    setSuccessNotice(`Copied "${sample.name}" profile to clipboard! Paste it into our chat for real-time guidance.`);
  };

  const handleExportFullVaultForChat = () => {
    if (samples.length === 0) {
      setErrorMessage('Vault is empty. Add samples first before exporting.');
      return;
    }

    const lines = [
      `=== BEATGANGSTA USER VAULT INVENTORY (${samples.length} Samples) ===`,
      `User: ${currentUser?.email || 'coldestconcept@gmail.com'}`,
      `Exported: ${new Date().toLocaleString()}`,
      ''
    ];

    samples.forEach((s, idx) => {
      lines.push(`${idx + 1}. [${s.category.toUpperCase()}] "${s.name}"`);
      lines.push(`   Type: ${s.exactType} | Key: ${s.detectedKey} (${s.fundamentalHz}Hz) | Punch: ${s.punchFrequencyHz || s.fundamentalHz}Hz | Duration: ${s.durationSeconds}s`);
      lines.push(`   Tags: ${s.tags.join(', ')}`);
      lines.push(`   EQ Carve: ${s.guidance.eqNotes}`);
      lines.push(`   Plugins: ${s.guidance.recommendedPlugins.join(', ')}`);
      lines.push('');
    });

    const fullExport = lines.join('\n');
    navigator.clipboard.writeText(fullExport);
    setSuccessNotice('Copied entire Vault inventory to clipboard! You can paste this right into our chat for personalized mix guidance.');
  };

  const filteredSamples = activeCategory === 'all' 
    ? samples 
    : samples.filter(s => s.category === activeCategory);

  const categoryCounts = {
    all: samples.length,
    kicks: samples.filter(s => s.category === 'kicks').length,
    '808s': samples.filter(s => s.category === '808s').length,
    claps: samples.filter(s => s.category === 'claps').length,
    snares: samples.filter(s => s.category === 'snares').length,
    hihats: samples.filter(s => s.category === 'hihats').length,
    percs: samples.filter(s => s.category === 'percs').length
  };

  return (
    <div 
      className="fixed inset-0 z-[220] flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-6xl h-[94vh] flex flex-col rounded-[2.5rem] border backdrop-blur-2xl overflow-hidden relative ${currentTheme.container}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className={`p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 ${currentTheme.headerBg}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${currentTheme.discBg}`}>
              <Disc className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-xl font-black tracking-wider uppercase ${currentTheme.titleGradient}`}>
                  BeatGangsta Drum Vault
                </h2>
                <span className={`text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full ${currentTheme.vipBadge}`}>
                  EXCLUSIVE VIP
                </span>
              </div>
              <p className={`text-xs ${currentTheme.subtitle}`}>
                AI Acoustic Classifier • Zero-Duplication Drive Mover • Intelligent Harmonic Matching • One-Shots Only
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthorized && (
              <button
                onClick={handleExportFullVaultForChat}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-md active:scale-95 ${currentTheme.exportBtn}`}
                title="Copy vault inventory so the assistant can guide you with your exact samples"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export for Chat</span>
              </button>
            )}

            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${currentTheme.closeBtn}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security / VIP Gate Check */}
        {!isAuthorized ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
            <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center mb-6 shadow-xl ${currentTheme.discBg}`}>
              <Lock className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-wider mb-2 text-white">
              Private Sound Vault
            </h3>
            <p className="text-sm opacity-80 mb-6 leading-relaxed">
              This feature is strictly reserved for <span className={`font-bold ${currentTheme.accentText}`}>coldestconcept@gmail.com</span> and <span className={`font-bold ${currentTheme.accentText}`}>recognizemiracles@gmail.com</span>. Please authenticate with your authorized Google Account to unlock your cloud-synced one-shot database.
            </p>

            <button
              onClick={handleGoogleAuth}
              disabled={isAuthenticating}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white text-gray-900 font-bold text-sm shadow-xl hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isAuthenticating ? 'Connecting to Google...' : 'Sign in with Authorized Google Account'}</span>
            </button>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
                {errorMessage}
              </div>
            )}
          </div>
        ) : (
          /* Main Authorized Vault Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation Mode Tabs */}
            <div className={`px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 ${currentTheme.navBg}`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('vault')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'vault'
                      ? currentTheme.tabVaultActive
                      : currentTheme.tabVaultInactive
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  <span>Vault Library ({samples.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('pairing');
                    if (!pairingFocusSample && samples.length > 0) {
                      setPairingFocusSample(samples[0]);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'pairing'
                      ? currentTheme.tabPairingActive
                      : currentTheme.tabPairingInactive
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>AI Intelligent Pairing (Game Changer)</span>
                </button>

                <button
                  onClick={() => setActiveTab('drive-import')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'drive-import'
                      ? currentTheme.tabDriveActive
                      : currentTheme.tabDriveInactive
                  }`}
                >
                  <FolderInput className="w-4 h-4" />
                  <span>Move from Drive Folder</span>
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden md:inline">{currentUser?.email}</span>
                </span>

                {accessToken ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="hidden sm:inline">Drive Connected</span>
                  </span>
                ) : (
                  <button
                    onClick={handleGoogleAuth}
                    disabled={isAuthenticating}
                    className="flex items-center gap-1.5 text-[11px] font-black text-amber-200 bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/60 px-3 py-1 rounded-full shadow-lg transition-all active:scale-95 animate-pulse"
                    title="Click to authorize Google Drive access"
                  >
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>{isAuthenticating ? 'Connecting...' : 'Authorize Drive'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (accessToken) {
                      loadFromDrive(accessToken);
                    } else {
                      handleGoogleAuth();
                    }
                  }}
                  disabled={isSyncingDrive}
                  className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${currentTheme.accentText} hover:opacity-80`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDrive ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
              </div>
            </div>

            {/* Notification Banners */}
            {errorMessage && (
              <div className="mx-6 mt-3 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5 min-w-0">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span className="font-mono break-all">{errorMessage}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {(!accessToken || errorMessage.toLowerCase().includes('token') || errorMessage.toLowerCase().includes('authoriz') || errorMessage.toLowerCase().includes('drive')) && (
                    <button
                      onClick={handleGoogleAuth}
                      disabled={isAuthenticating}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      <FolderInput className="w-3.5 h-3.5" />
                      <span>{isAuthenticating ? 'Connecting...' : 'Authorize Google Drive'}</span>
                    </button>
                  )}
                  <button onClick={() => setErrorMessage(null)} className="p-1 text-red-400 hover:text-white">✕</button>
                </div>
              </div>
            )}

            {successNotice && (
              <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>{successNotice}</span>
                </div>
                <button onClick={() => setSuccessNotice(null)} className="text-emerald-400 hover:text-white">✕</button>
              </div>
            )}

            {/* TAB 1: VAULT LIBRARY */}
            {activeTab === 'vault' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Drag & Drop Upload Zone */}
                <div className={`p-5 ${currentTheme.uploadBg}`}>
                  <div 
                    className={`relative border-2 border-dashed rounded-3xl p-5 transition-all text-center group cursor-pointer ${currentTheme.uploadDashed}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="audio/wav,audio/mp3,audio/aiff,audio/flac,audio/x-wav,audio/ogg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className={`p-2.5 rounded-2xl transition-colors ${currentTheme.uploadIcon}`}>
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:opacity-90 transition-colors">
                          Drop drum one-shots here or click to browse (.wav, .mp3, .aif)
                        </p>
                        <p className={`text-xs font-mono mt-0.5 opacity-80 ${currentTheme.subtitle}`}>
                          🚨 <strong className={currentTheme.uploadHighlight}>ONE-SHOTS ONLY:</strong> Max 3.0s duration • Automatic loop rejection & transient filtering.
                        </p>
                      </div>
                    </div>

                    {isAnalyzing && (
                      <div className="mt-3 p-2.5 rounded-2xl bg-black/80 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-center gap-2 animate-pulse">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                        <span className="font-mono">{analyzeStatus || 'Analyzing sample transients & tuning...'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className={`px-6 py-2.5 border-b border-black/20 flex items-center gap-2 overflow-x-auto scrollbar-none`}>
                  {(['all', 'kicks', '808s', 'claps', 'snares', 'hihats', 'percs'] as const).map((cat) => {
                    const count = categoryCounts[cat];
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 ${
                          isActive
                            ? currentTheme.catActive
                            : currentTheme.catInactive
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isActive ? currentTheme.catCountActive : currentTheme.catCountInactive}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Samples List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {filteredSamples.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center opacity-50">
                      <Disc className="w-12 h-12 mb-3 opacity-30" />
                      <p className="text-sm font-bold">No one-shots in this category yet.</p>
                      <p className="text-xs font-mono mt-1 opacity-60">
                        Drop your one-shots or use "Move from Drive Folder" to catalog your collection.
                      </p>
                    </div>
                  ) : (
                    filteredSamples.map((sample) => {
                      const isExpanded = expandedSampleId === sample.id;
                      const isPlaying = playingSampleId === sample.id;

                      return (
                        <div
                          key={sample.id}
                          className={`rounded-2xl border transition-all p-3.5 ${currentTheme.card}`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            {/* Play & Title */}
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <button
                                onClick={() => handlePlaySample(sample)}
                                className={`p-2.5 rounded-xl border transition-all ${
                                  isPlaying
                                    ? currentTheme.cardPlayActive
                                    : currentTheme.cardPlayInactive
                                }`}
                              >
                                {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                              </button>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-white tracking-wide">{sample.name}</h4>
                                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${currentTheme.badgeType}`}>
                                    {sample.exactType}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] opacity-70 font-mono mt-0.5">
                                  <span>{sample.durationSeconds}s</span>
                                  <span>•</span>
                                  <span>Attack: {sample.attackMs}ms</span>
                                  <span>•</span>
                                  <span>Decay: {sample.decayMs}ms</span>
                                  <span>•</span>
                                  <span>Peak: {sample.peakDb} dB</span>
                                </div>
                              </div>
                            </div>

                            {/* Pitch & Acoustic Badges */}
                            <div className="flex items-center gap-2">
                              <div className={`px-3 py-1 rounded-xl border text-center ${currentTheme.badgeKey}`}>
                                <span className="text-[9px] uppercase tracking-wider block opacity-70">Key / Pitch</span>
                                <span className="text-xs font-black">
                                  {sample.detectedKey} {sample.fundamentalHz > 0 ? `(${sample.fundamentalHz} Hz)` : ''}
                                </span>
                              </div>

                              {sample.punchFrequencyHz && (
                                <div className={`px-3 py-1 rounded-xl border text-center ${currentTheme.badgePunch}`}>
                                  <span className="text-[9px] uppercase tracking-wider block opacity-70">Punch Peak</span>
                                  <span className="text-xs font-black">
                                    {sample.punchFrequencyHz} Hz
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              {/* Intelligent Match Trigger */}
                              <button
                                onClick={() => {
                                  setPairingFocusSample(sample);
                                  setActiveTab('pairing');
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm active:scale-95 ${currentTheme.pairBtn}`}
                                title="Open Intelligent Pairing Matrix to find complementary 808/Kick/Clap stacks"
                              >
                                <Zap className="w-3.5 h-3.5 fill-current" />
                                <span>Pair</span>
                              </button>

                              <button
                                onClick={() => handleCopySampleProfile(sample)}
                                className={`p-2 rounded-xl border text-xs transition-colors ${currentTheme.guidanceBtn}`}
                                title="Copy sample profile to clipboard for chat guidance"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setExpandedSampleId(isExpanded ? null : sample.id)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${currentTheme.guidanceBtn}`}
                              >
                                <span>Guidance</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                onClick={() => handleDeleteSample(sample)}
                                className="p-2 rounded-xl hover:bg-red-950/60 text-red-400/70 hover:text-red-300 transition-colors"
                                title="Delete sample from vault & Drive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {sample.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${currentTheme.tag}`}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Expandable AI Guidance Drawer */}
                          {isExpanded && (
                            <div className={`mt-3 pt-3 rounded-xl p-3.5 space-y-2.5 animate-in fade-in duration-200 ${currentTheme.guidanceDrawer}`}>
                              <div>
                                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1 ${currentTheme.accentText}`}>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Mixing Advice & Plugin Recommendations</span>
                                </span>
                                <p className="text-xs opacity-90 leading-relaxed font-sans">
                                  {sample.guidance.mixingAdvice}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                <div className={`p-2.5 rounded-lg border ${currentTheme.guidanceCard}`}>
                                  <span className={`text-[10px] font-bold uppercase block mb-1 ${currentTheme.accentText}`}>
                                    EQ Strategy (Rap / Trap Pocket)
                                  </span>
                                  <p className="opacity-90 text-[11px] font-mono">
                                    {sample.guidance.eqNotes}
                                  </p>
                                </div>

                                <div className={`p-2.5 rounded-lg border ${currentTheme.guidanceCard}`}>
                                  <span className={`text-[10px] font-bold uppercase block mb-1 ${currentTheme.accentText}`}>
                                    Drum Bus Pairing Tips
                                  </span>
                                  <p className="opacity-90 text-[11px] font-mono">
                                    {sample.guidance.pairingTips}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className={`text-[10px] font-bold uppercase opacity-80 ${currentTheme.accentText}`}>
                                  Recommended Chain:
                                </span>
                                {sample.guidance.recommendedPlugins.map((plug, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${currentTheme.tag}`}
                                  >
                                    {plug}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: GAME-CHANGING AI INTELLIGENT PAIRING ENGINE */}
            {activeTab === 'pairing' && (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Column: Focus Sample Selector & Matches List */}
                <div className={`w-full md:w-5/12 border-r flex flex-col overflow-hidden ${currentTheme.pairingSideBg}`}>
                  <div className="p-4 border-b border-black/20 bg-black/40">
                    <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1.5 ${currentTheme.accentText}`}>
                      1. Select Anchor Sample
                    </label>
                    <select
                      value={pairingFocusSample?.id || ''}
                      onChange={(e) => {
                        const target = samples.find(s => s.id === e.target.value);
                        if (target) setPairingFocusSample(target);
                      }}
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none ${currentTheme.driveInput}`}
                    >
                      {samples.map((s) => (
                        <option key={s.id} value={s.id} className="bg-gray-900 text-white">
                          [{s.category.toUpperCase()}] {s.name} ({s.detectedKey} • {s.punchFrequencyHz || s.fundamentalHz}Hz)
                        </option>
                      ))}
                    </select>

                    {pairingFocusSample && (
                      <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between ${currentTheme.pairingAnchorCard}`}>
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest block opacity-80 ${currentTheme.accentText}`}>Active Anchor</span>
                          <h4 className="text-xs font-bold text-white">{pairingFocusSample.name}</h4>
                          <span className="text-[11px] font-mono opacity-90">
                            Key: {pairingFocusSample.detectedKey} | Punch: {pairingFocusSample.punchFrequencyHz || pairingFocusSample.fundamentalHz}Hz
                          </span>
                        </div>
                        <button
                          onClick={() => handlePlaySample(pairingFocusSample)}
                          className={`p-2 rounded-lg border ${currentTheme.pairBtn}`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Scored Complementary Matches */}
                  <div className="p-3 border-b border-black/20 flex items-center justify-between">
                    <span className={`text-xs font-bold ${currentTheme.accentText}`}>
                      ⚡ AI Ranked Stack Candidates ({topMatches.length})
                    </span>
                    <span className="text-[10px] font-mono opacity-60">Harmonic & Frequency Sorted</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {topMatches.length === 0 ? (
                      <div className="p-8 text-center opacity-50 text-xs">
                        Add more samples to your vault to generate intelligent pairs (e.g. Kick + 808, Snare + Clap).
                      </div>
                    ) : (
                      topMatches.map((pair, idx) => {
                        const isChosen = selectedMatch?.sampleB.id === pair.sampleB.id;
                        const isScoreElite = pair.overallScore >= 90;
                        const isScoreGood = pair.overallScore >= 75;

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedMatch(pair);
                              setMicroOffsetMs(pair.suggestedOffsetMs || 0);
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                              isChosen
                                ? currentTheme.pairingChosenCard
                                : currentTheme.pairingUnchosenCard
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-white truncate">
                                {pair.sampleB.name}
                              </span>
                              <span
                                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                  isScoreElite
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : isScoreGood
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                                }`}
                              >
                                {pair.overallScore}% MATCH
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono opacity-80">
                              <span>
                                [{pair.sampleB.category.toUpperCase()}] {pair.sampleB.detectedKey}
                              </span>
                              <span className={`font-bold ${currentTheme.accentText}`}>{pair.harmonicRelationship}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column: Deep Synergy Matrix & Live Dual Audition Player */}
                <div className="w-full md:w-7/12 flex flex-col overflow-y-auto p-5 space-y-4">
                  {selectedMatch ? (
                    <>
                      {/* Live Simultaneous Audition Player */}
                      <div className={`p-4 rounded-2xl border shadow-xl ${currentTheme.auditionPlayer}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className={`w-4 h-4 ${currentTheme.accentText}`} />
                            <h3 className={`text-sm font-black uppercase tracking-wider ${currentTheme.accentText}`}>
                              Simultaneous Dual Audition Engine
                            </h3>
                          </div>
                          <button
                            onClick={() => handleCopyPairingRecipe(selectedMatch)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${currentTheme.exportBtn}`}
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Pairing Recipe</span>
                          </button>
                        </div>

                        {/* Player Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-black/60 border border-black/30">
                          <button
                            onClick={() => handleDualAuditionPlay(selectedMatch)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg active:scale-95 ${
                              isDualPlaying
                                ? 'bg-red-500 text-white animate-pulse'
                                : currentTheme.auditionBtnPlay
                            }`}
                          >
                            {isDualPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                            <span>{isDualPlaying ? 'Stop Stack Audition' : 'Play Stack in Sync'}</span>
                          </button>

                          {/* Solo / Dual Toggles */}
                          <div className={`flex items-center gap-1 p-1 rounded-lg border text-[11px] font-bold ${currentTheme.soloBox}`}>
                            <button
                              onClick={() => setDualSoloMode('both')}
                              className={`px-2.5 py-1 rounded-md transition-colors ${
                                dualSoloMode === 'both' ? currentTheme.soloActiveBoth : currentTheme.soloInactive
                              }`}
                            >
                              Both Layered
                            </button>
                            <button
                              onClick={() => setDualSoloMode('sampleA')}
                              className={`px-2.5 py-1 rounded-md transition-colors ${
                                dualSoloMode === 'sampleA' ? currentTheme.soloActiveA : currentTheme.soloInactive
                              }`}
                            >
                              Solo {selectedMatch.sampleA.category}
                            </button>
                            <button
                              onClick={() => setDualSoloMode('sampleB')}
                              className={`px-2.5 py-1 rounded-md transition-colors ${
                                dualSoloMode === 'sampleB' ? currentTheme.soloActiveB : currentTheme.soloInactive
                              }`}
                            >
                              Solo {selectedMatch.sampleB.category}
                            </button>
                          </div>
                        </div>

                        {/* Micro-Offset Timing Slider */}
                        <div className="mt-3 p-3 rounded-xl bg-black/40 border border-black/20">
                          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                            <span className="opacity-90">
                              Micro-Nudge Transient Offset: <strong className={currentTheme.accentText}>{microOffsetMs > 0 ? `+${microOffsetMs}` : microOffsetMs} ms</strong>
                            </span>
                            <span className="text-[10px] opacity-60">
                              {microOffsetMs === 0 ? 'Locked on 0ms' : microOffsetMs > 0 ? `${selectedMatch.sampleB.category} delayed for width` : `${selectedMatch.sampleB.category} pre-shifted`}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="-30"
                            max="30"
                            step="1"
                            value={microOffsetMs}
                            onChange={(e) => setMicroOffsetMs(parseInt(e.target.value, 10))}
                            className={`w-full cursor-pointer ${currentTheme.sliderAccent}`}
                          />
                          <div className="flex justify-between text-[9px] font-mono opacity-50 mt-0.5">
                            <span>-30ms (Pre-Shift)</span>
                            <span>0ms (Sample Accurate)</span>
                            <span>+30ms (Slapback Delay)</span>
                          </div>
                        </div>
                      </div>

                      {/* Acoustic & Harmonic Breakdown Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className={`p-3 rounded-xl border ${currentTheme.boxCard}`}>
                          <span className={`text-[10px] font-bold uppercase block mb-1 ${currentTheme.accentText}`}>
                            Harmonic Alignment
                          </span>
                          <div className={`text-sm font-black ${currentTheme.accentText}`}>
                            {selectedMatch.harmonicRelationship}
                          </div>
                          <span className="text-[11px] font-mono opacity-80 block mt-1">
                            Score: {selectedMatch.harmonicScore}/100
                          </span>
                        </div>

                        <div className={`p-3 rounded-xl border ${currentTheme.boxCard}`}>
                          <span className={`text-[10px] font-bold uppercase block mb-1 ${currentTheme.accentText}`}>
                            Sub-Bass Pocket Gap
                          </span>
                          <div className="text-sm font-black text-emerald-300">
                            {selectedMatch.frequencyScore}/100 Clarity
                          </div>
                          <span className="text-[11px] font-mono opacity-80 block mt-1">
                            Zero Frequency Clash
                          </span>
                        </div>

                        <div className={`p-3 rounded-xl border ${currentTheme.boxCard}`}>
                          <span className={`text-[10px] font-bold uppercase block mb-1 ${currentTheme.accentText}`}>
                            Envelope Blend
                          </span>
                          <div className="text-sm font-black text-sky-300">
                            {selectedMatch.envelopeScore}/100 Synergy
                          </div>
                          <span className="text-[11px] font-mono opacity-80 block mt-1">
                            Attack & Decay Locked
                          </span>
                        </div>
                      </div>

                      {/* Frequency Analysis Card */}
                      <div className={`p-3.5 rounded-xl border ${currentTheme.boxCard}`}>
                        <span className={`text-xs font-bold uppercase flex items-center gap-1.5 mb-1 ${currentTheme.accentText}`}>
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Spectral Pocket Analysis</span>
                        </span>
                        <p className="text-xs font-sans leading-relaxed opacity-90">
                          {selectedMatch.frequencyPocketAnalysis}
                        </p>
                      </div>

                      {/* UAD Mixing Recipe (Strictly Software Controls) */}
                      <div className={`p-4 rounded-xl border space-y-2.5 ${currentTheme.uadBox}`}>
                        <span className={`text-xs font-black uppercase flex items-center gap-1.5 ${currentTheme.accentText}`}>
                          <Layers className="w-4 h-4" />
                          <span>UAD Software Mix Chain & Carving Strategy</span>
                        </span>

                        <div className={`text-xs font-mono leading-relaxed p-3 rounded-lg border ${currentTheme.uadCarve}`}>
                          <strong className={currentTheme.accentText}>EQ Carve:</strong> {selectedMatch.uadSoftwareProcessing.eqPocketStrategy}
                        </div>

                        <div className={`text-xs font-mono leading-relaxed p-3 rounded-lg border ${currentTheme.uadCarve}`}>
                          <strong className={currentTheme.accentText}>Dynamics & Sidechain:</strong> {selectedMatch.uadSoftwareProcessing.dynamicsTip}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className={`text-[10px] font-bold uppercase opacity-80 ${currentTheme.accentText}`}>
                            Plugins:
                          </span>
                          {selectedMatch.uadSoftwareProcessing.recommendedPlugins.map((plug, idx) => (
                            <span
                              key={idx}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${currentTheme.tag}`}
                            >
                              {plug}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-8">
                      <Zap className={`w-12 h-12 mb-3 opacity-30 ${currentTheme.accentText}`} />
                      <p className="text-sm font-bold text-white">Select a stack candidate on the left</p>
                      <p className="text-xs font-mono mt-1 opacity-70">
                        The engine will calculate acoustic pitch intervals, sub frequency masking, and provide the exact UAD software mixing moves.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: MOVE FROM GOOGLE DRIVE FOLDER */}
            {activeTab === 'drive-import' && (
              <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto space-y-6">
                <div className={`p-6 rounded-3xl border space-y-4 ${currentTheme.driveContainer}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border ${currentTheme.discBg}`}>
                      <FolderInput className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase text-white">
                        Move One-Shots from Google Drive Folder
                      </h3>
                      <p className={`text-xs font-mono opacity-80 ${currentTheme.subtitle}`}>
                        Zero-Duplication Native Move: Organizes files into your Vault without copying or consuming double storage quota.
                      </p>
                    </div>
                  </div>

                  {!accessToken && (
                    <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-wrap items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white uppercase tracking-wider">
                            Google Drive Authorization Required
                          </div>
                          <p className="text-[11px] font-mono text-amber-200/80 mt-0.5">
                            Connect your Google account so BeatGangsta can inspect your folder and move one-shots without duplicating space.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleGoogleAuth}
                        disabled={isAuthenticating}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs shadow-lg active:scale-95 disabled:opacity-50"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>{isAuthenticating ? 'Authorizing...' : 'Authorize Google Drive Now'}</span>
                      </button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase block ${currentTheme.accentText}`}>
                      Google Drive Folder Link or Folder ID
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={driveFolderInput}
                        onChange={(e) => setDriveFolderInput(e.target.value)}
                        placeholder="https://drive.google.com/drive/folders/1aBcDeFg... or Folder ID"
                        className={`flex-1 border rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none ${currentTheme.driveInput}`}
                      />
                      <button
                        onClick={handleScanDriveFolder}
                        disabled={isScanningFolder || isMigratingDriveFolder}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 disabled:opacity-50 ${currentTheme.driveBtn}`}
                      >
                        {isScanningFolder ? 'Scanning...' : 'Scan Folder'}
                      </button>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs leading-relaxed font-sans ${currentTheme.guidanceCard}`}>
                    💡 <strong>How Zero-Duplication Moving Works:</strong> This operation calls Google Drive's API to update the file's parent folder directly on Google's servers (`addParents` & `removeParents`). The audio data is not cloned or duplicated, so your Google Drive storage quota remains 100% free of duplicates!
                  </div>
                </div>

                {/* Scanned Files List & Move Action */}
                {scannedFiles.length > 0 && (
                  <div className={`p-6 rounded-3xl border space-y-4 ${currentTheme.driveContainer}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Discovered Audio Files ({scannedFiles.length})
                        </h4>
                        <p className={`text-xs font-mono opacity-80 ${currentTheme.subtitle}`}>
                          Ready for pitch analysis, loop rejection, and native folder move.
                        </p>
                      </div>

                      <button
                        onClick={handleMigrateAndMoveDriveFolder}
                        disabled={isMigratingDriveFolder}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs shadow-lg active:scale-95 disabled:opacity-50 ${currentTheme.driveBtnMove}`}
                      >
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                        <span>{isMigratingDriveFolder ? 'Moving & Analyzing...' : 'Start Zero-Duplication Move'}</span>
                      </button>
                    </div>

                    {isMigratingDriveFolder && (
                      <div className="p-4 rounded-xl bg-black/60 border border-amber-500/40 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                          <span>Progress: {migrationProgress.current} / {migrationProgress.total}</span>
                          <span className="truncate max-w-[250px]">{migrationProgress.fileName}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${currentTheme.progressBar}`}
                            style={{ width: `${(migrationProgress.current / migrationProgress.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {migrationRejections.length > 0 && (
                      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                        <span className="text-xs font-bold text-amber-300 block">
                          ⚠️ Guardrail Rejections (Kept in Original Folder):
                        </span>
                        <div className="max-h-36 overflow-y-auto space-y-1 text-xs font-mono text-amber-200/80">
                          {migrationRejections.map((rej, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="truncate max-w-[300px]">{rej.name}</span>
                              <span className="text-amber-400/90 text-[10px]">{rej.reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                      {scannedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-black/30 text-xs font-mono"
                        >
                          <span className="text-white truncate max-w-[350px]">{file.name}</span>
                          <span className="opacity-60 text-[11px]">{file.mimeType}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
