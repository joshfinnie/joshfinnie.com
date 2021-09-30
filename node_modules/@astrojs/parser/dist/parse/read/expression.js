var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};
__markAsModule(exports);
__export(exports, {
  default: () => read_expression,
  parse_expression_at: () => parse_expression_at
});
var import__2 = __toModule(require("../index.js"));
function peek_char(state) {
  return state.source[state.index];
}
function peek_nonwhitespace(state) {
  let index = state.index;
  do {
    let char = state.source[index];
    if (!/\s/.test(char)) {
      return char;
    }
    index++;
  } while (index < state.source.length);
}
function next_char(state) {
  return state.source[state.index++];
}
function in_bounds(state) {
  return state.index < state.source.length;
}
function consume_string(state, stringChar) {
  let inEscape;
  do {
    const char = next_char(state);
    if (inEscape) {
      inEscape = false;
    } else if (char === "\\") {
      inEscape = true;
    } else if (char === stringChar) {
      break;
    }
  } while (in_bounds(state));
}
function consume_multiline_comment(state) {
  do {
    const char = next_char(state);
    if (char === "*" && peek_char(state) === "/") {
      break;
    }
  } while (in_bounds(state));
}
function consume_line_comment(state) {
  do {
    const char = next_char(state);
    if (char === "\n") {
      break;
    }
  } while (in_bounds(state));
}
const voidElements = new Set(["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]);
function consume_tag(state) {
  const start = state.index - 1;
  let tagName = "";
  let inTag = false;
  let inStart = true;
  let selfClosed = false;
  let inClose = false;
  let bracketIndex = 1;
  do {
    const char = next_char(state);
    switch (char) {
      case "'":
      case '"':
      case "`": {
        consume_string(state, char);
        break;
      }
      case "<": {
        inTag = false;
        tagName = "";
        if (peek_nonwhitespace(state) === "/") {
          inClose = true;
          bracketIndex--;
        } else {
          inStart = true;
          bracketIndex++;
        }
        break;
      }
      case ">": {
        if (!inStart && !inClose) {
          break;
        }
        bracketIndex--;
        const addExpectedBrackets = !voidElements.has(tagName.toLowerCase()) && !selfClosed && !inClose;
        if (addExpectedBrackets) {
          bracketIndex += 2;
        }
        inTag = false;
        selfClosed = false;
        inStart = false;
        inClose = false;
        break;
      }
      case " ": {
        inTag = true;
        break;
      }
      case "/": {
        if (inStart) {
          selfClosed = true;
        }
        break;
      }
      default: {
        if (!inTag) {
          tagName += char;
        }
        break;
      }
    }
    if (state.curlyCount <= 0) {
      break;
    }
    if (bracketIndex === 0) {
      break;
    }
  } while (in_bounds(state));
  const source = state.source.substring(start, state.index);
  const ast = (0, import__2.default)(source);
  state.parser.feature_flags |= ast.meta.features;
  const fragment = ast.html;
  return fragment;
}
function consume_expression(parser, source, start) {
  const expr = {
    type: "Expression",
    start,
    end: Number.NaN,
    codeChunks: [],
    children: []
  };
  let codeStart = start;
  const state = {
    source,
    start,
    index: start,
    curlyCount: 1,
    bracketCount: 0,
    root: expr,
    parser
  };
  do {
    const char = next_char(state);
    switch (char) {
      case "{": {
        state.curlyCount++;
        break;
      }
      case "}": {
        state.curlyCount--;
        break;
      }
      case "<": {
        const chunk = source.substring(codeStart, state.index - 1);
        expr.codeChunks.push(chunk);
        const tag = consume_tag(state);
        expr.children.push(tag);
        codeStart = state.index;
        break;
      }
      case "'":
      case '"':
      case "`": {
        consume_string(state, char);
        break;
      }
      case "/": {
        switch (peek_char(state)) {
          case "/": {
            consume_line_comment(state);
            break;
          }
          case "*": {
            consume_multiline_comment(state);
            break;
          }
        }
      }
    }
  } while (in_bounds(state) && state.curlyCount > 0);
  expr.end = state.index - 1;
  if (expr.children.length || !expr.codeChunks.length) {
    expr.codeChunks.push(source.substring(codeStart, expr.end));
  }
  return expr;
}
const parse_expression_at = (parser, source, index) => {
  const expression = consume_expression(parser, source, index);
  return expression;
};
function read_expression(parser) {
  try {
    const expression = parse_expression_at(parser, parser.template, parser.index);
    parser.index = expression.end;
    return expression;
  } catch (err) {
    parser.acorn_error(err);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parse_expression_at
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3JlYWQvZXhwcmVzc2lvbi50cyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUEsZ0JBQXVCO0FBWXZCLG1CQUFtQixPQUFtQjtBQUNwQyxTQUFPLE1BQU0sT0FBTyxNQUFNO0FBQUE7QUFHNUIsNEJBQTRCLE9BQW1CO0FBQzdDLE1BQUksUUFBUSxNQUFNO0FBQ2xCLEtBQUc7QUFDRCxRQUFJLE9BQU8sTUFBTSxPQUFPO0FBQ3hCLFFBQUksQ0FBQyxLQUFLLEtBQUssT0FBTztBQUNwQixhQUFPO0FBQUE7QUFFVDtBQUFBLFdBQ08sUUFBUSxNQUFNLE9BQU87QUFBQTtBQUdoQyxtQkFBbUIsT0FBbUI7QUFDcEMsU0FBTyxNQUFNLE9BQU8sTUFBTTtBQUFBO0FBRzVCLG1CQUFtQixPQUFtQjtBQUNwQyxTQUFPLE1BQU0sUUFBUSxNQUFNLE9BQU87QUFBQTtBQUdwQyx3QkFBd0IsT0FBbUIsWUFBb0I7QUFDN0QsTUFBSTtBQUNKLEtBQUc7QUFDRCxVQUFNLE9BQU8sVUFBVTtBQUV2QixRQUFJLFVBQVU7QUFDWixpQkFBVztBQUFBLGVBQ0YsU0FBUyxNQUFNO0FBQ3hCLGlCQUFXO0FBQUEsZUFDRixTQUFTLFlBQVk7QUFDOUI7QUFBQTtBQUFBLFdBRUssVUFBVTtBQUFBO0FBR3JCLG1DQUFtQyxPQUFtQjtBQUNwRCxLQUFHO0FBQ0QsVUFBTSxPQUFPLFVBQVU7QUFFdkIsUUFBSSxTQUFTLE9BQU8sVUFBVSxXQUFXLEtBQUs7QUFDNUM7QUFBQTtBQUFBLFdBRUssVUFBVTtBQUFBO0FBR3JCLDhCQUE4QixPQUFtQjtBQUMvQyxLQUFHO0FBQ0QsVUFBTSxPQUFPLFVBQVU7QUFDdkIsUUFBSSxTQUFTLE1BQU07QUFDakI7QUFBQTtBQUFBLFdBRUssVUFBVTtBQUFBO0FBR3JCLE1BQU0sZUFBZSxJQUFJLElBQUksQ0FBQyxRQUFRLFFBQVEsTUFB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
