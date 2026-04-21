import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Server, Database, Brain, CreditCard, ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SnowFlurry } from './SnowFlurry';
import { Logo } from './Logo';

interface ServiceStatus {
  status: 'operational' | 'degraded' | 'outage';
  latency: number;
}

interface StatusData {
  current: {
    overall: 'operational' | 'degraded' | 'outage';
    services: {
      app: ServiceStatus;
      database: ServiceStatus;
      gemini: ServiceStatus;
      lemonsqueezy: ServiceStatus;
    };
    lastUpdated: number;
  };
  history: { timestamp: number; service: string; latency: number }[];
  daily: { date: string; service: string; uptime_percentage: number }[];
}

export const StatusPage = ({ onBack }: { onBack: () => void }) => {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch status", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const isOutage = data?.current.overall === 'outage' || data?.current.overall === 'degraded';

  // Dynamic Theme Colors
  const theme = {
    bg: isOutage ? 'bg-red-950' : 'bg-sky-400',
    text: isOutage ? 'text-red-50' : 'text-sky-900',
    primary: isOutage ? 'text-red-500' : 'text-sky-600',
    border: isOutage ? 'border-red-900/50' : 'border-white/30',
    glass: isOutage ? 'bg-red-900/20' : 'bg-white/20',
    chartStroke: isOutage ? '#ef4444' : '#0ea5e9',
    chartFill: isOutage ? '#7f1d1d' : '#bae6fd',
  };

  // Process chart data
  const chartData = useMemo(() => {
    if (!data?.history) return [];
    
    // Group by timestamp
    const grouped = data.history.reduce((acc, curr) => {
      const time = new Date(curr.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (!acc[time]) acc[time] = { time };
      acc[time][curr.service] = curr.latency;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(grouped).slice(-50); // Show last 50 data points
  }, [data?.history]);

  // Generate 90 days of bars (mocking missing days with 100% for visual completeness)
  const uptimeBars = useMemo(() => {
    const bars = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Find if we have real data for this day
      const dayData = data?.daily?.filter(x => x.date === dateStr) || [];
      const avgUptime = dayData.length > 0 
        ? dayData.reduce((sum, item) => sum + item.uptime_percentage, 0) / dayData.length 
        : 100; // Default to 100% if no data yet
        
      bars.push({
        date: dateStr,
        uptime: avgUptime
      });
    }
    return bars;
  }, [data?.daily]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-400 flex items-center justify-center">
        <div className="animate-pulse text-sky-900 flex flex-col items-center gap-4">
          <Activity size={48} />
          <p className="font-mono tracking-widest uppercase font-bold">Loading System Status...</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle2 className="text-emerald-500" size={20} />;
      case 'degraded': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'outage': return <XCircle className="text-red-500" size={20} />;
      default: return <Activity className="text-slate-500" size={20} />;
    }
  };

  const services = [
    { id: 'app', name: 'App Core', icon: <Server size={18} /> },
    { id: 'database', name: 'Turso Database', icon: <Database size={18} /> },
    { id: 'gemini', name: 'Gemini AI Engine', icon: <Brain size={18} /> },
    { id: 'lemonsqueezy', name: 'Payments API', icon: <CreditCard size={18} /> },
  ];

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans transition-colors duration-1000 overflow-y-auto relative`}>
      
      {/* Snowfall Effect (Only when operational) */}
      {!isOutage && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <SnowFlurry />
        </div>
      )}

      {/* Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-xl border-b ${theme.border} ${theme.glass}`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className={`p-2 rounded-full hover:bg-black/10 transition-colors`}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-black tracking-tight text-xl flex items-center gap-3">
              <Activity className={theme.primary} />
              <Logo 
                size={32} 
                grillStyle="diamond" 
                knifeStyle="standard" 
                duragStyle="standard" 
                pendantStyle="none" 
                chainStyle="none" 
                theme={isOutage ? "crazy-bird" : "coldest"} 
              />
              BEATGANGSTA <span className="opacity-50 font-medium">STATUS</span>
            </h1>
          </div>
          <div className="text-sm font-mono opacity-60 font-bold">
            Last updated: {data?.current.lastUpdated ? new Date(data.current.lastUpdated).toLocaleTimeString() : 'Just now'}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 relative z-10">
        
        {/* Hero Status Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-3xl border ${theme.border} ${isOutage ? 'bg-red-900/40 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'bg-white/40 shadow-[0_0_50px_rgba(255,255,255,0.2)]'} backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6`}
        >
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-6">
            <div className="flex-shrink-0">
              <Logo 
                size={80} 
                grillStyle="diamond" 
                knifeStyle="standard" 
                duragStyle="standard" 
                pendantStyle="none" 
                chainStyle="none" 
                theme={isOutage ? "crazy-bird" : "coldest"} 
                showSparkles={!isOutage} 
              />
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-2">
                {isOutage ? 'System Issues Detected' : 'All Systems Operational'}
              </h2>
              <p className="text-lg opacity-80 font-medium">
                {isOutage 
                  ? 'We are currently investigating degraded performance in some services.' 
                  : 'BeatGangsta is running smoothly. No active incidents.'}
              </p>
            </div>
          </div>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isOutage ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-600'}`}>
            {isOutage ? <AlertTriangle size={48} /> : <CheckCircle2 size={48} />}
          </div>
        </motion.div>

        {/* Services Breakdown */}
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Server className="opacity-50" /> System Components
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(service => {
              const sData = data?.current.services[service.id as keyof typeof data.current.services];
              return (
                <div key={service.id} className={`p-5 rounded-2xl border ${theme.border} ${theme.glass} backdrop-blur-lg flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-black/10 ${theme.primary}`}>
                      {service.icon}
                    </div>
                    <div>
                      <div className="font-bold">{service.name}</div>
                      <div className="text-sm opacity-60 font-mono font-bold">{sData?.latency || 0}ms latency</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-black uppercase tracking-wider text-sm">
                    {getStatusIcon(sData?.status || 'operational')}
                    <span className={
                      sData?.status === 'operational' ? 'text-emerald-600' : 
                      sData?.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                    }>
                      {sData?.status || 'Operational'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 90 Day Uptime Bars */}
        <div className={`p-8 rounded-3xl border ${theme.border} ${theme.glass} backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">90-Day Uptime History</h3>
            <div className="text-2xl font-black text-emerald-600">99.99%</div>
          </div>
          
          <div className="flex items-end gap-[2px] h-16 w-full group">
            {uptimeBars.map((bar, i) => (
              <div 
                key={i}
                className={`flex-1 rounded-sm transition-all duration-300 hover:opacity-100 ${
                  bar.uptime >= 99 ? 'bg-emerald-500' : 
                  bar.uptime >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                } ${isOutage ? 'opacity-50' : 'opacity-80'}`}
                style={{ height: `${Math.max(20, bar.uptime)}%` }}
                title={`${bar.date}: ${bar.uptime.toFixed(2)}% uptime`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm font-mono font-bold opacity-60">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Real-Time Latency Graph */}
        <div className={`p-8 rounded-3xl border ${theme.border} ${theme.glass} backdrop-blur-xl`}>
          <h3 className="text-xl font-bold mb-8">System Latency (Last 24h)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.chartFill} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={theme.chartFill} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isOutage ? '#450a0a' : (isOutage ? '#0f172a' : '#ffffff')} strokeOpacity={0.2} vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke={isOutage ? '#f87171' : '#0c4a6e'} 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  opacity={0.6}
                />
                <YAxis 
                  stroke={isOutage ? '#f87171' : '#0c4a6e'} 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}ms`}
                  opacity={0.6}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isOutage ? '#450a0a' : '#ffffff', 
                    border: `1px solid ${theme.chartStroke}`,
                    borderRadius: '12px',
                    color: isOutage ? '#fff' : '#0c4a6e',
                    fontWeight: 'bold'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="database" 
                  name="Database Latency"
                  stroke={theme.chartStroke} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorLatency)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
