/** Is the given string a custom-element tag? */
export declare function isCustomElementTag(tag: string): boolean;
/** Is the given string a valid component tag */
export declare function isComponentTag(tag: string): boolean;
export interface Position {
    line: number;
    character: number;
}
/** Clamps a number between min and max */
export declare function clamp(num: number, min: number, max: number): number;
/**
 * Get the line and character based on the offset
 * @param offset The index of the position
 * @param text The text for which the position should be retrived
 */
export declare function positionAt(offset: number, text: string): Position;
/**
 * Get the offset of the line and character position
 * @param position Line and character position
 * @param text The text for which the offset should be retrived
 */
export declare function offsetAt(position: Position, text: string): number;
