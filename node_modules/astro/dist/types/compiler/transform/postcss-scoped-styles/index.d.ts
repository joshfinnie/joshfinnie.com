import { Plugin } from 'postcss';
interface AstroScopedOptions {
    className: string;
}
/** HTML tags that should never get scoped classes */
export declare const NEVER_SCOPED_TAGS: Set<string>;
/**
 * Scope Rules
 * Given a selector string (`.btn>span,.nav>span`), add an additional CSS class to every selector (`.btn.myClass>span.myClass,.nav.myClass>span.myClass`)
 * @param {string} selector The minified selector string to parse. Cannot contain arbitrary whitespace (other than child selector syntax).
 * @param {string} className The CSS class to apply.
 */
export declare function scopeRule(selector: string, className: string): string;
/** PostCSS Scope plugin */
export default function astroScopedStyles(options: AstroScopedOptions): Plugin;
export {};
