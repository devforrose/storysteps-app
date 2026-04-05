'use client';

import { use } from 'react';
import Link from 'next/link';
import { podcastSeries } from '@/data/podcasts';

export default function PodcastSeriesPage({ params }: { params: Promise<{ seriesId: string }> }) {
  const { seriesId } = use(params);
  const series = podcastSeries.find((s) => s.id === seriesId);

  if (!series) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Podcast series not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <div className="relative w-full h-56 md:h-72 overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="text-[12rem]">🎙️</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 pb-6">
          <Link
            href="/reader"
            className="inline-flex items-center text-sm text-white/80 hover:text-white mb-3"
          >
            &larr; Back to Library
          </Link>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-1">{series.name}</h1>
          <p className="text-white/80">{series.source}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Description */}
        <p className="text-lg text-gray-700 mb-8">{series.description}</p>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="inline-block px-3 py-1.5 bg-purple-100 rounded-full text-sm text-purple-700 font-medium">
            Podcast
          </span>
          <span className="inline-block px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
            {series.episodes.length} episodes
          </span>
        </div>

        {/* Episode list */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Episodes</h2>
        <div className="space-y-3">
          {series.episodes.map((episode) => {
            const hasContent = !!episode.transcript;
            return (
              <div key={episode.id}>
                {hasContent ? (
                  <Link
                    href={`/reader/podcast/${series.id}/${episode.id}`}
                    className="block"
                  >
                    <div className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md hover:border-teal-300 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {episode.number}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{episode.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{episode.description}</p>
                          {episode.level && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                              {episode.level}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-teal-600 text-sm font-medium flex-shrink-0 ml-4">
                        Read &rarr;
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-lg p-5 opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {episode.number}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{episode.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{episode.description}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">
                          Transcript coming soon
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
