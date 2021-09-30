import {getAttrValue, setAttrValue} from "../../ast.js";
function module_scripts_default({compileOptions, filename}) {
  const {astroConfig} = compileOptions;
  const fileUrl = new URL(`file://${filename}`);
  return {
    visitors: {
      html: {
        Element: {
          enter(node) {
            let name = node.name;
            if (name !== "script") {
              return;
            }
            let type = getAttrValue(node.attributes, "type");
            if (type !== "module") {
              return;
            }
            let src = getAttrValue(node.attributes, "src");
            if (!src) {
              return;
            }
            if (src.startsWith("/")) {
              return;
            }
            try {
              new URL(src);
              return;
            } catch (err) {
            }
            const srcUrl = new URL(src, fileUrl);
            const absoluteUrl = `/_astro/${srcUrl.href.replace(astroConfig.projectRoot.href, "")}`;
            setAttrValue(node.attributes, "src", absoluteUrl);
          }
        }
      }
    },
    async finalize() {
    }
  };
}
export {
  module_scripts_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2NvbXBpbGVyL3RyYW5zZm9ybS9tb2R1bGUtc2NyaXB0cy50cyJdLAogICJtYXBwaW5ncyI6ICJBQUdBO0FBR2UsZ0NBQVUsQ0FBRSxnQkFBZ0IsV0FBK0Y7QUFDeEksUUFBTSxDQUFFLGVBQWdCO0FBQ3hCLFFBQU0sVUFBVSxJQUFJLElBQUksVUFBVTtBQUVsQyxTQUFPO0FBQUEsSUFDTCxVQUFVO0FBQUEsTUFDUixNQUFNO0FBQUEsUUFDSixTQUFTO0FBQUEsVUFDUCxNQUFNLE1BQU07QUFDVixnQkFBSSxPQUFPLEtBQUs7QUFDaEIsZ0JBQUksU0FBUyxVQUFVO0FBQ3JCO0FBQUE7QUFHRixnQkFBSSxPQUFPLGFBQWEsS0FBSyxZQUFZO0FBQ3pDLGdCQUFJLFNBQVMsVUFBVTtBQUNyQjtBQUFBO0FBR0YsZ0JBQUksTUFBTSxhQUFhLEtBQUssWUFBWTtBQUd4QyxnQkFBSSxDQUFDLEtBQUs7QUFDUjtBQUFBO0FBSUYsZ0JBQUksSUFBSSxXQUFXLE1BQU07QUFDdkI7QUFBQTtBQUlGLGdCQUFJO0FBQ0Ysa0JBQUksSUFBSTtBQUNSO0FBQUEscUJBQ08sS0FBUDtBQUFBO0FBSUYsa0JBQU0sU0FBUyxJQUFJLElBQUksS0FBSztBQUM1QixrQkFBTSxjQUFjLFdBQVcsT0FBTyxLQUFLLFFBQVEsWUFBWSxZQUFZLE1BQU07QUFDakYseUJBQWEsS0FBSyxZQUFZLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBS3ZDLFdBQVc7QUFBQTtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
