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
  globals: () => globals,
  is_valid: () => is_valid,
  is_void: () => is_void,
  reserved: () => reserved,
  sanitize: () => sanitize
});
var import_acorn = __toModule(require("acorn"));
var import_full_char_code_at = __toModule(require("./full_char_code_at.js"));
const globals = new Set([
  "alert",
  "Array",
  "Boolean",
  "clearInterval",
  "clearTimeout",
  "confirm",
  "console",
  "Date",
  "decodeURI",
  "decodeURIComponent",
  "document",
  "Element",
  "encodeURI",
  "encodeURIComponent",
  "Error",
  "EvalError",
  "Event",
  "EventSource",
  "fetch",
  "global",
  "globalThis",
  "history",
  "Infinity",
  "InternalError",
  "Intl",
  "isFinite",
  "isNaN",
  "JSON",
  "localStorage",
  "location",
  "Map",
  "Math",
  "NaN",
  "navigator",
  "Number",
  "Node",
  "Object",
  "parseFloat",
  "parseInt",
  "process",
  "Promise",
  "prompt",
  "RangeError",
  "ReferenceError",
  "RegExp",
  "sessionStorage",
  "Set",
  "setInterval",
  "setTimeout",
  "String",
  "SyntaxError",
  "TypeError",
  "undefined",
  "URIError",
  "URL",
  "window"
]);
const reserved = new Set([
  "arguments",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield"
]);
const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(name) {
  return void_element_names.test(name) || name.toLowerCase() === "!doctype";
}
function is_valid(str) {
  let i = 0;
  while (i < str.length) {
    const code = (0, import_full_char_code_at.default)(str, i);
    if (!(i === 0 ? import_acorn.isIdentifierStart : import_acorn.isIdentifierChar)(code, true))
      return false;
    i += code <= 65535 ? 1 : 2;
  }
  return true;
}
function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9_]+/g, "_").replace(/^_/, "").replace(/_$/, "").replace(/^[0-9]/, "_$&");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  globals,
  is_valid,
  is_void,
  reserved,
  sanitize
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3V0aWxzL25hbWVzLnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFBb0Q7QUFDcEQsK0JBQThCO0FBRXZCLE1BQU0sVUFBVSxJQUFJLElBQUk7QUFBQSxFQUM3QjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQTtBQUdLLE1BQU0sV0FBVyxJQUFJLElBQUk7QUFBQSxFQUM5QjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUE7QUFHRixNQUFNLHFCQUFxQjtBQUdwQixpQkFBaUIsTUFBYztBQUNwQyxTQUFPLG1CQUFtQixLQUFLLFNBQVMsS0FBSyxrQkFBa0I7QUFBQTtBQUkxRCxrQkFBa0IsS0FBc0I7QUFDN0MsTUFBSSxJQUFJO0FBRVIsU0FBTyxJQUFJLElBQUksUUFBUTtBQUNyQixVQUFNLE9BQU8sc0NBQWtCLEtBQUs7QUFDcEMsUUFBSSxDQUFFLE9BQU0sSUFBSSxpQ0FBb0IsK0JBQWtCLE1BQU07QUFBTyxhQUFPO0FBRTFFLFNBQUssUUFBUSxRQUFTLElBQUk7QUFBQTtBQUc1QixTQUFPO0FBQUE7QUFJRixrQkFBa0IsTUFBYztBQUNyQyxTQUFPLEtBQ0osUUFBUSxtQkFBbUIsS0FDM0IsUUFBUSxNQUFNLElBQ2QsUUFBUSxNQUFNLElBQ2QsUUFBUSxVQUFVO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
