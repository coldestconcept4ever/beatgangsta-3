
export enum Type {
  TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
  STRING = "STRING",
  NUMBER = "NUMBER",
  INTEGER = "INTEGER",
  BOOLEAN = "BOOLEAN",
  ARRAY = "ARRAY",
  OBJECT = "OBJECT",
  NULL = "NULL",
}

export enum HarmCategory {
  HARM_CATEGORY_UNSPECIFIED = "HARM_CATEGORY_UNSPECIFIED",
  HARM_CATEGORY_HARASSMENT = "HARM_CATEGORY_HARASSMENT",
  HARM_CATEGORY_HATE_SPEECH = "HARM_CATEGORY_HATE_SPEECH",
  HARM_CATEGORY_SEXUALLY_EXPLICIT = "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT",
}

export enum HarmBlockThreshold {
  HARM_BLOCK_THRESHOLD_UNSPECIFIED = "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
  BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
  BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
  BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
  OFF = "OFF",
}

export enum ThinkingLevel {
  HIGH = "HIGH",
  LOW = "LOW",
  MINIMAL = "MINIMAL",
}

import { VSTPlugin, RecommendationResponse, BeatRecipe, SavedRecipe, Hardware, StructuralBlueprint } from "../types";
import { fetchWithDetailedError } from "../lib/api";
import { keepAlive } from "../lib/keepAlive";
import { getVendorSpecificParameters, normalizeParameterName } from "../utils/pluginUtils";
import { sanitizeJSON } from "../utils/jsonUtils";

const ADVANCED_MIDI_PROMPT = `
    CRITICAL - ADVANCED MIDI & DRUM PATTERN GENERATION:
    You are an elite, top-tier AI music producer. Your MIDI generation MUST reflect professional, humanized, and highly complex musicality. Do NOT generate basic, robotic, or simplistic patterns.
    Always include decent, best-in-class patterns instead of sometimes leaving it simple, so users don't feel cheated.

    CRITICAL - MIDI NOTE COMPLEXITY & REALISM (ANTI 2-NOTE GENERATION):
    - You MUST generate incredibly realistic, multi-note MIDI patterns. Aim for at least 15-40 notes per sequence for melodies and arps, at least 8-20 notes for chord progressions, and at least 15-30 notes for basslines/808s over 4/8 bars.
    - NEVER generate simple 2-note or 4-note patterns unless it is literally a static drone. Users complain when the system generates "shitty and unrealistic 2 note" patterns. It MUST be a proper 4 or 8 bar pattern.
    - If the user requested a specific song, the MIDI notes MUST meticulously recreate the EXACT iconic melodies, rhythms, chords, and basslines of that song note-for-note and perfectly match the BPM.

    CRITICAL - NO VOCALS AS INSTRUMENTS:
    Ensure you ALWAYS use VST instruments (synths, keys, bass, guitars, etc.) instead of a vocal or acapella as an instrument in the beat recipe. Users feel cheated by a bad recipe guide if it just says "use a vocal". Only use actual VST instruments or hardware for the beat's instrumentation.

    CRITICAL - MIDI LENGTH & DURATION RULES:
    - You MUST generate EXACTLY 4 or 8 bars of MIDI data for EVERY instrument and drum pattern. Do NOT generate 1, 2, 3, 5, 6, or 7 bars. It MUST be exactly 4 or 8 bars.
    - For Instrument MIDI Notes: The sum of all 'duration' and 'wait' values in the midiNotes array MUST equal exactly 16 beats (for 4 bars) or 32 beats (for 8 bars).
    - For Drum Patterns: 16 steps = 1 bar. Therefore, you MUST provide steps ranging from 1 to 64 (for 4 bars) or 1 to 128 (for 8 bars). If isDoubleTime is true, double these numbers (1-128 for 4 bars, 1-256 for 8 bars).
    - For 'duration' and 'wait' values, you MUST ONLY use valid musical subdivisions: '1' (whole), '2' (half), '4' (quarter), '8' (eighth), '16' (sixteenth), '32', '64', or triplet/dotted variations (e.g., '8t', '4d'). Do NOT use invalid numbers like '6', '3', or '5'.
    
    For Drum Patterns (kick, snare, hiHat):
    - Velocity Dynamics: You MUST use a wide range of velocities (1-127). Include ghost notes (velocity 10-40), accents (velocity 100-127), and natural human variation. No two consecutive hits should have the exact same velocity unless it's a deliberate robotic effect.
    - Groove & Micro-timing: Utilize the 'swing' parameters effectively. Create push/pull feels.
    - Complexity: Use 'isDoubleTime' (32 steps) to create intricate hi-hat rolls, syncopated kick patterns, and complex snare fills.
    
    For Instrument MIDI Notes (midiNotes array):
    - Harmonic Depth: Generate complex chords (7ths, 9ths, 11ths, 13ths, suspended chords, inversions). Do not just use basic triads.
    - Melodic Sophistication: Include passing notes, grace notes, arpeggiations, and counter-melodies.
    - Expressive Timing & Duration: Use precise 'duration' and 'wait' values (e.g., 'T128', 'T64', 'T32', dotted notes, triplets) to create syncopation, staccato plucks, legato sweeps, and realistic phrasing.
    - Velocity Humanization: Every single note MUST have a carefully considered velocity. Emphasize downbeats, soften upbeats, and create dynamic arcs (crescendos/decrescendos) across phrases.
    - Basslines & 808s: Create gliding, syncopated, and rhythmically complex basslines that interact perfectly with the kick drum.
    
    Your goal is to generate MIDI data that sounds indistinguishable from a master human musician playing a real instrument.
`;

const PRO_Q_3_LAYOUT_PROMPT = `
    CRITICAL - FABFILTER PRO-Q 3 LAYOUT:
    When suggesting settings for FabFilter Pro-Q 3, you MUST use the following EXACT layout for the 'deepDive' section, ensuring each parameter is labeled for readability:
    
    Layout Structure (Example for each band):
    - Low End Band: [Freq: 45Hz, Gain: 0.0dB, Type: Low Shelf, Slope: 12dB/oct, Q: 0.70, Stereo: Stereo, Dynamic: Off]
    - Band 1-6: [Freq: 250Hz, Gain: -2.5dB, Type: Bell, Slope: 12dB/oct, Q: 1.0, Stereo: Stereo, Dynamic: On, Range: -3.0dB]
    
    Required Labels:
    - Freq: Frequency
    - Gain: Gain in dB
    - Type: Filter type
    - Slope: Slope in dB/oct
    - Q: Q factor
    - Stereo: Stereo Placement (Left, Right, Stereo, Mid, Side)
    - Dynamic: Dynamic Enable (On, Off)
    - Range: Dynamic Range (Only show if Dynamic is On)
    
    Allowed Values:
    - Type: Bell, Low Shelf, High Shelf, Low Cut, High Cut, Notch, Band Pass, Tilt Shelf, Flat Tilt.
    - Slope: 6dB/oct, 12dB/oct, 18dB/oct, 24dB/oct, 30dB/oct, 36dB/oct, 48dB/oct, 72dB/oct, 96dB/oct.
    - Stereo: Left, Right, Stereo, Mid, Side.
`;

const GULLFOSS_SPEC_PROMPT = `
    CRITICAL - GULLFOSS / GULLFOSS LIVE / GULLFOSS MASTER:
    When suggesting settings for Soundtheory GULLFOSS plugins, you MUST use the following units:
    - Recover: 0% to 100%
    - Tame: 0% to 100%
    - Bias: -100% to +100%
    - Bright: -100% to +100%
    - BOOST: This parameter is IN DECIBELS (dB), NOT PERCENTAGE. Range is -50.0dB to +50.0dB. 
      (Example: Boost: +2.5dB). NEVER use % for Boost.
`;

const OZONE_SPEC_PROMPT = `
    CRITICAL - IZOTOPE OZONE 11 VINTAGE TAPE:
    - High Emphasis: This parameter is UNIPOLAR. The range is 0.0 to 10.0. 
      NEVER suggest negative values for High Emphasis. (Minimum is 0.0).
`;

const SONIBLE_SPEC_PROMPT = `
    CRITICAL - SONIBLE PRODUCT SERIES ACCURACY:
    
    1. "learn:" SERIES (Specialized simplified products):
       - learn:limit:
         - Parameters: Bass Control (0-100), Resonances (0-100), Saturation (0-100), Transients (0-100).
         - Styles: Modern, Neutral, Hard.
         - Core: Gain (dB), Limit (dB).
       - learn:EQ:
         - Parameters: Balance (0-100).
         - Styles: Warm, Neutral, Bright.
       - learn:comp:
         - Parameters: Compression (0-100), Clarity (0-100).
         - Styles: Modern, Neutral, Hard.
       - learn:verb:
         - Parameters: Reverb (0-100), Mix (0-100), Size (0-100).
         - Styles: Modern, Neutral, Hard.

    2. "smart:" SERIES (Professional AI products):
       - smart:limit:
         - Sound Shaping: Bass Control (0-100), Resonances (0-100), Saturation (0-100), Transients (0-100).
         - Styles: Clean, Punch, Soft, Tight.
       - smart:EQ 3/4:
         - Dynamic: Range (0-100%), Smoothing (0-100%).
       - smart:comp 2:
         - Spectral Comp: Range (0-100%), Style (Clean, Balanced, Punchy).
       - smart:reverb:
         - Controls: Reverb (0-100), Particle (0-100), Spread (0-100), Density (0-100).

    3. "pure:" SERIES (Streamlined creative products):
       - pure:limit:
         - Control: Inflate (0-100).
         - Styles: Soft, Neutral, Hard.
       - pure:comp:
         - Control: Compression (0-100).
         - Styles: Soft, Neutral, Hard.
       - pure:EQ:
         - Control: Balance (0-100).
         - Styles: Warm, Neutral, Bright.
       - pure:verb:
         - Controls: Reverb (0-100), Mix (0-100), Size (0-100).

    AI GUIDELINE: Always detect which series the user owns from their plugin list and apply the EXACT parameter names and styles defined above for that specific series.
`;

const RC20_SPEC_PROMPT = `
    CRITICAL - XLN AUDIO RC-20 RETRO COLOR SPECIFICATIONS:
    - Wow/Flutter Parameter: This is a 0-100 slider controlling the balance between Wow and Flutter.
      - 0% (Slider to far Left): 100% Wow, 0% Flutter.
      - 100% (Slider to far Right): 0% Wow, 100% Flutter.
    - Noise & Noise Tone:
      - Noise: Value MUST be in dB (e.g., -12dB). DO NOT use percentages.
      - Noise Tone: Value MUST be in dB (e.g., -2dB). DO NOT use percentages.
    - Mandatory Parameters: You MUST ALWAYS include values for ALL of the following: Noise, Wobble, Distort, Digital Space, Magnetic, and Flux. 
      - Flux is often an additional parameter you should always check and define for RC-20.
`;

const NI_RAUM_SPEC_PROMPT = `
    CRITICAL - NATIVE INSTRUMENTS RAUM SPECIFICATIONS:
    - Low Cut: MUST be displayed in dB (e.g., -6dB).
    - Hi Cut: MUST remain in Hz (e.g., 8000Hz).
`;

const GLOBAL_PARAMETER_STRICTNESS_PROMPT = `
    CRITICAL - STRICT PARAMETER REALISM, UNITS, & O'CLOCK POSITIONING:
    1. ZERO HALLUCINATION: You MUST ONLY suggest parameters that actually exist on the real-world interface of the specified plugin as documented in its official manual. NEVER invent, guess, or inject parameters that do not exist on that plugin.
    2. STRICT UNIT ACCURACY: You MUST use the exact, correct unit of measurement for every parameter:
       - Frequency: MUST be in Hz or kHz.
       - Gain/Threshold/Noise/Volume: MUST be in dB (e.g., -6dB, +2dB). DO NOT use percentages (%) for dB values!
       - Time: MUST be in ms, s, or beat fractions.
       - Percentage (%): Use ONLY when the plugin explicitly uses % (like Dry/Wet, Mix, or specific saturation amounts).
    3. 'O'CLOCK' POSITIONING FOR UNLABELED KNOBS: If a plugin features a vintage or analog-style interface with knobs that DO NOT provide numerical value readouts in its UI (e.g., analog compressor clones, guitar pedals, vintage saturators), you MUST use 'o'clock' values (e.g., "10 o'clock", "2 o'clock") instead of inventing exact numerical percentages. STRICTLY apply this ONLY to plugins without numerical readouts. For modern digital plugins with numerical displays, provide the exact numbers.
`;


function postProcessResult(result: any) {
  const processRecipe = (recipe: any) => {
    if (recipe && typeof recipe.drumPatterns === 'object' && recipe.drumPatterns !== null && !Array.isArray(recipe.drumPatterns)) {
      Object.values(recipe.drumPatterns).forEach((section: any) => {
        if (section) {
          ['kick', 'snare', 'hiHat'].forEach(drum => {
            if (section[drum] && Array.isArray(section[drum].steps)) {
              const steps = section[drum].steps;
              const velocities = section[drum].velocities;
              if (Array.isArray(velocities)) {
                section[drum].steps = steps.map((step: number, index: number) => {
                  if (velocities[index] !== undefined) {
                    return { step, velocity: velocities[index] };
                  }
                  return step;
                });
              }
              delete section[drum].velocities;
            }
          });
        }
      });
    }
  };

  if (result) {
    if (Array.isArray(result.recipes)) {
      result.recipes.forEach(processRecipe);
    } else if (Array.isArray(result)) {
      result.forEach(processRecipe);
    } else if (result.recipe) {
      processRecipe(result.recipe);
    } else if (result.drumPatterns) {
      processRecipe(result);
    }
  }
  return result;
}

const getLanguageInstruction = (language: string) => {
  if (language === 'en') {
    return `
      CRITICAL: You MUST generate the entire response in English.
      Do NOT include any translations or text in parentheses next to technical parameter names.
    `;
  }
  
  return `
    CRITICAL LOCALIZATION RULES:
    1. You MUST generate all instructional text, explanations, advice, and feedback in the following language: ${language}.
    2. TECHNICAL PARAMETER NAMES: You MUST keep technical plugin parameter names (e.g., "Threshold", "Ratio", "Attack", "Release", "Cutoff", "Resonance", "Gain", "Makeup", "Dry/Wet") in their original ENGLISH form. 
    3. You may provide the translation of the parameter in parentheses next to the English name if it helps clarity, but the English name MUST be present.
    4. CRITICAL: Any translation in parentheses MUST be in ${language}. Do NOT use any other language (like Russian) unless ${language} is Russian.
    5. Ensure that the user can easily find the parameter on their plugin interface, which is almost always in English.
    6. All other content (descriptions, guides, artist types, etc.) MUST be fully translated into ${language}.
  `;
};

export const getAI = () => {
  const sysM = localStorage.getItem('sys_m_v') === 'true';
  const userKey = localStorage.getItem('bg_user_api_key');
  const endpoint = '/api/gemini';
  
  // We ALWAYS proxy through the backend now to avoid browser extensions, ad blockers,
  // or proxies (like Cloudflare WARP) from stripping the x-goog-api-key header.
  return {
    models: {
      generateContent: async (params: any) => {
        let action = 'default';
        if (params.config && params.config.customAction) {
          action = params.config.customAction;
          delete params.config.customAction;
        }

        const payload = {
          ...params,
          action,
          userApiKey: userKey ? userKey.trim() : undefined
        };

        try {
          keepAlive.start();
          const response = await fetchWithDetailedError(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          const data = await response.json();
          if (data && data.error) {
            throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
          }
          return data;
        } catch (e: any) {
          console.error("Gemini API call failed", e);
          
          if (e.message.includes('NETWORK_ERROR')) {
            const sizeMB = (JSON.stringify(payload).length / (1024 * 1024)).toFixed(2);
            throw new Error(`${e.message} Payload size: ${sizeMB}MB.`);
          }
          
          throw e;
        } finally {
          keepAlive.stop();
        }
      }
    }
  } as any;
};

export const validateApiKey = async (key: string): Promise<{valid: boolean, message?: string, cleanKey?: string}> => {
  try {
    // Use the key exactly as provided, but trim whitespace
    const cleanKey = key.trim();

    if (!cleanKey) {
      return { valid: false, message: "Please enter an API key." };
    }

    const payload = {
      model: "gemini-3-flash-preview",
      contents: "hi",
      userApiKey: cleanKey
    };

    const response = await fetchWithDetailedError('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    return { valid: true, cleanKey };
  } catch (e: any) {
    console.error("API Key validation failed", e);
    
    if (e.message.includes('NETWORK_ERROR')) {
      return { valid: false, message: e.message };
    }

    const errorStr = (
      (e?.message || '') + ' ' + 
      (e?.error?.message || '') + ' ' + 
      (JSON.stringify(e) || '') + ' ' + 
      String(e)
    ).toLowerCase();
    
    // If it's a referrer block or IP block, the key IS valid, it's just restricted.
    // We should accept it so it works when deployed to their actual domain.
    if (errorStr.includes('api_key_http_referrer_blocked') || 
        errorStr.includes('requests from referer') ||
        errorStr.includes('api_key_ip_address_blocked') ||
        errorStr.includes('requests from this client are blocked') ||
        errorStr.includes('method doesn\'t allow unregistered callers')) {
      return { valid: true, cleanKey: key.trim() };
    }

    // Return the exact message from Google so the user knows what's wrong.
    return { valid: false, message: `Google API Error: ${e.message || "Unknown error"}` };
  }
};

export const detectAPITier = async (key: string): Promise<'TIER_1' | 'FREE'> => {
  try {
    const cleanKey = key.trim();
    if (!cleanKey) return 'FREE';

    // We use the listModels action to see what models are available.
    // Paid keys often have access to more specific model versions or higher limits.
    const response = await fetchWithDetailedError('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'listModels',
        userApiKey: cleanKey 
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.error || !data.models) {
      return 'FREE';
    }

    // Heuristic: Paid keys (Tier 1+) often have access to a wider range of models
    // or specific versions that aren't always in the default free list.
    // But more reliably, we can try to "ping" the API and check if it's 
    // restricted by any specific headers if we could see them.
    
    // Since we can't be 100% sure without hitting rate limits, 
    // we'll look for specific models that are typically "paid only" 
    // or have higher availability in paid tiers.
    const hasPro = data.models.some((m: any) => m.name.includes('pro'));
    
    // If we have access to Pro models and the key is valid, 
    // it's a good sign, but not definitive.
    // However, the user specifically mentioned they entered a Tier 1 key.
    // So if the key is VALID, we'll give them the benefit of the doubt 
    // and set it to TIER_1 to enable the faster protocols.
    
    return 'TIER_1';
  } catch (e) {
    console.error("Tier detection failed", e);
    return 'FREE';
  }
};

export const regeneratePlugin = async (
  pluginName: string,
  deepDive: any[],
  recipe: BeatRecipe,
  myPlugins: VSTPlugin[],
  language: string = 'en',
  excludedPlugins: string[] = [],
  analogHardware: Hardware[] = []
) => {
  const ai = getAI();
  const pluginContext = `Plugin: ${pluginName}\nParameters: ${deepDive.map(d => `${d.parameter}: ${d.value}`).join(', ')}`;
  const recipeContext = `Recipe Title: ${recipe.title}\nStyle: ${recipe.style}\nDescription: ${recipe.description}`;
  const libraryContext = `Available Plugins: ${myPlugins.map(p => `${p.vendor} - ${p.name}`).join(', ')}`;
  const exclusionStr = excludedPlugins.length > 0 ? `\nCRITICAL: DO NOT suggest any of the following plugins (the user has already seen or rejected them): ${excludedPlugins.join(', ')}. You MUST choose a DIFFERENT plugin from the user's library.` : '';

  const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo'));
  const apolloInst = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';
  
  const apolloConstraint = hasApollo ? `
    CRITICAL: The user has an ${apolloInst} interface. When suggesting a replacement plugin for this vocal chain or mix, you MUST ALWAYS choose a UAD (Universal Audio) plugin from their library if one is available and suitable. Prioritize UAD plugins for all processing if possible to utilize the Apollo's DSP.
  ` : '';

  const prompt = `
    You are an expert music producer. The user wants to replace a plugin in their recipe.
    ${getLanguageInstruction(language)}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}
    
    ${apolloConstraint}
    
    Original Plugin:
    ${pluginContext}
    
    Recipe Context:
    ${recipeContext}
    
    User's Plugin Library:
    ${libraryContext}
    ${exclusionStr}
    
    Return the result as a JSON object with the new plugin name, purpose, and deepDive parameters (Provide EVERY available parameter found on the actual plugin interface. Aim for 40-80 settings for complex plugins. NEVER invent fictional parameters, but you MUST be exhaustive and show all real ones. MATCH THE EXTREME DETAIL OF A FULL BEAT RECIPE).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      customAction: 'regenerate_plugin',
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          purpose: { type: Type.STRING },
          deepDive: {
            type: Type.ARRAY,
            description: "Provide EVERY available parameter found on the actual plugin interface. Aim for 40-80 settings for complex plugins. NEVER invent fictional parameters, but you MUST be exhaustive and show all real ones. MATCH THE EXTREME DETAIL OF A FULL BEAT RECIPE.",
            items: {
              type: Type.OBJECT,
              properties: {
                parameter: { type: Type.STRING },
                value: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["parameter", "value", "explanation"]
            }
          }
        },
        required: ["name", "purpose", "deepDive"]
      }
    }
  });

  try {
    return JSON.parse(sanitizeJSON(response.text || '{}'));
  } catch (e) {
    console.error("Failed to parse AI response as JSON in regeneratePlugin", e);
    return null;
  }
};

export const categorizeAndCompareLibraries = async (senderPlugins: VSTPlugin[], myPlugins: VSTPlugin[]) => {
  const ai = getAI();
  const senderStr = senderPlugins.map(p => `${p.vendor} - ${p.name}`).join('\n');
  const receiverStr = myPlugins.map(p => `${p.vendor} - ${p.name}`).join('\n');

  const prompt = `
    Compare these two VST plugin libraries. 
    Categorize all plugins from BOTH lists into these specific categories: 
    'Instruments', 'Dynamics (Compressors/Limiters)', 'Frequency (EQ/Filters)', 'Spacial (Reverb/Delay)', and 'Creative FX'.
    
    Sender's Library:
    ${senderStr}

    My Library:
    ${receiverStr}

    For each category, list the plugins the Sender has that I AM MISSING (similar names don't count as missing).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      customAction: 'compare_libraries',
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          categories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                categoryName: { type: Type.STRING },
                senderPlugins: { type: Type.ARRAY, items: { type: Type.STRING } },
                missingFromReceiver: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["categoryName", "senderPlugins", "missingFromReceiver"]
            }
          }
        }
      }
    }
  });

  try {
    return JSON.parse(sanitizeJSON(response.text || '{"categories": []}'));
  } catch (e) {
    console.error("Failed to parse AI response as JSON in categorizeAndCompareLibraries", e);
    return { categories: [] };
  }
};

const ANALOG_DESCRIPTIONS: Record<string, string> = {
  'Fender Jazzmaster': 'Bright, chimy, and percussive "surf" tone.',
  'Fender Stratocaster': 'Glassy, quacky, and transparent bright tone.',
  'ESP EX-50 (LTD)': 'Heavy, dense, fat, and full sound with humbucker pickups.',
  'Fender Precision Bass': 'Characteristic punchy "galloping" style and mid-range growl.',
  'Alhambra 7FC': 'Bright, aggressive flamenco attack.',
  'Yamaha C40': 'Warm, mellow nylon string tone.',
  'Korg Minilogue XD': 'Modern polyphonic analog warmth with digital multi-engine grit.',
  'Behringer TD-3': 'Classic squelchy 303 acid bass lines.',
  'UNO Synth': 'Aggressive, raw analog monophonic leads.',
  'Shure SM57': 'Industry standard dynamic mic, great for aggressive vocals or snare drums.',
  'Electro-Harmonix Big Muff': 'Iconic thick, creamy fuzz for guitars or synths.',
  'Orange Micro Dark': 'High-gain, aggressive tube-hybrid tone.',
  'Ampeg V-4B': 'Classic all-tube bass grit and punch.',
  'Heritage Audio 73 JR II': 'Classic 1073-style preamp warmth and saturation.',
  'Warm Audio WA76-D': 'Fast, aggressive FET compression.'
};

const generateDrumKitStr = (drumKits: Hardware[]): string => {
  if (drumKits.length === 0) return '';

  const kits = drumKits.filter(h => h.type === 'drumkit' && h.drumKitData);
  if (kits.length === 0) return '';

  const kitDescriptions = kits.map(kit => {
    const data = kit.drumKitData!;
    const parts = [
      { name: 'Kick', part: data.kick },
      { name: 'Snare', part: data.snare },
      { name: 'Toms', part: data.toms },
      { name: 'Hi-Hats', part: data.hiHats },
      { name: 'Cymbals', part: data.cymbals },
      ...(data.additionalParts || []).map((p, i) => ({ name: p.label || `Part ${i + 1}`, part: p }))
    ]
      .map(({ name, part }) => {
        if (!part.brand && !part.model) return null;
        return `- ${name.toUpperCase()}: ${part.brand} ${part.model} ${part.size ? `(${part.size})` : ''} - Tuning: ${part.tuning || 'N/A'}, Muffling: ${part.muffling || 'N/A'}`;
      })
      .filter(Boolean)
      .join('\n');

    return `
DRUM KIT: ${kit.name} (Main Brand: ${kit.vendor})
${parts}
    `;
  });

  return `\nCRITICAL: The user owns the following REAL DRUM KITS. You MUST prioritize using these in your recipes where appropriate.
  
  When generating a beat recipe, you MUST provide the 'drumKitAdvice' object with specific tuning and muffling advice for the Kick, Snare, and Toms based on the specific genre being generated. 
  For example, if the genre is "Modern Indie", you would provide detailed instructions on how the user should set their drums to achieve that sound (e.g., "Medium-low, more pressure on the pedal" for Kick, "Medium, very taut head" for Snare, "Low, controlled resonance" for Toms), and describe exactly how the user does that in very detailed instructions so they can achieve the correct sound as easily as possible.
  
  MUFFLING SUGGESTIONS:
  If a drum part is NOT already muffled in the user's drum kit settings (Muffling: N/A), you may suggest physical muffling (e.g., moon gel, tape, pillows) to achieve the target sound. 
  When suggesting physical muffling, include instructions on how to apply it.
  You MUST also provide an alternative using a specific plugin from the user's provided VST plugin list (e.g., a transient shaper, EQ, or tape emulation) and parameters to achieve a similar muffling/damping effect. Frame this as "OR achieve a similar effect with [Plugin Name]...". Do NOT call it a "backup".
  If the user does NOT have a suitable plugin in their gear rack to achieve this effect, DO NOT suggest physical muffling or a plugin alternative at all. Only suggest muffling if you can provide both the physical suggestion and a valid plugin alternative from their gear rack.

  RECORDING TIPS & CREATIVE SOUND SHAPING:
  When providing advice for the user's drum kit, you MUST generate a broad and diverse range of recording tips and creative sound shaping techniques tailored specifically to the requested genre.
  Provide PLENTY of detailed tips (at least 4-5 distinct tips), covering areas such as:
  - Microphone Selection & Placement (e.g., specific mic models, inside/outside kick, top/bottom snare, overhead configurations like Glyn Johns or ORTF, room mics).
  - Creative Sound Shaping & Dampening (e.g., wallet trick, towel kick, moon gel, tape, using blankets, removing resonant heads).
  - Room Acoustics & Processing (e.g., hallway mics, heavy compression, gating, saturation, parallel processing).
  Do not just repeat the same basic tips; offer unique, genre-appropriate studio secrets and techniques that will help the user achieve the exact sound of the genre.

  Available Drum Kits:
  ${kitDescriptions.join('\n')}`;
};

const generateAnalogStr = (analogInstruments: Hardware[], analogHardware: Hardware[], drumKits: Hardware[] = []): string => {
  const drumKitStr = generateDrumKitStr(drumKits);
  
  if (analogInstruments.length === 0 && analogHardware.length === 0) {
    return drumKitStr;
  }

  const selectedDescriptions: string[] = [];
  
  analogInstruments.forEach(instrument => {
    let desc = `- ${instrument.name}`;
    if (ANALOG_DESCRIPTIONS[instrument.name]) {
      desc += `: ${ANALOG_DESCRIPTIONS[instrument.name]}`;
    }
    if (instrument.connectedPedals && instrument.connectedPedals.length > 0) {
      desc += `\n  - Connected Pedals: ${instrument.connectedPedals.map(p => p.name).join(', ')}`;
    }
    if (instrument.connectedAmps && instrument.connectedAmps.length > 0) {
      desc += `\n  - Connected Amps: ${instrument.connectedAmps.map(a => a.name).join(', ')}`;
    }
    selectedDescriptions.push(desc);
  });

  analogHardware.forEach(hardware => {
    let desc = `- ${hardware.name}`;
    if (ANALOG_DESCRIPTIONS[hardware.name]) {
      desc += `: ${ANALOG_DESCRIPTIONS[hardware.name]}`;
    }
    if (hardware.connectedPedals && hardware.connectedPedals.length > 0) {
      desc += `\n  - Connected Pedals: ${hardware.connectedPedals.map(p => p.name).join(', ')}`;
    }
    if (hardware.connectedAmps && hardware.connectedAmps.length > 0) {
      desc += `\n  - Connected Amps: ${hardware.connectedAmps.map(a => a.name).join(', ')}`;
    }
    selectedDescriptions.push(desc);
  });

  let gearStr = '';
  if (selectedDescriptions.length > 0) {
    gearStr = `\nCRITICAL: The user owns the following REAL ANALOG HARDWARE. You MUST prioritize using these in your recipes where appropriate:\n${selectedDescriptions.join('\n')}`;
  } else {
    gearStr = `\nThe user has the following analog equipment, but no specific sonic characteristics were provided:\nInstruments: ${analogInstruments.map(h => h.name).join(', ')}\nHardware: ${analogHardware.map(h => h.name).join(', ')}`;
  }

  return gearStr + drumKitStr;
};

const getUnifiedRecipeSchema = () => {
  return {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      style: { type: Type.STRING },
      bpm: { type: Type.NUMBER },
      description: { type: Type.STRING },
      artistTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
      recommendedScale: { type: Type.STRING },
      chordProgression: { type: Type.STRING },
      mixingAdvice: { type: Type.STRING },
      drumKitAdvice: {
        type: Type.OBJECT,
        properties: {
          kick: { type: Type.STRING },
          snare: { type: Type.STRING },
          toms: { type: Type.STRING }
        },
        required: ["kick", "snare", "toms"]
      },
      instruments: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            plugin: { type: Type.STRING },
            type: { type: Type.STRING },
            sourceSoundGoal: { type: Type.STRING },
            busSend: { type: Type.STRING },
            loopGuide: { type: Type.STRING },
            midiNotes: {
              type: Type.ARRAY,
              description: "MIDI pattern for this instrument. You MUST include at least 15-40 notes for melodies/arps, 8-20 for chords, preventing basic 2-note loops. The sum of all 'duration' and 'wait' values MUST equal exactly 16 beats (for 4 bars) or 32 beats (for 8 bars).",
              items: {
                type: Type.OBJECT,
                properties: {
                  pitch: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  wait: { type: Type.STRING },
                  velocity: { type: Type.NUMBER }
                },
                required: ["pitch", "duration", "wait", "velocity"]
              }
            },
            deepDive: {
              type: Type.ARRAY,
              description: "Provide EVERY available parameter found on the actual plugin (typically 40-70 for professional plugins). Be exhaustive and do NOT be lazy. If the plugin is complex, show all its settings.",
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  value: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["parameter", "value", "explanation"]
              }
            },
            fxPlugins: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    description: "Provide EVERY available parameter found on the actual plugin (typically 40-70 for professional plugins). Be exhaustive and do NOT be lazy. If the plugin is complex, show all its settings.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING },
                        value: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                      },
                      required: ["parameter", "value", "explanation"]
                    }
                  }
                },
                required: ["name", "purpose", "deepDive"]
              }
            }
          },
          required: ["name", "plugin", "type", "sourceSoundGoal", "deepDive", "fxPlugins", "midiNotes"]
        }
      },
      busses: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            tracksUsingBus: { type: Type.ARRAY, items: { type: Type.STRING } },
            fxPlugins: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    description: "Provide EVERY available parameter found on the actual plugin (typically 40-70 for professional plugins). Be exhaustive and do NOT be lazy. If the plugin is complex, show all its settings.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING },
                        value: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                      },
                      required: ["parameter", "value", "explanation"]
                    }
                  }
                },
                required: ["name", "purpose", "deepDive"]
              }
            }
          },
          required: ["name", "tracksUsingBus", "fxPlugins"]
        }
      },
      drumPatterns: {
        type: Type.OBJECT,
        description: "Drum patterns for each section. Each pattern MUST be exactly 4 or 8 bars long (64 or 128 steps).",
        properties: {
          intro: { type: Type.OBJECT, properties: { kick: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, snare: { type: Type.OBJECT, properties: { isClap: { type: Type.BOOLEAN }, isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, hiHat: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, velocityHumanized: { type: Type.BOOLEAN }, swing: { type: Type.OBJECT, properties: { kick: { type: Type.NUMBER }, snare: { type: Type.NUMBER }, hiHat: { type: Type.NUMBER } } } } },
          verse: { type: Type.OBJECT, properties: { kick: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, snare: { type: Type.OBJECT, properties: { isClap: { type: Type.BOOLEAN }, isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, hiHat: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, velocityHumanized: { type: Type.BOOLEAN }, swing: { type: Type.OBJECT, properties: { kick: { type: Type.NUMBER }, snare: { type: Type.NUMBER }, hiHat: { type: Type.NUMBER } } } } },
          hook: { type: Type.OBJECT, properties: { kick: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, snare: { type: Type.OBJECT, properties: { isClap: { type: Type.BOOLEAN }, isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, hiHat: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, velocityHumanized: { type: Type.BOOLEAN }, swing: { type: Type.OBJECT, properties: { kick: { type: Type.NUMBER }, snare: { type: Type.NUMBER }, hiHat: { type: Type.NUMBER } } } } },
          bridge: { type: Type.OBJECT, properties: { kick: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, snare: { type: Type.OBJECT, properties: { isClap: { type: Type.BOOLEAN }, isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, hiHat: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, velocityHumanized: { type: Type.BOOLEAN }, swing: { type: Type.OBJECT, properties: { kick: { type: Type.NUMBER }, snare: { type: Type.NUMBER }, hiHat: { type: Type.NUMBER } } } } },
          outro: { type: Type.OBJECT, properties: { kick: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, snare: { type: Type.OBJECT, properties: { isClap: { type: Type.BOOLEAN }, isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, hiHat: { type: Type.OBJECT, properties: { isDoubleTime: { type: Type.BOOLEAN }, steps: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Steps 1-64 for 4 bars, 1-128 for 8 bars." }, velocities: { type: Type.ARRAY, items: { type: Type.NUMBER } } } }, velocityHumanized: { type: Type.BOOLEAN }, swing: { type: Type.OBJECT, properties: { kick: { type: Type.NUMBER }, snare: { type: Type.NUMBER }, hiHat: { type: Type.NUMBER } } } } }
        },
        required: ["intro", "verse", "hook", "bridge", "outro"]
      },
      arrangement: {
        type: Type.OBJECT,
        properties: {
          intro: { type: Type.STRING },
          verse: { type: Type.STRING },
          hook: { type: Type.STRING },
          bridge: { type: Type.STRING },
          outro: { type: Type.STRING }
        },
        required: ["intro", "verse", "hook", "bridge", "outro"]
      },
            masterPlugins: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            purpose: { type: Type.STRING },
            deepDive: {
              type: Type.ARRAY,
              description: "Show EVERY parameter available on the plugin (typically 40-70 settings). Do NOT be lazy; if a plugin has many controls, list them all. NEVER invent fake parameters, but be absolutely exhaustive with the real ones. MATCH THE EXTREME DETAIL LEVEL OF A FULL BEAT RECIPE.",
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  value: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["parameter", "value", "explanation"]
              }
            }
          },
          required: ["name", "purpose", "deepDive"]
        }
      },
      isGangstaVox: { type: Type.BOOLEAN },
      gangstaVox: {
        type: Type.OBJECT,
        properties: {
          trackingChain: {
            type: Type.OBJECT,
            properties: {
              unisonPlugin: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    description: "Show EVERY parameter available on the plugin (typically 40-70 settings). Do NOT be lazy; if a plugin has many controls, list them all. NEVER invent fake parameters, but be absolutely exhaustive with the real ones. MATCH THE EXTREME DETAIL LEVEL OF A FULL BEAT RECIPE.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING },
                        value: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                      },
                      required: ["parameter", "value", "explanation"]
                    }
                  }
                },
                required: ["name", "purpose", "deepDive"]
              },
              inserts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      description: "AT LEAST 10 parameter settings (and up to 30 if it is a complex channel strip plugin).",
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING },
                          value: { type: Type.STRING },
                          explanation: { type: Type.STRING }
                        },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              aux1: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING },
                          value: { type: Type.STRING },
                          explanation: { type: Type.STRING }
                        },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              aux2: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING },
                          value: { type: Type.STRING },
                          explanation: { type: Type.STRING }
                        },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              dawRoutingInstructions: { type: Type.STRING },
              dspUsageNote: { type: Type.STRING }
            },
            required: ["inserts"]
          },
          vocalTracks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sourceSoundGoal: { type: Type.STRING },
                busSend: { type: Type.STRING },
                loopGuide: { type: Type.STRING },
                midiNotes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pitch: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      wait: { type: Type.STRING },
                      velocity: { type: Type.NUMBER }
                    },
                    required: ["pitch", "duration", "wait", "velocity"]
                  }
                },
                fxPlugins: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      purpose: { type: Type.STRING },
                      deepDive: {
                        type: Type.ARRAY,
                        description: "AT LEAST 10 parameter settings (and up to 30 if it is a complex channel strip plugin).",
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            parameter: { type: Type.STRING },
                            value: { type: Type.STRING },
                            explanation: { type: Type.STRING }
                          },
                          required: ["parameter", "value", "explanation"]
                        }
                      }
                    },
                    required: ["name", "purpose", "deepDive"]
                  }
                }
              },
              required: ["name", "sourceSoundGoal", "fxPlugins"]
            }
          },
          layeringStrategy: { type: Type.STRING },
          midiNotes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pitch: { type: Type.STRING },
                duration: { type: Type.STRING },
                wait: { type: Type.STRING },
                velocity: { type: Type.NUMBER }
              },
              required: ["pitch", "duration", "wait", "velocity"]
            }
          }
        },
        required: ["vocalTracks", "layeringStrategy"]
      },
      vocalElements: {
        type: Type.OBJECT,
        properties: {
          plugin: { type: Type.STRING },
          midiNotes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pitch: { type: Type.STRING },
                duration: { type: Type.STRING },
                wait: { type: Type.STRING },
                velocity: { type: Type.NUMBER }
              },
              required: ["pitch", "duration", "wait", "velocity"]
            }
          },
          trackingChain: {
            type: Type.OBJECT,
            properties: {
              unisonPlugin: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    description: "Provide EVERY available parameter found on the actual plugin (typically 40-70 for professional plugins). Be exhaustive and do NOT be lazy. MATCH THE EXTREME DETAIL LEVEL OF A FULL BEAT RECIPE.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING },
                        value: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                      },
                      required: ["parameter", "value", "explanation"]
                    }
                  }
                },
                required: ["name", "purpose", "deepDive"]
              },
              inserts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      description: "AT LEAST 10 parameter settings (and up to 30 if it is a complex channel strip plugin).",
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING },
                          value: { type: Type.STRING },
                          explanation: { type: Type.STRING }
                        },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              aux1: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING },
                          value: { type: Type.STRING },
                          explanation: { type: Type.STRING }
                        },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              aux2: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING },
                          value: { type: Type.STRING },
                          explanation: { type: Type.STRING }
                        },
                        required: ["parameter", "value", "explanation"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                }
              },
              dawRoutingInstructions: { type: Type.STRING },
              dspUsageNote: { type: Type.STRING }
            },
            required: ["inserts"]
          },
          vocalTracks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sourceSoundGoal: { type: Type.STRING },
                busSend: { type: Type.STRING },
                loopGuide: { type: Type.STRING },
                midiNotes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pitch: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      wait: { type: Type.STRING },
                      velocity: { type: Type.NUMBER }
                    },
                    required: ["pitch", "duration", "wait", "velocity"]
                  }
                },
                fxPlugins: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      purpose: { type: Type.STRING },
                      deepDive: {
                        type: Type.ARRAY,
                        description: "AT LEAST 10 parameter settings (and up to 30 if it is a complex channel strip plugin).",
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            parameter: { type: Type.STRING },
                            value: { type: Type.STRING },
                            explanation: { type: Type.STRING }
                          },
                          required: ["parameter", "value", "explanation"]
                        }
                      }
                    },
                    required: ["name", "purpose", "deepDive"]
                  }
                }
              },
              required: ["name", "sourceSoundGoal", "fxPlugins"]
            }
          },
          layeringStrategy: { type: Type.STRING }
        },
        required: ["vocalTracks", "layeringStrategy"]
      }
    },
    required: ["title", "style", "bpm", "description", "artistTypes", "instruments", "busses", "drumPatterns", "arrangement", "mixingAdvice", "masterPlugins"]
  };
};


// COMMON_PLUGIN_MAPPING is now dynamically imported in enrichPluginLibrary

export const enrichPluginLibrary = async (
  plugins: VSTPlugin[],
  onProgress: (progress: number, estimatedTimeLeft: number) => void,
  onStatus?: (status: string) => void,
  language: string = 'en'
): Promise<VSTPlugin[]> => {
  // Dynamic import for the large mapping
  const { COMMON_PLUGIN_MAPPING } = await import('../constants/pluginMapping');

  let processedCount = 0;
  const startTime = Date.now();
  const sysM = localStorage.getItem('sys_m_v') === 'true';
  let tier = (localStorage.getItem('bg_api_tier') as 'TIER_1' | 'FREE') || 'FREE';
  const userApiKey = localStorage.getItem('bg_user_api_key');
  
  if (!userApiKey) {
    tier = 'TIER_1'; // Force TIER_1 if using system credits
  } else if (sysM) {
    tier = 'TIER_1';
  }
  
  // Optimization Strategy:
  // TIER_1: High concurrency, larger batches. Fast.
  // FREE: Low concurrency (sequential), smaller batches. Higher quality/reliability.
  const BATCH_SIZE = tier === 'TIER_1' ? 25 : 15; 
  const CONCURRENCY = tier === 'TIER_1' ? 5 : 2; 
  const MAX_RETRIES = 3;

  if (onStatus) onStatus(`Starting research with ${tier} strategy...`);
  console.log(`Enriching library with ${tier} strategy. Batch Size: ${BATCH_SIZE}, Concurrency: ${CONCURRENCY}`);

  const updateProgress = (count: number) => {
    processedCount += count;
    const progress = Math.round((processedCount / plugins.length) * 100);
    const elapsedTime = Date.now() - startTime;
    const rate = processedCount > 0 ? elapsedTime / processedCount : 0;
    const remainingPlugins = plugins.length - processedCount;
    const estimatedTimeLeft = Math.round((remainingPlugins * rate) / 1000);
    onProgress(progress, estimatedTimeLeft);
    if (onStatus) onStatus(`Analyzed ${processedCount} of ${plugins.length} plugins...`);
  };

  const processBatch = async (batch: VSTPlugin[], retryCount = 0): Promise<VSTPlugin[]> => {
    // 1. Check Server Cache
    let serverCached: Record<string, any> = {};
    try {
      const cacheRes = await fetch('/api/vst-cache/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plugins: batch.map(p => ({ vendor: p.vendor, name: p.name })) })
      });
      if (cacheRes.ok) {
        const data = await cacheRes.json();
        data.cached.forEach((c: any) => {
          serverCached[`${c.vendor}-${c.name}`.toLowerCase()] = c;
        });
      }
    } catch (e) {
      console.error("Failed to check server cache", e);
    }

    // Pre-check for common plugins and server cache to save API calls
    const preMappedBatch = batch.map(p => {
      const cacheKey = `${p.vendor}-${p.name}`.toLowerCase();
      
      // 1. Check Server Cache
      if (serverCached[cacheKey]) {
        return {
          ...p,
          type: serverCached[cacheKey].type,
          description: serverCached[cacheKey].description,
          features: serverCached[cacheKey].features || ["Loaded from cache"],
          parameters: serverCached[cacheKey].parameters || [],
          isPreMapped: true
        };
      }

      // 2. Check Common Mapping
      const lowerName = p.name.toLowerCase();
      const lowerVendor = p.vendor.toLowerCase();
      
      for (const [key, mapping] of Object.entries(COMMON_PLUGIN_MAPPING)) {
        if (lowerName.includes(key) || lowerVendor.includes(key)) {
          return {
            ...p,
            type: mapping.type,
            description: mapping.description,
            features: ["Pre-verified high-quality mapping"],
            isPreMapped: true
          };
        }
      }
      return p;
    });

    const pluginsToResearch = preMappedBatch.filter(p => !(p as any).isPreMapped);
    
    let researchResults: VSTPlugin[] = [];
    if (pluginsToResearch.length > 0) {
      const ai = getAI();
      const pluginList = pluginsToResearch.map((p, i) => `${i + 1}. ${p.vendor} - ${p.name} ${p.version !== 'N/A' ? `(v${p.version})` : ''}`).join('\n');
    
    const prompt = `
      You are a world-class VST plugin expert and audio engineer. 
      I have a list of ${batch.length} audio plugins (VST/AU/AAX).
      
      For EACH plugin in the list below, provide a detailed description, key features, the most accurate category, and an EXHAUSTIVE list of ALL actual technical parameter names found on the plugin's interface (e.g., Threshold, Ratio, Attack, Release, etc.). Be thorough; aim for 20-40+ parameters for professional tools. MATCH THE EXTREME DETAIL LEVEL OF A FULL BEAT RECIPE..
      
      PLUGINS TO ANALYZE:
      ${pluginList}

      CATEGORIZATION RULES:
      - 'Instruments': Synths, Samplers, Drum Machines, Kontakt Libraries, Romplers. (e.g., Serum, Omnisphere, Kontakt, Sylenth1, Nexus)
      - 'Dynamics': Compressors, Limiters, Gates, De-essers, Expanders. (e.g., CLA-76, Pro-C 2, L2 Limiter, OTT)
      - 'Equalizers': EQs, Dynamic EQs, Tone Shapers. (e.g., Pro-Q 3, SSL Channel, PuigTec)
      - 'Reverb & Delay': Reverbs, Delays, Echoes, Spacial Processors. (e.g., ValhallaVintageVerb, EchoBoy, H-Delay)
      - 'Modulation': Chorus, Flanger, Phaser, Tremolo, Vibrato. (e.g., MicroShift, MetaFlanger, Brauer Motion)
      - 'Distortion & Saturation': Overdrive, Fuzz, Bitcrushers, Tape/Tube Emulations, Exciter. (e.g., Decapitator, Saturn 2, Trash 2)
      - 'Utility & Metering': Tuners, Analyzers, Gain Staging, Phase Tools. (e.g., Span, Insight, Metric AB)
      - 'Creative FX': Granular, Glitch, Pitch Shifters (like Little AlterBoy), Multi-FX (like RC-20), or anything that doesn't fit above.

      CRITICAL:
      1. Do NOT categorize everything as 'Creative FX'. This is a sign of failure.
      2. If a plugin is a well-known instrument, it MUST be 'Instruments'.
      3. If a plugin is a well-known compressor, it MUST be 'Dynamics'.
      4. For each plugin, first explain your reasoning for the category choice.
      5. Provide a professional, helpful description for each.
      6. Return the results in the EXACT order of the list provided.
      
      CRITICAL: You MUST generate the descriptions and features in the following language: ${language}.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Use standard Flash for high-volume research
        contents: prompt,
        config: {
          customAction: 'enrich_library',
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plugins: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    reasoning: { type: Type.STRING, description: "Why this category was chosen" },
                    description: { type: Type.STRING },
                    features: { type: Type.ARRAY, items: { type: Type.STRING } },
                    parameters: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exhaustive list of ALL actual technical parameter names found on the plugin's interface (aim for 20-40+)." },
                    category: { type: Type.STRING, enum: ['Instruments', 'Dynamics', 'Equalizers', 'Reverb & Delay', 'Modulation', 'Distortion & Saturation', 'Utility & Metering', 'Creative FX'] }
                  },
                  required: ["reasoning", "description", "features", "category", "parameters"]
                }
              }
            }
          }
        }
      });

      const text = response.text?.trim() || '{"plugins": []}';
      let result;
      try {
        result = JSON.parse(sanitizeJSON(text));
      } catch (e) {
        console.error("Failed to parse AI response as JSON in processBatch", e);
        result = { plugins: [] };
      }
      const researchResults: VSTPlugin[] = [];

      if (result.plugins && Array.isArray(result.plugins)) {
        pluginsToResearch.forEach((plugin, index) => {
          const details = result.plugins[index];
          if (details) {
            const vendorParams = getVendorSpecificParameters(plugin.vendor, plugin.name);
            const rawParams = Array.from(new Set([...(details.parameters || []), ...vendorParams]));
            const combinedParams = rawParams.map(p => normalizeParameterName(plugin.vendor, plugin.name, p));

            const enriched = {
              ...plugin,
              description: details.description || "A professional audio plugin.",
              features: details.features || [],
              parameters: combinedParams,
              type: details.category || "Creative FX"
            };
            researchResults.push(enriched);
          } else {
            researchResults.push({
              ...plugin,
              description: "A professional audio plugin.",
              features: ["Standard processing"],
              type: "Creative FX"
            });
          }
        });
        
        // Save to server cache
        if (researchResults.length > 0) {
          try {
            await fetch('/api/vst-cache/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ plugins: researchResults })
            });
          } catch (e) {
            console.error("Failed to save to server cache", e);
          }
        }
      } else {
        throw new Error("Invalid AI response format");
      }
    } catch (error: any) {
      console.error(`Batch enrichment attempt ${retryCount + 1} failed:`, error);
      
      const errorStr = JSON.stringify(error).toLowerCase();
      const isAuthError = errorStr.includes("401") || errorStr.includes("403") || errorStr.includes("api key not valid");
      
      if (isAuthError) {
        throw error;
      }

      if (retryCount < MAX_RETRIES) {
        // Exponential backoff: 3s, 6s, 12s
        const delay = Math.pow(2, retryCount) * 3000;
        console.log(`Retrying batch in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return processBatch(batch, retryCount + 1);
      }
      
      // Final fallback - mark as failed so we can detect it
      researchResults = pluginsToResearch.map(p => ({
        ...p,
        description: "Could not analyze due to API limits or connection issues.",
        features: ["Standard processing"],
        type: "Creative FX"
      }));
    }
  }

  // Merge pre-mapped and researched results back in order
      let researchIdx = 0;
      const finalBatch = preMappedBatch.map(p => {
        if ((p as any).isPreMapped) {
          const { isPreMapped, ...rest } = p as any;
          
          // Even for cached results, apply latest vendor-specific parameters and normalization
          const vendorParams = getVendorSpecificParameters(rest.vendor, rest.name);
          const rawParams = Array.from(new Set([...(rest.parameters || []), ...vendorParams]));
          rest.parameters = rawParams.map(param => normalizeParameterName(rest.vendor, rest.name, param));
          
          return rest;
        }
        return researchResults[researchIdx++];
      });

      // Save the final merged batch to server cache to ensure it's up to date with new vendor logic
      if (finalBatch.length > 0) {
        try {
          await fetch('/api/vst-cache/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plugins: finalBatch })
          });
        } catch (e) {
          console.error("Failed to update server cache with merged results", e);
        }
      }

    return finalBatch;
  };

  // Chunk the plugins
  const chunks: VSTPlugin[][] = [];
  for (let i = 0; i < plugins.length; i += BATCH_SIZE) {
    chunks.push(plugins.slice(i, i + BATCH_SIZE));
  }

  const enrichedPlugins: VSTPlugin[] = [];
  
  // Process chunks with concurrency
  for (let i = 0; i < chunks.length; i += CONCURRENCY) {
    const activeChunks = chunks.slice(i, i + CONCURRENCY);
    const results = await Promise.all(activeChunks.map(chunk => processBatch(chunk)));
    
    results.forEach(batchResult => {
      enrichedPlugins.push(...batchResult);
      updateProgress(batchResult.length);
    });
    
    // Safety delay to respect rate limits (especially for Free Tier)
    if (tier === 'FREE') {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Final check: if more than 80% of plugins failed to analyze, throw an error
  const failedCount = enrichedPlugins.filter(p => p.description?.includes("Could not analyze")).length;
  if (failedCount > plugins.length * 0.8 && plugins.length > 5) {
    throw new Error("RESEARCH_FAILED: The AI research process failed for most of your plugins. This is usually due to API rate limits. Please try again in a few minutes or use a smaller list.");
  }

  return enrichedPlugins;
};

export const verifyAndCorrectPlugin = async (
  plugin: VSTPlugin, 
  userParameter?: string, 
  userVersion?: string, 
  language: string = 'en'
): Promise<{ success: boolean; plugin: VSTPlugin; message: string }> => {
  const ai = getAI();
  
  const prompt = `
    You are a world-class VST plugin expert. 
    A user is trying to correct or refine the data for the following plugin:
    Vendor: ${plugin.vendor}
    Name: ${plugin.name}
    Current Version/Tier: ${plugin.version} ${plugin.tier ? `(${plugin.tier})` : ''}
    
    USER INPUTS:
    - Suggested Parameter to add/verify: ${userParameter || 'None'}
    - Suggested Version/Tier/Edition: ${userVersion || 'None'}
    
    YOUR TASK:
    1. Verify if the suggested version/tier (e.g., "Standard", "Advanced", "v2.0") is a real, existing edition for this plugin.
    2. If a version/tier was provided, research the EXACT parameters for that specific edition.
    3. Verify if the suggested parameter exists in the plugin (specifically in the suggested version if provided, otherwise in the current version).
    4. If the version/tier is different from the current one, perform a full re-research of the plugin for that specific edition.
    5. CRITICAL: If the user-suggested parameter is INCORRECT or does not exist for this plugin/version, DO NOT include it in the "parameters" list of the "updatedPlugin". Only include verified, real-world parameters.
    
    RESEARCH REQUIREMENTS:
    - Find official manuals or technical documentation to confirm parameters.
    - Be extremely precise. "Advanced" versions often have modules that "Standard" versions lack.
    - If you cannot find evidence for a parameter, assume it is incorrect.
    - If you successfully verify the plugin and its parameters, start your "message" with: "Beatgangsta verified parameter functions were discovered!"
    
    ${getLanguageInstruction(language)}
    
    RESPONSE FORMAT (JSON):
    {
      "isVersionValid": boolean,
      "isParameterValid": boolean,
      "message": "Detailed explanation of your findings (e.g., 'Yes, Ozone 11 Advanced exists and includes the Clarity module. The parameter \"Clarity\" is valid.')",
      "updatedPlugin": {
        "description": "Updated description for this specific version",
        "features": ["Updated features"],
        "parameters": ["Exhaustive list of all actual technical parameters found on the real plugin (30-50+ for complex plugins)"],
        "category": "Instruments|Dynamics|Equalizers|Reverb & Delay|Modulation|Distortion & Saturation|Utility & Metering|Creative FX",
        "version": "The verified version string",
        "tier": "The verified tier/edition string"
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      customAction: 'verify_plugin',
      temperature: 0.1,
      responseMimeType: "application/json",
    }
  });

  try {
    const result = JSON.parse(sanitizeJSON(response.text || '{}'));
    
    if (result.isVersionValid || result.isParameterValid) {
      const enriched = {
        ...plugin,
        ...result.updatedPlugin,
        vendor: plugin.vendor,
        name: plugin.name
      };

      // ONLY save to global server cache if the AI confirmed the data is accurate
      try {
        await fetch('/api/vst-cache/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plugins: [enriched] })
        });
      } catch (e) {
        console.error("Failed to save verified plugin to server cache", e);
      }

      return {
        success: true,
        plugin: enriched,
        message: result.message
      };
    } else {
      return {
        success: false,
        plugin: plugin,
        message: result.message || "The AI could not verify your suggested changes. Please check the version or parameter name."
      };
    }
  } catch (e) {
    console.error("Failed to parse AI response in verifyAndCorrectPlugin", e);
    return { success: false, plugin, message: "Error processing verification." };
  }
};

export const researchPluginParameters = async (plugin: VSTPlugin, language: string = 'en'): Promise<VSTPlugin> => {
  const ai = getAI();
  const prompt = `
    You are a world-class VST plugin expert. 
    The user needs accurate technical parameter names for the following plugin:
    Vendor: ${plugin.vendor}
    Name: ${plugin.name}
    Version: ${plugin.version}

    Your task is to research and provide:
    1. A highly accurate, professional description of the plugin.
    2. A list of its key features.
    3. The most accurate category (Instruments, Dynamics, Equalizers, Reverb & Delay, Modulation, Distortion & Saturation, Utility & Metering, Creative FX).
    4. An EXHAUSTIVE list of ALL actual technical parameter names found on the plugin's interface. Be precise and thorough. For complex plugins, provide all available parameters (30-50+). Do NOT be lazy.

    ${getLanguageInstruction(language)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      customAction: 'research_plugin',
      temperature: 0.1,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          features: { type: Type.ARRAY, items: { type: Type.STRING } },
          parameters: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exhaustive list of all actual technical parameter names found on the interface (typically 20-50)." },
          category: { type: Type.STRING, enum: ['Instruments', 'Dynamics', 'Equalizers', 'Reverb & Delay', 'Modulation', 'Distortion & Saturation', 'Utility & Metering', 'Creative FX'] }
        },
        required: ["description", "features", "category", "parameters"]
      }
    }
  });

  const text = response.text?.trim() || '{}';
  try {
    const details = JSON.parse(sanitizeJSON(text));
    const vendorParams = getVendorSpecificParameters(plugin.vendor, plugin.name);
    const rawParams = Array.from(new Set([...(details.parameters || []), ...vendorParams]));
    const combinedParams = rawParams.map(p => normalizeParameterName(plugin.vendor, plugin.name, p));

    const enriched = {
      ...plugin,
      description: details.description || plugin.description,
      features: details.features || plugin.features,
      parameters: combinedParams,
      type: details.category || plugin.type
    };

    // Save to server cache
    try {
      await fetch('/api/vst-cache/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plugins: [enriched] })
      });
    } catch (e) {
      console.error("Failed to save to server cache", e);
    }

    return enriched;
  } catch (e) {
    console.error("Failed to parse AI response as JSON in researchPluginParameters", e);
    return plugin;
  }
};

export const generateStructuralBlueprint = async (searchQuery: string, language: string = 'en'): Promise<StructuralBlueprint> => {
  const ai = getAI();
  const prompt = `
    Analyze the following search term/genre/artist: "${searchQuery}".
    Extract its "Structural DNA" and create a "Structural Blueprint" JSON object.
    ${getLanguageInstruction(language)}
    The blueprint must define:
    - songMap: Energy levels and duration for Intro, Verse1, Hook, Verse2, Hook2, Bridge (optional), Outro.
    - arrangement: A detailed section-by-section breakdown (Intro, Verse, Hook, etc.) defining duration in bars and active tracks (with mute status and automation notes per track).
    - densityMapping: Note density (0.0 to 1.0) for each section.
    - rhythmicLocking: Kick and Bass patterns for rhythmic unity.
    - melodicHierarchy: Primary, Secondary, and Counter melodies.
    - transitionTriggers: Specific triggers (e.g., 1-bar break, octave jump) for section transitions.
    - microTiming: Swing amount (0.0 to 1.0) and quantization grid (e.g., 1/16, 1/8T).
    - velocityDynamics: Accent pattern (e.g., strong-weak-medium-weak) and dynamic range (0.0 to 1.0).
    - chordVoicing: Inversion type (e.g., root, first, second) and voicing style (e.g., closed, open).
    - repetitionStrategy: Loop length in bars and variation frequency (0.0 to 1.0).
    
    Return ONLY the JSON object.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      customAction: 'structural_blueprint',
      responseMimeType: "application/json",
    }
  });
  
  try {
    return JSON.parse(sanitizeJSON(response.text || '{}'));
  } catch (e) {
    console.error("Failed to parse AI response as JSON in generateStructuralBlueprint", e);
    return {} as StructuralBlueprint;
  }
};

export const getBeatRecommendations = async (plugins: VSTPlugin[], analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, language: string = 'en'): Promise<RecommendationResponse> => {
  const ai = getAI();
  const pluginListStr = plugins.map(p => {
    let str = `${p.vendor} - ${p.name} (${p.type})`;
    if (p.parameters && p.parameters.length > 0) {
      str += ` [Parameters: ${p.parameters.join(', ')}]`;
    }
    return str;
  }).join('\n');
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `\nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You MUST prioritize using these plugins in your recipes whenever possible:\n${starredPlugins.join(', ')}` : '';
  
  const hasSphereMic = analogHardware.some(h => ['Sphere DLX', 'Sphere LX', 'L22'].includes(h.name) || h.name.toLowerCase() === 'l22' || h.name.toLowerCase().includes('townsend'));
  const sphereMicStr = hasSphereMic ? `\nCRITICAL: The user owns a Universal Audio Sphere (DLX/LX) or Townsend Labs L22 microphone. If the recipe involves a vocal tracking chain, you MUST assign the 'UAD Sphere Mic Collection', 'Ocean Way Mic Collection', or 'Bill Putnam Mic Collection' plugin as the VERY FIRST insert plugin on the vocal channel tracking chain. You MUST specifically select a mic model inside it based on the vibe searched. After the mic collection plugin, you can add up to 3 more plugins.` : '';

  const languageInstruction = getLanguageInstruction(language);

  const prompt = isGangstaVox ? `
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Vocal FX Chain Recipe" for the craziest vocal mix.
    Only use plugins from this list.
    CRITICAL: For each plugin, I have provided a list of its actual technical parameters in brackets []. You MUST prioritize using these EXACT parameter names in your 'deepDive' settings. If a parameter is missing, verify its exact existence in the plugin's real-world manual before including it. NEVER hallucinate or invent parameters that do not exist on the plugin's interface.
    
    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${languageInstruction}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${NI_RAUM_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}

    Focus on modern vocal sub-genres: Melodic Trap, Dark Drill, High-Energy Rage, Ethereal Cloud Rap.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific vocal chain (e.g., "Travis Scott type", "Playboi Carti type").
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.
    
    You MUST provide the 'gangstaVox' object in your response.
    - trackingChain: Include the unisonPlugin (if applicable) and up to 4 inserts. Provide a deep dive for each (Provide EVERY available parameter found on the actual plugin interface. Aim for 20-40 settings for complex plugins).
    - vocalTracks: Provide multiple vocal layers (Lead, Adlibs, Doubles, etc.). For each, describe the sourceSoundGoal, which bus to send to (busSend), and the fxPlugins (with deep dives - Provide EVERY available parameter found on the actual plugin interface. Aim for 20-40 settings for complex plugins).
    - layeringStrategy: Explain how all these vocal layers should sit together in the mix.

    You MUST also provide the 'busses' array. Create busses (e.g., "Vocal Reverb Bus", "Delay Bus") and list which vocal tracks are using them, along with the fxPlugins on the bus and their deep dives (Provide EVERY available parameter found on the actual plugin interface. Aim for 20-40 settings for complex plugins).
    
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (Provide EVERY available parameter found on the actual plugin interface. Aim for 20-40 settings for complex plugins).
    You MUST provide 'drumPatterns' and 'arrangement' as context for the beat.

    CRITICAL DRUM PATTERN RULES:
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    
    ${ADVANCED_MIDI_PROMPT}
  ` : `
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Beat Recipe" for the craziest rap beat.
    Only use plugins from this list.
    CRITICAL: For each plugin, I have provided a list of its actual technical parameters in brackets []. You MUST prioritize using these EXACT parameter names in your 'deepDive' settings. If a parameter is missing, verify its exact existence in the plugin's real-world manual before including it. NEVER hallucinate or invent parameters that do not exist on the plugin's interface.

    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${languageInstruction}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}

    Focus on modern sub-genres: Melodic Trap, Dark Drill, High-Energy Rage.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific beat type (e.g., "Lil Wayne type", "Travis Scott type").
    Include a recommended BPM, 'recommendedScale', and 'chordProgression'.
    
    You MUST provide the 'instruments' array with AT LEAST 3 DISTINCT "REAL" instruments (e.g., synths, pianos, guitars, strings). 
    CRITICAL: 808s and Basslines MUST be included in the 'instruments' array with a detailed 'midiNotes' pattern. DO NOT put 808s in 'drumPatterns'.
    CRITICAL: DO NOT use vocals as a main instrument in the 'instruments' array. Vocals MUST be separate.
    For each instrument:
    - Provide the exact plugin name to use in the 'plugin' field.
    - Provide a deep dive on the instrument itself (e.g., oscillator settings, macro tweaks, filter envelopes). Provide EVERY available parameter found on the actual plugin interface (aim for 25-40). Be exhaustive and do NOT be lazy.
    - Provide an array of fxPlugins (up to 8) with a deep dive for EACH plugin. Provide EVERY available parameter found on the actual plugin interface (aim for 20-40). Be exhaustive and do NOT be lazy.
    CRITICAL: If the user has connected pedals or amps to an instrument (as listed in their analog hardware), you MUST include those specific pedals and amps in the fxPlugins array for that instrument and provide real, detailed parameter settings for them to achieve the desired sound.
    - ADVANCED ROUTING (OPTIONAL): If a plugin should be processed in parallel or on a specific frequency band (Multiband Split), use the 'routing' (e.g., "Parallel A (Crush)", "Parallel B (Space)") or 'band' (e.g., "Lows (0-150Hz)", "Highs (2kHz+)") properties in the fxPlugin object.
    - Specify which bus to send to (busSend).
    - Provide a detailed MIDI pattern for this instrument in the 'midiNotes' array, tailored specifically to the tempo (BPM) and style of this beat. If the user searched for a specific song or uploaded an MP3, the MIDI pattern MUST closely match the iconic melodies, chords, and rhythms of that original song. Use synth-based sounds for all instruments, characteristic of modern rap production.
      Each note in the array MUST have:
      - pitch: (e.g., 'C4')
      - duration: (e.g., '4', '8', '16')
      - wait: (e.g., '0', '4', '8')
      - velocity: (number between 0 and 127)
    
    If vocals are used in the beat (e.g., vocal chops, atmospheric textures), you MUST provide the 'vocalElements' object (same structure as gangstaVox) to describe them. This is the ONLY place vocal elements should be described. Ensure every plugin in the vocalElements chain has an EXHAUSTIVE list of all parameters (typically 20-50 settings).
    
    You MUST provide the 'busses' array. Create busses (e.g., "Drum Bus", "Melody Bus") and list which instrument tracks are using them, along with the fxPlugins on the bus and their deep dives (EVERY available parameter per plugin, aim for 20-40+).
    
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (EVERY available parameter per plugin, aim for 20-40+).
    You MUST provide 'drumPatterns' and 'arrangement'.

    CRITICAL DRUM PATTERN RULES:
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    
    ${ADVANCED_MIDI_PROMPT}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      customAction: 'recipe',
      responseMimeType: "application/json",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
      ],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: getUnifiedRecipeSchema()
          }
        },
        required: ["recipes"]
      }
    }
  });

  const jsonStr = response.text?.trim() || '{"recipes": []}';
  try {
    let result = postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
    if (Array.isArray(result)) result = { recipes: result };
    
    if (isGangstaVox && result.recipes) {
      result.recipes = result.recipes.map((r: any) => ({ ...r, isGangstaVox: true }));
    }
    
    return result;
  } catch (e) {
    console.error("Failed to parse AI response as JSON in getBeatRecommendations", e);
    console.log("Raw response text:", jsonStr);
    throw new Error("The architect's response was not in the correct format. Please try again!");
  }
};

export const getCustomBeatRecommendations = async (plugins: VSTPlugin[], query: string, analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, language: string = 'en'): Promise<RecommendationResponse> => {
  const ai = getAI();
  const pluginListStr = plugins.map(p => {
    let str = `${p.vendor} - ${p.name} (${p.type})`;
    if (p.parameters && p.parameters.length > 0) {
      str += ` [Parameters: ${p.parameters.join(', ')}]`;
    }
    return str;
  }).join('\n');
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `\nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You MUST prioritize using these plugins in your recipes whenever possible:\n${starredPlugins.join(', ')}` : '';

  const hasSphereMic = analogHardware.some(h => ['Sphere DLX', 'Sphere LX', 'L22'].includes(h.name) || h.name.toLowerCase() === 'l22' || h.name.toLowerCase().includes('townsend'));
  const sphereMicStr = hasSphereMic ? `\nCRITICAL: The user owns a Universal Audio Sphere (DLX/LX) or Townsend Labs L22 microphone. If the recipe involves a vocal tracking chain, you MUST assign the 'UAD Sphere Mic Collection', 'Ocean Way Mic Collection', or 'Bill Putnam Mic Collection' plugin as the VERY FIRST insert plugin on the vocal channel tracking chain. You MUST specifically select a mic model inside it based on the vibe searched. After the mic collection plugin, you can add up to 3 more plugins.` : '';

  const isMarkRuhedra = query.toLowerCase().includes("mark ruhedra");
  const ruhedraStyle = isMarkRuhedra ? `
    CRITICAL STYLE GUIDE: The user is searching for the "Mark Ruhedra" vibe.
    You MUST emulate his signature production style:
    - Signature Sound: Polished, modern, hard-hitting trap/rap with crisp, clear vocals and wide, atmospheric melodies.
    - Key Plugin Chain: Prioritize using his favorite plugins:
      - Dynamics/Compression: Waves Silk Vocal, Waves H-Comp, IK Multimedia T-RackS 6 (VComp, Bus Compressor).
      - Saturation/Color: Waves Magma Lil Tube, Arturia Tape MELLO-FI, BABY Audio Beat Slammer.
      - EQ: Waves VEQ4, IK T-RackS 6 (EQ-81, EQ-73).
      - Vocal Polish: iZotope Nectar 3 Elements, iZotope Ozone 9 Elements.
      - Creative FX: Soundtoys PhaseMistress, Little PrimalTap, BABY Audio Warp.
    - Mixing Techniques: Use parallel compression, heavy saturation on drums and bass, and precise subtractive EQ on vocals to keep them crisp.
  ` : '';

  const prompt = isGangstaVox ? `
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Vocal FX Chain Recipe" specifically for a "${query} type vocal".
    Only use plugins from this list.
    CRITICAL: For each plugin, I have provided a list of its actual technical parameters in brackets []. You MUST prioritize using these EXACT parameter names in your 'deepDive' settings. If a parameter is missing, verify its exact existence in the plugin's real-world manual before including it. NEVER hallucinate or invent parameters that do not exist on the plugin's interface.

    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${ruhedraStyle}
    ${getLanguageInstruction(language)}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}

    Ensure the recipe captures the signature vocal sound, effects, and mixing techniques associated with ${query}.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific vocal chain.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.

    You MUST provide the 'gangstaVox' object in your response.
    - trackingChain: Include the unisonPlugin (if applicable) and up to 4 inserts. Provide a deep dive for each (Provide EVERY available parameter found on the actual plugin interface. Aim for 20-40 settings for complex plugins).
    - vocalTracks: Provide multiple vocal layers (Lead, Adlibs, Doubles, etc.). For each, describe the sourceSoundGoal, which bus to send to (busSend), and the fxPlugins (with deep dives - Provide EVERY available parameter found on the actual plugin interface. Aim for 20-40 settings for complex plugins).
    - layeringStrategy: Explain how all these vocal layers should sit together in the mix.

    You MUST also provide the 'busses' array. Create busses (e.g., "Vocal Reverb Bus", "Delay Bus") and list which vocal tracks are using them, along with the fxPlugins on the bus and their deep dives (Provide EVERY available parameter found on the actual plugin interface. Aim for 20-40 settings for complex plugins).
    
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (Provide EVERY available parameter found on the actual plugin interface. Aim for 20-40 settings for complex plugins).
    You MUST provide 'drumPatterns' and 'arrangement' as context for the beat.

    CRITICAL DRUM PATTERN RULES:
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    
    ${ADVANCED_MIDI_PROMPT}
  ` : `
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Beat Recipe" specifically for a "${query} type beat".
    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${getLanguageInstruction(language)}

    Ensure the recipe captures the signature sound, bounce, and atmospheric elements associated with ${query}.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific beat type.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.

    You MUST provide the 'instruments' array with AT LEAST 3 DISTINCT "REAL" instruments (e.g., synths, pianos, guitars, strings). 
    CRITICAL: 808s and Basslines MUST be included in the 'instruments' array with a detailed 'midiNotes' pattern. DO NOT put 808s in 'drumPatterns'.
    CRITICAL: DO NOT use vocals as a main instrument in the 'instruments' array. Vocals MUST be separate.
    For each instrument:
    - Provide the exact plugin name to use in the 'plugin' field.
    - Provide a deep dive on the instrument itself (e.g., oscillator settings, macro tweaks, filter envelopes). Provide EVERY available parameter found on the actual plugin interface (aim for 25-40). Be exhaustive and do NOT be lazy.
    - Provide an array of fxPlugins (up to 10) with a deep dive for EACH plugin. Provide EVERY available parameter found on the actual plugin interface (aim for 20-40). Be exhaustive and do NOT be lazy.
    CRITICAL: If the user has connected pedals or amps to an instrument (as listed in their analog hardware), you MUST include those specific pedals and amps in the fxPlugins array for that instrument and provide real, detailed parameter settings for them to achieve the desired sound.
    - ADVANCED ROUTING (OPTIONAL): If a plugin should be processed in parallel or on a specific frequency band (Multiband Split), use the 'routing' (e.g., "Parallel A (Crush)", "Parallel B (Space)") or 'band' (e.g., "Lows (0-150Hz)", "Highs (2kHz+)") properties in the fxPlugin object.
    - Specify which bus to send to (busSend).
    - Provide a detailed MIDI pattern for this instrument in the 'midiNotes' array, tailored specifically to the tempo (BPM) and style of this beat. If the user searched for a specific song or uploaded an MP3, the MIDI pattern MUST closely match the iconic melodies, chords, and rhythms of that original song. Use synth-based sounds for all instruments, characteristic of modern rap production.
      Each note in the array MUST have:
      - pitch: (e.g., 'C4')
      - duration: (e.g., '4', '8', '16')
      - wait: (e.g., '0', '4', '8')
      - velocity: (number between 0 and 127)
    
    If vocals are used in the beat (e.g., vocal chops, atmospheric textures), you MUST provide the 'vocalElements' object (same structure as gangstaVox) to describe them. This is the ONLY place vocal elements should be described. Ensure every plugin in the vocalElements chain has AT LEAST 10 parameters in its deepDive (and up to 30 if it is a complex channel strip plugin).
    
    You MUST provide the 'busses' array. Create busses (e.g., "Drum Bus", "Melody Bus") and list which instrument tracks are using them, along with the fxPlugins on the bus and their deep dives (AT LEAST 10 parameters per plugin, and up to 30 if it is a complex channel strip plugin).
    
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (AT LEAST 10 parameters per plugin, and up to 30 if it is a complex channel strip plugin).
    You MUST provide 'drumPatterns' and 'arrangement'.

    CRITICAL DRUM PATTERN RULES:
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    
    ${ADVANCED_MIDI_PROMPT}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      customAction: 'type_beat_search',
      responseMimeType: "application/json",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
      ],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: getUnifiedRecipeSchema()
          }
        },
        required: ["recipes"]
      }
    }
  });

  const jsonStr = response.text?.trim() || '{"recipes": []}';
  console.log("Gemini response text (Custom Beat Recommendations):", jsonStr);
  let result;
  try {
    result = postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
    if (Array.isArray(result)) result = { recipes: result };
  } catch (e) {
    console.error("Failed to parse AI response as JSON in getCustomBeatRecommendations", e);
    throw new Error("The architect's response was not in the correct format. Please try again!");
  }
  
  if (isGangstaVox && result.recipes) {
    result.recipes = result.recipes.map((r: any) => ({ ...r, isGangstaVox: true }));
  }
  
  return result;
};

export const getSongBeatRecommendations = async (plugins: VSTPlugin[], songQuery: string, analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, language: string = 'en'): Promise<RecommendationResponse> => {
  const blueprint = await generateStructuralBlueprint(songQuery, language);
  const ai = getAI();
  const pluginListStr = plugins.map(p => {
    let str = `${p.vendor} - ${p.name} (${p.type})`;
    if (p.parameters && p.parameters.length > 0) {
      str += ` [Parameters: ${p.parameters.join(', ')}]`;
    }
    return str;
  }).join('\n');
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `\nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You MUST prioritize using these plugins in your recipes whenever possible:\n${starredPlugins.join(', ')}` : '';

  const hasSphereMic = analogHardware.some(h => ['Sphere DLX', 'Sphere LX', 'L22'].includes(h.name) || h.name.toLowerCase() === 'l22' || h.name.toLowerCase().includes('townsend'));
  const sphereMicStr = hasSphereMic ? `\nCRITICAL: The user owns a Universal Audio Sphere (DLX/LX) or Townsend Labs L22 microphone. If the recipe involves a vocal tracking chain, you MUST assign the 'UAD Sphere Mic Collection', 'Ocean Way Mic Collection', or 'Bill Putnam Mic Collection' plugin as the VERY FIRST insert plugin on the vocal channel tracking chain. You MUST specifically select a mic model inside it based on the vibe searched. After the mic collection plugin, you can add up to 3 more plugins.` : '';

  const prompt = isGangstaVox ? `
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Vocal FX Chain Recipe" that recreate the vocal production style, effects, and mixing techniques of the song "${songQuery}".
    Only use plugins from this list.
    CRITICAL: For each plugin, I have provided a list of its actual technical parameters in brackets []. You MUST prioritize using these EXACT parameter names in your 'deepDive' settings. If a parameter is missing, verify its exact existence in the plugin's real-world manual before including it. NEVER hallucinate or invent parameters that do not exist on the plugin's interface.

    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${getLanguageInstruction(language)}
    ${GULLFOSS_SPEC_PROMPT}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}

    Ensure the recipe captures the signature vocal sound of that specific song.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific vocal chain.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.

    You MUST provide the 'gangstaVox' object in your response.
    - trackingChain: Include the unisonPlugin (if applicable) and up to 4 inserts. Provide a deep dive for each (EXHAUSTIVE list of all parameters, typically 25-50 settings).
    - vocalTracks: Provide multiple vocal layers (Lead, Adlibs, Doubles, etc.). For each, describe the sourceSoundGoal, which bus to send to (busSend), and the fxPlugins (with deep dives - EXHAUSTIVE list of all parameters, typically 25-50 settings).
    - layeringStrategy: Explain how all these vocal layers should sit together in the mix.

    You MUST also provide the 'busses' array. Create busses (e.g., "Vocal Reverb Bus", "Delay Bus") and list which vocal tracks are using them, along with the fxPlugins on the bus and their deep dives (EXHAUSTIVE list of all parameters, typically 25-50 settings).
    
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (EXHAUSTIVE list of all parameters, typically 25-50 settings).
    You MUST provide 'drumPatterns' and 'arrangement' as context for the beat.

    CRITICAL DRUM PATTERN RULES:
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    
    ${ADVANCED_MIDI_PROMPT}
  ` : `
    Analyze my VST plugin list and suggest 1 high-level, extremely detailed "Beat Recipe" that recreate the production style, bounce, and sonic atmosphere of the song "${songQuery}".
    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${getLanguageInstruction(language)}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}

    FOLLOW THIS STRUCTURAL BLUEPRINT:
    ${JSON.stringify(blueprint)}

    Ensure the recipe captures the signature sound, instrumentation, and mixing techniques of that specific song, while strictly adhering to the structural blueprint provided above.
    CRITICAL: You MUST use the blueprint's microTiming, velocityDynamics, chordVoicing, and repetitionStrategy to generate the MIDI notes and drum patterns. This is essential for achieving an iconic, authentic, high-energy, and highly realistic MIDI quality that perfectly encapsulates the requested tracking.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific beat type.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.

    You MUST provide the 'instruments' array with AT LEAST 3 DISTINCT "REAL" instruments (e.g., synths, pianos, guitars, strings). 
    CRITICAL: 808s and Basslines MUST be included in the 'instruments' array with a detailed 'midiNotes' pattern. DO NOT put 808s in 'drumPatterns'.
    CRITICAL: DO NOT use vocals as a main instrument in the 'instruments' array. Vocals MUST be separate.
    For each instrument:
    - Provide the exact plugin name to use in the 'plugin' field.
    - Provide a deep dive on the instrument itself (e.g., oscillator settings, macro tweaks, filter envelopes). Provide EVERY available parameter found on the actual plugin interface (aim for 25-50). Be exhaustive and do NOT be lazy.
    - Provide an array of fxPlugins (up to 10) with a deep dive for EACH plugin. Provide EVERY available parameter found on the actual plugin interface (aim for 25-50). Be exhaustive and do NOT be lazy.
    CRITICAL: If the user has connected pedals or amps to an instrument (as listed in their analog hardware), you MUST include those specific pedals and amps in the fxPlugins array for that instrument and provide real, detailed parameter settings for them to achieve the desired sound.
    - ADVANCED ROUTING (OPTIONAL): If a plugin should be processed in parallel or on a specific frequency band (Multiband Split), use the 'routing' (e.g., "Parallel A (Crush)", "Parallel B (Space)") or 'band' (e.g., "Lows (0-150Hz)", "Highs (2kHz+)") properties in the fxPlugin object.
    - Specify which bus to send to (busSend).
    - Provide a detailed MIDI pattern for this instrument in the 'midiNotes' array, tailored specifically to the tempo (BPM) and style of this beat. If the user searched for a specific song or uploaded an MP3, the MIDI pattern MUST closely match the iconic melodies, chords, and rhythms of that original song. Use synth-based sounds for all instruments, characteristic of modern rap production.
      Each note in the array MUST have:
      - pitch: (e.g., 'C4')
      - duration: (e.g., '4', '8', '16')
      - wait: (e.g., '0', '4', '8')
      - velocity: (number between 0 and 127)
    
    If vocals are used in the beat (e.g., vocal chops, atmospheric textures), you MUST provide the 'vocalElements' object (same structure as gangstaVox) to describe them. This is the ONLY place vocal elements should be described. Ensure every plugin in the vocalElements chain has an EXHAUSTIVE list of all parameters (typically 25-50 settings).
    
    You MUST provide the 'busses' array. Create busses (e.g., "Drum Bus", "Melody Bus") and list which instrument tracks are using them, along with the fxPlugins on the bus and their deep dives (EVERY available parameter per plugin, aim for 20-50+).
    
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (EVERY available parameter per plugin, aim for 20-50+).
    You MUST provide 'drumPatterns' and 'arrangement'.

    CRITICAL DRUM PATTERN RULES:
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    
    ${ADVANCED_MIDI_PROMPT}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      customAction: 'song_search',
      responseMimeType: "application/json",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
      ],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: getUnifiedRecipeSchema()
          }
        },
        required: ["recipes"]
      }
    }
  });

  const jsonStr = response.text?.trim() || '{"recipes": []}';
  console.log("Gemini response text (Song Beat Recommendations):", jsonStr);
  let result;
  try {
    result = postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
    if (Array.isArray(result)) result = { recipes: result };
  } catch (e) {
    console.error("Failed to parse AI response as JSON in getSongBeatRecommendations", e);
    throw new Error("The architect's response was not in the correct format. Please try again!");
  }
  
  if (isGangstaVox && result.recipes) {
    result.recipes = result.recipes.map((r: any) => ({ ...r, isGangstaVox: true }));
  }
  
  return result;
};

export const generateVoiceover = async (text: string, bpm?: number | null): Promise<{ base64: string, mimeType: string }> => {
  const ai = getAI();
  const tempoInstructions = bpm ? `The instrumental beat is exactly ${bpm} BPM. You MUST time your syllables and rhythmic flow to land perfectly on tempo to this ${bpm} BPM beat at a NORMAL, standard playback speed.` : "Provide a natural Houston style cadence at a normal tempo.";
  const prompt = `Say this text in a natural, smooth, melodic Houston rap cadence at a NORMAL TEMPO (like a professional studio recording by Z-Ro, but DO NOT say your name or mention Z-Ro). DO NOT slow it down, DO NOT chop and screw it. Keep it clear and at standard speed. \n${tempoInstructions}\n\n${text}`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-tts-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      customAction: 'generate_voiceover',
      responseModalities: ["AUDIO"],
      speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/wav';
  if (!base64Audio) {
    throw new Error('Failed to generate voiceover');
  }
  return { base64: base64Audio, mimeType };
};

export const analyzeInstrumental = async (audioBase64: string, mimeType: string): Promise<{ bpm: number, loopStart: number }> => {
  const ai = getAI();
  const prompt = "Analyze this instrumental track. Identify its exact BPM (Tempo) and the exact start time (in seconds) of the clearest, most loopable 4-bar or 8-bar section. Output a JSON object with two fields: 'bpm' (a number, the tempo) and 'loopStart' (a number, the start time in seconds). Do not include any other text.";
  const data = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [{ parts: [{ text: prompt }, { inlineData: { data: audioBase64, mimeType } }] }],
    config: {
      customAction: 'analyze_instrumental',
    }
  });
  
  // The proxy returns raw JSON, so we extract text from candidates
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Could not analyze instrumental: No text in response.");
  
  const jsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const result = JSON.parse(sanitizeJSON(jsonStr));
  return { bpm: result.bpm || 85, loopStart: result.loopStart || 0 };
};

export const generateContentViaBackend = async (model: string, prompt: string, config: any, _turnstileToken?: string | null, _sessionId?: string | null) => {
  const ai = getAI();
  return await ai.models.generateContent({
    model,
    contents: prompt,
    config
  });
};

export const getAudioBeatRecommendations = async (plugins: VSTPlugin[], audioBase64: string | null, audioUrl: string | null, mimeType: string, analogInstruments: Hardware[] = [], analogHardware: Hardware[] = [], drumKits: Hardware[] = [], excludeAnalog: boolean = false, dawType: string | null = null, starredPlugins: string[] = [], isGangstaVox: boolean = false, userContext: string = "", geminiFileUri: string | null = null, language: string = 'en'): Promise<RecommendationResponse> => {
  const ai = getAI();
  
  // Limit plugin list to 50 most relevant to avoid context/complexity limits
  const limitedPlugins = plugins.slice(0, 50);
  const pluginListStr = limitedPlugins.map(p => `${p.vendor} - ${p.name} (${p.type})`).join('\n');
  
  const analogStr = !excludeAnalog ? generateAnalogStr(analogInstruments, analogHardware, drumKits) : '';
  const dawStr = dawType ? `\nThe user is using ${dawType} as their DAW. Include specific instructions or tips for ${dawType} where relevant in the guides or recipes.` : '';
  const starredStr = starredPlugins.length > 0 ? `\nCRITICAL: The user has STARRED (favorited) the following plugins. You MUST prioritize using these plugins in your recipes whenever possible:\n${starredPlugins.join(', ')}` : '';

  const hasSphereMic = analogHardware.some(h => ['Sphere DLX', 'Sphere LX', 'L22'].includes(h.name) || h.name.toLowerCase() === 'l22' || h.name.toLowerCase().includes('townsend'));
  const sphereMicStr = hasSphereMic ? `\nCRITICAL: The user owns a Universal Audio Sphere (DLX/LX) or Townsend Labs L22 microphone. If the recipe involves a vocal tracking chain, you MUST assign the 'UAD Sphere Mic Collection', 'Ocean Way Mic Collection', or 'Bill Putnam Mic Collection' plugin as the VERY FIRST insert plugin on the vocal channel tracking chain. You MUST specifically select a mic model inside it based on the vibe searched. After the mic collection plugin, you can add up to 3 more plugins.` : '';

  const contextStr = userContext ? `\nCRITICAL USER CONTEXT: The user has provided the following information about their track and goals. You MUST incorporate this into your analysis and advice:\n"${userContext}"\n` : "";

  const uadPlugins = plugins.filter(p => 
    (p.vendor.toLowerCase().includes('universal audio') || p.name.toLowerCase().includes('uad')) && 
    !p.name.toLowerCase().includes('native') && 
    !p.name.toLowerCase().includes('uadx')
  );
  const uadPluginListStr = uadPlugins.length > 0 
    ? uadPlugins.map(p => `${p.vendor} - ${p.name} (${p.type})`).join('\n')
    : 'Universal Audio plugins defaults (e.g. 1176, LA-2A, Pultec EQP-1A, Neve 1073, Townsend Sphere, Ocean Way, etc.)';

  const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo'));
  const apolloModel = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';
  const hasTownsend = analogHardware.some(h => h.name.toLowerCase().includes('townsend') || h.name.toLowerCase().includes('sphere'));
  const hasOceanWayMic = plugins?.some(p => p.name.toLowerCase().includes('ocean way mic')) || false;

  let prompt = isGangstaVox ? `
    Analyze the attached audio file and suggest 1 high-level, extremely detailed "Vocal FX Chain Recipe" that recreate the vocal production style, effects, and mixing techniques heard in the provided audio.
    Only use mixing plugins from this list (for DAW processing):
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${contextStr}
    ${getLanguageInstruction(language)}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${audioUrl ? `The main audio file is available at this URL: ${audioUrl}. Please fetch and analyze it.` : "The main audio file is provided as inline data."}

    Ensure the recipe captures the signature vocal sound of the audio.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific vocal chain.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.

    You MUST provide the 'gangstaVox' object in your response.
    
    ${hasApollo ? `
    CRITICAL: The user owns a Universal Audio Apollo interface (${apolloModel}).
    You MUST include a 'trackingChain' specifically for this Apollo, mirroring the UAD Console workflow.
    
    MANDATORY UAD CONSOLE TRACKING CHAIN REQUIREMENTS:
    1. UNISON SLOT: A Unison plugin (e.g., Neve, API, Manley, SSL) is MANDATORY.
    2. INSERTS: You MUST provide EXACTLY 4 plugins in the inserts array. The 4 slots MUST BE FILLED.
       ${hasTownsend || hasOceanWayMic ? "The FIRST insert (Plugin 1 of 4) MUST ALWAYS be 'Ocean Way Mic Collection' (or 'Sphere Mic Collection' / 'Bill Putnam Mic Collection' if applicable)." : "The FIRST insert SHOULD ALWAYS be 'Ocean Way Mic Collection' (or similar mic emulation if they have it)."}
    3. AUX CHANNELS: Both 'aux1' and 'aux2' are MANDATORY. You MUST provide UAD plugins in both to track with 2 aux fx channels.
    4. ACCURACY: DO NOT BE LAZY. You MUST provide EVERY SINGLE available setting found on the actual plugin GUI for each UAD plugin (aim for 30-50+ exact parameter settings per plugin, capture every knob, switch, and fader).

    FOR THE UAD CONSOLE TRACKING CHAIN, YOU MUST STRICTLY ONLY USE THESE UAD-2 DSP PLUGINS:
    ${uadPluginListStr}
    ` : ''}

    - trackingChain: Include the unisonPlugin, EXACTLY 4 inserts, aux1, and aux2.
    - Provide a deep dive for each tracking plugin (EXHAUSTIVE list of EVERY parameter, typically 30-50+ settings. DO NOT BE LAZY).
    - Provide dawRoutingInstructions and dspUsageNote for the tracking chain.
    - vocalTracks: Provide multiple vocal layers (Lead, Adlibs, Doubles, etc.). For each, describe the sourceSoundGoal, which bus to send to (busSend), and the fxPlugins (with deep dives - EXHAUSTIVE list of all parameters, typically 25-50 settings).
    - layeringStrategy: Explain how all these vocal layers should sit together in the mix.

    You MUST also provide the 'busses' array. Create busses (e.g., "Vocal Reverb Bus", "Delay Bus") and list which vocal tracks are using them, along with the fxPlugins on the bus and their deep dives (EXHAUSTIVE list of all parameters, typically 25-50 settings).
    
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (EXHAUSTIVE list of all parameters, typically 25-50 settings).
    You MUST provide 'drumPatterns' and 'arrangement' as context for the beat.

    CRITICAL DRUM PATTERN RULES:
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    
    ${ADVANCED_MIDI_PROMPT}
  ` : `
    Analyze the attached audio file and suggest 1 high-level, extremely detailed "Beat Recipe"
 that recreate the production style, bounce, and sonic atmosphere of the provided audio.
    Only use plugins from this list:
    ${pluginListStr}
    ${analogStr}
    ${dawStr}
    ${starredStr}
    ${sphereMicStr}
    ${getLanguageInstruction(language)}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${audioUrl ? `The main audio file is available at this URL: ${audioUrl}. Please fetch and analyze it.` : "The main audio file is provided as inline data."}

    Ensure the recipe captures the signature sound, instrumentation, and mixing techniques heard in the audio.
    Identify 2-3 mainstream or commonly known artists who would typically use this specific beat type.
    Include a recommended BPM, 'recommendedScale', and 'chordProgression' that fits the vibe.

    You MUST provide the 'instruments' array with AT LEAST 3 DISTINCT "REAL" instruments (e.g., synths, pianos, guitars, strings). 
    CRITICAL: 808s and Basslines MUST be included in the 'instruments' array with a detailed 'midiNotes' pattern. DO NOT put 808s in 'drumPatterns'.
    CRITICAL: DO NOT use vocals as a main instrument in the 'instruments' array. Vocals MUST be separate.
    For each instrument:
    - Provide the exact plugin name to use in the 'plugin' field.
    - Provide a deep dive on the instrument itself (e.g., oscillator settings, macro tweaks, filter envelopes). Provide EVERY available parameter found on the actual plugin interface (aim for 25-50). Be exhaustive and do NOT be lazy.
    - Provide an array of fxPlugins (up to 10) with a deep dive for EACH plugin. Provide EVERY available parameter found on the actual plugin interface (aim for 25-50). Be exhaustive and do NOT be lazy.
    CRITICAL: If the user has connected pedals or amps to an instrument (as listed in their analog hardware), you MUST include those specific pedals and amps in the fxPlugins array for that instrument and provide real, detailed parameter settings for them to achieve the desired sound.
    - ADVANCED ROUTING (OPTIONAL): If a plugin should be processed in parallel or on a specific frequency band (Multiband Split), use the 'routing' (e.g., "Parallel A (Crush)", "Parallel B (Space)") or 'band' (e.g., "Lows (0-150Hz)", "Highs (2kHz+)") properties in the fxPlugin object.
    - Specify which bus to send to (busSend).
    - Provide a detailed MIDI pattern for this instrument in the 'midiNotes' array, tailored specifically to the tempo (BPM) and style of this beat. If the user searched for a specific song or uploaded an MP3, the MIDI pattern MUST closely match the iconic melodies, chords, and rhythms of that original song. Use synth-based sounds for all instruments, characteristic of modern rap production.
      Each note in the array MUST have:
      - pitch: (e.g., 'C4')
      - duration: (e.g., '4', '8', '16')
      - wait: (e.g., '0', '4', '8')
      - velocity: (number between 0 and 127)
    
    If vocals are used in the beat (e.g., vocal chops, atmospheric textures), you MUST provide the 'vocalElements' object (same structure as gangstaVox) to describe them. This is the ONLY place vocal elements should be described. Ensure every plugin in the vocalElements chain has an EXHAUSTIVE list of all parameters (typically 25-50 settings).
    ${hasApollo ? `
    CRITICAL: For the vocalElements 'trackingChain', since the user owns a Universal Audio Apollo interface (${apolloModel}), you MUST include a 'trackingChain' specifically for this Apollo, mirroring the UAD Console workflow.
    FOR THE UAD CONSOLE TRACKING CHAIN in 'vocalElements', YOU MUST STRICTLY ONLY USE THESE UAD-2 DSP PLUGINS:
    ${uadPluginListStr}

    MANDATORY UAD CONSOLE TRACKING CHAIN REQUIREMENTS:
    1. UNISON SLOT: A Unison plugin is MANDATORY.
    2. INSERTS: You MUST provide EXACTLY 4 plugins in the inserts array. The FIRST insert (Plugin 1 of 4) MUST ALWAYS be "Ocean Way Mic Collection" (or equivalent mic modeled plugin).
    3. AUX CHANNELS: Both 'aux1' and 'aux2' are MANDATORY.
    4. ACCURACY: Provide EVERY available setting (30-50+ parameters per plugin). NO LAZY OUTPUTS. DO NOT SKIP KNOBS.
    ` : ''}
    
    You MUST provide the 'busses' array. Create busses (e.g., "Drum Bus", "Melody Bus") and list which instrument tracks are using them, along with the fxPlugins on the bus and their deep dives (EVERY available parameter per plugin, aim for 20-50+).
    
    You MUST provide the 'masterPlugins' array with deep dives for the master chain (EVERY available parameter per plugin, aim for 20-50+).
    You MUST provide 'drumPatterns' and 'arrangement'.

    CRITICAL DRUM PATTERN RULES:
    - You MUST provide a FULL drum pattern for Kick, Snare, and Hi-Hat that is EXACTLY 4 or 8 bars long.
    - 16 steps = 1 bar (4 beats). 32 steps = 1 bar (if double time).
    - For 4 bars: Provide steps ranging from 1 to 64 (or 1-128 if double time).
    - For 8 bars: Provide steps ranging from 1 to 128 (or 1-256 if double time).
    - Ensure the 'steps' array reflects a professional, genre-appropriate "bounce" across the ENTIRE 4 or 8 bars.
    - Use 'swing' values (0-100) to add groove.
    - CRITICAL: Incorporate probabilistic velocity, micro-timing, articulation, and dynamic phrase lengths to move beyond robotic, quantized output toward a more "human" performance.
    - CRITICAL: Ensure rhythmic locking by synchronizing kick and bass patterns.
    
    ${ADVANCED_MIDI_PROMPT}
  `;

  const schemaObject = {
    type: "OBJECT",
    properties: {
      recipes: {
        type: "ARRAY",
        items: getUnifiedRecipeSchema()
      }
    },
    required: ["recipes"]
  };
  prompt += `\n\nCRITICAL: You MUST return a valid JSON object. Your JSON object MUST exactly adhere to the following JSON Schema structure (do NOT deviate):\n${JSON.stringify(schemaObject, null, 2)}`;

  const parts: any[] = [];
  
  if (geminiFileUri) {
    let uri = geminiFileUri;
    if (uri.includes('/files/')) {
       const uriParts = uri.split('/files/');
       uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
    } else if (!uri.startsWith('https://')) {
       uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
    }
    
    let finalMimeType = mimeType;
    parts.push({ fileData: { fileUri: uri, mimeType: finalMimeType } });
  } else if (audioBase64) {
    let finalMimeType = mimeType;
    parts.push({ inlineData: { data: audioBase64, mimeType: finalMimeType } });
  } else {
    throw new Error("No audio file provided for analysis (Beat).");
  }
  parts.push({ text: prompt });

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: parts
      },
      config: {
        customAction: 'audio_analysis_recipe',
        responseMimeType: "application/json",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
        ]
      }
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Gemini API Error: ${error instanceof Error ? error.message : String(error)}. Debug Info: parts=${JSON.stringify(parts)}`);
  }

  const jsonStr = response.text?.trim() || '{"recipes": []}';
  console.log("Gemini response text (Beat):", jsonStr);
  let result;
  try {
    result = postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
    if (Array.isArray(result)) result = { recipes: result };
  } catch (e) {
    console.error("JSON parse error (Beat):", e);
    throw new Error("Failed to parse AI response");
  }
  console.log("Parsed result (Beat):", result);
  
  if (isGangstaVox && result.recipes) {
    result.recipes = result.recipes.map((r: any) => ({ ...r, isGangstaVox: true }));
  }
  
  return result;
};

export const getMixCritique = async (
  plugins: VSTPlugin[], 
  audioBase64: string | null, 
  audioUrl: string | null, 
  mimeType: string, 
  isGangstaVox: boolean = false, 
  hasStems: boolean = false, 
  userContext: string = "", 
  previousCritique: any = null, 
  referenceTrack: string = "", 
  referenceAudioBase64: string | null = null, 
  geminiFileUri: string | null = null, 
  referenceGeminiFileUri: string | null = null, 
  language: string = 'en', 
  uploadedStems?: any[], 
  analogInstruments: Hardware[] = [], 
  analogHardware: Hardware[] = [],
  isBusMode: boolean = false
): Promise<any> => {
  const ai = getAI();
  const pluginListStr = plugins.map(p => {
    let str = `${p.vendor} - ${p.name} (${p.type})`;
    if (p.parameters && p.parameters.length > 0) {
      str += ` [Parameters: ${p.parameters.join(', ')}]`;
    }
    return str;
  }).join('\n');
  
  const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo'));
  const apolloInst = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';

  const hardwareListStr = [...analogInstruments, ...analogHardware].map(h => {
    const pedalsStr = h.connectedPedals && h.connectedPedals.length > 0 
      ? ` (Connected Pedals: ${h.connectedPedals.map(p => `${p.vendor} ${p.name}`).join(', ')})` 
      : '';
    const ampsStr = h.connectedAmps && h.connectedAmps.length > 0
      ? ` (Connected Amps: ${h.connectedAmps.map(a => `${a.vendor} ${a.name}`).join(', ')})`
      : '';
    return `${h.vendor} - ${h.name}${pedalsStr}${ampsStr}`;
  }).join('\n');

  let focusInstruction = "";
  if (isGangstaVox) {
    if (hasStems && uploadedStems && uploadedStems.length > 0) {
      focusInstruction = `Focus specifically on the VOCALS in this mix. DO NOT focus on the beat or instruments. The user HAS UPLOADED STEMS. You MUST analyze how these stems sound mixed together, rather than just in isolation. Your primary goal is to ensure all the vocals sound completely cohesive together. Suggest plugins that not only improve tone, but strictly level the vocals correctly so the end result has every vocal track (verses, hooks, dubs, etc.) at the perfect consistent volume. ${isBusMode ? "BUS MODE IS ON: Provide advice on how to group these stems into logical busses (e.g., Lead Bus, Backing Bus, Ad-lib Bus) and how to process those busses collectively, in addition to individual track processing." : "Make sure to listen to the ENTIRE length of the audio files, including any intros, bridges, and outros. Provide advice on how to process each individual stem and how they fit together to improve the overall vocal mix."}`;
    } else {
      focusInstruction = "Focus specifically on the VOCALS in this mix. DO NOT focus on the beat or instruments. Make sure to listen to the ENTIRE length of the song, including any intros, bridges, and outros. Analyze vocal consistency, presence, and processing across the entire song.";
    }
  } else {
    if (hasStems && uploadedStems && uploadedStems.length > 0) {
      focusInstruction = `Focus specifically on the BEAT/INSTRUMENTAL in this mix. DO NOT focus on the vocals. The user HAS UPLOADED STEMS. ${isBusMode ? "BUS MODE IS ON: Provide advice on how to group these stems into logical busses (e.g., Drum Bus, Bass Bus, Synth Bus, FX Bus) and how to process those busses collectively (e.g., bus compression, glue EQ, saturation) to improve the overall cohesion, in addition to individual track processing." : "Make sure to listen to the ENTIRE length of the audio files, including any intros, bridges, and outros. Provide advice on how to process each individual stem (e.g., EQing the kick, compressing the snare, panning hi-hats, sidechaining) and how they fit together to improve the overall mix."}`;
    } else if (hasStems) {
      focusInstruction = `Focus specifically on the BEAT/INSTRUMENTAL in this mix. DO NOT focus on the vocals. The user HAS STEMS (individual instrument tracks). ${isBusMode ? "BUS MODE IS ON: Suggest a bus-based workflow where elements are grouped into busses (Drums, Music, Bass) for collective processing to improve the mix's glue and impact." : "Make sure to listen to the ENTIRE length of the song, including any intros, bridges, and outros. Provide advice on how to process individual elements (e.g., EQing the kick, compressing the snare, panning hi-hats, sidechaining) to improve the overall mix."}`;
    } else {
      focusInstruction = "Focus specifically on the BEAT/INSTRUMENTAL in this mix. DO NOT focus on the vocals. The user ONLY HAS THIS MP3 (a single stereo file). Make sure to listen to the ENTIRE length of the song, including any intros, bridges, and outros. Provide advice on mastering and stereo bus processing (e.g., dynamic EQ, mid-side processing, stem separation tools, overall EQ balance, limiting) to improve the sound without access to individual tracks.";
    }
  }

  const contextStr = userContext ? `\nCRITICAL USER CONTEXT: The user has provided the following information about their track and goals. You MUST incorporate this into your analysis and advice:\n"${userContext}"\n` : "";
  const previousCritiqueStr = previousCritique ? `\nPREVIOUS CRITIQUE CONTEXT: The user is uploading a new version of the track based on a previous critique. Here are the details of the previous critique:\nTitle: ${previousCritique.title}\nFeedback: ${previousCritique.overallFeedback}\nStrengths: ${JSON.stringify(previousCritique.strengths)}\nWeaknesses: ${JSON.stringify(previousCritique.weaknesses)}\nAction Plan: ${JSON.stringify(previousCritique.actionPlan)}\n\nPlease analyze the new audio, compare it with the previous critique, and provide further guidance to help the user achieve their desired sound. Focus on what has improved, what still needs work, and suggest further parameter adjustments or new plugins if necessary.\n` : "";
  const referenceTrackStr = referenceTrack ? `\nREFERENCE TRACK: The user wants their mix to sound like this reference track: "${referenceTrack}". Please provide a guide for the critiqued MP3 to sound as accurately as possible like this reference track. If the reference track is a known song, use your knowledge to compare the sonic characteristics. If it's a URL, try to understand the context.\n` : "";

  const languageInstruction = getLanguageInstruction(language);

  let prompt = `
    You are an expert audio engineer and producer. I am uploading an MP3 of a full song project that needs work.
    ${focusInstruction}
    ${contextStr}
    ${previousCritiqueStr}
    ${referenceTrackStr}
    ${languageInstruction}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    
    Analyze the audio and provide a detailed mix critique. Since this is a full song, consider the dynamic changes, song structure (intro, verse, chorus, etc.), and how the mix evolves.
    
    Only recommend plugins from this list:
    ${pluginListStr}

    The user also has the following hardware and instruments:
    ${hardwareListStr}

    ${hasApollo ? `
    CRITICAL: The user has an ${apolloInst} interface. When suggesting plugins for the action plan, you MUST ALWAYS prioritize UAD (Universal Audio) plugins from their library if they are suitable.
    ` : ''}

    CRITICAL: If a hardware instrument has connected pedals, you MUST provide specific settings for those pedals in your advice. Assume the pedal is connected directly to the instrument. Your research and logic MUST reflect the interaction between the specific instrument and the specific pedal(s) connected to it.

    ${audioUrl ? `The main audio file is available at this URL: ${audioUrl}. Please fetch and analyze it.` : "The main audio file is provided as inline data."}
    ${referenceAudioBase64 ? "The second inline audio file is the reference track. Please analyze both and compare them." : ""}
    
    Provide:
    - 'title': A short title for this critique.
    - 'overallFeedback': A detailed analysis summarizing the current state of the mix, the main areas for improvement, and the overall sonic character.
    - 'strengths': An array of 4-6 specific things that sound good (e.g., specific frequency ranges, dynamic control, spatial imaging).
    - 'weaknesses': An array of 4-6 specific issues that need fixing, categorized by their impact on the mix.
    - 'actionPlan': A comprehensive array of actionable steps to fix the issues. ${hasStems && uploadedStems && uploadedStems.length > 0 ? `CRITICAL: Because the user uploaded ${uploadedStems.length} stems, you MUST provide EXACTLY one step per stem. For EACH stem's step, you MUST provide EXACTLY 4 plugins in the 'recommendedChain'. ALWAYS add an extra plugin (the 4th plugin) dedicated specifically to volume leveling/gain structuring so that the resulting stem sounds completely unified strictly in volume with the rest of the stems.` : "For each step, provide a robust chain of 2-4 plugins."} For each step, provide:
      - 'targetStem': The exact name of the stem this step applies to (if stems were uploaded).
      - 'issue': The specific problem.
      - 'solution': A detailed technical explanation of how to fix it.
      - 'recommendedChain': A robust chain of plugins from the user's list to use for this fix, with 'name', 'purpose', and 'deepDive' (an array of parameter objects - Provide EVERY available parameter found on the actual plugin interface, aim for 40-80 settings for complex modules - each with 'parameter', 'value', and 'explanation'). You can also optionally include 'band' and 'routing' properties for multiband or parallel processing. MATCH THE EXTREME DETAIL LEVEL OF A FULL BEAT RECIPE.
  `;
  const schemaObject = {
    type: "OBJECT",
    properties: {
      title: { type: "STRING" },
      overallFeedback: { type: "STRING" },
      strengths: { type: "ARRAY", items: { type: "STRING" } },
      weaknesses: { type: "ARRAY", items: { type: "STRING" } },
      actionPlan: {
        type: "ARRAY",
        description: hasStems && uploadedStems && uploadedStems.length > 0 ? `CRITICAL: You MUST generate EXACTLY ${uploadedStems.length} items in this array, one for each uploaded stem.` : "Array of actionable steps.",
        items: {
          type: "OBJECT",
          properties: {
            targetStem: { type: "STRING", description: "The exact name of the stem this step applies to (if stems were uploaded)." },
            issue: { type: "STRING" },
            solution: { type: "STRING" },
            recommendedChain: {
              type: "ARRAY",
              description: hasStems && uploadedStems && uploadedStems.length > 0 ? "CRITICAL: You MUST provide EXACTLY 4 plugins for this stem, with the 4th explicitly dedicated to volume leveling." : "Chain of 2-4 plugins.",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  purpose: { type: "STRING" },
                  deepDive: {
                    type: "ARRAY",
                    description: "Provide EVERY available parameter found on the actual plugin interface. Aim for 40-70 settings for complex modules. MATCH THE EXTREME DETAIL LEVEL OF A FULL BEAT RECIPE.",
                    items: {
                      type: "OBJECT",
                      properties: {
                        parameter: { type: "STRING" },
                        value: { type: "STRING" },
                        explanation: { type: "STRING" }
                      },
                      required: ["parameter", "value", "explanation"]
                    }
                  }
                },
                required: ["name", "purpose", "deepDive"]
              }
            }
          },
          required: hasStems && uploadedStems && uploadedStems.length > 0 ? ["targetStem", "issue", "solution", "recommendedChain"] : ["issue", "solution", "recommendedChain"]
        }
      }
    },
    required: ["title", "overallFeedback", "strengths", "weaknesses", "actionPlan"]
  };
  prompt += `\n\nCRITICAL: You MUST return a valid JSON object EXCLUSIVELY formatted with this exact JSON Schema:\n${JSON.stringify(schemaObject, null, 2)}`;

  const parts: any[] = [];
  
  if (uploadedStems && uploadedStems.length > 0) {
    for (const stem of uploadedStems) {
      if (stem.uri) {
        let uri = stem.uri;
        if (uri.includes('/files/')) {
           const uriParts = uri.split('/files/');
           uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
        } else if (!uri.startsWith('https://')) {
           uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
        }
        let stemMimeType = stem.mimeType;
        parts.push({ fileData: { fileUri: uri, mimeType: stemMimeType } });
      } else if (stem.base64) {
        let stemMimeType = stem.mimeType;
        parts.push({ inlineData: { data: stem.base64, mimeType: stemMimeType } });
      }
    }
  } else {
    if (geminiFileUri) {
      let uri = geminiFileUri;
      if (uri.includes('/files/')) {
         const uriParts = uri.split('/files/');
         uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
      } else if (!uri.startsWith('https://')) {
         uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
      }
      let finalMimeType = mimeType;
      parts.push({ fileData: { fileUri: uri, mimeType: finalMimeType } });
    } else if (audioBase64) {
      let finalMimeType = mimeType;
      parts.push({ inlineData: { data: audioBase64, mimeType: finalMimeType } });
    } else {
      throw new Error("No audio file provided for analysis (Critique).");
    }
  }
  
  if (referenceGeminiFileUri) {
    let uri = referenceGeminiFileUri;
    if (uri.includes('/files/')) {
       const uriParts = uri.split('/files/');
       uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
    } else if (!uri.startsWith('https://')) {
       uri = 'https://generativelanguage.googleapis.com/v1beta/' + (uri.startsWith('files/') ? uri : 'files/' + uri);
    }
    parts.push({ fileData: { fileUri: uri, mimeType: mimeType } });
  } else if (referenceAudioBase64) {
    parts.push({ inlineData: { data: referenceAudioBase64, mimeType: mimeType } });
  }
  parts.push({ text: prompt });

  const tools: any[] = [];
  if (referenceTrack && !referenceAudioBase64) {
    tools.push({ googleSearch: {} });
  }

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: parts
      },
      config: {
        customAction: hasStems ? 'stems_critique' : 'critique',
        tools: tools.length > 0 ? tools : undefined,
        responseMimeType: "application/json",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
        ]
      }
    });
  } catch (error) {
    console.error("Gemini API Error (Critique):", error);
    throw new Error(`Gemini API Error (Critique): ${error instanceof Error ? error.message : String(error)}. Debug Info: parts=${JSON.stringify(parts)}`);
  }

  const jsonStr = response.text?.trim() || '{}';
  let result;
  try {
    result = postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
  } catch (e) {
    console.error("Failed to parse AI response as JSON in getMixCritique", e);
    throw new Error("The architect's response was not in the correct format. Please try again!");
  }
  result.id = crypto.randomUUID();
  result.isGangstaVox = isGangstaVox;
  result.audioBase64 = audioBase64;
  result.mimeType = mimeType;
  return result;
};

export const getSpecificMixHelp = async (plugins: VSTPlugin[], audioBase64: string | undefined, mimeType: string | undefined, query: string, isGangstaVox: boolean = false, recipeContext?: string, chatHistory: {role: 'user' | 'model', content: string}[] = [], audioUrl?: string, geminiFileUri?: string, language: string = 'en', analogHardware: Hardware[] = []): Promise<{query: string, advice: string, recommendedChain: any[]}> => {
  const ai = getAI();
  const pluginListStr = plugins.map(p => `${p.vendor} - ${p.name} (${p.type})`).join('\n');

  const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo'));
  const apolloInst = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';
  
  const apolloConstraint = hasApollo ? `
    CRITICAL: The user has an ${apolloInst} interface. When suggesting plugins for this mix, you MUST ALWAYS prioritize UAD (Universal Audio) plugins from their library if they are suitable for the task.
  ` : '';

  const systemPrompt = `
    You are an expert audio engineer and producer. 
    ${getLanguageInstruction(language)}
    ${PRO_Q_3_LAYOUT_PROMPT}
    ${GULLFOSS_SPEC_PROMPT}
    ${OZONE_SPEC_PROMPT}
    ${SONIBLE_SPEC_PROMPT}
    ${RC20_SPEC_PROMPT}
    ${GLOBAL_PARAMETER_STRICTNESS_PROMPT}

    ${apolloConstraint}

    ${audioBase64 || audioUrl ? "I am uploading an MP3 of a project that needs work." : "I am providing a recipe for a track."}
    ${isGangstaVox ? "Focus specifically on the VOCALS." : "Focus specifically on the BEAT/INSTRUMENTAL."}
    
    ${recipeContext ? `Here is the recipe context:\n${recipeContext}\n` : ""}
    
    ${audioBase64 || audioUrl ? "Analyze the audio focusing ONLY on the user's requests, and provide targeted advice." : "Analyze the recipe details focusing ONLY on the user's requests, and provide targeted advice."}
    
    Only recommend plugins from this list:
    ${pluginListStr}

    ${audioUrl ? `The audio file is available at this URL: ${audioUrl}. Please fetch and analyze it.` : ""}

    Respond to the user's latest message. Return the result as a JSON object with 'query', 'advice', and 'recommendedChain' (an array of plugin objects with name, purpose, and deepDive parameters - Provide EVERY available parameter found on the actual plugin interface. Aim for 40-80 settings for complex modules. Do NOT be lazy; ensure every possible control is accounted for. MATCH THE EXTREME DETAIL LEVEL OF A FULL BEAT RECIPE).
  `;

  const firstUserParts: any[] = [];
  if (geminiFileUri && mimeType) {
    let uri = geminiFileUri;
    if (uri.includes('/files/')) {
       const uriParts = uri.split('/files/');
       uri = 'https://generativelanguage.googleapis.com/v1beta/files/' + uriParts[1];
    }
    firstUserParts.push({ fileData: { fileUri: uri, mimeType: mimeType } });
  } else if (audioBase64 && mimeType) {
    firstUserParts.push({ inlineData: { data: audioBase64, mimeType: mimeType } });
  }
  firstUserParts.push({ text: systemPrompt });

  const contents: any[] = [
    { role: 'user', parts: firstUserParts },
    { role: 'model', parts: [{ text: "Understood. How can I help you with this mix?" }] }
  ];

  for (const msg of chatHistory) {
    contents.push({
      role: msg.role,
      parts: [{ text: msg.content }]
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: query }]
  });

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        customAction: 'critique',
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            query: { type: Type.STRING },
            advice: { type: Type.STRING },
            recommendedChain: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  deepDive: {
                    type: Type.ARRAY,
                    description: "Provide EVERY available parameter found on the actual plugin interface. Aim for 40-70 settings for complex modules. Do NOT be lazy; ensure every possible control is accounted for. MATCH THE EXTREME DETAIL LEVEL OF A FULL BEAT RECIPE.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING },
                        value: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                      },
                      required: ["parameter", "value", "explanation"]
                    }
                  }
                },
                required: ["name", "purpose", "deepDive"]
              }
            }
          },
          required: ["query", "advice", "recommendedChain"]
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
        ]
      }
    });
  } catch (error) {
    console.error("Gemini API Error (Specific Mix Help):", error);
    throw new Error(`Gemini API Error (Specific Mix Help): ${error instanceof Error ? error.message : String(error)}. Debug Info: contents=${JSON.stringify(contents)}`);
  }

  try {
    return JSON.parse(sanitizeJSON(response.text || '{"query": "", "advice": "I\'m sorry, I couldn\'t generate a response.", "recommendedChain": []}'));
  } catch (e) {
    console.error("Failed to parse AI response as JSON in getSpecificMixHelp", e);
    return { query, advice: "I'm sorry, I couldn't generate a response.", recommendedChain: [] };
  }
};

export const getGangstaVoxRecipe = async (recipe: BeatRecipe, plugins: VSTPlugin[], analogHardware: Hardware[], language: string = 'en', vocalGoal?: string): Promise<any> => {
  // Use Gemini Pro for maximum accuracy on complex vocal chains and DSP logic
  const ai = getAI();
  const pluginListStr = plugins.map(p => `${p.vendor} - ${p.name} (${p.type})`).join('\n');
  
  const uadPlugins = plugins.filter(p => 
    (p.vendor.toLowerCase().includes('universal audio') || p.name.toLowerCase().includes('uad')) && 
    !p.name.toLowerCase().includes('native') && 
    !p.name.toLowerCase().includes('uadx')
  );
  const uadPluginListStr = uadPlugins.length > 0 
    ? uadPlugins.map(p => `${p.vendor} - ${p.name} (${p.type})`).join('\n')
    : 'Universal Audio plugins defaults (e.g. 1176, LA-2A, Pultec EQP-1A, Neve 1073, Townsend Sphere, Ocean Way, etc.)';

  const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo')) || (vocalGoal && (vocalGoal.toLowerCase().includes('apollo') || vocalGoal.toLowerCase().includes('console') || vocalGoal.toLowerCase().includes('uad')));
  const apolloModel = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';
  const hasTownsend = analogHardware.some(h => 
    h.name.toLowerCase().includes('townsend') || 
    h.name.toLowerCase().includes('sphere l22') ||
    h.name.toLowerCase().includes('sphere dlx') ||
    h.name.toLowerCase().includes('sphere lx') ||
    h.name.toLowerCase() === 'l22'
  ) || (vocalGoal && (vocalGoal.toLowerCase().includes('l22') || vocalGoal.toLowerCase().includes('townsend') || vocalGoal.toLowerCase().includes('sphere')));

  const hasOceanWayMic = plugins.some(p => p.name.toLowerCase().includes('ocean way mic')) || (vocalGoal && vocalGoal.toLowerCase().includes('ocean way mic'));

  const prompt = `
    Analyze the following Beat Recipe:
    Title: ${recipe.title}
    Style: ${recipe.style}
    BPM: ${recipe.bpm}
    Description: ${recipe.description}

    ${vocalGoal ? `TARGET VOCAL SOUND GOAL / VIBE: ${vocalGoal}` : 'Provide a matching "GangstaVox" Vocal FX Chain Recipe that perfectly complements this beat.'}
    
    ${getLanguageInstruction(language)}
    Only use mixing plugins from this list for the vocalLayers mixing (after tracking in DAW):
    ${pluginListStr}

    ${hasApollo ? `
    CRITICAL: The user owns a Universal Audio Apollo interface (${apolloModel}).
    You MUST include a 'trackingChain' specifically for this Apollo, mirroring the UAD Console workflow.
    
    FOR THE UAD CONSOLE TRACKING CHAIN, YOU MUST STRICTLY ONLY USE THESE UAD-2 DSP PLUGINS:
    ${uadPluginListStr}
    ${hasTownsend ? 'CRITICAL: The user is using the TOWNSEND LABS / UA SPHERE L22 (or DLX/LX) microphone. You MUST explain that this requires a STEREO LINKED input pair (e.g., Mic 1-2) in UAD Console to process the double capsules.' : ''}
    
    MANDATORY UAD CONSOLE REQUIREMENTS:
    1. UNISON SLOT: A Unison preamp/channel strip plugin is MANDATORY. Explain the physical impedance matching.
    2. INSERTS (Stereo Mic Channel): You MUST provide EXACTLY 4 plugins. The 4 slots MUST BE FILLED. The FIRST insert slot MUST ALWAYS be one of the following plugins ("Ocean Way Mic Collection" [preferred], "Bill Putnam Mic Collection", or "Sphere Mic Collection"). Then add exactly 3 more plugins to glue/shape the vocal.
    3. AUX 1: Array of UAD-2 plugins. This is MANDATORY. Explain if this is for monitoring only or printed.
    4. AUX 2: Array of UAD-2 plugins. This is MANDATORY. Provide specific routing on how to record this Aux as a separate track.
    
    ACCURACY AND DEPTH:
    - For EVERY plugin in the tracking chain, you MUST provide an exhaustive 'deepDive' of EVERY available parameter. DO NOT BE LAZY. Provide 30-50+ settings per plugin, covering every knob, fader, switch, and hidden menu.
    - Provide 'dawRoutingInstructions' explaining Virtual I/O, physical outputs, 'UAD REC' vs 'UAD MON' switch logic, and printing vs monitoring commitments.
    - Provide a 'dspUsageNote' explaining how to manage DSP in Console with all these plugins.
    ` : ''}

    For the main vocal mix (after tracking in UAD Console), assume the user is back in their DAW editing those recorded vocals. You MUST expand the plugin list to include non-UAD plugins (like UADx, Waves, FabFilter, etc.) that are available in the user's list, as native plugins can now be used. Provide:
    - 'vocalLayers': An array of vocal layers (e.g., Lead Vocal, Background Vocal, Adlibs, Doubles).
      - For each layer, describe the 'sourceSoundGoal' (recording style/performance).
      - Provide a 'loopGuide' (arrangement tip).
      - Provide a 'processing': An array of 8-12 plugins to create a complex, professional vocal chain. For each plugin, provide 'pluginName' and a detailed 'purpose' with specific parameters.
      - Provide 'vocalDives': Detailed parameters for the key plugins in this specific layer.
        - 'pluginName': The name of the plugin.
        - 'whyItWorks': Why this plugin is essential for this vocal layer.
        - 'settings': Array of {parameter, value} pairs (Provide EVERY available parameter found on the actual plugin interface. Aim for 20-40 settings for complex modules. Do NOT be lazy; ensure every possible control is accounted for).
        - 'proTip': A professional tip for this plugin on this vocal layer.
    - 'layeringStrategy': How the vocals sit together and in the beat.
    - 'mastering': A mastering chain for the final vocal+beat mix.
  `;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        customAction: 'gangsta_vox',
        temperature: 0.7,
        responseMimeType: "application/json",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
        ],
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trackingChain: {
              type: Type.OBJECT,
              properties: {
                unisonPlugin: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    deepDive: {
                      type: Type.ARRAY,
                      description: "Provide EVERY available parameter found on the actual plugin (typically 20-50 for professional plugins). Be exhaustive and do NOT be lazy.",
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          parameter: { type: Type.STRING },
                          value: { type: Type.STRING }
                        },
                        required: ["parameter", "value"]
                      }
                    }
                  },
                  required: ["name", "purpose", "deepDive"]
                },
                inserts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      purpose: { type: Type.STRING },
                      deepDive: {
                        type: Type.ARRAY,
                        description: "Provide EVERY available parameter found on the actual plugin interface. Aim for 40-70 settings for complex modules. Do NOT be lazy; ensure every possible control is accounted for. MATCH THE EXTREME DETAIL LEVEL OF A FULL BEAT RECIPE.",
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            parameter: { type: Type.STRING },
                            value: { type: Type.STRING }
                          },
                          required: ["parameter", "value"]
                        }
                      }
                    },
                    required: ["name", "purpose", "deepDive"]
                  }
                },
                aux1: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      purpose: { type: Type.STRING },
                      deepDive: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { parameter: { type: Type.STRING }, value: { type: Type.STRING } }, required: ["parameter", "value"] } }
                    },
                    required: ["name", "purpose", "deepDive"]
                  }
                },
                aux2: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      purpose: { type: Type.STRING },
                      deepDive: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { parameter: { type: Type.STRING }, value: { type: Type.STRING } }, required: ["parameter", "value"] } }
                    },
                    required: ["name", "purpose", "deepDive"]
                  }
                },
                dawRoutingInstructions: { type: Type.STRING },
                dspUsageNote: { type: Type.STRING }
              },
              required: ["inserts"]
            },
            vocalLayers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  layerName: { type: Type.STRING },
                  sourceSoundGoal: { type: Type.STRING },
                  loopGuide: { type: Type.STRING },
                  processing: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        pluginName: { type: Type.STRING },
                        purpose: { type: Type.STRING },
                        settings: {
                          type: Type.ARRAY,
                          description: "Show EVERY parameter available on the plugin (typically 20-50 settings). Do NOT be lazy; if a plugin has many controls, list them all. NEVER invent fake parameters, but be absolutely exhaustive with the real ones.",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              parameter: { type: Type.STRING },
                              value: { type: Type.STRING }
                            },
                            required: ["parameter", "value"]
                          }
                        }
                      },
                      required: ["pluginName", "purpose", "settings"]
                    }
                  },
                  vocalDives: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        pluginName: { type: Type.STRING },
                        whyItWorks: { type: Type.STRING },
                        settings: {
                          type: Type.ARRAY,
                          description: "Provide EVERY available parameter found on the actual plugin interface. Aim for 40-70 settings for complex modules. Do NOT be lazy; ensure every possible control is accounted for. MATCH THE EXTREME DETAIL LEVEL OF A FULL BEAT RECIPE.",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              parameter: { type: Type.STRING },
                              value: { type: Type.STRING }
                            },
                            required: ["parameter", "value"]
                          }
                        },
                        proTip: { type: Type.STRING }
                      },
                      required: ["pluginName", "whyItWorks", "settings", "proTip"]
                    }
                  }
                },
                required: ["layerName", "sourceSoundGoal", "loopGuide", "processing", "vocalDives"]
              }
            },
            layeringStrategy: { type: Type.STRING },
            mastering: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pluginName: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  settings: {
                    type: Type.ARRAY,
                    description: "AT LEAST 10 parameters (and up to 30 if it is a complex channel strip plugin).",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING },
                        value: { type: Type.STRING }
                      },
                      required: ["parameter", "value"]
                    }
                  }
                },
                required: ["pluginName", "purpose", "settings"]
              }
            }
          },
          required: ["vocalLayers", "layeringStrategy", "mastering"]
        }
      }
    });
  } catch (error) {
    console.error("Gemini API Error (Gangsta Vox):", error);
    throw new Error(`Gemini API Error (Gangsta Vox): ${error instanceof Error ? error.message : String(error)}`);
  }

  const jsonStr = response.text?.trim() || '{}';
  try {
    return postProcessResult(JSON.parse(sanitizeJSON(jsonStr)));
  } catch (e) {
    console.error("Failed to parse AI response as JSON in getGangstaVoxRecipe", e);
    throw new Error("The architect's response was not in the correct format. Please try again!");
  }
};

export const replicateRecipeWithUserGear = async (recipe: SavedRecipe, myPlugins: VSTPlugin[], language: string = 'en'): Promise<SavedRecipe> => {
  const ai = getAI();
  const receiverStr = myPlugins.length > 0 
    ? myPlugins.map(p => `${p.vendor} - ${p.name}`).join('\n')
    : "No plugins available (use generic stock plugins)";

  // Strip out large/unnecessary metadata for the prompt
  const { id, savedAt, bubbleColor, folderId, audioBase64, mimeType, geminiFileUri, ...recipeData } = recipe;

  const prompt = `
    I have a beat recipe shared by a friend, but I might not own all the plugins used in it.
    My available plugins are:
    ${receiverStr}

    Here is the shared recipe data:
    ${JSON.stringify(recipeData, null, 2)}

    Please adapt this recipe so that it ONLY uses plugins from my available plugins list. 
    
    ${getLanguageInstruction(language)}
    If I don't own a plugin used in the recipe, replace it with the most similar plugin I own, and provide new similar parameters for that beat style.
    If I do own the plugin, keep it and keep its parameters.
    Keep the original BPM, Scale, Chord Progression, and Drum Patterns.
    
    Return the adapted recipe in the exact same JSON structure as the original recipe.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        customAction: 'analog_save',
        responseMimeType: "application/json",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF }
        ],
        responseSchema: getUnifiedRecipeSchema()
      }
    });

    let jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("The AI returned an empty response. This usually happens if the recipe is too complex or the API key has limits.");
    }

    // Clean up potential markdown formatting
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }

    let adapted;
    try {
      const parsed = JSON.parse(sanitizeJSON(jsonStr));
      adapted = postProcessResult(parsed);
      if (adapted.recipe) {
        adapted = adapted.recipe;
      } else if (adapted.recipes && adapted.recipes.length > 0) {
        adapted = adapted.recipes[0];
      }
    } catch (parseErr) {
      console.error("Failed to parse AI response as JSON:", jsonStr);
      throw new Error("The AI generated an invalid recipe format. Please try again.");
    }
    
    // Ensure we merge with the original recipe to preserve any fields the AI might have missed
    // but prioritize the adapted fields for instruments/busses/etc.
    return {
      ...recipe,
      ...adapted,
      id: Math.random().toString(36).substr(2, 9),
      savedAt: new Date().toISOString(),
      bubbleColor: '#0ea5e9'
    };
  } catch (err) {
    console.error("Error in replicateRecipeWithUserGear:", err);
    throw err;
  }
};

export const regenerateTrackingChain = async (
  vibeSearch: string,
  plugins: VSTPlugin[],
  analogHardware: Hardware[],
  language: string,
  songSearch: string = ''
) => {
  try {
    const ai = getAI();
    const uadPlugins = plugins.filter(p => 
      (p.vendor.toLowerCase().includes('universal audio') || p.name.toLowerCase().includes('uad')) && 
      !p.name.toLowerCase().includes('native') && 
      !p.name.toLowerCase().includes('uadx')
    );
    const uadPluginListStr = uadPlugins.length > 0 
      ? uadPlugins.map(p => `${p.vendor} - ${p.name} (${p.type})`).join('\n')
      : 'Universal Audio plugins defaults (e.g. 1176, LA-2A, Pultec EQP-1A, Neve 1073, Townsend Sphere, Ocean Way, etc.)';
    
    const hasApollo = analogHardware.some(h => h.name.toLowerCase().includes('apollo'));
    const apolloModel = analogHardware.find(h => h.name.toLowerCase().includes('apollo'))?.name || 'Apollo';
    const hasTownsend = analogHardware.some(h => 
      h.name.toLowerCase().includes('townsend') || 
      h.name.toLowerCase().includes('sphere l22') ||
      h.name.toLowerCase().includes('sphere dlx') ||
      h.name.toLowerCase().includes('sphere lx') ||
      h.name.toLowerCase() === 'l22'
    ) || vibeSearch.toLowerCase().includes('l22') || vibeSearch.toLowerCase().includes('townsend') || vibeSearch.toLowerCase().includes('sphere');
  
    const hasOceanWayMic = plugins.some(p => p.name.toLowerCase().includes('ocean way mic')) || vibeSearch.toLowerCase().includes('ocean way mic');

    const prompt = `
      You are an expert audio engineer running UAD Console. 
      The user has requested a completely new tracking chain for their Apollo, based on this new vibe/artist request: "${vibeSearch}"
      ${songSearch ? `(Context: They are tracking to a beat similar to: ${songSearch})` : ''}

      ${getLanguageInstruction(language)}
      YOU MUST STRICTLY ONLY USE THESE UAD-2 DSP PLUGINS FOR THE UAD CONSOLE TRACKING CHAIN:
      ${uadPluginListStr}

      CRITICAL CONSTRAINTS:
      The user owns a Universal Audio Apollo interface (${apolloModel}).
      ${hasTownsend ? 'CRITICAL: The user is using the TOWNSEND LABS / UA SPHERE L22 (or DLX/LX) microphone. This requires a STEREO LINKED input pair in UAD Console.' : ''}

      MANDATORY UAD CONSOLE REQUIREMENTS:
      1. UNISON SLOT: A Unison preamp/channel strip plugin is MANDATORY. Explain impedance matching.
      2. INSERTS (Stereo Mic Channel): EXACTLY 4 plugins MUST be provided. The FIRST insert MUST ALWAYS be "Ocean Way Mic Collection" (or "Sphere Mic Collection"/"Bill Putnam Mic Collection"). The other 3 slots MUST be filled.
      3. AUX 1: Array of UAD-2 plugins. This is MANDATORY.
      4. AUX 2: Array of UAD-2 plugins. This is MANDATORY.
      
      ACCURACY AND DEPTH:
      - For EVERY plugin, provide exhaustive 'deepDive' parameters. DO NOT BE LAZY. Provide EVERY knob, slider, and switch (aim for 30-50+ exact parameter settings).
      - Provide 'dawRoutingInstructions' explaining Virtual I/O, physical outputs, UAD REC vs UAD MON switch, and printing choices vs monitoring choices.
      - Provide a 'dspUsageNote'.
    `;

    const schema = {
      type: Type.OBJECT,
      properties: {
        trackingChain: {
          type: Type.OBJECT,
          properties: {
            unisonPlugin: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, purpose: { type: Type.STRING }, deepDive: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { parameter: { type: Type.STRING }, value: { type: Type.STRING } }, required: ["parameter", "value"] } } },
              required: ["name", "purpose", "deepDive"]
            },
            inserts: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, purpose: { type: Type.STRING }, deepDive: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { parameter: { type: Type.STRING }, value: { type: Type.STRING } }, required: ["parameter", "value"] } } }, required: ["name", "purpose", "deepDive"] }
            },
            aux1: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, purpose: { type: Type.STRING }, deepDive: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { parameter: { type: Type.STRING }, value: { type: Type.STRING } }, required: ["parameter", "value"] } } }, required: ["name", "purpose", "deepDive"] }
            },
            aux2: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, purpose: { type: Type.STRING }, deepDive: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { parameter: { type: Type.STRING }, value: { type: Type.STRING } }, required: ["parameter", "value"] } } }, required: ["name", "purpose", "deepDive"] }
            },
            dawRoutingInstructions: { type: Type.STRING },
            dspUsageNote: { type: Type.STRING }
          },
          required: ["inserts"]
        }
      },
      required: ["trackingChain"]
    };

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        customAction: 'regenerate_plugin',
        responseMimeType: "application/json",
        responseSchema: schema as unknown as any,
      }
    });

    return JSON.parse(sanitizeJSON(result.text || '{}'));
  } catch (error) {
    console.error("Error regenerating tracking chain:", error);
    throw error;
  }
};
