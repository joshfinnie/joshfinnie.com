import {performance} from "perf_hooks";
import fs from "fs";
import path from "path";
import {URL} from "url";
const IS_ASTRO_FILE_URL = /^\/(_astro|_astro_frontend|_snowpack)\//;
function canonicalURL(url, base) {
  let pathname = url.replace(/\/index.html$/, "");
  pathname = pathname.replace(/\/1\/?$/, "");
  if (!path.extname(pathname))
    pathname = pathname.replace(/(\/+)?$/, "/");
  pathname = pathname.replace(/\/+/g, "/");
  if (base) {
    return new URL("." + pathname, base);
  } else {
    return new URL(pathname, base);
  }
}
function getDistPath(specifier, {astroConfig, srcPath}) {
  if (specifier[0] === "/")
    return specifier;
  const {pages: pagesRoot, projectRoot} = astroConfig;
  const fileLoc = new URL(specifier, srcPath);
  const projectLoc = fileLoc.pathname.replace(projectRoot.pathname, "");
  const ext = path.extname(fileLoc.pathname);
  const isPage = fileLoc.pathname.includes(pagesRoot.pathname) && (ext === ".astro" || ext === ".md");
  if (isPage) {
    const [, publicURL] = projectLoc.split(pagesRoot.pathname);
    return publicURL || "/index.html";
  }
  const isPublicAsset = fileLoc.pathname.includes(astroConfig.public.pathname);
  if (isPublicAsset) {
    return fileLoc.pathname.replace(astroConfig.public.pathname, "/");
  }
  return "/_astro/" + projectLoc;
}
function getSrcPath(distURL, {astroConfig}) {
  if (distURL.startsWith("/_astro/")) {
    return new URL("." + distURL.replace(/^\/_astro\//, ""), astroConfig.projectRoot);
  } else if (distURL === "/index.html") {
    return new URL("./index.astro", astroConfig.pages);
  }
  const possibleURLs = [
    new URL("." + distURL, astroConfig.public),
    new URL("." + distURL.replace(/([^\/])+\/d+\/index.html/, "$$1.astro"), astroConfig.pages),
    new URL("." + distURL.replace(/\/index\.html$/, ".astro"), astroConfig.pages)
  ];
  for (const possibleURL of possibleURLs) {
    if (fs.existsSync(possibleURL))
      return possibleURL;
  }
  return new URL("." + distURL, astroConfig.projectRoot);
}
function stopTimer(start) {
  const diff = performance.now() - start;
  return diff < 750 ? `${Math.round(diff)}ms` : `${(diff / 1e3).toFixed(1)}s`;
}
export {
  IS_ASTRO_FILE_URL,
  canonicalURL,
  getDistPath,
  getSrcPath,
  stopTimer
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2J1aWxkL3V0aWwudHMiXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUVBO0FBQ0E7QUFDQTtBQU1PLE1BQU0sb0JBQW9CO0FBRzFCLHNCQUFzQixLQUFhLE1BQW9CO0FBQzVELE1BQUksV0FBVyxJQUFJLFFBQVEsaUJBQWlCO0FBQzVDLGFBQVcsU0FBUyxRQUFRLFdBQVc7QUFDdkMsTUFBSSxDQUFDLEtBQUssUUFBUTtBQUFXLGVBQVcsU0FBUyxRQUFRLFdBQVc7QUFDcEUsYUFBVyxTQUFTLFFBQVEsUUFBUTtBQUNwQyxNQUFJLE1BQU07QUFDUixXQUFPLElBQUksSUFBSSxNQUFNLFVBQVU7QUFBQSxTQUMxQjtBQUNMLFdBQU8sSUFBSSxJQUFJLFVBQVU7QUFBQTtBQUFBO0FBS3RCLHFCQUFxQixXQUFtQixDQUFFLGFBQWEsVUFBK0Q7QUFDM0gsTUFBSSxVQUFVLE9BQU87QUFBSyxXQUFPO0FBQ2pDLFFBQU0sQ0FBRSxPQUFPLFdBQVcsZUFBZ0I7QUFFMUMsUUFBTSxVQUFVLElBQUksSUFBSSxXQUFXO0FBQ25DLFFBQU0sYUFBYSxRQUFRLFNBQVMsUUFBUSxZQUFZLFVBQVU7QUFDbEUsUUFBTSxNQUFNLEtBQUssUUFBUSxRQUFRO0FBRWpDLFFBQU0sU0FBUyxRQUFRLFNBQVMsU0FBUyxVQUFVLGFBQWMsU0FBUSxZQUFZLFFBQVE7QUFFN0YsTUFBSSxRQUFRO0FBQ1YsVUFBTSxDQUFDLEVBQUUsYUFBYSxXQUFXLE1BQU0sVUFBVTtBQUNqRCxXQUFPLGFBQWE7QUFBQTtBQUl0QixRQUFNLGdCQUFnQixRQUFRLFNBQVMsU0FBUyxZQUFZLE9BQU87QUFDbkUsTUFBSSxlQUFlO0FBQ2pCLFdBQU8sUUFBUSxTQUFTLFFBQVEsWUFBWSxPQUFPLFVBQVU7QUFBQTtBQUkvRCxTQUFPLGFBQWE7QUFBQTtBQUlmLG9CQUFvQixTQUFpQixDQUFFLGNBQWtEO0FBQzlGLE1BQUksUUFBUSxXQUFXLGFBQWE7QUFDbEMsV0FBTyxJQUFJLElBQUksTUFBTSxRQUFRLFFBQVEsZUFBZSxLQUFLLFlBQVk7QUFBQSxhQUM1RCxZQUFZLGVBQWU7QUFDcEMsV0FBTyxJQUFJLElBQUksaUJBQWlCLFlBQVk7QUFBQTtBQUc5QyxRQUFNLGVBQWU7QUFBQSxJQUNuQixJQUFJLElBQUksTUFBTSxTQUFTLFlBQVk7QUFBQSxJQUNuQyxJQUFJLElBQUksTUFBTSxRQUFRLFFBQVEsNEJBQTRCLGNBQWMsWUFBWTtBQUFBLElBQ3BGLElBQUksSUFBSSxNQUFNLFFBQVEsUUFBUSxrQkFBa0IsV0FBVyxZQUFZO0FBQUE7QUFLekUsYUFBVyxlQUFlLGNBQWM7QUFDdEMsUUFBSSxHQUFHLFdBQVc7QUFBYyxhQUFPO0FBQUE7QUFJekMsU0FBTyxJQUFJLElBQUksTUFBTSxTQUFTLFlBQVk7QUFBQTtBQUlyQyxtQkFBbUIsT0FBdUI7QUFDL0MsUUFBTSxPQUFPLFlBQVksUUFBUTtBQUNqQyxTQUFPLE9BQU8sTUFBTSxHQUFHLEtBQUssTUFBTSxZQUFZLEdBQUksUUFBTyxLQUFNLFFBQVE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
