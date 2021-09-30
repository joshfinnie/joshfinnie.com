var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import {visit} from "unist-util-visit";
import slugger from "github-slugger";
function createCollectHeaders() {
  const headers = [];
  function rehypeCollectHeaders() {
    return function(tree) {
      visit(tree, (node) => {
        var _a, _b;
        if (node.type !== "element")
          return;
        const {tagName} = node;
        if (tagName[0] !== "h")
          return;
        const [_, level] = (_a = tagName.match(/h([0-6])/)) != null ? _a : [];
        if (!level)
          return;
        const depth = Number.parseInt(level);
        let text = "";
        visit(node, "text", (child) => {
          text += child.value;
        });
        let slug = ((_b = node == null ? void 0 : node.data) == null ? void 0 : _b.id) || slugger.slug(text);
        node.data = node.data || {};
        node.data.properties = node.data.properties || {};
        node.data.properties = __spreadProps(__spreadValues({}, node.data.properties), {slug});
        headers.push({depth, slug, text});
      });
    };
  }
  return {
    headers,
    rehypeCollectHeaders
  };
}
export {
  createCollectHeaders as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3JlaHlwZS1jb2xsZWN0LWhlYWRlcnMudHMiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQTtBQUdlLGdDQUFnQztBQUM3QyxRQUFNLFVBQWlCO0FBRXZCLGtDQUFnQztBQUM5QixXQUFPLFNBQVUsTUFBWTtBQUMzQixZQUFNLE1BQU0sQ0FBQyxTQUFTO0FBVjVCO0FBV1EsWUFBSSxLQUFLLFNBQVM7QUFBVztBQUM3QixjQUFNLENBQUUsV0FBWTtBQUNwQixZQUFJLFFBQVEsT0FBTztBQUFLO0FBQ3hCLGNBQU0sQ0FBQyxHQUFHLFNBQVMsY0FBUSxNQUFNLGdCQUFkLFlBQTZCO0FBQ2hELFlBQUksQ0FBQztBQUFPO0FBQ1osY0FBTSxRQUFRLE9BQU8sU0FBUztBQUU5QixZQUFJLE9BQU87QUFFWCxjQUFNLE1BQU0sUUFBUSxDQUFDLFVBQVU7QUFDN0Isa0JBQVEsTUFBTTtBQUFBO0FBR2hCLFlBQUksT0FBTyxvQ0FBTSxTQUFOLG1CQUFZLE9BQU0sUUFBUSxLQUFLO0FBRTFDLGFBQUssT0FBTyxLQUFLLFFBQVE7QUFDekIsYUFBSyxLQUFLLGFBQWEsS0FBSyxLQUFLLGNBQWM7QUFDL0MsYUFBSyxLQUFLLGFBQWEsaUNBQU0sS0FBSyxLQUFLLGFBQWhCLENBQTJDO0FBQ2xFLGdCQUFRLEtBQUssQ0FBRSxPQUFPLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFLbEMsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
