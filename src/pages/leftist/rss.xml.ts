import rss from '@astrojs/rss';
import { getLeftistPosts } from '@lib/utils';

export async function GET() {
  const posts = await getLeftistPosts();
  return rss({
    title: `Leftist Corner | www.joshfinnie.com`,
    site: import.meta.env.SITE,
    description: 'Political and economic commentary from a Marxist perspective by Josh Finnie.',
    customData: `<language>en-us</language>`,
    items: posts.map((post) => ({
      link: `/leftist/${post.data.slug ?? post.id}/`,
      pubDate: new Date(post.data.date),
      ...post.data,
    })),
  });
}
