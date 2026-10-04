import type { Vector3Tuple } from '../types/sceneTypes';

export type CameraPresetId = 'DEFAULT' | 'KITCHEN' | 'DINING' | 'SERVICE';

export interface CameraPreset {
  id: CameraPresetId;
  name: string;
  position: Vector3Tuple;
  target: Vector3Tuple;
  fov?: number;
}

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
  presets: Record<CameraPresetId, CameraPreset>;
}

export const CAMERA_PRESETS: Record<CameraPresetId, CameraPreset> = {
  DEFAULT: {
    id: 'DEFAULT',
    name: 'Toàn Cảnh Nhà Hàng',
    position: [0, 16, 15],
    target: [0, 0.5, 0.5],
  },
  KITCHEN: {
    id: 'KITCHEN',
    name: 'Khu Vực Bếp Nấu',
    position: [0, 11, -0.5],
    target: [-0.5, 0.8, -4.2],
  },
  DINING: {
    id: 'DINING',
    name: 'Khu Vực Bàn Ăn',
    position: [-3.5, 12, 11],
    target: [-3.5, 0.6, 3.5],
  },
  SERVICE: {
    id: 'SERVICE',
    name: 'Quầy Thu Ngân & Phục Vụ',
    position: [4.8, 10, 4.5],
    target: [5.2, 0.8, -1.0],
  },
};

export const CAMERA_CONFIG: CameraConfig = {
  initialPosition: CAMERA_PRESETS.DEFAULT.position,
  initialTarget: CAMERA_PRESETS.DEFAULT.target,
  fov: 46,
  minDistance: 6,
  maxDistance: 32,
  minPolarAngle: Math.PI / 6,    // ~30 degrees
  maxPolarAngle: Math.PI / 2.2,  // ~81 degrees
  mobilePosition: [0, 20, 18],
  mobileFov: 54,
  presets: CAMERA_PRESETS,
};
