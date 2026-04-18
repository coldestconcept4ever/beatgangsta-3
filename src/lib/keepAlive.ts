export const keepAlive = {
  audio: null as HTMLAudioElement | null,
  start: () => {
    if (typeof window === 'undefined') return;
    if (!keepAlive.audio) {
      // A tiny silent WAV file
      keepAlive.audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      keepAlive.audio.loop = true;
    }
    keepAlive.audio.play().catch(() => {
      // Ignore autoplay errors
    });
  },
  stop: () => {
    if (keepAlive.audio) {
      keepAlive.audio.pause();
    }
  }
};
