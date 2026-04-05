'use client';

import { use, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import InteractiveWord from '@/components/Reader/InteractiveWord';
import { useVocabulary } from '@/context/VocabularyContext';

interface TranscriptSegment {
  text: string;
  offset: number;  // ms
  duration: number; // ms
}

export default function VideoReaderPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = use(params);
  const { getWordStatus } = useVocabulary();

  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(0); // seconds
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const timerRef = useRef<number>(0);
  const activeSegmentRef = useRef<HTMLDivElement | null>(null);

  // Load transcript
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/transcript?v=${videoId}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch transcript');
        }
        const data = await res.json();
        setTranscript(data.transcript);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transcript');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [videoId]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existing = document.getElementById('yt-iframe-api');
    if (!existing) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    function onReady() {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (e: YT.OnStateChangeEvent) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      onReady();
    } else {
      (window as unknown as Record<string, unknown>).onYouTubeIframeAPIReady = onReady;
    }

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [videoId]);

  // Poll current time while playing
  useEffect(() => {
    function tick() {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
      if (isPlaying) {
        timerRef.current = requestAnimationFrame(tick);
      }
    }
    if (isPlaying) {
      timerRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isPlaying]);

  // Seek video when clicking a transcript segment
  const seekTo = useCallback((offsetMs: number) => {
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(offsetMs / 1000, true);
      playerRef.current.playVideo();
    }
  }, []);

  // Find the active segment
  const activeSegmentIndex = useMemo(() => {
    const timeMs = currentTime * 1000;
    for (let i = transcript.length - 1; i >= 0; i--) {
      if (timeMs >= transcript[i].offset) return i;
    }
    return -1;
  }, [currentTime, transcript]);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeSegmentRef.current && isPlaying) {
      const rect = activeSegmentRef.current.getBoundingClientRect();
      const inView = rect.top >= 100 && rect.bottom <= window.innerHeight - 50;
      if (!inView) {
        activeSegmentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeSegmentIndex, isPlaying]);

  // Coverage stats
  const coverageStats = useMemo(() => {
    const allWords = new Set<string>();
    transcript.forEach(seg => {
      seg.text.split(/\s+/).forEach(w => {
        const clean = w.replace(/[^a-zA-ZÀ-ÿ'-]/g, '').toLowerCase();
        if (clean) allWords.add(clean);
      });
    });
    let known = 0, learning = 0;
    allWords.forEach(w => {
      const status = getWordStatus(w);
      if (status === 'known') known++;
      else if (status === 'learning') learning++;
    });
    const total = allWords.size;
    const percent = total > 0 ? Math.min(100, Math.round(((known + learning) / total) * 100)) : 0;
    return { known, learning, total, percent };
  }, [transcript, getWordStatus]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 border-t-transparent" />
          <span className="text-slate-600">Loading transcript...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <Link href="/reader/video" className="text-teal-600 hover:text-teal-700">
          &larr; Back to Videos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link
          href="/reader/video"
          className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 mb-6"
        >
          &larr; Back to Videos
        </Link>

        {/* Video Player */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg bg-black">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <div id="yt-player" className="absolute inset-0 w-full h-full" />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Unique Words</p>
              <p className="text-2xl font-bold text-gray-900">{coverageStats.total}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Known</p>
              <p className="text-2xl font-bold text-green-600">{coverageStats.known}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Learning</p>
              <p className="text-2xl font-bold text-yellow-600">{coverageStats.learning}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase">Coverage</p>
              <p className="text-2xl font-bold text-teal-600">{coverageStats.percent}%</p>
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-6">Transcript</h2>
          <div className="space-y-1">
            {transcript.map((segment, segIndex) => {
              const isActive = segIndex === activeSegmentIndex;
              const words = segment.text.split(/\s+/).filter(w => w.length > 0);
              // Build sentence context from nearby segments
              const sentenceContext = [
                transcript[segIndex - 1]?.text,
                segment.text,
                transcript[segIndex + 1]?.text,
              ].filter(Boolean).join(' ');

              return (
                <div
                  key={segIndex}
                  ref={isActive ? activeSegmentRef : undefined}
                  onClick={() => seekTo(segment.offset)}
                  className={`px-4 py-2.5 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? 'bg-teal-50 border border-teal-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-xs text-slate-400 pt-1 w-12 flex-shrink-0 text-right font-mono">
                      {Math.floor(segment.offset / 60000)}:{((segment.offset / 1000) % 60).toFixed(0).padStart(2, '0')}
                    </span>
                    <div className="flex-1 text-lg leading-relaxed">
                      {words.map((word, wIndex) => (
                        <span key={wIndex}>
                          <InteractiveWord word={word} sentence={sentenceContext} />
                          {wIndex < words.length - 1 && ' '}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-sm text-blue-900 mb-2">
            Click on any word to see its definition. Click a line to jump to that point in the video.
          </p>
          <p className="text-xs text-blue-700">
            Words are underlined: <span className="border-b-2 border-green-400 font-semibold">green</span> =
            known, <span className="border-b-2 border-yellow-400 font-semibold">yellow</span> = learning
          </p>
        </div>
      </div>
    </div>
  );
}

// YouTube IFrame API types
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}
