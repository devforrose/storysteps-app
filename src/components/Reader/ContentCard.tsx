import { Link } from 'react-router-dom';
import { Content } from '@/types';
import { getLevelColor } from '@/utils/cefrHelper';

interface ContentCardProps {
  content: Content;
  isRecommended?: boolean;
}

export default function ContentCard({ content, isRecommended = false }: ContentCardProps) {
  const levelColor = getLevelColor(content.cefrLevel);

  return (
    <Link to={`/reader/${content.id}`}>
      <div
        className={`h-full flex flex-col p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg hover:border-opacity-60 cursor-pointer ${
          isRecommended ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
        }`}
      >
        {/* Header with title and level badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
            {content.title}
          </h3>
          <div
            className="px-3 py-1 rounded-full text-white text-xs font-bold whitespace-nowrap flex-shrink-0"
            style={{ backgroundColor: levelColor }}
          >
            {content.cefrLevel}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {content.description}
        </p>

        {/* Content type and stats */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 font-medium capitalize">
            {content.type}
          </span>
          <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
            {content.wordCount} words
          </span>
          <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
            ~{content.estimatedReadTime} min
          </span>
        </div>

        {/* Topics */}
        {content.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {content.topics.map((topic) => (
              <span
                key={topic}
                className="text-xs text-teal-700 bg-teal-100 px-2 py-1 rounded"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Recommended badge */}
        {isRecommended && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-xs font-semibold text-green-700">Recommended for your level</p>
          </div>
        )}
      </div>
    </Link>
  );
}
