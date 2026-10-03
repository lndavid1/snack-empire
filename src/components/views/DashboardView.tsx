import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { STORE_TIERS } from '../../data/initialData';
import type { FoodItem, Review, Customer, Employee } from '../../types/game';
import { 
  Flame, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Star, 
  AlertCircle,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DashboardView: React.FC = () => {
  const {
    money,
    currentTierId,
    customers,
    foods,
    employees,
    manualCookAndServe,
    totalSalesCount,
    totalRevenueEarned,
    totalCustomersServed,
    reviews,
    activeEvent,
    addFloatingText
  } = useGameStore();

  const [isCooking, setIsCooking] = useState(false);

  const currentTier = STORE_TIERS.find(t => t.id === currentTierId) || STORE_TIERS[0];
  const hasCook = employees.some((emp: Employee) => emp.role === 'cook' && emp.hired);
  const hasCashier = employees.some((emp: Employee) => emp.role === 'cashier' && emp.hired);
  const isAutomated = hasCook && hasCashier;

  const handleHeroClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top;

    setIsCooking(true);
    setTimeout(() => setIsCooking(false), 200);

    const success = manualCookAndServe();
    if (success) {
      // Chance of mini confetti
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
    <div className="space-y-5 animate-fade-in">
      {/* Visual Storefront Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Store Visual & Mascot */}
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="relative">
              <div className="text-6xl md:text-7xl p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-inner animate-pulse-glow">
                {currentTier.icon}
              </div>
              <span className="absolute -bottom-2 -right-2 text-xl">
                🔥
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/30">
                  TIER {currentTier.tierNumber} / 10
                </span>
                {isAutomated && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30 animate-pulse">
                    <Zap className="w-3 h-3" /> TỰ ĐỘNG HÓA
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight m-0">
                {currentTier.name}
              </h2>
              <p className="text-sm text-slate-400 italic mt-1 font-medium">
                {currentTier.quote}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl text-center">
              <div className="text-[11px] font-bold text-slate-400">ĐÃ PHỤC VỤ</div>
              <div className="text-lg font-black text-amber-400">
                {totalCustomersServed.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl text-center">
              <div className="text-[11px] font-bold text-slate-400">TỔNG ĐƠN BÁN</div>
              <div className="text-lg font-black text-emerald-400">
                {totalSalesCount.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl text-center">
              <div className="text-[11px] font-bold text-slate-400">TỔNG THU VỀ</div>
              <div className="text-lg font-black text-sky-400">
                ${totalRevenueEarned.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Cook & Serve Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Main Kitchen & Customer Lineup */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Lineup Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-sm md:text-base text-slate-200">
                  Hàng Khách Chờ Đặt Món ({customers.length}/{currentTier.maxCustomers})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {customers.length === 0 ? 'Đang đợi khách ghé...' : 'Khách đang đói bụng! 🔥'}
              </span>
            </div>

            {/* Customers Scrollable List */}
            <div className="min-h-[110px] flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {customers.length === 0 ? (
                <div className="w-full text-center py-6 text-slate-500 font-medium text-xs flex flex-col items-center gap-1.5">
                  <span className="text-2xl animate-bounce">🚶‍♂️</span>
                  Khách đang trên đường tới quán! Bấm nút bên dưới để sẵn sàng phục vụ.
                </div>
              ) : (
                customers.map((c: Customer, _idx: number) => {
                  const patiencePercent = Math.max(0, (c.currentWait / c.patience) * 100);
                  const foodItem = foods.find((f: FoodItem) => f.id === c.orderedFoodId) || foods[0];

                  return (
                    <div
                      key={c.id}
                      className="shrink-0 w-36 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 flex flex-col items-center text-center relative hover:scale-105 transition-transform"
                    >
                      {/* Customer Order Bubble */}
                      <div className="absolute -top-3.5 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[11px] font-black border border-amber-300 shadow-sm flex items-center gap-1">
                        <span>{foodItem.icon}</span>
                        <span>${foodItem.sellingPrice}</span>
                      </div>

                      {/* Avatar */}
                      <div className="text-3xl my-1">{c.avatar}</div>

                      {/* Name & Archetype */}
                      <div className="font-bold text-xs text-slate-200 truncate w-full">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {c.archetype}
                      </div>

                      {/* Patience Progress Bar */}
                      <div className="w-full bg-slate-700/80 h-1.5 rounded-full overflow-hidden mt-2">
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

          {/* Huge Hero Action Cook & Serve Button */}
          <div className="relative">
            <button
              onClick={handleHeroClick}
              disabled={customers.length === 0}
              className={`w-full py-6 md:py-8 rounded-3xl font-black text-xl md:text-2xl uppercase tracking-wider transition-all duration-150 flex flex-col items-center justify-center gap-2 relative overflow-hidden shadow-2xl ${
                customers.length > 0
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-slate-950 active:scale-98 shadow-orange-500/25 cursor-pointer ring-4 ring-amber-500/30'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              } ${isCooking ? 'scale-95 brightness-125' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl animate-wiggle">🍳</span>
                <span>NẤU & PHỤC VỤ NGAY!</span>
                <span className="text-3xl md:text-4xl animate-bounce">💵</span>
              </div>
              <span className="text-xs md:text-sm font-bold tracking-normal opacity-90 lowercase text-slate-900">
                {customers.length > 0
                  ? `[ Click để phục vụ khách đầu tiên & nhận tiền nổ ting ting ]`
                  : `(Đang chờ khách hàng tiếp theo ghé quán...)`}
              </span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Customer Reviews & Meme Feedback */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h3 className="font-extrabold text-sm md:text-base text-slate-200">
                  Đánh Giá Từ Khách Hàng
                </h3>
              </div>
              <span className="text-[11px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                5.0 ★ Top Quán Hot
              </span>
            </div>

            {/* Review Cards list */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {reviews.map((rev: Review) => (
                <div
                  key={rev.id}
                  className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-3 text-xs space-y-1.5"
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
                  <p className="text-slate-300 font-medium italic">
                    "{rev.comment}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold pt-1 border-t border-slate-700/50">
                    <span className="text-amber-300/80">Món: {rev.foodName}</span>
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
