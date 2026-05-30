import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { analogInstruments, analogHardware } from '../data/analogEquipment';
import { equipmentDetails } from '../data/equipmentDetails';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Hardware } from '../types';

interface AnalogEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  onSave: (instruments: Hardware[], hardware: Hardware[]) => Promise<boolean>;
  initialInstruments?: Hardware[];
  initialHardware?: Hardware[];
}

type MenuLevel = 'type' | 'category' | 'brand' | 'model' | 'pedal_selection' | 'amp_selection';

export const AnalogEquipmentModal: React.FC<AnalogEquipmentModalProps> = ({ isOpen, onClose, theme, onSave, initialInstruments = [], initialHardware = [] }) => {
  const { t } = useTranslation();
  const [level, setLevel] = useState<MenuLevel>('type');
  const [selectedType, setSelectedType] = useState<'instruments' | 'hardware' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedHardware, setSelectedHardware] = useState<string[]>([]);
  const [pedalChainMap, setPedalChainMap] = useState<Record<string, string[]>>({});
  const [ampChainMap, setAmpChainMap] = useState<Record<string, string[]>>({});
  const [currentInstrumentForPedal, setCurrentInstrumentForPedal] = useState<string | null>(null);
  const [currentInstrumentForAmp, setCurrentInstrumentForAmp] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedInstruments(initialInstruments.map(i => i.name));
      setSelectedHardware(initialHardware.map(h => h.name));
      
      const newPedalMap: Record<string, string[]> = {};
      const newAmpMap: Record<string, string[]> = {};
      
      initialInstruments.forEach(i => {
        if (i.connectedPedals) newPedalMap[i.name] = i.connectedPedals.map(p => p.name);
        if (i.connectedAmps) newAmpMap[i.name] = i.connectedAmps.map(a => a.name);
      });
      initialHardware.forEach(h => {
        if (h.connectedPedals) newPedalMap[h.name] = h.connectedPedals.map(p => p.name);
        if (h.connectedAmps) newAmpMap[h.name] = h.connectedAmps.map(a => a.name);
      });
      
      setPedalChainMap(newPedalMap);
      setAmpChainMap(newAmpMap);

      // Reset state
      setLevel('type');
      setSelectedType(null);
      setSelectedCategory(null);
      setSelectedBrand(null);
      setExpandedItem(null);
      setActiveIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const instrumentsWithPedals = selectedInstruments.map(name => ({
        name,
        vendor: name.split(' ')[0],
        type: 'instrument' as const,
        connectedPedals: (pedalChainMap[name] || []).map(pName => ({
          name: pName,
          vendor: pName.split(' ')[0],
          type: 'hardware' as const
        })),
        connectedAmps: (ampChainMap[name] || []).map(aName => ({
          name: aName,
          vendor: aName.split(' ')[0],
          type: 'hardware' as const
        }))
      }));

      const hardwareWithPedals = selectedHardware.map(name => ({
        name,
        vendor: name.split(' ')[0],
        type: 'hardware' as const,
        connectedPedals: (pedalChainMap[name] || []).map(pName => ({
          name: pName,
          vendor: pName.split(' ')[0],
          type: 'hardware' as const
        })),
        connectedAmps: (ampChainMap[name] || []).map(aName => ({
          name: aName,
          vendor: aName.split(' ')[0],
          type: 'hardware' as const
        }))
      }));

      const success = await onSave(instrumentsWithPedals, hardwareWithPedals);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (item: string, type: 'instruments' | 'hardware') => {
    if (type === 'instruments') {
      setSelectedInstruments(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    } else {
      setSelectedHardware(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    }
  };

  const getItems = () => {
    switch (level) {
      case 'type':
        return [t('add_instruments'), t('add_hardware')];
      case 'category':
        return selectedType === 'instruments' 
          ? Object.keys(analogInstruments)
          : Object.keys(analogHardware);
      case 'brand':
        if (!selectedType || !selectedCategory) return [];
        return selectedType === 'instruments'
          ? Object.keys((analogInstruments as any)[selectedCategory])
          : Object.keys((analogHardware as any)[selectedCategory]);
      case 'model':
        if (!selectedType || !selectedCategory || !selectedBrand) return [];
        return selectedType === 'instruments'
          ? (analogInstruments as any)[selectedCategory][selectedBrand] as string[]
          : (analogHardware as any)[selectedCategory][selectedBrand] as string[];
      case 'pedal_selection':
        // Show all available pedals
        const pedals = (analogHardware as any)["Guitar Pedals"];
        return Object.entries(pedals).flatMap(([brand, models]) => (models as string[]).map(m => `${brand} ${m}`));
      case 'amp_selection':
        // Show all available amps (combining Guitar and Bass for now)
        const guitarAmps = (analogHardware as any)["Guitar Amplifiers"] || {};
        const bassAmps = (analogHardware as any)["Bass Amplifiers"] || {};
        const allAmps = { ...guitarAmps };
        for (const [brand, models] of Object.entries(bassAmps)) {
             if (allAmps[brand]) {
                 allAmps[brand] = Array.from(new Set([...allAmps[brand], ...(models as string[])]));
             } else {
                 allAmps[brand] = models;
             }
        }
        return Object.entries(allAmps).flatMap(([brand, models]) => (models as string[]).map(m => `${brand} ${m}`));
      default:
        return [];
    }
  };

  const items = getItems();

  const handleSelect = (index: number) => {
    const item = items[index];
    if (level === 'type') {
      setSelectedType(index === 0 ? 'instruments' : 'hardware');
      setLevel('category');
      setActiveIndex(0);
    } else if (level === 'category') {
      setSelectedCategory(item);
      setLevel('brand');
      setActiveIndex(0);
    } else if (level === 'brand') {
      setSelectedBrand(item);
      setLevel('model');
      setActiveIndex(0);
    }
  };



  const handleBack = () => {
    if (level === 'pedal_selection' || level === 'amp_selection') setLevel('model');
    else if (level === 'model') setLevel('brand');
    else if (level === 'brand') setLevel('category');
    else if (level === 'category') setLevel('type');
    setActiveIndex(0);
  };

  const themeClasses = theme === 'coldest' 
    ? "bg-sky-900/95 border-sky-400/30 text-sky-50"
    : theme === 'crazy-bird'
    ? "bg-red-950/95 border-red-500/30 text-red-50"
    : theme === 'chef-mode'
    ? "bg-orange-950/95 border-orange-400/30 text-orange-50"
    : theme === 'hustle-time'
    ? "bg-[#001a14]/95 border-yellow-500/30 text-yellow-50"
    : "bg-emerald-950/95 border-emerald-500/30 text-emerald-50";

  const highlightClass = theme === 'coldest' ? 'bg-sky-500 text-white' : theme === 'crazy-bird' ? 'bg-red-500 text-white' : theme === 'chef-mode' ? 'bg-orange-500 text-white' : theme === 'hustle-time' ? 'bg-yellow-500 text-emerald-950' : 'bg-emerald-500 text-white';

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-3xl animate-in fade-in zoom-in duration-500">
      <div className={`w-full max-w-2xl h-[70vh] flex flex-col rounded-[3rem] border shadow-2xl overflow-hidden ${themeClasses}`}>
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-2 sm:gap-4">
            {level !== 'type' && (
              <button onClick={handleBack} className="p-1 sm:p-2 rounded-full hover:bg-white/10 transition-colors">
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="text-sm sm:text-xl font-black uppercase tracking-tight sm:tracking-widest">
              {level === 'type' ? t('equipment') : 
               level === 'category' ? t('categories', { type: selectedType === 'instruments' ? t('add_instruments').replace(t('add_instruments').split(' ')[0] + ' ', '') : t('add_hardware').replace(t('add_hardware').split(' ')[0] + ' ', '') }) :
               level === 'brand' ? t('brands', { category: selectedCategory }) :
               level === 'pedal_selection' ? `Select Pedals for ${currentInstrumentForPedal}` :
               t('models', { brand: selectedBrand })}
            </h2>
          </div>
          <div className="flex gap-3">
            {level === 'type' && (
              <button onClick={onClose} className="px-6 py-2 rounded-full font-bold bg-white/10 hover:bg-white/20 transition-all text-sm">
                {t('cancel')}
              </button>
            )}
            <button 
              onClick={handleSave} 
              disabled={isLoading}
              className={`px-6 py-2 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 ${theme === 'coldest' || theme === 'chef-mode' ? 'bg-white text-black' : 'bg-white text-black'}`}
            >
              {isLoading ? t('saving') : t('save_and_continue')}
            </button>
          </div>
        </div>

        {/* XMB / iPod Style List */}
        <div className="flex-1 overflow-y-auto relative" ref={listRef}>
          <div className="py-4">
            {items.map((item, idx) => {
              const fullItemName = level === 'model' ? `${selectedBrand} ${item}` : item;
              const isSelectedModel = (level === 'model' || level === 'pedal_selection' || level === 'amp_selection') && selectedType && (
                level === 'pedal_selection'
                  ? pedalChainMap[currentInstrumentForPedal!]?.includes(item)
                  : level === 'amp_selection'
                  ? ampChainMap[currentInstrumentForAmp!]?.includes(item)
                  : (selectedType === 'instruments' 
                      ? selectedInstruments.includes(fullItemName)
                      : selectedHardware.includes(fullItemName))
              );

              return (
                <div 
                  key={item}
                  onClick={() => {
                    setActiveIndex(idx);
                    if (level === 'model' || level === 'pedal_selection' || level === 'amp_selection') {
                      setExpandedItem(expandedItem === item ? null : item);
                    } else {
                      handleSelect(idx);
                    }
                  }}
                  className={`px-8 py-4 flex flex-col cursor-pointer transition-all duration-200 ${activeIndex === idx ? `${highlightClass} scale-[1.02] shadow-lg z-10 relative` : 'hover:bg-white/5 opacity-70 hover:opacity-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className={`text-lg font-bold ${activeIndex === idx ? 'text-white' : ''}`}>{item}</span>
                      {level === 'model' && isSelectedModel && (
                        <div className="flex flex-col gap-1 mt-1">
                          {pedalChainMap[fullItemName] && pedalChainMap[fullItemName].length > 0 && (
                            <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">
                              Pedals: {pedalChainMap[fullItemName].join(', ')}
                            </span>
                          )}
                          {ampChainMap[fullItemName] && ampChainMap[fullItemName].length > 0 && (
                            <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">
                              Amps: {ampChainMap[fullItemName].join(', ')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {level !== 'model' && level !== 'pedal_selection' && level !== 'amp_selection' && (
                      <ChevronRight size={20} className={activeIndex === idx ? 'text-white' : 'opacity-50'} />
                    )}
                    {(level === 'model' || level === 'pedal_selection' || level === 'amp_selection') && (
                      <div className="flex items-center gap-3">
                        {level === 'model' && isSelectedModel && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentInstrumentForPedal(fullItemName);
                                setLevel('pedal_selection');
                                setActiveIndex(0);
                              }}
                              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              Add Pedal
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentInstrumentForAmp(fullItemName);
                                setLevel('amp_selection');
                                setActiveIndex(0);
                              }}
                              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              Add Amp
                            </button>
                          </>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (level === 'pedal_selection') {
                              setPedalChainMap(prev => {
                                const current = prev[currentInstrumentForPedal!] || [];
                                const next = current.includes(item) ? current.filter(p => p !== item) : [...current, item];
                                return { ...prev, [currentInstrumentForPedal!]: next };
                              });
                            } else if (level === 'amp_selection') {
                              setAmpChainMap(prev => {
                                const current = prev[currentInstrumentForAmp!] || [];
                                const next = current.includes(item) ? current.filter(a => a !== item) : [...current, item];
                                return { ...prev, [currentInstrumentForAmp!]: next };
                              });
                            } else if (selectedType) {
                              toggleItem(fullItemName, selectedType);
                            }
                            setActiveIndex(idx);
                            setExpandedItem(item);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelectedModel ? 'bg-white/90 text-black' : 'bg-white/20 hover:bg-white/40'}`}>
                          {isSelectedModel && <Check size={16} />}
                        </button>
                      </div>
                    )}
                  </div>
                  {(level === 'model' || level === 'pedal_selection' || level === 'amp_selection') && expandedItem === item && (equipmentDetails[item] || equipmentDetails[item.split(' ').slice(1).join(' ')]) && (
                    <div className="mt-4 text-sm opacity-80 whitespace-pre-wrap">
                      {equipmentDetails[item] || equipmentDetails[item.split(' ').slice(1).join(' ')]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>



        {/* Footer Navigation Hint */}
        {level === 'model' && (
          <div className="p-4 border-t border-white/10 bg-black/20 text-center">
            <p className="text-xs font-bold opacity-60 uppercase tracking-widest">{t('select_all_models')}</p>
          </div>
        )}
        
        {/* Quick Switch Button */}
        {level !== 'type' && (
          <div className="p-4 border-t border-white/10 bg-black/40 flex justify-center">
             <button 
              onClick={() => {
                setSelectedType(selectedType === 'instruments' ? 'hardware' : 'instruments');
                setLevel('category');
                setActiveIndex(0);
              }}
              className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity underline"
            >
              {t('switch_to_add', { type: selectedType === 'instruments' ? t('add_hardware').replace(t('add_hardware').split(' ')[0] + ' ', '') : t('add_instruments').replace(t('add_instruments').split(' ')[0] + ' ', '') })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
