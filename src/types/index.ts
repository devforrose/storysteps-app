export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type WordStatus = 'learning' | 'known';

export interface User {
  id: string;
  name: string;
  nativeLanguage: string;
  targetLanguage: string;
  currentLevel: CEFRLevel;
  createdAt: string;
  lastActiveAt: string;
}

export interface Word {
  id: string;
  text: string;
  lemma: string; // base form
  definition: string;
  partOfSpeech: string;
  exampleSentence: string;
  cefrLevel: CEFRLevel;
  phonetic?: string;
}

export interface UserVocabulary {
  wordId: string;
  status: WordStatus;
  encounterCount: number;
  srsCardId?: string;
  addedAt: string;
  lastReviewedAt?: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: 'story' | 'article' | 'dialogue';
  cefrLevel: CEFRLevel;
  body: string; // The actual text content
  topics: string[];
  estimatedReadTime: number;
  wordCount: number;
}

export interface SRSCard {
  id: string;
  wordId: string;
  front: string; // the word
  back: string; // definition + example
  interval: number; // days until next review
  easeFactor: number; // SM-2 ease factor, starts at 2.5
  repetitions: number;
  nextReviewDate: string; // ISO date string
  lastReviewedAt?: string;
}

export interface BookChapter {
  number: number;
  title: string;
  body: string;
  wordCount: number;
  audioUrl?: string;
  audioDuration?: number; // seconds
  imageUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cefrLevel: CEFRLevel;
  chapters: BookChapter[];
  topics: string[];
  totalWordCount: number;
  coverImageUrl?: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface UserStats {
  totalWordsTracked: number;
  wordsLearning: number;
  wordsKnown: number;
  srsDueToday: number;
  contentRead: number;
  streakDays: number;
}
