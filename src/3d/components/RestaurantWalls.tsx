import React from 'react';
import { ROOM_CONFIG } from '../config/restaurantLayout';

export const RestaurantWalls: React.FC = () => {
  const { width, depth, wallHeight, kitchenDividerZ } = ROOM_CONFIG;
  const wallThickness = 0.25;
  const halfW = width / 2;
  const halfD = depth / 2;
  const halfH = wallHeight / 2;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Back Kitchen Wall (North) */}
      <mesh position={[0, halfH, -halfD]} castShadow receiveShadow>
        <boxGeometry args={[width, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#0b1329" roughness={0.7} />
      </mesh>

      {/* Stainless Ventilation Canopy / Kitchen Exhaust Hood */}
      <mesh position={[-0.6, 2.15, -halfD + 0.5]} castShadow>
        <boxGeometry args={[11, 0.45, 1.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Exhaust Duct Pipes */}
      {[-3.5, 0, 3.5].map((dx, i) => (
        <mesh key={i} position={[dx, 2.45, -halfD + 0.5]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.5]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* Wall Clock on North Wall */}
      <group position={[3.5, 1.8, -halfD + 0.15]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]}>
          <ringGeometry args={[0.28, 0.3, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
      </group>

      {/* 2. Left Wall (West - Staff & Storage Boundary) */}
      <mesh position={[-halfW, halfH, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Staff Only Door Outline on West Wall */}
      <group position={[-halfW + 0.14, 1.1, -2.0]}>
        {/* Door Frame */}
        <mesh>
          <boxGeometry args={[0.04, 2.0, 1.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Door Sign "STAFF ONLY" */}
        <mesh position={[0.03, 0.4, 0]}>
          <boxGeometry args={[0.02, 0.2, 0.6]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* 3. Right Wall (East - Dining View Windows & Neon Logo) */}
      <mesh position={[halfW, halfH, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, depth]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Large Glass Window Insets overlooking street */}
      {[-1.5, 3.5].map((wz, i) => (
        <group key={i} position={[halfW - 0.12, 1.3, wz]}>
          <mesh>
            <boxGeometry args={[0.06, 1.4, 2.8]} />
            <meshStandardMaterial 
              color="#38bdf8" 
              roughness={0.1} 
              transparent 
              opacity={0.35} 
            />
          </mesh>
          {/* Window Sill & Frame */}
          <mesh position={[0, -0.72, 0]}>
            <boxGeometry args={[0.2, 0.08, 3.0]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Glowing Restaurant Neon Snack Logo Sign on East Wall */}
      <group position={[halfW - 0.15, 2.0, 1.0]}>
        <mesh>
          <boxGeometry args={[0.04, 0.5, 1.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
        {/* Neon Glowing Bar */}
        <mesh position={[-0.03, 0, 0]}>
          <boxGeometry args={[0.02, 0.35, 1.6]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#f59e0b" 
            emissiveIntensity={0.8} 
          />
        </mesh>
      </group>

      {/* 4. Front Low Walls (South - Entrance Opening in Center) */}
      {/* Front Left Wall (X from -halfW to -1.8) */}
      <mesh position={[-halfW / 2 - 1.0, 0.4, halfD]} castShadow receiveShadow>
        <boxGeometry args={[halfW - 2.0, 0.8, wallThickness]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Front Right Wall (X from 1.8 to halfW) */}
      <mesh position={[halfW / 2 + 1.0, 0.4, halfD]} castShadow receiveShadow>
        <boxGeometry args={[halfW - 2.0, 0.8, wallThickness]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Entrance Glass Door Pillars */}
      {[-1.8, 1.8].map((px, i) => (
        <mesh key={i} position={[px, 1.1, halfD]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 2.2]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
      ))}

      {/* 5. Kitchen Half-Wall Partition with Pass-Through Counter */}
      <group position={[-2.2, 0.55, kitchenDividerZ]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[7.2, 1.1, 0.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Wooden Ledge Cap */}
        <mesh position={[0, 0.58, 0]} castShadow>
          <boxGeometry args={[7.4, 0.08, 0.35]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      </group>

      {/* Overhead Menu Board suspended above Service Counter */}
      <group position={[5.2, 2.0, kitchenDividerZ]}>
        {/* Support Rods from ceiling */}
        {[-1.8, 1.8].map((rx, i) => (
          <mesh key={i} position={[rx, 0.35, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        ))}
        {/* Menu Board Backing */}
        <mesh castShadow>
          <boxGeometry args={[4.4, 0.7, 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} />
        </mesh>
        {/* Glowing Screen Menu Panels (French Fries, Drinks, Burger) */}
        {[-1.3, 0, 1.3].map((mx, i) => (
          <mesh key={i} position={[mx, 0, 0.05]}>
            <boxGeometry args={[1.1, 0.55, 0.02]} />
            <meshStandardMaterial 
              color={i === 0 ? '#ea580c' : i === 1 ? '#0284c7' : '#16a34a'} 
              emissive={i === 0 ? '#c2410c' : i === 1 ? '#0369a1' : '#15803d'} 
              emissiveIntensity={0.5} 
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
