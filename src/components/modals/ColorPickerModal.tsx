import { useState } from 'react'
import { Check } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { NODE_COLORS } from '../../config/colors'
import { NodeColor } from '../../types'

export function ColorPickerModal() {
  const {
    isColorPickerOpen,
    closeColorPicker,
    selectedNodeId,
    nodes,
    setNodeColor,
    setColorForSimilarNodes,
  } = useConceptMapStore()

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)
  const currentColor = selectedNode?.data.color || NodeColor.DEFAULT

  const [selectedColor, setSelectedColor] = useState<NodeColor>(currentColor)

  const handleApplyToNode = () => {
    if (selectedNodeId) {
      setNodeColor(selectedNodeId, selectedColor)
      closeColorPicker()
    }
  }

  const handleApplyToSimilar = () => {
    if (selectedNodeId) {
      setColorForSimilarNodes(selectedNodeId, selectedColor)
      closeColorPicker()
    }
  }

  const colorEntries = Object.entries(NODE_COLORS) as [
    NodeColor,
    (typeof NODE_COLORS)[NodeColor]
  ][]

  if (!isColorPickerOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/30 modal-backdrop"
        onClick={closeColorPicker}
      />
      <div className="relative bg-white rounded-t-2xl shadow-xl z-10 w-full max-w-[520px] p-5 pb-6 animate-slide-up">
        {/* Close button */}
        <button
          onClick={closeColorPicker}
          className="absolute top-3 right-4 p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>

        {/* Color grid */}
        <div className="grid grid-cols-6 gap-2.5 mb-5 mt-1">
          {colorEntries.map(([color, config]) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className="relative"
              title={config.name}
            >
              <div
                className="w-full aspect-[4/3] rounded-lg border-[2.5px] transition-all flex items-center justify-center"
                style={{
                  backgroundColor: config.bg,
                  borderColor: selectedColor === color ? '#EC4899' : '#1e3a5f',
                  boxShadow: selectedColor === color ? '0 0 0 2px #EC4899' : 'none',
                }}
              >
                {color === NodeColor.DEFAULT && (
                  <span className="text-xs font-semibold text-gray-700">Default</span>
                )}
                {selectedColor === color && color !== NodeColor.DEFAULT && (
                  <Check size={18} className="text-gray-800" strokeWidth={3} />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleApplyToNode}
            className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#EC4899' }}
          >
            Apply to This Node
          </button>
          <button
            onClick={handleApplyToSimilar}
            className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#EC4899' }}
          >
            Apply to Every Similar Node
          </button>
        </div>
      </div>
    </div>
  )
}
