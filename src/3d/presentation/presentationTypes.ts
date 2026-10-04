import type { Vector3Tuple } from '../types/sceneTypes';
import type { ProductionJobStatus } from '../../types/game';

export type CharacterAction =
  | 'IDLE'
  | 'WALKING'
  | 'PREPPING'
  | 'COOKING'
  | 'PACKING'
  | 'CARRYING'
  | 'SERVING'
  | 'EATING'
  | 'WAITING'
  | 'CLEANING';

export type StationAction =
  | 'IDLE'
  | 'ACTIVE'
  | 'PREPARING'
  | 'COOKING'
  | 'PACKING'
  | 'READY';

export type FoodPropType =
  | 'potato'
  | 'fries_basket'
  | 'fries_box'
  | 'salt_shaker'
  | 'food_tray'
  | 'drink_cup';

export interface EmployeePresentationState {
  action: CharacterAction;
  activeJobId?: string;
  recipeName?: string;
  stationType?: string;
  carryingProp?: FoodPropType;
  progress: number;
}

export interface CustomerPresentationState {
  action: CharacterAction;
  eatingProp?: FoodPropType;
}

export interface StationPresentationState {
  action: StationAction;
  activeJobId?: string;
  recipeName?: string;
  progress: number;
  assignedEmployeeId?: string;
}
