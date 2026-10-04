// Save, Load, Export and Import Service with validation and migration
import { Equipment, ProductionStation } from '../types/game';
import { STARTER_EQUIPMENT, STARTER_STATIONS } from '../data/equipment';

const SAVE_KEY = 'snack_empire_save_v1';

export interface SaveData {
  version: number;
  lastSavedTimestamp: number;
  money: number;
  xp: number;
  level: number;
  reputation: number;
  brandValue: number;
  empirePoints: number;
  currentTierId: string;
  selectedSupplierId: string;
  ingredients: Record<string, number>;
  foodLevels: Record<string, { level: number; unlocked: boolean; sellingPrice?: number }>;
  hiredEmployees: Record<string, { hired: boolean; level: number; mood: number; assignedStationId?: string; stamina?: number }>;
  upgrades: Record<string, number>;
  prestigeUpgrades: Record<string, number>;
  totalSalesCount: number;
  totalRevenueEarned: number;
  claimedQuests: string[];
  unlockedAchievements: string[];
  totalTipsEarned?: number;
  // Phase 2 additions
  equipment?: Equipment[];
  stations?: ProductionStation[];
  unlockedRecipeIds?: string[];
  autoRestock?: boolean;
}

export const StorageService = {
  migrate(raw: any): SaveData | null {
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.money !== 'number' || typeof raw.xp !== 'number') return null;

    // Idempotent migration from v1 to v2:
    // If equipment or stations are missing, initialize them from starter defaults.
    const equipment: Equipment[] = Array.isArray(raw.equipment) && raw.equipment.length > 0
      ? raw.equipment
      : STARTER_EQUIPMENT.map(e => ({ ...e }));

    const stations: ProductionStation[] = Array.isArray(raw.stations) && raw.stations.length > 0
      ? raw.stations.map((s: any) => ({ ...s, queue: Array.isArray(s.queue) ? s.queue : [] }))
      : STARTER_STATIONS.map(s => ({ ...s, queue: [] }));

    const defaultRecipes = ['recipe_french_fries', 'recipe_burger', 'recipe_soda'];
    const unlockedRecipeIds: string[] = Array.isArray(raw.unlockedRecipeIds) && raw.unlockedRecipeIds.length > 0
      ? Array.from(new Set([...raw.unlockedRecipeIds, ...defaultRecipes]))
      : defaultRecipes;

    const migrated: SaveData = {
      ...raw,
      version: 2,
      lastSavedTimestamp: raw.lastSavedTimestamp || Date.now(),
      money: raw.money,
      xp: raw.xp,
      level: raw.level || 1,
      reputation: raw.reputation !== undefined ? raw.reputation : 50,
      brandValue: raw.brandValue || 0,
      empirePoints: raw.empirePoints || 0,
      currentTierId: raw.currentTierId || 'tier_1_cart',
      selectedSupplierId: raw.selectedSupplierId || 'cheap_market',
      ingredients: raw.ingredients || {},
      foodLevels: raw.foodLevels || {},
      hiredEmployees: raw.hiredEmployees || {},
      upgrades: raw.upgrades || {},
      prestigeUpgrades: raw.prestigeUpgrades || {},
      totalSalesCount: raw.totalSalesCount || 0,
      totalRevenueEarned: raw.totalRevenueEarned || 0,
      totalTipsEarned: raw.totalTipsEarned || 0,
      claimedQuests: Array.isArray(raw.claimedQuests) ? raw.claimedQuests : [],
      unlockedAchievements: Array.isArray(raw.unlockedAchievements) ? raw.unlockedAchievements : [],
      equipment,
      stations,
      unlockedRecipeIds,
      autoRestock: raw.autoRestock !== undefined ? raw.autoRestock : true
    };

    return migrated;
  },

  save(data: SaveData): boolean {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save game state to localStorage:', e);
      return false;
    }
  },

  load(): SaveData | null {
    try {
      const serialized = localStorage.getItem(SAVE_KEY);
      if (!serialized) return null;
      const parsed = JSON.parse(serialized);
      return this.migrate(parsed);
    } catch (e) {
      console.error('Failed to load game state:', e);
      return null;
    }
  },

  clear() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('Failed to clear save:', e);
    }
  },

  exportToFile(data: SaveData) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snack_empire_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  validateImport(jsonString: string): SaveData | null {
    try {
      const data = JSON.parse(jsonString);
      return this.migrate(data);
    } catch {
      return null;
    }
  }
};
