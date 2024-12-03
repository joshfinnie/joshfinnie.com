import { z, defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.(md|mdx)", base: "./src/collections/blog/" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.string(),
      tags: z.array(z.string()),
      draft: z.boolean().optional(),
      expires: z.boolean().optional(),
      heroImage: image().optional(),
      unsplash: z.string().optional(),
      unsplashURL: z.string().optional(),
      description: z.string().optional(),
    }),
});

const project = defineCollection({
  loader: glob({ pattern: "[^_]*.(md|mdx)", base: "./src/collections/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      technologies: z.array(z.string()),
      heroImage: image().optional(),
      lastUpdated: z.string().optional(),
    }),
});

const talks = defineCollection({
  loader: file("./src/collections/talks/talks.json"),
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

export const collections = { blog, project, talks };
