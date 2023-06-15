---
title: 'Creating a "Similar Posts" Component in Astro.js'
date: "2023-02-27"
tags:
  - "astro.js"
  - "blog"
  - "tutorial"
  - "web-development"
slug: "creating-a-similar-posts-component-in-astrojs"
heroImage: "@assets/blog/reflection.jpg"
unsplash: "Tim Stief"
unsplashURL: "timstief"
description: "This blog post shares my Astro.js component to share similar posts to readers. It's nice, simple and gives an extra layer of discoverability to my readers!"
---

Recently, I read [this post](https://finley.im/2023/02/25/improving-similar-post-relevance) sharing James Finley's code to share similar posts.
Taking their idea, I thought it would be neat to just build out an Astro.js component that I could add to the end of each of my posts.
This would take the post `slug` and `tags` array and generate a component with up to five similar posts.

Luckily, with Astro 2.0 we got some tooling that will help with this component.
Astro 2.0 introduced "Content Collections".
(You can read my review of Astro 2.0 [here](/blog/taking-a-look-at-astro-2/).)
Once we get all the posts through the `getCollection` API, we can do some filtering and mapping to get the "similar" posts.

I do quote "similar" due to not really knowing how similar these posts are comparitively.
I am really only searching for similar tags between posts, and I have not been the best post tagger historically.
It might be worth a revisit, but for now this is pretty nice!

```astro
---
import { collectionEntry, getCollection } from 'astro:content';

import BlogPostPreviewLite from './BlogPostPreviewLite.astro'

const { slug, tags } = Astro.props;
const allPosts = await getCollection('blog');

const excludedTags = ['update', 'blog', 'tutorial', 'news', 'announcement'];
const finalTags = tags.filter(tag => !excludedTags.includes(tag))

const posts = allPosts
      .filter((post: CollectionEntry<'blog'>) => (post.slug != slug && post.data.tags?.filter(tag => finalTags.includes(tag)).length > 0))
      .map((post: CollectionEntry<'blog'>) => ({
          ...post,
          sameTagCount: post.data.tags.filter(tag => finalTags.includes(tag)).length
      }))
      .sort((a, b) => {
          if (a.sameTagCount > b.sameTagCount) return -1
          if (b.sameTagCount > a.sameTagCount) return 1

          if (a.data.date > b.data.date) return -1
          if (a.data.date < b.data.date) return 1

          return 0
      })
      .slice(0, 5);

---

<div class="prose mt-5 p-5 rounded-lg max-w-none bg-gray-200">
    <h2 class="text-center">You might also like...</h2>
    {posts.map((post) => <BlogPostPreviewLite {post} />)}
</div>
```

Above is pretty straightforward, but I do want to point out some interesting bits of the code.

Firstly, I definitely needed to exclude some tags.
I end up using `news` or `tutorial` as a tag almost everywhere.
Those did not make for good suggested posts.

Secondly, I felt that only 5 posts were enough.
Looking through some of my more popular articles, I really only have two or three suggestions anyways.
Having a maximum of five seems right.

## Conclusion

Above shows why I love [Astro.js](https://astro.build/).
I went from reading a concept to executing a fully fledged out component within an afternoon.
This component not only was easy to code, it gives real value to my readers.
Again, I want to thank James Finley for giving me the skeleton to execute this code.

And this code should be pretty plug-and-play for anyone already using Astro.js.
If you already have an easy way to display blog posts, all you need to do is swap out my `BlogPostPreviewLite` for your code and you should be good-to-go.
I'd recommend you tweak the excluded tags, but other than that it should work!

If you do end up using this code, let me know on [Mastodon!](https://fosstodon.org/@joshfinnie).
I am always looking to have good conversation about Astro.js!
