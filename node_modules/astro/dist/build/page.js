import _path from "path";
import {fileURLToPath} from "url";
import {convertMatchToLocation, validateGetStaticPathsModule, validateGetStaticPathsResult} from "../util.js";
import {generatePaginateFunction} from "./paginate.js";
import {generateRssFunction} from "./rss.js";
async function getStaticPathsForPage({
  astroConfig,
  astroRuntime,
  snowpackRuntime,
  route,
  logging
}) {
  const location = convertMatchToLocation(route, astroConfig);
  const mod = await snowpackRuntime.importModule(location.snowpackURL);
  validateGetStaticPathsModule(mod);
  const [rssFunction, rssResult] = generateRssFunction(astroConfig.buildOptions.site, route);
  const staticPaths = await astroRuntime.getStaticPaths(route.component, mod, {
    paginate: generatePaginateFunction(route),
    rss: rssFunction
  });
  validateGetStaticPathsResult(staticPaths, logging);
  return {
    paths: staticPaths.map((staticPath) => staticPath.params && route.generate(staticPath.params)).filter(Boolean),
    rss: rssResult
  };
}
function formatOutFile(path, pageUrlFormat) {
  if (path === "/404") {
    return "/404.html";
  }
  if (path === "/") {
    return "/index.html";
  }
  if (pageUrlFormat === "directory") {
    return _path.posix.join(path, "/index.html");
  }
  return `${path}.html`;
}
async function buildStaticPage({astroConfig, buildState, path, route, astroRuntime}) {
  const location = convertMatchToLocation(route, astroConfig);
  const normalizedPath = astroConfig.devOptions.trailingSlash === "never" ? path : path.endsWith("/") ? path : `${path}/`;
  const result = await astroRuntime.load(normalizedPath);
  if (result.statusCode !== 200) {
    let err = result.error;
    if (!(err instanceof Error))
      err = new Error(err);
    err.filename = fileURLToPath(location.fileURL);
    throw err;
  }
  buildState[formatOutFile(path, astroConfig.buildOptions.pageUrlFormat)] = {
    srcPath: location.fileURL,
    contents: result.contents,
    contentType: "text/html",
    encoding: "utf8"
  };
}
export {
  buildStaticPage,
  getStaticPathsForPage
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2J1aWxkL3BhZ2UudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBV0EscUNBQTRDO0FBQUEsRUFDMUM7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsR0FPeUM7QUFDekMsUUFBTSxXQUFXLHVCQUF1QixPQUFPO0FBQy9DLFFBQU0sTUFBTSxNQUFNLGdCQUFnQixhQUFhLFNBQVM7QUFDeEQsK0JBQTZCO0FBQzdCLFFBQU0sQ0FBQyxhQUFhLGFBQWEsb0JBQW9CLFlBQVksYUFBYSxNQUFNO0FBQ3BGLFFBQU0sY0FBYyxNQUFNLGFBQWEsZUFBZSxNQUFNLFdBQVcsS0FBSztBQUFBLElBQzFFLFVBQVUseUJBQXlCO0FBQUEsSUFDbkMsS0FBSztBQUFBO0FBRVAsK0JBQTZCLGFBQWE7QUFDMUMsU0FBTztBQUFBLElBQ0wsT0FBTyxZQUFZLElBQUksQ0FBQyxlQUFlLFdBQVcsVUFBVSxNQUFNLFNBQVMsV0FBVyxTQUFTLE9BQU87QUFBQSxJQUN0RyxLQUFLO0FBQUE7QUFBQTtBQUlULHVCQUF1QixNQUFjLGVBQTZEO0FBQ2hHLE1BQUksU0FBUyxRQUFRO0FBQ25CLFdBQU87QUFBQTtBQUVULE1BQUksU0FBUyxLQUFLO0FBQ2hCLFdBQU87QUFBQTtBQUVULE1BQUksa0JBQWtCLGFBQWE7QUFDakMsV0FBTyxNQUFNLE1BQU0sS0FBSyxNQUFNO0FBQUE7QUFFaEMsU0FBTyxHQUFHO0FBQUE7QUFHWiwrQkFBc0MsQ0FBRSxhQUFhLFlBQVksTUFBTSxPQUFPLGVBQWlEO0FBQzdILFFBQU0sV0FBVyx1QkFBdUIsT0FBTztBQUMvQyxRQUFNLGlCQUFpQixZQUFZLFdBQVcsa0JBQWtCLFVBQVUsT0FBTyxLQUFLLFNBQVMsT0FBTyxPQUFPLEdBQUc7QUFDaEgsUUFBTSxTQUFTLE1BQU0sYUFBYSxLQUFLO0FBQ3ZDLE1BQUksT0FBTyxlQUFlLEtBQUs7QUFDN0IsUUFBSSxNQUFPLE9BQWU7QUFDMUIsUUFBSSxDQUFFLGdCQUFlO0FBQVEsWUFBTSxJQUFJLE1BQU07QUFDN0MsUUFBSSxXQUFXLGNBQWMsU0FBUztBQUN0QyxVQUFNO0FBQUE7QUFFUixhQUFXLGNBQWMsTUFBTSxZQUFZLGFBQWEsa0JBQWtCO0FBQUEsSUFDeEUsU0FBUyxTQUFTO0FBQUEsSUFDbEIsVUFBVSxPQUFPO0FBQUEsSUFDakIsYUFBYTtBQUFBLElBQ2IsVUFBVTtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
