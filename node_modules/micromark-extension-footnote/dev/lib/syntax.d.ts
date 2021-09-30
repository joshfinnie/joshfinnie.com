/**
 * @param {Options} options
 * @returns {Extension}
 */
export function footnote(options?: Options): Extension
export type Extension = import('micromark-util-types').Extension
export type Resolver = import('micromark-util-types').Resolver
export type Token = import('micromark-util-types').Token
export type Tokenizer = import('micromark-util-types').Tokenizer
export type Exiter = import('micromark-util-types').Exiter
export type State = import('micromark-util-types').State
export type Options = {
  /**
   * Whether to support `^[inline notes]` (`boolean`, default: `false`).
   */
  inlineNotes?: boolean | undefined
}
