import { v4 as uuidv4 } from 'uuid'
import type { Node, Edge } from '@xyflow/react'
import {
  NodeType,
  NodeColor,
  PromptType,
  TopicNodeData,
  ContentNodeData,
  TermNodeData,
  ConceptNodeData,
  ConceptEdgeData,
} from '../types'

// ============================================
// NODE CREATION
// ============================================

export function createTopicNode(
  topic: string,
  position = { x: 0, y: 0 }
): Node<TopicNodeData> {
  const id = uuidv4()
  return {
    id,
    type: 'topic',
    position,
    data: {
      id,
      type: NodeType.TOPIC,
      topic,
      color: NodeColor.DEFAULT,
      parentId: null,
      childIds: [],
      createdAt: new Date().toISOString(),
      promptType: null,
    },
  }
}

export function createContentNode(
  title: string,
  content: string,
  parentId: string,
  promptType: PromptType,
  position = { x: 0, y: 0 }
): Node<ContentNodeData> {
  const id = uuidv4()
  return {
    id,
    type: 'content',
    position,
    data: {
      id,
      type: NodeType.CONTENT,
      title,
      content,
      color: NodeColor.DEFAULT,
      parentId,
      childIds: [],
      createdAt: new Date().toISOString(),
      promptType,
    },
  }
}

export function createTermNode(
  term: string,
  definition: string | undefined,
  parentId: string,
  promptType: PromptType,
  position = { x: 0, y: 0 }
): Node<TermNodeData> {
  const id = uuidv4()
  return {
    id,
    type: 'term',
    position,
    data: {
      id,
      type: NodeType.TERM,
      term,
      definition,
      color: NodeColor.DEFAULT,
      parentId,
      childIds: [],
      createdAt: new Date().toISOString(),
      promptType,
    },
  }
}

// ============================================
// EDGE CREATION
// ============================================

export function createEdge(
  sourceId: string,
  targetId: string
): Edge<ConceptEdgeData> {
  const id = `edge-${sourceId}-${targetId}`
  return {
    id,
    source: sourceId,
    target: targetId,
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'bezier',
    data: {
      id,
      source: sourceId,
      target: targetId,
      sourceHandle: 'bottom',
      targetHandle: 'top',
    },
  }
}

// ============================================
// POSITIONING
// ============================================

const CONTENT_NODE_WIDTH = 280
const CONTENT_NODE_HEIGHT = 200
const TERM_NODE_WIDTH = 240
const TERM_NODE_HEIGHT = 80
const VERTICAL_GAP = 80
const HORIZONTAL_GAP = 30

export function calculateChildPosition(
  parentNode: Node<ConceptNodeData>,
  existingChildren: Node<ConceptNodeData>[],
  _nodeType: 'content' | 'term'
): { x: number; y: number } {
  const parentX = parentNode.position.x
  const parentY = parentNode.position.y

  // Use measured dimensions if available (from React Flow), fall back to constants
  const measuredHeight = (parentNode as any).measured?.height
  let parentHeight: number
  if (measuredHeight) {
    parentHeight = measuredHeight
  } else if (parentNode.type === 'content') {
    parentHeight = CONTENT_NODE_HEIGHT
  } else if (parentNode.type === 'term') {
    parentHeight = TERM_NODE_HEIGHT
  } else {
    parentHeight = 50
  }

  // Calculate y position (below parent)
  const y = parentY + parentHeight + VERTICAL_GAP

  // Calculate x position (centered or offset based on existing children)
  const childCount = existingChildren.length

  if (childCount === 0) {
    // First child: center below parent
    return { x: parentX, y }
  }

  // Position to the right of existing children
  const lastChild = existingChildren[existingChildren.length - 1]
  const lastChildWidth =
    lastChild.type === 'content' ? CONTENT_NODE_WIDTH : TERM_NODE_WIDTH
  const x = lastChild.position.x + lastChildWidth + HORIZONTAL_GAP

  return { x, y }
}

export function calculateTermNodesPositions(
  parentNode: Node<ConceptNodeData>,
  termCount: number
): { x: number; y: number }[] {
  const parentX = parentNode.position.x
  const parentY = parentNode.position.y

  // Use measured dimensions if available (from React Flow), fall back to constants
  const measuredHeight = (parentNode as any).measured?.height
  let parentHeight: number
  if (measuredHeight) {
    parentHeight = measuredHeight
  } else if (parentNode.type === 'content') {
    parentHeight = CONTENT_NODE_HEIGHT
  } else if (parentNode.type === 'term') {
    parentHeight = TERM_NODE_HEIGHT
  } else {
    parentHeight = 50
  }

  const y = parentY + parentHeight + VERTICAL_GAP

  // Calculate total width of all term nodes
  const totalWidth =
    termCount * TERM_NODE_WIDTH + (termCount - 1) * HORIZONTAL_GAP

  // Start position (centered under parent)
  const startX = parentX - totalWidth / 2 + TERM_NODE_WIDTH / 2

  const positions: { x: number; y: number }[] = []
  for (let i = 0; i < termCount; i++) {
    positions.push({
      x: startX + i * (TERM_NODE_WIDTH + HORIZONTAL_GAP),
      y,
    })
  }

  return positions
}

// ============================================
// NODE TEXT EXTRACTION
// ============================================

export function getNodeText(node: Node<ConceptNodeData>): string {
  const data = node.data
  switch (data.type) {
    case NodeType.TOPIC:
      return data.topic
    case NodeType.CONTENT:
      return `${data.title}: ${data.content}`
    case NodeType.TERM:
      return data.definition ? `${data.term}: ${data.definition}` : data.term
    default:
      return ''
  }
}

export function getNodeLabel(node: Node<ConceptNodeData>): string {
  const data = node.data
  switch (data.type) {
    case NodeType.TOPIC:
      return data.topic
    case NodeType.CONTENT:
      return data.title
    case NodeType.TERM:
      return data.term
    default:
      return ''
  }
}

// ============================================
// DESCENDANT UTILITIES
// ============================================

export function getAllDescendantIds(
  nodeId: string,
  edges: Edge<ConceptEdgeData>[]
): Set<string> {
  const descendants = new Set<string>()
  const queue = [nodeId]

  while (queue.length > 0) {
    const current = queue.shift()!
    const children = edges
      .filter((e) => e.source === current)
      .map((e) => e.target)

    children.forEach((child) => {
      if (!descendants.has(child)) {
        descendants.add(child)
        queue.push(child)
      }
    })
  }

  return descendants
}

export function getDirectChildren(
  nodeId: string,
  nodes: Node<ConceptNodeData>[],
  edges: Edge<ConceptEdgeData>[]
): Node<ConceptNodeData>[] {
  const childIds = edges
    .filter((e) => e.source === nodeId)
    .map((e) => e.target)
  return nodes.filter((n) => childIds.includes(n.id))
}
