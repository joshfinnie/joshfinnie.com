import type { Root } from 'hast';
/**  */
export default function createCollectHeaders(): {
    headers: any[];
    rehypeCollectHeaders: () => (tree: Root) => void;
};
