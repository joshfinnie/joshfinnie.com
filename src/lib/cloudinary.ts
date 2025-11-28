import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';

const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name';

// Create and configure Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName,
  },
  url: {
    secure: true,
  },
});

/**
 * Get optimized Cloudinary image URL
 * @param publicId - The public ID of the image in Cloudinary (without extension)
 * @param options - Optional width and other transformations
 */
export function getCloudinaryImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
  } = {},
): string {
  const image = cld.image(publicId);

  // Apply automatic format and quality optimization
  image.format(auto()).quality(autoQuality());

  // Apply width if specified
  if (options.width) {
    image.resize(`w_${options.width}`);
  }

  if (options.height) {
    image.resize(`h_${options.height}`);
  }

  return image.toURL();
}

/**
 * Convert local image path to Cloudinary public ID
 * Example: src/assets/blog/my-image.jpg -> blog/my-image
 * Example: @assets/blog/my-image.jpg -> blog/my-image
 */
export function pathToPublicId(localPath: string): string {
  // Remove src/assets/ or @assets/ prefix and file extension
  return localPath
    .replace(/^@assets\//, '')
    .replace(/^src\/assets\//, '')
    .replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
}

/**
 * Get the cloud name for environment
 */
export function getCloudName(): string {
  return cloudName;
}

/**
 * Get Cloudinary base URL for direct usage
 */
export function getCloudinaryBaseUrl(): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/`;
}
