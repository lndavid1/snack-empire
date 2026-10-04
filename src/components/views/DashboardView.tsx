import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { STORE_TIERS } from '../../data/initialData';
import { getRecipeById } from '../../data/recipes';
import type { FoodItem, Review, Customer, Employee } from '../../types/game';
import { 
  Users, 
  Star, 
  Zap, 
  Wrench, 
  ChefHat, 
  PackageCheck, 
  Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DashboardView: React.FC = () => {
  const {
    currentTierId,
    customers,
    foods,
    employees,
    manualCookAndServe,
    totalSalesCount,
    totalRevenueEarned,
    totalCustomersServed,
    reviews,
    stations,
    equipment,
    productionJobs,
    repairEquipment
  } = useGameStore();

  const [isCooking, setIsCooking] = useState(false);

  const currentTier = STORE_TIERS.find(t => t.id === currentTierId) || STORE_TIERS[0];
  const hasCook = employees.some((emp: Employee) => emp.role === 'cook' && emp.hired);
  const hasCashier = employees.some((emp: Employee) => emp.role === 'cashier' && emp.hired);
  const isAutomated = hasCook && hasCashier;
  const readyJobs = productionJobs.filter(j => j.status === 'READY');

  const handleHeroClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top;

    setIsCooking(true);
    setTimeout(() => setIsCooking(false), 200);

    const success = manualCookAndServe();
    if (success) {
      if (Math.random() < 0.2) {
        confetti({
          particleCount: 20,
          spread: 45,
          origin: { x: clickX / window.innerWidth, y: clickY / window.innerHeight }
        });
      }
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Storefront Hero Card */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-4 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-60 md:w-80 h-60 md:h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative z-10">
          {/* Store Visual & Mascot */}
          <div className="flex items-center gap-3 md:gap-5 text-center md:text-left w-full md:w-auto justify-center md:justify-start">
            <div className="relative shrink-0">
              <div className="text-5xl md:text-7xl p-2.5 md:p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-inner animate-pulse-glow">
                {currentTier.icon}
              </div>
              <span className="absolute -bottom-1 -right-1 text-base md:text-xl">
                🔥
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] md:text-xs border border-amber-500/30">
                  TIER {currentTier.tierNumber} / 10
                </span>
                {isAutomated && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] md:text-xs border border-emerald-500/30 animate-pulse">
                    <Zap className="w-3 h-3" /> TỰ ĐỘNG
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-3xl font-black text-slate-100 tracking-tight m-0">
                {currentTier.name}
              </h2>
              <p className="text-xs md:text-sm text-slate-400 italic mt-0.5 font-medium line-clamp-1">
                {currentTier.quote}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 w-full md:w-auto">
            <div className="bg-slate-800/80 border border-slate-700/60 p-2 md:p-3 rounded-xl md:rounded-2xl text-center">
              <div className="text-[10px] md:text-[11px] font-bold text-slate-400">ĐÃ PHỤC VỤ</div>
              <div className="text-sm md:text-lg font-black text-amber-400">
                {totalCustomersServed.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-2 md:p-3 rounded-xl md:rounded-2xl text-center">
              <div className="text-[10px] md:text-[11px] font-bold text-slate-400">TỔNG ĐƠN BÁN</div>
              <div className="text-sm md:text-lg font-black text-emerald-400">
                {totalSalesCount.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-2 md:p-3 rounded-xl md:rounded-2xl text-center">
              <div className="text-[10px] md:text-[11px] font-bold text-slate-400">TỔNG THU VỀ</div>
              <div className="text-sm md:text-lg font-black text-sky-400">
                ${totalRevenueEarned.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Kitchen & Hero Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Left 2 Cols: Main Kitchen & Customer Lineup */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Queue Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                <h3 className="font-extrabold text-xs md:text-base text-slate-200">
                  Hàng Khách Chờ ({customers.length}/{currentTier.maxCustomers})
                </h3>
              </div>
              <span className="text-[11px] md:text-xs text-slate-400 font-medium">
                {customers.length === 0 ? 'Đang chờ khách ghé...' : 'Khách đang đói! 🔥'}
              </span>
            </div>

            {/* Customers Scrollable List */}
            <div className="min-h-[105px] flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
              {customers.length === 0 ? (
                <div className="w-full text-center py-5 text-slate-500 font-medium text-xs flex flex-col items-center gap-1.5">
                  <span className="text-2xl animate-bounce">🚶‍♂️</span>
                  Khách đang tới quán! Bấm nút bên dưới để phục vụ.
                </div>
              ) : (
                customers.map((c: Customer, _idx: number) => {
                  const patiencePercent = Math.max(0, (c.currentWait / c.patience) * 100);
                  const foodItem = foods.find((f: FoodItem) => f.id === c.orderedFoodId) || foods[0];

                  return (
                    <div
                      key={c.id}
                      className="shrink-0 w-28 md:w-36 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-2.5 md:p-3 flex flex-col items-center text-center relative hover:scale-105 transition-transform"
                    >
                      {/* Customer Order Bubble */}
                      <div className="absolute -top-3 bg-amber-500 text-slate-950 px-2 py-0.2 rounded-full text-[10px] md:text-[11px] font-black border border-amber-300 shadow-sm flex items-center gap-1">
                        <span>{foodItem.icon}</span>
                        <span>${foodItem.sellingPrice}</span>
                      </div>

                      {/* Avatar */}
                      <div className="text-2xl md:text-3xl my-1">{c.avatar}</div>

                      {/* Name & Archetype */}
                      <div className="font-bold text-[11px] md:text-xs text-slate-200 truncate w-full">
                        {c.name}
                      </div>
                      <div className="text-[9px] md:text-[10px] text-slate-400 capitalize">
                        {c.archetype}
                      </div>

                      {/* Patience Progress Bar */}
                      <div className="w-full bg-slate-700/80 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            patiencePercent > 50
                              ? 'bg-emerald-400'
                              : patiencePercent > 20
                              ? 'bg-amber-400'
                              : 'bg-rose-500 animate-pulse'
                          }`}
                          style={{ width: `${patiencePercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Production Kitchen & Stations Monitor (Phase 3 Engine) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                <h3 className="font-extrabold text-xs md:text-base text-slate-200">
                  Dây Chuyền Bếp ({stations.filter(s => s.isOperational).length} Trạm Hoạt Động)
                </h3>
              </div>
              {readyJobs.length > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] md:text-xs border border-emerald-500/40 animate-pulse">
                  <PackageCheck className="w-3.5 h-3.5" /> {readyJobs.length} Món Đã Chín!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-3">
              {stations.map(station => {
                const equip = equipment.find(e => e.id === station.equipmentId);
                const activeJob = productionJobs.find(j => j.id === station.activeJobId && !['READY', 'SERVED', 'FAILED', 'CANCELLED'].includes(j.status));
                const activeRecipe = activeJob ? getRecipeById(activeJob.recipeId) : null;
                const activeStep = activeRecipe && activeJob ? activeRecipe.steps[activeJob.currentStepIndex] : null;

                const stationIcons: Record<string, string> = {
                  prep: '🔪',
                  fryer: '🍟',
                  packing: '📦',
                  grill: '🥩',
                  beverage: '☕'
                };

                return (
                  <div
                    key={station.id}
                    className={`bg-slate-800/80 border rounded-xl md:rounded-2xl p-2.5 md:p-3 flex flex-col justify-between transition-all ${
                      activeJob
                        ? 'border-amber-500/60 shadow-md shadow-amber-500/10'
                        : 'border-slate-700/60'
                    }`}
                  >
                    <div>
                      {/* Station Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl md:text-2xl">{stationIcons[station.stationType] || '🍳'}</span>
                          <div>
                            <div className="font-black text-xs text-slate-200 leading-tight">
                              {station.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Hàng đợi: <span className="font-bold text-amber-300">{station.queue.length}</span>
                            </div>
                          </div>
                        </div>

                        {/* Condition Badge & Repair */}
                        {equip && (
                          <div className="text-right">
                            <div className={`text-[10px] font-bold ${
                              equip.condition >= 80 ? 'text-emerald-400' : equip.condition >= 50 ? 'text-amber-400' : 'text-rose-400'
                            }`}>
                              Độ bền {Math.round(equip.condition)}%
                            </div>
                            {equip.condition < 95 && (
                              <button
                                onClick={() => repairEquipment(equip.id)}
                                className="text-[9px] font-black px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/40 transition-colors flex items-center gap-0.5 mt-0.5 cursor-pointer ml-auto"
                                title="Bảo trì thiết bị"
                              >
                                <Wrench className="w-2.5 h-2.5" /> Sửa
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Active Job or Idle State */}
                      {activeJob ? (
                        <div className="space-y-1.5 my-1">
                          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-300">
                            <span className="truncate">{activeRecipe?.name || 'Đang nấu'}</span>
                            <span className="text-amber-400 shrink-0">{Math.round(activeJob.progress)}%</span>
                          </div>
                          <div className="text-[10px] text-slate-400 italic truncate">
                            {activeStep?.name || activeJob.status}
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-slate-700/80 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300 animate-pulse"
                              style={{ width: `${Math.min(100, Math.max(5, activeJob.progress))}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="py-2.5 text-center text-slate-500 text-[11px] font-medium flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" /> Trống - Sẵn sàng
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Huge Hero Action Cook & Serve Button (Thumb Zone Friendly >= 56px) */}
          <div className="relative">
            <button
              onClick={handleHeroClick}
              disabled={customers.length === 0 && readyJobs.length === 0}
              className={`w-full min-h-[56px] py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl uppercase tracking-wider transition-all duration-150 flex flex-col items-center justify-center gap-1 relative overflow-hidden shadow-2xl active:scale-95 ${
                readyJobs.length > 0
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 shadow-emerald-500/30 cursor-pointer ring-4 ring-emerald-400/40 animate-pulse'
                  : customers.length > 0
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 text-slate-950 shadow-orange-500/25 cursor-pointer ring-4 ring-amber-500/30'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              } ${isCooking ? 'scale-95 brightness-125' : ''}`}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-2xl md:text-3xl animate-wiggle">
                  {readyJobs.length > 0 ? '🍟' : '🍳'}
                </span>
                <span>
                  {readyJobs.length > 0 ? `BƯNG MÓN CHO KHÁCH (${readyJobs.length} SẴN SÀNG)` : 'NẤU & PHỤC VỤ NGAY!'}
                </span>
                <span className="text-2xl md:text-3xl animate-bounce">💵</span>
              </div>
              <span className="text-[11px] md:text-xs font-bold tracking-normal opacity-90 text-slate-900">
                {readyJobs.length > 0
                  ? `[ Món đã nấu chín trong bếp! Chạm để bưng phục vụ khách ]`
                  : customers.length > 0
                  ? `[ Chạm để nấu món cho khách đầu tiên ]`
                  : `(Đang đợi khách hàng tiếp theo...)`}
              </span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Customer Reviews */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-400 fill-amber-400" />
                <h3 className="font-extrabold text-xs md:text-base text-slate-200">
                  Đánh Giá Từ Khách
                </h3>
              </div>
              <span className="text-[10px] md:text-[11px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                5.0 ★ Top Hot
              </span>
            </div>

            {/* Review Cards list */}
            <div className="space-y-2 max-h-[260px] md:max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
              {reviews.map((rev: Review) => (
                <div
                  key={rev.id}
                  className="bg-slate-800/80 border border-slate-700/70 rounded-xl md:rounded-2xl p-2.5 md:p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-200">
                      <span>{rev.avatar}</span>
                      <span>{rev.customerName}</span>
                    </div>
                    <div className="flex text-amber-400 text-[10px]">
                      {'★'.repeat(rev.stars)}
                    </div>
                  </div>
                  <p className="text-slate-300 font-medium italic text-[11px] md:text-xs">
                    "{rev.comment}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold pt-1 border-t border-slate-700/50">
                    <span className="text-amber-300/80">{rev.foodName}</span>
                    <span>{rev.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
