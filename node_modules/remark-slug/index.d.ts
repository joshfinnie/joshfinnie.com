/**
 * Plugin to add anchors headings using GitHub’s algorithm.
 *
 * @type {import('unified').Plugin<void[], Root>}
 */
export default function remarkSlug():
  | void
  | import('unified').Transformer<import('mdast').Root, import('mdast').Root>
export type Root = import('mdast').Root
export type Properties = import('hast').Properties
