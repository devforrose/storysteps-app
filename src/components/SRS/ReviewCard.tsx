
import { useState } from 'react';
import { SRSCard } from '@/types';

interface ReviewCardProps {
  card: SRSCard;
  onReview: (cardId: string, quality: number) => void;
}

export function ReviewCard({ card, onReview }: ReviewCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleReview = (quality: number) => {
    onReview(card.id, quality);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Flashcard */}
      <div
        className="relative w-full h-80 cursor-pointer perspective"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          perspective: '1000px',
        }}
      >
        <div
          className="relative w-full h-full transition-transform duration-300"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center border border-teal-200"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-sm font-medium text-teal-600 mb-2">WORD</div>
            <h2 className="text-5xl font-bold text-slate-900">{card.front}</h2>
            <div className="mt-8 text-center text-sm text-slate-500">
              Click to reveal the answer
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg p-8 flex flex-col items-center justify-between border border-slate-200"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div>
              <div className="text-sm font-medium text-slate-600 mb-2">DEFINITION & EXAMPLE</div>
              <p className="text-slate-800 text-center text-lg leading-relaxed whitespace-pre-line">
                {card.back}
              </p>
            </div>
            <div className="text-xs text-slate-400 mt-4">
              Interval: {card.interval} days | Ease: {card.easeFactor.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Rating Buttons */}
      {isFlipped && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button
            onClick={() => handleReview(1)}
            className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors"
          >
            Again
          </button>
          <button
            onClick={() => handleReview(3)}
            className="px-4 py-3 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium rounded-lg transition-colors"
          >
            Hard
          </button>
          <button
            onClick={() => handleReview(4)}
            className="px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 font-medium rounded-lg transition-colors"
          >
            Good
          </button>
          <button
            onClick={() => handleReview(5)}
            className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-colors"
          >
            Easy
          </button>
        </div>
      )}
    </div>
  );
}
