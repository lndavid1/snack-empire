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

  // 2. Cheeseburger - Data-driven recipe cooked on kitchen stations
  {
    id: 'recipe_burger',
    name: 'Burger Bò Phô Mai',
    category: 'fastfood',
    icon: '🍔',
    description: 'Bò nướng xèo xèo trên chảo nóng, kẹp phô mai cheddar tan chảy và bánh mì nóng giòn.',
    foodItemId: 'food_burger',
    basePrice: 15,
    baseCost: 6.5,
    basePreparationTime: 10,
    unlocked: true,
    ingredients: [
      { ingredientId: 'bread', quantity: 1, unit: 'cái' },
      { ingredientId: 'beef', quantity: 1, unit: 'lát' },
      { ingredientId: 'cheese', quantity: 1, unit: 'lát' }
    ],
    requiredEquipment: [
      { equipmentCategory: 'prep', minimumTier: 1 },
      { equipmentCategory: 'fryer', minimumTier: 1 },
      { equipmentCategory: 'packing', minimumTier: 1 }
    ],
    unlockRequirements: [
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
        id: 'step_burger_cook',
        name: 'Áp chảo thịt bò xèo xèo',
        stationType: 'fryer',
        durationSeconds: 5,
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
  },

  // 3. Soda Chanh Bạc Hà - Refreshing beverage recipe
  {
    id: 'recipe_soda',
    name: 'Soda Chanh Bạc Hà',
    category: 'drinks',
    icon: '🥤',
    description: 'Bật tung năng lượng sảng khoái mát lạnh với soda chanh bạc hà.',
    foodItemId: 'food_soda',
    basePrice: 5,
    baseCost: 1.3,
    basePreparationTime: 3,
    unlocked: true,
    ingredients: [
      { ingredientId: 'sugar', quantity: 1, unit: 'gói' },
      { ingredientId: 'ice', quantity: 1, unit: 'khay' }
    ],
    requiredEquipment: [
      { equipmentCategory: 'prep', minimumTier: 1 },
      { equipmentCategory: 'packing', minimumTier: 1 }
    ],
    steps: [
      {
        id: 'step_soda_prep',
        name: 'Pha chế đá lạnh & syrup',
        stationType: 'prep',
        durationSeconds: 2,
        ingredientConsumption: [
          { ingredientId: 'sugar', quantity: 1, unit: 'gói' },
          { ingredientId: 'ice', quantity: 1, unit: 'khay' }
        ],
        qualityImpact: 5
      },
      {
        id: 'step_soda_pack',
        name: 'Rót soda & đóng nắp ly',
        stationType: 'packing',
        durationSeconds: 1,
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
