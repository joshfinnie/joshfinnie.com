var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  get_bracket_close: () => get_bracket_close,
  is_bracket_close: () => is_bracket_close,
  is_bracket_open: () => is_bracket_open,
  is_bracket_pair: () => is_bracket_pair
});
const SQUARE_BRACKET_OPEN = "[".charCodeAt(0);
const SQUARE_BRACKET_CLOSE = "]".charCodeAt(0);
const CURLY_BRACKET_OPEN = "{".charCodeAt(0);
const CURLY_BRACKET_CLOSE = "}".charCodeAt(0);
function is_bracket_open(code) {
  return code === SQUARE_BRACKET_OPEN || code === CURLY_BRACKET_OPEN;
}
function is_bracket_close(code) {
  return code === SQUARE_BRACKET_CLOSE || code === CURLY_BRACKET_CLOSE;
}
function is_bracket_pair(open, close) {
  return open === SQUARE_BRACKET_OPEN && close === SQUARE_BRACKET_CLOSE || open === CURLY_BRACKET_OPEN && close === CURLY_BRACKET_CLOSE;
}
function get_bracket_close(open) {
  if (open === SQUARE_BRACKET_OPEN) {
    return SQUARE_BRACKET_CLOSE;
  }
  if (open === CURLY_BRACKET_OPEN) {
    return CURLY_BRACKET_CLOSE;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  get_bracket_close,
  is_bracket_close,
  is_bracket_open,
  is_bracket_pair
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3V0aWxzL2JyYWNrZXQudHMiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBLE1BQU0sc0JBQXNCLElBQUksV0FBVztBQUMzQyxNQUFNLHVCQUF1QixJQUFJLFdBQVc7QUFDNUMsTUFBTSxxQkFBcUIsSUFBSSxXQUFXO0FBQzFDLE1BQU0sc0JBQXNCLElBQUksV0FBVztBQUVwQyx5QkFBeUIsTUFBTTtBQUNwQyxTQUFPLFNBQVMsdUJBQXVCLFNBQVM7QUFBQTtBQUczQywwQkFBMEIsTUFBTTtBQUNyQyxTQUFPLFNBQVMsd0JBQXdCLFNBQVM7QUFBQTtBQUc1Qyx5QkFBeUIsTUFBTSxPQUFPO0FBQzNDLFNBQVEsU0FBUyx1QkFBdUIsVUFBVSx3QkFBMEIsU0FBUyxzQkFBc0IsVUFBVTtBQUFBO0FBR2hILDJCQUEyQixNQUFNO0FBQ3RDLE1BQUksU0FBUyxxQkFBcUI7QUFDaEMsV0FBTztBQUFBO0FBRVQsTUFBSSxTQUFTLG9CQUFvQjtBQUMvQixXQUFPO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
