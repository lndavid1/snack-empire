import { describe, it, expect } from 'vitest';
import { EQUIPMENT_CATALOG, STARTER_EQUIPMENT, STARTER_STATIONS, getEquipmentById } from '../data/equipment';
import { RECIPES_CATALOG, getRecipeById } from '../data/recipes';
import { StorageService } from '../services/storage';

describe('Phase 2: Equipment & Data Catalogs', () => {
  it('verifies Basic Fryer exists with valid category and tier', () => {
    const fryer = getEquipmentById('fryer_basic');
    expect(fryer).toBeDefined();
    expect(fryer?.name).toBe('Bếp Chiên Nhúng Đơn');
    expect(fryer?.category).toBe('fryer');
    expect(fryer?.tier).toBe(1);
    expect(fryer?.speedMultiplier).toBeGreaterThanOrEqual(1.0);
    expect(fryer?.unlocked).toBe(true);
  });

  it('verifies starter equipment contains prep table, fryer, and packaging station', () => {
    expect(STARTER_EQUIPMENT.length).toBe(3);
    const categories = STARTER_EQUIPMENT.map(e => e.category);
    expect(categories).toContain('prep');
    expect(categories).toContain('fryer');
    expect(categories).toContain('packing');

    const starterIds = STARTER_EQUIPMENT.map(e => e.id);
    expect(starterIds).toEqual(['prep_table_basic', 'fryer_basic', 'packing_basic']);
  });

  it('verifies starter stations correspond to starter equipment', () => {
    expect(STARTER_STATIONS.length).toBe(3);
    const stationTypes = STARTER_STATIONS.map(s => s.stationType);
    expect(stationTypes).toContain('prep');
    expect(stationTypes).toContain('fryer');
    expect(stationTypes).toContain('packing');

    const prepStation = STARTER_STATIONS.find(s => s.stationType === 'prep');
    expect(prepStation?.equipmentId).toBe('prep_table_basic');
    expect(prepStation?.isOperational).toBe(true);
  });
});

describe('Phase 2: Recipe System & French Fries Specification', () => {
  it('verifies French Fries recipe exists and requires potato, oil, and salt', () => {
    const friesRecipe = getRecipeById('recipe_french_fries');
    expect(friesRecipe).toBeDefined();
    expect(friesRecipe?.category).toBe('fastfood');
    expect(friesRecipe?.unlocked).toBe(true);

    const requiredIngredients = friesRecipe!.ingredients.map(i => i.ingredientId);
    expect(requiredIngredients).toContain('potatoes');
    expect(requiredIngredients).toContain('oil');
    expect(requiredIngredients).toContain('salt');
  });

  it('verifies French Fries requires prep, fryer, and packing equipment', () => {
    const friesRecipe = getRecipeById('recipe_french_fries')!;
    const reqEquipCategories = friesRecipe.requiredEquipment.map(e => e.equipmentCategory);
    expect(reqEquipCategories).toContain('prep');
    expect(reqEquipCategories).toContain('fryer');
    expect(reqEquipCategories).toContain('packing');
  });

  it('verifies French Fries step sequence: Prepare -> Fry -> Season -> Package', () => {
    const friesRecipe = getRecipeById('recipe_french_fries')!;
    expect(friesRecipe.steps.length).toBe(4);

    const [step1, step2, step3, step4] = friesRecipe.steps;

    // Step 1: Prep
    expect(step1.stationType).toBe('prep');
    expect(step1.durationSeconds).toBe(3);
    expect(step1.ingredientConsumption?.[0].ingredientId).toBe('potatoes');

    // Step 2: Fry
    expect(step2.stationType).toBe('fryer');
    expect(step2.durationSeconds).toBe(5);
    expect(step2.ingredientConsumption?.[0].ingredientId).toBe('oil');
    expect(step2.requiredEquipment?.[0].equipmentCategory).toBe('fryer');

    // Step 3: Season
    expect(step3.stationType).toBe('packing');
    expect(step3.durationSeconds).toBe(1);
    expect(step3.ingredientConsumption?.[0].ingredientId).toBe('salt');

    // Step 4: Package
    expect(step4.stationType).toBe('packing');
    expect(step4.durationSeconds).toBe(1);
  });

  it('ensures recipes are data-driven and not hardcoded to a single item', () => {
    expect(RECIPES_CATALOG.length).toBeGreaterThanOrEqual(2);
    const burger = getRecipeById('recipe_burger');
    expect(burger).toBeDefined();
    expect(burger?.steps.length).toBeGreaterThan(0);
    expect(burger?.unlockRequirements).toBeDefined();
  });
});

describe('Phase 2: Save Migration (v1 to v2)', () => {
  it('migrates a legacy v1 save to v2 and preserves existing player state', () => {
    const legacyV1Save = {
      version: 1,
      lastSavedTimestamp: 1696000000000,
      money: 12500,
      xp: 450,
      level: 4,
      reputation: 85,
      brandValue: 320,
      empirePoints: 12,
      currentTierId: 'tier_2_stall',
      selectedSupplierId: 'cheap_market',
      ingredients: { potatoes: 40, oil: 25, beef: 15 },
      foodLevels: { food_burger: { level: 2, unlocked: true, sellingPrice: 16 } },
      hiredEmployees: { emp_cook_bob: { hired: true, level: 2, mood: 90 } },
      upgrades: { upg_grill: 1 },
      prestigeUpgrades: {},
      totalSalesCount: 150,
      totalRevenueEarned: 2400,
      claimedQuests: ['q_first_sale'],
      unlockedAchievements: ['ach_first_dollar']
    };

    const migrated = StorageService.migrate(legacyV1Save);
    expect(migrated).not.toBeNull();
    expect(migrated?.version).toBe(2);

    // Preserved player state
    expect(migrated?.money).toBe(12500);
    expect(migrated?.xp).toBe(450);
    expect(migrated?.level).toBe(4);
    expect(migrated?.reputation).toBe(85);
    expect(migrated?.currentTierId).toBe('tier_2_stall');
    expect(migrated?.ingredients.potatoes).toBe(40);
    expect(migrated?.ingredients.oil).toBe(25);
    expect(migrated?.hiredEmployees.emp_cook_bob.hired).toBe(true);

    // Injected starter equipment & stations
    expect(migrated?.equipment).toBeDefined();
    expect(migrated?.equipment?.length).toBe(3);
    expect(migrated?.stations).toBeDefined();
    expect(migrated?.stations?.length).toBe(3);
    expect(migrated?.unlockedRecipeIds).toContain('recipe_french_fries');
  });

  it('guarantees save migration is idempotent and does not duplicate equipment', () => {
    const legacyV1Save = {
      version: 1,
      money: 1000,
      xp: 50,
      ingredients: { potatoes: 10 }
    };

    const firstMigration = StorageService.migrate(legacyV1Save)!;
    expect(firstMigration.equipment?.length).toBe(3);
    expect(firstMigration.stations?.length).toBe(3);

    // Run migration a second time on the already migrated output
    const secondMigration = StorageService.migrate(firstMigration)!;
    expect(secondMigration.equipment?.length).toBe(3);
    expect(secondMigration.stations?.length).toBe(3);
    expect(secondMigration.version).toBe(2);
    expect(secondMigration.money).toBe(1000);
  });
});
