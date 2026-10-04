import { describe, it, expect } from 'vitest';
import {
  ROOM_CONFIG,
  RESTAURANT_ZONES,
  RESTAURANT_PORTALS,
  DINING_TABLES_LAYOUT,
  QUEUE_SLOTS,
  INTERACTION_POINTS,
  SPATIAL_OBSTACLES,
  NAVIGATION_NODES,
  RESTAURANT_LAYOUT,
} from '../3d/config/restaurantLayout';
import { CAMERA_CONFIG, CAMERA_PRESETS } from '../3d/config/cameraConfig';

describe('Phase 6B: Physical Restaurant & Spatial Data Architecture', () => {
  describe('Room Bounds and Configuration', () => {
    it('should define realistic room dimensions', () => {
      expect(ROOM_CONFIG.width).toBe(20);
      expect(ROOM_CONFIG.depth).toBe(15);
      expect(ROOM_CONFIG.wallHeight).toBeGreaterThanOrEqual(2.0);
      expect(ROOM_CONFIG.kitchenDividerZ).toBeLessThan(0);
    });

    it('should maintain backward compatibility with RESTAURANT_LAYOUT object', () => {
      expect(RESTAURANT_LAYOUT.roomSize).toEqual([20, 15]);
      expect(RESTAURANT_LAYOUT.serviceCounter.position).toBeDefined();
      expect(RESTAURANT_LAYOUT.storage.position).toBeDefined();
      expect(RESTAURANT_LAYOUT.diningArea.tables.length).toBe(5);
    });
  });

  describe('Restaurant Zones', () => {
    it('should have unique zone IDs across all defined zones', () => {
      const zoneIds = RESTAURANT_ZONES.map(z => z.id);
      const uniqueIds = new Set(zoneIds);
      expect(uniqueIds.size).toBe(zoneIds.length);
    });

    it('should cover all critical operational zones of the restaurant', () => {
      const zoneTypes = RESTAURANT_ZONES.map(z => z.type);
      expect(zoneTypes).toContain('ENTRANCE');
      expect(zoneTypes).toContain('WAITING');
      expect(zoneTypes).toContain('DINING');
      expect(zoneTypes).toContain('SERVICE');
      expect(zoneTypes).toContain('KITCHEN');
      expect(zoneTypes).toContain('PREP');
      expect(zoneTypes).toContain('COOKING');
      expect(zoneTypes).toContain('PACKING');
      expect(zoneTypes).toContain('STORAGE');
      expect(zoneTypes).toContain('REST');
      expect(zoneTypes).toContain('EXIT');
    });

    it('should place all zones within room boundaries', () => {
      const halfW = ROOM_CONFIG.width / 2;
      const halfD = ROOM_CONFIG.depth / 2;

      for (const zone of RESTAURANT_ZONES) {
        const [x, , z] = zone.position;
        expect(x).toBeGreaterThanOrEqual(-halfW);
        expect(x).toBeLessThanOrEqual(halfW);
        expect(z).toBeGreaterThanOrEqual(-halfD);
        expect(z).toBeLessThanOrEqual(halfD);
        expect(zone.size[0]).toBeGreaterThan(0);
        expect(zone.size[1]).toBeGreaterThan(0);
      }
    });
  });

  describe('Portals (Doors and Passages)', () => {
    it('should include entrance, exit, and kitchen doors', () => {
      const portalTypes = RESTAURANT_PORTALS.map(p => p.type);
      expect(portalTypes).toContain('ENTRANCE');
      expect(portalTypes).toContain('EXIT');
      expect(portalTypes).toContain('KITCHEN_DOOR');
      expect(portalTypes).toContain('STAFF_DOOR');
    });
  });

  describe('Dining Tables and Seating Layout', () => {
    it('should define 5 distinct 4-seat dining tables', () => {
      expect(DINING_TABLES_LAYOUT.length).toBe(5);
      DINING_TABLES_LAYOUT.forEach(table => {
        expect(table.capacity).toBe(4);
        expect(table.seats.length).toBe(4);
        expect(table.servicePoint).toBeDefined();
      });
    });

    it('should have 20 uniquely identifiable seats with valid parent table references', () => {
      const seatIds: string[] = [];
      DINING_TABLES_LAYOUT.forEach(table => {
        table.seats.forEach(seat => {
          expect(seat.tableId).toBe(table.id);
          seatIds.push(seat.id);
        });
      });

      expect(seatIds.length).toBe(20);
      const uniqueSeats = new Set(seatIds);
      expect(uniqueSeats.size).toBe(20);
    });

    it('should position all tables inside the dining zone area', () => {
      const halfW = ROOM_CONFIG.width / 2;
      const halfD = ROOM_CONFIG.depth / 2;

      DINING_TABLES_LAYOUT.forEach(table => {
        const [x, , z] = table.position;
        expect(x).toBeGreaterThanOrEqual(-halfW);
        expect(x).toBeLessThanOrEqual(halfW);
        expect(z).toBeGreaterThan(0); // Tables are in customer-facing southern half
        expect(z).toBeLessThanOrEqual(halfD);
      });
    });
  });

  describe('Customer Queue Slots', () => {
    it('should contain 7 sequential queue slots with unique IDs', () => {
      expect(QUEUE_SLOTS.length).toBe(7);
      const slotIds = new Set(QUEUE_SLOTS.map(s => s.id));
      expect(slotIds.size).toBe(7);

      QUEUE_SLOTS.forEach((slot, idx) => {
        expect(slot.index).toBe(idx);
        expect(slot.queueType).toBe('ORDER');
      });
    });

    it('should place queue slots near the service counter', () => {
      const firstSlot = QUEUE_SLOTS[0];
      const [fx, , fz] = firstSlot.position;
      expect(fx).toBeGreaterThan(0); // Right side towards counter
      expect(fz).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Interaction Points', () => {
    it('should have unique IDs and cover essential service points', () => {
      const pointIds = new Set(INTERACTION_POINTS.map(p => p.id));
      expect(pointIds.size).toBe(INTERACTION_POINTS.length);

      const types = INTERACTION_POINTS.map(p => p.type);
      expect(types).toContain('ORDER');
      expect(types).toContain('PAYMENT');
      expect(types).toContain('PICKUP');
      expect(types).toContain('ENTRY');
      expect(types).toContain('EXIT');
      expect(types).toContain('EMPLOYEE_STAND');
    });
  });

  describe('Spatial Obstacles (Collision Data)', () => {
    it('should provide bounding boxes with positive 3D dimensions', () => {
      expect(SPATIAL_OBSTACLES.length).toBeGreaterThan(10);

      SPATIAL_OBSTACLES.forEach(obstacle => {
        const [w, h, d] = obstacle.size;
        expect(w).toBeGreaterThan(0);
        expect(h).toBeGreaterThan(0);
        expect(d).toBeGreaterThan(0);
      });
    });

    it('should cover furniture, equipment, counter and walls', () => {
      const categories = new Set(SPATIAL_OBSTACLES.map(o => o.category));
      expect(categories.has('furniture')).toBe(true);
      expect(categories.has('equipment')).toBe(true);
      expect(categories.has('counter')).toBe(true);
      expect(categories.has('wall')).toBe(true);
      expect(categories.has('decor')).toBe(true);
    });
  });

  describe('Navigation Graph Structure', () => {
    it('should define a connected waypoint network of 19 nodes', () => {
      expect(NAVIGATION_NODES.length).toBe(19);
      const nodeIds = new Set(NAVIGATION_NODES.map(n => n.id));
      expect(nodeIds.size).toBe(19);
    });

    it('should guarantee that every connected node ID actually exists in the graph (no broken links)', () => {
      const nodeIds = new Set(NAVIGATION_NODES.map(n => n.id));

      NAVIGATION_NODES.forEach(node => {
        expect(node.connections.length).toBeGreaterThan(0);
        node.connections.forEach(connectedId => {
          expect(nodeIds.has(connectedId)).toBe(true);
        });
      });
    });
  });

  describe('Camera Presets and Configuration', () => {
    it('should provide all standard camera presets with valid 3D coordinates', () => {
      const presetKeys = Object.keys(CAMERA_PRESETS);
      expect(presetKeys).toContain('DEFAULT');
      expect(presetKeys).toContain('KITCHEN');
      expect(presetKeys).toContain('DINING');
      expect(presetKeys).toContain('SERVICE');

      Object.values(CAMERA_PRESETS).forEach(preset => {
        expect(preset.position.length).toBe(3);
        expect(preset.target.length).toBe(3);
        expect(preset.position[1]).toBeGreaterThan(0); // Height above ground
      });
    });

    it('should specify appropriate FOV and distance limits', () => {
      expect(CAMERA_CONFIG.fov).toBeGreaterThan(30);
      expect(CAMERA_CONFIG.fov).toBeLessThan(70);
      expect(CAMERA_CONFIG.minDistance).toBeLessThan(CAMERA_CONFIG.maxDistance);
    });
  });
});
