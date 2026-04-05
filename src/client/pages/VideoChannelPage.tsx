import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { videoChannels } from '@/data/videoChannels';

export default function VideoChannelPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const channel = videoChannels.find((c) => c.id === channelId);

  if (!channel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Channel not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <div className="relative w-full h-56 md:h-72 overflow-hidden">
        <img
          src={channel.thumbnail}
          alt={channel.name}
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
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-1">{channel.name}</h1>
          <p className="text-white/80">{channel.description}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="inline-block px-3 py-1.5 bg-red-100 rounded-full text-sm text-red-700 font-medium">
            YouTube
          </span>
          <span className="inline-block px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
            {channel.videos.length} video{channel.videos.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Video list */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Videos</h2>
        <div className="space-y-3">
          {channel.videos.map((video) => (
            <Link
              key={video.videoId}
              to={`/reader/video/${video.videoId}`}
              className="block"
            >
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md hover:border-teal-300 transition-all flex">
                <div className="w-40 md:w-56 flex-shrink-0">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {video.title}
                    </h3>
                    {video.level && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded">
                        {video.level}
                      </span>
                    )}
                  </div>
                  <span className="text-teal-600 text-sm font-medium flex-shrink-0 ml-4">
                    Watch &rarr;
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
