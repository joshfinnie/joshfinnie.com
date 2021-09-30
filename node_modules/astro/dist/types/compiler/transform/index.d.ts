import type { Ast } from '@astrojs/parser';
import type { TransformOptions } from '../../@types/transformer';
/**
 * Transform
 * Step 2/3 in Astro SSR.
 * Transform is the point at which we mutate the AST before sending off to
 * Codegen, and then to Snowpack. In some ways, it‘s a preprocessor.
 */
export declare function transform(ast: Ast, opts: TransformOptions): Promise<void>;
