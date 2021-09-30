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
import crypto from "crypto";
import {createRequire} from "module";
import path from "path";
import autoprefixer from "autoprefixer";
import postcss from "postcss";
import postcssKeyframes from "postcss-icss-keyframes";
import findUp from "find-up";
import sass from "sass";
import {error} from "../../logger.js";
import astroScopedStyles, {NEVER_SCOPED_TAGS} from "./postcss-scoped-styles/index.js";
import slash from "slash";
const getStyleType = new Map([
  [".css", "css"],
  [".pcss", "postcss"],
  [".sass", "sass"],
  [".scss", "scss"],
  ["css", "css"],
  ["sass", "sass"],
  ["scss", "scss"],
  ["text/css", "css"],
  ["text/sass", "sass"],
  ["text/scss", "scss"]
]);
function hashFromFilename(filename) {
  const hash = crypto.createHash("sha256");
  return hash.update(slash(filename)).digest("base64").toString().replace(/[^A-Za-z0-9-]/g, "").substr(0, 8);
}
const miniCache = {
  nodeModules: new Map()
};
function hasClass(classList, className) {
  if (!className)
    return false;
  for (const c of classList.split(" ")) {
    if (className === c.trim())
      return true;
  }
  return false;
}
async function transformStyle(code, {logging, type, filename, scopedClass, tailwindConfig, global}) {
  let styleType = "css";
  if (type) {
    styleType = getStyleType.get(type) || styleType;
  }
  let includePaths = [path.dirname(filename)];
  const cachedNodeModulesDir = miniCache.nodeModules.get(filename);
  if (cachedNodeModulesDir) {
    includePaths.push(cachedNodeModulesDir);
  } else {
    const nodeModulesDir = await findUp("node_modules", {type: "directory", cwd: path.dirname(filename)});
    if (nodeModulesDir) {
      miniCache.nodeModules.set(filename, nodeModulesDir);
      includePaths.push(nodeModulesDir);
    }
  }
  let css = "";
  switch (styleType) {
    case "css": {
      css = code;
      break;
    }
    case "sass":
    case "scss": {
      css = sass.renderSync({data: code, includePaths, indentedSyntax: styleType === "sass"}).css.toString("utf8");
      break;
    }
    default: {
      throw new Error(`Unsupported: <style lang="${styleType}">`);
    }
  }
  const postcssPlugins = [];
  if (tailwindConfig) {
    try {
      const require2 = createRequire(import.meta.url);
      const tw = require2.resolve("tailwindcss", {paths: [import.meta.url, process.cwd()]});
      postcssPlugins.push(require2(tw)(tailwindConfig));
    } catch (err) {
      error(logging, "transform", err);
      throw new Error(`tailwindcss not installed. Try running \`npm install tailwindcss\` and trying again.`);
    }
  }
  if (!global) {
    postcssPlugins.push(astroScopedStyles({className: scopedClass}));
    postcssPlugins.push(postcssKeyframes({
      generateScopedName(keyframesName) {
        return `${keyframesName}-${scopedClass}`;
      }
    }));
  }
  postcssPlugins.push(autoprefixer());
  css = await postcss(postcssPlugins).process(css, {from: filename, to: void 0}).then((result) => result.css);
  return {css, type: styleType};
}
function injectScopedClassAttribute(node, scopedClass, attribute = "class") {
  if (!node.attributes)
    node.attributes = [];
  const classIndex = node.attributes.findIndex(({name}) => name === attribute);
  if (classIndex === -1) {
    node.attributes.push({start: -1, end: -1, type: "Attribute", name: attribute, value: [{type: "Text", raw: scopedClass, data: scopedClass}]});
  } else {
    const attr = node.attributes[classIndex];
    for (let k = 0; k < attr.value.length; k++) {
      if (attr.value[k].type === "Text") {
        if (!hasClass(attr.value[k].data, scopedClass)) {
          attr.value[k].raw += " " + scopedClass;
          attr.value[k].data += " " + scopedClass;
        }
      } else if (attr.value[k].type === "MustacheTag" && attr.value[k]) {
        if (!attr.value[k].expression.codeChunks[0].includes(`' ${scopedClass}'`)) {
          attr.value[k].expression.codeChunks[0] = `(${attr.value[k].expression.codeChunks[0]}) + ' ${scopedClass}'`;
        }
      }
    }
  }
}
function transformStyles({compileOptions, filename, fileID}) {
  const styleNodes = [];
  const styleTransformPromises = [];
  const scopedClass = `astro-${hashFromFilename(fileID)}`;
  const nodesToScope = new Set();
  return {
    visitors: {
      html: {
        InlineComponent: {
          enter(node) {
            if (node.name === "Markdown") {
              injectScopedClassAttribute(node, scopedClass, "$scope");
            }
            for (let attr of node.attributes) {
              if (attr.name === "class") {
                injectScopedClassAttribute(node, scopedClass, "class");
                break;
              }
            }
          }
        },
        Element: {
          enter(node) {
            if (node.name === "style") {
              const code = Array.isArray(node.children) ? node.children.map(({data}) => data).join("\n") : "";
              if (!code)
                return;
              const langAttr = (node.attributes || []).find(({name}) => name === "lang");
              const globalAttr = (node.attributes || []).find(({name}) => name === "global");
              styleNodes.push(node);
              styleTransformPromises.push(transformStyle(code, {
                logging: compileOptions.logging,
                type: langAttr && langAttr.value[0] && langAttr.value[0].data || void 0,
                filename,
                scopedClass,
                tailwindConfig: compileOptions.astroConfig.devOptions.tailwindConfig,
                global: globalAttr && globalAttr.value
              }));
              return;
            }
            if (NEVER_SCOPED_TAGS.has(node.name) || node.name.toLowerCase() === "!doctype") {
              return;
            }
            nodesToScope.add(node);
          }
        }
      },
      css: {
        Style: {
          enter(node) {
            if (!node.content || !node.content.styles)
              return;
            const code = node.content.styles;
            const langAttr = (node.attributes || []).find(({name}) => name === "lang");
            const globalAttr = (node.attributes || []).find(({name}) => name === "global");
            styleNodes.push(node);
            styleTransformPromises.push(transformStyle(code, {
              logging: compileOptions.logging,
              type: langAttr && langAttr.value[0] && langAttr.value[0].data || void 0,
              filename,
              scopedClass,
              global: globalAttr && globalAttr.value
            }));
          }
        }
      }
    },
    async finalize() {
      const styleTransforms = await Promise.all(styleTransformPromises);
      if (styleTransforms.length > 0) {
        for (const node of nodesToScope.values()) {
          injectScopedClassAttribute(node, scopedClass);
        }
      }
      styleTransforms.forEach((result, n) => {
        if (styleNodes[n].attributes) {
          const isHeadStyle = !styleNodes[n].content;
          if (isHeadStyle) {
            styleNodes[n].children = [__spreadProps(__spreadValues({}, styleNodes[n].children[0]), {data: result.css})];
          } else {
            styleNodes[n].content.styles = result.css;
          }
          const styleTypeIndex = styleNodes[n].attributes.findIndex(({name}) => name === "type");
          if (styleTypeIndex !== -1) {
            styleNodes[n].attributes[styleTypeIndex].value[0].raw = "text/css";
            styleNodes[n].attributes[styleTypeIndex].value[0].data = "text/css";
          } else {
            styleNodes[n].attributes.push({name: "type", type: "Attribute", value: [{type: "Text", raw: "text/css", data: "text/css"}]});
          }
          const styleLangIndex = styleNodes[n].attributes.findIndex(({name}) => name === "lang");
          if (styleLangIndex !== -1)
            styleNodes[n].attributes.splice(styleLangIndex, 1);
        }
      });
    }
  };
}
export {
  transformStyles as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2NvbXBpbGVyL3RyYW5zZm9ybS9zdHlsZXMudHMiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVdBLE1BQU0sZUFBdUMsSUFBSSxJQUFJO0FBQUEsRUFDbkQsQ0FBQyxRQUFRO0FBQUEsRUFDVCxDQUFDLFNBQVM7QUFBQSxFQUNWLENBQUMsU0FBUztBQUFBLEVBQ1YsQ0FBQyxTQUFTO0FBQUEsRUFDVixDQUFDLE9BQU87QUFBQSxFQUNSLENBQUMsUUFBUTtBQUFBLEVBQ1QsQ0FBQyxRQUFRO0FBQUEsRUFDVCxDQUFDLFlBQVk7QUFBQSxFQUNiLENBQUMsYUFBYTtBQUFBLEVBQ2QsQ0FBQyxhQUFhO0FBQUE7QUFJaEIsMEJBQTBCLFVBQTBCO0FBQ2xELFFBQU0sT0FBTyxPQUFPLFdBQVc7QUFDL0IsU0FBTyxLQUNKLE9BQU8sTUFBTSxXQUNiLE9BQU8sVUFDUCxXQUNBLFFBQVEsa0JBQWtCLElBQzFCLE9BQU8sR0FBRztBQUFBO0FBYWYsTUFBTSxZQUE2QjtBQUFBLEVBQ2pDLGFBQWEsSUFBSTtBQUFBO0FBYW5CLGtCQUFrQixXQUFtQixXQUE0QjtBQUMvRCxNQUFJLENBQUM7QUFBVyxXQUFPO0FBQ3ZCLGFBQVcsS0FBSyxVQUFVLE1BQU0sTUFBTTtBQUNwQyxRQUFJLGNBQWMsRUFBRTtBQUFRLGFBQU87QUFBQTtBQUVyQyxTQUFPO0FBQUE7QUFJVCw4QkFBOEIsTUFBYyxDQUFFLFNBQVMsTUFBTSxVQUFVLGFBQWEsZ0JBQWdCLFNBQWdFO0FBQ2xLLE1BQUksWUFBdUI7QUFDM0IsTUFBSSxNQUFNO0FBQ1IsZ0JBQVksYUFBYSxJQUFJLFNBQVM7QUFBQTtBQUl4QyxNQUFJLGVBQXlCLENBQUMsS0FBSyxRQUFRO0FBRzNDLFFBQU0sdUJBQXVCLFVBQVUsWUFBWSxJQUFJO0FBQ3ZELE1BQUksc0JBQXNC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
