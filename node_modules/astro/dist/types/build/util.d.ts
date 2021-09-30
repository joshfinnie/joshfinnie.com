/// <reference types="node" />
import type { AstroConfig } from '../@types/astro';
import { URL } from 'url';
/**
 * Only Astro-handled imports need bundling. Any other imports are considered
 * a part of `public/`, and should not be touched.
 */
export declare const IS_ASTRO_FILE_URL: RegExp;
/** Normalize URL to its canonical form */
export declare function canonicalURL(url: string, base?: string): URL;
/** Resolve final output URL */
export declare function getDistPath(specifier: string, { astroConfig, srcPath }: {
    astroConfig: AstroConfig;
    srcPath: URL;
}): string;
/** Given a final output URL, guess at src path (may be inaccurate; only for non-pages) */
export declare function getSrcPath(distURL: string, { astroConfig }: {
    astroConfig: AstroConfig;
}): URL;
/** Stop timer & format time for profiling */
export declare function stopTimer(start: number): string;
