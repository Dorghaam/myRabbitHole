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

  // 3D Pill button style - compact with dark navy shadow
  const pillButtonStyle = `
    px-3 py-2 text-sm font-medium rounded-full
    bg-white border-2 border-gray-800
    shadow-[0_3px_0_0_#1e3a5f]
    hover:shadow-[0_2px_0_0_#1e3a5f] hover:translate-y-[1px]
    active:shadow-none active:translate-y-[3px]
    transition-all duration-100
    text-gray-700
  `

  return (
    <aside className="w-[280px] flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-transparent">
        <span className="text-sm font-medium text-gray-600">
          "{truncatedLabel}"
        </span>
        <button
          onClick={handleClose}
          className="p-1 rounded hover:bg-gray-200 text-gray-500"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 py-2 bg-transparent">
        {showCustomInput ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Ask about "{truncatedLabel}":
            </p>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your question..."
              className="w-full px-3 py-2 border-2 border-gray-800 rounded-xl text-sm focus:outline-none focus:border-pink-500 resize-none bg-white"
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
                className="flex-1 px-3 py-2 text-sm font-medium rounded-full bg-pink-500 text-white border-2 border-pink-600 shadow-[0_3px_0_0_#9d174d] hover:shadow-[0_2px_0_0_#9d174d] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 disabled:opacity-50"
              >
                Generate
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Add New button - pink */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePromptClick(PromptType.WHAT)}
                className="px-3 py-2 text-sm font-medium rounded-full bg-pink-500 text-white border-2 border-pink-600 shadow-[0_3px_0_0_#9d174d] hover:shadow-[0_2px_0_0_#9d174d] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100"
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

            {/* Custom Prompt - full width */}
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full px-3 py-2 text-sm font-medium rounded-full bg-gray-100 text-gray-600 border-2 border-gray-800 shadow-[0_3px_0_0_#1e3a5f] hover:shadow-[0_2px_0_0_#1e3a5f] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              Custom Prompt
            </button>

            {/* Undo / Redo row */}
            <div className="grid grid-cols-2 gap-2">
              <button className={`${pillButtonStyle} flex items-center justify-center gap-1.5`}>
                <Undo size={14} />
                Undo
              </button>
              <button className={`${pillButtonStyle} flex items-center justify-center gap-1.5`}>
                <Redo size={14} />
                Redo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Chat button (blue) */}
      <div className="px-3 py-2 bg-transparent">
        <button
          onClick={openChatModal}
          className="w-full px-3 py-2.5 bg-blue-500 text-white rounded-full font-medium border-2 border-blue-600 shadow-[0_3px_0_0_#1e40af] hover:shadow-[0_2px_0_0_#1e40af] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 flex items-center justify-center gap-2 text-sm"
        >
          <MessageSquare size={16} />
          Chat with Concept Map
        </button>
      </div>
    </aside>
  )
}
