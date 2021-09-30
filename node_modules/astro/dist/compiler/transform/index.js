import {walk} from "estree-walker";
import transformStyles from "./styles.js";
import transformDoctype from "./doctype.js";
import transformModuleScripts from "./module-scripts.js";
import transformCodeBlocks from "./prism.js";
import transformHead from "./head.js";
function addVisitor(visitor, collection, nodeName, event) {
  if (typeof visitor[event] !== "function")
    return;
  if (!collection[event])
    collection[event] = new Map();
  const visitors = collection[event].get(nodeName) || [];
  visitors.push(visitor[event]);
  collection[event].set(nodeName, visitors);
}
function collectVisitors(transformer, htmlVisitors, cssVisitors, finalizers) {
  if (transformer.visitors) {
    if (transformer.visitors.html) {
      for (const [nodeName, visitor] of Object.entries(transformer.visitors.html)) {
        addVisitor(visitor, htmlVisitors, nodeName, "enter");
        addVisitor(visitor, htmlVisitors, nodeName, "leave");
      }
    }
    if (transformer.visitors.css) {
      for (const [nodeName, visitor] of Object.entries(transformer.visitors.css)) {
        addVisitor(visitor, cssVisitors, nodeName, "enter");
        addVisitor(visitor, cssVisitors, nodeName, "leave");
      }
    }
  }
  finalizers.push(transformer.finalize);
}
function createVisitorCollection() {
  return {
    enter: new Map(),
    leave: new Map()
  };
}
function walkAstWithVisitors(tmpl, collection) {
  walk(tmpl, {
    enter(node, parent, key, index) {
      if (collection.enter.has(node.type)) {
        const fns = collection.enter.get(node.type) || [];
        for (let fn of fns) {
          fn.call(this, node, parent, key, index);
        }
      }
    },
    leave(node, parent, key, index) {
      if (collection.leave.has(node.type)) {
        const fns = collection.leave.get(node.type) || [];
        for (let fn of fns) {
          fn.call(this, node, parent, key, index);
        }
      }
    }
  });
}
async function transform(ast, opts) {
  const htmlVisitors = createVisitorCollection();
  const cssVisitors = createVisitorCollection();
  const finalizers = [];
  const optimizers = [transformHead(opts), transformStyles(opts), transformDoctype(opts), transformModuleScripts(opts), transformCodeBlocks(ast.module)];
  for (const optimizer of optimizers) {
    collectVisitors(optimizer, htmlVisitors, cssVisitors, finalizers);
  }
  (ast.css || []).map((css) => walkAstWithVisitors(css, cssVisitors));
  walkAstWithVisitors(ast.html, htmlVisitors);
  await Promise.all(finalizers.map((fn) => fn()));
}
export {
  transform
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2NvbXBpbGVyL3RyYW5zZm9ybS9pbmRleC50cyJdLAogICJtYXBwaW5ncyI6ICJBQUdBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFBLG9CQUFvQixTQUFzQixZQUErQixVQUFrQixPQUEwQjtBQUNuSCxNQUFJLE9BQU8sUUFBUSxXQUFXO0FBQVk7QUFDMUMsTUFBSSxDQUFDLFdBQVc7QUFBUSxlQUFXLFNBQVMsSUFBSTtBQUVoRCxRQUFNLFdBQVcsV0FBVyxPQUFPLElBQUksYUFBYTtBQUNwRCxXQUFTLEtBQUssUUFBUTtBQUN0QixhQUFXLE9BQU8sSUFBSSxVQUFVO0FBQUE7QUFJbEMseUJBQXlCLGFBQTBCLGNBQWlDLGFBQWdDLFlBQXdDO0FBQzFKLE1BQUksWUFBWSxVQUFVO0FBQ3hCLFFBQUksWUFBWSxTQUFTLE1BQU07QUFDN0IsaUJBQVcsQ0FBQyxVQUFVLFlBQVksT0FBTyxRQUFRLFlBQVksU0FBUyxPQUFPO0FBQzNFLG1CQUFXLFNBQVMsY0FBYyxVQUFVO0FBQzVDLG1CQUFXLFNBQVMsY0FBYyxVQUFVO0FBQUE7QUFBQTtBQUdoRCxRQUFJLFlBQVksU0FBUyxLQUFLO0FBQzVCLGlCQUFXLENBQUMsVUFBVSxZQUFZLE9BQU8sUUFBUSxZQUFZLFNBQVMsTUFBTTtBQUMxRSxtQkFBVyxTQUFTLGFBQWEsVUFBVTtBQUMzQyxtQkFBVyxTQUFTLGFBQWEsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUlqRCxhQUFXLEtBQUssWUFBWTtBQUFBO0FBSTlCLG1DQUFtQztBQUNqQyxTQUFPO0FBQUEsSUFDTCxPQUFPLElBQUk7QUFBQSxJQUNYLE9BQU8sSUFBSTtBQUFBO0FBQUE7QUFLZiw2QkFBNkIsTUFBb0IsWUFBK0I7QUFDOUUsT0FBSyxNQUFNO0FBQUEsSUFDVCxNQUFNLE1BQU0sUUFBUSxLQUFLLE9BQU87QUFDOUIsVUFBSSxXQUFXLE1BQU0sSUFBSSxLQUFLLE9BQU87QUFDbkMsY0FBTSxNQUFNLFdBQVcsTUFBTSxJQUFJLEtBQUssU0FBUztBQUMvQyxpQkFBUyxNQUFNLEtBQUs7QUFDbEIsYUFBRyxLQUFLLE1BQU0sTUFBTSxRQUFRLEtBQUs7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUl2QyxNQUFNLE1BQU0sUUFBUSxLQUFLLE9BQU87QUFDOUIsVUFBSSxXQUFXLE1BQU0sSUFBSSxLQUFLLE9BQU87QUFDbkMsY0FBTSxNQUFNLFdBQVcsTUFBTSxJQUFJLEtBQUssU0FBUztBQUMvQyxpQkFBUyxNQUFNLEtBQUs7QUFDbEIsYUFBRyxLQUFLLE1BQU0sTUFBTSxRQUFRLEtBQUs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBYTNDLHlCQUFnQyxLQUFVLE1BQXdCO0FBQ2hFLFFBQU0sZUFBZTtBQUNyQixRQUFNLGNBQWM7QUFDcEIsUUFBTSxhQUF5QztBQUUvQyxRQUFNLGFBQWEsQ0FBQyxjQUFjLE9BQU8sZ0JBQWdCLE9BQU8saUJBQWlCLE9BQU8sdUJBQXVCLE9BQU8sb0JBQW9CLElBQUk7QUFFOUksYUFBVyxhQUFhLFlBQVk7QUFDbEMsb0JBQWdCLFdBQVcsY0FBYyxhQUFhO0FBQUE7QUFHeEQsRUFBQyxLQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxvQkFBb0IsS0FBSztBQUN0RCxzQkFBb0IsSUFBSSxNQUFNO0FBRzlCLFFBQU0sUUFBUSxJQUFJLFdBQVcsSUFBSSxDQUFDLE9BQU87QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
