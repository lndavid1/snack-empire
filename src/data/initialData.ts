import {
  Ingredient,
  FoodItem,
  Supplier,
  Employee,
  StoreUpgrade,
  Quest,
  Achievement,
  Competitor,
  PrestigeUpgrade,
  RandomEvent,
  StoreTierId
} from '../types/game';

export interface StoreTierInfo {
  id: StoreTierId;
  name: string;
  tierNumber: number;
  icon: string;
  cost: number;
  trafficMultiplier: number;
  maxCustomers: number;
  description: string;
  quote: string;
}

export const STORE_TIERS: StoreTierInfo[] = [
  {
    id: 'tier_1_cart',
    name: 'Xe Bán Dạo "Khởi Nghiệp"',
    tierNumber: 1,
    icon: '🥡',
    cost: 0,
    trafficMultiplier: 1.0,
    maxCustomers: 3,
    description: 'Chiếc xe đẩy ọp ẹp bên vỉa hè nhưng mang khát vọng tỷ phú.',
    quote: '"Bắt đầu với 500k và một giấc mơ làm giàu."'
  },
  {
    id: 'tier_2_stall',
    name: 'Kiosk Nhỏ Góc Phố',
    tierNumber: 2,
    icon: '🎪',
    cost: 1500,
    trafficMultiplier: 1.8,
    maxCustomers: 5,
    description: 'Có dù che nắng mưa, khách bắt đầu xếp hàng giờ tan tầm.',
    quote: '"Mưa không sợ ướt burger, nắng không lo hỏng sốt."'
  },
  {
    id: 'tier_3_shop',
    name: 'Cửa Hàng Máy Lạnh Chill',
    tierNumber: 3,
    icon: '🏪',
    cost: 6500,
    trafficMultiplier: 3.2,
    maxCustomers: 8,
    description: 'Có wifi căng đét, điều hòa 18 độ, học sinh sinh viên đóng đô.',
    quote: '"Khách vào ngồi 3 tiếng gọi 1 ly soda nhưng vẫn vui."'
  },
  {
    id: 'tier_4_restaurant',
    name: 'Nhà Hàng Phố Đi Bộ',
    tierNumber: 4,
    icon: '🍔',
    cost: 25000,
    trafficMultiplier: 5.5,
    maxCustomers: 12,
    description: 'Vị trí đắc địa ngay trung tâm, shipper Grab/Shopee đứng nghẹt cửa.',
    quote: '"Bếp chạy hết công suất, tiền vào như nước."'
  },
  {
    id: 'tier_5_chain',
    name: 'Chuỗi 10 Chi Nhánh Đô Thị',
    tierNumber: 5,
    icon: '🏬',
    cost: 95000,
    trafficMultiplier: 10.0,
    maxCustomers: 18,
    description: 'Thương hiệu bắt đầu phủ sóng toàn thành phố, ai cũng biết tới.',
    quote: '"Đi đâu cũng thấy logo thương hiệu Snack Empire."'
  },
  {
    id: 'tier_6_franchise',
    name: 'Tập Đoàn Nhượng Quyền Quốc Gia',
    tierNumber: 6,
    icon: '🏙️',
    cost: 380000,
    trafficMultiplier: 20.0,
    maxCustomers: 25,
    description: 'Hàng trăm cửa hàng nhượng quyền tự động rót tiền royalty về túi.',
    quote: '"Tiền tự sinh ra ngay cả khi bạn đang ngủ."'
  },
  {
    id: 'tier_7_corporation',
    name: 'Đại Tập Đoàn Niêm Yết IPO',
    tierNumber: 7,
    icon: '🏦',
    cost: 1500000,
    trafficMultiplier: 42.0,
    maxCustomers: 35,
    description: 'Mã cổ phiếu SNACK tăng trần 10 phiên liên tiếp trên sàn chứng khoán.',
    quote: '"Nhà đầu tư tranh nhau mua cổ phần Snack Empire."'
  },
  {
    id: 'tier_8_conglomerate',
    name: 'Tổ Hợp Food Mall Quốc Tế',
    tierNumber: 8,
    icon: '🏰',
    cost: 6000000,
    trafficMultiplier: 90.0,
    maxCustomers: 50,
    description: 'Tòa nhà ẩm thực khổng lồ đón hàng triệu du khách quốc tế mỗi tuần.',
    quote: '"Biểu tượng ẩm thực quốc gia không thể xô đổ."'
  },
  {
    id: 'tier_9_foodtech',
    name: 'Kỳ Lân FoodTech Robot AI',
    tierNumber: 9,
    icon: '🤖',
    cost: 25000000,
    trafficMultiplier: 200.0,
    maxCustomers: 70,
    description: 'Drone giao hàng siêu thanh, AI Chef nấu chính xác đến từng milligram.',
    quote: '"Burger được in 3D với hương vị đạt chuẩn vũ trụ."'
  },
  {
    id: 'tier_10_future',
    name: 'Đế Chế Ẩm Thực Sao Hỏa 🚀',
    tierNumber: 10,
    icon: '🌌',
    cost: 100000000,
    trafficMultiplier: 500.0,
    maxCustomers: 100,
    description: 'Chi nhánh đầu tiên tại Trạm Olympus Mons trên Sao Hỏa.',
    quote: '"Người ngoài hành tinh cũng phải mê burger của bạn!"'
  }
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: 'bread', name: 'Bánh Mì Burger', category: 'Fastfood', icon: '🍞', unit: 'cái', stock: 25, basePrice: 2, minBatch: 10 },
  { id: 'beef', name: 'Thịt Bò Mỹ', category: 'Fastfood', icon: '🥩', unit: 'lát', stock: 25, basePrice: 3, minBatch: 10 },
  { id: 'cheese', name: 'Phô Mai Cheddar', category: 'Fastfood', icon: '🧀', unit: 'lát', stock: 20, basePrice: 1.5, minBatch: 10 },
  { id: 'potatoes', name: 'Khoai Tây Tươi', category: 'Fastfood', icon: '🥔', unit: 'củ', stock: 30, basePrice: 1, minBatch: 15 },
  { id: 'oil', name: 'Dầu Ăn Chiên', category: 'Fastfood', icon: '🫗', unit: 'chai', stock: 20, basePrice: 1.2, minBatch: 10 },
  { id: 'chicken', name: 'Thịt Gà Giòn', category: 'Fastfood', icon: '🍗', unit: 'miếng', stock: 15, basePrice: 2.5, minBatch: 10 },
  { id: 'sugar', name: 'Đường & Syrup', category: 'Drinks', icon: '🧂', unit: 'gói', stock: 40, basePrice: 0.8, minBatch: 20 },
  { id: 'ice', name: 'Đá Lạnh Tinh Khiết', category: 'Drinks', icon: '🧊', unit: 'khay', stock: 50, basePrice: 0.5, minBatch: 25 },
  { id: 'coffee_beans', name: 'Hạt Cà Phê Robusta', category: 'Drinks', icon: '☕', unit: 'gói', stock: 15, basePrice: 2.5, minBatch: 10 },
  { id: 'milk', name: 'Sữa Tươi Thanh Trùng', category: 'Drinks', icon: '🥛', unit: 'hộp', stock: 20, basePrice: 1.8, minBatch: 10 },
  { id: 'flour', name: 'Bột Mì Làm Bánh', category: 'Dessert', icon: '🌾', unit: 'túi', stock: 20, basePrice: 1.2, minBatch: 10 },
  { id: 'matcha', name: 'Bột Matcha Nhật', category: 'Special', icon: '🍵', unit: 'hũ', stock: 10, basePrice: 4.0, minBatch: 5 },
];

export const INITIAL_FOODS: FoodItem[] = [
  {
    id: 'food_burger',
    name: 'Burger Bò Phô Mai',
    category: 'fastfood',
    icon: '🍔',
    description: 'Bò nướng xèo xèo, phô mai tan chảy béo ngậy chuẩn vị phố đi bộ.',
    costToUnlock: 0,
    isUnlocked: true,
    basePrepTime: 2.5,
    baseCost: 6.5,
    sellingPrice: 15,
    level: 1,
    upgradeCost: 50,
    popularity: 95,
    ingredients: [
      { ingredientId: 'bread', amount: 1 },
      { ingredientId: 'beef', amount: 1 },
      { ingredientId: 'cheese', amount: 1 }
    ],
    memeQuote: '"Burger ngon xỉu, ăn xong quên luôn deadline!"'
  },
  {
    id: 'food_fries',
    name: 'Khoai Tây Chiên Lắc',
    category: 'fastfood',
    icon: '🍟',
    description: 'Khoai tây vàng giòn rụm, lắc bột phô mai mặn ngọt gây nghiện.',
    costToUnlock: 0,
    isUnlocked: true,
    basePrepTime: 1.8,
    baseCost: 2.2,
    sellingPrice: 7,
    level: 1,
    upgradeCost: 40,
    popularity: 85,
    ingredients: [
      { ingredientId: 'potatoes', amount: 1 },
      { ingredientId: 'oil', amount: 1 }
    ],
    memeQuote: '"Định ăn một cọng mà lỡ tay hết nửa hộp 💀"'
  },
  {
    id: 'food_soda',
    name: 'Soda Chanh Bạc Hà',
    category: 'drinks',
    icon: '🥤',
    description: 'Bật tung năng lượng sảng khoái mát lạnh ngày hè.',
    costToUnlock: 0,
    isUnlocked: true,
    basePrepTime: 1.2,
    baseCost: 1.3,
    sellingPrice: 5,
    level: 1,
    upgradeCost: 35,
    popularity: 80,
    ingredients: [
      { ingredientId: 'sugar', amount: 1 },
      { ingredientId: 'ice', amount: 1 }
    ],
    memeQuote: '"Giải nhiệt tức thì, cứu rỗi mùa hè 40 độ."'
  },
  {
    id: 'food_chicken',
    name: 'Gà Rán Giòn Cay Sốt Hàn',
    category: 'fastfood',
    icon: '🍗',
    description: 'Da giòn rụm, thịt mọng nước đẫm sốt cay ngọt chuẩn Seoul.',
    costToUnlock: 120,
    isUnlocked: false,
    basePrepTime: 3.2,
    baseCost: 4.9,
    sellingPrice: 18,
    level: 1,
    upgradeCost: 150,
    popularity: 90,
    ingredients: [
      { ingredientId: 'chicken', amount: 1 },
      { ingredientId: 'flour', amount: 1 },
      { ingredientId: 'oil', amount: 1 }
    ],
    memeQuote: '"Cắn miếng gà giòn nghe rôm rốp cả xóm nghe thấy."'
  },
  {
    id: 'food_coffee',
    name: 'Cà Phê Muối Bạc Xỉu',
    category: 'drinks',
    icon: '☕',
    description: 'Lớp kem muối béo mặn kết hợp cà phê Robusta tỉnh táo tức thì.',
    costToUnlock: 250,
    isUnlocked: false,
    basePrepTime: 1.5,
    baseCost: 5.1,
    sellingPrice: 14,
    level: 1,
    upgradeCost: 200,
    popularity: 88,
    ingredients: [
      { ingredientId: 'coffee_beans', amount: 1 },
      { ingredientId: 'milk', amount: 1 },
      { ingredientId: 'ice', amount: 1 }
    ],
    memeQuote: '"Uống một ngụm là cày code tới 4h sáng không buồn ngủ."'
  },
  {
    id: 'food_milktea',
    name: 'Trà Sữa Trân Châu Đường Đen',
    category: 'drinks',
    icon: '🧋',
    description: 'Vị ngọt ngào êm dịu làm xiêu lòng mọi tín đồ hảo ngọt Gen Z.',
    costToUnlock: 500,
    isUnlocked: false,
    basePrepTime: 2.0,
    baseCost: 3.8,
    sellingPrice: 16,
    level: 1,
    upgradeCost: 350,
    popularity: 92,
    ingredients: [
      { ingredientId: 'milk', amount: 1 },
      { ingredientId: 'sugar', amount: 1 },
      { ingredientId: 'ice', amount: 1 }
    ],
    memeQuote: '"Không có trà sữa đời không nể!"'
  },
  {
    id: 'food_donut',
    name: 'Donut Cầu Vồng Glaze',
    category: 'dessert',
    icon: '🍩',
    description: 'Bánh vòng phủ socola bảy màu chụp ảnh sống ảo triệu view.',
    costToUnlock: 800,
    isUnlocked: false,
    basePrepTime: 2.2,
    baseCost: 3.5,
    sellingPrice: 12,
    level: 1,
    upgradeCost: 450,
    popularity: 82,
    ingredients: [
      { ingredientId: 'flour', amount: 1 },
      { ingredientId: 'sugar', amount: 1 },
      { ingredientId: 'oil', amount: 1 }
    ],
    memeQuote: '"Bánh xinh lung linh, lên SnackTok là auto viral."'
  },
  {
    id: 'food_matcha_waffle',
    name: 'Waffle Matcha Kem Tươi',
    category: 'dessert',
    icon: '🧇',
    description: 'Waffle thơm nức mùi matcha Uji thượng hạng kết hợp kem tuyết.',
    costToUnlock: 2000,
    isUnlocked: false,
    basePrepTime: 3.0,
    baseCost: 7.0,
    sellingPrice: 28,
    level: 1,
    upgradeCost: 900,
    popularity: 94,
    ingredients: [
      { ingredientId: 'flour', amount: 1 },
      { ingredientId: 'matcha', amount: 1 },
      { ingredientId: 'milk', amount: 1 }
    ],
    memeQuote: '"Trend matcha bùng nổ, khách tranh nhau xếp hàng."'
  },
  {
    id: 'food_gold_burger',
    name: 'Burger Bò Wagyu Dát Vàng 24K',
    category: 'special',
    icon: '👑',
    description: 'Tuyệt phẩm dành cho giới thượng lưu và đại gia tỷ phú.',
    costToUnlock: 10000,
    isUnlocked: false,
    basePrepTime: 4.5,
    baseCost: 12.0,
    sellingPrice: 99,
    level: 1,
    upgradeCost: 4000,
    popularity: 99,
    ingredients: [
      { ingredientId: 'bread', amount: 2 },
      { ingredientId: 'beef', amount: 2 },
      { ingredientId: 'cheese', amount: 2 }
    ],
    memeQuote: '"Ăn một miếng thấy cả sự giàu sang phú quý ắt về."'
  }
];

export const SUPPLIERS: Supplier[] = [
  {
    id: 'cheap_market',
    name: 'Chợ Đầu Mối Bình Dân',
    tagline: 'Giá rẻ sập sàn, hợp ví tiền lúc mới khởi nghiệp',
    discountRate: 0.75, // Giảm 25% giá
    qualityBonus: 0.9,
    reputationBonus: 0,
    deliverySpeed: 'Trung bình'
  },
  {
    id: 'eco_green',
    name: 'Nông Trại Hữu Cơ Eco Farm',
    tagline: 'Rau củ sạch 100%, bảo vệ môi trường tăng danh tiếng',
    discountRate: 1.0,
    qualityBonus: 1.25,
    reputationBonus: 1.3,
    deliverySpeed: 'Tiêu chuẩn'
  },
  {
    id: 'ninja_fast',
    name: 'Ninja Express Hỏa Tốc',
    tagline: 'Giao hàng trong chớp mắt, không bao giờ lo đứt hàng',
    discountRate: 1.1,
    qualityBonus: 1.0,
    reputationBonus: 1.05,
    deliverySpeed: 'Cực nhanh'
  },
  {
    id: 'premium_gourmet',
    name: 'Nhà Cung Cấp Chuẩn Michelin',
    tagline: 'Nguyên liệu thượng hạng cho nhà hàng sang trọng đẳng cấp',
    discountRate: 1.35,
    qualityBonus: 1.6,
    reputationBonus: 1.5,
    deliverySpeed: 'Bảo quản lạnh VIP'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp_cashier_linh',
    name: 'Linh "Miệng Nhanh"',
    role: 'cashier',
    avatar: '💁‍♀️',
    level: 1,
    speed: 30,
    quality: 40,
    salaryPerSec: 0.5,
    hired: false,
    hireCost: 120,
    upgradeCost: 80,
    mood: 95,
    catchphrase: '"Cảm ơn quý khách, quét mã QR nha bấy bì!"'
  },
  {
    id: 'emp_cook_bob',
    name: 'Bếp Trưởng Bob',
    role: 'cook',
    avatar: '👨‍🍳',
    level: 1,
    speed: 40,
    quality: 50,
    salaryPerSec: 0.8,
    hired: false,
    hireCost: 250,
    upgradeCost: 140,
    mood: 90,
    catchphrase: '"Tay đảo chảo thoăn thoắt, lật burger như ảo thuật."'
  },
  {
    id: 'emp_barista_duy',
    name: 'Duy Barista Chill',
    role: 'barista',
    avatar: '☕',
    level: 1,
    speed: 35,
    quality: 60,
    salaryPerSec: 0.7,
    hired: false,
    hireCost: 400,
    upgradeCost: 200,
    mood: 88,
    catchphrase: '"Đá xay mịn như nhung, latte art hình trái tim."'
  },
  {
    id: 'emp_shipper_nam',
    name: 'Nam "Bão Táp"',
    role: 'shipper',
    avatar: '🛵',
    level: 1,
    speed: 60,
    quality: 45,
    salaryPerSec: 1.2,
    hired: false,
    hireCost: 800,
    upgradeCost: 350,
    mood: 92,
    catchphrase: '"Không ngại mưa gió, 5 phút là tới tay khách!"'
  },
  {
    id: 'emp_marketer_huy',
    name: 'Huy Content Triệu View',
    role: 'marketer',
    avatar: '📸',
    level: 1,
    speed: 50,
    quality: 75,
    salaryPerSec: 2.0,
    hired: false,
    hireCost: 2000,
    upgradeCost: 800,
    mood: 85,
    catchphrase: '"Video TikTok hôm nay cán mốc 10 triệu view rồi sếp ơi!"'
  },
  {
    id: 'emp_manager_lan',
    name: 'Quản Lý Lan Nghiêm Khắc',
    role: 'manager',
    avatar: '👩‍💼',
    level: 1,
    speed: 70,
    quality: 80,
    salaryPerSec: 3.5,
    hired: false,
    hireCost: 5000,
    upgradeCost: 1800,
    mood: 89,
    catchphrase: '"Tự động hóa toàn bộ quy trình, không để thất thoát 1 xu."'
  },
  {
    id: 'emp_ceo_robo',
    name: 'Robo CEO Cyber-X',
    role: 'ceo',
    avatar: '🤖',
    level: 1,
    speed: 99,
    quality: 99,
    salaryPerSec: 10.0,
    hired: false,
    hireCost: 25000,
    upgradeCost: 8000,
    mood: 100,
    catchphrase: '"Tối ưu hóa lợi nhuận 99.99%. Nhân loại thật hiệu quả."'
  }
];

export const INITIAL_UPGRADES: StoreUpgrade[] = [
  {
    id: 'upg_grill',
    name: 'Bếp Nướng Thần Tốc',
    category: 'kitchen',
    icon: '🔥',
    description: 'Nâng cấp vỉ nướng chống dính nhiệt độ cao.',
    level: 0,
    maxLevel: 10,
    baseCost: 75,
    costMultiplier: 1.6,
    effectDescription: 'Tăng 15% tốc độ chuẩn bị món ăn',
    effectType: 'speed',
    effectValue: 0.15
  },
  {
    id: 'upg_tables',
    name: 'Khu Bàn Ghế Check-in',
    category: 'decor',
    icon: '🪑',
    description: 'Bàn ghế phong cách tối giản có góc sống ảo triệu like.',
    level: 0,
    maxLevel: 10,
    baseCost: 120,
    costMultiplier: 1.7,
    effectDescription: 'Tăng sức chứa thêm +2 khách ngồi cùng lúc',
    effectType: 'capacity',
    effectValue: 2
  },
  {
    id: 'upg_neon',
    name: 'Bảng Đèn LED Neon Lung Linh',
    category: 'decor',
    icon: '✨',
    description: 'Thu hút sự chú ý của mọi người đi đường từ cách xa 500m.',
    level: 0,
    maxLevel: 10,
    baseCost: 200,
    costMultiplier: 1.8,
    effectDescription: 'Tăng 20% lượng khách ghé quán mỗi phút',
    effectType: 'traffic',
    effectValue: 0.20
  },
  {
    id: 'upg_fridge',
    name: 'Tủ Đông Công Nghiệp Sub-Zero',
    category: 'storage',
    icon: '🧊',
    description: 'Khoang chứa lạnh siêu rộng bảo quản nguyên liệu tươi rói.',
    level: 0,
    maxLevel: 10,
    baseCost: 150,
    costMultiplier: 1.65,
    effectDescription: 'Tăng giới hạn kho nguyên liệu thêm +50 đơn vị',
    effectType: 'storage',
    effectValue: 50
  }
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q_first_sale',
    title: 'Đơn Hàng Đầu Tiên 💸',
    description: 'Bán thành công 1 món đồ ăn cho khách hàng.',
    icon: '🍔',
    rewardCash: 100,
    rewardXP: 50,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false
  },
  {
    id: 'q_sell_10',
    title: 'Khởi Sắc Đầu Ngày',
    description: 'Phục vụ thành công 10 đơn hàng cho khách đói bụng.',
    icon: '🍟',
    rewardCash: 250,
    rewardXP: 100,
    progress: 0,
    target: 10,
    completed: false,
    claimed: false
  },
  {
    id: 'q_hire_staff',
    title: 'Ông Chủ Biết Thuê Người',
    description: 'Tuyển dụng nhân viên đầu tiên để tự động hóa.',
    icon: '👨‍🍳',
    rewardCash: 350,
    rewardXP: 150,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false
  },
  {
    id: 'q_upgrade_store',
    title: 'Lên Đời Quán Xá',
    description: 'Nâng cấp cửa hàng lên Tier 2 Kiosk Nhỏ.',
    icon: '🎪',
    rewardCash: 1000,
    rewardXP: 300,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false
  },
  {
    id: 'q_reach_100_customers',
    title: 'Khách Nườm Nượp',
    description: 'Phục vụ tổng cộng 100 khách hàng ghé quán.',
    icon: '👥',
    rewardCash: 2500,
    rewardXP: 600,
    rewardEmpirePoints: 1,
    progress: 0,
    target: 100,
    completed: false,
    claimed: false
  },
  {
    id: 'q_unlock_drinks',
    title: 'Bán Kèm Nước Giải Khát',
    description: 'Mở khóa món Cà Phê Muối Bạc Xỉu.',
    icon: '☕',
    rewardCash: 800,
    rewardXP: 250,
    progress: 0,
    target: 1,
    completed: false,
    claimed: false
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_dollar',
    title: 'Đồng Đô Đầu Tiên 💵',
    description: 'Kiếm được $1 đầu tiên trong đời khởi nghiệp.',
    icon: '🌱',
    memeHint: 'Bro chính thức thoát cảnh thất nghiệp!',
    unlocked: false,
    rewardEmpirePoints: 1
  },
  {
    id: 'ach_1k_cash',
    title: 'Đại Gia Nghìn Đô 💰',
    description: 'Tích lũy chạm mốc $1,000 tiền mặt trong ngân quỹ.',
    icon: '💵',
    memeHint: 'Bắt đầu có tiền tiêu vặt rồi đấy.',
    unlocked: false,
    rewardEmpirePoints: 2
  },
  {
    id: 'ach_automated',
    title: 'Nằm Ngửa Ăn Tiền 🛋️',
    description: 'Tuyển đủ cả Bếp Trưởng và Thu Ngân để tự động bán.',
    icon: '⚙️',
    memeHint: 'Treo máy đi ngủ vẫn có tiền nổ ting ting.',
    unlocked: false,
    rewardEmpirePoints: 3
  },
  {
    id: 'ach_burger_god',
    title: 'Vua Đầu Bếp Burger 👑',
    description: 'Nâng cấp công thức Burger lên Level 5.',
    icon: '🍔',
    memeHint: 'Burger ngon tới mức khách xếp hàng từ 4h sáng.',
    unlocked: false,
    rewardEmpirePoints: 2
  },
  {
    id: 'ach_viral_snacktok',
    title: 'Hiện Tượng Mạng Xã Hội 📱',
    description: 'Chạy chiến dịch SnackTok đạt hơn 10,000 tim.',
    icon: '🔥',
    memeHint: 'Toàn cõi mạng rần rần vì quán của bạn!',
    unlocked: false,
    rewardEmpirePoints: 4
  },
  {
    id: 'ach_touch_grass',
    title: 'Bro Cần Đi Chạm Cỏ 🌱💀',
    description: 'Bán thành công hơn 500 món ăn.',
    icon: '💀',
    memeHint: 'Nghiện game rồi, nhớ đi uống nước ngắm trời đất tí đi bro.',
    unlocked: false,
    rewardEmpirePoints: 5
  },
  {
    id: 'ach_first_prestige',
    title: 'Tái Sinh Đế Chế 🚀',
    description: 'Thực hiện Prestige lần đầu tiên để nhận Empire Points.',
    icon: '⭐',
    memeHint: 'Khởi đầu lại nhưng với sức mạnh của một Titan!',
    unlocked: false,
    rewardEmpirePoints: 10
  }
];

export const INITIAL_COMPETITORS: Competitor[] = [
  {
    id: 'comp_burger_bros',
    name: 'Burger Bros 兄弟',
    logo: '🤡',
    marketShare: 35,
    flavor: 'Ăn nhanh giá rẻ, burger công nghiệp nhiều mỡ.',
    rivalryNote: '"Họ vừa giảm giá 10% để cạnh tranh trực diện với quán của bạn!"'
  },
  {
    id: 'comp_coffee_mafia',
    name: 'Coffee Mafia Đen Đá',
    logo: '🕶️',
    marketShare: 28,
    flavor: 'Cà phê đậm đặc, chiếm lĩnh các văn phòng công sở.',
    rivalryNote: '"Họ đang dòm ngó công thức Cà phê Muối của bạn."'
  },
  {
    id: 'comp_chicken_king',
    name: 'Chicken King Siêu To',
    logo: '👑',
    marketShare: 22,
    flavor: 'Gà rán thùng khổng lồ cho nhóm đông người.',
    rivalryNote: '"Đối thủ đang chạy quảng cáo dìm hàng đồ ăn vặt vỉa hè."'
  }
];

export const INITIAL_PRESTIGE_UPGRADES: PrestigeUpgrade[] = [
  {
    id: 'prest_starting_cash',
    name: 'Vốn Khởi Nghiệp Vàng',
    description: 'Bắt đầu mỗi lần chơi mới với thêm $500 tiền mặt',
    icon: '💰',
    cost: 1,
    level: 0,
    maxLevel: 10,
    effectMultiplier: 500,
    effectType: 'starting_cash'
  },
  {
    id: 'prest_traffic',
    name: 'Thương Hiệu Huyền Thoại',
    description: 'Tăng vĩnh viễn 20% lượng khách ghé thăm',
    icon: '📢',
    cost: 2,
    level: 0,
    maxLevel: 10,
    effectMultiplier: 0.20,
    effectType: 'traffic'
  },
  {
    id: 'prest_offline',
    name: 'Doanh Thu Khi Ngủ',
    description: 'Tăng 35% hiệu suất tích lũy tiền khi offline tắt máy',
    icon: '💤',
    cost: 2,
    level: 0,
    maxLevel: 10,
    effectMultiplier: 0.35,
    effectType: 'offline_efficiency'
  },
  {
    id: 'prest_speed',
    name: 'Nhân Sự Siêu Phàm',
    description: 'Tất cả nhân viên làm việc nhanh hơn vĩnh viễn 25%',
    icon: '⚡',
    cost: 3,
    level: 0,
    maxLevel: 10,
    effectMultiplier: 0.25,
    effectType: 'employee_speed'
  },
  {
    id: 'prest_profit',
    name: 'Bậc Thầy Tối Ưu Lợi Nhuận',
    description: 'Tăng 15% biên lợi nhuận trên từng món bán ra',
    icon: '📈',
    cost: 4,
    level: 0,
    maxLevel: 10,
    effectMultiplier: 0.15,
    effectType: 'profit_boost'
  }
];

export const POSSIBLE_EVENTS: Omit<RandomEvent, 'remainingSec'>[] = [
  {
    id: 'evt_matcha_trend',
    title: 'Cơn Sốt Matcha Lên Ngôi! 🍵🔥',
    description: 'Gen Z đang phát cuồng vì mọi món có matcha! Nhu cầu đồ uống và tráng miệng tăng vọt 300%.',
    icon: '🍵',
    type: 'trend',
    durationSec: 45,
    multiplier: { traffic: 2.5, revenue: 1.5 }
  },
  {
    id: 'evt_rainy_day',
    title: 'Cơn Mưa Rào Bất Chợt 🌧️',
    description: 'Trời đổ mưa to, khách lười ra đường. Lượng khách vỉa hè giảm 30% trong chốc lát.',
    icon: '🌧️',
    type: 'weather',
    durationSec: 30,
    multiplier: { traffic: 0.7 }
  },
  {
    id: 'evt_viral_tiktoker',
    title: 'Hot TikToker Ghé Quán Review! 📱✨',
    description: '"Quán này đồ ăn ngon xỉu nha mn ơi!" Video lên xu hướng 2 triệu view, khách ùa tới!',
    icon: '🌟',
    type: 'viral',
    durationSec: 40,
    multiplier: { traffic: 3.0, revenue: 1.8 }
  },
  {
    id: 'evt_investor_offer',
    title: 'Nhà Đầu Tư Thiên Thần Xuất Hiện 💼💰',
    description: 'Một quỹ đầu tư mạo hiểm ấn tượng với chuỗi quán của bạn và rót vốn tài trợ!',
    icon: '💼',
    type: 'investor',
    durationSec: 20,
    multiplier: { revenue: 1.2 },
    options: [
      { text: 'Nhận gói tài trợ $500 💸', action: 'accept', reward: 500 }
    ]
  },
  {
    id: 'evt_equipment_flicker',
    title: 'Chập Cầu Chì Bếp Nấu! ⚡🚨',
    description: 'Thiết bị quá tải bốc khói nhẹ, cần thợ sửa ngay lập tức.',
    icon: '🚨',
    type: 'crisis',
    durationSec: 25,
    multiplier: { speed: 0.6 },
    options: [
      { text: 'Gọi thợ cấp tốc ($100)', action: 'boost', cost: 100 },
      { text: 'Tự sửa thủ công', action: 'decline' }
    ]
  }
];
