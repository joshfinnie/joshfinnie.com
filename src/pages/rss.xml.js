import rss from "@astrojs/rss";

const postImportResult = import.meta.glob('./blog/**/*.md', { eager: true });
const posts = Object.values(postImportResult);

export const get = () => {
  try {
    return rss({
      title: `Blog | www.joshfinnie.com`,
      site: import.meta.env.SITE,
      description: "The personal/professional website of Josh Finnie.",
      customData: `<language>en-us</language>`,
      items: posts.map((post) => {
        return {
          link: post.url,
          title: post.frontmatter.title,
          pubDate: post.frontmatter.date,
        };
      }),
    });
  } catch (e) {
    console.log(e);
  }
};
