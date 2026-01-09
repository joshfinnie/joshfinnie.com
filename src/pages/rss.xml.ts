import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET() {
  const blog = await getCollection('blog');
  return rss({
    title: `Blog | www.joshfinnie.com`,
    site: import.meta.env.SITE,
    description: 'The personal/professional website of Josh Finnie.',
    customData: `<language>en-us</language>`,
    items: blog
      .sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date))
      .map((post) => ({
        link: `/blog/${post.id}/`,
        pubDate: new Date(post.data.date),
        ...post.data,
      })),
  });
}
