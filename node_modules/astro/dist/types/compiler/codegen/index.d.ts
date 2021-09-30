import type { Ast } from '@astrojs/parser';
import type { CompileOptions } from '../../@types/compiler';
import type { TransformResult } from '../../@types/astro';
interface CodeGenOptions {
    compileOptions: CompileOptions;
    filename: string;
    fileID: string;
}
/**
 * Codegen
 * Step 3/3 in Astro SSR.
 * This is the final pass over a document AST before it‘s converted to an h() function
 * and handed off to Snowpack to build.
 * @param {Ast} AST The parsed AST to crawl
 * @param {object} CodeGenOptions
 */
export declare function codegen(ast: Ast, { compileOptions, filename, fileID }: CodeGenOptions): Promise<TransformResult>;
export {};
