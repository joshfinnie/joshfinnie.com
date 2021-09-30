export declare type HProps = Record<string, string | boolean> | null | undefined;
export declare type HChild = string | undefined | (() => string);
export declare type AstroComponent = (props: HProps, ...children: Array<HChild>) => string;
export declare type HTag = string | AstroComponent;
/** Astro‘s primary h() function. Allows it to use JSX-like syntax. */
export declare function h(tag: HTag, attrs: HProps, ...pChildren: Array<Promise<HChild>>): Promise<string>;
/** Fragment helper, similar to React.Fragment */
export declare function Fragment(_: HProps, ...children: Array<HChild>): string;
