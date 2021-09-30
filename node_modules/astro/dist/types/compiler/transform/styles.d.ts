import type { TransformOptions, Transformer } from '../../@types/transformer';
import { LogOptions } from '../../logger.js';
declare type StyleType = 'css' | 'scss' | 'sass' | 'postcss';
declare global {
    interface ImportMeta {
        /** https://nodejs.org/api/esm.html#esm_import_meta_resolve_specifier_parent */
        resolve(specifier: string, parent?: string): Promise<any>;
    }
}
export interface StyleTransformResult {
    css: string;
    type: StyleType;
}
export interface TransformStyleOptions {
    logging: LogOptions;
    type?: string;
    filename: string;
    scopedClass: string;
    tailwindConfig?: string;
    global?: boolean;
}
/** Transform <style> tags */
export default function transformStyles({ compileOptions, filename, fileID }: TransformOptions): Transformer;
export {};
