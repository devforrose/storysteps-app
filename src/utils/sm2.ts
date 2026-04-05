import { SRSCard } from '@/types';

export interface ReviewResult {
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: string;
}

/**
 * SM-2 Algorithm Implementation
 * quality: 0-5 rating
 *   0 - Complete blackout
 *   1 - Incorrect, but remembered upon seeing answer
 *   2 - Incorrect, but answer seemed easy to recall
 *   3 - Correct with serious difficulty
 *   4 - Correct with some hesitation
 *   5 - Perfect response
 */
export function calculateNextReview(card: SRSCard, quality: number): ReviewResult {
  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    // Failed review - reset
    repetitions = 0;
    interval = 1;
  } else {
    // Successful review
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    repetitions,
    nextReviewDate: nextDate.toISOString(),
  };
}

export function isCardDueToday(card: SRSCard): boolean {
  const now = new Date();
  const dueDate = new Date(card.nextReviewDate);
  return dueDate <= now;
}

export function createSRSCard(wordId: string, front: string, back: string): SRSCard {
  return {
    id: `srs-${wordId}-${Date.now()}`,
    wordId,
    front,
    back,
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewDate: new Date().toISOString(),
    lastReviewedAt: undefined,
  };
}
