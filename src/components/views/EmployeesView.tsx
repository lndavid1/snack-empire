import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  Users, 
  Sparkles, 
  ArrowUpCircle, 
  Zap, 
  CheckCircle, 
  DollarSign, 
  Heart 
} from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { employees, hireEmployee, upgradeEmployee, money } = useGameStore();

  const hasCook = employees.some(e => e.role === 'cook' && e.hired);
  const hasCashier = employees.some(e => e.role === 'cashier' && e.hired);
  const isAutoReady = hasCook && hasCashier;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Automation Status Banner */}
      <div className={`p-5 rounded-3xl border transition-all ${
        isAutoReady
          ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-emerald-500/50 shadow-lg'
          : 'bg-slate-900 border-amber-500/40'
      }`}>
        <div className="flex items-start gap-4">
          <div className="text-3xl p-3 bg-slate-800 rounded-2xl border border-slate-700 shrink-0">
            {isAutoReady ? '⚡' : '💡'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase ${
                isAutoReady
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {isAutoReady ? 'HỆ THỐNG ĐANG TỰ ĐỘNG BÁN' : 'MẸO TỰ ĐỘNG HÓA'}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-100 mb-1">
              {isAutoReady
                ? 'Đã tự động hóa! Quán tự nấu và phục vụ khách hàng liên tục.'
                : 'Hãy tuyển ít nhất 1 Bếp Trưởng và 1 Thu Ngân để mở khóa Tự Động Hóa!'}
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Khi có đủ bếp và thu ngân, bạn có thể treo máy để nhận tiền nổ ting ting mà không cần bấm nút thủ công!
            </p>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(emp => {
          const canHire = money >= emp.hireCost;
          const canUpgrade = money >= emp.upgradeCost;

          return (
            <div
              key={emp.id}
              className={`bg-slate-900 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                emp.hired
                  ? 'border-slate-800 hover:border-slate-700 shadow-lg'
                  : 'border-slate-800/60 opacity-85'
              }`}
            >
              <div>
                {/* Header Avatar & Name */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2 bg-slate-800 rounded-2xl border border-slate-700">
                      {emp.avatar}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100 leading-tight">
                        {emp.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
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

                <p className="text-xs text-slate-400 italic mb-4 font-medium">
                  {emp.catchphrase}
                </p>

                {/* Stats */}
                <div className="space-y-2 bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 mb-4 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Tốc độ làm việc:</span>
                    <span className="text-amber-400 font-black">{emp.speed} ⚡</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Chất lượng phục vụ:</span>
                    <span className="text-emerald-400 font-black">{emp.quality} ⭐</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Lương chi trả:</span>
                    <span className="text-slate-300">${emp.salaryPerSec.toFixed(1)}/giây</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                {emp.hired ? (
                  <button
                    onClick={() => upgradeEmployee(emp.id)}
                    disabled={!canUpgrade}
                    className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all ${
                      canUpgrade
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-98'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>Đào Tạo & Tăng Level (${emp.upgradeCost.toLocaleString()})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => hireEmployee(emp.id)}
                    disabled={!canHire}
                    className={`w-full py-3 px-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all ${
                      canHire
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md active:scale-98'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <Users className="w-4 h-4" />
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
