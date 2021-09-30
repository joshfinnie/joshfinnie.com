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
import hash from "shorthash";
import {valueToEstree} from "estree-util-value-to-estree";
import {generate, GENERATOR} from "astring";
import * as astroHtml from "./renderer-html";
const customGenerator = __spreadProps(__spreadValues({}, GENERATOR), {
  Literal(node, state) {
    if (node.raw != null) {
      state.write(node.raw.replace("</script>", "<\\/script>"));
    } else {
      GENERATOR.Literal(node, state);
    }
  }
});
const serialize = (value) => generate(valueToEstree(value), {
  generator: customGenerator
});
const astroHtmlRendererInstance = {
  name: null,
  source: "",
  renderer: astroHtml,
  polyfills: [],
  hydrationPolyfills: []
};
let rendererInstances = [];
function setRenderers(_rendererInstances) {
  rendererInstances = [].concat(_rendererInstances);
}
function isCustomElementTag(name) {
  return typeof name === "string" && /-/.test(name);
}
const rendererCache = new Map();
function inferClientRenderer(metadata) {
  if (rendererInstances.length === 1) {
    return rendererInstances[0];
  } else if (metadata.value) {
    const hint = metadata.value;
    let match = rendererInstances.find((instance) => instance.name === hint);
    if (!match) {
      const fullHintName = `@astrojs/renderer-${hint}`;
      match = rendererInstances.find((instance) => instance.name === fullHintName);
    }
    if (!match) {
      throw new Error(`Couldn't find a renderer for <${metadata.displayName} client:only="${metadata.value}" />. Is there a renderer that matches the "${metadata.value}" hint in your Astro config?`);
    }
    return match;
  } else {
    throw new Error(`Can't determine the renderer for ${metadata.displayName}. Include a hint similar to <${metadata.displayName} client:only="react" /> when multiple renderers are included in your Astro config.`);
  }
}
async function resolveRenderer(Component, props = {}, children, metadata = {}) {
  if (metadata.hydrate === "only") {
    return inferClientRenderer(metadata);
  }
  if (rendererCache.has(Component)) {
    return rendererCache.get(Component);
  }
  const errors = [];
  for (const instance of rendererInstances) {
    const {renderer} = instance;
    try {
      const shouldUse = await renderer.check(Component, props, children);
      if (shouldUse) {
        rendererCache.set(Component, instance);
        return instance;
      }
    } catch (err) {
      errors.push(err);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
async function generateHydrateScript(scriptOptions, metadata) {
  const {instance, astroId, props} = scriptOptions;
  const {source} = instance;
  const {hydrate, componentUrl, componentExport} = metadata;
  let hydrationSource = "";
  if (instance.hydrationPolyfills.length) {
    hydrationSource += `await Promise.all([${instance.hydrationPolyfills.map((src) => `import("${src}")`).join(", ")}]);
`;
  }
  hydrationSource += source ? `
  const [{ ${componentExport.value}: Component }, { default: hydrate }] = await Promise.all([import("${componentUrl}"), import("${source}")]);
  return (el, children) => hydrate(el)(Component, ${serialize(props)}, children);
` : `
  await import("${componentUrl}");
  return () => {};
`;
  const hydrationScript = `<script type="module">
import setup from '/_astro_frontend/hydrate/${hydrate}.js';
setup("${astroId}", {${metadata.value ? `value: "${metadata.value}"` : ""}}, async () => {
  ${hydrationSource}
});
</script>`;
  return hydrationScript;
}
const getComponentName = (Component, componentProps) => {
  var _a;
  if (componentProps.displayName)
    return componentProps.displayName;
  switch (typeof Component) {
    case "function":
      return (_a = Component.displayName) != null ? _a : Component.name;
    case "string":
      return Component;
    default: {
      return Component;
    }
  }
};
const prepareSlottedChildren = (children) => {
  const $slots = {
    default: ""
  };
  for (const child of children) {
    if (typeof child === "string") {
      $slots.default += child;
    } else if (typeof child === "object" && child["$slot"]) {
      if (!$slots[child["$slot"]])
        $slots[child["$slot"]] = "";
      $slots[child["$slot"]] += child.children.join("").replace(new RegExp(`slot="${child["$slot"]}"s*`, ""));
    }
  }
  return {$slots};
};
const removeSlottedChildren = (_children) => {
  let children = "";
  for (const child of _children) {
    if (typeof child === "string") {
      children += child;
    } else if (typeof child === "object" && child["$slot"]) {
      children += child.children.join("");
    }
  }
  return children;
};
function __astro_component(Component, metadata = {}) {
  if (Component == null) {
    throw new Error(`Unable to render ${metadata.displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`);
  } else if (typeof Component === "string" && !isCustomElementTag(Component)) {
    throw new Error(`Astro is unable to render ${metadata.displayName}!
Is there a renderer to handle this type of component defined in your Astro config?`);
  }
  return async function __astro_component_internal(props, ..._children) {
    if (Component.isAstroComponent) {
      return Component.__render(props, prepareSlottedChildren(_children));
    }
    const children = removeSlottedChildren(_children);
    let instance = await resolveRenderer(Component, props, children, metadata);
    if (!instance) {
      if (isCustomElementTag(Component)) {
        instance = astroHtmlRendererInstance;
      } else {
        instance = rendererInstances.length === 2 ? rendererInstances[1] : void 0;
      }
      if (!instance) {
        const name = getComponentName(Component, metadata);
        throw new Error(`No renderer found for ${name}! Did you forget to add a renderer to your Astro config?`);
      }
    }
    let html = "";
    if (metadata.hydrate !== "only") {
      const rendered = await instance.renderer.renderToStaticMarkup(Component, props, children, metadata);
      html = rendered.html;
    }
    if (instance.polyfills.length) {
      let polyfillScripts = instance.polyfills.map((src) => `<script type="module" src="${src}"></script>`).join("");
      html = html + polyfillScripts;
    }
    if (!metadata.hydrate) {
      return html.replace(/\<\/?astro-fragment\>/g, "");
    }
    const uniqueId = props[Symbol.for("astro.context")].createAstroRootUID(html);
    const uniqueIdHashed = hash.unique(uniqueId);
    const script = await generateHydrateScript({instance, astroId: uniqueIdHashed, props}, metadata);
    const astroRoot = `<astro-root uid="${uniqueIdHashed}">${html}</astro-root>`;
    return [astroRoot, script].join("\n");
  };
}
export {
  __astro_component,
  setRenderers
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL2ludGVybmFsL19fYXN0cm9fY29tcG9uZW50LnRzIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUEsTUFBTSxrQkFBNkIsaUNBQzlCLFlBRDhCO0FBQUEsRUFFakMsUUFBUSxNQUFNLE9BQU87QUFDbkIsUUFBSSxLQUFLLE9BQU8sTUFBTTtBQUdwQixZQUFNLE1BQU0sS0FBSyxJQUFJLFFBQVEsYUFBYTtBQUFBLFdBQ3JDO0FBQ0wsZ0JBQVUsUUFBUSxNQUFNO0FBQUE7QUFBQTtBQUFBO0FBSTlCLE1BQU0sWUFBWSxDQUFDLFVBQ2pCLFNBQVMsY0FBYyxRQUFRO0FBQUEsRUFDN0IsV0FBVztBQUFBO0FBV2YsTUFBTSw0QkFBOEM7QUFBQSxFQUNsRCxNQUFNO0FBQUEsRUFDTixRQUFRO0FBQUEsRUFDUixVQUFVO0FBQUEsRUFDVixXQUFXO0FBQUEsRUFDWCxvQkFBb0I7QUFBQTtBQUd0QixJQUFJLG9CQUF3QztBQUVyQyxzQkFBc0Isb0JBQXdDO0FBQ25FLHNCQUFxQixHQUEwQixPQUFPO0FBQUE7QUFHeEQsNEJBQTRCLE1BQWU7QUFDekMsU0FBTyxPQUFPLFNBQVMsWUFBWSxJQUFJLEtBQUs7QUFBQTtBQUc5QyxNQUFNLGdCQUFnQixJQUFJO0FBRzFCLDZCQUE2QixVQUEyQztBQUV0RSxNQUFJLGtCQUFrQixXQUFXLEdBQUc7QUFDbEMsV0FBTyxrQkFBa0I7QUFBQSxhQUNoQixTQUFTLE9BQU87QUFFekIsVUFBTSxPQUFPLFNBQVM7QUFDdEIsUUFBSSxRQUFRLGtCQUFrQixLQUFLLENBQUMsYUFBYSxTQUFTLFNBQVM7QUFFbkUsUUFBSSxDQUFDLE9BQU87QUFFVixZQUFNLGVBQWUscUJBQXFCO0FBQzFDLGNBQVEsa0JBQWtCLEtBQUssQ0FBQyxhQUFhLFNBQVMsU0FBUztBQUFBO0FBR2pFLFFBQUksQ0FBQyxPQUFPO0FBQ1YsWUFBTSxJQUFJLE1BQ1IsaUNBQWlD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
