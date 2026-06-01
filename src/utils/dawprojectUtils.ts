import { DawProject, Project, Application, MetaData, Utility, ContentType, MixerRole, Track, Channel, Plugin, Arrangement, Lanes, Vst3Plugin, DeviceRole } from 'dawproject-typescript';
import JSZip from 'jszip';
import { MixCritique, SavedRecipe, InstrumentTrack, DeepDivePlugin } from '../types';

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

const applyPluginsToTrack = (track: Track, fxList: DeepDivePlugin[], instrumentName?: string) => {
  if (!track.channel) return;
  if (!track.channel.devices) track.channel.devices = [];
  
  if (instrumentName) {
    const instrDevice = new Vst3Plugin();
    instrDevice.deviceName = instrumentName;
    instrDevice.deviceRole = DeviceRole.INSTRUMENT;
    instrDevice.deviceID = "565354506c7567696e56616c69644944";
    instrDevice.deviceVendor = "Beat Gangsta Platform";
    track.channel.devices.push(instrDevice);
  }

  for (const fx of fxList || []) {
    const fxDevice = new Vst3Plugin();
    fxDevice.deviceName = fx.name;
    fxDevice.deviceRole = DeviceRole.AUDIO_FX;
    fxDevice.deviceID = "565354506c7567696e56616c69644944";
    fxDevice.deviceVendor = "Beat Gangsta Platform";
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

export const generateDawProjectFromMixCritique = async (critique: MixCritique, stems: any[]): Promise<Blob> => {
  const project = new Project();
  project.application = new Application("BeatGangsta", "1.0.0");
  
  if (critique.estimatedBPM) {
    project.transport.tempo.value = critique.estimatedBPM;
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
        
        applyPluginsToTrack(track, step.recommendedChain);
        
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

export const generateDawProjectFromBeatRecipe = async (recipe: any): Promise<Blob> => {
  const project = new Project();
  project.application = new Application("BeatGangsta", "1.0.0");
  
  if (recipe.bpm) {
    project.transport.tempo.value = recipe.bpm;
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

      applyPluginsToTrack(track, instr.fxPlugins, instr.plugin);
      
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
