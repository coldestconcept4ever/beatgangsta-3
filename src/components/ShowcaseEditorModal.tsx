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

  // Video and Playback State
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Timeline/Trim State
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [clips, setClips] = useState<Clip[]>([]);
  const [overlays, setOverlays] = useState<OverlayImage[]>([]);
  
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
             ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={!isProcessing ? onClose : undefined} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full max-w-6xl max-h-full ${themeClasses} border rounded-3xl shadow-2xl overflow-hidden flex flex-col`}
      >
        <div className="p-4 sm:p-5 border-b border-current/10 flex items-center justify-between z-10 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <Video className="w-6 h-6" />
              TikTok Studio Editor
            </h2>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">Timeline Trimming & Custom Compositing</p>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-full hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            
            {/* Left Column: Video Editor */}
            <div className="flex-1 flex flex-col gap-4">
              
              <div className="relative bg-black rounded-2xl overflow-hidden border border-current/10 flex flex-col justify-center items-center h-[50vh] lg:h-[60vh] group">
                {/* Status Badge */}
                <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none flex">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-md">Raw Recording Preview</span>
                </div>
                
                {/* Video */}
                <video 
                  ref={videoRef} 
                  src={videoUrl} 
                  className="w-full h-full object-contain cursor-pointer"
                  playsInline
                  crossOrigin="anonymous"
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onClick={togglePlay}
                />
                
                {/* Custom Controls Overlay */}
                <div className={`absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                  
                  {/* Scrubber */}
                  <div className="w-full relative h-4 bg-white/10 rounded-full cursor-pointer flex items-center group/scrubber" onClick={handleScrubberClick}>
                    {/* Hover Track */}
                    <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover/scrubber:opacity-100 transition-opacity" />
                    
                    {/* Trim Highlight */}
                    <div 
                      className={`absolute h-full ${highlightClass}/40 border-l border-r border-white/50`} 
                      style={{ 
                        left: `${(trimStart / duration) * 100}%`, 
                        width: `${((trimEnd - trimStart) / duration) * 100}%` 
                      }} 
                    />
                    
                    {/* Playhead */}
                    <div 
                      className="absolute h-6 w-2 bg-white rounded shadow-lg -ml-1 flex items-center justify-center pointer-events-none"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                    >
                      <div className="h-4 w-px bg-black opacity-30" />
                    </div>
                  </div>

                  {/* Playback & Trim Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={togglePlay} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                        {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
                      </button>
                      <span className="text-xs font-mono font-medium tracking-wide">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                       <button onClick={handleSetStart} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center gap-1">
                          <Scissors size={14} /> Set Start
                       </button>
                       <button onClick={handleSetEnd} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center gap-1">
                          Set End <Scissors size={14} className="scale-x-[-1]" />
                       </button>
                       <button onClick={addClip} className={`px-4 py-1.5 ${highlightClass} text-black hover:brightness-110 text-xs font-black uppercase tracking-widest rounded transition-all flex items-center gap-2 ml-2`}>
                          <Plus size={16} /> Add Clip
                       </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Clips */}
              <div className="bg-black/30 rounded-2xl p-4 border border-current/5">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">
                  <span>Export Timeline ({clips.length})</span>
                  {clips.length > 0 && <span>Render Sequence &rarr;</span>}
                </div>
                
                <div className="h-20 flex gap-3 overflow-x-auto items-center pb-2 custom-scrollbar">
                  {clips.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
                      <span className="text-xs font-bold uppercase tracking-widest">No Clips Added</span>
                      <span className="text-[10px] mt-1">The current highlighted section ({formatTime(trimStart)} - {formatTime(trimEnd)}) will be exported.</span>
                    </div>
                  ) : (
                    clips.map((clip, i) => (
                      <div key={clip.id} className="flex-shrink-0 relative group rounded-xl overflow-hidden border border-white/10 bg-white/5 w-40 h-full flex flex-col justify-center items-center shadow-lg hover:border-white/30 transition-colors">
                        <span className="text-[10px] font-black text-white/50 tracking-widest mb-1">CLIP {i + 1}</span>
                        <span className={`text-sm font-mono font-bold ${theme === 'coldest' ? 'text-indigo-400' : 'text-yellow-400'}`}>
                          {formatTime(clip.start)} <span className="opacity-50 font-sans font-normal mx-1">&rarr;</span> {formatTime(clip.end)}
                        </span>
                        <button 
                          onClick={() => removeClip(clip.id)} 
                          className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 hover:bg-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 size={12} className="text-white" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Overlays / Stickers */}
              <div 
                className="bg-black/30 rounded-2xl p-4 border border-current/5 transition-colors relative"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">
                  <span>Image Overlays ({overlays.length})</span>
                  <span>Drag & Drop PNGs Here</span>
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

                <div className="flex gap-3 overflow-x-auto items-center pb-2 custom-scrollbar min-h-[5rem]">
                  <button 
                    onClick={addDefaultMascot}
                    className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-xl border border-dashed border-current/30 hover:bg-white/5 transition-colors"
                  >
                    <ImageIcon size={20} className="opacity-50 mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 text-center leading-tight">Add<br/>Mascot</span>
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-xl border border-dashed border-current/30 hover:bg-white/5 transition-colors"
                  >
                    <Plus size={20} className="opacity-50 mb-1" />
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-70 text-center leading-tight">Upload<br/>Image</span>
                  </button>

                  {overlays.map((overlay, i) => (
                    <div key={overlay.id} className="flex-shrink-0 relative group rounded-xl overflow-hidden border border-white/10 bg-black/50 w-20 h-20 flex flex-col justify-center items-center shadow-lg hover:border-white/30 transition-colors">
                      <img src={overlay.url} alt="Overlay" className="max-w-[80%] max-h-[80%] object-contain" />
                      
                      <button 
                        onClick={() => removeOverlay(overlay.id)}
                        className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-all text-white"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden elements for processing */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Right Column: AI Gen Constraints */}
            <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-6 shrink-0">
              <div className="bg-black/20 rounded-2xl p-5 border border-current/5 h-full flex flex-col">
                <h3 className="font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${highlightClass} animate-pulse`} />
                  AI Synthesis
                </h3>
  
                <div className="space-y-6 flex-1">
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-3 opacity-80">
                      <span>Generate For Platform</span>
                      <span className="opacity-40 text-[9px]">CANVAS</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button 
                        onClick={() => setExportFormat('16:9')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border ${exportFormat === '16:9' ? `border-current bg-white/10 ${highlightClass}/20` : 'border-white/5 bg-black/20 hover:bg-white/5'} transition-all`}
                      >
                        <Monitor size={24} className="mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">Desktop<br/>(16:9)</span>
                      </button>
                      <button 
                         onClick={() => setExportFormat('9:16')}
                         className={`flex flex-col items-center justify-center p-3 rounded-xl border ${exportFormat === '9:16' ? `border-current bg-white/10 ${highlightClass}/20` : 'border-white/5 bg-black/20 hover:bg-white/5'} transition-all`}
                      >
                        <Smartphone size={24} className="mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">TikTok/Reels<br/>(9:16)</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-2 opacity-80">
                          <span>Z-Ro Voiceover</span>
                          <span className="opacity-40 text-[9px]">TTS</span>
                        </label>
                        <textarea
                          value={voiceoverText}
                          onChange={e => setVoiceoverText(e.target.value)}
                          className="w-full bg-black/40 border border-current/10 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-current/30 transition-colors h-24 resize-none custom-scrollbar"
                          placeholder="What do you want the voice to say over the video?"
                          disabled={isProcessing}
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-2 opacity-80">
                          <span>Cinematic Overlay</span>
                          <span className="opacity-40 text-[9px]">AD COPY</span>
                        </label>
                        <textarea
                          value={adText}
                          onChange={e => setAdText(e.target.value)}
                          className="w-full bg-black/40 border border-current/10 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-current/30 transition-colors h-24 resize-none custom-scrollbar"
                          placeholder="e.g. BEATGANGSTA\nThe ultimate AI processing assistant."
                          disabled={isProcessing}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-2 opacity-80">
                        <span>Background Beat</span>
                        <span className="opacity-40 text-[9px]">AUTO-DUCKING</span>
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
                        className="w-full bg-black/40 border border-current/10 hover:border-current/30 rounded-xl p-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {bgAudioFile ? (
                          <span className="text-green-400 font-bold truncate">✓ {bgAudioFile.name} (Ready)</span>
                        ) : (
                          <span className="opacity-70">Upload Beat (MP3/WAV)...</span>
                        )}
                      </button>
                      {bgAudioFile && (
                         <div className="flex justify-between items-center mt-2">
                             <span className="text-[9px] opacity-60 uppercase tracking-widest font-bold text-yellow-500">Auto-Ducking Active</span>
                             <button type="button" onClick={() => setBgAudioFile(null)} className="text-[10px] text-red-500 uppercase tracking-widest hover:underline">Remove file</button>
                         </div>
                      )}
                    </div>
                  </div>
                </div>
  
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing}
                  className={`w-full mt-6 ${btnClass} text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-opacity disabled:opacity-50 shadow-xl`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Rendering Video...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Process & Download
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
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
