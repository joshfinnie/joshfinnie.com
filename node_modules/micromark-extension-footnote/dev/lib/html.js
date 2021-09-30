/**
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 * @typedef {import('micromark-util-types').CompileContext} CompileContext
 */

import {normalizeIdentifier} from 'micromark-util-normalize-identifier'

const own = {}.hasOwnProperty

/** @type {HtmlExtension} */
export const footnoteHtml = {
  enter: {
    footnoteDefinition() {
      // @ts-expect-error It’s defined.
      this.getData('tightStack').push(false)
    },
    footnoteDefinitionLabelString() {
      this.buffer()
    },
    footnoteCallString() {
      this.buffer()
    },
    inlineNoteText() {
      /** @type {number} */
      // @ts-expect-error It’s fine.
      const counter = (this.getData('inlineNoteCounter') || 0) + 1
      /** @type {number[]} */
      // @ts-expect-error It’s fine.
      let stack = this.getData('inlineNoteStack')
      /** @type {(string|number)[]} */
      // @ts-expect-error It’s fine.
      let calls = this.getData('footnoteCallOrder')

      if (!stack) this.setData('inlineNoteStack', (stack = []))
      if (!calls) this.setData('footnoteCallOrder', (calls = []))

      stack.push(counter)
      calls.push(counter)
      this.setData('inlineNoteCounter', counter)
      this.buffer()
    }
  },
  exit: {
    footnoteDefinition() {
      /** @type {Record<string, string>} */
      // @ts-expect-error It’s fine.
      let definitions = this.getData('footnoteDefinitions')
      /** @type {string[]} */
      // @ts-expect-error: It’s fine
      const stack = this.getData('footnoteDefinitionStack')
      /** @type {string} */
      // @ts-expect-error: It’s fine
      const current = stack.pop()
      const value = this.resume()

      if (!definitions) this.setData('footnoteDefinitions', (definitions = {}))
      if (!own.call(definitions, current)) definitions[current] = value

      // @ts-expect-error It’s defined.
      this.getData('tightStack').pop()
      this.setData('slurpOneLineEnding', true)
      // “Hack” to prevent a line ending from showing up if we’re in a definition in
      // an empty list item.
      this.setData('lastWasTag')
    },
    footnoteDefinitionLabelString(token) {
      /** @type {string[]} */
      // @ts-expect-error: It’s fine
      let stack = this.getData('footnoteDefinitionStack')

      if (!stack) this.setData('footnoteDefinitionStack', (stack = []))

      stack.push(normalizeIdentifier(this.sliceSerialize(token)))
      this.resume() // Drop the label.
      this.buffer() // Get ready for a value.
    },
    footnoteCallString(token) {
      /** @type {(string|number)[]} */
      // @ts-expect-error It’s fine.
      let calls = this.getData('footnoteCallOrder')
      const id = normalizeIdentifier(this.sliceSerialize(token))
      /** @type {number} */
      let counter

      this.resume()

      if (!calls) this.setData('footnoteCallOrder', (calls = []))

      const index = calls.indexOf(id)

      if (index === -1) {
        calls.push(id)
        counter = calls.length
      } else {
        counter = index + 1
      }

      createCall.call(this, String(counter))
    },
    inlineNoteText() {
      /** @type {(string|number)[]} */
      // @ts-expect-error It’s fine.
      const calls = this.getData('footnoteCallOrder')
      /** @type {number} */
      // @ts-expect-error It’s fine.
      const counter = this.getData('inlineNoteStack').pop()
      /** @type {Record<number, string>} */
      // @ts-expect-error It’s fine.
      let notes = this.getData('inlineNotes')

      if (!notes) this.setData('inlineNotes', (notes = {}))

      notes[counter] = '<p>' + this.resume() + '</p>'
      createCall.call(this, String(calls.indexOf(counter) + 1))
    },
    null() {
      /** @type {(string|number)[]} */
      // @ts-expect-error It’s fine.
      const calls = this.getData('footnoteCallOrder') || []
      /** @type {Record<string, string>} */
      // @ts-expect-error It’s fine.
      const definitions = this.getData('footnoteDefinitions') || {}
      /** @type {Record<number, string>} */
      // @ts-expect-error It’s fine.
      const notes = this.getData('inlineNotes') || {}
      let index = -1
      /** @type {string} */
      let value
      /** @type {string|number} */
      let id
      /** @type {boolean} */
      let injected
      /** @type {string} */
      let back
      /** @type {string} */
      let counter

      if (calls.length > 0) {
        this.lineEndingIfNeeded()
        this.tag('<section class="footnotes" role="doc-endnotes">')
        this.lineEndingIfNeeded()
        this.tag('<hr />')
        this.lineEndingIfNeeded()
        this.tag('<ol>')
      }

      while (++index < calls.length) {
        // Called definitions are always defined.
        id = calls[index]
        counter = String(index + 1)
        injected = false
        back =
          '<a href="#fnref' +
          counter +
          '" class="footnote-back" role="doc-backlink">↩</a>'
        value = (typeof id === 'number' ? notes : definitions)[id].replace(
          /<\/p>(?:\r?\n|\r)?$/,
          injectBack
        )

        this.lineEndingIfNeeded()
        this.tag('<li id="fn' + counter + '" role="doc-endnote">')
        this.lineEndingIfNeeded()
        this.raw(value)

        if (!injected) {
          this.lineEndingIfNeeded()
          this.tag(back)
        }

        this.lineEndingIfNeeded()
        this.tag('</li>')
      }

      if (calls.length > 0) {
        this.lineEndingIfNeeded()
        this.tag('</ol>')
        this.lineEndingIfNeeded()
        this.tag('</section>')
      }

      /**
       * @param {string} $0
       * @returns {string}
       */
      function injectBack($0) {
        injected = true
        return back + $0
      }
    }
  }
}

/**
 * @this {CompileContext}
 * @param {string} counter
 */
function createCall(counter) {
  this.tag(
    '<a href="#fn' +
      counter +
      '" class="footnote-ref" id="fnref' +
      counter +
      '" role="doc-noteref"><sup>'
  )
  this.raw(counter)
  this.tag('</sup></a>')
}
