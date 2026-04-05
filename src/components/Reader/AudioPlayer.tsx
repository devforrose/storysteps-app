
import { useState, useRef, useEffect, useCallback } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  totalWords: number;
  onWordIndexChange: (index: number | null) => void;
}

export default function AudioPlayer({ audioUrl, totalWords, onWordIndexChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const animFrameRef = useRef<number>(0);

  // Estimate which word is being read based on time position
  // Uses linear interpolation: wordIndex = (currentTime / duration) * totalWords
  const getWordIndex = useCallback((time: number): number => {
    if (duration <= 0 || totalWords <= 0) return 0;
    const ratio = time / duration;
    return Math.min(Math.floor(ratio * totalWords), totalWords - 1);
  }, [duration, totalWords]);

  // Animation loop for smooth word tracking
  const updateHighlight = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    setCurrentTime(audio.currentTime);
    onWordIndexChange(getWordIndex(audio.currentTime));
    animFrameRef.current = requestAnimationFrame(updateHighlight);
  }, [getWordIndex, onWordIndexChange]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onWordIndexChange(null);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      audio.play();
      setIsPlaying(true);
      animFrameRef.current = requestAnimationFrame(updateHighlight);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onWordIndexChange(null);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
    onWordIndexChange(getWordIndex(time));
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newRate = speeds[nextIndex];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const skipBack = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 5);
    setCurrentTime(audio.currentTime);
    onWordIndexChange(getWordIndex(audio.currentTime));
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 5);
    setCurrentTime(audio.currentTime);
    onWordIndexChange(getWordIndex(audio.currentTime));
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md p-4 mb-8">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-3">
        {/* Skip back */}
        <button
          onClick={skipBack}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          title="Back 5s"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9.624 7.084a.75.75 0 00-1.248.832l2.223 3.334-2.223 3.334a.75.75 0 001.248.832L12 12.084l2.376 3.332a.75.75 0 001.248-.832l-2.223-3.334 2.223-3.334a.75.75 0 00-1.248-.832L12 10.416 9.624 7.084z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={handlePlay}
          className="p-3 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Skip forward */}
        <button
          onClick={skipForward}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          title="Forward 5s"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Time display */}
        <span className="text-xs text-slate-500 w-20 text-center">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Seek bar */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1.5 accent-teal-600 cursor-pointer"
        />

        {/* Speed control */}
        <button
          onClick={handleSpeedChange}
          className="px-2 py-1 rounded text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors min-w-[3rem]"
          title="Playback speed"
        >
          {playbackRate}x
        </button>
      </div>

      {isPlaying && (
        <p className="text-xs text-slate-400 mt-2 text-center">
          Highlighted word follows the audio. Use the seek bar to re-sync.
        </p>
      )}
    </div>
  );
}
