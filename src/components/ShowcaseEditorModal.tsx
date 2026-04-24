import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { X, Video, Play, Pause, Download, Loader2, Plus, Trash2, Scissors, Type, Mic, Wand2, MousePointer2, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateVoiceover } from '../services/geminiService';
import { AppTheme } from '../types';
import { Logo } from './Logo';

interface ShowcaseEditorModalProps {
  videoBlob: Blob;
  onClose: () => void;
  theme: AppTheme;
}

interface SequenceClip {
  id: string;
  sourceStart: number;
  sourceEnd: number;
}

interface SequenceEffect {
  id: string;
  trackId: 'fx' | 'text' | 'voiceover';
  start: number; // Sequence time
  end: number;
  // FX props
  cx?: number; cy?: number; radius?: number;
  // Text props
  text?: string;
  // Voiceover props
  audioUrl?: string; 
  audioObj?: HTMLAudioElement;
}

const formatTime = (secs: number) => {
  if (isNaN(secs) || !isFinite(secs)) return '0:00.0';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  const ms = Math.floor((secs % 1) * 10);
  return `${m}:${s.toString().padStart(2, '0')}.${ms}`;
};

export const ShowcaseEditorModal: React.FC<ShowcaseEditorModalProps> = ({ videoBlob, onClose, theme }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [sourceDuration, setSourceDuration] = useState(0);

  const [clips, setClips] = useState<SequenceClip[]>([]);
  const [effects, setEffects] = useState<SequenceEffect[]>([]);

  const [sequenceTime, setSequenceTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Editor tools
  const [activeTool, setActiveTool] = useState<'pointer' | 'razor' | 'scissors' | 'magnifier' | 'text'>('pointer');
  const [voiceoverText, setVoiceoverText] = useState("Man, let me show you how BeatGangsta changes the game. Look at this heat.");
  const [addTextValue, setAddTextValue] = useState("BEATGANGSTA\\nWelcome.");

  const [sourceIn, setSourceIn] = useState(0);
  const [sourceOut, setSourceOut] = useState(10);
  const [sourceTime, setSourceTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const sequenceDuration = useMemo(() => clips.reduce((acc, c) => acc + (c.sourceEnd - c.sourceStart), 0), [clips]);

  const highlightClass = theme === 'coldest' ? 'bg-indigo-500 text-white' : 'bg-yellow-400 text-black';
  const btnClass = theme === 'coldest' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-red-600 hover:bg-red-500';

  useEffect(() => {
    const url = URL.createObjectURL(videoBlob);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoBlob]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      if (videoRef.current.duration === Infinity || isNaN(videoRef.current.duration)) {
          // Fix for WebM from MediaRecorder lacking duration metadata
          videoRef.current.currentTime = 1e101;
          videoRef.current.onseeked = () => {
             if (!videoRef.current) return;
             videoRef.current.onseeked = null;
             videoRef.current.currentTime = 0;
             const dur = videoRef.current.duration;
             if (Number.isFinite(dur)) {
                 setSourceDuration(dur);
                 setSourceOut(dur);
                 setClips(prev => prev.length === 0 ? [{ id: Date.now().toString(), sourceStart: 0, sourceEnd: dur }] : prev);
             }
          };
      } else {
          const dur = videoRef.current.duration;
          if (Number.isFinite(dur)) {
            setSourceDuration(dur);
            setSourceOut(dur);
            setClips(prev => prev.length === 0 ? [{ id: Date.now().toString(), sourceStart: 0, sourceEnd: dur }] : prev);
          }
      }
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  // NLE Playback Loop
  const playLoop = (time: number) => {
    if (lastTimeRef.current !== 0) {
      if (isPlaying) {
        const deltaTime = (time - lastTimeRef.current) / 1000;
        if (activeTool === 'scissors') {
           setSourceTime(prev => {
             let next = prev + deltaTime;
             if (next >= sourceOut) {
                setIsPlaying(false);
                return sourceIn;
             }
             if (next >= sourceDuration) {
                setIsPlaying(false);
                return Math.max(0, sourceDuration - 0.1);
             }
             return next;
           });
        } else {
           setSequenceTime(prev => {
             let next = prev + deltaTime;
             if (next >= sequenceDuration) {
                setIsPlaying(false);
                return sequenceDuration;
             }
             return next;
           });
        }
      }
    }
    lastTimeRef.current = time;
    drawPreview();
    requestRef.current = requestAnimationFrame(playLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(playLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }); // run on every render to ensure playLoop has fresh closures

  // Sync Video Element with Sequence Time
  useEffect(() => {
    if (!videoRef.current || sourceDuration === 0) return;
    
    let targetSourceTime = 0;

    if (activeTool === 'scissors') {
        targetSourceTime = sourceTime;
    } else {
        if (sequenceDuration === 0) return;
        let acc = 0;
        let found = false;
        for (const c of clips) {
          const dur = c.sourceEnd - c.sourceStart;
          if (sequenceTime >= acc && sequenceTime <= acc + dur) {
             targetSourceTime = c.sourceStart + (sequenceTime - acc);
             found = true;
             break;
          }
          acc += dur;
        }
        
        // If at the end or empty
        if (!found) {
          if (clips.length > 0) {
            const lastClip = clips[clips.length - 1];
            targetSourceTime = lastClip.sourceEnd;
          }
        }
        
        // Audio sync for voiceover
        effects.filter(e => e.trackId === 'voiceover' && e.audioObj).forEach(e => {
           if (sequenceTime >= e.start && sequenceTime <= e.end) {
              const localAudioTime = sequenceTime - e.start;
              if (e.audioObj && Number.isFinite(localAudioTime)) {
                if (Math.abs(e.audioObj.currentTime - localAudioTime) > 0.2) {
                   e.audioObj.currentTime = localAudioTime;
                }
                if (isPlaying && e.audioObj.paused) e.audioObj.play().catch(console.error);
                if (!isPlaying && !e.audioObj.paused) e.audioObj.pause();
              }
           } else {
              if (e.audioObj && !e.audioObj.paused) e.audioObj.pause();
           }
        });
    }

    if (Number.isFinite(targetSourceTime) && targetSourceTime >= 0 && Math.abs(videoRef.current.currentTime - targetSourceTime) > 0.1) {
      videoRef.current.currentTime = targetSourceTime;
    }

    if (isPlaying) {
      if (videoRef.current.paused) videoRef.current.play().catch(console.error);
    } else {
      if (!videoRef.current.paused) videoRef.current.pause();
    }

  }, [sequenceTime, sourceTime, clips, isPlaying, effects, activeTool, sequenceDuration, sourceDuration]);

  const drawPreview = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
       canvas.width = video.videoWidth;
       canvas.height = video.videoHeight;
    }
    if (canvas.width === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Draw Video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (activeTool !== 'scissors') {
        // 2. Active Magnifiers
        const activeMag = effects.find(e => e.trackId === 'fx' && sequenceTime >= e.start && sequenceTime <= e.end);
        if (activeMag && activeMag.cx !== undefined && activeMag.cy !== undefined && activeMag.radius !== undefined) {
          const srcX = activeMag.cx * video.videoWidth;
          const srcY = activeMag.cy * video.videoHeight;
          const srcR = activeMag.radius * video.videoWidth;
          const magFactor = 2; // 2x magnification
          
          ctx.save();
          ctx.beginPath();
          ctx.arc(srcX, srcY, srcR * magFactor, 0, Math.PI * 2);
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 30;
          ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.clip(); 
          
          const targetSrcX = srcX - srcR;
          const targetSrcY = srcY - srcR;
          const targetSrcW = srcR * 2;
          const targetSrcH = srcR * 2;
          
          const targetDestX = srcX - srcR * magFactor;
          const targetDestY = srcY - srcR * magFactor;
          const targetDestW = srcR * 2 * magFactor;
          const targetDestH = srcR * 2 * magFactor;
          
          ctx.drawImage(video, targetSrcX, targetSrcY, targetSrcW, targetSrcH, targetDestX, targetDestY, targetDestW, targetDestH);
          
          ctx.beginPath();
          ctx.arc(srcX, srcY, srcR * magFactor, 0, Math.PI * 2);
          ctx.lineWidth = 6;
          ctx.strokeStyle = '#fff';
          ctx.stroke();
          ctx.restore();
        }

        // 3. Active Text Overlays
        const activeText = effects.find(e => e.trackId === 'text' && sequenceTime >= e.start && sequenceTime <= e.end);
        if (activeText && activeText.text) {
           drawOverlayText(ctx, canvas, activeText.text, sequenceTime - activeText.start, theme === 'coldest');
        }
    } else {
        // Scissors Mode visual hint
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, 40);
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SOURCE MODE - TRIMMING RAW VIDEO', canvas.width / 2, 20);
        ctx.restore();
    }
  };

  const drawOverlayText = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, text: string, localTime: number, isColdestTheme: boolean, exportMode: boolean = false) => {
    ctx.save();
    if (!exportMode) {
       ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
       ctx.fillRect(0, 0, canvas.width, canvas.height); // darken
    }

    const lines = text.split('\\n');
    const baseLineHeight = canvas.height * 0.12;
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 90s Cartoon Trailer Slam Anim
    const slamDuration = 0.25;
    const shakeDuration = 0.8;
    let scale = 1;
    let shakeX = 0;
    let shakeY = 0;
    let alpha = 1;
    let zRot = 0;

    if (localTime < slamDuration) {
        const p = localTime / slamDuration;
        const pEasy = Math.pow(p, 5); // very fast snap at the end
        scale = 1 + 25 * (1 - pEasy);
        alpha = pEasy;
        zRot = (1 - pEasy) * 0.5;
    } else if (localTime < slamDuration + shakeDuration) {
        const sp = (localTime - slamDuration) / shakeDuration;
        const decay = Math.pow(1 - sp, 3);
        const intensity = 80 * decay;
        shakeX = (Math.random() - 0.5) * intensity;
        shakeY = (Math.random() - 0.5) * intensity;

        // Shockwave effect
        if (localTime < slamDuration + 0.4) {
            const swP = (localTime - slamDuration) / 0.4;
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, canvas.width * swP, canvas.height * swP * 0.6, 0, 0, Math.PI*2);
            ctx.lineWidth = 40 * (1 - swP);
            ctx.strokeStyle = isColdestTheme ? `rgba(56, 189, 248, ${1 - swP})` : `rgba(255, 255, 255, ${1 - swP})`;
            ctx.stroke();
            
            // Action lines
            for(let a=0; a<16; a++) {
                ctx.save();
                ctx.rotate(a * Math.PI/8 + Math.random()*0.1);
                ctx.beginPath();
                ctx.moveTo(canvas.width * (swP * 0.3 + 0.1), 0);
                ctx.lineTo(canvas.width * (swP * 1.5 + 0.2), 0);
                ctx.lineWidth = 15 * (1 - swP);
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();
        }
    }

    ctx.translate(shakeX, shakeY);
    ctx.rotate(zRot);

    // Slow zoom after slam
    if (localTime > slamDuration) {
        const slowZoom = 1 + (localTime - slamDuration) * 0.04;
        ctx.scale(slowZoom, slowZoom);
    }
    ctx.scale(scale, scale);

    ctx.font = `900 italic ${baseLineHeight}px "Outfit", "Inter", sans-serif`;
    ctx.fillStyle = isColdestTheme ? '#38bdf8' : '#ffffff'; // Tailwind Sky 400
    ctx.shadowColor = isColdestTheme ? 'rgba(56, 189, 248, 1)' : 'rgba(255, 50, 50, 1)';
    ctx.shadowBlur = baseLineHeight * 0.3;

    const numTrails = localTime < slamDuration ? 6 : 1;
    ctx.globalAlpha = alpha;

    const totalHeight = lines.length * baseLineHeight * 1.1;
    const startY = -totalHeight / 2 + baseLineHeight / 2;

    for (let t = 0; t < numTrails; t++) {
        if (t > 0) {
            const trailTime = Math.max(0, localTime - t * 0.03);
            const tp = trailTime / slamDuration;
            const trailScale = 1 + 25 * (1 - Math.pow(tp, 5));
            ctx.save();
            ctx.scale(trailScale / scale, trailScale / scale);
            ctx.globalAlpha = alpha * (1 - t/numTrails) * 0.4;
        }

        lines.forEach((line, i) => {
            const y = startY + i * baseLineHeight * 1.1;
            ctx.lineWidth = baseLineHeight * 0.06;
            ctx.strokeStyle = '#000000';
            ctx.strokeText(line, 0, y);
            ctx.fillText(line, 0, y);
        });

        if (t > 0) {
            ctx.restore();
        }
    }
    ctx.restore();
  };

  // Canvas Interactions (for Magnifier)
  const [magDrawing, setMagDrawing] = useState<{cx: number, cy: number} | null>(null);
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
     if (activeTool !== 'magnifier') return;
     const rect = canvasRef.current?.getBoundingClientRect();
     if (!rect) return;
     const cx = (e.clientX - rect.left) / rect.width;
     const cy = (e.clientY - rect.top) / rect.height;
     setMagDrawing({ cx, cy });
  };
  const handleCanvasPointerUp = (e: React.PointerEvent) => {
     if (!magDrawing || activeTool !== 'magnifier') return;
     const rect = canvasRef.current?.getBoundingClientRect();
     if (!rect) return;
     const x = (e.clientX - rect.left) / rect.width;
     const y = (e.clientY - rect.top) / rect.height;
     const dx = x - magDrawing.cx;
     const dy = y - magDrawing.cy;
     const radius = Math.sqrt(dx*dx + dy*dy);
     
     if (radius > 0.05) {
        setEffects([...effects, {
           id: Date.now().toString(),
           trackId: 'fx',
           start: sequenceTime,
           end: Math.min(sequenceTime + 4, sequenceDuration),
           cx: magDrawing.cx,
           cy: magDrawing.cy,
           radius
        }]);
     }
     setMagDrawing(null);
     setActiveTool('pointer'); // reset tool
  };

  // Timeline Interactions
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [dragAction, setDragAction] = useState<{
     id: string; // clip or effect id
     type: 'clip-trim-start' | 'clip-trim-end' | 'eff-trim-start' | 'eff-trim-end' | 'eff-move';
  } | null>(null);

  const getTimelineTime = (e: PointerEvent) => {
     if (!timelineContainerRef.current) return 0;
     const rect = timelineContainerRef.current.getBoundingClientRect();
     if (rect.width === 0) return 0;
     const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
     return (Number.isFinite(pos) ? pos : 0) * Math.max(sequenceDuration, 10); // Use 10s min scale if empty
  };

  useEffect(() => {
     const handlePointerMove = (e: PointerEvent) => {
        if (!dragAction) return;
        const time = getTimelineTime(e);
        
        if (dragAction.type.startsWith('clip-')) {
            setClips(prev => {
                const idx = prev.findIndex(c => c.id === dragAction.id);
                if (idx < 0) return prev;
                const newClips = [...prev];
                const c = { ...newClips[idx] };
                if (dragAction.type === 'clip-trim-start') {
                    // Changing sourceStart means changing the duration of the clip.
                    // To map timeline time to clip trimming:
                    // Find sequence bounds
                    let acc = 0;
                    for(let i=0; i<idx; i++) acc += (newClips[i].sourceEnd - newClips[i].sourceStart);
                    // Time delta
                    const delta = time - acc; // How far into original clip
                    const newSourceStart = Math.min(c.sourceEnd - 0.5, c.sourceStart + delta); // min 0.5s duration
                    c.sourceStart = Math.max(0, newSourceStart);
                } else if (dragAction.type === 'clip-trim-end') {
                    let acc = 0;
                    for(let i=0; i<idx; i++) acc += (newClips[i].sourceEnd - newClips[i].sourceStart);
                    const delta = time - acc;
                    const newSourceEnd = Math.max(c.sourceStart + 0.5, c.sourceStart + delta);
                    c.sourceEnd = Math.min(sourceDuration, newSourceEnd);
                }
                newClips[idx] = c;
                return newClips;
            });
        } else if (dragAction.type.startsWith('eff-')) {
            setEffects(prev => {
                return prev.map(eff => {
                    if (eff.id !== dragAction.id) return eff;
                    if (dragAction.type === 'eff-trim-start') {
                       return { ...eff, start: Math.min(eff.end - 0.2, time) };
                    } else if (dragAction.type === 'eff-trim-end') {
                       return { ...eff, end: Math.max(eff.start + 0.2, time) };
                    } else if (dragAction.type === 'eff-move') {
                       const dur = eff.end - eff.start;
                       const newStart = Math.max(0, time - dur/2); // Center on pointer roughly
                       return { ...eff, start: newStart, end: newStart + dur };
                    }
                    return eff;
                });
            });
        }
     };
     const handlePointerUp = () => setDragAction(null);
     
     if (dragAction) {
         window.addEventListener('pointermove', handlePointerMove);
         window.addEventListener('pointerup', handlePointerUp);
     }
     return () => {
         window.removeEventListener('pointermove', handlePointerMove);
         window.removeEventListener('pointerup', handlePointerUp);
     };
  }, [dragAction, sourceDuration, clips]);

  const addVoiceover = async () => {
     try {
         setIsProcessing(true);
         const base64Audio = await generateVoiceover(voiceoverText);
         const binary = atob(base64Audio);
         const bytes = new Uint8Array(binary.length);
         for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
         const blob = new Blob([bytes], { type: 'audio/wav' });
         const audioUrl = URL.createObjectURL(blob);
         const audioObj = new Audio(audioUrl);
         
         await new Promise<void>(resolve => {
            audioObj.onloadeddata = () => resolve();
            audioObj.load();
         });
         
         setEffects(prev => [...prev, {
             id: Date.now().toString(),
             trackId: 'voiceover',
             start: sequenceTime,
             end: sequenceTime + audioObj.duration,
             audioUrl,
             audioObj
         }]);
     } catch(e) {
         console.error(e);
         alert("Failed to generate voiceover.");
     } finally {
         setIsProcessing(false);
     }
  };

  const addTextOverlay = () => {
      setEffects(prev => [...prev, {
          id: Date.now().toString(),
          trackId: 'text',
          start: sequenceTime,
          end: Math.min(sequenceTime + 4, sequenceDuration),
          text: addTextValue
      }]);
  };

  const appendNewClip = () => {
      if (sourceDuration > 0) {
          setClips(prev => [...prev, {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
              sourceStart: 0,
              sourceEnd: sourceDuration
          }]);
      }
  };

  const moveClipLeft = (index: number) => {
      if (index === 0) return;
      setClips(prev => {
          const newClips = [...prev];
          const temp = newClips[index - 1];
          newClips[index - 1] = newClips[index];
          newClips[index] = temp;
          return newClips;
      });
  };

  const moveClipRight = (index: number) => {
      if (index === clips.length - 1) return;
      setClips(prev => {
          const newClips = [...prev];
          const temp = newClips[index + 1];
          newClips[index + 1] = newClips[index];
          newClips[index] = temp;
          return newClips;
      });
  };

  const splitClipAtTime = (time: number) => {
      let acc = 0;
      for (let i = 0; i < clips.length; i++) {
          const c = clips[i];
          const dur = c.sourceEnd - c.sourceStart;
          if (time > acc && time < acc + dur) {
              const splitSourceTime = c.sourceStart + (time - acc);
              const clip1 = { ...c, sourceEnd: splitSourceTime };
              const clip2 = { ...c, id: Date.now().toString() + Math.random().toString(36).substr(2, 5), sourceStart: splitSourceTime };
              const newClips = [...clips];
              newClips.splice(i, 1, clip1, clip2);
              setClips(newClips);
              break;
          }
          acc += dur;
      }
  };
  
  const handleExport = async () => {
      if (!canvasRef.current || sequenceDuration === 0) return;
      setIsProcessing(true);
      setIsExporting(true);
      
      try {
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          
          // 1. Original Video
          zip.file("original_video.mp4", videoBlob);
          
          // 2. Audio Voiceovers
          const voiceovers = effects.filter(e => e.trackId === 'voiceover' && e.audioUrl);
          for (let i = 0; i < voiceovers.length; i++) {
              try {
                  const res = await fetch(voiceovers[i].audioUrl!);
                  const blob = await res.blob();
                  zip.file(`voiceover_${i + 1}.wav`, blob);
              } catch(e) { console.warn("Failed to fetch voiceover for export", e); }
          }
          
          // 3. Text Overlays (Rendered as PNGs)
          const textEffects = effects.filter(e => e.trackId === 'text');
          for (let i = 0; i < textEffects.length; i++) {
              const e = textEffects[i];
              if (e.text) {
                  const c = document.createElement('canvas');
                  c.width = canvasRef.current.width || 1920;
                  c.height = canvasRef.current.height || 1080;
                  const ctx = c.getContext('2d');
                  if (ctx) {
                      ctx.clearRect(0, 0, c.width, c.height);
                      drawOverlayText(ctx, c, e.text, 2.0, theme === 'coldest', true);
                      const blob = await new Promise<Blob | null>(res => c.toBlob(res, 'image/png'));
                      if (blob) {
                          zip.file(`text_overlay_${i + 1}.png`, blob);
                      }
                  }
              }
          }
          
          // 4. Project timeline details
          const projectData = {
              duration: sequenceDuration,
              clips: clips.map(c => ({
                  id: c.id,
                  sourceStart: c.sourceStart,
                  sourceEnd: c.sourceEnd
              })),
              textOverlays: textEffects.map((e, index) => ({
                  id: e.id,
                  start: e.start,
                  end: e.end,
                  text: e.text,
                  file: `text_overlay_${index + 1}.png`
              })),
              voiceovers: voiceovers.map((e, index) => ({
                  id: e.id,
                  start: e.start,
                  end: e.end,
                  file: `voiceover_${index + 1}.wav`
              })),
              magnifiers: effects.filter(e => e.trackId === 'fx').map(e => ({
                  id: e.id,
                  start: e.start,
                  end: e.end,
                  cx: e.cx,
                  cy: e.cy,
                  radius: e.radius
              }))
          };
          
          zip.file("project_timeline.json", JSON.stringify(projectData, null, 2));
          
          // Generate and download
          const zipBlob = await zip.generateAsync({ type: "blob" });
          const zipUrl = URL.createObjectURL(zipBlob);
          const a = document.createElement('a');
          a.href = zipUrl;
          a.download = `NLE_PRO_Export_${Date.now()}.zip`;
          a.click();
          URL.revokeObjectURL(zipUrl);
          
      } catch(e) {
          console.error(e);
          alert('Failed to export project');
      } finally {
          setIsProcessing(false);
          setIsExporting(false);
      }
  };
  
  const tlScale = Math.max(sequenceDuration, 10); // 10s minimum view

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
       <video ref={videoRef} src={videoUrl} onLoadedMetadata={handleLoadedMetadata} className="hidden" muted />
       
       <div className={`w-full max-w-7xl h-[90vh] bg-black rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col font-sans relative`}>
          {/* Header */}
          <div className="flex-shrink-0 h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/5 relative z-10 box-border">
             <div className="flex items-center gap-4">
                 <Logo size={32} theme={theme} grillStyle="diamond" knifeStyle="standard" duragStyle="standard" chainStyle="gold" pendantStyle="gold" />
                 <h2 className="text-xl font-black uppercase tracking-widest text-white">NLE PRO</h2>
             </div>
             <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
          </div>

          <div className="flex flex-1 min-h-0 relative">
             {/* Left Toolbar */}
             <div className="w-16 flex-shrink-0 border-r border-white/5 bg-white/5 flex flex-col items-center py-4 gap-4 z-10 box-border">
                 <button onClick={() => setActiveTool('pointer')} className={`p-3 rounded-xl transition-colors ${activeTool === 'pointer' ? highlightClass : 'text-white/50 hover:bg-white/10'}`}>
                    <MousePointer2 size={24} />
                 </button>
                 <button onClick={() => setActiveTool('scissors')} title="Source Clip Trimmer" className={`p-3 rounded-xl transition-colors ${activeTool === 'scissors' ? highlightClass : 'text-white/50 hover:bg-white/10'}`}>
                    <Scissors size={24} />
                 </button>
                 <button onClick={() => setActiveTool('razor')} title="Razor Tool (Click Timeline to Split)" className={`p-3 rounded-xl transition-colors ${activeTool === 'razor' ? highlightClass : 'text-white/50 hover:bg-white/10'}`}>
                    <Scissors size={24} className="-rotate-90" />
                 </button>
                 <button onClick={() => setActiveTool('magnifier')} title="Draw Magnifier" className={`p-3 rounded-xl transition-colors ${activeTool === 'magnifier' ? highlightClass : 'text-white/50 hover:bg-white/10'}`}>
                    <Wand2 size={24} />
                 </button>
                 <button onClick={() => setActiveTool('text')} title="Add Text" className={`p-3 rounded-xl transition-colors ${activeTool === 'text' ? highlightClass : 'text-white/50 hover:bg-white/10'}`}>
                    <Type size={24} />
                 </button>
             </div>

             {/* Center Preview */}
             <div className="flex-1 bg-black/80 flex flex-col items-center justify-center p-4 relative min-w-0">
                 <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl border border-white/10 shadow-2xl overflow-hidden flex-shrink-0">
                    <canvas 
                       ref={canvasRef} 
                       className={`w-full h-full object-contain ${activeTool === 'magnifier' ? 'cursor-crosshair' : 'cursor-default'}`}
                       onPointerDown={handleCanvasPointerDown}
                       onPointerUp={handleCanvasPointerUp}
                    />
                    
                    {magDrawing && activeTool === 'magnifier' && (
                        <div className="absolute border font-black flex items-center justify-center border-white/50 rounded-full pointer-events-none text-white/50 uppercase tracking-widest text-xs" style={{
                           left: magDrawing.cx*100 + '%', top: magDrawing.cy*100 + '%', width: 2, height: 2, transform: 'translate(-50%, -50%)', outline: '9999px solid rgba(0,0,0,0.5)'
                        }}>
                           DRAW RADIUS
                        </div>
                    )}
                 </div>

                 {/* Active Tool Panels */}
                 {activeTool === 'scissors' && (
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-neutral-900 border border-white/10 rounded-xl p-4 shadow-2xl flex flex-col gap-4 z-30">
                         <span className="text-xs font-black uppercase tracking-widest text-white/50 text-center block">Source Clip Trimmer</span>
                         <div className="flex justify-between items-center text-xs font-mono text-white/50">
                             <span className="w-16">IN: {formatTime(sourceIn)}</span>
                             <span className="text-white text-sm font-bold bg-black px-2 py-1 rounded">POS: {formatTime(sourceTime)}</span>
                             <span className="w-16 text-right">OUT: {formatTime(sourceOut)}</span>
                         </div>
                         <div className="flex items-center gap-4">
                             <button onClick={() => setSourceIn(Math.min(sourceTime, sourceOut))} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded font-bold text-xs whitespace-nowrap text-white">Set In [</button>
                             <div className="flex-1 relative h-8 bg-black rounded border border-white/10 cursor-pointer overflow-hidden group"
                                  onPointerDown={e => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      if (rect.width === 0) return;
                                      const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                                      setSourceTime(Number.isFinite(p) ? p * sourceDuration : 0);
                                      
                                      const moveHandler = (moveEv: PointerEvent) => {
                                         const p = Math.max(0, Math.min(1, (moveEv.clientX - rect.left) / rect.width));
                                         setSourceTime(Number.isFinite(p) ? p * sourceDuration : 0);
                                      };
                                      const upHandler = () => {
                                         window.removeEventListener('pointermove', moveHandler);
                                         window.removeEventListener('pointerup', upHandler);
                                      };
                                      window.addEventListener('pointermove', moveHandler);
                                      window.addEventListener('pointerup', upHandler);
                                  }}>
                                 {/* the bar */}
                                 <div className="absolute top-0 bottom-0 bg-white/20" style={{ left: `${(sourceIn/(sourceDuration||1))*100}%`, width: `${((sourceOut-sourceIn)/(sourceDuration||1))*100}%` }} />
                                 <div className="absolute top-0 bottom-0 w-px bg-red-500 pointer-events-none group-hover:w-0.5" style={{ left: `${(sourceTime/(sourceDuration||1))*100}%` }} />
                                 {/* IN point */}
                                 <div className="absolute top-0 bottom-0 w-[2px] bg-indigo-500" style={{ left: `${(sourceIn/(sourceDuration||1))*100}%` }} />
                                 {/* OUT point */}
                                 <div className="absolute top-0 bottom-0 w-[2px] bg-pink-500" style={{ left: `${(sourceOut/(sourceDuration||1))*100}%` }} />
                             </div>
                             <button onClick={() => setSourceOut(Math.max(sourceTime, sourceIn))} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded font-bold text-xs whitespace-nowrap text-white">Set Out ]</button>
                         </div>
                         <div className="flex justify-center mt-2">
                             <button onClick={() => {
                                 setClips(prev => [...prev, {
                                     id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                                     sourceStart: sourceIn,
                                     sourceEnd: sourceOut
                                 }]);
                                 setActiveTool('pointer');
                             }} className={`px-6 py-2 ${btnClass} text-white font-bold uppercase tracking-widest rounded transition-colors`}>
                                 Add to Timeline
                             </button>
                         </div>
                     </div>
                 )}
                 {activeTool === 'text' && (
                     <div className="absolute top-4 right-4 w-72 bg-neutral-900 border border-white/10 rounded-xl p-4 shadow-2xl flex flex-col gap-3 z-30">
                         <span className="text-xs font-black uppercase tracking-widest text-white/50">Text Overlay</span>
                         <textarea value={addTextValue} onChange={e => setAddTextValue(e.target.value)} className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white resize-none" rows={3} />
                         <button onClick={addTextOverlay} className={`py-2 rounded uppercase text-xs font-bold tracking-widest text-white ${btnClass}`}>Add to Timeline</button>
                     </div>
                 )}
             </div>

             {/* Right Panel (Export, AI Voice) */}
             <div className="w-80 flex-shrink-0 border-l border-white/5 bg-white/5 p-6 overflow-y-auto z-10 box-border custom-scrollbar flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-white/50 mb-4 block">Z-Ro Voiceover (AI)</span>
                <textarea 
                   value={voiceoverText} 
                   onChange={e => setVoiceoverText(e.target.value)}
                   className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white/80 focus:outline-none focus:border-white/30 resize-none h-32 mb-4"
                />
                <button onClick={addVoiceover} disabled={isProcessing} className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors ${btnClass} text-white disabled:opacity-50`}>
                   {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />} 
                   Generate Voice
                </button>

                <div className="mt-auto pt-8">
                   <button onClick={handleExport} disabled={isProcessing} className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm transition-colors text-black bg-white hover:bg-neutral-200 disabled:opacity-50`}>
                       {isProcessing && isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} 
                       {isExporting ? 'Exporting...' : 'Export Video'}
                   </button>
                </div>
             </div>
          </div>

          {/* Timeline Section */}
          <div className="flex-shrink-0 h-72 border-t border-white/10 bg-neutral-950 flex flex-col relative z-20 box-border">
              {/* Timeline Header Controller */}
              <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-4 flex-shrink-0">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 rounded bg-white text-black flex items-center justify-center hover:bg-neutral-200">
                     {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current ml-1" />}
                  </button>
                  <span className="font-mono text-sm font-bold text-white tracking-widest">
                     {formatTime(sequenceTime)} <span className="text-white/30">/ {formatTime(sequenceDuration)}</span>
                  </span>
                  
                  <div className="ml-auto flex items-center gap-2">
                     <button onClick={appendNewClip} className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-widest text-white transition-colors flex items-center gap-2 ${btnClass}`}>
                         <Plus size={14} /> Add Source Clip
                     </button>
                  </div>
              </div>

              {/* Timeline Tracks Grid */}
              <div className="flex-1 flex overflow-hidden">
                  {/* Track Headers */}
                  <div className="w-32 bg-neutral-900 border-r border-white/10 flex flex-col flex-shrink-0">
                      <div className="flex-1 border-b border-white/5 flex items-center px-3 text-[10px] font-black tracking-widest uppercase text-indigo-400">Video</div>
                      <div className="flex-1 border-b border-white/5 flex items-center px-3 text-[10px] font-black tracking-widest uppercase text-pink-400">Text FX</div>
                      <div className="flex-1 border-b border-white/5 flex items-center px-3 text-[10px] font-black tracking-widest uppercase text-emerald-400">Magnifier</div>
                      <div className="flex-1 border-b border-white/5 flex items-center px-3 text-[10px] font-black tracking-widest uppercase text-yellow-400">Audio (Voice)</div>
                  </div>
                  
                  {/* Tracks Area */}
                  <div className="flex-1 relative overflow-x-auto overflow-y-hidden custom-scrollbar bg-[length:40px_40px] bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)]"
                       ref={timelineContainerRef}
                       onPointerDown={(e) => {
                           if(e.target === timelineContainerRef.current) {
                               const time = getTimelineTime(e.nativeEvent);
                               setSequenceTime(time);
                           }
                       }}
                       >
                       
                       {/* Playhead */}
                       <div className="absolute top-0 bottom-0 w-px bg-red-500 z-50 pointer-events-none" style={{ left: `${(sequenceTime/tlScale)*100}%` }}>
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
                       </div>

                       {/* Tracks Container */}
                       <div className="absolute inset-0 flex flex-col pointer-events-none">
                           {/* Video Track */}
                           <div className="flex-1 border-b border-white/5 relative pointer-events-auto flex items-center px-0.5">
                               {(() => {
                                   let acc = 0;
                                   return clips.map((c, i) => {
                                       const dur = c.sourceEnd - c.sourceStart;
                                       const element = (
                                            <div key={c.id} className={`absolute h-[80%] top-[10%] bg-indigo-500/80 border-2 border-indigo-300 rounded overflow-hidden group shadow-lg ${activeTool === 'razor' ? 'cursor-crosshair' : 'cursor-default'}`}
                                                 style={{ left: `${(acc/tlScale)*100}%`, width: `${(dur/tlScale)*100}%` }}
                                                 onPointerDown={e => {
                                                     if (activeTool === 'razor') {
                                                         e.stopPropagation();
                                                         const time = getTimelineTime(e.nativeEvent);
                                                         splitClipAtTime(time);
                                                         setActiveTool('pointer');
                                                     }
                                                 }}>
                                                 <div className="absolute inset-x-0 inset-y-0 opacity-10 bg-[linear-gradient(45deg,rgba(0,0,0,1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,1)_50%,rgba(0,0,0,1)_75%,transparent_75%,transparent)] bg-[length:10px_10px]" />
                                                 <span className="absolute top-0 bottom-0 left-3 right-3 flex items-center px-2 text-[10px] font-black text-white/50 truncate pointer-events-none">CLIP {c.sourceStart.toFixed(1)}s-{c.sourceEnd.toFixed(1)}s</span>
                                                 
                                                 {/* Move Buttons */}
                                                 {activeTool === 'pointer' && (
                                                     <div className="absolute top-1 right-2 flex gap-1 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={(e) => { e.stopPropagation(); moveClipLeft(i); }} className="w-5 h-5 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center rounded"><ChevronLeft size={12}/></button>
                                                        <button onClick={(e) => { e.stopPropagation(); moveClipRight(i); }} className="w-5 h-5 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center rounded"><ChevronRight size={12}/></button>
                                                     </div>
                                                 )}
                                                 
                                                 {/* Left Handle */}
                                                 {activeTool !== 'razor' && <div className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white/50 z-20" onPointerDown={e => { e.stopPropagation(); setDragAction({ id: c.id, type: 'clip-trim-start' }); }} />}
                                                 {/* Right Handle */}
                                                 {activeTool !== 'razor' && <div className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white/50 z-20" onPointerDown={e => { e.stopPropagation(); setDragAction({ id: c.id, type: 'clip-trim-end' }); }} />}
                                                 
                                                 {activeTool !== 'razor' && <button onClick={() => setClips(cArr => cArr.filter(x => x.id !== c.id))} className="absolute bottom-1 right-2 w-5 h-5 bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={12}/></button>}
                                            </div>
                                       );
                                       acc += dur;
                                       return element;
                                   });
                               })()}
                           </div>
                           
                           {/* Text Track */}
                           <div className="flex-1 border-b border-white/5 relative pointer-events-auto flex items-center px-0.5">
                               {effects.filter(e => e.trackId === 'text').map(e => (
                                   <div key={e.id} className="absolute h-[80%] top-[10%] bg-pink-500/80 border-2 border-pink-300 rounded group shadow-lg cursor-move flex items-center justify-center px-4 overflow-hidden"
                                        style={{ left: `${(e.start/tlScale)*100}%`, width: `${((e.end-e.start)/tlScale)*100}%` }}
                                        onPointerDown={ev => { ev.stopPropagation(); setDragAction({ id: e.id, type: 'eff-move' }); }}>
                                        <span className="text-[10px] font-black text-white truncate pointer-events-none block whitespace-pre">{e.text?.replace('\\n', ' ')}</span>
                                        <div className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white/50 z-20" onPointerDown={ev => { ev.stopPropagation(); setDragAction({ id: e.id, type: 'eff-trim-start' }); }} />
                                        <div className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white/50 z-20" onPointerDown={ev => { ev.stopPropagation(); setDragAction({ id: e.id, type: 'eff-trim-end' }); }} />
                                        <button onClick={() => setEffects(efs => efs.filter(x => x.id !== e.id))} className="absolute inset-x-0 inset-y-0 opacity-0 group-hover:opacity-100 bg-red-500/80 flex items-center justify-center transition-opacity z-10"><Trash2 size={16}/></button>
                                   </div>
                               ))}
                           </div>

                           {/* Magnifier Track */}
                           <div className="flex-1 border-b border-white/5 relative pointer-events-auto flex items-center px-0.5">
                               {effects.filter(e => e.trackId === 'fx').map(e => (
                                   <div key={e.id} className="absolute h-[80%] top-[10%] bg-emerald-500/80 border-2 border-emerald-300 rounded group shadow-lg cursor-move flex items-center justify-center"
                                        style={{ left: `${(e.start/tlScale)*100}%`, width: `${((e.end-e.start)/tlScale)*100}%` }}
                                        onPointerDown={ev => { ev.stopPropagation(); setDragAction({ id: e.id, type: 'eff-move' }); }}>
                                        <div className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white/50 z-20" onPointerDown={ev => { ev.stopPropagation(); setDragAction({ id: e.id, type: 'eff-trim-start' }); }} />
                                        <div className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white/50 z-20" onPointerDown={ev => { ev.stopPropagation(); setDragAction({ id: e.id, type: 'eff-trim-end' }); }} />
                                        <button onClick={() => setEffects(efs => efs.filter(x => x.id !== e.id))} className="absolute inset-x-0 inset-y-0 opacity-0 group-hover:opacity-100 bg-red-500/80 flex items-center justify-center transition-opacity z-10"><Trash2 size={16}/></button>
                                   </div>
                               ))}
                           </div>

                           {/* Audio Track */}
                           <div className="flex-1 relative pointer-events-auto flex items-center px-0.5">
                               {effects.filter(e => e.trackId === 'voiceover').map(e => (
                                   <div key={e.id} className="absolute h-[80%] top-[10%] bg-yellow-500/80 border-2 border-yellow-300 rounded group shadow-lg cursor-move flex items-center px-2"
                                        style={{ left: `${(e.start/tlScale)*100}%`, width: `${((e.end-e.start)/tlScale)*100}%` }}
                                        onPointerDown={ev => { ev.stopPropagation(); setDragAction({ id: e.id, type: 'eff-move' }); }}>
                                        
                                        <svg className="w-full h-full absolute inset-0 opacity-30 preserve-aspect-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                                            <path d="M0,10 Q2,0 4,10 T8,10 T12,10 T16,3 T20,10 L100,10" stroke="white" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke"/>
                                        </svg>

                                        <span className="text-[10px] font-black text-black z-10">Z-RO V.O.</span>
                                        <div className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white/50 z-20" onPointerDown={ev => { ev.stopPropagation(); setDragAction({ id: e.id, type: 'eff-trim-start' }); }} />
                                        <div className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize hover:bg-white/50 z-20" onPointerDown={ev => { ev.stopPropagation(); setDragAction({ id: e.id, type: 'eff-trim-end' }); }} />
                                        <button onClick={() => setEffects(efs => {
                                            const removed = efs.find(x => x.id === e.id);
                                            if (removed?.audioObj) removed.audioObj.pause();
                                            return efs.filter(x => x.id !== e.id);
                                        })} className="absolute inset-x-0 inset-y-0 opacity-0 group-hover:opacity-100 bg-red-500/80 flex items-center justify-center transition-opacity z-10"><Trash2 size={16}/></button>
                                   </div>
                               ))}
                           </div>
                       </div>
                  </div>
              </div>
          </div>
       </div>
    </div>
  );
};
