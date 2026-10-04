import React from 'react';
import type { Station3DState } from '../../types/sceneTypes';
import { StationLabel3D } from '../ui/StationLabel3D';

interface PrepTable3DProps {
  station: Station3DState;
  onSelect?: () => void;
}

export const PrepTable3D: React.FC<PrepTable3DProps> = ({ station, onSelect }) => {
  const [x, y, z] = station.position;
  const isWorn = station.equipmentCondition < 50;
  const tableColor = isWorn ? '#94a3b8' : '#cbd5e1';

  return (
    <group 
      position={[x, y, z]} 
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Floating Label */}
      <StationLabel3D station={station} onClick={onSelect} />

      {/* Countertop */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.1, 1.1]} />
        <meshStandardMaterial color={tableColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Table Legs */}
      {[[-0.8, -0.45], [0.8, -0.45], [-0.8, 0.45], [0.8, 0.45]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.4, lz]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.8} />
        </mesh>
      ))}

      {/* Lower Storage Shelf */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[1.6, 0.05, 0.9]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Wooden Cutting Board */}
      <mesh position={[-0.3, 0.92, 0]} castShadow>
        <boxGeometry args={[0.7, 0.04, 0.5]} />
        <meshStandardMaterial color="#d97706" roughness={0.8} />
      </mesh>

      {/* Kitchen Knife on board */}
      <mesh position={[-0.2, 0.95, 0.05]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.35, 0.02, 0.06]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Ingredient Tub (Potatoes Container) */}
      <mesh position={[0.45, 0.96, 0]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.4]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.4} />
      </mesh>
      {/* Potato inside tub */}
      <mesh position={[0.45, 1.02, 0]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} />
      </mesh>
    </group>
  );
};
