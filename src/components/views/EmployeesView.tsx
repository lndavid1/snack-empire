import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  Users, 
  ArrowUpCircle, 
  Zap, 
  Heart 
} from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { employees, hireEmployee, upgradeEmployee, money } = useGameStore();

  const hasCook = employees.some(e => e.role === 'cook' && e.hired);
  const hasCashier = employees.some(e => e.role === 'cashier' && e.hired);
  const isAutoReady = hasCook && hasCashier;

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Automation Status Banner */}
      <div className={`p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all ${
        isAutoReady
          ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-emerald-500/50 shadow-lg'
          : 'bg-slate-900 border-amber-500/40'
      }`}>
        <div className="flex items-start gap-3 md:gap-4">
          <div className="text-2xl md:text-3xl p-2.5 md:p-3 bg-slate-800 rounded-2xl border border-slate-700 shrink-0">
            {isAutoReady ? '⚡' : '💡'}
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`text-[9px] md:text-[10px] font-black px-2 py-0.2 rounded-full border uppercase ${
                isAutoReady
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {isAutoReady ? 'TỰ ĐỘNG HÓA KÍCH HOẠT' : 'MẸO TỰ ĐỘNG HÓA'}
              </span>
            </div>
            <h3 className="text-sm md:text-base font-extrabold text-slate-100 mb-0.5 leading-snug">
              {isAutoReady
                ? 'Đã tự động hóa! Quán tự động phục vụ liên tục 24/7.'
                : 'Tuyển 1 Bếp Trưởng và 1 Thu Ngân để mở khóa Tự Động Hóa!'}
            </h3>
            <p className="text-[11px] md:text-xs text-slate-400 font-medium leading-relaxed">
              Treo máy vẫn nhận tiền ting ting mà không cần bấm thủ công.
            </p>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {employees.map(emp => {
          const canHire = money >= emp.hireCost;
          const canUpgrade = money >= emp.upgradeCost;

          return (
            <div
              key={emp.id}
              className={`bg-slate-900 border rounded-2xl md:rounded-3xl p-4 md:p-5 flex flex-col justify-between transition-all ${
                emp.hired
                  ? 'border-slate-800 hover:border-slate-700 shadow-lg'
                  : 'border-slate-800/60 opacity-85'
              }`}
            >
              <div>
                {/* Header Avatar & Name */}
                <div className="flex items-start justify-between gap-2.5 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl md:text-4xl p-2 bg-slate-800 rounded-2xl border border-slate-700 shrink-0">
                      {emp.avatar}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100 leading-tight">
                        {emp.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase px-2 py-0.2 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {emp.role}
                        </span>
                        {emp.hired && (
                          <span className="text-[10px] font-extrabold text-amber-400">
                            Lv.{emp.level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {emp.hired && (
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      {emp.mood}%
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 italic mb-3 font-medium line-clamp-2">
                  {emp.catchphrase}
                </p>

                {/* Stats */}
                <div className="space-y-1.5 bg-slate-800/80 rounded-2xl p-2.5 md:p-3 border border-slate-700/60 mb-3.5 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Tốc độ làm:</span>
                    <span className="text-amber-400 font-black">{emp.speed} ⚡</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Chất lượng:</span>
                    <span className="text-emerald-400 font-black">{emp.quality} ⭐</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Lương:</span>
                    <span className="text-slate-300">${emp.salaryPerSec.toFixed(1)}/s</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                {emp.hired ? (
                  <button
                    onClick={() => upgradeEmployee(emp.id)}
                    disabled={!canUpgrade}
                    className={`w-full min-h-[44px] py-2 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all select-none active:scale-95 ${
                      canUpgrade
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4 shrink-0" />
                    <span>Đào Tạo (${emp.upgradeCost.toLocaleString()})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => hireEmployee(emp.id)}
                    disabled={!canHire}
                    className={`w-full min-h-[44px] py-2 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all select-none active:scale-95 ${
                      canHire
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    <span>Tuyển Dụng (${emp.hireCost.toLocaleString()})</span>
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
