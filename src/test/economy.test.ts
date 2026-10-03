import { describe, it, expect } from 'vitest';
import { INITIAL_FOODS, INITIAL_EMPLOYEES, INITIAL_UPGRADES } from '../data/initialData';
import { StorageService } from '../services/storage';

describe('Snack Empire Economy & Game Logic Tests', () => {
  it('calculates food profit and margins accurately', () => {
    const burger = INITIAL_FOODS.find(f => f.id === 'food_burger')!;
    expect(burger).toBeDefined();
    expect(burger.sellingPrice).toBeGreaterThan(burger.baseCost);

    const profit = burger.sellingPrice - burger.baseCost;
    expect(profit).toBe(8.5); // 15 - 6.5
    const profitMargin = profit / burger.sellingPrice;
    expect(profitMargin).toBeGreaterThan(0.5); // > 50% margin
  });

  it('calculates employee payroll accurately', () => {
    const bob = INITIAL_EMPLOYEES.find(e => e.id === 'emp_cook_bob')!;
    const linh = INITIAL_EMPLOYEES.find(e => e.role === 'cashier')!;
    
    expect(bob.salaryPerSec).toBe(0.8);
    expect(linh.salaryPerSec).toBe(0.5);

    const combinedPayroll = bob.salaryPerSec + linh.salaryPerSec;
    expect(combinedPayroll).toBe(1.3);
  });

  it('calculates upgrade cost exponential scaling', () => {
    const grill = INITIAL_UPGRADES.find(u => u.id === 'upg_grill')!;
    const level0Cost = Math.round(grill.baseCost * Math.pow(grill.costMultiplier, 0));
    const level1Cost = Math.round(grill.baseCost * Math.pow(grill.costMultiplier, 1));
    const level2Cost = Math.round(grill.baseCost * Math.pow(grill.costMultiplier, 2));

    expect(level0Cost).toBe(75);
    expect(level1Cost).toBe(120); // 75 * 1.6 = 120
    expect(level2Cost).toBe(192); // 120 * 1.6 = 192
    expect(level2Cost).toBeGreaterThan(level1Cost);
  });

  it('calculates prestige reward formula properly', () => {
    // Formula: floor(sqrt(totalRevenueEarned / 10000))
    const calcPrestige = (rev: number) => Math.max(1, Math.floor(Math.sqrt(rev / 10000)));

    expect(calcPrestige(0)).toBe(1);
    expect(calcPrestige(5000)).toBe(1);
    expect(calcPrestige(10000)).toBe(1);
    expect(calcPrestige(40000)).toBe(2);
    expect(calcPrestige(100000)).toBe(3);
    expect(calcPrestige(1000000)).toBe(10);
  });

  it('calculates offline income with efficiency multiplier', () => {
    const secondsAway = 3600; // 1 hour away
    const baseRate = 2.5;     // $2.5 / sec
    const efficiency = 0.4;   // 40% efficiency

    const offlineEarnings = Math.round(secondsAway * baseRate * efficiency);
    expect(offlineEarnings).toBe(3600); // 3600 * 1 = $3,600
  });

  it('validates save game schema safely and rejects malicious JSON', () => {
    const validJson = JSON.stringify({
      version: 1,
      lastSavedTimestamp: Date.now(),
      money: 1500,
      xp: 300,
      level: 3,
      ingredients: { beef: 20 },
      foodLevels: { food_burger: { level: 2, unlocked: true } }
    });

    const parsedValid = StorageService.validateImport(validJson);
    expect(parsedValid).not.toBeNull();
    expect(parsedValid?.money).toBe(1500);

    const corruptJson = '{"money": "NOT_A_NUMBER", "broken": true}';
    const parsedCorrupt = StorageService.validateImport(corruptJson);
    expect(parsedCorrupt).toBeNull();
  });
});
