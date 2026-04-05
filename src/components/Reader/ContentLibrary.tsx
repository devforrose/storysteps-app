import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CEFRLevel } from '@/types';
import { sampleContent } from '@/data/sampleContent';
import { books } from '@/data/books';
import { videoChannels } from '@/data/videoChannels';
import { podcastSeries } from '@/data/podcasts';
import { useUser } from '@/context/UserContext';
import { getLevelColor } from '@/utils/cefrHelper';
import ContentCard from './ContentCard';
import BookCard from './BookCard';

type FilterLevel = 'All' | CEFRLevel;

const LEVELS: FilterLevel[] = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function ContentLibrary() {
  const { user } = useUser();
  const [selectedLevel, setSelectedLevel] = useState<FilterLevel>('All');

  const filteredContent =
    selectedLevel === 'All'
      ? sampleContent
      : sampleContent.filter((content) => content.cefrLevel === selectedLevel);

  const filteredBooks =
    selectedLevel === 'All'
      ? books
      : books.filter((book) => book.cefrLevel === selectedLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Reading Library</h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Explore our collection of comprehensible input (CI) stories and articles. Click on any
            to start reading and building your vocabulary naturally through context.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-semibold text-gray-700 self-center">Filter by level:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((level) => {
              const isActive = selectedLevel === level;
              const bgColor =
                level === 'All'
                  ? isActive
                    ? 'bg-gray-800'
                    : 'bg-gray-200'
                  : isActive
                    ? getLevelColor(level as CEFRLevel)
                    : 'bg-gray-200';

              const textColor = level === 'All' && !isActive ? 'text-gray-700' : 'text-white';

              return (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 ${bgColor} ${textColor} hover:shadow-md`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Level Info */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            Your current level: <span className="font-bold">{user.currentLevel}</span>. Content at
            your level and below is recommended for optimal learning.
          </p>
        </div>

        {/* YouTube Section */}
        {videoChannels.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">YouTube</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoChannels.map((channel) => (
                <Link key={channel.id} to={`/reader/video/channel/${channel.id}`}>
                  <div className="h-full flex flex-col rounded-lg border-2 border-gray-200 bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-teal-300 cursor-pointer">
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={channel.thumbnail}
                        alt={channel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{channel.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{channel.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block px-2 py-1 bg-red-100 rounded text-xs text-red-700 font-medium">
                          YouTube
                        </span>
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                          {channel.videos.length} video{channel.videos.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Podcasts Section */}
        {podcastSeries.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Podcasts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {podcastSeries.map((series) => (
                <Link key={series.id} to={`/reader/podcast/${series.id}`}>
                  <div className="h-full flex flex-col rounded-lg border-2 border-gray-200 bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-teal-300 cursor-pointer">
                    <div className="w-full h-40 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-6xl">🎙️</span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{series.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{series.source}</p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{series.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block px-2 py-1 bg-purple-100 rounded text-xs text-purple-700 font-medium">
                          Podcast
                        </span>
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                          {series.episodes.length} episodes
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Books Section */}
        {filteredBooks.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                const userLevelIndex = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(user.currentLevel);
                const bookLevelIndex = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(book.cefrLevel);
                return (
                  <BookCard
                    key={book.id}
                    book={book}
                    isRecommended={bookLevelIndex <= userLevelIndex}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Stories & Articles */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Stories &amp; Articles</h2>

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content) => {
              // Check if content is at or below user's level for recommendation
              const userLevelIndex = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(user.currentLevel);
              const contentLevelIndex = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(
                content.cefrLevel
              );
              const isRecommended = contentLevelIndex <= userLevelIndex;

              return (
                <ContentCard
                  key={content.id}
                  content={content}
                  isRecommended={isRecommended}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No content available for this level.</p>
          </div>
        )}
      </div>
    </div>
  );
}
