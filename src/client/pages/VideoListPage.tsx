import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoChannels, VideoChannel } from '@/data/videoChannels';

interface SavedVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  addedAt: string;
}

const STORAGE_KEY = 'storysteps-videos';

function loadVideos(): SavedVideo[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveVideos(videos: SavedVideo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

function extractVideoId(input: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function ChannelCard({ channel }: { channel: VideoChannel }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Channel header */}
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{channel.name}</h2>
        <p className="text-sm text-gray-600">{channel.description}</p>
      </div>

      {/* Video list */}
      <div className="divide-y divide-slate-100">
        {channel.videos.map((video) => (
          <Link
            key={video.videoId}
            to={`/reader/video/${video.videoId}`}
            className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="w-32 md:w-40 flex-shrink-0 rounded overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                alt={video.title}
                className="w-full h-auto"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
              {video.level && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                  {video.level}
                </span>
              )}
            </div>
            <span className="text-teal-600 text-sm font-medium flex-shrink-0">
              Watch &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function VideoListPage() {
  const [myVideos, setMyVideos] = useState<SavedVideo[]>([]);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMyVideos(loadVideos());
    setLoaded(true);
  }, []);

  const handleAdd = async () => {
    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      setError('Invalid YouTube URL or video ID');
      return;
    }

    if (myVideos.some(v => v.videoId === videoId)) {
      setError('Video already in your library');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/transcript?v=${videoId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Could not fetch transcript');
      }

      const newVideo: SavedVideo = {
        videoId,
        title: 'YouTube Video',
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        addedAt: new Date().toISOString(),
      };

      try {
        const oembed = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        const data = await oembed.json();
        if (data.title) newVideo.title = data.title;
      } catch {
        // Title fetch failed
      }

      const updated = [newVideo, ...myVideos];
      setMyVideos(updated);
      saveVideos(updated);
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (videoId: string) => {
    const updated = myVideos.filter(v => v.videoId !== videoId);
    setMyVideos(updated);
    saveVideos(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          to="/reader"
          className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 mb-8"
        >
          &larr; Back to Library
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">YouTube Videos</h1>
        <p className="text-lg text-gray-600 mb-10">
          Watch videos and read along with interactive transcripts to build your vocabulary.
        </p>

        {/* Curated channels */}
        <div className="space-y-8 mb-12">
          {videoChannels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>

        {/* My Videos */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Videos</h2>
          <p className="text-sm text-gray-600 mb-4">
            Add any YouTube video with English subtitles.
          </p>

          {/* Add form */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Paste YouTube URL..."
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                onClick={handleAdd}
                disabled={loading || !url.trim()}
                className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Loading...' : 'Add'}
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>

          {/* User's saved videos */}
          {loaded && myVideos.length > 0 && (
            <div className="space-y-3">
              {myVideos.map((video) => (
                <div key={video.videoId} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-all flex">
                  <Link to={`/reader/video/${video.videoId}`} className="flex flex-1 items-center gap-4 p-4">
                    <div className="w-32 md:w-40 flex-shrink-0 rounded overflow-hidden">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-auto" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">Added {new Date(video.addedAt).toLocaleDateString()}</p>
                    </div>
                  </Link>
                  <div className="flex items-center pr-4">
                    <button
                      onClick={() => handleRemove(video.videoId)}
                      className="p-2 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
