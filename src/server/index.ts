import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import vocabularyRouter from './routes/vocabulary';
import srsRouter from './routes/srs';
import transcriptRouter from './routes/transcript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/vocabulary', vocabularyRouter);
app.use('/api/srs', srsRouter);
app.use('/api/transcript', transcriptRouter);

// In production, serve the Vite build
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
