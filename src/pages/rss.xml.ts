import rss from '@astrojs/rss';
import { getPublishedPosts } from '@lib/utils';

export async function GET() {
  const blog = await getPublishedPosts();
  return rss({
    title: `Blog | www.joshfinnie.com`,
    site: import.meta.env.SITE,
    description: 'The personal/professional website of Josh Finnie.',
    customData: `<language>en-us</language>`,
    items: blog.map((post) => ({
      link: `/blog/${post.id}/`,
      pubDate: new Date(post.data.date),
      ...post.data,
    })),
  });
}
