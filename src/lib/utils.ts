import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  const allPosts = await getCollection('blog');
  return allPosts
    .filter((post) => post.data.draft !== true && post.data.leftistOnly !== true)
    .sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
}

const LEFTIST_TAGS = ['marxism', 'socialism', 'communism', 'leftist'];

export async function getLeftistPosts() {
  const allPosts = await getCollection('blog');
  return allPosts
    .filter((post) => post.data.draft !== true && post.data.tags?.some((tag) => LEFTIST_TAGS.includes(tag)))
    .sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
}

export async function getTags() {
  const posts = await getPublishedPosts();
  const allTags = posts.flatMap((post) => post.data.tags);
  return [...new Set(allTags)];
}

export async function getSeries() {
  const posts = await getPublishedPosts();
  const allSeries = posts.flatMap((post) => (post.data.series ? [post.data.series] : []));
  return [...new Set(allSeries)];
}
