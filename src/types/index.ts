// ============================================
// NODE TYPES
// ============================================

export enum NodeType {
  TOPIC = 'topic',
  CONTENT = 'content',
  TERM = 'term',
  WIKIPEDIA = 'wikipedia',
  BOOK = 'book',
}

// ============================================
// PROMPT TYPES
// ============================================

export enum PromptType {
  WHAT = 'what',
  HOW = 'how',
  WHO = 'who',
  ORIGIN = 'origin',
  ELABORATE = 'elaborate',
  PROS = 'pros',
  CONS = 'cons',
  EXAMPLE = 'example',
  RESEARCH = 'research',
  EXTRACT = 'extract',
  CONCEPTS = 'concepts',
  COMPARE = 'compare',
  ANALOGY = 'analogy',
  CONTROVERSY = 'controversy',
  IMPLICATIONS = 'implications',
  SIGNIFICANCE = 'significance',
  INTERESTING = 'interesting',
  EXPLAIN = 'explain',
  QUESTIONS = 'questions',
  SPLIT = 'split',
  JOIN = 'join',
  FIGURES = 'figures',
  BOOKS = 'books',
  CUSTOM = 'custom',
}

// ============================================
// NODE COLORS
// ============================================

export enum NodeColor {
  DEFAULT = 'default',
  GREY = 'grey',
  PINK = 'pink',
  PURPLE = 'purple',
  BLUE = 'blue',
  CYAN = 'cyan',
  YELLOW = 'yellow',
  CREAM = 'cream',
  ORANGE = 'orange',
  LAVENDER = 'lavender',
  LIGHT_PINK = 'light_pink',
  LIGHT_BLUE = 'light_blue',
  MINT = 'mint',
}

// ============================================
// BASE NODE DATA (with index signature for React Flow compatibility)
// ============================================

export interface BaseNodeData {
  [key: string]: unknown
  id: string
  type: NodeType
  color: NodeColor
  parentId: string | null
  childIds: string[]
  createdAt: string
  promptType: PromptType | null
}

// ============================================
// TOPIC NODE (Root)
// ============================================

export interface TopicNodeData extends BaseNodeData {
  type: NodeType.TOPIC
  topic: string
  parentId: null
}

// ============================================
// CONTENT NODE (Large with text)
// ============================================

export interface ContentNodeData extends BaseNodeData {
  type: NodeType.CONTENT
  title: string
  content: string
}

// ============================================
// TERM NODE (Small label)
// ============================================

export interface TermNodeData extends BaseNodeData {
  type: NodeType.TERM
  term: string
  definition?: string
}

// ============================================
// WIKIPEDIA NODE
// ============================================

export interface WikipediaNodeData extends BaseNodeData {
  type: NodeType.WIKIPEDIA
  title: string
  extract: string
  pageUrl: string
}

// ============================================
// BOOK NODE
// ============================================

export interface BookNodeData extends BaseNodeData {
  type: NodeType.BOOK
  title: string
  author: string
  coverUrl: string | null
  description: string
}

// ============================================
// UNION TYPE
// ============================================

export type ConceptNodeData = TopicNodeData | ContentNodeData | TermNodeData | WikipediaNodeData | BookNodeData

// ============================================
// EDGE DATA (with index signature for React Flow compatibility)
// ============================================

export interface ConceptEdgeData {
  [key: string]: unknown
  id: string
  source: string
  target: string
  sourceHandle: string
  targetHandle: string
}

// ============================================
// PROJECT DATA (for Save/Load)
// ============================================

export interface ProjectData {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  topic: string
  nodes: ConceptNodeData[]
  edges: ConceptEdgeData[]
  viewport: {
    x: number
    y: number
    zoom: number
  }
}

// ============================================
// PROMPT CONFIGURATION
// ============================================

export interface PromptConfig {
  type: PromptType
  label: string
  icon?: string
  description: string
  generatesTerms: boolean
  generatesContentFromTerms?: boolean
  generatesBookNodes?: boolean
  isLocked?: boolean
  systemPrompt: string
}

// ============================================
// CHAT MESSAGE
// ============================================

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// ============================================
// TOAST
// ============================================

export interface ToastData {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
