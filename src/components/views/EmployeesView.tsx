import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { StaffSlotService } from '../../services/staffSlotService';
import { CANDIDATE_POOL } from '../../data/staffSlots';
import { 
  Users, 
  ArrowUpCircle, 
  Zap, 
  Heart,
  Battery,
  BatteryCharging,
  ChefHat,
  Award,
  Sparkles,
  Lock,
  UserPlus,
  UserMinus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  DollarSign,
  Coffee,
  ConciergeBell,
  Trash2,
  X,
  BadgeCheck,
  Building2
} from 'lucide-react';
import type { 
  EmployeeWorkState, 
  EmployeeArchetype, 
  Employee, 
  StaffSlot, 
  EmployeeRole 
} from '../../types/game';

const ROLE_METADATA: Record<string, { label: string; icon: string; desc: string }> = {
  chef: { label: 'ĐẦU BẾP (CHEF)', icon: '👨‍🍳', desc: 'Chế biến món ăn tại các trạm bếp (sơ chế, chiên, đóng gói)' },
  cashier: { label: 'THU NGÂN (CASHIER)', icon: '💵', desc: 'Nhận đơn hàng tại quầy và điều phối bill vào bếp' },
  server: { label: 'PHỤC VỤ (SERVER)', icon: '🧑‍🍽️', desc: 'Bưng món ăn nóng hổi từ quầy ra bàn cho khách hàng' },
  cleaner: { label: 'TẠP VỤ (CLEANER)', icon: '🧹', desc: 'Dọn dẹp bàn ghế và giữ gìn vệ sinh không gian nhà hàng' }
};

const ARCHETYPE_LABELS: Record<EmployeeArchetype, { name: string; color: string; desc: string }> = {
  FAST: { name: 'Thần Tốc', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', desc: '+15% Tốc độ thao tác' },
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

export const EmployeesView: React.FC = () => {
  const store = useGameStore();
  const { 
    employees, 
    staffSlots,
    hireEmployeeIntoSlot, 
    fireEmployee,
    upgradeEmployee, 
    money,
    stations,
    assignEmployeeToStation,
    unassignEmployeeFromStation
  } = store;

  // Selected empty slot for hiring modal
  const [selectedSlotForHire, setSelectedSlotForHire] = useState<StaffSlot | null>(null);

  // Active role tab filter
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | 'chef' | 'cashier' | 'server' | 'cleaner'>('ALL');

  // Operational kitchen stations
  const operationalKitchenStations = stations.filter(s => s.isOperational).length;

  // Payroll summary
  const payroll = StaffSlotService.calculateStaffPayroll(employees);

  // Capacities by role
  const chefCapacity = StaffSlotService.getStaffCapacityByRole(staffSlots, employees, 'chef', operationalKitchenStations);
  const cashierCapacity = StaffSlotService.getStaffCapacityByRole(staffSlots, employees, 'cashier');
  const serverCapacity = StaffSlotService.getStaffCapacityByRole(staffSlots, employees, 'server');
  const cleanerCapacity = StaffSlotService.getStaffCapacityByRole(staffSlots, employees, 'cleaner');

  const totalHired = employees.filter(e => e.hired).length;
  const totalUnlockedSlots = staffSlots.filter(s => s.status !== 'LOCKED').length;

  const roles = ['chef', 'cashier', 'server', 'cleaner'] as const;

  // Get available candidates for selected slot
  const availableCandidates = selectedSlotForHire 
    ? [
        ...CANDIDATE_POOL.filter(c => 
          StaffSlotService.normalizeRole(c.role) === StaffSlotService.normalizeRole(selectedSlotForHire.role) &&
          !employees.some(e => e.id === c.id && e.hired)
        ),
        ...employees.filter(e => 
          !e.hired && 
          StaffSlotService.normalizeRole(e.role) === StaffSlotService.normalizeRole(selectedSlotForHire.role) &&
          !CANDIDATE_POOL.some(c => c.id === e.id)
        )
      ]
    : [];

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* 1. Header Overview & Business Payroll Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                Phase 7: Staff Capacity & Slot System
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                BUSINESS SIMULATION
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-100 flex items-center gap-2">
              <span>🏢</span> Định Ngạch & Quản Lý Nhân Sự
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Mỗi vị trí nhân sự được quản lý theo <strong className="text-slate-200">Staff Slot</strong>. Đạt điều kiện kinh doanh để mở slot mới, tuyển dụng ứng viên tài năng và phân bổ trạm làm việc hợp lý.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-sky-400" /> Tổng Nhân Sự
              </span>
              <span className="text-lg font-black text-slate-100 mt-0.5">
                {totalHired} <span className="text-xs text-slate-500 font-semibold">/ {totalUnlockedSlots} slot</span>
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" /> Quỹ Lương
              </span>
              <span className="text-lg font-black text-emerald-400 mt-0.5">
                ${payroll.totalSalaryPerSec}<span className="text-xs text-slate-400 font-semibold">/s</span>
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex flex-col justify-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Lương Theo Ngày
              </span>
              <span className="text-lg font-black text-amber-300 mt-0.5">
                ~${payroll.totalSalaryPerDay}<span className="text-xs text-slate-500 font-semibold">/ngày</span>
              </span>
            </div>
          </div>
        </div>

        {/* Workstation Bottleneck Alert */}
        {chefCapacity.hasWorkstationDeficit && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Cảnh báo trạm bếp:</strong> Bạn đang có {chefCapacity.occupiedSlots} Đầu Bếp nhưng chỉ có {operationalKitchenStations} Trạm bếp hoạt động! Hãy mở thêm trạm bếp để tối ưu công suất nấu nướng.
            </span>
          </div>
        )}
      </div>

      {/* 2. Role Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setSelectedRoleFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
            selectedRoleFilter === 'ALL'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          Tất Cả ({totalHired}/{totalUnlockedSlots})
        </button>

        {roles.map(roleKey => {
          const cap = roleKey === 'chef' ? chefCapacity 
            : roleKey === 'cashier' ? cashierCapacity
            : roleKey === 'server' ? serverCapacity
            : cleanerCapacity;
          const meta = ROLE_METADATA[roleKey];

          return (
            <button
              key={roleKey}
              onClick={() => setSelectedRoleFilter(roleKey)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedRoleFilter === roleKey
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{meta.icon}</span>
              <span>{roleKey.toUpperCase()}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedRoleFilter === roleKey ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {cap.occupiedSlots}/{cap.unlockedSlots}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Role Sections with Staff Slots */}
      <div className="space-y-6">
        {roles
          .filter(r => selectedRoleFilter === 'ALL' || selectedRoleFilter === r)
          .map(roleKey => {
            const meta = ROLE_METADATA[roleKey];
            const cap = roleKey === 'chef' ? chefCapacity 
              : roleKey === 'cashier' ? cashierCapacity
              : roleKey === 'server' ? serverCapacity
              : cleanerCapacity;

            const roleSlots = staffSlots.filter(s => 
              StaffSlotService.normalizeRole(s.role) === StaffSlotService.normalizeRole(roleKey)
            );

            return (
              <div key={roleKey} className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-4 md:p-5">
                {/* Role Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{meta.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-100 tracking-wide">
                          {meta.label}
                        </h3>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {cap.occupiedSlots} / {cap.unlockedSlots} ĐÃ TUYỂN
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        {meta.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Hiệu Suất:</span>
                      <span className="font-extrabold text-slate-200">{cap.utilizationRate}%</span>
                    </div>
                    <div className="h-6 w-px bg-slate-800" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Slot Mở:</span>
                      <span className="font-extrabold text-slate-200">{cap.unlockedSlots} / {cap.totalSlots}</span>
                    </div>
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {roleSlots.map((slot, slotIdx) => {
                    const assignedEmployee = slot.employeeId 
                      ? employees.find(e => e.id === slot.employeeId)
                      : undefined;

                    // CASE A: OCCUPIED SLOT
                    if (slot.status === 'OCCUPIED' && assignedEmployee) {
                      const emp = assignedEmployee;
                      const stamina = emp.stamina ?? 100;
                      const maxStamina = emp.maxStamina ?? 100;
                      const staminaPercent = Math.max(0, Math.min(100, (stamina / maxStamina) * 100));
                      const workState = emp.workState || 'IDLE';
                      const archetypeInfo = emp.archetype ? ARCHETYPE_LABELS[emp.archetype] : null;
                      const stateBadge = WORK_STATE_BADGES[workState] || WORK_STATE_BADGES.IDLE;
                      const canUpgrade = money >= emp.upgradeCost;

                      return (
                        <div
                          key={slot.id}
                          className="bg-slate-900 border border-slate-700/80 rounded-2xl md:rounded-3xl p-4 md:p-5 flex flex-col justify-between shadow-lg relative group transition-all hover:border-slate-600"
                        >
                          <div>
                            {/* Slot Badge & Work State */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                SLOT #{slotIdx + 1} • {slot.role.toUpperCase()}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stateBadge.bg} ${stateBadge.text}`}>
                                {stateBadge.label}
                              </span>
                            </div>

                            {/* Employee Info Header */}
                            <div className="flex items-start gap-3 mb-3">
                              <div className="text-3xl p-2.5 bg-slate-800 rounded-2xl border border-slate-700 shrink-0">
                                {emp.avatar}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-extrabold text-slate-100 text-sm truncate flex items-center gap-1.5">
                                  {emp.name}
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    Lv.{emp.level}
                                  </span>
                                </h4>
                                <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                                  {emp.catchphrase}
                                </p>
                                {archetypeInfo && (
                                  <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded border mt-1 ${archetypeInfo.color}`} title={archetypeInfo.desc}>
                                    ✨ {archetypeInfo.name}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Stamina Bar */}
                            <div className="mb-3 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                                <span className="flex items-center gap-1">
                                  {workState === 'RESTING' ? (
                                    <BatteryCharging className="w-3 h-3 text-indigo-400 animate-pulse" />
                                  ) : (
                                    <Battery className="w-3 h-3 text-emerald-400" />
                                  )}
                                  Thể Lực
                                </span>
                                <span className={staminaPercent <= 20 ? 'text-rose-400 font-extrabold' : 'text-slate-300'}>
                                  {Math.round(stamina)}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    staminaPercent <= 20 
                                      ? 'bg-rose-500' 
                                      : staminaPercent <= 50 
                                        ? 'bg-amber-400' 
                                        : 'bg-emerald-400'
                                  }`}
                                  style={{ width: `${staminaPercent}%` }}
                                />
                              </div>
                            </div>

                            {/* Skills Mini-Grid */}
                            <div className="grid grid-cols-3 gap-1 text-center bg-slate-950/40 p-2 rounded-xl border border-slate-800/80 mb-3 text-[10px]">
                              <div>
                                <span className="text-slate-500 block">Tốc Độ</span>
                                <span className="font-extrabold text-amber-300">+{emp.speed}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Chất Lượng</span>
                                <span className="font-extrabold text-emerald-300">+{emp.quality}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Lương</span>
                                <span className="font-extrabold text-slate-300">${emp.salaryPerSec}/s</span>
                              </div>
                            </div>

                            {/* Workstation Assignment for Cooks/Chefs */}
                            {(slot.role === 'chef' || emp.role === 'cook') && (
                              <div className="mb-3">
                                <label className="text-[10px] font-bold text-slate-400 mb-1 block flex items-center gap-1">
                                  <ChefHat className="w-3 h-3 text-amber-400" />
                                  Trạm làm việc:
                                </label>
                                <select
                                  value={emp.assignedStationId || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val) {
                                      assignEmployeeToStation(emp.id, val);
                                    } else if (emp.assignedStationId) {
                                      unassignEmployeeFromStation(emp.assignedStationId);
                                    }
                                  }}
                                  className="w-full text-xs font-semibold bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-400"
                                >
                                  <option value="">Linh Hoạt (Tự Động Chọn Trạm)</option>
                                  {stations.map(st => (
                                    <option key={st.id} value={st.id}>
                                      {st.name} {st.assignedEmployeeId && st.assignedEmployeeId !== emp.id ? '(Đã có người)' : ''}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons: Upgrade & Fire */}
                          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                            <button
                              onClick={() => upgradeEmployee(emp.id)}
                              disabled={!canUpgrade}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all ${
                                canUpgrade
                                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 active:scale-95'
                                  : 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed'
                              }`}
                            >
                              <ArrowUpCircle className="w-3.5 h-3.5" />
                              <span>Nâng Cấp (${emp.upgradeCost})</span>
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc chắn muốn sa thải ${emp.name}? Slot ${slot.role} sẽ trở về trạng thái trống.`)) {
                                  fireEmployee(emp.id);
                                }
                              }}
                              className="py-1.5 px-2.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all active:scale-95"
                              title="Sa thải nhân viên này để tuyển người khác"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // CASE B: EMPTY UNLOCKED SLOT
                    if (slot.status === 'EMPTY') {
                      return (
                        <div
                          key={slot.id}
                          className="bg-slate-900/80 border-2 border-dashed border-emerald-500/40 rounded-2xl md:rounded-3xl p-5 flex flex-col justify-between shadow-md hover:border-emerald-500/70 transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                SLOT #{slotIdx + 1} • VỊ TRÍ TRỐNG
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                                SẴN SÀNG
                              </span>
                            </div>

                            <div className="flex flex-col items-center justify-center text-center py-4">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl mb-2">
                                {meta.icon}
                              </div>
                              <h4 className="font-extrabold text-slate-100 text-sm">
                                Slot {meta.label} Trống
                              </h4>
                              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                                Vị trí đã mở khóa! Hãy tuyển dụng thêm 1 nhân sự để gia tăng hiệu suất.
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedSlotForHire(slot)}
                            className="w-full py-2.5 rounded-2xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span>Tuyển {meta.label}</span>
                          </button>
                        </div>
                      );
                    }

                    // CASE C: LOCKED SLOT
                    const checklist = StaffSlotService.getStaffSlotUnlockProgress(slot, store);

                    return (
                      <div
                        key={slot.id}
                        className="bg-slate-950/60 border border-slate-800/80 rounded-2xl md:rounded-3xl p-5 flex flex-col justify-between opacity-80"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              SLOT #{slotIdx + 1} • ĐANG KHÓA
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Chưa Đạt Điều Kiện
                            </span>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Lock className="w-4 h-4 text-slate-400" />
                              <h4 className="font-extrabold text-slate-200 text-sm">
                                Vị Trí {meta.label} #{slotIdx + 1}
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium mb-3">
                              Điều kiện mở khóa vị trí này:
                            </p>

                            {/* Unlock Requirements Checklist */}
                            <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                              {checklist.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {item.met ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                    )}
                                    <span className={item.met ? 'text-slate-300 font-medium truncate' : 'text-slate-400 truncate'}>
                                      {item.label}
                                    </span>
                                  </div>
                                  <span className={`font-bold shrink-0 ml-2 ${item.met ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {item.current}/{item.target}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="py-2 text-center text-[11px] font-extrabold text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/40">
                          🔒 Chưa Đủ Điều Kiện Mở Khóa
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* 4. Candidate Recruitment Modal */}
      {selectedSlotForHire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  TUYỂN DỤNG NHÂN SỰ
                </span>
                <h3 className="text-base md:text-lg font-black text-slate-100 mt-1 flex items-center gap-2">
                  <span>{ROLE_METADATA[selectedSlotForHire.role]?.icon}</span>
                  Tuyển {ROLE_METADATA[selectedSlotForHire.role]?.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlotForHire(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidates List */}
            <div className="p-4 md:p-5 overflow-y-auto space-y-3 flex-1">
              <p className="text-xs text-slate-400 font-medium">
                Chọn ứng viên phù hợp với ngân sách và chiến lược của nhà hàng:
              </p>

              {availableCandidates.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-semibold text-xs">
                  Hiện chưa có ứng viên nào cho vị trí này. Hãy kiểm tra lại sau!
                </div>
              ) : (
                availableCandidates.map(candidate => {
                  const canHire = money >= candidate.hireCost;
                  const archetypeInfo = candidate.archetype ? ARCHETYPE_LABELS[candidate.archetype] : null;

                  return (
                    <div
                      key={candidate.id}
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
                          {candidate.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-100 text-sm">
                              {candidate.name}
                            </h4>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Lv.{candidate.level}
                            </span>
                            {archetypeInfo && (
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${archetypeInfo.color}`}>
                                {archetypeInfo.name}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 italic mt-0.5 line-clamp-1">
                            {candidate.catchphrase}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400 mt-1.5">
                            <span>Tốc độ: <strong className="text-amber-300">+{candidate.speed}</strong></span>
                            <span>Chất lượng: <strong className="text-emerald-300">+{candidate.quality}</strong></span>
                            <span>Lương: <strong className="text-slate-300">${candidate.salaryPerSec}/s</strong></span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const success = hireEmployeeIntoSlot(selectedSlotForHire.id, candidate.id);
                          if (success) {
                            setSelectedSlotForHire(null);
                          }
                        }}
                        disabled={!canHire}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
                          canHire
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-95'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        Tuyển (${candidate.hireCost})
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950/70 border-t border-slate-800 text-right">
              <button
                onClick={() => setSelectedSlotForHire(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
