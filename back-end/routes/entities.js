import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import { DATA_DIR } from '../server.js';
import { readEntity, writeEntity, listEntities, ensureDir } from '../lib/fileHelpers.js';
 
const router = express.Router();
 
const entityDir = (campaign, type) => path.join(DATA_DIR, campaign, type);
const entityPath = (campaign, type, slug) => path.join(entityDir(campaign, type), `${slug}.md`);
 
// GET /api/:campaign/:type — list all entities
router.get('/:campaign/:type', async (req, res) => {
  try {
    const { campaign, type } = req.params;
    const entities = await listEntities(entityDir(campaign, type));
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// POST /api/:campaign/:type — create entity
router.post('/:campaign/:type', async (req, res) => {
  try {
    const { campaign, type } = req.params;
    const { name, body = '', ...rest } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
 
    const slug = slugify(name, { lower: true, strict: true });
    const filePath = entityPath(campaign, type, slug);
    const today = new Date().toISOString().split('T')[0];
 
    const frontmatter = {
      id: slug,
      name,
      type: type.replace(/s$/, ''), // naive singular
      campaign,
      tags: [],
      linked: [],
      created: today,
      updated: today,
      ...rest,
    };
 
    await ensureDir(entityDir(campaign, type));
    await writeEntity(filePath, frontmatter, body);
    res.status(201).json({ ...frontmatter, _slug: slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// GET /api/:campaign/:type/:slug — get single entity
router.get('/:campaign/:type/:slug', async (req, res) => {
  try {
    const { campaign, type, slug } = req.params;
    const { data, content } = await readEntity(entityPath(campaign, type, slug));
    res.json({ ...data, body: content.trim(), _slug: slug });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});
 
// PUT /api/:campaign/:type/:slug — update entity
router.put('/:campaign/:type/:slug', async (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, req.params.campaign, req.params.type, `${req.params.slug}.md`);
    const existing = await readEntity(filePath);
    const { body, ...incomingFrontmatter } = req.body;
    const merged = { ...existing.data, ...incomingFrontmatter };
    await writeEntity(filePath, merged, body ?? existing.content);
      rres.json({ _slug: req.params.slug, ...merged });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// DELETE /api/:campaign/:type/:slug — delete entity
router.delete('/:campaign/:type/:slug', async (req, res) => {
  try {
    const { campaign, type, slug } = req.params;
    await fs.unlink(entityPath(campaign, type, slug));
    res.json({ deleted: slug });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});
 
// GET /api/:campaign/search?q= — full-text search across all types
router.get('/:campaign/search', async (req, res) => {
  try {
    const { campaign } = req.params;
    const q = (req.query.q || '').toLowerCase();
    if (!q) return res.json([]);
 
    const TYPES = ['sessions', 'npcs', 'locations', 'factions', 'plot-threads', 'prep'];
    const results = [];
 
    for (const type of TYPES) {
      const dir = entityDir(campaign, type);
      let files;
      try { files = await fs.readdir(dir); } catch { continue; }
 
      for (const file of files.filter(f => f.endsWith('.md'))) {
        const raw = await fs.readFile(path.join(dir, file), 'utf-8');
        if (raw.toLowerCase().includes(q)) {
          const { data } = await import('gray-matter').then(m => ({ data: m.default(raw) }));
          results.push({ ...data.data, _slug: file.replace('.md', ''), _type: type });
        }
      }
    }
 
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
export default router;
