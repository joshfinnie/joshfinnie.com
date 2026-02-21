import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  const allPosts = await getCollection('blog');
  return allPosts
    .filter((post) => post.data.draft != true)
    .sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
}

export async function getTags() {
  const posts = await getPublishedPosts();
  const allTags = posts.flatMap((post) => post.data.tags);
  return [...new Set(allTags)];
}
