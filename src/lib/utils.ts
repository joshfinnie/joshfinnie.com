import { getCollection } from 'astro:content';

// `draft: true` is only enforced in production builds, so drafts render on
// the local dev server and on Netlify's PR deploy previews / branch deploys,
// but never on the production build Netlify runs for `main`.
const isDev = import.meta.env.DEV || ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT ?? '');

// A post is only live once its `date` has arrived. Future-dated posts are held
// back until the first build on or after that date, so scheduling a post is just
// a matter of dating it in the future. `draft: true` still hides a post outright.
export async function getPublishedPosts() {
  const allPosts = await getCollection('blog');
  return allPosts
    .filter(
      (post) =>
        (isDev || post.data.draft !== true) &&
        post.data.leftistOnly !== true &&
        Date.parse(post.data.date) <= Date.now()
    )
    .sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
}

// Posts with `hidden: true` still get their own /blog/[id]/ page and stay
// eligible for series membership (SeriesTableOfContents, /series/ pages), but
// are left out of the main index, tags, and RSS. Use this to publish a series
// as one visible hub post (with a hand-written Overview + Table of Contents)
// while the individual parts stay reachable only via links from the hub.
export async function getListedPosts() {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.data.hidden !== true);
}

const LEFTIST_TAGS = ['marxism', 'socialism', 'communism', 'leftist'];

export async function getLeftistPosts() {
  const allPosts = await getCollection('blog');
  return allPosts
    .filter(
      (post) =>
        (isDev || post.data.draft !== true) &&
        Date.parse(post.data.date) <= Date.now() &&
        post.data.tags?.some((tag) => LEFTIST_TAGS.includes(tag))
    )
    .sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
}

// Notes follow the same publish gate as posts: future-dated notes stay hidden
// until the first build on or after their date.
export async function getPublishedNotes() {
  const allNotes = await getCollection('note');
  return allNotes
    .filter((note) => (isDev || note.data.draft !== true) && Date.parse(note.data.date) <= Date.now())
    .sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
}

export async function getNoteTags() {
  const notes = await getPublishedNotes();
  return [...new Set(notes.flatMap((note) => note.data.tags))];
}

export async function getTags() {
  const posts = await getListedPosts();
  const allTags = posts.flatMap((post) => post.data.tags);
  return [...new Set(allTags)];
}

// Series parts live in their own `seriesPart` collection so they can never be
// picked up by getPublishedPosts/getListedPosts, RSS, or tags no matter what
// their frontmatter says. Same publish gate as blog posts: draft or
// future-dated parts stay hidden.
export async function getPublishedSeriesParts() {
  const allParts = await getCollection('seriesPart');
  return allParts
    .filter((part) => (isDev || part.data.draft !== true) && Date.parse(part.data.date) <= Date.now())
    .sort((a, b) => a.data.order - b.data.order);
}

export interface SeriesEntry {
  id: string;
  title: string;
  date: string;
  description: string;
  href: string;
  order?: number;
}

// A series can be made of ordinary `blog` posts sharing a `series` value
// (the older pattern, e.g. django-bootcamp) or `seriesPart` entries under a
// hub post (the newer "publish all at once" pattern). This merges both so
// downstream pages don't need to know which one a given series uses.
export async function getSeriesEntries(seriesSlug: string): Promise<SeriesEntry[]> {
  const [posts, parts] = await Promise.all([getPublishedPosts(), getPublishedSeriesParts()]);

  const fromBlog: SeriesEntry[] = posts
    .filter((post) => post.data.series === seriesSlug)
    .map((post) => ({
      id: post.id,
      title: post.data.title,
      date: post.data.date,
      description: post.data.description,
      href: `/blog/${post.id}/`,
    }));

  const fromParts: SeriesEntry[] = parts
    .filter((part) => part.data.series === seriesSlug)
    .map((part) => ({
      id: part.id,
      title: part.data.title,
      date: part.data.date,
      description: part.data.description,
      href: `/series/${seriesSlug}/${part.data.slug ?? part.id}/`,
      order: part.data.order,
    }));

  // seriesPart entries carry an explicit order (their dates are often
  // identical for a series published all at once); blog entries fall back to
  // date, since older series were ordered that way.
  return [...fromBlog, ...fromParts].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    return Date.parse(a.date) - Date.parse(b.date);
  });
}

export async function getSeries() {
  const [posts, parts] = await Promise.all([getPublishedPosts(), getPublishedSeriesParts()]);
  const fromBlog = posts.flatMap((post) => (post.data.series ? [post.data.series] : []));
  const fromParts = parts.flatMap((part) => (part.data.series ? [part.data.series] : []));
  return [...new Set([...fromBlog, ...fromParts])];
}
