import React from 'react';
import { ROOM_CONFIG } from '../config/restaurantLayout';

export const RestaurantFloor: React.FC = () => {
  const { width, depth, kitchenDividerZ } = ROOM_CONFIG;

  const kitchenDepth = Math.abs(-depth / 2 - kitchenDividerZ);
  const diningDepth = depth - kitchenDepth;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Kitchen Floor (Industrial tile slate/cyan tone) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, (-depth / 2 + kitchenDividerZ) / 2]}
        receiveShadow
      >
        <planeGeometry args={[width, kitchenDepth]} />
        <meshStandardMaterial 
          color="#1e293b" // slate-800
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 2. Customer / Dining Floor (Warm wood tone) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, (kitchenDividerZ + depth / 2) / 2]}
        receiveShadow
      >
        <planeGeometry args={[width, diningDepth]} />
        <meshStandardMaterial 
          color="#334155" // slate-700 warmer
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* 3. Kitchen Divider Line Strip (Bronze/Amber threshold) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.005, kitchenDividerZ]}
      >
        <planeGeometry args={[width, 0.12]} />
        <meshStandardMaterial 
          color="#f59e0b" // amber-500
          roughness={0.4}
        />
      </mesh>

      {/* 4. Entrance Mat (Welcoming Gold/Teal strip) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.006, depth / 2 - 0.7]}
      >
        <planeGeometry args={[3.2, 1.2]} />
        <meshStandardMaterial 
          color="#0f766e" // teal-700
          roughness={0.9}
        />
      </mesh>
    </group>
  );
};
