import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Group, Mesh } from 'three';
import type { Customer3DState, Vector3Tuple } from '../../types/sceneTypes';
import { CharacterMovementController } from '../../navigation/movementSystem';
import { MOVEMENT_CONFIG } from '../../navigation/navigationTypes';

interface Customer3DProps {
  customer: Customer3DState;
  onSelect?: () => void;
  otherPositions?: Vector3Tuple[];
  onMovementUpdate?: (id: string, waypoints: Vector3Tuple[]) => void;
}

const MOOD_EMOJIS: Record<string, string> = {
  DELIGHTED: '😍',
  HAPPY: '😊',
  NEUTRAL: '😐',
  IMPATIENT: '😟',
  ANGRY: '😡',
};

const ARCHETYPE_BODY_COLORS: Record<string, string> = {
  student: '#0284c7',   // sky
  gamer: '#7c3aed',     // purple
  office: '#334155',    // slate
  influencer: '#ec4899',// pink
  foodie: '#eab308',    // yellow
  vip: '#e11d48',       // red
  grandma: '#059669',   // green
};

export const Customer3D: React.FC<Customer3DProps> = ({ 
  customer, 
  onSelect,
  otherPositions = [],
  onMovementUpdate,
}) => {
  const groupRef = useRef<Group>(null);
  const leftArmRef = useRef<Mesh>(null);
  const rightArmRef = useRef<Mesh>(null);
  const leftLegRef = useRef<Mesh>(null);
  const rightLegRef = useRef<Mesh>(null);

  // Persistent Movement Controller instance
  const controllerRef = useRef<CharacterMovementController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = new CharacterMovementController(
      customer.currentPosition,
      0,
      MOVEMENT_CONFIG.CUSTOMER_WALK_SPEED
    );
  }

  // React to target position changes from Game State Bridge
  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setDestination(customer.targetPosition);
      onMovementUpdate?.(customer.id, controllerRef.current.waypoints);
    }
  }, [customer.targetPosition[0], customer.targetPosition[1], customer.targetPosition[2]]);

  // Smooth frame-by-frame movement along waypoint path & walk cycle
  useFrame((state, delta) => {
    if (!controllerRef.current || !groupRef.current) return;

    const clampedDelta = Math.min(delta, 0.1);
    const movement = controllerRef.current.update(clampedDelta, otherPositions);

    const time = state.clock.elapsedTime;

    // Bobbing offset
    const bobY = movement.isWalking 
      ? Math.sin(time * 10) * 0.03 
      : Math.sin(time * 2.0) * 0.01;

    groupRef.current.position.set(
      movement.position[0],
      movement.position[1] + bobY,
      movement.position[2]
    );

    groupRef.current.rotation.y = movement.rotation;

    // Limb animation
    if (movement.isWalking) {
      const armSwing = Math.sin(time * 10) * 0.3;
      const legSwing = Math.sin(time * 10) * 0.4;

      if (leftArmRef.current) leftArmRef.current.rotation.x = armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -armSwing;
      if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;
    } else {
      // Idle state
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }
  });

  const moodEmoji = MOOD_EMOJIS[customer.mood] || '😊';
  const bodyColor = ARCHETYPE_BODY_COLORS[customer.archetype] || '#0284c7';

  return (
    <group 
      ref={groupRef} 
      position={customer.currentPosition}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Floating Order Bubble & Patience Bar */}
      <Html position={[0, 2.1, 0]} center distanceFactor={14} zIndexRange={[100, 0]}>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
          className="px-2 py-1 rounded-xl bg-slate-900/90 border border-slate-700 shadow-lg text-center select-none cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          {/* Order Tag */}
          <div className="flex items-center gap-1.5 justify-center">
            <span className="text-xs">{moodEmoji}</span>
            <span className="font-black text-[10px] text-amber-300">
              {customer.orderedFoodName || 'Đang gọi món'}
            </span>
            {customer.orderPrice && (
              <span className="text-[9px] font-bold text-emerald-400">
                ${customer.orderPrice}
              </span>
            )}
          </div>

          {/* Patience Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                customer.patiencePercent > 50
                  ? 'bg-emerald-400'
                  : customer.patiencePercent > 20
                  ? 'bg-amber-400'
                  : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${customer.patiencePercent}%` }}
            />
          </div>
        </div>
      </Html>

      {/* Head */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.6} />
      </mesh>

      {/* Hair / Cap */}
      <mesh position={[0, 1.38, -0.04]} castShadow>
        <sphereGeometry args={[0.21, 16, 16]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>

      {/* Eyes */}
      {[-0.07, 0.07].map((ex, i) => (
        <mesh key={i} position={[ex, 1.27, 0.17]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}

      {/* Torso / Shirt */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.4, 0.52, 0.26]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.24, 0.78, 0]} castShadow>
        <boxGeometry args={[0.09, 0.42, 0.09]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.24, 0.78, 0]} castShadow>
        <boxGeometry args={[0.09, 0.42, 0.09]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </mesh>

      {/* Legs / Pants */}
      <mesh ref={leftLegRef} position={[-0.1, 0.27, 0]} castShadow>
        <boxGeometry args={[0.13, 0.54, 0.15]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.1, 0.27, 0]} castShadow>
        <boxGeometry args={[0.13, 0.54, 0.15]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
    </group>
  );
};
