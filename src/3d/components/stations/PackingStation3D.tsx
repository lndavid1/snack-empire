import React from 'react';
import type { Station3DState } from '../../types/sceneTypes';
import { StationLabel3D } from '../ui/StationLabel3D';

interface PackingStation3DProps {
  station: Station3DState;
  onSelect?: () => void;
}

export const PackingStation3D: React.FC<PackingStation3DProps> = ({ station, onSelect }) => {
  const [x, y, z] = station.position;
  const isPacking = station.activeJob?.status === 'PACKING';
  const isWorn = station.equipmentCondition < 50;

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

      {/* Main Table Top */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.1, 1.1]} />
        <meshStandardMaterial 
          color={isWorn ? '#94a3b8' : '#cbd5e1'} 
          roughness={0.3} 
          metalness={0.7} 
        />
      </mesh>

      {/* Legs */}
      {[[-0.8, -0.45], [0.8, -0.45], [-0.8, 0.45], [0.8, 0.45]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.4, lz]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.8} />
        </mesh>
      ))}

      {/* Overhead Heat Lamp Warming Arch */}
      <group position={[0, 1.35, 0]}>
        {/* Supporting Rods */}
        {[-0.7, 0.7].map((rx, i) => (
          <mesh key={i} position={[rx, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.9]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        ))}
        {/* Overhead Warmer Bar */}
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.08, 0.3]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        {/* Heat Glow Bulb */}
        <pointLight color="#f97316" intensity={isPacking ? 1.4 : 0.6} distance={2.5} />
      </group>

      {/* Stack of Red Snack / Fries Boxes */}
      <group position={[-0.45, 0.98, -0.2]}>
        {[0, 0.08, 0.16].map((by, i) => (
          <mesh key={i} position={[0, by, 0]} castShadow>
            <boxGeometry args={[0.32, 0.07, 0.28]} />
            <meshStandardMaterial color="#ef4444" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Brown Craft Paper Takeaway Bags */}
      <group position={[0.4, 1.05, -0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.2]} />
          <meshStandardMaterial color="#b45309" roughness={0.9} />
        </mesh>
      </group>

      {/* Active Packaged Tray when packing */}
      {isPacking && (
        <group position={[0, 0.95, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.45, 0.03, 0.35]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
          </mesh>
          {/* Box of fresh fries on tray */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <boxGeometry args={[0.25, 0.18, 0.18]} />
            <meshStandardMaterial color="#ef4444" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};
