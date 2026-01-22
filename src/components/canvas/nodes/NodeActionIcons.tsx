import { memo } from 'react'
import { Settings, Trash2, RefreshCw } from 'lucide-react'
import { useConceptMapStore } from '../../../store/conceptMapStore'

interface NodeActionIconsProps {
  nodeId: string
  showRegenerate?: boolean
  onColorClick?: () => void
}

export const NodeActionIcons = memo(function NodeActionIcons({
  nodeId,
  showRegenerate = false,
  onColorClick,
}: NodeActionIconsProps) {
  const { deleteNode, regenerateNode, openColorPicker, selectNode } =
    useConceptMapStore()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNode(nodeId)
  }

  const handleRegenerate = (e: React.MouseEvent) => {
    e.stopPropagation()
    regenerateNode(nodeId)
  }

  const handleColorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectNode(nodeId)
    if (onColorClick) {
      onColorClick()
    } else {
      openColorPicker()
    }
  }

  return (
    <div className="flex items-center gap-1">
      {showRegenerate && (
        <button
          onClick={handleRegenerate}
          className="p-1 rounded hover:bg-gray-100 text-text-muted hover:text-text-primary transition-colors"
          title="Regenerate"
        >
          <RefreshCw size={14} />
        </button>
      )}
      <button
        onClick={handleColorClick}
        className="p-1 rounded hover:bg-gray-100 text-text-muted hover:text-text-primary transition-colors"
        title="Change color"
      >
        <Settings size={14} />
      </button>
      <button
        onClick={handleDelete}
        className="p-1 rounded hover:bg-gray-100 text-text-muted hover:text-red-500 transition-colors"
        title="Delete"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
})
