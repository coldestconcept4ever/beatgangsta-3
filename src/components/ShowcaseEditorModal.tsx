import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Video, Play, Pause, Download, Loader2, Plus, Trash2, Scissors, Smartphone, Monitor, Image as ImageIcon } from 'lucide-react';
import { generateVoiceover } from '../services/geminiService';
import { AppTheme } from '../types';
import { Logo } from './Logo';

interface ShowcaseEditorModalProps {
  videoBlob: Blob;
  onClose: () => void;
  theme: AppTheme;
}

interface Clip {
  id: string;
  start: number;
  end: number;
}

interface VideoEffect {
  id: string;
  type: 'magnifier';
  start: number;
  end: number;
  cx: number;
  cy: number;
  radius: number;
}

interface OverlayImage {
  id: string;
  url: string;
  x: number;
  y: number;
  scale: number;
  imgObj: HTMLImageElement;
}

const formatTime = (secs: number) => {
  if (isNaN(secs) || !isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const ShowcaseEditorModal: React.FC<ShowcaseEditorModalProps> = ({ videoBlob, onClose, theme }) => {
  // Config state
  const [voiceoverText, setVoiceoverText] = useState("Man, let me show you how BeatGangsta changes the game. Look at this heat.");
  const [adText, setAdText] = useState("BEATGANGSTA\nThe ultimate AI processing assistant.");
  const [exportFormat, setExportFormat] = useState<'16:9' | '9:16'>('16:9');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [bgAudioFile, setBgAudioFile] = useState<File | null>(null);
  const bgAudioInputRef = useRef<HTMLInputElement>(null);


  const [isDrawingMag, setIsDrawingMag] = useState(false);
  const [magStart, setMagStart] = useState<{ x: number, y: number } | null>(null);
  const [magCurrent, setMagCurrent] = useState<{ x: number, y: number } | null>(null);
  const [isMagMode, setIsMagMode] = useState(false);

  // Video and Playback State
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Timeline/Trim State
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [clips, setClips] = useState<Clip[]>([]);
  const [effects, setEffects] = useState<VideoEffect[]>([]);
  const [overlays, setOverlays] = useState<OverlayImage[]>([]);

  // Timeline dragging
  const [draggingFX, setDraggingFX] = useState<{ id: string, type: 'start' | 'end' } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const [draggingTrim, setDraggingTrim] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingTrim || !scrubberRef.current || duration === 0) return;
      const rect = scrubberRef.current.getBoundingClientRect();
      let pos = (e.clientX - rect.left) / rect.width;
      pos = Math.max(0, Math.min(1, pos));
      const newTime = pos * duration;

      if (draggingTrim === 'start') {
         const newStart = Math.min(newTime, trimEnd);
         setTrimStart(newStart);
      } else {
         const newEnd = Math.max(newTime, trimStart);
         setTrimEnd(newEnd);
      }
      
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    };
    const handlePointerUp = () => setDraggingTrim(null);
    
    if (draggingTrim) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingTrim, duration, trimStart, trimEnd]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingFX || !timelineRef.current || duration === 0) return;
      const rect = timelineRef.current.getBoundingClientRect();
      let pos = (e.clientX - rect.left) / rect.width;
      pos = Math.max(0, Math.min(1, pos));
      const newTime = pos * duration;

      setEffects(prev => prev.map(ef => {
        if (ef.id !== draggingFX.id) return ef;
        if (draggingFX.type === 'start') {
           return { ...ef, start: Math.min(newTime, ef.end - 0.1) };
        } else {
           return { ...ef, end: Math.max(newTime, ef.start + 0.1) };
        }
      }));
    };
    const handlePointerUp = () => setDraggingFX(null);
    if (draggingFX) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingFX, duration]);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addDefaultMascot = async () => {
      try {
          const { renderToStaticMarkup } = await import('react-dom/server');
          const svgString = renderToStaticMarkup(
              <div style={{ width: 400, height: 400 }}>
                  <Logo size={400} theme={theme} grillStyle="diamond" knifeStyle="standard" duragStyle="standard" chainStyle="gold" pendantStyle="gold" />
              </div>
          );
          
          const svgBlob = new Blob([
            `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
                <foreignObject width="100%" height="100%">
                    ${svgString}
                </foreignObject>
            </svg>`
          ], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          const img = new Image();
          img.onload = () => {
              setOverlays(prev => [...prev, {
                  id: Date.now().toString(),
                  url,
                  x: 0.8,
                  y: 0.1,
                  scale: 0.3,
                  imgObj: img
              }]);
          };
          img.src = url;
      } catch (e) {
          console.error("Failed to generate default mascot overlay", e);
      }
  };

  const handleImageUpload = (file: File) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
          setOverlays(prev => [...prev, {
              id: Date.now().toString(),
              url,
              x: Math.random() * 0.5 + 0.25,
              y: Math.random() * 0.5 + 0.25,
              scale: 0.5,
              imgObj: img
          }]);
      };
      img.src = url;
  };

  const removeOverlay = (id: string) => {
      setOverlays(prev => {
          const filtered = prev.filter(o => o.id !== id);
          const removed = prev.find(o => o.id === id);
          if (removed) URL.revokeObjectURL(removed.url);
          return filtered;
      });
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files) {
          Array.from(e.dataTransfer.files).forEach(file => {
              if (file.type.startsWith('image/')) {
                  handleImageUpload(file);
              }
          });
      }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const getVideoRelCoords = (e: React.PointerEvent<HTMLDivElement>, video: HTMLVideoElement) => {
    const rect = video.getBoundingClientRect();
    const videoRatio = video.videoWidth / video.videoHeight;
    const boxRatio = rect.width / rect.height;
    
    let renderW = rect.width;
    let renderH = rect.height;
    let offsetX = 0;
    let offsetY = 0;
    
    if (videoRatio > boxRatio) {
      renderH = rect.width / videoRatio;
      offsetY = (rect.height - renderH) / 2;
    } else {
      renderW = rect.height * videoRatio;
      offsetX = (rect.width - renderW) / 2;
    }
    
    const clickX = e.clientX - rect.left - offsetX;
    const clickY = e.clientY - rect.top - offsetY;
    
    return {
      x: Math.max(0, Math.min(1, clickX / renderW)),
      y: Math.max(0, Math.min(1, clickY / renderH))
    };
  };

  const handleVideoPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isMagMode) { togglePlay(); return; }
    if (!videoRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const coords = getVideoRelCoords(e, videoRef.current);
    setIsDrawingMag(true);
    setMagStart(coords);
    setMagCurrent(coords);
  };

  const handleVideoPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDrawingMag && videoRef.current) {
      setMagCurrent(getVideoRelCoords(e, videoRef.current));
    }
  };

  const handleVideoPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDrawingMag && magStart && videoRef.current) {
      const videoEl = videoRef.current;
      setIsDrawingMag(false);
      const coords = getVideoRelCoords(e, videoEl);
      const dx = coords.x - magStart.x;
      const dy = coords.y - magStart.y;
      const radius = Math.sqrt(dx*dx + dy*dy);
      // Wait, since x, y are scaled from 0-1, dx and dy are not in the same scale unit if aspect ratio is not square.
      // E.g. 1 unit in X = videoWidth, 1 unit in Y = videoHeight.
      // If we want a perfect circle, we should probably calculate the distance in pixels and then divide by width.
      const rect = videoEl.getBoundingClientRect();
      const videoRatio = videoEl.videoWidth / videoEl.videoHeight || 1;
      const boxRatio = rect.width / rect.height || 1;
      let renderW = rect.width;
      if (videoRatio <= boxRatio) { renderW = rect.height * videoRatio; }
      const dxPx = dx * renderW;
      const dyPx = dy * (renderW / videoRatio);
      const radiusPx = Math.sqrt(dxPx*dxPx + dyPx*dyPx);
      const adjustedRadius = radiusPx / renderW;

      if (adjustedRadius > 0.05) {
         const newEffect: VideoEffect = {
           id: Date.now().toString(),
           type: 'magnifier',
           start: currentTime,
           end: Math.min(currentTime + 5, duration),
           cx: magStart.x,
           cy: magStart.y,
           radius: adjustedRadius
         };
         setEffects([...effects, newEffect]);
      } else {
         setIsMagMode(false);
      }
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  useEffect(() => {
    const url = URL.createObjectURL(videoBlob);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoBlob]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      if (trimEnd === 0) setTrimEnd(dur); // Initialize to full video
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) videoRef.current.play();
      else videoRef.current.pause();
    }
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSetStart = () => {
    setTrimStart(currentTime);
    if (currentTime >= trimEnd) setTrimEnd(duration);
  };

  const handleSetEnd = () => {
    if (currentTime > trimStart) {
      setTrimEnd(currentTime);
    } else {
      alert("End time must be after the start time");
    }
  };

  const addClip = () => {
    if (trimEnd <= trimStart) return;
    setClips([...clips, { id: Date.now().toString(), start: trimStart, end: trimEnd }]);
  };

  const removeClip = (id: string) => {
    setClips(clips.filter(c => c.id !== id));
  };

  const drawOverlay = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, text: string, time: number, isColdestTheme: boolean, format: '16:9' | '9:16') => {
    if (!text) return;
    if (format === '9:16') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Darken for text readability

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Animation Logic (DBZ fly-in bounce)
    // Scale starts large, drops quickly, bounces slightly
    // Let's make it repeat every time text is present, or just animate once on start.
    // If we want it to animate constantly or pop on screen, we use `time`.
    // Let's do a fast zoom in that settles within 0.5 seconds.
    const animDuration = 0.5; // seconds
    let scale = 1;
    if (time < animDuration) {
      // Simple bounce out ease
      const t = time / animDuration;
      // overshoot scale
      scale = 3 - 2 * Math.sin(t * Math.PI) * Math.exp(-t * 5); // Just a massive drop to 1
      if (t < 0.2) scale = 3 - 10 * t; // Fast drop from 3 -> 1
      if (scale < 1) scale = 1;
    }

    const lines = text.split('\n');
    let baseLineHeight = format === '9:16' ? canvas.width * 0.12 : canvas.height * 0.08;
    
    ctx.save();
    if (format === '9:16') {
      ctx.translate(canvas.width / 2, canvas.height * 0.15); // Place text near the top for vertical video
    } else {
      ctx.translate(canvas.width / 2, canvas.height / 2);
    }
    ctx.scale(scale, scale);

    // Apply some chaotic vibrating/shake if time < 1.0 to give it that "Impact"
    if (time < 1.5) {
        const shake = Math.max(0, 1.5 - time) * 3;
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    }
    
    // DBZ signature bold italic impact font
    ctx.font = `italic 900 ${baseLineHeight}px "Impact", "Arial Black", sans-serif`;
    
    lines.forEach((line, i) => {
      // Y offset from center
      const y = ((i - (lines.length - 1) / 2) * baseLineHeight);
      
      // Giant aura/shadow
      ctx.shadowColor = isColdestTheme ? 'rgba(0, 150, 255, 0.8)' : 'rgba(255, 69, 0, 0.8)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Outer thick stroke
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = baseLineHeight * 0.2;
      ctx.strokeText(line, 0, y);
      
      // Secondary aura to make it pop (white or light blue inner outline)
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = isColdestTheme ? '#e0f2fe' : '#fef08a';
      ctx.lineWidth = baseLineHeight * 0.03;
      ctx.strokeText(line, 0, y);
      
      // Color Fill (Gradient)
      const gradient = ctx.createLinearGradient(0, y - baseLineHeight/2, 0, y + baseLineHeight/2);
      if (isColdestTheme) {
        gradient.addColorStop(0, '#e0f2fe'); // Ice white/blue
        gradient.addColorStop(0.4, '#38bdf8'); // Bright blue
        gradient.addColorStop(0.6, '#0284c7'); // Deep blue
        gradient.addColorStop(1, '#082f49'); // Almost black blue
      } else {
        gradient.addColorStop(0, '#fef08a'); // Bright yellow
        gradient.addColorStop(0.4, '#facc15'); // Gold
        gradient.addColorStop(0.6, '#ea580c'); // Orange
        gradient.addColorStop(1, '#7c2d12'); // Deep dark red
      }
      
      ctx.fillStyle = gradient; 
      ctx.fillText(line, 0, y);
    });
    
    ctx.restore();
  };

  const applyVHSGlitch = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, intensity: number) => {
    if (intensity <= 0) return;
    ctx.save();
    
    // 1. Screen Tearing (Horizontal Slices)
    const numSlices = Math.floor(Math.random() * 8 * intensity) + 2;
    for (let i = 0; i < numSlices; i++) {
        const sliceY = Math.floor(Math.random() * (canvas.height - 20));
        const sliceH = Math.floor(Math.random() * canvas.height * 0.05 + 5);
        const safeSliceH = Math.min(sliceH, canvas.height - sliceY);
        const shiftX = (Math.random() - 0.5) * 150 * intensity;
        
        if (safeSliceH > 0) {
          ctx.drawImage(canvas, 0, sliceY, canvas.width, safeSliceH, shiftX, sliceY, canvas.width, safeSliceH);
        }
    }

    // 2. Chromatic Aberration / RGB Split
    ctx.globalAlpha = intensity * 0.4;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(canvas, 25 * intensity, Math.random() * 4 - 2);
    ctx.drawImage(canvas, -25 * intensity, Math.random() * 4 - 2);
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;

    // 3. VHS Tracking Static
    for (let i = 0; i < 25; i++) {
        const y = Math.random() * canvas.height;
        const h = Math.random() * 8 + 1;
        ctx.fillStyle = Math.random() > 0.5 
            ? `rgba(255, 255, 255, ${Math.random() * 0.5 * intensity})` 
            : `rgba(0, 0, 0, ${Math.random() * 0.5 * intensity})`;
        ctx.fillRect(0, y, canvas.width, h);
    }
    ctx.restore();
  };

  const handleGenerate = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    try {
      // 1. Generate Voiceover via Gemini
      const base64Audio = await generateVoiceover(voiceoverText);
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Load audio strictly in JS mem to bind uniquely per rendering to avoid MediaElementSource conflicts
      const audioObj = new Audio(audioUrl);
      await new Promise<void>(resolve => {
        audioObj.onloadeddata = () => resolve();
        audioObj.load();
      });

      let bgAudioObj: HTMLAudioElement | null = null;
      let bgAudioUrl: string | null = null;
      let bgGainNode: GainNode | null = null;
      let ttsAnalyser: AnalyserNode | null = null;
      let ttsDataArray: Uint8Array | null = null;

      if (bgAudioFile) {
        bgAudioUrl = URL.createObjectURL(bgAudioFile);
        bgAudioObj = new Audio(bgAudioUrl);
        bgAudioObj.loop = true;
        await new Promise<void>(resolve => {
          bgAudioObj!.onloadeddata = () => resolve();
          bgAudioObj!.load();
        });
      }

      // 2. Prepare canvas for video recording
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");

      const video = videoRef.current;
      
      // Set canvas to video dimensions
      if (exportFormat === '9:16') {
        canvas.width = 1080;
        canvas.height = 1920;
      } else {
        canvas.width = video.videoWidth || 1920;
        canvas.height = video.videoHeight || 1080;
      }

      // 3. Setup Streams to record (30 fps)
      const canvasStream = canvas.captureStream(30); 
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dest = audioContext.createMediaStreamDestination();
      
      // Route TTS audio & Setup Auto-Ducking
      try {
          const ttsSource = audioContext.createMediaElementSource(audioObj);
          ttsAnalyser = audioContext.createAnalyser();
          ttsAnalyser.fftSize = 256;
          ttsDataArray = new Uint8Array(ttsAnalyser.frequencyBinCount);
          
          ttsSource.connect(ttsAnalyser);
          ttsAnalyser.connect(dest);
          ttsAnalyser.connect(audioContext.destination); // hear it during render

          if (bgAudioObj) {
              const bgSource = audioContext.createMediaElementSource(bgAudioObj);
              bgGainNode = audioContext.createGain();
              bgGainNode.gain.value = 1.0;
              bgSource.connect(bgGainNode);
              bgGainNode.connect(dest);
              bgGainNode.connect(audioContext.destination);
          }
      } catch (e) {
          console.warn("Could not route audio", e);
      }

      const combinedTracks = [...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()];
      const combinedStream = new MediaStream(combinedTracks);

      const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp9,opus' });
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: 'video/webm' });
        const finalUrl = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = finalUrl;
        a.download = `Showcase_ZRo_${Date.now()}.webm`;
        a.click();
        setIsProcessing(false);
        URL.revokeObjectURL(audioUrl);
        audioObj.pause();
        if (bgAudioUrl) URL.revokeObjectURL(bgAudioUrl);
        if (bgAudioObj) bgAudioObj.pause();
      };

      // 4. Render Logic (TikTok timeline style sequence)
      const renderClips = clips.length > 0 ? clips : [{ id: '1', start: trimStart, end: trimEnd }];
      let currentClipIdx = 0;
      let isSeeking = false;
      let rendering = true;

      recorder.start(100);
      video.currentTime = renderClips[0].start;
      audioObj.currentTime = 0;

      // Wait for playhead to align
      await new Promise<void>(resolve => {
        if (video.readyState >= 3) return resolve();
        const onSeeked = () => { resolve(); video.removeEventListener('seeked', onSeeked); };
        video.addEventListener('seeked', onSeeked);
      });

      await video.play().catch(console.error);
      await audioObj.play().catch(console.error);
      if (bgAudioObj) await bgAudioObj.play().catch(console.error);

      const drawLoop = () => {
        if (!rendering || !ctx) return;
        
        // Auto-Ducking Magic
        if (ttsAnalyser && ttsDataArray && bgGainNode) {
            ttsAnalyser.getByteTimeDomainData(ttsDataArray);
            let sum = 0;
            for (let i = 0; i < ttsDataArray.length; i++) {
                const x = (ttsDataArray[i] - 128) / 128;
                sum += x * x;
            }
            const rms = Math.sqrt(sum / ttsDataArray.length);
            const isTalking = rms > 0.015;
            const targetGain = isTalking ? 0.15 : 1.0;
            const currentGain = bgGainNode.gain.value;
            const smoothing = isTalking ? 0.3 : 0.02; // Quick duck, slow swell
            bgGainNode.gain.value = currentGain + (targetGain - currentGain) * smoothing;
        }

        const isColdestTheme = theme === 'coldest';
        
        if (!isSeeking && !video.paused && !video.ended) {
          // Calculate how long this specific clip has been playing for animation
          const clipObj = renderClips[currentClipIdx];
          const localTime = Math.max(0, video.currentTime - clipObj.start);
          
          let fitX = 0, fitY = 0, fitScale = 1;
          if (exportFormat === '9:16') {
             // 1. Draw heavy dynamically blurred background
             ctx.save();
             ctx.filter = 'blur(40px) brightness(0.3)';
             const bgScale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
             const bgW = video.videoWidth * bgScale;
             const bgH = video.videoHeight * bgScale;
             ctx.drawImage(video, (canvas.width - bgW) / 2, (canvas.height - bgH) / 2, bgW, bgH);
             ctx.restore();

             // 2. Draw crisp centered foreground video
             fitScale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
             const fitW = video.videoWidth * fitScale;
             const fitH = video.videoHeight * fitScale;
             fitX = (canvas.width - fitW) / 2;
             fitY = (canvas.height - fitH) / 2;

             ctx.save();
             ctx.beginPath();
             if (ctx.roundRect) ctx.roundRect(fitX, fitY, fitW, fitH, 20);
             ctx.clip();
             ctx.drawImage(video, fitX, fitY, fitW, fitH);
             ctx.restore();
             
             // 3. Draw sleek border around the 16:9 video
             if (ctx.roundRect) {
               ctx.strokeStyle = 'rgba(255,255,255,0.1)';
               ctx.lineWidth = 4;
               ctx.beginPath();
               ctx.roundRect(fitX, fitY, fitW, fitH, 20);
               ctx.stroke();
             }
          } else {
             // Normal fullscreen wide video
             fitScale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
             const fitW = video.videoWidth * fitScale;
             const fitH = video.videoHeight * fitScale;
             fitX = (canvas.width - fitW) / 2;
             fitY = (canvas.height - fitH) / 2;
             ctx.drawImage(video, fitX, fitY, fitW, fitH); // Changed to preserve aspect ratio
          }

          const activeMag = effects.find(e => e.type === 'magnifier' && video.currentTime >= e.start && video.currentTime <= e.end);
          if (activeMag) {
              const srcX = activeMag.cx * video.videoWidth;
              const srcY = activeMag.cy * video.videoHeight;
              const srcR = activeMag.radius * video.videoWidth;
              const magFactor = 2; // 2x magnification
              
              const destCx = fitX + activeMag.cx * video.videoWidth * fitScale;
              const destCy = fitY + activeMag.cy * video.videoHeight * fitScale;
              const destR = srcR * fitScale * magFactor;
              
              ctx.save();
              ctx.beginPath();
              ctx.arc(destCx, destCy, destR, 0, Math.PI * 2);
              
              // Drop shadow for magnifier
              ctx.shadowColor = 'rgba(0,0,0,0.5)';
              ctx.shadowBlur = 20;
              ctx.fill(); // fill to capture shadow
              ctx.shadowColor = 'transparent'; // reset
              
              ctx.clip(); 
              
              const targetSrcX = srcX - srcR;
              const targetSrcY = srcY - srcR;
              const targetSrcW = srcR * 2;
              const targetSrcH = srcR * 2;
              
              const targetDestX = destCx - destR;
              const targetDestY = destCy - destR;
              const targetDestW = destR * 2;
              const targetDestH = destR * 2;
              
              ctx.drawImage(video, targetSrcX, targetSrcY, targetSrcW, targetSrcH, targetDestX, targetDestY, targetDestW, targetDestH);
              
              // Magnifier border
              ctx.beginPath();
              ctx.arc(destCx, destCy, destR, 0, Math.PI * 2);
              ctx.lineWidth = 6 * fitScale;
              ctx.strokeStyle = '#fff';
              ctx.stroke();
              ctx.restore();
          }
          
          // Draw the cinematic DBZ impact text
          drawOverlay(ctx, canvas, adText, localTime, isColdestTheme, exportFormat);
          
          // Calculate global sequence time to allow fading out at the very end
          let sequenceTimeCurrent = 0;
          let sequenceTimeTotal = 0;
          for (let i = 0; i < renderClips.length; i++) {
              const dur = renderClips[i].end - renderClips[i].start;
              sequenceTimeTotal += dur;
              if (i < currentClipIdx) {
                  sequenceTimeCurrent += dur;
              } else if (i === currentClipIdx) {
                  sequenceTimeCurrent += localTime;
              }
          }
          
          // Calculate fade Alpha based on last 1.5 seconds
          const fadeDuration = 1.5; // 1.5 seconds fade out
          const timeLeftInSequence = sequenceTimeTotal - sequenceTimeCurrent;
          let overlayAlpha = 1.0;
          if (timeLeftInSequence < fadeDuration) {
              overlayAlpha = Math.max(0, timeLeftInSequence / fadeDuration);
          }

          // Draw Image Overlays/Stickers
          overlays.forEach(overlay => {
             if (overlay.imgObj) {
                 ctx.save();
                 ctx.globalAlpha = overlayAlpha;
                 const targetW = overlay.imgObj.width * overlay.scale;
                 const targetH = overlay.imgObj.height * overlay.scale;
                 const px = overlay.x * canvas.width - targetW / 2;
                 const py = overlay.y * canvas.height - targetH / 2;
                 ctx.drawImage(overlay.imgObj, px, py, targetW, targetH);
                 ctx.restore();
             }
          });
          
          // Trigger precise VHS glitch transition for the first 0.4s of a cut
          if (currentClipIdx > 0 && localTime <= 0.4) {
              const intensity = 1 - (localTime / 0.4);
              applyVHSGlitch(ctx, canvas, intensity);
          }
          
          // Check if we hit the end of the current clip
          if (video.currentTime >= clipObj.end) {
            currentClipIdx++;
            if (currentClipIdx >= renderClips.length) {
              // Timeline finished
              rendering = false;
              recorder.stop();
              audioObj.pause();
              if (bgAudioObj) bgAudioObj.pause();
              video.pause();
              video.currentTime = renderClips[0].start; // Reset UX target
              return;
            } else {
              // Jump to next clip smoothly
              isSeeking = true;
              video.pause();
              video.currentTime = renderClips[currentClipIdx].start;
              
              const onSeeked = () => {
                isSeeking = false;
                video.play().catch(console.error);
                video.removeEventListener('seeked', onSeeked);
              };
              video.addEventListener('seeked', onSeeked);
            }
          }
        } else if (isSeeking || video.paused || video.ended) {
          // Freeze frame during seek to prevent black flashing
          if (exportFormat === '9:16') {
             ctx.save();
             ctx.filter = 'blur(40px) brightness(0.3)';
             const bgScale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
             const bgW = video.videoWidth * bgScale;
             const bgH = video.videoHeight * bgScale;
             ctx.drawImage(video, (canvas.width - bgW) / 2, (canvas.height - bgH) / 2, bgW, bgH);
             ctx.restore();

             const fitScale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
             const fitW = video.videoWidth * fitScale;
             const fitH = video.videoHeight * fitScale;
             const fitX = (canvas.width - fitW) / 2;
             const fitY = (canvas.height - fitH) / 2;
             
             ctx.save();
             ctx.beginPath();
             if (ctx.roundRect) ctx.roundRect(fitX, fitY, fitW, fitH, 20);
             ctx.clip();
             ctx.drawImage(video, fitX, fitY, fitW, fitH);
             ctx.restore();
          } else {
             ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          }
          // If seeking/paused, just show text statically or at time 1.0
          drawOverlay(ctx, canvas, adText, 1.0, isColdestTheme, exportFormat);
          
          overlays.forEach(overlay => {
             if (overlay.imgObj) {
                 ctx.save();
                 // If rendering is paused or seeking, we could also compute sequenceTime but typically we are paused.
                 // We'll just draw them solid if seeking or paused for preview
                 const targetW = overlay.imgObj.width * overlay.scale;
                 const targetH = overlay.imgObj.height * overlay.scale;
                 const px = overlay.x * canvas.width - targetW / 2;
                 const py = overlay.y * canvas.height - targetH / 2;
                 ctx.drawImage(overlay.imgObj, px, py, targetW, targetH);
                 ctx.restore();
             }
          });
          
          // Full glitch static while video engine prepares next clip in memory
          if (isSeeking && currentClipIdx > 0) {
              applyVHSGlitch(ctx, canvas, 0.8 + Math.random() * 0.2);
          }
        }
        
        if (rendering) {
          requestAnimationFrame(drawLoop);
        }
      };

      drawLoop();

    } catch (e) {
      console.error(e);
      alert("Failed to process showcase video.");
      setIsProcessing(false);
    }
  };

  const themeClasses = theme === 'coldest' ? 'bg-[#0f172a] border-[#1e293b]' : 
                       theme === 'chef-mode' ? 'bg-[#2a1309] border-[#432314]' : 
                       'bg-black border-yellow-500/20';
                       
  const btnClass = theme === 'coldest' ? 'bg-indigo-600 hover:bg-indigo-500' :
                   theme === 'chef-mode' ? 'bg-orange-600 hover:bg-orange-500' :
                   'bg-yellow-500 hover:bg-yellow-400 text-black';
                   
  const highlightClass = theme === 'coldest' ? 'bg-indigo-500' :
                         theme === 'chef-mode' ? 'bg-orange-500' :
                         'bg-yellow-500';

  return (
    <div className="fixed inset-0 z-[100] flex bg-black p-0 sm:p-0 text-white">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={!isProcessing ? onClose : undefined} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full h-full ${themeClasses} overflow-hidden flex flex-col`}
      >
        <div className="p-4 sm:p-5 border-b border-current/10 flex items-center justify-between z-10 shrink-0 bg-black/40">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <Video className="w-6 h-6" />
              TikTok Studio Editor
            </h2>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">Timeline Trimming & Custom Compositing</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMagMode(!isMagMode)}
              className={`px-4 py-2 rounded font-black uppercase tracking-widest text-[10px] sm:text-xs transition-colors flex items-center gap-2 border ${isMagMode ? `${btnClass} border-transparent text-white` : 'border-white/20 bg-black/20 hover:bg-white/10'}`}
            >
              🔍 Draw Magnifier {isMagMode ? '(Active)' : ''}
            </button>
            <button 
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 rounded-full hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Main Area: Video + Timeline Container */}
          <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 pb-2 sm:pb-4 gap-4 overflow-hidden border-r border-current/10">
            
            {/* Left Box: Video Editor */}
            <div className="flex-1 relative bg-black/50 rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-center items-center shadow-2xl group min-h-0">
              {/* Status Badge */}
              <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded backdrop-blur-md">Raw Recording</span>
                {isMagMode && (
                   <span className={`text-[10px] animate-pulse font-bold uppercase tracking-widest px-2 py-1 rounded backdrop-blur-md ${highlightClass} text-black shadow-lg`}>
                     Click & Drag to Zoom Area
                   </span>
                )}
              </div>
              
              {/* Video Wrap */}
              <div className="w-full h-full relative" 
                  onPointerDown={handleVideoPointerDown}
                  onPointerMove={handleVideoPointerMove}
                  onPointerUp={handleVideoPointerUp}
                  onPointerLeave={handleVideoPointerUp}
              >
                 <video 
                  ref={videoRef} 
                  src={videoUrl} 
                  className={`w-full h-full object-contain ${isMagMode ? 'cursor-crosshair' : 'cursor-pointer'}`}
                  playsInline
                  crossOrigin="anonymous"
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                 />

                 {/* Drawing feedback for magnifier */}
                 {isDrawingMag && magStart && magCurrent && (
                   <div 
                     className={`absolute border-2 border-white rounded-full bg-white/10 pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.5)]`}
                     style={{
                        left: `${Math.min(magStart.x, magCurrent.x)*100}%`,
                        top: `${Math.min(magStart.y, magCurrent.y)*100}%`,
                        width: `${Math.abs(magCurrent.x - magStart.x)*100}%`,
                        height: `${Math.abs(magCurrent.y - magStart.y)*100}%`,
                     }}
                   />
                 )}
                 {(() => {
                   const activePreviewMag = effects.find(e => e.type === 'magnifier' && currentTime >= e.start && currentTime <= e.end);
                   return activePreviewMag && !isDrawingMag ? (
                     <div 
                       className={`absolute border-2 ${highlightClass.replace('bg-', 'border-')} rounded-full bg-white/5 pointer-events-none shadow-lg transition-all`}
                       style={{
                          left: `${(activePreviewMag.cx - activePreviewMag.radius)*100}%`,
                          top: `${(activePreviewMag.cy - activePreviewMag.radius)*100}%`,
                          width: `${activePreviewMag.radius*200}%`,
                          height: `${activePreviewMag.radius*200}%`,
                       }}
                     />
                   ) : null;
                 })()}
              </div>
              
              {/* Custom Controls Overlay */}
              <div className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-300 ${isPlaying && !isMagMode ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                
                {/* Scrubber */}
                <div ref={scrubberRef} className="max-w-4xl mx-auto w-full relative h-4 bg-white/10 rounded-full cursor-pointer flex items-center group/scrubber" onPointerDown={!isMagMode ? handleScrubberClick : undefined}>
                  <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover/scrubber:opacity-100 transition-opacity pointer-events-none" />
                  
                  {/* Trim Highlight */}
                  <div 
                    className={`absolute h-full ${highlightClass}/40 border-y border-white/50 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] pointer-events-none`} 
                    style={{ 
                      left: `${(trimStart / (duration||1)) * 100}%`, 
                      width: `${((trimEnd - trimStart) / (duration||1)) * 100}%` 
                    }} 
                  >
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-4 h-6 cursor-ew-resize bg-white rounded shadow-lg pointer-events-auto flex items-center justify-center hover:scale-110 transition-transform"
                          onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setDraggingTrim('start'); }}>
                        <div className="w-0.5 h-3 bg-black/40 rounded-full" />
                     </div>
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 w-4 h-6 cursor-ew-resize bg-white rounded shadow-lg pointer-events-auto flex items-center justify-center hover:scale-110 transition-transform"
                          onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setDraggingTrim('end'); }}>
                        <div className="w-0.5 h-3 bg-black/40 rounded-full" />
                     </div>
                  </div>
                  
                  {/* Playhead */}
                  <div 
                    className="absolute h-6 w-2 bg-white rounded shadow-[0_0_10px_rgba(255,255,255,0.8)] -ml-1 flex items-center justify-center pointer-events-none"
                    style={{ left: `${(currentTime / (duration||1)) * 100}%` }}
                  >
                    <div className="h-4 w-px bg-black opacity-30" />
                  </div>
                </div>

                {/* Playback & Trim Controls */}
                <div className="max-w-4xl mx-auto mt-4 px-2 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} disabled={isMagMode && isDrawingMag} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg disabled:opacity-50">
                      {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                    </button>
                    <span className="text-sm font-mono font-bold tracking-wide opacity-80 bg-black/40 px-3 py-1 rounded">
                      {formatTime(currentTime)} <span className="opacity-40">/</span> {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                     <button onClick={handleSetStart} disabled={isMagMode} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center gap-2">
                        <Scissors size={14} /> Set Start
                     </button>
                     <button onClick={handleSetEnd} disabled={isMagMode} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center gap-2">
                        Set End <Scissors size={14} className="scale-x-[-1]" />
                     </button>
                     <div className="w-px h-6 bg-white/10 mx-1"></div>
                     <button onClick={addClip} disabled={isMagMode} className={`px-5 py-2 ${btnClass} text-white font-black uppercase tracking-widest rounded transition-all flex items-center gap-2 shadow-lg`}>
                        <Plus size={16} /> Add Clip
                     </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Area */}
            <div className="h-[220px] shrink-0 bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col shadow-inner relative overflow-hidden gap-4">
              
              {/* FX Track */}
              <div className="flex flex-col flex-shrink-0">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 shrink-0">
                  <span>Effects Timeline ({effects.length})</span>
                </div>
                <div 
                   ref={timelineRef} 
                   className="h-10 bg-white/5 rounded-lg border border-white/10 relative overflow-hidden flex items-center"
                >
                  <div 
                     className="absolute top-0 bottom-0 w-px bg-white/50 z-20 pointer-events-none" 
                     style={{ left: `${(currentTime / (duration||1))*100}%` }}
                  />
                  {effects.map(effect => (
                    <div 
                      key={effect.id}
                      className={`absolute h-8 top-1 ${highlightClass} opacity-80 border-2 border-white/50 rounded flex items-center px-2 group overflow-hidden`}
                      style={{
                        left: `${(effect.start / (duration||1))*100}%`,
                        width: `${((effect.end - effect.start) / (duration||1))*100}%`
                      }}
                    >
                      <span className="text-[10px] font-black text-black z-10 pointer-events-none truncate uppercase">{effect.type}</span>
                      
                      <div className="absolute left-0 top-0 bottom-0 w-4 cursor-ew-resize hover:bg-white/50 z-20" 
                           onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setDraggingFX({ id: effect.id, type: 'start' }); }} />
                      <div className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize hover:bg-white/50 z-20" 
                           onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); setDraggingFX({ id: effect.id, type: 'end' }); }} />
                           
                      <button 
                         onClick={() => setEffects(efs => efs.filter(e => e.id !== effect.id))}
                         className="absolute inset-x-0 inset-y-0 opacity-0 group-hover:opacity-100 bg-red-500/80 flex items-center justify-center transition-opacity"
                      >
                         <Trash2 size={12} className="text-white" />
                      </button>
                    </div>
                  ))}
                  {effects.length === 0 && <span className="text-[10px] text-white/30 uppercase tracking-widest w-full text-center">No Effects</span>}
                </div>
              </div>

              {/* Export Sequence */}
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60 mb-3 shrink-0">
                  <span>Export Sequence ({clips.length})</span>
                </div>
                
                <div className="flex-1 flex overflow-x-auto items-center custom-scrollbar h-12 bg-white/5 rounded-lg border border-white/10 p-1">
                  {clips.length === 0 ? (
                    <div className="w-full flex items-center justify-center opacity-40">
                      <span className="text-[10px] font-bold uppercase tracking-widest">No Clips Added</span>
                    </div>
                  ) : (
                    clips.map((clip, i) => {
                       const durationRaw = Math.max(0.1, clip.end - clip.start);
                       const widthPx = Math.max(80, durationRaw * 20); // 20px per second, min 80px
                       
                       return (
                        <div key={clip.id} className="relative group overflow-hidden border border-white/20 bg-indigo-500/80 h-full flex flex-col justify-center items-center shadow-lg hover:border-white/50 transition-colors flex-shrink-0" style={{ width: widthPx, marginLeft: i === 0 ? 0 : '-1px' }}>
                          <span className="text-[8px] font-black text-white/70 tracking-widest absolute top-1 left-1">CLIP {i + 1}</span>
                          <span className={`text-[10px] font-mono font-bold text-white z-10`}>
                            {formatTime(clip.start)} <span className="opacity-50 mx-0.5">&rarr;</span> {formatTime(clip.end)}
                          </span>
                          <button 
                            onClick={() => removeClip(clip.id)} 
                            className="absolute inset-y-0 right-0 w-8 bg-black/50 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm"
                          >
                            <Trash2 size={12} className="text-white" />
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: AI Gen Constraints + Overlays */}
          <div className="w-80 md:w-96 xl:w-[400px] flex flex-col p-4 sm:p-6 overflow-y-auto custom-scrollbar shrink-0 bg-black/20 gap-8">
            
            {/* Overlays Section */}
            <div className="flex flex-col">
              <h3 className="font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                Image Overlays
              </h3>
              <div 
                className="bg-black/40 rounded-2xl p-4 border border-white/5 transition-colors relative shadow-inner"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest opacity-60 mb-3">
                  <span>Count ({overlays.length})</span>
                  <span>Drag PNGs Here</span>
                </div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files) {
                      Array.from(e.target.files).forEach(file => handleImageUpload(file));
                    }
                  }}
                />

                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={addDefaultMascot}
                    className="aspect-square flex flex-col items-center justify-center rounded-xl border border-dashed border-current/30 hover:bg-white/5 transition-colors"
                  >
                    <ImageIcon size={20} className="opacity-50 mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 text-center leading-tight">Mascot</span>
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center rounded-xl border border-dashed border-current/30 hover:bg-white/5 transition-colors"
                  >
                    <Plus size={20} className="opacity-50 mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 text-center leading-tight">Upload</span>
                  </button>

                  {overlays.map((overlay, i) => (
                    <div key={overlay.id} className="aspect-square relative group rounded-xl overflow-hidden border border-white/10 bg-black/80 flex flex-col justify-center items-center shadow-lg hover:border-white/30 transition-colors">
                      <img src={overlay.url} alt="Overlay" className="max-w-[80%] max-h-[80%] object-contain" />
                      
                      <button 
                        onClick={() => removeOverlay(overlay.id)}
                        className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-all text-white shadow-lg"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Settings Section */}
            <div className="flex flex-col flex-1">
              <h3 className="font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${highlightClass} animate-pulse`} />
                AI Synthesis
              </h3>

              <div className="bg-black/40 rounded-2xl p-4 border border-white/5 shadow-inner space-y-6">
                <div>
                  <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest mb-3 opacity-80">
                    <span>Export Format</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setExportFormat('16:9')}
                      className={`flex flex-col items-center justify-center py-4 rounded-xl border transition-all ${exportFormat === '16:9' ? `border-current bg-white/10 ${highlightClass}/20 shadow-lg scale-105` : 'border-white/5 bg-black/40 hover:bg-white/5'}`}
                    >
                      <Monitor size={20} className="mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">16:9 HD</span>
                    </button>
                    <button 
                       onClick={() => setExportFormat('9:16')}
                       className={`flex flex-col items-center justify-center py-4 rounded-xl border transition-all ${exportFormat === '9:16' ? `border-current bg-white/10 ${highlightClass}/20 shadow-lg scale-105` : 'border-white/5 bg-black/40 hover:bg-white/5'}`}
                    >
                      <Smartphone size={20} className="mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">9:16 Vertical</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest mb-2 opacity-80">
                    <span>TTS Voiceover</span>
                  </label>
                  <textarea
                    value={voiceoverText}
                    onChange={e => setVoiceoverText(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-white/30 transition-colors h-20 resize-none custom-scrollbar"
                    placeholder="Auto-generated speech text..."
                    disabled={isProcessing}
                  />
                </div>
                
                <div>
                  <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest mb-2 opacity-80">
                    <span>Overlay Title Text</span>
                  </label>
                  <textarea
                    value={adText}
                    onChange={e => setAdText(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-white/30 transition-colors h-20 resize-none custom-scrollbar"
                    placeholder="Huge cinematic text..."
                    disabled={isProcessing}
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest mb-2 opacity-80">
                    <span>Background Audio</span>
                  </label>
                  <input 
                    type="file" 
                    accept="audio/mpeg, audio/mp3, audio/wav" 
                    className="hidden" 
                    ref={bgAudioInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBgAudioFile(e.target.files[0]);
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => bgAudioInputRef.current?.click()}
                    className="w-full bg-black/60 border border-white/10 hover:border-white/30 rounded-xl p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {bgAudioFile ? (
                      <span className="text-green-400 font-bold truncate text-xs">✓ {bgAudioFile.name}</span>
                    ) : (
                      <span className="opacity-70 text-xs">Choose MP3/WAV...</span>
                    )}
                  </button>
                  {bgAudioFile && (
                     <div className="flex justify-between items-center mt-2">
                         <span className="text-[9px] opacity-60 uppercase tracking-widest font-bold text-yellow-500">Auto-Ducking On</span>
                         <button type="button" onClick={() => setBgAudioFile(null)} className="text-[9px] text-red-500 uppercase tracking-widest hover:underline">Remove</button>
                     </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing}
                  className={`w-full ${btnClass} text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-opacity disabled:opacity-50 shadow-2xl relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                      <span className="relative z-10">Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Process Video</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Hidden elements for processing */}
        <canvas ref={canvasRef} className="hidden" />

      </motion.div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};
