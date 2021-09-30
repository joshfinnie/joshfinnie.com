import type { AstroConfig, BundleMap, BuildOutput } from '../../@types/astro';
import type { AstroRuntime } from '../../runtime';
import type { LogOptions } from '../../logger.js';
import { BundleStatsMap } from '../stats.js';
interface BundleOptions {
    dist: URL;
    astroRuntime: AstroRuntime;
}
/** Collect JS imports from build output */
export declare function collectJSImports(buildState: BuildOutput): Set<string>;
export declare function bundleHoistedJS({ buildState, astroConfig, logging, depTree, dist, runtime, }: {
    astroConfig: AstroConfig;
    buildState: BuildOutput;
    logging: LogOptions;
    depTree: BundleMap;
    dist: URL;
    runtime: AstroRuntime;
}): Promise<void>;
/** Bundle JS action */
export declare function bundleJS(imports: Set<string>, { astroRuntime, dist }: BundleOptions): Promise<BundleStatsMap>;
export {};
