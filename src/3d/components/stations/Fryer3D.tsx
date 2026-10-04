import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { Station3DState } from '../../types/sceneTypes';
import { StationLabel3D } from '../ui/StationLabel3D';

interface Fryer3DProps {
  station: Station3DState;
  onSelect?: () => void;
}

export const Fryer3D: React.FC<Fryer3DProps> = ({ station, onSelect }) => {
  const [x, y, z] = station.position;
  const isCooking = station.activeJob?.status === 'COOKING';
  const isWorn = station.equipmentCondition < 50;
  const steamRef = useRef<Group>(null);

  // Subtle bubbling / steam wobble when active cooking
  useFrame((state) => {
    if (steamRef.current && isCooking) {
      const t = state.clock.getElapsedTime();
      steamRef.current.position.y = 1.1 + Math.sin(t * 8) * 0.04;
      steamRef.current.scale.setScalar(1 + Math.sin(t * 6) * 0.1);
    }
  });

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

      {/* Control Dial Knobs */}
      {[-0.35, 0.35].map((kx, i) => (
        <mesh key={i} position={[kx, 0.8, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04]} />
          <meshStandardMaterial color={isCooking ? '#ef4444' : '#0f172a'} roughness={0.3} />
        </mesh>
      ))}

      {/* Oil Vats (Twin Wells) */}
      {[-0.32, 0.32].map((ox, i) => (
        <group key={i} position={[ox, 0.88, 0]}>
          {/* Vat Rim */}
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.08, 0.7]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Bubbling Golden Oil Surface */}
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.48, 0.02, 0.62]} />
            <meshStandardMaterial 
              color={isCooking ? '#f59e0b' : '#d97706'} 
              roughness={0.2} 
              metalness={0.4}
              emissive={isCooking ? '#b45309' : '#000000'}
              emissiveIntensity={isCooking ? 0.3 : 0}
            />
          </mesh>
          {/* Wire Fry Basket */}
          <mesh position={[0, isCooking ? 0.02 : 0.12, 0]} castShadow>
            <boxGeometry args={[0.4, 0.16, 0.52]} />
            <meshStandardMaterial 
              color="#e2e8f0" 
              roughness={0.3} 
              metalness={0.9} 
              wireframe={false} 
            />
          </mesh>
          {/* Basket Handle */}
          <mesh position={[0, isCooking ? 0.12 : 0.22, 0.35]} rotation={[-0.3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.3]} />
            <meshStandardMaterial color="#dc2626" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Cooking Sizzle / Steam Bubbles Effect */}
      {isCooking && (
        <group ref={steamRef} position={[0, 1.1, 0]}>
          {/* Warm cooking pointlight */}
          <pointLight color="#f59e0b" intensity={0.9} distance={2.5} />
          {/* Mini steam puffs */}
          {[-0.2, 0.2, 0].map((sx, i) => (
            <mesh key={i} position={[sx, i * 0.08, (i - 1) * 0.1]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="#fef08a" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
