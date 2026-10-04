import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  Package, 
  Truck, 
  ShoppingCart, 
  Check, 
  Zap 
} from 'lucide-react';

export const InventorySuppliersView: React.FC = () => {
  const { 
    ingredients, 
    suppliers, 
    selectedSupplierId, 
    setSelectedSupplier, 
    buyIngredient, 
    money,
    autoRestock,
    toggleAutoRestock
  } = useGameStore();

  const [batchMultiplier, setBatchMultiplier] = useState<1 | 5 | 10>(1);

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Supplier Selection Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3.5">
          <div>
            <h3 className="text-sm md:text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Truck className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
              Chọn Nhà Cung Cấp
            </h3>
            <p className="text-[11px] md:text-xs text-slate-400 font-medium">
              Ưu đãi chiết khấu giá sỉ và danh tiếng.
            </p>
          </div>

          {/* Auto Restock Toggle */}
          <button
            onClick={toggleAutoRestock}
            className={`min-h-[44px] w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border select-none active:scale-95 ${
              autoRestock
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Zap className={`w-4 h-4 ${autoRestock ? 'text-emerald-400 fill-emerald-400' : 'text-slate-500'}`} />
            <span>Tự Động Nhập: {autoRestock ? 'BẬT' : 'TẮT'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3">
          {suppliers.map(sup => {
            const isSelected = sup.id === selectedSupplierId;

            return (
              <button
                key={sup.id}
                onClick={() => setSelectedSupplier(sup.id)}
                className={`min-h-[50px] p-3 md:p-4 rounded-xl md:rounded-2xl border text-left transition-all relative select-none active:scale-98 ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/15 to-slate-800 border-amber-500/80 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 text-amber-400 text-[10px] md:text-xs font-black flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Chọn
                  </span>
                )}
                <div className="font-extrabold text-xs md:text-sm text-slate-100 mb-0.5">
                  {sup.name}
                </div>
                <div className="text-[10px] md:text-[11px] text-slate-400 leading-tight mb-2 line-clamp-1">
                  {sup.tagline}
                </div>
                <div className="flex justify-between text-[10px] md:text-[11px] font-bold text-slate-300">
                  <span>Giá: <span className={sup.discountRate < 1 ? 'text-emerald-400 font-extrabold' : 'text-slate-300'}>{sup.discountRate < 1 ? `Giảm ${Math.round((1 - sup.discountRate) * 100)}%` : `${sup.discountRate}x`}</span></span>
                  <span className="text-amber-300">{sup.deliverySpeed}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inventory Stock Grid Header with Batch Selector */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm md:text-base font-extrabold text-slate-100 flex items-center gap-1.5 md:gap-2">
            <Package className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
            Tồn Kho Nguyên Liệu
          </h3>
          <p className="text-[10px] md:text-xs text-slate-400 font-medium hidden sm:block">
            Đảm bảo luôn đủ nguyên liệu để không bị hết hàng.
          </p>
        </div>

        {/* Multiplier buttons */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-bold">
          <span className="text-slate-400 px-1 text-[10px]">Mua:</span>
          {([1, 5, 10] as const).map(mult => (
            <button
              key={mult}
              onClick={() => setBatchMultiplier(mult)}
              className={`min-w-[32px] min-h-[30px] px-2 py-0.5 rounded-lg transition-colors select-none active:scale-90 ${
                batchMultiplier === mult
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              x{mult}
            </button>
          ))}
        </div>
      </div>

      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-4">
        {ingredients.map(ing => {
          const buyAmount = ing.minBatch * batchMultiplier;
          const cost = Math.round(ing.basePrice * buyAmount * selectedSupplier.discountRate);
          const canAfford = money >= cost;
          const isLowStock = ing.stock <= 5;

          return (
            <div
              key={ing.id}
              className={`bg-slate-900 border rounded-2xl md:rounded-3xl p-3 md:p-4 flex flex-col justify-between transition-all ${
                isLowStock
                  ? 'border-rose-500/50 shadow-rose-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-2xl md:text-3xl p-2 bg-slate-800 rounded-2xl border border-slate-700 shrink-0">
                    {ing.icon}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs md:text-sm text-slate-100 truncate">
                      {ing.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {ing.category}
                    </span>
                  </div>
                </div>

                {/* Stock Level Badge */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 my-2">
                  <span className="text-[11px] text-slate-400 font-bold">Tồn kho:</span>
                  <div className="flex items-center gap-1.5">
                    {isLowStock && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                        🚨 Hết
                      </span>
                    )}
                    <span className={`font-black text-xs md:text-sm ${isLowStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {ing.stock} {ing.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buy Action Button */}
              <button
                onClick={() => buyIngredient(ing.id, buyAmount)}
                disabled={!canAfford}
                className={`w-full min-h-[44px] py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all select-none active:scale-95 ${
                  canAfford
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                <span>Nhập +{buyAmount} ({ing.unit}): ${cost.toLocaleString()}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
