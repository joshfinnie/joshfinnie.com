/**
 * Plugin to add support for footnotes.
 *
 * @type {import('unified').Plugin<[Options?]|void[], Root>}
 */
export default function remarkFootnotes(
  options?: void | Options | undefined
):
  | void
  | import('unified').Transformer<import('mdast').Root, import('mdast').Root>
export type Root = import('mdast').Root
/**
 * Configuration.
 */
export type Options = {
  /**
   * Whether to support `^[inline notes]`.
   */
  inlineNotes?: boolean | undefined
}
