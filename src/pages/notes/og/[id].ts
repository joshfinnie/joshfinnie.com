import { getPublishedNotes } from '@lib/utils';
import { OGImageRoute } from 'astro-og-canvas';

const entries = await getPublishedNotes();

const pages = Object.fromEntries(entries.map(({ data, id }) => [id, { data }]));

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page: (typeof pages)[string]) => ({
    title: page.data.title,
    description: page.data.description ?? '',
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
  }),
});
