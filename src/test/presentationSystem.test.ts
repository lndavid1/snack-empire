import { describe, it, expect } from 'vitest';
import { 
  resolveEmployeePresentationState, 
  resolveCustomerPresentationState, 
  resolveStationPresentationState 
} from '../3d/presentation/presentationStateResolver';
import type { Employee3DState, Customer3DState, Station3DState } from '../3d/types/sceneTypes';

describe('Phase 6D: Presentation Action State & Cooking Simulation', () => {
  const baseEmployee: Employee3DState = {
    id: 'emp_bob',
    name: 'Bob',
    role: 'cook',
    avatar: '👨‍🍳',
    archetype: 'FAST',
    workState: 'WORKING',
    stamina: 80,
    maxStamina: 100,
    currentPosition: [-3.8, 0, -3.4],
    targetPosition: [-3.8, 0, -3.4],
    assignedStationId: 'station_prep_table',
    color: '#f59e0b',
  };

  const baseCustomer: Customer3DState = {
    id: 'cust_an',
    name: 'An',
    avatar: '😊',
    archetype: 'student',
    mood: 'HAPPY',
    patience: 20,
    maxPatience: 25,
    patiencePercent: 80,
    waitingTime: 5,
    orderedFoodId: 'food_fries',
    orderedFoodName: 'Khoai Tây Chiên',
    orderPrice: 15,
    currentPosition: [3.6, 0, 0.4],
    targetPosition: [3.6, 0, 0.4],
    state: 'waiting',
  };

  const baseStation: Station3DState = {
    id: 'station_fryer',
    name: 'Bếp Chiên',
    stationType: 'fryer',
    position: [-0.6, 0, -4.5],
    isOperational: true,
    equipmentCondition: 90,
    equipmentTier: 1,
    queueCount: 1,
  };

  describe('Employee Presentation Action State Resolver', () => {
    it('resolves walking state when character is actively moving between waypoints', () => {
      const state = resolveEmployeePresentationState({
        employee: { ...baseEmployee, workState: 'WORKING' },
        activeJob: {
          id: 'job_1',
          recipeId: 'recipe_french_fries',
          recipeName: 'Khoai Tây Chiên',
          status: 'COOKING',
          progress: 50,
          stepName: 'Chiên ngập dầu',
        },
        movementStatus: 'MOVING',
        isNearDestination: false,
      });

      expect(state.action).toBe('WALKING');
      expect(state.progress).toBe(0);
    });

    it('resolves PREPPING action when employee arrives at prep station with PREPARING job', () => {
      const state = resolveEmployeePresentationState({
        employee: { ...baseEmployee, workState: 'WORKING' },
        activeJob: {
          id: 'job_prep',
          recipeId: 'recipe_french_fries',
          recipeName: 'Khoai Tây Chiên',
          status: 'PREPARING',
          progress: 35,
          stepName: 'Cắt lát khoai tây',
        },
        movementStatus: 'ARRIVED',
        isNearDestination: true,
      });

      expect(state.action).toBe('PREPPING');
      expect(state.progress).toBe(35);
      expect(state.recipeName).toBe('Khoai Tây Chiên');
    });

    it('resolves COOKING action when employee arrives at fryer with COOKING job', () => {
      const state = resolveEmployeePresentationState({
        employee: { ...baseEmployee, workState: 'WORKING' },
        activeJob: {
          id: 'job_fry',
          recipeId: 'recipe_french_fries',
          recipeName: 'Khoai Tây Chiên',
          status: 'COOKING',
          progress: 72,
          stepName: 'Chiên giòn',
        },
        movementStatus: 'ARRIVED',
        isNearDestination: true,
      });

      expect(state.action).toBe('COOKING');
      expect(state.progress).toBe(72);
    });

    it('resolves PACKING action when employee arrives at packing station with PACKING job', () => {
      const state = resolveEmployeePresentationState({
        employee: { ...baseEmployee, workState: 'WORKING' },
        activeJob: {
          id: 'job_pack',
          recipeId: 'recipe_french_fries',
          recipeName: 'Khoai Tây Chiên',
          status: 'PACKING',
          progress: 90,
          stepName: 'Lắc phô mai & đóng hộp',
        },
        movementStatus: 'ARRIVED',
        isNearDestination: true,
      });

      expect(state.action).toBe('PACKING');
      expect(state.progress).toBe(90);
    });

    it('resolves CARRYING action when employee moves while in SERVING workState', () => {
      const state = resolveEmployeePresentationState({
        employee: { ...baseEmployee, workState: 'SERVING' },
        movementStatus: 'MOVING',
        isNearDestination: false,
      });

      expect(state.action).toBe('CARRYING');
      expect(state.carryingProp).toBe('fries_box');
      expect(state.progress).toBe(100);
    });

    it('resolves SERVING action when employee arrives at service counter', () => {
      const state = resolveEmployeePresentationState({
        employee: { ...baseEmployee, workState: 'SERVING' },
        movementStatus: 'ARRIVED',
        isNearDestination: true,
      });

      expect(state.action).toBe('SERVING');
      expect(state.carryingProp).toBe('fries_box');
    });

    it('resolves IDLE action for resting or idle employees', () => {
      const resting = resolveEmployeePresentationState({
        employee: { ...baseEmployee, workState: 'RESTING' },
        movementStatus: 'ARRIVED',
        isNearDestination: true,
      });
      expect(resting.action).toBe('IDLE');

      const idle = resolveEmployeePresentationState({
        employee: { ...baseEmployee, workState: 'IDLE' },
        movementStatus: 'ARRIVED',
        isNearDestination: true,
      });
      expect(idle.action).toBe('IDLE');
    });
  });

  describe('Customer Presentation Action State Resolver', () => {
    it('resolves WAITING action when standing in queue', () => {
      const state = resolveCustomerPresentationState({
        customer: { ...baseCustomer, state: 'waiting' },
        movementStatus: 'ARRIVED',
        isNearDestination: true,
      });

      expect(state.action).toBe('WAITING');
    });

    it('resolves WALKING action when customer is walking to queue slot', () => {
      const state = resolveCustomerPresentationState({
        customer: { ...baseCustomer, state: 'waiting' },
        movementStatus: 'MOVING',
        isNearDestination: false,
      });

      expect(state.action).toBe('WALKING');
    });

    it('resolves EATING action with fries prop when customer state is eating', () => {
      const state = resolveCustomerPresentationState({
        customer: { ...baseCustomer, state: 'eating' },
        movementStatus: 'ARRIVED',
        isNearDestination: true,
      });

      expect(state.action).toBe('EATING');
      expect(state.eatingProp).toBe('fries_box');
    });

    it('resolves WALKING action when customer is leaving or rage quit', () => {
      const leaving = resolveCustomerPresentationState({
        customer: { ...baseCustomer, state: 'leaving' },
        movementStatus: 'MOVING',
      });
      expect(leaving.action).toBe('WALKING');

      const rageQuit = resolveCustomerPresentationState({
        customer: { ...baseCustomer, state: 'rage_quit' },
        movementStatus: 'MOVING',
      });
      expect(rageQuit.action).toBe('WALKING');
    });
  });

  describe('Station Presentation Action State Resolver', () => {
    it('resolves IDLE action when station has no active job', () => {
      const state = resolveStationPresentationState({
        ...baseStation,
        activeJob: undefined,
      });

      expect(state.action).toBe('IDLE');
      expect(state.progress).toBe(0);
    });

    it('resolves COOKING action and passes progress from active job', () => {
      const state = resolveStationPresentationState({
        ...baseStation,
        activeJob: {
          id: 'job_fry',
          recipeId: 'recipe_french_fries',
          recipeName: 'Khoai Tây Chiên',
          status: 'COOKING',
          progress: 64,
          stepName: 'Chiên giòn',
        },
      });

      expect(state.action).toBe('COOKING');
      expect(state.progress).toBe(64);
      expect(state.recipeName).toBe('Khoai Tây Chiên');
    });

    it('resolves READY action with 100% progress when food is ready', () => {
      const state = resolveStationPresentationState({
        ...baseStation,
        activeJob: {
          id: 'job_fry',
          recipeId: 'recipe_french_fries',
          recipeName: 'Khoai Tây Chiên',
          status: 'READY',
          progress: 100,
          stepName: 'Hoàn thành',
        },
      });

      expect(state.action).toBe('READY');
      expect(state.progress).toBe(100);
    });
  });

  describe('Safety, Fallback & Immutability', () => {
    it('safely falls back to IDLE without throwing on missing or incomplete job data', () => {
      const safe = resolveEmployeePresentationState({
        employee: { ...baseEmployee, workState: 'WORKING' },
        activeJob: undefined,
        movementStatus: 'ARRIVED',
        isNearDestination: true,
      });

      expect(safe.action).toBe('IDLE');
      expect(safe.progress).toBe(0);
    });

    it('does not mutate input employee or station state objects', () => {
      const employeeClone = JSON.stringify(baseEmployee);
      const stationClone = JSON.stringify(baseStation);

      resolveEmployeePresentationState({
        employee: baseEmployee,
        movementStatus: 'ARRIVED',
        isNearDestination: true,
      });

      resolveStationPresentationState(baseStation);

      expect(JSON.stringify(baseEmployee)).toBe(employeeClone);
      expect(JSON.stringify(baseStation)).toBe(stationClone);
    });
  });
});
