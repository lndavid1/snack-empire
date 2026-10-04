import { describe, it, expect } from 'vitest';
import { 
  mapStationsTo3D, 
  mapEmployeesTo3D, 
  mapCustomersTo3D, 
  mapReadyItemsTo3D, 
  getRestaurant3DState 
} from '../3d/bridge/gameStateBridge';
import { RESTAURANT_LAYOUT } from '../3d/config/restaurantLayout';
import type { 
  ProductionStation, 
  Equipment, 
  ProductionJob, 
  Employee, 
  Customer, 
  FoodItem 
} from '../types/game';

describe('Phase 6A: Game State Bridge Unit Tests', () => {
  const mockEquipment: Equipment[] = [
    {
      id: 'equip_knife_set',
      name: 'Bộ Dao',
      category: 'prep',
      tier: 1,
      purchasePrice: 100,
      upgradeCost: 50,
      condition: 85,
      efficiency: 1.0,
      speedMultiplier: 1.0,
      qualityMultiplier: 1.0,
      capacity: 1,
      unlocked: true,
    },
    {
      id: 'equip_deep_fryer',
      name: 'Bếp Chiên Nhúng',
      category: 'fryer',
      tier: 1,
      purchasePrice: 200,
      upgradeCost: 80,
      condition: 40, // slightly worn
      efficiency: 1.0,
      speedMultiplier: 1.0,
      qualityMultiplier: 1.0,
      capacity: 1,
      unlocked: true,
    },
  ];

  const mockStations: ProductionStation[] = [
    {
      id: 'station_prep_table',
      name: 'Bàn Sơ Chế',
      stationType: 'prep',
      equipmentId: 'equip_knife_set',
      assignedEmployeeId: 'emp_cook_bob',
      activeJobId: 'job_prep',
      capacity: 1,
      isOperational: true,
      queue: ['job_prep'],
    },
    {
      id: 'station_fryer',
      name: 'Bếp Chiên',
      stationType: 'fryer',
      equipmentId: 'equip_deep_fryer',
      capacity: 1,
      isOperational: true,
      queue: [],
    },
  ];

  const mockJobs: ProductionJob[] = [
    {
      id: 'job_prep',
      orderId: 'c1',
      recipeId: 'recipe_french_fries',
      stationId: 'station_prep_table',
      status: 'PREPARING',
      currentStepIndex: 0,
      progress: 45,
      startedAt: Date.now(),
    },
    {
      id: 'job_ready_fries',
      orderId: 'c2',
      recipeId: 'recipe_french_fries',
      stationId: 'station_packing',
      status: 'READY',
      currentStepIndex: 2,
      progress: 100,
      readyAt: Date.now() - 5000,
      freshness: 98,
      temperature: 92,
    },
  ];

  const mockEmployees: Employee[] = [
    {
      id: 'emp_cook_bob',
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
      catchphrase: 'Cooking!',
      assignedStationId: 'station_prep_table',
      workState: 'WORKING',
      stamina: 80,
      maxStamina: 100,
      archetype: 'FAST',
    },
    {
      id: 'emp_cashier_linh',
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
      catchphrase: 'Hello!',
      workState: 'SERVING',
      stamina: 90,
      maxStamina: 100,
      archetype: 'SERVICE',
    },
    {
      id: 'emp_resting_duy',
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
      catchphrase: 'Sleeping',
      workState: 'RESTING',
      stamina: 30,
      maxStamina: 100,
      archetype: 'BALANCED',
    },
  ];

  const mockFoods: FoodItem[] = [
    {
      id: 'food_fries',
      name: 'Khoai Tây Chiên Giòn',
      category: 'fastfood',
      icon: '🍟',
      description: 'Nóng giòn',
      costToUnlock: 0,
      isUnlocked: true,
      basePrepTime: 5,
      baseCost: 2,
      sellingPrice: 15,
      level: 1,
      upgradeCost: 50,
      popularity: 80,
      ingredients: [],
      memeQuote: 'Yum!',
    },
  ];

  const mockCustomers: Customer[] = [
    {
      id: 'c1',
      name: 'Khách A',
      avatar: '😊',
      archetype: 'student',
      budget: 50,
      patience: 25,
      maxPatience: 30,
      waitingTime: 5,
      mood: 'HAPPY',
      favoriteFoodId: 'food_fries',
      orderedFoodId: 'food_fries',
      state: 'waiting',
      satisfaction: 4,
      quote: 'Waiting',
    },
    {
      id: 'c2',
      name: 'Khách B',
      avatar: '😡',
      archetype: 'vip',
      budget: 100,
      patience: 2,
      maxPatience: 20,
      waitingTime: 18,
      mood: 'ANGRY',
      favoriteFoodId: 'food_fries',
      orderedFoodId: 'food_fries',
      state: 'waiting',
      satisfaction: 1,
      quote: 'Too slow',
    },
  ];

  it('maps stations to 3D with correct positions, active job data and equipment condition', () => {
    const mapped = mapStationsTo3D(mockStations, mockEquipment, mockJobs, mockEmployees);
    expect(mapped).toHaveLength(2);

    const prep = mapped.find(s => s.id === 'station_prep_table')!;
    expect(prep.stationType).toBe('prep');
    expect(prep.position).toEqual(RESTAURANT_LAYOUT.stations.prep.position);
    expect(prep.equipmentCondition).toBe(85);
    expect(prep.assignedEmployeeName).toBe('Bob');
    expect(prep.activeJob).toBeDefined();
    expect(prep.activeJob?.recipeName).toBe('Khoai Tây Chiên Giòn');
    expect(prep.activeJob?.status).toBe('PREPARING');
    expect(prep.activeJob?.progress).toBe(45);

    const fryer = mapped.find(s => s.id === 'station_fryer')!;
    expect(fryer.equipmentCondition).toBe(40);
    expect(fryer.activeJob).toBeUndefined();
  });

  it('maps employee positions based on work state and station assignment', () => {
    const mapped = mapEmployeesTo3D(mockEmployees, mockStations);
    expect(mapped).toHaveLength(3);

    // Working Cook Bob should be near Prep Table worker offset
    const bob = mapped.find(e => e.id === 'emp_cook_bob')!;
    const expectedPrepPos = [
      RESTAURANT_LAYOUT.stations.prep.position[0] + RESTAURANT_LAYOUT.stations.prep.workerOffset[0],
      RESTAURANT_LAYOUT.stations.prep.position[1] + RESTAURANT_LAYOUT.stations.prep.workerOffset[1],
      RESTAURANT_LAYOUT.stations.prep.position[2] + RESTAURANT_LAYOUT.stations.prep.workerOffset[2],
    ];
    expect(bob.targetPosition).toEqual(expectedPrepPos);
    expect(bob.workState).toBe('WORKING');

    // Serving Cashier Linh should be at Service Counter cashier position
    const linh = mapped.find(e => e.id === 'emp_cashier_linh')!;
    expect(linh.targetPosition).toEqual(RESTAURANT_LAYOUT.serviceCounter.cashierPosition);
    expect(linh.workState).toBe('SERVING');

    // Resting Cook Duy should be in Rest Area
    const duy = mapped.find(e => e.id === 'emp_resting_duy')!;
    expect(duy.targetPosition[0]).toBeCloseTo(RESTAURANT_LAYOUT.staff.restArea[0] + 1.2);
    expect(duy.workState).toBe('RESTING');
  });

  it('maps customer queue positions, mood, and patience percentages correctly', () => {
    const mapped = mapCustomersTo3D(mockCustomers, mockFoods);
    expect(mapped).toHaveLength(2);

    const custA = mapped[0];
    expect(custA.mood).toBe('HAPPY');
    expect(custA.orderedFoodName).toBe('Khoai Tây Chiên Giòn');
    expect(custA.patiencePercent).toBeCloseTo((25 / 30) * 100);
    expect(custA.targetPosition).toEqual(RESTAURANT_LAYOUT.customer.queueSlots[0]);

    const custB = mapped[1];
    expect(custB.mood).toBe('ANGRY');
    expect(custB.patiencePercent).toBeCloseTo((2 / 20) * 100);
    expect(custB.targetPosition).toEqual(RESTAURANT_LAYOUT.customer.queueSlots[1]);
  });

  it('maps ready production jobs to 3D service buffet platter', () => {
    const readyItems = mapReadyItemsTo3D(mockJobs);
    expect(readyItems).toHaveLength(1);
    expect(readyItems[0].jobId).toBe('job_ready_fries');
    expect(readyItems[0].recipeName).toBe('Khoai Tây Chiên Giòn');
    expect(readyItems[0].position[1]).toBeGreaterThan(0.8); // above counter
  });

  it('creates complete Restaurant3DState snapshot without mutating original store state', () => {
    const fullState = getRestaurant3DState({
      stations: mockStations,
      equipment: mockEquipment,
      productionJobs: mockJobs,
      employees: mockEmployees,
      customers: mockCustomers,
      foods: mockFoods,
    });

    expect(fullState.stations).toHaveLength(2);
    expect(fullState.employees).toHaveLength(3);
    expect(fullState.customers).toHaveLength(2);
    expect(fullState.readyItems).toHaveLength(1);

    // Ensure immutability: mockStations unaffected
    expect(mockStations[0].activeJobId).toBe('job_prep');
  });
});
