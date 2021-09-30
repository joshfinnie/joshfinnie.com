import {visit} from "unist-util-visit";
const noVisit = new Set(["root", "html", "text"]);
function scopedStyles(className) {
  const visitor = (node) => {
    var _a, _b;
    if (noVisit.has(node.type))
      return;
    const {data} = node;
    let currentClassName = (_b = (_a = data == null ? void 0 : data.hProperties) == null ? void 0 : _a.class) != null ? _b : "";
    node.data = node.data || {};
    node.data.hProperties = node.data.hProperties || {};
    node.data.hProperties.class = `${className} ${currentClassName}`.trim();
    return node;
  };
  return () => (tree) => visit(tree, visitor);
}
export {
  scopedStyles as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3JlbWFyay1zY29wZWQtc3R5bGVzLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFDQSxNQUFNLFVBQVUsSUFBSSxJQUFJLENBQUMsUUFBUSxRQUFRO0FBRzFCLHNCQUFzQixXQUFtQjtBQUN0RCxRQUFNLFVBQVUsQ0FBQyxTQUFjO0FBTGpDO0FBTUksUUFBSSxRQUFRLElBQUksS0FBSztBQUFPO0FBRTVCLFVBQU0sQ0FBRSxRQUFTO0FBQ2pCLFFBQUksbUJBQW1CLHlDQUFNLGdCQUFOLG1CQUFtQixVQUFuQixZQUE0QjtBQUNuRCxTQUFLLE9BQU8sS0FBSyxRQUFRO0FBQ3pCLFNBQUssS0FBSyxjQUFjLEtBQUssS0FBSyxlQUFlO0FBQ2pELFNBQUssS0FBSyxZQUFZLFFBQVEsR0FBRyxhQUFhLG1CQUFtQjtBQUVqRSxXQUFPO0FBQUE7QUFFVCxTQUFPLE1BQU0sQ0FBQyxTQUFjLE1BQU0sTUFBTTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
