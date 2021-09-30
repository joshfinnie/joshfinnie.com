import type { AstroConfig, PageDependencies } from './@types/astro';
import type { LogOptions } from './logger';
/** The primary build action */
export declare function build(astroConfig: AstroConfig, logging?: LogOptions): Promise<0 | 1>;
/** Given an HTML string, collect <link> and <img> tags */
export declare function findDeps(html: string, { astroConfig, srcPath }: {
    astroConfig: AstroConfig;
    srcPath: URL;
    id: string;
}): PageDependencies;
