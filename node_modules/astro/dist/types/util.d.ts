import { AstroConfig, GetStaticPathsResult, RouteData } from './@types/astro';
import { LogOptions } from './logger.js';
interface PageLocation {
    fileURL: URL;
    snowpackURL: string;
}
/** convertMatchToLocation and return the _astro candidate for snowpack */
export declare function convertMatchToLocation(routeMatch: RouteData, astroConfig: AstroConfig): PageLocation;
export declare function validateGetStaticPathsModule(mod: any): void;
export declare function validateGetStaticPathsResult(result: GetStaticPathsResult, logging: LogOptions): void;
/** Add / to beginning of string (but don’t double-up) */
export declare function addLeadingSlash(path: string): string;
/** Add / to the end of string (but don’t double-up) */
export declare function addTrailingSlash(path: string): string;
export {};
