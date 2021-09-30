import type { ServerRuntime as SnowpackServerRuntime } from 'snowpack';
import type { AstroConfig, BuildOutput, RouteData } from '../@types/astro';
import { LogOptions } from '../logger';
import type { AstroRuntime } from '../runtime.js';
interface PageBuildOptions {
    astroConfig: AstroConfig;
    buildState: BuildOutput;
    path: string;
    route: RouteData;
    astroRuntime: AstroRuntime;
}
/** Build dynamic page */
export declare function getStaticPathsForPage({ astroConfig, astroRuntime, snowpackRuntime, route, logging, }: {
    astroConfig: AstroConfig;
    astroRuntime: AstroRuntime;
    route: RouteData;
    snowpackRuntime: SnowpackServerRuntime;
    logging: LogOptions;
}): Promise<{
    paths: string[];
    rss: any;
}>;
/** Build static page */
export declare function buildStaticPage({ astroConfig, buildState, path, route, astroRuntime }: PageBuildOptions): Promise<void>;
export {};
