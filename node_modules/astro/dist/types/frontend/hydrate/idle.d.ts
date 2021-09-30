import type { GetHydrateCallback, HydrateOptions } from '../../@types/hydrate';
/**
 * Hydrate this component as soon as the main thread is free
 * (or after a short delay, if `requestIdleCallback`) isn't supported
 */
export default function onIdle(astroId: string, _options: HydrateOptions, getHydrateCallback: GetHydrateCallback): Promise<void>;
