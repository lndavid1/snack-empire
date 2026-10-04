import React from 'react';

export const RestaurantLighting: React.FC = () => {
  return (
    <group>
      {/* Soft Ambient Light for overall visibility */}
      <ambientLight intensity={0.85} color="#f8fafc" />

      {/* Main Key Sunlight (Angled down from top-right) */}
      <directionalLight
        position={[10, 18, 12]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color="#fffbeb"
      />

      {/* Fill Light (Soft cool blue from opposite side) */}
      <directionalLight 
        position={[-12, 12, -10]} 
        intensity={0.4} 
        color="#bae6fd" 
      />

      {/* Warm Kitchen Station Accent Light */}
      <pointLight 
        position={[-1, 3.5, -3.5]} 
        intensity={1.2} 
        distance={9} 
        color="#fed7aa" 
      />

      {/* Dining Hall Accent Light */}
      <pointLight 
        position={[-1, 3.5, 3]} 
        intensity={0.9} 
        distance={8} 
        color="#fef08a" 
      />
    </group>
  );
};
