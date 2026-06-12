import { DawProject, Project, Application, MetaData, Utility, ContentType, MixerRole, Track, Channel, Plugin, Arrangement, Lanes, Vst3Plugin, Vst2Plugin, DeviceRole, Clip, Clips, Transport, RealParameter, Unit, DeviceRegistry } from 'dawproject-typescript';
import JSZip from 'jszip';
import { MixCritique, SavedRecipe, InstrumentTrack, DeepDivePlugin, VSTPlugin } from '../types';

// Internal flag to track initialization
let isInitialized = false;

function ensureInitialized() {
  if (isInitialized) return;
  
  // Removed monkey-patching logic as it may cause ReferenceErrors during module initialization in bundled builds
  
  isInitialized = true;
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

export const KNOWN_VST3_GUIDS: Record<string, string> = {
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

  // iZotope
  "ozone 10": "F2AEE70D-00DE-4F4E-5360-64544D6F6F7A",
  "ozone 11": "F2AEE70D-00DE-4F4E-5360-64544D6F6F7B",
  "neutron 4": "F2AEE70D-00DE-4F4E-5360-64544D6E6575",
  "nectar 3": "F2AEE70D-00DE-4F4E-5360-64544D6E6563",
  "nectar 4": "F2AEE70D-00DE-4F4E-5360-64544D6E6564",
  "vocal-synth 2": "F2AEE70D-00DE-4F4E-5360-64544D767332",

  // Baby Audio
  "smooth operator": "F2AEE70D-00DE-4F4E-5360-64544D736D6F",
  "ihny 2": "F2AEE70D-00DE-4F4E-5360-64544D69686E",
  "crystalline": "F2AEE70D-00DE-4F4E-5360-64544D637279",
  "transit": "F2AEE70D-00DE-4F4E-5360-64544D747261",

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
  "uaudio_teletronix_la-2": "ABCDEF01-9182-FAEB-5541-447855334135",
  "uaudio_ua_1176ln_rev_e": "ABCDEF01-9182-FAEB-5541-447855333958",
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

const getKnownVst3Guid = (name: string): string | null => {
  const cleanName = name.toLowerCase().replace(/uaudio_/, '').replace(/uadx /, '').replace(/uad /, '').trim();
  if (KNOWN_VST3_GUIDS[cleanName]) {
    return KNOWN_VST3_GUIDS[cleanName];
  }
  const superClean = cleanName.replace(/[^a-z0-9]/g, '');
  for (const [key, val] of Object.entries(KNOWN_VST3_GUIDS)) {
    const cleanKey = key.toLowerCase().replace(/uaudio_/, '').replace(/uadx /, '').replace(/uad /, '').replace(/[^a-z0-9]/g, '');
    if (cleanKey === superClean) {
      return val;
    }
  }
  return null;
};

const formatAsVst3GuidIfNeeded = (id: string, isVst3: boolean): string => {
  if (!id) return "";
  if (!isVst3) return id; // VST2 keeps its standard format
  
  const clean = id.replace(/[{}]/g, '').trim();
  
  // If it's a 32-character hex string, format as a standard hyphenated GUID (8-4-4-4-12)
  if (clean.length === 32 && !clean.includes("-")) {
    return [
      clean.slice(0, 8),
      clean.slice(8, 12),
      clean.slice(12, 16),
      clean.slice(16, 20),
      clean.slice(20)
    ].join('-').toUpperCase();
  }
  
  return clean.toUpperCase();
};

export const findBestUserPluginMatch = (suggestedName: string, userPlugins: VSTPlugin[] = []): VSTPlugin | null => {
  ensureInitialized();
  if (!suggestedName || userPlugins.length === 0) return null;

  const cleanSuggested = suggestedName.toLowerCase().replace(/[^a-z0-9]/g, '');

  let potentialMatches: VSTPlugin[] = [];

  // 1. Try exact match after cleaning non-alphanumeric chars
  for (const p of userPlugins) {
    if (p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanSuggested) {
      potentialMatches.push(p);
    }
  }

  // 1.5. If exact matches found, return the best one
  if (potentialMatches.length > 0) {
     return potentialMatches.sort((a, b) => {
         const aIsVst2 = a.type.toLowerCase() === 'vst2' || a.name.toLowerCase().endsWith('.dll') ? -1 : 1;
         const bIsVst2 = b.type.toLowerCase() === 'vst2' || b.name.toLowerCase().endsWith('.dll') ? -1 : 1;
         return aIsVst2 - bIsVst2;
     })[0];
  }

  // 2. Try substring match (e.g. if cleanSuggested contains p.name or vice-versa)
  for (const p of userPlugins) {
    const cleanUser = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanUser.length > 2 && (cleanSuggested.includes(cleanUser) || cleanUser.includes(cleanSuggested))) {
      potentialMatches.push(p);
    }
  }

  if (potentialMatches.length > 0) {
     return potentialMatches.sort((a, b) => {
         const aIsVst2 = a.type.toLowerCase() === 'vst2' || a.name.toLowerCase().endsWith('.dll') ? -1 : 1;
         const bIsVst2 = b.type.toLowerCase() === 'vst2' || b.name.toLowerCase().endsWith('.dll') ? -1 : 1;
         return aIsVst2 - bIsVst2;
     })[0];
  }

  // 3. Match by common aliases/keywords
  const lowerS = suggestedName.toLowerCase();
  for (const p of userPlugins) {
    const lowerP = p.name.toLowerCase();
    // EQs
    if (lowerS.includes('eq') || lowerS.includes('equalizer') || lowerS.includes('pro-q') || lowerS.includes('pro q')) {
      if (lowerP.includes('pro-q') || lowerP.includes('pro q') || lowerP.includes('equalizer') || lowerP.includes('pro eq') || lowerP.includes('proeq') || (lowerP.includes('eq') && p.vendor.toLowerCase().includes('fabfilter'))) {
        potentialMatches.push(p);
      }
    }
    // Compressors
    if (lowerS.includes('compressor') || lowerS.includes('compress') || lowerS.includes('comp') || lowerS.includes('cla-76') || lowerS.includes('1176') || lowerS.includes('la-2a') || lowerS.includes('la2a')) {
      if (lowerP.includes('comp') || lowerP.includes('cla-76') || lowerP.includes('1176') || lowerP.includes('la-2a') || lowerP.includes('la2a') || lowerP.includes('pro-c') || lowerP.includes('pro c')) {
        potentialMatches.push(p);
      }
    }
    // Saturation/Distortion
    if (lowerS.includes('decapitator') || lowerS.includes('saturation') || lowerS.includes('saturator') || lowerS.includes('saturn') || lowerS.includes('distortion') || lowerS.includes('drive')) {
      if (lowerP.includes('decapitator') || lowerP.includes('saturation') || lowerP.includes('saturator') || lowerP.includes('saturn') || lowerP.includes('dist') || lowerP.includes('knob')) {
        potentialMatches.push(p);
      }
    }
    // Reverbs
    if (lowerS.includes('reverb') || lowerS.includes('verb') || lowerS.includes('vintageverb') || lowerS.includes('valhalla') || lowerS.includes('space') || lowerS.includes('hall')) {
      if (lowerP.includes('reverb') || lowerP.includes('verb') || lowerP.includes('vintageverb') || lowerP.includes('valhalla') || lowerP.includes('raum') || lowerP.includes('space')) {
        potentialMatches.push(p);
      }
    }
    // Delays
    if (lowerS.includes('delay') || lowerS.includes('echo') || lowerS.includes('timeless')) {
      if (lowerP.includes('delay') || lowerP.includes('echo') || lowerP.includes('timeless') || lowerP.includes('replika')) {
        potentialMatches.push(p);
      }
    }
    // Deessers
    if (lowerS.includes('deesser') || lowerS.includes('de-esser') || lowerS.includes('pro-ds') || lowerS.includes('pro ds')) {
      if (lowerP.includes('deesser') || lowerP.includes('de-esser') || lowerP.includes('pro-ds') || lowerP.includes('pro ds')) {
        potentialMatches.push(p);
      }
    }
    // Limiters
    if (lowerS.includes('limiter') || lowerS.includes('pro-l') || lowerS.includes('pro l')) {
      if (lowerP.includes('limiter') || lowerP.includes('pro-l') || lowerP.includes('pro l') || lowerP.includes('l1') || lowerP.includes('l2') || lowerP.includes('maximizer')) {
        potentialMatches.push(p);
      }
    }
  }

  if (potentialMatches.length > 0) {
     return potentialMatches.sort((a, b) => {
         const aIsVst2 = a.type.toLowerCase() === 'vst2' || a.name.toLowerCase().endsWith('.dll') ? -1 : 1;
         const bIsVst2 = b.type.toLowerCase() === 'vst2' || b.name.toLowerCase().endsWith('.dll') ? -1 : 1;
         return aIsVst2 - bIsVst2;
     })[0];
  }

  return null;
};

const getPluginMetadata = (suggestedName: string, isInstrument: boolean, userPlugins: VSTPlugin[] = []): { deviceName: string, deviceVendor: string, deviceID: string, type: 'vst2' | 'vst3', version: string } => {
  const userMatch = findBestUserPluginMatch(suggestedName, userPlugins);
  if (userMatch) {
    const typeLower = userMatch.type.toLowerCase();
    const isVst3 = typeLower.includes('vst3') || (!typeLower.includes('vst2') && !userMatch.name.toLowerCase().endsWith('.dll') && !typeLower.includes('vst2'));
    const cleanUserMatchName = userMatch.name.toLowerCase();
    let deviceID = userMatch.id || "";
    
    if (isVst3) {
      const knownGuid = getKnownVst3Guid(userMatch.name);
      if (knownGuid) {
        deviceID = knownGuid;
      }
    }
    
    if (!deviceID) {
      // Hardware-coded fallbacks for very common plugins if user library extraction failed
      if (cleanUserMatchName.includes("pro-q 3") || cleanUserMatchName.includes("pro-q3") || cleanUserMatchName.includes("pro q 3")) {
        deviceID = "72C4DB71-7A4D-459A-B97E-51745D84B39D";
      } else if (cleanUserMatchName.includes("cla-76") || cleanUserMatchName.includes("cla76")) {
        deviceID = "56535443-3736-5377-6176-65737368656c";
      } else if (cleanUserMatchName.includes("cla-2a") || cleanUserMatchName.includes("cla2a")) {
        deviceID = "56535443-3241-5377-6176-65737368656c";
      } else if (cleanUserMatchName.includes("pro-c 2") || cleanUserMatchName.includes("pro-c2") || cleanUserMatchName.includes("pro c 2")) {
        deviceID = "72C4DB71-7A4D-459A-B97E-51744D666332";
      } else if (cleanUserMatchName.includes("pro-ds") || cleanUserMatchName.includes("pro ds")) {
        deviceID = "72C4DB71-7A4D-459A-B97E-51744D666473";
      } else if (cleanUserMatchName.includes("pro-l 2") || cleanUserMatchName.includes("pro-l2") || cleanUserMatchName.includes("pro l 2")) {
        deviceID = "72C4DB71-7A4D-459A-B97E-51744D666c32";
      } else if (cleanUserMatchName.includes("decapitator")) {
        deviceID = "F2AEE70D-00DE-4F4E-536E-645447446370";
      } else if (cleanUserMatchName.includes("saturn 2") || cleanUserMatchName.includes("saturn2")) {
        deviceID = "72C4DB71-7A4D-459A-B97E-51744D736132";
      } else if (cleanUserMatchName === "chorus" || cleanUserMatchName.includes("chorus")) {
        deviceID = "5D330224-87A5-4DA5-AF6C-9A87EE21C55C"; // Standard PreSonus Chorus
      } else if (cleanUserMatchName.includes("delay") && cleanUserMatchName.includes("valhalla")) {
        deviceID = "56535456-444c-5976-616c-68616c6c6164";
      } else if (cleanUserMatchName.includes("mixtool")) {
        deviceID = "5653544d-6978-746f-6f6c-533130303030";
      } else if (cleanUserMatchName.includes("microshift")) {
        deviceID = "F2AEE70D-00DE-4F4E-536E-6454474d6373";
      } else if (cleanUserMatchName.includes("compressor")) {
        deviceID = "54F19B72-352C-4AA5-A2AF-67F86F30D6BE";
      } else if (cleanUserMatchName.includes("limiter")) {
        deviceID = "61B18D53-26FA-4220-8614-89944A1990EC";
      } else if (cleanUserMatchName.includes("la-2") || cleanUserMatchName.includes("la2")) {
        deviceID = "ABCDEF01-9182-FAEB-5541-447855334135"; // UADx ID
      } else if (cleanUserMatchName.includes("1176")) {
        deviceID = "ABCDEF01-9182-FAEB-5541-447855333958"; // UADx ID
      } else if (cleanUserMatchName.includes("auto-tune pro") || cleanUserMatchName.includes("autotune pro")) {
        deviceID = "56535441-5450-3961-6e74-617265736174";
      } else if (cleanUserMatchName.includes("serum")) {
        deviceID = "56535458-6d4e-7973-6572-756d78363400";
      } else if (cleanUserMatchName.includes("nexus")) {
        deviceID = "5653544e-5853-336e-6578-757373706163";
      } else if (cleanUserMatchName.includes("omnisphere")) {
        deviceID = "5653544f-5048-526f-6d65-6e6973706865";
      } else if (cleanUserMatchName.includes("kontakt") || cleanUserMatchName.includes("contact")) {
        deviceID = "5653544e-694f-386b-6f6e-74616b743800";
      } else if (cleanUserMatchName.includes("sublab")) {
        deviceID = "56535453-4c41-4273-7562-6c6162767374";
      } else if (cleanUserMatchName.includes("keyszone")) {
        deviceID = "5653544b-5a43-4c6b-6579-737a6f6e6563";
      } else {
        deviceID = generateDeterministicDeviceID(userMatch.name, userMatch.vendor, isVst3);
      }
    }

    return {
      deviceName: userMatch.name,
      deviceVendor: userMatch.vendor,
      deviceID: formatAsVst3GuidIfNeeded(deviceID, isVst3),
      type: isVst3 ? 'vst3' : 'vst2',
      version: userMatch.version || '1.0'
    };
  }

  const meta = mapPluginMetadata(suggestedName, isInstrument);
  const knownGuid = getKnownVst3Guid(meta.deviceName);
  const finalID = knownGuid || meta.deviceID;
  return {
    deviceName: meta.deviceName,
    deviceVendor: meta.deviceVendor,
    deviceID: formatAsVst3GuidIfNeeded(finalID, true),
    type: 'vst3',
    version: '1.0'
  };
};

const applyDefaultVocalPlugins = (track: Track, trackName: string, userPlugins: VSTPlugin[] = []) => {
  if (!track.channel) {
    track.channel = new Channel();
    (track.channel as any).role = MixerRole.REGULAR;
  }
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
    fxDevice.name = meta.deviceName;
    (fxDevice as any).vendor = meta.deviceVendor;
    (fxDevice as any).version = meta.version;
    fxDevice.deviceRole = DeviceRole.AUDIO_FX;
    fxDevice.loaded = true;
    (fxDevice as any).pluginId = meta.deviceID;
    (fxDevice as any).vst3Id = meta.deviceID;
    (fxDevice as any).vst2Id = meta.deviceID;
    (fxDevice as any).deviceID = meta.deviceID;
    fxDevice.id = `p-${Math.random().toString(36).substring(2, 9)}`;
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
    track.loaded = true;
    if (track.channel) {
      if (!track.channel.devices) track.channel.devices = [];
    }
    tracks.push(track);
  }
  return tracks;
};

const applyPluginsToTrack = (track: Track, fxList: DeepDivePlugin[], instrumentName?: string, userPlugins: VSTPlugin[] = []) => {
  // Ensure we have a channel to attach devices to
  if (!track.channel) {
    track.channel = new Channel();
    (track.channel as any).role = MixerRole.REGULAR;
  }
  if (!track.channel.devices) track.channel.devices = [];
  
  let matchReport = `[Mapping Report for ${track.name}]\n`;
  
  const addDevice = (meta: any, role: DeviceRole, originalName: string) => {
    const fxDevice = meta.type === 'vst2' ? new Vst2Plugin() : new Vst3Plugin();
    // Use standard Property names for the library
    fxDevice.name = meta.deviceName;
    (fxDevice as any).vendor = meta.deviceVendor;
    (fxDevice as any).version = meta.version;
    fxDevice.deviceRole = role;
    fxDevice.loaded = true;
    
    // Store IDs in multiple possible fields to ensure monkey-patch or library picks them up
    (fxDevice as any).pluginId = meta.deviceID;
    (fxDevice as any).vst3Id = meta.deviceID;
    (fxDevice as any).vst2Id = meta.deviceID;
    (fxDevice as any).deviceID = meta.deviceID;
    if (meta.type === 'vst2') {
      (fxDevice as any).uniqueId = meta.deviceID;
    }
    
    // Assign a project-wide unique ID for the device
    fxDevice.id = `p-${Math.random().toString(36).substring(2, 9)}`;
    
    track.channel!.devices.push(fxDevice);
    
    matchReport += `+ ${role === DeviceRole.INSTRUMENT ? 'Instr' : 'FX'}: "${originalName}" -> "${meta.deviceName}" (${meta.type.toUpperCase()}) [ID: ${meta.deviceID}] (Vendor: ${meta.deviceVendor})\n`;
    if (meta.deviceID === "565354506c7567696e56616c69644944") {
      matchReport += `  ! WARNING: No ID match found for "${originalName}". Using generic VST ID which may cause load failures in some DAWs.\n`;
    }
  };

  if (instrumentName) {
    const meta = getPluginMetadata(instrumentName, true, userPlugins);
    addDevice(meta, DeviceRole.INSTRUMENT, instrumentName);
  }

  for (const fx of fxList || []) {
    const fxName = typeof fx === 'string' ? fx : (fx && (fx as any).name) || '';
    if (!fxName) continue;
    const meta = getPluginMetadata(fxName, false, userPlugins);
    addDevice(meta, DeviceRole.AUDIO_FX, fxName);
  }

  // Add mapping report to track comment for user debugging
  track.comment = (track.comment ? track.comment + "\n\n" : "") + matchReport;
};

const fixXmlForStudioOne = (xml: string) => {
  let result = xml;
  
  // Studio One expects pluginId for VST3 and uniqueId for VST2
  // The library outputs deviceID for both
  result = result.replace(/<Vst3Plugin ([^>]+)deviceID="([^"]+)"/g, '<Vst3Plugin $1pluginId="$2"');
  result = result.replace(/<Vst2Plugin ([^>]+)deviceID="([^"]+)"/g, '<Vst2Plugin $1uniqueId="$2"');
  
  // Also perform general fallback for any missed deviceID to pluginId
  result = result.replace(/deviceID=/g, 'pluginId=');
  
  return result;
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

const sendDebugLog = async (xml: string, project: Project) => {
  try {
    let allReports = "--- GLOBAL DAWPROJECT DEBUG REPORT ---\n";
    project.structure?.forEach(item => {
      if (item instanceof Track && item.comment) {
        allReports += item.comment + "\n";
      }
    });

    await fetch('/api/debug/dawproject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        xml,
        report: allReports
      })
    });
  } catch (e) {
    console.error("Failed to send debug log:", e);
  }
};

export const generateDawProjectFromMixCritique = async (critique: MixCritique, stems: any[], vocalTimeline?: any[], userPlugins?: VSTPlugin[]): Promise<Blob> => {
  ensureInitialized();
  const project = new Project();
  project.application = new Application("BeatGangsta", "1.0.0");
  
  if (critique.estimatedBPM) {
    project.transport = new Transport(new RealParameter(critique.estimatedBPM, Unit.BPM));
  }
  
  const metadata = new MetaData();
  metadata.title = critique.title || "Mix Critique Project";
  metadata.comment = `Project generated by BeatGangsta. Included ${stems.length} stems with AI-recommended processing chains.`;
  
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
  const finalXml = fixXmlForStudioOne(project.toXml());

  // @ts-ignore
  zip.file('metadata.xml', new TextEncoder().encode(metadata.toXml()));
  // @ts-ignore
  zip.file('project.xml', new TextEncoder().encode(finalXml));
  
  for (const [path, data] of Object.entries(embeddedFiles)) {
      zip.file(path, data);
  }

  // SILENT LOGGING FOR AI DEBUGGING
  sendDebugLog(finalXml, project);
  
  return await zip.generateAsync({ type: 'blob', compression: 'STORE' });
};

export const generateDawProjectFromBeatRecipe = async (recipe: any, userPlugins?: VSTPlugin[]): Promise<Blob> => {
  ensureInitialized();
  const project = new Project();
  project.application = new Application("BeatGangsta", "1.0.0");
  
  if (recipe.bpm) {
    project.transport = new Transport(new RealParameter(recipe.bpm, Unit.BPM));
  }
  
  const metadata = new MetaData();
  metadata.title = recipe.title || "Beat Recipe Project";
  metadata.comment = `Project generated by BeatGangsta from Beat Recipe: ${recipe.title}.\nIncludes instrument mappings and bus structures.`;
  
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
  zip.file('project.xml', new TextEncoder().encode(fixXmlForStudioOne(project.toXml())));
  
  for (const [path, data] of Object.entries(embeddedFiles)) {
      zip.file(path, data);
  }
  
  // SILENT LOGGING FOR AI DEBUGGING
  const finalXml = fixXmlForStudioOne(project.toXml());
  sendDebugLog(finalXml, project);

  return await zip.generateAsync({ type: 'blob', compression: 'STORE' });
};
