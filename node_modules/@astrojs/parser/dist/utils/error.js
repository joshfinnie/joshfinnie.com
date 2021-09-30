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
  CompileError: () => CompileError,
  default: () => error
});
var import_locate_character = __toModule(require("locate-character"));
var import_get_code_frame = __toModule(require("./get_code_frame.js"));
class CompileError extends Error {
  constructor({code, filename, start, end, message}) {
    super(message);
    this.start = (0, import_locate_character.locate)(code, start, {offsetLine: 1});
    this.end = (0, import_locate_character.locate)(code, end || start, {offsetLine: 1});
    this.filename = filename;
    this.message = message;
    this.frame = (0, import_get_code_frame.default)(code, this.start.line - 1, this.start.column);
  }
  toString() {
    return `${this.filename}:${this.start.line}:${this.start.column}
	${this.message}
${this.frame}`;
  }
}
function error(code, message, props) {
  const err = new CompileError({code, message, start: props.start, end: props.end, filename: props.filename});
  err.name = props.name;
  throw err;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CompileError
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3V0aWxzL2Vycm9yLnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQSw4QkFBdUI7QUFDdkIsNEJBQTJCO0FBRXBCLDJCQUEyQixNQUFNO0FBQUEsRUFPdEMsWUFBWSxDQUFFLE1BQU0sVUFBVSxPQUFPLEtBQUssVUFBNkY7QUFDckksVUFBTTtBQUVOLFNBQUssUUFBUSxvQ0FBTyxNQUFNLE9BQU8sQ0FBRSxZQUFZO0FBQy9DLFNBQUssTUFBTSxvQ0FBTyxNQUFNLE9BQU8sT0FBTyxDQUFFLFlBQVk7QUFDcEQsU0FBSyxXQUFXO0FBQ2hCLFNBQUssVUFBVTtBQUNmLFNBQUssUUFBUSxtQ0FBZSxNQUFNLEtBQUssTUFBTSxPQUFPLEdBQUcsS0FBSyxNQUFNO0FBQUE7QUFBQSxFQUdwRSxXQUFXO0FBQ1QsV0FBTyxHQUFHLEtBQUssWUFBWSxLQUFLLE1BQU0sUUFBUSxLQUFLLE1BQU07QUFBQSxHQUFhLEtBQUs7QUFBQSxFQUFZLEtBQUs7QUFBQTtBQUFBO0FBS2pGLGVBQ2IsTUFDQSxTQUNBLE9BT087QUFDUCxRQUFNLE1BQU0sSUFBSSxhQUFhLENBQUUsTUFBTSxTQUFTLE9BQU8sTUFBTSxPQUFPLEtBQUssTUFBTSxLQUFLLFVBQVUsTUFBTTtBQUNsRyxNQUFJLE9BQU8sTUFBTTtBQUVqQixRQUFNO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
