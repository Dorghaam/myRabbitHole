import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'

export function TopicInput() {
  const [topic, setTopic] = useState('')
  const { setTopic: createTopic, apiKey, openApiKeyModal } = useConceptMapStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    if (!apiKey) {
      openApiKeyModal()
      return
    }

    createTopic(topic.trim())
  }

  const suggestions = [
    'Roman Empire',
    'Quantum Computing',
    'Climate Change',
    'Renaissance Art',
    'Machine Learning',
    'Ancient Egypt',
  ]

  const handleSuggestionClick = (suggestion: string) => {
    if (!apiKey) {
      openApiKeyModal()
      return
    }
    createTopic(suggestion)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-xl w-full">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="text-primary-pink" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Explore Any Topic
          </h1>
          <p className="text-text-secondary">
            Enter a topic to create an interactive concept map powered by AI
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              size={20}
            />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic to explore..."
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-node-border rounded-xl focus:outline-none focus:border-primary-pink transition-colors"
              autoFocus
            />
            <button
              type="submit"
              disabled={!topic.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-pink text-white rounded-lg font-medium hover:bg-primary-pink-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Explore
            </button>
          </div>
        </form>

        {/* Suggestions */}
        <div className="text-center">
          <p className="text-sm text-text-muted mb-3">Try exploring:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-sm bg-white border border-node-border rounded-full hover:border-primary-pink hover:text-primary-pink transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* API key hint */}
        {!apiKey && (
          <p className="text-center text-sm text-text-muted mt-8">
            You'll need to add your{' '}
            <button
              onClick={openApiKeyModal}
              className="text-primary-pink hover:underline"
            >
              Gemini API key
            </button>{' '}
            to get started
          </p>
        )}
      </div>
    </div>
  )
}
