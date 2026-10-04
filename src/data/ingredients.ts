import { Ingredient } from '../types/game';
import { INITIAL_INGREDIENTS } from './initialData';

// Re-export catalog with helper functions
export const INGREDIENTS_CATALOG: Ingredient[] = INITIAL_INGREDIENTS;

export const getIngredientById = (id: string): Ingredient | undefined => {
  return INGREDIENTS_CATALOG.find(i => i.id === id);
};
