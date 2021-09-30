import type { GetHydrateCallback, HydrateOptions } from '../../@types/hydrate';
/**
 * Hydrate this component when a matching media query is found
 */
export default function onMedia(astroId: string, options: HydrateOptions, getHydrateCallback: GetHydrateCallback): Promise<void>;
