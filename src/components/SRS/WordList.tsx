
import { useVocabulary } from '@/context/VocabularyContext';
import { useSRS } from '@/context/SRSContext';
import { useCallback } from 'react';
import { getWordById } from '@/data/vocabularyDatabase';
import { useState } from 'react';
import { WordStatus } from '@/types';

type FilterStatus = 'all' | WordStatus;

export function WordList() {
  const { getAllTrackedWords, trackWord, removeWord } = useVocabulary();
  const { getCardForWord, removeCard } = useSRS();

  const handleDelete = useCallback((wordId: string) => {
    removeWord(wordId);
    removeCard(wordId);
  }, [removeWord, removeCard]);
  const [filter, setFilter] = useState<FilterStatus>('all');

  const words = getAllTrackedWords();
  const filtered = filter === 'all' ? words : words.filter(w => w.status === filter);

  const statusColor: Record<WordStatus, string> = {
    learning: 'bg-yellow-100 text-yellow-700',
    known: 'bg-green-100 text-green-700',
  };

  const statusCounts = {
    all: words.length,
    learning: words.filter(w => w.status === 'learning').length,
    known: words.filter(w => w.status === 'known').length,
  };

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="text-6xl mb-6">📝</div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">No words yet</h2>
        <p className="text-lg text-slate-600 mb-8 text-center max-w-md">
          Start reading content and clicking on words to build your vocabulary list.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'learning', 'known'] as FilterStatus[]).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-teal-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="capitalize">{status}</span>
            <span className="ml-1.5 text-xs opacity-75">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* Word list */}
      <div className="space-y-3">
        {filtered.map(entry => {
          const dbWord = getWordById(entry.wordId);
          const srsCard = getCardForWord(entry.wordId);
          const displayText = dbWord?.text ?? entry.wordId;

          return (
            <div
              key={entry.wordId}
              className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-semibold text-slate-900">{displayText}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[entry.status]}`}>
                    {entry.status}
                  </span>
                  {srsCard && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                      SRS
                    </span>
                  )}
                </div>
                {dbWord && (
                  <p className="text-sm text-slate-600 truncate">{dbWord.definition}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Seen {entry.encounterCount} time{entry.encounterCount !== 1 ? 's' : ''}
                  {srsCard && ` · Next review: ${new Date(srsCard.nextReviewDate).toLocaleDateString()}`}
                </p>
              </div>

              {/* Status toggle & delete */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => trackWord(entry.wordId, entry.status === 'learning' ? 'known' : 'learning')}
                  className="flex items-center gap-2 cursor-pointer"
                  title={entry.status === 'learning' ? 'Mark as known' : 'Mark as learning'}
                >
                  <span className="text-xs font-medium text-yellow-600 w-16 text-right">
                    {entry.status === 'learning' ? 'Learning' : ''}
                  </span>
                  <div className={`relative w-10 h-5 rounded-full transition-colors ${
                    entry.status === 'known' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      entry.status === 'known' ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </div>
                  <span className="text-xs font-medium text-green-600 w-12">
                    {entry.status === 'known' ? 'Known' : ''}
                  </span>
                </button>
                <button
                  onClick={() => handleDelete(entry.wordId)}
                  className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove word"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 py-12">No words with status &quot;{filter}&quot;</p>
      )}
    </div>
  );
}
