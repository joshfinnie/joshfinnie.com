---

title: "Upgrading Gatsby to Use Mdx"
date: "2020-06-12"
tags:
  - "javascript"
  - "markdown"
  - "tutorial"
path: "/blog/upgrading-gatsby-to-use-mdx"
heroImage: "/assets/blog/arrow.jpg"
expires: true
layout: '../../layouts/BlogPost.astro'
unsplash: 'Smart'
unsplashURL: 'smartphotocoures'

---

Over the past few days I have upgraded this personal site to accept blogs and pages written in [Mdx](https://mdxjs.com/). Straight out of the box Gatsby works with Markdown, but I do enjoy what Mdx is bringing the table. It felt as if it would be worth the effort to upgrade.

## What is Mdx?

MDX is an authorable format that lets you seamlessly use JSX in your markdown documents. You can import components, like interactive charts or notifications, and export metadata. This makes writing long-form content with components a blast. [[1](https://github.com/mdx-js/mdx)] This is a nice update to regular markdown. You can now use all those nice pre-built Gatsby components you know and love.

For example, we can now use the Gatsby Link component within our markdown!

```md
---
title: "A Blog Post!"
---

import {Link} from 'gatsby';

This is a blog post with a Gatsby link!

<Link to="/">Home</Link>
```

The above is a contrived example, but you can start to see the power here. Below I will go through the detailed git diff for this switch-over and you can see how easy it was.

## What Do We Need To Changed?

First we want to make sure that `gatsby-config.js` will use the two Mdx plugins versus the remark plugins.

```diff
-      resolve: 'gatsby-transformer-remark',
+      resolve: `gatsby-plugin-mdx`,
       options: {
         plugins: [
+          extensions: [`.mdx`, `.md`],
         ]

...

-      resolve: 'gatsby-plugin-feed',
+      resolve: 'gatsby-plugin-feed-mdx',
```

With the change from `gatsby-transformer-remark` to `gatsby-plugin-mdx`, we will need to modify the graphql query signatures where you find `allMarkdownRemark` and `markdownRemark`. This should happen in only a few places, and the easiest way to find all is to just do a search within your code base. For example, I had to change this is `gatsby-node.js` and `src/pages/index.jsx` along with a few other places specific to my code base. Below in a diff from `gatsby-node.js`:

```diff
    return new Promise((resolve) => {
        graphql(`
            {
-               allMarkdownRemark {
+               allMdx {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        `)
    });
```

How we render the data changes a little bit as well. (I have to admit, I really like this change!) Where we rendered the HTML `gatsby-transformer-remark` generated  we now use the `MDXRenderer` component. Where ever you render the html from `gatsby-transform-remark` we need to make the following change:

```diff
+ import {MDXRenderer} from 'gatsby-plugin-mdx';

...

- <section dangerouslySetInnerHTML={{ __html: post.html  }} />
+ <MDXRenderer>{post.body}</MDXRenderer>

...

export const query = graphql`
query($path: String!) {
-   markdownRemark(frontmatter: {path: {eq: $path}}) {
-       html
+   mdx(frontmatter: {path: {eq: $path}}) {
+       body
        frontmatter {
            title
            date
        }
    }
}
`
```

We no longer have to pass the raw HTML to `dangerouslySetInnerHTML` and we can have the `RDXRenderer` handle everything for us. This setup is a bit more clear to me. It shows why you are doing what you are doing; it's a good change.

## Why Make this Change?

Why did I do this? As I stated in the opening paragraph, I wanted to leverage React components within my blog posts. Two of the biggest benefits I got out of this was an easy way to import files for URLs and to simplify my Unsplash image credit.

For adding files to my Markdown, the best example of that is my About page where I link to my resume. Below is an example that shows how this works.

```md
import resume from '../docs/resume.pdf'

<a href={resume} target="_blank" rel="noopener noreferrer">Download full resume (PDF)</a>.
```

The other place I am leveraging Mdx is in each post that has an Unsplash image. I wanted to make sure I was able to credit the artists of all the images. To do this I developed a small component that I can add to each of my blog posts like this one! Below is the code snippet of the component and how I use it in the blog posts:

```jsx
import React from 'react';
import PropTypes from 'prop-types';

const Unsplash = ({name, url = null}) => {
  if (url) {
    const finalUrl = `https://unsplash.com/@${url}`;
    return (
      <p className="unsplash mb-4 text-center">
        Photo by <a href={finalUrl}>{name}</a> on{' '}
        <a href="https://unsplash.com">Unsplash</a>
      </p>
    );
  }
  return (
    <p className="unsplash mb-4 text-center">
      Photo by {name} on <a href="https://unsplash.com">Unsplash</a>
    </p>
  );
};

Unsplash.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Unsplash;
```

```md
import Unsplash from '../../components/Unsplash';

ThIs Is My BlOg PoSt...

<Unsplash name="Smart" url="smartphotocourses" />
```

## Conclusion

This is only the beginning of my usage of mdx. I am very excited to see what fun options it brings to my blog posts in later posts. I should also state that there was one gotcha that I was not expecting. There were a few times throughout my blog posts I wrote markdown that looked like a bad React Component. These sudo-components completely broke my Gatsby build. I had to go back and add a few `&lt;`s and `&gt;` in places; I also had to make sure my HTML code was correct. Converting my Gatsby blog to use Mdx wasn't that bad and you can see the whole PR [here](https://github.com/joshfinnie/joshfinnie.com/pull/729/files). As always, find me on [Twitter](https://twitter.com/joshfinnie) if you want to chat about this post!
