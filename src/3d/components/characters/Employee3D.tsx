import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Group } from 'three';
import { Vector3 } from 'three';
import type { Employee3DState } from '../../types/sceneTypes';

interface Employee3DProps {
  employee: Employee3DState;
  onSelect?: () => void;
}

export const Employee3D: React.FC<Employee3DProps> = ({ employee, onSelect }) => {
  const groupRef = useRef<Group>(null);
  const targetVec = useRef(new Vector3(...employee.targetPosition));

  // Update target on prop changes
  targetVec.current.set(...employee.targetPosition);

  // Smooth lerp movement toward target position
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.lerp(targetVec.current, Math.min(1, delta * 5));
    }
  });

  const isWorking = employee.workState === 'WORKING';
  const isResting = employee.workState === 'RESTING';
  const isServing = employee.workState === 'SERVING';

  const stateBadge = isWorking ? '🔥 Nấu' : isServing ? '🏃 Bưng' : isResting ? '💤 Nghỉ' : '🟢 Sẵn sàng';
  const stateColor = isWorking ? 'bg-amber-500/30 text-amber-300 border-amber-500/50' : 
                     isServing ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50' :
                     isResting ? 'bg-indigo-500/30 text-indigo-300 border-indigo-500/50' :
                     'bg-slate-700/40 text-slate-300 border-slate-600/40';

  const staminaPct = Math.round((employee.stamina / employee.maxStamina) * 100);

  return (
    <group 
      ref={groupRef} 
      position={employee.currentPosition}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Floating Status Billboard */}
      <Html position={[0, 2.05, 0]} center distanceFactor={14} zIndexRange={[100, 0]}>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
          className="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700 shadow-md text-center select-none cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <div className="flex items-center gap-1 justify-center">
            <span className="text-[10px]">{employee.avatar}</span>
            <span className="font-extrabold text-[10px] text-slate-100">{employee.name}</span>
            <span className={`text-[8px] font-black px-1 py-0.2 rounded border ${stateColor}`}>
              {stateBadge}
            </span>
          </div>

          {/* Mini Stamina Bar */}
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                staminaPct > 60 ? 'bg-emerald-400' : staminaPct > 25 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${staminaPct}%` }}
            />
          </div>
        </div>
      </Html>

      {/* Chef Hat */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.28, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.46, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.05, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.28, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Eyes */}
      {[-0.07, 0.07].map((ex, i) => (
        <mesh key={i} position={[ex, 1.3, 0.17]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}

      {/* Body / Torso (Archetype color tunic) */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[0.42, 0.55, 0.28]} />
        <meshStandardMaterial color={employee.color} roughness={0.7} />
      </mesh>

      {/* White Apron Overlay */}
      <mesh position={[0, 0.78, 0.15]} castShadow>
        <boxGeometry args={[0.32, 0.48, 0.02]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Arms */}
      {[-0.26, 0.26].map((ax, i) => (
        <mesh key={i} position={[ax, 0.8, isWorking ? 0.1 : 0]} rotation={[isWorking ? 0.6 : 0, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.45, 0.1]} />
          <meshStandardMaterial color={employee.color} roughness={0.7} />
        </mesh>
      ))}

      {/* Legs */}
      {[-0.11, 0.11].map((lx, i) => (
        <mesh key={i} position={[lx, 0.27, 0]} castShadow>
          <boxGeometry args={[0.14, 0.54, 0.16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};
