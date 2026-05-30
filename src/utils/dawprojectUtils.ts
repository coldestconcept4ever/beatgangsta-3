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
      new Set([ContentType.AUDIO, ContentType.NOTES]),
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
    track.channel.devices.push(instrDevice);
  }

  for (const fx of fxList || []) {
    const fxDevice = new Vst3Plugin();
    fxDevice.deviceName = fx.name;
    fxDevice.deviceRole = DeviceRole.AUDIO_FX;
    track.channel.devices.push(fxDevice);
  }
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

  const embeddedFiles: Record<string, Uint8Array> = {};
  
  const wavHeader = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, // RIFF size 36
      0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20, // WAVEfmt 
      0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00, // length 16, PCM, stereo
      0x44, 0xac, 0x00, 0x00, 0x10, 0xb1, 0x02, 0x00, // 44100 Hz, 176400 bytes/sec
      0x04, 0x00, 0x10, 0x00, 0x64, 0x61, 0x74, 0x61, // 4 bytes/block, 16 bit/sample, data chunk
      0x00, 0x00, 0x00, 0x00 // Data size 0
  ]);

  for (const step of critique.actionPlan || []) {
    if (step.targetStem) {
      const stemData = stems.find(s => s.file?.name === step.targetStem);
      const multiDetails = (step as any).multiBandDetails; // fallback if any
      const tracks = generateTrackChannels(step.targetStem, multiDetails);
      for (const track of tracks) {
        if (!project.structure) project.structure = [];
        project.structure.push(track);
        
        applyPluginsToTrack(track, step.recommendedChain);
        
        let fileBuffer: Uint8Array | null = null;
        let relativePath = `audio/${step.targetStem}`;

        if (stemData && stemData.file) {
          try {
            const buffer = await stemData.file.arrayBuffer();
            fileBuffer = new Uint8Array(buffer);
          } catch (err) {
            console.error("Failed to read stem data", err);
          }
        }
        
        // Use dummy header if file data doesn't exist so Studio One correctly plots tracks
        if (!fileBuffer) {
           relativePath = `audio/dummy_${step.targetStem.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`;
           fileBuffer = wavHeader;
        }

        embeddedFiles[relativePath] = fileBuffer;
        
        // Assume 120 beats length for visualization if we don't know the exact duration
        const duration = fileBuffer === wavHeader ? 8.0 : 120.0;
        const audio = Utility.createAudio(relativePath, 44100, 2, duration);
        const clip = Utility.createClip(audio, 0, duration);
        const clips = Utility.createClips(clip);
        clips.track = track;
        project.arrangement.lanes.lanes.push(clips);
      }
    }
  }
  
  const zipData = await DawProject.save(project, metadata, embeddedFiles);
  return new Blob([zipData], { type: 'application/octet-stream' });
};

export const generateDawProjectFromBeatRecipe = async (recipe: SavedRecipe): Promise<Blob> => {
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
  
  const embeddedFiles: Record<string, Uint8Array> = {};
  
  const instrList = recipe.isGangstaVox ? recipe.gangstaVox?.vocalTracks || [] : recipe.instruments || [];
  
  for (const instr of instrList) {
    const tracks = generateTrackChannels(instr.name, instr.multiBandDetails);
    
    // Add empty audio to satisfy Studio One logic
    const dummyAudioName = `dummy_${instr.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`;
    const relativePath = `audio/${dummyAudioName}`;
    
    // Create an empty, minimal valid WAV header. (44 bytes for standard 16-bit PCM, 44100Hz, stereo)
    const wavHeader = new Uint8Array([
        0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, // RIFF size 36
        0x57, 0x41, 0x56, 0x45, 0x66, 0x6d, 0x74, 0x20, // WAVEfmt 
        0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00, // length 16, PCM, stereo
        0x44, 0xac, 0x00, 0x00, 0x10, 0xb1, 0x02, 0x00, // 44100 Hz, 176400 bytes/sec
        0x04, 0x00, 0x10, 0x00, 0x64, 0x61, 0x74, 0x61, // 4 bytes/block, 16 bit/sample, data chunk
        0x00, 0x00, 0x00, 0x00 // Data size 0
    ]);
    
    embeddedFiles[relativePath] = wavHeader;
    
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
      MixerRole.EFFECT,
      0.8,
      0.5
    );
    if (!project.structure) project.structure = [];
    project.structure.push(track);
  }
  
  const zipData = await DawProject.save(project, metadata, embeddedFiles);
  return new Blob([zipData], { type: 'application/octet-stream' });
};
