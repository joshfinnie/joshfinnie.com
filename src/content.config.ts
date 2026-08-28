import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.(md|mdx)', base: './src/collections/blog/' }),
  schema: () =>
    z.object({
      title: z.string(),
      date: z.string(),
      tags: z.array(z.string()),
      draft: z.boolean().optional(),
      expires: z.boolean().optional(),
      heroImage: z.string().optional(), // Now using Cloudinary public ID
      unsplash: z.string().optional(),
      unsplashURL: z.string().optional(),
      description: z.string(),
      series: z.string().optional(),
      // Marks this post as the landing page for a series (the series slug it
      // fronts). Renders the post in a two-column layout: a sidebar listing
      // every part on the left, the post's own content (an Overview) on the
      // right, instead of the usual inline SeriesTableOfContents.
      seriesHub: z.string().optional(),
      hidden: z.boolean().optional(),
      leftistOnly: z.boolean().optional(),
      slug: z.string(),
    }),
});

// Parts of a "publish all at once" series. Kept in a collection separate from
// `blog` on purpose: nothing that builds the main index, tags, or RSS ever
// queries this collection, so a part can't accidentally show up there no
// matter what its frontmatter says. Parts are only reachable by a link from
// their series hub post (a normal `blog` entry) or from each other via
// SeriesTableOfContents.
const seriesPart = defineCollection({
  loader: glob({ pattern: '**/*.(md|mdx)', base: './src/collections/series-parts/' }),
  schema: () =>
    z.object({
      title: z.string(),
      date: z.string(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().optional(),
      description: z.string(),
      series: z.string(),
      // Parts published "all at once" usually share one date, so ordering
      // needs to be explicit rather than derived from date.
      order: z.number(),
      slug: z.string().optional(),
    }),
});

const note = defineCollection({
  loader: glob({ pattern: '**/*.(md|mdx)', base: './src/collections/notes/' }),
  schema: () =>
    z.object({
      title: z.string(),
      date: z.string(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().optional(),
      description: z.string(),
      source: z.url().optional(),
    }),
});

const project = defineCollection({
  loader: glob({ pattern: '[^_]*.(md|mdx)', base: './src/collections/projects' }),
  schema: () =>
    z.object({
      title: z.string(),
      summary: z.string(),
      technologies: z.array(z.string()),
      heroImage: z.string().optional(), // Now using Cloudinary public ID
      lastUpdated: z.string().optional(),
    }),
});

const talks = defineCollection({
  loader: file('./src/collections/talks/talks.json'),
  schema: z.array(
    z.object({
      name: z.string(),
      link: z.string().optional(),
      location: z.string(),
      locationLink: z.string(),
      lightning: z.boolean(),
      date: z.string(),
    })
  ),
});

export const collections = { blog, note, project, talks, seriesPart };
