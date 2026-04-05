import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET() {
  const cards = db.prepare('SELECT * FROM srs_cards').all();
  return NextResponse.json(cards);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ...data } = body;

  if (action === 'add') {
    const id = randomUUID();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO srs_cards (id, wordId, front, back, interval, easeFactor, repetitions, nextReviewDate, createdAt)
      VALUES (?, ?, ?, ?, 0, 2.5, 0, ?, ?)
    `).run(id, data.wordId, data.front, data.back, now, now);
    return NextResponse.json({ id, wordId: data.wordId, front: data.front, back: data.back, interval: 0, easeFactor: 2.5, repetitions: 0, nextReviewDate: now });
  }

  if (action === 'review') {
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE srs_cards SET interval = ?, easeFactor = ?, repetitions = ?, nextReviewDate = ?, lastReviewedAt = ?
      WHERE id = ?
    `).run(data.interval, data.easeFactor, data.repetitions, data.nextReviewDate, now, data.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

export async function DELETE(request: NextRequest) {
  const { wordId } = await request.json();
  db.prepare('DELETE FROM srs_cards WHERE wordId = ?').run(wordId);
  return NextResponse.json({ ok: true });
}
