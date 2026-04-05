import { Link } from 'react-router-dom';

export default function TutorPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-2xl">
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          AI Tutor - Coming Soon
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          We&apos;re working on bringing you an interactive speaking practice feature powered by AI.
          Soon you&apos;ll be able to have conversations with your personal tutor and get real-time
          feedback on your pronunciation and grammar.
        </p>

        <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">What to expect:</h2>
          <ul className="text-left text-slate-700 space-y-2">
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>Real-time conversation practice</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>Pronunciation feedback</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>Grammar corrections</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>Personalized lessons</span>
            </li>
          </ul>
        </div>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
