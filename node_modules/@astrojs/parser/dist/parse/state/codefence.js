var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  default: () => codefence
});
function codefence(parser) {
  const start = parser.index;
  const open = parser.match_regex(/[`~]{3,}/);
  parser.index += open.length;
  let raw = open + "";
  while (parser.index < parser.template.length && !parser.match(open)) {
    raw += parser.template[parser.index++];
  }
  parser.eat(open, true);
  raw += open;
  const trailingWhitespace = parser.read_until(/\S/);
  const {metadata, data} = extractCodeFence(raw);
  const node = {
    start,
    end: parser.index,
    type: "CodeFence",
    raw: `${raw}` + trailingWhitespace,
    metadata,
    data
  };
  parser.current().children.push(node);
}
function extractCodeFence(str) {
  var _a;
  const [_, leadingLine] = (_a = str.match(/(^[^\n]*\r?\n)/m)) != null ? _a : ["", ""];
  const metadata = leadingLine.trim();
  const data = str.slice(leadingLine.length);
  return {metadata, data};
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3N0YXRlL2NvZGVmZW5jZS50cyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR2UsbUJBQW1CLFFBQWdCO0FBQ2hELFFBQU0sUUFBUSxPQUFPO0FBQ3JCLFFBQU0sT0FBTyxPQUFPLFlBQVk7QUFDaEMsU0FBTyxTQUFTLEtBQU07QUFFdEIsTUFBSSxNQUFNLE9BQU87QUFFakIsU0FBTyxPQUFPLFFBQVEsT0FBTyxTQUFTLFVBQVUsQ0FBQyxPQUFPLE1BQU0sT0FBTztBQUNuRSxXQUFPLE9BQU8sU0FBUyxPQUFPO0FBQUE7QUFHaEMsU0FBTyxJQUFJLE1BQU07QUFDakIsU0FBTztBQUNQLFFBQU0scUJBQXFCLE9BQU8sV0FBVztBQUM3QyxRQUFNLENBQUUsVUFBVSxRQUFTLGlCQUFpQjtBQUU1QyxRQUFNLE9BQU87QUFBQSxJQUNYO0FBQUEsSUFDQSxLQUFLLE9BQU87QUFBQSxJQUNaLE1BQU07QUFBQSxJQUNOLEtBQUssR0FBRyxRQUFRO0FBQUEsSUFDaEI7QUFBQSxJQUNBO0FBQUE7QUFHRixTQUFPLFVBQVUsU0FBUyxLQUFLO0FBQUE7QUFJakMsMEJBQTBCLEtBQWE7QUFoQ3ZDO0FBaUNFLFFBQU0sQ0FBQyxHQUFHLGVBQWUsVUFBSSxNQUFNLHVCQUFWLFlBQWdDLENBQUMsSUFBSTtBQUM5RCxRQUFNLFdBQVcsWUFBWTtBQUM3QixRQUFNLE9BQU8sSUFBSSxNQUFNLFlBQVk7QUFDbkMsU0FBTyxDQUFFLFVBQVU7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
