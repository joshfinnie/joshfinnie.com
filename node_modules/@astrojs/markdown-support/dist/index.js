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
import createCollectHeaders from "./rehype-collect-headers.js";
import scopedStyles from "./remark-scoped-styles.js";
import remarkExpressions from "./remark-expressions.js";
import rehypeExpressions from "./rehype-expressions.js";
import {remarkCodeBlock, rehypeCodeBlock} from "./codeblock.js";
import {loadPlugins} from "./load-plugins.js";
import raw from "rehype-raw";
import {unified} from "unified";
import markdown from "remark-parse";
import markdownToHtml from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkSlug from "remark-slug";
async function renderMarkdownWithFrontmatter(contents, opts) {
  const {default: matter} = await import("gray-matter");
  const {data: frontmatter, content} = matter(contents);
  const value = await renderMarkdown(content, opts);
  return __spreadProps(__spreadValues({}, value), {frontmatter});
}
async function renderMarkdown(content, opts) {
  const {$: {scopedClassName = null} = {}, footnotes: useFootnotes = true, gfm: useGfm = true, remarkPlugins = [], rehypePlugins = []} = opts != null ? opts : {};
  const {headers, rehypeCollectHeaders} = createCollectHeaders();
  let parser = unified().use(markdown).use(remarkSlug).use([remarkExpressions, {addResult: true}]);
  if (remarkPlugins.length === 0) {
    if (useGfm) {
      remarkPlugins.push("remark-gfm");
    }
    if (useFootnotes) {
      remarkPlugins.push("remark-footnotes");
    }
    remarkPlugins.push("@silvenon/remark-smartypants");
  }
  const loadedRemarkPlugins = await Promise.all(loadPlugins(remarkPlugins));
  const loadedRehypePlugins = await Promise.all(loadPlugins(rehypePlugins));
  loadedRemarkPlugins.forEach(([plugin, opts2]) => {
    parser.use(plugin, opts2);
  });
  if (scopedClassName) {
    parser.use(scopedStyles(scopedClassName));
  }
  parser.use(remarkCodeBlock);
  parser.use(markdownToHtml, {allowDangerousHtml: true, passThrough: ["raw", "mdxTextExpression"]});
  parser.use(rehypeExpressions);
  loadedRehypePlugins.forEach(([plugin, opts2]) => {
    parser.use(plugin, opts2);
  });
  let result;
  try {
    const vfile = await parser.use(raw).use(rehypeCollectHeaders).use(rehypeCodeBlock).use(rehypeStringify, {entities: {useNamedReferences: true}}).process(content);
    result = vfile.toString();
  } catch (err) {
    throw err;
  }
  return {
    astro: {headers, source: content, html: result.toString()},
    content: result.toString()
  };
}
export {
  renderMarkdown,
  renderMarkdownWithFrontmatter
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2luZGV4LnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBLDZDQUFvRCxVQUFrQixNQUF3QztBQUU1RyxRQUFNLENBQUUsU0FBUyxVQUFXLE1BQU0sT0FBTztBQUN6QyxRQUFNLENBQUUsTUFBTSxhQUFhLFdBQVksT0FBTztBQUM5QyxRQUFNLFFBQVEsTUFBTSxlQUFlLFNBQVM7QUFDNUMsU0FBTyxpQ0FBSyxRQUFMLENBQVk7QUFBQTtBQUlyQiw4QkFBcUMsU0FBaUIsTUFBd0M7QUFDNUYsUUFBTSxDQUFFLEdBQUcsQ0FBRSxrQkFBa0IsUUFBUyxJQUFJLFdBQVcsZUFBZSxNQUFNLEtBQUssU0FBUyxNQUFNLGdCQUFnQixJQUFJLGdCQUFnQixNQUFPLHNCQUFRO0FBQ25KLFFBQU0sQ0FBRSxTQUFTLHdCQUF5QjtBQUMxQyxNQUFJLFNBQVMsVUFDVixJQUFJLFVBQ0osSUFBSSxZQUNKLElBQUksQ0FBQyxtQkFBbUIsQ0FBRSxXQUFXO0FBRXhDLE1BQUksY0FBYyxXQUFXLEdBQUc7QUFDOUIsUUFBSSxRQUFRO0FBQ1Ysb0JBQWMsS0FBSztBQUFBO0FBR3JCLFFBQUksY0FBYztBQUNoQixvQkFBYyxLQUFLO0FBQUE7QUFHckIsa0JBQWMsS0FBSztBQUFBO0FBRXJCLFFBQU0sc0JBQXNCLE1BQU0sUUFBUSxJQUFJLFlBQVk7QUFDMUQsUUFBTSxzQkFBc0IsTUFBTSxRQUFRLElBQUksWUFBWTtBQUUxRCxzQkFBb0IsUUFBUSxDQUFDLENBQUMsUUFBUSxXQUFVO0FBQzlDLFdBQU8sSUFBSSxRQUFRO0FBQUE7QUFHckIsTUFBSSxpQkFBaUI7QUFDbkIsV0FBTyxJQUFJLGFBQWE7QUFBQTtBQUcxQixTQUFPLElBQUk7QUFDWCxTQUFPLElBQUksZ0JBQWdCLENBQUUsb0JBQW9CLE1BQU0sYUFBYSxDQUFDLE9BQU87QUFDNUUsU0FBTyxJQUFJO0FBRVgsc0JBQW9CLFFBQVEsQ0FBQyxDQUFDLFFBQVEsV0FBVTtBQUM5QyxXQUFPLElBQUksUUFBUTtBQUFBO0FBR3JCLE1BQUk7QUFDSixNQUFJO0FBQ0YsVUFBTSxRQUFRLE1BQU0sT0FDakIsSUFBSSxLQUNKLElBQUksc0JBQ0osSUFBSSxpQkFDSixJQUFJLGlCQUFpQixDQUFFLFVBQVUsQ0FBRSxvQkFBb0IsUUFDdkQsUUFBUTtBQUNYLGFBQVMsTUFBTTtBQUFBLFdBQ1IsS0FBUDtBQUNBLFVBQU07QUFBQTtBQUdSLFNBQU87QUFBQSxJQUNMLE9BQU8sQ0FBRSxTQUFTLFFBQVEsU0FBUyxNQUFNLE9BQU87QUFBQSxJQUNoRCxTQUFTLE9BQU87QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
