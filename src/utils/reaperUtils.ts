export interface ReaperTrack {
  name: string;
  plugins: string[];
  type: 'audio' | 'midi' | 'folder' | 'bus';
  isMuted: boolean;
  isSoloed: boolean;
  volume: string;
  referencedFiles: string[];
}

export interface ReaperParsedInfo {
  title: string;
  tracksCount: number;
  stemsCount: number;
  tracks: ReaperTrack[];
}

/**
 * Supercharged, light-weight REAPER Project (.RPP) parser.
 * It reads REAPER S-expressions tokenizing TRACK name, volume levels,
 * mute states, loaded plug-in inserts, and physical media file matches.
 */
export function parseRpp(content: string): ReaperTrack[] {
  const lines = content.split(/\r?\n/);
  const tracks: ReaperTrack[] = [];
  let currentTrack: ReaperTrack | null = null;
  let braceLevel = 0;
  let trackBraceLevel = 0;
  let insideTrack = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    // Track block start and nested depth calculations
    if (trimmed.startsWith('<')) {
      braceLevel++;
      if (trimmed.startsWith('<TRACK')) {
        insideTrack = true;
        trackBraceLevel = braceLevel;
        currentTrack = {
          name: `Track ${tracks.length + 1}`,
          plugins: [],
          type: 'audio',
          isMuted: false,
          isSoloed: false,
          volume: '0.0 dB',
          referencedFiles: []
        };
      } else if (insideTrack && (trimmed.startsWith('<VST') || trimmed.startsWith('<AU') || trimmed.startsWith('<JS') || trimmed.startsWith('<DX'))) {
        // Dynamic name extractions
        const match = trimmed.match(/<(VST|AU|JS|DX)\s+"([^"]+)"/i) || trimmed.match(/<(VST|AU|JS|DX)\s+([^"\s>]+)/i);
        if (match && currentTrack) {
          let plugName = match[2].trim();
          // Stripping down system prefixes for human-readable critiquing
          plugName = plugName.replace(/^(VST3|VST2|VST|AU|JS|DX|VST3i|VSTi):\s*/i, '');
          currentTrack.plugins.push(plugName);
        }
      } else if (insideTrack && trimmed.startsWith('<SOURCE')) {
        // Search inside source block for embedded stem names
        const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
        const match = trimmed.match(/FILE\s+"([^"]+)"/i) || nextLine.match(/FILE\s+"([^"]+)"/i);
        if (match && currentTrack) {
          const fileName = match[1].split(/[/\\]/).pop() || '';
          if (fileName && !currentTrack.referencedFiles.includes(fileName)) {
            currentTrack.referencedFiles.push(fileName);
          }
        }
      }
    }

    // Capture files listed inline inside items or loop sources
    if (insideTrack && currentTrack && trimmed.startsWith('FILE ')) {
      const match = trimmed.match(/FILE\s+"([^"]+)"/i);
      if (match) {
        const fileName = match[1].split(/[/\\]/).pop() || '';
        if (fileName && !currentTrack.referencedFiles.includes(fileName)) {
          currentTrack.referencedFiles.push(fileName);
        }
      }
    }

    // Capture parent track state parameters
    if (insideTrack && currentTrack) {
      if (trimmed.startsWith('NAME ')) {
        const match = trimmed.match(/NAME\s+"([^"]+)"/i) || trimmed.match(/NAME\s+(.+)$/i);
        if (match) {
          currentTrack.name = match[1].trim();
        }
      } else if (trimmed.startsWith('MUTESOLO ')) {
        const match = trimmed.match(/MUTESOLO\s+(\d+)\s+(\d+)/);
        if (match) {
          currentTrack.isMuted = match[1] === '1';
          currentTrack.isSoloed = match[2] === '1' || match[2] === '2';
        }
      } else if (trimmed.startsWith('MUTE ')) {
        const match = trimmed.match(/MUTE\s+(\d+)/);
        if (match) {
          currentTrack.isMuted = match[1] === '1';
        }
      } else if (trimmed.startsWith('VOLPAN ')) {
        const parts = trimmed.split(/\s+/);
        if (parts.length > 1) {
          const volScalar = parseFloat(parts[1]);
          if (!isNaN(volScalar)) {
            if (volScalar <= 0) {
              currentTrack.volume = '-inf dB';
            } else {
              const db = Math.round(20 * Math.log10(volScalar) * 10) / 10;
              currentTrack.volume = `${db > 0 ? '+' : ''}${db} dB`;
            }
          }
        }
      }
    }

    // Track block termination check
    if (trimmed === '>') {
      if (insideTrack && braceLevel === trackBraceLevel) {
        if (currentTrack) {
          tracks.push(currentTrack);
          currentTrack = null;
        }
        insideTrack = false;
      }
      braceLevel--;
    }
  }

  return tracks;
}
