import { Recipe } from '../types/game';

export const RECIPES_CATALOG: Recipe[] = [
  // 1. French Fries - The core reference recipe for the Phase 2 & 3 production loop
  {
    id: 'recipe_french_fries',
    name: 'Khoai Tây Chiên Giòn',
    category: 'fastfood',
    icon: '🍟',
    description: 'Khoai tây tươi cắt khúc, chiên vàng giòn rụm trong dầu nóng, rắc muối lắc đều.',
    foodItemId: 'food_fries',
    basePrice: 7,
    baseCost: 2.2,
    basePreparationTime: 10,
    unlocked: true,
    ingredients: [
      { ingredientId: 'potatoes', quantity: 1, unit: 'củ' },
      { ingredientId: 'oil', quantity: 1, unit: 'chai' },
      { ingredientId: 'salt', quantity: 1, unit: 'gói' }
    ],
    requiredEquipment: [
      { equipmentCategory: 'prep', minimumTier: 1 },
      { equipmentCategory: 'fryer', minimumTier: 1, equipmentId: 'fryer_basic' },
      { equipmentCategory: 'packing', minimumTier: 1 }
    ],
    steps: [
      {
        id: 'step_fries_prep',
        name: 'Sơ chế khoai tây',
        stationType: 'prep',
        durationSeconds: 3,
        ingredientConsumption: [
          { ingredientId: 'potatoes', quantity: 1, unit: 'củ' }
        ],
        qualityImpact: 5
      },
      {
        id: 'step_fries_fry',
        name: 'Chiên giòn trong dầu nóng',
        stationType: 'fryer',
        durationSeconds: 5,
        requiredEquipment: [
          { equipmentCategory: 'fryer', minimumTier: 1, equipmentId: 'fryer_basic' }
        ],
        ingredientConsumption: [
          { ingredientId: 'oil', quantity: 1, unit: 'chai' }
        ],
        qualityImpact: 10
      },
      {
        id: 'step_fries_season',
        name: 'Rắc muối & lắc giòn',
        stationType: 'packing',
        durationSeconds: 1,
        ingredientConsumption: [
          { ingredientId: 'salt', quantity: 1, unit: 'gói' }
        ],
        qualityImpact: 5
      },
      {
        id: 'step_fries_package',
        name: 'Đóng gói túi giấy',
        stationType: 'packing',
        durationSeconds: 1,
        qualityImpact: 0
      }
    ]
  },

  // 2. Cheeseburger - Data-driven recipe demonstrating unlock requirements and grill steps
  {
    id: 'recipe_burger',
    name: 'Burger Bò Phô Mai',
    category: 'fastfood',
    icon: '🍔',
    description: 'Bò nướng xèo xèo trên vỉ gang, kẹp phô mai cheddar tan chảy và bánh mì nóng giòn.',
    foodItemId: 'food_burger',
    basePrice: 15,
    baseCost: 6.5,
    basePreparationTime: 12,
    unlocked: true,
    ingredients: [
      { ingredientId: 'bread', quantity: 1, unit: 'cái' },
      { ingredientId: 'beef', quantity: 1, unit: 'lát' },
      { ingredientId: 'cheese', quantity: 1, unit: 'lát' }
    ],
    requiredEquipment: [
      { equipmentCategory: 'prep', minimumTier: 1 },
      { equipmentCategory: 'grill', minimumTier: 1 },
      { equipmentCategory: 'packing', minimumTier: 1 }
    ],
    unlockRequirements: [
      { type: 'equipment', value: 'grill_basic' },
      { type: 'level', value: 1 }
    ],
    steps: [
      {
        id: 'step_burger_prep',
        name: 'Chuẩn bị vỏ bánh & thịt',
        stationType: 'prep',
        durationSeconds: 2,
        ingredientConsumption: [
          { ingredientId: 'bread', quantity: 1, unit: 'cái' }
        ],
        qualityImpact: 5
      },
      {
        id: 'step_burger_grill',
        name: 'Nướng thịt bò xèo xèo',
        stationType: 'grill',
        durationSeconds: 6,
        ingredientConsumption: [
          { ingredientId: 'beef', quantity: 1, unit: 'lát' }
        ],
        qualityImpact: 10
      },
      {
        id: 'step_burger_assemble',
        name: 'Kẹp phô mai & đóng hộp',
        stationType: 'packing',
        durationSeconds: 2,
        ingredientConsumption: [
          { ingredientId: 'cheese', quantity: 1, unit: 'lát' }
        ],
        qualityImpact: 5
      }
    ]
  }
];

export const getRecipeById = (id: string): Recipe | undefined => {
  return RECIPES_CATALOG.find(r => r.id === id);
};

export const getRecipeByFoodItemId = (foodItemId: string): Recipe | undefined => {
  return RECIPES_CATALOG.find(r => r.foodItemId === foodItemId);
};
