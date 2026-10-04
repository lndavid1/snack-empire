import { 
  StaffSlot, 
  StaffSlotRequirementType, 
  StaffCapacity, 
  Employee, 
  EmployeeRole 
} from '../types/game';
import { STORE_TIERS } from '../data/initialData';
import { DINING_TABLES_LAYOUT } from '../3d/config/restaurantLayout';

export const StaffSlotService = {
  /**
   * Normalizes roles so 'cook' and 'chef' are treated as identical.
   */
  normalizeRole(role: EmployeeRole | string): 'chef' | 'cashier' | 'server' | 'cleaner' | string {
    const lower = role.toLowerCase();
    if (lower === 'cook' || lower === 'chef') return 'chef';
    return lower;
  },

  /**
   * Extracts current numerical progress for a requirement type from game state.
   */
  getCurrentMetricValue(type: StaffSlotRequirementType, gameState: any): number {
    switch (type) {
      case 'PLAYER_LEVEL':
        return gameState.level || 1;
      case 'RESTAURANT_LEVEL': {
        const tier = STORE_TIERS.find(t => t.id === gameState.currentTierId);
        return tier?.tierNumber || 1;
      }
      case 'REVENUE':
        return gameState.totalRevenueEarned || 0;
      case 'DAILY_ORDERS':
        return gameState.totalSalesCount || 0;
      case 'TABLE_COUNT':
        return DINING_TABLES_LAYOUT.length || 0;
      case 'KITCHEN_STATIONS':
        return Array.isArray(gameState.stations) 
          ? gameState.stations.filter((s: any) => s.isOperational).length 
          : 0;
      case 'EQUIPMENT_COUNT':
        return Array.isArray(gameState.equipment)
          ? gameState.equipment.filter((e: any) => e.condition > 0).length
          : 0;
      case 'REPUTATION':
        return gameState.reputation || 0;
      default:
        return 0;
    }
  },

  /**
   * Evaluates if a single StaffSlot has all its unlock requirements satisfied.
   */
  isStaffSlotUnlocked(slot: StaffSlot, gameState: any): boolean {
    if (slot.status !== 'LOCKED') return true;
    if (!slot.unlockRequirements || slot.unlockRequirements.length === 0) return true;

    for (const req of slot.unlockRequirements) {
      const current = this.getCurrentMetricValue(req.type, gameState);
      if (current < req.value) {
        return false;
      }
    }

    return true;
  },

  /**
   * Returns a detailed checklist of unlock requirements with current vs target metrics.
   */
  getStaffSlotUnlockProgress(
    slot: StaffSlot, 
    gameState: any
  ): Array<{ type: StaffSlotRequirementType; met: boolean; current: number; target: number; label: string }> {
    if (!slot.unlockRequirements || slot.unlockRequirements.length === 0) {
      return [];
    }

    return slot.unlockRequirements.map(req => {
      const current = this.getCurrentMetricValue(req.type, gameState);
      const met = current >= req.value;
      const label = req.description || `${req.type}: ${current}/${req.value}`;
      return {
        type: req.type,
        met,
        current,
        target: req.value,
        label
      };
    });
  },

  /**
   * Evaluates a list of slots against gameState.
   * If a LOCKED slot meets all requirements, transitions to EMPTY.
   * Never re-locks an unlocked slot. Idempotent.
   */
  evaluateSlotUnlocks(
    slots: StaffSlot[], 
    gameState: any
  ): { updatedSlots: StaffSlot[]; newlyUnlocked: StaffSlot[] } {
    const newlyUnlocked: StaffSlot[] = [];
    const updatedSlots = slots.map(slot => {
      if (slot.status === 'LOCKED' && this.isStaffSlotUnlocked(slot, gameState)) {
        const unlockedSlot: StaffSlot = {
          ...slot,
          status: 'EMPTY',
          unlockedAt: Date.now()
        };
        newlyUnlocked.push(unlockedSlot);
        return unlockedSlot;
      }
      return slot;
    });

    return { updatedSlots, newlyUnlocked };
  },

  /**
   * Computes capacity metrics for a given role.
   */
  getStaffCapacityByRole(
    slots: StaffSlot[], 
    employees: Employee[], 
    role: EmployeeRole | string,
    kitchenStationsCount = 3
  ): StaffCapacity {
    const normRole = this.normalizeRole(role);
    const roleSlots = slots.filter(s => this.normalizeRole(s.role) === normRole);
    const hiredRoleEmployees = employees.filter(e => e.hired && this.normalizeRole(e.role) === normRole);

    const totalSlots = roleSlots.length;
    const unlockedSlots = roleSlots.filter(s => s.status !== 'LOCKED').length;
    const occupiedSlots = roleSlots.filter(s => s.status === 'OCCUPIED').length;
    const emptySlots = roleSlots.filter(s => s.status === 'EMPTY').length;
    const lockedSlots = roleSlots.filter(s => s.status === 'LOCKED').length;

    // Staff utilization: % of staff currently in active duty (WORKING or SERVING)
    let utilizationRate = 0;
    if (hiredRoleEmployees.length > 0) {
      const activeCount = hiredRoleEmployees.filter(e => e.workState === 'WORKING' || e.workState === 'SERVING').length;
      utilizationRate = Math.round((activeCount / hiredRoleEmployees.length) * 100);
    }

    // Workstation bottleneck check for chefs:
    let hasWorkstationDeficit = false;
    let deficitCount = 0;
    if (normRole === 'chef') {
      if (occupiedSlots > kitchenStationsCount) {
        hasWorkstationDeficit = true;
        deficitCount = occupiedSlots - kitchenStationsCount;
      }
    }

    return {
      role: normRole as EmployeeRole,
      totalSlots,
      unlockedSlots,
      occupiedSlots,
      emptySlots,
      lockedSlots,
      utilizationRate,
      hasWorkstationDeficit,
      deficitCount
    };
  },

  /**
   * Verifies if a candidate employee can be hired into a specific slot.
   */
  canHireForSlot(
    slot: StaffSlot, 
    employee: Employee
  ): { canHire: boolean; reason?: string } {
    if (slot.status === 'LOCKED') {
      return { canHire: false, reason: 'Vị trí này chưa được mở khóa!' };
    }
    if (slot.status === 'OCCUPIED') {
      return { canHire: false, reason: 'Vị trí này đã có nhân viên đảm nhiệm!' };
    }
    if (this.normalizeRole(slot.role) !== this.normalizeRole(employee.role)) {
      return { canHire: false, reason: `Vai trò nhân viên (${employee.role}) không khớp với vị trí (${slot.role})!` };
    }
    if (employee.hired) {
      return { canHire: false, reason: 'Nhân viên này đã được tuyển dụng vào nhà hàng!' };
    }

    return { canHire: true };
  },

  /**
   * Calculates total staff payroll summary (per second and per day).
   */
  calculateStaffPayroll(employees: Employee[]): {
    totalSalaryPerSec: number;
    totalSalaryPerDay: number;
    byRole: Record<string, { count: number; salaryPerSec: number }>;
  } {
    const hired = employees.filter(e => e.hired);
    const byRole: Record<string, { count: number; salaryPerSec: number }> = {};
    let totalSalaryPerSec = 0;

    for (const emp of hired) {
      const role = this.normalizeRole(emp.role);
      const sal = emp.salaryPerSec || 0.5;
      totalSalaryPerSec += sal;

      if (!byRole[role]) {
        byRole[role] = { count: 0, salaryPerSec: 0 };
      }
      byRole[role].count += 1;
      byRole[role].salaryPerSec += sal;
    }

    // 1 game day ≈ 60 simulation seconds
    const totalSalaryPerDay = Math.round(totalSalaryPerSec * 60 * 10) / 10;

    return {
      totalSalaryPerSec: Math.round(totalSalaryPerSec * 100) / 100,
      totalSalaryPerDay,
      byRole
    };
  }
};
