import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Coins, ShoppingBag, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OfflineModal: React.FC = () => {
  const { offlineReport, dismissOfflineReport } = useGameStore();

  if (!offlineReport) return null;

  const hours = Math.floor(offlineReport.secondsAway / 3600);
  const minutes = Math.floor((offlineReport.secondsAway % 3600) / 60);

  const handleCollect = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    dismissOfflineReport();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm max-h-[90dvh] overflow-y-auto bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-5 md:p-6 shadow-2xl text-center no-scrollbar">
        {/* Sleeping / Night Icon */}
        <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl md:text-3xl animate-bounce">
          🛌💤
        </div>

        <h3 className="text-lg md:text-xl font-black text-slate-100 mb-0.5">
          CHÀO MỪNG QUAY LẠI!
        </h3>
        <p className="text-[11px] md:text-xs text-slate-400 font-medium mb-3.5">
          Nhân viên vẫn chăm chỉ phục vụ khách hàng lúc bạn vắng mặt!
        </p>

        {/* Stats breakdown */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between p-2.5 md:p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> Vắng mặt
            </span>
            <span className="font-bold text-slate-200">
              {hours > 0 ? `${hours}h ` : ''}{minutes}m
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 md:p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Đơn hoàn tất
            </span>
            <span className="font-bold text-amber-300">
              +{offlineReport.ordersCompleted.toLocaleString()} món
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs md:text-sm">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" /> Tiền tích lũy
            </span>
            <span className="font-black text-base md:text-lg text-emerald-300">
              +${offlineReport.earnedCash.toLocaleString()} 💸
            </span>
          </div>
        </div>

        {/* Collect button */}
        <button
          onClick={handleCollect}
          className="w-full min-h-[50px] py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-sm md:text-base shadow-lg shadow-emerald-500/25 active:scale-95 transition-all select-none"
        >
          THU TIỀN VỀ TÚI! 🤑
        </button>
      </div>
    </div>
  );
};
