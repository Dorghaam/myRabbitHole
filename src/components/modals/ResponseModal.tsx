import { X } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { getPromptConfig } from '../../config/prompts'

export function ResponseModal() {
  const {
    isResponseModalOpen,
    closeResponseModal,
    currentPromptType,
    currentResponse,
    isStreaming,
    addNodeFromResponse,
    isReaderOpen,
    readerTitle,
    readerContent,
    closeReader,
  } = useConceptMapStore()

  const config = currentPromptType ? getPromptConfig(currentPromptType) : null

  // Determine which mode we're in
  const isOpen = isResponseModalOpen || isReaderOpen
  const title = isReaderOpen ? readerTitle : (config?.label || 'Response')
  const content = isReaderOpen ? readerContent : currentResponse
  const showAddButton = isResponseModalOpen && !isReaderOpen

  const handleClose = () => {
    if (isReaderOpen) {
      closeReader()
    } else {
      closeResponseModal()
    }
  }

  const handleAddToMap = () => {
    addNodeFromResponse()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 modal-backdrop"
        onClick={handleClose}
      />

      {/* Bottom sheet */}
      <div className="relative bg-white rounded-t-2xl shadow-xl z-10 w-full max-w-[650px] max-h-[60vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {content ? (
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
              {content}
              {isStreaming && (
                <span className="streaming-cursor text-pink-500">|</span>
              )}
            </p>
          ) : isStreaming ? (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
              <span>Generating response...</span>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {showAddButton && (
          <div className="px-6 py-3 border-t border-gray-100">
            <button
              onClick={handleAddToMap}
              disabled={isStreaming || !currentResponse}
              className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Concept Map
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
