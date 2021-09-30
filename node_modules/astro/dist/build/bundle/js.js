import {fileURLToPath} from "url";
import {rollup} from "rollup";
import {terser} from "rollup-plugin-terser";
import {createBundleStats, addBundleStats} from "../stats.js";
import {IS_ASTRO_FILE_URL} from "../util.js";
import cheerio from "cheerio";
import path from "path";
function collectJSImports(buildState) {
  const imports = new Set();
  for (const id of Object.keys(buildState)) {
    if (buildState[id].contentType === "application/javascript")
      imports.add(id);
  }
  return imports;
}
function pageUrlToVirtualJSEntry(pageUrl) {
  return "astro-virtual:" + pageUrl.replace(/.html$/, "").replace(/^\./, "") + ".js";
}
async function bundleHoistedJS({
  buildState,
  astroConfig,
  logging,
  depTree,
  dist,
  runtime
}) {
  const sortedPages = Object.keys(depTree);
  sortedPages.sort((a, b) => a.localeCompare(b, "en", {numeric: true}));
  const entryImports = [];
  const virtualScripts = new Map();
  const pageToEntryMap = new Map();
  for (let pageUrl of sortedPages) {
    const hoistedJS = depTree[pageUrl].hoistedJS;
    if (hoistedJS.size) {
      for (let [url, scriptInfo] of hoistedJS) {
        if (virtualScripts.has(url) || !url.startsWith("astro-virtual:"))
          continue;
        virtualScripts.set(url, scriptInfo);
      }
      const entryURL = pageUrlToVirtualJSEntry(pageUrl);
      const entryJS = Array.from(hoistedJS.keys()).map((url) => `import '${url}';`).join("\n");
      virtualScripts.set(entryURL, {
        content: entryJS
      });
      entryImports.push(entryURL);
      pageToEntryMap.set(pageUrl, entryURL);
    }
  }
  if (!entryImports.length) {
    return;
  }
  const inputOptions = {
    input: entryImports,
    plugins: [
      {
        name: "astro:build",
        resolveId(source, imported) {
          if (virtualScripts.has(source)) {
            return source;
          }
          if (source.startsWith("/")) {
            return source;
          }
          if (imported) {
            const outUrl = new URL(source, "http://example.com" + imported);
            return outUrl.pathname;
          }
          return null;
        },
        async load(id) {
          if (virtualScripts.has(id)) {
            let info = virtualScripts.get(id);
            return info.content;
          }
          const result = await runtime.load(id);
          if (result.statusCode !== 200) {
            return null;
          }
          return result.contents.toString("utf-8");
        }
      }
    ]
  };
  const build = await rollup(inputOptions);
  const outputOptions = {
    dir: fileURLToPath(dist),
    format: "esm",
    exports: "named",
    entryFileNames(chunk) {
      const {facadeModuleId} = chunk;
      if (!facadeModuleId)
        throw new Error(`facadeModuleId missing: ${chunk.name}`);
      return facadeModuleId.substr("astro-virtual:/".length, facadeModuleId.length - "astro-virtual:/".length - 3) + "-[hash].js";
    },
    plugins: [
      terser()
    ]
  };
  const {output} = await build.write(outputOptions);
  const entryToChunkFileName = new Map();
  output.forEach((chunk) => {
    const {fileName, facadeModuleId, isEntry} = chunk;
    if (!facadeModuleId || !isEntry)
      return;
    entryToChunkFileName.set(facadeModuleId, fileName);
  });
  Object.keys(buildState).forEach((id) => {
    if (buildState[id].contentType !== "text/html")
      return;
    const entryVirtualURL = pageUrlToVirtualJSEntry(id);
    let hasHoisted = false;
    const $ = cheerio.load(buildState[id].contents);
    $('script[data-astro="hoist"]').each((i, el) => {
      hasHoisted = true;
      if (i === 0) {
        let chunkName = entryToChunkFileName.get(entryVirtualURL);
        if (!chunkName)
          return;
        let chunkPathname = "/" + chunkName;
        let relLink = path.relative(path.dirname(id), chunkPathname);
        $(el).attr("src", relLink.startsWith(".") ? relLink : "./" + relLink);
        $(el).removeAttr("data-astro");
        $(el).html("");
      } else {
        $(el).remove();
      }
    });
    if (hasHoisted) {
      buildState[id].contents = $.html();
    }
  });
}
async function bundleJS(imports, {astroRuntime, dist}) {
  const ROOT = "astro:root";
  const validImports = [...imports].filter((url) => IS_ASTRO_FILE_URL.test(url));
  const root = `
  ${validImports.map((url) => `import '${url}';`).join("\n")}
`;
  const inputOptions = {
    input: validImports,
    plugins: [
      {
        name: "astro:build",
        resolveId(source, imported) {
          if (source === ROOT) {
            return source;
          }
          if (source.startsWith("/")) {
            return source;
          }
          if (imported) {
            const outUrl = new URL(source, "http://example.com" + imported);
            return outUrl.pathname;
          }
          return null;
        },
        async load(id) {
          if (id === ROOT) {
            return root;
          }
          const result = await astroRuntime.load(id);
          if (result.statusCode !== 200) {
            return null;
          }
          return result.contents.toString("utf-8");
        }
      }
    ]
  };
  const build = await rollup(inputOptions);
  const outputOptions = {
    dir: fileURLToPath(dist),
    format: "esm",
    exports: "named",
    entryFileNames(chunk) {
      const {facadeModuleId} = chunk;
      if (!facadeModuleId)
        throw new Error(`facadeModuleId missing: ${chunk.name}`);
      return facadeModuleId.substr(1);
    },
    plugins: [
      terser()
    ]
  };
  const stats = createBundleStats();
  const {output} = await build.write(outputOptions);
  await Promise.all(output.map(async (chunk) => {
    const code = chunk.code || "";
    await addBundleStats(stats, code, chunk.fileName);
  }));
  return stats;
}
export {
  bundleHoistedJS,
  bundleJS,
  collectJSImports
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vc3JjL2J1aWxkL2J1bmRsZS9qcy50cyJdLAogICJtYXBwaW5ncyI6ICJBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUU8sMEJBQTBCLFlBQXNDO0FBQ3JFLFFBQU0sVUFBVSxJQUFJO0FBQ3BCLGFBQVcsTUFBTSxPQUFPLEtBQUssYUFBYTtBQUN4QyxRQUFJLFdBQVcsSUFBSSxnQkFBZ0I7QUFBMEIsY0FBUSxJQUFJO0FBQUE7QUFFM0UsU0FBTztBQUFBO0FBR1QsaUNBQWlDLFNBQWlCO0FBQ2hELFNBQU8sbUJBQW1CLFFBQVEsUUFBUSxVQUFVLElBQUksUUFBUSxPQUFPLE1BQU07QUFBQTtBQUcvRSwrQkFBc0M7QUFBQSxFQUNwQztBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsR0FRQztBQUNELFFBQU0sY0FBYyxPQUFPLEtBQUs7QUFDaEMsY0FBWSxLQUFLLENBQUMsR0FBRyxNQUFNLEVBQUUsY0FBYyxHQUFHLE1BQU0sQ0FBRSxTQUFTO0FBSy9ELFFBQU0sZUFBeUI7QUFDL0IsUUFBTSxpQkFBaUIsSUFBSTtBQUMzQixRQUFNLGlCQUFpQixJQUFJO0FBRTNCLFdBQVMsV0FBVyxhQUFhO0FBQy9CLFVBQU0sWUFBWSxRQUFRLFNBQVM7QUFDbkMsUUFBSSxVQUFVLE1BQU07QUFDbEIsZUFBUyxDQUFDLEtBQUssZUFBZSxXQUFXO0FBQ3ZDLFlBQUksZUFBZSxJQUFJLFFBQVEsQ0FBQyxJQUFJLFdBQVc7QUFBbUI7QUFDbEUsdUJBQWUsSUFBSSxLQUFLO0FBQUE7QUFFMUIsWUFBTSxXQUFXLHdCQUF3QjtBQUN6QyxZQUFNLFVBQVUsTUFBTSxLQUFLLFVBQVUsUUFDbEMsSUFBSSxDQUFDLFFBQVEsV0FBVyxTQUN4QixLQUFLO0FBQ1IscUJBQWUsSUFBSSxVQUFVO0FBQUEsUUFDM0IsU0FBUztBQUFBO0FBRVgsbUJBQWEsS0FBSztBQUNsQixxQkFBZSxJQUFJ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
