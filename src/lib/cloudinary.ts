import { Cloudinary } from '@cloudinary/url-gen';
import { fill, scale } from '@cloudinary/url-gen/actions/resize';
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format';
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality';

const cloudName: string = import.meta.env.CLOUDINARY_CLOUD_NAME || 'dgd9cw3gu';

// Create Cloudinary instance
const cld: Cloudinary = new Cloudinary({
  cloud: { cloudName },
  url: { secure: true },
});

/**
 * Get optimized Cloudinary image URL
 */
export function getCloudinaryImageUrl(publicId: string, options: { width?: number; height?: number } = {}): string {
  const image = cld.image(publicId);

  // Apply automatic format and quality optimization
  image.format(autoFormat() as any).quality(autoQuality() as any);

  if (options.width && options.height) {
    image.resize(fill().width(options.width).height(options.height));
  } else if (options.width) {
    image.resize(scale().width(options.width));
  } else if (options.height) {
    image.resize(scale().height(options.height));
  }

  return image.toURL();
}

/**
 * Convert local image path to Cloudinary public ID
 */
export function pathToPublicId(localPath: string): string {
  return localPath
    .replace(/^@assets\//, '')
    .replace(/^src\/assets\//, '')
    .replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
}

/**
 * Get Cloudinary cloud name
 */
export function getCloudName(): string {
  return cloudName;
}

/**
 * Get Cloudinary base URL
 */
export function getCloudinaryBaseUrl(): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/`;
}
