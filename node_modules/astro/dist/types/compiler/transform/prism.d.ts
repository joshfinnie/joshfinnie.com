import type { Transformer } from '../../@types/transformer';
import type { Script } from '@astrojs/parser';
export declare const PRISM_IMPORT = "import Prism from 'astro/components/Prism.astro';";
/** default export - Transform prism   */
export default function (module: Script): Transformer;
