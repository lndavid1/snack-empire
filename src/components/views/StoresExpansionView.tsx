import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { STORE_TIERS } from '../../data/initialData';
import { 
  Building2, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Wrench,
  Lock
} from 'lucide-react';

export const StoresExpansionView: React.FC = () => {
  const { 
    currentTierId, 
    upgradeStoreTier, 
    upgrades, 
    buyStoreUpgrade, 
    money 
  } = useGameStore();

  const currentTierIndex = STORE_TIERS.findIndex(t => t.id === currentTierId);
  const currentTier = STORE_TIERS[currentTierIndex] || STORE_TIERS[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Equipment Upgrades Section */}
      <div>
        <div className="mb-4">
          <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            Nâng Cấp Trang Thiết Bị Quán
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Tăng tốc độ chế biến, sức chứa bàn ghế và thu hút thêm khách ghé quán.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upgrades.map(upg => {
            const currentCost = Math.round(upg.baseCost * Math.pow(upg.costMultiplier, upg.level));
            const isMax = upg.level >= upg.maxLevel;
            const canAfford = money >= currentCost;

            return (
              <div
                key={upg.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-3xl p-2 bg-slate-800 rounded-2xl border border-slate-700">
                      {upg.icon}
                    </span>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                      Lv.{upg.level} / {upg.maxLevel}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-100 mb-1">
                    {upg.name}
                  </h4>
                  <p className="text-xs text-slate-400 mb-2 font-medium">
                    {upg.description}
                  </p>
                  <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/30 mb-4">
                    ✨ {upg.effectDescription}
                  </div>
                </div>

                <button
                  onClick={() => buyStoreUpgrade(upg.id)}
                  disabled={isMax || !canAfford}
                  className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all ${
                    isMax
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : canAfford
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-98'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  {isMax ? (
                    'Đã đạt cấp tối đa'
                  ) : (
                    <>Nâng Cấp: ${currentCost.toLocaleString()}</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Store Progression Tiers (Road to Empire) */}
      <div>
        <div className="mb-4">
          <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            Lộ Trình Mở Rộng Đế Chế (Tier 1 - 10)
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Từ chiếc xe đẩy vỉa hè cho đến chuỗi nhà hàng trên Sao Hỏa!
          </p>
        </div>

        <div className="space-y-3">
          {STORE_TIERS.map((tier, idx) => {
            const isCurrent = tier.id === currentTierId;
            const isUnlocked = idx <= currentTierIndex;
            const isNext = idx === currentTierIndex + 1;
            const canAfford = money >= tier.cost;

            return (
              <div
                key={tier.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/80 shadow-lg ring-2 ring-amber-500/20'
                    : isUnlocked
                    ? 'bg-slate-900/60 border-slate-800/80 opacity-75'
                    : isNext
                    ? 'bg-slate-900 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-950/40 border-slate-900 opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl p-3 bg-slate-800 rounded-2xl border border-slate-700 shrink-0">
                    {tier.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        Tier {tier.tierNumber}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đang hoạt động
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-black text-slate-100">
                      {tier.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {tier.description}
                    </p>
                    <p className="text-[11px] text-amber-300/80 italic mt-0.5">
                      {tier.quote}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-left md:text-right text-xs">
                    <div className="text-slate-400 font-bold">Lượng khách: <span className="text-emerald-400">x{tier.trafficMultiplier}</span></div>
                    <div className="text-slate-400 font-bold">Sức chứa: <span className="text-amber-400">{tier.maxCustomers} khách</span></div>
                  </div>

                  {isCurrent ? (
                    <div className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold">
                      Đang ở Tier này
                    </div>
                  ) : isUnlocked ? (
                    <div className="px-4 py-2 rounded-xl bg-slate-800/60 text-slate-500 text-xs font-bold">
                      Đã hoàn thành
                    </div>
                  ) : isNext ? (
                    <button
                      onClick={() => upgradeStoreTier(tier.id)}
                      disabled={!canAfford}
                      className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/25 active:scale-95'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Lên Đời: ${tier.cost.toLocaleString()}</span>
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-xl bg-slate-800/40 text-slate-600 text-xs font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Khóa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
