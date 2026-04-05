import { Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppProvider';
import { Navigation } from '@/components/Common/Navigation';

import HomePage from './pages/HomePage';
import ReaderPage from './pages/ReaderPage';
import StoryPage from './pages/StoryPage';
import BookPage from './pages/BookPage';
import BookChapterPage from './pages/BookChapterPage';
import VideoListPage from './pages/VideoListPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import VideoChannelPage from './pages/VideoChannelPage';
import PodcastSeriesPage from './pages/PodcastSeriesPage';
import PodcastEpisodePage from './pages/PodcastEpisodePage';
import SRSPage from './pages/SRSPage';
import TutorPage from './pages/TutorPage';

export default function App() {
  return (
    <AppProvider>
      <Navigation />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reader" element={<ReaderPage />} />
          <Route path="/reader/:contentId" element={<StoryPage />} />
          <Route path="/reader/book/:bookId" element={<BookPage />} />
          <Route path="/reader/book/:bookId/:chapter" element={<BookChapterPage />} />
          <Route path="/reader/video" element={<VideoListPage />} />
          <Route path="/reader/video/:videoId" element={<VideoPlayerPage />} />
          <Route path="/reader/video/channel/:channelId" element={<VideoChannelPage />} />
          <Route path="/reader/podcast/:seriesId" element={<PodcastSeriesPage />} />
          <Route path="/reader/podcast/:seriesId/:episodeId" element={<PodcastEpisodePage />} />
          <Route path="/srs" element={<SRSPage />} />
          <Route path="/tutor" element={<TutorPage />} />
        </Routes>
      </main>
    </AppProvider>
  );
}
