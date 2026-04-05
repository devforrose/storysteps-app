
import { useMemo } from 'react';
import { sampleContent } from '@/data/sampleContent';
import { getLevelColor, getLevelLabel } from '@/utils/cefrHelper';
import { useVocabulary } from '@/context/VocabularyContext';
import InteractiveWord from './InteractiveWord';

interface ReaderViewProps {
  contentId: string;
}

export default function ReaderView({ contentId }: ReaderViewProps) {
  const { getStats, getWordStatus } = useVocabulary();
  const stats = getStats();

  // Find the content
  const content = useMemo(
    () => sampleContent.find((c) => c.id === contentId),
    [contentId]
  );

  // Split text into paragraphs, then sentences, then words
  const paragraphs = useMemo(() => {
    if (!content) return [];
    return content.body.split(/\n\n+/).filter((p) => p.trim().length > 0).map((paragraph) => {
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
  }, [content]);

  const contentCoverage = useMemo(() => {
    if (!content) return { known: 0, learning: 0, total: 0, percent: 0 };
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
  }, [content, paragraphs, getWordStatus]);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Content not found.</p>
      </div>
    );
  }

  const levelColor = getLevelColor(content.cefrLevel);
  const levelLabel = getLevelLabel(content.cefrLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{content.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div
              className="px-4 py-2 rounded-full text-white font-bold"
              style={{ backgroundColor: levelColor }}
            >
              {content.cefrLevel} - {levelLabel}
            </div>
            <span className="text-gray-700 capitalize">
              Type: <span className="font-semibold">{content.type}</span>
            </span>
            <span className="text-gray-700">
              Reading time: <span className="font-semibold">~{content.estimatedReadTime} min</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-700 mb-6">{content.description}</p>

          {/* Topics */}
          {content.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {content.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-sm text-teal-700 bg-teal-100 px-3 py-1 rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Reading Session Stats Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-10 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Unique Words</p>
              <p className="text-2xl font-bold text-gray-900">{contentCoverage.total}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Known</p>
              <p className="text-2xl font-bold text-green-600">{contentCoverage.known}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Learning</p>
              <p className="text-2xl font-bold text-yellow-600">{contentCoverage.learning}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Unmarked</p>
              <p className="text-2xl font-bold text-blue-600">{contentCoverage.total - contentCoverage.known - contentCoverage.learning}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Coverage</p>
              <p className="text-2xl font-bold text-teal-600">
                {contentCoverage.percent}%
              </p>
            </div>
          </div>
        </div>

        {/* Main Reading Area */}
        <div className="bg-white rounded-lg shadow-lg p-10 mb-12 border border-gray-200">
          <div className="text-lg leading-relaxed text-gray-800 space-y-4">
            {paragraphs.map((words, pIndex) => (
              <div key={pIndex} className="text-justify hyphens-auto">
                {words.map((item, wIndex) => (
                  <span key={`${pIndex}-${item.word}-${wIndex}`}>
                    <InteractiveWord word={item.word} sentence={item.sentence} />
                    {wIndex < words.length - 1 && ' '}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
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
