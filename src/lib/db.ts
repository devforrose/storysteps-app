import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'storysteps.db');

// Ensure data directory exists
import { mkdirSync } from 'fs';
mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS vocabulary (
    wordId TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    encounterCount INTEGER DEFAULT 1,
    addedAt TEXT NOT NULL,
    lastReviewedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS srs_cards (
    id TEXT PRIMARY KEY,
    wordId TEXT NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    interval INTEGER DEFAULT 0,
    easeFactor REAL DEFAULT 2.5,
    repetitions INTEGER DEFAULT 0,
    nextReviewDate TEXT NOT NULL,
    lastReviewedAt TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transcript_cache (
    videoId TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    data TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS saved_videos (
    videoId TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    addedAt TEXT NOT NULL
  );
`);

export default db;
