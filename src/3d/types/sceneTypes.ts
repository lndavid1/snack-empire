import type { 
  EquipmentCategory, 
  EmployeeWorkState, 
  EmployeeArchetype, 
  CustomerMood, 
  ProductionJobStatus 
} from '../../types/game';

export type Vector3Tuple = [number, number, number];

export interface Station3DState {
  id: string;
  name: string;
  stationType: EquipmentCategory;
  position: Vector3Tuple;
  rotation?: Vector3Tuple;
  isOperational: boolean;
  equipmentCondition: number;
  equipmentTier: number;
  equipmentName?: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  activeJob?: {
    id: string;
    recipeId: string;
    recipeName: string;
    status: ProductionJobStatus;
    progress: number;
    stepName: string;
    freshness?: number;
    temperature?: number;
  };
  queueCount: number;
}

export interface Employee3DState {
  id: string;
  name: string;
  role: string;
  avatar: string;
  archetype: EmployeeArchetype;
  workState: EmployeeWorkState;
  stamina: number;
  maxStamina: number;
  currentPosition: Vector3Tuple;
  targetPosition: Vector3Tuple;
  assignedStationId?: string;
  currentJobId?: string;
  color: string;
}

export interface Customer3DState {
  id: string;
  name: string;
  avatar: string;
  archetype: string;
  mood: CustomerMood;
  patience: number;
  maxPatience: number;
  patiencePercent: number;
  waitingTime: number;
  orderedFoodId?: string;
  orderedFoodName?: string;
  orderPrice?: number;
  currentPosition: Vector3Tuple;
  targetPosition: Vector3Tuple;
  state: 'waiting' | 'eating' | 'leaving' | 'rage_quit';
}

export interface ReadyItem3DState {
  id: string;
  jobId: string;
  recipeName: string;
  position: Vector3Tuple;
  freshness: number;
  temperature: number;
}

// ----------------------------------------------------
// PHASE 6B: PHYSICAL RESTAURANT & SPATIAL DATA TYPES
// ----------------------------------------------------

export type RestaurantZoneType =
  | 'ENTRANCE'
  | 'WAITING'
  | 'DINING'
  | 'SERVICE'
  | 'KITCHEN'
  | 'PREP'
  | 'COOKING'
  | 'PACKING'
  | 'STORAGE'
  | 'REST'
  | 'EXIT';

export interface RestaurantZone {
  id: string;
  type: RestaurantZoneType;
  name: string;
  position: Vector3Tuple;
  size: [number, number]; // width (X), depth (Z)
  description?: string;
  color?: string;
}

export type InteractionPointType =
  | 'EMPLOYEE_STAND'
  | 'CUSTOMER_STAND'
  | 'SEAT'
  | 'PICKUP'
  | 'ORDER'
  | 'PAYMENT'
  | 'FOOD_OUTPUT'
  | 'ENTRY'
  | 'EXIT';

export interface InteractionPoint {
  id: string;
  name: string;
  type: InteractionPointType;
  position: Vector3Tuple;
  rotation?: number;
  linkedObjectId?: string;
}

export interface RestaurantPortal {
  id: string;
  type: 'ENTRANCE' | 'EXIT' | 'STAFF_DOOR' | 'KITCHEN_DOOR';
  name: string;
  position: Vector3Tuple;
  width: number;
}

export interface DiningSeatLayout {
  id: string;
  tableId: string;
  seatIndex: number;
  position: Vector3Tuple;
  rotation: number;
  isOccupied?: boolean;
}

export interface DiningTableLayout {
  id: string;
  name: string;
  position: Vector3Tuple;
  shape: 'round' | 'rectangular';
  capacity: number;
  seats: DiningSeatLayout[];
  servicePoint: Vector3Tuple;
}

export interface QueueSlot {
  id: string;
  index: number;
  position: Vector3Tuple;
  rotation: number;
  queueType: 'ORDER' | 'PICKUP';
}

export interface SpatialObstacle {
  id: string;
  name: string;
  category: 'furniture' | 'wall' | 'counter' | 'equipment' | 'decor';
  position: Vector3Tuple;
  size: Vector3Tuple;
}

export interface NavigationNode {
  id: string;
  name: string;
  zone: RestaurantZoneType;
  position: Vector3Tuple;
  connections: string[]; // Connected NavigationNode IDs
}

export interface Restaurant3DState {
  stations: Station3DState[];
  employees: Employee3DState[];
  customers: Customer3DState[];
  readyItems: ReadyItem3DState[];
}

export type InspectedObject = 
  | { type: 'station'; data: Station3DState }
  | { type: 'employee'; data: Employee3DState }
  | { type: 'customer'; data: Customer3DState }
  | { type: 'table'; data: DiningTableLayout }
  | { type: 'seat'; data: DiningSeatLayout }
  | { type: 'zone'; data: RestaurantZone }
  | { type: 'queue'; data: QueueSlot }
  | { type: 'counter_point'; data: { name: string; type: string; description: string } }
  | { type: 'decor'; data: { name: string; description: string } }
  | null;
