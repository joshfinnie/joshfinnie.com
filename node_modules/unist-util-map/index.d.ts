/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist').Parent} Parent
 */
/**
 * Function called with a node to produce a new node.
 *
 * @callback MapFunction
 * @param {Node} node Current node being processed
 * @param {number} [index] Index of `node`, or `null`
 * @param {Parent} [parent] Parent of `node`, or `null`
 * @returns {Node} Node to be used in the new tree. Its children are not used: if the original node has children, those are mapped.
 */
/**
 * Unist utility to create a new tree by mapping all nodes with the given function.
 *
 * @param {Node} tree Tree to map
 * @param {MapFunction} iteratee Function that returns a new node
 * @returns {Node} New mapped tree.
 */
export function map(tree: Node, iteratee: MapFunction): Node
export type Node = import('unist').Node
export type Parent = import('unist').Parent
/**
 * Function called with a node to produce a new node.
 */
export type MapFunction = (node: Node, index?: number, parent?: Parent) => Node
