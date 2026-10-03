// Save, Load, Export and Import Service with validation

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
  hiredEmployees: Record<string, { hired: boolean; level: number; mood: number }>;
  upgrades: Record<string, number>;
  prestigeUpgrades: Record<string, number>;
  totalSalesCount: number;
  totalRevenueEarned: number;
  claimedQuests: string[];
  unlockedAchievements: string[];
}

export const StorageService = {
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
      if (typeof parsed !== 'object' || parsed === null) return null;
      if (typeof parsed.money !== 'number') return null;
      return parsed as SaveData;
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
      if (
        data &&
        typeof data === 'object' &&
        typeof data.money === 'number' &&
        typeof data.xp === 'number' &&
        data.ingredients &&
        data.foodLevels
      ) {
        return data as SaveData;
      }
      return null;
    } catch {
      return null;
    }
  }
};
