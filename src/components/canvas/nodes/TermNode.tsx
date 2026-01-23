import { memo, useState, useRef, useEffect } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { MoreVertical, Settings, Trash2 } from 'lucide-react'
import { TermNodeData, PromptType } from '../../../types'
import { useConceptMapStore } from '../../../store/conceptMapStore'
import { getNodeColors } from '../../../config/colors'

const BADGE_CONFIG: Record<string, { label: string; color: string }> = {
  [PromptType.EXTRACT]: { label: 'TERMS', color: '#EC4899' },
  [PromptType.CONCEPTS]: { label: 'CONCEPTS', color: '#8B5CF6' },
  [PromptType.QUESTIONS]: { label: 'QUESTIONS', color: '#F59E0B' },
  [PromptType.FIGURES]: { label: 'KEY FIGURES', color: '#10B981' },
  [PromptType.SPLIT]: { label: 'COMPONENTS', color: '#6366F1' },
}

function getBadge(promptType: PromptType | null) {
  if (promptType && BADGE_CONFIG[promptType]) {
    return BADGE_CONFIG[promptType]
  }
  return { label: 'TERMS', color: '#EC4899' }
}

type TermNodeProps = NodeProps & {
  data: TermNodeData
}

export const TermNode = memo(function TermNode({
  data,
  selected,
}: TermNodeProps) {
  const { selectNode, openColorPicker, deleteNode } = useConceptMapStore()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  const handleClick = (e: React.MouseEvent) => {
    selectNode(data.id, e.shiftKey)
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectNode(data.id)
    openColorPicker()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)
    deleteNode(data.id)
  }

  const colors = getNodeColors(data.color)

  return (
    <div onClick={handleClick} className="relative" style={{ width: 240 }}>
      {/* Single unified card */}
      <div
        className="flex items-stretch rounded-2xl transition-all duration-150"
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${selected ? '#EC4899' : colors.border}`,
          boxShadow: selected
            ? '6px 6px 0 0 #EC4899, 0 0 0 3px rgba(236, 72, 153, 0.3)'
            : `6px 6px 0 0 ${colors.border}`,
        }}
      >
        {/* Content area */}
        <div className="flex-1 min-w-0 px-4 py-3">
          {/* Category badge */}
          {data.color === 'default' ? (
            <span
              className="inline-block text-xs font-semibold uppercase px-2 py-0.5 rounded mb-1"
              style={{
                backgroundColor: getBadge(data.promptType).color,
                color: 'white',
              }}
            >
              {getBadge(data.promptType).label}
            </span>
          ) : (
            <span className="inline-block text-xs font-bold uppercase mb-1 opacity-60">
              {getBadge(data.promptType).label}
            </span>
          )}
          {/* Term name */}
          <h4 className="text-sm font-bold text-gray-900 break-words">
            {data.term}
          </h4>
        </div>

        {/* Internal vertical divider */}
        <div
          className="w-px self-stretch"
          style={{ backgroundColor: '#d1d5db' }}
        />

        {/* Action icons - INSIDE the card */}
        <div className="flex flex-col items-center gap-0.5 px-1.5 py-2 nodrag nopan relative" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className="p-1 rounded hover:bg-black/10 text-gray-800 transition-colors"
          >
            <MoreVertical size={14} />
          </button>
          <button
            onClick={handleSettingsClick}
            className="p-1 rounded hover:bg-black/10 text-gray-800 transition-colors"
          >
            <Settings size={14} />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-50">
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          width: 12,
          height: 12,
          background: 'white',
          border: '2px solid #9ca3af',
          top: -6,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          width: 12,
          height: 12,
          background: 'white',
          border: '2px solid #9ca3af',
          bottom: -12,
        }}
      />
    </div>
  )
})
