import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Volume2, VolumeX, Settings, Sparkles, TrendingUp, Award } from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Store Status */}
        <div className="flex items-center gap-3">
          <div className="text-3xl filter drop-shadow hover:scale-110 transition-transform cursor-pointer">
            {currentTier.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 m-0">
                SNACK EMPIRE
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30">
                Tier {currentTier.tierNumber}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate max-w-[200px] md:max-w-xs">
              {currentTier.name}
            </p>
          </div>
        </div>

        {/* Currency & Stats Indicators */}
        <div className="flex items-center flex-wrap gap-2 md:gap-4">
          {/* Cash */}
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-inner">
            <span className="text-lg">💵</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 leading-tight">Ngân Quỹ</div>
              <div className="font-black text-sm md:text-base text-emerald-300 leading-none">
                ${money.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Level & XP */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl min-w-[130px]">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-xs">
              Lv.{level}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                <span>XP</span>
                <span>{Math.round(xpPercent)}%</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Reputation */}
          <div className="flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1.5 rounded-xl">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-indigo-300 leading-tight">Uy Tín</div>
              <div className="font-bold text-xs md:text-sm text-indigo-200 leading-none">
                {Math.round(reputation)}⭐
              </div>
            </div>
          </div>

          {/* Empire Points (Prestige) */}
          {empirePoints > 0 && (
            <div className="flex items-center gap-1.5 bg-purple-950/70 border border-purple-500/40 px-3 py-1.5 rounded-xl shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-[10px] uppercase font-bold text-purple-300 leading-tight">Empire Pts</div>
                <div className="font-extrabold text-xs md:text-sm text-purple-200 leading-none">
                  {empirePoints} ⭐
                </div>
              </div>
            </div>
          )}

          {/* Sound & Settings Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              aria-label="Sound Toggle"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
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
