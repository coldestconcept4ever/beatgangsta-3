import { useState, useRef, useCallback } from 'react';

export const useScreenRecorder = (onComplete?: (blob: Blob) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: true
      });

      // We no longer capture microphone, user only wants TTS voiceover

      let finalStream = displayStream;

      // Try webm first, fallback to mp4 if needed (mostly for Safari support)
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('video/webm')) {
          mimeType = 'video/webm';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          mimeType = 'video/mp4';
        } else {
          mimeType = ''; // Let browser default
        }
      }

      const mediaRecorder = new MediaRecorder(finalStream, mimeType ? { mimeType } : undefined);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });
        
        if (onComplete) {
          onComplete(blob);
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
          a.download = `BeatGangsta_Showcase_${new Date().toISOString().replace(/:/g, '-')}.${extension}`;
          document.body.appendChild(a);
          a.click();
          
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);
        }

        // Stop all tracks to release camera/screen
        finalStream.getTracks().forEach(track => track.stop());
        displayStream.getTracks().forEach(track => track.stop());
      };

      // Listen for the user clicking "Stop sharing" on the browser native UI
      displayStream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      };

      mediaRecorder.start(1000); // Collect data every second to prevent memory spikes
      setIsRecording(true);

    } catch (err) {
      console.error('Error starting screen record:', err);
      const errorName = (err as any).name || (err as any).message || String(err);
      
      if (errorName === 'NotAllowedError') {
        alert('Screen recording permission was denied. Please allow permissions in your browser settings.');
      } else if (errorName === 'NotFoundError' || errorName === 'NotSupportedError' || navigator.userAgent.toLowerCase().includes('android') || navigator.userAgent.toLowerCase().includes('iphone')) {
        alert('Screen recording via the browser is typically not supported on mobile devices/browsers (like GrapheneOS/Chrome for Android) due to OS-level security constraints. Please run this showcase tool on a Desktop browser for reliable screen capturing.');
      } else {
        alert(`Could not start screen recording (Error: ${errorName}). Make sure you are using a supported desktop browser.`);
      }
      setIsRecording(false);
    }
  }, [onComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  return { isRecording, startRecording, stopRecording };
};
