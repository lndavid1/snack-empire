import React from 'react';
import { DINING_TABLES_LAYOUT } from '../../config/restaurantLayout';
import type { DiningTableLayout, DiningSeatLayout, Customer3DState } from '../../types/sceneTypes';
import { FoodTrayProp3D } from '../props/FoodProps3D';

interface DiningArea3DProps {
  customers?: Customer3DState[];
  onSelectTable?: (table: DiningTableLayout) => void;
  onSelectSeat?: (seat: DiningSeatLayout) => void;
}

export const DiningArea3D: React.FC<DiningArea3DProps> = ({
  customers = [],
  onSelectTable,
  onSelectSeat,
}) => {
  return (
    <group>
      {DINING_TABLES_LAYOUT.map(table => {
        const [tx, ty, tz] = table.position;
        const hasEatingCustomer = customers.some(c => 
          c.state === 'eating' && (
            Math.hypot(c.currentPosition[0] - tx, c.currentPosition[2] - tz) < 1.8 ||
            Math.hypot(c.targetPosition[0] - tx, c.targetPosition[2] - tz) < 1.8
          )
        );

        return (
          <group 
            key={table.id} 
            position={[tx, ty, tz]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectTable?.(table);
            }}
          >
            {/* Table Top (Warm solid walnut slab with beveled edges) */}
            <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.08, 1.2]} />
              <meshStandardMaterial color="#44403c" roughness={0.4} metalness={0.05} />
            </mesh>

            {/* Render Food Tray on table if customer is eating here */}
            {hasEatingCustomer && (
              <FoodTrayProp3D position={[0, 0.79, 0]} scale={1.0} />
            )}

            {/* Table Frame & 4 Matte Black Metal Legs */}
            {[[-0.65, -0.5], [0.65, -0.5], [-0.65, 0.5], [0.65, 0.5]].map(([lx, lz], i) => (
              <mesh key={i} position={[lx, 0.35, lz]} castShadow>
                <cylinderGeometry args={[0.035, 0.035, 0.7]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
              </mesh>
            ))}

            {/* Tabletop Center Condiment / Napkin Caddy */}
            {!hasEatingCustomer && (
              <group position={[0, 0.82, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.2, 0.1, 0.16]} />
                  <meshStandardMaterial color="#d97706" roughness={0.8} />
                </mesh>
                {/* Mini Salt & Pepper Shakers */}
                <mesh position={[-0.05, 0.08, 0]} castShadow>
                  <cylinderGeometry args={[0.025, 0.025, 0.07]} />
                  <meshStandardMaterial color="#f8fafc" roughness={0.2} />
                </mesh>
                <mesh position={[0.05, 0.08, 0]} castShadow>
                  <cylinderGeometry args={[0.025, 0.025, 0.07]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.2} />
                </mesh>
              </group>
            )}

            {/* 4 Chairs per Table */}
            {table.seats.map(seat => {
              // Local offset relative to table position
              const offsetX = seat.position[0] - tx;
              const offsetZ = seat.position[2] - tz;

              return (
                <group
                  key={seat.id}
                  position={[offsetX, 0, offsetZ]}
                  rotation={[0, seat.rotation, 0]}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSeat?.(seat);
                  }}
                >
                  {/* Chair Seat Cushion (Warm Mustard / Leather tone) */}
                  <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.42, 0.06, 0.42]} />
                    <meshStandardMaterial color="#f59e0b" roughness={0.6} />
                  </mesh>

                  {/* Chair Backrest */}
                  <mesh position={[0, 0.72, -0.19]} castShadow>
                    <boxGeometry args={[0.4, 0.38, 0.04]} />
                    <meshStandardMaterial color="#d97706" roughness={0.5} />
                  </mesh>

                  {/* Chair 4 Legs */}
                  {[[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].map(([clx, clz], ci) => (
                    <mesh key={ci} position={[clx, 0.22, clz]} castShadow>
                      <cylinderGeometry args={[0.02, 0.015, 0.44]} />
                      <meshStandardMaterial color="#0f172a" metalness={0.8} />
                    </mesh>
                  ))}
                </group>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};
