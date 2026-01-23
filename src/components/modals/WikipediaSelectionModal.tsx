import { useState } from 'react'
import { X, Check, Loader2 } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'

export function WikipediaSelectionModal() {
  const {
    isWikipediaModalOpen,
    isWikipediaLoading,
    wikipediaResults,
    closeWikipediaModal,
    addSelectedWikipediaArticles,
  } = useConceptMapStore()

  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())

  // Show loading indicator at bottom
  if (isWikipediaLoading) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white rounded-full shadow-lg px-5 py-3 flex items-center gap-3 border border-gray-200 animate-slide-up">
          <Loader2 size={16} className="animate-spin text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Searching Wikipedia...</span>
        </div>
      </div>
    )
  }

  if (!isWikipediaModalOpen) return null

  const handleToggle = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleAdd = () => {
    addSelectedWikipediaArticles(Array.from(selectedIndices))
    setSelectedIndices(new Set())
  }

  const handleClose = () => {
    closeWikipediaModal()
    setSelectedIndices(new Set())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 modal-backdrop"
        onClick={handleClose}
      />

      {/* Bottom sheet */}
      <div className="relative bg-white rounded-t-2xl shadow-xl z-10 w-full max-w-[600px] max-h-[70vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm6.918 6h-3.215a14.5 14.5 0 0 0-1.286-3.682A8.026 8.026 0 0 1 18.918 8zM12 4.04c.727 1.058 1.3 2.222 1.685 3.46h-3.37C10.7 6.262 11.273 5.098 12 4.04zM4.26 14a7.9 7.9 0 0 1 0-4h3.562a15.2 15.2 0 0 0-.122 2c0 .682.045 1.35.122 2H4.26zm.822 2h3.215a14.5 14.5 0 0 0 1.286 3.682A8.026 8.026 0 0 1 5.082 16zM8.297 8H5.082a8.026 8.026 0 0 1 4.335-3.682A14.5 14.5 0 0 0 8.297 8zM12 19.96c-.727-1.058-1.3-2.222-1.685-3.46h3.37c-.385 1.238-.958 2.402-1.685 3.46zM14.34 14H9.66a13.2 13.2 0 0 1-.14-2c0-.685.05-1.355.14-2h4.68c.09.645.14 1.315.14 2s-.05 1.355-.14 2zm.243 5.682A14.5 14.5 0 0 0 15.868 16h3.215a8.026 8.026 0 0 1-4.5 3.682zM16.178 14a15.2 15.2 0 0 0 .122-2 15.2 15.2 0 0 0-.122-2h3.562a7.9 7.9 0 0 1 0 4h-3.562z"
                fill="#636363"
              />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">Wikipedia Articles</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="px-6 pb-3 text-sm text-gray-600">
          Select articles to add to your concept map:
        </p>

        {/* Scrollable article list */}
        <div className="flex-1 overflow-y-auto px-6 space-y-2 pb-4">
          {wikipediaResults.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No Wikipedia articles found.</p>
          ) : (
            wikipediaResults.map((article, index) => {
              const isSelected = selectedIndices.has(index)
              const truncatedExtract = article.extract.length > 120
                ? article.extract.slice(0, 120) + '...'
                : article.extract
              return (
                <button
                  key={index}
                  onClick={() => handleToggle(index)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-150 ${
                    isSelected
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base">
                        {article.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mt-0.5">
                        {truncatedExtract}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-gray-900 border-gray-900'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-3 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={selectedIndices.size === 0}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add ({selectedIndices.size})
          </button>
        </div>
      </div>
    </div>
  )
}
