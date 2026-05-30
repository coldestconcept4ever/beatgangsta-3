import { Project, Application, MetaData, Utility, ContentType, MixerRole, DawProject, Arrangement, Lanes } from 'dawproject-typescript';
import fs from 'fs';

async function test() {
  const project = new Project();
  project.application = new Application("BeatGangsta", "1.0.0");
  const metadata = new MetaData();
  metadata.title = "Test Daw Project";
  
  project.arrangement = new Arrangement();
  project.arrangement.lanes = new Lanes();
  project.arrangement.lanes.lanes = [];

  const track = Utility.createTrack("Demo Track", new Set([ContentType.AUDIO]), MixerRole.REGULAR, 0.8, 0.5);
  // Ensure track structure exists
  if (!project.structure) project.structure = [];
  project.structure.push(track);

  const audio = Utility.createAudio("audio/test.wav", 44100, 2, 10.0);
  const clip = Utility.createClip(audio, 0, 10.0);
  const clips = Utility.createClips(clip);
  clips.track = track;
  project.arrangement.lanes.lanes.push(clips);

  const embeddedFiles = {
    "audio/test.wav": new Uint8Array([0, 1, 2, 3])
  };
  
  const zip = await DawProject.save(project, metadata, embeddedFiles);
  fs.writeFileSync('test.dawproject', Buffer.from(zip));
  console.log("Success: wrote test.dawproject");
}
test();
