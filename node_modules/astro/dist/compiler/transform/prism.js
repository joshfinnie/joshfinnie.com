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
import {getAttrValue} from "../../ast.js";
const PRISM_IMPORT = `import Prism from 'astro/components/Prism.astro';`;
const prismImportExp = /import Prism from ['"]astro\/components\/Prism.astro['"]/;
function escape(code) {
  return code.replace(/[`$]/g, (match) => {
    return "\\" + match;
  }).replace(/ASTRO_ESCAPED_LEFT_CURLY_BRACKET\0/g, "{");
}
function unescapeCode(code) {
  var _a;
  code.children = (_a = code.children) == null ? void 0 : _a.map((child) => {
    if (child.type === "Text") {
      return __spreadProps(__spreadValues({}, child), {raw: child.raw.replace(/ASTRO_ESCAPED_LEFT_CURLY_BRACKET\0/g, "{")});
    }
    return child;
  });
}
function prism_default(module) {
  let usesPrism = false;
  return {
    visitors: {
      html: {
        Element: {
          enter(node) {
            if (node.name === "code") {
              unescapeCode(node);
              return;
            }
            if (node.name !== "pre")
              return;
            const codeEl = node.children && node.children[0];
            if (!codeEl || codeEl.name !== "code")
              return;
            const className = getAttrValue(codeEl.attributes, "class") || "";
            const classes = className.split(" ");
            let lang;
            for (let cn of classes) {
              const matches = /language-(.+)/.exec(cn);
              if (matches) {
                lang = matches[1];
                break;
              }
            }
            if (!lang)
              return;
            let classesWithoutLang = classes.filter((cn) => cn !== `language-${lang}`);
            let codeData = codeEl.children && codeEl.children[0];
            if (!codeData)
              return;
            let code = codeData.data;
            const repl = {
              start: 0,
              end: 0,
              type: "InlineComponent",
              name: "Prism",
              attributes: [
                {
                  type: "Attribute",
                  name: "lang",
                  value: [
                    {
                      type: "Text",
                      raw: lang,
                      data: lang
                    }
                  ]
                },
                {
                  type: "Attribute",
                  name: "class",
                  value: [
                    {
                      type: "Text",
                      raw: classesWithoutLang.join(" "),
                      data: classesWithoutLang.join(" ")
                    }
                  ]
                },
                {
                  type: "Attribute",
                  name: "code",
                  value: [
                    {
                      type: "MustacheTag",
                      expression: {
                        type: "Expression",
                        codeChunks: ["`" + escape(code) + "`"],
                        children: []
                      }
                    }
                  ]
                }
              ],
              children: []
            };
            this.replace(repl);
            usesPrism = true;
          }
        }
      }
    },
    async finalize() {
      if (usesPrism && module && !prismImportExp.test(module.content)) {
        module.content = PRISM_IMPORT + "\n" + module.content;
      }
    }
  };
}
export {
  PRISM_IMPORT,
  prism_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2NvbXBpbGVyL3RyYW5zZm9ybS9wcmlzbS50cyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUVPLE1BQU0sZUFBZTtBQUM1QixNQUFNLGlCQUFpQjtBQUd2QixnQkFBZ0IsTUFBYztBQUM1QixTQUFPLEtBQ0osUUFBUSxTQUFTLENBQUMsVUFBVTtBQUMzQixXQUFPLE9BQU87QUFBQSxLQUVmLFFBQVEsdUNBQXVDO0FBQUE7QUFJcEQsc0JBQXNCLE1BQW9CO0FBakIxQztBQWtCRSxPQUFLLFdBQVcsV0FBSyxhQUFMLG1CQUFlLElBQUksQ0FBQyxVQUFVO0FBQzVDLFFBQUksTUFBTSxTQUFTLFFBQVE7QUFDekIsYUFBTyxpQ0FBSyxRQUFMLENBQVksS0FBSyxNQUFNLElBQUksUUFBUSx1Q0FBdUM7QUFBQTtBQUVuRixXQUFPO0FBQUE7QUFBQTtBQUtJLHVCQUFVLFFBQTZCO0FBQ3BELE1BQUksWUFBWTtBQUVoQixTQUFPO0FBQUEsSUFDTCxVQUFVO0FBQUEsTUFDUixNQUFNO0FBQUEsUUFDSixTQUFTO0FBQUEsVUFDUCxNQUFNLE1BQU07QUFDVixnQkFBSSxLQUFLLFNBQVMsUUFBUTtBQUN4QiwyQkFBYTtBQUNiO0FBQUE7QUFHRixnQkFBSSxLQUFLLFNBQVM7QUFBTztBQUN6QixrQkFBTSxTQUFTLEtBQUssWUFBWSxLQUFLLFNBQVM7QUFDOUMsZ0JBQUksQ0FBQyxVQUFVLE9BQU8sU0FBUztBQUFRO0FBRXZDLGtCQUFNLFlBQVksYUFBYSxPQUFPLFlBQVksWUFBWTtBQUM5RCxrQkFBTSxVQUFVLFVBQVUsTUFBTTtBQUVoQyxnQkFBSTtBQUNKLHFCQUFTLE1BQU0sU0FBUztBQUN0QixvQkFBTSxVQUFVLGdCQUFnQixLQUFLO0FBQ3JDLGtCQUFJLFNBQVM7QUFDWCx1QkFBTyxRQUFRO0FBQ2Y7QUFBQTtBQUFBO0FBSUosZ0JBQUksQ0FBQztBQUFNO0FBQ1gsZ0JBQUkscUJBQXFCLFFBQVEsT0FBTyxDQUFDLE9BQU8sT0FBTyxZQUFZO0FBRW5FLGdCQUFJLFdBQVcsT0FBTyxZQUFZLE9BQU8sU0FBUztBQUNsRCxnQkFBSSxDQUFDO0FBQVU7QUFDZixnQkFBSSxPQUFPLFNBQVM7QUFFcEIsa0JBQU0sT0FBTztBQUFBLGNBQ1gsT0FBTztBQUFBLGNBQ1AsS0FBSztBQUFBLGNBQ0wsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBLGNBQ04sWUFBWTtBQUFBLGdCQUNWO0FBQUEsa0JBQ0UsTUFBTTtBQUFBLGtCQUNOLE1BQU07QUFBQSxrQkFDTixPQUFPO0FBQUEsb0JBQ0w7QUFBQSxzQkFDRSxNQUFNO0FBQUEsc0JBQ04sS0FBSztBQUFBLHNCQUNMLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQSxnQkFJWjtBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsa0JBQ04sT0FBTztBQUFBLG9CQUNMO0FBQUEsc0JBQ0UsTUFBTTtBQUFBLHNCQUNOLEtBQUssbUJBQW1CLEtBQUs7QUFBQSxzQkFDN0IsTUFBTSxtQkFBbUIsS0FBSztBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUlwQztBQUFBLGtCQUNFLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsa0JBQ04sT0FBTztBQUFBLG9CQUNMO0FBQUEsc0JBQ0UsTUFBTTtBQUFBLHNCQUNOLFlBQVk7QUFBQSx3QkFDVixNQUFNO0FBQUEsd0JBQ04sWUFBWSxDQUFDLE1BQU0sT0FBTyxRQUFRO0FBQUEsd0JBQ2xDLFVBQVU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FNcEIsVUFBVTtBQUFBO0FBR1osaUJBQUssUUFBUTtBQUNiLHdCQUFZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUtkLFdBQVc7QUFFZixVQUFJLGFBQWEsVUFBVSxDQUFDLGVBQWUsS0FBSyxPQUFPLFVBQVU7QUFDL0QsZUFBTyxVQUFVLGVBQWUsT0FBTyxPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
