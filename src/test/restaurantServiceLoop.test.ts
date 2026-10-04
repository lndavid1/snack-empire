import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../store/gameStore';
import { EmployeeWorkflowService } from '../services/employeeWorkflow';
import { DINING_TABLES_LAYOUT } from '../3d/config/restaurantLayout';
import type { Employee, Customer, Order, ProductionJob } from '../types/game';

import { INITIAL_EMPLOYEES } from '../data/initialData';
import { STARTER_STATIONS } from '../data/equipment';

describe('Snack Empire: Automated Restaurant Service Loop & Waitstaff Tests', () => {
  beforeEach(() => {
    useGameStore.setState({
      money: 500,
      reputation: 60,
      totalSalesCount: 0,
      totalRevenueEarned: 0,
      totalTipsEarned: 0,
      unlockedRecipeIds: ['recipe_french_fries', 'recipe_burger', 'recipe_soda'],
      employees: INITIAL_EMPLOYEES.map(e => ({ ...e })),
      stations: STARTER_STATIONS.map(s => ({ ...s, queue: [] })),
      customers: [],
      orders: [],
      productionJobs: [],
      employeeLogs: [],
      tableStates: {}
    });
  });

  it('verifies server role is recognized and initial server employee exists', () => {
    const server: Employee = {
      id: 'emp_server_hoa',
      name: 'Hoa Nhanh Nhẹn',
      role: 'server',
      avatar: '💁',
      level: 1,
      speed: 15,
      quality: 10,
      salaryPerSec: 0.6,
      hired: true,
      hireCost: 150,
      upgradeCost: 90,
      mood: 100,
      catchphrase: 'Món nóng hổi thơm phức!',
      stamina: 100
    };

    expect(EmployeeWorkflowService.isServiceWorker(server)).toBe(true);
    expect(EmployeeWorkflowService.isServer(server)).toBe(true);
    expect(EmployeeWorkflowService.isCashier(server)).toBe(false);

    const initialEmployees = useGameStore.getState().employees;
    const initialHoa = initialEmployees.find(e => e.id === 'emp_server_hoa');
    expect(initialHoa).toBeDefined();
    expect(initialHoa?.role).toBe('server');
  });

  it('cashier automatically receives order from queue, creates production job bill, and assigns dining seat', () => {
    const cashier: Employee = {
      id: 'emp_cashier_linh',
      name: 'Linh Thu Ngân',
      role: 'cashier',
      avatar: '💁‍♀️',
      level: 1,
      speed: 15,
      quality: 10,
      salaryPerSec: 0.5,
      hired: true,
      hireCost: 120,
      upgradeCost: 80,
      mood: 100,
      catchphrase: 'Xin chào!',
      stamina: 100,
      workState: 'IDLE'
    };

    const customer: Customer = {
      id: 'cust_order_test',
      name: 'Khánh',
      archetype: 'student',
      avatar: '🎒',
      budget: 50,
      patience: 25,
      maxPatience: 25,
      waitingTime: 0,
      mood: 'DELIGHTED',
      favoriteFoodId: 'food_fries',
      orderedFoodId: 'food_fries',
      orderId: 'ord_test_01',
      state: 'waiting',
      isOrdered: false,
      satisfaction: 5,
      quote: 'Order nhanh giúp em!'
    };

    useGameStore.setState({
      employees: [cashier],
      customers: [customer]
    });

    // Run employee workflow
    useGameStore.getState().processEmployees(1);

    const state = useGameStore.getState();
    const updatedCustomer = state.customers.find(c => c.id === 'cust_order_test')!;

    // 1. Customer order taken
    expect(updatedCustomer.isOrdered).toBe(true);
    // 2. Customer assigned a dining table and seat
    expect(updatedCustomer.tableId).toBeDefined();
    expect(updatedCustomer.seatId).toBeDefined();
    expect(DINING_TABLES_LAYOUT.some(t => t.id === updatedCustomer.tableId)).toBe(true);

    // 3. Bill queued for kitchen
    expect(state.productionJobs.length).toBeGreaterThan(0);
    const job = state.productionJobs[0];
    expect(job.recipeId).toBe('recipe_french_fries');
    expect(job.orderId).toBe('cust_order_test');

    // 4. Log recorded
    expect(state.employeeLogs.some(l => l.employeeId === 'emp_cashier_linh' && l.message.includes('order'))).toBe(true);
  });

  it('allocates distinct vacant dining seats for consecutive customer orders', () => {
    const cust1: Customer = {
      id: 'c1',
      name: 'Khách 1',
      archetype: 'office',
      avatar: '💼',
      budget: 50,
      patience: 25,
      favoriteFoodId: 'food_fries',
      orderedFoodId: 'food_fries',
      state: 'waiting',
      isOrdered: false,
      satisfaction: 5,
      quote: '1'
    };

    const cust2: Customer = {
      id: 'c2',
      name: 'Khách 2',
      archetype: 'gamer',
      avatar: '🎮',
      budget: 50,
      patience: 25,
      favoriteFoodId: 'food_fries',
      orderedFoodId: 'food_fries',
      state: 'waiting',
      isOrdered: false,
      satisfaction: 5,
      quote: '2'
    };

    useGameStore.setState({
      customers: [cust1, cust2]
    });

    useGameStore.getState().takeCustomerOrder('c1');
    useGameStore.getState().takeCustomerOrder('c2');

    const state = useGameStore.getState();
    const c1 = state.customers.find(c => c.id === 'c1')!;
    const c2 = state.customers.find(c => c.id === 'c2')!;

    expect(c1.isOrdered).toBe(true);
    expect(c2.isOrdered).toBe(true);
    expect(c1.seatId).not.toEqual(c2.seatId);
  });

  it('server automatically picks up READY food, delivers to table, and transitions customer to eating state', () => {
    const server: Employee = {
      id: 'emp_server_hoa',
      name: 'Hoa Nhanh Nhẹn',
      role: 'server',
      avatar: '💁',
      level: 1,
      speed: 15,
      quality: 10,
      salaryPerSec: 0.6,
      hired: true,
      hireCost: 150,
      upgradeCost: 90,
      mood: 100,
      catchphrase: 'Món nóng hổi!',
      stamina: 100,
      workState: 'IDLE'
    };

    const customer: Customer = {
      id: 'cust_seated',
      name: 'Bác Ba',
      archetype: 'foodie',
      avatar: '🍜',
      budget: 50,
      patience: 20,
      maxPatience: 25,
      waitingTime: 5,
      favoriteFoodId: 'food_fries',
      orderedFoodId: 'food_fries',
      orderId: 'ord_seated',
      state: 'waiting',
      isOrdered: true,
      tableId: 'table_01',
      seatId: 'seat_01_1',
      satisfaction: 5,
      quote: 'Chờ khoai giòn'
    };

    const order: Order = {
      id: 'ord_seated',
      customerId: 'cust_seated',
      foodId: 'food_fries',
      quantity: 1,
      createdAt: Date.now() - 5000,
      waitingTime: 5,
      status: 'READY',
      productionJobId: 'job_fries_ready',
      basePrice: 15
    };

    const readyJob: ProductionJob = {
      id: 'job_fries_ready',
      orderId: 'cust_seated',
      recipeId: 'recipe_french_fries',
      stationId: 'starter_packing_station',
      status: 'READY',
      currentStepIndex: 3,
      progress: 100,
      readyAt: Date.now() - 1000,
      freshness: 100,
      temperature: 100
    };

    useGameStore.setState({
      money: 100,
      employees: [server],
      customers: [customer],
      orders: [order],
      productionJobs: [readyJob]
    });

    // Run employee workflow
    useGameStore.getState().processEmployees(1);

    const state = useGameStore.getState();
    const servedCustomer = state.customers.find(c => c.id === 'cust_seated')!;

    // 1. Customer transitions to eating at their table
    expect(servedCustomer.state).toBe('eating');
    expect(servedCustomer.tableId).toBe('table_01');
    expect(servedCustomer.seatId).toBe('seat_01_1');
    expect(servedCustomer.eatingTime).toBe(0);

    // 2. Production job and order are marked SERVED
    expect(state.productionJobs.find(j => j.id === 'job_fries_ready')?.status).toBe('SERVED');
    expect(state.orders.find(o => o.id === 'ord_seated')?.status).toBe('SERVED');

    // 3. Money and tip collected
    expect(state.money).toBeGreaterThan(100);
    expect(state.totalSalesCount).toBe(1);

    // 4. Server log created
    expect(state.employeeLogs.some(l => l.employeeId === 'emp_server_hoa' && l.type === 'serve')).toBe(true);
  });

  it('customer completes eating after time and transitions to leaving, freeing up the seat', () => {
    const customer: Customer = {
      id: 'cust_eating',
      name: 'Minh',
      archetype: 'student',
      avatar: '🎒',
      budget: 50,
      patience: 20,
      favoriteFoodId: 'food_fries',
      state: 'eating',
      eatingTime: 3, // 3 seconds in
      tableId: 'table_01',
      seatId: 'seat_01_1',
      satisfaction: 5,
      quote: 'Ngon quá!'
    };

    useGameStore.setState({
      customers: [customer]
    });

    // Tick simulation to reach 4 seconds
    useGameStore.getState().tickSimulation();

    const state = useGameStore.getState();
    const leavingCustomer = state.customers.find(c => c.id === 'cust_eating')!;

    // Customer transitions to leaving and frees the table
    expect(leavingCustomer.state).toBe('leaving');
    expect(leavingCustomer.tableId).toBeUndefined();
    expect(leavingCustomer.seatId).toBeUndefined();

    // After 2 ticks of leaving, customer exits
    useGameStore.getState().tickSimulation();
    useGameStore.getState().tickSimulation();

    const finalState = useGameStore.getState();
    expect(finalState.customers.some(c => c.id === 'cust_eating')).toBe(false);
  });

  it('fallback auto-order triggers for solo player when customer waits in queue without cashier staff', () => {
    const customer: Customer = {
      id: 'cust_solo',
      name: 'Trang',
      archetype: 'office',
      avatar: '💼',
      budget: 50,
      patience: 20,
      maxPatience: 20,
      waitingTime: 2, // Waited 2s at counter
      favoriteFoodId: 'food_fries',
      orderedFoodId: 'food_fries',
      state: 'waiting',
      isOrdered: false,
      satisfaction: 5,
      quote: 'Có ai ở quầy không?'
    };

    useGameStore.setState({
      employees: [], // No staff hired
      customers: [customer]
    });

    useGameStore.getState().tickSimulation();

    const state = useGameStore.getState();
    const autoOrderedCustomer = state.customers.find(c => c.id === 'cust_solo')!;

    expect(autoOrderedCustomer.isOrdered).toBe(true);
    expect(autoOrderedCustomer.tableId).toBeDefined();
    expect(autoOrderedCustomer.seatId).toBeDefined();
    expect(state.productionJobs.some(j => j.orderId === 'cust_solo')).toBe(true);
  });

  it('kitchen automatically receives order, cook Bob cooks across stations to READY, and server Hoa delivers it', () => {
    const store = useGameStore.getState();
    const bob = store.employees.find(e => e.id === 'emp_cook_bob')!;
    const linh = store.employees.find(e => e.id === 'emp_cashier_linh')!;
    const hoa = store.employees.find(e => e.id === 'emp_server_hoa')!;

    expect(bob.hired).toBe(true);
    expect(linh.hired).toBe(true);
    expect(hoa.hired).toBe(true);

    const customer: Customer = {
      id: 'cust_auto_loop',
      name: 'Khách Đói Bụng',
      archetype: 'student',
      avatar: '🎒',
      budget: 50,
      patience: 35,
      maxPatience: 35,
      waitingTime: 0,
      mood: 'DELIGHTED',
      favoriteFoodId: 'food_fries',
      orderedFoodId: 'food_fries',
      orderId: 'ord_auto_loop',
      state: 'waiting',
      isOrdered: false,
      satisfaction: 5,
      quote: 'Đói bụng quá!'
    };

    useGameStore.setState({
      customers: [customer],
      orders: [{
        id: 'ord_auto_loop',
        customerId: 'cust_auto_loop',
        foodId: 'food_fries',
        quantity: 1,
        createdAt: Date.now(),
        waitingTime: 0,
        status: 'PENDING',
        basePrice: 7
      }],
      productionJobs: []
    });

    // Tick 1: Linh takes order, creates production job bill, assigns seat
    useGameStore.getState().tickSimulation();

    let state = useGameStore.getState();
    const custAfterOrder = state.customers.find(c => c.id === 'cust_auto_loop')!;
    expect(custAfterOrder.isOrdered).toBe(true);
    expect(state.productionJobs.length).toBe(1);

    const job = state.productionJobs[0];
    // Check that target station queue immediately holds the job
    const prepStation = state.stations.find(s => s.stationType === 'prep')!;
    expect(prepStation.queue).toContain(job.id);

    // Run simulation ticks until food is cooked and served (approx 10-15 seconds for French Fries)
    for (let tick = 0; tick < 18; tick++) {
      useGameStore.getState().tickSimulation();
      const currentJob = useGameStore.getState().productionJobs.find(j => j.id === job.id);
      if (currentJob?.status === 'SERVED') {
        break;
      }
    }

    state = useGameStore.getState();
    const servedCust = state.customers.find(c => c.id === 'cust_auto_loop')!;
    // Customer received food, eating or leaving
    expect(['eating', 'leaving'].includes(servedCust.state)).toBe(true);
    // Revenue was earned
    expect(state.totalRevenueEarned).toBeGreaterThan(0);
  });

  it('server visibly holds SERVING state and targets customer table during delivery', () => {
    const server: Employee = {
      id: 'emp_server_hoa',
      name: 'Hoa Nhanh Nhẹn',
      role: 'server',
      avatar: '💁',
      level: 1,
      speed: 15,
      quality: 10,
      salaryPerSec: 0.6,
      hired: true,
      hireCost: 150,
      upgradeCost: 90,
      mood: 100,
      catchphrase: 'Phục vụ tận bàn!',
      stamina: 100,
      workState: 'IDLE'
    };

    const customer: Customer = {
      id: 'cust_delivery_target',
      name: 'Thanh',
      archetype: 'gamer',
      avatar: '🎮',
      budget: 50,
      patience: 25,
      maxPatience: 25,
      waitingTime: 4,
      favoriteFoodId: 'food_fries',
      orderedFoodId: 'food_fries',
      orderId: 'ord_delivery',
      state: 'waiting',
      isOrdered: true,
      tableId: 'table_02',
      seatId: 'seat_02_1',
      satisfaction: 5,
      quote: 'Giao bàn 2 nhé!'
    };

    const readyJob: ProductionJob = {
      id: 'job_delivery_fries',
      orderId: 'cust_delivery_target',
      recipeId: 'recipe_french_fries',
      stationId: 'starter_packing_station',
      status: 'READY',
      currentStepIndex: 3,
      progress: 100,
      readyAt: Date.now() - 1000
    };

    useGameStore.setState({
      employees: [server],
      customers: [customer],
      orders: [{
        id: 'ord_delivery',
        customerId: 'cust_delivery_target',
        foodId: 'food_fries',
        quantity: 1,
        createdAt: Date.now() - 4000,
        waitingTime: 4,
        status: 'READY',
        basePrice: 15
      }],
      productionJobs: [readyJob]
    });

    // Run employee processing tick
    useGameStore.getState().processEmployees(1);

    const stateAfterServe = useGameStore.getState();
    const activeServer = stateAfterServe.employees.find(e => e.id === 'emp_server_hoa')!;

    // Server should be visibly in SERVING state with DELIVERING step and target table
    expect(activeServer.workState).toBe('SERVING');
    expect(activeServer.servingStep).toBe('DELIVERING');
    expect(activeServer.targetTableId).toBe('table_02');
    expect(activeServer.currentLocation).toBe('DINING_AREA');

    // Customer is now eating at table_02
    const eatingCust = stateAfterServe.customers.find(c => c.id === 'cust_delivery_target')!;
    expect(eatingCust.state).toBe('eating');
    expect(eatingCust.tableId).toBe('table_02');

    // On subsequent tick when serving timer completes, server returns to IDLE
    useGameStore.getState().processEmployees(2);
    const idleServer = useGameStore.getState().employees.find(e => e.id === 'emp_server_hoa')!;
    expect(idleServer.workState).toBe('IDLE');
  });

  it('dining table transitions to DIRTY after eating customer leaves', () => {
    const customer: Customer = {
      id: 'cust_dirty_table_test',
      name: 'Vũ',
      archetype: 'foodie',
      avatar: '🍜',
      budget: 50,
      patience: 25,
      favoriteFoodId: 'food_fries',
      state: 'eating',
      eatingTime: 3, // almost finished eating (threshold: 4s)
      tableId: 'table_01',
      seatId: 'seat_01_1',
      satisfaction: 5,
      quote: 'No nê rồi!'
    };

    useGameStore.setState({
      customers: [customer],
      tableStates: {
        table_01: { tableId: 'table_01', status: 'CLEAN', cleanedProgress: 100 }
      }
    });

    // Tick simulation once: eatingTime reaches 4 -> customer leaves
    useGameStore.getState().tickSimulation();

    const state = useGameStore.getState();
    const tableState = state.tableStates['table_01'];

    // Table should now be marked DIRTY!
    expect(tableState).toBeDefined();
    expect(tableState.status).toBe('DIRTY');
    expect(tableState.cleanedProgress).toBe(0);
  });

  it('cleaner employee automatically cleans dirty table and restores CLEAN status', () => {
    const cleaner: Employee = {
      id: 'emp_cleaner_tam',
      name: 'Chú Tám Lao Công',
      role: 'cleaner',
      avatar: '🧹',
      level: 1,
      speed: 12,
      quality: 10,
      salaryPerSec: 0.4,
      hired: true,
      hireCost: 100,
      upgradeCost: 60,
      mood: 100,
      catchphrase: 'Sạch bong kin kít!',
      stamina: 100,
      workState: 'IDLE'
    };

    useGameStore.setState({
      employees: [cleaner],
      tableStates: {
        table_03: { tableId: 'table_03', status: 'DIRTY', cleanedProgress: 0 }
      },
      productionJobs: []
    });

    // Tick 1: Cleaner claims the dirty table
    useGameStore.getState().processEmployees(1);

    let state = useGameStore.getState();
    let emp = state.employees.find(e => e.id === 'emp_cleaner_tam')!;
    let table = state.tableStates['table_03'];

    expect(emp.workState).toBe('WORKING');
    expect(emp.cleaningTableId).toBe('table_03');
    expect(table.status).toBe('BEING_CLEANED');

    // Run employee processing until cleaning is completed (approx 2 ticks)
    useGameStore.getState().processEmployees(2);

    state = useGameStore.getState();
    emp = state.employees.find(e => e.id === 'emp_cleaner_tam')!;
    table = state.tableStates['table_03'];

    expect(table.status).toBe('CLEAN');
    expect(table.cleanedProgress).toBe(100);
    expect(emp.workState).toBe('IDLE');
    expect(emp.cleaningTableId).toBeUndefined();
    expect(state.employeeLogs.some(l => l.employeeId === 'emp_cleaner_tam' && l.type === 'clean')).toBe(true);
  });

  it('player can manually click cleanTable to clear dirty dishes immediately', () => {
    useGameStore.setState({
      tableStates: {
        table_02: { tableId: 'table_02', status: 'DIRTY', cleanedProgress: 0 }
      }
    });

    const success = useGameStore.getState().cleanTable('table_02');
    expect(success).toBe(true);

    const state = useGameStore.getState();
    expect(state.tableStates['table_02'].status).toBe('CLEAN');
    expect(state.tableStates['table_02'].cleanedProgress).toBe(100);
  });
});
