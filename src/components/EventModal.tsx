import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Sparkles, Clock, AlertTriangle } from 'lucide-react';

export const EventModal: React.FC = () => {
  const { activeEvent, respondToEvent } = useGameStore();

  if (!activeEvent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-6 shadow-2xl text-center overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />

        {/* Header Icon */}
        <div className="text-5xl mb-3 animate-bounce">
          {activeEvent.icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-2">
          {activeEvent.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-4 leading-relaxed font-medium">
          {activeEvent.description}
        </p>

        {/* Multipliers & Countdown */}
        <div className="bg-slate-800/80 rounded-xl p-3 mb-5 border border-slate-700/60 flex items-center justify-around text-xs">
          {activeEvent.multiplier.traffic && (
            <div className="flex flex-col items-center">
              <span className="text-slate-400">Lượng Khách</span>
              <span className="font-extrabold text-emerald-400 text-sm">
                x{activeEvent.multiplier.traffic} 🔥
              </span>
            </div>
          )}
          {activeEvent.multiplier.revenue && (
            <div className="flex flex-col items-center">
              <span className="text-slate-400">Doanh Thu</span>
              <span className="font-extrabold text-amber-400 text-sm">
                x{activeEvent.multiplier.revenue} 💵
              </span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Còn lại
            </span>
            <span className="font-extrabold text-rose-400 text-sm">
              {activeEvent.remainingSec}s
            </span>
          </div>
        </div>

        {/* Action Options */}
        {activeEvent.options && activeEvent.options.length > 0 ? (
          <div className="flex flex-col gap-2">
            {activeEvent.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => respondToEvent(opt.action)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition-all shadow-md active:scale-98"
              >
                {opt.text}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => respondToEvent('decline')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all border border-slate-700"
          >
            Đã hiểu, tận dụng ngay! 🔥
          </button>
        )}
      </div>
    </div>
  );
};
