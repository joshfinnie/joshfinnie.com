---
title: "Fixing My JSON-LD, Two Years Later"
date: "2026-08-28"
tags:
  - "SEO"
  - "json-ld"
  - "astro"
  - "tutorial"
slug: "fixing-my-json-ld-two-years-later"
heroImage: "blog/fixing-my-json-ld-two-years-later"
unsplash: "Alain Pham"
unsplashURL: "alain_pham"
description: "Revisiting the JSON-LD I added to this site two years ago, finding two real bugs hiding in it, and moving to a slot-based pattern inspired by Stephen Lunt's Astro structured data post."
---

Two years ago I wrote about [adding JSON-LD to this blog](/blog/adding-json-ld-to-my-blog/): a `WebSite` schema on every page, a `BlogPosting` schema on every post, a `WebPage` schema on everything else. It worked, and I forgot about it, which is often a sign something is fine. This time it wasn't.

I came back to it while building out a new tutorial series, and revisiting the code from two years ago was a little humbling. Every page on the site was hand-rolling its own `JSON.stringify` block, copied and adjusted slightly for each content type. That copying had let two real bugs creep in without me noticing.

My `BlogPosting` schema's `url` field was missing the `/blog/` prefix and the trailing slash, quietly pointing at a URL that never actually resolved. And the `WebPage` schema snippet I shared in that old post, `"name": {title}`, wasn't just documentation shorthand the way I intended it to read. I had genuinely copied it into real Astro frontmatter exactly like that, where `{title}` is valid JavaScript, just not the JavaScript I meant. It's object shorthand syntax, so instead of the string value of `title`, the schema was shipping `{"name":{"title":"..."}}`, a nested object where a plain string belonged. Neither bug broke the page. They just quietly broke the schema, which is exactly the kind of mistake that's easy to ship and hard to notice, since nothing in the actual rendered page ever tells you your structured data is wrong.

## A Better Pattern

I'd read [Stephen Lunt's post on structured data in Astro](https://stephen-lunt.dev/blog/astro-structured-data/) a while before this, and his approach stuck with me: dedicated components per schema type, injected into the layout through a named slot, instead of scattering the same `JSON.stringify` shape inline across every component that happens to render an article. That's the pattern I moved to.

`BaseLayout` now exposes a `structured-data` slot in its `<head>`, alongside a `WebsiteStructuredData` component that renders unconditionally on every page:

```astro
<head>
  <BaseHead ... />
  <WebsiteStructuredData />
  <slot name="structured-data" />
</head>
```

Blog posts, notes, and anything else that's an article now share one `ArticleStructuredData` component instead of each maintaining its own copy of the same shape. This is the component itself, not just where it gets called:

```astro
---
import { getCloudinaryImageUrl } from '@lib/cloudinary';

interface Props {
  headline: string;
  description: string;
  date: string;
  url: string;
  tags?: string[];
  heroImage?: string | undefined;
  articleType?: 'BlogPosting' | 'TechArticle';
  isPartOf?: string;
}

const { headline, description, date, url, tags = [], heroImage, articleType = 'BlogPosting', isPartOf } = Astro.props;

const image = heroImage ? getCloudinaryImageUrl(heroImage, { width: 1024 }) : undefined;

const schema = JSON.stringify({
  '@context': 'https://schema.org/',
  '@type': articleType,
  headline,
  author: {
    '@type': 'Person',
    name: 'Josh Finnie',
  },
  datePublished: date,
  dateCreated: date,
  dateModified: date,
  description,
  url,
  ...(image ? { image } : {}),
  ...(isPartOf ? { isPartOf: { '@type': 'BlogPosting', url: isPartOf } } : {}),
  inLanguage: 'en-US',
  keywords: tags,
});
---

<script type="application/ld+json" set:html={schema} is:inline />
```

`articleType` defaults to `BlogPosting`, which covers regular posts and notes, but I also render tutorial series parts through this same component with `articleType="TechArticle"` and `isPartOf` pointing back at the series' landing page. `heroImage` and `isPartOf` are both optional, and the spread-with-a-conditional (`...(image ? { image } : {})`) is how they skip showing up in the JSON at all when a page doesn't have one, rather than serializing as `"image": undefined` or `null`.

A page that has all of that just calls it once:

```astro
<BaseLayout ...>
  <ArticleStructuredData
    slot="structured-data"
    headline={post.data.title}
    description={post.data.description}
    date={post.data.date}
    url={`https://www.joshfinnie.com/blog/${post.id}/`}
    tags={post.data.tags}
    heroImage={post.data.heroImage}
  />
  <BlogPost {...post.data} id={post.id}>
    <Content />
  </BlogPost>
</BaseLayout>
```

Generic pages, my about page, my uses page, got the same treatment with a `WebPageStructuredData` component. This is also where that object-wrapping bug actually got caught and fixed, so here's the whole thing, bug fix included:

```astro
---
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;

const schema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  author: {
    '@type': 'Person',
    name: 'Josh Finnie',
  },
});
---

<script type="application/ld+json" set:html={schema} is:inline />
```

`name: title` instead of `name: { title }`. That's the entire fix, a pair of braces removed, and a different JSON shape in the output.

The real win isn't the slot itself. It's that there's now exactly one place that knows what a `BlogPosting` schema looks like, and one place that knows what a `WebPage` schema looks like, so a fix or an improvement happens once instead of getting silently missed in whichever of six components I didn't think to update. That's the difference between "I added JSON-LD" and "I have JSON-LD I can actually maintain."

If you're setting this up for the first time, [my original post](/blog/adding-json-ld-to-my-blog/) still covers what JSON-LD is and why it's worth doing. Consider this the sequel: the same idea, with the sharp edges I only found by living with it for two years.

Find me on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev) if you've run into similar rot in your own structured data, or if you want to talk through the slot pattern.
