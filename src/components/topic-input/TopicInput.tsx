import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'

const allTopics = [
  // Physics & Cosmology
  'The Nature of Dark Matter',
  'Quantum Entanglement',
  'String Theory',
  'Black Holes and Hawking Radiation',
  'The Arrow of Time',
  'Particle Physics and the Standard Model',
  'Nuclear Fusion',
  'Wave-Particle Duality',
  // Mathematics
  'Gödel\'s Incompleteness Theorems',
  'The Riemann Hypothesis',
  'Fractal Geometry',
  'Game Theory',
  'Chaos Theory',
  'The Mathematics of Infinity',
  'Bayesian Statistics',
  'Topology',
  // Biology & Evolution
  'CRISPR Gene Editing',
  'The Origin of Life',
  'Consciousness and the Brain',
  'Epigenetics',
  'The Microbiome',
  'Convergent Evolution',
  'Extremophiles',
  'Symbiogenesis',
  // Philosophy
  'The Hard Problem of Consciousness',
  'Existentialism',
  'Stoicism',
  'The Ship of Theseus',
  'Free Will vs Determinism',
  'Philosophy of Language',
  'The Trolley Problem and Ethics',
  'Phenomenology',
  // History & Civilization
  'The Fall of the Roman Empire',
  'The Silk Road',
  'The Library of Alexandria',
  'The Ottoman Empire',
  'The Mongol Conquests',
  'Ancient Mesopotamia',
  'The French Revolution',
  'The Byzantine Empire',
  'The Indus Valley Civilization',
  'The Age of Exploration',
  // Psychology & Neuroscience
  'Cognitive Biases',
  'The Psychology of Memory',
  'Neuroplasticity',
  'The Unconscious Mind',
  'Flow States',
  'The Dunning-Kruger Effect',
  'Attachment Theory',
  'Synesthesia',
  // Technology & Computing
  'How the Internet Works',
  'Cryptography',
  'Artificial General Intelligence',
  'Blockchain Technology',
  'Quantum Computing',
  'The History of Computing',
  'Neural Networks',
  'The Halting Problem',
  // Earth & Space
  'Plate Tectonics',
  'The Fermi Paradox',
  'Terraforming Mars',
  'Deep Ocean Ecosystems',
  'The Cambrian Explosion',
  'Supervolcanoes',
  'The Great Oxygenation Event',
  'Asteroid Mining',
  // Art & Culture
  'The Renaissance',
  'Surrealism',
  'The Golden Ratio in Art',
  'Japanese Aesthetics (Wabi-Sabi)',
  'The Bauhaus Movement',
  'Ancient Greek Theatre',
  'The History of Jazz',
  'Abstract Expressionism',
  // Economics & Society
  'Behavioral Economics',
  'The Tragedy of the Commons',
  'Universal Basic Income',
  'The History of Money',
  'Network Effects',
  'The Prisoner\'s Dilemma',
  'Mechanism Design',
  'The Economics of Attention',
  // Language & Communication
  'The Origin of Language',
  'The Sapir-Whorf Hypothesis',
  'How Writing Systems Evolved',
  'Dead Languages',
  'The Science of Persuasion',
  'Constructed Languages',
  // Medicine & Health
  'The Placebo Effect',
  'The History of Vaccines',
  'Psychedelics and Neuroscience',
  'The Human Immune System',
  'Circadian Rhythms',
  'The Gut-Brain Axis',
  // Chemistry & Materials
  'Superconductors',
  'The Chemistry of Cooking',
  'Nanomaterials',
  'Bioluminescence',
  'Rare Earth Elements',
  // Music & Sound
  'The Mathematics of Music',
  'How Sound Works',
  'The History of Electronic Music',
  'Perfect Pitch',
  'Music and the Brain',
  // Ecology & Environment
  'Mycelium Networks',
  'Coral Reef Ecosystems',
  'The Sixth Mass Extinction',
  'Rewilding',
  'Carbon Capture',
]

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function TopicInput() {
  const [topic, setTopic] = useState('')
  const { setTopic: createTopic, apiKey, openApiKeyModal } = useConceptMapStore()
  const [suggestions] = useState(() => pickRandom(allTopics, 6))

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
