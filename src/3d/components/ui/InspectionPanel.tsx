import React from 'react';
import type { InspectedObject } from '../../types/sceneTypes';
import { useGameStore } from '../../../store/gameStore';
import { 
  X, 
  Wrench, 
  ChefHat, 
  Zap, 
  Clock, 
  User, 
  ArrowUpCircle, 
  Smile, 
  Frown, 
  Heart 
} from 'lucide-react';

interface InspectionPanelProps {
  inspected: InspectedObject;
  onClose: () => void;
}

export const InspectionPanel: React.FC<InspectionPanelProps> = ({ inspected, onClose }) => {
  const { repairEquipment, upgradeEmployee, money } = useGameStore();

  if (!inspected) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-slate-100 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {inspected.type === 'station' && <ChefHat className="w-5 h-5 text-amber-400" />}
          {inspected.type === 'employee' && <User className="w-5 h-5 text-sky-400" />}
          {inspected.type === 'customer' && <Smile className="w-5 h-5 text-emerald-400" />}
          <span className="font-extrabold text-sm text-slate-100">
            {inspected.type === 'station' ? 'Thông Tin Thiết Bị' : inspected.type === 'employee' ? 'Hồ Sơ Nhân Viên' : 'Chi Tiết Khách Hàng'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Station Details */}
      {inspected.type === 'station' && (() => {
        const station = inspected.data;
        const cond = Math.round(station.equipmentCondition);
        return (
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-black text-sm text-slate-100">{station.name}</span>
              <span className={`font-extrabold px-2 py-0.5 rounded-full text-[10px] ${
                cond >= 80 ? 'bg-emerald-500/20 text-emerald-300' : cond >= 50 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                Độ bền {cond}%
              </span>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-2.5 space-y-1.5 border border-slate-700/60">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Trực trạm:</span>
                <span className="font-bold text-slate-200">{station.assignedEmployeeName || 'Chưa có'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Hàng đợi:</span>
                <span className="font-bold text-amber-300">{station.queueCount} món</span>
              </div>
            </div>

            {/* Active Job Details */}
            {station.activeJob ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 space-y-1.5">
                <div className="flex justify-between items-center font-bold text-amber-300">
                  <span>{station.activeJob.recipeName}</span>
                  <span>{Math.round(station.activeJob.progress)}%</span>
                </div>
                <div className="text-[10px] text-slate-400 italic">
                  Đang thực hiện: {station.activeJob.stepName}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${station.activeJob.progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="py-2 text-center text-slate-500 italic">
                Trạm đang trống - Sẵn sàng nhận việc
              </div>
            )}

            {cond < 95 && (
              <button
                onClick={() => repairEquipment(station.id)}
                className="w-full py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Bảo Trì & Sửa Chữa</span>
              </button>
            )}
          </div>
        );
      })()}

      {/* 2. Employee Details */}
      {inspected.type === 'employee' && (() => {
        const emp = inspected.data;
        const staminaPct = Math.round((emp.stamina / emp.maxStamina) * 100);
        return (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-3xl p-1.5 bg-slate-800 rounded-xl border border-slate-700">{emp.avatar}</span>
              <div>
                <div className="font-black text-sm text-slate-100">{emp.name}</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                  <span className="uppercase font-bold text-amber-400">{emp.role}</span>
                  <span>•</span>
                  <span>Đặc trưng: {emp.archetype}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-2.5 space-y-1.5 border border-slate-700/60">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> Thể lực:
                </span>
                <span className={staminaPct > 50 ? 'text-emerald-400' : 'text-rose-400'}>
                  {Math.round(emp.stamina)} / {emp.maxStamina} ({staminaPct}%)
                </span>
              </div>
              <div className="w-full bg-slate-700/80 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    staminaPct > 60 ? 'bg-emerald-400' : staminaPct > 25 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${staminaPct}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-1 px-2.5 rounded-lg bg-slate-800 text-[11px]">
              <span className="text-slate-400 font-bold">Trạng thái:</span>
              <span className="font-black text-amber-300 uppercase">{emp.workState}</span>
            </div>

            <button
              onClick={() => upgradeEmployee(emp.id)}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              <span>Đào Tạo & Nâng Cấp</span>
            </button>
          </div>
        );
      })()}

      {/* 3. Customer Details */}
      {inspected.type === 'customer' && (() => {
        const cust = inspected.data;
        return (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-3xl p-1.5 bg-slate-800 rounded-xl border border-slate-700">{cust.avatar}</span>
              <div>
                <div className="font-black text-sm text-slate-100">{cust.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 capitalize">
                  Kiểu khách: {cust.archetype} • Tâm trạng: {cust.mood}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-2.5 space-y-1.5 border border-slate-700/60">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">Món đã gọi:</span>
                <span className="font-black text-amber-300">{cust.orderedFoodName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">Đang chờ:</span>
                <span className="font-mono text-slate-200">{cust.waitingTime} giây</span>
              </div>
            </div>

            {/* Patience progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-400">Kiên nhẫn còn lại:</span>
                <span className={cust.patiencePercent > 50 ? 'text-emerald-400' : 'text-rose-400'}>
                  {Math.round(cust.patience)}s ({Math.round(cust.patiencePercent)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    cust.patiencePercent > 50 ? 'bg-emerald-400' : cust.patiencePercent > 20 ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'
                  }`}
                  style={{ width: `${cust.patiencePercent}%` }}
                />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
