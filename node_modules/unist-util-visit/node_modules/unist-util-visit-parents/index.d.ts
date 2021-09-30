/**
 * Continue traversing as normal
 */
export const CONTINUE: true
/**
 * Do not traverse this node’s children
 */
export const SKIP: 'skip'
/**
 * Stop traversing immediately
 */
export const EXIT: false
/**
 * Visit children of tree which pass a test
 *
 * @param tree Abstract syntax tree to walk
 * @param test Test node, optional
 * @param visitor Function to run for each node
 * @param reverse Visit the tree in reverse order, defaults to false
 */
export const visitParents: (<
  Tree extends import('unist').Node<import('unist').Data>,
  Check extends import('unist-util-is').Test
>(
  tree: Tree,
  test: Check,
  visitor: Visitor<
    import('./complex-types').Matches<
      import('./complex-types').InclusiveDescendant<Tree, void>,
      Check
    >
  >,
  reverse?: boolean | undefined
) => void) &
  (<Tree_1 extends import('unist').Node<import('unist').Data>>(
    tree: Tree_1,
    visitor: Visitor<
      import('./complex-types').InclusiveDescendant<Tree_1, void>
    >,
    reverse?: boolean | undefined
  ) => void)
export type Node = import('unist').Node
export type Parent = import('unist').Parent
export type Test = import('unist-util-is').Test
/**
 * Union of the action types
 */
export type Action = true | 'skip' | false
/**
 * Move to the sibling at index next (after node itself is completely traversed). Useful if mutating the tree, such as removing the node the visitor is currently on, or any of its previous siblings (or next siblings, in case of reverse) Results less than 0 or greater than or equal to children.length stop traversing the parent
 */
export type Index = number
/**
 * List with one or two values, the first an action, the second an index.
 */
export type ActionTuple = [
  (Action | null | undefined | void)?,
  (Index | null | undefined)?
]
/**
 * Any value that can be returned from a visitor
 */
export type VisitorResult =
  | null
  | undefined
  | Action
  | Index
  | [(void | Action | null | undefined)?, (number | null | undefined)?]
  | void
/**
 * Invoked when a node (matching test, if given) is found.
 * Visitors are free to transform node.
 * They can also transform the parent of node (the last of ancestors).
 * Replacing node itself, if `SKIP` is not returned, still causes its descendants to be visited.
 * If adding or removing previous siblings (or next siblings, in case of reverse) of node,
 * visitor should return a new index (number) to specify the sibling to traverse after node is traversed.
 * Adding or removing next siblings of node (or previous siblings, in case of reverse)
 * is handled as expected without needing to return a new index.
 * Removing the children property of an ancestor still results in them being traversed.
 */
export type Visitor<V extends import('unist').Node<import('unist').Data>> = (
  node: V,
  ancestors: Array<Parent>
) => VisitorResult
