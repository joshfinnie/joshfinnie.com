import { getEntry } from 'astro:content';
import { getCloudinaryImageUrl } from '@lib/cloudinary';
import { renderCard } from 'astro-cards/runtime';

export interface OgCardProps {
  title: string;
  heroUrl: string | null;
  avatarUrl: string;
}

export interface OgImage {
  url: string;
  width: number;
  height: number;
  type: string;
}

const AVATAR_URL = getCloudinaryImageUrl('josh', { width: 144, height: 144 });

function cleanTitle(title: string): string {
  return title.replace(/\s*\|\s*Josh Finnie\s*$/, '').trim();
}

/**
 * Resolves the props for the `post` OG card. Blog and note pages pass their
 * collection + entry id so the real title (and, for blog, the Cloudinary hero)
 * can be looked up. Everything else falls back to the page title on a plain
 * background.
 */
async function getOgCardProps(opts: { collection?: string; id?: string; title?: string }): Promise<OgCardProps> {
  const { collection, id, title } = opts;
  const fallbackTitle = title ? cleanTitle(title) : 'Josh Finnie';

  if (collection === 'blog' && id) {
    const post = await getEntry('blog', id);
    if (post) {
      return {
        title: post.data.title,
        heroUrl: post.data.heroImage ? getCloudinaryImageUrl(post.data.heroImage, { width: 1200, height: 630 }) : null,
        avatarUrl: AVATAR_URL,
      };
    }
  }

  if (collection === 'note' && id) {
    const note = await getEntry('note', id);
    if (note) {
      return { title: note.data.title, heroUrl: null, avatarUrl: AVATAR_URL };
    }
  }

  return { title: fallbackTitle, heroUrl: null, avatarUrl: AVATAR_URL };
}

/**
 * Renders the `post` OG card for a page and returns the absolute image URL plus
 * its dimensions and MIME type for the `og:image` meta tags.
 */
export async function renderOgImage(
  opts: { collection?: string; id?: string; title?: string },
  site: URL | undefined
): Promise<OgImage> {
  const card = await renderCard('post', await getOgCardProps(opts));
  // `trailingSlash: 'always'` serves the dev-only `/_cards` endpoint at
  // `/_cards/`, but renderCard emits the src without the slash. No-op for the
  // prerendered `/_astro/*.jpg` path a production build uses.
  const src = card.src.replace('/_cards?', '/_cards/?');
  return {
    url: site ? new URL(src, site).href : src,
    width: card.width,
    height: card.height,
    type: card.type,
  };
}
