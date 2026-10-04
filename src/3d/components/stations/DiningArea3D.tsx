import React from 'react';
import { RESTAURANT_LAYOUT } from '../../config/restaurantLayout';

export const DiningArea3D: React.FC = () => {
  return (
    <group>
      {RESTAURANT_LAYOUT.customer.diningTables.map(table => {
        const [tx, ty, tz] = table.position;
        return (
          <group key={table.id} position={[tx, ty, tz]}>
            {/* Table Top */}
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.7, 0.7, 0.06, 16]} />
              <meshStandardMaterial color="#475569" roughness={0.6} />
            </mesh>

            {/* Table Central Pillar Leg */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.7]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>

            {/* Table Base Disc */}
            <mesh position={[0, 0.02, 0]} receiveShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.04, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>

            {/* Surrounding Stools */}
            {[-0.8, 0.8].map((sx, i) => (
              <group key={i} position={[sx, 0, 0]}>
                {/* Seat Cushion */}
                <mesh position={[0, 0.45, 0]} castShadow>
                  <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
                  <meshStandardMaterial color="#ea580c" roughness={0.7} />
                </mesh>
                {/* Leg */}
                <mesh position={[0, 0.22, 0]} castShadow>
                  <cylinderGeometry args={[0.03, 0.03, 0.44]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}
    </group>
  );
};
