import { useState } from 'react'
import { X, Check, Loader2 } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'

interface ExtractedTerm {
  name: string
  description?: string
}

export function ExtractSelectionModal() {
  const {
    isExtractModalOpen,
    isExtractLoading,
    extractedTerms,
    closeExtractModal,
    addSelectedTerms,
  } = useConceptMapStore()

  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())

  // Show loading indicator at bottom
  if (isExtractLoading) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white rounded-full shadow-lg px-5 py-3 flex items-center gap-3 border border-gray-200 animate-slide-up">
          <Loader2 size={16} className="animate-spin text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Extracting terms...</span>
        </div>
      </div>
    )
  }

  if (!isExtractModalOpen) return null

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
    addSelectedTerms(Array.from(selectedIndices))
    setSelectedIndices(new Set())
  }

  const handleClose = () => {
    closeExtractModal()
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
          <h2 className="text-xl font-bold text-gray-900">Select to Add</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="px-6 pb-3 text-sm text-gray-600">
          Select extracted terms to add:
        </p>

        {/* Scrollable term list */}
        <div className="flex-1 overflow-y-auto px-6 space-y-2 pb-4">
          {extractedTerms.map((term: ExtractedTerm, index: number) => {
            const isSelected = selectedIndices.has(index)
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
                      {term.name}
                    </h3>
                    {term.description && (
                      <p className="text-gray-500 text-sm leading-relaxed mt-0.5 truncate">
                        {term.description}
                      </p>
                    )}
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
          })}
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
