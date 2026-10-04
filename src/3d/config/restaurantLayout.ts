import type { Vector3Tuple } from '../types/sceneTypes';

export interface RoomLayoutConfig {
  width: number;
  depth: number;
  wallHeight: number;
  kitchenDividerZ: number;
}

export const ROOM_CONFIG: RoomLayoutConfig = {
  width: 16,
  depth: 13,
  wallHeight: 2.2,
  kitchenDividerZ: -0.5,
};

export const RESTAURANT_LAYOUT = {
  // Kitchen Stations Layout
  stations: {
    prep: {
      position: [-3.8, 0, -3.8] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    fryer: {
      position: [-0.6, 0, -3.8] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    packing: {
      position: [2.6, 0, -3.8] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    beverage: {
      position: [5.6, 0, -3.8] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    grill: {
      position: [-6.2, 0, -3.8] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    assembly: {
      position: [2.6, 0, -1.8] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    oven: {
      position: [-6.2, 0, -1.8] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
  },

  // Storage Area (Pantry & shelves)
  storage: {
    position: [-6.2, 0, -1.5] as Vector3Tuple,
  },

  // Service Counter (Where cashier stands and orders are passed)
  serviceCounter: {
    position: [4.8, 0, -0.6] as Vector3Tuple,
    cashierPosition: [4.8, 0, -1.7] as Vector3Tuple,
    customerPickPosition: [4.8, 0, 0.6] as Vector3Tuple,
    readyBuffetPosition: [3.2, 0.85, -0.6] as Vector3Tuple,
  },

  // Staff Zones
  staff: {
    idleArea: [-2.5, 0, -1.5] as Vector3Tuple,
    restArea: [-5.5, 0, -1.5] as Vector3Tuple,
  },

  // Customer Zones
  customer: {
    entrance: [0, 0, 5.8] as Vector3Tuple,
    exit: [-1.5, 0, 5.8] as Vector3Tuple,
    // Queue slots for waiting customers (up to 8 slots)
    queueSlots: [
      [2.5, 0, 1.5] as Vector3Tuple,
      [1.5, 0, 2.2] as Vector3Tuple,
      [0.5, 0, 2.9] as Vector3Tuple,
      [-0.5, 0, 3.6] as Vector3Tuple,
      [-0.5, 0, 4.4] as Vector3Tuple,
      [-0.5, 0, 5.1] as Vector3Tuple,
      [0.8, 0, 5.1] as Vector3Tuple,
      [1.8, 0, 5.1] as Vector3Tuple,
    ],
    // Dining tables
    diningTables: [
      { id: 'table_1', position: [-4.2, 0, 2.0] as Vector3Tuple, seats: 2 },
      { id: 'table_2', position: [-1.8, 0, 2.0] as Vector3Tuple, seats: 2 },
      { id: 'table_3', position: [-4.2, 0, 4.4] as Vector3Tuple, seats: 4 },
      { id: 'table_4', position: [3.8, 0, 3.6] as Vector3Tuple, seats: 2 },
    ],
  },
};
