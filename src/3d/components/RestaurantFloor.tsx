import React from 'react';
import { ROOM_CONFIG, QUEUE_SLOTS } from '../config/restaurantLayout';

export const RestaurantFloor: React.FC = () => {
  const { width, depth, kitchenDividerZ } = ROOM_CONFIG;

  const kitchenDepth = Math.abs(-depth / 2 - kitchenDividerZ);
  const diningDepth = depth - kitchenDepth;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Kitchen Zone Floor (Industrial hygiene tile slate-850) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, (-depth / 2 + kitchenDividerZ) / 2]}
        receiveShadow
      >
        <planeGeometry args={[width, kitchenDepth]} />
        <meshStandardMaterial 
          color="#0f172a" 
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      {/* Kitchen Floor Drainage Grates */}
      {[-4, 0, 4].map((dx, i) => (
        <mesh 
          key={i}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[dx, 0.003, -4.5]}
        >
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}

      {/* 2. Dining Zone Floor (Warm honey walnut parquet planks) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, (kitchenDividerZ + depth / 2) / 2]}
        receiveShadow
      >
        <planeGeometry args={[width, diningDepth]} />
        <meshStandardMaterial 
          color="#292524" // warm stone-800 wood
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>

      {/* 3. Kitchen Divider Inlay Border Strip (Polished brass threshold) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.005, kitchenDividerZ]}
      >
        <planeGeometry args={[width, 0.16]} />
        <meshStandardMaterial 
          color="#f59e0b" // amber-500 brass
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* 4. Service Counter Foyer Border (Polished marble boundary) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[5.2, 0.004, 0.1]}
      >
        <planeGeometry args={[5.2, 1.8]} />
        <meshStandardMaterial 
          color="#1e293b" 
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* 5. Customer Queue Floor Markers */}
      {QUEUE_SLOTS.map((slot) => (
        <mesh 
          key={slot.id}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[slot.position[0], 0.006, slot.position[2]]}
        >
          <ringGeometry args={[0.22, 0.28, 16]} />
          <meshStandardMaterial 
            color="#38bdf8" 
            roughness={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* 6. Grand Entrance Foyer & Welcome Mat */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.006, depth / 2 - 0.9]}
      >
        <planeGeometry args={[4.2, 1.6]} />
        <meshStandardMaterial 
          color="#0f766e" // rich teal welcome mat
          roughness={0.9}
        />
      </mesh>
      {/* Brass Welcome Border */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.007, depth / 2 - 0.9]}
      >
        <ringGeometry args={[1.7, 1.8, 4]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          metalness={0.7} 
          roughness={0.2} 
        />
      </mesh>
    </group>
  );
};
