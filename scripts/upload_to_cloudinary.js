import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Error: Missing Cloudinary configuration!');
  console.error('Please set the following environment variables in your .env file:');
  console.error('  - CLOUDINARY_CLOUD_NAME');
  console.error('  - CLOUDINARY_API_KEY');
  console.error('  - CLOUDINARY_API_SECRET');
  console.error('\nGet these from: https://console.cloudinary.com/');
  process.exit(1);
}

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

/**
 * Find all images in src/assets directory
 */
async function findAllImages(dir, baseDir = dir) {
  const images = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively search subdirectories
      const subImages = await findAllImages(fullPath, baseDir);
      images.push(...subImages);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        // Get relative path from assets directory
        const relativePath = path.relative(baseDir, fullPath);
        images.push({
          fullPath,
          relativePath,
        });
      }
    }
  }

  return images;
}

/**
 * Upload a single image to Cloudinary
 */
async function uploadImage(imagePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      folder: '', // Images will use their path as the public ID
      overwrite: false, // Don't overwrite if already exists
      resource_type: 'image',
      // Cloudinary will automatically optimize
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Convert file path to Cloudinary public ID
 */
function pathToPublicId(relativePath) {
  // Remove extension and use path as public ID
  const parsed = path.parse(relativePath);
  return path.join(parsed.dir, parsed.name).replace(/\\/g, '/');
}

/**
 * Main upload function
 */
async function uploadAllImages() {
  console.log('🔍 Scanning for images in src/assets/...\n');

  const images = await findAllImages(ASSETS_DIR);

  console.log(`📦 Found ${images.length} images to upload\n`);

  if (images.length === 0) {
    console.log('✅ No images found. Nothing to upload.');
    return;
  }

  const results = {
    success: [],
    failed: [],
    skipped: [],
  };

  let processed = 0;

  for (const image of images) {
    processed++;
    const publicId = pathToPublicId(image.relativePath);

    process.stdout.write(`[${processed}/${images.length}] Uploading ${image.relativePath}... `);

    const result = await uploadImage(image.fullPath, publicId);

    if (result.success) {
      console.log('✅');
      results.success.push({
        path: image.relativePath,
        publicId: result.publicId,
        url: result.url,
      });
    } else {
      if (result.error.includes('already exists')) {
        console.log('⏭️  (already exists)');
        results.skipped.push({
          path: image.relativePath,
          publicId,
        });
      } else {
        console.log(`❌ ${result.error}`);
        results.failed.push({
          path: image.relativePath,
          error: result.error,
        });
      }
    }

    // Rate limiting: wait 100ms between uploads
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Upload Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully uploaded: ${results.success.length}`);
  console.log(`⏭️  Skipped (already exist): ${results.skipped.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log('='.repeat(60) + '\n');

  if (results.failed.length > 0) {
    console.log('❌ Failed uploads:');
    results.failed.forEach((item) => {
      console.log(`  - ${item.path}: ${item.error}`);
    });
    console.log('');
  }

  // Save mapping file for reference
  const mappingFile = path.join(__dirname, '../cloudinary-mapping.json');
  await fs.writeJson(
    mappingFile,
    {
      uploadedAt: new Date().toISOString(),
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      images: [...results.success, ...results.skipped].map((item) => ({
        localPath: `src/assets/${item.path}`,
        publicId: item.publicId || pathToPublicId(item.path),
        cloudinaryUrl:
          item.url ||
          `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${item.publicId || pathToPublicId(item.path)}`,
      })),
    },
    { spaces: 2 }
  );

  console.log(`📄 Image mapping saved to: ${mappingFile}\n`);

  if (results.failed.length === 0) {
    console.log('🎉 All images uploaded successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Review cloudinary-mapping.json');
    console.log('  2. Update image references in your code');
    console.log('  3. Test the site');
    console.log('  4. Remove images from git: git rm -r src/assets/');
  }
}

// Run the upload
uploadAllImages().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
