import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Node, Edge, OnNodesChange, OnEdgesChange } from '@xyflow/react'
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import {
  NodeType,
  NodeColor,
  PromptType,
  ConceptNodeData,
  ConceptEdgeData,
  ChatMessage,
  ToastData,
  ProjectData,
} from '../types'
import { getPromptConfig, CHAT_SYSTEM_PROMPT } from '../config/prompts'
import {
  createTopicNode,
  createContentNode,
  createTermNode,
  createWikipediaNode,
  createBookNode,
  createEdge,
  calculateChildPosition,
  calculateTermNodesPositions,
  calculateContentNodesPositions,
  calculateBookNodesPositions,
  getNodeText,
  getNodeLabel,
  getAllDescendantIds,
  getDirectChildren,
} from '../utils/nodeUtils'
import { parseTermsFromResponse, stripMarkdown, TermItem } from '../utils/parseUtils'
import { GeminiService } from '../services/geminiService'
import { storageService } from '../services/storageService'
import { searchWikipedia as searchWikipediaApi, WikipediaSearchResult } from '../services/wikipediaService'
import { searchBookCover } from '../services/bookService'

// ============================================
// STORE INTERFACE
// ============================================

interface ConceptMapStore {
  // Project
  projectId: string | null
  projectName: string
  topic: string

  // Graph
  nodes: Node<ConceptNodeData>[]
  edges: Edge<ConceptEdgeData>[]

  // Selection
  selectedNodeId: string | null
  compareNodeId: string | null

  // History (Undo/Redo)
  undoStack: Array<{ nodes: Node<ConceptNodeData>[]; edges: Edge<ConceptEdgeData>[] }>
  redoStack: Array<{ nodes: Node<ConceptNodeData>[]; edges: Edge<ConceptEdgeData>[] }>

  // UI State
  isSidebarOpen: boolean
  isResponseModalOpen: boolean
  isColorPickerOpen: boolean
  isChatModalOpen: boolean
  isLoadModalOpen: boolean
  isApiKeyModalOpen: boolean
  isExtractModalOpen: boolean
  isExtractLoading: boolean

  // Extract Selection State
  extractedTerms: TermItem[]

  // Wikipedia State
  isWikipediaModalOpen: boolean
  isWikipediaLoading: boolean
  wikipediaResults: WikipediaSearchResult[]

  // Response Modal State
  currentPromptType: PromptType | null
  currentResponse: string
  isStreaming: boolean
  customPromptText: string

  // Reader Modal State
  isReaderOpen: boolean
  readerTitle: string
  readerContent: string

  // Chat State
  chatMessages: ChatMessage[]
  isChatStreaming: boolean

  // Difficulty
  difficultyLevel: number // 0-4: ELI5, Middle School, High School, Undergraduate, Expert

  // Settings
  apiKey: string | null

  // Toast
  toasts: ToastData[]

  // Actions
  setTopic: (topic: string) => void
  selectNode: (nodeId: string | null, shiftKey?: boolean) => void
  pushHistory: () => void
  undo: () => void
  redo: () => void
  generateResponse: (
    promptType: PromptType,
    customPrompt?: string
  ) => Promise<void>
  addNodeFromResponse: () => void
  deleteNode: (nodeId: string) => void
  regenerateNode: (nodeId: string) => Promise<void>
  setNodeColor: (nodeId: string, color: NodeColor) => void
  setColorForSimilarNodes: (nodeId: string, color: NodeColor) => void
  updateNodeContent: (nodeId: string, content: string) => void

  // Modal actions
  openResponseModal: (promptType: PromptType) => void
  closeResponseModal: () => void
  openColorPicker: () => void
  closeColorPicker: () => void
  openChatModal: () => void
  closeChatModal: () => void
  openLoadModal: () => void
  closeLoadModal: () => void
  openApiKeyModal: () => void
  closeApiKeyModal: () => void
  openExtractModal: (terms: TermItem[]) => void
  closeExtractModal: () => void
  openReader: (title: string, content: string) => void
  closeReader: () => void
  addSelectedTerms: (selectedIndices: number[]) => Promise<void>
  setCustomPromptText: (text: string) => void

  // Wikipedia actions
  searchWikipedia: () => Promise<void>
  closeWikipediaModal: () => void
  addSelectedWikipediaArticles: (selectedIndices: number[]) => void

  // Chat actions
  sendChatMessage: (message: string) => Promise<void>
  clearChatMessages: () => void

  // React Flow handlers
  onNodesChange: OnNodesChange<Node<ConceptNodeData>>
  onEdgesChange: OnEdgesChange<Edge<ConceptEdgeData>>

  // Project actions
  saveProject: () => void
  loadProject: (projectId: string) => void
  newProject: () => void
  setProjectName: (name: string) => void
  exportJSON: () => void

  // Difficulty
  setDifficultyLevel: (level: number) => void

  // API Key
  setApiKey: (key: string) => void

  // Toast
  addToast: (message: string, type: ToastData['type']) => void
  removeToast: (id: string) => void
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useConceptMapStore = create<ConceptMapStore>()(
  persist(
    (set, get) => ({
      // ========== INITIAL STATE ==========
      projectId: null,
      projectName: 'Untitled',
      topic: '',

      nodes: [],
      edges: [],

      selectedNodeId: null,
      compareNodeId: null,

      undoStack: [],
      redoStack: [],

      isSidebarOpen: false,
      isResponseModalOpen: false,
      isColorPickerOpen: false,
      isChatModalOpen: false,
      isLoadModalOpen: false,
      isApiKeyModalOpen: false,
      isExtractModalOpen: false,
      isExtractLoading: false,

      extractedTerms: [],

      isWikipediaModalOpen: false,
      isWikipediaLoading: false,
      wikipediaResults: [],

      currentPromptType: null,
      currentResponse: '',
      isStreaming: false,
      customPromptText: '',

      isReaderOpen: false,
      readerTitle: '',
      readerContent: '',

      chatMessages: [],
      isChatStreaming: false,

      difficultyLevel: 2, // Default: High School

      apiKey: import.meta.env.VITE_GEMINI_API_KEY || null,

      toasts: [],

      // ========== TOPIC & SELECTION ==========

      setTopic: (topic: string) => {
        const topicNode = createTopicNode(topic, { x: 400, y: 100 })
        set({
          topic,
          nodes: [topicNode],
          edges: [],
          selectedNodeId: topicNode.id,
          isSidebarOpen: true,
          projectId: null,
        })
      },

      selectNode: (nodeId: string | null, shiftKey?: boolean) => {
        if (shiftKey && nodeId && get().selectedNodeId && nodeId !== get().selectedNodeId) {
          // Shift-click: set as compare node
          set({ compareNodeId: nodeId })
        } else {
          set({
            selectedNodeId: nodeId,
            compareNodeId: null,
            isSidebarOpen: nodeId !== null,
          })
        }
      },

      pushHistory: () => {
        const { nodes, edges, undoStack } = get()
        const snapshot = {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
        }
        const newStack = [...undoStack, snapshot]
        if (newStack.length > 50) newStack.shift()
        set({ undoStack: newStack, redoStack: [] })
      },

      undo: () => {
        const { nodes, edges, undoStack, redoStack } = get()
        if (undoStack.length === 0) return
        const prev = undoStack[undoStack.length - 1]
        const currentSnapshot = {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
        }
        set({
          nodes: prev.nodes,
          edges: prev.edges,
          undoStack: undoStack.slice(0, -1),
          redoStack: [...redoStack, currentSnapshot],
        })
      },

      redo: () => {
        const { nodes, edges, undoStack, redoStack } = get()
        if (redoStack.length === 0) return
        const next = redoStack[redoStack.length - 1]
        const currentSnapshot = {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
        }
        set({
          nodes: next.nodes,
          edges: next.edges,
          undoStack: [...undoStack, currentSnapshot],
          redoStack: redoStack.slice(0, -1),
        })
      },

      // ========== RESPONSE GENERATION ==========

      generateResponse: async (
        promptType: PromptType,
        customPrompt?: string
      ) => {
        const { selectedNodeId, compareNodeId, nodes, apiKey, difficultyLevel } = get()
        if (!selectedNodeId) return

        if (!apiKey) {
          set({ isApiKeyModalOpen: true })
          get().addToast('Please add your Gemini API key', 'error')
          return
        }

        // Compare requires 2 nodes
        if (promptType === PromptType.COMPARE && !compareNodeId) {
          get().addToast('Hold Shift and click a second node, then click Compare again', 'info')
          return
        }

        const selectedNode = nodes.find((n) => n.id === selectedNodeId)
        if (!selectedNode) return

        const config = getPromptConfig(promptType)
        if (!config) return

        // Difficulty level descriptions
        const DIFFICULTY_LABELS = [
          'Explain as if to a 5-year-old child. Use very simple words and analogies.',
          'Explain at a middle school level. Use simple language suitable for a 12-year-old.',
          'Explain at a high school level. Use clear language appropriate for a teenager.',
          'Explain at an undergraduate university level. Use proper terminology.',
          'Explain at an expert/graduate level. Use advanced terminology and assume deep knowledge.',
        ]
        const difficultyPrefix = `Difficulty level: ${DIFFICULTY_LABELS[difficultyLevel]}\n\n`

        // Build node text (handle compare with 2 nodes)
        let nodeText = getNodeText(selectedNode)
        if (promptType === PromptType.COMPARE && compareNodeId) {
          const compareNode = nodes.find((n) => n.id === compareNodeId)
          if (compareNode) {
            nodeText = `Topic A: ${getNodeText(selectedNode)}\n\nTopic B: ${getNodeText(compareNode)}`
          }
        }

        // For term-generating prompts, skip ResponseModal and show bottom loading
        if (config.generatesTerms) {
          set({
            isExtractLoading: true,
            currentPromptType: promptType,
            currentResponse: '',
          })

          try {
            const service = new GeminiService(apiKey)
            let fullResponse = ''

            for await (const chunk of service.streamGenerate(difficultyPrefix + config.systemPrompt, nodeText)) {
              fullResponse += chunk
            }

            // Parse terms and open selection modal directly
            const terms = parseTermsFromResponse(fullResponse)
            if (terms.length === 0) {
              get().addToast('Could not parse terms from response', 'error')
            } else {
              set({
                extractedTerms: terms,
                isExtractModalOpen: true,
              })
            }
          } catch (error) {
            console.error('Generation error:', error)
            const errorMessage =
              error instanceof Error ? error.message : 'Generation failed'
            get().addToast(errorMessage, 'error')
          } finally {
            set({ isExtractLoading: false })
          }
        } else {
          // Non-term prompts: show ResponseModal as before
          set({
            isResponseModalOpen: true,
            currentPromptType: promptType,
            currentResponse: '',
            isStreaming: true,
          })

          try {
            let prompt = difficultyPrefix + config.systemPrompt

            if (promptType === PromptType.CUSTOM && customPrompt) {
              prompt = `${difficultyPrefix}${config.systemPrompt}\n\nUser's question: ${customPrompt}`
            }

            const service = new GeminiService(apiKey)
            for await (const chunk of service.streamGenerate(prompt, nodeText)) {
              set((state) => ({
                currentResponse: state.currentResponse + chunk,
              }))
            }

            // Strip markdown from final response
            set((state) => ({
              currentResponse: stripMarkdown(state.currentResponse),
            }))
          } catch (error) {
            console.error('Generation error:', error)
            const errorMessage =
              error instanceof Error ? error.message : 'Generation failed'
            get().addToast(errorMessage, 'error')
          } finally {
            set({ isStreaming: false })
          }
        }
      },

      addNodeFromResponse: () => {
        get().pushHistory()
        const {
          selectedNodeId,
          nodes,
          edges,
          currentPromptType,
          currentResponse,
        } = get()
        if (!selectedNodeId || !currentResponse || !currentPromptType) return

        const config = getPromptConfig(currentPromptType)
        if (!config) return

        const parentNode = nodes.find((n) => n.id === selectedNodeId)
        if (!parentNode) return

        let newNodes: Node<ConceptNodeData>[] = []
        let newEdges: Edge<ConceptEdgeData>[] = []

        if (config.generatesTerms) {
          // Parse JSON response and show selection modal
          const terms = parseTermsFromResponse(currentResponse)

          if (terms.length === 0) {
            get().addToast('Could not parse terms from response', 'error')
            return
          }

          // Open selection modal instead of auto-adding
          get().openExtractModal(terms)
          return
        } else {
          // Create single Content node
          const existingChildren = getDirectChildren(
            selectedNodeId,
            nodes,
            edges
          )
          const position = calculateChildPosition(
            parentNode,
            existingChildren,
            'content'
          )

          const newNode = createContentNode(
            config.label,
            currentResponse,
            selectedNodeId,
            currentPromptType,
            position
          )

          // Informational content nodes get a subtle grey tint
          newNode.data.color = NodeColor.GREY

          newNodes = [newNode]
          newEdges = [createEdge(selectedNodeId, newNode.id)]
        }

        // Update parent's childIds
        const updatedNodes = nodes.map((n) =>
          n.id === selectedNodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  childIds: [
                    ...n.data.childIds,
                    ...newNodes.map((node) => node.id),
                  ],
                },
              }
            : n
        )

        set({
          nodes: [...updatedNodes, ...newNodes],
          edges: [...edges, ...newEdges],
          isResponseModalOpen: false,
          currentResponse: '',
          currentPromptType: null,
        })

        get().addToast('Node added to concept map', 'success')
      },

      deleteNode: (nodeId: string) => {
        get().pushHistory()
        const { nodes, edges } = get()

        // Can't delete root node
        const node = nodes.find((n) => n.id === nodeId)
        if (!node || node.data.type === NodeType.TOPIC) {
          get().addToast('Cannot delete the root topic node', 'error')
          return
        }

        // Get all descendant IDs to delete
        const toDelete = new Set([nodeId, ...getAllDescendantIds(nodeId, edges)])

        // Remove from parent's childIds
        const parentId = node.data.parentId
        const updatedNodes = nodes
          .filter((n) => !toDelete.has(n.id))
          .map((n) =>
            n.id === parentId
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    childIds: n.data.childIds.filter((id) => !toDelete.has(id)),
                  },
                }
              : n
          )

        set({
          nodes: updatedNodes,
          edges: edges.filter(
            (e) => !toDelete.has(e.source) && !toDelete.has(e.target)
          ),
          selectedNodeId: null,
          isSidebarOpen: false,
        })

        get().addToast('Node deleted', 'info')
      },

      regenerateNode: async (nodeId: string) => {
        const { nodes, apiKey } = get()

        if (!apiKey) {
          set({ isApiKeyModalOpen: true })
          get().addToast('Please add your Gemini API key', 'error')
          return
        }

        const node = nodes.find((n) => n.id === nodeId)
        if (!node || node.data.type !== NodeType.CONTENT) return

        const contentData = node.data as ConceptNodeData & {
          type: typeof NodeType.CONTENT
        }
        if (!contentData.promptType) return

        const config = getPromptConfig(contentData.promptType)
        if (!config) return

        // Find parent node to get context
        const parentNode = nodes.find((n) => n.id === contentData.parentId)
        if (!parentNode) return

        set({
          isResponseModalOpen: true,
          currentPromptType: contentData.promptType,
          currentResponse: '',
          isStreaming: true,
          selectedNodeId: nodeId,
        })

        try {
          const nodeText = getNodeText(parentNode)
          const service = new GeminiService(apiKey)

          let newContent = ''
          for await (const chunk of service.streamGenerate(
            config.systemPrompt,
            nodeText
          )) {
            newContent += chunk
            set({ currentResponse: newContent })
          }

          // Update the node with new content
          set((state) => ({
            nodes: state.nodes.map((n) =>
              n.id === nodeId
                ? {
                    ...n,
                    data: { ...n.data, content: newContent },
                  }
                : n
            ),
            isResponseModalOpen: false,
            currentResponse: '',
            isStreaming: false,
          }))

          get().addToast('Content regenerated', 'success')
        } catch (error) {
          console.error('Regeneration error:', error)
          get().addToast('Failed to regenerate content', 'error')
          set({ isStreaming: false })
        }
      },

      // ========== NODE COLORS ==========

      setNodeColor: (nodeId: string, color: NodeColor) => {
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, color } } : n
          ),
        }))
      },

      setColorForSimilarNodes: (nodeId: string, color: NodeColor) => {
        const { nodes } = get()
        const targetNode = nodes.find((n) => n.id === nodeId)
        if (!targetNode) return

        const promptType = targetNode.data.promptType
        const nodeType = targetNode.data.type
        const parentId = targetNode.data.parentId

        set((state) => ({
          nodes: state.nodes.map((n) => {
            const isSameParent = n.data.parentId === parentId
            const isSimilar =
              isSameParent && n.data.promptType === promptType && promptType !== null
            const isSameType = isSameParent && n.data.type === nodeType
            return isSimilar || (promptType === null && isSameType)
              ? { ...n, data: { ...n.data, color } }
              : n
          }),
        }))

        get().addToast('Color applied to similar nodes', 'success')
      },

      updateNodeContent: (nodeId: string, content: string) => {
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, content } } : n
          ),
        }))
      },

      // ========== MODAL ACTIONS ==========

      openResponseModal: (promptType: PromptType) => {
        set({
          isResponseModalOpen: true,
          currentPromptType: promptType,
          currentResponse: '',
        })
      },

      closeResponseModal: () => {
        set({
          isResponseModalOpen: false,
          currentResponse: '',
          isStreaming: false,
        })
      },

      openColorPicker: () => set({ isColorPickerOpen: true }),
      closeColorPicker: () => set({ isColorPickerOpen: false }),

      openChatModal: () => set({ isChatModalOpen: true }),
      closeChatModal: () => set({ isChatModalOpen: false }),

      openLoadModal: () => set({ isLoadModalOpen: true }),
      closeLoadModal: () => set({ isLoadModalOpen: false }),

      openApiKeyModal: () => set({ isApiKeyModalOpen: true }),
      closeApiKeyModal: () => set({ isApiKeyModalOpen: false }),

      openExtractModal: (terms: TermItem[]) =>
        set({ isExtractModalOpen: true, extractedTerms: terms }),
      closeExtractModal: () =>
        set({ isExtractModalOpen: false, extractedTerms: [] }),

      openReader: (title: string, content: string) =>
        set({ isReaderOpen: true, readerTitle: title, readerContent: content }),
      closeReader: () =>
        set({ isReaderOpen: false, readerTitle: '', readerContent: '' }),

      addSelectedTerms: async (selectedIndices: number[]) => {
        get().pushHistory()
        const { selectedNodeId, nodes, edges, extractedTerms, currentPromptType, apiKey, difficultyLevel } =
          get()
        if (!selectedNodeId || selectedIndices.length === 0) return

        const parentNode = nodes.find((n) => n.id === selectedNodeId)
        if (!parentNode) return

        const config = currentPromptType ? getPromptConfig(currentPromptType) : null

        // Get only the selected terms
        const selectedTerms = selectedIndices
          .map((i) => extractedTerms[i])
          .filter(Boolean)

        if (selectedTerms.length === 0) return

        // Questions flow: generate answers and create content nodes
        if (config?.generatesContentFromTerms && apiKey) {
          set({ isExtractModalOpen: false, isExtractLoading: true })

          try {
            const service = new GeminiService(apiKey)
            const DIFFICULTY_LABELS = [
              'Explain as if to a 5-year-old child. Use very simple words and analogies.',
              'Explain at a middle school level. Use simple language suitable for a 12-year-old.',
              'Explain at a high school level. Use clear language appropriate for a teenager.',
              'Explain at an undergraduate university level. Use proper terminology.',
              'Explain at an expert/graduate level. Use advanced terminology and assume deep knowledge.',
            ]
            const difficultyPrefix = `Difficulty level: ${DIFFICULTY_LABELS[difficultyLevel]}\n\n`

            const answerPrompt = `${difficultyPrefix}Answer the following question about the topic in detail. Be comprehensive but concise. Maximum 200 words.`
            const parentText = getNodeText(parentNode)

            // Generate answers for each selected question
            const answers: string[] = []
            for (const term of selectedTerms) {
              const userContent = `Topic context: ${parentText}\n\nQuestion: ${term.name}`
              const answer = await service.generate(answerPrompt, userContent)
              answers.push(stripMarkdown(answer))
            }

            // Re-read current state after async operations
            const { nodes: currentNodes, edges: currentEdges } = get()
            const positions = calculateContentNodesPositions(parentNode, selectedTerms.length)

            const newNodes = selectedTerms.map((term, index) =>
              createContentNode(
                term.name,
                answers[index],
                selectedNodeId,
                currentPromptType || PromptType.QUESTIONS,
                positions[index]
              )
            )

            const newEdges = newNodes.map((node) =>
              createEdge(selectedNodeId, node.id)
            )

            const updatedNodes = currentNodes.map((n) =>
              n.id === selectedNodeId
                ? {
                    ...n,
                    data: {
                      ...n.data,
                      childIds: [...n.data.childIds, ...newNodes.map((node) => node.id)],
                    },
                  }
                : n
            )

            set({
              nodes: [...updatedNodes, ...newNodes],
              edges: [...currentEdges, ...newEdges],
              extractedTerms: [],
              currentResponse: '',
              currentPromptType: null,
            })

            get().addToast(
              `Added ${selectedTerms.length} answered question${selectedTerms.length > 1 ? 's' : ''} to concept map`,
              'success'
            )
          } catch (error) {
            console.error('Answer generation error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate answers'
            get().addToast(errorMessage, 'error')
          } finally {
            set({ isExtractLoading: false })
          }
          return
        }

        // Books flow: fetch covers and create book nodes
        if (config?.generatesBookNodes) {
          set({ isExtractModalOpen: false, isExtractLoading: true })

          try {
            // Fetch covers from Open Library for each selected book
            const coverUrls: (string | null)[] = []
            for (const term of selectedTerms) {
              const coverUrl = await searchBookCover(term.name, term.author)
              coverUrls.push(coverUrl)
            }

            const { nodes: currentNodes, edges: currentEdges } = get()
            const positions = calculateBookNodesPositions(parentNode, selectedTerms.length)

            const newNodes = selectedTerms.map((term, index) =>
              createBookNode(
                term.name,
                term.author || 'Unknown Author',
                coverUrls[index],
                term.description || '',
                selectedNodeId,
                positions[index]
              )
            )

            const newEdges = newNodes.map((node) =>
              createEdge(selectedNodeId, node.id)
            )

            const updatedNodes = currentNodes.map((n) =>
              n.id === selectedNodeId
                ? {
                    ...n,
                    data: {
                      ...n.data,
                      childIds: [...n.data.childIds, ...newNodes.map((node) => node.id)],
                    },
                  }
                : n
            )

            set({
              nodes: [...updatedNodes, ...newNodes],
              edges: [...currentEdges, ...newEdges],
              extractedTerms: [],
              currentResponse: '',
              currentPromptType: null,
            })

            get().addToast(
              `Added ${selectedTerms.length} book${selectedTerms.length > 1 ? 's' : ''} to concept map`,
              'success'
            )
          } catch (error) {
            console.error('Book cover fetch error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch book covers'
            get().addToast(errorMessage, 'error')
          } finally {
            set({ isExtractLoading: false })
          }
          return
        }

        // Default flow: create term nodes
        const positions = calculateTermNodesPositions(
          parentNode,
          selectedTerms.length
        )

        const newNodes = selectedTerms.map((term, index) =>
          createTermNode(
            term.name,
            term.description,
            selectedNodeId,
            currentPromptType || PromptType.EXTRACT,
            positions[index]
          )
        )

        const newEdges = newNodes.map((node) =>
          createEdge(selectedNodeId, node.id)
        )

        // Update parent's childIds
        const updatedNodes = nodes.map((n) =>
          n.id === selectedNodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  childIds: [...n.data.childIds, ...newNodes.map((node) => node.id)],
                },
              }
            : n
        )

        set({
          nodes: [...updatedNodes, ...newNodes],
          edges: [...edges, ...newEdges],
          isExtractModalOpen: false,
          extractedTerms: [],
          isResponseModalOpen: false,
          currentResponse: '',
          currentPromptType: null,
        })

        get().addToast(
          `Added ${selectedTerms.length} term${selectedTerms.length > 1 ? 's' : ''} to concept map`,
          'success'
        )
      },

      setCustomPromptText: (text: string) => set({ customPromptText: text }),

      // ========== WIKIPEDIA ACTIONS ==========

      searchWikipedia: async () => {
        const { selectedNodeId, nodes } = get()
        if (!selectedNodeId) return

        const selectedNode = nodes.find((n) => n.id === selectedNodeId)
        if (!selectedNode) return

        const label = getNodeLabel(selectedNode)
        if (!label) return

        set({ isWikipediaLoading: true })

        try {
          const results = await searchWikipediaApi(label)
          set({
            wikipediaResults: results,
            isWikipediaModalOpen: true,
            isWikipediaLoading: false,
          })
        } catch (err) {
          console.error('Wikipedia search failed:', err)
          set({ isWikipediaLoading: false })
          get().addToast('Failed to search Wikipedia', 'error')
        }
      },

      closeWikipediaModal: () => {
        set({
          isWikipediaModalOpen: false,
          wikipediaResults: [],
        })
      },

      addSelectedWikipediaArticles: (selectedIndices: number[]) => {
        get().pushHistory()
        const { selectedNodeId, nodes, edges, wikipediaResults } = get()
        if (!selectedNodeId || selectedIndices.length === 0) return

        const parentNode = nodes.find((n) => n.id === selectedNodeId)
        if (!parentNode) return

        const selectedArticles = selectedIndices
          .map((i) => wikipediaResults[i])
          .filter(Boolean)

        if (selectedArticles.length === 0) return

        const positions = calculateTermNodesPositions(
          parentNode,
          selectedArticles.length
        )

        const newNodes = selectedArticles.map((article, index) =>
          createWikipediaNode(
            article.title,
            article.extract,
            article.pageUrl,
            selectedNodeId,
            positions[index]
          )
        )

        const newEdges = newNodes.map((node) =>
          createEdge(selectedNodeId, node.id)
        )

        const updatedNodes = nodes.map((n) =>
          n.id === selectedNodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  childIds: [...n.data.childIds, ...newNodes.map((node) => node.id)],
                },
              }
            : n
        )

        set({
          nodes: [...updatedNodes, ...newNodes],
          edges: [...edges, ...newEdges],
          isWikipediaModalOpen: false,
          wikipediaResults: [],
        })

        get().addToast(
          `Added ${selectedArticles.length} Wikipedia article${selectedArticles.length > 1 ? 's' : ''}`,
          'success'
        )
      },

      // ========== CHAT ACTIONS ==========

      sendChatMessage: async (message: string) => {
        const { nodes, topic, apiKey, chatMessages } = get()

        if (!apiKey) {
          set({ isApiKeyModalOpen: true })
          get().addToast('Please add your Gemini API key', 'error')
          return
        }

        // Add user message
        const userMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
        }

        set({
          chatMessages: [...chatMessages, userMessage],
          isChatStreaming: true,
        })

        try {
          // Build context from all nodes
          let nodeContents = ''
          nodes.forEach((node) => {
            const text = getNodeText(node)
            if (text) {
              nodeContents += `- ${text}\n`
            }
          })

          const systemPrompt = CHAT_SYSTEM_PROMPT.replace(
            '{topic}',
            topic
          ).replace('{nodeContents}', nodeContents)

          const service = new GeminiService(apiKey)

          // Create assistant message placeholder
          const assistantMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
          }

          set((state) => ({
            chatMessages: [...state.chatMessages, assistantMessage],
          }))

          let fullResponse = ''
          for await (const chunk of service.streamGenerate(
            systemPrompt,
            message
          )) {
            fullResponse += chunk
            set((state) => ({
              chatMessages: state.chatMessages.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: stripMarkdown(fullResponse) }
                  : m
              ),
            }))
          }
        } catch (error) {
          console.error('Chat error:', error)
          get().addToast('Failed to send message', 'error')
        } finally {
          set({ isChatStreaming: false })
        }
      },

      clearChatMessages: () => set({ chatMessages: [] }),

      // ========== REACT FLOW HANDLERS ==========

      onNodesChange: (changes) => {
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes),
        }))
      },

      onEdgesChange: (changes) => {
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges),
        }))
      },

      // ========== PROJECT ACTIONS ==========

      saveProject: () => {
        const { projectId, projectName, topic, nodes, edges } = get()

        const project: ProjectData = {
          id: projectId || crypto.randomUUID(),
          name: projectName,
          topic,
          nodes: nodes.map((n) => n.data),
          edges: edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            sourceHandle: e.sourceHandle || 'bottom',
            targetHandle: e.targetHandle || 'top',
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          viewport: { x: 0, y: 0, zoom: 1 },
        }

        storageService.saveProject(project)
        set({ projectId: project.id })
        get().addToast('Project saved', 'success')
      },

      loadProject: (projectId: string) => {
        const project = storageService.loadProject(projectId)
        if (!project) {
          get().addToast('Project not found', 'error')
          return
        }

        // Convert stored node data back to React Flow nodes
        const nodes: Node<ConceptNodeData>[] = project.nodes.map((data) => ({
          id: data.id,
          type: data.type,
          position: { x: 400, y: 100 }, // Will be recalculated
          data,
        }))

        // Recalculate positions based on hierarchy
        const positionedNodes = recalculatePositions(nodes, project.edges)

        // Convert stored edge data back to React Flow edges
        const edges: Edge<ConceptEdgeData>[] = project.edges.map((data) => ({
          id: data.id,
          source: data.source,
          target: data.target,
          sourceHandle: data.sourceHandle,
          targetHandle: data.targetHandle,
          type: 'bezier',
          data,
        }))

        set({
          projectId: project.id,
          projectName: project.name,
          topic: project.topic,
          nodes: positionedNodes,
          edges,
          selectedNodeId: null,
          isSidebarOpen: false,
          isLoadModalOpen: false,
        })

        get().addToast('Project loaded', 'success')
      },

      newProject: () => {
        set({
          projectId: null,
          projectName: 'Untitled',
          topic: '',
          nodes: [],
          edges: [],
          selectedNodeId: null,
          isSidebarOpen: false,
          chatMessages: [],
        })
      },

      setProjectName: (name: string) => set({ projectName: name }),

      exportJSON: () => {
        const { projectName, topic, nodes, edges } = get()
        const project = {
          name: projectName,
          topic,
          nodes: nodes.map((n) => n.data),
          edges: edges.map((e) => ({
            id: e.id,
            source: e.source,
            target: e.target,
          })),
          exportedAt: new Date().toISOString(),
        }

        const json = JSON.stringify(project, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        get().addToast('Project exported', 'success')
      },

      // ========== DIFFICULTY ==========

      setDifficultyLevel: (level: number) => set({ difficultyLevel: level }),

      // ========== API KEY ==========

      setApiKey: (key: string) => {
        set({ apiKey: key, isApiKeyModalOpen: false })
        get().addToast('API key saved', 'success')
      },

      // ========== TOAST ==========

      addToast: (message: string, type: ToastData['type']) => {
        const toast: ToastData = {
          id: crypto.randomUUID(),
          message,
          type,
        }
        set((state) => ({ toasts: [...state.toasts, toast] }))

        // Auto remove after 5 seconds
        setTimeout(() => {
          get().removeToast(toast.id)
        }, 5000)
      },

      removeToast: (id: string) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      },
    }),
    {
      name: 'concept-map-settings',
      partialize: () => ({}),
    }
  )
)

// ============================================
// HELPER: Recalculate positions from hierarchy
// ============================================

function recalculatePositions(
  nodes: Node<ConceptNodeData>[],
  edges: ConceptEdgeData[]
): Node<ConceptNodeData>[] {
  // Find root node
  const rootNode = nodes.find((n) => n.data.type === NodeType.TOPIC)
  if (!rootNode) return nodes

  const positioned = new Map<string, { x: number; y: number }>()
  positioned.set(rootNode.id, { x: 400, y: 100 })

  // BFS to position children
  const queue = [rootNode.id]
  const VERTICAL_GAP = 150
  const HORIZONTAL_GAP = 300

  while (queue.length > 0) {
    const parentId = queue.shift()!
    const parentPos = positioned.get(parentId)!

    const childEdges = edges.filter((e) => e.source === parentId)
    const childCount = childEdges.length

    childEdges.forEach((edge, index) => {
      const childNode = nodes.find((n) => n.id === edge.target)
      if (!childNode) return

      // Calculate horizontal offset for siblings
      const totalWidth = (childCount - 1) * HORIZONTAL_GAP
      const startX = parentPos.x - totalWidth / 2
      const x = childCount === 1 ? parentPos.x : startX + index * HORIZONTAL_GAP
      const y = parentPos.y + VERTICAL_GAP

      positioned.set(childNode.id, { x, y })
      queue.push(childNode.id)
    })
  }

  // Apply positions
  return nodes.map((node) => ({
    ...node,
    position: positioned.get(node.id) || { x: 400, y: 100 },
  }))
}
