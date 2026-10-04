import { RESTAURANT_LAYOUT, DINING_TABLES_LAYOUT } from '../config/restaurantLayout';
import { getRecipeById } from '../../data/recipes';
import type { 
  ProductionStation, 
  Equipment, 
  ProductionJob, 
  Employee, 
  Customer, 
  FoodItem 
} from '../../types/game';
import type { 
  Station3DState, 
  Employee3DState, 
  Customer3DState, 
  ReadyItem3DState, 
  Restaurant3DState, 
  Vector3Tuple 
} from '../types/sceneTypes';

const ARCHETYPE_COLORS: Record<string, string> = {
  FAST: '#f59e0b',     // Amber
  QUALITY: '#10b981',  // Emerald
  BALANCED: '#0ea5e9', // Sky blue
  HARDWORKER: '#a855f7', // Purple
  SERVICE: '#f43f5e',  // Rose
};

/**
 * Pure mapping function: Maps Zustand Production Stations & Equipment to 3D Station States.
 */
export function mapStationsTo3D(
  stations: ProductionStation[],
  equipment: Equipment[],
  productionJobs: ProductionJob[],
  employees: Employee[]
): Station3DState[] {
  return stations.map(station => {
    const layout = (RESTAURANT_LAYOUT.stations as Record<string, { position: Vector3Tuple }>)[station.stationType]
      || { position: [0, 0, -3.8] as Vector3Tuple };

    const equip = equipment.find(e => e.id === station.equipmentId);
    const assignedEmp = employees.find(e => e.id === station.assignedEmployeeId && e.hired);

    let activeJobData: Station3DState['activeJob'] = undefined;
    if (station.activeJobId) {
      const job = productionJobs.find(j => j.id === station.activeJobId);
      if (job && !['READY', 'SERVED', 'FAILED', 'CANCELLED'].includes(job.status)) {
        const recipe = getRecipeById(job.recipeId);
        const step = recipe?.steps[job.currentStepIndex];
        activeJobData = {
          id: job.id,
          recipeId: job.recipeId,
          recipeName: recipe?.name || 'Món ăn',
          status: job.status,
          progress: job.progress,
          stepName: step?.name || job.status,
          freshness: job.freshness,
          temperature: job.temperature,
        };
      }
    }

    return {
      id: station.id,
      name: station.name,
      stationType: station.stationType,
      position: layout.position,
      isOperational: station.isOperational && (equip ? equip.condition > 0 : true),
      equipmentCondition: equip ? equip.condition : 100,
      equipmentTier: equip ? equip.tier : 1,
      equipmentName: equip?.name,
      assignedEmployeeId: assignedEmp?.id,
      assignedEmployeeName: assignedEmp?.name,
      activeJob: activeJobData,
      queueCount: station.queue.length,
    };
  });
}

/**
 * Pure mapping function: Maps Zustand Employees to 3D Employee States and locations.
 */
export function mapEmployeesTo3D(
  employees: Employee[],
  stations: ProductionStation[]
): Employee3DState[] {
  const hiredEmployees = employees.filter(e => e.hired);

  return hiredEmployees.map((emp, index) => {
    const archetype = emp.archetype || 'BALANCED';
    const workState = emp.workState || 'IDLE';
    const stamina = emp.stamina ?? 100;
    const maxStamina = emp.maxStamina ?? 100;
    const color = ARCHETYPE_COLORS[archetype] || '#f59e0b';

    let targetPos: Vector3Tuple;

    if (workState === 'WORKING') {
      const assignedStation = stations.find(s => s.id === emp.assignedStationId || s.activeJobId === emp.currentProductionJobId);
      if (assignedStation) {
        const layoutConfig = (RESTAURANT_LAYOUT.stations as Record<string, { position: Vector3Tuple; workerOffset: Vector3Tuple }>)[assignedStation.stationType];
        if (layoutConfig) {
          targetPos = [
            layoutConfig.position[0] + layoutConfig.workerOffset[0],
            layoutConfig.position[1] + layoutConfig.workerOffset[1],
            layoutConfig.position[2] + layoutConfig.workerOffset[2],
          ];
        } else {
          targetPos = [RESTAURANT_LAYOUT.staff.idleArea[0] + (index * 0.7), 0, RESTAURANT_LAYOUT.staff.idleArea[2]];
        }
      } else {
        targetPos = [RESTAURANT_LAYOUT.staff.idleArea[0] + (index * 0.7), 0, RESTAURANT_LAYOUT.staff.idleArea[2]];
      }
    } else if (workState === 'SERVING') {
      targetPos = emp.role === 'server'
        ? [6.8, 0, 0.4] // Waiter pickup position at counter
        : RESTAURANT_LAYOUT.serviceCounter.cashierPosition;
    } else if (workState === 'RESTING') {
      targetPos = [
        RESTAURANT_LAYOUT.staff.restArea[0] + (index * 0.6),
        RESTAURANT_LAYOUT.staff.restArea[1],
        RESTAURANT_LAYOUT.staff.restArea[2],
      ];
    } else if (workState === 'UNAVAILABLE') {
      targetPos = [-20, -5, -20]; // off-screen
    } else {
      // IDLE or SEEKING_JOB
      if (emp.role === 'cashier') {
        targetPos = RESTAURANT_LAYOUT.serviceCounter.cashierPosition;
      } else if (emp.role === 'server') {
        targetPos = [6.0, 0, 0.4]; // Server staging near pickup counter
      } else {
        targetPos = [
          RESTAURANT_LAYOUT.staff.idleArea[0] + (index * 0.8),
          RESTAURANT_LAYOUT.staff.idleArea[1],
          RESTAURANT_LAYOUT.staff.idleArea[2],
        ];
      }
    }

    return {
      id: emp.id,
      name: emp.name,
      role: emp.role,
      avatar: emp.avatar,
      archetype,
      workState,
      stamina,
      maxStamina,
      currentPosition: targetPos,
      targetPosition: targetPos,
      assignedStationId: emp.assignedStationId,
      currentJobId: emp.currentProductionJobId,
      color,
    };
  });
}

/**
 * Pure mapping function: Maps Zustand Customers to 3D Customer States, table seats, and queue positions.
 */
export function mapCustomersTo3D(
  customers: Customer[],
  foods: FoodItem[]
): Customer3DState[] {
  const unOrderedCustomers = customers.filter(c => c.state === 'waiting' && !c.isOrdered);

  return customers.map((cust, queueIndex) => {
    const maxPatience = cust.maxPatience || 20;
    const patience = cust.patience !== undefined ? cust.patience : (cust.currentWait !== undefined ? cust.currentWait : 20);
    const patiencePercent = Math.max(0, Math.min(100, (patience / maxPatience) * 100));
    const food = foods.find(f => f.id === cust.orderedFoodId || f.id === cust.favoriteFoodId);

    let targetPos: Vector3Tuple;

    if (cust.state === 'waiting' && !cust.isOrdered) {
      // Waiting in line to order at counter
      const unOrderedIndex = unOrderedCustomers.findIndex(c => c.id === cust.id);
      const slotIndex = Math.min(Math.max(0, unOrderedIndex !== -1 ? unOrderedIndex : queueIndex), RESTAURANT_LAYOUT.customer.queueSlots.length - 1);
      targetPos = RESTAURANT_LAYOUT.customer.queueSlots[slotIndex];
    } else if (cust.state === 'eating' || (cust.state === 'waiting' && cust.isOrdered)) {
      // Seated at assigned dining table/seat
      let seatPos: Vector3Tuple | undefined;
      if (cust.seatId) {
        for (const table of DINING_TABLES_LAYOUT) {
          const s = table.seats.find(st => st.id === cust.seatId);
          if (s) {
            seatPos = s.position;
            break;
          }
        }
      }
      if (!seatPos && cust.tableId) {
        const table = DINING_TABLES_LAYOUT.find(t => t.id === cust.tableId);
        if (table) {
          seatPos = table.seats[0]?.position || table.position;
        }
      }
      const fallbackTableIdx = queueIndex % RESTAURANT_LAYOUT.customer.diningTables.length;
      targetPos = seatPos || RESTAURANT_LAYOUT.customer.diningTables[fallbackTableIdx].position;
    } else {
      // Leaving or rage quit
      targetPos = RESTAURANT_LAYOUT.customer.exit;
    }

    return {
      id: cust.id,
      name: cust.name,
      avatar: cust.avatar,
      archetype: cust.archetype,
      mood: cust.mood || 'HAPPY',
      patience,
      maxPatience,
      patiencePercent,
      waitingTime: cust.waitingTime || 0,
      orderedFoodId: cust.orderedFoodId,
      orderedFoodName: food?.name || 'Món ăn',
      orderPrice: food?.sellingPrice,
      currentPosition: targetPos,
      targetPosition: targetPos,
      state: cust.state,
      isOrdered: cust.isOrdered,
      tableId: cust.tableId,
      seatId: cust.seatId,
    };
  });
}

/**
 * Pure mapping function: Maps READY Production Jobs to 3D ready food platter states.
 */
export function mapReadyItemsTo3D(
  productionJobs: ProductionJob[]
): ReadyItem3DState[] {
  const readyJobs = productionJobs.filter(j => j.status === 'READY');

  return readyJobs.map((job, idx) => {
    const recipe = getRecipeById(job.recipeId);
    const baseX = RESTAURANT_LAYOUT.serviceCounter.readyBuffetPosition[0];
    const baseY = RESTAURANT_LAYOUT.serviceCounter.readyBuffetPosition[1];
    const baseZ = RESTAURANT_LAYOUT.serviceCounter.readyBuffetPosition[2];

    const offset: Vector3Tuple = [
      baseX + (idx % 3) * 0.45,
      baseY + Math.floor(idx / 3) * 0.2,
      baseZ,
    ];

    return {
      id: `ready_${job.id}`,
      jobId: job.id,
      recipeName: recipe?.name || 'Khoai Tây Chiên',
      position: offset,
      freshness: job.freshness ?? 100,
      temperature: job.temperature ?? 100,
    };
  });
}

/**
 * Aggregate bridge function: Constructs complete Restaurant3DState snapshot from Zustand GameState.
 */
export function getRestaurant3DState(gameState: {
  stations: ProductionStation[];
  equipment: Equipment[];
  productionJobs: ProductionJob[];
  employees: Employee[];
  customers: Customer[];
  foods: FoodItem[];
}): Restaurant3DState {
  return {
    stations: mapStationsTo3D(
      gameState.stations,
      gameState.equipment,
      gameState.productionJobs,
      gameState.employees
    ),
    employees: mapEmployeesTo3D(
      gameState.employees,
      gameState.stations
    ),
    customers: mapCustomersTo3D(
      gameState.customers,
      gameState.foods
    ),
    readyItems: mapReadyItemsTo3D(
      gameState.productionJobs
    ),
  };
}
