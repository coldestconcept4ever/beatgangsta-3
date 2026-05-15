import { DawProject, Project, Application, MetaData, Utility, ContentType, MixerRole, Track, Channel, Plugin } from 'dawproject-typescript';
import JSZip from 'jszip';
import { MixCritique, SavedRecipe, InstrumentTrack } from '../types';

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
    // Note: dawproject-typescript handles adding plugins similarly by extending Channel
    tracks.push(track);
  }
  return tracks;
};

export const generateDawProjectFromMixCritique = async (critique: MixCritique, stems: any[]): Promise<Blob> => {
  const project = new Project();
  project.application = new Application("BeatGangsta", "1.0.0");
  
  if (critique.estimatedBPM) {
    project.transport.tempo.value = critique.estimatedBPM;
  }
  
  const metadata = new MetaData();
  metadata.title = critique.title || "Mix Critique Project";
  
  const embeddedFiles: Record<string, Uint8Array> = {};
  
  for (const step of critique.actionPlan || []) {
    if (step.targetStem) {
      const stemData = stems.find(s => s.file?.name === step.targetStem);
      const multiDetails = (step as any).multiBandDetails; // fallback if any
      const tracks = generateTrackChannels(step.targetStem, multiDetails);
      for (const track of tracks) {
        project.structure.push(track);
      }
      
      if (stemData && stemData.file) {
        try {
          const buffer = await stemData.file.arrayBuffer();
          // The dawproject structure handles it via an internal array structure
          // To keep it simple currently, we add it to embedded files
          embeddedFiles[`audio/${stemData.file.name}`] = new Uint8Array(buffer);
        } catch (err) {
          console.error("Failed to read stem data", err);
        }
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
  
  const embeddedFiles: Record<string, Uint8Array> = {};
  
  const instrList = recipe.isGangstaVox ? recipe.gangstaVox?.vocalTracks || [] : recipe.instruments || [];
  
  for (const instr of instrList) {
    const tracks = generateTrackChannels(instr.name, instr.multiBandDetails);
    for (const track of tracks) {
      project.structure.push(track);
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
    project.structure.push(track);
  }
  
  const zipData = await DawProject.save(project, metadata, embeddedFiles);
  return new Blob([zipData], { type: 'application/octet-stream' });
};

