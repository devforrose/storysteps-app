import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import vocabularyRouter from './routes/vocabulary';
import srsRouter from './routes/srs';
import transcriptRouter from './routes/transcript';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/vocabulary', vocabularyRouter);
app.use('/api/srs', srsRouter);
app.use('/api/transcript', transcriptRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
