import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppTheme } from '../types';
import { useTranslation } from 'react-i18next';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  errorMessage: string;
  stackTrace?: string;
  theme?: AppTheme;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title,
  errorMessage,
  stackTrace,
  theme = 'dark'
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `${title}\n\nError: ${errorMessage}\n\nStack Trace:\n${stackTrace || 'N/A'}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`relative w-full max-w-2xl max-h-[80vh] flex flex-col rounded-xl shadow-2xl overflow-hidden ${
              theme === 'coldest' ? 'bg-white border border-sky-200' : 'bg-zinc-900 border border-zinc-800'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${
              theme === 'coldest' ? 'border-sky-100 bg-sky-50/50' : 'border-zinc-800 bg-zinc-900/50'
            }`}>
              <h3 className={`font-semibold text-lg ${
                theme === 'coldest' ? 'text-red-600' : 'text-red-400'
              }`}>
                {title}
              </h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'coldest' 
                    ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Scrollable & Selectable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className={`p-4 rounded-lg font-mono text-sm whitespace-pre-wrap select-text ${
                theme === 'coldest' ? 'bg-red-50 text-red-800' : 'bg-red-950/30 text-red-200'
              }`}>
                {errorMessage}
              </div>
              
              {stackTrace && (
                <div className="space-y-2">
                  <h4 className={`text-sm font-medium ${
                    theme === 'coldest' ? 'text-slate-700' : 'text-zinc-300'
                  }`}>
                    {t('stack_trace')}
                  </h4>
                  <div className={`p-4 rounded-lg font-mono text-xs whitespace-pre-wrap select-text overflow-x-auto ${
                    theme === 'coldest' ? 'bg-slate-100 text-slate-700' : 'bg-black/50 text-zinc-400'
                  }`}>
                    {stackTrace}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
              theme === 'coldest' ? 'border-sky-100 bg-slate-50' : 'border-zinc-800 bg-zinc-900/80'
            }`}>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'coldest'
                    ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? t('copied') : t('copy_error')}
              </button>
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'coldest'
                    ? 'bg-sky-600 text-white hover:bg-sky-700'
                    : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                {t('close')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
