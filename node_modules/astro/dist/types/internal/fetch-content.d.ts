/**
 * Convert the result of an `import.meta.globEager()` call to an array of processed
 * Markdown content objects. Filter out any non-Markdown files matched in the glob
 * result, by default.
 */
export declare function fetchContent(importMetaGlobResult: Record<string, any>, url: string): any[];
