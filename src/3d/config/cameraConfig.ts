import type { Vector3Tuple } from '../types/sceneTypes';

export interface CameraConfig {
  initialPosition: Vector3Tuple;
  initialTarget: Vector3Tuple;
  fov: number;
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  mobilePosition: Vector3Tuple;
  mobileFov: number;
}

export const CAMERA_CONFIG: CameraConfig = {
  // Angled isometric perspective showing both kitchen and customer area
  initialPosition: [0, 15, 14],
  initialTarget: [0, 0.5, 0],
  fov: 46,
  minDistance: 7,
  maxDistance: 28,
  minPolarAngle: Math.PI / 6,    // ~30 degrees: prevents direct vertical top-down confusion
  maxPolarAngle: Math.PI / 2.2,  // ~81 degrees: prevents looking up from beneath the floor
  mobilePosition: [0, 18, 17],
  mobileFov: 52,
};
