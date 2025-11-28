import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const MAPPING_FILE = path.join(ROOT_DIR, 'cloudinary-mapping.json');

// Load the Cloudinary mapping
const mapping = await fs.readJson(MAPPING_FILE);
const cloudName = mapping.cloudName;

// Create a lookup map from local paths to public IDs
const imageMap = new Map();
mapping.images.forEach((img) => {
  imageMap.set(img.localPath, img.publicId);
});

console.log(`📦 Loaded ${imageMap.size} image mappings\n`);

/**
 * Convert local asset path to Cloudinary URL
 */
function toCloudinaryUrl(localPath) {
  // Normalize the path
  const normalized = localPath
    .replace(/^\.\.\//, '')
    .replace(/^\.\//, '')
    .replace(/^\//, '');

  const publicId = imageMap.get(normalized);

  if (!publicId) {
    console.warn(`⚠️  No mapping found for: ${localPath}`);
    return null;
  }

  // Return optimized Cloudinary URL
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
}

/**
 * Update image references in a file
 */
async function updateFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  let updated = content;
  let changeCount = 0;

  // Pattern 1: Direct imports - import image from '../assets/...'
  updated = updated.replace(
    /import\s+(\w+)\s+from\s+['"](.+?\/assets\/.+?\.(jpg|jpeg|png|webp|gif))['"];?/gi,
    (match, varName, localPath) => {
      const cloudinaryUrl = toCloudinaryUrl(localPath);
      if (cloudinaryUrl) {
        changeCount++;
        return `// Moved to Cloudinary\nconst ${varName} = "${cloudinaryUrl}";`;
      }
      return match;
    }
  );

  // Pattern 2: Markdown/MDX image syntax - ![alt](../assets/...)
  updated = updated.replace(
    /!\[([^\]]*)\]\((.+?\/assets\/.+?\.(jpg|jpeg|png|webp|gif))\)/gi,
    (match, alt, localPath) => {
      const cloudinaryUrl = toCloudinaryUrl(localPath);
      if (cloudinaryUrl) {
        changeCount++;
        return `![${alt}](${cloudinaryUrl})`;
      }
      return match;
    }
  );

  // Pattern 3: Image component with import.meta.glob reference
  // This is more complex, we'll handle it separately

  // Pattern 4: Direct string references to assets - "src/assets/..."
  updated = updated.replace(
    /(['"])(src\/assets\/.+?\.(jpg|jpeg|png|webp|gif))(['"])/gi,
    (match, quote1, localPath, ext, quote2) => {
      const cloudinaryUrl = toCloudinaryUrl(localPath);
      if (cloudinaryUrl) {
        changeCount++;
        return `${quote1}${cloudinaryUrl}${quote2}`;
      }
      return match;
    }
  );

  if (changeCount > 0) {
    await fs.writeFile(filePath, updated, 'utf-8');
    console.log(`✅ ${path.relative(ROOT_DIR, filePath)}: ${changeCount} changes`);
    return changeCount;
  }

  return 0;
}

/**
 * Process all files in the project
 */
async function processAllFiles() {
  console.log('🔍 Searching for files with image references...\n');

  // Find all relevant files
  const files = await glob('src/**/*.{astro,tsx,ts,md,mdx}', {
    cwd: ROOT_DIR,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**'],
  });

  console.log(`📝 Found ${files.length} files to check\n`);

  let totalChanges = 0;
  let filesModified = 0;

  for (const file of files) {
    const changes = await updateFile(file);
    if (changes > 0) {
      totalChanges += changes;
      filesModified++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Update Summary');
  console.log('='.repeat(60));
  console.log(`✅ Files modified: ${filesModified}`);
  console.log(`✅ Total changes: ${totalChanges}`);
  console.log('='.repeat(60) + '\n');

  if (filesModified > 0) {
    console.log('✨ Image references updated successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Review the changes with: git diff');
    console.log('  2. Test the site: pnpm dev');
    console.log('  3. Build to verify: pnpm build');
  } else {
    console.log('ℹ️  No image references found to update.');
  }
}

// Run the update
processAllFiles().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
