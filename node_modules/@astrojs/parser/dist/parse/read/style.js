var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  default: () => read_style
});
function read_style(parser, start, attributes) {
  const content_start = parser.index;
  const styles = parser.read_until(/<\/style>/);
  const content_end = parser.index;
  parser.eat("</style>", true);
  const end = parser.index;
  return {
    type: "Style",
    start,
    end,
    attributes,
    content: {
      start: content_start,
      end: content_end,
      styles
    }
  };
}
function is_ref_selector(a, b) {
  if (!b)
    return false;
  return a.type === "TypeSelector" && a.name === "ref" && b.type === "PseudoClassSelector";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3JlYWQvc3R5bGUudHMiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWNlLG9CQUFvQixRQUFnQixPQUFlLFlBQWdDO0FBQ2hHLFFBQU0sZ0JBQWdCLE9BQU87QUFDN0IsUUFBTSxTQUFTLE9BQU8sV0FBVztBQUNqQyxRQUFNLGNBQWMsT0FBTztBQUMzQixTQUFPLElBQUksWUFBWTtBQUN2QixRQUFNLE1BQU0sT0FBTztBQUVuQixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsTUFDUCxLQUFLO0FBQUEsTUFDTDtBQUFBO0FBQUE7QUFBQTtBQUtOLHlCQUF5QixHQUFRLEdBQVE7QUFFdkMsTUFBSSxDQUFDO0FBQUcsV0FBTztBQUVmLFNBQU8sRUFBRSxTQUFTLGtCQUFrQixFQUFFLFNBQVMsU0FBUyxFQUFFLFNBQVM7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
