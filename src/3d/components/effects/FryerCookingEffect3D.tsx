import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface FryerCookingEffect3DProps {
  isCooking: boolean;
  position?: [number, number, number];
}

export const FryerCookingEffect3D: React.FC<FryerCookingEffect3DProps> = ({ 
  isCooking,
  position = [0, 0, 0] 
}) => {
  const steamGroupRef = useRef<Group>(null);
  const bubbleGroupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!isCooking) return;
    const time = state.clock.getElapsedTime();

    // Rising steam animation
    if (steamGroupRef.current) {
      steamGroupRef.current.position.y = 0.2 + (time % 1.2) * 0.45;
      steamGroupRef.current.scale.setScalar(0.8 + (time % 1.2) * 0.5);
    }

    // Oil bubbling animation
    if (bubbleGroupRef.current) {
      bubbleGroupRef.current.position.y = Math.sin(time * 16) * 0.015;
    }
  });

  if (!isCooking) return null;

  return (
    <group position={position}>
      {/* 1. Hot Sizzling Cooking Pointlight */}
      <pointLight color="#f59e0b" intensity={1.2} distance={2.5} />

      {/* 2. Sizzling Bubbles on Oil Surface */}
      <group ref={bubbleGroupRef} position={[0, 0.02, 0]}>
        {[
          [-0.12, 0, -0.1],
          [0.12, 0, 0.1],
          [-0.08, 0, 0.12],
          [0.08, 0, -0.12],
          [0, 0, 0],
        ].map(([bx, by, bz], i) => (
          <mesh key={i} position={[bx, by, bz]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial 
              color="#fef08a" 
              emissive="#f59e0b" 
              emissiveIntensity={0.8} 
            />
          </mesh>
        ))}
      </group>

      {/* 3. Rising Hot Steam Puffs */}
      <group ref={steamGroupRef}>
        {[-0.14, 0.14, 0].map((sx, i) => (
          <mesh key={i} position={[sx, i * 0.06, (i - 1) * 0.08]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial 
              color="#fef08a" 
              transparent 
              opacity={0.35} 
              roughness={1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
