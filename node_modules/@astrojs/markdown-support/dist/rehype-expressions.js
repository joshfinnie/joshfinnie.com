import {map} from "unist-util-map";
function rehypeExpressions() {
  return function(node) {
    return map(node, (child) => {
      if (child.type === "mdxTextExpression") {
        return {type: "text", value: `{${child.value}}`};
      }
      return child;
    });
  };
}
export {
  rehypeExpressions as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3JlaHlwZS1leHByZXNzaW9ucy50cyJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBRWUsNkJBQWtDO0FBQy9DLFNBQU8sU0FBVSxNQUFnQjtBQUMvQixXQUFPLElBQUksTUFBTSxDQUFDLFVBQVU7QUFDMUIsVUFBSSxNQUFNLFNBQVMscUJBQXFCO0FBQ3RDLGVBQU8sQ0FBRSxNQUFNLFFBQVEsT0FBTyxJQUFLLE1BQWM7QUFBQTtBQUVuRCxhQUFPO0FBQUE7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
