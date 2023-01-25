import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function get(context) {
  const blog = await getCollection("blog");
  return rss({
    title: `Blog | www.joshfinnie.com`,
    site: import.meta.env.SITE,
    description: "The personal/professional website of Josh Finnie.",
    customData: `<language>en-us</language>`,
    items: blog.map((post) => {
      return {
        link: `/blog/${post.slug}/`,
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
      };
    }),
  });
}
