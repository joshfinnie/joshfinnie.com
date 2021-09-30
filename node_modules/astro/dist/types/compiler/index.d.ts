import type { CompileResult, TransformResult } from '../@types/astro';
import type { CompileOptions } from '../@types/compiler.js';
import { MarkdownRenderingOptions } from '@astrojs/markdown-support';
export { scopeRule } from './transform/postcss-scoped-styles/index.js';
interface ConvertAstroOptions {
    compileOptions: CompileOptions;
    filename: string;
    fileID: string;
}
/**
 * .astro -> .jsx
 * Core function processing .astro files. Initiates all 3 phases of compilation:
 * 1. Parse
 * 2. Transform
 * 3. Codegen
 */
export declare function convertAstroToJsx(template: string, opts: ConvertAstroOptions): Promise<TransformResult>;
/**
 * .md -> .astro source
 */
export declare function convertMdToAstroSource(contents: string, { filename }: {
    filename: string;
}, opts?: MarkdownRenderingOptions): Promise<string>;
/** Return internal code that gets processed in Snowpack */
interface CompileComponentOptions {
    compileOptions: CompileOptions;
    filename: string;
    projectRoot: string;
    isPage?: boolean;
}
/** Compiles an Astro component */
export declare function compileComponent(source: string, { compileOptions, filename, projectRoot }: CompileComponentOptions): Promise<CompileResult>;
