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
  default: () => tag,
  read_sequence: () => read_sequence
});
var import_expression = __toModule(require("../read/expression.js"));
var import_style = __toModule(require("../read/style.js"));
var import_html = __toModule(require("../utils/html.js"));
var import_names = __toModule(require("../../utils/names.js"));
var import_fuzzymatch = __toModule(require("../../utils/fuzzymatch.js"));
var import_list = __toModule(require("../../utils/list.js"));
var import_features = __toModule(require("../utils/features.js"));
const valid_tag_name = /^\!?[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/;
const meta_tags = new Map([
  ["astro:head", "Head"],
  ["", "SlotTemplate"]
]);
const valid_meta_tags = Array.from(meta_tags.keys());
const specials = new Map([
  [
    "style",
    {
      read: import_style.default,
      property: "css"
    }
  ]
]);
const SELF = /^astro:self(?=[\s/>])/;
const COMPONENT = /^astro:component(?=[\s/>])/;
const SLOT = /^astro:fragment(?=[\s/>])/;
const HEAD = /^head(?=[\s/>])/;
const CUSTOM_ELEMENT = /-/;
function parent_is_head(stack) {
  let i = stack.length;
  while (i--) {
    const {type} = stack[i];
    if (type === "Head")
      return true;
    if (type === "Element" || type === "InlineComponent")
      return false;
  }
  return false;
}
function tag(parser) {
  const start = parser.index++;
  let parent = parser.current();
  if (parser.eat("!--")) {
    const data = parser.read_until(/-->/);
    parser.eat("-->", true, "comment was left open, expected -->");
    parser.current().children.push({
      start,
      end: parser.index,
      type: "Comment",
      data
    });
    return;
  }
  const is_closing_tag = parser.eat("/");
  const name = read_tag_name(parser);
  if (CUSTOM_ELEMENT.test(name)) {
    parser.feature_flags |= import_features.FEATURE_CUSTOM_ELEMENT;
  }
  if (meta_tags.has(name)) {
    const slug = meta_tags.get(name).toLowerCase();
    if (is_closing_tag) {
      if ((name === "astro:window" || name === "astro:body") && parser.current().children.length) {
        parser.error({
          code: `invalid-${slug}-content`,
          message: `<${name}> cannot have children`
        }, parser.current().children[0].start);
      }
    } else {
      if (name in parser.meta_tags) {
        parser.error({
          code: `duplicate-${slug}`,
          message: `A component can only have one <${name}> tag`
        }, start);
      }
      if (parser.stack.length > 1) {
        parser.error({
          code: `invalid-${slug}-placement`,
          message: `<${name}> tags cannot be inside elements or blocks`
        }, start);
      }
      parser.meta_tags[name] = true;
    }
  }
  const type = meta_tags.has(name) ? meta_tags.get(name) : /[A-Z]/.test(name[0]) || name === "astro:self" || name === "astro:component" ? "InlineComponent" : name === "" ? "SlotTemplate" : name === "title" && parent_is_head(parser.stack) ? "Title" : name === "slot" && !parser.customElement ? "Slot" : "Element";
  const element = {
    start,
    end: null,
    type,
    name,
    attributes: [],
    children: []
  };
  parser.allow_whitespace();
  if (is_closing_tag) {
    if ((0, import_names.is_void)(name)) {
      parser.error({
        code: "invalid-void-content",
        message: `<${name}> is a void element and cannot have children, or a closing tag`
      }, start);
    }
    parser.eat(">", true);
    while (parent.name !== name) {
      if (parent.type !== "Element") {
        const message = parser.last_auto_closed_tag && parser.last_auto_closed_tag.tag === name ? `</${name}> attempted to close <${name}> that was already automatically closed by <${parser.last_auto_closed_tag.reason}>` : `</${name}> attempted to close an element that was not open`;
        parser.error({
          code: "invalid-closing-tag",
          message
        }, start);
      }
      parent.end = start;
      parser.stack.pop();
      parent = parser.current();
    }
    parent.end = parser.index;
    parser.stack.pop();
    if (parser.last_auto_closed_tag && parser.stack.length < parser.last_auto_closed_tag.depth) {
      parser.last_auto_closed_tag = null;
    }
    return;
  } else if ((0, import_html.closing_tag_omitted)(parent.name, name)) {
    parent.end = start;
    parser.stack.pop();
    parser.last_auto_closed_tag = {
      tag: parent.name,
      reason: name,
      depth: parser.stack.length
    };
  }
  const unique_names = new Set();
  let attribute;
  while (attribute = read_attribute(parser, unique_names)) {
    element.attributes.push(attribute);
    parser.allow_whitespace();
  }
  if (name === "astro:component") {
    const index = element.attributes.findIndex((attr) => attr.type === "Attribute" && attr.name === "this");
    if (!~index) {
      parser.error({
        code: "missing-component-definition",
        message: "<astro:component> must have a 'this' attribute"
      }, start);
    }
    const definition = element.attributes.splice(index, 1)[0];
    if (definition.value === true || definition.value.length !== 1 || definition.value[0].type === "Text") {
      parser.error({
        code: "invalid-component-definition",
        message: "invalid component definition"
      }, definition.start);
    }
    element.expression = definition.value[0].expression;
  }
  if (specials.has(name) && parser.stack.length === 1) {
    const special = specials.get(name);
    parser.eat(">", true);
    const content = special.read(parser, start, element.attributes);
    if (content)
      parser[special.property].push(content);
    return;
  }
  parser.current().children.push(element);
  const self_closing = parser.eat("/") || (0, import_names.is_void)(name);
  parser.eat(">", true);
  if (self_closing) {
    element.end = parser.index;
  } else if (name === "textarea") {
    element.children = read_sequence(parser, () => parser.template.slice(parser.index, parser.index + 11) === "</textarea>");
    parser.read(/<\/textarea>/);
    element.end = parser.index;
  } else if (name === "script" || name === "style") {
    const start2 = parser.index;
    const data = parser.read_until(new RegExp(`</${name}>`));
    const end = parser.index;
    element.children.push({start: start2, end, type: "Text", data});
    parser.eat(`</${name}>`, true);
    element.end = parser.index;
  } else {
    parser.stack.push(element);
  }
}
function read_tag_name(parser) {
  const start = parser.index;
  if (parser.read(SELF)) {
    let i = parser.stack.length;
    let legal = false;
    while (i--) {
      const fragment = parser.stack[i];
      if (fragment.type === "IfBlock" || fragment.type === "EachBlock" || fragment.type === "InlineComponent") {
        legal = true;
        break;
      }
    }
    if (!legal) {
      parser.error({
        code: "invalid-self-placement",
        message: "<astro:self> components can only exist inside {#if} blocks, {#each} blocks, or slots passed to components"
      }, start);
    }
    return "astro:self";
  }
  if (parser.read(COMPONENT))
    return "astro:component";
  if (parser.read(SLOT))
    return "astro:fragment";
  if (parser.read(HEAD))
    return "head";
  const name = parser.read_until(/(\s|\/|>)/);
  if (meta_tags.has(name))
    return name;
  if (name.startsWith("astro:")) {
    const match = (0, import_fuzzymatch.default)(name.slice(7), valid_meta_tags);
    let message = `Valid <astro:...> tag names are ${(0, import_list.default)(valid_meta_tags)}`;
    if (match)
      message += ` (did you mean '${match}'?)`;
    parser.error({
      code: "invalid-tag-name",
      message
    }, start);
  }
  if (!valid_tag_name.test(name)) {
    parser.error({
      code: "invalid-tag-name",
      message: "Expected valid tag name"
    }, start);
  }
  return name;
}
function read_attribute(parser, unique_names) {
  const start = parser.index;
  function check_unique(name2) {
    if (unique_names.has(name2)) {
      parser.error({
        code: "duplicate-attribute",
        message: "Attributes need to be unique"
      }, start);
    }
    unique_names.add(name2);
  }
  if (parser.eat("{")) {
    parser.allow_whitespace();
    if (parser.eat("...")) {
      const expression = (0, import_expression.default)(parser);
      parser.allow_whitespace();
      parser.eat("}", true);
      return {
        start,
        end: parser.index,
        type: "Spread",
        expression
      };
    } else {
      const value_start = parser.index;
      const name2 = parser.read_identifier();
      parser.allow_whitespace();
      parser.eat("}", true);
      check_unique(name2);
      return {
        start,
        end: parser.index,
        type: "Attribute",
        name: name2,
        value: [
          {
            start: value_start,
            end: value_start + name2.length,
            type: "AttributeShorthand",
            expression: {
              start: value_start,
              end: value_start + name2.length,
              type: "Identifier",
              name: name2
            }
          }
        ]
      };
    }
  }
  const name = parser.read_until(/[\s=\/>"']/);
  if (!name)
    return null;
  let end = parser.index;
  parser.allow_whitespace();
  let value = true;
  if (parser.eat("=")) {
    parser.allow_whitespace();
    value = read_attribute_value(parser);
    end = parser.index;
  } else if (parser.match_regex(/["']/)) {
    parser.error({
      code: "unexpected-token",
      message: "Expected ="
    }, parser.index);
  }
  check_unique(name);
  return {
    start,
    end,
    type: "Attribute",
    name,
    value
  };
}
function read_attribute_value(parser) {
  const quote_mark = parser.eat("'") ? "'" : parser.eat('"') ? '"' : null;
  const regex = quote_mark === "'" ? /'/ : quote_mark === '"' ? /"/ : /(\/>|[\s"'=<>`])/;
  const value = read_sequence(parser, () => !!parser.match_regex(regex));
  if (quote_mark)
    parser.index += 1;
  return value;
}
function read_sequence(parser, done) {
  let current_chunk = {
    start: parser.index,
    end: null,
    type: "Text",
    raw: "",
    data: null
  };
  function flush() {
    if (current_chunk.raw) {
      current_chunk.data = (0, import_html.decode_character_references)(current_chunk.raw);
      current_chunk.end = parser.index;
      chunks.push(current_chunk);
    }
  }
  const chunks = [];
  while (parser.index < parser.template.length) {
    const index = parser.index;
    if (done()) {
      flush();
      return chunks;
    } else if (parser.eat("{")) {
      flush();
      parser.allow_whitespace();
      const expression = (0, import_expression.default)(parser);
      parser.allow_whitespace();
      parser.eat("}", true);
      chunks.push({
        start: index,
        end: parser.index,
        type: "MustacheTag",
        expression
      });
      current_chunk = {
        start: parser.index,
        end: null,
        type: "Text",
        raw: "",
        data: null
      };
    } else {
      current_chunk.raw += parser.template[parser.index++];
    }
  }
  parser.error({
    code: "unexpected-eof",
    message: "Unexpected end of input"
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  read_sequence
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3N0YXRlL3RhZy50cyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUEsd0JBQTRCO0FBQzVCLG1CQUF1QjtBQUN2QixrQkFBaUU7QUFDakUsbUJBQXdCO0FBR3hCLHdCQUF1QjtBQUN2QixrQkFBaUI7QUFDakIsc0JBQXVDO0FBRXZDLE1BQU0saUJBQWlCO0FBRXZCLE1BQU0sWUFBWSxJQUFJLElBQUk7QUFBQSxFQUN4QixDQUFDLGNBQWM7QUFBQSxFQUNmLENBQUMsSUFBSTtBQUFBO0FBTVAsTUFBTSxrQkFBa0IsTUFBTSxLQUFLLFVBQVU7QUFFN0MsTUFBTSxXQUFXLElBQUksSUFBSTtBQUFBLEVBU3ZCO0FBQUEsSUFDRTtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFLaEIsTUFBTSxPQUFPO0FBQ2IsTUFBTSxZQUFZO0FBQ2xCLE1BQU0sT0FBTztBQUNiLE1BQU0sT0FBTztBQUNiLE1BQU0saUJBQWlCO0FBRXZCLHdCQUF3QixPQUFPO0FBQzdCLE1BQUksSUFBSSxNQUFNO0FBQ2QsU0FBTyxLQUFLO0FBQ1YsVUFBTSxDQUFFLFFBQVMsTUFBTTtBQUN2QixRQUFJLFNBQVM7QUFBUSxhQUFPO0FBQzVCLFFBQUksU0FBUyxhQUFhLFNBQVM7QUFBbUIsYUFBTztBQUFBO0FBRS9ELFNBQU87QUFBQTtBQUdNLGFBQWEsUUFBZ0I7QUFDMUMsUUFBTSxRQUFRLE9BQU87QUFFckIsTUFBSSxTQUFTLE9BQU87QUFFcEIsTUFBSSxPQUFPLElBQUksUUFBUTtBQUNyQixVQUFNLE9BQU8sT0FBTyxXQUFXO0FBQy9CLFdBQU8sSUFBSSxPQUFPLE1BQU07QUFFeEIsV0FBTyxVQUFVLFNBQVMsS0FBSztBQUFBLE1BQzdCO0FBQUEsTUFDQSxLQUFLLE9BQU87QUFBQSxNQUNaLE1BQU07QUFBQSxN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
