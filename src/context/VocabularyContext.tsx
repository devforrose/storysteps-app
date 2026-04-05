
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { UserVocabulary, WordStatus } from '@/types';

interface VocabularyContextType {
  vocabulary: Map<string, UserVocabulary>;
  trackWord: (wordId: string, status: WordStatus) => void;
  removeWord: (wordId: string) => void;
  getWordStatus: (wordId: string) => WordStatus | undefined;
  getStats: () => { learning: number; known: number; total: number };
  getAllTrackedWords: () => UserVocabulary[];
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const [vocabulary, setVocabulary] = useState<Map<string, UserVocabulary>>(new Map());

  // Load from database on mount
  useEffect(() => {
    fetch('/api/vocabulary')
      .then(res => res.json())
      .then((words: Array<{ wordId: string; status: string; encounterCount: number; addedAt: string; lastReviewedAt: string | null }>) => {
        const map = new Map<string, UserVocabulary>();
        for (const w of words) {
          map.set(w.wordId, {
            wordId: w.wordId,
            status: w.status as WordStatus,
            encounterCount: w.encounterCount,
            addedAt: w.addedAt,
            lastReviewedAt: w.lastReviewedAt ?? undefined,
          });
        }
        setVocabulary(map);
      })
      .catch(console.error);
  }, []);

  const trackWord = useCallback((wordId: string, status: WordStatus) => {
    setVocabulary(prev => {
      const next = new Map(prev);
      const existing = next.get(wordId);
      if (existing) {
        next.set(wordId, {
          ...existing,
          status,
          encounterCount: existing.encounterCount + 1,
          lastReviewedAt: new Date().toISOString(),
        });
      } else {
        next.set(wordId, {
          wordId,
          status,
          encounterCount: 1,
          addedAt: new Date().toISOString(),
        });
      }
      return next;
    });

    // Persist to database
    fetch('/api/vocabulary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordId, status }),
    }).catch(console.error);
  }, []);

  const removeWord = useCallback((wordId: string) => {
    setVocabulary(prev => {
      const next = new Map(prev);
      next.delete(wordId);
      return next;
    });

    fetch('/api/vocabulary', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordId }),
    }).catch(console.error);
  }, []);

  const getWordStatus = useCallback((wordId: string): WordStatus | undefined => {
    return vocabulary.get(wordId)?.status;
  }, [vocabulary]);

  const getStats = useCallback(() => {
    let learning = 0, known = 0;
    vocabulary.forEach(v => {
      if (v.status === 'learning') learning++;
      else if (v.status === 'known') known++;
    });
    return { learning, known, total: vocabulary.size };
  }, [vocabulary]);

  const getAllTrackedWords = useCallback(() => {
    return Array.from(vocabulary.values());
  }, [vocabulary]);

  return (
    <VocabularyContext.Provider value={{ vocabulary, trackWord, removeWord, getWordStatus, getStats, getAllTrackedWords }}>
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary() {
  const context = useContext(VocabularyContext);
  if (!context) throw new Error('useVocabulary must be used within VocabularyProvider');
  return context;
}
