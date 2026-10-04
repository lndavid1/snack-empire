import { describe, it, expect } from 'vitest';
import { EQUIPMENT_CATALOG, STARTER_EQUIPMENT, STARTER_STATIONS, getEquipmentById } from '../data/equipment';
import { RECIPES_CATALOG, getRecipeById } from '../data/recipes';
import { StorageService } from '../services/storage';
import { useGameStore } from '../store/gameStore';

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

describe('Phase 3: Production Engine & Cooking Workflow', () => {
  it('creates production job for valid unlocked recipe and protects against duplicates', () => {
    const store = useGameStore.getState();
    // Reset state for test
    useGameStore.setState({
      productionJobs: [],
      unlockedRecipeIds: ['recipe_french_fries'],
      ingredients: store.ingredients.map(i => ({ ...i, stock: 100 }))
    });

    const res1 = useGameStore.getState().enqueueProductionJob('recipe_french_fries', 'order_cust_001');
    expect(res1.success).toBe(true);
    expect(res1.jobId).toBeDefined();

    // Duplicate protection for same order
    const resDuplicate = useGameStore.getState().enqueueProductionJob('recipe_french_fries', 'order_cust_001');
    expect(resDuplicate.success).toBe(false);
    expect(resDuplicate.reason).toContain('đang chế biến');

    // Unknown recipe rejection
    const resUnknown = useGameStore.getState().enqueueProductionJob('recipe_non_existent');
    expect(resUnknown.success).toBe(false);

    // Locked recipe rejection
    useGameStore.setState({ unlockedRecipeIds: [] });
    const resLocked = useGameStore.getState().enqueueProductionJob('recipe_french_fries');
    expect(resLocked.success).toBe(false);
    expect(resLocked.reason).toContain('chưa được mở khóa');
  });

  it('rejects job creation if ingredients or equipment are insufficient', () => {
    // Missing ingredients
    useGameStore.setState({
      productionJobs: [],
      unlockedRecipeIds: ['recipe_french_fries'],
      autoRestock: false,
      ingredients: useGameStore.getState().ingredients.map(i => 
        i.id === 'potatoes' ? { ...i, stock: 0 } : { ...i, stock: 20 }
      )
    });

    const resNoPotatoes = useGameStore.getState().enqueueProductionJob('recipe_french_fries');
    expect(resNoPotatoes.success).toBe(false);
    expect(resNoPotatoes.reason).toContain('Thiếu nguyên liệu');

    // Broken equipment (condition 0)
    useGameStore.setState({
      ingredients: useGameStore.getState().ingredients.map(i => ({ ...i, stock: 50 })),
      equipment: useGameStore.getState().equipment.map(e => 
        e.id === 'fryer_basic' ? { ...e, condition: 0 } : e
      )
    });

    const resBrokenFryer = useGameStore.getState().enqueueProductionJob('recipe_french_fries');
    expect(resBrokenFryer.success).toBe(false);
    expect(resBrokenFryer.reason).toContain('hỏng');
  });

  it('simulates complete French Fries workflow: Prep -> Fry -> Season -> Package -> READY', () => {
    // Fresh setup
    useGameStore.setState({
      productionJobs: [],
      unlockedRecipeIds: ['recipe_french_fries'],
      stations: STARTER_STATIONS.map(s => ({ ...s, queue: [], activeJobId: undefined })),
      equipment: STARTER_EQUIPMENT.map(e => ({ ...e, condition: 100 })),
      ingredients: useGameStore.getState().ingredients.map(i => ({ ...i, stock: 50 }))
    });

    const initialPotatoes = useGameStore.getState().ingredients.find(i => i.id === 'potatoes')!.stock;
    const initialOil = useGameStore.getState().ingredients.find(i => i.id === 'oil')!.stock;
    const initialSalt = useGameStore.getState().ingredients.find(i => i.id === 'salt')!.stock;

    // 1. Enqueue French Fries
    const enqueueRes = useGameStore.getState().enqueueProductionJob('recipe_french_fries', 'cust_test_fries');
    expect(enqueueRes.success).toBe(true);
    const jobId = enqueueRes.jobId!;

    let job = useGameStore.getState().productionJobs.find(j => j.id === jobId)!;
    expect(job.status).toBe('QUEUED');
    expect(job.currentStepIndex).toBe(0);

    // 2. Step 1: Prep Potato (duration: 3s)
    // Run 1s
    useGameStore.getState().processProduction(1);
    job = useGameStore.getState().productionJobs.find(j => j.id === jobId)!;
    expect(job.status).toBe('PREPARING');
    expect(job.progress).toBeGreaterThan(0);
    // Potatoes consumed once
    expect(useGameStore.getState().ingredients.find(i => i.id === 'potatoes')!.stock).toBe(initialPotatoes - 1);

    // Finish remaining 2s of Prep
    useGameStore.getState().processProduction(2.1);
    job = useGameStore.getState().productionJobs.find(j => j.id === jobId)!;
    // Should have transitioned to Step 1 (Fryer)
    expect(job.currentStepIndex).toBe(1);
    expect(job.stationId).toBe('starter_fryer_station');

    // 3. Step 2: Deep Fry (duration: 5s)
    useGameStore.getState().processProduction(1);
    job = useGameStore.getState().productionJobs.find(j => j.id === jobId)!;
    expect(job.status).toBe('COOKING');
    // Oil consumed once
    expect(useGameStore.getState().ingredients.find(i => i.id === 'oil')!.stock).toBe(initialOil - 1);

    // Finish remaining 4.1s of Frying
    useGameStore.getState().processProduction(4.1);
    job = useGameStore.getState().productionJobs.find(j => j.id === jobId)!;
    // Should have transitioned to Step 2 (Packing - Season)
    expect(job.currentStepIndex).toBe(2);
    expect(job.stationId).toBe('starter_packing_station');

    // Fryer condition should have decreased by 0.5
    const fryer = useGameStore.getState().equipment.find(e => e.id === 'fryer_basic')!;
    expect(fryer.condition).toBe(99.5);

    // 4. Step 3: Season (duration: 1s)
    useGameStore.getState().processProduction(1.1);
    job = useGameStore.getState().productionJobs.find(j => j.id === jobId)!;
    expect(job.currentStepIndex).toBe(3); // Moved to Step 4 (Package)
    // Salt consumed once
    expect(useGameStore.getState().ingredients.find(i => i.id === 'salt')!.stock).toBe(initialSalt - 1);

    // 5. Step 4: Package (duration: 1s)
    useGameStore.getState().processProduction(1.1);
    job = useGameStore.getState().productionJobs.find(j => j.id === jobId)!;
    // Now READY!
    expect(job.status).toBe('READY');
    expect(job.completedAt).toBeDefined();
    expect(job.qualityScore).toBeGreaterThanOrEqual(60);
    expect(job.qualityScore).toBeLessThanOrEqual(100);

    // Released from packing station
    const packingStation = useGameStore.getState().stations.find(s => s.id === 'starter_packing_station')!;
    expect(packingStation.activeJobId).toBeUndefined();
  });

  it('handles equipment wear and allows repairing equipment', () => {
    useGameStore.setState({
      money: 500,
      equipment: useGameStore.getState().equipment.map(e => 
        e.id === 'fryer_basic' ? { ...e, condition: 40 } : e
      )
    });

    const fryerBefore = useGameStore.getState().equipment.find(e => e.id === 'fryer_basic')!;
    expect(fryerBefore.condition).toBe(40);

    const repaired = useGameStore.getState().repairEquipment('fryer_basic');
    expect(repaired).toBe(true);

    const fryerAfter = useGameStore.getState().equipment.find(e => e.id === 'fryer_basic')!;
    expect(fryerAfter.condition).toBe(100);
    expect(useGameStore.getState().money).toBeLessThan(500); // repair cost deducted
  });

  it('serves READY food to waiting customer and awards revenue', () => {
    const testCustomerId = 'cust_waiting_001';
    useGameStore.setState({
      money: 100,
      totalSalesCount: 0,
      customers: [
        {
          id: testCustomerId,
          name: 'Bảo',
          archetype: 'student',
          avatar: '🎒',
          budget: 20,
          patience: 30,
          currentWait: 25,
          favoriteFoodId: 'food_fries',
          orderedFoodId: 'food_fries',
          state: 'waiting',
          satisfaction: 5,
          quote: 'Thèm khoai chiên quá!'
        }
      ],
      productionJobs: [
        {
          id: 'job_ready_fries',
          orderId: testCustomerId,
          recipeId: 'recipe_french_fries',
          stationId: 'starter_packing_station',
          status: 'READY',
          currentStepIndex: 3,
          progress: 100,
          qualityScore: 95
        }
      ]
    });

    const served = useGameStore.getState().manualCookAndServe(testCustomerId);
    expect(served).toBe(true);

    // Customer removed
    expect(useGameStore.getState().customers.length).toBe(0);
    // Job marked as SERVED
    const job = useGameStore.getState().productionJobs.find(j => j.id === 'job_ready_fries')!;
    expect(job.status).toBe('SERVED');
    // Money increased (base $7 + bonuses)
    expect(useGameStore.getState().money).toBeGreaterThan(100);
    expect(useGameStore.getState().totalSalesCount).toBe(1);
  });
});

