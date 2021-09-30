import type { AstroComponentMetadata } from '../@types/astro';
declare type ModuleCandidates = Map<any, string>;
interface RegistryOptions {
    candidates: ModuleCandidates;
}
declare class AstroElementRegistry {
    private candidates;
    private cache;
    constructor(options: RegistryOptions);
    find(tagName: string): string | undefined;
    findCached(tagName: string): string | undefined;
    astroComponentArgs(tagName: string, metadata: AstroComponentMetadata): (string | AstroComponentMetadata)[];
}
export { AstroElementRegistry };
