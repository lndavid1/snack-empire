import React from 'react';
import { ROOM_CONFIG } from '../config/restaurantLayout';

export const RestaurantWalls: React.FC = () => {
  const { width, depth, wallHeight } = ROOM_CONFIG;
  const wallThickness = 0.25;
  const halfW = width / 2;
  const halfD = depth / 2;
  const halfH = wallHeight / 2;

  return (
    <group position={[0, 0, 0]}>
      {/* Back Kitchen Wall (North) */}
      <mesh position={[0, halfH, -halfD]} castShadow receiveShadow>
        <boxGeometry args={[width, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Left Wall (West) */}
      <mesh position={[-halfW, halfH, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Right Wall (East) */}
      <mesh position={[halfW, halfH, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Front Low Wall Left of Entrance (South) */}
      <mesh position={[-halfW / 2 - 0.7, 0.4, halfD]} castShadow receiveShadow>
        <boxGeometry args={[halfW - 1.4, 0.8, wallThickness]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Front Low Wall Right of Entrance (South) */}
      <mesh position={[halfW / 2 + 0.7, 0.4, halfD]} castShadow receiveShadow>
        <boxGeometry args={[halfW - 1.4, 0.8, wallThickness]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Kitchen Half-Wall Partition behind counter */}
      <mesh position={[-2, 0.6, ROOM_CONFIG.kitchenDividerZ]} castShadow receiveShadow>
        <boxGeometry args={[7, 1.2, 0.15]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
    </group>
  );
};
