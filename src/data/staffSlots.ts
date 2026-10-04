import { StaffSlot, Employee } from '../types/game';

export const STAFF_SLOT_CATALOG: StaffSlot[] = [
  // 1. CHEF SLOTS
  {
    id: 'slot_chef_01',
    businessId: 'main_restaurant',
    role: 'chef',
    status: 'OCCUPIED',
    employeeId: 'emp_cook_bob',
    unlockRequirements: [],
    unlockedAt: 0
  },
  {
    id: 'slot_chef_02',
    businessId: 'main_restaurant',
    role: 'chef',
    status: 'LOCKED',
    unlockRequirements: [
      { type: 'PLAYER_LEVEL', value: 5, description: 'Cấp người chơi ≥ 5' },
      { type: 'RESTAURANT_LEVEL', value: 2, description: 'Cấp nhà hàng ≥ 2' },
      { type: 'DAILY_ORDERS', value: 50, description: 'Đơn hàng phục vụ ≥ 50' },
      { type: 'KITCHEN_STATIONS', value: 2, description: 'Trạm bếp hoạt động ≥ 2' }
    ]
  },
  {
    id: 'slot_chef_03',
    businessId: 'main_restaurant',
    role: 'chef',
    status: 'LOCKED',
    unlockRequirements: [
      { type: 'PLAYER_LEVEL', value: 8, description: 'Cấp người chơi ≥ 8' },
      { type: 'RESTAURANT_LEVEL', value: 3, description: 'Cấp nhà hàng ≥ 3' },
      { type: 'DAILY_ORDERS', value: 100, description: 'Đơn hàng phục vụ ≥ 100' },
      { type: 'KITCHEN_STATIONS', value: 3, description: 'Trạm bếp hoạt động ≥ 3' }
    ]
  },

  // 2. CASHIER SLOTS
  {
    id: 'slot_cashier_01',
    businessId: 'main_restaurant',
    role: 'cashier',
    status: 'OCCUPIED',
    employeeId: 'emp_cashier_linh',
    unlockRequirements: [],
    unlockedAt: 0
  },
  {
    id: 'slot_cashier_02',
    businessId: 'main_restaurant',
    role: 'cashier',
    status: 'LOCKED',
    unlockRequirements: [
      { type: 'PLAYER_LEVEL', value: 6, description: 'Cấp người chơi ≥ 6' },
      { type: 'DAILY_ORDERS', value: 80, description: 'Đơn hàng phục vụ ≥ 80' }
    ]
  },

  // 3. SERVER SLOTS
  {
    id: 'slot_server_01',
    businessId: 'main_restaurant',
    role: 'server',
    status: 'OCCUPIED',
    employeeId: 'emp_server_hoa',
    unlockRequirements: [],
    unlockedAt: 0
  },
  {
    id: 'slot_server_02',
    businessId: 'main_restaurant',
    role: 'server',
    status: 'LOCKED',
    unlockRequirements: [
      { type: 'PLAYER_LEVEL', value: 7, description: 'Cấp người chơi ≥ 7' },
      { type: 'TABLE_COUNT', value: 8, description: 'Bàn ăn nhà hàng ≥ 8' },
      { type: 'DAILY_ORDERS', value: 100, description: 'Đơn hàng phục vụ ≥ 100' }
    ]
  },

  // 4. CLEANER SLOTS
  {
    id: 'slot_cleaner_01',
    businessId: 'main_restaurant',
    role: 'cleaner',
    status: 'LOCKED',
    unlockRequirements: [
      { type: 'PLAYER_LEVEL', value: 5, description: 'Cấp người chơi ≥ 5' },
      { type: 'RESTAURANT_LEVEL', value: 2, description: 'Cấp nhà hàng ≥ 2' }
    ]
  }
];

export const CANDIDATE_POOL: Employee[] = [
  // CHEF CANDIDATES
  {
    id: 'emp_chef_john',
    name: 'John "Chảo Lửa"',
    role: 'chef',
    avatar: '👨‍🍳',
    level: 2,
    speed: 48,
    quality: 60,
    salaryPerSec: 1.1,
    hired: false,
    hireCost: 350,
    upgradeCost: 180,
    mood: 95,
    catchphrase: '"Đồ ăn ngon phải có lửa chuẩn nhiệt độ!"',
    archetype: 'FAST',
    stamina: 100,
    maxStamina: 100,
    workState: 'IDLE',
    currentLocation: 'STATION',
    skills: {
      speed: 55,
      quality: 60,
      accuracy: 65,
      service: 30,
      stamina: 100
    }
  },
  {
    id: 'emp_chef_mike',
    name: 'Mike "Michelin"',
    role: 'chef',
    avatar: '🧑‍🍳',
    level: 3,
    speed: 42,
    quality: 75,
    salaryPerSec: 1.5,
    hired: false,
    hireCost: 550,
    upgradeCost: 260,
    mood: 92,
    catchphrase: '"Từng chiếc khoai chiên đều là một tác phẩm nghệ thuật."',
    archetype: 'QUALITY',
    stamina: 100,
    maxStamina: 100,
    workState: 'IDLE',
    currentLocation: 'STATION',
    skills: {
      speed: 45,
      quality: 80,
      accuracy: 75,
      service: 35,
      stamina: 100
    }
  },

  // CASHIER CANDIDATES
  {
    id: 'emp_cashier_mai',
    name: 'Mai "Tươi Tắn"',
    role: 'cashier',
    avatar: '👩‍💼',
    level: 2,
    speed: 38,
    quality: 50,
    salaryPerSec: 0.8,
    hired: false,
    hireCost: 220,
    upgradeCost: 120,
    mood: 98,
    catchphrase: '"Nụ cười của em là điểm cộng cho quán!"',
    archetype: 'SERVICE',
    stamina: 100,
    maxStamina: 100,
    workState: 'IDLE',
    currentLocation: 'SERVICE_AREA',
    skills: {
      speed: 42,
      quality: 55,
      accuracy: 70,
      service: 85,
      stamina: 100
    }
  },
  {
    id: 'emp_cashier_quang',
    name: 'Quang "Tính Nhẩm"',
    role: 'cashier',
    avatar: '🧑‍💻',
    level: 2,
    speed: 45,
    quality: 45,
    salaryPerSec: 0.9,
    hired: false,
    hireCost: 260,
    upgradeCost: 140,
    mood: 90,
    catchphrase: '"Chưa tới 1 giây là xong bill cho khách!"',
    archetype: 'FAST',
    stamina: 100,
    maxStamina: 100,
    workState: 'IDLE',
    currentLocation: 'SERVICE_AREA',
    skills: {
      speed: 52,
      quality: 48,
      accuracy: 80,
      service: 65,
      stamina: 100
    }
  },

  // SERVER CANDIDATES
  {
    id: 'emp_server_tuan',
    name: 'Tuấn "Thần Tốc"',
    role: 'server',
    avatar: '🏃‍♂️',
    level: 2,
    speed: 55,
    quality: 60,
    salaryPerSec: 0.9,
    hired: false,
    hireCost: 280,
    upgradeCost: 150,
    mood: 96,
    catchphrase: '"Bưng 4 đĩa một lúc không bao giờ đổ!"',
    archetype: 'FAST',
    stamina: 100,
    maxStamina: 100,
    workState: 'IDLE',
    currentLocation: 'SERVICE_AREA',
    skills: {
      speed: 62,
      quality: 60,
      accuracy: 70,
      service: 75,
      stamina: 100
    }
  },
  {
    id: 'emp_server_lan',
    name: 'Lan "Chu Đáo"',
    role: 'server',
    avatar: '💁‍♀️',
    level: 3,
    speed: 48,
    quality: 70,
    salaryPerSec: 1.1,
    hired: false,
    hireCost: 380,
    upgradeCost: 190,
    mood: 95,
    catchphrase: '"Khách cần là có mặt ngay tắp lự!"',
    archetype: 'SERVICE',
    stamina: 100,
    maxStamina: 100,
    workState: 'IDLE',
    currentLocation: 'SERVICE_AREA',
    skills: {
      speed: 50,
      quality: 72,
      accuracy: 75,
      service: 88,
      stamina: 100
    }
  },

  // CLEANER CANDIDATES
  {
    id: 'emp_cleaner_tam',
    name: 'Chú Tám "Bóng Loáng"',
    role: 'cleaner',
    avatar: '🧹',
    level: 1,
    speed: 40,
    quality: 65,
    salaryPerSec: 0.6,
    hired: false,
    hireCost: 180,
    upgradeCost: 100,
    mood: 95,
    catchphrase: '"Bàn ăn sạch bong kin kít, vi khuẩn không có cửa!"',
    archetype: 'HARDWORKER',
    stamina: 100,
    maxStamina: 100,
    workState: 'IDLE',
    currentLocation: 'IDLE_AREA',
    skills: {
      speed: 45,
      quality: 70,
      accuracy: 80,
      service: 60,
      stamina: 100
    }
  },
  {
    id: 'emp_cleaner_bac_hai',
    name: 'Bác Hai "Siêng Năng"',
    role: 'cleaner',
    avatar: '🧼',
    level: 2,
    speed: 50,
    quality: 75,
    salaryPerSec: 0.8,
    hired: false,
    hireCost: 240,
    upgradeCost: 130,
    mood: 92,
    catchphrase: '"Rác vừa rơi là biến mất trong tích tắc."',
    archetype: 'BALANCED',
    stamina: 100,
    maxStamina: 100,
    workState: 'IDLE',
    currentLocation: 'IDLE_AREA',
    skills: {
      speed: 52,
      quality: 75,
      accuracy: 85,
      service: 65,
      stamina: 100
    }
  }
];

export function getDefaultStaffSlots(): StaffSlot[] {
  return STAFF_SLOT_CATALOG.map(slot => ({
    ...slot,
    unlockRequirements: slot.unlockRequirements ? slot.unlockRequirements.map(req => ({ ...req })) : []
  }));
}
