import { describe, it, expect, beforeEach } from 'vitest';
import { EmployeeWorkflowService } from '../services/employeeWorkflow';
import { useGameStore } from '../store/gameStore';
import type { Employee, ProductionStation, ProductionJob, Customer, Order } from '../types/game';

describe('Phase 5: Employee Workflow Service Unit Tests', () => {
  it('calculates stamina performance multiplier accurately', () => {
    expect(EmployeeWorkflowService.getStaminaPerformanceMultiplier(100)).toBe(1.0);
    expect(EmployeeWorkflowService.getStaminaPerformanceMultiplier(70)).toBe(1.0);
    expect(EmployeeWorkflowService.getStaminaPerformanceMultiplier(69)).toBe(0.85);
    expect(EmployeeWorkflowService.getStaminaPerformanceMultiplier(40)).toBe(0.85);
    expect(EmployeeWorkflowService.getStaminaPerformanceMultiplier(39)).toBe(0.70);
    expect(EmployeeWorkflowService.getStaminaPerformanceMultiplier(20)).toBe(0.70);
    expect(EmployeeWorkflowService.getStaminaPerformanceMultiplier(19)).toBe(0.40);
    expect(EmployeeWorkflowService.getStaminaPerformanceMultiplier(1)).toBe(0.40);
    expect(EmployeeWorkflowService.getStaminaPerformanceMultiplier(0)).toBe(0.0);
  });

  it('drains and recovers stamina properly with archetype perk', () => {
    // Normal worker working for 10s: -0.5/s -> 100 - 5 = 95
    const drained = EmployeeWorkflowService.updateStamina(100, true, 10, 'BALANCED');
    expect(drained).toBe(95);

    // Hardworker working for 10s: -0.5 * 0.75 * 10 = -3.75 -> 100 - 3.75 = 96.25
    const hardworkerDrained = EmployeeWorkflowService.updateStamina(100, true, 10, 'HARDWORKER');
    expect(hardworkerDrained).toBe(96.25);

    // Resting worker recovering for 10s: +1.5/s -> 20 + 15 = 35
    const recovered = EmployeeWorkflowService.updateStamina(20, false, 10, 'BALANCED');
    expect(recovered).toBe(35);

    // Clamped at maxStamina 100
    const clampedMax = EmployeeWorkflowService.updateStamina(95, false, 10, 'BALANCED');
    expect(clampedMax).toBe(100);

    // Clamped at min 0
    const clampedMin = EmployeeWorkflowService.updateStamina(2, true, 10, 'BALANCED');
    expect(clampedMin).toBe(0);
  });

  it('applies archetype speed, quality, and service bonuses', () => {
    const fastEmp: Employee = {
      id: 'e1',
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
      catchphrase: 'Fast!',
      archetype: 'FAST',
      stamina: 100,
      skills: { speed: 10, quality: 10, accuracy: 10, service: 10, stamina: 10 }
    };

    // FAST archetype gets +15% speed
    expect(EmployeeWorkflowService.getEffectiveSpeed(fastEmp)).toBeCloseTo(11.5);

    const qualityEmp: Employee = { ...fastEmp, archetype: 'QUALITY' };
    // QUALITY archetype gets +20% quality (10 * 1.20 = 12)
    expect(EmployeeWorkflowService.getEffectiveQuality(qualityEmp)).toBe(12);

    const serviceEmp: Employee = { ...fastEmp, archetype: 'SERVICE' };
    // SERVICE archetype gets +25% service (10 * 1.25 = 12.5 -> 13)
    expect(EmployeeWorkflowService.getEffectiveService(serviceEmp)).toBe(13);
  });

  it('determines role capabilities correctly', () => {
    const cook: Employee = {
      id: 'c1',
      name: 'Linh',
      role: 'cook',
      avatar: '👩‍🍳',
      level: 1,
      speed: 10,
      quality: 10,
      salaryPerSec: 1,
      hired: true,
      hireCost: 100,
      upgradeCost: 50,
      mood: 100,
      catchphrase: 'Cook!',
      stamina: 100
    };

    const cashier: Employee = {
      id: 'k1',
      name: 'Lan',
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
      catchphrase: 'Cashier!',
      stamina: 100
    };

    expect(EmployeeWorkflowService.canEmployeeWorkAtStation(cook, 'prep')).toBe(true);
    expect(EmployeeWorkflowService.canEmployeeWorkAtStation(cook, 'fryer')).toBe(true);
    expect(EmployeeWorkflowService.canEmployeeWorkAtStation(cashier, 'fryer')).toBe(false);

    expect(EmployeeWorkflowService.isServiceWorker(cashier)).toBe(true);
    expect(EmployeeWorkflowService.isServiceWorker(cook)).toBe(false);
  });

  it('prioritizes jobs where waiting customer is close to rage quitting', () => {
    const normalJob: ProductionJob = {
      id: 'j_normal',
      orderId: 'c_normal',
      recipeId: 'recipe_french_fries',
      stationId: 'st1',
      status: 'QUEUED',
      currentStepIndex: 0,
      progress: 0,
      startedAt: 1000
    };

    const urgentJob: ProductionJob = {
      id: 'j_urgent',
      orderId: 'c_urgent',
      recipeId: 'recipe_french_fries',
      stationId: 'st1',
      status: 'QUEUED',
      currentStepIndex: 0,
      progress: 0,
      startedAt: 1000
    };

    const normalCustomer: Customer = {
      id: 'c_normal',
      name: 'Normal',
      avatar: '😊',
      archetype: 'student',
      budget: 50,
      favoriteFoodId: 'food_fries',
      maxPatience: 30,
      patience: 25, // 83% patience left
      waitingTime: 5,
      orderedFoodId: 'food_fries',
      orderId: 'o1',
      state: 'waiting',
      satisfaction: 4,
      quote: 'Waiting'
    };

    const angryCustomer: Customer = {
      id: 'c_urgent',
      name: 'Angry',
      avatar: '😡',
      archetype: 'foodie',
      budget: 50,
      favoriteFoodId: 'food_fries',
      maxPatience: 30,
      patience: 3, // 10% patience left -> URGENT
      waitingTime: 27,
      orderedFoodId: 'food_fries',
      orderId: 'o2',
      state: 'waiting',
      satisfaction: 1,
      quote: 'Hurry up!'
    };

    const normalPrio = EmployeeWorkflowService.getProductionPriority(normalJob, normalCustomer);
    const urgentPrio = EmployeeWorkflowService.getProductionPriority(urgentJob, angryCustomer);

    // Urgent customer job receives massive priority boost
    expect(urgentPrio).toBeGreaterThan(normalPrio + 200);
  });
});

describe('Phase 5: Store Integration & Simulation Tests', () => {
  beforeEach(() => {
    useGameStore.setState({
      money: 1000,
      reputation: 60,
      totalSalesCount: 0,
      totalRevenueEarned: 0,
      totalTipsEarned: 0,
      totalCustomersServed: 0,
      customers: [],
      orders: [],
      productionJobs: [],
      employeeLogs: []
    });
  });

  it('transitions exhausted employee from WORKING to RESTING and recovers to IDLE', () => {
    const testCook: Employee = {
      id: 'emp_exhausted',
      name: 'Mệt Mỏi',
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
      catchphrase: 'Cần nghỉ!',
      assignedStationId: 'station_prep_table',
      stamina: 15, // <= 20 threshold
      maxStamina: 100,
      workState: 'WORKING'
    };

    useGameStore.setState({
      employees: [testCook],
      stations: [
        {
          id: 'station_prep_table',
          name: 'Bàn Sơ Chế',
          stationType: 'prep',
          equipmentId: 'equip_knife_set',
          assignedEmployeeId: 'emp_exhausted',
          capacity: 1,
          isOperational: true,
          queue: []
        }
      ]
    });

    // Run employee process tick
    useGameStore.getState().processEmployees(1);

    let emp = useGameStore.getState().employees.find(e => e.id === 'emp_exhausted')!;
    // Should transition to RESTING
    expect(emp.workState).toBe('RESTING');
    expect(emp.currentLocation).toBe('REST_AREA');

    // Simulate resting recovery until >= 80
    useGameStore.setState(state => ({
      employees: state.employees.map(e => e.id === 'emp_exhausted' ? { ...e, stamina: 82 } : e)
    }));

    useGameStore.getState().processEmployees(1);

    emp = useGameStore.getState().employees.find(e => e.id === 'emp_exhausted')!;
    // Should wake up and be IDLE
    expect(emp.workState).toBe('IDLE');
  });

  it('cashier automatically serves ready food to waiting customer and records log', () => {
    const cashier: Employee = {
      id: 'emp_cashier_linh',
      name: 'Linh Thu Ngân',
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
      catchphrase: 'Xin chào quý khách!',
      stamina: 100,
      maxStamina: 100,
      workState: 'IDLE'
    };

    const customer: Customer = {
      id: 'cust_waiting',
      name: 'Bác Ba',
      avatar: '👴',
      archetype: 'office',
      budget: 50,
      favoriteFoodId: 'food_fries',
      maxPatience: 25,
      patience: 20,
      waitingTime: 3,
      orderedFoodId: 'food_fries',
      orderId: 'ord_waiting',
      state: 'waiting',
      satisfaction: 5,
      quote: 'Tôi thích khoai tây chiên'
    };

    const order: Order = {
      id: 'ord_waiting',
      customerId: 'cust_waiting',
      foodId: 'food_fries',
      quantity: 1,
      createdAt: Date.now() - 3000,
      waitingTime: 3,
      status: 'READY',
      productionJobId: 'job_ready_fries',
      basePrice: 15
    };

    const readyJob: ProductionJob = {
      id: 'job_ready_fries',
      orderId: 'cust_waiting',
      recipeId: 'recipe_french_fries',
      stationId: 'station_packing',
      status: 'READY',
      currentStepIndex: 2,
      progress: 100,
      readyAt: Date.now() - 1000,
      freshness: 95,
      temperature: 90
    };

    useGameStore.setState({
      money: 500,
      reputation: 60,
      employees: [cashier],
      customers: [customer],
      orders: [order],
      productionJobs: [readyJob]
    });

    // Run employee processing
    useGameStore.getState().processEmployees(1);

    const state = useGameStore.getState();

    // Order served
    expect(state.orders.find(o => o.id === 'ord_waiting')?.status).toBe('SERVED');
    // Job served
    expect(state.productionJobs.find(j => j.id === 'job_ready_fries')?.status).toBe('SERVED');
    // Customer removed from waiting queue
    expect(state.customers.some(c => c.id === 'cust_waiting')).toBe(false);
    // Money increased (basePrice + tip)
    expect(state.money).toBeGreaterThan(500);
    // Employee log recorded
    expect(state.employeeLogs.some(log => log.type === 'serve' && log.employeeId === 'emp_cashier_linh')).toBe(true);
  });

  it('cook progresses production at assigned station and drains stamina', () => {
    const cook: Employee = {
      id: 'emp_cook_bob',
      name: 'Bob Bếp Phó',
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
      catchphrase: 'Đang nấu đây!',
      assignedStationId: 'station_prep_table',
      stamina: 100,
      maxStamina: 100,
      workState: 'IDLE'
    };

    const prepStation: ProductionStation = {
      id: 'station_prep_table',
      name: 'Bàn Sơ Chế',
      stationType: 'prep',
      equipmentId: 'equip_knife_set',
      assignedEmployeeId: 'emp_cook_bob',
      capacity: 1,
      activeJobId: 'job_cooking',
      isOperational: true,
      queue: []
    };

    const activeJob: ProductionJob = {
      id: 'job_cooking',
      orderId: 'cust_test',
      recipeId: 'recipe_french_fries',
      stationId: 'station_prep_table',
      status: 'COOKING',
      currentStepIndex: 0,
      progress: 20,
      startedAt: Date.now(),
      consumedStepIndices: [0]
    };

    useGameStore.setState({
      employees: [cook],
      stations: [prepStation],
      productionJobs: [activeJob],
      equipment: [
        {
          id: 'equip_knife_set',
          name: 'Bộ Dao',
          category: 'prep',
          tier: 1,
          purchasePrice: 100,
          upgradeCost: 50,
          condition: 100,
          efficiency: 1.0,
          speedMultiplier: 1.0,
          qualityMultiplier: 1.0,
          capacity: 1,
          unlocked: true
        }
      ],
      ingredients: [
        {
          id: 'ing_potato',
          name: 'Khoai Tây',
          stock: 50,
          basePrice: 1,
          minBatch: 10,
          unit: 'củ',
          icon: '🥔',
          category: 'vegetables'
        }
      ]
    });

    // Run production processing
    useGameStore.getState().processProduction(1);

    const state = useGameStore.getState();
    const updatedJob = state.productionJobs.find(j => j.id === 'job_cooking')!;
    const updatedCook = state.employees.find(e => e.id === 'emp_cook_bob')!;

    // Progress increased
    expect(updatedJob.progress).toBeGreaterThan(20);
    // Job locked to cook
    expect(updatedJob.employeeId).toBe('emp_cook_bob');
    // Cook stamina drained
    expect(updatedCook.stamina).toBeLessThan(100);
    // Cook in WORKING state
    expect(updatedCook.workState).toBe('WORKING');
  });
});
