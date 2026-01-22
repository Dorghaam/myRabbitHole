import { useState } from 'react'
import { X, MessageSquare, Sparkles } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { PROMPT_CONFIG } from '../../config/prompts'
import { PromptType } from '../../types'
import { getNodeLabel } from '../../utils/nodeUtils'
import { PromptButton } from './PromptButton'
import { Button } from '../common/Button'

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
    nodeLabel.length > 30 ? nodeLabel.slice(0, 30) + '...' : nodeLabel

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

  // Group prompts by category
  const basicPrompts = PROMPT_CONFIG.filter((p) =>
    [PromptType.WHAT, PromptType.HOW, PromptType.WHO, PromptType.ORIGIN].includes(
      p.type
    )
  )
  const analysisPrompts = PROMPT_CONFIG.filter((p) =>
    [
      PromptType.ELABORATE,
      PromptType.PROS,
      PromptType.CONS,
      PromptType.EXAMPLE,
      PromptType.RESEARCH,
    ].includes(p.type)
  )
  const extractionPrompts = PROMPT_CONFIG.filter((p) =>
    [PromptType.EXTRACT, PromptType.CONCEPTS].includes(p.type)
  )
  const comparativePrompts = PROMPT_CONFIG.filter((p) =>
    [PromptType.COMPARE, PromptType.ANALOGY].includes(p.type)
  )
  const criticalPrompts = PROMPT_CONFIG.filter((p) =>
    [
      PromptType.CONTROVERSY,
      PromptType.IMPLICATIONS,
      PromptType.SIGNIFICANCE,
      PromptType.INTERESTING,
    ].includes(p.type)
  )
  const otherPrompts = PROMPT_CONFIG.filter((p) =>
    [
      PromptType.EXPLAIN,
      PromptType.QUESTIONS,
      PromptType.SPLIT,
      PromptType.JOIN,
    ].includes(p.type)
  )

  return (
    <aside className="w-[280px] bg-white border-l border-divider flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-divider">
        <span className="text-sm font-medium text-text-secondary">
          Explore
        </span>
        <button
          onClick={handleClose}
          className="p-1 rounded hover:bg-gray-100 text-text-muted"
        >
          <X size={18} />
        </button>
      </div>

      {/* Selected node info */}
      <div className="px-4 py-3 border-b border-divider bg-gray-50">
        <p className="text-xs text-text-muted mb-1">Selected:</p>
        <p className="text-sm font-medium text-text-primary truncate">
          "{truncatedLabel}"
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {showCustomInput ? (
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">
              Ask about "{truncatedLabel}":
            </p>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your question..."
              className="w-full px-3 py-2 border border-node-border rounded-lg text-sm focus:outline-none focus:border-primary-pink resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomInput(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCustomSubmit}
                disabled={!customPrompt.trim()}
                className="flex-1"
              >
                Generate
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Basic Understanding */}
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">
                Basic
              </p>
              <div className="grid grid-cols-2 gap-2">
                {basicPrompts.map((config) => (
                  <PromptButton
                    key={config.type}
                    config={config}
                    onClick={() => handlePromptClick(config.type)}
                  />
                ))}
              </div>
            </div>

            {/* Analysis */}
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">
                Analysis
              </p>
              <div className="grid grid-cols-2 gap-2">
                {analysisPrompts.map((config) => (
                  <PromptButton
                    key={config.type}
                    config={config}
                    onClick={() => handlePromptClick(config.type)}
                  />
                ))}
              </div>
            </div>

            {/* Extraction */}
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">
                Extract
              </p>
              <div className="grid grid-cols-2 gap-2">
                {extractionPrompts.map((config) => (
                  <PromptButton
                    key={config.type}
                    config={config}
                    onClick={() => handlePromptClick(config.type)}
                  />
                ))}
              </div>
            </div>

            {/* Comparative */}
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">
                Compare
              </p>
              <div className="grid grid-cols-2 gap-2">
                {comparativePrompts.map((config) => (
                  <PromptButton
                    key={config.type}
                    config={config}
                    onClick={() => handlePromptClick(config.type)}
                  />
                ))}
              </div>
            </div>

            {/* Critical Thinking */}
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">
                Critical
              </p>
              <div className="grid grid-cols-2 gap-2">
                {criticalPrompts.map((config) => (
                  <PromptButton
                    key={config.type}
                    config={config}
                    onClick={() => handlePromptClick(config.type)}
                  />
                ))}
              </div>
            </div>

            {/* Other */}
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">
                Other
              </p>
              <div className="grid grid-cols-2 gap-2">
                {otherPrompts.map((config) => (
                  <PromptButton
                    key={config.type}
                    config={config}
                    onClick={() => handlePromptClick(config.type)}
                  />
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full px-3 py-2.5 text-sm font-medium rounded-lg border border-dashed border-node-border text-text-secondary hover:border-primary-pink hover:text-primary-pink transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              Custom Prompt
            </button>
          </div>
        )}
      </div>

      {/* Footer - Chat button */}
      <div className="px-4 py-3 border-t border-divider">
        <button
          onClick={openChatModal}
          className="w-full px-4 py-2.5 bg-primary-pink text-white rounded-lg font-medium hover:bg-primary-pink-hover transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare size={18} />
          Chat with Map
        </button>
      </div>
    </aside>
  )
}
