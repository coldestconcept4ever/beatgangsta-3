
/**
 * Processes an audio file to make it suitable for AI analysis.
 * Trims to 60 seconds, downmixes to mono, and reduces sample rate.
 */
export async function processAudioForAnalysis(file: File): Promise<{ base64: string, mimeType: string }> {
  // Normalize mime type
  let mimeType = file.type;
  const lowerName = file.name.toLowerCase();
  if (!mimeType) {
    if (lowerName.endsWith('.mp3')) mimeType = 'audio/mpeg';
    else if (lowerName.endsWith('.ogg')) mimeType = 'audio/ogg';
    else if (lowerName.endsWith('.flac')) mimeType = 'audio/flac';
    else if (lowerName.endsWith('.aac')) mimeType = 'audio/aac';
  }
  if (mimeType === 'audio/mp3') mimeType = 'audio/mpeg';

  const validTypes = ['audio/mpeg', 'audio/ogg', 'audio/flac', 'audio/aac'];
  const isCompressed = validTypes.includes(mimeType);
  console.log(`Processing audio: ${file.name}, size: ${file.size}, type: ${mimeType}, isCompressed: ${isCompressed}`);

  // OPTIMIZATION: If the file is already a compressed format and under 15MB, 
  // we can send it directly to Gemini without decoding to uncompressed WAV.
  // This preserves the full length of the song and the original frequency response,
  // while avoiding the "payload too large" errors caused by uncompressed WAV bloat.
  // Gemini's inline data limit is 20MB (approx 15MB base64).
  if (isCompressed && file.size < 15 * 1024 * 1024) {
    console.log("Using direct pass-through for compressed audio.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        console.log(`Base64 size: ${(base64.length / (1024 * 1024)).toFixed(2)}MB`);
        resolve({ base64, mimeType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // FALLBACK: If the file is too large or uncompressed (like a WAV),
  // we decode it, downmix to mono, resample, and trim it to fit within limits.
  console.log("Using fallback processing (decoding/resampling).");
  const MAX_DURATION = 3600; // 1 hour (effectively no trimming)
  const TARGET_SAMPLE_RATE = 11025; // 11kHz keeps the file size small

  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate: TARGET_SAMPLE_RATE // Try to set sample rate early
  });
  
  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (e) {
    // If decoding fails, it might be due to sample rate mismatch or format issues
    // We'll try one more time with a fresh context if possible, but usually this is a format issue
    console.error("Audio decoding failed", e);
    throw new Error("Could not decode audio file. Please try a standard MP3 under 20MB.");
  }

  // If the buffer is huge, we might hit memory limits. 
  // We'll only take the first 30 seconds.
  const duration = Math.min(audioBuffer.duration, MAX_DURATION);
  const offlineCtx = new OfflineAudioContext(
    1, // mono
    Math.floor(duration * TARGET_SAMPLE_RATE),
    TARGET_SAMPLE_RATE
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  const renderedBuffer = await offlineCtx.startRendering();
  
  // Encode to WAV
  const wavBlob = bufferToWav(renderedBuffer);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: 'audio/wav' });
    };
    reader.onerror = reject;
    reader.readAsDataURL(wavBlob);
  });
}

function bufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray);
  const channels = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  setUint32(0x46464952);                         // "RIFF"
  setUint32(length - 8);                         // file length - 8
  setUint32(0x45564157);                         // "WAVE"

  setUint32(0x20746d66);                         // "fmt " chunk
  setUint32(16);                                 // length = 16
  setUint16(1);                                  // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan);  // avg. bytes/sec
  setUint16(numOfChan * 2);                      // block-align
  setUint16(16);                                 // 16-bit (hardcoded)

  setUint32(0x61746164);                         // "data" - chunk
  setUint32(length - pos - 4);                   // chunk length

  // write interleaved data
  for(i = 0; i < buffer.numberOfChannels; i++)
    channels.push(buffer.getChannelData(i));

  while(pos < length) {
    for(i = 0; i < numOfChan; i++) {             // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true);          // write 16-bit sample
      pos += 2;
    }
    offset++;                                     // next source sample
  }

  return new Blob([bufferArray], {type: "audio/wav"});

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}
