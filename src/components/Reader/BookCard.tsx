import { Link } from 'react-router-dom';
import { Book } from '@/types';
import { getLevelColor } from '@/utils/cefrHelper';

interface BookCardProps {
  book: Book;
  isRecommended?: boolean;
}

export default function BookCard({ book, isRecommended = false }: BookCardProps) {
  const levelColor = getLevelColor(book.cefrLevel);

  return (
    <Link to={`/reader/book/${book.id}`}>
      <div
        className={`h-full flex flex-col rounded-lg border-2 transition-all duration-200 hover:shadow-lg hover:border-opacity-60 cursor-pointer overflow-hidden ${
          isRecommended ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'
        }`}
      >
        {/* Cover Image */}
        {book.coverImageUrl && (
          <div className="w-full h-40 overflow-hidden">
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
            {book.title}
          </h3>
          <div
            className="px-3 py-1 rounded-full text-white text-xs font-bold whitespace-nowrap flex-shrink-0"
            style={{ backgroundColor: levelColor }}
          >
            {book.cefrLevel}
          </div>
        </div>

        {/* Author */}
        <p className="text-sm text-gray-500 mb-2">{book.author}</p>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {book.description}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-block px-2 py-1 bg-purple-100 rounded text-xs text-purple-700 font-medium">
            Book
          </span>
          <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
            {book.chapters.length} chapters
          </span>
          <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
            {book.totalWordCount} words
          </span>
        </div>

        {/* Topics */}
        {book.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.topics.map((topic) => (
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
      </div>
    </Link>
  );
}
