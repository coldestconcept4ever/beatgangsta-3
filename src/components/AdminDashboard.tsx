import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Database, 
  Search, 
  Download, 
  Zap, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Mail, 
  User as UserIcon,
  Clock,
  Package,
  ArrowLeft,
  RefreshCw,
  Filter,
  AlertTriangle,
  CreditCard,
  Bitcoin,
  DollarSign,
  TrendingUp,
  Receipt,
  Edit,
  Check
} from 'lucide-react';

interface Purchase {
  id: string;
  uid: string;
  provider: string;
  amount_fiat: number;
  currency: string;
  pay_currency?: string;
  credits_awarded: number;
  status: string;
  created_at: string;
}

interface GearItem {
  uid: string;
  vendor: string;
  name: string;
  type: string;
  version?: string;
  tier?: string;
  last_modified: string;
}

interface UserData {
  uid: string;
  email: string;
  name: string;
  photo: string;
  credits: number;
  role: string;
  gear?: GearItem[];
  purchases?: Purchase[];
  totalSpent?: number;
}

export const AdminDashboard = ({ onBack, theme }: { onBack: () => void, theme: string }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCredits: 0,
    totalPluginsRecorded: 0,
    totalRevenue: 0
  });

  const [isEditingCredits, setIsEditingCredits] = useState(false);
  const [editCreditsValue, setEditCreditsValue] = useState(0);
  const [updatingCredits, setUpdatingCredits] = useState(false);

  const handleSaveCredits = async () => {
    if (!selectedUser) return;
    setUpdatingCredits(true);
    try {
      const masterKey = localStorage.getItem('_master_key_temp') || '';
      const res = await fetch(`/api/admin/update-credits?key=${masterKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetUid: selectedUser.uid,
          newCredits: editCreditsValue
        })
      });
      if (!res.ok) throw new Error('Failed to update credits');
      
      // Update local state
      setUsers(prev => prev.map(u => u.uid === selectedUser.uid ? { ...u, credits: editCreditsValue } : u));
      setSelectedUser(prev => prev ? { ...prev, credits: editCreditsValue } : null);
      setIsEditingCredits(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingCredits(false);
    }
  };

  const [viewMode, setViewMode] = useState<'users' | 'beta'>('users');
  const [betaApplications, setBetaApplications] = useState<any[]>([]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const masterKey = localStorage.getItem('_master_key_temp') || '';
      
      if (viewMode === 'users') {
        const res = await fetch(`/api/admin/users-data?key=${masterKey}`);
        if (!res.ok) throw new Error('Failed to fetch admin data');
        const data = await res.json();
        setUsers(data.users);
        setStats(data.stats);
      } else if (viewMode === 'beta') {
        const res = await fetch(`/api/admin/beta-applications?key=${masterKey}`);
        if (!res.ok) throw new Error('Failed to fetch beta applications');
        const data = await res.json();
        setBetaApplications(data.applications || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [viewMode]);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCSV = () => {
    const masterKey = localStorage.getItem('_master_key_temp') || '';
    window.open(`/api/admin/download-plugin-usage?key=${masterKey}`, '_blank');
  };

  const dashboardTheme = {
    bg: theme === 'coldest' ? 'bg-slate-50' : 'bg-[#050505]',
    card: theme === 'coldest' ? 'bg-white border-slate-200' : 'bg-[#111] border-white/10',
    text: theme === 'coldest' ? 'text-slate-900' : 'text-white',
    textMuted: theme === 'coldest' ? 'text-slate-500' : 'text-white/50',
    accent: theme === 'coldest' ? 'bg-sky-500' : 'bg-red-600',
    hover: theme === 'coldest' ? 'hover:bg-slate-100' : 'hover:bg-white/5',
  };

  return (
    <div className={`fixed inset-0 z-[500] flex flex-col ${dashboardTheme.bg} ${dashboardTheme.text} overflow-hidden`}>
      {/* Header */}
      <header className={`h-16 flex items-center justify-between px-4 md:px-6 border-b ${dashboardTheme.card} backdrop-blur-xl z-30`}>
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <button 
            onClick={selectedUser ? () => setSelectedUser(null) : onBack}
            className={`p-2 rounded-full ${dashboardTheme.hover} transition-colors shrink-0`}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 overflow-hidden">
            <Database className={`${theme === 'coldest' ? 'text-sky-500' : 'text-red-500'} shrink-0`} size={20} />
            <h1 className="font-black uppercase tracking-tighter text-sm md:text-lg truncate">
              {selectedUser ? (
                <span className="flex items-center gap-2">
                  <span className="hidden xs:inline">User:</span> {selectedUser.name}
                </span>
              ) : (
                <>Turso Admin <span className="hidden sm:inline opacity-50 font-medium">Dashboard</span></>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {!selectedUser && (
            <>
              <div className="flex bg-black/20 rounded-xl overflow-hidden p-1 mr-2 border border-current/5">
                <button
                  onClick={() => setViewMode('users')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${viewMode === 'users' ? 'bg-current/10' : 'opacity-50 hover:opacity-100'}`}
                >
                  Users
                </button>
                <button
                  onClick={() => setViewMode('beta')}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${viewMode === 'beta' ? 'bg-current/10' : 'opacity-50 hover:opacity-100'}`}
                >
                  Beta Apps
                </button>
              </div>

              <button 
                onClick={fetchAdminData}
                className={`p-2 rounded-xl ${dashboardTheme.hover} transition-colors`}
                title="Refresh Data"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </>
          )}
          <button 
            onClick={handleDownloadCSV}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] md:text-xs font-black uppercase tracking-widest transition-all active:scale-95`}
          >
            <Download size={14} />
            <span className="hidden xs:inline">Export</span>
            <span className="hidden md:inline">CSV</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {viewMode === 'users' ? (
          <>
            {/* Sidebar / User List */}
            <aside className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r ${dashboardTheme.card} flex-col overflow-hidden z-20`}>
              <div className="p-4 border-b border-current/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border ${dashboardTheme.card} bg-transparent focus:outline-none focus:ring-2 focus:ring-current/20`}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loading ? (
                  Array(8).fill(0).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl animate-pulse bg-current/5" />
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map(u => (
                    <button
                      key={u.uid}
                      onClick={() => setSelectedUser(u)}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left ${selectedUser?.uid === u.uid ? (theme === 'coldest' ? 'bg-sky-50 border-sky-100' : 'bg-red-500/10 border-red-500/20') : dashboardTheme.hover}`}
                    >
                      <img src={u.photo} alt="" className="w-10 h-10 rounded-full border border-current/10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black truncate">{u.name}</p>
                        <p className="text-[10px] opacity-50 truncate">{u.email}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-0.5 text-yellow-500">
                          <Zap size={10} className="fill-current" />
                          <span className="text-[10px] font-black">{u.credits}</span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center opacity-30">
                    <Users size={32} className="mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase">No users found</p>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <main className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-1 overflow-y-auto p-4 md:p-8 bg-inherit z-10`}>
              {selectedUser ? (
                <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8">
              {/* User Header */}
              <div className={`p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border ${dashboardTheme.card} flex flex-col md:flex-row items-center gap-6 md:gap-8`}>
                <img src={selectedUser.photo} alt="" className="w-24 h-24 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border-4 border-current/5" />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 mb-2">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter break-all">{selectedUser.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedUser.role === 'admin' ? 'bg-purple-500/20 text-purple-500' : 'bg-current/10 opacity-50'}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 opacity-60 text-[11px] md:text-sm font-medium">
                    <div className="flex items-center gap-1.5 truncate max-w-full">
                      <Mail size={14} className="shrink-0" />
                      <span className="truncate">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate max-w-full">
                      <Clock size={14} className="shrink-0" />
                      <span className="truncate">ID: {selectedUser.uid}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-end gap-1 md:gap-2">
                  <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-40">Total Spent</div>
                  <div className="flex items-center gap-1.5 text-xl md:text-2xl font-black text-emerald-500">
                    <DollarSign size={18} />
                    {selectedUser.totalSpent?.toFixed(2)}
                  </div>
                  <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-40 mt-2">Credits Available</div>
                  <div className="flex items-center gap-3">
                    {isEditingCredits ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={editCreditsValue}
                          onChange={(e) => setEditCreditsValue(parseInt(e.target.value) || 0)}
                          className={`w-24 px-3 py-1 rounded-xl text-xl font-black focus:outline-none focus:ring-2 focus:ring-yellow-500/50 ${theme === 'coldest' ? 'bg-slate-100 border-slate-200' : 'bg-white/10 border-white/20'}`}
                        />
                        <button 
                          onClick={handleSaveCredits}
                          disabled={updatingCredits}
                          className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 active:scale-95 disabled:opacity-50 transition-all shadow-lg"
                        >
                          {updatingCredits ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} />}
                        </button>
                        <button 
                          onClick={() => setIsEditingCredits(false)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center hover:bg-current/10 active:scale-95 transition-all ${theme === 'coldest' ? 'bg-slate-100' : 'bg-white/10'}`}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-3xl md:text-4xl font-black text-yellow-500">
                          <Zap size={24} className="fill-current md:w-8 md:h-8" />
                          {selectedUser.credits}
                        </div>
                        <button 
                          onClick={() => {
                            setEditCreditsValue(selectedUser.credits);
                            setIsEditingCredits(true);
                          }}
                          className={`p-2 rounded-xl transition-all active:scale-95 ${theme === 'coldest' ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-white/30'}`}
                        >
                          <Edit size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Transaction History Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <Receipt className="opacity-50" size={20} /> Transaction History
                  </h3>
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                    {selectedUser.purchases?.length || 0} Transactions Found
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 md:gap-3">
                  {selectedUser.purchases && selectedUser.purchases.length > 0 ? (
                    selectedUser.purchases.map((p) => (
                      <div 
                        key={p.id} 
                        className={`p-3 md:p-4 rounded-xl md:rounded-2xl border ${dashboardTheme.card} flex items-center justify-between group transition-all hover:bg-emerald-500/5`}
                      >
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 ${p.provider === 'nowpayments' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {p.provider === 'nowpayments' ? <Bitcoin size={16} className="md:w-[18px] md:h-[18px]" /> : <CreditCard size={16} className="md:w-[18px] md:h-[18px]" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-xs md:text-sm uppercase tracking-tight">
                              {p.provider === 'nowpayments' ? 'Crypto Payment' : 'Card Payment'}
                            </p>
                            <p className="text-[9px] md:text-[10px] font-bold opacity-40 uppercase tracking-widest truncate">
                              {p.pay_currency || p.currency} • {p.provider} • ID: {p.id.substring(0, 12)}...
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 md:gap-8">
                          <div className="text-right">
                             <p className="text-sm md:text-lg font-black text-emerald-500">+${p.amount_fiat.toFixed(2)}</p>
                             <p className="text-[8px] md:text-[10px] font-bold opacity-40 uppercase underline decoration-emerald-500/30 decoration-2 underline-offset-2">
                               {p.credits_awarded} CREDITS
                             </p>
                          </div>
                          <div className="text-right shrink-0 hidden xs:block">
                            <p className="text-[9px] md:text-[10px] font-bold opacity-40 uppercase tracking-widest">
                              {new Date(p.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-[8px] md:text-[9px] font-medium opacity-30">
                              {new Date(p.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`p-8 md:p-12 rounded-2xl md:rounded-3xl border border-dashed ${dashboardTheme.card} text-center opacity-30`}>
                      <DollarSign size={32} className="mx-auto mb-3 md:w-12 md:h-12 md:mb-4" />
                      <p className="font-black uppercase tracking-widest text-[10px] md:text-sm">No transactions yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gear Rack */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <Package className="opacity-50" size={20} /> Gear Rack
                  </h3>
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                    {selectedUser.gear?.length || 0} Items Recorded
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 md:gap-3">
                  {selectedUser.gear && selectedUser.gear.length > 0 ? (
                    selectedUser.gear.map((g, i) => (
                      <div 
                        key={`${g.vendor}-${g.name}-${i}`} 
                        className={`p-3 md:p-4 rounded-xl md:rounded-2xl border ${dashboardTheme.card} flex items-center justify-between group transition-all hover:translate-x-1`}
                      >
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 ${g.type === 'instrument' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                            {g.type === 'instrument' ? <Zap size={16} className="md:w-[18px] md:h-[18px]" /> : <RefreshCw size={16} className="md:w-[18px] md:h-[18px]" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-xs md:text-sm uppercase tracking-tight truncate">{g.name}</p>
                            <p className="text-[9px] md:text-[10px] font-bold opacity-40 uppercase tracking-widest truncate">{g.vendor} • {g.type}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="text-[9px] md:text-[10px] font-bold opacity-40 uppercase tracking-widest">
                            {new Date(g.last_modified).toLocaleDateString()}
                          </p>
                          {g.version && (
                             <p className="text-[8px] md:text-[9px] font-medium opacity-30">
                               v{g.version}
                             </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`p-8 md:p-12 rounded-2xl md:rounded-3xl border border-dashed ${dashboardTheme.card} text-center opacity-30`}>
                      <Package size={32} className="mx-auto mb-3 md:w-12 md:h-12 md:mb-4" />
                      <p className="font-black uppercase tracking-widest text-[10px] md:text-sm">No gear recorded for this user yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl mb-8 md:mb-12">
                <div className={`p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border ${dashboardTheme.card} flex flex-col items-center`}>
                  <Users className="text-blue-500 mb-2 md:mb-4 md:w-8 md:h-8" size={24} />
                  <div className="text-xl md:text-4xl font-black mb-1">{stats.totalUsers}</div>
                  <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40">Total Users</div>
                </div>
                <div className={`p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border ${dashboardTheme.card} flex flex-col items-center`}>
                  <TrendingUp className="text-emerald-500 mb-2 md:mb-4 md:w-8 md:h-8" size={24} />
                  <div className="text-xl md:text-4xl font-black mb-1 text-emerald-500">${stats.totalRevenue?.toFixed(2)}</div>
                  <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40">Gross Revenue</div>
                </div>
                <div className={`p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border ${dashboardTheme.card} flex flex-col items-center`}>
                  <Zap className="text-yellow-500 mb-2 md:mb-4 md:w-8 md:h-8" size={24} />
                  <div className="text-xl md:text-4xl font-black mb-1">{stats.totalCredits}</div>
                  <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40">System Credits</div>
                </div>
                <div className={`p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border ${dashboardTheme.card} flex flex-col items-center`}>
                  <Package className="text-purple-500 mb-2 md:mb-4 md:w-8 md:h-8" size={24} />
                  <div className="text-xl md:text-4xl font-black mb-1">{stats.totalPluginsRecorded}</div>
                  <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40">Total Gear Logged</div>
                </div>
              </div>

              <div className="opacity-20 flex flex-col items-center">
                <Database size={48} className="mb-3 md:w-20 md:h-20 md:mb-4" />
                <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter">Select a user to view details</h2>
                <p className="text-xs md:text-sm font-medium">Manage credits and view plugin usage history</p>
              </div>
            </div>
          )}
        </main>
          </>
        ) : (
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-inherit z-10 w-full">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2"><Check className="text-emerald-500" /> Beta Applications</h2>
              {betaApplications.length === 0 ? (
                <div className={`p-12 text-center border-2 border-dashed rounded-3xl ${dashboardTheme.card} opacity-50`}>
                  <p className="font-bold uppercase tracking-widest text-sm">No beta applications yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {betaApplications.map(app => (
                    <div key={app.id} className={`p-6 rounded-2xl border ${dashboardTheme.card} flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-current/20 transition-all`}>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="font-black text-lg">{app.daw}</span>
                           <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-current/10 opacity-70">Exp: {app.experience}</span>
                        </div>
                        <div className="text-sm opacity-70 flex items-center gap-2">
                           <span className="uppercase tracking-widest text-[10px] font-bold">Contact via:</span> {app.contact_method} 
                           {app.contact_method === 'Instagram' && (
                             <a href={`https://instagram.com/${app.contact_info.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium">{app.contact_info}</a>
                           )}
                           {app.contact_method === 'TikTok' && (
                             <a href={`https://tiktok.com/@${app.contact_info.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium">{app.contact_info}</a>
                           )}
                           {app.contact_method === 'Email' && (
                             <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${app.contact_info}`} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium">{app.contact_info}</a>
                           )}
                           {app.contact_method === 'Text Message' && (
                             <span className="font-mono text-emerald-500">{app.contact_info}</span>
                           )}
                        </div>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        {new Date(app.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        )}
      </div>

      {error && (
        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 p-4 rounded-2xl bg-red-500 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 z-[600]">
          <AlertTriangle size={20} className="shrink-0" />
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest flex-1">{error}</p>
          <button onClick={() => setError(null)} className="p-1 hover:bg-white/20 rounded-lg shrink-0">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
