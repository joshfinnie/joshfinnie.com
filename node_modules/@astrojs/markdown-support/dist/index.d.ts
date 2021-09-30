import type { AstroMarkdownOptions, MarkdownRenderingOptions } from './types';
export { AstroMarkdownOptions, MarkdownRenderingOptions };
/** Internal utility for rendering a full markdown file and extracting Frontmatter data */
export declare function renderMarkdownWithFrontmatter(contents: string, opts?: MarkdownRenderingOptions | null): Promise<{
    frontmatter: {
        [key: string]: any;
    };
    astro: {
        headers: any[];
        source: string;
        html: string;
    };
    content: string;
}>;
/** Shared utility for rendering markdown */
export declare function renderMarkdown(content: string, opts?: MarkdownRenderingOptions | null): Promise<{
    astro: {
        headers: any[];
        source: string;
        html: string;
    };
    content: string;
}>;
