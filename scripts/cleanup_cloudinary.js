import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MAPPING_FILE = path.join(__dirname, '../cloudinary-mapping.json');
const ROOT_DIR = path.join(__dirname, '..');

async function cleanupUploadedImages() {
  if (!(await fs.pathExists(MAPPING_FILE))) {
    console.error('❌ cloudinary-mapping.json not found. Run `pnpm run cloudinary:upload` first.');
    process.exit(1);
  }

  const mapping = await fs.readJson(MAPPING_FILE);
  const images = mapping.images ?? [];

  if (images.length === 0) {
    console.log('✅ No images in mapping. Nothing to clean up.');
    return;
  }

  console.log(`🔍 Checking ${images.length} mapped images for local copies...\n`);

  const results = { removed: [], missing: [] };

  for (const image of images) {
    const localPath = path.join(ROOT_DIR, image.localPath);

    if (await fs.pathExists(localPath)) {
      await fs.remove(localPath);
      console.log(`🗑️  Removed: ${image.localPath}`);
      results.removed.push(image.localPath);
    } else {
      results.missing.push(image.localPath);
    }
  }

  // Remove empty directories left behind
  const assetsDir = path.join(ROOT_DIR, 'src/assets');
  if (await fs.pathExists(assetsDir)) {
    await removeEmptyDirs(assetsDir);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Cleanup Summary');
  console.log('='.repeat(60));
  console.log(`🗑️  Removed: ${results.removed.length}`);
  console.log(`⏭️  Already gone: ${results.missing.length}`);
  console.log('='.repeat(60) + '\n');
}

async function removeEmptyDirs(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeEmptyDirs(path.join(dir, entry.name));
    }
  }

  const remaining = await fs.readdir(dir);
  if (remaining.length === 0) {
    await fs.remove(dir);
    console.log(`📁 Removed empty dir: ${path.relative(ROOT_DIR, dir)}`);
  }
}

cleanupUploadedImages().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
