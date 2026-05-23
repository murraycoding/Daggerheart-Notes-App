import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import { DATA_DIR } from '../server.js';
import { ensureDir } from '../lib/fileHelpers.js';
 
const router = express.Router();
 
const ENTITY_TYPES = ['sessions', 'npcs', 'locations', 'factions', 'plot-threads', 'prep'];
 
// GET /api/campaigns — list all campaigns
router.get('/', async (_req, res) => {
  try {
    const entries = await fs.readdir(DATA_DIR, { withFileTypes: true });
    const campaigns = await Promise.all(
      entries
        .filter(e => e.isDirectory())
        .map(async (e) => {
          try {
            const metaPath = path.join(DATA_DIR, e.name, 'campaign.json');
            const raw = await fs.readFile(metaPath, 'utf-8');
            return JSON.parse(raw);
          } catch {
            return { slug: e.name, name: e.name };
          }
        })
    );
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// POST /api/campaigns — create a new campaign
router.post('/', async (req, res) => {
  try {
    const { name, system = 'Daggerheart', tags = [] } = req.body;
    if (!name) return res.status(400).json({ error: 'Campaign name is required' });
 
    const slug = slugify(name, { lower: true, strict: true });
    const campaignDir = path.join(DATA_DIR, slug);
 
    await ensureDir(campaignDir);
    for (const type of ENTITY_TYPES) {
      await ensureDir(path.join(campaignDir, type));
    }
 
    const meta = { slug, name, system, tags, created: new Date().toISOString().split('T')[0] };
    await fs.writeFile(path.join(campaignDir, 'campaign.json'), JSON.stringify(meta, null, 2));
 
    res.status(201).json(meta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
export default router;
