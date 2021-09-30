import {warn} from "./logger.js";
function convertMatchToLocation(routeMatch, astroConfig) {
  const url = new URL(`./${routeMatch.component}`, astroConfig.projectRoot);
  return {
    fileURL: url,
    snowpackURL: `/_astro/${routeMatch.component}.js`
  };
}
function validateGetStaticPathsModule(mod) {
  if (mod.exports.createCollection) {
    throw new Error(`[createCollection] deprecated. Please use getStaticPaths() instead.`);
  }
  if (!mod.exports.getStaticPaths) {
    throw new Error(`[getStaticPaths] getStaticPaths() function is required. Make sure that you \`export\` the function from your component.`);
  }
}
function validateGetStaticPathsResult(result, logging) {
  if (!Array.isArray(result)) {
    throw new Error(`[getStaticPaths] invalid return value. Expected an array of path objects, but got \`${JSON.stringify(result)}\`.`);
  }
  result.forEach((pathObject) => {
    if (!pathObject.params) {
      warn(logging, "getStaticPaths", `invalid path object. Expected an object with key \`params\`, but got \`${JSON.stringify(pathObject)}\`. Skipped.`);
      return;
    }
    for (const [key, val] of Object.entries(pathObject.params)) {
      if (!(typeof val === "undefined" || typeof val === "string")) {
        warn(logging, "getStaticPaths", `invalid path param: ${key}. A string value was expected, but got \`${JSON.stringify(val)}\`.`);
      }
      if (val === "") {
        warn(logging, "getStaticPaths", `invalid path param: ${key}. \`undefined\` expected for an optional param, but got empty string.`);
      }
    }
  });
}
function addLeadingSlash(path) {
  return path.replace(/^\/?/, "/");
}
function addTrailingSlash(path) {
  return path.replace(/\/?$/, "/");
}
export {
  addLeadingSlash,
  addTrailingSlash,
  convertMatchToLocation,
  validateGetStaticPathsModule,
  validateGetStaticPathsResult
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3V0aWwudHMiXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQVFPLGdDQUFnQyxZQUF1QixhQUF3QztBQUNwRyxRQUFNLE1BQU0sSUFBSSxJQUFJLEtBQUssV0FBVyxhQUFhLFlBQVk7QUFDN0QsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLElBQ1QsYUFBYSxXQUFXLFdBQVc7QUFBQTtBQUFBO0FBSWhDLHNDQUFzQyxLQUFVO0FBQ3JELE1BQUksSUFBSSxRQUFRLGtCQUFrQjtBQUNoQyxVQUFNLElBQUksTUFBTTtBQUFBO0FBRWxCLE1BQUksQ0FBQyxJQUFJLFFBQVEsZ0JBQWdCO0FBQy9CLFVBQU0sSUFBSSxNQUFNO0FBQUE7QUFBQTtBQUliLHNDQUFzQyxRQUE4QixTQUFxQjtBQUM5RixNQUFJLENBQUMsTUFBTSxRQUFRLFNBQVM7QUFDMUIsVUFBTSxJQUFJLE1BQU0sdUZBQXVGLEtBQUssVUFBVTtBQUFBO0FBRXhILFNBQU8sUUFBUSxDQUFDLGVBQWU7QUFDN0IsUUFBSSxDQUFDLFdBQVcsUUFBUTtBQUN0QixXQUFLLFNBQVMsa0JBQWtCLDBFQUEwRSxLQUFLLFVBQVU7QUFDekg7QUFBQTtBQUVGLGVBQVcsQ0FBQyxLQUFLLFFBQVEsT0FBTyxRQUFRLFdBQVcsU0FBUztBQUMxRCxVQUFJLENBQUUsUUFBTyxRQUFRLGVBQWUsT0FBTyxRQUFRLFdBQVc7QUFDNUQsYUFBSyxTQUFTLGtCQUFrQix1QkFBdUIsK0NBQStDLEtBQUssVUFBVTtBQUFBO0FBRXZILFVBQUksUUFBUSxJQUFJO0FBQ2QsYUFBSyxTQUFTLGtCQUFrQix1QkFBdUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU94RCx5QkFBeUIsTUFBYztBQUM1QyxTQUFPLEtBQUssUUFBUSxRQUFRO0FBQUE7QUFJdkIsMEJBQTBCLE1BQWM7QUFDN0MsU0FBTyxLQUFLLFFBQVEsUUFBUTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=
