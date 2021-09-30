var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  nodes_match: () => nodes_match
});
function nodes_match(a, b) {
  if (!!a !== !!b)
    return false;
  if (Array.isArray(a) !== Array.isArray(b))
    return false;
  if (a && typeof a === "object") {
    if (Array.isArray(a)) {
      if (a.length !== b.length)
        return false;
      return a.every((child, i2) => nodes_match(child, b[i2]));
    }
    const a_keys = Object.keys(a).sort();
    const b_keys = Object.keys(b).sort();
    if (a_keys.length !== b_keys.length)
      return false;
    let i = a_keys.length;
    while (i--) {
      const key = a_keys[i];
      if (b_keys[i] !== key)
        return false;
      if (key === "start" || key === "end")
        continue;
      if (!nodes_match(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a === b;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  nodes_match
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3V0aWxzL25vZGVzX21hdGNoLnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHTyxxQkFBcUIsR0FBRyxHQUFHO0FBQ2hDLE1BQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQUcsV0FBTztBQUN4QixNQUFJLE1BQU0sUUFBUSxPQUFPLE1BQU0sUUFBUTtBQUFJLFdBQU87QUFFbEQsTUFBSSxLQUFLLE9BQU8sTUFBTSxVQUFVO0FBQzlCLFFBQUksTUFBTSxRQUFRLElBQUk7QUFDcEIsVUFBSSxFQUFFLFdBQVcsRUFBRTtBQUFRLGVBQU87QUFDbEMsYUFBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLE9BQU0sWUFBWSxPQUFPLEVBQUU7QUFBQTtBQUdwRCxVQUFNLFNBQVMsT0FBTyxLQUFLLEdBQUc7QUFDOUIsVUFBTSxTQUFTLE9BQU8sS0FBSyxHQUFHO0FBRTlCLFFBQUksT0FBTyxXQUFXLE9BQU87QUFBUSxhQUFPO0FBRTVDLFFBQUksSUFBSSxPQUFPO0FBQ2YsV0FBTyxLQUFLO0FBQ1YsWUFBTSxNQUFNLE9BQU87QUFDbkIsVUFBSSxPQUFPLE9BQU87QUFBSyxlQUFPO0FBRTlCLFVBQUksUUFBUSxXQUFXLFFBQVE7QUFBTztBQUV0QyxVQUFJLENBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxPQUFPO0FBQ2hDLGVBQU87QUFBQTtBQUFBO0FBSVgsV0FBTztBQUFBO0FBR1QsU0FBTyxNQUFNO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
