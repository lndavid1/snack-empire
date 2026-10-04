import React, { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CAMERA_CONFIG } from '../config/cameraConfig';

interface RestaurantCameraProps {
  controlsRef?: React.RefObject<OrbitControlsImpl | null>;
}

export const RestaurantCamera: React.FC<RestaurantCameraProps> = ({ controlsRef }) => {
  const localRef = useRef<OrbitControlsImpl>(null);
  const activeRef = controlsRef || localRef;

  return (
    <OrbitControls
      ref={activeRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={CAMERA_CONFIG.minDistance}
      maxDistance={CAMERA_CONFIG.maxDistance}
      minPolarAngle={CAMERA_CONFIG.minPolarAngle}
      maxPolarAngle={CAMERA_CONFIG.maxPolarAngle}
      target={CAMERA_CONFIG.initialTarget}
    />
  );
};
