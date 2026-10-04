import { 
  RESTAURANT_LAYOUT, 
  INTERACTION_POINTS, 
  QUEUE_SLOTS, 
  DINING_TABLES_LAYOUT 
} from '../config/restaurantLayout';
import type { 
  Employee, 
  ProductionStation, 
  ProductionJob, 
  Customer, 
  Order 
} from '../../types/game';
import type { Vector3Tuple } from '../types/sceneTypes';
import { NavigationGraph, defaultNavigationGraph } from './navigationGraph';
import { findPath } from './pathfinding';
import type { PathfindingResult } from './navigationTypes';

/**
 * Pure resolver: maps Employee state to physical target destination in the restaurant.
 */
export function resolveEmployeeDestination(
  employee: Employee,
  stations: ProductionStation[] = [],
  productionJobs: ProductionJob[] = []
): { targetPosition: Vector3Tuple; interactionPointId?: string; reason: string } {
  const workState = employee.workState || 'IDLE';

  if (workState === 'WORKING') {
    // 1. Locate assigned station or active job station
    const station = stations.find(s => 
      s.id === employee.assignedStationId || 
      (employee.currentProductionJobId && s.activeJobId === employee.currentProductionJobId)
    );

    if (station) {
      // Find matching interaction point for this station
      const point = INTERACTION_POINTS.find(p => 
        p.linkedObjectId === station.id ||
        p.linkedObjectId === `station_${station.stationType}` ||
        p.linkedObjectId === `station_${station.stationType}_table`
      );
      if (point) {
        return {
          targetPosition: point.position,
          interactionPointId: point.id,
          reason: `WORKING at ${station.name}`,
        };
      }

      // Fallback to station position + worker offset
      const stationConfig = (RESTAURANT_LAYOUT.stations as Record<string, { position: Vector3Tuple; workerOffset: Vector3Tuple }>)[station.stationType];
      if (stationConfig) {
        return {
          targetPosition: [
            stationConfig.position[0] + stationConfig.workerOffset[0],
            stationConfig.position[1] + stationConfig.workerOffset[1],
            stationConfig.position[2] + stationConfig.workerOffset[2],
          ],
          reason: `WORKING at ${station.name}`,
        };
      }
    }

    // Default working fallback: station prep
    const prepPoint = INTERACTION_POINTS.find(p => p.id === 'point_prep_stand');
    return {
      targetPosition: prepPoint ? prepPoint.position : [-3.8, 0, -3.4],
      interactionPointId: prepPoint?.id,
      reason: 'WORKING (General Station)',
    };
  }

  if (workState === 'SERVING') {
    // Service counter server point
    const serverPoint = INTERACTION_POINTS.find(p => p.id === 'point_pickup_server');
    return {
      targetPosition: serverPoint ? serverPoint.position : RESTAURANT_LAYOUT.serviceCounter.cashierPosition,
      interactionPointId: serverPoint?.id,
      reason: 'SERVING food at counter',
    };
  }

  if (workState === 'RESTING') {
    // Break lounge rest point
    const restPoint = INTERACTION_POINTS.find(p => p.id === 'point_rest_stand');
    return {
      targetPosition: restPoint ? restPoint.position : RESTAURANT_LAYOUT.staff.restArea,
      interactionPointId: restPoint?.id,
      reason: 'RESTING in staff lounge',
    };
  }

  if (workState === 'UNAVAILABLE') {
    return {
      targetPosition: [-20, -5, -20],
      reason: 'UNAVAILABLE (off-premises)',
    };
  }

  // IDLE or SEEKING_JOB
  if (employee.role === 'cashier') {
    const cashierPoint = INTERACTION_POINTS.find(p => p.id === 'point_order_cashier');
    return {
      targetPosition: cashierPoint ? cashierPoint.position : RESTAURANT_LAYOUT.serviceCounter.cashierPosition,
      interactionPointId: cashierPoint?.id,
      reason: 'IDLE (attending cashier register)',
    };
  }

  return {
    targetPosition: RESTAURANT_LAYOUT.staff.idleArea,
    reason: 'IDLE in kitchen staging area',
  };
}

/**
 * Pure resolver: maps Customer state to physical target destination in the restaurant.
 */
export function resolveCustomerDestination(
  customer: Customer,
  queueIndex = 0,
  orders: Order[] = []
): { targetPosition: Vector3Tuple; pointId?: string; reason: string } {
  if (customer.state === 'waiting') {
    // Check if food is READY and customer needs to pick it up
    const order = orders.find(o => o.customerId === customer.id || o.id === customer.orderId);
    if (order && order.status === 'READY') {
      const pickupPoint = INTERACTION_POINTS.find(p => p.id === 'point_pickup_customer');
      if (pickupPoint) {
        return {
          targetPosition: pickupPoint.position,
          pointId: pickupPoint.id,
          reason: 'PICKING_UP ready food order',
        };
      }
    }

    // Otherwise, assign sequential queue slot
    const slotIdx = Math.min(queueIndex, QUEUE_SLOTS.length - 1);
    const slot = QUEUE_SLOTS[slotIdx];
    return {
      targetPosition: slot ? slot.position : [3.6, 0, 0.4],
      pointId: slot ? slot.id : undefined,
      reason: `WAITING in queue slot #${slotIdx + 1}`,
    };
  }

  if (customer.state === 'eating') {
    // Target dining table
    const tableIndex = queueIndex % DINING_TABLES_LAYOUT.length;
    const table = DINING_TABLES_LAYOUT[tableIndex];
    return {
      targetPosition: table ? table.position : [-3.8, 0, 3.5],
      pointId: table ? table.id : undefined,
      reason: `EATING at ${table ? table.name : 'dining table'}`,
    };
  }

  // leaving or rage_quit
  const exitPoint = INTERACTION_POINTS.find(p => p.id === 'point_main_exit');
  return {
    targetPosition: exitPoint ? exitPoint.position : RESTAURANT_LAYOUT.customer.exit,
    pointId: exitPoint?.id,
    reason: customer.state === 'rage_quit' ? 'RAGE_QUIT (exiting restaurant)' : 'LEAVING restaurant',
  };
}

/**
 * Builds a smooth waypoint path between two world positions via the Navigation Graph.
 */
export function buildNavigationPath(
  startPos: Vector3Tuple,
  targetPos: Vector3Tuple,
  graph: NavigationGraph = defaultNavigationGraph
): PathfindingResult {
  const directDistance = NavigationGraph.getDistanceXZ(startPos, targetPos);

  // If start and target are already close enough, direct line
  if (directDistance <= 0.35) {
    return {
      success: true,
      nodeIds: [],
      waypoints: [targetPos],
      totalDistance: directDistance,
    };
  }

  // 1. Find nearest graph nodes to start and target
  const startNode = graph.findNearestNode(startPos);
  const targetNode = graph.findNearestNode(targetPos);

  if (!startNode || !targetNode) {
    return {
      success: false,
      nodeIds: [],
      waypoints: [targetPos],
      totalDistance: directDistance,
    };
  }

  // 2. If closest nodes are the same, path is start -> node -> target
  if (startNode.id === targetNode.id) {
    const waypoints: Vector3Tuple[] = [startNode.position, targetPos];
    const dist = NavigationGraph.getDistanceXZ(startPos, startNode.position) +
                 NavigationGraph.getDistanceXZ(startNode.position, targetPos);
    return {
      success: true,
      nodeIds: [startNode.id],
      waypoints,
      totalDistance: dist,
    };
  }

  // 3. Find path using A*
  const nodePath = findPath(graph, startNode.id, targetNode.id);

  if (!nodePath || nodePath.length === 0) {
    // Fallback: direct line
    return {
      success: false,
      nodeIds: [],
      waypoints: [targetPos],
      totalDistance: directDistance,
    };
  }

  // 4. Construct waypoints: intermediate node positions + final targetPos
  const waypoints: Vector3Tuple[] = [];
  let totalDistance = NavigationGraph.getDistanceXZ(startPos, startNode.position);

  let prevPos: Vector3Tuple = startPos;
  for (const nodeId of nodePath) {
    const node = graph.getNode(nodeId);
    if (node) {
      waypoints.push(node.position);
      totalDistance += NavigationGraph.getDistanceXZ(prevPos, node.position);
      prevPos = node.position;
    }
  }

  // Append target position if not right on the last node
  const lastNodePos = prevPos;
  if (NavigationGraph.getDistanceXZ(lastNodePos, targetPos) > 0.05) {
    waypoints.push(targetPos);
    totalDistance += NavigationGraph.getDistanceXZ(lastNodePos, targetPos);
  }

  return {
    success: true,
    nodeIds: nodePath,
    waypoints,
    totalDistance,
  };
}
