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
  StoreTierId
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

  // Manual Cook & Serve Button (Hero Action)
  manualCookAndServe: (customerId?: string) => {
    const state = get();
    const customers = [...state.customers];
    if (customers.length === 0) return false;

    // Pick customer
    const targetIdx = customerId 
      ? customers.findIndex(c => c.id === customerId && c.state === 'waiting')
      : customers.findIndex(c => c.state === 'waiting');

    if (targetIdx === -1) return false;
    const customer = customers[targetIdx];

    // Find requested or favorite food
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
        // recheck
        hasAllIngredients = foodToServe.ingredients.every(req => {
          const ing = currentIngredients.find(i => i.id === req.ingredientId);
          return ing && ing.stock >= req.amount;
        });
      }
    }

    if (!hasAllIngredients) {
      sound.playError();
      state.addFloatingText('🚨 Hết nguyên liệu!', window.innerWidth / 2, window.innerHeight / 2 - 40, 'text-red-400');
      return false;
    }

    // Deduct ingredients
    for (const req of foodToServe.ingredients) {
      const ing = currentIngredients.find(i => i.id === req.ingredientId);
      if (ing) {
        ing.stock -= req.amount;
      }
    }

    // Prestige profit multiplier
    const profitUpgrade = state.prestigeUpgrades.find(p => p.effectType === 'profit_boost');
    const prestigeBonus = profitUpgrade ? 1 + profitUpgrade.level * profitUpgrade.effectMultiplier : 1;

    // Event multiplier
    const eventRevenueMult = state.activeEvent?.multiplier.revenue || 1;

    // Calculate revenue
    const earned = Math.round(foodToServe.sellingPrice * prestigeBonus * eventRevenueMult);
    const xpGained = Math.round(earned * 1.2);
    const newMoney = state.money + earned;
    const newXp = state.xp + xpGained;
    const newSales = state.totalSalesCount + 1;
    const newRevenue = state.totalRevenueEarned + earned;
    const newCustomersServed = state.totalCustomersServed + 1;

    // Level calculation (Level = floor(sqrt(XP / 50)) + 1)
    const newLevel = Math.floor(Math.sqrt(newXp / 50)) + 1;
    if (newLevel > state.level) {
      sound.playLevelUp();
      state.addFloatingText(`🎉 LEVEL UP ${newLevel}!`, window.innerWidth / 2, window.innerHeight / 2 - 100, 'text-yellow-300 font-extrabold text-2xl');
    } else {
      sound.playCoin();
    }

    // Remove customer
    customers.splice(targetIdx, 1);

    // Floating money effect
    state.addFloatingText(`+ $${earned} 💵`, window.innerWidth / 2 + (Math.random() * 80 - 40), window.innerHeight / 2 - 20, 'text-emerald-400 font-bold');

    // Occasional Review
    let updatedReviews = state.reviews;
    if (Math.random() < 0.25) {
      const newReview: Review = {
        id: `rev_${Date.now()}`,
        customerName: customer.name,
        avatar: customer.avatar,
        stars: 5,
        comment: GEN_Z_QUOTES[Math.floor(Math.random() * GEN_Z_QUOTES.length)],
        timeAgo: 'Vừa xong',
        foodName: foodToServe.name
      };
      updatedReviews = [newReview, ...state.reviews.slice(0, 8)];
    }

    // Update Quests progress
    const updatedQuests = state.quests.map(q => {
      if (q.id === 'q_first_sale') return { ...q, progress: Math.min(q.target, q.progress + 1), completed: true };
      if (q.id === 'q_sell_10') return { ...q, progress: Math.min(q.target, q.progress + 1), completed: q.progress + 1 >= q.target };
      if (q.id === 'q_reach_100_customers') return { ...q, progress: Math.min(q.target, newCustomersServed), completed: newCustomersServed >= q.target };
      return q;
    });

    // Update Achievements
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
      totalCustomersServed: newCustomersServed,
      ingredients: currentIngredients,
      customers,
      reviews: updatedReviews,
      quests: updatedQuests,
      achievements: updatedAchievements,
      reputation: Math.min(100, state.reputation + 0.2),
      brandValue: state.brandValue + 2
    });

    return true;
  },

  // Main Simulation Loop (Called every second)
  tickSimulation: () => {
    const state = get();
    const currentTier = STORE_TIERS.find(t => t.id === state.currentTierId) || STORE_TIERS[0];

    // 1. Employee automation
    const hasCook = state.employees.some(e => e.role === 'cook' && e.hired);
    const hasCashier = state.employees.some(e => e.role === 'cashier' && e.hired);

    // Calculate total employee salary cost
    const hiredEmployees = state.employees.filter(e => e.hired);
    const totalSalaryPerSec = hiredEmployees.reduce((sum, e) => sum + e.salaryPerSec, 0);

    let updatedMoney = state.money - totalSalaryPerSec;
    if (updatedMoney < 0) {
      updatedMoney = 0; // prevent extreme negative
    }

    // Auto service if both cook and cashier are working
    if (hasCook && hasCashier && state.customers.length > 0) {
      // Cook speed bonus
      const cook = state.employees.find(e => e.role === 'cook' && e.hired)!;
      const speedUpgrade = state.upgrades.find(u => u.effectType === 'speed');
      const speedMultiplier = 1 + (cook.speed / 100) + (speedUpgrade ? speedUpgrade.level * speedUpgrade.effectValue : 0);
      
      // Serve up to N customers depending on tier and speed
      const customersToServeCount = Math.max(1, Math.floor(speedMultiplier * 0.8));
      for (let i = 0; i < customersToServeCount; i++) {
        get().manualCookAndServe();
      }
    }

    // 2. Customer Spawning
    const trafficUpgrade = state.upgrades.find(u => u.effectType === 'traffic');
    const trafficBonus = trafficUpgrade ? 1 + trafficUpgrade.level * trafficUpgrade.effectValue : 1;
    const eventTrafficBonus = state.activeEvent?.multiplier.traffic || 1;
    const prestigeTraffic = state.prestigeUpgrades.find(p => p.effectType === 'traffic');
    const prestigeBonus = prestigeTraffic ? 1 + prestigeTraffic.level * prestigeTraffic.effectMultiplier : 1;

    const baseSpawnChance = 0.45 * currentTier.trafficMultiplier * trafficBonus * eventTrafficBonus * prestigeBonus;
    
    let updatedCustomers = [...state.customers];

    // Decrease patience of waiting customers
    updatedCustomers = updatedCustomers.map(c => {
      if (c.state === 'waiting') {
        const nextWait = c.currentWait - 1;
        if (nextWait <= 0) {
          // Rage quit
          return { ...c, state: 'rage_quit' as const };
        }
        return { ...c, currentWait: nextWait };
      }
      return c;
    }).filter(c => c.state !== 'rage_quit'); // remove rage quitters

    // Check capacity
    const capacityUpgrade = state.upgrades.find(u => u.effectType === 'capacity');
    const extraCapacity = capacityUpgrade ? capacityUpgrade.level * capacityUpgrade.effectValue : 0;
    const maxCapacity = currentTier.maxCustomers + extraCapacity;

    if (updatedCustomers.length < maxCapacity && Math.random() < baseSpawnChance) {
      const archetype = ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)];
      const unlockedFoods = state.foods.filter(f => f.isUnlocked);
      const chosenFood = unlockedFoods.length > 0 
        ? unlockedFoods[Math.floor(Math.random() * unlockedFoods.length)] 
        : state.foods[0];

      const newCustomer: Customer = {
        id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
        archetype,
        avatar: ARCHETYPE_AVATARS[archetype],
        budget: Math.floor(chosenFood.sellingPrice * (1.2 + Math.random() * 0.5)),
        patience: Math.floor(15 + Math.random() * 10),
        currentWait: Math.floor(15 + Math.random() * 10),
        favoriteFoodId: chosenFood.id,
        orderedFoodId: chosenFood.id,
        state: 'waiting',
        satisfaction: 5,
        quote: GEN_Z_QUOTES[Math.floor(Math.random() * GEN_Z_QUOTES.length)]
      };

      updatedCustomers.push(newCustomer);
    }

    // 3. Random Events Tick
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

    // 4. Auto save every 10 seconds
    const now = Date.now();
    if (now - state.lastSavedTimestamp >= 10000) {
      get().saveGame();
    }

    set({
      money: updatedMoney,
      customers: updatedCustomers,
      activeEvent: currentEvent
    });
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
      version: 1,
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
      hiredEmployees: state.employees.reduce((acc, e) => ({ ...acc, [e.id]: { hired: e.hired, level: e.level, mood: e.mood } }), {}),
      upgrades: state.upgrades.reduce((acc, u) => ({ ...acc, [u.id]: u.level }), {}),
      prestigeUpgrades: state.prestigeUpgrades.reduce((acc, p) => ({ ...acc, [p.id]: p.level }), {}),
      totalSalesCount: state.totalSalesCount,
      totalRevenueEarned: state.totalRevenueEarned,
      claimedQuests: state.quests.filter(q => q.claimed).map(q => q.id),
      unlockedAchievements: state.achievements.filter(a => a.unlocked).map(a => a.id)
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
            mood: savedEmp.mood
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
  }
}));
