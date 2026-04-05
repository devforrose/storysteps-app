import { Router } from 'express';
import { db } from '../db';
import { vocabulary } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res) => {
  const words = await db.select().from(vocabulary);
  res.json(words);
});

router.post('/', async (req, res) => {
  const { wordId, status } = req.body;
  const now = new Date().toISOString();

  await db
    .insert(vocabulary)
    .values({ wordId, status, encounterCount: 1, addedAt: now, lastReviewedAt: now })
    .onConflictDoUpdate({
      target: vocabulary.wordId,
      set: {
        status,
        encounterCount: sql`${vocabulary.encounterCount} + 1`,
        lastReviewedAt: now,
      },
    });

  res.json({ ok: true });
});

router.delete('/', async (req, res) => {
  const { wordId } = req.body;
  await db.delete(vocabulary).where(eq(vocabulary.wordId, wordId));
  res.json({ ok: true });
});

export default router;
