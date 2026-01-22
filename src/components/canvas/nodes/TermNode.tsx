import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { MoreVertical, Settings } from 'lucide-react'
import { TermNodeData } from '../../../types'
import { useConceptMapStore } from '../../../store/conceptMapStore'

type TermNodeProps = NodeProps & {
  data: TermNodeData
}

export const TermNode = memo(function TermNode({
  data,
  selected,
}: TermNodeProps) {
  const { selectNode, openColorPicker } = useConceptMapStore()

  const handleClick = () => {
    selectNode(data.id)
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectNode(data.id)
    openColorPicker()
  }

  return (
    <div onClick={handleClick} className="relative">
      {/* Single unified card */}
      <div
        className="flex items-stretch rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#F7F9FC',
          border: `2px solid ${selected ? '#1e3a5f' : '#1e3a5f'}`,
          boxShadow: selected ? '0 0 0 2px rgba(30, 58, 95, 0.3)' : 'none',
        }}
      >
        {/* Content area */}
        <div className="px-4 py-3">
          {/* Pink TERMS badge */}
          <span
            className="inline-block text-xs font-semibold uppercase px-2 py-0.5 rounded mb-1"
            style={{
              backgroundColor: '#EC4899',
              color: 'white',
            }}
          >
            TERMS
          </span>
          {/* Term name */}
          <h4 className="text-sm font-bold text-gray-900 whitespace-nowrap">
            {data.term}
          </h4>
        </div>

        {/* Internal vertical divider */}
        <div
          className="w-px self-stretch"
          style={{ backgroundColor: '#d1d5db' }}
        />

        {/* Action icons - INSIDE the card */}
        <div className="flex flex-col items-center gap-0.5 px-1.5 py-2">
          <button
            onClick={handleMenuClick}
            className="p-1 rounded hover:bg-gray-200 text-gray-400 transition-colors"
          >
            <MoreVertical size={14} />
          </button>
          <button
            onClick={handleSettingsClick}
            className="p-1 rounded hover:bg-gray-200 text-gray-400 transition-colors"
          >
            <Settings size={14} />
          </button>
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
          bottom: -6,
        }}
      />
    </div>
  )
})
