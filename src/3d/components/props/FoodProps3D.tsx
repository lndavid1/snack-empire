import React from 'react';

/**
 * 1. Raw Potato Prop (used in prep station and storage)
 */
export const PotatoProp3D: React.FC<{ position?: [number, number, number]; scale?: number }> = ({ 
  position = [0, 0, 0], 
  scale = 1 
}) => {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} metalness={0.05} />
      </mesh>
    </group>
  );
};

/**
 * 2. Iconic Red French Fries Box with Crispy Golden Fries
 */
export const FriesBoxProp3D: React.FC<{ 
  position?: [number, number, number]; 
  rotation?: [number, number, number];
  scale?: number;
}> = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = 1 
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Red Fries Box Carton */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.22, 0.22, 0.14]} />
        <meshStandardMaterial color="#ef4444" roughness={0.7} />
      </mesh>

      {/* Yellow Logo Accent Stripe */}
      <mesh position={[0, 0.02, 0.075]}>
        <boxGeometry args={[0.14, 0.05, 0.005]} />
        <meshStandardMaterial color="#facc15" roughness={0.5} />
      </mesh>

      {/* Hot Golden Crispy Fries Sticks protruding from the top */}
      <group position={[0, 0.12, 0]}>
        {[-0.06, -0.02, 0.02, 0.06].map((fx, i) => (
          <mesh 
            key={i} 
            position={[fx, (i % 2) * 0.03, ((i % 3) - 1) * 0.025]} 
            rotation={[(i % 2 === 0 ? 0.1 : -0.1), 0, (fx * 1.5)]}
            castShadow
          >
            <boxGeometry args={[0.025, 0.16, 0.025]} />
            <meshStandardMaterial color="#eab308" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/**
 * 3. Stainless Steel Wire Fry Basket with Fries Inside
 */
export const FryerBasketProp3D: React.FC<{ 
  position?: [number, number, number];
  isLowered?: boolean;
}> = ({ 
  position = [0, 0, 0],
  isLowered = false 
}) => {
  return (
    <group position={position}>
      {/* Wire Mesh Basket Frame */}
      <mesh position={[0, isLowered ? -0.05 : 0.08, 0]} castShadow>
        <boxGeometry args={[0.42, 0.18, 0.54]} />
        <meshStandardMaterial 
          color="#cbd5e1" 
          metalness={0.9} 
          roughness={0.2} 
        />
      </mesh>

      {/* Sizzling Potato Batons inside basket */}
      <mesh position={[0, isLowered ? -0.02 : 0.11, 0]} castShadow>
        <boxGeometry args={[0.38, 0.08, 0.48]} />
        <meshStandardMaterial 
          color="#facc15" 
          roughness={0.9} 
          emissive={isLowered ? '#ca8a04' : '#000000'}
          emissiveIntensity={isLowered ? 0.3 : 0}
        />
      </mesh>

      {/* Basket Long Handle */}
      <mesh position={[0, isLowered ? 0.05 : 0.18, 0.38]} rotation={[-0.25, 0, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.35]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} />
      </mesh>
    </group>
  );
};

/**
 * 4. Salt & Seasoning Shaker
 */
export const SaltShakerProp3D: React.FC<{ 
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({ 
  position = [0, 0, 0],
  rotation = [0, 0, 0] 
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Glass Body */}
      <mesh castShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.14, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} transparent opacity={0.8} />
      </mesh>
      {/* Chrome Metal Perforated Cap */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.032, 0.036, 0.03, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};

/**
 * 5. Complete Serving Food Platter / Tray
 */
export const FoodTrayProp3D: React.FC<{ 
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}> = ({ 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1 
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stainless Steel Tray Base */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.48, 0.02, 0.36]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Fries Box on the Tray */}
      <FriesBoxProp3D position={[-0.08, 0.11, 0]} scale={0.85} />

      {/* Mini Dipping Sauce Tub (Ketchup) */}
      <group position={[0.14, 0.03, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.045, 0.035, 0.04, 12]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};
