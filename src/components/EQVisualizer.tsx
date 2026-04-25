import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EQBand {
  hz: number;
  db: number;
  q: number;
  type: 'bell' | 'lowshelf' | 'highshelf' | 'lowpass' | 'highpass' | 'notch';
}

interface EQVisualizerProps {
  parameters: { parameter: string; value: string; explanation?: string }[];
  theme: string;
}

export const EQVisualizer: React.FC<EQVisualizerProps> = ({ parameters, theme }) => {
  const [hoveredBand, setHoveredBand] = useState<number | null>(null);

  // Parse bands from text
  const bands = useMemo(() => {
    const extracted: EQBand[] = [];
    
    parameters.forEach(d => {
      const text = `${d.parameter} ${d.value} ${d.explanation || ''}`.toLowerCase();
      
      // Heuristic to ensure this is somewhat related to an EQ band
      if (!text.match(/\d+\s*(hz|khz|k|db|q)/) && !text.includes('band') && !text.includes('shelf') && !text.includes('cut') && !text.includes('pass')) {
        return;
      }

      // Extract dB
      const dbMatch = text.match(/([-+]?\d*\.?\d+)\s*(?:db)/);
      let db = dbMatch ? parseFloat(dbMatch[1]) : 0;
      
      // Extract Hz
      let hz = 1000;
      const hzMatch = text.match(/(\d*\.?\d+)\s*hz/);
      const khzMatch = text.match(/(\d*\.?\d+)\s*(?:khz|k)/);
      
      if (hzMatch) {
         hz = parseFloat(hzMatch[1]);
      } else if (khzMatch) {
         hz = parseFloat(khzMatch[1]) * 1000;
      } else {
         const numMatch = text.match(/\b([2-9]\d{1,4})\b/);
         if (numMatch) hz = parseFloat(numMatch[1]);
         else return;
      }

      if (hz < 10) hz = 10;
      if (hz > 22000) hz = 22000;

      // Extract Q
      const qMatch = text.match(/q[=:\s]*(\d*\.?\d+)/);
      let q = qMatch ? parseFloat(qMatch[1]) : 1.0;
      if (text.includes('wide')) q = 0.5;
      if (text.includes('narrow')) q = 3.0;
      if (text.includes('notch')) q = 10.0;

      // Type
      let type: EQBand['type'] = 'bell';
      if (text.includes('low shelf') || text.includes('lowshelf')) type = 'lowshelf';
      if (text.includes('high shelf') || text.includes('highshelf')) type = 'highshelf';
      if (text.includes('low pass') || text.includes('lowpass') || text.includes('high cut') || text.includes('highcut')) type = 'lowpass';
      if (text.includes('high pass') || text.includes('highpass') || text.includes('low cut') || text.includes('lowcut')) type = 'highpass';
      if (text.includes('notch') || text.includes('cut out')) type = 'notch';

      if (hz > 0 && !(db === 0 && type === 'bell')) {
        extracted.push({ hz, db, q, type });
      }
    });
    
    return extracted;
  }, [parameters]);

  if (bands.length === 0) return null;

  // Modern Dimension variables
  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;
  const maxDb = 30; // Increased range for Pro look
  
  // Professional frequency steps (Log)
  const gridFreqs = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
  const minorFreqs = [30, 40, 60, 70, 80, 90, 300, 400, 600, 700, 800, 900, 3000, 4000, 6000, 7000, 8000, 9000];
  const dbLines = [24, 18, 12, 6, 0, -6, -12, -18, -24];
  
  const getX = (f: number) => {
    const minLog = Math.log10(10);
    const maxLog = Math.log10(24000);
    const fLog = Math.log10(Math.max(10, Math.min(24000, f)));
    return paddingX + ((fLog - minLog) / (maxLog - minLog)) * graphWidth;
  };

  const getY = (db: number) => {
    const clampedDb = Math.max(-maxDb, Math.min(maxDb, db));
    return paddingY + (graphHeight / 2) - (clampedDb / maxDb) * (graphHeight / 2);
  };

  const curvePoints: [number, number][] = [];
  const resolution = 400; 
  
  for (let i = 0; i <= resolution; i++) {
    const screenX = paddingX + (i / resolution) * graphWidth;
    const minLog = Math.log10(10);
    const maxLog = Math.log10(24000);
    const fLog = minLog + ((screenX - paddingX) / graphWidth) * (maxLog - minLog);
    const f = Math.pow(10, fLog);
    
    let totalDb = 0;
    bands.forEach(band => {
      const dx = Math.log10(f / band.hz);
      
      if (band.type === 'bell') {
        const widthFactor = 1 / (band.q * 1.5);
        totalDb += band.db * Math.exp(-Math.pow(dx / widthFactor, 2) * 4);
      } else if (band.type === 'lowshelf') {
        const transition = 1 / (1 + Math.pow(f / band.hz, 2 * band.q));
        totalDb += band.db * transition;
      } else if (band.type === 'highshelf') {
        const transition = 1 / (1 + Math.pow(band.hz / f, 2 * band.q));
        totalDb += band.db * transition;
      } else if (band.type === 'lowpass') {
        if (f > 0) {
          const ratio = f / band.hz;
          totalDb -= 20 * Math.log10(Math.sqrt(1 + Math.pow(ratio, 8))); // 48dB/octave
        }
      } else if (band.type === 'highpass') {
        if (f > 0) {
          const ratio = band.hz / f;
          totalDb -= 20 * Math.log10(Math.sqrt(1 + Math.pow(ratio, 8))); // 48dB/octave
        }
      } else if (band.type === 'notch') {
        const widthFactor = 1 / (band.q * 5);
        totalDb -= 60 * Math.exp(-Math.pow(dx / widthFactor, 2) * 10);
      }
    });

    curvePoints.push([screenX, getY(totalDb)]);
  }

  const pathData = `M ${paddingX},${getY(0)} ` + curvePoints.map(p => `L ${p[0]},${p[1]}`).join(' ') + ` L ${width - paddingX},${getY(0)}`;
  
  // Pro Q-3 Aesthetics
  const isColdest = theme === 'coldest';
  const gridColorMain = 'rgba(255,255,255,0.08)';
  const gridColorMinor = 'rgba(255,255,255,0.03)';
  const labelColor = 'rgba(255,255,255,0.5)';
  const lineColor = isColdest ? '#0ea5e9' : '#8b5cf6';
  const glowColor = isColdest ? 'rgba(14, 165, 233, 0.4)' : 'rgba(139, 92, 246, 0.4)';
  const fillColor = isColdest ? 'rgba(14, 165, 233, 0.15)' : 'rgba(139, 92, 246, 0.15)';
  const bgColor = '#121214'; // Professional plugin background

  return (
    <div className="w-full relative py-4 px-2 select-none group/eq">
      <div className={`relative rounded-2xl overflow-hidden border shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]`} 
           style={{ backgroundColor: bgColor, borderColor: 'rgba(255,255,255,0.1)' }}>
        
        {/* Pro Metadata Overlays */}
        <div className="absolute top-3 left-6 hidden sm:flex items-center gap-3 pointer-events-none">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">BeatGen EQ</div>
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_emerald]" />
        </div>
        
        <div className="absolute top-3 right-6 hidden sm:flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
           Zero Latency • 64-bit
        </div>

        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="block w-full h-full">
          <rect width={width} height={height} fill="transparent" />
          
          {/* Vertical dB Grid */}
          {dbLines.map((db, i) => {
            const y = getY(db);
            return (
              <g key={`db-${i}`}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} 
                      stroke={db === 0 ? 'rgba(255,255,255,0.2)' : gridColorMain} 
                      strokeWidth={db === 0 ? "1.5" : "1"} 
                      strokeDasharray={db === 0 ? "0" : "4 4"} />
                <text x={width - paddingX + 6} y={y + 3} fontSize="9" fill={labelColor} fontWeight="600" fontFamily="Inter, sans-serif" className="hidden sm:block">
                  {db > 0 ? `+${db}` : db}
                </text>
                <text x={6} y={y + 3} fontSize="9" fill={labelColor} fontWeight="600" fontFamily="Inter, sans-serif" className="hidden sm:block">
                  {db > 0 ? `+${db}` : db}
                </text>
              </g>
            );
          })}

          {/* Minor Frequency Lines */}
          {minorFreqs.map((f, i) => {
            const x = getX(f);
            return (
              <line key={`minor-${i}`} x1={x} y1={paddingY} x2={x} y2={height - paddingY} stroke={gridColorMinor} strokeWidth="1" />
            );
          })}

          {/* Main Frequency Grid */}
          {gridFreqs.map((f, i) => {
            const x = getX(f);
            return (
              <g key={`grid-f-${i}`}>
                <line x1={x} y1={paddingY} x2={x} y2={height - paddingY} stroke={gridColorMain} strokeWidth="1" />
                <text x={x} y={height - 12} fontSize="9" fill={labelColor} textAnchor="middle" fontWeight="bold" fontFamily="Inter, sans-serif" className="hidden sm:block">
                  {f >= 1000 ? `${f/1000}kHz` : `${f}Hz`}
                </text>
              </g>
            );
          })}
          
          <defs>
            <linearGradient id="pro-eq-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.05" />
            </linearGradient>
            <filter id="pro-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Filled Area */}
          <path d={`${pathData} Z`} fill="url(#pro-eq-fill)" />
          
          {/* Subtle Spectrum Ghosting (Aesthetic Only) */}
          <path 
            d={`M ${paddingX},${height - paddingY} ` + curvePoints.map((p, i) => `L ${p[0]},${Math.min(height - paddingY, p[1] + 10 + Math.sin(i * 0.1) * 3)}`).join(' ') + ` L ${width - paddingX},${height - paddingY}`}
            fill="rgba(255,255,255,0.02)"
          />

          {/* Main Curve */}
          <path d={pathData} fill="none" stroke={lineColor} strokeWidth="3" filter="url(#pro-glow)" strokeLinecap="round" strokeLinejoin="round" />

          {/* Nodes */}
          {bands.map((band, idx) => {
            const x = getX(band.hz);
            const y = getY(band.db);
            const isHovered = hoveredBand === idx;
            
            return (
              <g key={`node-${idx}`} 
                 onMouseEnter={() => setHoveredBand(idx)}
                 onMouseLeave={() => setHoveredBand(null)}
                 className="cursor-pointer transition-all">
                {/* Connector line */}
                <line x1={x} y1={getY(0)} x2={x} y2={y} stroke={lineColor} strokeWidth="1" strokeDasharray="3 3" opacity={isHovered ? 1 : 0.4} />
                
                {/* Node Ring */}
                <circle cx={x} cy={y} r={isHovered ? "8" : "6"} fill={bgColor} stroke={lineColor} strokeWidth="2.5" />
                <circle cx={x} cy={y} r="3" fill={lineColor} />

                {/* Info Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                      <rect x={x - 45} y={y - 45} width="90" height="35" rx="8" fill="rgba(0,0,0,0.9)" stroke="rgba(255,255,255,0.2)" />
                      <text x={x} y={y - 32} fontSize="9" fill="white" fontWeight="black" textAnchor="middle" className="uppercase tracking-tighter">
                        {band.hz >= 1000 ? `${(band.hz/1000).toFixed(1)}k` : Math.round(band.hz)} Hz
                      </text>
                      <text x={x} y={y - 20} fontSize="10" fill={lineColor} fontWeight="black" textAnchor="middle">
                        {band.db > 0 ? '+' : ''}{band.db.toFixed(1)} dB
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>

        {/* Bottom Controls Bar (Aesthetic) */}
        <div className="h-10 border-t border-white/5 bg-white/[0.02] hidden sm:flex items-center px-6 gap-6 relative">
             <div className="flex gap-4">
                <div className="flex items-center gap-1.5 opacity-40">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white">Analyzer</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-sky-400">EQ Active</span>
                </div>
             </div>
             <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
                 <div className="text-[9px] font-black text-white/30 tracking-[0.3em] uppercase">Algorithm V3.1</div>
             </div>
             <div className="ml-auto flex gap-3">
                 <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
                 <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
             </div>
        </div>
      </div>
    </div>
  );
};
