import { create } from 'zustand';
import {
  Ingredient,
  FoodItem,
  Supplier,
  Employee,
  StoreUpgrade,
  Customer,
  Review,
  SnackTokPost,
  Quest,
  Achievement,
  PrestigeUpgrade,
  RandomEvent,
  FloatingText,
  Competitor,
  StoreTierId,
  Equipment,
  ProductionStation,
  ProductionJob,
  Order,
  CustomerMood
} from '../types/game';
import {
  STORE_TIERS,
  INITIAL_INGREDIENTS,
  INITIAL_FOODS,
  SUPPLIERS,
  INITIAL_EMPLOYEES,
  INITIAL_UPGRADES,
  INITIAL_QUESTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_COMPETITORS,
  INITIAL_PRESTIGE_UPGRADES,
  POSSIBLE_EVENTS
} from '../data/initialData';
import { STARTER_EQUIPMENT, STARTER_STATIONS } from '../data/equipment';
import { RECIPES_CATALOG, getRecipeById, getRecipeByFoodItemId } from '../data/recipes';
import { SatisfactionService } from '../services/satisfaction';
import { sound } from '../services/sound';
import { StorageService, SaveData } from '../services/storage';

const CUSTOMER_NAMES = [
  'Minh', 'Hương', 'Đức', 'Linh', 'Khánh', 'Tuấn', 'Trang', 'Bảo', 'Hoàng', 'My',
  'Alex', 'Chloe', 'Kevin', 'Quỳnh', 'Nam', 'An', 'Tùng', 'Ngọc', 'Phương', 'Vũ'
];

const ARCHETYPES: Customer['archetype'][] = ['student', 'gamer', 'office', 'influencer', 'foodie', 'vip', 'grandma'];

const ARCHETYPE_AVATARS: Record<Customer['archetype'], string> = {
  student: '🎒',
  gamer: '🎮',
  office: '💼',
  influencer: '🤳',
  foodie: '🍽️',
  vip: '💎',
  grandma: '👵'
};

const GEN_Z_QUOTES = [
  'Bro, burger ở đây ngon đỉnh chóp!',
  '5 sao không nói nhiều 🔥',
  'Đồ ăn ngon xỉu, ăn xong muốn reset cuộc đời.',
  'Uống 1 ngụm cà phê tỉnh hơn người yêu cũ!',
  'Món này lên SnackTok kiểu gì cũng viral.',
  'Quán đỉnh, lần sau rủ cả hội bạn ghé tiếp.'
];

const getSafeCenterX = () => (typeof window !== 'undefined' ? window.innerWidth / 2 : 200);
const getSafeCenterY = () => (typeof window !== 'undefined' ? window.innerHeight / 2 : 200);

export interface OfflineReport {
  secondsAway: number;
  earnedCash: number;
  ordersCompleted: number;
}

export interface GameState {
  // Currencies & Progression
  money: number;
  xp: number;
  level: number;
  reputation: number;     // 0 to 100
  brandValue: number;
  empirePoints: number;

  // Stats
  totalSalesCount: number;
  totalRevenueEarned: number;
  totalTipsEarned: number;
  totalCustomersServed: number;
  lastSavedTimestamp: number;

  // Stores & Upgrades
  currentTierId: StoreTierId;
  upgrades: StoreUpgrade[];
  prestigeUpgrades: PrestigeUpgrade[];

  // Ingredients & Suppliers
  ingredients: Ingredient[];
  suppliers: Supplier[];
  selectedSupplierId: string;
  autoRestock: boolean;

  // Foods / Recipes
  foods: FoodItem[];

  // Employees
  employees: Employee[];

  // Customer Simulation
  customers: Customer[];
  orders: Order[];

  // Reviews & Social Media
  reviews: Review[];
  snackTokPosts: SnackTokPost[];
  competitors: Competitor[];

  // Events & Quests & Achievements
  activeEvent: RandomEvent | null;
  quests: Quest[];
  achievements: Achievement[];

  // UI state & floating animations
  floatingTexts: FloatingText[];
  offlineReport: OfflineReport | null;
  soundEnabled: boolean;
  gameStarted: boolean;

  // Production & Equipment (Phase 2 Foundation)
  equipment: Equipment[];
  stations: ProductionStation[];
  productionJobs: ProductionJob[];
  unlockedRecipeIds: string[];

  // Actions
  initGame: () => void;
  tickSimulation: () => void;
  manualCookAndServe: (customerId?: string) => boolean;
  buyIngredient: (id: string, amount: number) => boolean;
  setSelectedSupplier: (id: string) => void;
  toggleAutoRestock: () => void;
  unlockFood: (id: string) => boolean;
  upgradeFood: (id: string) => boolean;
  setFoodPrice: (id: string, price: number) => void;
  hireEmployee: (id: string) => boolean;
  upgradeEmployee: (id: string) => boolean;
  buyStoreUpgrade: (id: string) => boolean;
  upgradeStoreTier: (tierId: StoreTierId) => boolean;
  claimQuest: (id: string) => void;
  prestigeReset: () => void;
  buyPrestigeUpgrade: (id: string) => boolean;
  postToSnackTok: (content: string) => void;
  runMarketingCampaign: (cost: number, durationSec: number, name: string) => boolean;
  respondToEvent: (action: 'accept' | 'decline' | 'boost') => void;
  toggleSound: () => void;
  dismissOfflineReport: () => void;
  addFloatingText: (text: string, x: number, y: number, color?: string) => void;
  saveGame: () => void;
  loadGame: () => boolean;
  resetGameData: () => void;
  importSaveData: (jsonStr: string) => boolean;
  exportSaveData: () => void;
  // Phase 2 Station Actions
  assignEmployeeToStation: (employeeId: string, stationId: string) => boolean;
  unassignEmployeeFromStation: (stationId: string) => boolean;
  // Phase 3 Production Engine Actions
  enqueueProductionJob: (recipeId: string, orderId?: string) => { success: boolean; jobId?: string; reason?: string };
  processProduction: (deltaSeconds?: number) => void;
  repairEquipment: (equipmentId: string) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  money: 500,
  xp: 0,
  level: 1,
  reputation: 60,
  brandValue: 100,
  empirePoints: 0,

  totalSalesCount: 0,
  totalRevenueEarned: 0,
  totalTipsEarned: 0,
  totalCustomersServed: 0,
  lastSavedTimestamp: Date.now(),

  currentTierId: 'tier_1_cart',
  upgrades: INITIAL_UPGRADES,
  prestigeUpgrades: INITIAL_PRESTIGE_UPGRADES,

  ingredients: INITIAL_INGREDIENTS,
  suppliers: SUPPLIERS,
  selectedSupplierId: 'cheap_market',
  autoRestock: false,

  foods: INITIAL_FOODS,
  employees: INITIAL_EMPLOYEES,
  customers: [],
  orders: [],

  reviews: [
    {
      id: 'rev_1',
      customerName: 'Minh GenZ',
      avatar: '🎒',
      stars: 5,
      comment: 'Xe đẩy nhỏ nhưng burger làm cẩn thận, bánh giòn sốt ngon xỉu!',
      timeAgo: 'Vừa xong',
      foodName: 'Burger Bò Phô Mai'
    }
  ],
  snackTokPosts: [
    {
      id: 'post_1',
      author: 'Snack Empire Official',
      handle: '@snackempire',
      avatar: '🍔',
      content: 'Chính thức mở bán chiếc xe burger đầu tiên bên vỉa hè! Ghé ủng hộ khởi nghiệp nhé cả nhà ơi! 🔥🥖',
      likes: 128,
      commentsCount: 14,
      shares: 6,
      trendTag: '#KhoiNghiepBurger #AnVatSaiGon',
      isPlayerPost: true
    }
  ],
  competitors: INITIAL_COMPETITORS,

  activeEvent: null,
  quests: INITIAL_QUESTS,
  achievements: INITIAL_ACHIEVEMENTS,

  floatingTexts: [],
  offlineReport: null,
  soundEnabled: true,
  gameStarted: false,

  // Production & Equipment Initial State
  equipment: STARTER_EQUIPMENT.map(e => ({ ...e })),
  stations: STARTER_STATIONS.map(s => ({ ...s, queue: [] })),
  productionJobs: [],
  unlockedRecipeIds: ['recipe_french_fries'],

  initGame: () => {
    // Try to load existing save
    const loaded = get().loadGame();
    if (!loaded) {
      // First time player
      set({ gameStarted: true });
    }
  },

  toggleSound: () => {
    const nextState = !get().soundEnabled;
    sound.setMuted(!nextState);
    set({ soundEnabled: nextState });
  },

  addFloatingText: (text: string, x: number, y: number, color = 'text-amber-400') => {
    const id = `fl_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    set(state => ({
      floatingTexts: [...state.floatingTexts.slice(-10), { id, text, x, y, color }]
    }));
    setTimeout(() => {
      set(state => ({
        floatingTexts: state.floatingTexts.filter(f => f.id !== id)
      }));
    }, 1100);
  },

  setSelectedSupplier: (id: string) => {
    sound.playClick();
    set({ selectedSupplierId: id });
  },

  toggleAutoRestock: () => {
    sound.playClick();
    set(state => ({ autoRestock: !state.autoRestock }));
  },

  dismissOfflineReport: () => {
    sound.playCoin();
    set({ offlineReport: null });
  },

  // Manual Cook & Serve Button (Hero Action & Service Pipeline)
  manualCookAndServe: (customerId?: string) => {
    const state = get();
    const customers = [...state.customers];
    if (customers.length === 0) return false;

    // 1. Check if there is an existing READY job that can be served
    const readyJobIdx = state.productionJobs.findIndex(j => 
      j.status === 'READY' && (!customerId || j.orderId === customerId)
    );

    if (readyJobIdx !== -1) {
      const readyJob = state.productionJobs[readyJobIdx];
      // Find matching customer
      let targetIdx = -1;
      if (readyJob.orderId) {
        targetIdx = customers.findIndex(c => c.id === readyJob.orderId && c.state === 'waiting');
      }
      if (targetIdx === -1) {
        // Fallback: match by ordered food or first waiting customer
        targetIdx = customers.findIndex(c => {
          if (c.state !== 'waiting') return false;
          const matchRecipe = getRecipeByFoodItemId(c.orderedFoodId || '');
          return matchRecipe && matchRecipe.id === readyJob.recipeId;
        });
      }
      if (targetIdx === -1 && customers.some(c => c.state === 'waiting')) {
        targetIdx = customers.findIndex(c => c.state === 'waiting');
      }

      if (targetIdx !== -1) {
        const customer = customers[targetIdx];
        const recipe = getRecipeById(readyJob.recipeId);
        const earnedBase = recipe ? recipe.basePrice : 7;
        const profitUpgrade = state.prestigeUpgrades.find(p => p.effectType === 'profit_boost');
        const prestigeBonus = profitUpgrade ? 1 + profitUpgrade.level * profitUpgrade.effectMultiplier : 1;
        const eventRevenueMult = state.activeEvent?.multiplier.revenue || 1;
        const qualityBonus = readyJob.qualityScore ? Math.max(0.8, readyJob.qualityScore / 100) : 1;

        const earned = Math.round(earnedBase * prestigeBonus * eventRevenueMult * qualityBonus);
        const now = Date.now();
        const freshness = readyJob.freshness !== undefined ? readyJob.freshness : SatisfactionService.calculateFoodFreshness(readyJob.readyAt || now, now);
        const temperature = readyJob.temperature !== undefined ? readyJob.temperature : SatisfactionService.calculateFoodTemperature(readyJob.readyAt || now, now);
        const qualityScore = readyJob.qualityScore || 80;
        const waitingTime = customer.waitingTime || Math.max(0, (customer.maxPatience || 20) - (customer.patience || 0));
        const maxPatience = customer.maxPatience || 20;
        const priceValueScore = SatisfactionService.calculatePriceValueScore(
          earnedBase,
          earnedBase,
          qualityScore,
          customer.priceSensitivity || 1.0
        );

        const satisfactionResult = SatisfactionService.calculateSatisfaction({
          waitingTime,
          maxPatience,
          qualityScore,
          freshness,
          temperature,
          orderAccuracy: 100,
          priceValueScore,
          basePrice: earnedBase,
          foodName: recipe ? recipe.name : 'Khoai Tây Chiên',
          customerName: customer.name,
          customerAvatar: customer.avatar,
          customerId: customer.id,
          orderId: customer.orderId,
          foodId: customer.orderedFoodId
        });

        const tipAmount = satisfactionResult.tipAmount;
        const totalEarned = earned + tipAmount;
        const xpGained = Math.round(totalEarned * 1.2);
        const newMoney = state.money + totalEarned;
        const newTips = state.totalTipsEarned + tipAmount;
        const newXp = state.xp + xpGained;
        const newSales = state.totalSalesCount + 1;
        const newRevenue = state.totalRevenueEarned + totalEarned;
        const newCustomersServed = state.totalCustomersServed + 1;
        const newLevel = Math.floor(Math.sqrt(newXp / 50)) + 1;

        if (newLevel > state.level) {
          sound.playLevelUp();
          state.addFloatingText(`🎉 LEVEL UP ${newLevel}!`, getSafeCenterX(), getSafeCenterY() - 100, 'text-yellow-300 font-extrabold text-2xl');
        } else {
          sound.playCoin();
        }

        customers.splice(targetIdx, 1);
        if (tipAmount > 0) {
          state.addFloatingText(`+ $${earned} (+$${tipAmount} tip 💵)`, getSafeCenterX() + (Math.random() * 80 - 40), getSafeCenterY() - 20, 'text-emerald-400 font-bold');
        } else {
          state.addFloatingText(`+ $${earned} 🍟`, getSafeCenterX() + (Math.random() * 80 - 40), getSafeCenterY() - 20, 'text-emerald-400 font-bold');
        }

        // Mark job as SERVED
        const updatedJobs = state.productionJobs.map((j, idx) => 
          idx === readyJobIdx ? { ...j, status: 'SERVED' as const } : j
        );

        // Update linked orders
        const updatedOrders = state.orders.map(o => {
          if (o.id === customer.orderId || o.customerId === customer.id || o.productionJobId === readyJob.id) {
            return {
              ...o,
              status: 'SERVED' as const,
              servedAt: now,
              satisfactionScore: satisfactionResult.score,
              tipAmount,
              finalPrice: totalEarned,
              reviewId: satisfactionResult.review.id
            };
          }
          return o;
        });

        // Add review
        const updatedReviews = [satisfactionResult.review, ...state.reviews.slice(0, 19)];

        // Quests & achievements
        const updatedQuests = state.quests.map(q => {
          if (q.id === 'q_first_sale') return { ...q, progress: Math.min(q.target, q.progress + 1), completed: true };
          if (q.id === 'q_sell_10') return { ...q, progress: Math.min(q.target, q.progress + 1), completed: q.progress + 1 >= q.target };
          if (q.id === 'q_reach_100_customers') return { ...q, progress: Math.min(q.target, newCustomersServed), completed: newCustomersServed >= q.target };
          return q;
        });

        const updatedAchievements = state.achievements.map(ach => {
          if (ach.id === 'ach_first_dollar' && !ach.unlocked) return { ...ach, unlocked: true, unlockedAt: Date.now() };
          if (ach.id === 'ach_1k_cash' && newMoney >= 1000 && !ach.unlocked) return { ...ach, unlocked: true, unlockedAt: Date.now() };
          if (ach.id === 'ach_touch_grass' && newSales >= 500 && !ach.unlocked) return { ...ach, unlocked: true, unlockedAt: Date.now() };
          return ach;
        });

        set({
          money: newMoney,
          xp: newXp,
          level: newLevel,
          totalSalesCount: newSales,
          totalRevenueEarned: newRevenue,
          totalTipsEarned: newTips,
          totalCustomersServed: newCustomersServed,
          customers,
          orders: updatedOrders,
          productionJobs: updatedJobs,
          reviews: updatedReviews,
          quests: updatedQuests,
          achievements: updatedAchievements,
          reputation: Math.min(100, Math.max(0, state.reputation + satisfactionResult.reputationDelta)),
          brandValue: state.brandValue + 2
        });

        return true;
      }
    }

    // 2. Pick target customer for production or legacy serving
    const targetIdx = customerId 
      ? customers.findIndex(c => c.id === customerId && c.state === 'waiting')
      : customers.findIndex(c => c.state === 'waiting');

    if (targetIdx === -1) return false;
    const customer = customers[targetIdx];

    // 3. If customer's order is supported by production engine, handle via production pipeline
    const matchingRecipe = getRecipeByFoodItemId(customer.orderedFoodId || '');
    if (matchingRecipe && state.unlockedRecipeIds.includes(matchingRecipe.id)) {
      const activeJob = state.productionJobs.find(j => 
        j.orderId === customer.id && ['QUEUED', 'PREPARING', 'COOKING', 'ASSEMBLING', 'PACKING'].includes(j.status)
      );
      if (activeJob) {
        state.addFloatingText('⏳ Món đang được nấu trong bếp...', getSafeCenterX(), getSafeCenterY() - 40, 'text-amber-300 font-bold');
        return false;
      }

      const result = get().enqueueProductionJob(matchingRecipe.id, customer.id);
      if (result.success) {
        sound.playClick();
        state.addFloatingText(`👨‍🍳 Bắt đầu làm ${matchingRecipe.name}!`, getSafeCenterX(), getSafeCenterY() - 40, 'text-indigo-400 font-bold');
        return true;
      } else {
        sound.playError();
        state.addFloatingText(`🚨 ${result.reason || 'Chưa thể chế biến!'}`, getSafeCenterX(), getSafeCenterY() - 40, 'text-rose-400 font-bold');
        return false;
      }
    }

    // 4. Legacy fallback for foods without production recipe
    const unlockedFoods = state.foods.filter(f => f.isUnlocked);
    if (unlockedFoods.length === 0) return false;

    const foodToServe = unlockedFoods.find(f => f.id === customer.orderedFoodId) 
      || unlockedFoods.find(f => f.id === customer.favoriteFoodId) 
      || unlockedFoods[0];

    // Check ingredients
    const currentIngredients = [...state.ingredients];
    let hasAllIngredients = true;

    for (const req of foodToServe.ingredients) {
      const ing = currentIngredients.find(i => i.id === req.ingredientId);
      if (!ing || ing.stock < req.amount) {
        hasAllIngredients = false;
        break;
      }
    }

    // Auto restock if needed
    if (!hasAllIngredients) {
      if (state.autoRestock) {
        for (const req of foodToServe.ingredients) {
          const ing = currentIngredients.find(i => i.id === req.ingredientId);
          if (ing && ing.stock < req.amount) {
            const supplier = state.suppliers.find(s => s.id === state.selectedSupplierId) || state.suppliers[0];
            const batchCost = ing.basePrice * ing.minBatch * supplier.discountRate;
            if (state.money >= batchCost) {
              set(s => ({ money: s.money - batchCost }));
              ing.stock += ing.minBatch;
            }
          }
        }
        hasAllIngredients = foodToServe.ingredients.every(req => {
          const ing = currentIngredients.find(i => i.id === req.ingredientId);
          return ing && ing.stock >= req.amount;
        });
      }
    }

    if (!hasAllIngredients) {
      sound.playError();
      state.addFloatingText('🚨 Hết nguyên liệu!', getSafeCenterX(), getSafeCenterY() - 40, 'text-red-400');
      return false;
    }

    // Deduct ingredients
    for (const req of foodToServe.ingredients) {
      const ing = currentIngredients.find(i => i.id === req.ingredientId);
      if (ing) {
        ing.stock -= req.amount;
      }
    }

    const profitUpgrade = state.prestigeUpgrades.find(p => p.effectType === 'profit_boost');
    const prestigeBonus = profitUpgrade ? 1 + profitUpgrade.level * profitUpgrade.effectMultiplier : 1;
    const eventRevenueMult = state.activeEvent?.multiplier.revenue || 1;

    const earned = Math.round(foodToServe.sellingPrice * prestigeBonus * eventRevenueMult);
    const now = Date.now();
    const waitingTime = customer.waitingTime || Math.max(0, (customer.maxPatience || 20) - (customer.patience || 0));
    const maxPatience = customer.maxPatience || 20;
    const qualityScore = Math.min(100, 75 + foodToServe.level * 5);
    const priceValueScore = SatisfactionService.calculatePriceValueScore(
      foodToServe.sellingPrice,
      foodToServe.sellingPrice,
      qualityScore,
      customer.priceSensitivity || 1.0
    );

    const satisfactionResult = SatisfactionService.calculateSatisfaction({
      waitingTime,
      maxPatience,
      qualityScore,
      freshness: 100,
      temperature: 100,
      orderAccuracy: 100,
      priceValueScore,
      basePrice: foodToServe.sellingPrice,
      foodName: foodToServe.name,
      customerName: customer.name,
      customerAvatar: customer.avatar,
      customerId: customer.id,
      orderId: customer.orderId,
      foodId: foodToServe.id
    });

    const tipAmount = satisfactionResult.tipAmount;
    const totalEarned = earned + tipAmount;
    const xpGained = Math.round(totalEarned * 1.2);
    const newMoney = state.money + totalEarned;
    const newTips = state.totalTipsEarned + tipAmount;
    const newXp = state.xp + xpGained;
    const newSales = state.totalSalesCount + 1;
    const newRevenue = state.totalRevenueEarned + totalEarned;
    const newCustomersServed = state.totalCustomersServed + 1;

    const newLevel = Math.floor(Math.sqrt(newXp / 50)) + 1;
    if (newLevel > state.level) {
      sound.playLevelUp();
      state.addFloatingText(`🎉 LEVEL UP ${newLevel}!`, getSafeCenterX(), getSafeCenterY() - 100, 'text-yellow-300 font-extrabold text-2xl');
    } else {
      sound.playCoin();
    }

    customers.splice(targetIdx, 1);
    if (tipAmount > 0) {
      state.addFloatingText(`+ $${earned} (+$${tipAmount} tip 💵)`, getSafeCenterX() + (Math.random() * 80 - 40), getSafeCenterY() - 20, 'text-emerald-400 font-bold');
    } else {
      state.addFloatingText(`+ $${earned} 💵`, getSafeCenterX() + (Math.random() * 80 - 40), getSafeCenterY() - 20, 'text-emerald-400 font-bold');
    }

    const updatedOrders = state.orders.map(o => {
      if (o.id === customer.orderId || o.customerId === customer.id) {
        return {
          ...o,
          status: 'SERVED' as const,
          servedAt: now,
          satisfactionScore: satisfactionResult.score,
          tipAmount,
          finalPrice: totalEarned,
          reviewId: satisfactionResult.review.id
        };
      }
      return o;
    });

    const updatedReviews = [satisfactionResult.review, ...state.reviews.slice(0, 19)];

    const updatedQuests = state.quests.map(q => {
      if (q.id === 'q_first_sale') return { ...q, progress: Math.min(q.target, q.progress + 1), completed: true };
      if (q.id === 'q_sell_10') return { ...q, progress: Math.min(q.target, q.progress + 1), completed: q.progress + 1 >= q.target };
      if (q.id === 'q_reach_100_customers') return { ...q, progress: Math.min(q.target, newCustomersServed), completed: newCustomersServed >= q.target };
      return q;
    });

    const updatedAchievements = state.achievements.map(ach => {
      if (ach.id === 'ach_first_dollar' && !ach.unlocked) return { ...ach, unlocked: true, unlockedAt: Date.now() };
      if (ach.id === 'ach_1k_cash' && newMoney >= 1000 && !ach.unlocked) return { ...ach, unlocked: true, unlockedAt: Date.now() };
      if (ach.id === 'ach_touch_grass' && newSales >= 500 && !ach.unlocked) return { ...ach, unlocked: true, unlockedAt: Date.now() };
      return ach;
    });

    set({
      money: newMoney,
      xp: newXp,
      level: newLevel,
      totalSalesCount: newSales,
      totalRevenueEarned: newRevenue,
      totalTipsEarned: newTips,
      totalCustomersServed: newCustomersServed,
      ingredients: currentIngredients,
      customers,
      orders: updatedOrders,
      reviews: updatedReviews,
      quests: updatedQuests,
      achievements: updatedAchievements,
      reputation: Math.min(100, Math.max(0, state.reputation + satisfactionResult.reputationDelta)),
      brandValue: state.brandValue + 2
    });

    return true;
  },

  // Main Simulation Loop (Called every second)
  tickSimulation: () => {
    // 0. Production Engine Tick (Process stations, cooking timers, equipment wear)
    get().processProduction(1);

    // 1. Employee automation
    const stateBeforeAuto = get();
    const hasCook = stateBeforeAuto.employees.some(e => e.role === 'cook' && e.hired);
    const hasCashier = stateBeforeAuto.employees.some(e => e.role === 'cashier' && e.hired);

    // Auto service if both cook and cashier are working
    if (hasCook && hasCashier && stateBeforeAuto.customers.length > 0) {
      // Cook speed bonus
      const cook = stateBeforeAuto.employees.find(e => e.role === 'cook' && e.hired)!;
      const speedUpgrade = stateBeforeAuto.upgrades.find(u => u.effectType === 'speed');
      const speedMultiplier = 1 + (cook.speed / 100) + (speedUpgrade ? speedUpgrade.level * speedUpgrade.effectValue : 0);
      
      // Serve up to N customers depending on tier and speed
      const customersToServeCount = Math.max(1, Math.floor(speedMultiplier * 0.8));
      for (let i = 0; i < customersToServeCount; i++) {
        get().manualCookAndServe();
      }
    }

    const state = get();
    const currentTier = STORE_TIERS.find(t => t.id === state.currentTierId) || STORE_TIERS[0];

    // Calculate total employee salary cost
    const hiredEmployees = state.employees.filter(e => e.hired);
    const totalSalaryPerSec = hiredEmployees.reduce((sum, e) => sum + e.salaryPerSec, 0);

    let updatedMoney = state.money - totalSalaryPerSec;
    if (updatedMoney < 0) {
      updatedMoney = 0; // prevent extreme negative
    }

    // 2. Customer Waiting, Patience & Rage Quit
    const activeCustomers: Customer[] = [];
    let updatedOrders = [...state.orders];
    let updatedJobs = [...state.productionJobs];
    let updatedStations = state.stations.map(s => ({ ...s, queue: [...s.queue] }));
    let updatedReviews = [...state.reviews];
    let updatedReputation = state.reputation;

    for (const c of state.customers) {
      if (c.state === 'waiting') {
        const maxPatience = c.maxPatience || 20;
        const currentPatience = c.patience !== undefined ? c.patience : (c.currentWait !== undefined ? c.currentWait : 20);
        const nextPatience = currentPatience - 1;
        const nextWaiting = (c.waitingTime || 0) + 1;

        if (nextPatience <= 0) {
          // Customer rage quits!
          updatedReputation = Math.max(0, updatedReputation - 1.0);

          // Cancel linked order
          if (c.orderId) {
            const ord = updatedOrders.find(o => o.id === c.orderId || o.customerId === c.id);
            if (ord) ord.status = 'CANCELLED';
          }

          // Cancel active / queued production jobs for this customer and clear from station
          for (const j of updatedJobs) {
            if ((j.orderId === c.id || j.orderId === c.orderId) && ['QUEUED', 'PREPARING', 'COOKING', 'ASSEMBLING', 'PACKING', 'READY'].includes(j.status)) {
              j.status = 'CANCELLED';
              for (const st of updatedStations) {
                st.queue = st.queue.filter(id => id !== j.id);
                if (st.activeJobId === j.id) {
                  st.activeJobId = st.queue.length > 0 ? st.queue[0] : undefined;
                }
              }
            }
          }

          // Add 1-star rage review
          const chosenFood = state.foods.find(f => f.id === c.orderedFoodId || f.id === c.favoriteFoodId);
          const rageReview: Review = {
            id: `rev_${Date.now()}_rage_${c.id}`,
            customerId: c.id,
            orderId: c.orderId,
            foodId: c.orderedFoodId,
            customerName: c.name,
            avatar: c.avatar,
            stars: 1,
            satisfactionScore: 10,
            comment: `Chờ quá lâu không chịu nổi, phục vụ tệ hại! 😡 Bỏ về luôn!`,
            timeAgo: 'Vừa xong',
            foodName: chosenFood ? chosenFood.name : 'Món ăn',
            tipAmount: 0,
            createdAt: Date.now()
          };
          updatedReviews = [rageReview, ...updatedReviews.slice(0, 19)];
          state.addFloatingText(`${c.name} bực bội bỏ về! (-1.0 ⭐)`, getSafeCenterX(), getSafeCenterY() - 30, 'text-rose-500 font-bold');
          continue; // customer rage quits and leaves
        }

        // Calculate dynamic mood
        const ratio = nextPatience / maxPatience;
        let mood: CustomerMood = 'NEUTRAL';
        if (ratio > 0.8) mood = 'DELIGHTED';
        else if (ratio > 0.6) mood = 'HAPPY';
        else if (ratio > 0.35) mood = 'NEUTRAL';
        else if (ratio > 0.1) mood = 'IMPATIENT';
        else mood = 'ANGRY';

        activeCustomers.push({
          ...c,
          patience: nextPatience,
          currentWait: nextPatience,
          waitingTime: nextWaiting,
          mood
        });

        if (c.orderId) {
          const ord = updatedOrders.find(o => o.id === c.orderId || o.customerId === c.id);
          if (ord) ord.waitingTime = nextWaiting;
        }
      } else {
        activeCustomers.push(c);
      }
    }

    // 3. Customer Spawning
    const trafficUpgrade = state.upgrades.find(u => u.effectType === 'traffic');
    const trafficBonus = trafficUpgrade ? 1 + trafficUpgrade.level * trafficUpgrade.effectValue : 1;
    const eventTrafficBonus = state.activeEvent?.multiplier.traffic || 1;
    const prestigeTraffic = state.prestigeUpgrades.find(p => p.effectType === 'traffic');
    const prestigeBonus = prestigeTraffic ? 1 + prestigeTraffic.level * prestigeTraffic.effectMultiplier : 1;

    const baseSpawnChance = 0.45 * currentTier.trafficMultiplier * trafficBonus * eventTrafficBonus * prestigeBonus;

    // Check capacity
    const capacityUpgrade = state.upgrades.find(u => u.effectType === 'capacity');
    const extraCapacity = capacityUpgrade ? capacityUpgrade.level * capacityUpgrade.effectValue : 0;
    const maxCapacity = currentTier.maxCustomers + extraCapacity;

    let newlySpawnedCustomer: Customer | null = null;
    let newlySpawnedOrder: Order | null = null;

    if (activeCustomers.length < maxCapacity && Math.random() < baseSpawnChance) {
      const archetype = ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)];
      const unlockedFoods = state.foods.filter(f => f.isUnlocked);
      const chosenFood = unlockedFoods.length > 0 
        ? unlockedFoods[Math.floor(Math.random() * unlockedFoods.length)] 
        : state.foods[0];

      const basePatience = archetype === 'vip' ? 16 : archetype === 'office' ? 18 : archetype === 'foodie' ? 22 : 25;
      const initialPatience = Math.floor(basePatience + Math.random() * 8);
      const custId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const ordId = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

      const priceSensitivity = archetype === 'student' ? 1.4 : archetype === 'vip' ? 0.7 : 1.0;
      const qualitySensitivity = archetype === 'foodie' || archetype === 'influencer' ? 1.5 : 1.0;
      const speedSensitivity = archetype === 'office' || archetype === 'vip' ? 1.5 : 1.0;

      newlySpawnedCustomer = {
        id: custId,
        name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
        archetype,
        avatar: ARCHETYPE_AVATARS[archetype],
        budget: Math.floor(chosenFood.sellingPrice * (1.2 + Math.random() * 0.5)),
        patience: initialPatience,
        maxPatience: initialPatience,
        waitingTime: 0,
        mood: 'DELIGHTED',
        favoriteFoodId: chosenFood.id,
        orderedFoodId: chosenFood.id,
        orderId: ordId,
        state: 'waiting',
        satisfaction: 5,
        quote: GEN_Z_QUOTES[Math.floor(Math.random() * GEN_Z_QUOTES.length)],
        currentWait: initialPatience,
        priceSensitivity,
        qualitySensitivity,
        speedSensitivity
      };

      newlySpawnedOrder = {
        id: ordId,
        customerId: custId,
        foodId: chosenFood.id,
        quantity: 1,
        createdAt: Date.now(),
        waitingTime: 0,
        status: 'PENDING',
        basePrice: chosenFood.sellingPrice
      };

      activeCustomers.push(newlySpawnedCustomer);
      updatedOrders.push(newlySpawnedOrder);
    }

    // 4. Random Events Tick
    let currentEvent = state.activeEvent;
    if (currentEvent) {
      const remaining = currentEvent.remainingSec - 1;
      if (remaining <= 0) {
        currentEvent = null; // event ended
      } else {
        currentEvent = { ...currentEvent, remainingSec: remaining };
      }
    } else {
      // Chance to trigger a new random event (approx 1 every 70 seconds)
      if (Math.random() < 0.015) {
        const rawEvent = POSSIBLE_EVENTS[Math.floor(Math.random() * POSSIBLE_EVENTS.length)];
        currentEvent = {
          ...rawEvent,
          remainingSec: rawEvent.durationSec
        };
        sound.playAchievement();
      }
    }

    // 5. Auto save every 10 seconds
    const now = Date.now();
    if (now - state.lastSavedTimestamp >= 10000) {
      get().saveGame();
    }

    set({
      money: updatedMoney,
      customers: activeCustomers,
      orders: updatedOrders,
      productionJobs: updatedJobs,
      stations: updatedStations,
      reviews: updatedReviews,
      reputation: updatedReputation,
      activeEvent: currentEvent
    });

    // 6. Auto-enqueue production job if customer ordered a recipe supported by production engine
    if (newlySpawnedCustomer && newlySpawnedOrder) {
      const matchingRecipe = getRecipeByFoodItemId(newlySpawnedCustomer.orderedFoodId || '');
      if (matchingRecipe && state.unlockedRecipeIds.includes(matchingRecipe.id)) {
        get().enqueueProductionJob(matchingRecipe.id, newlySpawnedCustomer.id);
      }
    }
  },

  buyIngredient: (id: string, amount: number) => {
    const state = get();
    const ing = state.ingredients.find(i => i.id === id);
    if (!ing) return false;

    const supplier = state.suppliers.find(s => s.id === state.selectedSupplierId) || state.suppliers[0];
    const totalCost = Math.round(ing.basePrice * amount * supplier.discountRate);

    if (state.money < totalCost) {
      sound.playError();
      state.addFloatingText('Thiếu tiền mua hàng! 💀', window.innerWidth / 2, window.innerHeight / 2, 'text-rose-500');
      return false;
    }

    sound.playCoin();
    set(s => ({
      money: s.money - totalCost,
      ingredients: s.ingredients.map(item => item.id === id ? { ...item, stock: item.stock + amount } : item)
    }));

    return true;
  },

  unlockFood: (id: string) => {
    const state = get();
    const food = state.foods.find(f => f.id === id);
    if (!food || food.isUnlocked) return false;

    if (state.money < food.costToUnlock) {
      sound.playError();
      return false;
    }

    sound.playUpgrade();
    state.addFloatingText(`Mở Khóa ${food.name}! 🚀`, window.innerWidth / 2, window.innerHeight / 2 - 50, 'text-yellow-400 font-bold');

    const updatedQuests = state.quests.map(q => {
      if (q.id === 'q_unlock_drinks' && id === 'food_coffee') {
        return { ...q, progress: 1, completed: true };
      }
      return q;
    });

    set(s => ({
      money: s.money - food.costToUnlock,
      foods: s.foods.map(f => f.id === id ? { ...f, isUnlocked: true } : f),
      quests: updatedQuests,
      brandValue: s.brandValue + 20
    }));

    return true;
  },

  upgradeFood: (id: string) => {
    const state = get();
    const food = state.foods.find(f => f.id === id);
    if (!food || !food.isUnlocked) return false;

    if (state.money < food.upgradeCost) {
      sound.playError();
      return false;
    }

    sound.playUpgrade();
    const nextLevel = food.level + 1;
    const nextCost = Math.round(food.upgradeCost * 1.5);
    const nextPrice = Math.round(food.sellingPrice * 1.25);

    // Achievements check
    const updatedAchievements = state.achievements.map(ach => {
      if (ach.id === 'ach_burger_god' && id === 'food_burger' && nextLevel >= 5 && !ach.unlocked) {
        return { ...ach, unlocked: true, unlockedAt: Date.now() };
      }
      return ach;
    });

    set(s => ({
      money: s.money - food.upgradeCost,
      foods: s.foods.map(f => f.id === id ? {
        ...f,
        level: nextLevel,
        upgradeCost: nextCost,
        sellingPrice: nextPrice,
        popularity: Math.min(100, f.popularity + 2)
      } : f),
      achievements: updatedAchievements,
      brandValue: s.brandValue + 15
    }));

    return true;
  },

  setFoodPrice: (id: string, price: number) => {
    set(s => ({
      foods: s.foods.map(f => f.id === id ? { ...f, sellingPrice: Math.max(1, price) } : f)
    }));
  },

  hireEmployee: (id: string) => {
    const state = get();
    const emp = state.employees.find(e => e.id === id);
    if (!emp || emp.hired) return false;

    if (state.money < emp.hireCost) {
      sound.playError();
      return false;
    }

    sound.playLevelUp();
    state.addFloatingText(`Tuyển thành công ${emp.name}! 🎉`, window.innerWidth / 2, window.innerHeight / 2 - 50, 'text-cyan-400 font-bold');

    const updatedQuests = state.quests.map(q => {
      if (q.id === 'q_hire_staff') return { ...q, progress: 1, completed: true };
      return q;
    });

    // Check automated achievement
    const willHaveCook = emp.role === 'cook' || state.employees.some(e => e.role === 'cook' && e.hired);
    const willHaveCashier = emp.role === 'cashier' || state.employees.some(e => e.role === 'cashier' && e.hired);
    const updatedAchievements = state.achievements.map(ach => {
      if (ach.id === 'ach_automated' && willHaveCook && willHaveCashier && !ach.unlocked) {
        return { ...ach, unlocked: true, unlockedAt: Date.now() };
      }
      return ach;
    });

    set(s => ({
      money: s.money - emp.hireCost,
      employees: s.employees.map(e => e.id === id ? { ...e, hired: true } : e),
      quests: updatedQuests,
      achievements: updatedAchievements,
      brandValue: s.brandValue + 30
    }));

    return true;
  },

  upgradeEmployee: (id: string) => {
    const state = get();
    const emp = state.employees.find(e => e.id === id);
    if (!emp || !emp.hired) return false;

    if (state.money < emp.upgradeCost) {
      sound.playError();
      return false;
    }

    sound.playUpgrade();
    const nextLevel = emp.level + 1;
    const nextCost = Math.round(emp.upgradeCost * 1.6);

    set(s => ({
      money: s.money - emp.upgradeCost,
      employees: s.employees.map(e => e.id === id ? {
        ...e,
        level: nextLevel,
        speed: Math.min(100, e.speed + 10),
        quality: Math.min(100, e.quality + 8),
        upgradeCost: nextCost
      } : e)
    }));

    return true;
  },

  buyStoreUpgrade: (id: string) => {
    const state = get();
    const upg = state.upgrades.find(u => u.id === id);
    if (!upg || upg.level >= upg.maxLevel) return false;

    const currentCost = Math.round(upg.baseCost * Math.pow(upg.costMultiplier, upg.level));
    if (state.money < currentCost) {
      sound.playError();
      return false;
    }

    sound.playUpgrade();
    set(s => ({
      money: s.money - currentCost,
      upgrades: s.upgrades.map(u => u.id === id ? { ...u, level: u.level + 1 } : u),
      brandValue: s.brandValue + 25
    }));

    return true;
  },

  upgradeStoreTier: (tierId: StoreTierId) => {
    const state = get();
    const targetTier = STORE_TIERS.find(t => t.id === tierId);
    if (!targetTier) return false;

    if (state.money < targetTier.cost) {
      sound.playError();
      return false;
    }

    sound.playLevelUp();
    state.addFloatingText(`🏪 LÊN ĐỜI: ${targetTier.name}!`, window.innerWidth / 2, window.innerHeight / 2 - 80, 'text-yellow-400 font-extrabold text-2xl');

    const updatedQuests = state.quests.map(q => {
      if (q.id === 'q_upgrade_store' && targetTier.tierNumber >= 2) {
        return { ...q, progress: 1, completed: true };
      }
      return q;
    });

    set(s => ({
      money: s.money - targetTier.cost,
      currentTierId: tierId,
      quests: updatedQuests,
      brandValue: s.brandValue + targetTier.tierNumber * 100,
      reputation: Math.min(100, s.reputation + 10)
    }));

    return true;
  },

  claimQuest: (id: string) => {
    const state = get();
    const quest = state.quests.find(q => q.id === id);
    if (!quest || !quest.completed || quest.claimed) return;

    sound.playAchievement();
    state.addFloatingText(`+ $${quest.rewardCash} 🎁`, window.innerWidth / 2, window.innerHeight / 2 - 40, 'text-emerald-400 font-bold');

    set(s => ({
      money: s.money + quest.rewardCash,
      xp: s.xp + quest.rewardXP,
      empirePoints: s.empirePoints + (quest.rewardEmpirePoints || 0),
      quests: s.quests.map(q => q.id === id ? { ...q, claimed: true } : q)
    }));
  },

  prestigeReset: () => {
    const state = get();
    // Formula: floor(sqrt(totalRevenueEarned / 10000)) + 1
    const gainedEmpirePoints = Math.max(1, Math.floor(Math.sqrt(state.totalRevenueEarned / 10000)));

    sound.playLevelUp();

    // Check starting cash bonus from prestige upgrades
    const startCashUpg = state.prestigeUpgrades.find(p => p.effectType === 'starting_cash');
    const startingCash = 500 + (startCashUpg ? startCashUpg.level * startCashUpg.effectMultiplier : 0);

    const updatedAchievements = state.achievements.map(ach => {
      if (ach.id === 'ach_first_prestige' && !ach.unlocked) {
        return { ...ach, unlocked: true, unlockedAt: Date.now() };
      }
      return ach;
    });

    set({
      money: startingCash,
      xp: 0,
      level: 1,
      reputation: 65,
      brandValue: 150,
      empirePoints: state.empirePoints + gainedEmpirePoints,
      currentTierId: 'tier_1_cart',
      customers: [],
      foods: INITIAL_FOODS,
      ingredients: INITIAL_INGREDIENTS,
      employees: INITIAL_EMPLOYEES,
      upgrades: INITIAL_UPGRADES,
      achievements: updatedAchievements,
      activeEvent: null
    });

    state.addFloatingText(`✨ TÁI SINH ĐẾ CHẾ! +${gainedEmpirePoints} Empire Points!`, window.innerWidth / 2, window.innerHeight / 2 - 80, 'text-yellow-300 font-bold text-2xl');
    get().saveGame();
  },

  buyPrestigeUpgrade: (id: string) => {
    const state = get();
    const upg = state.prestigeUpgrades.find(p => p.id === id);
    if (!upg || upg.level >= upg.maxLevel) return false;

    if (state.empirePoints < upg.cost) {
      sound.playError();
      return false;
    }

    sound.playUpgrade();
    set(s => ({
      empirePoints: s.empirePoints - upg.cost,
      prestigeUpgrades: s.prestigeUpgrades.map(p => p.id === id ? { ...p, level: p.level + 1, cost: p.cost + 2 } : p)
    }));

    return true;
  },

  postToSnackTok: (content: string) => {
    const state = get();
    sound.playOrderComplete();
    const likes = Math.floor(300 + Math.random() * 2500 * (state.brandValue / 100));
    const comments = Math.floor(likes * 0.12);
    const shares = Math.floor(likes * 0.05);

    const newPost: SnackTokPost = {
      id: `post_${Date.now()}`,
      author: 'Snack Empire CEO 🔥',
      handle: '@snackempire',
      avatar: '👨‍💼',
      content,
      likes,
      commentsCount: comments,
      shares,
      trendTag: '#SnackEmpire #FoodReview #ViralBurger',
      isPlayerPost: true
    };

    // Check achievement
    const updatedAchievements = state.achievements.map(ach => {
      if (ach.id === 'ach_viral_snacktok' && likes >= 10000 && !ach.unlocked) {
        return { ...ach, unlocked: true, unlockedAt: Date.now() };
      }
      return ach;
    });

    set(s => ({
      snackTokPosts: [newPost, ...s.snackTokPosts.slice(0, 9)],
      brandValue: s.brandValue + 50,
      reputation: Math.min(100, s.reputation + 2),
      achievements: updatedAchievements
    }));
  },

  runMarketingCampaign: (cost: number, durationSec: number, name: string) => {
    const state = get();
    if (state.money < cost) {
      sound.playError();
      return false;
    }

    sound.playCoin();
    state.addFloatingText(`📢 Chiến dịch "${name}" Bùng Nổ!`, window.innerWidth / 2, window.innerHeight / 2 - 50, 'text-pink-400 font-bold');

    const marketingEvent: RandomEvent = {
      id: `mkt_${Date.now()}`,
      title: `Chiến Dịch: ${name} 📢`,
      description: 'Quảng cáo phủ sóng mọi mặt trận, khách hàng đổ dồn về quán!',
      icon: '📣',
      type: 'viral',
      durationSec,
      remainingSec: durationSec,
      multiplier: { traffic: 2.2, revenue: 1.3 }
    };

    set(s => ({
      money: s.money - cost,
      activeEvent: marketingEvent,
      brandValue: s.brandValue + 40
    }));

    return true;
  },

  respondToEvent: (action: 'accept' | 'decline' | 'boost') => {
    const state = get();
    if (!state.activeEvent) return;

    sound.playClick();
    if (action === 'accept' && state.activeEvent.options?.[0]?.reward) {
      const reward = state.activeEvent.options[0].reward;
      set(s => ({
        money: s.money + reward,
        activeEvent: null
      }));
      state.addFloatingText(`+ $${reward} 💼`, window.innerWidth / 2, window.innerHeight / 2, 'text-emerald-400 font-bold');
    } else if (action === 'boost' && state.activeEvent.options?.[0]?.cost) {
      const cost = state.activeEvent.options[0].cost;
      if (state.money >= cost) {
        set(s => ({
          money: s.money - cost,
          activeEvent: null
        }));
      }
    } else {
      set({ activeEvent: null });
    }
  },

  // Save / Load / Reset
  saveGame: () => {
    const state = get();
    const data: SaveData = {
      version: 2,
      lastSavedTimestamp: Date.now(),
      money: state.money,
      xp: state.xp,
      level: state.level,
      reputation: state.reputation,
      brandValue: state.brandValue,
      empirePoints: state.empirePoints,
      currentTierId: state.currentTierId,
      selectedSupplierId: state.selectedSupplierId,
      ingredients: state.ingredients.reduce((acc, i) => ({ ...acc, [i.id]: i.stock }), {}),
      foodLevels: state.foods.reduce((acc, f) => ({ ...acc, [f.id]: { level: f.level, unlocked: f.isUnlocked, sellingPrice: f.sellingPrice } }), {}),
      hiredEmployees: state.employees.reduce((acc, e) => ({ ...acc, [e.id]: { hired: e.hired, level: e.level, mood: e.mood, assignedStationId: e.assignedStationId } }), {}),
      upgrades: state.upgrades.reduce((acc, u) => ({ ...acc, [u.id]: u.level }), {}),
      prestigeUpgrades: state.prestigeUpgrades.reduce((acc, p) => ({ ...acc, [p.id]: p.level }), {}),
      totalSalesCount: state.totalSalesCount,
      totalRevenueEarned: state.totalRevenueEarned,
      totalTipsEarned: state.totalTipsEarned,
      claimedQuests: state.quests.filter(q => q.claimed).map(q => q.id),
      unlockedAchievements: state.achievements.filter(a => a.unlocked).map(a => a.id),
      equipment: state.equipment,
      stations: state.stations,
      unlockedRecipeIds: state.unlockedRecipeIds
    };

    StorageService.save(data);
    set({ lastSavedTimestamp: Date.now() });
  },

  loadGame: () => {
    const saved = StorageService.load();
    if (!saved) return false;

    // Check offline earnings
    const now = Date.now();
    const secondsAway = Math.floor((now - (saved.lastSavedTimestamp || now)) / 1000);

    let offlineReport: OfflineReport | null = null;
    let offlineEarnings = 0;
    let offlineOrders = 0;

    // Only compute if away for > 15 seconds
    if (secondsAway > 15) {
      // Check if player had automated staff
      const hadCook = saved.hiredEmployees['emp_cook_bob']?.hired;
      const hadCashier = saved.hiredEmployees['emp_cashier_linh']?.hired;

      if (hadCook && hadCashier) {
        // Cap offline calculation to 8 hours (28800s)
        const effectiveSec = Math.min(secondsAway, 28800);
        const prestigeOffline = saved.prestigeUpgrades?.['prest_offline'] || 0;
        const offlineEfficiency = 0.4 + prestigeOffline * 0.35;

        // Estimate earnings: ~ $3/sec
        offlineEarnings = Math.round(effectiveSec * 2.5 * offlineEfficiency);
        offlineOrders = Math.round(effectiveSec * 0.25 * offlineEfficiency);

        offlineReport = {
          secondsAway,
          earnedCash: offlineEarnings,
          ordersCompleted: offlineOrders
        };
      }
    }

    set(state => ({
      money: saved.money + offlineEarnings,
      xp: saved.xp,
      level: saved.level,
      reputation: saved.reputation || state.reputation,
      brandValue: saved.brandValue || state.brandValue,
      empirePoints: saved.empirePoints || 0,
      currentTierId: (saved.currentTierId as StoreTierId) || 'tier_1_cart',
      selectedSupplierId: saved.selectedSupplierId || 'cheap_market',
      totalSalesCount: (saved.totalSalesCount || 0) + offlineOrders,
      totalRevenueEarned: (saved.totalRevenueEarned || 0) + offlineEarnings,
      totalTipsEarned: saved.totalTipsEarned || 0,
      totalCustomersServed: (state.totalCustomersServed || 0) + offlineOrders,
      ingredients: state.ingredients.map(i => ({
        ...i,
        stock: saved.ingredients[i.id] !== undefined ? saved.ingredients[i.id] : i.stock
      })),
      foods: state.foods.map(f => {
        const savedFood = saved.foodLevels[f.id];
        if (savedFood) {
          return {
            ...f,
            level: savedFood.level,
            isUnlocked: savedFood.unlocked,
            sellingPrice: savedFood.sellingPrice || f.sellingPrice
          };
        }
        return f;
      }),
      employees: state.employees.map(e => {
        const savedEmp = saved.hiredEmployees[e.id];
        if (savedEmp) {
          return {
            ...e,
            hired: savedEmp.hired,
            level: savedEmp.level,
            mood: savedEmp.mood,
            assignedStationId: savedEmp.assignedStationId || e.assignedStationId
          };
        }
        return e;
      }),
      upgrades: state.upgrades.map(u => ({
        ...u,
        level: saved.upgrades[u.id] !== undefined ? saved.upgrades[u.id] : u.level
      })),
      prestigeUpgrades: state.prestigeUpgrades.map(p => ({
        ...p,
        level: saved.prestigeUpgrades?.[p.id] !== undefined ? saved.prestigeUpgrades[p.id] : p.level
      })),
      quests: state.quests.map(q => ({
        ...q,
        claimed: saved.claimedQuests?.includes(q.id) || false
      })),
      achievements: state.achievements.map(a => ({
        ...a,
        unlocked: saved.unlockedAchievements?.includes(a.id) || false
      })),
      equipment: saved.equipment && saved.equipment.length > 0
        ? saved.equipment
        : STARTER_EQUIPMENT.map(e => ({ ...e })),
      stations: saved.stations && saved.stations.length > 0
        ? saved.stations
        : STARTER_STATIONS.map(s => ({ ...s, queue: [] })),
      productionJobs: [],
      unlockedRecipeIds: saved.unlockedRecipeIds && saved.unlockedRecipeIds.length > 0
        ? saved.unlockedRecipeIds
        : ['recipe_french_fries'],
      offlineReport,
      gameStarted: true,
      lastSavedTimestamp: now
    }));

    return true;
  },

  resetGameData: () => {
    StorageService.clear();
    window.location.reload();
  },

  importSaveData: (jsonStr: string) => {
    const validated = StorageService.validateImport(jsonStr);
    if (!validated) return false;
    StorageService.save(validated);
    window.location.reload();
    return true;
  },

  exportSaveData: () => {
    get().saveGame();
    const saved = StorageService.load();
    if (saved) {
      StorageService.exportToFile(saved);
    }
  },

  assignEmployeeToStation: (employeeId: string, stationId: string) => {
    const state = get();
    const employee = state.employees.find(e => e.id === employeeId);
    const station = state.stations.find(s => s.id === stationId);
    if (!employee || !station) return false;

    // Update stations: set new station's assigned employee, clear previous station if assigned
    const updatedStations = state.stations.map(s => {
      if (s.id === stationId) {
        return { ...s, assignedEmployeeId: employeeId };
      }
      if (s.assignedEmployeeId === employeeId) {
        return { ...s, assignedEmployeeId: undefined };
      }
      return s;
    });

    // Update employees: assign stationId to employee, clear any other employee at this station
    const updatedEmployees = state.employees.map(e => {
      if (e.id === employeeId) {
        return { ...e, assignedStationId: stationId };
      }
      if (e.assignedStationId === stationId) {
        return { ...e, assignedStationId: undefined };
      }
      return e;
    });

    set({ stations: updatedStations, employees: updatedEmployees });
    return true;
  },

  unassignEmployeeFromStation: (stationId: string) => {
    const state = get();
    const station = state.stations.find(s => s.id === stationId);
    if (!station || !station.assignedEmployeeId) return false;

    const assignedEmpId = station.assignedEmployeeId;
    const updatedStations = state.stations.map(s => (s.id === stationId ? { ...s, assignedEmployeeId: undefined } : s));
    const updatedEmployees = state.employees.map(e => (e.id === assignedEmpId ? { ...e, assignedStationId: undefined } : e));

    set({ stations: updatedStations, employees: updatedEmployees });
    return true;
  },

  // ----------------------------------------------------
  // PHASE 3: PRODUCTION ENGINE ACTIONS
  // ----------------------------------------------------

  enqueueProductionJob: (recipeId: string, orderId?: string) => {
    const state = get();
    const recipe = getRecipeById(recipeId);
    if (!recipe) {
      return { success: false, reason: 'Không tìm thấy công thức món này' };
    }
    if (!state.unlockedRecipeIds.includes(recipeId)) {
      return { success: false, reason: 'Công thức chưa được mở khóa' };
    }

    // Duplicate active job protection for the same order
    if (orderId) {
      const existingActiveJob = state.productionJobs.find(j => 
        j.orderId === orderId && 
        ['QUEUED', 'PREPARING', 'COOKING', 'ASSEMBLING', 'PACKING', 'READY'].includes(j.status)
      );
      if (existingActiveJob) {
        return { success: false, jobId: existingActiveJob.id, reason: 'Đơn hàng này đã có món đang chế biến' };
      }
    }

    // Verify required equipment
    for (const reqEq of recipe.requiredEquipment) {
      const hasEquip = state.equipment.some(e => 
        e.category === reqEq.equipmentCategory && 
        e.tier >= (reqEq.minimumTier || 1) && 
        e.condition > 0
      );
      if (!hasEquip) {
        return { 
          success: false, 
          reason: `Thiếu thiết bị ${reqEq.equipmentCategory} (Tier ${reqEq.minimumTier || 1}) hoặc thiết bị đã hỏng` 
        };
      }
    }

    // Verify initial station exists
    const firstStep = recipe.steps[0];
    const targetStation = state.stations.find(s => s.stationType === firstStep.stationType && s.isOperational);
    if (!targetStation) {
      return { success: false, reason: `Không có trạm ${firstStep.stationType} nào đang hoạt động` };
    }

    // Verify station equipment condition
    const stationEquip = state.equipment.find(e => e.id === targetStation.equipmentId);
    if (!stationEquip || stationEquip.condition <= 0) {
      return { success: false, reason: `Thiết bị tại trạm ${targetStation.name} bị hỏng hoặc thiếu` };
    }

    // Check station queue capacity
    if (targetStation.queue.length >= targetStation.capacity * 4) {
      return { success: false, reason: `Hàng đợi trạm ${targetStation.name} đã đầy` };
    }

    // Verify ingredient availability for all recipe ingredients
    const currentIngredients = [...state.ingredients];
    let enoughIngredients = true;
    let missingName = '';

    for (const ingReq of recipe.ingredients) {
      const ing = currentIngredients.find(i => i.id === ingReq.ingredientId);
      if (!ing || ing.stock < ingReq.quantity) {
        if (state.autoRestock && ing) {
          const supplier = state.suppliers.find(s => s.id === state.selectedSupplierId) || state.suppliers[0];
          const batchCost = ing.basePrice * ing.minBatch * supplier.discountRate;
          if (state.money >= batchCost) {
            set(s => ({ money: s.money - batchCost }));
            ing.stock += ing.minBatch;
            continue;
          }
        }
        enoughIngredients = false;
        missingName = ing ? ing.name : ingReq.ingredientId;
        break;
      }
    }

    if (!enoughIngredients) {
      return { success: false, reason: `Thiếu nguyên liệu: ${missingName}` };
    }

    // Create new production job
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newJob: ProductionJob = {
      id: jobId,
      orderId,
      recipeId,
      stationId: targetStation.id,
      employeeId: targetStation.assignedEmployeeId,
      status: 'QUEUED',
      currentStepIndex: 0,
      progress: 0,
      startedAt: Date.now(),
      qualityScore: 100,
      consumedStepIndices: []
    };

    const updatedStations = state.stations.map(s => {
      if (s.id === targetStation.id) {
        const newQueue = [...s.queue, jobId];
        return {
          ...s,
          queue: newQueue,
          activeJobId: s.activeJobId || jobId
        };
      }
      return s;
    });

    const updatedOrders = state.orders.map(o => {
      if (orderId && (o.id === orderId || o.customerId === orderId)) {
        return {
          ...o,
          recipeId,
          productionJobId: jobId,
          status: 'PRODUCING' as const
        };
      }
      return o;
    });

    set({
      productionJobs: [...state.productionJobs, newJob],
      stations: updatedStations,
      ingredients: currentIngredients,
      orders: updatedOrders
    });

    return { success: true, jobId };
  },

  repairEquipment: (equipmentId: string) => {
    const state = get();
    const eq = state.equipment.find(e => e.id === equipmentId);
    if (!eq || eq.condition >= 100) return false;

    const repairCost = Math.max(5, Math.round((100 - eq.condition) * 0.5));
    if (state.money < repairCost) {
      sound.playError();
      state.addFloatingText('💸 Không đủ tiền sửa chữa!', getSafeCenterX(), getSafeCenterY() - 40, 'text-red-400 font-bold');
      return false;
    }

    sound.playClick();
    set(s => ({
      money: s.money - repairCost,
      equipment: s.equipment.map(e => e.id === equipmentId ? { ...e, condition: 100 } : e)
    }));
    state.addFloatingText(`🔧 Đã sửa chữa ${eq.name}! (-$${repairCost})`, getSafeCenterX(), getSafeCenterY() - 20, 'text-emerald-400 font-bold');
    return true;
  },

  processProduction: (deltaSeconds = 1) => {
    const state = get();
    if (state.stations.length === 0 || state.productionJobs.length === 0) return;

    const updatedStations = state.stations.map(s => ({ ...s, queue: [...s.queue] }));
    const updatedJobs = state.productionJobs.map(j => ({ ...j, consumedStepIndices: [...(j.consumedStepIndices || [])] }));
    const updatedIngredients = state.ingredients.map(i => ({ ...i }));
    const updatedEquipment = state.equipment.map(e => ({ ...e }));

    // Track jobs processed in this tick to prevent a job from teleporting through multiple stations in a single tick
    const processedJobIdsInTick = new Set<string>();

    for (let stationIdx = 0; stationIdx < updatedStations.length; stationIdx++) {
      const station = updatedStations[stationIdx];
      if (!station.isOperational) continue;

      const equip = updatedEquipment.find(e => e.id === station.equipmentId);
      if (!equip || equip.condition <= 0) continue; // Broken equipment halts station

      // Ensure active job is set from queue if none currently active
      if (!station.activeJobId && station.queue.length > 0) {
        station.activeJobId = station.queue[0];
      }

      if (!station.activeJobId) continue;

      const jobIdx = updatedJobs.findIndex(j => j.id === station.activeJobId);
      if (jobIdx === -1) {
        station.activeJobId = undefined;
        station.queue = station.queue.filter(id => id !== station.activeJobId);
        continue;
      }

      const job = updatedJobs[jobIdx];

      // If job has already been processed in another station during this tick, wait for next tick
      if (processedJobIdsInTick.has(job.id)) {
        continue;
      }
      processedJobIdsInTick.add(job.id);

      // If job is already terminal at this station, clear and proceed
      if (['READY', 'SERVED', 'FAILED', 'CANCELLED'].includes(job.status)) {
        station.activeJobId = undefined;
        station.queue = station.queue.filter(id => id !== job.id);
        if (station.queue.length > 0) {
          station.activeJobId = station.queue[0];
        }
        continue;
      }

      const recipe = getRecipeById(job.recipeId);
      if (!recipe) {
        job.status = 'FAILED';
        station.activeJobId = undefined;
        station.queue = station.queue.filter(id => id !== job.id);
        continue;
      }

      const step = recipe.steps[job.currentStepIndex];
      if (!step) {
        const readyTime = Date.now();
        job.status = 'READY';
        job.completedAt = readyTime;
        job.readyAt = readyTime;
        job.freshness = 100;
        job.temperature = 100;
        station.activeJobId = undefined;
        station.queue = station.queue.filter(id => id !== job.id);
        continue;
      }

      // Update job status according to stationType
      let derivedStatus: ProductionJob['status'] = 'COOKING';
      if (step.stationType === 'prep') derivedStatus = 'PREPARING';
      else if (step.stationType === 'fryer') derivedStatus = 'COOKING';
      else if (step.stationType === 'grill' || step.stationType === 'oven') derivedStatus = 'COOKING';
      else if (step.stationType === 'assembly') derivedStatus = 'ASSEMBLING';
      else if (step.stationType === 'packing') derivedStatus = 'PACKING';
      job.status = derivedStatus;

      // Consume step ingredients if not yet consumed for this step
      if (!job.consumedStepIndices!.includes(job.currentStepIndex)) {
        if (step.ingredientConsumption && step.ingredientConsumption.length > 0) {
          let canConsume = true;
          for (const cons of step.ingredientConsumption) {
            const ing = updatedIngredients.find(i => i.id === cons.ingredientId);
            if (!ing || ing.stock < cons.quantity) {
              canConsume = false;
              break;
            }
          }
          if (canConsume) {
            for (const cons of step.ingredientConsumption) {
              const ing = updatedIngredients.find(i => i.id === cons.ingredientId);
              if (ing) ing.stock -= cons.quantity;
            }
            job.consumedStepIndices!.push(job.currentStepIndex);
          } else {
            // Cannot start progress until ingredients are present
            continue;
          }
        } else {
          job.consumedStepIndices!.push(job.currentStepIndex);
        }
      }

      // Calculate speed and duration multipliers
      let conditionFactor = 1.0;
      if (equip.condition >= 80) conditionFactor = 1.0;
      else if (equip.condition >= 50) conditionFactor = 0.85;
      else if (equip.condition >= 20) conditionFactor = 0.65;
      else if (equip.condition > 0) conditionFactor = 0.4;
      else conditionFactor = 0.0;

      let employeeSpeedMult = 1.0;
      let employeeQuality = 10;
      if (station.assignedEmployeeId) {
        const emp = state.employees.find(e => e.id === station.assignedEmployeeId && e.hired);
        if (emp) {
          employeeSpeedMult = 1 + (emp.speed / 100);
          employeeQuality = emp.quality;
        }
      }

      const totalSpeedFactor = Math.max(0.2, equip.speedMultiplier * conditionFactor * employeeSpeedMult);
      const effectiveDuration = Math.max(0.5, step.durationSeconds / totalSpeedFactor);
      const progressDelta = (deltaSeconds / effectiveDuration) * 100;
      job.progress = Math.min(100, job.progress + progressDelta);

      // Check step completion
      if (job.progress >= 100) {
        // Wear equipment slightly per completed operation
        equip.condition = Math.max(0, equip.condition - 0.5);

        // Check if final step of the recipe
        if (job.currentStepIndex >= recipe.steps.length - 1) {
          const readyTime = Date.now();
          job.status = 'READY';
          job.completedAt = readyTime;
          job.readyAt = readyTime;
          job.freshness = 100;
          job.temperature = 100;
          job.qualityScore = Math.min(100, Math.max(60, Math.round(75 + employeeQuality * 1.2 + (equip.qualityMultiplier - 1) * 20)));

          // Remove from current station queue
          station.activeJobId = undefined;
          station.queue = station.queue.filter(id => id !== job.id);
          if (station.queue.length > 0) {
            station.activeJobId = station.queue[0];
          }
        } else {
          // Transition to next step
          job.currentStepIndex += 1;
          job.progress = 0;

          // Remove from current station
          station.activeJobId = undefined;
          station.queue = station.queue.filter(id => id !== job.id);
          if (station.queue.length > 0) {
            station.activeJobId = station.queue[0];
          }

          // Route to next station required by next step
          const nextStep = recipe.steps[job.currentStepIndex];
          const nextStation = updatedStations.find(s => s.stationType === nextStep.stationType && s.isOperational);
          if (nextStation) {
            job.stationId = nextStation.id;
            job.employeeId = nextStation.assignedEmployeeId;
            nextStation.queue.push(job.id);
            if (!nextStation.activeJobId) {
              nextStation.activeJobId = job.id;
            }
          }
        }
      }
    }

    // Update freshness & temperature on all READY jobs
    const now = Date.now();
    for (const job of updatedJobs) {
      if (job.status === 'READY') {
        if (!job.readyAt) job.readyAt = now;
        job.freshness = SatisfactionService.calculateFoodFreshness(job.readyAt, now);
        job.temperature = SatisfactionService.calculateFoodTemperature(job.readyAt, now);
      }
    }

    // Sync order statuses if jobs became READY
    const updatedOrders = state.orders.map(order => {
      if (order.status === 'PRODUCING' && order.productionJobId) {
        const matchingJob = updatedJobs.find(j => j.id === order.productionJobId);
        if (matchingJob && matchingJob.status === 'READY') {
          return { ...order, status: 'READY' as const };
        }
      }
      return order;
    });

    set({
      stations: updatedStations,
      productionJobs: updatedJobs,
      ingredients: updatedIngredients,
      equipment: updatedEquipment,
      orders: updatedOrders
    });
  }
}));

