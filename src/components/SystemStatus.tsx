import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SystemStatusProps {
  onClick: () => void;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ onClick }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'operational' | 'degraded' | 'outage' | 'loading'>('loading');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error('Failed to fetch status');
        const data = await response.json();
        
        setStatus(data.current?.overall || 'operational');
      } catch (error) {
        setStatus('degraded');
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'operational': return 'bg-emerald-500';
      case 'degraded': return 'bg-yellow-500';
      case 'outage': return 'bg-red-500';
      case 'loading': return 'bg-gray-500';
      default: return 'bg-emerald-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'operational': return t('status_operational', 'All systems operational');
      case 'degraded': return t('status_degraded', 'Degraded performance');
      case 'outage': return t('status_outage', 'System outage');
      case 'loading': return t('status_loading', 'Checking status...');
      default: return t('status_operational', 'All systems operational');
    }
  };

  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors border border-white/5 cursor-pointer"
      title={getStatusText()}
    >
      <div className="relative flex h-2.5 w-2.5">
        {status !== 'loading' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getStatusColor()}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${getStatusColor()}`}></span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 hidden sm:inline-block">
        {t('system_status', 'Status')}
      </span>
    </button>
  );
};
