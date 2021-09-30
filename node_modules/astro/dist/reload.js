import {clearCache} from "snowpack";
import {defaultLogDestination, defaultLogLevel, info} from "./logger.js";
const logging = {
  level: defaultLogLevel,
  dest: defaultLogDestination
};
async function reload() {
  try {
    info(logging, "reload", `Clearing the cache...`);
    await clearCache();
    return 0;
  } catch {
    return 1;
  }
}
export {
  reload
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3JlbG9hZC50cyJdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQ0E7QUFFQSxNQUFNLFVBQXNCO0FBQUEsRUFDMUIsT0FBTztBQUFBLEVBQ1AsTUFBTTtBQUFBO0FBR1Isd0JBQStCO0FBQzdCLE1BQUk7QUFDRixTQUFLLFNBQVMsVUFBVTtBQUN4QixVQUFNO0FBQ04sV0FBTztBQUFBLFVBQ1A7QUFDQSxXQUFPO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
