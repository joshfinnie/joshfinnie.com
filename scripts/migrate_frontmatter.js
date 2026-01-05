import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');

/**
 * Update frontmatter in a markdown/mdx file
 */
async function updateFrontmatter(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  let updated = content;
  let changed = false;

  // Pattern: heroImage: "@assets/blog/image.jpg"
  updated = updated.replace(/^heroImage:\s*["']@assets\/(.+?\.(jpg|jpeg|png|webp|gif))["']/gim, (_match, imagePath) => {
    const publicId = imagePath.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
    changed = true;
    return `heroImage: "${publicId}"`;
  });

  // Pattern: heroImage: @assets/blog/image.jpg (without quotes)
  updated = updated.replace(/^heroImage:\s*@assets\/(.+?\.(jpg|jpeg|png|webp|gif))/gim, (_match, imagePath) => {
    const publicId = imagePath.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
    changed = true;
    return `heroImage: "${publicId}"`;
  });

  if (changed) {
    await fs.writeFile(filePath, updated, 'utf-8');
    console.log(`✅ ${path.relative(ROOT_DIR, filePath)}`);
    return true;
  }

  return false;
}

/**
 * Process all content files
 */
async function migrateAllFrontmatter() {
  console.log('🔍 Migrating frontmatter to Cloudinary public IDs...\n');

  // Find all blog posts and projects
  const files = await glob('src/collections/**/*.{md,mdx}', {
    cwd: ROOT_DIR,
    absolute: true,
  });

  console.log(`📝 Found ${files.length} content files\n`);

  let updated = 0;

  for (const file of files) {
    const changed = await updateFrontmatter(file);
    if (changed) {
      updated++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary');
  console.log('='.repeat(60));
  console.log(`✅ Files updated: ${updated}`);
  console.log('='.repeat(60) + '\n');

  if (updated > 0) {
    console.log('✨ Frontmatter migrated successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Review changes: git diff src/collections/');
    console.log('  2. Update components to use Cloudinary');
  }
}

// Run the migration
migrateAllFrontmatter().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
