import { useState } from 'react'
import { Check } from 'lucide-react'
import { useConceptMapStore } from '../../store/conceptMapStore'
import { NODE_COLORS } from '../../config/colors'
import { NodeColor } from '../../types'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'

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

  return (
    <Modal
      isOpen={isColorPickerOpen}
      onClose={closeColorPicker}
      title="Choose Color"
      size="sm"
    >
      <div className="p-6">
        {/* Color grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {colorEntries.map(([color, config]) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className="relative group"
              title={config.name}
            >
              <div
                className="w-14 h-14 rounded-lg border-2 transition-all"
                style={{
                  backgroundColor: config.bg,
                  borderColor:
                    selectedColor === color ? config.accent : config.border,
                }}
              >
                {selectedColor === color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check
                      size={20}
                      style={{ color: config.accent }}
                      strokeWidth={3}
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-text-muted text-center mt-1">
                {config.name}
              </p>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleApplyToNode}
          >
            This Node
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleApplyToSimilar}
          >
            Similar Nodes
          </Button>
        </div>
      </div>
    </Modal>
  )
}
