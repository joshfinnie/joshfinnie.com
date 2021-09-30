import type { ScriptInfo } from '../@types/astro';
declare const sym: unique symbol;
interface ComponentThatMaybeHasHoistedScripts {
    [sym]: ScriptInfo[];
}
/**
 * Takes all of the components this component uses and combines them with its
 * own scripts and flattens it to a deduped list.
 * The page component will have an array of all scripts used by all child components and itself.
 */
declare function hoistedScripts(Components: ComponentThatMaybeHasHoistedScripts[], scripts: ScriptInfo[]): (import("../@types/astro").InlineScriptInfo | import("../@types/astro").ExternalScriptInfo)[];
export { hoistedScripts as __astro_hoisted_scripts };
