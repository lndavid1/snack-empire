import { Equipment, ProductionStation } from '../types/game';

export const EQUIPMENT_CATALOG: Equipment[] = [
  // 1. Prep Equipment
  {
    id: 'prep_table_basic',
    name: 'Bàn Sơ Chế Cơ Bản',
    category: 'prep',
    tier: 1,
    purchasePrice: 0, // Provided at start
    upgradeCost: 80,
    condition: 100,
    efficiency: 1.0,
    speedMultiplier: 1.0,
    qualityMultiplier: 1.0,
    capacity: 2,
    requiredPlayerLevel: 1,
    unlocked: true,
    description: 'Mặt bàn inox cơ bản để gọt vỏ, cắt thái rau củ và chuẩn bị thịt.',
    icon: '🔪'
  },
  {
    id: 'prep_table_pro',
    name: 'Bàn Sơ Chế Chuyên Nghiệp',
    category: 'prep',
    tier: 2,
    purchasePrice: 200,
    upgradeCost: 350,
    condition: 100,
    efficiency: 1.0,
    speedMultiplier: 1.3,
    qualityMultiplier: 1.15,
    capacity: 4,
    requiredPlayerLevel: 3,
    unlocked: false,
    description: 'Bàn thớt tự động có bồn rửa kháng khuẩn và dao cắt công nghiệp.',
    icon: '🧑‍🍳'
  },

  // 2. Fryers
  {
    id: 'fryer_basic',
    name: 'Bếp Chiên Nhúng Đơn',
    category: 'fryer',
    tier: 1,
    purchasePrice: 0, // Starter equipment
    upgradeCost: 100,
    condition: 100,
    efficiency: 1.0,
    speedMultiplier: 1.0,
    qualityMultiplier: 1.0,
    capacity: 2,
    requiredPlayerLevel: 1,
    unlocked: true,
    description: 'Bếp chiên dầu điện đơn gia đình, giỏ chiên 1 ngăn.',
    icon: '🍟'
  },
  {
    id: 'fryer_commercial',
    name: 'Bếp Chiên Đôi Thương Mại',
    category: 'fryer',
    tier: 2,
    purchasePrice: 350,
    upgradeCost: 500,
    condition: 100,
    efficiency: 1.0,
    speedMultiplier: 1.25,
    qualityMultiplier: 1.15,
    capacity: 4,
    requiredPlayerLevel: 2,
    unlocked: false,
    description: 'Bếp chiên đôi gia nhiệt nhanh, kiểm soát nhiệt độ dầu chuẩn xác.',
    icon: '🍳'
  },
  {
    id: 'fryer_industrial',
    name: 'Hệ Thống Chiên Áp Suất Công Nghiệp',
    category: 'fryer',
    tier: 3,
    purchasePrice: 1200,
    upgradeCost: 1500,
    condition: 100,
    efficiency: 1.0,
    speedMultiplier: 1.6,
    qualityMultiplier: 1.3,
    capacity: 8,
    requiredPlayerLevel: 5,
    unlocked: false,
    description: 'Chiên ngập dầu áp suất cao, vàng giòn rụm chỉ trong tích tắc.',
    icon: '🏭'
  },

  // 3. Grills
  {
    id: 'grill_basic',
    name: 'Vỉ Nướng Điện Bàn',
    category: 'grill',
    tier: 1,
    purchasePrice: 150,
    upgradeCost: 200,
    condition: 100,
    efficiency: 1.0,
    speedMultiplier: 1.0,
    qualityMultiplier: 1.0,
    capacity: 2,
    requiredPlayerLevel: 1,
    unlocked: false,
    description: 'Vỉ gang nướng thịt burger và xúc xích tỏa khói thơm phức.',
    icon: '🥩'
  },

  // 4. Beverage
  {
    id: 'coffee_machine_basic',
    name: 'Máy Pha Cà Phê Bán Tự Động',
    category: 'beverage',
    tier: 1,
    purchasePrice: 200,
    upgradeCost: 250,
    condition: 100,
    efficiency: 1.0,
    speedMultiplier: 1.0,
    qualityMultiplier: 1.0,
    capacity: 2,
    requiredPlayerLevel: 2,
    unlocked: false,
    description: 'Máy pha espresso áp suất 15 bar chiết xuất hương vị đậm đà.',
    icon: '☕'
  },

  // 5. Packaging
  {
    id: 'packing_basic',
    name: 'Bàn Đóng Gói & Gia Vị',
    category: 'packing',
    tier: 1,
    purchasePrice: 0, // Starter equipment
    upgradeCost: 75,
    condition: 100,
    efficiency: 1.0,
    speedMultiplier: 1.0,
    qualityMultiplier: 1.0,
    capacity: 2,
    requiredPlayerLevel: 1,
    unlocked: true,
    description: 'Bàn rắc muối, thêm sốt lắc khoai và đóng hộp giấy take-away.',
    icon: '📦'
  }
];

// Default equipment assigned to new or migrated players
export const STARTER_EQUIPMENT: Equipment[] = [
  { ...EQUIPMENT_CATALOG.find(e => e.id === 'prep_table_basic')! },
  { ...EQUIPMENT_CATALOG.find(e => e.id === 'fryer_basic')! },
  { ...EQUIPMENT_CATALOG.find(e => e.id === 'packing_basic')! }
];

// Default production stations created for a starting restaurant
export const STARTER_STATIONS: ProductionStation[] = [
  {
    id: 'starter_prep_station',
    name: 'Bàn Sơ Chế Cơ Bản',
    stationType: 'prep',
    equipmentId: 'prep_table_basic',
    queue: [],
    capacity: 2,
    isOperational: true
  },
  {
    id: 'starter_fryer_station',
    name: 'Bếp Chiên Cơ Bản',
    stationType: 'fryer',
    equipmentId: 'fryer_basic',
    queue: [],
    capacity: 2,
    isOperational: true
  },
  {
    id: 'starter_packing_station',
    name: 'Bàn Đóng Gói Cơ Bản',
    stationType: 'packing',
    equipmentId: 'packing_basic',
    queue: [],
    capacity: 2,
    isOperational: true
  }
];

export const getEquipmentById = (id: string): Equipment | undefined => {
  return EQUIPMENT_CATALOG.find(e => e.id === id);
};
