import type { Root as HastRoot } from 'hast';
import type { Root as MdastRoot } from 'mdast';
/**  */
export declare function remarkCodeBlock(): (tree: MdastRoot) => void;
/**  */
export declare function rehypeCodeBlock(): (tree: HastRoot) => void;
