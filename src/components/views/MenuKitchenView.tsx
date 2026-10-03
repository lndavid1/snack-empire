import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { FoodCategory, FoodItem } from '../../types/game';
import { 
  Sparkles, 
  Lock, 
  ArrowUpCircle, 
  DollarSign, 
  Clock, 
  Flame, 
  TrendingUp,
  Tag
} from 'lucide-react';

export const MenuKitchenView: React.FC = () => {
  const { 
    foods, 
    ingredients, 
    money, 
    unlockFood, 
    upgradeFood, 
    setFoodPrice 
  } = useGameStore();

  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'all'>('all');

  const categories: { id: FoodCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Tất Cả Món', icon: '🍽️' },
    { id: 'fastfood', label: 'Fast Food', icon: '🍔' },
    { id: 'drinks', label: 'Đồ Uống', icon: '🥤' },
    { id: 'dessert', label: 'Tráng Miệng', icon: '🍩' },
    { id: 'special', label: 'Đặc Biệt VIP', icon: '👑' },
  ];

  const filteredFoods = activeCategory === 'all'
    ? foods
    : foods.filter(f => f.category === activeCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Category selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map(food => {
          const canUnlock = money >= food.costToUnlock;
          const canUpgrade = money >= food.upgradeCost;

          return (
            <div
              key={food.id}
              className={`relative rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                food.isUnlocked
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800/60 opacity-80'
              }`}
            >
              <div>
                {/* Header Icon & Level */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl p-2.5 bg-slate-800 rounded-2xl border border-slate-700">
                      {food.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-100 leading-tight">
                        {food.name}
                      </h3>
                      {food.isUnlocked ? (
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Công thức Lv.{food.level}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Chưa mở khóa
                        </span>
                      )}
                    </div>
                  </div>

                  {food.isUnlocked && (
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-bold">GIÁ BÁN</div>
                      <div className="text-lg font-black text-emerald-400">
                        ${food.sellingPrice}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description & Meme */}
                <p className="text-xs text-slate-300 mb-2 font-medium">
                  {food.description}
                </p>
                <p className="text-[11px] text-amber-300/80 italic mb-4">
                  {food.memeQuote}
                </p>

                {/* Recipe ingredients requirement */}
                <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 mb-4">
                  <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center justify-between">
                    <span>Nguyên liệu cho 1 suất:</span>
                    <span>Chuẩn bị: ~{food.basePrepTime}s</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {food.ingredients.map(req => {
                      const ing = ingredients.find(i => i.id === req.ingredientId);
                      const isStocked = ing && ing.stock >= req.amount;

                      return (
                        <span
                          key={req.ingredientId}
                          className={`text-[11px] font-bold px-2 py-1 rounded-xl flex items-center gap-1 border ${
                            isStocked
                              ? 'bg-slate-700/60 text-slate-200 border-slate-600/60'
                              : 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                          }`}
                        >
                          <span>{ing?.icon}</span>
                          <span>{ing?.name}</span>
                          <span className="opacity-75">x{req.amount}</span>
                          {!isStocked && <span className="text-[10px]">🚨 Hết!</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                {food.isUnlocked ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => upgradeFood(food.id)}
                      disabled={!canUpgrade}
                      className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all ${
                        canUpgrade
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-98'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      <span>Nâng Cấp Công Thức (${food.upgradeCost.toLocaleString()})</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => unlockFood(food.id)}
                    disabled={!canUnlock}
                    className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all ${
                      canUnlock
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md active:scale-98'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Mở Khóa Món Mới (${food.costToUnlock.toLocaleString()})</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
