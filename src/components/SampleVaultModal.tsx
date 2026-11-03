import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  Disc, 
  Volume2, 
  Play, 
  Square, 
  UploadCloud, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Cloud, 
  RefreshCw, 
  Copy, 
  Info, 
  Lock,
  ChevronDown,
  ChevronUp,
  X,
  Zap,
  FolderInput,
  Layers,
  Sliders,
  VolumeX,
  ArrowRight,
  ExternalLink
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
  evaluateSamplePairing,
  PairingSynergy
} from '../utils/intelligentDrumPairing';

interface SampleVaultModalProps {
  theme: AppTheme;
  user: any;
  onClose: () => void;
  onUpdateUser?: (updated: any) => void;
}

export const SampleVaultModal: React.FC<SampleVaultModalProps> = ({
  theme,
  user,
  onClose,
  onUpdateUser
}) => {
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
  const [targetCategory, setTargetCategory] = useState<DrumOneShotCategory>('kicks');

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

  const isAuthorized = isAuthorizedForVault(currentUser?.email);

  // Sync token & Drive on mount
  useEffect(() => {
    getAccessToken().then(tok => {
      if (tok) {
        setAccessToken(tok);
        loadFromDrive(tok);
      }
    });
  }, [currentUser]);

  // Save to local cache as backup
  useEffect(() => {
    try {
      localStorage.setItem('bg_sample_vault_items', JSON.stringify(samples));
    } catch (e) {
      console.warn('Could not cache samples to localStorage:', e);
    }
  }, [samples]);

  // Update pairing matches when focus sample or samples change
  useEffect(() => {
    if (pairingFocusSample) {
      const matches = findTopComplementaryMatches(pairingFocusSample, samples, 8);
      setTopMatches(matches);
      if (matches.length > 0 && (!selectedMatch || selectedMatch.sampleA.id !== pairingFocusSample.id)) {
        setSelectedMatch(matches[0]);
        setMicroOffsetMs(matches[0].suggestedOffsetMs || 0);
      }
    }
  }, [pairingFocusSample, samples]);

  const loadFromDrive = async (token: string) => {
    if (!token) return;
    setIsSyncingDrive(true);
    try {
      const driveItems = await fetchVaultIndexFromDrive(token);
      if (driveItems && driveItems.length > 0) {
        setSamples(driveItems);
        setSuccessNotice(`Synced ${driveItems.length} one-shots from Google Drive vault.`);
      }
    } catch (err: any) {
      console.warn('Failed loading from Drive:', err);
    } finally {
      setIsSyncingDrive(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setAccessToken(result.accessToken);
        const newUser = {
          uid: result.user.uid,
          name: result.user.displayName || 'Producer',
          email: result.user.email || '',
          photo: result.user.photoURL || ''
        };
        setCurrentUser(newUser);
        if (onUpdateUser) onUpdateUser(newUser);
        
        if (isAuthorizedForVault(result.user.email)) {
          setSuccessNotice(`Welcome to the Vault, ${result.user.email}!`);
          await loadFromDrive(result.accessToken);
        } else {
          setErrorMessage(`Access restricted. "${result.user.email}" is not authorized for this private feature.`);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Sign-In failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Drag & drop or file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setErrorMessage(null);
    setSuccessNotice(null);

    const fileList = Array.from(files);
    setIsAnalyzing(true);

    let addedCount = 0;
    const currentSamples = [...samples];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setAnalyzeStatus(`[${i + 1}/${fileList.length}] Analyzing "${file.name}" (Transients & Key)...`);

      try {
        // Step 1: Client Web Audio Analysis & Loop Guard (Strictly < 3.0s, no repetitive loops)
        const { acoustic } = await analyzeOneShotAudio(file);

        // Step 2: Auto-detect category from file name if not forced
        let category: DrumOneShotCategory = targetCategory;
        const lowerName = file.name.toLowerCase();
        if (lowerName.includes('808') || lowerName.includes('sub')) category = '808s';
        else if (lowerName.includes('kick')) category = 'kicks';
        else if (lowerName.includes('clap') || lowerName.includes('snap')) category = 'claps';
        else if (lowerName.includes('snare') || lowerName.includes('rim')) category = 'snares';
        else if (lowerName.includes('hat') || lowerName.includes('hh')) category = 'hihats';
        else if (lowerName.includes('perc') || lowerName.includes('shaker') || lowerName.includes('open')) category = 'percs';

        setAnalyzeStatus(`[${i + 1}/${fileList.length}] AI classifying "${file.name}" & generating UAD guidance...`);

        // Step 3: Server-side AI Enrichment (Gemini)
        const aiAnalysis = await getAiOneShotGuidance({
          fileName: file.name,
          category,
          acoustic
        });

        const newId = `vault-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const localBlobUrl = URL.createObjectURL(file);

        const newItem: SampleVaultItem = {
          id: newId,
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
    if (!accessToken) {
      setErrorMessage('Google Drive access token missing. Please sign in with your authorized Google account.');
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
      const files = await listFilesInDriveFolder(folderId, accessToken);
      setScannedFiles(files);
      if (files.length === 0) {
        setErrorMessage(`No audio files (.wav, .mp3, .aif, .flac) found in that Google Drive folder.`);
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
    if (!detectedFolderId || scannedFiles.length === 0 || !accessToken) return;

    setIsMigratingDriveFolder(true);
    setErrorMessage(null);
    setSuccessNotice(null);
    setMigrationRejections([]);

    const rootFolderId = await getOrCreateDriveFolder('Beatgangsta Sample Vault', undefined, accessToken);
    const categoryFolderMap: Record<DrumOneShotCategory, string> = {
      kicks: await getOrCreateDriveFolder('01_Kicks', rootFolderId, accessToken),
      '808s': await getOrCreateDriveFolder('02_808s', rootFolderId, accessToken),
      claps: await getOrCreateDriveFolder('03_Claps', rootFolderId, accessToken),
      snares: await getOrCreateDriveFolder('04_Snares', rootFolderId, accessToken),
      hihats: await getOrCreateDriveFolder('05_HiHats', rootFolderId, accessToken),
      percs: await getOrCreateDriveFolder('06_Percs', rootFolderId, accessToken)
    };

    let movedCount = 0;
    const rejections: Array<{ name: string; reason: string }> = [];
    const updatedVault = [...samples];

    for (let i = 0; i < scannedFiles.length; i++) {
      const driveFile = scannedFiles[i];
      setMigrationProgress({
        current: i + 1,
        total: scannedFiles.length,
        fileName: driveFile.name
      });

      try {
        // 1. Download file blob into memory for acoustic analysis
        const blob = await downloadDriveFileAsBlob(driveFile.id, accessToken);
        const virtualFile = new File([blob], driveFile.name, { type: driveFile.mimeType || 'audio/wav' });

        // 2. Strict One-Shot Loop Guard & Pitch/Transient Analysis
        const { acoustic } = await analyzeOneShotAudio(virtualFile);

        // 3. Category Detection
        let category: DrumOneShotCategory = 'percs';
        const lowerName = driveFile.name.toLowerCase();
        if (lowerName.includes('808') || lowerName.includes('sub')) category = '808s';
        else if (lowerName.includes('kick')) category = 'kicks';
        else if (lowerName.includes('clap') || lowerName.includes('snap')) category = 'claps';
        else if (lowerName.includes('snare') || lowerName.includes('rim')) category = 'snares';
        else if (lowerName.includes('hat') || lowerName.includes('hh')) category = 'hihats';
        else if (lowerName.includes('perc') || lowerName.includes('shaker') || lowerName.includes('open')) category = 'percs';

        // 4. AI Acoustic Classifier & UAD Mixing Enrichment
        const aiAnalysis = await getAiOneShotGuidance({
          fileName: driveFile.name,
          category,
          acoustic
        });

        // 5. ZERO-DUPLICATION NATIVE MOVE in Google Drive:
        // Updates parent pointer from source folder to target category folder
        // CONSUMES 0 BYTES OF EXTRA STORAGE!
        const targetCategoryFolderId = categoryFolderMap[category];
        await moveDriveFile(driveFile.id, detectedFolderId, targetCategoryFolderId, accessToken);

        // 6. Generate Vault record
        const newItem: SampleVaultItem = {
          id: `vault-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: driveFile.name.replace(/\.[^/.]+$/, ''),
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
          fileUrl: URL.createObjectURL(blob),
          driveFileId: driveFile.id,
          driveFolderId: targetCategoryFolderId,
          uploadedAt: new Date().toISOString(),
          userEmail: currentUser?.email || 'coldestconcept@gmail.com'
        };

        updatedVault.unshift(newItem);
        movedCount++;
      } catch (err: any) {
        console.warn(`File ${driveFile.name} was rejected or failed:`, err);
        rejections.push({
          name: driveFile.name,
          reason: err.message || 'Analysis rejected (loop or unreadable format)'
        });
      }
    }

    setSamples(updatedVault);
    setMigrationRejections(rejections);
    setIsMigratingDriveFolder(false);

    if (movedCount > 0) {
      await syncVaultIndexToDrive(updatedVault, accessToken);
      setSuccessNotice(
        `🚀 Zero-Duplication Migration Complete! Moved and cataloged ${movedCount} one-shot(s) without using any extra Google Drive storage quota.`
      );
    }
  };

  const handleDeleteSample = async (sample: SampleVaultItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${sample.name}" from your BeatGangsta Vault and Google Drive? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      if (sample.driveFileId && accessToken) {
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
    // Stop any active dual playback
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

      // Fetch or decode audio buffers
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
      setErrorMessage('Your Vault is currently empty. Add drum one-shots first!');
      return;
    }

    const summary = samples.map(s => 
      `- ${s.name} (${s.category.toUpperCase()}): ${s.exactType} | Key: ${s.detectedKey} (${s.fundamentalHz}Hz) | Punch: ${s.punchFrequencyHz}Hz | Tags: [${s.tags.slice(0, 3).join(', ')}]`
    ).join('\n');

    const fullExport = `=== BEATGANGSTA DRUM VAULT INVENTORY ===
Total One-Shots: ${samples.length}
Owner: ${currentUser?.email || 'coldestconcept@gmail.com'}
Google Drive Synced: ${accessToken ? 'YES' : 'LOCAL'}

SAMPLES:
${summary}

Mixer Note: These are verified one-shots (no loops). Please reference these exact samples and their fundamentals when designing drum bus processing and vocal EQ pockets.`;

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
        className="w-full max-w-6xl h-[94vh] flex flex-col rounded-[2.5rem] bg-[#030712] border border-cyan-500/30 text-cyan-50 shadow-[0_0_60px_rgba(6,182,212,0.18)] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-cyan-900/40 bg-gradient-to-r from-cyan-950/40 via-black to-blue-950/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Disc className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-wider uppercase bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                  BeatGangsta Drum Vault
                </h2>
                <span className="text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  EXCLUSIVE VIP
                </span>
              </div>
              <p className="text-xs text-cyan-400/70 font-mono">
                AI Acoustic Classifier • Zero-Duplication Drive Mover • Intelligent Harmonic Matching • One-Shots Only
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthorized && (
              <button
                onClick={handleExportFullVaultForChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-bold transition-all shadow-md active:scale-95"
                title="Copy vault inventory so the assistant can guide you with your exact samples"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export for Chat</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-cyan-900/40 text-cyan-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security / VIP Gate Check */}
        {!isAuthorized ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-6 shadow-xl">
              <Lock className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-wider mb-2 text-white">
              Private Sound Vault
            </h3>
            <p className="text-sm text-cyan-200/70 mb-6 leading-relaxed">
              This feature is strictly reserved for <span className="text-cyan-300 font-bold">coldestconcept@gmail.com</span> and <span className="text-cyan-300 font-bold">recognizemiracles@gmail.com</span>. Please authenticate with your authorized Google Account to unlock your cloud-synced one-shot database.
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
            <div className="px-6 py-2.5 bg-cyan-950/30 border-b border-cyan-900/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('vault')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'vault'
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                      : 'bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-800/40'
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
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-500/30 font-black'
                      : 'bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 border border-amber-800/40'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>AI Intelligent Pairing (Game Changer)</span>
                </button>

                <button
                  onClick={() => setActiveTab('drive-import')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'drive-import'
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-blue-950/30 hover:bg-blue-900/40 text-blue-300 border border-blue-800/40'
                  }`}
                >
                  <FolderInput className="w-4 h-4" />
                  <span>Move from Drive Folder</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden md:inline">{currentUser?.email}</span>
                </span>
                <button
                  onClick={() => accessToken && loadFromDrive(accessToken)}
                  disabled={isSyncingDrive}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-200 font-bold transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDrive ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
              </div>
            </div>

            {/* Notification Banners */}
            {errorMessage && (
              <div className="mx-6 mt-3 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span className="font-mono">{errorMessage}</span>
                </div>
                <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white">✕</button>
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
                <div className="p-5 border-b border-cyan-900/40 bg-gradient-to-b from-cyan-950/10 to-transparent">
                  <div className="relative border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-3xl p-5 bg-cyan-950/20 hover:bg-cyan-950/30 transition-all text-center group cursor-pointer"
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
                      <div className="p-2.5 rounded-2xl bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-400 transition-colors">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                          Drop drum one-shots here or click to browse (.wav, .mp3, .aif)
                        </p>
                        <p className="text-xs text-cyan-400/80 font-mono mt-0.5">
                          🚨 <strong className="text-cyan-300">ONE-SHOTS ONLY:</strong> Max 3.0s duration • Automatic loop rejection & transient filtering.
                        </p>
                      </div>
                    </div>

                    {isAnalyzing && (
                      <div className="mt-3 p-2.5 rounded-2xl bg-black/80 border border-cyan-500/40 text-cyan-300 text-xs flex items-center justify-center gap-2 animate-pulse">
                        <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                        <span className="font-mono">{analyzeStatus || 'Analyzing sample transients & tuning...'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="px-6 py-2.5 border-b border-cyan-900/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {(['all', 'kicks', '808s', 'claps', 'snares', 'hihats', 'percs'] as const).map((cat) => {
                    const count = categoryCounts[cat];
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 ${
                          isActive
                            ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30 scale-105'
                            : 'bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300/80 border border-cyan-800/40'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${isActive ? 'bg-black/20 text-black' : 'bg-cyan-900/60 text-cyan-300'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Samples List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {filteredSamples.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center text-cyan-400/50">
                      <Disc className="w-12 h-12 mb-3 opacity-30" />
                      <p className="text-sm font-bold">No one-shots in this category yet.</p>
                      <p className="text-xs font-mono mt-1 text-cyan-500/50">
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
                          className="rounded-2xl bg-cyan-950/20 hover:bg-cyan-950/30 border border-cyan-900/40 hover:border-cyan-500/40 transition-all p-3.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            {/* Play & Title */}
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <button
                                onClick={() => handlePlaySample(sample)}
                                className={`p-2.5 rounded-xl border transition-all ${
                                  isPlaying
                                    ? 'bg-cyan-400 text-black border-cyan-300 shadow-md scale-105'
                                    : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50 hover:bg-cyan-900'
                                }`}
                              >
                                {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                              </button>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-white tracking-wide">{sample.name}</h4>
                                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                                    {sample.exactType}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-cyan-400/70 font-mono mt-0.5">
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
                              <div className="px-3 py-1 rounded-xl bg-cyan-900/30 border border-cyan-500/30 text-center">
                                <span className="text-[9px] uppercase tracking-wider block text-cyan-400/70">Key / Pitch</span>
                                <span className="text-xs font-black text-cyan-200">
                                  {sample.detectedKey} {sample.fundamentalHz > 0 ? `(${sample.fundamentalHz} Hz)` : ''}
                                </span>
                              </div>

                              {sample.punchFrequencyHz && (
                                <div className="px-3 py-1 rounded-xl bg-blue-900/30 border border-blue-500/30 text-center">
                                  <span className="text-[9px] uppercase tracking-wider block text-blue-400/70">Punch Peak</span>
                                  <span className="text-xs font-black text-blue-200">
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
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm active:scale-95"
                                title="Open Intelligent Pairing Matrix to find complementary 808/Kick/Clap stacks"
                              >
                                <Zap className="w-3.5 h-3.5 fill-current" />
                                <span>Pair</span>
                              </button>

                              <button
                                onClick={() => handleCopySampleProfile(sample)}
                                className="p-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 text-xs transition-colors"
                                title="Copy sample profile to clipboard for chat guidance"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setExpandedSampleId(isExpanded ? null : sample.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-colors"
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
                                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300/80 border border-cyan-800/40"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Expandable AI Guidance Drawer */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-cyan-900/40 bg-black/40 rounded-xl p-3.5 space-y-2.5 animate-in fade-in duration-200">
                              <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Mixing Advice & Plugin Recommendations</span>
                                </span>
                                <p className="text-xs text-cyan-100/90 leading-relaxed font-sans">
                                  {sample.guidance.mixingAdvice}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-900/50">
                                  <span className="text-[10px] font-bold uppercase text-cyan-400 block mb-1">
                                    EQ Strategy (Rap / Trap Pocket)
                                  </span>
                                  <p className="text-cyan-200/90 text-[11px] font-mono">
                                    {sample.guidance.eqNotes}
                                  </p>
                                </div>

                                <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-900/50">
                                  <span className="text-[10px] font-bold uppercase text-cyan-400 block mb-1">
                                    Drum Bus Pairing Tips
                                  </span>
                                  <p className="text-cyan-200/90 text-[11px] font-mono">
                                    {sample.guidance.pairingTips}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[10px] font-bold uppercase text-cyan-400/80">
                                  Recommended Chain:
                                </span>
                                {sample.guidance.recommendedPlugins.map((plug, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40"
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
                <div className="w-full md:w-5/12 border-r border-cyan-900/40 flex flex-col overflow-hidden bg-cyan-950/10">
                  <div className="p-4 border-b border-cyan-900/40 bg-black/40">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1.5">
                      1. Select Anchor Sample
                    </label>
                    <select
                      value={pairingFocusSample?.id || ''}
                      onChange={(e) => {
                        const target = samples.find(s => s.id === e.target.value);
                        if (target) setPairingFocusSample(target);
                      }}
                      className="w-full bg-cyan-950/80 border border-cyan-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                    >
                      {samples.map((s) => (
                        <option key={s.id} value={s.id} className="bg-gray-900 text-white">
                          [{s.category.toUpperCase()}] {s.name} ({s.detectedKey} • {s.punchFrequencyHz || s.fundamentalHz}Hz)
                        </option>
                      ))}
                    </select>

                    {pairingFocusSample && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80 block">Active Anchor</span>
                          <h4 className="text-xs font-bold text-white">{pairingFocusSample.name}</h4>
                          <span className="text-[11px] font-mono text-amber-200">
                            Key: {pairingFocusSample.detectedKey} | Punch: {pairingFocusSample.punchFrequencyHz || pairingFocusSample.fundamentalHz}Hz
                          </span>
                        </div>
                        <button
                          onClick={() => handlePlaySample(pairingFocusSample)}
                          className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Scored Complementary Matches */}
                  <div className="p-3 border-b border-cyan-900/40 bg-cyan-950/20 flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">
                      ⚡ AI Ranked Stack Candidates ({topMatches.length})
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400/60">Harmonic & Frequency Sorted</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {topMatches.length === 0 ? (
                      <div className="p-8 text-center text-cyan-400/50 text-xs">
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
                                ? 'bg-amber-950/40 border-amber-400 shadow-md shadow-amber-500/10'
                                : 'bg-cyan-950/20 border-cyan-900/40 hover:bg-cyan-950/40 hover:border-cyan-700/60'
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

                            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300/80">
                              <span>
                                [{pair.sampleB.category.toUpperCase()}] {pair.sampleB.detectedKey}
                              </span>
                              <span className="text-amber-300/90 font-bold">{pair.harmonicRelationship}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column: Deep Synergy Matrix & Live Dual Audition Player */}
                <div className="w-full md:w-7/12 flex flex-col overflow-y-auto p-5 space-y-4 bg-gradient-to-br from-black via-cyan-950/10 to-blue-950/20">
                  {selectedMatch ? (
                    <>
                      {/* Live Simultaneous Audition Player */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-black to-orange-950/30 border border-amber-500/40 shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">
                              Simultaneous Dual Audition Engine
                            </h3>
                          </div>
                          <button
                            onClick={() => handleCopyPairingRecipe(selectedMatch)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-[11px] font-bold"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Pairing Recipe</span>
                          </button>
                        </div>

                        {/* Player Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-black/60 border border-cyan-900/40">
                          <button
                            onClick={() => handleDualAuditionPlay(selectedMatch)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg active:scale-95 ${
                              isDualPlaying
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:brightness-110'
                            }`}
                          >
                            {isDualPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                            <span>{isDualPlaying ? 'Stop Stack Audition' : 'Play Stack in Sync'}</span>
                          </button>

                          {/* Solo / Dual Toggles */}
                          <div className="flex items-center gap-1 bg-cyan-950/60 p-1 rounded-lg border border-cyan-800/40 text-[11px] font-bold">
                            <button
                              onClick={() => setDualSoloMode('both')}
                              className={`px-2.5 py-1 rounded-md transition-colors ${
                                dualSoloMode === 'both' ? 'bg-amber-500 text-black' : 'text-cyan-300 hover:text-white'
                              }`}
                            >
                              Both Layered
                            </button>
                            <button
                              onClick={() => setDualSoloMode('sampleA')}
                              className={`px-2.5 py-1 rounded-md transition-colors ${
                                dualSoloMode === 'sampleA' ? 'bg-cyan-500 text-black' : 'text-cyan-300 hover:text-white'
                              }`}
                            >
                              Solo {selectedMatch.sampleA.category}
                            </button>
                            <button
                              onClick={() => setDualSoloMode('sampleB')}
                              className={`px-2.5 py-1 rounded-md transition-colors ${
                                dualSoloMode === 'sampleB' ? 'bg-cyan-500 text-black' : 'text-cyan-300 hover:text-white'
                              }`}
                            >
                              Solo {selectedMatch.sampleB.category}
                            </button>
                          </div>
                        </div>

                        {/* Micro-Offset Timing Slider */}
                        <div className="mt-3 p-3 rounded-xl bg-black/40 border border-cyan-900/30">
                          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                            <span className="text-cyan-300">
                              Micro-Nudge Transient Offset: <strong className="text-amber-400">{microOffsetMs > 0 ? `+${microOffsetMs}` : microOffsetMs} ms</strong>
                            </span>
                            <span className="text-[10px] text-cyan-400/60">
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
                            className="w-full accent-amber-400 cursor-pointer"
                          />
                          <div className="flex justify-between text-[9px] font-mono text-cyan-500/60 mt-0.5">
                            <span>-30ms (Pre-Shift)</span>
                            <span>0ms (Sample Accurate)</span>
                            <span>+30ms (Slapback Delay)</span>
                          </div>
                        </div>
                      </div>

                      {/* Acoustic & Harmonic Breakdown Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/50">
                          <span className="text-[10px] font-bold uppercase text-cyan-400 block mb-1">
                            Harmonic Alignment
                          </span>
                          <div className="text-sm font-black text-amber-300">
                            {selectedMatch.harmonicRelationship}
                          </div>
                          <span className="text-[11px] font-mono text-cyan-200 block mt-1">
                            Score: {selectedMatch.harmonicScore}/100
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/50">
                          <span className="text-[10px] font-bold uppercase text-cyan-400 block mb-1">
                            Sub-Bass Pocket Gap
                          </span>
                          <div className="text-sm font-black text-emerald-300">
                            {selectedMatch.frequencyScore}/100 Clarity
                          </div>
                          <span className="text-[11px] font-mono text-cyan-200 block mt-1">
                            Zero Frequency Clash
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/50">
                          <span className="text-[10px] font-bold uppercase text-cyan-400 block mb-1">
                            Envelope Blend
                          </span>
                          <div className="text-sm font-black text-sky-300">
                            {selectedMatch.envelopeScore}/100 Synergy
                          </div>
                          <span className="text-[11px] font-mono text-cyan-200 block mt-1">
                            Attack & Decay Locked
                          </span>
                        </div>
                      </div>

                      {/* Frequency Analysis Card */}
                      <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-900/40">
                        <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5 mb-1">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Spectral Pocket Analysis</span>
                        </span>
                        <p className="text-xs text-cyan-100 font-sans leading-relaxed">
                          {selectedMatch.frequencyPocketAnalysis}
                        </p>
                      </div>

                      {/* UAD Mixing Recipe (Strictly Software Controls) */}
                      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2.5">
                        <span className="text-xs font-black uppercase text-cyan-300 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-cyan-400" />
                          <span>UAD Software Mix Chain & Carving Strategy</span>
                        </span>

                        <div className="text-xs text-cyan-200/90 font-mono leading-relaxed bg-black/40 p-3 rounded-lg border border-cyan-900/50">
                          <strong className="text-cyan-300">EQ Carve:</strong> {selectedMatch.uadSoftwareProcessing.eqPocketStrategy}
                        </div>

                        <div className="text-xs text-cyan-200/90 font-mono leading-relaxed bg-black/40 p-3 rounded-lg border border-cyan-900/50">
                          <strong className="text-cyan-300">Dynamics & Sidechain:</strong> {selectedMatch.uadSoftwareProcessing.dynamicsTip}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold uppercase text-cyan-400/80">
                            Plugins:
                          </span>
                          {selectedMatch.uadSoftwareProcessing.recommendedPlugins.map((plug, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60"
                            >
                              {plug}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-cyan-400/50 p-8">
                      <Zap className="w-12 h-12 mb-3 text-amber-400/30" />
                      <p className="text-sm font-bold text-white">Select a stack candidate on the left</p>
                      <p className="text-xs font-mono mt-1 text-cyan-400/60">
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
                <div className="p-6 rounded-3xl bg-cyan-950/20 border border-cyan-500/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                      <FolderInput className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase text-white">
                        Move One-Shots from Google Drive Folder
                      </h3>
                      <p className="text-xs text-cyan-300/80 font-mono">
                        Zero-Duplication Native Move: Organizes files into your Vault without copying or consuming double storage quota.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-cyan-400 block">
                      Google Drive Folder Link or Folder ID
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={driveFolderInput}
                        onChange={(e) => setDriveFolderInput(e.target.value)}
                        placeholder="https://drive.google.com/drive/folders/1aBcDeFg... or Folder ID"
                        className="flex-1 bg-black/60 border border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-cyan-700 focus:outline-none focus:border-cyan-300"
                      />
                      <button
                        onClick={handleScanDriveFolder}
                        disabled={isScanningFolder || isMigratingDriveFolder}
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black transition-all shadow-md active:scale-95 disabled:opacity-50"
                      >
                        {isScanningFolder ? 'Scanning...' : 'Scan Folder'}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/50 text-xs text-blue-200/90 leading-relaxed font-sans">
                    💡 <strong>How Zero-Duplication Moving Works:</strong> This operation calls Google Drive's API to update the file's parent folder directly on Google's servers (`addParents` & `removeParents`). The audio data is not cloned or duplicated, so your Google Drive storage quota remains 100% free of duplicates!
                  </div>
                </div>

                {/* Scanned Files List & Move Action */}
                {scannedFiles.length > 0 && (
                  <div className="p-6 rounded-3xl bg-cyan-950/20 border border-cyan-900/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Discovered Audio Files ({scannedFiles.length})
                        </h4>
                        <p className="text-xs text-cyan-400/70 font-mono">
                          Ready for pitch analysis, loop rejection, and native folder move.
                        </p>
                      </div>

                      <button
                        onClick={handleMigrateAndMoveDriveFolder}
                        disabled={isMigratingDriveFolder}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-blue-500/30 active:scale-95 disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                        <span>{isMigratingDriveFolder ? 'Moving & Analyzing...' : 'Start Zero-Duplication Move'}</span>
                      </button>
                    </div>

                    {isMigratingDriveFolder && (
                      <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/40 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                          <span>Progress: {migrationProgress.current} / {migrationProgress.total}</span>
                          <span className="truncate max-w-[250px]">{migrationProgress.fileName}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-cyan-950 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
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
                          className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-cyan-900/30 text-xs font-mono"
                        >
                          <span className="text-white truncate max-w-[350px]">{file.name}</span>
                          <span className="text-cyan-400/70 text-[11px]">{file.mimeType}</span>
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
