import React from 'react';
import type { Station3DState } from '../../types/sceneTypes';
import { StationLabel3D } from '../ui/StationLabel3D';
import { FryerCookingEffect3D } from '../effects/FryerCookingEffect3D';
import { FryerBasketProp3D } from '../props/FoodProps3D';

interface Fryer3DProps {
  station: Station3DState;
  onSelect?: () => void;
}

export const Fryer3D: React.FC<Fryer3DProps> = ({ station, onSelect }) => {
  const [x, y, z] = station.position;
  const isCooking = station.activeJob?.status === 'COOKING';
  const isWorn = station.equipmentCondition < 50;
  const bodyColor = isWorn ? '#64748b' : '#94a3b8';

  return (
    <group 
      position={[x, y, z]} 
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Floating Billboard Label */}
      <StationLabel3D station={station} onClick={onSelect} />

      {/* Main Stainless Fryer Body Cabinet */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.9, 1.1]} />
        <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Back Splash Guard */}
      <mesh position={[0, 1.05, -0.48]} castShadow>
        <boxGeometry args={[1.36, 0.35, 0.08]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Control Dial Knobs & Status Indicator */}
      {[-0.35, 0.35].map((kx, i) => (
        <mesh key={i} position={[kx, 0.8, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04]} />
          <meshStandardMaterial color={isCooking ? '#ef4444' : '#1e293b'} roughness={0.3} />
        </mesh>
      ))}

      {/* LED Indicator Lamp */}
      <mesh position={[0, 0.82, 0.56]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial 
          color={isCooking ? '#10b981' : '#f59e0b'} 
          emissive={isCooking ? '#059669' : '#b45309'}
          emissiveIntensity={0.8} 
        />
      </mesh>

      {/* Oil Vats (Twin Wells) */}
      {[-0.32, 0.32].map((ox, i) => (
        <group key={i} position={[ox, 0.88, 0]}>
          {/* Vat Rim */}
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.08, 0.7]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.8} />
          </mesh>

          {/* Golden Oil Liquid Surface */}
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.48, 0.02, 0.62]} />
            <meshStandardMaterial 
              color={isCooking ? '#f59e0b' : '#d97706'} 
              roughness={0.15} 
              metalness={0.4}
              emissive={isCooking ? '#b45309' : '#000000'}
              emissiveIntensity={isCooking ? 0.35 : 0}
            />
          </mesh>

          {/* Wire Fry Basket (Lowered into oil if cooking, raised if idle) */}
          <FryerBasketProp3D isLowered={isCooking} />

          {/* Cooking Sizzle / Steam Bubbles Effect */}
          {isCooking && <FryerCookingEffect3D isCooking={isCooking} position={[0, 0.05, 0]} />}
        </group>
      ))}
    </group>
  );
};
