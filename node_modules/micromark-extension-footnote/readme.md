# micromark-extension-footnote

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[micromark][]** extension to support footnotes.

As there is no spec for footnotes in markdown, this extension stays as close to
references and list items in CommonMark, while being inspired by the HTML output
of Pandoc notes.

## When to use this

If you’re using [`micromark`][micromark] or
[`mdast-util-from-markdown`][from-markdown], use this package.
Alternatively, if you’re using **[remark][]**, use
[`remark-footnotes`][remark-footnotes].

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install micromark-extension-footnote
```

## Use

Say we have the following file, `example.md`:

```markdown
Here is a footnote call,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here’s one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.

        { some.code }

    The whole paragraph can be indented, or just the first
    line.  In this way, multi-paragraph footnotes work like
    multi-paragraph list items.

This paragraph won’t be part of the note, because it
isn’t indented.

Here is an inline note.^[Inlines notes are easier to write, since
you don’t have to pick an identifier and move down to type the
note.]
```

And our script, `example.js`, looks as follows:

```js
import fs from 'fs'
import {micromark} from 'micromark'
import {footnote, footnoteHtml} from 'micromark-extension-footnote'

const output = micromark(fs.readFileSync('example.md'), {
  extensions: [footnote({inlineNotes: true})],
  htmlExtensions: [footnoteHtml]
})

console.log(output)
```

Now, running `node example` yields:

```html
<p>Here is a footnote call,<a href="#fn1" class="footnote-ref" id="fnref1" role="doc-noteref"><sup>1</sup></a> and another.<a href="#fn2" class="footnote-ref" id="fnref2" role="doc-noteref"><sup>2</sup></a></p>
<p>This paragraph won’t be part of the note, because it
isn’t indented.</p>
<p>Here is an inline note.<a href="#fn3" class="footnote-ref" id="fnref3" role="doc-noteref"><sup>3</sup></a></p>
<section class="footnotes" role="doc-endnotes">
<hr />
<ol>
<li id="fn1" role="doc-endnote">
<p>Here is the footnote.<a href="#fnref1" class="footnote-back" role="doc-backlink">↩</a></p>
</li>
<li id="fn2" role="doc-endnote">
<p>Here’s one with multiple blocks.</p>
<p>Subsequent paragraphs are indented to show that they
belong to the previous footnote.</p>
<pre><code>{ some.code }
</code></pre>
<p>The whole paragraph can be indented, or just the first
line.  In this way, multi-paragraph footnotes work like
multi-paragraph list items.<a href="#fnref2" class="footnote-back" role="doc-backlink">↩</a></p>
</li>
<li id="fn3" role="doc-endnote">
<p>Inlines notes are easier to write, since
you don’t have to pick an identifier and move down to type the
note.<a href="#fnref3" class="footnote-back" role="doc-backlink">↩</a></p>
</li>
</ol>
</section>
```

## API

This package exports the following identifiers: `footnote`, `footnoteHtml`.
There is no default export.

The export map supports the endorsed
[`development` condition](https://nodejs.org/api/packages.html#packages_resolving_user_conditions).
Run `node --conditions development module.js` to get instrumented dev code.
Without this condition, production code is loaded.

### `footnote(options?)`

### `footnoteHtml`

A function that can be called with options to get an extension for micromark to
parse footnotes (can be passed in `extensions`) and an extension to compile them
to HTML (can be passed in `htmlExtensions`).

###### `options.inlineNotes`

Whether to support `^[inline notes]` (`boolean`, default: `false`).

## Related

*   [`remarkjs/remark`][remark]
    — markdown processor powered by plugins
*   [`remarkjs/remark-footnotes`][remark-footnotes]
    — remark plugin using this to support footnotes
*   [`micromark/micromark`][micromark]
    — the smallest commonmark-compliant markdown parser that exists
*   [`syntax-tree/mdast-util-footnote`][mdast-util-footnote]
    — mdast utility to support footnotes
*   [`syntax-tree/mdast-util-from-markdown`][from-markdown]
    — mdast parser using `micromark` to create mdast from markdown
*   [`syntax-tree/mdast-util-to-markdown`][to-markdown]
    — mdast serializer to create markdown from mdast

## Contribute

See [`contributing.md` in `micromark/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/micromark/micromark-extension-footnote/workflows/main/badge.svg

[build]: https://github.com/micromark/micromark-extension-footnote/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/micromark/micromark-extension-footnote.svg

[coverage]: https://codecov.io/github/micromark/micromark-extension-footnote

[downloads-badge]: https://img.shields.io/npm/dm/micromark-extension-footnote.svg

[downloads]: https://www.npmjs.com/package/micromark-extension-footnote

[size-badge]: https://img.shields.io/bundlephobia/minzip/micromark-extension-footnote.svg

[size]: https://bundlephobia.com/result?p=micromark-extension-footnote

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/micromark/micromark/discussions

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/micromark/.github/blob/HEAD/contributing.md

[support]: https://github.com/micromark/.github/blob/HEAD/support.md

[coc]: https://github.com/micromark/.github/blob/HEAD/code-of-conduct.md

[micromark]: https://github.com/micromark/micromark

[from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown

[to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown

[remark]: https://github.com/remarkjs/remark

[mdast-util-footnote]: https://github.com/syntax-tree/mdast-util-footnote

[remark-footnotes]: https://github.com/remarkjs/remark-footnotes
