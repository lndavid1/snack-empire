export type StoreTierId = 
  | 'tier_1_cart'
  | 'tier_2_stall'
  | 'tier_3_shop'
  | 'tier_4_restaurant'
  | 'tier_5_chain'
  | 'tier_6_franchise'
  | 'tier_7_corporation'
  | 'tier_8_conglomerate'
  | 'tier_9_foodtech'
  | 'tier_10_future';

export type FoodCategory = 'fastfood' | 'drinks' | 'dessert' | 'special';

export type IngredientId = 
  | 'beef'
  | 'chicken'
  | 'cheese'
  | 'bread'
  | 'coffee_beans'
  | 'milk'
  | 'sugar'
  | 'ice'
  | 'flour'
  | 'oil'
  | 'potatoes'
  | 'salt'
  | 'matcha'
  | (string & {});

export interface Ingredient {
  id: IngredientId;
  name: string;
  category: string;
  icon: string;
  unit: string;
  stock: number;
  basePrice: number;
  minBatch: number;
  // Phase 2 Simulation Depth Properties
  purchasePrice?: number;
  quality?: number;
  freshness?: number;
  expirationDays?: number;
  storageRequirement?: 'ambient' | 'refrigerated' | 'frozen';
  supplierId?: string;
}

export interface Supplier {
  id: string;
  name: string;
  tagline: string;
  discountRate: number; // e.g. 0.85 = 15% discount
  qualityBonus: number; // e.g. 1.2
  reputationBonus: number;
  deliverySpeed: string;
}

export interface RecipeRequirement {
  ingredientId: IngredientId;
  amount: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  icon: string;
  description: string;
  costToUnlock: number;
  isUnlocked: boolean;
  basePrepTime: number; // in seconds
  baseCost: number;     // cost of ingredients
  sellingPrice: number;
  level: number;
  upgradeCost: number;
  popularity: number;   // 1 to 100
  ingredients: RecipeRequirement[];
  memeQuote: string;
}

export type EmployeeRole = 
  | 'cook'
  | 'cashier'
  | 'barista'
  | 'shipper'
  | 'manager'
  | 'marketer'
  | 'ceo';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  avatar: string;
  level: number;
  speed: number;        // reduces prep or service time
  quality: number;      // boosts satisfaction
  salaryPerSec: number; // cost per game second
  hired: boolean;
  hireCost: number;
  upgradeCost: number;
  mood: number;         // percentage
  catchphrase: string;
  // Phase 2 Station Assignment & Skills
  assignedStationId?: string;
  skills?: {
    cooking: number;
    preparation: number;
    serving: number;
    speed: number;
    accuracy: number;
  };
  stamina?: number;
}

// ----------------------------------------------------
// PHASE 2: EQUIPMENT, STATIONS, RECIPES & PRODUCTION
// ----------------------------------------------------

export type EquipmentCategory =
  | 'prep'
  | 'fryer'
  | 'grill'
  | 'oven'
  | 'beverage'
  | 'assembly'
  | 'packing'
  | 'storage'
  | 'cleaning';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  tier: number;
  purchasePrice: number;
  upgradeCost: number;
  condition: number;       // 0 to 100 (%)
  efficiency: number;      // 0 to 1.0 or multiplier
  speedMultiplier: number;
  qualityMultiplier: number;
  capacity: number;
  requiredPlayerLevel?: number;
  unlocked: boolean;
  description?: string;
  icon?: string;
}

export interface ProductionStation {
  id: string;
  name: string;
  stationType: EquipmentCategory;
  equipmentId: string;
  assignedEmployeeId?: string;
  queue: string[];         // Array of ProductionJob IDs
  capacity: number;
  activeJobId?: string;
  isOperational: boolean;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: string;
}

export interface RecipeEquipmentRequirement {
  equipmentCategory: EquipmentCategory;
  minimumTier?: number;
  equipmentId?: string;
}

export interface RecipeStep {
  id: string;
  name: string;
  stationType: EquipmentCategory;
  durationSeconds: number;
  requiredEquipment?: RecipeEquipmentRequirement[];
  ingredientConsumption?: RecipeIngredient[];
  qualityImpact?: number;
}

export interface RecipeUnlockRequirement {
  type: 'level' | 'money' | 'equipment' | 'recipe' | 'research';
  value: string | number;
  amount?: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  requiredEquipment: RecipeEquipmentRequirement[];
  basePrice: number;
  baseCost: number;
  basePreparationTime: number;
  unlocked: boolean;
  unlockRequirements?: RecipeUnlockRequirement[];
  foodItemId?: string;     // Link to existing FoodItem for backward compatibility
  icon?: string;
  description?: string;
}

export type ProductionJobStatus =
  | 'QUEUED'
  | 'PREPARING'
  | 'COOKING'
  | 'ASSEMBLING'
  | 'PACKING'
  | 'READY'
  | 'SERVED'
  | 'FAILED'
  | 'CANCELLED';

export interface ProductionJob {
  id: string;
  orderId?: string;
  recipeId: string;
  stationId: string;
  employeeId?: string;
  status: ProductionJobStatus;
  currentStepIndex: number;
  progress: number;         // 0 to 100
  startedAt?: number;
  completedAt?: number;
  qualityScore?: number;    // 0 to 100
  consumedStepIndices?: number[]; // indices of steps whose ingredients were consumed
}

export interface StoreUpgrade {
  id: string;
  name: string;
  category: 'kitchen' | 'decor' | 'storage' | 'tech';
  icon: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  effectDescription: string;
  effectType: 'speed' | 'capacity' | 'traffic' | 'storage';
  effectValue: number;
}

export interface Customer {
  id: string;
  name: string;
  archetype: 'student' | 'gamer' | 'office' | 'influencer' | 'foodie' | 'vip' | 'grandma';
  avatar: string;
  budget: number;
  patience: number;     // max wait time
  currentWait: number;
  favoriteFoodId: string;
  orderedFoodId?: string;
  state: 'waiting' | 'eating' | 'leaving' | 'rage_quit';
  satisfaction: number; // 1 to 5 stars
  quote: string;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'trend' | 'weather' | 'viral' | 'crisis' | 'investor';
  durationSec: number;
  remainingSec: number;
  multiplier: {
    traffic?: number;
    revenue?: number;
    speed?: number;
    cost?: number;
  };
  options?: {
    text: string;
    action: 'accept' | 'decline' | 'boost';
    cost?: number;
    reward?: number;
  }[];
}

export interface Review {
  id: string;
  customerName: string;
  avatar: string;
  stars: number;
  comment: string;
  timeAgo: string;
  foodName: string;
}

export interface SnackTokPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  likes: number;
  commentsCount: number;
  shares: number;
  trendTag: string;
  isPlayerPost?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCash: number;
  rewardXP: number;
  rewardEmpirePoints?: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  memeHint: string;
  unlocked: boolean;
  unlockedAt?: number;
  rewardEmpirePoints: number;
}

export interface Competitor {
  id: string;
  name: string;
  logo: string;
  marketShare: number; // percentage
  flavor: string;
  rivalryNote: string;
}

export interface PrestigeUpgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  level: number;
  maxLevel: number;
  effectMultiplier: number;
  effectType: 'starting_cash' | 'traffic' | 'offline_efficiency' | 'employee_speed' | 'profit_boost';
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}
