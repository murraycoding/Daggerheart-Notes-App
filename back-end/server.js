import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import campaignRoutes from './routes/campaigns.js';
import entityRoutes from './routes/entities.js';
 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
 
const app = express();
const PORT = 3001;
 
// Resolve the /data directory (sibling to /back-end)
export const DATA_DIR = path.resolve(__dirname, '../data/campaigns');
 
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
 
app.use('/api/campaigns', campaignRoutes);
app.use('/api', entityRoutes);
 
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
 
app.listen(PORT, () => {
  console.log(`Daggerheart backend running on http://localhost:${PORT}`);
});
