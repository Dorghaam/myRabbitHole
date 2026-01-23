import { memo, useState, useRef, useEffect } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { MoreVertical, Settings, Trash2 } from 'lucide-react'
import { TopicNodeData } from '../../../types'
import { useConceptMapStore } from '../../../store/conceptMapStore'
import { getNodeColors } from '../../../config/colors'

type TopicNodeProps = NodeProps & {
  data: TopicNodeData
}

export const TopicNode = memo(function TopicNode({
  data,
  selected,
}: TopicNodeProps) {
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
    <div onClick={handleClick} className="relative">
      {/* Single unified card */}
      <div
        className="flex items-center rounded-2xl transition-all duration-150"
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${selected ? '#EC4899' : colors.border}`,
          boxShadow: selected
            ? '6px 6px 0 0 #EC4899, 0 0 0 3px rgba(236, 72, 153, 0.3)'
            : `6px 6px 0 0 ${colors.border}`,
        }}
      >
        {/* Topic text */}
        <div className="px-5 py-3">
          <h2 className="text-base font-bold text-gray-900 whitespace-nowrap">
            {data.topic}
          </h2>
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
            <MoreVertical size={16} />
          </button>
          <button
            onClick={handleSettingsClick}
            className="p-1 rounded hover:bg-black/10 text-gray-800 transition-colors"
          >
            <Settings size={16} />
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
          width: 14,
          height: 14,
          background: 'white',
          border: '2px solid #9ca3af',
          top: -7,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          width: 14,
          height: 14,
          background: 'white',
          border: '2px solid #9ca3af',
          bottom: -13,
        }}
      />
    </div>
  )
})
