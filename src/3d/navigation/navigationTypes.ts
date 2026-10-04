import type { Vector3Tuple, RestaurantZoneType } from '../types/sceneTypes';

export type MovementStatus = 'IDLE' | 'MOVING' | 'ARRIVED' | 'BLOCKED' | 'FAILED';

export interface MovementState {
  position: Vector3Tuple;
  rotation: number;
  targetPosition?: Vector3Tuple;
  path: Vector3Tuple[];
  currentPathIndex: number;
  speed: number;
  status: MovementStatus;
  nodePath: string[];
}

export interface CharacterIntent {
  entityId: string;
  entityType: 'employee' | 'customer';
  targetPointId?: string;
  targetPosition: Vector3Tuple;
  reason: string;
}

export interface PathfindingResult {
  success: boolean;
  nodeIds: string[];
  waypoints: Vector3Tuple[];
  totalDistance: number;
}

export interface MovementConfig {
  walkSpeed: number;
  arrivalThreshold: number;
  rotationSpeed: number;
  separationDistance: number;
}

export const MOVEMENT_CONFIG = {
  EMPLOYEE_WALK_SPEED: 2.5,
  CUSTOMER_WALK_SPEED: 1.6,
  ARRIVAL_THRESHOLD: 0.15,
  ROTATION_SPEED: 12.0,
  SEPARATION_DISTANCE: 0.6,
  DEBUG_LINE_Y_OFFSET: 0.1,
} as const;
