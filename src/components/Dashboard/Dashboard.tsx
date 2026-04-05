import { Link } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useVocabulary } from '@/context/VocabularyContext';
import { useSRS } from '@/context/SRSContext';
import { CEFRBadge } from '../Common/CEFRBadge';

export function Dashboard() {
  const { user } = useUser();
  const { getStats } = useVocabulary();
  const { stats: srsStats } = useSRS();

  const vocabStats = getStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Banner */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl p-8 border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-lg text-slate-600">
                Keep up your learning streak and expand your vocabulary today.
              </p>
            </div>
            <div className="hidden sm:block">
              <CEFRBadge level={user.currentLevel} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillar Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">What would you like to do?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Read Card */}
          <Link to="/reader">
            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer h-full">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Read</h3>
              <p className="text-slate-600 text-sm mb-4">
                Explore stories adapted to your level and discover new vocabulary.
              </p>
              <div className="text-xs font-medium text-teal-600">
                Explore content →
              </div>
            </div>
          </Link>

          {/* Review Card */}
          <Link to="/srs">
            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer h-full">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Review</h3>
              <p className="text-slate-600 text-sm mb-4">
                Practice your vocabulary with spaced repetition to lock in your knowledge.
              </p>
              <div className="text-xs font-medium text-teal-600">
                {srsStats.dueToday} cards due today
              </div>
            </div>
          </Link>

          {/* Speak Card */}
          <Link to="/tutor">
            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer h-full opacity-75">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Speak</h3>
              <p className="text-slate-600 text-sm mb-4">
                Practice speaking with an AI tutor and improve your fluency.
              </p>
              <div className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full">
                Coming soon
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Your Progress Section */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Progress</h2>

        {/* Vocabulary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Total Words */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Total Tracked</h3>
              <div className="text-2xl">📝</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {vocabStats.total}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Words in your vocabulary
            </p>
          </div>

          {/* Learning Words */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Learning</h3>
              <div className="text-2xl">📚</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {vocabStats.learning}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Words you&apos;re actively practicing
            </p>
          </div>

          {/* Known Words */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600">Known</h3>
              <div className="text-2xl">✓</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {vocabStats.known}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Words you&apos;ve mastered
            </p>
          </div>
        </div>

        {/* SRS Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Total Cards */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-4">SRS Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total cards</span>
                <span className="text-2xl font-bold text-slate-900">{srsStats.totalCards}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Due today</span>
                <span className="text-2xl font-bold text-teal-600">{srsStats.dueToday}</span>
              </div>
            </div>
          </div>

          {/* Average Ease */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-600 mb-4">Learning Efficiency</h3>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Average ease factor</span>
              <span className="text-2xl font-bold text-slate-900">{srsStats.averageEase}</span>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Higher is better. Target: 2.5+
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
