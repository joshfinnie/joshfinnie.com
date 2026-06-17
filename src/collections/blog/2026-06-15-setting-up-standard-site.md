---
title: "Setting Up the standard.site Protocol on This Blog"
date: "2026-06-15"
tags:
  - "atproto"
  - "bluesky"
  - "astro"
  - "indieweb"
slug: "setting-up-standard-site"
heroImage: "blog/standard-site"
description: "How I wired this Astro blog up to standard.site, the AT Protocol lexicon for long-form publishing, with a well-known file, a single head tag, and a sync script that does the boring work."
draft: false
---

I have been quietly looking for a way to let my writing live somewhere outside the silo of one platform without rewriting the blog from scratch. [standard.site](https://standard.site/) is the closest thing I have found to that. It is a small set of AT Protocol lexicons for long-form publishing, and the pitch is exactly what it sounds like: one schema, every platform. Publish to my own site, register the records on the atmosphere, and a reader, search tool, or aggregator that speaks the protocol can find my posts without me handing them anything proprietary.

The setup took an afternoon. Here is what it actually involves.

## What the protocol asks for

The protocol cares about two things. There is a publication, which is the site itself, and there are documents, which are the individual posts and pages. Both live as records in my Bluesky repo under the `site.standard.publication` and `site.standard.document` collections. The blog's job is to prove the connection between the website I control and those records.

That proof happens in two places. For the publication, I serve a file at `/.well-known/site.standard.publication` whose contents are the AT-URI of the publication record. For each document, I add a `<link rel="site.standard.document" href="at://...">` tag to that page's `<head>`. Anyone who fetches the page and follows the link arrives at the canonical record on the atmosphere.

Nothing about this is heavy. The hard part is keeping the URIs in sync as posts get added and renamed.

## The well-known file

I build this blog with Astro and deploy it as static files on Netlify, so the well-known file is just a flat text file in `public/`. Astro copies anything under `public/` to the site root at build, so a file at `public/.well-known/site.standard.publication` ends up served at `https://www.joshfinnie.com/.well-known/site.standard.publication`. Its contents are a single line:

```
at://did:plc:4po2afnpxgpdwpsr5fwgw3we/site.standard.publication/3mnagfxrccm2o
```

That is it. No JSON, no headers to configure, no Netlify function. The DID is mine, the rkey points at the publication record I created, and a crawler that fetches this file can confirm the site claims that record.

## The head tag, per page

The per-document link tag belongs in the `<head>`, which on this blog means `BaseHead.astro`. I added a single optional prop and one conditional line:

```astro
---
interface Props {
  // ...existing props
  atUri?: string | undefined;
}
const { title, description, image, ogType, publishedTime, articleTags, atUri } = Astro.props;
---
{atUri && <link rel="site.standard.document" href={atUri} />}
```

The layouts that wrap pages, `BaseLayout.astro` and `ConsultLayout.astro`, look up the right AT-URI for the current path in a mapping file and pass it down:

```astro
---
import mapping from '../../standard-mapping.json';

const normalizedPath = Astro.url.pathname.endsWith('/')
  ? Astro.url.pathname
  : `${Astro.url.pathname}/`;
const atUri = (mapping.documents as Record<string, string>)[normalizedPath];
---
<BaseHead {title} {description} image={imageUrl} {atUri} />
```

I check the mapping file into the repo. It is the only piece of state that ties the website's URL space to the AT Protocol record space, and the only thing my Astro build needs at compile time. Pages that have no entry in the mapping silently skip the link tag, which keeps drafts and one-off pages from emitting broken references.

## The sync script

I did not want to write a record by hand every time I publish a post. I also did not want my Astro build to talk to Bluesky on every deploy, because that is the kind of side effect that breaks at the worst possible time. The compromise is a small Node script at `scripts/sync-standard.js`, run manually with `pnpm sync:standard`, that does three things: it creates or updates the publication record, walks every Markdown and MDX file in `src/collections/` and `src/pages/`, and writes the resulting URIs into `standard-mapping.json`.

The script logs in with an app password via `@atproto/api`, then either creates the publication record or updates it in place if `standard-mapping.json` already has a URI for it. After that it writes the publication URI to the well-known file, so the file and the record can never drift apart.

For each content file, it derives the web path the same way Astro will at build time, then asks two questions. Is this path already in the mapping? If yes, reuse the URI, because the document record on Bluesky is the canonical thing and we do not want a new one every time the script runs. Did the slug change recently? The script also checks the raw filename in case a kebab-case rename happened, so a single rename does not orphan the existing record.

Only when both checks fail does it call `com.atproto.repo.createRecord` with a `site.standard.document` payload:

```js
const docRecord = {
  $type: 'site.standard.document',
  site: mapping.publicationUri,
  title: data.title,
  publishedAt: new Date(data.date).toISOString(),
  path: webPath,
  description: data.description || '',
};
```

The new URI gets written into the mapping immediately, before the next iteration, so a crash partway through never costs more than the in-flight record. There is a 200 millisecond pause between writes to be polite to the PDS.

## Letting the pre-commit hook run it

The next question was when to run that script. I tried wiring it into the build once and immediately regretted it, because a flaky network or an expired app password would now mean a broken deploy instead of a missing link tag. The sync is not on the critical path for the site rendering, only for the records being current, so the build is the wrong place for it.

A pre-commit hook is the right place. I already use Husky on this repo for formatting and Vale, so adding one more line was almost free. The hook now starts with:

```sh
pnpm sync:standard && git add standard-mapping.json
```

Every commit syncs the publication and document records first, then stages the updated mapping alongside whatever I was already committing. New posts get a `site.standard.document` record the same commit I write them in, renames pick up the existing URI through the slug check in the script, and `standard-mapping.json` never falls behind the content because it cannot: the commit that adds a post is the commit that registers it.

The nice property of this setup is that the script is still safe to run by hand. If I am offline or the hook gets skipped for some reason, `pnpm sync:standard` later catches everything up, and because the mapping is idempotent it does not double-create records. The hook is convenience, not correctness.

## What this gets me

The thing I keep coming back to is that none of this changes how I write. The blog is still Markdown in a folder, the deploy is still a static site on Netlify, the editor is still whatever I had open. I added one prop to a head component, one file in `public/`, and one script I run when I want to. Everything else is the same.

What I get in exchange is that this site now participates in the protocol that Bluesky-adjacent reading tools are starting to build on. A future reader that wants to surface long-form posts from accounts I follow can find this one. A future search tool can resolve my AT-URI to a real URL on my domain. If standard.site catches on, I am already on it. If it does not, I have lost an afternoon and gained a `.well-known` file, which is a low-stakes bet either way.

If you are running your own blog and want to try the same setup, the [standard.site](https://standard.site/) docs are short enough to read in one sitting, and most of the work is the small mapping layer between your URLs and the records you create. If you do try it, or you spot something I got wrong, find me on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).
