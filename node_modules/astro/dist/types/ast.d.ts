import type { Attribute } from '@astrojs/parser';
/** Get TemplateNode attribute from name */
export declare function getAttr(attributes: Attribute[], name: string): Attribute | undefined;
/** Get TemplateNode attribute by value */
export declare function getAttrValue(attributes: Attribute[], name: string): string | undefined;
/** Set TemplateNode attribute value */
export declare function setAttrValue(attributes: Attribute[], name: string, value: string): void;
