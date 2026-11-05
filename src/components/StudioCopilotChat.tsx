import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2, 
  Copy, 
  Check, 
  Sliders, 
  Disc, 
  Wand2, 
  Layers,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Undo2
} from 'lucide-react';
import { AppTheme, VSTPlugin, SampleVaultItem, BeatRecipe, MixCritique } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  mutation?: any;
}

interface StudioCopilotChatProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: AppTheme;
  recipe?: BeatRecipe | null;
  critique?: MixCritique | null;
  plugins?: VSTPlugin[];
  userEmail?: string | null;
  onApplyRecipeMutation?: (mutation: any) => void;
  onApplyCritiqueMutation?: (mutation: any) => void;
  onUndo?: () => void;
  canUndo?: boolean;
  undoSummary?: string | null;
}

export const StudioCopilotChat: React.FC<StudioCopilotChatProps> = ({
  isOpen,
  onClose,
  theme = 'hustle-time',
  recipe,
  critique,
  plugins = [],
  userEmail,
  onApplyRecipeMutation,
  onApplyCritiqueMutation,
  onUndo,
  canUndo = false,
  undoSummary
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'model',
      content: `👋 **BeatGangsta Studio AI Co-Pilot Online.**\n\nI am auto-synced with your active **Mix Recipe**, your **Gear Rack**, and your **Sample Vault**.\n\nAsk me anything about dialling in plugin parameters, solving frequency clashes, or selecting complementary drum one-shots!`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Retrieve user's Sample Vault from localStorage
  const vaultSamples = React.useMemo<SampleVaultItem[]>(() => {
    try {
      const saved = localStorage.getItem('bg_sample_vault_items');
      if (saved) return JSON.parse(saved) || [];
    } catch {}
    return [];
  }, []);

  // Retrieve user's active gear rack from props or localStorage
  const activeGear = React.useMemo<VSTPlugin[]>(() => {
    if (plugins && plugins.length > 0) return plugins;
    try {
      const saved = localStorage.getItem('bg_library');
      if (saved) return JSON.parse(saved) || [];
    } catch {}
    return [];
  }, [plugins]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build lightweight conversation history
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Detect pasted studio driver link or vault URL
      const isDriverLink = /beatgangsta\.app\/vault|vault\/share|drive\.google\.com\/drive\/folders|user=/i.test(text);

      // Auto-synced context payload
      const payload = {
        message: text,
        history,
        hasDriverLink: isDriverLink,
        userEmail: userEmail || localStorage.getItem('beatgangsta_sync_email') || 'coldestconcept@gmail.com',
        gearRack: activeGear.map(p => ({ vendor: p.vendor, name: p.name })),
        vaultSamples: vaultSamples.map(s => ({
          name: s.name,
          category: s.category,
          detectedKey: s.detectedKey,
          fundamentalHz: s.fundamentalHz,
          punchFrequencyHz: s.punchFrequencyHz,
          decayMs: s.decayMs
        })),
        rawRecipe: recipe,
        rawCritique: critique,
        recipeContext: recipe ? {
          title: recipe.title,
          bpm: recipe.bpm,
          key: (recipe as any).key || (recipe as any).musicalKey || 'Dynamic',
          genre: (recipe as any).genre || (recipe as any).style,
          tracks: (recipe as any).tracks || (recipe as any).instruments || []
        } : null,
        critiqueContext: critique ? {
          title: critique.title,
          overallScore: (critique as any).overallScore || (critique as any).score || critique.overallFeedback,
          lowEndAnalysis: (critique as any).lowEndAnalysis || (critique as any).lowEndNotes,
          vocalAnalysis: (critique as any).vocalAnalysis || (critique as any).vocalNotes,
          actionItems: (critique as any).actionItems || []
        } : null
      };

      const res = await fetch('/api/studio-copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.reply || "I've analyzed your studio session. Let me know what specific move or track you want to adjust.";

      if (data.mutation) {
        if (recipe && onApplyRecipeMutation) {
          onApplyRecipeMutation(data.mutation);
        } else if (critique && onApplyCritiqueMutation) {
          onApplyCritiqueMutation(data.mutation);
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          content: botReply,
          timestamp: new Date(),
          mutation: data.mutation
        }
      ]);
    } catch (err: any) {
      console.error('Co-pilot chat failed:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          content: `⚠️ **Session Connection Issue:** Could not connect to Gemini studio backend (${err.message || 'Network error'}). Please try again.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: "⚡ Edit Attack / Release", prompt: "Change the Attack parameter on the compressor to 15ms and the Release to 80ms to preserve punch." },
    { label: "➕ Add Plugin to Card", prompt: "Research the current card and add FabFilter Pro-Q 3 or an appropriate EQ from my rack to carve dynamic room." },
    { label: "🎯 Sample Vault Picks", prompt: "Look at my Sample Vault inventory and recommend the best Kick, 808, and Snare one-shots for this current recipe." },
    { label: "🔄 Swap Plugin from Rack", prompt: "Recommend an alternative plugin from my active Gear Rack that can replace one of the mixing moves in this track." }
  ];

  return (
    <div className={`fixed z-[300] transition-all duration-300 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl border ${
      isExpanded 
        ? 'inset-4 sm:inset-10 rounded-3xl bg-[#06101c]/95 border-sky-500/40' 
        : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[480px] h-[640px] max-h-[85vh] rounded-2xl bg-[#06101c]/95 border-sky-500/30'
    }`}>
      {/* Top Header */}
      <div className="p-3.5 sm:p-4 border-b border-[#14283f] bg-[#081525]/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Studio AI Co-Pilot
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Auto-Synced to Studio" />
            </div>
            <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <span>Auto-Synced</span>
              <span>•</span>
              <span className="text-sky-400">{activeGear.length} Plugins</span>
              <span>•</span>
              <span className="text-emerald-400">{vaultSamples.length} One-Shots</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onUndo && canUndo && (
            <button
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
              title={undoSummary ? `Undo: ${undoSummary}` : 'Undo last card change'}
            >
              <Undo2 className="w-3 h-3" />
              <span>Undo</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Close Co-Pilot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Auto-Sync Banner */}
      <div className="px-4 py-2 border-b border-[#102033] bg-[#050c16] flex items-center justify-between text-[11px] font-sans">
        <div className="flex items-center gap-2 truncate text-gray-300">
          <Wand2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            {recipe ? `Recipe: "${recipe.title}" (${recipe.bpm || 120} BPM)` : critique ? `Critique: "${critique.title}"` : 'Studio Mixing Console'}
          </span>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
          Live Context
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          const isDriverLinkInMsg = /beatgangsta\.app\/vault|vault\/share|drive\.google\.com\/drive\/folders|user=/i.test(m.content);
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-gray-500">
                <span>{isUser ? 'You' : 'BeatGangsta AI Engineer'}</span>
                <span>•</span>
                <span>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className={`relative max-w-[88%] rounded-2xl p-3.5 text-xs font-sans leading-relaxed shadow-md ${
                isUser 
                  ? 'bg-sky-600 text-white rounded-tr-sm' 
                  : 'bg-[#0c1c2e] text-gray-100 border border-[#1b3450] rounded-tl-sm'
              }`}>
                <div className="whitespace-pre-wrap select-text">
                  {m.content}
                </div>

                {isDriverLinkInMsg && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-[11px] font-mono text-cyan-200 flex items-center gap-2 shadow-lg">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                    <span>🔗 <strong>Studio Driver Link Resolved:</strong> 100% Vault ({vaultSamples.length} One-Shots) &amp; Gear Rack ({activeGear.length} Plugins) Auto-Loaded</span>
                  </div>
                )}

                {m.mutation && (
                  <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-1.5 font-mono">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
                        Card Updated: {m.mutation.summary}
                      </span>
                      {onUndo && canUndo && (
                        <button
                          onClick={onUndo}
                          className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all font-bold font-sans flex items-center gap-1"
                          title="Revert this change"
                        >
                          <Undo2 className="w-3 h-3" />
                          <span>Undo</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-cyan-200/70 font-sans">
                      Updated with official software GUI parameters. Visual indicator and distinct typography applied to the card.
                    </p>
                  </div>
                )}

                {!isUser && (
                  <button
                    onClick={() => handleCopyText(m.content, m.id)}
                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-[#071322] hover:bg-[#102033] text-gray-400 hover:text-white border border-[#1b3450]"
                    title="Copy advice"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-[#0c1c2e] text-gray-300 border border-[#1b3450] rounded-2xl rounded-tl-sm p-3.5 text-xs flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span className="font-mono text-[11px] text-sky-300">
                Analyzing recipe, gear rack & vault frequencies...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2 border-t border-[#12243a] bg-[#071322] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSendMessage(qp.prompt)}
            className="px-2.5 py-1 rounded-full text-[11px] font-sans font-medium bg-[#0c1d30] hover:bg-[#142e4c] text-sky-300 hover:text-white border border-sky-500/20 whitespace-nowrap transition-all active:scale-95 disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Bottom Input Field */}
      <div className="p-3 border-t border-[#14283f] bg-[#081525] flex items-center gap-2 shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading}
          placeholder="Ask your studio co-pilot about this mix, UAD chains, or one-shots..."
          className="flex-1 bg-[#050e18] border border-[#1b3450] focus:border-sky-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-colors"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
          className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0"
          title="Send"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
