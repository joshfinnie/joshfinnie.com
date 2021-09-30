import {builtinModules} from "module";
const nodeBuiltinsSet = new Set(builtinModules);
const nodeBuiltinsMap = new Map(builtinModules.map((bareName) => [bareName, "node:" + bareName]));
export {
  nodeBuiltinsMap,
  nodeBuiltinsSet
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL25vZGVfYnVpbHRpbnMudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUVPLE1BQU0sa0JBQWtCLElBQUksSUFBSTtBQUNoQyxNQUFNLGtCQUFrQixJQUFJLElBQUksZUFBZSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsVUFBVTsiLAogICJuYW1lcyI6IFtdCn0K
