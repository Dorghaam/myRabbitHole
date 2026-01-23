import { useState, useEffect } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { GeminiService } from '../../services/geminiService'

const SUGGESTIONS_PROMPT = `You are a curator of deep, fascinating knowledge. Generate exactly 6 topic suggestions for someone who wants to genuinely understand the world at a deeper level.

Rules:
- Each topic should be something a curious, wise person would find genuinely valuable to explore deeply
- Span across different realms: science, philosophy, history, psychology, mathematics, art, economics, biology, physics, technology, linguistics, anthropology, etc.
- Avoid surface-level pop-science. Go for topics that reveal deep truths, hidden connections, or fundamentally change how you see the world
- Topics should be specific enough to be interesting but broad enough to rabbit-hole into
- Mix timeless wisdom with cutting-edge ideas
- Each should be 2-5 words, concise but evocative
- Never repeat the same set twice — be creative and varied every time

Return ONLY a JSON array of 6 strings, nothing else. Example format:
["Topic One", "Topic Two", "Topic Three", "Topic Four", "Topic Five", "Topic Six"]`

const FALLBACK_SUGGESTIONS = [
  'The Nature of Consciousness',
  'Gödel\'s Incompleteness Theorems',
  'The Fermi Paradox',
  'Emergence and Complexity',
  'The Silk Road',
  'Bayesian Reasoning',
]

export function TopicInput() {
  const [topic, setTopic] = useState('')
  const { setTopic: createTopic, apiKey, openApiKeyModal } = useConceptMapStore()
  const [suggestions, setSuggestions] = useState<string[]>(FALLBACK_SUGGESTIONS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!apiKey) return

    let cancelled = false
    setLoading(true)

    const fetchSuggestions = async () => {
      try {
        const service = new GeminiService(apiKey)
        const response = await service.generate(
          SUGGESTIONS_PROMPT,
          'Generate 6 fascinating topics for deep exploration.'
        )

        if (cancelled) return

        const jsonMatch = response.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSuggestions(parsed.slice(0, 6))
          }
        }
      } catch (err) {
        console.error('Failed to fetch topic suggestions:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSuggestions()
    return () => { cancelled = true }
  }, [apiKey])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    if (!apiKey) {
      openApiKeyModal()
      return
    }

    createTopic(topic.trim())
  }

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
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 h-8 w-32 bg-gray-100 border border-node-border rounded-full animate-pulse"
                />
              ))
            ) : (
              suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-sm bg-white border border-node-border rounded-full hover:border-primary-pink hover:text-primary-pink transition-colors"
                >
                  {suggestion}
                </button>
              ))
            )}
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
