/**
 * Codegen utils
 */
import type { VariableDeclarator } from '@babel/types';
import type { Attribute } from './interfaces';
import type { LogOptions } from '../../logger';
/** Is this an import.meta.* built-in? You can pass an optional 2nd param to see if the name matches as well. */
export declare function isImportMetaDeclaration(declaration: VariableDeclarator, metaName?: string): boolean;
export declare function warnIfRelativeStringLiteral(logging: LogOptions, nodeName: string, attr: Attribute, value: string): void;
