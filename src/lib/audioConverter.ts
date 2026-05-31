import lamejs from 'lamejs';
import BitStream from 'lamejs/src/js/BitStream.js';

// Polyfill for lamejs bug when bundled by Vite where MPEGMode is not defined
if (typeof window !== 'undefined' && !(window as any).MPEGMode) {
  const MPEGMode = function (this: any, ordinal: number) {
    this.ordinal = () => ordinal;
  } as any;
  MPEGMode.STEREO = new MPEGMode(0);
  MPEGMode.JOINT_STEREO = new MPEGMode(1);
  MPEGMode.DUAL_CHANNEL = new MPEGMode(2);
  MPEGMode.MONO = new MPEGMode(3);
  MPEGMode.NOT_SET = new MPEGMode(4);
  (window as any).MPEGMode = MPEGMode;
}

// Polyfill for Lame object required by BitStream.js internally
if (typeof window !== 'undefined' && !(window as any).Lame) {
  (window as any).Lame = { LAME_MAXMP3BUFFER: 16384 };
}

// Polyfill for BitStream object required by QuantizePVT.js internally
if (typeof window !== 'undefined' && !(window as any).BitStream) {
  (window as any).BitStream = BitStream;
}

export async function convertWavToMp3(file: File, onProgress?: (progress: number) => void): Promise<File> {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const channels = audioBuffer.numberOfChannels;
      const sampleRate = audioBuffer.sampleRate;
      const kbps = 256;

      const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps);
      const mp3Data: Int8Array[] = [];

      const sampleBlockSize = 1152; // multiple of 576
      
      const left = audioBuffer.getChannelData(0);
      const right = channels > 1 ? audioBuffer.getChannelData(1) : left;

      const leftInt16 = new Int16Array(left.length);
      const rightInt16 = new Int16Array(right.length);

      // Convert Float32 to Int16
      for (let i = 0; i < left.length; i++) {
        let s = Math.max(-1, Math.min(1, left[i]));
        leftInt16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        
        if (channels > 1) {
          s = Math.max(-1, Math.min(1, right[i]));
          rightInt16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
      }

      const totalSamples = leftInt16.length;
      let currentSample = 0;

      // Use a recursive function with setTimeout to yield to the main thread
      // This prevents the browser UI from freezing during the heavy encoding process
      function encodeChunk() {
        const chunkSize = sampleBlockSize * 100; // Process 100 blocks per tick
        const endSample = Math.min(currentSample + chunkSize, totalSamples);

        for (let i = currentSample; i < endSample; i += sampleBlockSize) {
          const leftChunk = leftInt16.subarray(i, i + sampleBlockSize);
          const rightChunk = channels > 1 ? rightInt16.subarray(i, i + sampleBlockSize) : leftChunk;
          
          const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
          if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
          }
        }

        currentSample = endSample;

        if (onProgress) {
          onProgress(currentSample / totalSamples);
        }

        if (currentSample < totalSamples) {
          // Schedule next chunk
          setTimeout(encodeChunk, 0);
        } else {
          // Finished
          const mp3buf = mp3encoder.flush();
          if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
          }

          const blob = new Blob(mp3Data, { type: 'audio/mp3' });
          const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".mp3";
          const mp3File = new File([blob], newFileName, { type: 'audio/mp3' });
          resolve(mp3File);
        }
      }

      // Start encoding
      encodeChunk();

    } catch (error) {
      reject(error);
    }
  });
}
