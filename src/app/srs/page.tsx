'use client';

import { useState } from 'react';
import { ReviewSession } from '@/components/SRS/ReviewSession';
import { WordList } from '@/components/SRS/WordList';

export default function SRSPage() {
  const [tab, setTab] = useState<'review' | 'words'>('review');

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 border-b border-teal-200 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900">Daily Review</h1>
        <p className="text-slate-600 mt-2">
          Practice your vocabulary with spaced repetition learning
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setTab('review')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'review'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-teal-200'
            }`}
          >
            Review Cards
          </button>
          <button
            onClick={() => setTab('words')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'words'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-teal-200'
            }`}
          >
            My Words
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {tab === 'review' ? <ReviewSession /> : <WordList />}
      </div>
    </div>
  );
}
