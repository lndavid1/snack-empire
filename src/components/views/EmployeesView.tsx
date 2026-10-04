import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  Users, 
  ArrowUpCircle, 
  Zap, 
  Heart,
  Battery,
  BatteryCharging,
  ChefHat,
  Award,
  Sparkles
} from 'lucide-react';
import type { EmployeeWorkState, EmployeeArchetype } from '../../types/game';

export const EmployeesView: React.FC = () => {
  const { 
    employees, 
    hireEmployee, 
    upgradeEmployee, 
    money,
    stations,
    assignEmployeeToStation,
    unassignEmployeeFromStation
  } = useGameStore();

  const hasCook = employees.some(e => e.role === 'cook' && e.hired);
  const hasCashier = employees.some(e => e.role === 'cashier' && e.hired);
  const isAutoReady = hasCook && hasCashier;

  const ARCHETYPE_LABELS: Record<EmployeeArchetype, { name: string; color: string; desc: string }> = {
    FAST: { name: 'Thần Tốc', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', desc: '+15% Tốc độ nấu' },
    QUALITY: { name: 'Nghệ Nhân', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', desc: '+20% Điểm chất lượng' },
    BALANCED: { name: 'Toàn Diện', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30', desc: 'Chỉ số đồng đều, ổn định' },
    HARDWORKER: { name: 'Bền Bỉ', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', desc: 'Tiêu hao thể lực ít hơn 25%' },
    SERVICE: { name: 'Niềm Nở', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', desc: '+25% Điểm dịch vụ & tiền Tip' }
  };

  const WORK_STATE_BADGES: Record<EmployeeWorkState, { label: string; bg: string; text: string }> = {
    WORKING: { label: '🔥 Đang Nấu', bg: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-300' },
    SERVING: { label: '🏃 Đang Bưng Món', bg: 'bg-emerald-500/20 border-emerald-500/40', text: 'text-emerald-300' },
    RESTING: { label: '💤 Đang Nghỉ Ngơi', bg: 'bg-indigo-500/20 border-indigo-500/40', text: 'text-indigo-300' },
    SEEKING_JOB: { label: '🔍 Tìm Việc', bg: 'bg-sky-500/20 border-sky-500/40', text: 'text-sky-300' },
    IDLE: { label: '🟢 Trực Sẵn Sàng', bg: 'bg-slate-700/60 border-slate-600/40', text: 'text-slate-300' },
    UNAVAILABLE: { label: '⚠️ Tạm Dừng', bg: 'bg-rose-500/20 border-rose-500/40', text: 'text-rose-300' }
  };

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
                {isAutoReady ? 'HỆ THỐNG TỰ ĐỘNG HÓA KÍCH HOẠT (PHASE 5)' : 'MẸO TỰ ĐỘNG HÓA'}
              </span>
            </div>
            <h3 className="text-sm md:text-base font-extrabold text-slate-100 mb-0.5 leading-snug">
              {isAutoReady
                ? 'Nhân viên tự động phân công: Nấu theo trạm, bưng món ưu tiên khách gấp & tự nghỉ ngơi khi mệt!'
                : 'Tuyển 1 Bếp Trưởng và 1 Thu Ngân để vận hành quy trình tự động!'}
            </h3>
            <p className="text-[11px] md:text-xs text-slate-400 font-medium leading-relaxed">
              Nhân viên tiêu tốn thể lực khi làm việc (-0.5/s) và tự hồi phục khi nghỉ (+1.5/s). Phân công trạm hợp lý để tối ưu năng suất.
            </p>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {employees.map(emp => {
          const canHire = money >= emp.hireCost;
          const canUpgrade = money >= emp.upgradeCost;
          const stamina = emp.stamina ?? 100;
          const maxStamina = emp.maxStamina ?? 100;
          const staminaPercent = Math.max(0, Math.min(100, (stamina / maxStamina) * 100));
          const workState = emp.workState || 'IDLE';
          const archetypeInfo = emp.archetype ? ARCHETYPE_LABELS[emp.archetype] : null;
          const stateBadge = WORK_STATE_BADGES[workState] || WORK_STATE_BADGES.IDLE;

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
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase px-2 py-0.2 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {emp.role}
                        </span>
                        {emp.hired && (
                          <span className="text-[10px] font-extrabold text-amber-400">
                            Lv.{emp.level}
                          </span>
                        )}
                        {archetypeInfo && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${archetypeInfo.color}`}>
                            {archetypeInfo.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {emp.hired && (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        {emp.mood}%
                      </span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${stateBadge.bg} ${stateBadge.text}`}>
                        {stateBadge.label}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 italic mb-2.5 font-medium line-clamp-2">
                  {emp.catchphrase}
                </p>

                {/* Archetype perk notice */}
                {archetypeInfo && (
                  <div className="text-[10px] text-slate-400 mb-2.5 flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-700/50">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Đặc trưng: <strong className="text-slate-200">{archetypeInfo.desc}</strong></span>
                  </div>
                )}

                {/* Stamina Bar (if hired) */}
                {emp.hired && (
                  <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60 mb-2.5 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400 flex items-center gap-1">
                        {workState === 'RESTING' ? (
                          <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        ) : (
                          <Battery className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        Thể lực:
                      </span>
                      <span className={`font-black ${
                        staminaPercent > 60 ? 'text-emerald-400' : staminaPercent > 25 ? 'text-amber-400' : 'text-rose-400 animate-pulse'
                      }`}>
                        {Math.round(stamina)} / {maxStamina} ({Math.round(staminaPercent)}%)
                        {workState === 'RESTING' && ' • Đang hồi phục'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700/80 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          staminaPercent > 60
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : staminaPercent > 25
                            ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                            : 'bg-rose-500 animate-pulse'
                        }`}
                        style={{ width: `${staminaPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Station Assignment (if hired) */}
                {emp.hired && (
                  <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60 mb-2.5 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold flex items-center gap-1 text-[11px]">
                        <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                        Trạm làm việc:
                      </span>
                    </div>
                    <select
                      value={emp.assignedStationId || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          assignEmployeeToStation(emp.id, val);
                        } else {
                          unassignEmployeeFromStation(emp.id);
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400 font-medium"
                    >
                      <option value="">(Tự do - Phục vụ chung)</option>
                      {stations.map(st => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.stationType.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Stats Breakdown */}
                <div className="space-y-1.5 bg-slate-800/80 rounded-2xl p-2.5 md:p-3 border border-slate-700/60 mb-3.5 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Tốc độ làm:</span>
                    <span className="text-amber-400 font-black">{emp.speed} ⚡</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Chất lượng:</span>
                    <span className="text-emerald-400 font-black">{emp.quality} ⭐</span>
                  </div>
                  {emp.skills && (
                    <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-700/60 text-[10px] text-slate-300">
                      <div>Chính xác: <strong className="text-amber-300">{emp.skills.accuracy}</strong></div>
                      <div>Dịch vụ: <strong className="text-sky-300">{emp.skills.service}</strong></div>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-1 border-t border-slate-700/60">
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
