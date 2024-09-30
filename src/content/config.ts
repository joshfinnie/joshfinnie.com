import { z, defineCollection, SchemaContext } from "astro:content";
import { ZodObject } from "astro:schema";
import { Image } from "astro:assets";

const blog = defineCollection({
  schema: ({ image }: SchemaContext): ZodObject<any> =>
    z.object({
      title: z.string(),
      date: z.string(),
      tags: z.array(z.string()),
      draft: z.boolean().optional(),
      expires: z.boolean().optional(),
      heroImage: image()
        .refine((img: typeof Image): boolean => img.width >= 1080, {
          message: "Cover image must be at least 1080 pixels wide!",
        })
        .optional(),
      unsplash: z.string().optional(),
      unsplashURL: z.string().optional(),
      description: z.string().optional(),
    }),
});

const project = defineCollection({
  schema: ({ image }: SchemaContext): ZodObject<any> =>
    z.object({
      title: z.string(),
      summary: z.string(),
      technologies: z.array(z.string()),
      heroImage: image()
        .refine((img: typeof Image): boolean => img.width >= 780, {
          message: "Cover image must be at least 780 pixels wide!",
        })
        .optional(),
      lastUpdated: z.string().optional(),
    }),
});

const photo = defineCollection({
  schema: ({ image }: SchemaContext): ZodObject<any> =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.string(),
      camera: z.string().optional(),
      ss: z.string().optional(),
      f_stop: z.number().optional(),
      mm: z.number().optional(),
      iso: z.number().optional(),
      image: image()
        .refine((img: typeof Image): boolean => img.width >= 1080, {
          message: "Photo must be greater than 1080 pixels to be displayed.",
        })
        .optional(),
    }),
});

export const collections = { blog, project, photo };
