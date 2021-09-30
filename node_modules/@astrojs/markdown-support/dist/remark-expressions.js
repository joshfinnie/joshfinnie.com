import {mdxExpression} from "micromark-extension-mdx-expression";
import {mdxExpressionFromMarkdown, mdxExpressionToMarkdown} from "mdast-util-mdx-expression";
function remarkExpressions(options) {
  let settings = options || {};
  let data = this.data();
  add("micromarkExtensions", mdxExpression({}));
  add("fromMarkdownExtensions", mdxExpressionFromMarkdown);
  add("toMarkdownExtensions", mdxExpressionToMarkdown);
  function add(field, value) {
    if (data[field])
      data[field].push(value);
    else
      data[field] = [value];
  }
}
var remark_expressions_default = remarkExpressions;
export {
  remark_expressions_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3JlbWFyay1leHByZXNzaW9ucy50cyJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQ0E7QUFFQSwyQkFBc0MsU0FBYztBQUNsRCxNQUFJLFdBQVcsV0FBVztBQUMxQixNQUFJLE9BQU8sS0FBSztBQUVoQixNQUFJLHVCQUF1QixjQUFjO0FBQ3pDLE1BQUksMEJBQTBCO0FBQzlCLE1BQUksd0JBQXdCO0FBRTVCLGVBQWEsT0FBWSxPQUFZO0FBRW5DLFFBQUksS0FBSztBQUFRLFdBQUssT0FBTyxLQUFLO0FBQUE7QUFDN0IsV0FBSyxTQUFTLENBQUM7QUFBQTtBQUFBO0FBSXhCLElBQU8sNkJBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
