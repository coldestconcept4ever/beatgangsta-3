import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Bitcoin, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  onSelect: (method: 'card' | 'crypto') => void;
  amount: number;
  credits: number;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ 
  isOpen, 
  onClose, 
  theme, 
  onSelect, 
  amount, 
  credits 
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] overflow-y-auto bg-black/80 backdrop-blur-sm">
        <div className="min-h-[100dvh] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`border rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden transition-colors duration-500 ${
              theme === 'coldest' 
                ? "bg-white border-slate-200 text-slate-900" 
                : "bg-zinc-900 border-zinc-800 text-white"
            }`}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full transition-all z-10 opacity-50 hover:opacity-100 hover:bg-black/5"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,0.1)]">
                <ShieldCheck className="w-7 h-7 text-sky-500" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">{t('payment_method')}</h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-current/5 rounded-full">
                <Zap size={12} className="text-yellow-500 fill-current" />
                <span className="text-[10px] font-mono font-bold tracking-tight opacity-80 uppercase">
                  {credits} {t('credits')} <span className="mx-1 opacity-30">|</span> ${amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => onSelect('card')}
                className={`w-full p-5 rounded-[1.5rem] border-2 flex items-center gap-4 transition-all group relative overflow-hidden ${
                  theme === 'coldest' 
                    ? 'border-slate-100 bg-slate-50/50 hover:border-sky-500 hover:bg-white' 
                    : 'border-white/5 bg-white/5 hover:border-red-500 hover:bg-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                  theme === 'coldest' ? 'bg-sky-500/10 text-sky-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-black text-xs uppercase tracking-widest mb-0.5">{t('credit_debit_card')}</div>
                  <div className="text-[10px] font-medium opacity-40">Visa, Mastercard, etc. (Lemon Squeezy)</div>
                </div>
              </button>

              <button
                onClick={() => onSelect('crypto')}
                className={`w-full p-5 rounded-[1.5rem] border-2 flex items-center gap-4 transition-all group relative overflow-hidden ${
                  theme === 'coldest' 
                    ? 'border-slate-100 bg-slate-50/50 hover:border-orange-500 hover:bg-white' 
                    : 'border-white/5 bg-white/5 hover:border-orange-500 hover:bg-white/10'
                }`}
              >
                <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                  <Bitcoin className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-black text-xs uppercase tracking-widest mb-0.5">{t('pay_with_crypto')}</div>
                  <div className="text-[10px] font-medium opacity-40 uppercase tracking-tighter">BTC • ETH • LTC • USDC (NowPayments)</div>
                </div>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-current/5 text-center">
              <div className="flex items-center justify-center gap-2 text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">
                <ShieldCheck size={12} className="text-emerald-500" />
                {t('secure_encryption')}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
