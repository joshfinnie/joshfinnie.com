import type { GetHydrateCallback, HydrateOptions } from '../../@types/hydrate';
/**
 * Hydrate this component immediately
 */
export default function onLoad(astroId: string, _options: HydrateOptions, getHydrateCallback: GetHydrateCallback): Promise<void>;
