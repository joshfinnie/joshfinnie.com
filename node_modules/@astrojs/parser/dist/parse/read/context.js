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
  default: () => read_context
});
var import_acorn = __toModule(require("acorn"));
var import_full_char_code_at = __toModule(require("../../utils/full_char_code_at.js"));
var import_bracket = __toModule(require("../utils/bracket.js"));
var import_expression = __toModule(require("./expression.js"));
function read_context(parser) {
  const start = parser.index;
  let i = parser.index;
  const code = (0, import_full_char_code_at.default)(parser.template, i);
  if ((0, import_acorn.isIdentifierStart)(code, true)) {
    return {
      type: "Identifier",
      name: parser.read_identifier(),
      start,
      end: parser.index
    };
  }
  if (!(0, import_bracket.is_bracket_open)(code)) {
    parser.error({
      code: "unexpected-token",
      message: "Expected identifier or destructure pattern"
    });
  }
  const bracket_stack = [code];
  i += code <= 65535 ? 1 : 2;
  while (i < parser.template.length) {
    const code2 = (0, import_full_char_code_at.default)(parser.template, i);
    if ((0, import_bracket.is_bracket_open)(code2)) {
      bracket_stack.push(code2);
    } else if ((0, import_bracket.is_bracket_close)(code2)) {
      if (!(0, import_bracket.is_bracket_pair)(bracket_stack[bracket_stack.length - 1], code2)) {
        parser.error({
          code: "unexpected-token",
          message: `Expected ${String.fromCharCode((0, import_bracket.get_bracket_close)(bracket_stack[bracket_stack.length - 1]))}`
        });
      }
      bracket_stack.pop();
      if (bracket_stack.length === 0) {
        i += code2 <= 65535 ? 1 : 2;
        break;
      }
    }
    i += code2 <= 65535 ? 1 : 2;
  }
  parser.index = i;
  const pattern_string = parser.template.slice(start, i);
  try {
    let space_with_newline = parser.template.slice(0, start).replace(/[^\n]/g, " ");
    const first_space = space_with_newline.indexOf(" ");
    space_with_newline = space_with_newline.slice(0, first_space) + space_with_newline.slice(first_space + 1);
    return (0, import_expression.parse_expression_at)(`${space_with_newline}(${pattern_string} = 1)`, start - 1).left;
  } catch (error) {
    parser.acorn_error(error);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3JlYWQvY29udGV4dC50cyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLG1CQUFrQztBQUNsQywrQkFBOEI7QUFDOUIscUJBQXNGO0FBQ3RGLHdCQUFvQztBQUdyQixzQkFBc0IsUUFBMEQ7QUFDN0YsUUFBTSxRQUFRLE9BQU87QUFDckIsTUFBSSxJQUFJLE9BQU87QUFFZixRQUFNLE9BQU8sc0NBQWtCLE9BQU8sVUFBVTtBQUNoRCxNQUFJLG9DQUFrQixNQUFNLE9BQU87QUFDakMsV0FBTztBQUFBLE1BQ0wsTUFBTTtBQUFBLE1BQ04sTUFBTSxPQUFPO0FBQUEsTUFDYjtBQUFBLE1BQ0EsS0FBSyxPQUFPO0FBQUE7QUFBQTtBQUloQixNQUFJLENBQUMsb0NBQWdCLE9BQU87QUFDMUIsV0FBTyxNQUFNO0FBQUEsTUFDWCxNQUFNO0FBQUEsTUFDTixTQUFTO0FBQUE7QUFBQTtBQUliLFFBQU0sZ0JBQWdCLENBQUM7QUFDdkIsT0FBSyxRQUFRLFFBQVMsSUFBSTtBQUUxQixTQUFPLElBQUksT0FBTyxTQUFTLFFBQVE7QUFDakMsVUFBTSxRQUFPLHNDQUFrQixPQUFPLFVBQVU7QUFDaEQsUUFBSSxvQ0FBZ0IsUUFBTztBQUN6QixvQkFBYyxLQUFLO0FBQUEsZUFDVixxQ0FBaUIsUUFBTztBQUNqQyxVQUFJLENBQUMsb0NBQWdCLGNBQWMsY0FBYyxTQUFTLElBQUksUUFBTztBQUNuRSxlQUFPLE1BQU07QUFBQSxVQUNYLE1BQU07QUFBQSxVQUNOLFNBQVMsWUFBWSxPQUFPLGFBQWEsc0NBQWtCLGNBQWMsY0FBYyxTQUFTO0FBQUE7QUFBQTtBQUdwRyxvQkFBYztBQUNkLFVBQUksY0FBYyxXQUFXLEdBQUc7QUFDOUIsYUFBSyxTQUFRLFFBQVMsSUFBSTtBQUMxQjtBQUFBO0FBQUE7QUFHSixTQUFLLFNBQVEsUUFBUyxJQUFJO0FBQUE7QUFHNUIsU0FBTyxRQUFRO0FBRWYsUUFBTSxpQkFBaUIsT0FBTyxTQUFTLE1BQU0sT0FBTztBQUNwRCxNQUFJO0FBT0YsUUFBSSxxQkFBcUIsT0FBTyxTQUFTLE1BQU0sR0FBRyxPQUFPLFFBQVEsVUFBVTtBQUMzRSxVQUFNLGNBQWMsbUJBQW1CLFFBQVE7QUFDL0MseUJBQXFCLG1CQUFtQixNQUFNLEdBQUcsZUFBZSxtQkFBbUIsTUFBTSxjQUFjO0FBRXZHLFdBQVEsMkNBQW9CLEdBQUcsc0JBQXNCLHVCQUF1QixRQUFRLEdBQVc7QUFBQSxXQUN4RixPQUFQO0FBQ0EsV0FBTyxZQUFZO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
