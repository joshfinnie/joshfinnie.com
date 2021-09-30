import {warn} from "../../logger.js";
function isImportMetaDeclaration(declaration, metaName) {
  let {init} = declaration;
  if (!init)
    return false;
  if (init.type === "AwaitExpression") {
    init = init.argument;
  }
  if (init.type !== "CallExpression" || init.callee.type !== "MemberExpression" || init.callee.object.type !== "MetaProperty")
    return false;
  if (metaName && (init.callee.property.type !== "Identifier" || init.callee.property.name !== metaName))
    return false;
  return true;
}
const warnableRelativeValues = new Set(["img+src", "a+href", "script+src", "link+href", "source+srcset"]);
const matchesRelative = /^(?![A-Za-z][+-.0-9A-Za-z]*:|\/|#)/;
function warnIfRelativeStringLiteral(logging, nodeName, attr, value) {
  let key = nodeName + "+" + attr.name;
  if (warnableRelativeValues.has(key) && matchesRelative.test(value)) {
    let message = `This value will be resolved relative to the page: <${nodeName} ${attr.name}="${value}">`;
    warn(logging, "relative-link", message);
  }
}
export {
  isImportMetaDeclaration,
  warnIfRelativeStringLiteral
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2NvbXBpbGVyL2NvZGVnZW4vdXRpbHMudHMiXSwKICAibWFwcGluZ3MiOiAiQUFPQTtBQUdPLGlDQUFpQyxhQUFpQyxVQUE0QjtBQUNuRyxNQUFJLENBQUUsUUFBUztBQUNmLE1BQUksQ0FBQztBQUFNLFdBQU87QUFFbEIsTUFBSSxLQUFLLFNBQVMsbUJBQW1CO0FBQ25DLFdBQU8sS0FBSztBQUFBO0FBR2QsTUFBSSxLQUFLLFNBQVMsb0JBQW9CLEtBQUssT0FBTyxTQUFTLHNCQUFzQixLQUFLLE9BQU8sT0FBTyxTQUFTO0FBQWdCLFdBQU87QUFFcEksTUFBSSxZQUFhLE1BQUssT0FBTyxTQUFTLFNBQVMsZ0JBQWdCLEtBQUssT0FBTyxTQUFTLFNBQVM7QUFBVyxXQUFPO0FBQy9HLFNBQU87QUFBQTtBQUdULE1BQU0seUJBQXlCLElBQUksSUFBSSxDQUFDLFdBQVcsVUFBVSxjQUFjLGFBQWE7QUFFeEYsTUFBTSxrQkFBa0I7QUFFakIscUNBQXFDLFNBQXFCLFVBQWtCLE1BQWlCLE9BQWU7QUFDakgsTUFBSSxNQUFNLFdBQVcsTUFBTSxLQUFLO0FBQ2hDLE1BQUksdUJBQXVCLElBQUksUUFBUSxnQkFBZ0IsS0FBSyxRQUFRO0FBQ2xFLFFBQUksVUFBVSxzREFBc0QsWUFBWSxLQUFLLFNBQVM7QUFDOUYsU0FBSyxTQUFTLGlCQUFpQjtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
