import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Moon, Coins, ShoppingBag, Clock } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl text-center">
        {/* Sleeping / Night Icon */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl animate-bounce">
          🛌💤
        </div>

        <h3 className="text-xl font-black text-slate-100 mb-1">
          CHÀO MỪNG QUAY LẠI!
        </h3>
        <p className="text-xs text-slate-400 font-medium mb-4">
          Trong lúc bạn đi vắng, nhân viên vẫn chăm chỉ phục vụ khách hàng!
        </p>

        {/* Stats breakdown */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" /> Thời gian vắng mặt
            </span>
            <span className="font-bold text-slate-200">
              {hours > 0 ? `${hours}h ` : ''}{minutes}m
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-amber-400" /> Đơn hàng hoàn tất
            </span>
            <span className="font-bold text-amber-300">
              +{offlineReport.ordersCompleted.toLocaleString()} món
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-sm">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" /> Tiền tích lũy
            </span>
            <span className="font-black text-lg text-emerald-300">
              +${offlineReport.earnedCash.toLocaleString()} 💸
            </span>
          </div>
        </div>

        {/* Collect button */}
        <button
          onClick={handleCollect}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
        >
          THU TIỀN VỀ TÚI! 🤑
        </button>
      </div>
    </div>
  );
};
