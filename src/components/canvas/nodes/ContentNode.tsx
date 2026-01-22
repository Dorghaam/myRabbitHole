import { memo, useState, useRef, useEffect } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { MoreVertical, Settings, ChevronDown, Trash2 } from 'lucide-react'
import { ContentNodeData } from '../../../types'
import { useConceptMapStore } from '../../../store/conceptMapStore'
import { getNodeColors } from '../../../config/colors'

type ContentNodeProps = NodeProps & {
  data: ContentNodeData
}

export const ContentNode = memo(function ContentNode({
  data,
  selected,
}: ContentNodeProps) {
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

  const handleClick = () => {
    selectNode(data.id)
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

  const handleCollapseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)
    deleteNode(data.id)
  }

  const colors = getNodeColors(data.color)

  return (
    <div onClick={handleClick} className="relative">
      {/* Single unified card with internal layout */}
      <div
        className="flex rounded-2xl overflow-hidden transition-all duration-150"
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${selected ? '#EC4899' : colors.border}`,
          boxShadow: selected
            ? '6px 6px 0 0 #EC4899, 0 0 0 3px rgba(236, 72, 153, 0.3)'
            : `6px 6px 0 0 ${colors.border}`,
        }}
      >
        {/* Content area - width adjusts based on content length */}
        <div
          className="p-4 flex-1"
          style={{
            width: data.content && data.content.length > 500 ? '300px' : '240px',
            maxWidth: '320px'
          }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            {data.title}
          </h3>
          <div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {data.content}
            </p>
          </div>
        </div>

        {/* Internal vertical divider */}
        <div
          className="w-px self-stretch"
          style={{ backgroundColor: '#d1d5db' }}
        />

        {/* Action icons column - INSIDE the card */}
        <div className="flex flex-col items-center justify-start gap-1 px-2 py-3 nodrag nopan relative" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className="p-1.5 rounded-lg hover:bg-black/10 text-gray-800 transition-colors"
          >
            <MoreVertical size={18} />
          </button>
          <button
            onClick={handleSettingsClick}
            className="p-1.5 rounded-lg hover:bg-black/10 text-gray-800 transition-colors"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={handleCollapseClick}
            className="p-1.5 rounded-lg hover:bg-black/10 text-gray-800 transition-colors"
          >
            <ChevronDown size={18} />
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

      {/* Connection handles - centered on border */}
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
