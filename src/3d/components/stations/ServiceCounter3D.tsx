import React from 'react';
import { RESTAURANT_LAYOUT } from '../../config/restaurantLayout';
import type { ReadyItem3DState } from '../../types/sceneTypes';

interface ServiceCounter3DProps {
  readyItems: ReadyItem3DState[];
  onSelect?: () => void;
}

export const ServiceCounter3D: React.FC<ServiceCounter3DProps> = ({ 
  readyItems, 
  onSelect 
}) => {
  const [x, y, z] = RESTAURANT_LAYOUT.serviceCounter.position;

  return (
    <group 
      position={[x, y, z]} 
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Front Customer-facing Counter Body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 1.0, 0.9]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* Countertop Surface (Warm Maple / Solid Oak) */}
      <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.08, 1.1]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* POS Cash Register Terminal */}
      <group position={[1.2, 1.15, 0]}>
        {/* Register Base */}
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.12, 0.35]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Display Screen */}
        <mesh position={[0, 0.18, 0.05]} rotation={[-0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.32, 0.22, 0.04]} />
          <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Serving Tray Area / Order Hatch */}
      <mesh position={[-0.4, 1.07, 0]} castShadow>
        <boxGeometry args={[0.7, 0.03, 0.5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Service Counter Bell */}
      <mesh position={[0.2, 1.1, 0.1]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.08]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Ready Food Buffet Platter Items */}
      {readyItems.map((item, idx) => {
        const itemX = -1.6 + (idx % 3) * 0.45;
        const itemZ = (Math.floor(idx / 3) * 0.25) - 0.1;
        return (
          <group key={item.id} position={[itemX, 1.1, itemZ]}>
            {/* Food Box / Carton */}
            <mesh castShadow>
              <boxGeometry args={[0.26, 0.18, 0.2]} />
              <meshStandardMaterial color="#ef4444" roughness={0.8} />
            </mesh>
            {/* Golden Fries sticking out */}
            <mesh position={[0, 0.12, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial color="#eab308" roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
