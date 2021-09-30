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
  default: () => mustache
});
var import_context = __toModule(require("../read/context.js"));
var import_expression = __toModule(require("../read/expression.js"));
var import_html = __toModule(require("../utils/html.js"));
var import_patterns = __toModule(require("../../utils/patterns.js"));
var import_node = __toModule(require("../utils/node.js"));
function trim_whitespace(block, trim_before, trim_after) {
  if (!block.children || block.children.length === 0)
    return;
  const first_child = block.children[0];
  const last_child = block.children[block.children.length - 1];
  if (first_child.type === "Text" && trim_before) {
    first_child.data = first_child.data.trimStart();
    if (!first_child.data)
      block.children.shift();
  }
  if (last_child.type === "Text" && trim_after) {
    last_child.data = last_child.data.trimEnd();
    if (!last_child.data)
      block.children.pop();
  }
  if (block.else) {
    trim_whitespace(block.else, trim_before, trim_after);
  }
  if (first_child.elseif) {
    trim_whitespace(first_child, trim_before, trim_after);
  }
}
function mustache(parser) {
  const start = parser.index;
  parser.index += 1;
  parser.allow_whitespace();
  if (parser.eat("/")) {
    let block = parser.current();
    let expected;
    if ((0, import_html.closing_tag_omitted)(block.name)) {
      block.end = start;
      parser.stack.pop();
      block = parser.current();
    }
    if (block.type === "ElseBlock" || block.type === "PendingBlock" || block.type === "ThenBlock" || block.type === "CatchBlock") {
      block.end = start;
      parser.stack.pop();
      block = parser.current();
      expected = "await";
    }
    if (block.type === "IfBlock") {
      expected = "if";
    } else if (block.type === "EachBlock") {
      expected = "each";
    } else if (block.type === "AwaitBlock") {
      expected = "await";
    } else if (block.type === "KeyBlock") {
      expected = "key";
    } else {
      parser.error({
        code: "unexpected-block-close",
        message: "Unexpected block closing tag"
      });
    }
    parser.eat(expected, true);
    parser.allow_whitespace();
    parser.eat("}", true);
    while (block.elseif) {
      block.end = parser.index;
      parser.stack.pop();
      block = parser.current();
      if (block.else) {
        block.else.end = start;
      }
    }
    const char_before = parser.template[block.start - 1];
    const char_after = parser.template[parser.index];
    const trim_before = !char_before || import_patterns.whitespace.test(char_before);
    const trim_after = !char_after || import_patterns.whitespace.test(char_after);
    trim_whitespace(block, trim_before, trim_after);
    block.end = parser.index;
    parser.stack.pop();
  } else if (parser.eat(":else")) {
    if (parser.eat("if")) {
      parser.error({
        code: "invalid-elseif",
        message: "'elseif' should be 'else if'"
      });
    }
    parser.allow_whitespace();
    if (parser.eat("if")) {
      const block = parser.current();
      if (block.type !== "IfBlock") {
        parser.error({
          code: "invalid-elseif-placement",
          message: parser.stack.some((block2) => block2.type === "IfBlock") ? `Expected to close ${(0, import_node.to_string)(block)} before seeing {:else if ...} block` : "Cannot have an {:else if ...} block outside an {#if ...} block"
        });
      }
      parser.require_whitespace();
      const expression = (0, import_expression.default)(parser);
      parser.allow_whitespace();
      parser.eat("}", true);
      block.else = {
        start: parser.index,
        end: null,
        type: "ElseBlock",
        children: [
          {
            start: parser.index,
            end: null,
            type: "IfBlock",
            elseif: true,
            expression,
            children: []
          }
        ]
      };
      parser.stack.push(block.else.children[0]);
    } else {
      const block = parser.current();
      if (block.type !== "IfBlock" && block.type !== "EachBlock") {
        parser.error({
          code: "invalid-else-placement",
          message: parser.stack.some((block2) => block2.type === "IfBlock" || block2.type === "EachBlock") ? `Expected to close ${(0, import_node.to_string)(block)} before seeing {:else} block` : "Cannot have an {:else} block outside an {#if ...} or {#each ...} block"
        });
      }
      parser.allow_whitespace();
      parser.eat("}", true);
      block.else = {
        start: parser.index,
        end: null,
        type: "ElseBlock",
        children: []
      };
      parser.stack.push(block.else);
    }
  } else if (parser.match(":then") || parser.match(":catch")) {
    const block = parser.current();
    const is_then = parser.eat(":then") || !parser.eat(":catch");
    if (is_then) {
      if (block.type !== "PendingBlock") {
        parser.error({
          code: "invalid-then-placement",
          message: parser.stack.some((block2) => block2.type === "PendingBlock") ? `Expected to close ${(0, import_node.to_string)(block)} before seeing {:then} block` : "Cannot have an {:then} block outside an {#await ...} block"
        });
      }
    } else {
      if (block.type !== "ThenBlock" && block.type !== "PendingBlock") {
        parser.error({
          code: "invalid-catch-placement",
          message: parser.stack.some((block2) => block2.type === "ThenBlock" || block2.type === "PendingBlock") ? `Expected to close ${(0, import_node.to_string)(block)} before seeing {:catch} block` : "Cannot have an {:catch} block outside an {#await ...} block"
        });
      }
    }
    block.end = start;
    parser.stack.pop();
    const await_block = parser.current();
    if (!parser.eat("}")) {
      parser.require_whitespace();
      await_block[is_then ? "value" : "error"] = (0, import_context.default)(parser);
      parser.allow_whitespace();
      parser.eat("}", true);
    }
    const new_block = {
      start,
      end: null,
      type: is_then ? "ThenBlock" : "CatchBlock",
      children: [],
      skip: false
    };
    await_block[is_then ? "then" : "catch"] = new_block;
    parser.stack.push(new_block);
  } else if (parser.eat("#")) {
    let type;
    if (parser.eat("if")) {
      type = "IfBlock";
    } else if (parser.eat("each")) {
      type = "EachBlock";
    } else if (parser.eat("await")) {
      type = "AwaitBlock";
    } else if (parser.eat("key")) {
      type = "KeyBlock";
    } else {
      parser.error({
        code: "expected-block-type",
        message: "Expected if, each, await or key"
      });
    }
    parser.require_whitespace();
    const expression = (0, import_expression.default)(parser);
    const block = type === "AwaitBlock" ? {
      start,
      end: null,
      type,
      expression,
      value: null,
      error: null,
      pending: {
        start: null,
        end: null,
        type: "PendingBlock",
        children: [],
        skip: true
      },
      then: {
        start: null,
        end: null,
        type: "ThenBlock",
        children: [],
        skip: true
      },
      catch: {
        start: null,
        end: null,
        type: "CatchBlock",
        children: [],
        skip: true
      }
    } : {
      start,
      end: null,
      type,
      expression,
      children: []
    };
    parser.allow_whitespace();
    if (type === "EachBlock") {
      parser.eat("as", true);
      parser.require_whitespace();
      block.context = (0, import_context.default)(parser);
      parser.allow_whitespace();
      if (parser.eat(",")) {
        parser.allow_whitespace();
        block.index = parser.read_identifier();
        if (!block.index) {
          parser.error({
            code: "expected-name",
            message: "Expected name"
          });
        }
        parser.allow_whitespace();
      }
      if (parser.eat("(")) {
        parser.allow_whitespace();
        block.key = (0, import_expression.default)(parser);
        parser.allow_whitespace();
        parser.eat(")", true);
        parser.allow_whitespace();
      }
    }
    const await_block_shorthand = type === "AwaitBlock" && parser.eat("then");
    if (await_block_shorthand) {
      parser.require_whitespace();
      block.value = (0, import_context.default)(parser);
      parser.allow_whitespace();
    }
    const await_block_catch_shorthand = !await_block_shorthand && type === "AwaitBlock" && parser.eat("catch");
    if (await_block_catch_shorthand) {
      parser.require_whitespace();
      block.error = (0, import_context.default)(parser);
      parser.allow_whitespace();
    }
    parser.eat("}", true);
    parser.current().children.push(block);
    parser.stack.push(block);
    if (type === "AwaitBlock") {
      let child_block;
      if (await_block_shorthand) {
        block.then.skip = false;
        child_block = block.then;
      } else if (await_block_catch_shorthand) {
        block.catch.skip = false;
        child_block = block.catch;
      } else {
        block.pending.skip = false;
        child_block = block.pending;
      }
      child_block.start = parser.index;
      parser.stack.push(child_block);
    }
  } else if (parser.eat("@html")) {
    parser.require_whitespace();
    const expression = (0, import_expression.default)(parser);
    parser.allow_whitespace();
    parser.eat("}", true);
    parser.current().children.push({
      start,
      end: parser.index,
      type: "RawMustacheTag",
      expression
    });
  } else if (parser.eat("@debug")) {
    throw new Error("@debug not yet supported");
  } else {
    const expression = (0, import_expression.default)(parser);
    parser.allow_whitespace();
    parser.eat("}", true);
    parser.current().children.push({
      start,
      end: parser.index,
      type: "MustacheTag",
      expression
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3N0YXRlL211c3RhY2hlLnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBQXlCO0FBQ3pCLHdCQUE0QjtBQUM1QixrQkFBb0M7QUFDcEMsc0JBQTJCO0FBQzNCLGtCQUEwQjtBQU0xQix5QkFBeUIsT0FBcUIsYUFBc0IsWUFBcUI7QUFDdkYsTUFBSSxDQUFDLE1BQU0sWUFBWSxNQUFNLFNBQVMsV0FBVztBQUFHO0FBRXBELFFBQU0sY0FBYyxNQUFNLFNBQVM7QUFDbkMsUUFBTSxhQUFhLE1BQU0sU0FBUyxNQUFNLFNBQVMsU0FBUztBQUUxRCxNQUFJLFlBQVksU0FBUyxVQUFVLGFBQWE7QUFDOUMsZ0JBQVksT0FBTyxZQUFZLEtBQUs7QUFDcEMsUUFBSSxDQUFDLFlBQVk7QUFBTSxZQUFNLFNBQVM7QUFBQTtBQUd4QyxNQUFJLFdBQVcsU0FBUyxVQUFVLFlBQVk7QUFDNUMsZUFBVyxPQUFPLFdBQVcsS0FBSztBQUNsQyxRQUFJLENBQUMsV0FBVztBQUFNLFlBQU0sU0FBUztBQUFBO0FBR3ZDLE1BQUksTUFBTSxNQUFNO0FBQ2Qsb0JBQWdCLE1BQU0sTUFBTSxhQUFhO0FBQUE7QUFHM0MsTUFBSSxZQUFZLFFBQVE7QUFDdEIsb0JBQWdCLGFBQWEsYUFBYTtBQUFBO0FBQUE7QUFJL0Isa0JBQWtCLFFBQWdCO0FBQy9DLFFBQU0sUUFBUSxPQUFPO0FBQ3JCLFNBQU8sU0FBUztBQUVoQixTQUFPO0FBR1AsTUFBSSxPQUFPLElBQUksTUFBTTtBQUNuQixRQUFJLFFBQVEsT0FBTztBQUNuQixRQUFJO0FBRUosUUFBSSxxQ0FBb0IsTUFBTSxPQUFPO0FBQ25DLFlBQU0sTUFBTTtBQUNaLGFBQU8sTUFBTTtBQUNiLGNBQVEsT0FBTztBQUFBO0FBR2pCLFFBQUksTUFBTSxTQUFTLGVBQWUsTUFBTSxTQUFTLGtCQUFrQixNQUFNLFNBQVMsZUFB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
