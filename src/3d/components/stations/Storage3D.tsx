import React from 'react';
import { RESTAURANT_LAYOUT } from '../../config/restaurantLayout';

export const Storage3D: React.FC = () => {
  const [x, y, z] = RESTAURANT_LAYOUT.storage.position;

  return (
    <group position={[x, y, z]}>
      {/* Industrial Storage Shelving Unit */}
      {/* 4 Upright Pillars */}
      {[[-0.7, -0.4], [0.7, -0.4], [-0.7, 0.4], [0.7, 0.4]].map(([px, pz], i) => (
        <mesh key={i} position={[px, 1.0, pz]} castShadow>
          <boxGeometry args={[0.06, 2.0, 0.06]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
      ))}

      {/* 3 Shelves */}
      {[0.2, 0.9, 1.6].map((sy, i) => (
        <mesh key={i} position={[0, sy, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.04, 0.85]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>
      ))}

      {/* Lower Shelf: Potato Sack & Heavy Crate */}
      <mesh position={[-0.35, 0.45, 0]} castShadow>
        <boxGeometry args={[0.55, 0.4, 0.55]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      <mesh position={[0.35, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} />
      </mesh>

      {/* Middle Shelf: Supply Boxes */}
      <mesh position={[-0.3, 1.15, 0]} castShadow>
        <boxGeometry args={[0.45, 0.4, 0.45]} />
        <meshStandardMaterial color="#d97706" roughness={0.8} />
      </mesh>
      <mesh position={[0.3, 1.15, 0]} castShadow>
        <boxGeometry args={[0.45, 0.4, 0.45]} />
        <meshStandardMaterial color="#ca8a04" roughness={0.8} />
      </mesh>

      {/* Top Shelf: Jars / Oil Cans */}
      {[-0.4, -0.1, 0.2, 0.5].map((cx, i) => (
        <mesh key={i} position={[cx, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.3]} />
          <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};
