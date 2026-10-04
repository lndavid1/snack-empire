import type { GameState } from '../../store/gameStore';

/**
 * Granular selectors to prevent unnecessary 3D canvas re-renders
 * Only updates when relevant 3D presentation data changes.
 */
export const selectStations = (state: GameState) => state.stations;
export const selectEquipment = (state: GameState) => state.equipment;
export const selectProductionJobs = (state: GameState) => state.productionJobs;
export const selectEmployees = (state: GameState) => state.employees;
export const selectCustomers = (state: GameState) => state.customers;
export const selectFoods = (state: GameState) => state.foods;
export const selectStoreTier = (state: GameState) => state.currentTierId;
export const selectReputation = (state: GameState) => state.reputation;
