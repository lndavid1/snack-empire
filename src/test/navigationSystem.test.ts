import { describe, it, expect, beforeEach } from 'vitest';
import { NavigationGraph, defaultNavigationGraph } from '../3d/navigation/navigationGraph';
import { findPath, clearPathCache } from '../3d/navigation/pathfinding';
import { 
  resolveEmployeeDestination, 
  resolveCustomerDestination, 
  buildNavigationPath 
} from '../3d/navigation/navigationService';
import { CharacterMovementController } from '../3d/navigation/movementSystem';
import { MOVEMENT_CONFIG } from '../3d/navigation/navigationTypes';
import { RESTAURANT_LAYOUT, NAVIGATION_NODES } from '../3d/config/restaurantLayout';
import type { Employee, Customer, ProductionStation, Order } from '../types/game';
import type { Vector3Tuple } from '../3d/types/sceneTypes';

describe('Phase 6C: Character Navigation & Movement System', () => {
  beforeEach(() => {
    clearPathCache();
  });

  describe('Navigation Graph Structure & Connectivity', () => {
    it('should validate that all node connections reference existing nodes without dangling links', () => {
      const graph = new NavigationGraph(NAVIGATION_NODES);
      const validation = graph.validateGraph();
      expect(validation.isValid).toBe(true);
      expect(validation.brokenLinks).toHaveLength(0);
    });

    it('should compute horizontal Euclidean distance (XZ plane) accurately', () => {
      const p1: Vector3Tuple = [0, 0, 0];
      const p2: Vector3Tuple = [3, 10, 4]; // height difference ignored in getDistanceXZ
      expect(NavigationGraph.getDistanceXZ(p1, p2)).toBe(5);
    });

    it('should locate the nearest navigation node to a given arbitrary position', () => {
      // Near prep station [-3.8, 0, -3.4]
      const nearPrep = defaultNavigationGraph.findNearestNode([-3.7, 0, -3.2]);
      expect(nearPrep).toBeDefined();
      expect(nearPrep?.id).toBe('nav_prep_station');

      // Near main entrance [0, 0, 7.2]
      const nearEntrance = defaultNavigationGraph.findNearestNode([0.1, 0, 7.0]);
      expect(nearEntrance?.id).toBe('nav_entrance');
    });

    it('should filter nearest node by zone type when requested', () => {
      // Position is near kitchen door, but filter is DINING
      const diningNode = defaultNavigationGraph.findNearestNode([0, 0, 0], 'DINING');
      expect(diningNode?.zone).toBe('DINING');
    });
  });

  describe('Pure A* Pathfinding Algorithm', () => {
    it('should find the shortest valid route between two connected nodes', () => {
      // Entrance -> Queue Tail
      const path = findPath(defaultNavigationGraph, 'nav_entrance', 'nav_queue_tail');
      expect(path).toBeDefined();
      expect(path![0]).toBe('nav_entrance');
      expect(path![path!.length - 1]).toBe('nav_queue_tail');
      expect(path).toContain('nav_foyer');
    });

    it('should route between kitchen stations correctly', () => {
      // Prep station -> Fryer station
      const path = findPath(defaultNavigationGraph, 'nav_prep_station', 'nav_fryer_station');
      expect(path).toBeDefined();
      expect(path).toEqual(['nav_prep_station', 'nav_fryer_station']);

      // Prep station -> Packing station (via hallway or fryer)
      const pathPacking = findPath(defaultNavigationGraph, 'nav_prep_station', 'nav_packing_station');
      expect(pathPacking).toBeDefined();
      expect(pathPacking![0]).toBe('nav_prep_station');
      expect(pathPacking![pathPacking!.length - 1]).toBe('nav_packing_station');
    });

    it('should return a single-element path when start and target nodes are identical', () => {
      const path = findPath(defaultNavigationGraph, 'nav_storage', 'nav_storage');
      expect(path).toEqual(['nav_storage']);
    });

    it('should return null when a node ID does not exist', () => {
      const path = findPath(defaultNavigationGraph, 'nav_entrance', 'non_existent_node_id');
      expect(path).toBeNull();
    });

    it('should cache computed paths for subsequent queries', () => {
      const path1 = findPath(defaultNavigationGraph, 'nav_entrance', 'nav_exit');
      const path2 = findPath(defaultNavigationGraph, 'nav_entrance', 'nav_exit');
      expect(path1).toEqual(path2);
    });
  });

  describe('Waypoint Path Generation (Navigation Service)', () => {
    it('should generate waypoints from arbitrary start coordinates to destination', () => {
      const start: Vector3Tuple = [0, 0, 7.2]; // at entrance
      const target: Vector3Tuple = [-3.8, 0, -3.4]; // at prep station

      const result = buildNavigationPath(start, target, defaultNavigationGraph);
      expect(result.success).toBe(true);
      expect(result.waypoints.length).toBeGreaterThan(2);
      expect(result.totalDistance).toBeGreaterThan(5);

      // Final waypoint should be close to or at target
      const lastWP = result.waypoints[result.waypoints.length - 1];
      expect(lastWP[0]).toBeCloseTo(target[0]);
      expect(lastWP[2]).toBeCloseTo(target[2]);
    });

    it('should return direct line if start and target are already within arrival threshold', () => {
      const start: Vector3Tuple = [1.0, 0, 2.0];
      const target: Vector3Tuple = [1.1, 0, 2.1];

      const result = buildNavigationPath(start, target, defaultNavigationGraph);
      expect(result.success).toBe(true);
      expect(result.waypoints).toEqual([target]);
    });
  });

  describe('Employee Destination Resolution', () => {
    const mockPrepStation: ProductionStation = {
      id: 'station_prep_table',
      name: 'Bàn Sơ Chế',
      stationType: 'prep',
      equipmentId: 'eq1',
      capacity: 1,
      isOperational: true,
      queue: [],
    };

    it('resolves WORKING cook to station interaction point', () => {
      const emp: Employee = {
        id: 'emp_1',
        name: 'Bob',
        role: 'cook',
        avatar: '👨‍🍳',
        level: 1,
        speed: 10,
        quality: 10,
        salaryPerSec: 1,
        hired: true,
        hireCost: 100,
        upgradeCost: 50,
        mood: 100,
        catchphrase: 'Yes chef',
        workState: 'WORKING',
        assignedStationId: 'station_prep_table',
      };

      const destination = resolveEmployeeDestination(emp, [mockPrepStation]);
      expect(destination.interactionPointId).toBe('point_prep_stand');
      expect(destination.targetPosition[0]).toBeCloseTo(-3.8);
      expect(destination.targetPosition[2]).toBeCloseTo(-3.4);
    });

    it('resolves SERVING employee to service counter pickup point', () => {
      const emp: Employee = {
        id: 'emp_2',
        name: 'Linh',
        role: 'cashier',
        avatar: '👩‍💼',
        level: 1,
        speed: 10,
        quality: 10,
        salaryPerSec: 1,
        hired: true,
        hireCost: 100,
        upgradeCost: 50,
        mood: 100,
        catchphrase: 'Welcome',
        workState: 'SERVING',
      };

      const destination = resolveEmployeeDestination(emp);
      expect(destination.interactionPointId).toBe('point_pickup_server');
    });

    it('resolves RESTING employee to staff rest lounge point', () => {
      const emp: Employee = {
        id: 'emp_3',
        name: 'Duy',
        role: 'cook',
        avatar: '😴',
        level: 1,
        speed: 10,
        quality: 10,
        salaryPerSec: 1,
        hired: true,
        hireCost: 100,
        upgradeCost: 50,
        mood: 100,
        catchphrase: 'Zzz',
        workState: 'RESTING',
      };

      const destination = resolveEmployeeDestination(emp);
      expect(destination.interactionPointId).toBe('point_rest_stand');
      expect(destination.targetPosition[0]).toBeCloseTo(-7.5);
      expect(destination.targetPosition[2]).toBeCloseTo(-2.0);
    });

    it('resolves UNAVAILABLE employee to off-premises coordinates', () => {
      const emp: Employee = {
        id: 'emp_4',
        name: 'Away',
        role: 'cook',
        avatar: '🚶',
        level: 1,
        speed: 10,
        quality: 10,
        salaryPerSec: 1,
        hired: true,
        hireCost: 100,
        upgradeCost: 50,
        mood: 100,
        catchphrase: 'Off',
        workState: 'UNAVAILABLE',
      };

      const destination = resolveEmployeeDestination(emp);
      expect(destination.targetPosition).toEqual([-20, -5, -20]);
    });
  });

  describe('Customer Destination Resolution', () => {
    it('resolves waiting customer to designated queue slot', () => {
      const cust: Customer = {
        id: 'c1',
        name: 'An',
        archetype: 'student',
        avatar: '😊',
        budget: 50,
        patience: 25,
        favoriteFoodId: 'food_1',
        state: 'waiting',
        satisfaction: 5,
        quote: 'Hi',
      };

      const dest0 = resolveCustomerDestination(cust, 0);
      expect(dest0.pointId).toBe('queue_slot_01');
      expect(dest0.targetPosition).toEqual([3.6, 0, 0.4]);

      const dest2 = resolveCustomerDestination(cust, 2);
      expect(dest2.pointId).toBe('queue_slot_03');
    });

    it('resolves waiting customer with READY food to pickup counter', () => {
      const cust: Customer = {
        id: 'c2',
        name: 'Binh',
        archetype: 'office',
        avatar: '🧑‍💻',
        budget: 60,
        patience: 15,
        favoriteFoodId: 'food_1',
        orderId: 'order_99',
        state: 'waiting',
        satisfaction: 4,
        quote: 'Ready yet?',
      };

      const mockOrder: Order = {
        id: 'order_99',
        customerId: 'c2',
        foodId: 'food_1',
        quantity: 1,
        createdAt: Date.now(),
        waitingTime: 10,
        status: 'READY',
        basePrice: 15,
      };

      const dest = resolveCustomerDestination(cust, 0, [mockOrder]);
      expect(dest.pointId).toBe('point_pickup_customer');
      expect(dest.targetPosition).toEqual([6.8, 0, 0.4]);
    });

    it('resolves leaving and rage quit customers to exit portal', () => {
      const rageCust: Customer = {
        id: 'c3',
        name: 'Hung',
        archetype: 'vip',
        avatar: '😡',
        budget: 100,
        patience: 0,
        favoriteFoodId: 'food_1',
        state: 'rage_quit',
        satisfaction: 1,
        quote: 'Too slow!',
      };

      const dest = resolveCustomerDestination(rageCust);
      expect(dest.pointId).toBe('point_main_exit');
      expect(dest.targetPosition[0]).toBeCloseTo(-2.2);
      expect(dest.targetPosition[2]).toBeCloseTo(7.4);
    });
  });

  describe('CharacterMovementController Runtime', () => {
    it('initializes in IDLE state at given position', () => {
      const controller = new CharacterMovementController([0, 0, 0], 0, 2.0);
      expect(controller.status).toBe('IDLE');
      expect(controller.position).toEqual([0, 0, 0]);
      expect(controller.speed).toBe(2.0);
    });

    it('transitions to MOVING and generates waypoint path when given distant target', () => {
      const controller = new CharacterMovementController([0, 0, 7.2], 0, 2.5);
      controller.setDestination([-3.8, 0, -3.4]);

      expect(controller.status).toBe('MOVING');
      expect(controller.waypoints.length).toBeGreaterThan(0);
    });

    it('advances position and rotates toward target on frame update', () => {
      const controller = new CharacterMovementController([0, 0, 6.0], 0, 2.0);
      controller.setDestination([0, 0, 7.2]);

      const state1 = controller.update(0.5); // 0.5s * 2.0 speed = 1.0 unit forward along Z
      expect(state1.isWalking).toBe(true);
      expect(state1.position[2]).toBeGreaterThan(6.0);
      // Moving in +Z direction: target angle is atan2(0, 1) = 0
      expect(state1.rotation).toBeCloseTo(0, 1);
    });

    it('arrives at target and transitions to ARRIVED when distance is within threshold', () => {
      const controller = new CharacterMovementController([0, 0, 0], 0, 5.0);
      controller.setDestination([0, 0, 0.1]); // within arrival threshold

      expect(controller.status).toBe('ARRIVED');
      const state = controller.update(0.1);
      expect(state.isWalking).toBe(false);
      expect(state.status).toBe('ARRIVED');
    });

    it('slows down speed when other characters are within separation distance', () => {
      const controller = new CharacterMovementController([0, 0, 6.0], 0, 2.0);
      controller.setDestination([0, 0, 7.2]);

      // Neighbor is at distance 0.3m (less than SEPARATION_DISTANCE 0.6m)
      const neighborPos: Vector3Tuple = [0.1, 0, 6.3];
      const stateWithNeighbor = controller.update(0.1, [neighborPos]);

      expect(stateWithNeighbor.isWalking).toBe(true);
      // Distance moved should be scaled by 0.7
      expect(stateWithNeighbor.position[2]).toBeCloseTo(6.0 + 2.0 * 0.7 * 0.1, 2);
    });
  });
});
