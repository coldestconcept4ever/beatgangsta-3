import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, HelpCircle, Activity, Settings, RefreshCw, EyeOff, CheckSquare } from 'lucide-react';

interface EQBand {
  hz: number;
  db: number;
  q: number;
  type: 'bell' | 'lowshelf' | 'highshelf' | 'lowpass' | 'highpass' | 'notch';
  hzParamIdx: number;   // Index in parameters array
  dbParamIdx: number;   // Index in parameters array
  qParamIdx?: number;   // Index in parameters array
  typeParamIdx?: number; // Index in parameters array
  bandIndex: number;    // Filter number (1-5)
}

interface EQVisualizerProps {
  parameters: { parameter: string; value: string; explanation?: string }[];
  theme: string;
  onUpdateParameters?: (updated: { parameter: string; value: string; explanation?: string }[]) => void;
}

// Log mappings for ReEQ
const sliderToHz = (val: number) => 10 * Math.pow(24000 / 10, val / 100);
const hzToSlider = (hz: number) => 100 * Math.log10(hz / 10) / Math.log10(2400);

const sliderToQ = (val: number) => 0.05 * Math.pow(20 / 0.05, val / 100);
const qToSlider = (q: number) => 100 * Math.log10(q / 0.05) / Math.log10(400);

export const EQVisualizer: React.FC<EQVisualizerProps> = ({ parameters, theme, onUpdateParameters }) => {
  const [hoveredBand, setHoveredBand] = useState<number | null>(null);
  const [selectedBandIdx, setSelectedBandIdx] = useState<number | null>(null);
  const [draggedBandIdx, setDraggedBandIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const isReEQ = useMemo(() => {
    return parameters.some(p => p.parameter.includes('Filter1') || p.parameter.includes('-Filter1'));
  }, [parameters]);

  // Parse bands from parameters
  const bands = useMemo(() => {
    const extracted: EQBand[] = [];

    if (isReEQ) {
      // Parse ReEQ sliders (supports up to 16 bands)
      for (let i = 1; i <= 16; i++) {
        const freqParam = parameters.find(p => p.parameter.includes(`Filter${i} Frequency`) || p.parameter.includes(`-Filter${i} Frequency`));
        const gainParam = parameters.find(p => p.parameter.includes(`Filter${i} Gain`) || p.parameter.includes(`-Filter${i} Gain`));
        const qParam = parameters.find(p => p.parameter.includes(`Filter${i} Q`) || p.parameter.includes(`-Filter${i} Q`));
        const typeParam = parameters.find(p => p.parameter.includes(`Filter${i} Type`) || p.parameter.includes(`-Filter${i} Type`));

        if (freqParam) {
          const freqSliderVal = parseFloat(freqParam.value) || 0;
          const hz = sliderToHz(freqSliderVal);

          const gain = gainParam ? parseFloat(gainParam.value) : 0;

          const qSliderVal = qParam ? parseFloat(qParam.value) : 43.4; // Default to slider 43.4 (Q=0.707)
          const q = sliderToQ(qSliderVal);

          const typeVal = typeParam ? parseInt(typeParam.value) : 0;
          let type: EQBand['type'] = 'bell';
          if (typeVal === 1) type = 'lowshelf';
          else if (typeVal === 2) type = 'highshelf';
          else if (typeVal === 3) type = 'lowpass';
          else if (typeVal === 4) type = 'highpass';
          else if (typeVal === 6) type = 'notch';

          extracted.push({
            hz,
            db: gain,
            q,
            type,
            hzParamIdx: parameters.indexOf(freqParam),
            dbParamIdx: gainParam ? parameters.indexOf(gainParam) : -1,
            qParamIdx: qParam ? parameters.indexOf(qParam) : -1,
            typeParamIdx: typeParam ? parameters.indexOf(typeParam) : -1,
            bandIndex: i
          });
        }
      }
    } else {
      // Generic EQ parser (e.g. Pro-Q suggestions or other EQs)
      parameters.forEach((d, dIdx) => {
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
          extracted.push({
            hz,
            db,
            q,
            type,
            hzParamIdx: dIdx,
            dbParamIdx: dIdx, // Shared idx for editing
            bandIndex: extracted.length + 1
          });
        }
      });
    }

    return extracted;
  }, [parameters, isReEQ]);

  // Dimension variables
  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;
  const maxDb = 30; // Scale from -30dB to +30dB
  
  // Grid values
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

  // Node Dragging Handling
  useEffect(() => {
    if (draggedBandIdx === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      
      const svgX = (clientX / rect.width) * width;
      const svgY = (clientY / rect.height) * height;
      
      const minLog = Math.log10(10);
      const maxLog = Math.log10(24000);
      const svgXClamped = Math.max(paddingX, Math.min(width - paddingX, svgX));
      const fLog = minLog + ((svgXClamped - paddingX) / graphWidth) * (maxLog - minLog);
      const newHz = Math.pow(10, fLog);
      
      const svgYClamped = Math.max(paddingY, Math.min(height - paddingY, svgY));
      const newDb = maxDb * (paddingY + (graphHeight / 2) - svgYClamped) / (graphHeight / 2);
      
      if (onUpdateParameters) {
        const band = bands[draggedBandIdx];
        const updated = [...parameters];
        
        if (isReEQ) {
          if (band.hzParamIdx >= 0) {
            const sliderFreq = hzToSlider(newHz);
            updated[band.hzParamIdx] = {
              ...updated[band.hzParamIdx],
              value: sliderFreq.toFixed(2)
            };
          }
          if (band.dbParamIdx >= 0) {
            const clampedGain = Math.max(-18, Math.min(18, newDb));
            updated[band.dbParamIdx] = {
              ...updated[band.dbParamIdx],
              value: clampedGain.toFixed(2)
            };
          }
        } else {
          // Generic update
          const param = updated[band.hzParamIdx];
          const hasKhz = param.value.toLowerCase().includes('k');
          const hzStr = hasKhz ? `${(newHz / 1000).toFixed(1)}k Hz` : `${Math.round(newHz)} Hz`;
          const dbStr = `${newDb > 0 ? '+' : ''}${newDb.toFixed(1)} dB`;
          
          updated[band.hzParamIdx] = {
            ...param,
            value: `${hzStr}, ${dbStr}`
          };
        }
        onUpdateParameters(updated);
      }
    };

    const handleMouseUp = () => {
      setDraggedBandIdx(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedBandIdx, bands, parameters, onUpdateParameters, isReEQ, graphWidth, graphHeight, maxDb, paddingX, paddingY, width, height]);

  const handleMouseDown = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedBandIdx(idx);
    setSelectedBandIdx(idx);
  };

  const handleWheel = (idx: number, e: React.WheelEvent) => {
    e.preventDefault();
    if (!onUpdateParameters) return;
    
    const band = bands[idx];
    if (isReEQ && band.qParamIdx !== undefined && band.qParamIdx >= 0) {
      const currentSliderQ = parseFloat(parameters[band.qParamIdx].value) || 43.4;
      const step = e.deltaY < 0 ? 3 : -3;
      const nextSliderQ = Math.max(0, Math.min(100, currentSliderQ + step));
      
      const updated = [...parameters];
      updated[band.qParamIdx] = {
        ...updated[band.qParamIdx],
        value: nextSliderQ.toFixed(2)
      };
      onUpdateParameters(updated);
    }
  };

  const handleUpdateFilterType = (typeIndex: number) => {
    if (selectedBandIdx === null || !onUpdateParameters) return;
    const band = bands[selectedBandIdx];
    if (isReEQ && band.typeParamIdx !== undefined && band.typeParamIdx >= 0) {
      const updated = [...parameters];
      updated[band.typeParamIdx] = {
        ...updated[band.typeParamIdx],
        value: String(typeIndex)
      };
      onUpdateParameters(updated);
    }
  };

  const handleUpdateQSlider = (val: number) => {
    if (selectedBandIdx === null || !onUpdateParameters) return;
    const band = bands[selectedBandIdx];
    if (isReEQ && band.qParamIdx !== undefined && band.qParamIdx >= 0) {
      const updated = [...parameters];
      updated[band.qParamIdx] = {
        ...updated[band.qParamIdx],
        value: val.toFixed(1)
      };
      onUpdateParameters(updated);
    }
  };

  if (bands.length === 0) return null;

  // Calculate curve points
  const curvePoints: [number, number][] = [];
  const resolution = 300; 
  
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
  
  // Theme styling
  const isColdest = theme === 'coldest';
  const gridColorMain = 'rgba(255,255,255,0.08)';
  const gridColorMinor = 'rgba(255,255,255,0.03)';
  const labelColor = 'rgba(255,255,255,0.4)';
  const lineColor = isColdest ? '#0ea5e9' : '#8b5cf6';
  const glowColor = isColdest ? 'rgba(14, 165, 233, 0.4)' : 'rgba(139, 92, 246, 0.4)';
  const fillColor = isColdest ? 'rgba(14, 165, 233, 0.15)' : 'rgba(139, 92, 246, 0.15)';
  const bgColor = '#0d0d0f';

  const activeBand = selectedBandIdx !== null ? bands[selectedBandIdx] : null;

  return (
    <div className="w-full relative py-2 px-1 select-none group/eq">
      <div className="relative rounded-2xl overflow-hidden border shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]" 
           style={{ backgroundColor: bgColor, borderColor: 'rgba(255,255,255,0.1)' }}>
        
        {/* Pro Header Details */}
        <div className="absolute top-2.5 left-5 flex items-center gap-2 pointer-events-none z-10">
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">ReEQ Advanced GUI</div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_6px_#10b981]" />
        </div>
        
        <div className="absolute top-2.5 right-5 flex items-center gap-2 text-[8px] font-bold text-white/30 uppercase tracking-widest pointer-events-none z-10">
          Interactive Link Active
        </div>

        {/* SVG Drawing Canvas */}
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`} 
          preserveAspectRatio="xMidYMid meet" 
          className="block w-full h-full"
        >
          <rect width={width} height={height} fill="transparent" onClick={() => setSelectedBandIdx(null)} />
          
          {/* dB Lines */}
          {dbLines.map((db, i) => {
            const y = getY(db);
            return (
              <g key={`db-${i}`}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} 
                      stroke={db === 0 ? 'rgba(255,255,255,0.18)' : gridColorMain} 
                      strokeWidth={db === 0 ? "1.5" : "1"} 
                      strokeDasharray={db === 0 ? "0" : "3 3"} />
                <text x={width - paddingX + 5} y={y + 3} fontSize="8" fill={labelColor} fontWeight="600" fontFamily="Inter, sans-serif" className="hidden sm:block text-right">
                  {db > 0 ? `+${db}` : db}
                </text>
                <text x={10} y={y + 3} fontSize="8" fill={labelColor} fontWeight="600" fontFamily="Inter, sans-serif" className="hidden sm:block">
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
                <text x={x} y={height - 10} fontSize="8" fill={labelColor} textAnchor="middle" fontWeight="bold" fontFamily="Inter, sans-serif" className="hidden sm:block">
                  {f >= 1000 ? `${f/1000}kHz` : `${f}Hz`}
                </text>
              </g>
            );
          })}
          
          <defs>
            <linearGradient id="pro-eq-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
            </linearGradient>
            <filter id="pro-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Filled Area */}
          <path d={`${pathData} Z`} fill="url(#pro-eq-fill)" className="pointer-events-none" />
          
          {/* Main EQ Curve */}
          <path d={pathData} fill="none" stroke={lineColor} strokeWidth="3" filter="url(#pro-glow)" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none" />

          {/* Interactive Band Nodes */}
          {bands.map((band, idx) => {
            const x = getX(band.hz);
            const y = getY(band.db);
            const isHovered = hoveredBand === idx;
            const isSelected = selectedBandIdx === idx;
            
            return (
              <g key={`node-${idx}`} 
                 onMouseEnter={() => setHoveredBand(idx)}
                 onMouseLeave={() => setHoveredBand(null)}
                 onWheel={(e) => handleWheel(idx, e)}
                 onMouseDown={(e) => handleMouseDown(idx, e)}
                 className="cursor-grab active:cursor-grabbing">
                
                {/* Visual Connector */}
                <line x1={x} y1={getY(0)} x2={x} y2={y} stroke={lineColor} strokeWidth="1" strokeDasharray="2 2" opacity={isHovered || isSelected ? 0.9 : 0.3} />
                
                {/* Node Circles */}
                <circle cx={x} cy={y} r={isSelected ? "11" : isHovered ? "9" : "7.5"} fill={bgColor} stroke={isSelected ? "#10b981" : lineColor} strokeWidth={isSelected ? "3" : "2.5"} />
                <circle cx={x} cy={y} r="3" fill={isSelected ? "#10b981" : lineColor} />
                <text x={x} y={y - 14} fontSize="8" fill={isSelected ? "#10b981" : "white"} fontWeight="black" textAnchor="middle" className="pointer-events-none">
                  {band.bandIndex}
                </text>

                {/* Micro Node Info Badge */}
                <AnimatePresence>
                  {(isHovered || isSelected) && (
                    <g className="pointer-events-none">
                      <rect x={x - 45} y={y - 50} width="90" height="32" rx="6" fill="rgba(10,10,12,0.95)" stroke={isSelected ? "#10b981" : "rgba(255,255,255,0.15)"} strokeWidth="1" />
                      <text x={x} y={y - 39} fontSize="8" fill="white" fontWeight="black" textAnchor="middle" className="uppercase tracking-widest">
                        {band.hz >= 1000 ? `${(band.hz/1000).toFixed(1)}k` : Math.round(band.hz)} Hz
                      </text>
                      <text x={x} y={y - 28} fontSize="9" fill={isSelected ? "#10b981" : lineColor} fontWeight="black" textAnchor="middle">
                        {band.db > 0 ? '+' : ''}{band.db.toFixed(1)} dB • Q:{band.q.toFixed(2)}
                      </text>
                    </g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Interactive Band Parameter Control Strip */}
        <AnimatePresence mode="wait">
          {activeBand ? (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 48, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5 bg-black/40 flex items-center px-4 sm:px-6 justify-between gap-4 select-none"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 text-[10px] font-black text-[#10b981] uppercase tracking-wider">
                  Band {activeBand.bandIndex}
                </span>
                
                {/* Filter Shapes Controls for ReEQ */}
                {isReEQ && activeBand.typeParamIdx !== undefined && (
                  <div className="flex items-center gap-1.5 bg-zinc-900/80 p-0.5 rounded-lg border border-white/5">
                    {[
                      { idx: 0, label: 'Bell', short: 'Peak' },
                      { idx: 1, label: 'Low Shelf', short: 'L.Shelf' },
                      { idx: 2, label: 'High Shelf', short: 'H.Shelf' },
                      { idx: 3, label: 'Low Pass', short: 'LPF' },
                      { idx: 4, label: 'High Pass', short: 'HPF' },
                      { idx: 6, label: 'Notch', short: 'Notch' }
                    ].map((shape) => {
                      const isActive = (shape.idx === 0 && activeBand.type === 'bell') ||
                                       (shape.idx === 1 && activeBand.type === 'lowshelf') ||
                                       (shape.idx === 2 && activeBand.type === 'highshelf') ||
                                       (shape.idx === 3 && activeBand.type === 'lowpass') ||
                                       (shape.idx === 4 && activeBand.type === 'highpass') ||
                                       (shape.idx === 6 && activeBand.type === 'notch');
                      return (
                        <button
                          key={shape.idx}
                          onClick={() => handleUpdateFilterType(shape.idx)}
                          className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded transition-all ${
                            isActive ? 'bg-[#10b981] text-black shadow-lg shadow-[#10b981]/20 font-black' : 'text-white/40 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {shape.short}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Slider details */}
              <div className="flex items-center gap-6">
                {/* Q Factor Controller */}
                {isReEQ && activeBand.qParamIdx !== undefined && (
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Q Factor</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={qToSlider(activeBand.q)}
                      onChange={(e) => handleUpdateQSlider(parseFloat(e.target.value))}
                      className="w-16 sm:w-24 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                    />
                    <span className="text-[9px] font-mono font-bold text-[#10b981] w-8">
                      {activeBand.q.toFixed(2)}
                    </span>
                  </div>
                )}
                
                {/* Quick numeric display */}
                <div className="hidden md:flex items-center gap-4 text-[9px] font-mono text-white/50 border-l border-white/5 pl-4">
                  <div>FREQ: <span className="font-bold text-white">{Math.round(activeBand.hz)}Hz</span></div>
                  <div>GAIN: <span className="font-bold text-white">{activeBand.db > 0 ? '+' : ''}{activeBand.db.toFixed(1)}dB</span></div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ height: 40, opacity: 0 }}
              animate={{ height: 40, opacity: 1 }}
              className="border-t border-white/5 bg-white/[0.01] flex items-center px-6 gap-6 justify-between relative text-[8px] font-black uppercase tracking-[0.25em]"
            >
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span className="text-white">EQ Filter Active</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-30">
                  <span className="text-white/50">Pro Mode</span>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/25">
                 Drag Nodes to Adjust • Scroll over Node to Adjust Q
              </div>
              <div className="flex items-center gap-1 opacity-40">
                <Sliders className="w-3 h-3 text-white" />
                <span>Standard ReEQ Range</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
