import type { 
  Vector3Tuple, 
  RestaurantZone, 
  RestaurantPortal, 
  DiningTableLayout, 
  QueueSlot, 
  InteractionPoint, 
  SpatialObstacle, 
  NavigationNode 
} from '../types/sceneTypes';

export interface RoomLayoutConfig {
  width: number;
  depth: number;
  wallHeight: number;
  kitchenDividerZ: number;
}

export const ROOM_CONFIG: RoomLayoutConfig = {
  width: 20,
  depth: 15,
  wallHeight: 2.4,
  kitchenDividerZ: -1.0,
};

// ----------------------------------------------------
// 1. ZONED PHYSICAL RESTAURANT DATA
// ----------------------------------------------------

export const RESTAURANT_ZONES: RestaurantZone[] = [
  {
    id: 'zone_entrance',
    type: 'ENTRANCE',
    name: 'Sảnh Vào & Đón Khách',
    position: [0, 0, 6.5],
    size: [5, 2],
    description: 'Khu vực cửa kính chính đón khách vào nhà hàng',
    color: '#0f766e',
  },
  {
    id: 'zone_waiting',
    type: 'WAITING',
    name: 'Hàng Đợi Khách Chờ',
    position: [3.5, 0, 3.5],
    size: [3.5, 5],
    description: 'Khu vực xếp hàng gọi món trước quầy thu ngân',
    color: '#0369a1',
  },
  {
    id: 'zone_dining',
    type: 'DINING',
    name: 'Khu Vực Bàn Ăn',
    position: [-3.5, 0, 3.5],
    size: [9, 7],
    description: 'Khu vực bàn ăn cho khách thưởng thức món',
    color: '#334155',
  },
  {
    id: 'zone_service',
    type: 'SERVICE',
    name: 'Quầy Phục Vụ & Thu Ngân',
    position: [5.2, 0, -1.0],
    size: [6, 2],
    description: 'Quầy gọi món, thanh toán POS và khay bưng món',
    color: '#b45309',
  },
  {
    id: 'zone_kitchen',
    type: 'KITCHEN',
    name: 'Không Gian Bếp Chính',
    position: [-0.5, 0, -4.5],
    size: [18, 6],
    description: 'Dây chuyền chế biến, sơ chế, chiên nhúng và đóng gói',
    color: '#1e293b',
  },
  {
    id: 'zone_prep',
    type: 'PREP',
    name: 'Trạm Sơ Chế Nguyên Liệu',
    position: [-3.8, 0, -4.5],
    size: [2.5, 2],
    description: 'Bàn inox sơ chế khoai tây và nguyên liệu thô',
    color: '#475569',
  },
  {
    id: 'zone_cooking',
    type: 'COOKING',
    name: 'Trạm Bếp Chiên Nóng',
    position: [-0.6, 0, -4.5],
    size: [2.5, 2],
    description: 'Khu vực chiên nhúng nhiệt độ cao',
    color: '#7c2d12',
  },
  {
    id: 'zone_packing',
    type: 'PACKING',
    name: 'Trạm Đóng Gói Giữ Nhiệt',
    position: [2.6, 0, -4.5],
    size: [2.5, 2],
    description: 'Đóng gói vào hộp snack dưới đèn giữ nhiệt',
    color: '#9a3412',
  },
  {
    id: 'zone_storage',
    type: 'STORAGE',
    name: 'Kho Nguyên Liệu Bếp',
    position: [-7.5, 0, -4.5],
    size: [3.5, 3],
    description: 'Kệ lưu trữ khoai tây, dầu ăn và gia vị',
    color: '#451a03',
  },
  {
    id: 'zone_rest',
    type: 'REST',
    name: 'Khu Nghỉ Ngơi Nhân Viên',
    position: [-7.5, 0, -2.0],
    size: [3.5, 2],
    description: 'Ghế sofa nghỉ ngơi và bình nước hồi phục thể lực',
    color: '#312e81',
  },
  {
    id: 'zone_exit',
    type: 'EXIT',
    name: 'Lối Ra Sau Khi Ăn',
    position: [-2.0, 0, 7.0],
    size: [2.5, 1.5],
    description: 'Cửa ra dành cho khách hàng đã dùng xong bữa',
    color: '#064e3b',
  },
];

// ----------------------------------------------------
// 2. RESTAURANT PORTALS (ENTRANCE & ACCESS DOORS)
// ----------------------------------------------------

export const RESTAURANT_PORTALS: RestaurantPortal[] = [
  {
    id: 'portal_entrance',
    type: 'ENTRANCE',
    name: 'Cửa Chính Vào Nhà Hàng',
    position: [0, 0, 7.5],
    width: 3.2,
  },
  {
    id: 'portal_exit',
    type: 'EXIT',
    name: 'Cửa Ra Của Khách',
    position: [-2.2, 0, 7.5],
    width: 2.0,
  },
  {
    id: 'portal_kitchen_pass',
    type: 'KITCHEN_DOOR',
    name: 'Lối Thông Giữa Bếp & Sảnh',
    position: [0, 0, -1.0],
    width: 1.8,
  },
  {
    id: 'portal_staff_door',
    type: 'STAFF_DOOR',
    name: 'Cửa Lối Đi Nội Bộ Nhân Viên',
    position: [-9.85, 0, -2.0],
    width: 1.2,
  },
];

// ----------------------------------------------------
// 3. DINING TABLES & SEATS (DATA-DRIVEN)
// ----------------------------------------------------

export const DINING_TABLES_LAYOUT: DiningTableLayout[] = [
  {
    id: 'table_01',
    name: 'Bàn Số 1 (Góc Cửa Sổ)',
    position: [-5.8, 0, 1.8],
    shape: 'rectangular',
    capacity: 4,
    servicePoint: [-5.8, 0, 0.8],
    seats: [
      { id: 'seat_01_1', tableId: 'table_01', seatIndex: 0, position: [-6.6, 0, 1.8], rotation: Math.PI / 2 },
      { id: 'seat_01_2', tableId: 'table_01', seatIndex: 1, position: [-5.0, 0, 1.8], rotation: -Math.PI / 2 },
      { id: 'seat_01_3', tableId: 'table_01', seatIndex: 2, position: [-5.8, 0, 2.6], rotation: Math.PI },
      { id: 'seat_01_4', tableId: 'table_01', seatIndex: 3, position: [-5.8, 0, 1.0], rotation: 0 },
    ],
  },
  {
    id: 'table_02',
    name: 'Bàn Số 2 (Trung Tâm 1)',
    position: [-1.8, 0, 1.8],
    shape: 'rectangular',
    capacity: 4,
    servicePoint: [-1.8, 0, 0.8],
    seats: [
      { id: 'seat_02_1', tableId: 'table_02', seatIndex: 0, position: [-2.6, 0, 1.8], rotation: Math.PI / 2 },
      { id: 'seat_02_2', tableId: 'table_02', seatIndex: 1, position: [-1.0, 0, 1.8], rotation: -Math.PI / 2 },
      { id: 'seat_02_3', tableId: 'table_02', seatIndex: 2, position: [-1.8, 0, 2.6], rotation: Math.PI },
      { id: 'seat_02_4', tableId: 'table_02', seatIndex: 3, position: [-1.8, 0, 1.0], rotation: 0 },
    ],
  },
  {
    id: 'table_03',
    name: 'Bàn Số 3 (Bàn Gia Đình)',
    position: [-5.8, 0, 4.8],
    shape: 'rectangular',
    capacity: 4,
    servicePoint: [-5.8, 0, 3.8],
    seats: [
      { id: 'seat_03_1', tableId: 'table_03', seatIndex: 0, position: [-6.6, 0, 4.8], rotation: Math.PI / 2 },
      { id: 'seat_03_2', tableId: 'table_03', seatIndex: 1, position: [-5.0, 0, 4.8], rotation: -Math.PI / 2 },
      { id: 'seat_03_3', tableId: 'table_03', seatIndex: 2, position: [-5.8, 0, 5.6], rotation: Math.PI },
      { id: 'seat_03_4', tableId: 'table_03', seatIndex: 3, position: [-5.8, 0, 4.0], rotation: 0 },
    ],
  },
  {
    id: 'table_04',
    name: 'Bàn Số 4 (Trung Tâm 2)',
    position: [-1.8, 0, 4.8],
    shape: 'rectangular',
    capacity: 4,
    servicePoint: [-1.8, 0, 3.8],
    seats: [
      { id: 'seat_04_1', tableId: 'table_04', seatIndex: 0, position: [-2.6, 0, 4.8], rotation: Math.PI / 2 },
      { id: 'seat_04_2', tableId: 'table_04', seatIndex: 1, position: [-1.0, 0, 4.8], rotation: -Math.PI / 2 },
      { id: 'seat_04_3', tableId: 'table_04', seatIndex: 2, position: [-1.8, 0, 5.6], rotation: Math.PI },
      { id: 'seat_04_4', tableId: 'table_04', seatIndex: 3, position: [-1.8, 0, 4.0], rotation: 0 },
    ],
  },
  {
    id: 'table_05',
    name: 'Bàn Số 5 (Khu Vực Riêng)',
    position: [6.2, 0, 4.2],
    shape: 'rectangular',
    capacity: 4,
    servicePoint: [6.2, 0, 3.2],
    seats: [
      { id: 'seat_05_1', tableId: 'table_05', seatIndex: 0, position: [5.4, 0, 4.2], rotation: Math.PI / 2 },
      { id: 'seat_05_2', tableId: 'table_05', seatIndex: 1, position: [7.0, 0, 4.2], rotation: -Math.PI / 2 },
      { id: 'seat_05_3', tableId: 'table_05', seatIndex: 2, position: [6.2, 0, 5.0], rotation: Math.PI },
      { id: 'seat_05_4', tableId: 'table_05', seatIndex: 3, position: [6.2, 0, 3.4], rotation: 0 },
    ],
  },
];

// ----------------------------------------------------
// 4. WAITING QUEUE SLOTS
// ----------------------------------------------------

export const QUEUE_SLOTS: QueueSlot[] = [
  { id: 'queue_slot_01', index: 0, position: [3.6, 0, 0.4], rotation: 0, queueType: 'ORDER' },
  { id: 'queue_slot_02', index: 1, position: [3.6, 0, 1.5], rotation: 0, queueType: 'ORDER' },
  { id: 'queue_slot_03', index: 2, position: [3.6, 0, 2.6], rotation: 0, queueType: 'ORDER' },
  { id: 'queue_slot_04', index: 3, position: [3.6, 0, 3.7], rotation: 0, queueType: 'ORDER' },
  { id: 'queue_slot_05', index: 4, position: [2.6, 0, 4.8], rotation: -Math.PI / 4, queueType: 'ORDER' },
  { id: 'queue_slot_06', index: 5, position: [1.4, 0, 5.8], rotation: -Math.PI / 4, queueType: 'ORDER' },
  { id: 'queue_slot_07', index: 6, position: [0.0, 0, 6.6], rotation: 0, queueType: 'ORDER' },
];

// ----------------------------------------------------
// 5. INTERACTION POINTS (FOUNDATION FOR PHASE 6C)
// ----------------------------------------------------

export const INTERACTION_POINTS: InteractionPoint[] = [
  // Stations interaction points
  { id: 'point_prep_stand', name: 'Vị Trí Đầu Bếp Sơ Chế', type: 'EMPLOYEE_STAND', position: [-3.8, 0, -3.4], linkedObjectId: 'station_prep_table' },
  { id: 'point_fryer_stand', name: 'Vị Trí Đầu Bếp Chiên', type: 'EMPLOYEE_STAND', position: [-0.6, 0, -3.4], linkedObjectId: 'station_fryer' },
  { id: 'point_packing_stand', name: 'Vị Trí Nhân Viên Đóng Gói', type: 'EMPLOYEE_STAND', position: [2.6, 0, -3.4], linkedObjectId: 'station_packing' },
  { id: 'point_storage_pick', name: 'Vị Trí Lấy Nguyên Liệu Kho', type: 'EMPLOYEE_STAND', position: [-6.2, 0, -4.5], linkedObjectId: 'storage_area' },
  { id: 'point_rest_stand', name: 'Vị Trí Ghế Nghỉ Ngơi', type: 'EMPLOYEE_STAND', position: [-7.5, 0, -2.0], linkedObjectId: 'staff_rest' },

  // Service counter interaction points
  { id: 'point_order_customer', name: 'Điểm Khách Gọi Món', type: 'ORDER', position: [3.6, 0, 0.4], linkedObjectId: 'counter_order' },
  { id: 'point_order_cashier', name: 'Điểm Thu Ngân Trực Quầy', type: 'EMPLOYEE_STAND', position: [3.6, 0, -2.0], linkedObjectId: 'counter_order' },
  { id: 'point_pickup_customer', name: 'Điểm Khách Nhận Món', type: 'PICKUP', position: [6.8, 0, 0.4], linkedObjectId: 'counter_pickup' },
  { id: 'point_pickup_server', name: 'Điểm Phục Vụ Đặt Món Lên Khay', type: 'EMPLOYEE_STAND', position: [6.8, 0, -2.0], linkedObjectId: 'counter_pickup' },
  { id: 'point_payment_pos', name: 'Điểm Thanh Toán Thẻ & Tiền', type: 'PAYMENT', position: [5.2, 0, 0.4], linkedObjectId: 'counter_payment' },

  // Entrance & Exit points
  { id: 'point_main_entry', name: 'Cửa Vào Sảnh', type: 'ENTRY', position: [0, 0, 7.4], linkedObjectId: 'portal_entrance' },
  { id: 'point_main_exit', name: 'Cửa Rời Quán', type: 'EXIT', position: [-2.2, 0, 7.4], linkedObjectId: 'portal_exit' },
];

// ----------------------------------------------------
// 6. SPATIAL OBSTACLES (BOUNDING BOXES FOR PATHFINDING)
// ----------------------------------------------------

export const SPATIAL_OBSTACLES: SpatialObstacle[] = [
  // Kitchen Equipment
  { id: 'obs_prep_table', name: 'Bàn Sơ Chế', category: 'equipment', position: [-3.8, 0.5, -4.5], size: [2.0, 1.0, 1.3] },
  { id: 'obs_fryer', name: 'Bếp Chiên', category: 'equipment', position: [-0.6, 0.5, -4.5], size: [1.6, 1.0, 1.3] },
  { id: 'obs_packing', name: 'Bàn Đóng Gói', category: 'equipment', position: [2.6, 0.5, -4.5], size: [2.0, 1.0, 1.3] },
  { id: 'obs_storage_rack', name: 'Kệ Kho Hàng', category: 'equipment', position: [-7.5, 1.0, -4.5], size: [1.8, 2.0, 1.0] },

  // Walls & Partitions
  { id: 'obs_kitchen_partition', name: 'Vách Bếp Ngăn', category: 'wall', position: [-2.0, 0.6, -1.0], size: [7.0, 1.2, 0.3] },
  { id: 'obs_service_counter', name: 'Quầy Thu Ngân & Phục Vụ', category: 'counter', position: [5.2, 0.55, -1.0], size: [4.8, 1.1, 1.2] },

  // Dining Tables
  { id: 'obs_table_01', name: 'Bàn 1', category: 'furniture', position: [-5.8, 0.4, 1.8], size: [2.0, 0.8, 2.0] },
  { id: 'obs_table_02', name: 'Bàn 2', category: 'furniture', position: [-1.8, 0.4, 1.8], size: [2.0, 0.8, 2.0] },
  { id: 'obs_table_03', name: 'Bàn 3', category: 'furniture', position: [-5.8, 0.4, 4.8], size: [2.0, 0.8, 2.0] },
  { id: 'obs_table_04', name: 'Bàn 4', category: 'furniture', position: [-1.8, 0.4, 4.8], size: [2.0, 0.8, 2.0] },
  { id: 'obs_table_05', name: 'Bàn 5', category: 'furniture', position: [6.2, 0.4, 4.2], size: [2.0, 0.8, 2.0] },

  // Interior Amenities
  { id: 'obs_condiments', name: 'Quầy Tương & Ống Hút', category: 'decor', position: [1.8, 0.45, 3.2], size: [1.2, 0.9, 0.8] },
  { id: 'obs_trash_bin', name: 'Thùng Rác & Khay Thu Gom', category: 'decor', position: [8.6, 0.5, 6.0], size: [1.0, 1.0, 0.8] },
  { id: 'obs_staff_bench', name: 'Ghế Nghỉ Nhân Viên', category: 'furniture', position: [-7.8, 0.4, -2.0], size: [1.8, 0.8, 0.8] },
];

// ----------------------------------------------------
// 7. NAVIGATION GRAPH NODES (WAYPOINTS FOUNDATION)
// ----------------------------------------------------

export const NAVIGATION_NODES: NavigationNode[] = [
  // Entrance & Queue Line
  { id: 'nav_entrance', name: 'Lối Vào Sảnh', zone: 'ENTRANCE', position: [0, 0, 7.2], connections: ['nav_foyer', 'nav_exit'] },
  { id: 'nav_foyer', name: 'Khu Vực Sảnh Đón', zone: 'ENTRANCE', position: [0, 0, 6.0], connections: ['nav_entrance', 'nav_queue_tail', 'nav_dining_central'] },
  { id: 'nav_queue_tail', name: 'Cuối Hàng Đợi', zone: 'WAITING', position: [1.8, 0, 5.2], connections: ['nav_foyer', 'nav_queue_mid'] },
  { id: 'nav_queue_mid', name: 'Giữa Hàng Đợi', zone: 'WAITING', position: [3.6, 0, 3.0], connections: ['nav_queue_tail', 'nav_queue_front'] },
  { id: 'nav_queue_front', name: 'Đầu Hàng Trước Quầy', zone: 'WAITING', position: [3.6, 0, 0.6], connections: ['nav_queue_mid', 'nav_order_pos', 'nav_pickup_station'] },

  // Service Points
  { id: 'nav_order_pos', name: 'Vị Trí Đứng Gọi Món', zone: 'SERVICE', position: [3.6, 0, 0.4], connections: ['nav_queue_front', 'nav_payment_pos'] },
  { id: 'nav_payment_pos', name: 'Vị Trí Đứng Thanh Toán', zone: 'SERVICE', position: [5.2, 0, 0.4], connections: ['nav_order_pos', 'nav_pickup_station'] },
  { id: 'nav_pickup_station', name: 'Vị Trí Đứng Lấy Món', zone: 'SERVICE', position: [6.8, 0, 0.4], connections: ['nav_payment_pos', 'nav_dining_aisle', 'nav_foyer'] },

  // Dining Hall Aisles
  { id: 'nav_dining_aisle', name: 'Lối Đi Hành Lang Bàn Ăn', zone: 'DINING', position: [0, 0, 3.5], connections: ['nav_dining_central', 'nav_pickup_station', 'nav_kitchen_door'] },
  { id: 'nav_dining_central', name: 'Trung Tâm Khu Bàn Ăn', zone: 'DINING', position: [-3.8, 0, 3.5], connections: ['nav_dining_aisle', 'nav_foyer', 'nav_exit'] },

  // Exit
  { id: 'nav_exit', name: 'Lối Ra Khỏi Quán', zone: 'EXIT', position: [-2.2, 0, 7.2], connections: ['nav_entrance', 'nav_dining_central'] },

  // Kitchen Internal Circulation
  { id: 'nav_kitchen_door', name: 'Cửa Vào Bếp', zone: 'KITCHEN', position: [0, 0, -1.0], connections: ['nav_dining_aisle', 'nav_kitchen_hallway', 'nav_counter_back'] },
  { id: 'nav_kitchen_hallway', name: 'Hành Lang Thao Tác Bếp', zone: 'KITCHEN', position: [-0.5, 0, -2.5], connections: ['nav_kitchen_door', 'nav_prep_station', 'nav_fryer_station', 'nav_packing_station', 'nav_staff_rest'] },
  { id: 'nav_prep_station', name: 'Điểm Đứng Bàn Sơ Chế', zone: 'PREP', position: [-3.8, 0, -3.4], connections: ['nav_kitchen_hallway', 'nav_fryer_station', 'nav_storage'] },
  { id: 'nav_fryer_station', name: 'Điểm Đứng Bếp Chiên', zone: 'COOKING', position: [-0.6, 0, -3.4], connections: ['nav_kitchen_hallway', 'nav_prep_station', 'nav_packing_station'] },
  { id: 'nav_packing_station', name: 'Điểm Đứng Đóng Gói', zone: 'PACKING', position: [2.6, 0, -3.4], connections: ['nav_kitchen_hallway', 'nav_fryer_station', 'nav_counter_back'] },
  { id: 'nav_counter_back', name: 'Phía Sau Quầy Phục Vụ', zone: 'SERVICE', position: [5.2, 0, -2.0], connections: ['nav_kitchen_door', 'nav_packing_station'] },
  { id: 'nav_storage', name: 'Khu Vực Kho Chứa', zone: 'STORAGE', position: [-7.5, 0, -4.5], connections: ['nav_prep_station', 'nav_staff_rest'] },
  { id: 'nav_staff_rest', name: 'Khu Vực Nghỉ Ngơi', zone: 'REST', position: [-7.5, 0, -2.0], connections: ['nav_kitchen_hallway', 'nav_storage'] },
];

// ----------------------------------------------------
// 8. BACKWARD-COMPATIBLE ADAPTER FOR GAME STATE BRIDGE
// ----------------------------------------------------

export const RESTAURANT_LAYOUT = {
  roomSize: [ROOM_CONFIG.width, ROOM_CONFIG.depth] as [number, number],

  stations: {
    prep: {
      position: [-3.8, 0, -4.5] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    fryer: {
      position: [-0.6, 0, -4.5] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    packing: {
      position: [2.6, 0, -4.5] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    beverage: {
      position: [5.8, 0, -4.5] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    grill: {
      position: [-6.5, 0, -4.5] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    assembly: {
      position: [2.6, 0, -2.2] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
    oven: {
      position: [-6.5, 0, -2.2] as Vector3Tuple,
      workerOffset: [0, 0, 1.1] as Vector3Tuple,
      labelOffset: [0, 1.8, 0] as Vector3Tuple,
    },
  },

  storage: {
    position: [-7.5, 0, -4.5] as Vector3Tuple,
  },

  serviceCounter: {
    position: [5.2, 0, -1.0] as Vector3Tuple,
    cashierPosition: [5.2, 0, -2.0] as Vector3Tuple,
    customerPickPosition: [6.8, 0, 0.4] as Vector3Tuple,
    orderPosition: [3.6, 0, 0.4] as Vector3Tuple,
    readyBuffetPosition: [6.8, 0.9, -1.0] as Vector3Tuple,
  },

  staff: {
    idleArea: [-2.0, 0, -2.0] as Vector3Tuple,
    restArea: [-7.5, 0, -2.0] as Vector3Tuple,
  },

  customer: {
    entrance: [0, 0, 7.2] as Vector3Tuple,
    exit: [-2.2, 0, 7.2] as Vector3Tuple,
    queueSlots: QUEUE_SLOTS.map(s => s.position),
    diningTables: DINING_TABLES_LAYOUT,
  },

  diningArea: {
    tables: DINING_TABLES_LAYOUT,
  },
};
