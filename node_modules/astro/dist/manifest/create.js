import fs from "fs";
import path from "path";
import {compile} from "path-to-regexp";
import slash from "slash";
import {fileURLToPath} from "url";
function createManifest({config, cwd}) {
  const components = [];
  const routes = [];
  function walk(dir, parentSegments, parentParams) {
    let items = [];
    fs.readdirSync(dir).forEach((basename) => {
      const resolved = path.join(dir, basename);
      const file = slash(path.relative(cwd || fileURLToPath(config.projectRoot), resolved));
      const isDir = fs.statSync(resolved).isDirectory();
      const ext = path.extname(basename);
      const name = ext ? basename.slice(0, -ext.length) : basename;
      if (name[0] === "_") {
        return;
      }
      if (basename[0] === "." && basename !== ".well-known") {
        return;
      }
      if (!isDir && !/^(\.[a-z0-9]+)+$/i.test(ext)) {
        return;
      }
      const segment = isDir ? basename : name;
      if (/^\$/.test(segment)) {
        throw new Error(`Invalid route ${file} \u2014 Astro's Collections API has been replaced by dynamic route params.`);
      }
      if (/\]\[/.test(segment)) {
        throw new Error(`Invalid route ${file} \u2014 parameters must be separated`);
      }
      if (countOccurrences("[", segment) !== countOccurrences("]", segment)) {
        throw new Error(`Invalid route ${file} \u2014 brackets are unbalanced`);
      }
      if (/.+\[\.\.\.[^\]]+\]/.test(segment) || /\[\.\.\.[^\]]+\].+/.test(segment)) {
        throw new Error(`Invalid route ${file} \u2014 rest parameter must be a standalone segment`);
      }
      const parts = getParts(segment, file);
      const isIndex = isDir ? false : basename.startsWith("index.");
      const routeSuffix = basename.slice(basename.indexOf("."), -ext.length);
      items.push({
        basename,
        ext,
        parts,
        file: slash(file),
        isDir,
        isIndex,
        isPage: true,
        routeSuffix
      });
    });
    items = items.sort(comparator);
    items.forEach((item) => {
      const segments = parentSegments.slice();
      if (item.isIndex) {
        if (item.routeSuffix) {
          if (segments.length > 0) {
            const lastSegment = segments[segments.length - 1].slice();
            const lastPart = lastSegment[lastSegment.length - 1];
            if (lastPart.dynamic) {
              lastSegment.push({
                dynamic: false,
                spread: false,
                content: item.routeSuffix
              });
            } else {
              lastSegment[lastSegment.length - 1] = {
                dynamic: false,
                spread: false,
                content: `${lastPart.content}${item.routeSuffix}`
              };
            }
            segments[segments.length - 1] = lastSegment;
          } else {
            segments.push(item.parts);
          }
        }
      } else {
        segments.push(item.parts);
      }
      const params = parentParams.slice();
      params.push(...item.parts.filter((p) => p.dynamic).map((p) => p.content));
      if (item.isDir) {
        walk(path.join(dir, item.basename), segments, params);
      } else {
        components.push(item.file);
        const component = item.file;
        const pattern = getPattern(segments, config.devOptions.trailingSlash);
        const generate = getGenerator(segments, config.devOptions.trailingSlash);
        const pathname = segments.every((segment) => segment.length === 1 && !segment[0].dynamic) ? `/${segments.map((segment) => segment[0].content).join("/")}` : null;
        routes.push({
          type: "page",
          pattern,
          params,
          component,
          generate,
          path: pathname
        });
      }
    });
  }
  walk(fileURLToPath(config.pages), [], []);
  return {
    routes
  };
}
function countOccurrences(needle, haystack) {
  let count = 0;
  for (let i = 0; i < haystack.length; i += 1) {
    if (haystack[i] === needle)
      count += 1;
  }
  return count;
}
function isSpread(str) {
  const spreadPattern = /\[\.{3}/g;
  return spreadPattern.test(str);
}
function comparator(a, b) {
  if (a.isIndex !== b.isIndex) {
    if (a.isIndex)
      return isSpread(a.file) ? 1 : -1;
    return isSpread(b.file) ? -1 : 1;
  }
  const max = Math.max(a.parts.length, b.parts.length);
  for (let i = 0; i < max; i += 1) {
    const aSubPart = a.parts[i];
    const bSubPart = b.parts[i];
    if (!aSubPart)
      return 1;
    if (!bSubPart)
      return -1;
    if (aSubPart.spread && bSubPart.spread) {
      return a.isIndex ? 1 : -1;
    }
    if (aSubPart.spread !== bSubPart.spread)
      return aSubPart.spread ? 1 : -1;
    if (aSubPart.dynamic !== bSubPart.dynamic) {
      return aSubPart.dynamic ? 1 : -1;
    }
    if (!aSubPart.dynamic && aSubPart.content !== bSubPart.content) {
      return bSubPart.content.length - aSubPart.content.length || (aSubPart.content < bSubPart.content ? -1 : 1);
    }
  }
  if (a.isPage !== b.isPage) {
    return a.isPage ? 1 : -1;
  }
  return a.file < b.file ? -1 : 1;
}
function getParts(part, file) {
  const result = [];
  part.split(/\[(.+?\(.+?\)|.+?)\]/).map((str, i) => {
    if (!str)
      return;
    const dynamic = i % 2 === 1;
    const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
    if (!content || dynamic && !/^(\.\.\.)?[a-zA-Z0-9_$]+$/.test(content)) {
      throw new Error(`Invalid route ${file} \u2014 parameter name must match /^[a-zA-Z0-9_$]+$/`);
    }
    result.push({
      content,
      dynamic,
      spread: dynamic && /^\.{3}.+$/.test(content)
    });
  });
  return result;
}
function getTrailingSlashPattern(addTrailingSlash) {
  if (addTrailingSlash === "always") {
    return "\\/$";
  }
  if (addTrailingSlash === "never") {
    return "$";
  }
  return "\\/?$";
}
function getPattern(segments, addTrailingSlash) {
  const pathname = segments.map((segment) => {
    return segment[0].spread ? "(?:\\/(.*?))?" : "\\/" + segment.map((part) => {
      if (part)
        return part.dynamic ? "([^/]+?)" : part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
  }).join("");
  const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
  return new RegExp(`^${pathname || "\\/"}${trailing}`);
}
function getGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return segment[0].spread ? `/:${segment[0].content.substr(3)}(.*)?` : "/" + segment.map((part) => {
      if (part)
        return part.dynamic ? `:${part.content}` : part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
  }).join("");
  const trailing = addTrailingSlash !== "never" && segments.length ? "/" : "";
  const toPath = compile(template + trailing);
  return toPath;
}
export {
  createManifest
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL21hbmlmZXN0L2NyZWF0ZS50cyJdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFzQk8sd0JBQXdCLENBQUUsUUFBUSxNQUE0RDtBQUNuRyxRQUFNLGFBQXVCO0FBQzdCLFFBQU0sU0FBc0I7QUFFNUIsZ0JBQWMsS0FBYSxnQkFBMEIsY0FBd0I7QUFDM0UsUUFBSSxRQUFnQjtBQUNwQixPQUFHLFlBQVksS0FBSyxRQUFRLENBQUMsYUFBYTtBQUN4QyxZQUFNLFdBQVcsS0FBSyxLQUFLLEtBQUs7QUFDaEMsWUFBTSxPQUFPLE1BQU0sS0FBSyxTQUFTLE9BQU8sY0FBYyxPQUFPLGNBQWM7QUFDM0UsWUFBTSxRQUFRLEdBQUcsU0FBUyxVQUFVO0FBRXBDLFlBQU0sTUFBTSxLQUFLLFFBQVE7QUFDekIsWUFBTSxPQUFPLE1BQU0sU0FBUyxNQUFNLEdBQUcsQ0FBQyxJQUFJLFVBQVU7QUFFcEQsVUFBSSxLQUFLLE9BQU8sS0FBSztBQUNuQjtBQUFBO0FBRUYsVUFBSSxTQUFTLE9BQU8sT0FBTyxhQUFhLGVBQWU7QUFDckQ7QUFBQTtBQUdGLFVBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLEtBQUssTUFBTTtBQUM1QztBQUFBO0FBRUYsWUFBTSxVQUFVLFFBQVEsV0FBVztBQUNuQyxVQUFJLE1BQU0sS0FBSyxVQUFVO0FBQ3ZCLGNBQU0sSUFBSSxNQUFNLGlCQUFpQjtBQUFBO0FBRW5DLFVBQUksT0FBTyxLQUFLLFVBQVU7QUFDeEIsY0FBTSxJQUFJLE1BQU0saUJBQWlCO0FBQUE7QUFFbkMsVUFBSSxpQkFBaUIsS0FBSyxhQUFhLGlCQUFpQixLQUFLLFVBQVU7QUFDckUsY0FBTSxJQUFJLE1BQU0saUJBQWlCO0FBQUE7QUFFbkMsVUFBSSxxQkFBcUIsS0FBSyxZQUFZLHFCQUFxQixLQUFLLFVBQVU7QUFDNUUsY0FBTSxJQUFJLE1BQU0saUJBQWlCO0FBQUE7QUFHbkMsWUFBTSxRQUFRLFNBQVMsU0FB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
