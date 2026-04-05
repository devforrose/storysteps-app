
import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { SRSCard } from '@/types';
import { calculateNextReview, isCardDueToday } from '@/utils/sm2';

interface SRSContextType {
  cards: SRSCard[];
  addCard: (wordId: string, front: string, back: string) => void;
  removeCard: (wordId: string) => void;
  reviewCard: (cardId: string, quality: number) => void;
  getDueCards: () => SRSCard[];
  getCardForWord: (wordId: string) => SRSCard | undefined;
  stats: {
    totalCards: number;
    dueToday: number;
    averageEase: number;
  };
}

const SRSContext = createContext<SRSContextType | undefined>(undefined);

export function SRSProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<SRSCard[]>([]);

  // Load from database on mount
  useEffect(() => {
    fetch('/api/srs')
      .then(res => res.json())
      .then((data: SRSCard[]) => setCards(data))
      .catch(console.error);
  }, []);

  const addCard = useCallback((wordId: string, front: string, back: string) => {
    fetch('/api/srs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', wordId, front, back }),
    })
      .then(res => res.json())
      .then((card) => {
        const mapped: SRSCard = {
          id: card.id,
          wordId: card.wordId,
          front: card.front,
          back: card.back,
          interval: card.interval,
          easeFactor: card.easeFactor,
          repetitions: card.repetitions,
          nextReviewDate: new Date(card.nextReviewDate).toISOString(),
          lastReviewedAt: undefined,
        };
        setCards(prev => [...prev, mapped]);
      })
      .catch(console.error);
  }, []);

  const removeCard = useCallback((wordId: string) => {
    setCards(prev => prev.filter(card => card.wordId !== wordId));

    fetch('/api/srs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wordId }),
    }).catch(console.error);
  }, []);

  const reviewCard = useCallback((cardId: string, quality: number) => {
    setCards(prev =>
      prev.map(card => {
        if (card.id === cardId) {
          const result = calculateNextReview(card, quality);
          const updated = {
            ...card,
            interval: result.interval,
            easeFactor: result.easeFactor,
            repetitions: result.repetitions,
            nextReviewDate: result.nextReviewDate,
            lastReviewedAt: new Date().toISOString(),
          };

          // Persist to database
          fetch('/api/srs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'review',
              id: cardId,
              interval: result.interval,
              easeFactor: result.easeFactor,
              repetitions: result.repetitions,
              nextReviewDate: result.nextReviewDate,
            }),
          }).catch(console.error);

          return updated;
        }
        return card;
      })
    );
  }, []);

  const getDueCards = useCallback(() => {
    return cards.filter(card => isCardDueToday(card));
  }, [cards]);

  const getCardForWord = useCallback((wordId: string) => {
    return cards.find(card => card.wordId === wordId);
  }, [cards]);

  const stats = useMemo(() => {
    const dueCards = cards.filter(card => isCardDueToday(card));
    const averageEase = cards.length > 0
      ? Math.round((cards.reduce((sum, card) => sum + card.easeFactor, 0) / cards.length) * 100) / 100
      : 0;

    return {
      totalCards: cards.length,
      dueToday: dueCards.length,
      averageEase,
    };
  }, [cards]);

  return (
    <SRSContext.Provider value={{ cards, addCard, removeCard, reviewCard, getDueCards, getCardForWord, stats }}>
      {children}
    </SRSContext.Provider>
  );
}

export function useSRS() {
  const context = useContext(SRSContext);
  if (!context) throw new Error('useSRS must be used within SRSProvider');
  return context;
}
