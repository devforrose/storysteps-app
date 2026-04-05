'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { podcastSeries } from '@/data/podcasts';
import { useVocabulary } from '@/context/VocabularyContext';
import InteractiveWord from '@/components/Reader/InteractiveWord';

export default function PodcastEpisodePage({
  params,
}: {
  params: Promise<{ seriesId: string; episodeId: string }>;
}) {
  const { seriesId, episodeId } = use(params);
  const { getWordStatus } = useVocabulary();

  const series = podcastSeries.find((s) => s.id === seriesId);
  const episode = series?.episodes.find((e) => e.id === episodeId);

  const paragraphs = useMemo(() => {
    if (!episode?.transcript) return [];
    return episode.transcript.split(/\n\n+/).filter((p) => p.trim().length > 0).map((paragraph) => {
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
  }, [episode]);

  const coverage = useMemo(() => {
    const uniqueWords = new Set<string>();
    paragraphs.flat().forEach((w) => {
      const clean = w.word.replace(/[^a-zA-ZÀ-ÿ'-]/g, '').toLowerCase();
      if (clean) uniqueWords.add(clean);
    });
    let known = 0, learning = 0;
    uniqueWords.forEach((w) => {
      const status = getWordStatus(w);
      if (status === 'known') known++;
      else if (status === 'learning') learning++;
    });
    const total = uniqueWords.size;
    const percent = total > 0 ? Math.min(100, Math.round(((known + learning) / total) * 100)) : 0;
    return { known, learning, total, percent };
  }, [paragraphs, getWordStatus]);

  if (!series || !episode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Episode not found.</p>
      </div>
    );
  }

  if (!episode.transcript) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-5xl mb-4">🎙️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{episode.title}</h2>
        <p className="text-gray-600 mb-6">Transcript not yet available for this episode.</p>
        <Link href={`/reader/podcast/${series.id}`} className="text-teal-600 hover:text-teal-700 font-medium">
          &larr; Back to {series.name}
        </Link>
      </div>
    );
  }

  const episodeIndex = series.episodes.findIndex((e) => e.id === episodeId);
  const prevEpisode = episodeIndex > 0 ? series.episodes[episodeIndex - 1] : null;
  const nextEpisode = episodeIndex + 1 < series.episodes.length ? series.episodes[episodeIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation */}
        <Link
          href={`/reader/podcast/${series.id}`}
          className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 mb-8"
        >
          &larr; {series.name}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {episode.number}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{episode.title}</h1>
          </div>
          <p className="text-gray-600 mt-2">{episode.description}</p>
        </div>

        {/* Audio player if available */}
        {episode.audioUrl && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
            <audio controls className="w-full" src={episode.audioUrl} />
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Unique Words</p>
              <p className="text-2xl font-bold text-gray-900">{coverage.total}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Known</p>
              <p className="text-2xl font-bold text-green-600">{coverage.known}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Learning</p>
              <p className="text-2xl font-bold text-yellow-600">{coverage.learning}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Coverage</p>
              <p className="text-2xl font-bold text-teal-600">{coverage.percent}%</p>
            </div>
          </div>
        </div>

        {/* Transcript */}
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

        {/* Episode Navigation */}
        <div className="flex items-center justify-between">
          {prevEpisode ? (
            <Link
              href={`/reader/podcast/${series.id}/${prevEpisode.id}`}
              className="px-5 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-teal-300 transition-all font-medium text-sm"
            >
              &larr; Ep. {prevEpisode.number}: {prevEpisode.title}
            </Link>
          ) : (
            <div />
          )}
          {nextEpisode ? (
            <Link
              href={`/reader/podcast/${series.id}/${nextEpisode.id}`}
              className="px-5 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium text-sm"
            >
              Ep. {nextEpisode.number}: {nextEpisode.title} &rarr;
            </Link>
          ) : (
            <Link
              href={`/reader/podcast/${series.id}`}
              className="px-5 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium text-sm"
            >
              Back to episodes
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
