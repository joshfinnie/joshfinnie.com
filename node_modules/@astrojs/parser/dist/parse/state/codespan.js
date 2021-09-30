var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  default: () => codespan
});
function codespan(parser) {
  const start = parser.index;
  const open = parser.match_regex(/(?<!\\)`{1,2}/);
  parser.index += open.length;
  let raw = open;
  while (parser.index < parser.template.length && !parser.match(open)) {
    raw += parser.template[parser.index++];
  }
  parser.eat(open, true);
  raw += open;
  const node = {
    start,
    end: parser.index,
    type: "CodeSpan",
    raw,
    data: raw == null ? void 0 : raw.slice(open == null ? void 0 : open.length, (open == null ? void 0 : open.length) * -1).replace(/^ /, "").replace(/ $/, "")
  };
  parser.current().children.push(node);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3N0YXRlL2NvZGVzcGFuLnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHZSxrQkFBa0IsUUFBZ0I7QUFDL0MsUUFBTSxRQUFRLE9BQU87QUFDckIsUUFBTSxPQUFPLE9BQU8sWUFBWTtBQUNoQyxTQUFPLFNBQVMsS0FBTTtBQUV0QixNQUFJLE1BQU07QUFDVixTQUFPLE9BQU8sUUFBUSxPQUFPLFNBQVMsVUFBVSxDQUFDLE9BQU8sTUFBTSxPQUFPO0FBQ25FLFdBQU8sT0FBTyxTQUFTLE9BQU87QUFBQTtBQUVoQyxTQUFPLElBQUksTUFBTTtBQUNqQixTQUFPO0FBRVAsUUFBTSxPQUFPO0FBQUEsSUFDWDtBQUFBLElBQ0EsS0FBSyxPQUFPO0FBQUEsSUFDWixNQUFNO0FBQUEsSUFDTjtBQUFBLElBQ0EsTUFBTSwyQkFDRixNQUFNLDZCQUFNLFFBQVEsOEJBQU0sVUFBUyxJQUNwQyxRQUFRLE1BQU0sSUFDZCxRQUFRLE1BQU07QUFBQTtBQUduQixTQUFPLFVBQVUsU0FBUyxLQUFLO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
