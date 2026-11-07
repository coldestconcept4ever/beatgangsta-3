// 100% Client-Side Local AudioBuffer to WAV File Encoder (0 Token, 0 Internet Cost)
// Memory-optimized: Writes directly into DataView without intermediate interleaved Float32Array allocations.

const yieldToUI = () => new Promise(resolve => setTimeout(resolve, 0));

export async function audioBufferToWav(buffer: AudioBuffer, opt?: { float32?: boolean }): Promise<ArrayBuffer> {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = opt && opt.float32 ? 3 : 1; // 1 = 16-bit PCM, 3 = 32-bit Float
  const bitDepth = format === 3 ? 32 : 16;
  const length = buffer.length;

  const bytesPerSample = bitDepth / 8;
  const totalSamples = length * numChannels;
  const blockAlign = numChannels * bytesPerSample;

  const wavBuffer = new ArrayBuffer(44 + totalSamples * bytesPerSample);
  const view = new DataView(wavBuffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + totalSamples * bytesPerSample, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, totalSamples * bytesPerSample, true);

  const chan0 = buffer.getChannelData(0);
  const chan1 = numChannels > 1 ? buffer.getChannelData(1) : null;

  let offset = 44;
  if (format === 1) {
    // 16-bit PCM: write directly from channel buffers without intermediate interleaved array
    for (let i = 0; i < length; i++) {
      if (i % 50000 === 0) await yieldToUI();
      const s0 = Math.max(-1, Math.min(1, chan0[i]));
      view.setInt16(offset, s0 < 0 ? s0 * 0x8000 : s0 * 0x7fff, true);
      offset += 2;

      if (chan1) {
        const s1 = Math.max(-1, Math.min(1, chan1[i]));
        view.setInt16(offset, s1 < 0 ? s1 * 0x8000 : s1 * 0x7fff, true);
        offset += 2;
      }
    }
  } else {
    // 32-bit Float
    for (let i = 0; i < length; i++) {
      if (i % 50000 === 0) await yieldToUI();
      view.setFloat32(offset, chan0[i], true);
      offset += 4;

      if (chan1) {
        view.setFloat32(offset, chan1[i], true);
        offset += 4;
      }
    }
  }

  return wavBuffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export async function audioBufferToWavBlob(buffer: AudioBuffer): Promise<Blob> {
  const wavArrayBuffer = await audioBufferToWav(buffer);
  return new Blob([wavArrayBuffer], { type: 'audio/wav' });
}
