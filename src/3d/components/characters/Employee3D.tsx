import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Group, Mesh } from 'three';
import type { Employee3DState, Station3DState, Vector3Tuple } from '../../types/sceneTypes';
import { CharacterMovementController } from '../../navigation/movementSystem';
import { MOVEMENT_CONFIG } from '../../navigation/navigationTypes';
import { resolveEmployeePresentationState } from '../../presentation/presentationStateResolver';
import { FriesBoxProp3D, FoodTrayProp3D } from '../props/FoodProps3D';

interface Employee3DProps {
  employee: Employee3DState;
  activeJob?: Station3DState['activeJob'];
  onSelect?: () => void;
  otherPositions?: Vector3Tuple[];
  onMovementUpdate?: (id: string, waypoints: Vector3Tuple[]) => void;
}

export const Employee3D: React.FC<Employee3DProps> = ({ 
  employee, 
  activeJob,
  onSelect,
  otherPositions = [],
  onMovementUpdate,
}) => {
  const groupRef = useRef<Group>(null);
  const leftArmRef = useRef<Mesh>(null);
  const rightArmRef = useRef<Mesh>(null);
  const leftLegRef = useRef<Mesh>(null);
  const rightLegRef = useRef<Mesh>(null);
  const bodyRef = useRef<Mesh>(null);

  // Persistent Movement Controller instance
  const controllerRef = useRef<CharacterMovementController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = new CharacterMovementController(
      employee.currentPosition,
      0,
      MOVEMENT_CONFIG.EMPLOYEE_WALK_SPEED
    );
  }

  // React to target position changes from Game State Bridge
  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setDestination(employee.targetPosition);
      onMovementUpdate?.(employee.id, controllerRef.current.waypoints);
    }
  }, [employee.targetPosition[0], employee.targetPosition[1], employee.targetPosition[2]]);

  // Presentation action state
  const presentationRef = useRef(resolveEmployeePresentationState({
    employee,
    activeJob,
    movementStatus: controllerRef.current.status,
    isNearDestination: false,
  }));

  // Smooth frame-by-frame movement along waypoint path & action animations
  useFrame((state, delta) => {
    if (!controllerRef.current || !groupRef.current) return;

    const clampedDelta = Math.min(delta, 0.1);
    const movement = controllerRef.current.update(clampedDelta, otherPositions);

    const time = state.clock.elapsedTime;

    // Check distance to final target position
    const dx = employee.targetPosition[0] - movement.position[0];
    const dz = employee.targetPosition[2] - movement.position[2];
    const distToTarget = Math.sqrt(dx * dx + dz * dz);
    const isNearDestination = distToTarget <= MOVEMENT_CONFIG.ARRIVAL_THRESHOLD;

    // Resolve current presentation action
    const presentation = resolveEmployeePresentationState({
      employee,
      activeJob,
      movementStatus: movement.status,
      isNearDestination,
    });
    presentationRef.current = presentation;

    const action = presentation.action;

    // Vertical bobbing
    const isWalking = action === 'WALKING' || (action === 'CARRYING' && movement.isWalking);
    const bobY = isWalking 
      ? Math.sin(time * 12) * 0.035 
      : Math.sin(time * 2.5) * 0.012;

    groupRef.current.position.set(
      movement.position[0],
      movement.position[1] + bobY,
      movement.position[2]
    );

    groupRef.current.rotation.y = movement.rotation;

    // Procedural Action Animation Transitions
    if (action === 'WALKING') {
      const armSwing = Math.sin(time * 12) * 0.35;
      const legSwing = Math.sin(time * 12) * 0.45;

      if (leftArmRef.current) leftArmRef.current.rotation.x = armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -armSwing;
      if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;
      if (bodyRef.current) bodyRef.current.rotation.x = 0;
    } else if (action === 'CARRYING') {
      // Carrying food tray with arms held forward
      const legSwing = movement.isWalking ? Math.sin(time * 12) * 0.4 : 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.55;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.55;
      if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;
      if (bodyRef.current) bodyRef.current.rotation.x = 0;
    } else if (action === 'PREPPING') {
      // Rapid chopping rhythm with knife in right hand
      const chop = Math.sin(time * 16) * 0.35;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0.5 + chop;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.4;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (bodyRef.current) bodyRef.current.rotation.x = 0.12; // Slight forward lean
    } else if (action === 'COOKING') {
      // Attending fryer basket
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0.55;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.15;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (bodyRef.current) bodyRef.current.rotation.x = 0.08;
    } else if (action === 'PACKING') {
      // Seasoning and packing rhythm
      const packShake = Math.sin(time * 12) * 0.25;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0.45 + packShake;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.35 - packShake;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (bodyRef.current) bodyRef.current.rotation.x = 0.05;
    } else if (action === 'SERVING') {
      // Extending arms forward to hand off food platter
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.6;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.6;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (bodyRef.current) bodyRef.current.rotation.x = 0.05;
    } else if (action === 'CLEANING') {
      // Wiping motion with cloth/sponge
      const wipeX = Math.sin(time * 10) * 0.35;
      const wipeZ = Math.cos(time * 10) * 0.25;
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0.6 + wipeZ;
        rightArmRef.current.rotation.z = -0.2 + wipeX;
      }
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0.2;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (bodyRef.current) bodyRef.current.rotation.x = 0.15; // Leaning over table
    } else {
      // IDLE breathing
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (bodyRef.current) bodyRef.current.rotation.x = 0;
    }
  });

  const presentation = presentationRef.current;
  const action = presentation.action;

  // Floating Action Tag
  let actionBadge = '🟢 Sẵn sàng';
  let badgeStyle = 'bg-slate-700/40 text-slate-300 border-slate-600/40';

  if (action === 'PREPPING') {
    actionBadge = `🔪 Sơ chế (${Math.round(presentation.progress)}%)`;
    badgeStyle = 'bg-sky-500/30 text-sky-300 border-sky-500/50';
  } else if (action === 'COOKING') {
    actionBadge = `🔥 Chiên (${Math.round(presentation.progress)}%)`;
    badgeStyle = 'bg-amber-500/30 text-amber-300 border-amber-500/50';
  } else if (action === 'PACKING') {
    actionBadge = `📦 Đóng gói (${Math.round(presentation.progress)}%)`;
    badgeStyle = 'bg-orange-500/30 text-orange-300 border-orange-500/50';
  } else if (action === 'CARRYING') {
    actionBadge = '🍟 Bưng món';
    badgeStyle = 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50';
  } else if (action === 'SERVING') {
    actionBadge = '🎁 Giao khách';
    badgeStyle = 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50';
  } else if (action === 'CLEANING') {
    actionBadge = '🧽 Dọn dẹp bàn';
    badgeStyle = 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50';
  } else if (action === 'WALKING') {
    actionBadge = '🚶 Di chuyển';
    badgeStyle = 'bg-slate-700/40 text-slate-300 border-slate-600/40';
  }

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
            <span className={`text-[8px] font-black px-1 py-0.2 rounded border ${badgeStyle}`}>
              {actionBadge}
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
      <mesh ref={bodyRef} position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[0.42, 0.55, 0.28]} />
        <meshStandardMaterial color={employee.color} roughness={0.7} />
      </mesh>

      {/* White Apron Overlay */}
      <mesh position={[0, 0.78, 0.15]} castShadow>
        <boxGeometry args={[0.32, 0.48, 0.02]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.26, 0.8, 0]} castShadow>
        <boxGeometry args={[0.1, 0.45, 0.1]} />
        <meshStandardMaterial color={employee.color} roughness={0.7} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.26, 0.8, 0]} castShadow>
        <boxGeometry args={[0.1, 0.45, 0.1]} />
        <meshStandardMaterial color={employee.color} roughness={0.7} />
      </mesh>

      {/* Food Prop in Hands when CARRYING or SERVING */}
      {(action === 'CARRYING' || action === 'SERVING') && (
        <group position={[0, 0.72, 0.32]}>
          <FoodTrayProp3D scale={0.65} />
        </group>
      )}

      {/* Knife Prop in Hand when PREPPING */}
      {action === 'PREPPING' && (
        <mesh position={[0.28, 0.62, 0.22]} rotation={[0.5, 0, 0]} castShadow>
          <boxGeometry args={[0.04, 0.25, 0.02]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      )}

      {/* Cleaning Cloth / Sponge Prop in Hand when CLEANING */}
      {action === 'CLEANING' && (
        <mesh position={[0.26, 0.55, 0.25]} rotation={[0.2, 0.3, 0]} castShadow>
          <boxGeometry args={[0.12, 0.04, 0.16]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.9} />
        </mesh>
      )}

      {/* Legs */}
      <mesh ref={leftLegRef} position={[-0.11, 0.27, 0]} castShadow>
        <boxGeometry args={[0.14, 0.54, 0.16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.11, 0.27, 0]} castShadow>
        <boxGeometry args={[0.14, 0.54, 0.16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
    </group>
  );
};
