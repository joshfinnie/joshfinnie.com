var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  default: () => Stats
});
const now = typeof process !== "undefined" && process.hrtime ? () => {
  const t = process.hrtime();
  return t[0] * 1e3 + t[1] / 1e6;
} : () => self.performance.now();
function collapse_timings(timings) {
  const result = {};
  timings.forEach((timing) => {
    result[timing.label] = Object.assign({
      total: timing.end - timing.start
    }, timing.children && collapse_timings(timing.children));
  });
  return result;
}
class Stats {
  constructor() {
    this.start_time = now();
    this.stack = [];
    this.current_children = this.timings = [];
  }
  start(label) {
    const timing = {
      label,
      start: now(),
      end: null,
      children: []
    };
    this.current_children.push(timing);
    this.stack.push(timing);
    this.current_timing = timing;
    this.current_children = timing.children;
  }
  stop(label) {
    if (label !== this.current_timing.label) {
      throw new Error(`Mismatched timing labels (expected ${this.current_timing.label}, got ${label})`);
    }
    this.current_timing.end = now();
    this.stack.pop();
    this.current_timing = this.stack[this.stack.length - 1];
    this.current_children = this.current_timing ? this.current_timing.children : this.timings;
  }
  render() {
    const timings = Object.assign({
      total: now() - this.start_time
    }, collapse_timings(this.timings));
    return {
      timings
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL1N0YXRzLnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQSxNQUFNLE1BQ0osT0FBTyxZQUFZLGVBQWUsUUFBUSxTQUN0QyxNQUFNO0FBQ0osUUFBTSxJQUFJLFFBQVE7QUFDbEIsU0FBTyxFQUFFLEtBQUssTUFBTSxFQUFFLEtBQUs7QUFBQSxJQUU3QixNQUFNLEtBQUssWUFBWTtBQVU3QiwwQkFBMEIsU0FBUztBQUNqQyxRQUFNLFNBQVM7QUFDZixVQUFRLFFBQVEsQ0FBQyxXQUFXO0FBQzFCLFdBQU8sT0FBTyxTQUFTLE9BQU8sT0FDNUI7QUFBQSxNQUNFLE9BQU8sT0FBTyxNQUFNLE9BQU87QUFBQSxPQUU3QixPQUFPLFlBQVksaUJBQWlCLE9BQU87QUFBQTtBQUcvQyxTQUFPO0FBQUE7QUFHVCxZQUEyQjtBQUFBLEVBT3pCLGNBQWM7QUFDWixTQUFLLGFBQWE7QUFDbEIsU0FBSyxRQUFRO0FBQ2IsU0FBSyxtQkFBbUIsS0FBSyxVQUFVO0FBQUE7QUFBQSxFQUd6QyxNQUFNLE9BQU87QUFDWCxVQUFNLFNBQVM7QUFBQSxNQUNiO0FBQUEsTUFDQSxPQUFPO0FBQUEsTUFDUCxLQUFLO0FBQUEsTUFDTCxVQUFVO0FBQUE7QUFHWixTQUFLLGlCQUFpQixLQUFLO0FBQzNCLFNBQUssTUFBTSxLQUFLO0FBRWhCLFNBQUssaUJBQWlCO0FBQ3RCLFNBQUssbUJBQW1CLE9BQU87QUFBQTtBQUFBLEVBR2pDLEtBQUssT0FBTztBQUNWLFFBQUksVUFBVSxLQUFLLGVBQWUsT0FBTztBQUN2QyxZQUFNLElBQUksTUFBTSxzQ0FBc0MsS0FBSyxlQUFlLGNBQWM7QUFBQTtBQUcxRixTQUFLLGVBQWUsTUFBTTtBQUMxQixTQUFLLE1BQU07QUFDWCxTQUFLLGlCQUFpQixLQUFLLE1BQU0sS0FBSyxNQUFNLFNBQVM7QUFDckQsU0FBSyxtQkFBbUIsS0FBSyxpQkFBaUIsS0FBSyxlQUFlLFdBQVcsS0FBSztBQUFBO0FBQUEsRUFHcEYsU0FBUztBQUNQLFVBQU0sVUFBVSxPQUFPLE9BQ3JCO0FBQUEsTUFDRSxPQUFPLFFBQVEsS0FBSztBQUFBLE9BRXRCLGlCQUFpQixLQUFLO0FBR3hCLFdBQU87QUFBQSxNQUNMO0FBQUE7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
