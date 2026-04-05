
import { useState, useRef, useEffect, useCallback } from 'react';
import { getWordByText } from '@/data/vocabularyDatabase';
import { useVocabulary } from '@/context/VocabularyContext';
import { useSRS } from '@/context/SRSContext';

interface DictionaryResult {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  partOfSpeech?: string;
  definition?: string;
  example?: string;
}

// Simple in-memory cache to avoid re-fetching
const apiCache = new Map<string, DictionaryResult | null>();

async function fetchDictionary(word: string): Promise<DictionaryResult | null> {
  const key = word.toLowerCase();
  if (apiCache.has(key)) return apiCache.get(key) ?? null;

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`);
    if (!res.ok) {
      apiCache.set(key, null);
      return null;
    }
    const data = await res.json();
    const entry = data[0];

    // Find audio URL
    const audioUrl = entry.phonetics
      ?.map((p: { audio?: string }) => p.audio)
      .find((a: string | undefined) => a && a.length > 0) ?? undefined;

    // Find first meaning with a definition
    const meaning = entry.meanings?.[0];
    const def = meaning?.definitions?.[0];

    const result: DictionaryResult = {
      word: entry.word,
      phonetic: entry.phonetic ?? entry.phonetics?.[0]?.text,
      audioUrl,
      partOfSpeech: meaning?.partOfSpeech,
      definition: def?.definition,
      example: def?.example,
    };
    apiCache.set(key, result);
    return result;
  } catch {
    apiCache.set(key, null);
    return null;
  }
}

interface InteractiveWordProps {
  word: string;
  sentence?: string;
  highlighted?: boolean;
}

export default function InteractiveWord({ word, sentence, highlighted }: InteractiveWordProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [apiData, setApiData] = useState<DictionaryResult | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const wordRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const { trackWord, getWordStatus } = useVocabulary();
  const { addCard, getCardForWord } = useSRS();

  // Strip punctuation for lookup, keep original for display
  const cleanWord = word.replace(/[^a-zA-ZÀ-ÿ'-]/g, '');

  // Look up word definition in local database
  const wordData = getWordByText(cleanWord);
  const wordId = wordData?.id ?? cleanWord.toLowerCase();
  const wordStatus = getWordStatus(wordId);

  // Fetch from API when popup opens and word isn't in local database
  const fetchApiData = useCallback(async () => {
    if (wordData || cleanWord.length < 2) return;
    setApiLoading(true);
    const result = await fetchDictionary(cleanWord);
    setApiData(result);
    setApiLoading(false);
  }, [wordData, cleanWord]);

  useEffect(() => {
    if (showPopup && !wordData) {
      fetchApiData();
    }
  }, [showPopup, wordData, fetchApiData]);

  // Calculate popup position, flipping above word if not enough space below
  const handleClick = () => {
    setShowPopup(true);

    if (wordRef.current) {
      const rect = wordRef.current.getBoundingClientRect();
      const popupHeight = 350; // estimated max height
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top: number;
      if (spaceBelow >= popupHeight + 8) {
        top = rect.bottom + 8;
      } else if (spaceAbove >= popupHeight + 8) {
        top = rect.top - popupHeight - 8;
      } else {
        // Not enough space either way — pin to top with margin
        top = 8;
      }

      setPopupPosition({
        top,
        left: Math.max(8, Math.min(rect.left - 100, window.innerWidth - 340)),
      });
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        wordRef.current &&
        !wordRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    }

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPopup]);

  // Handle word status tracking
  const handleMarkAsKnown = () => {
    trackWord(wordId, 'known');
    setShowPopup(false);
  };

  const handleMarkAsLearning = () => {
    if (!displayData?.definition && apiLoading) return;
    const definition = displayData?.definition ?? cleanWord;
    const example = displayData?.example ?? '';
    const parts = [definition];
    if (example) parts.push(`Example: ${example}`);
    if (sentence) parts.push(`Context: "${sentence}"`);
    const back = parts.join('\n\n');
    trackWord(wordId, 'learning');
    if (!getCardForWord(wordId)) {
      addCard(wordId, cleanWord, back);
    }
    setShowPopup(false);
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  // Determine styling based on word status
  const getWordStyles = (): string => {
    switch (wordStatus) {
      case 'known':
        return 'cursor-pointer border-b-2 border-green-400 hover:bg-green-50 transition-colors';
      case 'learning':
        return 'cursor-pointer border-b-2 border-yellow-400 hover:bg-yellow-50 transition-colors';
      default:
        if (wordData) {
          return 'cursor-pointer border-b border-dashed border-blue-400 hover:bg-blue-50 transition-colors';
        }
        return 'cursor-pointer hover:bg-gray-100 transition-colors';
    }
  };

  // Get display data — prefer local database, fall back to API
  const displayData = wordData
    ? {
        text: wordData.text,
        phonetic: wordData.phonetic,
        partOfSpeech: wordData.partOfSpeech,
        definition: wordData.definition,
        example: wordData.exampleSentence,
        audioUrl: undefined as string | undefined,
        source: 'local' as const,
      }
    : apiData
      ? {
          text: apiData.word,
          phonetic: apiData.phonetic,
          partOfSpeech: apiData.partOfSpeech,
          definition: apiData.definition,
          example: apiData.example,
          audioUrl: apiData.audioUrl,
          source: 'api' as const,
        }
      : null;

  // Auto-scroll highlighted word into view if offscreen
  useEffect(() => {
    if (highlighted && wordRef.current) {
      const rect = wordRef.current.getBoundingClientRect();
      const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!inView) {
        wordRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlighted]);

  return (
    <>
      <span
        ref={wordRef}
        onClick={handleClick}
        className={`inline-block px-1 py-0.5 rounded transition-colors ${getWordStyles()}${highlighted ? ' bg-teal-200 ring-2 ring-teal-400' : ''}`}
      >
        {word}
      </span>

      {/* Popup */}
      {showPopup && (
        <div
          ref={popupRef}
          className="fixed z-50 pointer-events-auto"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 min-w-80 max-w-sm p-5 max-h-[calc(100vh-16px)] overflow-y-auto">
            {apiLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 border-t-transparent" />
                <span className="ml-3 text-sm text-slate-500">Looking up word...</span>
              </div>
            ) : displayData ? (
              <>
                {/* Word Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900">{displayData.text}</h3>
                    {displayData.audioUrl && (
                      <button
                        onClick={(e) => { e.stopPropagation(); playAudio(displayData.audioUrl!); }}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors text-teal-600"
                        title="Play pronunciation"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {displayData.phonetic && (
                    <p className="text-sm text-gray-600 italic">{displayData.phonetic}</p>
                  )}
                  {displayData.partOfSpeech && (
                    <p className="text-xs text-teal-700 font-semibold mt-1">
                      {displayData.partOfSpeech.charAt(0).toUpperCase() + displayData.partOfSpeech.slice(1)}
                    </p>
                  )}
                </div>

                {/* Definition */}
                {displayData.definition && (
                  <div className="mb-4">
                    <p className="text-gray-800 font-medium">{displayData.definition}</p>
                  </div>
                )}

                {/* Example Sentence */}
                {displayData.example && (
                  <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-600">Example:</span>{' '}
                      {displayData.example}
                    </p>
                  </div>
                )}

                {/* Context from story */}
                {sentence && (
                  <div className="mb-5 p-3 bg-teal-50 rounded border border-teal-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-teal-700">Context:</span>{' '}
                      &quot;{sentence}&quot;
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAsKnown}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded font-semibold text-sm hover:bg-green-700 transition-colors"
                  >
                    I know this
                  </button>
                  <button
                    onClick={handleMarkAsLearning}
                    className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded font-semibold text-sm hover:bg-yellow-600 transition-colors"
                  >
                    Learning
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* No definition found anywhere */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">{cleanWord}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  No definition found for this word.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAsKnown}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded font-semibold text-sm hover:bg-green-700 transition-colors"
                  >
                    I know this
                  </button>
                  <button
                    onClick={handleMarkAsLearning}
                    className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded font-semibold text-sm hover:bg-yellow-600 transition-colors"
                  >
                    Learning
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="flex-1 px-3 py-2 bg-gray-300 text-gray-800 rounded font-semibold text-sm hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
