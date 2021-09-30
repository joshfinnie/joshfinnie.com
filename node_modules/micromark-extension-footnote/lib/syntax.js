/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').Token} Token
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').Exiter} Exiter
 * @typedef {import('micromark-util-types').State} State
 */

/**
 * @typedef Options
 * @property {boolean} [inlineNotes=false]
 *   Whether to support `^[inline notes]` (`boolean`, default: `false`).
 */
import {blankLine} from 'micromark-core-commonmark'
import {factorySpace} from 'micromark-factory-space'
import {
  markdownLineEnding,
  markdownLineEndingOrSpace,
  markdownSpace
} from 'micromark-util-character'
import {splice} from 'micromark-util-chunked'
import {normalizeIdentifier} from 'micromark-util-normalize-identifier'
import {resolveAll} from 'micromark-util-resolve-all'
const indent = {
  tokenize: tokenizeIndent,
  partial: true
}
/**
 * @param {Options} options
 * @returns {Extension}
 */

export function footnote(options = {}) {
  const call = {
    tokenize: tokenizeFootnoteCall
  }
  const noteStart = {
    tokenize: tokenizeNoteStart,
    resolveAll: resolveAllNote
  }
  const noteEnd = {
    add: 'after',
    tokenize: tokenizeNoteEnd,
    resolveAll: resolveAllNote,
    resolveTo: resolveToNoteEnd
  }
  const definition = {
    tokenize: tokenizeDefinitionStart,
    continuation: {
      tokenize: tokenizeDefinitionContinuation
    },
    exit: footnoteDefinitionEnd
  }
  const text = {
    [91]: call
  }

  if (options.inlineNotes) {
    text[93] = noteEnd
    text[94] = noteStart
  }
  /** @type {Extension} */

  return {
    _hiddenFootnoteSupport: {},
    document: {
      [91]: definition
    },
    text
  }
}
/**
 * Remove remaining note starts.
 *
 * @type {Resolver}
 */

function resolveAllNote(events) {
  let index = -1
  /** @type {Token} */

  let token

  while (++index < events.length) {
    token = events[index][1]

    if (events[index][0] === 'enter' && token.type === 'inlineNoteStart') {
      token.type = 'data' // Remove the two marker (`^[`).

      events.splice(index + 1, 4)
    }
  }

  return events
}
/** @type {Resolver} */

function resolveToNoteEnd(events, context) {
  let index = events.length - 4
  /** @type {Token} */

  let token
  /** @type {number} */

  let openIndex // Find an opening.

  while (index--) {
    token = events[index][1] // Find where the note starts.

    if (events[index][0] === 'enter' && token.type === 'inlineNoteStart') {
      openIndex = index
      break
    }
  } // @ts-expect-error It’s fine.

  /** @type {Token} */
  const group = {
    type: 'inlineNote',
    start: Object.assign({}, events[openIndex][1].start),
    end: Object.assign({}, events[events.length - 1][1].end)
  }
  const text = {
    type: 'inlineNoteText',
    start: Object.assign({}, events[openIndex + 4][1].end),
    end: Object.assign({}, events[events.length - 3][1].start)
  }
  const note = [
    ['enter', group, context],
    events[openIndex + 1],
    events[openIndex + 2],
    events[openIndex + 3],
    events[openIndex + 4],
    ['enter', text, context]
  ]
  splice(
    note,
    note.length,
    0,
    resolveAll(
      context.parser.constructs.insideSpan.null,
      events.slice(openIndex + 6, -4),
      context
    )
  )
  note.push(
    ['exit', text, context],
    events[events.length - 2],
    events[events.length - 3],
    ['exit', group, context]
  )
  splice(events, index, events.length - index, note)
  return events
}
/** @type {Tokenizer} */

function tokenizeFootnoteCall(effects, ok, nok) {
  const self = this
  /** @type {string[]} */
  // @ts-expect-error It’s fine!

  const defined = self.parser.footnotes || (self.parser.footnotes = [])
  let size = 0
  /** @type {boolean} */

  let data
  return start
  /** @type {State} */

  function start(code) {
    effects.enter('footnoteCall')
    effects.enter('footnoteCallLabelMarker')
    effects.consume(code)
    effects.exit('footnoteCallLabelMarker')
    return callStart
  }
  /** @type {State} */

  function callStart(code) {
    if (code !== 94) return nok(code)
    effects.enter('footnoteCallMarker')
    effects.consume(code)
    effects.exit('footnoteCallMarker')
    effects.enter('footnoteCallString')
    effects.enter('chunkString').contentType = 'string'
    return callData
  }
  /** @type {State} */

  function callData(code) {
    /** @type {Token} */
    let token

    if (code === null || code === 91 || size++ > 999) {
      return nok(code)
    }

    if (code === 93) {
      if (!data) {
        return nok(code)
      }

      effects.exit('chunkString')
      token = effects.exit('footnoteCallString')
      return defined.includes(normalizeIdentifier(self.sliceSerialize(token)))
        ? end(code)
        : nok(code)
    }

    effects.consume(code)

    if (!markdownLineEndingOrSpace(code)) {
      data = true
    }

    return code === 92 ? callEscape : callData
  }
  /** @type {State} */

  function callEscape(code) {
    if (code === 91 || code === 92 || code === 93) {
      effects.consume(code)
      size++
      return callData
    }

    return callData(code)
  }
  /** @type {State} */

  function end(code) {
    // Always a `]`.
    effects.enter('footnoteCallLabelMarker')
    effects.consume(code)
    effects.exit('footnoteCallLabelMarker')
    effects.exit('footnoteCall')
    return ok
  }
}
/** @type {Tokenizer} */

function tokenizeNoteStart(effects, ok, nok) {
  return start
  /** @type {State} */

  function start(code) {
    effects.enter('inlineNoteStart')
    effects.enter('inlineNoteMarker')
    effects.consume(code)
    effects.exit('inlineNoteMarker')
    return noteStart
  }
  /** @type {State} */

  function noteStart(code) {
    if (code !== 91) return nok(code)
    effects.enter('inlineNoteStartMarker')
    effects.consume(code)
    effects.exit('inlineNoteStartMarker')
    effects.exit('inlineNoteStart')
    return ok
  }
}
/** @type {Tokenizer} */

function tokenizeNoteEnd(effects, ok, nok) {
  const self = this
  return start
  /** @type {State} */

  function start(code) {
    let index = self.events.length
    /** @type {boolean|undefined} */

    let hasStart // Find an opening.

    while (index--) {
      if (self.events[index][1].type === 'inlineNoteStart') {
        hasStart = true
        break
      }
    }

    if (!hasStart) {
      return nok(code)
    }

    effects.enter('inlineNoteEnd')
    effects.enter('inlineNoteEndMarker')
    effects.consume(code)
    effects.exit('inlineNoteEndMarker')
    effects.exit('inlineNoteEnd')
    return ok
  }
}
/** @type {Tokenizer} */

function tokenizeDefinitionStart(effects, ok, nok) {
  const self = this
  /** @type {string[]} */
  // @ts-expect-error It’s fine!

  const defined = self.parser.footnotes || (self.parser.footnotes = [])
  /** @type {string} */

  let identifier
  let size = 0
  /** @type {boolean|undefined} */

  let data
  return start
  /** @type {State} */

  function start(code) {
    effects.enter('footnoteDefinition')._container = true
    effects.enter('footnoteDefinitionLabel')
    effects.enter('footnoteDefinitionLabelMarker')
    effects.consume(code)
    effects.exit('footnoteDefinitionLabelMarker')
    return labelStart
  }
  /** @type {State} */

  function labelStart(code) {
    // `^`
    if (code !== 94) return nok(code)
    effects.enter('footnoteDefinitionMarker')
    effects.consume(code)
    effects.exit('footnoteDefinitionMarker')
    effects.enter('footnoteDefinitionLabelString')
    return atBreak
  }
  /** @type {State} */

  function atBreak(code) {
    /** @type {Token} */
    let token

    if (code === null || code === 91 || size > 999) {
      return nok(code)
    }

    if (code === 93) {
      if (!data) {
        return nok(code)
      }

      token = effects.exit('footnoteDefinitionLabelString')
      identifier = normalizeIdentifier(self.sliceSerialize(token))
      effects.enter('footnoteDefinitionLabelMarker')
      effects.consume(code)
      effects.exit('footnoteDefinitionLabelMarker')
      effects.exit('footnoteDefinitionLabel')
      return labelAfter
    }

    if (markdownLineEnding(code)) {
      effects.enter('lineEnding')
      effects.consume(code)
      effects.exit('lineEnding')
      size++
      return atBreak
    }

    effects.enter('chunkString').contentType = 'string'
    return label(code)
  }
  /** @type {State} */

  function label(code) {
    if (
      code === null ||
      markdownLineEnding(code) ||
      code === 91 ||
      code === 93 ||
      size > 999
    ) {
      effects.exit('chunkString')
      return atBreak(code)
    }

    if (!markdownLineEndingOrSpace(code)) {
      data = true
    }

    size++
    effects.consume(code)
    return code === 92 ? labelEscape : label
  }
  /** @type {State} */

  function labelEscape(code) {
    if (code === 91 || code === 92 || code === 93) {
      effects.consume(code)
      size++
      return label
    }

    return label(code)
  }
  /** @type {State} */

  function labelAfter(code) {
    if (code !== 58) {
      return nok(code)
    }

    effects.enter('definitionMarker')
    effects.consume(code)
    effects.exit('definitionMarker')
    return effects.check(blankLine, onBlank, nonBlank)
  }
  /** @type {State} */

  function onBlank(code) {
    // @ts-expect-error: It’s fine.
    self.containerState.initialBlankLine = true
    return done(code)
  }
  /** @type {State} */

  function nonBlank(code) {
    if (markdownSpace(code)) {
      effects.enter('footnoteDefinitionWhitespace')
      effects.consume(code)
      effects.exit('footnoteDefinitionWhitespace')
      return done(code)
    } // No space is also fine, just like a block quote marker.

    return done(code)
  }
  /** @type {State} */

  function done(code) {
    if (!defined.includes(identifier)) {
      defined.push(identifier)
    }

    return ok(code)
  }
}
/** @type {Tokenizer} */

function tokenizeDefinitionContinuation(effects, ok, nok) {
  const self = this
  return effects.check(blankLine, onBlank, notBlank) // Continued blank lines are fine.

  /** @type {State} */

  function onBlank(code) {
    // @ts-expect-error: It’s fine.
    if (self.containerState.initialBlankLine) {
      // @ts-expect-error: It’s fine.
      self.containerState.furtherBlankLines = true
    }

    return ok(code)
  } // If there were continued blank lines, or this isn’t indented at all.

  /** @type {State} */

  function notBlank(code) {
    // @ts-expect-error: It’s fine.
    if (self.containerState.furtherBlankLines || !markdownSpace(code)) {
      return nok(code)
    } // @ts-expect-error: It’s fine.

    self.containerState.initialBlankLine = undefined // @ts-expect-error: It’s fine.

    self.containerState.furtherBlankLines = undefined
    return effects.attempt(indent, ok, nok)(code)
  }
}
/** @type {Exiter} */

function footnoteDefinitionEnd(effects) {
  effects.exit('footnoteDefinition')
}
/** @type {Tokenizer} */

function tokenizeIndent(effects, ok, nok) {
  const self = this
  return factorySpace(effects, afterPrefix, 'footnoteDefinitionIndent', 4 + 1)
  /** @type {State} */

  function afterPrefix(code) {
    const tail = self.events[self.events.length - 1]
    return tail &&
      tail[1].type === 'footnoteDefinitionIndent' &&
      tail[2].sliceSerialize(tail[1], true).length === 4
      ? ok(code)
      : nok(code)
  }
}
