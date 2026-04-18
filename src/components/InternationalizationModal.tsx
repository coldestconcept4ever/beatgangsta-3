import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Languages, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppTheme } from '../types';

interface InternationalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
  currentCountry: string;
  onCountryChange: (country: string) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español (ES)', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Español (MX)', flag: '🇲🇽' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

const COUNTRIES = [
  { code: 'US', name: 'united_states', flag: '🇺🇸' },
  { code: 'GB', name: 'united_kingdom', flag: '🇬🇧' },
  { code: 'ES', name: 'spain', flag: '🇪🇸' },
  { code: 'MX', name: 'mexico', flag: '🇲🇽' },
  { code: 'FR', name: 'france', flag: '🇫🇷' },
  { code: 'RU', name: 'russia', flag: '🇷🇺' },
  { code: 'PT', name: 'portugal', flag: '🇵🇹' },
  { code: 'BR', name: 'brazil', flag: '🇧🇷' },
  { code: 'DE', name: 'germany', flag: '🇩🇪' },
  { code: 'JP', name: 'japan', flag: '🇯🇵' },
];

export const InternationalizationModal: React.FC<InternationalizationModalProps> = ({ 
  isOpen, 
  onClose, 
  theme,
  currentCountry,
  onCountryChange
}) => {
  const { t, i18n } = useTranslation();

  const getThemeClasses = () => {
    switch (theme) {
      case 'coldest':
        return {
          bg: 'bg-white/95 backdrop-blur-xl border-sky-200 text-slate-900',
          itemHover: 'hover:bg-sky-50',
          activeItem: 'bg-sky-100 border-sky-300',
          accent: 'text-sky-600',
          btn: 'bg-sky-500 text-white hover:bg-sky-600',
        };
      case 'crazy-bird':
        return {
          bg: 'bg-[#0a0000]/95 backdrop-blur-xl border-red-900/50 text-red-50',
          itemHover: 'hover:bg-red-900/20',
          activeItem: 'bg-red-900/40 border-red-500',
          accent: 'text-red-500',
          btn: 'bg-red-600 text-white hover:bg-red-500',
        };
      case 'hustle-time':
        return {
          bg: 'bg-[#000a05]/95 backdrop-blur-xl border-yellow-900/50 text-yellow-50',
          itemHover: 'hover:bg-yellow-900/20',
          activeItem: 'bg-yellow-900/40 border-yellow-500',
          accent: 'text-yellow-500',
          btn: 'bg-yellow-500 text-black hover:bg-yellow-400',
        };
      case 'chef-mode':
        return {
          bg: 'bg-white/95 backdrop-blur-xl border-orange-200 text-orange-950',
          itemHover: 'hover:bg-orange-50',
          activeItem: 'bg-orange-100 border-orange-300',
          accent: 'text-orange-600',
          btn: 'bg-orange-500 text-white hover:bg-orange-600',
        };
      default:
        return {
          bg: 'bg-white/95 backdrop-blur-xl border-slate-200 text-slate-900',
          itemHover: 'hover:bg-slate-50',
          activeItem: 'bg-slate-100 border-slate-300',
          accent: 'text-slate-600',
          btn: 'bg-slate-500 text-white hover:bg-slate-600',
        };
    }
  };

  const styles = getThemeClasses();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-lg p-8 rounded-[3rem] border shadow-2xl ${styles.bg}`}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-current/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className={`p-3 rounded-2xl ${styles.activeItem}`}>
                <Globe className={`w-6 h-6 ${styles.accent}`} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">{t('settings')}</h2>
                <p className="text-xs font-bold opacity-50 uppercase tracking-widest">{t('select_language')} & {t('country')}</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Language Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Languages className={`w-4 h-4 ${styles.accent}`} />
                  <h3 className="text-sm font-black uppercase tracking-widest">{t('language')}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => i18n.changeLanguage(lang.code)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        i18n.language === lang.code ? styles.activeItem : `border-transparent ${styles.itemHover}`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-xs font-black uppercase tracking-wider">{lang.name}</span>
                      </div>
                      {i18n.language === lang.code && <Check className={`w-4 h-4 ${styles.accent}`} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className={`w-4 h-4 ${styles.accent}`} />
                  <h3 className="text-sm font-black uppercase tracking-widest">{t('country')}</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => onCountryChange(country.code)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        currentCountry === country.code ? styles.activeItem : `border-transparent ${styles.itemHover}`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{country.flag}</span>
                        <span className="text-xs font-black uppercase tracking-wider">{t(country.name)}</span>
                      </div>
                      {currentCountry === country.code && <Check className={`w-4 h-4 ${styles.accent}`} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`w-full mt-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-transform active:scale-95 ${styles.btn}`}
            >
              {t('done')}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
