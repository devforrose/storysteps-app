import { Router } from 'express';
import { db } from '../db';
import { srsCards } from '../db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const router = Router();

router.get('/', async (_req, res) => {
  const cards = await db.select().from(srsCards);
  res.json(cards);
});

router.post('/', async (req, res) => {
  const { action, ...data } = req.body;

  if (action === 'add') {
    const id = randomUUID();
    const now = new Date().toISOString();
    const card = {
      id,
      wordId: data.wordId,
      front: data.front,
      back: data.back,
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: now,
      createdAt: now,
    };
    await db.insert(srsCards).values(card);
    res.json(card);
    return;
  }

  if (action === 'review') {
    const now = new Date().toISOString();
    await db
      .update(srsCards)
      .set({
        interval: data.interval,
        easeFactor: data.easeFactor,
        repetitions: data.repetitions,
        nextReviewDate: data.nextReviewDate,
        lastReviewedAt: now,
      })
      .where(eq(srsCards.id, data.id));
    res.json({ ok: true });
    return;
  }

  res.status(400).json({ error: 'Unknown action' });
});

router.delete('/', async (req, res) => {
  const { wordId } = req.body;
  await db.delete(srsCards).where(eq(srsCards.wordId, wordId));
  res.json({ ok: true });
});

export default router;
