---
title: "Taking a Look at Astro 2.0"
date: "2023-01-31"
tags:
  - "astro.js"
  - "blog"
  - "update"
  - "vite"
slug: "taking-a-look-at-astro-2"
heroImage: "@assets/blog/astro.jpg"
unsplash: "Lucas Marconnet"
unsplashURL: "lucasmrc"
description: "<DESCRIPTION>"
---

Out of the blue (to me...), [Astro](https://astro.build) [released version 2.0](https://astro.build/blog/astro-2/) of their amazing platform.
I have been using astro.js on this blog [for a while](/blog/my-switch-from-gatsby-to-astro/).
And the 2.0 release has brought a lot of improvements.
I am truely excited to share my thoughts here!

There are a lot of changes in Astro 2.0.
I really recommend reading the release notes.
But I want to touch on 3 exciting changes for me and this blog.

## Content Collections

I have not been this excited for a change in how I manage my blog content since I switched to Astro itself.
Content Collections are new in Astro 2.0.
And they just make sense.

> Working with Markdown/MDX is hard.

The above quote is how a lot of people feel about Markdown.
It's bolded on the [article announcing Content Collections](https://astro.build/blog/introducing-content-collections/).
And my previous experience with markdown in Astro is any example; it was not the best.

Before Content Collections, there was not a real conclusive way to handle markdown files within Astro.
This lead me to just add them to the `posts` folder which had my Astro code to display posts.
I always felt like this was never a best-practice.
It lead to a lot of mixed media files that did not have a coherient reason to be together.

Now with Content Collections, I have moved all my blog posts to a new location.
Astro 2 also adds the ability to type these collections, which really helps code completion.

Below is the collection typing for my blog posts:

```ts
import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    expires: z.boolean().optional(),
    heroImage: z.string().optional(),
    unsplash: z.string().optional(),
    unsplashURL: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { blog };
```

Adding the above configuration allows for type completion throughout the codebase.
This speeds up the development of components that relate to blog posts.
And it helps to keep me honest with what I add to my post's frontmatter!

## Improved Dev Server

Astro has been working a lot to improve the development server.
"Astro 2.0 highlights several months of investment to improve the performance and reliability of the Astro dev server, especially around Hot Module Reloading (HMR)."
This can be felt when deveploping.
It's nice and fast.

## Vite 4.0

Having the latest and greatest is always the best.
Seeing that the Astro is working hard to keep up with Vite is great.
Vite has really won the tooling war for me.
The fact that Astro uses it and updates frequently is amazing.

## Conclusion

Above I shared 3 changes in Astro 2.0 that I am very excited for.
Like I said above, there is much more to Astro 2.0 than what I went over here.
Definitely check it out yourself.
The amazingness of Content Collections are worth it alone!
There is a great [website to try out Astro for yourself](https://astro.new/).

If you too love Astro, come find me on [Mastodon](https://fosstodon.org/@joshfinnie) and let's chat!
