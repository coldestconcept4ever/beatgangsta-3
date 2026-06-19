export interface ReaperPlugin {
  name: string;
  rawState?: string;
  readableParams?: string;
}

export interface ReaperTrack {
  name: string;
  plugins: ReaperPlugin[];
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

  let currentPlugin: { name: string; stateLines: string[] } | null = null;
  let pluginBraceLevel = 0;

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
          currentPlugin = { name: plugName, stateLines: [] };
          pluginBraceLevel = braceLevel;
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
    if (insideTrack && currentTrack && !currentPlugin) {
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
    } else if (insideTrack && currentTrack && currentPlugin) {
      // Capture base64 state data (or any other readable properties)
      if (!trimmed.startsWith('<') && !trimmed.startsWith('>')) {
        currentPlugin.stateLines.push(trimmed);
      }
    }

    // Track block termination check
    if (trimmed === '>') {
      if (currentPlugin && braceLevel === pluginBraceLevel) {
        // We finished the plugin block
        // Decode base64 to extract legible strings
        let b64 = currentPlugin.stateLines.map(l => l.replace(/[^A-Za-z0-9+/=]/g, '')).join('');
        let legibleText = '';
        if (b64.length > 0) {
          try {
            // Note: browser atob might fail if padding is wrong
            while (b64.length % 4 !== 0) b64 += '=';
            const bin = atob(b64);
            // Naive string extraction: looking for sequences of printable chars
            // FabFilter and others often leave XML or param names in plain text inside chunk
            const strings = bin.match(/[\x20-\x7E]{4,}/g);
            if (strings) {
              legibleText = strings.join('\n');
            }
          } catch (e) {
            // ignore base64 errors
          }
        }
        
        currentTrack?.plugins.push({
          name: currentPlugin.name,
          rawState: b64,
          readableParams: legibleText
        });
        currentPlugin = null;
      } else if (insideTrack && braceLevel === trackBraceLevel) {
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
