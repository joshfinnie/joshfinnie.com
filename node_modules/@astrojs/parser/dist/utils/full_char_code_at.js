var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  default: () => full_char_code_at
});
function full_char_code_at(str, i) {
  const code = str.charCodeAt(i);
  if (code <= 55295 || code >= 57344)
    return code;
  const next = str.charCodeAt(i + 1);
  return (code << 10) + next - 56613888;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3V0aWxzL2Z1bGxfY2hhcl9jb2RlX2F0LnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJZSwyQkFBMkIsS0FBYSxHQUFtQjtBQUN4RSxRQUFNLE9BQU8sSUFBSSxXQUFXO0FBQzVCLE1BQUksUUFBUSxTQUFVLFFBQVE7QUFBUSxXQUFPO0FBRTdDLFFBQU0sT0FBTyxJQUFJLFdBQVcsSUFBSTtBQUNoQyxTQUFRLFNBQVEsTUFBTSxPQUFPO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
