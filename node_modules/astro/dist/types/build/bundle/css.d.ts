import type { AstroConfig, BuildOutput, BundleMap } from '../../@types/astro';
import type { LogOptions } from '../../logger.js';
/**
 * Bundle CSS
 * For files within dep tree, find ways to combine them.
 * Current logic:
 *   - If CSS appears across multiple pages, combine into `/_astro/common.css` bundle
 *   - Otherwise, combine page CSS into one request as `/_astro/[page].css` bundle
 *
 * This operation _should_ be relatively-safe to do in parallel with other bundling,
 * assuming other bundling steps don’t touch CSS. While this step does modify HTML,
 * it doesn’t keep anything in local memory so other processes may modify HTML too.
 *
 * This operation mutates the original references of the buildOutput not only for
 * safety (prevents possible conflicts), but for efficiency.
 */
export declare function bundleCSS({ astroConfig, buildState, logging, depTree, }: {
    astroConfig: AstroConfig;
    buildState: BuildOutput;
    logging: LogOptions;
    depTree: BundleMap;
}): Promise<void>;
