import {createRequire} from "module";
import {nodeBuiltinsMap} from "./node_builtins.js";
const require2 = createRequire(import.meta.url);
const pkg = require2("../package.json");
const allowList = new Set(["astring", "@astrojs/prism", "estree-util-value-to-estree", "prismjs", "shorthash"]);
const isAstroRenderer = (name) => {
  return name.startsWith(`@astrojs/renderer-`);
};
const denyList = ["prismjs/components/index.js", "@astrojs/markdown-support", "node:fs/promises", ...nodeBuiltinsMap.values()];
var external_default = Object.keys(pkg.dependencies).filter((name) => {
  if (allowList.has(name))
    return false;
  if (isAstroRenderer(name))
    return false;
  return true;
}).concat(denyList).sort();
export {
  external_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2V4dGVybmFsLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFDQTtBQUNBLE1BQU0sV0FBVSxjQUFjLFlBQVk7QUFDMUMsTUFBTSxNQUFNLFNBQVE7QUFTcEIsTUFBTSxZQUFZLElBQUksSUFBSSxDQUFDLFdBQVcsa0JBQWtCLCtCQUErQixXQUFXO0FBRWxHLE1BQU0sa0JBQWtCLENBQUMsU0FBaUI7QUFDeEMsU0FBTyxLQUFLLFdBQVc7QUFBQTtBQUt6QixNQUFNLFdBQVcsQ0FBQywrQkFBK0IsNkJBQTZCLG9CQUFvQixHQUFHLGdCQUFnQjtBQUVySCxJQUFPLG1CQUFRLE9BQU8sS0FBSyxJQUFJLGNBRTVCLE9BQU8sQ0FBQyxTQUFTO0FBRWhCLE1BQUksVUFBVSxJQUFJO0FBQU8sV0FBTztBQUVoQyxNQUFJLGdCQUFnQjtBQUFPLFdBQU87QUFFbEMsU0FBTztBQUFBLEdBR1IsT0FBTyxVQUNQOyIsCiAgIm5hbWVzIjogW10KfQo=
