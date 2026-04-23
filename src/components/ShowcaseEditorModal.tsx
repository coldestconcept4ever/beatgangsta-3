import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Video, Play, Download, Loader2 } from 'lucide-react';
import { generateVoiceover } from '../services/geminiService';
import { AppTheme } from '../types';

interface ShowcaseEditorModalProps {
  videoBlob: Blob;
  onClose: () => void;
  theme: AppTheme;
}

export const ShowcaseEditorModal: React.FC<ShowcaseEditorModalProps> = ({ videoBlob, onClose, theme }) => {
  const [voiceoverText, setVoiceoverText] = useState("Man, let me show you how BeatGangsta changes the game. Look at this heat.");
  const [adText, setAdText] = useState("BEATGANGSTA\nThe ultimate AI processing assistant.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(videoBlob);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [videoBlob]);

  const handleGenerate = async () => {
    if (!videoRef.current || !canvasRef.current || !audioRef.current) return;
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
      audioRef.current.src = audioUrl;

      // 2. Prepare canvas for video recording
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");

      const video = videoRef.current;
      
      // Wait for audio & video to be ready to play
      await new Promise<void>(resolve => {
        audioRef.current!.onloadeddata = () => resolve();
        audioRef.current!.load();
      });

      // Set canvas to video dimensions
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;

      // Streams to record
      // 30 fps
      const canvasStream = canvas.captureStream(30); 
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dest = audioContext.createMediaStreamDestination();
      
      // Fix for media element source issues: we only capture the TTS audio. 
      // The original video blob typically has no audio anyway since useScreenRecorder mic was muted/disabled, 
      // but if it does, `video.captureStream()` could get it. Re-recording video audio + tts audio via web audio API can cause cors / polluted canvas issues if not careful.
      // We will capture the TTS audio and the canvas video.
      try {
          const ttsSource = audioContext.createMediaElementSource(audioRef.current);
          ttsSource.connect(dest);
          ttsSource.connect(audioContext.destination); // hear it during render
      } catch (e) {
          console.warn("Could not route TTS audio", e);
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
      };

      // Playback loop
      recorder.start();
      video.currentTime = 0;
      audioRef.current.currentTime = 0;
      await video.play();
      await audioRef.current.play();

      const drawLoop = () => {
        if (!ctx || video.paused || video.ended) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Draw Ad Text Overlay
        if (adText) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.fillRect(0, 0, canvas.width, canvas.height); // Darken for text readability

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const lines = adText.split('\n');
          const lineHeight = canvas.height * 0.08;
          ctx.font = `italic 900 ${lineHeight}px "Playfair Display", Times, serif`;
          
          lines.forEach((line, i) => {
            const y = (canvas.height / 2) + ((i - (lines.length - 1) / 2) * lineHeight);
            
            // Text shadow / stroke
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 10;

            ctx.strokeStyle = '#000000';
            ctx.lineWidth = canvas.height * 0.012;
            ctx.strokeText(line, canvas.width / 2, y);
            
            ctx.shadowColor = 'transparent';
            
            // Text fill: beautiful gold gradient
            const gradient = ctx.createLinearGradient(0, y - lineHeight/2, 0, y + lineHeight/2);
            gradient.addColorStop(0, '#fef08a');
            gradient.addColorStop(0.5, '#facc15');
            gradient.addColorStop(1, '#ca8a04');
            
            ctx.fillStyle = gradient; 
            ctx.fillText(line, canvas.width / 2, y);
          });
        }
        
        requestAnimationFrame(drawLoop);
      };

      drawLoop();

      // When video ends, stop recording
      video.onended = () => {
        recorder.stop();
        audioRef.current?.pause();
      };

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={!isProcessing ? onClose : undefined} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full max-w-4xl ${themeClasses} border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-full`}
      >
        <div className="p-4 sm:p-6 border-b border-current/10 flex items-center justify-between z-10 shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <Video className="w-6 h-6" />
              Showcase Editor
            </h2>
            <p className="text-xs uppercase tracking-widest opacity-50 mt-1">Add Z-Ro Voiceover & Beautiful Text Overlay</p>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-full hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6 h-full">
            
            {/* Left side: Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-80">
                  Z-Ro Voiceover Text (TTS)
                </label>
                <textarea
                  value={voiceoverText}
                  onChange={e => setVoiceoverText(e.target.value)}
                  className="w-full bg-black/40 border border-current/10 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-current/30 transition-colors h-32 resize-none"
                  placeholder="What do you want the voice to say over the video?"
                  disabled={isProcessing}
                />
                <p className="text-[10px] opacity-50 mt-2 uppercase tracking-wide">
                  The AI will automatically style this to sound like a deep, Houston rap cadence.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2 opacity-80">
                  Video Overlay Text (Ad Copy)
                </label>
                <textarea
                  value={adText}
                  onChange={e => setAdText(e.target.value)}
                  className="w-full bg-black/40 border border-current/10 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-current/30 transition-colors h-24 resize-none"
                  placeholder="e.g. BEATGANGSTA\nThe ultimate AI processing assistant."
                  disabled={isProcessing}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isProcessing}
                className={`w-full ${btnClass} text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-opacity disabled:opacity-50`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Rendering Video...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Generate & Download
                  </>
                )}
              </button>
            </div>

            {/* Right side: Preview */}
            <div className="bg-black/50 rounded-2xl overflow-hidden border border-current/10 relative flex flex-col">
              <div className="absolute top-0 inset-x-0 p-2 bg-gradient-to-b from-black/80 to-transparent z-10 flex">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-md">Raw Recording Preview</span>
              </div>
              
              <video 
                ref={videoRef} 
                src={videoUrl} 
                controls 
                className="w-full h-full object-contain"
                playsInline
                crossOrigin="anonymous"
              />
              
              {/* Hidden elements for processing */}
              <canvas ref={canvasRef} className="hidden" />
              <audio ref={audioRef} className="hidden" />
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
