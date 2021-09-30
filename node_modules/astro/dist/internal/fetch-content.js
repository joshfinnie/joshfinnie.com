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
function fetchContent(importMetaGlobResult, url) {
  return [...Object.entries(importMetaGlobResult)].map(([spec, mod]) => {
    if (!mod.__content) {
      return;
    }
    const urlSpec = new URL(spec, url).pathname.replace(/[\\/\\\\]/, "/");
    return __spreadProps(__spreadValues({}, mod.__content), {
      url: urlSpec.includes("/pages/") && urlSpec.replace(/^.*\/pages\//, "/").replace(/\.md$/, ""),
      file: new URL(spec, url)
    });
  }).filter(Boolean);
}
export {
  fetchContent
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2ludGVybmFsL2ZldGNoLWNvbnRlbnQudHMiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS08sc0JBQXNCLHNCQUEyQyxLQUFhO0FBQ25GLFNBQU8sQ0FBQyxHQUFHLE9BQU8sUUFBUSx1QkFDdkIsSUFBSSxDQUFDLENBQUMsTUFBTSxTQUFTO0FBRXBCLFFBQUksQ0FBQyxJQUFJLFdBQVc7QUFDbEI7QUFBQTtBQUVGLFVBQU0sVUFBVSxJQUFJLElBQUksTUFBTSxLQUFLLFNBQVMsUUFBUSxhQUFhO0FBQ2pFLFdBQU8saUNBQ0YsSUFBSSxZQURGO0FBQUEsTUFFTCxLQUFLLFFBQVEsU0FBUyxjQUFjLFFBQVEsUUFBUSxnQkFBZ0IsS0FBSyxRQUFRLFNBQVM7QUFBQSxNQUMxRixNQUFNLElBQUksSUFBSSxNQUFNO0FBQUE7QUFBQSxLQUd2QixPQUFPO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
