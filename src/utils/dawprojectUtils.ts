import { DawProject, Project, Application, MetaData, Utility, ContentType, MixerRole, Track, Channel, Plugin, Arrangement, Lanes, Vst3Plugin, Vst2Plugin, DeviceRole, Clip, Clips, Transport, RealParameter, Unit, DeviceRegistry } from 'dawproject-typescript';
import JSZip from 'jszip';
import { MixCritique, SavedRecipe, InstrumentTrack, DeepDivePlugin, VSTPlugin } from '../types';

// Monkey patch Vst3Plugin and Vst2Plugin to output standard lowercase XML tag names
Vst3Plugin.prototype.toXmlObject = function() {
  const pluginContent = Object.getPrototypeOf(Vst3Plugin.prototype).toXmlObject.call(this);
  return {
    vst3Plugin: pluginContent
  };
};

Vst2Plugin.prototype.toXmlObject = function() {
  const pluginContent = Object.getPrototypeOf(Vst2Plugin.prototype).toXmlObject.call(this);
  return {
    vst2Plugin: pluginContent
  };
};

// Register lowercase tag names in DeviceRegistry for proper bidirectional parsing mapping
try {
  const registry = (DeviceRegistry.getInstance() as any).getRegistry();
  if (registry) {
    if (registry["Vst3Plugin"] && !registry["vst3Plugin"]) {
      registry["vst3Plugin"] = registry["Vst3Plugin"];
    }
    if (registry["Vst2Plugin"] && !registry["vst2Plugin"]) {
      registry["vst2Plugin"] = registry["Vst2Plugin"];
    }
  }
} catch (e) {
  console.warn("Could not register lowercase tags in DeviceRegistry:", e);
}

interface PluginMeta {
  deviceName: string;
  deviceID: string;
  deviceVendor: string;
}

const mapPluginMetadata = (suggestedName: string, isInstrument: boolean = false): PluginMeta => {
  const name = suggestedName.toLowerCase();

  if (isInstrument) {
    if (name.includes("serum")) {
      return {
        deviceName: "Serum",
        deviceID: "565354586d4e79736572756d78363400",
        deviceVendor: "Xfer Records"
      };
    }
    if (name.includes("nexus")) {
      return {
        deviceName: "Nexus",
        deviceID: "5653544e5853336e6578757373706163",
        deviceVendor: "reFX"
      };
    }
    if (name.includes("omnisphere")) {
      return {
        deviceName: "Omnisphere",
        deviceID: "5653544f5048526f6d6e697370686572",
        deviceVendor: "Spectrasonics"
      };
    }
    if (name.includes("contact") || name.includes("kontakt")) {
      return {
        deviceName: "Kontakt",
        deviceID: "5653544e694f386b6f6e74616b743800",
        deviceVendor: "Native Instruments"
      };
    }
    if (name.includes("sublab")) {
      return {
        deviceName: "SubLab",
        deviceID: "565354534c41427375626c6162767374",
        deviceVendor: "Future Audio Workshop"
      };
    }
    if (name.includes("piano") || name.includes("keyszone")) {
      return {
        deviceName: "Keyszone Classic",
        deviceID: "5653544b5a434c6b6579737a6f6e6563",
        deviceVendor: "Bitsonic"
      };
    }
    return {
      deviceName: suggestedName,
      deviceID: "565354506c7567696e56616c69644944",
      deviceVendor: "Standard VSTi"
    };
  }

  // Audio Effects
  if (name.includes("pro-q") || name.includes("pro q") || (name.includes("eq") && name.includes("surgical")) || name.includes("equalizer")) {
    return {
      deviceName: "Pro-Q 3",
      deviceID: "5653545251336166616266696c746572",
      deviceVendor: "FabFilter"
    };
  }
  if (name.includes("api 550") || name.includes("api550")) {
    return {
      deviceName: "API-550A",
      deviceID: "5653544135354177617665737368656c",
      deviceVendor: "Waves"
    };
  }
  if (name.includes("puigtec") || name.includes("pultec")) {
    return {
      deviceName: "PuigTec EQP1A",
      deviceID: "5653545054314177617665737368656c",
      deviceVendor: "Waves"
    };
  }

  // Compressors
  if (name.includes("1176") || name.includes("fet compressor") || name.includes("cla-76") || name.includes("cla76")) {
    return {
      deviceName: "CLA-76",
      deviceID: "5653544337365377617665737368656c",
      deviceVendor: "Waves"
    };
  }
  if (name.includes("pro-c") || name.includes("pro c") || name.includes("compressor") || name.includes("glue")) {
    return {
      deviceName: "Pro-C 2",
      deviceID: "5653545250433266616266696c746572",
      deviceVendor: "FabFilter"
    };
  }
  if (name.includes("la-2a") || name.includes("la2a") || name.includes("cla-2a") || name.includes("cla2a") || name.includes("opto")) {
    return {
      deviceName: "CLA-2A",
      deviceID: "5653544332415377617665737368656c",
      deviceVendor: "Waves"
    };
  }

  // De-essers
  if (name.includes("de-esser") || name.includes("deesser") || name.includes("pro-ds") || name.includes("pro ds")) {
    return {
      deviceName: "Pro-DS",
      deviceID: "56535452445366616266696c74657244",
      deviceVendor: "FabFilter"
    };
  }

  // Limiters
  if (name.includes("limiter") || name.includes("pro-l") || name.includes("pro l") || name.includes("l1") || name.includes("l2")) {
    return {
      deviceName: "Pro-L 2",
      deviceID: "56535452504c3266616266696c746572",
      deviceVendor: "FabFilter"
    };
  }

  // Saturation & Distortion
  if (name.includes("decapitator")) {
    return {
      deviceName: "Decapitator",
      deviceID: "56535444637074736f756e64746f7973",
      deviceVendor: "Soundtoys"
    };
  }
  if (name.includes("saturn")) {
    return {
      deviceName: "Saturn 2",
      deviceID: "5653545253326166616266696c746572",
      deviceVendor: "FabFilter"
    };
  }
  if (name.includes("tape") || name.includes("saturation") || name.includes("tube") || name.includes("saturator") || name.includes("drive")) {
    return {
      deviceName: "Saturator",
      deviceID: "565354536174757261746f7253313030",
      deviceVendor: "FabFilter"
    };
  }

  // Reverbs
  if (name.includes("vintageverb") || name.includes("valhalla") || name.includes("reverb") || name.includes("space") || name.includes("verb") || name.includes("hall")) {
    return {
      deviceName: "ValhallaVintageVerb",
      deviceID: "5653545656524276616c68616c6c6176",
      deviceVendor: "Valhalla DSP"
    };
  }
  if (name.includes("pro-r") || name.includes("pro r")) {
    return {
      deviceName: "Pro-R 2",
      deviceID: "5653545250523266616266696c746572",
      deviceVendor: "FabFilter"
    };
  }

  // Delays
  if (name.includes("delay") || name.includes("echo") || name.includes("timeless")) {
    return {
      deviceName: "ValhallaDelay",
      deviceID: "56535456444c5976616c68616c6c6164",
      deviceVendor: "Valhalla DSP"
    };
  }

  // Utilities & Widening
  if (name.includes("utility") || name.includes("polarity") || name.includes("invert")) {
    return {
      deviceName: "Mixtool",
      deviceID: "5653544d6978746f6f6c533130303030",
      deviceVendor: "PreSonus"
    };
  }
  if (name.includes("widener") || name.includes("spread") || name.includes("stereo") || name.includes("microshift")) {
    return {
      deviceName: "MicroShift",
      deviceID: "5653544d637368736f756e64746f7973",
      deviceVendor: "Soundtoys"
    };
  }
  if (name.includes("soothe") || name.includes("soothe2")) {
    return {
      deviceName: "soothe2",
      deviceID: "565354536f6f74326f616b736f756e64",
      deviceVendor: "oeksound"
    };
  }
  if (name.includes("autotune") || name.includes("auto-tune") || name.includes("pitch")) {
    return {
      deviceName: "Auto-Tune Pro",
      deviceID: "56535441545039616e74617265736174",
      deviceVendor: "Antares"
    };
  }

  return {
    deviceName: suggestedName,
    deviceID: "565354506c7567696e56616c69644944",
    deviceVendor: "Generic Audio FX"
  };
};

const generateDeterministicDeviceID = (name: string, vendor: string, isVst3: boolean): string => {
  const prefix = "565354"; // "VST"
  const suffix = isVst3 ? "52" : "55"; // "R" (VST3) or "U" (VST2)
  const clean = (vendor + name).toLowerCase().replace(/[^a-z0-9]/g, '');
  let hexBody = '';
  for (let i = 0; i < clean.length; i++) {
    hexBody += clean.charCodeAt(i).toString(16);
  }
  return (prefix + suffix + hexBody).padEnd(32, '0').slice(0, 32);
};

export const findBestUserPluginMatch = (suggestedName: string, userPlugins: VSTPlugin[] = []): VSTPlugin | null => {
  if (!suggestedName || userPlugins.length === 0) return null;

  const cleanSuggested = suggestedName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Try exact match after cleaning non-alphanumeric chars
  for (const p of userPlugins) {
    if (p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanSuggested) {
      return p;
    }
  }

  // 2. Try substring match (e.g. if cleanSuggested contains p.name or vice-versa)
  for (const p of userPlugins) {
    const cleanUser = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanUser.length > 2 && (cleanSuggested.includes(cleanUser) || cleanUser.includes(cleanSuggested))) {
      return p;
    }
  }

  // 3. Match by common aliases/keywords
  const lowerS = suggestedName.toLowerCase();
  for (const p of userPlugins) {
    const lowerP = p.name.toLowerCase();
    // EQs
    if (lowerS.includes('eq') || lowerS.includes('equalizer') || lowerS.includes('pro-q') || lowerS.includes('pro q')) {
      if (lowerP.includes('pro-q') || lowerP.includes('pro q') || lowerP.includes('equalizer') || lowerP.includes('pro eq') || lowerP.includes('proeq') || (lowerP.includes('eq') && p.vendor.toLowerCase().includes('fabfilter'))) {
        return p;
      }
    }
    // Compressors
    if (lowerS.includes('compressor') || lowerS.includes('compress') || lowerS.includes('comp') || lowerS.includes('cla-76') || lowerS.includes('1176') || lowerS.includes('la-2a') || lowerS.includes('la2a')) {
      if (lowerP.includes('comp') || lowerP.includes('cla-76') || lowerP.includes('1176') || lowerP.includes('la-2a') || lowerP.includes('la2a') || lowerP.includes('pro-c') || lowerP.includes('pro c')) {
        return p;
      }
    }
    // Saturation/Distortion
    if (lowerS.includes('decapitator') || lowerS.includes('saturation') || lowerS.includes('saturator') || lowerS.includes('saturn') || lowerS.includes('distortion') || lowerS.includes('drive')) {
      if (lowerP.includes('decapitator') || lowerP.includes('saturation') || lowerP.includes('saturator') || lowerP.includes('saturn') || lowerP.includes('dist') || lowerP.includes('knob')) {
        return p;
      }
    }
    // Reverbs
    if (lowerS.includes('reverb') || lowerS.includes('verb') || lowerS.includes('vintageverb') || lowerS.includes('valhalla') || lowerS.includes('space') || lowerS.includes('hall')) {
      if (lowerP.includes('reverb') || lowerP.includes('verb') || lowerP.includes('vintageverb') || lowerP.includes('valhalla') || lowerP.includes('raum') || lowerP.includes('space')) {
        return p;
      }
    }
    // Delays
    if (lowerS.includes('delay') || lowerS.includes('echo') || lowerS.includes('timeless')) {
      if (lowerP.includes('delay') || lowerP.includes('echo') || lowerP.includes('timeless') || lowerP.includes('replika')) {
        return p;
      }
    }
    // Deessers
    if (lowerS.includes('deesser') || lowerS.includes('de-esser') || lowerS.includes('pro-ds') || lowerS.includes('pro ds')) {
      if (lowerP.includes('deesser') || lowerP.includes('de-esser') || lowerP.includes('pro-ds') || lowerP.includes('pro ds')) {
        return p;
      }
    }
    // Limiters
    if (lowerS.includes('limiter') || lowerS.includes('pro-l') || lowerS.includes('pro l')) {
      if (lowerP.includes('limiter') || lowerP.includes('pro-l') || lowerP.includes('pro l') || lowerP.includes('l1') || lowerP.includes('l2') || lowerP.includes('maximizer')) {
        return p;
      }
    }
  }

  return null;
};

const getPluginMetadata = (suggestedName: string, isInstrument: boolean, userPlugins: VSTPlugin[] = []): { deviceName: string, deviceVendor: string, deviceID: string, type: 'vst2' | 'vst3' } => {
  const userMatch = findBestUserPluginMatch(suggestedName, userPlugins);
  if (userMatch) {
    const isVst3 = !userMatch.type.toLowerCase().includes('vst2');
    const cleanUserMatchName = userMatch.name.toLowerCase();
    let deviceID = userMatch.id || "";
    
    if (!deviceID) {
      if (cleanUserMatchName.includes("pro-q 3") || cleanUserMatchName.includes("pro-q3") || cleanUserMatchName.includes("pro q 3")) {
        deviceID = "5653545251336166616266696c746572";
      } else if (cleanUserMatchName.includes("cla-76") || cleanUserMatchName.includes("cla76")) {
        deviceID = "5653544337365377617665737368656c";
      } else if (cleanUserMatchName.includes("cla-2a") || cleanUserMatchName.includes("cla2a")) {
        deviceID = "5653544332415377617665737368656c";
      } else if (cleanUserMatchName.includes("pro-c 2") || cleanUserMatchName.includes("pro-c2") || cleanUserMatchName.includes("pro c 2")) {
        deviceID = "5653545250433266616266696c746572";
      } else if (cleanUserMatchName.includes("pro-ds") || cleanUserMatchName.includes("pro ds")) {
        deviceID = "56535452445366616266696c74657244";
      } else if (cleanUserMatchName.includes("pro-l 2") || cleanUserMatchName.includes("pro-l2") || cleanUserMatchName.includes("pro l 2")) {
        deviceID = "56535452504c3266616266696c746572";
      } else if (cleanUserMatchName.includes("decapitator")) {
        deviceID = "56535444637074736f756e64746f7973";
      } else if (cleanUserMatchName.includes("saturn 2") || cleanUserMatchName.includes("saturn2")) {
        deviceID = "5653545253326166616266696c746572";
      } else if (cleanUserMatchName.includes("vintageverb") || cleanUserMatchName.includes("vintage verb")) {
        deviceID = "5653545656524276616c68616c6c6176";
      } else if (cleanUserMatchName.includes("pro-r 2") || cleanUserMatchName.includes("pro-r2") || cleanUserMatchName.includes("pro r 2")) {
        deviceID = "5653545250523266616266696c746572";
      } else if (cleanUserMatchName.includes("delay") && cleanUserMatchName.includes("valhalla")) {
        deviceID = "56535456444c5976616c68616c6c6164";
      } else if (cleanUserMatchName.includes("mixtool")) {
        deviceID = "5653544d6978746f6f6c533130303030";
      } else if (cleanUserMatchName.includes("microshift")) {
        deviceID = "5653544d637368736f756e64746f7973";
      } else if (cleanUserMatchName.includes("soothe2") || cleanUserMatchName.includes("soothe 2")) {
        deviceID = "565354536f6f74326f616b736f756e64";
      } else if (cleanUserMatchName.includes("auto-tune pro") || cleanUserMatchName.includes("autotune pro")) {
        deviceID = "56535441545039616e74617265736174";
      } else if (cleanUserMatchName.includes("serum")) {
        deviceID = "565354586d4e79736572756d78363400";
      } else if (cleanUserMatchName.includes("nexus")) {
        deviceID = "5653544e5853336e6578757373706163";
      } else if (cleanUserMatchName.includes("omnisphere")) {
        deviceID = "5653544f5048526f6d6e697370686572";
      } else if (cleanUserMatchName.includes("kontakt") || cleanUserMatchName.includes("contact")) {
        deviceID = "5653544e694f386b6f6e74616b743800";
      } else if (cleanUserMatchName.includes("sublab")) {
        deviceID = "565354534c41427375626c6162767374";
      } else if (cleanUserMatchName.includes("keyszone")) {
        deviceID = "5653544b5a434c6b6579737a6f6e6563";
      } else {
        deviceID = generateDeterministicDeviceID(userMatch.name, userMatch.vendor, isVst3);
      }
    }

    return {
      deviceName: userMatch.name,
      deviceVendor: userMatch.vendor,
      deviceID: deviceID,
      type: isVst3 ? 'vst3' : 'vst2'
    };
  }

  const meta = mapPluginMetadata(suggestedName, isInstrument);
  return {
    deviceName: meta.deviceName,
    deviceVendor: meta.deviceVendor,
    deviceID: meta.deviceID,
    type: 'vst3'
  };
};

const applyDefaultVocalPlugins = (track: Track, trackName: string, userPlugins: VSTPlugin[] = []) => {
  if (!track.channel) return;
  if (!track.channel.devices) track.channel.devices = [];

  const nameLower = trackName.toLowerCase();
  let pluginsToLoad: string[] = [];

  if (nameLower.includes("lead")) {
    pluginsToLoad = [
      "Surgical EQ (FabFilter Pro-Q 3)",
      "Lead Vocal Compressor (Waves CLA-76)",
      "Vocal De-esser (FabFilter Pro-DS)"
    ];
  } else if (nameLower.includes("overdub") || nameLower.includes("dub")) {
    pluginsToLoad = [
      "Mixtool (Polarity Invert)",
      "Dual Stereo Widener (Soundtoys MicroShift)",
      "Parallel Saturation (Soundtoys Decapitator)"
    ];
  } else if (nameLower.includes("lib") || nameLower.includes("accent")) {
    pluginsToLoad = [
      "Interactive Delay (ValhallaDelay)",
      "Vocal Sidechain Compressor (FabFilter Pro-C 2)"
    ];
  } else if (nameLower.includes("fx") || nameLower.includes("sweep")) {
    pluginsToLoad = [
      "Resonant Filter Sweep (FabFilter Pro-Q 3)",
      "Epic Hall Reverb (ValhallaVintageVerb)"
    ];
  }

  for (const pName of pluginsToLoad) {
    const meta = getPluginMetadata(pName, false, userPlugins);
    const fxDevice = meta.type === 'vst2' ? new Vst2Plugin() : new Vst3Plugin();
    fxDevice.deviceName = meta.deviceName;
    fxDevice.deviceRole = DeviceRole.AUDIO_FX;
    fxDevice.deviceID = meta.deviceID;
    fxDevice.deviceVendor = meta.deviceVendor;
    track.channel.devices.push(fxDevice);
  }
};

const generateTrackChannels = (parentName: string, multiBandDetails?: { isEnabled: boolean, bandCount: number, splitFrequencies?: string[] }) => {
  const tracks: Track[] = [];
  const isMulti = multiBandDetails?.isEnabled;
  const count = isMulti ? Math.max(1, multiBandDetails.bandCount) : 1;
  for (let i = 0; i < count; i++) {
    const trackName = isMulti ? `${parentName} (Band ${i + 1})` : parentName;
    const track = Utility.createTrack(
      trackName,
      new Set([ContentType.AUDIO]),
      MixerRole.REGULAR,
      0.8,
      0.5
    );
    if (track.channel) {
      if (!track.channel.devices) track.channel.devices = [];
    }
    tracks.push(track);
  }
  return tracks;
};

const applyPluginsToTrack = (track: Track, fxList: DeepDivePlugin[], instrumentName?: string, userPlugins: VSTPlugin[] = []) => {
  if (!track.channel) return;
  if (!track.channel.devices) track.channel.devices = [];
  
  if (instrumentName) {
    const meta = getPluginMetadata(instrumentName, true, userPlugins);
    const instrDevice = meta.type === 'vst2' ? new Vst2Plugin() : new Vst3Plugin();
    instrDevice.deviceName = meta.deviceName;
    instrDevice.deviceRole = DeviceRole.INSTRUMENT;
    instrDevice.deviceID = meta.deviceID;
    instrDevice.deviceVendor = meta.deviceVendor;
    track.channel.devices.push(instrDevice);
  }

  for (const fx of fxList || []) {
    const fxName = typeof fx === 'string' ? fx : (fx && (fx as any).name) || '';
    if (!fxName) continue;
    const meta = getPluginMetadata(fxName, false, userPlugins);
    const fxDevice = meta.type === 'vst2' ? new Vst2Plugin() : new Vst3Plugin();
    fxDevice.deviceName = meta.deviceName;
    fxDevice.deviceRole = DeviceRole.AUDIO_FX;
    fxDevice.deviceID = meta.deviceID;
    fxDevice.deviceVendor = meta.deviceVendor;
    track.channel.devices.push(fxDevice);
  }
};

const createDummyWav = (durationSeconds: number): Uint8Array => {
  const sampleRate = 44100;
  const numChannels = 2;
  const bytesPerSample = 2;
  const numSamples = Math.ceil(durationSeconds * sampleRate);
  const dataSize = numSamples * numChannels * bytesPerSample;
  const fileSize = 36 + dataSize;
  
  const buffer = new Uint8Array(44 + dataSize);
  const view = new DataView(buffer.buffer);
  
  // RIFF Chunk
  buffer.set([0x52, 0x49, 0x46, 0x46], 0); // "RIFF"
  view.setUint32(4, fileSize, true);
  buffer.set([0x57, 0x41, 0x56, 0x45], 8); // "WAVE"
  
  // fmt Chunk
  buffer.set([0x66, 0x6d, 0x74, 0x20], 12); // "fmt "
  view.setUint32(16, 16, true); // Size: 16
  view.setUint16(20, 1, true); // format: PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true); // block align
  view.setUint16(34, bytesPerSample * 8, true); // bits per sample
  
  // data Chunk
  buffer.set([0x64, 0x61, 0x74, 0x61], 36); // "data"
  view.setUint32(40, dataSize, true);
  
  return buffer;
};

export const generateDawProjectFromMixCritique = async (critique: MixCritique, stems: any[], vocalTimeline?: any[], userPlugins?: VSTPlugin[]): Promise<Blob> => {
  const project = new Project();
  project.application = new Application("BeatGangsta", "1.0.0");
  
  if (critique.estimatedBPM) {
    project.transport = new Transport(new RealParameter(critique.estimatedBPM, Unit.BPM));
  }
  
  const metadata = new MetaData();
  metadata.title = critique.title || "Mix Critique Project";
  
  project.arrangement = new Arrangement();
  project.arrangement.lanes = new Lanes();
  project.arrangement.lanes.lanes = [];
 
  const embeddedFiles: Record<string, Uint8Array | Blob> = {};
 
  for (const step of critique.actionPlan || []) {
    if (step.targetStem) {
      const stemData = stems.find(s => s.file?.name === step.targetStem);
      const multiDetails = (step as any).multiBandDetails; // fallback if any
      const tracks = generateTrackChannels(step.targetStem, multiDetails);
      for (const track of tracks) {
        if (!project.structure) project.structure = [];
        project.structure.push(track);
        
        applyPluginsToTrack(track, step.recommendedChain, undefined, userPlugins);
        
        let fileBuffer: Uint8Array | Blob | null = null;
        let relativePath = `audio/${step.targetStem}`;
 
        if (stemData && stemData.file) {
          // Pass the file Blob directly to avoid RangeError on large allocations
          fileBuffer = stemData.file;
        }
        
        // Use dummy header if file data doesn't exist so Studio One correctly plots tracks
        const duration = fileBuffer ? (fileBuffer instanceof File ? 120.0 : 8.0) : 8.0;
        if (!fileBuffer) {
           relativePath = `audio/dummy_${step.targetStem.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`;
           fileBuffer = createDummyWav(8.0);
        }
 
        embeddedFiles[relativePath] = fileBuffer;
        
        // Assume 120 beats length for visualization if we don't know the exact duration
        const audio = Utility.createAudio(relativePath, 44100, 2, duration);
        const clip = Utility.createClip(audio, 0, duration);
        const clips = Utility.createClips(clip);
        clips.track = track;
        project.arrangement.lanes.lanes.push(clips);
      }
    }
  }
 
  // Inject vocal timeline tracks if provided
  if (vocalTimeline && vocalTimeline.length > 0) {
    for (const vTrackData of vocalTimeline) {
      const trackName = vTrackData.trackName || "Vocal Track";
      // Determine track color
      let trackHexColor = '#94a3b8';
      if (trackName.toLowerCase().includes('lead')) trackHexColor = '#38bdf8';
      else if (trackName.toLowerCase().includes('dub') || trackName.toLowerCase().includes('overdub')) trackHexColor = '#fb7185';
      else if (trackName.toLowerCase().includes('lib') || trackName.toLowerCase().includes('accent')) trackHexColor = '#fbbf24';
      else if (trackName.toLowerCase().includes('fx') || trackName.toLowerCase().includes('sweep')) trackHexColor = '#10b981';
 
      // Create main vocal Track with 0.8 gain and center pan
      const vTrack = Utility.createTrack(
        trackName,
        new Set([ContentType.AUDIO]),
        MixerRole.REGULAR,
        0.8,
        0.5
      );
      vTrack.color = trackHexColor;
      vTrack.loaded = true;
 
      // Ensure some base comments for coaching
      vTrack.comment = `Vocal sequencing and mix setup for ${trackName}. Please record or align your recordings here.`;
 
      if (!project.structure) project.structure = [];
      project.structure.push(vTrack);
 
      applyDefaultVocalPlugins(vTrack, trackName, userPlugins);

      // Map block clips onto track timeline
      const clipsList: Clip[] = [];
      for (const block of vTrackData.blocks || []) {
        const startBar0 = Math.max(0, block.startBar - 1);
        const startBeat = startBar0 * 4;
        const durationBeats = block.durationBars * 4;
        const durationSec = block.durationBars * 2.0;

        const blockWaveName = `audio/vocal_${block.id.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`;
        if (!embeddedFiles[blockWaveName]) {
          embeddedFiles[blockWaveName] = createDummyWav(durationSec);
        }

        const audio = Utility.createAudio(blockWaveName, 44100, 2, durationSec);
        const clip = Utility.createClip(audio, startBeat, durationBeats);
        clip.name = block.text;

        const clipColor = block.color === 'sky' ? '#38bdf8' :
                          block.color === 'rose' ? '#fb7185' :
                          block.color === 'indigo' ? '#818cf8' :
                          block.color === 'violet' ? '#c084fc' :
                          block.color === 'emerald' ? '#34d399' :
                          block.color === 'amber' ? '#fbbf24' : '#94a3b8';

        clip.color = clipColor;
        clip.comment = block.instructions;

        clipsList.push(clip);
      }

      if (clipsList.length > 0) {
        const trackClips = Utility.createClips(...clipsList);
        trackClips.track = vTrack;
        project.arrangement.lanes.lanes.push(trackClips);
      }
    }
  }
  
  const zip = new JSZip();
  // @ts-ignore
  zip.file('metadata.xml', new TextEncoder().encode(metadata.toXml()));
  // @ts-ignore
  zip.file('project.xml', new TextEncoder().encode(project.toXml()));
  
  for (const [path, data] of Object.entries(embeddedFiles)) {
      zip.file(path, data);
  }
  
  return await zip.generateAsync({ type: 'blob', compression: 'STORE' });
};

export const generateDawProjectFromBeatRecipe = async (recipe: any, userPlugins?: VSTPlugin[]): Promise<Blob> => {
  const project = new Project();
  project.application = new Application("BeatGangsta", "1.0.0");
  
  if (recipe.bpm) {
    project.transport = new Transport(new RealParameter(recipe.bpm, Unit.BPM));
  }
  
  const metadata = new MetaData();
  metadata.title = recipe.title || "Beat Recipe Project";
  
  project.arrangement = new Arrangement();
  project.arrangement.lanes = new Lanes();
  project.arrangement.lanes.lanes = [];
  
  const embeddedFiles: Record<string, Uint8Array | Blob> = {};
  
  const instrList = recipe.isGangstaVox ? recipe.gangstaVox?.vocalTracks || [] : recipe.instruments || [];
  
  for (const instr of instrList) {
    const tracks = generateTrackChannels(instr.name, instr.multiBandDetails);
    
    // Add empty audio to satisfy Studio One logic
    const dummyAudioName = `dummy_${instr.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`;
    const relativePath = `audio/${dummyAudioName}`;
    
    // Create an empty, minimal valid WAV header.
    embeddedFiles[relativePath] = createDummyWav(8.0);
    
    for (const track of tracks) {
      if (!project.structure) project.structure = [];
      project.structure.push(track);

      applyPluginsToTrack(track, instr.fxPlugins, instr.plugin, userPlugins);
      
      const audio = Utility.createAudio(relativePath, 44100, 2, 8.0); // 8 beats long approx
      const clip = Utility.createClip(audio, 0, 8.0);
      const clips = Utility.createClips(clip);
      clips.track = track;
      project.arrangement.lanes.lanes.push(clips);
    }
  }
  
  for (const bus of recipe.busses || []) {
    const track = Utility.createTrack(
      bus.name,
      new Set([ContentType.AUDIO]),
      'return' as any,
      0.8,
      0.5
    );
    if (!project.structure) project.structure = [];
    project.structure.push(track);
  }
  
  const zip = new JSZip();
  // @ts-ignore
  zip.file('metadata.xml', new TextEncoder().encode(metadata.toXml()));
  // @ts-ignore
  zip.file('project.xml', new TextEncoder().encode(project.toXml()));
  
  for (const [path, data] of Object.entries(embeddedFiles)) {
      zip.file(path, data);
  }
  
  return await zip.generateAsync({ type: 'blob', compression: 'STORE' });
};
