var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  default: () => list
});
function list(items, conjunction = "or") {
  if (items.length === 1)
    return items[0];
  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1]}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3V0aWxzL2xpc3QudHMiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNlLGNBQWMsT0FBaUIsY0FBYyxNQUFNO0FBQ2hFLE1BQUksTUFBTSxXQUFXO0FBQUcsV0FBTyxNQUFNO0FBQ3JDLFNBQU8sR0FBRyxNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssU0FBUyxlQUFlLE1BQU0sTUFBTSxTQUFTO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
