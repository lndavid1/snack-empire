import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useGameStore } from '../store/gameStore';
import { 
  selectStations, 
  selectEquipment, 
  selectProductionJobs, 
  selectEmployees, 
  selectCustomers, 
  selectFoods 
} from './bridge/gameStateSelectors';
import { getRestaurant3DState } from './bridge/gameStateBridge';
import type { InspectedObject } from './types/sceneTypes';
import { CAMERA_CONFIG } from './config/cameraConfig';
import { RestaurantScene } from './components/RestaurantScene';
import { InspectionPanel } from './components/ui/InspectionPanel';
import { WebGLFallback } from './components/ui/WebGLFallback';
import { 
  RotateCcw, 
  Home, 
  Eye, 
  Sparkles, 
  Users, 
  ChefHat, 
  Clock 
} from 'lucide-react';

interface Restaurant3DViewProps {
  onBackTo2D?: () => void;
}

export const Restaurant3DView: React.FC<Restaurant3DViewProps> = ({ onBackTo2D }) => {
  const [inspected, setInspected] = useState<InspectedObject>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // Subscribe to granular store slices
  const stations = useGameStore(selectStations);
  const equipment = useGameStore(selectEquipment);
  const productionJobs = useGameStore(selectProductionJobs);
  const employees = useGameStore(selectEmployees);
  const customers = useGameStore(selectCustomers);
  const foods = useGameStore(selectFoods);

  // Check WebGL availability safely on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGLError(true);
      }
    } catch {
      setHasWebGLError(true);
    }
  }, []);

  // Compute 3D Presentation Scene State purely from Zustand Game State
  const sceneState = useMemo(() => {
    return getRestaurant3DState({
      stations,
      equipment,
      productionJobs,
      employees,
      customers,
      foods,
    });
  }, [stations, equipment, productionJobs, employees, customers, foods]);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const hiredCount = employees.filter(e => e.hired).length;
  const waitingCustomersCount = customers.filter(c => c.state === 'waiting').length;
  const activeCookingJobsCount = productionJobs.filter(j => 
    ['PREPARING', 'COOKING', 'ASSEMBLING', 'PACKING'].includes(j.status)
  ).length;

  if (hasWebGLError) {
    return <WebGLFallback onBackTo2D={onBackTo2D || (() => {})} />;
  }

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] md:min-h-[620px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl animate-fade-in flex flex-col">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Title & Live Status Pills */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg flex items-center gap-2">
            <span className="text-base">🏢</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs md:text-sm text-slate-100">
                  Mô Phỏng 3D Nhà Hàng
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LIVE
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold">
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>{hiredCount} nhân sự</span>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{waitingCustomersCount} khách chờ</span>
            </div>
            {activeCookingJobsCount > 0 && (
              <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1 animate-pulse">
                <ChefHat className="w-3.5 h-3.5" />
                <span>{activeCookingJobsCount} đang nấu</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={resetCamera}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            title="Đặt lại góc camera ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Góc Nhìn Gốc</span>
          </button>

          {onBackTo2D && (
            <button
              onClick={onBackTo2D}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
              title="Quay lại giao diện quản lý 2D"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Quản Lý 2D</span>
            </button>
          )}
        </div>
      </div>

      {/* R3F Canvas */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        <Canvas
          shadows
          camera={{
            position: CAMERA_CONFIG.initialPosition,
            fov: CAMERA_CONFIG.fov,
          }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
          }}
        >
          <RestaurantScene 
            sceneState={sceneState} 
            onInspect={setInspected}
            controlsRef={controlsRef}
          />
        </Canvas>
      </div>

      {/* Interactive Click Inspector Panel */}
      <InspectionPanel 
        inspected={inspected} 
        onClose={() => setInspected(null)} 
      />

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-2.5 left-3 z-10 hidden md:flex items-center gap-2 pointer-events-none text-[10px] text-slate-400/80 bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800/60">
        <Eye className="w-3 h-3 text-amber-400" />
        <span>Kéo chuột trái: Xoay | Chuột phải: Di chuyển | Cuộn chuột: Zoom | Chạm trạm/nhân vật để xem thông tin</span>
      </div>
    </div>
  );
};
