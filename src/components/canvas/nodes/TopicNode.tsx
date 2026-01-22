import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { MoreVertical, Settings } from 'lucide-react'
import { TopicNodeData } from '../../../types'
import { useConceptMapStore } from '../../../store/conceptMapStore'

type TopicNodeProps = NodeProps & {
  data: TopicNodeData
}

export const TopicNode = memo(function TopicNode({
  data,
  selected,
}: TopicNodeProps) {
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
        className="flex items-center rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#F7F9FC',
          border: `2px solid ${selected ? '#1e3a5f' : '#1e3a5f'}`,
          boxShadow: selected ? '0 0 0 2px rgba(30, 58, 95, 0.3)' : 'none',
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
        <div className="flex flex-col items-center gap-0.5 px-1.5 py-2">
          <button
            onClick={handleMenuClick}
            className="p-1 rounded hover:bg-gray-200 text-gray-400 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          <button
            onClick={handleSettingsClick}
            className="p-1 rounded hover:bg-gray-200 text-gray-400 transition-colors"
          >
            <Settings size={16} />
          </button>
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
          bottom: -7,
        }}
      />
    </div>
  )
})
