import type { TemplateNode } from '@astrojs/parser';
export declare class EndOfHead {
    private html;
    private head;
    private firstNonHead;
    private parent;
    private stack;
    foundHeadElements: boolean;
    foundBodyElements: boolean;
    append: (...node: TemplateNode[]) => void;
    get found(): boolean;
    get foundHeadContent(): boolean;
    get foundHeadAndBodyContent(): boolean;
    get foundHeadOrHtmlElement(): boolean;
    enter(node: TemplateNode): void;
    leave(_node: TemplateNode): void;
    private appendToHead;
    private prependToFirstNonHead;
}
