import { useState } from 'react'
import { Key, ExternalLink } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'

export function ApiKeyModal() {
  const { isApiKeyModalOpen, closeApiKeyModal, apiKey, setApiKey } =
    useConceptMapStore()

  const [inputKey, setInputKey] = useState(apiKey || '')
  const [showKey, setShowKey] = useState(false)

  const handleSave = () => {
    if (inputKey.trim()) {
      setApiKey(inputKey.trim())
    }
  }

  const handleClear = () => {
    setInputKey('')
    setApiKey('')
  }

  return (
    <Modal
      isOpen={isApiKeyModalOpen}
      onClose={closeApiKeyModal}
      title="Gemini API Key"
      size="md"
    >
      <div className="p-6">
        {/* Info */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mb-6">
          <Key className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-blue-800">
              You need a Gemini API key to use this application. Your key is
              stored locally in your browser.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2"
            >
              Get your free API key
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="w-full px-4 py-3 border border-node-border rounded-lg focus:outline-none focus:border-primary-pink pr-20"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted hover:text-text-primary"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {apiKey && (
            <Button variant="danger" onClick={handleClear}>
              Clear
            </Button>
          )}
          <Button
            variant="secondary"
            className="flex-1"
            onClick={closeApiKeyModal}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleSave}
            disabled={!inputKey.trim()}
          >
            Save Key
          </Button>
        </div>
      </div>
    </Modal>
  )
}
