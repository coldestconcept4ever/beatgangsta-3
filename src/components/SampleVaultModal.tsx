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
  Sliders,
  Archive,
  FileQuestion,
  HelpCircle,
  Search,
  Grid,
  List,
  Compass,
  Music,
  Volume2,
  VolumeX,
  RotateCcw,
  Heart,
  Star,
  ArrowRight,
  SlidersHorizontal,
  Wand2,
  ZoomIn,
  ZoomOut,
  Pause
} from 'lucide-react';
import { AppTheme, SampleVaultItem, DrumOneShotCategory, VSTPlugin, Hardware } from '../types';
import { USER_GEAR_PRESET_PLUGINS } from '../data/userGearSeed';
import { 
  isAuthorizedForVault, 
  googleSignIn, 
  getAccessToken 
} from '../lib/firebaseAuth';
import { 
  analyzeOneShotAudio, 
  getAiOneShotGuidance, 
  generateStudioDspResearch,
  batchEnrichWithAi,
  uploadSampleToDrive, 
  syncVaultIndexToDrive, 
  fetchVaultIndexFromDrive, 
  deleteSampleFromDrive,
  extractDriveFolderId,
  listFilesInDriveFolder,
  unpackZipFromDrive,
  moveDriveFile,
  downloadDriveFileAsBlob,
  getOrCreateDriveFolder,
  inferCosmosCategory,
  DriveAudioFileMeta,
  DriveFolderScanReport
} from '../services/sampleVaultService';
import {
  findTopComplementaryMatches,
  PairingSynergy
} from '../utils/intelligentDrumPairing';
import {
  SIGNATURE_BEAT_STYLES,
  StylePreset,
  MatchedBeatKit,
  matchBeatKitFromVault
} from '../utils/songKitMatcher';

interface SampleVaultModalProps {
  theme: AppTheme;
  user: any;
  userPlugins?: VSTPlugin[];
  analogHardware?: Hardware[];
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

export const COSMOS_CATEGORIES: { id: DrumOneShotCategory | 'all'; label: string; color: string; badgeBg: string; ringColor: string }[] = [
  { id: 'all', label: 'All One-Shots', color: '#38bdf8', badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40', ringColor: 'ring-sky-400' },
  { id: 'kicks', label: 'Kicks', color: '#06b6d4', badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', ringColor: 'ring-cyan-400' },
  { id: '808s', label: '808s & Sub', color: '#8b5cf6', badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', ringColor: 'ring-purple-400' },
  { id: 'snares', label: 'Snares', color: '#ef4444', badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40', ringColor: 'ring-red-400' },
  { id: 'claps', label: 'Claps', color: '#f59e0b', badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', ringColor: 'ring-amber-400' },
  { id: 'closed_hats', label: 'Closed Hats', color: '#10b981', badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', ringColor: 'ring-emerald-400' },
  { id: 'open_hats', label: 'Open Hats', color: '#14b8a6', badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40', ringColor: 'ring-teal-400' },
  { id: 'cymbals', label: 'Cymbals', color: '#ec4899', badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40', ringColor: 'ring-pink-400' },
  { id: 'percs', label: 'Percs', color: '#f97316', badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40', ringColor: 'ring-orange-400' },
  { id: 'toms', label: 'Toms', color: '#6366f1', badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', ringColor: 'ring-indigo-400' },
  { id: 'vox', label: 'Vox', color: '#3b82f6', badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', ringColor: 'ring-blue-400' },
  { id: 'fx', label: 'FX', color: '#eab308', badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', ringColor: 'ring-yellow-400' },
];

export const MUSICAL_KEYS = ['all', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const COSMOS_TAG_PILLS = [
  'dry', 'electronic', 'hit', 'Drums', 'acoustic', 'drum', 'clean', 'bright', 'Cymbals', 'punchy', 'warm', 'dark'
];

export function isSampleLoop(sample: SampleVaultItem): boolean {
  const nameLower = (sample.name || '').toLowerCase();
  if (nameLower.includes('loop') || nameLower.includes('bpm')) return true;
  if (sample.durationSeconds && sample.durationSeconds >= 2.0) return true;
  return false;
}

export function getSampleCosmosTags(sample: SampleVaultItem): string[] {
  const tags: string[] = [];
  const catNames: Record<string, string> = {
    kicks: 'Kick',
    '808s': '808 / Sub',
    snares: 'Snare',
    claps: 'Clap',
    closed_hats: 'Hi-Hat',
    open_hats: 'Hi-Hat',
    hihats: 'Hi-Hat',
    cymbals: 'Cymbal',
    percs: 'Percussion',
    toms: 'Tom',
    vox: 'Vocal',
    fx: 'FX'
  };
  tags.push(catNames[sample.category] || 'Drum');

  // Character
  if (sample.category === '808s' || sample.category === 'fx' || (sample.dynamicsScore && sample.dynamicsScore > 65)) {
    tags.push('electronic');
  } else {
    tags.push('acoustic');
  }

  // Space
  if ((sample.decayMs && sample.decayMs < 160) || (sample.spaceScore && sample.spaceScore < 25)) {
    tags.push('dry');
  } else {
    tags.push('wet');
  }

  // Timbre / Brightness
  if ((sample.brightnessScore && sample.brightnessScore > 60) || (sample.spectralCentroidHz && sample.spectralCentroidHz > 3000)) {
    tags.push('bright');
  } else if ((sample.brightnessScore && sample.brightnessScore < 35) || (sample.spectralCentroidHz && sample.spectralCentroidHz < 900)) {
    tags.push('dark');
  } else {
    tags.push('clean');
  }

  // Type (hit vs loop)
  if (isSampleLoop(sample)) {
    tags.push('loop');
  } else {
    tags.push('hit');
  }

  // Specific acoustic attributes
  if (sample.category === 'closed_hats') tags.push('tight');
  if (sample.category === 'open_hats') tags.push('sizzle');
  if (sample.punchFrequencyHz && sample.punchFrequencyHz > 1000) tags.push('metallic');
  if (sample.decayMs && sample.decayMs > 1200) tags.push('sustain');

  return tags;
}

export function generateWaveformBars(seed: string, isPlaying: boolean) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const heights = [20, 45, 75, 90, 80, 60, 40, 55, 70, 50, 35, 25, 18, 12];
  return (
    <div className="flex items-center gap-[1.5px] h-4">
      {heights.map((h, i) => {
        const offset = Math.abs((hash >> (i % 8)) % 25);
        const barHeight = Math.max(15, Math.min(100, h + offset - 10));
        return (
          <div
            key={i}
            className={`w-[2px] rounded-full transition-all ${
              isPlaying ? 'bg-sky-400 animate-pulse' : 'bg-gray-500'
            }`}
            style={{ height: `${barHeight}%` }}
          />
        );
      })}
    </div>
  );
}

export const DEFAULT_COSMOS_FACTORY_SAMPLES: SampleVaultItem[] = [
  {
    id: 's_wadigi0058',
    name: 'WA DigiBits 0058',
    category: 'kicks',
    exactType: 'Kick (Electronic Dry Punch)',
    detectedKey: 'C',
    fundamentalHz: 55,
    durationSeconds: 0.28,
    punchFrequencyHz: 58,
    attackMs: 3.5,
    decayMs: 120,
    peakDb: -0.2,
    brightnessScore: 42,
    spaceScore: 18,
    dynamicsScore: 84,
    spectralCentroidHz: 780,
    isFavorite: false,
    tags: ['Kick', 'electronic', 'dry', 'hit', 'punchy'],
    guidance: {
      mixingAdvice: 'Punchy digital sub-kick with rapid 3.5ms attack and 120ms tight decay. Preserves maximum headroom.',
      eqNotes: 'High-pass at 28Hz on Pultec EQP-1A, boost 60Hz +2dB for tight chest thud.',
      recommendedPlugins: ['UAD Pultec EQP-1A', 'UAD 1176LN Classic Limiter'],
      pairingTips: 'Pairs seamlessly with sustained 808s or acoustic wooden snares.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_wametalperc85',
    name: 'WA MetalPerc 85BPM',
    category: 'percs',
    exactType: 'Percussion Loop (Metallic Bright)',
    detectedKey: 'A',
    fundamentalHz: 440,
    durationSeconds: 2.82,
    punchFrequencyHz: 1250,
    attackMs: 6.0,
    decayMs: 340,
    peakDb: -1.5,
    brightnessScore: 85,
    spaceScore: 35,
    dynamicsScore: 72,
    spectralCentroidHz: 3400,
    isFavorite: true,
    tags: ['Percussion', 'acoustic', 'bright', 'clean', 'metallic', 'percussive', 'loop'],
    guidance: {
      mixingAdvice: 'Swung metallic groove loop. Use gentle tape saturation to tame upper sizzle.',
      eqNotes: 'Dip 2.8kHz by -1.5dB on Neve 1073 to remove harsh resonant ring.',
      recommendedPlugins: ['UAD Studer A800', 'UAD Neve 1073'],
      pairingTips: 'Lays behind dry claps and tight closed hi-hats.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_waorganic05',
    name: 'WA OrganicPercussion 05',
    category: 'percs',
    exactType: 'Percussion One-Shot (Woody Tap)',
    detectedKey: 'G',
    fundamentalHz: 392,
    durationSeconds: 0.38,
    punchFrequencyHz: 480,
    attackMs: 4.2,
    decayMs: 145,
    peakDb: -2.1,
    brightnessScore: 62,
    spaceScore: 15,
    dynamicsScore: 78,
    spectralCentroidHz: 1650,
    isFavorite: false,
    tags: ['Percussion', 'organic', 'dry', 'percussive', 'hit'],
    guidance: {
      mixingAdvice: 'Dry acoustic wood chop with zero tail. Cuts through dense trap mixes.',
      eqNotes: 'Boost 1.8kHz presence on API 550A.',
      recommendedPlugins: ['UAD API 2500', 'UAD API 550A'],
      pairingTips: 'Syncopate on 16th ghost steps between snare hits.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_wabasspicked',
    name: 'WA Bass Guitar Picked E0',
    category: '808s',
    exactType: 'Bass Guitar / Sub (Electric Monophonic)',
    detectedKey: 'E',
    fundamentalHz: 41,
    durationSeconds: 1.45,
    punchFrequencyHz: 82,
    attackMs: 8.5,
    decayMs: 950,
    peakDb: -0.5,
    brightnessScore: 32,
    spaceScore: 45,
    dynamicsScore: 68,
    spectralCentroidHz: 420,
    isFavorite: false,
    tags: ['Bass Guitar', 'dark', 'monophonic', 'dry', 'electric', 'plucked'],
    guidance: {
      mixingAdvice: 'Warm plucked electric bass note with deep fundamental.',
      eqNotes: 'Shelf boost 60Hz on Neve 1073, roll off above 5kHz.',
      recommendedPlugins: ['UAD Teletronix LA-2A', 'UAD Neve 1073'],
      pairingTips: 'Carve kick punch pocket at 60Hz to avoid masking.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_waksploopy',
    name: 'WA KS Ploopy Hit Emin',
    category: 'fx',
    exactType: 'Pluck Synthesizer (Punchy Wet)',
    detectedKey: 'Emin',
    fundamentalHz: 330,
    durationSeconds: 0.65,
    punchFrequencyHz: 650,
    attackMs: 5.0,
    decayMs: 380,
    peakDb: -1.0,
    brightnessScore: 74,
    spaceScore: 62,
    dynamicsScore: 70,
    spectralCentroidHz: 2400,
    isFavorite: false,
    tags: ['Pluck', 'electronic', 'punchy', 'wet', 'plucked', 'hit'],
    guidance: {
      mixingAdvice: 'Spacey synth chirp. Adds modern ear candy to verse turnarounds.',
      eqNotes: 'High-pass 200Hz to prevent low-end mud.',
      recommendedPlugins: ['UAD Lexicon 224', 'UAD Cambridge EQ'],
      pairingTips: 'Scatter on 4th beat transition drops.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_waflute87',
    name: 'WA Flute 87BPM 01 Gmin',
    category: 'vox',
    exactType: 'Flute Loop (Acoustic Monophonic)',
    detectedKey: 'Gmin',
    fundamentalHz: 392,
    durationSeconds: 2.76,
    punchFrequencyHz: 784,
    attackMs: 12.0,
    decayMs: 1100,
    peakDb: -1.8,
    brightnessScore: 58,
    spaceScore: 55,
    dynamicsScore: 64,
    spectralCentroidHz: 1850,
    isFavorite: false,
    tags: ['Flute', 'acoustic', 'clean', 'monophonic', 'woodwind', 'loop'],
    guidance: {
      mixingAdvice: 'Airy woodwind riff. Use smooth optical compression.',
      eqNotes: 'Dip 4kHz breath whistle with narrow Q on Cambridge EQ.',
      recommendedPlugins: ['UAD Teletronix LA-2A', 'UAD Cambridge EQ'],
      pairingTips: 'Layers above deep 808s and crisp hi-hats.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_wasynthchords',
    name: 'WA Synth Chords 01 Amin',
    category: 'fx',
    exactType: 'Pad Progression (Polyphonic Wet)',
    detectedKey: 'Amin',
    fundamentalHz: 220,
    durationSeconds: 3.20,
    punchFrequencyHz: 440,
    attackMs: 25.0,
    decayMs: 1800,
    peakDb: -2.4,
    brightnessScore: 50,
    spaceScore: 82,
    dynamicsScore: 52,
    spectralCentroidHz: 1400,
    isFavorite: false,
    tags: ['Pad', 'clean', 'electronic', 'polyphonic', 'wet', 'sustain', 'loop'],
    guidance: {
      mixingAdvice: 'Submerged ambient chord texture with lush chorus.',
      eqNotes: 'Sidechain compress against kick with 1176LN for pumping groove.',
      recommendedPlugins: ['UAD 1176LN', 'UAD EMT 140 Plate Reverb'],
      pairingTips: 'Forms the emotional bed of the track.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_wasaxloop80',
    name: 'WA SaxLoop 80BPM 01 Amin',
    category: 'vox',
    exactType: 'Saxophone Loop (Lo-Fi Vintage)',
    detectedKey: 'Amin',
    fundamentalHz: 220,
    durationSeconds: 3.00,
    punchFrequencyHz: 520,
    attackMs: 14.0,
    decayMs: 950,
    peakDb: -1.2,
    brightnessScore: 48,
    spaceScore: 42,
    dynamicsScore: 70,
    spectralCentroidHz: 1300,
    isFavorite: false,
    tags: ['Saxophone', 'acoustic', 'clean', 'lo-fi', 'monophonic', 'vinyl', 'loop'],
    guidance: {
      mixingAdvice: 'Vintage horn phrasing saturated through tape.',
      eqNotes: 'High-pass at 150Hz, boost 10kHz shelf for retro vinyl air.',
      recommendedPlugins: ['UAD Studer A800', 'UAD Pultec EQP-1A'],
      pairingTips: 'Pairs with boom-bap swing drums.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_wabassspoken',
    name: 'WA Bass Sub Heavy',
    category: '808s',
    exactType: '808 Sub Kick (Clean Dry Drop)',
    detectedKey: 'F',
    fundamentalHz: 43.6,
    durationSeconds: 1.85,
    punchFrequencyHz: 52,
    attackMs: 4.0,
    decayMs: 1600,
    peakDb: -0.1,
    brightnessScore: 24,
    spaceScore: 30,
    dynamicsScore: 88,
    spectralCentroidHz: 310,
    isFavorite: false,
    tags: ['808 / Sub', 'spoken', 'clean', 'dry', 'electronic', 'sub', 'hit'],
    guidance: {
      mixingAdvice: 'Pure sinusoidal 808 fundamental with zero rumble.',
      eqNotes: 'Notch 180Hz if clashing with snare body resonance.',
      recommendedPlugins: ['UAD Pultec EQP-1A', 'UAD 1176LN'],
      pairingTips: 'Locks with 55Hz kick with 5ms pre-delay.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_wabritishindie',
    name: 'WA BritishIndieRock 100BPM 01',
    category: 'kicks',
    exactType: 'Drum Groove Loop (Acoustic Punch)',
    detectedKey: 'C',
    fundamentalHz: 130,
    durationSeconds: 2.40,
    punchFrequencyHz: 90,
    attackMs: 8.0,
    decayMs: 650,
    peakDb: -0.8,
    brightnessScore: 66,
    spaceScore: 50,
    dynamicsScore: 76,
    spectralCentroidHz: 2100,
    isFavorite: false,
    tags: ['Drums', 'acoustic', 'vintage', 'punchy', 'loop'],
    guidance: {
      mixingAdvice: 'Punchy live drum kit loop recorded through vintage tube consoles.',
      eqNotes: 'Boost 100Hz and 10kHz on Neve 1073.',
      recommendedPlugins: ['UAD Neve 1073', 'UAD SSL 4000 G Bus'],
      pairingTips: 'Chop the first hit for an instant live kick.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_wametroclosed',
    name: 'WA Metro Closed Hat Tight',
    category: 'closed_hats',
    exactType: 'Closed Hi-Hat (Tight Rapid Decay)',
    detectedKey: 'F#',
    fundamentalHz: 680,
    durationSeconds: 0.18,
    punchFrequencyHz: 4200,
    attackMs: 1.5,
    decayMs: 55,
    peakDb: -1.4,
    brightnessScore: 92,
    spaceScore: 8,
    dynamicsScore: 86,
    spectralCentroidHz: 5200,
    isFavorite: true,
    tags: ['Hi-Hat', 'closed', 'tight', 'dry', 'bright', 'fast attack', 'hit'],
    guidance: {
      mixingAdvice: 'Laser-fast closed hat with 55ms decay. Perfect for rapid 32nd-note trap rolls without phase blur.',
      eqNotes: 'High-pass 500Hz on Pultec EQP-1A, boost 12kHz shelf +2dB for sparkle.',
      recommendedPlugins: ['UAD Pultec EQP-1A', 'UAD 1176LN'],
      pairingTips: 'Pair with 90s Open Hat Sizzle on the offbeats.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_wa90sopen',
    name: 'WA 90s Open Hat Sizzle 02',
    category: 'open_hats',
    exactType: 'Open Hi-Hat (Sustained Shimmer)',
    detectedKey: 'A#',
    fundamentalHz: 520,
    durationSeconds: 0.85,
    punchFrequencyHz: 3800,
    attackMs: 2.5,
    decayMs: 380,
    peakDb: -1.0,
    brightnessScore: 88,
    spaceScore: 60,
    dynamicsScore: 74,
    spectralCentroidHz: 4600,
    isFavorite: false,
    tags: ['Hi-Hat', 'open', 'sizzle', 'bright', 'metallic', 'sustain', 'hit'],
    guidance: {
      mixingAdvice: 'Sizzling open hi-hat with 380ms sustain. High spectral centroid at 4.6kHz delivers pure metallic air.',
      eqNotes: 'High-pass at 400Hz to keep sub clear.',
      recommendedPlugins: ['UAD Cambridge EQ', 'UAD Studer A800'],
      pairingTips: 'Choke automatically when the next closed hat triggers.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_watrapcrack',
    name: 'WA Trap Snare Pure Crack',
    category: 'snares',
    exactType: 'Snare (Mid-Crack Transient)',
    detectedKey: 'D',
    fundamentalHz: 210,
    durationSeconds: 0.35,
    punchFrequencyHz: 220,
    attackMs: 2.8,
    decayMs: 220,
    peakDb: -0.3,
    brightnessScore: 70,
    spaceScore: 28,
    dynamicsScore: 90,
    spectralCentroidHz: 2800,
    isFavorite: true,
    tags: ['Snare', 'electronic', 'punchy', 'crack', 'dry', 'hit'],
    guidance: {
      mixingAdvice: 'Snappy snare crack centered at 210Hz body resonance with snappy noise wire tail.',
      eqNotes: 'Boost 220Hz +2dB for chest snap on Neve 1073.',
      recommendedPlugins: ['UAD Neve 1073', 'UAD Empirical Labs Distressor'],
      pairingTips: 'Stack with WA Studio Handclap for full stereo width.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  },
  {
    id: 's_wastudioclap',
    name: 'WA Studio Handclap Dry',
    category: 'claps',
    exactType: 'Handclap (Stereo Multi-Burst)',
    detectedKey: 'G',
    fundamentalHz: 350,
    durationSeconds: 0.32,
    punchFrequencyHz: 1100,
    attackMs: 5.5,
    decayMs: 190,
    peakDb: -0.6,
    brightnessScore: 76,
    spaceScore: 22,
    dynamicsScore: 82,
    spectralCentroidHz: 3200,
    isFavorite: false,
    tags: ['Clap', 'acoustic', 'dry', 'layered', 'bright', 'hit'],
    guidance: {
      mixingAdvice: 'Triple-burst transient handclap. 100% dry and ultra-punchy.',
      eqNotes: 'Shelf boost 10kHz +3dB on API 550A.',
      recommendedPlugins: ['UAD API 2500', 'UAD API 550A'],
      pairingTips: 'Nudge 12ms ahead of snare for maximum perceived impact.'
    },
    uploadedAt: new Date().toISOString(),
    userEmail: 'coldestconcept@gmail.com'
  }
];

export function getKitSlotList(slots?: MatchedBeatKit['slots']): Array<{
  trackKey: string;
  role: string;
  sample: SampleVaultItem;
  matchScore: number;
  reason: string;
  patternKey: keyof StylePreset['pattern'];
  uadChain: string[];
}> {
  if (!slots) return [];
  const list = [];
  if (slots.kick) list.push({ trackKey: 'kick', role: 'Kick', sample: slots.kick.sample, matchScore: slots.kick.matchScore, reason: slots.kick.reason, patternKey: 'kick' as const, uadChain: slots.kick.uadChain });
  if (slots.bass) list.push({ trackKey: 'bass', role: '808 / Sub', sample: slots.bass.sample, matchScore: slots.bass.matchScore, reason: slots.bass.reason, patternKey: 'bass' as const, uadChain: slots.bass.uadChain });
  if (slots.snareClap) list.push({ trackKey: 'snareClap', role: 'Snare / Clap', sample: slots.snareClap.sample, matchScore: slots.snareClap.matchScore, reason: slots.snareClap.reason, patternKey: 'snare' as const, uadChain: slots.snareClap.uadChain });
  if (slots.closedHat) list.push({ trackKey: 'closedHat', role: 'Closed Hat', sample: slots.closedHat.sample, matchScore: slots.closedHat.matchScore, reason: slots.closedHat.reason, patternKey: 'closedHat' as const, uadChain: slots.closedHat.uadChain });
  if (slots.openHat) list.push({ trackKey: 'openHat', role: 'Open Hat', sample: slots.openHat.sample, matchScore: slots.openHat.matchScore, reason: slots.openHat.reason, patternKey: 'openHat' as const, uadChain: slots.openHat.uadChain });
  if (slots.perc) list.push({ trackKey: 'perc', role: 'Percussion / Chop', sample: slots.perc.sample, matchScore: slots.perc.matchScore, reason: slots.perc.reason, patternKey: 'perc' as const, uadChain: slots.perc.uadChain });
  return list;
}

export const SampleVaultModal: React.FC<SampleVaultModalProps> = ({
  theme,
  user,
  userPlugins,
  analogHardware,
  onClose,
  onUpdateUser
}) => {
  const currentTheme = vaultThemeStyles[theme] || vaultThemeStyles['hustle-time'];
  const [currentUser, setCurrentUser] = useState<any>(user);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active Gear Rack plugins (from props, localStorage, or user's Studio One seed)
  const activeGearRackPlugins = React.useMemo<VSTPlugin[]>(() => {
    if (userPlugins && userPlugins.length > 0) return userPlugins;
    try {
      const saved = localStorage.getItem('bg_library');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    // If local library is empty, seed it with the user's Studio One pluginmanagement suite
    try {
      localStorage.setItem('bg_library', JSON.stringify(USER_GEAR_PRESET_PLUGINS));
    } catch {}
    return USER_GEAR_PRESET_PLUGINS;
  }, [userPlugins]);
  
  // Tabs: 'vault' (Cosmos Browser & Galaxy) | 'song-matcher' (AI Song Matcher & Groove Player) | 'pairing' (Dual Layer Stacking) | 'drive-import'
  const [activeTab, setActiveTab] = useState<'vault' | 'song-matcher' | 'pairing' | 'drive-import'>('vault');
  const [activeCategory, setActiveCategory] = useState<DrumOneShotCategory | 'all'>('all');
  
  // Cosmos View Modes: 'list' (Active in Waves screenshot), 'grid' (Waveform Cards), 'map' (Galaxy Map)
  const [cosmosViewMode, setCosmosViewMode] = useState<'list' | 'grid' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [keyFilter, setKeyFilter] = useState<string>('all');
  const [selectedCosmosSample, setSelectedCosmosSample] = useState<SampleVaultItem | null>(null);
  const [hoveredCosmosSample, setHoveredCosmosSample] = useState<SampleVaultItem | null>(null);
  const [cosmosZoom, setCosmosZoom] = useState<number>(1);

  // Waves COSMOS Quick Filters & Dropdowns
  const [filterOneShotOnly, setFilterOneShotOnly] = useState<boolean>(false);
  const [filterLoopOnly, setFilterLoopOnly] = useState<boolean>(false);
  const [filterFavoriteOnly, setFilterFavoriteOnly] = useState<boolean>(false);
  const [selectedTagPills, setSelectedTagPills] = useState<string[]>([]);
  const [isInstrumentsOpen, setIsInstrumentsOpen] = useState<boolean>(false);
  const [isTagsOpen, setIsTagsOpen] = useState<boolean>(false);
  const [isKeyBpmOpen, setIsKeyBpmOpen] = useState<boolean>(false);
  const [isVolumeOpen, setIsVolumeOpen] = useState<boolean>(false);
  const [auditionVolume, setAuditionVolume] = useState<number>(0.85);
  const [sidebarTab, setSidebarTab] = useState<'samples' | 'folders'>('samples');
  const [folderToggles, setFolderToggles] = useState<Record<string, boolean>>({
    'local_all': true,
    'waves_factory': true,
    'intrigger_factory': true,
    'colby_samples': true,
    'drive_vault': true,
    'kicks': true,
    '808s': true,
    'snares': true,
    'claps': true,
    'closed_hats': true,
    'open_hats': true,
    'cymbals': true,
    'percs': true,
    'toms': true,
    'vox': true,
    'fx': true
  });

  // AI Reference Song Beat Kit Matcher State
  const [selectedStylePreset, setSelectedStylePreset] = useState<StylePreset>(SIGNATURE_BEAT_STYLES[0]);
  const [customSongInput, setCustomSongInput] = useState<string>('');
  const [matchedKit, setMatchedKit] = useState<MatchedBeatKit | null>(null);
  const [isMatchingKit, setIsMatchingKit] = useState<boolean>(false);
  const [grooveBpm, setGrooveBpm] = useState<number>(SIGNATURE_BEAT_STYLES[0].defaultBpm);
  const [isPlayingGroove, setIsPlayingGroove] = useState<boolean>(false);
  const [currentGrooveStep, setCurrentGrooveStep] = useState<number>(0);
  const [grooveTrackMutes, setGrooveTrackMutes] = useState<Record<string, boolean>>({});
  const [grooveTrackSolos, setGrooveTrackSolos] = useState<Record<string, boolean>>({});
  const [grooveVolumes, setGrooveVolumes] = useState<Record<string, number>>({});

  const grooveTimerRef = useRef<number | null>(null);
  const grooveStepRef = useRef<number>(0);
  const sampleAudioBufferCache = useRef<Map<string, AudioBuffer>>(new Map());

  const [samples, setSamples] = useState<SampleVaultItem[]>(() => {
    try {
      const saved = localStorage.getItem('bg_sample_vault_items');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed && parsed.length > 0 ? parsed : DEFAULT_COSMOS_FACTORY_SAMPLES;
    } catch {
      return DEFAULT_COSMOS_FACTORY_SAMPLES;
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
  const [scannedZipFiles, setScannedZipFiles] = useState<Array<{ id: string; name: string; size?: number; mimeType: string }>>([]);
  const [scannedNonAudio, setScannedNonAudio] = useState<Array<{ id: string; name: string; mimeType: string }>>([]);
  const [detectedFolderId, setDetectedFolderId] = useState<string | null>(null);
  const [detectedFolderName, setDetectedFolderName] = useState<string | null>(null);
  const [totalScannedFolders, setTotalScannedFolders] = useState<number>(1);
  const [showNonAudioFiles, setShowNonAudioFiles] = useState<boolean>(false);
  const [isUnpackingZip, setIsUnpackingZip] = useState<boolean>(false);
  const [unpackProgress, setUnpackProgress] = useState<{ current: number; total: number; fileName: string }>({
    current: 0,
    total: 0,
    fileName: ''
  });
  const [isMigratingDriveFolder, setIsMigratingDriveFolder] = useState<boolean>(false);
  const [migrationMode, setMigrationMode] = useState<'fast_studio_dsp' | 'studio_live_ai'>('fast_studio_dsp');
  const [isMigrationPaused, setIsMigrationPaused] = useState<boolean>(false);
  const isMigrationPausedRef = useRef<boolean>(false);
  const [migrationProgress, setMigrationProgress] = useState<{ current: number; total: number; fileName: string }>({
    current: 0,
    total: 0,
    fileName: ''
  });
  const [migrationRejections, setMigrationRejections] = useState<Array<{ name: string; reason: string }>>([]);

  // AI Batch Enrichment State (Reduces AI token consumption by 95% and never loses progress)
  const [isAutoEnrichingAi, setIsAutoEnrichingAi] = useState<boolean>(false);
  const isAutoEnrichPausedRef = useRef<boolean>(false);
  const [aiEnrichProgress, setAiEnrichProgress] = useState<{
    current: number;
    total: number;
    statusText: string;
    countdownSeconds?: number;
  }>({
    current: 0,
    total: 0,
    statusText: ''
  });

  // Intelligent Pairing Matrix State
  const [pairingFocusSample, setPairingFocusSample] = useState<SampleVaultItem | null>(null);
  const [topMatches, setTopMatches] = useState<PairingSynergy[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<PairingSynergy | null>(null);
  const [microOffsetMs, setMicroOffsetMs] = useState<number>(0);
  const [isDualPlaying, setIsDualPlaying] = useState<boolean>(false);
  const [dualSoloMode, setDualSoloMode] = useState<'both' | 'sampleA' | 'sampleB'>('both');
  const webAudioCtxRef = useRef<AudioContext | null>(null);
  const activeSourcesRef = useRef<(AudioBufferSourceNode | OscillatorNode)[]>([]);

  // Persistent storage auto-guard: never lose progress or downgrade samples
  useEffect(() => {
    if (samples && samples.length > 0) {
      try {
        localStorage.setItem('bg_sample_vault_items', JSON.stringify(samples));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
    }
  }, [samples]);

  // Auto-generate initial kit match when samples load
  useEffect(() => {
    if (samples.length > 0 && !matchedKit) {
      const initial = matchBeatKitFromVault(selectedStylePreset, samples, undefined, selectedStylePreset.defaultBpm);
      setMatchedKit(initial);
      setGrooveBpm(initial.inferredBpm || initial.style.defaultBpm);
    }
  }, [samples]);

  // Real-time 16-Step Web Audio Groove Sequencer
  useEffect(() => {
    if (!isPlayingGroove || !matchedKit) {
      if (grooveTimerRef.current) {
        clearInterval(grooveTimerRef.current);
        grooveTimerRef.current = null;
      }
      return;
    }

    if (!webAudioCtxRef.current || webAudioCtxRef.current.state === 'closed') {
      webAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = webAudioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const slotList = getKitSlotList(matchedKit.slots);

    // Pre-cache buffers for the kit slots
    slotList.forEach(item => {
      if (item.sample.fileUrl && !sampleAudioBufferCache.current.has(item.sample.id)) {
        fetch(item.sample.fileUrl)
          .then(r => r.arrayBuffer())
          .then(ab => ctx.decodeAudioData(ab))
          .then(buf => sampleAudioBufferCache.current.set(item.sample.id, buf))
          .catch(e => console.warn('Could not decode groove slot audio:', e));
      }
    });

    const stepInterval = (60000 / grooveBpm) / 4; // 16th note step in ms
    const hasAnySolo = Object.values(grooveTrackSolos).some(Boolean);

    grooveTimerRef.current = window.setInterval(() => {
      const step = grooveStepRef.current;
      setCurrentGrooveStep(step);

      const now = ctx.currentTime;

      slotList.forEach(item => {
        const isTrackSolo = grooveTrackSolos[item.trackKey];
        const isTrackMuted = grooveTrackMutes[item.trackKey];
        const isAudible = hasAnySolo ? isTrackSolo : !isTrackMuted;
        const patternArr = matchedKit.style.pattern[item.patternKey] || [];

        if (isAudible && patternArr[step] === 1) {
          const buf = sampleAudioBufferCache.current.get(item.sample.id);
          if (buf) {
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const gainNode = ctx.createGain();
            const vol = grooveVolumes[item.trackKey] !== undefined ? grooveVolumes[item.trackKey] : 0.85;
            gainNode.gain.setValueAtTime(vol, now);
            src.connect(gainNode);
            gainNode.connect(ctx.destination);
            src.start(now);
          } else if (item.sample.fileUrl) {
            const snd = new Audio(item.sample.fileUrl);
            snd.volume = grooveVolumes[item.trackKey] !== undefined ? grooveVolumes[item.trackKey] : 0.85;
            snd.play().catch(() => {});
          }
        }
      });

      grooveStepRef.current = (step + 1) % 16;
    }, stepInterval);

    return () => {
      if (grooveTimerRef.current) {
        clearInterval(grooveTimerRef.current);
        grooveTimerRef.current = null;
      }
    };
  }, [isPlayingGroove, matchedKit, grooveBpm, grooveTrackMutes, grooveTrackSolos, grooveVolumes]);

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

  const getSafeAiGuidance = async (
    fileName: string,
    category: DrumOneShotCategory,
    acoustic: any
  ) => {
    try {
      return await getAiOneShotGuidance({
        fileName,
        category,
        acoustic
      });
    } catch (e: any) {
      console.warn(`[AI-GUIDANCE-FALLBACK] DSP profile used for "${fileName}":`, e?.message);
      const catUpper = category.toUpperCase().slice(0, -1);
      return {
        exactType: `${catUpper} (${acoustic.detectedKey || 'Atonal'}) - ${acoustic.punchFrequencyHz || 100}Hz Punch`,
        tags: [category, acoustic.detectedKey || 'Atonal', 'One-Shot', 'BeatGangsta Vault', acoustic.attackMs < 8 ? 'Fast Attack' : 'Punchy'],
        guidance: {
          mixingAdvice: `Punchy one-shot with ${acoustic.attackMs}ms attack and ${acoustic.decayMs}ms decay. Preserve transient punch with UAD 1176LN Classic Limiter (Attack 4, Release 7).`,
          eqNotes: category === '808s' 
            ? `High-pass below 25Hz on UAD Pultec EQP-1A to clear sub rumble. Fundamental sits at ${acoustic.fundamentalHz}Hz.` 
            : `High-pass below 30Hz on UAD Pultec EQP-1A. Boost transient presence at 3.5kHz.`,
          recommendedPlugins: ['UAD Pultec EQP-1A', 'UAD 1176LN Classic Limiter', 'UAD Cambridge EQ'],
          pairingTips: category === 'kicks' 
            ? `Pair with an 808 tuned to ${acoustic.detectedKey} with a pocket carved around ${acoustic.punchFrequencyHz}Hz.` 
            : `Pair with a complementary element with separated punch frequency.`
        }
      };
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
        const category = inferCosmosCategory(file.name, acoustic);

        setAnalyzeStatus(`[${i + 1}/${fileList.length}] Generating key & pocket guidance for "${file.name}"...`);
        const aiAnalysis = await getSafeAiGuidance(file.name, category, acoustic);

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
          spectralCentroidHz: acoustic.spectralCentroidHz,
          brightnessScore: acoustic.brightnessScore,
          dynamicsScore: acoustic.dynamicsScore,
          spaceScore: acoustic.spaceScore,
          isFavorite: false,
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
    setScannedZipFiles([]);
    setScannedNonAudio([]);
    setDetectedFolderId(folderId);

    try {
      const report: DriveFolderScanReport = await listFilesInDriveFolder(folderId, token);
      setDetectedFolderId(report.folderId);
      setDetectedFolderName(report.folderName);
      setTotalScannedFolders(report.totalScannedFolders);
      setScannedFiles(report.audioFiles);
      setScannedZipFiles(report.zipFiles);
      setScannedNonAudio(report.nonAudioFiles);

      if (report.audioFiles.length > 0) {
        setSuccessNotice(
          `Discovered ${report.audioFiles.length} audio file(s) across ${report.totalScannedFolders} folder(s) in "${report.folderName}" ready for zero-duplication move!`
        );
      } else if (report.zipFiles.length > 0) {
        setSuccessNotice(
          `Found ${report.zipFiles.length} drum kit zip archive(s) in "${report.folderName}". Click "Unpack & Import" below to extract your one-shots!`
        );
      } else if (report.nonAudioFiles.length > 0) {
        setErrorMessage(
          `Found ${report.nonAudioFiles.length} file(s) in "${report.folderName}", but their file extensions or MIME types were not recognized as audio (.wav, .mp3, .aif, .flac). Click "Treat & Import All as Audio" below if they are audio files without standard extensions.`
        );
      } else {
        setErrorMessage(
          `Google Drive returned 0 items for folder "${report.folderName}". Please ensure this folder has "Anyone with the link can view" enabled in Google Drive sharing settings, or that your Google account has view permission.`
        );
      }
    } catch (err: any) {
      setErrorMessage(`Folder scan failed: ${err.message || 'Make sure folder is shared or accessible'}`);
    } finally {
      setIsScanningFolder(false);
    }
  };

  const handleTreatNonAudioAsAudio = () => {
    if (scannedNonAudio.length === 0) return;
    const converted: DriveAudioFileMeta[] = scannedNonAudio.map(f => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType || 'audio/wav',
      originalParentId: detectedFolderId || undefined
    }));
    setScannedFiles(prev => [...prev, ...converted]);
    setScannedNonAudio([]);
    setSuccessNotice(`Queued ${converted.length} discovered file(s) for audio one-shot analysis & moving.`);
  };

  const handleUnpackZipAndImport = async (zipMeta: { id: string; name: string }) => {
    let token = accessToken;
    if (!token) token = await getAccessToken();
    if (!token) {
      setErrorMessage('Google Drive access token missing. Please authorize Google Drive first.');
      return;
    }

    setIsUnpackingZip(true);
    setErrorMessage(null);
    setSuccessNotice(null);
    setUnpackProgress({ current: 0, total: 0, fileName: `Downloading "${zipMeta.name}" from Drive...` });

    try {
      const extractedFiles = await unpackZipFromDrive(zipMeta.id, token, (curr, tot, name) => {
        setUnpackProgress({ current: curr, total: tot, fileName: `Extracting ${name} (${curr}/${tot})...` });
      });

      if (extractedFiles.length === 0) {
        throw new Error(`No audio files (.wav, .mp3, .aif, .flac) found inside archive "${zipMeta.name}".`);
      }

      setUnpackProgress({ current: 0, total: extractedFiles.length, fileName: 'Analyzing extracted one-shots...' });

      let addedCount = 0;
      const currentSamples = [...samples];

      for (let i = 0; i < extractedFiles.length; i++) {
        const item = extractedFiles[i];
        setUnpackProgress({
          current: i + 1,
          total: extractedFiles.length,
          fileName: `[${i + 1}/${extractedFiles.length}] DSP pitch & harmonic analysis on "${item.name}"...`
        });

        try {
          const audioFile = new File([item.blob], item.name, { type: item.mimeType });
          const { acoustic } = await analyzeOneShotAudio(audioFile);

          const cat: DrumOneShotCategory = inferCosmosCategory(item.name, acoustic);

          const aiAnalysis = await getSafeAiGuidance(item.name, cat, acoustic);

          const localBlobUrl = URL.createObjectURL(item.blob);

          const newVaultItem: SampleVaultItem = {
            id: `sample_zip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: item.name.replace(/\.[^/.]+$/, ''),
            category: cat,
            exactType: aiAnalysis.exactType,
            detectedKey: acoustic.detectedKey,
            fundamentalHz: acoustic.fundamentalHz,
            centsDetune: acoustic.centsDetune,
            durationSeconds: acoustic.durationSeconds,
            punchFrequencyHz: acoustic.punchFrequencyHz,
            attackMs: acoustic.attackMs,
            decayMs: acoustic.decayMs,
            peakDb: acoustic.peakDb,
            spectralCentroidHz: acoustic.spectralCentroidHz,
            brightnessScore: acoustic.brightnessScore,
            dynamicsScore: acoustic.dynamicsScore,
            spaceScore: acoustic.spaceScore,
            isFavorite: false,
            tags: aiAnalysis.tags,
            guidance: aiAnalysis.guidance,
            fileUrl: localBlobUrl,
            uploadedAt: new Date().toISOString(),
            userEmail: currentUser?.email || 'coldestconcept@gmail.com'
          };

          if (token) {
            try {
              const driveUpload = await uploadSampleToDrive(audioFile, cat, newVaultItem, token);
              newVaultItem.driveFileId = driveUpload.fileId;
              newVaultItem.driveFolderId = driveUpload.folderId;
            } catch (upErr) {
              console.warn('Zip file drive upload fallback:', upErr);
            }
          }

          currentSamples.unshift(newVaultItem);
          addedCount++;
        } catch (itemErr: any) {
          console.warn(`Skipped item ${item.name}:`, itemErr.message);
        }
      }

      setSamples(currentSamples);
      if (token && addedCount > 0) {
        await syncVaultIndexToDrive(currentSamples, token);
      }

      setSuccessNotice(`Successfully extracted, analyzed, and added ${addedCount} one-shot(s) from "${zipMeta.name}"!`);
      // Remove this zip from scanned list
      setScannedZipFiles(prev => prev.filter(z => z.id !== zipMeta.id));
    } catch (err: any) {
      setErrorMessage(`Zip extraction failed: ${err.message || 'Error processing archive'}`);
    } finally {
      setIsUnpackingZip(false);
      setUnpackProgress({ current: 0, total: 0, fileName: '' });
    }
  };

  // Google Drive Folder Migration: Step 2 Native Move & Resumable Zero-Token Full Studio Research
  const handlePauseMigration = () => {
    isMigrationPausedRef.current = true;
    setIsMigrationPaused(true);
  };

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

    isMigrationPausedRef.current = false;
    setIsMigrationPaused(false);
    setIsMigratingDriveFolder(true);
    setErrorMessage(null);
    setSuccessNotice(null);
    setMigrationRejections([]);

    // Checkpoint & Deduplication: Gather all Drive IDs already cataloged in the Vault
    const existingDriveIds = new Set(samples.map(s => s.driveFileId).filter(Boolean));
    let savedManifestIds = new Set<string>();
    try {
      const manifestStr = localStorage.getItem('bg_vault_migration_manifest');
      if (manifestStr) {
        const manifestObj = JSON.parse(manifestStr);
        if (Array.isArray(manifestObj.completedFileIds)) {
          savedManifestIds = new Set(manifestObj.completedFileIds);
        }
      }
    } catch {}

    // Filter to only pending files that haven't been migrated yet
    const pendingFiles = scannedFiles.filter(f => !existingDriveIds.has(f.id) && !savedManifestIds.has(f.id));
    const alreadyDoneCount = scannedFiles.length - pendingFiles.length;

    if (pendingFiles.length === 0) {
      setIsMigratingDriveFolder(false);
      setSuccessNotice(`All ${scannedFiles.length} file(s) in this folder are already cataloged and stored in your Drum Vault! No repeat work needed.`);
      return;
    }

    const rootFolderId = await getOrCreateDriveFolder('Beatgangsta Sample Vault', undefined, token);
    const categoryFolderMap: Record<DrumOneShotCategory, string> = {
      kicks: await getOrCreateDriveFolder('01_Kicks', rootFolderId, token),
      '808s': await getOrCreateDriveFolder('02_808s', rootFolderId, token),
      claps: await getOrCreateDriveFolder('03_Claps', rootFolderId, token),
      snares: await getOrCreateDriveFolder('04_Snares', rootFolderId, token),
      closed_hats: await getOrCreateDriveFolder('05_ClosedHats', rootFolderId, token),
      open_hats: await getOrCreateDriveFolder('06_OpenHats', rootFolderId, token),
      cymbals: await getOrCreateDriveFolder('07_Cymbals', rootFolderId, token),
      percs: await getOrCreateDriveFolder('08_Percs', rootFolderId, token),
      toms: await getOrCreateDriveFolder('09_Toms', rootFolderId, token),
      vox: await getOrCreateDriveFolder('10_Vox', rootFolderId, token),
      fx: await getOrCreateDriveFolder('11_FX', rootFolderId, token),
      hihats: await getOrCreateDriveFolder('05_ClosedHats', rootFolderId, token)
    };

    let newSamples = [...samples];
    const rejections: Array<{ name: string; reason: string }> = [];
    const completedIds = new Set([...existingDriveIds, ...savedManifestIds]);
    let movedInThisRun = 0;

    for (let i = 0; i < pendingFiles.length; i++) {
      if (isMigrationPausedRef.current) {
        setSuccessNotice(`Migration paused at ${alreadyDoneCount + movedInThisRun} of ${scannedFiles.length} files. All moved files are 100% saved in your Vault! Click Resume anytime.`);
        break;
      }

      const fileMeta = pendingFiles[i];
      setMigrationProgress({
        current: alreadyDoneCount + movedInThisRun + 1,
        total: scannedFiles.length,
        fileName: fileMeta.name
      });

      try {
        // Download blob into memory for acoustic analysis
        const blob = await downloadDriveFileAsBlob(fileMeta.id, token);
        const audioFile = new File([blob], fileMeta.name, { type: fileMeta.mimeType });

        // Accurate Web Audio DSP analysis (fundamental Hz, key, crest, attack, decay, centroid)
        const { acoustic } = await analyzeOneShotAudio(audioFile);

        // Acoustic + Name intelligent categorization (Waves COSMOS standard, distinguishing open vs closed hats)
        const targetCat: DrumOneShotCategory = inferCosmosCategory(fileMeta.name, acoustic);
        const destinationFolderId = categoryFolderMap[targetCat];

        // Native Zero-Duplication Move via Google Drive API
        await moveDriveFile(fileMeta.id, fileMeta.originalParentId || detectedFolderId, destinationFolderId, token);

        // Complete Studio Research: Full UAD Mixing moves, EQ, and tags (0 tokens used, instant)
        const studioResearch = migrationMode === 'studio_live_ai'
          ? await getAiOneShotGuidance({ fileName: fileMeta.name, category: targetCat, acoustic })
          : generateStudioDspResearch(fileMeta.name, targetCat, acoustic);

        const localBlobUrl = URL.createObjectURL(blob);

        const newVaultItem: SampleVaultItem = {
          id: `sample_drive_${fileMeta.id}`,
          name: fileMeta.name.replace(/\.[^/.]+$/, ''),
          category: targetCat,
          exactType: studioResearch.exactType,
          detectedKey: acoustic.detectedKey,
          fundamentalHz: acoustic.fundamentalHz,
          centsDetune: acoustic.centsDetune,
          durationSeconds: acoustic.durationSeconds,
          punchFrequencyHz: acoustic.punchFrequencyHz,
          attackMs: acoustic.attackMs,
          decayMs: acoustic.decayMs,
          peakDb: acoustic.peakDb,
          spectralCentroidHz: acoustic.spectralCentroidHz,
          brightnessScore: acoustic.brightnessScore,
          dynamicsScore: acoustic.dynamicsScore,
          spaceScore: acoustic.spaceScore,
          isFavorite: false,
          tags: studioResearch.tags,
          guidance: studioResearch.guidance,
          researchStatus: studioResearch.researchStatus || 'full_studio_dsp',
          researchSource: studioResearch.researchSource || 'dsp_matrix',
          fileUrl: localBlobUrl,
          driveFileId: fileMeta.id,
          driveFolderId: destinationFolderId,
          uploadedAt: new Date().toISOString(),
          userEmail: currentUser?.email || 'coldestconcept@gmail.com'
        };

        newSamples.unshift(newVaultItem);
        completedIds.add(fileMeta.id);
        movedInThisRun++;

        // Incremental auto-save every 5 items so work is NEVER lost if closed or refreshed
        if (movedInThisRun % 5 === 0) {
          setSamples([...newSamples]);
          try {
            localStorage.setItem('bg_sample_vault_items', JSON.stringify(newSamples));
            localStorage.setItem('bg_vault_migration_manifest', JSON.stringify({
              sourceFolderId: detectedFolderId,
              completedFileIds: Array.from(completedIds),
              lastUpdated: new Date().toISOString()
            }));
          } catch {}
        }

        // Periodic flush to Google Drive index every 25 items
        if (movedInThisRun % 25 === 0) {
          syncVaultIndexToDrive(newSamples, token).catch(e => console.warn('Periodic sync to Drive failed:', e));
        }
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

    // Save final manifest to localStorage
    try {
      localStorage.setItem('bg_sample_vault_items', JSON.stringify(newSamples));
      localStorage.setItem('bg_vault_migration_manifest', JSON.stringify({
        sourceFolderId: detectedFolderId,
        completedFileIds: Array.from(completedIds),
        lastUpdated: new Date().toISOString()
      }));
    } catch {}

    // Sync updated vault inventory back to Drive
    if (movedInThisRun > 0) {
      await syncVaultIndexToDrive(newSamples, token);
      if (!isMigrationPausedRef.current) {
        setSuccessNotice(`Successfully moved and cataloged ${movedInThisRun} one-shot(s) into your Drum Vault! All samples have full Studio DSP & UAD recipes.`);
        setActiveTab('vault');
      }
    }
  };

  // Background Gemini AI Batch Auto-Enricher (Processes 15 at a time, saving 95% tokens)
  const handleAutoEnrichWithAi = async () => {
    let token = accessToken;
    if (!token) token = await getAccessToken();

    const pendingSamples = samples.filter(s => s.researchStatus !== 'ai_enhanced');
    if (pendingSamples.length === 0) {
      setSuccessNotice('All samples in your Vault are already fully AI-Enhanced!');
      return;
    }

    isAutoEnrichPausedRef.current = false;
    setIsAutoEnrichingAi(true);
    setErrorMessage(null);

    const BATCH_SIZE = 15;
    const totalPending = pendingSamples.length;
    let enrichedCount = 0;
    let updatedSamples = [...samples];

    for (let i = 0; i < totalPending; i += BATCH_SIZE) {
      if (isAutoEnrichPausedRef.current) {
        setSuccessNotice(`AI enrichment paused. ${enrichedCount} samples enriched. You can resume anytime!`);
        break;
      }

      const chunk = pendingSamples.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(totalPending / BATCH_SIZE);

      setAiEnrichProgress({
        current: enrichedCount,
        total: totalPending,
        statusText: `Enriching batch ${batchNum} of ${totalBatches} (${chunk.length} one-shots)...`
      });

      const batchPayload = chunk.map(s => ({
        id: s.id,
        fileName: s.name,
        category: s.category,
        detectedKey: s.detectedKey,
        fundamentalHz: s.fundamentalHz,
        punchFrequencyHz: s.punchFrequencyHz || s.fundamentalHz || 100,
        attackMs: s.attackMs,
        decayMs: s.decayMs,
        peakDb: s.peakDb
      }));

      const res = await batchEnrichWithAi(batchPayload);

      if (res.rateLimited) {
        // Handle Gemini 429 quota exhaustion gracefully without losing or corrupting anything
        setAiEnrichProgress(prev => ({
          ...prev,
          statusText: `Gemini token quota limit detected. Pausing auto-enrichment. All progress is safely saved!`
        }));
        setSuccessNotice(`Gemini quota limit reached. Paused at ${enrichedCount} enriched samples. All samples remain 100% functional with Full Studio DSP. Resume when quota refreshes!`);
        break;
      }

      if (res.success && res.results.length > 0) {
        const resultMap = new Map(res.results.map(r => [r.id, r]));

        updatedSamples = updatedSamples.map(sample => {
          const aiRes = resultMap.get(sample.id);
          if (aiRes) {
            return {
              ...sample,
              exactType: aiRes.exactType || sample.exactType,
              tags: Array.from(new Set([...sample.tags, ...(aiRes.tags || [])])),
              guidance: {
                ...sample.guidance,
                mixingAdvice: aiRes.guidance?.mixingAdvice || sample.guidance.mixingAdvice,
                pairingTips: aiRes.guidance?.pairingTips || sample.guidance.pairingTips,
                eqNotes: aiRes.guidance?.eqNotes || sample.guidance.eqNotes,
                recommendedPlugins: aiRes.guidance?.recommendedPlugins || sample.guidance.recommendedPlugins
              },
              researchStatus: 'ai_enhanced' as const,
              researchSource: 'gemini_batch' as const
            };
          }
          return sample;
        });

        enrichedCount += res.results.length;
        setSamples(updatedSamples);

        // Immediate persistence
        try {
          localStorage.setItem('bg_sample_vault_items', JSON.stringify(updatedSamples));
        } catch {}

        if (token && enrichedCount % 30 === 0) {
          syncVaultIndexToDrive(updatedSamples, token).catch(() => {});
        }
      }

      // Small 3-second throttle between batches to avoid 429 token limits
      if (i + BATCH_SIZE < totalPending && !isAutoEnrichPausedRef.current) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setIsAutoEnrichingAi(false);
    if (enrichedCount > 0 && token) {
      await syncVaultIndexToDrive(updatedSamples, token);
      setSuccessNotice(`Enriched ${enrichedCount} sample(s) with AI signature notes! All progress saved.`);
    }
  };

  const handlePauseAiEnrichment = () => {
    isAutoEnrichPausedRef.current = true;
    setIsAutoEnrichingAi(false);
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

  const handlePlaySample = async (sample: SampleVaultItem) => {
    // If already playing this sample, toggle stop
    if (playingSampleId === sample.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (activeSourcesRef.current.length > 0) {
        activeSourcesRef.current.forEach(s => {
          try { s.stop(); } catch {}
        });
        activeSourcesRef.current = [];
      }
      setPlayingSampleId(null);
      return;
    }

    // Stop any other currently playing sample immediately
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (activeSourcesRef.current.length > 0) {
      activeSourcesRef.current.forEach(s => {
        try { s.stop(); } catch {}
      });
      activeSourcesRef.current = [];
    }

    setPlayingSampleId(sample.id);

    try {
      // 0. Ensure Web Audio Context is initialized and resumed synchronously within user gesture
      if (!webAudioCtxRef.current || webAudioCtxRef.current.state === 'closed') {
        webAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = webAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Helper: High-fidelity Web Audio DSP Synthesizer
      // Produces an acoustic, audible one-shot customized to the sample's category, pitch, punch, and envelope
      const playDpsFallback = () => {
        try {
          const now = ctx.currentTime;
          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(Math.max(0.2, auditionVolume), now);
          masterGain.connect(ctx.destination);

          const decaySec = Math.max(0.08, Math.min(2.5, (sample.decayMs || 150) / 1000));
          const punch = sample.punchFrequencyHz || sample.fundamentalHz || 100;
          const fund = sample.fundamentalHz || punch;

          const createdSources: (AudioBufferSourceNode | OscillatorNode)[] = [];

          if (sample.category === '808s') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(fund + 15, now);
            osc.frequency.exponentialRampToValueAtTime(Math.max(30, fund), now + 0.04);

            gain.gain.setValueAtTime(0.95, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + decaySec);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + decaySec);
            createdSources.push(osc);
          } else if (sample.category === 'kicks') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(Math.max(140, punch * 2.2), now);
            osc.frequency.exponentialRampToValueAtTime(punch, now + 0.035);
            osc.frequency.exponentialRampToValueAtTime(35, now + decaySec);

            gain.gain.setValueAtTime(1.0, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + decaySec);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + decaySec);
            createdSources.push(osc);

            // Transient snap
            const clickOsc = ctx.createOscillator();
            const clickGain = ctx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(750, now);
            clickGain.gain.setValueAtTime(0.5, now);
            clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
            clickOsc.connect(clickGain);
            clickGain.connect(masterGain);
            clickOsc.start(now);
            clickOsc.stop(now + 0.02);
            createdSources.push(clickOsc);
          } else if (sample.category === 'snares') {
            const toneOsc = ctx.createOscillator();
            const toneGain = ctx.createGain();
            toneOsc.type = 'triangle';
            toneOsc.frequency.setValueAtTime(punch, now);
            toneOsc.frequency.exponentialRampToValueAtTime(punch * 0.75, now + 0.1);
            toneGain.gain.setValueAtTime(0.7, now);
            toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
            toneOsc.connect(toneGain);
            toneGain.connect(masterGain);
            toneOsc.start(now);
            toneOsc.stop(now + 0.15);
            createdSources.push(toneOsc);

            // White noise body
            const bufferSize = Math.floor(ctx.sampleRate * Math.min(0.4, decaySec));
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(1000, now);
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.85, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + decaySec);
            whiteNoise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(masterGain);
            whiteNoise.start(now);
            whiteNoise.stop(now + decaySec);
            createdSources.push(whiteNoise);
          } else if (sample.category === 'claps') {
            [0, 0.011, 0.024].forEach((flamOffset, idx) => {
              const flamLen = idx === 2 ? decaySec : 0.015;
              const bufSize = Math.floor(ctx.sampleRate * flamLen);
              const nBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
              const out = nBuf.getChannelData(0);
              for (let i = 0; i < bufSize; i++) out[i] = Math.random() * 2 - 1;
              const src = ctx.createBufferSource();
              src.buffer = nBuf;
              const band = ctx.createBiquadFilter();
              band.type = 'bandpass';
              band.frequency.setValueAtTime(1200, now + flamOffset);
              band.Q.setValueAtTime(1.5, now + flamOffset);
              const g = ctx.createGain();
              g.gain.setValueAtTime(idx === 2 ? 0.9 : 0.5, now + flamOffset);
              g.gain.exponentialRampToValueAtTime(0.0001, now + flamOffset + flamLen);
              src.connect(band);
              band.connect(g);
              g.connect(masterGain);
              src.start(now + flamOffset);
              src.stop(now + flamOffset + flamLen);
              createdSources.push(src);
            });
          } else if (sample.category === 'closed_hats' || sample.category === 'open_hats' || sample.category === 'cymbals') {
            const hatLen = sample.category === 'closed_hats' ? Math.min(0.12, decaySec) : Math.max(0.4, decaySec);
            const bufSize = Math.floor(ctx.sampleRate * hatLen);
            const nBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
            const out = nBuf.getChannelData(0);
            for (let i = 0; i < bufSize; i++) out[i] = Math.random() * 2 - 1;
            const src = ctx.createBufferSource();
            src.buffer = nBuf;
            const hp = ctx.createBiquadFilter();
            hp.type = 'highpass';
            hp.frequency.setValueAtTime(sample.spectralCentroidHz ? Math.max(3500, sample.spectralCentroidHz * 0.7) : 6500, now);
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.8, now);
            g.gain.exponentialRampToValueAtTime(0.0001, now + hatLen);
            src.connect(hp);
            hp.connect(g);
            g.connect(masterGain);
            src.start(now);
            src.stop(now + hatLen);
            createdSources.push(src);
          } else {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = sample.category === 'toms' ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(punch, now);
            osc.frequency.exponentialRampToValueAtTime(Math.max(40, punch * 0.7), now + decaySec);
            gain.gain.setValueAtTime(0.85, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + decaySec);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + decaySec);
            createdSources.push(osc);
          }

          activeSourcesRef.current = createdSources;

          setTimeout(() => {
            setPlayingSampleId(prev => prev === sample.id ? null : prev);
          }, decaySec * 1000 + 50);
        } catch (synthErr) {
          console.error('DSP Synth failed:', synthErr);
          setPlayingSampleId(null);
        }
      };

      // 1. Try real audio decoding if sample.fileUrl is present
      if (sample.fileUrl) {
        try {
          const res = await fetch(sample.fileUrl);
          if (res.ok) {
            const arrayBuf = await res.arrayBuffer();
            const decodedBuf = await ctx.decodeAudioData(arrayBuf);
            if (decodedBuf) {
              const srcNode = ctx.createBufferSource();
              srcNode.buffer = decodedBuf;
              const gainNode = ctx.createGain();
              gainNode.gain.setValueAtTime(auditionVolume, ctx.currentTime);
              srcNode.connect(gainNode);
              gainNode.connect(ctx.destination);
              srcNode.start();
              activeSourcesRef.current = [srcNode];
              srcNode.onended = () => {
                setPlayingSampleId(prev => prev === sample.id ? null : prev);
              };
              return;
            }
          }
        } catch (fileUrlErr) {
          console.warn('Real fileUrl playback failed or blob expired, cleaning up and trying Drive/DSP:', fileUrlErr);
          if (sample.fileUrl.startsWith('blob:')) {
            sample.fileUrl = undefined;
          }
        }
      }

      // 2. Try Google Drive API streaming with accessToken if driveFileId exists
      let token = accessToken;
      if (!token) token = await getAccessToken();
      if (sample.driveFileId && token) {
        try {
          const res = await fetch(`https://www.googleapis.com/drive/v3/files/${sample.driveFileId}?alt=media`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const arrayBuf = await res.arrayBuffer();
            const decodedBuf = await ctx.decodeAudioData(arrayBuf);
            if (decodedBuf) {
              const srcNode = ctx.createBufferSource();
              srcNode.buffer = decodedBuf;
              const gainNode = ctx.createGain();
              gainNode.gain.setValueAtTime(auditionVolume, ctx.currentTime);
              srcNode.connect(gainNode);
              gainNode.connect(ctx.destination);
              srcNode.start();
              activeSourcesRef.current = [srcNode];
              srcNode.onended = () => {
                setPlayingSampleId(prev => prev === sample.id ? null : prev);
              };
              try {
                sample.fileUrl = URL.createObjectURL(new Blob([arrayBuf]));
              } catch {}
              return;
            }
          }
        } catch (driveErr) {
          console.warn('Google Drive direct stream error:', driveErr);
        }
      }

      // 3. Guaranteed audible fallback: Instant Web Audio DSP Synth
      playDpsFallback();

    } catch (err) {
      console.error('Audition error:', err);
      setPlayingSampleId(null);
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

  const handleCopyVaultDriverLink = () => {
    if (samples.length === 0) {
      setErrorMessage('Vault is empty. Add samples first before copying access link.');
      return;
    }

    const driveFolderId = detectedFolderId || '178NNk_i40urru5sLBDQ-4cAsqeInVHl3';
    const userEmail = currentUser?.email || user?.email || 'coldestconcept@gmail.com';

    // Produce clean, short Studio Driver Access URL
    const driverLink = `https://beatgangsta.app/vault/share?user=${encodeURIComponent(userEmail)}&folder=${driveFolderId}&count=${samples.length}&gear=${activeGearRackPlugins.length}`;

    navigator.clipboard.writeText(driverLink);
    setSuccessNotice(`Copied short Studio Access Link: ${driverLink} to clipboard! Paste it directly into chat.`);
  };

  const handleToggleFavorite = (sampleId: string) => {
    const updated = samples.map(s => s.id === sampleId ? { ...s, isFavorite: !s.isFavorite } : s);
    setSamples(updated);
    if (accessToken) {
      syncVaultIndexToDrive(updated, accessToken).catch(e => console.warn('Sync fav failed:', e));
    }
  };

  const handleTriggerMatch = (preset?: StylePreset, customQuery?: string) => {
    setIsMatchingKit(true);
    const targetPreset = preset || selectedStylePreset;
    const query = customQuery !== undefined ? customQuery : customSongInput;

    const matched = matchBeatKitFromVault(query.trim() || targetPreset, samples, undefined, targetPreset.defaultBpm);
    setMatchedKit(matched);
    setGrooveBpm(matched.inferredBpm || matched.style.defaultBpm);
    setIsMatchingKit(false);
  };

  const handleCopyBeatKitRecipe = () => {
    if (!matchedKit) return;
    const slotList = getKitSlotList(matchedKit.slots);
    const avgScore = slotList.length > 0 ? Math.round(slotList.reduce((acc, s) => acc + s.matchScore, 0) / slotList.length) : 95;

    const lines = [
      `=== BEATGANGSTA AI REFERENCE SONG BEAT KIT ===`,
      `Reference Style: ${matchedKit.style.name} (${matchedKit.style.artistReference})`,
      `Target BPM: ${matchedKit.inferredBpm || matchedKit.style.defaultBpm} BPM | Key: ${matchedKit.inferredKey || matchedKit.style.recommendedKey}`,
      `Synergy Match Score: ${avgScore}%`,
      `Vibe Summary: ${matchedKit.vibeSummary}`,
      '',
      `--- CURATED DRUM ROSTER (${slotList.length} Vault One-Shots) ---`
    ];

    slotList.forEach((item, idx) => {
      lines.push(`${idx + 1}. [${item.role.toUpperCase()}] "${item.sample.name}" (${item.matchScore}% Match)`);
      lines.push(`   Type: ${item.sample.exactType} | Key: ${item.sample.detectedKey} | Punch: ${item.sample.punchFrequencyHz || item.sample.fundamentalHz}Hz`);
      lines.push(`   Why Chosen: ${item.reason}`);
      lines.push(`   UAD Channel Strip: ${item.uadChain.join(' -> ')}`);
      lines.push('');
    });

    lines.push('--- UAD MASTER DRUM BUS GLUE CHAIN ---');
    lines.push(`1. Bus Compressor: ${matchedKit.uadDrumBusRecipe.busCompressor}`);
    lines.push(`2. Bus EQ: ${matchedKit.uadDrumBusRecipe.busEq}`);
    lines.push(`3. Tape Saturation: ${matchedKit.uadDrumBusRecipe.tapeSaturation}`);
    lines.push(`4. Glue Strategy: ${matchedKit.uadDrumBusRecipe.glueTip}`);

    navigator.clipboard.writeText(lines.join('\n'));
    setSuccessNotice(`Copied complete "${matchedKit.style.name}" Beat Kit & UAD Recipe to clipboard!`);
  };

  const filteredSamples = samples.filter((sample) => {
    // 1. One-Shot vs Loop filter (from header circle buttons)
    const isLoop = isSampleLoop(sample);
    if (filterOneShotOnly && isLoop) return false;
    if (filterLoopOnly && !isLoop) return false;

    // 2. Favorites Only filter
    if (filterFavoriteOnly && !sample.isFavorite) return false;

    // 3. Category Filter
    if (activeCategory !== 'all') {
      if (sample.category !== activeCategory) {
        if (sample.category === 'hihats' && (activeCategory === 'closed_hats' || activeCategory === 'open_hats')) {
          // allow legacy
        } else {
          return false;
        }
      }
    }

    // 4. Folder Sidebar Toggles
    if (folderToggles[sample.category] === false) {
      return false;
    }

    // 5. Musical Root Key Filter
    if (keyFilter !== 'all') {
      const root = sample.detectedKey ? sample.detectedKey.replace(/[m|maj|min]/i, '').trim() : '';
      if (!root.startsWith(keyFilter)) {
        return false;
      }
    }

    // 6. Tag Pills Ribbon Filter
    if (selectedTagPills.length > 0) {
      const cosmosTags = getSampleCosmosTags(sample).map(t => t.toLowerCase());
      const hasMatch = selectedTagPills.some(pill => {
        const p = pill.toLowerCase();
        return cosmosTags.includes(p) || sample.tags.some(t => t.toLowerCase() === p);
      });
      if (!hasMatch) return false;
    }

    // 7. Text Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sample.name.toLowerCase().includes(q);
      const matchType = sample.exactType.toLowerCase().includes(q);
      const matchTag = sample.tags.some(t => t.toLowerCase().includes(q));
      const matchCosmos = getSampleCosmosTags(sample).some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchType && !matchTag && !matchCosmos) return false;
    }
    return true;
  });

  const categoryCounts: Record<string, number> = {
    all: samples.length,
    kicks: samples.filter(s => s.category === 'kicks').length,
    '808s': samples.filter(s => s.category === '808s').length,
    snares: samples.filter(s => s.category === 'snares').length,
    claps: samples.filter(s => s.category === 'claps').length,
    closed_hats: samples.filter(s => s.category === 'closed_hats' || s.category === 'hihats').length,
    open_hats: samples.filter(s => s.category === 'open_hats').length,
    cymbals: samples.filter(s => s.category === 'cymbals').length,
    percs: samples.filter(s => s.category === 'percs').length,
    toms: samples.filter(s => s.category === 'toms').length,
    vox: samples.filter(s => s.category === 'vox').length,
    fx: samples.filter(s => s.category === 'fx').length,
  };

  const pendingAiCount = samples.filter(s => s.researchStatus !== 'ai_enhanced').length;
  const aiEnhancedCount = samples.filter(s => s.researchStatus === 'ai_enhanced').length;

  return (
    <div 
      className="fixed inset-0 z-[220] flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-7xl h-[95vh] flex flex-col rounded-3xl border border-[#1b3452] bg-[#06111f] shadow-[0_0_80px_rgba(3,15,30,0.95)] overflow-hidden relative text-white font-sans select-none"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'radial-gradient(circle at 50% 0%, #0e2744 0%, #061220 50%, #030813 100%)'
        }}
      >
        {/* WAVES COSMOS TOP HEADER BAR (Matching user screenshot) */}
        <div className="px-5 py-3 border-b border-[#13273e] bg-[#071424]/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => setActiveTab('vault')}
            >
              <span className="text-xl font-black tracking-widest text-sky-100 flex items-center">
                C
                <span className="inline-flex items-center justify-center w-5 h-5 mx-0.5 rounded-full bg-sky-500/20 border border-sky-400/50">
                  <Disc className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
                </span>
                SMOS
              </span>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider ml-1 hidden sm:inline group-hover:text-sky-300 transition-colors">
                Sample Finder
              </span>
            </div>
          </div>

          {/* Integrated Search Bar + 3 Quick Filter Icon Buttons (Loops, One-Shots, Favorites) */}
          <div className="flex items-center gap-2 flex-1 max-w-xl mx-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by instrument, tag, BPM, key, sound character..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#0b1c2e] border border-[#1d3550] text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-400 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Buttons (Exact 3 circle buttons from Waves COSMOS screenshot) */}
            <div className="flex items-center gap-1.5">
              {/* 1. Loop Filter Button (🔄) */}
              <button
                onClick={() => {
                  setFilterLoopOnly(prev => !prev);
                  if (!filterLoopOnly) setFilterOneShotOnly(false);
                }}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                  filterLoopOnly
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20 scale-105'
                    : 'bg-[#0b1c2e] border-[#1d3550] text-gray-400 hover:text-white'
                }`}
                title="Filter Loops Only (🔄)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* 2. One-Shot Filter Button (➔) */}
              <button
                onClick={() => {
                  setFilterOneShotOnly(prev => !prev);
                  if (!filterOneShotOnly) setFilterLoopOnly(false);
                }}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                  filterOneShotOnly
                    ? 'bg-rose-500/30 border-rose-400 text-rose-300 shadow-md shadow-rose-500/20 scale-105'
                    : 'bg-[#0b1c2e] border-[#1d3550] text-gray-400 hover:text-white'
                }`}
                title="Filter One-Shots Only (➔)"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* 3. Favorites Filter Button (⭐) */}
              <button
                onClick={() => setFilterFavoriteOnly(prev => !prev)}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                  filterFavoriteOnly
                    ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-[#0b1c2e] border-[#1d3550] text-gray-400 hover:text-white'
                }`}
                title="Filter Favorites (⭐)"
              >
                <Star className={`w-3.5 h-3.5 ${filterFavoriteOnly ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Tools & Mode Switches */}
          <div className="flex items-center gap-2">
            {/* Volume Icon with Popover Slider */}
            <div className="relative">
              <button
                onClick={() => setIsVolumeOpen(!isVolumeOpen)}
                className="w-8 h-8 rounded-full bg-[#0b1c2e] border border-[#1d3550] text-gray-400 hover:text-white flex items-center justify-center transition-all"
                title="Audition Volume"
              >
                {auditionVolume > 0 ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              {isVolumeOpen && (
                <div className="absolute top-10 right-0 z-50 p-2.5 rounded-xl bg-[#081525] border border-sky-500/40 shadow-2xl flex items-center gap-2 w-36 animate-in fade-in">
                  <Volume2 className="w-3 h-3 text-sky-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={auditionVolume}
                    onChange={(e) => setAuditionVolume(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* AI Beat Kit Matcher & 16-Step Sequencer Switch */}
            <button
              onClick={() => {
                setActiveTab(activeTab === 'song-matcher' ? 'vault' : 'song-matcher');
                if (!matchedKit && samples.length > 0) {
                  handleTriggerMatch();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-md active:scale-95 ${
                activeTab === 'song-matcher'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-pink-400 shadow-purple-500/30'
                  : 'bg-[#0b1c2e] hover:bg-[#122840] text-purple-300 border-purple-500/40'
              }`}
              title="Open AI Song Beat Kit Matcher & Live 16-Step Sequencer"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">AI Song Matcher</span>
            </button>

            {/* AI Layer Stacker Switch */}
            <button
              onClick={() => setActiveTab(activeTab === 'pairing' ? 'vault' : 'pairing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-md active:scale-95 ${
                activeTab === 'pairing'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-sky-400 shadow-sky-500/30'
                  : 'bg-[#0b1c2e] hover:bg-[#122840] text-sky-300 border-sky-500/40'
              }`}
              title="Dual Sample Layering & Acoustic Stacking Engine"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Layer Stacker</span>
            </button>

            {/* Drive Mover Switch */}
            <button
              onClick={() => setActiveTab(activeTab === 'drive-import' ? 'vault' : 'drive-import')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-md active:scale-95 ${
                activeTab === 'drive-import'
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-[#0b1c2e] hover:bg-[#122840] text-amber-300 border-amber-500/40'
              }`}
              title="Scan and Move One-Shots from Google Drive"
            >
              <FolderInput className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Drive Mover</span>
            </button>

            {/* Single Copy Vault & Gear Rack Driver Link for Chat */}
            <button
              onClick={handleCopyVaultDriverLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-md active:scale-95 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black border-amber-400 shadow-amber-500/20"
              title="Copy single Studio Driver Link (Sample Vault + Gear Rack) for AI Assistant chat prompt"
            >
              <Copy className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Copy Vault & Gear AI Link</span>
            </button>

            {/* AI Batch Auto-Enrichment Indicator & Controller */}
            {pendingAiCount > 0 ? (
              <button
                onClick={isAutoEnrichingAi ? handlePauseAiEnrichment : handleAutoEnrichWithAi}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-md active:scale-95 ${
                  isAutoEnrichingAi
                    ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                    : 'bg-[#0b1c2e] hover:bg-[#122840] text-emerald-400 border-emerald-500/40'
                }`}
                title={isAutoEnrichingAi ? "Pause AI Enrichment" : `Batch enrich samples with Gemini AI (saves 95% tokens) • ${pendingAiCount} pending`}
              >
                {isAutoEnrichingAi ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Enriching ({aiEnrichProgress.current}/{aiEnrichProgress.total})</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden xl:inline">AI Enrich ({pendingAiCount})</span>
                  </>
                )}
              </button>
            ) : (
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>100% AI Researched</span>
              </div>
            )}

            {/* User Account / Auth Indicator */}
            {currentUser?.email && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0b1c2e] border border-[#1d3550] text-[11px] text-emerald-400 font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span className="truncate max-w-[130px]">{currentUser.email}</span>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#0b1c2e] hover:bg-red-950/60 border border-[#1d3550] hover:border-red-500/40 text-gray-400 hover:text-red-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SUB-BAR 1: TAG PILLS RIBBON (Exact pills from Waves COSMOS screenshot) */}
        <div className="px-5 py-2 border-b border-[#12243a] bg-[#06111f]/95 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {COSMOS_TAG_PILLS.map((tag) => {
            const isSelected = selectedTagPills.includes(tag.toLowerCase());
            return (
              <button
                key={tag}
                onClick={() => {
                  const tLower = tag.toLowerCase();
                  setSelectedTagPills(prev => 
                    prev.includes(tLower) ? prev.filter(p => p !== tLower) : [...prev, tLower]
                  );
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex-shrink-0 border ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-md font-bold scale-105'
                    : 'bg-[#0a1827] hover:bg-[#0f2338] text-gray-300 border-[#1a334e]'
                }`}
              >
                {tag}
              </button>
            );
          })}
          {selectedTagPills.length > 0 && (
            <button
              onClick={() => setSelectedTagPills([])}
              className="text-[10px] font-mono text-sky-400 hover:underline px-2 py-0.5"
            >
              Clear Pills ({selectedTagPills.length})
            </button>
          )}
        </div>

        {/* SUB-BAR 2: DROPDOWNS & VIEW MODE SWITCHER (Matching Waves COSMOS screenshot) */}
        <div className="px-5 py-2 border-b border-[#12243a] bg-[#071424] flex items-center justify-between gap-4 shrink-0">
          {/* Dropdown Filters on Left */}
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-300">
            {/* 1. Instruments Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsInstrumentsOpen(!isInstrumentsOpen);
                  setIsTagsOpen(false);
                  setIsKeyBpmOpen(false);
                }}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span className={activeCategory !== 'all' ? 'text-sky-400 font-bold' : ''}>
                  {activeCategory === 'all' ? 'Instruments' : COSMOS_CATEGORIES.find(c => c.id === activeCategory)?.label}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isInstrumentsOpen && (
                <div className="absolute top-8 left-0 z-50 w-52 p-2 rounded-2xl bg-[#081628] border border-sky-500/40 shadow-2xl space-y-1 animate-in fade-in">
                  {COSMOS_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setIsInstrumentsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-sky-500/20 text-sky-300 font-bold'
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span>{cat.label}</span>
                      </div>
                      <span className="text-[10px] opacity-60 font-mono">
                        {categoryCounts[cat.id] ?? 0}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Tags Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsTagsOpen(!isTagsOpen);
                  setIsInstrumentsOpen(false);
                  setIsKeyBpmOpen(false);
                }}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span>Tags</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isTagsOpen && (
                <div className="absolute top-8 left-0 z-50 w-48 p-2 rounded-2xl bg-[#081628] border border-sky-500/40 shadow-2xl space-y-1 animate-in fade-in">
                  {['punchy', 'clean', 'dry', 'wet', 'bright', 'dark', 'electronic', 'acoustic', 'tight', 'sizzle'].map((t) => {
                    const isSel = selectedTagPills.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          setSelectedTagPills(prev => 
                            prev.includes(t) ? prev.filter(p => p !== t) : [...prev, t]
                          );
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
                          isSel ? 'bg-sky-500/20 text-sky-300 font-bold' : 'hover:bg-white/5 text-gray-300'
                        }`}
                      >
                        <span>{t}</span>
                        {isSel && <CheckCircle2 className="w-3 h-3 text-sky-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Key & BPM Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsKeyBpmOpen(!isKeyBpmOpen);
                  setIsInstrumentsOpen(false);
                  setIsTagsOpen(false);
                }}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span className={keyFilter !== 'all' ? 'text-sky-400 font-bold' : ''}>
                  {keyFilter === 'all' ? 'Key & BPM' : `Key: ${keyFilter}`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isKeyBpmOpen && (
                <div className="absolute top-8 left-0 z-50 w-52 p-3 rounded-2xl bg-[#081628] border border-sky-500/40 shadow-2xl space-y-2 animate-in fade-in">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                    Select Root Pitch:
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    {MUSICAL_KEYS.map((k) => (
                      <button
                        key={k}
                        onClick={() => {
                          setKeyFilter(k);
                          setIsKeyBpmOpen(false);
                        }}
                        className={`py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                          keyFilter === k
                            ? 'bg-sky-500 text-white'
                            : 'bg-black/40 hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* View Mode Switcher Icons on Right (Matching Waves COSMOS screenshot) */}
          <div className="flex items-center gap-3">
            {/* 1. Waveform Grid View (4 square tiles) */}
            <button
              onClick={() => setCosmosViewMode('grid')}
              className={`p-1 rounded transition-colors ${
                cosmosViewMode === 'grid'
                  ? 'text-sky-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Waveform Card Grid View"
            >
              <Grid className="w-5 h-5" />
            </button>

            {/* 2. List View (Stacked horizontal lines - Active in screenshot) */}
            <button
              onClick={() => setCosmosViewMode('list')}
              className={`p-1 rounded transition-colors ${
                cosmosViewMode === 'list'
                  ? 'text-sky-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Database List View"
            >
              <List className="w-5 h-5" />
            </button>

            {/* 3. Cosmos Galaxy View (Orbital rings / Atom) */}
            <button
              onClick={() => setCosmosViewMode('map')}
              className={`p-1 rounded transition-colors ${
                cosmosViewMode === 'map'
                  ? 'text-sky-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title="Cosmos Galaxy 2D Map"
            >
              <Disc className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION BANNERS */}
        {errorMessage && (
          <div className="mx-5 mt-2 p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="font-mono">{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="p-1 text-red-400 hover:text-white">✕</button>
          </div>
        )}
        {successNotice && (
          <div className="mx-5 mt-2 p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successNotice}</span>
            </div>
            <button onClick={() => setSuccessNotice(null)} className="p-1 text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* MAIN BODY: COSMOS LEFT SIDEBAR + CENTRAL CONTENT */}
        {activeTab === 'vault' && (
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT SIDEBAR (Matching Waves COSMOS screenshot) */}
            <div className="w-60 border-r border-[#12243a] bg-[#071322] flex flex-col justify-between shrink-0 select-none">
              <div className="overflow-y-auto">
                {/* Top Sidebar Tabs (Waveform & Folders) */}
                <div className="p-3 border-b border-[#12243a] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSidebarTab('samples')}
                      className={`p-1.5 rounded-lg transition-colors relative ${
                        sidebarTab === 'samples' ? 'text-sky-400 bg-sky-500/10' : 'text-gray-400 hover:text-white'
                      }`}
                      title="All Samples"
                    >
                      <Disc className="w-4 h-4" />
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500" />
                    </button>
                    <button
                      onClick={() => setSidebarTab('folders')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        sidebarTab === 'folders' ? 'text-sky-400 bg-sky-500/10' : 'text-gray-400 hover:text-white'
                      }`}
                      title="Folder Collections"
                    >
                      <Folder className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                    Libraries
                  </span>
                </div>

                {/* Section: SampleVault Cloud */}
                <div className="p-3 border-b border-[#12243a]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      SampleVault Cloud
                    </span>
                    <button
                      onClick={() => {
                        if (accessToken) loadFromDrive(accessToken);
                      }}
                      className="text-gray-400 hover:text-white p-1 rounded hover:bg-sky-500/10 transition-colors"
                      title="Rescan Cloud Vault"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-[11px] text-gray-400 font-sans flex items-center justify-between">
                    <span>Drive Storage</span>
                    <span className="font-mono text-sky-400 font-bold">{samples.length} one-shots</span>
                  </div>
                </div>

                {/* Section: COSMOS Categorized Folders */}
                <div className="p-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Acoustic One-Shot Folders
                  </span>
                  <div className="space-y-1">
                    {COSMOS_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                      const isToggled = folderToggles[cat.id] !== false;
                      const count = categoryCounts[cat.id] ?? 0;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setFolderToggles(prev => ({ ...prev, [cat.id]: !isToggled }));
                          }}
                          className="flex items-center justify-between py-1 text-xs text-gray-300 hover:text-white cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div
                              className={`w-7 h-3.5 rounded-full p-0.5 transition-colors flex items-center ${
                                isToggled ? 'bg-sky-500' : 'bg-gray-700'
                              }`}
                            >
                              <div
                                className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                                  isToggled ? 'translate-x-3.5' : 'translate-x-0'
                                }`}
                              />
                            </div>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                            <span className="truncate group-hover:text-white">{cat.label}</span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-500">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Sidebar Status & Sample Counter (Exact match to screenshot!) */}
              <div className="p-3 border-t border-[#12243a] bg-[#050e18] space-y-2">
                <div className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-[11px] font-sans text-red-300">
                  <span className="font-bold block">New COSMOS Version</span>
                  <span className="text-[10px] opacity-80 block">VIP Sync Active • Rescan Clean</span>
                  <button
                    onClick={() => {
                      if (accessToken) loadFromDrive(accessToken);
                    }}
                    className="text-[10px] text-sky-400 hover:underline mt-0.5 block"
                  >
                    Update / Sync now
                  </button>
                </div>

                <div className="text-center text-xs font-mono font-bold text-gray-300">
                  {filteredSamples.length} / {samples.length} samples
                </div>
              </div>
            </div>

            {/* CENTRAL MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#06111f]">
              {/* VIEW 1: LIST VIEW (1:1 with Waves COSMOS screenshot) */}
              {cosmosViewMode === 'list' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Table Column Header */}
                  <div className="px-5 py-2 border-b border-[#12243a] bg-[#071424] text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Name</span>
                    <span className="hidden sm:inline">Pitch & Timbre</span>
                  </div>

                  {/* Sample List Rows */}
                  <div className="flex-1 overflow-y-auto divide-y divide-[#0e1d2f]">
                    {filteredSamples.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center opacity-50 space-y-2">
                        <Disc className="w-12 h-12 opacity-30 animate-spin-slow" />
                        <p className="text-sm font-bold">No samples match your current COSMOS filters.</p>
                        <p className="text-xs font-mono">Try clearing selected tag pills or category filters.</p>
                      </div>
                    ) : (
                      filteredSamples.map((sample) => {
                        const isLoop = isSampleLoop(sample);
                        const isPlaying = playingSampleId === sample.id;
                        const cosmosTags = getSampleCosmosTags(sample);

                        return (
                          <div
                            key={sample.id}
                            className={`group flex items-center justify-between py-2.5 px-5 hover:bg-[#0b1d31] transition-colors cursor-pointer ${
                              isPlaying ? 'bg-[#0f243d]' : ''
                            }`}
                            onClick={() => handlePlaySample(sample)}
                          >
                            {/* Left Column: Capsule Play Button, Star, Add Icon, Name & Tags */}
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              {/* Authentic Capsule Play Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlaySample(sample);
                                }}
                                className={`w-11 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 shadow-md ${
                                  isLoop
                                    ? 'bg-[#0a4832] hover:bg-[#106244] text-emerald-300'
                                    : 'bg-[#5f1727] hover:bg-[#7e1e34] text-rose-200'
                                } ${isPlaying ? 'ring-2 ring-white scale-105' : ''}`}
                                title={isPlaying ? 'Stop' : isLoop ? 'Play Loop' : 'Play Hit'}
                              >
                                {isPlaying ? (
                                  <Square className="w-4 h-4 fill-current" />
                                ) : isLoop ? (
                                  <RotateCcw className="w-4 h-4" />
                                ) : (
                                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                                )}
                              </button>

                              {/* Star Icon (Favorite) */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(sample.id);
                                }}
                                className="text-gray-500 hover:text-amber-400 transition-colors p-1"
                                title="Favorite"
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    sample.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                                  }`}
                                />
                              </button>


                              {/* Sample Title and Pipe-Separated Tags */}
                              <div className="min-w-0 flex-1 pr-2">
                                <h4 className="text-sm font-bold text-gray-100 group-hover:text-white truncate">
                                  {sample.name}
                                </h4>
                                <p className="text-xs text-gray-400 font-sans tracking-tight truncate mt-0.5">
                                  {cosmosTags.join(' | ')}
                                </p>
                              </div>
                            </div>

                            {/* Right Column: Key Badge, Punch Hz, Mini Waveform, Duration */}
                            <div className="flex items-center gap-3 text-xs font-mono text-gray-400 flex-shrink-0">
                              {sample.detectedKey && (
                                <span className="px-2 py-0.5 rounded bg-[#0b1d30] text-sky-300 border border-[#1a3858] font-bold text-[11px]">
                                  {sample.detectedKey}
                                </span>
                              )}

                              {sample.punchFrequencyHz && (
                                <span className="hidden md:inline text-purple-300 text-[11px]">
                                  {sample.punchFrequencyHz}Hz
                                </span>
                              )}

                              {/* Mini Waveform Bars (animated on play) */}
                              <div className="w-16 hidden sm:block opacity-60 group-hover:opacity-100">
                                {generateWaveformBars(sample.id, isPlaying)}
                              </div>

                              <span className="w-12 text-right text-[11px] text-gray-400 font-mono">
                                {sample.durationSeconds}s
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* VIEW 2: WAVEFORM / GRID VIEW */}
              {cosmosViewMode === 'grid' && (
                <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredSamples.map((sample) => {
                    const isLoop = isSampleLoop(sample);
                    const isPlaying = playingSampleId === sample.id;
                    const cosmosTags = getSampleCosmosTags(sample);

                    return (
                      <div
                        key={sample.id}
                        onClick={() => handlePlaySample(sample)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                          isPlaying
                            ? 'bg-[#0f243d] border-sky-400 shadow-xl shadow-sky-500/20'
                            : 'bg-[#081525] hover:bg-[#0c1f35] border-[#172c44] hover:border-sky-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaySample(sample);
                            }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
                              isLoop ? 'bg-[#0a4832] text-emerald-300' : 'bg-[#5f1727] text-rose-200'
                            }`}
                          >
                            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : isLoop ? <RotateCcw className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                          </button>

                          <div className="flex items-center gap-1.5">
                            {sample.detectedKey && (
                              <span className="px-1.5 py-0.5 rounded bg-[#0e2137] text-sky-300 text-[10px] font-mono font-bold border border-[#1c3858]">
                                {sample.detectedKey}
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(sample.id);
                              }}
                              className="text-gray-500 hover:text-amber-400 p-1"
                            >
                              <Star className={`w-3.5 h-3.5 ${sample.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Large Waveform Canvas Simulator */}
                        <div className="h-14 flex items-center justify-center bg-[#050d18] rounded-xl px-2 my-2 border border-[#112236]">
                          {generateWaveformBars(sample.id, isPlaying)}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white truncate">{sample.name}</h4>
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">
                            {cosmosTags.slice(0, 3).join(' • ')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* VIEW 3: COSMOS GALAXY 2D MAP */}
              {cosmosViewMode === 'map' && (
                <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#020612] via-[#050b1a] to-black">
                  <div className="flex-1 relative overflow-hidden flex items-center justify-center select-none">
                    <svg
                      viewBox="0 0 1000 600"
                      className="w-full h-full cursor-crosshair"
                      style={{
                        transform: `scale(${cosmosZoom})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.2s ease-out'
                      }}
                    >
                      <defs>
                        <radialGradient id="cosmosNebula" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.4" />
                          <stop offset="50%" stopColor="#0f172a" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
                        </radialGradient>
                        <filter id="glowStar" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      <rect width="1000" height="600" fill="url(#cosmosNebula)" />

                      {/* Coordinate Grid Lines */}
                      <line x1="60" y1="540" x2="940" y2="540" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                      <line x1="60" y1="60" x2="60" y2="540" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                      <line x1="500" y1="60" x2="500" y2="540" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
                      <line x1="60" y1="300" x2="940" y2="300" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />

                      {/* Grid Axis Markers */}
                      <text x="60" y="565" fill="#38bdf8" fontSize="10" fontFamily="monospace" opacity="0.8">
                        ◄ LOW SUB / DARK (50Hz)
                      </text>
                      <text x="500" y="565" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle" fontFamily="monospace">
                        SPECTRAL BRIGHTNESS (X)
                      </text>
                      <text x="940" y="565" fill="#ec4899" fontSize="10" textAnchor="end" fontFamily="monospace" opacity="0.8">
                        BRIGHT AIR / SIZZLE (12kHz) ►
                      </text>

                      <text x="25" y="80" fill="#a855f7" fontSize="10" fontFamily="monospace" opacity="0.8" transform="rotate(-90 25 80)">
                        ▲ LONG TAIL / ROOM (2.5s)
                      </text>
                      <text x="25" y="320" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace" transform="rotate(-90 25 320)">
                        SPACE / DECAY (Y)
                      </text>
                      <text x="25" y="520" fill="#10b981" fontSize="10" fontFamily="monospace" opacity="0.8" transform="rotate(-90 25 520)">
                        ▼ TIGHT / DRY (&lt;50ms)
                      </text>

                      {/* Plotted Star Nodes */}
                      {filteredSamples.map((sample) => {
                        const catInfo = COSMOS_CATEGORIES.find(c => c.id === sample.category) || COSMOS_CATEGORIES[1];
                        const bScore = sample.brightnessScore ?? Math.min(100, Math.max(0, ((Math.log10(Math.max(50, sample.punchFrequencyHz || 100)) - 1.69) / 2.38) * 100));
                        const sScore = sample.spaceScore ?? Math.min(100, Math.max(0, ((Math.log10(Math.max(20, sample.decayMs || 100)) - 1.3) / 2.1) * 100));
                        
                        const cx = 60 + (bScore / 100) * 880;
                        const cy = 540 - (sScore / 100) * 480;
                        const isPlaying = playingSampleId === sample.id;
                        const isSelected = selectedCosmosSample?.id === sample.id;
                        const isHovered = hoveredCosmosSample?.id === sample.id;

                        return (
                          <g
                            key={sample.id}
                            onClick={() => {
                              handlePlaySample(sample);
                              setSelectedCosmosSample(sample);
                            }}
                            onMouseEnter={() => setHoveredCosmosSample(sample)}
                            onMouseLeave={() => setHoveredCosmosSample(null)}
                            className="cursor-pointer transition-transform"
                          >
                            {isPlaying && (
                              <circle
                                cx={cx}
                                cy={cy}
                                r="16"
                                fill="none"
                                stroke={catInfo.color}
                                strokeWidth="2"
                                className="animate-ping"
                              />
                            )}

                            {isSelected && (
                              <circle
                                cx={cx}
                                cy={cy}
                                r="12"
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth="2"
                              />
                            )}

                            <circle
                              cx={cx}
                              cy={cy}
                              r={isHovered ? 9 : 6}
                              fill={catInfo.color}
                              opacity={isHovered ? 0.9 : 0.75}
                              filter="url(#glowStar)"
                            />

                            <circle
                              cx={cx}
                              cy={cy}
                              r={isHovered ? 4.5 : 3}
                              fill="#ffffff"
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Hover Card */}
                    {hoveredCosmosSample && (
                      <div
                        className="absolute pointer-events-none z-30 p-3 rounded-2xl bg-black/90 border border-sky-400/50 shadow-2xl backdrop-blur-xl text-left max-w-xs animate-in fade-in duration-150"
                        style={{
                          left: `${Math.min(75, Math.max(15, (hoveredCosmosSample.brightnessScore ?? 50)))}%`,
                          top: `${Math.min(70, Math.max(10, 100 - (hoveredCosmosSample.spaceScore ?? 30)))}%`
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: COSMOS_CATEGORIES.find(c => c.id === hoveredCosmosSample.category)?.color || '#38bdf8' }}
                          />
                          <span className="text-[10px] uppercase font-mono tracking-wider text-sky-300">
                            {hoveredCosmosSample.category}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-white truncate max-w-[220px]">
                          {hoveredCosmosSample.name}
                        </h5>
                        <p className="text-[10px] font-mono text-gray-300 mt-1">
                          Punch: {hoveredCosmosSample.punchFrequencyHz || hoveredCosmosSample.fundamentalHz}Hz • Decay: {hoveredCosmosSample.decayMs}ms
                        </p>
                      </div>
                    )}

                    {/* Map Zoom Controls */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/80 border border-white/10 rounded-xl p-1 z-20 shadow-xl">
                      <button
                        onClick={() => setCosmosZoom(z => Math.max(0.75, z - 0.25))}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCosmosZoom(1)}
                        className="px-2 py-1 text-[10px] font-mono text-gray-300 hover:text-white"
                        title="Reset Zoom"
                      >
                        {Math.round(cosmosZoom * 100)}%
                      </button>
                      <button
                        onClick={() => setCosmosZoom(z => Math.min(2.5, z + 0.25))}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

            {/* TAB 2: GAME-CHANGING AI REFERENCE SONG BEAT KIT MATCHER */}
            {activeTab === 'song-matcher' && (
              <div className="flex-1 flex flex-col overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* Header Banner */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-pink-950/70 border border-purple-500/40 shadow-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300">
                        <Wand2 className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-white tracking-wide">
                            AI Reference Song Beat Kit Matcher
                          </h3>
                          <span className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Game Changer
                          </span>
                        </div>
                        <p className="text-xs text-purple-200/80 font-mono">
                          Acoustically pairs the optimal 6-piece drum kit from your Vault with live 16-step groove playback & UAD bus glue.
                        </p>
                      </div>
                    </div>

                    {matchedKit && (
                      <button
                        onClick={handleCopyBeatKitRecipe}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Complete Beat Kit & DAW Recipe</span>
                      </button>
                    )}
                  </div>

                  {/* Signature Beat Presets Chips */}
                  <div>
                    <label className="text-[11px] font-mono text-purple-300 uppercase tracking-wider block mb-2 font-bold">
                      Select Signature Style Preset:
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {SIGNATURE_BEAT_STYLES.map((style) => {
                        const isSelected = selectedStylePreset.id === style.id;
                        return (
                          <button
                            key={style.id}
                            onClick={() => {
                              setSelectedStylePreset(style);
                              setCustomSongInput('');
                              handleTriggerMatch(style, '');
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                                : 'bg-black/50 hover:bg-black/70 text-purple-200/80 border border-purple-800/40'
                            }`}
                          >
                            <span>🎵</span>
                            <span>{style.name}</span>
                            <span className="text-[10px] opacity-75 font-mono">
                              ({style.defaultBpm} BPM • {style.recommendedKey})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Hit Song / Artist Search Input */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[260px]">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                      <input
                        type="text"
                        value={customSongInput}
                        onChange={(e) => setCustomSongInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleTriggerMatch(undefined, customSongInput);
                        }}
                        placeholder="Or enter any hit song/artist (e.g., Sicko Mode, Not Like Us, God's Plan, Superhero)..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/70 border border-purple-500/40 text-xs text-white placeholder:text-purple-400/60 focus:outline-none focus:border-pink-400 shadow-inner"
                      />
                    </div>

                    <button
                      onClick={() => handleTriggerMatch(undefined, customSongInput)}
                      disabled={isMatchingKit}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-black text-xs shadow-lg active:scale-95 disabled:opacity-50 transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
                      <span>{isMatchingKit ? 'Analyzing Acoustics...' : 'AI Match Beat Kit from My Vault'}</span>
                    </button>
                  </div>
                </div>

                {matchedKit && (() => {
                  const slotList = getKitSlotList(matchedKit.slots);
                  const overallScore = slotList.length > 0
                    ? Math.round(slotList.reduce((acc, s) => acc + s.matchScore, 0) / slotList.length)
                    : 96;

                  return (
                    <>
                      {/* Kit Synergy Summary */}
                      <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-400">Match Style:</span>
                            <strong className="text-white text-sm">{matchedKit.style.name}</strong>
                            <span className="text-xs font-mono text-purple-300">({matchedKit.style.artistReference})</span>
                          </div>
                          <p className="text-xs text-purple-200/90 font-mono mt-1">
                            Vibe Profile: {matchedKit.vibeSummary}
                          </p>
                          <p className="text-xs text-sky-200/90 font-mono">
                            Harmonic Pocket: Key of {matchedKit.inferredKey} • Grooving at {matchedKit.inferredBpm} BPM
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-mono text-gray-400 uppercase block">
                            Synergy Compatibility
                          </span>
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-2xl font-black text-amber-400">
                              {overallScore}%
                            </span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                              ELITE MATCH
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* LIVE 16-STEP GROOVE SEQUENCER PLAYER */}
                      <div className="p-5 rounded-3xl bg-black/80 border border-purple-500/40 space-y-4 shadow-2xl">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setIsPlayingGroove(!isPlayingGroove)}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg transition-all active:scale-95 ${
                                isPlayingGroove
                                  ? 'bg-red-500 text-white shadow-red-500/40 animate-pulse'
                                  : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-emerald-500/30'
                              }`}
                            >
                              {isPlayingGroove ? (
                                <>
                                  <Square className="w-4 h-4 fill-current" />
                                  <span>Stop Groove</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 fill-current ml-0.5" />
                                  <span>Play Beat Kit Groove</span>
                                </>
                              )}
                            </button>

                            {/* Tempo Slider */}
                            <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5">
                              <span className="text-xs font-mono text-gray-400">BPM:</span>
                              <span className="text-xs font-mono font-bold text-sky-300 w-8">{grooveBpm}</span>
                              <input
                                type="range"
                                min="60"
                                max="180"
                                value={grooveBpm}
                                onChange={(e) => setGrooveBpm(Number(e.target.value))}
                                className="w-24 accent-sky-400 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Step Counter Indicator */}
                          <div className="flex items-center gap-1.5 font-mono text-xs text-gray-300">
                            <span className="text-gray-500">Step:</span>
                            <span className="text-amber-400 font-bold w-5">{currentGrooveStep + 1} / 16</span>
                          </div>
                        </div>

                        {/* Sequencer Track Rows */}
                        <div className="space-y-2 pt-2">
                          {/* 16-Step Header Lights */}
                          <div className="flex items-center gap-2">
                            <div className="w-44 text-[10px] font-mono text-gray-500 uppercase">Track / Element</div>
                            <div className="flex-1 grid grid-cols-16 gap-1">
                              {Array.from({ length: 16 }).map((_, stepIdx) => (
                                <div
                                  key={stepIdx}
                                  className={`h-1.5 rounded-full transition-all ${
                                    currentGrooveStep === stepIdx
                                      ? 'bg-amber-400 shadow-md shadow-amber-400/80 scale-y-150'
                                      : (stepIdx % 4 === 0 ? 'bg-white/30' : 'bg-white/10')
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Sequencer Tracks */}
                          {slotList.map((slot) => {
                            const isMuted = grooveTrackMutes[slot.trackKey];
                            const isSolo = grooveTrackSolos[slot.trackKey];
                            const catColor = COSMOS_CATEGORIES.find(c => c.id === slot.sample.category)?.color || '#38bdf8';
                            const trackPattern = matchedKit.style.pattern[slot.patternKey] || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

                            return (
                              <div
                                key={slot.trackKey}
                                className={`p-2.5 rounded-xl border flex flex-wrap items-center gap-2 transition-all ${
                                  isMuted
                                    ? 'bg-black/30 border-white/5 opacity-40'
                                    : 'bg-black/60 border-white/10 hover:border-purple-500/40'
                                }`}
                              >
                                {/* Track Info & Solo/Mute */}
                                <div className="w-44 flex items-center justify-between pr-2">
                                  <div className="truncate">
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: catColor }}
                                      />
                                      <span className="text-xs font-bold text-white uppercase tracking-wider truncate">
                                        {slot.role}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-400 truncate block">
                                      {slot.sample.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={() => {
                                        setGrooveTrackSolos(prev => ({
                                          ...prev,
                                          [slot.trackKey]: !prev[slot.trackKey]
                                        }));
                                      }}
                                      className={`w-5 h-5 rounded text-[10px] font-black transition-all ${
                                        isSolo
                                          ? 'bg-amber-400 text-black'
                                          : 'bg-white/5 hover:bg-white/10 text-gray-400'
                                      }`}
                                      title="Solo track"
                                    >
                                      S
                                    </button>
                                    <button
                                      onClick={() => {
                                        setGrooveTrackMutes(prev => ({
                                          ...prev,
                                          [slot.trackKey]: !prev[slot.trackKey]
                                        }));
                                      }}
                                      className={`w-5 h-5 rounded text-[10px] font-black transition-all ${
                                        isMuted
                                          ? 'bg-red-500 text-white'
                                          : 'bg-white/5 hover:bg-white/10 text-gray-400'
                                      }`}
                                      title="Mute track"
                                    >
                                      M
                                    </button>
                                    <button
                                      onClick={() => handlePlaySample(slot.sample)}
                                      className="p-1 rounded text-sky-400 hover:text-white"
                                      title="Trigger sample"
                                    >
                                      <Play className="w-3 h-3 fill-current ml-0.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* 16 Step Rhythm Trigger Lights */}
                                <div className="flex-1 grid grid-cols-16 gap-1 min-w-[200px]">
                                  {trackPattern.map((hasBeat, sIdx) => {
                                    const isCurrent = currentGrooveStep === sIdx && isPlayingGroove;
                                    const isHit = hasBeat === 1;

                                    return (
                                      <div
                                        key={sIdx}
                                        className={`h-7 rounded-lg flex items-center justify-center transition-all ${
                                          isHit
                                            ? isCurrent
                                              ? 'bg-amber-300 shadow-lg shadow-amber-300 scale-105'
                                              : 'bg-purple-600/80 hover:bg-purple-500'
                                            : isCurrent
                                              ? 'bg-white/20'
                                              : (sIdx % 4 === 0 ? 'bg-white/10' : 'bg-white/5')
                                        }`}
                                      >
                                        {isHit && (
                                          <div
                                            className={`w-2 h-2 rounded-full ${
                                              isCurrent ? 'bg-black' : 'bg-white'
                                            }`}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Curated Vault Sample Cards */}
                      <div>
                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span>Curated One-Shots from Your Drum Vault ({slotList.length})</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {slotList.map((slot) => {
                            const catColor = COSMOS_CATEGORIES.find(c => c.id === slot.sample.category)?.color || '#38bdf8';
                            const isPlaying = playingSampleId === slot.sample.id;

                            return (
                              <div
                                key={slot.role}
                                className="p-4 rounded-2xl bg-black/50 border border-purple-500/30 hover:border-purple-400 space-y-2.5 transition-all"
                              >
                                <div className="flex items-center justify-between">
                                  <span
                                    className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-bold"
                                    style={{
                                      color: catColor,
                                      borderColor: `${catColor}60`,
                                      backgroundColor: `${catColor}15`
                                    }}
                                  >
                                    {slot.role}
                                  </span>
                                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                    {slot.matchScore}% Match
                                  </span>
                                </div>

                                <div className="flex items-center justify-between">
                                  <h5 className="text-sm font-bold text-white truncate max-w-[180px]">
                                    {slot.sample.name}
                                  </h5>
                                  <button
                                    onClick={() => handlePlaySample(slot.sample)}
                                    className={`p-2 rounded-xl border transition-all ${
                                      isPlaying
                                        ? 'bg-sky-400 text-black border-sky-300'
                                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                    }`}
                                  >
                                    {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                                  </button>
                                </div>

                                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                                  {slot.reason}
                                </p>

                                {slot.uadChain && slot.uadChain.length > 0 && (
                                  <div className="p-2 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-purple-200">
                                    <span className="text-[9px] text-gray-400 uppercase block font-bold">
                                      Recommended UAD Track Processing:
                                    </span>
                                    <strong>{slot.uadChain.join(' ➔ ')}</strong>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* UAD MASTER DRUM BUS GLUE CHAIN */}
                      <div className="p-5 rounded-3xl bg-black/70 border border-amber-500/30 space-y-3">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                          <h4 className="text-sm font-bold text-white">
                            UAD Software Master Drum Bus Glue Recipe (Zero Hardware Contaminants)
                          </h4>
                        </div>
                        <p className="text-xs text-gray-400 font-mono">
                          Exact software parameters exposed on the digital plugin GUI for your master drum bus.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/20 space-y-1">
                            <span className="text-xs font-bold text-amber-300">1. Bus Compression</span>
                            <p className="text-xs font-mono text-white/90">
                              {matchedKit.uadDrumBusRecipe.busCompressor}
                            </p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/20 space-y-1">
                            <span className="text-xs font-bold text-amber-300">2. Bus Tonal EQ</span>
                            <p className="text-xs font-mono text-white/90">
                              {matchedKit.uadDrumBusRecipe.busEq}
                            </p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/20 space-y-1">
                            <span className="text-xs font-bold text-amber-300">3. Tape Saturation</span>
                            <p className="text-xs font-mono text-white/90">
                              {matchedKit.uadDrumBusRecipe.tapeSaturation}
                            </p>
                          </div>
                          <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/20 space-y-1">
                            <span className="text-xs font-bold text-amber-300">4. Pro Glue Tip</span>
                            <p className="text-xs font-sans text-gray-300">
                              {matchedKit.uadDrumBusRecipe.glueTip}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
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
                    <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-3 shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-3">
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

                      <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-[11px] font-mono text-amber-300/90 leading-relaxed">
                        ⚠️ <strong>If Google shows "Google hasn't verified this app":</strong> You are the developer (<code className="text-white">coldestconcept@gmail.com</code>). Simply tap <strong className="text-white underline">"Advanced"</strong> on the bottom-left of that screen &rarr; then tap <strong className="text-white underline">"Go to Coldest Concept's Apps (unsafe)"</strong> &rarr; tap <strong className="text-white underline">"Continue"</strong>.
                      </div>
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

                  {/* Detected Folder Header */}
                  {detectedFolderName && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                      <div className="flex items-center gap-2 text-white">
                        <Folder className={`w-4 h-4 ${currentTheme.accentText}`} />
                        <span>Source: <strong className={currentTheme.accentText}>"{detectedFolderName}"</strong></span>
                      </div>
                      <span className="opacity-70 text-[11px]">
                        Scanned {totalScannedFolders} folder{totalScannedFolders > 1 ? 's' : ''} recursively
                      </span>
                    </div>
                  )}
                </div>

                {/* Detected Zip Archives Card */}
                {scannedZipFiles.length > 0 && (
                  <div className={`p-6 rounded-3xl border space-y-4 ${currentTheme.driveContainer}`}>
                    <div className="flex items-center gap-2">
                      <Archive className={`w-5 h-5 ${currentTheme.accentText}`} />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Drum Kit Zip Archives Found ({scannedZipFiles.length})
                      </h4>
                    </div>
                    <p className={`text-xs font-mono opacity-80 ${currentTheme.subtitle}`}>
                      BeatGangsta can extract .wav / .mp3 one-shots directly from these zip archives in memory, run AI harmonic analysis, and add them to your Vault.
                    </p>

                    {isUnpackingZip && (
                      <div className="p-4 rounded-xl bg-black/60 border border-sky-500/40 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono text-sky-300">
                          <span>Unpacking Progress</span>
                          <span className="truncate max-w-[280px]">{unpackProgress.fileName}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${currentTheme.progressBar}`}
                            style={{
                              width: `${
                                unpackProgress.total > 0
                                  ? (unpackProgress.current / unpackProgress.total) * 100
                                  : 50
                              }%`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {scannedZipFiles.map((zip) => (
                        <div
                          key={zip.id}
                          className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-black/30"
                        >
                          <div className="flex items-center gap-2.5">
                            <Archive className="w-4 h-4 text-amber-400" />
                            <div>
                              <div className="text-xs font-bold text-white">{zip.name}</div>
                              {zip.size && (
                                <div className="text-[10px] font-mono opacity-60">
                                  {(zip.size / (1024 * 1024)).toFixed(1)} MB
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnpackZipAndImport(zip)}
                            disabled={isUnpackingZip || isMigratingDriveFolder}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black shadow-md active:scale-95 disabled:opacity-50 ${currentTheme.driveBtn}`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isUnpackingZip ? 'Extracting...' : 'Unpack & Import One-Shots'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discovered Non-Audio Items Card (Override Available) */}
                {scannedNonAudio.length > 0 && (
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileQuestion className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white">
                          Discovered Other File Formats ({scannedNonAudio.length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowNonAudioFiles(!showNonAudioFiles)}
                          className="text-[11px] font-mono text-sky-400 hover:underline"
                        >
                          {showNonAudioFiles ? 'Hide List' : 'View File Names'}
                        </button>
                        <button
                          onClick={handleTreatNonAudioAsAudio}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${currentTheme.exportBtn}`}
                        >
                          Treat & Import All as Audio
                        </button>
                      </div>
                    </div>

                    {showNonAudioFiles && (
                      <div className="max-h-36 overflow-y-auto space-y-1 text-xs font-mono opacity-80 p-2 rounded bg-black/40">
                        {scannedNonAudio.map((f) => (
                          <div key={f.id} className="flex items-center justify-between">
                            <span className="truncate max-w-[320px]">{f.name}</span>
                            <span className="text-[10px] opacity-60">{f.mimeType}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Scanned Audio Files List & Move Action */}
                {scannedFiles.length > 0 && (() => {
                  const existingDriveIds = new Set(samples.map(s => s.driveFileId).filter(Boolean));
                  const alreadyMigratedCount = scannedFiles.filter(f => existingDriveIds.has(f.id)).length;
                  const pendingMigrateCount = scannedFiles.length - alreadyMigratedCount;

                  return (
                    <div className={`p-6 rounded-3xl border space-y-4 ${currentTheme.driveContainer}`}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">
                              Discovered Audio Files ({scannedFiles.length})
                            </h4>
                            {alreadyMigratedCount > 0 && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                {alreadyMigratedCount} In Vault
                              </span>
                            )}
                            {pendingMigrateCount > 0 && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                                {pendingMigrateCount} Pending
                              </span>
                            )}
                          </div>
                          <p className={`text-xs font-mono opacity-80 mt-0.5 ${currentTheme.subtitle}`}>
                            Auto-deduplicated: Skips already moved files, never consumes double quota.
                          </p>
                        </div>

                        {/* Migration Action Buttons */}
                        <div className="flex items-center gap-2">
                          {isMigratingDriveFolder ? (
                            <button
                              onClick={handlePauseMigration}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-black shadow-lg active:scale-95 transition-all"
                            >
                              <Pause className="w-4 h-4 fill-current" />
                              <span>Pause Migration</span>
                            </button>
                          ) : pendingMigrateCount === 0 ? (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>100% Migrated to Vault</span>
                            </div>
                          ) : (
                            <button
                              onClick={handleMigrateAndMoveDriveFolder}
                              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs shadow-lg active:scale-95 ${currentTheme.driveBtnMove}`}
                            >
                              <Sparkles className="w-4 h-4 animate-spin-slow" />
                              <span>
                                {alreadyMigratedCount > 0
                                  ? `Resume Move (${pendingMigrateCount} Remaining)`
                                  : 'Start Zero-Duplication Move'}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Engine Mode Selector */}
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-gray-300 font-bold flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          Research Mode:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setMigrationMode('fast_studio_dsp')}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              migrationMode === 'fast_studio_dsp'
                                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                                : 'bg-black/50 text-gray-400 hover:text-white'
                            }`}
                            title="Zero AI tokens used. Computes exact pitch, key, punch Hz, and UAD Pultec/1176/Neve recipes instantly without 429 limits."
                          >
                            ⚡ Full Studio DSP (0 Tokens, Fast)
                          </button>
                          <button
                            onClick={() => setMigrationMode('studio_live_ai')}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                              migrationMode === 'studio_live_ai'
                                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                                : 'bg-black/50 text-gray-400 hover:text-white'
                            }`}
                            title="Calls Gemini AI per file for extra descriptive archetype labels (subject to token limits)."
                          >
                            🤖 Studio + Live AI
                          </button>
                        </div>
                      </div>

                      {/* Checkpoint Resumption Banner */}
                      {alreadyMigratedCount > 0 && pendingMigrateCount > 0 && !isMigratingDriveFolder && (
                        <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/40 text-xs font-mono text-sky-200 flex items-center justify-between">
                          <span>
                            💾 <strong>Checkpoint Active:</strong> {alreadyMigratedCount} files from this folder are already safely stored in your Vault. Resuming will start on pending file #{alreadyMigratedCount + 1}.
                          </span>
                        </div>
                      )}

                      {/* Active Migration Progress Bar */}
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
                          <div className="flex items-center gap-2 truncate max-w-[350px]">
                            {file.subfolderName && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/80">
                                {file.subfolderName}
                              </span>
                            )}
                            <span className="text-white truncate">{file.name}</span>
                          </div>
                          <span className="opacity-60 text-[11px]">{file.mimeType}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
      </div>
    </div>
  );
};
