import { memo, useState, useRef, useEffect } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { MoreVertical, Settings, Trash2, BookOpen } from 'lucide-react'
import { BookNodeData } from '../../../types'
import { useConceptMapStore } from '../../../store/conceptMapStore'
import { getNodeColors } from '../../../config/colors'

type BookNodeProps = NodeProps & {
  data: BookNodeData
}

export const BookNode = memo(function BookNode({
  data,
  selected,
}: BookNodeProps) {
  const { selectNode, openColorPicker, deleteNode } = useConceptMapStore()
  const [showMenu, setShowMenu] = useState(false)
  const [imgError, setImgError] = useState(false)
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
  const showCover = data.coverUrl && !imgError

  return (
    <div onClick={handleClick} className="relative">
      <div
        className="flex rounded-2xl transition-all duration-150"
        style={{
          backgroundColor: colors.bg,
          border: `2px solid ${selected ? '#EC4899' : colors.border}`,
          boxShadow: selected
            ? '6px 6px 0 0 #EC4899, 0 0 0 3px rgba(236, 72, 153, 0.3)'
            : `6px 6px 0 0 ${colors.border}`,
        }}
      >
        {/* Content area */}
        <div className="p-4 flex-1" style={{ width: '200px' }}>
          {/* Book cover */}
          {showCover ? (
            <div className="flex justify-center mb-3">
              <img
                src={data.coverUrl!}
                alt={`Cover of ${data.title}`}
                className="rounded-lg shadow-sm"
                style={{ height: '140px', objectFit: 'cover' }}
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div
              className="flex items-center justify-center mb-3 rounded-lg mx-auto"
              style={{
                height: '140px',
                width: '100px',
                backgroundColor: '#E5E7EB',
              }}
            >
              <BookOpen size={32} className="text-gray-400" />
            </div>
          )}

          {/* Badge */}
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className="inline-block text-xs font-semibold uppercase px-2 py-0.5 rounded"
              style={{
                backgroundColor: data.color === 'default' ? '#6366F1' : 'transparent',
                color: data.color === 'default' ? 'white' : colors.accent,
                fontWeight: data.color === 'default' ? 600 : 700,
                opacity: data.color === 'default' ? 1 : 0.6,
              }}
            >
              BOOK
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">
            {data.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-gray-500 mb-2">
            {data.author}
          </p>

          {/* Description */}
          <p className="text-xs text-gray-600 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Internal vertical divider */}
        <div
          className="w-px self-stretch"
          style={{ backgroundColor: '#d1d5db' }}
        />

        {/* Action icons column */}
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
