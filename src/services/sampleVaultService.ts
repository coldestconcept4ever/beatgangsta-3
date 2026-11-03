import { SampleVaultItem, DrumOneShotCategory } from '../types';
import JSZip from 'jszip';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function frequencyToNote(freq: number): { note: string; cents: number } {
  if (freq < 16) return { note: 'Atonal / Low Sub', cents: 0 };
  const midi = 69 + 12 * Math.log2(freq / 440);
  const roundedMidi = Math.round(midi);
  const noteIndex = ((roundedMidi % 12) + 12) % 12;
  const octave = Math.floor(roundedMidi / 12) - 1;
  const cents = Math.round((midi - roundedMidi) * 100);
  return {
    note: `${NOTE_NAMES[noteIndex]}${octave}`,
    cents
  };
}

export interface AcousticAnalysisResult {
  durationSeconds: number;
  fundamentalHz: number;
  detectedKey: string;
  centsDetune: number;
  punchFrequencyHz: number;
  attackMs: number;
  decayMs: number;
  peakDb: number;
  isOneShot: boolean;
  rejectionReason?: string;
}

/**
 * Strict One-Shot and Acoustic Feature Extractor
 * Enforces NO LOOPS (<= 3.0 seconds, no rhythmic multi-hit sequences)
 */
export async function analyzeOneShotAudio(file: File): Promise<{
  acoustic: AcousticAnalysisResult;
  audioBuffer: AudioBuffer;
}> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: 44100
  });

  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const duration = audioBuffer.duration;

    // GUARD 1: Max duration limit (3.0 seconds max for one-shots)
    if (duration > 3.0) {
      throw new Error(
        `File rejected: Duration is ${duration.toFixed(2)}s. BeatGangsta Vault strictly accepts single-hit one-shots under 3.0 seconds (no loops).`
      );
    }

    if (duration < 0.03) {
      throw new Error('File rejected: Audio file is too short to be a valid drum sample.');
    }

    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;

    // GUARD 2: Rhythm & Multi-Hit Loop Detector
    // Detect rhythmic transients / multi-beat patterns
    const windowSize = Math.floor(sampleRate * 0.04); // 40ms windows
    const numWindows = Math.floor(channelData.length / windowSize);
    const windowEnergies: number[] = [];

    for (let i = 0; i < numWindows; i++) {
      let sumSq = 0;
      const start = i * windowSize;
      for (let j = 0; j < windowSize; j++) {
        const val = channelData[start + j];
        sumSq += val * val;
      }
      windowEnergies.push(Math.sqrt(sumSq / windowSize));
    }

    let maxEnergy = 0;
    for (const e of windowEnergies) {
      if (e > maxEnergy) maxEnergy = e;
    }

    // Detect onsets where energy spikes above threshold
    const onsetThreshold = maxEnergy * 0.35;
    let distinctOnsets = 0;
    let lastOnsetIdx = -10;

    for (let i = 1; i < windowEnergies.length - 1; i++) {
      if (
        windowEnergies[i] > onsetThreshold &&
        windowEnergies[i] > windowEnergies[i - 1] &&
        windowEnergies[i] >= windowEnergies[i + 1] &&
        i - lastOnsetIdx > 3 // at least 120ms apart
      ) {
        distinctOnsets++;
        lastOnsetIdx = i;
      }
    }

    // If 3 or more strong distinct onsets are detected across more than 0.8 seconds, it's a drum loop
    if (distinctOnsets >= 3 && duration > 0.8) {
      throw new Error(
        `Loop detected (${distinctOnsets} rhythmic transient hits found across ${duration.toFixed(1)}s). The Vault only accepts isolated single-hit one-shots.`
      );
    }

    // Acoustic Metrics: Peak amplitude
    let peakAbs = 0;
    let peakIndex = 0;
    for (let i = 0; i < channelData.length; i++) {
      const abs = Math.abs(channelData[i]);
      if (abs > peakAbs) {
        peakAbs = abs;
        peakIndex = i;
      }
    }
    const peakDb = peakAbs > 0 ? Math.max(-96, Math.round(20 * Math.log10(peakAbs) * 10) / 10) : -96;

    // Attack time (time from start to peak)
    const attackMs = Math.round((peakIndex / sampleRate) * 1000 * 10) / 10;

    // Decay time (time from peak until amplitude drops below 10% of peak)
    const decayThreshold = peakAbs * 0.1;
    let decayIndex = channelData.length - 1;
    for (let i = peakIndex; i < channelData.length; i++) {
      if (Math.abs(channelData[i]) < decayThreshold) {
        // check next 10ms to ensure it's not a momentary zero-crossing
        let stayedLow = true;
        const checkWindow = Math.min(channelData.length, i + Math.floor(sampleRate * 0.01));
        for (let k = i; k < checkWindow; k++) {
          if (Math.abs(channelData[k]) > decayThreshold * 1.5) {
            stayedLow = false;
            break;
          }
        }
        if (stayedLow) {
          decayIndex = i;
          break;
        }
      }
    }
    const decayMs = Math.round(((decayIndex - peakIndex) / sampleRate) * 1000 * 10) / 10;

    // Fundamental Frequency Detection using Autocorrelation
    // Tailored for bass, 808s, and tonal drums (25 Hz to 900 Hz)
    const minFreq = 25;
    const maxFreq = 950;
    const minPeriod = Math.floor(sampleRate / maxFreq);
    const maxPeriod = Math.floor(sampleRate / minFreq);

    // Take an analysis slice from the sustained portion (after attack)
    const sliceStart = Math.min(peakIndex, Math.floor(sampleRate * 0.05));
    const sliceLen = Math.min(channelData.length - sliceStart, Math.floor(sampleRate * 0.3));
    
    let bestCorrelation = -1;
    let bestPeriod = -1;

    if (sliceLen > maxPeriod) {
      for (let lag = minPeriod; lag <= maxPeriod; lag++) {
        let sum = 0;
        let norm1 = 0;
        let norm2 = 0;
        const compareLen = sliceLen - lag;

        for (let i = 0; i < compareLen; i++) {
          const a = channelData[sliceStart + i];
          const b = channelData[sliceStart + i + lag];
          sum += a * b;
          norm1 += a * a;
          norm2 += b * b;
        }

        const denom = Math.sqrt(norm1 * norm2);
        const corr = denom > 0 ? sum / denom : 0;

        if (corr > bestCorrelation) {
          bestCorrelation = corr;
          bestPeriod = lag;
        }
      }
    }

    let fundamentalHz = 0;
    let detectedKey = 'Atonal / Transient';
    let centsDetune = 0;

    if (bestCorrelation > 0.55 && bestPeriod > 0) {
      fundamentalHz = Math.round((sampleRate / bestPeriod) * 10) / 10;
      const noteInfo = frequencyToNote(fundamentalHz);
      detectedKey = noteInfo.note;
      centsDetune = noteInfo.cents;
    }

    // Dominant Frequency Peak via fast Discrete Fourier transform on window
    const fftSize = 1024;
    const fftBuffer = new Float32Array(fftSize);
    const fftStart = Math.max(0, peakIndex - Math.floor(fftSize / 4));
    for (let i = 0; i < fftSize && fftStart + i < channelData.length; i++) {
      fftBuffer[i] = channelData[fftStart + i];
    }

    let maxMag = 0;
    let punchFrequencyHz = fundamentalHz > 0 ? fundamentalHz : 120;

    // Search spectrum up to 8 kHz
    const maxBin = Math.min(Math.floor(fftSize / 2), Math.floor((8000 / sampleRate) * fftSize));
    for (let k = 1; k < maxBin; k++) {
      let real = 0;
      let imag = 0;
      for (let n = 0; n < fftSize; n++) {
        const angle = (2 * Math.PI * k * n) / fftSize;
        real += fftBuffer[n] * Math.cos(angle);
        imag -= fftBuffer[n] * Math.sin(angle);
      }
      const mag = real * real + imag * imag;
      if (mag > maxMag) {
        maxMag = mag;
        punchFrequencyHz = Math.round((k * sampleRate) / fftSize);
      }
    }

    return {
      acoustic: {
        durationSeconds: Math.round(duration * 100) / 100,
        fundamentalHz,
        detectedKey,
        centsDetune,
        punchFrequencyHz,
        attackMs,
        decayMs,
        peakDb,
        isOneShot: true
      },
      audioBuffer
    };
  } finally {
    audioContext.close();
  }
}

/**
 * Call Server-Side AI (Gemini) to classify one-shot and provide custom production guidance
 */
export async function getAiOneShotGuidance(params: {
  fileName: string;
  category: DrumOneShotCategory;
  acoustic: AcousticAnalysisResult;
}): Promise<{
  exactType: string;
  tags: string[];
  guidance: {
    mixingAdvice: string;
    eqNotes: string;
    recommendedPlugins: string[];
    pairingTips: string;
  };
}> {
  const response = await fetch('/api/sample-vault/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `AI sample analysis failed with status ${response.status}`);
  }

  return await response.json();
}

/**
 * Google Drive Client Storage Integration for Sample Vault
 */
const VAULT_ROOT_FOLDER_NAME = 'Beatgangsta Sample Vault';

export async function getOrCreateDriveFolder(
  folderName: string,
  parentId?: string,
  accessToken?: string
): Promise<string> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };

  let query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const listRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&spaces=drive`,
    { headers }
  );

  if (!listRes.ok) {
    throw new Error(`Failed to query Google Drive folder "${folderName}" (${listRes.status})`);
  }

  const listData = await listRes.json();
  if (listData.files && listData.files.length > 0) {
    return listData.files[0].id;
  }

  // Create folder
  const createPayload: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };
  if (parentId) {
    createPayload.parents = [parentId];
  }

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers,
    body: JSON.stringify(createPayload)
  });

  if (!createRes.ok) {
    throw new Error(`Failed to create Google Drive folder "${folderName}"`);
  }

  const created = await createRes.json();
  return created.id;
}

export async function uploadSampleToDrive(
  file: File,
  category: DrumOneShotCategory,
  item: SampleVaultItem,
  accessToken: string
): Promise<{ fileId: string; folderId: string }> {
  // 1. Root folder
  const rootId = await getOrCreateDriveFolder(VAULT_ROOT_FOLDER_NAME, undefined, accessToken);

  // 2. Category subfolder
  const categoryFolders: Record<DrumOneShotCategory, string> = {
    kicks: '01_Kicks',
    '808s': '02_808s',
    claps: '03_Claps',
    snares: '04_Snares',
    hihats: '05_HiHats',
    percs: '06_Percs'
  };

  const catFolderName = categoryFolders[category] || '06_Percs';
  const catFolderId = await getOrCreateDriveFolder(catFolderName, rootId, accessToken);

  // 3. Upload audio file to category folder via Google Drive Multipart API
  const metadata = {
    name: file.name,
    parents: [catFolderId],
    description: JSON.stringify({
      exactType: item.exactType,
      detectedKey: item.detectedKey,
      fundamentalHz: item.fundamentalHz,
      tags: item.tags
    })
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const fileData = await file.arrayBuffer();
  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const fileHeader = `${delimiter}Content-Type: ${file.type || 'audio/wav'}\r\nContent-Transfer-Encoding: base64\r\n\r\n`;

  // Encode file to base64
  let binary = '';
  const bytes = new Uint8Array(fileData);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64Audio = btoa(binary);

  const multipartBody = metadataPart + fileHeader + base64Audio + closeDelimiter;

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartBody
    }
  );

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    console.error('Google Drive Upload Error:', errText);
    throw new Error(`Failed to upload sample "${file.name}" to Google Drive`);
  }

  const uploadedFile = await uploadRes.json();
  return {
    fileId: uploadedFile.id,
    folderId: catFolderId
  };
}

export async function syncVaultIndexToDrive(
  items: SampleVaultItem[],
  accessToken: string
): Promise<void> {
  const rootId = await getOrCreateDriveFolder(VAULT_ROOT_FOLDER_NAME, undefined, accessToken);

  // Check if vault_index.json already exists in root folder
  const checkRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      `name = 'vault_index.json' and '${rootId}' in parents and trashed = false`
    )}&fields=files(id)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  const jsonContent = JSON.stringify(items, null, 2);
  const checkData = await checkRes.json();

  if (checkData.files && checkData.files.length > 0) {
    // Update existing index
    const indexId = checkData.files[0].id;
    await fetch(`https://www.googleapis.com/upload/drive/v3/files/${indexId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: jsonContent
    });
  } else {
    // Create new index
    const metadata = {
      name: 'vault_index.json',
      parents: [rootId],
      mimeType: 'application/json'
    };

    const boundary = '-------314159265358979323846';
    const multipartBody =
      `\r\n--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
        metadata
      )}\r\n` +
      `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${jsonContent}\r\n` +
      `\r\n--${boundary}--`;

    await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartBody
    });
  }
}

export async function fetchVaultIndexFromDrive(
  accessToken: string
): Promise<SampleVaultItem[] | null> {
  try {
    const rootId = await getOrCreateDriveFolder(VAULT_ROOT_FOLDER_NAME, undefined, accessToken);
    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        `name = 'vault_index.json' and '${rootId}' in parents and trashed = false`
      )}&fields=files(id)`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!listRes.ok) return null;
    const listData = await listRes.json();
    if (!listData.files || listData.files.length === 0) return null;

    const fileId = listData.files[0].id;
    const contentRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!contentRes.ok) return null;
    const items = await contentRes.json();
    return Array.isArray(items) ? items : null;
  } catch (err) {
    console.warn('Failed to fetch vault index from Drive:', err);
    return null;
  }
}

export async function deleteSampleFromDrive(fileId: string, accessToken: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Failed to delete sample file from Google Drive (${res.status})`);
  }
}

/**
 * Parses any Google Drive URL (folders, files, shortcuts, custom query links) or raw ID
 */
export function extractDriveFolderId(input: string): string {
  const trimmed = input.trim();
  // Matches /folders/([a-zA-Z0-9_-]+)
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) return folderMatch[1];
  // Matches /file/d/([a-zA-Z0-9_-]+)
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];
  // Matches ?id=([a-zA-Z0-9_-]+) or &id=([a-zA-Z0-9_-]+)
  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch && queryMatch[1]) return queryMatch[1];
  // Matches bare Drive IDs (length >= 20)
  const bareMatch = trimmed.match(/^([a-zA-Z0-9_-]{20,55})/);
  if (bareMatch && bareMatch[1]) return bareMatch[1];
  return trimmed;
}

export interface DriveAudioFileMeta {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  originalParentId?: string;
  subfolderName?: string;
}

export interface DriveFolderScanReport {
  folderId: string;
  folderName: string;
  audioFiles: DriveAudioFileMeta[];
  nonAudioFiles: Array<{ id: string; name: string; mimeType: string }>;
  zipFiles: Array<{ id: string; name: string; size?: number; mimeType: string }>;
  totalScannedFolders: number;
  totalItemsDiscovered: number;
}

const AUDIO_EXTENSIONS = ['.wav', '.mp3', '.aif', '.aiff', '.flac', '.m4a', '.ogg', '.aac', '.wma', '.opus', '.alac'];

export function isAudioFile(name?: string, mimeType?: string): boolean {
  if (!name && !mimeType) return false;
  const mt = (mimeType || '').toLowerCase();
  if (
    mt.startsWith('audio/') ||
    mt.includes('audio') ||
    mt.includes('wav') ||
    mt.includes('wave') ||
    mt.includes('mpeg') ||
    mt.includes('flac') ||
    mt.includes('aiff')
  ) {
    return true;
  }
  const cleanName = (name || '').split('?')[0].split('#')[0].toLowerCase();
  return AUDIO_EXTENSIONS.some(ext => cleanName.endsWith(ext));
}

export function isZipFile(name?: string, mimeType?: string): boolean {
  if (!name && !mimeType) return false;
  const mt = (mimeType || '').toLowerCase();
  if (mt.includes('zip') || mt === 'application/x-zip-compressed' || mt === 'application/zip') return true;
  const cleanName = (name || '').split('?')[0].split('#')[0].toLowerCase();
  return cleanName.endsWith('.zip');
}

/**
 * Scans a user's Google Drive folder, shared link, or drive item for audio one-shots.
 * Uses supportsAllDrives=true and includeItemsFromAllDrives=true for shared/public links.
 * Handles subfolder hierarchies and detects zip archives.
 */
export async function listFilesInDriveFolder(
  rawInputId: string,
  accessToken: string
): Promise<DriveFolderScanReport> {
  const targetId = extractDriveFolderId(rawInputId);
  let effectiveFolderId = targetId;
  let targetName = 'Google Drive Folder';

  // 1. Fetch metadata of the target item directly (handles direct audio files, zip files, shortcuts, and folder names)
  try {
    const metaRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${targetId}?fields=id,name,mimeType,size,shortcutDetails&supportsAllDrives=true`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (metaRes.ok) {
      const meta = await metaRes.json();
      targetName = meta.name || targetName;

      // Handle shortcuts
      if (meta.mimeType === 'application/vnd.google-apps.shortcut' && meta.shortcutDetails?.targetId) {
        effectiveFolderId = meta.shortcutDetails.targetId;
      }

      // If user pasted a direct link to an individual audio file
      if (isAudioFile(meta.name, meta.mimeType)) {
        return {
          folderId: targetId,
          folderName: targetName,
          audioFiles: [{
            id: meta.id,
            name: meta.name,
            mimeType: meta.mimeType || 'audio/wav',
            size: meta.size ? Number(meta.size) : undefined,
            originalParentId: targetId
          }],
          nonAudioFiles: [],
          zipFiles: [],
          totalScannedFolders: 1,
          totalItemsDiscovered: 1
        };
      }

      // If user pasted a link to a zip archive
      if (isZipFile(meta.name, meta.mimeType)) {
        return {
          folderId: targetId,
          folderName: targetName,
          audioFiles: [],
          nonAudioFiles: [],
          zipFiles: [{
            id: meta.id,
            name: meta.name,
            size: meta.size ? Number(meta.size) : undefined,
            mimeType: meta.mimeType
          }],
          totalScannedFolders: 1,
          totalItemsDiscovered: 1
        };
      }
    }
  } catch (e) {
    console.warn('Could not fetch target root metadata:', e);
  }

  // 2. Scan folders recursively (up to 4 levels deep, max 50 folders)
  const queue: Array<{ id: string; name: string; depth: number }> = [
    { id: effectiveFolderId, name: targetName, depth: 0 }
  ];
  const visited = new Set<string>();
  const audioFiles: DriveAudioFileMeta[] = [];
  const nonAudioFiles: Array<{ id: string; name: string; mimeType: string }> = [];
  const zipFiles: Array<{ id: string; name: string; size?: number; mimeType: string }> = [];
  let scannedCount = 0;

  while (queue.length > 0 && scannedCount < 50) {
    const current = queue.shift()!;
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    scannedCount++;

    const query = `'${current.id}' in parents and trashed = false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&supportsAllDrives=true&includeItemsFromAllDrives=true&pageSize=1000&fields=files(id,name,mimeType,size,parents,shortcutDetails)`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Google Drive authorization expired (401). Please click "Authorize Drive" to refresh.');
      }
      if (res.status === 403) {
        throw new Error('Google Drive access restricted (403). Ensure this folder has "Anyone with the link can view" enabled or is accessible to your Google account.');
      }
      if (res.status === 404 && scannedCount === 1) {
        throw new Error('Google Drive folder not found (404). Please verify the link or folder ID.');
      }
      continue;
    }

    const data = await res.json();
    const items: any[] = data.files || [];

    for (const item of items) {
      let realMime = item.mimeType;
      let realId = item.id;
      if (item.mimeType === 'application/vnd.google-apps.shortcut' && item.shortcutDetails?.targetId) {
        realId = item.shortcutDetails.targetId;
        realMime = item.shortcutDetails.targetMimeType || realMime;
      }

      if (realMime === 'application/vnd.google-apps.folder') {
        if (current.depth < 4 && !visited.has(realId)) {
          queue.push({ id: realId, name: item.name, depth: current.depth + 1 });
        }
      } else if (isAudioFile(item.name, realMime)) {
        audioFiles.push({
          id: realId,
          name: item.name,
          mimeType: realMime || 'audio/wav',
          size: item.size ? Number(item.size) : undefined,
          originalParentId: current.id,
          subfolderName: current.depth > 0 ? current.name : undefined
        });
      } else if (isZipFile(item.name, realMime)) {
        zipFiles.push({
          id: realId,
          name: item.name,
          size: item.size ? Number(item.size) : undefined,
          mimeType: realMime
        });
      } else {
        nonAudioFiles.push({
          id: realId,
          name: item.name,
          mimeType: realMime
        });
      }
    }
  }

  return {
    folderId: effectiveFolderId,
    folderName: targetName,
    audioFiles,
    nonAudioFiles,
    zipFiles,
    totalScannedFolders: scannedCount,
    totalItemsDiscovered: audioFiles.length + nonAudioFiles.length + zipFiles.length
  };
}

/**
 * Downloads and unpacks an audio zip archive from Google Drive into memory
 */
export async function unpackZipFromDrive(
  fileId: string,
  accessToken: string,
  onProgress?: (current: number, total: number, name: string) => void
): Promise<Array<{ name: string; blob: Blob; mimeType: string }>> {
  const zipBlob = await downloadDriveFileAsBlob(fileId, accessToken);
  const zip = await JSZip.loadAsync(zipBlob);
  const extractedFiles: Array<{ name: string; blob: Blob; mimeType: string }> = [];

  const fileEntries: any[] = [];
  zip.forEach((relativePath, file) => {
    if (!file.dir && !relativePath.startsWith('__MACOSX') && !relativePath.includes('/._')) {
      const lower = relativePath.toLowerCase();
      if (AUDIO_EXTENSIONS.some(ext => lower.endsWith(ext))) {
        fileEntries.push({ path: relativePath, file });
      }
    }
  });

  for (let i = 0; i < fileEntries.length; i++) {
    const entry = fileEntries[i];
    const fileName = entry.path.split('/').pop() || entry.path;
    if (onProgress) onProgress(i + 1, fileEntries.length, fileName);

    const blob = await entry.file.async('blob');
    let mime = 'audio/wav';
    if (fileName.toLowerCase().endsWith('.mp3')) mime = 'audio/mpeg';
    else if (fileName.toLowerCase().endsWith('.flac')) mime = 'audio/flac';
    else if (fileName.toLowerCase().endsWith('.aif') || fileName.toLowerCase().endsWith('.aiff')) mime = 'audio/aiff';

    extractedFiles.push({
      name: fileName,
      blob,
      mimeType: mime
    });
  }

  return extractedFiles;
}

/**
 * Native Google Drive MOVE operation:
 * Modifies parent directory pointers without downloading or re-uploading the file.
 * ZERO BYTES DUPLICATED - Does NOT consume double storage quota in Google Drive!
 */
export async function moveDriveFile(
  fileId: string,
  fromFolderId: string,
  toFolderId: string,
  accessToken: string
): Promise<void> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?addParents=${encodeURIComponent(
    toFolderId
  )}&removeParents=${encodeURIComponent(fromFolderId)}&fields=id,name,parents`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    // If removing parents failed, try adding parents
    const fallbackUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?addParents=${encodeURIComponent(
      toFolderId
    )}&fields=id,name,parents`;
    const fallbackRes = await fetch(fallbackUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!fallbackRes.ok) {
      const errText = await res.text();
      throw new Error(`Failed to move file in Google Drive (${res.status}): ${errText}`);
    }
  }
}

/**
 * Downloads audio file blob from Google Drive into memory for client-side Web Audio analysis
 */
export async function downloadDriveFileAsBlob(
  fileId: string,
  accessToken: string
): Promise<Blob> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    throw new Error(`Failed to download audio file from Google Drive (${res.status})`);
  }

  return await res.blob();
}

