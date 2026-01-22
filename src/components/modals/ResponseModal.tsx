import { useConceptMapStore } from '../../store/conceptMapStore'
import { getPromptConfig } from '../../config/prompts'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'

export function ResponseModal() {
  const {
    isResponseModalOpen,
    closeResponseModal,
    currentPromptType,
    currentResponse,
    isStreaming,
    addNodeFromResponse,
  } = useConceptMapStore()

  const config = currentPromptType ? getPromptConfig(currentPromptType) : null

  const handleAddToMap = () => {
    addNodeFromResponse()
  }

  return (
    <Modal
      isOpen={isResponseModalOpen}
      onClose={closeResponseModal}
      title={config?.label || 'Response'}
      size="lg"
    >
      <div className="p-6">
        {/* Response content */}
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto mb-6">
          {currentResponse ? (
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {currentResponse}
              {isStreaming && (
                <span className="streaming-cursor text-primary-pink">|</span>
              )}
            </p>
          ) : isStreaming ? (
            <div className="flex items-center gap-2 text-text-muted">
              <div className="w-2 h-2 bg-primary-pink rounded-full animate-pulse" />
              <span>Generating response...</span>
            </div>
          ) : null}
        </div>

        {/* Add to map button */}
        <Button
          variant="primary"
          className="w-full py-3"
          onClick={handleAddToMap}
          disabled={isStreaming || !currentResponse}
        >
          Add to Concept Map
        </Button>
      </div>
    </Modal>
  )
}
