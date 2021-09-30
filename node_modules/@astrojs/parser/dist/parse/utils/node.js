var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  to_string: () => to_string
});
function to_string(node) {
  switch (node.type) {
    case "IfBlock":
      return "{#if} block";
    case "ThenBlock":
      return "{:then} block";
    case "ElseBlock":
      return "{:else} block";
    case "PendingBlock":
    case "AwaitBlock":
      return "{#await} block";
    case "CatchBlock":
      return "{:catch} block";
    case "EachBlock":
      return "{#each} block";
    case "RawMustacheTag":
      return "{@html} block";
    case "DebugTag":
      return "{@debug} block";
    case "Element":
    case "InlineComponent":
    case "Slot":
    case "Title":
      return `<${node.name}> tag`;
    default:
      return node.type;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  to_string
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3V0aWxzL25vZGUudHMiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVPLG1CQUFtQixNQUFvQjtBQUM1QyxVQUFRLEtBQUs7QUFBQSxTQUNOO0FBQ0gsYUFBTztBQUFBLFNBQ0o7QUFDSCxhQUFPO0FBQUEsU0FDSjtBQUNILGFBQU87QUFBQSxTQUNKO0FBQUEsU0FDQTtBQUNILGFBQU87QUFBQSxTQUNKO0FBQ0gsYUFBTztBQUFBLFNBQ0o7QUFDSCxhQUFPO0FBQUEsU0FDSjtBQUNILGFBQU87QUFBQSxTQUNKO0FBQ0gsYUFBTztBQUFBLFNBQ0o7QUFBQSxTQUNBO0FBQUEsU0FDQTtBQUFBLFNBQ0E7QUFDSCxhQUFPLElBQUksS0FBSztBQUFBO0FBRWhCLGFBQU8sS0FBSztBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
