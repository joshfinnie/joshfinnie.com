import type { RSSFunctionArgs, RouteData } from '../@types/astro';
/** Validates getStaticPaths.rss */
export declare function validateRSS(args: GenerateRSSArgs): void;
declare type GenerateRSSArgs = {
    site: string;
    rssData: RSSFunctionArgs;
    srcFile: string;
    feedURL: string;
};
/** Generate RSS 2.0 feed */
export declare function generateRSS(args: GenerateRSSArgs): string;
export declare function generateRssFunction(site: string | undefined, routeMatch: RouteData): [(args: any) => void, {
    url?: string;
    xml?: string;
}];
export {};
