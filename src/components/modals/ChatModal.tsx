import { useState, useRef, useEffect } from 'react'
import { Send, MessageSquare, Trash2 } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { Modal } from '../common/Modal'

export function ChatModal() {
  const {
    isChatModalOpen,
    closeChatModal,
    chatMessages,
    isChatStreaming,
    sendChatMessage,
    clearChatMessages,
    topic,
  } = useConceptMapStore()

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isChatStreaming) return

    sendChatMessage(input.trim())
    setInput('')
  }

  const handleClear = () => {
    if (confirm('Clear all chat messages?')) {
      clearChatMessages()
    }
  }

  return (
    <Modal
      isOpen={isChatModalOpen}
      onClose={closeChatModal}
      size="lg"
      showCloseButton={false}
    >
      <div className="flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-primary-pink" size={20} />
            <h2 className="text-lg font-bold text-text-primary">
              Chat with Concept Map
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {chatMessages.length > 0 && (
              <button
                onClick={handleClear}
                className="p-2 text-text-muted hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Clear chat"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              onClick={closeChatModal}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <MessageSquare
                  className="mx-auto text-text-muted mb-4"
                  size={48}
                />
                <p className="text-text-secondary font-medium">
                  Ask questions about your concept map
                </p>
                <p className="text-sm text-text-muted mt-1">
                  The AI has context of all nodes in "{topic}"
                </p>
              </div>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary-pink text-white rounded-br-sm'
                      : 'bg-gray-100 text-text-primary rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                    {message.role === 'assistant' &&
                      isChatStreaming &&
                      message.id ===
                        chatMessages[chatMessages.length - 1]?.id && (
                        <span className="streaming-cursor">|</span>
                      )}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-divider bg-gray-50"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your concept map..."
              className="flex-1 px-4 py-3 border border-node-border rounded-xl focus:outline-none focus:border-primary-pink"
              disabled={isChatStreaming}
            />
            <button
              type="submit"
              disabled={!input.trim() || isChatStreaming}
              className="px-4 py-3 bg-primary-pink text-white rounded-xl hover:bg-primary-pink-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
