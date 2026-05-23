import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
 
/**
 * Read and parse a single markdown file with frontmatter.
 * Returns { data, content } where data is the frontmatter object.
 */
export async function readEntity(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  return matter(raw);
}
 
/**
 * Write an entity back to disk, serializing frontmatter + body.
 */
export async function writeEntity(filePath, frontmatter, body) {
  const output = matter.stringify(body || '', frontmatter);
  await fs.writeFile(filePath, output, 'utf-8');
}
 
/**
 * List all .md files in a directory, returning parsed frontmatter for each.
 * Returns an array of frontmatter objects (no body content).
 */
export async function listEntities(dirPath) {
  let files;
  try {
    files = await fs.readdir(dirPath);
  } catch {
    return []; // Directory may not exist yet for this type
  }
 
  const mdFiles = files.filter(f => f.endsWith('.md'));
  const results = await Promise.all(
    mdFiles.map(async (file) => {
      const parsed = await readEntity(path.join(dirPath, file));
      return { ...parsed.data, _slug: file.replace('.md', '') };
    })
  );
  return results;
}
 
/**
 * Ensure a directory exists, creating it recursively if needed.
 */
export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}
