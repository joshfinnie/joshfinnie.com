---
title: "My Switch from Gatsby to Astro"
date: "2021-10-28"
tags:
  - "update"
  - "news"
  - "blog"
  - "announcement"
slug: "my-switch-from-gatsby-to-astro"
unsplashURL: denisdegioanni
unsplash: Denis Degioanni
heroImage: "/assets/blog/stars.jpg"
---

A while ago I switched from using [Pelican](https://blog.getpelican.com/) (a static site generator written in Python) to [Gatsby](https://www.gatsbyjs.com/). I was drawn to the up-and-coming technology Gatsby promised. I also thought it was a good time to refresh my site with updated CSS and user experience. The conversion to Gatsby was a success. The documentation built by the Gatsby team was top-notch and I loved my experience with it. Yet, there was always an underlying feeling that the infrastructure was complex and overweight. Earlier this year, we had a team lunch-and-learn on [Astro](https://astro.build/), and the pitch spoke to me.

The last time I wrote about this topic ([here](/blog/joshfinniecom_part_5/)) I didn't even say the framework I was switching to... It must have been to Pelican, but I am not sure. _I found a "Moving to Gatsby" blog post in an old PR, but below is as far as I got..._

> On the first of the year, 2019, I decided to change everything. Well, everything in regards to this blog at least. That faithful day, I took the leap to rewrite my entire static blogging engine to [Gatsby.js](https://www.gatsbyjs.org/).

The switch to Astro is definitely worth a blog post! It's revolutionizing the static web development scene for the better.

## Astro

> Build faster websites with less client-side Javascript

What Astro brings to web development is hard to personify, but the power of this application already is immeasurable. On one hand, the static website generated through Astro has **ZERO** javascript. My old Gatsy site needed Javascript to render my markdown blog posts. The speed and accessibility I gained through switching to Astro was great. On the other hand, switching to Astro was not without its struggles. And I wanted to makes sure that I gave both sides of the coin a fair share. Below you will find my pros and cons to the Astro framework. Listing them out below will give you readers more information on wether the switch is appropriate for you.

### Pros of Astro

- Astro lets you create pages using your favorite UI component libraries (React, Preact, Vue, Svelte, and others) or a built-in component syntax which is like HTML + JSX.
- Astro websites will load faster than other sites generated from different javascript based static site generators.
- Astro has robust templates that can help you get up-and-running with a blog in no time.
- Astro is itself a small NPM package with no dependencies. This makes upgrading Astro less painful than other generators.

### Cons of Astro

- Astro only supports Static Site Generation.
- The built-in component syntax can is usually unsupported if you are not using VSCode.
- Astro's strengths rely heavily on highly static sites and can be more difficult to program if you want more complex interactions. (I'd recommend Next.js for sites where Astro falls short.)
- Understanding the data fetching process in relation to pagination felt complex.

## An Aside

I cannot finish this blog post without talking a bit about the elephant in the room. The `.astro` templating language is sold as a mix of HTML and JSX, but it is truly its own thing. Once you understand it, the power these templates can bring is special. I converted all my JSX component modules to use Astro's templates and have not looked back. Below is an example of my [tags](/tags) page first from the Gatsy implementation then converted to Astro:

```jsx
/* This is Gatsby's Tags.jsx */
import React from 'react';
import PropTypes from 'prop-types';
import {Link, graphql} from 'gatsby';
import kebabCase from 'lodash/kebabCase';

import Layout from '../components/Layout';

const TagsPage = ({
  data: {
    allMdx: {group},
  },
}) => (
  <Layout>
    <div className="main-div">
      <h1 className="text-center">Tags</h1>
      <ul className="column3">
        {group
          .sort((a, b) => b.totalCount - a.totalCount)
          .map((tag) => (
            <li>
              <Link
                key={tag}
                to={`/tags/${kebabCase(tag.fieldValue)}/`}
                className="list-group-item list-group-item-action"
              >
                {tag.fieldValue} ({tag.totalCount})
              </Link>
            </li>
          );)
        }
      </ul>
    </div>
  </Layout>
);

export default TagsPage;

export const pageQuery = graphql`
  query {
    allMdx(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
```

```jsx
/* This is Astro's tags/index.astro */
---
import Layout from '../../components/Layout.astro';

const allPosts = await Astro.fetchContent('../blog/*.md');

const tagCounts = {};
const allTags = [];
allPosts.map(p => p.tags.forEach(t => allTags.push(t)));
allTags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
const tags = Object.keys(tagCounts)
    .map(k => [k, tagCounts[k]])
    .sort((a, b) => b[1] - a[1]);
---
<Layout title="Tags | www.joshfinnie.com">
  <article>
    <h1 class="font-bold text-3xl mb-10 mt-5">Tags</h1>
    <main class="prose max-w-none" style="column-count: 3">
    <ul>
      {tags.map(tag => (
        <li>
          <a
            class="tag"
            href={`/tags/${tag[0]}`}
            title={`View posts tagged under "${tag}"`}
          >
            {tag[0]} ({tag[1]})
          </a>
        </li>
      )}
    </ul>
    </main>
  </article>
</Layout>
```

In this example, you can see the benefit of the frontmatter javascript, keeping all data manipulation in one place. But you can also see where the limitations might lie. _Also, as a double aside, this javascript in the Astro example could definitely be more efficient._ Before Astro, all the tag information and data calaculation happened in `gatsby-node.js`. We can now keep the logic that generates my tag page in one place. It even supports async/await; excellent!

## Emacs

As I stated above, there is first-class support for `.astro` for VSCode. I have been experimenting a lot lately with emacs (probably worthy of another blog post!), and adding support for the `.astro` filetype was easy. I just told emacs to assume `.astro` files were JSX files and haven't looked back. To do this, you add the following command to your emacs configs:

```lisp
(setq auto-mode-alist
    (append '((".*\\.astro\\'" . js-jsx-mode))
        auto-mode-alist))
```

## Code

My blog is open-source. You can find the Astro.build code here: <a href="https://github.com/joshfinnie/joshfinnie.com" target="_blank">github/joshfinnie.com</a> This shows all the interesting bits that I learned while migrating this blog. Pagination, SEO, my spiral into TailwindCSS, it's all there to view. If you are looking to migrate from Gatsby to Astro and have read all the documentation, feel free to browse for some ideas!

## Conclusion

Even though it was more effort to switch from a framework like Gatsby to Astro, I don't see myself turning back. I have been happy with the power that Astro provides, and am hopeful for its future. The [Astro 0.21 Preview](https://astro.build/blog/astro-021-preview/) has me excited for the next release. It makes developing in Astro easier and even faster! Does it make sense for you to jump onto an early project and give it the power to host your own websites? It does! I hope this blog post helped with your decision making as well. As always, if you want to continue this conversion, you can find me on [Twitter](https://twitter.com); I'd love to talk more Astro!
