import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const words = db.prepare('SELECT * FROM vocabulary').all();
  return NextResponse.json(words);
}

export async function POST(request: NextRequest) {
  const { wordId, status } = await request.json();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO vocabulary (wordId, status, encounterCount, addedAt, lastReviewedAt)
    VALUES (?, ?, 1, ?, ?)
    ON CONFLICT(wordId) DO UPDATE SET
      status = excluded.status,
      encounterCount = encounterCount + 1,
      lastReviewedAt = excluded.lastReviewedAt
  `).run(wordId, status, now, now);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { wordId } = await request.json();
  db.prepare('DELETE FROM vocabulary WHERE wordId = ?').run(wordId);
  return NextResponse.json({ ok: true });
}
