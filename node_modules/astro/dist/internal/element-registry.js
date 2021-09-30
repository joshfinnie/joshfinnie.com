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
class AstroElementRegistry {
  constructor(options) {
    this.cache = new Map();
    this.candidates = options.candidates;
  }
  find(tagName) {
    for (let [module, importSpecifier] of this.candidates) {
      if (module && typeof module.tagName === "string") {
        if (module.tagName === tagName) {
          return importSpecifier;
        }
      }
    }
  }
  findCached(tagName) {
    if (this.cache.has(tagName)) {
      return this.cache.get(tagName);
    }
    let specifier = this.find(tagName);
    if (specifier) {
      this.cache.set(tagName, specifier);
    }
    return specifier;
  }
  astroComponentArgs(tagName, metadata) {
    const specifier = this.findCached(tagName);
    const outMeta = __spreadProps(__spreadValues({}, metadata), {
      componentUrl: specifier || metadata.componentUrl
    });
    return [tagName, outMeta];
  }
}
export {
  AstroElementRegistry
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2ludGVybmFsL2VsZW1lbnQtcmVnaXN0cnkudHMiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0EsMkJBQTJCO0FBQUEsRUFJekIsWUFBWSxTQUEwQjtBQUY5QixpQkFBNkIsSUFBSTtBQUd2QyxTQUFLLGFBQWEsUUFBUTtBQUFBO0FBQUEsRUFHNUIsS0FBSyxTQUFpQjtBQUNwQixhQUFTLENBQUMsUUFBUSxvQkFBb0IsS0FBSyxZQUFZO0FBQ3JELFVBQUksVUFBVSxPQUFPLE9BQU8sWUFBWSxVQUFVO0FBQ2hELFlBQUksT0FBTyxZQUFZLFNBQVM7QUFFOUIsaUJBQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTWYsV0FBVyxTQUFpQjtBQUMxQixRQUFJLEtBQUssTUFBTSxJQUFJLFVBQVU7QUFDM0IsYUFBTyxLQUFLLE1BQU0sSUFBSTtBQUFBO0FBRXhCLFFBQUksWUFBWSxLQUFLLEtBQUs7QUFDMUIsUUFBSSxXQUFXO0FBQ2IsV0FBSyxNQUFNLElBQUksU0FBUztBQUFBO0FBRTFCLFdBQU87QUFBQTtBQUFBLEVBR1QsbUJBQW1CLFNBQWlCLFVBQWtDO0FBQ3BFLFVBQU0sWUFBWSxLQUFLLFdBQVc7QUFDbEMsVUFBTSxVQUFrQyxpQ0FDbkMsV0FEbUM7QUFBQSxNQUV0QyxjQUFjLGFBQWEsU0FBUztBQUFBO0FBRXRDLFdBQU8sQ0FBQyxTQUFTO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
