import { memo, useState, useRef, useEffect } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { MoreVertical, Settings, ExternalLink, Trash2 } from 'lucide-react'
import { WikipediaNodeData } from '../../../types'
import { useConceptMapStore } from '../../../store/conceptMapStore'
import { getNodeColors } from '../../../config/colors'

type WikipediaNodeProps = NodeProps & {
  data: WikipediaNodeData
}

export const WikipediaNode = memo(function WikipediaNode({
  data,
  selected,
}: WikipediaNodeProps) {
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(false)
    deleteNode(data.id)
  }

  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(data.pageUrl, '_blank', 'noopener,noreferrer')
  }

  const colors = getNodeColors(data.color)
  const truncatedExtract = data.extract.length > 200
    ? data.extract.slice(0, 200) + '...'
    : data.extract

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
        <div className="p-4 flex-1" style={{ width: '300px', maxWidth: '320px' }}>
          {/* Wikipedia header */}
          <div className="flex items-center gap-2 mb-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="flex-shrink-0"
            >
              <path
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm6.918 6h-3.215a14.5 14.5 0 0 0-1.286-3.682A8.026 8.026 0 0 1 18.918 8zM12 4.04c.727 1.058 1.3 2.222 1.685 3.46h-3.37C10.7 6.262 11.273 5.098 12 4.04zM4.26 14a7.9 7.9 0 0 1 0-4h3.562a15.2 15.2 0 0 0-.122 2c0 .682.045 1.35.122 2H4.26zm.822 2h3.215a14.5 14.5 0 0 0 1.286 3.682A8.026 8.026 0 0 1 5.082 16zM8.297 8H5.082a8.026 8.026 0 0 1 4.335-3.682A14.5 14.5 0 0 0 8.297 8zM12 19.96c-.727-1.058-1.3-2.222-1.685-3.46h3.37c-.385 1.238-.958 2.402-1.685 3.46zM14.34 14H9.66a13.2 13.2 0 0 1-.14-2c0-.685.05-1.355.14-2h4.68c.09.645.14 1.315.14 2s-.05 1.355-.14 2zm.243 5.682A14.5 14.5 0 0 0 15.868 16h3.215a8.026 8.026 0 0 1-4.5 3.682zM16.178 14a15.2 15.2 0 0 0 .122-2 15.2 15.2 0 0 0-.122-2h3.562a7.9 7.9 0 0 1 0 4h-3.562z"
                fill="#636363"
              />
            </svg>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Wikipedia
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-2">
            {data.title}
          </h3>

          {/* Extract */}
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            {truncatedExtract}
          </p>

          {/* Read More button */}
          <button
            onClick={handleReadMore}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-full font-medium text-sm border-2 border-blue-600 shadow-[0_3px_0_0_#1e40af] hover:shadow-[0_2px_0_0_#1e40af] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 nodrag"
          >
            <ExternalLink size={14} />
            Read More...
          </button>
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
