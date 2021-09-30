var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};
__markAsModule(exports);
__export(exports, {
  closing_tag_omitted: () => closing_tag_omitted,
  decode_character_references: () => decode_character_references
});
var import_entities = __toModule(require("./entities.js"));
const windows_1252 = [
  8364,
  129,
  8218,
  402,
  8222,
  8230,
  8224,
  8225,
  710,
  8240,
  352,
  8249,
  338,
  141,
  381,
  143,
  144,
  8216,
  8217,
  8220,
  8221,
  8226,
  8211,
  8212,
  732,
  8482,
  353,
  8250,
  339,
  157,
  382,
  376
];
const entity_pattern = new RegExp(`&(#?(?:x[\\w\\d]+|\\d+|${Object.keys(import_entities.default).join("|")}))(?:;|\\b)`, "g");
function decode_character_references(html) {
  return html.replace(entity_pattern, (match, entity) => {
    let code;
    if (entity[0] !== "#") {
      code = import_entities.default[entity];
    } else if (entity[1] === "x") {
      code = parseInt(entity.substring(2), 16);
    } else {
      code = parseInt(entity.substring(1), 10);
    }
    if (!code) {
      return match;
    }
    return String.fromCodePoint(validate_code(code));
  });
}
const NUL = 0;
function validate_code(code) {
  if (code === 10) {
    return 32;
  }
  if (code < 128) {
    return code;
  }
  if (code <= 159) {
    return windows_1252[code - 128];
  }
  if (code < 55296) {
    return code;
  }
  if (code <= 57343) {
    return NUL;
  }
  if (code <= 65535) {
    return code;
  }
  if (code >= 65536 && code <= 131071) {
    return code;
  }
  if (code >= 131072 && code <= 196607) {
    return code;
  }
  return NUL;
}
const disallowed_contents = new Map([
  ["li", new Set(["li"])],
  ["dt", new Set(["dt", "dd"])],
  ["dd", new Set(["dt", "dd"])],
  ["p", new Set("address article aside blockquote div dl fieldset footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul".split(" "))],
  ["rt", new Set(["rt", "rp"])],
  ["rp", new Set(["rt", "rp"])],
  ["optgroup", new Set(["optgroup"])],
  ["option", new Set(["option", "optgroup"])],
  ["thead", new Set(["tbody", "tfoot"])],
  ["tbody", new Set(["tbody", "tfoot"])],
  ["tfoot", new Set(["tbody"])],
  ["tr", new Set(["tr", "tbody"])],
  ["td", new Set(["td", "th", "tr"])],
  ["th", new Set(["td", "th", "tr"])]
]);
function closing_tag_omitted(current, next) {
  if (disallowed_contents.has(current)) {
    if (!next || disallowed_contents.get(current).has(next)) {
      return true;
    }
  }
  return false;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  closing_tag_omitted,
  decode_character_references
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL3BhcnNlL3V0aWxzL2h0bWwudHMiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBLHNCQUFxQjtBQUVyQixNQUFNLGVBQWU7QUFBQSxFQUNuQjtBQUFBLEVBQU07QUFBQSxFQUFLO0FBQUEsRUFBTTtBQUFBLEVBQUs7QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBSztBQUFBLEVBQU07QUFBQSxFQUFLO0FBQUEsRUFBTTtBQUFBLEVBQUs7QUFBQSxFQUFLO0FBQUEsRUFBSztBQUFBLEVBQUs7QUFBQSxFQUFLO0FBQUEsRUFBTTtBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQU07QUFBQSxFQUFNO0FBQUEsRUFBTTtBQUFBLEVBQUs7QUFBQSxFQUFNO0FBQUEsRUFBSztBQUFBLEVBQU07QUFBQSxFQUFLO0FBQUEsRUFBSztBQUFBLEVBQUs7QUFBQTtBQUc5SyxNQUFNLGlCQUFpQixJQUFJLE9BQU8sMEJBQTBCLE9BQU8sS0FBSyx5QkFBVSxLQUFLLG1CQUFtQjtBQUVuRyxxQ0FBcUMsTUFBYztBQUN4RCxTQUFPLEtBQUssUUFBUSxnQkFBZ0IsQ0FBQyxPQUFPLFdBQVc7QUFDckQsUUFBSTtBQUdKLFFBQUksT0FBTyxPQUFPLEtBQUs7QUFDckIsYUFBTyx3QkFBUztBQUFBLGVBQ1AsT0FBTyxPQUFPLEtBQUs7QUFDNUIsYUFBTyxTQUFTLE9BQU8sVUFBVSxJQUFJO0FBQUEsV0FDaEM7QUFDTCxhQUFPLFNBQVMsT0FBTyxVQUFVLElBQUk7QUFBQTtBQUd2QyxRQUFJLENBQUMsTUFBTTtBQUNULGFBQU87QUFBQTtBQUdULFdBQU8sT0FBTyxjQUFjLGNBQWM7QUFBQTtBQUFBO0FBSTlDLE1BQU0sTUFBTTtBQU9aLHVCQUF1QixNQUFjO0FBRW5DLE1BQUksU0FBUyxJQUFJO0FBQ2YsV0FBTztBQUFBO0FBSVQsTUFBSSxPQUFPLEtBQUs7QUFDZCxXQUFPO0FBQUE7QUFLVCxNQUFJLFFBQVEsS0FBSztBQUNmLFdBQU8sYUFBYSxPQUFPO0FBQUE7QUFJN0IsTUFBSSxPQUFPLE9BQU87QUFDaEIsV0FBTztBQUFBO0FBSVQsTUFBSSxRQUFRLE9BQU87QUFDakIsV0FBTztBQUFBO0FBSVQsTUFBSSxRQUFRLE9BQU87QUFDakIsV0FBTztBQUFBO0FBSVQsTUFBSSxRQUFRLFNBQVMsUUFBUSxRQUFRO0FBQ25DLFdBQU87QUFBQTtBQUlULE1BQUksUUFBUSxVQUFVLFFBQVEsUUFBUTtBQUNwQyxXQUFPO0FBQUE7QUFHVCxTQUFPO0FBQUE7QUFJVCxNQUFNLHNCQUFzQixJQUFJLElBQUk7QUFBQSxFQUNsQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7QUFBQSxFQUNoQixDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTTtBQUFBLEVBQ3RCLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNO0FBQUEsRUFDdEIsQ0FBQyxLQUFLLElBQUksSUFBSSwwSUFBMEksTUFBTTtBQUFBLEVBQzlKLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNO0FBQUEsRUFDdEIsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU07QUFBQSxFQUN0QixDQUFDLFlBQVksSUFBSSxJQUFJLENBQUM7QUFBQSxFQUN0QixDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVTtBQUFBLEVBQzlCLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTO0FBQUEsRUFDNUIsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVM7QUFBQSxFQUM1QixDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUM7QUFBQSxFQUNuQixDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTTtBQUFBLEVBQ3RCLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLE1BQU07QUFBQSxFQUM1QixDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxNQUFNO0FBQUE7QUFLdkIsNkJBQTZCLFNBQWlCLE1BQWU7QUFDbEUsTUFBSSxvQkFBb0IsSUFBSSxVQUFVO0FBQ3BDLFFBQUksQ0FBQyxRQUFRLG9CQUFvQixJQUFJLFNBQVMsSUFBSSxPQUFPO0FBQ3ZELGFBQU87QUFBQTtBQUFBO0FBSVgsU0FBTztBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
