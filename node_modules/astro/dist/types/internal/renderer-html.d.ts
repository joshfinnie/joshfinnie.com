declare function renderToStaticMarkup(tag: string, props: Record<string, any>, children: string): Promise<{
    html: string;
}>;
export { renderToStaticMarkup };
