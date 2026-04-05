import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { books } from '@/data/books';
import { getLevelColor, getLevelLabel } from '@/utils/cefrHelper';

export default function BookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Book not found.</p>
      </div>
    );
  }

  const levelColor = getLevelColor(book.cefrLevel);
  const levelLabel = getLevelLabel(book.cefrLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Cover hero */}
      {book.coverImageUrl && (
        <div className="relative w-full h-56 md:h-72 overflow-hidden">
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 pb-6">
            <Link
              to="/reader"
              className="inline-flex items-center text-sm text-white/80 hover:text-white mb-3"
            >
              &larr; Back to Library
            </Link>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-1">{book.title}</h1>
            <p className="text-lg text-white/80">{book.author}</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Fallback header when no cover */}
        {!book.coverImageUrl && (
          <>
            <Link
              to="/reader"
              className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 mb-8"
            >
              &larr; Back to Library
            </Link>
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-lg text-gray-500 mb-4">{book.author}</p>
            </div>
          </>
        )}

        {/* Book meta */}
        <div className="mb-10">

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div
              className="px-4 py-2 rounded-full text-white font-bold"
              style={{ backgroundColor: levelColor }}
            >
              {book.cefrLevel} - {levelLabel}
            </div>
            <span className="text-gray-700">
              {book.chapters.length} chapters
            </span>
            <span className="text-gray-700">
              {book.totalWordCount} words total
            </span>
          </div>

          <p className="text-lg text-gray-700 mb-6">{book.description}</p>

          {book.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {book.topics.map((topic) => (
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

        {/* Chapter list */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Chapters</h2>
        <div className="space-y-3">
          {book.chapters.map((chapter) => (
            <Link
              key={chapter.number}
              to={`/reader/book/${book.id}/${chapter.number}`}
              className="block"
            >
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md hover:border-teal-300 transition-all flex">
                {chapter.imageUrl && (
                  <div className="w-32 md:w-48 flex-shrink-0">
                    <img
                      src={chapter.imageUrl}
                      alt={chapter.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span>{chapter.wordCount} words &middot; ~{Math.ceil(chapter.wordCount / 200)} min read</span>
                      {chapter.audioUrl && (
                        <span className="inline-flex items-center gap-1 text-teal-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.7.48A6.985 6.985 0 002 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h1.535l4.033 3.796A.75.75 0 0010 16.25V3.75zM15.95 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06 7 7 0 000-9.899z" />
                            <path d="M13.829 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06 4 4 0 000-5.656z" />
                          </svg>
                          <span className="text-xs font-medium">Audio</span>
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-teal-600 text-sm font-medium">
                    Read &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
