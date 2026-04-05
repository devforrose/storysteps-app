import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useMemo, useState, useCallback } from 'react';
import { books } from '@/data/books';
import { getLevelColor, getLevelLabel } from '@/utils/cefrHelper';
import { useVocabulary } from '@/context/VocabularyContext';
import InteractiveWord from '@/components/Reader/InteractiveWord';
import AudioPlayer from '@/components/Reader/AudioPlayer';

export default function BookChapterPage() {
  const { bookId, chapter: chapterNum } = useParams<{ bookId: string; chapter: string }>();
  const { getStats, getWordStatus } = useVocabulary();
  const stats = getStats();

  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);

  const handleWordIndexChange = useCallback((index: number | null) => {
    setHighlightedWordIndex(index);
  }, []);

  const book = books.find((b) => b.id === bookId);
  const chapterIndex = parseInt(chapterNum!, 10) - 1;
  const chapter = book?.chapters[chapterIndex];

  const paragraphs = useMemo(() => {
    if (!chapter) return [];
    return chapter.body.split(/\n\n+/).filter((p) => p.trim().length > 0).map((paragraph) => {
      const sentences = paragraph.split(/(?<=[.!?])\s+/);
      const words: { word: string; sentence: string }[] = [];
      for (const sentence of sentences) {
        const ws = sentence.split(/\s+/).filter((w) => w.length > 0);
        for (const word of ws) {
          words.push({ word, sentence: sentence.trim() });
        }
      }
      return words;
    });
  }, [chapter]);

  // Calculate coverage based on actual words in this chapter
  const chapterCoverage = useMemo(() => {
    if (!chapter) return { known: 0, learning: 0, total: 0, percent: 0 };
    const allWords = paragraphs.flat();
    const uniqueWords = new Set(allWords.map((w) => w.word.replace(/[^a-zA-ZÀ-ÿ'-]/g, '').toLowerCase()));
    let known = 0;
    let learning = 0;
    uniqueWords.forEach((word) => {
      if (!word) return;
      const status = getWordStatus(word);
      if (status === 'known') known++;
      else if (status === 'learning') learning++;
    });
    const total = uniqueWords.size;
    const percent = total > 0 ? Math.min(100, Math.round(((known + learning) / total) * 100)) : 0;
    return { known, learning, total, percent };
  }, [chapter, paragraphs, getWordStatus]);

  if (!book || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Chapter not found.</p>
      </div>
    );
  }

  const levelColor = getLevelColor(book.cefrLevel);
  const levelLabel = getLevelLabel(book.cefrLevel);
  const prevChapter = chapterIndex > 0 ? chapterIndex : null;
  const nextChapter = chapterIndex + 1 < book.chapters.length ? chapterIndex + 2 : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Chapter illustration */}
      {chapter.imageUrl && (
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
          <img
            src={chapter.imageUrl}
            alt={chapter.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 pb-6">
            <Link
              to={`/reader/book/${book.id}`}
              className="inline-flex items-center text-sm text-white/80 hover:text-white mb-3"
            >
              &larr; {book.title}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{chapter.title}</h1>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation & Header (fallback when no image) */}
        {!chapter.imageUrl && (
          <>
            <div className="flex items-center gap-4 mb-8">
              <Link
                to={`/reader/book/${book.id}`}
                className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700"
              >
                &larr; {book.title}
              </Link>
            </div>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{chapter.title}</h1>
            </div>
          </>
        )}

        {/* Meta info */}
        <div className="mb-10">
          {chapter.imageUrl && <div className="mb-4" />}
          <div className="flex flex-wrap items-center gap-4">
            <div
              className="px-3 py-1 rounded-full text-white text-sm font-bold"
              style={{ backgroundColor: levelColor }}
            >
              {book.cefrLevel} - {levelLabel}
            </div>
            <span className="text-gray-600 text-sm">
              Chapter {chapter.number} of {book.chapters.length}
            </span>
            <span className="text-gray-600 text-sm">
              {chapter.wordCount} words &middot; ~{Math.ceil(chapter.wordCount / 200)} min
            </span>
          </div>
        </div>

        {/* Reading Stats */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-10 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Unique Words</p>
              <p className="text-2xl font-bold text-gray-900">{chapterCoverage.total}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Known</p>
              <p className="text-2xl font-bold text-green-600">{chapterCoverage.known}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Learning</p>
              <p className="text-2xl font-bold text-yellow-600">{chapterCoverage.learning}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Unmarked</p>
              <p className="text-2xl font-bold text-blue-600">{chapterCoverage.total - chapterCoverage.known - chapterCoverage.learning}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Coverage</p>
              <p className="text-2xl font-bold text-teal-600">
                {chapterCoverage.percent}%
              </p>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        {chapter.audioUrl && (
          <AudioPlayer
            audioUrl={chapter.audioUrl}
            totalWords={chapter.wordCount}
            onWordIndexChange={handleWordIndexChange}
          />
        )}

        {/* Reading Area */}
        <div className="bg-white rounded-lg shadow-lg p-10 mb-12 border border-gray-200">
          <div className="text-lg leading-relaxed text-gray-800 space-y-4">
            {(() => {
              let globalIndex = 0;
              return paragraphs.map((words, pIndex) => (
                <div key={pIndex} className="text-justify hyphens-auto">
                  {words.map((item, wIndex) => {
                    const currentGlobalIndex = globalIndex++;
                    return (
                      <span key={`${pIndex}-${item.word}-${wIndex}`}>
                        <InteractiveWord
                          word={item.word}
                          sentence={item.sentence}
                          highlighted={highlightedWordIndex === currentGlobalIndex}
                        />
                        {wIndex < words.length - 1 && ' '}
                      </span>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Chapter Navigation */}
        <div className="flex items-center justify-between">
          {prevChapter ? (
            <Link
              to={`/reader/book/${book.id}/${prevChapter}`}
              className="px-5 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-teal-300 transition-all font-medium text-sm"
            >
              &larr; {book.chapters[prevChapter - 1].title}
            </Link>
          ) : (
            <div />
          )}
          {nextChapter ? (
            <Link
              to={`/reader/book/${book.id}/${nextChapter}`}
              className="px-5 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium text-sm"
            >
              {book.chapters[nextChapter - 1].title} &rarr;
            </Link>
          ) : (
            <Link
              to={`/reader/book/${book.id}`}
              className="px-5 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium text-sm"
            >
              Back to chapters
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-sm text-blue-900 mb-2">
            Click on any word to see its definition and track your progress
          </p>
          <p className="text-xs text-blue-700">
            Words are underlined: <span className="border-b-2 border-green-400 font-semibold">green</span> =
            known, <span className="border-b-2 border-yellow-400 font-semibold">yellow</span> = learning,{' '}
            <span className="border-b border-dashed border-blue-400 font-semibold">blue dashed</span> = in database
          </p>
        </div>
      </div>
    </div>
  );
}
