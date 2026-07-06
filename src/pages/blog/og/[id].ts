import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

// Match the publish gate in getPublishedPosts so future-dated posts don't leak
// an OG image at a guessable URL before they go live.
const entries = (await getCollection('blog')).filter(
  (post) => post.data.draft !== true && Date.parse(post.data.date) <= Date.now()
);

const pages = Object.fromEntries([
  ...entries.map(({ data, id }) => [
    id,
    {
      assetImports: undefined,
      data,
    },
  ]),
  [
    'index',
    {
      data: {
        title: "Josh Finnie's Homepage",
        description: 'My homepage where I write about technical issues on my blog. Check it out!',
      },
    },
  ],
]);

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page: (typeof pages)[string]) => ({
    title: page.assetImports ? '' : page.data.title,
    description: page.assetImports ? '' : page.data.description,
    font: {
      title: {
        families: ['Inter'],
        weight: 'SemiBold',
        lineHeight: 1.1,
        color: [250, 250, 250],
      },
    },
    fonts: [
      'https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf',
      'https://api.fontsource.org/v1/fonts/inter/latin-600-normal.ttf',
    ],
    ...(page.assetImports
      ? {
          bgImage: {
            path: page.assetImports[0].replace('@assets', './src/assets'),
            fit: 'cover' as const,
          },
        }
      : {}),
  }),
});
