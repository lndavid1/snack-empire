import { describe, it, expect, beforeEach } from 'vitest';
import { SatisfactionService } from '../services/satisfaction';
import { useGameStore } from '../store/gameStore';

describe('Phase 4: SatisfactionService Unit Tests', () => {
  it('calculates food freshness decay deterministically over time', () => {
    const readyAt = 1000000;
    // Immediate (0s) -> 100
    expect(SatisfactionService.calculateFoodFreshness(readyAt, readyAt)).toBe(100);
    // 5s -> 98
    expect(SatisfactionService.calculateFoodFreshness(readyAt, readyAt + 5000)).toBe(98);
    // 10s -> 95
    expect(SatisfactionService.calculateFoodFreshness(readyAt, readyAt + 10000)).toBe(95);
    // 20s -> 85
    expect(SatisfactionService.calculateFoodFreshness(readyAt, readyAt + 20000)).toBe(85);
    // 40s -> 65
    expect(SatisfactionService.calculateFoodFreshness(readyAt, readyAt + 40000)).toBe(65);
    // 60s -> 40
    expect(SatisfactionService.calculateFoodFreshness(readyAt, readyAt + 60000)).toBe(40);
    // > 60s -> decays down to floor 10
    expect(SatisfactionService.calculateFoodFreshness(readyAt, readyAt + 120000)).toBe(10);
  });

  it('calculates food temperature decay deterministically over time', () => {
    const readyAt = 1000000;
    // Immediate (0s) -> 100
    expect(SatisfactionService.calculateFoodTemperature(readyAt, readyAt)).toBe(100);
    // 10s -> 95
    expect(SatisfactionService.calculateFoodTemperature(readyAt, readyAt + 10000)).toBe(95);
    // 20s -> 85
    expect(SatisfactionService.calculateFoodTemperature(readyAt, readyAt + 20000)).toBe(85);
    // 40s -> 60
    expect(SatisfactionService.calculateFoodTemperature(readyAt, readyAt + 40000)).toBe(60);
    // 60s -> 35
    expect(SatisfactionService.calculateFoodTemperature(readyAt, readyAt + 60000)).toBe(35);
    // > 60s -> decays down to floor 5
    expect(SatisfactionService.calculateFoodTemperature(readyAt, readyAt + 120000)).toBe(5);
  });

  it('calculates price/value score correctly with price sensitivity', () => {
    // Normal price or discount -> 100
    expect(SatisfactionService.calculatePriceValueScore(10, 10, 90, 1.0)).toBe(100);
    expect(SatisfactionService.calculatePriceValueScore(8, 10, 90, 1.0)).toBe(100);

    // Overpricing with normal sensitivity
    const markupScore = SatisfactionService.calculatePriceValueScore(15, 10, 80, 1.0);
    expect(markupScore).toBeLessThan(100);
    expect(markupScore).toBeGreaterThan(50);

    // Overpricing with high sensitivity (students) penalizes more
    const studentScore = SatisfactionService.calculatePriceValueScore(15, 10, 80, 1.5);
    expect(studentScore).toBeLessThan(markupScore);
  });

  it('computes 5-star delighted experience with 20% tip when food is fresh, hot, and fast', () => {
    const result = SatisfactionService.calculateSatisfaction({
      waitingTime: 2,
      maxPatience: 25,
      qualityScore: 95,
      freshness: 98,
      temperature: 98,
      orderAccuracy: 100,
      priceValueScore: 100,
      basePrice: 20,
      foodName: 'Khoai Tây Chiên',
      customerName: 'Hoàng',
      customerAvatar: '🎮',
      customerId: 'cust_1'
    });

    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.stars).toBe(5);
    expect(result.mood).toBe('DELIGHTED');
    expect(result.tipPercent).toBe(0.20);
    expect(result.tipAmount).toBe(4); // 20 * 0.20
    expect(result.reputationDelta).toBe(0.4);
    expect(result.review.stars).toBe(5);
    expect(result.review.tipAmount).toBe(4);
  });

  it('computes 1-star angry experience with 0% tip and reputation penalty on cold, stale food with long wait', () => {
    const result = SatisfactionService.calculateSatisfaction({
      waitingTime: 24,
      maxPatience: 25,
      qualityScore: 40,
      freshness: 20,
      temperature: 15,
      orderAccuracy: 100,
      priceValueScore: 40,
      basePrice: 20,
      foodName: 'Khoai Tây Chiên',
      customerName: 'Tuấn',
      customerAvatar: '💼',
      customerId: 'cust_2'
    });

    expect(result.score).toBeLessThan(35);
    expect(result.stars).toBe(1);
    expect(result.mood).toBe('ANGRY');
    expect(result.tipPercent).toBe(0);
    expect(result.tipAmount).toBe(0);
    expect(result.reputationDelta).toBe(-0.6);
    expect(result.review.stars).toBe(1);
  });
});

describe('Phase 4: Store Customer Lifecycle & Service Loop Integration', () => {
  beforeEach(() => {
    const store = useGameStore.getState();
    useGameStore.setState({
      money: 500,
      reputation: 60,
      totalSalesCount: 0,
      totalRevenueEarned: 0,
      totalTipsEarned: 0,
      totalCustomersServed: 0,
      customers: [],
      orders: [],
      productionJobs: [],
      reviews: []
    });
  });

  it('updates customer patience, mood and order waitingTime on each simulation tick', () => {
    useGameStore.setState({
      customers: [
        {
          id: 'c_test_1',
          name: 'Linh',
          archetype: 'student',
          avatar: '🎒',
          budget: 50,
          patience: 20,
          maxPatience: 20,
          waitingTime: 0,
          mood: 'DELIGHTED',
          favoriteFoodId: 'food_fries',
          orderedFoodId: 'food_fries',
          orderId: 'ord_test_1',
          state: 'waiting',
          satisfaction: 5,
          quote: 'Burger đỉnh chóp!'
        }
      ],
      orders: [
        {
          id: 'ord_test_1',
          customerId: 'c_test_1',
          foodId: 'food_fries',
          quantity: 1,
          createdAt: Date.now(),
          waitingTime: 0,
          status: 'PENDING',
          basePrice: 12
        }
      ]
    });

    // Run 1 tick
    useGameStore.getState().tickSimulation();

    const state1 = useGameStore.getState();
    const cust1 = state1.customers.find(c => c.id === 'c_test_1')!;
    const ord1 = state1.orders.find(o => o.id === 'ord_test_1')!;

    expect(cust1.waitingTime).toBe(1);
    expect(cust1.patience).toBe(19);
    expect(cust1.mood).toBe('DELIGHTED');
    expect(ord1.waitingTime).toBe(1);

    // Simulate patience drop down to near expiration
    useGameStore.setState({
      customers: [{ ...cust1, patience: 3, currentWait: 3, waitingTime: 17 }]
    });

    useGameStore.getState().tickSimulation();

    const state2 = useGameStore.getState();
    const cust2 = state2.customers.find(c => c.id === 'c_test_1')!;
    expect(cust2.patience).toBe(2);
    expect(cust2.mood).toBe('ANGRY'); // 2 / 20 = 0.10 -> ANGRY
  });

  it('triggers rage quit when patience runs out, cancels production job, penalizes reputation, and creates 1-star review', () => {
    const store = useGameStore.getState();
    useGameStore.setState({
      reputation: 60,
      customers: [
        {
          id: 'c_rage',
          name: 'Bảo',
          archetype: 'office',
          avatar: '💼',
          budget: 50,
          patience: 1,
          maxPatience: 20,
          waitingTime: 19,
          mood: 'ANGRY',
          favoriteFoodId: 'food_fries',
          orderedFoodId: 'food_fries',
          orderId: 'ord_rage',
          state: 'waiting',
          satisfaction: 1,
          quote: 'Lâu quá!'
        }
      ],
      orders: [
        {
          id: 'ord_rage',
          customerId: 'c_rage',
          foodId: 'food_fries',
          quantity: 1,
          createdAt: Date.now(),
          waitingTime: 19,
          status: 'PRODUCING',
          productionJobId: 'job_rage',
          basePrice: 12
        }
      ],
      productionJobs: [
        {
          id: 'job_rage',
          orderId: 'c_rage',
          recipeId: 'recipe_french_fries',
          stationId: 'station_prep_table',
          status: 'COOKING',
          currentStepIndex: 1,
          progress: 50
        }
      ]
    });

    // Run tick that causes patience to hit 0
    useGameStore.getState().tickSimulation();

    const state = useGameStore.getState();
    // Customer left
    expect(state.customers.some(c => c.id === 'c_rage')).toBe(false);
    // Reputation penalized by -1.0
    expect(state.reputation).toBe(59);
    // Order cancelled
    const ord = state.orders.find(o => o.id === 'ord_rage')!;
    expect(ord.status).toBe('CANCELLED');
    // Production job cancelled
    const job = state.productionJobs.find(j => j.id === 'job_rage')!;
    expect(job.status).toBe('CANCELLED');
    // Rage review added
    expect(state.reviews.some(r => r.customerId === 'c_rage' && r.stars === 1)).toBe(true);
  });

  it('serving READY food awards base price + tip, updates totalTipsEarned, and marks order as SERVED', () => {
    const store = useGameStore.getState();
    const readyAt = Date.now(); // freshly ready

    useGameStore.setState({
      money: 100,
      totalTipsEarned: 0,
      totalRevenueEarned: 0,
      reputation: 60,
      prestigeUpgrades: [],
      activeEvent: null,
      customers: [
        {
          id: 'c_serve_test',
          name: 'Hương',
          archetype: 'influencer',
          avatar: '🤳',
          budget: 50,
          patience: 20,
          maxPatience: 25,
          waitingTime: 3,
          mood: 'DELIGHTED',
          favoriteFoodId: 'food_fries',
          orderedFoodId: 'food_fries',
          orderId: 'ord_serve_test',
          state: 'waiting',
          satisfaction: 5,
          quote: 'Ngon chuẩn!'
        }
      ],
      orders: [
        {
          id: 'ord_serve_test',
          customerId: 'c_serve_test',
          foodId: 'food_fries',
          recipeId: 'recipe_french_fries',
          quantity: 1,
          createdAt: Date.now() - 3000,
          waitingTime: 3,
          status: 'READY',
          productionJobId: 'job_serve_test',
          basePrice: 10
        }
      ],
      productionJobs: [
        {
          id: 'job_serve_test',
          orderId: 'c_serve_test',
          recipeId: 'recipe_french_fries',
          stationId: 'station_packing',
          status: 'READY',
          currentStepIndex: 2,
          progress: 100,
          readyAt,
          freshness: 100,
          temperature: 100,
          qualityScore: 95
        }
      ]
    });

    const served = useGameStore.getState().manualCookAndServe('c_serve_test');
    expect(served).toBe(true);

    const state = useGameStore.getState();
    // Customer served and removed from waiting list
    expect(state.customers.length).toBe(0);
    // Job marked as SERVED
    const job = state.productionJobs.find(j => j.id === 'job_serve_test')!;
    expect(job.status).toBe('SERVED');
    // Order marked as SERVED with satisfactionScore & tipAmount
    const order = state.orders.find(o => o.id === 'ord_serve_test')!;
    expect(order.status).toBe('SERVED');
    expect(order.satisfactionScore).toBeGreaterThanOrEqual(90);
    expect(order.tipAmount).toBeGreaterThan(0);
    // Money increased by base + tip
    expect(state.money).toBe(100 + 7 + order.tipAmount!);
    // Total tips earned recorded
    expect(state.totalTipsEarned).toBeGreaterThan(0);
    expect(state.totalTipsEarned).toBe(order.tipAmount);
    // Reviews contains new satisfaction review
    expect(state.reviews[0].customerId).toBe('c_serve_test');
    expect(state.reviews[0].stars).toBe(5);
  });
});
