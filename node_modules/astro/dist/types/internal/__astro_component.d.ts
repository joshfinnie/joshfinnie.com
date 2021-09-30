import type { Renderer, AstroComponentMetadata } from '../@types/astro';
export interface RendererInstance {
    name: string | null;
    source: string | null;
    renderer: Renderer;
    polyfills: string[];
    hydrationPolyfills: string[];
}
export declare function setRenderers(_rendererInstances: RendererInstance[]): void;
/** The main wrapper for any components in Astro files */
export declare function __astro_component(Component: any, metadata?: AstroComponentMetadata): (props: any, ..._children: any[]) => Promise<any>;
