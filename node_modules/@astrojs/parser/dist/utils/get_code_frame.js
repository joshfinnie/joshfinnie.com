var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  default: () => get_code_frame
});
function tabs_to_spaces(str) {
  return str.replace(/^\t+/, (match) => match.split("	").join("  "));
}
function get_code_frame(source, line, column) {
  const lines = source.split("\n");
  const frame_start = Math.max(0, line - 2);
  const frame_end = Math.min(line + 3, lines.length);
  const digits = String(frame_end + 1).length;
  return lines.slice(frame_start, frame_end).map((str, i) => {
    const isErrorLine = frame_start + i === line;
    const line_num = String(i + frame_start + 1).padStart(digits, " ");
    if (isErrorLine) {
      const indicator = " ".repeat(digits + 2 + tabs_to_spaces(str.slice(0, column)).length) + "^";
      return `${line_num}: ${tabs_to_spaces(str)}
${indicator}`;
    }
    return `${line_num}: ${tabs_to_spaces(str)}`;
  }).join("\n");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3V0aWxzL2dldF9jb2RlX2ZyYW1lLnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQSx3QkFBd0IsS0FBYTtBQUNuQyxTQUFPLElBQUksUUFBUSxRQUFRLENBQUMsVUFBVSxNQUFNLE1BQU0sS0FBTSxLQUFLO0FBQUE7QUFJaEQsd0JBQXdCLFFBQWdCLE1BQWMsUUFBZ0I7QUFDbkYsUUFBTSxRQUFRLE9BQU8sTUFBTTtBQUUzQixRQUFNLGNBQWMsS0FBSyxJQUFJLEdBQUcsT0FBTztBQUN2QyxRQUFNLFlBQVksS0FBSyxJQUFJLE9BQU8sR0FBRyxNQUFNO0FBRTNDLFFBQU0sU0FBUyxPQUFPLFlBQVksR0FBRztBQUVyQyxTQUFPLE1BQ0osTUFBTSxhQUFhLFdBQ25CLElBQUksQ0FBQyxLQUFLLE1BQU07QUFDZixVQUFNLGNBQWMsY0FBYyxNQUFNO0FBQ3hDLFVBQU0sV0FBVyxPQUFPLElBQUksY0FBYyxHQUFHLFNBQVMsUUFBUTtBQUU5RCxRQUFJLGFBQWE7QUFDZixZQUFNLFlBQVksSUFBSSxPQUFPLFNBQVMsSUFBSSxlQUFlLElBQUksTUFBTSxHQUFHLFNBQVMsVUFBVTtBQUN6RixhQUFPLEdBQUcsYUFBYSxlQUFlO0FBQUEsRUFBUztBQUFBO0FBR2pELFdBQU8sR0FBRyxhQUFhLGVBQWU7QUFBQSxLQUV2QyxLQUFLO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
