import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Volume2, VolumeX, Settings, Sparkles, TrendingUp } from 'lucide-react';
import { STORE_TIERS } from '../data/initialData';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const {
    money,
    xp,
    level,
    reputation,
    empirePoints,
    currentTierId,
    soundEnabled,
    toggleSound
  } = useGameStore();

  const currentTier = STORE_TIERS.find(t => t.id === currentTierId) || STORE_TIERS[0];
  const nextLevelXp = Math.pow(level, 2) * 50;
  const currentLevelBaseXp = Math.pow(level - 1, 2) * 50;
  const xpPercent = Math.min(100, Math.max(0, ((xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100));

  // Compact money formatter for small mobile screens (<= 375px)
  const formatMoney = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 10000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 md:px-6 py-2 transition-all safe-top">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Store Logo */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <span className="text-2xl md:text-3xl filter drop-shadow select-none">
            {currentTier.icon}
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-sm md:text-base text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 m-0 leading-none">
                SNACK EMPIRE
              </h1>
              <span className="text-[9px] md:text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30">
                T{currentTier.tierNumber}
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-slate-400 font-medium truncate max-w-[110px] sm:max-w-[180px] md:max-w-xs leading-tight">
              {currentTier.name}
            </p>
          </div>
        </div>

        {/* Currency & Stats Indicators */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Cash Balance */}
          <div className="flex items-center gap-1 md:gap-1.5 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 md:py-1.5 rounded-xl shadow-inner">
            <span className="text-base md:text-lg">💵</span>
            <div>
              <div className="hidden sm:block text-[9px] uppercase font-bold text-emerald-400 leading-tight">
                Ngân Quỹ
              </div>
              <div className="font-black text-xs sm:text-sm md:text-base text-emerald-300 leading-none">
                <span className="sm:hidden">{formatMoney(money)}</span>
                <span className="hidden sm:inline">${money.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Level Badge (Visible on all screens) */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700/70 px-2 py-1 md:py-1.5 rounded-xl">
            <span className="text-amber-400 font-black text-xs leading-none">
              Lv.{level}
            </span>
            {/* Desktop XP progress bar */}
            <div className="hidden md:flex flex-col w-16 ml-1">
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Reputation (Desktop & Tablet) */}
          <div className="hidden xs:flex items-center gap-1 bg-indigo-950/60 border border-indigo-500/30 px-2 py-1 md:py-1.5 rounded-xl">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold text-xs text-indigo-200">
              {Math.round(reputation)}⭐
            </span>
          </div>

          {/* Empire Points (If any) */}
          {empirePoints > 0 && (
            <div className="flex items-center gap-1 bg-purple-950/70 border border-purple-500/40 px-2 py-1 rounded-xl animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-black text-xs text-purple-200">
                {empirePoints}⭐
              </span>
            </div>
          )}

          {/* Sound & Settings Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center justify-center active:scale-95"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              aria-label="Sound Toggle"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={onOpenSettings}
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center justify-center active:scale-95"
              title="Cài đặt & Dữ liệu"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
