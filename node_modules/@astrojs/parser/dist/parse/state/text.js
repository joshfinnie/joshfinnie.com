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
  default: () => text
});
var import_html = __toModule(require("../utils/html.js"));
function text(parser) {
  const start = parser.index;
  let data = "";
  const shouldContinue = () => {
    if (parser.current().name === "code") {
      return !parser.match("<") && !parser.match("{");
    }
    return !parser.match("<") && !parser.match("{") && !parser.match("`");
  };
  while (parser.index < parser.template.length && shouldContinue()) {
    data += parser.template[parser.index++];
  }
  const node = {
    start,
    end: parser.index,
    type: "Text",
    raw: data,
    data: (0, import_html.decode_character_references)(data)
  };
  parser.current().children.push(node);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3N0YXRlL3RleHQudHMiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQSxrQkFBNEM7QUFHN0IsY0FBYyxRQUFnQjtBQUMzQyxRQUFNLFFBQVEsT0FBTztBQUVyQixNQUFJLE9BQU87QUFFWCxRQUFNLGlCQUFpQixNQUFNO0FBRTNCLFFBQUksT0FBTyxVQUFVLFNBQVMsUUFBUTtBQUNwQyxhQUFPLENBQUMsT0FBTyxNQUFNLFFBQVEsQ0FBQyxPQUFPLE1BQU07QUFBQTtBQUU3QyxXQUFPLENBQUMsT0FBTyxNQUFNLFFBQVEsQ0FBQyxPQUFPLE1BQU0sUUFBUSxDQUFDLE9BQU8sTUFBTTtBQUFBO0FBR25FLFNBQU8sT0FBTyxRQUFRLE9BQU8sU0FBUyxVQUFVLGtCQUFrQjtBQUNoRSxZQUFRLE9BQU8sU0FBUyxPQUFPO0FBQUE7QUFHakMsUUFBTSxPQUFPO0FBQUEsSUFDWDtBQUFBLElBQ0EsS0FBSyxPQUFPO0FBQUEsSUFDWixNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsSUFDTCxNQUFNLDZDQUE0QjtBQUFBO0FBR3BDLFNBQU8sVUFBVSxTQUFTLEtBQUs7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
