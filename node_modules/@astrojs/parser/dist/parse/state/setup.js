var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  default: () => setup
});
function setup(parser) {
  const start = parser.index;
  parser.index += 3;
  const content_start = parser.index;
  const setupScriptContent = parser.read_until(/^---/m);
  const content_end = parser.index;
  parser.eat("---", true);
  const end = parser.index;
  parser.js.push({
    type: "Script",
    context: "setup",
    start,
    end,
    content: setupScriptContent
  });
  return;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3N0YXRlL3NldHVwLnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJZSxlQUFlLFFBQXNCO0FBU2xELFFBQU0sUUFBUSxPQUFPO0FBQ3JCLFNBQU8sU0FBUztBQUNoQixRQUFNLGdCQUFnQixPQUFPO0FBQzdCLFFBQU0scUJBQXFCLE9BQU8sV0FBVztBQUM3QyxRQUFNLGNBQWMsT0FBTztBQUMzQixTQUFPLElBQUksT0FBTztBQUNsQixRQUFNLE1BQU0sT0FBTztBQUNuQixTQUFPLEdBQUcsS0FBSztBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sU0FBUztBQUFBLElBQ1Q7QUFBQSxJQUNBO0FBQUEsSUFDQSxTQUFTO0FBQUE7QUFRWDtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
