import { SampleVaultItem, DrumOneShotCategory } from '../types';

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
 * Parses a Google Drive Folder URL or raw folder ID
 */
export function extractDriveFolderId(input: string): string {
  const trimmed = input.trim();
  // Matches https://drive.google.com/drive/folders/1ABC... or ?id=1ABC...
  const urlMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (urlMatch && urlMatch[1]) return urlMatch[1];
  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch && queryMatch[1]) return queryMatch[1];
  // Direct folder ID
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

const AUDIO_EXTENSIONS = ['.wav', '.mp3', '.aif', '.aiff', '.flac', '.m4a', '.ogg'];

function isAudioFile(name: string, mimeType: string): boolean {
  if (mimeType && mimeType.toLowerCase().startsWith('audio/')) return true;
  const lower = (name || '').toLowerCase();
  return AUDIO_EXTENSIONS.some(ext => lower.endsWith(ext));
}

/**
 * Scans a user's Google Drive folder for audio files, including immediate subfolders (drum packs)
 */
export async function listFilesInDriveFolder(
  folderId: string,
  accessToken: string
): Promise<DriveAudioFileMeta[]> {
  // Query all non-trashed items inside the specified folder
  const query = `'${folderId}' in parents and trashed = false`;
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&fields=files(id,name,mimeType,size,parents)&pageSize=1000`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Google Drive authorization expired (401). Please click "Authorize Drive" to refresh.');
    }
    if (res.status === 403) {
      throw new Error('Google Drive access restricted (403). Ensure this folder is accessible to your Google account and Drive permissions are granted.');
    }
    if (res.status === 404) {
      throw new Error('Google Drive folder not found (404). Please verify the folder link or folder ID.');
    }
    const errorText = await res.text();
    throw new Error(`Failed to scan Google Drive folder (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const rawFiles: any[] = data.files || [];

  const audioFiles: DriveAudioFileMeta[] = [];
  const subfolders: Array<{ id: string; name: string }> = [];

  for (const f of rawFiles) {
    if (f.mimeType === 'application/vnd.google-apps.folder') {
      subfolders.push({ id: f.id, name: f.name });
    } else if (isAudioFile(f.name, f.mimeType)) {
      audioFiles.push({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType,
        size: f.size ? Number(f.size) : undefined,
        originalParentId: folderId
      });
    }
  }

  // If subfolders exist (e.g., Kicks/, Claps/, 808s/), scan them as well to capture complete kits
  if (subfolders.length > 0) {
    for (const sub of subfolders) {
      try {
        const subQuery = `'${sub.id}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`;
        const subRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
            subQuery
          )}&fields=files(id,name,mimeType,size)&pageSize=500`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        if (subRes.ok) {
          const subData = await subRes.json();
          for (const sf of subData.files || []) {
            if (isAudioFile(sf.name, sf.mimeType)) {
              audioFiles.push({
                id: sf.id,
                name: sf.name,
                mimeType: sf.mimeType,
                size: sf.size ? Number(sf.size) : undefined,
                originalParentId: sub.id,
                subfolderName: sub.name
              });
            }
          }
        }
      } catch (err) {
        console.warn(`Could not read subfolder ${sub.name}:`, err);
      }
    }
  }

  return audioFiles;
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

