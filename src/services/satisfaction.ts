import { CustomerMood, Review } from '../types/game';

export interface SatisfactionParams {
  waitingTime: number;
  maxPatience: number;
  qualityScore: number;       // 0 to 100
  freshness: number;          // 0 to 100
  temperature: number;        // 0 to 100
  orderAccuracy: number;      // 0 to 100
  priceValueScore: number;    // 0 to 100
  basePrice: number;
  foodName: string;
  customerName: string;
  customerAvatar: string;
  customerId: string;
  orderId?: string;
  foodId?: string;
}

export interface SatisfactionResult {
  score: number;              // 0 to 100
  mood: CustomerMood;
  stars: number;              // 1 to 5
  tipAmount: number;
  tipPercent: number;
  reputationDelta: number;
  review: Review;
}

export const SatisfactionService = {
  // Freshness decay: 100 immediately after READY, gradually decreases with time
  calculateFoodFreshness(readyAt: number, currentTime = Date.now()): number {
    const elapsedSec = Math.max(0, (currentTime - readyAt) / 1000);
    if (elapsedSec <= 10) {
      return Math.round(100 - (elapsedSec / 10) * 5); // 100 -> 95
    }
    if (elapsedSec <= 20) {
      return Math.round(95 - ((elapsedSec - 10) / 10) * 10); // 95 -> 85
    }
    if (elapsedSec <= 40) {
      return Math.round(85 - ((elapsedSec - 20) / 20) * 20); // 85 -> 65
    }
    if (elapsedSec <= 60) {
      return Math.round(65 - ((elapsedSec - 40) / 20) * 25); // 65 -> 40
    }
    return Math.max(10, Math.round(40 - (elapsedSec - 60) * 0.5));
  },

  // Temperature score: 100 for freshly ready, decays as food gets cold
  calculateFoodTemperature(readyAt: number, currentTime = Date.now()): number {
    const elapsedSec = Math.max(0, (currentTime - readyAt) / 1000);
    if (elapsedSec <= 10) {
      return Math.round(100 - (elapsedSec / 10) * 5); // 100 -> 95
    }
    if (elapsedSec <= 20) {
      return Math.round(95 - ((elapsedSec - 10) / 10) * 10); // 95 -> 85
    }
    if (elapsedSec <= 40) {
      return Math.round(85 - ((elapsedSec - 20) / 20) * 25); // 85 -> 60
    }
    if (elapsedSec <= 60) {
      return Math.round(60 - ((elapsedSec - 40) / 20) * 25); // 60 -> 35
    }
    return Math.max(5, Math.round(35 - (elapsedSec - 60) * 0.7));
  },

  // Price/Value perception
  calculatePriceValueScore(
    sellingPrice: number,
    basePrice: number,
    qualityScore: number,
    priceSensitivity = 1.0
  ): number {
    if (sellingPrice <= basePrice) return 100;
    const markupRatio = sellingPrice / basePrice; // e.g. 1.2 = 20% markup
    // High quality helps justify markup
    const qualityFactor = qualityScore / 100; // e.g. 0.95
    const penalty = Math.max(0, (markupRatio - 1.0) * 40 * priceSensitivity * (1.2 - qualityFactor));
    return Math.min(100, Math.max(10, Math.round(100 - penalty)));
  },

  // Centralized deterministic customer satisfaction calculation
  calculateSatisfaction(params: SatisfactionParams): SatisfactionResult {
    const {
      waitingTime,
      maxPatience,
      qualityScore,
      freshness,
      temperature,
      orderAccuracy,
      priceValueScore,
      basePrice,
      foodName,
      customerName,
      customerAvatar,
      customerId,
      orderId,
      foodId
    } = params;

    // Waiting score: 100 if immediate, 0 if at max patience
    const waitRatio = Math.min(1.0, Math.max(0, waitingTime / Math.max(1, maxPatience)));
    const waitScore = Math.max(0, (1 - waitRatio) * 100);

    // Weighted satisfaction components:
    // Quality: 30%, Waiting: 20%, Freshness: 15%, Temperature: 15%, Accuracy: 10%, Price/Value: 10%
    const rawScore =
      qualityScore * 0.30 +
      waitScore * 0.20 +
      freshness * 0.15 +
      temperature * 0.15 +
      orderAccuracy * 0.10 +
      priceValueScore * 0.10;

    const score = Math.min(100, Math.max(0, Math.round(rawScore)));

    // Derive mood
    let mood: CustomerMood = 'NEUTRAL';
    if (score >= 90) mood = 'DELIGHTED';
    else if (score >= 75) mood = 'HAPPY';
    else if (score >= 55) mood = 'NEUTRAL';
    else if (score >= 35) mood = 'IMPATIENT';
    else mood = 'ANGRY';

    // Derive star rating (1 to 5)
    let stars = 3;
    if (score >= 90) stars = 5;
    else if (score >= 75) stars = 4;
    else if (score >= 55) stars = 3;
    else if (score >= 35) stars = 2;
    else stars = 1;

    // Derive Tip
    let tipPercent = 0;
    if (score >= 90) tipPercent = 0.20;
    else if (score >= 75) tipPercent = 0.10;
    else if (score >= 60) tipPercent = 0.05;

    const tipAmount = Math.round(basePrice * tipPercent);

    // Reputation impact
    let reputationDelta = 0;
    if (stars === 5) reputationDelta = 0.4;
    else if (stars === 4) reputationDelta = 0.2;
    else if (stars === 3) reputationDelta = 0.0;
    else if (stars === 2) reputationDelta = -0.3;
    else reputationDelta = -0.6;

    // Contextual comment based on actual experience
    let comment = `Món ${foodName} khá ổn!`;
    if (score >= 90) {
      if (waitRatio < 0.4) {
        comment = `Món ${foodName} nóng hổi, giòn rụm và phục vụ siêu nhanh! 5 sao đỉnh nóc! 🔥`;
      } else {
        comment = `Món ${foodName} chất lượng tuyệt hảo, ăn ngon quên lối về! ✨`;
      }
    } else if (score >= 75) {
      if (waitRatio > 0.6) {
        comment = `Món ăn ngon chuẩn vị nhưng quán đông nên đợi hơi lâu xíu.`;
      } else {
        comment = `Đồ ăn ngon, phục vụ chu đáo, lần sau sẽ quay lại! 👍`;
      }
    } else if (score >= 55) {
      if (freshness < 70) {
        comment = `Món đã hơi nguội bớt, hương vị ở mức tạm ổn.`;
      } else if (waitRatio > 0.7) {
        comment = `Chờ khá lâu, quán cần cải thiện tốc độ phục vụ.`;
      } else {
        comment = `Chất lượng ở mức bình thường, không quá đặc sắc.`;
      }
    } else if (score >= 35) {
      if (temperature < 50) {
        comment = `Đồ ăn bị nguội ngắt, ăn mất hết độ ngon! 👎`;
      } else if (priceValueScore < 50) {
        comment = `Giá hơi chát so với khẩu phần và chất lượng nhận được.`;
      } else {
        comment = `Phục vụ chậm chạp, trải nghiệm ăn uống chưa hài lòng.`;
      }
    } else {
      comment = `Quá thất vọng! Chờ dài cổ mà đồ ăn thì không nuốt nổi! 😡`;
    }

    const review: Review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      customerId,
      orderId,
      foodId,
      customerName,
      avatar: customerAvatar,
      stars,
      satisfactionScore: score,
      comment,
      timeAgo: 'Vừa xong',
      foodName,
      tipAmount,
      createdAt: Date.now()
    };

    return {
      score,
      mood,
      stars,
      tipAmount,
      tipPercent,
      reputationDelta,
      review
    };
  }
};
