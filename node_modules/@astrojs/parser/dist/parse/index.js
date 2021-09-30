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
  Parser: () => Parser,
  default: () => parse
});
var import_acorn = __toModule(require("acorn"));
var import_fragment = __toModule(require("./state/fragment.js"));
var import_patterns = __toModule(require("../utils/patterns.js"));
var import_names = __toModule(require("../utils/names.js"));
var import_full_char_code_at = __toModule(require("../utils/full_char_code_at.js"));
var import_error = __toModule(require("../utils/error.js"));
class Parser {
  constructor(template, options) {
    this.index = 0;
    this.stack = [];
    this.css = [];
    this.js = [];
    this.meta_tags = {};
    this.feature_flags = 0;
    if (typeof template !== "string") {
      throw new TypeError("Template must be a string");
    }
    this.template = template.replace(/\s+$/, "");
    this.filename = options.filename;
    this.customElement = options.customElement;
    this.html = {
      start: null,
      end: null,
      type: "Fragment",
      children: []
    };
    this.stack.push(this.html);
    let state = import_fragment.default;
    while (this.index < this.template.length) {
      state = state(this) || import_fragment.default;
    }
    if (this.stack.length > 1) {
      const current = this.current();
      const type = current.type === "Element" ? `<${current.name}>` : "Block";
      const slug = current.type === "Element" ? "element" : "block";
      this.error({
        code: `unclosed-${slug}`,
        message: `${type} was left open`
      }, current.start);
    }
    if (state !== import_fragment.default) {
      this.error({
        code: "unexpected-eof",
        message: "Unexpected end of input"
      });
    }
    if (this.html.children.length) {
      let start = this.html.children[0].start;
      while (import_patterns.whitespace.test(template[start]))
        start += 1;
      let end = this.html.children[this.html.children.length - 1].end;
      while (import_patterns.whitespace.test(template[end - 1]))
        end -= 1;
      this.html.start = start;
      this.html.end = end;
    } else {
      this.html.start = this.html.end = null;
    }
  }
  current() {
    return this.stack[this.stack.length - 1];
  }
  acorn_error(err) {
    this.error({
      code: "parse-error",
      message: err.message.replace(/ \(\d+:\d+\)$/, "")
    }, err.pos);
  }
  error({code, message}, index = this.index) {
    (0, import_error.default)(this.template, message, {
      name: "ParseError",
      code,
      source: this.template,
      start: index,
      filename: this.filename
    });
  }
  eat(str, required, message) {
    if (this.match(str)) {
      this.index += str.length;
      return true;
    }
    if (required) {
      this.error({
        code: `unexpected-${this.index === this.template.length ? "eof" : "token"}`,
        message: message || `Expected ${str}`
      });
    }
    return false;
  }
  match(str) {
    return this.template.slice(this.index, this.index + str.length) === str;
  }
  match_regex(pattern) {
    const match = pattern.exec(this.template.slice(this.index));
    if (!match || match.index !== 0)
      return null;
    return match[0];
  }
  allow_whitespace() {
    while (this.index < this.template.length && import_patterns.whitespace.test(this.template[this.index])) {
      this.index++;
    }
  }
  read(pattern) {
    const result = this.match_regex(pattern);
    if (result)
      this.index += result.length;
    return result;
  }
  read_identifier(allow_reserved = false) {
    const start = this.index;
    let i = this.index;
    const code = (0, import_full_char_code_at.default)(this.template, i);
    if (!(0, import_acorn.isIdentifierStart)(code, true))
      return null;
    i += code <= 65535 ? 1 : 2;
    while (i < this.template.length) {
      const code2 = (0, import_full_char_code_at.default)(this.template, i);
      if (!(0, import_acorn.isIdentifierChar)(code2, true))
        break;
      i += code2 <= 65535 ? 1 : 2;
    }
    const identifier = this.template.slice(this.index, this.index = i);
    if (!allow_reserved && import_names.reserved.has(identifier)) {
      this.error({
        code: "unexpected-reserved-word",
        message: `'${identifier}' is a reserved word in JavaScript and cannot be used here`
      }, start);
    }
    return identifier;
  }
  read_until(pattern) {
    if (this.index >= this.template.length) {
      this.error({
        code: "unexpected-eof",
        message: "Unexpected end of input"
      });
    }
    const start = this.index;
    const match = pattern.exec(this.template.slice(start));
    if (match) {
      this.index = start + match.index;
      return this.template.slice(start, this.index);
    }
    this.index = this.template.length;
    return this.template.slice(start);
  }
  require_whitespace() {
    if (!import_patterns.whitespace.test(this.template[this.index])) {
      this.error({
        code: "missing-whitespace",
        message: "Expected whitespace"
      });
    }
    this.allow_whitespace();
  }
}
function parse(template, options = {}) {
  const parser = new Parser(template, options);
  const astro_scripts = parser.js.filter((script) => script.context === "setup");
  if (astro_scripts.length > 1) {
    parser.error({
      code: "invalid-script",
      message: "A component can only have one frontmatter (---) script"
    }, astro_scripts[1].start);
  }
  return {
    html: parser.html,
    css: parser.css,
    module: astro_scripts[0],
    meta: {
      features: parser.feature_flags
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Parser
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3BhcnNlL2luZGV4LnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQSxtQkFBb0Q7QUFDcEQsc0JBQXFCO0FBQ3JCLHNCQUEyQjtBQUMzQixtQkFBeUI7QUFDekIsK0JBQThCO0FBRTlCLG1CQUFrQjtBQVVYLGFBQWE7QUFBQSxFQWVsQixZQUFZLFVBQWtCLFNBQXdCO0FBVnRELGlCQUFRO0FBQ1IsaUJBQXdCO0FBR3hCLGVBQWU7QUFDZixjQUFlO0FBQ2YscUJBQVk7QUFFWix5QkFBd0I7QUFHdEIsUUFBSSxPQUFPLGFBQWEsVUFBVTtBQUNoQyxZQUFNLElBQUksVUFBVTtBQUFBO0FBR3RCLFNBQUssV0FBVyxTQUFTLFFBQVEsUUFBUTtBQUN6QyxTQUFLLFdBQVcsUUFBUTtBQUN4QixTQUFLLGdCQUFnQixRQUFRO0FBRTdCLFNBQUssT0FBTztBQUFBLE1BQ1YsT0FBTztBQUFBLE1BQ1AsS0FBSztBQUFBLE1BQ0wsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBO0FBR1osU0FBSyxNQUFNLEtBQUssS0FBSztBQUVyQixRQUFJLFFBQXFCO0FBRXpCLFdBQU8sS0FBSyxRQUFRLEtBQUssU0FBUyxRQUFRO0FBQ3hDLGNBQVEsTUFBTSxTQUFTO0FBQUE7QUFHekIsUUFBSSxLQUFLLE1BQU0sU0FBUyxHQUFHO0FBQ3pCLFlBQU0sVUFBVSxLQUFLO0FBRXJCLFlBQU0sT0FBTyxRQUFRLFNBQVMsWUFBWSxJQUFJLFFBQVEsVUFBVTtBQUNoRSxZQUFNLE9BQU8sUUFBUSxTQUFTLFlBQVksWUFBWTtBQUV0RCxXQUFLLE1BQ0g7QUFBQSxRQUNFLE1BQU0sWUFBWTtBQUFBLFFBQ2xCLFNBQVMsR0FBRztBQUFBLFNBRWQsUUFBUTtBQUFBO0FBSVosUUFBSSxVQUFVLHlCQUFVO0FBQ3RCLFdBQUssTUFBTTtBQUFBLFFBQ1QsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBO0FBQUE7QUFJYixRQUFJLEtBQUssS0FBSyxTQUFTLFFBQVE7QUFDN0IsVUFBSSxRQUFRLEtBQUssS0FBSyxTQUFTLEdBQUc7QUFDbEMsYUFBTywyQkFBVyxLQUFLLFNBQVM7QUFBUyxpQkFBUztBQUVsRCxVQUFJLE1BQU0sS0FBSyxLQUFLLFNBQVMsS0FBSyxLQUFLLFNBQVMsU0FBUyxHQUFHO0FBQzVELGFBQU8sMkJBQVcsS0FBSyxTQUFTLE1BQU07QUFBSyxlQUFPO0FBRWxELFdBQUssS0FBSyxRQUFRO0FBQ2xCLFdBQUssS0FBSyxNQUFNO0FBQUEsV0FDWDtBQUNMLFdBQUssS0FBSyxRQUFRLEtBQUssS0FBSyxNQUFNO0FBQUE7QUFBQTtBQUFBLEVBSXRDLFVBQVU7QUFDUixXQUFPLEtBQUssTUFBTSxLQUFLLE1BQU0sU0FBUztBQUFBO0FBQUEsRUFHeEMsWUFBWSxLQUFVO0FBQ3BCLFNBQUssTUFDSDtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sU0FBUyxJQUFJLFFBQVEsUUFBUSxpQkFBaUI7QUFBQSxPQUVoRCxJQUFJO0FBQUE7QUFBQSxFQUlSLE1BQU0sQ0FBRSxNQUFNLFVBQThDLFFBQVEsS0FBSyxPQUFPO0FBQzlFLDhCQUFNLEtBQUssVUFBVSxTQUFTO0FBQUEsTUFDNUIsTUFBTTtBQUFBLE1BQ047QUFBQSxNQUNBLFFBQVEsS0FBSztBQUFBLE1BQ2IsT0FBTztBQUFBLE1BQ1AsVUFBVSxLQUFLO0FBQUE7QUFBQTtBQUFBLEVBSW5CLElBQUksS0FBYSxVQUFvQixTQUFrQjtBQUNyRCxRQUFJLEtBQUssTUFBTSxNQUFNO0FBQ25CLFdBQUssU0FBUyxJQUFJO0FBQ2xCLGFBQU87QUFBQTtBQUdULFFBQUksVUFBVTtBQUNaLFdBQUssTUFBTTtBQUFBLFFBQ1QsTUFBTSxjQUFjLEtBQUssVUFBVSxLQUFLLFNBQVMsU0FBUyxRQUFRO0FBQUEsUUFDbEUsU0FBUyxXQUFXLFlBQVk7QUFBQTtBQUFBO0FBSXBDLFdBQU87QUFBQTtBQUFBLEVBR1QsTUFBTSxLQUFhO0FBQ2pCLFdBQU8sS0FBSyxTQUFTLE1BQU0sS0FBSyxPQUFPLEtBQUssUUFBUSxJQUFJLFlBQVk7QUFBQTtBQUFBLEVBR3RFLFlBQVksU0FBaUI7QUFDM0IsVUFBTSxRQUFRLFFBQVEsS0FBSyxLQUFLLFNBQVMsTUFBTSxLQUFLO0FBQ3BELFFBQUksQ0FBQyxTQUFTLE1BQU0sVUFBVTtBQUFHLGFBQU87QUFFeEMsV0FBTyxNQUFNO0FBQUE7QUFBQSxFQUdmLG1CQUFtQjtBQUNqQixXQUFPLEtBQUssUUFBUSxLQUFLLFNBQVMsVUFBVSwyQkFBVyxLQUFLLEtBQUssU0FBUyxLQUFLLFNBQVM7QUFDdEYsV0FBSztBQUFBO0FBQUE7QUFBQSxFQUlULEtBQUssU0FBaUI7QUFDcEIsVUFBTSxTQUFTLEtBQUssWUFBWTtBQUNoQyxRQUFJO0FBQVEsV0FBSyxTQUFTLE9BQU87QUFDakMsV0FBTztBQUFBO0FBQUEsRUFHVCxnQkFBZ0IsaUJBQWlCLE9BQU87QUFDdEMsVUFBTSxRQUFRLEtBQUs7QUFFbkIsUUFBSSxJQUFJLEtBQUs7QUFFYixVQUFNLE9BQU8sc0NBQWtCLEtBQUssVUFBVTtBQUM5QyxRQUFJLENBQUMsb0NBQWtCLE1BQU07QUFBTyxhQUFPO0FBRTNDLFNBQUssUUFBUSxRQUFTLElBQUk7QUFFMUIsV0FBTyxJQUFJLEtBQUssU0FBUyxRQUFRO0FBQy9CLFlBQU0sUUFBTyxzQ0FBa0IsS0FBSyxVQUFVO0FBRTlDLFVBQUksQ0FBQyxtQ0FBaUIsT0FBTTtBQUFPO0FBQ25DLFdBQUssU0FBUSxRQUFTLElBQUk7QUFBQTtBQUc1QixVQUFNLGFBQWEsS0FBSyxTQUFTLE1BQU0sS0FBSyxPQUFRLEtBQUssUUFBUTtBQUVqRSxRQUFJLENBQUMsa0JBQWtCLHNCQUFTLElBQUksYUFBYTtBQUMvQyxXQUFLLE1BQ0g7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLFNBQVMsSUFBSTtBQUFBLFNBRWY7QUFBQTtBQUlKLFdBQU87QUFBQTtBQUFBLEVBR1QsV0FBVyxTQUFpQjtBQUMxQixRQUFJLEtBQUssU0FBUyxLQUFLLFNBQVMsUUFBUTtBQUN0QyxXQUFLLE1BQU07QUFBQSxRQUNULE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQTtBQUFBO0FBSWIsVUFBTSxRQUFRLEtBQUs7QUFDbkIsVUFBTSxRQUFRLFFBQVEsS0FBSyxLQUFLLFNBQVMsTUFBTTtBQUUvQyxRQUFJLE9BQU87QUFDVCxXQUFLLFFBQVEsUUFBUSxNQUFNO0FBQzNCLGFBQU8sS0FBSyxTQUFTLE1BQU0sT0FBTyxLQUFLO0FBQUE7QUFHekMsU0FBSyxRQUFRLEtBQUssU0FBUztBQUMzQixXQUFPLEtBQUssU0FBUyxNQUFNO0FBQUE7QUFBQSxFQUc3QixxQkFBcUI7QUFDbkIsUUFBSSxDQUFDLDJCQUFXLEtBQUssS0FBSyxTQUFTLEtBQUssU0FBUztBQUMvQyxXQUFLLE1BQU07QUFBQSxRQUNULE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQTtBQUFBO0FBSWIsU0FBSztBQUFBO0FBQUE7QUFTTSxlQUFlLFVBQWtCLFVBQXlCLElBQVM7QUFDaEYsUUFBTSxTQUFTLElBQUksT0FBTyxVQUFVO0FBSXBDLFFBQU0sZ0JBQWdCLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxPQUFPLFlBQVk7QUFFdEUsTUFBSSxjQUFjLFNBQVMsR0FBRztBQUM1QixXQUFPLE1BQ0w7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLFNBQVM7QUFBQSxPQUVYLGNBQWMsR0FBRztBQUFBO0FBY3JCLFNBQU87QUFBQSxJQUNMLE1BQU0sT0FBTztBQUFBLElBQ2IsS0FBSyxPQUFPO0FBQUEsSUFFWixRQUFRLGNBQWM7QUFBQSxJQUN0QixNQUFNO0FBQUEsTUFDSixVQUFVLE9BQU87QUFBQTtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
