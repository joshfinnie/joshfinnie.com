import type { BuildOutput, BundleMap } from '../@types/astro';
import type { LogOptions } from '../logger';
interface BundleStats {
    size: number;
    gzipSize: number;
}
interface URLStats {
    dynamicImports: Set<string>;
    stats: BundleStats[];
}
export declare type BundleStatsMap = Map<string, BundleStats>;
export declare type URLStatsMap = Map<string, URLStats>;
export declare function createURLStats(): URLStatsMap;
export declare function createBundleStats(): BundleStatsMap;
export declare function addBundleStats(bundleStatsMap: BundleStatsMap, code: string, filename: string): Promise<void>;
export declare function mapBundleStatsToURLStats({ urlStats, depTree, bundleStats }: {
    urlStats: URLStatsMap;
    depTree: BundleMap;
    bundleStats: BundleStatsMap;
}): void;
export declare function collectBundleStats(buildState: BuildOutput, depTree: BundleMap): Promise<URLStatsMap>;
export declare function logURLStats(logging: LogOptions, urlStats: URLStatsMap): void;
export {};
