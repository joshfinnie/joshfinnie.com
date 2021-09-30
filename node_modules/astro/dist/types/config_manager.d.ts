import type { ServerRuntime as SnowpackServerRuntime, PluginLoadOptions } from 'snowpack';
import type { AstroConfig } from './@types/astro';
declare type RendererSnowpackPlugin = string | [string, any] | undefined;
interface RendererInstance {
    name: string;
    options: any;
    snowpackPlugin: RendererSnowpackPlugin;
    client: string | null;
    server: string;
    knownEntrypoints: string[] | undefined;
    external: string[] | undefined;
    polyfills: string[];
    hydrationPolyfills: string[];
    jsxImportSource?: string;
    jsxTransformOptions?: (transformContext: Omit<PluginLoadOptions, 'filePath' | 'fileExt'>) => undefined | {
        plugins?: any[];
        presets?: any[];
    } | Promise<{
        plugins?: any[];
        presets?: any[];
    }>;
}
export declare class ConfigManager {
    private astroConfig;
    private resolvePackageUrl;
    private state;
    snowpackRuntime: SnowpackServerRuntime | null;
    configModuleId: string | null;
    private rendererNames;
    private version;
    constructor(astroConfig: AstroConfig, resolvePackageUrl: (pkgName: string) => Promise<string>);
    markDirty(): void;
    update(): Promise<void>;
    isConfigModule(fileExt: string, filename: string): boolean;
    isAstroConfig(filename: string): boolean;
    buildRendererInstances(): Promise<RendererInstance[]>;
    getRenderers(): Promise<RendererInstance[]>;
    buildSource(contents: string): Promise<string>;
    needsUpdate(): boolean;
    private setRendererNames;
    private importModule;
}
export {};
