var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  default: () => read_script
});
const script_closing_tag = "</script>";
function get_context(parser, attributes, start) {
  const context = attributes.find((attribute) => attribute.name === "astro");
  if (!context)
    return "runtime";
  if (context.value === true)
    return "setup";
  if (context.value.length !== 1 || context.value[0].type !== "Text") {
    parser.error({
      code: "invalid-script",
      message: "astro attribute must be static"
    }, start);
  }
  const value = context.value[0].data;
  if (value !== "setup") {
    parser.error({
      code: "invalid-script",
      message: 'If the "astro" attribute has a value, its value must be "setup"'
    }, context.start);
  }
  return value;
}
function read_script(parser, start, attributes) {
  const script_start = parser.index;
  const script_end = parser.template.indexOf(script_closing_tag, script_start);
  if (script_end === -1) {
    parser.error({
      code: "unclosed-script",
      message: "<script> must have a closing tag"
    });
  }
  const source = parser.template.slice(0, script_start).replace(/[^\n]/g, " ") + parser.template.slice(script_start, script_end);
  parser.index = script_end + script_closing_tag.length;
  return {
    type: "Script",
    start,
    end: parser.index,
    context: get_context(parser, attributes, start),
    content: source
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3JlYWQvc2NyaXB0LnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQSxNQUFNLHFCQUFxQjtBQUUzQixxQkFBcUIsUUFBZ0IsWUFBbUIsT0FBb0M7QUFDMUYsUUFBTSxVQUFVLFdBQVcsS0FBSyxDQUFDLGNBQWMsVUFBVSxTQUFTO0FBQ2xFLE1BQUksQ0FBQztBQUFTLFdBQU87QUFDckIsTUFBSSxRQUFRLFVBQVU7QUFBTSxXQUFPO0FBRW5DLE1BQUksUUFBUSxNQUFNLFdBQVcsS0FBSyxRQUFRLE1BQU0sR0FBRyxTQUFTLFFBQVE7QUFDbEUsV0FBTyxNQUNMO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixTQUFTO0FBQUEsT0FFWDtBQUFBO0FBSUosUUFBTSxRQUFRLFFBQVEsTUFBTSxHQUFHO0FBRS9CLE1BQUksVUFBVSxTQUFTO0FBQ3JCLFdBQU8sTUFDTDtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLE9BRVgsUUFBUTtBQUFBO0FBSVosU0FBTztBQUFBO0FBR00scUJBQXFCLFFBQWdCLE9BQWUsWUFBNEI7QUFDN0YsUUFBTSxlQUFlLE9BQU87QUFDNUIsUUFBTSxhQUFhLE9BQU8sU0FBUyxRQUFRLG9CQUFvQjtBQUUvRCxNQUFJLGVBQWUsSUFBSTtBQUNyQixXQUFPLE1BQU07QUFBQSxNQUNYLE1BQU07QUFBQSxNQUNOLFNBQVM7QUFBQTtBQUFBO0FBSWIsUUFBTSxTQUFTLE9BQU8sU0FBUyxNQUFNLEdBQUcsY0FBYyxRQUFRLFVBQVUsT0FBTyxPQUFPLFNBQVMsTUFBTSxjQUFjO0FBQ25ILFNBQU8sUUFBUSxhQUFhLG1CQUFtQjtBQUUvQyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTjtBQUFBLElBQ0EsS0FBSyxPQUFPO0FBQUEsSUFDWixTQUFTLFlBQVksUUFBUSxZQUFZO0FBQUEsSUFDekMsU0FBUztBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
