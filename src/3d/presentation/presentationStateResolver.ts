import type { Employee3DState, Customer3DState, Station3DState } from '../types/sceneTypes';
import type { MovementStatus } from '../navigation/navigationTypes';
import type { 
  EmployeePresentationState, 
  CustomerPresentationState, 
  StationPresentationState 
} from './presentationTypes';

interface EmployeeResolverParams {
  employee: Employee3DState;
  activeJob?: Station3DState['activeJob'];
  movementStatus: MovementStatus;
  isNearDestination?: boolean;
}

interface CustomerResolverParams {
  customer: Customer3DState;
  movementStatus: MovementStatus;
  isNearDestination?: boolean;
}

/**
 * Pure function: resolves the visual animation and action state of an Employee.
 * Strictly respects: Game Logic -> Navigation -> Movement -> Presentation Action.
 */
export function resolveEmployeePresentationState({
  employee,
  activeJob,
  movementStatus,
  isNearDestination = false,
}: EmployeeResolverParams): EmployeePresentationState {
  // 1. Moving state
  if (movementStatus === 'MOVING' && !isNearDestination) {
    if (employee.workState === 'SERVING') {
      // Carrying food to service counter
      return {
        action: 'CARRYING',
        carryingProp: 'fries_box',
        progress: 100,
      };
    }
    return {
      action: 'WALKING',
      progress: 0,
    };
  }

  // 2. Arrived at physical destination: execute role/step action
  if (employee.workState === 'WORKING') {
    if (activeJob) {
      const status = activeJob.status;

      if (status === 'PREPARING') {
        return {
          action: 'PREPPING',
          activeJobId: activeJob.id,
          recipeName: activeJob.recipeName,
          progress: activeJob.progress,
        };
      }

      if (status === 'COOKING') {
        return {
          action: 'COOKING',
          activeJobId: activeJob.id,
          recipeName: activeJob.recipeName,
          progress: activeJob.progress,
        };
      }

      if (status === 'PACKING' || status === 'ASSEMBLING') {
        return {
          action: 'PACKING',
          activeJobId: activeJob.id,
          recipeName: activeJob.recipeName,
          progress: activeJob.progress,
        };
      }

      if (status === 'READY') {
        return {
          action: 'CARRYING',
          activeJobId: activeJob.id,
          recipeName: activeJob.recipeName,
          carryingProp: 'fries_box',
          progress: 100,
        };
      }
    }

    // Default working standby
    return {
      action: 'IDLE',
      progress: 0,
    };
  }

  if (employee.workState === 'SERVING') {
    return {
      action: 'SERVING',
      carryingProp: 'fries_box',
      progress: 100,
    };
  }

  if (employee.workState === 'RESTING') {
    return {
      action: 'IDLE',
      progress: 0,
    };
  }

  // IDLE, SEEKING_JOB, UNAVAILABLE
  return {
    action: 'IDLE',
    progress: 0,
  };
}

/**
 * Pure function: resolves the visual animation and action state of a Customer.
 */
export function resolveCustomerPresentationState({
  customer,
  movementStatus,
  isNearDestination = false,
}: CustomerResolverParams): CustomerPresentationState {
  if (customer.state === 'waiting') {
    if (movementStatus === 'MOVING' && !isNearDestination) {
      return { action: 'WALKING' };
    }
    return { action: 'WAITING' };
  }

  if (customer.state === 'eating') {
    if (movementStatus === 'MOVING' && !isNearDestination) {
      return { action: 'WALKING' };
    }
    return { 
      action: 'EATING',
      eatingProp: 'fries_box',
    };
  }

  // leaving or rage_quit
  return { action: 'WALKING' };
}

/**
 * Pure function: resolves the visual feedback and active animation state of a Production Station.
 */
export function resolveStationPresentationState(
  station: Station3DState
): StationPresentationState {
  if (!station.activeJob) {
    return {
      action: 'IDLE',
      progress: 0,
      assignedEmployeeId: station.assignedEmployeeId,
    };
  }

  const job = station.activeJob;
  const status = job.status;

  if (status === 'PREPARING') {
    return {
      action: 'PREPARING',
      activeJobId: job.id,
      recipeName: job.recipeName,
      progress: job.progress,
      assignedEmployeeId: station.assignedEmployeeId,
    };
  }

  if (status === 'COOKING') {
    return {
      action: 'COOKING',
      activeJobId: job.id,
      recipeName: job.recipeName,
      progress: job.progress,
      assignedEmployeeId: station.assignedEmployeeId,
    };
  }

  if (status === 'PACKING' || status === 'ASSEMBLING') {
    return {
      action: 'PACKING',
      activeJobId: job.id,
      recipeName: job.recipeName,
      progress: job.progress,
      assignedEmployeeId: station.assignedEmployeeId,
    };
  }

  if (status === 'READY') {
    return {
      action: 'READY',
      activeJobId: job.id,
      recipeName: job.recipeName,
      progress: 100,
      assignedEmployeeId: station.assignedEmployeeId,
    };
  }

  return {
    action: 'ACTIVE',
    activeJobId: job.id,
    recipeName: job.recipeName,
    progress: job.progress,
    assignedEmployeeId: station.assignedEmployeeId,
  };
}
