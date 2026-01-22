import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { TopicNodeData } from '../../../types'
import { getNodeColors } from '../../../config/colors'
import { useConceptMapStore } from '../../../store/conceptMapStore'

type TopicNodeProps = NodeProps & {
  data: TopicNodeData
}

export const TopicNode = memo(function TopicNode({
  data,
  selected,
}: TopicNodeProps) {
  const { selectNode } = useConceptMapStore()
  const colors = getNodeColors(data.color)

  const handleClick = () => {
    selectNode(data.id)
  }

  return (
    <div
      onClick={handleClick}
      className="relative"
      style={{ minWidth: '200px' }}
    >
      {/* Main node container */}
      <div
        className="px-6 py-4 rounded-xl shadow-md transition-all cursor-pointer"
        style={{
          backgroundColor: colors.bg,
          border: selected
            ? `2px solid ${colors.accent}`
            : `2px solid ${colors.border}`,
        }}
      >
        {/* Pink corner handles - decorative */}
        <div
          className="absolute top-0 left-0 w-2.5 h-2.5 rounded-tl-lg"
          style={{ backgroundColor: colors.accent }}
        />
        <div
          className="absolute top-0 right-0 w-2.5 h-2.5 rounded-tr-lg"
          style={{ backgroundColor: colors.accent }}
        />
        <div
          className="absolute bottom-0 left-0 w-2.5 h-2.5 rounded-bl-lg"
          style={{ backgroundColor: colors.accent }}
        />
        <div
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-br-lg"
          style={{ backgroundColor: colors.accent }}
        />

        {/* Topic text */}
        <h2 className="text-lg font-semibold text-text-primary text-center">
          {data.topic}
        </h2>
      </div>

      {/* Connection handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
      />
    </div>
  )
})
