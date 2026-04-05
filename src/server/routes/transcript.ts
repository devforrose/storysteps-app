import { Router } from 'express';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import path from 'path';
import { db } from '../db';
import { transcriptCache } from '../db/schema';
import { eq } from 'drizzle-orm';

const PYTHON = '/Library/Frameworks/Python.framework/Versions/3.12/bin/python3.12';
const YT_DLP = '/Library/Frameworks/Python.framework/Versions/3.12/bin/yt-dlp';
const FFMPEG_DIR = '/Users/rosel/bin';

const router = Router();

router.get('/', async (req, res) => {
  const videoId = req.query.v as string;
  const useWhisper = req.query.whisper !== 'false';

  if (!videoId) {
    res.status(400).json({ error: 'Missing video ID' });
    return;
  }

  // Check database cache
  const cached = await db.select().from(transcriptCache).where(eq(transcriptCache.videoId, videoId));
  if (cached.length > 0) {
    res.json({ transcript: JSON.parse(cached[0].data), source: cached[0].source });
    return;
  }

  if (useWhisper) {
    try {
      const result = await transcribeWithWhisper(videoId);
      await db.insert(transcriptCache).values({
        videoId,
        source: 'whisper',
        data: JSON.stringify(result.transcript),
        createdAt: new Date().toISOString(),
      });
      res.json(result);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Whisper failed';
      console.error('Whisper failed, trying YouTube captions:', message);
    }
  }

  // Fallback: YouTube captions
  try {
    const { fetchTranscript } = await import('youtube-transcript');
    const transcript = await fetchTranscript(videoId, { lang: 'en' });
    await db.insert(transcriptCache).values({
      videoId,
      source: 'youtube-captions',
      data: JSON.stringify(transcript),
      createdAt: new Date().toISOString(),
    });
    res.json({ transcript, source: 'youtube-captions' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch transcript';
    res.status(500).json({ error: message });
  }
});

async function transcribeWithWhisper(videoId: string) {
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

export default router;
