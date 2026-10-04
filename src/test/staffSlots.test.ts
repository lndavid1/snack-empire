import { describe, it, expect, beforeEach } from 'vitest';
import { StaffSlotService } from '../services/staffSlotService';
import { CANDIDATE_POOL, getDefaultStaffSlots } from '../data/staffSlots';
import { useGameStore } from '../store/gameStore';
import { StorageService } from '../services/storage';
import { mapEmployeesTo3D } from '../3d/bridge/gameStateBridge';
import { INITIAL_EMPLOYEES } from '../data/initialData';
import { STARTER_STATIONS } from '../data/equipment';
import type { StaffSlot, Employee, ProductionStation } from '../types/game';

describe('Phase 7: Staff Slot & Employee Capacity System', () => {

  describe('1. Slot Catalog and Default State', () => {
    it('initializes default starter slots in unlocked state for core roles', () => {
      const defaultSlots = getDefaultStaffSlots();
      
      const chefSlot1 = defaultSlots.find(s => s.id === 'slot_chef_01');
      const cashierSlot1 = defaultSlots.find(s => s.id === 'slot_cashier_01');
      const serverSlot1 = defaultSlots.find(s => s.id === 'slot_server_01');
      const chefSlot2 = defaultSlots.find(s => s.id === 'slot_chef_02');

      expect(chefSlot1).toBeDefined();
      expect(cashierSlot1).toBeDefined();
      expect(serverSlot1).toBeDefined();

      // Starter slots are not locked
      expect(chefSlot1?.status).not.toBe('LOCKED');
      expect(cashierSlot1?.status).not.toBe('LOCKED');
      expect(serverSlot1?.status).not.toBe('LOCKED');

      // Advanced slots start locked
      expect(chefSlot2?.status).toBe('LOCKED');
    });

    it('contains candidate pool with diverse archetypes and roles', () => {
      expect(CANDIDATE_POOL.length).toBeGreaterThan(4);
      const roles = CANDIDATE_POOL.map(c => StaffSlotService.normalizeRole(c.role));
      expect(roles).toContain('chef');
      expect(roles).toContain('cashier');
      expect(roles).toContain('server');
      expect(roles).toContain('cleaner');
    });
  });

  describe('2. Unlock Evaluation & Requirement Progress', () => {
    it('normalizes role names interchangeably for cook and chef', () => {
      expect(StaffSlotService.normalizeRole('cook')).toBe('chef');
      expect(StaffSlotService.normalizeRole('chef')).toBe('chef');
      expect(StaffSlotService.normalizeRole('CHEF')).toBe('chef');
      expect(StaffSlotService.normalizeRole('cashier')).toBe('cashier');
      expect(StaffSlotService.normalizeRole('server')).toBe('server');
      expect(StaffSlotService.normalizeRole('cleaner')).toBe('cleaner');
    });

    it('extracts current metric values from game state correctly', () => {
      const mockState = {
        level: 4,
        currentTierId: 'tier_2_stall', // tierNumber 2
        totalRevenueEarned: 2500,
        totalSalesCount: 45,
        reputation: 80,
        stations: [{ id: 's1', isOperational: true }, { id: 's2', isOperational: false }],
        equipment: [{ id: 'e1', condition: 100 }, { id: 'e2', condition: 0 }]
      };

      expect(StaffSlotService.getCurrentMetricValue('PLAYER_LEVEL', mockState)).toBe(4);
      expect(StaffSlotService.getCurrentMetricValue('RESTAURANT_LEVEL', mockState)).toBe(2);
      expect(StaffSlotService.getCurrentMetricValue('REVENUE', mockState)).toBe(2500);
      expect(StaffSlotService.getCurrentMetricValue('DAILY_ORDERS', mockState)).toBe(45);
      expect(StaffSlotService.getCurrentMetricValue('REPUTATION', mockState)).toBe(80);
      expect(StaffSlotService.getCurrentMetricValue('KITCHEN_STATIONS', mockState)).toBe(1);
      expect(StaffSlotService.getCurrentMetricValue('EQUIPMENT_COUNT', mockState)).toBe(1);
    });

    it('locks slot when any unlock requirement is unmet', () => {
      const slot: StaffSlot = {
        id: 'slot_chef_test',
        businessId: 'main_restaurant',
        name: 'Test Chef Slot',
        role: 'chef',
        status: 'LOCKED',
        tier: 2,
        unlockRequirements: [
          { type: 'PLAYER_LEVEL', value: 3, description: 'Đạt Level 3' },
          { type: 'DAILY_ORDERS', value: 20, description: 'Phục vụ 20 đơn' }
        ]
      };

      // Both unmet
      expect(StaffSlotService.isStaffSlotUnlocked(slot, { level: 1, totalSalesCount: 5 })).toBe(false);

      // Only one met
      expect(StaffSlotService.isStaffSlotUnlocked(slot, { level: 3, totalSalesCount: 15 })).toBe(false);

      // All met
      expect(StaffSlotService.isStaffSlotUnlocked(slot, { level: 3, totalSalesCount: 20 })).toBe(true);
    });

    it('provides accurate detailed progress checklist for slot requirements', () => {
      const slot: StaffSlot = {
        id: 'slot_test',
        businessId: 'main_restaurant',
        name: 'Test Slot',
        role: 'server',
        status: 'LOCKED',
        tier: 2,
        unlockRequirements: [
          { type: 'PLAYER_LEVEL', value: 5, description: 'Cấp 5' },
          { type: 'REVENUE', value: 1000, description: 'Doanh thu $1000' }
        ]
      };

      const progress = StaffSlotService.getStaffSlotUnlockProgress(slot, { level: 3, totalRevenueEarned: 1200 });
      expect(progress.length).toBe(2);
      expect(progress[0].met).toBe(false);
      expect(progress[0].current).toBe(3);
      expect(progress[0].target).toBe(5);

      expect(progress[1].met).toBe(true);
      expect(progress[1].current).toBe(1200);
      expect(progress[1].target).toBe(1000);
    });

    it('evaluates slot unlocks idempotently and never re-locks unlocked slots', () => {
      const slots: StaffSlot[] = [
        {
          id: 's_locked_1',
          businessId: 'main_restaurant',
          name: 'Locked 1',
          role: 'chef',
          status: 'LOCKED',
          tier: 1,
          unlockRequirements: [{ type: 'PLAYER_LEVEL', value: 2 }]
        },
        {
          id: 's_empty_1',
          businessId: 'main_restaurant',
          name: 'Empty 1',
          role: 'cashier',
          status: 'EMPTY',
          tier: 1,
          unlockRequirements: [{ type: 'PLAYER_LEVEL', value: 10 }] // Unmet, but already EMPTY!
        }
      ];

      // Player meets level 2
      const result1 = StaffSlotService.evaluateSlotUnlocks(slots, { level: 2 });
      expect(result1.newlyUnlocked.length).toBe(1);
      expect(result1.newlyUnlocked[0].id).toBe('s_locked_1');
      expect(result1.updatedSlots.find(s => s.id === 's_locked_1')?.status).toBe('EMPTY');
      expect(result1.updatedSlots.find(s => s.id === 's_empty_1')?.status).toBe('EMPTY');

      // Subsequent evaluation where player level drops or remains unchanged
      const result2 = StaffSlotService.evaluateSlotUnlocks(result1.updatedSlots, { level: 1 });
      expect(result2.newlyUnlocked.length).toBe(0);
      expect(result2.updatedSlots.find(s => s.id === 's_locked_1')?.status).toBe('EMPTY');
    });
  });

  describe('3. Staff Capacity & Bottleneck Detection', () => {
    it('computes role capacity metrics and utilization rate accurately', () => {
      const slots: StaffSlot[] = [
        { id: 's1', businessId: 'main_restaurant', name: 'Chef 1', role: 'chef', status: 'OCCUPIED', tier: 1 },
        { id: 's2', businessId: 'main_restaurant', name: 'Chef 2', role: 'chef', status: 'EMPTY', tier: 1 },
        { id: 's3', businessId: 'main_restaurant', name: 'Chef 3', role: 'chef', status: 'LOCKED', tier: 2 },
      ];

      const employees: Employee[] = [
        {
          id: 'e1',
          name: 'Chef One',
          role: 'cook',
          hired: true,
          workState: 'WORKING',
          avatar: '👨‍🍳',
          level: 1,
          speed: 1,
          quality: 1,
          salaryPerSec: 1,
          hireCost: 100,
          upgradeCost: 50,
          mood: 100,
          catchphrase: 'Ready to cook!'
        }
      ];

      const capacity = StaffSlotService.getStaffCapacityByRole(slots, employees, 'chef', 3);
      expect(capacity.totalSlots).toBe(3);
      expect(capacity.unlockedSlots).toBe(2);
      expect(capacity.occupiedSlots).toBe(1);
      expect(capacity.emptySlots).toBe(1);
      expect(capacity.lockedSlots).toBe(1);
      expect(capacity.utilizationRate).toBe(100);
      expect(capacity.hasWorkstationDeficit).toBe(false);
    });

    it('detects kitchen workstation deficit when occupied chefs exceed operational stations', () => {
      const slots: StaffSlot[] = [
        { id: 's1', businessId: 'main_restaurant', name: 'Chef 1', role: 'chef', status: 'OCCUPIED', tier: 1 },
        { id: 's2', businessId: 'main_restaurant', name: 'Chef 2', role: 'chef', status: 'OCCUPIED', tier: 1 },
        { id: 's3', businessId: 'main_restaurant', name: 'Chef 3', role: 'chef', status: 'OCCUPIED', tier: 2 },
      ];

      const employees: Employee[] = [
        { id: 'e1', name: 'Chef 1', role: 'cook', hired: true, workState: 'IDLE', avatar: '👨‍🍳', level: 1, speed: 1, quality: 1, salaryPerSec: 1, hireCost: 100, upgradeCost: 50, mood: 100, catchphrase: 'Cook 1' },
        { id: 'e2', name: 'Chef 2', role: 'cook', hired: true, workState: 'IDLE', avatar: '👨‍🍳', level: 1, speed: 1, quality: 1, salaryPerSec: 1, hireCost: 100, upgradeCost: 50, mood: 100, catchphrase: 'Cook 2' },
        { id: 'e3', name: 'Chef 3', role: 'cook', hired: true, workState: 'IDLE', avatar: '👨‍🍳', level: 1, speed: 1, quality: 1, salaryPerSec: 1, hireCost: 100, upgradeCost: 50, mood: 100, catchphrase: 'Cook 3' }
      ];

      // Only 2 operational kitchen stations, but 3 chefs
      const capacity = StaffSlotService.getStaffCapacityByRole(slots, employees, 'chef', 2);
      expect(capacity.hasWorkstationDeficit).toBe(true);
      expect(capacity.deficitCount).toBe(1);
    });

    it('calculates staff payroll summary accurately', () => {
      const employees: Employee[] = [
        { id: 'e1', name: 'Chef', role: 'cook', hired: true, salaryPerSec: 2.5, avatar: '👨‍🍳', level: 1, speed: 1, quality: 1, hireCost: 100, upgradeCost: 50, mood: 100, catchphrase: 'Chef ready' },
        { id: 'e2', name: 'Cashier', role: 'cashier', hired: true, salaryPerSec: 1.5, avatar: '👩‍💼', level: 1, speed: 1, quality: 1, hireCost: 100, upgradeCost: 50, mood: 100, catchphrase: 'Welcome' },
        { id: 'e3', name: 'Unhired', role: 'server', hired: false, salaryPerSec: 5.0, avatar: '🤵', level: 1, speed: 1, quality: 1, hireCost: 100, upgradeCost: 50, mood: 100, catchphrase: 'Waiting' },
      ];

      const payroll = StaffSlotService.calculateStaffPayroll(employees);
      expect(payroll.totalSalaryPerSec).toBe(4.0);
      expect(payroll.totalSalaryPerDay).toBe(240); // 4.0 * 60
      expect(payroll.byRole['chef'].count).toBe(1);
      expect(payroll.byRole['cashier'].count).toBe(1);
      expect(payroll.byRole['server']).toBeUndefined();
    });
  });

  describe('4. Hiring Rules & Candidate Assignment', () => {
    const testSlot: StaffSlot = {
      id: 'slot_cashier_test',
      businessId: 'main_restaurant',
      name: 'Cashier Slot',
      role: 'cashier',
      status: 'EMPTY',
      tier: 1
    };

    const cashierCandidate: Employee = {
      id: 'emp_c1',
      name: 'Mai',
      role: 'cashier',
      hired: false,
      avatar: '👩‍💼',
      level: 1,
      speed: 1,
      quality: 1,
      salaryPerSec: 1,
      hireCost: 100,
      upgradeCost: 50,
      mood: 100,
      catchphrase: 'Hello!'
    };

    it('allows hiring matching role candidate into empty slot', () => {
      const check = StaffSlotService.canHireForSlot(testSlot, cashierCandidate);
      expect(check.canHire).toBe(true);
    });

    it('rejects hiring if slot is locked', () => {
      const lockedSlot: StaffSlot = { ...testSlot, status: 'LOCKED' };
      const check = StaffSlotService.canHireForSlot(lockedSlot, cashierCandidate);
      expect(check.canHire).toBe(false);
      expect(check.reason).toContain('chưa được mở khóa');
    });

    it('rejects hiring if slot is occupied', () => {
      const occupiedSlot: StaffSlot = { ...testSlot, status: 'OCCUPIED', employeeId: 'emp_other' };
      const check = StaffSlotService.canHireForSlot(occupiedSlot, cashierCandidate);
      expect(check.canHire).toBe(false);
      expect(check.reason).toContain('đã có nhân viên');
    });

    it('rejects hiring if candidate role mismatches slot role', () => {
      const chefCandidate: Employee = { ...cashierCandidate, role: 'cook' };
      const check = StaffSlotService.canHireForSlot(testSlot, chefCandidate);
      expect(check.canHire).toBe(false);
      expect(check.reason).toContain('không khớp');
    });

    it('rejects hiring if candidate is already hired elsewhere', () => {
      const hiredCandidate: Employee = { ...cashierCandidate, hired: true };
      const check = StaffSlotService.canHireForSlot(testSlot, hiredCandidate);
      expect(check.canHire).toBe(false);
      expect(check.reason).toContain('đã được tuyển dụng');
    });
  });

  describe('5. Zustand Store Workflow Integration', () => {
    beforeEach(() => {
      useGameStore.setState({
        money: 5000,
        staffSlots: getDefaultStaffSlots().map(s => ({ ...s })),
        employees: [
          ...INITIAL_EMPLOYEES.map(e => ({ ...e })),
          ...CANDIDATE_POOL.map(c => ({ ...c }))
        ],
        stations: STARTER_STATIONS.map(s => ({ ...s, queue: [] })),
        customers: [],
        orders: [],
        productionJobs: [],
        employeeLogs: []
      });
    });

    it('recruits candidate into empty slot and transitions slot to OCCUPIED', () => {
      // Create or configure an EMPTY chef slot for recruitment
      useGameStore.setState(s => ({
        staffSlots: s.staffSlots.map(slot => 
          slot.id === 'slot_chef_02' ? { ...slot, status: 'EMPTY' as const, employeeId: undefined } : slot
        )
      }));

      const emptySlot = useGameStore.getState().staffSlots.find(s => s.id === 'slot_chef_02');
      expect(emptySlot).toBeDefined();
      expect(emptySlot?.status).toBe('EMPTY');

      const candidate = useGameStore.getState().employees.find(e => !e.hired && StaffSlotService.normalizeRole(e.role) === 'chef');
      expect(candidate).toBeDefined();

      if (!emptySlot || !candidate) return;

      const success = useGameStore.getState().hireEmployeeIntoSlot(emptySlot.id, candidate.id);
      expect(success).toBe(true);

      const afterState = useGameStore.getState();
      const hiredEmp = afterState.employees.find(e => e.id === candidate.id);
      const updatedSlot = afterState.staffSlots.find(s => s.id === emptySlot.id);

      expect(hiredEmp?.hired).toBe(true);
      expect(updatedSlot?.status).toBe('OCCUPIED');
      expect(updatedSlot?.employeeId).toBe(candidate.id);
    });

    it('fires employee, releasing slot to EMPTY without re-locking', () => {
      const store = useGameStore.getState();
      const occupiedChefSlot = store.staffSlots.find(s => s.id === 'slot_chef_01');
      expect(occupiedChefSlot?.status).toBe('OCCUPIED');
      const employeeId = occupiedChefSlot?.employeeId;
      expect(employeeId).toBeDefined();

      if (!employeeId) return;

      // Fire employee
      const fireSuccess = useGameStore.getState().fireEmployee(employeeId);
      expect(fireSuccess).toBe(true);

      const afterState = useGameStore.getState();
      const firedEmp = afterState.employees.find(e => e.id === employeeId);
      const releasedSlot = afterState.staffSlots.find(s => s.id === 'slot_chef_01');

      expect(firedEmp?.hired).toBe(false);
      expect(releasedSlot?.status).toBe('EMPTY');
      expect(releasedSlot?.employeeId).toBeUndefined();
    });

    it('enforces role capacity: legacy hireEmployee fails when all slots of role are occupied', () => {
      // Force all cashier slots to OCCUPIED
      useGameStore.setState(s => ({
        staffSlots: s.staffSlots.map(slot => 
          StaffSlotService.normalizeRole(slot.role) === 'cashier' 
            ? { ...slot, status: 'OCCUPIED' as const, employeeId: 'emp_cashier_linh' }
            : slot
        )
      }));

      // Candidate cashier tries to get hired via hireEmployee
      const candidateCashier = useGameStore.getState().employees.find(e => !e.hired && e.role === 'cashier');
      expect(candidateCashier).toBeDefined();

      if (candidateCashier) {
        const hired = useGameStore.getState().hireEmployee(candidateCashier.id);
        expect(hired).toBe(false);
      }
    });

    it('triggers slot unlock check when requirements are fulfilled', () => {
      // Find a locked slot
      const lockedSlot = useGameStore.getState().staffSlots.find(s => s.status === 'LOCKED');
      expect(lockedSlot).toBeDefined();

      // Boost player stats to fulfill all requirements
      useGameStore.setState({
        level: 10,
        currentTierId: 'tier_3_shop',
        totalSalesCount: 500,
        totalRevenueEarned: 50000,
        reputation: 100,
        stations: [
          { id: 's1', isOperational: true, stationType: 'prep' } as any,
          { id: 's2', isOperational: true, stationType: 'fryer' } as any,
          { id: 's3', isOperational: true, stationType: 'packing' } as any
        ]
      });

      useGameStore.getState().checkStaffSlotUnlocks();

      const unlockedSlot = useGameStore.getState().staffSlots.find(s => s.id === lockedSlot?.id);
      expect(unlockedSlot?.status).toBe('EMPTY');
    });
  });

  describe('6. Save Schema Migration & 3D Bridge Lifecycle', () => {
    it('migrates legacy save data without staffSlots into valid slots', () => {
      const legacySave = {
        version: 2,
        timestamp: Date.now(),
        money: 1000,
        xp: 500,
        hiredEmployees: {
          emp_cook_bob: { hired: true, level: 1, mood: 100 },
          emp_cashier_linh: { hired: true, level: 1, mood: 100 },
          emp_server_hoa: { hired: true, level: 1, mood: 100 }
        }
      } as any;

      const loaded = StorageService.migrate(legacySave);
      expect(loaded).toBeDefined();
      expect(loaded?.staffSlots).toBeDefined();
      expect(loaded!.staffSlots!.length).toBeGreaterThanOrEqual(6);

      const bobSlot = loaded!.staffSlots!.find(s => s.employeeId === 'emp_cook_bob');
      expect(bobSlot).toBeDefined();
      expect(bobSlot?.status).toBe('OCCUPIED');
    });

    it('reflects employee hiring and firing in 3D bridge representation', () => {
      const mockStations: ProductionStation[] = [
        { id: 'st_prep', stationType: 'prep', name: 'Bàn sơ chế', equipmentId: 'eq_prep', assignedEmployeeId: undefined, queue: [], isOperational: true, capacity: 3 }
      ];

      const testEmp: Employee = {
        id: 'emp_3d_test',
        name: '3D Test Employee',
        role: 'cook',
        hired: false,
        workState: 'IDLE',
        avatar: '👨‍🍳',
        level: 1,
        speed: 1,
        quality: 1,
        salaryPerSec: 1,
        hireCost: 100,
        upgradeCost: 50,
        mood: 100,
        catchphrase: '3D employee ready'
      };

      // When unhired: not present in 3D
      let employee3Ds = mapEmployeesTo3D([testEmp], mockStations);
      expect(employee3Ds.find(e => e.id === 'emp_3d_test')).toBeUndefined();

      // When hired: appears in 3D
      const hiredEmp = { ...testEmp, hired: true };
      employee3Ds = mapEmployeesTo3D([hiredEmp], mockStations);
      expect(employee3Ds.find(e => e.id === 'emp_3d_test')).toBeDefined();

      // When fired: disappears from 3D
      const firedEmp = { ...hiredEmp, hired: false };
      employee3Ds = mapEmployeesTo3D([firedEmp], mockStations);
      expect(employee3Ds.find(e => e.id === 'emp_3d_test')).toBeUndefined();
    });
  });
});
