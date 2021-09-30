import {posix as path} from "path";
import {fileURLToPath, pathToFileURL} from "url";
import resolve from "resolve";
import {loadConfig} from "./config.js";
const CONFIG_MODULE_BASE_NAME = "__astro_config.js";
const CONFIG_MODULE_URL = `/_astro_frontend/${CONFIG_MODULE_BASE_NAME}`;
const DEFAULT_RENDERERS = ["@astrojs/renderer-vue", "@astrojs/renderer-svelte", "@astrojs/renderer-react", "@astrojs/renderer-preact"];
class ConfigManager {
  constructor(astroConfig, resolvePackageUrl) {
    this.astroConfig = astroConfig;
    this.resolvePackageUrl = resolvePackageUrl;
    this.state = "initial";
    this.snowpackRuntime = null;
    this.configModuleId = null;
    this.version = 1;
    this.setRendererNames(this.astroConfig);
  }
  markDirty() {
    this.state = "dirty";
  }
  async update() {
    if (this.needsUpdate() && this.snowpackRuntime) {
      if (this.state === "dirty") {
        const version = this.version++;
        const astroConfig = await loadConfig(this.astroConfig.projectRoot.pathname, `astro.config.mjs?version=${version}`);
        this.setRendererNames(astroConfig);
      }
      await this.importModule(this.snowpackRuntime);
      this.state = "clean";
    }
  }
  isConfigModule(fileExt, filename) {
    return fileExt === ".js" && filename.endsWith(CONFIG_MODULE_BASE_NAME);
  }
  isAstroConfig(filename) {
    const {projectRoot} = this.astroConfig;
    return new URL("./astro.config.mjs", projectRoot).pathname === filename;
  }
  async buildRendererInstances() {
    const {projectRoot} = this.astroConfig;
    const rendererNames = this.rendererNames;
    const resolveDependency = (dep) => resolve.sync(dep, {basedir: fileURLToPath(projectRoot)});
    const rendererInstances = (await Promise.all(rendererNames.map(async (rendererName) => {
      let _options = null;
      if (Array.isArray(rendererName)) {
        _options = rendererName[1];
        rendererName = rendererName[0];
      }
      const entrypoint = pathToFileURL(resolveDependency(rendererName)).toString();
      const r = await import(entrypoint);
      return {
        raw: r.default,
        options: _options
      };
    }))).map(({raw, options}, i) => {
      const {name = rendererNames[i], client, server, snowpackPlugin: snowpackPluginName, snowpackPluginOptions} = raw;
      if (typeof client !== "string" && client != null) {
        throw new Error(`Expected "client" from ${name} to be a relative path to the client-side renderer!`);
      }
      if (typeof server !== "string") {
        throw new Error(`Expected "server" from ${name} to be a relative path to the server-side renderer!`);
      }
      let snowpackPlugin;
      if (typeof snowpackPluginName === "string") {
        if (snowpackPluginOptions) {
          snowpackPlugin = [resolveDependency(snowpackPluginName), snowpackPluginOptions];
        } else {
          snowpackPlugin = resolveDependency(snowpackPluginName);
        }
      } else if (snowpackPluginName) {
        throw new Error(`Expected the snowpackPlugin from ${name} to be a "string" but encountered "${typeof snowpackPluginName}"!`);
      }
      const polyfillsNormalized = (raw.polyfills || []).map((p) => p.startsWith(".") ? path.join(name, p) : p);
      const hydrationPolyfillsNormalized = (raw.hydrationPolyfills || []).map((p) => p.startsWith(".") ? path.join(name, p) : p);
      return {
        name,
        options,
        snowpackPlugin,
        client: raw.client ? path.join(name, raw.client) : null,
        server: path.join(name, raw.server),
        knownEntrypoints: raw.knownEntrypoints,
        external: raw.external,
        polyfills: polyfillsNormalized,
        hydrationPolyfills: hydrationPolyfillsNormalized,
        jsxImportSource: raw.jsxImportSource
      };
    });
    return rendererInstances;
  }
  async getRenderers() {
    const renderers = await this.buildRendererInstances();
    return renderers;
  }
  async buildSource(contents) {
    const renderers = await this.buildRendererInstances();
    const rendererServerPackages = renderers.map(({server}) => server);
    const rendererClientPackages = await Promise.all(renderers.filter((instance) => !!instance.client).map(({client}) => this.resolvePackageUrl(client)));
    const rendererPolyfills = await Promise.all(renderers.map(({polyfills}) => Promise.all(polyfills.map((src) => this.resolvePackageUrl(src)))));
    const rendererHydrationPolyfills = await Promise.all(renderers.map(({hydrationPolyfills}) => Promise.all(hydrationPolyfills.map((src) => this.resolvePackageUrl(src)))));
    const result = `${rendererServerPackages.map((pkg, i) => `import __renderer_${i} from "${pkg}";`).join("\n")}

import { setRenderers } from 'astro/dist/internal/__astro_component.js';

let rendererInstances = [${renderers.map((r, i) => `{
  name: "${r.name}",
  source: ${rendererClientPackages[i] ? `"${rendererClientPackages[i]}"` : "null"},
  renderer: typeof __renderer_${i} === 'function' ? __renderer_${i}(${r.options ? JSON.stringify(r.options) : "null"}) : __renderer_${i},
  polyfills: ${JSON.stringify(rendererPolyfills[i])},
  hydrationPolyfills: ${JSON.stringify(rendererHydrationPolyfills[i])}
}`).join(", ")}];

${contents}
`;
    return result;
  }
  needsUpdate() {
    return this.state === "initial" || this.state === "dirty";
  }
  setRendererNames(astroConfig) {
    this.rendererNames = astroConfig.renderers || DEFAULT_RENDERERS;
  }
  async importModule(snowpackRuntime) {
    await snowpackRuntime.importModule(CONFIG_MODULE_URL);
  }
}
export {
  ConfigManager
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2NvbmZpZ19tYW5hZ2VyLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFDQTtBQUNBO0FBQ0E7QUFvQkEsTUFBTSwwQkFBMEI7QUFDaEMsTUFBTSxvQkFBb0Isb0JBQW9CO0FBRTlDLE1BQU0sb0JBQW9CLENBQUMseUJBQXlCLDRCQUE0QiwyQkFBMkI7QUFFcEcsb0JBQW9CO0FBQUEsRUFPekIsWUFBb0IsYUFBa0MsbUJBQXlEO0FBQTNGO0FBQWtDO0FBTjlDLGlCQUF1QztBQUN4QywyQkFBZ0Q7QUFDaEQsMEJBQWdDO0FBRS9CLG1CQUFVO0FBR2hCLFNBQUssaUJBQWlCLEtBQUs7QUFBQTtBQUFBLEVBRzdCLFlBQVk7QUFDVixTQUFLLFFBQVE7QUFBQTtBQUFBLFFBR1QsU0FBUztBQUNiLFFBQUksS0FBSyxpQkFBaUIsS0FBSyxpQkFBaUI7QUFFOUMsVUFBSSxLQUFLLFVBQVUsU0FBUztBQUMxQixjQUFNLFVBQVUsS0FBSztBQUNyQixjQUFNLGNBQWMsTUFBTSxXQUFXLEtBQUssWUFBWSxZQUFZLFVBQVUsNEJBQTRCO0FBQ3hHLGFBQUssaUJBQWlCO0FBQUE7QUFHeEIsWUFBTSxLQUFLLGFBQWEsS0FBSztBQUM3QixXQUFLLFFBQVE7QUFBQTtBQUFBO0FBQUEsRUFJakIsZUFBZSxTQUFpQixVQUFrQjtBQUNoRCxXQUFPLFlBQVksU0FBUyxTQUFTLFNBQVM7QUFBQTtBQUFBLEVBR2hELGNBQWMsVUFBa0I7QUFDOUIsVUFBTSxDQUFFLGVBQWdCLEtBQUs7QUFDN0IsV0FBTyxJQUFJLElBQUksc0JBQXNCLGFBQWEsYUFBYTtBQUFBO0FBQUEsUUFHM0QseUJBQXNEO0FBQzFELFVBQU0sQ0FBRSxlQUFnQixLQUFLO0FBQzdCLFVBQU0sZ0JBQWdCLEtBQUs7QUFDM0IsVUFBTSxvQkFBb0IsQ0FBQyxRQUFnQixRQUFRLEtBQUssS0FBSyxDQUFFLFNBQVMsY0FBYztBQUV0RixVQUFNLG9CQUNKLE9BQU0sUUFBUSxJQUNaLGNBQWMsSUFB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
