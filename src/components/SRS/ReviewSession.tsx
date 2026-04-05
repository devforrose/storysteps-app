import { useState, useMemo } from 'react';
import { useSRS } from '@/context/SRSContext';
import { ReviewCard } from './ReviewCard';
import { Link } from 'react-router-dom';

export function ReviewSession() {
  const { getDueCards, reviewCard, stats } = useSRS();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  const dueCards = useMemo(() => getDueCards(), [getDueCards]);

  const handleReview = (cardId: string, quality: number) => {
    reviewCard(cardId, quality);
    setReviewedCount(prev => prev + 1);
    if (quality >= 3) {
      setSuccessCount(prev => prev + 1);
    }

    if (currentIndex + 1 >= dueCards.length) {
      setSessionComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // No cards due
  if (dueCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="text-6xl mb-6">✓</div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">All caught up!</h2>
        <p className="text-lg text-slate-600 mb-8 text-center max-w-md">
          You have no cards to review right now. Go read some content to discover new words and grow your vocabulary.
        </p>
        <Link
          to="/reader"
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
        >
          Browse Content
        </Link>
      </div>
    );
  }

  // Session complete
  if (sessionComplete) {
    const accuracy = reviewedCount > 0 ? Math.round((successCount / reviewedCount) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Great job!</h2>
        <p className="text-lg text-slate-600 mb-8">You&apos;ve completed your daily review.</p>

        <div className="bg-slate-50 rounded-lg p-6 mb-8 w-full max-w-sm">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Cards reviewed:</span>
              <span className="font-semibold text-slate-900">{reviewedCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Accuracy:</span>
              <span className="font-semibold text-slate-900">{accuracy}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Cards total:</span>
              <span className="font-semibold text-slate-900">{stats.totalCards}</span>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Review in progress
  const currentCard = dueCards[currentIndex];
  const progress = ((currentIndex + 1) / dueCards.length) * 100;

  return (
    <div className="flex flex-col h-full">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1">
        <div
          className="bg-teal-600 h-1 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Text */}
      <div className="text-center py-4 text-slate-600 text-sm font-medium">
        Card {currentIndex + 1} of {dueCards.length}
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {currentCard && (
          <ReviewCard
            card={currentCard}
            onReview={handleReview}
          />
        )}
      </div>
    </div>
  );
}
