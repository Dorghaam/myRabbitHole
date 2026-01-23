import { useState, useRef, useEffect } from 'react'
import { X, MessageSquare, Sparkles, Undo, Redo, ChevronDown, Globe } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { PROMPT_CONFIG } from '../../config/prompts'
import { PromptType } from '../../types'
import { getNodeLabel } from '../../utils/nodeUtils'

const DIFFICULTY_LABELS = ['ELI5', 'Middle School', 'High School', 'Undergrad', 'Expert']

export function PromptSidebar() {
  const {
    selectedNodeId,
    compareNodeId,
    nodes,
    selectNode,
    generateResponse,
    openChatModal,
    setCustomPromptText,
    difficultyLevel,
    setDifficultyLevel,
    searchWikipedia,
    undo,
    redo,
  } = useConceptMapStore()

  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false)
  const difficultyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (difficultyRef.current && !difficultyRef.current.contains(e.target as Node)) {
        setShowDifficultyDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  if (!selectedNode) return null

  const nodeLabel = getNodeLabel(selectedNode)
  const truncatedLabel =
    nodeLabel.length > 25 ? nodeLabel.slice(0, 25) + '...' : nodeLabel

  const compareNode = compareNodeId ? nodes.find((n) => n.id === compareNodeId) : null
  const compareLabel = compareNode ? getNodeLabel(compareNode) : null
  const truncatedCompareLabel = compareLabel
    ? (compareLabel.length > 20 ? compareLabel.slice(0, 20) + '...' : compareLabel)
    : null

  const handlePromptClick = (type: PromptType) => {
    if (type === PromptType.CUSTOM) {
      setShowCustomInput(true)
    } else {
      generateResponse(type)
    }
  }

  const handleCustomSubmit = () => {
    if (!customPrompt.trim()) return
    setCustomPromptText(customPrompt)
    generateResponse(PromptType.CUSTOM, customPrompt)
    setShowCustomInput(false)
    setCustomPrompt('')
  }

  const handleClose = () => {
    selectNode(null)
  }

  // All prompts in display order (excluding CUSTOM)
  const promptButtons = PROMPT_CONFIG.filter((p) => p.type !== PromptType.CUSTOM)

  // 3D Pill button style - compact with dark navy shadow
  const pillButtonStyle = `
    px-2.5 py-1.5 text-xs font-medium rounded-full
    bg-white border-2 border-gray-800
    shadow-[0_3px_0_0_#1e3a5f]
    hover:shadow-[0_2px_0_0_#1e3a5f] hover:translate-y-[1px]
    active:shadow-none active:translate-y-[3px]
    transition-all duration-100
    text-gray-700
  `

  return (
    <aside className="w-[250px] flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-transparent">
        <span className="text-sm font-medium text-gray-600">
          "{truncatedLabel}"
        </span>
        <button
          onClick={handleClose}
          className="p-1 rounded hover:bg-gray-200 text-gray-500"
        >
          <X size={16} />
        </button>
      </div>

      {/* Compare indicator */}
      {truncatedCompareLabel && (
        <div className="px-3 pb-1">
          <span className="text-xs text-purple-600 font-medium">
            + "{truncatedCompareLabel}"
          </span>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 py-1 bg-transparent">
        {showCustomInput ? (
          <div className="space-y-1.5">
            <p className="text-xs text-gray-600">
              Ask about "{truncatedLabel}":
            </p>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your question..."
              className="w-full px-2.5 py-1.5 border-2 border-gray-800 rounded-xl text-xs focus:outline-none focus:border-pink-500 resize-none bg-white"
              rows={3}
              autoFocus
            />
            <div className="flex gap-1.5">
              <button
                onClick={() => setShowCustomInput(false)}
                className={`flex-1 ${pillButtonStyle}`}
              >
                Cancel
              </button>
              <button
                onClick={handleCustomSubmit}
                disabled={!customPrompt.trim()}
                className="flex-1 px-2.5 py-1.5 text-xs font-medium rounded-full bg-pink-500 text-white border-2 border-pink-600 shadow-[0_3px_0_0_#9d174d] hover:shadow-[0_2px_0_0_#9d174d] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 disabled:opacity-50"
              >
                Generate
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {/* Difficulty dropdown */}
            <div className="relative" ref={difficultyRef}>
              <button
                onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
                className={`${pillButtonStyle} w-full flex items-center justify-between`}
              >
                <span>{DIFFICULTY_LABELS[difficultyLevel]}</span>
                <ChevronDown size={14} className={`transition-transform ${showDifficultyDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showDifficultyDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white border-2 border-gray-800 rounded-xl overflow-hidden shadow-[0_3px_0_0_#1e3a5f]">
                  {DIFFICULTY_LABELS.map((label, index) => (
                    <button
                      key={label}
                      onClick={() => {
                        setDifficultyLevel(index)
                        setShowDifficultyDropdown(false)
                      }}
                      className={`w-full px-3 py-1.5 text-xs font-medium text-left hover:bg-gray-100 transition-colors ${
                        index === difficultyLevel ? 'text-pink-600 bg-pink-50' : 'text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Prompt buttons grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {promptButtons.map((config) => (
                <button
                  key={config.type}
                  onClick={() => handlePromptClick(config.type)}
                  className={pillButtonStyle}
                  title={config.description}
                >
                  {config.label}
                </button>
              ))}
            </div>

            {/* Custom Prompt - full width */}
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full px-2.5 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border-2 border-gray-800 shadow-[0_3px_0_0_#1e3a5f] hover:shadow-[0_2px_0_0_#1e3a5f] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 flex items-center justify-center gap-1.5"
            >
              <Sparkles size={12} />
              Custom Prompt
            </button>

            {/* Wikipedia button - enabled only for Term and Topic nodes */}
            <button
              onClick={() => searchWikipedia()}
              disabled={selectedNode.data.type !== 'term' && selectedNode.data.type !== 'topic'}
              className={`w-full px-2.5 py-1.5 text-xs font-medium rounded-full border-2 flex items-center justify-center gap-1.5 transition-all duration-100 ${
                selectedNode.data.type === 'term' || selectedNode.data.type === 'topic'
                  ? 'bg-gray-100 text-gray-600 border-gray-800 shadow-[0_3px_0_0_#1e3a5f] hover:shadow-[0_2px_0_0_#1e3a5f] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px]'
                  : 'bg-gray-50 text-gray-300 border-gray-300 cursor-not-allowed'
              }`}
            >
              <Globe size={12} />
              Wikipedia
            </button>

            {/* Undo / Redo row */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => undo()}
                className={`${pillButtonStyle} flex items-center justify-center gap-1`}
              >
                <Undo size={12} />
                Undo
              </button>
              <button
                onClick={() => redo()}
                className={`${pillButtonStyle} flex items-center justify-center gap-1`}
              >
                <Redo size={12} />
                Redo
              </button>
            </div>

            {/* Chat button (blue) */}
            <button
              onClick={openChatModal}
              className="w-full px-2.5 py-2 bg-blue-500 text-white rounded-full font-medium border-2 border-blue-600 shadow-[0_3px_0_0_#1e40af] hover:shadow-[0_2px_0_0_#1e40af] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 flex items-center justify-center gap-2 text-xs"
            >
              <MessageSquare size={14} />
              Chat with Concept Map
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
