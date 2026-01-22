import { useState } from 'react'
import { X, MessageSquare, Sparkles, Undo, Redo } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { PROMPT_CONFIG } from '../../config/prompts'
import { PromptType } from '../../types'
import { getNodeLabel } from '../../utils/nodeUtils'

export function PromptSidebar() {
  const {
    selectedNodeId,
    nodes,
    selectNode,
    generateResponse,
    openChatModal,
    setCustomPromptText,
  } = useConceptMapStore()

  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  if (!selectedNode) return null

  const nodeLabel = getNodeLabel(selectedNode)
  const truncatedLabel =
    nodeLabel.length > 25 ? nodeLabel.slice(0, 25) + '...' : nodeLabel

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

  // 3D Pill button style
  const pillButtonStyle = `
    px-4 py-2.5 text-sm font-medium rounded-full
    bg-white border-2 border-gray-300
    shadow-[0_3px_0_0_#d1d5db]
    hover:shadow-[0_2px_0_0_#d1d5db] hover:translate-y-[1px]
    active:shadow-none active:translate-y-[3px]
    transition-all duration-100
    text-gray-700
  `

  return (
    <aside className="w-[300px] bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-600">
          "{truncatedLabel}"
        </span>
        <button
          onClick={handleClose}
          className="p-1 rounded hover:bg-gray-100 text-gray-400"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {showCustomInput ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Ask about "{truncatedLabel}":
            </p>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your question..."
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:border-pink-500 resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCustomInput(false)}
                className={`flex-1 ${pillButtonStyle}`}
              >
                Cancel
              </button>
              <button
                onClick={handleCustomSubmit}
                disabled={!customPrompt.trim()}
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-full bg-pink-500 text-white border-2 border-pink-500 shadow-[0_3px_0_0_#be185d] hover:shadow-[0_2px_0_0_#be185d] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 disabled:opacity-50"
              >
                Generate
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Add New button - pink */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePromptClick(PromptType.WHAT)}
                className="px-4 py-2.5 text-sm font-medium rounded-full bg-pink-500 text-white border-2 border-pink-500 shadow-[0_3px_0_0_#be185d] hover:shadow-[0_2px_0_0_#be185d] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100"
              >
                Add New
              </button>
              <button
                onClick={() => handlePromptClick(PromptType.WHAT)}
                className={pillButtonStyle}
              >
                What
              </button>
            </div>

            {/* Prompt buttons grid */}
            <div className="grid grid-cols-2 gap-2">
              {promptButtons.slice(1).map((config) => (
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

            {/* Custom Prompt - gray background, full width */}
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full px-4 py-2.5 text-sm font-medium rounded-full bg-gray-100 text-gray-600 border-2 border-gray-300 shadow-[0_3px_0_0_#d1d5db] hover:shadow-[0_2px_0_0_#d1d5db] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              Custom Prompt
            </button>

            {/* Undo / Redo row */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button className={`${pillButtonStyle} flex items-center justify-center gap-2`}>
                <Undo size={16} />
                Undo
              </button>
              <button className={`${pillButtonStyle} flex items-center justify-center gap-2`}>
                <Redo size={16} />
                Redo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Chat button (blue) */}
      <div className="px-4 py-3 border-t border-gray-200">
        <button
          onClick={openChatModal}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl font-medium border-2 border-blue-500 shadow-[0_3px_0_0_#1d4ed8] hover:shadow-[0_2px_0_0_#1d4ed8] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 flex items-center justify-center gap-2"
        >
          <MessageSquare size={18} />
          Chat with Concept Map
        </button>
      </div>
    </aside>
  )
}
