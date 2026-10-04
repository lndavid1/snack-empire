import { 
  Employee, 
  ProductionJob, 
  ProductionStation, 
  Customer, 
  Order, 
  EmployeeTask, 
  EmployeeWorkState 
} from '../types/game';

export const EmployeeWorkflowService = {
  // 1. Stamina performance multiplier
  getStaminaPerformanceMultiplier(stamina = 100): number {
    if (stamina >= 70) return 1.0;
    if (stamina >= 40) return 0.85;
    if (stamina >= 20) return 0.70;
    if (stamina > 0) return 0.40;
    return 0.0;
  },

  // 2. Stamina update with strict bounds [0, 100]
  updateStamina(
    currentStamina = 100, 
    isWorking: boolean, 
    deltaSeconds = 1, 
    archetype?: string
  ): number {
    let rate = isWorking ? -0.5 : 1.5;
    if (isWorking && archetype === 'HARDWORKER') {
      rate *= 0.75;
    }
    const next = currentStamina + rate * deltaSeconds;
    return Math.min(100, Math.max(0, Math.round(next * 100) / 100));
  },

  // 3. Archetype modifiers
  getEffectiveSpeed(employee: Employee): number {
    let multiplier = 1.0;
    if (employee.archetype === 'FAST') multiplier += 0.15;
    if (employee.archetype === 'QUALITY') multiplier -= 0.05;
    const speedSkill = employee.skills?.speed ?? employee.speed;
    return Math.max(5, Math.round((speedSkill * multiplier) * 10) / 10);
  },

  getEffectiveQuality(employee: Employee): number {
    let multiplier = 1.0;
    if (employee.archetype === 'QUALITY') multiplier += 0.20;
    if (employee.archetype === 'FAST') multiplier -= 0.05;
    const qualitySkill = employee.skills?.quality ?? employee.quality;
    return Math.max(5, Math.round(qualitySkill * multiplier));
  },

  getEffectiveService(employee: Employee): number {
    let multiplier = 1.0;
    if (employee.archetype === 'SERVICE') multiplier += 0.25;
    const serviceSkill = employee.skills?.service ?? 50;
    return Math.max(5, Math.round(serviceSkill * multiplier));
  },

  // 4. Mistake check based on accuracy, stamina and equipment condition
  checkForMistake(employee: Employee, equipCondition: number): boolean {
    const accuracy = employee.skills?.accuracy ?? 60;
    const stamina = employee.stamina ?? 100;

    // High stamina and normal accuracy almost never make mistakes
    if (stamina >= 50 && accuracy >= 50 && equipCondition >= 50) {
      return false;
    }

    // Risk factors
    let risk = 0;
    if (stamina < 30) risk += 0.04;
    if (accuracy < 40) risk += 0.03;
    if (equipCondition < 40) risk += 0.03;

    return Math.random() < Math.min(0.10, risk);
  },

  // 5. Priority scoring for production jobs
  getProductionPriority(
    job: ProductionJob,
    customer?: Customer,
    queueIndex = 0
  ): number {
    let score = 100 - queueIndex * 5;

    if (customer && customer.state === 'waiting') {
      const maxPatience = customer.maxPatience || 20;
      const patience = customer.patience ?? customer.currentWait ?? 20;
      const patienceRatio = patience / maxPatience;

      // Emergency: customer about to rage quit!
      if (patienceRatio <= 0.25) {
        score += 250;
      } else if (patienceRatio <= 0.5) {
        score += 100;
      }

      // Waiting time bonus
      score += (customer.waitingTime || 0) * 3;
    }

    return score;
  },

  // 6. Priority scoring for service tasks
  getServicePriority(
    order: Order,
    customer?: Customer
  ): number {
    let score = 150;

    if (customer && customer.state === 'waiting') {
      const maxPatience = customer.maxPatience || 20;
      const patience = customer.patience ?? customer.currentWait ?? 20;
      const patienceRatio = patience / maxPatience;

      if (patienceRatio <= 0.25) {
        score += 300;
      } else if (patienceRatio <= 0.5) {
        score += 150;
      }

      score += (customer.waitingTime || 0) * 4;
    }

    return score;
  },

  // 7. Check if employee is compatible with station
  canEmployeeWorkAtStation(employee: Employee, station: ProductionStation | string): boolean {
    if (!employee.hired) return false;
    const stationType = typeof station === 'string' ? station : station.stationType;
    const stationId = typeof station === 'string' ? undefined : station.id;
    // If employee is assigned to a specific station, they only work at that station
    if (employee.assignedStationId && stationId) {
      return employee.assignedStationId === stationId;
    }
    // Unassigned cooks and chefs can work at kitchen stations (prep, fryer, grill, oven, assembly, packing)
    if (employee.role === 'cook' || employee.role === 'chef') {
      return ['prep', 'fryer', 'grill', 'oven', 'assembly', 'packing'].includes(stationType);
    }
    if (employee.role === 'barista') {
      return ['beverage'].includes(stationType);
    }
    return false;
  },

  // 8. Check if employee is a kitchen worker (cook/chef/barista)
  isCook(employee: Employee): boolean {
    if (!employee.hired) return false;
    return employee.role === 'cook' || employee.role === 'chef';
  },

  // 9. Check if employee is a service worker (cashier/server/shipper/manager)
  isServiceWorker(employee: Employee): boolean {
    if (!employee.hired) return false;
    return ['cashier', 'server', 'shipper', 'manager'].includes(employee.role);
  },

  // 10. Dedicated role checkers
  isServer(employee: Employee): boolean {
    if (!employee.hired) return false;
    return employee.role === 'server';
  },

  isCashier(employee: Employee): boolean {
    if (!employee.hired) return false;
    return employee.role === 'cashier' || employee.role === 'manager';
  }
};
