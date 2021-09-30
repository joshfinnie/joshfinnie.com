import type { GetHydrateCallback, HydrateOptions } from '../../@types/hydrate';
/**
 * Hydrate this component when one of it's children becomes visible.
 * We target the children because `astro-root` is set to `display: contents`
 * which doesn't work with IntersectionObserver
 */
export default function onVisible(astroId: string, _options: HydrateOptions, getHydrateCallback: GetHydrateCallback): Promise<void>;
