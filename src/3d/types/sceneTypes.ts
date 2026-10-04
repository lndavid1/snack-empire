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
  | null;
