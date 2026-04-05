import { pgTable, text, integer, real } from 'drizzle-orm/pg-core';

export const vocabulary = pgTable('vocabulary', {
  wordId: text('word_id').primaryKey(),
  status: text('status').notNull(),
  encounterCount: integer('encounter_count').default(1),
  addedAt: text('added_at').notNull(),
  lastReviewedAt: text('last_reviewed_at'),
});

export const srsCards = pgTable('srs_cards', {
  id: text('id').primaryKey(),
  wordId: text('word_id').notNull(),
  front: text('front').notNull(),
  back: text('back').notNull(),
  interval: integer('interval').default(0),
  easeFactor: real('ease_factor').default(2.5),
  repetitions: integer('repetitions').default(0),
  nextReviewDate: text('next_review_date').notNull(),
  lastReviewedAt: text('last_reviewed_at'),
  createdAt: text('created_at').notNull(),
});

export const transcriptCache = pgTable('transcript_cache', {
  videoId: text('video_id').primaryKey(),
  source: text('source').notNull(),
  data: text('data').notNull(),
  createdAt: text('created_at').notNull(),
});

export const savedVideos = pgTable('saved_videos', {
  videoId: text('video_id').primaryKey(),
  title: text('title').notNull(),
  thumbnail: text('thumbnail').notNull(),
  addedAt: text('added_at').notNull(),
});
