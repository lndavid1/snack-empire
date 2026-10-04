import React from 'react';
import { Html } from '@react-three/drei';
import type { Station3DState } from '../../types/sceneTypes';

interface StationLabel3DProps {
  station: Station3DState;
  position?: [number, number, number];
  onClick?: () => void;
}

export const StationLabel3D: React.FC<StationLabel3DProps> = ({
  station,
  position = [0, 1.6, 0],
  onClick,
}) => {
  const cond = Math.round(station.equipmentCondition);
  const condColor = cond >= 80 ? 'text-emerald-400' : cond >= 50 ? 'text-amber-400' : 'text-rose-400';
  const hasJob = !!station.activeJob;

  return (
    <Html position={position} center distanceFactor={14} zIndexRange={[100, 0]}>
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className={`px-2 py-1 rounded-xl shadow-lg border text-center select-none cursor-pointer transition-transform hover:scale-110 active:scale-95 whitespace-nowrap ${
          hasJob 
            ? 'bg-slate-900/90 border-amber-500/70 shadow-amber-500/20' 
            : 'bg-slate-900/80 border-slate-700/80 shadow-black/40'
        }`}
      >
        <div className="flex items-center gap-1.5 justify-center">
          <span className="font-black text-[11px] text-slate-100">{station.name}</span>
          <span className={`text-[10px] font-bold ${condColor}`}>
            {cond}%
          </span>
        </div>

        {hasJob && (
          <div className="mt-0.5">
            <div className="flex items-center justify-between text-[9px] text-amber-300 font-bold gap-2">
              <span className="truncate max-w-[70px]">{station.activeJob?.recipeName}</span>
              <span>{Math.round(station.activeJob?.progress || 0)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-0.5">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${station.activeJob?.progress || 0}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Html>
  );
};
