import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  Package, 
  Truck, 
  ShoppingCart, 
  Check, 
  AlertTriangle, 
  Zap, 
  ShieldCheck, 
  Sparkles 
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
    <div className="space-y-6 animate-fade-in">
      {/* Supplier Selection Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-400" />
              Chọn Nhà Cung Cấp Nguyên Liệu
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Mỗi nhà cung cấp mang lại ưu đãi về giá chiết khấu, chất lượng và danh tiếng khác nhau.
            </p>
          </div>

          {/* Auto Restock Toggle */}
          <button
            onClick={toggleAutoRestock}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
              autoRestock
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Zap className={`w-4 h-4 ${autoRestock ? 'text-emerald-400 fill-emerald-400' : 'text-slate-500'}`} />
            <span>Tự Động Nhập (Auto): {autoRestock ? 'BẬT' : 'TẮT'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {suppliers.map(sup => {
            const isSelected = sup.id === selectedSupplierId;

            return (
              <button
                key={sup.id}
                onClick={() => setSelectedSupplier(sup.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/15 to-slate-800 border-amber-500/80 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 text-amber-400 text-xs font-black flex items-center gap-1">
                    <Check className="w-4 h-4" /> Đang chọn
                  </span>
                )}
                <div className="font-extrabold text-sm text-slate-100 mb-1">
                  {sup.name}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight mb-3">
                  {sup.tagline}
                </div>
                <div className="space-y-1 text-[11px] font-bold">
                  <div className="flex justify-between text-slate-300">
                    <span>Giá:</span>
                    <span className={sup.discountRate < 1 ? 'text-emerald-400 font-extrabold' : 'text-slate-300'}>
                      {sup.discountRate < 1 ? `Giảm ${Math.round((1 - sup.discountRate) * 100)}%` : `${sup.discountRate}x`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Giao hàng:</span>
                    <span className="text-amber-300">{sup.deliverySpeed}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inventory Stock Grid Header with Batch Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            Tồn Kho Nguyên Liệu
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Đảm bảo luôn đủ nguyên liệu để không bỏ lỡ khách hàng đói bụng!
          </p>
        </div>

        {/* Multiplier buttons */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-bold">
          <span className="text-slate-400 px-2 text-[11px]">Mua:</span>
          {([1, 5, 10] as const).map(mult => (
            <button
              key={mult}
              onClick={() => setBatchMultiplier(mult)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ingredients.map(ing => {
          const buyAmount = ing.minBatch * batchMultiplier;
          const cost = Math.round(ing.basePrice * buyAmount * selectedSupplier.discountRate);
          const canAfford = money >= cost;
          const isLowStock = ing.stock <= 5;

          return (
            <div
              key={ing.id}
              className={`bg-slate-900 border rounded-3xl p-4 flex flex-col justify-between transition-all ${
                isLowStock
                  ? 'border-rose-500/50 shadow-rose-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-2 bg-slate-800 rounded-2xl border border-slate-700">
                      {ing.icon}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100 leading-tight">
                        {ing.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {ing.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Level Badge */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 my-3">
                  <span className="text-xs text-slate-400 font-bold">Tồn kho:</span>
                  <div className="flex items-center gap-1.5">
                    {isLowStock && (
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                        Sắp hết!
                      </span>
                    )}
                    <span className={`font-black text-sm ${isLowStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {ing.stock} {ing.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buy Action Button */}
              <button
                onClick={() => buyIngredient(ing.id, buyAmount)}
                disabled={!canAfford}
                className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                  canAfford
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-98'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Nhập +{buyAmount} ({ing.unit}): ${cost.toLocaleString()}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
