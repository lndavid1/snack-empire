import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  Sparkles, 
  RotateCcw, 
  Zap, 
  TrendingUp, 
  ArrowUpCircle, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PrestigeResearchView: React.FC = () => {
  const { 
    totalRevenueEarned, 
    empirePoints, 
    prestigeUpgrades, 
    buyPrestigeUpgrade, 
    prestigeReset 
  } = useGameStore();

  const potentialPoints = Math.max(1, Math.floor(Math.sqrt(totalRevenueEarned / 10000)));

  const handlePrestigeClick = () => {
    if (window.confirm(
      `⭐ BẠN CÓ CHẮC CHẮN MUỐN TÁI SINH ĐẾ CHẾ?\n\n` +
      `Bạn sẽ nhận được: +${potentialPoints} EMPIRE POINTS!\n\n` +
      `Toàn bộ tiền mặt, cửa hàng và nhân viên sẽ reset về ban đầu, nhưng bạn sẽ giữ lại toàn bộ Điểm và Nâng cấp Vĩnh viễn để tăng tốc cực đại!`
    )) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
      prestigeReset();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Prestige Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border-2 border-purple-500/50 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="text-6xl p-3 bg-purple-900/50 border border-purple-500/40 rounded-2xl animate-pulse">
              🚀
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-xs border border-purple-500/40">
                  HỆ THỐNG PRESTIGE VĨNH VIỄN
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-100">
                Tái Sinh Đế Chế Mạnh Mẽ Hơn
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-lg mt-1 font-medium leading-relaxed">
                Reset lại chuỗi cửa hàng để đổi lấy <strong className="text-purple-300">Empire Points</strong>. Dùng điểm này để mua các bổ trợ vĩnh viễn giúp bạn kiếm tiền nhanh gấp 10 lần ở vòng chơi tiếp theo!
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 w-full md:w-auto">
            <div className="bg-slate-900/90 border border-purple-500/40 px-5 py-3 rounded-2xl text-center w-full">
              <div className="text-xs font-bold text-slate-400">ĐIỂM NHẬN ĐƯỢC NẾU RESET</div>
              <div className="text-2xl font-black text-purple-300 flex items-center justify-center gap-1.5">
                <Sparkles className="w-5 h-5 text-purple-400" />
                +{potentialPoints} Empire Points
              </div>
            </div>

            <button
              onClick={handlePrestigeClick}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-400 hover:via-pink-400 hover:to-indigo-400 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-purple-500/30 active:scale-95 transition-all"
            >
              TÁI SINH NGAY! 🚀
            </button>
          </div>
        </div>
      </div>

      {/* Permanent Empire Points Upgrades */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Nâng Cấp Vĩnh Viễn (Empire Upgrades)
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Không bao giờ bị mất đi, cộng dồn sức mạnh qua từng lần tái sinh!
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-500/40 text-purple-200 font-black text-xs">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Điểm hiện có: {empirePoints} ⭐</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prestigeUpgrades.map(upg => {
            const isMax = upg.level >= upg.maxLevel;
            const canAfford = empirePoints >= upg.cost;

            return (
              <div
                key={upg.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-3xl p-2 bg-slate-800 rounded-2xl border border-slate-700">
                      {upg.icon}
                    </span>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 border border-purple-500/30">
                      Cấp {upg.level} / {upg.maxLevel}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-100 mb-1">
                    {upg.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium mb-4">
                    {upg.description}
                  </p>
                </div>

                <button
                  onClick={() => buyPrestigeUpgrade(upg.id)}
                  disabled={isMax || !canAfford}
                  className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all ${
                    isMax
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : canAfford
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-md active:scale-98'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  {isMax ? (
                    'Đã đạt cấp tối đa'
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Nâng Cấp: {upg.cost} Empire Pts ⭐
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
