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
  default: () => fragment
});
var import_tag = __toModule(require("./tag.js"));
var import_setup = __toModule(require("./setup.js"));
var import_mustache = __toModule(require("./mustache.js"));
var import_text = __toModule(require("./text.js"));
var import_codefence = __toModule(require("./codefence.js"));
var import_codespan = __toModule(require("./codespan.js"));
function fragment(parser) {
  if (parser.html.children.length === 0 && parser.match_regex(/^---/m)) {
    return import_setup.default;
  }
  if (parser.match_regex(/[`~]{3,}/)) {
    return import_codefence.default;
  }
  if (parser.match_regex(/(?<!\\)`{1,2}/)) {
    return import_codespan.default;
  }
  if (parser.match("<")) {
    return import_tag.default;
  }
  if (parser.match("{")) {
    return import_mustache.default;
  }
  return import_text.default;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3N0YXRlL2ZyYWdtZW50LnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQWdCO0FBQ2hCLG1CQUFrQjtBQUNsQixzQkFBcUI7QUFDckIsa0JBQWlCO0FBQ2pCLHVCQUFzQjtBQUN0QixzQkFBcUI7QUFHTixrQkFBa0IsUUFBZ0I7QUFDL0MsTUFBSSxPQUFPLEtBQUssU0FBUyxXQUFXLEtBQUssT0FBTyxZQUFZLFVBQVU7QUFDcEUsV0FBTztBQUFBO0FBS1QsTUFBSSxPQUFPLFlBQVksYUFBYTtBQUNsQyxXQUFPO0FBQUE7QUFFVCxNQUFJLE9BQU8sWUFBWSxrQkFBa0I7QUFDdkMsV0FBTztBQUFBO0FBR1QsTUFBSSxPQUFPLE1BQU0sTUFBTTtBQUNyQixXQUFPO0FBQUE7QUFHVCxNQUFJLE9BQU8sTUFBTSxNQUFNO0FBQ3JCLFdBQU87QUFBQTtBQUdULFNBQU87QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
