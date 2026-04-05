import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import path from 'path';
import db from '@/lib/db';

const PYTHON = '/Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12';
const YT_DLP = '/Library/Frameworks/Python.framework/Versions/3.12/bin/yt-dlp';
const FFMPEG_DIR = '/Users/rosel/bin';

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get('v');
  const useWhisper = request.nextUrl.searchParams.get('whisper') !== 'false';

  if (!videoId) {
    return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
  }

  // Check database cache
  const cached = db.prepare('SELECT * FROM transcript_cache WHERE videoId = ?').get(videoId) as { data: string; source: string } | undefined;
  if (cached) {
    return NextResponse.json({ transcript: JSON.parse(cached.data), source: cached.source });
  }

  if (useWhisper) {
    try {
      const result = await transcribeWithWhisper(videoId);
      db.prepare('INSERT INTO transcript_cache (videoId, source, data, createdAt) VALUES (?, ?, ?, ?)').run(
        videoId, 'whisper', JSON.stringify(result.transcript), new Date().toISOString()
      );
      return NextResponse.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Whisper transcription failed';
      console.error('Whisper failed, trying YouTube captions:', message);
    }
  }

  // Fallback: YouTube captions
  try {
    const { fetchTranscript } = await import('youtube-transcript');
    const transcript = await fetchTranscript(videoId, { lang: 'en' });
    db.prepare('INSERT INTO transcript_cache (videoId, source, data, createdAt) VALUES (?, ?, ?, ?)').run(
      videoId, 'youtube-captions', JSON.stringify(transcript), new Date().toISOString()
    );
    return NextResponse.json({ transcript, source: 'youtube-captions' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch transcript';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function transcribeWithWhisper(videoId: string): Promise<{ transcript: Array<{ text: string; offset: number; duration: number }>; source: string }> {
  const tmpDir = `/tmp/storysteps-whisper-${videoId}`;
  mkdirSync(tmpDir, { recursive: true });

  const audioPath = path.join(tmpDir, 'audio.mp3');
  const resultPath = path.join(tmpDir, 'result.json');

  if (!existsSync(audioPath)) {
    execSync(
      `${YT_DLP} -x --audio-format mp3 --ffmpeg-location "${FFMPEG_DIR}" -o "${audioPath}" "https://www.youtube.com/watch?v=${videoId}"`,
      { timeout: 120000, env: { ...process.env, PATH: `${FFMPEG_DIR}:${process.env.PATH}` } }
    );
  }

  const script = `
import whisper, json
model = whisper.load_model("base")
result = model.transcribe("${audioPath}", word_timestamps=True)
segments = []
for seg in result["segments"]:
    segments.append({
        "text": seg["text"].strip(),
        "offset": int(seg["start"] * 1000),
        "duration": int((seg["end"] - seg["start"]) * 1000)
    })
with open("${resultPath}", "w") as f:
    json.dump(segments, f)
`;

  execSync(`${PYTHON} -c '${script.replace(/'/g, "'\\''")}'`, {
    timeout: 600000,
    env: { ...process.env, PATH: `${FFMPEG_DIR}:${process.env.PATH}` },
  });

  const segments = JSON.parse(readFileSync(resultPath, 'utf-8'));
  return { transcript: segments, source: 'whisper' };
}
